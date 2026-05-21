import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/reading/',
          '/unlock/',
          '/dashboard/',
          '/account',
          '/settings',
          '/checkout',
          '/processing',
          '/signin',
          '/auth/',
          '/onboarding/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://hieu.asia/sitemap.xml',
    host: 'https://hieu.asia',
  };
}
