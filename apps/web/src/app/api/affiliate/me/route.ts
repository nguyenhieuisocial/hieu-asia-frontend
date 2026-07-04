/**
 * Server-side proxy: GET /api/affiliate/me
 * Forwards to api.hieu.asia/affiliate/me with affiliate id read from cookie.
 *
 * Auth model (lightweight — KV-only): we store the affiliate_id in a
 * httpOnly cookie at signup. Browser never sees the id directly.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HIEU_API_URL = process.env.HIEU_API_URL ?? 'https://api.hieu.asia';
const HIEU_API_SERVICE_TOKEN = process.env.HIEU_API_SERVICE_TOKEN;
const COOKIE_NAME = 'hieu_aff_id';

export async function GET(req: NextRequest) {
  const affId = req.cookies.get(COOKIE_NAME)?.value;
  if (!affId) {
    return NextResponse.json({ ok: false, error: 'not_signed_in' }, { status: 401 });
  }
  // The worker gates /affiliate/me behind isService() (Wave 30 IDOR hardening),
  // so this proxy MUST present the shared service token — same as /api/affiliate/track.
  // Without it the worker replies 401 "Service token required" and the dashboard
  // (which reads any 401 as "not signed in") wrongly shows "Bạn chưa đăng nhập".
  if (!HIEU_API_SERVICE_TOKEN) {
    return NextResponse.json({ ok: false, error: 'service_unavailable' }, { status: 503 });
  }
  try {
    const res = await fetch(`${HIEU_API_URL}/affiliate/me`, {
      method: 'GET',
      headers: { 'x-affiliate-id': affId, 'x-service-token': HIEU_API_SERVICE_TOKEN },
      cache: 'no-store',
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'content-type': res.headers.get('content-type') ?? 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'upstream_fetch_failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}

/** POST /api/affiliate/me — sets the cookie after successful signup.
 * The cookie now holds the worker-issued HMAC session token (not the raw id),
 * so it cannot be forged into another affiliate's session. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  // Prefer the signed `token`; fall back to `affiliate_id` for older callers.
  const value =
    typeof body?.token === 'string'
      ? body.token
      : typeof body?.affiliate_id === 'string'
        ? body.affiliate_id
        : null;
  if (!value) return NextResponse.json({ ok: false, error: 'token required' }, { status: 400 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return res;
}

/** DELETE /api/affiliate/me — sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
