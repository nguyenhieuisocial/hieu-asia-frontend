import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng giá',
  description:
    'Premium 99.000đ một lần · Mentor Monthly 199.000đ / tháng · Mentor Yearly 1.990.000đ / năm (tiết kiệm 17%) · Lifetime 4.990.000đ trọn đời.',
  alternates: { canonical: 'https://hieu.asia/pricing' },
  // Wave 60.95.k P1-SEO — route-level openGraph REPLACES root-layout
  // openGraph (Next.js merge semantics), so we must re-declare `images` here
  // or Zalo/Facebook/Telegram/Slack previews render blank. Same for `twitter`.
  openGraph: {
    title: 'Bảng giá',
    description:
      'Premium 99.000đ · Mentor Monthly 199.000đ/tháng · Mentor Yearly 1.990.000đ/năm · Lifetime 4.990.000đ. Mở khóa góc nhìn sâu cho mỗi quyết định.',
    url: 'https://hieu.asia/pricing',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Bảng giá Premium / Mentor / Lifetime',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bảng giá',
    description:
      'Premium 99.000đ · Mentor 199.000đ/tháng · Lifetime 4.990.000đ.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Bảng giá Premium / Mentor / Lifetime',
      },
    ],
  },
};

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'hieu.asia — Báo cáo Tử Vi & AI Mentor',
  description:
    'Báo cáo Tử Vi, Bát Tự, MBTI và Mentor AI cá nhân hóa. 5 gói: Free, Premium (một lá số, một lần), Mentor Monthly (subscription /tháng), Mentor Yearly (subscription /năm), Lifetime (trọn đời).',
  brand: { '@type': 'Brand', name: 'hieu.asia' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Premium — một lá số (một lần)',
      price: '99000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://hieu.asia/pricing',
      category: 'one-time',
    },
    {
      '@type': 'Offer',
      name: 'Mentor Monthly',
      price: '199000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://hieu.asia/pricing',
      category: 'subscription',
    },
    {
      '@type': 'Offer',
      name: 'Mentor Yearly',
      price: '1990000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://hieu.asia/pricing',
      category: 'subscription',
      description: 'Tiết kiệm 17% so với 12 tháng cộng lại (tương đương 2 tháng miễn phí).',
    },
    {
      '@type': 'Offer',
      name: 'Lifetime',
      price: '4990000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://hieu.asia/pricing',
      category: 'one-time',
    },
    // Wave 54 #282 (/ultrareview P1): LAUNCH30 Offer dropped. Commit e370aaf
    // removed the on-page banner because the worker had no coupon validation
    // — the JSON-LD entry was still being indexed by Google rich results
    // and re-opened the same "advertise discount that doesn't apply" fraud
    // risk via SERP. Re-add only when the coupon flow is wired end-to-end.
  ],
};

// Wave 60.96.4 — add BreadcrumbList JSON-LD. /pricing had Product schema but
// no breadcrumb navigation signal — flagged in the audit alongside the rest
// of the top-9 worst-defect routes.
const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Bảng giá', item: 'https://hieu.asia/pricing' },
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSONLD) }}
      />
      {children}
    </>
  );
}
