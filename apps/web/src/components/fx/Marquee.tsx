'use client';

import * as React from 'react';

/**
 * Marquee — seamless infinite horizontal scroll of its children (duplicated
 * track). Pauses on hover. Under prefers-reduced-motion it does NOT auto-scroll
 * (renders a single static, horizontally-scrollable row). Pure CSS transform
 * loop — no RAF.
 */
export function Marquee({
  children,
  className = '',
  speed = 40,
  direction = 'left',
}: {
  children: React.ReactNode;
  className?: string;
  /** pixels per second */
  speed?: number;
  direction?: 'left' | 'right';
}): React.JSX.Element {
  const id = React.useId().replace(/[:]/g, '');
  const [reduce, setReduce] = React.useState(false);
  const [dur, setDur] = React.useState(20);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setReduce(
      typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    const el = trackRef.current;
    if (el) {
      const w = el.scrollWidth / 2; // one copy
      if (w > 0) setDur(Math.max(8, w / Math.max(8, speed)));
    }
  }, [speed]);

  if (reduce) {
    return (
      <div className={className} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: '2.5rem' }}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)' }}
    >
      <style>{`
        @keyframes mq-${id}{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .mq-${id}{display:inline-flex;gap:2.5rem;white-space:nowrap;will-change:transform;animation:mq-${id} ${dur}s linear infinite ${direction === 'right' ? 'reverse' : 'normal'};}
        .mq-wrap-${id}:hover .mq-${id}{animation-play-state:paused;}
      `}</style>
      <div className={`mq-wrap-${id}`}>
        <div ref={trackRef} className={`mq-${id}`}>
          {children}
          <span aria-hidden="true" style={{ display: 'inline-flex', gap: '2.5rem' }}>{children}</span>
        </div>
      </div>
    </div>
  );
}
