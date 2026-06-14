import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
export const metadata: Metadata = {
  title: 'Weekly Review — 5 phút mỗi tuần',
  description:
    'Review 5 phút mỗi tuần — chuyển từ "cảm giác" sang "dữ kiện". Lưu trên máy bạn, không gửi server (privacy-first).',
  alternates: { canonical: 'https://hieu.asia/weekly-review' },
  openGraph: {
    title: 'Weekly Review',
    description: '5-min self-reflection mỗi tuần.',
    url: 'https://hieu.asia/weekly-review',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};
export default function L({ children }: { children: React.ReactNode }) { return children; }
