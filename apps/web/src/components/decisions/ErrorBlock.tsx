/**
 * ErrorBlock — friendly error UI for failed Decision Brief creation.
 *
 * Wave 60.58 T1.1 — replaces the previous "Tính năng đang nâng cấp"
 * panel that dumped the JSON payload to the user. Option 1 per founder
 * approval: friendly VN copy + Retry CTA + Telegram contact link, with
 * NO JSON payload preview anywhere.
 *
 * Uses in-app shadcn-style palette (rose border, foreground/gold/muted
 * tokens) — Wave 60.58 explicitly preserves in-app tokens and does NOT
 * adopt the Option D editorial cream/warm-dark scale here.
 */

import { AlertCircle } from 'lucide-react';
import { Button } from '@hieu-asia/ui';

export type ErrorBlockProps = {
  /** Friendly VN copy. Defaults to the founder-approved retry message. */
  message?: string;
  /** Retry handler. When omitted, the Retry button is hidden. */
  onRetry?: () => void;
  /** Founder contact link. Defaults to Telegram. */
  contactHref?: string;
};

const DEFAULT_MESSAGE =
  'Đã có lỗi xảy ra khi tạo quyết định. Hệ thống đã ghi nhận và đang kiểm tra. Bạn có thể thử lại sau ít phút.';

export function ErrorBlock({
  message = DEFAULT_MESSAGE,
  onRetry,
  contactHref = 'https://t.me/nguyenhieuisocial',
}: ErrorBlockProps) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-rose-500/40 bg-rose-900/10 p-6"
    >
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 h-5 w-5 shrink-0 text-rose-300"
          aria-hidden="true"
        />
        <div className="flex-1">
          <h3 className="font-heading text-lg font-semibold text-foreground">
            Đã có lỗi xảy ra
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {message}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {onRetry && (
              <Button type="button" onClick={onRetry}>
                Thử lại
              </Button>
            )}
            <Button asChild variant="outline">
              <a href={contactHref} target="_blank" rel="noreferrer">
                Liên hệ founder
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
