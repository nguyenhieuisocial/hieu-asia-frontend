'use client';

import * as React from 'react';

/**
 * TiltCard — tilts its children in 3D toward the cursor, springs back on leave.
 * Subtle (≤ max degrees). No tilt on touch devices or under
 * prefers-reduced-motion (renders a plain wrapper). Uses transform + a short
 * CSS transition; no RAF.
 */
export function TiltCard({
  children,
  className = '',
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}): React.JSX.Element {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: fine)').matches;
    setEnabled(!reduce && fine);
  }, []);

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || !enabled) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
    },
    [enabled, max],
  );

  const reset = React.useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={enabled ? onMove : undefined}
      onMouseLeave={enabled ? reset : undefined}
      style={{
        transition: 'transform 0.25s cubic-bezier(0.165,0.85,0.45,1)',
        transformStyle: 'preserve-3d',
        willChange: enabled ? 'transform' : undefined,
      }}
    >
      {children}
    </div>
  );
}
