import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decision Simulator — So sánh 2 lựa chọn · hieu.asia',
  description:
    'So sánh 2 lựa chọn theo 6 tiêu chí — không phải để biết đúng/sai, mà để hiểu trade-off. Hỗ trợ tư duy quyết định, không thay quyết định.',
  alternates: { canonical: 'https://hieu.asia/decision-simulator' },
  openGraph: {
    title: 'Decision Simulator · hieu.asia',
    description: 'So sánh 2 lựa chọn theo 6 tiêu chí.',
    url: 'https://hieu.asia/decision-simulator',
    type: 'website',
  },
};

export default function DecisionSimulatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
