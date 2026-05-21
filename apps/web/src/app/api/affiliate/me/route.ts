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
const COOKIE_NAME = 'hieu_aff_id';

export async function GET(req: NextRequest) {
  const affId = req.cookies.get(COOKIE_NAME)?.value;
  if (!affId) {
    return NextResponse.json({ ok: false, error: 'not_signed_in' }, { status: 401 });
  }
  try {
    const res = await fetch(`${HIEU_API_URL}/affiliate/me`, {
      method: 'GET',
      headers: { 'x-affiliate-id': affId },
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

/** POST /api/affiliate/me — sets the cookie after successful signup. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const id = typeof body?.affiliate_id === 'string' ? body.affiliate_id : null;
  if (!id) return NextResponse.json({ ok: false, error: 'affiliate_id required' }, { status: 400 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, id, {
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
