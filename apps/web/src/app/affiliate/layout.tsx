import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Chương trình affiliate — Kiếm 30% hoa hồng',
  description:
    'Đăng ký affiliate hieu.asia, kiếm hoa hồng 30% tháng đầu + 10% recurring 6 tháng. Cookie 30 ngày, payout min 500.000đ, dashboard real-time.',
  openGraph: {
    title: 'Chương trình affiliate — Kiếm 30% hoa hồng',
    description:
      'Hoa hồng 30% tháng đầu + 10% recurring 6 tháng. Cookie 30 ngày, payout từ 500.000đ.',
    url: 'https://hieu.asia/affiliate',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
