import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Cổng Partner',
  description:
    'Cổng affiliate partner hieu.asia: dashboard subtree, commission ledger, payout history, KYC profile.',
  robots: { index: false, follow: false },
};

// Wave 44.2 — disable static optimization; per-request cookie read forces dynamic.
export const dynamic = 'force-dynamic';

/**
 * Wave 44.2 — Server-side partner gate (defense-in-depth).
 *
 * Supabase JWT lives in localStorage, not cookies, so full SSR auth is not
 * possible here. `auth-client.ts` mirrors session presence into a non-httpOnly
 * `hieu_authed=1` cookie. We use it as a hint:
 *
 *   - Cookie absent → 302 to /signin?next=/partner. Closes the JS-disabled /
 *     anonymous-visitor leak path where partner shell HTML used to stream
 *     before the client guard mounted.
 *   - Cookie present → render shell. <PartnerShell> client component runs
 *     `usePartnerGuard()` which hits /api/partner/me with the Bearer token —
 *     worker JWT-verifies + RLS = real boundary.
 *
 * /api/partner/* worker routes remain the authoritative auth boundary. Anyone
 * forging the cookie still gets 401 from the API and bounced by the client
 * guard. Full cookie-session migration deferred to Wave 52+.
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
