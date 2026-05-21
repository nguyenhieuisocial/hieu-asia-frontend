'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button, Card, CardContent, CardHeader, CardTitle, Input, Label,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@hieu-asia/ui';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

type LoBanType = 'lo_ban_42_9' | 'lo_ban_38_8' | 'thuoc_ban_52_2' | 'dinh_lan';

interface LoBanResult {
  cm: number;
  type_used: LoBanType;
  type_label: string;
  block: string;
  sub: string;
  fortune: 'Tốt' | 'Xấu';
  meaning: string;
  position_in_cycle_cm: number;
  cycle_length_cm: number;
  next_good?: { cm: number; block: string; sub: string };
  prev_good?: { cm: number; block: string; sub: string };
}

const TYPE_OPTIONS: { value: LoBanType; label: string; hint: string }[] = [
  { value: 'lo_ban_42_9', label: 'Lỗ Ban 42.9 cm', hint: 'Thông thủy — cửa, cổng, bàn thờ' },
  { value: 'lo_ban_38_8', label: 'Lỗ Ban 38.8 cm', hint: 'Dương trạch — đồ vật, giường, tủ' },
  { value: 'thuoc_ban_52_2', label: 'Thước Ban 52.2 cm', hint: 'Âm trạch — mộ phần' },
  { value: 'dinh_lan', label: 'Thước Đinh Lan 38.4 cm', hint: 'Quan tài, mộ phần' },
];

export default function ThuocLoBanPage() {
  const [valueCm, setValueCm] = React.useState('81');
  const [type, setType] = React.useState<LoBanType>('lo_ban_42_9');
  const [result, setResult] = React.useState<LoBanResult | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setResult(null);
    const v = Number(valueCm);
    if (!Number.isFinite(v) || v <= 0) { setError('Vui lòng nhập kích thước hợp lệ (cm).'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/tools/thuoc-lo-ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value_cm: v, type }),
      });
      const json = (await res.json()) as { ok: boolean; result?: LoBanResult; error?: string };
      if (!json.ok || !json.result) throw new Error(json.error ?? 'Không tra được kích thước');
      setResult(json.result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const selectedLabel = TYPE_OPTIONS.find((t) => t.value === type)?.label ?? '';

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Thước Lỗ Ban</h1>
        <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto">
          Tra cứu kích thước phong thủy theo Thước Lỗ Ban — cung Tốt/Xấu, ô con,
          ý nghĩa và gợi ý kích thước tốt gần nhất.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Nhập kích thước</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="value_cm">Kích thước (cm)</Label>
              <Input
                id="value_cm"
                type="number"
                min={0}
                step="0.1"
                value={valueCm}
                onChange={(e) => setValueCm(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Loại thước</Label>
              <Select value={type} onValueChange={(v) => setType(v as LoBanType)}>
                <SelectTrigger>
                  <SelectValue>{selectedLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{t.label}</span>
                        <span className="text-xs text-foreground/60">{t.hint}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Đang tra...' : 'Tra Thước Lỗ Ban'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <section className="space-y-4">
          <Card className={result.fortune === 'Tốt'
            ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 to-transparent'
            : 'border-rose-500/30 bg-gradient-to-br from-rose-500/5 to-transparent'}>
            <CardContent className="p-6 text-center space-y-2">
              <div className="text-xs uppercase tracking-wider text-foreground/60">
                {result.cm} cm · {result.type_label}
              </div>
              <div className="font-heading text-3xl sm:text-4xl text-gold">
                {result.block} · {result.sub}
              </div>
              <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                result.fortune === 'Tốt'
                  ? 'bg-emerald-500/15 text-emerald-600'
                  : 'bg-rose-500/15 text-rose-600'
              }`}>
                {result.fortune === 'Tốt' ? '✓ Tốt' : '✗ Xấu'}
              </span>
              <p className="text-sm text-foreground/80 max-w-xl mx-auto pt-1">{result.meaning}</p>
              <p className="text-xs text-foreground/60">
                Vị trí trong chu kỳ: {result.position_in_cycle_cm.toFixed(1)} / {result.cycle_length_cm} cm
              </p>
            </CardContent>
          </Card>

          {(result.next_good || result.prev_good) && (
            <Card>
              <CardHeader>
                <CardTitle>Gợi ý kích thước tốt gần nhất</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {result.prev_good && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                    <div className="text-xs uppercase text-foreground/60">Nhỏ hơn</div>
                    <div className="mt-1 font-medium">{result.prev_good.cm} cm</div>
                    <div className="text-xs text-foreground/70">
                      {result.prev_good.block} · {result.prev_good.sub}
                    </div>
                  </div>
                )}
                {result.next_good && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                    <div className="text-xs uppercase text-foreground/60">Lớn hơn</div>
                    <div className="mt-1 font-medium">{result.next_good.cm} cm</div>
                    <div className="text-xs text-foreground/70">
                      {result.next_good.block} · {result.next_good.sub}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
