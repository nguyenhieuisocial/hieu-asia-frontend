import { describe, expect, it } from 'vitest';
import { computeNetRevenue } from './net-revenue';

describe('computeNetRevenue', () => {
  it('subtracts refunds from gross per day and unions disjoint day sets', () => {
    const revenue = [
      { date: '2026-06-01', amount: 5_000_000 },
      { date: '2026-06-02', amount: 3_000_000 },
      { date: '2026-06-03', amount: 1_000_000 }, // no refund this day
    ];
    const refunds = [
      { date: '2026-06-02', amount: 200_000 },
      { date: '2026-06-04', amount: 500_000 }, // refund on a day with no gross
    ];
    const r = computeNetRevenue(revenue, refunds);

    expect(r.daily).toEqual([
      { date: '2026-06-01', gross: 5_000_000, refunds: 0, net: 5_000_000 },
      { date: '2026-06-02', gross: 3_000_000, refunds: 200_000, net: 2_800_000 },
      { date: '2026-06-03', gross: 1_000_000, refunds: 0, net: 1_000_000 },
      { date: '2026-06-04', gross: 0, refunds: 500_000, net: -500_000 },
    ]);
    expect(r.grossTotal).toBe(9_000_000);
    expect(r.refundsTotal).toBe(700_000);
    expect(r.netTotal).toBe(8_300_000);
  });

  it('allows net to go negative when refunds exceed gross on a day', () => {
    const r = computeNetRevenue(
      [{ date: '2026-06-10', amount: 100_000 }],
      [{ date: '2026-06-10', amount: 300_000 }],
    );
    expect(r.daily).toEqual([
      { date: '2026-06-10', gross: 100_000, refunds: 300_000, net: -200_000 },
    ]);
    expect(r.netTotal).toBe(-200_000);
  });

  it('slices a time suffix off the date key and merges same-day rows', () => {
    const r = computeNetRevenue(
      [
        { date: '2026-06-05T00:00:00Z', amount: 1_000 },
        { date: '2026-06-05', amount: 2_000 },
      ],
      [],
    );
    expect(r.daily).toEqual([{ date: '2026-06-05', gross: 3_000, refunds: 0, net: 3_000 }]);
    expect(r.netTotal).toBe(3_000);
  });

  it('returns all zeros (no NaN) for empty input', () => {
    const r = computeNetRevenue([], []);
    expect(r.daily).toEqual([]);
    expect(r.grossTotal).toBe(0);
    expect(r.refundsTotal).toBe(0);
    expect(r.netTotal).toBe(0);
    expect(Number.isNaN(r.netTotal)).toBe(false);
  });
});
