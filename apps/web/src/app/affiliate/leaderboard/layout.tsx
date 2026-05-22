import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng xếp hạng affiliate · hieu.asia',
  description: 'Xếp hạng affiliate hieu.asia — social proof, competition và phần thưởng hàng tháng.',
  alternates: { canonical: 'https://hieu.asia/affiliate/leaderboard' },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
