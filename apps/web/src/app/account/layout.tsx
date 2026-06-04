import type { Metadata } from 'next';
import { ReferralClaimOnce } from '@/components/referral/ReferralClaimOnce';

export const metadata: Metadata = {
  title: 'Tài khoản của bạn',
  description:
    'Trung tâm quản lý tài khoản hieu.asia: lá số, quyết định, mentor, thanh toán, affiliate, quyền riêng tư.',
  // Wave 60.95.k P1-SEO — even though /account is `robots: noindex`, a
  // shared /account link in a Zalo/Slack DM should still preview cleanly
  // (the previous root-layout og:image didn't propagate because the page
  // shipped no openGraph block at all; with this present, social cards now
  // resolve). `twitter:card=summary_large_image` for the same reason.
  openGraph: {
    title: 'Tài khoản của bạn',
    description:
      'Trung tâm quản lý tài khoản hieu.asia: lá số, quyết định, mentor, thanh toán.',
    url: 'https://hieu.asia/account',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tài khoản: lá số, quyết định, mentor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tài khoản của bạn',
    description: 'Lá số · Quyết định · Mentor · Thanh toán',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tài khoản: lá số, quyết định, mentor',
      },
    ],
  },
  robots: { index: false, follow: false },
};

// Wave 60.95.k P1-SEO — JSON-LD parity with /pricing /sample-report
// /methodology. /account is `noindex` so crawlers won't surface it in
// SERP, but BreadcrumbList still helps when /account is linked from
// indexed pages (footer, in-app email). WebPage does not expose user
// data — only static page metadata.
const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Tài khoản', item: 'https://hieu.asia/account' },
  ],
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Tài khoản',
  description:
    'Trung tâm quản lý tài khoản hieu.asia: lá số, quyết định, mentor, thanh toán, affiliate, quyền riêng tư.',
  url: 'https://hieu.asia/account',
  inLanguage: 'vi-VN',
  isPartOf: {
    '@type': 'WebSite',
    name: 'hieu.asia',
    url: 'https://hieu.asia',
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  // Client-side auth gate lives in apps/web/src/app/account/page.tsx via
  // useAuth() — we cannot read Supabase session from cookies() reliably
  // because the SDK uses a single storage key in localStorage, not cookies.
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
      <ReferralClaimOnce />
      {children}
    </>
  );
}
