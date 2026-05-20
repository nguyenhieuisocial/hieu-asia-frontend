'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import {
  ProcessingStepper,
  type StepKey,
  type StepStatus,
} from '@/components/processing-stepper';
import {
  ApiClientError,
  getReading,
  type ReadingState,
} from '@/lib/api-client';

const POLL_INTERVAL_MS = 3000;

const STEP_ORDER: { key: StepKey; label: string }[] = [
  { key: 'prepare_context', label: 'Đang dựng dữ liệu nền…' },
  { key: 'vision', label: 'Đang phân tích ảnh bàn tay…' },
  { key: 'logic', label: 'Đang lập ma trận ngày sinh…' },
  { key: 'psychology', label: 'Đang đối chiếu tâm lý hành vi…' },
  { key: 'alignment', label: 'Đang đồng bộ Hội đồng Agent…' },
  { key: 'report', label: 'Đang biên tập Cẩm Nang Cuộc Đời…' },
];

/**
 * Map backend `state` → currently running step index.
 *
 * `*_pending` → that phase is running.
 * `*_done`    → that phase finished, the next one is about to start.
 */
function stateToActiveIndex(state: ReadingState): number {
  if (!state) return 0;
  if (state === 'report_ready') return STEP_ORDER.length;
  if (state.startsWith('error_at_')) {
    // Highlight whichever phase the error occurred at; don't advance past it.
    const phase = state.replace('error_at_', '');
    return Math.max(0, STEP_ORDER.findIndex((s) => s.key === phase));
  }

  const [phase, status] = state.split('_') as [string, string | undefined];
  const idx = STEP_ORDER.findIndex((s) => s.key === phase);
  if (idx === -1) return 0;
  return status === 'done' ? idx + 1 : idx;
}

function buildSteps(state: ReadingState | null): StepStatus[] {
  const activeIdx = state ? stateToActiveIndex(state) : 0;
  return STEP_ORDER.map((s, i) => ({
    ...s,
    state:
      i < activeIdx ? 'done' : i === activeIdx ? 'running' : 'pending',
  }));
}

export default function ProcessingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const readingId = params?.id ?? '';

  const [state, setState] = React.useState<ReadingState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [retryNonce, setRetryNonce] = React.useState(0);

  React.useEffect(() => {
    if (!readingId) return;
    let cancelled = false;
    let timer: number | undefined;

    const tick = async () => {
      try {
        const reading = await getReading(readingId);
        if (cancelled) return;
        const next = reading?.state ?? null;
        setState(next);
        setError(null);

        if (next === 'report_ready') {
          // Allow stepper to flush "done" frame before nav.
          window.setTimeout(() => {
            if (!cancelled) {
              router.replace(`/reading/${readingId}/report`);
            }
          }, 600);
          return;
        }

        if (next && next.startsWith('error_at_')) {
          setError(`Phân tích thất bại ở bước "${next.replace('error_at_', '')}".`);
          return;
        }

        timer = window.setTimeout(tick, POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;
        const msg =
          err instanceof ApiClientError
            ? `Không kết nối được máy chủ (${err.status}).`
            : 'Không kết nối được máy chủ.';
        setError(msg);
        timer = window.setTimeout(tick, POLL_INTERVAL_MS * 2);
      }
    };

    tick();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [readingId, router, retryNonce]);

  const failed = !!state && state.startsWith('error_at_');
  const steps = React.useMemo(() => buildSteps(state), [state]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-radial pb-24">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
      >
        <div className="absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute left-1/3 bottom-10 h-64 w-64 rounded-full bg-purple-500/30 blur-[120px]" />
      </motion.div>

      <header className="container mx-auto max-w-2xl px-5 py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          Bước 4 / 4
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-cream sm:text-4xl">
          Hội đồng Agent đang phân tích
        </h1>
        <p className="mt-3 text-sm text-cream/70">
          Sáu chuyên gia AI đang đối chiếu ngày sinh, đường chỉ tay và tính cách của bạn.
        </p>
      </header>

      <section className="container mx-auto max-w-2xl px-5">
        <Card>
          <CardContent className="pt-8">
            {failed ? (
              <ErrorBlock
                message={error ?? 'Có lỗi xảy ra trong quá trình phân tích.'}
                onRetry={() => {
                  setError(null);
                  setState(null);
                  setRetryNonce((n) => n + 1);
                }}
                onBack={() =>
                  router.push(`/reading/${readingId}/survey`)
                }
              />
            ) : (
              <>
                <ProcessingStepper steps={steps} />
                {error && (
                  <p className="mt-4 text-center text-xs text-red-300">
                    {error} — đang thử lại…
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {!failed && (
          <p className="mt-6 text-center font-mono text-xs uppercase tracking-widest text-cream/40">
            Khoảng 30 – 60 giây · Vui lòng giữ trang mở
          </p>
        )}
      </section>
    </main>
  );
}

function ErrorBlock({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5 text-center">
      <p className="font-heading text-lg text-cream">Phân tích thất bại</p>
      <p className="text-sm text-red-300">{message}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={onRetry}>Thử lại</Button>
        <Button variant="outline" onClick={onBack}>
          Quay lại khảo sát
        </Button>
      </div>
    </div>
  );
}
