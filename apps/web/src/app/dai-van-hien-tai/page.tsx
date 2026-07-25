import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb } from '@/lib/seo/jsonld';
import { DaiVanHienTaiForm } from './form';

export const metadata: Metadata = {
  title: 'Xem đại vận hiện tại — chu kỳ 10 năm bạn đang ở',
  description:
    'Tra cứu đại vận hiện tại: chu kỳ 10 năm bạn đang ở, chủ đề chính, cơ hội + rủi ro chính theo lá số Tử Vi Đẩu Số. Xem những gì mở khoá tại /pricing.',
  alternates: { canonical: 'https://hieu.asia/dai-van-hien-tai' },
  openGraph: {
    title: 'Đại vận hiện tại',
    description: 'Chu kỳ 10 năm + chủ đề chính — rút gọn, 30 giây.',
    url: 'https://hieu.asia/dai-van-hien-tai',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

export default function DaiVanHienTaiPage() {
  return (
    <>
      {/* SEO-FIX: thiếu BreadcrumbList → Google không hiện đường dẫn phân cấp. */}
      <JsonLd
        data={breadcrumb([
          { name: 'Trang chủ', url: '/' },
          { name: 'Đại vận hiện tại', url: '/dai-van-hien-tai' },
        ])}
      />
      <DaiVanHienTaiForm />
    </>
  );
}
