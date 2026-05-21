'use client';

/**
 * /admin/audit — Audit log viewer (Postgres `hieu_asia.audit_log`).
 *
 * Filters by action / actor / date range. Defaults to newest 100. Shows an
 * empty state with the worker note when the table isn't provisioned yet.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';

interface AuditEntry {
  id?: string;
  ts?: string | null;
  actor?: string | null;
  actor_type?: string | null;
  action?: string | null;
  resource_id?: string | null;
  ip?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface AuditResponse {
  ok: boolean;
  entries?: AuditEntry[];
  note?: string;
  error?: string;
}

const ACTION_OPTIONS = [
  { value: '', label: 'Tất cả action' },
  { value: 'admin_login', label: 'admin_login' },
  { value: 'user_export_requested', label: 'user_export_requested' },
  { value: 'user_erased', label: 'user_erased' },
  { value: 'secret_rotated', label: 'secret_rotated' },
  { value: 'coupon_revoked', label: 'coupon_revoked' },
];

function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
  } catch {
    return iso;
  }
}

async function fetchAudit(params: {
  action: string;
  actor: string;
  from: string;
  to: string;
  limit: number;
}): Promise<AuditResponse> {
  const qs = new URLSearchParams();
  if (params.action) qs.set('action', params.action);
  if (params.actor) qs.set('actor', params.actor);
  if (params.from) qs.set('from', new Date(params.from).toISOString());
  if (params.to) qs.set('to', new Date(params.to).toISOString());
  qs.set('limit', String(params.limit));
  const res = await fetch(`/api/admin/audit-log?${qs.toString()}`, { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as AuditResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

const LIMIT = 100;

export default function AuditPage() {
  const [action, setAction] = React.useState('');
  const [actorInput, setActorInput] = React.useState('');
  const [actor, setActor] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');

  React.useEffect(() => {
    const t = window.setTimeout(() => setActor(actorInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [actorInput]);

  const { data, isLoading, isFetching, refetch, error } = useQuery({
    queryKey: ['admin', 'audit-log', { action, actor, from, to }],
    queryFn: () => fetchAudit({ action, actor, from, to, limit: LIMIT }),
  });

  const entries = data?.entries ?? [];
  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit log"
        description="Bản ghi hoạt động — admin actions + GDPR-related events. Lưu 12 tháng theo Nghị định 13/2023."
        icon={<ShieldAlert className="h-5 w-5" />}
        actions={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Đang tải…' : 'Làm mới'}
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Mặc định {LIMIT} entry mới nhất. Actor search debounce 300ms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="h-10 rounded-md border border-gold/20 bg-ink/60 px-3 text-sm text-cream focus:border-[#B8923D] focus:outline-none"
            >
              {ACTION_OPTIONS.map((o) => (
                <option key={o.value || 'all'} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={actorInput}
              onChange={(e) => setActorInput(e.target.value)}
              placeholder="Actor (email / user_id)…"
              className="rounded-md border border-gold/20 bg-ink/60 px-3 py-2 text-sm text-cream placeholder:text-cream/30 focus:border-[#B8923D] focus:outline-none"
            />
            <input
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md border border-gold/20 bg-ink/60 px-3 py-2 text-sm text-cream focus:border-[#B8923D] focus:outline-none"
            />
            <input
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md border border-gold/20 bg-ink/60 px-3 py-2 text-sm text-cream focus:border-[#B8923D] focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động ({entries.length})</CardTitle>
          <CardDescription>Sắp xếp theo timestamp giảm dần.</CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4 rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMsg ?? 'Không tải được audit log.'}
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
                  <th className="px-3 py-2 font-medium">Thời gian</th>
                  <th className="px-3 py-2 font-medium">Actor</th>
                  <th className="px-3 py-2 font-medium">Action</th>
                  <th className="px-3 py-2 font-medium">Resource</th>
                  <th className="px-3 py-2 font-medium">IP</th>
                  <th className="px-3 py-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-cream/55">
                      Đang tải…
                    </td>
                  </tr>
                )}
                {!isLoading && entries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-2">
                      <EmptyState
                        title={note ? 'Bảng audit_log chưa được tạo' : 'Không có entry khớp bộ lọc'}
                        description={
                          note ?? 'Thử bỏ filter hoặc mở rộng date range để xem thêm dữ liệu.'
                        }
                        className="my-2 border-0 bg-transparent"
                      />
                    </td>
                  </tr>
                )}
                {entries.map((e, i) => (
                  <tr key={e.id ?? `${e.ts ?? ''}-${i}`} className="hover:bg-gold/[0.03]">
                    <td className="px-3 py-2 font-mono text-xs text-cream/80">{fmtDate(e.ts)}</td>
                    <td className="px-3 py-2 text-cream/85">
                      <div>{e.actor ?? '—'}</div>
                      {e.actor_type && (
                        <div className="font-mono text-[10px] uppercase tracking-wider text-cream/45">
                          {e.actor_type}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center rounded border border-gold/20 bg-gold/5 px-2 py-0.5 font-mono text-xs text-gold">
                        {e.action ?? '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-cream/70">
                      {e.resource_id ?? '—'}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-cream/70">{e.ip ?? '—'}</td>
                    <td className="px-3 py-2">
                      {e.metadata && Object.keys(e.metadata).length > 0 ? (
                        <code className="line-clamp-2 max-w-md font-mono text-[11px] text-cream/65">
                          {JSON.stringify(e.metadata)}
                        </code>
                      ) : (
                        <span className="text-cream/40">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
