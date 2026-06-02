'use client';

/**
 * Wave 60.71.T2.payments — Coupons tab extract.
 *
 * Vault 107 §5 — admin Tier 2. Hosts the coupon CRUD surface previously
 * inlined as `<CouponManager>` in /payments/page.tsx. Behavioural parity is
 * mandatory (founder uses this for revenue ops daily) — only the chrome
 * moves.
 *
 * Reuses `useOptimisticMutation` so the toggle pill flips instantly; the
 * shared StatusBadge keeps the in-app palette (Wave 60.10 normalization).
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
  Input,
  Label,
  StatusBadge,
} from '@hieu-asia/ui';
import { createCoupon, listCoupons, toggleCoupon } from '@/lib/admin-api';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import type { AdminCoupon } from '@/lib/mock-data';
import { useOptimisticMutation } from '@/lib/optimistic-mutation';

export interface CouponsTabProps {
  /** Bubble coupon count up so parent KPI strip stays in sync. */
  onCouponsChange?: (coupons: AdminCoupon[]) => void;
}

export function CouponsTab({ onCouponsChange }: CouponsTabProps) {
  const qc = useQueryClient();
  const coupons = useQuery({ queryKey: ['admin', 'coupons'], queryFn: listCoupons, staleTime: 60_000 });

  // Wave 60.65.P0c defensive guard — `?? []` only catches null/undefined; if
  // the worker returns `{error: "…"}` the array fallback prevents a TypeError.
  const rows = React.useMemo(
    () => (Array.isArray(coupons.data) ? coupons.data : []),
    [coupons.data],
  );

  React.useEffect(() => {
    onCouponsChange?.(rows);
  }, [rows, onCouponsChange]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) return;
    create.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupon</CardTitle>
        <CardDescription>Tạo và bật/tắt mã giảm giá. Pricing logic dùng chung với affiliate codes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="coupon-code">Mã</Label>
            <Input
              id="coupon-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SUMMER25"
              className="uppercase"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-disc">% giảm</Label>
            <Input
              id="coupon-disc"
              type="number"
              min={1}
              max={100}
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coupon-max">Số lần</Label>
            <Input
              id="coupon-max"
              type="number"
              min={1}
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(Number(e.target.value))}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={!code || create.isPending} className="w-full">
              {create.isPending ? 'Đang tạo…' : 'Tạo coupon'}
            </Button>
          </div>
        </form>

        {coupons.error ? (
          <ErrorBlock
            compact
            message={(coupons.error as Error).message}
            onRetry={() => coupons.refetch()}
          />
        ) : coupons.isLoading ? (
          <div className="space-y-2 py-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted/30" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="Chưa có coupon"
            description="Tạo mã giảm giá đầu tiên ở form bên trên — gắn vào lifetime / mentor_year campaign khi cần."
            className="border-0 bg-transparent"
          />
        ) : (
          <ul className="space-y-2">
            {rows.map((c) => (
              <li
                key={c.code}
                className="flex items-center justify-between rounded-md border border-gold/15 bg-card/60 px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gold">{c.code}</span>
                  <span className="text-muted-foreground">-{c.discount_percent}%</span>
                  <span className="text-muted-foreground">
                    {c.redeemed}/{c.max_redemptions} dùng
                  </span>
                  <StatusBadge
                    status={c.active ? 'success' : 'neutral'}
                    label={c.active ? 'Active' : 'Inactive'}
                  />
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
        )}
      </CardContent>
    </Card>
  );
}
