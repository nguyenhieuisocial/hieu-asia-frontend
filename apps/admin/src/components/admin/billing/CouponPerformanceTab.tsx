'use client';

/**
 * Wave 60.71.T2.billing — Coupon Performance tab.
 *
 * Vault 107 §5.8 /billing spec — read-only analytics view on coupon
 * uptake. Creates/edits live in `/payments?tab=coupons`; this surface is
 * purely "is the discount campaign working?".
 *
 * Defensive Array.isArray (Wave 60.65.P0c) — listCoupons returns a tagged
 * array that may surface `{error}` shape under degraded paths.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  StatusBadge,
  type DataTableColumn,
} from '@hieu-asia/ui';
import { listCoupons } from '@/lib/admin-api';
import { ErrorBlock } from '@/components/admin/error-block';
import { formatDateOrEmpty } from '@/lib/format-date';
import type { AdminCoupon } from '@/lib/mock-data';

const fmtDate = (iso: string | null) => formatDateOrEmpty(iso, '—');

export function CouponPerformanceTab() {
  const coupons = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: listCoupons,
  });

  const rows = React.useMemo<AdminCoupon[]>(
    () => (Array.isArray(coupons.data) ? coupons.data : []),
    [coupons.data],
  );

  const cols: DataTableColumn<AdminCoupon>[] = React.useMemo(
    () => [
      {
        key: 'code',
        header: 'Code',
        cell: (c) => (
          <code className="rounded border border-gold/20 bg-gold/10 px-2 py-0.5 font-mono text-xs text-gold">
            {c.code}
          </code>
        ),
      },
      {
        key: 'discount_percent',
        header: 'Discount',
        align: 'right',
        width: '100px',
        cell: (c) => <span className="font-mono">-{c.discount_percent}%</span>,
      },
      {
        key: 'redeemed',
        header: 'Đã dùng',
        align: 'right',
        width: '120px',
        cell: (c) => (
          <span className="font-mono">
            {c.redeemed}
            <span className="text-muted-foreground"> / {c.max_redemptions}</span>
          </span>
        ),
      },
      {
        key: 'usage_pct',
        header: 'Uptake',
        width: '140px',
        className: 'hidden sm:table-cell',
        cell: (c) => <UptakeBar redeemed={c.redeemed} max={c.max_redemptions} />,
      },
      {
        key: 'active',
        header: 'Trạng thái',
        width: '120px',
        cell: (c) => (
          <StatusBadge
            status={c.active ? 'success' : 'neutral'}
            label={c.active ? 'Đang chạy' : 'Tắt'}
          />
        ),
      },
      {
        key: 'expires_at',
        header: 'Hết hạn',
        width: '130px',
        className: 'hidden md:table-cell',
        cell: (c) =>
          c.expires_at ? (
            fmtDate(c.expires_at)
          ) : (
            <span className="text-muted-foreground">Không giới hạn</span>
          ),
      },
    ],
    [],
  );

  const topCoupon = React.useMemo(
    () => [...rows].sort((a, b) => b.redeemed - a.redeemed)[0] ?? null,
    [rows],
  );
  const totalRedeemed = rows.reduce((s, c) => s + c.redeemed, 0);
  const activeCount = rows.filter((c) => c.active).length;

  return (
    <div className="space-y-4">
      {/* Quick highlights — 3 mini KPI tiles. Not full <KpiCard> to keep
          the tab content lighter than the page-level strip. */}
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniStat label="Top coupon" value={topCoupon?.code ?? '—'} hint={topCoupon ? `${topCoupon.redeemed} redemptions` : ''} />
        <MiniStat label="Tổng redemption" value={String(totalRedeemed)} hint={`${rows.length} coupon`} />
        <MiniStat label="Active" value={`${activeCount}/${rows.length}`} hint={activeCount === 0 && rows.length > 0 ? 'Không có chiến dịch nào chạy' : ''} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hiệu năng coupon</CardTitle>
          <CardDescription>
            Tỉ lệ uptake = redeemed / max_redemptions. Sửa coupon trong{' '}
            <a href="/payments?tab=coupons" className="text-gold hover:underline">
              /payments → Coupon
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          {coupons.error ? (
            <ErrorBlock
              compact
              message={(coupons.error as Error).message}
              onRetry={() => coupons.refetch()}
            />
          ) : (
            <DataTable
              columns={cols}
              rows={rows}
              rowKey={(c) => c.code}
              emptyState={coupons.isLoading ? 'Đang tải…' : 'Chưa có coupon.'}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface UptakeBarProps {
  redeemed: number;
  max: number;
}

function UptakeBar({ redeemed, max }: UptakeBarProps) {
  const pct = Math.min(100, Math.round((redeemed / Math.max(1, max)) * 100));
  const tone = pct >= 90 ? 'bg-jade' : pct >= 50 ? 'bg-gold' : 'bg-gold/40';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-card/80">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{pct}%</span>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string;
  hint?: string;
}

function MiniStat({ label, value, hint }: MiniStatProps) {
  return (
    <div className="rounded-lg border border-gold/15 bg-card/60 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-heading text-lg text-foreground">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}
