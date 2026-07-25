import type { Metadata } from 'next';
import { ReferralClaimOnce } from '@/components/referral/ReferralClaimOnce';

export const metadata: Metadata = {
  title: 'Tài khoản của bạn',
  description:
    'Trung tâm quản lý tài khoản hieu.asia: lá số, quyết định, mentor, thanh toán, affiliate, quyền riêng tư.',
  // Wave 60.95.k P1-SEO — even though /account is `robots: noindex`, a
  // shared /account link in a Zalo/Slack DM should still preview cleanly
  // (the previous root-layout og:image didn't propagate because the page
  // shipped no openGraph block at all; with this present, social cards now
  // resolve). `twitter:card=summary_large_image` for the same reason.
  openGraph: {
    title: 'Tài khoản của bạn',
    description:
      'Trung tâm quản lý tài khoản hieu.asia: lá số, quyết định, mentor, thanh toán.',
    url: 'https://hieu.asia/account',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — Tài khoản: lá số, quyết định, mentor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tài khoản của bạn',
    description: 'Lá số · Quyết định · Mentor · Thanh toán',
    images: [
      {
        url: '/og-image.jpg',
        alt: 'hieu.asia — Tài khoản: lá số, quyết định, mentor',
      },
    ],
  },
  robots: { index: false, follow: false },
};

// SEO-FIX: WebPage + BreadcrumbList của TRANG /account đã chuyển sang page.tsx.
// Đặt ở layout khiến CẢ 11 route con (/account/chart, /account/mentor, …) cũng
// phát bộ schema của trang cha → mỗi trang con có 2 WebPage (một trỏ sai url về
// /account) và 2 BreadcrumbList. Cùng lỗi đã sửa cho tarot / gieo-que /
// than-so-hoc (#939, #941). Ở đây cả nhánh là noindex nên Google không thấy —
// nhưng sửa để LUẬT không cần ngoại lệ, và guard test bên dưới khoá được nó:
// src/app/layout-schema.guard.test.ts
export default function AccountLayout({ children }: { children: React.ReactNode }) {
  // Client-side auth gate lives in apps/web/src/app/account/page.tsx via
  // useAuth() — we cannot read Supabase session from cookies() reliably
  // because the SDK uses a single storage key in localStorage, not cookies.
  return (
    <>
      <ReferralClaimOnce />
      {children}
    </>
  );
}
