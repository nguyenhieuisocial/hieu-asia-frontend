import { permanentRedirect } from 'next/navigation';

/**
 * /onboarding-wizard — retired (308 → /onboarding).
 *
 * The Wave 58 "mandatory onboarding" 4-step wizard was a parked WIP: blocked
 * from search (robots) and never linked from the live UI (last touched only by
 * a cross-cutting security fix on 2026-06-14, no feature work since). It now
 * permanently redirects to the active onboarding flow so the dead route stops
 * adding clutter. The original wizard implementation lives in git history if
 * Wave 58 is ever resumed.
 */
export default function OnboardingWizardPage() {
  permanentRedirect('/onboarding');
}
