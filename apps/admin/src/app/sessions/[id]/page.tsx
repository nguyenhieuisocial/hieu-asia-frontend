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
          <p className="text-sm leading-relaxed text-foreground/90">{s.primary_concern}</p>
        </CardContent>
      </Card>

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
