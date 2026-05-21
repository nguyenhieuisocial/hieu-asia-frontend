import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Weekly Review — 5 phút mỗi tuần · hieu.asia',
  description:
    'Review 5 phút mỗi tuần — chuyển từ "cảm giác" sang "dữ kiện". Lưu trên máy bạn, không gửi server (privacy-first).',
  alternates: { canonical: 'https://hieu.asia/weekly-review' },
  openGraph: {
    title: 'Weekly Review · hieu.asia',
    description: '5-min self-reflection mỗi tuần.',
    url: 'https://hieu.asia/weekly-review',
    type: 'website',
  },
};
export default function L({ children }: { children: React.ReactNode }) { return children; }
