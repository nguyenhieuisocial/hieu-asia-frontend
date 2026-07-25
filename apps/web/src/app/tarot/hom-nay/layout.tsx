import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

export const metadata: Metadata = {
  // title cố ý bỏ ở layout: page.tsx (segment 'hom-nay') tự khai title:{absolute}.
  // Giữ title ở đây gây "Multiple title tags" — xem SEO audit GROUP 4.
  description:
    'Lá Tarot hôm nay — mỗi ngày một lá, chung cho mọi người. Không phải lời tiên đoán về ngày của bạn, mà là một lá để dừng lại và ngẫm. Miễn phí, không bói toán.',
  alternates: { canonical: 'https://hieu.asia/tarot/hom-nay' },
  openGraph: {
    title: 'Lá Tarot hôm nay — gợi ý phản tư mỗi ngày | hieu.asia',
    description: 'Mỗi ngày một lá Tarot để dừng lại và ngẫm — không tiên đoán, không bói toán.',
    url: 'https://hieu.asia/tarot/hom-nay',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

// SEO-FIX: WebPage + BreadcrumbList của trang này đã chuyển sang page.tsx —
// schema thuộc một route cụ thể không nên đặt ở layout, vì layout bọc cả các
// route con thêm sau này (đúng lỗi đã xảy ra ở app/tarot/layout.tsx). Layout chỉ
// giữ metadata.
export default function TarotTodayLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
