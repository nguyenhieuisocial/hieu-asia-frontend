'use client';

/**
 * useAdminDashboard — React Query hook for the `/overview` single-pane.
 *
 * Wave 60.95.x — consumes WW's Worker endpoint at
 * `${API_BASE}/admin/dashboard/overview` (proxied through the admin Next
 * Edge route at `/api/admin-proxy/admin/dashboard/overview` which adds the
 * `X-Admin-Token` server-side so the shared token never reaches the browser).
 *
 * Polling: 60s — matches the Worker KV TTL so the UI converges within ~1
 * cache-refresh of every metric flip.
 *
 * Schema is intentionally narrow (`Kpi[]`) so the page renders whichever
 * subset of metrics the Worker happens to populate. If a metric is missing,
 * the page renders a static skeleton placeholder for it (see `OverviewPage`).
 *
 * Errors degrade gracefully:
 *   - 401 → middleware/admin-proxy bounces to /login; the hook surfaces
 *     `isError: true`, the page renders the placeholder grid.
 *   - 404 / 503 → endpoint not deployed yet; same skeleton path. The card
 *     labels still render so the page LOOKS done even pre-WW-ship.
 *   - 500 → same fallback; we don't synthesize fake values.
 */

import { useQuery } from '@tanstack/react-query';
import type { KpiSource } from '@/components/admin-kpi-card';

export interface Kpi {
  /** Stable identifier for matching against the placeholder grid. */
  key: string;
  /** Mono uppercase label, e.g. "DEPLOYS HÔM NAY". */
  label: string;
  /** Raw value — number for numerics, string for currency-formatted etc. */
  value: number | string;
  /** Optional subtitle, e.g. "12 trong 7 ngày". */
  subtitle?: string;
  /** Which 3rd-party emitted this metric. */
  source: KpiSource;
  /** Deep-link to the original dashboard (escape hatch). */
  sourceUrl?: string;
  /** Optional yesterday comparison — `null` until Worker exposes it. */
  trend?: { direction: 'up' | 'down' | 'flat'; label?: string } | null;
}

interface OverviewEnvelope {
  ok: boolean;
  /** ISO timestamp the snapshot was taken (Worker KV write). */
  generated_at?: string;
  kpis?: Kpi[];
  error?: string;
}

const PROXY_PATH = '/api/admin-proxy/admin/dashboard/overview';

/** 60s polling — matches Worker KV TTL. */
export const ADMIN_DASHBOARD_REFETCH_MS = 60_000;

async function fetchOverview(): Promise<OverviewEnvelope> {
  const res = await fetch(PROXY_PATH, { cache: 'no-store' });
  // Handle non-JSON / HTML responses defensively — the admin-proxy returns
  // JSON on every path, but if the Edge runtime errors out before the proxy
  // we may get HTML; surface a typed error instead of crashing JSON.parse.
  const text = await res.text();
  let parsed: OverviewEnvelope;
  try {
    parsed = JSON.parse(text) as OverviewEnvelope;
  } catch {
    return { ok: false, error: `Phản hồi không hợp lệ (HTTP ${res.status})` };
  }
  // Worker may already wrap with `{ ok: false, error }`; pass through.
  if (!res.ok && parsed.ok !== false) {
    return { ok: false, error: parsed.error ?? `HTTP ${res.status}` };
  }
  return parsed;
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'overview'],
    queryFn: fetchOverview,
    refetchInterval: ADMIN_DASHBOARD_REFETCH_MS,
    refetchOnWindowFocus: true,
    // Don't spam retries when the endpoint is 404 — Worker may not be
    // deployed yet; the placeholder grid covers the gap.
    retry: 1,
    staleTime: ADMIN_DASHBOARD_REFETCH_MS / 2,
  });
}
