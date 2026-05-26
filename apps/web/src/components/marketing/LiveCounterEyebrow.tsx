/**
 * Wave 60.66.P1 — LiveCounterEyebrow (Option E "Editorial Live" vault 108).
 *
 * Drop-in eyebrow variant for MarketingHero. Phase 1 ships STATIC seed numbers
 * (per vault 108 § 5 — Live counter source: "Static seed Phase 1, real PostHog
 * API wire Phase 4"). Founder must be able to defend the number; if not, swap
 * to neutral copy (vault 108 Risk 3).
 *
 * Renders the same mono uppercase gold eyebrow pattern as MarketingHero's
 * existing `eyebrow?: string` path — horizontal-rule prefix + text — so the
 * visual rhythm is preserved when swapping from static eyebrow to live counter.
 *
 * Server component: no hooks, no client state. Numbers come in via props from
 * the page-level Server Component. Phase 4 will wire PostHog API in the page
 * component and pass `count` down — this component stays pure.
 *
 * Tokens (from `apps/web/tailwind.config.ts`, Wave 60.56 P1):
 *   font-mono / text-eyebrow / text-gold / bg-gold
 *
 * TODO Phase 5 (next-intl wiring, Wave 60.69+): extract "báo cáo" + period
 * placeholders into i18n keys (vault 104 compliance). Phase 1 acceptable to
 * hardcode VN per spec since next-intl wiring is separate work.
 */
import type { ReactNode } from 'react';

export type LiveCounterEyebrowProps = {
  /** Number of reports — Phase 1 ships static 1243. Phase 4 wires real PostHog API. */
  count: number;
  /** Period label, e.g. "trong tuần" | "hôm nay" | "tháng này". Rendered uppercase. */
  period: string;
  /** Average rating 1-5 stars (1 decimal). Omit to hide rating segment. */
  rating?: number;
};

export function LiveCounterEyebrow({
  count,
  period,
  rating,
}: LiveCounterEyebrowProps): ReactNode {
  // VN locale formats 1243 → "1.243" (period as thousands separator). Matches
  // the Vietnamese number convention; en-US would render "1,243".
  const formatted = new Intl.NumberFormat('vi-VN').format(count);

  return (
    <>
      {formatted} BÁO CÁO {period.toUpperCase()}
      {rating !== undefined && ` · ${rating.toFixed(1)}★`}
    </>
  );
}
