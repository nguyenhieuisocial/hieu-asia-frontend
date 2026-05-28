/**
 * PostHog Query API — server-only HogQL client.
 *
 * Wave 42.5 — used by the admin /posthog page to render live data tiles
 * (events 24h, unique users 24h, survey responses, feature flag exposure,
 * top pageviews). The Personal API key is server-side only and MUST NEVER
 * leak to the client bundle.
 *
 * Endpoint: POST https://us.posthog.com/api/projects/{projectId}/query
 * Auth:     Authorization: Bearer <POSTHOG_PERSONAL_API_KEY>
 * Body:     { query: { kind: "HogQLQuery", query: "<SQL>" } }
 *
 * Returns shape: { results: any[][], columns: string[], ... }
 *
 * Every public helper returns `null` on any failure (missing key, network
 * error, non-2xx, malformed payload). Callers render "—" placeholders so
 * the page never crashes on PostHog downtime.
 */

import 'server-only';

const PROJECT_ID = process.env.POSTHOG_PROJECT_ID ?? '434217';
const HOST = process.env.POSTHOG_API_HOST ?? 'https://us.posthog.com';
const KEY = process.env.POSTHOG_PERSONAL_API_KEY;

// 60s server-side cache via Next.js fetch().
const REVALIDATE_SECONDS = 60;

interface HogQLResponse {
  results?: unknown[][];
  columns?: string[];
}

/**
 * Run a HogQL query and return the raw `results` matrix. Returns null on
 * any failure. The caller is responsible for projecting rows into the
 * expected shape.
 */
async function runHogQL(sql: string): Promise<unknown[][] | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(`${HOST}/api/projects/${PROJECT_ID}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: { kind: 'HogQLQuery', query: sql },
      }),
      // Next.js Data Cache — re-fetch at most every 60s per build.
      next: { revalidate: REVALIDATE_SECONDS, tags: ['posthog'] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as HogQLResponse;
    return data.results ?? [];
  } catch {
    return null;
  }
}

/** Total events in the last 24 hours. */
export async function fetchEvents24h(): Promise<number | null> {
  const rows = await runHogQL(
    `SELECT count() FROM events WHERE timestamp > now() - INTERVAL 24 HOUR`,
  );
  if (!rows || !rows[0]) return null;
  const v = rows[0][0];
  return typeof v === 'number' ? v : Number(v) || null;
}

/** Distinct persons that fired any event in the last 24 hours. */
export async function fetchUniqueUsers24h(): Promise<number | null> {
  const rows = await runHogQL(
    `SELECT count(DISTINCT person_id) FROM events WHERE timestamp > now() - INTERVAL 24 HOUR`,
  );
  if (!rows || !rows[0]) return null;
  const v = rows[0][0];
  return typeof v === 'number' ? v : Number(v) || null;
}

export interface SurveyResponseRow {
  surveyId: string;
  count: number;
}

/**
 * `survey sent` events grouped by `$survey_id` over the last 7 days.
 * Returns rows in descending count order. Empty list when nothing yet.
 */
export async function fetchSurveyResponses(): Promise<SurveyResponseRow[] | null> {
  const rows = await runHogQL(
    `SELECT properties.$survey_id AS survey_id, count() AS n
     FROM events
     WHERE event = 'survey sent'
       AND timestamp > now() - INTERVAL 7 DAY
     GROUP BY survey_id
     ORDER BY n DESC`,
  );
  if (!rows) return null;
  return rows
    .map((r) => ({
      surveyId: String(r[0] ?? ''),
      count: Number(r[1] ?? 0),
    }))
    .filter((r) => r.surveyId);
}

export interface FeatureFlagExposureRow {
  flagKey: string;
  count: number;
}

/**
 * `$feature_flag_called` exposure counts grouped by `$feature_flag` over
 * the last 24h. PostHog SDKs emit `$feature_flag_called` (note the $
 * prefix) on every `getFeatureFlag()` evaluation by default.
 */
export async function fetchFeatureFlagExposure(): Promise<
  FeatureFlagExposureRow[] | null
> {
  const rows = await runHogQL(
    `SELECT properties.$feature_flag AS flag, count() AS n
     FROM events
     WHERE event = '$feature_flag_called'
       AND timestamp > now() - INTERVAL 24 HOUR
     GROUP BY flag
     ORDER BY n DESC
     LIMIT 10`,
  );
  if (!rows) return null;
  return rows
    .map((r) => ({
      flagKey: String(r[0] ?? ''),
      count: Number(r[1] ?? 0),
    }))
    .filter((r) => r.flagKey);
}

export interface PageviewRow {
  url: string;
  count: number;
}

/** Top 5 pageview URLs in the last 24h (by `$pageview` count). */
export async function fetchTopPageviews(): Promise<PageviewRow[] | null> {
  const rows = await runHogQL(
    `SELECT properties.$pathname AS path, count() AS n
     FROM events
     WHERE event = '$pageview'
       AND timestamp > now() - INTERVAL 24 HOUR
     GROUP BY path
     ORDER BY n DESC
     LIMIT 5`,
  );
  if (!rows) return null;
  return rows
    .map((r) => ({ url: String(r[0] ?? ''), count: Number(r[1] ?? 0) }))
    .filter((r) => r.url);
}

/** True iff the personal API key is set; used by the admin page to show a
 *  config warning when live tiles are unavailable. */
export function isPostHogServerConfigured(): boolean {
  return !!KEY;
}

/* -------------------------------------------------------------------------
 * Wave 61.07 — Feature flag REST helper (not HogQL).
 * --------------------------------------------------------------------- */

export interface PostHogFlag {
  id: number;
  key: string;
  name: string;
  active: boolean;
  rollout_percentage: number | null;
  filters?: unknown;
  variants?: Array<{ key: string; rollout_percentage: number; name?: string }>;
}

interface FlagListResponse {
  results?: Array<{
    id: number;
    key: string;
    name?: string;
    active?: boolean;
    rollout_percentage?: number | null;
    filters?: { groups?: Array<{ rollout_percentage?: number }>; multivariate?: { variants?: Array<{ key: string; rollout_percentage: number; name?: string }> } };
  }>;
}

/**
 * List the project's feature flags via REST. Returns null on any failure.
 * Rollout-% is normalised: prefer top-level field, fallback to first
 * release-condition group's `rollout_percentage`, then 0.
 */
export async function fetchPostHogFeatureFlags(): Promise<PostHogFlag[] | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(
      `${HOST}/api/projects/${PROJECT_ID}/feature_flags/?limit=100`,
      {
        headers: { Authorization: `Bearer ${KEY}` },
        next: { revalidate: REVALIDATE_SECONDS, tags: ['posthog'] },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as FlagListResponse;
    return (data.results ?? []).map((f) => {
      const rollout =
        typeof f.rollout_percentage === 'number'
          ? f.rollout_percentage
          : f.filters?.groups?.[0]?.rollout_percentage ?? 0;
      return {
        id: f.id,
        key: f.key,
        name: f.name ?? f.key,
        active: f.active ?? false,
        rollout_percentage: rollout,
        filters: f.filters,
        variants: f.filters?.multivariate?.variants,
      };
    });
  } catch {
    return null;
  }
}
