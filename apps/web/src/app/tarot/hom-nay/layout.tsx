import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Lá Tarot hôm nay — gợi ý phản tư mỗi ngày | hieu.asia',
  description:
    'Lá Tarot hôm nay — mỗi ngày một lá, chung cho mọi người. Không phải lời tiên đoán về ngày của bạn, mà là một lá để dừng lại và ngẫm. Miễn phí, không bói toán.',
  alternates: { canonical: 'https://hieu.asia/tarot/hom-nay' },
  openGraph: {
    title: 'Lá Tarot hôm nay — gợi ý phản tư mỗi ngày | hieu.asia',
    description: 'Mỗi ngày một lá Tarot để dừng lại và ngẫm — không tiên đoán, không bói toán.',
    url: 'https://hieu.asia/tarot/hom-nay',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Lá Tarot hôm nay — gợi ý phản tư mỗi ngày',
  description:
    'Mỗi ngày một lá Tarot, chung cho mọi người — một lá để dừng lại và ngẫm, không phải lời tiên đoán. Miễn phí, không bói toán.',
  url: 'https://hieu.asia/tarot/hom-nay',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tarot', item: 'https://hieu.asia/tarot' },
    { '@type': 'ListItem', position: 3, name: 'Hôm nay', item: 'https://hieu.asia/tarot/hom-nay' },
  ],
};

export default function TarotTodayLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
