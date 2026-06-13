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

const EL_TEXT: Record<Element, string> = {
  Mộc: 'text-emerald-400',
  Hỏa: 'text-rose-400',
  Thổ: 'text-amber-400',
  Kim: 'text-slate-200',
  Thủy: 'text-sky-400',
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
  const [chart, setChart] = React.useState<BaziChart | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onCast = React.useCallback(() => {
    if (!date) {
      setError('Hãy chọn ngày sinh dương lịch.');
      return;
    }
    setError(null);
    try {
      setChart(calculateBazi({ birthSolarDate: date, birthHour: parseHour(time) }));
    } catch {
      setError('Chưa lập được lá số — kiểm tra lại ngày sinh.');
    }
  }, [date, time]);

  const maxCount = chart ? Math.max(...ELEMENTS.map((e) => chart.elementCount[e]), 1) : 1;

  return (
    <Card className="border-gold/20 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-heading text-lg">Nhập ngày &amp; giờ sinh (dương lịch)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="btDate">Ngày sinh (dương lịch)</Label>
            <Input id="btDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="btTime">Giờ sinh</Label>
            <Input id="btTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
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
                Đây là đếm 8 chữ nổi — cách nhìn nhanh sự cân bằng. Luận sâu (vượng/nhược, dụng thần) còn xét
                tàng can, mùa sinh… để bản đọc AI làm.
              </p>
            </div>

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
