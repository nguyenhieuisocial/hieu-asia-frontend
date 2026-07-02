import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tất cả công cụ tử vi, bát tự & trắc nghiệm',
  description:
    'Toàn bộ công cụ luận số, tâm lý học và phong thủy: Tử Vi, Bát Tự, Thần Số, MBTI, Big Five, DISC, Tarot, Gieo Quẻ, Thước Lỗ Ban, Hợp Tuổi.',
  alternates: { canonical: 'https://hieu.asia/cong-cu' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Tất cả công cụ — hieu.asia',
    description:
      'Toàn bộ công cụ luận số, tâm lý học, và phong thủy. Từ Tử Vi, Bát Tự đến MBTI, Big Five — một nơi khám phá và bắt đầu.',
    url: 'https://hieu.asia/cong-cu',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tất cả công cụ luận số và tâm lý học',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tất cả công cụ — hieu.asia',
    description:
      'Toàn bộ công cụ luận số, tâm lý học, và phong thủy — một nơi khám phá và bắt đầu.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tất cả công cụ',
      },
    ],
  },
};

export default function CongCuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
