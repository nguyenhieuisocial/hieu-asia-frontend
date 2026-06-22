'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { calculateBazi, type BaziChart, type BaziPillar, type Element, ELEMENTS } from '@/lib/bazi';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { ProofDisclosure } from '@/components/la-so-bat-tu/ProofDisclosure';
import { UnifiedProfile } from '@/components/la-so-bat-tu/UnifiedProfile';

/**
 * Công cụ Bát Tự (Tứ Trụ) bấm-thử miễn phí. Engine `lib/bazi.ts` chạy NGAY trong
 * trình duyệt (thuần TS, không gọi máy chủ) → tức thì, không kẹt mạng. Hiển thị
 * 4 trụ + Thập Thần + cân bằng ngũ hành. Khung trung lập "không bói mù".
 */

// Theme-aware: shade tối cho nền sáng (kem), shade sáng cho nền tối.
// Trước đây chỉ -400/-200 (chỉ hợp nền tối) → light mode chữ ngũ hành gần vô hình.
// ĐO LẠI bằng alpha-composite THẬT (chữ trên bg-card/40 đè lên nền kem, KHÔNG phải
// vs kem trần): -700 cho Mộc/Hỏa/Thủy chỉ ~4.0–4.4:1 (hụt AA 4.5 cho chữ nhỏ) →
// nâng -800. Composite ≥5.1:1 mọi token nhỏ; dark mode giữ -400/-200.
const EL_TEXT: Record<Element, string> = {
  Mộc: 'text-emerald-800 dark:text-emerald-400',
  Hỏa: 'text-rose-800 dark:text-rose-400',
  Thổ: 'text-amber-800 dark:text-amber-400',
  Kim: 'text-slate-600 dark:text-slate-200',
  Thủy: 'text-sky-800 dark:text-sky-400',
};
const EL_BAR: Record<Element, string> = {
  Mộc: 'bg-emerald-400/70',
  Hỏa: 'bg-rose-400/70',
  Thổ: 'bg-amber-400/70',
  Kim: 'bg-slate-300/70',
  Thủy: 'bg-sky-400/70',
};

function parseHour(t: string): number {
  const h = Number((t ?? '').split(':')[0]);
  return Number.isFinite(h) && h >= 0 && h <= 23 ? h : 12;
}

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

function PillarCard({ pillar, highlight }: { pillar: BaziPillar; highlight?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl border p-3 text-center ${
        highlight ? 'border-gold/60 bg-gold/[0.08]' : 'border-border bg-card/40'
      }`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {pillar.label}
      </p>
      <p className={`mt-2 font-heading text-2xl font-bold ${EL_TEXT[pillar.canElement]}`}>{pillar.can}</p>
      <p className={`font-heading text-2xl font-bold ${EL_TEXT[pillar.chiElement]}`}>{pillar.chi}</p>
      <p className="mt-1 text-[10px] text-muted-foreground">
        {pillar.canElement}/{pillar.chiElement}
      </p>
      <p className="mt-2 text-[11px] font-medium text-gold-700">{pillar.tenGod}</p>
      <p className="mt-1 rounded bg-border/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
        {pillar.truongSinh}
      </p>
    </div>
  );
}

/**
 * Carry the just-computed chart into the paid onboarding funnel WITHOUT a blank
 * re-entry: write the canonical chart-profile store (`hieu:chart:profile:v1`)
 * that `BirthDataForm` (step 4/4) reads on mount to pre-fill. Same key + shape
 * are consumed by /decisions/new, /account chart tabs & LoTrinhChart — so the
 * carry seeds the whole product, not just one form. Gender maps M→nam, F→nữ.
 */
function carryChartToOnboarding(date: string, time: string, gender: 'M' | 'F') {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      'hieu:chart:profile:v1',
      JSON.stringify({
        full_name: '',
        gender: gender === 'F' ? 'nữ' : 'nam',
        birth_date: date,
        birth_time: time || '',
        birth_place: '',
        updated_at: new Date().toISOString(),
      }),
    );
  } catch {
    /* quota — best effort; onboarding still works, just without pre-fill */
  }
}

export interface BatTuCheckerProps {
  /** Pre-seed birth inputs (e.g. from the homepage hero invitation). */
  initialDate?: string;
  initialTime?: string;
  initialGender?: 'M' | 'F';
  /** When true + a valid initialDate is given, compute the chart on mount. */
  autoCast?: boolean;
  /**
   * Embedded mode (homepage hero): don't rewrite the page URL to
   * /la-so-bat-tu on cast, and don't read `?d=&t=&g=` from the host URL.
   * The standalone /la-so-bat-tu page keeps both behaviours (default false).
   */
  embedded?: boolean;
}

export function BatTuChecker({
  initialDate,
  initialTime,
  initialGender,
  autoCast = false,
  embedded = false,
}: BatTuCheckerProps = {}) {
  const [date, setDate] = React.useState(initialDate ?? '');
  const [time, setTime] = React.useState(initialTime ?? '12:00');
  const [gender, setGender] = React.useState<'M' | 'F'>(initialGender ?? 'M');
  const [chart, setChart] = React.useState<BaziChart | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onCast = React.useCallback(() => {
    if (!date) {
      setError('Hãy chọn ngày sinh dương lịch.');
      return;
    }
    setError(null);
    try {
      const ict = new Date(Date.now() + 7 * 3600 * 1000); // hôm nay theo giờ VN
      const asOf = `${ict.getUTCFullYear()}-${ict.getUTCMonth() + 1}-${ict.getUTCDate()}`;
      setChart(calculateBazi({ birthSolarDate: date, birthHour: parseHour(time), gender, asOf }));
      // Ghi tham số vào URL để LÁ SỐ chia sẻ được (mở link là thấy ngay lá số đó).
      // Bỏ qua khi nhúng trong hero trang chủ (không ghi đè URL "/").
      if (!embedded && typeof window !== 'undefined') {
        const qs = new URLSearchParams({ d: date, t: time, g: gender }).toString();
        window.history.replaceState(null, '', `/la-so-bat-tu?${qs}`);
      }
    } catch {
      setError('Chưa lập được lá số — kiểm tra lại ngày sinh.');
    }
  }, [date, time, gender, embedded]);

  // Mở link chia sẻ (?d=&t=&g=) → tự điền + lập lá số ngay (không cần bấm lại).
  // Embedded mode bỏ qua URL host (hero trang chủ dùng prop initial* thay thế).
  React.useEffect(() => {
    if (embedded || typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const d = sp.get('d');
    if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return;
    const t = sp.get('t') || '12:00';
    const g: 'M' | 'F' = sp.get('g') === 'F' ? 'F' : 'M';
    setDate(d);
    setTime(t);
    setGender(g);
    try {
      const ict = new Date(Date.now() + 7 * 3600 * 1000);
      const asOf = `${ict.getUTCFullYear()}-${ict.getUTCMonth() + 1}-${ict.getUTCDate()}`;
      setChart(calculateBazi({ birthSolarDate: d, birthHour: parseHour(t), gender: g, asOf }));
    } catch {
      /* link hỏng — bỏ qua, người dùng tự nhập */
    }
  }, [embedded]);

  // Hero trang chủ: lời mời đã thu ngày–giờ–giới tính → lập lá số ngay khi nhúng.
  React.useEffect(() => {
    if (!autoCast || !initialDate || !/^\d{4}-\d{2}-\d{2}$/.test(initialDate)) return;
    try {
      const ict = new Date(Date.now() + 7 * 3600 * 1000);
      const asOf = `${ict.getUTCFullYear()}-${ict.getUTCMonth() + 1}-${ict.getUTCDate()}`;
      setChart(
        calculateBazi({
          birthSolarDate: initialDate,
          birthHour: parseHour(initialTime ?? '12:00'),
          gender: initialGender ?? 'M',
          asOf,
        }),
      );
    } catch {
      /* ngày hỏng — để người dùng tự bấm lại */
    }
    // chỉ chạy 1 lần khi nhúng với giá trị khởi tạo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoCast]);

  const maxCount = chart ? Math.max(...ELEMENTS.map((e) => chart.elementCount[e]), 1) : 1;
  const curAge = chart ? ageFromDate(chart.meta.solarDate) : null;

  // Link + caption chia sẻ (khoe lá số → kéo người mới vào xem thử).
  const sharePath = `/la-so-bat-tu?${new URLSearchParams({ d: date, t: time, g: gender }).toString()}`;
  const shareText = chart
    ? `Lá số Bát Tự của tôi: Nhật Chủ ${chart.dayMaster.can} (${chart.dayMaster.element} ${chart.dayMaster.yang ? 'dương' : 'âm'}), hành ${chart.strongest} vượng${chart.missing.length ? `, thiếu ${chart.missing.join('/')}` : ''}. Tính theo tiết khí chuẩn, không bói toán — xem thử lá số của bạn miễn phí 👇`
    : '';

  // Bản "nếm thử" — teaser CÁ NHÂN HOÁ theo lá số (chốt khách; KHÔNG lộ kết luận trả phí).
  const curDaiVan = chart?.daiVan?.pillars.find((p) => curAge != null && curAge >= p.startAge && curAge <= p.endAge) ?? null;
  const teasers = chart
    ? [
        `Nhật Chủ ${chart.dayMaster.can} (${chart.dayMaster.element}) của bạn VƯỢNG hay NHƯỢC — và hành nào là "dụng thần" nên dùng.`,
        chart.missing.length
          ? `Bạn thiếu hành ${chart.missing.join(', ')}, mạnh hành ${chart.strongest} — định hình tính cách & lựa chọn ra sao, bù thế nào.`
          : `Ngũ hành đủ cả 5, mạnh nhất là ${chart.strongest} — thế cân bằng này nói gì về bạn.`,
        curDaiVan
          ? `Đại vận ${curDaiVan.can} ${curDaiVan.chi} (${curDaiVan.startAge}–${curDaiVan.endAge} tuổi) bạn đang đi — trọng tâm 10 năm này.`
          : `Đại vận 10 năm hiện tại của bạn — bối cảnh & trọng tâm giai đoạn.`,
      ]
    : [];

  return (
    <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
      {!embedded && (
        <CardHeader>
          <CardTitle className="font-heading text-lg">Nhập ngày &amp; giờ sinh (dương lịch)</CardTitle>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {/* Embedded (homepage hero): the hero already collected birth data + the
            chart auto-casts from props — hide this duplicate input so the hero
            reads "nhập một lần → lá số", not two identical forms. */}
        {!embedded && (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="btDate">Ngày sinh (dương lịch)</Label>
                <Input id="btDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="btTime">Giờ sinh</Label>
                <Input id="btTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="btGender">Giới tính</Label>
                <select
                  id="btGender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'M' | 'F')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="M">Nam</option>
                  <option value="F">Nữ</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Giờ sinh quyết định trụ giờ. Không nhớ giờ? Để <strong>12:00</strong> — ba trụ năm/tháng/ngày vẫn
              đúng, chỉ trụ giờ là ước lượng.
            </p>

            <Button onClick={onCast} size="lg">
              ✦ Lập lá số Bát Tự
            </Button>
          </>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {chart && (
          <div className="space-y-5 pt-2">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                Tứ Trụ — 8 chữ
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                <PillarCard pillar={chart.year} />
                <PillarCard pillar={chart.month} />
                <PillarCard pillar={chart.day} highlight />
                <PillarCard pillar={chart.hour} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Trụ tính theo <strong>tiết khí</strong> (đúng chuẩn Bát Tự) — chữ màu là ngũ hành của từng can/chi.
                Dòng cuối mỗi trụ là <strong>vòng Trường Sinh</strong>: trạng thái &ldquo;đời người&rdquo; của Nhật
                Chủ ({chart.dayMaster.can}) trên chi đó (Trường Sinh → Đế Vượng = mạnh; Suy → Tuyệt = yếu) — tra theo
                bảng cổ điển, không phải lời đoán.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/30 bg-gold/[0.05] px-4 py-3">
              <p className="text-sm text-foreground/85">
                Lá số tính theo tiết khí chuẩn — <strong>khoe với bạn bè</strong> hoặc thách họ xem thử lá số của mình.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <ShareResultButton
                  path={sharePath}
                  title="Lá số Bát Tự (Tứ Trụ) của tôi — hieu.asia"
                  text={shareText}
                  trackId="la-so-bat-tu"
                />
                <DownloadToolPdfButton
                  label="Tải PDF"
                  payload={() =>
                    chart
                      ? {
                          title: 'Lá số Bát Tự (Tứ Trụ)',
                          subtitle: `Sinh ${date} ${time} · ${gender === 'M' ? 'Nam' : 'Nữ'}`,
                          hero: {
                            big: `Nhật Chủ ${chart.dayMaster.can} · ${chart.dayMaster.element} ${chart.dayMaster.yang ? 'dương' : 'âm'}`,
                            small: chart.missing.length
                              ? `Hành vượng nhất: ${chart.strongest} · thiếu ${chart.missing.join(', ')}`
                              : `Hành vượng nhất: ${chart.strongest} · đủ cả 5 hành`,
                          },
                          sections: [
                            {
                              heading: 'Tứ Trụ',
                              rows: [chart.year, chart.month, chart.day, chart.hour].map((p) => ({
                                label: `Trụ ${p.label}`,
                                value: `${p.can} ${p.chi} · ${p.tenGod} · nạp âm ${p.napAm.name}`,
                              })),
                            },
                            {
                              heading: 'Tàng can (ngũ hành ẩn) & nạp âm',
                              rows: [chart.year, chart.month, chart.day, chart.hour].map((p) => ({
                                label: `Trụ ${p.label}`,
                                value: `Nạp âm ${p.napAm.name} (${p.napAm.element}) · Tàng can: ${p.hiddenStems
                                  .map((h) => `${h.can} ${h.tenGod}`)
                                  .join(', ')}`,
                              })),
                            },
                            {
                              heading: 'Cân bằng ngũ hành (đếm 8 chữ)',
                              rows: [
                                ...ELEMENTS.map((e) => ({
                                  label: `Hành ${e}`,
                                  value: String(chart.elementCount[e]),
                                  bar: Math.round((chart.elementCount[e] / maxCount) * 100),
                                })),
                                {
                                  label: 'Tổng kết',
                                  value: chart.missing.length
                                    ? `Vượng nhất ${chart.strongest} · thiếu ${chart.missing.join(', ')}`
                                    : `Vượng nhất ${chart.strongest} · đủ cả 5 hành`,
                                },
                              ],
                            },
                            {
                              heading: 'Vòng Trường Sinh (theo Nhật Chủ)',
                              rows: [chart.year, chart.month, chart.day, chart.hour].map((p) => ({
                                label: `Trụ ${p.label}`,
                                value: p.truongSinh,
                              })),
                            },
                            ...(chart.relations.length
                              ? [
                                  {
                                    heading: 'Quan hệ giữa các trụ (hợp · xung · tam hợp)',
                                    rows: chart.relations.map((rel) => ({
                                      label: `${rel.type} · ${rel.chi}`,
                                      value: `(${rel.pillars}) ${rel.detail}`,
                                    })),
                                  },
                                ]
                              : []),
                            ...(chart.thanSat.length
                              ? [
                                  {
                                    heading: 'Thần Sát (sao tượng trưng — để hiểu mình, không phải điềm)',
                                    rows: chart.thanSat.map((ts) => ({
                                      label: `${ts.name} · ${ts.chi}`,
                                      value: `(${ts.pillars}) ${ts.meaning}`,
                                    })),
                                  },
                                ]
                              : []),
                            ...(chart.daiVan
                              ? [
                                  {
                                    heading: `Đại vận (vận 10 năm · khởi ~${chart.daiVan.startAge} tuổi · chiều ${chart.daiVan.forward ? 'thuận' : 'nghịch'})`,
                                    rows: chart.daiVan.pillars.map((p) => ({
                                      label: `${p.startAge}–${p.endAge} tuổi${
                                        curAge != null && curAge >= p.startAge && curAge <= p.endAge
                                          ? ' (hiện tại)'
                                          : ''
                                      }`,
                                      value: `${p.can} ${p.chi} · ${p.tenGod}`,
                                    })),
                                  },
                                ]
                              : []),
                            ...(chart.luuNien
                              ? [
                                  {
                                    heading: `Vận năm nay — lưu niên ${chart.luuNien.can} ${chart.luuNien.chi}`,
                                    rows: [
                                      {
                                        label: `Năm ${chart.luuNien.year}`,
                                        value: `${chart.luuNien.can} ${chart.luuNien.chi} · so với Nhật Chủ là ${chart.luuNien.tenGod}`,
                                      },
                                    ],
                                  },
                                ]
                              : []),
                          ],
                          cta: {
                            text: 'Mở khoá bản luận giải sâu từ chính lá số của bạn — vượng/nhược, dụng thần & định hướng theo Đại vận',
                            url: 'hieu.asia',
                          },
                        }
                      : null
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                Nhật Chủ (chủ mệnh)
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                Can ngày của bạn là{' '}
                <strong className={EL_TEXT[chart.dayMaster.element]}>
                  {chart.dayMaster.can} ({chart.dayMaster.element} {chart.dayMaster.yang ? 'dương' : 'âm'})
                </strong>{' '}
                — đây là &ldquo;chính bạn&rdquo; trong lá số. Các trụ khác đọc theo quan hệ với can ngày này
                (cột Thập Thần: {chart.year.tenGod}, {chart.month.tenGod}, {chart.hour.tenGod}).
              </p>
            </div>

            <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                Tàng can &amp; nạp âm (chiều sâu lá số)
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Mỗi địa chi còn <strong>ẩn 1–3 thiên can</strong> bên trong (tàng can) — đây mới là phần định
                ngũ hành thật &amp; đủ bộ Thập Thần. <strong>Nạp âm</strong> là &ldquo;mệnh&rdquo; theo 60 hoa
                giáp (vd Lộ Bàng Thổ), khác với ngũ hành can/chi ở trên.
              </p>
              <div className="mt-3 space-y-2">
                {[chart.year, chart.month, chart.day, chart.hour].map((p) => (
                  <div key={p.label} className="rounded-lg border border-border bg-card/40 p-2.5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {p.label}
                      </span>
                      <span className="font-heading text-sm font-semibold">
                        <span className={EL_TEXT[p.canElement]}>{p.can}</span>{' '}
                        <span className={EL_TEXT[p.chiElement]}>{p.chi}</span>
                      </span>
                      <span className="text-[11px] text-foreground/70">
                        nạp âm <strong className={EL_TEXT[p.napAm.element]}>{p.napAm.name}</strong>
                      </span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 sm:pl-14">
                      {p.hiddenStems.map((h) => (
                        <span key={h.can} className="rounded bg-border/40 px-1.5 py-0.5 text-[11px]">
                          <span className={`font-medium ${EL_TEXT[h.element]}`}>{h.can}</span>
                          <span className="text-muted-foreground"> · {h.tenGod}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Cung phối (trụ ngày) đọc theo tàng can ở chi ngày. Đây là dữ kiện cố định tra theo lá số —
                luận vượng/nhược &amp; chọn dụng thần (cân theo mùa sinh, trọng số can ẩn) là phần bản đọc AI làm.
              </p>
            </div>

            <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                Cân bằng ngũ hành (8 chữ)
              </p>
              <ul className="mt-3 space-y-1.5">
                {ELEMENTS.map((e) => (
                  <li key={e} className="flex items-center gap-2 text-sm">
                    <span className={`w-10 shrink-0 font-medium ${EL_TEXT[e]}`}>{e}</span>
                    <span className="h-2 flex-1 overflow-hidden rounded-full bg-border/40">
                      <span
                        className={`block h-full rounded-full ${EL_BAR[e]}`}
                        style={{ width: `${(chart.elementCount[e] / maxCount) * 100}%` }}
                      />
                    </span>
                    <span className="w-5 shrink-0 text-right text-xs text-muted-foreground">
                      {chart.elementCount[e]}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-foreground/85">
                Hành <strong className={EL_TEXT[chart.strongest]}>{chart.strongest}</strong> nhiều nhất
                {chart.missing.length > 0 ? (
                  <>
                    {' '}
                    · thiếu hành <strong>{chart.missing.join(', ')}</strong>
                  </>
                ) : (
                  <> · đủ cả 5 hành</>
                )}
                .
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Đây là đếm 8 chữ nổi — cách nhìn nhanh sự cân bằng. Phần <strong>tàng can</strong> ở trên cho
                thấy ngũ hành còn ẩn thêm; luận vượng/nhược &amp; dụng thần (cân theo mùa sinh) là phần bản đọc
                AI làm.
              </p>
            </div>

            <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                Quan hệ giữa các trụ (hợp · xung · tam hợp)
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Quan hệ giữa các địa chi cho thấy nội lực <strong>hoà hay căng</strong> trong lá số — dữ kiện cố
                định tra theo bảng, không phải lời đoán.
              </p>
              {chart.relations.length === 0 ? (
                <p className="mt-3 text-sm text-foreground/85">
                  Bốn trụ không có quan hệ hợp / xung / tam hợp nổi bật — các chi đứng khá độc lập.
                </p>
              ) : (
                <ul className="mt-3 space-y-1.5">
                  {chart.relations.map((rel) => {
                    const harmony = rel.type === 'Lục Hợp' || rel.type === 'Tam Hợp' || rel.type === 'Bán Tam Hợp';
                    const tone = harmony
                      ? 'bg-emerald-400/15 text-emerald-800 dark:text-emerald-300'
                      : rel.type === 'Lục Xung'
                        ? 'bg-rose-400/15 text-rose-800 dark:text-rose-300'
                        : 'bg-amber-400/15 text-amber-800 dark:text-amber-300';
                    return (
                      <li
                        key={`${rel.type}-${rel.chi}-${rel.pillars}`}
                        className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm"
                      >
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-medium ${tone}`}>
                          {rel.type}
                        </span>
                        <span className="font-medium text-foreground/90">{rel.chi}</span>
                        <span className="text-xs text-muted-foreground">({rel.pillars})</span>
                        <span className="w-full text-xs text-muted-foreground sm:w-auto sm:flex-1">
                          — {rel.detail}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                Thần Sát (sao tượng trưng)
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Các sao tượng trưng tra theo lá số (tam-hợp chi năm/ngày &amp; can ngày) — dữ kiện cố định theo cổ
                thư (Tam Mệnh Thông Hội), <strong>không phải lời đoán định mệnh</strong>. Mỗi sao là một &ldquo;màu
                sắc&rdquo; tính cách để hiểu mình, không phải điềm tốt/xấu.
              </p>
              {chart.thanSat.length === 0 ? (
                <p className="mt-3 text-sm text-foreground/85">
                  Lá số không có thần sát nổi bật trong nhóm phổ biến — bốn trụ &ldquo;sạch&rdquo; ở khía cạnh này.
                </p>
              ) : (
                <ul className="mt-3 space-y-1.5">
                  {chart.thanSat.map((ts) => (
                    <li
                      key={`${ts.name}-${ts.chi}-${ts.pillars}`}
                      className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm"
                    >
                      <span className="shrink-0 rounded bg-gold/15 px-1.5 py-0.5 text-[11px] font-medium text-gold-700">
                        {ts.name}
                      </span>
                      <span className="font-medium text-foreground/90">{ts.chi}</span>
                      <span className="text-xs text-muted-foreground">({ts.pillars})</span>
                      <span className="w-full text-xs text-muted-foreground sm:w-auto sm:flex-1">
                        — {ts.meaning}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {chart.daiVan && (
              <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                  Đại vận (vận 10 năm)
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Khởi vận khoảng <strong>{chart.daiVan.startAge} tuổi</strong>, đi theo chiều{' '}
                  <strong>{chart.daiVan.forward ? 'thuận' : 'nghịch'}</strong> (theo can năm &amp; giới tính).
                  Mỗi vận kéo dài 10 năm.
                </p>
                <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2" role="list">
                  {chart.daiVan.pillars.map((p) => {
                    const cur = curAge != null && curAge >= p.startAge && curAge <= p.endAge;
                    return (
                      <div
                        key={p.index}
                        role="listitem"
                        className={`min-w-[92px] flex-shrink-0 rounded-lg border p-2 text-center ${
                          cur ? 'border-gold/60 bg-gold/[0.08]' : 'border-border bg-card/40'
                        }`}
                      >
                        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          {p.startAge}–{p.endAge}t{cur ? ' ●' : ''}
                        </p>
                        <p className="mt-1 font-heading text-sm font-semibold">
                          <span className={EL_TEXT[p.canElement]}>{p.can}</span>{' '}
                          <span className={EL_TEXT[p.chiElement]}>{p.chi}</span>
                        </p>
                        <p className="mt-0.5 text-[10px] text-gold-700">{p.tenGod}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {curAge != null ? `Chấm vàng ● = vận hiện tại (~${curAge} tuổi). ` : ''}
                  Đại vận = bối cảnh 10 năm chồng lên lá số gốc — để soi trọng tâm giai đoạn, không phải dự
                  đoán may rủi.
                </p>
              </div>
            )}

            {chart.luuNien && (
              <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">
                  Vận năm nay — lưu niên {chart.luuNien.can} {chart.luuNien.chi}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Năm {chart.luuNien.year} an theo can chi{' '}
                  <span className={EL_TEXT[chart.luuNien.canElement]}>{chart.luuNien.can}</span>{' '}
                  <span className={EL_TEXT[chart.luuNien.chiElement]}>{chart.luuNien.chi}</span> — so với Nhật
                  Chủ là <strong className="text-gold-700">{chart.luuNien.tenGod}</strong>. Đây là
                  &ldquo;màu&rdquo; của riêng năm nay chồng lên lá số gốc.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Lưu niên = điểm nhấn của riêng năm nay — chỉ để soi nhịp, không phải dự đoán may rủi.
                </p>
              </div>
            )}

            {/* HỒ SƠ CON NGƯỜI: từ MỘT ngày–giờ–giới tính ở cửa trước, hợp nhất
                lá số khách qua 4 hệ thống THẬT (Bát Tự đã có ở trên + Tử Vi +
                Chiêm tinh Tây + Thần số) thành một chân dung "đây là toàn bộ bạn".
                Trung thực là hào nước — chỉ kéo giá trị engine tính được, không
                bịa hội tụ. Nằm giữa lá số Bát Tự và phần "Vì sao đúng?" / mua. */}
            <div className="border-t border-gold/15 pt-5">
              <UnifiedProfile
                chart={chart}
                date={date}
                time={time}
                gender={gender}
                hourKnown={time !== '' && time !== '12:00'}
              />
            </div>

            {/* Khoảnh khắc NIỀM TIN: trước khi mời mua, cho khách TỰ kiểm chứng
                mỗi kết luận ở trên được TÍNH ra sao (tiết khí → can chi, bảng cố
                định, luật âm-dương) — minh bạch THẬT, khác hẳn "chuyên gia AI"
                giả của đối thủ. Dữ kiện kéo thẳng từ lá số, không bịa. */}
            <ProofDisclosure chart={chart} />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Lá số tính bằng engine Tứ Trụ chuẩn (theo tiết khí, vị trí Mặt Trời) —{' '}
              <strong>con số là thật, kiểm chứng được</strong>. Đây là bản tra cứu miễn phí; phần luận giải sâu
              là để bạn TỰ hiểu mình, không phải bói toán hay phán số mệnh.
            </p>

            <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5">
              <p className="text-center font-heading text-lg text-foreground">
                Bản đọc đầy đủ — giải sâu TOÀN BỘ hồ sơ này
              </p>
              <p className="mx-auto mt-1 max-w-xl text-center text-sm text-muted-foreground">
                Bạn vừa thấy <strong>con số được tính ra sao</strong> qua bốn hệ thống. Bản đọc trả phí
                đào sâu lá số của bạn — neo ở Bát Tự (Nhật Chủ {chart.dayMaster.can}, hành{' '}
                {chart.strongest} vượng
                {chart.missing.length ? `, thiếu ${chart.missing.join('/')}` : ''}), cùng{' '}
                <strong>Tử Vi</strong> và <strong>thần số</strong> — luận sâu riêng cho bạn:
              </p>
              <ul className="mx-auto mt-3 max-w-xl space-y-1.5 text-left text-sm text-foreground/85">
                {teasers.map((tl) => (
                  <li key={tl} className="flex gap-2">
                    <span className="mt-0.5 shrink-0 text-gold-700">›</span>
                    <span>{tl}</span>
                  </li>
                ))}
              </ul>
              <p className="mx-auto mt-3 max-w-xl text-center text-xs text-muted-foreground">
                …luận sâu từ Thập Thần, vòng Trường Sinh &amp; Thần Sát (đã hiện ở trên), đối chiếu cổ thư — văn
                phong &ldquo;hiểu mình để tự quyết&rdquo;, không bói toán.
              </p>
              <div className="mt-4 text-center">
                <Button
                  asChild
                  size="lg"
                  onClick={() => carryChartToOnboarding(date, time, gender)}
                >
                  {/* Mang THẲNG lá số vừa tính vào phễu trả phí: ghi kho lá số
                      chuẩn (hieu:chart:profile:v1) trước khi điều hướng → bước
                      "Thông tin sinh" tự điền sẵn, không phải nhập lại từ đầu.
                      topic=self ("Định hướng bản thân — Hiểu mình") chọn-sẵn để
                      khớp hứa "toàn bộ hồ sơ": khách xem xong chân dung tổng thể
                      KHÔNG bị thả vào ô chọn-chủ-đề trống → nút "Tiếp tục" bật
                      ngay (vẫn đổi chủ đề được nếu muốn). */}
                  <Link href="/onboarding/topic?topic=self&intent=ngu-hanh">
                    Đọc sâu CHÍNH lá số này →
                  </Link>
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Mang thẳng lá số vừa tính sang — <strong>không phải nhập lại</strong> ngày giờ sinh.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
