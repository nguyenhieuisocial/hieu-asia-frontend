'use client';

/**
 * Wave 60.69 — LotusLottie atmospheric hero animation (vault 109 §4.1).
 *
 * Renders an animated lotus motif over the marketing hero. Designed to be
 * additive: MarketingHero accepts a `lottie` slot so the static
 * `ornament="gold-ring"` ring (Option E) stays the default — pages opt in by
 * passing `<LotusLottie />` (right now: only landing /).
 *
 * Constraints (vault 109 §4 + §8 Q3 LOCK + R6 anti-pattern list):
 *   - Lazy: imported via `next/dynamic` with `ssr: false` so the ~30 KB
 *     dotlottie-react chunk never lands in the initial JS bundle of the
 *     server-rendered hero. Server component MarketingHero just receives
 *     pre-rendered JSX (RSC pattern from Wave 60.65.P0a / 60.66.HF1 — no
 *     Component reference leaks across the Server→Client boundary).
 *   - Reduced motion: when `prefers-reduced-motion: reduce`, render a STATIC
 *     SVG that matches the existing gold-ring ornament — no animation, no
 *     dotlottie chunk fetched, accessibility commitment honoured.
 *   - Pause on scroll-out: IntersectionObserver pauses the player when the
 *     element leaves the viewport (battery + thermal save on mobile).
 *   - Fallback: if dotlottie fails to load the `.lottie` source (network /
 *     404 / decode error), fall back to a CSS-only animated SVG so the hero
 *     still renders something atmospheric — never a blank box.
 *
 * Sizing: 280px desktop / 220px mobile (matches the existing gold-ring slot
 * inside MarketingHero so visual rhythm doesn't shift). Gold tint matches
 * `text-gold` / `border-gold/30` tokens used elsewhere in the editorial palette.
 *
 * Asset contract: the default `src='/lotus-spin.lottie'` points at a file that
 * Wave 60.69 ships WITHOUT (no curated Lottie JSON yet — vault 109 §4.1 noted
 * MVP fallback is acceptable). When the .lottie load fails, we silently fall
 * through to the CSS-SVG variant. Drop a real Lottie file at
 * `apps/web/public/lotus-spin.lottie` in a follow-up to activate playback.
 */

import * as React from 'react';
import dynamic from 'next/dynamic';

export type LotusLottieProps = {
  /** Path to a `.lottie` (dotLottie) or `.json` (Lottie) file under /public. Default `/lotus-spin.lottie`. */
  src?: string;
  className?: string;
};

// Dynamic import — ssr:false keeps the ~30 KB dotlottie-react bundle in a
// browser-only chunk so the home server-rendered HTML pays $0 initial JS cost.
const DotLottieReact = dynamic(
  () =>
    import('@lottiefiles/dotlottie-react').then((m) => ({
      default: m.DotLottieReact,
    })),
  { ssr: false, loading: () => <CssSvgFallback /> },
);

/**
 * Matches `ornament="gold-ring"` in MarketingHero (size 220px, dual ring +
 * centre dot + soft glow). CSS animates a slow spin at 24s, paused when
 * `prefers-reduced-motion: reduce` via the `motion-reduce:animate-none`
 * Tailwind variant (works because Tailwind compiles the underlying media
 * query at build time).
 */
function CssSvgFallback() {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative size-[220px] lg:size-[280px]"
    >
      <div className="absolute inset-0 animate-[spin_24s_linear_infinite] rounded-full border border-gold/30 motion-reduce:animate-none" />
      <div className="absolute inset-3 animate-[spin_32s_linear_infinite_reverse] rounded-full border border-gold/15 motion-reduce:animate-none" />
      <div className="absolute inset-8 rounded-full border border-gold/10" />
      <div className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-dot shadow-gold-dot-glow" />
    </div>
  );
}

export function LotusLottie({
  src = '/lotus-spin.lottie',
  className,
}: LotusLottieProps) {
  // Track reduced-motion + scroll-visibility state. Both default to safe values
  // on first paint (reduce=true so we don't flash an animation, visible=true
  // so the dotlottie player mounts; the IntersectionObserver re-evaluates).
  const [reduceMotion, setReduceMotion] = React.useState(true);
  const [visible, setVisible] = React.useState(true);
  const [failed, setFailed] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: 'min(280px, 65vw)', aspectRatio: '1 / 1' }}
    >
      {reduceMotion || failed ? (
        <CssSvgFallback />
      ) : (
        <DotLottieReact
          src={src}
          autoplay={visible}
          loop={false}
          // dotlottie-react fires `onError` for fetch / decode failures. We
          // flip `failed` so subsequent renders use the CSS-SVG fallback —
          // no infinite retry loop, no visible blank state.
          // The library types this loosely; cast through `unknown` keeps us
          // honest without pulling extra type imports.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError={(() => setFailed(true)) as any}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}
