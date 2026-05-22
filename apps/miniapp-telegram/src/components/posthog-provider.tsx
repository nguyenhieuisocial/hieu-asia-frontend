'use client';

/**
 * PostHogProvider (miniapp-telegram) — initialises the PostHog browser
 * client on mount and fires a manual `$pageview` on every App Router
 * navigation.
 *
 * Session replay is disabled inside posthog.ts — we still want autocapture
 * + exceptions + pageviews for funnel analytics.
 */

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getPostHog } from '@/lib/posthog';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    getPostHog();
  }, []);

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
