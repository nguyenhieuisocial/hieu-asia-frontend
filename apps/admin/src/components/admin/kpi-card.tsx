'use client';

/**
 * Premium KPI card with optional sparkline + delta arrow.
 *
 * Used on the admin dashboard hero strip. Compared to the older
 * `<StatCard>` this one has:
 *   - mini sparkline (last N points) rendered as inline SVG
 *   - delta auto-derived from the sparkline if not provided
 *   - gold corner accent, subtle hover lift
 */

import * as React from 'react';
import { cn, colors } from '@hieu-asia/ui';

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  /** Optional sparkline data, last N points. Used to derive delta if not provided. */
  sparkline?: number[];
  /** Force a delta tag. If omitted but sparkline present, computed from the series. */
  delta?: { value: string; direction: 'up' | 'down' | 'flat' } | null;
  icon?: React.ReactNode;
  /** Visual accent — affects the gold corner ribbon. */
  accent?: 'gold' | 'jade' | 'purple' | 'red';
  className?: string;
  /** Render as a clickable card. */
  href?: string;
}

const ACCENT_BAR: Record<NonNullable<KpiCardProps['accent']>, string> = {
  gold: 'from-gold/40 via-gold/10 to-transparent',
  jade: 'from-jade/40 via-jade/10 to-transparent',
  purple: 'from-purple/40 via-purple/10 to-transparent',
  red: 'from-red-500/40 via-red-500/10 to-transparent',
};

// Wave 60.9 — accent stroke values sourced from shared brand tokens; `red`
// stays on Tailwind red-500 hex (not a brand colour).
const ACCENT_STROKE: Record<NonNullable<KpiCardProps['accent']>, string> = {
  gold: colors.gold.DEFAULT,
  jade: colors.jade.DEFAULT,
  purple: colors.purple.DEFAULT,
  red: '#ef4444',
};

function Sparkline({
  points,
  stroke,
  className,
}: {
  points: number[];
  stroke: string;
  className?: string;
}) {
  if (points.length < 2) return null;
  const w = 80;
  const h = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = w / (points.length - 1);
  const d = points
    .map((p, i) => {
      const x = i * stepX;
      const y = h - ((p - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn('h-7 w-20 shrink-0', className)}
      aria-hidden
    >
      <path d={d} fill="none" stroke={stroke} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function computeDelta(series: number[]): KpiCardProps['delta'] {
  if (series.length < 2) return null;
  const first = series[0]!;
  const last = series[series.length - 1]!;
  if (first === 0 && last === 0) return null;
  const diff = last - first;
  if (first === 0) {
    return { value: `+${last.toFixed(0)}`, direction: 'up' };
  }
  const pct = (diff / Math.abs(first)) * 100;
  if (Math.abs(pct) < 1) return { value: '0%', direction: 'flat' };
  return {
    value: `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`,
    direction: pct > 0 ? 'up' : 'down',
  };
}

export function KpiCard({
  label,
  value,
  hint,
  sparkline,
  delta,
  icon,
  accent = 'gold',
  className,
  href,
}: KpiCardProps) {
  const effDelta = delta === undefined && sparkline ? computeDelta(sparkline) : delta;
  const stroke = ACCENT_STROKE[accent];

  const inner = (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-gold/15 bg-gradient-to-br from-ink/70 via-ink/60 to-ink/40 p-5 backdrop-blur-sm transition-all',
        'hover:border-gold/30 hover:shadow-[0_8px_28px_-12px_rgba(184,146,61,0.25)]',
        href && 'cursor-pointer',
        className,
      )}
    >
      {/* corner gradient ribbon */}
      <div
        className={cn(
          'pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl',
          ACCENT_BAR[accent],
        )}
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        {icon && (
          <span
            className="rounded-md border border-gold/15 bg-card/60 p-1.5 text-gold/80"
            aria-hidden
          >
            {icon}
          </span>
        )}
      </div>
      <p className="relative mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      <div className="relative mt-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {effDelta && (
            <span
              className={cn(
                'rounded px-1.5 py-0.5 font-mono text-[10px]',
                effDelta.direction === 'up' && 'bg-jade/15 text-jade-50',
                effDelta.direction === 'down' && 'bg-red-500/15 text-red-300',
                effDelta.direction === 'flat' && 'bg-muted/30 text-muted-foreground',
              )}
            >
              {effDelta.direction === 'up' && '↑ '}
              {effDelta.direction === 'down' && '↓ '}
              {effDelta.value}
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
        {sparkline && sparkline.length > 1 && (
          <Sparkline points={sparkline} stroke={stroke} />
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/40"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
