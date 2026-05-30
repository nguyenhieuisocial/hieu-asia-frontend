'use client';

/**
 * adminFetch — drop-in `fetch` for admin client components that hit the
 * `/api/admin-proxy/*` edge route directly (i.e. NOT through `admin-api.ts`
 * `proxyFetch`, which already centralizes this).
 *
 * Why this exists: the proxy returns HTTP 401 `{ok:false,error:'unauthenticated'}`
 * when the HMAC admin-session cookie is missing/expired. `proxyFetch` bounces
 * the user to `/login` on that 401 so an expired session re-auths instead of
 * the page silently degrading to "not configured / not wired" — which would be
 * dishonest (it misreports an auth problem as a service problem).
 *
 * The /system tabs (ServicesTab/UptimeTab/PerformanceTab) call the proxy via
 * raw `fetch`, so they need the same 401→login behavior to stay consistent with
 * the rest of the admin app. This wrapper supplies exactly that and nothing
 * else — it returns the raw `Response` so existing per-caller parsing/branching
 * is unchanged. After firing the redirect we still return the response; the
 * browser is already navigating away, so the caller's downstream handling of a
 * 401 body is moot.
 */
export async function adminFetch(input: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, { cache: 'no-store', ...init });
  if (res.status === 401 && typeof window !== 'undefined') {
    const next = window.location.pathname + window.location.search;
    window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
  }
  return res;
}
