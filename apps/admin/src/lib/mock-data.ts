/**
 * Realistic mock data for admin dashboard (V1).
 *
 * Backend `/admin/*` endpoints are TBD — this file stands in until they exist.
 * Replace each generator with a real fetch when backend lands.
 *
 * Determinism: seed via index so the dashboard is stable across reloads.
 */

import type { TaskStatus } from '@hieu-asia/types';

// ---------- Users ----------

export interface AdminUser {
  id: string;
  email: string;
  telegram_id: string | null;
  registered_at: string; // ISO date
  last_active_at: string; // ISO date
  plan: 'free' | 'mentor_month' | 'mentor_year' | 'lifetime';
  total_readings: number;
  total_spend_usd: number;
}

const VN_NAMES = [
  'minh', 'an', 'long', 'phuong', 'nhi', 'tu', 'duc', 'hieu', 'mai', 'thanh',
  'huy', 'lan', 'hoa', 'son', 'trang', 'tuan', 'quynh', 'binh', 'linh', 'khang',
  'nam', 'huong', 'dat', 'vy', 'kien', 'thuy', 'phuc', 'ngoc', 'bao', 'yen',
];

function pad(n: number, w = 3) {
  return n.toString().padStart(w, '0');
}

function isoDaysAgo(days: number, hours = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const MOCK_USERS: AdminUser[] = Array.from({ length: 50 }, (_, i) => {
  const name = VN_NAMES[i % VN_NAMES.length]!;
  const idx = i + 1;
  const registeredDaysAgo = 200 - i * 3;
  const planRoll = i % 7;
  const plan: AdminUser['plan'] =
    planRoll === 0 ? 'lifetime' : planRoll <= 2 ? 'mentor_year' : planRoll <= 4 ? 'mentor_month' : 'free';
  return {
    id: `usr_${pad(idx)}`,
    email: `${name}${idx}@example.com`,
    telegram_id: i % 3 === 0 ? `tg_${1_000_000 + idx * 13}` : null,
    registered_at: isoDaysAgo(Math.max(1, registeredDaysAgo)),
    last_active_at: isoDaysAgo(i % 20, i * 3),
    plan,
    total_readings: ((i * 37) % 9) + (plan === 'free' ? 0 : 2),
    total_spend_usd: plan === 'free' ? 0 : Math.round((((i + 3) * 1.3) % 80) * 100) / 100,
  };
});

// ---------- Reading sessions ----------

export interface AdminSession {
  session_id: string;
  task_id: string;
  user_id: string;
  user_email: string;
  status: TaskStatus;
  created_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  cost_usd: number;
  primary_concern: string;
  error: string | null;
}

const CONCERNS = [
  'Dòng tiền căng + middle manager chống đối',
  'Có nên mở chi nhánh thứ 4?',
  'Tìm hướng đi sự nghiệp sau 30 tuổi',
  'Xung đột với co-founder, có nên tách?',
  'Mối quan hệ với cha mẹ chồng',
  'Đầu tư bất động sản hay startup?',
  'Cân nhắc nghỉ việc nhà nước',
  'Mở rộng team marketing, lo overhead',
];

export const MOCK_SESSIONS: AdminSession[] = Array.from({ length: 200 }, (_, i) => {
  const userIdx = i % MOCK_USERS.length;
  const user = MOCK_USERS[userIdx]!;
  const statusRoll = i % 11;
  const status: TaskStatus =
    statusRoll === 0 ? 'failed' : statusRoll === 1 ? 'running' : statusRoll === 2 ? 'queued' : 'completed';
  const createdDays = Math.floor(i / 7);
  const createdHours = (i * 5) % 24;
  const duration = status === 'completed' ? 60 + ((i * 17) % 240) : status === 'failed' ? 30 + (i % 60) : null;
  return {
    session_id: `sess_${pad(i + 1, 4)}`,
    task_id: `task_${pad(i + 1, 4)}`,
    user_id: user.id,
    user_email: user.email,
    status,
    created_at: isoDaysAgo(createdDays, createdHours),
    completed_at: status === 'completed' && duration ? isoDaysAgo(createdDays, createdHours - duration / 3600) : null,
    duration_seconds: duration,
    cost_usd: status === 'completed' ? Math.round((0.08 + (i % 11) * 0.013) * 1000) / 1000 : 0,
    primary_concern: CONCERNS[i % CONCERNS.length]!,
    error: status === 'failed' ? ['VisionAgent timeout', 'Qdrant unreachable', 'LLM rate limit'][i % 3]! : null,
  };
});

// ---------- Celery tasks ----------

export interface AdminTask {
  task_id: string;
  name: string;
  status: TaskStatus;
  started_at: string;
  duration_seconds: number | null;
  retries: number;
  error: string | null;
}

const TASK_NAMES = [
  'reading.orchestrate',
  'reading.vision_analyze',
  'reading.logic_analyze',
  'reading.psychology_analyze',
  'reading.alignment',
  'reading.compose_report',
  'mentor.reply',
  'rag.ingest_chunks',
];

export const MOCK_TASKS: AdminTask[] = Array.from({ length: 30 }, (_, i) => {
  const statusRoll = i % 8;
  const status: TaskStatus =
    statusRoll === 0 ? 'failed' : statusRoll === 1 ? 'running' : statusRoll === 2 ? 'queued' : 'completed';
  const duration = status === 'completed' || status === 'failed' ? 5 + ((i * 13) % 180) : null;
  return {
    task_id: `celery_${pad(i + 1, 4)}`,
    name: TASK_NAMES[i % TASK_NAMES.length]!,
    status,
    started_at: isoDaysAgo(0, i * 2),
    duration_seconds: duration,
    retries: status === 'failed' ? (i % 3) + 1 : 0,
    error: status === 'failed' ? ['TimeoutError', 'ConnectionRefused', 'ValidationError: empty image'][i % 3]! : null,
  };
});

export const MOCK_QUEUE_DEPTH = {
  default: 3,
  high_priority: 0,
  rag: 1,
};

// ---------- Cost tracking ----------

export interface CostByDay {
  date: string; // YYYY-MM-DD
  total_usd: number;
  by_model: Record<string, number>;
}

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet', 'gemini-2.0-flash'];

export const MOCK_COST_BY_DAY: CostByDay[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const base = 4 + Math.sin(i / 4) * 2 + (i % 7 === 6 ? -2 : 0); // weekend dip
  const by_model: Record<string, number> = {};
  MODELS.forEach((m, idx) => {
    by_model[m] = Math.max(0.2, Math.round((base * (0.4 - idx * 0.08) + (i % 5) * 0.3) * 100) / 100);
  });
  return {
    date: date.toISOString().slice(0, 10),
    total_usd: Math.round(Object.values(by_model).reduce((a, b) => a + b, 0) * 100) / 100,
    by_model,
  };
});

export const MOCK_TOP_SPENDERS = MOCK_USERS
  .filter((u) => u.total_spend_usd > 0)
  .sort((a, b) => b.total_spend_usd - a.total_spend_usd)
  .slice(0, 10);

// ---------- Readings per day (for overview chart) ----------

export interface ReadingsPerDay {
  date: string;
  count: number;
  completed: number;
  failed: number;
}

export const MOCK_READINGS_PER_DAY: ReadingsPerDay[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const base = 8 + Math.floor(Math.sin(i / 3) * 4) + (i % 7 === 6 ? -3 : 0);
  const count = Math.max(2, base + (i % 4));
  const failed = i % 9 === 0 ? 1 : 0;
  return {
    date: date.toISOString().slice(0, 10),
    count,
    completed: count - failed,
    failed,
  };
});

// ---------- RAG chunks ----------

export interface RagChunk {
  id: string;
  source_id: string;
  source_title: string;
  discipline: 'tu_vi' | 'palmistry' | 'psychology' | 'general';
  license_status: 'owned_or_licensed' | 'public_domain' | 'fair_use';
  chunk_count: number;
  ingested_at: string;
}

export const MOCK_RAG_CHUNKS: RagChunk[] = [
  { id: 'rag_001', source_id: 'tu_vi_co_dien_vol1', source_title: 'Tử Vi Cổ Điển Quyển 1', discipline: 'tu_vi', license_status: 'owned_or_licensed', chunk_count: 142, ingested_at: isoDaysAgo(45) },
  { id: 'rag_002', source_id: 'tu_vi_co_dien_vol2', source_title: 'Tử Vi Cổ Điển Quyển 2', discipline: 'tu_vi', license_status: 'owned_or_licensed', chunk_count: 138, ingested_at: isoDaysAgo(45) },
  { id: 'rag_003', source_id: 'palmistry_modern', source_title: 'Modern Palmistry Compendium', discipline: 'palmistry', license_status: 'owned_or_licensed', chunk_count: 87, ingested_at: isoDaysAgo(38) },
  { id: 'rag_004', source_id: 'big_five_research', source_title: 'Big Five Personality Research Notes', discipline: 'psychology', license_status: 'fair_use', chunk_count: 64, ingested_at: isoDaysAgo(30) },
  { id: 'rag_005', source_id: 'cbt_handbook', source_title: 'CBT Handbook (excerpts)', discipline: 'psychology', license_status: 'fair_use', chunk_count: 52, ingested_at: isoDaysAgo(22) },
  { id: 'rag_006', source_id: 'enneagram_intro', source_title: 'Enneagram: An Introduction', discipline: 'psychology', license_status: 'owned_or_licensed', chunk_count: 41, ingested_at: isoDaysAgo(15) },
  { id: 'rag_007', source_id: 'iching_commentary', source_title: 'I Ching with Commentary', discipline: 'general', license_status: 'public_domain', chunk_count: 96, ingested_at: isoDaysAgo(7) },
];

export const MOCK_QDRANT_STATS = {
  collection: 'hieu_rag',
  vectors_count: MOCK_RAG_CHUNKS.reduce((acc, c) => acc + c.chunk_count, 0),
  dim: 1536,
  status: 'green' as const,
};

// ---------- Payments / coupons ----------

export interface AdminTransaction {
  id: string;
  user_email: string;
  amount_usd: number;
  plan: 'mentor_month' | 'mentor_year' | 'lifetime';
  status: 'succeeded' | 'refunded' | 'pending' | 'failed';
  created_at: string;
  stripe_id: string;
}

export const MOCK_TRANSACTIONS: AdminTransaction[] = Array.from({ length: 40 }, (_, i) => {
  const user = MOCK_USERS[i % MOCK_USERS.length]!;
  const planRoll = i % 5;
  const plan: AdminTransaction['plan'] =
    planRoll === 0 ? 'lifetime' : planRoll <= 1 ? 'mentor_year' : 'mentor_month';
  const amount = plan === 'lifetime' ? 199 : plan === 'mentor_year' ? 89 : 9.9;
  const statusRoll = i % 13;
  return {
    id: `tx_${pad(i + 1, 4)}`,
    user_email: user.email,
    amount_usd: amount,
    plan,
    status: statusRoll === 0 ? 'refunded' : statusRoll === 1 ? 'failed' : 'succeeded',
    created_at: isoDaysAgo(Math.floor(i / 2), (i * 3) % 24),
    stripe_id: `pi_${Math.random().toString(36).slice(2, 14)}`,
  };
});

export interface AdminCoupon {
  code: string;
  discount_percent: number;
  max_redemptions: number;
  redeemed: number;
  active: boolean;
  expires_at: string | null;
}

export const MOCK_COUPONS: AdminCoupon[] = [
  { code: 'LAUNCH50', discount_percent: 50, max_redemptions: 100, redeemed: 47, active: true, expires_at: isoDaysAgo(-30) },
  { code: 'FRIEND20', discount_percent: 20, max_redemptions: 500, redeemed: 213, active: true, expires_at: null },
  { code: 'EARLYBIRD', discount_percent: 30, max_redemptions: 200, redeemed: 200, active: false, expires_at: isoDaysAgo(15) },
  { code: 'INFLUENCER10', discount_percent: 10, max_redemptions: 1000, redeemed: 89, active: true, expires_at: isoDaysAgo(-60) },
];

// ---------- Overview KPIs ----------

export function getOverviewKpis() {
  const today = new Date().toISOString().slice(0, 10);
  const readingsToday = MOCK_READINGS_PER_DAY.find((d) => d.date === today)?.count ?? 0;
  const activeSessions = MOCK_SESSIONS.filter((s) => s.status === 'running' || s.status === 'queued').length;
  const weeklyRevenue = MOCK_TRANSACTIONS.filter((t) => t.status === 'succeeded' && new Date(t.created_at) > new Date(Date.now() - 7 * 86400_000))
    .reduce((a, t) => a + t.amount_usd, 0);
  return {
    total_users: MOCK_USERS.length,
    readings_today: readingsToday,
    active_mentor_sessions: activeSessions,
    weekly_revenue_usd: Math.round(weeklyRevenue * 100) / 100,
    eval_avg_score: 4.32,
  };
}
