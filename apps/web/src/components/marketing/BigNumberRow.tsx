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
  /** Optional formatter override (e.g. for "4.8" / "14 ngày"). Default Intl.NumberFormat('vi-VN'). */
  format?: (n: number) => string;
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

const DURATION_MS = 1200;
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
  const [current, setCurrent] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Read OS-level reduced-motion preference on mount.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) {
      setCurrent(item.value);
    }
  }, [item.value]);

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
      setCurrent(item.value);
      return;
    }
    if (!inView) return;

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

  // Formatter: caller-provided override OR default vi-VN integer formatter
  // (e.g. 1243 → "1.243"). Round before formatting so int-default doesn't
  // emit decimals during the animation tween.
  const formatter =
    item.format ??
    ((n: number) => new Intl.NumberFormat('vi-VN').format(Math.round(n)));
  const display = formatter(current);

  // CSS-only reveal — opacity + translateY transition triggered by toggling
  // the `data-in-view` attribute. Editorial ease + 600ms duration matches the
  // count-up's first half (visually feels like one motion). Stagger delay
  // applied inline so each cell starts at i*80ms.
  return (
    <div
      ref={ref}
      data-in-view={inView ? 'true' : 'false'}
      style={{ transitionDelay: `${delayMs}ms` }}
      className="flex translate-y-6 flex-col items-center text-center opacity-0 transition-[opacity,transform] duration-[600ms] ease-editorial data-[in-view=true]:translate-y-0 data-[in-view=true]:opacity-100 md:items-start md:text-left"
    >
      <p
        className="font-marketing-display text-[64px] font-semibold leading-none tracking-tight text-cream-50 md:text-[96px]"
        aria-label={`${item.prefix ?? ''}${formatter(item.value)}${item.suffix ?? ''} ${item.caption}`}
      >
        {item.prefix}
        <span aria-hidden>{display}</span>
        {item.suffix}
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
  const bgClass = bg === 'warm-dark-50' ? 'bg-warm-dark-50' : 'bg-warm-dark-100';

  return (
    <section className={`${bgClass} py-24 md:py-32`}>
      <div className="mx-auto max-w-marketing px-6 lg:px-12">
        {eyebrow && (
          <p className="mb-4 text-center font-mono text-eyebrow uppercase tracking-[0.12em] text-gold md:text-left">
            — {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-balance text-center font-sans text-section-display font-bold tracking-tight text-cream-50 md:text-left">
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
            <p className="font-sans text-xl font-semibold leading-snug text-cream-50 md:text-2xl">
              {riskReversal.headline}
            </p>
            <p className="mt-3 font-sans text-base leading-relaxed text-cream-300">
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
