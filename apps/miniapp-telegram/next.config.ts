import type { NextConfig } from 'next';

/**
 * Telegram Mini App lives inside a Telegram WebView. Needs to:
 *  - allow iframe embedding from Telegram domains
 *  - not lock origin policies too tight (TG strips referer)
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hieu-asia/ui', '@hieu-asia/types', '@hieu-asia/api-client'],
  experimental: {
    typedRoutes: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Telegram WebView sometimes needs CSP frame-ancestors permissive.
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://*.telegram.org https://web.telegram.org" },
        ],
      },
    ];
  },
};

export default nextConfig;
