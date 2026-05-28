import type { Metadata } from 'next';

// Wave 60.95.m P1-SEO — route-specific og:title for social shares.
// noindex stays (per-user mentor chat). Metadata is GENERIC by design — no PII
// lookup in generateMetadata (don't leak names into og:title).
const TITLE = 'Trò chuyện với Mentor · hieu.asia';
const DESCRIPTION =
  'Trò chuyện với mentor AI hieu.asia về báo cáo Tử Vi của bạn — hỏi cụ thể, nhận lời khuyên dựa trên lá số riêng.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: { canonical: null },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    images: [
      {
        url: '/og-reading-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Trò chuyện với mentor AI hieu.asia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/og-reading-default.jpg',
        alt: 'Trò chuyện với mentor AI hieu.asia',
      },
    ],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
