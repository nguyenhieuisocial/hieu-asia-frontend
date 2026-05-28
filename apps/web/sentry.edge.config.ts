import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  // Wave 60.95.w — Tag every event with the deploy's commit SHA so the
  // Sentry "Releases" page can correlate edge-runtime errors (middleware,
  // edge route handlers) to the deploy that introduced them. Falls back to
  // 'dev' for local runs. Must match release.name in withSentryConfig.
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? 'dev',
  beforeSend(event) {
    if (process.env.NODE_ENV !== 'production') return null;

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
