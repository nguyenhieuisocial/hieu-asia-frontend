import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// Wave 60.95.m P1-SEO — route-specific og:title for social shares.
// noindex stays (per-user data). Metadata is GENERIC by design — no PII
// lookup in generateMetadata (don't leak names/birthdates into og:title).
// canonical: null because per-user reading pages shouldn't canonicalize.
const TITLE = 'Báo cáo Tử Vi của bạn · hieu.asia';
const DESCRIPTION =
  'Báo cáo Tử Vi cá nhân hoá do AI hieu.asia phân tích — luận giải, định hướng và lời khuyên dựa trên lá số của bạn.';

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
        alt: 'Báo cáo Tử Vi cá nhân hoá từ hieu.asia',
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
        alt: 'Báo cáo Tử Vi cá nhân hoá từ hieu.asia',
      },
    ],
  },
};

const ID_REGEX = /^[A-Za-z0-9_-]{3,64}$/;

/**
 * Guards every /reading/[id]/* route. Invalid id → hub with a soft hint.
 * Children stay client components; layout runs on the server first.
 */
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!ID_REGEX.test(id)) redirect('/reading?invalid=1');
  return children;
}
