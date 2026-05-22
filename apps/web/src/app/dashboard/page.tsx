import { permanentRedirect } from 'next/navigation';

/**
 * /dashboard — permanent 308 redirect to /account.
 *
 * Wave 40 (P2 nav cleanup): kept for backwards compat with bookmarked URLs,
 * shared links and old auth callbacks. All internal callers now link to
 * /account directly; this exists only to preserve external links.
 */
export default function DashboardPage() {
  permanentRedirect('/account');
}
