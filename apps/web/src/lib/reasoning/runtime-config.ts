/**
 * Wave 56 Phase 2.6.D — Reasoning runtime config via Vercel Edge Config.
 *
 * Lets us flip these knobs without a redeploy:
 *
 *   - `tierOverride` — force every reasoning call to `cheap` (cost panic)
 *     or `top` (quality test for a single day). null = use the tier each
 *     call site already requests.
 *   - `killSwitch` — disable all reasoning routes globally. Used during
 *     vendor outage or post-incident triage. Returns 503 with explanation.
 *   - `capUsdPerDayAnon` — daily $ budget per anonymous visitor.
 *   - `capUsdPerDayAuthed` — daily $ budget per authenticated user.
 *   - `capUsdGlobalDay` — optional global ceiling across ALL users for the
 *     day. Once breached, every request returns 503 until UTC midnight.
 *     Used as the "circuit breaker of last resort" if a bug causes a flood.
 *
 * Why Edge Config (not env vars):
 *   - <15ms reads at edge — no DB round trip on the hot path
 *   - Updates propagate in ~seconds, no rebuild
 *   - Cached per-request in this module (line-level memo) so we hit Edge
 *     Config at most once per Function invocation
 *
 * Why not Supabase: we don't want every reasoning request to round-trip to
 * Supabase just to read knobs that change once a month. Edge Config is
 * purpose-built for this.
 *
 * Fallback: if Edge Config is unreachable OR the EDGE_CONFIG env var is
 * unset (e.g. local dev), `getReasoningConfig()` returns the defaults below.
 * This means turning on a kill switch via Edge Config has propagation lag
 * if the connection is briefly down — acceptable since the kill switch is
 * for cost panic, not security.
 *
 * Adding/changing keys: edit the `EdgeConfigShape` type AND `DEFAULTS` and
 * update vault 94 "Reasoning runtime config" section.
 */

import { get } from '@vercel/edge-config';

/** Shape of the `reasoning` key in Edge Config. All fields optional. */
interface EdgeConfigShape {
  reasoning?: {
    /** Force every call to this tier. `null` = use call-site default. */
    tierOverride?: 'cheap' | 'mid' | 'top' | null;
    /** Global kill switch — reasoning routes return 503. */
    killSwitch?: boolean;
    /** Per-day $ cap for anonymous (no user_id) visitors. */
    capUsdPerDayAnon?: number;
    /** Per-day $ cap for authenticated users. */
    capUsdPerDayAuthed?: number;
    /** Optional global $ cap (all users combined) per day. 0 = disabled. */
    capUsdGlobalDay?: number;
    /** Human-readable reason shown when killSwitch is true. */
    killSwitchReason?: string;
  };
}

export interface ReasoningRuntimeConfig {
  tierOverride: 'cheap' | 'mid' | 'top' | null;
  killSwitch: boolean;
  killSwitchReason: string;
  capUsdPerDayAnon: number;
  capUsdPerDayAuthed: number;
  capUsdGlobalDay: number;
}

/**
 * Compile-time defaults — used if Edge Config is unset, unreachable, or the
 * `reasoning` key is missing. Conservative: low caps, no kill switch.
 *
 * Cap calibration (Phase 2.6 launch):
 *   - Tử Vi full reading ~$1.74, Bát Tự ~$1.01, Palm ~$0.40
 *   - Anon $0.50/day = 0 readings + 1 abort attempt (intentionally tight —
 *     anon visitors should sign up to do real readings)
 *   - Authed $5/day = ~3 full Tử Vi readings, plenty for normal use
 *   - Global $50/day = ~25-30 readings before circuit breaker; founder gets
 *     PostHog alert if breached so they can investigate before next day
 *
 * Adjust via Edge Config once production usage stabilizes.
 */
const DEFAULTS: ReasoningRuntimeConfig = {
  tierOverride: null,
  killSwitch: false,
  killSwitchReason: '',
  capUsdPerDayAnon: 0.5,
  capUsdPerDayAuthed: 5,
  capUsdGlobalDay: 50,
};

let _cache: { value: ReasoningRuntimeConfig; expiresAt: number } | null = null;
const CACHE_TTL_MS = 30_000; // 30s — short enough that flipping killSwitch
                              // takes effect within a half-minute, long enough
                              // that bursty traffic doesn't pound Edge Config.

/**
 * Read the reasoning runtime config. Cached per-Function-instance for 30s.
 *
 * NEVER throws: Edge Config errors fall through to DEFAULTS. The route is
 * responsible for failing CLOSED on cap rejection (return 402) — never fail
 * open just because Edge Config is briefly down.
 */
export async function getReasoningConfig(): Promise<ReasoningRuntimeConfig> {
  const now = Date.now();
  if (_cache && _cache.expiresAt > now) return _cache.value;

  const merged: ReasoningRuntimeConfig = { ...DEFAULTS };
  try {
    const raw = (await get('reasoning')) as EdgeConfigShape['reasoning'] | undefined;
    if (raw && typeof raw === 'object') {
      if (raw.tierOverride === null || raw.tierOverride === 'cheap' || raw.tierOverride === 'mid' || raw.tierOverride === 'top') {
        merged.tierOverride = raw.tierOverride;
      }
      if (typeof raw.killSwitch === 'boolean') merged.killSwitch = raw.killSwitch;
      if (typeof raw.killSwitchReason === 'string') merged.killSwitchReason = raw.killSwitchReason;
      if (typeof raw.capUsdPerDayAnon === 'number' && raw.capUsdPerDayAnon > 0) {
        merged.capUsdPerDayAnon = raw.capUsdPerDayAnon;
      }
      if (typeof raw.capUsdPerDayAuthed === 'number' && raw.capUsdPerDayAuthed > 0) {
        merged.capUsdPerDayAuthed = raw.capUsdPerDayAuthed;
      }
      if (typeof raw.capUsdGlobalDay === 'number' && raw.capUsdGlobalDay >= 0) {
        merged.capUsdGlobalDay = raw.capUsdGlobalDay;
      }
    }
  } catch {
    // Edge Config not configured (local dev) or transient error — defaults.
  }

  _cache = { value: merged, expiresAt: now + CACHE_TTL_MS };
  return merged;
}

/** Test-only: bust the cache (the daily cron / admin "refresh" button uses this). */
export function _resetReasoningConfigCache() {
  _cache = null;
}
