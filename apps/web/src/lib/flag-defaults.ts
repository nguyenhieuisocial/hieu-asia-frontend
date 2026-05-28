/**
 * Flag default values — fallback when PostHog is uninitialised, the flag
 * is undefined in the dashboard, or the SDK is blocked by ad-blocker / SSR.
 *
 * DESIGN PRINCIPLE: defaults MUST match the currently shipped UX so that
 * production behaviour is unchanged when the flag is added but not yet
 * configured in PostHog. This file is paired with `flags.ts`.
 *
 * Keyed by the on-wire string (the value of `FLAGS.*`), not the TS const
 * name, so callsites can do:
 *
 *   const fallback = FLAG_DEFAULTS[FLAGS.home_hero_eyebrow];
 *   const enabled = useFeatureFlag(FLAGS.home_hero_eyebrow, fallback);
 */

/**
 * Strongly-typed map of flag key → default value.
 *
 * NEW FLAG CHECKLIST:
 *   1. Add the key to `FLAGS` in `flags.ts`.
 *   2. Add the default here. For boolean flags, prefer `false` so that
 *      production is opt-in (founder must explicitly enable in PostHog).
 *   3. For multivariate flags, the default SHOULD be `"control"`.
 */
export const FLAG_DEFAULTS = {
  "home-hero-eyebrow": false,
  "mentor-sample-interactive": false,
  "light-mode-preview": false,
} as const satisfies Record<string, boolean | string>;

export type FlagDefaultKey = keyof typeof FLAG_DEFAULTS;
