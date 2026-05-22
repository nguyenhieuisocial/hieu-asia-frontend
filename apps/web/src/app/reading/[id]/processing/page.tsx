'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, CardContent, toast } from '@hieu-asia/ui';
import {
  ProcessingStepper,
  type StepKey,
  type StepStatus,
} from '@/components/processing-stepper';
import type { ReadingState } from '@/lib/api-client';
import { useReadingSession } from '@/lib/use-reading-session';

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

  const { state, error, retry } = useReadingSession(readingId);

  // Surface fetch errors via toast (once per change).
  React.useEffect(() => {
    if (!error) return;
    toast.error('Không tải được trạng thái', { description: error });
  }, [error]);

  // Navigate to report when ready.
  React.useEffect(() => {
    if (state !== 'report_ready') return;
    toast.success('Báo cáo đã sẵn sàng!');
    const t = window.setTimeout(() => {
      router.replace(`/reading/${readingId}/report`);
    }, 600);
    return () => window.clearTimeout(t);
  }, [state, readingId, router]);

  const failed = !!state && state.startsWith('error_at_');
  const errorMessage = failed
    ? `Phân tích thất bại ở bước "${state!.replace('error_at_', '')}".`
    : null;

  React.useEffect(() => {
    if (errorMessage) {
      toast.error('Phân tích thất bại', { description: errorMessage });
    }
  }, [errorMessage]);

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
        <nav aria-label="Breadcrumb" className="mx-auto mb-4 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/reading" className="hover:text-gold">Lá số của bạn</Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Phân tích</span>
        </nav>
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          Bước 4 / 4
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          Hội đồng Agent đang phân tích
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sáu chuyên gia AI đang đối chiếu ngày sinh, đường chỉ tay và tính cách của bạn.
        </p>
      </header>

      <section className="container mx-auto max-w-2xl px-5">
        <Card>
          <CardContent className="pt-8">
            {failed ? (
              <ErrorBlock
                message={
                  errorMessage ?? 'Có lỗi xảy ra trong quá trình phân tích.'
                }
                onRetry={retry}
                onBack={() =>
                  router.push(`/reading/${readingId}/survey`)
                }
              />
            ) : (
              <ProcessingStepper steps={steps} />
            )}
          </CardContent>
        </Card>

        {!failed && (
          <p className="mt-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
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
      <p className="font-heading text-lg text-foreground">Phân tích thất bại</p>
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
