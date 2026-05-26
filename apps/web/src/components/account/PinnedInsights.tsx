'use client';

/**
 * Wave 60.58 T2.1 — PinnedInsights
 *
 * Top 3 quotable mentor reflections — the "why come back" surface for the
 * companion product. Renders as editorial pull-quotes rather than chat
 * bubbles so the page feels like a journal, not a SaaS dashboard.
 *
 * Data: schema-less heuristic until DB pinning ships. We scan mentor
 * histories in localStorage, pick assistant messages ≥ 200 chars that
 * don't end with a question mark, dedupe by prefix, sort by recency,
 * cap at 3.
 *
 * TODO Wave 60.59: replace with
 *   `select content,ts from mentor_messages where pinned=true order by ts desc limit 3`
 * (and add a pin/unpin affordance to the mentor chat UI).
 */

import * as React from 'react';
import Link from 'next/link';
import { Quote } from 'lucide-react';

interface Insight {
  id: string;
  text: string;
  ts: string;
  readingId?: string;
}

const HISTORY_PREFIX = 'hieu.mentor.history.';
const MIN_LEN = 200;
const MAX_LEN = 320;

function loadInsights(): Insight[] {
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
          const c = typeof m.content === 'string' ? m.content.trim() : '';
          if (c.length < MIN_LEN) continue;
          // Skip messages that are mostly questions back to the user.
          if (c.endsWith('?') || c.endsWith('？')) continue;
          out.push({
            id: `${readingId}-${m.ts ?? c.slice(0, 16)}`,
            text: c.length > MAX_LEN ? c.slice(0, MAX_LEN).trimEnd() + '…' : c,
            ts: m.ts ?? new Date().toISOString(),
            readingId,
          });
        }
      } catch {
        /* ignore one bad bucket */
      }
    }
  } catch {
    /* ignore */
  }
  // Dedupe by first 64 chars
  const seen = new Set<string>();
  const dedup: Insight[] = [];
  for (const it of out) {
    const key = it.text.slice(0, 64);
    if (seen.has(key)) continue;
    seen.add(key);
    dedup.push(it);
  }
  dedup.sort((a, b) => (a.ts < b.ts ? 1 : -1));
  return dedup.slice(0, 3);
}

export function PinnedInsights() {
  const [items, setItems] = React.useState<Insight[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setItems(loadInsights());
    setLoaded(true);
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
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Ghim từ trò chuyện
        </span>
      </div>

      {!loaded ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="h-32 animate-pulse rounded-xl bg-card/30"
        />
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
                    className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold hover:opacity-80"
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
