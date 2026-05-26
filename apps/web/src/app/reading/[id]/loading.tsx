/**
 * Wave 60.69 — loading.tsx for /reading/[id] route segment (vault 109 §4.2).
 *
 * Streamed by Next.js while the server component resolves
 * `await params` + redirect logic (and any nested layout fetch). Replaces the
 * previously-blank fallback with shadcn `<Skeleton>` placeholders that mirror
 * the eventual layout: tab strip + content card + meta row. Keeps CLS < 0.1
 * by reserving identical vertical rhythm.
 *
 * Uses `<div role="status" aria-busy="true">` (not `<main>`) per the same
 * landmark-no-duplicate-main rule documented in `apps/web/src/app/loading.tsx`
 * — the streamed loading fragment ships BEFORE the page's own <main>, so any
 * <main> here would duplicate the landmark in the streamed HTML.
 */

import { Skeleton } from '@hieu-asia/ui';

export default function ReadingIdLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-background pt-20"
    >
      <div className="mx-auto max-w-4xl space-y-6 px-6 py-12">
        {/* Eyebrow + title */}
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        {/* Tab strip */}
        <div className="flex gap-2 pt-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
        {/* Content card */}
        <Skeleton className="h-[280px] w-full rounded-xl" />
        {/* Secondary cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
      <span className="sr-only">Đang chuẩn bị lá số…</span>
    </div>
  );
}
