'use client';

import Link from 'next/link';

/**
 * Wave 60.58 T1.2 — Shared step navigation footer for the 4-step
 * /onboarding/* wizard. Provides a step indicator (1/4 progress bar),
 * back button (optional), next button (button OR link), and optional
 * skip-optional button for the power-user fast-path on step 3.
 *
 * Used by:
 *  - /onboarding/topic     (step 1)
 *  - /onboarding/situation (step 2)
 *  - /onboarding/consent   (step 3)
 *  - /onboarding/birth     (step 4)
 */
export type WizardFooterProps = {
  currentStep: number; // 1-4
  totalSteps: number; // typically 4
  previousHref?: string; // back button
  nextLabel?: string; // default "Tiếp tục"
  onNext?: () => void; // OR href below
  nextHref?: string;
  nextDisabled?: boolean;
  showSkipOptional?: boolean; // for power-user fast-path
  onSkipOptional?: () => void;
};

export function WizardFooter({
  currentStep,
  totalSteps,
  previousHref,
  nextLabel = 'Tiếp tục',
  onNext,
  nextHref,
  nextDisabled,
  showSkipOptional,
  onSkipOptional,
}: WizardFooterProps) {
  const progressPct = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="mt-12 flex flex-col gap-4 border-t border-gold/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Bước {currentStep}/{totalSteps}
        </span>
        <div
          className="h-1 w-32 overflow-hidden rounded-full bg-gold/15"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-valuenow={currentStep}
          aria-label={`Bước ${currentStep} trên ${totalSteps}`}
        >
          <div
            className="h-full bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showSkipOptional && (
          <button
            type="button"
            onClick={onSkipOptional}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Bỏ qua tuỳ chọn
          </button>
        )}
        {previousHref && (
          <Link
            href={previousHref}
            className="rounded-md border border-gold/30 px-4 py-2 text-sm text-foreground transition-colors hover:bg-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            ← Quay lại
          </Link>
        )}
        {onNext ? (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className="rounded-md bg-gold px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {nextLabel}
          </button>
        ) : nextHref ? (
          <Link
            href={nextHref}
            aria-disabled={nextDisabled ? 'true' : undefined}
            className={[
              'rounded-md bg-gold px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              nextDisabled ? 'pointer-events-none opacity-50' : '',
            ].join(' ')}
          >
            {nextLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
