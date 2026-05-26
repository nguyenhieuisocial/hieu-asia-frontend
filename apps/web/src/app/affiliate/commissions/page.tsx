/**
 * /affiliate/commissions — tiered commission history with status filtering.
 *
 * Pulls /aff/commissions?status= from the worker with Supabase JWT bearer.
 * Renders 4 stats cards, status filter tabs, and the table sorted by
 * created_at DESC. Min payout 200.000đ; payout flow lives at
 * /affiliate/dashboard.
 */

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
  Skeleton,
} from '@hieu-asia/ui';
import {
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCcw,
  TrendingUp,
} from 'lucide-react';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { AffiliateSubNav } from '@/components/affiliate/AffiliateSubNav';
import { getSupabaseAuth } from '@/lib/auth-client';
import { safeJson } from '@/lib/safe-json';

const API_BASE = process.env.NEXT_PUBLIC_HIEU_API_URL ?? 'https://api.hieu.asia';
const MIN_PAYOUT_VND = 200_000;

type Status = 'pending' | 'locked' | 'paid' | 'clawback' | 'void';
type Filter = 'all' | 'pending' | 'paid' | 'clawback';

interface Commission {
  id: string;
  source_user_id: string;
  beneficiary_id: string;
  tier_level: 1 | 2 | 3;
  order_id: string;
  gross_amount_vnd: number;
  commission_rate: number;
  commission_vnd: number;
  status: Status;
  paid_at: string | null;
  created_at: string;
}

interface CommissionsResponse {
  commissions: Commission[];
}

function vnd(n: number): string {
  return n.toLocaleString('vi-VN') + 'đ';
}

function pct(rate: number): string {
  return `${(rate * 100).toFixed(rate >= 0.1 ? 0 : 1)}%`;
}

function dt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN');
  } catch {
    return iso;
  }
}

function maskUserId(id: string): string {
  return `user_${id.slice(0, 6)}`;
}

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Đang chờ',
  locked: 'Đã khoá',
  paid: 'Đã trả',
  clawback: 'Hoàn lại',
  void: 'Huỷ',
};

const STATUS_CLASS: Record<Status, string> = {
  pending: 'bg-amber-500/15 text-amber-300',
  locked: 'bg-gold/15 text-gold',
  paid: 'bg-jade-500/15 text-jade-300',
  clawback: 'bg-rose-500/15 text-rose-300',
  void: 'bg-muted/10 text-muted-foreground',
};

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Đang chờ' },
  { key: 'paid', label: 'Đã trả' },
  { key: 'clawback', label: 'Hoàn lại' },
];

const BREADCRUMB_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://hieu.asia/' },
    { '@type': 'ListItem', position: 2, name: 'Affiliate', item: 'https://hieu.asia/affiliate' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Hoa hồng',
      item: 'https://hieu.asia/affiliate/commissions',
    },
  ],
};

export default function AffiliateCommissionsPage() {
  const [filter, setFilter] = React.useState<Filter>('all');
  const [rows, setRows] = React.useState<Commission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (f: Filter) => {
    setLoading(true);
    setError(null);
    const supabase = getSupabaseAuth();
    if (!supabase) {
      setError('auth_unavailable');
      setLoading(false);
      return;
    }
    const { data: sess } = await supabase.auth.getSession();
    const token = sess.session?.access_token;
    if (!token) {
      setError('not_signed_in');
      setLoading(false);
      return;
    }
    try {
      const qs = f === 'all' ? '' : `?status=${encodeURIComponent(f)}`;
      const res = await fetch(`${API_BASE}/aff/commissions${qs}`, {
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (res.status === 401) {
        // Wave 55 BUG-A: token was already validated by getSession() above; reaching
        // here with a 401 means the worker rejected because the user has no
        // `affiliates` enrollment row. Surface as "not enrolled" (link to
        // /affiliate/signup) instead of misleading "đăng nhập" CTA.
        setError('not_enrolled');
        return;
      }
      const j = await safeJson<CommissionsResponse>(res);
      if (!j.ok) {
        setError(`Lỗi tải hoa hồng (HTTP ${j.status})`);
        return;
      }
      const sorted = [...j.data.commissions].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setRows(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi mạng');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load(filter);
  }, [load, filter]);

  // Stats are computed across the loaded rows. For accurate cross-filter
  // totals we'd need a dedicated stats endpoint; for now totals reflect the
  // current filter view, which matches user expectation per the spec.
  const stats = React.useMemo(() => {
    let totalPaid = 0;
    let totalPending = 0;
    let totalClawback = 0;
    let count = 0;
    let clawbackCount = 0;
    for (const r of rows) {
      count += 1;
      if (r.status === 'paid') totalPaid += r.commission_vnd;
      else if (r.status === 'pending' || r.status === 'locked') totalPending += r.commission_vnd;
      else if (r.status === 'clawback' || r.status === 'void') {
        totalClawback += r.commission_vnd;
        clawbackCount += 1;
      }
    }
    const clawbackRate = count > 0 ? (clawbackCount / count) * 100 : 0;
    return { totalPaid, totalPending, totalClawback, clawbackRate };
  }, [rows]);

  if (error === 'not_signed_in' || error === 'auth_unavailable') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="mx-auto max-w-5xl px-6 pt-16 pb-20">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-2 font-heading text-2xl font-bold">Đăng nhập để xem hoa hồng</h1>
            <p className="mb-6 text-muted-foreground">
              Bạn cần đăng nhập để xem lịch sử hoa hồng affiliate.
            </p>
            <Button asChild className="bg-gold text-ink hover:bg-gold/90"><Link href="/signin?next=/affiliate/commissions">
              Đăng nhập
            </Link></Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error === 'not_enrolled') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteNav />
        <main className="mx-auto max-w-5xl px-6 pt-16 pb-20">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mb-2 font-heading text-2xl font-bold">
              Bạn chưa đăng ký <span className="text-gold">affiliate</span>
            </h1>
            <p className="mb-6 text-muted-foreground">
              Bạn đã đăng nhập, nhưng chưa tham gia chương trình affiliate.
              Đăng ký miễn phí để nhận link giới thiệu + theo dõi hoa hồng.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild className="bg-gold text-ink hover:bg-gold/90"><Link href="/affiliate/signup">
                
                  Đăng ký affiliate
                
              </Link></Button>
              <Button asChild variant="outline"><Link href="/affiliate">
                Tìm hiểu chương trình
              </Link></Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Đối tác cấp cao (Mentor / nhóm KOL) vui lòng dùng{' '}
              <Link href="/partner" className="underline hover:text-gold">
                Cổng đối tác
              </Link>
              .
            </p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <main className="mx-auto max-w-5xl px-6 pt-16 pb-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-gold">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <Link href="/affiliate" className="hover:text-gold">Affiliate</Link>
          <span className="mx-1.5">/</span>
          <span className="text-muted-foreground">Hoa hồng</span>
        </nav>

        <AffiliateSubNav />

        {/* Hero */}
        <header className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
            Affiliate · Commissions
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
            Hoa hồng của bạn
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Lịch sử hoa hồng 3 tầng. Trả sau khi giao dịch confirm (~7 ngày).
          </p>
        </header>

        {/* Stats row */}
        <section className="grid gap-4 md:grid-cols-4">
          <Card className="border-jade-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-jade-300" />
                <CardTitle className="text-xs uppercase text-muted-foreground">Tổng nhận</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-jade-300">{vnd(stats.totalPaid)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-300" />
                <CardTitle className="text-xs uppercase text-muted-foreground">Đang chờ</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vnd(stats.totalPending)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-rose-300" />
                <CardTitle className="text-xs uppercase text-muted-foreground">Đã hoàn lại</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vnd(stats.totalClawback)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-xs uppercase text-muted-foreground">
                  Tỉ lệ hoàn lại
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.clawbackRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </section>

        {/* Filter tabs */}
        <div
          role="tablist"
          aria-label="Lọc hoa hồng theo trạng thái"
          className="mt-6 flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  active
                    ? 'border-gold/60 bg-gold/15 text-gold'
                    : 'border-border text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Commission table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Lịch sử giao dịch</CardTitle>
            <CardDescription>
              Sắp xếp theo ngày tạo (mới nhất trước).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : error ? (
              <div className="rounded border border-rose-500/30 bg-rose-500/[0.05] px-4 py-3 text-sm text-rose-200">
                {error}{' '}
                <button
                  type="button"
                  onClick={() => load(filter)}
                  className="ml-2 underline"
                >
                  Thử lại
                </button>
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                Chưa có hoa hồng nào.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs uppercase text-muted-foreground">
                    <tr className="border-b border-border">
                      <th className="py-2 pr-3 font-normal">Ngày</th>
                      <th className="py-2 pr-3 font-normal">Order ID</th>
                      <th className="py-2 pr-3 font-normal">Người mua</th>
                      <th className="py-2 pr-3 font-normal">Tầng</th>
                      <th className="py-2 pr-3 text-right font-normal">Doanh số</th>
                      <th className="py-2 pr-3 text-right font-normal">Tỉ lệ</th>
                      <th className="py-2 pr-3 text-right font-normal">Hoa hồng</th>
                      <th className="py-2 pr-3 font-normal">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} className="border-b border-border">
                        <td className="py-2 pr-3 text-muted-foreground">{dt(r.created_at)}</td>
                        <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                          {r.order_id.slice(0, 12)}
                        </td>
                        <td className="py-2 pr-3 font-mono text-xs text-muted-foreground">
                          {maskUserId(r.source_user_id)}
                        </td>
                        <td className="py-2 pr-3">
                          <span className="rounded bg-muted/10 px-2 py-0.5 text-xs">
                            L{r.tier_level}
                          </span>
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {vnd(r.gross_amount_vnd)}
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums text-muted-foreground">
                          {pct(r.commission_rate)}
                        </td>
                        <td className="py-2 pr-3 text-right font-semibold tabular-nums text-gold">
                          {vnd(r.commission_vnd)}
                        </td>
                        <td className="py-2 pr-3">
                          <span
                            className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs ${STATUS_CLASS[r.status]}`}
                          >
                            {r.status === 'paid' && <CheckCircle2 className="h-3 w-3" />}
                            {r.status === 'pending' && <Clock className="h-3 w-3" />}
                            {r.status === 'clawback' && <RefreshCcw className="h-3 w-3" />}
                            {r.status === 'void' && <XCircle className="h-3 w-3" />}
                            {STATUS_LABEL[r.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout button */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {stats.totalPaid >= MIN_PAYOUT_VND ? (
            <Button asChild className="bg-gold text-ink hover:bg-gold/90"><Link href="/affiliate/dashboard">
              Yêu cầu rút
            </Link></Button>
          ) : (
            <Button disabled className="bg-muted/10 text-muted-foreground">
              Yêu cầu rút (tối thiểu {vnd(MIN_PAYOUT_VND)})
            </Button>
          )}
          <Link href="/affiliate/network" className="text-sm text-muted-foreground hover:text-gold">
            Xem mạng lưới →
          </Link>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Thời gian xử lý: 7-30 ngày làm việc tuỳ phương thức thanh toán.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
