import type { ReactNode } from 'react';

/**
 * Wave 60.79.T2 — MarketingCard primitive (vault 112 P1 #5 + P0-05 follow-up).
 *
 * Standardizes card padding across marketing surfaces so the home/features
 * audit's `[56px|56px] vs [40px|40px]` and `[32px|32px] vs [24px|24px]`
 * mismatches collapse into a single 2-token system:
 *
 *   - `padding="standard"`  → `p-6` (24px)        — for grids of small cards
 *   - `padding="featured"`  → `p-8 md:p-12`        — for hero / spotlight tiles
 *
 * Always emits `h-full flex flex-col` so siblings in a CSS-grid row stay
 * equal-height regardless of body length. Consumers put `flex-1` on the
 * paragraph they want to absorb spare vertical space.
 *
 * Background tokens limited to the warm-dark palette used by BentoLens /
 * PricingTierV2 / WhyTrust. Border + rounded-card-editorial mirror the
 * existing editorial idiom (Wave 60.56 P1).
 */

export type MarketingCardProps = {
  children: ReactNode;
  padding?: 'standard' | 'featured';
  bg?: 'warm-dark-100' | 'warm-dark-200';
  className?: string;
};

const PADDING_CLASS: Record<NonNullable<MarketingCardProps['padding']>, string> = {
  standard: 'p-6',
  featured: 'p-8 md:p-12',
};

const BG_CLASS: Record<NonNullable<MarketingCardProps['bg']>, string> = {
  // Tailwind JIT needs literal class names — never interpolate.
  'warm-dark-100': 'bg-warm-dark-100',
  'warm-dark-200': 'bg-warm-dark-200',
};

export function MarketingCard({
  children,
  padding = 'standard',
  bg = 'warm-dark-200',
  className,
}: MarketingCardProps) {
  return (
    <article
      className={[
        'relative flex h-full flex-col overflow-hidden rounded-card-editorial border border-warm-dark-300',
        BG_CLASS[bg],
        PADDING_CLASS[padding],
        'transition-colors duration-300 ease-editorial hover:border-gold/40',
        className ?? '',
      ]
        .join(' ')
        .trim()}
    >
      {children}
    </article>
  );
}
