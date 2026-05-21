'use client';

import * as React from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@hieu-asia/ui';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Reports to Sentry via @sentry/nextjs
    console.error('[admin/error]', error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-16 text-cream">
      <div className="mx-auto max-w-lg text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-400">500</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-cream">
          Lỗi vận hành panel
        </h1>
        <p className="mt-3 text-sm text-cream/70">
          Một query hoặc component admin gặp lỗi. Thử lại — nếu vẫn lỗi, kiểm tra console hoặc Sentry.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-cream/40">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            Thử lại
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline">
              Về Tổng quan
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
