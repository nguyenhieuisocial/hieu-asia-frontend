import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifySession, safeNextPath } from '@/lib/auth';
import { resolveLiveRole } from '@/lib/admin-user-store';

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

  // Instant revocation (2026-07-12 audit, step 3): a validly-signed cookie whose
  // admin was demoted-away/deleted is treated as invalid, so they are bounced to
  // /login instead of loading a shell they can no longer use. `unknown` (authority
  // unreachable) keeps the session to preserve availability during a Worker outage.
  const revoked = session
    ? (await resolveLiveRole(session.email)).status === 'revoked'
    : false;
  const validSession = session && !revoked;

  const isLoginPage = pathname === '/login' || pathname.startsWith('/login/');
  // API routes must NEVER get an HTML redirect — fetch() callers parse the
  // response as JSON, and an HTML login page leaks as `Unexpected token '<',
  // "<!DOCTYPE "...` (P0 reported 2026-05-22 on /users add-user POST).
  // For these paths we return JSON 401 and let the client redirect via UI.
  const isApi = pathname.startsWith('/api/');

  // Cookie present BUT invalid → user is locked out (stale signature, forged,
  // or secret rotated). Clear cookie + (for HTML) bounce to /login, or (for
  // API) return JSON 401. Never let them sit on a chrome-less page wondering
  // why everything is broken, and never feed HTML to a JSON parser.
  if (rawCookie && !validSession) {
    const reason = revoked ? 'session_revoked' : 'session_invalid';
    if (isApi) {
      const res = NextResponse.json(
        { ok: false, error: reason },
        { status: 401 },
      );
      res.cookies.set(ADMIN_SESSION_COOKIE, '', { maxAge: 0, path: '/' });
      return res;
    }
    const url = new URL('/login', request.url);
    if (!isLoginPage) url.searchParams.set('next', pathname);
    url.searchParams.set('reason', reason);
    const res = NextResponse.redirect(url);
    res.cookies.set(ADMIN_SESSION_COOKIE, '', { maxAge: 0, path: '/' });
    return res;
  }

  // Already authenticated → block /login to avoid loops.
  if (isLoginPage) {
    if (validSession) {
      const target = safeNextPath(request.nextUrl.searchParams.get('next'));
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Everything else needs a verified session.
  if (!validSession) {
    if (isApi) {
      return NextResponse.json(
        { ok: false, error: 'unauthenticated' },
        { status: 401 },
      );
    }
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals + static assets + login API (needs to be reachable
  // without session) + admin-proxy (does its own HMAC check at the route).
  //
  // Wave 57.4.2 addition: PWA manifest + brand assets (favicon-32, icon-192/512,
  // icon-maskable-*, apple-icon, og-image) MUST be reachable without auth
  // so browsers can fetch them for tab favicon, "Add to Home Screen", and
  // social share unfurl. The original matcher only excluded `favicon.ico`
  // + `icon` route prefix — missed manifest.webmanifest + new static PNGs
  // → all returned 307 to /login.
  matcher: [
    '/((?!_next/static|_next/image|favicon|icon|apple-icon|manifest|og-|robots|sitemap|api/health|api/admin/login|api/admin/logout).*)',
  ],
};
