import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch sử hoa hồng',
  description:
    'Lịch sử hoa hồng affiliate. Trả sau khi giao dịch được xác nhận (~7 ngày). Tối thiểu rút 500.000đ.',
  alternates: { canonical: 'https://hieu.asia/affiliate/commissions' },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
