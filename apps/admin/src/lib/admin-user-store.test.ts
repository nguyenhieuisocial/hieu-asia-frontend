import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LIVE_ROLE_CACHE_TTL_MS,
  resolveLiveRole,
  decideEffectiveRole,
  __resetLiveRoleCacheForTests,
} from './admin-user-store';

const T0 = Date.parse('2026-07-12T00:00:00.000Z');

/** A fetch stub that always resolves the given admin-user list. */
function fetchReturningUsers(users: Array<{ email: string; role: string }>) {
  return vi.fn(async () => ({ ok: true, json: async () => ({ ok: true, users }) }));
}

describe('resolveLiveRole (instant revocation)', () => {
  beforeEach(() => {
    process.env.HIEU_API_ADMIN_TOKEN = 'test-admin-token';
    __resetLiveRoleCacheForTests();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.HIEU_API_ADMIN_TOKEN;
    delete process.env.ADMIN_PASSWORD;
  });

  it('returns the live role for a current admin', async () => {
    vi.stubGlobal('fetch', fetchReturningUsers([{ email: 'owner@hieu.asia', role: 'owner' }]));
    expect(await resolveLiveRole('owner@hieu.asia', T0)).toEqual({ status: 'active', role: 'owner' });
  });

  it('returns revoked when the email is no longer in the list (deleted / demoted-away)', async () => {
    vi.stubGlobal('fetch', fetchReturningUsers([{ email: 'someone-else@hieu.asia', role: 'owner' }]));
    expect(await resolveLiveRole('gone@hieu.asia', T0)).toEqual({ status: 'revoked' });
  });

  it('uses the LIVE role, not the caller-supplied one (demotion takes effect)', async () => {
    // A demoted owner→viewer: the store now says viewer. Callers pass only the
    // email, so whatever the cookie claimed is irrelevant here.
    vi.stubGlobal('fetch', fetchReturningUsers([{ email: 'a@hieu.asia', role: 'viewer' }]));
    expect(await resolveLiveRole('a@hieu.asia', T0)).toEqual({ status: 'active', role: 'viewer' });
  });

  it('reflects a role change only after the cache TTL expires', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, users: [{ email: 'a@hieu.asia', role: 'owner' }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, users: [{ email: 'a@hieu.asia', role: 'viewer' }] }) });
    vi.stubGlobal('fetch', fetchMock);

    expect(await resolveLiveRole('a@hieu.asia', T0)).toEqual({ status: 'active', role: 'owner' });
    // Within TTL → served from cache, still owner, no refetch.
    expect(await resolveLiveRole('a@hieu.asia', T0 + LIVE_ROLE_CACHE_TTL_MS - 1)).toEqual({ status: 'active', role: 'owner' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    // At/after TTL → refetch → demoted to viewer.
    expect(await resolveLiveRole('a@hieu.asia', T0 + LIVE_ROLE_CACHE_TTL_MS)).toEqual({ status: 'active', role: 'viewer' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('caches within the TTL (one fetch for repeated lookups)', async () => {
    const fetchMock = fetchReturningUsers([{ email: 'a@hieu.asia', role: 'admin' }]);
    vi.stubGlobal('fetch', fetchMock);
    await resolveLiveRole('a@hieu.asia', T0);
    await resolveLiveRole('a@hieu.asia', T0 + 1_000);
    await resolveLiveRole('a@hieu.asia', T0 + 5_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('normalizes email case and surrounding whitespace', async () => {
    vi.stubGlobal('fetch', fetchReturningUsers([{ email: 'Owner@Hieu.Asia', role: 'owner' }]));
    expect(await resolveLiveRole('  owner@hieu.asia  ', T0)).toEqual({ status: 'active', role: 'owner' });
  });

  it('returns unknown (fail-open to signed cookie) on network error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network down'); }));
    expect(await resolveLiveRole('a@hieu.asia', T0)).toEqual({ status: 'unknown' });
  });

  it('returns unknown on non-OK HTTP and on an ok:false envelope', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    expect(await resolveLiveRole('a@hieu.asia', T0)).toEqual({ status: 'unknown' });

    __resetLiveRoleCacheForTests();
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ ok: false }) })));
    expect(await resolveLiveRole('a@hieu.asia', T0)).toEqual({ status: 'unknown' });
  });

  it('returns unknown when the admin token is not configured (never blindly reject)', async () => {
    delete process.env.HIEU_API_ADMIN_TOKEN;
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => ({ ok: true, users: [] }) }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await resolveLiveRole('a@hieu.asia', T0)).toEqual({ status: 'unknown' });
    expect(fetchMock).not.toHaveBeenCalled(); // short-circuits before the network
  });

  it('caches a failed attempt so a Worker outage does not hammer the authority', async () => {
    const fetchMock = vi.fn(async () => { throw new Error('down'); });
    vi.stubGlobal('fetch', fetchMock);
    await resolveLiveRole('a@hieu.asia', T0);
    await resolveLiveRole('a@hieu.asia', T0 + 1_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('fresh=true bypasses the cache (privileged writes see the current role at once)', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, users: [{ email: 'a@hieu.asia', role: 'owner' }] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true, users: [{ email: 'a@hieu.asia', role: 'viewer' }] }) });
    vi.stubGlobal('fetch', fetchMock);

    // Warm the cache as owner.
    expect(await resolveLiveRole('a@hieu.asia', T0)).toEqual({ status: 'active', role: 'owner' });
    // A privileged write 1s later (well within TTL) must NOT trust the cache.
    expect(await resolveLiveRole('a@hieu.asia', T0 + 1_000, true)).toEqual({ status: 'active', role: 'viewer' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('coalesces concurrent cache-miss lookups onto a single fetch (no stampede)', async () => {
    let resolveFetch: (v: unknown) => void = () => {};
    const gate = new Promise((res) => { resolveFetch = res; });
    const fetchMock = vi.fn(async () => {
      await gate;
      return { ok: true, json: async () => ({ ok: true, users: [{ email: 'a@hieu.asia', role: 'admin' }] }) };
    });
    vi.stubGlobal('fetch', fetchMock);

    const p = Promise.all([
      resolveLiveRole('a@hieu.asia', T0),
      resolveLiveRole('a@hieu.asia', T0),
      resolveLiveRole('a@hieu.asia', T0),
    ]);
    resolveFetch(undefined);
    const [a, b, c] = await p;
    expect(a).toEqual({ status: 'active', role: 'admin' });
    expect(b).toEqual({ status: 'active', role: 'admin' });
    expect(c).toEqual({ status: 'active', role: 'admin' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('resolves the break-glass identity to break_glass (not revoked) when absent + ADMIN_PASSWORD set', async () => {
    process.env.ADMIN_PASSWORD = 'break-glass-secret';
    // admin@hieu.asia is NOT in the KV list (env-only escape hatch).
    vi.stubGlobal('fetch', fetchReturningUsers([{ email: 'owner@hieu.asia', role: 'owner' }]));
    expect(await resolveLiveRole('admin@hieu.asia', T0)).toEqual({ status: 'break_glass' });
  });

  it('resolves the break-glass identity to break_glass during a Worker outage too', async () => {
    process.env.ADMIN_PASSWORD = 'break-glass-secret';
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('outage'); }));
    // Must NOT be 'unknown' — otherwise a privileged check would fail closed and
    // lock the operator out of the escape hatch during the exact outage it exists for.
    expect(await resolveLiveRole('admin@hieu.asia', T0)).toEqual({ status: 'break_glass' });
  });

  it('DOES revoke admin@hieu.asia when no break-glass password is configured', async () => {
    delete process.env.ADMIN_PASSWORD;
    vi.stubGlobal('fetch', fetchReturningUsers([{ email: 'owner@hieu.asia', role: 'owner' }]));
    expect(await resolveLiveRole('admin@hieu.asia', T0)).toEqual({ status: 'revoked' });
  });

  it('passes an abort signal so a hanging Worker cannot block the caller forever', async () => {
    const fetchMock = vi.fn(async (_url: string, init?: { signal?: AbortSignal }) => {
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return { ok: true, json: async () => ({ ok: true, users: [{ email: 'a@hieu.asia', role: 'owner' }] }) };
    });
    vi.stubGlobal('fetch', fetchMock);
    expect(await resolveLiveRole('a@hieu.asia', T0)).toEqual({ status: 'active', role: 'owner' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('decideEffectiveRole (fail-open reads, fail-closed privileged)', () => {
  it('active → authorize with the LIVE role', () => {
    expect(decideEffectiveRole({ status: 'active', role: 'viewer' }, 'owner', true)).toEqual({ role: 'viewer' });
    expect(decideEffectiveRole({ status: 'active', role: 'owner' }, 'viewer', false)).toEqual({ role: 'owner' });
  });

  it('break_glass → authorize with the cookie role (escape hatch)', () => {
    expect(decideEffectiveRole({ status: 'break_glass' }, 'owner', true)).toEqual({ role: 'owner' });
  });

  it('revoked → deny regardless of privileged flag', () => {
    expect(decideEffectiveRole({ status: 'revoked' }, 'owner', true)).toEqual({ deny: 'revoked' });
    expect(decideEffectiveRole({ status: 'revoked' }, 'owner', false)).toEqual({ deny: 'revoked' });
  });

  it('unknown → fail OPEN for reads (cookie role), fail CLOSED for privileged', () => {
    // Read: authority down → trust the signed cookie for availability.
    expect(decideEffectiveRole({ status: 'unknown' }, 'admin', false)).toEqual({ role: 'admin' });
    // Privileged: cannot confirm → deny, so gateway slowness can't reopen escalation.
    expect(decideEffectiveRole({ status: 'unknown' }, 'owner', true)).toEqual({ deny: 'unverifiable' });
  });
});
