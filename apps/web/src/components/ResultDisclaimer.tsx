import * as React from 'react';
import { cn } from '@hieu-asia/ui';

interface ResultDisclaimerProps {
  /** Optional override copy. Defaults to standard tham-khảo notice. */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Reusable per-report disclaimer chip — Wave 52.1 (BUG-018 follow-up).
 *
 * Same gold/20 border + role="note" pattern as the home-page chip Agent D
 * surfaced near the hero. Use at the top of any AI-generated result surface
 * (sample report, mentor chat, full reading) so users see the limit-of-use
 * notice in-context, not only on the marketing pages.
 */
export function ResultDisclaimer({ children, className }: ResultDisclaimerProps) {
  return (
    <div
      role="note"
      className={cn('flex items-center justify-center', className)}
    >
      <p className="rounded-full border border-gold/20 bg-card/50 px-4 py-1.5 text-center text-[11px] leading-snug text-muted-foreground backdrop-blur-sm sm:text-xs">
        {children ??
          'Kết quả mang tính tham khảo — không thay thế tư vấn y tế, pháp lý hay tài chính.'}
      </p>
    </div>
  );
}
