'use client';

/**
 * SupabaseRowsDrawer — slide-out READ-ONLY row browser for ONE Supabase table.
 *
 * Opened from a row on /infra/supabase (owner only). Lazily fetches
 * GET /admin/infra/supabase/rows?table=&limit= (React Query enabled only while
 * open) and renders the rows in a scrollable table. Sensitive columns are masked
 * server-side ("•••"); a note lists which were hidden. A row-limit selector
 * (25/50/100) re-queries. Read-only — no actions, no writes.
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
import { ShieldCheck } from 'lucide-react';
import { getInfraSupabaseRows } from '@/lib/admin-api';
import { ErrorBlock } from '@/components/admin/error-block';

const LIMIT_OPTIONS = [25, 50, 100] as const;

/** Render any cell value as a compact string. Objects → JSON; null → em dash. */
function cellText(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export interface SupabaseRowsDrawerProps {
  table: string | null;
  open: boolean;
  onClose: () => void;
}

export function SupabaseRowsDrawer({
  table,
  open,
  onClose,
}: SupabaseRowsDrawerProps): React.ReactElement {
  const [limit, setLimit] = React.useState<number>(25);
  const enabled = open && !!table;
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['infra', 'supabase', 'rows', table, limit],
    queryFn: () => getInfraSupabaseRows(table!, limit),
    enabled,
    staleTime: 30_000,
  });

  const success = data && data.ok ? data : undefined;
  const showError = isError || (data && data.ok === false);
  const errorMsg = data && data.ok === false ? data.error : undefined;
  const columns = success?.columns ?? [];
  const rows = success?.rows ?? [];
  const maskedColumns = success?.masked_columns ?? [];

  return (
    <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-hidden sm:max-w-3xl"
      >
        <SheetHeader className="pb-3">
          <SheetTitle className="flex items-center gap-2 font-mono">
            {table ?? 'Dòng dữ liệu'}
          </SheetTitle>
          <SheetDescription>
            Xem dữ liệu chỉ-đọc (read-only). Cột nhạy cảm đã được ẩn tự động.
          </SheetDescription>
        </SheetHeader>

        {/* Controls + masking note */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Số dòng
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground"
            >
              {LIMIT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          {maskedColumns.length > 0 && (
            <span
              title={`Đã ẩn cột nhạy cảm: ${maskedColumns.join(', ')}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-2.5 py-1 text-[11px] text-muted-foreground"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              Đã ẩn cột nhạy cảm ({maskedColumns.length})
            </span>
          )}
        </div>

        {showError && (
          <ErrorBlock
            compact
            message={errorMsg ?? 'Không tải được dữ liệu bảng.'}
            onRetry={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="space-y-2 pt-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-9 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        )}

        {success && !isLoading && rows.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Bảng này không có dòng nào.
          </p>
        )}

        {success && !isLoading && rows.length > 0 && (
          <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border text-left font-mono uppercase tracking-wide text-muted-foreground">
                  {columns.map((c) => (
                    <th key={c} className="whitespace-nowrap px-3 py-2">
                      {c}
                      {maskedColumns.includes(c) && (
                        <span className="ml-1 text-gold" title="Cột nhạy cảm — đã ẩn">
                          ●
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-border/40 last:border-0 hover:bg-gold/5"
                  >
                    {columns.map((c) => (
                      <td
                        key={c}
                        className="max-w-[18rem] truncate px-3 py-1.5 font-mono text-foreground/90"
                        title={cellText(r[c])}
                      >
                        {cellText(r[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {success && rows.length > 0 && (
          <p className="pt-2 text-right text-[11px] text-muted-foreground">
            {success.row_count} dòng · {columns.length} cột
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
