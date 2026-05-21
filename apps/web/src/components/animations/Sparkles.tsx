'use client';

import * as React from 'react';

/**
 * Sparkles — twinkling gold dots in a fixed region. Pure CSS, no JS frame loop.
 * Positions deterministic (seed-based) for SSR parity.
 */
type Spark = { left: number; top: number; size: number; delay: number; duration: number };

// Deterministic pseudo-random — same output server + client (avoids hydration mismatch).
function buildSparks(count: number): Spark[] {
  const sparks: Spark[] = [];
  let seed = 1337;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < count; i += 1) {
    sparks.push({
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2,
      delay: rand() * 4,
      duration: 2 + rand() * 3,
    });
  }
  return sparks;
}

export function Sparkles({ count = 24, className }: { count?: number; className?: string }) {
  const sparks = React.useMemo(() => buildSparks(count), [count]);
  return (
    <div
      aria-hidden="true"
      className={['pointer-events-none absolute inset-0 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
    >
      {sparks.map((s, i) => (
        <span
          key={i}
          className="sparkle absolute rounded-full bg-gold"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle-twinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 0.9; transform: scale(1); }
        }
        .sparkle {
          opacity: 0;
          animation-name: sparkle-twinkle;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          box-shadow: 0 0 6px rgba(184, 146, 61, 0.6);
        }
        @media (prefers-reduced-motion: reduce) {
          .sparkle { animation: none; opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
