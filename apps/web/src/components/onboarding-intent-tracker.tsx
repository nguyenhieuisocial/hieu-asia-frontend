'use client';

import { useEffect } from 'react';

/**
 * Wave 60.66.P3 — OnboardingIntentTracker.
 *
 * Tiny client component that fires a single PostHog `onboarding_intent_seed`
 * event when the user arrives at /onboarding via an IntentChips deep-link
 * (?intent=<slug>). Pure analytics signal — doesn't render anything visible,
 * doesn't gate the onboarding flow.
 *
 * PostHog detection is feature-detect via `(window as any).posthog?.capture`
 * to avoid hard-importing the SDK at this layer (already wired by the root
 * `<PostHogProvider>`). Best-effort: silent fail if PH not initialised.
 */
export function OnboardingIntentTracker({ intent }: { intent: string }) {
  useEffect(() => {
    const ph = (window as unknown as {
      posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
    }).posthog;
    try {
      ph?.capture('onboarding_intent_seed', { intent });
    } catch {
      /* ignore — analytics best-effort */
    }
  }, [intent]);

  return null;
}
