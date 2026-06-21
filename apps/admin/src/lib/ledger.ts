/**
 * Pure, side-effect-free "Sổ cái" (cash ledger) reducer.
 *
 * The admin has five money surfaces (/sepay, /payments, /analytics, /llm-spend,
 * /affiliates) but NONE shows every VND movement — inflows AND outflows —
 * interleaved chronologically with a running balance + day rollup. This reducer
 * unifies the VND cash sources the worker already exposes:
 *
 *   IN  (+): intent_paid           (revenue, KV txn:log)
 *   OUT (−): refund_completed      (refunds,  KV txn:log)
 *   OUT (−): affiliate payout paid (commission cash-out, Postgres affiliate_payouts)
 *
 * DELIBERATELY VND-only: LLM cost is USD (a different currency, often
 * unconfigured) — folding it in would distort the running cash balance, so it is
 * excluded and the UI links to /llm-spend instead (mirrors net-revenue.ts).
 *
 * Read-only: this never moves money. It is a consolidated VIEW of movements that
 * already happened, so a bad day (refunds/payouts > revenue) is legible at a
 * glance and reconcilable against /sepay.
 */

export type LedgerDirection = 'in' | 'out';

/** One normalized money movement, before running-balance computation. */
export interface LedgerMovement {
  date: string; // ISO timestamp of the movement
  source: 'sepay' | 'refund' | 'affiliate_payout';
  kind: string; // human label (e.g. "Thanh toán", "Hoàn tiền", "Chi hoa hồng")
  direction: LedgerDirection;
  amountVnd: number; // positive magnitude (always ≥ 0 after normalization)
  ref?: string; // intent_id / payout id / batch — for cross-linking
  who?: string; // user_id / affiliate_code — display only
}

export interface LedgerEntry extends LedgerMovement {
  signedVnd: number; // +amount for 'in', −amount for 'out'
  runningBalanceVnd: number; // cumulative balance AFTER this entry (oldest→newest)
}

export interface LedgerDay {
  date: string; // YYYY-MM-DD
  inVnd: number;
  outVnd: number;
  netVnd: number; // in − out
}

export interface LedgerResult {
  /** Ascending (oldest first) so runningBalance accumulates correctly. */
  entries: LedgerEntry[];
  daily: LedgerDay[]; // descending (newest day first) for display
  inTotal: number;
  outTotal: number;
  netTotal: number; // inTotal − outTotal (= last runningBalance)
}

function toDayKey(iso: string): string {
  return String(iso ?? '').slice(0, 10);
}

function safeAmount(n: unknown): number {
  const v = Number(n ?? 0);
  return Number.isFinite(v) ? Math.abs(v) : 0;
}

/**
 * Build a chronological ledger with running balance + per-day rollup from a flat
 * list of movements. Invalid dates/amounts are normalized (skipped/zeroed) so
 * the output never contains NaN. Stable: movements with equal timestamps keep
 * input order.
 */
export function buildLedger(movements: LedgerMovement[]): LedgerResult {
  const valid = movements.filter((m) => toDayKey(m.date).length === 10);

  // Ascending by timestamp; stable for equal timestamps (preserve input order).
  const sorted = valid
    .map((m, i) => ({ m, i }))
    .sort((a, b) => {
      const c = String(a.m.date).localeCompare(String(b.m.date));
      return c !== 0 ? c : a.i - b.i;
    })
    .map((x) => x.m);

  let running = 0;
  const entries: LedgerEntry[] = sorted.map((m) => {
    const amt = safeAmount(m.amountVnd);
    const signed = m.direction === 'in' ? amt : -amt;
    running += signed;
    return { ...m, amountVnd: amt, signedVnd: signed, runningBalanceVnd: running };
  });

  const byDay = new Map<string, { inVnd: number; outVnd: number }>();
  for (const e of entries) {
    const key = toDayKey(e.date);
    const cell = byDay.get(key) ?? { inVnd: 0, outVnd: 0 };
    if (e.direction === 'in') cell.inVnd += e.amountVnd;
    else cell.outVnd += e.amountVnd;
    byDay.set(key, cell);
  }

  const daily: LedgerDay[] = Array.from(byDay.entries())
    .map(([date, c]) => ({ date, inVnd: c.inVnd, outVnd: c.outVnd, netVnd: c.inVnd - c.outVnd }))
    .sort((a, b) => b.date.localeCompare(a.date)); // newest day first

  const inTotal = entries.reduce((s, e) => (e.direction === 'in' ? s + e.amountVnd : s), 0);
  const outTotal = entries.reduce((s, e) => (e.direction === 'out' ? s + e.amountVnd : s), 0);

  return { entries, daily, inTotal, outTotal, netTotal: inTotal - outTotal };
}
