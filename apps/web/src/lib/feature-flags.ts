/**
 * Feature flags — typed PostHog feature flag IDs + React hook.
 *
 * Flag identifiers live in PostHog (Feature Flags section). Keep `FLAG_KEYS`
 * in sync with the dashboard. Variants other than boolean are supported via
 * the generic `T` in `useFeatureFlag<T>()`.
 *
 * Fires `feature_flag_evaluated` once per (key, variant) per session so
 * downstream events can be correlated with the variant the user actually
 * saw (PostHog's automatic `$feature_flag_called` covers a similar need,
 * but our custom event lands in the same KV-backed funnel store too).
 *
 * Falls back to `defaultValue` when PostHog is uninitialised (missing key,
 * SSR, user opted out, ad-blocker, etc.) — callers MUST treat the flag as
 * progressive enhancement, never a hard gate on critical paths.
 */

"use client";

import * as React from "react";
import { getPostHog } from "./posthog";
import { track } from "./analytics";

/**
 * Canonical flag identifiers. The string value MUST match the flag key in
 * the PostHog dashboard exactly. Adding a flag here is cheap; removing one
 * requires verifying no `useFeatureFlag(FLAGS.…)` callsites remain.
 *
 * NEW FLAG CHECKLIST:
 *   1. Create the flag in PostHog → copy the key.
 *   2. Add a `const` here with a short JSDoc explaining the gate.
 *   3. `useFeatureFlag(FLAGS.your_flag, fallback)` at the consumer site.
 *   4. Document expected variants in PostHogProvider.README.md.
 */
export const FLAGS = {
  /**
   * `expert-mode-default-on` — boolean.
   *
   * When true, new visitors (no `hieu:expert-mode:v1` in localStorage) see
   * the expert variant by default on reading pages. When false / unset,
   * beginner remains the default. Existing users' saved preference always
   * wins. Use to A/B test conversion impact of language complexity.
   */
  EXPERT_MODE_DEFAULT_ON: "expert-mode-default-on",

  /**
   * `pricing-launch-banner` — boolean.
   *
   * Gates the LAUNCH30 promo banner on /pricing. Lets us turn the campaign
   * on/off without redeploying when the coupon expires or we run out of
   * budget. Defaults to `true` so the banner shows if PostHog is down.
   *
   * NOTE: The PostHog dashboard flag key was renamed from
   * `pricing-launch50-banner` → `pricing-launch-banner` to drop the stale
   * "50" suffix (the discount has always been 30%). Update the PostHog
   * dashboard side in lockstep with deploying this change.
   */
  PRICING_LAUNCH_BANNER: "pricing-launch-banner",

  /**
   * `mentor-skills-rollout` — boolean.
   *
   * Controls the mentor "skills" tab on /reading/[id]/mentor. Lets us
   * progressively roll out the skill picker UI to a percentage of users
   * before going GA. Defaults to `true` since the UI is already shipped.
   */
  MENTOR_SKILLS_ROLLOUT: "mentor-skills-rollout",

  /**
   * `mentor_model_variant` — multivariate string.
   *
   * Variants: `control` | `claude-sonnet-4` | `gemini-1.5-pro`. The web
   * client forwards the assignment to `/api/mentor/stream` (and the
   * non-streaming `/api/mentor`) which proxies it to the worker via
   * `X-Model-Variant`. The worker validates against
   * `MENTOR_VARIANT_ALLOWLIST` and either swaps the primary vendor + model
   * or falls back to `ROLE_ROUTING.mentor`. `control` is intentionally
   * not in the allowlist — it means "use the default route".
   *
   * Defaults to `control` when PostHog is unloaded so the existing
   * behaviour is preserved.
   */
  MENTOR_MODEL_VARIANT: "mentor_model_variant",

  /**
   * `pricing_display_variant` — multivariate string.
   *
   * Variants: `tier-cards` | `comparison-table`. Decides whether the
   * desktop /pricing view renders the side-by-side comparison table
   * (default, current behaviour) or stacked tier cards on every viewport.
   * Defaults to `tier-cards`.
   */
  PRICING_DISPLAY_VARIANT: "pricing_display_variant",

  /**
   * `onboarding_skip_optional` — boolean.
   *
   * When true, the optional-consent screen at `/onboarding/consent`
   * pre-checks all `OPTIONAL_ITEMS` and routes straight to the next
   * step on first paint. Targeted at users tagged `persona=power_user`
   * via PostHog cohort. Default false — show the full screen.
   */
  ONBOARDING_SKIP_OPTIONAL: "onboarding_skip_optional",

  /**
   * `affiliate_l2_visible` — boolean.
   *
   * Gates the L2 (5% commission) card on /affiliate/dashboard +
   * /affiliate/network. Default false until the multi-tier programme
   * officially launches. Flip ON to reveal L2 metrics network-wide.
   */
  AFFILIATE_L2_VISIBLE: "affiliate_l2_visible",
} as const;

export type FlagKey = (typeof FLAGS)[keyof typeof FLAGS];

export function useFeatureFlag<T extends boolean | string = boolean>(
  key: FlagKey | string,
  defaultValue: T = false as T,
): T {
  const [value, setValue] = React.useState<T>(defaultValue);
  const reportedRef = React.useRef<string | boolean | null>(null);

  React.useEffect(() => {
    const ph = getPostHog();
    if (!ph) return;

    const read = () => {
      const flag = ph.getFeatureFlag(key);
      if (flag === undefined) return;
      setValue(flag as T);
      // Fire `feature_flag_evaluated` once per (key, variant) per session
      // so we can correlate downstream events with the variant they saw.
      const variant = flag as string | boolean;
      if (reportedRef.current !== variant) {
        reportedRef.current = variant;
        track("feature_flag_evaluated", { flag_key: key, variant });
      }
    };

    // Initial read (flags may already be loaded).
    read();
    // Re-read whenever PostHog finishes loading remote flag config.
    const unsubscribe = ph.onFeatureFlags(() => read());
    return () => {
      try {
        unsubscribe?.();
      } catch {
        /* ignore */
      }
    };
  }, [key]);

  return value;
}

/**
 * Imperative read — for non-React callsites (e.g. localStorage initializers,
 * event handlers). Returns `undefined` when PostHog hasn't loaded flags yet;
 * caller decides the fallback.
 */
export function readFeatureFlag(
  key: FlagKey | string,
): boolean | string | undefined {
  const ph = getPostHog();
  if (!ph) return undefined;
  try {
    return ph.getFeatureFlag(key);
  } catch {
    return undefined;
  }
}
