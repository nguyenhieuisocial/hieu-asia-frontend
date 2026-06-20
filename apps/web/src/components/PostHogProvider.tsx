"use client";

/**
 * PostHogProvider — initialises the PostHog browser client on mount,
 * wires Web Vitals reporting, attaches identify on auth state change,
 * and manually tracks pageviews on route change.
 *
 * We disable PostHog's built-in `capture_pageview` so we can fire a single
 * `$pageview` per Next.js navigation (App Router doesn't fire a full reload).
 *
 * Soft-404 fix: `useSearchParams()` requires a Suspense boundary, but that
 * boundary must NOT wrap `{children}` — a root-level boundary makes the shell
 * flush before any page runs, so notFound() can no longer set a real HTTP 404
 * (every unknown slug returned 200 + noindex). The tracking hooks live in an
 * inner render-null component wrapped in its own Suspense; children render
 * outside any boundary.
 */

import * as React from "react";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getPostHog } from "@/lib/posthog";
import { wireWebVitals } from "@/lib/web-vitals";
import { identifyUser } from "@/lib/identify";
import { onboardAffiliateFromRef } from "@/lib/affiliate-onboard";
import { getSupabaseAuth } from "@/lib/auth-client";
import { captureAttribution } from "@/lib/attribution";
import { wireBehaviorTracking } from "@/lib/behavior";
import { getConsent } from "@/lib/consent";
import {
  hasMarketingConsent,
  loadMarketingPixels,
  trackPixelPageView,
} from "@/lib/marketing-pixels";

function PostHogTracking(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialise once on mount + wire web vitals, attribution, behaviour.
  React.useEffect(() => {
    getPostHog();
    wireWebVitals();
    // Wave 41 Track A — capture UTM/click-IDs on first paint, before any
    // user interaction or identify() can blow away the anon attribution.
    captureAttribution();
    // Wave 41 Track B — wire scroll/dwell/exit-intent/form/copy events.
    wireBehaviorTracking();
    // Wave 41 Track D — if user already opted in marketing in a previous
    // session, load pixels now (idempotent).
    if (hasMarketingConsent()) {
      loadMarketingPixels();
    }
    // NOTE: we no longer copy PostHog's distinct_id into `hieu.user_id`. That
    // overwrote the `anon_<uuid>` (which the backend requires for pre-login
    // reading history) with a bare UUID and silently lost the history. Identity
    // is now unified the other way: posthog.ts bootstraps PostHog's distinct_id
    // FROM `getOrCreateAnonUserId()`, so both ids already match.
    // (Returning anonymous visitors whose PostHog distinct_id predates this fix
    // keep a bare-uuid PH id; autocapture-vs-custom may fragment for that small
    // cohort — acceptable pre-launch; revisit with a dual-alias if it ships to
    // real traffic.)
  }, []);

  // Watch Supabase auth — re-identify on session restore + tier refresh.
  React.useEffect(() => {
    const supabase = getSupabaseAuth();
    if (!supabase) return;
    let cancelled = false;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        if (data.session?.user) {
          void identifyUser(data.session.user);
          // Catches the "/r/<CODE> clicked after signup" edge case where the user
          // never re-enters /auth/callback. Idempotent — localStorage flag +
          // worker-side dedupe stop repeat calls on token refresh.
          void onboardAffiliateFromRef();
        }
      })
      // getSession() reject ở ngữ cảnh storage bị chặn (iOS/private) — provider
      // này bọc MỌI trang, nên bắt để không nổi thành unhandled-rejection
      // (capture_exceptions ở dưới sẽ đổ vào Sentry). Không có session = không định danh.
      .catch(() => {});
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (session?.user) {
        void identifyUser(session.user);
        void onboardAffiliateFromRef();
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
    if (!pathname) return;

    let url = window.location.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    if (ph) ph.capture("$pageview", { $current_url: url });

    // Wave 41 — re-capture attribution on every SPA nav so cross-page
    // `?utm_*` / `?fbclid` arrivals still register.
    captureAttribution();

    // Fire marketing pixel PageView on each SPA nav (consent-gated).
    if (hasMarketingConsent()) {
      trackPixelPageView();
    }
    // Silence unused-var lint when consent off.
    void getConsent;
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <PostHogTracking />
      </Suspense>
      {children}
    </>
  );
}
