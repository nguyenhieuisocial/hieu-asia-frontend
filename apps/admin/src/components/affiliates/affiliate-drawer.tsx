'use client';

/**
 * Right-side drawer showing full affiliate profile when clicking a row.
 * Fetches detail via Tanstack Query, keyed by `id`.
 */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@hieu-asia/ui';
import {
  approvePayout,
  downloadCsv,
  dt,
  dtFull,
  fetchAffiliateDetail,
  suspendAffiliate,
  vnd,
  type AffiliateDetailResponse,
} from '@/lib/affiliate-admin-api';
import { TierBadge } from './tier-badge';

export interface AffiliateDrawerProps {
  affiliateId: string | null;
  onClose: () => void;
  onChange?: () => void;
}

export function AffiliateDrawer({ affiliateId, onClose, onChange }: AffiliateDrawerProps) {
  const open = !!affiliateId;
  const { data, isLoading, error, refetch } = useQuery<AffiliateDetailResponse>({
    queryKey: ['affiliate-detail', affiliateId],
    queryFn: () => fetchAffiliateDetail(affiliateId!),
    enabled: !!affiliateId,
    staleTime: 10_000,
  });

  const [busy, setBusy] = React.useState(false);

  async function handleApprove(payoutId: string) {
    if (!affiliateId) return;
    setBusy(true);
    try {
      await approvePayout(affiliateId, payoutId);
      await refetch();
      onChange?.();
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleBan() {
    if (!data || !affiliateId) return;
    setBusy(true);
    try {
      await suspendAffiliate(affiliateId, data.affiliate.status === 'active');
      await refetch();
      onChange?.();
    } finally {
      setBusy(false);
    }
  }

  function exportEvents() {
    if (!data) return;
    downloadCsv(
      `affiliate-${data.affiliate.code}-events.csv`,
      data.recent.map((ev) => ({
        ts: ev.ts,
        event: ev.event,
        user_id: ev.user_id ?? '',
        amount: ev.amount ?? '',
        commission: ev.commission ?? '',
      })),
    );
  }

  return (
    <Sheet open={open} onOpenChange={(o) => (!o ? onClose() : null)}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Đang tải hồ sơ…</p>
        ) : error || !data ? (
          <p className="text-sm text-red-700 dark:text-red-300">
            {error instanceof Error ? error.message : 'Không tải được hồ sơ.'}
          </p>
        ) : (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <SheetTitle className="font-mono text-gold">{data.affiliate.code}</SheetTitle>
                <TierBadge conversions={data.stats.conversions} withProgress />
              </div>
              <SheetDescription>
                {data.affiliate.display_name} · {data.affiliate.email}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Stat label="Clicks" value={data.stats.clicks.toLocaleString('vi-VN')} />
              <Stat label="Conversions" value={data.stats.conversions.toLocaleString('vi-VN')} />
              <Stat label="Tổng kiếm" value={<span className="text-gold">{vnd(data.stats.total_earned)}</span>} />
              <Stat label="Khả dụng" value={vnd(data.stats.pending_payout)} />
              <Stat label="Đã trả" value={vnd(data.stats.paid_total)} />
              <Stat
                label="Conv. rate"
                value={
                  data.stats.clicks > 0
                    ? ((data.stats.conversions / data.stats.clicks) * 100).toFixed(2) + '%'
                    : '—'
                }
              />
            </div>

            <Section title="Thông tin thanh toán">
              <Row label="Phương thức" value={data.affiliate.payout_method.toUpperCase()} mono />
              <Row label="Đích" value={data.affiliate.payout_destination} mono />
              <Row
                label="Hoa hồng tháng đầu"
                value={`${(data.affiliate.commission_rate_first_month * 100).toFixed(0)}%`}
              />
              <Row
                label="Hoa hồng recurring"
                value={`${(data.affiliate.commission_rate_recurring * 100).toFixed(0)}%`}
              />
              <Row label="Tạo lúc" value={dt(data.affiliate.created_at)} />
              <Row
                label="Trạng thái"
                value={
                  <span className={data.affiliate.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                    {data.affiliate.status}
                  </span>
                }
              />
            </Section>

            <Section title={`Yêu cầu rút tiền (${data.payouts.length})`}>
              {data.payouts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có.</p>
              ) : (
                <div className="space-y-2">
                  {data.payouts.map((p) => (
                    <div key={p.id} className="rounded border border-border p-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-gold">{vnd(p.amount)}</span>
                        <PayoutStatus status={p.status} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {p.method.toUpperCase()} · {dtFull(p.requested_at)}
                      </div>
                      {p.status === 'pending' && (
                        <Button
                          size="sm"
                          className="mt-2"
                          disabled={busy}
                          onClick={() => handleApprove(p.id)}
                        >
                          Đã trả
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section
              title={`Sự kiện gần đây (${data.recent.length})`}
              action={
                data.recent.length > 0 ? (
                  <Button size="sm" variant="ghost" onClick={exportEvents}>
                    CSV
                  </Button>
                ) : null
              }
            >
              {data.recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có sự kiện.</p>
              ) : (
                <div className="max-h-64 space-y-1 overflow-y-auto pr-1 text-sm">
                  {data.recent.map((ev, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-border py-1 last:border-0"
                    >
                      <span className="flex items-center gap-2">
                        <span className="rounded bg-muted/40 px-1.5 py-0.5 text-[10px] uppercase">
                          {ev.event}
                        </span>
                        <span className="text-xs text-muted-foreground">{dtFull(ev.ts)}</span>
                      </span>
                      {ev.commission != null && (
                        <span className="font-mono text-xs text-gold">+{vnd(ev.commission)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
              <Link href={`/affiliates/${affiliateId}`}>
                <Button variant="ghost" className="border border-border">
                  Mở trang đầy đủ
                </Button>
              </Link>
              <Button
                variant={data.affiliate.status === 'active' ? 'outline' : 'default'}
                onClick={handleToggleBan}
                disabled={busy}
                className={
                  data.affiliate.status === 'active'
                    ? 'border-red-500/40 text-red-700 dark:text-red-300 hover:bg-red-500/10'
                    : ''
                }
              >
                {data.affiliate.status === 'active' ? 'Suspend' : 'Unsuspend'}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ----- Local helpers -----

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded border border-border bg-card/60 p-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-sm">{value}</div>
    </div>
  );
}

function Section({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-1 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? 'font-mono' : ''}>{value}</span>
    </div>
  );
}

function PayoutStatus({ status }: { status: 'pending' | 'paid' | 'rejected' }) {
  if (status === 'pending') return <span className="text-yellow-400 text-xs">Đang chờ</span>;
  if (status === 'paid') return <span className="text-green-400 text-xs">Đã trả</span>;
  return <span className="text-red-400 text-xs">Từ chối</span>;
}
