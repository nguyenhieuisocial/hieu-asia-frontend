'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from '@hieu-asia/ui';
import {
  chatMentorStream,
  type MentorMessage,
} from '@/lib/api-client';
import {
  ChatMessageList,
  type ChatMessage,
} from '@/components/chat-message-list';
import { ChatInput } from '@/components/chat-input';
import { ChatQuickPrompts } from '@/components/chat-quick-prompts';
import {
  PinnedInsights,
  type PinnedInsight,
} from '@/components/pinned-insights';
import {
  appendMessage as appendStoredMessage,
  clearHistory,
  loadHistory,
  saveHistory,
  type StoredMessage,
} from '@/lib/mentor-history';
import { track } from '@/lib/analytics';

const QUICK_PROMPTS = [
  'Tôi nên xử lý nhân sự chống đối thế nào?',
  'Tôi có nên mở chi nhánh mới tháng này không?',
  'Điểm mù lớn nhất của tôi trong quản trị là gì?',
  'Tạo cho tôi kế hoạch 7 ngày để ổn định dòng tiền.',
];

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'mentor',
  content:
    'Chào bạn. Tôi đã đọc kỹ báo cáo của bạn. Hãy hỏi tôi bất kỳ tình huống cụ thể nào — tôi sẽ trả lời dựa trên những gì hiểu về bạn, không nói chung chung.',
  ts: Date.now(),
};

const PIN_KEY_PREFIX = 'hieu.pinned.';

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function fromStored(m: StoredMessage): ChatMessage {
  const parsed = Date.parse(m.ts);
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    ts: Number.isFinite(parsed) ? parsed : Date.now(),
    feedback: m.feedback ?? null,
    pinned: !!m.pinned,
  };
}

function toStored(m: ChatMessage): StoredMessage {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    ts: new Date(m.ts).toISOString(),
    feedback: m.feedback ?? null,
    pinned: !!m.pinned,
  };
}

function toMentorMessages(messages: ChatMessage[]): MentorMessage[] {
  return messages
    .filter((m) => m.id !== 'welcome')
    .map<MentorMessage>((m) => ({
      role: m.role === 'mentor' ? 'assistant' : 'user',
      content: m.content,
    }));
}

export default function MentorChatPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const readingId = params?.id ?? '';
  const sessionId = readingId;

  const [messages, setMessages] = React.useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = React.useState('');
  const [pinned, setPinned] = React.useState<PinnedInsight[]>([]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [streaming, setStreaming] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  // Hydrate from localStorage (history + pinned).
  React.useEffect(() => {
    if (typeof window === 'undefined' || !readingId) return;
    const stored = loadHistory(readingId);
    if (stored.length) setMessages(stored.map(fromStored));
    try {
      const raw = window.localStorage.getItem(PIN_KEY_PREFIX + readingId);
      if (raw) setPinned(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [readingId]);

  // Persist history when not actively streaming (avoid spamming localStorage
  // on every token; we flush once the stream finishes).
  React.useEffect(() => {
    if (!readingId || streaming) return;
    const toPersist = messages
      .filter((m) => m.id !== 'welcome')
      .map(toStored);
    saveHistory(readingId, toPersist);
  }, [readingId, messages, streaming]);

  // Cleanup any in-flight stream on unmount.
  React.useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  React.useEffect(() => {
    const q = search?.get('q');
    if (q) setInput(q);
  }, [search]);

  const persistPinned = React.useCallback(
    (next: PinnedInsight[]) => {
      setPinned(next);
      try {
        window.localStorage.setItem(
          PIN_KEY_PREFIX + readingId,
          JSON.stringify(next),
        );
      } catch {
        /* ignore */
      }
    },
    [readingId],
  );

  const onSend = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: text,
      ts: Date.now(),
    };
    const mentorId = makeId();
    const mentorMsg: ChatMessage = {
      id: mentorId,
      role: 'mentor',
      content: '',
      ts: Date.now(),
    };

    // Conversation that will be sent to the mentor (includes the new user
    // message but NOT the empty assistant placeholder).
    const conversation = [...messages, userMsg];
    setMessages([...conversation, mentorMsg]);
    setInput('');
    appendStoredMessage(readingId, toStored(userMsg));
    track('mentor_message_sent', { reading_id: readingId, message_count: conversation.filter(m => m.role === 'user').length, length: text.length });
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let acc = '';
    try {
      const history = toMentorMessages(conversation);
      for await (const ev of chatMentorStream(history, sessionId, ctrl.signal)) {
        if (ev.type === 'chunk') {
          acc += ev.text;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === mentorId ? { ...m, content: acc } : m,
            ),
          );
        } else if (ev.type === 'error') {
          toast.error('Mentor không phản hồi', {
            description: ev.error,
          });
          setMessages((prev) => prev.filter((m) => m.id !== mentorId));
          return;
        }
        // 'done' just signals end of stream.
      }
      if (!acc.trim()) {
        setMessages((prev) => prev.filter((m) => m.id !== mentorId));
        toast.error('Mentor không phản hồi', {
          description: 'Mentor không trả lời được, vui lòng thử lại.',
        });
        return;
      }
      appendStoredMessage(
        readingId,
        toStored({ ...mentorMsg, content: acc }),
      );
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      toast.error('Mentor không phản hồi', {
        description:
          err instanceof Error
            ? err.message
            : 'Không kết nối được Mentor. Vui lòng thử lại sau.',
      });
      setMessages((prev) => prev.filter((m) => m.id !== mentorId));
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const onFeedback = (id: string, value: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: value } : m)),
    );
  };

  const onPin = (id: string) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    const exists = pinned.some((p) => p.id === id);
    const next = exists
      ? pinned.filter((p) => p.id !== id)
      : [
          ...pinned,
          { id, content: msg.content, pinnedAt: Date.now() },
        ];
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinned: !exists } : m)),
    );
    persistPinned(next);
  };

  const onClearHistory = () => {
    if (streaming) return;
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Xóa toàn bộ lịch sử trò chuyện với mentor?')
    ) {
      return;
    }
    clearHistory(readingId);
    setMessages([WELCOME]);
    toast.success('Đã xóa lịch sử trò chuyện');
  };

  const hasHistory = messages.some((m) => m.id !== 'welcome');
  const lastMentor = [...messages].reverse().find((m) => m.role === 'mentor');
  const showTyping =
    streaming &&
    (!lastMentor || lastMentor.id === 'welcome' || lastMentor.content === '');

  return (
    <main id="main-content" className="flex h-screen flex-col bg-ink-radial">
      <header className="flex items-center justify-between border-b border-gold/15 bg-ink/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/reading/${readingId}/report`}
            aria-label="Quay lại báo cáo"
            className="text-sm text-cream/60 hover:text-gold"
          >
            <span aria-hidden="true">←</span>
          </Link>
          <div
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-purple/30 text-base"
          >
            ☯
          </div>
          <div>
            <p className="font-heading text-sm text-cream">
              Cố vấn Cuộc Đời
            </p>
            <p className="flex items-center gap-1.5 text-xs text-cream/70">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-jade-500" />
              đang trực
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasHistory && (
            <button
              type="button"
              onClick={onClearHistory}
              disabled={streaming}
              className="rounded-md border border-gold/20 px-3 py-1.5 text-xs text-cream/80 hover:border-gold hover:text-gold disabled:opacity-50"
            >
              Xóa lịch sử
            </button>
          )}
          <button
            type="button"
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label={`Mở danh sách ${pinned.length} ghim`}
            aria-expanded={drawerOpen}
            className="rounded-md border border-gold/20 px-3 py-1.5 text-xs text-cream/80 hover:border-gold hover:text-gold lg:hidden"
          >
            {pinned.length} ghim
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl">
              <ChatMessageList
                messages={messages}
                isTyping={showTyping}
                onFeedback={onFeedback}
                onPin={onPin}
              />
            </div>
          </div>
          <div className="mx-auto w-full max-w-3xl">
            <ChatQuickPrompts prompts={QUICK_PROMPTS} onPick={setInput} />
            <ChatInput
              value={input}
              onChange={setInput}
              onSend={onSend}
              disabled={streaming}
            />
          </div>
        </section>

        <div className="hidden w-80 shrink-0 lg:block">
          <PinnedInsights
            items={pinned}
            onUnpin={(id) =>
              persistPinned(pinned.filter((p) => p.id !== id))
            }
          />
        </div>

        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-ink shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <PinnedInsights
                items={pinned}
                onUnpin={(id) =>
                  persistPinned(pinned.filter((p) => p.id !== id))
                }
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
