/**
 * /affiliates/[id] — affiliate detail page (admin).
 * Shows full record, recent events, and ban toggle.
 */

'use client';

import * as React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, StatusBadge } from '@hieu-asia/ui';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { TaxKycCard } from '@/components/admin/affiliates/TaxKycCard';
import { fetchFraudReport, type FraudFlag } from '@/lib/affiliate-admin-api';
import { fmtVnd, fmtDateTime } from '@/lib/format';

type PreferredRail = 'manual_csv' | 'wise' | 'stripe_connect';
type RailStatus = 'pending' | 'verified' | 'rejected' | 'manual_only';

interface AffiliateRecord {
  id: string;
  code: string;
  display_name: string;
  email: string;
  payout_method: string;
  payout_destination: string;
  status: 'active' | 'banned';
  commission_rate_first_month: number;
  commission_rate_recurring: number;
  created_at: string;
  preferred_rail?: PreferredRail;
  rail_account_external_id?: string | null;
  rail_account_verified_at?: string | null;
  rail_account_status?: RailStatus;
}

interface Stats {
  clicks: number;
  signups: number;
  conversions: number;
  total_earned: number;
  pending_payout: number;
  paid_total: number;
  last_updated: string;
}

interface TrackEvent {
  event: 'click' | 'signup' | 'conversion';
  user_id?: string;
  amount?: number;
  commission?: number;
  ts: string;
}

interface DetailResponse {
  ok: true;
  affiliate: AffiliateRecord;
  stats: Stats;
  recent: TrackEvent[];
}

export default function AdminAffiliateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = React.useState<DetailResponse | null>(null);
  // Fraud flags for THIS affiliate, fetched on load so the warning surfaces
  // before any approve action. Empty = no active flag (or report unavailable).
  const [fraudFlags, setFraudFlags] = React.useState<FraudFlag[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/affiliates/${id}`, { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      setData(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fraud check — runs on load (and after approve/reject via `load`) so the
  // banner is visible BEFORE the admin approves a payout. Best-effort: if the
  // fraud report is unreachable we simply show no banner (don't block the page).
  const loadFraud = React.useCallback(async () => {
    try {
      const report = await fetchFraudReport();
      const active = (report.flags ?? []).filter(
        (f) => f.affiliate_id === id && !f.cleared_at,
      );
      setFraudFlags(active);
    } catch {
      setFraudFlags([]);
    }
  }, [id]);

  React.useEffect(() => {
    load();
    loadFraud();
  }, [load, loadFraud]);

  async function toggleBan() {
    if (!data) return;
    if (!window.confirm(data.affiliate.status === 'active' ? 'Ban affiliate này?' : 'Unban affiliate này?')) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/affiliates/${id}/ban`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ banned: data.affiliate.status === 'active' }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function verifyRail(status: RailStatus) {
    // Confirm before flipping to verified or manual_only (semi-irreversible).
    if (status === 'verified' || status === 'manual_only') {
      const label = status === 'verified' ? 'Verified' : 'Manual only';
      if (!window.confirm(`Đặt trạng thái rail thành "${label}"? Hành động sẽ ghi audit log.`)) {
        return;
      }
    }
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/affiliates/${id}/verify-rail`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="p-6 text-foreground">Loading…</main>;
  if (error || !data)
    return (
      <main className="p-6 text-foreground">
        <p className="text-red-700 dark:text-red-300">{error ?? 'Not found'}</p>
        <Link href="/affiliates" className="text-gold hover:underline">
          ← Quay lại
        </Link>
      </main>
    );

  const a = data.affiliate;
  const s = data.stats;

  return (
    <main className="min-h-dvh bg-card p-6 text-foreground">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-1">
          <Link href="/affiliates" className="text-sm text-muted-foreground hover:text-gold">
            ← Affiliates
          </Link>
          <PageHeader
            title={
              <>
                {a.display_name}{' '}
                <span className="ml-2 font-mono text-base text-gold">{a.code}</span>
              </>
            }
            description={a.email}
            actions={
              <Button
                variant={a.status === 'active' ? 'outline' : 'default'}
                onClick={toggleBan}
                disabled={busy}
                className={a.status === 'active' ? 'border-red-500/40 text-red-700 dark:text-red-300 hover:bg-red-500/10' : ''}
              >
                {a.status === 'active' ? 'Ban' : 'Unban'}
              </Button>
            }
          />
        </header>

        {/* Fraud warning — surfaces active fraud flags on load, BEFORE the admin
            can approve a payout. Cleared flags are filtered out in loadFraud. */}
        {fraudFlags.length > 0 && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/[0.07] p-4"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" aria-hidden />
            <div className="space-y-1">
              <p className="font-semibold text-red-700 dark:text-red-200">
                Affiliate này đang bị gắn cờ gian lận ({fraudFlags.length})
              </p>
              <p className="text-sm text-red-700/90 dark:text-red-100/80">
                Kiểm tra kỹ trước khi duyệt payout. Có thể clear cờ ở{' '}
                <Link href="/affiliates?tab=fraud" className="underline hover:text-gold">
                  tab Fraud
                </Link>
                .
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-red-700/90 dark:text-red-100/80">
                {fraudFlags.map((f, i) => (
                  <li key={i} className="font-mono">
                    {f.reason} — {f.detail} ({fmtDateTime(f.flagged_at)})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">Lượt click</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{s.clicks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">Chuyển đổi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{s.conversions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">Tổng hoa hồng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-gold">{fmtVnd(s.total_earned)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">Khả dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{fmtVnd(s.pending_payout)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Phương thức:</span>{' '}
              <b>{a.payout_method.toUpperCase()}</b>
            </div>
            <div>
              <span className="text-muted-foreground">Đích:</span>{' '}
              <span className="font-mono">{a.payout_destination}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Hoa hồng tháng đầu:</span>{' '}
              {(a.commission_rate_first_month * 100).toFixed(0)}%
            </div>
            <div>
              <span className="text-muted-foreground">Hoa hồng recurring:</span>{' '}
              {(a.commission_rate_recurring * 100).toFixed(0)}%
            </div>
            <div>
              <span className="text-muted-foreground">Tạo lúc:</span> {fmtDateTime(a.created_at)}
            </div>
            <div>
              <span className="text-muted-foreground">Trạng thái:</span>{' '}
              <b className={a.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                {a.status}
              </b>
            </div>
          </CardContent>
        </Card>

        {/* Thuế & KYC — gap audit 2026-07-02 (route worker mới, MST masked) */}
        <TaxKycCard userId={id} />

        {/* Payout Rail (Wave 45) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kênh chi trả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Rail ưu tiên:</span>{' '}
                <b>{(a.preferred_rail ?? 'manual_csv').toUpperCase()}</b>
              </div>
              <div>
                <span className="text-muted-foreground">External ID:</span>{' '}
                <span className="font-mono text-xs">
                  {a.rail_account_external_id ?? '—'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Trạng thái:</span>{' '}
                {(() => {
                  const st = a.rail_account_status ?? 'pending';
                  const tone: 'success' | 'warning' | 'error' | 'info' | 'neutral' =
                    st === 'verified'
                      ? 'success'
                      : st === 'rejected'
                        ? 'error'
                        : st === 'manual_only'
                          ? 'info'
                          : 'warning';
                  return <StatusBadge status={tone} label={st} />;
                })()}
              </div>
              <div>
                <span className="text-muted-foreground">Verified at:</span>{' '}
                {a.rail_account_verified_at ? fmtDateTime(a.rail_account_verified_at) : '—'}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border pt-3">
              <Button
                size="sm"
                disabled={busy || a.rail_account_status === 'verified'}
                onClick={() => verifyRail('verified')}
              >
                Verify
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy || a.rail_account_status === 'manual_only'}
                onClick={() => verifyRail('manual_only')}
              >
                Manual only
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={busy || (a.rail_account_status ?? 'pending') === 'pending'}
                onClick={() => verifyRail('pending')}
              >
                Reset to pending
              </Button>
              <Link
                href={`/audit?action=affiliate_rail_verified&resource_id=${encodeURIComponent(id)}`}
                className="ml-auto self-center text-xs text-muted-foreground hover:text-gold"
              >
                Xem audit log →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sự kiện gần đây ({data.recent.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recent.length === 0 ? (
              <EmptyState compact title="Chưa có sự kiện." />
            ) : (
              <div className="space-y-1 text-sm">
                {data.recent.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-border py-1.5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-muted/40 px-2 py-0.5 text-xs">{ev.event}</span>
                      <span className="text-muted-foreground">{fmtDateTime(ev.ts)}</span>
                      {ev.user_id && (
                        <Link
                          href={`/customers/${encodeURIComponent(ev.user_id)}`}
                          className="font-mono text-xs text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-gold"
                          title="Mở hồ sơ khách hàng này"
                        >
                          user:{ev.user_id.slice(0, 8)}
                        </Link>
                      )}
                    </div>
                    {ev.commission !== undefined && (
                      <span className="font-mono text-gold">+{fmtVnd(ev.commission)}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
