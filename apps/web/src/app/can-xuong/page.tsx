'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, RadioGroup, RadioGroupItem } from '@hieu-asia/ui';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

interface CanXuongResult {
  weight_year: string;
  weight_month: string;
  weight_day: string;
  weight_hour: string;
  total_weight: string;
  total_value: number;
  fortune_level: 'Tốt' | 'Khá' | 'Trung bình' | 'Xấu';
  poem: string;
  interpretation: string;
  input: {
    birth_date: string;
    birth_hour: number;
    lunar_year: number;
    lunar_month: number;
    lunar_day: number;
    can_chi_year: string;
    chi_hour: string;
  };
}

const LEVEL_COLOR: Record<CanXuongResult['fortune_level'], string> = {
  'Tốt': 'text-emerald-500 bg-emerald-500/10',
  'Khá': 'text-sky-500 bg-sky-500/10',
  'Trung bình': 'text-amber-500 bg-amber-500/10',
  'Xấu': 'text-rose-500 bg-rose-500/10',
};

export default function CanXuongPage() {
  const [birthDate, setBirthDate] = React.useState('');
  const [birthHour, setBirthHour] = React.useState('12');
  const [gender, setGender] = React.useState('M');
  const [result, setResult] = React.useState<CanXuongResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setResult(null);
    if (!birthDate) { setError('Vui lòng nhập ngày sinh.'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tools/can-xuong`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birth_date: birthDate,
          birth_hour: Number(birthHour),
          gender,
        }),
      });
      const json = (await res.json()) as { ok: boolean; result?: CanXuongResult; error?: string };
      if (!json.ok || !json.result) throw new Error(json.error ?? 'Không tính được kết quả');
      setResult(json.result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Cân Xương Đoán Số</h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto">
          Phương pháp luận số cổ truyền Việt Nam — cân tổng năm, tháng, ngày, giờ sinh
          (theo lượng) rồi đối chiếu với câu thơ và lời luận giải.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Nhập thông tin sinh thần</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="birth_date">Ngày sinh (dương lịch)</Label>
              <Input
                id="birth_date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="birth_hour">Giờ sinh (0-23)</Label>
              <Input
                id="birth_hour"
                type="number"
                min={0}
                max={23}
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                required
              />
              <p className="text-xs text-foreground/60">
                Giờ sinh dương lịch, ví dụ 10 (10h sáng), 14 (2h chiều).
              </p>
            </div>
            <div className="space-y-2">
              <Label>Giới tính</Label>
              <RadioGroup name="gender" value={gender} onValueChange={setGender} className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="M" id="g-m" />
                  <Label htmlFor="g-m" className="font-normal">Nam</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="F" id="g-f" />
                  <Label htmlFor="g-f" className="font-normal">Nữ</Label>
                </div>
              </RadioGroup>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Đang cân...' : 'Cân xương đoán số'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <section className="space-y-4">
          <Card className="border-gold/30 bg-gradient-to-br from-gold/5 to-transparent">
            <CardContent className="p-6 text-center">
              <div className="text-xs uppercase tracking-wider text-foreground/60">Tổng cân</div>
              <div className="my-2 font-heading text-4xl text-gold">{result.total_weight}</div>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${LEVEL_COLOR[result.fortune_level]}`}>
                {result.fortune_level}
              </span>
              <p className="mt-1 text-xs text-foreground/60">
                Năm {result.input.can_chi_year} · Giờ {result.input.chi_hour}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <WeightCell label="Cân năm" value={result.weight_year} />
            <WeightCell label="Cân tháng" value={result.weight_month} />
            <WeightCell label="Cân ngày" value={result.weight_day} />
            <WeightCell label="Cân giờ" value={result.weight_hour} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Câu thơ luận số</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line italic text-foreground/85">{result.poem}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Luận giải</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/85">{result.interpretation}</p>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="text-center">
        <Link href="/" className="text-sm text-gold underline-offset-4 hover:underline">
          ← Quay về trang chủ
        </Link>
      </div>
    </main>
  );
}

function WeightCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 text-center">
      <div className="text-xs uppercase text-foreground/60">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
