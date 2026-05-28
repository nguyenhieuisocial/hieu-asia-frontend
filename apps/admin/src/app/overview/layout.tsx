import type { Metadata } from 'next';

/**
 * Wave 60.95.x — `/overview` route metadata.
 *
 * Admin is gated and not indexed (root layout already sets robots: noindex,
 * follow). We re-state it here so the per-route title flows through Next's
 * metadata template (`%s · admin.hieu.asia`) — yields `Overview · admin.hieu.asia`.
 */
export const metadata: Metadata = {
  title: 'Overview',
  robots: { index: false, follow: true },
};

export default function OverviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
