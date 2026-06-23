'use client';

/**
 * AstroTickerLive — "Thiên văn hôm nay" live almanac strip.
 *
 * A horizontal, scannable strip of REAL, client-computed data (Bitget's live
 * price-ticker pattern, reframed as a traditional almanac — NOT predictions):
 *   • Can Chi của ngày hôm nay
 *   • Giờ hiện tại (hoàng đạo / hắc đạo) + sao + khung giờ
 *   • Giờ hoàng đạo kế tiếp
 *   • Số giờ hoàng đạo trong ngày (số liệu THẬT)
 *
 * Everything is computed locally from `gio-hoang-dao.ts` (deterministic almanac
 * math) — no API call, no fabricated data. Re-computes every minute so the
 * "giờ này" cell flips when the 2-hour canh-giờ boundary passes.
 *
 * SSR-safe: the "now" differs between server and client, so we compute only
 * after mount and render a fixed-height placeholder first (no hydration
 * mismatch, no layout shift).
 */

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  computeGioHoangDao,
  currentHourIndex,
  nextGoodHour,
  type GioHoangDaoResult,
  type HourInfo,
} from '@/lib/gio-hoang-dao';
import { getVietnamDateParts } from '@/lib/vn-date';

interface TickerState {
  result: GioHoangDaoResult;
  currentHour: HourInfo;
  isCurrentGood: boolean;
  next: { hour: HourInfo; active: boolean } | null;
  goodCount: number;
  dateLabel: string;
}

function compute(now: Date): TickerState | null {
  // Ngày theo lịch VN (UTC+7), KHÔNG theo đồng hồ máy khách — nếu không, người
  // dùng ở múi giờ khác sẽ thấy can-chi/giờ của NGÀY sai quanh lúc giao ngày.
  const { year: yy, month: mm, day: dd } = getVietnamDateParts(now);
  const result = computeGioHoangDao(dd, mm, yy);
  if (!result) return null;
  const idx = currentHourIndex(now);
  const currentHour = result.hours[idx]!;
  const next = nextGoodHour(result, now);
  const goodCount = result.hours.filter((h) => h.good).length;
  const dateLabel = `${String(dd).padStart(2, '0')}/${String(mm).padStart(2, '0')}`;
  return {
    result,
    currentHour,
    isCurrentGood: currentHour.good,
    next,
    goodCount,
    dateLabel,
  };
}

function Cell({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-1 px-4 py-3 sm:px-5 ${className}`}>
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function AstroTickerLive() {
  const [state, setState] = React.useState<TickerState | null>(null);

  React.useEffect(() => {
    const tick = () => setState(compute(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Lịch can chi & giờ hoàng đạo hôm nay"
      className="astro-ticker border-y border-primary/15 bg-card/60"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* min-height reserves space pre-mount to avoid layout shift */}
        <div className="flex min-h-[76px] items-stretch">
          {state === null ? (
            <div className="flex items-center gap-2 px-4 py-5 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary/50" />
              Đang xem lịch hôm nay…
            </div>
          ) : (
            <div className="grid grid-cols-2 items-stretch gap-x-2 gap-y-1 sm:flex sm:w-full sm:flex-nowrap sm:items-stretch sm:gap-0 sm:overflow-x-auto">
              {/* Live indicator + heading */}
              <div className="col-span-2 flex shrink-0 items-center gap-2 px-4 py-3 sm:col-auto sm:px-5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">
                  Thiên văn
                  <br className="hidden sm:block" /> hôm nay
                </span>
              </div>

              <span className="my-3 hidden w-px shrink-0 bg-primary/10 sm:block" />

              <Cell label={`Ngày · ${state.dateLabel}`} className="shrink-0">
                <span className="font-marketing-display text-lg leading-tight text-foreground">
                  {state.result.dayCanChi.label}
                </span>
              </Cell>

              <span className="my-3 hidden w-px shrink-0 bg-primary/10 sm:block" />

              <Cell label="Giờ này" className="shrink-0">
                <span className="flex items-baseline gap-2">
                  <span className="font-marketing-display text-lg leading-tight text-foreground">
                    {state.currentHour.canChi}
                  </span>
                  <span
                    className={`font-mono text-[11px] uppercase tracking-wide ${
                      state.isCurrentGood ? 'text-[color:var(--hanh-moc,#6B8154)]' : 'text-muted-foreground'
                    }`}
                  >
                    {state.isCurrentGood ? '● Hoàng đạo' : '○ Hắc đạo'}
                  </span>
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {state.currentHour.range} · {state.currentHour.star}
                </span>
              </Cell>

              {/* Mobile: lưới 2 cột (grid) gói gọn đủ 4 ô thông tin — divider dọc
                  chỉ hiện ở desktop (sm+). Đủ thông tin, không phải vuốt ngang. */}
              <span className="my-3 hidden w-px shrink-0 bg-primary/10 sm:block" />

              <Cell label="Giờ tốt kế tiếp" className="shrink-0">
                {state.next ? (
                  state.next.active ? (
                    <span className="font-marketing-display text-lg leading-tight text-[color:var(--hanh-moc,#6B8154)]">
                      Đang trong giờ tốt
                    </span>
                  ) : (
                    <>
                      <span className="font-marketing-display text-lg leading-tight text-foreground">
                        Giờ {state.next.hour.branch}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {state.next.hour.range} · {state.next.hour.note || state.next.hour.star}
                      </span>
                    </>
                  )
                ) : (
                  <span className="font-marketing-display text-lg leading-tight text-muted-foreground">
                    Hết giờ tốt hôm nay
                  </span>
                )}
              </Cell>

              <span className="my-3 hidden w-px shrink-0 bg-primary/10 md:block" />

              <Cell label="Hôm nay" className="shrink-0 sm:hidden md:flex">
                <span className="font-marketing-display text-lg leading-tight text-foreground">
                  {state.goodCount} giờ hoàng đạo
                </span>
              </Cell>

              {/* spacer pushes CTA right on wide screens */}
              <div className="hidden flex-1 lg:block" />

              <Link
                href="/gio-hoang-dao"
                className="group col-span-2 flex w-full shrink-0 items-center gap-1.5 self-center whitespace-nowrap px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-primary transition-colors hover:text-foreground sm:col-auto sm:ml-auto sm:w-auto sm:px-5"
              >
                Xem giờ hoàng đạo
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
