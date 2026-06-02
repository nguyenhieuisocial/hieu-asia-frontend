import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trắc nghiệm Big Five (OCEAN) miễn phí — 5 chiều tính cách',
  description:
    'Làm trắc nghiệm tính cách Big Five (OCEAN) online theo thang IPIP-NEO: đo Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc. 20 câu, có kết quả và giải thích ngay.',
  alternates: { canonical: 'https://hieu.asia/big-five' },
  openGraph: {
    title: 'Trắc nghiệm Big Five (OCEAN)',
    description: '5 chiều tính cách theo mô hình khoa học Big Five — kết quả tức thì, miễn phí.',
    url: 'https://hieu.asia/big-five',
    type: 'website',
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Trắc nghiệm Big Five (OCEAN) miễn phí — 5 chiều tính cách',
  description:
    'Làm trắc nghiệm tính cách Big Five (OCEAN) online theo thang IPIP-NEO: đo Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc. 20 câu, có kết quả và giải thích ngay.',
  url: 'https://hieu.asia/big-five',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Trắc nghiệm Big Five (OCEAN)',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/big-five',
  inLanguage: 'vi-VN',
  description:
    'Trắc nghiệm tính cách Big Five theo thang IPIP-NEO: đo 5 chiều Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu và Nhạy cảm cảm xúc. 20 câu hỏi, kết quả và giải thích tức thì.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Big Five (OCEAN)', item: 'https://hieu.asia/big-five' },
  ],
};

export default function BigFiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
