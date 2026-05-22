import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch vạn niên hôm nay | hieu.asia',
  alternates: { canonical: 'https://hieu.asia/lich-van-nien/today' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
