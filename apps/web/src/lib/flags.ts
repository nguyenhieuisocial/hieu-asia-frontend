/**
 * Flag registry — canonical PostHog feature flag keys (Wave 60.95.w scaffold).
 *
 * SEPARATION OF CONCERNS:
 *   - `flags.ts` (this file) — NEW canonical registry for flags introduced
 *     from Wave 60.95.w onward. Use `FLAGS.*` to reference keys at callsites.
 *   - `feature-flags.ts` — Pre-existing wrapper that exports `useFeatureFlag`
 *     + `readFeatureFlag` + a legacy `FLAGS` constant. Existing flags (EXPERT_MODE,
 *     PRICING_LAUNCH_BANNER, etc.) remain there to avoid breaking callsites.
 *
 * Consumers import from this file going forward:
 *   import { useFeatureFlag } from "@/lib/feature-flags";
 *   import { FLAGS, FLAG_DEFAULTS } from "@/lib/flags";
 *   const showEyebrow = useFeatureFlag(FLAGS.home_hero_eyebrow, FLAG_DEFAULTS[FLAGS.home_hero_eyebrow]);
 *
 * SCAFFOLD ONLY: these flags are DEFINED but NOT WIRED into components yet.
 * Founder must:
 *   1. Create each flag in PostHog dashboard with the exact key below.
 *   2. Wire `useFeatureFlag(FLAGS.…)` at the consumer callsite (separate commit).
 *   3. Default values (see `flag-defaults.ts`) preserve current shipped UX so
 *      production is unaffected if PostHog is unreachable or flag is unset.
 */

import { FLAG_DEFAULTS } from "./flag-defaults";

/**
 * Canonical flag identifiers (Wave 60.95.w +).
 *
 * STRING VALUES MUST MATCH POSTHOG DASHBOARD KEYS EXACTLY.
 * Use snake_case_kebab-case as the on-wire key, camelCase for the TS const
 * to match the existing `feature-flags.ts` style (UPPER_CASE_SNAKE there;
 * here we use a lowercased object-key style for ergonomic destructuring).
 */
export const FLAGS = {
  /**
   * `home-hero-eyebrow` — boolean.
   *
   * Gates the hero eyebrow slot on `/` (HomeHero). Wave 60.95.r removed
   * the eyebrow entirely per founder direction. This flag lets the founder
   * A/B test re-adding it without a redeploy.
   *
   * Default: `false` (matches Wave 60.95.r shipped state — no eyebrow).
   * Variants: boolean.
   */
  home_hero_eyebrow: "home-hero-eyebrow",

  /**
   * `mentor-sample-interactive` — boolean.
   *
   * Toggles the MentorSampleInteractive component shipped in Wave 60.95.i
   * on the home/marketing pages. Lets the founder kill-switch the
   * interactive sample if it causes UX regressions or perf issues.
   *
   * Default: `false` (conservative — when the flag is undefined in PostHog
   * or the SDK is offline, the existing rendered UI continues to show;
   * the consumer's responsibility is to fall back to current behaviour).
   * Variants: boolean.
   */
  mentor_sample_interactive: "mentor-sample-interactive",

  /**
   * `light-mode-preview` — boolean.
   *
   * Future-proofs the Wave 60.82 light-mode rollout. Currently the site
   * forces dark via `enableSystem={false}` (Wave 60.95.p). When this flag
   * is true for a cohort, the ThemeProvider can opt-in `enableSystem`
   * for that cohort so they can preview light mode before GA.
   *
   * Default: `false` (dark-only, current shipped state).
   * Variants: boolean.
   */
  light_mode_preview: "light-mode-preview",
} as const;

/**
 * Type of all valid flag-key string values (e.g. `"home-hero-eyebrow"`).
 * Use this on consumer hooks: `useFeatureFlag(FLAGS.home_hero_eyebrow, false)`.
 */
export type FlagKey = (typeof FLAGS)[keyof typeof FLAGS];

/**
 * Re-export defaults so consumers can write a single import:
 *   import { FLAGS, FLAG_DEFAULTS } from "@/lib/flags";
 */
export { FLAG_DEFAULTS };
