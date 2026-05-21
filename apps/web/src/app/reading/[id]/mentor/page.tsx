'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@hieu-asia/ui';
import {
  ApiClientError,
  chatMentor,
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

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const PIN_KEY_PREFIX = 'hieu.pinned.';
const HISTORY_KEY_PREFIX = 'hieu.chat.';

function loadHistory(readingId: string): ChatMessage[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(HISTORY_KEY_PREFIX + readingId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

function persistHistory(readingId: string, messages: ChatMessage[]) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      HISTORY_KEY_PREFIX + readingId,
      JSON.stringify(messages),
    );
  } catch {
    /* ignore quota */
  }
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

  // Hydrate from sessionStorage (chat history) + localStorage (pinned).
  React.useEffect(() => {
    if (typeof window === 'undefined' || !readingId) return;
    const history = loadHistory(readingId);
    if (history) setMessages(history);
    try {
      const raw = window.localStorage.getItem(PIN_KEY_PREFIX + readingId);
      if (raw) setPinned(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [readingId]);

  // Persist chat history whenever it changes.
  React.useEffect(() => {
    if (!readingId) return;
    persistHistory(readingId, messages);
  }, [readingId, messages]);

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

  const chatMutation = useMutation({
    mutationFn: async (vars: {
      history: ChatMessage[];
      userText: string;
    }) => {
      const history = [
        ...toMentorMessages(vars.history),
        { role: 'user' as const, content: vars.userText },
      ];
      const res = await chatMentor(history, sessionId);
      const answer = res.response?.trim();
      if (!answer) {
        throw new ApiClientError(
          502,
          res,
          'Mentor không trả lời được, vui lòng thử lại.',
        );
      }
      return answer;
    },
    onSuccess: (answer) => {
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'mentor',
          content: answer,
          ts: Date.now(),
        },
      ]);
    },
    onError: (err) => {
      const msg =
        err instanceof ApiClientError
          ? err.message
          : 'Không kết nối được Mentor. Vui lòng thử lại sau.';
      toast.error('Mentor không phản hồi', { description: msg });
    },
  });

  const onSend = () => {
    const text = input.trim();
    if (!text || chatMutation.isPending) return;
    const next: ChatMessage[] = [
      ...messages,
      { id: makeId(), role: 'user', content: text, ts: Date.now() },
    ];
    setMessages(next);
    setInput('');
    chatMutation.mutate({ history: messages, userText: text });
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
          {
            id,
            content: msg.content,
            pinnedAt: Date.now(),
          },
        ];
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinned: !exists } : m)),
    );
    persistPinned(next);
  };

  return (
    <main className="flex h-screen flex-col bg-ink-radial">
      <header className="flex items-center justify-between border-b border-gold/15 bg-ink/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/reading/${readingId}/report`}
            className="text-sm text-cream/60 hover:text-gold"
          >
            ←
          </Link>
          <div
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-purple/30 text-base"
          >
            ☯
          </div>
          <div>
            <p className="font-heading text-sm text-cream">
              Cố vấn Cuộc Đời
            </p>
            <p className="flex items-center gap-1.5 text-xs text-cream/50">
              <span className="inline-block h-2 w-2 rounded-full bg-jade-500" />
              đang trực
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          className="rounded-md border border-gold/20 px-3 py-1.5 text-xs text-cream/80 hover:border-gold hover:text-gold lg:hidden"
        >
          {pinned.length} ghim
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-3xl">
              <ChatMessageList
                messages={messages}
                isTyping={chatMutation.isPending}
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
              disabled={chatMutation.isPending}
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
