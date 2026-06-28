'use client';

/**
 * FiveWhys — "5 lần hỏi tại sao": đào từ một quan sát bề mặt xuống gốc rễ bằng
 * cách hỏi "tại sao" liên tiếp. Dạy lý-luận nhân-quả (Bloom: Analyze) — mảng mà
 * khối đọc / trắc nghiệm / checklist chưa chạm tới.
 *
 * Tĩnh, client-side, KHÔNG gọi LLM. Mỗi tầng lộ dần (progressive reveal) để
 * người học TỰ NGHĨ câu trả lời trước khi xem. Nội dung do TRANG cung cấp,
 * grounded từ chính bài viết. Gắn nhãn sự kiện theo topicId để đo lường.
 */

import * as React from 'react';
import { Button } from '@hieu-asia/ui';
import { track } from '@/lib/analytics';

export interface WhyStep {
  /** câu hỏi "tại sao" ở tầng này. */
  question: React.ReactNode;
  /** câu trả lời "vì…" (ẩn tới khi bấm). */
  because: React.ReactNode;
}

export interface FiveWhysProps {
  /** chủ đề (vd "bat-tu") — để gắn nhãn đo lường. */
  topicId: string;
  /** quan sát bề mặt mở đầu. */
  start: React.ReactNode;
  /** chuỗi tại-sao → vì, từ bề mặt xuống gốc. */
  chain: WhyStep[];
  /** kết luận gốc rễ sau khi đào hết. */
  root: React.ReactNode;
}

export function FiveWhys({ topicId, start, chain, root }: FiveWhysProps) {
  // số câu "vì…" đã lộ (0..chain.length)
  const [revealed, setRevealed] = React.useState(0);
  const done = revealed >= chain.length;

  const reveal = (i: number) => {
    setRevealed(i + 1);
    track('learn_quiz_attempted', {
      topic: topicId,
      question_id: `why-${i + 1}`,
      kind: 'open',
    });
  };

  return (
    <div className="rounded-card-editorial border border-border bg-card/40 p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">
        5 lần hỏi tại sao
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Hỏi “tại sao” liên tiếp để đào từ hiện tượng xuống gốc rễ. Thử tự nghĩ câu trả lời trước khi
        mở từng tầng.
      </p>

      <p className="mt-4 rounded-lg border border-gold/20 bg-gold/5 p-3.5 text-sm leading-relaxed text-foreground">
        {start}
      </p>

      <ol className="mt-1 border-l border-border/70 pl-4">
        {chain.map((step, i) => {
          if (i > revealed) return null; // chưa tới tầng này
          const answered = i < revealed;
          return (
            <li key={i} className="relative pt-4">
              <span
                aria-hidden="true"
                className="absolute -left-[1.32rem] top-4 flex h-5 w-5 items-center justify-center rounded-full border border-gold/40 bg-card font-mono text-[10px] text-gold-700"
              >
                {i + 1}
              </span>
              <p className="text-sm font-medium text-foreground">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-700">
                  Tại sao?{' '}
                </span>
                {step.question}
              </p>
              {answered ? (
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground" aria-live="polite">
                  {step.because}
                </p>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2 h-7 text-xs"
                  onClick={() => reveal(i)}
                >
                  Vì… (mở tầng {i + 1})
                </Button>
              )}
            </li>
          );
        })}
      </ol>

      {done ? (
        <div className="mt-4 rounded-lg border border-gold/25 bg-gold/5 p-3.5" aria-live="polite">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">
            Gốc rễ
          </p>
          <p className="text-sm leading-relaxed text-foreground">{root}</p>
        </div>
      ) : null}
    </div>
  );
}
