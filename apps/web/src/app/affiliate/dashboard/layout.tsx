import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard affiliate · hieu.asia',
  description: 'Theo dõi KPI affiliate, hoa hồng, sự kiện gần đây và share toolkit của bạn.',
  alternates: { canonical: 'https://hieu.asia/affiliate/dashboard' },
  robots: { index: false, follow: true },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
