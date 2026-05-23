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
import { Timer, AlertTriangle, ArrowRight } from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { castTuViChart, type TuViChart, type TuViPalace } from '@/lib/tuvi-client';

type Gender = 'male' | 'female';

/**
 * Find the palace whose decadal range contains the user's current age.
 * iztro stores decadal as [start_age, end_age]; spans are 10 years.
 */
function findCurrentDecadalPalace(chart: TuViChart, ageNow: number): TuViPalace | null {
  for (const p of chart.palaces) {
    const r = p.decadal?.range;
    if (r && r.length >= 2 && ageNow >= r[0]! && ageNow <= r[1]!) {
      return p;
    }
  }
  return null;
}

/**
 * Plain-language theme by palace name.
 * Keeps copy honest — describes domain focus rather than predictive claims.
 */
function themeForPalace(name: string): string {
  const map: Record<string, string> = {
    Mệnh: 'Tự định nghĩa lại bản thân — đây là giai đoạn nội tâm mạnh, hợp suy ngẫm sâu.',
    'Phụ Mẫu': 'Quan hệ với người trên + học tập từ truyền thống. Hợp mentorship, đọc, học.',
    'Phúc Đức': 'Sức chịu đựng nội tâm là chủ đề chính. Hợp xây thói quen tinh thần lành mạnh.',
    'Điền Trạch': 'Nhà cửa, không gian sống. Hợp đầu tư dài hạn vào tổ ấm vật lý + tinh thần.',
    'Quan Lộc': 'Sự nghiệp + vai trò xã hội. Hợp mở rộng phạm vi nghề + xây danh tiếng.',
    'Nô Bộc': 'Mạng lưới quan hệ rộng. Hợp networking, mở vòng tròn, tìm đồng minh.',
    'Thiên Di': 'Di chuyển, cơ hội bên ngoài. Hợp đi xa, du học, dự án quốc tế.',
    'Tật Ách': 'Sức khoẻ + năng lượng thể chất. Hợp xây thói quen vận động, ngủ đủ.',
    'Tài Bạch': 'Tiền bạc + dòng tiền. Hợp kỷ luật tài chính, tích luỹ, đầu tư có hệ thống.',
    'Tử Tức': 'Con cái + sáng tạo. Hợp xây sản phẩm, dự án "con đẻ" dài hạn.',
    'Phu Thê': 'Quan hệ thân mật. Hợp đầu tư vào hôn nhân/ tình yêu hoặc tìm bạn đời.',
    'Huynh Đệ': 'Bạn thân + cộng sự ngang vai. Hợp đào sâu vài quan hệ thay vì mở rộng.',
  };
  return map[name] ?? 'Giai đoạn chuyển mình — Mentor sẽ giúp bạn dịch chi tiết khi có lá số đầy đủ.';
}

export function DaiVanHienTaiForm() {
  const [birthDate, setBirthDate] = React.useState('');
  const [birthHour, setBirthHour] = React.useState('12');
  const [gender, setGender] = React.useState<Gender>('male');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<{
    chart: TuViChart;
    palace: TuViPalace | null;
    ageNow: number;
  } | null>(null);

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
      const chart = await castTuViChart({
        birthSolarDate: birthDate,
        birthHour: hour,
        gender,
      });
      const birthYear = Number(birthDate.split('-')[0]);
      const ageNow = new Date().getFullYear() - birthYear;
      const palace = findCurrentDecadalPalace(chart, ageNow);
      setResult({ chart, palace, ageNow });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="relative overflow-hidden pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-ink-radial opacity-80"
        />

        <section className="relative mx-auto max-w-3xl px-6 pb-12 pt-12 sm:pt-16">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-gold">
              Trang chủ
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/tu-vi" className="hover:text-gold">
              Tử Vi
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">Đại vận hiện tại</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Free tool · Chu kỳ 10 năm
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-foreground sm:text-5xl">
            Đại vận hiện tại của bạn
          </h1>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:text-lg">
            Đại vận là chu kỳ 10 năm trong Tử Vi — mỗi đại vận có chủ đề chính khác
            nhau. Tra cứu miễn phí: bạn đang ở giai đoạn nào và chủ đề lớn của 10 năm
            này.
          </p>
        </section>

        <section className="relative mx-auto max-w-2xl px-6 pb-12">
          <Card className="border-gold/20 bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground">
                Nhập thông tin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birth-date-dv">Ngày sinh dương lịch</Label>
                  <Input
                    id="birth-date-dv"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max="2030-12-31"
                    min="1900-01-01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth-hour-dv">Giờ sinh (0–23)</Label>
                  <Input
                    id="birth-hour-dv"
                    type="number"
                    min={0}
                    max={23}
                    value={birthHour}
                    onChange={(e) => setBirthHour(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    name="gender-dv"
                    value={gender}
                    onValueChange={(v) => setGender(v as Gender)}
                    className="flex gap-4"
                  >
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="male" id="g2-male" />
                      Nam
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="female" id="g2-female" />
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
                  {loading ? 'Đang tính…' : 'Xem đại vận hiện tại'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {result && result.palace && (
          <section className="relative mx-auto max-w-2xl px-6 pb-12">
            <Card className="border-gold/30 bg-gradient-to-br from-gold/[0.06] to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading text-xl text-foreground sm:text-2xl">
                  <Timer className="h-5 w-5 text-gold" aria-hidden /> Đại vận hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-gold/30 bg-gold/[0.05] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
                      Tuổi hiện tại
                    </p>
                    <p className="mt-1 font-heading text-2xl font-bold text-gold">
                      {result.ageNow}
                    </p>
                  </div>
                  <div className="rounded-md border border-gold/30 bg-gold/[0.05] p-4">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gold/80">
                      Đại vận
                    </p>
                    <p className="mt-1 font-heading text-2xl font-bold text-gold">
                      {result.palace.decadal?.range?.[0]}–{result.palace.decadal?.range?.[1]} tuổi
                    </p>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-card/40 p-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Cung chủ đại vận
                  </p>
                  <p className="mt-1 font-heading text-xl font-semibold text-foreground">
                    Cung {result.palace.name} · {result.palace.heavenlyStem}{' '}
                    {result.palace.earthlyBranch}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {themeForPalace(result.palace.name)}
                  </p>
                </div>

                {result.palace.majorStars.length > 0 && (
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gold/70">
                      Chính tinh tại đại vận
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {result.palace.majorStars.map((s) => (
                        <span
                          key={s.name}
                          className="rounded-full border border-gold/30 bg-gold/5 px-3 py-1 font-mono text-xs text-gold"
                        >
                          {s.name}
                          {s.mutagen && <span className="ml-1">· {s.mutagen}</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 rounded-md border border-amber-700/40 bg-amber-900/10 p-3 text-xs leading-relaxed text-amber-100/90">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
                  <p>
                    Đây là bản rút gọn — chỉ nói cung chủ đại vận. Để xem chi tiết: cơ
                    hội + rủi ro mỗi năm, lưu niên 2026, tam phương tứ chính hỗ trợ/phá
                    đại vận, Mentor đối thoại — lập lá số đầy đủ (vẫn miễn phí).
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg"><Link href="/onboarding">
                    Lập lá số đầy đủ
                  </Link></Button>
                  <Link
                    href="/tu-vi-2026"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-gold"
                  >
                    Tử vi 2026 <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {result && !result.palace && (
          <section className="relative mx-auto max-w-2xl px-6 pb-12">
            <Card className="border-amber-700/40 bg-amber-900/10">
              <CardContent className="pt-5 text-sm leading-relaxed text-amber-100/90">
                Không xác định được đại vận hiện tại từ tuổi {result.ageNow}. Có thể
                bạn ở ngoài khoảng đại vận tiêu chuẩn (0–95 tuổi) — hoặc engine cần dữ
                liệu chính xác hơn về giờ sinh. Lập lá số đầy đủ để Mentor kiểm tra.
              </CardContent>
            </Card>
          </section>
        )}

        <section className="relative mx-auto max-w-2xl px-6 pb-20">
          <Card className="border-border bg-card/40">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-foreground">
                Đại vận là gì?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Đại vận là chu kỳ 10 năm trong Tử Vi Đẩu Số. Mỗi 10 năm, ngôi sao chủ
                đại vận chuyển sang cung khác — tạo ra một "chủ đề" khác cho cuộc
                sống. Đại vận không quyết định bạn thành công hay thất bại; nó cho
                biết lĩnh vực nào ĐANG ĐƯỢC ƯU TIÊN trong giai đoạn này.
              </p>
              <p>
                Ví dụ: đại vận tại cung Quan Lộc → 10 năm sự nghiệp là chủ đề chính.
                Đại vận tại cung Tài Bạch → 10 năm tài chính + dòng tiền là chủ đề
                chính. Biết được chủ đề giúp bạn đặt mục tiêu hợp giai đoạn — thay vì
                ép mình theo lịch của người khác.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
