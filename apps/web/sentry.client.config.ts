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
  //
  // Wave 60.95.m P1-perf — Replay integration is now lazy-loaded via
  // `Sentry.lazyLoadIntegration('replayIntegration')` below. The replay
  // bundle (~50-100 KB br) was previously part of the eager Sentry init in
  // the 180-* vendor chunk; deferring it to `requestIdleCallback` shrinks
  // initial JS payload without affecting error capture (errors thrown before
  // replay loads still go through Sentry — they just won't have a replay
  // attached, which is acceptable given we only sample 50% of errors anyway).
  integrations: [],
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

    // Wave 60.74 — Release-based fingerprinting. Errors from different
    // releases (commit SHAs) group separately so historical errors from
    // resolved deploys don't pollute current Sentry dashboards.
    // `'{{ default }}'` preserves Sentry's auto-fingerprint (stack trace +
    // exception type); we just append release to differentiate.
    if (event.release) {
      event.fingerprint = ['{{ default }}', event.release];
    }

    return event;
  },
});

// Wave 60.95.m P1-perf — Lazy-load Session Replay on idle.
// `lazyLoadIntegration` fetches the replay code in a separate chunk only
// after the page is interactive, removing ~50-100 KB br from the eager
// vendor bundle (`180-*.js`). Sentry's official API: docs.sentry.io/platforms/javascript/configuration/integrations/plugin/#lazy-loading-integrations
// `requestIdleCallback` defers further until the browser is idle; we fall
// back to `setTimeout` for Safari (which still lacks `requestIdleCallback`
// as of WebKit 17). If `lazyLoadIntegration` rejects (network blocked, CDN
// down) we swallow silently — replay is best-effort, error capture is
// already wired through the synchronous `Sentry.init()` above.
if (typeof window !== 'undefined') {
  const scheduleReplayLoad = (cb: () => void) => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void) => void })
      .requestIdleCallback;
    if (typeof ric === 'function') {
      ric(cb);
    } else {
      setTimeout(cb, 2000);
    }
  };

  scheduleReplayLoad(() => {
    Sentry.lazyLoadIntegration('replayIntegration')
      .then((replayIntegration) => {
        const client = Sentry.getClient();
        if (!client) return;
        client.addIntegration(
          replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
            networkDetailAllowUrls: ['/api/'],
          }),
        );
      })
      .catch(() => {
        // Best-effort: if the replay chunk fails to load, error capture
        // still works — just no session replay attached to errors.
      });
  });
}
