'use client';

/**
 * /admin/audit — Audit log viewer (Postgres `hieu_asia.audit_log`).
 *
 * Filters by action / actor / date range. Defaults to newest 100. Shows an
 * empty state with the worker note when the table isn't provisioned yet.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { ShieldAlert, Download, Activity, Users, AlertTriangle, Clock } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { KpiCard } from '@/components/admin/kpi-card';

interface AuditEntry {
  id?: string;
  ts?: string | null;
  actor?: string | null;
  actor_type?: string | null;
  action?: string | null;
  resource_id?: string | null;
  ip?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface AuditResponse {
  ok: boolean;
  entries?: AuditEntry[];
  note?: string;
  error?: string;
}

const ACTION_OPTIONS = [
  { value: '', label: 'Tất cả action' },
  { value: 'admin_login', label: 'admin_login' },
  { value: 'user_export_requested', label: 'user_export_requested' },
  { value: 'user_erased', label: 'user_erased' },
  { value: 'secret_rotated', label: 'secret_rotated' },
  { value: 'coupon_revoked', label: 'coupon_revoked' },
];

const HIGH_RISK_ACTIONS = new Set([
  'user_erased',
  'secret_rotated',
  'coupon_revoked',
  'admin_user_deleted',
]);

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
  } catch {
    return iso;
  }
}

function fmtRelative(iso: string | null | undefined) {
  if (!iso) return '';
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60_000);
    if (m < 1) return 'vừa xong';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  } catch {
    return '';
  }
}

async function fetchAudit(params: {
  action: string;
  actor: string;
  from: string;
  to: string;
  limit: number;
}): Promise<AuditResponse> {
  const qs = new URLSearchParams();
  if (params.action) qs.set('action', params.action);
  if (params.actor) qs.set('actor', params.actor);
  if (params.from) qs.set('from', new Date(params.from).toISOString());
  if (params.to) qs.set('to', new Date(params.to).toISOString());
  qs.set('limit', String(params.limit));
  const res = await fetch(`/api/admin/audit-log?${qs.toString()}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as AuditResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

function exportCsv(entries: AuditEntry[]) {
  if (entries.length === 0) return;
  const headers = ['ts', 'actor', 'actor_type', 'action', 'resource_id', 'ip', 'metadata'];
  const body = entries
    .map((e) =>
      [
        e.ts ?? '',
        e.actor ?? '',
        e.actor_type ?? '',
        e.action ?? '',
        e.resource_id ?? '',
        e.ip ?? '',
        e.metadata ? JSON.stringify(e.metadata) : '',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n');
  const csv = `${headers.join(',')}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const LIMIT = 100;

export default function AuditPage() {
  const [action, setAction] = React.useState('');
  const [actorInput, setActorInput] = React.useState('');
  const [actor, setActor] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  React.useEffect(() => {
    const t = window.setTimeout(() => setActor(actorInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [actorInput]);

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['admin', 'audit-log', { action, actor, from, to }],
    queryFn: () => fetchAudit({ action, actor, from, to, limit: LIMIT }),
  });

  const entries = data?.entries ?? [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;

  // KPIs
  const uniqueActors = new Set(entries.map((e) => e.actor).filter(Boolean)).size;
  const highRiskCount = entries.filter((e) => HIGH_RISK_ACTIONS.has(e.action ?? '')).length;
  const last24h = entries.filter((e) => {
    if (!e.ts) return false;
    return Date.now() - new Date(e.ts).getTime() < 24 * 3600 * 1000;
  }).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit log"
        description="Bản ghi hoạt động — admin actions + GDPR-related events. Lưu 12 tháng theo Nghị định 13/2023."
        icon={<ShieldAlert className="h-5 w-5" />}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportCsv(entries)}
              disabled={entries.length === 0}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? 'Đang tải…' : 'Làm mới'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Hiển thị / trang"
          value={entries.length}
          icon={<Activity className="h-4 w-4" />}
          accent="gold"
          hint={`tối đa ${LIMIT}`}
        />
        <KpiCard
          label="24h gần nhất"
          value={last24h}
          icon={<Clock className="h-4 w-4" />}
          accent="purple"
          hint="event"
        />
        <KpiCard
          label="Actor unique"
          value={uniqueActors}
          icon={<Users className="h-4 w-4" />}
          accent="jade"
          hint="người thao tác"
        />
        <KpiCard
          label="High-risk"
          value={highRiskCount}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent={highRiskCount > 0 ? 'red' : 'jade'}
          hint="erase / rotate / revoke"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Mặc định {LIMIT} entry mới nhất. Actor search debounce 300ms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="h-10 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground focus:border-gold focus:outline-none"
            >
              {ACTION_OPTIONS.map((o) => (
                <option key={o.value || 'all'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={actorInput}
              onChange={(e) => setActorInput(e.target.value)}
              placeholder="Actor (email / user_id)…"
              className="rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none"
            />
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
            />
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-sm text-foreground focus:border-gold focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động ({entries.length})</CardTitle>
          <CardDescription>Sắp xếp theo timestamp giảm dần.</CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMsg ?? 'Không tải được audit log.'}
            </div>
          )}
          {note && !showError && (
            <div className="mb-4 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
              {note}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Thời gian</th>
                  <th className="px-3 py-2 font-medium">Actor</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium">Resource</th>
                  <th className="px-3 py-2 font-medium">IP</th>
                  <th className="px-3 py-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                      Đang tải…
                    </td>
                  </tr>
                )}
                {!isLoading && entries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-2">
                      <EmptyState
                        title={note ? 'Bảng audit_log chưa được tạo' : 'Không có entry khớp bộ lọc'}
                        description={
                          note ?? 'Thử bỏ filter hoặc mở rộng date range để xem thêm dữ liệu.'
                        }
                        className="my-2 border-0 bg-transparent"
                      />
                    </td>
                  </tr>
                )}
                {entries.map((e, i) => {
                  const highRisk = HIGH_RISK_ACTIONS.has(e.action ?? '');
                  return (
                    <tr key={e.id ?? `${e.ts ?? ''}-${i}`} className="hover:bg-gold/[0.03]">
                      <td className="px-3 py-2 font-mono text-xs text-foreground/85" title={e.ts ?? ''}>
                        <div>{fmtDate(e.ts)}</div>
                        <div className="text-[10px] text-muted-foreground">{fmtRelative(e.ts)}</div>
                      </td>
                      <td className="px-3 py-2 text-foreground/85">
                        <div className="truncate" title={e.actor ?? ''}>
                          {e.actor ?? '—'}
                        </div>
                        {e.actor_type && (
                          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {e.actor_type}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs ${
                            highRisk
                              ? 'border-red-400/40 bg-red-500/10 text-red-200'
                              : 'border-gold/20 bg-gold/5 text-gold'
                          }`}
                        >
                          {e.action ?? '—'}
                        </span>
                      </td>
                      <td
                        className="max-w-[18ch] truncate px-3 py-2 font-mono text-xs text-muted-foreground"
                        title={e.resource_id ?? ''}
                      >
                        {e.resource_id ?? '—'}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{e.ip ?? '—'}</td>
                      <td className="px-3 py-2">
                        {e.metadata && Object.keys(e.metadata).length > 0 ? (
                          <code className="line-clamp-2 max-w-md font-mono text-[11px] text-muted-foreground">
                            {JSON.stringify(e.metadata)}
                          </code>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
