/**
 * Wave 60.69 — loading.tsx for /onboarding route segment (vault 109 §4.2).
 *
 * Reserves the wizard's typical above-the-fold geometry so CLS stays low
 * while the step page resolves: progress dots + title + form-field stack +
 * primary CTA. Wizard sub-pages (`/onboarding/topic`, `/birth`, `/situation`,
 * `/consent`) all share the same outer shell, so this skeleton covers them
 * via Next.js segment loading inheritance.
 *
 * Uses `<div role="status">` for the same landmark-no-duplicate-main reason
 * documented in the parent route's loading.tsx.
 */

import { Skeleton } from '@hieu-asia/ui';

export default function OnboardingLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-background pt-16"
    >
      <div className="mx-auto max-w-xl space-y-8 px-6 py-12">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          <Skeleton className="h-2 w-12 rounded-full" />
          <Skeleton className="h-2 w-12 rounded-full" />
          <Skeleton className="h-2 w-12 rounded-full" />
          <Skeleton className="h-2 w-12 rounded-full" />
        </div>
        {/* Title */}
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-3 w-20" />
          <Skeleton className="mx-auto h-8 w-3/4" />
          <Skeleton className="mx-auto h-4 w-2/3" />
        </div>
        {/* Form fields */}
        <div className="space-y-4 pt-4">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        {/* CTA */}
        <Skeleton className="h-12 w-full rounded-pill" />
      </div>
      <span className="sr-only">Đang tải bước onboarding…</span>
    </div>
  );
}
