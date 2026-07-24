/**
 * safeNextPath — sanitize a post-login `?next=` redirect target to a SAME-ORIGIN
 * path. Shared by every place that honors `next` (signin form, magic-link/OAuth
 * roundtrip, and the /auth/callback landing) so the guard lives in ONE place.
 *
 * Open-redirect fix: a bare `next.startsWith('/')` check is NOT enough. Two ways
 * an attacker sneaks a cross-origin target past a naive prefix check:
 *   1. Protocol-relative `//evil.com` and backslash `/\evil.com` — the browser
 *      resolves both to a DIFFERENT origin even though they start with `/`.
 *   2. Control chars — Next's router and the WHATWG URL parser STRIP raw
 *      tab/newline/CR from a redirect target BEFORE resolving it, so
 *      `/<TAB>//evil.com` collapses to a cross-origin `//evil.com`. The encoded
 *      form (`/%09//evil.com`) hides the same TAB behind percent-encoding.
 *
 * A legitimate same-origin path never contains a control char, so we reject any
 * `next` that carries one (raw OR percent-encoded) instead of stripping-and-
 * hoping. Returns the validated path, or `null` when `next` is missing/unsafe so
 * each caller can pick its own fallback (`/account`, `/`, or leave `next` off).
 */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next) return null;

  // Validate against the DECODED form when possible so percent-encoded control
  // chars (e.g. `%09` = TAB) can't smuggle a cross-origin target past the checks
  // below. If it can't be decoded (malformed `%`), validate the raw value as-is
  // rather than false-reject a legit path that happens to contain a bare `%`.
  let candidate = next;
  try {
    candidate = decodeURIComponent(next);
  } catch {
    /* malformed %-encoding — fall through with the raw string */
  }

  for (let i = 0; i < candidate.length; i++) {
    const code = candidate.charCodeAt(i);
    // Reject ALL C0 control chars (incl. TAB 0x09 / LF 0x0a / CR 0x0d) + DEL.
    if (code < 0x20 || code === 0x7f) return null;
  }

  if (!candidate.startsWith('/')) return null;
  // Protocol-relative (`//host`) and backslash (`/\host`) resolve cross-origin.
  if (candidate.startsWith('//') || candidate.startsWith('/\\')) return null;

  return candidate;
}
