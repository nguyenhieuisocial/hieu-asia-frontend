import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Wave 60.66.P3 — ScanRow (Option E "Editorial Live" vault 108 §5 + vault 109 §3 Phase 3).
 *
 * Scan-fast horizontal scroll cards (Basecamp pattern) — mobile top-of-fold
 * "4 ống kính" mini-cards. Mobile: `overflow-x-auto snap-x snap-mandatory`
 * 1.2 cards visible. Desktop: grid 3 or 4 columns. Each card surfaces icon
 * + label + 1-2 line body + arrow CTA.
 *
 * Server component — no `'use client'`, no Motion runtime. Reveal animation
 * is CSS-only via the `editorial-fade-in` keyframes in `globals.css`
 * (respects `prefers-reduced-motion` globally per Wave 60.66.P2 commitment).
 * This keeps `/` First Load JS within budget (vault 109 §6).
 *
 * Icon pattern (Wave 60.65.P0a): pre-rendered as JSX at the call site, NOT a
 * Lucide component reference. See BentoLens.tsx header for full rationale
 * (Sentry HIEU-ASIA-WORKER-A — forwardRef object crosses RSC boundary).
 *
 * Tokens (Wave 60.56 P1, no new colors): warm-dark-{100,200,300} / cream-{50,300,500}
 * / gold / gold-soft / rounded-card-editorial / ease-editorial.
 */

export type ScanRowItem = {
  /** Stable key. */
  id: string;
  /**
   * Pre-rendered icon JSX, e.g. `<Sparkles className="size-5 text-primary" strokeWidth={1.5} />`.
   * Pass the element, not the component reference (Wave 60.65.P0a fix).
   */
  icon: ReactNode;
  /** Card label, e.g. "Tử Vi cung mệnh". */
  label: string;
  /** 1-2 line body copy. */
  body: string;
  /** CTA destination. */
  href: string;
  /**
   * Wave 60.95.d P1-11 — Optional small mono tag rendered ABOVE the label as a
   * subtle eyebrow. Used by the intent-based home cards to surface the
   * underlying discipline (e.g. "TỬ VI CUNG QUAN") while the label itself
   * stays user-intent phrased ("Tôi đang chọn nghề"). Vault 130 §1 +
   * ChatGPT review §2.2.
   */
  tag?: string;
};

export type ScanRowProps = {
  /** Optional eyebrow label rendered before scan items. */
  eyebrow?: string;
  /** Section title (ReactNode for em/u spans). */
  title?: ReactNode;
  /** 3-6 scan items. */
  items: ScanRowItem[];
  /** Background variant — defaults to warm-dark-100 for tonal layering. */
  bg?: 'warm-dark-50' | 'warm-dark-100';
};

export function ScanRow({
  eyebrow,
  title,
  items,
  bg = 'warm-dark-100',
}: ScanRowProps) {
  // Tailwind JIT requires literal mapping (Wave 60.56 P1 pattern).
  const bgClass = bg === 'warm-dark-50' ? 'bg-background' : 'bg-muted/40';

  // Desktop column count: 3 for ≤3 items, 4 for 4 items, 5 for ≥5 (Wave
  // 60.95.d P1-11 — intent cards need 5-col grid on xl so the 5th card
  // doesn't orphan onto row 2). Mobile always horizontal scroll regardless.
  const desktopColsClass =
    items.length >= 5
      ? 'md:grid-cols-3 lg:grid-cols-5'
      : items.length === 4
        ? 'md:grid-cols-3 lg:grid-cols-4'
        : 'md:grid-cols-3';

  return (
    <section className={`${bgClass} py-12 md:py-24`}>
      <div className="mx-auto max-w-marketing px-6 lg:px-12">
        {eyebrow && (
          <p className="mb-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-primary">
            — {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-balance font-sans text-section-display font-bold tracking-tight text-foreground">
            {title}
          </h2>
        )}

        {/* Mobile: horizontal scroll snap; Desktop: grid. Hidden scrollbar via
            Tailwind v4 arbitrary `[&::-webkit-scrollbar]:hidden` + Firefox
            `[scrollbar-width:none]`. */}
        <div
          className={`mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [-ms-overflow-style:none] [scroll-padding-inline:1.5rem] [scrollbar-width:none] [-webkit-mask-image:linear-gradient(to_right,black_90%,transparent)] [mask-image:linear-gradient(to_right,black_90%,transparent)] md:mt-8 md:grid md:gap-6 md:overflow-visible md:pb-0 md:[-webkit-mask-image:none] md:[mask-image:none] ${desktopColsClass} [&::-webkit-scrollbar]:hidden`}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              // Wave 60.95.t — Mobile fix: pair min-w with max-w to LOCK the
              // card width on mobile (78vw / 60vw). Without max-w, the card
              // flex item expanded to fit the body copy on one line — 728px
              // on a 375 viewport — making it impossible to see card 2 peek,
              // and clipping the first card's right edge. line-clamp-2 doesn't
              // help here because it clips display, not width. Desktop keeps
              // `md:min-w-0 md:max-w-none` (grid sizing takes over).
              className="group relative flex h-full min-h-[150px] w-[72vw] max-w-[72vw] shrink-0 snap-start flex-col rounded-card-editorial border border-primary/15 bg-card p-5 transition-all duration-300 ease-editorial hover:-translate-y-1 hover:border-primary/40 hover:bg-muted hover:shadow-xl hover:shadow-primary/10 active:scale-[0.98] active:border-primary/40 sm:min-h-[180px] sm:w-[48vw] sm:max-w-[48vw] sm:p-6 md:w-auto md:max-w-none"
            >
              <div className="mb-4">{item.icon}</div>
              {item.tag && (
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                  {item.tag}
                </p>
              )}
              <p className="font-sans text-base font-semibold leading-tight text-foreground">
                {item.label}
              </p>
              <p className="mt-2 line-clamp-2 font-sans text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
              <p className="mt-auto pt-4 font-sans text-sm font-medium text-primary/80 transition-colors group-hover:text-primary">
                Xem ngay{' '}
                <span className="inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
