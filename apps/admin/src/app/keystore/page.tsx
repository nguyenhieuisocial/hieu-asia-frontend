'use client';

/**
 * /admin/keystore — Wave 63.10 rewire (was Wave 60.81.A mock).
 *
 * Now a READ-ONLY view of the real admin key registry (GET /admin/api-keys →
 * hieu_asia.admin_api_keys). The previous build mocked "vendor secrets" with
 * reveal/rotate/delete — serving plaintext credentials + mutating them from a
 * web UI is unsafe and was never backed by a real endpoint, so it's gone.
 *
 * These are admin-issued API keys: stored as SHA-256 hash + last-4 prefix, with
 * the plaintext shown exactly once at creation (via the create flow), never
 * persisted. So there is nothing to reveal, and revoking is deliberately kept
 * off this surface (handled in /connect or the backend) to avoid lock-outs.
 *
 * RSC discipline: icons pre-rendered at call site; no inline arrow fns in props;
 * defensive Array.isArray on the React Query boundary.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@hieu-asia/ui';
import { KeyRound, ShieldCheck, ShieldX, CalendarPlus } from 'lucide-react';
import { listVaultEntries, type VaultEntry } from '@/lib/keystore-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { KeyNameCell } from '@/components/admin/keystore/KeyNameCell';
import { StatusBadge } from '@/components/admin/keystore/StatusBadge';

const HEADER_ICON = <KeyRound className="h-5 w-5" aria-hidden />;
const ICON_TOTAL = <KeyRound className="h-4 w-4" aria-hidden />;
const ICON_ACTIVE = <ShieldCheck className="h-4 w-4" aria-hidden />;
const ICON_REVOKED = <ShieldX className="h-4 w-4" aria-hidden />;
const ICON_NEW = <CalendarPlus className="h-4 w-4" aria-hidden />;

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function fmtRelative(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff)) return '—';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'hôm nay';
  if (days < 7) return `${days}d trước`;
  if (days < 30) return `${Math.floor(days / 7)}w trước`;
  if (days < 365) return `${Math.floor(days / 30)}mo trước`;
  return `${Math.floor(days / 365)}y trước`;
}

export default function KeystorePage() {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['admin', 'keystore'],
    queryFn: listVaultEntries,
  });

  const rows: VaultEntry[] = React.useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const showError = !!error;
  const errorMsg = (error as Error | undefined)?.message;

  const totalCount = rows.length;
  const activeCount = rows.filter((r) => !r.revoked).length;
  const revokedCount = rows.filter((r) => r.revoked).length;
  const newThisWeek = rows.filter(
    (r) => r.created_at != null && Date.now() - new Date(r.created_at).getTime() < SEVEN_DAYS_MS,
  ).length;

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const columns = React.useMemo<AdminTableColumn<VaultEntry>[]>(
    () => [
      {
        id: 'key_name',
        header: 'Tên key',
        sortKey: 'key_name',
        cell: (r) => <KeyNameCell keyName={r.key_name} preview={r.masked_preview} />,
      },
      {
        id: 'created_by',
        header: 'Người tạo',
        sortKey: 'created_by',
        width: '180px',
        hideOnMobile: true,
        cell: (r) => (
          <span className="text-xs text-muted-foreground">{r.created_by ?? '—'}</span>
        ),
      },
      {
        id: 'scopes',
        header: 'Scopes',
        width: '200px',
        hideOnMobile: true,
        cell: (r) =>
          r.scopes.length > 0 ? (
            <span className="font-mono text-[11px] text-muted-foreground">
              {r.scopes.join(', ')}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          ),
      },
      {
        id: 'created_at',
        header: 'Tạo lúc',
        sortKey: 'created_at',
        width: '120px',
        hideOnMobile: true,
        cell: (r) => (
          <span className="font-mono text-xs text-muted-foreground">{fmtRelative(r.created_at)}</span>
        ),
      },
      {
        id: 'status',
        header: 'Trạng thái',
        sortKey: 'status',
        width: '120px',
        cell: (r) => <StatusBadge status={r.status} />,
      },
    ],
    [],
  );

  const source = Array.isArray(data)
    ? (data as VaultEntry[] & { _source?: { isMock: boolean; reason?: string } })._source
    : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Keystore"
        description="API keys nội bộ (hieu_asia.admin_api_keys) — lưu dạng hash + 4 ký tự cuối, plaintext chỉ hiện 1 lần khi tạo. Chỉ xem; reveal/rotate/thu hồi xử lý qua /connect hoặc backend để tránh khoá nhầm."
        icon={HEADER_ICON}
      />

      <MockBanner source={source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Tổng key" value={totalCount} icon={ICON_TOTAL} accent="gold" hint="đã phát hành" />
        <KpiCard label="Đang hoạt động" value={activeCount} icon={ICON_ACTIVE} accent="jade" hint="chưa thu hồi" />
        <KpiCard
          label="Đã thu hồi"
          value={revokedCount}
          icon={ICON_REVOKED}
          accent={revokedCount > 0 ? 'warn' : 'jade'}
          hint="revoked"
        />
        <KpiCard label="Tạo tuần này" value={newThisWeek} icon={ICON_NEW} accent="purple" hint="7 ngày qua" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>
            Chỉ đọc. Token không thể hiện lại (đã hash) — tạo key mới qua backend nếu cần.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được danh sách key.'}
                onRetry={onRefresh}
              />
            </div>
          )}

          <AdminTable<VaultEntry>
            rows={rows}
            columns={columns}
            loading={isLoading}
            caption="Danh sách admin API keys"
            empty={
              <EmptyState
                title="Chưa có key"
                description="Chưa có admin API key nào. Tạo qua backend hoặc /connect."
                className="border-0 bg-transparent"
              />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
