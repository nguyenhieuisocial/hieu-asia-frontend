'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@hieu-asia/ui';
import { Send } from 'lucide-react';
import { TgBackButton } from '@/components/tg-back-button';
import { SwipeBackHandler } from '@/components/ui/SwipeBackHandler';
import { apiClient } from '@/lib/api';
import { haptic } from '@/lib/telegram-haptic';

interface ChatMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
}

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'mentor',
  content:
    'Chào bạn. Tôi đã đọc báo cáo. Hỏi tôi bất kỳ tình huống cụ thể nào — tôi sẽ trả lời sát ngữ cảnh của bạn.',
};

const QUICK = [
  'Tôi nên xử lý xung đột team thế nào?',
  'Tháng này có nên mở dự án mới?',
  'Điểm mù lớn nhất của tôi là gì?',
];

function mockReply(msg: string) {
  return `Về câu hỏi: "${msg.slice(0, 60)}${msg.length > 60 ? '…' : ''}"\n\nDựa trên báo cáo, gợi ý:\n\n1. Tách thành quyết định 7 ngày + 30 ngày.\n2. Trao đổi 1:1 trước khi public.\n3. Đặt deadline cam kết với 1 người tin cậy.`;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function MiniAppMentorPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const sessionId = params.id;

  const [messages, setMessages] = React.useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const chat = useMutation({
    mutationFn: (message: string) => apiClient.chatMentor(sessionId, message),
    onSuccess: (res) => {
      setMessages((m) => [...m, { id: makeId(), role: 'mentor', content: res.answer }]);
      void haptic('success');
    },
    onError: (_e, msg) => {
      setMessages((m) => [...m, { id: makeId(), role: 'mentor', content: mockReply(msg) }]);
      void haptic('warning');
    },
  });

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, chat.isPending]);

  const onSend = () => {
    const text = input.trim();
    if (!text || chat.isPending) return;
    setMessages((m) => [...m, { id: makeId(), role: 'user', content: text }]);
    setInput('');
    chat.mutate(text);
  };

  return (
    <main className="flex h-[100dvh] flex-col">
      <SwipeBackHandler />
      <header className="flex items-center justify-between border-b border-gold/15 bg-ink/80 px-4 py-3 backdrop-blur">
        <TgBackButton onBack={() => router.push(`/reading/${sessionId}/report`)} fallbackLabel="Báo cáo" />
        <div className="flex items-center gap-2">
          <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-purple/30 text-xs">
            ☯
          </span>
          <div>
            <p className="text-xs font-medium text-cream">Cố vấn Cuộc Đời</p>
            <p className="flex items-center gap-1 text-[10px] text-cream/55">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-jade" /> đang trực
            </p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'ml-auto bg-gold/15 text-cream'
                  : 'mr-auto bg-purple/20 text-cream/90'
              }`}
            >
              {m.content.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-1' : ''}>
                  {line || ' '}
                </p>
              ))}
            </li>
          ))}
          {chat.isPending && (
            <li className="mr-auto inline-flex items-center gap-1 rounded-2xl bg-purple/20 px-3 py-2">
              <Dot delay={0} />
              <Dot delay={150} />
              <Dot delay={300} />
            </li>
          )}
        </ul>
      </div>

      {messages.length === 1 && !chat.isPending && (
        <div className="border-t border-gold/15 px-3 py-2">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-cream/55">Gợi ý</p>
          <div className="flex flex-wrap gap-2">
            {QUICK.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setInput(p)}
                className="rounded-full border border-gold/25 bg-ink/40 px-3 py-1 text-xs text-cream/85 hover:border-gold/50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gold/15 bg-ink/90 px-3 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={1}
            placeholder="Nhập câu hỏi…"
            className="block flex-1 resize-none rounded-2xl border border-gold/20 bg-ink/40 px-3 py-2 text-sm text-cream placeholder:text-cream/45 focus:border-gold/60 focus:outline-none"
          />
          <Button
            type="button"
            size="sm"
            onClick={onSend}
            disabled={!input.trim() || chat.isPending}
            aria-label="Gửi"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cream/60"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
