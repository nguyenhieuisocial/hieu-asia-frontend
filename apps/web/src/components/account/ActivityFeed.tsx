'use client';

/**
 * Wave 60.58 T2.1 — ActivityFeed
 *
 * Recent activity timeline replacing the old "Hoạt động gần đây" Card on
 * the OverviewTab. Surfaces the latest reading, decision brief, and mentor
 * conversation as a unified timeline so a returning user lands on "what
 * was I doing last time?" — the core companion-product loop.
 *
 * Data: cheap localStorage scan (synchronous after hydration). Wave 60.59
 * will replace with a Supabase query (readings + decisions + mentor_sessions
 * latest-per-type unified, sorted by ts DESC). Marked TODO below.
 */

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, FileText, MessageCircle, ChevronRight } from 'lucide-react';
import { readJournalEntries } from '@/lib/journal-storage';

type ItemKind = 'reading' | 'decision' | 'mentor' | 'journal';

interface FeedItem {
  id: string;
  kind: ItemKind;
  title: string;
  ts: string;
  href?: string;
}

const KIND_META: Record<
  ItemKind,
  { label: string; icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }> }
> = {
  reading: { label: 'Lá số', icon: BookOpen },
  decision: { label: 'Quyết định', icon: FileText },
  mentor: { label: 'Mentor', icon: MessageCircle },
  journal: { label: 'Nhật ký', icon: FileText },
};

function relTime(iso: string): string {
  try {
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const m = Math.round(diffMs / 60_000);
    if (m < 1) return 'vừa xong';
    if (m < 60) return `${m} phút trước`;
    const h = Math.round(m / 60);
    if (h < 24) return `${h} giờ trước`;
    const day = Math.round(h / 24);
    if (day < 30) return `${day} ngày trước`;
    return d.toLocaleDateString('vi-VN');
  } catch {
    return iso;
  }
}

/**
 * TODO Wave 60.59: replace this with a Supabase query
 *   `select * from readings,decisions,mentor_sessions order by ts desc limit 1 per type`
 * Until the unified activity view exists in DB, we derive from localStorage.
 */
function loadFeed(): FeedItem[] {
  if (typeof window === 'undefined') return [];
  const out: FeedItem[] = [];

  // Decisions
  try {
    let latest: { id: string; q: string; ts: string } | null = null;
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith('hieu:decisions:') || k.endsWith(':checked')) continue;
      try {
        const raw = window.localStorage.getItem(k);
        if (!raw) continue;
        const rec = JSON.parse(raw) as { id?: string; question?: string; createdAt?: string };
        if (!rec.id || !rec.createdAt || !rec.question) continue;
        if (!latest || rec.createdAt > latest.ts) {
          latest = { id: rec.id, q: rec.question, ts: rec.createdAt };
        }
      } catch {
        /* ignore */
      }
    }
    if (latest) {
      out.push({
        id: 'd-' + latest.id,
        kind: 'decision',
        title: latest.q.slice(0, 80),
        ts: latest.ts,
        href: `/decisions/${latest.id}`,
      });
    }
  } catch {
    /* ignore */
  }

  // Mentor sessions
  try {
    let latest: { rid: string; preview: string; ts: string } | null = null;
    const PREFIX = 'hieu.mentor.history.';
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(PREFIX)) continue;
      try {
        const raw = window.localStorage.getItem(k);
        if (!raw) continue;
        const arr = JSON.parse(raw) as Array<{ ts?: string; content?: string }>;
        if (!Array.isArray(arr) || arr.length === 0) continue;
        const last = arr[arr.length - 1];
        if (!last?.ts) continue;
        if (!latest || last.ts > latest.ts) {
          latest = {
            rid: k.slice(PREFIX.length),
            preview: typeof last.content === 'string' ? last.content.slice(0, 80) : 'Phiên trò chuyện',
            ts: last.ts,
          };
        }
      } catch {
        /* ignore */
      }
    }
    if (latest) {
      out.push({
        id: 'm-' + latest.rid,
        kind: 'mentor',
        title: latest.preview,
        ts: latest.ts,
        href: `/reading/${latest.rid}/mentor`,
      });
    }
  } catch {
    /* ignore */
  }

  // Latest journal entry as proxy for "weekly review"
  try {
    const j = readJournalEntries().slice(0, 1);
    if (j[0]) {
      out.push({
        id: 'j-' + j[0].id,
        kind: 'journal',
        title: j[0].question.slice(0, 80),
        ts: j[0].createdAt,
        href: `/journal/${j[0].id}`,
      });
    }
  } catch {
    /* ignore */
  }

  // Sort DESC by ts
  out.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return out;
}

export function ActivityFeed() {
  const [items, setItems] = React.useState<FeedItem[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setItems(loadFeed());
    setLoaded(true);
  }, []);

  return (
    <section aria-labelledby="activity-feed-h">
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          id="activity-feed-h"
          className="font-heading text-xl text-foreground sm:text-2xl"
        >
          Bạn vừa làm gì?
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Hoạt động gần đây
        </span>
      </div>

      {!loaded ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="h-32 animate-pulse rounded-xl bg-card/30"
        />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/30 p-6 text-sm text-muted-foreground">
          Chưa có hoạt động. Hãy{' '}
          <Link href="/onboarding/topic" className="text-gold underline underline-offset-4">
            lập lá số
          </Link>{' '}
          hoặc{' '}
          <Link href="/decisions/new" className="text-gold underline underline-offset-4">
            tạo decision brief
          </Link>{' '}
          để bắt đầu.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card/30">
          {items.map((it) => {
            const meta = KIND_META[it.kind];
            const Icon = meta.icon;
            const inner = (
              <>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/60">
                  <Icon className="h-4 w-4 text-gold" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    {meta.label} · {relTime(it.ts)}
                  </span>
                  <span className="mt-0.5 block truncate text-sm text-foreground/90">
                    {it.title}
                  </span>
                </span>
                {it.href && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-foreground/40" aria-hidden />
                )}
              </>
            );
            return (
              <li key={it.id}>
                {it.href ? (
                  <Link
                    href={it.href}
                    className="flex items-center gap-3 px-4 py-4 transition hover:bg-card/50 hover:text-gold"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-4">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
