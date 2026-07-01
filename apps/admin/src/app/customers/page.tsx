'use client';

/**
 * /admin/customers — Wave 60.71.T2.customers redesign.
 *
 * Vault 107 §5.5 Tier 2. Splits a 356-LOC monolith (raw <table> + raw
 * <select>/<input> filters + hand-rolled avatar + inline KPI calc) into:
 *
 *   ├─ This file (~180 LOC orchestration: queries, KPI strip, filter chrome)
 *   ├─ <AdminTable> primitive (components/admin/table/AdminTable.tsx)
 *   ├─ <CustomerAvatar> + <PlanBadge> (components/admin/customers/*)
 *   └─ <CustomerRowActions> DropdownMenu (Wave 60.68)
 *
 * RSC discipline:
 *   - Icons pre-rendered at the call site (Wave 60.65.P0a)
 *   - No inline arrow fns in props (Wave 60.66.HF1) — page stays Client
 *     because it owns interactive filter state
 *   - Defensive `Array.isArray` on data crossing React Query cache boundary
 *     (Wave 60.65.P0c)
 *
 * Mutation endpoints (suspend / delete / role-edit) do NOT exist on the
 * backend, so those row actions were removed (they previously popped a
 * confirm dialog then silently no-op'd). Row actions are read-only now
 * (just "Xem chi tiết"). A follow-up wave can re-add them once
 * /api/admin/customers/:id supports PATCH/DELETE.
 */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from '@hieu-asia/ui';
import {
  ChevronDown,
  Crown,
  Download,
  Filter,
  UserCheck,
  Users,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { SavedFiltersMenu } from '@/components/admin/SavedFiltersMenu';
import { useSavedFilters } from '@/lib/saved-filters';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/table/AdminTable';
import { CustomerAvatar } from '@/components/admin/customers/CustomerAvatar';
import { PlanBadge } from '@/components/admin/customers/PlanBadge';
import { CustomerRowActions } from '@/components/admin/customers/CustomerRowActions';
import { SetPlanDialog } from '@/components/admin/customers/SetPlanDialog';
import { fmtDate } from '@/components/admin/customers/format';
import type { Customer } from '@/components/admin/customers/types';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';

interface CustomersResponse {
  ok: boolean;
  customers?: Customer[];
  next_cursor?: string | null;
  total?: number;
  note?: string;
  error?: string;
}

type PlanFilter = 'all' | 'free' | 'premium' | 'subscription' | 'lifetime';

const PLAN_OPTIONS: Array<{ value: PlanFilter; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'free', label: 'Miễn phí' },
  { value: 'premium', label: 'Premium' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'lifetime', label: 'Lifetime' },
];

const LIMIT = 50;

const CSV_HEADERS = {
  id: 'ID',
  email: 'Email',
  telegram_id: 'Telegram',
  plan: 'Plan',
  created_at: 'Tạo lúc',
  last_active: 'Hoạt động cuối',
} as const;

async function fetchCustomers(params: {
  search: string;
  plan: PlanFilter;
  limit: number;
  cursor?: string;
}): Promise<CustomersResponse> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.plan !== 'all') qs.set('plan', params.plan);
  qs.set('limit', String(params.limit));
  if (params.cursor) qs.set('cursor', params.cursor);
  const res = await fetch(`/api/admin/customers?${qs.toString()}`, {
    cache: 'no-store',
  });
  const text = await res.text();
  try {
    return JSON.parse(text) as CustomersResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

export default function CustomersPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [plan, setPlan] = React.useState<PlanFilter>('all');
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const savedFilters = useSavedFilters<{ search: string; plan: PlanFilter }>(
    'customers',
    { search: '', plan: 'all' },
  );

  React.useEffect(() => {
    const t = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['admin', 'customers', { search, plan, cursor, limit: LIMIT }],
    queryFn: () => fetchCustomers({ search, plan, limit: LIMIT, cursor }),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  // Defensive Array.isArray — Wave 60.65.P0c lesson: `?? []` only catches
  // null/undefined; shape drift can still surface `{error: "..."}` here.
  const customers = React.useMemo(
    () => (Array.isArray(data?.customers) ? data.customers : []),
    [data?.customers],
  );

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;

  // KPI aggregates — page slice only until backend exposes global totals.
  const totalShown = customers.length;
  const paying = customers.filter(
    (c) => c.plan === 'premium' || c.plan === 'subscription' || c.plan === 'lifetime',
  ).length;
  const free = customers.filter((c) => !c.plan || c.plan === 'free').length;
  const last7 = customers.filter((c) => {
    if (!c.last_active) return false;
    const t = new Date(c.last_active).getTime();
    return !Number.isNaN(t) && Date.now() - t < 7 * 24 * 3600 * 1000;
  }).length;

  const onSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
      setCursor(undefined);
    },
    [],
  );

  const onPlanChange = React.useCallback((v: string) => {
    setPlan(v as PlanFilter);
    setCursor(undefined);
  }, []);

  const onRowClick = React.useCallback(
    (row: Customer) => {
      router.push(`/customers/${encodeURIComponent(row.id)}`);
    },
    [router],
  );

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const onNextPage = React.useCallback(() => {
    if (data?.next_cursor) setCursor(data.next_cursor);
  }, [data?.next_cursor]);

  const onExportCsv = React.useCallback(() => {
    exportToCSV(
      customers.map((c) => ({
        id: c.id,
        email: c.email ?? '',
        telegram_id: c.telegram_id ?? '',
        plan: c.plan ?? '',
        created_at: c.created_at ?? '',
        last_active: c.last_active ?? '',
      })),
      fmtCsvFilename('customers'),
      CSV_HEADERS,
    );
    // CSV runs client-side from the rows already fetched — only the current
    // page (max LIMIT). Warn when more pages exist so the export isn't
    // mistaken for the full customer list.
    if (data?.next_cursor) {
      toast.warning('Chỉ xuất các khách đang hiển thị trên trang này', {
        description: `Còn trang sau chưa tải. File chỉ gồm ${customers.length} dòng của trang hiện tại.`,
      });
    } else {
      toast.success(`Đang tải CSV ${customers.length} khách hàng…`);
    }
  }, [customers, data?.next_cursor]);

  const columns = React.useMemo<AdminTableColumn<Customer>[]>(
    () => [
      {
        id: 'avatar',
        header: '',
        width: '48px',
        cell: (c) => <CustomerAvatar email={c.email} name={c.display_name} />,
      },
      {
        id: 'email',
        header: 'Email',
        sortKey: 'email',
        cell: (c) => (
          <div className="min-w-0">
            <div className="truncate font-mono text-sm text-foreground">
              {c.email ?? '—'}
            </div>
          </div>
        ),
      },
      {
        id: 'plan',
        header: 'Plan',
        sortKey: 'plan',
        width: '120px',
        cell: (c) => <PlanBadge plan={c.plan} />,
      },
      {
        id: 'telegram',
        header: 'Telegram',
        width: '140px',
        hideOnMobile: true,
        cell: (c) => (
          <span className="font-mono text-xs text-muted-foreground">
            {c.telegram_id ?? '—'}
          </span>
        ),
      },
      {
        id: 'created_at',
        header: 'Tạo lúc',
        sortKey: 'created_at',
        width: '150px',
        hideOnMobile: true,
        cell: (c) => (
          <span className="font-mono text-xs text-muted-foreground">
            {fmtDate(c.created_at)}
          </span>
        ),
      },
      {
        id: 'last_active',
        header: 'Hoạt động cuối',
        sortKey: 'last_active',
        width: '150px',
        hideOnMobile: true,
        cell: (c) => (
          <span className="font-mono text-xs text-muted-foreground">
            {fmtDate(c.last_active)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        width: '48px',
        cell: (c) => <CustomerRowActions customer={c} />,
      },
    ],
    [],
  );

  const planLabel =
    PLAN_OPTIONS.find((p) => p.value === plan)?.label ?? 'Tất cả';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Khách hàng"
        description="End-user dùng hieu.asia (Supabase users + reading_sessions). Click row để xem chi tiết."
        icon={<Users className="h-5 w-5" aria-hidden />}
        actions={
          <>
            <SetPlanDialog />
            <Button
              variant="outline"
              size="sm"
              onClick={onExportCsv}
              disabled={customers.length === 0}
              title="Xuất các khách đang hiển thị trên trang hiện tại ra file CSV."
            >
              <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Xuất CSV {data?.next_cursor ? 'trang này' : ''}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
            >
              {isFetching ? 'Đang tải…' : 'Làm mới'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Hiển thị / trang"
          value={totalShown}
          icon={<Users className="h-4 w-4" aria-hidden />}
          accent="gold"
          hint={`tối đa ${LIMIT}`}
        />
        <KpiCard
          label="Active 7d"
          value={last7}
          icon={<UserCheck className="h-4 w-4" aria-hidden />}
          accent="jade"
          hint="có hoạt động"
        />
        <KpiCard
          label="Paying"
          value={paying}
          icon={<Crown className="h-4 w-4" aria-hidden />}
          accent="gold"
          hint="premium + sub + lifetime"
        />
        <KpiCard
          label="Free tier"
          value={free}
          icon={<Filter className="h-4 w-4" aria-hidden />}
          accent="purple"
          hint="miễn phí"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Tìm theo email hoặc ID (debounce 300ms).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={searchInput}
              onChange={onSearchChange}
              placeholder="Tìm theo email hoặc ID…"
              className="min-w-0 flex-1 rounded-md border border-gold/20 bg-card/60 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:border-gold focus:outline-none"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground hover:border-gold/50"
                  aria-label="Lọc theo plan"
                >
                  <Filter className="h-3 w-3 text-muted-foreground" aria-hidden />
                  <span>{planLabel}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[12rem]">
                <DropdownMenuLabel>Plan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={plan} onValueChange={onPlanChange}>
                  {PLAN_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <SavedFiltersMenu
              className="ml-auto"
              presets={savedFilters.presets}
              onApply={(name) => {
                const p = savedFilters.loadPreset(name);
                if (p) {
                  setSearchInput(p.search);
                  setPlan(p.plan);
                  setCursor(undefined);
                }
              }}
              onDelete={savedFilters.deletePreset}
              onSave={(name) =>
                savedFilters.savePreset(name, { search: searchInput, plan })
              }
              saveHint="Lưu tìm kiếm + plan hiện tại"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>
            {customers.length} / tối đa {LIMIT} mỗi trang. Click row để xem chi tiết.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được dữ liệu khách hàng.'}
                onRetry={onRefresh}
              />
            </div>
          )}
          {note && !showError && (
            <div className="mb-4 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
              {note}
            </div>
          )}

          <AdminTable<Customer>
            rows={customers}
            columns={columns}
            onRowClick={onRowClick}
            loading={isLoading}
            caption="Danh sách khách hàng"
            empty={
              <EmptyState
                title={
                  search || plan !== 'all'
                    ? 'Không có khách hàng khớp bộ lọc'
                    : 'Chưa có khách hàng nào'
                }
                description={
                  search || plan !== 'all'
                    ? 'Thử bỏ filter hoặc xoá search query.'
                    : 'Khi user đầu tiên đăng ký qua Telegram hoặc email, dòng đầu tiên sẽ hiện ở đây.'
                }
                className="border-0 bg-transparent"
              />
            }
          />

          {data?.next_cursor && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" onClick={onNextPage}>
                Trang sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
