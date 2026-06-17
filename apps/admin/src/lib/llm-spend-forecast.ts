/**
 * Pure month-end LLM cost forecast from the already-fetched daily series.
 *
 * Side-effect-free + injectable `now` so it can be unit-tested deterministically.
 * All date math is UTC — the worker's `day` strings are UTC date-truncated
 * ('YYYY-MM-DD', possibly with a time suffix), so we slice(0,10) before
 * comparing year+month.
 */

export interface ForecastResult {
  mtdCost: number;
  daysElapsed: number;
  daysInMonth: number;
  projected: number;
}

/** Days in the calendar month of `d` (UTC). */
function daysInUtcMonth(d: Date): number {
  // Day 0 of next month = last day of this month.
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
}

/**
 * Project this calendar month's total LLM cost by linearly extrapolating the
 * month-to-date spend across the full month.
 *
 *   projected = (mtdCost / daysElapsed) * daysInMonth
 *
 * Only daily rows whose `day` falls in the CURRENT calendar month (year+month
 * vs `now`) count toward mtdCost. Empty input → all zeros, no NaN.
 */
export function forecastMonthEndCost(
  dailyRows: Array<{ day: string; cost_usd: number }>,
  now: Date = new Date(),
): ForecastResult {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const ym = `${year}-${String(month + 1).padStart(2, '0')}`;

  const mtdCost = dailyRows.reduce((sum, row) => {
    const dayYm = String(row.day ?? '').slice(0, 7); // 'YYYY-MM'
    return dayYm === ym ? sum + Number(row.cost_usd ?? 0) : sum;
  }, 0);

  const daysElapsed = now.getUTCDate(); // 1..31
  const daysInMonth = daysInUtcMonth(now);
  const projected = daysElapsed > 0 ? (mtdCost / daysElapsed) * daysInMonth : 0;

  return { mtdCost, daysElapsed, daysInMonth, projected };
}
