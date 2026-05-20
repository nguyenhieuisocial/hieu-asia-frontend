import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input } from '@hieu-asia/ui';
import { ZaloHeader } from '../../../components/zalo-header';
import { apiClient } from '../../../lib/api-bridge';

interface Msg {
  id: string;
  role: 'user' | 'mentor';
  content: string;
}

const QUICK_PROMPTS = [
  'Tôi nên xử lý nhân sự chống đối thế nào?',
  'Có nên mở chi nhánh mới tháng này không?',
  'Điểm mù lớn nhất của tôi là gì?',
];

const WELCOME: Msg = {
  id: 'welcome',
  role: 'mentor',
  content: 'Chào bạn. Tôi đã đọc báo cáo của bạn. Hãy hỏi tôi bất kỳ tình huống cụ thể nào.',
};

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function mockReply(q: string) {
  return [
    `**Câu hỏi của bạn:** ${q.slice(0, 80)}${q.length > 80 ? '…' : ''}`,
    '',
    'Gợi ý 3 bước:',
    '1. Tách vấn đề: cần xử lý trong 7 ngày vs 30 ngày.',
    '2. Trao đổi 1:1 trước khi ra quyết định công khai.',
    '3. Đặt deadline tự cam kết.',
  ].join('\n');
}

export function MentorPage() {
  const { id: readingId = '' } = useParams<{ id: string }>();
  const sessionId = readingId; // session_id = task_id trong V1
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);

  const onSend = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || pending) return;
    setInput('');
    setMessages((prev) => [...prev, { id: makeId(), role: 'user', content: value }]);
    setPending(true);
    try {
      const res = await apiClient.chatMentor(sessionId, value);
      setMessages((prev) => [...prev, { id: makeId(), role: 'mentor', content: res.answer }]);
    } catch (err) {
      console.warn('[mentor] chat fallback to mock:', err);
      setMessages((prev) => [...prev, { id: makeId(), role: 'mentor', content: mockReply(value) }]);
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="flex h-screen flex-col bg-ink-radial">
      <ZaloHeader title="Cố vấn Cuộc Đời" backTo={`/reading/${readingId}/report`} />

      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            <div
              className={
                'max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ' +
                (m.role === 'user'
                  ? 'bg-gold/15 text-cream'
                  : 'border border-gold/15 bg-ink/60 text-cream/90')
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {pending ? (
          <p className="text-xs text-cream/50">Mentor đang trả lời…</p>
        ) : null}
      </section>

      <div className="zalo-safe-bottom border-t border-gold/15 bg-ink/95 px-3 py-3">
        <div className="mb-2 flex gap-2 overflow-x-auto">
          {QUICK_PROMPTS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void onSend(q)}
              className="shrink-0 rounded-full border border-gold/20 px-3 py-1 text-[11px] text-cream/75 hover:border-gold"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi Mentor…"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void onSend();
              }
            }}
          />
          <Button disabled={pending || !input.trim()} onClick={() => void onSend()}>
            Gửi
          </Button>
        </div>
      </div>
    </main>
  );
}
