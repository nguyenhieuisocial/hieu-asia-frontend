'use client';

/**
 * Lightweight donut chart — no Recharts needed for this; pure SVG.
 * Pass slices as {label, value, color}. Hover shows tooltip.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  slices: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: React.ReactNode;
  className?: string;
}

export function DonutChart({
  slices,
  size = 160,
  thickness = 22,
  centerLabel,
  className,
}: DonutChartProps) {
  const total = slices.reduce((s, x) => s + Math.max(0, x.value), 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let cumulative = 0;
  const isEmpty = total <= 0;

  return (
    <div className={cn('flex flex-col items-center gap-3 sm:flex-row sm:items-start', className)}>
      <svg width={size} height={size} className="shrink-0">
        {/* track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(184,146,61,0.10)"
          strokeWidth={thickness}
        />
        {!isEmpty &&
          slices.map((s, i) => {
            const v = Math.max(0, s.value);
            const fraction = v / total;
            const dash = fraction * circumference;
            const offset = -cumulative * circumference;
            cumulative += fraction;
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="butt"
              >
                <title>
                  {s.label}: {v.toLocaleString()} ({(fraction * 100).toFixed(1)}%)
                </title>
              </circle>
            );
          })}
        {centerLabel && (
          <foreignObject x={0} y={0} width={size} height={size}>
            <div className="flex h-full w-full items-center justify-center text-center text-foreground">
              {centerLabel}
            </div>
          </foreignObject>
        )}
      </svg>
      <ul className="min-w-0 flex-1 space-y-1.5 text-xs">
        {slices.map((s, i) => {
          const v = Math.max(0, s.value);
          const pct = total > 0 ? (v / total) * 100 : 0;
          return (
            <li key={i} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ background: s.color }}
                />
                <span className="truncate text-foreground/85">{s.label}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 font-mono">
                <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
                <span className="tabular-nums text-foreground">{v.toLocaleString()}</span>
              </span>
            </li>
          );
        })}
        {isEmpty && <li className="text-muted-foreground">Chưa có dữ liệu.</li>}
      </ul>
    </div>
  );
}
