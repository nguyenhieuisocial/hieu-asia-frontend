import * as React from 'react';

/**
 * Decorative 12-cung "lá số tử vi" outline ring.
 * Used as subtle background motif on landing hero.
 * Pure SVG, no external asset.
 */
export function LaSoSvg({ className }: { className?: string }) {
  const cx = 200;
  const cy = 200;
  const rOuter = 180;
  const rInner = 80;
  const segments = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
    return {
      x1: cx + rInner * Math.cos(angle),
      y1: cy + rInner * Math.sin(angle),
      x2: cx + rOuter * Math.cos(angle),
      y2: cy + rOuter * Math.sin(angle),
    };
  });

  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <radialGradient id="laso-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#B8923D" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#3B2754" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0F0F12" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={rOuter} fill="url(#laso-glow)" />
      <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#B8923D" strokeOpacity="0.25" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={rOuter - 10} fill="none" stroke="#B8923D" strokeOpacity="0.15" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="#B8923D" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={rInner - 8} fill="none" stroke="#B8923D" strokeOpacity="0.15" strokeWidth="0.5" />
      {segments.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="#B8923D"
          strokeOpacity="0.2"
          strokeWidth="0.75"
        />
      ))}
      {/* Faint star dots for "bản đồ sao" feel */}
      {[
        [60, 80],
        [340, 110],
        [80, 320],
        [320, 300],
        [200, 30],
        [200, 370],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="#D5B057" fillOpacity="0.5" />
      ))}
    </svg>
  );
}
