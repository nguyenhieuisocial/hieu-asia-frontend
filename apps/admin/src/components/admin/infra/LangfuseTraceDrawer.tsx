'use client';

/**
 * LangfuseTraceDrawer — slide-out DETAIL for ONE Langfuse trace + its observations.
 *
 * Opened from a row on /infra/langfuse. Lazily fetches
 * GET /admin/infra/langfuse/:traceId (React Query enabled only while open) and
 * renders the trace header (latency / cost / user) plus each observation with a
 * size-capped input/output preview (~500 chars, truncated server-side).
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@hieu-asia/ui';
import { getInfraLangfuseDetail } from '@/lib/admin-api';
import { formatDateOrEmpty } from '@/lib/format-date';
import { ErrorBlock } from '@/components/admin/error-block';

function fmtLatency(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return '—';
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function fmtCost(usd: number | null | undefined): string {
  if (usd == null || !Number.isFinite(usd)) return '—';
  return `$${usd.toFixed(4)}`;
}

function StatLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-1.5 last:border-0">
      <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="break-all text-right text-sm text-foreground">{value}</span>
    </div>
  );
}

export interface LangfuseTraceDrawerProps {
  traceId: string | null;
  open: boolean;
  onClose: () => void;
}

export function LangfuseTraceDrawer({
  traceId,
  open,
  onClose,
}: LangfuseTraceDrawerProps): React.ReactElement {
  const enabled = open && !!traceId;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['infra', 'langfuse', 'detail', traceId],
    queryFn: () => getInfraLangfuseDetail(traceId!),
    enabled,
    staleTime: 30_000,
  });

  const trace = data && data.ok ? data.trace : undefined;
  const observations = data && data.ok ? data.observations : [];
  const showError = isError || (data && data.ok === false);
  const errorMsg = data && data.ok === false ? data.error : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="pb-4">
          <SheetTitle className="break-words pr-6">
            {trace?.name ?? 'Chi tiết trace'}
          </SheetTitle>
          {trace && (
            <SheetDescription className="break-all font-mono text-xs">
              {trace.id}
            </SheetDescription>
          )}
        </SheetHeader>

        {showError && (
          <ErrorBlock
            compact
            message={errorMsg ?? 'Không tải được chi tiết trace.'}
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

        {trace && !isLoading && (
          <div className="space-y-5">
            {/* Trace summary */}
            <div className="rounded-md border border-border bg-card/60 px-3 py-1">
              <StatLine label="Độ trễ" value={fmtLatency(trace.latency_ms)} />
              <StatLine label="Chi phí" value={fmtCost(trace.cost_usd)} />
              <StatLine label="Người dùng" value={trace.user_id ?? '—'} />
              <StatLine label="Thời gian" value={formatDateOrEmpty(trace.timestamp)} />
            </div>

            {/* Observations */}
            <div>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Observations ({observations.length})
              </p>
              {observations.length === 0 ? (
                <p className="text-sm text-muted-foreground">Không có observation.</p>
              ) : (
                <ol className="space-y-2">
                  {observations.map((o, i) => (
                    <li
                      key={`${o.name ?? '?'}-${i}`}
                      className="rounded-md border border-border/60 bg-card/60 px-3 py-2"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {o.name ?? '—'}
                        </span>
                        <span className="font-mono text-[10px] uppercase text-muted-foreground">
                          {o.type ?? '—'}
                          {o.model ? ` · ${o.model}` : ''}
                          {o.latency_ms != null ? ` · ${fmtLatency(o.latency_ms)}` : ''}
                        </span>
                      </div>
                      {o.input_preview && (
                        <div className="mt-1.5">
                          <span className="font-mono text-[10px] uppercase text-muted-foreground">
                            Input
                          </span>
                          <pre className="mt-0.5 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded bg-muted/30 px-2 py-1 font-mono text-[11px] text-foreground/90">
                            {o.input_preview}
                          </pre>
                        </div>
                      )}
                      {o.output_preview && (
                        <div className="mt-1.5">
                          <span className="font-mono text-[10px] uppercase text-muted-foreground">
                            Output
                          </span>
                          <pre className="mt-0.5 max-h-32 overflow-auto whitespace-pre-wrap break-words rounded bg-muted/30 px-2 py-1 font-mono text-[11px] text-foreground/90">
                            {o.output_preview}
                          </pre>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
