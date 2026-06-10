'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
  Textarea,
  cn,
  toast,
} from '@hieu-asia/ui';
import {
  ChevronLeft,
  Clock,
  DollarSign,
  ListTodo,
  Copy,
  AlertCircle,
  CreditCard,
  ExternalLink,
  RotateCcw,
  Pencil,
  Trash2,
  UserRound,
  Link2,
  KeyRound,
  ShieldOff,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getSession, patchSession, setSessionAccess } from '@/lib/admin-api';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import type { TaskStatus } from '@hieu-asia/types';

const STATUS_TONE: Record<TaskStatus, React.ComponentProps<typeof StatusBadge>['status']> = {
  queued: 'neutral',
  running: 'info',
  completed: 'success',
  failed: 'error',
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  queued: 'Đang chờ',
  running: 'Đang chạy',
  completed: 'Hoàn tất',
  failed: 'Lỗi',
};

// Sessions enrichment wave — human labels for reading_type / channel codes.
// Falls back to the raw code so unknown future values still render.
const READING_TYPE_LABEL: Record<string, string> = {
  tuvi_batu: 'Tử Vi · Bát Tự',
  palmistry: 'Xem tướng tay',
  face: 'Xem tướng mặt',
};
const CHANNEL_LABEL: Record<string, string> = {
  web: 'Web',
  telegram: 'Telegram',
  zalo: 'Zalo',
};

/** How long (ms) a running session may sit before we flag it as stuck. */
const STUCK_THRESHOLD_MS = 30 * 60 * 1000;

// Public customer-facing report lives on the web app, keyed by session_id at
// /reading/<id>/report (the bare /reading/<id> only redirects into the upload
// flow, so we link the /report sub-route directly). Origin is the canonical
// public site; overridable for preview/staging via NEXT_PUBLIC_WEB_URL.
const PUBLIC_WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'https://hieu.asia';

interface AuditEntry {
  ts: string;
  actor?: string | null;
  action: string;
  detail?: string | null;
}

interface SessionAuditResp {
  ok: boolean;
  entries?: AuditEntry[];
  note?: string;
}

/** Pull audit_log entries scoped to this session, if worker supports it. */
async function fetchSessionAudit(id: string): Promise<SessionAuditResp> {
  try {
    const r = await fetch(`/api/admin/audit-log?resource_id=${encodeURIComponent(id)}&limit=50`, {
      cache: 'no-store',
    });
    const data = await r.json();
    return data as SessionAuditResp;
  } catch {
    return { ok: false };
  }
}

// Re-orchestrate + bulk-delete mirror the /sessions list helpers verbatim
// (same Next API routes → Worker). Single-delete reuses the bulk route with a
// one-id array because no dedicated single-delete endpoint exists.
async function reOrchestrate(sessionId: string) {
  const r = await fetch(`/api/admin/sessions/${sessionId}/re-orchestrate`, { method: 'POST' });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data;
}

async function bulkDelete(sessionIds: string[]) {
  const r = await fetch('/api/admin/sessions/bulk-delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_ids: sessionIds, confirm: 'DELETE_BULK' }),
  });
  const data = await r.json().catch(() => ({ ok: false, error: `HTTP ${r.status}` }));
  if (!r.ok || !data.ok) throw new Error(data.error ?? `HTTP ${r.status}`);
  return data;
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
}

function fmtDuration(sec: number | null) {
  if (sec == null) return '—';
  if (sec < 60) return `${sec}s`;
  return `${Math.floor(sec / 60)}m ${sec % 60}s`;
}

// Wave 60.20 — Compact label/value pair for the Request meta dl grid.
// `value === undefined` renders as a muted "—" so missing fields stay
// visible (helps the admin distinguish "no data captured" from "field
// removed from API"). `mono` is used for IP / UA / referrer.
function Field({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('space-y-0.5', className)}>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={cn('text-sm text-foreground/90', mono && 'font-mono', !value && 'text-muted-foreground')}>
        {value || '—'}
      </dd>
    </div>
  );
}

export default function SessionDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();
  const id = params?.id ?? '';
  const session = useQuery({
    queryKey: ['admin', 'session', id],
    queryFn: () => getSession(id),
    staleTime: 60_000,
  });
  const audit = useQuery({
    queryKey: ['admin', 'session', id, 'audit'],
    queryFn: () => fetchSessionAudit(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  const copyId = React.useCallback(() => {
    if (!session.data) return;
    navigator.clipboard.writeText(session.data.session_id).catch(() => {});
  }, [session.data]);

  // Actions toolbar — mirrors the per-row actions on the /sessions list so the
  // detail page is operationally complete (re-run / rename / delete / view
  // customer / copy public link). Reuses the same backend calls + confirm
  // patterns as the list (no new endpoints).
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameLabel, setRenameLabel] = React.useState('');
  const [renameNote, setRenameNote] = React.useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  // Manual paid-access override (backend #41). Grant comps / fixes a missed
  // bank-transfer unlock; revoke removes access (ACCESS-only — never refunds).
  const [grantOpen, setGrantOpen] = React.useState(false);
  const [grantTier, setGrantTier] = React.useState('premium');
  const [revokeOpen, setRevokeOpen] = React.useState(false);
  const [revokeReason, setRevokeReason] = React.useState('');

  const reOrchestrateMut = useMutation({
    mutationFn: reOrchestrate,
    onSuccess: () => {
      toast.success('Đã trigger re-orchestrate', { description: `Session ${id}` });
      qc.invalidateQueries({ queryKey: ['admin', 'session', id] });
      qc.invalidateQueries({ queryKey: ['admin', 'session', id, 'audit'] });
    },
    onError: (e) =>
      toast.error('Re-orchestrate thất bại', { description: (e as Error).message }),
  });

  const renameMut = useMutation({
    mutationFn: (vars: { label: string; note: string }) =>
      patchSession(id, { label: vars.label, note: vars.note }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success('Đã lưu tên / ghi chú');
        setRenameOpen(false);
        qc.invalidateQueries({ queryKey: ['admin', 'session', id] });
      } else {
        toast.error('Lưu thất bại', { description: res.error });
      }
    },
    onError: (e) => toast.error('Lưu thất bại', { description: (e as Error).message }),
  });

  const deleteMut = useMutation({
    // Single-row delete reuses the bulk-delete route with a one-id array — the
    // same mechanism the list page's per-row "Xóa" uses (no single-delete
    // endpoint exists). On success we leave the (now-gone) detail page.
    mutationFn: () => bulkDelete([id]),
    onSuccess: () => {
      toast.success('Đã xóa phiên');
      setConfirmDeleteOpen(false);
      qc.invalidateQueries({ queryKey: ['admin', 'sessions'] });
      router.push('/sessions');
    },
    onError: (e) => toast.error('Xóa thất bại', { description: (e as Error).message }),
  });

  // Mở khoá thủ công (grant) — write the paid-access signal for this session.
  const grantMut = useMutation({
    mutationFn: (tier: string) => setSessionAccess(id, { action: 'grant', tier }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success('Đã mở khoá quyền xem trả phí');
        setGrantOpen(false);
        qc.invalidateQueries({ queryKey: ['admin', 'session', id] });
        qc.invalidateQueries({ queryKey: ['admin', 'session', id, 'audit'] });
      } else {
        toast.error('Mở khoá thất bại', { description: res.error });
      }
    },
    onError: (e) => toast.error('Mở khoá thất bại', { description: (e as Error).message }),
  });

  // Thu hồi quyền (revoke) — delete the paid-access signal. Records `reason` in
  // the audit log only; does NOT move money (SePay refunds are manual).
  const revokeMut = useMutation({
    mutationFn: (reason: string) =>
      setSessionAccess(id, { action: 'revoke', reason: reason || undefined }),
    onSuccess: (res) => {
      if (res.ok) {
        toast.success('Đã thu hồi quyền xem trả phí');
        setRevokeOpen(false);
        qc.invalidateQueries({ queryKey: ['admin', 'session', id] });
        qc.invalidateQueries({ queryKey: ['admin', 'session', id, 'audit'] });
      } else {
        toast.error('Thu hồi thất bại', { description: res.error });
      }
    },
    onError: (e) => toast.error('Thu hồi thất bại', { description: (e as Error).message }),
  });

  const copyReportLink = React.useCallback(() => {
    if (!session.data) return;
    const url = `${PUBLIC_WEB_URL}/reading/${encodeURIComponent(session.data.session_id)}/report`;
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Đã copy link báo cáo'))
      .catch(() => toast.error('Copy link thất bại'));
  }, [session.data]);

  const openRename = React.useCallback(() => {
    setRenameLabel(session.data?.label ?? '');
    setRenameNote(session.data?.note ?? '');
    setRenameOpen(true);
  }, [session.data]);

  const handleReOrchestrate = React.useCallback(() => {
    reOrchestrateMut.mutate(id);
  }, [reOrchestrateMut, id]);

  const handleRenameSave = React.useCallback(() => {
    renameMut.mutate({ label: renameLabel, note: renameNote });
  }, [renameMut, renameLabel, renameNote]);

  const handleDeleteConfirm = React.useCallback(() => {
    deleteMut.mutate();
  }, [deleteMut]);

  const openGrant = React.useCallback(() => {
    setGrantTier('premium');
    setGrantOpen(true);
  }, []);

  const openRevoke = React.useCallback(() => {
    setRevokeReason('');
    setRevokeOpen(true);
  }, []);

  const handleGrantConfirm = React.useCallback(() => {
    grantMut.mutate(grantTier);
  }, [grantMut, grantTier]);

  const handleRevokeConfirm = React.useCallback(() => {
    revokeMut.mutate(revokeReason);
  }, [revokeMut, revokeReason]);

  if (session.isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted/30" />
        <div className="h-32 animate-pulse rounded-xl bg-muted/30" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl bg-muted/30" />
          ))}
        </div>
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="space-y-6">
        <Link
          href="/sessions"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách
        </Link>
        <EmptyState
          title="Không tìm thấy session"
          description={
            <>
              ID <code className="font-mono text-gold">{id}</code> không tồn tại hoặc đã bị xóa.
            </>
          }
        />
      </div>
    );
  }

  const s = session.data;
  const entries = audit.data?.entries ?? [];

  // Sessions enrichment wave — flag a session that's still "running" long after
  // creation (>30min) so the operator can investigate a stuck pipeline.
  const createdMs = new Date(s.created_at).getTime();
  const isStuck =
    s.status === 'running' &&
    Number.isFinite(createdMs) &&
    Date.now() - createdMs > STUCK_THRESHOLD_MS;
  const hasPayment = s.paid != null || s.tier != null || s.paid_at != null;

  // "Xem khách hàng" target. The customer detail route (/customers/[id]) is
  // keyed by user_id; prefer it when present. Else fall back to the customers
  // list pre-filtered by the email search. Anonymous sessions (no id, no real
  // email) get no link — the button is hidden.
  const hasRealEmail = !!(s.user_email && s.user_email.includes('@'));
  const customerHref = s.user_id
    ? `/customers/${encodeURIComponent(s.user_id)}`
    : hasRealEmail
      ? `/customers?search=${encodeURIComponent(s.user_email)}`
      : null;

  return (
    <div className="space-y-6">
      <Link
        href="/sessions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gold"
      >
        <ChevronLeft className="h-4 w-4" />
        Quay lại danh sách
      </Link>

      {/* Wave 60.20 — Header refactor. Admin needs USER identity prominent
          (email = the human), not the opaque session UUID. UUID demoted to
          a small copy-chip below for support-ticket cross-reference. */}
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-gold" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Session detail
            </span>
            <StatusBadge status={STATUS_TONE[s.status]} label={STATUS_LABEL[s.status]} />
            {s.reading_type ? (
              <span
                className="inline-flex items-center rounded border border-gold/25 bg-gold/10 px-1.5 py-0.5 text-[11px] text-gold"
                title={`reading_type: ${s.reading_type}`}
              >
                {READING_TYPE_LABEL[s.reading_type] ?? s.reading_type}
              </span>
            ) : null}
            {s.channel ? (
              <span
                className="inline-flex items-center rounded border border-border bg-card/60 px-1.5 py-0.5 text-[11px] text-muted-foreground"
                title={`channel: ${s.channel}`}
              >
                {CHANNEL_LABEL[s.channel] ?? s.channel}
              </span>
            ) : null}
          </div>
          <h1 className="mt-2 truncate text-2xl font-semibold text-foreground" title={s.user_email && s.user_email.includes('@') ? s.user_email : 'Người dùng ẩn danh'}>
            {s.user_email && s.user_email.includes('@') ? s.user_email : <span className="italic text-muted-foreground">Người dùng ẩn danh</span>}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded border border-gold/30 bg-gold/5 px-2 py-0.5 font-mono text-gold/80" title={s.session_id}>
              {s.session_id}
            </span>
            <button
              type="button"
              onClick={copyId}
              className="inline-flex h-6 items-center gap-1 rounded border border-border px-2 text-muted-foreground hover:bg-gold/10 hover:text-gold"
              aria-label="Copy session ID"
              title="Copy full session ID"
            >
              <Copy className="h-3 w-3" />
              <span className="hidden sm:inline">Copy ID</span>
            </button>
            {s.user_id && (
              <span className="rounded border border-border px-2 py-0.5 font-mono text-muted-foreground" title={`user_id: ${s.user_id}`}>
                u: {s.user_id.slice(0, 8)}…
              </span>
            )}
          </div>
        </div>

        {/* Actions toolbar — re-run / rename / delete / view customer / copy
            link, alongside the existing report-open + copy buttons. Mirrors the
            per-row actions on the /sessions list so the detail page is
            operationally complete. */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReOrchestrate}
            disabled={reOrchestrateMut.isPending}
            title="Chạy lại pipeline cho phiên này"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-gold" aria-hidden />
            {reOrchestrateMut.isPending ? 'Đang chạy…' : 'Chạy lại'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={openRename}
            title="Đặt tên gợi nhớ / ghi chú nội bộ"
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Sửa tên / ghi chú
          </Button>
          {customerHref && (
            <Link
              href={customerHref}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm font-medium text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
              title="Mở hồ sơ khách hàng của phiên này"
            >
              <UserRound className="h-4 w-4" aria-hidden />
              Xem khách hàng
            </Link>
          )}
          <button
            type="button"
            onClick={copyReportLink}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm font-medium text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
            title="Copy link báo cáo khách nhìn thấy"
          >
            <Link2 className="h-4 w-4" aria-hidden />
            Copy link
          </button>

          {/* Sessions polish — open the customer-facing report (public web app)
              in a new tab. Keyed by session_id; the /report sub-route renders
              the finished reading (and shows a "chưa sẵn sàng" state if not). */}
          <a
            href={`${PUBLIC_WEB_URL}/reading/${encodeURIComponent(s.session_id)}/report`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-gold/30 bg-gold/10 px-3 text-sm font-medium text-gold transition-all duration-300 ease-editorial hover:border-gold/50 hover:bg-gold/15"
            title="Mở báo cáo khách nhìn thấy (tab mới)"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            Xem báo cáo
          </a>
          {/* Manual paid-access override (backend #41). Grant shown until the
              session is paid; revoke once it is. Both require explicit confirm —
              grant comps access, revoke is sensitive (and never refunds money). */}
          {!s.paid && (
            <Button
              variant="outline"
              size="sm"
              onClick={openGrant}
              className="border-jade/40 text-jade-700 hover:bg-jade/10 dark:text-jade-50"
              title="Cấp quyền xem trả phí cho phiên này"
            >
              <KeyRound className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Mở khoá thủ công
            </Button>
          )}
          {s.paid && (
            <Button
              variant="outline"
              size="sm"
              onClick={openRevoke}
              className="border-red-500/40 text-red-700 hover:bg-red-500/10 dark:text-red-300"
              title="Gỡ quyền xem trả phí của phiên này (không hoàn tiền)"
            >
              <ShieldOff className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Thu hồi quyền
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmDeleteOpen(true)}
            className="border-red-500/40 text-red-700 hover:bg-red-500/10 dark:text-red-300"
            title="Xóa phiên vĩnh viễn"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Xoá
          </Button>
        </div>
      </div>

      {isStuck && (
        <div className="flex items-start gap-2.5 rounded-md border border-red-500/40 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <p className="font-medium">Phiên có thể đang treo</p>
            <p className="mt-0.5 text-xs text-red-700/80 dark:text-red-300/80">
              Đang ở trạng thái “đang chạy” hơn 30 phút kể từ lúc tạo. Pipeline có thể đã
              kẹt — cân nhắc re-orchestrate hoặc kiểm tra log.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Tạo lúc"
          value={<span className="text-lg">{fmtDateTime(s.created_at)}</span>}
          icon={<Clock className="h-4 w-4" />}
          accent="gold"
          hint="timestamp"
        />
        <KpiCard
          label="Thời lượng"
          value={fmtDuration(s.duration_seconds)}
          icon={<Clock className="h-4 w-4" />}
          accent="jade"
          hint={s.status === 'running' ? 'đang chạy' : 'pipeline'}
        />
        <KpiCard
          label="Cost"
          value={`$${s.cost_usd.toFixed(3)}`}
          icon={<DollarSign className="h-4 w-4" />}
          accent="purple"
          hint="USD"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bối cảnh user</CardTitle>
          <CardDescription>Mối quan tâm chính từ survey + input ban đầu.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/90">
            {s.primary_concern && s.primary_concern !== '—'
              ? s.primary_concern
              : (
                <span className="italic text-muted-foreground">
                  (User chưa nhập mối quan tâm — survey/input ban đầu để trống.)
                </span>
              )}
          </p>
        </CardContent>
      </Card>

      {/* Sessions enrichment wave — payment status. Display-only: paid flag +
          tier + unlock timestamp, derived backend-side from the
          session-unlocked KV key. Hidden entirely when the backend hasn't
          enriched this row (no paid/tier/paid_at). */}
      {hasPayment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-gold/70" aria-hidden />
              Thanh toán
            </CardTitle>
            <CardDescription>
              Trạng thái thanh toán + gói đã mua cho phiên này.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-0.5">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Trạng thái
                </dt>
                <dd>
                  {s.paid == null ? (
                    <span className="text-sm text-muted-foreground">—</span>
                  ) : s.paid ? (
                    <span className="inline-flex items-center rounded border border-jade/30 bg-jade/10 px-1.5 py-0.5 text-xs font-medium text-jade-700 dark:text-jade-50">
                      Đã trả
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Chưa trả</span>
                  )}
                </dd>
              </div>
              <Field label="Gói" value={s.tier ?? undefined} />
              <Field
                label="Thanh toán lúc"
                value={s.paid_at ? fmtDateTime(s.paid_at) : undefined}
              />
              <Field
                label="Số tiền"
                value={
                  s.paid_amount_vnd != null
                    ? `${s.paid_amount_vnd.toLocaleString('vi-VN')} ₫`
                    : undefined
                }
              />
              <Field label="Mã giao dịch" value={s.paid_txn_ref ?? undefined} mono />
            </dl>
          </CardContent>
        </Card>
      )}

      {s.user_feedback && s.user_feedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Phản hồi của khách</CardTitle>
            <CardDescription>
              Phản hồi gần đây của khách này (khớp theo email — không riêng phiên này).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {s.user_feedback.map((f, i) => (
              <div
                key={i}
                className="rounded border border-border/60 bg-muted/30 px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {f.rating != null && (
                    <span className="text-gold">
                      {'★'.repeat(Math.max(0, Math.min(5, f.rating)))}
                    </span>
                  )}
                  {f.surface && <span className="font-mono">{f.surface}</span>}
                  {f.ts && <span>{fmtDateTime(f.ts)}</span>}
                  {f.status && (
                    <span className="rounded bg-border/50 px-1">{f.status}</span>
                  )}
                </div>
                {f.message && <p className="mt-1 text-foreground/90">{f.message}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {s.state_json && (
        <Card>
          <CardHeader>
            <CardTitle>Dữ liệu thô (JSON)</CardTitle>
            <CardDescription>
              Toàn bộ state_json của phiên — để soi sâu khi cần.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <details>
              <summary className="cursor-pointer text-sm text-gold/80 hover:text-gold">
                Hiện / ẩn JSON
              </summary>
              <pre className="mt-2 max-h-96 overflow-auto rounded border border-border/60 bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-foreground/85">
                {JSON.stringify(s.state_json, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )}

      {/* Wave 60.20 — Request metadata card. Extracts IP / geo / user-agent /
          referrer from state_json if the Worker captured them at session
          creation. Missing fields show as "—" with a hint that Worker logging
          needs to be extended (vault 94 deferred item). */}
      {s.state_json && (() => {
        const sj = s.state_json as Record<string, unknown>;
        // Worker may write these under flat keys or under a `request` envelope.
        const reqEnv = (sj.request ?? sj.client ?? {}) as Record<string, unknown>;
        const ip = (sj.ip as string | undefined) ?? (sj.ip_address as string | undefined)
          ?? (reqEnv.ip as string | undefined) ?? (reqEnv.cf_connecting_ip as string | undefined);
        const country = (sj.country as string | undefined) ?? (reqEnv.country as string | undefined)
          ?? (reqEnv.cf_country as string | undefined);
        const city = (sj.city as string | undefined) ?? (reqEnv.city as string | undefined)
          ?? (reqEnv.cf_city as string | undefined);
        const region = (sj.region as string | undefined) ?? (reqEnv.region as string | undefined);
        const ua = (sj.user_agent as string | undefined) ?? (reqEnv.user_agent as string | undefined)
          ?? (reqEnv.ua as string | undefined);
        const referrer = (sj.referrer as string | undefined) ?? (reqEnv.referrer as string | undefined)
          ?? (reqEnv.referer as string | undefined);
        const hasAny = ip || country || city || ua || referrer;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gold/70" aria-hidden />
                Yêu cầu HTTP & vị trí
              </CardTitle>
              <CardDescription>
                IP, vị trí địa lý, user-agent, và referrer của request tạo session. Cần thiết
                cho audit, fraud check, và GDPR-DSAR exports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!hasAny ? (
                <p className="text-xs italic text-muted-foreground">
                  Worker chưa log request metadata vào <code className="font-mono text-gold/70">state_json</code>.
                  Để hiển thị IP/geo/UA, cần extend Worker <code className="font-mono text-gold/70">handleReadingCreate</code>
                  để ghi <code className="font-mono text-gold/70">ip / country / city / user_agent / referrer</code>
                  từ Cloudflare request headers (<code className="font-mono text-gold/70">cf-connecting-ip</code>,{' '}
                  <code className="font-mono text-gold/70">cf-ipcountry</code>,{' '}
                  <code className="font-mono text-gold/70">request.cf.city</code>, etc.) vào reading_sessions.state_json.
                  Tracked as Wave 60.20 follow-up in vault 94.
                </p>
              ) : (
                <dl className="grid gap-3 sm:grid-cols-2">
                  <Field label="IP" value={ip} mono />
                  <Field label="Quốc gia" value={country} />
                  <Field label="Thành phố" value={city} />
                  <Field label="Vùng" value={region} />
                  <Field label="User-Agent" value={ua} mono className="sm:col-span-2 break-all" />
                  <Field label="Referrer" value={referrer} mono className="sm:col-span-2 break-all" />
                </dl>
              )}
            </CardContent>
          </Card>
        );
      })()}

      {/* Wave 58.12 — Birth data, Tử Vi chart, Final Report, Insights chi tiết. */}
      {s.state_json &&
        (() => {
          const sj = s.state_json as Record<string, unknown>;
          const birth = (sj.birth_data ?? {}) as Record<string, unknown>;
          const tuvi = (sj.tuvi_chart ?? {}) as Record<string, unknown>;
          const insights = (sj.insights ?? {}) as Record<string, unknown>;
          const reportMeta = (sj.report_meta ?? {}) as Record<string, unknown>;
          const logicMeta = (sj.logic_meta ?? {}) as Record<string, unknown>;
          const psychMeta = (sj.psychology_meta ?? {}) as Record<string, unknown>;
          const alignMeta = (sj.alignment_meta ?? {}) as Record<string, unknown>;

          const hasBirth = Object.keys(birth).length > 0;
          const hasTuvi = Object.keys(tuvi).length > 0;
          const hasInsights = Object.keys(insights).length > 0;
          const hasMeta =
            Object.keys(reportMeta).length > 0 ||
            Object.keys(logicMeta).length > 0 ||
            Object.keys(psychMeta).length > 0 ||
            Object.keys(alignMeta).length > 0;

          return (
            <>
              {hasBirth && (
                <Card>
                  <CardHeader>
                    <CardTitle>Dữ liệu sinh trắc</CardTitle>
                    <CardDescription>Birth data đầu vào để lập lá số.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                      {Object.entries({
                        display_name: 'Tên hiển thị',
                        gender: 'Giới tính',
                        birth_date: 'Ngày sinh',
                        birth_time: 'Giờ sinh',
                        birth_place: 'Nơi sinh',
                        calendar: 'Lịch',
                        timezone: 'Múi giờ',
                        time_confidence: 'Độ chắc giờ',
                      }).map(([key, label]) => {
                        const v = birth[key];
                        if (v == null || v === '') return null;
                        return (
                          <div key={key}>
                            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {label}
                            </dt>
                            <dd className="mt-1 font-mono text-sm text-foreground">{String(v)}</dd>
                          </div>
                        );
                      })}
                    </dl>
                  </CardContent>
                </Card>
              )}

              {hasTuvi && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tử Vi — Tứ Trụ</CardTitle>
                    <CardDescription>4 trụ Năm · Tháng · Ngày · Giờ tính từ birth data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {['year', 'month', 'day', 'hour'].map((k) => {
                        const labelMap: Record<string, string> = {
                          year: 'Năm',
                          month: 'Tháng',
                          day: 'Ngày',
                          hour: 'Giờ',
                        };
                        const v = tuvi[k];
                        return (
                          <div
                            key={k}
                            className="rounded-md border border-gold/20 bg-gold/5 px-3 py-2 text-center"
                          >
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {labelMap[k]}
                            </div>
                            <div className="mt-1 font-mono text-base text-gold">
                              {(v as string) || '—'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {s.final_report_markdown && (
                <Card>
                  <CardHeader>
                    <CardTitle>Báo cáo cuối</CardTitle>
                    <CardDescription>
                      {s.final_report_markdown.length} ký tự · sinh từ pipeline `report`.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Wave 60.1 — real markdown render via react-markdown.
                        Admin doesn't have @tailwindcss/typography plugin so we
                        pass custom components map with brand-aligned styles
                        (gold headings, strong = foreground, links = gold). */}
                    <div className="rounded-md border border-gold/10 bg-card/40 p-4 text-sm leading-relaxed text-foreground/90">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="mt-0 mb-4 font-heading text-xl font-semibold text-gold">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="mt-6 mb-3 font-heading text-lg font-semibold text-gold">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="mt-4 mb-2 font-heading text-base font-semibold text-gold/90">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="my-3 text-foreground/85">{children}</p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-foreground">{children}</strong>
                          ),
                          em: ({ children }) => (
                            <em className="italic text-foreground/90">{children}</em>
                          ),
                          a: ({ href, children }) => {
                            // Wave 60.4 retroactive /ultrareview fix —
                            // final_report_markdown is LLM-generated. A
                            // prompt-injected user concern could leak a
                            // `javascript:` URI through to the report
                            // markdown. react-markdown 10.x doesn't sanitize
                            // href by default — allowlist safe protocols.
                            const safe =
                              href && /^(https?:|mailto:|\/|#)/i.test(href)
                                ? href
                                : undefined;
                            return (
                              <a
                                href={safe}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gold underline-offset-2 hover:underline"
                              >
                                {children}
                              </a>
                            );
                          },
                          ul: ({ children }) => (
                            <ul className="my-3 ml-6 list-disc space-y-1 marker:text-gold/60">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="my-3 ml-6 list-decimal space-y-1 marker:text-gold/60">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="text-foreground/85">{children}</li>
                          ),
                          code: ({ children }) => (
                            <code className="rounded bg-gold/10 px-1 py-0.5 font-mono text-xs text-gold">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="my-3 overflow-x-auto rounded-md border border-gold/15 bg-card/60 p-3 font-mono text-xs">
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="my-3 border-l-2 border-gold/40 pl-3 italic text-foreground/75">
                              {children}
                            </blockquote>
                          ),
                          hr: () => <hr className="my-4 border-gold/15" />,
                        }}
                      >
                        {s.final_report_markdown}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}

              {hasInsights && (
                <Card>
                  <CardHeader>
                    <CardTitle>Insights chi tiết</CardTitle>
                    <CardDescription>
                      Output thô của các step pipeline (logic · psychology · alignment · report).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(['logic', 'psychology', 'alignment', 'report'] as const).map((role) => {
                        const txt = insights[role];
                        if (typeof txt !== 'string' || !txt.trim()) return null;
                        const titleMap = {
                          logic: 'Logic Expert',
                          psychology: 'Psychology Expert',
                          alignment: 'Alignment Expert',
                          report: 'Report Writer',
                        } as const;
                        return (
                          <details
                            key={role}
                            className="rounded-md border border-gold/15 bg-card/30 px-3 py-2"
                          >
                            <summary className="cursor-pointer text-sm font-medium text-foreground/90">
                              {titleMap[role]}{' '}
                              <span className="text-[10px] text-muted-foreground">
                                ({txt.length} chars)
                              </span>
                            </summary>
                            <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">
                              {txt}
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {hasMeta && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pipeline meta</CardTitle>
                    <CardDescription>Vendor + model dùng cho từng role.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      {(
                        [
                          ['logic', logicMeta],
                          ['psychology', psychMeta],
                          ['alignment', alignMeta],
                          ['report', reportMeta],
                        ] as const
                      ).map(([role, meta]) => {
                        if (Object.keys(meta).length === 0) return null;
                        return (
                          <div
                            key={role}
                            className="rounded-md border border-gold/10 bg-card/40 px-3 py-2"
                          >
                            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                              {role}
                            </dt>
                            <dd className="mt-1 space-y-0.5 font-mono text-xs text-foreground/80">
                              {Object.entries(meta).map(([k, v]) => (
                                <div key={k} className="flex gap-2">
                                  <span className="text-muted-foreground">{k}:</span>
                                  <span className="truncate">{String(v)}</span>
                                </div>
                              ))}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </CardContent>
                </Card>
              )}
            </>
          );
        })()}

      {s.error && (
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4" />
              Lỗi pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded border border-red-500/30 bg-red-500/5 p-3 font-mono text-xs leading-relaxed text-red-700 dark:text-red-200">
              {s.error}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
          <CardDescription>
            Các sự kiện liên quan tới session này (re-orchestrate, delete, manual override).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audit.isLoading ? (
            <div className="space-y-2 py-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted/30" />
              ))}
            </div>
          ) : audit.data?.note ? (
            <div className="rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
              {audit.data.note}
            </div>
          ) : entries.length === 0 ? (
            <EmptyState
              title="Chưa có sự kiện"
              description="Các hành động ghi vào audit_log sẽ hiện ở đây theo thời gian giảm dần."
              className="border-0 bg-transparent"
            />
          ) : (
            <ul className="space-y-2">
              {entries.map((e, i) => (
                <li
                  key={i}
                  className={cn(
                    'flex items-start gap-3 rounded-md border border-gold/10 bg-card/60 px-3 py-2',
                  )}
                >
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground" title={e.ts}>
                    {fmtDateTime(e.ts)}
                  </span>
                  <span className="inline-flex items-center rounded border border-gold/20 bg-gold/5 px-1.5 py-0.5 font-mono text-[10px] text-gold">
                    {e.action}
                  </span>
                  <span className="min-w-0 flex-1 text-sm text-foreground/85">
                    {e.actor && (
                      <span className="font-mono text-xs text-muted-foreground">{e.actor}</span>
                    )}
                    {e.detail && (
                      <span className="ml-1.5 text-muted-foreground">— {e.detail}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Sửa tên / ghi chú — same label+note edit as the list (patchSession),
          prefilled from the current values, refetches the detail on success. */}
      <Dialog open={renameOpen} onOpenChange={(o) => !o && setRenameOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đặt tên / ghi chú phiên</DialogTitle>
            <DialogDescription>
              Tên gợi nhớ + ghi chú nội bộ cho phiên này. Không đổi ID gốc — chỉ là nhãn hiển thị.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Tên gợi nhớ</label>
              <Input
                value={renameLabel}
                onChange={(e) => setRenameLabel(e.target.value)}
                placeholder="vd: Chị Lan – tài chính"
                maxLength={120}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Ghi chú</label>
              <Input
                value={renameNote}
                onChange={(e) => setRenameNote(e.target.value)}
                placeholder="vd: khách VIP, cần follow-up"
                maxLength={280}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setRenameOpen(false)}
              disabled={renameMut.isPending}
            >
              Hủy
            </Button>
            <Button onClick={handleRenameSave} disabled={renameMut.isPending}>
              {renameMut.isPending ? 'Đang lưu…' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Xoá — destructive confirm. Reuses the bulk-delete route with one id;
          on success leaves the (now-gone) detail page back to the list. */}
      <Dialog open={confirmDeleteOpen} onOpenChange={(o) => !o && setConfirmDeleteOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa phiên?</DialogTitle>
            <DialogDescription>
              Session <code className="font-mono text-gold">{s.session_id}</code> sẽ bị xóa
              vĩnh viễn (kèm báo cáo và metadata). Hành động không hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmDeleteOpen(false)}
              disabled={deleteMut.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={deleteMut.isPending}
              className="bg-red-500/90 text-foreground hover:bg-red-500"
            >
              {deleteMut.isPending ? 'Đang xóa…' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mở khoá thủ công — grant paid access (backend #41). Optional tier
          (defaults to premium). On success refetches the session so the payment
          card flips to "Đã trả". */}
      <Dialog open={grantOpen} onOpenChange={(o) => !o && setGrantOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mở khoá quyền xem trả phí?</DialogTitle>
            <DialogDescription>
              Cấp quyền xem trả phí cho phiên này (vd: khách đã chuyển khoản mà hệ thống
              chưa tự mở, hoặc tặng).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Gói</label>
            <Select value={grantTier} onValueChange={setGrantTier}>
              <SelectTrigger aria-label="Gói">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">premium</SelectItem>
                <SelectItem value="mentor_month">mentor_month</SelectItem>
                <SelectItem value="mentor_year">mentor_year</SelectItem>
                <SelectItem value="lifetime">lifetime</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setGrantOpen(false)} disabled={grantMut.isPending}>
              Hủy
            </Button>
            <Button
              onClick={handleGrantConfirm}
              disabled={grantMut.isPending}
              className="border border-jade/40 bg-jade/15 text-jade-700 hover:bg-jade/25 dark:text-jade-50"
            >
              {grantMut.isPending ? 'Đang mở khoá…' : 'Mở khoá'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Thu hồi quyền — revoke paid access (backend #41). Sensitive: the warning
          MUST make clear this never refunds money. Optional reason recorded in
          the audit log. On success refetches the session. */}
      <Dialog open={revokeOpen} onOpenChange={(o) => !o && setRevokeOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thu hồi quyền xem trả phí?</DialogTitle>
            <DialogDescription>
              Gỡ quyền xem trả phí của phiên này. ⚠️ Nếu cần HOÀN TIỀN, bạn phải tự chuyển
              khoản trả lại — nút này KHÔNG tự hoàn tiền.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Lý do (tuỳ chọn)</label>
            <Textarea
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              placeholder="vd: đã hoàn tiền qua chuyển khoản, khách yêu cầu huỷ"
              maxLength={500}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRevokeOpen(false)} disabled={revokeMut.isPending}>
              Hủy
            </Button>
            <Button
              onClick={handleRevokeConfirm}
              disabled={revokeMut.isPending}
              className="bg-red-500/90 text-foreground hover:bg-red-500"
            >
              {revokeMut.isPending ? 'Đang thu hồi…' : 'Thu hồi quyền'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
