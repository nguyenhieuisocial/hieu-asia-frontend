'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@hieu-asia/ui';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { castTuViChart, type TuViChart } from '@/lib/tuvi-client';

type Gender = 'male' | 'female';

export function TinhMenhCucForm() {
  const [birthDate, setBirthDate] = React.useState('');
  const [birthHour, setBirthHour] = React.useState('12');
  const [gender, setGender] = React.useState<Gender>('male');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<TuViChart | null>(null);
  const [hasTime, setHasTime] = React.useState(true);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const hour = Number(birthHour);
      if (!birthDate || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(birthDate)) {
        throw new Error('Ngày sinh phải có dạng YYYY-MM-DD.');
      }
      if (!Number.isFinite(hour) || hour < 0 || hour > 23) {
        throw new Error('Giờ sinh phải từ 0 đến 23.');
      }
      const chart = await castTuViChart({
        birthSolarDate: birthDate,
        birthHour: hour,
        gender,
      });
      setResult(chart);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-cream">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-cream/55">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/tu-vi" className="hover:text-gold">
              Tử Vi
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-cream/75">Tính Mệnh Cục</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Free tool · Bước 1 của Tử Vi
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-5xl">
            Tính Mệnh Cục miễn phí
          </h1>
          <p className="mt-5 text-base leading-relaxed text-cream/80 sm:text-lg">
            Bước đầu tiên khi đọc lá số Tử Vi: xác định cung Mệnh, cung Thân, Cục và âm
            dương. 30 giây, không cần đăng ký.
          </p>
        </section>

        <section className="relative mx-auto max-w-2xl px-6 pb-12">
          <Card className="border-gold/20 bg-ink/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-cream">
                Nhập ngày–giờ sinh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birth-date">Ngày sinh dương lịch</Label>
                  <Input
                    id="birth-date"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max="2030-12-31"
                    min="1900-01-01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth-hour">
                    Giờ sinh (0–23){' '}
                    {!hasTime && (
                      <span className="font-mono text-[10px] text-amber-300">
                        — không nhớ giờ thì để 12
                      </span>
                    )}
                  </Label>
                  <Input
                    id="birth-hour"
                    type="number"
                    min={0}
                    max={23}
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-xs text-cream/65">
                    <input
                      type="checkbox"
                      checked={!hasTime}
                      onChange={(e) => setHasTime(!e.target.checked)}
                      className="h-3.5 w-3.5"
                    />
                    Tôi không nhớ giờ sinh (kết quả độ chính xác thấp hơn)
                  </label>
                </div>

                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    name="gender-tmc"
                    value={gender}
                    onValueChange={(v) => setGender(v as Gender)}
                    className="flex gap-4"
                  >
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="male" id="g-male" />
                      Nam
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="female" id="g-female" />
                      Nữ
                    </label>
                  </RadioGroup>
                </div>

                {error && (
                  <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Đang tính…' : 'Tính Mệnh Cục'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {result && (
          <section className="relative mx-auto max-w-2xl px-6 pb-12">
            <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-xl text-cream sm:text-2xl">
                  <Sparkles className="h-5 w-5 text-gold" aria-hidden /> Kết quả của bạn
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ResultRow
                    label="Cung Mệnh"
                    value={`${result.meta.soul} · ${result.meta.earthlyBranchOfSoulPalace}`}
                    hint="Khí chất bẩm sinh + thiên hướng cốt lõi"
                  />
                  <ResultRow
                    label="Cung Thân"
                    value={`${result.meta.body} · ${result.meta.earthlyBranchOfBodyPalace}`}
                    hint="Cách đời sống kéo bạn hành động"
                  />
                  <ResultRow
                    label="Cục"
                    value={result.meta.fiveElementsClass}
                    hint="Ngũ hành chủ + chu kỳ đại vận"
                  />
                  <ResultRow
                    label="Can Chi năm"
                    value={result.meta.chineseDate.split(' - ')[0] ?? '—'}
                    hint="Năm âm lịch + thiên can địa chi"
                  />
                  <ResultRow
                    label="Con giáp"
                    value={result.meta.zodiac}
                    hint="Theo địa chi năm sinh"
                  />
                  <ResultRow
                    label="Cung hoàng đạo"
                    value={result.meta.sign}
                    hint="Tham chiếu phương Tây"
                  />
                </div>

                {!hasTime && (
                  <div className="flex items-start gap-2 rounded-md border border-amber-700/40 bg-amber-900/10 p-3 text-xs leading-relaxed text-amber-100/90">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
                    <p>
                      Bạn không nhớ giờ sinh — kết quả ở trên dùng giờ Ngọ (12h) mặc định.
                      Cung Mệnh/Thân có thể đổi nếu giờ thực lệch 30 phút trở lên. Để
                      chính xác, lập lá số đầy đủ + hỏi Mentor.
                    </p>
                  </div>
                )}

                <div className="border-t border-cream/10 pt-4 text-xs leading-relaxed text-cream/65">
                  Đây là phần cấu trúc — bước 1 của lá số. Để xem 12 cung tương tác, 14
                  chính tinh và đại vận của riêng bạn, lập lá số đầy đủ (vẫn miễn phí).
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/onboarding">
                    <Button size="lg">Lập lá số đầy đủ</Button>
                  </Link>
                  <Link
                    href="/tu-vi"
                    className="inline-flex items-center text-sm text-cream/70 hover:text-gold"
                  >
                    Cẩm nang Tử Vi <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <section className="relative mx-auto max-w-2xl px-6 pb-20">
          <Card className="border-cream/10 bg-ink/40">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-cream">
                Cục là gì?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-cream/75">
              <p>
                Cục trong Tử Vi xác định CHU KỲ ĐẠI VẬN của bạn — 10 năm 1 đại vận.
                Có 5 loại Cục theo ngũ hành:
              </p>
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <strong className="text-gold">Thủy nhị cục</strong> — đại vận từ 2 tuổi
                </li>
                <li>
                  <strong className="text-gold">Mộc tam cục</strong> — đại vận từ 3 tuổi
                </li>
                <li>
                  <strong className="text-gold">Kim tứ cục</strong> — đại vận từ 4 tuổi
                </li>
                <li>
                  <strong className="text-gold">Thổ ngũ cục</strong> — đại vận từ 5 tuổi
                </li>
                <li>
                  <strong className="text-gold">Hỏa lục cục</strong> — đại vận từ 6 tuổi
                </li>
              </ul>
              <p className="text-cream/65">
                Mệnh hoà với Cục → giai đoạn phát triển thuận. Mệnh khắc Cục → cảm giác
                "vận ngược" — không phải định mệnh, là dấu hiệu cần thay đổi cách tiếp
                cận. Mentor sẽ giải thích chi tiết khi bạn lập lá số đầy đủ.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ResultRow({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-md border border-cream/10 bg-ink/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-cream/55">{label}</p>
      <p className="mt-1 font-heading text-lg font-semibold text-gold">{value}</p>
      <p className="mt-1 text-xs text-cream/65">{hint}</p>
    </div>
  );
}
