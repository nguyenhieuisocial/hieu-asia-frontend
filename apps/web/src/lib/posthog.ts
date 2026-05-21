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

const PREFS_KEY = "hieu.user.preferences";
const DEFAULT_HOST = "https://eu.i.posthog.com";
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

  posthog.init(key, {
    api_host: host,
    capture_pageview: false, // manually triggered on route change
    capture_pageleave: true,
    disable_session_recording: false,
    autocapture: true,
    capture_performance: true, // Web Vitals + paint metrics
    enable_recording_console_log: true,
    cross_subdomain_cookie: true,
    persistence: "localStorage+cookie",
    session_recording: {
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

  if (isOptedOut()) {
    posthog.opt_out_capturing();
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
