import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mô tả tình huống | hieu.asia',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
