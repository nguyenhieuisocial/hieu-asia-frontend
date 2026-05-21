import * as React from 'react';
import { Skeleton } from '@hieu-asia/ui';

/**
 * Loading placeholder for the dashboard. Mirrors the KPI grid + chart +
 * recent-activity list pattern used by the dashboard sections.
 */
export function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-ink-radial">
      <div className="container mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-40" />
          </div>
        </header>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-gold/15 pb-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-32" />
          ))}
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border border-gold/15 bg-ink/40 p-5"
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        <Skeleton className="mb-6 h-64 w-full rounded-lg" />

        <div className="space-y-3 rounded-lg border border-gold/15 bg-ink/40 p-5">
          <Skeleton className="mb-2 h-5 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gold/10 py-3 last:border-b-0"
            >
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
