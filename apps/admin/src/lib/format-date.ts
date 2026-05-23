/**
 * Wave 52-C — Centralised date formatters for admin pages.
 *
 * Root cause of the "1/1/70" leak: KV / upstream sometimes returns `0`
 * (number) or `""` (empty string) for `updated_at` on prompts that have
 * never been overridden. `new Date(0)` is 1970-01-01 UTC and the old
 * `fmtDate` rendered that as "08:00 1/1/70 · 686 tháng trước". This
 * util normalises every "no value" shape to "—" / a friendly fallback.
 *
 * Use these helpers everywhere admin renders an updated_at / created_at
 * timestamp that may legitimately be missing.
 */

type DateInput = string | number | Date | null | undefined;

/**
 * Returns true when the input represents "no real timestamp":
 *   - null / undefined / empty string / "null" / "undefined"
 *   - 0 (epoch) — KV null sentinel
 *   - NaN
 *   - 1970-01-01 UTC ±1 day (paranoia: covers tz-shifted zeros)
 */
export function isMissingDate(ts: DateInput): boolean {
  if (ts === null || ts === undefined) return true;
  if (typeof ts === 'string') {
    const t = ts.trim();
    if (t === '' || t === 'null' || t === 'undefined') return true;
  }
  if (typeof ts === 'number' && ts === 0) return true;
  let d: Date;
  try {
    d = ts instanceof Date ? ts : new Date(ts);
  } catch {
    return true;
  }
  const ms = d.getTime();
  if (!Number.isFinite(ms)) return true;
  // Epoch ±1 day catches "0" stored across many timezones.
  if (ms <= 86_400_000) return true;
  return false;
}

/**
 * Format a timestamp for display, or return a placeholder when missing.
 * Default placeholder is "—". Pass `fallback` to customise (e.g. "Chưa override").
 */
export function formatDateOrEmpty(
  ts: DateInput,
  fallback: string = '—',
): string {
  if (isMissingDate(ts)) return fallback;
  try {
    return new Date(ts as string | number | Date).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return fallback;
  }
}

/**
 * Format a timestamp as a relative phrase ("3 ngày trước"), or "" when missing.
 * Returns "" rather than "—" so callers can render it inline next to an absolute
 * date without doubled placeholders.
 */
export function formatRelativeOrEmpty(ts: DateInput): string {
  if (isMissingDate(ts)) return '';
  try {
    const diff = Date.now() - new Date(ts as string | number | Date).getTime();
    if (!Number.isFinite(diff) || diff < 0) return '';
    const d = Math.floor(diff / 86_400_000);
    if (d < 1) {
      const h = Math.floor(diff / 3_600_000);
      if (h < 1) return 'vừa cập nhật';
      return `${h}h trước`;
    }
    if (d < 7) return `${d} ngày trước`;
    if (d < 30) return `${Math.floor(d / 7)} tuần trước`;
    if (d < 365) return `${Math.floor(d / 30)} tháng trước`;
    return `${Math.floor(d / 365)} năm trước`;
  } catch {
    return '';
  }
}
