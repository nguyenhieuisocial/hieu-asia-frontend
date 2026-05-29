'use client';

import * as React from 'react';
import { Card, CardContent, CardTitle, cn } from '@hieu-asia/ui';

export interface VanNienDayDTO {
  solarDate: {
    year: number;
    month: number;
    day: number;
    weekday: string;
    iso: string;
  };
  lunarDate: {
    year: number;
    month: number;
    day: number;
    isLeap: boolean;
    chineseMonthName: string;
    chineseDayName: string;
  };
  canChi: { year: string; month: string; day: string };
  trucNgay: string;
  isHoangDao: boolean;
  isHacDao: boolean;
  hoangDaoLevel: string;
  hacDaoLevel: string;
  dayStar: string;
  starsToday: string[];
  badStarsToday: string[];
  zodiacGoodAge: string[];
  zodiacBadAge: string[];
  hours: Array<{
    name: string;
    canChi: string;
    type: 'hoang_dao' | 'hac_dao';
    star: string;
    suggestions: string[];
  }>;
  suggestedActivities: string[];
  avoidActivities: string[];
  warningTamTai?: string;
  warningKimLau?: string;
  warningHoangOc?: string;
  meaningSummary: string;
}

interface Props {
  day: VanNienDayDTO;
  className?: string;
}

export function DayCard({ day, className }: Props) {
  const banner = day.isHoangDao
    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
    : day.isHacDao
    ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white'
    : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white';

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className={cn('px-6 py-4', banner)}>
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <div className="text-sm opacity-90">{day.solarDate.weekday}</div>
            <div className="text-3xl font-bold">
              {day.solarDate.day}/{day.solarDate.month}/{day.solarDate.year}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Âm lịch</div>
            <div className="text-xl font-semibold">
              {day.lunarDate.chineseDayName}, {day.lunarDate.chineseMonthName}
              {day.lunarDate.isLeap ? ' (nhuận)' : ''}
            </div>
          </div>
        </div>
        <div className="mt-3 inline-flex w-fit max-w-full shrink-0 self-start whitespace-nowrap rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur">
          {day.isHoangDao
            ? `Hoàng Đạo — ${day.hoangDaoLevel}`
            : day.isHacDao
            ? `Hắc Đạo — ${day.hacDaoLevel}`
            : `Sao ${day.dayStar}`}
          {' · '} Trực {day.trucNgay}
        </div>
      </div>

      <CardContent className="space-y-4 pt-4">
        <p className="text-base leading-relaxed">{day.meaningSummary}</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
          <CanChiCell label="Năm" value={day.canChi.year} />
          <CanChiCell label="Tháng" value={day.canChi.month} />
          <CanChiCell label="Ngày" value={day.canChi.day} />
          <CanChiCell label="Trực" value={day.trucNgay} />
        </div>

        {(day.warningTamTai || day.warningKimLau || day.warningHoangOc) && (
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm space-y-1 dark:border-amber-700 dark:bg-amber-950/30">
            <div className="font-medium text-amber-800 dark:text-amber-200">Cảnh báo theo tuổi</div>
            {day.warningTamTai && <div>• {day.warningTamTai}</div>}
            {day.warningKimLau && <div>• {day.warningKimLau}</div>}
            {day.warningHoangOc && <div>• {day.warningHoangOc}</div>}
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <StarList title="Sao tốt" tone="good" items={day.starsToday} />
          <StarList title="Sao xấu" tone="bad" items={day.badStarsToday} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <ActivityList title="Nên làm" tone="good" items={day.suggestedActivities} />
          <ActivityList title="Kiêng kỵ" tone="bad" items={day.avoidActivities} />
        </div>

        <div className="grid gap-3 md:grid-cols-2 text-sm">
          <div>
            <div className="font-medium text-emerald-700 dark:text-emerald-300">Tuổi hợp</div>
            <div className="text-foreground/80">{day.zodiacGoodAge.join(', ') || '—'}</div>
          </div>
          <div>
            <div className="font-medium text-rose-700 dark:text-rose-300">Tuổi xung</div>
            <div className="text-foreground/80">{day.zodiacBadAge.join(', ') || '—'}</div>
          </div>
        </div>

        <div>
          <CardTitle className="mb-2 text-base">12 đôi giờ trong ngày</CardTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {day.hours.map((h) => (
              <div
                key={h.name}
                className={cn(
                  'rounded-md border p-2 text-xs',
                  h.type === 'hoang_dao'
                    ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30'
                    : 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/40',
                )}
              >
                <div className="font-semibold">{h.name}</div>
                <div className="opacity-80">{h.canChi}</div>
                <div className="mt-1 text-[11px]">
                  {h.type === 'hoang_dao' ? '✦ Hoàng đạo' : '○ Hắc đạo'} — {h.star}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CanChiCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-2">
      <div className="text-xs text-foreground/60">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function StarList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: 'good' | 'bad';
  items: string[];
}) {
  return (
    <div>
      <div
        className={cn(
          'mb-1 text-sm font-medium',
          tone === 'good' ? 'text-amber-700 dark:text-amber-300' : 'text-rose-700 dark:text-rose-300',
        )}
      >
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-xs text-foreground/60">—</span>
        ) : (
          items.map((s) => (
            <span
              key={s}
              className={cn(
                'rounded-full border px-2 py-0.5 text-xs',
                tone === 'good'
                  ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200'
                  : 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200',
              )}
            >
              {s}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function ActivityList({
  title,
  tone,
  items,
}: {
  title: string;
  tone: 'good' | 'bad';
  items: string[];
}) {
  return (
    <div>
      <div
        className={cn(
          'mb-1 text-sm font-medium',
          tone === 'good' ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300',
        )}
      >
        {title}
      </div>
      <ul className="text-sm space-y-0.5">
        {items.length === 0 ? (
          <li className="text-foreground/60">—</li>
        ) : (
          items.map((a) => (
            <li key={a}>
              {tone === 'good' ? '✓' : '✗'} {a}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
