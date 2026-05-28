'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

/**
 * Wave 60.66.P5 — PullQuote (Option E "Editorial Live" decorative role #2).
 *
 * Editorial pull-quote between sections — large Instrument Serif italic body
 * with optional mono attribution + CSS reveal on first in-view. One of three
 * preserved decorative roles for `font-marketing-display` post Wave 60.66.P5
 * sweep (numerals in BigNumberRow + price amounts in PricingTierV2, this
 * pull-quote body, and § glyph in SectionDivider).
 *
 * Reveal animation:
 *   - `IntersectionObserver` threshold 0.5 — fires once at 50% visibility
 *   - CSS-only opacity + translateY transition via `data-in-view` attribute
 *   - 400ms / editorial ease cubic-bezier `[0.165, 0.85, 0.45, 1]` — matches
 *     the same token used by BigNumberRow count-up
 *   - `prefers-reduced-motion` honored by globals.css global rule
 *
 * Why not `m.div` + `useInView` per the original spec: matches the same
 * trade-off BigNumberRow documented (Phase 4 header) — the LazyMotion
 * provider only wraps the tree; consuming `m.*` + `useInView` pulls
 * ~16 KB First Load JS into the home chunk and busts the spec's < 5 KB
 * Phase 5 budget gate. CSS + IntersectionObserver = 0 KB delta, same visual.
 *
 * Tokens (Wave 60.56 P1, no new colors): bg-warm-dark-{50,100} /
 * text-cream-50 / text-gold / text-gold-soft / font-marketing-display /
 * max-w-marketing-text / ease-editorial.
 */

export type PullQuoteProps = {
  /** Quote body — ReactNode so callers can pass `<em>` / `<span>` accents. */
  children: ReactNode;
  /** Optional mono uppercase attribution line, e.g. "— Triết lý hieu.asia". */
  attribution?: string;
  /** Background variant. Default `warm-dark-50` blends with the home tonal rhythm. */
  bg?: 'warm-dark-50' | 'warm-dark-100';
};

export function PullQuote({
  children,
  attribution,
  bg = 'warm-dark-50',
}: PullQuoteProps) {
  // Tailwind JIT needs literal class names (Wave 60.56 P1 pattern).
  const bgClass = bg === 'warm-dark-100' ? 'bg-warm-dark-100' : 'bg-warm-dark-50';

  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // SSR safety + older browsers (very unlikely on modern Vietnam mobile,
    // but cheap to guard) — show immediately if no IO.
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
      { threshold: 0.5, rootMargin: '-10%' },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`${bgClass} py-12 md:py-16`}>
      {/*
        Wave 60.95.j P2-#19 — testimonial-like pull-quote uses slide-from-left
        reveal (translateX -2.5rem → 0) to differentiate from the opacity-only
        stat blocks (BigNumberRow) and scale-up showcase grids
        (SampleOutputShowcase). Duration 600ms (was 400) to match the other
        section variants and feel calm rather than snappy.
      */}
      <div
        ref={ref}
        data-in-view={inView ? 'true' : 'false'}
        className="mx-auto max-w-marketing-text -translate-x-10 px-6 text-center opacity-0 transition-[opacity,transform] duration-[600ms] ease-editorial data-[in-view=true]:translate-x-0 data-[in-view=true]:opacity-100"
      >
        <span
          aria-hidden
          className="block font-marketing-display text-5xl leading-none text-gold/50 md:text-6xl"
        >
          “
        </span>
        <blockquote className="mt-2 font-marketing-display text-3xl italic leading-relaxed text-cream-50 md:text-4xl">
          {children}
        </blockquote>
        {attribution && (
          <p className="mt-6 font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
            {attribution}
          </p>
        )}
      </div>
    </section>
  );
}
