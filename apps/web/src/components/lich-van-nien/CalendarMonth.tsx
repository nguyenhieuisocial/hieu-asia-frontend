'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, cn } from '@hieu-asia/ui';

export interface VanNienMonthDayDTO {
  solarDay: number;
  weekday: string;
  lunarDay: number;
  lunarMonth: number;
  isLeap: boolean;
  isHoangDao: boolean;
  isHacDao: boolean;
  dayStar: string;
  canChiDay: string;
  trucNgay: string;
}

interface Props {
  year: number;
  month: number;
  days: VanNienMonthDayDTO[];
  onSelectDay?: (day: VanNienMonthDayDTO) => void;
  selectedDay?: number;
  className?: string;
}

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function CalendarMonth({ year, month, days, onSelectDay, selectedDay, className }: Props) {
  // Build grid: figure out which weekday is day 1
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const cells: Array<VanNienMonthDayDTO | null> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (const d of days) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          Tháng {month}/{year}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium mb-2">
          {WEEKDAY_LABELS.map((w) => (
            <div key={w} className="py-1 text-foreground/70">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} className="aspect-square" />;
            const isSelected = selectedDay === cell.solarDay;
            return (
              <button
                key={cell.solarDay}
                onClick={() => onSelectDay?.(cell)}
                className={cn(
                  'aspect-square rounded-md border p-1 text-left transition-colors',
                  'hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30',
                  cell.isHoangDao && 'border-amber-300 bg-amber-50/60 dark:border-amber-700 dark:bg-amber-950/20',
                  cell.isHacDao && 'border-slate-400 bg-slate-100/60 dark:border-slate-600 dark:bg-slate-900/40',
                  !cell.isHoangDao && !cell.isHacDao && 'border-border',
                  isSelected && 'ring-2 ring-amber-500',
                )}
              >
                <div className="text-sm font-semibold">{cell.solarDay}</div>
                <div className="text-[10px] text-foreground/70 leading-tight">
                  {cell.lunarDay}/{cell.lunarMonth}
                </div>
                <div className="text-[9px] mt-0.5">
                  {cell.isHoangDao ? (
                    <span className="text-amber-700 dark:text-amber-300">Hoàng</span>
                  ) : cell.isHacDao ? (
                    <span className="text-slate-600 dark:text-slate-400">Hắc</span>
                  ) : (
                    <span className="text-foreground/50">—</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-foreground/70">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30" />
            Hoàng Đạo
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded border border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-900/40" />
            Hắc Đạo
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
