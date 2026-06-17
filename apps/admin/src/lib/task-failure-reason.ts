/**
 * Pure helpers for the /tasks failure-reason breakdown.
 *
 * The worker encodes a task failure's category INSIDE the status string —
 * there is no separate `error_class` column. Failures look like:
 *   'error_at_vision_agent' | 'error_at_qdrant' | 'error_internal'
 * These functions extract a short reason label and group/count failed rows.
 * Kept side-effect-free so they can be unit-tested in isolation.
 */

/**
 * Map a raw status string → a short failure-reason label.
 *
 *   'error_at_vision_agent' → 'vision_agent'
 *   'error_at_qdrant'       → 'qdrant'
 *   'error_internal'        → 'internal'
 *   anything 'error_at_<x>' → '<x>'
 *   any other 'error'-ish   → 'other'
 *   non-error statuses      → ''   (caller filters these out)
 */
export function deriveFailureReason(status: string): string {
  const s = String(status ?? '');
  if (s === 'error_internal') return 'internal';
  if (s.startsWith('error_at_')) return s.slice('error_at_'.length);
  if (s.includes('error')) return 'other';
  return '';
}

/**
 * Group failed rows by derived reason, counted, sorted desc by count.
 * Non-error rows (deriveFailureReason === '') are filtered out.
 */
export function groupFailureReasons(
  rows: Array<{ status: string }>,
): Array<{ reason: string; count: number }> {
  const byReason = new Map<string, number>();
  for (const row of rows) {
    const reason = deriveFailureReason(row.status);
    if (!reason) continue;
    byReason.set(reason, (byReason.get(reason) ?? 0) + 1);
  }
  return Array.from(byReason.entries())
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count);
}
