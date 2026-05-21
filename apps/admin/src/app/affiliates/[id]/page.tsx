/**
 * /affiliates/[id] — affiliate detail page (admin).
 * Shows full record, recent events, payouts (with approve/reject buttons),
 * and ban toggle.
 */

'use client';

import * as React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@hieu-asia/ui';

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

interface PayoutRecord {
  id: string;
  amount: number;
  method: string;
  destination: string;
  status: 'pending' | 'paid' | 'rejected';
  requested_at: string;
  paid_at?: string;
  rejected_reason?: string;
}

interface DetailResponse {
  ok: true;
  affiliate: AffiliateRecord;
  stats: Stats;
  payouts: PayoutRecord[];
  recent: TrackEvent[];
}

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function dt(iso: string) {
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function AdminAffiliateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = React.useState<DetailResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [rejectingId, setRejectingId] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    load();
  }, [load]);

  async function approve(payoutId: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/affiliates/${id}/approve-payout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ payout_id: payoutId }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function reject(payoutId: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/affiliates/${id}/reject-payout`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ payout_id: payoutId, reason: rejectReason || 'no reason' }),
      });
      setRejectingId(null);
      setRejectReason('');
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function toggleBan() {
    if (!data) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/affiliates/${id}/ban`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ banned: data.affiliate.status === 'active' }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="p-6 text-cream">Loading…</main>;
  if (error || !data)
    return (
      <main className="p-6 text-cream">
        <p className="text-red-300">{error ?? 'Not found'}</p>
        <Link href="/affiliates" className="text-gold hover:underline">
          ← Quay lại
        </Link>
      </main>
    );

  const a = data.affiliate;
  const s = data.stats;

  return (
    <main className="min-h-screen bg-ink p-6 text-cream">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <Link href="/affiliates" className="text-sm text-cream/60 hover:text-gold">
              ← Affiliates
            </Link>
            <h1 className="mt-1 text-2xl font-bold">
              {a.display_name}{' '}
              <span className="ml-2 font-mono text-base text-gold">{a.code}</span>
            </h1>
            <p className="text-sm text-cream/60">{a.email}</p>
          </div>
          <Button
            variant={a.status === 'active' ? 'outline' : 'default'}
            onClick={toggleBan}
            disabled={busy}
            className={a.status === 'active' ? 'border-red-500/40 text-red-300 hover:bg-red-500/10' : ''}
          >
            {a.status === 'active' ? 'Ban' : 'Unban'}
          </Button>
        </header>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-cream/60">Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{s.clicks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-cream/60">Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{s.conversions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-cream/60">Total earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-gold">{vnd(s.total_earned)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-cream/60">Khả dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{vnd(s.pending_payout)}</div>
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
              <span className="text-cream/60">Phương thức:</span>{' '}
              <b>{a.payout_method.toUpperCase()}</b>
            </div>
            <div>
              <span className="text-cream/60">Đích:</span>{' '}
              <span className="font-mono">{a.payout_destination}</span>
            </div>
            <div>
              <span className="text-cream/60">Hoa hồng tháng đầu:</span>{' '}
              {(a.commission_rate_first_month * 100).toFixed(0)}%
            </div>
            <div>
              <span className="text-cream/60">Hoa hồng recurring:</span>{' '}
              {(a.commission_rate_recurring * 100).toFixed(0)}%
            </div>
            <div>
              <span className="text-cream/60">Tạo lúc:</span> {dt(a.created_at)}
            </div>
            <div>
              <span className="text-cream/60">Trạng thái:</span>{' '}
              <b className={a.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                {a.status}
              </b>
            </div>
          </CardContent>
        </Card>

        {/* Payouts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yêu cầu rút tiền</CardTitle>
          </CardHeader>
          <CardContent>
            {data.payouts.length === 0 ? (
              <p className="text-sm text-cream/50">Chưa có yêu cầu.</p>
            ) : (
              <div className="space-y-2">
                {data.payouts.map((p) => (
                  <div
                    key={p.id}
                    className="rounded border border-cream/10 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-gold">{vnd(p.amount)}</span>{' '}
                        <span className="text-cream/60">· {p.method.toUpperCase()}</span>{' '}
                        <span className="font-mono text-xs text-cream/50">{p.destination}</span>
                      </div>
                      <div className="text-sm">
                        {p.status === 'pending' && <span className="text-yellow-400">Đang chờ</span>}
                        {p.status === 'paid' && <span className="text-green-400">Đã trả ({dt(p.paid_at ?? '')})</span>}
                        {p.status === 'rejected' && <span className="text-red-400">Từ chối</span>}
                      </div>
                    </div>
                    {p.rejected_reason && (
                      <div className="mt-1 text-xs text-cream/50">Lý do: {p.rejected_reason}</div>
                    )}
                    <div className="mt-1 text-xs text-cream/50">
                      Yêu cầu lúc {dt(p.requested_at)}
                    </div>
                    {p.status === 'pending' && (
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" disabled={busy} onClick={() => approve(p.id)}>
                          Duyệt + đã trả
                        </Button>
                        {rejectingId === p.id ? (
                          <>
                            <Input
                              placeholder="Lý do"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              className="max-w-xs"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busy}
                              onClick={() => reject(p.id)}
                            >
                              Xác nhận từ chối
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectReason('');
                              }}
                            >
                              Hủy
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRejectingId(p.id)}
                          >
                            Từ chối
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sự kiện gần đây ({data.recent.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recent.length === 0 ? (
              <p className="text-sm text-cream/50">Chưa có sự kiện.</p>
            ) : (
              <div className="space-y-1 text-sm">
                {data.recent.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-cream/5 py-1.5 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-cream/10 px-2 py-0.5 text-xs">{ev.event}</span>
                      <span className="text-cream/70">{dt(ev.ts)}</span>
                      {ev.user_id && (
                        <span className="font-mono text-xs text-cream/40">
                          user:{ev.user_id.slice(0, 8)}
                        </span>
                      )}
                    </div>
                    {ev.commission !== undefined && (
                      <span className="font-mono text-gold">+{vnd(ev.commission)}</span>
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
