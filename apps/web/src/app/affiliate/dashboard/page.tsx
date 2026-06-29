/**
 * /affiliate/dashboard — affiliate user dashboard.
 *
 * Money balance + payout request come from System B (canonical Postgres
 * ledger) via the JWT-gated worker route `GET /aff/me` and
 * `POST /aff/payout-request`. The legacy KV `/api/affiliate/me` (cookie-authed)
 * is kept ONLY for the payout profile, performance counters, recent events,
 * and payout history — never for money totals.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@hieu-asia/ui';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { TierProgress, type Tier, type TierProgressData } from '@/components/affiliate/TierProgress';
import { getSupabaseAuth } from '@/lib/auth-client';
import { safeJson } from '@/lib/safe-json';
import {
  ShareToolkit,
  PayoutRequest,
  RecentEvents,
  PayoutHistory,
  type DashRecentEvent,
  type DashPayout,
} from '@/components/affiliate/DashboardSections';
import { TaxProfileForm } from '@/components/affiliate/TaxProfileForm';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';

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

interface FraudFlag {
  reason: string;
  detail: string;
  flagged_at: string;
}

interface Notification {
  id: string;
  kind: string;
  title: string;
  message: string;
  link?: string;
  created_at: string;
  read: boolean;
}

interface MeResponse {
  ok: true;
  affiliate: AffiliateRecord;
  stats: Stats;
  recent: DashRecentEvent[];
  payouts: DashPayout[];
  min_payout_vnd: number;
  tier?: TierProgressData;
  tiers?: Tier[];
  flag?: FraudFlag | null;
  notifications?: Notification[];
}

/** System-B (canonical Postgres ledger) money balance, JWT-gated /aff/me. */
interface Balance {
  available_vnd: number;
  pending_vnd: number;
  paid_vnd: number;
  min_payout_vnd: number;
  /** Projected 10% TNCN withheld if cashed out now (0 if < 2tr / cam-kết-08). */
  cash_withholding_vnd?: number;
  /** Projected after-tax cash payout (available - withholding). */
  cash_net_vnd?: number;
  /** MST + CTV contract on file → cash payout allowed. */
  kyc_complete?: boolean;
}

interface AffMeResponse {
  ok: true;
  balance: Balance;
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

export default function AffiliateDashboardPage() {
  const [data, setData] = React.useState<MeResponse | null>(null);
  const [balance, setBalance] = React.useState<Balance | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [payoutMsg, setPayoutMsg] = React.useState<{ ok: boolean; text: string } | null>(null);

  // System-B money balance, JWT-gated. Kept separate from the KV profile/stats
  // load so a missing Supabase session degrades the balance only, not the page.
  const loadBalance = React.useCallback(async () => {
    const supabase = getSupabaseAuth();
    if (!supabase) {
      setBalance(null);
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    if (!token) {
      setBalance(null);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/aff/me`, {
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const j = await safeJson<AffMeResponse>(res);
      if (j.ok && j.data.ok && j.data.balance) {
        setBalance(j.data.balance);
      } else {
        setBalance(null);
      }
    } catch {
      setBalance(null);
    }
  }, []);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // KV cookie path: profile (payout method/destination), performance
      // counters, recent events, payout history. NOT money totals.
      const res = await fetch('/api/affiliate/me', { cache: 'no-store' });
      if (res.status === 401) {
        setError('not_signed_in');
        return;
      }
      // Guard against HTML error pages.
      const ct = res.headers.get('content-type') ?? '';
      if (!/\bjson\b/i.test(ct)) {
        setError(`Phản hồi không phải JSON (HTTP ${res.status})`);
        return;
      }
      const d = await res.json();
      if (!d.ok) {
        setError(d.error ?? 'Lỗi không xác định');
        return;
      }
      setData(d);
      // Money comes from System B; fire after the profile resolves.
      await loadBalance();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi mạng');
    } finally {
      setLoading(false);
    }
  }, [loadBalance]);

  React.useEffect(() => {
    load();
  }, [load]);

  // System-B payout request: no amount (requests the full available balance).
  async function requestPayout() {
    const supabase = getSupabaseAuth();
    if (!supabase) {
      setPayoutMsg({ ok: false, text: 'Cần đăng nhập để gửi yêu cầu rút.' });
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    if (!token) {
      setPayoutMsg({ ok: false, text: 'Cần đăng nhập để gửi yêu cầu rút.' });
      return;
    }
    setSubmitting(true);
    setPayoutMsg(null);
    try {
      const res = await fetch(`${API_BASE}/aff/payout-request`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}` },
      });
      const j = await safeJson<{ ok: boolean; requested_vnd?: number; already_requested?: boolean; error?: string }>(res);
      if (!j.ok) {
        setPayoutMsg({ ok: false, text: `Phản hồi không hợp lệ (HTTP ${j.status})` });
        return;
      }
      const d = j.data;
      if (d.ok && d.already_requested) {
        setPayoutMsg({ ok: true, text: 'Bạn đã có một yêu cầu rút đang chờ.' });
      } else if (d.ok) {
        setPayoutMsg({
          ok: true,
          text: `Đã gửi yêu cầu rút ${vnd(d.requested_vnd ?? 0)}, admin sẽ xử lý.`,
        });
        await loadBalance();
      } else {
        setPayoutMsg({ ok: false, text: d.error ?? 'Lỗi gửi yêu cầu' });
      }
    } catch (err) {
      setPayoutMsg({ ok: false, text: err instanceof Error ? err.message : 'Lỗi mạng' });
    } finally {
      setSubmitting(false);
    }
  }

  // Voucher payout: redeem the available balance as an in-product credit coupon
  // (no tax/KYC — in-product credit, not cash). Mirrors requestPayout's JWT flow.
  async function requestVoucher(amountVnd?: number) {
    const supabase = getSupabaseAuth();
    if (!supabase) {
      setPayoutMsg({ ok: false, text: 'Cần đăng nhập để đổi voucher.' });
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    if (!token) {
      setPayoutMsg({ ok: false, text: 'Cần đăng nhập để đổi voucher.' });
      return;
    }
    setSubmitting(true);
    setPayoutMsg(null);
    try {
      // Partial redeem: send { amount_vnd } when the CTV chose an amount below
      // their full balance; omit it to redeem everything (backend default).
      const partial = typeof amountVnd === 'number' && amountVnd > 0;
      const res = await fetch(`${API_BASE}/aff/payout-voucher`, {
        method: 'POST',
        headers: partial
          ? { authorization: `Bearer ${token}`, 'content-type': 'application/json' }
          : { authorization: `Bearer ${token}` },
        body: partial ? JSON.stringify({ amount_vnd: Math.floor(amountVnd) }) : undefined,
      });
      const j = await safeJson<{ ok: boolean; coupon_code?: string; amount_vnd?: number; error?: string }>(res);
      if (!j.ok) {
        setPayoutMsg({ ok: false, text: `Phản hồi không hợp lệ (HTTP ${j.status})` });
        return;
      }
      const d = j.data;
      if (d.ok && d.coupon_code) {
        setPayoutMsg({
          ok: true,
          text: `Đã đổi ${vnd(d.amount_vnd ?? 0)} thành mã voucher: ${d.coupon_code} — nhập mã này khi thanh toán dịch vụ.`,
        });
        await loadBalance();
      } else {
        setPayoutMsg({ ok: false, text: d.error ?? 'Lỗi đổi voucher' });
      }
    } catch (err) {
      setPayoutMsg({ ok: false, text: err instanceof Error ? err.message : 'Lỗi mạng' });
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    await fetch('/api/affiliate/me', { method: 'DELETE' });
    window.location.href = '/affiliate';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="pt-20 pb-16 px-4 sm:px-6">
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
        <SiteFooter />
      </div>
    );
  }

  if (error === 'not_signed_in') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="pt-24 pb-16 px-4 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-2 font-heading text-2xl font-bold">Bạn chưa đăng nhập</h1>
            <p className="mb-6 text-muted-foreground">
              Đăng ký affiliate để xem dashboard hoặc khôi phục session từ email.
            </p>
            <Button asChild className="bg-gold text-ink hover:bg-gold/90"><Link href="/affiliate/signup">
              Đăng ký ngay
            </Link></Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="pt-24 pb-16 px-4 sm:px-6">
          <div className="mx-auto max-w-md text-center">
            <p className="text-rose-300">{error ?? 'Không tải được dashboard'}</p>
            <Button onClick={load} className="mt-4">Thử lại</Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const a = data.affiliate;
  const s = data.stats;
  const shareUrl = `https://hieu.asia/?ref=${a.code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(shareUrl)}`;
  // Money gate uses System-B balance only. Min payout also from System B,
  // falling back to the KV value if the balance hasn't loaded yet.
  const minPayout = balance?.min_payout_vnd ?? data.min_payout_vnd;
  const canPayout =
    !!balance && balance.available_vnd >= balance.min_payout_vnd && a.status === 'active';
  const shareText = `Tôi đang dùng hieu.asia — phân tích Tử Vi, MBTI và lòng bàn tay bằng AI. Đăng ký qua link của tôi nhé: ${shareUrl}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main id="main-content" className="pt-20 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Dashboard</span>
        </nav>
        <header className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold-700">
              Affiliate · Dashboard
            </p>
            <h1 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">
              Xin chào, {a.display_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Mã của bạn:{' '}
              <span className="font-mono text-gold-700">{a.code}</span>
              {a.status === 'banned' && (
                <span className="ml-2 rounded bg-rose-500/20 px-2 py-0.5 text-xs text-rose-300">
                  ĐÃ BAN
                </span>
              )}
            </p>
          </div>
          <Button variant="ghost" onClick={signOut} className="text-muted-foreground">
            Đăng xuất
          </Button>
        </header>

        {/* KPI cards. Money numbers come from System B (canonical ledger). */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gold/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">Số dư khả dụng</CardTitle>
            </CardHeader>
            <CardContent>
              {balance ? (
                <>
                  <div className="text-2xl font-bold text-gold-700">{vnd(balance.available_vnd)}</div>
                  <div className="text-xs text-muted-foreground">
                    Tối thiểu rút: {vnd(balance.min_payout_vnd)}
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Đăng nhập để xem số dư.</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">Đang chờ</CardTitle>
            </CardHeader>
            <CardContent>
              {balance ? (
                <>
                  <div className="text-2xl font-bold">{vnd(balance.pending_vnd)}</div>
                  <div className="text-xs text-muted-foreground">Chưa đủ điều kiện rút.</div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">—</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">Đã trả</CardTitle>
            </CardHeader>
            <CardContent>
              {balance ? (
                <div className="text-2xl font-bold">{vnd(balance.paid_vnd)}</div>
              ) : (
                <div className="text-sm text-muted-foreground">—</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase text-muted-foreground">Hiệu suất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.clicks} clicks</div>
              <div className="text-xs text-muted-foreground">
                {s.signups} đăng ký · {s.conversions} mua
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fraud flag banner */}
        {data.flag && (
          <Card className="border-red-500/40 bg-red-500/5">
            <CardContent className="pt-6 text-sm">
              <div className="font-semibold text-red-300">⚠ Tài khoản đang bị flag fraud</div>
              <div className="mt-1 text-muted-foreground">
                Lý do: <b>{data.flag.reason}</b> — {data.flag.detail}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Payout sẽ bị tạm khoá đến khi admin review. Vui lòng liên hệ support nếu bạn cho rằng có nhầm lẫn.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tier progress */}
        {data.tier && data.tiers && <TierProgress tier={data.tier} tiers={data.tiers} />}

        {/* Notifications */}
        {data.notifications && data.notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông báo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.notifications.slice(0, 5).map((n) => (
                <div key={n.id} className="rounded border border-border bg-muted/[0.03] p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{dt(n.created_at)}</span>
                  </div>
                  <div className="mt-1 text-muted-foreground">{n.message}</div>
                  {n.link && (
                    <Link href={n.link} className="mt-1 inline-block whitespace-nowrap text-xs text-gold-700 hover:underline">
                      Xem chi tiết →
                    </Link>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick links to assets / terms */}
        <Card>
          <CardContent className="flex flex-wrap gap-3 pt-6 text-sm">
            <Link href="/affiliate/assets" className="rounded bg-gold/10 px-3 py-1.5 text-gold-700 hover:bg-gold/20">
              Marketing assets
            </Link>
            <Link
              href="/affiliate/terms"
              className="rounded border border-border px-3 py-1.5 hover:bg-muted/5"
            >
              Điều khoản &amp; thuế VN
            </Link>
          </CardContent>
        </Card>

        <ShareToolkit shareUrl={shareUrl} shareText={shareText} qrUrl={qrUrl} code={a.code} />

        <TaxProfileForm />

        <PayoutRequest
          payoutMethod={a.payout_method}
          payoutDestination={a.payout_destination}
          minPayout={minPayout}
          availableVnd={balance?.available_vnd ?? 0}
          canPayout={canPayout}
          submitting={submitting}
          onSubmit={requestPayout}
          onVoucher={requestVoucher}
          cashNetVnd={balance?.cash_net_vnd}
          cashWithholdingVnd={balance?.cash_withholding_vnd}
          kycComplete={balance?.kyc_complete}
          msg={payoutMsg}
          isActive={a.status === 'active'}
        />

        <RecentEvents events={data.recent} />

        <PayoutHistory payouts={data.payouts} />
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
