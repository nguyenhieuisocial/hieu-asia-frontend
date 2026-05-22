'use client';

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
  Input,
  Label,
  StatusBadge,
  type DataTableColumn,
} from '@hieu-asia/ui';
import {
  createCoupon,
  listCoupons,
  listTransactions,
  refundTransaction,
  toggleCoupon,
} from '@/lib/admin-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { LiveBadge } from '@/components/admin/live-badge';
import { CreditCard, DollarSign, Ticket, Undo2, TrendingUp, Download } from 'lucide-react';
import type { AdminCoupon, AdminTransaction } from '@/lib/mock-data';
import { exportToCSV, fmtCsvFilename } from '@/lib/csv-export';
import { useOptimisticMutation } from '@/lib/optimistic-mutation';
import { useSavedFilters } from '@/lib/saved-filters';

const STATUS_TONE: Record<AdminTransaction['status'], React.ComponentProps<typeof StatusBadge>['status']> = {
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

/**
 * Mask a secret-like opaque string: show first 4 + last 4 (e.g. Stripe/SePay IDs).
 */
function maskSecret(value: string | null | undefined): string {
  if (!value) return '—';
  const s = String(value);
  if (s.length <= 12) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

type StatusFilter = 'all' | AdminTransaction['status'];
type PlanFilter = 'all' | AdminTransaction['plan'];

interface PaymentsFilter {
  status: StatusFilter;
  plan: PlanFilter;
}

export default function AdminPaymentsPage() {
  const qc = useQueryClient();
  const [page, setPage] = React.useState(1);
  const [status, setStatus] = React.useState<StatusFilter>('all');
  const [plan, setPlan] = React.useState<PlanFilter>('all');

  // Saved filter presets (status + plan). Persisted under
  // `hieu-admin:filters:payments:v1`.
  const { presets, savePreset, loadPreset, deletePreset } = useSavedFilters<PaymentsFilter>(
    'payments',
    { status: 'all', plan: 'all' },
  );

  const tx = useQuery({
    queryKey: ['admin', 'transactions', page],
    queryFn: () => listTransactions({ page, page_size: 15 }),
  });
  const coupons = useQuery({ queryKey: ['admin', 'coupons'], queryFn: listCoupons });

  const refund = useMutation({
    mutationFn: (id: string) => refundTransaction(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'transactions'] }),
  });

  const txCols: DataTableColumn<AdminTransaction>[] = [
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
    { key: 'amount_usd', header: 'Amount', align: 'right', width: '90px', cell: (t) => `$${t.amount_usd.toFixed(2)}` },
    { key: 'status', header: 'Trạng thái', width: '120px', cell: (t) => <StatusBadge status={STATUS_TONE[t.status]} label={t.status} /> },
    { key: 'created_at', header: 'Tạo', width: '150px', cell: (t) => new Date(t.created_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) },
    {
      key: 'stripe_id',
      header: 'Stripe',
      cell: (t) => (
        <span className="font-mono text-xs text-cream/65" title={t.stripe_id}>
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
            onClick={() => {
              if (confirm(`Refund $${t.amount_usd} cho ${t.user_email}?`)) refund.mutate(t.id);
            }}
            disabled={refund.isPending}
          >
            Refund
          </Button>
        ) : null,
    },
  ];

  // KPIs aggregated from the current page (post-filter).
  const allRows = tx.data?.rows ?? [];
  const rows = React.useMemo(
    () =>
      allRows.filter((t) => {
        if (status !== 'all' && t.status !== status) return false;
        if (plan !== 'all' && t.plan !== plan) return false;
        return true;
      }),
    [allRows, status, plan],
  );
  const totalRevenue = rows
    .filter((t) => t.status === 'succeeded')
    .reduce((s, t) => s + t.amount_usd, 0);
  const refundedCount = rows.filter((t) => t.status === 'refunded').length;
  const succeededCount = rows.filter((t) => t.status === 'succeeded').length;
  const activeCoupons = (coupons.data ?? []).filter((c) => c.active).length;

  const applyPreset = (name: string) => {
    const p = loadPreset(name);
    if (!p) return;
    setStatus(p.status);
    setPlan(p.plan);
  };

  const onSavePreset = () => {
    if (typeof window === 'undefined') return;
    const name = window.prompt('Tên bộ lọc?', 'Bộ lọc của tôi');
    if (!name || !name.trim()) return;
    savePreset(name, { status, plan });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thanh toán"
        description="Giao dịch SePay + quản lý coupon."
        icon={<CreditCard className="h-5 w-5" />}
        badge={rows.length > 0 ? <LiveBadge /> : null}
      />

      <MockBanner source={tx.data?._source ?? coupons.data?._source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Doanh thu (trang)"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4" />}
          accent="gold"
          hint={`${succeededCount} succeeded`}
        />
        <KpiCard
          label="Tổng giao dịch"
          value={tx.data?.total ?? 0}
          icon={<TrendingUp className="h-4 w-4" />}
          accent="jade"
          hint="all-time"
        />
        <KpiCard
          label="Refunded (trang)"
          value={refundedCount}
          icon={<Undo2 className="h-4 w-4" />}
          accent={refundedCount > 0 ? 'red' : 'jade'}
          hint="đã hoàn"
        />
        <KpiCard
          label="Coupon active"
          value={activeCoupons}
          icon={<Ticket className="h-4 w-4" />}
          accent="purple"
          hint={`${(coupons.data ?? []).length} tổng`}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>Webhook events ghi tại `/v1/payments/webhook`. Refund đi qua Stripe API.</CardDescription>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className="h-8 rounded-md border border-gold/20 bg-ink/60 px-2 text-xs text-cream focus:border-gold focus:outline-none"
                aria-label="Lọc theo trạng thái"
              >
                <option value="all">Tất cả status</option>
                <option value="succeeded">Succeeded</option>
                <option value="refunded">Refunded</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as PlanFilter)}
                className="h-8 rounded-md border border-gold/20 bg-ink/60 px-2 text-xs text-cream focus:border-gold focus:outline-none"
                aria-label="Lọc theo gói"
              >
                <option value="all">Tất cả gói</option>
                <option value="mentor_month">Mentor tháng</option>
                <option value="mentor_year">Mentor năm</option>
                <option value="lifetime">Trọn đời</option>
              </select>
              {presets.length > 0 && (
                <select
                  onChange={(e) => {
                    if (e.target.value) applyPreset(e.target.value);
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="h-8 rounded-md border border-gold/30 bg-ink/60 px-2 text-xs text-gold focus:border-gold focus:outline-none"
                  aria-label="Bộ lọc đã lưu"
                >
                  <option value="" disabled>
                    Bộ lọc đã lưu…
                  </option>
                  {presets.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
              {presets.length > 0 && (
                <select
                  onChange={(e) => {
                    if (!e.target.value) return;
                    if (window.confirm(`Xoá bộ lọc "${e.target.value}"?`)) {
                      deletePreset(e.target.value);
                    }
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="h-8 rounded-md border border-red-400/20 bg-ink/60 px-2 text-xs text-red-300 focus:border-red-400 focus:outline-none"
                  aria-label="Xoá bộ lọc đã lưu"
                >
                  <option value="" disabled>
                    Xoá…
                  </option>
                  {presets.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
              <Button size="sm" variant="outline" onClick={onSavePreset}>
                Lưu bộ lọc
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
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
                {
                  id: 'ID',
                  user_email: 'User',
                  plan: 'Plan',
                  amount_usd: 'Amount (USD)',
                  status: 'Status',
                  stripe_id: 'Stripe ID',
                  created_at: 'Created',
                },
              )
            }
            disabled={rows.length === 0}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Xuất CSV
          </Button>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <CouponManager coupons={coupons.data ?? []} loading={coupons.isLoading} />
    </div>
  );
}

function CouponManager({ coupons, loading }: { coupons: AdminCoupon[]; loading: boolean }) {
  const qc = useQueryClient();
  const [code, setCode] = React.useState('');
  const [discount, setDiscount] = React.useState(20);
  const [maxRedemptions, setMaxRedemptions] = React.useState(100);

  const create = useMutation({
    mutationFn: () =>
      createCoupon({
        code: code.toUpperCase(),
        discount_percent: discount,
        max_redemptions: maxRedemptions,
        active: true,
        expires_at: null,
      }),
    onSuccess: () => {
      setCode('');
      qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });
    },
  });

  // Optimistic toggle so the pill flips instantly. Rollback restores prior
  // `active` state if the worker rejects (e.g. coupon revoked server-side).
  const toggle = useOptimisticMutation<AdminCoupon[], { code: string; active: boolean }>({
    queryKey: ['admin', 'coupons'],
    mutationFn: ({ code, active }) => toggleCoupon(code, active),
    applyOptimistic: (cache, vars) =>
      cache?.map((c) => (c.code === vars.code ? { ...c, active: vars.active } : c)),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupon</CardTitle>
        <CardDescription>Tạo và bật/tắt mã giảm giá.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!code) return;
            create.mutate();
          }}
          className="grid gap-3 sm:grid-cols-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="coupon-code">Mã</Label>
            <Input id="coupon-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="SUMMER25" className="uppercase" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-disc">% giảm</Label>
            <Input id="coupon-disc" type="number" min={1} max={100} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-max">Số lần</Label>
            <Input id="coupon-max" type="number" min={1} value={maxRedemptions} onChange={(e) => setMaxRedemptions(Number(e.target.value))} />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={!code || create.isPending} className="w-full">
              {create.isPending ? 'Đang tạo…' : 'Tạo coupon'}
            </Button>
          </div>
        </form>

        <ul className="space-y-2">
          {loading && <li className="text-sm text-cream/60">Đang tải…</li>}
          {coupons.map((c) => (
            <li
              key={c.code}
              className="flex items-center justify-between rounded-md border border-gold/15 bg-ink/40 px-4 py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-gold">{c.code}</span>
                <span className="text-cream/70">-{c.discount_percent}%</span>
                <span className="text-cream/50">
                  {c.redeemed}/{c.max_redemptions} dùng
                </span>
                <StatusBadge status={c.active ? 'success' : 'neutral'} label={c.active ? 'Active' : 'Inactive'} />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggle.mutate({ code: c.code, active: !c.active })}
                disabled={toggle.isPending}
              >
                {c.active ? 'Tắt' : 'Bật'}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
