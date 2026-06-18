'use client';

/**
 * MiniSparkline — a tiny dependency-free inline SVG line for per-row trends
 * (e.g. each Sentry issue's 24h event volume). Recharts is deliberately NOT
 * used here: a table can render 20+ rows and one Recharts instance per row
 * would be far too heavy. This draws a single normalized polyline in pure SVG.
 *
 * Renders nothing (null) when there are fewer than 2 points so callers can drop
 * the cell cleanly on older workers that don't send the series.
 */

import * as React from 'react';
import { colors } from '@hieu-asia/ui';

const GOLD = colors.gold.DEFAULT;

interface MiniSparklineProps {
  /** Ordered counts (oldest → newest). */
  data: number[] | null | undefined;
  width?: number;
  height?: number;
  className?: string;
  /** Accessible label, e.g. "Lưu lượng lỗi 24h". */
  ariaLabel?: string;
}

export function MiniSparkline({
  data,
  width = 64,
  height = 20,
  className,
  ariaLabel,
}: MiniSparklineProps): React.ReactElement | null {
  if (!Array.isArray(data) || data.length < 2) return null;

  const max = Math.max(...data, 1);
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      // y inverted (SVG origin is top-left); 1px padding top/bottom.
      const y = height - 1 - (Math.max(0, v) / max) * (height - 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      role="img"
      aria-label={ariaLabel ?? 'sparkline'}
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke={GOLD}
        strokeWidth={1.25}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.85}
      />
    </svg>
  );
}
