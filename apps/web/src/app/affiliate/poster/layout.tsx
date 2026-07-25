import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/**
 * SEO-FIX — noindex cho /affiliate/poster.
 *
 * Trang này là tấm poster QR để cộng tác viên chụp/in, nội dung phụ thuộc
 * `?code=` trên URL — không phải trang nhắm tìm kiếm. Nó là client component nên
 * không tự khai được `metadata`, vì vậy đang rơi về title mặc định của site và
 * bị bỏ ở trạng thái `index, follow`.
 *
 * Cùng lý do repo đã đặt noindex cho /affiliate/assets. Khai qua layout vì
 * page.tsx là 'use client'.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AffiliatePosterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
