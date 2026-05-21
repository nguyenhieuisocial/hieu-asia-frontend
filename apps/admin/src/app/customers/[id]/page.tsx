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

async function fetchCustomer(id: string): Promise<CustomerDetailResponse> {
  const res = await fetch(`/api/admin/customers/${encodeURIComponent(id)}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as CustomerDetailResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/customers" className="text-xs text-cream/55 hover:text-gold">← Quay lại danh sách</Link>
          <h1 className="mt-1 font-heading text-3xl font-semibold text-cream">
            {customer?.display_name ?? `Khách hàng ${id.slice(0, 8)}`}
          </h1>
          <p className="mt-1 font-mono text-xs text-cream/55">{id}</p>
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
        <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-cream/70">{note}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ</CardTitle>
            <CardDescription>Thông tin cơ bản từ Supabase users.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-cream/55">Đang tải…</p>
            ) : !customer ? (
              <p className="text-sm text-cream/55">Chưa có dữ liệu hồ sơ.</p>
            ) : (
              <dl className="space-y-2 text-sm">
                <Field label="Tên hiển thị" value={customer.display_name} />
                <Field label="Email" value={customer.email} mono />
                <Field label="Telegram ID" value={customer.telegram_id} mono />
                <Field label="Plan" value={customer.plan} />
                <Field label="Tạo lúc" value={fmtDate(customer.created_at)} />
                <Field label="Hoạt động cuối" value={fmtDate(customer.last_active)} />
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
            {(data?.sessions ?? []).length === 0 ? (
              <p className="text-sm text-cream/55">Chưa có phiên nào.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {data!.sessions!.map(s => (
                  <li key={s.id} className="flex items-center justify-between border-b border-gold/10 pb-2 last:border-0">
                    <div>
                      <div className="text-cream">{s.topic ?? '(không topic)'}</div>
                      <div className="font-mono text-xs text-cream/55">{fmtDate(s.created_at)}</div>
                    </div>
                    <span className="rounded border border-gold/20 bg-gold/5 px-2 py-0.5 text-xs text-cream/70">{s.status ?? '—'}</span>
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
        </CardHeader>
        <CardContent>
          {(data?.transactions ?? []).length === 0 ? (
            <p className="text-sm text-cream/55">Chưa có giao dịch.</p>
          ) : (
            <table className="min-w-full divide-y divide-zinc-800 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-cream/55">
                  <th className="px-3 py-2 font-medium">Thời gian</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {data!.transactions!.map(t => (
                  <tr key={t.id} className="hover:bg-gold/[0.03]">
                    <td className="px-3 py-2 font-mono text-xs text-cream/70">{fmtDate(t.created_at)}</td>
                    <td className="px-3 py-2">
                      <span className="rounded border border-[#B8923D]/30 bg-[#B8923D]/10 px-2 py-0.5 font-mono text-xs text-[#B8923D]">
                        {t.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-cream/85">
                      {t.amount != null ? new Intl.NumberFormat('vi-VN').format(t.amount) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
          <CardDescription>Các sự kiện touching tài khoản này.</CardDescription>
        </CardHeader>
        <CardContent>
          {(data?.audit_trail ?? []).length === 0 ? (
            <p className="text-sm text-cream/55">Chưa có audit log.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {data!.audit_trail!.map((row, i) => (
                <li key={i} className="flex gap-3 border-b border-gold/5 pb-1.5 last:border-0">
                  <span className="w-40 shrink-0 font-mono text-xs text-cream/55">{fmtDate(row.ts)}</span>
                  <span className="text-cream/85">{row.action}</span>
                  {row.detail && <span className="text-cream/60">— {row.detail}</span>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value?: string | null; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-32 shrink-0 text-xs uppercase tracking-wider text-cream/55">{label}</dt>
      <dd className={`text-cream ${mono ? 'font-mono text-xs' : ''}`}>{value ?? '—'}</dd>
    </div>
  );
}
