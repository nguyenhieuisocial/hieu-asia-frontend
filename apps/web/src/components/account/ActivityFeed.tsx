'use client';

/**
 * Wave 60.58 T2.1 — ActivityFeed (real-data wire: Wave 60.59.c)
 *
 * Recent activity timeline replacing the old "Hoạt động gần đây" Card on
 * the OverviewTab. Surfaces the latest reading, decision brief, and mentor
 * conversation as a unified timeline so a returning user lands on "what
 * was I doing last time?" — the core companion-product loop.
 *
 * Data sources (Wave 60.59.c):
 *   - readings   → `hieu_asia.reading_sessions` via Edge Fn `listReadings`
 *   - mentor     → `public.chat_messages` (latest per chart, RLS-scoped to
 *                  `auth.uid`) joined with `public.charts`
 *   - decisions  → localStorage `hieu:decisions:*` (no DB table yet; defer)
 *   - journal    → localStorage `readJournalEntries()` (proxy weekly review)
 *
 * Unified ORDER BY ts DESC. We resolve "latest per type" client-side because
 * the three sources live in different schemas/storages.
 */

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, FileText, MessageCircle, ChevronRight } from 'lucide-react';
import { readJournalEntries } from '@/lib/journal-storage';
import { getSupabaseAuth } from '@/lib/auth-client';
// Wave 60.59.b fix — package is `@hieu-asia/supabase` (not `-client`).
// Wrong specifier broke `pnpm --filter web build`, blocking all deploys
// after Wave 60.58 T2.1.
import { listMyReadings } from '@/lib/account-history';
import { Skeleton } from '@hieu-asia/ui';

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
 * Latest decision still comes from localStorage — no `decisions` table in
 * Supabase yet. Move to DB once a `decisions` schema lands (post-60.60).
 */
function loadDecisionsFromLocal(): FeedItem | null {
  if (typeof window === 'undefined') return null;
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
        /* ignore one bad bucket */
      }
    }
    if (!latest) return null;
    return {
      id: 'd-' + latest.id,
      kind: 'decision',
      title: latest.q.slice(0, 80),
      ts: latest.ts,
      href: `/decisions/${latest.id}`,
    };
  } catch {
    return null;
  }
}

function loadJournalFromLocal(): FeedItem | null {
  try {
    const j = readJournalEntries().slice(0, 1)[0];
    if (!j) return null;
    return {
      id: 'j-' + j.id,
      kind: 'journal',
      title: j.question.slice(0, 80),
      ts: j.createdAt,
      href: `/journal/${j.id}`,
    };
  } catch {
    return null;
  }
}

/**
 * Latest reading session (hieu_asia.reading_sessions) via the secure same-origin
 * /api/reading/list route. The server derives the user (auth uid + any claimed
 * anon id) from the verified session, so we pass no user id from the client.
 */
async function loadReadingFromDb(): Promise<FeedItem | null> {
  try {
    const sessions = await listMyReadings();
    if (!sessions.length) return null;
    // listReadings returns newest first per current Edge Fn contract, but
    // sort defensively in case that changes.
    const sorted = [...sessions].sort((a, b) =>
      a.updated_at < b.updated_at ? 1 : -1,
    );
    // Wave 60.59.b fix — `noUncheckedIndexedAccess` makes `sorted[0]`
    // possibly undefined even though we early-returned on empty array above.
    // Narrow explicitly so downstream property reads type-check.
    const top = sorted[0];
    if (!top) return null;
    const concern =
      typeof top.state_json?.birth_data?.primary_concern === 'string'
        ? top.state_json.birth_data.primary_concern
        : null;
    return {
      id: 'r-' + top.session_id,
      kind: 'reading',
      title: concern ? concern.slice(0, 80) : 'Lá số đã lập',
      ts: top.updated_at,
      href: `/reading/${top.session_id}`,
    };
  } catch {
    return null;
  }
}

/**
 * Latest mentor message across user's charts.
 *  - public.chat_messages (RLS: chart_id ∈ user's charts)
 *  - join with public.charts only to scope; we just need the latest msg row.
 */
async function loadMentorFromDb(): Promise<FeedItem | null> {
  const supabase = getSupabaseAuth();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, chart_id, content, created_at, role')
      .order('created_at', { ascending: false })
      .limit(1);
    if (error || !data || data.length === 0) return null;
    const row = data[0] as {
      id: string;
      chart_id: string | null;
      content: string;
      created_at: string | null;
      role: string;
    };
    const preview =
      typeof row.content === 'string'
        ? row.content.slice(0, 80)
        : 'Phiên trò chuyện';
    return {
      id: 'm-' + row.id,
      kind: 'mentor',
      title: preview,
      ts: row.created_at ?? new Date().toISOString(),
      href: row.chart_id ? `/reading/${row.chart_id}/mentor` : '/account/mentor',
    };
  } catch {
    return null;
  }
}

export function ActivityFeed() {
  const [items, setItems] = React.useState<FeedItem[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = getSupabaseAuth();
      let userId: string | null = null;
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          userId = data.session?.user?.id ?? null;
        } catch {
          userId = null;
        }
      }

      // Run DB fetches in parallel; localStorage scans are sync.
      const [readingItem, mentorItem] = await Promise.all([
        userId ? loadReadingFromDb() : Promise.resolve(null),
        userId ? loadMentorFromDb() : Promise.resolve(null),
      ]);
      const decisionItem = loadDecisionsFromLocal();
      const journalItem = loadJournalFromLocal();

      const merged = [readingItem, mentorItem, decisionItem, journalItem]
        .filter((x): x is FeedItem => x !== null)
        .sort((a, b) => (a.ts < b.ts ? 1 : -1));

      if (!cancelled) {
        setItems(merged);
        setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
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
          className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card/30"
        >
          <span className="sr-only">Đang tải hoạt động gần đây…</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-4">
              <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-2.5 w-28" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-4 w-4 shrink-0 rounded" />
            </div>
          ))}
        </div>
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
