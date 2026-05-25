import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
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
