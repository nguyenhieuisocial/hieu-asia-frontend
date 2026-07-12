'use client';

import * as React from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

export type StepKey =
  | 'prepare_context'
  | 'vision'
  | 'logic'
  | 'psychology'
  | 'alignment'
  | 'report';

export type StepState = 'pending' | 'running' | 'done';

export interface StepStatus {
  key: StepKey;
  label: string;
  state: StepState;
}

export interface ProcessingStepperProps {
  steps: StepStatus[];
}

function describeState(state: StepState): string {
  if (state === 'done') return 'hoàn thành';
  if (state === 'running') return 'đang chạy';
  return 'đang chờ';
}

export function ProcessingStepper({ steps }: ProcessingStepperProps) {
  const runningIdx = steps.findIndex((s) => s.state === 'running');
  const runningStep = runningIdx >= 0 ? steps[runningIdx] : undefined;
  const doneCount = steps.filter((s) => s.state === 'done').length;
  const total = steps.length;
  const liveText = runningStep
    ? `Đang bước ${runningIdx + 1} trên ${total}: ${runningStep.label}`
    : doneCount === total
      ? 'Hoàn thành phân tích'
      : `Đã hoàn thành ${doneCount} trên ${total} bước`;

  return (
    // reducedMotion="user" makes every descendant framer animation (the step
    // fades AND the infinite running-pulse in StepIndicator) honour
    // prefers-reduced-motion — the CSS `*` reset can't stop JS-driven anims. (T25)
    <MotionConfig reducedMotion="user">
      <ol className="space-y-5" aria-label="Tiến trình phân tích">
        {steps.map((step, idx) => (
          <li
            key={step.key}
            className="flex items-start gap-4"
            aria-current={step.state === 'running' ? 'step' : undefined}
            aria-label={`Bước ${idx + 1}: ${step.label}. Trạng thái: ${describeState(step.state)}`}
          >
            {/* Indicator column with vertical connector */}
            <div className="relative flex flex-col items-center" aria-hidden="true">
              <StepIndicator state={step.state} />
              {idx < steps.length - 1 && (
                <span
                  className={[
                    'mt-1 w-px flex-1 transition-colors',
                    step.state === 'done' ? 'bg-jade/50' : 'bg-gold/15',
                  ].join(' ')}
                  style={{ minHeight: 28 }}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-3 pt-1">
              <p
                className={[
                  'text-base transition-colors',
                  step.state === 'done' && 'text-foreground/80',
                  step.state === 'running' && 'font-medium text-foreground',
                  step.state === 'pending' && 'text-muted-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {step.label}
              </p>
              <AnimatePresence>
                {step.state === 'running' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-1 font-mono text-xs uppercase tracking-widest text-gold"
                    aria-hidden="true"
                  >
                    Đang xử lý
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveText}
      </p>
    </MotionConfig>
  );
}

function StepIndicator({ state }: { state: StepStatus['state'] }) {
  if (state === 'done') {
    return (
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-jade text-foreground shadow-[0_0_18px_-4px_rgba(45,95,90,0.7)]"
      >
        <Check className="h-4 w-4" strokeWidth={3} />
      </motion.span>
    );
  }
  if (state === 'running') {
    return (
      <span className="relative flex h-8 w-8 items-center justify-center">
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.05, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gold/40"
        />
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={3} />
        </span>
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-card/40">
      <span className="h-2 w-2 rounded-full bg-gold/30" />
    </span>
  );
}
