import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gieo quẻ Kinh Dịch online — bốc quẻ hỏi việc',
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

// SEO-FIX: WebPage / SoftwareApplication / BreadcrumbList của TRANG /gieo-que đã
// được chuyển sang page.tsx. Đặt ở layout khiến mọi route con (/gieo-que/y-nghia,
// /gieo-que/y-nghia/[slug]) cũng phát bộ schema của trang cha → trang con có 2
// WebPage (một trỏ sai url /gieo-que), 2 BreadcrumbList (một bị cắt ngắn) và 1
// SoftwareApplication không thuộc về nó. Layout chỉ giữ metadata.
export default function GieoQueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
