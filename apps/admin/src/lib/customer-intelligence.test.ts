import { describe, it, expect } from 'vitest';
import { scoreCustomer, type CustomerScoreInput } from './customer-intelligence';

const NOW = Date.parse('2026-06-21T00:00:00.000Z');
const daysAgo = (n: number) => new Date(NOW - n * 86_400_000).toISOString();

const base: CustomerScoreInput = {
  plan: null,
  createdAt: daysAgo(200),
  lastActive: daysAgo(200),
  sessionCount: 0,
  totalSpendVnd: 0,
  nowMs: NOW,
};

describe('scoreCustomer — segments', () => {
  it('new: created <= 7 days ago', () => {
    expect(scoreCustomer({ ...base, createdAt: daysAgo(2), lastActive: daysAgo(1) }).segment).toBe('new');
  });
  it('active_paying: paid plan + active <= 14d', () => {
    const r = scoreCustomer({ ...base, plan: 'sub_monthly', createdAt: daysAgo(100), lastActive: daysAgo(3), sessionCount: 4, totalSpendVnd: 199000 });
    expect(r.segment).toBe('active_paying');
    expect(r.isPaying).toBe(true);
    expect(r.churnBand).toBe('low');
  });
  it('at_risk: paying but 14–60d inactive', () => {
    const r = scoreCustomer({ ...base, plan: 'premium', createdAt: daysAgo(100), lastActive: daysAgo(20), sessionCount: 2, totalSpendVnd: 99000 });
    expect(r.segment).toBe('at_risk');
    expect(r.nextBestMoments.some((m) => m.includes('lặng 20 ngày'))).toBe(true);
  });
  it('churned: paying but > 60d inactive', () => {
    expect(scoreCustomer({ ...base, plan: 'lifetime', createdAt: daysAgo(200), lastActive: daysAgo(90), totalSpendVnd: 4990000 }).segment).toBe('churned');
  });
  it('free_engaged: free, >=2 sessions, active <= 30d', () => {
    expect(scoreCustomer({ ...base, plan: 'free', createdAt: daysAgo(100), lastActive: daysAgo(10), sessionCount: 3 }).segment).toBe('free_engaged');
  });
  it('dormant: free, inactive/low engagement', () => {
    expect(scoreCustomer({ ...base, createdAt: daysAgo(200), lastActive: daysAgo(90), sessionCount: 1 }).segment).toBe('dormant');
  });
});

describe('scoreCustomer — health score', () => {
  it('recency 40 + frequency 30 + monetary 30 = 100 for an ideal customer', () => {
    const r = scoreCustomer({ ...base, plan: 'sub_yearly', createdAt: daysAgo(100), lastActive: daysAgo(2), sessionCount: 6, totalSpendVnd: 1990000 });
    expect(r.healthScore).toBe(100);
    expect(r.churnBand).toBe('low');
  });
  it('zero for a long-inactive no-spend no-session customer', () => {
    const r = scoreCustomer({ ...base, lastActive: daysAgo(120), sessionCount: 0, totalSpendVnd: 0 });
    expect(r.healthScore).toBe(0);
    expect(r.churnBand).toBe('high');
  });
  it('null lastActive → recency 0, no crash', () => {
    const r = scoreCustomer({ ...base, lastActive: null, createdAt: null, sessionCount: 1, totalSpendVnd: 0 });
    expect(r.daysSinceActive).toBeNull();
    expect(Number.isNaN(r.healthScore)).toBe(false);
    expect(r.healthScore).toBe(10); // frequency only
  });
});

describe('scoreCustomer — next-best-moments', () => {
  it('birthday within 7 days', () => {
    // NOW = 2026-06-21 → birthday 6/25 is in 4 days
    const r = scoreCustomer({ ...base, birthMonth: 6, birthDay: 25 });
    expect(r.nextBestMoments.some((m) => m.includes('Sinh nhật trong 4 ngày'))).toBe(true);
  });
  it('birthday today', () => {
    const r = scoreCustomer({ ...base, birthMonth: 6, birthDay: 21 });
    expect(r.nextBestMoments.some((m) => m.includes('hôm nay'))).toBe(true);
  });
  it('free-used-never-paid', () => {
    const r = scoreCustomer({ ...base, plan: 'free', createdAt: daysAgo(40), lastActive: daysAgo(20), sessionCount: 2, totalSpendVnd: 0 });
    expect(r.nextBestMoments.some((m) => m.includes('chưa mua'))).toBe(true);
  });
  it('no false birthday signal when month/day missing or far', () => {
    expect(scoreCustomer({ ...base }).nextBestMoments.some((m) => m.includes('Sinh nhật'))).toBe(false);
    expect(scoreCustomer({ ...base, birthMonth: 12, birthDay: 25 }).nextBestMoments.some((m) => m.includes('Sinh nhật'))).toBe(false);
  });
});
