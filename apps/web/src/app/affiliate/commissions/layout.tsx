import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch sử hoa hồng',
  description:
    'Lịch sử hoa hồng affiliate 3 tầng. Trả sau khi giao dịch confirm (~7 ngày). Tối thiểu rút 200.000đ.',
  alternates: { canonical: 'https://hieu.asia/affiliate/commissions' },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
