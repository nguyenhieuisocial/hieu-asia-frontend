'use client';

/**
 * ActiveRecall — tự kiểm tra theo lối "nhớ lại chủ động" (active recall /
 * testing effect). Hai dạng câu hỏi:
 *   • open  — câu hỏi mở: người học tự nghĩ/viết, rồi bấm để xem gợi ý trả lời.
 *   • mcq   — trắc nghiệm: KHÔNG lộ đáp án tới khi người học chọn (chống đoán).
 *
 * Tất cả tĩnh, client-side, KHÔNG gọi LLM. Vị trí đáp án đúng do TRANG tự bố trí
 * khác nhau giữa các câu (đảo vị trí) — component không xáo lúc render để tránh
 * lệch hydrate. Không lưu điểm: nhớ-lại nhiều lần là điều tốt cho việc học.
 */

import * as React from 'react';
import { Button } from '@hieu-asia/ui';
import { track } from '@/lib/analytics';

export interface RecallOpen {
  id: string;
  type: 'open';
  /** câu hỏi. */
  prompt: React.ReactNode;
  /** gợi ý trả lời (ẩn tới khi bấm). */
  answer: React.ReactNode;
}

export interface RecallChoice {
  text: React.ReactNode;
  correct?: boolean;
  /** giải thích ngắn vì sao đúng/sai (hiện sau khi chọn). */
  note?: React.ReactNode;
}

export interface RecallMcq {
  id: string;
  type: 'mcq';
  prompt: React.ReactNode;
  choices: RecallChoice[];
}

export type RecallQuestion = RecallOpen | RecallMcq;

export interface ActiveRecallProps {
  /** chủ đề bài học (vd "bat-tu") — để gắn nhãn sự kiện đo lường. */
  topicId: string;
  questions: RecallQuestion[];
  /** câu dẫn (tuỳ chọn). */
  intro?: React.ReactNode;
}

export function ActiveRecall({ topicId, questions, intro }: ActiveRecallProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-muted-foreground">
        {intro ?? (
          <>
            Hãy thử trả lời <strong className="text-foreground">trong đầu (hoặc viết ra)</strong>{' '}
            trước khi xem đáp án. Tự nhớ lại khắc sâu hơn đọc lại nhiều lần — và cho bạn biết chỗ nào
            mình tưởng đã hiểu mà thật ra chưa.
          </>
        )}
      </p>

      <ol className="space-y-3">
        {questions.map((q, i) => (
          <li key={q.id}>
            {q.type === 'open' ? (
              <OpenCard q={q} index={i} topicId={topicId} />
            ) : (
              <McqCard q={q} index={i} topicId={topicId} />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function QuestionShell({
  index,
  prompt,
  children,
}: {
  index: number;
  prompt: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card-editorial border border-border bg-card/40 p-4 sm:p-5">
      <p className="flex gap-2.5 text-sm font-medium text-foreground">
        <span aria-hidden="true" className="font-mono text-xs text-gold-700">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span>{prompt}</span>
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function OpenCard({ q, index, topicId }: { q: RecallOpen; index: number; topicId: string }) {
  const [revealed, setRevealed] = React.useState(false);
  const reveal = () => {
    setRevealed(true);
    track('learn_quiz_attempted', { topic: topicId, question_id: q.id, kind: 'open' });
  };
  return (
    <QuestionShell index={index} prompt={q.prompt}>
      {revealed ? (
        <div
          className="rounded-lg border border-gold/25 bg-gold/5 p-3.5 text-sm leading-relaxed text-muted-foreground"
          aria-live="polite"
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">
            Gợi ý trả lời
          </p>
          {q.answer}
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-8 text-xs"
          onClick={reveal}
        >
          Hiện gợi ý trả lời
        </Button>
      )}
    </QuestionShell>
  );
}

function McqCard({ q, index, topicId }: { q: RecallMcq; index: number; topicId: string }) {
  const [picked, setPicked] = React.useState<number | null>(null);
  const answered = picked !== null;

  const pick = (ci: number) => {
    setPicked(ci);
    track('learn_quiz_attempted', {
      topic: topicId,
      question_id: q.id,
      kind: 'mcq',
      correct: q.choices[ci]?.correct ?? false,
    });
  };

  return (
    <QuestionShell index={index} prompt={q.prompt}>
      <div role="group" className="space-y-2">
        {q.choices.map((c, ci) => {
          const isPicked = picked === ci;
          const showAsCorrect = answered && c.correct;
          const showAsWrong = answered && isPicked && !c.correct;

          return (
            <button
              key={ci}
              type="button"
              aria-pressed={isPicked}
              disabled={answered}
              onClick={() => pick(ci)}
              className={[
                'flex w-full items-start gap-2.5 rounded-lg border p-3 text-left text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                'disabled:cursor-default',
                showAsCorrect
                  ? 'border-emerald-400/60 bg-emerald-500/10 text-foreground'
                  : showAsWrong
                    ? 'border-rose-400/60 bg-rose-500/10 text-foreground'
                    : 'border-border bg-card/40 text-muted-foreground hover:border-gold/40 hover:text-foreground',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className={[
                  'mt-0.5 font-mono text-xs',
                  showAsCorrect ? 'text-emerald-400' : showAsWrong ? 'text-rose-400' : 'text-gold-700',
                ].join(' ')}
              >
                {answered ? (c.correct ? '✓' : isPicked ? '✗' : '·') : String.fromCharCode(65 + ci)}
              </span>
              <span>{c.text}</span>
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className="mt-3 space-y-1.5 text-sm leading-relaxed" aria-live="polite">
          <p className={q.choices[picked]?.correct ? 'text-emerald-400' : 'text-rose-400'}>
            {q.choices[picked]?.correct ? 'Chính xác.' : 'Chưa đúng — xem lại nhé.'}
          </p>
          {q.choices.map((c, ci) =>
            c.note && (c.correct || ci === picked) ? (
              <p key={ci} className="text-muted-foreground">
                {c.note}
              </p>
            ) : null,
          )}
        </div>
      ) : null}
    </QuestionShell>
  );
}
