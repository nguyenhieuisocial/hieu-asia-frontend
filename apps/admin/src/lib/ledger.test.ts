import { describe, it, expect } from 'vitest';
import { buildLedger, type LedgerMovement } from './ledger';

const mv = (date: string, direction: 'in' | 'out', amountVnd: number, source: LedgerMovement['source'] = 'sepay'): LedgerMovement => ({
  date,
  source,
  kind: direction === 'in' ? 'Thanh toán' : 'Hoàn tiền',
  direction,
  amountVnd,
});

describe('buildLedger', () => {
  it('returns empty totals for no movements', () => {
    const r = buildLedger([]);
    expect(r.entries).toEqual([]);
    expect(r.daily).toEqual([]);
    expect(r.inTotal).toBe(0);
    expect(r.outTotal).toBe(0);
    expect(r.netTotal).toBe(0);
  });

  it('computes signed amounts + running balance ascending', () => {
    const r = buildLedger([
      mv('2026-06-20T10:00:00Z', 'in', 99000),
      mv('2026-06-21T10:00:00Z', 'out', 50000, 'refund'),
      mv('2026-06-22T10:00:00Z', 'in', 199000),
    ]);
    expect(r.entries.map((e) => e.runningBalanceVnd)).toEqual([99000, 49000, 248000]);
    expect(r.entries.map((e) => e.signedVnd)).toEqual([99000, -50000, 199000]);
    expect(r.inTotal).toBe(298000);
    expect(r.outTotal).toBe(50000);
    expect(r.netTotal).toBe(248000);
    // netTotal equals the last running balance.
    expect(r.netTotal).toBe(r.entries[r.entries.length - 1]!.runningBalanceVnd);
  });

  it('sorts ascending by timestamp and is stable for equal timestamps', () => {
    const r = buildLedger([
      mv('2026-06-22T10:00:00Z', 'in', 3),
      mv('2026-06-20T10:00:00Z', 'in', 1),
      mv('2026-06-20T10:00:00Z', 'in', 2), // same ts as previous → keeps input order
    ]);
    expect(r.entries.map((e) => e.amountVnd)).toEqual([1, 2, 3]);
  });

  it('rolls up per day, newest day first, in − out = net', () => {
    const r = buildLedger([
      mv('2026-06-20T08:00:00Z', 'in', 100000),
      mv('2026-06-20T18:00:00Z', 'out', 30000, 'affiliate_payout'),
      mv('2026-06-21T09:00:00Z', 'in', 50000),
    ]);
    expect(r.daily).toEqual([
      { date: '2026-06-21', inVnd: 50000, outVnd: 0, netVnd: 50000 },
      { date: '2026-06-20', inVnd: 100000, outVnd: 30000, netVnd: 70000 },
    ]);
  });

  it('handles a negative net day (refunds/payouts > revenue)', () => {
    const r = buildLedger([
      mv('2026-06-20T08:00:00Z', 'in', 50000),
      mv('2026-06-20T18:00:00Z', 'out', 99000, 'refund'),
    ]);
    expect(r.daily[0]!.netVnd).toBe(-49000);
    expect(r.netTotal).toBe(-49000);
  });

  it('normalizes bad amounts (NaN/negative → magnitude, no NaN) and skips bad dates', () => {
    const r = buildLedger([
      { date: '', source: 'sepay', kind: 'x', direction: 'in', amountVnd: 1000 }, // bad date → skipped
      { date: '2026-06-20T10:00:00Z', source: 'sepay', kind: 'x', direction: 'in', amountVnd: Number.NaN }, // → 0
      { date: '2026-06-20T11:00:00Z', source: 'refund', kind: 'x', direction: 'out', amountVnd: -5000 }, // → 5000 out
    ]);
    expect(r.entries).toHaveLength(2);
    expect(r.inTotal).toBe(0);
    expect(r.outTotal).toBe(5000);
    expect(Number.isNaN(r.netTotal)).toBe(false);
    expect(r.netTotal).toBe(-5000);
  });
});
