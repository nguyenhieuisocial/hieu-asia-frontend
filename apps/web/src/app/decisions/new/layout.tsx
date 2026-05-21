import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Ghi quyết định mới · hieu.asia',
  description: 'Form nhập một quyết định mới để theo dõi và đối chiếu sau 30 ngày.',
  alternates: { canonical: 'https://hieu.asia/decisions' },
  robots: { index: false, follow: false },
};
export default function L({ children }: { children: React.ReactNode }) { return children; }
