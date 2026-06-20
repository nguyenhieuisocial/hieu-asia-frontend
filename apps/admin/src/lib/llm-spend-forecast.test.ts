import { describe, expect, it } from 'vitest';
import { forecastMonthEndCost } from './llm-spend-forecast';

describe('forecastMonthEndCost', () => {
  it('projects month-end cost linearly from MTD spend (day 10 of a 30-day month)', () => {
    // June 2026 has 30 days. Pin `now` to June 10 (UTC).
    const now = new Date(Date.UTC(2026, 5, 10, 12, 0, 0));
    const rows = [
      { day: '2026-06-01', cost_usd: 2 },
      { day: '2026-06-05', cost_usd: 3 },
      { day: '2026-06-09T00:00:00Z', cost_usd: 5 }, // time suffix → sliced to date
      { day: '2026-05-31', cost_usd: 100 }, // out of month → excluded
      { day: '2026-07-01', cost_usd: 50 }, // out of month → excluded
    ];
    const r = forecastMonthEndCost(rows, now);
    expect(r.mtdCost).toBe(10); // 2 + 3 + 5, May/July excluded
    expect(r.daysElapsed).toBe(10);
    expect(r.daysInMonth).toBe(30);
    expect(r.projected).toBeCloseTo((10 / 10) * 30, 10); // = 30
  });

  it('uses the correct days-in-month for a 31-day month', () => {
    // January 2026 has 31 days. Day 4.
    const now = new Date(Date.UTC(2026, 0, 4, 6, 0, 0));
    const rows = [{ day: '2026-01-01', cost_usd: 8 }];
    const r = forecastMonthEndCost(rows, now);
    expect(r.daysInMonth).toBe(31);
    expect(r.daysElapsed).toBe(4);
    expect(r.mtdCost).toBe(8);
    expect(r.projected).toBeCloseTo((8 / 4) * 31, 10); // = 62
  });

  it('returns all zeros (no NaN) for an empty series', () => {
    const now = new Date(Date.UTC(2026, 5, 10));
    const r = forecastMonthEndCost([], now);
    expect(r.mtdCost).toBe(0);
    expect(r.projected).toBe(0);
    expect(Number.isNaN(r.projected)).toBe(false);
    expect(r.daysElapsed).toBe(10);
    expect(r.daysInMonth).toBe(30);
  });
});
