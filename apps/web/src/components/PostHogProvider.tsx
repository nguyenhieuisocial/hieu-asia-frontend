"use client";

/**
 * PostHogProvider — initialises the PostHog browser client on mount,
 * wires Web Vitals reporting, attaches identify on auth state change,
 * and manually tracks pageviews on route change.
 *
 * We disable PostHog's built-in `capture_pageview` so we can fire a single
 * `$pageview` per Next.js navigation (App Router doesn't fire a full reload).
 */

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getPostHog } from "@/lib/posthog";
import { wireWebVitals } from "@/lib/web-vitals";
import { identifyUser } from "@/lib/identify";
import { getSupabaseAuth } from "@/lib/auth-client";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialise once on mount + wire web vitals.
  React.useEffect(() => {
    getPostHog();
    wireWebVitals();
  }, []);

  // Watch Supabase auth — re-identify on session restore + tier refresh.
  React.useEffect(() => {
    const supabase = getSupabaseAuth();
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session?.user) {
        void identifyUser(data.session.user);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.user) {
        void identifyUser(session.user);
      }
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
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
