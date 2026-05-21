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
          // Wave 6 — private detail URLs (localStorage-only, would soft-404 for crawlers)
          '/decisions/d_',
          '/journal/jr_',
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
