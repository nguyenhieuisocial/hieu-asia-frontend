import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Hợp đôi 2 lá số — Vùng giao tiếp + cách điều chỉnh · hieu.asia',
  description:
    'So sánh 2 lá số trên 5 dimension: tính cách, giao tiếp, mục tiêu, tài chính, gia đình. Communication tips kèm vulnerability + reframe + suggested phrase.',
  alternates: { canonical: 'https://hieu.asia/compatibility' },
  openGraph: {
    title: 'Hợp đôi 2 lá số · hieu.asia',
    description: '5-dimension chemistry + communication guide.',
    url: 'https://hieu.asia/compatibility',
    type: 'website',
  },
};
export default function L({ children }: { children: React.ReactNode }) { return children; }
