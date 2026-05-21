/**
 * LLM spend API — typed wrappers around the Supabase PostgREST endpoint.
 *
 * Reads `hieu_asia.llm_traces`, `hieu_asia.api_budgets`, `hieu_asia.llm_trace_daily`
 * via `Accept-Profile: hieu_asia` header (the schema isn't `public`).
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 * (legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` accepted as fallback).
 *
 * If env vars are missing (e.g. local dev without `.env`), all functions
 * return empty/zeroed results so the page renders without crashing.
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

interface SupabaseConfig {
  url: string;
  key: string;
}

function getConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

export function isLlmSpendConfigured(): boolean {
  return getConfig() !== null;
}

function headers(cfg: SupabaseConfig, extra: Record<string, string> = {}): HeadersInit {
  return {
    apikey: cfg.key,
    Authorization: `Bearer ${cfg.key}`,
    'Accept-Profile': 'hieu_asia',
    'Content-Profile': 'hieu_asia',
    ...extra,
  };
}

async function restGet<T>(path: string, query: Record<string, string> = {}): Promise<T[]> {
  const cfg = getConfig();
  if (!cfg) return [];
  const q = new URLSearchParams(query);
  const url = `${cfg.url}/rest/v1/${path}?${q.toString()}`;
  const res = await fetch(url, { headers: headers(cfg), cache: 'no-store' });
  if (!res.ok) {
    const detail = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`[llm-spend] ${path} → ${res.status}: ${detail.slice(0, 200)}`);
  }
  return (await res.json()) as T[];
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

// ---------- KPIs ----------

export async function getLlmSpendKpis(opts: { since: string; until?: string }): Promise<LlmSpendKpis> {
  const cfg = getConfig();
  if (!cfg) return { cost_usd: 0, call_count: 0, avg_latency_ms: 0, error_rate: 0 };

  const query: Record<string, string> = {
    select: 'cost_usd,latency_ms,status',
    created_at: `gte.${opts.since}`,
  };
  if (opts.until) query['created_at'] = `gte.${opts.since}`;
  // We need both gte and lte — PostgREST takes them as repeated params via and=
  const params = new URLSearchParams();
  params.set('select', 'cost_usd,latency_ms,status');
  params.append('created_at', `gte.${opts.since}`);
  if (opts.until) params.append('created_at', `lte.${opts.until}`);
  const url = `${cfg.url}/rest/v1/llm_traces?${params.toString()}`;

  const res = await fetch(url, { headers: headers(cfg), cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`[llm-spend] kpis HTTP ${res.status}`);
  }
  const rows = (await res.json()) as Array<{
    cost_usd: number | null;
    latency_ms: number | null;
    status: string | null;
  }>;
  let cost = 0;
  let latencySum = 0;
  let latencyN = 0;
  let errors = 0;
  for (const r of rows) {
    cost += Number(r.cost_usd ?? 0);
    if (r.latency_ms != null) {
      latencySum += Number(r.latency_ms);
      latencyN += 1;
    }
    if (r.status && r.status !== 'ok' && r.status !== 'success') errors += 1;
  }
  return {
    cost_usd: cost,
    call_count: rows.length,
    avg_latency_ms: latencyN > 0 ? latencySum / latencyN : 0,
    error_rate: rows.length > 0 ? errors / rows.length : 0,
  };
}

export async function getLlmSpendDaily(days = 30): Promise<LlmDailyRow[]> {
  const since = isoDaysAgo(days);
  return restGet<LlmDailyRow>('llm_trace_daily', {
    select: 'day,vendor,model,cost_usd,call_count',
    day: `gte.${since.slice(0, 10)}`,
    order: 'day.asc',
    limit: '5000',
  });
}

export async function getRecentTraces(opts: {
  limit?: number;
  vendor?: string;
  userId?: string;
  role?: string;
} = {}): Promise<LlmTraceRow[]> {
  const params: Record<string, string> = {
    select: 'id,created_at,user_id,vendor,model,role,input_tokens,output_tokens,cost_usd,latency_ms,status,error_class',
    order: 'created_at.desc',
    limit: String(opts.limit ?? 50),
  };
  if (opts.vendor) params['vendor'] = `eq.${opts.vendor}`;
  if (opts.userId) params['user_id'] = `eq.${opts.userId}`;
  if (opts.role) params['role'] = `eq.${opts.role}`;
  return restGet<LlmTraceRow>('llm_traces', params);
}

export async function getTopUsers(days = 30, limit = 20): Promise<
  Array<{ user_id: string; cost_usd: number; call_count: number; avg_latency_ms: number }>
> {
  const cfg = getConfig();
  if (!cfg) return [];
  const since = isoDaysAgo(days);
  const params = new URLSearchParams({
    select: 'user_id,cost_usd,latency_ms',
    created_at: `gte.${since}`,
    limit: '10000',
  });
  const url = `${cfg.url}/rest/v1/llm_traces?${params.toString()}`;
  const res = await fetch(url, { headers: headers(cfg), cache: 'no-store' });
  if (!res.ok) throw new Error(`[llm-spend] top-users HTTP ${res.status}`);
  const rows = (await res.json()) as Array<{
    user_id: string | null;
    cost_usd: number | null;
    latency_ms: number | null;
  }>;
  const agg = new Map<string, { cost_usd: number; call_count: number; lat_sum: number; lat_n: number }>();
  for (const r of rows) {
    const uid = r.user_id ?? '(anonymous)';
    const cur = agg.get(uid) ?? { cost_usd: 0, call_count: 0, lat_sum: 0, lat_n: 0 };
    cur.cost_usd += Number(r.cost_usd ?? 0);
    cur.call_count += 1;
    if (r.latency_ms != null) {
      cur.lat_sum += Number(r.latency_ms);
      cur.lat_n += 1;
    }
    agg.set(uid, cur);
  }
  return Array.from(agg.entries())
    .map(([user_id, v]) => ({
      user_id,
      cost_usd: v.cost_usd,
      call_count: v.call_count,
      avg_latency_ms: v.lat_n > 0 ? v.lat_sum / v.lat_n : 0,
    }))
    .sort((a, b) => b.cost_usd - a.cost_usd)
    .slice(0, limit);
}

// ---------- Budgets ----------

export async function getApiBudgets(): Promise<ApiBudgetRow[]> {
  return restGet<ApiBudgetRow>('api_budgets', {
    select: '*',
    order: 'limit_usd.desc',
    limit: '200',
  });
}

export async function upsertApiBudget(body: BudgetUpsert): Promise<ApiBudgetRow | null> {
  const cfg = getConfig();
  if (!cfg) return null;
  const url = `${cfg.url}/rest/v1/api_budgets`;
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(cfg, {
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    }),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(`[llm-spend] upsertApiBudget HTTP ${res.status}: ${detail.slice(0, 200)}`);
  }
  const rows = (await res.json()) as ApiBudgetRow[];
  return rows[0] ?? null;
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
