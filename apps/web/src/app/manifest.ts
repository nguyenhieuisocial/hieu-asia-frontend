import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'hieu.asia — AI Human Analysis',
    short_name: 'hieu.asia',
    description: 'Tử Vi, MBTI, palm reading bằng AI - người bạn đồng hành để hiểu chính mình.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F12',
    theme_color: '#B8923D',
    orientation: 'portrait',
    lang: 'vi',
    categories: ['lifestyle', 'productivity', 'education'],
    icons: [
      // Wave 57.4: static files. Previously '/icon' + '/apple-icon' were
      // Next.js ImageResponse code-gen routes (icon.tsx/apple-icon.tsx),
      // deleted in commit f945bed when founder-generated brand assets were
      // wired. Manifest now points at the static PNGs in /public/.
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
      // Maskable variants — Android adaptive icons apply circular/squircle
      // mask via OS theme. Source has 20% safe-zone margin so edges don't get
      // cropped. Generated from icon-512.png via PIL (10% padding each side).
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
