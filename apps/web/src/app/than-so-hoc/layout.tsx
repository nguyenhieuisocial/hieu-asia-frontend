import type { Metadata } from 'next';

/**
 * Wave 60.96.1 — /than-so-hoc structural completeness.
 *
 * Pre-fix audit (vault 156 P0): missing OG image, Twitter card, BreadcrumbList
 * JSON-LD và WebPage JSON-LD. Social previews rendered blank because root-layout
 * openGraph is REPLACED (not merged) when a route declares its own block —
 * same trap caught in Wave 60.95.k cho /pricing, /sample-report, /methodology.
 */
export const metadata: Metadata = {
  title: 'Thần Số Học online miễn phí theo ngày sinh, tên',
  description:
    'Tính số chủ đạo, số vận mệnh, số linh hồn và năm cá nhân 2026 online miễn phí — phân tích AI theo ngày sinh và họ tên đầy đủ. Không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/than-so-hoc' },
  openGraph: {
    title: 'Thần Số Học online miễn phí',
    description: 'Số chủ đạo, vận mệnh, linh hồn, năm cá nhân — phân tích AI miễn phí.',
    url: 'https://hieu.asia/than-so-hoc',
    type: 'website',
    locale: 'vi_VN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Thần Số Học: số chủ đạo, vận mệnh, linh hồn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thần Số Học online miễn phí',
    description: 'Số chủ đạo, vận mệnh, linh hồn, năm cá nhân — phân tích AI miễn phí.',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Thần Số Học: số chủ đạo, vận mệnh, linh hồn',
      },
    ],
  },
};

// SEO-FIX: WebPage + BreadcrumbList của TRANG /than-so-hoc đã được chuyển sang
// page.tsx. Đặt ở layout khiến mọi route con (/cac-loai-so, /cac-loai-so/[slug],
// /y-nghia, /y-nghia/[slug], /result) cũng phát bộ schema của trang cha → trang
// con có 2 WebPage (một trỏ sai url /than-so-hoc) và 2 BreadcrumbList (một bị cắt
// còn 2 cấp). Cùng lỗi đã sửa cho app/tarot + app/gieo-que (PR #939). Layout chỉ
// giữ metadata.
export default function ThanSoHocLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
