'use client';

/**
 * Wave 60.58 T2.1 — PinnedInsights (real-data wire: Wave 60.59.c)
 *
 * Top 3 quotable mentor reflections — the "why come back" surface for the
 * companion product. Renders as editorial pull-quotes rather than chat
 * bubbles so the page feels like a journal, not a SaaS dashboard.
 *
 * Data source (Wave 60.59.c): `public.chat_messages` (RLS-scoped to the
 * authed user's charts), filtered to assistant messages, then heuristic
 * passes (≥ 200 chars, doesn't end in a question mark, dedup by 64-char
 * prefix). Sorted by created_at DESC, capped at 3.
 *
 * TODO Wave 60.60 (deferred): add a `pinned boolean default false` column
 * to `public.chat_messages` + a pin/unpin affordance in the mentor chat
 * UI. Once that lands the query becomes
 *   `select content, created_at from chat_messages
 *      where pinned = true order by created_at desc limit 3`
 * and the in-component heuristic below can be dropped.
 *
 * Fallback: if Supabase client is unavailable (e.g. signed-out, env-missing
 * preview build), we fall back to the original localStorage heuristic so the
 * surface still renders for anon users mid-session.
 */

import * as React from 'react';
import Link from 'next/link';
import { Quote } from 'lucide-react';
import { getSupabaseAuth } from '@/lib/auth-client';
import { Skeleton } from '@hieu-asia/ui';

interface Insight {
  id: string;
  text: string;
  ts: string;
  readingId?: string;
}

const HISTORY_PREFIX = 'hieu.mentor.history.';
const MIN_LEN = 200;
const MAX_LEN = 320;

/** Heuristic shared by DB + localStorage paths. */
function pickInsight(raw: {
  id: string;
  content: string;
  ts: string;
  readingId?: string;
}): Insight | null {
  const c = typeof raw.content === 'string' ? raw.content.trim() : '';
  if (c.length < MIN_LEN) return null;
  if (c.endsWith('?') || c.endsWith('？')) return null;
  return {
    id: raw.id,
    text: c.length > MAX_LEN ? c.slice(0, MAX_LEN).trimEnd() + '…' : c,
    ts: raw.ts,
    readingId: raw.readingId,
  };
}

function dedupAndCap(items: Insight[]): Insight[] {
  const seen = new Set<string>();
  const dedup: Insight[] = [];
  for (const it of items) {
    const key = it.text.slice(0, 64);
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(it);
  }
  dedup.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return dedup.slice(0, 3);
}

async function loadInsightsFromDb(): Promise<Insight[] | null> {
  const supabase = getSupabaseAuth();
  if (!supabase) return null;
  try {
    // RLS limits rows to chat_messages whose chart_id ∈ user's charts.
    // We pull a modest window (50) of recent assistant messages and run
    // the quotable heuristic client-side until a `pinned` column exists.
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, chart_id, content, created_at')
      .eq('role', 'assistant')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error || !data) return null;
    const picked = data
      .map((row) => {
        const r = row as {
          id: string;
          chart_id: string | null;
          content: string;
          created_at: string | null;
        };
        return pickInsight({
          id: r.id,
          content: r.content,
          ts: r.created_at ?? new Date().toISOString(),
          readingId: r.chart_id ?? undefined,
        });
      })
      .filter((x): x is Insight => x !== null);
    return dedupAndCap(picked);
  } catch {
    return null;
  }
}

function loadInsightsFromLocal(): Insight[] {
  if (typeof window === 'undefined') return [];
  const out: Insight[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(HISTORY_PREFIX)) continue;
      const readingId = k.slice(HISTORY_PREFIX.length);
      try {
        const raw = window.localStorage.getItem(k);
        if (!raw) continue;
        const arr = JSON.parse(raw) as Array<{
          role?: string;
          content?: string;
          ts?: string;
        }>;
        if (!Array.isArray(arr)) continue;
        for (const m of arr) {
          if (m?.role !== 'assistant') continue;
          const picked = pickInsight({
            id: `${readingId}-${m.ts ?? (m.content ?? '').slice(0, 16)}`,
            content: m.content ?? '',
            ts: m.ts ?? new Date().toISOString(),
            readingId,
          });
          if (picked) out.push(picked);
        }
      } catch {
        /* ignore one bad bucket */
      }
    }
  } catch {
    /* ignore */
  }
  return dedupAndCap(out);
}

export function PinnedInsights() {
  const [items, setItems] = React.useState<Insight[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromDb = await loadInsightsFromDb();
      const next = fromDb ?? loadInsightsFromLocal();
      if (!cancelled) {
        setItems(next);
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide entirely when there's nothing quotable yet — empty pinned section
  // would feel like dead chrome on an otherwise spare layout.
  if (loaded && items.length === 0) return null;

  return (
    <section aria-labelledby="pinned-insights-h">
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          id="pinned-insights-h"
          className="font-heading text-xl text-foreground sm:text-2xl"
        >
          Mentor đã nói với bạn
        </h2>
        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-muted-foreground">
          Ghim từ trò chuyện
        </span>
      </div>

      {!loaded ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="space-y-3"
        >
          <span className="sr-only">Đang tải ghim từ trò chuyện…</span>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-border bg-card/40 p-5"
            >
              <Skeleton className="absolute left-3 top-3 h-4 w-4 rounded" />
              <div className="space-y-2 pl-7">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="relative overflow-hidden rounded-xl border border-border bg-card/40 p-5"
            >
              <Quote
                className="absolute left-3 top-3 h-4 w-4 text-gold/60"
                aria-hidden
              />
              <blockquote className="pl-7 font-serif text-[15px] leading-relaxed text-foreground/90">
                {it.text}
              </blockquote>
              {it.readingId && (
                <div className="mt-3 pl-7">
                  <Link
                    href={`/reading/${it.readingId}/mentor`}
                    className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold hover:opacity-80"
                  >
                    Mở phiên trò chuyện →
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
