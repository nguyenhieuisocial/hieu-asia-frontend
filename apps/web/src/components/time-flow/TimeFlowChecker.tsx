'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import {
  DownloadToolPdfButton,
  type ToolPdfPayload,
} from '@/components/tools/DownloadToolPdfButton';
import {
  castTuViHoroscope,
  type TuViChart,
  type TuViHoroscope,
  type TuViScope,
} from '@/lib/tuvi-client';

/**
 * Shared "lập lá số → vận thật" island for the planning pages. One form, one
 * fetch (castTuViHoroscope returns chart + đại vận/lưu niên/lưu nguyệt), three
 * surfaces selected by `scope`:
 *   - decadal  → /timeline (chuỗi đại vận 10 năm theo cung THẬT + Tứ Hóa đại vận)
 *   - yearly   → /annual-planning (lưu niên Tứ Hóa năm)
 *   - monthly  → /monthly-planning (lưu nguyệt Tứ Hóa tháng)
 * Neutral framing throughout — engine facts, not fortune prediction.
 */

type Scope = 'decadal' | 'yearly' | 'monthly';

// iztro emits alias palace names; normalise for display + matching.
const PALACE_ALIASES: Record<string, string> = {
  'Tử Nữ': 'Tử Tức',
  'Giao Hữu': 'Nô Bộc',
  'Sự Nghiệp': 'Quan Lộc',
};
const normPalace = (n: string) => PALACE_ALIASES[(n ?? '').trim()] ?? (n ?? '').trim();

// iztro `mutagen` is fixed-order [Lộc, Quyền, Khoa, Kỵ].
const HOA_ORDER = ['Lộc', 'Quyền', 'Khoa', 'Kỵ'];
function mutagenText(mutagen?: string[]): string {
  if (!Array.isArray(mutagen)) return '';
  return mutagen
    .slice(0, 4)
    .map((star, i) => (star ? `${star} hóa ${HOA_ORDER[i]}` : ''))
    .filter(Boolean)
    .join(' · ');
}

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

type DaiVanSegment = { cung: string; start: number; end: number };

// Real đại vận sequence from the chart's per-palace decadal ranges (already
// present — no extra fetch). Sorted by starting age.
function decadalSegments(chart: TuViChart): DaiVanSegment[] {
  return chart.palaces
    .filter((p) => Array.isArray(p.decadal?.range) && (p.decadal?.range?.length ?? 0) >= 2)
    .map((p) => ({
      cung: normPalace(p.name),
      start: p.decadal!.range[0]!,
      end: p.decadal!.range[1]!,
    }))
    .sort((a, b) => a.start - b.start);
}

function canChi(sc?: TuViScope | null): string {
  if (!sc) return '';
  return [sc.heavenlyStem, sc.earthlyBranch].filter(Boolean).join(' ');
}

const SCOPE_COPY: Record<Scope, { heading: string; cta: string }> = {
  decadal: { heading: 'Đại vận thật của bạn', cta: 'Lập lá số đầy đủ' },
  yearly: { heading: 'Vận năm nay của bạn', cta: 'Lập lá số đầy đủ' },
  monthly: { heading: 'Vận tháng này của bạn', cta: 'Lập lá số đầy đủ' },
};

export function TimeFlowChecker({ scope }: { scope: Scope }) {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('12:00');
  const [gender, setGender] = React.useState<'male' | 'female'>('male');
  const [chart, setChart] = React.useState<TuViChart | null>(null);
  const [horoscope, setHoroscope] = React.useState<TuViHoroscope | null>(null);
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
    try {
      const { chart: c, horoscope: h } = await castTuViHoroscope({
        birthSolarDate: date,
        birthHour: parseHour(time),
        gender,
      });
      setChart(c);
      setHoroscope(h);
    } catch {
      setError('Chưa lập được lá số — thử lại sau giây lát.');
    } finally {
      setLoading(false);
    }
  }, [date, time, gender]);

  const idp = `tf-${scope}`;

  return (
    <Card className="border-gold/30 bg-gold/[0.04]">
      <CardHeader>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
          Cá nhân hoá
        </p>
        <CardTitle className="font-heading text-xl sm:text-2xl">
          {SCOPE_COPY[scope].heading}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Nhập ngày, giờ &amp; giới tính để thay ví dụ chung bằng{' '}
          <strong className="text-foreground">con số thật từ lá số của bạn</strong> — engine tính,
          kiểm chứng được.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor={`${idp}-date`}>Ngày sinh (dương lịch)</Label>
            <Input
              id={`${idp}-date`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${idp}-time`}>Giờ sinh</Label>
            <Input
              id={`${idp}-time`}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${idp}-gender`}>Giới tính</Label>
            <select
              id={`${idp}-gender`}
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
          Không nhớ giờ? Để <strong>12:00</strong> — phần lớn cách an cung vẫn đúng.
        </p>

        <Button onClick={() => void onCast()} disabled={loading} size="lg">
          {loading ? 'Đang lập lá số…' : '✦ Xem vận thật của tôi'}
        </Button>
        {error && <p className="text-sm text-destructive">{error}</p>}

        {chart && horoscope && (
          <div className="space-y-4 pt-1">
            {scope === 'decadal' && (
              <DecadalResult chart={chart} horoscope={horoscope} birthDate={date} />
            )}
            {(scope === 'yearly' || scope === 'monthly') && (
              <MutagenResult scope={scope} horoscope={horoscope} />
            )}

            <div className="rounded-lg border border-gold/20 bg-card/40 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Xem các sao này nằm ở cung nào trong lá số 12 cung đầy đủ:
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2">
                <Link href="/la-so-tu-vi">{SCOPE_COPY[scope].cta} →</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DecadalResult({
  chart,
  horoscope,
  birthDate,
}: {
  chart: TuViChart;
  horoscope: TuViHoroscope;
  birthDate: string;
}) {
  const segments = decadalSegments(chart);
  const age = ageFromDate(birthDate);
  const current =
    age == null ? null : segments.find((s) => age >= s.start && age <= s.end) ?? null;
  const decCanChi = canChi(horoscope.decadal);
  const decHoa = mutagenText(horoscope.decadal?.mutagen);

  return (
    <div className="space-y-4">
      {current && (
        <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
            Đại vận hiện tại
          </p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/85">
            {age != null && (
              <>
                Khoảng <strong>{age} tuổi</strong>, bạn đang ở{' '}
              </>
            )}
            <strong>đại vận cung {current.cung}</strong> ({current.start}–{current.end} tuổi)
            {decCanChi ? (
              <>
                , can chi đại vận <strong>{decCanChi}</strong>
              </>
            ) : null}
            .
          </p>
          {decHoa && (
            <p className="mt-2 text-sm text-foreground/85">
              Tứ Hóa đại vận: <strong>{decHoa}</strong>.
            </p>
          )}
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">
          Chuỗi đại vận thật theo lá số của bạn
        </p>
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2" role="list">
          {segments.map((s) => {
            const isCurrent = current != null && s.start === current.start;
            return (
              <div
                key={s.start}
                role="listitem"
                className={`min-w-[140px] flex-shrink-0 rounded-lg border p-3 ${
                  isCurrent ? 'border-gold/60 bg-gold/[0.08]' : 'border-border bg-card/40'
                }`}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {s.start}–{s.end} tuổi
                </p>
                <p className="mt-1 font-heading text-sm font-semibold text-foreground">
                  {s.cung}
                  {isCurrent ? <span className="text-gold"> ●</span> : null}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Cung an mệnh, chiều thuận/nghịch và tuổi khởi đại vận đã tính theo ngày giờ sinh + Cục của
        bạn — không còn là ví dụ minh hoạ. Đại vận chỉ để soi trọng tâm 10 năm, không phải dự đoán
        may rủi.
      </p>

      <DownloadToolPdfButton
        source="pdf-timeline"
        payload={() => {
          if (segments.length === 0) return null;
          const heroPeriod = current ?? segments[0] ?? null;
          if (!heroPeriod) return null;

          const sections: ToolPdfPayload['sections'] = [];

          if (current) {
            const curRows: NonNullable<ToolPdfPayload['sections'][number]['rows']> = [
              { label: 'Cung đại vận', value: current.cung },
              { label: 'Khoảng tuổi', value: `${current.start}–${current.end} tuổi` },
            ];
            if (age != null) curRows.push({ label: 'Tuổi hiện tại', value: `${age} tuổi` });
            if (decCanChi) curRows.push({ label: 'Can chi đại vận', value: decCanChi });
            if (decHoa) curRows.push({ label: 'Tứ Hóa đại vận', value: decHoa });
            sections.push({ heading: 'Đại vận hiện tại', rows: curRows });
          }

          sections.push({
            heading: 'Các đại vận 10 năm',
            rows: segments.map((s) => ({
              label: `${s.start}–${s.end} tuổi`,
              value:
                current != null && s.start === current.start
                  ? `Cung ${s.cung} · đại vận hiện tại`
                  : `Cung ${s.cung}`,
            })),
          });

          sections.push({
            heading: 'Cách đọc dòng chảy đại vận',
            text: 'Mỗi đại vận kéo dài khoảng 10 năm, chuyển lần lượt qua 12 cung theo chiều thuận/nghịch tính từ ngày giờ sinh và Cục của bạn. Đọc theo trình tự tuổi: cung của mỗi giai đoạn cho biết trọng tâm 10 năm đó (bản thân, tài chính, công việc, quan hệ…), còn Tứ Hóa đại vận là điểm nhấn động chồng lên lá số gốc. Đây là khung tham khảo để soi nhịp dài hạn, không phải dự đoán may rủi.',
          });

          return {
            title: 'Timeline Đại Vận — hieu.asia',
            subtitle: 'Chuỗi đại vận 10 năm theo lá số Tử Vi của bạn',
            hero: {
              big: `Đại vận cung ${heroPeriod.cung}`,
              small: `${heroPeriod.start}–${heroPeriod.end} tuổi${
                current ? ' · đại vận hiện tại' : ''
              }`,
            },
            sections,
          };
        }}
      />
    </div>
  );
}

function MutagenResult({
  scope,
  horoscope,
}: {
  scope: 'yearly' | 'monthly';
  horoscope: TuViHoroscope;
}) {
  const sc = scope === 'yearly' ? horoscope.yearly : horoscope.monthly;
  const cc = canChi(sc);
  const hoa = mutagenText(sc?.mutagen);
  if (!hoa) {
    return (
      <p className="text-sm text-muted-foreground">
        Chưa đọc được vận {scope === 'yearly' ? 'năm' : 'tháng'} — thử lập lại lá số.
      </p>
    );
  }
  const isYear = scope === 'yearly';
  const scopeWord = isYear ? 'lưu niên' : 'lưu nguyệt';
  const periodWord = isYear ? 'Năm nay' : 'Tháng này';
  const note = isYear
    ? 'Tứ Hóa lưu niên = điểm nhấn động của riêng năm nay, chồng lên lá số gốc — chỉ để soi trọng tâm, không phải dự đoán may rủi.'
    : 'Tứ Hóa lưu nguyệt = điểm nhấn của riêng tháng này, hẹp hơn lưu niên — chỉ để soi nhịp trong tháng, không phải dự đoán may rủi.';

  return (
    <div className="rounded-xl border border-gold/20 bg-card/40 p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
        Vận {isYear ? 'năm nay' : 'tháng này'}
        {cc ? ` — ${scopeWord} ${cc}` : ''}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground/85">
        {periodWord} an theo can chi {cc && <strong>{cc}</strong>}, kích hoạt bốn sao Tứ Hóa{' '}
        {scopeWord}: <strong>{hoa}</strong>. Bốn sao này là điểm nhấn động — soi xem chúng nằm cung
        nào để biết {isYear ? 'năm' : 'tháng'} nổi bật ở mảng nào (tài chính, công việc, tình cảm,
        sức khỏe…).
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}
