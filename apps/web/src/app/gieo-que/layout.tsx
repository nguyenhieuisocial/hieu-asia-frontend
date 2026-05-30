import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Gieo Quẻ Kinh Dịch — 64 quẻ | hieu.asia',
  description:
    'Gieo quẻ Kinh Dịch (Chu Dịch) cho điều bạn đang phân vân — quẻ chính, hào động, quẻ biến. Gợi ý để tự suy ngẫm, không bói toán, không tiên đoán.',
  alternates: { canonical: 'https://hieu.asia/gieo-que' },
  openGraph: {
    title: 'Gieo Quẻ Kinh Dịch — 64 quẻ | hieu.asia',
    description: 'Gieo quẻ Kinh Dịch cho điều bạn đang phân vân — gợi ý phản tư, không bói toán.',
    url: 'https://hieu.asia/gieo-que',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function GieoQueLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
