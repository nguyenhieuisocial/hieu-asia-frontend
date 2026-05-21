/**
 * Analytics tracking — sends events to Plausible (when domain configured),
 * to PostHog (when key configured), and to the Worker KV-backed funnel store.
 *
 * All three are fire-and-forget: never throws, never blocks UI.
 */

import { getPostHog } from './posthog';

export type EventName =
  | 'consent_given'
  | 'palm_uploaded'
  | 'survey_completed'
  | 'report_viewed'
  | 'mentor_message_sent'
  | 'payment_intent_created'
  | 'payment_completed'
  | 'affiliate_link_clicked'
  | 'daily_horoscope_subscribed'
  | 'tool_used';

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
  }
}

/**
 * Fire-and-forget analytics event.
 *
 * Layers:
 *   1. Plausible — counts as custom event in dashboard (no-op when script not loaded)
 *   2. Worker KV — populates admin funnel + drop-off detection
 *
 * Pages call this in handlers, e.g. `track('palm_uploaded', { backend: 'r2' })`.
 */
export function track(event: EventName, properties?: Record<string, unknown>): void {
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
}
