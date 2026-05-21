'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Global React Query config.
 *
 * - `staleTime` 30s: avoid re-fetch on rapid remounts (typical admin flow:
 *   click row → open detail → press Back → list refreshes from cache).
 * - `retry: 1` + `retryDelay 2s`: cold-start (Vercel serverless first hit
 *   after idle) can be 5-15s. With default `retry: 3` + exponential backoff
 *   a single bad fetch produces ~90s of "Đang tải…" then a permanent error.
 *   One retry covers the cold-start case without spinner-storm.
 * - Skip retry on AbortError / TimeoutError — request was cancelled
 *   intentionally; retrying just re-amplifies the timeout.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 1) return false;
  const name = (error as { name?: string } | undefined)?.name;
  if (name === 'AbortError' || name === 'TimeoutError') return false;
  return true;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: shouldRetry,
            retryDelay: 2_000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
