/**
 * Pure "tiền thực thu" (net revenue) computation from the two daily series the
 * analytics endpoint already returns: gross revenue (intent_paid) and refunds
 * (refund_completed). Net = gross − refunds, bucketed per day and summed.
 *
 * Side-effect-free so it can be unit-tested deterministically. We DELIBERATELY
 * do NOT subtract LLM cost here: that figure comes from Langfuse (vendor_cost),
 * is frequently unconfigured, and is not bucketed by the same day key — folding
 * an unreliable/absent series in would silently distort net. The UI labels what
 * net includes (doanh thu − hoàn tiền) so the number is honest.
 */

export interface NetRevenueDay {
  date: string; // YYYY-MM-DD
  gross: number; // tổng intent_paid trong ngày
  refunds: number; // tổng refund_completed trong ngày
  net: number; // gross − refunds (có thể âm nếu hoàn > thu trong ngày)
}

export interface NetRevenueResult {
  daily: NetRevenueDay[];
  grossTotal: number;
  refundsTotal: number;
  netTotal: number;
}

/**
 * Merge the gross-revenue and refund daily series into a per-day net series.
 *
 * The two inputs may cover different day sets (e.g. a day with revenue but no
 * refunds appears only in `revenueDaily`). We union the dates, default missing
 * cells to 0, and sort ascending. Empty inputs → all zeros, no NaN.
 */
export function computeNetRevenue(
  revenueDaily: Array<{ date: string; amount: number }>,
  refundDaily: Array<{ date: string; amount: number }>,
): NetRevenueResult {
  const grossByDay = new Map<string, number>();
  const refundsByDay = new Map<string, number>();

  for (const r of revenueDaily) {
    const key = String(r.date ?? '').slice(0, 10);
    if (!key) continue;
    grossByDay.set(key, (grossByDay.get(key) ?? 0) + Number(r.amount ?? 0));
  }
  for (const r of refundDaily) {
    const key = String(r.date ?? '').slice(0, 10);
    if (!key) continue;
    refundsByDay.set(key, (refundsByDay.get(key) ?? 0) + Number(r.amount ?? 0));
  }

  const allDates = new Set<string>([...grossByDay.keys(), ...refundsByDay.keys()]);
  const daily: NetRevenueDay[] = Array.from(allDates)
    .sort((a, b) => a.localeCompare(b))
    .map((date) => {
      const gross = grossByDay.get(date) ?? 0;
      const refunds = refundsByDay.get(date) ?? 0;
      return { date, gross, refunds, net: gross - refunds };
    });

  const grossTotal = daily.reduce((s, d) => s + d.gross, 0);
  const refundsTotal = daily.reduce((s, d) => s + d.refunds, 0);

  return {
    daily,
    grossTotal,
    refundsTotal,
    netTotal: grossTotal - refundsTotal,
  };
}
