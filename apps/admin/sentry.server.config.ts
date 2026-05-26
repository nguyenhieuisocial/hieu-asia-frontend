import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
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
