'use client';

/**
 * Wave 60.81.D — API keys tab for /settings.
 *
 * AdminTable consumer + Generate + Revoke Dialogs. Mirrors the customers
 * page pattern (Wave 60.71.T2.customers). Worker-side endpoint:
 *
 *   GET    /api/admin/api-keys
 *   POST   /api/admin/api-keys          (returns plaintext key ONCE)
 *   DELETE /api/admin/api-keys/[id]
 *
 * audit_log is written by the gateway on POST + DELETE.
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
import { KeyRound, Plus } from 'lucide-react';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/table/AdminTable';
import { ApiKeyRowActions } from './ApiKeyRowActions';
import { GenerateApiKeyDialog } from './GenerateApiKeyDialog';
import { RevokeKeyDialog } from './RevokeKeyDialog';
import type { AdminApiKey } from './types';

const ICON_PLUS = <Plus className="h-3.5 w-3.5" aria-hidden />;
const ICON_KEY = <KeyRound className="h-10 w-10 text-gold/60" aria-hidden />;

interface ApiKeysResp {
  ok?: boolean;
  api_keys?: AdminApiKey[];
  error?: string;
  note?: string;
}

async function fetchApiKeys(): Promise<ApiKeysResp> {
  const r = await fetch('/api/admin/api-keys', { cache: 'no-store' });
  if (r.status === 404) {
    return {
      ok: false,
      note: 'API keys endpoint chưa wire ở worker — UI sẵn sàng nhận data khi backend land.',
    };
  }
  const text = await r.text();
  try {
    return JSON.parse(text) as ApiKeysResp;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

function fmtDate(s: string | null | undefined): string {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('vi-VN');
  } catch {
    return s;
  }
}

export function ApiKeysTab() {
  const [genOpen, setGenOpen] = React.useState(false);
  const [revokeKey, setRevokeKey] = React.useState<AdminApiKey | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'settings', 'api-keys'],
    queryFn: fetchApiKeys,
  });

  // Defensive Array.isArray — guards against drift in {error:'...'} shapes.
  const apiKeys = React.useMemo(
    () => (Array.isArray(data?.api_keys) ? data.api_keys : []),
    [data?.api_keys],
  );

  const showError = !!error || (data?.ok === false && !data?.note);
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  const handleOpenGen = React.useCallback(() => setGenOpen(true), []);
  const handleGenChange = React.useCallback(
    (open: boolean) => setGenOpen(open),
    [],
  );

  const handleRevoke = React.useCallback((k: AdminApiKey) => {
    setRevokeKey(k);
  }, []);

  const handleRevokeChange = React.useCallback((open: boolean) => {
    if (!open) setRevokeKey(null);
  }, []);

  const handleRetry = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const columns = React.useMemo<AdminTableColumn<AdminApiKey>[]>(
    () => [
      {
        id: 'name',
        header: 'Tên',
        sortKey: 'name',
        cell: (k) => (
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">{k.name}</div>
            <div className="truncate font-mono text-xs text-muted-foreground">
              {k.prefix}…
            </div>
          </div>
        ),
      },
      {
        id: 'scopes',
        header: 'Scopes',
        cell: (k) => (
          <span className="font-mono text-xs text-muted-foreground">
            {k.scopes.length === 0 ? '—' : k.scopes.join(', ')}
          </span>
        ),
        hideOnMobile: true,
      },
      {
        id: 'last_used',
        header: 'Lần dùng cuối',
        sortKey: 'last_used_at',
        width: '140px',
        hideOnMobile: true,
        cell: (k) => (
          <span className="font-mono text-xs text-muted-foreground">
            {fmtDate(k.last_used_at)}
          </span>
        ),
      },
      {
        id: 'expires',
        header: 'Hết hạn',
        sortKey: 'expires_at',
        width: '120px',
        hideOnMobile: true,
        cell: (k) => (
          <span className="font-mono text-xs text-muted-foreground">
            {k.expires_at ? fmtDate(k.expires_at) : 'Không'}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        width: '100px',
        cell: (k) => {
          if (k.revoked_at) {
            return (
              <span className="inline-flex rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-red-200">
                revoked
              </span>
            );
          }
          if (k.expires_at && new Date(k.expires_at).getTime() < Date.now()) {
            return (
              <span className="inline-flex rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-200">
                expired
              </span>
            );
          }
          return (
            <span className="inline-flex rounded border border-jade/30 bg-jade/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-jade-50">
              active
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        width: '48px',
        cell: (k) => <ApiKeyRowActions apiKey={k} onRevoke={handleRevoke} />,
      },
    ],
    [handleRevoke],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle>Admin API keys</CardTitle>
            <CardDescription>
              Key dùng để CI/CD hoặc service backend gọi admin API. audit_log
              ghi mọi mutation.
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleOpenGen} className="shrink-0">
            {ICON_PLUS}
            <span className="ml-1.5">Tạo key mới</span>
          </Button>
        </CardHeader>
        <CardContent>
          {showError && (
            <div className="mb-4">
              <ErrorBlock
                compact
                message={errorMsg ?? 'Không tải được API keys.'}
                onRetry={handleRetry}
              />
            </div>
          )}
          {data?.note && !showError && (
            <div className="mb-4 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-muted-foreground">
              {data.note}
            </div>
          )}
          <AdminTable<AdminApiKey>
            rows={apiKeys}
            columns={columns}
            loading={isLoading}
            caption="Admin API keys"
            empty={
              <EmptyState
                title="Chưa có API key nào"
                description="Tạo key đầu tiên để CI/CD hoặc bot có thể gọi admin API."
                illustration={ICON_KEY}
                className="border-0 bg-transparent"
              />
            }
          />
        </CardContent>
      </Card>

      <GenerateApiKeyDialog
        open={genOpen}
        onOpenChange={handleGenChange}
        onCreated={refetch}
      />
      <RevokeKeyDialog
        apiKey={revokeKey}
        onOpenChange={handleRevokeChange}
        onRevoked={refetch}
      />
    </div>
  );
}
