'use client';

/**
 * /ai-quality?tab=model-health — "Sức khoẻ model".
 *
 * Gom llm_traces theo `model`: số lượt gọi, phân bố, cost và tỉ lệ lỗi. Giúp
 * founder phát hiện lạm-dụng-fallback (một model "rẻ" nuốt hết lưu lượng) hoặc
 * một model đang hỏng (tỉ lệ lỗi cao).
 *
 * CAVEAT TRUNG THỰC: nhiều model có cost_usd=0 trong ledger (pipeline báo cáo
 * không ghi cost cho mọi role), nên số THẬT đáng tin là count + tỉ lệ lỗi; cột
 * cost có thể thiếu. UI nêu rõ điều này khi tổng cost = 0 mà vẫn có lượt gọi.
 *
 * Data: GET /admin/ai/model-health?days=N (worker, service-role gated). Wrapper
 * trả null trên 404 → tab tự ẩn nội dung khi backend chưa ship.
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
import { Network, Info } from 'lucide-react';
import { EmptyState } from '@/components/admin/empty-state';
import { getModelHealth, type ModelHealthRow } from '@/lib/llm-spend-api';

const WINDOWS = [
  { days: 1, label: '24 giờ' },
  { days: 7, label: '7 ngày' },
  { days: 30, label: '30 ngày' },
] as const;

/** Tỉ lệ lỗi vượt mốc này → tô đỏ (model có vấn đề). */
const ERROR_RED_PCT = 5;

function fmtUsd(v: number): string {
  if (!Number.isFinite(v) || v === 0) return '$0';
  if (v < 0.01) return `$${v.toFixed(4)}`;
  return `$${v.toFixed(2)}`;
}

function ModelRow({ row, total }: { row: ModelHealthRow; total: number }) {
  const sharePct = total > 0 ? (row.count / total) * 100 : 0;
  const errBad = row.error_rate_pct >= ERROR_RED_PCT;
  return (
    <li className="rounded-md border border-gold/10 bg-card/60 px-3 py-2.5 transition-all duration-300 ease-editorial hover:border-gold/30">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-mono text-xs text-foreground" title={row.model}>
          {row.model}
        </span>
        <span className="shrink-0 font-mono text-xs text-muted-foreground">
          {row.count.toLocaleString('vi-VN')} lượt · {sharePct.toFixed(0)}%
        </span>
      </div>
      {/* Thanh tỉ trọng lưu lượng. */}
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/30">
        <div className="h-full rounded-full bg-gold/70" style={{ width: `${sharePct}%` }} />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-0.5 text-[11px]">
        <span className="text-muted-foreground">
          Cost: <span className="font-mono text-foreground">{fmtUsd(row.cost_usd_total)}</span>
          {row.count > 0 && row.cost_usd_total === 0 ? (
            <span className="ml-1 text-amber-500">(không ghi)</span>
          ) : null}
        </span>
        <span className="text-muted-foreground">
          TB/lượt: <span className="font-mono text-foreground">{fmtUsd(row.avg_cost_usd)}</span>
        </span>
        <span className={errBad ? 'font-semibold text-rose-500' : 'text-muted-foreground'}>
          Lỗi: <span className="font-mono">{row.error_rate_pct.toFixed(1)}%</span>
        </span>
      </div>
    </li>
  );
}

export function ModelHealthTab() {
  const [days, setDays] = React.useState<number>(7);

  const q = useQuery({
    queryKey: ['ai-model-health', days],
    queryFn: () => getModelHealth(days),
    staleTime: 60_000,
  });

  const models = q.data?.models ?? [];
  const total = q.data?.total_count ?? 0;
  // Caveat khi có lưu lượng nhưng tổng cost = 0 (ledger thưa cost).
  const costAllZero =
    models.length > 0 && models.every((m) => m.cost_usd_total === 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-4 w-4 text-gold" />
              Sức khoẻ model
            </CardTitle>
            <CardDescription>
              Phân bố lưu lượng, cost và tỉ lệ lỗi theo từng model. Giúp phát hiện lạm-dụng
              fallback hoặc một model đang hỏng. Tô đỏ khi tỉ lệ lỗi ≥ {ERROR_RED_PCT}%.
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
            title="Chưa có dữ liệu sức khoẻ model"
            description="Endpoint /admin/ai/model-health chưa được triển khai, hoặc chưa có cuộc gọi nào trong khoảng thời gian này."
          />
        ) : models.length === 0 ? (
          <EmptyState
            title="Chưa có cuộc gọi nào"
            description={`Không có trace LLM trong ${days === 1 ? '24 giờ' : `${days} ngày`} qua.`}
          />
        ) : (
          <>
            {costAllZero ? (
              <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Cột cost bằng 0 vì ledger không ghi chi phí cho mọi loại trace (đặc biệt
                  pipeline báo cáo). Số đáng tin ở đây là <strong>số lượt gọi</strong> và{' '}
                  <strong>tỉ lệ lỗi</strong>. Chi phí chi tiết xem trang Chi tiêu LLM.
                </span>
              </div>
            ) : null}
            <p className="mb-3 text-xs text-muted-foreground">
              Tổng <span className="font-semibold text-foreground">{total.toLocaleString('vi-VN')}</span>{' '}
              lượt gọi qua {models.length} model.
            </p>
            <ol className="space-y-2">
              {models.map((m) => (
                <ModelRow key={m.model} row={m} total={total} />
              ))}
            </ol>
          </>
        )}
      </CardContent>
    </Card>
  );
}
