'use client';

/**
 * SurveyPrompt — generic minimal renderer for any PostHog-backed survey.
 *
 * Wave 39 W-B. Pairs with `useSurveyPrompt(surveyId, { armed, delayMs })`
 * from `@/lib/survey`. The survey question list, copy and answer types
 * are authored in the PostHog dashboard (Surveys → New) and pulled at
 * runtime — this component just renders the questions PostHog returned.
 *
 * Supports the 3 question types our 5 strategic surveys use:
 *   - rating       → 1-5 stars or 0-10 NPS (renders 0..N buttons)
 *   - open         → free-text textarea
 *   - multiple_choice → checkbox list (single + multi via `multiple` flag)
 *
 * Anything else falls back to a `<textarea>`.
 *
 * Floats bottom-right by default. Caller can override container className.
 */

import * as React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@hieu-asia/ui';
import { X } from 'lucide-react';
import {
  useSurveyPrompt,
  type UseSurveyPromptOptions,
  type PostHogSurvey,
  type SurveyQuestion,
} from '@/lib/survey';

interface PostHogChoiceQuestion extends SurveyQuestion {
  choices?: string[];
  has_open_choice?: boolean;
}

interface PostHogRatingQuestion extends SurveyQuestion {
  scale?: number;
  display?: 'number' | 'emoji';
  upper_bound_label?: string;
  lower_bound_label?: string;
}

export interface SurveyPromptProps {
  surveyId: string;
  /** When false, prompt is dormant. Default true. */
  armed?: boolean;
  /** Debounce in ms before activating. Default 0. */
  delayMs?: number;
  /** Position override. Default `'bottom-right'`. */
  position?: 'bottom-right' | 'inline';
  /** Optional class for the outer container. */
  className?: string;
}

export function SurveyPrompt({
  surveyId,
  armed = true,
  delayMs = 0,
  position = 'bottom-right',
  className,
}: SurveyPromptProps): React.ReactElement | null {
  const opts: UseSurveyPromptOptions = { armed, delayMs };
  const { survey, dismiss, sendResponse } = useSurveyPrompt(surveyId, opts);
  if (!survey) return null;

  return (
    <SurveyPromptBody
      survey={survey}
      onDismiss={dismiss}
      onSubmit={sendResponse}
      position={position}
      className={className}
    />
  );
}

interface SurveyPromptBodyProps {
  survey: PostHogSurvey;
  onDismiss: () => void;
  onSubmit: (responses: Record<string, unknown>) => void;
  position: 'bottom-right' | 'inline';
  className?: string;
}

function SurveyPromptBody({
  survey,
  onDismiss,
  onSubmit,
  position,
  className,
}: SurveyPromptBodyProps): React.ReactElement {
  const [responses, setResponses] = React.useState<Record<string, unknown>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const setAnswer = (idx: number, value: unknown) => {
    setResponses((prev) => ({ ...prev, [`$survey_response_${idx}`]: value }));
  };

  const allRequiredAnswered = survey.questions.every((q, idx) => {
    if (!q.required) return true;
    const v = responses[`$survey_response_${idx}`];
    return v !== undefined && v !== null && v !== '';
  });

  const handleSubmit = () => {
    onSubmit(responses);
    setSubmitted(true);
    // Auto-close after a brief thank-you flash.
    window.setTimeout(() => onDismiss(), 1500);
  };

  const containerClass =
    position === 'bottom-right'
      ? 'fixed bottom-4 right-4 z-50 w-[min(92vw,420px)] print:hidden'
      : 'w-full';

  return (
    <div className={className ?? containerClass} role="dialog" aria-label={survey.name}>
      <Card className="border-gold/30 bg-card/95 shadow-xl backdrop-blur">
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
          <CardTitle className="text-base text-foreground">{survey.name}</CardTitle>
          <button
            type="button"
            aria-label="Đóng khảo sát"
            onClick={onDismiss}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted/10 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {submitted ? (
            <p className="text-sm text-foreground/90">
              Cảm ơn bạn đã phản hồi. Chúng tôi sẽ đọc kỹ.
            </p>
          ) : (
            <>
              {survey.questions.map((q, idx) => (
                <SurveyQuestionField
                  key={idx}
                  index={idx}
                  question={q}
                  value={responses[`$survey_response_${idx}`]}
                  onChange={(v) => setAnswer(idx, v)}
                />
              ))}
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  Bỏ qua
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!allRequiredAnswered}
                >
                  Gửi
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SurveyQuestionField({
  index,
  question,
  value,
  onChange,
}: {
  index: number;
  question: SurveyQuestion;
  value: unknown;
  onChange: (v: unknown) => void;
}): React.ReactElement {
  const labelId = `survey-q-${index}`;
  return (
    <div className="space-y-2">
      <p id={labelId} className="text-sm font-medium text-foreground">
        {question.question}
        {question.required && <span className="ml-1 text-rose-300">*</span>}
      </p>
      {question.description && (
        <p className="text-xs text-muted-foreground">{question.description}</p>
      )}
      {renderControl(question, value, onChange, labelId)}
    </div>
  );
}

function renderControl(
  question: SurveyQuestion,
  value: unknown,
  onChange: (v: unknown) => void,
  labelId: string,
): React.ReactElement {
  switch (question.type) {
    case 'rating': {
      const q = question as PostHogRatingQuestion;
      const scale = q.scale ?? 5;
      // 0-N when scale = 10 (NPS), else 1..scale.
      const start = scale === 10 ? 0 : 1;
      const end = scale === 10 ? 10 : scale;
      const items = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      const current = typeof value === 'number' ? value : null;
      return (
        <div aria-labelledby={labelId} className="flex flex-wrap gap-1.5">
          {items.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={current === n}
              onClick={() => onChange(n)}
              className={[
                'inline-flex h-9 min-w-[36px] items-center justify-center rounded-md border px-2 text-sm transition-colors',
                current === n
                  ? 'border-gold bg-gold text-ink'
                  : 'border-border bg-card/40 text-foreground hover:border-gold/60',
              ].join(' ')}
            >
              {n}
            </button>
          ))}
        </div>
      );
    }
    case 'single_choice':
    case 'multiple_choice': {
      const q = question as PostHogChoiceQuestion;
      const choices = q.choices ?? [];
      const multi = question.type === 'multiple_choice';
      const current = Array.isArray(value) ? (value as string[]) : [];
      const single = typeof value === 'string' ? value : '';
      return (
        <div aria-labelledby={labelId} className="space-y-1.5">
          {choices.map((choice) => {
            const checked = multi ? current.includes(choice) : single === choice;
            return (
              <label
                key={choice}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card/30 px-3 py-2 text-sm text-foreground hover:border-gold/50"
              >
                <input
                  type={multi ? 'checkbox' : 'radio'}
                  checked={checked}
                  onChange={() => {
                    if (multi) {
                      const next = checked
                        ? current.filter((c) => c !== choice)
                        : [...current, choice];
                      onChange(next);
                    } else {
                      onChange(choice);
                    }
                  }}
                  className="h-4 w-4 accent-gold"
                />
                <span>{choice}</span>
              </label>
            );
          })}
        </div>
      );
    }
    case 'open':
    default:
      return (
        <textarea
          aria-labelledby={labelId}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-border bg-card/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          placeholder="Viết câu trả lời của bạn…"
        />
      );
  }
}
