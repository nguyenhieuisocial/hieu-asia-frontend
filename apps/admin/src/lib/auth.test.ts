import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  SESSION_TTL_MS,
  constantTimeEqual,
  encodeSession,
  safeNextPath,
  verifySession,
} from './auth';

const SECRET = 'test-cookie-secret-0123456789abcdef';
// Fixed clock so TTL assertions are deterministic (matches the repo convention
// of pinning `now` in time-dependent tests).
const T0 = Date.parse('2026-07-12T00:00:00.000Z');

/** Recompute the HMAC the exact way the module does — used to forge/legacy-sign. */
async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

describe('admin session cookie (HMAC + issuedAt TTL)', () => {
  beforeEach(() => {
    process.env.ADMIN_COOKIE_SECRET = SECRET;
  });
  afterEach(() => {
    delete process.env.ADMIN_COOKIE_SECRET;
  });

  it('round-trips a freshly signed session', async () => {
    const cookie = await encodeSession('owner@hieu.asia', 'owner', T0);
    expect(cookie).toMatch(/^owner@hieu\.asia:owner:\d+\.[0-9a-f]{64}$/);
    const session = await verifySession(cookie, T0 + 1_000);
    expect(session).toEqual({ email: 'owner@hieu.asia', role: 'owner' });
  });

  it('preserves an email that contains dots and the @ sign', async () => {
    // The `.` in the address must not be mistaken for the signature separator,
    // and the `@` must survive the round trip.
    const cookie = await encodeSession('a.b.c@sub.hieu.asia', 'admin', T0);
    expect(await verifySession(cookie, T0 + 1_000)).toEqual({
      email: 'a.b.c@sub.hieu.asia',
      role: 'admin',
    });
  });

  it('accepts a session at the exact TTL boundary and rejects one past it', async () => {
    const cookie = await encodeSession('a@hieu.asia', 'admin', T0);
    expect(await verifySession(cookie, T0 + SESSION_TTL_MS)).toEqual({
      email: 'a@hieu.asia',
      role: 'admin',
    });
    expect(await verifySession(cookie, T0 + SESSION_TTL_MS + 1)).toBeNull();
  });

  it('rejects a cookie signed with a different secret (key mismatch)', async () => {
    const cookie = await encodeSession('owner@hieu.asia', 'owner', T0);
    process.env.ADMIN_COOKIE_SECRET = 'a-completely-different-secret';
    expect(await verifySession(cookie, T0 + 1_000)).toBeNull();
  });

  it('fails closed when no signing secret is configured', async () => {
    const cookie = await encodeSession('owner@hieu.asia', 'owner', T0);
    // encodeSession must refuse to mint an unsigned cookie...
    delete process.env.ADMIN_COOKIE_SECRET;
    await expect(encodeSession('owner@hieu.asia', 'owner', T0)).rejects.toThrow(
      /ADMIN_COOKIE_SECRET/,
    );
    // ...and verifySession must reject every cookie without a secret.
    expect(await verifySession(cookie, T0 + 1_000)).toBeNull();
  });

  it('rejects corrupted / malformed cookies', async () => {
    const cookie = await encodeSession('owner@hieu.asia', 'owner', T0);
    const dot = cookie.lastIndexOf('.');
    const payload = cookie.slice(0, dot);
    const sig = cookie.slice(dot + 1);

    // Flipped first signature byte.
    const flipped = `${payload}.${sig[0] === '0' ? '1' : '0'}${sig.slice(1)}`;
    expect(await verifySession(flipped, T0 + 1_000)).toBeNull();
    // Signature present but not 64 hex chars.
    expect(await verifySession(`${payload}.deadbeef`, T0 + 1_000)).toBeNull();
    // Missing signature entirely.
    expect(await verifySession(payload, T0 + 1_000)).toBeNull();
    // Total garbage / empty / nullish.
    expect(await verifySession('not-a-cookie', T0 + 1_000)).toBeNull();
    expect(await verifySession('', T0 + 1_000)).toBeNull();
    expect(await verifySession(undefined, T0 + 1_000)).toBeNull();
    expect(await verifySession(null, T0 + 1_000)).toBeNull();
  });

  it('rejects a role-escalated payload that reuses a lower-privilege signature', async () => {
    // Attacker takes a valid viewer cookie and rewrites the role to owner. Since
    // role is inside the signed payload, the signature no longer matches.
    const viewer = await encodeSession('mole@hieu.asia', 'viewer', T0);
    const sig = viewer.slice(viewer.lastIndexOf('.') + 1);
    const escalated = `mole@hieu.asia:owner:${T0}.${sig}`;
    expect(await verifySession(escalated, T0 + 1_000)).toBeNull();
  });

  it('rejects an extended issuedAt even with the original signature', async () => {
    // Attacker with a stale-but-once-valid cookie bumps issuedAt to dodge expiry.
    // issuedAt is signed, so the tampered value fails signature verification.
    const cookie = await encodeSession('owner@hieu.asia', 'owner', T0);
    const sig = cookie.slice(cookie.lastIndexOf('.') + 1);
    const forgedFresh = `owner@hieu.asia:owner:${T0 + SESSION_TTL_MS * 10}.${sig}`;
    expect(await verifySession(forgedFresh, T0 + 1_000)).toBeNull();
  });

  it('rejects a legacy (pre-issuedAt) cookie even when its signature is valid', async () => {
    // Old format `<email>:<role>` HMAC-signed with the SAME secret. The signature
    // verifies, but the missing timestamp fails parsing → null (forces re-login,
    // and closes the "leaked cookie usable forever" hole for old sessions too).
    const legacyPayload = 'owner@hieu.asia:owner';
    const legacySig = await hmacHex(SECRET, legacyPayload);
    expect(await verifySession(`${legacyPayload}.${legacySig}`, T0 + 1_000)).toBeNull();
  });
});

describe('safeNextPath (open-redirect guard)', () => {
  it('passes through a normal same-origin path', () => {
    expect(safeNextPath('/admin/customers')).toBe('/admin/customers');
    expect(safeNextPath('/admin/customers?tab=paid')).toBe('/admin/customers?tab=paid');
  });

  it('falls back to "/" for empty / nullish input', () => {
    expect(safeNextPath('')).toBe('/');
    expect(safeNextPath(null)).toBe('/');
    expect(safeNextPath(undefined)).toBe('/');
  });

  it('blocks protocol-relative and backslash cross-origin targets', () => {
    expect(safeNextPath('//evil.com')).toBe('/');
    expect(safeNextPath('/\\evil.com')).toBe('/');
    expect(safeNextPath('https://evil.com')).toBe('/');
  });

  it('blocks tab/newline-smuggled protocol-relative targets', () => {
    expect(safeNextPath('/\t/evil.com')).toBe('/');
    expect(safeNextPath('/\n/evil.com')).toBe('/');
  });
});

describe('constantTimeEqual', () => {
  it('is true only for identical strings', () => {
    expect(constantTimeEqual('abc', 'abc')).toBe(true);
    expect(constantTimeEqual('abc', 'abd')).toBe(false);
    expect(constantTimeEqual('abc', 'ab')).toBe(false); // length mismatch
    expect(constantTimeEqual('', '')).toBe(true);
  });
});
