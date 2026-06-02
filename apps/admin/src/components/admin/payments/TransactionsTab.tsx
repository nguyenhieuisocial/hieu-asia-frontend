'use client';

/**
 * Wave 60.71.T2.payments — Transactions tab extract.
 *
 * Vault 107 §5 Tier 2 — splits the /payments page into per-tab components so
 * KPIs + Transactions + Coupons each live in their own surface. Visual parity
 * with Wave 60.62.T1.2 /affiliates: ProductTabs wrapper hosts these.
 *
 * Material 3 — Wave 60.68 DropdownMenu replaces the 3× raw `<select>` filter
 * dropdowns (Status / Plan / Saved presets). Refund confirmation uses the
 * shared Dialog primitive instead of native `confirm()` (better keyboard
 * focus trap + brand-correct chrome).
 *
 * Wave 60.65.P0a + Wave 60.66.HF1 — icons pre-rendered at the call site,
 * no Component refs or inline arrow fns crossing RSC boundaries (the
 * /payments page is itself a Client Component, but we keep the discipline
 * so future RSC splits don't bite).
 */

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  StatusBadge,
  type DataTableColumn,
} from '@hieu-asia/ui';
import {
  BookmarkPlus,
  ChevronDown,
  Download,
  Filter,
  Trash2,
  Undo2,
} from 'lucide-react';
import { listTransactions, refundTransaction } from '@/lib/admin-api';
import { ErrorBlock } from '@/components/admin/error-block';
import type { AdminTransaction } from '@/lib/mock-data';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';
import { useSavedFilters } from '@/lib/saved-filters';

const STATUS_TONE: Record<
  AdminTransaction['status'],
  React.ComponentProps<typeof StatusBadge>['status']
> = {
  succeeded: 'success',
  refunded: 'warning',
  pending: 'neutral',
  failed: 'error',
};

const PLAN_LABEL: Record<AdminTransaction['plan'], string> = {
  mentor_month: 'Mentor tháng',
  mentor_year: 'Mentor năm',
  lifetime: 'Trọn đời',
};

type StatusFilter = 'all' | AdminTransaction['status'];
type PlanFilter = 'all' | AdminTransaction['plan'];

interface PaymentsFilter {
  status: StatusFilter;
  plan: PlanFilter;
}

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'succeeded', label: 'Succeeded' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const PLAN_OPTIONS: Array<{ value: PlanFilter; label: string }> = [
  { value: 'all', label: 'Tất cả gói' },
  { value: 'mentor_month', label: 'Mentor tháng' },
  { value: 'mentor_year', label: 'Mentor năm' },
  { value: 'lifetime', label: 'Trọn đời' },
];

/**
 * Mask a secret-like opaque string: show first 4 + last 4 (e.g. Stripe/SePay IDs).
 */
function maskSecret(value: string | null | undefined): string {
  if (!value) return '—';
  const s = String(value);
  if (s.length <= 12) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

const CSV_HEADERS = {
  id: 'ID',
  user_email: 'User',
  plan: 'Plan',
  amount_usd: 'Amount (USD)',
  status: 'Status',
  stripe_id: 'Stripe ID',
  created_at: 'Created',
} as const;

export interface TransactionsTabProps {
  /** Lift filter state up so KPI cards can react. */
  onRowsChange?: (rows: AdminTransaction[]) => void;
  onTotalChange?: (total: number) => void;
}

export function TransactionsTab({ onRowsChange, onTotalChange }: TransactionsTabProps) {
  const qc = useQueryClient();
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [plan, setPlan] = React.useState<PlanFilter>('all');
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  // Saved filter presets (status + plan). Persisted under
  // `hieu-admin:filters:payments:v1`.
  const { presets, savePreset, loadPreset, deletePreset } = useSavedFilters<PaymentsFilter>(
    'payments',
    { status: 'all', plan: 'all' },
  );

  const tx = useQuery({
    queryKey: ['admin', 'transactions', page],
    queryFn: () => listTransactions({ page, page_size: 15 }),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const refund = useMutation({
    mutationFn: (id: string) => refundTransaction(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'transactions'] }),
  });

  // Defensive Array.isArray (Wave 60.65.P0c lesson — `?? []` only catches
  // null/undefined; shape drift across RSC/cache boundaries can still surface
  // `{error: "..."}` instead of `{rows: [...]}`).
  const rows = React.useMemo(() => {
    const allRows = Array.isArray(tx.data?.rows) ? tx.data.rows : [];
    return allRows.filter((t) => {
      if (status !== 'all' && t.status !== status) return false;
      if (plan !== 'all' && t.plan !== plan) return false;
      return true;
    });
  }, [tx.data?.rows, status, plan]);

  // Bubble derived data up so the KPI strip stays in sync.
  React.useEffect(() => {
    onRowsChange?.(rows);
  }, [rows, onRowsChange]);
  React.useEffect(() => {
    onTotalChange?.(tx.data?.total ?? 0);
  }, [tx.data?.total, onTotalChange]);

  const applyPreset = React.useCallback(
    (name: string) => {
      const p = loadPreset(name);
      if (!p) return;
      setStatus(p.status);
      setPlan(p.plan);
    },
    [loadPreset],
  );

  const onSavePreset = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const name = window.prompt('Tên bộ lọc?', 'Bộ lọc của tôi');
    if (!name || !name.trim()) return;
    savePreset(name, { status, plan });
  }, [savePreset, status, plan]);

  const onDeletePreset = React.useCallback(
    (name: string) => {
      if (window.confirm(`Xoá bộ lọc "${name}"?`)) {
        deletePreset(name);
      }
    },
    [deletePreset],
  );

  const handleRefundConfirm = React.useCallback(() => {
    if (!confirmingId) return;
    const id = confirmingId;
    setConfirmingId(null);
    refund.mutate(id);
  }, [confirmingId, refund]);

  const confirmingTx = React.useMemo(
    () => (confirmingId ? rows.find((t) => t.id === confirmingId) ?? null : null),
    [confirmingId, rows],
  );

  const onExportCsv = React.useCallback(() => {
    exportToCSV(
      rows.map((t) => ({
        id: t.id,
        user_email: t.user_email,
        plan: t.plan,
        amount_usd: t.amount_usd,
        status: t.status,
        stripe_id: t.stripe_id,
        created_at: t.created_at,
      })),
      fmtCsvFilename('payments'),
      CSV_HEADERS,
    );
  }, [rows]);

  const txCols: DataTableColumn<AdminTransaction>[] = React.useMemo(
    () => [
      {
        key: 'id',
        header: 'ID',
        width: '110px',
        cell: (t) => (
          <span className="font-mono text-xs" title={t.id}>
            {maskSecret(t.id)}
          </span>
        ),
      },
      { key: 'user_email', header: 'User' },
      { key: 'plan', header: 'Gói', width: '120px', cell: (t) => PLAN_LABEL[t.plan] },
      {
        key: 'amount_usd',
        header: 'Amount',
        align: 'right',
        width: '90px',
        cell: (t) => `$${t.amount_usd.toFixed(2)}`,
      },
      {
        key: 'status',
        header: 'Trạng thái',
        width: '140px',
        cell: (t) =>
          // Wave 60.81.B Tier 3 polish — refunded rows get an Undo2 leader
          // icon so the warning-tone pill reads instantly as "money returned"
          // (not "approval pending"). Other statuses keep the plain badge so
          // the icon stays a meaningful diff, not noise.
          t.status === 'refunded' ? (
            <span className="inline-flex items-center gap-1.5">
              <Undo2 className="h-3 w-3 text-warn-700 dark:text-warn-300" aria-hidden />
              <StatusBadge status={STATUS_TONE[t.status]} label={t.status} />
            </span>
          ) : (
            <StatusBadge status={STATUS_TONE[t.status]} label={t.status} />
          ),
      },
      {
        key: 'created_at',
        header: 'Tạo',
        width: '150px',
        cell: (t) =>
          new Date(t.created_at).toLocaleString('vi-VN', {
            dateStyle: 'short',
            timeStyle: 'short',
          }),
      },
      {
        key: 'stripe_id',
        header: 'Stripe',
        cell: (t) => (
          <span className="font-mono text-xs text-muted-foreground" title={t.stripe_id}>
            {maskSecret(t.stripe_id)}
          </span>
        ),
      },
      {
        key: 'actions',
        header: '',
        width: '110px',
        cell: (t) =>
          t.status === 'succeeded' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmingId(t.id)}
              disabled={refund.isPending}
            >
              Refund
            </Button>
          ) : null,
      },
    ],
    [refund.isPending],
  );

  const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label ?? 'Tất cả';
  const planLabel = PLAN_OPTIONS.find((o) => o.value === plan)?.label ?? 'Tất cả';
  const activeFilterCount =
    (status !== 'all' ? 1 : 0) + (plan !== 'all' ? 1 : 0);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>
              Webhook events ghi tại <code className="font-mono text-xs">/v1/payments/webhook</code>.
              Refund đi qua Stripe API.
            </CardDescription>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-2.5 text-xs text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                    aria-label="Lọc theo trạng thái"
                  >
                    <Filter className="h-3 w-3 text-muted-foreground" aria-hidden />
                    <span>{statusLabel}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[12rem]">
                  <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={status}
                    onValueChange={(v) => setStatus(v as StatusFilter)}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-2.5 text-xs text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                    aria-label="Lọc theo gói"
                  >
                    <Filter className="h-3 w-3 text-muted-foreground" aria-hidden />
                    <span>{planLabel}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[12rem]">
                  <DropdownMenuLabel>Gói</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={plan}
                    onValueChange={(v) => setPlan(v as PlanFilter)}
                  >
                    {PLAN_OPTIONS.map((opt) => (
                      <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {presets.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/30 bg-card/60 px-2.5 text-xs text-gold transition-all duration-300 ease-editorial hover:border-gold/60"
                      aria-label="Bộ lọc đã lưu"
                    >
                      <BookmarkPlus className="h-3 w-3" aria-hidden />
                      <span>Bộ lọc đã lưu</span>
                      <ChevronDown className="h-3 w-3" aria-hidden />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[12rem]">
                    <DropdownMenuLabel>Áp dụng</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {presets.map((p) => (
                      <DropdownMenuItem key={p.name} onSelect={() => applyPreset(p.name)}>
                        {p.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Xoá</DropdownMenuLabel>
                    {presets.map((p) => (
                      <DropdownMenuItem
                        key={`del-${p.name}`}
                        onSelect={() => onDeletePreset(p.name)}
                        className="text-red-700 dark:text-red-300 focus:bg-red-500/10 focus:text-red-700 dark:focus:text-red-200"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden />
                        {p.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button size="sm" variant="outline" onClick={onSavePreset}>
                <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                Lưu bộ lọc
              </Button>

              {activeFilterCount > 0 && (
                <span className="ml-1 rounded bg-gold/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                  {activeFilterCount} filter
                </span>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onExportCsv}
            disabled={rows.length === 0}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Xuất CSV
          </Button>
        </CardHeader>
        <CardContent>
          {tx.error ? (
            <ErrorBlock
              compact
              message={(tx.error as Error).message}
              onRetry={() => tx.refetch()}
            />
          ) : (
            <DataTable
              columns={txCols}
              rows={rows}
              rowKey={(t) => t.id}
              page={tx.data?.page ?? 1}
              pageSize={tx.data?.page_size ?? 15}
              total={tx.data?.total ?? 0}
              onPageChange={setPage}
              emptyState={
                tx.isLoading
                  ? 'Đang tải…'
                  : status !== 'all' || plan !== 'all'
                    ? 'Không có giao dịch khớp bộ lọc.'
                    : 'Chưa có giao dịch.'
              }
            />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={confirmingId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmingId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận refund</DialogTitle>
            <DialogDescription>
              Hành động này gọi Stripe API hoàn tiền. Không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {confirmingTx && (
            <div className="space-y-1.5 rounded-md border border-gold/15 bg-card/60 p-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">User</span>
                <span className="font-mono">{confirmingTx.user_email}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Gói</span>
                <span>{PLAN_LABEL[confirmingTx.plan]}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Số tiền</span>
                <span className="font-mono text-gold">
                  ${confirmingTx.amount_usd.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Stripe</span>
                <span className="font-mono text-xs">{maskSecret(confirmingTx.stripe_id)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmingId(null)}>
              Huỷ
            </Button>
            <Button onClick={handleRefundConfirm} disabled={refund.isPending}>
              {refund.isPending ? 'Đang xử lý…' : 'Xác nhận refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
