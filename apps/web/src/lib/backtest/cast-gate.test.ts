import { describe, it, expect } from 'vitest';
import { castDelayMs, CAST_GAP_MS, awaitCastSlot } from './cast-gate';

describe('castDelayMs — shared cast spacing', () => {
  it('no wait when nothing has cast yet (lastCastAt = 0)', () => {
    expect(castDelayMs(1_000_000, 0)).toBe(0);
  });
  it('no wait when the last cast is older than the gap', () => {
    expect(castDelayMs(100_000, 100_000 - CAST_GAP_MS)).toBe(0);
    expect(castDelayMs(100_000, 100_000 - CAST_GAP_MS - 500)).toBe(0);
  });
  it('waits the remaining gap when a cast just happened', () => {
    expect(castDelayMs(100_000, 99_000)).toBe(CAST_GAP_MS - 1000);
    expect(castDelayMs(100_000, 100_000)).toBe(CAST_GAP_MS); // same instant → full gap
  });
  it('the gap keeps the combined rate at ≤4 casts / 10s', () => {
    // 4 casts spaced CAST_GAP_MS apart span ≥ 3*gap; the 5th would land past 10s.
    expect(3 * CAST_GAP_MS).toBeGreaterThan(7_500);
    expect(4 * CAST_GAP_MS).toBeGreaterThanOrEqual(10_000);
  });
});

describe('awaitCastSlot', () => {
  it('resolves (first call with a fresh clock has no prior cast → immediate)', async () => {
    await expect(awaitCastSlot(() => 1_000_000)).resolves.toBeUndefined();
  });
});
