import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketing assets affiliate',
  description: 'Tải banner, social card và creative đã được brand-approve cho affiliate hieu.asia.',
  alternates: { canonical: 'https://hieu.asia/affiliate/assets' },
  robots: { index: false, follow: true },
};

export default function L({ children }: { children: React.ReactNode }) {
  return children;
}
