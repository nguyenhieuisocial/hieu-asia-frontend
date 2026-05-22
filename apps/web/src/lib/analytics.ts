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
