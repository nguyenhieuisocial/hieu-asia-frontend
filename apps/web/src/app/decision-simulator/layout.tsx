import type { Metadata } from 'next';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  title: 'Decision Simulator — So sánh 2 lựa chọn',
  description:
    'So sánh 2 lựa chọn theo 6 tiêu chí — không phải để biết đúng/sai, mà để hiểu trade-off. Hỗ trợ tư duy quyết định, không thay quyết định.',
  alternates: { canonical: 'https://hieu.asia/decision-simulator' },
  openGraph: {
    title: 'Decision Simulator',
    description: 'So sánh 2 lựa chọn theo 6 tiêu chí.',
    url: 'https://hieu.asia/decision-simulator',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

export default function DecisionSimulatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
