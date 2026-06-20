'use client';

/**
 * Wave 61.03 — Insight Map page
 *
 * Longitudinal view of user's readings + Mentor conversations + decisions.
 * Sub-agent crashed mid-build; this page completes the work by wiring
 * InsightTimeline (already shipped this wave) to fetched data.
 *
 * Reuses Wave 61.02 mentor-conversations helper for conversation source.
 * Readings + decisions endpoints are best-effort (graceful skip if missing).
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { InsightTimeline, type InsightItem } from '@/components/account/InsightTimeline';
import { listMentorConversations } from '@/lib/mentor-conversations';
import { listMyReadings } from '@/lib/account-history';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';

async function fetchReadings(): Promise<InsightItem[]> {
  try {
    const sessions = await listMyReadings();
    return sessions.map((x) => ({
      id: `reading-${x.session_id}`,
      kind: 'reading' as const,
      title:
        typeof x.state_json?.birth_data?.primary_concern === 'string'
          ? x.state_json.birth_data.primary_concern.slice(0, 80)
          : 'Lá số đã lập',
      ts: x.updated_at,
      href: `/reading/${x.session_id}`,
    }));
  } catch {
    return [];
  }
}

async function fetchConversations(): Promise<InsightItem[]> {
  try {
    const convs = await listMentorConversations(50);
    return convs.map((c) => ({
      id: `conversation-${c.id}`,
      kind: 'conversation' as const,
      title: c.title ?? 'Cuộc trò chuyện với Mentor',
      excerpt: c.summary ?? undefined,
      ts: c.last_message_at,
      href: c.reading_session_id
        ? `/reading/${c.reading_session_id}/mentor?conversation=${c.id}`
        : undefined,
    }));
  } catch {
    return [];
  }
}

function fetchDecisions(): InsightItem[] {
  if (typeof window === 'undefined') return [];
  const out: InsightItem[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith('hieu:decisions:') || k.endsWith(':checked')) continue;
      try {
        const raw = window.localStorage.getItem(k);
        if (!raw) continue;
        const rec = JSON.parse(raw) as { id?: string; question?: string; createdAt?: string };
        if (!rec.id || !rec.createdAt || !rec.question) continue;
        out.push({
          id: `decision-${rec.id}`,
          kind: 'decision' as const,
          title: rec.question.slice(0, 80),
          ts: rec.createdAt,
          href: `/decisions/${rec.id}`,
        });
      } catch {
        /* ignore one bad bucket */
      }
    }
  } catch {
    /* ignore */
  }
  return out;
}

export default function InsightMapPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['account', 'insights'],
    queryFn: async () => {
      const [readings, conversations] = await Promise.all([
        fetchReadings(),
        fetchConversations(),
      ]);
      const decisions = fetchDecisions();
      const merged = [...readings, ...conversations, ...decisions];
      merged.sort((a, b) => (a.ts < b.ts ? 1 : -1));
      return merged;
    },
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="pb-24 pt-16">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-10">
          <p className="font-mono text-eyebrow uppercase tracking-[0.32em] text-gold-700">
            BẢN ĐỒ NHẬN THỨC
          </p>
          <h1 className="mt-3 font-heading text-section-display font-bold tracking-tight text-foreground">
            Hành trình của bạn
          </h1>
          <p className="mt-4 text-body-large text-muted-foreground">
            Tổng hợp những lá số đã đọc, những cuộc trò chuyện với Mentor và
            các quyết định đã ghi lại — sắp xếp theo thứ tự thời gian.
          </p>
        </header>

        <InsightTimeline items={data ?? []} loading={isLoading} />
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
