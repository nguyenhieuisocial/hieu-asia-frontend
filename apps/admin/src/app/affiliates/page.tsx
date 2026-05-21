/**
 * /affiliates — admin list of all affiliates with search, sort, filters.
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@hieu-asia/ui';

type Status = 'active' | 'banned';

interface Affiliate {
  id: string;
  code: string;
  display_name: string;
  email: string;
  payout_method: string;
  status: Status;
  created_at: string;
  stats: {
    clicks: number;
    signups: number;
    conversions: number;
    total_earned: number;
    pending_payout: number;
    paid_total: number;
  };
}

interface PendingPayout {
  id: string;
  affiliate_id: string;
  amount: number;
  requested_at: string;
}

interface ListResponse {
  ok: true;
  affiliates: Affiliate[];
  pending_payouts: PendingPayout[];
}

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function dt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('vi-VN');
  } catch {
    return iso;
  }
}

type SortKey = 'earnings' | 'clicks' | 'created';
type StatusFilter = 'all' | Status;

export default function AdminAffiliatesPage() {
  const [data, setData] = React.useState<ListResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<SortKey>('earnings');
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/admin/affiliates', { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok || !d.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
      setData(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = React.useMemo(() => {
    if (!data) return [];
    let rows = data.affiliates;
    if (statusFilter !== 'all') rows = rows.filter((a) => a.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (a) =>
          a.code.toLowerCase().includes(q) ||
          a.display_name.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q),
      );
    }
    return [...rows].sort((a, b) => {
      if (sort === 'earnings') return b.stats.total_earned - a.stats.total_earned;
      if (sort === 'clicks') return b.stats.clicks - a.stats.clicks;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [data, search, sort, statusFilter]);

  return (
    <main className="min-h-screen bg-ink p-6 text-cream">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">Affiliates</h1>
          <div className="flex flex-wrap gap-2">
            <Link href="/affiliates/fraud">
              <Button variant="ghost" className="border border-cream/20">
                Fraud report
              </Button>
            </Link>
            <Link href="/affiliates/broadcast">
              <Button variant="ghost" className="border border-cream/20">
                Broadcast
              </Button>
            </Link>
            <Button onClick={load}>Làm mới</Button>
          </div>
        </header>

        {/* Pending payouts callout */}
        {data && data.pending_payouts.length > 0 && (
          <Card className="border-gold/40 bg-gold/5">
            <CardHeader>
              <CardTitle className="text-base text-gold">
                {data.pending_payouts.length} yêu cầu rút tiền đang chờ duyệt
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-cream/70">
              Tổng:{' '}
              <b className="text-gold">
                {vnd(data.pending_payouts.reduce((s, p) => s + p.amount, 0))}
              </b>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="flex flex-wrap items-center gap-3 pt-6">
            <Input
              placeholder="Tìm theo mã, tên, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded border border-cream/20 bg-ink p-2 text-sm text-cream"
            >
              <option value="earnings">Sort: Earnings</option>
              <option value="clicks">Sort: Clicks</option>
              <option value="created">Sort: Mới nhất</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="rounded border border-cream/20 bg-ink p-2 text-sm text-cream"
            >
              <option value="all">Status: tất cả</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
            <div className="ml-auto text-sm text-cream/60">
              {filtered.length} / {data?.affiliates.length ?? 0}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        {loading ? (
          <p className="text-sm text-cream/50">Loading…</p>
        ) : error ? (
          <p className="text-sm text-red-300">{error}</p>
        ) : (
          <Card>
            <CardContent className="overflow-x-auto pt-6">
              <table className="w-full text-sm">
                <thead className="border-b border-cream/10 text-left text-xs uppercase text-cream/60">
                  <tr>
                    <th className="pb-2 pr-3">Mã</th>
                    <th className="pb-2 pr-3">Tên</th>
                    <th className="pb-2 pr-3">Email</th>
                    <th className="pb-2 pr-3 text-right">Clicks</th>
                    <th className="pb-2 pr-3 text-right">Conv.</th>
                    <th className="pb-2 pr-3 text-right">Earned</th>
                    <th className="pb-2 pr-3 text-right">Khả dụng</th>
                    <th className="pb-2 pr-3">Status</th>
                    <th className="pb-2">Tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b border-cream/5 hover:bg-cream/5">
                      <td className="py-2 pr-3 font-mono text-gold">
                        <Link href={`/affiliates/${a.id}`} className="hover:underline">
                          {a.code}
                        </Link>
                      </td>
                      <td className="py-2 pr-3">{a.display_name}</td>
                      <td className="py-2 pr-3 text-cream/70">{a.email}</td>
                      <td className="py-2 pr-3 text-right">{a.stats.clicks}</td>
                      <td className="py-2 pr-3 text-right">{a.stats.conversions}</td>
                      <td className="py-2 pr-3 text-right font-mono text-gold">
                        {vnd(a.stats.total_earned)}
                      </td>
                      <td className="py-2 pr-3 text-right font-mono">
                        {vnd(a.stats.pending_payout)}
                      </td>
                      <td className="py-2 pr-3">
                        {a.status === 'active' ? (
                          <span className="text-green-400">Active</span>
                        ) : (
                          <span className="text-red-400">Banned</span>
                        )}
                      </td>
                      <td className="py-2 text-cream/60">{dt(a.created_at)}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-cream/50">
                        Không có kết quả nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
