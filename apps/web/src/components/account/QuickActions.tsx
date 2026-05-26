'use client';

/**
 * Wave 60.58 T2.1 — QuickActions
 *
 * Bottom action row on the /account feed dashboard. Three flows that
 * cover ~90% of returning-user intent in the companion product:
 *   - Lập lá số mới   → /onboarding/topic
 *   - Hỏi mentor      → /reading
 *   - Decision Journal → /decisions/new
 *
 * Settings (payments / privacy / affiliate / profile / chart / mentor /
 * decisions) live on hierarchical deep routes under /account/* now, linked
 * separately from the layout/nav — not from this row.
 */

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, MessageCircle, FileText } from 'lucide-react';

interface Action {
  href: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const ACTIONS: readonly Action[] = [
  {
    href: '/onboarding/topic',
    label: 'Lập lá số mới',
    hint: 'Bắt đầu một câu hỏi mới với Tử Vi',
    icon: Sparkles,
  },
  {
    href: '/reading',
    label: 'Hỏi mentor',
    hint: 'Tiếp tục cuộc trò chuyện đang dở',
    icon: MessageCircle,
  },
  {
    href: '/decisions/new',
    label: 'Decision Journal',
    hint: 'Ghi lại quyết định để soi lại sau',
    icon: FileText,
  },
];

export function QuickActions() {
  return (
    <section aria-labelledby="quick-actions-h">
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          id="quick-actions-h"
          className="font-heading text-xl text-foreground sm:text-2xl"
        >
          Bắt đầu một việc
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Hành động nhanh
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-xl border border-border bg-card/40 p-5 transition hover:border-gold/40 hover:bg-card/60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-background/60">
                <Icon className="h-4 w-4 text-gold" aria-hidden />
              </span>
              <span className="mt-3 block font-heading text-base text-foreground transition group-hover:text-gold">
                {a.label}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {a.hint}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
