'use client';

import * as React from 'react';
import { Button, Card, CardContent, Label, RadioGroup, RadioGroupItem } from '@hieu-asia/ui';

export interface QuizChoice {
  value: number;
  text: string;
}
export interface QuizQuestion {
  name: string;
  title: string;
  choices: QuizChoice[];
}
export interface QuizPage {
  name: string;
  title: string;
  elements: QuizQuestion[];
}

/**
 * Likert quiz dùng chung cho các trắc nghiệm tính cách (Big Five, DiSC).
 * Render theo từng nhóm (page), thu câu trả lời 1–5, gọi onComplete khi đủ.
 * Không phụ thuộc SurveyJS — chỉ dùng primitive RadioGroup của @hieu-asia/ui.
 */
export function PersonalityQuiz({
  pages,
  onComplete,
  ctaLabel = 'Xem kết quả →',
}: {
  pages: QuizPage[];
  onComplete: (answers: Record<string, number>) => void;
  ctaLabel?: string;
}) {
  const [answers, setAnswers] = React.useState<Record<string, number>>({});

  const allQuestions = React.useMemo(() => pages.flatMap((p) => p.elements), [pages]);
  const total = allQuestions.length;
  const answered = allQuestions.filter((q) => typeof answers[q.name] === 'number').length;
  const complete = answered === total;

  const set = (name: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [name]: Number(value) }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (complete) onComplete(answers);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="sticky top-16 z-10 rounded-md border border-gold/20 bg-card/90 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Thang điểm: 1 = Rất không đồng ý · 5 = Rất đồng ý
          </span>
          <span className="font-medium text-foreground" aria-live="polite">
            {answered}/{total}
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-300"
            style={{ width: `${total ? (answered / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {pages.map((page) => (
        <Card key={page.name} className="border-border bg-card/50">
          <CardContent className="space-y-5 p-5">
            <h3 className="font-heading text-base text-gold-700">{page.title}</h3>
            {page.elements.map((q) => (
              <fieldset key={q.name} className="space-y-2 border-t border-border/60 pt-4 first:border-0 first:pt-0">
                <legend className="text-sm text-foreground/90">{q.title}</legend>
                <RadioGroup
                  name={q.name}
                  value={answers[q.name] != null ? String(answers[q.name]) : ''}
                  onValueChange={(v) => set(q.name, v)}
                  className="mt-1 flex items-center justify-between gap-2 sm:max-w-md"
                >
                  {q.choices.map((c) => (
                    <div key={c.value} className="flex flex-col items-center gap-1">
                      <RadioGroupItem value={String(c.value)} id={`${q.name}-${c.value}`} />
                      <Label
                        htmlFor={`${q.name}-${c.value}`}
                        className="font-normal text-[11px] text-muted-foreground"
                      >
                        {c.value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </fieldset>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="sticky bottom-4 z-10">
        <Button type="submit" disabled={!complete} className="w-full shadow-lg">
          {complete ? ctaLabel : `Còn ${total - answered} câu chưa trả lời`}
        </Button>
      </div>
    </form>
  );
}
