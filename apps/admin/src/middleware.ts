import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySession } from '@/lib/auth';

/**
 * Admin middleware — gate every route except /login and Next internals.
 *
 * V2 (2026-05-22): HMAC verifies the session cookie.
 *   - If cookie present + valid signature → allow through.
 *   - If cookie present + invalid (legacy unsigned, forged, expired secret) →
 *     CLEAR the cookie AND redirect to /login. This auto-recovers the
 *     "stale cookie lockout" that happened when ADMIN_COOKIE_SECRET rolled
 *     out: users with pre-HMAC cookies were silently bounced to 401 by
 *     admin-proxy AND saw a chrome-less layout (layout.tsx verifySession
 *     also returned null).
 *   - If no cookie → redirect to /login with `?next=`.
 *
 * Middleware runs on Edge runtime by default; verifySession uses Web Crypto.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never gate the login endpoint (matcher already excludes, but explicit
  // short-circuit defends against matcher regressions).
  if (pathname === '/api/admin/login' || pathname.startsWith('/api/admin/login/')) {
    return NextResponse.next();
  }

  const rawCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySession(rawCookie);
  const isLoginPage = pathname === '/login' || pathname.startsWith('/login/');

  // Cookie present BUT invalid → user is locked out (stale signature, forged,
  // or secret rotated). Clear cookie + bounce to /login. Never let them sit on
  // a chrome-less page wondering why everything is broken.
  if (rawCookie && !session) {
    const url = new URL('/login', request.url);
    if (!isLoginPage) url.searchParams.set('next', pathname);
    url.searchParams.set('reason', 'session_invalid');
    const res = NextResponse.redirect(url);
    res.cookies.set(ADMIN_SESSION_COOKIE, '', { maxAge: 0, path: '/' });
    return res;
  }

  // Already authenticated → block /login to avoid loops.
  if (isLoginPage) {
    if (session) {
      const next = request.nextUrl.searchParams.get('next');
      const target = next && next.startsWith('/') ? next : '/';
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Everything else needs a verified session.
  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals + static assets + login API (needs to be reachable
  // without session) + admin-proxy (does its own HMAC check at the route).
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|api/health|api/admin/login|api/admin/logout).*)',
  ],
};
