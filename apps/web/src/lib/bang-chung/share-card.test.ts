import { describe, it, expect } from 'vitest';
import { deriveProofCard, firstParam, MAX_EVENTS } from './share-card';

describe('deriveProofCard — anti-overclaim guard for the share card', () => {
  it('accepts an internally-consistent result', () => {
    expect(deriveProofCard({ total: '5', hit: '3', strong: '2' })).toEqual({
      valid: true,
      hit: 3,
      total: 5,
      strong: 2,
    });
  });

  it('accepts a perfect match (hit === total, strong === hit)', () => {
    expect(deriveProofCard({ total: '4', hit: '4', strong: '4' })).toEqual({
      valid: true,
      hit: 4,
      total: 4,
      strong: 4,
    });
  });

  it('treats a missing strong as 0 (still valid)', () => {
    expect(deriveProofCard({ total: '3', hit: '2', strong: undefined })).toEqual({
      valid: true,
      hit: 2,
      total: 3,
      strong: 0,
    });
  });

  // --- the guard: a manipulated URL can never inflate the card ---

  it('clamps strong to 0 when strong > hit (cannot claim more right-domain hits than hits)', () => {
    expect(deriveProofCard({ total: '5', hit: '2', strong: '5' })).toEqual({
      valid: true,
      hit: 2,
      total: 5,
      strong: 0,
    });
  });

  it('rejects hit > total (cannot match more milestones than exist) → default card', () => {
    expect(deriveProofCard({ total: '3', hit: '7', strong: '0' })).toEqual({ valid: false });
  });

  it('rejects total above MAX_EVENTS → default card', () => {
    expect(deriveProofCard({ total: String(MAX_EVENTS + 1), hit: '1', strong: '0' })).toEqual({
      valid: false,
    });
  });

  it('rejects total = 0 → default card', () => {
    expect(deriveProofCard({ total: '0', hit: '0', strong: '0' })).toEqual({ valid: false });
  });

  it('rejects negative numbers → default card', () => {
    expect(deriveProofCard({ total: '5', hit: '-2', strong: '0' })).toEqual({ valid: false });
  });

  it('rejects non-integer / non-numeric input → default card', () => {
    expect(deriveProofCard({ total: '3.5', hit: '2', strong: '1' })).toEqual({ valid: false });
    expect(deriveProofCard({ total: 'abc', hit: '2', strong: '1' })).toEqual({ valid: false });
  });

  it('rejects a missing total → default card', () => {
    expect(deriveProofCard({ total: undefined, hit: '2', strong: '1' })).toEqual({ valid: false });
  });
});

describe('firstParam', () => {
  it('returns the value for a plain string', () => {
    expect(firstParam('3')).toBe('3');
  });
  it('returns the first element of an array', () => {
    expect(firstParam(['3', '4'])).toBe('3');
  });
  it('returns undefined for undefined', () => {
    expect(firstParam(undefined)).toBeUndefined();
  });
});
