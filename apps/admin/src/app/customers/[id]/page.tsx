'use client';

/**
 * /admin/customers/[id] — Wave 60.71.T2.customers redesign.
 *
 * Vault 107 §5.5 Tier 2. Splits a 594-LOC monolith (hand-rolled header +
 * scattered <Card> grid + IIFE compliance card + raw <table> for transactions
 * + ad-hoc audit list) into:
 *
 *   ├─ This file (~200 LOC orchestration: query, KPI strip, header chrome)
 *   ├─ <CustomerDetailTabs> (components/admin/customers/CustomerDetailTabs)
 *   │     hosts Profile / Phiên / Giao dịch / Audit / Compliance
 *   ├─ <AdminTable> primitive — transactions + audit lists
 *   ├─ <CustomerRowActions> reused trigger style via DropdownMenu
 *   └─ <ConfirmActionDialog> Dialog (replaces native confirm)
 *
 * Detail-page action target is the page's customer, not a row. We synthesise
 * a ConfirmState from the loaded customer so it reuses the shared Dialog.
 */

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from '@hieu-asia/ui';
import {
  ChevronLeft,
  Copy,
  ListTodo,
  MoreHorizontal,
  Pencil,
  Receipt,
  ShieldAlert,
  ShieldOff,
  Trash2,
  User,
} from 'lucide-react';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import { CustomerDetailTabs } from '@/components/admin/customers/CustomerDetailTabs';
import { ConfirmActionDialog } from '@/components/admin/customers/ConfirmActionDialog';
import { PlanBadge } from '@/components/admin/customers/PlanBadge';
import type {
  ConfirmState,
  Customer,
  RowAction,
} from '@/components/admin/customers/types';
import type {
  CustomerDetailResponse,
} from '@/components/admin/customers/detail-types';

const VALID_TABS = [
  'profile',
  'sessions',
  'transactions',
  'audit',
  'compliance',
] as const;
type TabId = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is TabId {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

async function fetchCustomer(id: string): Promise<CustomerDetailResponse> {
  const res = await fetch(`/api/admin/customers/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  });
  const text = await res.text();
  try {
    return JSON.parse(text) as CustomerDetailResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

const ICON_PENCIL = <Pencil className="h-3.5 w-3.5" aria-hidden />;
const ICON_SUSPEND = <ShieldOff className="h-3.5 w-3.5" aria-hidden />;
const ICON_TRASH = <Trash2 className="h-3.5 w-3.5" aria-hidden />;
const ICON_MORE = <MoreHorizontal className="h-4 w-4" aria-hidden />;

export default function CustomerDetailPage() {
  // useSearchParams() requires a Suspense boundary (App Router CSR bailout).
  // Local boundary keeps sidebar/topbar mounted while ?tab= resolves.
  return (
    <React.Suspense fallback={<div className="h-72 animate-pulse rounded bg-muted/30" />}>
      <CustomerDetailPageInner />
    </React.Suspense>
  );
}

function CustomerDetailPageInner() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const id = params?.id ?? '';

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'customer', id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  const [confirm, setConfirm] = React.useState<ConfirmState | null>(null);

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const customer = data?.customer ?? null;
  const note = data?.note;

  // Defensive Array.isArray (Wave 60.65.P0c) on all 3 list shapes.
  const sessions = React.useMemo(
    () => (Array.isArray(data?.sessions) ? data.sessions : []),
    [data?.sessions],
  );
  const transactions = React.useMemo(
    () => (Array.isArray(data?.transactions) ? data.transactions : []),
    [data?.transactions],
  );
  const auditTrail = React.useMemo(
    () => (Array.isArray(data?.audit_trail) ? data.audit_trail : []),
    [data?.audit_trail],
  );

  const totalSpend = transactions.reduce((s, t) => s + (t.amount ?? 0), 0);

  // Wave 63.6 — enrich the customer with birth_date / birth_place /
  // primary_concern pulled from the most recent reading session's
  // state_json.birth_data. These live per-reading (not on the users row), so
  // without this the profile/compliance tab showed empty birth fields even
  // though the data exists (founder: "/customers chưa đầy đủ thông tin").
  const enrichedCustomer = React.useMemo(() => {
    if (!customer) return customer;
    const bd = sessions.find((s) => s.state_json?.birth_data)?.state_json
      ?.birth_data;
    if (!bd) return customer;
    return {
      ...customer,
      display_name: customer.display_name ?? bd.display_name ?? null,
      birth_date: customer.birth_date ?? bd.birth_date ?? null,
      birth_place: customer.birth_place ?? bd.birth_place ?? null,
      primary_concern: customer.primary_concern ?? bd.primary_concern ?? null,
    };
  }, [customer, sessions]);

  const copyId = React.useCallback(() => {
    navigator.clipboard
      .writeText(id)
      .then(() => toast.success('Đã copy ID'))
      .catch(() => toast.error('Không copy được'));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const param = searchParams.get('tab');
  const active: TabId = isValidTab(param) ? param : 'profile';

  const onTabChange = React.useCallback(
    (next: string) => {
      const qs = new URLSearchParams(searchParams.toString());
      qs.set('tab', next);
      router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  // Build a thin `Customer` from the detail shape so ConfirmActionDialog
  // can reuse its expected props. Memoised so onAction's deps stay stable
  // across renders (react-hooks/exhaustive-deps caught this in build).
  const confirmTarget: Customer | null = React.useMemo(() => {
    if (!customer) return null;
    return {
      id: customer.id,
      display_name: customer.display_name ?? null,
      email: customer.email ?? null,
      telegram_id: customer.telegram_id ?? null,
      plan: (customer.plan as Customer['plan']) ?? null,
    };
  }, [customer]);

  const onAction = React.useCallback(
    (action: RowAction) => {
      if (!confirmTarget) return;
      setConfirm({ action, customer: confirmTarget });
    },
    [confirmTarget],
  );

  const onConfirmAction = React.useCallback(() => {
    if (!confirm) return;
    const { action } = confirm;
    setConfirm(null);
    // TODO Wave 60.71.T2.customers.b — wire mutation routes.
    toast(`Backend pending: ${action}`, {
      description:
        'Endpoint /api/admin/customers/:id chưa hỗ trợ mutation. Sẽ wire trong wave kế tiếp.',
    });
  }, [confirm]);

  const onConfirmDismiss = React.useCallback((open: boolean) => {
    if (!open) setConfirm(null);
  }, []);

  const onEdit = React.useCallback(() => onAction('edit-role'), [onAction]);
  const onSuspend = React.useCallback(() => onAction('suspend'), [onAction]);
  const onDelete = React.useCallback(() => onAction('delete'), [onAction]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-muted/30" />
        <div className="h-20 animate-pulse rounded-xl bg-muted/30" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        Quay lại danh sách
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" aria-hidden />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Khách hàng
            </span>
            {customer?.plan && <PlanBadge plan={customer.plan} />}
          </div>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            {customer?.display_name ?? `Khách hàng ${id.slice(0, 8)}…`}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            {/* Wave 63 — show first 8 chars (founder: full UUID too long);
                full id stays in title + the copy button beside it. */}
            <p className="font-mono text-xs text-muted-foreground" title={id}>
              {id.slice(0, 8)}…
            </p>
            <button
              type="button"
              onClick={copyId}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-primary/10 hover:text-primary"
              aria-label="Copy ID"
              title="Copy ID"
            >
              <Copy className="h-3 w-3" aria-hidden />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}>
            {isFetching ? 'Đang tải…' : 'Làm mới'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gold/20 bg-card/60 text-muted-foreground hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ochre dark:focus-visible:ring-gold"
                aria-label="Hành động"
                disabled={!confirmTarget}
              >
                {ICON_MORE}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              <DropdownMenuItem onSelect={onEdit}>
                {ICON_PENCIL}
                Đổi role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={onSuspend}>
                {ICON_SUSPEND}
                Tạm khoá
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={onDelete}
                className="text-red-700 dark:text-red-300 focus:bg-red-500/10 focus:text-red-700 dark:focus:text-red-200"
              >
                {ICON_TRASH}
                Xoá
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {showError && (
        <ErrorBlock
          compact
          message={errorMsg ?? 'Không tải được chi tiết khách hàng.'}
          onRetry={onRefresh}
        />
      )}
      {note && !showError && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
          {note}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Phiên đã đọc"
          value={sessions.length}
          icon={<ListTodo className="h-4 w-4" aria-hidden />}
          accent="gold"
          hint="reading sessions"
        />
        <KpiCard
          label="Giao dịch"
          value={transactions.length}
          icon={<Receipt className="h-4 w-4" aria-hidden />}
          accent="jade"
          hint="lifetime"
        />
        <KpiCard
          label="Tổng chi tiêu"
          value={
            totalSpend > 0
              ? new Intl.NumberFormat('vi-VN').format(totalSpend) + ' đ'
              : '—'
          }
          icon={<Receipt className="h-4 w-4" aria-hidden />}
          accent="purple"
          hint="lifetime VND"
        />
        <KpiCard
          label="Sự kiện audit"
          value={auditTrail.length}
          icon={<ShieldAlert className="h-4 w-4" aria-hidden />}
          accent={auditTrail.length > 0 ? 'gold' : 'jade'}
          hint="touching account"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <CustomerDetailTabs
            customer={enrichedCustomer ?? customer}
            sessions={sessions}
            transactions={transactions}
            auditTrail={auditTrail}
            value={active}
            onValueChange={onTabChange}
          />
        </CardContent>
      </Card>

      <ConfirmActionDialog
        state={confirm}
        onOpenChange={onConfirmDismiss}
        onConfirm={onConfirmAction}
      />
    </div>
  );
}
