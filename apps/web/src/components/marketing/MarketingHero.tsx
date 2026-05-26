'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Wave 60.56 P2.1 — MarketingHero (Option D "Warm-Dark Editorial").
 * Wave 60.66.P1 — Option E "Editorial Live" typography pivot (vault 108).
 *
 * Consolidates the 4× pasted purple-radial hero blocks (Wave 60.55 R1 finding)
 * into one typed component. Phase 1 swaps h1 font from Instrument Serif 400 to
 * Be Vietnam Pro 700 tracking-tight (scan-fast, per founder feedback Wave
 * 60.63 "đọc được nhanh"). Existing `<em>` italic spans in title prop keep
 * working for backward compat (Phase 5 will sweep). Eyebrow widens from
 * `string` → `ReactNode` so `<LiveCounterEyebrow>` can render. Anthropic-style
 * generous top padding (~29vh), gold-dot signature period preserved, optional
 * double-ring ornament and italic watermark preserved.
 *
 * Tokens (from `apps/web/tailwind.config.ts`, Wave 60.56 P1 commit 0b38173):
 *   bg-warm-dark-50 / text-cream-50 / text-cream-300 / text-cream-500
 *   text-gold / text-gold-soft / text-gold-dot / shadow-gold-dot-glow
 *   font-sans (Be Vietnam Pro) / text-hero-display / text-eyebrow
 *   rounded-pill / max-w-marketing / max-w-marketing-text / ease-editorial
 */
export type MarketingHeroProps = {
  /** Mono uppercase gold eyebrow. Accepts ReactNode (Wave 60.66.P1) so live counter component can render; plain string still works for backward compat. */
  eyebrow?: ReactNode;
  /** H1 ReactNode — pass `<u>` for underline accent (Option E), `<span class="text-gold-dot">.</span>` for the signature period. */
  title: ReactNode;
  /** Body subtitle, capped at `max-w-marketing-text` (540px). */
  subtitle?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Mono uppercase cream-500 trust line, e.g. "5 phút · miễn phí · không cần thẻ". */
  trustLine?: string;
  /** Right-side decorative double-ring with center gold dot. */
  ornament?: 'gold-ring' | 'none';
  /** Italic serif watermark (e.g. "Tử Vi"), rendered behind content at low opacity. */
  watermark?: string;
};

export function MarketingHero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  trustLine,
  ornament = 'none',
  watermark,
}: MarketingHeroProps) {
  return (
    <section className="relative overflow-hidden bg-warm-dark-50 py-32 md:pt-[29vh] md:pb-32">
      {watermark && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-5 bottom-0 z-0 select-none font-marketing-display italic text-warm-dark-200/40"
          style={{ fontSize: 'clamp(240px, 30vw, 400px)', lineHeight: 0.9 }}
        >
          {watermark}
        </span>
      )}

      {ornament === 'gold-ring' && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-[8%] top-[32%] z-0 hidden lg:block"
        >
          <div className="relative size-[220px] rounded-full border border-gold/30">
            <div className="absolute inset-3 rounded-full border border-gold/15" />
            <div className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-dot shadow-gold-dot-glow" />
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-marketing px-6 lg:px-12">
        {eyebrow && (
          <p className="mb-8 font-mono text-eyebrow uppercase text-gold">
            <span className="mr-2 inline-block h-px w-6 bg-gold align-middle" />
            {eyebrow}
          </p>
        )}

        <h1 className="text-balance font-sans text-hero-display font-bold tracking-tight text-cream-50">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-8 max-w-marketing-text text-pretty text-lg leading-relaxed text-cream-300">
            {subtitle}
          </p>
        )}

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center rounded-pill bg-gold px-7 py-4 font-sans text-sm font-medium text-warm-dark-50 transition-all duration-300 ease-editorial hover:bg-gold-soft"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-pill border border-warm-dark-300 px-7 py-4 font-sans text-sm font-medium text-cream-50 transition-all duration-300 ease-editorial hover:border-warm-dark-500 hover:bg-warm-dark-200"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
          {trustLine && (
            <span className="font-mono text-xs uppercase tracking-wider text-cream-500 sm:ml-2">
              {trustLine}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
