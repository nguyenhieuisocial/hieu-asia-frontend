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
  /** Raw value — number for numerics, string for currency-formatted, OR null
   * when the upstream source failed (Worker `safe()` helper degrades to null).
   * Wave 60.95.ai — null was missing here while Worker actually returns it,
   * causing `formatValue` to crash on `null.toFixed()` → admin /overview 500. */
  value: number | string | null;
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
    // Wave 60.95.ad — exponential backoff retry on Worker failure (vault 95
    // §11 #6). Replaces the static R2 snapshot fallback proposal. 3 attempts
    // total, doubling delay (1s, 2s, 4s ... capped at 30s) so a transient
    // Worker blip doesn't immediately strand the dashboard on the placeholder
    // grid. A 404 (endpoint not deployed) still falls through after 3 retries
    // and renders the placeholder — same UX, just slower to land.
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
    staleTime: ADMIN_DASHBOARD_REFETCH_MS / 2,
  });
}
