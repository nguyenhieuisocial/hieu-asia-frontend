'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { track } from '@/lib/analytics';

/**
 * Wave 60.56 P2.2 — PricingTierV2 (Option D "Warm-Dark Editorial").
 *
 * Replaces the current 5-tier Stripe-template row (Wave 60.55 R1 finding:
 * decision paralysis). Three tiers + Monthly/Yearly pill toggle with a
 * "TIẾT KIỆM 20%" jade caption + "KHUYÊN DÙNG" gold badge on the recommended
 * tier + Notion-style refund slot beneath the CTA.
 *
 * Visual matches `/tmp/wave-60-56-option-d/pricing.png`. Tokens from
 * `apps/web/tailwind.config.ts` (Wave 60.56 P1 commit 0b38173):
 *   bg-background/100/200/300 / text-foreground/100/300/500
 *   text-gold / text-gold-soft / text-jade-300 / bg-jade
 *   font-marketing-display / text-section-display / text-price-amount
 *   text-eyebrow / rounded-pill / rounded-card-editorial
 *   max-w-marketing / ease-editorial
 */
export type PricingTierV2Tier = {
  /** Stable id, e.g. 'free' | 'premium' | 'mentor'. */
  id: string;
  /** Mono uppercase eyebrow above the italic name, e.g. "MIỄN PHÍ". */
  name: string;
  /** Italic serif H3 display name, e.g. "Khởi đầu". */
  nameDisplay: string;
  /** One-sentence subtitle. */
  description: string;
  /** Monthly price in VND (0 allowed). */
  priceMonthly: number;
  /** Optional yearly price in VND. If omitted, yearly view shows the monthly value. */
  priceYearly?: number;
  /** Optional caption like "Tiết kiệm 20%" (rendered above the toggle when yearly). */
  yearlyDiscount?: string;
  /** Bullet list of features. */
  features: string[];
  /**
   * Wave 60.89.HF1 — explicit unit suffix override. Defaults follow the legacy
   * heuristic (`priceMonthly === 0` → "vĩnh viễn", yearly toggle → "năm",
   * otherwise → "tháng"). Pass `'một lần'` for one-time purchases (Premium
   * ₫99.000) so the suffix doesn't mislead customers into thinking it's a
   * monthly subscription.
   */
  priceUnit?: 'tháng' | 'năm' | 'một lần' | 'vĩnh viễn';
  ctaLabel: string;
  ctaHref: string;
  /** Filled gold CTA when true, ghost when false/undefined. */
  primary?: boolean;
  /** Adds gold border + "KHUYÊN DÙNG" badge + subtle gold gradient. */
  recommended?: boolean;
  /** If set, render the "{n} NGÀY HOÀN TIỀN" jade caption beneath the CTA. */
  refundDays?: number;
  /**
   * Wave 60.95.a — "Bạn nên chọn gói này nếu..." guidance line (vault 130
   * §3 P1-9). Rendered as a muted italic block between description and price
   * so buyers can self-select against the persona that matches them.
   */
  bestFor?: string;
};

export type PricingTierV2Props = {
  /** Typically 3 tiers. Rendered in order on a 3-col grid (stacks on mobile). */
  tiers: PricingTierV2Tier[];
  /** Initial toggle position. Default `'monthly'`. */
  defaultPeriod?: 'monthly' | 'yearly';
  /** Mono uppercase gold eyebrow, prefixed by a "—" rule. */
  eyebrow?: string;
  /** H2 ReactNode. Pass `<em class="italic text-gold-soft">` for highlighted spans. */
  title?: ReactNode;
  /**
   * Wave 60.77 — page slug forwarded into `pricing_cta_clicked`. Defaults to
   * `window.location.pathname` at click time when omitted. Pass `/` for the
   * landing page and `/pricing` for the dedicated pricing page so the
   * PostHog experiment (373563) can segment without parsing the URL.
   */
  page?: string;
};

function formatVND(n: number): string {
  if (n === 0) return '₫0';
  return '₫' + n.toLocaleString('vi-VN');
}

export function PricingTierV2({
  tiers,
  defaultPeriod = 'monthly',
  eyebrow,
  title,
  page,
}: PricingTierV2Props) {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>(defaultPeriod);

  // Wave 60.95.j P2-#19 — staggered fade-in reveal for the tier cards. Single
  // IntersectionObserver at the grid level (cheaper than one per card); each
  // card fades + lifts with `index * 100ms` delay so the eye reads the
  // recommended middle tier last. Pure CSS transition + native IO = 0 KB
  // runtime delta. Distinguishes pricing-card section grammar from
  // opacity-only stat blocks (BigNumberRow) / slide-left testimonial (PullQuote) /
  // scale-up showcase (SampleOutputShowcase).
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = gridRef.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [inView]);

  // Wave 60.77 — fires when a user clicks a tier CTA `<Link>`. Secondary
  // metric for PostHog experiment 373563 (pricing display). Resolved lazily
  // inside the click handler so the call site doesn't need to know the
  // current pathname.
  const handleCtaClick = (tierId: string) => {
    track('pricing_cta_clicked', {
      tier: tierId,
      page:
        page ??
        (typeof window !== 'undefined' ? window.location.pathname : 'unknown'),
      position: 'card',
    });
  };

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-marketing px-6">
        {/* Header */}
        <div className="text-center">
          {eyebrow && (
            <p className="font-mono text-eyebrow uppercase text-gold">
              <span className="mr-2 inline-block h-px w-6 bg-gold align-middle" />
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-6 text-balance font-sans text-section-display font-bold tracking-tight text-foreground">
              {title}
            </h2>
          )}

          {/* Toggle */}
          <div className="mt-12 flex flex-col items-center">
            <div
              role="tablist"
              aria-label="Chu kỳ thanh toán"
              className="inline-flex rounded-pill bg-card p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={period === 'monthly'}
                data-active={period === 'monthly'}
                onClick={() => setPeriod('monthly')}
                // Wave 60.97.1 — `min-h-11 touch-manipulation` so toggle
                // reaches 44px tap target on mobile.
                className="rounded-pill px-6 py-2 font-sans text-sm font-medium transition-all duration-300 ease-editorial data-[active=true]:bg-cream-50 data-[active=true]:text-ink data-[active=false]:text-muted-foreground min-h-11 touch-manipulation"
              >
                Theo tháng
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={period === 'yearly'}
                data-active={period === 'yearly'}
                onClick={() => setPeriod('yearly')}
                // Wave 60.97.1 — `min-h-11 touch-manipulation` so toggle
                // reaches 44px tap target on mobile.
                className="rounded-pill px-6 py-2 font-sans text-sm font-medium transition-all duration-300 ease-editorial data-[active=true]:bg-cream-50 data-[active=true]:text-ink data-[active=false]:text-muted-foreground min-h-11 touch-manipulation"
              >
                Theo năm
              </button>
            </div>
            {period === 'yearly' && (
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-jade-300">
                NĂM — TIẾT KIỆM 20%
              </p>
            )}
          </div>
        </div>

        {/* Tier grid — staggered fade reveal (vault 130 §III P2-#19). */}
        <div ref={gridRef} className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, tierIdx) => {
            const isYearly = period === 'yearly' && tier.priceYearly !== undefined;
            const amount = isYearly ? tier.priceYearly! : tier.priceMonthly;
            // Wave 60.89.HF1 — explicit `priceUnit` wins over the legacy heuristic.
            // When yearly toggle flips a subscription tier, keep showing "/ năm"
            // even if `priceUnit: 'tháng'` was passed (the toggle is the source
            // of truth for monthly/yearly tiers).
            const resolvedUnit = isYearly
              ? 'năm'
              : tier.priceUnit ?? (tier.priceMonthly === 0 ? 'vĩnh viễn' : 'tháng');
            const unit = `/ ${resolvedUnit}`;

            const baseCard =
              'relative flex flex-col rounded-card-editorial border bg-muted/40 p-8 md:p-12 transition-all duration-300 ease-editorial';
            const cardBorder = tier.recommended
              ? 'border-gold bg-gradient-to-b from-gold/5 to-warm-dark-100'
              : 'border-border hover:border-border/80';

            const ctaBase =
              'mt-8 inline-flex w-full items-center justify-center rounded-pill px-7 py-4 font-sans text-sm font-medium transition-all duration-300 ease-editorial';
            const ctaVariant = tier.primary
              ? 'bg-gold text-ink hover:bg-gold-soft'
              : 'border border-border text-foreground hover:bg-card';

            return (
              <article
                key={tier.id}
                data-in-view={inView ? 'true' : 'false'}
                style={{ transitionDelay: `${tierIdx * 100}ms` }}
                className={`${baseCard} ${cardBorder} translate-y-3 opacity-0 [transition-duration:600ms] data-[in-view=true]:translate-y-0 data-[in-view=true]:opacity-100`}
              >
                {tier.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-gold px-4 py-1 font-mono text-xs uppercase tracking-wider text-ink">
                    KHUYÊN DÙNG
                  </span>
                )}

                <p
                  className={`font-mono text-eyebrow uppercase tracking-wider ${
                    tier.recommended ? 'text-gold' : 'text-muted-foreground/70'
                  }`}
                >
                  {tier.name}
                </p>
                <h3 className="mt-4 font-sans text-3xl font-bold tracking-tight text-foreground">
                  {tier.nameDisplay}
                </h3>
                <p className="mt-2 font-sans text-sm text-muted-foreground">
                  {tier.description}
                </p>

                {tier.bestFor && (
                  <p className="mt-4 border-l-2 border-gold/40 pl-3 font-sans text-xs italic leading-relaxed text-muted-foreground/70">
                    <span className="font-mono uppercase tracking-wider text-gold-soft not-italic">
                      Nên chọn nếu
                    </span>{' '}
                    {tier.bestFor}
                  </p>
                )}

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="font-marketing-display text-price-amount text-foreground">
                    {formatVND(amount)}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground/70">{unit}</span>
                </div>

                <ul className="mt-8 flex-grow space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={14}
                        className="mt-1 shrink-0 text-jade-300"
                        aria-hidden
                      />
                      <span className="font-sans text-sm text-foreground/95">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.ctaHref}
                  className={`${ctaBase} ${ctaVariant}`}
                  onClick={() => handleCtaClick(tier.id)}
                >
                  {tier.ctaLabel}
                </Link>

                {tier.refundDays !== undefined && (
                  <p className="mt-3 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-jade-300">
                    <span className="size-1.5 rounded-full bg-jade" aria-hidden />
                    {tier.refundDays} NGÀY HOÀN TIỀN
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
