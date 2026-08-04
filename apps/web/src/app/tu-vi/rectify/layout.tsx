import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Lá số Tử Vi không biết giờ sinh — hồi cứu giờ',
  description:
    'Không biết hay không nhớ giờ sinh? Trả lời 12 câu hồi cứu sự kiện đời để thu hẹp còn top 3 khung giờ, rồi lập lá số Tử Vi. Heuristic, không thay chuyên gia.',
  alternates: { canonical: 'https://hieu.asia/tu-vi/rectify' },
  openGraph: {
    title: 'Lá số Tử Vi không biết giờ sinh',
    description:
      'Hồi cứu giờ sinh từ sự kiện đời để lập lá số Tử Vi chính xác hơn.',
    url: 'https://hieu.asia/tu-vi/rectify',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
  robots: { index: true, follow: true },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
