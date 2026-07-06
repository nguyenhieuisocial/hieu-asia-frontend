'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Wave 60.58 T2.2 — Custom branded survey form replacing SurveyJS at
 * /reading/[id]/survey. SurveyJS's runtime-injected CSS was bleeding
 * foreign styling (radio/text/progress widgets) into a critical activation
 * moment before processing (R1 verdict B, DNA 3.4). Also frees ~1.2 MB
 * of bundle (survey-core + survey-react-ui) from this route.
 *
 * Step-by-step UX matches WizardFooter pattern from T1.2 — one question
 * at a time, top progress bar, gold pill submit.
 */
export type SurveyQuestion =
  | {
      id: string;
      type: 'single';
      label: string;
      choices: { value: string; label: string }[];
      required?: boolean;
    }
  | {
      id: string;
      type: 'multi';
      label: string;
      choices: { value: string; label: string }[];
      required?: boolean;
    }
  | {
      id: string;
      type: 'text';
      label: string;
      placeholder?: string;
      maxLength?: number;
      required?: boolean;
    }
  | {
      id: string;
      type: 'scale';
      label: string;
      min: number;
      max: number;
      minLabel?: string;
      maxLabel?: string;
      required?: boolean;
    };

export type SurveyAnswerValue = string | string[] | number;

export type CustomSurveyFormProps = {
  questions: SurveyQuestion[];
  onSubmit: (answers: Record<string, SurveyAnswerValue>) => void | Promise<void>;
  submitLabel?: string;
  initialAnswers?: Record<string, SurveyAnswerValue>;
};

function isAnswered(q: SurveyQuestion, value: SurveyAnswerValue | undefined): boolean {
  if (value === undefined || value === null) return false;
  if (q.type === 'multi') return Array.isArray(value) && value.length > 0;
  if (q.type === 'text') return typeof value === 'string' && value.trim().length > 0;
  if (q.type === 'single') return typeof value === 'string' && value.length > 0;
  if (q.type === 'scale') return typeof value === 'number' && !Number.isNaN(value);
  return false;
}

export function CustomSurveyForm({
  questions,
  onSubmit,
  submitLabel = 'Hoàn tất',
  initialAnswers = {},
}: CustomSurveyFormProps) {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, SurveyAnswerValue>>(initialAnswers);
  const [submitting, setSubmitting] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const current = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const currentValue = current ? answers[current.id] : undefined;
  const canAdvance = !current || !current.required || isAnswered(current, currentValue);

  const setValue = React.useCallback((id: string, value: SurveyAnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleNext = React.useCallback(() => {
    setTouched(true);
    if (!canAdvance) return;
    setTouched(false);
    setCurrentIdx((i) => Math.min(i + 1, questions.length - 1));
  }, [canAdvance, questions.length]);

  const handleBack = React.useCallback(() => {
    setTouched(false);
    setCurrentIdx((i) => Math.max(i - 1, 0));
  }, []);

  const handleSubmit = React.useCallback(async () => {
    setTouched(true);
    if (!canAdvance) return;
    setSubmitting(true);
    try {
      await onSubmit(answers);
    } finally {
      setSubmitting(false);
    }
  }, [answers, canAdvance, onSubmit]);

  return (
    <div className="flex flex-col gap-6">
      {/* Progress header */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Bước {currentIdx + 1}/{questions.length}
        </span>
        <div
          className="h-1 flex-1 overflow-hidden rounded-full bg-gold/15"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={currentIdx + 1}
          aria-label={`Câu ${currentIdx + 1} trên ${questions.length}`}
        >
          <div
            className="h-full bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      {current && (
        <div className="flex flex-col gap-4">
          <h2
            id={`q-${current.id}-label`}
            className="font-heading text-xl font-medium leading-snug text-foreground sm:text-2xl"
          >
            {current.label}
            {current.required && <span className="ml-1 text-gold">*</span>}
          </h2>

          {current.type === 'single' && (
            <SingleChoice
              question={current}
              value={typeof currentValue === 'string' ? currentValue : ''}
              onChange={(v) => setValue(current.id, v)}
            />
          )}

          {current.type === 'multi' && (
            <MultiChoice
              question={current}
              value={Array.isArray(currentValue) ? currentValue : []}
              onChange={(v) => setValue(current.id, v)}
            />
          )}

          {current.type === 'text' && (
            <TextInput
              question={current}
              value={typeof currentValue === 'string' ? currentValue : ''}
              onChange={(v) => setValue(current.id, v)}
            />
          )}

          {current.type === 'scale' && (
            <ScaleInput
              question={current}
              value={typeof currentValue === 'number' ? currentValue : undefined}
              onChange={(v) => setValue(current.id, v)}
            />
          )}

          {touched && !canAdvance && (
            <p role="alert" className="text-xs text-rose-300">
              Vui lòng chọn một đáp án trước khi tiếp tục.
            </p>
          )}
        </div>
      )}

      {/* Footer nav */}
      <div className="mt-4 flex flex-col gap-3 border-t border-gold/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIdx === 0 || submitting}
          className="inline-flex items-center gap-1.5 self-start rounded-md border border-gold/30 px-4 py-2 text-sm text-foreground transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Quay lại
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Đang gửi…' : submitLabel}
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tiếp theo
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Sub-components ----------

function SingleChoice({
  question,
  value,
  onChange,
}: {
  question: Extract<SurveyQuestion, { type: 'single' }>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-labelledby={`q-${question.id}-label`} className="flex flex-col gap-2.5">
      {question.choices.map((c) => {
        const checked = value === c.value;
        return (
          <label
            key={c.value}
            className={[
              'group flex cursor-pointer items-start gap-3 rounded-md border bg-card/60 px-4 py-3 text-sm text-foreground transition-all',
              'hover:-translate-y-px hover:border-gold/40 hover:bg-card',
              'focus-within:ring-2 focus-within:ring-gold',
              checked ? 'border-gold bg-gold/10 shadow-[0_0_0_1px_rgba(184,146,61,0.4)]' : 'border-gold/15',
            ].join(' ')}
          >
            <input
              type="radio"
              name={question.id}
              value={c.value}
              checked={checked}
              onChange={() => onChange(c.value)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={[
                'mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                checked ? 'border-gold bg-gold' : 'border-gold/30 bg-transparent',
              ].join(' ')}
            >
              {checked && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
            </span>
            <span className="leading-relaxed">{c.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function MultiChoice({
  question,
  value,
  onChange,
}: {
  question: Extract<SurveyQuestion, { type: 'multi' }>;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };
  return (
    <div
      role="group"
      aria-labelledby={`q-${question.id}-label`}
      className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
    >
      {question.choices.map((c) => {
        const checked = value.includes(c.value);
        return (
          <label
            key={c.value}
            className={[
              'flex cursor-pointer items-start gap-3 rounded-md border bg-card/60 px-3 py-2.5 text-sm text-foreground transition-all',
              'hover:border-gold/40 hover:bg-card',
              'focus-within:ring-2 focus-within:ring-gold',
              checked ? 'border-gold bg-gold/10' : 'border-gold/15',
            ].join(' ')}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(c.value)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={[
                'mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
                checked ? 'border-gold bg-gold' : 'border-gold/30 bg-transparent',
              ].join(' ')}
            >
              {checked && (
                <svg viewBox="0 0 12 12" className="h-3 w-3 text-ink" aria-hidden="true">
                  <path
                    d="M2 6.5l2.5 2.5L10 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="leading-relaxed">{c.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function TextInput({
  question,
  value,
  onChange,
}: {
  question: Extract<SurveyQuestion, { type: 'text' }>;
  value: string;
  onChange: (v: string) => void;
}) {
  const max = question.maxLength;
  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        id={`q-${question.id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        maxLength={max}
        rows={5}
        className="w-full resize-y rounded-md border border-gold/20 bg-card/60 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
      />
      {max !== undefined && (
        <span className="self-end font-mono text-[13px] text-muted-foreground">
          {value.length}/{max}
        </span>
      )}
    </div>
  );
}

function ScaleInput({
  question,
  value,
  onChange,
}: {
  question: Extract<SurveyQuestion, { type: 'scale' }>;
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const steps = React.useMemo(() => {
    const out: number[] = [];
    for (let i = question.min; i <= question.max; i++) out.push(i);
    return out;
  }, [question.min, question.max]);

  return (
    <div className="flex flex-col gap-3">
      <div
        role="radiogroup"
        aria-labelledby={`q-${question.id}-label`}
        className="flex flex-wrap items-center gap-2"
      >
        {steps.map((n) => {
          const checked = value === n;
          return (
            <label
              key={n}
              className={[
                'inline-flex h-10 min-w-[2.5rem] cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition-all',
                'hover:-translate-y-px hover:border-gold/50',
                'focus-within:ring-2 focus-within:ring-gold',
                checked
                  ? 'border-gold bg-gold text-ink shadow-[0_0_0_1px_rgba(184,146,61,0.5)]'
                  : 'border-gold/20 bg-card/60 text-foreground',
              ].join(' ')}
            >
              <input
                type="radio"
                name={question.id}
                value={n}
                checked={checked}
                onChange={() => onChange(n)}
                className="sr-only"
              />
              {n}
            </label>
          );
        })}
      </div>
      {(question.minLabel || question.maxLabel) && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{question.minLabel}</span>
          <span>{question.maxLabel}</span>
        </div>
      )}
    </div>
  );
}
