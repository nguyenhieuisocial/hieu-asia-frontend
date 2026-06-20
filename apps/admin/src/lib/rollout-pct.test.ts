import { describe, expect, it } from 'vitest';
import { clampRolloutPct } from './rollout-pct';

describe('clampRolloutPct', () => {
  it('passes through in-range integers', () => {
    expect(clampRolloutPct(0)).toBe(0);
    expect(clampRolloutPct(50)).toBe(50);
    expect(clampRolloutPct(100)).toBe(100);
  });

  it('clamps out-of-range values into [0, 100]', () => {
    expect(clampRolloutPct(-1)).toBe(0);
    expect(clampRolloutPct(-999)).toBe(0);
    expect(clampRolloutPct(101)).toBe(100);
    expect(clampRolloutPct(5000)).toBe(100);
  });

  it('rounds fractional input', () => {
    expect(clampRolloutPct(33.4)).toBe(33);
    expect(clampRolloutPct(33.6)).toBe(34);
  });

  it('falls back to 0 for non-finite input', () => {
    expect(clampRolloutPct(NaN)).toBe(0);
    expect(clampRolloutPct(Infinity)).toBe(0);
    expect(clampRolloutPct(-Infinity)).toBe(0);
  });
});
