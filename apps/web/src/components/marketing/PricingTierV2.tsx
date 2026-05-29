'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { track } from '@/lib/analytics';

/**
 * Wave 60.56 P2.2 — PricingTierV2 (Option D "Warm-Dark Editorial").
 *
 * Wave 62.05 — "Như giấy cũ" editorial pass (vault 138). Tier card now reads
 * as a sheet of layered paper rather than a SaaS pricing-grid:
 *   - Tier name in `font-editorial-display` Newsreader serif (was sans bold).
 *   - Price rendered as a phrase ("₫199.000 / tháng") via inline composition.
 *   - "Cho ai" lead line above the bullets, lifted to a more direct framing.
 *   - "·" mid-dot bullet replaces the SaaS-coded `Check` icon (lucide import
 *     dropped).
 *   - Card corner radius drops from `rounded-card-editorial` (12-ish) →
 *     `rounded-[2px]` so the edge reads as paper, not pill.
 *   - CTA pill keeps `rounded-pill` — the editorial corner is a *card*-level
 *     decision, the button still needs to feel tappable.
 *
 * Backwards compat: `PricingTierV2Tier` API unchanged so the homepage + admin
 * + any future consumer don't have to touch their tier definitions.
 *
 * Tokens from `apps/web/tailwind.config.ts`:
 *   bg-background/100/200/300 / text-foreground/100/300/500
 *   text-primary/ text-primary/80 / text-jade-300 / bg-jade
 *   font-editorial-display / text-section-display / text-price-amount
 *   text-eyebrow / rounded-pill / rounded-[2px] (editorial paper-corner)
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
  /** H2 ReactNode. Pass `<em class="italic text-primary/80">` for highlighted spans. */
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

  // Wave 62.05 — hide the monthly/yearly toggle entirely when no tier in the
  // current grid exposes a yearly price. Pricing the 3 primary anchors on a
  // single cadence is the founder's "Như giấy cũ" intent (vault 138); the
  // toggle stays available for any future grid that still needs it.
  const hasYearly = tiers.some((t) => t.priceYearly !== undefined);

  // Wave 60.95.j P2-#19 — staggered fade-in reveal for the tier cards. Single
  // IntersectionObserver at the grid level (cheaper than one per card); each
  // card fades + lifts with `index * 100ms` delay so the eye reads the
  // recommended middle tier last. Pure CSS transition + native IO = 0 KB
  // runtime delta. Distinguishes pricing-card section grammar from
  // opacity-only stat blocks (BigNumberRow) / slide-left testimonial (PullQuote) /
  // scale-up showcase (SampleOutputShowcase).
  const gridRef = useRef<HTMLDivElement | null>(null);
  // V2 fix (design handoff #1 priority): tier cards MUST be visible even when
  // JS / the IntersectionObserver never runs. Default to REVEALED so SSR,
  // no-JS, reduced-motion and short-viewport visitors always see all 3 cards
  // (the prior `useState(false)` + opacity-0 left the pricing band blank until
  // the IO crossed its 0.2 threshold — on screenshots it looked empty). The
  // observer now only *delays* the entrance stagger when the grid starts below
  // the fold; a timeout fallback guarantees reveal regardless of IO behaviour.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const node = gridRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    // Already on-screen at mount → stay revealed (no hide, so no flash).
    if (node.getBoundingClientRect().top <= window.innerHeight) return;
    // Below the fold → hide now, fade in on scroll (or after the fallback).
    setInView(false);
    const reveal = () => setInView(true);
    const fallback = setTimeout(reveal, 1500);
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          reveal();
          obs.disconnect();
          clearTimeout(fallback);
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(node);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

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
            <p className="font-mono text-eyebrow uppercase text-primary">
              <span className="mr-2 inline-block h-px w-6 bg-primary align-middle" />
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-6 text-balance font-sans text-section-display font-bold tracking-tight text-foreground">
              {title}
            </h2>
          )}

          {/* Toggle — only rendered when at least one tier exposes
              `priceYearly`. Wave 62.05 hides this on /pricing + homepage
              because yearly + lifetime moved to the "Tuỳ chọn nâng cao"
              expandable; consumers that still pass a yearly price keep the
              toggle. */}
          {hasYearly && (
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
          )}
        </div>

        {/* Tier grid — staggered fade reveal (vault 130 §III P2-#19).
            `mt-12` is consistent whether or not the toggle renders above;
            without the toggle the section header still needs breathing room. */}
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

            // Wave 62.05 — editorial paper-corner (rounded-[2px]) replaces
            // rounded-card-editorial. Founder spec "Như giấy cũ" calls out the
            // pill-card silhouette as SaaS-coded; cropping the corner radius
            // re-reads as a sheet of layered paper.
            const baseCard =
              'relative flex flex-col rounded-[2px] border bg-muted/40 p-8 md:p-12 transition-all duration-300 ease-editorial';
            // Wave 62.05h — recommended card was `bg-gradient-to-b from-primary/5
            // to-warm-dark-100` (#1B1714). Two problems: (1) spec "Như giấy cũ"
            // bans gradients ("Tránh gradient, glow, particle" ×2) + a dark card
            // on a Paper page is the "dark casino" energy the spec rejects; pricing
            // is a *reasoning* surface = Day mode. (2) the card's feature bullets
            // use text-foreground (Ink #171411, dark) which on the gradient's dark
            // lower half rendered dark-on-dark (~unreadable). Flat `bg-card`
            // (Paper-50 lifted) + ochre border + the existing "KHUYÊN DÙNG" badge
            // marks the recommended tier without gradient OR contrast risk — all
            // text stays Ink-on-Paper (AA-safe).
            const cardBorder = tier.recommended
              ? 'border-primary bg-card'
              : 'border-border hover:border-border/80';

            // Wave 62.05g — finish founder spec "3 components done carefully":
            // CTA label switches sans → serif Newsreader (font-editorial-display)
            // to share the heading voice, and pill → rounded-[2px] paper-corner
            // (spec: "dùng serif Newsreader thay vì sans cho button label. Bo góc
            // 2px thay vì pill"). text-sm → text-base since serif reads ~1 step
            // smaller at the same px.
            const ctaBase =
              'mt-8 inline-flex w-full items-center justify-center rounded-[2px] px-7 py-4 font-editorial-display text-base font-medium transition-all duration-300 ease-editorial';
            // Wave 62.05g (ultrareview follow-up) — text-ink (#0F0F12) on
            // bg-primary (Ochre #A47532) was ~3.6:1 on Day mode, below AA 4.5.
            // text-primary-foreground is theme-aware (Paper-50 on ochre ≈ 4.6:1
            // day · charcoal on gold-soft night) → AA-safe both modes.
            const ctaVariant = tier.primary
              ? 'bg-primary text-primary-foreground hover:bg-primary/80'
              : 'border border-border text-foreground hover:bg-card';

            return (
              <article
                key={tier.id}
                id={tier.id}
                data-in-view={inView ? 'true' : 'false'}
                style={{ transitionDelay: `${tierIdx * 100}ms` }}
                className={`scroll-mt-24 ${baseCard} ${cardBorder} translate-y-3 opacity-0 [transition-duration:600ms] data-[in-view=true]:translate-y-0 data-[in-view=true]:opacity-100`}
              >
                {tier.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-primary px-4 py-1 font-mono text-xs uppercase tracking-wider text-primary-foreground">
                    KHUYÊN DÙNG
                  </span>
                )}

                <p
                  className={`font-mono text-eyebrow uppercase tracking-wider ${
                    tier.recommended ? 'text-primary' : 'text-muted-foreground/70'
                  }`}
                >
                  {tier.name}
                </p>
                {/* Wave 62.05 — tier name in Newsreader serif (was sans bold).
                    `font-editorial-display` + lowered weight reads as a chapter
                    heading on aged paper rather than a SaaS card title. */}
                <h3 className="mt-4 font-editorial-display text-editorial-h4 font-normal tracking-tight text-foreground">
                  {tier.nameDisplay}
                </h3>
                <p className="mt-2 font-sans text-sm text-muted-foreground">
                  {tier.description}
                </p>

                {/* Wave 62.05 — "Cho ai" line lifted to a direct framing per
                    founder spec ("Cho người đang phân vân một quyết định").
                    Drops the "Nên chọn nếu" eyebrow + bordered call-out box in
                    favor of a single italic editorial line. */}
                {tier.bestFor && (
                  <p className="mt-4 font-sans text-sm italic leading-relaxed text-foreground/70">
                    Cho {tier.bestFor}
                  </p>
                )}

                {/* Wave 62.05 — price as a typographic phrase, not a SaaS
                    big-number + unit caption. Both halves now sit on the same
                    baseline in the same serif so "₫199.000 / tháng" reads
                    naturally instead of "199K · /mo". */}
                <p className="mt-8 font-editorial-display text-price-amount text-foreground">
                  {formatVND(amount)}{' '}
                  <span className="text-muted-foreground/80">{unit}</span>
                </p>

                {/* Wave 62.05 — "·" mid-dot bullet replaces the lucide Check
                    icon. The check is the universal SaaS pricing-card glyph;
                    a mid-dot reads as editorial list-marker (NYT recipe / book
                    chapter), in line with the "Như giấy cũ" voice. */}
                <ul className="mt-8 flex-grow space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-baseline gap-3">
                      <span
                        className="font-editorial-display text-base leading-none text-primary/70"
                        aria-hidden
                      >
                        ·
                      </span>
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
