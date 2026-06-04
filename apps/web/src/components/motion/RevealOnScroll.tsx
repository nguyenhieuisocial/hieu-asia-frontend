'use client';

/**
 * RevealOnScroll — thin IntersectionObserver wrapper.
 *
 * Sets `data-in` on the div when the element first enters the viewport.
 * CSS `[data-in] .rv-up / .rv-fade / .rv-draw-l / .rv-draw-r` in globals.css
 * fire the animations — no prop drilling, children stay server components.
 *
 * Matches the hero's prefers-reduced-motion-safe pattern: when motion is off
 * the rv-* classes are never hidden so content always shows.
 */

import { useRef, useState, useEffect, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  threshold?: number;
}

export function RevealOnScroll({ children, className, threshold = 0.15 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [inView, threshold]);

  return (
    <div ref={ref} className={className} data-in={inView || undefined}>
      {children}
    </div>
  );
}
