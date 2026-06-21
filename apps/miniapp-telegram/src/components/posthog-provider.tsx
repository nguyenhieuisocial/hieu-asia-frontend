'use client';

/**
 * PostHogProvider (miniapp-telegram) — initialises the PostHog browser
 * client on mount and fires a manual `$pageview` on every App Router
 * navigation.
 *
 * Session replay is disabled inside posthog.ts — we still want autocapture
 * + exceptions + pageviews for funnel analytics.
 *
 * Hydration note: `useSearchParams()` opts its component into client-side
 * rendering and, read high in the tree (this provider wraps every page),
 * intermittently de-opts hydration of the whole route. The fix (matching
 * apps/web + apps/admin, PR #470) is to isolate the search-param read in a
 * leaf component behind its own <Suspense> so it can never block `{children}`.
 */

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getPostHog } from '@/lib/posthog';

/** Leaf component: reads the URL and fires pageviews. Isolated in <Suspense>. */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const ph = getPostHog();
    if (!ph) return;
    if (!pathname) return;

    let url = window.location.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    ph.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Initialise once on mount.
  React.useEffect(() => {
    getPostHog();
  }, []);

  return (
    <>
      <React.Suspense fallback={null}>
        <PostHogPageView />
      </React.Suspense>
      {children}
    </>
  );
}
