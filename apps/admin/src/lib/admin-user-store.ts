/**
 * Live admin-user lookup for INSTANT session revocation (2026-07-12 audit, step 3).
 *
 * Problem this closes: the session cookie carries a SIGNED role, and both the
 * admin-proxy and `requireAdminSession()` authorize off that role. The backend
 * Worker is role-blind (it only checks the shared X-Admin-Token). So an admin who
 * was demoted (owner→viewer) or deleted keeps their old powers until the cookie's
 * 7-day TTL elapses — the signature is still valid.
 *
 * Fix: re-derive the CURRENT role from the authoritative store (`GET /admin/users`
 * on the Worker) at each capability check, and treat a vanished user as revoked.
 * Demote/delete then takes effect within `LIVE_ROLE_CACHE_TTL_MS` for reads, and
 * IMMEDIATELY for privileged writes (callers pass `fresh` to skip the cache —
 * this closes the window where a just-demoted owner could mint a new owner and
 * make their revocation moot).
 *
 * Availability: if the authority can't be reached we return `unknown`, and callers
 * fall back to the signed cookie role — i.e. security degrades to the pre-step-3
 * behaviour (signature + 7-day TTL) during a Worker outage rather than locking the
 * operator out. A definitive "user absent" (authority responded, email not in list)
 * is `revoked` and IS enforced — EXCEPT the env-gated break-glass identity, which is
 * never force-revoked by KV state (see BREAK_GLASS_EMAIL below).
 *
 * Edge-safe: only `fetch`, `Map`, `AbortSignal`, and `process.env` — importable by
 * the Edge middleware/proxy and by Node route handlers alike.
 */
import type { AdminRole } from './auth';

const GATEWAY = process.env.HIEU_API_GATEWAY_URL ?? 'https://api.hieu.asia';

/**
 * How long a fetched user list (or a failed attempt) is reused before refetching.
 * Bounds revocation latency for READS and collapses the burst of concurrent
 * proxy/requireAdminSession calls a dashboard render fires. Privileged WRITES pass
 * `fresh` and ignore this cache, so a demote/delete blocks elevated actions at once
 * regardless of the window. 15s keeps read-staleness low while keeping Worker load
 * negligible (also see the in-flight dedup below).
 */
export const LIVE_ROLE_CACHE_TTL_MS = 15_000;

/**
 * Hard timeout for the authority fetch. Without it, a DEGRADED Worker (TCP connects
 * but never responds) would hang the Edge middleware — which now runs this on every
 * navigation — for the platform default. Mirrors the repo convention (every other
 * gateway fetch carries an AbortSignal.timeout). On timeout we degrade to `unknown`
 * → fall back to the signed cookie role.
 */
const FETCH_TIMEOUT_MS = 2_500;

/**
 * Break-glass identity (mirrors the `admin@hieu.asia` special-case in the login
 * route's ADMIN_PASSWORD path). It is an ENV-gated escape hatch that may not exist
 * in the KV user list, so it must never be force-revoked by KV state — otherwise a
 * Worker recovery mid-remediation would kill the operator's break-glass session.
 */
const BREAK_GLASS_EMAIL = 'admin@hieu.asia';

export type LiveRoleResolution =
  | { status: 'active'; role: AdminRole } // authority responded; role is the live role
  | { status: 'revoked' } // authority responded and the email is NOT an admin (demoted-away/deleted)
  | { status: 'break_glass' } // env-gated escape hatch (admin@hieu.asia + ADMIN_PASSWORD) → trust cookie
  | { status: 'unknown' }; // authority unreachable/unparseable → caller decides (fail open for reads, closed for privileged)

interface CacheEntry {
  at: number;
  /** email(lowercased) → role, or null when the last attempt failed. */
  users: Map<string, AdminRole> | null;
}

let cache: CacheEntry | null = null;
/** Shared promise so concurrent cache-miss callers await ONE fetch, not N. */
let inflight: Promise<Map<string, AdminRole> | null> | null = null;

/** Fetch the authoritative admin-user list. Returns null on any error/misconfig. */
async function fetchAdminRoleMap(): Promise<Map<string, AdminRole> | null> {
  const token = process.env.HIEU_API_ADMIN_TOKEN;
  if (!token) return null; // no way to query the authority → unknown (fail-open to cookie)
  try {
    const r = await fetch(`${GATEWAY}/admin/users`, {
      headers: { 'X-Admin-Token': token },
      cache: 'no-store',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!r.ok) {
      console.warn(`[admin-user-store] /admin/users HTTP ${r.status} — revocation check falling back to signed cookie`);
      return null;
    }
    const data = (await r.json()) as {
      ok?: boolean;
      users?: Array<{ email?: string; role?: AdminRole }>;
    };
    if (!data.ok || !Array.isArray(data.users)) {
      // A silently fail-open control is dangerous — make a shape change observable.
      console.warn('[admin-user-store] unexpected /admin/users shape — revocation check falling back to signed cookie');
      return null;
    }
    const map = new Map<string, AdminRole>();
    for (const u of data.users) {
      if (!u.email || !u.role) continue;
      map.set(u.email.trim().toLowerCase(), u.role);
    }
    return map;
  } catch (err) {
    console.warn(`[admin-user-store] /admin/users fetch failed (${(err as Error).message}) — revocation check falling back to signed cookie`);
    return null;
  }
}

async function getRoleMap(now: number, fresh: boolean): Promise<Map<string, AdminRole> | null> {
  // Cached read within the TTL — skipped when `fresh` (privileged) to catch a
  // demote/delete at once.
  if (!fresh && cache && now - cache.at < LIVE_ROLE_CACHE_TTL_MS) return cache.users;
  // Coalesce onto any in-flight fetch (fresh or not) so a dashboard render firing N
  // concurrent gated calls makes ONE Worker request, not N.
  if (inflight) return inflight;
  const p = fetchAdminRoleMap().then((users) => {
    cache = { at: now, users }; // cache successes AND failures (bounds outage retries)
    return users;
  });
  inflight = p;
  try {
    return await p;
  } finally {
    if (inflight === p) inflight = null;
  }
}

/**
 * Resolve the CURRENT role for a signed-in admin email against the authority.
 *   - `active`  → email present; `role` is the live role (use THIS for authz).
 *   - `revoked` → authority responded but email is gone → deny access.
 *   - `unknown` → authority unreachable → caller falls back to the signed cookie role.
 *
 * Pass `fresh` to bypass the cache — callers use this for privileged writes so a
 * just-demoted admin cannot exploit the cache window. `now` is injectable for tests.
 */
export async function resolveLiveRole(
  email: string,
  now: number = Date.now(),
  fresh = false,
): Promise<LiveRoleResolution> {
  const normalized = email.trim().toLowerCase();
  // The env-gated break-glass identity is an escape hatch that may not exist in the
  // KV list, so it is never force-revoked by KV state — AND it must survive a Worker
  // outage (below) so the operator can keep remediating. It always resolves to
  // 'break_glass' (trust the cookie) rather than 'revoked' or 'unknown'.
  const isBreakGlass = normalized === BREAK_GLASS_EMAIL && !!process.env.ADMIN_PASSWORD;

  const map = await getRoleMap(now, fresh);
  if (!map) return isBreakGlass ? { status: 'break_glass' } : { status: 'unknown' };
  const role = map.get(normalized);
  if (role) return { status: 'active', role };
  return isBreakGlass ? { status: 'break_glass' } : { status: 'revoked' };
}

/**
 * Turn a live resolution + the signed cookie role into an authorization decision.
 * Centralizes the fail-open/closed policy so every capability point is consistent.
 *
 *   active      → authorize with the LIVE role.
 *   break_glass → authorize with the cookie role (deliberate escape hatch).
 *   revoked     → deny ('revoked').
 *   unknown     → authority couldn't be reached/confirmed:
 *                   privileged (elevated role / mutation) → deny ('unverifiable'),
 *                     so gateway SLOWNESS can't reopen the escalation window (the
 *                     mutation targets the same Worker and would fail anyway);
 *                   read → fall back to the signed cookie role (availability).
 */
export function decideEffectiveRole(
  live: LiveRoleResolution,
  cookieRole: AdminRole,
  privileged: boolean,
): { role: AdminRole } | { deny: 'revoked' | 'unverifiable' } {
  switch (live.status) {
    case 'active':
      return { role: live.role };
    case 'break_glass':
      return { role: cookieRole };
    case 'revoked':
      return { deny: 'revoked' };
    case 'unknown':
      return privileged ? { deny: 'unverifiable' } : { role: cookieRole };
  }
}

/** Test seam: drop the cached list + any in-flight fetch so each test starts cold. */
export function __resetLiveRoleCacheForTests(): void {
  cache = null;
  inflight = null;
}
