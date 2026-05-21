import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

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

export default withBundleAnalyzer(withNextIntl(nextConfig));
