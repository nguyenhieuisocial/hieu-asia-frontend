import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng giá — hieu.asia',
  description:
    'Mỗi quyết định quan trọng cần một góc nhìn sâu hơn. Chọn gói phù hợp: Premium 99.000đ một lần, gói tháng 199.000đ, gói năm 1.990.000đ.',
  alternates: { canonical: 'https://hieu.asia/pricing' },
  openGraph: {
    title: 'Bảng giá — hieu.asia',
    description:
      'Premium 99.000đ · Gói tháng 199.000đ · Gói năm 1.990.000đ. Mở khóa góc nhìn sâu cho mỗi quyết định quan trọng.',
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
