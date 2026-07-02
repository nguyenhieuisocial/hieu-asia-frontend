import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trắc nghiệm Enneagram — 9 nhóm tính cách',
  description:
    'Trắc nghiệm Enneagram online: xác định nhóm tính cách (1–9) cùng cánh để hiểu động cơ cốt lõi, nỗi sợ và hướng phát triển. 36 câu, kết quả ngay.',
  alternates: { canonical: 'https://hieu.asia/enneagram' },
  openGraph: {
    title: 'Trắc nghiệm Enneagram',
    description: '9 nhóm tính cách — khám phá động cơ và nỗi sợ cốt lõi. Kết quả tức thì, miễn phí.',
    url: 'https://hieu.asia/enneagram',
    type: 'website',
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Trắc nghiệm Enneagram miễn phí — 9 nhóm tính cách',
  description:
    'Làm trắc nghiệm Enneagram online: xác định nhóm tính cách (1–9) cùng cánh (wing) để hiểu động cơ cốt lõi, nỗi sợ nền tảng và hướng phát triển của bạn. 36 câu, kết quả ngay.',
  url: 'https://hieu.asia/enneagram',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Trắc nghiệm Enneagram',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/enneagram',
  inLanguage: 'vi-VN',
  description:
    'Trắc nghiệm Enneagram xác định một trong 9 nhóm tính cách cùng cánh (wing) — giúp hiểu động cơ cốt lõi, nỗi sợ nền tảng, điểm mạnh và hướng phát triển của bạn. 36 câu, kết quả tức thì.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Enneagram', item: 'https://hieu.asia/enneagram' },
  ],
};

export default function EnneagramLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
