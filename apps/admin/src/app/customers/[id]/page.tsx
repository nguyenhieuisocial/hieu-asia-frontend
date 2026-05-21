'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { ChevronLeft, User, Receipt, ListTodo, ShieldAlert, Copy } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';

interface CustomerDetail {
  id: string;
  display_name?: string | null;
  email?: string | null;
  telegram_id?: string | null;
  plan?: string | null;
  created_at?: string | null;
  last_active?: string | null;
}

interface SessionRow {
  id: string;
  topic?: string | null;
  created_at?: string | null;
  status?: string | null;
}

interface TxnRow {
  id: string;
  type: string;
  amount?: number | null;
  created_at?: string | null;
}

interface AuditRow {
  ts: string;
  action: string;
  detail?: string | null;
}

interface CustomerDetailResponse {
  ok: boolean;
  customer?: CustomerDetail | null;
  sessions?: SessionRow[];
  transactions?: TxnRow[];
  audit_trail?: AuditRow[];
  note?: string;
  error?: string;
}

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function fmtRelative(iso: string | null | undefined) {
  if (!iso) return '';
  try {
    const t = new Date(iso).getTime();
    const diff = Date.now() - t;
    const d = Math.floor(diff / 86_400_000);
    if (d < 1) {
      const h = Math.floor(diff / 3_600_000);
      if (h < 1) return 'vừa xong';
      return `${h}h trước`;
    }
    if (d < 7) return `${d} ngày trước`;
    if (d < 30) return `${Math.floor(d / 7)} tuần trước`;
    return `${Math.floor(d / 30)} tháng trước`;
  } catch {
    return '';
  }
}

async function fetchCustomer(id: string): Promise<CustomerDetailResponse> {
  const res = await fetch(`/api/admin/customers/${encodeURIComponent(id)}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as CustomerDetailResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

const PLAN_TONE: Record<string, string> = {
  free: 'bg-cream/10 text-cream/70 border-cream/20',
  premium: 'bg-gold/15 text-gold border-gold/30',
  subscription: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'customer', id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const customer = data?.customer;
  const note = data?.note;
  const sessions = data?.sessions ?? [];
  const transactions = data?.transactions ?? [];
  const auditTrail = data?.audit_trail ?? [];

  const totalSpend = transactions.reduce((s, t) => s + (t.amount ?? 0), 0);

  const copyId = React.useCallback(() => {
    navigator.clipboard.writeText(id).catch(() => {});
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-cream/5" />
        <div className="h-20 animate-pulse rounded-xl bg-cream/5" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-cream/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-cream/60 hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gold" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-cream/55">
              Khách hàng
            </span>
            {customer?.plan && (
              <span
                className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
                  PLAN_TONE[customer.plan] ?? 'border-cream/15 bg-cream/5 text-cream/70'
                }`}
              >
                {customer.plan}
              </span>
            )}
          </div>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-cream sm:text-3xl">
            {customer?.display_name ?? `Khách hàng ${id.slice(0, 8)}…`}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-xs text-cream/55" title={id}>
              {id}
            </p>
            <button
              type="button"
              onClick={copyId}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-cream/45 hover:bg-gold/10 hover:text-gold"
              aria-label="Copy ID"
              title="Copy ID"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Đang tải…' : 'Làm mới'}
        </Button>
      </div>

      {showError && (
        <div className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {errorMsg ?? 'Không tải được chi tiết khách hàng.'}
        </div>
      )}
      {note && !showError && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-cream/70">
          {note}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Phiên đã đọc"
          value={sessions.length}
          icon={<ListTodo className="h-4 w-4" />}
          accent="gold"
          hint="reading sessions"
        />
        <KpiCard
          label="Giao dịch"
          value={transactions.length}
          icon={<Receipt className="h-4 w-4" />}
          accent="jade"
          hint="lifetime"
        />
        <KpiCard
          label="Tổng chi tiêu"
          value={
            totalSpend > 0 ? new Intl.NumberFormat('vi-VN').format(totalSpend) + ' đ' : '—'
          }
          icon={<Receipt className="h-4 w-4" />}
          accent="purple"
          hint="lifetime VND"
        />
        <KpiCard
          label="Sự kiện audit"
          value={auditTrail.length}
          icon={<ShieldAlert className="h-4 w-4" />}
          accent={auditTrail.length > 0 ? 'gold' : 'jade'}
          hint="touching account"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ</CardTitle>
            <CardDescription>Thông tin cơ bản từ Supabase users.</CardDescription>
          </CardHeader>
          <CardContent>
            {!customer ? (
              <p className="text-sm text-cream/55">Chưa có dữ liệu hồ sơ.</p>
            ) : (
              <dl className="space-y-2 text-sm">
                <Field label="Tên hiển thị" value={customer.display_name} />
                <Field label="Email" value={customer.email} mono />
                <Field label="Telegram ID" value={customer.telegram_id} mono />
                <Field label="Plan" value={customer.plan} />
                <Field
                  label="Tạo lúc"
                  value={fmtDate(customer.created_at)}
                  hint={fmtRelative(customer.created_at)}
                />
                <Field
                  label="Hoạt động cuối"
                  value={fmtDate(customer.last_active)}
                  hint={fmtRelative(customer.last_active)}
                />
              </dl>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phiên gần đây</CardTitle>
            <CardDescription>reading_sessions liên kết với khách hàng này.</CardDescription>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <EmptyState
                title="Chưa có phiên nào"
                description="Khi user khởi tạo phiên đọc bài đầu tiên, dòng đầu sẽ hiện ở đây."
                className="border-0 bg-transparent py-4"
              />
            ) : (
              <ul className="space-y-2 text-sm">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between border-b border-gold/10 pb-2 last:border-0"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-cream">{s.topic ?? '(không topic)'}</div>
                      <div className="font-mono text-xs text-cream/55" title={s.created_at ?? ''}>
                        {fmtDate(s.created_at)} · {fmtRelative(s.created_at)}
                      </div>
                    </div>
                    <span className="shrink-0 rounded border border-gold/20 bg-gold/5 px-2 py-0.5 text-xs text-cream/70">
                      {s.status ?? '—'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
          <CardDescription>
            {transactions.length > 0
              ? `${transactions.length} giao dịch lifetime.`
              : 'Mỗi event payment ghi tại Worker sẽ hiện ở đây.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <EmptyState
              title="Chưa có giao dịch"
              description="User chưa thanh toán."
              className="border-0 bg-transparent py-4"
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gold/15 bg-ink/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left text-xs uppercase tracking-wider text-cream/55">
                    <th className="px-4 py-2 font-medium">Thời gian</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-gold/5 last:border-0 hover:bg-gold/[0.03]">
                      <td className="px-4 py-2 font-mono text-xs text-cream/70">
                        {fmtDate(t.created_at)}
                      </td>
                      <td className="px-4 py-2">
                        <span className="rounded border border-[#B8923D]/30 bg-[#B8923D]/10 px-2 py-0.5 font-mono text-xs text-[#B8923D]">
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums text-cream/85">
                        {t.amount != null
                          ? new Intl.NumberFormat('vi-VN').format(t.amount) + ' đ'
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
          <CardDescription>Các sự kiện touching tài khoản này.</CardDescription>
        </CardHeader>
        <CardContent>
          {auditTrail.length === 0 ? (
            <EmptyState
              title="Chưa có audit log"
              description="Các thao tác admin (xoá, export, override plan) sẽ ghi nhận ở đây."
              className="border-0 bg-transparent py-4"
            />
          ) : (
            <ul className="space-y-1.5 text-sm">
              {auditTrail.map((row, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 border-b border-gold/5 pb-1.5 last:border-0"
                >
                  <span
                    className="w-40 shrink-0 font-mono text-xs text-cream/55"
                    title={row.ts}
                  >
                    {fmtDate(row.ts)}
                  </span>
                  <span className="inline-flex items-center rounded border border-gold/20 bg-gold/5 px-1.5 py-0.5 font-mono text-[10px] text-gold">
                    {row.action}
                  </span>
                  {row.detail && (
                    <span className="text-cream/70">— {row.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
  hint,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-32 shrink-0 text-xs uppercase tracking-wider text-cream/55">{label}</dt>
      <dd className={`min-w-0 flex-1 text-cream ${mono ? 'truncate font-mono text-xs' : ''}`}>
        {value ?? '—'}
        {hint && <span className="ml-1.5 font-mono text-[10px] text-cream/45">({hint})</span>}
      </dd>
    </div>
  );
}
