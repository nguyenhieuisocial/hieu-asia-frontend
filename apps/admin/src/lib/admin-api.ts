/**
 * Admin API surface (typed wrappers).
 *
 * Each function tries the real backend first (via the `/api/admin-proxy/*`
 * Next.js route → Worker `/admin/*` with `X-Admin-Token`). When the proxy
 * fails (env missing, gateway down, response shape unexpected), we fall back
 * to deterministic mocks from `mock-data.ts` so the UI keeps rendering. The
 * `_source.isMock` tag drives the `MockBanner` so operators can tell what's
 * real vs degraded.
 *
 * Backend endpoints used (all real as of Wave D post-fix):
 *   GET  /admin/analytics?days=30                  revenue, vendor cost, funnel
 *   GET  /admin/customers?search=&plan=&limit=     end-user list (Postgres)
 *   GET  /admin/customers/:id                      customer detail + history
 *   GET  /admin/sessions?status=&search=&...       reading_sessions list
 *   GET  /admin/tasks?status=&...                  reading_tasks list
 *   POST /admin/tasks/:id/retry                    flip status → pending
 *   GET  /admin/queue_depth                        queue snapshot
 *   GET  /admin/cost/by_day                        llm_traces aggregated by day
 *   GET  /admin/cost/top_spenders                  llm_traces aggregated by user
 *   GET  /admin/rag/chunks?limit=&document_id=     corpus_chunks list
 *   GET  /payment/transactions?limit=&user_id=     raw payment events
 *
 * Endpoints NOT shipped yet (mock-only — TODO marked `isMock: true`):
 *   GET  /admin/qdrant/stats        (Qdrant moved to pgvector; stats TBD)
 *   POST /admin/rag/ingest
 *   GET  /admin/coupons
 *   POST /admin/coupons, PATCH /admin/coupons/{code}
 *   GET  /admin/feature_flags, PATCH /admin/feature_flags
 *   POST /admin/payments/{id}/refund
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
  timeoutMs = 25_000,
): Promise<T | null> {
  // Bumped 8s → 25s. Vercel serverless cold-start can take 5-15s for the
  // first proxy hit after idle. 8s was triggering false "gateway unreachable"
  // banners across most admin pages on first load.
  if (typeof window === 'undefined' && typeof fetch === 'undefined') return null;
  const ctrl = new AbortController();
  const t = setTimeout(
    () => ctrl.abort(new DOMException(`Proxy timeout after ${timeoutMs}ms`, 'TimeoutError')),
    timeoutMs,
  );
  try {
    const res = await fetch(`${PROXY}${path}`, {
      cache: 'no-store',
      credentials: 'same-origin',
      ...init,
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
    // 401 unauthenticated → session expired/invalid. Bounce to login so the
    // user actually re-auths instead of seeing the page fall back to mocks
    // silently (which hides the real problem). Only triggers in the browser.
    if (res.status === 401 && typeof window !== 'undefined') {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
      return null;
    }
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

interface BackendSessionRow {
  session_id: string;
  state_json?: Record<string, unknown> | null;
  updated_at: string;
}

/**
 * Legacy `TaskModel` row returned by `postgres_store.list_sessions`. Has no
 * `state_json` — `listSessions` distinguishes by checking that field.
 */
interface LegacyTaskRow {
  session_id: string;
  task_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  error?: string | null;
}

type BackendSessionListRow = BackendSessionRow | LegacyTaskRow;

interface SessionsEnvelope {
  ok?: boolean;
  sessions?: BackendSessionListRow[];
  /** Legacy worker path may return `items` instead of `sessions`. */
  items?: BackendSessionListRow[];
  total?: number;
  next_cursor?: string | null;
}

/**
 * Detail returned by `GET /admin/sessions/:id`. Superset of list row + a few
 * presentation fields. Uses index signature for forward-compat fields not
 * yet pinned down.
 */
interface BackendSessionDetail {
  session_id: string;
  task_id?: string;
  user_id?: string;
  user_email?: string;
  pipeline_status?: string;
  created_at?: string;
  updated_at?: string;
  duration_seconds?: number | null;
  cost_usd?: number | string;
  primary_concern?: string;
  error?: string | null;
  final_report_markdown?: string | null;
  chat_history?: unknown[];
  /** Full raw state_json for admin debugging (Wave 58.12 — Birth/Tử Vi/Insights). */
  state_json?: Record<string, unknown>;
  [extra: string]: unknown;
}

/** Map backend status strings → UI TaskStatus. */
function normalizeStatus(s: unknown): AdminSession['status'] {
  const v = String(s ?? '').toLowerCase();
  if (v === 'done' || v === 'completed' || v === 'report_ready') return 'completed';
  if (v === 'failed' || v === 'error') return 'failed';
  if (v === 'running' || v === 'processing') return 'running';
  return 'queued';
}

/** Map a Postgres reading_sessions row → admin UI shape. */
function mapBackendSession(row: BackendSessionRow): AdminSession {
  const st = (row.state_json ?? {}) as Record<string, unknown>;
  const createdRaw = st.created_at as string | undefined;
  const userId = (st.user_id as string | undefined) ?? '';
  const birth = (st.birth_data ?? {}) as Record<string, unknown>;
  const primary =
    (st.primary_concern as string | undefined) ??
    (st.user_question as string | undefined) ??
    (birth.name as string | undefined) ??
    '—';
  const status = normalizeStatus(st.status ?? st.state);
  const createdAt = createdRaw ?? row.updated_at;
  let duration: number | null = null;
  if (status === 'completed' || status === 'failed') {
    const dt = Math.floor((new Date(row.updated_at).getTime() - new Date(createdAt).getTime()) / 1000);
    duration = Number.isFinite(dt) && dt >= 0 ? dt : null;
  }
  return {
    session_id: row.session_id,
    task_id: (st.task_id as string | undefined) ?? row.session_id,
    user_id: userId,
    user_email: (st.user_email as string | undefined) ?? userId ?? '—',
    status,
    created_at: createdAt,
    completed_at: status === 'completed' ? row.updated_at : null,
    duration_seconds: duration,
    cost_usd: Number(st.cost_usd ?? 0) || 0,
    primary_concern: primary,
    error: (st.error as string | undefined) ?? null,
  };
}

/** UI status → backend `state_json.status` filter value. */
function uiStatusToBackend(s: AdminSession['status']): string {
  if (s === 'completed') return 'report_ready';
  if (s === 'failed') return 'failed';
  if (s === 'running') return 'running';
  return 'pending';
}

export async function listSessions(
  q: PageQuery & { status?: AdminSession['status']; from?: string; to?: string } = {},
) {
  const pageSize = q.page_size ?? 20;
  const offset = ((q.page ?? 1) - 1) * pageSize;
  const qs = new URLSearchParams();
  qs.set('limit', String(pageSize));
  // Worker uses cursor; emulate offset → cursor via base64({offset}) so this
  // page-based UI keeps working without protocol churn.
  if (offset > 0) qs.set('cursor', btoa(JSON.stringify({ offset })));
  if (q.status) qs.set('status', uiStatusToBackend(q.status));
  if (q.from) qs.set('from', q.from);
  if (q.to) qs.set('to', q.to);
  const real = await proxyFetch<SessionsEnvelope>(`/admin/sessions?${qs.toString()}`);
  const sessionsList = real?.sessions || real?.items;
  if (real && real.ok !== false && Array.isArray(sessionsList)) {
    let rows = sessionsList.map((row): AdminSession => {
      // BackendSessionRow has state_json (modern path); LegacyTaskRow doesn't.
      if ('state_json' in row && row.state_json) {
        return mapBackendSession(row as BackendSessionRow);
      }
      // Legacy TaskModel row (e.g. from postgres_store list_sessions)
      const legacy = row as LegacyTaskRow;
      return {
        session_id: legacy.session_id,
        task_id: legacy.task_id || legacy.session_id,
        user_id: `anon-${legacy.session_id}`,
        user_email: `anon-${legacy.session_id}`,
        status: normalizeStatus(legacy.status),
        created_at: legacy.created_at || new Date().toISOString(),
        completed_at: legacy.status === 'completed' ? (legacy.updated_at ?? null) : null,
        duration_seconds: null,
        cost_usd: 0,
        primary_concern: '—',
        error: legacy.error ?? null,
      };
    });
    // Search filter is applied client-side because Postgres needs a full-text
    // index for `state_json` deep search; cheap for the current row volume.
    if (q.search) {
      const s = q.search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.session_id.toLowerCase().includes(s) ||
          r.user_email.toLowerCase().includes(s) ||
          r.primary_concern.toLowerCase().includes(s),
      );
    }
    return {
      rows,
      total: real.total ?? rows.length + offset,
      page: q.page ?? 1,
      page_size: pageSize,
      _source: { isMock: false } as DataSource,
    };
  }

  // Mock fallback.
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
  return delay(mock(paginate(rows, q), 'gateway unreachable; showing mock'));
}

export async function getSession(id: string) {
  const real = await proxyFetch<BackendSessionDetail>(
    `/admin/sessions/${encodeURIComponent(id)}`,
  );
  if (real) {
    // Map backend response fields to the frontend AdminSession shape.
    // Wave 58.12: also pass through state_json + duration_seconds for the
    // detail page's new Birth/Tử Vi/Final Report/Insights sections.
    return {
      session_id: real.session_id,
      task_id: real.task_id || real.session_id,
      user_id: real.user_id || '',
      user_email: real.user_email || real.user_id || '—',
      status: normalizeStatus(real.pipeline_status),
      created_at: real.created_at || new Date().toISOString(),
      completed_at:
        real.pipeline_status === 'completed' ? (real.updated_at ?? null) : null,
      duration_seconds:
        typeof real.duration_seconds === 'number' ? real.duration_seconds : null,
      cost_usd: Number(real.cost_usd ?? 0) || 0,
      primary_concern: real.primary_concern || '—',
      error: real.error || null,
      final_report_markdown: real.final_report_markdown || null,
      chat_history: real.chat_history || [],
      state_json: real.state_json ?? null,
      _source: { isMock: false } as DataSource,
    };
  }
  // Try fallback in mock sessions. Enrich with the same shape as the real
  // path so callers can read state_json/final_report_markdown without
  // narrowing — they just see null/[]/null defaults in mock mode.
  const mockSess = MOCK_SESSIONS.find((s) => s.session_id === id);
  if (mockSess) {
    return delay(
      mock(
        {
          ...mockSess,
          final_report_markdown: null as string | null,
          chat_history: [] as unknown[],
          state_json: null as Record<string, unknown> | null,
        },
        'gateway unreachable; showing mock',
      ),
    );
  }
  return delay(null);
}

// ---------- Tasks ----------

interface BackendTaskRow {
  task_id: string;
  session_id: string;
  status: string;
  error: string | null;
  created_at: string;
  updated_at: string;
}

interface TasksEnvelope {
  ok: boolean;
  tasks?: BackendTaskRow[];
  total?: number;
  next_cursor?: string | null;
}

function mapBackendTask(row: BackendTaskRow): AdminTask {
  const status = normalizeStatus(row.status);
  let duration: number | null = null;
  if (status === 'completed' || status === 'failed') {
    const dt = Math.floor(
      (new Date(row.updated_at).getTime() - new Date(row.created_at).getTime()) / 1000,
    );
    duration = Number.isFinite(dt) && dt >= 0 ? dt : null;
  }
  return {
    task_id: row.task_id,
    name: row.session_id, // backend has no task name yet — surface session id for traceability
    status,
    started_at: row.created_at,
    duration_seconds: duration,
    retries: 0, // reading_tasks has no retries column yet
    error: row.error,
  };
}

function uiTaskStatusToBackend(s: AdminTask['status']): string {
  if (s === 'completed') return 'done';
  if (s === 'failed') return 'failed';
  if (s === 'running') return 'processing';
  return 'pending';
}

export async function listTasks(q: PageQuery & { status?: AdminTask['status'] } = {}) {
  const pageSize = q.page_size ?? 30;
  const offset = ((q.page ?? 1) - 1) * pageSize;
  const qs = new URLSearchParams();
  qs.set('limit', String(pageSize));
  if (offset > 0) qs.set('cursor', btoa(JSON.stringify({ offset })));
  if (q.status) qs.set('status', uiTaskStatusToBackend(q.status));
  const real = await proxyFetch<TasksEnvelope>(`/admin/tasks?${qs.toString()}`);
  if (real?.ok !== false && Array.isArray(real?.tasks)) {
    const rows = real.tasks.map(mapBackendTask);
    return {
      rows,
      total: real.total ?? rows.length + offset,
      page: q.page ?? 1,
      page_size: pageSize,
      _source: { isMock: false } as DataSource,
    };
  }
  let rows = MOCK_TASKS;
  if (q.status) rows = rows.filter((t) => t.status === q.status);
  return delay(
    mock(paginate(rows, { ...q, page_size: pageSize }), 'gateway unreachable; showing mock'),
  );
}

export async function retryTask(taskId: string) {
  const real = await proxyFetch<{ ok: boolean; task?: BackendTaskRow }>(
    `/admin/tasks/${encodeURIComponent(taskId)}/retry`,
    { method: 'POST' },
  );
  if (real?.ok && real.task) {
    return { task_id: real.task.task_id, status: 'queued' as const, isMock: false };
  }
  return delay({ task_id: taskId, status: 'queued' as const, isMock: true });
}

interface QueueDepthEnvelope {
  ok: boolean;
  queue?: { pending?: number; processing?: number; completed?: number; failed?: number };
  oldest_pending_age_seconds?: number | null;
}

export async function getQueueDepth() {
  const real = await proxyFetch<QueueDepthEnvelope>('/admin/queue_depth');
  if (real?.ok && real.queue) {
    return Object.assign(
      {
        // Backend has no queue partitioning yet — map pending → default,
        // processing → high_priority so the existing 3-card layout stays
        // meaningful without misleading numbers.
        default: real.queue.pending ?? 0,
        high_priority: real.queue.processing ?? 0,
        rag: 0,
        oldest_pending_age_seconds: real.oldest_pending_age_seconds ?? null,
      },
      { _source: { isMock: false } as DataSource },
    );
  }
  return delay(mock({ ...MOCK_QUEUE_DEPTH }, 'gateway unreachable; showing mock'));
}

// ---------- Cost ----------

interface AnalyticsEnvelope {
  ok: boolean;
  days?: number;
  revenue?: { daily: Array<{ date: string; amount: number; txn_count: number }>; total: number };
  vendor_cost?: Record<string, { tokens: number; requests: number; cost_usd: number }>;
  sessions?: { total: number; completed: number };
}

interface CostByDayEnvelope {
  ok: boolean;
  days?: Array<{ day: string; cost_usd: number; request_count: number; tokens_total: number }>;
}

/** Fetch llm_traces daily rollup. Returns a slice of the last N days. */
export async function getCostByDay(days = 30): Promise<CostByDay[] & { _source: DataSource }> {
  const real = await proxyFetch<CostByDayEnvelope>('/admin/cost/by_day');
  if (real?.ok && Array.isArray(real.days)) {
    const rows: CostByDay[] = real.days.slice(-days).map((d) => ({
      date: d.day,
      total_usd: Number(d.cost_usd ?? 0),
      // Backend doesn't yet break out by model. Keep the by_model field as a
      // single bucket so the stacked chart still renders.
      by_model: { all_models: Number(d.cost_usd ?? 0) },
    }));
    return Object.assign(rows, { _source: { isMock: false } as DataSource }) as CostByDay[] & {
      _source: DataSource;
    };
  }
  const rows = MOCK_COST_BY_DAY.slice(-days);
  return delay(
    Object.assign([...rows], {
      _source: { isMock: true, reason: 'gateway unreachable; showing mock' } as DataSource,
    }),
  ) as Promise<CostByDay[] & { _source: DataSource }>;
}

interface TopSpendersEnvelope {
  ok: boolean;
  top_spenders?: Array<{ user_id: string; cost_usd: number; request_count: number }>;
}

export async function getTopSpenders(limit = 10) {
  const real = await proxyFetch<TopSpendersEnvelope>('/admin/cost/top_spenders');
  if (real?.ok && Array.isArray(real.top_spenders)) {
    const rows = real.top_spenders.slice(0, limit).map((u) => ({
      // Shape adapter: cost page reads .id, .email, .total_spend_usd.
      id: u.user_id || 'anonymous',
      email: u.user_id || 'anonymous',
      telegram_id: null,
      registered_at: '',
      last_active_at: '',
      plan: 'free' as AdminUser['plan'],
      total_readings: u.request_count,
      total_spend_usd: Number(u.cost_usd ?? 0),
    }));
    return Object.assign([...rows], { _source: { isMock: false } as DataSource });
  }
  const rows = MOCK_TOP_SPENDERS.slice(0, limit);
  return delay(
    Object.assign([...rows], {
      _source: { isMock: true, reason: 'gateway unreachable; showing mock' },
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

interface RagChunksEnvelope {
  ok: boolean;
  chunks?: Array<{
    id: string;
    document_id: string;
    chunk_index: number;
    page_from: number | null;
    page_to: number | null;
    content: string;
    metadata: Record<string, unknown>;
    token_count: number | null;
    created_at: string;
  }>;
}

export async function listRagChunks() {
  const real = await proxyFetch<RagChunksEnvelope>('/admin/rag/chunks?limit=100');
  if (real?.ok && Array.isArray(real.chunks)) {
    // The UI table shows one row per source (document). Roll chunks up.
    const byDoc = new Map<string, RagChunk>();
    for (const c of real.chunks) {
      const meta = c.metadata ?? {};
      const discipline = (meta.discipline as RagChunk['discipline']) ?? 'general';
      const title = (meta.title as string | undefined) ?? c.document_id;
      const license =
        (meta.license_status as RagChunk['license_status']) ?? 'owned_or_licensed';
      const existing = byDoc.get(c.document_id);
      if (existing) {
        existing.chunk_count += 1;
        if (c.created_at < existing.ingested_at) existing.ingested_at = c.created_at;
      } else {
        byDoc.set(c.document_id, {
          id: c.document_id,
          source_id: c.document_id,
          source_title: title,
          discipline,
          license_status: license,
          chunk_count: 1,
          ingested_at: c.created_at,
        });
      }
    }
    const rows = Array.from(byDoc.values());
    return Object.assign(rows, { _source: { isMock: false } as DataSource });
  }
  return delay(
    Object.assign([...MOCK_RAG_CHUNKS], {
      _source: { isMock: true, reason: 'gateway unreachable; showing mock' } as DataSource,
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
// Feature-flag CRUD lives in `frontend/apps/admin/src/app/feature-flags/page.tsx`
// which calls the worker directly (GET /admin/feature-flags + POST /admin/feature-flags/toggle).
// The old mock-only `getFeatureFlags` / `updateFeatureFlags` were removed because
// they wrote to a module-level object that never persisted and used a stale
// 4-flag schema that drifted from the worker's real 6-flag schema.
