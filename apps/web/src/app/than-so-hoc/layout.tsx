import type { Metadata } from 'next';

/**
 * Wave 60.96.1 — /than-so-hoc structural completeness.
 *
 * Pre-fix audit (vault 156 P0): missing OG image, Twitter card, BreadcrumbList
 * JSON-LD và WebPage JSON-LD. Social previews rendered blank because root-layout
 * openGraph is REPLACED (not merged) when a route declares its own block —
 * same trap caught in Wave 60.95.k cho /pricing, /sample-report, /methodology.
 */
export const metadata: Metadata = {
  title: 'Thần Số Học: tính số chủ đạo & vận mệnh',
  description:
    'Tính số chủ đạo, số vận mệnh, số linh hồn và năm cá nhân 2026 miễn phí — phân tích AI dựa trên ngày sinh và họ tên đầy đủ.',
  alternates: { canonical: 'https://hieu.asia/than-so-hoc' },
  openGraph: {
    title: 'Thần Số Học miễn phí',
    description: 'Số chủ đạo, vận mệnh, linh hồn, năm cá nhân — phân tích AI miễn phí.',
    url: 'https://hieu.asia/than-so-hoc',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Thần Số Học: số chủ đạo, vận mệnh, linh hồn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thần Số Học miễn phí',
    description: 'Số chủ đạo, vận mệnh, linh hồn, năm cá nhân — phân tích AI miễn phí.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Thần Số Học: số chủ đạo, vận mệnh, linh hồn',
      },
    ],
  },
};

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Thần Số Học', item: 'https://hieu.asia/than-so-hoc' },
  ],
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://hieu.asia/than-so-hoc',
  url: 'https://hieu.asia/than-so-hoc',
  name: 'Thần Số Học — Số chủ đạo theo Pythagoras',
  description:
    'Phân tích số chủ đạo, số vận mệnh, số linh hồn, năm cá nhân 2026 theo phương pháp Pythagoras — miễn phí, AI cá nhân hoá theo ngày sinh + họ tên.',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

export default function ThanSoHocLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_JSONLD) }}
      />
      {children}
    </>
  );
}
