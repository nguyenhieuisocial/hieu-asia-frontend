'use client';

/**
 * Wave 61.03 — InsightTimeline
 *
 * Longitudinal vertical timeline of the user's readings + Mentor
 * conversations + decisions. Newest at the top. Pure presentational —
 * data fetching happens in /account/insights/page.tsx.
 *
 * Visual: gold vertical line connector + circular kind-icon nodes.
 * Tailwind tokens only (gold / card / border / foreground / muted-foreground).
 * Mobile-first: vertical stack with breathing space.
 */

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, MessageCircle, Scale, ChevronRight, Sparkles } from 'lucide-react';

export type InsightItemKind = 'reading' | 'conversation' | 'decision';

export interface InsightItem {
  id: string;
  kind: InsightItemKind;
  title: string;
  excerpt?: string;
  ts: string;
  href?: string;
}

const KIND_META: Record<
  InsightItemKind,
  { label: string; icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }> }
> = {
  reading: { label: 'Lá số', icon: BookOpen },
  conversation: { label: 'Mentor', icon: MessageCircle },
  decision: { label: 'Quyết định', icon: Scale },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export interface InsightTimelineProps {
  items: InsightItem[];
  loading?: boolean;
}

export function InsightTimeline({ items, loading = false }: InsightTimelineProps) {
  if (loading) {
    return (
      <ul
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="space-y-4"
      >
        {[0, 1, 2, 3].map((i) => (
          <li
            key={i}
            aria-hidden
            className="h-24 w-full animate-pulse rounded-xl bg-card/30"
          />
        ))}
        <span className="sr-only">Đang tải bản đồ nhận thức…</span>
      </ul>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/20 p-8 text-center">
        <Sparkles className="mx-auto mb-3 h-8 w-8 text-gold/70" aria-hidden />
        <p className="font-heading text-base text-foreground">
          Bạn chưa có readings/conversations.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Hành trình nhận thức của bạn sẽ hiện ở đây — mỗi lá số, mỗi cuộc trò
          chuyện, mỗi quyết định.
        </p>
        <Link
          href="/onboarding"
          className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-gold/40 px-3 py-1.5 text-xs text-gold hover:bg-gold/10"
        >
          <Sparkles className="h-3 w-3" aria-hidden />
          Lập lá số đầu tiên
        </Link>
      </div>
    );
  }

  return (
    <ol className="relative space-y-5 pl-8 sm:pl-10">
      {/* Vertical gold line connector */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-2 left-3 top-2 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent sm:left-4"
      />

      {items.map((it) => {
        const meta = KIND_META[it.kind];
        const Icon = meta.icon;
        const inner = (
          <article className="rounded-xl border border-border bg-card/40 p-4 transition hover:border-gold/40">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {meta.label} · {formatDate(it.ts)}
                </p>
                <h3 className="mt-1 truncate font-heading text-sm text-foreground sm:text-base">
                  {it.title}
                </h3>
                {it.excerpt ? (
                  <p className="mt-1.5 line-clamp-2 text-xs text-foreground/70 sm:text-sm">
                    {it.excerpt}
                  </p>
                ) : null}
              </div>
              {it.href ? (
                <ChevronRight
                  className="mt-1 h-4 w-4 shrink-0 text-foreground/40"
                  aria-hidden
                />
              ) : null}
            </div>
          </article>
        );
        return (
          <li key={it.id} className="relative">
            {/* Icon node on the gold line */}
            <span
              aria-hidden
              className="absolute -left-8 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-gold/40 bg-background sm:-left-10 sm:h-7 sm:w-7"
            >
              <Icon className="h-3 w-3 text-gold sm:h-3.5 sm:w-3.5" aria-hidden />
            </span>
            {it.href ? (
              <Link href={it.href} className="block">
                {inner}
              </Link>
            ) : (
              inner
            )}
          </li>
        );
      })}
    </ol>
  );
}
