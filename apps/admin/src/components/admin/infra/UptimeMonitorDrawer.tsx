'use client';

/**
 * UptimeMonitorDrawer — slide-out detail for ONE BetterStack uptime monitor.
 *
 * Opened from a row on /infra/uptime. Lazily fetches GET /admin/infra/uptime/:id
 * (React Query enabled only while open, keyed by the monitor id) and renders the
 * monitor config (type / check interval / timeout / SSL expiry), an SLA
 * availability line (honest "không có dữ liệu SLA" when the plan doesn't expose
 * it), a response-time sparkline (lazy Recharts), and the recent incidents list.
 *
 * Mirrors SentryIssueDrawer (Sheet + lazy useQuery + StatLine + ErrorBlock).
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@hieu-asia/ui';
import { ExternalLink } from 'lucide-react';
import {
  getInfraUptimeDetail,
  type InfraUptimeDetailIncident,
} from '@/lib/admin-api';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { ErrorBlock } from '@/components/admin/error-block';
import { InfraStatusPill } from '@/components/admin/infra/infra-panel';

// Recharts lazy-loaded so it stays out of the initial bundle (ssr:false because
// admin is auth-gated). Same pattern as AiGatewayTrendChart.
const UptimeSparkline = dynamic(
  () => import('@/components/admin/infra/UptimeSparkline').then((m) => m.UptimeSparkline),
  {
    ssr: false,
    loading: () => <div className="h-28 animate-pulse rounded bg-muted/30" aria-hidden />,
  },
);

function StatLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

function statusTone(status: string, paused: boolean): 'good' | 'bad' | 'warn' | 'neutral' {
  if (paused) return 'neutral';
  switch (status) {
    case 'up':
      return 'good';
    case 'down':
      return 'bad';
    case 'validating':
    case 'pending':
      return 'warn';
    default:
      return 'neutral';
  }
}

function fmtSeconds(sec: number | null | undefined): string {
  if (sec == null) return '—';
  return `${sec.toLocaleString('vi-VN')}s`;
}

function fmtSslDays(days: number | null | undefined): string {
  if (days == null) return '—';
  return `${days.toLocaleString('vi-VN')} ngày`;
}

function fmtDowntime(sec: number | null): string {
  if (sec == null) return '—';
  if (sec < 60) return `${Math.round(sec)}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m} phút`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function incidentTone(inc: InfraUptimeDetailIncident): 'good' | 'bad' | 'warn' | 'neutral' {
  if (inc.resolved_at) return 'good';
  if (inc.acknowledged_at) return 'warn';
  return 'bad';
}

export interface UptimeMonitorDrawerProps {
  monitorId: string | null;
  open: boolean;
  onClose: () => void;
}

export function UptimeMonitorDrawer({
  monitorId,
  open,
  onClose,
}: UptimeMonitorDrawerProps): React.ReactElement {
  const enabled = open && !!monitorId;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['infra', 'uptime', 'detail', monitorId],
    queryFn: () => getInfraUptimeDetail(monitorId!),
    enabled,
    staleTime: 30_000,
  });

  const monitor = data && data.ok ? data.monitor : undefined;
  const responseTimes = data && data.ok ? data.response_times : [];
  const availability = data && data.ok ? data.availability : null;
  const incidents = data && data.ok ? data.incidents : [];
  const showError = isError || (data && data.ok === false);
  const errorMsg = data && data.ok === false ? data.error : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-start gap-2 break-words pr-6">
            {monitor ? monitor.name : 'Chi tiết monitor'}
          </SheetTitle>
          {monitor?.url && (
            <SheetDescription className="break-words font-mono text-xs">
              {monitor.url}
            </SheetDescription>
          )}
        </SheetHeader>

        {showError && (
          <ErrorBlock
            compact
            message={errorMsg ?? 'Không tải được chi tiết monitor.'}
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-2 pt-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        )}

        {monitor && !isLoading && (
          <div className="space-y-5">
            {/* Open on BetterStack */}
            {monitor.url && (
              <div className="flex flex-wrap gap-2">
                <a
                  href={monitor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 self-center text-sm text-gold hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Mở URL đang giám sát
                </a>
              </div>
            )}

            {/* Config */}
            <div className="rounded-md border border-border bg-card/60 px-3 py-1">
              <StatLine
                label="Trạng thái"
                value={
                  <InfraStatusPill
                    label={monitor.paused ? 'tạm dừng' : monitor.status || '—'}
                    tone={statusTone(monitor.status, monitor.paused)}
                  />
                }
              />
              <StatLine label="Loại" value={monitor.monitor_type ?? '—'} />
              {monitor.request_method && (
                <StatLine label="Phương thức" value={monitor.request_method} />
              )}
              <StatLine label="Chu kỳ kiểm" value={fmtSeconds(monitor.check_frequency)} />
              <StatLine label="Timeout" value={fmtSeconds(monitor.request_timeout)} />
              <StatLine label="SSL còn hạn" value={fmtSslDays(monitor.ssl_expiration)} />
              <StatLine
                label="Kiểm gần nhất"
                value={formatDateOrEmpty(monitor.last_checked_at)}
              />
              <StatLine label="Tạo lúc" value={formatDateOrEmpty(monitor.created_at)} />
            </div>

            {/* SLA availability */}
            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Khả dụng (SLA)
              </p>
              {availability && availability.availability_pct != null ? (
                <div className="rounded-md border border-border bg-card/60 px-3 py-1">
                  <StatLine
                    label="Tỷ lệ khả dụng"
                    value={`${availability.availability_pct.toFixed(3)}%`}
                  />
                  <StatLine
                    label="Tổng thời gian lỗi"
                    value={fmtDowntime(availability.total_downtime_sec)}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Không có dữ liệu SLA (gói BetterStack không cung cấp).
                </p>
              )}
            </div>

            {/* Response-time sparkline */}
            {responseTimes.some((r) => r.response_time_ms != null) && (
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Thời gian phản hồi gần đây
                </p>
                <UptimeSparkline data={responseTimes} />
              </div>
            )}

            {/* Incidents */}
            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Sự cố gần đây
              </p>
              {incidents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Không có sự cố gần đây.</p>
              ) : (
                <ul className="space-y-2">
                  {incidents.map((inc) => (
                    <li
                      key={inc.id}
                      className="rounded-md border border-border/60 px-3 py-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 truncate font-medium text-foreground">
                          {inc.name}
                        </p>
                        <InfraStatusPill
                          label={inc.resolved_at ? 'đã xử lý' : inc.acknowledged_at ? 'đang xử lý' : 'đang diễn ra'}
                          tone={incidentTone(inc)}
                        />
                      </div>
                      {inc.cause && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {inc.cause}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Bắt đầu {formatRelativeOrEmpty(inc.started_at) || '—'}
                        {inc.duration_sec != null
                          ? ` · Kéo dài ${fmtDowntime(inc.duration_sec)}`
                          : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
