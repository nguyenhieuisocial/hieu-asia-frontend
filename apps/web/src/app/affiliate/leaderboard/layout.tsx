import type { Metadata } from 'next';

/**
 * Wave 48 — leaderboard SEO metadata.
 *
 * OG image is generated dynamically by ./opengraph-image.tsx.
 * The leaderboard total is computed at request time by the page itself;
 * description here is the static fallback that crawlers see on first hit.
 */
export const metadata: Metadata = {
  title: 'Bảng vàng Affiliate — Top 50',
  description:
    'Top 50 affiliate kiếm nhiều nhất tại hieu.asia. Cập nhật mỗi giờ. Mã affiliate công khai, ẩn danh tính chủ tài khoản.',
  alternates: { canonical: 'https://hieu.asia/affiliate/leaderboard' },
  openGraph: {
    title: 'Bảng vàng Affiliate — Top 50',
    description:
      'Cộng đồng affiliate hieu.asia — top 50 người kiếm nhiều nhất, làm mới mỗi giờ.',
    url: 'https://hieu.asia/affiliate/leaderboard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bảng vàng Affiliate — Top 50',
    description:
      'Cộng đồng affiliate hieu.asia — top 50 người kiếm nhiều nhất, làm mới mỗi giờ.',
  },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
