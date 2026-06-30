'use client';

import * as React from 'react';

/**
 * SpotlightCard — a soft gold radial glow that follows the cursor inside the
 * element on hover. The glow is a pointer-events-none overlay driven by CSS
 * vars (--mx/--my) updated on mousemove. Under prefers-reduced-motion the glow
 * is a static faint centre highlight. Wrap any card.
 */
export function SpotlightCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    setReduce(
      typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  }, []);

  const onMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    },
    [],
  );

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={reduce ? undefined : onMove}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          background: reduce
            ? 'radial-gradient(220px circle at 50% 0%, rgba(224,174,98,0.10), transparent 70%)'
            : 'radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(224,174,98,0.16), transparent 70%)',
          transition: 'background 0.12s ease',
        }}
      />
      {children}
    </div>
  );
}
