'use client';

/**
 * /system — service health indicators (worker / supabase / sentry / posthog).
 *
 * Wave 60.81.C Tier 3 polish batch 2. Stub-with-real-fallback pattern:
 * each row tries a lightweight `HEAD /api/<svc>/ping` and surfaces the
 * outcome as a green / warn / red dot. When the endpoint is missing
 * (404) we render "unknown" rather than failing — the page should
 * never crash if a sub-system is offline.
 *
 * Data sources (current): each ping is best-effort. Real wiring lands
 * when individual ops endpoints exist; for now this is a consistency
 * shell so /system has the same chrome as /health, /migrations etc.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { ServerCog, Activity, Sparkles, ShieldCheck, Database, Layers, Mail, Globe, Megaphone, Users } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';

type SvcStatus = 'ok' | 'warn' | 'down' | 'unknown';

interface ServiceRow {
  id: string;
  label: string;
  description: string;
  endpoint: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceRow[] = [
  {
    id: 'worker',
    label: 'Worker API',
    description: 'Cloudflare Worker — /admin proxy + /payment',
    endpoint: '/api/admin-proxy/health',
    Icon: ServerCog,
  },
  {
    id: 'supabase',
    label: 'Supabase Postgres',
    description: 'Reading sessions + customers source of truth',
    endpoint: '/api/admin-proxy/admin/customers?limit=1',
    Icon: Database,
  },
  {
    id: 'sentry',
    label: 'Sentry',
    description: 'Error tracking — frontend + worker DSN',
    endpoint: '/api/admin-proxy/admin/sentry/ping',
    Icon: ShieldCheck,
  },
  {
    id: 'posthog',
    label: 'PostHog',
    description: 'Product analytics — event ingest',
    endpoint: '/api/admin-proxy/admin/posthog/ping',
    Icon: Activity,
  },
];

async function pingService(endpoint: string): Promise<SvcStatus> {
  try {
    const r = await fetch(endpoint, { cache: 'no-store' });
    if (r.ok) return 'ok';
    if (r.status === 404) return 'unknown';
    if (r.status >= 500) return 'down';
    return 'warn';
  } catch {
    return 'down';
  }
}

function StatusDot({ status }: { status: SvcStatus }) {
  // Status legend lives in design vault 107 §5.10: green = jade-300, yellow =
  // warn-500 (semantic amber), red = red-400, gray = muted.
  const cls =
    status === 'ok'
      ? 'bg-jade-300 ring-jade-300/30'
      : status === 'warn'
        ? 'bg-warn-500 ring-warn-500/30'
        : status === 'down'
          ? 'bg-red-400 ring-red-400/30'
          : 'bg-muted-foreground/50 ring-muted-foreground/20';
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-4 ${cls}`}
      aria-hidden
    />
  );
}

const STATUS_LABEL: Record<SvcStatus, string> = {
  ok: 'Hoạt động',
  warn: 'Chậm / cảnh báo',
  down: 'Mất kết nối',
  unknown: 'Chưa wired',
};

// ─── Resend types ────────────────────────────────────────────────────────────

interface ResendDomain {
  id: string;
  name: string | null;
  status: string | null;
  region: string | null;
  created_at: string | null;
}

interface ResendBroadcast {
  id: string;
  name: string | null;
  status: string | null;
  created_at: string | null;
}

interface ResendStatusOk {
  ok: true;
  configured: true;
  domains: ResendDomain[];
  broadcasts: ResendBroadcast[];
  audience: { id: string; name: string | null; contacts: number | null } | null;
  verified_domains: number;
}

interface ResendStatusNotConfigured {
  ok: false;
  configured: false;
  error: string;
}

type ResendStatus = ResendStatusOk | ResendStatusNotConfigured;

async function fetchResendStatus(): Promise<ResendStatus> {
  const r = await fetch('/api/admin-proxy/admin/resend/status', { cache: 'no-store' });
  return r.json() as Promise<ResendStatus>;
}

function ResendPanel() {
  const { data, isLoading } = useQuery<ResendStatus>({
    queryKey: ['admin', 'resend-status'],
    queryFn: fetchResendStatus,
    refetchInterval: 30_000,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-gold/15 bg-card/60 p-2 text-gold/80">
            <Mail className="h-4 w-4" />
          </span>
          <div>
            <CardTitle>Resend (Email)</CardTitle>
            <CardDescription>Trạng thái gửi email — domains, broadcasts, audience.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-xs text-muted-foreground">Đang tải…</p>
        )}

        {data && !data.configured && (
          <p className="text-xs text-muted-foreground">
            Resend chưa cấu hình: {(data as ResendStatusNotConfigured).error}
          </p>
        )}

        {data && data.configured && (() => {
          const d = data as ResendStatusOk;
          return (
            <div className="space-y-6">
              {/* KPI row */}
              <div className="grid gap-4 sm:grid-cols-3">
                <KpiCard
                  label="Domains verified"
                  value={`${d.verified_domains}/${d.domains.length}`}
                  icon={<Globe className="h-4 w-4" />}
                  accent="jade"
                  hint="domains"
                />
                <KpiCard
                  label="Broadcasts"
                  value={d.broadcasts.length}
                  icon={<Megaphone className="h-4 w-4" />}
                  accent="gold"
                  hint="campaigns"
                />
                <KpiCard
                  label="Audience"
                  value={d.audience?.contacts ?? '—'}
                  icon={<Users className="h-4 w-4" />}
                  accent="purple"
                  hint={d.audience?.name ?? 'contacts'}
                />
              </div>

              {/* Domains table */}
              {d.domains.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Domains</p>
                  <ul className="divide-y divide-gold/10">
                    {d.domains.map((domain) => (
                      <li key={domain.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                        <div className="min-w-0">
                          <p className="truncate text-foreground">{domain.name ?? domain.id}</p>
                          <p className="truncate text-xs text-muted-foreground">{domain.region ?? '—'}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            className={
                              domain.status === 'verified'
                                ? 'font-mono text-xs text-green-500'
                                : 'font-mono text-xs text-muted-foreground'
                            }
                          >
                            {domain.status ?? '—'}
                          </span>
                          {domain.created_at && (
                            <span className="font-mono text-xs text-muted-foreground">
                              {new Date(domain.created_at).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Broadcasts list */}
              {d.broadcasts.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">Broadcasts</p>
                  <ul className="divide-y divide-gold/10">
                    {d.broadcasts.map((bc) => (
                      <li key={bc.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                        <p className="truncate text-foreground">{bc.name ?? bc.id}</p>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{bc.status ?? '—'}</span>
                          {bc.created_at && (
                            <span className="font-mono text-xs text-muted-foreground">
                              {new Date(bc.created_at).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SystemPage() {
  const results = useQuery({
    queryKey: ['admin', 'system-services'],
    refetchInterval: 30_000,
    queryFn: async () => {
      const entries = await Promise.all(
        SERVICES.map(async (s) => [s.id, await pingService(s.endpoint)] as const),
      );
      return Object.fromEntries(entries) as Record<string, SvcStatus>;
    },
  });

  const statuses = results.data ?? {};
  const okCount = Object.values(statuses).filter((s) => s === 'ok').length;
  const warnCount = Object.values(statuses).filter((s) => s === 'warn').length;
  const downCount = Object.values(statuses).filter((s) => s === 'down').length;
  const unknownCount = Object.values(statuses).filter((s) => s === 'unknown').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trạng thái dịch vụ"
        description="Kiểm tra nhanh worker, supabase, sentry, posthog. Tự refresh mỗi 30 giây."
        icon={<ServerCog className="h-5 w-5" />}
        badge={<LiveBadge />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Hoạt động"
          value={okCount}
          icon={<Sparkles className="h-4 w-4" />}
          accent="jade"
          hint={`/${SERVICES.length} dịch vụ`}
        />
        <KpiCard
          label="Cảnh báo"
          value={warnCount}
          icon={<Layers className="h-4 w-4" />}
          accent="gold"
          hint="degraded"
        />
        <KpiCard
          label="Down"
          value={downCount}
          icon={<ShieldCheck className="h-4 w-4" />}
          accent={downCount > 0 ? 'red' : 'jade'}
          hint="cần xử lý"
        />
        <KpiCard
          label="Chưa wired"
          value={unknownCount}
          icon={<Database className="h-4 w-4" />}
          accent="purple"
          hint="endpoint TBD"
        />
      </div>

      <ResendPanel />

      <Card>
        <CardHeader>
          <CardTitle>Dịch vụ</CardTitle>
          <CardDescription>
            Mỗi dịch vụ ping endpoint riêng. Trạng thái dot: xanh = ok, vàng = chậm,
            đỏ = mất kết nối, xám = chưa cài.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gold/10">
            {SERVICES.map((svc) => {
              const status = statuses[svc.id] ?? 'unknown';
              return (
                <li
                  key={svc.id}
                  className="flex items-center justify-between gap-4 py-4 transition-all duration-300 ease-editorial hover:bg-gold/[0.03]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="rounded-md border border-gold/15 bg-card/60 p-2 text-gold/80">
                      <svc.Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm text-foreground">{svc.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{svc.description}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusDot status={status} />
                    <span
                      className={
                        status === 'ok'
                          ? 'font-mono text-xs text-jade-300'
                          : status === 'warn'
                            ? 'font-mono text-xs text-warn-300'
                            : status === 'down'
                              ? 'font-mono text-xs text-red-300'
                              : 'font-mono text-xs text-muted-foreground'
                      }
                    >
                      {STATUS_LABEL[status]}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
