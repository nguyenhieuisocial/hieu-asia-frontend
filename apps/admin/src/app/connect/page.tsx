'use client';

/**
 * /admin/connect — Wave 60.81.D rebuild (vault 107 §5.7).
 *
 * Tier 2 substitute for the blocked /secrets work. Original page was a
 * 555-LOC single-file mess mixing AI provider cards + service health checks
 * + inline OAuth code-paste UI. Splits into:
 *
 *   ├─ This file (~180 LOC: queries, KPI strip, ProductTabs orchestration)
 *   ├─ <AdminTable> primitive (Wave 60.71.T2.customers extract)
 *   ├─ <ProviderRowActions> DropdownMenu (Wave 60.68)
 *   ├─ <ConnectProviderDialog> + <DisconnectDialog> + <ScopesDialog>
 *   ├─ <OAuthAuditTab> + <WebhooksTab> (data-fed)
 *   └─ types.ts (PROVIDER_CATALOGUE + ConnectAction union)
 *
 * RSC discipline:
 *   - Pre-rendered Lucide icons at module scope (Wave 60.65.P0a)
 *   - No inline arrow fns in props (Wave 60.66.HF1)
 *   - Defensive `Array.isArray` on async data (Wave 60.65.P0c)
 *
 * Mutation flow:
 *   - Connect new → ConnectProviderDialog → POST oauth/[vendor]/start
 *   - Disconnect → DisconnectDialog → DELETE keys/[vendor] → audit_log
 *   - Reauth → reuses Connect flow with `initial` set
 *   - View scopes → ScopesDialog (read-only)
 */

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import {
  AlertOctagon,
  CheckCircle2,
  Plug,
  PlugZap,
  Wrench,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { EmptyState } from '@/components/admin/empty-state';
import { ErrorBlock } from '@/components/admin/error-block';
import { KpiCard } from '@/components/admin/kpi-card';
import { ProductTabs, type ProductTab } from '@/components/admin/product-tabs';
import {
  AdminTable,
  type AdminTableColumn,
} from '@/components/admin/table/AdminTable';
import { ProviderRowActions } from '@/components/admin/connect/ProviderRowActions';
import { ConnectProviderDialog } from '@/components/admin/connect/ConnectProviderDialog';
import { DisconnectDialog } from '@/components/admin/connect/DisconnectDialog';
import { ScopesDialog } from '@/components/admin/connect/ScopesDialog';
import { OAuthAuditTab } from '@/components/admin/connect/OAuthAuditTab';
import { WebhooksTab } from '@/components/admin/connect/WebhooksTab';
import {
  PROVIDER_CATALOGUE,
  type ConnectAction,
  type ProviderCatalogueEntry,
  type ProviderRow,
} from '@/components/admin/connect/types';
import { Button } from '@hieu-asia/ui';

const TAB_PROVIDERS = 'providers';
const TAB_AUDIT = 'audit';
const TAB_WEBHOOKS = 'webhooks';

const ICON_CONNECTED = <CheckCircle2 className="h-4 w-4" aria-hidden />;
const ICON_INACTIVE = <Wrench className="h-4 w-4" aria-hidden />;
const ICON_FAILED = <AlertOctagon className="h-4 w-4" aria-hidden />;
const ICON_PLUG = <Plug className="h-4 w-4" aria-hidden />;

interface ProvidersResp {
  ok?: boolean;
  rows?: ProviderRow[];
  /** Legacy shape returned by /api/admin/integrations/providers — flat map. */
  providers?: Record<string, { api_key?: boolean; oauth?: boolean }>;
  default_models?: Record<string, string>;
  error?: string;
}

async function fetchProviders(): Promise<ProvidersResp> {
  const r = await fetch('/api/admin/integrations/providers', {
    cache: 'no-store',
  });
  const text = await r.text();
  try {
    return JSON.parse(text) as ProvidersResp;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${r.status})` };
  }
}

/**
 * Merge the worker `providers` map into a full row list seeded from the
 * static catalogue. Catalogue entries missing from the response surface as
 * `disconnected` so admins can click "Kết nối" without backend bootstrap.
 */
function mergeRows(resp: ProvidersResp | undefined): ProviderRow[] {
  // Worker returns the new shape (`rows`) once /admin/integrations/providers
  // is upgraded; until then the legacy `providers` map is reshaped here.
  if (Array.isArray(resp?.rows)) return resp.rows;
  const map = resp?.providers ?? {};
  return PROVIDER_CATALOGUE.map((cat): ProviderRow => {
    const st = map[cat.id];
    const connected = !!(st?.api_key || st?.oauth);
    return {
      id: cat.id,
      name: cat.name,
      category: cat.category,
      status: cat.category === 'native' ? 'connected' : connected ? 'connected' : 'disconnected',
      scopes: cat.scopes,
      hint: cat.hint,
      docUrl: cat.docUrl,
      oauth: cat.oauth,
    };
  });
}

function fmtDateShort(s: string | null | undefined): string {
  if (!s) return '—';
  try {
    return new Date(s).toLocaleDateString('vi-VN');
  } catch {
    return s;
  }
}

function daysSince(s: string | null | undefined): number | null {
  if (!s) return null;
  const t = new Date(s).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / (24 * 3600 * 1000));
}

export default function ConnectPage() {
  const router = useRouter();
  const search = useSearchParams();
  const initialTab = search?.get('tab') ?? TAB_PROVIDERS;
  const [tab, setTab] = React.useState(initialTab);
  const [connectState, setConnectState] = React.useState<{
    open: boolean;
    initial: ProviderCatalogueEntry | null;
  }>({ open: false, initial: null });
  const [disconnectRow, setDisconnectRow] = React.useState<ProviderRow | null>(
    null,
  );
  const [scopesRow, setScopesRow] = React.useState<ProviderRow | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'connect', 'providers'],
    queryFn: fetchProviders,
  });

  const rows = React.useMemo(() => mergeRows(data), [data]);

  const connectedIds = React.useMemo(
    () => new Set(rows.filter((r) => r.status === 'connected').map((r) => r.id)),
    [rows],
  );

  const kpi = React.useMemo(() => {
    const total = rows.filter((r) => r.status === 'connected').length;
    const inactive = rows.filter((r) => {
      if (r.status !== 'connected') return false;
      const d = daysSince(r.last_used);
      return d != null && d > 30;
    }).length;
    const failed = rows.reduce((acc, r) => acc + (r.failures_24h ?? 0), 0);
    const available = PROVIDER_CATALOGUE.filter((p) => p.category !== 'native')
      .length;
    return { total, inactive, failed, available };
  }, [rows]);

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;

  const handleAction = React.useCallback(
    (action: ConnectAction) => {
      switch (action.kind) {
        case 'connect':
          setConnectState({ open: true, initial: action.provider });
          break;
        case 'reauth': {
          const entry = PROVIDER_CATALOGUE.find((p) => p.id === action.row.id);
          if (entry) setConnectState({ open: true, initial: entry });
          break;
        }
        case 'disconnect':
          setDisconnectRow(action.row);
          break;
        case 'scopes':
          setScopesRow(action.row);
          break;
      }
    },
    [],
  );

  const handleOpenConnect = React.useCallback(() => {
    setConnectState({ open: true, initial: null });
  }, []);

  const handleConnectOpenChange = React.useCallback((open: boolean) => {
    setConnectState((prev) => ({ open, initial: open ? prev.initial : null }));
  }, []);

  const handleDisconnectOpenChange = React.useCallback((open: boolean) => {
    if (!open) setDisconnectRow(null);
  }, []);

  const handleScopesOpenChange = React.useCallback((open: boolean) => {
    if (!open) setScopesRow(null);
  }, []);

  const handleRetry = React.useCallback(() => {
    refetch();
  }, [refetch]);

  const handleTabChange = React.useCallback(
    (id: string) => {
      setTab(id);
      const next = new URLSearchParams(search?.toString() ?? '');
      if (id === TAB_PROVIDERS) next.delete('tab');
      else next.set('tab', id);
      const qs = next.toString();
      router.replace(qs ? `/connect?${qs}` : '/connect', { scroll: false });
    },
    [router, search],
  );

  const columns = React.useMemo<AdminTableColumn<ProviderRow>[]>(
    () => [
      {
        id: 'name',
        header: 'Provider',
        sortKey: 'name',
        cell: (r) => (
          <div className="min-w-0">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span
                className={
                  r.status === 'connected'
                    ? 'h-2 w-2 shrink-0 rounded-full bg-jade'
                    : r.status === 'failed'
                      ? 'h-2 w-2 shrink-0 rounded-full bg-red-400'
                      : 'h-2 w-2 shrink-0 rounded-full bg-muted/40'
                }
                aria-hidden
              />
              <span className="truncate">{r.name}</span>
            </div>
            <div className="mt-0.5 truncate text-xs text-muted-foreground">
              {r.hint ?? '—'}
            </div>
          </div>
        ),
      },
      {
        id: 'category',
        header: 'Loại',
        sortKey: 'category',
        width: '110px',
        hideOnMobile: true,
        cell: (r) => (
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {r.category}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        sortKey: 'status',
        width: '120px',
        cell: (r) => {
          if (r.status === 'connected') {
            return (
              <span className="inline-flex items-center gap-1 rounded border border-jade/30 bg-jade/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-jade-50">
                connected
              </span>
            );
          }
          if (r.status === 'failed') {
            return (
              <span className="inline-flex items-center gap-1 rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-red-200">
                failed
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1 rounded border border-muted/40 bg-muted/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              disconnected
            </span>
          );
        },
      },
      {
        id: 'connected_by',
        header: 'Connected by',
        width: '160px',
        hideOnMobile: true,
        cell: (r) => (
          <span className="font-mono text-xs text-muted-foreground">
            {r.connected_by ?? '—'}
          </span>
        ),
      },
      {
        id: 'last_used',
        header: 'Last used',
        sortKey: 'last_used',
        width: '120px',
        hideOnMobile: true,
        cell: (r) => (
          <span className="font-mono text-xs text-muted-foreground">
            {fmtDateShort(r.last_used)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        width: '48px',
        cell: (r) => <ProviderRowActions row={r} onAction={handleAction} />,
      },
    ],
    [handleAction],
  );

  const providersContent = (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách provider</CardTitle>
        <CardDescription>
          {rows.length} vendor — click <code className="font-mono text-foreground/85">Hành động</code>{' '}
          để connect, reauth hoặc xem scope.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showError && (
          <div className="mb-4">
            <ErrorBlock
              compact
              message={errorMsg ?? 'Không tải được danh sách provider.'}
              onRetry={handleRetry}
            />
          </div>
        )}
        <AdminTable<ProviderRow>
          rows={rows}
          columns={columns}
          loading={isLoading}
          caption="Danh sách provider"
          empty={
            <EmptyState
              title="Chưa có provider nào trong catalogue"
              description="Vault 107 §5.7: PROVIDER_CATALOGUE seed missing — verify build."
              className="border-0 bg-transparent"
            />
          }
        />
      </CardContent>
    </Card>
  );

  const tabs: ProductTab[] = [
    {
      id: TAB_PROVIDERS,
      label: 'Providers',
      icon: <Plug className="h-3.5 w-3.5" aria-hidden />,
      content: providersContent,
    },
    {
      id: TAB_AUDIT,
      label: 'OAuth audit',
      icon: <PlugZap className="h-3.5 w-3.5" aria-hidden />,
      content: <OAuthAuditTab />,
    },
    {
      id: TAB_WEBHOOKS,
      label: 'Webhooks',
      icon: <Wrench className="h-3.5 w-3.5" aria-hidden />,
      content: <WebhooksTab />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kết nối"
        description="OAuth + API-key wire-up cho vendor AI và service tích hợp. Audit log + webhook deliveries ở tab kế."
        icon={<Plug className="h-5 w-5" aria-hidden />}
        actions={
          <Button onClick={handleOpenConnect} size="sm">
            {ICON_PLUG}
            <span className="ml-1.5">Kết nối mới</span>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Đã kết nối"
          value={kpi.total}
          icon={ICON_CONNECTED}
          accent="jade"
          hint={`/ ${kpi.available} khả dụng`}
        />
        <KpiCard
          label="Inactive >30d"
          value={kpi.inactive}
          icon={ICON_INACTIVE}
          accent="purple"
          hint="cần kiểm tra"
        />
        <KpiCard
          label="Failed 24h"
          value={kpi.failed}
          icon={ICON_FAILED}
          accent="red"
          hint="OAuth + webhook"
        />
        <KpiCard
          label="Catalogue"
          value={kpi.available}
          icon={ICON_PLUG}
          accent="gold"
          hint="vendor sẵn sàng"
        />
      </div>

      <ProductTabs tabs={tabs} value={tab} onValueChange={handleTabChange} />

      <ConnectProviderDialog
        open={connectState.open}
        initial={connectState.initial}
        connectedIds={connectedIds}
        onOpenChange={handleConnectOpenChange}
        onConnected={refetch}
      />
      <DisconnectDialog
        row={disconnectRow}
        onOpenChange={handleDisconnectOpenChange}
        onConfirmed={refetch}
      />
      <ScopesDialog row={scopesRow} onOpenChange={handleScopesOpenChange} />
    </div>
  );
}
