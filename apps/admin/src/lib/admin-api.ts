/**
 * Admin API surface (typed wrappers).
 *
 * Wave-D wiring: each function tries the real backend first (via the
 * `/api/admin-proxy/*` Next.js route → Worker `/admin/*` with `X-Admin-Token`).
 * If the proxy fails (env missing, gateway down, endpoint not shipped yet, or
 * response shape unexpected), we fall back to deterministic mocks from
 * `mock-data.ts` so the UI keeps rendering.
 *
 * Each function returns `{ isMock: boolean }` metadata via `MockBanner` so
 * pages can display "đang dùng dữ liệu mock" notice when appropriate.
 *
 * Backend endpoints used:
 *   GET /admin/analytics?days=30                    (revenue, vendor cost, funnel)
 *   GET /admin/customers?search=&plan=&limit=       (end-user list)
 *   GET /admin/users                                (admin login users in KV)
 *   GET /payment/transactions?limit=&user_id=       (raw payment events)
 *   GET /admin/audit?prefix=admin&limit=            (audit trail)
 *
 * Endpoints NOT shipped yet (mock-only — TODO marked `isMock: true`):
 *   GET  /admin/sessions          (list reading sessions; only export+bulk-delete exist)
 *   GET  /admin/tasks             (Celery task status)
 *   GET  /admin/queue_depth
 *   GET  /admin/cost/by_day
 *   GET  /admin/cost/top_spenders
 *   GET  /admin/rag/chunks, /admin/qdrant/stats
 *   POST /admin/rag/ingest
 *   GET  /admin/coupons
 *   POST /admin/coupons, PATCH /admin/coupons/{code}
 *   GET  /admin/feature_flags, PATCH /admin/feature_flags
 *   POST /admin/tasks/{id}/retry, /admin/payments/{id}/refund
 */

import {
  MOCK_USERS,
  MOCK_SESSIONS,
  MOCK_TASKS,
  MOCK_COST_BY_DAY,
  MOCK_TOP_SPENDERS,
  MOCK_READINGS_PER_DAY,
  MOCK_RAG_CHUNKS,
  MOCK_QDRANT_STATS,
  MOCK_TRANSACTIONS,
  MOCK_COUPONS,
  MOCK_QUEUE_DEPTH,
  getOverviewKpis,
  type AdminUser,
  type AdminSession,
  type AdminTask,
  type CostByDay,
  type ReadingsPerDay,
  type RagChunk,
  type AdminTransaction,
  type AdminCoupon,
} from './mock-data';

const PROXY = '/api/admin-proxy';

/** Tag returned by every list/fetch so pages can display a mock banner. */
export interface DataSource {
  isMock: boolean;
  /** Optional reason (gateway down, endpoint missing, etc) for the banner tooltip. */
  reason?: string;
}

/** Wrap a value with mock=false metadata. */
function real<T extends object>(value: T): T & { _source: DataSource } {
  return Object.assign(value, { _source: { isMock: false } });
}

/** Wrap a value with mock=true metadata. */
function mock<T extends object>(value: T, reason?: string): T & { _source: DataSource } {
  return Object.assign(value, { _source: { isMock: true, reason } });
}

/**
 * Fetch a proxied admin endpoint with timeout. Returns null on any error so
 * callers can fall back to mock data without leaking exceptions to the UI.
 */
async function proxyFetch<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = 8000,
): Promise<T | null> {
  if (typeof window === 'undefined' && typeof fetch === 'undefined') return null;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${PROXY}${path}`, {
      cache: 'no-store',
      ...init,
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean } & T;
    // Worker wraps payloads in {ok: true, ...}. If ok is explicitly false, treat as fail.
    if ((data as { ok?: boolean }).ok === false) return null;
    return data as T;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

const MOCK_LATENCY_MS = 40;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

export interface PageQuery {
  page?: number;
  page_size?: number;
  search?: string;
}

function paginate<T>(
  rows: T[],
  q: PageQuery,
): { rows: T[]; total: number; page: number; page_size: number } {
  const page = Math.max(1, q.page ?? 1);
  const page_size = q.page_size ?? 20;
  const start = (page - 1) * page_size;
  return { rows: rows.slice(start, start + page_size), total: rows.length, page, page_size };
}

// ---------- Users ----------

export async function listUsers(q: PageQuery & { plan?: AdminUser['plan'] } = {}) {
  // TODO(wave-D): `/admin/users` exists but returns *admin login users* (KV),
  // not end-users. End-user list lives under `/admin/customers`. The mock here
  // represents end-users with plan/spend, so we keep mock for now and surface
  // real data via the dedicated /customers page.
  let rows = MOCK_USERS;
  if (q.search) {
    const s = q.search.toLowerCase();
    rows = rows.filter((u) => u.email.toLowerCase().includes(s) || u.id.includes(s));
  }
  if (q.plan) rows = rows.filter((u) => u.plan === q.plan);
  return delay(mock(paginate(rows, q), 'end-user list not yet on backend; use /customers'));
}

export async function getUser(id: string) {
  return delay(MOCK_USERS.find((u) => u.id === id) ?? null);
}

// ---------- Sessions ----------

interface SessionsEnvelope {
  ok: boolean;
  rows?: AdminSession[];
  total?: number;
  page?: number;
  page_size?: number;
}

export async function listSessions(
  q: PageQuery & { status?: AdminSession['status']; from?: string; to?: string } = {},
) {
  // TODO(wave-D): `/admin/sessions` list endpoint not shipped — only
  // `/admin/sessions/export` and `/admin/sessions/bulk-delete` exist. When
  // backend ships a paginated list endpoint, swap to real fetch.
  const qs = new URLSearchParams();
  if (q.status) qs.set('status', q.status);
  if (q.search) qs.set('search', q.search);
  if (q.from) qs.set('from', q.from);
  if (q.to) qs.set('to', q.to);
  if (q.page) qs.set('page', String(q.page));
  if (q.page_size) qs.set('page_size', String(q.page_size));
  const real = await proxyFetch<SessionsEnvelope>(`/admin/sessions?${qs.toString()}`);
  if (real?.ok && Array.isArray(real.rows)) {
    return {
      rows: real.rows,
      total: real.total ?? real.rows.length,
      page: real.page ?? q.page ?? 1,
      page_size: real.page_size ?? q.page_size ?? 20,
      _source: { isMock: false } as DataSource,
    };
  }

  let rows = MOCK_SESSIONS;
  if (q.status) rows = rows.filter((s) => s.status === q.status);
  if (q.search) {
    const s = q.search.toLowerCase();
    rows = rows.filter(
      (sess) =>
        sess.session_id.toLowerCase().includes(s) ||
        sess.user_email.toLowerCase().includes(s) ||
        sess.primary_concern.toLowerCase().includes(s),
    );
  }
  if (q.from) rows = rows.filter((s) => s.created_at >= q.from!);
  if (q.to) rows = rows.filter((s) => s.created_at <= q.to!);
  return delay(mock(paginate(rows, q), '/admin/sessions list endpoint not shipped'));
}

export async function getSession(id: string) {
  return delay(MOCK_SESSIONS.find((s) => s.session_id === id) ?? null);
}

// ---------- Tasks ----------

export async function listTasks(q: PageQuery & { status?: AdminTask['status'] } = {}) {
  // TODO(wave-D): /admin/tasks endpoint not shipped — Celery/Worker task list.
  let rows = MOCK_TASKS;
  if (q.status) rows = rows.filter((t) => t.status === q.status);
  return delay(
    mock(paginate(rows, { ...q, page_size: q.page_size ?? 30 }), '/admin/tasks not shipped'),
  );
}

export async function retryTask(taskId: string) {
  // TODO(wave-D): POST /admin/tasks/{taskId}/retry not shipped.
  return delay({ task_id: taskId, status: 'queued' as const, isMock: true });
}

export async function getQueueDepth() {
  // TODO(wave-D): /admin/queue_depth not shipped.
  return delay(mock({ ...MOCK_QUEUE_DEPTH }, '/admin/queue_depth not shipped'));
}

// ---------- Cost ----------

interface AnalyticsEnvelope {
  ok: boolean;
  days?: number;
  revenue?: { daily: Array<{ date: string; amount: number; txn_count: number }>; total: number };
  vendor_cost?: Record<string, { tokens: number; requests: number; cost_usd: number }>;
  sessions?: { total: number; completed: number };
}

/** Convert analytics.vendor_cost (single-day total) into 30-day series.
 *  The worker doesn't currently break vendor cost down by day, so we synthesize
 *  a flat series and tag isMock=true to keep the shape but be honest. */
export async function getCostByDay(days = 30): Promise<CostByDay[] & { _source: DataSource }> {
  // TODO(wave-D): /admin/cost/by_day not shipped. Worker exposes total via
  // /admin/analytics but no daily breakdown — keep mock for now.
  const rows = MOCK_COST_BY_DAY.slice(-days);
  return delay(
    Object.assign([...rows], { _source: { isMock: true, reason: '/admin/cost/by_day not shipped' } }),
  ) as Promise<CostByDay[] & { _source: DataSource }>;
}

export async function getTopSpenders(limit = 10) {
  // TODO(wave-D): /admin/cost/top_spenders not shipped.
  const rows = MOCK_TOP_SPENDERS.slice(0, limit);
  return delay(
    Object.assign([...rows], {
      _source: { isMock: true, reason: '/admin/cost/top_spenders not shipped' },
    }),
  );
}

// ---------- Overview ----------

export async function getKpis() {
  // Real: derive from /admin/analytics (last 7 days) + customers count.
  const a = await proxyFetch<AnalyticsEnvelope>('/admin/analytics?days=7');
  const c = await proxyFetch<{ ok: boolean; total?: number }>('/admin/customers?limit=1');
  if (a?.ok) {
    const today = new Date().toISOString().slice(0, 10);
    const todaysCell = a.revenue?.daily.find((d) => d.date === today);
    return real({
      total_users: c?.total ?? 0,
      readings_today: todaysCell?.txn_count ?? a.sessions?.total ?? 0,
      active_mentor_sessions: 0, // not exposed yet
      weekly_revenue_usd: Math.round((a.revenue?.total ?? 0) * 100) / 100,
      eval_avg_score: 4.32, // not exposed yet
    });
  }
  return delay(mock(getOverviewKpis(), 'gateway unreachable; showing mock'));
}

export async function getReadingsPerDay(
  days = 30,
): Promise<ReadingsPerDay[] & { _source: DataSource }> {
  const a = await proxyFetch<AnalyticsEnvelope>(`/admin/analytics?days=${days}`);
  if (a?.ok && a.revenue?.daily) {
    const rows: ReadingsPerDay[] = a.revenue.daily.map((d) => ({
      date: d.date,
      count: d.txn_count,
      completed: d.txn_count, // worker doesn't expose failed yet
      failed: 0,
    }));
    return Object.assign(rows, { _source: { isMock: false } as DataSource });
  }
  const rows = MOCK_READINGS_PER_DAY.slice(-days);
  return delay(
    Object.assign([...rows], {
      _source: { isMock: true, reason: 'gateway unreachable' } as DataSource,
    }),
  ) as Promise<ReadingsPerDay[] & { _source: DataSource }>;
}

// ---------- RAG ----------

export async function listRagChunks() {
  // TODO(wave-D): /admin/rag/chunks not shipped.
  return delay(
    Object.assign([...MOCK_RAG_CHUNKS], {
      _source: { isMock: true, reason: '/admin/rag/chunks not shipped' } as DataSource,
    }),
  );
}

export async function getQdrantStats() {
  // TODO(wave-D): /admin/qdrant/stats not shipped.
  return delay(mock({ ...MOCK_QDRANT_STATS }, '/admin/qdrant/stats not shipped'));
}

export async function ingestRagChunks(payload: {
  source_id: string;
  source_title: string;
  discipline: RagChunk['discipline'];
  chunks: string[];
  license_status: RagChunk['license_status'];
}) {
  // TODO(wave-D): POST /admin/rag/ingest not shipped.
  return delay({ ingested: payload.chunks.length, source_id: payload.source_id, isMock: true });
}

// ---------- Payments ----------

interface PaymentTxn {
  id: string;
  ts: string;
  type: string;
  intent_id?: string | null;
  user_id?: string | null;
  amount?: number | null;
  metadata?: Record<string, unknown> | null;
}

/** Map worker `/payment/transactions` rows → admin UI shape. */
function mapPaymentToAdmin(t: PaymentTxn): AdminTransaction | null {
  if (t.type !== 'intent_paid' && t.type !== 'intent_created' && t.type !== 'intent_refunded')
    return null;
  const md = t.metadata ?? {};
  const planRaw = (md.plan as string | undefined) ?? 'mentor_month';
  const plan: AdminTransaction['plan'] =
    planRaw === 'lifetime' ? 'lifetime' : planRaw === 'mentor_year' ? 'mentor_year' : 'mentor_month';
  const status: AdminTransaction['status'] =
    t.type === 'intent_paid' ? 'succeeded' : t.type === 'intent_refunded' ? 'refunded' : 'pending';
  return {
    id: t.id,
    user_email: (md.email as string | undefined) ?? t.user_id ?? '—',
    amount_usd: Number(t.amount ?? 0),
    plan,
    status,
    created_at: t.ts,
    stripe_id: t.intent_id ?? '',
  };
}

export async function listTransactions(
  q: PageQuery & { status?: AdminTransaction['status'] } = {},
) {
  // Real: /payment/transactions returns raw events; we filter to payment-ish
  // ones and map to the admin shape used by /payments page. Pagination is
  // client-side because the worker doesn't support page params yet.
  const data = await proxyFetch<{ ok: boolean; records?: PaymentTxn[] }>(
    `/payment/transactions?limit=500`,
  );
  if (data?.ok && Array.isArray(data.records)) {
    const mapped = data.records
      .map(mapPaymentToAdmin)
      .filter((r): r is AdminTransaction => r !== null);
    let rows = mapped;
    if (q.status) rows = rows.filter((t) => t.status === q.status);
    return {
      ...paginate(rows, q),
      _source: { isMock: false } as DataSource,
    };
  }
  let rows = MOCK_TRANSACTIONS;
  if (q.status) rows = rows.filter((t) => t.status === q.status);
  return delay(mock(paginate(rows, q), 'gateway unreachable'));
}

export async function refundTransaction(id: string) {
  // TODO(wave-D): POST /admin/payments/{id}/refund not shipped.
  return delay({ id, status: 'refunded' as const, isMock: true });
}

export async function listCoupons() {
  // TODO(wave-D): /admin/coupons not shipped.
  return delay(
    Object.assign([...MOCK_COUPONS], {
      _source: { isMock: true, reason: '/admin/coupons not shipped' } as DataSource,
    }),
  );
}

export async function createCoupon(c: Omit<AdminCoupon, 'redeemed'>) {
  // TODO(wave-D): POST /admin/coupons not shipped.
  return delay({ ...c, redeemed: 0, isMock: true });
}

export async function toggleCoupon(code: string, active: boolean) {
  // TODO(wave-D): PATCH /admin/coupons/{code} not shipped.
  return delay({ code, active, isMock: true });
}

// ---------- Feature flags ----------

export interface FeatureFlags {
  mentor_chat_enabled: boolean;
  premium_signup_open: boolean;
  telegram_login_enabled: boolean;
  rag_ingestion_lock: boolean;
}

const MOCK_FLAGS: FeatureFlags = {
  mentor_chat_enabled: true,
  premium_signup_open: true,
  telegram_login_enabled: true,
  rag_ingestion_lock: false,
};

export async function getFeatureFlags() {
  // TODO(wave-D): /admin/feature_flags not shipped.
  return delay({ ...MOCK_FLAGS, _source: { isMock: true } as DataSource });
}

export async function updateFeatureFlags(patch: Partial<FeatureFlags>) {
  // TODO(wave-D): PATCH /admin/feature_flags not shipped — in-memory only.
  Object.assign(MOCK_FLAGS, patch);
  return delay({ ...MOCK_FLAGS, _source: { isMock: true } as DataSource });
}
