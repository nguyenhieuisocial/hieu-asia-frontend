/**
 * Wave 60.71.T2.sessions — shared formatters for /sessions list.
 */

/** vi-VN short date+time. */
export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

/** "5m", "2h", "3d" — falls back to "—" when missing. */
export function fmtRelative(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1) return 'vừa xong';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  } catch {
    return '';
  }
}

/** Duration in seconds → "1m 23s" / "45s" / "—". */
export function fmtDuration(sec: number | null | undefined): string {
  if (sec == null) return '—';
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

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
