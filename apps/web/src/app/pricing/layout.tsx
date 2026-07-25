import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bảng giá',
  // vault 147 §a — nỗi đau VOC lớn nhất ở màn giá là "bẫy thanh toán" và
  // "giá mờ ám". Nói thẳng giá + không tự động gia hạn ngay trong description.
  // SEO-FIX: 181 → 160 ký tự. Giữ nguyên cả 3 mức giá (phần quan trọng nhất);
  // rút câu cuối còn "Bắt đầu miễn phí." vì phần sau vốn đã bị Google cắt.
  description:
    'Giá rõ ràng, không bẫy thuê bao: Premium 99.000đ một lần · Mentor 199.000đ/tháng, huỷ bất cứ lúc nào · Lifetime 4.990.000đ trọn đời. Bắt đầu miễn phí.',
  alternates: { canonical: 'https://hieu.asia/pricing' },
  // Wave 60.95.k P1-SEO — route-level openGraph REPLACES root-layout
  // openGraph (Next.js merge semantics), so we must re-declare `images` here
  // or Zalo/Facebook/Telegram/Slack previews render blank. Same for `twitter`.
  openGraph: {
    title: 'Bảng giá',
    description:
      'Premium 99.000đ · Mentor Monthly 199.000đ/tháng · Mentor Yearly 1.990.000đ/năm · Lifetime 4.990.000đ. Mở khóa góc nhìn sâu cho mỗi quyết định.',
    url: 'https://hieu.asia/pricing',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Bảng giá Premium / Mentor / Lifetime',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bảng giá',
    description:
      'Premium 99.000đ · Mentor 199.000đ/tháng · Lifetime 4.990.000đ.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Bảng giá Premium / Mentor / Lifetime',
      },
    ],
  },
};



// JSON-LD của trang KHÔNG đặt ở layout: layout bọc mọi route con nên schema sẽ
// rớt xuống, và ở đây nó còn TRÙNG với Product mà `page.tsx` đã phát. Product +
// BreadcrumbList nay nằm trong `page.tsx`. Layout chỉ giữ metadata.
export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
