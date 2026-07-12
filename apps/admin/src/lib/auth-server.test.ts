import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Hoisted mutable holders so the (hoisted) vi.mock factories can read them.
const { liveHolder, cookieHolder } = vi.hoisted(() => ({
  liveHolder: { value: { status: 'unknown' } as { status: string; role?: string } },
  cookieHolder: { value: undefined as string | undefined },
}));

// Stub ONLY resolveLiveRole; keep the REAL decideEffectiveRole so the fail-open/
// fail-closed policy is exercised end-to-end through requireAdminSession.
vi.mock('./admin-user-store', async (importActual) => {
  const actual = await importActual<typeof import('./admin-user-store')>();
  return { ...actual, resolveLiveRole: vi.fn(async () => liveHolder.value) };
});

// Control the session cookie the handler reads.
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (_name: string) => (cookieHolder.value ? { value: cookieHolder.value } : undefined),
  }),
}));

import { requireAdminSession } from './auth-server';
import { encodeSession } from './auth';

const SECRET = 'test-cookie-secret-auth-server';

function statusOf(result: Awaited<ReturnType<typeof requireAdminSession>>): number | null {
  return 'error' in result ? result.error.status : null;
}

describe('requireAdminSession — live revocation + effective role', () => {
  beforeEach(() => {
    process.env.ADMIN_COOKIE_SECRET = SECRET;
    liveHolder.value = { status: 'unknown' };
    cookieHolder.value = undefined;
  });
  afterEach(() => {
    delete process.env.ADMIN_COOKIE_SECRET;
    vi.clearAllMocks();
  });

  it('401s when there is no session cookie', async () => {
    const r = await requireAdminSession();
    expect(statusOf(r)).toBe(401);
  });

  it('401s (session_revoked) when the live store says the admin is gone', async () => {
    cookieHolder.value = await encodeSession('a@hieu.asia', 'owner');
    liveHolder.value = { status: 'revoked' };
    const r = await requireAdminSession();
    expect(statusOf(r)).toBe(401);
  });

  it('authorizes off the LIVE role, not the cookie role (demoted owner→viewer is forbidden for admin+)', async () => {
    cookieHolder.value = await encodeSession('a@hieu.asia', 'owner'); // cookie still claims owner
    liveHolder.value = { status: 'active', role: 'viewer' }; // but the store demoted them
    const r = await requireAdminSession('admin');
    expect(statusOf(r)).toBe(403);
  });

  it('grants access at the live role when active (and returns it as the session role)', async () => {
    cookieHolder.value = await encodeSession('a@hieu.asia', 'viewer');
    liveHolder.value = { status: 'active', role: 'owner' };
    const r = await requireAdminSession('owner');
    expect('session' in r && r.session).toEqual({ email: 'a@hieu.asia', role: 'owner' });
  });

  it('READ (viewer) falls back to the signed cookie role when the authority is unknown (outage)', async () => {
    cookieHolder.value = await encodeSession('a@hieu.asia', 'admin');
    liveHolder.value = { status: 'unknown' };
    const r = await requireAdminSession(); // viewer → not privileged → fail open
    expect('session' in r && r.session).toEqual({ email: 'a@hieu.asia', role: 'admin' });
  });

  it('PRIVILEGED (elevated) FAILS CLOSED with 503 when the authority is unknown', async () => {
    cookieHolder.value = await encodeSession('a@hieu.asia', 'owner');
    liveHolder.value = { status: 'unknown' };
    const r = await requireAdminSession('owner'); // owner → privileged → cannot confirm → deny
    expect(statusOf(r)).toBe(503);
  });

  it('opts.fresh forces fail-closed even for a viewer gate (capability-minting routes)', async () => {
    cookieHolder.value = await encodeSession('a@hieu.asia', 'viewer');
    liveHolder.value = { status: 'unknown' };
    const r = await requireAdminSession('viewer', { fresh: true });
    expect(statusOf(r)).toBe(503);
  });

  it('break_glass authorizes with the cookie role (escape hatch survives outage)', async () => {
    cookieHolder.value = await encodeSession('admin@hieu.asia', 'owner');
    liveHolder.value = { status: 'break_glass' };
    const r = await requireAdminSession('owner', { fresh: true });
    expect('session' in r && r.session).toEqual({ email: 'admin@hieu.asia', role: 'owner' });
  });

  it('read:true keeps an elevated GET on the FAIL-OPEN path (unknown → cookie role, not 503)', async () => {
    cookieHolder.value = await encodeSession('a@hieu.asia', 'owner');
    liveHolder.value = { status: 'unknown' }; // /admin/users blip while e.g. PostHog is healthy
    const r = await requireAdminSession('admin', { read: true });
    expect('session' in r && r.session).toEqual({ email: 'a@hieu.asia', role: 'owner' });
  });

  it('read:true still denies a revoked admin (deletion is enforced regardless)', async () => {
    cookieHolder.value = await encodeSession('a@hieu.asia', 'owner');
    liveHolder.value = { status: 'revoked' };
    const r = await requireAdminSession('admin', { read: true });
    expect(statusOf(r)).toBe(401);
  });
});
