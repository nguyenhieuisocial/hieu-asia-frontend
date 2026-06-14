/**
 * user-me — shared, deduped accessor for `/api/user/me`.
 *
 * BUG-009 (Wave 52): the bare `/` route fired `/api/user/me` 3x per load
 * because PostHogProvider invokes identifyUser() once from getSession() and
 * once from the INITIAL_SESSION auth event (React Strict Mode then double-
 * mounts the effect in dev). OverviewTab / PaymentsTab add their own fetch
 * on top.
 *
 * BUG-027 (Wave 54): V2 audit measured 8 calls + 1 × 503 per page load.
 * Root cause: the success-only cache let failure paths bypass the dedupe —
 * each 503 retry hit the network because `cache` was never populated. Also
 * `inflight` was cleared in `finally` AFTER `cache` was set, leaving a tiny
 * window where two callers in the same micro-task could both miss the cache.
 *
 * Fix:
 *   1. Cache failures briefly (5s) so a single 503/network blip stops the
 *      thundering-herd of identity callers.
 *   2. Resolve from cache BEFORE awaiting `inflight` so the cached-success
 *      fast path doesn't accidentally start a parallel fetch.
 *   3. Persist `inflight` until the json() body resolves AND cache is set.
 *
 * `invalidateUserMe()` lets explicit refresh paths bust the cache (e.g.
 * after a tier upgrade webhook lands).
 */

export interface UserMeResponse {
  ok: true;
  user_id: string | null;
  email: string | null;
  membership_tier: 'free' | 'standard' | 'premium' | 'lifetime';
}

import { getSupabaseAuth } from './auth-client';

const TTL_MS = 30_000;
const ERROR_TTL_MS = 5_000;

type CacheEntry =
  | { kind: 'ok'; at: number; data: UserMeResponse }
  | { kind: 'err'; at: number };

let cache: CacheEntry | null = null;
let inflight: Promise<UserMeResponse | null> | null = null;

async function doFetch(): Promise<UserMeResponse | null> {
  try {
    // Attach the Supabase access token so the route can resolve the REAL tier
    // (the session JWT lives in localStorage, not a server cookie). No session →
    // no header → the route returns the safe 'free' default. Mirrors lib/referral.ts.
    let authHeaders: Record<string, string> = {};
    try {
      const sb = getSupabaseAuth();
      if (sb) {
        const { data } = await sb.auth.getSession();
        const token = data.session?.access_token;
        if (token) authHeaders = { Authorization: `Bearer ${token}` };
      }
    } catch {
      /* no session / client unavailable → anonymous, fall through */
    }
    const res = await fetch('/api/user/me', { cache: 'no-store', headers: authHeaders });
    // Content-type guard — never feed an HTML error page to JSON.parse.
    const ct = res.headers.get('content-type') ?? '';
    if (!res.ok || !/\bjson\b/i.test(ct)) {
      cache = { kind: 'err', at: Date.now() };
      return null;
    }
    const data = (await res.json()) as UserMeResponse;
    cache = { kind: 'ok', at: Date.now(), data };
    return data;
  } catch {
    cache = { kind: 'err', at: Date.now() };
    return null;
  } finally {
    inflight = null;
  }
}

/**
 * Fetch `/api/user/me`, deduping concurrent calls and reusing a recent
 * response for up to `TTL_MS`. Returns `null` on any non-JSON / error
 * response so callers can fall back to safe defaults. Failed lookups are
 * cached for `ERROR_TTL_MS` to prevent retry storms during outages.
 */
export function fetchUserMe(): Promise<UserMeResponse | null> {
  if (cache) {
    const age = Date.now() - cache.at;
    if (cache.kind === 'ok' && age < TTL_MS) {
      return Promise.resolve(cache.data);
    }
    if (cache.kind === 'err' && age < ERROR_TTL_MS) {
      return Promise.resolve(null);
    }
  }
  if (inflight) return inflight;
  inflight = doFetch();
  return inflight;
}

/** Drop the cached response (e.g. after a tier upgrade). */
export function invalidateUserMe(): void {
  cache = null;
}
