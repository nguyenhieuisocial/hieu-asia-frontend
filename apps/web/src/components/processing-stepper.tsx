'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import type { StepStatus } from '@/lib/use-reading-progress';

export interface ProcessingStepperProps {
  steps: StepStatus[];
}

export function ProcessingStepper({ steps }: ProcessingStepperProps) {
  return (
    <ol className="space-y-5">
      {steps.map((step, idx) => (
        <li key={step.key} className="flex items-start gap-4">
          {/* Indicator column with vertical connector */}
          <div className="relative flex flex-col items-center">
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
                step.state === 'done' && 'text-cream/80',
                step.state === 'running' && 'font-medium text-cream',
                step.state === 'pending' && 'text-cream/40',
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
                >
                  Đang xử lý
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </li>
      ))}
    </ol>
  );
}

function StepIndicator({ state }: { state: StepStatus['state'] }) {
  if (state === 'done') {
    return (
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-jade text-cream shadow-[0_0_18px_-4px_rgba(45,95,90,0.7)]"
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
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-ink/40">
      <span className="h-2 w-2 rounded-full bg-gold/30" />
    </span>
  );
}
