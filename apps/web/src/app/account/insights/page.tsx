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

interface ReadingsResponse {
  readings?: Array<{ id: string; title?: string; created_at: string }>;
}

interface DecisionsResponse {
  decisions?: Array<{ id: string; title?: string; summary?: string; created_at: string }>;
}

async function fetchReadings(): Promise<InsightItem[]> {
  try {
    const r = await fetch('/api/account/readings');
    if (!r.ok) return [];
    const data = (await r.json()) as ReadingsResponse;
    return (data.readings ?? []).map((x) => ({
      id: `reading-${x.id}`,
      kind: 'reading' as const,
      title: x.title ?? 'Báo cáo Tử Vi',
      ts: x.created_at,
      href: `/reading/${x.id}`,
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

async function fetchDecisions(): Promise<InsightItem[]> {
  try {
    const r = await fetch('/api/account/decisions');
    if (!r.ok) return [];
    const data = (await r.json()) as DecisionsResponse;
    return (data.decisions ?? []).map((x) => ({
      id: `decision-${x.id}`,
      kind: 'decision' as const,
      title: x.title ?? 'Quyết định',
      excerpt: x.summary,
      ts: x.created_at,
      href: `/decisions/${x.id}`,
    }));
  } catch {
    return [];
  }
}

export default function InsightMapPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['account', 'insights'],
    queryFn: async () => {
      const [readings, conversations, decisions] = await Promise.all([
        fetchReadings(),
        fetchConversations(),
        fetchDecisions(),
      ]);
      const merged = [...readings, ...conversations, ...decisions];
      merged.sort((a, b) => (a.ts < b.ts ? 1 : -1));
      return merged;
    },
    staleTime: 60_000,
  });

  return (
    <main id="main-content" className="min-h-screen bg-background pb-24 pt-16">
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
  );
}
