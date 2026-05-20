import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth';

/**
 * Admin middleware — gate every route except /login and Next internals.
 *
 * V1: just checks cookie presence. Allow-list check happens at /login
 * (cookie isn't set unless email matched). For V2: verify a signed JWT.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Belt + suspenders: never gate the login endpoint (matcher already excludes,
  // but in case the regex changes or caches stale, explicit short-circuit here).
  if (pathname === '/api/admin/login' || pathname.startsWith('/api/admin/login/')) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  // Already logged in — block /login to avoid loops.
  if (pathname.startsWith('/login')) {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Everything else needs a session.
  if (!session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals + static assets + login API (needs to be reachable without session).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|api/admin/login).*)'],
};
