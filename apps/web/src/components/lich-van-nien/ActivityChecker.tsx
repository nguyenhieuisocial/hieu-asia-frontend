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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@hieu-asia/ui';
import { safeJson } from '@/lib/safe-json';

export type Activity =
  | 'cuoi_hoi'
  | 'khai_truong'
  | 'dong_tho'
  | 'xuat_hanh'
  | 'mua_xe'
  | 'ky_hop_dong'
  | 'cat_toc'
  | 'an_tang'
  | 'nhap_trach';

const ACTIVITIES: Array<{ value: Activity; label: string; emoji: string }> = [
  { value: 'cuoi_hoi', label: 'Cưới hỏi', emoji: '💍' },
  { value: 'khai_truong', label: 'Khai trương', emoji: '🏢' },
  { value: 'dong_tho', label: 'Động thổ', emoji: '🏠' },
  { value: 'nhap_trach', label: 'Nhập trạch', emoji: '🔑' },
  { value: 'xuat_hanh', label: 'Xuất hành', emoji: '✈️' },
  { value: 'mua_xe', label: 'Mua xe', emoji: '🚗' },
  { value: 'ky_hop_dong', label: 'Ký hợp đồng', emoji: '📝' },
  { value: 'cat_toc', label: 'Cắt tóc', emoji: '✂️' },
  { value: 'an_tang', label: 'An táng', emoji: '🪦' },
];

interface CheckResult {
  ok: boolean;
  score: number;
  reason: string;
  goodFactors: string[];
  badFactors: string[];
  alternatives: Array<{ iso: string; score: number; summary: string }>;
}

function getApiBase(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return 'https://api.hieu.asia';
}

export function ActivityChecker({
  defaultDate,
  defaultActivity,
}: { defaultDate?: string; defaultActivity?: Activity } = {}) {
  const today = new Date();
  const todayIso = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(
    today.getUTCDate(),
  ).padStart(2, '0')}`;

  const [activity, setActivity] = React.useState<Activity>(defaultActivity ?? 'cuoi_hoi');
  const [date, setDate] = React.useState(defaultDate ?? todayIso);
  const [birthYear, setBirthYear] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<CheckResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function onCheck() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${getApiBase()}/tools/lich-van-nien/check`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          date,
          activity,
          user_birth_year: birthYear ? Number(birthYear) : undefined,
        }),
      });
      const parsed = await safeJson<CheckResult & { error?: string }>(res);
      if (!parsed.ok) throw new Error(`Phản hồi không hợp lệ (HTTP ${parsed.status})`);
      const data = parsed.data;
      if (!data.ok) throw new Error(data.error || 'Lỗi không xác định');
      setResult(data as CheckResult);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kiểm tra ngày tốt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="activity">Việc cần làm</Label>
            <Select value={activity} onValueChange={(v) => setActivity(v as Activity)}>
              <SelectTrigger id="activity">
                <SelectValue placeholder="Chọn việc..." />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITIES.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.emoji} {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="date">Ngày dự định</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="birthYear">Năm sinh (tùy chọn)</Label>
            <Input
              id="birthYear"
              type="number"
              placeholder="VD: 1990"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={onCheck} disabled={loading} className="w-full md:w-auto">
          {loading ? 'Đang kiểm tra...' : 'Kiểm tra ngay'}
        </Button>

        {error && (
          <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div
              className={cn(
                'rounded-lg border p-4',
                result.ok
                  ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30'
                  : 'border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/30',
              )}
            >
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-semibold">
                  {result.ok ? '✓ Phù hợp' : '✗ Không phù hợp'}
                </div>
                <div className="text-2xl font-bold tabular-nums">{result.score}/100</div>
              </div>
              <p className="mt-2 text-sm leading-relaxed">{result.reason}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 text-sm">
              {result.goodFactors.length > 0 && (
                <div>
                  <div className="font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                    Yếu tố tốt
                  </div>
                  <ul className="space-y-0.5">
                    {result.goodFactors.map((f, i) => (
                      <li key={i}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.badFactors.length > 0 && (
                <div>
                  <div className="font-medium text-rose-700 dark:text-rose-300 mb-1">
                    Yếu tố xấu
                  </div>
                  <ul className="space-y-0.5">
                    {result.badFactors.map((f, i) => (
                      <li key={i}>✗ {f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {result.alternatives.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium">
                  Gợi ý ngày tốt hơn trong 30 ngày tới
                </div>
                <div className="space-y-2">
                  {result.alternatives.map((alt) => (
                    <div
                      key={alt.iso}
                      className="flex items-baseline justify-between rounded-md border bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/30"
                    >
                      <div>{alt.summary}</div>
                      <div className="font-semibold tabular-nums text-amber-700 dark:text-amber-300">
                        {alt.score}/100
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
