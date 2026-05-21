'use client';

import * as React from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { Alert, Button } from '@hieu-asia/ui';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Surface to console for visibility. Reports to Sentry via @sentry/nextjs.
    console.error('[web/error]', error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-radial px-6 py-16 text-cream">
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold/80">
          500 · server error
        </p>
        <h1 className="font-heading text-3xl font-semibold text-cream sm:text-4xl">
          Đã có lỗi xảy ra
        </h1>
        <Alert variant="destructive" className="text-left">
          <p className="text-sm">
            Hệ thống gặp sự cố tạm thời. Bạn có thể thử lại — nếu vẫn lỗi, vui
            lòng quay về trang chủ.
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
          <Link href="/">
            <Button size="lg" variant="outline">
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
