import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trắc nghiệm DiSC miễn phí — 4 phong cách hành vi D/i/S/C',
  description:
    'Làm trắc nghiệm DiSC online: xác định phong cách hành vi Quyết đoán (D), Ảnh hưởng (i), Ổn định (S), Tuân thủ (C) để hiểu cách bạn giao tiếp và làm việc. 16 câu, kết quả ngay.',
  alternates: { canonical: 'https://hieu.asia/disc' },
  openGraph: {
    title: 'Trắc nghiệm DiSC',
    description: '4 phong cách hành vi D/i/S/C — kết quả tức thì, miễn phí.',
    url: 'https://hieu.asia/disc',
    type: 'website',
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Trắc nghiệm DiSC miễn phí — 4 phong cách hành vi D/i/S/C',
  description:
    'Làm trắc nghiệm DiSC online: xác định phong cách hành vi Quyết đoán (D), Ảnh hưởng (i), Ổn định (S), Tuân thủ (C) để hiểu cách bạn giao tiếp và làm việc. 16 câu, kết quả ngay.',
  url: 'https://hieu.asia/disc',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Trắc nghiệm DiSC',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/disc',
  inLanguage: 'vi-VN',
  description:
    'Trắc nghiệm DiSC xác định phong cách hành vi Quyết đoán (D), Ảnh hưởng (i), Ổn định (S), Tuân thủ (C) — giúp hiểu cách bạn giao tiếp, làm việc và ra quyết định. 16 câu, kết quả tức thì.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'DiSC', item: 'https://hieu.asia/disc' },
  ],
};

export default function DiscLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
