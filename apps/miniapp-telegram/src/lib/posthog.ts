/**
 * PostHog client (miniapp-telegram) — browser-only singleton.
 *
 * Mirrors apps/web/src/lib/posthog.ts but tuned for Telegram WebApp context:
 *  - Session replay DISABLED (Telegram embed = sensitive context, may capture
 *    user's chat list / private messages around the iframe).
 *  - Heatmaps DISABLED (no operator UX use case + extra payload on mobile).
 *  - Autocapture + capture_exceptions ON (clicks + JS errors are safe).
 *  - APP_VERSION = "telegram-miniapp-v1.0".
 *  - User identify expects Telegram `user_id` (numeric) — never email.
 *
 * Privacy: respects `localStorage['hieu.user.preferences'].privacy.analytics_opt_in`.
 */

import posthog, { type PostHog } from "posthog-js";

const PREFS_KEY = "hieu.user.preferences";
const DEFAULT_HOST = "https://eu.i.posthog.com";
const APP_VERSION = "telegram-miniapp-v1.0";

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
    platform: "telegram-miniapp",
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
    // Telegram embed → DO NOT record sessions.
    disable_session_recording: true,
    autocapture: true,
    // Heatmaps OFF (no operator UX use case).
    enable_heatmaps: false,
    capture_exceptions: true,
    capture_performance: true,
    enable_recording_console_log: false,
    respect_dnt: true,
    person_profiles: "identified_only",
    cross_subdomain_cookie: true,
    persistence: "localStorage+cookie",
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
 * Identify the current Telegram user by their numeric Telegram user_id.
 * Never call this with an email — Telegram doesn't expose email and we
 * don't want to leak any backend PII into PostHog.
 */
export function userIdentify(telegramUserId: string | number): void {
  if (!telegramUserId) return;
  const ph = getPostHog();
  if (!ph) return;
  try {
    ph.identify(`tg:${telegramUserId}`, { platform: "telegram-miniapp" });
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
