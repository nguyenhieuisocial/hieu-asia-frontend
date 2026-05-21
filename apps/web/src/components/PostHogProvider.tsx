"use client";

/**
 * PostHogProvider — initialises the PostHog browser client on mount and
 * manually tracks pageviews on route change.
 *
 * We disable PostHog's built-in `capture_pageview` so we can fire a single
 * `$pageview` per Next.js navigation (App Router doesn't fire a full reload).
 */

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getPostHog } from "@/lib/posthog";

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
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return <>{children}</>;
}
