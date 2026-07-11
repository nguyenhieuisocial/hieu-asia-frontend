/**
 * Generic admin proxy → forwards `/api/admin-proxy/<path>` to the Worker
 * `/<path>` with `X-Admin-Token` from server env. Used by `src/lib/admin-api.ts`
 * so the browser never sees the shared admin token.
 *
 * Gate: requires a HMAC-VERIFIED admin session cookie (via `verifySession`).
 * Without it, returns 401. Defence-in-depth on top of middleware which only
 * checks cookie *presence*. Sub-agent F (2026-05-21) verified a forged cookie
 * `attacker@evil.com:owner` previously bypassed this gate — the switch from
 * `decodeSession` to `verifySession` closes that hole when ADMIN_COOKIE_SECRET
 * is set.
 *
 * The path segments after `/api/admin-proxy/` are forwarded verbatim, plus the
 * query string. Methods: GET, POST, PATCH, DELETE.
 */
import { type NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySession } from '@/lib/auth';

// Edge runtime — eliminates Vercel serverless cold-start (5-15s) which was
// the root cause of "signal is aborted without reason" in the admin UI.
// `decodeSession` uses pure-JS string ops; no Node-specific APIs in the
// hot path. ADMIN_VERCEL_TOKEN/HIEU_API_* env vars read at runtime from
// `process.env` work identically under Edge.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

// Per-user role enforcement (mirrors ROLE_RANK in lib/auth-server.ts; redefined
// inline so the edge proxy doesn't pull in `cookies()`/sbServer from that module).
//
// WHY THIS EXISTS (Wave 64.x security fix): the backend `requireAdmin` only
// constant-time-compares the shared X-Admin-Token and never reads a per-user
// role; it treats X-Admin-Email as audit metadata only. This proxy injects that
// master token for EVERY authenticated session, so WITHOUT a gate here a
// `viewer` (intended read-only) could issue refunds, grant comped paid-reading
// access, reveal/rotate production secrets, retry paid pipelines, etc. Per-user
// authorization MUST happen in the proxy — there is no backend fallback.
const ROLE_RANK = { viewer: 0, admin: 1, owner: 2 } as const;

// Backend path prefixes that require OWNER for EVERY method (read included).
// This list MUST mirror every dedicated apps/admin/src/app/api/admin/**/route.ts
// that calls requireAdminSession('owner'); the Worker is role-blind so this
// proxy is the only per-user authz point, and any owner path missing here is
// reachable at mere ADMIN rank through /api/admin-proxy/<path> (e.g. before
// this fix, POST admin/users {role:'owner'} was an admin→owner self-escalation).
// Each entry matches the exact path OR any deeper sub-path (segment-boundary
// safe — 'admin/users' matches 'admin/users' and 'admin/users/set-plan' but
// NOT 'admin/usersX').
const OWNER_PATH_PREFIXES = [
  'admin/secrets',              // production secrets (read or write)
  'admin/users',                // admin-user CRUD (role=owner self-escalation) + end-user plan comp (admin/users/set-plan)
  'admin/ledger/journal',       // manual journal entry + journal/void (accounting integrity)
  'admin/ledger/close',         // period close / trial-balance snapshot
  'ai/keys',                    // provider API keys (Anthropic/OpenAI/Google) — production secrets
  'admin/sepay/refund',         // SePay money movement
  'admin/sepay/reconcile',      // SePay money reconcile
  'admin/sepay/drift/fix',      // SePay drift correction (money)
  'admin/infra/supabase/rows',  // raw table rows (PII); table-stats GET at admin/infra/supabase stays viewer
] as const;

/** True when `path` equals `prefix` or is a sub-path of it (respects '/' boundaries). */
function underPrefix(path: string, prefix: string): boolean {
  return path === prefix || path.startsWith(prefix + '/');
}

/**
 * Minimum role required to forward a given request.
 *   - GET (read)                     → viewer  (dashboards stay readable)
 *   - mutations (POST/PATCH/DELETE)  → admin
 *   - OWNER_PATH_PREFIXES (any method), comped paid-access grants, and
 *     destructive settings writes    → owner
 */
function requiredRank(method: string, segments: string[]): number {
  const path = segments.join('/');
  // Owner-only surfaces (all methods): secrets, admin-user mgmt, money, keys, PII.
  if (OWNER_PATH_PREFIXES.some((p) => underPrefix(path, p))) return ROLE_RANK.owner;
  // Comped paid-access grants: admin/sessions/:id/access → owner.
  if (segments[0] === 'admin' && segments[1] === 'sessions' && segments[3] === 'access') {
    return ROLE_RANK.owner;
  }
  // Settings WRITES are owner-only; reads (GET) stay viewer. Loosening a
  // retention window or alert threshold silences production signal. Mirrors the
  // dedicated /api/admin/settings/{retention,alert-thresholds} owner gates.
  if (
    method !== 'GET' &&
    (path === 'admin/settings/alert-thresholds' || path === 'admin/settings/retention')
  ) {
    return ROLE_RANK.owner;
  }
  // Default: reads open to viewer; any write needs admin.
  return method === 'GET' ? ROLE_RANK.viewer : ROLE_RANK.admin;
}

async function forward(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
) {
  // Gate on admin session cookie (middleware already redirects unauth users,
  // but defence-in-depth — never let an anon hit /admin/* via this proxy).
  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySession(cookie);
  if (!session) {
    return NextResponse.json({ ok: false, error: 'unauthenticated' }, { status: 401 });
  }
  const { path } = await ctx.params;
  const segments = path ?? [];
  // Block path traversal / injection: each segment must be a clean slug.
  // Rejects `..`, `.`, and anything outside [A-Za-z0-9_-] before building the URL.
  if (segments.some((seg) => !/^[A-Za-z0-9_-]+$/.test(seg))) {
    return NextResponse.json({ ok: false, error: 'invalid path' }, { status: 400 });
  }
  // Per-user role gate (see ROLE_RANK note above). Without this, role is decorative
  // for everything routed through the generic proxy.
  if (ROLE_RANK[session.role] < requiredRank(method, segments)) {
    return NextResponse.json(
      { ok: false, error: 'forbidden: insufficient role for this action' },
      { status: 403 },
    );
  }
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const subpath = segments.map(encodeURIComponent).join('/');
  const url = new URL(req.url);
  const target = `${GATEWAY}/${subpath}${url.search}`;
  const body = method === 'GET' || method === 'DELETE' ? undefined : await req.text();
  try {
    const r = await fetch(target, {
      method,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': TOKEN,
        'X-Admin-Email': session.email,
      },
      body,
    });
    // Pass through JSON or text; preserve status.
    const ct = r.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      const data = await r.json();
      return NextResponse.json(data, { status: r.status });
    }
    const text = await r.text();
    return new NextResponse(text, {
      status: r.status,
      headers: { 'Content-Type': ct || 'text/plain' },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `gateway unreachable: ${(err as Error).message}` },
      { status: 502 },
    );
  }
}

export const GET = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  forward(req, ctx, 'GET');
export const POST = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  forward(req, ctx, 'POST');
export const PATCH = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  forward(req, ctx, 'PATCH');
export const DELETE = (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) =>
  forward(req, ctx, 'DELETE');
