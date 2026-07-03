/**
 * Wave 60.71.T2.sessions — shared formatters for /sessions list.
 *
 * fmtDateTime/fmtRelative/fmtDuration/fmtVnd giờ là re-export từ `@/lib/format`
 * (gom formatter 2026-07-03) — giữ tên cũ để call sites không đổi.
 */

export { fmtDateTime, fmtRelative, fmtDuration, fmtVnd } from '@/lib/format';

/**
 * Humanize a UUID-ish session_id. Vault 107 §5.6 spec — show first 8 chars
 * with a `…` ellipsis so the table doesn't blow up to 36 chars wide.
 *
 *   sess_a1b2c3d4-e5f6-…  →  sess_a1b2c3d4…
 *   sess_0042              →  sess_0042 (already short)
 */
export function humanizeSessionId(id: string): string {
  if (id.length <= 13) return id;
  // Strip dash chunks past the first 8 chars of the body
  const dashIdx = id.indexOf('-');
  if (dashIdx > 0 && dashIdx < id.length - 1) {
    return `${id.slice(0, dashIdx)}…`;
  }
  return `${id.slice(0, 13)}…`;
}

/**
 * ISO-3166-1 alpha-2 country code → flag emoji via regional indicator codepoints.
 * Returns empty string if code is malformed.
 */
export function countryFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return '';
  const cc = code.toUpperCase();
  const a = cc.charCodeAt(0);
  const b = cc.charCodeAt(1);
  if (a < 65 || a > 90 || b < 65 || b > 90) return '';
  return String.fromCodePoint(0x1f1e6 + (a - 65), 0x1f1e6 + (b - 65));
}
