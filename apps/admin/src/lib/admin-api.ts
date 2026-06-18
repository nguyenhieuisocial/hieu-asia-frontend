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
  MOCK_SESSIONS,
  MOCK_TASKS,
  MOCK_COST_BY_DAY,
  MOCK_TOP_SPENDERS,
  MOCK_READINGS_PER_DAY,
  MOCK_RAG_CHUNKS,
  MOCK_QDRANT_STATS,
  MOCK_TRANSACTIONS,
  MOCK_QUEUE_DEPTH,
  getOverviewKpis,
  type AdminUser,
  type AdminSession,
  type AdminTask,
  type CostByDay,
  type ReadingsPerDay,
  type RagChunk,
  type AdminTransaction,
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
// Removed mock listUsers/getUser (they had no callers and a misleading
// "not yet on backend" TODO). Real end-users live on the /customers page
// (GET /admin/customers); admin login accounts live on /users (GET /admin/users).

// ---------- Sessions ----------

interface BackendSessionRow {
  session_id: string;
  state_json?: Record<string, unknown> | null;
  updated_at: string;
  // Wave 65 — friendly identifiers (migration 0053).
  short_code?: string | null;
  label?: string | null;
  note?: string | null;
  // Sessions enrichment wave — payment + reading-type/channel signals added by
  // the parallel backend PR. Top-level on the list row (payment is derived from
  // a KV key the backend joins). All optional → render "—" when absent.
  paid?: boolean | null;
  tier?: string | null;
  paid_at?: string | null;
  reading_type?: string | null;
  channel?: string | null;
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
  // Sessions enrichment wave — payment + reading-type/channel signals (parallel
  // backend PR). Optional → detail page renders "—" / hides cards when absent.
  paid?: boolean | null;
  tier?: string | null;
  paid_at?: string | null;
  reading_type?: string | null;
  channel?: string | null;
  // Detail-only enrichments (BE PR #45): per-session paid amount + txn ref, and
  // the customer's recent feedback (user-scoped by email, NOT per-session).
  paid_amount_vnd?: number | null;
  paid_txn_ref?: string | null;
  user_feedback?: Array<{
    ts?: string;
    surface?: string;
    rating?: number | null;
    message?: string | null;
    status?: string | null;
  }>;
  // Wave 65 — friendly identifiers (migration 0053). Returned by the detail
  // endpoint alongside the list; surfaced so the detail page can prefill its
  // rename/note dialog.
  short_code?: string | null;
  label?: string | null;
  note?: string | null;
  [extra: string]: unknown;
}

/** Map backend status strings → UI TaskStatus. */
function normalizeStatus(s: unknown): AdminSession['status'] {
  const v = String(s ?? '').toLowerCase();
  if (v === 'done' || v === 'completed' || v === 'report_ready') return 'completed';
  // Backend encodes failures as 'failed' OR 'error_at_*' / 'error_internal' — match any
  // 'error*' so failed sessions/tasks show the error badge + Retry instead of "queued".
  if (v === 'failed' || v.includes('error')) return 'failed';
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
  // Wave 60.20-fu — Worker writes request metadata under flat keys or a nested
  // `request` / `client` envelope. Fall through both. Mirrors the extractor
  // already used in /sessions/[id] detail card.
  const reqEnv = (st.request ?? st.client ?? {}) as Record<string, unknown>;
  const ip = (st.ip as string | undefined)
    ?? (st.ip_address as string | undefined)
    ?? (reqEnv.ip as string | undefined)
    ?? (reqEnv.cf_connecting_ip as string | undefined)
    ?? null;
  const country = (st.country as string | undefined)
    ?? (reqEnv.country as string | undefined)
    ?? (reqEnv.cf_country as string | undefined)
    ?? null;
  const city = (st.city as string | undefined)
    ?? (reqEnv.city as string | undefined)
    ?? (reqEnv.cf_city as string | undefined)
    ?? null;
  const region = (st.region as string | undefined)
    ?? (reqEnv.region as string | undefined)
    ?? null;
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
    ip,
    country,
    city,
    region,
    short_code: row.short_code ?? null,
    label: row.label ?? null,
    note: row.note ?? null,
    // Payment is joined onto the row top-level by the backend (derived from the
    // `session:unlocked:<id>` KV key). reading_type / channel may arrive either
    // top-level or inside state_json — read both. All graceful-null.
    paid: typeof row.paid === 'boolean' ? row.paid : null,
    tier: row.tier ?? (st.tier as string | undefined) ?? null,
    paid_at: row.paid_at ?? (st.paid_at as string | undefined) ?? null,
    reading_type: row.reading_type ?? (st.reading_type as string | undefined) ?? null,
    channel: row.channel ?? (st.channel as string | undefined) ?? null,
  };
}

export async function listSessions(
  q: PageQuery & {
    status?: AdminSession['status'];
    from?: string;
    to?: string;
    // Sessions enrichment wave — backend filter params.
    reading_type?: string;
    channel?: string;
    /** '1' (paid) | '0' (unpaid). */
    paid?: '1' | '0';
    /** ISO-3166-1 alpha-2 country code (e.g. "VN"). */
    country?: string;
    /** Group-by-user: scope the list to a single user_id. */
    user_id?: string;
  } = {},
) {
  const pageSize = q.page_size ?? 20;
  const offset = ((q.page ?? 1) - 1) * pageSize;
  const qs = new URLSearchParams();
  qs.set('limit', String(pageSize));
  // Worker uses cursor; emulate offset → cursor via base64({offset}) so this
  // page-based UI keeps working without protocol churn.
  if (offset > 0) qs.set('cursor', btoa(JSON.stringify({ offset })));
  // Backend canonicalizes row status to the same union the UI uses
  // (queued|running|completed|failed), so send q.status verbatim. Translating to
  // legacy 'report_ready'/'pending' here made the completed/queued filters match 0 rows.
  if (q.status) qs.set('status', q.status);
  if (q.from) qs.set('from', q.from);
  if (q.to) qs.set('to', q.to);
  if (q.reading_type) qs.set('reading_type', q.reading_type);
  if (q.channel) qs.set('channel', q.channel);
  if (q.paid) qs.set('paid', q.paid);
  if (q.country) qs.set('country', q.country);
  if (q.user_id) qs.set('user_id', q.user_id);
  // Server-side search (#34): backend does an ILIKE across
  // session_id / short_code / label / user_email. Whole-DB, not page-slice.
  if (q.search) qs.set('search', q.search);
  const real = await proxyFetch<SessionsEnvelope>(`/admin/sessions?${qs.toString()}`);
  const sessionsList = real?.sessions || real?.items;
  if (real && real.ok !== false && Array.isArray(sessionsList)) {
    const rows = sessionsList.map((row): AdminSession => {
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
    // Search is now applied server-side (#34): the `search` query param above
    // makes the backend run an ILIKE across session_id / short_code / label /
    // user_email, so the backend rows are returned directly (whole-DB match,
    // not just the current page slice).
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
  if (q.user_id) rows = rows.filter((s) => s.user_id === q.user_id);
  if (q.reading_type) rows = rows.filter((s) => s.reading_type === q.reading_type);
  if (q.channel) rows = rows.filter((s) => s.channel === q.channel);
  if (q.paid) rows = rows.filter((s) => (s.paid ? '1' : '0') === q.paid);
  if (q.country) {
    const cc = q.country.toUpperCase();
    rows = rows.filter((s) => (s.country ?? '').toUpperCase() === cc);
  }
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

/**
 * Wave 65 — whole-DB session aggregates (GET /admin/sessions/stats).
 * The list endpoint paginates, so the KPI strip could only sum the current
 * page; this returns true totals. Returns null on gateway failure (caller
 * falls back to page-slice aggregates).
 */
export interface SessionsStats {
  total: number;
  last_1h: number;
  by_status: Partial<Record<'queued' | 'running' | 'completed' | 'failed', number>>;
  // Sessions enrichment wave — whole-DB payment + health aggregates (parallel
  // backend PR). Optional → KPI strip shows "—" when the backend predates them.
  revenue_vnd?: number;
  paid_count?: number;
  stuck_count?: number;
}

export async function getSessionsStats(): Promise<SessionsStats | null> {
  const real = await proxyFetch<{ ok?: boolean } & SessionsStats>('/admin/sessions/stats');
  if (real && real.ok !== false && typeof real.total === 'number') {
    return {
      total: real.total,
      last_1h: real.last_1h ?? 0,
      by_status: real.by_status ?? {},
      revenue_vnd: typeof real.revenue_vnd === 'number' ? real.revenue_vnd : undefined,
      paid_count: typeof real.paid_count === 'number' ? real.paid_count : undefined,
      stuck_count: typeof real.stuck_count === 'number' ? real.stuck_count : undefined,
    };
  }
  return null;
}

/**
 * Wave 65 — set the human label / note on a session
 * (PATCH /admin/sessions/:id). Empty string clears to null server-side.
 */
export async function patchSession(
  sessionId: string,
  patch: { label?: string | null; note?: string | null },
): Promise<{ ok: boolean; error?: string }> {
  const real = await proxyFetch<{ ok?: boolean; error?: string }>(
    `/admin/sessions/${encodeURIComponent(sessionId)}`,
    { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) },
  );
  if (real && real.ok !== false) return { ok: true };
  return { ok: false, error: real?.error ?? 'gateway unreachable' };
}

/**
 * Manual paid-access override (POST /admin/sessions/:id/access — backend #41).
 * Reaches the worker the same way as patchSession: via the generic
 * `/api/admin-proxy/*` route, which injects X-Admin-Token server-side.
 *
 * - grant: write the `session:unlocked:<id>` signal (tier defaults to "premium"
 *   server-side when omitted) so the paid-reading gate accepts the session.
 * - revoke: delete that signal. ACCESS-ONLY — moves no money; SePay refunds are
 *   manual bank transfers done by the founder. `reason` is recorded in the audit
 *   log only.
 */
export async function setSessionAccess(
  sessionId: string,
  body: { action: 'grant' | 'revoke'; tier?: string; reason?: string },
): Promise<{ ok: boolean; error?: string }> {
  const real = await proxyFetch<{ ok?: boolean; error?: string }>(
    `/admin/sessions/${encodeURIComponent(sessionId)}/access`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
  );
  if (real && real.ok !== false) return { ok: true };
  return { ok: false, error: real?.error ?? 'gateway unreachable' };
}

// ---------- Contact customer (transactional email) ----------
//
// Wraps the worker's existing `POST /admin/email/send` (api-gateway index.ts).
// IMPORTANT: that endpoint does NOT accept a freeform subject/body — it renders
// one of a FIXED set of Resend templates (src/email/templates.ts) and only takes
// `{ template, to, args }`. So "contact customer" is a template picker, not a
// freeform composer. The union below mirrors the real template arg shapes 1:1;
// adding a key here without a matching backend template will 400 ("unknown
// template" / template render failure). Owner not required — POST → admin rank
// in the proxy role gate.
export type AdminEmailTemplate =
  | { template: 'readingComplete'; args: { readingType: string; viewUrl: string } }
  | { template: 'welcome'; args: { userName?: string; signinUrl: string } }
  | { template: 'dailyHoroscope'; args: { zodiac: string; date: string; summary: string; fullUrl: string } };

/**
 * Send a transactional email to a customer via the worker's Resend templates.
 * `to` is the recipient email. Returns `{ ok }` plus the worker's error string
 * on failure (e.g. Resend rejected, unknown template) so the dialog can toast it.
 */
export async function sendAdminEmail(
  to: string,
  payload: AdminEmailTemplate,
  opts: { replyTo?: string } = {},
): Promise<{ ok: boolean; error?: string }> {
  const real = await proxyFetch<{ ok?: boolean; error?: string }>('/admin/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      template: payload.template,
      to,
      args: payload.args,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    }),
  });
  if (real && real.ok !== false) return { ok: true };
  return { ok: false, error: real?.error ?? 'gateway unreachable' };
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
      // Sessions enrichment wave — payment + reading-type/channel. Top-level on
      // the detail response (or inside state_json) per the parallel backend PR.
      paid: typeof real.paid === 'boolean' ? real.paid : null,
      tier: real.tier ?? (real.state_json?.tier as string | undefined) ?? null,
      paid_at: real.paid_at ?? (real.state_json?.paid_at as string | undefined) ?? null,
      reading_type:
        real.reading_type ?? (real.state_json?.reading_type as string | undefined) ?? null,
      channel: real.channel ?? (real.state_json?.channel as string | undefined) ?? null,
      paid_amount_vnd: typeof real.paid_amount_vnd === 'number' ? real.paid_amount_vnd : null,
      paid_txn_ref: real.paid_txn_ref ?? null,
      user_feedback: Array.isArray(real.user_feedback) ? real.user_feedback : [],
      // Wave 65 — friendly identifiers, surfaced for the detail page's
      // rename/note dialog (mirrors the list row mapping).
      short_code: real.short_code ?? null,
      label: real.label ?? null,
      note: real.note ?? null,
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
          paid_amount_vnd: null as number | null,
          paid_txn_ref: null as string | null,
          user_feedback: [] as Array<{
            ts?: string;
            surface?: string;
            rating?: number | null;
            message?: string | null;
            status?: string | null;
          }>,
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
    // Preserve the raw worker status (e.g. 'error_at_vision_agent') — `status`
    // above collapses every failure to 'failed', so the /tasks failure-reason
    // breakdown reads this to recover the failure category.
    raw_status: row.status,
  };
}

function uiTaskStatusToBackend(s: AdminTask['status']): string {
  if (s === 'completed') return 'done';
  // NOTE: the backend stores failures as 'error_at_*' / 'error_internal', so a plain
  // ?status=failed equality won't match until handleTasksList accepts a canonical
  // 'failed' (backend follow-up). 'running'/'done'/'pending' DO match the real column.
  if (s === 'failed') return 'failed';
  if (s === 'running') return 'running';
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
  // Forward the window so the backend (which now honors ?days=, clamp 1..90) returns
  // the selected range — otherwise the 7/14/30/90 picker silently always got 30 days.
  const real = await proxyFetch<CostByDayEnvelope>(`/admin/cost/by_day?days=${days}`);
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

export async function getTopSpenders(limit = 10, days = 30) {
  const real = await proxyFetch<TopSpendersEnvelope>(`/admin/cost/top_spenders?days=${days}`);
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
      // NOT exposed by the backend yet — these are placeholders. The dashboard must
      // NOT present them as live metrics (active_mentor_sessions=0 reads as "none";
      // eval_avg_score is a fixed fake). weekly_revenue is VND (SePay), not USD —
      // the field keeps its legacy name but the dashboard formats it as VND.
      active_mentor_sessions: 0,
      weekly_revenue_usd: Math.round(a.revenue?.total ?? 0),
      eval_avg_score: 0,
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

// ---------- Signups ----------

export interface SignupsByDay {
  days: Array<{ date: string; count: number }>;
  total: number;
  today: number;
  /** Previous-window total for delta. Optional — backend may omit it. */
  prev_total?: number;
}

interface SignupsByDayEnvelope {
  ok: boolean;
  days?: Array<{ date: string; count: number }>;
  total?: number;
  today?: number;
  prev_total?: number;
}

/**
 * New-signups daily rollup. Powers the "Khách mới hôm nay" dashboard KPI.
 *
 * Backend endpoint `GET /admin/signups/by_day?days=N` is shipping in a parallel
 * wave. Until it's deployed proxyFetch returns null (404 → !res.ok → null), so
 * this returns null too — NO mock fallback. The dashboard renders "—" / hides
 * the card gracefully instead of inventing numbers.
 */
export async function getSignupsByDay(days = 30): Promise<SignupsByDay | null> {
  const real = await proxyFetch<SignupsByDayEnvelope>(`/admin/signups/by_day?days=${days}`);
  if (real?.ok && Array.isArray(real.days)) {
    return {
      days: real.days,
      total: Number(real.total ?? 0),
      today: Number(real.today ?? 0),
      prev_total: real.prev_total != null ? Number(real.prev_total) : undefined,
    };
  }
  return null;
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
  created_at: string;
  type: string;
  intent_id?: string | null;
  user_id?: string | null;
  amount?: number | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Map worker `/payment/transactions` rows → admin UI shape.
 *
 * Contract (verified against backend payment/transactions.ts TransactionRecord):
 *   - timestamp field is `created_at` (NOT `ts`)
 *   - paid plan lives in `metadata.tier` (subscription_monthly | subscription_yearly |
 *     lifetime | lifetime_onetime | premium) — there is NO `metadata.plan` / `metadata.email`
 *   - refunds use type `refund` / `refund_completed` — there is NO `intent_refunded`
 *   - `amount` is VND (SePay); it is surfaced in the legacy `amount_usd` field but the
 *     UI formats it as VND. There is no USD anywhere in this product.
 */
function mapPaymentToAdmin(t: PaymentTxn): AdminTransaction | null {
  const isPaid = t.type === 'intent_paid';
  const isCreated = t.type === 'intent_created';
  const isRefund = t.type === 'refund' || t.type === 'refund_completed';
  if (!isPaid && !isCreated && !isRefund) return null;
  const md = t.metadata ?? {};
  const tier = (md.tier as string | undefined) ?? '';
  const plan: AdminTransaction['plan'] =
    tier === 'lifetime' || tier === 'lifetime_onetime'
      ? 'lifetime'
      : tier === 'subscription_yearly'
        ? 'mentor_year'
        : 'mentor_month';
  const status: AdminTransaction['status'] = isPaid
    ? 'succeeded'
    : isRefund
      ? 'refunded'
      : 'pending';
  return {
    id: t.id,
    // Backend records carry no email — surface user_id (UI column relabelled to "User ID").
    user_email: t.user_id ?? '—',
    amount_usd: Number(t.amount ?? 0),
    plan,
    status,
    created_at: t.created_at,
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

// Refunds are NOT a generic transaction action here. Real refunds live on the
// /sepay page (owner-gated manual SePay workflow → POST /admin/sepay/refund). The
// old mock `refundTransaction` falsely reported success and was removed.

// Coupons CRUD lives on the dedicated /coupons page (real backend: GET /admin/coupons,
// POST /admin/coupons/revoke). The old mock listCoupons/createCoupon/toggleCoupon used a
// wrong schema and were removed so the /payments page can't show fake coupon data.

// ---------- Feature flags ----------
// Feature-flag CRUD lives in `frontend/apps/admin/src/app/feature-flags/page.tsx`
// which calls the worker directly (GET /admin/feature-flags + POST /admin/feature-flags/toggle).
// The old mock-only `getFeatureFlags` / `updateFeatureFlags` were removed because
// they wrote to a module-level object that never persisted and used a stale
// 4-flag schema that drifted from the worker's real 6-flag schema.

// ---------- Billing / Subscriptions ----------
//
// Removed: the mock-only listSubscriptions / cancelSubscription / listFailedPayments /
// retryFailedPayment / getMrrByMonth helpers. They presented fabricated Stripe-shaped
// data the SePay backend never produces. The REAL surfaces are:
//   - active subscriptions  → /sepay page (GET /admin/sepay/subscriptions, VND, expiry)
//   - revenue / AOV         → /sepay page (real SePay transactions, VND)
//   - refund workflow       → /sepay page (owner-gated manual approve/complete)
// There is no failed-payment retry or MRR concept for one-off SePay bank transfers.

// ---------- "Hạ tầng" infra hub (read-only vendor detail panels) ----------
//
// Each wrapper hits the worker dispatcher `GET /admin/infra/<tool>` via the
// admin proxy and returns the FULL envelope (success OR not-configured) so the
// page can render an honest setup-card. We do NOT use `proxyFetch` here: it
// returns null whenever `ok === false`, which would erase the worker's
// `configured:false` + `error` fields. A raw fetch (mirroring `gsc-api.ts`)
// preserves them. On network/parse failure we synthesize an `ok:false,
// configured:true` envelope so the page shows an ErrorBlock + retry.
//
// FOLLOW-UP TOOLS: add a `<Tool>Item` interface + a `getInfra<Tool>()` wrapper
// that calls `fetchInfra<...>("<tool>")` with the matching item type. The
// worker side just needs a new `case "<tool>"` in `infra-hub.ts`.

/**
 * Shared envelope every /admin/infra/<tool> endpoint returns.
 *
 * `S` (default `unknown`) is an optional summary object some tools attach to the
 * success payload (e.g. Cloudflare 24h totals, AI Gateway spend). Tools without
 * a summary leave it off; `InfraPanel<T>` ignores it and pages that need it read
 * `query.data.summary` directly.
 */
export type InfraEnvelope<T, S = unknown> =
  | { ok: true; configured: true; items: T[]; summary?: S }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export interface InfraVercelItem {
  uid: string;
  name: string | null;
  state: string | null;
  target: string | null;
  created: number | null;
  url: string | null;
  commit_message: string | null;
}

/**
 * Infra-hub v2 wave 2 — Vercel deploy-frequency summary + 14d series.
 * All fields optional → the page hides the StatCard strip / chart when the
 * worker predates them.
 */
export interface InfraVercelSummary {
  deploys_7d?: number;
  success_rate_pct?: number;
  last_prod_state?: string | null;
  last_prod_age_min?: number | null;
}

/** One day of Vercel deploy outcomes (asc, ≤14 days). */
export interface InfraVercelSeriesPoint {
  date: string;
  success: number;
  failed: number;
}

export interface InfraSentryItem {
  id: string;
  title: string;
  culprit: string | null;
  count: number;
  userCount: number;
  lastSeen: string | null;
  permalink: string | null;
  level: string;
  /** Wave-3 detail (optional → older workers omit). firstSeen + 24h sparkline. */
  firstSeen?: string | null;
  /** Hourly event counts over the trailing 24h for a tiny inline sparkline. */
  spark_24h?: number[] | null;
  /** True when the issue was first seen within the last 24h. */
  is_new_24h?: boolean;
}

/**
 * Infra-hub v2 wave 2 — Sentry top-issues summary. All optional → the page
 * renders the StatCard strip only for the fields the worker sends.
 */
export interface InfraSentrySummary {
  errors_24h?: number;
  unresolved_count?: number;
  fatal_count?: number;
  top_issue?: { title: string; count: number } | null;
}

export interface InfraResendItem {
  id: string;
  to: string | null;
  subject: string | null;
  last_event: string | null;
  created_at: string | null;
}

/**
 * Infra-hub v2 wave 2 — Resend delivery-status counts. All optional → only the
 * counts the worker provides become StatCards.
 */
export interface InfraResendSummary {
  delivered?: number;
  bounced?: number;
  complained?: number;
  delayed?: number;
  queued?: number;
  sent?: number;
  other?: number;
}

/**
 * Infra-hub v2 (worker PR #203) — Cloudflare now returns Pages/Workers
 * *deployments* (most-recent first), not daily request rollups. The token may
 * still lack deployment read scope → the worker returns a notConfigured setup
 * card, which `InfraPanel` already renders.
 */
export interface InfraCloudflareItem {
  id: string;
  created_on: string;
  author_email: string | null;
  message: string | null;
  source: string | null;
  live: boolean;
}

export interface InfraCloudflareSummary {
  total_deployments: number;
  live_deployment_at: string | null;
}

export interface InfraSupabaseItem {
  schema: string;
  table: string;
  rows: number;
}

export interface InfraSupabaseSummary {
  total_tables: number;
}

export interface InfraLangfuseItem {
  id: string;
  name: string | null;
  timestamp: string | null;
  latency_ms: number | null;
  cost_usd: number | null;
  user_id: string | null;
}

/**
 * Infra-hub v2 wave 2 — Langfuse 24h summary. All optional → the page renders
 * the StatCard strip only for the fields present.
 *
 * NOTE: the worker exposes `error_rate_pct` but the Langfuse API has no error
 * field, so it is always 0 from this source. Do NOT surface it as meaningful —
 * the page omits it from the StatCards.
 */
export interface InfraLangfuseSummary {
  spend_today_usd?: number;
  traces_24h?: number;
  latency_avg_ms?: number | null;
  latency_p95_ms?: number | null;
  error_rate_pct?: number;
}

/** One day of Langfuse trace/cost/latency (asc, ≤30 days). */
export interface InfraLangfuseSeriesPoint {
  date: string;
  traces: number;
  cost_usd: number;
  latency_avg_ms: number | null;
}

/** Per-role Langfuse rollup (desc by traces). */
export interface InfraLangfuseRole {
  role: string;
  traces: number;
  cost_usd: number;
  error_rate_pct: number;
}

/** Per-model rollup from the Daily Metrics API (desc by cost). Wave-3. */
export interface InfraLangfuseModelRow {
  model: string;
  traces: number;
  observations: number;
  total_tokens: number;
  cost_usd: number;
}

/** Quality score / eval attached to a trace (GET /scores). Wave-3. */
export interface InfraLangfuseScore {
  id: string;
  name: string | null;
  value: number | string | null;
  data_type: string | null;
  trace_id: string | null;
  comment: string | null;
  timestamp: string | null;
}

/** Optional filters forwarded to the Langfuse traces API. */
export interface InfraLangfuseFilters {
  name?: string;
  userId?: string;
  fromTimestamp?: string;
  toTimestamp?: string;
}

export interface InfraGithubItem {
  repo: string;
  workflow: string;
  status: string | null;
  conclusion: string | null;
  branch: string | null;
  actor: string | null;
  created_at: string | null;
  url: string | null;
  // Infra-hub v2 wave 3+4 — the run's numeric id, needed to re-run a failed run
  // via POST /admin/infra/github/rerun. Optional → older worker deploys omit it
  // and the page hides the "Chạy lại" button.
  run_id?: number | string | null;
}

/**
 * Infra-hub v2 (worker PR #203) — GitHub summary now carries the last Worker
 * deploy result + a cache flag. Both optional → the page hides the card / pill
 * when the worker predates these fields.
 */
export interface InfraGithubSummary {
  last_worker_deploy?: { conclusion: string | null; created_at: string | null };
  cached?: boolean;
}

/**
 * Infra-detail wave — Dependabot security alerts carried top-level on the
 * GitHub success envelope. `available:false` → the GITHUB_TOKEN lacks the
 * `security_events` scope; the page shows an honest note instead of cards.
 */
export interface InfraGithubDependabot {
  available: boolean;
  total: number;
  by_severity: { critical: number; high: number; medium: number; low: number };
  items: Array<{
    repo: string | null;
    package: string | null;
    ecosystem: string | null;
    severity: string | null;
    ghsa_id: string | null;
    cve_id: string | null;
    url: string | null;
    summary: string | null;
  }>;
}

/** Infra-detail wave — one open pull request, carried top-level. */
export interface InfraGithubPullRequest {
  repo: string;
  number: number | null;
  title: string | null;
  author: string | null;
  draft: boolean;
  head: string | null;
  base: string | null;
  created_at: string | null;
  url: string | null;
  checks: 'success' | 'failure' | 'pending' | 'none';
}

/** Infra-detail wave — one recent commit on the default branch, top-level. */
export interface InfraGithubCommit {
  repo: string;
  sha: string | null;
  message: string | null;
  author: string | null;
  date: string | null;
  url: string | null;
}

/**
 * GitHub success envelope also carries top-level dependabot / pull_requests /
 * recent_commits extras (infra-detail wave). Mirror the AI Gateway pattern:
 * intersect the success branch with the optional extras without changing the
 * shared `InfraEnvelope`.
 */
export type InfraGithubEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraGithubItem[];
      summary?: InfraGithubSummary;
      dependabot?: InfraGithubDependabot;
      pull_requests?: InfraGithubPullRequest[];
      recent_commits?: InfraGithubCommit[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export interface InfraTelegramItem {
  bot: string;
  username: string | null;
  status: string | null;
  webhook_url: string | null;
  pending_updates: number | null;
  // Infra-detail wave — per-bot getMe capabilities + webhook config + commands.
  // All optional/null → the expanded detail panel renders honest fallbacks.
  id?: number | null;
  can_join_groups?: boolean | null;
  can_read_all_group_messages?: boolean | null;
  supports_inline_queries?: boolean | null;
  /** EPOCH SECONDS — convert to ms before formatting. */
  last_error_date?: number | null;
  last_error_message?: string | null;
  ip_address?: string | null;
  max_connections?: number | null;
  allowed_updates?: string[] | null;
  has_custom_certificate?: boolean | null;
  commands?: Array<{ command: string; description: string }>;
}

export interface InfraAiGatewayItem {
  vendor: string;
  model: string;
  requests: number;
  cost_usd: number;
  error_rate_pct: number;
  // Infra-hub v2 (worker PR #203) — per-model latency + top error class.
  // Optional → older worker deploys omit them; the table renders "—".
  latency_avg_ms?: number | null;
  latency_p95_ms?: number | null;
  error_class_top?: Array<{ error_class: string; count: number }>;
}

export interface InfraAiGatewaySummary {
  total_requests: number;
  total_cost_usd: number;
  // Infra-hub v2 — prepaid balance + low-balance flag (worker PR #203).
  // Optional → render the balance card only when present.
  balance_usd?: number | null;
  low_balance?: boolean;
  // Infra-detail wave — lifetime spend (all-time). Optional → render the
  // "Tổng đã tiêu từ trước đến nay" card only when present.
  total_spend_usd?: number;
}

/** Infra-hub v2 — 30d cost/request/error daily series for the AI Gateway chart. */
export interface InfraAiGatewaySeriesPoint {
  date: string;
  requests: number;
  cost_usd: number;
  errors: number;
}

/**
 * Infra-hub — one BetterStack uptime monitor (worker `handleInfraUptime`).
 * `response_time_ms` is null from the monitors LIST endpoint (latency lives at a
 * separate /response-times endpoint); `paused` covers status "paused" + a
 * maintenance window.
 */
export interface InfraUptimeItem {
  id: string;
  name: string;
  url: string | null;
  status: string;
  last_checked_at: string | null;
  response_time_ms: number | null;
  paused: boolean;
  // Infra-detail wave — extra monitor config surfaced from the BetterStack
  // monitors LIST endpoint. All optional/null → table renders "—".
  monitor_type?: string | null;
  /** Check interval, seconds. */
  check_frequency?: number | null;
  /** Request timeout, seconds. */
  request_timeout?: number | null;
  /** Days until TLS cert expiry (HTTP/TLS monitors only; null otherwise). */
  ssl_expiration?: number | null;
}

/** Monitor status counts. */
export interface InfraUptimeSummary {
  total: number;
  up: number;
  down: number;
  paused: number;
}

/** One recent BetterStack incident. */
export interface InfraUptimeIncident {
  id: string;
  name: string;
  started_at: string | null;
  resolved_at: string | null;
  status: string;
}

/**
 * Low-level infra fetch. Returns the parsed envelope for 2xx AND for the
 * documented 503 not-configured / 502 vendor-error responses (both carry
 * `ok:false`). Bounces to /login on 401. Never throws — a thrown fetch or
 * unparseable body degrades to an `ok:false, configured:true` envelope.
 */
async function fetchInfra<T, S = unknown>(
  tool: string,
): Promise<InfraEnvelope<T, S>> {
  try {
    const res = await fetch(`${PROXY}/admin/infra/${tool}`, {
      cache: 'no-store',
      credentials: 'same-origin',
    });
    if (res.status === 401 && typeof window !== 'undefined') {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
      return { ok: false, configured: true, error: 'unauthenticated' };
    }
    const text = await res.text();
    let parsed: InfraEnvelope<T, S> | undefined;
    try {
      parsed = text ? (JSON.parse(text) as InfraEnvelope<T, S>) : undefined;
    } catch {
      parsed = undefined;
    }
    if (parsed && typeof parsed.ok === 'boolean') return parsed;
    return {
      ok: false,
      configured: true,
      error: `infra ${tool} → HTTP ${res.status}`,
    };
  } catch (err) {
    return { ok: false, configured: true, error: (err as Error).message };
  }
}

/**
 * Vercel success envelope also carries a top-level 14d deploy `series` (wave 2)
 * alongside the summary. Mirror the AI Gateway pattern: intersect the success
 * branch with the optional summary + series without changing `InfraEnvelope`.
 */
export type InfraVercelEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraVercelItem[];
      summary?: InfraVercelSummary;
      series?: InfraVercelSeriesPoint[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export function getInfraVercel(): Promise<InfraVercelEnvelope> {
  return fetchInfra<InfraVercelItem, InfraVercelSummary>(
    'vercel',
  ) as Promise<InfraVercelEnvelope>;
}

export function getInfraSentry(): Promise<
  InfraEnvelope<InfraSentryItem, InfraSentrySummary>
> {
  return fetchInfra<InfraSentryItem, InfraSentrySummary>('sentry');
}

export function getInfraResend(): Promise<
  InfraEnvelope<InfraResendItem, InfraResendSummary>
> {
  return fetchInfra<InfraResendItem, InfraResendSummary>('resend');
}

export function getInfraCloudflare(): Promise<
  InfraEnvelope<InfraCloudflareItem, InfraCloudflareSummary>
> {
  return fetchInfra<InfraCloudflareItem, InfraCloudflareSummary>('cloudflare');
}

export function getInfraSupabase(): Promise<
  InfraEnvelope<InfraSupabaseItem, InfraSupabaseSummary>
> {
  return fetchInfra<InfraSupabaseItem, InfraSupabaseSummary>('supabase');
}

/**
 * Langfuse success envelope carries a top-level 30d `series` + per-role
 * breakdown (`by_role`) alongside the summary (wave 2). Same intersection trick
 * as AI Gateway / Vercel.
 */
export type InfraLangfuseEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraLangfuseItem[];
      summary?: InfraLangfuseSummary;
      series?: InfraLangfuseSeriesPoint[];
      /** Whether `series` came from the real Daily Metrics API or the trace sample. */
      series_source?: 'daily_metrics' | 'trace_sample';
      by_role?: InfraLangfuseRole[];
      by_model?: InfraLangfuseModelRow[];
      scores?: InfraLangfuseScore[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export function getInfraLangfuse(
  filters?: InfraLangfuseFilters,
): Promise<InfraLangfuseEnvelope> {
  const qs = new URLSearchParams();
  if (filters?.name) qs.set('name', filters.name);
  if (filters?.userId) qs.set('userId', filters.userId);
  if (filters?.fromTimestamp) qs.set('fromTimestamp', filters.fromTimestamp);
  if (filters?.toTimestamp) qs.set('toTimestamp', filters.toTimestamp);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return fetchInfra<InfraLangfuseItem, InfraLangfuseSummary>(
    `langfuse${suffix}`,
  ) as Promise<InfraLangfuseEnvelope>;
}

export function getInfraGithub(): Promise<InfraGithubEnvelope> {
  return fetchInfra<InfraGithubItem, InfraGithubSummary>(
    'github',
  ) as Promise<InfraGithubEnvelope>;
}

export function getInfraTelegram(): Promise<InfraEnvelope<InfraTelegramItem>> {
  return fetchInfra<InfraTelegramItem>('telegram');
}

/**
 * AI Gateway success envelope also carries a top-level 30d `series` (worker
 * PR #203). `fetchInfra` returns the raw parsed body, so we intersect the
 * success branch with the optional series to surface it without changing the
 * shared `InfraEnvelope`.
 */
export type InfraAiGatewayEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraAiGatewayItem[];
      summary?: InfraAiGatewaySummary;
      series?: InfraAiGatewaySeriesPoint[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export function getInfraAiGateway(): Promise<InfraAiGatewayEnvelope> {
  return fetchInfra<InfraAiGatewayItem, InfraAiGatewaySummary>(
    'ai-gateway',
  ) as Promise<InfraAiGatewayEnvelope>;
}

/**
 * Uptime success envelope also carries `summary` (status counts) + `incidents`
 * (recent ≤10). Mirror the AI Gateway pattern: intersect the success branch with
 * the optional extras without changing the shared `InfraEnvelope`.
 */
export type InfraUptimeEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraUptimeItem[];
      summary?: InfraUptimeSummary;
      incidents?: InfraUptimeIncident[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export function getInfraUptime(): Promise<InfraUptimeEnvelope> {
  return fetchInfra<InfraUptimeItem, InfraUptimeSummary>(
    'uptime',
  ) as Promise<InfraUptimeEnvelope>;
}

// ---------- Infra-hub v2 wave 3+4 — detail fetches + safe POST actions --------
//
// Detail GETs return a richer per-record envelope than the list endpoints; the
// drawers fetch them lazily (React Query enabled only when open, keyed by id).
// They reuse `fetchInfraDetail` (raw fetch like `fetchInfra` so an `ok:false`
// body isn't erased) and never throw.
//
// Actions are POSTs. They DELIBERATELY do NOT use `proxyFetch` — that helper
// returns null whenever `ok === false`, which would hide the worker's
// `{ok:false, error}` result. The action buttons need the real result to toast
// success vs the friendly error (e.g. token missing a write scope). `postInfra`
// returns the parsed envelope verbatim and degrades to `{ok:false, error}` on
// any network/parse failure so callers can always toast something.

/** Sentry issue detail (GET /admin/infra/sentry/:id). */
export interface InfraSentryDetailIssue {
  id: string;
  title: string;
  culprit: string | null;
  level: string;
  status: string | null;
  count: number;
  userCount: number;
  firstSeen: string | null;
  lastSeen: string | null;
  permalink: string | null;
  metadata?: Record<string, unknown> | null;
  /** Wave-3: release context + new-issue flag (optional → older workers omit). */
  first_release?: string | null;
  last_release?: string | null;
  is_new_24h?: boolean;
}

export interface InfraSentryBreadcrumb {
  category: string | null;
  message: string | null;
  level: string | null;
  timestamp: string | null;
}

export interface InfraSentryLatestEvent {
  exception: { type: string | null; value: string | null } | null;
  frames: Array<{ filename: string | null; function: string | null; lineNo: number | null }>;
  tags: Array<{ key: string; value: string }>;
  /** Wave-3: breadcrumb trail + release tag (optional → older workers omit). */
  breadcrumbs?: InfraSentryBreadcrumb[];
  release?: string | null;
}

export interface InfraSentryEventRow {
  id: string;
  title: string | null;
  dateCreated: string | null;
}

export type InfraSentryDetailEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraSentryItem[];
      issue: InfraSentryDetailIssue;
      latest_event: InfraSentryLatestEvent | null;
      /** Wave-3 extras — all optional so older workers degrade gracefully. */
      stats_24h?: number[] | null;
      stats_14d?: number[] | null;
      recent_events?: InfraSentryEventRow[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

/** Vercel deployment detail (GET /admin/infra/vercel/:uid). */
export interface InfraVercelDetailDeployment {
  uid: string;
  name: string | null;
  state: string | null;
  target: string | null;
  created: number | null;
  ready: number | null;
  buildingAt: number | null;
  url: string | null;
  inspectorUrl: string | null;
  gitSource: { ref: string | null; sha: string | null } | null;
  creator: string | null;
  meta: {
    githubCommitMessage?: string | null;
    githubCommitAuthorName?: string | null;
  } | null;
}

export interface InfraVercelBuildLog {
  text: string;
  type: string | null;
  created: number | null;
}

export type InfraVercelDetailEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraVercelItem[];
      deployment: InfraVercelDetailDeployment;
      build_logs?: InfraVercelBuildLog[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

/** Raw detail fetch (mirrors `fetchInfra`, but for a specific record path). */
async function fetchInfraDetail<E extends { ok: boolean }>(path: string): Promise<E> {
  try {
    const res = await fetch(`${PROXY}/admin/infra${path}`, {
      cache: 'no-store',
      credentials: 'same-origin',
    });
    if (res.status === 401 && typeof window !== 'undefined') {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
      return { ok: false, configured: true, error: 'unauthenticated' } as unknown as E;
    }
    const text = await res.text();
    let parsed: E | undefined;
    try {
      parsed = text ? (JSON.parse(text) as E) : undefined;
    } catch {
      parsed = undefined;
    }
    if (parsed && typeof parsed.ok === 'boolean') return parsed;
    return { ok: false, configured: true, error: `infra detail → HTTP ${res.status}` } as unknown as E;
  } catch (err) {
    return { ok: false, configured: true, error: (err as Error).message } as unknown as E;
  }
}

export function getInfraSentryDetail(id: string): Promise<InfraSentryDetailEnvelope> {
  return fetchInfraDetail<InfraSentryDetailEnvelope>(
    `/sentry/${encodeURIComponent(id)}`,
  );
}

export function getInfraVercelDetail(uid: string): Promise<InfraVercelDetailEnvelope> {
  return fetchInfraDetail<InfraVercelDetailEnvelope>(
    `/vercel/${encodeURIComponent(uid)}`,
  );
}

/** Uptime monitor detail (GET /admin/infra/uptime/:monitorId). */
export interface InfraUptimeDetailMonitor {
  id: string;
  name: string;
  url: string | null;
  status: string;
  monitor_type: string | null;
  check_frequency: number | null;
  request_timeout: number | null;
  request_method: string | null;
  ssl_expiration: number | null;
  paused: boolean;
  last_checked_at: string | null;
  created_at: string | null;
}

/** One ≤60-point response-time sparkline sample. */
export interface InfraUptimeResponseTime {
  at: string | null;
  response_time_ms: number | null;
}

/** SLA availability over the monitor's plan window (null when not on plan). */
export interface InfraUptimeAvailability {
  availability_pct: number | null;
  total_downtime_sec: number | null;
}

/** One ≤25 incident for this monitor (detail view). */
export interface InfraUptimeDetailIncident {
  id: string;
  name: string;
  cause: string | null;
  started_at: string | null;
  acknowledged_at: string | null;
  resolved_at: string | null;
  status: string;
  duration_sec: number | null;
}

export type InfraUptimeDetailEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraUptimeItem[];
      monitor: InfraUptimeDetailMonitor;
      response_times: InfraUptimeResponseTime[];
      availability: InfraUptimeAvailability | null;
      incidents: InfraUptimeDetailIncident[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export function getInfraUptimeDetail(id: string): Promise<InfraUptimeDetailEnvelope> {
  return fetchInfraDetail<InfraUptimeDetailEnvelope>(
    `/uptime/${encodeURIComponent(id)}`,
  );
}

/**
 * Supabase ROW BROWSER (GET /admin/infra/supabase/rows?table=&limit=).
 * OWNER-gated in the admin-proxy. Rows arrive with sensitive columns masked
 * server-side ("•••"); `masked_columns` lists which were redacted. A non-owner
 * (or any failure) gets an `ok:false` envelope — never throws.
 */
export type InfraSupabaseRow = Record<string, unknown>;

export type InfraSupabaseRowsEnvelope =
  | {
      ok: true;
      configured: true;
      table: string;
      columns: string[];
      rows: InfraSupabaseRow[];
      row_count: number;
      masked_columns: string[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export function getInfraSupabaseRows(
  table: string,
  limit: number,
): Promise<InfraSupabaseRowsEnvelope> {
  const qs = new URLSearchParams();
  qs.set('table', table);
  qs.set('limit', String(limit));
  return fetchInfraDetail<InfraSupabaseRowsEnvelope>(`/supabase/rows?${qs.toString()}`);
}

/** Langfuse single-trace DETAIL (GET /admin/infra/langfuse/:traceId). */
export interface InfraLangfuseTrace {
  id: string;
  name: string | null;
  timestamp: string | null;
  latency_ms: number | null;
  cost_usd: number | null;
  user_id: string | null;
  /** Wave-3: summed observation tokens + derived error flag (optional). */
  total_tokens?: number | null;
  has_error?: boolean;
}

export interface InfraLangfuseObservation {
  name: string | null;
  type: string | null;
  latency_ms: number | null;
  model: string | null;
  input_preview: string | null;
  output_preview: string | null;
  /** Wave-3 enrichment — all optional so older workers degrade gracefully. */
  start_time?: string | null;
  end_time?: string | null;
  level?: string | null;
  status_message?: string | null;
  cost_usd?: number | null;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  total_tokens?: number | null;
}

export type InfraLangfuseDetailEnvelope =
  | {
      ok: true;
      configured: true;
      items: InfraLangfuseItem[];
      trace: InfraLangfuseTrace;
      observations: InfraLangfuseObservation[];
    }
  | { ok: false; configured: false; error: string }
  | { ok: false; configured: true; error: string };

export function getInfraLangfuseDetail(
  traceId: string,
): Promise<InfraLangfuseDetailEnvelope> {
  return fetchInfraDetail<InfraLangfuseDetailEnvelope>(
    `/langfuse/${encodeURIComponent(traceId)}`,
  );
}

/** Result of every infra action — the worker's `{ok, ...}` envelope verbatim. */
export type InfraActionResult = { ok: boolean; error?: string } & Record<string, unknown>;

/**
 * POST an infra action and return the parsed `{ok, ...}` envelope. Unlike
 * `proxyFetch`, it does NOT collapse `ok:false` to null — callers need the real
 * result (and `error`) to show a success vs friendly-error toast. Never throws.
 */
async function postInfra(
  path: string,
  body?: Record<string, unknown>,
): Promise<InfraActionResult> {
  try {
    const res = await fetch(`${PROXY}/admin/infra${path}`, {
      method: 'POST',
      cache: 'no-store',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (res.status === 401 && typeof window !== 'undefined') {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
      return { ok: false, error: 'unauthenticated' };
    }
    const text = await res.text();
    let parsed: InfraActionResult | undefined;
    try {
      parsed = text ? (JSON.parse(text) as InfraActionResult) : undefined;
    } catch {
      parsed = undefined;
    }
    if (parsed && typeof parsed.ok === 'boolean') return parsed;
    return { ok: false, error: `infra action → HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export function postInfraResendTest(): Promise<InfraActionResult> {
  return postInfra('/resend/send-test');
}

export function postInfraTelegramTest(): Promise<InfraActionResult> {
  return postInfra('/telegram/send-test');
}

export function postInfraGithubRerun(
  repo: string,
  runId: number | string,
): Promise<InfraActionResult> {
  return postInfra('/github/rerun', { repo, run_id: runId });
}

export function postInfraSentryResolve(id: string): Promise<InfraActionResult> {
  return postInfra(`/sentry/${encodeURIComponent(id)}/resolve`);
}

export function postInfraSentryIgnore(id: string): Promise<InfraActionResult> {
  return postInfra(`/sentry/${encodeURIComponent(id)}/ignore`);
}

// ---------- Infra-hub v2 — Cloudflare KV browser (worker PR #203) ----------
//
// Read-only browser over the operational KV namespaces (sessions / cache /
// affiliates). Three endpoints under /admin/infra/kv, all HTTP 200 with an
// `{ok, configured, ...}` envelope. We reuse the same fetch-through-proxy
// pattern as `fetchInfra` (raw fetch so an `ok:false` body isn't erased), and
// build query strings with encodeURIComponent.

/** A curated (namespace, prefix) shortcut shown as a clickable chip. The BE
 * annotates each chip with an approximate key count (`count`, `exact`). */
export interface InfraKvChip {
  label: string;
  ns: string;
  prefix: string;
  /** Approximate keys under this prefix (one list page). */
  count?: number;
  /** false when the count hit the 1000-key page cap → render "≥1000". */
  exact?: boolean;
}

/** A bound namespace, annotated with an approximate total key count. */
export interface InfraKvNamespace {
  binding: string;
  count?: number;
  exact?: boolean;
}

export interface InfraKvNamespacesResp {
  ok: boolean;
  configured: boolean;
  namespaces?: InfraKvNamespace[];
  chips?: InfraKvChip[];
  error?: string;
}

export interface InfraKvKeyItem {
  name: string;
  expiration: number | null;
}

export interface InfraKvKeysResp {
  ok: boolean;
  configured: boolean;
  ns?: string;
  prefix?: string;
  /** Echoes the active substring filter (search mode only). */
  contains?: string;
  items?: InfraKvKeyItem[];
  cursor?: string | null;
  list_complete?: boolean;
  /** Search mode: how many keys were scanned before filtering. */
  scanned?: number;
  /** Search mode: true when the scan hit the ~1000-key cap. */
  scan_truncated?: boolean;
  error?: string;
}

export interface InfraKvValueResp {
  ok: boolean;
  configured: boolean;
  ns?: string;
  key?: string;
  value?: string | null;
  metadata?: Record<string, unknown> | null;
  redacted?: boolean;
  truncated?: boolean;
  not_found?: boolean;
  /** UTF-8 byte length of the raw (pre-truncation) value. */
  bytes?: number;
  /** Key's expiration (unix-seconds) or null = no TTL. */
  expiration?: number | null;
  error?: string;
}

/** Shared raw fetch for KV endpoints. Mirrors `fetchInfra`: never throws;
 * bounces to /login on 401; degrades to an `ok:false` envelope on any error. */
async function fetchInfraKv<T extends { ok: boolean; configured: boolean; error?: string }>(
  path: string,
): Promise<T> {
  try {
    const res = await fetch(`${PROXY}/admin/infra/kv${path}`, {
      cache: 'no-store',
      credentials: 'same-origin',
    });
    if (res.status === 401 && typeof window !== 'undefined') {
      const next = window.location.pathname + window.location.search;
      window.location.href = `/login?reason=session_invalid&next=${encodeURIComponent(next)}`;
      return { ok: false, configured: true, error: 'unauthenticated' } as T;
    }
    const text = await res.text();
    let parsed: T | undefined;
    try {
      parsed = text ? (JSON.parse(text) as T) : undefined;
    } catch {
      parsed = undefined;
    }
    if (parsed && typeof parsed.ok === 'boolean') return parsed;
    return { ok: false, configured: true, error: `infra kv → HTTP ${res.status}` } as T;
  } catch (err) {
    return { ok: false, configured: true, error: (err as Error).message } as T;
  }
}

/** Namespaces + curated prefix chips for the KV browser landing state. */
export function getInfraKvCatalog(): Promise<InfraKvNamespacesResp> {
  return fetchInfraKv<InfraKvNamespacesResp>('');
}

/** List keys in `ns` filtered by `prefix`; pass `cursor` to page further. Pass
 * `contains` to switch to server-side substring search (bounded ~1000-key scan;
 * no paging — the result set is already bounded). */
export function getInfraKvKeys(
  ns: string,
  prefix: string,
  cursor?: string | null,
  contains?: string,
): Promise<InfraKvKeysResp> {
  const qs = new URLSearchParams();
  qs.set('ns', ns);
  qs.set('prefix', prefix);
  if (cursor) qs.set('cursor', cursor);
  if (contains) qs.set('contains', contains);
  return fetchInfraKv<InfraKvKeysResp>(`/keys?${qs.toString()}`);
}

/** Read a single key's value + metadata (redacted/truncated server-side). */
export function getInfraKvValue(ns: string, key: string): Promise<InfraKvValueResp> {
  const qs = new URLSearchParams();
  qs.set('ns', ns);
  qs.set('key', key);
  return fetchInfraKv<InfraKvValueResp>(`/value?${qs.toString()}`);
}
