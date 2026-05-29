'use client';

import * as React from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { Alert, Button } from '@hieu-asia/ui';

/**
 * Segment error boundary for the reading flow (/reading/[id]/*).
 * Mirrors app/error.tsx. Reports to Sentry via @sentry/nextjs.
 */
export default function ReadingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('[web/reading/error]', error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <section
      role="alert"
      aria-live="assertive"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground"
    >
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-gold/80">
          Lỗi · lá số
        </p>
        <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          Không tải được lá số
        </h1>
        <Alert variant="destructive" className="text-left">
          <p className="text-sm">
            Đã có sự cố khi xử lý lá số của bạn. Bạn có thể thử lại — nếu vẫn
            lỗi, vui lòng quay về trang chủ.
          </p>
          {error.message && (
            <p className="mt-2 break-words text-xs opacity-80">
              {error.message}
            </p>
          )}
          {error.digest && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest opacity-70">
              Mã lỗi: {error.digest}
            </p>
          )}
        </Alert>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Thử lại
          </Button>
          <Button asChild size="lg" variant="outline"><Link href="/">
            Về trang chủ
          </Link></Button>
        </div>
      </div>
    </section>
  );
}
