'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';

export default function MiniAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('[miniapp-telegram/error]', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12 text-cream">
      <div className="mx-auto max-w-sm text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-red-400">Lỗi</p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-cream">
          Mini App gặp sự cố
        </h1>
        <p className="mt-2 text-sm text-cream/70">
          Thử lại — nếu vẫn lỗi, mở web app trên trình duyệt để tiếp tục.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-cream/40">
            {error.digest}
          </p>
        )}
        <div className="mt-6 space-y-2">
          <Button size="lg" className="w-full" onClick={reset}>
            Thử lại
          </Button>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="w-full">
              Về dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
