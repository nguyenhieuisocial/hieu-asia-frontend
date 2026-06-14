import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Xem Chỉ Tay & Tướng Mặt miễn phí — AI phân tích ảnh thật',
  description:
    'Tải ảnh lòng bàn tay hoặc khuôn mặt — AI phân tích xu hướng tính cách và ứng xử theo tướng số học. Không lưu ảnh, không bói toán.',
  alternates: { canonical: 'https://hieu.asia/xem-tuong' },
  openGraph: {
    title: 'Xem Chỉ Tay & Tướng Mặt · hieu.asia',
    description:
      'Phân tích chỉ tay và tướng mặt bằng AI — xu hướng tính cách, ứng xử, điểm mạnh. Ảnh không được lưu trữ.',
    url: 'https://hieu.asia/xem-tuong',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Xem Chỉ Tay & Tướng Mặt miễn phí — AI phân tích ảnh thật',
  description:
    'Tải ảnh lòng bàn tay hoặc khuôn mặt — AI phân tích xu hướng tính cách và ứng xử theo tướng số học. Không lưu ảnh, không bói toán.',
  url: 'https://hieu.asia/xem-tuong',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Xem Chỉ Tay & Tướng Mặt bằng AI',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/xem-tuong',
  inLanguage: 'vi-VN',
  description:
    'Tải ảnh lòng bàn tay hoặc khuôn mặt — AI phân tích xu hướng tính cách, ứng xử và điểm mạnh theo tướng số học. Ảnh không được lưu trữ.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Xem Tướng', item: 'https://hieu.asia/xem-tuong' },
  ],
};

export default function XemTuongLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
