import * as React from 'react';
import { Skeleton } from '@hieu-asia/ui';

/**
 * Loading placeholder for the report page. Matches the 9-section card stack
 * layout (header + meta + caution banner + 9 H2 section cards).
 */
export function ReportSkeleton() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-6 flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </header>

      <div className="space-y-6">
        <div className="space-y-3 rounded-lg border border-gold/15 bg-ink/40 p-5">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <Skeleton className="h-16 w-full rounded-lg" />

        <div className="space-y-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border border-gold/15 bg-ink/40 p-5"
            >
              <Skeleton className="h-6 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-gold/15 pt-6 sm:flex-row sm:justify-between">
          <Skeleton className="h-10 w-36" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-44" />
          </div>
        </div>
      </div>
    </main>
  );
}
