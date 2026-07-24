/**
 * Analytics tracking — sends events to Plausible (when domain configured),
 * to PostHog (when key configured), and to the Worker KV-backed funnel store.
 *
 * All three are fire-and-forget: never throws, never blocks UI.
 *
 * The canonical event vocabulary lives in `event-taxonomy.ts`. See
 * `EVENTS.md` for prose definitions and PostHog interpretation guidance.
 */

import { getPostHog } from './posthog';
import type { EventName, EventPropertyMap } from './event-taxonomy';

export type { EventName } from './event-taxonomy';

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
  }
}

/**
 * Wave 41 — high-value events that are mirrored to the Worker `/event/track`
 * endpoint for server-side enrichment + PostHog server capture. Keeping this
 * list tight avoids drowning the Worker in low-signal page views.
 */
const HIGH_VALUE_EVENTS: ReadonlySet<string> = new Set<EventName>([
  'payment_intent_created',
  'payment_completed',
  'payment_failed',
  'signup_completed',
  'signin_completed',
  'mentor_chat_message_sent',
  'reading_completed',
  'consent_changed',
]);

/**
 * 4 sự kiện chuẩn của phễu — suy ra TỰ ĐỘNG từ các sự kiện chi tiết đã có.
 *
 * Lý do làm ở đây chứ không sửa ~40 chỗ gọi: mỗi công cụ/trang đang bắn một
 * tên riêng (`lead_capture_hop_tuoi`, `cuoi_lead_captured`, `tool_used`…) nên
 * PostHog không dựng được MỘT phễu chung cho cả site. Ánh xạ ở một nơi duy
 * nhất thì mọi chỗ gọi cũ tự động khớp chuẩn, và chỗ gọi mới cũng vậy mà
 * không ai phải nhớ thêm luật gì.
 *
 * Trả null = sự kiện không thuộc 4 nhóm chuẩn.
 */
function canonicalMirror(
  event: string,
  props: Record<string, unknown> | undefined,
): { name: string; props: Record<string, unknown> } | null {
  const p = props ?? {};

  // Dùng xong một công cụ miễn phí (mọi công cụ đều bắn `tool_used`).
  if (event === 'tool_used' && (p.result ?? 'ok') === 'ok' && typeof p.tool === 'string') {
    return { name: 'free_tool_completed', props: { tool: p.tool, source_event: event } };
  }

  // Để lại email: 2 quy ước tên đang tồn tại song song trong code.
  if (/^lead_capture_/.test(event) || /_lead_captured$/.test(event)) {
    return {
      name: 'email_captured',
      props: { source: event.replace(/^lead_capture_/, '').replace(/_lead_captured$/, ''), source_event: event },
    };
  }
  if (event === 'daily_horoscope_subscribed' && p.channel === 'email') {
    return { name: 'email_captured', props: { source: 'daily_horoscope', source_event: event } };
  }

  // Vào luồng thanh toán.
  if (event === 'payment_intent_created') {
    return {
      name: 'checkout_started',
      props: { tier: p.tier, amount_vnd: p.amount_vnd, source_event: event },
    };
  }

  // Mua thành công.
  if (event === 'payment_completed') {
    return {
      name: 'purchase',
      props: { tier: p.tier, amount_vnd: p.amount_vnd, method: p.method, source_event: event },
    };
  }

  return null;
}

/**
 * Fire-and-forget analytics event.
 *
 * Layers:
 *   1. Plausible — counts as custom event in dashboard (no-op when script not loaded)
 *   2. PostHog — captures with super-properties + session replay link
 *   3. Worker KV — populates admin funnel + drop-off detection
 *
 * Generic signature: when the caller passes a known `EventName`, props are
 * type-checked against `EventPropertyMap[K]`. Unknown event names fall back
 * to a loose `Record<string, unknown>` payload (still useful for ad-hoc
 * experimentation in dev).
 */
export function track<K extends EventName>(
  event: K,
  properties?: EventPropertyMap[K] | Record<string, unknown>,
): void;
export function track(event: string, properties?: Record<string, unknown>): void;
export function track(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  // BUG-028 (Wave 54): drop empty event names BEFORE we POST so the worker
  // never has to 400 our own client. V2 audit observed several
  // `event_name required` 400s per session caused by auto-track helpers
  // firing with `undefined`/empty strings (e.g. unnamed buttons). Without
  // this guard the worker returns 400 and the failure pollutes Sentry +
  // browser console without any actionable signal.
  if (typeof event !== 'string' || event.trim().length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[analytics] dropped event with empty name', { event, properties });
    }
    return;
  }

  // 0. Sự kiện chuẩn của phễu — CHỈ gửi sang PostHog (nơi dựng phễu), KHÔNG
  //    gửi sang Worker: worker kiểm tên sự kiện theo danh sách riêng của nó
  //    (kho khác) và trả 400 cho tên lạ — đúng loại nhiễu mà bộ lọc `$` phía
  //    dưới đã phải thêm để dập. Sự kiện chi tiết vẫn đi đủ cả 4 lớp như cũ.
  const mirror = canonicalMirror(event, properties);
  if (mirror) {
    try {
      getPostHog()?.capture(mirror.name, mirror.props);
    } catch {
      /* ignore */
    }
  }

  // 1. Plausible (custom event tag) — silent no-op if script absent
  try {
    if (typeof window.plausible === 'function') {
      window.plausible(event, properties ? { props: properties } : undefined);
    }
  } catch {
    /* ignore */
  }

  // 2. PostHog — silent no-op when key missing or user opted out
  try {
    const ph = getPostHog();
    if (ph) {
      ph.capture(event, properties);
    }
  } catch {
    /* ignore */
  }

  // 3. Worker KV via Next.js proxy
  //
  // Wave 60.36 — skip $-prefix events. PostHog reserves the `$` prefix for
  // system events (`$web_vitals`, `$pageview`, `$autocapture`, ...). Our
  // Worker `/analytics/event` validates `event_name` against the typed
  // business-funnel vocabulary and returns 400 for anything starting with
  // `$`. Before the guard, every page load fired 2-3× $web_vitals (TTFB,
  // FCP, LCP, CLS, INP) which all 400'd — polluting the browser console
  // and Sentry without any actionable signal. Layers 1/2/4 still fire so
  // PostHog cohort analysis on $web_vitals is unaffected.
  if (event.startsWith('$')) {
    return;
  }
  try {
    const userId = (() => {
      try {
        return localStorage.getItem('hieu.user_id') ?? undefined;
      } catch {
        return undefined;
      }
    })();
    const sessionId = (() => {
      try {
        return sessionStorage.getItem('hieu.session_id') ?? undefined;
      } catch {
        return undefined;
      }
    })();
    void fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: event,
        user_id: userId,
        session_id: sessionId,
        properties,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }

  // 4. Worker /event/track — server-side enrichment for high-value events.
  //    Geo/UA/login/tier added by worker. Skipped for noisy events like
  //    page views to stay under rate limits.
  try {
    if (HIGH_VALUE_EVENTS.has(event)) {
      const userId = (() => {
        try {
          return localStorage.getItem('hieu.user_id') ?? undefined;
        } catch {
          return undefined;
        }
      })();
      void fetch('/api/event/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          properties,
          distinct_id: userId,
        }),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* ignore */
  }
}
