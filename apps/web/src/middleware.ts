/**
 * Affiliate attribution middleware.
 *
 * On every public request:
 *  1. If `?ref=CODE` is present and CODE matches the format regex:
 *     - First-touch wins: if no `hieu_ref` cookie, set it (30d) and
 *       fire-and-forget /api/affiliate/track click.
 *     - If cookie already matches, just refresh TTL.
 *     - Strip `?ref=...` from the URL via 307 redirect (clean URL).
 *     - Set `x-affiliate-ref` response header so server components see it.
 *  2. If `?ref=` is invalid format, strip param but don't set cookie.
 *  3. If no `?ref=` but a valid `hieu_ref` cookie exists, refresh TTL.
 *
 * Skips `/api/*`, `/_next/*`, `/admin/*`, and static asset paths.
 * Surgical: does NOT touch reading/mentor/payment flows.
 */

import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = 'hieu_ref';
const COOKIE_TTL = 60 * 60 * 24 * 30; // 30 days
// Accept short codes (3-32 chars, alphanum + _ -). Broader than legacy uppercase
// scheme so we don't reject codes minted by the new affiliate worker.
const CODE_REGEX = /^[A-Za-z0-9_-]{3,32}$/;

// Wave 60.60.a — Marketing routes that need bf-cache. next-intl's
// `getRequestConfig` calls `cookies()` + `headers()` → Next.js auto-marks
// the page dynamic → Vercel injects `private, no-cache, no-store` which
// kills bf-cache. We override Cache-Control here AFTER page render so
// Lighthouse's `CacheControlNoStoreCookieModified` audit passes.
// `public, max-age=0, must-revalidate` → browser revalidates on every load
// but bf-cache can restore in-memory snapshot on back-nav (instant).
const MARKETING_ROUTES = new Set(['/', '/pricing', '/features']);
const MARKETING_CACHE_CONTROL = 'public, max-age=0, must-revalidate';

function applyMarketingCache(pathname: string, res: NextResponse): NextResponse {
  if (MARKETING_ROUTES.has(pathname)) {
    res.headers.set('Cache-Control', MARKETING_CACHE_CONTROL);
  }
  return res;
}

function cookieOpts() {
  return {
    httpOnly: false as const, // readable client-side for analytics/signup attach
    sameSite: 'lax' as const,
    secure: true,
    path: '/',
    maxAge: COOKIE_TTL,
  };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip excluded paths. The matcher already filters most of these but we
  // double-check here for safety (matcher patterns can drift).
  //
  // Wave 60.95.ao — also skip telemetry tunnel paths. `/monitoring` is the
  // Sentry tunnel (next.config.ts → withSentryConfig tunnelRoute). Vercel's
  // platform-side Web Analytics + Speed Insights proxy injects an opaque
  // per-project tunnel path (e.g. `/8f07c64b561fde03/{vitals,script.js}`) to
  // dodge ad-blockers; running middleware on the `sendBeacon` POST adds Edge
  // cold-start latency and causes `net::ERR_ABORTED` on slow connections,
  // losing CWV telemetry. Both paths are pure beacon endpoints — nothing
  // affiliate-attribution or marketing-cache related runs there.
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/monitoring') ||
    pathname.startsWith('/_vercel/') ||
    // Vercel auto-tunnel: 16-hex prefix → /vitals | /script.js | /event
    /^\/[0-9a-f]{16}\/(vitals|script\.js|event)/.test(pathname) ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Wave 60.60.a — Anonymous + no-ref fast path for marketing routes.
  // Avoids any cookie writes (which would trigger Vercel's
  // `private, no-cache, no-store`) and override Cache-Control so bf-cache works.
  if (MARKETING_ROUTES.has(pathname) && !req.nextUrl.searchParams.get('ref')) {
    const existing = req.cookies.get(COOKIE_NAME)?.value;
    if (!existing || !CODE_REGEX.test(existing)) {
      return applyMarketingCache(pathname, NextResponse.next());
    }
  }

  // Legacy slug — the Tỵ canh used to live at /tu-vi-hom-nay/ty2 to avoid
  // collision with /tu-vi-hom-nay/ty (Tý). It now lives at /tu-vi-hom-nay/ti.
  // 301 to preserve any inbound links (search, social shares).
  if (pathname === '/tu-vi-hom-nay/ty2') {
    const url = req.nextUrl.clone();
    url.pathname = '/tu-vi-hom-nay/ti';
    return NextResponse.redirect(url, 301);
  }

  // Wave 30 W-D — /r/<CODE> attribution. The page component used to call
  // cookies().set() during render which Next 15 forbids (warning swallowed).
  // Set-Cookie from middleware is the canonical way. First-touch wins.
  const refLandingMatch = pathname.match(/^\/r\/([A-Za-z0-9_-]{3,32})\/?$/);
  if (refLandingMatch && refLandingMatch[1]) {
    const code = refLandingMatch[1].toUpperCase();
    const existingRef = req.cookies.get(COOKIE_NAME)?.value;
    const res = NextResponse.next();
    if (!existingRef && CODE_REGEX.test(code)) {
      res.cookies.set(COOKIE_NAME, code, cookieOpts());
    } else if (existingRef && CODE_REGEX.test(existingRef)) {
      // Refresh TTL on the existing attribution so first-touch sticks.
      res.cookies.set(COOKIE_NAME, existingRef, cookieOpts());
    }
    return res;
  }

  const refRaw = req.nextUrl.searchParams.get('ref');
  const existing = req.cookies.get(COOKIE_NAME)?.value;

  // --- No ?ref= → pass through, refresh cookie if it's valid. ---
  // (Marketing routes without ?ref were already handled in the fast path
  // at the top; this branch covers non-marketing pages.)
  if (!refRaw) {
    if (existing && CODE_REGEX.test(existing)) {
      const res = NextResponse.next();
      res.cookies.set(COOKIE_NAME, existing, cookieOpts());
      return res;
    }
    return NextResponse.next();
  }

  const ref = refRaw.trim();

  // --- ?ref= invalid → strip param, no cookie. ---
  if (!CODE_REGEX.test(ref)) {
    const url = req.nextUrl.clone();
    url.searchParams.delete('ref');
    return NextResponse.redirect(url);
  }

  // --- ?ref= valid → clean URL via redirect. ---
  const cleanUrl = req.nextUrl.clone();
  cleanUrl.searchParams.delete('ref');
  const res = NextResponse.redirect(cleanUrl);
  res.headers.set('x-affiliate-ref', ref);

  if (existing === ref) {
    // Already attributed to this code — just refresh TTL.
    res.cookies.set(COOKIE_NAME, ref, cookieOpts());
    return res;
  }

  if (existing) {
    // First-touch wins — don't overwrite an existing attribution.
    // Still refresh existing cookie TTL so the original attribution sticks.
    res.cookies.set(COOKIE_NAME, existing, cookieOpts());
    return res;
  }

  // First click — set cookie and fire-and-forget click track.
  res.cookies.set(COOKIE_NAME, ref, cookieOpts());

  const origin = req.nextUrl.origin;
  fetch(`${origin}/api/affiliate/track`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ event: 'click', referral_code: ref }),
    keepalive: true,
  }).catch(() => {});

  return res;
}

// Run on every page request — skip API/_next/static/admin/files-with-extension.
// Wave 60.95.ao — also skip `/monitoring` (Sentry tunnel) and `/_vercel/*`
// (Vercel platform Analytics + Speed Insights). The Vercel platform also
// rewrites those to opaque per-project tunnel paths at the edge before the
// matcher runs in some deploys; the in-function regex guard above catches
// those. Skipping at the matcher level prevents the Edge worker from cold-
// starting for telemetry beacons (root cause of `vitals` net::ERR_ABORTED).
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|_vercel|monitoring|admin|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
