'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, RadioGroup, RadioGroupItem } from '@hieu-asia/ui';
import { TgMainButton } from '@/components/tg-main-button';
import { TgBackButton } from '@/components/tg-back-button';
import { haptic } from '@/lib/telegram-haptic';

/**
 * Mini App survey — compact 8-question Likert.
 * (Web app uses SurveyJS — too heavy for Telegram WebView. We hand-roll here.)
 */

interface Question {
  id: string;
  text: string;
}

const QUESTIONS: Question[] = [
  { id: 'q1', text: 'Khi đưa ra quyết định lớn, tôi nghiêng về phân tích logic hơn cảm xúc.' },
  { id: 'q2', text: 'Tôi thoải mái nói "không" với người thân khi cần.' },
  { id: 'q3', text: 'Tôi thường lập kế hoạch trước khi hành động.' },
  { id: 'q4', text: 'Tôi dễ cảm thấy bồn chồn khi có việc chưa hoàn thành.' },
  { id: 'q5', text: 'Tôi tin vào trực giác khi đối diện tình huống mới.' },
  { id: 'q6', text: 'Tôi tìm năng lượng từ thời gian một mình.' },
  { id: 'q7', text: 'Tôi sẵn sàng chấp nhận rủi ro tài chính nếu cơ hội đủ lớn.' },
  { id: 'q8', text: 'Tôi thường xử lý xung đột bằng đối thoại trực tiếp.' },
];

const SCALE = ['Rất không đúng', 'Không đúng', 'Trung lập', 'Đúng', 'Rất đúng'];

export default function MiniAppSurveyPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const readingId = params.id;
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [current, setCurrent] = React.useState(0);

  const q = QUESTIONS[current]!;
  const total = QUESTIONS.length;
  const allAnswered = QUESTIONS.every((qq) => qq.id in answers);

  const onSelect = (value: number) => {
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    void haptic('select');
    // Auto-advance
    if (current < total - 1) {
      setTimeout(() => setCurrent((c) => c + 1), 180);
    }
  };

  const onSubmit = () => {
    if (!allAnswered) return;
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(`hieu.survey.${readingId}`, JSON.stringify(answers));
    }
    router.push(`/reading/${readingId}/processing`);
  };

  return (
    <main className="min-h-screen px-4 pb-32 pt-3">
      <TgBackButton onBack={() => (current > 0 ? setCurrent((c) => c - 1) : router.back())} />

      <div className="mx-auto max-w-md pt-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">Bước 4 / 4 · Khảo sát</p>
          <p className="font-mono text-xs text-cream/65">{current + 1}/{total}</p>
        </div>

        {/* Progress */}
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream/10">
          <div className="h-full bg-gold-gradient transition-all" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="text-base leading-relaxed">{q.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              name={q.id}
              value={String(answers[q.id] ?? '')}
              onValueChange={(v) => onSelect(Number(v))}
              className="grid-cols-1 gap-2"
            >
              {SCALE.map((label, i) => (
                <label
                  key={label}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-gold/15 bg-ink/40 px-3 py-3 text-sm text-cream/90 has-[:checked]:border-gold has-[:checked]:bg-gold/10"
                >
                  <RadioGroupItem value={String(i + 1)} />
                  <span>{label}</span>
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-between text-xs">
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="text-cream/60 disabled:opacity-30"
          >
            ← Trước
          </button>
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            disabled={current >= total - 1}
            className="text-cream/60 disabled:opacity-30"
          >
            Sau →
          </button>
        </div>
      </div>

      <TgMainButton
        text={allAnswered ? 'Hoàn tất khảo sát' : `Đã trả lời ${Object.keys(answers).length}/${total}`}
        onClick={onSubmit}
        disabled={!allAnswered}
      />
    </main>
  );
}
