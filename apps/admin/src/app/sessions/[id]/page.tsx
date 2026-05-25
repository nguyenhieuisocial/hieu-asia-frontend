'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
  cn,
} from '@hieu-asia/ui';
import { ChevronLeft, Clock, DollarSign, ListTodo, Copy, AlertCircle } from 'lucide-react';
import { getSession } from '@/lib/admin-api';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import type { TaskStatus } from '@hieu-asia/types';

const STATUS_TONE: Record<TaskStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  queued: 'neutral',
  running: 'info',
  completed: 'success',
  failed: 'error',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  queued: 'Đang chờ',
  running: 'Đang chạy',
  completed: 'Hoàn tất',
  failed: 'Lỗi',
};

interface AuditEntry {
  ts: string;
  actor?: string | null;
  action: string;
  detail?: string | null;
}

interface SessionAuditResp {
  ok: boolean;
  entries?: AuditEntry[];
  note?: string;
}

/** Pull audit_log entries scoped to this session, if worker supports it. */
async function fetchSessionAudit(id: string): Promise<SessionAuditResp> {
  try {
    const r = await fetch(`/api/admin/audit-log?resource_id=${encodeURIComponent(id)}&limit=50`, {
      cache: 'no-store',
    });
    const data = await r.json();
    return data as SessionAuditResp;
  } catch {
    return { ok: false };
  }
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

function fmtDuration(sec: number | null) {
  if (sec == null) return '—';
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

export default function SessionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const session = useQuery({
    queryKey: ['admin', 'session', id],
    queryFn: () => getSession(id),
  });
  const audit = useQuery({
    queryKey: ['admin', 'session', id, 'audit'],
    queryFn: () => fetchSessionAudit(id),
    enabled: !!id,
  });

  const copyId = React.useCallback(() => {
    if (!session.data) return;
    navigator.clipboard.writeText(session.data.session_id).catch(() => {});
  }, [session.data]);

  if (session.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted/30" />
        <div className="h-32 animate-pulse rounded-xl bg-muted/30" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="space-y-6">
        <Link
          href="/sessions"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
        <EmptyState
          title="Không tìm thấy session"
          description={
            <>
              ID <code className="font-mono text-gold">{id}</code> không tồn tại hoặc đã bị xóa.
            </>
          }
        />
      </div>
    );
  }

  const s = session.data;
  const entries = audit.data?.entries ?? [];

  return (
    <div className="space-y-6">
      <Link
        href="/sessions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-gold" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Session detail
            </span>
            <StatusBadge status={STATUS_TONE[s.status]} label={STATUS_LABEL[s.status]} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <h1 className="truncate font-mono text-2xl font-semibold text-gold" title={s.session_id}>
              {s.session_id}
            </h1>
            <button
              type="button"
              onClick={copyId}
              className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:bg-gold/10 hover:text-gold"
              aria-label="Copy session ID"
              title="Copy session ID"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            User: <span className="text-foreground">{s.user_email}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Tạo lúc"
          value={<span className="text-lg">{fmtDateTime(s.created_at)}</span>}
          icon={<Clock className="h-4 w-4" />}
          accent="gold"
          hint="timestamp"
        />
        <KpiCard
          label="Thời lượng"
          value={fmtDuration(s.duration_seconds)}
          icon={<Clock className="h-4 w-4" />}
          accent="jade"
          hint={s.status === 'running' ? 'đang chạy' : 'pipeline'}
        />
        <KpiCard
          label="Cost"
          value={`$${s.cost_usd.toFixed(3)}`}
          icon={<DollarSign className="h-4 w-4" />}
          accent="purple"
          hint="USD"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bối cảnh user</CardTitle>
          <CardDescription>Mối quan tâm chính từ survey + input ban đầu.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/90">
            {s.primary_concern && s.primary_concern !== '—'
              ? s.primary_concern
              : (
                <span className="italic text-muted-foreground">
                  (User chưa nhập mối quan tâm — survey/input ban đầu để trống.)
                </span>
              )}
          </p>
        </CardContent>
      </Card>

      {/* Wave 58.12 — Birth data, Tử Vi chart, Final Report, Insights chi tiết. */}
      {s.state_json &&
        (() => {
          const sj = s.state_json as Record<string, unknown>;
          const birth = (sj.birth_data ?? {}) as Record<string, unknown>;
          const tuvi = (sj.tuvi_chart ?? {}) as Record<string, unknown>;
          const insights = (sj.insights ?? {}) as Record<string, unknown>;
          const reportMeta = (sj.report_meta ?? {}) as Record<string, unknown>;
          const logicMeta = (sj.logic_meta ?? {}) as Record<string, unknown>;
          const psychMeta = (sj.psychology_meta ?? {}) as Record<string, unknown>;
          const alignMeta = (sj.alignment_meta ?? {}) as Record<string, unknown>;

          const hasBirth = Object.keys(birth).length > 0;
          const hasTuvi = Object.keys(tuvi).length > 0;
          const hasInsights = Object.keys(insights).length > 0;
          const hasMeta =
            Object.keys(reportMeta).length > 0 ||
            Object.keys(logicMeta).length > 0 ||
            Object.keys(psychMeta).length > 0 ||
            Object.keys(alignMeta).length > 0;

          return (
            <>
              {hasBirth && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dữ liệu sinh trắc</CardTitle>
                    <CardDescription>Birth data đầu vào để lập lá số.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                      {Object.entries({
                        display_name: 'Tên hiển thị',
                        gender: 'Giới tính',
                        birth_date: 'Ngày sinh',
                        birth_time: 'Giờ sinh',
                        birth_place: 'Nơi sinh',
                        calendar: 'Lịch',
                        timezone: 'Múi giờ',
                        time_confidence: 'Độ chắc giờ',
                      }).map(([key, label]) => {
                        const v = birth[key];
                        if (v == null || v === '') return null;
                        return (
                          <div key={key}>
                            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {label}
                            </dt>
                            <dd className="mt-1 font-mono text-sm text-foreground">{String(v)}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  </CardContent>
                </Card>
              )}

              {hasTuvi && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tử Vi — Tứ Trụ</CardTitle>
                    <CardDescription>4 trụ Năm · Tháng · Ngày · Giờ tính từ birth data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {['year', 'month', 'day', 'hour'].map((k) => {
                        const labelMap: Record<string, string> = {
                          year: 'Năm',
                          month: 'Tháng',
                          day: 'Ngày',
                          hour: 'Giờ',
                        };
                        const v = tuvi[k];
                        return (
                          <div
                            key={k}
                            className="rounded-md border border-gold/20 bg-gold/5 px-3 py-2 text-center"
                          >
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {labelMap[k]}
                            </div>
                            <div className="mt-1 font-mono text-base text-gold">
                              {(v as string) || '—'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {s.final_report_markdown && (
                <Card>
                  <CardHeader>
                    <CardTitle>Báo cáo cuối</CardTitle>
                    <CardDescription>
                      {s.final_report_markdown.length} ký tự · sinh từ pipeline `report`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap rounded-md border border-gold/10 bg-card/40 p-4 text-sm leading-relaxed text-foreground/90">
                      {s.final_report_markdown}
                    </div>
                  </CardContent>
                </Card>
              )}

              {hasInsights && (
                <Card>
                  <CardHeader>
                    <CardTitle>Insights chi tiết</CardTitle>
                    <CardDescription>
                      Output thô của các step pipeline (logic · psychology · alignment · report).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(['logic', 'psychology', 'alignment', 'report'] as const).map((role) => {
                        const txt = insights[role];
                        if (typeof txt !== 'string' || !txt.trim()) return null;
                        const titleMap = {
                          logic: 'Logic Expert',
                          psychology: 'Psychology Expert',
                          alignment: 'Alignment Expert',
                          report: 'Report Writer',
                        } as const;
                        return (
                          <details
                            key={role}
                            className="rounded-md border border-gold/15 bg-card/30 px-3 py-2"
                          >
                            <summary className="cursor-pointer text-sm font-medium text-foreground/90">
                              {titleMap[role]}{' '}
                              <span className="text-[10px] text-muted-foreground">
                                ({txt.length} chars)
                              </span>
                            </summary>
                            <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                              {txt}
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {hasMeta && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pipeline meta</CardTitle>
                    <CardDescription>Vendor + model dùng cho từng role.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      {(
                        [
                          ['logic', logicMeta],
                          ['psychology', psychMeta],
                          ['alignment', alignMeta],
                          ['report', reportMeta],
                        ] as const
                      ).map(([role, meta]) => {
                        if (Object.keys(meta).length === 0) return null;
                        return (
                          <div
                            key={role}
                            className="rounded-md border border-gold/10 bg-card/40 px-3 py-2"
                          >
                            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {role}
                            </dt>
                            <dd className="mt-1 space-y-0.5 font-mono text-xs text-foreground/80">
                              {Object.entries(meta).map(([k, v]) => (
                                <div key={k} className="flex gap-2">
                                  <span className="text-muted-foreground">{k}:</span>
                                  <span className="truncate">{String(v)}</span>
                                </div>
                              ))}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </CardContent>
                </Card>
              )}
            </>
          );
        })()}

      {s.error && (
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-300">
              <AlertCircle className="h-4 w-4" />
              Lỗi pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded border border-red-500/30 bg-red-500/5 p-3 font-mono text-xs leading-relaxed text-red-200">
              {s.error}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
          <CardDescription>
            Các sự kiện liên quan tới session này (re-orchestrate, delete, manual override).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audit.isLoading ? (
            <div className="space-y-2 py-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted/30" />
              ))}
            </div>
          ) : audit.data?.note ? (
            <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
              {audit.data.note}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              title="Chưa có sự kiện"
              description="Các hành động ghi vào audit_log sẽ hiện ở đây theo thời gian giảm dần."
              className="border-0 bg-transparent"
            />
          ) : (
            <ul className="space-y-2">
              {entries.map((e, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-3 rounded-md border border-gold/10 bg-card/60 px-3 py-2',
                  )}
                >
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground" title={e.ts}>
                    {fmtDateTime(e.ts)}
                  </span>
                  <span className="inline-flex items-center rounded border border-gold/20 bg-gold/5 px-1.5 py-0.5 font-mono text-[10px] text-gold">
                    {e.action}
                  </span>
                  <span className="min-w-0 flex-1 text-sm text-foreground/85">
                    {e.actor && (
                      <span className="font-mono text-xs text-muted-foreground">{e.actor}</span>
                    )}
                    {e.detail && (
                      <span className="ml-1.5 text-muted-foreground">— {e.detail}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
