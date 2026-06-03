'use client';

/**
 * JourneyStar — the 5-pointed "ngôi sao của bạn" for /account/journey.
 *
 * Each flagship lens owns one point of the star. A completed lens lights its
 * point gold (radial-gradient fill); a todo lens shows a faint outline. The
 * geometry is a faithful port of the approved spec
 * (trang-hanh-trinh-preview.html): outer radius 104, inner radius 42, first
 * point straight up, 72° apart.
 *
 * Decorative — labelled at the page level — so the SVG itself is aria-hidden.
 */

import * as React from 'react';
import type { JourneyLens } from '@/lib/journey';

const C = 150;
const OUT = 104;
const IN = 42;

/** Point on a circle of radius `r` at angle `deg` (0° = east, clockwise). */
function pt(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}

const fmt = ([x, y]: [number, number]) => `${x.toFixed(1)},${y.toFixed(1)}`;

export interface JourneyStarProps {
  state: JourneyLens[];
  done: number;
  total: number;
}

export function JourneyStar({ state, done, total }: JourneyStarProps) {
  // Dim full-star outline (used as a "what it could be" ghost).
  const outline: string = React.useMemo(() => {
    const pts: [number, number][] = [];
    for (let k = 0; k < state.length; k++) {
      pts.push(pt(OUT, -90 + 72 * k));
      pts.push(pt(IN, -90 + 72 * k + 36));
    }
    return pts.map(fmt).join(' ');
  }, [state.length]);

  return (
    <svg
      viewBox="0 0 300 300"
      className="h-[260px] w-[260px] sm:h-[300px] sm:w-[300px]"
      role="img"
      aria-label={`Ngôi sao đã sáng ${done} trên ${total} cánh`}
    >
      <defs>
        <radialGradient id="journey-star-gold" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#F0D08A" />
          <stop offset="60%" stopColor="#D8B25C" />
          <stop offset="100%" stopColor="#B6883C" />
        </radialGradient>
      </defs>

      <circle
        cx={C}
        cy={C}
        r={128}
        className="fill-none stroke-gold/20"
        strokeWidth={1}
      />

      <polygon
        points={outline}
        className="fill-none stroke-gold/40"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />

      {state.map(({ lens, done: lensDone }, k) => {
        const tip = pt(OUT, -90 + 72 * k);
        const left = pt(IN, -90 + 72 * k - 36);
        const right = pt(IN, -90 + 72 * k + 36);
        const label = pt(OUT + 22, -90 + 72 * k);
        const anchor =
          label[0] > C + 5 ? 'start' : label[0] < C - 5 ? 'end' : 'middle';
        return (
          <g key={lens.slug}>
            <polygon
              points={`${fmt(tip)} ${fmt(left)} ${fmt(right)}`}
              fill={lensDone ? 'url(#journey-star-gold)' : 'rgba(164,117,50,0.08)'}
              className={lensDone ? '' : 'stroke-gold/25'}
              strokeWidth={lensDone ? 0 : 1}
            />
            <text
              x={label[0].toFixed(1)}
              y={label[1].toFixed(1)}
              textAnchor={anchor}
              className={`font-mono text-[8.5px] tracking-wide ${
                lensDone ? 'fill-gold-700' : 'fill-muted-foreground'
              }`}
            >
              {lens.name}
            </text>
          </g>
        );
      })}

      <text
        x={C}
        y={C + 6}
        textAnchor="middle"
        className="fill-gold-700 font-mono text-[15px] font-medium"
      >
        {done}/{total}
      </text>
    </svg>
  );
}
