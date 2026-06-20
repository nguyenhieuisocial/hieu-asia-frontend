'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { castTuViHoroscope, type TuViChart, type TuViHoroscope, type TuViPalace, type CachCuc } from '@/lib/tuvi-client';
import { TuViChart12Palaces } from '@/components/tuvi/TuViChart12Palaces';
import { NguHanhRemedyCard } from '@/components/ngu-hanh/NguHanhRemedyCard';

/**
 * Cách cục (hệ chính tinh hội về Mệnh) — ported from the backend reading engine
 * (`tuvi-facts.ts`), where detection was cross-validated === iztro
 * `isSurroundedOneOf` on real charts. The tam phương tứ chính of Mệnh is the
 * fixed set {Mệnh, Tài Bạch, Quan Lộc, Thiên Di}. Neutral tendency framing —
 * NOT a wealth/fortune verdict.
 */
// Cách cục giờ tính SERVER-SIDE từ lá số iztro thật (deterministic, có điều kiện
// đầy đủ) — thay bộ dò client cũ vốn báo cách cục khi trùng ≥1 sao (overclaim).
const PALACE_ALIASES: Record<string, string> = {
  'Tử Nữ': 'Tử Tức',
  'Giao Hữu': 'Nô Bộc',
  'Sự Nghiệp': 'Quan Lộc',
};
const normPalace = (n: string) => PALACE_ALIASES[(n ?? '').trim()] ?? (n ?? '').trim();

function parseHour(t: string): number {
  const h = Number((t ?? '').split(':')[0]);
  return Number.isFinite(h) && h >= 0 && h <= 23 ? h : 12;
}

// Đại vận hiện tại — computed purely from the chart's per-palace decadal ranges
// (already present, no extra fetch) + Western age. Mirrors the backend
// currentDaiVan logic (verified === iztro decadal). [start, end] age inclusive.
function ageFromDate(dateStr: string, now: Date = new Date()): number | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec((dateStr ?? '').trim());
  if (!m) return null;
  const by = Number(m[1]);
  const bm = Number(m[2]);
  const bd = Number(m[3]);
  let age = now.getFullYear() - by;
  const mo = now.getMonth() + 1;
  if (mo < bm || (mo === bm && now.getDate() < bd)) age -= 1;
  return age >= 0 && age < 140 ? age : null;
}

function currentDaiVan(chart: TuViChart, age: number | null): TuViPalace | null {
  if (age == null) return null;
  for (const p of chart.palaces) {
    const r = p.decadal?.range;
    if (r && r.length >= 2 && age >= r[0]! && age <= r[1]!) return p;
  }
  return null;
}

// Lưu niên (vận năm) — the year's Tứ Hóa, computed by the engine for `targetDate`.
// iztro's `mutagen` array is fixed-order [Lộc, Quyền, Khoa, Kỵ].
const HOA_ORDER = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];
function mutagenText(mutagen?: string[]): string {
  if (!Array.isArray(mutagen)) return '';
  return mutagen
    .slice(0, 4)
    .map((star, i) => (star ? `${star} hóa ${HOA_ORDER[i]}` : ''))
    .filter(Boolean)
    .join(' · ');
}

export interface LaSoCheckerProps {
  /** Pre-seed birth inputs (e.g. from a share link with birth data pre-filled). */
  initialDate?: string;
  initialTime?: string;
  initialGender?: 'male' | 'female';
  /** When true + a valid initialDate is given, cast the chart on mount. */
  autoCast?: boolean;
}

export function LaSoChecker({
  initialDate,
  initialTime,
  initialGender,
  autoCast = false,
}: LaSoCheckerProps = {}) {
  const [date, setDate] = React.useState(initialDate ?? '');
  const [time, setTime] = React.useState(initialTime ?? '12:00');
  const [gender, setGender] = React.useState<'male' | 'female'>(initialGender ?? 'male');
  const [chart, setChart] = React.useState<TuViChart | null>(null);
  const [horoscope, setHoroscope] = React.useState<TuViHoroscope | null>(null);
  const [cachCuc, setCachCuc] = React.useState<CachCuc[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onCast = React.useCallback(async () => {
    if (!date) {
      setError('Hãy chọn ngày sinh dương lịch.');
      return;
    }
    setLoading(true);
    setError(null);
    setChart(null);
    setHoroscope(null);
    setCachCuc([]);
    try {
      const { chart: c, horoscope: h, cachCuc: cc } = await castTuViHoroscope({
        birthSolarDate: date,
        birthHour: parseHour(time),
        gender,
      });
      setChart(c);
      setHoroscope(h);
      setCachCuc(cc);
    } catch {
      setError('Chưa lập được lá số — thử lại sau giây lát.');
    } finally {
      setLoading(false);
    }
  }, [date, time, gender]);

  // Link chia sẻ (?d=&t=&g=) đã pre-fill ngày–giờ–giới tính qua prop initial* →
  // lập lá số NGAY khi mở (không cần bấm lại). Chỉ chạy 1 lần lúc mount; nếu
  // worker rate-limit (429/503), onCast tự set error + tắt loading → form thủ
  // công vẫn dùng được, không quay vô tận.
  React.useEffect(() => {
    if (!autoCast || !initialDate || !/^\d{4}-\d{1,2}-\d{1,2}$/.test(initialDate)) return;
    void onCast();
    // chỉ chạy 1 lần khi mount với giá trị khởi tạo từ link
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const age = chart ? ageFromDate(date) : null;
  const daiVan = chart ? currentDaiVan(chart, age) : null;
  const luuNien = horoscope?.yearly ?? null;
  const luuNienHoa = luuNien ? mutagenText(luuNien.mutagen) : '';
  const luuNienCanChi = luuNien
    ? [luuNien.heavenlyStem, luuNien.earthlyBranch].filter(Boolean).join(' ')
    : '';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhập ngày, giờ &amp; giới tính</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="lsDate">Ngày sinh (dương lịch)</Label>
            <Input id="lsDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lsTime">Giờ sinh</Label>
            <Input id="lsTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lsGender">Giới tính</Label>
            <select
              id="lsGender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Giờ sinh càng đúng, việc an cung càng chính xác. Không nhớ giờ? Để <strong>12:00</strong> (giờ Ngọ)
          — phần lớn cách an cung vẫn đúng, một số sao theo giờ có thể lệch.
        </p>

        <Button onClick={() => void onCast()} disabled={loading} size="lg">
          {loading ? 'Đang lập lá số…' : '✦ Lập lá số Tử Vi'}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}

        {chart && (
          <div className="space-y-5 pt-2">
            <TuViChart12Palaces chart={chart} />

            {cachCuc.length > 0 && (
              <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                  Cách cục — thế cục có tên trong lá số
                </p>
                <ul className="mt-3 space-y-3">
                  {cachCuc.map((c) => (
                    <li key={c.id} className="text-sm leading-relaxed text-foreground/85">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <strong className="text-foreground">{c.name}</strong>
                        {c.nameHan && <span className="text-xs text-muted-foreground">{c.nameHan}</span>}
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                            c.polarity === 'cát'
                              ? 'border-gold/40 text-gold'
                              : c.polarity === 'hung'
                                ? 'border-destructive/40 text-destructive'
                                : 'border-border text-muted-foreground'
                          }`}
                        >
                          {c.polarity}
                        </span>
                      </span>
                      <span className="mt-0.5 block">{c.meaning}</span>
                      {c.source && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">Đối chiếu: {c.source}</span>
                      )}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  Cách cục được <strong>tính trực tiếp từ lá số</strong> (vị trí sao thật), không phải lời đoán —
                  là <strong>khuôn hình thiên hướng</strong>, không phải phán giàu–nghèo. Đọc Mệnh luôn xét cùng
                  tam phương tứ chính.
                </p>
              </div>
            )}

            {daiVan && (
              <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                  Vận 10 năm hiện tại (đại vận)
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  {age != null && (
                    <>
                      Khoảng <strong>{age} tuổi</strong>, bạn đang ở{' '}
                    </>
                  )}
                  <strong>đại vận cung {normPalace(daiVan.name)}</strong>
                  {daiVan.decadal?.range && daiVan.decadal.range.length >= 2
                    ? ` (${daiVan.decadal.range[0]}–${daiVan.decadal.range[1]} tuổi)`
                    : ''}
                  . Xem các sao ở cung {normPalace(daiVan.name)} trong lá số trên để hiểu trọng tâm giai đoạn
                  10 năm này.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Đại vận = chu kỳ 10 năm, mỗi giai đoạn nhấn vào một cung — chỉ để soi trọng tâm, không phải
                  dự đoán may rủi.
                </p>
              </div>
            )}

            {luuNien && luuNienHoa && (
              <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                  Vận năm nay{luuNienCanChi ? ` — lưu niên ${luuNienCanChi}` : ''}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Năm nay an theo can chi{' '}
                  {luuNienCanChi && <strong>{luuNienCanChi}</strong>}, kích hoạt bốn sao Tứ Hóa lưu niên:{' '}
                  <strong>{luuNienHoa}</strong>. Tìm bốn sao này đang nằm ở cung nào trong lá số trên để biết
                  năm nay nổi bật ở mảng nào (tài chính, công việc, tình cảm, sức khỏe…).
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tứ Hóa lưu niên = điểm nhấn động của riêng năm nay, chồng lên lá số gốc — chỉ để soi trọng
                  tâm, không phải dự đoán may rủi.
                </p>
              </div>
            )}

            <p className="text-xs leading-relaxed text-muted-foreground">
              Lá số được an bằng engine Tử Vi chuẩn (114 sao, độ sáng miếu/vượng/hãm, Tứ Hóa, đại vận, lưu
              niên) —{' '}
              <strong>con số là thật, kiểm chứng được</strong>. Đây là bản tra cứu miễn phí; phần luận giải sâu
              là để bạn TỰ hiểu mình, không phải bói toán hay phán số mệnh.
            </p>

            {/* Gợi ý bổ khuyết ngũ hành — chỉ đọc fiveElementsClass, không đụng engine */}
            <NguHanhRemedyCard fiveElementsClass={chart.meta.fiveElementsClass} />

            {/* Funnel → AI deep reading (free chart here; the AI interpretation is the product) */}
            <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5 text-center">
              <p className="font-heading text-lg text-foreground">Muốn AI luận sâu lá số này?</p>
              <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
                Bản đọc đầy đủ: 12 cung theo tam phương tứ chính, đại vận – lưu niên, đối chiếu cổ thư — viết
                riêng cho bạn, văn phong &ldquo;hiểu mình để tự quyết&rdquo;, không phán định mệnh.
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link href="/onboarding">Tạo bản đọc Tử Vi đầy đủ →</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
