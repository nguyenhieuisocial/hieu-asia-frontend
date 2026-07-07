/**
 * Wave 60.62.T1.2 — legacy route preserved for back-compat. 308 redirect
 * into the consolidated /affiliates tabbed page.
 *
 * Forwards optional `?root=<uuid>` subtree filter so deep-linked tree
 * views still land on the correct subtree.
 */

import { permanentRedirect } from 'next/navigation';

export default async function ReferralsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ root?: string }>;
}) {
  const { root } = await searchParams;
  permanentRedirect(
    root
      ? `/affiliates?tab=referrals&root=${encodeURIComponent(root)}`
      : '/affiliates?tab=referrals',
  );
}
