import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sổ tay cá nhân · hieu.asia',
  description:
    'Một trang tổng hợp về bạn — điểm mạnh, mẫu hình quyết định, nguyên tắc vận hành. Lưu trên trình duyệt, không gửi server.',
  alternates: { canonical: 'https://hieu.asia/account/operating-manual' },
  robots: { index: false, follow: false },
};

export default function OperatingManualLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
