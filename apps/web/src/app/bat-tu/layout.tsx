import type { Metadata } from 'next';

/**
 * Wave 60.95.u P1 — /bat-tu audience landing layout (vault 130 P1 audience segments).
 *
 * Bát Tự (Four Pillars / 八字) is one of hieu.asia's 4 disciplines alongside
 * Tử Vi, MBTI và Thần Số Học. This audience route is a marketing landing —
 * not a tool — that converts to /onboarding?intent=ngu-hanh.
 *
 * SEO mirrors /tu-vi audience hub pattern: openGraph + twitter must be
 * re-declared at route level (Next.js merge semantics replace root layout).
 * Canonical points to the production URL; robots are explicit so this
 * Beta-engine page is still indexed (matches /methodology/bat-tu policy).
 */
export const metadata: Metadata = {
  title: 'Bát Tự — Tám chữ định mệnh',
  description:
    'Bát Tự (Tứ Trụ) đọc bản đồ ngũ hành từ 8 chữ năm-tháng-ngày-giờ sinh. hieu.asia kết hợp engine deterministic với AI để đối chiếu Bát Tự + Tử Vi + MBTI + Thần Số Học.',
  alternates: { canonical: 'https://hieu.asia/bat-tu' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Bát Tự — Tám chữ định mệnh',
    description:
      'Đọc bản đồ ngũ hành từ 8 chữ năm-tháng-ngày-giờ. Engine tính 4 trụ, AI đối chiếu Tử Vi.',
    url: 'https://hieu.asia/bat-tu',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Bát Tự: tám chữ định mệnh, bản đồ ngũ hành',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bát Tự — Tám chữ định mệnh',
    description:
      'Đọc bản đồ ngũ hành từ 8 chữ năm-tháng-ngày-giờ. Engine + AI đối chiếu 4 trường phái.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Bát Tự: tám chữ định mệnh, bản đồ ngũ hành',
      },
    ],
  },
};

export default function BatTuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
