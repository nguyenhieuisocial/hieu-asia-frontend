import type { MetadataRoute } from 'next';

/**
 * Wave 57.4.2 — admin.hieu.asia PWA manifest.
 *
 * Internal operations console — installable for ops team as standalone PWA
 * but not optimized for end-user marketing (no aggressive theme color, no
 * categories for app stores).
 *
 * Icons shared with apps/web (same hieu.asia brand identity, just
 * different host). 6 icon entries: 4 'any' + 2 Android-maskable.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'admin.hieu.asia — Operations Console',
    short_name: 'admin.hieu.asia',
    description: 'Bảng điều khiển vận hành cho hieu.asia — operations, cost tracking, RAG management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F12',
    theme_color: '#B8923D',
    orientation: 'any', // admin used on both desktop + mobile
    lang: 'vi',
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
