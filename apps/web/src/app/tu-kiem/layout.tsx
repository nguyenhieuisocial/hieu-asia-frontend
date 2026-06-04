import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đừng tin mù — bài tự kiểm 1 phút',
  description:
    'Trước khi tin bất kỳ lời giải nào, hãy thử bài 1 phút: vì sao lời bói luôn thấy "đúng ghê" — và cách không bị lừa. Dựa trên hiệu ứng Forer (Barnum) trong tâm lý học.',
  alternates: { canonical: 'https://hieu.asia/tu-kiem' },
  openGraph: {
    title: 'Đừng tin mù — bài tự kiểm 1 phút',
    description: 'Vì sao lời bói luôn thấy "đúng ghê" — và cách không bị lừa. Bài tự kiểm 1 phút.',
    url: 'https://hieu.asia/tu-kiem',
    type: 'website',
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Đừng tin mù — bài tự kiểm 1 phút',
  description:
    'Trước khi tin bất kỳ lời giải nào, hãy thử bài 1 phút: vì sao lời bói luôn thấy "đúng ghê" — và cách không bị lừa. Dựa trên hiệu ứng Forer (Barnum) trong tâm lý học.',
  url: 'https://hieu.asia/tu-kiem',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Tự kiểm — Đừng tin mù',
  applicationCategory: 'EducationApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/tu-kiem',
  inLanguage: 'vi-VN',
  description:
    'Bài tự kiểm 1 phút: đọc 10 mô tả và chấm xem câu nào đúng với bạn — rồi khám phá vì sao đó là bẫy hiệu ứng Forer (Barnum). Tự kiểm trước khi tin bất kỳ lời giải nào.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tự kiểm', item: 'https://hieu.asia/tu-kiem' },
  ],
};

export default function TuKiemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
