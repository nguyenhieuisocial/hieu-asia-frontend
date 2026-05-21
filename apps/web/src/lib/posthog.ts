/**
 * PostHog client — browser-only singleton.
 *
 * Runs alongside Plausible. Plausible counts pageviews on the landing page;
 * PostHog adds session replay, funnels and feature flags for the app shell
 * (/reading/*, /mentor, /dashboard, /settings, /affiliate, /onboarding).
 *
 * GDPR: respects `localStorage['hieu.user.preferences'].privacy.analytics_opt_in`
 * — when `false`, `opt_out_capturing()` is called on init so nothing leaves
 * the browser.
 */

import posthog, { type PostHog } from "posthog-js";

const PREFS_KEY = "hieu.user.preferences";
const DEFAULT_HOST = "https://eu.i.posthog.com";

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
    disable_session_recording: false, // session recording enabled
    autocapture: true,
  });

  if (isOptedOut()) {
    posthog.opt_out_capturing();
  }

  _initialized = true;
  return posthog;
}
