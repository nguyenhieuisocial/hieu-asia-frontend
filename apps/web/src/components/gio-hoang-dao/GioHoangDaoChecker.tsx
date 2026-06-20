'use client';

import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  cn,
} from '@hieu-asia/ui';
import { computeGioHoangDao, nextGoodHour, type GioHoangDaoResult } from '@/lib/gio-hoang-dao';
import { getVietnamTodayISO } from '@/lib/vn-date';

function parseISO(value: string): { d: number; m: number; y: number } | null {
  const parts = value.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [y, m, d] = parts as [number, number, number];
  return { d, m, y };
}

export function GioHoangDaoChecker() {
  const [value, setValue] = React.useState('');
  const [today, setToday] = React.useState('');

  React.useEffect(() => {
    const t = getVietnamTodayISO();
    setToday(t);
    if (!value) setValue(t);
  }, [value]);

  const parsed = React.useMemo(() => parseISO(value), [value]);
  const result = React.useMemo<GioHoangDaoResult | null>(
    () => (parsed ? computeGioHoangDao(parsed.d, parsed.m, parsed.y) : null),
    [parsed],
  );

  const isToday = value !== '' && value === today;
  const next = React.useMemo(
    () => (result && isToday ? nextGoodHour(result, new Date()) : null),
    [result, isToday],
  );

  const goodCount = result ? result.hours.filter((h) => h.good).length : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tra giờ hoàng đạo trong ngày</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="ghdDate">Chọn ngày (dương lịch)</Label>
            <Input id="ghdDate" type="date" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => setValue(getVietnamTodayISO())}>
              Về hôm nay
            </Button>
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ngày{' '}
              <strong className="text-foreground">
                {result.solar.day}/{result.solar.month}/{result.solar.year}
              </strong>{' '}
              — ngày <strong className="text-foreground">{result.dayCanChi.label}</strong>. Có{' '}
              <strong className="text-foreground">{goodCount} giờ hoàng đạo</strong> (giờ tốt) trong ngày.
            </p>

            {next && (
              <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
                {next.active ? (
                  <>
                    Hiện đang trong giờ <strong>{next.hour.branch}</strong> ({next.hour.range}) —{' '}
                    <strong>giờ hoàng đạo</strong>, sao {next.hour.star}. {next.hour.note}
                  </>
                ) : (
                  <>
                    Giờ hoàng đạo kế tiếp hôm nay: <strong>{next.hour.branch}</strong> ({next.hour.range}) — sao{' '}
                    {next.hour.star}. {next.hour.note}
                  </>
                )}
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              {result.hours.map((h) => (
                <div
                  key={h.branch}
                  className={cn(
                    'rounded-lg border p-3 text-sm',
                    h.good
                      ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20'
                      : 'border-border bg-card/40',
                  )}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-foreground">
                      Giờ {h.branch} <span className="font-normal text-muted-foreground">({h.range})</span>
                    </span>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                        h.good
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-muted text-muted-foreground',
                      )}
                    >
                      {h.good ? 'Hoàng đạo · tốt' : 'Hắc đạo'}
                    </span>
                  </div>
                  <div className="mt-1 text-muted-foreground">
                    <span className="text-foreground">{h.star}</span> — {h.good ? h.note : h.meaning}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Đây là cách tra cứu theo lịch pháp truyền thống, mang tính <strong>tham khảo</strong> — không
              phải lời phán số mệnh. Người xưa thường chọn giờ hoàng đạo để xuất hành, làm lễ, khởi sự cho
              an tâm; còn việc thành hay bại vẫn do sự chuẩn bị và cái tâm khi làm.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
