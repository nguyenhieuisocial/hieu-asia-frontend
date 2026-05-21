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
  if (!TOKEN) {
    return NextResponse.json(
      { ok: false, error: 'HIEU_API_ADMIN_TOKEN not configured on the admin app' },
      { status: 503 },
    );
  }
  const { path } = await ctx.params;
  const subpath = (path ?? []).map(encodeURIComponent).join('/');
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
