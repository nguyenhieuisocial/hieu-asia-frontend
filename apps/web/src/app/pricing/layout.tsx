import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng giá',
  description:
    'Premium 99.000đ một lần · Mentor Monthly 199.000đ / tháng · Mentor Yearly 1.990.000đ / năm (tiết kiệm 17%) · Lifetime 4.990.000đ trọn đời.',
  alternates: { canonical: 'https://hieu.asia/pricing' },
  openGraph: {
    title: 'Bảng giá',
    description:
      'Premium 99.000đ · Mentor Monthly 199.000đ/tháng · Mentor Yearly 1.990.000đ/năm · Lifetime 4.990.000đ. Mở khóa góc nhìn sâu cho mỗi quyết định.',
    url: 'https://hieu.asia/pricing',
    type: 'website',
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
    // Launch promo — drop this entry when LAUNCH30 ends.
    {
      '@type': 'Offer',
      name: 'Ưu đãi ra mắt LAUNCH30 — giảm 30% mọi gói trả phí',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://hieu.asia/pricing',
      validFrom: '2026-05-01',
      validThrough: '2026-06-30',
      eligibleCustomerType: 'NewCustomer',
    },
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSONLD) }}
      />
      {children}
    </>
  );
}
