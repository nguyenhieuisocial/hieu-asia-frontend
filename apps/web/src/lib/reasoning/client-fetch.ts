/**
 * Wave 58 — Client-side wrapper for calling auth-gated reasoning routes.
 *
 * Existing callers should switch from raw `fetch('/api/reasoning/...')` to
 * `fetchReasoningRoute(path, init)` so the Supabase access_token is attached
 * as `Authorization: Bearer`. Server-side `getSessionFromRequest()` verifies
 * it via GoTrue and rejects unauthed requests with 401.
 *
 * Handles three response shapes the caller's UX should recognize:
 *   - 401 `{auth_required, signin_url}` → bounce to /signin
 *   - 402 `{free_quota_exhausted, options}` → render upsell modal with the
 *     `options` array (Premium 99k vs Monthly 199k)
 *   - 402 `{daily_cap_exceeded}` (Phase 2.6) → render "đã hết quota AI hôm nay"
 *   - 503 `{guard_unavailable|quota_check_unavailable}` → "thử lại sau" toast
 *
 * Throws on network error so callers can surface a generic retry UI.
 */

import { getSupabaseAuth } from '../auth-client';

export interface ReasoningFetchError {
  status: number;
  body: Record<string, unknown>;
}

/**
 * Fetch a `/api/reasoning/*` route with the current user's bearer token.
 *
 * Returns `Response` on success (2xx) — caller awaits .json(). Throws an
 * Error with `.cause = { status, body }` on 4xx/5xx so the caller's catch
 * block has structured info for the UX branch.
 */
export async function fetchReasoningRoute(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  // Grab the current access token from the Supabase auth singleton. If absent
  // (user not logged in or auth disabled in dev), still call — the server will
  // 401 with the signin_url and we let the caller bounce.
  const sb = getSupabaseAuth();
  let token: string | undefined;
  if (sb) {
    const { data } = await sb.auth.getSession();
    token = data.session?.access_token;
  }

  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  if (token) headers.set('authorization', `Bearer ${token}`);

  const res = await fetch(path, {
    ...init,
    headers,
    // Reasoning calls are long-running; don't let the browser cache or reuse.
    cache: 'no-store',
  });

  if (!res.ok) {
    let body: Record<string, unknown> = {};
    try {
      body = (await res.clone().json()) as Record<string, unknown>;
    } catch {
      /* body not JSON — leave empty so caller falls back to status code */
    }
    const err = new Error(
      `reasoning route ${res.status}: ${typeof body.error === 'string' ? body.error : 'unknown'}`,
    ) as Error & { cause: ReasoningFetchError };
    err.cause = { status: res.status, body };
    throw err;
  }
  return res;
}

/**
 * Convenience type-guard: the thrown Error has a structured `.cause` payload
 * with the server's JSON body. Callers use this to branch on `error` field
 * (e.g. `auth_required` vs `free_quota_exhausted`).
 */
export function isReasoningFetchError(e: unknown): e is Error & { cause: ReasoningFetchError } {
  return (
    e instanceof Error &&
    typeof (e as { cause?: unknown }).cause === 'object' &&
    (e as { cause?: { status?: unknown } }).cause !== null &&
    typeof (e as { cause: { status: unknown } }).cause.status === 'number'
  );
}
