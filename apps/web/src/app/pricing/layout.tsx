import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng giá — Premium 99k / Tháng 199k / Năm 1.99M',
  description:
    '3 gói dịch vụ hieu.asia: Premium báo cáo 1 lần 99.000đ, gói tháng 199.000đ unlimited, gói năm 1.990.000đ tiết kiệm 17%.',
  alternates: { canonical: 'https://hieu.asia/pricing' },
  openGraph: {
    title: 'Bảng giá hieu.asia — Premium / Tháng / Năm',
    description:
      'Premium 99.000đ một lần · Gói tháng 199.000đ unlimited · Gói năm 1.990.000đ tiết kiệm 17%.',
    url: 'https://hieu.asia/pricing',
    type: 'website',
  },
};

const PRODUCT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'hieu.asia — Báo cáo Tử Vi & AI Mentor',
  description:
    'Báo cáo Tử Vi, Bát Tự, MBTI và Mentor AI cá nhân hóa. 3 gói: Premium một lần, Subscription tháng, Subscription năm.',
  brand: { '@type': 'Brand', name: 'hieu.asia' },
  offers: [
    {
      '@type': 'Offer',
      name: 'Premium (một lần)',
      price: '99000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://hieu.asia/pricing',
    },
    {
      '@type': 'Offer',
      name: 'Subscription Monthly',
      price: '199000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://hieu.asia/pricing',
    },
    {
      '@type': 'Offer',
      name: 'Subscription Yearly',
      price: '1990000',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      url: 'https://hieu.asia/pricing',
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
