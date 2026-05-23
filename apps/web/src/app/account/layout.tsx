import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tài khoản của bạn',
  description:
    'Trung tâm quản lý tài khoản hieu.asia: lá số, quyết định, mentor, thanh toán, affiliate, quyền riêng tư.',
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  // Client-side auth gate lives in apps/web/src/app/account/page.tsx via
  // useAuth() — we cannot read Supabase session from cookies() reliably
  // because the SDK uses a single storage key in localStorage, not cookies.
  return <>{children}</>;
}
