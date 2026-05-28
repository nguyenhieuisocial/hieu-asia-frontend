'use client';

/**
 * /eval — AI Mentor eval framework dashboard.
 *
 * Wave 60.99 — surfaces nightly multi-judge eval scores (claude + openai +
 * google) for the AI Mentor under test. Data comes from WW's Worker at
 *   GET /admin/dashboard/eval-trend?days=30
 * proxied through the admin Edge route (X-Admin-Token injected server-side).
 *
 * Layout mirrors /overview (Wave 60.95.x):
 *   1. Telegram-alert banner (if latest run failed thresholds)
 *   2. Hero card — big judge_avg number + delta + status pill
 *   3. Trend chart — 30-day line chart (judge_avg + per-judge lines)
 *   4. Failure list — latest_failures table
 *   5. Run history — last 30 runs table
 *
 * Degradation: when the Worker endpoint isn't deployed yet (404) or returns
 * zero runs (pre-first-cron), we render an empty-state with a countdown to
 * the next 01:00 VN run so the page looks intentional, not broken.
 */

import * as React from 'react';
import { Brain, RefreshCw } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@hieu-asia/ui';
import { PageHeader } from '@/components/admin/page-header';
import { LiveBadge } from '@/components/admin/live-badge';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import {
  useEvalTrend,
  type EvalRun,
  type EvalFailure,
} from '@/hooks/useEvalTrend';

/* ----------------------------- thresholds ------------------------------- */

const SCORE_GREEN = 9.0;
const SCORE_AMBER = 8.5;
const PERSONA_FAIL_THRESHOLD = 8.5;

/* ------------------------------ status pill ----------------------------- */

type Status = 'green' | 'amber' | 'red';

function scoreStatus(score: number): Status {
  if (score >= SCORE_GREEN) return 'green';
  if (score >= SCORE_AMBER) return 'amber';
  return 'red';
}

interface StatusPillProps {
  status: Status;
  children: React.ReactNode;
}

const PILL_STYLE: Record<Status, string> = {
  green: 'border-jade/40 bg-jade/10 text-jade',
  amber: 'border-gold/40 bg-gold/10 text-gold',
  red: 'border-red-400/40 bg-red-500/10 text-red-200',
};

function StatusPill({ status, children }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider',
        PILL_STYLE[status],
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------- formatting utils --------------------------- */

function fmtScore(v: number | null | undefined, digits = 2): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return '—';
  return v.toFixed(digits);
}

function fmtDateShort(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function fmtDateLong(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso.slice(11, 16);
  }
}

function truncate(s: string, max = 180): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trimEnd()}…`;
}

/* ------------------------ countdown to next 01:00 VN ------------------- */

function nextCronRun(): Date {
  // Cron at 01:00 Asia/Ho_Chi_Minh (UTC+7). Compute in UTC: 01:00 VN = 18:00
  // UTC the previous day. We aim at the upcoming 18:00 UTC.
  const now = new Date();
  const next = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      18,
      0,
      0,
      0,
    ),
  );
  if (next.getTime() <= now.getTime()) {
    next.setUTCDate(next.getUTCDate() + 1);
  }
  return next;
}

function useCountdown(target: Date): string {
  const [, force] = React.useReducer((x: number) => x + 1, 0);
  React.useEffect(() => {
    const id = window.setInterval(() => force(), 30_000);
    return () => window.clearInterval(id);
  }, []);
  const ms = Math.max(0, target.getTime() - Date.now());
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h <= 0 && m <= 0) return 'sắp chạy…';
  if (h <= 0) return `${m} phút`;
  return `${h} giờ ${m} phút`;
}

/* ------------------------------ hero card ------------------------------- */

interface HeroCardProps {
  latest: EvalRun;
  yesterday?: EvalRun;
}

function HeroCard({ latest, yesterday }: HeroCardProps) {
  const status = scoreStatus(latest.judge_avg);
  const delta =
    yesterday !== undefined
      ? latest.judge_avg - yesterday.judge_avg
      : undefined;
  const deltaSign = delta === undefined ? '' : delta >= 0 ? '+' : '';
  const deltaClass =
    delta === undefined
      ? 'text-muted-foreground'
      : delta >= 0.1
        ? 'text-jade'
        : delta <= -0.1
          ? 'text-red-300'
          : 'text-muted-foreground';

  const pillContent =
    status === 'green'
      ? 'Đạt chuẩn'
      : status === 'amber'
        ? 'Cần theo dõi'
        : 'Dưới ngưỡng';

  return (
    <Card className="border-gold/20 bg-card/90">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="font-heading text-base text-foreground/85">
              Judge trung vị mới nhất
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Median của Claude · OpenAI · Google ·{' '}
              {fmtDateLong(latest.created_at)}
            </CardDescription>
          </div>
          <StatusPill status={status}>{pillContent}</StatusPill>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <div className="font-heading text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              {fmtScore(latest.judge_avg)}
              <span className="text-xl text-muted-foreground">/10</span>
            </div>
            <div className={cn('mt-1 font-mono text-xs', deltaClass)}>
              {delta === undefined
                ? 'Chưa có dữ liệu so sánh hôm qua'
                : `${deltaSign}${delta.toFixed(2)} so với hôm trước`}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-1">
            <JudgeCell label="Claude" value={latest.judge_claude} />
            <JudgeCell label="OpenAI" value={latest.judge_openai} />
            <JudgeCell label="Google" value={latest.judge_google} />
          </div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div>
              <span className="font-mono text-foreground/80">
                {latest.persona_failures}
              </span>{' '}
              / {latest.total_personas} persona dưới {PERSONA_FAIL_THRESHOLD}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest">
              {latest.model_under_test} · {latest.prompt_version}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JudgeCell({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-heading text-lg text-foreground">
        {fmtScore(value)}
      </div>
    </div>
  );
}

/* --------------------------- alert banner ------------------------------- */

interface AlertBannerProps {
  latest: EvalRun;
}

function AlertBanner({ latest }: AlertBannerProps) {
  const status = scoreStatus(latest.judge_avg);
  if (status === 'green') return null;

  const alertSent = status === 'red';
  const time = fmtTime(latest.created_at);
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
        alertSent
          ? 'border-red-400/40 bg-red-500/10 text-red-100'
          : 'border-gold/40 bg-gold/10 text-gold',
      )}
    >
      <span aria-hidden className="text-base leading-tight">
        {alertSent ? '🚨' : '⚠️'}
      </span>
      <div className="flex-1">
        <p className="font-semibold">
          {alertSent
            ? `Telegram alert đã gửi cho founder lúc ${time}.`
            : `Score giảm xuống ${fmtScore(latest.judge_avg)} — chưa alert nhưng cần xem.`}
        </p>
        <p className="mt-0.5 text-xs opacity-80">
          Ngưỡng cảnh báo: judge_avg &lt; {SCORE_AMBER} (amber) ·{' '}
          {alertSent ? `judge_avg < ${SCORE_AMBER} → Telegram` : `≥ ${SCORE_AMBER} & < ${SCORE_GREEN}`}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ trend chart ----------------------------- */

interface TrendChartProps {
  runs: EvalRun[];
}

function TrendChart({ runs }: TrendChartProps) {
  // Recharts wants oldest → newest left → right.
  const rows = React.useMemo(() => {
    return [...runs]
      .sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      .map((r) => ({
        date: fmtDateShort(r.created_at),
        avg: Number(r.judge_avg.toFixed(2)),
        claude: Number(r.judge_claude.toFixed(2)),
        openai: Number(r.judge_openai.toFixed(2)),
        google: Number(r.judge_google.toFixed(2)),
      }));
  }, [runs]);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <LineChart
          data={rows}
          margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(184,146,61,0.1)"
          />
          <XAxis
            dataKey="date"
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            domain={[7, 10]}
            stroke="rgba(242,237,227,0.5)"
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,18,0.95)',
              border: '1px solid rgba(184,146,61,0.3)',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: '#B8923D' }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 11,
              color: 'rgba(242,237,227,0.7)',
            }}
          />
          <Line
            type="monotone"
            dataKey="avg"
            stroke="#B8923D"
            strokeWidth={2.5}
            dot={false}
            name="Trung vị 3 judges"
          />
          <Line
            type="monotone"
            dataKey="claude"
            stroke="#D5B057"
            strokeWidth={1}
            dot={false}
            name="Claude"
          />
          <Line
            type="monotone"
            dataKey="openai"
            stroke="#2D5F5A"
            strokeWidth={1}
            dot={false}
            name="OpenAI"
          />
          <Line
            type="monotone"
            dataKey="google"
            stroke="#3B2754"
            strokeWidth={1}
            dot={false}
            name="Google"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ----------------------------- failure list ----------------------------- */

interface FailureListProps {
  failures: EvalFailure[];
}

function FailureList({ failures }: FailureListProps) {
  if (failures.length === 0) {
    return (
      <p className="rounded-md border border-jade/20 bg-jade/5 px-4 py-3 text-sm text-jade/80">
        Không có persona nào dưới {PERSONA_FAIL_THRESHOLD} trong run mới nhất.
      </p>
    );
  }
  return (
    <div className="overflow-hidden rounded-md border border-gold/15">
      <table className="w-full text-sm">
        <thead className="bg-card/60">
          <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <th className="px-3 py-2">Persona</th>
            <th className="px-3 py-2 text-right">Điểm</th>
            <th className="px-3 py-2">Phản hồi của judge</th>
          </tr>
        </thead>
        <tbody>
          {failures.map((f) => (
            <tr
              key={f.persona_id}
              className="border-t border-gold/10 align-top hover:bg-card/40"
            >
              <td className="px-3 py-2.5">
                <div className="font-medium text-foreground">
                  {f.persona_label}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {f.persona_id}
                </div>
              </td>
              <td className="px-3 py-2.5 text-right font-mono text-red-300">
                {fmtScore(f.score)}
              </td>
              <td className="px-3 py-2.5 text-foreground/80">
                {truncate(f.judge_feedback)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------ run history ----------------------------- */

interface RunHistoryProps {
  runs: EvalRun[];
}

function RunHistory({ runs }: RunHistoryProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-gold/15">
      <table className="w-full text-sm">
        <thead className="bg-card/60">
          <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <th className="px-3 py-2">Ngày</th>
            <th className="px-3 py-2 text-right">Judge avg</th>
            <th className="px-3 py-2 text-right">Failures</th>
            <th className="px-3 py-2">Model</th>
            <th className="px-3 py-2">Prompt</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => {
            const s = scoreStatus(r.judge_avg);
            return (
              <tr
                key={r.run_id}
                className="border-t border-gold/10 hover:bg-card/40"
              >
                <td className="px-3 py-2 text-foreground/85">
                  {fmtDateLong(r.created_at)}
                </td>
                <td
                  className={cn(
                    'px-3 py-2 text-right font-mono font-semibold',
                    s === 'green' && 'text-jade',
                    s === 'amber' && 'text-gold',
                    s === 'red' && 'text-red-300',
                  )}
                >
                  {fmtScore(r.judge_avg)}
                </td>
                <td className="px-3 py-2 text-right font-mono text-foreground/80">
                  {r.persona_failures}/{r.total_personas}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  {r.model_under_test}
                </td>
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                  {r.prompt_version}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------- empty state ------------------------------ */

function EvalEmptyState() {
  const target = React.useMemo(() => nextCronRun(), []);
  const countdown = useCountdown(target);
  return (
    <EmptyState
      title="Eval framework đang chờ run đầu tiên."
      description={
        <>
          Cron <span className="font-mono text-gold">01:00 VN</span> sẽ chạy
          batch eval đầu tiên — còn <span className="font-mono">{countdown}</span>.
        </>
      }
    />
  );
}

/* --------------------------------- page --------------------------------- */

export default function EvalPage() {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useEvalTrend();

  const showError = isError || data?.ok === false;
  const errorMsg =
    (error as Error | undefined)?.message ??
    data?.error ??
    'Không tải được dữ liệu eval. Worker endpoint có thể chưa deploy.';

  const runs = data?.runs ?? [];
  const failures = data?.latest_failures ?? [];

  // Latest = most recent by created_at. Worker may return either ordering;
  // sort defensively so the hero card always reflects the right run.
  const sortedRuns = React.useMemo(
    () =>
      [...runs].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    [runs],
  );
  const latest = sortedRuns[0];
  const yesterday = sortedRuns[1];

  const hasData = runs.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eval framework — AI Mentor quality"
        description="Điểm chất lượng AI Mentor đánh giá bởi 3 judge LLM (Claude · OpenAI · Google). Cron nightly 01:00 VN, polling mỗi 5 phút."
        icon={<Brain className="h-5 w-5" />}
        badge={hasData ? <LiveBadge /> : null}
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn('mr-1 h-4 w-4', isFetching && 'animate-spin')}
            />
            {isFetching ? 'Đang tải…' : 'Làm mới'}
          </Button>
        }
      />

      {showError && (
        <ErrorBlock compact message={errorMsg} onRetry={() => refetch()} />
      )}

      {latest && <AlertBanner latest={latest} />}

      {isLoading && !hasData && (
        <Card className="border-gold/20 bg-card/90">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Đang tải dữ liệu eval…
          </CardContent>
        </Card>
      )}

      {!isLoading && !hasData && !showError && <EvalEmptyState />}

      {latest && (
        <>
          <HeroCard latest={latest} yesterday={yesterday} />

          <Card className="border-gold/20 bg-card/90">
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Xu hướng 30 ngày
              </CardTitle>
              <CardDescription className="text-xs">
                Đường vàng đậm = trung vị 3 judges (chỉ số chính). Các đường
                mảnh = từng judge riêng.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart runs={sortedRuns} />
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-card/90">
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Persona thất bại — run mới nhất
              </CardTitle>
              <CardDescription className="text-xs">
                Persona có điểm dưới {PERSONA_FAIL_THRESHOLD}. Trích đoạn phản
                hồi của judge để debug nhanh.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FailureList failures={failures} />
            </CardContent>
          </Card>

          <Card className="border-gold/20 bg-card/90">
            <CardHeader>
              <CardTitle className="font-heading text-base">
                Lịch sử {sortedRuns.length} run gần nhất
              </CardTitle>
              <CardDescription className="text-xs">
                Nightly batch — sắp xếp mới nhất ở trên.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RunHistory runs={sortedRuns} />
            </CardContent>
          </Card>
        </>
      )}

      {data?.generated_at && (
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Snapshot lúc{' '}
          {new Date(data.generated_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
      )}
    </div>
  );
}
