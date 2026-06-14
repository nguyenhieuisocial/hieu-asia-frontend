/**
 * LLM spend API — typed wrappers around the worker admin endpoints.
 *
 * Reads go through the secure admin proxy (`/api/admin-proxy/admin/llm-spend/*`),
 * which injects the X-Admin-Token server-side and is HMAC-session + role gated.
 *
 * Previously this read `hieu_asia.llm_traces` / `api_budgets` / `llm_trace_daily`
 * browser-direct with the Supabase anon key — but anon SELECT on those tables was
 * REVOKED (migration 0024), so every read 403'd and the page showed zeros. The
 * worker now serves the same shapes via its service role (see backend
 * src/admin/data.ts handleLlmSpend*).
 */

export interface LlmSpendKpis {
  cost_usd: number;
  call_count: number;
  avg_latency_ms: number;
  error_rate: number;
}

export interface LlmDailyRow {
  day: string;
  vendor: string;
  model: string;
  cost_usd: number;
  call_count: number;
}

export interface LlmTraceRow {
  id: string;
  created_at: string;
  user_id: string | null;
  vendor: string;
  model: string;
  role: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number;
  latency_ms: number | null;
  status: string;
  error_class: string | null;
}

export interface ApiBudgetRow {
  id?: string;
  user_id: string | null;
  team_id?: string | null;
  period: 'daily' | 'weekly' | 'monthly';
  limit_usd: number;
  soft_limit_usd?: number | null;
  current_usage_usd: number;
  updated_at?: string;
}

export interface BudgetUpsert {
  user_id?: string | null;
  team_id?: string | null;
  period: 'daily' | 'weekly' | 'monthly';
  limit_usd: number;
  soft_limit_usd?: number | null;
}

const BASE = '/api/admin-proxy/admin/llm-spend';

/** Always true now — config (token/secret) lives server-side on the proxy. */
export function isLlmSpendConfigured(): boolean {
  return true;
}

/** Redirect to /login on a 401 from the proxy (expired/invalid session). */
function bounceOn401(status: number): boolean {
  if (status === 401 && typeof window !== 'undefined') {
    const next = window.location.pathname + window.location.search;
    window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
    return true;
  }
  return false;
}

async function proxyGet<T>(path: string, query: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams(query).toString();
  const res = await fetch(`${BASE}/${path}${qs ? `?${qs}` : ''}`, {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  if (bounceOn401(res.status)) throw new Error('unauthenticated');
  if (!res.ok) {
    const detail = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`[llm-spend] ${path} → ${res.status}: ${detail.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

// ---------- KPIs ----------

export async function getLlmSpendKpis(opts: { since: string; until?: string }): Promise<LlmSpendKpis> {
  return proxyGet<LlmSpendKpis>('kpis', {
    since: opts.since,
    ...(opts.until ? { until: opts.until } : {}),
  });
}

export async function getLlmSpendDaily(days = 30): Promise<LlmDailyRow[]> {
  return proxyGet<LlmDailyRow[]>('daily', { days: String(days) });
}

export async function getRecentTraces(opts: {
  limit?: number;
  vendor?: string;
  userId?: string;
  role?: string;
} = {}): Promise<LlmTraceRow[]> {
  const q: Record<string, string> = { limit: String(opts.limit ?? 50) };
  if (opts.vendor) q['vendor'] = opts.vendor;
  if (opts.userId) q['user_id'] = opts.userId;
  if (opts.role) q['role'] = opts.role;
  return proxyGet<LlmTraceRow[]>('recent', q);
}

export async function getTopUsers(days = 30, limit = 20): Promise<
  Array<{ user_id: string; cost_usd: number; call_count: number; avg_latency_ms: number }>
> {
  return proxyGet<Array<{ user_id: string; cost_usd: number; call_count: number; avg_latency_ms: number }>>(
    'top-users',
    { days: String(days), limit: String(limit) },
  );
}

// ---------- Budgets ----------

export async function getApiBudgets(): Promise<ApiBudgetRow[]> {
  return proxyGet<ApiBudgetRow[]>('budgets');
}

export async function upsertApiBudget(body: BudgetUpsert): Promise<ApiBudgetRow | null> {
  const res = await fetch(`${BASE}/budgets`, {
    method: 'POST',
    cache: 'no-store',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (bounceOn401(res.status)) return null;
  if (!res.ok) {
    const detail = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`[llm-spend] upsertApiBudget HTTP ${res.status}: ${detail.slice(0, 200)}`);
  }
  return (await res.json()) as ApiBudgetRow | null;
}

// ---------- Helpers ----------

export function isoStartOfMonth(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

export function isoStartOfToday(): string {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())).toISOString();
}

export function isoNDaysAgo(n: number): string {
  return isoDaysAgo(n);
}
