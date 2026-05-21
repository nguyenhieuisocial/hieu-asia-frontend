'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { Users, UserCheck, Crown, Filter } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { KpiCard } from '@/components/admin/kpi-card';

interface Customer {
  id: string;
  display_name?: string | null;
  email?: string | null;
  telegram_id?: string | null;
  avatar_url?: string | null;
  plan?: 'free' | 'premium' | 'subscription' | null;
  created_at?: string | null;
  last_active?: string | null;
  sessions_count?: number | null;
}

interface CustomersResponse {
  ok: boolean;
  customers?: Customer[];
  next_cursor?: string | null;
  total?: number;
  note?: string;
  error?: string;
}

type PlanFilter = 'all' | 'free' | 'premium' | 'subscription';

const PLAN_LABEL: Record<PlanFilter, string> = {
  all: 'Tất cả',
  free: 'Miễn phí',
  premium: 'Premium',
  subscription: 'Subscription',
};

const PLAN_TONE: Record<NonNullable<Customer['plan']>, string> = {
  free: 'bg-cream/10 text-cream/70 border-cream/20',
  premium: 'bg-gold/15 text-gold border-gold/30',
  subscription: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

async function gravatarUrl(email: string | null | undefined): Promise<string | null> {
  if (!email) return null;
  // Browser-side md5 not in crypto — use SHA-256 fallback (Gravatar treats unknown hash as default).
  // For now just use a stable placeholder per email.
  const hashBuf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email.trim().toLowerCase()));
  const hex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `https://www.gravatar.com/avatar/${hex.slice(0, 32)}?d=identicon&s=48`;
}

async function fetchCustomers(params: { search: string; plan: PlanFilter; limit: number; cursor?: string }): Promise<CustomersResponse> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.plan !== 'all') qs.set('plan', params.plan);
  qs.set('limit', String(params.limit));
  if (params.cursor) qs.set('cursor', params.cursor);
  const res = await fetch(`/api/admin/customers?${qs.toString()}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as CustomersResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

function CustomerAvatar({ email, name }: { email?: string | null; name?: string | null }) {
  const [src, setSrc] = React.useState<string | null>(null);
  React.useEffect(() => {
    let mounted = true;
    gravatarUrl(email).then(u => { if (mounted) setSrc(u); });
    return () => { mounted = false; };
  }, [email]);
  const initials = (name ?? email ?? '?').slice(0, 2).toUpperCase();
  if (src) return <img src={src} alt="" className="h-8 w-8 rounded-full border border-gold/20" />;
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-ink/60 text-xs font-medium text-cream/70">
      {initials}
    </div>
  );
}

const LIMIT = 50;

export default function CustomersPage() {
  const [searchInput, setSearchInput] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [plan, setPlan] = React.useState<PlanFilter>('all');
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    const t = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['admin', 'customers', { search, plan, cursor, limit: LIMIT }],
    queryFn: () => fetchCustomers({ search, plan, limit: LIMIT, cursor }),
  });

  const customers = data?.customers ?? [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;

  // Aggregate stat strip
  const totalShown = customers.length;
  const paying = customers.filter((c) => c.plan === 'premium' || c.plan === 'subscription').length;
  const free = customers.filter((c) => !c.plan || c.plan === 'free').length;
  const last7 = customers.filter((c) => {
    if (!c.last_active) return false;
    const t = new Date(c.last_active).getTime();
    return !Number.isNaN(t) && Date.now() - t < 7 * 24 * 3600 * 1000;
  }).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Khách hàng"
        description="End-user dùng hieu.asia (Supabase users + reading_sessions). Click row để xem chi tiết."
        icon={<Users className="h-5 w-5" />}
        actions={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Đang tải…' : 'Làm mới'}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Hiển thị / trang"
          value={totalShown}
          icon={<Users className="h-4 w-4" />}
          accent="gold"
          hint={`tối đa ${LIMIT}`}
        />
        <KpiCard
          label="Active 7d"
          value={last7}
          icon={<UserCheck className="h-4 w-4" />}
          accent="jade"
          hint="có hoạt động"
        />
        <KpiCard
          label="Paying"
          value={paying}
          icon={<Crown className="h-4 w-4" />}
          accent="gold"
          hint="premium + sub"
        />
        <KpiCard
          label="Free tier"
          value={free}
          icon={<Filter className="h-4 w-4" />}
          accent="purple"
          hint="miễn phí"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>Tìm theo tên / email / telegram_id (debounce 300ms).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setCursor(undefined); }}
              placeholder="Tìm theo tên, email hoặc telegram_id…"
              className="rounded-md border border-gold/20 bg-ink/60 px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-[#B8923D] focus:outline-none"
            />
            <select
              value={plan}
              onChange={(e) => { setPlan(e.target.value as PlanFilter); setCursor(undefined); }}
              className="h-10 rounded-md border border-gold/20 bg-ink/60 px-3 text-sm text-cream focus:border-[#B8923D] focus:outline-none"
            >
              {(Object.keys(PLAN_LABEL) as PlanFilter[]).map(p => (
                <option key={p} value={p}>{PLAN_LABEL[p]}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>
            {customers.length} / tối đa {LIMIT} mỗi trang. Click row để xem chi tiết.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMsg ?? 'Không tải được dữ liệu khách hàng.'}
            </div>
          )}
          {note && !showError && (
            <div className="mb-4 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-cream/70">
              {note}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-800 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-cream/55">
                  <th className="px-3 py-2 font-medium">Avatar</th>
                  <th className="px-3 py-2 font-medium">Tên / Email</th>
                  <th className="px-3 py-2 font-medium">Telegram</th>
                  <th className="px-3 py-2 font-medium">Plan</th>
                  <th className="px-3 py-2 font-medium">Tạo lúc</th>
                  <th className="px-3 py-2 font-medium">Hoạt động cuối</th>
                  <th className="px-3 py-2 text-right font-medium">Phiên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {isLoading && (
                  <tr><td colSpan={7} className="px-3 py-6 text-center text-cream/55">Đang tải…</td></tr>
                )}
                {!isLoading && customers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-2">
                      <EmptyState
                        title={search || plan !== 'all' ? 'Không có khách hàng khớp bộ lọc' : 'Chưa có khách hàng nào'}
                        description={
                          search || plan !== 'all' ? (
                            'Thử bỏ filter hoặc xoá search query.'
                          ) : (
                            <>
                              Khi user đầu tiên đăng ký qua Telegram hoặc email, dòng đầu tiên sẽ hiện ở đây.
                              <br />
                              <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-wider text-cream/45">
                                onboarding chưa wire với bảng <code>users</code>
                              </span>
                            </>
                          )
                        }
                        className="my-2 border-0 bg-transparent"
                      />
                    </td>
                  </tr>
                )}
                {customers.map((c) => (
                  <tr key={c.id} className="cursor-pointer hover:bg-gold/[0.03]">
                    <td className="px-3 py-2">
                      <Link href={`/customers/${c.id}`} className="block">
                        <CustomerAvatar email={c.email} name={c.display_name} />
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <Link href={`/customers/${c.id}`} className="block">
                        <div className="text-cream">{c.display_name ?? '(không tên)'}</div>
                        <div className="font-mono text-xs text-cream/55">{c.email ?? '—'}</div>
                      </Link>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-cream/70">{c.telegram_id ?? '—'}</td>
                    <td className="px-3 py-2">
                      {c.plan ? (
                        <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${PLAN_TONE[c.plan]}`}>
                          {PLAN_LABEL[c.plan]}
                        </span>
                      ) : <span className="text-cream/40">—</span>}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-cream/70">{fmtDate(c.created_at)}</td>
                    <td className="px-3 py-2 font-mono text-xs text-cream/70">{fmtDate(c.last_active)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-cream/85">{c.sessions_count ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data?.next_cursor && (
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => setCursor(data.next_cursor ?? undefined)}>
                Trang sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
