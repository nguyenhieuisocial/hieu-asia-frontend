'use client';

/**
 * Wave 61.07 — A/B test experiment wire.
 *
 * First proof-of-concept experiment for hieu.asia's PostHog flag registry
 * (Wave 60.95.w shipped `flags.ts` + defaults). Wave 60.95.r removed the
 * hero eyebrow slot per founder direction; this component conditionally
 * RE-adds a subtle eyebrow ONLY when the `home-hero-eyebrow` flag is true.
 *
 * Founder rolls out via PostHog dashboard — set `home-hero-eyebrow` to
 * 50% to A/B test the eyebrow's impact on hero engagement. Default 0%
 * (off) preserves Wave 60.95.r decision; cohort can opt in via flag.
 */

import { useFeatureFlag } from '@/lib/feature-flags';
import { FLAGS } from '@/lib/flags';
import { FLAG_DEFAULTS } from '@/lib/flag-defaults';

export function HomeHeroEyebrow() {
  const enabled = useFeatureFlag(
    FLAGS.home_hero_eyebrow,
    FLAG_DEFAULTS[FLAGS.home_hero_eyebrow],
  );
  if (!enabled) return null;
  return (
    <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
      🪷 Cẩm nang đang được nâng cấp
    </span>
  );
}
