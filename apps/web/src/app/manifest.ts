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
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
