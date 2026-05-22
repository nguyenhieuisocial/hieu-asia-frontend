/**
 * PostHog client (miniapp-zalo) — browser-only singleton.
 *
 * VITE NOTE: this app is bundled by Vite (zmp-cli), NOT Next.js.
 *   - Env vars MUST use the `VITE_` prefix to be inlined at build time.
 *   - `NEXT_PUBLIC_*` is a Next.js convention and is NOT read by Vite.
 *   - Expected vars: `VITE_PUBLIC_POSTHOG_KEY` + `VITE_PUBLIC_POSTHOG_HOST`.
 *
 * Tuned for the Zalo Mini App context (zmp-ui shell, HashRouter):
 *  - Session replay DISABLED (Zalo embed = sensitive context).
 *  - Heatmaps DISABLED (no operator UX use case).
 *  - Autocapture + capture_exceptions ON.
 *  - APP_VERSION = "zalo-miniapp-v1.0".
 *  - User identify expects a Zalo user_id — never email / phone.
 *
 * Privacy: respects `localStorage['hieu.user.preferences'].privacy.analytics_opt_in`.
 */

import posthog, { type PostHog } from 'posthog-js';

const PREFS_KEY = 'hieu.user.preferences';
const DEFAULT_HOST = 'https://us.i.posthog.com';
const APP_VERSION = 'zalo-miniapp-v1.0';

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
    build_env: import.meta.env.MODE,
    platform: 'zalo-miniapp',
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
      '(prefers-reduced-motion: reduce)',
    ).matches;
    props.prefers_dark_mode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
  } catch {
    /* ignore */
  }
  return props;
}

export function getPostHog(): PostHog | null {
  if (typeof window === 'undefined') return null;
  if (_disabled) return null;
  if (_initialized) return posthog;

  const key = import.meta.env.VITE_PUBLIC_POSTHOG_KEY as string | undefined;
  if (!key) {
    _disabled = true;
    return null;
  }
  const host =
    (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string | undefined) ??
    DEFAULT_HOST;

  posthog.init(key, {
    api_host: host,
    capture_pageview: false,
    capture_pageleave: true,
    // Zalo embed → DO NOT record sessions.
    disable_session_recording: true,
    autocapture: true,
    enable_heatmaps: false,
    capture_exceptions: true,
    capture_performance: true,
    enable_recording_console_log: false,
    respect_dnt: true,
    person_profiles: 'identified_only',
    cross_subdomain_cookie: true,
    persistence: 'localStorage+cookie',
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
 * Identify the current Zalo user by their Zalo user_id.
 * Never pass email or phone — the Zalo SDK does not expose them and we
 * don't want backend PII leaking into PostHog.
 */
export function userIdentify(zaloUserId: string | number): void {
  if (!zaloUserId) return;
  const ph = getPostHog();
  if (!ph) return;
  try {
    ph.identify(`zalo:${zaloUserId}`, { platform: 'zalo-miniapp' });
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
