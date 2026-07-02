'use client';

/**
 * /ai-quality?tab=stuck — "Báo cáo kẹt".
 *
 * Liệt kê các reading_sessions còn trạng thái running/queued nhưng đã quá N phút
 * — tức báo cáo có khả năng treo, không bao giờ về tay khách. Tô đỏ khi > 30 phút.
 *
 * Data: GET /admin/ai/stuck-sessions?older_than_min=N (worker, service-role gated).
 * Wrapper trả null trên 404 → tab tự ẩn nội dung khi backend chưa ship.
 */

import * as React from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
} from '@hieu-asia/ui';
import { AlertTriangle, CheckCircle2, ExternalLink, RotateCw } from 'lucide-react';
import { EmptyState } from '@/components/admin/empty-state';
import { getStuckSessions, type StuckSessionRow } from '@/lib/llm-spend-api';

const THRESHOLDS = [
  { min: 15, label: '> 15 phút' },
  { min: 30, label: '> 30 phút' },
  { min: 60, label: '> 60 phút' },
] as const;

/** Ngưỡng "đỏ" — quá mốc này coi như báo cáo treo nghiêm trọng. */
const CRITICAL_AGE_MIN = 30;

const STATUS_LABEL: Record<StuckSessionRow['status'], string> = {
  queued: 'Đang chờ (queued)',
  running: 'Đang chạy (running)',
};

function fmtAge(min: number): string {
  if (min >= 1440) return `${Math.floor(min / 1440)} ngày`;
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h} giờ ${m} phút` : `${h} giờ`;
  }
  return `${min} phút`;
}

/**
 * Cho chạy lại pipeline cho một phiên đang treo — cùng endpoint trang /sessions
 * dùng (POST /api/admin/sessions/:id/re-orchestrate, worker re-orchestrate +
 * audit). Thao tác NGAY tại đây thay vì phải sang /sessions tìm lại session_id.
 */
async function reOrchestrate(sessionId: string) {
  // timeout 15s: nếu worker/Supabase treo, nút "Chạy lại" không kẹt mãi
  // (AbortError → mutation onError toast) thay vì đơ.
  const r = await fetch(`/api/admin/sessions/${sessionId}/re-orchestrate`, {
    method: 'POST',
    signal: AbortSignal.timeout(15000),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data;
}

function StuckRow({ row }: { row: StuckSessionRow }) {
  const critical = row.age_minutes > CRITICAL_AGE_MIN;
  const qc = useQueryClient();
  const rerun = useMutation({
    mutationFn: () => reOrchestrate(row.session_id),
    onSuccess: () => {
      toast.success('Đã cho chạy lại báo cáo', { description: `Session ${row.session_id}` });
      qc.invalidateQueries({ queryKey: ['ai-stuck-sessions'] });
    },
    onError: (e) => toast.error('Chạy lại thất bại', { description: (e as Error).message }),
  });
  return (
    <li
      className={[
        'rounded-md border px-3 py-2.5 transition-all duration-300 ease-editorial',
        critical
          ? 'border-rose-500/40 bg-rose-500/5 hover:border-rose-500/60'
          : 'border-gold/10 bg-card/60 hover:border-gold/30',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-mono text-xs text-foreground" title={row.session_id}>
          {row.session_id}
        </span>
        <span
          className={[
            'shrink-0 font-mono text-xs font-semibold',
            critical ? 'text-rose-500' : 'text-muted-foreground',
          ].join(' ')}
        >
          {fmtAge(row.age_minutes)}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
        <span>{STATUS_LABEL[row.status]}</span>
        {row.user_id ? (
          <Link
            href={`/customers/${encodeURIComponent(row.user_id)}`}
            className="font-mono underline decoration-dotted underline-offset-2 hover:text-gold"
            title="Mở hồ sơ khách hàng"
          >
            user: {row.user_id}
          </Link>
        ) : null}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <Button size="sm" onClick={() => rerun.mutate()} disabled={rerun.isPending}>
          <RotateCw
            className={['mr-1.5 h-3.5 w-3.5', rerun.isPending ? 'animate-spin' : ''].join(' ')}
            aria-hidden
          />
          {rerun.isPending ? 'Đang chạy lại…' : 'Chạy lại pipeline'}
        </Button>
        <Link
          href={`/sessions/${row.session_id}`}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          Xem session
        </Link>
      </div>
    </li>
  );
}

export function StuckReportsTab() {
  const [olderThanMin, setOlderThanMin] = React.useState<number>(30);

  const q = useQuery({
    queryKey: ['ai-stuck-sessions', olderThanMin],
    queryFn: () => getStuckSessions(olderThanMin),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const sessions = q.data?.sessions ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Báo cáo kẹt
            </CardTitle>
            <CardDescription>
              Phiên đọc đang ở trạng thái chờ/chạy nhưng đã quá lâu — báo cáo có thể treo và
              không bao giờ về tay khách. Tô đỏ khi quá 30 phút.
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {THRESHOLDS.map((t) => (
              <Button
                key={t.min}
                variant={olderThanMin === t.min ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOlderThanMin(t.min)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {q.isLoading ? (
          <div className="h-48 animate-pulse rounded bg-muted/30" />
        ) : !q.data ? (
          <EmptyState
            title="Chưa có dữ liệu báo cáo kẹt"
            description="Endpoint /admin/ai/stuck-sessions chưa được triển khai."
          />
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-jade" />
            <p className="text-sm font-medium text-foreground">✓ Không có báo cáo kẹt</p>
            <p className="text-xs text-muted-foreground">
              Không có phiên nào treo quá {fmtAge(olderThanMin)}.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-muted-foreground">
              <span className="font-semibold text-rose-500">{sessions.length}</span> báo cáo treo quá{' '}
              {fmtAge(olderThanMin)}.
            </p>
            <ol className="space-y-2">
              {sessions.map((s) => (
                <StuckRow key={s.session_id} row={s} />
              ))}
            </ol>
          </>
        )}
      </CardContent>
    </Card>
  );
}
