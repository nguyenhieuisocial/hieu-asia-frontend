import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký affiliate · hieu.asia',
  description:
    'Đăng ký affiliate hieu.asia — kiếm 30% tháng đầu + 10% recurring 6 tháng. Cookie 30 ngày.',
  alternates: { canonical: 'https://hieu.asia/affiliate/signup' },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
