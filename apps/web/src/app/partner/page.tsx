'use client';

/**
 * /partner — Partner Dashboard
 *
 * Wave 44. KPI tiles: subtree count, commission this month, available
 * payout, lifetime earnings. Pulls from /api/partner/{subtree,commissions}.
 */

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@hieu-asia/ui';
import { PartnerShell, partnerFetch } from '@/components/partner/PartnerShell';

interface SubtreeResp {
  ok: true;
  descendants: Array<{ depth_relative: number; status: string }>;
  total: number;
}

interface CommissionResp {
  ok: true;
  commissions: Array<{
    state: string;
    commission_vnd: number;
    created_at: string;
  }>;
  aggregates: Record<string, { count: number; vnd: number }>;
}

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export default function PartnerDashboardPage() {
  return (
    <PartnerShell>
      {() => <Dashboard />}
    </PartnerShell>
  );
}

function Dashboard() {
  const [subtree, setSubtree] = React.useState<SubtreeResp | null>(null);
  const [commissions, setCommissions] = React.useState<CommissionResp | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [s, c] = await Promise.all([
          partnerFetch<SubtreeResp>('/api/partner/subtree'),
          partnerFetch<CommissionResp>('/api/partner/commissions'),
        ]);
        if (cancelled) return;
        setSubtree(s);
        setCommissions(c);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-red-500">
          Không tải được dữ liệu: {error}
        </CardContent>
      </Card>
    );
  }

  if (!subtree || !commissions) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  // KPI computations.
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const commissionThisMonth = commissions.commissions
    .filter(
      (c) =>
        c.created_at >= monthStart &&
        ['held', 'available', 'paid'].includes(c.state),
    )
    .reduce((sum, c) => sum + c.commission_vnd, 0);

  const availablePayout = commissions.aggregates.available?.vnd ?? 0;
  const lifetimePaid = commissions.aggregates.paid?.vnd ?? 0;
  const totalSubtree = subtree.total;

  // Depth breakdown.
  const byDepth: Record<number, number> = {};
  for (const d of subtree.descendants) {
    byDepth[d.depth_relative] = (byDepth[d.depth_relative] ?? 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Mạng lưới" value={totalSubtree.toLocaleString('vi-VN')} hint="người (toàn subtree)" />
        <Kpi label="HH tháng này" value={vnd(commissionThisMonth)} hint="held + available + paid" />
        <Kpi label="Sẵn rút" value={vnd(availablePayout)} hint="state = available" />
        <Kpi label="Đã nhận" value={vnd(lifetimePaid)} hint="lifetime paid" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Phân tầng mạng lưới</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(byDepth).length === 0 ? (
            <p className="text-sm text-foreground/70">
              Bạn chưa có ai trong subtree. Chia sẻ link tại{' '}
              <Link href="/partner/assets" className="text-gold underline">
                trang tài liệu
              </Link>{' '}
              để bắt đầu.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {Object.entries(byDepth)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([depth, count]) => (
                  <div
                    key={depth}
                    className="rounded-lg border border-foreground/10 bg-foreground/[0.02] px-4 py-3"
                  >
                    <div className="text-xs uppercase tracking-wider text-foreground/60">
                      Tầng {depth}
                    </div>
                    <div className="mt-1 text-2xl font-semibold">{count}</div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/partner/commissions"
            className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/15 px-4 text-sm hover:bg-foreground/5"
          >
            Xem hoa hồng
          </Link>
          <Link
            href="/partner/payouts"
            className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/15 px-4 text-sm hover:bg-foreground/5"
          >
            Lịch sử rút
          </Link>
          <Link
            href="/partner/subtree"
            className="inline-flex h-9 items-center justify-center rounded-md border border-foreground/15 px-4 text-sm hover:bg-foreground/5"
          >
            Mạng lưới chi tiết
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wider text-foreground/60">{label}</div>
        <div className="mt-2 text-2xl font-semibold text-gold">{value}</div>
        {hint ? <div className="mt-1 text-xs text-foreground/60">{hint}</div> : null}
      </CardContent>
    </Card>
  );
}
