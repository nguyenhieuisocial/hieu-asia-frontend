import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cân Xương Đoán Số miễn phí theo ngày giờ sinh',
  description:
    'Cân xương đoán số tự động theo ngày giờ năm sinh — bài Cân Xương cổ truyền của Đường tướng Quân Khổng Minh, có giải thích chi tiết từng lượng.',
  alternates: { canonical: 'https://hieu.asia/can-xuong' },
  openGraph: {
    title: 'Cân Xương Đoán Số',
    description: 'Tính lượng xương theo Can Chi giờ–ngày–tháng–năm; bài cân và lời giải đầy đủ.',
    url: 'https://hieu.asia/can-xuong',
    type: 'website',
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Cân Xương Đoán Số miễn phí theo ngày giờ sinh',
  description: 'Cân xương đoán số tự động theo ngày giờ năm sinh — bài Cân Xương cổ truyền có giải thích chi tiết từng lượng.',
  url: 'https://hieu.asia/can-xuong',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Cân Xương Đoán Số',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/can-xuong',
  inLanguage: 'vi-VN',
  description: 'Tính lượng xương theo Can Chi của giờ–ngày–tháng–năm sinh, theo bài Cân Xương cổ truyền Khổng Minh. Kết quả và giải thích tức thì. Miễn phí.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Cân Xương', item: 'https://hieu.asia/can-xuong' },
  ],
};

export default function CanXuongLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
