'use client';

/**
 * RevealOnScroll — geometry-poll scroll reveal (fling-proof).
 *
 * Sets `data-in` when the element enters (or has scrolled past) the viewport.
 * CSS `[data-in] .rv-*` in globals.css fire the animations; children stay
 * server components.
 *
 * Why a scroll-triggered rAF POLL instead of IntersectionObserver:
 * IO (and a single rAF-on-scroll) can SILENTLY MISS the rest position after a
 * fast / fling scroll, leaving content stuck at opacity:0 = blank section.
 * Here each scroll arms a ~500ms rAF poll that reads getBoundingClientRect
 * every frame — it cannot miss the settle position, even after a hard fling.
 * Idle (no scrolling) = no polling, so battery is unaffected. reduced-motion
 * stays safe (the rv-* hidden state only lives inside
 * `@media (prefers-reduced-motion: no-preference)`).
 */

import { useRef, useState, useEffect, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  /** Fraction of viewport height the element top must cross to reveal (0–1). */
  threshold?: number;
}

export function RevealOnScroll({ children, className, threshold = 0.15 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const inOrPast = () => {
      const r = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top <= vh * (1 - threshold);
    };

    if (inOrPast()) { setInView(true); return; }

    let raf = 0;
    let until = 0;
    const stop = () => {
      window.removeEventListener('scroll', arm);
      window.removeEventListener('resize', arm);
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    const poll = () => {
      if (inOrPast()) { setInView(true); stop(); return; }
      raf = performance.now() < until ? requestAnimationFrame(poll) : 0;
    };
    const arm = () => {
      until = performance.now() + 500; // poll 500ms sau mỗi scroll → phủ momentum fling
      if (!raf) raf = requestAnimationFrame(poll);
    };
    window.addEventListener('scroll', arm, { passive: true });
    window.addEventListener('resize', arm, { passive: true });
    return stop;
  }, [inView, threshold]);

  return (
    <div ref={ref} className={className} data-in={inView || undefined}>
      {children}
    </div>
  );
}
