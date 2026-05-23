import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kết quả Thần số học',
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
