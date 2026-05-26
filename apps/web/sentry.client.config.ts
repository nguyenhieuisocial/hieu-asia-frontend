import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  // Wave 60.46.b — Session Replay (Sentry Free tier: 50 replays/mo).
  // Domain handles Vietnamese PII (birth data, addresses), so:
  //   - maskAllText: true       → all text masked by default (override per-element via `data-sentry-unmask`)
  //   - blockAllMedia: true     → no images/videos captured (avatars, uploaded photos)
  //   - networkDetailAllowUrls  → only our `/api/` routes get request/response detail
  // Quota math (Free 50/mo):
  //   - replaysSessionSampleRate: 0    → no random session sampling (would blow quota immediately at 1k+ sessions/day)
  //   - replaysOnErrorSampleRate: 0.5  → 50% of error sessions only (~100/mo budget at current error rate)
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
      networkDetailAllowUrls: ['/api/'],
    }),
  ],
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0.5,
  beforeSend(event) {
    if (process.env.NODE_ENV !== 'production') return null;

    // Wave 60.17 — suppress HIEU-ASIA-WORKER-7 / HIEU-ASIA-WORKER-8
    // regression noise. Mobile iOS Chrome throws `SecurityError` (or
    // `WebSocket not available: The operation is insecure.`) when the
    // Supabase Realtime SDK attempts to reconnect after a `visibilitychange`
    // event. Our `useReadingSession` already wraps the synchronous subscribe
    // in try-catch + falls back to polling (and intentionally captures via
    // `Sentry.captureException` with `area: realtime-fallback` tag). The
    // auto-instrumented variant caught by Sentry's `addEventListener`
    // monkey-patch fires from INSIDE the SDK's async reconnect path, where
    // our try-catch can't reach — but it's not user-impacting (polling has
    // already taken over). Drop these events to keep Sentry signal clean.
    //
    // Keeps: our own captureException at use-reading-session.ts:182 (the
    // first-attempt fallback path) — that one carries `area:realtime-fallback`
    // tag and we still want it for fallback-rate dashboards.
    try {
      const exc = event.exception?.values?.[0];
      const mech = exc?.mechanism?.type;
      const msg = exc?.value ?? '';
      const isSecError =
        msg.includes('SecurityError') ||
        msg.includes('WebSocket not available') ||
        msg.includes('The operation is insecure');
      const fromAutoAddEventListener = mech === 'auto.browser.browserapierrors.addEventListener';
      const fromAutoXHR = mech === 'auto.browser.browserapierrors.requestAnimationFrame';
      if (isSecError && (fromAutoAddEventListener || fromAutoXHR)) {
        return null;
      }
    } catch {
      // Defensive: never let beforeSend itself throw — fall through to keep the event.
    }

    return event;
  },
});
