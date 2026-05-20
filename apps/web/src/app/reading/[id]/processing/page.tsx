'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Button, Card, CardContent } from '@hieu-asia/ui';
import { ProcessingStepper } from '@/components/processing-stepper';
import { useReadingProgress } from '@/lib/use-reading-progress';

export default function ProcessingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const readingId = params.id;
  const sessionId = search.get('session_id');

  const { steps, status, error } = useReadingProgress({
    sessionId,
    mock: !sessionId,
    mockStepMs: 3200,
  });

  // Redirect on completion
  React.useEffect(() => {
    if (status !== 'completed') return;
    const t = window.setTimeout(() => {
      router.push(`/reading/${readingId}/report`);
    }, 900);
    return () => window.clearTimeout(t);
  }, [status, readingId, router]);

  const failed = status === 'failed';

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-radial pb-24">
      {/* Ambient backdrop */}
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
                onRetry={() => router.refresh()}
                onBack={() => router.push(`/reading/${readingId}/survey`)}
              />
            ) : (
              <ProcessingStepper steps={steps} />
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
