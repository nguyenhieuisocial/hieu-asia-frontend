/**
 * Ahrefs API v3 (Site Explorer) — server-only client for the admin /seo page.
 *
 * Surfaces the competitive-SEO lens that Google Search Console can't: Domain
 * Rating, backlink / referring-domain counts, and organic keyword/traffic
 * estimates for the site. GSC = our own search performance; Ahrefs = how strong
 * the domain is vs. the web + who links to us.
 *
 * Auth:   Authorization: Bearer <AHREFS_API_KEY>   (Site Explorer v3)
 * Target: AHREFS_TARGET env, default "hieu.asia".
 *
 * COST: Ahrefs bills "API units" per call (min 50/request) against a limited
 * monthly quota, so every fetch is cached HARD (24h) via the Next Data Cache —
 * we never hammer it. The panel is a daily snapshot, not real-time.
 *
 * Every helper returns null when the key is unset (the UI renders a setup card)
 * or on any failure (network / non-2xx / malformed), mirroring posthog-server's
 * degrade-gracefully contract so the SEO page never crashes on Ahrefs downtime.
 */

import 'server-only';

const KEY = process.env.AHREFS_API_KEY;
const TARGET = process.env.AHREFS_TARGET ?? 'hieu.asia';
const BASE = 'https://api.ahrefs.com/v3/site-explorer';
// Ahrefs charges units per call — refetch at most once per day per metric.
const REVALIDATE_SECONDS = 86_400;

export interface AhrefsOverview {
  target: string;
  /** Snapshot date (YYYY-MM-DD) the metrics were requested for. */
  date: string;
  /** 0-100 logarithmic strength of the backlink profile. */
  domainRating: number | null;
  ahrefsRank: number | null;
  liveBacklinks: number | null;
  liveRefdomains: number | null;
  allTimeBacklinks: number | null;
  orgKeywords: number | null;
  orgKeywordsTop3: number | null;
  /** Estimated monthly organic visitors. */
  orgTraffic: number | null;
  /** Estimated monthly organic-traffic value, USD (converted from API cents). */
  orgTrafficValueUsd: number | null;
}

/** True iff the Ahrefs key is configured; the page shows a setup card otherwise. */
export function isAhrefsConfigured(): boolean {
  return !!KEY;
}

/**
 * One Site Explorer GET. Fixed literal `path`; `params` values are our own
 * (target/date/mode), never user input. Returns null on any failure so a single
 * endpoint's error never nulls the whole overview.
 */
async function ah<T>(path: string, params: Record<string, string>): Promise<T | null> {
  if (!KEY) return null;
  const qs = new URLSearchParams({ ...params, output: 'json' }).toString();
  try {
    const res = await fetch(`${BASE}/${path}?${qs}`, {
      headers: { Authorization: `Bearer ${KEY}`, Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS, tags: ['ahrefs'] },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Combined Ahrefs snapshot for the configured target: Domain Rating +
 * backlinks/referring-domains + organic keywords/traffic. Three v3 endpoints run
 * in parallel. `mode: subdomains` = the whole site (target + all subdomains).
 * Returns null when unconfigured or when ALL three calls failed.
 */
export async function fetchAhrefsOverview(): Promise<AhrefsOverview | null> {
  if (!KEY) return null;
  const date = new Date().toISOString().slice(0, 10);
  const site = { target: TARGET, date, mode: 'subdomains' };
  const [dr, bl, mx] = await Promise.all([
    // domain-rating takes no `mode` param.
    ah<{ domain_rating?: { domain_rating?: number | null; ahrefs_rank?: number | null } }>(
      'domain-rating',
      { target: TARGET, date },
    ),
    ah<{ metrics?: { live?: number; live_refdomains?: number; all_time?: number } }>(
      'backlinks-stats',
      site,
    ),
    ah<{
      metrics?: {
        org_keywords?: number;
        org_keywords_1_3?: number;
        org_traffic?: number;
        org_cost?: number | null;
      };
    }>('metrics', site),
  ]);

  if (!dr && !bl && !mx) return null;

  const cents = mx?.metrics?.org_cost ?? null;
  return {
    target: TARGET,
    date,
    domainRating: dr?.domain_rating?.domain_rating ?? null,
    ahrefsRank: dr?.domain_rating?.ahrefs_rank ?? null,
    liveBacklinks: bl?.metrics?.live ?? null,
    liveRefdomains: bl?.metrics?.live_refdomains ?? null,
    allTimeBacklinks: bl?.metrics?.all_time ?? null,
    orgKeywords: mx?.metrics?.org_keywords ?? null,
    orgKeywordsTop3: mx?.metrics?.org_keywords_1_3 ?? null,
    orgTraffic: mx?.metrics?.org_traffic ?? null,
    orgTrafficValueUsd: cents != null ? Math.round(cents / 100) : null,
  };
}
