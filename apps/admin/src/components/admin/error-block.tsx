/**
 * ErrorBlock — shared error UI for admin pages.
 *
 * Wave 60.62.T1.1 — consolidates 30+ ad-hoc
 *   <div className="border-red-400/40 bg-red-500/10 ..."> ... </div>
 * patterns scattered across admin pages into a single brand-correct block
 * with a standardized Retry CTA.
 *
 * Adapted from `apps/web/src/components/decisions/ErrorBlock.tsx` (Wave
 * 60.58 T1.1). Kept local to admin to avoid cross-app coupling — admin
 * and web do not share a UI workspace package beyond `@hieu-asia/ui`.
 *
 * Visual stays brand-correct (in-app shadcn-style rose/foreground tokens).
 * NOT the Option D editorial cream/warm-dark scale.
 */

import { AlertCircle } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

export type ErrorBlockProps = {
  /** Optional heading override. Defaults to "Đã có lỗi xảy ra". */
  title?: string;
  /** Friendly VN copy describing the error. */
  message?: string;
  /** Retry handler. When omitted, the Retry button is hidden. */
  onRetry?: () => void;
  /**
   * Compact variant — shorter padding, no contact CTA, no icon container
   * spacing. Use for inline error rendering inside cards / tables where
   * a full panel would be visually overweight.
   */
  compact?: boolean;
};

const DEFAULT_TITLE = 'Đã có lỗi xảy ra';
const DEFAULT_MESSAGE =
  'Hệ thống không tải được dữ liệu. Bạn có thể thử lại — nếu vẫn lỗi, kiểm tra worker/backend.';

export function ErrorBlock({
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
  onRetry,
  compact = false,
}: ErrorBlockProps) {
  if (compact) {
    return (
      <div
        role="alert"
        className="flex items-start gap-2 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200"
      >
        <AlertCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-300"
          aria-hidden="true"
        />
        <div className="flex-1">
          <p>{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-1 text-xs font-semibold text-red-700 dark:text-red-100 underline hover:text-red-800 dark:hover:text-red-50"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-400/40 bg-red-500/10 p-6"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-red-700 dark:text-red-300"
          aria-hidden="true"
        />
        <div className="flex-1">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {message}
          </p>
          {onRetry && (
            <div className="mt-4">
              <Button type="button" onClick={onRetry}>
                Thử lại
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
