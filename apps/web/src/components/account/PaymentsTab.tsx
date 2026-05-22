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
import { safeJson } from '@/lib/safe-json';
import { getSupabaseAuth } from '@/lib/auth-client';

interface PaymentRow {
  id: string;
  amount_vnd: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded' | string;
  created_at: string;
  description?: string;
}

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
  paid: 'Đã thanh toán',
  pending: 'Đang chờ',
  failed: 'Thất bại',
  refunded: 'Đã hoàn tiền',
  active: 'Đang hoạt động',
  inactive: 'Không hoạt động',
  cancelled: 'Đã hủy',
};

function fmtVnd(n: number): string {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
  } catch {
    return `${n} ₫`;
  }
}

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
  const [history, setHistory] = React.useState<PaymentRow[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      // Tier from /api/user/me
      try {
        const r = await fetch('/api/user/me', { cache: 'no-store' });
        const j = await safeJson<{ ok: boolean; membership_tier?: string }>(r);
        if (j.ok && j.data.membership_tier) {
          setSub((prev) => ({
            ...prev,
            tier: j.data.membership_tier ?? 'free',
            status: j.data.membership_tier === 'free' ? 'inactive' : 'active',
          }));
        }
      } catch {
        /* ignore */
      }

      // Payment history (worker may or may not exist yet)
      try {
        const supa = getSupabaseAuth();
        const token = supa ? (await supa.auth.getSession()).data.session?.access_token : null;
        const headers: HeadersInit = token ? { authorization: `Bearer ${token}` } : {};
        const r = await fetch('/api/payment/history', { headers, cache: 'no-store' });
        const j = await safeJson<{ ok: boolean; items?: PaymentRow[] }>(r);
        if (j.ok && Array.isArray(j.data.items)) {
          setHistory(j.data.items);
        }
      } catch {
        /* best-effort — empty stub */
      } finally {
        setLoaded(true);
      }
    })();
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
          {!loaded ? (
            <p className="text-sm text-muted-foreground">Đang tải…</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có giao dịch nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-2 pr-4">Ngày</th>
                    <th className="py-2 pr-4">Mô tả</th>
                    <th className="py-2 pr-4 text-right">Số tiền</th>
                    <th className="py-2 pr-4">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((p) => (
                    <tr key={p.id} className="border-b border-border">
                      <td className="py-2.5 pr-4 text-foreground/85">{fmtDate(p.created_at)}</td>
                      <td className="py-2.5 pr-4 text-foreground/85">{p.description ?? '—'}</td>
                      <td className="py-2.5 pr-4 text-right text-foreground font-mono">
                        {fmtVnd(p.amount_vnd)}
                      </td>
                      <td className="py-2.5 pr-4 text-muted-foreground">
                        {STATUS_LABEL[p.status] ?? p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
