import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Cổng Partner — hieu.asia',
  description:
    'Cổng affiliate partner hieu.asia: dashboard subtree, commission ledger, payout history, KYC profile.',
  robots: { index: false, follow: false },
};

// Wave 44.2 — disable static optimization. The cookie check below depends on
// per-request headers, so this segment must render dynamically.
export const dynamic = 'force-dynamic';

/**
 * Wave 44.2 — Server-side partner gate (defense-in-depth).
 *
 * The Supabase JWT lives in localStorage (NOT cookies) so we cannot perform
 * a full SSR auth check here. Instead, `auth-client.ts` mirrors session
 * presence into a non-httpOnly `hieu_authed=1` cookie. We use it as a hint:
 *
 *   - Cookie absent → user has no session → 302 to /signin?next=/partner
 *     (closes the JS-disabled / anonymous-visitor leak path — previously the
 *     partner shell HTML was streamed before the client guard mounted).
 *   - Cookie present → render shell. The `<PartnerShell>` client component
 *     runs `usePartnerGuard()` which performs the REAL role check by calling
 *     /api/partner/me with the Bearer token (worker JWT-verifies + RLS).
 *
 * The /api/partner/* worker routes remain the authoritative auth boundary.
 * Anyone forging the cookie still gets 401 from the API and bounced by the
 * client guard. Full cookie-session migration is deferred to Wave 52+.
 */
export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const marker = cookieStore.get('hieu_authed');
  if (!marker || marker.value !== '1') {
    redirect('/signin?next=/partner');
  }
  return <>{children}</>;
}
