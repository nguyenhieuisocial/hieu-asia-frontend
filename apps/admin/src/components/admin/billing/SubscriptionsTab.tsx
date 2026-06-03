'use client';

/**
 * Wave 60.71.T2.billing — Subscriptions tab.
 *
 * Vault 107 §5.8 /billing spec — Stripe subscription list with cancel
 * action via Wave 60.68 Dialog primitive. Filter chrome mirrors the
 * /payments TransactionsTab (Wave 60.71.T2.payments) for visual parity.
 *
 * RSC discipline:
 *   - Icons pre-rendered at the call site (Wave 60.65.P0a)
 *   - No inline arrow fns in props (Wave 60.70 ESLint will catch them)
 *   - Defensive Array.isArray on async data (Wave 60.65.P0c)
 *
 * Mobile: hides `MRR contribution` column under `sm:` breakpoint per
 * spec — keeps the table scannable on phones without horizontal scroll.
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
  ChevronDown,
  Filter,
  MoreHorizontal,
  XCircle,
} from 'lucide-react';
import { cancelSubscription, listSubscriptions } from '@/lib/admin-api';
import { ErrorBlock } from '@/components/admin/error-block';
import { formatDateOrEmpty } from '@/lib/format-date';
import type { AdminSubscription } from '@/lib/mock-data';

const STATUS_TONE: Record<
  AdminSubscription['status'],
  React.ComponentProps<typeof StatusBadge>['status']
> = {
  active: 'success',
  trialing: 'neutral',
  past_due: 'warning',
  canceled: 'error',
};

const STATUS_LABEL: Record<AdminSubscription['status'], string> = {
  active: 'Đang hoạt động',
  trialing: 'Thử nghiệm',
  past_due: 'Quá hạn',
  canceled: 'Đã hủy',
};

const PLAN_LABEL: Record<AdminSubscription['plan'], string> = {
  mentor_month: 'Mentor tháng',
  mentor_year: 'Mentor năm',
  lifetime: 'Trọn đời',
};

type StatusFilter = 'all' | AdminSubscription['status'];
type PlanFilter = 'all' | AdminSubscription['plan'];

const STATUS_OPTIONS: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: STATUS_LABEL.active },
  { value: 'trialing', label: STATUS_LABEL.trialing },
  { value: 'past_due', label: STATUS_LABEL.past_due },
  { value: 'canceled', label: STATUS_LABEL.canceled },
];

const PLAN_OPTIONS: Array<{ value: PlanFilter; label: string }> = [
  { value: 'all', label: 'Tất cả gói' },
  { value: 'mentor_month', label: PLAN_LABEL.mentor_month },
  { value: 'mentor_year', label: PLAN_LABEL.mentor_year },
  { value: 'lifetime', label: PLAN_LABEL.lifetime },
];

function maskSecret(value: string | null | undefined): string {
  if (!value) return '—';
  const s = String(value);
  if (s.length <= 12) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

const fmtDate = (iso: string | null) => formatDateOrEmpty(iso, '—');

export interface SubscriptionsTabProps {
  /** Lift row data so the page-level KPI strip stays in sync. */
  onRowsChange?: (rows: AdminSubscription[]) => void;
  onTotalChange?: (total: number) => void;
}

export function SubscriptionsTab({ onRowsChange, onTotalChange }: SubscriptionsTabProps) {
  const qc = useQueryClient();
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [plan, setPlan] = React.useState<PlanFilter>('all');
  const [confirmingId, setConfirmingId] = React.useState<string | null>(null);

  const subs = useQuery({
    queryKey: ['admin', 'subscriptions', page, status, plan],
    queryFn: () =>
      listSubscriptions({
        page,
        page_size: 15,
        status: status === 'all' ? undefined : status,
        plan: plan === 'all' ? undefined : plan,
      }),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const cancel = useMutation({
    mutationFn: (id: string) => cancelSubscription(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'subscriptions'] }),
  });

  const rows = React.useMemo(
    () => (Array.isArray(subs.data?.rows) ? subs.data.rows : []),
    [subs.data?.rows],
  );

  React.useEffect(() => {
    onRowsChange?.(rows);
  }, [rows, onRowsChange]);
  React.useEffect(() => {
    onTotalChange?.(subs.data?.total ?? 0);
  }, [subs.data?.total, onTotalChange]);

  const handleSelectStatus = React.useCallback((v: string) => {
    setStatus(v as StatusFilter);
    setPage(1);
  }, []);
  const handleSelectPlan = React.useCallback((v: string) => {
    setPlan(v as PlanFilter);
    setPage(1);
  }, []);

  const handleOpenCancel = React.useCallback((id: string) => {
    setConfirmingId(id);
  }, []);
  const handleCloseCancel = React.useCallback(() => {
    setConfirmingId(null);
  }, []);
  const handleCancelConfirm = React.useCallback(() => {
    if (!confirmingId) return;
    const id = confirmingId;
    setConfirmingId(null);
    cancel.mutate(id);
  }, [confirmingId, cancel]);

  const confirmingSub = React.useMemo(
    () => (confirmingId ? rows.find((s) => s.id === confirmingId) ?? null : null),
    [confirmingId, rows],
  );

  const cols: DataTableColumn<AdminSubscription>[] = React.useMemo(
    () => [
      { key: 'user_email', header: 'User' },
      {
        key: 'plan',
        header: 'Gói',
        width: '120px',
        cell: (s) => PLAN_LABEL[s.plan],
      },
      {
        key: 'status',
        header: 'Trạng thái',
        width: '140px',
        cell: (s) => <StatusBadge status={STATUS_TONE[s.status]} label={STATUS_LABEL[s.status]} />,
      },
      {
        key: 'started_at',
        header: 'Bắt đầu',
        width: '120px',
        cell: (s) => fmtDate(s.started_at),
      },
      {
        key: 'next_bill_at',
        header: 'Lần tiếp',
        width: '120px',
        cell: (s) =>
          s.next_bill_at ? (
            fmtDate(s.next_bill_at)
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        key: 'mrr_contribution',
        header: 'MRR',
        align: 'right',
        width: '90px',
        // Mobile-hide per spec — keep table scannable on phones. `className`
        // applies to both <th> and <td> in DataTable (no separate
        // headerClassName prop).
        className: 'hidden sm:table-cell',
        cell: (s) => `$${s.mrr_contribution.toFixed(2)}`,
      },
      {
        key: 'stripe_subscription_id',
        header: 'Stripe',
        width: '120px',
        className: 'hidden md:table-cell',
        cell: (s) => (
          <span className="font-mono text-xs text-muted-foreground" title={s.stripe_subscription_id}>
            {maskSecret(s.stripe_subscription_id)}
          </span>
        ),
      },
      {
        key: 'actions',
        header: '',
        width: '60px',
        cell: (s) => <SubscriptionRowActions sub={s} onCancel={handleOpenCancel} />,
      },
    ],
    [handleOpenCancel],
  );

  const statusLabel = STATUS_OPTIONS.find((o) => o.value === status)?.label ?? 'Tất cả';
  const planLabel = PLAN_OPTIONS.find((o) => o.value === plan)?.label ?? 'Tất cả';
  const activeFilterCount = (status !== 'all' ? 1 : 0) + (plan !== 'all' ? 1 : 0);
  const filterIcon = <Filter className="h-3 w-3 text-muted-foreground" aria-hidden />;
  const chevronIcon = <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Stripe subscriptions thực + đang hoạt động. MRR contribution amortise lifetime (24m) +
              yearly (12m).
            </CardDescription>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-2.5 text-xs text-foreground hover:border-gold/50"
                    aria-label="Lọc theo trạng thái"
                  >
                    {filterIcon}
                    <span>{statusLabel}</span>
                    {chevronIcon}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[12rem]">
                  <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={status} onValueChange={handleSelectStatus}>
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
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-2.5 text-xs text-foreground hover:border-gold/50"
                    aria-label="Lọc theo gói"
                  >
                    {filterIcon}
                    <span>{planLabel}</span>
                    {chevronIcon}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[12rem]">
                  <DropdownMenuLabel>Gói</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={plan} onValueChange={handleSelectPlan}>
                    {PLAN_OPTIONS.map((opt) => (
                      <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {activeFilterCount > 0 && (
                <span className="ml-1 rounded bg-gold/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold">
                  {activeFilterCount} filter
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {subs.error ? (
            <ErrorBlock
              compact
              message={(subs.error as Error).message}
              onRetry={() => subs.refetch()}
            />
          ) : (
            <DataTable
              columns={cols}
              rows={rows}
              rowKey={(s) => s.id}
              page={subs.data?.page ?? 1}
              pageSize={subs.data?.page_size ?? 15}
              total={subs.data?.total ?? 0}
              onPageChange={setPage}
              emptyState={
                subs.isLoading
                  ? 'Đang tải…'
                  : status !== 'all' || plan !== 'all'
                    ? 'Không có subscription khớp bộ lọc.'
                    : 'Chưa có subscription.'
              }
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmingId !== null} onOpenChange={(open) => { if (!open) handleCloseCancel(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hủy subscription?</DialogTitle>
            <DialogDescription>
              User sẽ giữ quyền truy cập đến hết kỳ thanh toán hiện tại, sau đó downgrade về free.
              Hành động này gọi Stripe API.
            </DialogDescription>
          </DialogHeader>
          {confirmingSub && (
            <div className="space-y-1.5 rounded-md border border-gold/15 bg-card/60 p-3 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">User</span>
                <span className="font-mono">{confirmingSub.user_email}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Gói</span>
                <span>{PLAN_LABEL[confirmingSub.plan]}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">MRR</span>
                <span className="font-mono text-gold">
                  ${confirmingSub.mrr_contribution.toFixed(2)}/mo
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Stripe</span>
                <span className="font-mono text-xs">{maskSecret(confirmingSub.stripe_subscription_id)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCancel}>
              Giữ lại
            </Button>
            <Button
              onClick={handleCancelConfirm}
              disabled={cancel.isPending}
              className="border-red-500/40 dark:border-red-400/40 bg-red-500/10 text-red-700 dark:text-red-200 hover:bg-red-500/20"
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              {cancel.isPending ? 'Đang hủy…' : 'Xác nhận hủy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Row-level actions menu — Wave 60.68 DropdownMenu primitive.
 *
 * Extracted to keep the row callback in `cols` stable (no inline arrow fn,
 * Wave 60.70 ESLint rule). `onCancel` already stable via useCallback in
 * the parent so the menu won't thrash on re-renders.
 */
interface SubscriptionRowActionsProps {
  sub: AdminSubscription;
  onCancel: (id: string) => void;
}

function SubscriptionRowActions({ sub, onCancel }: SubscriptionRowActionsProps) {
  const canCancel = sub.status === 'active' || sub.status === 'trialing' || sub.status === 'past_due';
  const handleCancel = React.useCallback(() => onCancel(sub.id), [onCancel, sub.id]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Hành động cho ${sub.user_email}`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gold/20 bg-card/60 text-muted-foreground hover:border-gold/50 hover:text-gold"
        >
          <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuItem
          onSelect={handleCancel}
          disabled={!canCancel}
          className="text-red-700 dark:text-red-300 focus:bg-red-500/10 focus:text-red-700 dark:focus:text-red-200"
        >
          <XCircle className="h-3.5 w-3.5" aria-hidden />
          Hủy subscription
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
