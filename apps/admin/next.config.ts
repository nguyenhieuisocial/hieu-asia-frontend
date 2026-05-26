import type { NextConfig } from 'next';
import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hieu-asia/ui', '@hieu-asia/types', '@hieu-asia/api-client'],
  experimental: {
    typedRoutes: true,
  },
  // Performance budget: warn on chunks > 250kB.
  webpack(config, { isServer }) {
    if (!isServer) {
      config.performance = {
        ...config.performance,
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
        maxAssetSize: 300_000,
        maxEntrypointSize: 300_000,
      };
    }
    return config;
  },
  // Wave 60.29 — Content-Security-Policy header.
  //
  // Sub-agent D security audit flagged: admin app shipped ZERO CSP →
  // XSS in any admin page = full token exfil (service-role JWT, admin
  // session cookie). Web has had a CSP since Wave 41.4; admin gap was
  // pre-existing.
  //
  // Allowlist (narrower than web — admin is auth-gated, no marketing
  // pixels, no public-facing analytics):
  //   - self + Next.js bootstrap (unsafe-inline scripts for hydration)
  //   - PostHog (admin LLM-trace dashboards)
  //   - Sentry (errors + breadcrumbs from Wave 60.13/60.14/60.15/60.16)
  //   - Supabase (PostgREST + Realtime, future use)
  //   - Langfuse (LLM trace cloud, vault 94 mentions)
  //   - api.hieu.asia (Worker — admin proxy fetches)
  //   - fonts.googleapis.com / gstatic.com (next/font/google)
  //
  // unsafe-eval only in dev (Next.js Fast Refresh). frame-ancestors none
  // blocks clickjacking; upgrade-insecure-requests forces HTTPS.
  // Wave 60.81.A.v2 — redirect old vault path to new /keystore route.
  // The legacy /admin/src/app/secrets/ subtree is left intact (sandbox
  // immutable rule blocks edits to that path); these redirects ensure
  // the route is unreachable in prod before founder removes the dir.
  async redirects() {
    return [
      { source: '/secrets', destination: '/keystore', permanent: true },
      { source: '/secrets/:path*', destination: '/keystore/:path*', permanent: true },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const scriptSrc = [
      "script-src 'self' 'unsafe-inline'",
      isDev ? "'unsafe-eval'" : '',
      'https://us.i.posthog.com',
      'https://*.posthog.com',
      'https://browser.sentry-cdn.com',
      'https://*.ingest.sentry.io',
      'https://*.ingest.us.sentry.io',
      // Wave 60.29 — Vercel Speed Insights script (`@vercel/speed-insights/next`
      // imported in app/layout.tsx → loads `va.vercel-scripts.com/v1/...js`).
      // Without this allowlist the script is CSP-blocked silently and Wave 59
      // Speed Insights initiative produces zero metrics. /ultrareview sub-agent
      // caught this gap in Wave 60.29 pre-push audit.
      'https://va.vercel-scripts.com',
      // Wave 60.34 — Cloudflare Web Analytics beacon (Playwright final-verify
      // sub-agent flagged CSP block on /login). Cloudflare auto-injects the
      // beacon script if CF Analytics is enabled on the zone proxy.
      'https://static.cloudflareinsights.com',
    ]
      .filter(Boolean)
      .join(' ');
    const csp = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.hieu.asia https://*.hieu.asia https://*.supabase.co https://*.supabase.in https://us.i.posthog.com https://*.posthog.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://cloud.langfuse.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ');
    return [
      {
        source: '/(.*)',
        headers: [{ key: 'Content-Security-Policy', value: csp }],
      },
    ];
  },
};

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
  silent: true,
  org: 'hieuasia',
  project: 'hieu-asia-admin',
});
