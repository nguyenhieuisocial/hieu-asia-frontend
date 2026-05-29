'use client';

/**
 * AdminKpiCard — single-pane operational tile for `/overview`.
 *
 * Wave 60.95.x — surfaces a single 3rd-party metric (Vercel deploys, Sentry
 * errors, Resend volume, …) in a compact tile that links back to the original
 * dashboard as an escape hatch.
 *
 * Differs from the existing `<KpiCard>` (in `components/admin/kpi-card.tsx`):
 *   - mandatory `source` chip + optional `sourceUrl` deep-link
 *   - 7-tile shape; no sparkline (the Worker endpoint only emits today/yesterday)
 *   - explicit `loading` skeleton for the "endpoint not deployed yet" case
 *
 * Visual stays admin-brand (gold/jade/purple accents on warm-dark base) but
 * is theme-aware: tokens are pulled from `@hieu-asia/ui` rather than hard
 * hex — admin supports light/dark, unlike vault 108 marketing dark-lock.
 */

import * as React from 'react';
import { cn } from '@hieu-asia/ui';

export type KpiSource =
  | 'vercel'
  | 'sentry'
  | 'posthog'
  | 'resend'
  | 'cloudflare'
  | 'supabase'
  | 'github';

export interface AdminKpiCardProps {
  /** Mono uppercase tag, e.g. "DEPLOYS HÔM NAY". */
  label: string;
  /** Large numeral / formatted value. */
  value: React.ReactNode;
  /** Subtle secondary text below the value, e.g. "Vercel · 12 trong 7 ngày". */
  subtitle?: string;
  /** Which 3rd-party owns this metric — drives the footnote chip + colour. */
  source: KpiSource;
  /** Deep-link to the original dashboard (escape hatch). */
  sourceUrl?: string;
  /** Optional trend arrow (skip when yesterday data isn't available). */
  trend?: { direction: 'up' | 'down' | 'flat'; label?: string };
  /** Render skeleton while data is loading. */
  loading?: boolean;
  className?: string;
}

/** Source → human label for the footnote chip. */
const SOURCE_LABEL: Record<KpiSource, string> = {
  vercel: 'Vercel',
  sentry: 'Sentry',
  posthog: 'PostHog',
  resend: 'Resend',
  cloudflare: 'Cloudflare',
  supabase: 'Supabase',
  github: 'GitHub',
};

/** Source → accent ribbon. Keeps the grid visually scannable. */
const SOURCE_ACCENT: Record<KpiSource, string> = {
  vercel: 'from-foreground/30 via-foreground/10 to-transparent',
  sentry: 'from-red-500/40 via-red-500/10 to-transparent',
  supabase: 'from-jade/40 via-jade/10 to-transparent',
  resend: 'from-gold/40 via-gold/10 to-transparent',
  posthog: 'from-warn-500/40 via-warn-500/10 to-transparent',
  cloudflare: 'from-warn-500/40 via-warn-500/10 to-transparent',
  github: 'from-purple/40 via-purple/10 to-transparent',
};

export function AdminKpiCard({
  label,
  value,
  subtitle,
  source,
  sourceUrl,
  trend,
  loading = false,
  className,
}: AdminKpiCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-gold/15 bg-gradient-to-br from-card/80 via-card/60 to-card/30 p-5 backdrop-blur-sm transition-all duration-300 ease-editorial',
        'hover:border-gold/30 hover:shadow-[0_8px_28px_-12px_rgba(184,146,61,0.25)]',
        className,
      )}
    >
      <div
        className={cn(
          'pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl',
          SOURCE_ACCENT[source],
        )}
        aria-hidden
      />

      <p className="relative font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>

      {loading ? (
        <div
          className="relative mt-3 h-8 w-16 animate-pulse rounded bg-muted/30"
          aria-hidden
        />
      ) : (
        <div className="relative mt-3 flex items-baseline gap-2">
          <p className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {value}
          </p>
          {trend && (
            <span
              className={cn(
                'rounded px-1.5 py-0.5 font-mono text-[10px]',
                trend.direction === 'up' && 'bg-jade/15 text-jade-700 dark:text-jade-50',
                trend.direction === 'down' && 'bg-red-500/15 text-red-700 dark:text-red-300',
                trend.direction === 'flat' && 'bg-muted/30 text-muted-foreground',
              )}
              title={trend.label}
            >
              {trend.direction === 'up' && '↑'}
              {trend.direction === 'down' && '↓'}
              {trend.direction === 'flat' && '→'}
              {trend.label ? ` ${trend.label}` : ''}
            </span>
          )}
        </div>
      )}

      {subtitle && !loading && (
        <p className="relative mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}

      <div className="relative mt-3 flex items-center justify-between border-t border-gold/10 pt-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {SOURCE_LABEL[source]}
        </span>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-gold/70 hover:text-gold focus:outline-none focus:ring-2 focus:ring-ochre dark:focus:ring-gold"
            aria-label={`Mở dashboard ${SOURCE_LABEL[source]} (mở tab mới)`}
          >
            → {SOURCE_LABEL[source]}
          </a>
        )}
      </div>
    </div>
  );
}
