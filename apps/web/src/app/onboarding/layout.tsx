import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * SEO-FIX — noindex cho CẢ phễu /onboarding, khai một lần ở layout.
 *
 * Chủ ý của repo là để toàn bộ phễu đăng ký ngoài index (xem comment trong
 * app/sitemap.ts: "noindex pages are intentionally NOT listed here — /onboarding
 * ..."). Nhưng chỉ `/onboarding` và `/onboarding/birth` tự khai `robots.index:
 * false`; ba bước còn lại bị bỏ sót nên đang là `index, follow`:
 *
 *   /onboarding/topic · /onboarding/consent · /onboarding/situation
 *
 * Đó là các bước biểu mẫu, nội dung mỏng, không có giá trị tìm kiếm — để Google
 * index trang "Đồng ý sử dụng" vừa vô ích vừa tranh chỗ với trang thật.
 *
 * Đặt ở layout (chứ không vá từng page) vì noindex là CHÍNH SÁCH của cả nhánh
 * route: mọi bước thêm sau này tự động thừa hưởng, không lọt lại lần nữa.
 * `follow` giữ nguyên để link nội bộ trong phễu vẫn truyền giá trị.
 *
 * Lưu ý: khác với JSON-LD — schema là nội dung RIÊNG của từng trang nên KHÔNG
 * được đặt ở layout (xem PR #939/#941); còn robots là chính sách theo nhánh nên
 * layout mới là chỗ đúng.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
