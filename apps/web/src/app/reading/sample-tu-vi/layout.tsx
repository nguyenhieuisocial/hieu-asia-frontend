import type { Metadata } from 'next';

/**
 * Wave 60.95.m P0 — dedicated `/reading/sample-tu-vi` route layout.
 *
 * This static segment OVERRIDES the parent `/reading/[id]/layout.tsx` which
 * sets `robots: noindex, follow` for every dynamic reading id (legitimate —
 * user readings shouldn't be indexed). The sample is the PUBLIC lead-magnet
 * canonical preview, so it must be indexable AND have route-specific OG/
 * Twitter cards so social shares (Zalo / Facebook / Telegram / Slack) render
 * a real preview instead of the generic homepage card.
 *
 * Why a layout vs. just page-level metadata:
 *   - Next.js merges parent + child metadata, but the parent layout's
 *     `robots: { index: false }` would still win unless we explicitly set
 *     `robots: { index: true }` lower in the tree. Doing it in the layout
 *     guarantees ANY future nested sub-route (e.g. `.../report`) inherits
 *     the indexable default unless it opts out.
 *   - openGraph + twitter must be re-declared (Next.js REPLACE semantics on
 *     these specific fields) — same pattern as
 *     `apps/web/src/app/sample-report/page.tsx`.
 */
export const metadata: Metadata = {
  title: 'Mẫu báo cáo Tử Vi · Xem trước trải nghiệm',
  description:
    'Lá số Tử Vi mẫu công khai trên hieu.asia: 12 cung, đối thoại Mentor, kế hoạch 30-60-90 ngày. Xem trước trước khi quyết định lập lá số của riêng bạn.',
  alternates: { canonical: 'https://hieu.asia/reading/sample-tu-vi' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Mẫu báo cáo Tử Vi · hieu.asia',
    description:
      'Cẩm Nang Tử Vi mẫu: 12 cung + Mentor + kế hoạch 30-60-90 ngày. Xem trước trải nghiệm hieu.asia.',
    url: 'https://hieu.asia/reading/sample-tu-vi',
    type: 'article',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Mẫu báo cáo Tử Vi: 12 cung + Mentor + kế hoạch 30-60-90',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mẫu báo cáo Tử Vi · hieu.asia',
    description: 'Cẩm Nang Tử Vi mẫu: 12 cung + Mentor + kế hoạch hành động.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Mẫu báo cáo Tử Vi: 12 cung + Mentor + kế hoạch 30-60-90',
      },
    ],
  },
};

// Wave 60.96.3 — add BreadcrumbList + WebPage JSON-LD. The page itself was
// missing both — only OG/Twitter were set. Pairs with Google rich-snippet
// expectations and clarifies the navigation hierarchy in SERP.
const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Reading', item: 'https://hieu.asia/reading' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Mẫu Tử Vi',
      item: 'https://hieu.asia/reading/sample-tu-vi',
    },
  ],
};

const WEBPAGE_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://hieu.asia/reading/sample-tu-vi',
  url: 'https://hieu.asia/reading/sample-tu-vi',
  name: 'Mẫu báo cáo Tử Vi — xem trước trải nghiệm',
  description:
    'Lá số Tử Vi mẫu công khai trên hieu.asia: 12 cung, đối thoại Mentor, kế hoạch 30-60-90 ngày. Xem trước trải nghiệm trước khi lập lá số của riêng bạn.',
  inLanguage: 'vi-VN',
  isPartOf: { '@type': 'WebSite', name: 'hieu.asia', url: 'https://hieu.asia' },
};

export default function SampleTuViLayout({ children }: { children: React.ReactNode }) {
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
