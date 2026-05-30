import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gieo Quẻ Kinh Dịch online — bốc quẻ hỏi việc miễn phí',
  description:
    'Gieo quẻ Kinh Dịch online theo phép 3 đồng xu: lập quẻ chính, quẻ biến và hào động trong 64 quẻ Dịch, kèm lời gợi mở để suy ngẫm trước khi quyết định.',
  alternates: { canonical: 'https://hieu.asia/gieo-que' },
  openGraph: {
    title: 'Gieo Quẻ Kinh Dịch',
    description: 'Bốc quẻ hỏi việc theo Kinh Dịch — quẻ chính, quẻ biến, hào động và lời luận giải.',
    url: 'https://hieu.asia/gieo-que',
    type: 'website',
  },
};

export default function GieoQueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
