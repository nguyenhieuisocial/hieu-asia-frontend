import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Career Fit — Khám phá nhóm công việc phù hợp · hieu.asia',
  description:
    'Career Fit kết hợp 5 sở thích cá nhân với khuynh hướng lá số để gợi ý nhóm nghề. Top-3 match + ranking 5 nhóm; không tư vấn nghề chuyên môn cao.',
  alternates: { canonical: 'https://hieu.asia/career-fit' },
  openGraph: {
    title: 'Career Fit · hieu.asia',
    description: 'Khám phá nhóm công việc phù hợp với cách bạn vận hành.',
    url: 'https://hieu.asia/career-fit',
    type: 'website',
  },
};
export default function L({ children }: { children: React.ReactNode }) { return children; }
