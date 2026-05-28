import type { Metadata } from 'next';

/**
 * Wave 60.95.u P1 (vault 130 P1) — /mbti audience route metadata.
 *
 * Mirrors the OG/twitter/canonical pattern established in Wave 60.95.k
 * (commit 5b8b058) for audience surfaces: root-layout openGraph is replaced
 * (not merged) when a route declares its own openGraph block, so we re-declare
 * `images` here or social-card previews render blank.
 */
export const metadata: Metadata = {
  title: 'MBTI — 16 kiểu tâm trí',
  description:
    'MBTI tại hieu.asia: 16 kiểu tâm trí trên 4 trục E/I · N/S · T/F · J/P — không nhãn dán, mà là ngôn ngữ tự nhận diện thiên hướng. Kết hợp với Tử Vi, Bát Tự, Thần Số Học qua AI Mentor.',
  alternates: { canonical: 'https://hieu.asia/mbti' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'MBTI — 16 kiểu tâm trí',
    description:
      '4 trục, 16 kiểu — một ngôn ngữ để gọi tên thiên hướng nội tại, không dán nhãn số phận.',
    url: 'https://hieu.asia/mbti',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — MBTI: 16 kiểu, 4 trục, một bản đồ tâm trí',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MBTI — 16 kiểu tâm trí',
    description:
      '4 trục, 16 kiểu — một ngôn ngữ để gọi tên thiên hướng nội tại, không dán nhãn số phận.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — MBTI: 16 kiểu, 4 trục, một bản đồ tâm trí',
      },
    ],
  },
};

export default function MbtiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
