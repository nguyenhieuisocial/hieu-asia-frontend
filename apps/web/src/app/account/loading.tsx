/**
 * Wave 60.69 — loading.tsx for /account route segment (vault 109 §4.2).
 *
 * Mirrors the first-paint blocks of `AccountPageInner` (FeedHero ~240px,
 * ActivityFeed ~220px, PinnedInsights ~220px, QuickActions ~180px) so CLS
 * stays minimal when the client component hydrates and the actual content
 * replaces the placeholder. Identical visual rhythm to the in-page
 * `AccountSkeleton` already used inside Suspense fallback (page.tsx:72-92).
 *
 * Reuses the shadcn `<Skeleton>` primitive — `animate-pulse bg-cream/10` matches
 * the in-app token palette (warm-dark/cream/gold) not the marketing palette.
 *
 * Uses `<div role="status">` not `<main>` (same landmark-no-duplicate-main
 * reasoning as `apps/web/src/app/loading.tsx`).
 */

import { Skeleton } from '@hieu-asia/ui';

export default function AccountLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-background pt-16"
    >
      <div className="mx-auto max-w-3xl space-y-10 px-6 pb-20 pt-12 sm:pt-16">
        {/* FeedHero */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-3/4 sm:h-12" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-6 h-20 w-full rounded-2xl" />
        </div>
        {/* ActivityFeed */}
        <Skeleton className="h-[220px] w-full rounded-xl" />
        {/* PinnedInsights */}
        <Skeleton className="h-[220px] w-full rounded-xl" />
        {/* QuickActions */}
        <Skeleton className="h-[180px] w-full rounded-xl" />
      </div>
      <span className="sr-only">Đang tải trang tài khoản…</span>
    </div>
  );
}
