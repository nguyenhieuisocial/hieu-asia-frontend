import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch sử hoa hồng',
  description:
    'Lịch sử hoa hồng affiliate. Trả sau khi giao dịch được xác nhận (~7 ngày). Tối thiểu rút 500.000đ.',
  // SEO-FIX: noindex — logged-in CTV commission history (consistent with the
  // affiliate/dashboard + assets layouts, which are already noindex).
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://hieu.asia/affiliate/commissions' },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
