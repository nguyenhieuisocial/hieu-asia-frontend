'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { useState, type ReactNode } from 'react';

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
 *   bg-warm-dark-50/100/200/300 / text-cream-50/100/300/500
 *   text-gold / text-gold-soft / text-jade / bg-jade
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
  ctaLabel: string;
  ctaHref: string;
  /** Filled gold CTA when true, ghost when false/undefined. */
  primary?: boolean;
  /** Adds gold border + "KHUYÊN DÙNG" badge + subtle gold gradient. */
  recommended?: boolean;
  /** If set, render the "{n} NGÀY HOÀN TIỀN" jade caption beneath the CTA. */
  refundDays?: number;
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
}: PricingTierV2Props) {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>(defaultPeriod);

  return (
    <section className="bg-warm-dark-50 py-16 md:py-20">
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
            <h2 className="mt-6 text-balance font-sans text-section-display font-bold tracking-tight text-cream-50">
              {title}
            </h2>
          )}

          {/* Toggle */}
          <div className="mt-12 flex flex-col items-center">
            <div
              role="tablist"
              aria-label="Chu kỳ thanh toán"
              className="inline-flex rounded-pill bg-warm-dark-200 p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={period === 'monthly'}
                data-active={period === 'monthly'}
                onClick={() => setPeriod('monthly')}
                className="rounded-pill px-6 py-2 font-sans text-sm font-medium transition-all duration-300 ease-editorial data-[active=true]:bg-cream-50 data-[active=true]:text-warm-dark-50 data-[active=false]:text-cream-300"
              >
                Theo tháng
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={period === 'yearly'}
                data-active={period === 'yearly'}
                onClick={() => setPeriod('yearly')}
                className="rounded-pill px-6 py-2 font-sans text-sm font-medium transition-all duration-300 ease-editorial data-[active=true]:bg-cream-50 data-[active=true]:text-warm-dark-50 data-[active=false]:text-cream-300"
              >
                Theo năm
              </button>
            </div>
            {period === 'yearly' && (
              <p className="mt-2 font-mono text-xs uppercase tracking-wider text-jade">
                NĂM — TIẾT KIỆM 20%
              </p>
            )}
          </div>
        </div>

        {/* Tier grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => {
            const isYearly = period === 'yearly' && tier.priceYearly !== undefined;
            const amount = isYearly ? tier.priceYearly! : tier.priceMonthly;
            const unit = tier.priceMonthly === 0
              ? '/ vĩnh viễn'
              : isYearly
                ? '/ năm'
                : '/ tháng';

            const baseCard =
              'relative flex flex-col rounded-card-editorial border bg-warm-dark-100 p-8 md:p-12 transition-all duration-300 ease-editorial';
            const cardBorder = tier.recommended
              ? 'border-gold bg-gradient-to-b from-gold/5 to-warm-dark-100'
              : 'border-warm-dark-300 hover:border-warm-dark-500';

            const ctaBase =
              'mt-8 inline-flex w-full items-center justify-center rounded-pill px-7 py-4 font-sans text-sm font-medium transition-all duration-300 ease-editorial';
            const ctaVariant = tier.primary
              ? 'bg-gold text-warm-dark-50 hover:bg-gold-soft'
              : 'border border-warm-dark-300 text-cream-50 hover:bg-warm-dark-200';

            return (
              <article key={tier.id} className={`${baseCard} ${cardBorder}`}>
                {tier.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-gold px-4 py-1 font-mono text-xs uppercase tracking-wider text-warm-dark-50">
                    KHUYÊN DÙNG
                  </span>
                )}

                <p
                  className={`font-mono text-eyebrow uppercase tracking-wider ${
                    tier.recommended ? 'text-gold' : 'text-cream-500'
                  }`}
                >
                  {tier.name}
                </p>
                <h3 className="mt-4 font-sans text-3xl font-bold tracking-tight text-cream-50">
                  {tier.nameDisplay}
                </h3>
                <p className="mt-2 font-sans text-sm text-cream-300">
                  {tier.description}
                </p>

                <div className="mt-8 flex items-baseline gap-2">
                  <span className="font-marketing-display text-price-amount text-cream-50">
                    {formatVND(amount)}
                  </span>
                  <span className="font-mono text-xs text-cream-500">{unit}</span>
                </div>

                <ul className="mt-8 flex-grow space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={14}
                        className="mt-1 shrink-0 text-jade"
                        aria-hidden
                      />
                      <span className="font-sans text-sm text-cream-100">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href={tier.ctaHref} className={`${ctaBase} ${ctaVariant}`}>
                  {tier.ctaLabel}
                </Link>

                {tier.refundDays !== undefined && (
                  <p className="mt-3 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-jade">
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
