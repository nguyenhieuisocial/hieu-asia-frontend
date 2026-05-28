'use client';

/**
 * useEvalTrend — React Query hook for the `/eval` framework dashboard.
 *
 * Wave 60.99 — consumes WW's Worker endpoint at
 *   `${API_BASE}/admin/dashboard/eval-trend?days=30`
 * (proxied through the admin Edge route at
 *   `/api/admin-proxy/admin/dashboard/eval-trend?days=30`
 * which adds the `X-Admin-Token` server-side so the shared token never reaches
 * the browser — same pattern as Wave 60.95.x).
 *
 * Polling: 5 minutes — eval data is updated nightly by a 01:00 VN cron, so a
 * fast poll wastes bandwidth. 5min gives near-immediate visibility once the
 * cron lands without thrashing the Worker.
 *
 * Errors degrade gracefully (Wave 60.95.ad retry pattern):
 *   - 401 → middleware/admin-proxy bounces to /login.
 *   - 404 / 503 → endpoint not deployed yet; page renders empty-state.
 *   - 500 → same fallback; we don't synthesize fake scores.
 */

import { useQuery } from '@tanstack/react-query';

export interface EvalRun {
  /** ULID/UUID for the eval run. */
  run_id: string;
  /** ISO timestamp the run completed. */
  created_at: string;
  /** Median of 3 judges (claude/openai/google) — primary metric. */
  judge_avg: number;
  judge_claude: number;
  judge_openai: number;
  judge_google: number;
  /** Count of personas that scored <8.5 (failure threshold). */
  persona_failures: number;
  /** Total personas evaluated this run (typically 100). */
  total_personas: number;
  /** Model identifier under test (e.g. "claude-sonnet-4-5"). */
  model_under_test: string;
  /** Prompt version SHA / tag (e.g. "v2.4.1"). */
  prompt_version: string;
}

export interface EvalFailure {
  persona_id: string;
  persona_label: string;
  score: number;
  judge_feedback: string;
}

export interface EvalTrendEnvelope {
  ok: boolean;
  /** ISO timestamp the snapshot was generated. */
  generated_at?: string;
  /** Most-recent-first list of nightly eval runs (up to `days` entries). */
  runs?: EvalRun[];
  /** Persona-level failures from the latest run (score <8.5). */
  latest_failures?: EvalFailure[];
  error?: string;
}

const PROXY_PATH = '/api/admin-proxy/admin/dashboard/eval-trend?days=30';

/** 5min polling — eval cron runs nightly so fast polls would just burn quota. */
export const EVAL_TREND_REFETCH_MS = 5 * 60 * 1000;

async function fetchEvalTrend(): Promise<EvalTrendEnvelope> {
  const res = await fetch(PROXY_PATH, { cache: 'no-store' });
  // Defensive parse — admin-proxy returns JSON on every path, but if the Edge
  // runtime errors before the proxy we may receive HTML; surface a typed error
  // instead of crashing JSON.parse.
  const text = await res.text();
  let parsed: EvalTrendEnvelope;
  try {
    parsed = JSON.parse(text) as EvalTrendEnvelope;
  } catch {
    return { ok: false, error: `Phản hồi không hợp lệ (HTTP ${res.status})` };
  }
  if (!res.ok && parsed.ok !== false) {
    return { ok: false, error: parsed.error ?? `HTTP ${res.status}` };
  }
  return parsed;
}

export function useEvalTrend() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'eval-trend', 30],
    queryFn: fetchEvalTrend,
    refetchInterval: EVAL_TREND_REFETCH_MS,
    refetchOnWindowFocus: true,
    // Wave 60.95.ad — exponential backoff (1s, 2s, 4s ... capped 30s).
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
    staleTime: EVAL_TREND_REFETCH_MS / 2,
  });
}
