/**
 * Wave 41 Track A — First-party attribution capture.
 *
 * Captures UTM + click-IDs (FB / Google Ads / TikTok / Microsoft / Twitter /
 * DoubleClick) and the existing `hieu_ref` affiliate code from the URL on
 * first visit. Persists to:
 *
 *   - localStorage `hieu.attr`              (long-lived, dedup, full payload)
 *   - first-party cookie `hieu_attr`        (90d TTL, SameSite=Lax, Secure)
 *
 * Maintains BOTH first-touch (set once, never overwritten) and last-touch
 * (refreshed every page load when a new attribution param is present).
 *
 * Idempotent — safe to call on every navigation. Run before any user
 * interaction so the rest of the app + PostHog identify can read the values.
 *
 * Privacy: pure first-party. No third-party SDK loaded by this module. All
 * data stays on this origin until explicitly forwarded by PostHog / Worker.
 */

import { getPostHog } from "./posthog";

const STORAGE_KEY = "hieu.attr";
const COOKIE_NAME = "hieu_attr";
const COOKIE_TTL_DAYS = 90;

/**
 * Wave 41.7 — compute apex domain from current hostname for cross-subdomain
 * cookies. Returns `.hieu.asia` on hieu.asia + www.hieu.asia + api.hieu.asia.
 * Returns `null` on localhost / preview deploys (no Domain= attribute set).
 */
function computeApexDomain(): string | null {
  try {
    const host = window.location.hostname;
    if (!host) return null;
    // Skip localhost / IPv4 / single-label hosts.
    if (host === "localhost" || /^\d/.test(host) || !host.includes(".")) return null;
    // Vercel preview URLs (*.vercel.app) — keep host-scoped.
    if (host.endsWith(".vercel.app")) return null;
    // For everything else (apex + subdomains), use last two labels.
    const parts = host.split(".");
    if (parts.length < 2) return null;
    return "." + parts.slice(-2).join(".");
  } catch {
    return null;
  }
}

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const CLICK_ID_KEYS = [
  "fbclid", // Facebook
  "gclid", // Google Ads
  "ttclid", // TikTok
  "msclkid", // Microsoft / Bing
  "twclid", // Twitter / X
  "dclid", // DoubleClick
] as const;

const REF_KEYS = ["hieu_ref"] as const;

const ALL_KEYS = [...UTM_KEYS, ...CLICK_ID_KEYS, ...REF_KEYS] as const;

type AttrKey = (typeof ALL_KEYS)[number];

export interface AttributionTouch {
  ts: number; // epoch ms
  url?: string;
  referrer?: string;
  referring_domain?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  msclkid?: string;
  twclid?: string;
  dclid?: string;
  hieu_ref?: string;
}

export interface AttributionState {
  first_touch: AttributionTouch;
  last_touch: AttributionTouch;
  current_visit: AttributionTouch;
}

function readStorage(): AttributionState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AttributionState;
    if (!parsed?.first_touch || !parsed?.last_touch) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(state: AttributionState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore (Safari private mode / quota) */
  }
  // Mirror short form to cookie so the Worker (Track F) can read attribution
  // server-side. Cookie carries only last_touch + first_touch source +
  // affiliate ref to stay well under 4KB.
  try {
    const compact = {
      f: state.first_touch.utm_source ?? state.first_touch.referring_domain ?? null,
      fc: state.first_touch.utm_campaign ?? null,
      l: state.last_touch.utm_source ?? state.last_touch.referring_domain ?? null,
      lc: state.last_touch.utm_campaign ?? null,
      r: state.first_touch.hieu_ref ?? state.last_touch.hieu_ref ?? null,
    };
    const value = encodeURIComponent(JSON.stringify(compact));
    const maxAge = COOKIE_TTL_DAYS * 86400;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    // Wave 41.7 — set Domain=.hieu.asia so api.hieu.asia worker can also
    // read the cookie for server-side enrichment.
    const apexDomain = computeApexDomain();
    const domain = apexDomain ? `; Domain=${apexDomain}` : "";
    document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}${domain}`;
  } catch {
    /* ignore */
  }
}

function parseCurrent(): AttributionTouch {
  const touch: AttributionTouch = { ts: Date.now() };
  try {
    touch.url = window.location.href;
  } catch {
    /* ignore */
  }
  try {
    const ref = document.referrer;
    if (ref) {
      touch.referrer = ref;
      try {
        touch.referring_domain = new URL(ref).hostname;
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of ALL_KEYS) {
      const v = params.get(key);
      if (v) {
        // Clamp each value to 200 chars — guards against URL stuffing abuse
        // (e.g. tracking parasites that pack JSON into utm_campaign).
        (touch as unknown as Record<AttrKey, string>)[key] = v.slice(0, 200);
      }
    }
  } catch {
    /* ignore */
  }
  return touch;
}

function hasAttribution(t: AttributionTouch): boolean {
  for (const key of ALL_KEYS) {
    if ((t as unknown as Record<string, unknown>)[key]) return true;
  }
  // Treat "user came from a real referring domain that isn't ours" as a
  // last-touch update — without this, organic search wins are invisible.
  if (t.referring_domain && !/(^|\.)hieu\.asia$/i.test(t.referring_domain)) {
    return true;
  }
  return false;
}

/**
 * Read the current attribution state without mutating it. Returns `null` on
 * SSR or before `captureAttribution()` has ever run.
 */
export function getAttribution(): AttributionState | null {
  if (typeof window === "undefined") return null;
  return readStorage();
}

/**
 * Capture attribution from the current URL. Idempotent. Returns the merged
 * state (or `null` on SSR).
 *
 * Behaviour:
 *   - First call ever → first_touch = last_touch = current_visit.
 *   - Subsequent calls with new attribution params → last_touch refreshed.
 *   - Subsequent calls with NO new params → state preserved; current_visit
 *     still updated so consumers can see the active URL.
 */
export function captureAttribution(): AttributionState | null {
  if (typeof window === "undefined") return null;
  const current = parseCurrent();
  const existing = readStorage();

  let state: AttributionState;
  if (!existing) {
    state = {
      first_touch: current,
      last_touch: current,
      current_visit: current,
    };
  } else {
    state = {
      first_touch: existing.first_touch,
      last_touch: hasAttribution(current) ? current : existing.last_touch,
      current_visit: current,
    };
  }
  writeStorage(state);

  // Push to PostHog as person + super properties so funnels segment by
  // attribution out of the box. `$initial_referring_domain` is the canonical
  // first-touch field PostHog already knows; we extend with our own.
  try {
    const ph = getPostHog();
    if (ph) {
      const personProps: Record<string, unknown> = {};
      const setOnceProps: Record<string, unknown> = {};

      if (state.first_touch.utm_source)
        setOnceProps.first_touch_source = state.first_touch.utm_source;
      if (state.first_touch.utm_medium)
        setOnceProps.first_touch_medium = state.first_touch.utm_medium;
      if (state.first_touch.utm_campaign)
        setOnceProps.first_touch_campaign = state.first_touch.utm_campaign;
      if (state.first_touch.referring_domain)
        setOnceProps.$initial_referring_domain = state.first_touch.referring_domain;
      if (state.first_touch.hieu_ref)
        setOnceProps.first_touch_affiliate = state.first_touch.hieu_ref;

      if (state.last_touch.utm_source)
        personProps.last_touch_source = state.last_touch.utm_source;
      if (state.last_touch.utm_medium)
        personProps.last_touch_medium = state.last_touch.utm_medium;
      if (state.last_touch.utm_campaign)
        personProps.last_touch_campaign = state.last_touch.utm_campaign;
      if (state.last_touch.referring_domain)
        personProps.$referring_domain = state.last_touch.referring_domain;
      // Click-IDs on last touch help reconcile back to ad accounts.
      for (const cid of CLICK_ID_KEYS) {
        const v = state.last_touch[cid];
        if (v) personProps[`last_touch_${cid}`] = v;
      }

      // `register` makes these stick as super-properties on every subsequent
      // event in this session — independent of identify state.
      if (Object.keys(personProps).length > 0) {
        ph.register(personProps);
      }
      if (Object.keys(setOnceProps).length > 0) {
        // `register_once` only writes first-time; survives logout/identify.
        ph.register_once(setOnceProps);
      }

      // people.set / set_once when we have a person profile (identified user).
      try {
        const peopleApi = (ph as unknown as {
          people?: {
            set?: (p: Record<string, unknown>) => void;
            set_once?: (p: Record<string, unknown>) => void;
          };
        }).people;
        if (peopleApi?.set && Object.keys(personProps).length > 0) {
          peopleApi.set(personProps);
        }
        if (peopleApi?.set_once && Object.keys(setOnceProps).length > 0) {
          peopleApi.set_once(setOnceProps);
        }
      } catch {
        /* ignore — people API not present in v1.x autocapture builds */
      }
    }
  } catch {
    /* ignore */
  }

  return state;
}

/**
 * React hook — returns the current attribution state and re-captures on mount.
 * Safe in any client component. Returns `null` on first render / SSR.
 */
export function useAttribution(): AttributionState | null {
  if (typeof window === "undefined") return null;
  // No useState/useEffect import here — kept as a side-effect-free reader to
  // avoid making attribution.ts a React-only module. Components that want a
  // reactive value can wrap captureAttribution() in their own useEffect.
  return captureAttribution();
}
