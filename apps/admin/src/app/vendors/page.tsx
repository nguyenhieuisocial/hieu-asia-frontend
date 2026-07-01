'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@hieu-asia/ui';
import { Cpu, CheckCircle2, AlertCircle, Activity, Zap, BarChart2, Info } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { ErrorBlock } from '@/components/admin/error-block';
import { EmptyState } from '@/components/admin/empty-state';
import { getVendorTelemetry, type VendorTelemetryRow } from '@/lib/llm-spend-api';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';

type Vendor = 'anthropic' | 'openai' | 'google' | 'cloudflare';
type Role = 'vision' | 'logic' | 'psychology' | 'alignment' | 'report' | 'mentor' | 'judge';

interface ProviderRow {
  vendor: Vendor;
  api_key: boolean;
  oauth: boolean;
  model: string;
  last_used: string | null;
  requests_7d: number;
  fallback_count_7d: number;
  latency_p50_ms: number;
  latency_p95_ms: number;
}

interface RoleRoute {
  primary: Vendor;
  fallbacks: Vendor[];
}

interface VendorsResponse {
  ok: boolean;
  providers?: ProviderRow[];
  default_models?: Record<Vendor, string>;
  role_routing?: Record<Role, RoleRoute>;
  sources?: { langfuse: boolean };
  error?: string;
}

const VENDOR_LABEL: Record<Vendor, string> = {
  anthropic: 'Anthropic Claude',
  openai: 'OpenAI GPT',
  google: 'Google Gemini',
  cloudflare: 'Cloudflare Workers AI',
};

const ROLE_LABEL: Record<Role, string> = {
  vision: 'vision',
  logic: 'logic',
  psychology: 'psychology',
  alignment: 'alignment',
  report: 'report',
  mentor: 'mentor',
  judge: 'judge',
};

interface LangfuseTrace {
  id: string;
  name: string | null;
  timestamp: string | null;
  latency_ms: number | null;
  total_cost: number | null;
  observation_count: number | null;
}

interface LangfuseTracesResponse {
  ok: boolean;
  configured?: boolean;
  host?: string;
  total_items?: number;
  traces?: LangfuseTrace[];
  error?: string;
}

async function fetchLangfuseTraces(): Promise<LangfuseTracesResponse> {
  const res = await fetch('/api/admin-proxy/admin/langfuse/traces?limit=20', { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as LangfuseTracesResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

async function fetchVendors(): Promise<VendorsResponse> {
  const res = await fetch('/api/admin/vendors', { cache: 'no-store' });
  const text = await res.text();
  try {
    return JSON.parse(text) as VendorsResponse;
  } catch {
    return { ok: false, error: `Invalid JSON (status ${res.status})` };
  }
}

// Wave 60.81.B Tier 3 polish — replace raw emerald/red Tailwind defaults with
// brand-aligned jade (active) and shared red ramp (not-connected). Dot color
// + textual label both stay in one record so callers can render either.
function statusOf(p: ProviderRow): { color: string; label: string } {
  if (p.vendor === 'cloudflare')
    return { color: 'bg-jade-300', label: 'active (free tier)' };
  const hasCred = p.api_key || p.oauth;
  if (!hasCred) return { color: 'bg-red-400', label: 'chưa kết nối' };
  return { color: 'bg-jade-300', label: 'active' };
}

function VendorCard({ p, telem }: { p: ProviderRow; telem?: VendorTelemetryRow }) {
  const status = statusOf(p);
  const mode = p.oauth ? 'OAuth' : p.api_key ? 'API key' : p.vendor === 'cloudflare' ? 'Native' : '—';
  const [testing, setTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{ ok: boolean; msg: string } | null>(null);

  // #37: this does NOT make a live test call — it re-reads /admin/vendors and
  // reports whether credentials are configured. Named accordingly to avoid
  // implying a real round-trip to the vendor.
  const checkKeyConfig = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const r = await fetch('/api/admin/vendors', { cache: 'no-store' });
      const d = await r.json();
      if (d.ok) {
        const refreshed = (d.providers as ProviderRow[]).find(x => x.vendor === p.vendor);
        if (refreshed && (refreshed.api_key || refreshed.oauth) || p.vendor === 'cloudflare') {
          setTestResult({ ok: true, msg: 'Đã có khoá/credentials — sẵn sàng route.' });
        } else {
          setTestResult({ ok: false, msg: 'Chưa có credentials.' });
        }
      } else {
        setTestResult({ ok: false, msg: d.error ?? 'Lỗi' });
      }
    } catch (e) {
      setTestResult({ ok: false, msg: (e as Error).message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className={`inline-block h-2 w-2 rounded-full ${status.color}`} />
              {VENDOR_LABEL[p.vendor]}
            </CardTitle>
            <CardDescription className="mt-1 font-mono text-xs">{p.model}</CardDescription>
          </div>
          <span className="rounded border border-gold/20 bg-gold/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {mode}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">{status.label}</div>

        {/* Telemetry 7d gom từ llm_traces theo vendor (GET /admin/ai/vendor-telemetry).
            Rơi về "chưa đo" khi vendor chưa có trace nào trong cửa sổ. */}
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <dt className="text-muted-foreground">Requests 7d</dt>
          <dd className={telem ? 'font-mono text-foreground/85' : 'text-muted-foreground/70'}>
            {telem ? telem.requests.toLocaleString('vi-VN') : 'chưa đo'}
          </dd>
          <dt className="text-muted-foreground">Lỗi 7d</dt>
          <dd className={telem ? errorRateClass(telem.error_rate_pct) : 'text-muted-foreground/70'}>
            {telem
              ? `${telem.errors.toLocaleString('vi-VN')} (${telem.error_rate_pct.toFixed(1)}%)`
              : 'chưa đo'}
          </dd>
          <dt className="text-muted-foreground">TB / p95</dt>
          <dd className={telem ? 'font-mono text-foreground/85' : 'text-muted-foreground/70'}>
            {telem ? `${telem.latency_avg_ms} / ${telem.latency_p95_ms} ms` : 'chưa đo'}
          </dd>
          <dt className="text-muted-foreground">Last used</dt>
          <dd className="font-mono text-[11px] text-muted-foreground">
            {telem?.last_used_at
              ? new Date(telem.last_used_at).toLocaleString('vi-VN')
              : p.last_used ?? 'chưa đo'}
          </dd>
        </dl>

        {testResult && (
          <div
            className={`rounded border px-2 py-1 text-xs transition-all duration-300 ease-editorial ${
              testResult.ok
                ? 'border-jade/40 bg-jade/10 text-jade-700 dark:text-jade-300'
                : 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300'
            }`}
          >
            {testResult.msg}
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={checkKeyConfig}
            disabled={testing}
            className="rounded border border-gold/30 px-2.5 py-1 text-xs text-gold transition-all duration-300 ease-editorial hover:bg-gold/10 disabled:opacity-50"
          >
            {testing ? 'Đang kiểm tra…' : 'Kiểm tra cấu hình khoá'}
          </button>
          {p.vendor !== 'cloudflare' && (
            <Link
              href="/connect"
              className="rounded border border-border px-2.5 py-1 text-xs text-foreground/85 transition-all duration-300 ease-editorial hover:bg-muted/30"
            >
              Reconfigure
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Per-vendor telemetry table — số THẬT từ llm_traces (gom theo cột `vendor`).
// Thay cho các ô "chưa đo" cũ. Data: GET /admin/ai/vendor-telemetry?days=N.
// ---------------------------------------------------------------------------

/** Tỉ lệ lỗi vượt mốc này → tô đỏ (vendor có vấn đề). */
const ERROR_RED_PCT = 5;

// Nhãn thân thiện cho các vendor đã biết; vendor lạ giữ nguyên chuỗi.
const TELEMETRY_VENDOR_LABEL: Record<string, string> = {
  anthropic: 'Anthropic Claude',
  openai: 'OpenAI GPT',
  google: 'Google Gemini',
  'workers-ai': 'Cloudflare Workers AI',
  cloudflare: 'Cloudflare Workers AI',
};

function vendorLabel(v: string): string {
  return TELEMETRY_VENDOR_LABEL[v] ?? v;
}

function fmtUsd(v: number): string {
  if (!Number.isFinite(v) || v === 0) return '$0';
  if (v < 0.01) return `$${v.toFixed(4)}`;
  return `$${v.toFixed(2)}`;
}

function errorRateClass(pct: number): string {
  if (pct === 0) return 'text-jade-600 dark:text-jade-300';
  if (pct >= ERROR_RED_PCT) return 'font-semibold text-rose-500';
  return 'text-amber-600 dark:text-amber-400';
}

const TELEMETRY_COLUMNS: AdminTableColumn<VendorTelemetryRow>[] = [
  {
    id: 'vendor',
    header: 'Vendor',
    className: 'text-xs text-foreground/85',
    cell: (row) => (
      <>
        <span className="font-medium">{vendorLabel(row.vendor)}</span>
        <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">{row.vendor}</span>
      </>
    ),
  },
  {
    id: 'requests',
    header: 'Lượt gọi',
    className: 'text-right tabular-nums text-xs text-foreground/85',
    cell: (row) => row.requests.toLocaleString('vi-VN'),
  },
  {
    id: 'errors',
    header: 'Lỗi (tỉ lệ)',
    className: 'text-right tabular-nums text-xs',
    cell: (row) => (
      <span className={errorRateClass(row.error_rate_pct)}>
        {row.errors.toLocaleString('vi-VN')}
        <span className="ml-1 text-[10px] opacity-80">({row.error_rate_pct.toFixed(1)}%)</span>
      </span>
    ),
  },
  {
    id: 'latency',
    header: 'Độ trễ TB / p95',
    className: 'text-right tabular-nums text-xs text-foreground/85',
    cell: (row) => (
      <>
        <span className="font-mono">{row.latency_avg_ms.toLocaleString('vi-VN')}</span>
        <span className="text-muted-foreground"> / {row.latency_p95_ms.toLocaleString('vi-VN')} ms</span>
      </>
    ),
  },
  {
    id: 'cost',
    header: 'Chi phí',
    className: 'text-right tabular-nums text-xs text-foreground/85',
    cell: (row) => (
      <>
        <span className="font-mono">{fmtUsd(row.cost_usd)}</span>
        {row.requests > 0 && row.cost_usd === 0 ? (
          <span className="ml-1 text-amber-500">(không ghi)</span>
        ) : null}
      </>
    ),
  },
  {
    id: 'last_used',
    header: 'Lần cuối',
    className: 'text-right font-mono text-[11px] text-muted-foreground',
    cell: (row) => (row.last_used_at ? new Date(row.last_used_at).toLocaleString('vi-VN') : '—'),
  },
];

const TELEMETRY_WINDOWS = [
  { days: 1, label: '24 giờ' },
  { days: 7, label: '7 ngày' },
  { days: 30, label: '30 ngày' },
] as const;

function VendorTelemetryCard() {
  const [days, setDays] = React.useState<number>(7);
  const q = useQuery({
    queryKey: ['admin', 'vendor-telemetry', days],
    queryFn: () => getVendorTelemetry(days),
    staleTime: 60_000,
  });

  const items = q.data?.items ?? [];
  const total = q.data?.total_requests ?? 0;
  // Caveat khi có lưu lượng nhưng tổng cost = 0 (ledger thưa cost).
  const costAllZero = items.length > 0 && items.every((v) => v.cost_usd === 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gold" />
              Telemetry theo vendor
            </CardTitle>
            <CardDescription>
              Số lượt gọi, lỗi, độ trễ và chi phí gom theo từng vendor AI (từ ledger
              llm_traces). Tô đỏ khi tỉ lệ lỗi ≥ {ERROR_RED_PCT}%.
            </CardDescription>
          </div>
          <div className="flex gap-1">
            {TELEMETRY_WINDOWS.map((w) => (
              <Button
                key={w.days}
                variant={days === w.days ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDays(w.days)}
              >
                {w.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {q.isLoading ? (
          <div className="h-40 animate-pulse rounded bg-muted/30" />
        ) : !q.data ? (
          <EmptyState
            title="Chưa đo được telemetry vendor"
            description="Endpoint /admin/ai/vendor-telemetry chưa được triển khai, hoặc chưa có cuộc gọi nào trong khoảng thời gian này."
          />
        ) : q.data.configured === false ? (
          <div className="rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            Telemetry chưa cấu hình (thiếu SUPABASE_SERVICE_ROLE_KEY trên worker).
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Chưa có cuộc gọi nào"
            description={`Không có trace LLM trong ${days === 1 ? '24 giờ' : `${days} ngày`} qua.`}
          />
        ) : (
          <>
            {costAllZero ? (
              <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-400">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Cột chi phí bằng 0 vì ledger không định giá mọi loại trace (đặc biệt
                  pipeline báo cáo). Số đáng tin ở đây là <strong>lượt gọi</strong>,{' '}
                  <strong>tỉ lệ lỗi</strong> và <strong>độ trễ</strong>. Chi phí chi tiết
                  xem trang Chi tiêu LLM.
                </span>
              </div>
            ) : null}
            <p className="mb-3 text-xs text-muted-foreground">
              Tổng{' '}
              <span className="font-semibold text-foreground">{total.toLocaleString('vi-VN')}</span>{' '}
              lượt gọi qua {items.length} vendor.
            </p>
            <AdminTable
              rows={items}
              columns={TELEMETRY_COLUMNS}
              getRowId={(v) => v.vendor}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

const VENDORS_ORDER: Vendor[] = ['anthropic', 'openai', 'google', 'cloudflare'];
const ROLES_ORDER: Role[] = ['vision', 'logic', 'psychology', 'alignment', 'report', 'mentor', 'judge'];

export default function VendorsPage() {
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['admin', 'vendors'],
    queryFn: fetchVendors,
    staleTime: 60_000,
  });

  const { data: lfData, isLoading: lfLoading } = useQuery({
    queryKey: ['admin', 'langfuse-traces'],
    queryFn: fetchLangfuseTraces,
    staleTime: 60_000,
  });

  // Per-vendor telemetry (7d) — drives the KPI row + the table below. null khi
  // worker chưa ship route → KPI hiển thị "chưa đo" như cũ.
  const { data: telemetry } = useQuery({
    queryKey: ['admin', 'vendor-telemetry', 7],
    queryFn: () => getVendorTelemetry(7),
    staleTime: 60_000,
  });

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const providers = data?.providers ?? [];
  const routing = data?.role_routing ?? null;

  const telemetryItems = telemetry?.items ?? [];
  const hasTelemetry = !!telemetry && telemetryItems.length > 0;
  const totalRequests = telemetry?.total_requests ?? 0;
  const totalErrors = telemetryItems.reduce((s, v) => s + v.errors, 0);
  const errorRatePct = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
  const worstP95 = telemetryItems.reduce((m, v) => Math.max(m, v.latency_p95_ms), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Trạng thái kết nối các vendor AI và bảng routing theo role."
        icon={<Cpu className="h-5 w-5" />}
        actions={
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? 'Đang tải…' : 'Làm mới'}
          </Button>
        }
      />

      {showError && (
        <ErrorBlock
          compact
          message={errorMsg ?? 'Không tải được vendor status.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && providers.length > 0 && (() => {
        const connected = providers.filter(
          (p) => p.api_key || p.oauth || p.vendor === 'cloudflare',
        ).length;
        // Telemetry KPIs are real (gom từ llm_traces theo vendor) khi đã tải
        // được; nếu worker chưa ship route thì rơi về "chưa đo" thay vì số giả.
        return (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Connected"
              value={`${connected}/${providers.length}`}
              icon={<CheckCircle2 className="h-4 w-4" />}
              accent={connected === providers.length ? 'jade' : 'gold'}
              hint="có credentials"
            />
            <KpiCard
              label="Requests 7d"
              value={hasTelemetry ? totalRequests.toLocaleString('vi-VN') : 'chưa đo'}
              icon={<Activity className="h-4 w-4" />}
              accent="gold"
              hint={hasTelemetry ? 'từ llm_traces' : 'chưa có dữ liệu'}
            />
            <KpiCard
              label="Lỗi 7d"
              value={hasTelemetry ? `${totalErrors.toLocaleString('vi-VN')} (${errorRatePct.toFixed(1)}%)` : 'chưa đo'}
              icon={<AlertCircle className="h-4 w-4" />}
              accent={hasTelemetry ? (errorRatePct >= ERROR_RED_PCT ? 'red' : errorRatePct > 0 ? 'warn' : 'jade') : 'gold'}
              hint={hasTelemetry ? 'status != ok' : 'chưa có dữ liệu'}
            />
            <KpiCard
              label="p95 latency cao nhất"
              value={hasTelemetry ? `${worstP95.toLocaleString('vi-VN')} ms` : 'chưa đo'}
              icon={<Zap className="h-4 w-4" />}
              accent="purple"
              hint={hasTelemetry ? 'vendor chậm nhất' : 'chưa có dữ liệu'}
            />
          </div>
        );
      })()}

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Đang tải…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VENDORS_ORDER.map(v => {
            const p = providers.find(x => x.vendor === v);
            if (!p) return null;
            // cloudflare trong llm_traces được ghi là "workers-ai".
            const telem = telemetryItems.find(
              t => t.vendor === v || (v === 'cloudflare' && t.vendor === 'workers-ai'),
            );
            return <VendorCard key={v} p={p} telem={telem} />;
          })}
        </div>
      )}

      <VendorTelemetryCard />

      <Card>
        <CardHeader>
          <CardTitle>Role routing</CardTitle>
          <CardDescription>
            Mỗi role có 1 primary vendor + fallback chain. Hiện UI read-only — edit sẽ enable khi Worker route endpoint sẵn sàng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!routing ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Chưa có routing.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-3 py-2 font-medium">Role</th>
                    <th className="px-3 py-2 font-medium">Primary</th>
                    <th className="px-3 py-2 font-medium">Fallback chain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ROLES_ORDER.map(r => {
                    const route = routing[r];
                    if (!route) return null;
                    return (
                      <tr key={r} className="transition-all duration-300 ease-editorial hover:bg-gold/[0.03]">
                        <td className="px-3 py-2 font-mono text-xs text-foreground/85">{ROLE_LABEL[r]}</td>
                        <td className="px-3 py-2">
                          <span className="rounded border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-xs text-gold">
                            {route.primary}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1">
                            {route.fallbacks.length === 0 ? (
                              <span className="text-muted-foreground">—</span>
                            ) : route.fallbacks.map((fb, i) => (
                              <span
                                key={fb + i}
                                className="rounded border border-border bg-muted/30 px-2 py-0.5 font-mono text-xs text-muted-foreground"
                              >
                                {fb}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Langfuse traces
          </CardTitle>
          <CardDescription>20 traces gần nhất từ Langfuse.</CardDescription>
        </CardHeader>
        <CardContent>
          {lfLoading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Đang tải…</p>
          ) : lfData?.configured === false ? (
            <div className="rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              Langfuse chưa cấu hình: {lfData.error}
            </div>
          ) : lfData?.ok === false ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {lfData.error ?? 'Lỗi khi tải traces.'}
            </div>
          ) : lfData?.ok ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <KpiCard
                  label="Tổng traces"
                  value={(lfData.total_items ?? 0).toLocaleString('vi-VN')}
                  icon={<BarChart2 className="h-4 w-4" />}
                  accent="gold"
                  hint="trong Langfuse"
                />
                <KpiCard
                  label="Hiển thị"
                  value={(lfData.traces?.length ?? 0).toLocaleString('vi-VN')}
                  icon={<Activity className="h-4 w-4" />}
                  accent="purple"
                  hint="traces gần nhất"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-3 py-2 font-medium">Tên</th>
                      <th className="px-3 py-2 font-medium">Thời gian</th>
                      <th className="px-3 py-2 font-medium">Latency</th>
                      <th className="px-3 py-2 font-medium">Chi phí</th>
                      <th className="px-3 py-2 font-medium">Observations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(lfData.traces ?? []).map((t) => (
                      <tr key={t.id} className="transition-all duration-300 ease-editorial hover:bg-gold/[0.03]">
                        <td className="px-3 py-2 font-mono text-xs text-foreground/85">{t.name ?? '—'}</td>
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                          {t.timestamp ? new Date(t.timestamp).toLocaleString('vi-VN') : '—'}
                        </td>
                        <td className="px-3 py-2 tabular-nums text-xs text-foreground/85">
                          {t.latency_ms != null ? `${t.latency_ms} ms` : '—'}
                        </td>
                        <td className="px-3 py-2 tabular-nums text-xs text-foreground/85">
                          {t.total_cost != null ? `$${t.total_cost.toFixed(4)}` : '—'}
                        </td>
                        <td className="px-3 py-2 tabular-nums text-xs text-foreground/85">
                          {t.observation_count ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
