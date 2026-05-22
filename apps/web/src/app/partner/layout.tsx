import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cổng Partner — hieu.asia',
  description:
    'Cổng affiliate partner hieu.asia: dashboard subtree, commission ledger, payout history, KYC profile.',
  robots: { index: false, follow: false },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  // Client-side gate lives in each /partner/* page via usePartnerGuard().
  // We cannot SSR-gate because Supabase Auth session lives in localStorage,
  // not cookies (see apps/web/src/app/account/layout.tsx pattern).
  return <>{children}</>;
}
