'use client';

/**
 * Wave 61.02 — /account/conversations
 *
 * Lists the user's saved Mentor conversations (Supabase-backed). Sorted by
 * last_message_at DESC. Each row links back into the chat with
 * `?conversation=<id>` so the chat page can hydrate from server state.
 */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { useAuth } from '@/hooks/use-auth';
import {
  listMentorConversations,
  type MentorConversation,
} from '@/lib/mentor-conversations';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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
  // Fallback when conversation isn't tied to a reading — drop the user on the
  // account mentor surface so they can still see context (Wave 61.02 keeps the
  // resume CTA reachable even when reading_session_id is null).
  return `/account/mentor?conversation=${encodeURIComponent(conv.id)}`;
}

export default function AccountConversationsPage() {
  const router = useRouter();
  const auth = useAuth();
  const [conversations, setConversations] = React.useState<MentorConversation[] | null>(null);
  const [loadingList, setLoadingList] = React.useState(true);

  React.useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.replace(
        '/signin?next=' + encodeURIComponent('/account/conversations'),
      );
    }
  }, [auth.loading, auth.user, router]);

  React.useEffect(() => {
    if (!auth.user) return;
    let cancelled = false;
    (async () => {
      setLoadingList(true);
      const list = await listMentorConversations(50);
      if (!cancelled) {
        setConversations(list);
        setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [auth.user]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative pt-16">
        <section className="mx-auto max-w-3xl px-6 pb-20 pt-10 sm:pt-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-xs text-muted-foreground"
          >
            <Link href="/account" className="hover:text-gold">
              <ArrowLeft className="mr-1 inline h-3 w-3" aria-hidden />
              Tài khoản
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Cuộc trò chuyện</span>
          </nav>

          <header className="mb-8">
            <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
              Cuộc trò chuyện với Mentor
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Lịch sử các cuộc trao đổi của bạn — chọn một để tiếp tục từ chỗ
              đã dừng.
            </p>
          </header>

          {auth.loading || loadingList || conversations === null ? (
            <ListSkeleton />
          ) : conversations.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <ConversationCard conv={conv} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ConversationCard({ conv }: { conv: MentorConversation }) {
  const title =
    conv.title?.trim() ||
    (conv.summary ? conv.summary.slice(0, 80) : 'Cuộc trò chuyện không tiêu đề');
  const preview = conv.summary?.trim();
  const href = buildResumeHref(conv);

  return (
    <article className="rounded-xl border border-border bg-card/40 p-4 transition hover:border-gold/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-heading text-sm text-foreground sm:text-base">
            {title}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {conv.message_count} tin nhắn · cập nhật {formatDate(conv.last_message_at)}
            {conv.intent ? ` · ${conv.intent}` : ''}
          </p>
        </div>
        <Link
          href={href}
          className="shrink-0 rounded-md border border-gold/40 px-3 py-1.5 text-xs text-gold-700 hover:bg-gold/10"
        >
          Tiếp tục
        </Link>
      </div>
      {preview ? (
        <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{preview}</p>
      ) : null}
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/20 p-8 text-center">
      <MessageCircle
        className="mx-auto mb-3 h-8 w-8 text-gold/70"
        aria-hidden
      />
      <p className="font-heading text-base text-foreground">
        Chưa có cuộc trò chuyện nào
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Bắt đầu hỏi Mentor ở mỗi báo cáo Tử Vi của bạn — các cuộc trao đổi sẽ
        được lưu để bạn có thể quay lại bất cứ lúc nào.
      </p>
      <Link
        href="/reading"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-gold/40 px-3 py-1.5 text-xs text-gold-700 hover:bg-gold/10"
      >
        <Sparkles className="h-3 w-3" aria-hidden />
        Đi đến báo cáo của tôi
      </Link>
    </div>
  );
}

function ListSkeleton() {
  return (
    <ul
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-3"
    >
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          aria-hidden
          className="h-24 w-full animate-pulse rounded-xl bg-card/30"
        />
      ))}
      <span className="sr-only">Đang tải danh sách cuộc trò chuyện…</span>
    </ul>
  );
}
