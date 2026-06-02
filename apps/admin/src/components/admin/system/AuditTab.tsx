'use client';

/**
 * /admin/audit — Wave 60.71.T2.audit redesign.
 *
 * Vault 107 §5.7 Tier 2. Audit log viewer rebuilt on AdminTable primitive
 * (Wave 60.71.T2.customers) with DropdownMenu filter chrome (Wave 60.68)
 * and a collapsible JSON popover for row metadata.
 *
 *   ├─ This file (~270 LOC orchestration: query, KPI strip, filter chrome)
 *   ├─ <AdminTable> primitive (components/admin/table/AdminTable.tsx)
 *   ├─ <AuditDetailsMenu> JSON popover (components/admin/audit/)
 *   └─ format.ts helpers (date, criticality taxonomy)
 *
 * RSC discipline:
 *   - Icons pre-rendered at the call site (Wave 60.65.P0a)
 *   - No inline arrow fns in props (Wave 60.66.HF1) — page stays Client
 *     because it owns interactive filter state
 *   - Defensive `Array.isArray` on entries (Wave 60.65.P0c)
 *
 * Compliance:
 *   - Lưu 12 tháng theo Nghị định 13/2023 (PDPL VN)
 *   - CSV export proxy via /api/admin/audit-log → Worker
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  StatusBadge,
} from '@hieu-asia/ui';
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  Clock,
  Download,
  Filter,
  Users,
} from 'lucide-react';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/table/AdminTable';
import { AuditDetailsMenu } from '@/components/admin/audit/AuditDetailsMenu';
import {
  fmtAuditDate,
  fmtRelative,
  isCritical,
} from '@/components/admin/audit/format';

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

const ACTION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '__all', label: 'Tất cả action' },
  { value: 'admin_login', label: 'admin_login' },
  { value: 'user_export_requested', label: 'user_export_requested' },
  { value: 'user_erased', label: 'user_erased' },
  { value: 'secret_rotated', label: 'secret_rotated' },
  { value: 'coupon_revoked', label: 'coupon_revoked' },
  { value: 'admin_user_role_changed', label: 'admin_user_role_changed' },
];

const LIMIT = 100;

// Pre-rendered icons (Wave 60.65.P0a)
const ICON_DOWNLOAD = <Download className="mr-1.5 h-3.5 w-3.5" aria-hidden />;
const ICON_ACTIVITY = <Activity className="h-4 w-4" aria-hidden />;
const ICON_CLOCK = <Clock className="h-4 w-4" aria-hidden />;
const ICON_USERS = <Users className="h-4 w-4" aria-hidden />;
const ICON_ALERT = <AlertTriangle className="h-4 w-4" aria-hidden />;
const ICON_FILTER = <Filter className="h-3 w-3 text-muted-foreground" aria-hidden />;
const ICON_CHEVRON = <ChevronDown className="h-3 w-3 text-muted-foreground" aria-hidden />;

async function fetchAudit(params: {
  action: string;
  actor: string;
  from: string;
  to: string;
  limit: number;
}): Promise<AuditResponse> {
  const qs = new URLSearchParams();
  if (params.action && params.action !== '__all') qs.set('action', params.action);
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

function exportCsv(entries: AuditEntry[]) {
  if (entries.length === 0) return;
  const headers = ['ts', 'actor', 'actor_type', 'action', 'resource_id', 'ip', 'metadata'];
  const body = entries
    .map((e) =>
      [
        e.ts ?? '',
        e.actor ?? '',
        e.actor_type ?? '',
        e.action ?? '',
        e.resource_id ?? '',
        e.ip ?? '',
        e.metadata ? JSON.stringify(e.metadata) : '',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    )
    .join('\n');
  const csv = `${headers.join(',')}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Stable row id — fall back to ts+actor when DB-generated id missing. */
function getAuditId(e: AuditEntry): string {
  return e.id ?? `${e.ts ?? ''}-${e.actor ?? ''}-${e.action ?? ''}`;
}

const COLUMNS: AdminTableColumn<AuditEntry>[] = [
  {
    id: 'ts',
    header: 'Thời gian',
    sortKey: 'ts',
    width: '170px',
    cell: (e) => (
      <div title={e.ts ?? ''}>
        <div className="font-mono text-xs text-foreground/85">{fmtAuditDate(e.ts)}</div>
        <div className="text-[10px] text-muted-foreground">{fmtRelative(e.ts)}</div>
      </div>
    ),
  },
  {
    id: 'actor',
    header: 'Actor',
    sortKey: 'actor',
    cell: (e) => (
      <div className="min-w-0">
        <div className="truncate text-foreground" title={e.actor ?? ''}>
          {e.actor ?? '—'}
        </div>
        {e.actor_type && (
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {e.actor_type}
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'action',
    header: 'Action',
    sortKey: 'action',
    width: '220px',
    cell: (e) => {
      // Wave 60.81.B Tier 3 polish — delegate to canonical StatusBadge so the
      // action pill matches the look used on /coupons, /tasks, /sessions.
      // Critical actions (erase/rotate/revoke/role-change) = error tone; the
      // rest get a neutral info tone tuned for read-heavy log scanning.
      const critical = isCritical(e.action);
      return (
        <StatusBadge
          status={critical ? 'error' : 'warning'}
          label={e.action ?? '—'}
        />
      );
    },
  },
  {
    id: 'resource',
    header: 'Resource',
    width: '160px',
    hideOnMobile: true,
    cell: (e) => (
      <span
        className="block truncate font-mono text-xs text-muted-foreground"
        title={e.resource_id ?? ''}
      >
        {e.resource_id ?? '—'}
      </span>
    ),
  },
  {
    id: 'ip',
    header: 'IP',
    width: '130px',
    hideOnMobile: true,
    cell: (e) => (
      <span className="font-mono text-xs text-muted-foreground">{e.ip ?? '—'}</span>
    ),
  },
  {
    id: 'metadata',
    header: 'Details',
    width: '120px',
    cell: (e) => <AuditDetailsMenu metadata={e.metadata} />,
  },
];

export function AuditTab() {
  const [action, setAction] = React.useState('__all');
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
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  // Defensive Array.isArray (Wave 60.65.P0c)
  const entries = React.useMemo<AuditEntry[]>(
    () => (Array.isArray(data?.entries) ? data.entries : []),
    [data?.entries],
  );

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const note = data?.note;

  // KPI aggregates — page slice only (no backend totals endpoint yet)
  const uniqueActors = new Set(entries.map((e) => e.actor).filter(Boolean)).size;
  const criticalCount = entries.filter((e) => isCritical(e.action)).length;
  const todayCount = entries.filter((e) => {
    if (!e.ts) return false;
    return Date.now() - new Date(e.ts).getTime() < 24 * 3600 * 1000;
  }).length;

  // Most active admin actor for KPI (small N — page slice).
  const actorCounts = entries.reduce<Record<string, number>>((acc, e) => {
    const key = e.actor ?? '';
    if (!key) return acc;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const topActor =
    Object.entries(actorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  // ---- Stable callbacks ----
  const handleActionChange = React.useCallback((v: string) => {
    setAction(v);
  }, []);

  const handleActorChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setActorInput(e.target.value);
    },
    [],
  );

  const handleFromChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFrom(e.target.value);
    },
    [],
  );

  const handleToChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTo(e.target.value);
    },
    [],
  );

  const handleRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const handleExport = React.useCallback(() => {
    exportCsv(entries);
  }, [entries]);

  const actionLabel =
    ACTION_OPTIONS.find((o) => o.value === action)?.label ?? 'Tất cả action';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Bản ghi hoạt động — admin actions + GDPR-related events. Lưu 12 tháng theo Nghị định 13/2023.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={entries.length === 0}
          >
            {ICON_DOWNLOAD}
            Xuất CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            {isFetching ? 'Đang tải…' : 'Làm mới'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Hiển thị / trang"
          value={entries.length}
          icon={ICON_ACTIVITY}
          accent="gold"
          hint={`tối đa ${LIMIT}`}
        />
        <KpiCard
          label="24h gần nhất"
          value={todayCount}
          icon={ICON_CLOCK}
          accent="purple"
          hint="event"
        />
        <KpiCard
          label="Actor unique"
          value={uniqueActors}
          icon={ICON_USERS}
          accent="jade"
          hint={topActor ? `top: ${topActor}` : 'người thao tác'}
        />
        <KpiCard
          label="Critical"
          value={criticalCount}
          icon={ICON_ALERT}
          accent={criticalCount > 0 ? 'red' : 'jade'}
          hint="erase / rotate / revoke / role-change"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Mặc định {LIMIT} entry mới nhất. Actor search debounce 300ms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gold/20 bg-card/60 px-3 text-sm text-foreground transition-all duration-300 ease-editorial hover:border-gold/50"
                  aria-label="Lọc theo action"
                >
                  {ICON_FILTER}
                  <span className="flex-1 truncate text-left">{actionLabel}</span>
                  {ICON_CHEVRON}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[16rem]">
                <DropdownMenuLabel>Action</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={action} onValueChange={handleActionChange}>
                  {ACTION_OPTIONS.map((opt) => (
                    <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Input
              type="text"
              value={actorInput}
              onChange={handleActorChange}
              placeholder="Actor (email / user_id)…"
            />
            <Input
              type="datetime-local"
              value={from}
              onChange={handleFromChange}
              aria-label="Từ thời điểm"
            />
            <Input
              type="datetime-local"
              value={to}
              onChange={handleToChange}
              aria-label="Đến thời điểm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động ({entries.length})</CardTitle>
          <CardDescription>Sắp xếp theo timestamp giảm dần (mới nhất trên cùng).</CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được audit log.'}
                onRetry={handleRefresh}
              />
            </div>
          )}
          {note && !showError && (
            <div className="mb-4 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
              {note}
            </div>
          )}

          <AdminTable<AuditEntry>
            rows={entries}
            columns={COLUMNS}
            loading={isLoading}
            getRowId={getAuditId}
            caption="Audit log entries"
            empty={
              <EmptyState
                title={note ? 'Bảng audit_log chưa được tạo' : 'Không có entry khớp bộ lọc'}
                description={
                  note ?? 'Thử bỏ filter hoặc mở rộng date range để xem thêm dữ liệu.'
                }
                className="border-0 bg-transparent"
              />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
