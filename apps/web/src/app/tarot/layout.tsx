import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Rút bài Tarot online — gợi ý phản tư',
  description:
    'Rút lá Tarot (78 lá) cho câu hỏi bạn đang phân vân — mỗi lá là một lăng kính để tự suy ngẫm. Miễn phí, không bói toán, không tiên đoán.',
  alternates: { canonical: 'https://hieu.asia/tarot' },
  openGraph: {
    title: 'Rút bài Tarot — gợi ý phản tư | hieu.asia',
    description: 'Rút lá Tarot cho điều bạn đang phân vân — gợi ý để tự suy ngẫm, không bói toán.',
    url: 'https://hieu.asia/tarot',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

// SEO-FIX: WebPage / SoftwareApplication / BreadcrumbList của TRANG /tarot đã
// được chuyển sang page.tsx. Đặt ở layout khiến mọi route con (/tarot/y-nghia,
// /tarot/y-nghia/[slug], /tarot/hom-nay) cũng phát bộ schema của trang cha →
// trang con có 2 WebPage (một trỏ sai url /tarot), 2 BreadcrumbList (một bị cắt
// ngắn) và 1 SoftwareApplication không thuộc về nó. Layout chỉ giữ metadata.
export default function TarotLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
