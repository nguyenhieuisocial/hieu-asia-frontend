'use client';

/**
 * Wave 61.02 — "Cuộc trò chuyện gần đây" card for /account.
 *
 * Shows the last 3 Mentor conversations as resume entry points. Renders
 * nothing when the user has none (we lean on the existing /reading CTAs in
 * QuickActions to drive first conversation creation).
 */

import * as React from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import {
  listMentorConversations,
  type MentorConversation,
} from '@/lib/mentor-conversations';

const PREVIEW_COUNT = 3;

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function buildResumeHref(conv: MentorConversation): string {
  if (conv.reading_session_id) {
    return `/reading/${encodeURIComponent(conv.reading_session_id)}/mentor?conversation=${encodeURIComponent(conv.id)}`;
  }
  return `/account/mentor?conversation=${encodeURIComponent(conv.id)}`;
}

export function RecentConversations() {
  const [conversations, setConversations] = React.useState<MentorConversation[] | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await listMentorConversations(PREVIEW_COUNT);
      if (!cancelled) {
        setConversations(list);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Render nothing until we know whether there's content — keeps CLS low
  // and avoids flashing an empty section on first paint.
  if (loading) {
    return (
      <section aria-labelledby="account-recent-conversations-h">
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="h-32 w-full animate-pulse rounded-xl bg-card/30"
        />
      </section>
    );
  }

  if (!conversations || conversations.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="account-recent-conversations-h">
      <div className="mb-4 flex items-baseline justify-between">
        <h2
          id="account-recent-conversations-h"
          className="font-heading text-base text-foreground/80 sm:text-lg"
        >
          Cuộc trò chuyện gần đây
        </h2>
        <Link
          href="/account/conversations"
          className="text-xs text-gold hover:opacity-80"
        >
          Xem tất cả →
        </Link>
      </div>
      <ul className="space-y-2">
        {conversations.map((conv) => {
          const title =
            conv.title?.trim() || conv.summary?.slice(0, 80) || 'Cuộc trò chuyện';
          const href = buildResumeHref(conv);
          return (
            <li key={conv.id}>
              <Link
                href={href}
                className="flex items-start gap-3 rounded-lg border border-border bg-card/30 px-3 py-3 transition hover:border-gold/40"
              >
                <MessageCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold/70"
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {conv.message_count} tin nhắn · {formatDate(conv.last_message_at)}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
