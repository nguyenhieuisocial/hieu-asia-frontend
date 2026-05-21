/**
 * Affiliate referral cookie/header readers.
 *
 * The `hieu_ref` cookie is set by `apps/web/src/middleware.ts` on the first
 * visit carrying a `?ref=CODE` query param. It's first-party, non-httpOnly so
 * client-side analytics can pick it up. The middleware also mirrors the code
 * onto the `x-affiliate-ref` response header for server components to read.
 */

const REF_PATTERN = /^[A-Za-z0-9_-]{3,32}$/;

/** Read the `hieu_ref` cookie set by middleware. Client-side only. */
export function readAffiliateRef(): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|;\s*)hieu_ref=([A-Za-z0-9_-]{3,32})/);
  return m && m[1] ? m[1] : null;
}

/** Server-side: pull from header set by middleware (server components only). */
export function readAffiliateRefFromHeaders(headers: Headers): string | null {
  const v = headers.get('x-affiliate-ref');
  return v && REF_PATTERN.test(v) ? v : null;
}
