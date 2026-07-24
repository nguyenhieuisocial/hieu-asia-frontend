import { describe, it, expect } from 'vitest';
import { safeNextPath } from './safe-next';

describe('safeNextPath (post-login open-redirect guard)', () => {
  it('passes through a normal same-origin path', () => {
    expect(safeNextPath('/account')).toBe('/account');
    expect(safeNextPath('/partner?tab=paid')).toBe('/partner?tab=paid');
    expect(safeNextPath('/reading/123')).toBe('/reading/123');
    // A bare "/" is a legitimate same-origin target, not a reject.
    expect(safeNextPath('/')).toBe('/');
  });

  it('returns null for missing / nullish input', () => {
    expect(safeNextPath('')).toBeNull();
    expect(safeNextPath(null)).toBeNull();
    expect(safeNextPath(undefined)).toBeNull();
  });

  it('blocks protocol-relative, backslash and absolute cross-origin targets', () => {
    expect(safeNextPath('//evil.com')).toBeNull();
    expect(safeNextPath('/\\evil.com')).toBeNull();
    expect(safeNextPath('https://evil.com')).toBeNull();
    expect(safeNextPath('http://evil.com')).toBeNull();
  });

  // --- Regression: the exact bug this branch fixes ---------------------------
  // Before the fix the guard only rejected `//` and `/\`, but NOT tab/newline/CR.
  // Next's router / the URL parser strip those control chars, so `/<TAB>//evil.com`
  // collapsed to a cross-origin `//evil.com` AFTER passing the naive prefix check
  // — redirecting a freshly-authenticated victim off-site. Every input below must
  // now be rejected (caller then falls back to "/").
  describe('rejects control-char smuggled cross-origin targets (old bug)', () => {
    it.each([
      ['/%09//evil.com'], // percent-encoded TAB
      ['/\t//evil.com'], // raw TAB
      ['/\tevil'], // raw TAB (task case)
      ['/\n//x'], // raw LF (task case)
      ['/\r//evil.com'], // raw CR
      ['/%0a//evil.com'], // percent-encoded LF
      ['/%0d//evil.com'], // percent-encoded CR
    ])('rejects %j', (input) => {
      expect(safeNextPath(input)).toBeNull();
      // Caller-side effect: an invalid `next` falls back to "/".
      expect(safeNextPath(input) ?? '/').toBe('/');
    });
  });

  it('does not false-reject a legit path containing a bare percent sign', () => {
    // Malformed %-encoding must not throw or wrongly reject a same-origin path.
    expect(safeNextPath('/search?q=100%')).toBe('/search?q=100%');
  });
});
