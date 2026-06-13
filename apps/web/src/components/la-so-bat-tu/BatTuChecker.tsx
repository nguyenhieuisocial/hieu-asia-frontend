'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import { calculateBazi, type BaziChart, type BaziPillar, type Element, ELEMENTS } from '@/lib/bazi';

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
    </div>
  );
}

export function BatTuChecker() {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('12:00');
  const [gender, setGender] = React.useState<'M' | 'F'>('M');
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
    } catch {
      setError('Chưa lập được lá số — kiểm tra lại ngày sinh.');
    }
  }, [date, time, gender]);

  const maxCount = chart ? Math.max(...ELEMENTS.map((e) => chart.elementCount[e]), 1) : 1;
  const curAge = chart ? ageFromDate(chart.meta.solarDate) : null;

  return (
    <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg">Nhập ngày &amp; giờ sinh (dương lịch)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
              </p>
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

            <p className="text-xs leading-relaxed text-muted-foreground">
              Lá số tính bằng engine Tứ Trụ chuẩn (theo tiết khí, vị trí Mặt Trời) —{' '}
              <strong>con số là thật, kiểm chứng được</strong>. Đây là bản tra cứu miễn phí; phần luận giải sâu
              là để bạn TỰ hiểu mình, không phải bói toán hay phán số mệnh.
            </p>

            <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5 text-center">
              <p className="font-heading text-lg text-foreground">Muốn AI luận sâu lá số Bát Tự này?</p>
              <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
                Bản đọc đầy đủ: vượng–nhược nhật chủ, dụng thần, Thập Thần theo trụ, đối chiếu cổ thư — viết
                riêng cho bạn, văn phong &ldquo;hiểu mình để tự quyết&rdquo;.
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link href="/onboarding?intent=ngu-hanh">Tạo bản đọc Bát Tự đầy đủ →</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
