/**
 * Wave 60.62.T1.2 — legacy route preserved for back-compat (email links,
 * vault docs, bookmarks). 308 redirect into the consolidated /affiliates
 * tabbed page. See `/affiliates/page.tsx` for the new orchestrator.
 */

import { permanentRedirect } from 'next/navigation';

export default function PromotersRedirect() {
  permanentRedirect('/affiliates?tab=promoters');
}
