'use client';

/**
 * CustomerDetailTabs — ProductTabs body for /customers/[id].
 *
 * Wave 60.71.T2.customers. Hosts Profile / Phiên / Giao dịch / Audit /
 * Compliance tabs. Each tab is a small presentational component below.
 *
 * <AdminTable> primitive (Wave 60.71.T2.customers) renders transactions +
 * audit trail so the detail surface inherits sort / skeleton / empty handling
 * without rebuilding `<table>` markup.
 */

import * as React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { EmptyState } from '@/components/admin/empty-state';
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/table/AdminTable';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import { UserJourneyPanel } from '@/components/admin/UserJourneyPanel';
import { CustomerAffiliateCard } from '@/components/admin/customers/CustomerAffiliateCard';
import { SessionAccessDialog } from './SessionAccessDialog';
import { RefundActionDialog } from './RefundActionDialog';
import { fmtDate, fmtRelative } from './format';
import {
  type AuditRow,
  type CustomerDetail,
  hasComplianceField,
  type RefundRow,
  type SessionRow,
  type TxnRow,
} from './detail-types';

export interface CustomerDetailTabsProps {
  customer: CustomerDetail | null;
  sessions: SessionRow[];
  transactions: TxnRow[];
  refunds: RefundRow[];
  auditTrail: AuditRow[];
  value: string;
  onValueChange: (id: string) => void;
  /** Route param = the user_id (PostHog distinct_id for authed users) — powers the journey tab. */
  userId: string;
  /** Refetch the customer after a per-session access grant/revoke. */
  onSessionMutated?: () => void;
  /** Refetch the customer after a refund approve/reject. */
  onRefundMutated?: () => void;
}

export function CustomerDetailTabs({
  customer,
  sessions,
  transactions,
  refunds,
  auditTrail,
  value,
  onValueChange,
  userId,
  onSessionMutated,
  onRefundMutated,
}: CustomerDetailTabsProps) {
  const tabs: ProductTab[] = [
    {
      id: 'profile',
      label: 'Hồ sơ',
      content: customer ? (
        <ProfileTab customer={customer} />
      ) : (
        <EmptyState
          title="Chưa có hồ sơ"
          description="Khách hàng chưa có row trong Supabase users."
          className="border-0 bg-transparent py-4"
        />
      ),
    },
    {
      id: 'sessions',
      label: `Phiên · ${sessions.length}`,
      content: <SessionsTab sessions={sessions} onSessionMutated={onSessionMutated} />,
    },
    {
      id: 'journey',
      label: 'Hành trình & CTV',
      content: userId ? (
        <div className="space-y-4">
          <UserJourneyPanel userId={userId} />
          <CustomerAffiliateCard userId={userId} />
        </div>
      ) : (
        <EmptyState
          title="Chưa có hành trình"
          description="Khách ẩn danh (chưa đăng nhập) nên không gộp được hành trình theo người dùng."
          className="border-0 bg-transparent py-4"
        />
      ),
    },
    {
      id: 'transactions',
      label: `Giao dịch · ${transactions.length}`,
      content: <TransactionsTab transactions={transactions} />,
    },
    {
      id: 'refunds',
      label: `Hoàn tiền · ${refunds.length}`,
      content: <RefundsTab refunds={refunds} onRefundMutated={onRefundMutated} />,
    },
    {
      id: 'audit',
      label: `Audit · ${auditTrail.length}`,
      content: <AuditTab rows={auditTrail} />,
    },
  ];

  if (hasComplianceField(customer)) {
    tabs.push({
      id: 'compliance',
      label: 'Compliance',
      // hasComplianceField guarantees customer !== null
      content: <ComplianceTab customer={customer as CustomerDetail} />,
    });
  }

  return <ProductTabs tabs={tabs} value={value} onValueChange={onValueChange} />;
}

function ProfileTab({ customer }: { customer: CustomerDetail }) {
  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="px-0">
        <CardTitle>Thông tin cơ bản</CardTitle>
        <CardDescription>Từ Supabase users.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <dl className="grid gap-3 sm:grid-cols-2">
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
      </CardContent>
    </Card>
  );
}

function SessionsTab({
  sessions,
  onSessionMutated,
}: {
  sessions: SessionRow[];
  onSessionMutated?: () => void;
}) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="Chưa có phiên nào"
        description="Khi user khởi tạo phiên đọc bài đầu tiên, dòng đầu sẽ hiện ở đây."
        className="border-0 bg-transparent py-4"
      />
    );
  }
  return (
    <ul className="space-y-2 text-sm">
      {sessions.map((s) => {
        const sid = s.session_id ?? s.id ?? '';
        const sj = s.state_json ?? null;
        const topic =
          sj?.topic
          ?? sj?.birth_data?.primary_concern
          ?? sj?.birth_data?.display_name
          ?? s.topic
          ?? '(không topic)';
        const status =
          sj?.status ?? sj?.pipeline_status ?? s.status ?? '—';
        const createdAt =
          sj?.created_at ?? s.created_at ?? s.updated_at ?? null;
        return (
          <li
            key={sid}
            className="flex items-center justify-between gap-3 rounded-md border border-gold/10 bg-card/40 px-3 py-2 transition-colors hover:border-gold/30"
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
            {/* Access-only override: help a stuck customer read this one session
                without touching money. Both actions shown — the operator picks
                grant or revoke; we don't track unlock state per session here. */}
            {sid && (
              <div className="flex shrink-0 items-center gap-1.5">
                <SessionAccessDialog
                  sessionId={sid}
                  action="grant"
                  triggerLabel="Cấp quyền đọc"
                  onSuccess={onSessionMutated}
                />
                <SessionAccessDialog
                  sessionId={sid}
                  action="revoke"
                  triggerLabel="Thu hồi"
                  triggerClassName="shrink-0 rounded border border-border bg-muted/20 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted/40"
                  onSuccess={onSessionMutated}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function TransactionsTab({ transactions }: { transactions: TxnRow[] }) {
  const columns = React.useMemo<AdminTableColumn<TxnRow>[]>(
    () => [
      {
        id: 'created_at',
        header: 'Thời gian',
        sortKey: 'created_at',
        width: '180px',
        cell: (t) => (
          <span className="font-mono text-xs text-muted-foreground">
            {fmtDate(t.created_at)}
          </span>
        ),
      },
      {
        id: 'type',
        header: 'Loại',
        sortKey: 'type',
        width: '160px',
        cell: (t) => (
          <span className="rounded border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-xs text-gold">
            {t.type}
          </span>
        ),
      },
      {
        id: 'amount',
        header: 'Số tiền',
        sortKey: 'amount',
        className: 'text-right tabular-nums',
        cell: (t) => (
          <span className="text-foreground/85">
            {t.amount != null
              ? new Intl.NumberFormat('vi-VN').format(t.amount) + ' đ'
              : '—'}
          </span>
        ),
      },
    ],
    [],
  );
  return (
    <AdminTable<TxnRow>
      rows={transactions}
      columns={columns}
      caption="Lịch sử giao dịch"
      empty={
        <EmptyState
          title="Chưa có giao dịch"
          description="User chưa thanh toán."
          className="border-0 bg-transparent py-4"
        />
      }
    />
  );
}

// Worker refund state machine: requested → approved → completed | rejected.
const REFUND_STATUS_META: Record<string, { label: string; tone: string }> = {
  requested: {
    label: 'Đang chờ',
    tone: 'border-gold/40 bg-gold/10 text-gold',
  },
  approved: {
    label: 'Đã duyệt',
    tone: 'border-jade/40 bg-jade/15 text-jade-700 dark:text-jade-50',
  },
  completed: {
    label: 'Đã hoàn',
    tone: 'border-jade/50 bg-jade/20 text-jade-700 dark:text-jade-50',
  },
  rejected: {
    label: 'Từ chối',
    tone: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
  },
};

function RefundsTab({
  refunds,
  onRefundMutated,
}: {
  refunds: RefundRow[];
  onRefundMutated?: () => void;
}) {
  const columns = React.useMemo<AdminTableColumn<RefundRow>[]>(
    () => [
      {
        id: 'requested_at',
        header: 'Thời gian',
        sortKey: 'requested_at',
        width: '170px',
        cell: (r) => (
          <span className="font-mono text-xs text-muted-foreground">
            {fmtDate(r.requested_at)}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Trạng thái',
        sortKey: 'status',
        width: '130px',
        cell: (r) => {
          const meta =
            REFUND_STATUS_META[(r.status ?? '').toLowerCase()] ?? {
              label: r.status ?? '—',
              tone: 'border-border bg-muted/30 text-muted-foreground',
            };
          return (
            <span
              className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${meta.tone}`}
            >
              {meta.label}
            </span>
          );
        },
      },
      {
        id: 'amount_vnd',
        header: 'Số tiền',
        sortKey: 'amount_vnd',
        width: '120px',
        className: 'text-right tabular-nums',
        cell: (r) => (
          <span className="text-foreground/85">
            {r.amount_vnd != null
              ? new Intl.NumberFormat('vi-VN').format(r.amount_vnd) + ' đ'
              : '—'}
          </span>
        ),
      },
      {
        id: 'reason',
        header: 'Lý do',
        cell: (r) => (
          <span className="text-muted-foreground">{r.reason || '—'}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        width: '150px',
        className: 'text-right',
        // Duyệt / Từ chối CHỈ hiện trên lệnh `requested` — mirror đúng worker
        // state machine (accept/reject hợp lệ từ trạng thái requested). Mỗi nút
        // mở dialog xác nhận, đi qua proxy OWNER-gated. Không có tiền di chuyển.
        cell: (r) =>
          (r.status ?? '').toLowerCase() === 'requested' ? (
            <div className="flex items-center justify-end gap-1.5">
              <RefundActionDialog
                refundId={r.refund_id}
                action="accept"
                amountVnd={r.amount_vnd}
                triggerLabel="Duyệt"
                onSuccess={onRefundMutated}
              />
              <RefundActionDialog
                refundId={r.refund_id}
                action="reject"
                amountVnd={r.amount_vnd}
                triggerLabel="Từ chối"
                onSuccess={onRefundMutated}
              />
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
    ],
    [onRefundMutated],
  );
  return (
    <AdminTable<RefundRow>
      rows={refunds}
      columns={columns}
      getRowId={(r) => r.refund_id}
      caption="Lịch sử hoàn tiền"
      empty={
        <EmptyState
          title="Khách này chưa có hoàn tiền nào"
          description="Khi có yêu cầu hoàn tiền gắn với đơn của khách, nó sẽ hiện ở đây."
          className="border-0 bg-transparent py-4"
        />
      }
    />
  );
}

function AuditTab({ rows }: { rows: AuditRow[] }) {
  const columns = React.useMemo<AdminTableColumn<AuditRow>[]>(
    () => [
      {
        id: 'ts',
        header: 'Thời gian',
        sortKey: 'ts',
        width: '180px',
        cell: (r) => (
          <span className="font-mono text-xs text-muted-foreground">
            {fmtDate(r.ts)}
          </span>
        ),
      },
      {
        id: 'action',
        header: 'Hành động',
        sortKey: 'action',
        width: '180px',
        cell: (r) => (
          <span className="inline-flex items-center rounded border border-gold/20 bg-gold/5 px-1.5 py-0.5 font-mono text-[10px] text-gold">
            {r.action}
          </span>
        ),
      },
      {
        id: 'detail',
        header: 'Chi tiết',
        cell: (r) => (
          <span className="text-muted-foreground">{r.detail ?? '—'}</span>
        ),
      },
    ],
    [],
  );
  // AuditRow has no `id` field — synthesize stable key from ts+action.
  const getRowId = React.useCallback(
    (r: AuditRow) => `${r.ts}::${r.action}`,
    [],
  );
  return (
    <AdminTable<AuditRow>
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      caption="Audit trail"
      empty={
        <EmptyState
          title="Chưa có audit log"
          description="Các thao tác admin (xoá, export, override plan) sẽ ghi nhận ở đây."
          className="border-0 bg-transparent py-4"
        />
      }
    />
  );
}

function ComplianceTab({ customer }: { customer: CustomerDetail }) {
  const kycToneMap: Record<string, string> = {
    verified: 'border-jade/40 bg-jade/15 text-jade-700 dark:text-jade-50',
    pending: 'border-gold/40 bg-gold/10 text-gold',
    rejected: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
  };
  const kycTone =
    kycToneMap[(customer.kyc_status ?? '').toLowerCase()]
    ?? 'border-border bg-muted/30 text-muted-foreground';

  const birthSummary = (() => {
    if (
      !customer.birth_year
      && !customer.birth_month
      && !customer.birth_day
    ) {
      return null;
    }
    const parts = [
      customer.birth_year ?? '????',
      String(customer.birth_month ?? '?').padStart(2, '0'),
      String(customer.birth_day ?? '?').padStart(2, '0'),
    ];
    return parts.join('-');
  })();

  return (
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
      {customer.locale && <Field label="Locale" value={customer.locale} mono />}
      {customer.country && <Field label="Quốc gia" value={customer.country} mono />}
      {customer.phone && <Field label="Số điện thoại" value={customer.phone} mono />}
      {customer.gender && <Field label="Giới tính" value={customer.gender} />}
      {/* Wave 63.6 — prefer the per-reading birth_date (from session
          state_json, enriched on the page) over the often-empty users-row
          birth_year/month/day summary; also surface birth place + the
          customer's most recent concern. */}
      {(customer.birth_date || birthSummary) && (
        <Field label="Ngày sinh" value={customer.birth_date ?? birthSummary!} mono />
      )}
      {customer.birth_place && <Field label="Nơi sinh" value={customer.birth_place} />}
      {customer.primary_concern && (
        <Field label="Mối quan tâm gần nhất" value={customer.primary_concern} />
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
              className="font-mono text-xs text-primary underline-offset-2 hover:underline"
            >
              {customer.partner_id}
            </Link>
          </dd>
        </div>
      )}
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
      <dt className="w-28 shrink-0 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd
        className={`min-w-0 flex-1 text-foreground ${
          mono ? 'truncate font-mono text-xs' : ''
        }`}
      >
        {value ?? '—'}
        {hint && (
          <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
            ({hint})
          </span>
        )}
      </dd>
    </div>
  );
}
