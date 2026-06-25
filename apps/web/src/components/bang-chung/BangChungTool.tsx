'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@hieu-asia/ui';
import {
  backtestChart,
  type LifeCategory,
  type LifeEvent,
  type LossTarget,
} from '@/lib/backtest/backtest-core';
import { scoreEvent, palaceBaseRate, type EventScore, type PalaceBaseRate } from '@/lib/backtest/scoring';
import { forecastTimeline, type ForecastYear } from '@/lib/backtest/forecast';
import { CATEGORY_LABEL, controlCategory } from '@/lib/backtest/palace-map';
import { buildCalibrationTuple, type CalibrationTuple } from '@/lib/backtest/calibration';
import { captureCalibration, isCaptureOptedOut, setCaptureOptedOut } from '@/lib/bang-chung/capture-client';
import { ShareResultButton } from '@/components/tools/ShareResultButton';
import { DownloadToolPdfButton } from '@/components/tools/DownloadToolPdfButton';
import { readSavedProfile, describeProfile } from '@/lib/saved-profile';
import { track } from '@/lib/analytics';
import {
  addPredictions,
  loadJournal,
  partitionByYear,
  predictionsFromForecast,
  removePrediction,
  resolvePrediction,
  trackRecord,
  JOURNAL_EVENT,
  type ForecastOutcome,
  type SavedPrediction,
} from '@/lib/backtest/forecast-journal';
import { getVietnamDateParts } from '@/lib/vn-date';

const CATEGORIES: LifeCategory[] = [
  'career',
  'relationship',
  'wealth',
  'health',
  'relocation',
  'loss',
  'study',
  'childbirth',
];

const LOSS_TARGETS: { value: LossTarget; label: string }[] = [
  { value: 'parent', label: 'Cha mẹ / người trên' },
  { value: 'spouse', label: 'Vợ / chồng / người yêu' },
  { value: 'sibling', label: 'Anh chị em' },
  { value: 'child', label: 'Con cái' },
  { value: 'self', label: 'Sức khỏe bản thân (tai nạn / bệnh nặng)' },
  { value: 'money', label: 'Tiền của / tài sản' },
];

interface EventRow {
  year: string;
  category: LifeCategory;
  lossTarget?: LossTarget;
}

interface ScoredEvent {
  event: LifeEvent;
  score: EventScore;
  baseRate: PalaceBaseRate | null;
}

const nowYear = new Date().getFullYear();
const emptyRow = (): EventRow => ({ year: '', category: 'career' });

function parseHour(t: string): number {
  const h = Number((t ?? '').split(':')[0]);
  return Number.isFinite(h) && h >= 0 && h <= 23 ? h : 12;
}

const GRADE_STYLE: Record<EventScore['grade'], { label: string; cls: string }> = {
  STRONG: { label: 'Khớp mạnh', cls: 'border-jade/40 bg-jade/10 text-jade-700' },
  PARTIAL: { label: 'Khớp một phần', cls: 'border-amber-500/40 bg-amber-500/10 text-amber-700' },
  NONE: { label: 'Không khớp (trượt)', cls: 'border-border bg-muted/40 text-muted-foreground' },
  UNSCORABLE: { label: 'Thiếu thông tin', cls: 'border-rose-500/40 bg-rose-500/10 text-rose-600' },
};

export function BangChungTool() {
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('12:00');
  const [gender, setGender] = React.useState<'male' | 'female'>('male');
  const [rows, setRows] = React.useState<EventRow[]>([emptyRow(), emptyRow(), emptyRow()]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<ScoredEvent[] | null>(null);
  const [savedNote, setSavedNote] = React.useState<string | null>(null);
  const [optOut, setOptOut] = React.useState(false);
  const tracked = React.useRef(false);

  // Read the anonymous-contribution opt-out after mount (avoids SSR hydration mismatch).
  React.useEffect(() => {
    setOptOut(isCaptureOptedOut());
  }, []);
  const toggleOptOut = () =>
    setOptOut((v) => {
      const next = !v;
      setCaptureOptedOut(next);
      return next;
    });

  // Compose with the shared birth profile (saved by other tools / the front-door
  // chart flow) — auto-fill so a user who already cast their chart doesn't re-type.
  React.useEffect(() => {
    const p = readSavedProfile();
    if (p?.birthDate) {
      setDate(p.birthDate);
      if (p.birthTime) setTime(p.birthTime);
      if (p.gender) setGender(p.gender);
      setSavedNote(describeProfile(p));
    }
  }, []);

  const setRow = (i: number, patch: Partial<EventRow>) =>
    setRows((rs) => rs.map((r, k) => (k === i ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => (rs.length >= 7 ? rs : [...rs, emptyRow()]));
  const removeRow = (i: number) => setRows((rs) => (rs.length <= 1 ? rs : rs.filter((_, k) => k !== i)));

  const onRun = React.useCallback(async () => {
    setError(null);
    setResults(null);
    if (!date) {
      setError('Hãy chọn ngày sinh dương lịch.');
      return;
    }
    const birthYear = Number(date.slice(0, 4));
    const events: LifeEvent[] = [];
    for (const r of rows) {
      const y = Number(r.year);
      if (!r.year) continue; // skip blank rows
      if (!Number.isInteger(y) || y < 1900 || y > nowYear) {
        setError(`Năm "${r.year}" không hợp lệ (1900–${nowYear}).`);
        return;
      }
      if (y < birthYear) {
        setError(`Năm sự kiện "${r.year}" không thể trước năm sinh (${birthYear}).`);
        return;
      }
      if (r.category === 'loss' && !r.lossTarget) {
        setError('Với sự kiện "Mất mát", hãy chọn bạn đã mất gì (để chọn đúng cung).');
        return;
      }
      events.push({ year: y, category: r.category, lossTarget: r.lossTarget });
    }
    if (events.length < 1) {
      setError('Hãy nhập ít nhất 1 sự kiện có thật trong quá khứ (khuyên 3–5 để thấy bức tranh thật).');
      return;
    }

    setLoading(true);
    setProgress({ done: 0, total: events.length });
    try {
      const { chart, signals } = await backtestChart(
        { birthSolarDate: date, birthHour: parseHour(time), gender },
        events,
        (done, total) => setProgress({ done, total }),
      );
      const scored: ScoredEvent[] = signals.map((sig, i) => {
        const ev = events[i]!;
        const score = scoreEvent(sig, ev.category, ev.lossTarget);
        const baseRate = chart && score.governingPalace ? palaceBaseRate(chart, score.governingPalace) : null;
        return { event: ev, score, baseRate };
      });
      setResults(scored);
      // Anonymous calibration capture (fire-and-forget): each scored event + its
      // negative-control twin (same chart/era vs a deliberately-wrong category).
      // Only coarse buckets + the verdict leave the browser — never the birth
      // data or the raw year (see calibration.ts). The control is computed from
      // the in-memory chart here; it can never be reconstructed later.
      try {
        const tuples: CalibrationTuple[] = [];
        for (let i = 0; i < signals.length; i++) {
          const sig = signals[i]!;
          const ev = events[i]!;
          const real = scored[i]!;
          const realTuple = buildCalibrationTuple({
            score: real.score,
            realCategory: ev.category,
            lossTarget: ev.lossTarget,
            isControl: false,
            birthYear,
            eventYear: ev.year,
            captureYear: nowYear,
            baseRateHits: real.baseRate?.hits ?? 0,
          });
          if (realTuple) tuples.push(realTuple);

          const ctrlScore = scoreEvent(sig, controlCategory(ev.category));
          const ctrlHits =
            chart && ctrlScore.governingPalace ? palaceBaseRate(chart, ctrlScore.governingPalace).hits : 0;
          const ctrlTuple = buildCalibrationTuple({
            score: ctrlScore,
            realCategory: ev.category,
            lossTarget: ev.lossTarget,
            isControl: true,
            birthYear,
            eventYear: ev.year,
            captureYear: nowYear,
            baseRateHits: ctrlHits,
          });
          if (ctrlTuple) tuples.push(ctrlTuple);
        }
        captureCalibration(tuples);
      } catch {
        /* capture must never affect the user-facing result */
      }
      if (!tracked.current) {
        tracked.current = true;
        track('tool_used', { tool: 'bang-chung', events: events.length });
      }
    } catch {
      setError('Chưa đối chiếu được — thử lại sau giây lát (hệ thống giới hạn số lần tra cứu liên tục).');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, [date, time, gender, rows]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Nhập ngày sinh &amp; vài sự kiện THẬT đã xảy ra</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="bcDate">Ngày sinh (dương lịch)</Label>
              <Input id="bcDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bcTime">Giờ sinh</Label>
              <Input id="bcTime" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bcGender">Giới tính</Label>
              <select
                id="bcGender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </div>
          </div>

          {savedNote && (
            <p className="text-xs text-muted-foreground">
              Đã điền sẵn từ thông tin bạn đã lưu: <strong>{savedNote}</strong>
            </p>
          )}

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Sự kiện đời thật (chọn lĩnh vực &amp; năm — khai TRƯỚC, để hệ thống không &ldquo;xem rồi đoán ngược&rdquo;)
            </p>
            {rows.map((r, i) => (
              <div key={i} className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-card/30 p-3">
                <div className="space-y-1">
                  <Label htmlFor={`cat${i}`} className="text-xs">Lĩnh vực</Label>
                  <select
                    id={`cat${i}`}
                    value={r.category}
                    onChange={(e) => setRow(i, { category: e.target.value as LifeCategory, lossTarget: undefined })}
                    className="flex h-9 w-44 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                    ))}
                  </select>
                </div>
                {r.category === 'loss' && (
                  <div className="space-y-1">
                    <Label htmlFor={`loss${i}`} className="text-xs">Mất gì?</Label>
                    <select
                      id={`loss${i}`}
                      value={r.lossTarget ?? ''}
                      onChange={(e) => setRow(i, { lossTarget: (e.target.value || undefined) as LossTarget | undefined })}
                      className="flex h-9 w-56 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">— chọn —</option>
                      {LOSS_TARGETS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="space-y-1">
                  <Label htmlFor={`yr${i}`} className="text-xs">Năm (dương lịch)</Label>
                  <Input
                    id={`yr${i}`}
                    type="number"
                    inputMode="numeric"
                    min={1900}
                    max={nowYear}
                    placeholder="vd 2018"
                    value={r.year}
                    onChange={(e) => setRow(i, { year: e.target.value })}
                    className="w-28"
                  />
                </div>
                {rows.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeRow(i)} className="text-muted-foreground">
                    Xóa
                  </Button>
                )}
              </div>
            ))}
            {rows.length < 7 && (
              <Button type="button" variant="outline" size="sm" onClick={addRow}>
                + Thêm sự kiện
              </Button>
            )}
          </div>

          <Button onClick={() => void onRun()} disabled={loading} size="lg">
            {loading
              ? progress
                ? `Đang đối chiếu… (${progress.done}/${progress.total})`
                : 'Đang đối chiếu…'
              : '✦ Đối chiếu lá số với quá khứ của tôi'}
          </Button>
          {loading && (
            <p className="text-xs text-muted-foreground">
              Hệ thống tính lại lá số đúng như nó đứng ở từng năm bạn nhập — mất ~vài giây mỗi năm.
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}

          <p className="text-xs leading-relaxed text-muted-foreground">
            Kết quả được lưu <strong>ẩn danh</strong> để đo độ chính xác công khai —{' '}
            <strong>không gồm</strong> ngày/giờ sinh, <strong>không gồm</strong> năm sự kiện, không có thông tin
            nhận dạng.{' '}
            <Link
              href="/bang-chung/do-chinh-xac#rieng-tu"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Vì sao an toàn?
            </Link>{' '}
            ·{' '}
            <button
              type="button"
              onClick={toggleOptOut}
              className="underline underline-offset-2 hover:text-foreground"
            >
              {optOut ? 'Bật lại đóng góp ẩn danh' : 'Không đóng góp dữ liệu ẩn danh'}
            </button>
            {optOut && <span className="text-jade-700"> · đã tắt</span>}
          </p>
        </CardContent>
      </Card>

      {results && <ResultsView results={results} />}

      {results && (
        <ForecastSection birthSolarDate={date} birthHour={parseHour(time)} gender={gender} />
      )}

      <ForecastJournalPanel />

      <MethodologyNote />
    </div>
  );
}

function ResultsView({ results }: { results: ScoredEvent[] }) {
  const scorable = results.filter((r) => r.score.grade !== 'UNSCORABLE');
  const strong = scorable.filter((r) => r.score.grade === 'STRONG').length;
  const partial = scorable.filter((r) => r.score.grade === 'PARTIAL').length;
  const hit = strong + partial;
  const avgBase =
    scorable.length > 0
      ? scorable.reduce((a, r) => a + (r.baseRate?.rate ?? 0), 0) / scorable.length
      : 0;

  return (
    <div className="space-y-4">
      <Card className="border-gold/30 bg-gradient-to-br from-gold/10 to-transparent">
        <CardHeader>
          <CardTitle className="text-base">Kết quả đối chiếu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {scorable.length > 0 ? (
            <>
              <p className="text-sm leading-relaxed text-foreground/85">
                Lá số cho thấy <strong>{hit}/{scorable.length}</strong> sự kiện rơi đúng vào lĩnh vực được kích hoạt
                {' '}(<strong className="text-jade-700">{strong} khớp mạnh</strong>, {partial} khớp một phần).
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Để công bằng: trung bình một cung &ldquo;sáng&rdquo; do trùng hợp khoảng{' '}
                <strong>{Math.round(avgBase * 100)}%</strong> số năm. Vì vậy hãy nhìn <strong>tổng thể nhiều sự kiện</strong>,
                đừng vin vào một lần trúng đơn lẻ. Các lần &ldquo;trượt&rdquo; được tính thành thật ở dưới.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <ShareResultButton
                  path={`/bang-chung?hit=${hit}&total=${scorable.length}&strong=${strong}`}
                  title="Bằng Chứng — tôi đối chiếu lá số với đời thật"
                  text={`Tôi tự đối chiếu lá số với quá khứ thật của mình: trùng khớp ${hit}/${scorable.length} mốc — kiểm chứng được, không bói mù (xem cả mốc trật). Thử với đời bạn:`}
                  trackId="bang-chung"
                  label="Chia sẻ kết quả ✦"
                />
                <DownloadToolPdfButton
                  source="pdf-bang-chung"
                  payload={() => {
                    if (results.length === 0) return null;
                    const verdictRows = results.map((r) => ({
                      label: `${CATEGORY_LABEL[r.event.category]}${r.event.year ? ` · ${r.event.year}` : ''}`,
                      value: GRADE_STYLE[r.score.grade].label,
                    }));
                    return {
                      title: 'Bằng Chứng — đối chiếu lá số với đời thật — hieu.asia',
                      subtitle:
                        'Backtest trung thực: lá số được tính lại đúng như nó đứng ở từng năm, ' +
                        'kể cả những lần KHÔNG khớp.',
                      hero:
                        scorable.length > 0
                          ? {
                              big: `${hit}/${scorable.length} sự kiện có dấu trong lá số`,
                              small: `${strong} khớp mạnh · ${partial} khớp một phần · mức "ngẫu nhiên" để so sánh ~${Math.round(avgBase * 100)}%`,
                            }
                          : { big: 'Chưa có sự kiện nào đủ thông tin để chấm' },
                      sections: [
                        {
                          heading: 'Tổng quan đối chiếu',
                          rows: [
                            { label: 'Số sự kiện chấm được', value: `${scorable.length}` },
                            { label: 'Khớp (mạnh + một phần)', value: `${hit}/${scorable.length}`, bar: scorable.length > 0 ? Math.round((hit / scorable.length) * 100) : 0 },
                            { label: 'Khớp mạnh', value: `${strong}` },
                            { label: 'Khớp một phần', value: `${partial}` },
                            { label: 'Mức "ngẫu nhiên" trung bình', value: `${Math.round(avgBase * 100)}%` },
                          ],
                        },
                        {
                          heading: 'Từng sự kiện — khớp hay trượt',
                          rows: verdictRows,
                        },
                        ...results.map((r) => ({
                          heading: `${CATEGORY_LABEL[r.event.category]}${r.event.year ? ` · ${r.event.year}` : ''} — ${GRADE_STYLE[r.score.grade].label}`,
                          text:
                            r.score.reason +
                            (r.score.governingPalace ? `\n\nCung chủ quản: ${r.score.governingPalace}.` : '') +
                            (r.baseRate && r.score.grade !== 'NONE' && r.score.grade !== 'UNSCORABLE'
                              ? `\nCung ${r.score.governingPalace} được Tứ Hóa "chiếu tới" khoảng ${r.baseRate.hits}/${r.baseRate.total} số năm → mức "ngẫu nhiên" để so sánh.`
                              : ''),
                        })),
                        {
                          heading: 'Đọc đúng con số',
                          text:
                            'Đây là dấu hiệu một lĩnh vực được NHẤN trong năm — KHÔNG phải lá số "đoán" được sự kiện ' +
                            'cụ thể. Hãy nhìn tổng thể nhiều sự kiện, đừng vin vào một lần trúng đơn lẻ; mọi lần ' +
                            '"trượt" đều được tính thành thật. Cung chủ quản được khóa trước theo bảng cổ điển, ' +
                            'KHÔNG xem lá số rồi mới gán.',
                        },
                      ],
                    };
                  }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có sự kiện nào đủ thông tin để chấm.</p>
          )}
        </CardContent>
      </Card>

      {results.map((r, i) => {
        const g = GRADE_STYLE[r.score.grade];
        return (
          <Card key={i}>
            <CardContent className="space-y-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-medium text-foreground">
                  {CATEGORY_LABEL[r.event.category]}
                  {r.event.year ? ` · ${r.event.year}` : ''}
                  {r.score.governingPalace ? (
                    <span className="text-xs text-muted-foreground"> (cung {r.score.governingPalace})</span>
                  ) : null}
                </div>
                <span className={`inline-flex shrink-0 rounded-full border px-3 py-0.5 text-xs font-medium ${g.cls}`}>
                  {g.label}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">{r.score.reason}</p>
              {r.baseRate && r.score.grade !== 'NONE' && r.score.grade !== 'UNSCORABLE' && (
                <p className="text-xs text-muted-foreground">
                  Cung {r.score.governingPalace} của lá số bạn được Tứ Hóa &ldquo;chiếu tới&rdquo; khoảng{' '}
                  {r.baseRate.hits}/{r.baseRate.total} số năm → mức &ldquo;ngẫu nhiên&rdquo; để so sánh.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}

      <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5 text-center">
        <p className="font-heading text-lg text-foreground">Lá số đã &ldquo;ghi đúng&rdquo; quá khứ của bạn?</p>
        <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
          Bản đọc đầy đủ sẽ luận sâu lá số này cho hiện tại &amp; chặng tới — văn phong &ldquo;hiểu mình để tự quyết&rdquo;,
          không phán định mệnh.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/onboarding">Tạo bản đọc đầy đủ →</Link>
        </Button>
      </div>
    </div>
  );
}

function ForecastSection({
  birthSolarDate,
  birthHour,
  gender,
}: {
  birthSolarDate: string;
  birthHour: number;
  gender: 'male' | 'female';
}) {
  const N = 5;
  const [forecast, setForecast] = React.useState<ForecastYear[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState<{ done: number; total: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState<{ added: number; total: number } | null>(null);

  const onForecast = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    setProgress({ done: 0, total: N });
    try {
      const { years } = await forecastTimeline(
        { birthSolarDate, birthHour, gender },
        nowYear,
        N,
        (done, total) => setProgress({ done, total }),
      );
      setForecast(years);
      track('tool_used', { tool: 'bang-chung-forecast', years: N });
    } catch {
      setError('Chưa xem được — thử lại sau giây lát (hệ thống giới hạn số lần tra cứu liên tục).');
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, [birthSolarDate, birthHour, gender]);

  return (
    <Card className="border-gold/20 bg-card/40">
      <CardHeader>
        <CardTitle className="text-base">Vài năm tới — lĩnh vực lá số nhấn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!forecast && (
          <>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Lá số đã &ldquo;ghi đúng&rdquo; quá khứ của bạn? Cùng phương pháp đó cho thấy {N} năm tới lá số
              NHẤN vào lĩnh vực nào — để bạn <strong>chủ động chuẩn bị</strong>, không phải lời tiên đoán.
            </p>
            <Button onClick={() => void onForecast()} disabled={loading} size="lg" variant="outline">
              {loading
                ? progress
                  ? `Đang xem… (${progress.done}/${progress.total})`
                  : 'Đang xem…'
                : `Lá số nhấn gì trong ${N} năm tới? →`}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </>
        )}
        {forecast && (
          <>
            <div className="space-y-3">
              {forecast.map((y) => {
                const strong = y.domains.filter((d) => d.grade === 'STRONG');
                const partial = y.domains.filter((d) => d.grade === 'PARTIAL');
                return (
                  <div key={y.year} className="rounded-xl border border-border bg-background/40 p-4">
                    <div className="font-heading text-base font-semibold text-foreground">
                      {y.year}
                      {y.age != null ? ` · ${y.age} tuổi` : ''}
                    </div>
                    {strong.length > 0 ? (
                      <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                        Lá số nhấn <strong className="text-jade-700">mạnh</strong>:{' '}
                        {strong.map((d) => CATEGORY_LABEL[d.category]).join(', ')}.
                        {partial.length > 0 && (
                          <span className="text-muted-foreground"> (+{partial.length} lĩnh vực chỉ chớm nhẹ)</span>
                        )}
                      </p>
                    ) : partial.length > 0 ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Không có lĩnh vực nổi bật mạnh — chỉ {partial.length} chủ đề chớm nhẹ (mức &ldquo;ngẫu nhiên&rdquo;,
                        chưa đáng kể).
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Năm tương đối tĩnh — lá số không nhấn lĩnh vực nào rõ.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Đây là những <strong>lĩnh vực được nhấn</strong> theo lá số từng năm — một{' '}
              <strong>chủ đề để chủ động</strong>, KHÔNG phải dự đoán sự kiện cụ thể. Nhiều năm sẽ có vài
              lĩnh vực cùng &ldquo;sáng&rdquo; (chuyện thường của lá số), nên hãy chú ý nhất vào mục{' '}
              <strong>nhấn mạnh</strong>.
            </p>
            {(() => {
              const strongCount = forecast.reduce(
                (n, y) => n + y.domains.filter((d) => d.grade === 'STRONG').length,
                0,
              );
              if (strongCount === 0) return null;
              return (
                <div className="rounded-xl border border-jade/30 bg-jade/5 p-4">
                  <p className="text-sm leading-relaxed text-foreground/85">
                    <strong>Theo dõi để tự kiểm:</strong> lưu {strongCount} dự báo nhấn-mạnh
                    này vào sổ riêng (chỉ nằm trên máy bạn). Vài năm nữa quay lại đánh dấu
                    điều nào đã ứng — đó mới là cách trung thực để biết lá số có đúng,
                    thay vì tự nhủ &ldquo;thấy đúng&rdquo;.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    disabled={saved != null}
                    onClick={() => {
                      const r = addPredictions(
                        predictionsFromForecast(forecast, new Date().toISOString()),
                      );
                      setSaved(r);
                      track('tool_used', { tool: 'bang-chung-forecast-saved', count: r.added });
                    }}
                  >
                    {saved
                      ? `✓ Đã lưu vào sổ theo dõi (${saved.total} dự báo)`
                      : `📌 Theo dõi ${strongCount} dự báo này`}
                  </Button>
                </div>
              );
            })()}
            <div className="rounded-xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5 text-center">
              <p className="font-heading text-lg text-foreground">Muốn hiểu sâu các chủ đề này để chuẩn bị?</p>
              <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
                Bản đọc đầy đủ luận từng giai đoạn theo lá số của bạn — &ldquo;hiểu mình để tự quyết&rdquo;,
                không phán định mệnh.
              </p>
              <Button asChild size="lg" className="mt-4">
                <Link href="/onboarding">Tạo bản đọc đầy đủ →</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

/** Outcome chip — a tiny status badge for one saved prediction. */
function OutcomeBadge({ outcome }: { outcome: ForecastOutcome }) {
  if (outcome === 'occurred')
    return <span className="rounded-full bg-jade/15 px-2 py-0.5 text-xs font-semibold text-jade-700">Đã ứng nghiệm</span>;
  if (outcome === 'absent')
    return <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">Không xảy ra</span>;
  return <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">Chưa đánh dấu</span>;
}

/**
 * "Sổ theo dõi dự báo" — the forecast→outcome loop, client-held (localStorage).
 * Self-hydrates on mount and re-reads on the journal-changed event, so saving a
 * forecast (in ForecastSection) makes it appear here without prop-drilling. Renders
 * nothing until the user has saved at least one prediction.
 */
function ForecastJournalPanel() {
  const [list, setList] = React.useState<SavedPrediction[]>([]);
  // VN year (almanac clock), not the device clock — same source as the canh-giờ.
  // Declared before the early return so the hook order stays stable.
  const currentYear = React.useMemo(() => getVietnamDateParts(new Date()).year, []);

  React.useEffect(() => {
    const sync = () => setList(loadJournal());
    sync();
    window.addEventListener(JOURNAL_EVENT, sync);
    return () => window.removeEventListener(JOURNAL_EVENT, sync);
  }, []);

  if (list.length === 0) return null;

  const rec = trackRecord(list);
  const { ready, upcoming } = partitionByYear(list, currentYear);
  const onResolve = (id: string, outcome: ForecastOutcome) =>
    setList(resolvePrediction(id, outcome, new Date().toISOString()));
  const onRemove = (id: string) => setList(removePrediction(id));
  const chip = (active: boolean) =>
    `rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
      active
        ? 'border-jade/50 bg-jade/15 text-jade-700'
        : 'border-border text-muted-foreground hover:bg-muted'
    }`;

  const row = (p: SavedPrediction, canJudge: boolean) => (
    <li key={p.id} className="rounded-lg border border-border bg-background/40 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm text-foreground/90">
          <strong>{p.targetYear}</strong> · lá số nhấn{' '}
          <strong className="text-jade-700">{CATEGORY_LABEL[p.category]}</strong>
          <span className="ml-1 text-xs text-muted-foreground">
            (ghi {new Date(p.createdAt).toLocaleDateString('vi-VN')})
          </span>
        </div>
        {canJudge ? (
          <OutcomeBadge outcome={p.outcome} />
        ) : (
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">Chưa tới</span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {canJudge ? (
          <>
            <button type="button" className={chip(p.outcome === 'occurred')} onClick={() => onResolve(p.id, 'occurred')}>
              Đã xảy ra
            </button>
            <button type="button" className={chip(p.outcome === 'absent')} onClick={() => onResolve(p.id, 'absent')}>
              Không xảy ra
            </button>
            {p.outcome !== 'pending' && (
              <button type="button" className="rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:underline" onClick={() => onResolve(p.id, 'pending')}>
                Bỏ đánh dấu
              </button>
            )}
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Chờ đến năm {p.targetYear} mới đánh giá được.</span>
        )}
        <button type="button" className="ml-auto rounded-md px-2.5 py-1 text-xs text-muted-foreground/70 hover:text-destructive" onClick={() => onRemove(p.id)}>
          Xoá
        </button>
      </div>
    </li>
  );

  return (
    <Card className="border-jade/30 bg-jade/5">
      <CardHeader>
        <CardTitle className="text-base">📒 Sổ theo dõi dự báo của bạn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Riêng tư tuyệt đối — sổ này chỉ nằm trên máy bạn, không gửi đi đâu. Mỗi dòng ghi rõ{' '}
          <strong>ngày bạn lưu</strong> (trước khi biết kết quả) để việc tự kiểm công bằng. Hãy
          đánh dấu thật cả khi <strong>KHÔNG xảy ra</strong> — chỗ trật mới cho biết lá số đúng tới đâu.
        </p>

        {rec.resolved > 0 && (
          <div className="rounded-lg border border-border bg-background/50 p-3 text-sm text-foreground/90">
            Bạn đã đánh giá <strong>{rec.resolved}</strong> dự báo:{' '}
            <span className="font-semibold text-jade-700">{rec.occurred} đã ứng</span> ·{' '}
            <span className="text-muted-foreground">{rec.absent} không</span>
            {rec.pending > 0 && <> · {rec.pending} đang chờ</>}.
            {rec.resolved < 5 && (
              <span className="mt-1 block text-xs text-muted-foreground">
                (Mẫu còn nhỏ — đây là tự-kiểm cá nhân để bạn tham khảo, chưa phải bằng chứng thống kê.)
              </span>
            )}
          </div>
        )}

        {ready.length > 0 && (
          <div className="space-y-2">
            {upcoming.length > 0 && (
              <p className="text-xs font-semibold text-foreground/70">Có thể đánh giá (năm đã tới)</p>
            )}
            <ul className="space-y-2">{ready.map((p) => row(p, true))}</ul>
          </div>
        )}

        {upcoming.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">⏳ Chưa tới — chờ tới lượt</p>
            <ul className="space-y-2">{upcoming.map((p) => row(p, false))}</ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MethodologyNote() {
  return (
    <Card className="border-border bg-card/40">
      <CardHeader>
        <CardTitle className="text-sm">Cách tính &amp; giới hạn (đọc để hiểu đúng)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs leading-relaxed text-muted-foreground">
        <p>
          Mỗi sự kiện, hệ thống tính lại lá số <strong>đúng như nó đứng ở năm đó</strong> (đại vận, lưu niên, Tứ Hóa) và
          kiểm xem <strong>cung chủ quản</strong> của lĩnh vực bạn khai có được kích hoạt không. Cung chủ quản được
          <strong> khóa trước</strong> theo bảng cổ điển (Phu Thê = hôn nhân, Quan Lộc = sự nghiệp, Tật Ách = sức khỏe…),
          KHÔNG xem lá số rồi mới gán.
        </p>
        <p>
          Đây là <strong>dấu hiệu một lĩnh vực được NHẤN trong năm</strong> — KHÔNG phải lá số &ldquo;đoán&rdquo; được sự
          kiện cụ thể (cùng một kích hoạt có thể ứng với nhiều kết cục). Mọi lần &ldquo;trượt&rdquo; đều được hiện ra
          thành thật, và luôn kèm mức &ldquo;ngẫu nhiên&rdquo; để bạn tự đánh giá. Con số được tính từ engine kiểm chứng
          được — đây là tinh thần &ldquo;không bói mù&rdquo;.
        </p>
      </CardContent>
    </Card>
  );
}
