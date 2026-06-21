import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Đăng ký affiliate',
  description:
    'Đăng ký cộng tác viên hieu.asia: 30% hoa hồng đơn đầu, 10% mỗi lần khách gia hạn. Một tầng, minh bạch, cookie 30 ngày.',
  alternates: { canonical: 'https://hieu.asia/affiliate/signup' },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
