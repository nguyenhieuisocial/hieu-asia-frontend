'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Skeleton } from '@hieu-asia/ui';
import { DayCard, type VanNienDayDTO } from '@/components/lich-van-nien/DayCard';
import {
  CalendarMonth,
  type VanNienMonthDayDTO,
} from '@/components/lich-van-nien/CalendarMonth';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { safeJson } from '@/lib/safe-json';
import { getVietnamDateParts } from '@/lib/vn-date';

function getApiBase(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'https://api.hieu.asia';
}

function todayParts() {
  return getVietnamDateParts();
}

export default function TodayPage() {
  const t = todayParts();
  const [year, setYear] = React.useState(t.year);
  const [month, setMonth] = React.useState(t.month);
  const [day, setDay] = React.useState(t.day);
  const [birthYear, setBirthYear] = React.useState('');
  const [dayInfo, setDayInfo] = React.useState<VanNienDayDTO | null>(null);
  const [monthDays, setMonthDays] = React.useState<VanNienMonthDayDTO[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch single day
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      year: String(year),
      month: String(month),
      day: String(day),
    });
    if (birthYear) params.set('user_birth_year', birthYear);
    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/tools/lich-van-nien/day?${params.toString()}`);
        const parsed = await safeJson<{ ok: boolean; day?: VanNienDayDTO; error?: string }>(res);
        if (cancelled) return;
        if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
        const data = parsed.data;
        if (!data.ok) throw new Error(data.error);
        if (data.day) setDayInfo(data.day);
      } catch (e) {
        if (!cancelled) setError(String((e as Error)?.message ?? e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [year, month, day, birthYear]);

  // Fetch month
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/tools/lich-van-nien/month`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ year, month }),
        });
        const parsed = await safeJson<{ ok: boolean; days?: VanNienMonthDayDTO[] }>(res);
        if (cancelled) return;
        if (parsed.ok && parsed.data.ok && parsed.data.days) setMonthDays(parsed.data.days);
      } catch {
        /* ignore — month is secondary */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  return (
    <ToolPageShell
      eyebrow="Lịch Vạn Niên · Tra cứu"
      icon={<span aria-hidden="true">📅</span>}
      title={
        <>
          Tra cứu <GoldAccent>ngày</GoldAccent>
        </>
      }
      description="Chọn ngày dương lịch và năm sinh (tuỳ chọn) để xem Can Chi, sao tốt – sao xấu, giờ hoàng đạo và mức độ phù hợp với tuổi của bạn."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Lịch Vạn Niên', href: '/lich-van-nien' },
        { label: 'Tra cứu ngày' },
      ]}
    >
      <section className="space-y-6">
        <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-heading text-base">Chọn ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="space-y-1.5">
                <Label htmlFor="y" className="text-foreground/85">Năm</Label>
                <Input
                  id="y"
                  type="number"
                  inputMode="numeric"
                  min={1900}
                  max={2199}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value) || t.year)}
                  className="bg-card/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m" className="text-foreground/85">Tháng</Label>
                <Input
                  id="m"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={12}
                  value={month}
                  onChange={(e) => setMonth(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
                  className="bg-card/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="d" className="text-foreground/85">Ngày</Label>
                <Input
                  id="d"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={31}
                  value={day}
                  onChange={(e) => setDay(Math.max(1, Math.min(31, Number(e.target.value) || 1)))}
                  className="bg-card/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="by" className="text-foreground/85">Năm sinh của bạn</Label>
                <Input
                  id="by"
                  type="number"
                  inputMode="numeric"
                  placeholder="VD: 1990"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  className="bg-card/60"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-rose-500/40 bg-rose-950/30 p-3 text-sm text-rose-200"
          >
            {error}
          </div>
        )}

        {loading && !dayInfo && <Skeleton className="h-40 w-full rounded-xl" />}

        {dayInfo && <DayCard day={dayInfo} />}

        {monthDays.length > 0 && (
          <CalendarMonth
            year={year}
            month={month}
            days={monthDays}
            selectedDay={day}
            onSelectDay={(d) => setDay(d.solarDay)}
          />
        )}

        <div className="text-center text-xs text-muted-foreground">
          <Link href="/lich-van-nien" className="hover:text-gold">← Quay lại Lịch Vạn Niên</Link>
        </div>
      </section>
    </ToolPageShell>
  );
}
