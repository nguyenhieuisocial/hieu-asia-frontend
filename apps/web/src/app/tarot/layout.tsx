import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Rút bài Tarot online — gợi ý phản tư',
  description:
    'Rút lá Tarot (78 lá) cho câu hỏi bạn đang phân vân — mỗi lá là một lăng kính để tự suy ngẫm. Miễn phí, không bói toán, không tiên đoán.',
  alternates: { canonical: 'https://hieu.asia/tarot' },
  openGraph: {
    title: 'Rút bài Tarot — gợi ý phản tư | hieu.asia',
    description: 'Rút lá Tarot cho điều bạn đang phân vân — gợi ý để tự suy ngẫm, không bói toán.',
    url: 'https://hieu.asia/tarot',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Rút bài Tarot — gợi ý phản tư',
  description: 'Rút lá Tarot (78 lá) cho câu hỏi bạn đang phân vân — mỗi lá là một lăng kính để tự suy ngẫm. Miễn phí, không bói toán.',
  url: 'https://hieu.asia/tarot',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const TOOL_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Rút bài Tarot online',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  url: 'https://hieu.asia/tarot',
  inLanguage: 'vi-VN',
  description: 'Rút ngẫu nhiên 1 lá Tarot từ bộ 78 lá cho câu hỏi bạn đang phân vân — mỗi lá kèm lời gợi mở để tự suy ngẫm. Miễn phí, không bói toán.',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
  publisher: { '@type': 'Organization', name: 'hieu.asia', url: 'https://hieu.asia' },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tarot', item: 'https://hieu.asia/tarot' },
  ],
};

export default function TarotLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOL_JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }} />
      {children}
    </>
  );
}
