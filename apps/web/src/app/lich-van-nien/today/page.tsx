'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { DayCard, type VanNienDayDTO } from '@/components/lich-van-nien/DayCard';
import {
  CalendarMonth,
  type VanNienMonthDayDTO,
} from '@/components/lich-van-nien/CalendarMonth';

function getApiBase(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'https://api.hieu.asia';
}

function todayParts() {
  const d = new Date();
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
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
    fetch(`${getApiBase()}/tools/lich-van-nien/day?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data.ok) throw new Error(data.error);
        setDayInfo(data.day);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message ?? e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month, day, birthYear]);

  // Fetch month
  React.useEffect(() => {
    let cancelled = false;
    fetch(`${getApiBase()}/tools/lich-van-nien/month`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ year, month }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok) setMonthDays(data.days);
      })
      .catch(() => {
        /* ignore — month is secondary */
      });
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <nav className="text-sm">
        <Link href="/lich-van-nien" className="text-gold hover:underline">
          ← Lịch Vạn Niên
        </Link>
      </nav>

      <header>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tra cứu ngày</h1>
        <p className="text-sm text-foreground/70">
          Chọn ngày dương lịch và năm sinh (tùy chọn) để xem chi tiết.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chọn ngày</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="space-y-1">
              <Label htmlFor="y">Năm</Label>
              <Input
                id="y"
                type="number"
                min={1900}
                max={2199}
                value={year}
                onChange={(e) => setYear(Number(e.target.value) || t.year)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="m">Tháng</Label>
              <Input
                id="m"
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(e) => setMonth(Math.max(1, Math.min(12, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="d">Ngày</Label>
              <Input
                id="d"
                type="number"
                min={1}
                max={31}
                value={day}
                onChange={(e) => setDay(Math.max(1, Math.min(31, Number(e.target.value) || 1)))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="by">Năm sinh của bạn</Label>
              <Input
                id="by"
                type="number"
                placeholder="VD: 1990"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      )}

      {loading && !dayInfo && (
        <div className="text-sm text-foreground/70">Đang tải...</div>
      )}

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
    </main>
  );
}
