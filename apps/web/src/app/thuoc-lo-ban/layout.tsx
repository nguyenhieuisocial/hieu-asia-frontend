import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thước Lỗ Ban online: tra cung tốt xấu theo kích thước cm',
  description:
    'Tra cứu thước Lỗ Ban 42.9cm / 38.8cm / 52.2cm online — nhập kích thước cửa, giường, bàn thờ để xem cung tốt xấu và ý nghĩa từng cung.',
  alternates: { canonical: 'https://hieu.asia/thuoc-lo-ban' },
  openGraph: {
    title: 'Thước Lỗ Ban online',
    description: 'Tra cung tốt xấu cho cửa, giường, bàn thờ theo 3 loại thước Lỗ Ban.',
    url: 'https://hieu.asia/thuoc-lo-ban',
    type: 'website',
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Thước Lỗ Ban online: tra cung tốt xấu theo kích thước cm',
  description: 'Tra cứu thước Lỗ Ban 42.9cm / 38.8cm / 52.2cm online — nhập kích thước để xem cung tốt xấu và ý nghĩa từng cung.',
  url: 'https://hieu.asia/thuoc-lo-ban',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Thước Lỗ Ban online',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/thuoc-lo-ban',
  inLanguage: 'vi-VN',
  description: 'Tra cứu thước Lỗ Ban 42.9cm / 38.8cm / 52.2cm — nhập kích thước cửa, giường, bàn thờ để xem cung tốt xấu và ý nghĩa từng cung theo phong thuỷ. Miễn phí.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Thước Lỗ Ban', item: 'https://hieu.asia/thuoc-lo-ban' },
  ],
};

export default function ThuocLoBanLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
