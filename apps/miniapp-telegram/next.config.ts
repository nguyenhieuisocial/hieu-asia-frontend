import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Telegram Mini App lives inside a Telegram WebView. Needs to:
 *  - allow iframe embedding from Telegram domains
 *  - not lock origin policies too tight (TG strips referer)
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hieu-asia/ui', '@hieu-asia/types', '@hieu-asia/api-client'],
  // Next.js 15.5+: typedRoutes moved out of `experimental` to stable top-level.
  typedRoutes: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Telegram WebView sometimes needs CSP frame-ancestors permissive.
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.telegram.org https://web.telegram.org",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
