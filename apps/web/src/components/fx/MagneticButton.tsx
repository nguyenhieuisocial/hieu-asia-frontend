'use client';

import * as React from 'react';

/**
 * MagneticButton — wraps a CTA so it drifts slightly toward the cursor while
 * hovered, then eases back on leave. Inline-block wrapper, so it hugs the
 * child and does not change layout; the child stays fully interactive.
 *
 * Perf/a11y: no rAF and no library — `mousemove` writes a transform directly
 * (cheap) and a CSS transition handles the spring-back. Effect is enabled ONLY
 * on fine pointers (real mouse) AND when prefers-reduced-motion is not set;
 * on touch / reduced-motion it renders an inert wrapper (no listeners, no
 * transform). Matches the fx/ conventions.
 *
 * Apply to auto-width CTAs. For full-width buttons pass `block` so the wrapper
 * fills its container.
 */
export function MagneticButton({
  children,
  strength = 6,
  block = false,
  className = '',
}: {
  children: React.ReactNode;
  /** Max drift in px toward the cursor at the edge. */
  strength?: number;
  /** Use a block wrapper (full width) instead of inline-block. */
  block?: boolean;
  className?: string;
}): React.JSX.Element {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const mm = typeof window.matchMedia === 'function' ? window.matchMedia : null;
    const reduce = mm ? mm('(prefers-reduced-motion: reduce)').matches : false;
    const fine = mm ? mm('(pointer: fine)').matches : false;
    setEnabled(!reduce && fine);
  }, []);

  const onMove = (e: React.MouseEvent<HTMLSpanElement>): void => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength;
    const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength;
    el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
  };

  const reset = (): void => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0px, 0px)';
  };

  return (
    <span
      ref={ref}
      onMouseMove={enabled ? onMove : undefined}
      onMouseLeave={enabled ? reset : undefined}
      className={`${block ? 'block' : 'inline-block'} ${enabled ? 'will-change-transform' : ''} ${className}`}
      style={enabled ? { transition: 'transform .25s cubic-bezier(.2,.8,.3,1)' } : undefined}
    >
      {children}
    </span>
  );
}
