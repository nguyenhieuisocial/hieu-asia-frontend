/**
 * PreparingArrival — Wave 60.95.d P1-13 (Vault 130 §3).
 *
 * Branded "moment of arrival" waiting state between successful payment and
 * report-page redirect. The 15-role Packaging Designer audit found that the
 * instant `router.push` after `status === 'paid'` felt transactional — no
 * gravitas for a 99.000₫ one-time purchase that delivers a deeply personal
 * synthesis of Tử Vi + Bát Tự + Thần Số Học + MBTI.
 *
 * This component fills that gap with ~3.5s of warm-dark editorial pause:
 *  - bg-warm-dark-50 candlelight background
 *  - centered cream-50 heading "Đang chuẩn bị báo cáo của bạn..."
 *  - gold-soft rotating ring (subtle, reduced-motion respected)
 *  - mono cream-500 subtext naming the four pillars being synthesised
 *
 * Caller responsibilities (PaymentClient.tsx):
 *  1. Fire `payment_completed` analytics BEFORE mounting this component so
 *     the event is not lost if the user closes the tab mid-wait.
 *  2. Pass `redirectTo` — the URL we navigate to once the delay elapses.
 *
 * No props are read at render time after mount: the redirect timer is
 * one-shot, set in a `useEffect` cleanup-safe block.
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export interface PreparingArrivalProps {
  /** Destination URL once the arrival pause elapses. */
  redirectTo: string;
  /** Pause duration in milliseconds. Default 3500 (within the 3-5s window). */
  delayMs?: number;
}

const DEFAULT_DELAY_MS = 3500;

export function PreparingArrival({
  redirectTo,
  delayMs = DEFAULT_DELAY_MS,
}: PreparingArrivalProps) {
  const router = useRouter();

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      router.push(redirectTo);
    }, delayMs);
    return () => window.clearTimeout(t);
  }, [router, redirectTo, delayMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Đang chuẩn bị báo cáo của bạn"
      className="flex min-h-[60vh] flex-col items-center justify-center bg-warm-dark-50 px-6 py-16 text-center"
    >
      {/* Subtle gold ring — pure CSS, motion-safe. The double-ring uses the
          gold-soft ↔ gold-dot pair so it reads as warm candlelight, not a
          generic loading spinner. */}
      <div
        aria-hidden="true"
        className="relative mb-10 h-16 w-16 motion-safe:animate-spin motion-reduce:opacity-60"
        style={{ animationDuration: '2.4s' }}
      >
        <span className="absolute inset-0 rounded-full border-2 border-warm-dark-300" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-soft border-r-gold-dot" />
      </div>

      <h1 className="font-sans text-2xl font-bold tracking-tight text-cream-50 sm:text-3xl">
        Đang chuẩn bị báo cáo của bạn
        <span
          className="text-gold-dot drop-shadow-[0_0_16px_rgba(229,198,138,0.18)]"
          aria-hidden="true"
        >
          .
        </span>
      </h1>

      <p className="mt-5 max-w-xl text-balance font-sans text-sm leading-relaxed text-cream-300 sm:text-base">
        Hệ thống đang tổng hợp{' '}
        <em className="not-italic text-gold-soft">Tử Vi</em>,{' '}
        <em className="not-italic text-gold-soft">Bát Tự</em>,{' '}
        <em className="not-italic text-gold-soft">Thần Số Học</em> và{' '}
        <em className="not-italic text-gold-soft">MBTI</em> thành một bức tranh
        dành riêng cho bạn.
      </p>

      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-cream-500">
        Bước cuối · ~3 giây
      </p>
    </div>
  );
}
