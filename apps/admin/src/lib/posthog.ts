/**
 * PostHog client (admin app) — browser-only singleton.
 *
 * Mirrors apps/web/src/lib/posthog.ts but tuned for admin operator UX:
 *  - Heatmaps + session replay ENABLED (operator UX debugging).
 *  - Identify uses SHA-256 hashed admin email — never expose raw email.
 *  - APP_VERSION = "admin-v1.0".
 *
 * Privacy: respects `localStorage['hieu.user.preferences'].privacy.analytics_opt_in`.
 * When `false`, `opt_out_capturing()` is called on init so nothing leaves the browser.
 */

import posthog, { type PostHog } from "posthog-js";

const PREFS_KEY = "hieu.user.preferences";
const DEFAULT_HOST = "https://eu.i.posthog.com";
const APP_VERSION = "admin-v1.0";

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
    platform: "admin-web",
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
    capture_pageview: false,
    capture_pageleave: true,
    // Admin = operator UX debug → session replay ON.
    disable_session_recording: false,
    autocapture: true,
    // Heatmaps ON for admin (review which buttons operators actually click).
    enable_heatmaps: true,
    capture_exceptions: true,
    capture_performance: true,
    enable_recording_console_log: false,
    respect_dnt: true,
    person_profiles: "identified_only",
    cross_subdomain_cookie: true,
    persistence: "localStorage+cookie",
    session_recording: {
      maskAllInputs: false,
      maskTextSelector: ".posthog-mask",
      maskInputOptions: {
        password: true,
        email: true,
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
 * Hash a string with SHA-256 and return a hex digest.
 * Used to identify admin operators without sending raw emails to PostHog.
 */
async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Identify the current admin operator by hashed email.
 * Call after auth resolves; safe to call repeatedly (idempotent in PostHog).
 */
export async function userIdentify(adminEmail: string): Promise<void> {
  if (!adminEmail) return;
  const ph = getPostHog();
  if (!ph) return;
  try {
    const distinctId = await sha256Hex(adminEmail.toLowerCase().trim());
    ph.identify(distinctId, { role: "admin" });
  } catch {
    /* ignore */
  }
}

export function optInPostHog(): void {
  try {
    const ph = getPostHog();
    ph?.opt_in_capturing();
  } catch {
    /* ignore */
  }
}

export function optOutPostHog(): void {
  try {
    const ph = getPostHog();
    ph?.opt_out_capturing();
  } catch {
    /* ignore */
  }
}
