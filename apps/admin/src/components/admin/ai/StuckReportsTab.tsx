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
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
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

function StuckRow({ row }: { row: StuckSessionRow }) {
  const critical = row.age_minutes > CRITICAL_AGE_MIN;
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
        {row.user_id ? <span className="font-mono">user: {row.user_id}</span> : null}
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
