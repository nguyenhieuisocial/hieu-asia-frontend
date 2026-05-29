import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Nhật ký Quyết định — Ghi lại các quyết định',
  description:
    'Ghi lại các quyết định để 30 ngày sau bạn nhìn lại biết mình đã quyết theo lý do gì. Lưu trên trình duyệt, không gửi server.',
  alternates: { canonical: 'https://hieu.asia/journal' },
  openGraph: {
    title: 'Nhật ký Quyết định',
    description: 'Nhật ký quyết định cá nhân.',
    url: 'https://hieu.asia/journal',
    type: 'website',
  },
};
export default function L({ children }: { children: React.ReactNode }) { return children; }
