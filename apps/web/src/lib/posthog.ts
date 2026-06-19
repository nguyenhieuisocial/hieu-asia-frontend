/**
 * PostHog client — browser-only singleton.
 *
 * Runs alongside Plausible. Plausible counts pageviews on the landing page;
 * PostHog handles session replay, funnels, feature flags, surveys, web vitals
 * and group analytics for the app shell.
 *
 * GDPR: respects `localStorage['hieu.user.preferences'].privacy.analytics_opt_in`
 * — when `false`, `opt_out_capturing()` is called on init so nothing leaves
 * the browser.
 *
 * Super-properties (registered once on init, attached to every event):
 *   app_version, build_env, platform, locale, timezone, screen_resolution,
 *   viewport, pixel_ratio, connection_type, prefers_reduced_motion,
 *   prefers_dark_mode.
 */

import posthog, { type PostHog } from "posthog-js";
import { getOrCreateAnonUserId } from "@hieu-asia/supabase";

const PREFS_KEY = "hieu.user.preferences";
const DEFAULT_HOST = "https://us.i.posthog.com";
const APP_VERSION = "v2.3";

let _initialized = false;
let _disabled = false;

function isOptedOut(): boolean {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      privacy?: { analytics_opt_in?: boolean };
    };
    return parsed?.privacy?.analytics_opt_in === false;
  } catch {
    return false;
  }
}

/**
 * Read Wave 41 CMP consent state directly (avoids cyclic import with
 * `consent.ts`, which itself imports from `posthog.ts`). Returns `false`
 * if the user has not yet recorded an explicit `analytics:true`.
 */
function hasAnalyticsConsent(): boolean {
  try {
    return window.localStorage.getItem("hieu.consent.analytics") === "true";
  } catch {
    return false;
  }
}

interface NavigatorConnection {
  effectiveType?: string;
}

function buildSuperProperties(): Record<string, unknown> {
  const props: Record<string, unknown> = {
    app_version: APP_VERSION,
    build_env: process.env.NODE_ENV,
    platform: "web",
  };
  try {
    props.locale = navigator.language;
  } catch {
    /* ignore */
  }
  try {
    props.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    /* ignore */
  }
  try {
    props.screen_resolution = `${window.screen.width}x${window.screen.height}`;
    props.viewport = `${window.innerWidth}x${window.innerHeight}`;
    props.pixel_ratio = window.devicePixelRatio;
  } catch {
    /* ignore */
  }
  try {
    const conn = (
      navigator as Navigator & { connection?: NavigatorConnection }
    ).connection;
    if (conn?.effectiveType) props.connection_type = conn.effectiveType;
  } catch {
    /* ignore */
  }
  try {
    props.prefers_reduced_motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    props.prefers_dark_mode = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
  } catch {
    /* ignore */
  }
  return props;
}

/**
 * Returns the PostHog client singleton (initialised on first call).
 * Returns `null` when the public key is missing or we're on the server.
 */
export function getPostHog(): PostHog | null {
  if (typeof window === "undefined") return null;
  if (_disabled) return null;
  if (_initialized) return posthog;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    _disabled = true;
    return null;
  }
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? DEFAULT_HOST;

  // Use our `anon_<uuid>` as PostHog's distinct_id so every event (autocapture +
  // custom track()) and the login-time `ph.alias(user.id, anonId)` all key off the
  // SAME id — which is also the id the backend accepts for pre-login reading
  // history. `isIdentifiedID: false` keeps the visitor anonymous (event-only),
  // honouring `person_profiles: "identified_only"`. Only applied on first init;
  // returning visitors keep their stored distinct_id (acceptable pre-launch).
  const anonId = getOrCreateAnonUserId();

  posthog.init(key, {
    api_host: host,
    bootstrap: anonId
      ? { distinctID: anonId, isIdentifiedID: false }
      : undefined,
    // GDPR / ePrivacy: opt out of capturing until the CMP banner records
    // explicit `analytics:true`. PostHog SDK still loads (so feature flags
    // and surveys can be evaluated) but autocapture/$pageview don't ship
    // events until `optInPostHog()` is called after consent.
    opt_out_capturing_by_default: true,
    // Pageviews: we fire `$pageview` manually on App Router navigations.
    capture_pageview: false,
    // Page leaves: enables accurate bounce / time-on-page (auto in v1.50+).
    capture_pageleave: true,
    // Session replay (Recordings) — needed for UX debug & funnel review.
    disable_session_recording: false,
    // Autocapture: clicks, form submits, change events → also powers Heatmaps.
    autocapture: true,
    // Heatmaps: PostHog v1.95+ — explicit opt-in so the toolbar can render them.
    enable_heatmaps: true,
    // Exception auto-capture — hooks window.onerror + unhandledrejection.
    // Removes the need for a manual error boundary integration.
    capture_exceptions: true,
    // Web Vitals + paint metrics (we also forward typed events via web-vitals.ts).
    capture_performance: true,
    // Privacy: don't capture console logs in recordings (may leak tokens/PII).
    enable_recording_console_log: false,
    // Privacy: honour the browser's "Do Not Track" header.
    respect_dnt: true,
    // Privacy: only create person profiles for identified users — anonymous
    // visitors stay in event-only mode (cheaper + GDPR-friendly).
    person_profiles: "identified_only",
    // Persistence: localStorage for distinct_id continuity, cookie for SSR.
    cross_subdomain_cookie: true,
    persistence: "localStorage+cookie",
    session_recording: {
      // We do NOT mask all text — we want readable replays for UX work.
      // Sensitive fields are masked individually via `.posthog-mask` class or
      // the password/credit-card auto-mask below.
      maskAllInputs: false,
      maskTextSelector: ".posthog-mask",
      maskInputOptions: {
        password: true,
        email: false,
      },
    },
    loaded: (ph) => {
      try {
        ph.register(buildSuperProperties());
      } catch {
        /* ignore */
      }
    },
  });

  // Legacy preferences key opt-out still honoured.
  if (isOptedOut()) {
    posthog.opt_out_capturing();
  }

  // Wave 41 CMP — opt back in if the user has previously granted analytics
  // consent (returning visitor). Otherwise the `opt_out_capturing_by_default:
  // true` above keeps autocapture silent until they click Accept.
  if (hasAnalyticsConsent()) {
    posthog.opt_in_capturing();
  }

  _initialized = true;
  return posthog;
}

/**
 * Opt the user back into capture (call when they toggle analytics ON in
 * privacy settings). No-op when PostHog isn't initialised.
 */
export function optInPostHog(): void {
  try {
    const ph = getPostHog();
    ph?.opt_in_capturing();
  } catch {
    /* ignore */
  }
}

/**
 * Opt the user out of capture (call when they toggle analytics OFF).
 */
export function optOutPostHog(): void {
  try {
    const ph = getPostHog();
    ph?.opt_out_capturing();
  } catch {
    /* ignore */
  }
}
