/**
 * Google Search Console (GSC) API — typed wrapper around the worker admin endpoint.
 *
 * Reads go through the secure admin proxy
 * (`/api/admin-proxy/admin/gsc/search-analytics`), which injects the X-Admin-Token
 * server-side and is HMAC-session + role gated. Mirrors the proxyGet pattern in
 * src/lib/llm-spend-api.ts.
 *
 * GSC data lags ~2-3 days, so `range.end` is typically today-2 — surface the
 * range to the operator. The endpoint may also return a structured error
 * (`not_configured` / `auth_failed` / `gsc_api_error`) instead of a 2xx payload
 * when GSC secrets are missing or the Google API rejects the call.
 */

/** A single query/page row. ctr is 0..1; position is avg rank (lower = better). */
export interface GscRow {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** One day of aggregated search metrics (ascending by date). */
export interface GscDailyPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** Aggregate metrics for a window — used for period-over-period deltas. */
export interface GscMetrics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** A query with its delta vs the prior equal-length window. */
export interface GscMovingQuery {
  key: string;
  clicks: number;
  impressions: number;
  deltaClicks: number;
  deltaImpressions: number;
}

/** Success payload from the worker. */
export interface GscSearchAnalytics {
  ok: true;
  site: string;
  range: { start: string; end: string };
  totals: { clicks: number; impressions: number };
  queries: GscRow[];
  pages: GscRow[];
  // --- Trend / period-over-period (OPTIONAL — backend rollout in progress). ---
  // The page MUST render exactly as before when these are absent; each new UI
  // section renders only when its field is present + non-empty.
  /** Daily series for the current window, ascending by date. */
  daily?: GscDailyPoint[];
  /** Aggregate metrics for the current window. */
  current?: GscMetrics;
  /** Prior equal-length window — for period-over-period deltas. */
  prev?: GscMetrics & { range: { start: string; end: string } };
  /** Queries gaining impressions vs the prior window (descending). */
  risingQueries?: GscMovingQuery[];
  /** Queries losing impressions vs the prior window (descending magnitude). */
  fallingQueries?: GscMovingQuery[];
}

/** Structured error payload (503 not_configured / 502 auth_failed | gsc_api_error). */
export interface GscErrorResponse {
  ok: false;
  error: 'not_configured' | 'auth_failed' | 'gsc_api_error';
  hint?: string;
  detail?: string;
}

export type GscResponse = GscSearchAnalytics | GscErrorResponse;

const BASE = '/api/admin-proxy/admin/gsc/search-analytics';

/** Redirect to /login on a 401 from the proxy (expired/invalid session). */
function bounceOn401(status: number): boolean {
  if (status === 401 && typeof window !== 'undefined') {
    const next = window.location.pathname + window.location.search;
    window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
    return true;
  }
  return false;
}

/**
 * Fetch GSC search analytics for the given window (days = 7 | 28 | 90).
 *
 * Returns the parsed JSON for 2xx AND for the documented structured errors
 * (503 not_configured, 502 auth_failed | gsc_api_error) so the page can render
 * a setup/error state. Throws only on a 401 bounce or an unexpected !res.ok
 * response that isn't a known structured error.
 */
export async function getGscSearchAnalytics(days: number): Promise<GscResponse> {
  const res = await fetch(`${BASE}?days=${days}`, {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  if (bounceOn401(res.status)) throw new Error('unauthenticated');

  const text = await res.text();
  let parsed: GscResponse | undefined;
  try {
    parsed = JSON.parse(text) as GscResponse;
  } catch {
    parsed = undefined;
  }

  // Known structured error envelopes (503 / 502) carry `ok:false` + error code —
  // hand them back so the page renders the setup/error UI instead of throwing.
  if (parsed && parsed.ok === false) return parsed;

  if (!res.ok) {
    throw new Error(`[gsc] search-analytics → ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!parsed) {
    throw new Error(`[gsc] search-analytics → invalid JSON (HTTP ${res.status})`);
  }
  return parsed;
}
