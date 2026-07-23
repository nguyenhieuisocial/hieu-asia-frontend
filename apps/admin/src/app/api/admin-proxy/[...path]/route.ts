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
import { resolveLiveRole, decideEffectiveRole } from '@/lib/admin-user-store';

// Edge runtime — eliminates Vercel serverless cold-start (5-15s) which was
// the root cause of "signal is aborted without reason" in the admin UI.
// `decodeSession` uses pure-JS string ops; no Node-specific APIs in the
// hot path. ADMIN_VERCEL_TOKEN/HIEU_API_* env vars read at runtime from
// `process.env` work identically under Edge.
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';
const TOKEN = process.env.HIEU_API_ADMIN_TOKEN;

// Per-user role enforcement (mirrors ROLE_RANK in lib/auth-server.ts).
//
// WHY THIS EXISTS (Wave 64.x security fix): the backend `requireAdmin` only
// constant-time-compares the shared X-Admin-Token and never reads a per-user
// role; it treats X-Admin-Email as audit metadata only. This proxy injects that
// master token for EVERY authenticated session, so WITHOUT a gate here a
// `viewer` (intended read-only) could issue refunds, grant comped paid-reading
// access, reveal/rotate production secrets, retry paid pipelines, etc. Per-user
// authorization MUST happen in the proxy — there is no backend fallback.
//
// The classification tables + requiredRank live in `./_authz` so they are
// unit-testable (a Next route file may only export HTTP handlers). The
// invariant "money/PII endpoints must be classified" has been violated twice;
// _authz.test.ts now guards it in CI.
import { ROLE_RANK, requiredRank } from './_authz';

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
  // Instant revocation (2026-07-12 audit, step 3): the cookie's role is signed but
  // may be STALE — a demoted/deleted admin keeps it until the 7-day TTL. Since this
  // proxy injects the master token for every session, authorize off the LIVE role.
  // Mutations (non-GET) are `privileged`: they skip the cache AND fail closed when
  // the authority can't be confirmed, so neither the 15s cache window nor a gateway
  // slowdown lets a just-demoted admin e.g. POST a new owner account. Reads fall
  // back to the signed cookie role for availability. (decideEffectiveRole policy.)
  const privileged = method !== 'GET';
  const live = await resolveLiveRole(session.email, Date.now(), privileged);
  const decision = decideEffectiveRole(live, session.role, privileged);
  if ('deny' in decision) {
    return decision.deny === 'revoked'
      ? NextResponse.json({ ok: false, error: 'session_revoked' }, { status: 401 })
      : NextResponse.json({ ok: false, error: 'role_unverifiable' }, { status: 503 });
  }
  const effectiveRole = decision.role;
  const { path } = await ctx.params;
  const segments = path ?? [];
  // Block path traversal / injection: each segment must be a clean slug.
  // Rejects `..`, `.`, and anything outside [A-Za-z0-9_-] before building the URL.
  if (segments.some((seg) => !/^[A-Za-z0-9_-]+$/.test(seg))) {
    return NextResponse.json({ ok: false, error: 'invalid path' }, { status: 400 });
  }
  // Per-user role gate (see ROLE_RANK note above). Without this, role is decorative
  // for everything routed through the generic proxy.
  if (ROLE_RANK[effectiveRole] < requiredRank(method, segments)) {
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
