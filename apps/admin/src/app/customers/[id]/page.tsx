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
 *   └─ <AdminTable> primitive — transactions + audit lists
 *
 * Account-mutation actions (đổi role / tạm khoá / xoá) were removed — no
 * backend mutation routes exist (/api/admin/customers/:id is read-only), so
 * they popped a confirm dialog then silently no-op'd. Re-add once mutation
 * endpoints land.
 */

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  toast,
} from '@hieu-asia/ui';
import {
  ChevronLeft,
  Copy,
  ListTodo,
  Receipt,
  ShieldAlert,
  User,
} from 'lucide-react';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import { CustomerDetailTabs } from '@/components/admin/customers/CustomerDetailTabs';
import { CustomerIntelligenceCard } from '@/components/admin/customers/CustomerIntelligenceCard';
import { PlanBadge } from '@/components/admin/customers/PlanBadge';
import { SetPlanDialog } from '@/components/admin/customers/SetPlanDialog';
import { ContactCustomerDialog } from '@/components/admin/ContactCustomerDialog';
import type {
  CustomerDetailResponse,
} from '@/components/admin/customers/detail-types';

const VALID_TABS = [
  'profile',
  'sessions',
  'journey',
  'transactions',
  'refunds',
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
  const refunds = React.useMemo(
    () => (Array.isArray(data?.refunds) ? data.refunds : []),
    [data?.refunds],
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
          {/* Liên hệ khách qua email (template có sẵn). Tự vô hiệu hoá khi không
              có email — vẫn render để giải thích vì sao không gửi được. */}
          <ContactCustomerDialog email={customer?.email ?? null} />
          {customer?.email && (
            <SetPlanDialog
              defaultEmail={customer.email}
              triggerLabel="Cấp gói cho user này"
              onSuccess={() => refetch()}
            />
          )}
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={isFetching}>
            {isFetching ? 'Đang tải…' : 'Làm mới'}
          </Button>
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

      {(enrichedCustomer ?? customer) && (
        <CustomerIntelligenceCard
          customer={(enrichedCustomer ?? customer)!}
          sessionCount={sessions.length}
          totalSpendVnd={totalSpend}
        />
      )}

      <Card>
        <CardContent className="pt-6">
          <CustomerDetailTabs
            customer={enrichedCustomer ?? customer}
            sessions={sessions}
            transactions={transactions}
            refunds={refunds}
            auditTrail={auditTrail}
            value={active}
            onValueChange={onTabChange}
            userId={id}
            onSessionMutated={() => refetch()}
            onRefundMutated={() => refetch()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
