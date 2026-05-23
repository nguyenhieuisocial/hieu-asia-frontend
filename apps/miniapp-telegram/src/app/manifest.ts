import type { MetadataRoute } from 'next';

/**
 * Wave 57.4.2 — miniapp.hieu.asia PWA manifest.
 *
 * Telegram Mini App + standalone PWA. When users "Open in browser" from
 * inside Telegram, they get the installable web experience. When inside
 * Telegram, the mini-app SDK handles UI chrome (this manifest is a
 * fallback only).
 *
 * Icons shared with apps/web — same hieu.asia brand identity.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'hieu.asia Mini App',
    short_name: 'hieu.asia',
    description: 'Telegram Mini App cho hieu.asia — Tử Vi, Bát Tự, MBTI bằng AI ngay trong Telegram.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F12',
    theme_color: '#B8923D',
    orientation: 'portrait',
    lang: 'vi',
    categories: ['lifestyle', 'entertainment'],
    icons: [
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
