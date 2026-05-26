'use client';

/**
 * Wave 60.81.D — OAuth audit log tab for /connect.
 *
 * Queries audit_log filtered to integrations/oauth.* actions. Compact
 * variant — full audit detail still lives at /audit.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/table/AdminTable';

interface AuditRow {
  id: number;
  timestamp: string;
  user_id: string | null;
  action: string;
  resource_id: string | null;
  audit_metadata: Record<string, unknown> | null;
  actor_type: string | null;
}

interface AuditResp {
  ok?: boolean;
  rows?: AuditRow[];
  error?: string;
  note?: string;
}

async function fetchOAuthAudit(): Promise<AuditResp> {
  const r = await fetch(
    '/api/admin/audit-log?action_like=integrations.&limit=50',
    { cache: 'no-store' },
  );
  const text = await r.text();
  try {
    return JSON.parse(text) as AuditResp;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

const COLUMNS: AdminTableColumn<AuditRow>[] = [
  {
    id: 'timestamp',
    header: 'Khi',
    sortKey: 'timestamp',
    width: '180px',
    cell: (r) => (
      <span className="font-mono text-xs text-muted-foreground">
        {r.timestamp}
      </span>
    ),
  },
  {
    id: 'actor',
    header: 'Admin',
    width: '180px',
    hideOnMobile: true,
    cell: (r) => (
      <span className="font-mono text-xs">{r.user_id ?? '—'}</span>
    ),
  },
  {
    id: 'action',
    header: 'Action',
    sortKey: 'action',
    cell: (r) => <span className="text-foreground/85">{r.action}</span>,
  },
  {
    id: 'resource',
    header: 'Resource',
    width: '160px',
    hideOnMobile: true,
    cell: (r) => (
      <span className="font-mono text-xs text-muted-foreground">
        {r.resource_id ?? '—'}
      </span>
    ),
  },
];

export function OAuthAuditTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'connect', 'oauth-audit'],
    queryFn: fetchOAuthAudit,
  });

  const rows = React.useMemo(
    () => (Array.isArray(data?.rows) ? data.rows : []),
    [data?.rows],
  );

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  const onRetry = React.useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>OAuth audit log</CardTitle>
        <CardDescription>
          50 lượt connect / disconnect / reauth gần nhất.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showError && (
          <div className="mb-4">
            <ErrorBlock
              compact
              message={errorMsg ?? 'Không tải được audit log.'}
              onRetry={onRetry}
            />
          </div>
        )}
        <AdminTable<AuditRow>
          rows={rows}
          columns={COLUMNS}
          loading={isLoading}
          caption="OAuth audit log"
          getRowId={(r) => String(r.id)}
          empty={
            <EmptyState
              title="Chưa có sự kiện OAuth"
              description="Khi admin connect/disconnect provider, log sẽ hiện ở đây."
              className="border-0 bg-transparent"
            />
          }
        />
      </CardContent>
    </Card>
  );
}
