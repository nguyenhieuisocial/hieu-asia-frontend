/**
 * Affiliate attribution middleware.
 *
 * On every request, if `?ref=CODE` is present and no `hieu_ref` cookie is set
 * (first-touch wins), we:
 *   1. Set `hieu_ref=CODE` cookie (30 days)
 *   2. Fire-and-forget call to /api/affiliate/track with event=click
 *
 * Surgical: does NOT touch any reading / mentor / payment flows.
 */

import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'hieu_ref';
const COOKIE_TTL = 60 * 60 * 24 * 30; // 30 days
const CODE_REGEX = /^[A-Z2-9]{6,16}$/;

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const ref = url.searchParams.get('ref');
  if (!ref || !CODE_REGEX.test(ref)) return NextResponse.next();

  // First-touch wins — don't overwrite an existing attribution.
  const existing = req.cookies.get(COOKIE_NAME)?.value;
  if (existing) return NextResponse.next();

  const res = NextResponse.next();
  res.cookies.set(COOKIE_NAME, ref, {
    httpOnly: false, // readable client-side so signup flow can attach
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: COOKIE_TTL,
  });

  // Fire-and-forget click track. We don't await — the user's request continues
  // immediately. Failure is non-fatal (the cookie carries the attribution).
  const origin = req.nextUrl.origin;
  fetch(`${origin}/api/affiliate/track`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ event: 'click', referral_code: ref }),
    keepalive: true,
  }).catch(() => {});

  return res;
}

// Run on every page request — skip API/_next/static.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
