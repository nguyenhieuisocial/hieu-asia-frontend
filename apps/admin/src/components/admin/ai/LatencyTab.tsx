'use client';

/**
 * /ai-quality?tab=latency — "Độ trễ theo loại (p50/p95)".
 *
 * Surfaces llm_traces.latency_ms aggregated per `role` (report, mentor, judge,
 * logic, alignment, psychology, …) over a 24h / 7d / 30d window. The existing
 * spend panels only ever showed an avg latency; p50/p95 reveals the tail that
 * matters for the slow report pipeline.
 *
 * Data: GET /admin/ai/latency?days=N (worker, service-role gated). The wrapper
 * returns null on 404 so this tab hides gracefully until the backend ships.
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
import { Timer } from 'lucide-react';
import { EmptyState } from '@/components/admin/empty-state';
import { getLatencyByRole, type LatencyRoleRow } from '@/lib/llm-spend-api';

const WINDOWS = [
  { days: 1, label: '24 giờ' },
  { days: 7, label: '7 ngày' },
  { days: 30, label: '30 ngày' },
] as const;

/** Friendly Vietnamese labels for the roles we know; unknown roles pass through. */
const ROLE_LABEL: Record<string, string> = {
  report: 'Báo cáo (report)',
  mentor: 'Mentor',
  judge: 'Chấm điểm (judge)',
  logic: 'Luận lý (logic)',
  alignment: 'Định hướng (alignment)',
  psychology: 'Tâm lý (psychology)',
  '(không gắn nhãn)': 'Không gắn nhãn',
};

function fmtMs(ms: number): string {
  if (!Number.isFinite(ms)) return '—';
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)} s`;
  return `${Math.round(ms)} ms`;
}

function LatencyRow({ row, maxP95 }: { row: LatencyRoleRow; maxP95: number }) {
  const label = ROLE_LABEL[row.role] ?? row.role;
  const p50Pct = maxP95 > 0 ? Math.min(100, (row.p50 / maxP95) * 100) : 0;
  const p95Pct = maxP95 > 0 ? Math.min(100, (row.p95 / maxP95) * 100) : 0;
  return (
    <li className="rounded-md border border-gold/10 bg-card/60 px-3 py-2.5 transition-all duration-300 ease-editorial hover:border-gold/30">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-xs text-foreground">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">{row.count} calls</span>
      </div>
      {/* p95 track (lighter) with p50 overlaid (gold) — a quick visual of the tail. */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-9 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">p50</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/30">
            <div className="h-full rounded-full bg-gold/70" style={{ width: `${p50Pct}%` }} />
          </div>
          <span className="w-16 shrink-0 text-right font-mono text-xs text-gold">{fmtMs(row.p50)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-9 shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">p95</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/30">
            <div className="h-full rounded-full bg-purple/60" style={{ width: `${p95Pct}%` }} />
          </div>
          <span className="w-16 shrink-0 text-right font-mono text-xs text-purple">{fmtMs(row.p95)}</span>
        </div>
      </div>
    </li>
  );
}

export function LatencyTab() {
  const [days, setDays] = React.useState<number>(7);

  const q = useQuery({
    queryKey: ['ai-latency', days],
    queryFn: () => getLatencyByRole(days),
    staleTime: 60_000,
  });

  const rows = q.data?.byRole ?? [];
  const maxP95 = rows.reduce((m, r) => Math.max(m, r.p95), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-gold" />
              Độ trễ theo loại (p50 / p95)
            </CardTitle>
            <CardDescription>
              Phân vị độ trễ mỗi cuộc gọi LLM, gom theo vai trò (role). p95 phơi bày phần đuôi
              chậm mà chỉ-số-trung-bình che mất — đặc biệt với pipeline báo cáo.
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {WINDOWS.map((w) => (
              <Button
                key={w.days}
                variant={days === w.days ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDays(w.days)}
              >
                {w.label}
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
            title="Chưa có dữ liệu độ trễ"
            description="Endpoint /admin/ai/latency chưa được triển khai, hoặc chưa có cuộc gọi nào trong khoảng thời gian này."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            title="Chưa có cuộc gọi nào"
            description={`Không có trace LLM trong ${days === 1 ? '24 giờ' : `${days} ngày`} qua.`}
          />
        ) : (
          <ol className="space-y-2">
            {rows.map((r) => (
              <LatencyRow key={r.role} row={r} maxP95={maxP95} />
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
