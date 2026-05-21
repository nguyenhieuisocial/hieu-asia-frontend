import type { Metadata } from 'next';
import { DaiVanHienTaiForm } from './form';

export const metadata: Metadata = {
  title: 'Xem đại vận hiện tại — chu kỳ 10 năm bạn đang ở miễn phí',
  description:
    'Tra cứu đại vận hiện tại miễn phí: chu kỳ 10 năm bạn đang ở, chủ đề chính, cơ hội + rủi ro chính. Theo lá số Tử Vi Đẩu Số.',
  alternates: { canonical: 'https://hieu.asia/dai-van-hien-tai' },
  openGraph: {
    title: 'Đại vận hiện tại · hieu.asia',
    description: 'Chu kỳ 10 năm + chủ đề chính — rút gọn, 30 giây.',
    url: 'https://hieu.asia/dai-van-hien-tai',
    type: 'website',
  },
};

export default function DaiVanHienTaiPage() {
  return <DaiVanHienTaiForm />;
}
