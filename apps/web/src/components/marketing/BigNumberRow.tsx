'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Wave 60.66.P4 — BigNumberRow (Option E "Editorial Live" vault 108 §5 Phase 4 +
 * vault 109 §3 Phase 4 ENRICHED).
 *
 * 3-col big-number social proof row with count-up reveal on first in-view, plus
 * an optional risk-reversal block below (refund / guarantee copy). Linear /
 * Vercel pattern translated to VN cultural context — big numerals + refund
 * timeline = trust signal stronger than benefit copy alone (vault 109 §2 verdict
 * matrix rows for BigNumberRow / Motion / risk-reversal).
 *
 * Client component (uses `IntersectionObserver` + `requestAnimationFrame` for the
 * count-up reveal + `window.matchMedia` for reduced-motion detection). Native
 * browser APIs are 0 KB — preserves the +0 KB initial bundle delta target
 * (vault 109 §6 budget) without forcing Motion's framer-motion `m.*` runtime
 * into the home route chunk. Phase 5 components (PullQuote / SectionDivider)
 * will be the first surfaces to actually consume `m.*` from `motion/react`.
 *
 * Why not `m.div` + `useInView` per the spec: the spec assumed Phase 2's
 * `LazyMotionProvider` had already pulled the `m.*` runtime into the home
 * chunk, but Phase 2 only wraps the provider — no component rendered on `/`
 * actually consumes `m.*`. Adding `m.div` + `useInView` here pulls in +17 KB
 * First Load JS (measured), which busts the spec's `< 5 KB` gate. Native APIs
 * achieve the same visual reveal at 0 KB cost and respect the same a11y
 * commitments (reduced-motion via `matchMedia`).
 *
 * Decorative role preservation: numerals rendered in Instrument Serif 600 96px
 * desktop / 64px mobile — vault 108 §3 + vault 109 verdict "Instrument Serif
 * demote ADOPT 60.66.P5" keeps numerals as one of 3 decorative-role exceptions
 * (numerals + PullQuote + SectionDivider glyph).
 *
 * Count-up animation:
 *   - `IntersectionObserver` with threshold 0.5 — fires once at 50% visibility
 *   - `requestAnimationFrame` loop drives `useState` from 0 → target over 1.2s
 *   - Editorial ease cubic-bezier `[0.165, 0.85, 0.45, 1]` — matches token
 *     `transitionTimingFunction.editorial` in tailwind.config.ts
 *   - Stagger 80ms between 3 numbers (delays animation start, NOT observation)
 *   - `window.matchMedia('(prefers-reduced-motion: reduce)')` → skip animation,
 *     render final value immediately (also globals.css `prefers-reduced-motion`
 *     rule kills CSS transitions)
 *
 * Tokens (Wave 60.56 P1, no new colors): warm-dark-{50,100} / cream-{50,300,500}
 * / gold / gold-soft / font-marketing-display / max-w-marketing /
 * max-w-marketing-text / rounded-pill / ease-editorial.
 */

export type BigNumber = {
  /** Numeric target (count-up animates from 0 → target on in-view). */
  value: number;
  /** Optional prefix character, e.g. "$" or "+". */
  prefix?: string;
  /** Optional suffix character, e.g. "★" or "%". */
  suffix?: string;
  /** Caption below number, mono uppercase eyebrow style. */
  caption: string;
  /**
   * Decimal places to display (e.g. 1 for 4.8, 0 for integer 1.243).
   * Default 0 (integer with vi-VN thousand separators).
   *
   * Wave 60.66.HF1: replaced `format?: (n: number) => string` arrow-fn
   * prop which couldn't serialize across the Server → Client RSC boundary
   * (BigNumberRow is `'use client'`). Same pattern fixed for Lucide refs
   * in Wave 60.65.P0a (commit 4954a71).
   */
  decimalPlaces?: number;
};

export type BigNumberRowProps = {
  /** Optional eyebrow above row. */
  eyebrow?: string;
  /** Section title (ReactNode for em/u spans). */
  title?: ReactNode;
  /** 3 big numbers (responsive: 3-col desktop, 1-col mobile stack). */
  numbers: BigNumber[];
  /** Risk-reversal copy block below numbers (refund / guarantee). */
  riskReversal?: {
    headline: string;
    body: string;
    /** CTA link to /pricing#refund or similar. */
    href?: string;
    cta?: string;
  };
  /** Background variant. */
  bg?: 'warm-dark-50' | 'warm-dark-100';
};

const DURATION_MS = 600;
const STAGGER_MS = 80;
// Editorial ease curve — y-control points of cubic-bezier(0.165, 0.85, 0.45, 1).
// Matches Tailwind token `transitionTimingFunction.editorial`.
const EASE_P1Y = 0.85;
const EASE_P3Y = 1;

/** Cubic-bezier y-axis evaluator at parameter `t` (0..1). */
function easeEditorial(t: number): number {
  const u = 1 - t;
  return 3 * u * u * t * EASE_P1Y + 3 * u * t * t * EASE_P3Y + t * t * t;
}

function BigNumberCell({ item, delayMs }: { item: BigNumber; delayMs: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  // Wave 60.95 BUG FIX: initial state = item.value (NOT 0).
  // Why: SSR renders this component; if we start at 0, the rendered HTML
  // shows "0" until JS hydrates + IntersectionObserver fires. Crawlers
  // (Google bot, AI auditors) and users with JS disabled saw "0" forever.
  // Original audit found: "1.243 BÁO CÁO MỘT THÁNG QUA 0" appearing as
  // social-proof bug. Default to final value; reset to 0 only on the
  // animation tick AFTER inView triggers (covered by opacity-0 reveal).
  const [current, setCurrent] = useState<number>(item.value);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Read OS-level reduced-motion preference on mount.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    // No need to setCurrent — already at item.value via initial state.
  }, []);

  // IntersectionObserver fires once at 50% visibility. We disconnect after
  // the first hit so re-scroll doesn't restart the count-up (`once: true`).
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (inView) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (reducedMotion) {
      // Reduced motion: stay at item.value (already initial state).
      return;
    }
    if (!inView) return;

    // Reset to 0 for the count-up animation start. The container is still
    // opacity-0 at this exact moment (data-in-view toggles after CSS commit),
    // so users do not see a flash of "0".
    setCurrent(0);

    let raf = 0;
    let startTs: number | null = null;
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts + delayMs;
      const elapsed = ts - startTs;
      if (elapsed < 0) {
        // Pre-delay window — keep at 0, schedule next frame.
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / DURATION_MS, 1);
      setCurrent(item.value * easeEditorial(progress));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Snap to exact target on completion (avoid bezier rounding error).
        setCurrent(item.value);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [inView, item.value, delayMs, reducedMotion]);

  // Formatter: vi-VN locale with caller-controlled decimal precision
  // (e.g. 1243 → "1.243" at decimalPlaces=0; 4.8 → "4,8" at decimalPlaces=1).
  // No inline arrow-fn prop — Wave 60.66.HF1 fix for RSC serialization.
  const decimalPlaces = item.decimalPlaces ?? 0;
  const formatter = (n: number) =>
    new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(n);
  const display = formatter(current);

  // Wave 60.95.j P2-#19 — stat blocks use opacity-only reveal (no translate).
  // Rationale: the count-up itself IS the motion. Adding translateY on top
  // double-animated the surface and competed for attention. Other home
  // sections now use slide-left (PullQuote) / scale-up (SampleOutputShowcase)
  // / staggered fade (PricingTierV2) so each section type has a distinct
  // reveal grammar. Stagger delay still applied inline so each cell fades in
  // at i*80ms in step with the count-up start.
  return (
    <div
      ref={ref}
      data-in-view={inView ? 'true' : 'false'}
      style={{ transitionDelay: `${delayMs}ms` }}
      className="flex flex-col items-center text-center opacity-0 transition-opacity duration-[600ms] ease-editorial data-[in-view=true]:opacity-100 md:items-start md:text-left"
    >
      {/*
        Wave 60.80.fix — aria-label is prohibited on non-interactive <p>.
        Use sr-only span for the screen-reader-friendly final value, and
        mark the animated decorative number aria-hidden.
      */}
      {/*
        Wave 60.95.g P2 (vault 130 §V Polypane): replaced fixed `text-[64px] md:text-[96px]`
        with `clamp(3rem, 8vw, 6rem)` to remove the abrupt jump at the md: breakpoint
        (Polypane flagged 720-820px as jarring). Same endpoints (48px floor / 96px
        ceiling) but smooth 8vw ramp through the middle. Consistent with hero-display
        token bump in tailwind.config.ts.
      */}
      <p className="font-marketing-display text-[clamp(3rem,8vw,6rem)] font-semibold leading-none tracking-tight text-foreground">
        {/*
          Wave 60.95 BUG FIX — sr-only previously contained "1.243 BÁO CÁO MỘT
          THÁNG QUA" (number + label). The label is also rendered visibly in
          the <p> below, so screen readers announced the label TWICE. Now
          sr-only only carries the final number value; the visible <p> below
          is the single source of the caption for assistive tech.
        */}
        <span className="sr-only">
          {`${item.prefix ?? ''}${formatter(item.value)}${item.suffix ?? ''}`}
        </span>
        <span aria-hidden="true">
          {item.prefix}
          {display}
          {item.suffix}
        </span>
      </p>
      <p className="mt-3 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
        {item.caption}
      </p>
    </div>
  );
}

export function BigNumberRow({
  eyebrow,
  title,
  numbers,
  riskReversal,
  bg = 'warm-dark-50',
}: BigNumberRowProps) {
  // Tailwind JIT requires literal class mapping (Wave 60.56 P1 pattern,
  // matches ScanRow.tsx).
  const bgClass = bg === 'warm-dark-50' ? 'bg-background' : 'bg-muted/40';

  return (
    <section className={`${bgClass} py-16 md:py-20`}>
      <div className="mx-auto max-w-marketing px-6 lg:px-12">
        {eyebrow && (
          <p className="mb-4 text-center font-mono text-eyebrow uppercase tracking-[0.12em] text-gold md:text-left">
            — {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-balance text-center font-sans text-section-display font-bold tracking-tight text-foreground md:text-left">
            {title}
          </h2>
        )}

        <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-3 md:gap-16">
          {numbers.map((item, i) => (
            <BigNumberCell
              key={`${item.caption}-${i}`}
              item={item}
              delayMs={i * STAGGER_MS}
            />
          ))}
        </div>

        {riskReversal && (
          <div className="mx-auto mt-20 max-w-marketing-text text-center md:mt-24">
            <p className="font-sans text-xl font-semibold leading-snug text-foreground md:text-2xl">
              {riskReversal.headline}
            </p>
            <p className="mt-3 font-sans text-base leading-relaxed text-muted-foreground">
              {riskReversal.body}
            </p>
            {riskReversal.href && riskReversal.cta && (
              <Link
                href={riskReversal.href}
                className="mt-6 inline-flex items-center gap-2 rounded-pill border border-gold/20 px-5 py-2 font-sans text-sm font-medium text-gold-soft transition-all duration-300 ease-editorial hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-dark-50"
              >
                {riskReversal.cta}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
