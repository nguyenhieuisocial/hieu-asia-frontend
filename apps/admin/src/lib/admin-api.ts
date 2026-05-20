/**
 * Admin API surface (typed wrappers).
 *
 * V1: all functions return mock data. When backend ships `/admin/*` endpoints,
 * swap the bodies to call apiClient (or a new adminClient).
 *
 * Required backend endpoints (TODO):
 *   GET  /admin/users?search=&page=&page_size=
 *   GET  /admin/users/{id}
 *   GET  /admin/sessions?status=&from=&to=&page=
 *   GET  /admin/sessions/{id}
 *   GET  /admin/tasks
 *   POST /admin/tasks/{id}/retry
 *   GET  /admin/cost/by_day?days=30
 *   GET  /admin/cost/top_spenders?limit=10
 *   GET  /admin/rag/chunks
 *   POST /admin/rag/ingest        (multipart file → text → ingest)
 *   GET  /admin/qdrant/stats
 *   GET  /admin/payments?status=&page=
 *   POST /admin/payments/{id}/refund
 *   GET  /admin/coupons
 *   POST /admin/coupons           (create)
 *   PATCH /admin/coupons/{code}   (toggle active)
 *   GET  /admin/feature_flags
 *   PATCH /admin/feature_flags
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

const MOCK_LATENCY_MS = 80;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

export interface PageQuery {
  page?: number;
  page_size?: number;
  search?: string;
}

function paginate<T>(rows: T[], q: PageQuery): { rows: T[]; total: number; page: number; page_size: number } {
  const page = Math.max(1, q.page ?? 1);
  const page_size = q.page_size ?? 20;
  const start = (page - 1) * page_size;
  return { rows: rows.slice(start, start + page_size), total: rows.length, page, page_size };
}

// ---------- Users ----------

export async function listUsers(q: PageQuery & { plan?: AdminUser['plan'] } = {}) {
  let rows = MOCK_USERS;
  if (q.search) {
    const s = q.search.toLowerCase();
    rows = rows.filter((u) => u.email.toLowerCase().includes(s) || u.id.includes(s));
  }
  if (q.plan) rows = rows.filter((u) => u.plan === q.plan);
  return delay(paginate(rows, q));
}

export async function getUser(id: string) {
  return delay(MOCK_USERS.find((u) => u.id === id) ?? null);
}

// ---------- Sessions ----------

export async function listSessions(
  q: PageQuery & { status?: AdminSession['status']; from?: string; to?: string } = {},
) {
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
  return delay(paginate(rows, q));
}

export async function getSession(id: string) {
  return delay(MOCK_SESSIONS.find((s) => s.session_id === id) ?? null);
}

// ---------- Tasks ----------

export async function listTasks(q: PageQuery & { status?: AdminTask['status'] } = {}) {
  let rows = MOCK_TASKS;
  if (q.status) rows = rows.filter((t) => t.status === q.status);
  return delay(paginate(rows, { ...q, page_size: q.page_size ?? 30 }));
}

export async function retryTask(taskId: string) {
  // TODO: POST /admin/tasks/{taskId}/retry
  return delay({ task_id: taskId, status: 'queued' as const });
}

export async function getQueueDepth() {
  return delay(MOCK_QUEUE_DEPTH);
}

// ---------- Cost ----------

export async function getCostByDay(days = 30): Promise<CostByDay[]> {
  return delay(MOCK_COST_BY_DAY.slice(-days));
}

export async function getTopSpenders(limit = 10) {
  return delay(MOCK_TOP_SPENDERS.slice(0, limit));
}

// ---------- Overview ----------

export async function getKpis() {
  return delay(getOverviewKpis());
}

export async function getReadingsPerDay(days = 30): Promise<ReadingsPerDay[]> {
  return delay(MOCK_READINGS_PER_DAY.slice(-days));
}

// ---------- RAG ----------

export async function listRagChunks() {
  return delay(MOCK_RAG_CHUNKS);
}

export async function getQdrantStats() {
  return delay(MOCK_QDRANT_STATS);
}

export async function ingestRagChunks(payload: {
  source_id: string;
  source_title: string;
  discipline: RagChunk['discipline'];
  chunks: string[];
  license_status: RagChunk['license_status'];
}) {
  // TODO: POST /admin/rag/ingest
  return delay({ ingested: payload.chunks.length, source_id: payload.source_id });
}

// ---------- Payments ----------

export async function listTransactions(q: PageQuery & { status?: AdminTransaction['status'] } = {}) {
  let rows = MOCK_TRANSACTIONS;
  if (q.status) rows = rows.filter((t) => t.status === q.status);
  return delay(paginate(rows, q));
}

export async function refundTransaction(id: string) {
  return delay({ id, status: 'refunded' as const });
}

export async function listCoupons() {
  return delay(MOCK_COUPONS);
}

export async function createCoupon(c: Omit<AdminCoupon, 'redeemed'>) {
  return delay({ ...c, redeemed: 0 });
}

export async function toggleCoupon(code: string, active: boolean) {
  return delay({ code, active });
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
  return delay({ ...MOCK_FLAGS });
}

export async function updateFeatureFlags(patch: Partial<FeatureFlags>) {
  Object.assign(MOCK_FLAGS, patch);
  return delay({ ...MOCK_FLAGS });
}
