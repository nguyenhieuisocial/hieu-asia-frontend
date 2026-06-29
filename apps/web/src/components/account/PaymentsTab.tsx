'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { fetchUserMe } from '@/lib/user-me';

interface Subscription {
  status: 'active' | 'inactive' | 'cancelled' | string;
  tier: string;
  next_billing_at?: string | null;
}

const TIER_LABEL: Record<string, string> = {
  free: 'Free',
  standard: 'Standard',
  premium: 'Premium',
  lifetime: 'Lifetime',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Đang hoạt động',
  inactive: 'Không hoạt động',
  cancelled: 'Đã hủy',
};

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function PaymentsTab() {
  const [sub, setSub] = React.useState<Subscription>({
    status: 'inactive',
    tier: 'free',
    next_billing_at: null,
  });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      // Tier from shared, deduped /api/user/me cache (BUG-009).
      try {
        const data = await fetchUserMe();
        if (cancelled) return;
        if (data?.membership_tier) {
          setSub((prev) => ({
            ...prev,
            tier: data.membership_tier ?? 'free',
            status: data.membership_tier === 'free' ? 'inactive' : 'active',
          }));
        }
      } catch {
        /* ignore */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      role="tabpanel"
      id="panel-payments"
      aria-labelledby="tab-payments"
      className="space-y-6"
    >
      <div>
        <h2 className="font-heading text-2xl text-foreground sm:text-3xl">Thanh toán</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Subscription, lịch sử giao dịch và yêu cầu hoàn tiền.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subscription</CardTitle>
          <CardDescription>Trạng thái gói hiện tại.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Kpi label="Tier" value={TIER_LABEL[sub.tier] ?? sub.tier} />
            <Kpi label="Trạng thái" value={STATUS_LABEL[sub.status] ?? sub.status} />
            <Kpi label="Kỳ tiếp theo" value={fmtDate(sub.next_billing_at)} />
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button asChild={false}>
              <Link href="/pricing">Quản lý subscription</Link>
            </Button>
            <Button variant="outline" asChild={false}>
              <a href="mailto:support@hieu.asia?subject=Y%C3%AAu%20c%E1%BA%A7u%20ho%C3%A0n%20ti%E1%BB%81n">
                Yêu cầu hoàn tiền
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lịch sử giao dịch</CardTitle>
          <CardDescription>Các giao dịch SePay đã ghi nhận.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Lịch sử giao dịch sẽ sớm có.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
