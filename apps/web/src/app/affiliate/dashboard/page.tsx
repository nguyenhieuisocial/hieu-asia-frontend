/**
 * /affiliate/dashboard — affiliate user dashboard.
 * Pulls /api/affiliate/me (cookie-authed). Shows KPIs, recent events,
 * payouts, and share toolkit.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Skeleton } from '@hieu-asia/ui';

interface AffiliateRecord {
  id: string;
  code: string;
  display_name: string;
  email: string;
  payout_method: 'bank' | 'momo' | 'zalo';
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
  status: 'pending' | 'paid' | 'rejected';
  requested_at: string;
  paid_at?: string;
  rejected_reason?: string;
}

interface MeResponse {
  ok: true;
  affiliate: AffiliateRecord;
  stats: Stats;
  recent: TrackEvent[];
  payouts: PayoutRecord[];
  min_payout_vnd: number;
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

const EVENT_LABEL: Record<TrackEvent['event'], { text: string; tone: string }> = {
  click: { text: 'Click', tone: 'bg-cream/10 text-cream/70' },
  signup: { text: 'Đăng ký', tone: 'bg-blue-500/10 text-blue-300' },
  conversion: { text: 'Mua', tone: 'bg-gold/15 text-gold' },
};

const STATUS_LABEL: Record<PayoutRecord['status'], { text: string; tone: string }> = {
  pending: { text: 'Đang chờ', tone: 'text-yellow-400' },
  paid: { text: 'Đã trả', tone: 'text-green-400' },
  rejected: { text: 'Bị từ chối', tone: 'text-red-400' },
};

export default function AffiliateDashboardPage() {
  const [data, setData] = React.useState<MeResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [payoutAmount, setPayoutAmount] = React.useState<string>('');
  const [payoutMsg, setPayoutMsg] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/affiliate/me', { cache: 'no-store' });
      if (res.status === 401) {
        setError('not_signed_in');
        return;
      }
      const d = await res.json();
      if (!d.ok) {
        setError(d.error ?? 'Lỗi không xác định');
        return;
      }
      setData(d);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi mạng');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function requestPayout() {
    if (!data) return;
    const amount = Math.floor(Number(payoutAmount));
    if (!amount || amount < data.min_payout_vnd) {
      setPayoutMsg({ ok: false, text: `Tối thiểu ${vnd(data.min_payout_vnd)}` });
      return;
    }
    const res = await fetch('/api/affiliate/payout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    const d = await res.json();
    if (d.ok) {
      setPayoutMsg({ ok: true, text: 'Đã gửi yêu cầu rút tiền. Admin sẽ xử lý trong 1–3 ngày.' });
      setPayoutAmount('');
      await load();
    } else {
      setPayoutMsg({ ok: false, text: d.error ?? 'Lỗi gửi yêu cầu' });
    }
  }

  async function signOut() {
    await fetch('/api/affiliate/me', { method: 'DELETE' });
    window.location.href = '/affiliate';
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-ink p-6 text-cream">
        <div className="mx-auto max-w-5xl space-y-4">
          <Skeleton className="h-10 w-48" />
          <div className="grid gap-4 sm:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </main>
    );
  }

  if (error === 'not_signed_in') {
    return (
      <main className="min-h-screen bg-ink p-6 text-cream">
        <div className="mx-auto max-w-md text-center">
          <h1 className="mb-2 text-2xl font-bold">Bạn chưa đăng nhập</h1>
          <p className="mb-6 text-cream/70">
            Đăng ký affiliate để xem dashboard hoặc khôi phục session từ email.
          </p>
          <Link href="/affiliate/signup">
            <Button className="bg-gold text-ink hover:bg-gold/90">Đăng ký ngay</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-ink p-6 text-cream">
        <div className="mx-auto max-w-md text-center">
          <p className="text-red-300">{error ?? 'Không tải được dashboard'}</p>
          <Button onClick={load} className="mt-4">Thử lại</Button>
        </div>
      </main>
    );
  }

  const a = data.affiliate;
  const s = data.stats;
  const shareUrl = `https://hieu.asia/?ref=${a.code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(shareUrl)}`;
  const canPayout = s.pending_payout >= data.min_payout_vnd && a.status === 'active';
  const shareText = `Tôi đang dùng hieu.asia — phân tích Tử Vi, MBTI và lòng bàn tay bằng AI. Đăng ký qua link của tôi nhé: ${shareUrl}`;

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-ink px-4 py-8 text-cream">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
            <p className="text-sm text-cream/60">
              Xin chào, {a.display_name} · Mã{' '}
              <span className="font-mono text-gold">{a.code}</span>
              {a.status === 'banned' && (
                <span className="ml-2 rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-300">
                  ĐÃ BAN
                </span>
              )}
            </p>
          </div>
          <Button variant="ghost" onClick={signOut} className="text-cream/60">
            Đăng xuất
          </Button>
        </header>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-cream/60">Tổng kiếm được</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gold">{vnd(s.total_earned)}</div>
              <div className="text-xs text-cream/50">Đã trả: {vnd(s.paid_total)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-cream/60">Số dư khả dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vnd(s.pending_payout)}</div>
              <div className="text-xs text-cream/50">
                Tối thiểu rút: {vnd(data.min_payout_vnd)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-cream/60">Hiệu suất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.clicks} clicks</div>
              <div className="text-xs text-cream/50">
                {s.signups} đăng ký · {s.conversions} mua
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share toolkit */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Bộ công cụ chia sẻ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 text-xs uppercase text-cream/60">Link giới thiệu</div>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="font-mono text-xs" />
                <Button onClick={() => copyText(shareUrl)}>
                  {copied ? 'Đã copy' : 'Copy'}
                </Button>
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase text-cream/60">Caption gợi ý (VN)</div>
              <div className="flex gap-2">
                <Input value={shareText} readOnly className="text-xs" />
                <Button onClick={() => copyText(shareText)}>Copy</Button>
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs uppercase text-cream/60">QR code</div>
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR" width={128} height={128} className="rounded bg-white p-2" />
                <a
                  href={qrUrl}
                  download={`hieu-asia-${a.code}.png`}
                  className="text-sm text-gold hover:underline"
                >
                  Tải QR code (PNG)
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout request */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Yêu cầu rút tiền</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-cream/70">
              Phương thức: <b>{a.payout_method.toUpperCase()}</b> · Đích:{' '}
              <span className="font-mono">{a.payout_destination}</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Min ${data.min_payout_vnd.toLocaleString('vi-VN')}`}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                disabled={!canPayout}
              />
              <Button
                onClick={requestPayout}
                disabled={!canPayout}
                className="bg-gold text-ink hover:bg-gold/90"
              >
                Gửi yêu cầu
              </Button>
            </div>
            {!canPayout && a.status === 'active' && (
              <p className="text-xs text-cream/50">
                Cần đạt {vnd(data.min_payout_vnd)} mới được rút.
              </p>
            )}
            {payoutMsg && (
              <p className={`text-sm ${payoutMsg.ok ? 'text-green-400' : 'text-red-300'}`}>
                {payoutMsg.text}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recent.length === 0 ? (
              <p className="text-sm text-cream/50">Chưa có hoạt động nào.</p>
            ) : (
              <div className="space-y-1">
                {data.recent.map((ev, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-cream/5 py-2 text-sm last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`rounded px-2 py-0.5 text-xs ${EVENT_LABEL[ev.event].tone}`}>
                        {EVENT_LABEL[ev.event].text}
                      </span>
                      <span className="text-cream/70">{dt(ev.ts)}</span>
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

        {/* Payouts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lịch sử rút tiền</CardTitle>
          </CardHeader>
          <CardContent>
            {data.payouts.length === 0 ? (
              <p className="text-sm text-cream/50">Chưa có yêu cầu nào.</p>
            ) : (
              <div className="space-y-1">
                {data.payouts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border-b border-cream/5 py-2 text-sm last:border-0"
                  >
                    <div>
                      <span className="font-mono">{vnd(p.amount)}</span>{' '}
                      <span className="text-cream/50">· {dt(p.requested_at)}</span>
                    </div>
                    <span className={STATUS_LABEL[p.status].tone}>
                      {STATUS_LABEL[p.status].text}
                    </span>
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
