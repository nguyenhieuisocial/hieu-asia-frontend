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
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Fingerprint, MapPin } from 'lucide-react';
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
import { UserJourneyPanel, fetchUserJourney } from '@/components/admin/UserJourneyPanel';
import { CustomerAffiliateCard } from '@/components/admin/customers/CustomerAffiliateCard';
import { SessionAccessDialog } from './SessionAccessDialog';
import { RefundActionDialog } from './RefundActionDialog';
import { fmtDate, fmtRelative } from './format';
import {
  type AuditRow,
  type CustomerDetail,
  type CustomerDetailResponse,
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
  /** Stitched cross-device/channel identities (visitor_identities) for this user. */
  identities?: CustomerDetailResponse['identities'];
  /** Supabase Auth profile (name / last-login / provider) from auth.users. */
  authInfo?: CustomerDetailResponse['auth_info'];
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
  identities,
  authInfo,
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

  return (
    <div className="space-y-6">
      <IdentityCard customer={customer} userId={userId} identities={identities} />
      <AccessDeviceCard customer={customer} sessions={sessions} authInfo={authInfo} userId={userId} />
      <ProductTabs tabs={tabs} value={value} onValueChange={onValueChange} />
    </div>
  );
}

/**
 * "Truy cập & thiết bị" — login time / method / IP / device / activity in one
 * place. Login-side fields (name, last sign-in, provider, email-verified,
 * joined) come from Supabase Auth (auth.users, via the detail API's auth_info);
 * IP / location / device come from the MOST RECENT reading session's request
 * metadata (readSessionEnv). A customer with no reading sessions legitimately
 * has no IP/device — those show "chưa có", while login fields still populate.
 */
function AccessDeviceCard({
  customer,
  sessions,
  authInfo,
  userId,
}: {
  customer: CustomerDetail | null;
  sessions: SessionRow[];
  authInfo?: CustomerDetailResponse['auth_info'];
  userId: string;
}) {
  // sessions arrive updated_at desc → first one carrying request metadata is
  // the latest known IP / device / location for this customer.
  const latest = sessions
    .map((s) => readSessionEnv(s.state_json))
    .find((e) => e.ip || e.userAgent);

  // PostHog fallback — a login-only customer (no reading session) still has
  // IP / location / device in PostHog's auto-captured props for every web
  // visit. Reuse the SAME query as the Hành trình tab (identical queryKey →
  // shared TanStack cache, zero extra PostHog round-trip).
  const ph = useQuery({
    queryKey: ['user-journey', userId],
    queryFn: () => fetchUserJourney(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });
  const profile = ph.data?.profile ?? null;

  const sessionLoc = latest
    ? [latest.city, latest.region, latest.country].filter(Boolean).join(', ')
    : '';
  const phLoc = profile ? [profile.city, profile.country].filter(Boolean).join(', ') : '';
  const phDevice = profile
    ? [profile.deviceType, profile.os, profile.browser].filter(Boolean).join(' · ')
    : '';

  const ip = latest?.ip ?? profile?.ip ?? undefined;
  const location = sessionLoc || phLoc || undefined;
  const device = latest?.userAgent ?? (phDevice || undefined);
  const lastActive = customer?.last_active ?? profile?.lastSeen ?? null;

  // A shown value came from PostHog (not a reading session) → footnote the source.
  const usedPostHog = !latest && !!profile && (!!phLoc || !!phDevice || !!profile.ip);

  const providers = authInfo?.providers ?? null;
  const joined = authInfo?.created_at ?? customer?.created_at ?? null;

  const withRel = (iso?: string | null) =>
    iso ? `${fmtDate(iso)} · ${fmtRelative(iso)}` : undefined;

  const rows: Array<{ label: string; value?: string; mono?: boolean }> = [
    { label: 'Tên (từ tài khoản)', value: authInfo?.display_name ?? customer?.display_name ?? undefined },
    { label: 'Đăng nhập lần cuối', value: withRel(authInfo?.last_sign_in_at) },
    { label: 'Đăng nhập qua', value: providers && providers.length ? providers.join(', ') : undefined },
    { label: 'Email xác thực', value: authInfo?.email_confirmed_at ? 'Đã xác thực' : undefined },
    { label: 'Tham gia', value: joined ? fmtDate(joined) : undefined },
    { label: 'Hoạt động cuối', value: withRel(lastActive) },
    { label: 'Tổng phiên đọc', value: String(sessions.length) },
    { label: 'IP gần nhất', value: ip, mono: true },
    { label: 'Vị trí gần nhất', value: location },
    { label: 'Thiết bị gần nhất', value: device, mono: true },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gold/70" aria-hidden />
          Truy cập &amp; thiết bị
        </CardTitle>
        <CardDescription>
          Đăng nhập, IP, thiết bị &amp; hoạt động — gộp từ Supabase Auth + phiên đọc,
          tự động bù từ PostHog (mọi lượt truy cập web) khi khách chưa tạo phiên đọc.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="space-y-0.5">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {r.label}
              </dt>
              <dd
                className={
                  (r.mono ? 'font-mono ' : '') +
                  'break-all text-sm ' +
                  (r.value ? 'text-foreground/90' : 'italic text-muted-foreground')
                }
              >
                {r.value || 'chưa có'}
              </dd>
            </div>
          ))}
        </dl>
        {usedPostHog && (
          <p className="mt-3 text-[11px] italic text-muted-foreground">
            IP/vị trí/thiết bị lấy từ PostHog (khách chưa tạo phiên đọc).
          </p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * "Danh tính & kênh liên hệ" — consolidates every way to identify + reach this
 * customer across channels in one card. All fields come from the users row the
 * detail API already returns (select=*); nothing new is fetched. Missing
 * channels render "chưa liên kết" so the founder sees, at a glance, which
 * channels a customer is reachable on. The user_id doubles as the PostHog
 * distinct_id (the key behind the Hành trình tab), so it's labelled as such.
 */
function IdentityCard({
  customer,
  userId,
  identities,
}: {
  customer: CustomerDetail | null;
  userId: string;
  identities?: CustomerDetailResponse['identities'];
}) {
  // href chỉ cho kênh link được thật: email → mailto, điện thoại → tel.
  // Telegram ID dạng số KHÔNG mở được qua t.me/<id> — giữ text (không fix cho có).
  const channels: Array<{
    label: string;
    value?: string | null;
    mono?: boolean;
    href?: string;
  }> = [
    {
      label: 'Email',
      value: customer?.email,
      mono: true,
      href: customer?.email ? `mailto:${customer.email}` : undefined,
    },
    { label: 'Telegram', value: customer?.telegram_id, mono: true },
    { label: 'Zalo', value: customer?.zalo_id, mono: true },
    {
      label: 'Điện thoại',
      value: customer?.phone,
      href: customer?.phone ? `tel:${customer.phone}` : undefined,
    },
  ];
  const linked = channels.filter((c) => !!c.value).length;
  const idValue = userId || customer?.id || '—';
  // Stitched identity rows (visitor_identities) — anon devices merged into this
  // person + which flow linked them. Empty until a login/backfill stitches.
  const idList = identities ?? [];
  const linkedDevices = idList.filter((i) => i.anon_distinct_id).length;
  const sources = [...new Set(idList.map((i) => i.link_source).filter(Boolean))] as string[];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-gold/70" aria-hidden />
          Danh tính & kênh liên hệ
        </CardTitle>
        <CardDescription>
          Mọi cách nhận diện &amp; liên hệ khách này — gộp từ các kênh. Đã liên kết{' '}
          <span className="font-medium text-foreground/80">
            {linked}/{channels.length}
          </span>{' '}
          kênh.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-0.5 sm:col-span-2">
            <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Mã người dùng · cũng là ID phân tích (PostHog)
            </dt>
            <dd className="break-all font-mono text-sm text-foreground/90">{idValue}</dd>
          </div>
          {channels.map((c) => (
            <div key={c.label} className="space-y-0.5">
              <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {c.label}
              </dt>
              <dd
                className={
                  (c.mono ? 'font-mono ' : '') +
                  'text-sm ' +
                  (c.value ? 'text-foreground/90' : 'italic text-muted-foreground')
                }
              >
                {c.value && c.href ? (
                  <a
                    href={c.href}
                    className="underline decoration-dotted underline-offset-2 hover:text-gold"
                    title={c.href.startsWith('mailto:') ? 'Gửi email' : 'Gọi điện'}
                  >
                    {c.value}
                  </a>
                ) : (
                  c.value || 'chưa liên kết'
                )}
              </dd>
            </div>
          ))}
        </dl>
        {idList.length > 0 && (
          <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            Đã hợp nhất{' '}
            <span className="font-medium text-foreground/80">{idList.length}</span> định danh
            {linkedDevices > 0 && <> · {linkedDevices} thiết bị ẩn danh</>}
            {sources.length > 0 && <> · nguồn: {sources.join(', ')}</>}
          </p>
        )}
      </CardContent>
    </Card>
  );
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
          <Field
            label="Plan"
            value={customer.plan}
            hint={
              customer.plan_expires_at
                ? `hết hạn ${fmtDate(customer.plan_expires_at)}`
                : customer.tier_updated_at
                  ? `đổi gói ${fmtDate(customer.tier_updated_at)}`
                  : undefined
            }
          />
          {customer.app_role && <Field label="Vai trò" value={customer.app_role} />}
          {customer.onboarding_completed_at && (
            <Field
              label="Onboarding"
              value={`Hoàn tất ${fmtDate(customer.onboarding_completed_at)}`}
              hint={fmtRelative(customer.onboarding_completed_at)}
            />
          )}
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

/**
 * Extract request/device metadata from a session's state_json — mirrors the
 * fallback chain in mapBackendSession (lib/admin-api.ts) + the /sessions/[id]
 * "Request HTTP & vị trí" card. Admin-only, read-only display: surfaces the SAME
 * fields already shown on the Sessions pages; no new data is collected or logged.
 */
function readSessionEnv(sj: unknown) {
  const st = (sj ?? {}) as Record<string, unknown>;
  const env = (st.request ?? st.client ?? {}) as Record<string, unknown>;
  const pick = (...v: unknown[]) =>
    v.find((x) => typeof x === 'string' && x.length > 0) as string | undefined;
  return {
    ip: pick(st.ip, st.ip_address, env.ip, env.cf_connecting_ip),
    country: pick(st.country, env.country, env.cf_country),
    city: pick(st.city, env.city, env.cf_city),
    region: pick(st.region, env.region),
    userAgent: pick(st.user_agent, st.ua, env.user_agent, env.ua),
  };
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
        const env = readSessionEnv(sj);
        const loc = [env.city, env.region, env.country].filter(Boolean).join(', ');
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
              {(env.ip || loc || env.userAgent) && (
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[10px] text-muted-foreground/70">
                  {loc && <span title="Vị trí (suy từ IP)">{loc}</span>}
                  {env.ip && <span title="Địa chỉ IP">IP {env.ip}</span>}
                  {env.userAgent && (
                    <span className="max-w-[260px] truncate" title={env.userAgent}>
                      {env.userAgent}
                    </span>
                  )}
                </div>
              )}
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

/** Friendly labels for users.consent_flags keys (migration 0036). Unknown keys
 *  fall back to the raw key so future flags still render. */
const CONSENT_LABEL: Record<string, string> = {
  email_tips: 'Email tips',
  sms_anniversary: 'SMS sinh nhật',
  zalo_optin: 'Zalo OA',
  zalo_oa_broadcast: 'Zalo OA broadcast',
  meta_retargeting: 'Meta retargeting',
  google_retargeting: 'Google retargeting',
};

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
      {/* Real DB consent columns (0036/0037): consent_flags jsonb +
          email_opted_out. The flat *_opt_in fields above never existed in the
          users table — these are the live values the founder needs before
          contacting anyone. */}
      {customer.email_opted_out != null && (
        <div>
          <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Email marketing
          </dt>
          <dd className="mt-1">
            <span
              className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${
                customer.email_opted_out
                  ? 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300'
                  : 'border-jade/40 bg-jade/15 text-jade-700 dark:text-jade-50'
              }`}
            >
              {customer.email_opted_out ? 'Đã hủy đăng ký' : 'Còn nhận email'}
            </span>
          </dd>
        </div>
      )}
      {customer.consent_flags
        && Object.entries(customer.consent_flags)
          .filter(([, v]) => v != null)
          .map(([k, v]) => (
            <Field
              key={k}
              label={CONSENT_LABEL[k] ?? k}
              value={v ? 'Đã đồng ý' : 'Từ chối'}
            />
          ))}
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
