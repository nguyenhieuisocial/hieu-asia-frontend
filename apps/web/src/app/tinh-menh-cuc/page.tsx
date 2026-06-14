import type { Metadata } from 'next';
import { TinhMenhCucForm } from './form';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Tính Mệnh Cục: cung Mệnh, cung Thân, cục, âm dương',
  description:
    'Tra cứu miễn phí cung Mệnh, cung Thân, Cục (Mộc/Hỏa/Thổ/Kim/Thủy) và âm dương theo ngày–giờ sinh. Bước đầu để hiểu lá số Tử Vi của bạn.',
  alternates: { canonical: 'https://hieu.asia/tinh-menh-cuc' },
  openGraph: {
    title: 'Tính Mệnh Cục',
    description: 'Cung Mệnh, cung Thân, Cục, âm dương — miễn phí, 30 giây.',
    url: 'https://hieu.asia/tinh-menh-cuc',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

export default function TinhMenhCucPage() {
  return <TinhMenhCucForm />;
}
