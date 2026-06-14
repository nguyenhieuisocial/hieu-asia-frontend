import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Birth Time Rectification — hồi cứu giờ sinh chính xác',
  description:
    'Không nhớ chính xác giờ sinh? Trả lời 12 câu hỏi hồi cứu sự kiện đời để thu hẹp khung giờ (canh) khả dĩ xuống top 3 ứng viên. Heuristic, không thay thế chuyên gia.',
  alternates: { canonical: 'https://hieu.asia/tu-vi/rectify' },
  openGraph: {
    title: 'Birth Time Rectification',
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
