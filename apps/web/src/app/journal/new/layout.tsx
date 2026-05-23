import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Ghi quyết định mới',
  description: 'Form ghi một quyết định mới vào Decision Journal cá nhân.',
  alternates: { canonical: 'https://hieu.asia/journal' },
  robots: { index: false, follow: false },
};
export default function L({ children }: { children: React.ReactNode }) { return children; }
