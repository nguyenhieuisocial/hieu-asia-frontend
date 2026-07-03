/**
 * Single source of truth for site-wide SEO/GEO constants.
 *
 * Today the canonical Organization/WebSite values + `BASE_URL` are duplicated
 * inline across ~37 pages (JSON-LD drift). This module centralizes them so the
 * `jsonld` builders and any page can share one definition. Adoption across
 * existing pages is a follow-up refactor (gated on the concurrent wave-64 sweep
 * which is currently touching most content pages + layout.tsx).
 */

export const BASE_URL = 'https://hieu.asia';
export const SITE_NAME = 'hieu.asia';
export const SITE_LOCALE = 'vi-VN';

/**
 * Canonical brand description (machine-readable). Mirrors the positioning in
 * `public/llms.txt`: a reflective framework, explicitly NOT fortune-telling.
 * Keeping it here stops AI engines from mislabelling hieu.asia as "bói toán".
 */
export const ORG_DESCRIPTION =
  'Nền tảng AI personal-insight tiếng Việt: Tử Vi, Bát Tự, Thần Số học, MBTI, Lịch Vạn Niên, Hợp Tuổi. Framework gợi mở góc nhìn để hiểu mình và ra quyết định — không bói toán, không tiên tri, không định mệnh hoá.';

/** Default Open Graph / fallback image (already shipped in /public). */
export const OG_DEFAULT = '/og-image.jpg';

/**
 * Default Open Graph `images` array. Pages that declare their own `openGraph`
 * block OVERRIDE (not merge) the root-layout default, so they silently lose the
 * share image. Reference this in such pages' `openGraph.images` to keep the
 * brand preview on social shares.
 */
export const OG_DEFAULT_IMAGES = [
  { url: OG_DEFAULT, width: 1200, height: 630, alt: SITE_NAME },
];

/**
 * Logo for Organization.logo (ImageObject). TODO(product): replace with a
 * dedicated square logo asset (>=112x112) once available; using the existing
 * OG image keeps the schema valid in the meantime.
 */
export const LOGO_PATH = OG_DEFAULT;

/**
 * Official profiles for Organization.sameAs (Knowledge Panel / entity signal).
 * Only list profiles that actually exist and are linked from the site (the
 * footer links Telegram + Facebook). TODO(product): add TikTok / YouTube /
 * LinkedIn when those profiles are confirmed live.
 */
export const SOCIAL_LINKS: string[] = [
  'https://t.me/hieuasiabot',
  'https://facebook.com/hieu.asia',
];

export const CONTACT_EMAIL = 'hi@hieu.asia';

/** Stable @id anchors so JSON-LD nodes can reference each other in a @graph. */
export const ORG_ID = `${BASE_URL}/#organization`;
export const WEBSITE_ID = `${BASE_URL}/#website`;

/** Resolve a site-relative path to an absolute URL (for JSON-LD url fields). */
export function abs(pathname: string): string {
  if (/^https?:\/\//.test(pathname)) return pathname;
  return `${BASE_URL}${pathname.startsWith('/') ? '' : '/'}${pathname}`;
}
