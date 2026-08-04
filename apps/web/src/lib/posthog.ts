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

import type { PostHog } from "posthog-js";
import { getOrCreateAnonUserId } from "@hieu-asia/supabase";

const PREFS_KEY = "hieu.user.preferences";
const DEFAULT_HOST = "https://us.i.posthog.com";
const APP_VERSION = "v2.3";

// Wave 65.05b — posthog-js (~60-80KB gz) KHÔNG còn import tĩnh: trước đây nó
// vào First Load JS của mọi trang chỉ vì analytics.ts import file này. Giờ SDK
// chỉ tải qua dynamic import khi loadPostHog() được gọi (PostHogProvider hoãn
// tới tương tác đầu HOẶC idle trần 3.5s — cùng pattern GoogleTags 65.05).
let _client: PostHog | null = null;
let _disabled = false;
let _loading: Promise<PostHog | null> | null = null;

/**
 * Hàng đợi thao tác gọi TRƯỚC khi SDK tải xong (capture/identify/opt-in...).
 * Flush FIFO ngay sau init để không rơi sự kiện đầu phiên. Cap để không phình
 * vô hạn khi user không bao giờ tương tác (queue chết cùng page unload).
 */
const MAX_PENDING = 200;
const _pending: Array<(ph: PostHog) => void> = [];

function flushPending(ph: PostHog): void {
  while (_pending.length > 0) {
    const fn = _pending.shift();
    try {
      fn?.(ph);
    } catch {
      /* ignore */
    }
  }
}

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
 * Returns the PostHog client singleton, or `null` when the SDK chưa tải xong
 * (Wave 65.05b: init hoãn tới tương tác đầu/idle), key missing, hoặc SSR.
 *
 * LƯU Ý đổi semantics: hàm này KHÔNG còn tự init. Caller cần chạy-sau-init
 * dùng `whenPostHogReady()`; caller bắn event dùng `capturePostHog()` (tự
 * queue). Trigger tải SDK là `loadPostHog()` (PostHogProvider gọi).
 */
export function getPostHog(): PostHog | null {
  return _client;
}

/**
 * Chạy `fn` với client PostHog: ngay lập tức nếu đã sẵn sàng, ngược lại xếp
 * hàng đợi và flush sau init. Drop khi disabled (không có key / import fail).
 */
export function whenPostHogReady(fn: (ph: PostHog) => void): void {
  if (_client) {
    try {
      fn(_client);
    } catch {
      /* ignore */
    }
    return;
  }
  if (typeof window === "undefined" || _disabled) return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    _disabled = true;
    return;
  }
  if (_pending.length >= MAX_PENDING) return;
  _pending.push(fn);
}

/**
 * Capture event — queue-an-toàn: event bắn TRƯỚC khi init xong được giữ lại
 * và flush ngay sau init (thay vì drop như getPostHog()?.capture()).
 */
export function capturePostHog(
  event: string,
  properties?: Record<string, unknown>,
): void {
  whenPostHogReady((ph) => {
    ph.capture(event, properties);
  });
}

/**
 * Tải + init posthog-js (memoized). Gọi từ PostHogProvider sau tương tác
 * đầu tiên hoặc idle (trần 3.5s). Trả `null` khi key missing / SSR / fail.
 */
export function loadPostHog(): Promise<PostHog | null> {
  if (typeof window === "undefined" || _disabled) return Promise.resolve(null);
  if (_client) return Promise.resolve(_client);
  if (_loading) return _loading;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) {
    _disabled = true;
    return Promise.resolve(null);
  }
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? DEFAULT_HOST;

  _loading = import("posthog-js")
    .then((mod) => {
      const posthog = mod.default;

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
        // Max capture: do NOT auto-opt-out on the browser "Do Not Track" header.
        // Capture is already CMP-consent-gated (opt_out_by_default + opt-in on
        // Accept), so an explicit consent choice overrides the non-binding DNT
        // signal — consented visitors are measured even if their browser sets DNT.
        respect_dnt: false,
        // Max capture: create person profiles for ALL consented visitors, incl.
        // anonymous pre-login ones, so their journeys are analysable as persons
        // (not just events). Costs more PostHog events; capture stays consent-gated.
        person_profiles: "always",
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

      _client = posthog;
      // Flush mọi capture/identify/opt đã xếp hàng trong lúc SDK chưa về.
      flushPending(posthog);
      return posthog;
    })
    .catch(() => {
      // Import fail (offline / ad-blocker chặn chunk) — tắt hẳn và xả queue
      // để các whenPostHogReady sau này không phình bộ nhớ vô ích.
      _disabled = true;
      _pending.length = 0;
      return null;
    });
  return _loading;
}

/**
 * Opt the user back into capture (call when they toggle analytics ON in
 * privacy settings). Queue-an-toàn: gọi trước init thì áp ngay sau init
 * (init cũng tự đọc lại localStorage consent nên trạng thái cuối luôn đúng).
 */
export function optInPostHog(): void {
  whenPostHogReady((ph) => {
    ph.opt_in_capturing();
  });
}

/**
 * Opt the user out of capture (call when they toggle analytics OFF).
 */
export function optOutPostHog(): void {
  whenPostHogReady((ph) => {
    ph.opt_out_capturing();
  });
}
