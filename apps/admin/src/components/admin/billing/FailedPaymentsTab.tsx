'use client';

/**
 * Wave 60.71.T2.billing — Failed Payments tab.
 *
 * Vault 107 §5.8 /billing spec — operator surface for declined / past-due
 * payments with one-click manual retry. Each row shows the Stripe decline
 * reason + auto-retry status.
 *
 * Wave 60.68 DropdownMenu for row actions; refund retry handled inline
 * (no dialog — operation is idempotent, low-risk).
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  StatusBadge,
  type DataTableColumn,
} from '@hieu-asia/ui';
import { RotateCcw } from 'lucide-react';
import { listFailedPayments, retryFailedPayment } from '@/lib/admin-api';
import { ErrorBlock } from '@/components/admin/error-block';
import { formatRelativeOrEmpty } from '@/lib/format-date';
import type { AdminFailedPayment } from '@/lib/mock-data';

const PLAN_LABEL: Record<AdminFailedPayment['plan'], string> = {
  mentor_month: 'Mentor tháng',
  mentor_year: 'Mentor năm',
  lifetime: 'Trọn đời',
};

const fmtRelative = (iso: string | null) => formatRelativeOrEmpty(iso);

export interface FailedPaymentsTabProps {
  onRowsChange?: (rows: AdminFailedPayment[]) => void;
}

export function FailedPaymentsTab({ onRowsChange }: FailedPaymentsTabProps) {
  const qc = useQueryClient();
  const [retryingId, setRetryingId] = React.useState<string | null>(null);

  const failed = useQuery({
    queryKey: ['admin', 'failed-payments'],
    queryFn: listFailedPayments,
  });

  const retry = useMutation({
    mutationFn: (id: string) => retryFailedPayment(id),
    onSettled: () => {
      setRetryingId(null);
      qc.invalidateQueries({ queryKey: ['admin', 'failed-payments'] });
    },
  });

  const rows = React.useMemo<AdminFailedPayment[]>(
    () => (Array.isArray(failed.data) ? failed.data : []),
    [failed.data],
  );

  React.useEffect(() => {
    onRowsChange?.(rows);
  }, [rows, onRowsChange]);

  const handleRetry = React.useCallback(
    (id: string) => {
      setRetryingId(id);
      retry.mutate(id);
    },
    [retry],
  );

  const cols: DataTableColumn<AdminFailedPayment>[] = React.useMemo(
    () => [
      { key: 'user_email', header: 'User' },
      {
        key: 'plan',
        header: 'Gói',
        width: '120px',
        cell: (p) => PLAN_LABEL[p.plan],
      },
      {
        key: 'amount_usd',
        header: 'Số tiền',
        align: 'right',
        width: '90px',
        cell: (p) => `$${p.amount_usd.toFixed(2)}`,
      },
      {
        key: 'reason_label',
        header: 'Lý do',
        cell: (p) => (
          <div className="flex flex-col">
            <span className="text-sm">{p.reason_label}</span>
            <code className="font-mono text-[10px] text-muted-foreground">{p.reason}</code>
          </div>
        ),
      },
      {
        key: 'retry_count',
        header: 'Retry',
        align: 'center',
        width: '90px',
        cell: (p) => (
          <StatusBadge
            status={p.retry_count >= 3 ? 'error' : p.retry_count >= 2 ? 'warning' : 'neutral'}
            label={`${p.retry_count}/3`}
          />
        ),
      },
      {
        key: 'failed_at',
        header: 'Thất bại',
        width: '120px',
        className: 'hidden sm:table-cell',
        cell: (p) => (
          <span className="text-xs text-muted-foreground">{fmtRelative(p.failed_at)}</span>
        ),
      },
      {
        key: 'next_retry_at',
        header: 'Retry tiếp',
        width: '110px',
        className: 'hidden md:table-cell',
        cell: (p) =>
          p.next_retry_at ? (
            <span className="text-xs text-muted-foreground">{fmtRelative(p.next_retry_at)}</span>
          ) : (
            <span className="text-xs text-red-300">Hết retry</span>
          ),
      },
      {
        key: 'actions',
        header: '',
        width: '90px',
        cell: (p) => (
          <RetryButton
            id={p.id}
            disabled={retry.isPending}
            isRunning={retry.isPending && retryingId === p.id}
            onRetry={handleRetry}
          />
        ),
      },
    ],
    [handleRetry, retry.isPending, retryingId],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thanh toán thất bại</CardTitle>
        <CardDescription>
          Stripe declined hoặc past_due. Auto-retry tối đa 3 lần — sau đó cần manual retry hoặc
          contact user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {failed.error ? (
          <ErrorBlock
            compact
            message={(failed.error as Error).message}
            onRetry={() => failed.refetch()}
          />
        ) : (
          <DataTable
            columns={cols}
            rows={rows}
            rowKey={(p) => p.id}
            emptyState={failed.isLoading ? 'Đang tải…' : 'Chưa có thanh toán thất bại.'}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface RetryButtonProps {
  id: string;
  disabled: boolean;
  isRunning: boolean;
  onRetry: (id: string) => void;
}

/**
 * Extracted button so the row cell renderer doesn't need an inline arrow
 * fn (Wave 60.70 ESLint rule). Stable across re-renders.
 */
function RetryButton({ id, disabled, isRunning, onRetry }: RetryButtonProps) {
  const handle = React.useCallback(() => onRetry(id), [id, onRetry]);
  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      className="inline-flex h-7 items-center gap-1 rounded-md border border-gold/30 bg-card/60 px-2 text-xs text-gold hover:border-gold/60 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RotateCcw className={isRunning ? 'h-3 w-3 animate-spin' : 'h-3 w-3'} aria-hidden />
      {isRunning ? 'Đang…' : 'Retry'}
    </button>
  );
}
