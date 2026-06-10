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

export interface ToolUsageRow {
  /** Tool slug from the `tool_used` event (e.g. gieo-que, big-five, vision-read). */
  tool: string;
  /** Total uses (events) in the window. */
  uses: number;
  /** Distinct persons who used the tool. */
  users: number;
  /** Distinct persons who used the tool AND also paid (payment_completed) in the window. */
  paidUsers: number;
  /** Conversion = paidUsers / users (0-1). Correlation (used + paid), not causation. */
  conversionRate: number;
  /** Error rate = result='error' / uses (0-1). */
  errorRate: number;
}

/**
 * Top tools over the last 30 days, from the `tool_used` event (apps/web fires
 * `track('tool_used', { tool, result })` — event-taxonomy.ts; track() forwards
 * props to posthog.capture, so `properties.tool` is queryable).
 *
 * Beyond raw usage, this also correlates each tool with payment: per tool, how
 * many distinct users also fired `payment_completed` in the window. That's the
 * deepen-first signal — not just "which tools get used" but "which tools sit on
 * the path to paying customers" — so investment goes where it converts, not
 * just where it's busy. (Correlation, not causation: a paying user may have
 * touched several tools.) Returns null on any PostHog failure (UI placeholder).
 */
export async function fetchTopTools(): Promise<ToolUsageRow[] | null> {
  const rows = await runHogQL(
    `SELECT
       properties.tool AS tool,
       count() AS uses,
       count(DISTINCT person_id) AS users,
       count(DISTINCT IF(person_id IN (
         SELECT DISTINCT person_id FROM events
         WHERE event = 'payment_completed'
           AND timestamp > now() - INTERVAL 30 DAY
       ), person_id, NULL)) AS paid_users,
       countIf(properties.result = 'error') AS errors
     FROM events
     WHERE event = 'tool_used'
       AND timestamp > now() - INTERVAL 30 DAY
     GROUP BY tool
     ORDER BY users DESC
     LIMIT 15`,
  );
  if (!rows) return null;
  return rows
    .map((r) => {
      const tool = String(r[0] ?? '');
      const uses = Number(r[1] ?? 0);
      const users = Number(r[2] ?? 0);
      const paidUsers = Number(r[3] ?? 0);
      const errors = Number(r[4] ?? 0);
      return {
        tool,
        uses,
        users,
        paidUsers,
        conversionRate: users > 0 ? paidUsers / users : 0,
        errorRate: uses > 0 ? errors / uses : 0,
      };
    })
    .filter((r) => r.tool);
}

export interface VariantConversionRow {
  /** The feature-flag key ($feature_flag). */
  flag: string;
  /** The variant the user was shown ($feature_flag_response). */
  variant: string;
  /** Distinct persons exposed to this variant in the window. */
  exposed: number;
  /** Of those, distinct persons who also paid (payment_completed). */
  converted: number;
}

/**
 * Per-variant conversion for every multivariate flag, last 30 days. For each
 * (flag, variant): how many distinct users saw that variant
 * ($feature_flag_called → $feature_flag_response) and how many of THOSE also
 * fired payment_completed. That's the experiment signal the flag roster lacked
 * — "which variant actually leads to paying", not just rollout %.
 *
 * Correlation, not statistical significance (a paying user may have seen
 * several variants) — a directional at-a-glance read. Same proven IN-subquery
 * shape as fetchTopTools. Returns null on any PostHog failure.
 */
export async function fetchVariantConversions(): Promise<VariantConversionRow[] | null> {
  const rows = await runHogQL(
    `SELECT
       properties.$feature_flag AS flag,
       properties.$feature_flag_response AS variant,
       count(DISTINCT person_id) AS exposed,
       count(DISTINCT IF(person_id IN (
         SELECT DISTINCT person_id FROM events
         WHERE event = 'payment_completed'
           AND timestamp > now() - INTERVAL 30 DAY
       ), person_id, NULL)) AS converted
     FROM events
     WHERE event = '$feature_flag_called'
       AND timestamp > now() - INTERVAL 30 DAY
     GROUP BY flag, variant`,
  );
  if (!rows) return null;
  return rows
    .map((r) => ({
      flag: String(r[0] ?? ''),
      variant: String(r[1] ?? ''),
      exposed: Number(r[2] ?? 0),
      converted: Number(r[3] ?? 0),
    }))
    .filter((r) => r.flag && r.variant);
}

export interface RecentEventRow {
  /** ISO timestamp of the event. */
  timestamp: string;
  /** Event name (e.g. $pageview, tool_used, payment_completed). */
  event: string;
  /** $pathname when present (pageviews / autocapture), else null. */
  pathname: string | null;
  /** distinct_id of the actor (anon hash or authed id). */
  distinctId: string | null;
}

/**
 * The 30 most recent events across the project (last 7 days), newest first.
 * A raw "is tracking alive?" feed for the admin — at low traffic it doubles as
 * a diagnostic (e.g. it makes obvious when an expected event, like a feature-
 * flag exposure, never fires). Returns null on any PostHog failure so the
 * panel degrades to a placeholder.
 */
export async function fetchRecentEvents(): Promise<RecentEventRow[] | null> {
  const rows = await runHogQL(
    `SELECT timestamp, event, properties.$pathname AS path, distinct_id
     FROM events
     WHERE timestamp > now() - INTERVAL 7 DAY
     ORDER BY timestamp DESC
     LIMIT 30`,
  );
  if (!rows) return null;
  return rows
    .map((r) => ({
      timestamp: String(r[0] ?? ''),
      event: String(r[1] ?? ''),
      pathname: r[2] != null && r[2] !== '' ? String(r[2]) : null,
      distinctId: r[3] != null && r[3] !== '' ? String(r[3]) : null,
    }))
    .filter((r) => r.event);
}

/** True iff the personal API key is set; used by the admin page to show a
 *  config warning when live tiles are unavailable. */
export function isPostHogServerConfigured(): boolean {
  return !!KEY;
}

/* -------------------------------------------------------------------------
 * Wave 61.09 — Core Web Vitals.
 *
 * Reads from the `$web_vitals` event emitted by apps/web/src/lib/web-vitals.ts
 * (which forwards web-vitals package metrics — LCP/CLS/INP/FCP/TTFB — to
 * PostHog). Device split uses PostHog's auto-captured `properties.$device_type`
 * (Mobile / Tablet / Desktop).
 *
 * Why this matters for the founder dashboard: mobile-first launch means the
 * mobile LCP/INP/CLS are the conversion-critical numbers — Google ranks them
 * directly for SEO, and they directly affect Vietnamese 4G/3G users on
 * mid-range Androids. Headline KPI is mobile p75 — that's the Core Web
 * Vitals "good/needs-improvement/poor" boundary Google uses.
 * --------------------------------------------------------------------- */

export type WebVitalMetric = 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB';

export interface WebVitalSampleRow {
  metric: WebVitalMetric;
  device: 'Mobile' | 'Desktop' | 'Tablet' | 'Unknown';
  /** 75th-percentile of the metric value (CWV passes use p75). */
  p75: number;
  /** 50th-percentile (median). */
  p50: number;
  /** 95th-percentile (worst-case). */
  p95: number;
  /** Sample size across the 7-day window. */
  samples: number;
}

/**
 * Per-metric × device p50/p75/p95 from $web_vitals events over the last
 * 7 days. Units: LCP/FCP/TTFB = ms, INP = ms, CLS = unitless (×1000 → score).
 *
 * The frontend emits `metric` + `value` props. `$device_type` is set by
 * PostHog's auto-capture from user agent — fall back to "Unknown" when
 * absent so the bucket count stays accurate.
 */
export async function fetchWebVitals(): Promise<WebVitalSampleRow[] | null> {
  const sql = `
    SELECT
      properties.metric AS metric,
      coalesce(nullIf(properties.$device_type, ''), 'Unknown') AS device,
      quantile(0.5)(toFloat(properties.value))  AS p50,
      quantile(0.75)(toFloat(properties.value)) AS p75,
      quantile(0.95)(toFloat(properties.value)) AS p95,
      count() AS samples
    FROM events
    WHERE event = '$web_vitals'
      AND timestamp > now() - INTERVAL 7 DAY
    GROUP BY metric, device
    HAVING samples >= 5
    ORDER BY metric, device
  `;
  const rows = await runHogQL(sql);
  if (!rows) return null;
  return rows
    .map((r) => ({
      metric: String(r[0] ?? '') as WebVitalMetric,
      device: String(r[1] ?? 'Unknown') as WebVitalSampleRow['device'],
      p50: Number(r[2] ?? 0),
      p75: Number(r[3] ?? 0),
      p95: Number(r[4] ?? 0),
      samples: Number(r[5] ?? 0),
    }))
    .filter((r) => r.metric);
}

/* -------------------------------------------------------------------------
 * Wave 61.10 — Sticky CTA conversion (closes the loop on 60.97.B-H rollout).
 *
 * The StickyMobileCta component (apps/web/src/components/marketing/
 * StickyMobileCta.tsx) emits three events keyed by `track_id`:
 *   - sticky_cta_shown      (first reveal per page-load)
 *   - sticky_cta_clicked    (primary CTA tap)
 *   - sticky_cta_dismissed  (user closed the bar)
 *
 * trackIds in use (Wave 60.97.B-H): home, bat-tu, mbti, sample-tu-vi,
 * tu-vi-2026, tu-vi-tinh-yeu, tu-vi-nghe-nghiep, tu-vi-tai-chinh, pricing,
 * tu-vi-hub, sample-report, methodology, community, features, about,
 * lich-van-nien, tu-vi-hom-nay, hop-tuoi, thuoc-lo-ban, can-xuong,
 * than-so-hoc, lo-trinh, timeline, monthly-planning, annual-planning,
 * weekly-review, decision-simulator (27 routes).
 *
 * Founder sees per-route CTR (click / shown) + DR (dismiss / shown) so they
 * can decide where the bar earns its keep vs. where it should be muted via
 * a route-specific PostHog flag.
 * --------------------------------------------------------------------- */

export interface StickyCtaRow {
  track_id: string;
  shown: number;
  clicked: number;
  dismissed: number;
  /** Click-through rate = clicked / shown (0-1). 0 when shown is 0. */
  ctr: number;
  /** Dismissal rate = dismissed / shown (0-1). */
  dr: number;
}

/**
 * Per-trackId sticky CTA funnel over the last 30 days. Joins three event
 * counts in a single HogQL aggregate; UI sorts by shown DESC so the
 * highest-traffic routes float to the top.
 */
export async function fetchStickyCtaFunnel(): Promise<StickyCtaRow[] | null> {
  const sql = `
    SELECT
      properties.track_id AS track_id,
      count(DISTINCT IF(event = 'sticky_cta_shown',     person_id, NULL)) AS shown,
      count(DISTINCT IF(event = 'sticky_cta_clicked',   person_id, NULL)) AS clicked,
      count(DISTINCT IF(event = 'sticky_cta_dismissed', person_id, NULL)) AS dismissed
    FROM events
    WHERE event IN ('sticky_cta_shown', 'sticky_cta_clicked', 'sticky_cta_dismissed')
      AND timestamp > now() - INTERVAL 30 DAY
    GROUP BY track_id
    HAVING shown > 0
    ORDER BY shown DESC
    LIMIT 40
  `;
  const rows = await runHogQL(sql);
  if (!rows) return null;
  return rows
    .map((r) => {
      const shown = Number(r[1] ?? 0);
      const clicked = Number(r[2] ?? 0);
      const dismissed = Number(r[3] ?? 0);
      return {
        track_id: String(r[0] ?? ''),
        shown,
        clicked,
        dismissed,
        ctr: shown > 0 ? clicked / shown : 0,
        dr: shown > 0 ? dismissed / shown : 0,
      };
    })
    .filter((r) => r.track_id);
}

/* -------------------------------------------------------------------------
 * Paid attribution — revenue + paying customers by channel and by tier.
 * --------------------------------------------------------------------- */

export interface PaidByDimensionRow {
  /** Channel name or product tier. */
  key: string;
  /** Distinct persons who fired payment_completed in this bucket. */
  paid_users: number;
  /** Sum of the event's `amount` property (VND). */
  revenue: number;
}

export interface PaidAttribution {
  by_channel: PaidByDimensionRow[];
  by_tier: PaidByDimensionRow[];
}

/**
 * Revenue + paying customers by acquisition channel and by product tier, last
 * 30 days. From the `payment_completed` event, which apps/web fires with
 * { amount, tier } (PaymentClient) — so `properties.amount` (VND) and
 * `properties.tier` are summable, and PostHog auto-captures the person's
 * $initial_utm_source / $initial_referring_domain for channel.
 *
 * NOTE: PostHog payment_completed is client-fired + consent-gated, so this is a
 * directional LOWER BOUND, not the canonical revenue (that's the worker's
 * txn:log). The value here is the BREAKDOWN — which channel / tier brings
 * paying customers + how much — which the KV total can't give. Null on failure.
 */
export async function fetchPaidAttribution(): Promise<PaidAttribution | null> {
  const byChannelSql = `
    SELECT
      coalesce(
        nullIf(properties.$initial_utm_source, ''),
        nullIf(properties.$initial_referring_domain, ''),
        'direct'
      ) AS channel,
      count(DISTINCT person_id) AS paid_users,
      sum(toFloat(properties.amount)) AS revenue
    FROM events
    WHERE event = 'payment_completed'
      AND timestamp > now() - INTERVAL 30 DAY
    GROUP BY channel
    ORDER BY revenue DESC
    LIMIT 12
  `;
  const byTierSql = `
    SELECT
      coalesce(nullIf(properties.tier, ''), '(không rõ)') AS tier,
      count(DISTINCT person_id) AS paid_users,
      sum(toFloat(properties.amount)) AS revenue
    FROM events
    WHERE event = 'payment_completed'
      AND timestamp > now() - INTERVAL 30 DAY
    GROUP BY tier
    ORDER BY revenue DESC
    LIMIT 12
  `;
  const [chRows, tiRows] = await Promise.all([runHogQL(byChannelSql), runHogQL(byTierSql)]);
  if (!chRows && !tiRows) return null;
  const project = (rows: unknown[][] | null): PaidByDimensionRow[] =>
    (rows ?? [])
      .map((r) => ({
        key: String(r[0] ?? ''),
        paid_users: Number(r[1] ?? 0),
        revenue: Number(r[2] ?? 0),
      }))
      .filter((r) => r.key);
  return { by_channel: project(chRows), by_tier: project(tiRows) };
}

/* -------------------------------------------------------------------------
 * Wave 61.08 — Cohort retention + acquisition channel + funnel.
 * --------------------------------------------------------------------- */

export interface CohortRow {
  /** ISO Monday of the cohort week (week user first appeared). */
  cohort_week: string;
  /** Distinct users in the cohort (first-event users that week). */
  cohort_size: number;
  /** Distinct users that returned 1, 2, 3, 4 weeks later (raw counts). */
  w1: number;
  w2: number;
  w3: number;
  w4: number;
}

/**
 * Weekly retention cohorts — past 8 weeks.
 *
 * Buckets users into the week of their FIRST event (cohort_week), then counts
 * how many came back in weeks 1-4 after. UI converts to percentages. Uses a
 * conservative `toMonday()` bucket so weeks line up regardless of TZ.
 */
export async function fetchCohortRetention(): Promise<CohortRow[] | null> {
  const sql = `
    WITH cohort AS (
      SELECT person_id, toMonday(min(timestamp)) AS cohort_week
      FROM events
      WHERE timestamp > now() - INTERVAL 60 DAY
      GROUP BY person_id
    )
    SELECT
      cohort.cohort_week AS cohort,
      count(DISTINCT cohort.person_id) AS cohort_size,
      count(DISTINCT IF(toMonday(e.timestamp) = cohort.cohort_week + INTERVAL 7 DAY, e.person_id, NULL)) AS w1,
      count(DISTINCT IF(toMonday(e.timestamp) = cohort.cohort_week + INTERVAL 14 DAY, e.person_id, NULL)) AS w2,
      count(DISTINCT IF(toMonday(e.timestamp) = cohort.cohort_week + INTERVAL 21 DAY, e.person_id, NULL)) AS w3,
      count(DISTINCT IF(toMonday(e.timestamp) = cohort.cohort_week + INTERVAL 28 DAY, e.person_id, NULL)) AS w4
    FROM cohort
    JOIN events AS e ON e.person_id = cohort.person_id
    GROUP BY cohort
    ORDER BY cohort DESC
    LIMIT 8
  `;
  const rows = await runHogQL(sql);
  if (!rows) return null;
  return rows.map((r) => ({
    cohort_week: String(r[0] ?? ''),
    cohort_size: Number(r[1] ?? 0),
    w1: Number(r[2] ?? 0),
    w2: Number(r[3] ?? 0),
    w3: Number(r[4] ?? 0),
    w4: Number(r[5] ?? 0),
  }));
}

export interface AcquisitionChannelRow {
  channel: string;
  users: number;
}

/**
 * Acquisition split — distinct users by initial UTM source (or referring
 * domain when UTM is missing) over the last 30 days. `$direct` means no
 * referrer (typed URL, bookmark, deep-link).
 */
export async function fetchAcquisitionChannels(): Promise<
  AcquisitionChannelRow[] | null
> {
  const sql = `
    SELECT
      coalesce(
        nullIf(properties.$initial_utm_source, ''),
        nullIf(properties.$initial_referring_domain, ''),
        'unknown'
      ) AS channel,
      count(DISTINCT person_id) AS users
    FROM events
    WHERE timestamp > now() - INTERVAL 30 DAY
    GROUP BY channel
    ORDER BY users DESC
    LIMIT 10
  `;
  const rows = await runHogQL(sql);
  if (!rows) return null;
  return rows
    .map((r) => ({ channel: String(r[0] ?? ''), users: Number(r[1] ?? 0) }))
    .filter((r) => r.channel);
}

export interface FunnelStepRow {
  /** Step name (matches event taxonomy). */
  step: string;
  /** Distinct users that reached this step within the funnel window. */
  users: number;
  /** Conversion vs first step (0-1). UI multiplies × 100. */
  rate: number;
}

/**
 * Acquisition funnel — last 30 days.
 *
 * Each step counts distinct persons that fired the matching event AFTER they
 * fired the previous step. PostHog has a richer funnel API, but for an
 * at-a-glance KPI tile a per-step distinct-count is sufficient and far
 * simpler to render. UI shows step name, count, conv-% vs step 1.
 *
 * Events used — all VERIFIED to fire from apps/web (not aspirational). The
 * previous version queried `reading_started` / `reading_completed`, which are
 * defined in event-taxonomy.ts but never actually `track()`-ed anywhere, so
 * steps 3-4 always returned 0. Rewired to the real session/report/payment
 * events so the funnel reflects historical data immediately (no backfill).
 *   1. $pageview                 — landed on any page
 *   2. reading_session_created   — created a reading session (started)
 *   3. survey_completed          — finished the onboarding survey
 *   4. report_viewed             — viewed the finished report (completed)
 *   5. payment_completed         — unlocked / paid
 */
export async function fetchAcquisitionFunnel(): Promise<FunnelStepRow[] | null> {
  const sql = `
    SELECT
      count(DISTINCT IF(event = '$pageview', person_id, NULL))                AS s1,
      count(DISTINCT IF(event = 'reading_session_created', person_id, NULL))  AS s2,
      count(DISTINCT IF(event = 'survey_completed', person_id, NULL))         AS s3,
      count(DISTINCT IF(event = 'report_viewed', person_id, NULL))            AS s4,
      count(DISTINCT IF(event = 'payment_completed', person_id, NULL))        AS s5
    FROM events
    WHERE timestamp > now() - INTERVAL 30 DAY
  `;
  const rows = await runHogQL(sql);
  if (!rows || !rows[0]) return null;
  const s1 = Number(rows[0][0] ?? 0);
  const s2 = Number(rows[0][1] ?? 0);
  const s3 = Number(rows[0][2] ?? 0);
  const s4 = Number(rows[0][3] ?? 0);
  const s5 = Number(rows[0][4] ?? 0);
  const safeRate = (n: number) => (s1 > 0 ? n / s1 : 0);
  return [
    { step: 'Ghé trang', users: s1, rate: 1 },
    { step: 'Bắt đầu phiên đọc', users: s2, rate: safeRate(s2) },
    { step: 'Hoàn tất khảo sát', users: s3, rate: safeRate(s3) },
    { step: 'Xem báo cáo', users: s4, rate: safeRate(s4) },
    { step: 'Thanh toán', users: s5, rate: safeRate(s5) },
  ];
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
  /** Wave 61.11 — extended fields for richer admin display. */
  tags: string[];
  /** ISO timestamp of last flag evaluation (PostHog `last_called_at`). */
  last_called_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  /** Number of release-condition groups (>1 means complex targeting). */
  group_count: number;
  /** PostHog UI lifecycle: ACTIVE / STALE / DELETED. */
  status: string;
  evaluation_runtime: string;
  /** True iff the flag has multivariate variants (not a boolean flag). */
  is_multivariate: boolean;
}

interface FlagListResponse {
  results?: Array<{
    id: number;
    key: string;
    name?: string;
    active?: boolean;
    rollout_percentage?: number | null;
    tags?: string[];
    last_called_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    status?: string;
    evaluation_runtime?: string;
    filters?: {
      groups?: Array<{ rollout_percentage?: number; properties?: unknown[] }>;
      multivariate?: {
        variants?: Array<{ key: string; rollout_percentage: number; name?: string }>;
      };
    };
  }>;
}

/**
 * List the project's feature flags via REST. Returns null on any failure.
 * Rollout-% is normalised: prefer top-level field, fallback to first
 * release-condition group's `rollout_percentage`, then 0.
 *
 * Wave 61.11 — richer field mapping (tags, last_called_at, dates, status,
 * group_count, evaluation_runtime, is_multivariate) so the admin
 * /experiments page can render comprehensive info per flag without
 * additional round-trips.
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
      const variants = f.filters?.multivariate?.variants;
      return {
        id: f.id,
        key: f.key,
        name: f.name ?? f.key,
        active: f.active ?? false,
        rollout_percentage: rollout,
        filters: f.filters,
        variants,
        tags: f.tags ?? [],
        last_called_at: f.last_called_at ?? null,
        created_at: f.created_at ?? null,
        updated_at: f.updated_at ?? null,
        group_count: f.filters?.groups?.length ?? 0,
        status: f.status ?? (f.active ? 'ACTIVE' : 'INACTIVE'),
        evaluation_runtime: f.evaluation_runtime ?? 'all',
        is_multivariate: Boolean(variants && variants.length > 0),
      };
    });
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------
 * P1 — PostHog Experiments (the actual A/B tests, distinct from raw flags).
 *
 * The /experiments page listed feature FLAGS but never the formal PostHog
 * Experiment entities — so a founder running an A/B test couldn't see, from
 * the admin, whether it was even collecting data. This list-only REST read
 * surfaces each experiment's name, linked flag, status and start date; the
 * page cross-references the linked flag against the existing per-variant
 * conversion read (fetchVariantConversions) to show exposure + conversion,
 * and links out to PostHog for rigorous Bayesian significance.
 * --------------------------------------------------------------------- */

export interface PostHogExperiment {
  id: number;
  name: string;
  /** Linked feature-flag key — joins to VariantConversionRow.flag. */
  flagKey: string;
  /** running / draft / stopped / complete / paused. */
  status: string;
  /** ISO launch timestamp; null while still a draft. */
  startDate: string | null;
  /** Primary metric label (e.g. "Sign-up completion"), best-effort. */
  primaryMetricName: string | null;
}

interface ExperimentListResponse {
  results?: Array<{
    id: number;
    name?: string;
    feature_flag_key?: string | null;
    start_date?: string | null;
    archived?: boolean;
    status?: string;
    metrics?: Array<{ name?: string }>;
  }>;
}

/**
 * List the project's (non-archived) experiments via REST. Returns null on any
 * failure so the page degrades to the flag roster alone. Newest first.
 */
export async function fetchPostHogExperiments(): Promise<PostHogExperiment[] | null> {
  if (!KEY) return null;
  try {
    const res = await fetch(
      `${HOST}/api/projects/${PROJECT_ID}/experiments/?limit=100`,
      {
        headers: { Authorization: `Bearer ${KEY}` },
        next: { revalidate: REVALIDATE_SECONDS, tags: ['posthog'] },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ExperimentListResponse;
    return (data.results ?? [])
      .filter((e) => !e.archived && e.feature_flag_key)
      .map((e) => ({
        id: e.id,
        name: e.name ?? `Experiment ${e.id}`,
        flagKey: e.feature_flag_key as string,
        status: e.status ?? 'unknown',
        startDate: e.start_date ?? null,
        primaryMetricName: e.metrics?.[0]?.name ?? null,
      }));
  } catch {
    return null;
  }
}
