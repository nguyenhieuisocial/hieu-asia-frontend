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
import { CreditCard } from 'lucide-react';
import type { AdminCoupon, AdminTransaction } from '@/lib/mock-data';

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

export default function AdminPaymentsPage() {
  const qc = useQueryClient();
  const [page, setPage] = React.useState(1);
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thanh toán"
        description="Giao dịch SePay + quản lý coupon."
        icon={<CreditCard className="h-5 w-5" />}
      />

      <MockBanner source={tx.data?._source ?? coupons.data?._source} />

      <Card>
        <CardHeader>
          <CardTitle>Giao dịch gần đây</CardTitle>
          <CardDescription>Webhook events ghi tại `/v1/payments/webhook`. Refund đi qua Stripe API.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={txCols}
            rows={tx.data?.rows ?? []}
            rowKey={(t) => t.id}
            page={tx.data?.page ?? 1}
            pageSize={tx.data?.page_size ?? 15}
            total={tx.data?.total ?? 0}
            onPageChange={setPage}
            emptyState={tx.isLoading ? 'Đang tải…' : 'Chưa có giao dịch.'}
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

  const toggle = useMutation({
    mutationFn: ({ code, active }: { code: string; active: boolean }) => toggleCoupon(code, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] }),
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
