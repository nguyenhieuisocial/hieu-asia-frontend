'use client';

/**
 * Score visualization 0-100 với SVG circle gradient (red → yellow → green).
 */

import * as React from 'react';

interface Props {
  score: number;
  rating: string;
  size?: number; // px
}

function colorForScore(s: number): string {
  // Darkened bad→good ramp that stays WCAG-AA (≥4.5:1) on the cream (#F3ECDD)
  // light theme this gauge renders on. It drives the arc, the big score number
  // and the rating label, so all three must clear AA — the original 500-shades
  // sat at only 1.6–3.2:1 and washed out on cream.
  if (s < 30) return '#b91c1c';        // red-700    (5.5:1)
  if (s < 50) return '#9a3412';        // orange-800 (6.2:1)
  if (s < 70) return '#854d0e';        // yellow-800 (5.8:1)
  if (s < 85) return '#166534';        // green-800  (6.1:1)
  return '#14532d';                    // green-900  (7.8:1)
}

export function CompatibilityScore({ score, rating, size = 200 }: Props) {
  const s = Math.max(0, Math.min(100, score));
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - s / 100);
  const color = colorForScore(s);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-md">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={10}
          style={{ stroke: 'hsl(var(--border))' }}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.7s ease-out' }}
        />
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.28}
          fontWeight={700}
          fill={color}
        >
          {Math.round(s)}
        </text>
        <text
          x="50%"
          y="62%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.08}
          style={{ fill: 'hsl(var(--muted-foreground))' }}
        >
          / 100
        </text>
      </svg>
      <p className="text-center font-medium text-foreground" style={{ color }}>
        {rating}
      </p>
    </div>
  );
}
