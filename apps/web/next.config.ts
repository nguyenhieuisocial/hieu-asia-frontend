import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hieu-asia/ui', '@hieu-asia/types', '@hieu-asia/api-client'],
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.hieu.asia' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

export default nextConfig;
