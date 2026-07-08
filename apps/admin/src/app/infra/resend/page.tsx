'use client';

/**
 * Hạ tầng → Resend — delivery-status summary + recent emails.
 *
 * Data: GET /api/admin-proxy/admin/infra/resend → worker `handleResend`.
 * State handling lives in <InfraPanel>; this page renders the delivery-status
 * StatCard strip (`summary`) and the recent-emails table. `last_event`
 * summarises each row's delivery state.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent, toast } from '@hieu-asia/ui';
import { Send } from 'lucide-react';
import {
  getInfraResend,
  postInfraResendTest,
  type InfraResendItem,
  type InfraResendSummary,
  type InfraResendDomain,
  type InfraResendApiKey,
} from '@/lib/admin-api';
import { getInfraTool } from '@/lib/infra-tools';
import { formatDateOrEmpty, formatRelativeOrEmpty } from '@/lib/format-date';
import { fmtNumber } from '@/lib/format';
import { StatCard } from '@/components/stat-card';
import { InfraPanel, InfraStatusPill } from '@/components/admin/infra/infra-panel';
import { ResendEmailDrawer } from '@/components/admin/infra/ResendEmailDrawer';
import { domainStatusTone } from '@/components/admin/infra/resend-status';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

const tool = getInfraTool('resend')!;

// last_event values that count as a bounce/complaint for the FE filter toggle.
const PROBLEM_EVENTS = new Set(['bounced', 'complained', 'failed']);
function isProblemEmail(e: InfraResendItem): boolean {
  return PROBLEM_EVENTS.has((e.last_event ?? '').toLowerCase());
}

/** Header action: send a test email via Resend, toast the result. */
function SendTestEmailButton() {
  const [pending, setPending] = React.useState(false);
  const click = React.useCallback(async () => {
    if (pending) return;
    if (!window.confirm('Gửi một email thử tới địa chỉ admin cố định?')) return;
    setPending(true);
    const res = await postInfraResendTest();
    setPending(false);
    if (res.ok) {
      const to = typeof res.sent_to === 'string' ? res.sent_to : null;
      toast.success(to ? `Đã gửi tới ${to}` : 'Đã gửi email thử.');
      return;
    }
    toast.error(res.error ?? 'Không gửi được email thử.');
  }, [pending]);
  return (
    <Button variant="outline" size="sm" onClick={click} disabled={pending}>
      <Send className="mr-1.5 h-3.5 w-3.5" />
      {pending ? 'Đang gửi…' : 'Gửi email thử'}
    </Button>
  );
}

function eventTone(event: string | null): 'good' | 'bad' | 'warn' | 'neutral' {
  switch ((event ?? '').toLowerCase()) {
    case 'delivered':
      return 'good';
    case 'bounced':
    case 'complained':
    case 'failed':
      return 'bad';
    case 'delivery_delayed':
    case 'queued':
      return 'warn';
    default:
      return 'neutral';
  }
}

// Delivery-status cards, in funnel order. Each renders only when the worker
// sends that count; "bad" buckets get a red tint to draw the eye.
const STATUS_CARDS: Array<{
  key: keyof InfraResendSummary;
  label: string;
  bad?: boolean;
}> = [
  { key: 'sent', label: 'Đã gửi đi' },
  { key: 'delivered', label: 'Đã gửi tới' },
  { key: 'bounced', label: 'Bị trả về', bad: true },
  { key: 'complained', label: 'Khiếu nại', bad: true },
  { key: 'delayed', label: 'Trễ' },
  { key: 'queued', label: 'Hàng đợi' },
  { key: 'other', label: 'Khác' },
];

const DOMAIN_COLUMNS: AdminTableColumn<InfraResendDomain>[] = [
  {
    id: 'name',
    header: 'Tên miền',
    className: 'font-medium text-foreground',
    cell: (d) => d.name ?? '—',
  },
  {
    id: 'status',
    header: 'Xác minh',
    cell: (d) => (
      <InfraStatusPill label={d.status ?? '—'} tone={domainStatusTone(d.status)} />
    ),
  },
  {
    id: 'region',
    header: 'Vùng',
    className: 'whitespace-nowrap font-mono text-muted-foreground',
    cell: (d) => d.region ?? '—',
  },
  {
    id: 'created',
    header: 'Tạo lúc',
    className: 'whitespace-nowrap text-muted-foreground',
    cell: (d) => formatDateOrEmpty(d.created_at),
  },
];

const EMAIL_COLUMNS: AdminTableColumn<InfraResendItem>[] = [
  {
    id: 'status',
    header: 'Trạng thái',
    cell: (e) => (
      <InfraStatusPill label={e.last_event ?? '—'} tone={eventTone(e.last_event)} />
    ),
  },
  {
    id: 'to',
    header: 'Người nhận',
    className: 'max-w-[18rem] truncate text-muted-foreground',
    cell: (e) => e.to ?? '—',
  },
  {
    id: 'subject',
    header: 'Tiêu đề',
    className: 'max-w-[24rem] truncate',
    cell: (e) => e.subject ?? <span className="text-muted-foreground">—</span>,
  },
  {
    id: 'time',
    header: 'Thời gian',
    className: 'whitespace-nowrap text-muted-foreground',
    cell: (e) => (
      <>
        {formatDateOrEmpty(e.created_at)}
        {formatRelativeOrEmpty(e.created_at) && (
          <span className="ml-1.5 text-xs opacity-70">
            · {formatRelativeOrEmpty(e.created_at)}
          </span>
        )}
      </>
    ),
  },
];

export default function InfraResendPage() {
  const query = useQuery({
    queryKey: ['infra', 'resend'],
    queryFn: getInfraResend,
    staleTime: 30_000,
  });

  const [openRecord, setOpenRecord] = React.useState<{ id: string; hint: string | null } | null>(
    null,
  );
  const [problemsOnly, setProblemsOnly] = React.useState(false);

  const summary: InfraResendSummary | undefined =
    query.data?.ok ? query.data.summary : undefined;
  const domains: InfraResendDomain[] =
    query.data?.ok && query.data.domains ? query.data.domains : [];
  const apiKeys: InfraResendApiKey[] =
    query.data?.ok && query.data.api_keys ? query.data.api_keys : [];
  const permissionNotes: string[] =
    query.data?.ok && query.data.permission_notes ? query.data.permission_notes : [];

  const cards = summary
    ? STATUS_CARDS.filter((c) => summary[c.key] != null)
    : [];

  return (
    <>
      <ResendEmailDrawer
        recordId={openRecord?.id ?? null}
        titleHint={openRecord?.hint ?? null}
        open={openRecord !== null}
        onClose={() => setOpenRecord(null)}
      />
      <InfraPanel<InfraResendItem>
        tool={tool}
        query={query}
        emptyTitle="Chưa có email gần đây"
        headerActions={<SendTestEmailButton />}
        renderSummary={
          <>
            {cards.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {cards.map((c) => (
                  <StatCard
                    key={c.key}
                    label={c.label}
                    value={fmtNumber(summary![c.key] as number)}
                    className={
                      c.bad && (summary![c.key] as number) > 0
                        ? 'border-red-400/40 bg-red-500/5 hover:border-red-400/60'
                        : undefined
                    }
                  />
                ))}
              </div>
            )}

            {/* Sending domains */}
            {domains.length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Tên miền gửi ({domains.length})
                </p>
                <Card>
                  <CardContent className="p-0">
                    <AdminTable
                      rows={domains}
                      columns={DOMAIN_COLUMNS}
                      getRowId={(d) => d.id}
                      onRowClick={(d) => setOpenRecord({ id: d.id, hint: d.name })}
                      caption="Tên miền gửi Resend"
                    />
                  </CardContent>
                </Card>
                <p className="text-xs text-muted-foreground">
                  Bấm vào một tên miền để xem các bản ghi DNS (SPF/DKIM/MX/DMARC).
                </p>
              </div>
            )}

            {/* API keys */}
            {apiKeys.length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  API keys ({apiKeys.length})
                </p>
                <Card>
                  <CardContent className="p-0">
                    <table className="w-full text-sm">
                      <tbody>
                        {apiKeys.map((k) => (
                          <tr
                            key={k.id}
                            className="border-b border-border/40 last:border-0"
                          >
                            <td className="px-4 py-2 font-medium text-foreground">
                              {k.name ?? '(không tên)'}
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-right text-muted-foreground">
                              {formatDateOrEmpty(k.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Honest notes for any panel we couldn't read (missing scope). */}
            {permissionNotes.length > 0 && (
              <ul className="space-y-1 text-xs text-muted-foreground">
                {permissionNotes.map((n, i) => (
                  <li key={i}>· {n}</li>
                ))}
              </ul>
            )}
          </>
        }
        renderTable={(items) => {
          const visibleEmails = problemsOnly ? items.filter(isProblemEmail) : items;
          const problemCount = items.filter(isProblemEmail).length;
          // Recent emails + bounce/complaint filter.
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Email gần đây
                </p>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={problemsOnly}
                    onChange={(e) => setProblemsOnly(e.target.checked)}
                    className="h-3.5 w-3.5 accent-gold"
                  />
                  Chỉ trả về / khiếu nại
                  {problemCount > 0 && (
                    <span className="rounded-full border border-red-400/40 bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-700 dark:text-red-200">
                      {problemCount}
                    </span>
                  )}
                </label>
              </div>
              <Card>
                <CardContent className="p-0">
                  <AdminTable
                    rows={visibleEmails}
                    columns={EMAIL_COLUMNS}
                    getRowId={(e) => e.id}
                    onRowClick={(e) => {
                      if (e.id) setOpenRecord({ id: e.id, hint: e.subject });
                    }}
                    empty={
                      <span className="text-sm text-muted-foreground">
                        Không có email trả về / khiếu nại trong cửa sổ gần đây.
                      </span>
                    }
                    caption="Email gần đây"
                  />
                </CardContent>
              </Card>
            </div>
          );
        }}
      />
    </>
  );
}
