'use client';

/**
 * /health — 30-day uptime grid + recent incidents.
 *
 * Wave 60.81.C Tier 3 polish batch 2. Uses AdminTable for the incident
 * log (vault 107 §5.5) and a 30-day square strip for at-a-glance uptime.
 *
 * Data sources (real — proxy Better Stack at the worker level):
 *   GET /api/admin-proxy/admin/uptime?days=30   → daily uptime % series
 *   GET /api/admin-proxy/admin/incidents?limit=20 → recent incidents
 *
 * Both endpoints return HTTP 503 when BETTERSTACK_API_TOKEN is unset. We
 * classify the response (configured vs. not) instead of faking data, and
 * render an honest "chưa cấu hình" empty-state — same pattern as the
 * Cloudflare WAF card below.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@hieu-asia/ui';
import { AlertTriangle, CheckCircle2, TrendingUp, ShieldAlert } from 'lucide-react';
import { KpiCard } from '@/components/admin/kpi-card';
import { AdminTable, type AdminTableColumn } from '@/components/admin/table/AdminTable';
import { adminFetch } from '@/lib/admin-fetch';

interface UptimeDay {
  date: string;
  uptime_pct: number;
}

interface Incident {
  id: string;
  ts: string;
  service: string;
  severity: 'minor' | 'major' | 'critical';
  summary: string;
  resolved_at: string | null;
}

const SEV_CLASS: Record<Incident['severity'], string> = {
  minor: 'border-warn-500/30 bg-warn-500/10 text-warn-700 dark:text-warn-300',
  major: 'border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300',
  critical: 'border-red-500/60 bg-red-500/20 text-red-700 dark:text-red-200',
};

function fmtPct(v: number) {
  return v >= 99.95 ? '100%' : `${v.toFixed(2)}%`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface WafEvent {
  action: string;
  source: string;
  clientIP: string;
  clientCountryName: string;
  datetime: string;
  rayName: string;
  clientRequestPath: string;
  clientRequestHTTPHost: string;
  userAgent: string;
}

interface WafResponse {
  ok: boolean;
  configured: boolean;
  events?: WafEvent[];
  error?: string;
}

function wafActionBadge(action: string) {
  const lower = action.toLowerCase();
  const cls =
    lower === 'block' || lower === 'drop'
      ? 'border-red-500/40 bg-red-500/10 text-destructive'
      : lower === 'challenge' || lower === 'managed_challenge' || lower === 'js_challenge'
        ? 'border-warn-500/30 bg-warn-500/10 text-warn-700 dark:text-warn-300'
        : 'border-border bg-muted/40 text-muted-foreground';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
        cls,
      )}
    >
      {action}
    </span>
  );
}

function uptimeColor(pct: number): string {
  if (pct >= 99.95) return 'bg-jade-300';
  if (pct >= 99) return 'bg-jade-500';
  if (pct >= 95) return 'bg-warn-500';
  return 'bg-red-500';
}

export function UptimeTab() {
  // Real endpoints — proxy Better Stack. They return HTTP 503 when the
  // BETTERSTACK_API_TOKEN is unset, so classify the response (configured vs.
  // not) instead of substituting fake data.
  const uptime = useQuery({
    queryKey: ['admin', 'uptime-30d'],
    queryFn: async (): Promise<{ rows: UptimeDay[]; configured: boolean; reason?: string }> => {
      try {
        const r = await adminFetch('/api/admin-proxy/admin/uptime?days=30');
        const data = (await r.json().catch(() => null)) as
          | { ok?: boolean; rows?: UptimeDay[]; note?: string; error?: string }
          | null;
        if (!r.ok || !data?.ok) {
          return {
            rows: [],
            configured: false,
            reason: data?.note ?? data?.error ?? 'Better Stack chưa cấu hình',
          };
        }
        // Backend degrade-soft: trả HTTP 200 + rows:[] + `note` khi
        // BETTERSTACK_API_TOKEN chưa set (xem daily/betterstack.ts). Coi như
        // "chưa cấu hình" thay vì hiện uptime 0% giả.
        const okRows = data.rows ?? [];
        if (okRows.length === 0) {
          return { rows: [], configured: false, reason: data.note ?? 'Better Stack chưa cấu hình' };
        }
        return { rows: okRows, configured: true };
      } catch {
        return { rows: [], configured: false, reason: 'không kết nối' };
      }
    },
  });

  const incidents = useQuery({
    queryKey: ['admin', 'incidents'],
    queryFn: async (): Promise<{ rows: Incident[]; configured: boolean; reason?: string }> => {
      try {
        const r = await adminFetch('/api/admin-proxy/admin/incidents?limit=20');
        const data = (await r.json().catch(() => null)) as
          | { ok?: boolean; rows?: Incident[]; note?: string; error?: string }
          | null;
        if (!r.ok || !data?.ok) {
          return {
            rows: [],
            configured: false,
            reason: data?.note ?? data?.error ?? 'Better Stack chưa cấu hình',
          };
        }
        // `note` only signals "not configured" when it comes WITH empty rows
        // (mirrors the uptime query's contract). A 200 envelope that carries
        // real incident rows AND an informational note (e.g. a pagination/cache
        // hint) must still render the incidents — never hide real data behind
        // the "chưa cấu hình" card.
        const okRows = data.rows ?? [];
        if (data.note && okRows.length === 0) {
          return { rows: [], configured: false, reason: data.note };
        }
        return { rows: okRows, configured: true };
      } catch {
        return { rows: [], configured: false, reason: 'không kết nối' };
      }
    },
  });

  const rows = uptime.data?.rows ?? [];
  const uptimeConfigured = uptime.data?.configured === true || rows.length > 0;
  const incidentRows = incidents.data?.rows ?? [];
  const incidentsConfigured = incidents.data?.configured === true || incidentRows.length > 0;
  const avg = rows.length > 0 ? rows.reduce((s, d) => s + d.uptime_pct, 0) / rows.length : 0;
  const worst = rows.length > 0 ? Math.min(...rows.map((d) => d.uptime_pct)) : 0;
  const okDays = rows.filter((d) => d.uptime_pct >= 99.95).length;
  const incidentCount = incidentRows.length;

  const waf = useQuery({
    queryKey: ['admin', 'waf-events'],
    queryFn: async () => {
      const r = await adminFetch('/api/admin-proxy/admin/waf/events?limit=20');
      const data = (await r.json()) as WafResponse;
      return data;
    },
  });

  const wafCols: AdminTableColumn<WafEvent>[] = [
    {
      id: 'action',
      header: 'Hành động',
      width: '120px',
      cell: (r) => wafActionBadge(r.action),
    },
    {
      id: 'clientIP',
      header: 'IP',
      width: '140px',
      cell: (r) => <span className="font-mono text-xs text-foreground/90">{r.clientIP}</span>,
    },
    {
      id: 'clientCountryName',
      header: 'Quốc gia',
      width: '120px',
      cell: (r) => <span className="text-sm text-foreground">{r.clientCountryName}</span>,
    },
    {
      id: 'clientRequestPath',
      header: 'Đường dẫn',
      cell: (r) => (
        <span className="font-mono text-xs text-foreground/85 break-all">
          {r.clientRequestPath}
        </span>
      ),
    },
    {
      id: 'datetime',
      header: 'Thời gian',
      width: '150px',
      hideOnMobile: true,
      cell: (r) => (
        <span className="font-mono text-xs text-foreground/90">{fmtDate(r.datetime)}</span>
      ),
    },
  ];

  const incidentCols: AdminTableColumn<Incident>[] = [
    {
      id: 'ts',
      header: 'Thời điểm',
      sortKey: 'ts',
      width: '160px',
      cell: (r) => <span className="font-mono text-xs text-foreground/90">{fmtDate(r.ts)}</span>,
    },
    {
      id: 'service',
      header: 'Dịch vụ',
      sortKey: 'service',
      width: '120px',
      cell: (r) => <span className="text-sm text-foreground">{r.service}</span>,
    },
    {
      id: 'severity',
      header: 'Mức',
      sortKey: 'severity',
      width: '100px',
      cell: (r) => (
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
            SEV_CLASS[r.severity],
          )}
        >
          {r.severity}
        </span>
      ),
    },
    {
      id: 'summary',
      header: 'Mô tả',
      cell: (r) => <span className="text-sm text-foreground/85">{r.summary}</span>,
    },
    {
      id: 'resolved',
      header: 'Kết thúc',
      width: '120px',
      hideOnMobile: true,
      cell: (r) =>
        r.resolved_at ? (
          <span className="font-mono text-xs text-jade-700 dark:text-jade-300">{fmtDate(r.resolved_at)}</span>
        ) : (
          <span className="font-mono text-xs text-warn-700 dark:text-warn-300">đang xử lý</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {uptimeConfigured ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Uptime trung bình"
              value={fmtPct(avg)}
              icon={<CheckCircle2 className="h-4 w-4" />}
              accent="jade"
              hint="30 ngày"
            />
            <KpiCard
              label="Ngày hoàn hảo"
              value={`${okDays}/${rows.length}`}
              icon={<TrendingUp className="h-4 w-4" />}
              accent="gold"
              hint=">=99.95%"
            />
            <KpiCard
              label="Thấp nhất"
              value={fmtPct(worst)}
              icon={<AlertTriangle className="h-4 w-4" />}
              accent={worst < 99 ? 'red' : 'gold'}
              hint="worst day"
            />
            <KpiCard
              label="Sự cố"
              value={incidentCount}
              icon={<AlertTriangle className="h-4 w-4" />}
              accent={incidentCount > 0 ? 'gold' : 'jade'}
              hint="30 ngày"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lưới uptime 30 ngày</CardTitle>
              <CardDescription>
                Mỗi ô = 1 ngày. Xanh = 100% / 99.95%+, xanh đậm = 99%+, vàng = 95%+, đỏ = thấp hơn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-2 sm:grid-cols-[repeat(30,minmax(0,1fr))]">
                {rows.map((d) => (
                  <div
                    key={d.date}
                    title={`${d.date} — ${fmtPct(d.uptime_pct)}`}
                    className={cn(
                      'aspect-square rounded-sm transition-all duration-300 ease-editorial hover:scale-110',
                      uptimeColor(d.uptime_pct),
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <ShieldAlert className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <CardTitle className="text-base">Better Stack uptime — chưa cấu hình</CardTitle>
              <CardDescription>
                {uptime.isLoading
                  ? 'Đang tải dữ liệu uptime…'
                  : 'Endpoint trả về 503 — đặt BETTERSTACK_API_TOKEN để bật lưới uptime 30 ngày.'}
              </CardDescription>
            </div>
          </CardHeader>
          {!uptime.isLoading && uptime.data?.reason && (
            <CardContent>
              <pre className="rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap break-all">
                {uptime.data.reason}
              </pre>
            </CardContent>
          )}
        </Card>
      )}

      {/* ── Cloudflare WAF ──────────────────────────────────────────── */}
      {waf.data?.configured === true ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Sự kiện 24h"
              value={waf.data.events?.length ?? 0}
              icon={<ShieldAlert className="h-4 w-4" />}
              accent={waf.data.events && waf.data.events.length > 0 ? 'red' : 'jade'}
              hint="Cloudflare WAF"
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Cloudflare WAF — sự kiện gần nhất</CardTitle>
              <CardDescription>20 sự kiện WAF mới nhất từ Cloudflare Analytics.</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminTable
                rows={waf.data.events ?? []}
                columns={wafCols}
                loading={waf.isLoading}
                empty={
                  <span className="text-sm text-muted-foreground">
                    Không có sự kiện WAF trong khoảng thời gian này.
                  </span>
                }
                caption="Danh sách sự kiện WAF gần nhất"
              />
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <ShieldAlert className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <CardTitle className="text-base">Cloudflare WAF — chưa cấu hình</CardTitle>
              <CardDescription>
                {waf.isLoading
                  ? 'Đang tải dữ liệu WAF…'
                  : 'Endpoint trả về 503 — xem hướng dẫn cấu hình bên dưới.'}
              </CardDescription>
            </div>
          </CardHeader>
          {!waf.isLoading && waf.data?.error && (
            <CardContent>
              <pre className="rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap break-all">
                {waf.data.error}
              </pre>
            </CardContent>
          )}
        </Card>
      )}

      {incidentsConfigured ? (
        <Card>
          <CardHeader>
            <CardTitle>Sự cố gần đây</CardTitle>
            <CardDescription>20 sự cố mới nhất, theo thứ tự ngược thời gian.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminTable
              rows={incidentRows}
              columns={incidentCols}
              loading={incidents.isLoading}
              empty={
                <span className="text-sm text-muted-foreground">
                  Không có sự cố trong 30 ngày qua.
                </span>
              }
              caption="Danh sách sự cố gần nhất"
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <ShieldAlert className="h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <CardTitle className="text-base">Better Stack sự cố — chưa cấu hình</CardTitle>
              <CardDescription>
                {incidents.isLoading
                  ? 'Đang tải dữ liệu sự cố…'
                  : 'Endpoint trả về 503 — đặt BETTERSTACK_API_TOKEN để bật nhật ký sự cố.'}
              </CardDescription>
            </div>
          </CardHeader>
          {!incidents.isLoading && incidents.data?.reason && (
            <CardContent>
              <pre className="rounded-md border border-border bg-muted/40 px-4 py-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap break-all">
                {incidents.data.reason}
              </pre>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
