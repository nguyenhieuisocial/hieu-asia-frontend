/**
 * /admin/posthog — PostHog setup status + live data tiles + dashboard portal.
 *
 * Wave 42.5 — server-rendered with live tiles fetched from the PostHog
 * Query API (HogQL). Personal API key (`POSTHOG_PERSONAL_API_KEY`) is
 * server-side only — see `apps/admin/src/lib/posthog-server.ts`.
 *
 * Each tile fetch is wrapped in `Suspense` so the page streams: the
 * config + portal sections render immediately, live tiles fill in as
 * PostHog responds. On any failure (missing key, network, non-2xx) the
 * tile shows "—" with a tooltip — the page never crashes.
 *
 * Caching: each HogQL fetch uses `next: { revalidate: 60 }` so the
 * PostHog Query API is hit at most once per minute per unique query.
 *
 * Environment:
 *   POSTHOG_PERSONAL_API_KEY           — server-side, required for tiles
 *   POSTHOG_PROJECT_ID                 — defaults to 434217
 *   POSTHOG_API_HOST                   — defaults to https://us.posthog.com
 *   NEXT_PUBLIC_POSTHOG_KEY            — present on web app
 *   NEXT_PUBLIC_POSTHOG_HOST           — overrides default US host
 *   NEXT_PUBLIC_POSTHOG_DASHBOARD_URL  — full URL to the org's dashboard
 *   NEXT_PUBLIC_POSTHOG_PROJECT_ID     — project id, used for deep links
 */

import * as React from 'react';
import { Suspense } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import {
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Users,
  ClipboardList,
  Flag,
  Eye,
  Wrench,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LiveBadge } from '@/components/admin/live-badge';
import {
  fetchEvents24h,
  fetchUniqueUsers24h,
  fetchSurveyResponses,
  fetchFeatureFlagExposure,
  fetchTopPageviews,
  fetchTopTools,
  isPostHogServerConfigured,
} from '@/lib/posthog-server';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Wave 40/41 — US Cloud is the project we actually use.
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';
const DASHBOARD_URL = process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_URL;
const PROJECT_ID = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID;

// Wave 39 W-B — the 5 strategic survey UUIDs, mirrored from
// apps/web/src/lib/survey.ts so we can label per-survey response counts.
const SURVEY_LABELS: Record<string, string> = {
  '019e5031-4caf-0000-cc97-f5926c58e347': 'Onboarding NPS',
  '019e5031-3fa6-0000-6518-4e5cab637d8d': 'Reading satisfaction',
  '019e5031-5576-0000-2054-896831998be8': 'Churn risk',
  '019e5031-45eb-0000-43b1-89f46b4aa2d2': 'Pricing intent',
  '019e5031-5b44-0000-f657-ff8606541660': 'Feature request',
};

interface StatusRow {
  label: string;
  ok: boolean;
  value: string;
  hint?: string;
}

function StatusItem({ row }: { row: StatusRow }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gold/10 py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {row.ok ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-400" aria-hidden />
          )}
          <span className="text-sm font-medium text-foreground">{row.label}</span>
        </div>
        {row.hint && (
          <p className="ml-6 mt-1 text-xs text-muted-foreground">{row.hint}</p>
        )}
      </div>
      <code className="shrink-0 truncate font-mono text-xs text-muted-foreground">
        {row.value}
      </code>
    </div>
  );
}

// ─── Live tiles ────────────────────────────────────────────────────────────

function Tile({
  label,
  icon,
  value,
  hint,
}: {
  label: string;
  icon: React.ReactNode;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div
      className="rounded-xl border border-gold/15 bg-card p-5 backdrop-blur-sm"
      title={hint}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span
          className="rounded-md border border-gold/15 bg-card/60 p-1.5 text-gold/80"
          aria-hidden
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PlaceholderValue({ tooltip }: { tooltip: string }) {
  return (
    <span
      className="cursor-help text-muted-foreground"
      title={tooltip}
      aria-label={tooltip}
    >
      —
    </span>
  );
}

function fmtNum(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

async function Events24hTile() {
  const v = await fetchEvents24h();
  return (
    <Tile
      label="Events 24h"
      icon={<Activity className="h-4 w-4" />}
      value={
        v === null ? (
          <PlaceholderValue tooltip="PostHog Query API không phản hồi — kiểm tra POSTHOG_PERSONAL_API_KEY." />
        ) : (
          fmtNum(v)
        )
      }
      hint="Tổng event 24 giờ qua (HogQL)."
    />
  );
}

async function UniqueUsers24hTile() {
  const v = await fetchUniqueUsers24h();
  return (
    <Tile
      label="Unique users 24h"
      icon={<Users className="h-4 w-4" />}
      value={
        v === null ? (
          <PlaceholderValue tooltip="PostHog Query API không phản hồi." />
        ) : (
          fmtNum(v)
        )
      }
      hint="Distinct person_id phát event trong 24h."
    />
  );
}

async function SurveyResponsesTile() {
  const rows = await fetchSurveyResponses();
  if (rows === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ClipboardList className="h-4 w-4 text-gold/80" />
            Survey responses (7 ngày)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PlaceholderValue tooltip="PostHog Query API không phản hồi." />
        </CardContent>
      </Card>
    );
  }
  const total = rows.reduce((acc, r) => acc + r.count, 0);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <ClipboardList className="h-4 w-4 text-gold/80" />
          Survey responses (7 ngày)
        </CardTitle>
        <CardDescription>
          Tổng: <span className="font-mono text-foreground">{fmtNum(total)}</span>
          {' · '}sự kiện <code>survey sent</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa có phản hồi nào trong 7 ngày qua.
          </p>
        ) : (
          rows.map((r) => (
            <div
              key={r.surveyId}
              className="flex items-center justify-between gap-3 border-b border-gold/10 py-2 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-sm text-foreground">
                  {SURVEY_LABELS[r.surveyId] ?? '(không xác định)'}
                </p>
                <code className="text-[10px] text-muted-foreground">
                  {r.surveyId}
                </code>
              </div>
              <span className="font-mono text-sm text-foreground">
                {fmtNum(r.count)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

async function FeatureFlagExposureTile() {
  const rows = await fetchFeatureFlagExposure();
  if (rows === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Flag className="h-4 w-4 text-gold/80" />
            Feature flag exposure (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PlaceholderValue tooltip="PostHog Query API không phản hồi." />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Flag className="h-4 w-4 text-gold/80" />
          Feature flag exposure (24h)
        </CardTitle>
        <CardDescription>
          Sự kiện <code>$feature_flag_called</code> group theo flag.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có exposure nào.</p>
        ) : (
          rows.map((r) => (
            <div
              key={r.flagKey}
              className="flex items-center justify-between gap-3 border-b border-gold/10 py-2 last:border-b-0"
            >
              <code className="truncate text-sm text-foreground">{r.flagKey}</code>
              <span className="font-mono text-sm text-foreground">
                {fmtNum(r.count)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

async function TopPageviewsTile() {
  const rows = await fetchTopPageviews();
  if (rows === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4 text-gold/80" />
            Top pageviews (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PlaceholderValue tooltip="PostHog Query API không phản hồi." />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Eye className="h-4 w-4 text-gold/80" />
          Top pageviews (24h)
        </CardTitle>
        <CardDescription>
          Top 5 <code>$pathname</code> theo số $pageview.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có pageview nào.</p>
        ) : (
          rows.map((r, i) => (
            <div
              key={`${r.url}-${i}`}
              className="flex items-center justify-between gap-3 border-b border-gold/10 py-2 last:border-b-0"
            >
              <code className="truncate text-sm text-foreground">{r.url}</code>
              <span className="font-mono text-sm text-foreground">
                {fmtNum(r.count)}
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

async function ToolUsageTile() {
  const rows = await fetchTopTools();
  if (rows === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Wrench className="h-4 w-4 text-gold/80" />
            Top công cụ (30 ngày)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PlaceholderValue tooltip="PostHog Query API không phản hồi." />
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Wrench className="h-4 w-4 text-gold/80" />
          Top công cụ (30 ngày)
        </CardTitle>
        <CardDescription>
          Người dùng <code>tool_used</code> + tỉ lệ{' '}
          <span className="text-emerald-400">→ trả tiền</span> theo công cụ (deepen-first).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa có lượt dùng công cụ nào trong 30 ngày.
          </p>
        ) : (
          rows.map((r) => (
            <div
              key={r.tool}
              className="flex items-center justify-between gap-3 border-b border-gold/10 py-2 last:border-b-0"
            >
              <code className="truncate text-sm text-foreground">{r.tool}</code>
              <div className="flex shrink-0 items-center gap-3">
                {r.errorRate > 0 && (
                  <span
                    className="font-mono text-[10px] text-amber-300"
                    title="Tỉ lệ lỗi của công cụ"
                  >
                    {(r.errorRate * 100).toFixed(0)}% lỗi
                  </span>
                )}
                {r.paidUsers > 0 ? (
                  <span
                    className="font-mono text-[11px] text-emerald-400"
                    title={`${r.paidUsers}/${r.users} người dùng công cụ này rồi trả tiền (30 ngày)`}
                  >
                    {(r.conversionRate * 100).toFixed(0)}% → trả tiền
                  </span>
                ) : (
                  <span
                    className="font-mono text-[11px] text-muted-foreground"
                    title="Chưa có người dùng công cụ này trả tiền trong 30 ngày"
                  >
                    —
                  </span>
                )}
                <span
                  className="font-mono text-sm text-foreground"
                  title={`${r.users} người · ${r.uses} lượt`}
                >
                  {fmtNum(r.users)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function TileSkeleton({ label }: { label: string }) {
  return (
    <Tile
      label={label}
      icon={<Activity className="h-4 w-4 animate-pulse" />}
      value={<span className="text-muted-foreground">…</span>}
    />
  );
}

function CardSkeleton({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-muted-foreground">…</span>
      </CardContent>
    </Card>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AdminPostHogPage() {
  const status: StatusRow[] = [
    {
      label: 'NEXT_PUBLIC_POSTHOG_KEY',
      ok: !!POSTHOG_KEY,
      value: POSTHOG_KEY ? `${POSTHOG_KEY.slice(0, 8)}…` : '(unset)',
      hint: 'Client-side capture key. Required for any event flow.',
    },
    {
      label: 'NEXT_PUBLIC_POSTHOG_HOST',
      ok: true,
      value: POSTHOG_HOST,
      hint: 'API ingest host. US Cloud (project 434217).',
    },
    {
      label: 'NEXT_PUBLIC_POSTHOG_DASHBOARD_URL',
      ok: !!DASHBOARD_URL,
      value: DASHBOARD_URL ?? '(unset)',
      hint: 'Browser URL where operators view dashboards.',
    },
    {
      label: 'NEXT_PUBLIC_POSTHOG_PROJECT_ID',
      ok: !!PROJECT_ID,
      value: PROJECT_ID ?? '(unset)',
      hint: 'Used to deep-link from this page into events/recordings.',
    },
    {
      label: 'POSTHOG_PERSONAL_API_KEY',
      ok: isPostHogServerConfigured(),
      value: isPostHogServerConfigured() ? '(set)' : '(unset)',
      hint: 'Server-side key for HogQL Query API. Required for live tiles.',
    },
  ];

  const deepLink = (slug: string) =>
    DASHBOARD_URL ? `${DASHBOARD_URL.replace(/\/$/, '')}/${slug}` : undefined;

  const configuredCount = status.filter((s) => s.ok).length;
  const fullyConfigured = configuredCount === status.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="PostHog"
        description="Trạng thái config + live tiles + portal sang dashboard. Phân tích chi tiết (funnel, replay) sống tại posthog.com."
        icon={<Activity className="h-5 w-5" />}
        badge={
          fullyConfigured ? (
            <LiveBadge tone="jade" />
          ) : (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-200">
              {configuredCount}/{status.length} cấu hình
            </span>
          )
        }
      />

      {/* Live tiles — server-fetched via HogQL, cached 60s. */}
      <section aria-label="Live data tiles" className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Suspense fallback={<TileSkeleton label="Events 24h" />}>
            <Events24hTile />
          </Suspense>
          <Suspense fallback={<TileSkeleton label="Unique users 24h" />}>
            <UniqueUsers24hTile />
          </Suspense>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Suspense fallback={<CardSkeleton label="Survey responses" />}>
            <SurveyResponsesTile />
          </Suspense>
          <Suspense fallback={<CardSkeleton label="Feature flag exposure" />}>
            <FeatureFlagExposureTile />
          </Suspense>
        </div>

        <Suspense fallback={<CardSkeleton label="Top pageviews" />}>
          <TopPageviewsTile />
        </Suspense>

        <Suspense fallback={<CardSkeleton label="Top công cụ" />}>
          <ToolUsageTile />
        </Suspense>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Trạng thái cấu hình</CardTitle>
          <CardDescription>
            Đọc từ runtime env. Đổi giá trị qua deploy config.
          </CardDescription>
        </CardHeader>
        <CardContent className="font-mono">
          {status.map((row) => (
            <StatusItem key={row.label} row={row} />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Truy cập dashboard</CardTitle>
          <CardDescription>
            Mở deep-link tới các phần chính của PostHog. Cần đăng nhập vào tài
            khoản org.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {DASHBOARD_URL ? (
            <>
              <a href={deepLink('insights')} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  Insights <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </a>
              <a href={deepLink('replay')} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  Session Replay <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </a>
              <a
                href={deepLink('feature_flags')}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="sm">
                  Feature Flags <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </a>
              <a href={deepLink('surveys')} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  Surveys <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </a>
              <a href={deepLink('events')} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  Events <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </a>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Set <code className="text-gold">NEXT_PUBLIC_POSTHOG_DASHBOARD_URL</code>
              {' '}để hiển thị deep-link (ví dụ
              {' '}
              <code className="text-gold">
                https://us.posthog.com/project/434217
              </code>
              ).
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup checklist</CardTitle>
          <CardDescription>Cấu hình tối thiểu để bật toàn bộ feature.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="ml-5 list-decimal space-y-2 text-sm text-foreground/85">
            <li>
              Project sống tại{' '}
              <a
                href="https://us.posthog.com/project/434217"
                target="_blank"
                rel="noreferrer"
                className="text-gold underline"
              >
                us.posthog.com/project/434217
              </a>
              {' '}(US Cloud). Project API key đã set trong Vercel env.
            </li>
            <li>
              Đặt <code className="text-gold">NEXT_PUBLIC_POSTHOG_KEY</code> trong
              Vercel env (Production + Preview).
            </li>
            <li>
              Đặt <code className="text-gold">POSTHOG_PERSONAL_API_KEY</code>{' '}
              (server-side, Vercel env) để bật live tiles trên trang này.
            </li>
            <li>
              Tạo các Feature Flags cần thiết (<code>mentor_chat_enabled</code>,{' '}
              <code>pricing_variant</code>, …).
            </li>
            <li>
              Tạo Funnel: <code>$pageview</code> → <code>consent_given</code> →{' '}
              <code>reading_started</code> → <code>survey_completed</code> →{' '}
              <code>report_viewed</code> → <code>payment_completed</code>.
            </li>
            <li>
              Group analytics: tạo group types{' '}
              <code>membership_tier</code> và <code>persona</code>.
            </li>
            <li>
              Surveys: tạo qua dashboard, copy survey id, render bằng{' '}
              <code>useSurvey(id)</code>.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
