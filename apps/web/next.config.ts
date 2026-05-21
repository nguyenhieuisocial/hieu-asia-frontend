import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hieu-asia/ui', '@hieu-asia/types', '@hieu-asia/api-client'],
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      // Vanity / legacy URL aliases — keep canonical Vietnamese slugs.
      { source: '/learn/numerology', destination: '/learn/than-so-hoc', permanent: true },
      { source: '/numerology', destination: '/than-so-hoc', permanent: true },
      { source: '/learn/bazi', destination: '/learn/bat-tu', permanent: true },
      { source: '/learn/zi-wei', destination: '/learn/tu-vi', permanent: true },
      { source: '/learn/ziwei', destination: '/learn/tu-vi', permanent: true },
      { source: '/palm', destination: '/learn/palm', permanent: true },
      // Legal hub aliases
      { source: '/legal/privacy', destination: '/privacy', permanent: true },
      { source: '/legal/terms', destination: '/terms', permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Legacy /favicon.ico requests → Next.js app/icon.tsx (covers older crawlers).
      { source: '/favicon.ico', destination: '/icon' },
    ];
  },
  async headers() {
    // Content-Security-Policy — allows: self + Vercel/Supabase + Cloudflare API + PostHog + Sentry + fonts.
    // `'unsafe-inline'` on script-src needed for Next.js inline bootstrap scripts (build IDs etc.).
    // `'unsafe-eval'` is required by Next.js dev mode (Fast Refresh) but MUST NOT ship to prod.
    const isDev = process.env.NODE_ENV === 'development';
    const scriptSrc = [
      "script-src 'self' 'unsafe-inline'",
      isDev ? "'unsafe-eval'" : '',
      'https://us.i.posthog.com https://*.posthog.com https://browser.sentry-cdn.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io',
    ]
      .filter(Boolean)
      .join(' ');
    const csp = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: ",
      "connect-src 'self' https://api.hieu.asia https://*.hieu.asia https://*.supabase.co https://*.supabase.in https://us.i.posthog.com https://*.posthog.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://cloud.langfuse.com https://api.vietqr.io",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ');
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.hieu.asia' },
      { protocol: 'https', hostname: 'img.vietqr.io' },
      { protocol: 'https', hostname: 'api.vietqr.io' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // Performance budget: warn on chunks > 250kB.
  webpack(config, { isServer }) {
    if (!isServer) {
      config.performance = {
        ...config.performance,
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
        maxAssetSize: 250_000,
        maxEntrypointSize: 250_000,
      };
    }
    return config;
  },
};

export default withSentryConfig(withBundleAnalyzer(withNextIntl(nextConfig)), {
  silent: true,
  org: 'hieuasia',
  project: 'hieu-asia-web',
});
