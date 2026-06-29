import * as React from 'react';
import { Card, CardContent, Skeleton } from '@hieu-asia/ui';

/**
 * Loading placeholder for the processing page (reading/[id]/processing).
 *
 * Mirrors the real {@link ProcessingStepper} layout instead of a bare spinner:
 * the same `bg-ink-radial` shell, centered header copy, a `Card` containing six
 * step rows (circular indicator + vertical connector + label line), and the
 * footer caption. Greying only the data-dependent step rows keeps zero layout
 * shift when the live stepper swaps in.
 *
 * Motion: the `Skeleton` primitive uses Tailwind `animate-pulse`; the single
 * decorative pulse-ring on the active-step placeholder is plain CSS and is
 * disabled under `prefers-reduced-motion` (also clamped globally in globals.css).
 */
export default function ProcessingLoading() {
  // Indicator variants mirror StepIndicator states in processing-stepper.tsx:
  // index 0 acts as the "running" placeholder (ringed), the rest are "pending".
  const steps = Array.from({ length: 6 });

  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="Đang khởi tạo hội đồng agent"
      className="relative min-h-screen overflow-hidden bg-ink-radial pb-24"
    >
      <header className="container mx-auto max-w-2xl px-5 py-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
          Biên tập cẩm nang
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground sm:text-4xl">
          Hội đồng Agent đang phân tích
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Đang khởi tạo quy trình — sáu chuyên gia AI sắp bắt đầu đối chiếu lá số của bạn.
        </p>
      </header>

      <section className="container mx-auto max-w-2xl px-5">
        <Card>
          <CardContent className="pt-8">
            <ol className="space-y-5" aria-hidden="true">
              {steps.map((_, idx) => {
                const isActive = idx === 0;
                const isLast = idx === steps.length - 1;
                return (
                  <li key={idx} className="flex items-start gap-4">
                    {/* Indicator column with vertical connector */}
                    <div className="relative flex flex-col items-center">
                      {isActive ? (
                        <span className="relative flex h-8 w-8 items-center justify-center">
                          <span className="absolute inset-0 rounded-full bg-gold/20 motion-safe:animate-ping motion-reduce:animate-none" />
                          <Skeleton className="relative h-8 w-8 rounded-full bg-gold/30" />
                        </span>
                      ) : (
                        <Skeleton className="h-8 w-8 rounded-full" />
                      )}
                      {!isLast && (
                        <span
                          className="mt-1 w-px flex-1 bg-gold/15"
                          style={{ minHeight: 28 }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className="flex-1 pb-3 pt-1.5">
                      <Skeleton
                        className={isActive ? 'h-4 w-3/5' : 'h-4 w-2/5'}
                      />
                      {isActive && (
                        <Skeleton className="mt-2 h-3 w-24" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <p className="mt-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Khoảng 30 – 60 giây · Vui lòng giữ trang mở
        </p>
      </section>

      <span className="sr-only" aria-live="polite">
        Đang khởi tạo quy trình phân tích, vui lòng chờ trong giây lát.
      </span>
    </main>
  );
}
