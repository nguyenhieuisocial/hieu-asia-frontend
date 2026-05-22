'use client';

/**
 * /admin/posthog — PostHog setup status + dashboard portal.
 *
 * Real analytics live at posthog.com (or self-hosted). This page just shows
 * environment configuration status and an embedded link/iframe so operators
 * can jump to the right project without hunting in 1Password.
 *
 * Environment:
 *   NEXT_PUBLIC_POSTHOG_KEY            — present on web app
 *   NEXT_PUBLIC_POSTHOG_HOST           — overrides default EU host
 *   NEXT_PUBLIC_POSTHOG_DASHBOARD_URL  — full URL to the org's dashboard
 *   NEXT_PUBLIC_POSTHOG_PROJECT_ID     — project id, used for deep links
 */

import * as React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { ExternalLink, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { LiveBadge } from '@/components/admin/live-badge';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';
const DASHBOARD_URL = process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_URL;
const PROJECT_ID = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_ID;

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
      hint: 'API ingest host. EU by default.',
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
  ];

  const deepLink = (slug: string) =>
    DASHBOARD_URL ? `${DASHBOARD_URL.replace(/\/$/, '')}/${slug}` : undefined;

  const configuredCount = status.filter((s) => s.ok).length;
  const fullyConfigured = configuredCount === status.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="PostHog"
        description="Trạng thái config + portal sang dashboard. Phân tích thực tế (funnel, replay, feature flag) sống tại posthog.com."
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
                https://eu.posthog.com/project/12345
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
              Tạo project tại{' '}
              <a
                href="https://eu.posthog.com/signup"
                target="_blank"
                rel="noreferrer"
                className="text-gold underline"
              >
                eu.posthog.com
              </a>
              {' '}và copy project API key.
            </li>
            <li>
              Đặt <code className="text-gold">NEXT_PUBLIC_POSTHOG_KEY</code> trong
              Vercel env (Production + Preview).
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
