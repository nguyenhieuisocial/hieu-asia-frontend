/**
 * user-me — shared, deduped accessor for `/api/user/me`.
 *
 * BUG-009 (Wave 52): the bare `/` route fired `/api/user/me` 3x per load
 * because PostHogProvider invokes identifyUser() once from getSession() and
 * once from the INITIAL_SESSION auth event (React Strict Mode then double-
 * mounts the effect in dev). OverviewTab / PaymentsTab add their own fetch
 * on top.
 *
 * Solution: a tiny module-scoped cache + in-flight promise dedupe. All
 * callers go through `fetchUserMe()`; concurrent calls share a single
 * Response, and subsequent calls within `TTL_MS` reuse the cached payload.
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

const TTL_MS = 30_000;

let cache: { at: number; data: UserMeResponse } | null = null;
let inflight: Promise<UserMeResponse | null> | null = null;

async function doFetch(): Promise<UserMeResponse | null> {
  try {
    const res = await fetch('/api/user/me', { cache: 'no-store' });
    // Content-type guard — never feed an HTML error page to JSON.parse.
    const ct = res.headers.get('content-type') ?? '';
    if (!res.ok || !/\bjson\b/i.test(ct)) return null;
    const data = (await res.json()) as UserMeResponse;
    cache = { at: Date.now(), data };
    return data;
  } catch {
    return null;
  } finally {
    inflight = null;
  }
}

/**
 * Fetch `/api/user/me`, deduping concurrent calls and reusing a recent
 * response for up to `TTL_MS`. Returns `null` on any non-JSON / error
 * response so callers can fall back to safe defaults.
 */
export function fetchUserMe(): Promise<UserMeResponse | null> {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return Promise.resolve(cache.data);
  }
  if (inflight) return inflight;
  inflight = doFetch();
  return inflight;
}

/** Drop the cached response (e.g. after a tier upgrade). */
export function invalidateUserMe(): void {
  cache = null;
}
