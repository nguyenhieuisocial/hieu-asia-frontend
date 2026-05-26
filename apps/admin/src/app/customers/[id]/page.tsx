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
import { ErrorBlock } from '@/components/admin/error-block';

/**
 * Wave 60.2 — extended to cover the full backend `users.*` shape.
 * Backend `handleCustomerDetail` returns the full row via `select=*`.
 * Frontend previously rendered only 6 fields; the rest were invisible.
 */
interface CustomerDetail {
  id: string;
  display_name?: string | null;
  email?: string | null;
  telegram_id?: string | null;
  plan?: string | null;
  created_at?: string | null;
  last_active?: string | null;
  // Wave 60.2 additions — compliance + profile + affiliate.
  kyc_status?: string | null;
  locale?: string | null;
  country?: string | null;
  phone?: string | null;
  referral_code?: string | null;
  partner_id?: string | null;
  marketing_opt_in?: boolean | null;
  zalo_opt_in?: boolean | null;
  sms_anniversary_opt_in?: boolean | null;
  birth_year?: number | null;
  birth_month?: number | null;
  birth_day?: number | null;
  gender?: string | null;
  [extra: string]: unknown;
}

/**
 * Wave 59 fix — backend `handleCustomerDetail` returns `reading_sessions`
 * rows with `session_id` + nested `state_json` JSONB. Old `{id, topic,
 * status, created_at}` flat shape was silently broken (every row rendered
 * `(không topic)` + `—`). Frontend now reads from state_json with fallback.
 */
interface SessionRow {
  session_id: string;
  updated_at?: string | null;
  state_json?: {
    topic?: string | null;
    status?: string | null;
    pipeline_status?: string | null;
    created_at?: string | null;
    birth_data?: { display_name?: string | null; primary_concern?: string | null } | null;
  } | null;
  /** Legacy fields for back-compat — older list endpoints may flatten. */
  id?: string;
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
  free: 'bg-muted/40 text-muted-foreground border-border',
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
        <div className="h-6 w-40 animate-pulse rounded bg-muted/30" />
        <div className="h-20 animate-pulse rounded-xl bg-muted/30" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gold" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Khách hàng
            </span>
            {customer?.plan && (
              <span
                className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
                  PLAN_TONE[customer.plan] ?? 'border-border bg-muted/30 text-muted-foreground'
                }`}
              >
                {customer.plan}
              </span>
            )}
          </div>
          <h1 className="mt-2 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            {customer?.display_name ?? `Khách hàng ${id.slice(0, 8)}…`}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-mono text-xs text-muted-foreground" title={id}>
              {id}
            </p>
            <button
              type="button"
              onClick={copyId}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-gold/10 hover:text-gold"
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
        <ErrorBlock
          compact
          message={errorMsg ?? 'Không tải được chi tiết khách hàng.'}
          onRetry={() => refetch()}
        />
      )}
      {note && !showError && (
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
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
              <p className="text-sm text-muted-foreground">Chưa có dữ liệu hồ sơ.</p>
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
                {sessions.map((s) => {
                  // Wave 59: read from state_json (real backend shape) with
                  // legacy flat-fields fallback for back-compat with mocks.
                  const sid = s.session_id ?? s.id ?? '';
                  const sj = s.state_json ?? null;
                  const topic =
                    sj?.topic ??
                    sj?.birth_data?.primary_concern ??
                    sj?.birth_data?.display_name ??
                    s.topic ??
                    '(không topic)';
                  const status = sj?.status ?? sj?.pipeline_status ?? s.status ?? '—';
                  const createdAt = sj?.created_at ?? s.created_at ?? s.updated_at ?? null;
                  return (
                    <li
                      key={sid}
                      className="flex items-center justify-between border-b border-gold/10 pb-2 last:border-0"
                    >
                      <Link
                        href={`/sessions/${encodeURIComponent(sid)}`}
                        className="min-w-0 flex-1 group"
                      >
                        <div className="truncate text-foreground group-hover:text-gold">
                          {topic}
                        </div>
                        <div
                          className="font-mono text-xs text-muted-foreground"
                          title={createdAt ?? ''}
                        >
                          {fmtDate(createdAt)} · {fmtRelative(createdAt)}
                        </div>
                      </Link>
                      <span className="shrink-0 rounded border border-gold/20 bg-gold/5 px-2 py-0.5 text-xs text-muted-foreground">
                        {status}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Wave 60.2 — Compliance & profile Card. Only renders when at least
          one of the new fields is populated; otherwise stays hidden so we
          don't show an empty Card to admin on legacy users. */}
      {customer && (
        (() => {
          const hasComplianceField =
            customer.kyc_status != null ||
            customer.locale != null ||
            customer.country != null ||
            customer.phone != null ||
            customer.referral_code != null ||
            customer.partner_id != null ||
            customer.marketing_opt_in != null ||
            customer.zalo_opt_in != null ||
            customer.sms_anniversary_opt_in != null ||
            customer.gender != null ||
            customer.birth_year != null;
          if (!hasComplianceField) return null;

          const kycToneMap: Record<string, string> = {
            verified: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
            pending: 'border-gold/40 bg-gold/10 text-gold',
            rejected: 'border-red-500/40 bg-red-500/10 text-red-300',
          };
          const kycTone =
            kycToneMap[(customer.kyc_status ?? '').toLowerCase()] ??
            'border-border bg-muted/30 text-muted-foreground';

          const birthSummary = (() => {
            if (!customer.birth_year && !customer.birth_month && !customer.birth_day) return null;
            const parts = [
              customer.birth_year ?? '????',
              String(customer.birth_month ?? '?').padStart(2, '0'),
              String(customer.birth_day ?? '?').padStart(2, '0'),
            ];
            return parts.join('-');
          })();

          return (
            <Card>
              <CardHeader>
                <CardTitle>Compliance & profile</CardTitle>
                <CardDescription>
                  KYC, locale, marketing opt-ins, affiliate liên kết — đầy đủ từ Supabase users
                  row.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {customer.kyc_status != null && (
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        KYC status
                      </dt>
                      <dd className="mt-1">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${kycTone}`}
                        >
                          {customer.kyc_status}
                        </span>
                      </dd>
                    </div>
                  )}
                  {customer.locale && (
                    <Field label="Locale" value={customer.locale} mono />
                  )}
                  {customer.country && (
                    <Field label="Quốc gia" value={customer.country} mono />
                  )}
                  {customer.phone && (
                    <Field label="Số điện thoại" value={customer.phone} mono />
                  )}
                  {customer.gender && (
                    <Field label="Giới tính" value={customer.gender} />
                  )}
                  {birthSummary && (
                    <Field label="Ngày sinh" value={birthSummary} mono />
                  )}
                  {customer.marketing_opt_in != null && (
                    <Field
                      label="Marketing email"
                      value={customer.marketing_opt_in ? 'Đã đồng ý' : 'Từ chối'}
                    />
                  )}
                  {customer.zalo_opt_in != null && (
                    <Field
                      label="Zalo OA"
                      value={customer.zalo_opt_in ? 'Đã đồng ý' : 'Từ chối'}
                    />
                  )}
                  {customer.sms_anniversary_opt_in != null && (
                    <Field
                      label="SMS sinh nhật"
                      value={customer.sms_anniversary_opt_in ? 'Đã đồng ý' : 'Từ chối'}
                    />
                  )}
                  {customer.referral_code && (
                    <Field label="Referral code" value={customer.referral_code} mono />
                  )}
                  {customer.partner_id && (
                    <div>
                      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        Partner ID
                      </dt>
                      <dd className="mt-1">
                        <Link
                          href={`/affiliates/${encodeURIComponent(customer.partner_id)}`}
                          className="font-mono text-xs text-gold underline-offset-2 hover:underline"
                        >
                          {customer.partner_id}
                        </Link>
                      </dd>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })()
      )}

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
            <div className="overflow-x-auto rounded-lg border border-gold/15 bg-card/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/15 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Thời gian</th>
                    <th className="px-4 py-2 font-medium">Type</th>
                    <th className="px-4 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-gold/5 last:border-0 hover:bg-gold/[0.03]">
                      <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                        {fmtDate(t.created_at)}
                      </td>
                      <td className="px-4 py-2">
                        <span className="rounded border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-xs text-gold">
                          {t.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums text-foreground/85">
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
                    className="w-40 shrink-0 font-mono text-xs text-muted-foreground"
                    title={row.ts}
                  >
                    {fmtDate(row.ts)}
                  </span>
                  <span className="inline-flex items-center rounded border border-gold/20 bg-gold/5 px-1.5 py-0.5 font-mono text-[10px] text-gold">
                    {row.action}
                  </span>
                  {row.detail && (
                    <span className="text-muted-foreground">— {row.detail}</span>
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
      <dt className="w-32 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={`min-w-0 flex-1 text-foreground ${mono ? 'truncate font-mono text-xs' : ''}`}>
        {value ?? '—'}
        {hint && <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">({hint})</span>}
      </dd>
    </div>
  );
}
