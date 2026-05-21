'use client';

import * as React from 'react';

/**
 * AnimatedBeam — pure CSS conic gradient sweeping a soft gold halo.
 * Used as a subtle background accent. Respects prefers-reduced-motion.
 */
export function AnimatedBeam({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={['pointer-events-none absolute inset-0 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="beam-rotate absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-40 [mask-image:radial-gradient(circle_at_center,black_30%,transparent_70%)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(184,146,61,0.35) 80deg, transparent 160deg, transparent 220deg, rgba(59,39,84,0.3) 290deg, transparent 360deg)',
          }}
        />
      </div>

      <style>{`
        @keyframes beam-spin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .beam-rotate {
          animation: beam-spin 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .beam-rotate { animation: none; }
        }
      `}</style>
    </div>
  );
}
