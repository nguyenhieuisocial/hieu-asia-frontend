/**
 * Wave 60.62.T1.2 — legacy route preserved for back-compat. 308 redirect
 * into the consolidated /affiliates tabbed page.
 *
 * Forwards optional `?id=<uuid>` highlight as `?batchId=<uuid>` (renamed
 * to avoid clashing with the parent's `?tab=batches` query string).
 */

import { permanentRedirect } from 'next/navigation';

export default function BatchesRedirect({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams.id;
  permanentRedirect(
    id ? `/affiliates?tab=batches&batchId=${encodeURIComponent(id)}` : '/affiliates?tab=batches',
  );
}
