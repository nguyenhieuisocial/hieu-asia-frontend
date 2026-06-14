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
import { Cpu, CheckCircle2, AlertCircle, Activity, Zap, BarChart2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { KpiCard } from '@/components/admin/kpi-card';
import { ErrorBlock } from '@/components/admin/error-block';

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

function VendorCard({ p }: { p: ProviderRow }) {
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

        {/* #37: backend /admin/vendors/status returns hardcoded 0 / null for
            these — telemetry (Langfuse) chưa wire. Show "chưa đo" thay vì số 0
            giả để không ngụ ý đã đo. */}
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          <dt className="text-muted-foreground">Requests 7d</dt>
          <dd className="text-muted-foreground/70">chưa đo</dd>
          <dt className="text-muted-foreground">Fallback 7d</dt>
          <dd className="text-muted-foreground/70">chưa đo</dd>
          <dt className="text-muted-foreground">p50 / p95</dt>
          <dd className="text-muted-foreground/70">chưa đo</dd>
          <dt className="text-muted-foreground">Last used</dt>
          <dd className="font-mono text-[11px] text-muted-foreground">{p.last_used ?? 'chưa đo'}</dd>
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

  const showError = !!error || data?.ok === false;
  const errorMsg = (error as Error | undefined)?.message ?? data?.error;
  const providers = data?.providers ?? [];
  const routing = data?.role_routing ?? null;

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
        // #37: requests / fallback / latency are hardcoded 0 by the backend
        // (Langfuse telemetry chưa wire), so they're shown as "chưa đo" instead
        // of fabricated aggregates. Only "Connected" reflects real state.
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
              value="chưa đo"
              icon={<Activity className="h-4 w-4" />}
              accent="gold"
              hint="cần Langfuse"
            />
            <KpiCard
              label="Fallback 7d"
              value="chưa đo"
              icon={<AlertCircle className="h-4 w-4" />}
              accent="gold"
              hint="cần Langfuse"
            />
            <KpiCard
              label="Avg p95 latency"
              value="chưa đo"
              icon={<Zap className="h-4 w-4" />}
              accent="purple"
              hint="cần Langfuse"
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
            return <VendorCard key={v} p={p} />;
          })}
        </div>
      )}

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
