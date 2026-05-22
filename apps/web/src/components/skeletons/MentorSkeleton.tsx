import * as React from 'react';
import { Skeleton } from '@hieu-asia/ui';

/**
 * Loading placeholder for the mentor chat page. Mirrors the chat layout:
 * header bar, message list with alternating bubbles, bottom input, and a
 * pinned-insights sidebar on lg+ screens.
 */
export function MentorSkeleton() {
  return (
    <main className="flex h-screen flex-col bg-ink-radial">
      <header className="flex items-center justify-between border-b border-gold/15 bg-card/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 lg:hidden" />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex flex-1 flex-col">
          <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
            <div className="mx-auto w-full max-w-3xl space-y-6">
              {Array.from({ length: 6 }).map((_, i) => {
                const isUser = i % 2 === 1;
                return (
                  <div
                    key={i}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <Skeleton
                      className={`h-20 rounded-lg ${isUser ? 'w-2/3' : 'w-3/4'}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl space-y-3 px-4 py-4">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-44" />
            </div>
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        </section>

        <aside className="hidden w-80 shrink-0 border-l border-gold/15 bg-card/40 p-4 lg:block">
          <Skeleton className="mb-4 h-5 w-24" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="space-y-2 rounded-md border border-gold/10 bg-card/60 p-3"
              >
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
