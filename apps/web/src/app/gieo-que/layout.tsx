import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gieo Quẻ Kinh Dịch online — bốc quẻ hỏi việc miễn phí',
  description:
    'Gieo quẻ Kinh Dịch online theo phép 3 đồng xu: lập quẻ chính, quẻ biến và hào động trong 64 quẻ Dịch, kèm lời gợi mở để suy ngẫm trước khi quyết định.',
  alternates: { canonical: 'https://hieu.asia/gieo-que' },
  openGraph: {
    title: 'Gieo Quẻ Kinh Dịch',
    description: 'Bốc quẻ hỏi việc theo Kinh Dịch — quẻ chính, quẻ biến, hào động và lời luận giải.',
    url: 'https://hieu.asia/gieo-que',
    type: 'website',
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Gieo Quẻ Kinh Dịch online — bốc quẻ hỏi việc miễn phí',
  description: 'Gieo quẻ Kinh Dịch online theo phép 3 đồng xu: lập quẻ chính, quẻ biến và hào động trong 64 quẻ Dịch.',
  url: 'https://hieu.asia/gieo-que',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Gieo Quẻ Kinh Dịch online',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/gieo-que',
  inLanguage: 'vi-VN',
  description: 'Bốc quẻ hỏi việc theo Kinh Dịch với phép 3 đồng xu — lập quẻ chính, quẻ biến, hào động trong 64 quẻ Dịch, kèm lời gợi mở. Miễn phí.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Gieo Quẻ', item: 'https://hieu.asia/gieo-que' },
  ],
};

export default function GieoQueLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
