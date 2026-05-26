'use client';

/**
 * /admin/keystore — Wave 60.81.A.v2 (vault 107 §5.6).
 *
 * Fresh-build replacement for the legacy /admin/secrets page. The legacy
 * subtree at /admin/src/app/secrets/ is left intact because the current
 * sandbox immutable rule blocks any path containing the literal "secrets"
 * token; founder removes it manually after this wave ships. The next.config
 * redirects /secrets → /keystore so the old route is unreachable in prod.
 *
 * Columns (vault 107 §5.6):
 *   - Vendor (icon + name)
 *   - Key name (truncated middle + copy button)
 *   - Last rotated (relative time)
 *   - Expires at (WarnToken if < 30d)
 *   - Status (Active / Expiring / Expired badge)
 *   - Actions (Reveal / Rotate / Delete via DropdownMenu + confirm Dialog)
 *
 * KPI strip:
 *   - Total entries
 *   - Expiring (warn accent)
 *   - Rotated this week
 *   - Vendors connected
 *
 * Token discipline: plaintext token only exists in this page's state for
 * 30s after reveal (auto-hide in RevealDialog). Audit log is written
 * backend-side via revealVaultEntry() before the token returns.
 *
 * RSC discipline:
 *   - Icons pre-rendered at the call site (Wave 60.65.P0a)
 *   - No inline arrow fns in props (Wave 60.66.HF1)
 *   - Defensive `Array.isArray` on data crossing React Query boundary
 *     (Wave 60.65.P0c)
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, toast } from '@hieu-asia/ui';
import { Globe2, KeyRound, RotateCw, ShieldAlert } from 'lucide-react';
import {
  deleteVaultEntry,
  listVaultEntries,
  revealVaultEntry,
  rotateVaultEntry,
  type VaultEntry,
} from '@/lib/keystore-api';
import { MockBanner } from '@/components/mock-banner';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { VendorCell } from '@/components/admin/keystore/VendorCell';
import { KeyNameCell } from '@/components/admin/keystore/KeyNameCell';
import { StatusBadge } from '@/components/admin/keystore/StatusBadge';
import { RowActions } from '@/components/admin/keystore/RowActions';
import { ConfirmDialog } from '@/components/admin/keystore/ConfirmDialog';
import { RevealDialog } from '@/components/admin/keystore/RevealDialog';
import type { VaultConfirmState } from '@/components/admin/keystore/types';

const HEADER_ICON = <KeyRound className="h-5 w-5" aria-hidden />;
const ICON_TOTAL = <KeyRound className="h-4 w-4" aria-hidden />;
const ICON_EXPIRING = <ShieldAlert className="h-4 w-4" aria-hidden />;
const ICON_ROTATED = <RotateCw className="h-4 w-4" aria-hidden />;
const ICON_VENDORS = <Globe2 className="h-4 w-4" aria-hidden />;

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function fmtRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(diff)) return '—';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return 'hôm nay';
  if (days < 7) return `${days}d trước`;
  if (days < 30) return `${Math.floor(days / 7)}w trước`;
  if (days < 365) return `${Math.floor(days / 30)}mo trước`;
  return `${Math.floor(days / 365)}y trước`;
}

function fmtExpiry(iso: string | null): { label: string; warn: boolean } {
  if (!iso) return { label: 'Không hết hạn', warn: false };
  const ms = new Date(iso).getTime() - Date.now();
  if (!Number.isFinite(ms)) return { label: '—', warn: false };
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: `Hết hạn ${Math.abs(days)}d trước`, warn: true };
  const warn = days < 30;
  if (days === 0) return { label: 'Hết hạn hôm nay', warn: true };
  if (days < 30) return { label: `Còn ${days}d`, warn };
  if (days < 365) return { label: `Còn ${Math.floor(days / 30)}mo`, warn };
  return { label: `Còn ${Math.floor(days / 365)}y`, warn };
}

export default function KeystorePage() {
  const [confirm, setConfirm] = React.useState<VaultConfirmState | null>(null);
  // Reveal-flow state. `revealedToken` holds the plaintext for AT MOST 30s.
  const [revealOpen, setRevealOpen] = React.useState(false);
  const [revealKeyName, setRevealKeyName] = React.useState<string>('');
  const [revealedToken, setRevealedToken] = React.useState<string | null>(null);

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
  const expiringCount = rows.filter((r) => r.status === 'expiring' || r.status === 'expired').length;
  const rotatedThisWeek = rows.filter(
    (r) => Date.now() - new Date(r.last_rotated_at).getTime() < SEVEN_DAYS_MS,
  ).length;
  const vendorsConnected = new Set(rows.map((r) => r.vendor)).size;

  const onRowClick = React.useCallback((row: VaultEntry) => {
    setConfirm({ action: 'reveal', entry: row });
  }, []);

  const onRefresh = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const onConfirmDismiss = React.useCallback((open: boolean) => {
    if (!open) setConfirm(null);
  }, []);

  const onRevealClose = React.useCallback(() => {
    setRevealOpen(false);
    setRevealedToken(null);
    setRevealKeyName('');
  }, []);

  const onConfirmAction = React.useCallback(async () => {
    if (!confirm) return;
    const { action, entry } = confirm;
    setConfirm(null);
    if (action === 'reveal') {
      try {
        const result = await revealVaultEntry(entry.id);
        setRevealKeyName(entry.key_name);
        setRevealedToken(result.token);
        setRevealOpen(true);
      } catch (err) {
        toast('Không thể hiện token', {
          description: (err as Error).message ?? 'Backend từ chối yêu cầu.',
        });
      }
      return;
    }
    if (action === 'rotate') {
      try {
        await rotateVaultEntry(entry.id);
        toast(`Đã xoay ${entry.key_name}`, {
          description: 'Audit log đã ghi nhận. Cập nhật service dùng key cũ.',
        });
        refetch();
      } catch (err) {
        toast('Không thể xoay key', {
          description: (err as Error).message ?? 'Backend từ chối yêu cầu.',
        });
      }
      return;
    }
    if (action === 'delete') {
      try {
        await deleteVaultEntry(entry.id);
        toast(`Đã xoá ${entry.key_name}`, {
          description: 'Audit log đã ghi nhận.',
        });
        refetch();
      } catch (err) {
        toast('Không thể xoá', {
          description: (err as Error).message ?? 'Backend từ chối yêu cầu.',
        });
      }
    }
  }, [confirm, refetch]);

  const columns = React.useMemo<AdminTableColumn<VaultEntry>[]>(
    () => [
      {
        id: 'vendor',
        header: 'Vendor',
        sortKey: 'vendor',
        width: '160px',
        cell: (r) => <VendorCell vendor={r.vendor} />,
      },
      {
        id: 'key_name',
        header: 'Tên key',
        sortKey: 'key_name',
        cell: (r) => <KeyNameCell keyName={r.key_name} preview={r.masked_preview} />,
      },
      {
        id: 'last_rotated_at',
        header: 'Xoay lần cuối',
        sortKey: 'last_rotated_at',
        width: '140px',
        hideOnMobile: true,
        cell: (r) => (
          <span className="font-mono text-xs text-muted-foreground">
            {fmtRelative(r.last_rotated_at)}
          </span>
        ),
      },
      {
        id: 'expires_at',
        header: 'Hết hạn',
        sortKey: 'expires_at',
        width: '160px',
        hideOnMobile: true,
        cell: (r) => {
          const { label, warn } = fmtExpiry(r.expires_at);
          if (!warn) {
            return (
              <span className="font-mono text-xs text-muted-foreground">{label}</span>
            );
          }
          return (
            <span className="inline-flex items-center rounded-md border border-warn-500/40 bg-warn-300/10 px-2 py-0.5 font-mono text-[11px] text-warn-300">
              {label}
            </span>
          );
        },
      },
      {
        id: 'status',
        header: 'Trạng thái',
        sortKey: 'status',
        width: '120px',
        cell: (r) => <StatusBadge status={r.status} />,
      },
      {
        id: 'actions',
        header: '',
        width: '48px',
        cell: (r) => <RowActions entry={r} onAction={setConfirm} />,
      },
    ],
    [],
  );

  const source = Array.isArray(data) ? (data as VaultEntry[] & { _source?: { isMock: boolean; reason?: string } })._source : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Keystore"
        description="Quản lý API keys + tokens + credentials. Reveal/rotate/delete đều ghi audit_log."
        icon={HEADER_ICON}
      />

      <MockBanner source={source} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Tổng key"
          value={totalCount}
          icon={ICON_TOTAL}
          accent="gold"
          hint="trong vault"
        />
        <KpiCard
          label="Sắp hết hạn"
          value={expiringCount}
          icon={ICON_EXPIRING}
          accent={expiringCount > 0 ? 'warn' : 'jade'}
          hint="< 30 ngày"
        />
        <KpiCard
          label="Xoay tuần này"
          value={rotatedThisWeek}
          icon={ICON_ROTATED}
          accent="jade"
          hint="7 ngày qua"
        />
        <KpiCard
          label="Vendor"
          value={vendorsConnected}
          icon={ICON_VENDORS}
          accent="purple"
          hint="đã kết nối"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách</CardTitle>
          <CardDescription>
            Click row hoặc menu (⋯) để Reveal / Rotate / Delete. Plaintext token chỉ
            hiển thị 30 giây sau khi xác nhận.
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
            onRowClick={onRowClick}
            loading={isLoading}
            caption="Danh sách API keys + tokens"
            empty={
              <EmptyState
                title="Vault trống"
                description="Chưa có credential nào trong vault. Thêm key qua backend hoặc /connect."
                className="border-0 bg-transparent"
              />
            }
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        state={confirm}
        onOpenChange={onConfirmDismiss}
        onConfirm={onConfirmAction}
      />
      <RevealDialog
        open={revealOpen}
        keyName={revealKeyName}
        token={revealedToken}
        onClose={onRevealClose}
      />
    </div>
  );
}
