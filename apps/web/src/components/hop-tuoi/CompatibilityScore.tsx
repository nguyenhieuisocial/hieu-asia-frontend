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
  if (s < 30) return '#ef4444';        // red-500
  if (s < 50) return '#f97316';        // orange-500
  if (s < 70) return '#eab308';        // yellow-500
  if (s < 85) return '#84cc16';        // lime-500
  return '#22c55e';                    // green-500
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
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={10}
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
          fill="rgba(255,255,255,0.6)"
        >
          / 100
        </text>
      </svg>
      <p className="text-center font-medium text-cream" style={{ color }}>
        {rating}
      </p>
    </div>
  );
}
