'use client';

import * as React from 'react';

/**
 * CountUp — animates a number from `from` → `value` the first time it scrolls
 * into view (IntersectionObserver, once). SSR + first client render emit the
 * FINAL value (so no-JS / crawlers see the real number and there is no
 * hydration mismatch); an isomorphic layout effect drops the display to `from`
 * before paint when motion is allowed, so there is no flash of the final value.
 *
 * Perf/a11y: pure rAF (no library), eased, observer + rAF both cleaned up, and
 * under prefers-reduced-motion it renders the final value statically with no
 * animation. Self-contained — no new dependency. Matches the fx/ conventions
 * (Marquee/ScrollProgress).
 */
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export function CountUp({
  value,
  from = 0,
  durationMs = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  format,
  className = '',
}: {
  value: number;
  from?: number;
  durationMs?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Custom formatter (overrides decimals/prefix/suffix), e.g. formatVND. */
  format?: (n: number) => string;
  className?: string;
}): React.JSX.Element {
  const fmt = React.useCallback(
    (n: number): string => {
      if (format) return format(n);
      const r = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
      return `${prefix}${r}${suffix}`;
    },
    [format, decimals, prefix, suffix],
  );

  const [display, setDisplay] = React.useState<string>(() => fmt(value));
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const motionRef = React.useRef(false);
  const startedRef = React.useRef(false);

  // Before paint: if motion is allowed, reset to `from` so the count-up has
  // somewhere to travel from — without a visible flash of the final value.
  useIsoLayoutEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    motionRef.current = !reduce;
    if (!reduce) setDisplay(fmt(from));
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !motionRef.current) return;
    let raf = 0;
    let startTs = 0;
    const ease = (t: number): number => 1 - Math.pow(1 - t, 3);
    const tick = (ts: number): void => {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / Math.max(1, durationMs));
      setDisplay(fmt(from + (value - from) * ease(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e && e.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          raf = requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, from, durationMs, fmt]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
