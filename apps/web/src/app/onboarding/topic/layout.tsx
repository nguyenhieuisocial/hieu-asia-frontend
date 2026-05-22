import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bắt đầu — chọn chủ đề | hieu.asia',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
