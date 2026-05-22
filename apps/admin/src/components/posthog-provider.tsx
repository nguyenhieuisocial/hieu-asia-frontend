'use client';

/**
 * PostHogProvider (admin) — initialises the PostHog browser client on mount
 * and fires a manual `$pageview` on every App Router navigation.
 *
 * Built-in `capture_pageview` is disabled in posthog.ts so we control timing.
 */

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getPostHog } from '@/lib/posthog';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialise once on mount.
  React.useEffect(() => {
    getPostHog();
  }, []);

  // Manual pageview on every route change.
  React.useEffect(() => {
    const ph = getPostHog();
    if (!ph) return;
    if (!pathname) return;

    let url = window.location.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    ph.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
