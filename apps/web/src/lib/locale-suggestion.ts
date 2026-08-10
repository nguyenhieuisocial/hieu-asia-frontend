/**
 * Locale-suggestion helper — v1.
 *
 * Purely client-side (no cookies()/headers() in the render path — see the
 * big warning comment in i18n/request.ts for why that matters). Reads
 * `navigator.language` to decide whether to suggest the English page, and
 * remembers a dismissal in localStorage so we never ask twice.
 */

const STORAGE_KEY = 'hieu.locale-suggestion.dismissed';

/**
 * Vietnamese pathname → English counterpart. Only pages that actually HAVE
 * a real (hand-translated) English version belong here. Add an entry only
 * when the English page ships — an entry pointing at a non-existent page
 * would 404 the suggestion.
 */
export const EN_AVAILABLE_PAGES: Record<string, string> = {
  '/': '/en',
};

/** Returns the English counterpart for a pathname, or null if none exists yet. */
export function getEnglishCounterpart(pathname: string): string | null {
  return EN_AVAILABLE_PAGES[pathname] ?? null;
}

/** Has the visitor already dismissed the suggestion (any page, ever)? */
export function isDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Remember the dismissal — never ask again on this browser. */
export function dismiss(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // localStorage unavailable (private mode / quota) — fail silently,
    // banner will just show again next visit. Not worth blocking on.
  }
}

/**
 * True when the browser's language setting is NOT Vietnamese. Uses
 * `navigator.language` (the user's actual browser/OS setting — a real
 * language preference, unlike IP which only indicates physical location).
 */
export function prefersNonVietnamese(): boolean {
  if (typeof navigator === 'undefined' || !navigator.language) return false;
  return !navigator.language.toLowerCase().startsWith('vi');
}
