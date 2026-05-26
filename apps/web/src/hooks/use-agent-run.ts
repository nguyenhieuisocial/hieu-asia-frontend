/**
 * Wave 56 Phase 2.3 — Supabase Realtime progress subscription hook.
 *
 * Subscribes to `agent_runs:run_id=eq.<run>` channel so the client receives
 * UPDATE events as the graph progresses (current_node, cost_usd, status).
 * Falls back to 2s polling if Realtime fails to connect within 3s — keeps
 * UX moving even when the WebSocket is blocked (corporate firewall, etc.).
 *
 * RLS note (Phase 2.2 migration): anon cannot SELECT agent_runs directly.
 * For guest readings (no user_id), the route returns the runId via the
 * initial POST response and the page issues a signed REST token (Phase 2.4
 * follow-up). For authenticated users, the policy `agent_runs_select_own`
 * lets Realtime stream their own runs naturally.
 *
 * Returns:
 *   - status: 'connecting' | 'running' | 'completed' | 'failed' | 'cancelled'
 *   - currentNode: which graph node is active (e.g. 'analyze_palace.Quan Lộc')
 *   - progress: 0..1 estimated from currentNode position in the known sequence
 *   - cost: { usd, tokensIn, tokensOut } running totals
 *   - error: error_message if status === 'failed'
 *   - source: 'realtime' | 'polling' — which transport delivered the latest update
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';

// Match Phase 2.2 graph node order — used to compute progress fraction
const _TU_VI_NODE_ORDER = [
  'parse_input',
  // analyze_palace.<Name> — 12 parallel, treated as single "stage" at 0.2-0.85
  'cross_reference',
  'synthesize',
] as const;

export type AgentRunStatus = 'connecting' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface AgentRunSnapshot {
  status: AgentRunStatus;
  currentNode: string | null;
  progress: number;
  cost: { usd: number; tokensIn: number; tokensOut: number };
  error: string | null;
  source: 'realtime' | 'polling';
}

const INITIAL: AgentRunSnapshot = {
  status: 'connecting',
  currentNode: null,
  progress: 0,
  cost: { usd: 0, tokensIn: 0, tokensOut: 0 },
  error: null,
  source: 'realtime',
};

let _supabase: ReturnType<typeof createClient> | null = null;
function getBrowserClient() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('useAgentRun: NEXT_PUBLIC_SUPABASE_URL + ANON_KEY required');
  }
  _supabase = createClient(url, key, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 5 } },
  });
  return _supabase;
}

function computeProgress(currentNode: string | null, status: AgentRunStatus): number {
  if (status === 'completed') return 1;
  if (!currentNode) return 0;
  if (currentNode === 'parse_input') return 0.05;
  if (currentNode.startsWith('analyze_palace.')) {
    // 12 palaces fan out — estimate by counting completed (rough since they run
    // parallel; we don't have per-palace state on the client). Treat as the
    // "analyze" stage spanning 0.15 → 0.75. Best-effort visual feedback.
    return 0.45;
  }
  if (currentNode === 'cross_reference') return 0.8;
  if (currentNode === 'synthesize') return 0.92;
  return 0.5;
}

interface AgentRunRow {
  status: AgentRunStatus | string;
  current_node: string | null;
  cost_usd: number | string | null;
  tokens_in: number | null;
  tokens_out: number | null;
  error_message: string | null;
}

function snapshotFromRow(row: AgentRunRow, source: 'realtime' | 'polling'): AgentRunSnapshot {
  const status = (row.status as AgentRunStatus) ?? 'running';
  const currentNode = row.current_node;
  return {
    status,
    currentNode,
    progress: computeProgress(currentNode, status),
    cost: {
      usd: typeof row.cost_usd === 'string' ? Number(row.cost_usd) : (row.cost_usd ?? 0),
      tokensIn: row.tokens_in ?? 0,
      tokensOut: row.tokens_out ?? 0,
    },
    error: row.error_message,
    source,
  };
}

export function useAgentRun(runId: string | null): AgentRunSnapshot {
  const [snap, setSnap] = useState<AgentRunSnapshot>(INITIAL);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const realtimeConnectedRef = useRef(false);

  useEffect(() => {
    if (!runId) return;
    const supabase = getBrowserClient();

    // 1. Realtime subscription
    const channel = supabase
      .channel(`agent_runs:${runId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agent_runs',
          filter: `run_id=eq.${runId}`,
        },
        (payload) => {
          realtimeConnectedRef.current = true;
          setSnap(snapshotFromRow(payload.new as AgentRunRow, 'realtime'));
        },
      )
      .subscribe();
    channelRef.current = channel;

    // 2. Initial fetch — Realtime only fires on UPDATE, not the current state
    void (async () => {
      const { data } = await supabase
        .from('agent_runs')
        .select('status,current_node,cost_usd,tokens_in,tokens_out,error_message')
        .eq('run_id', runId)
        .maybeSingle();
      if (data) setSnap(snapshotFromRow(data as AgentRunRow, 'realtime'));
    })();

    // 3. Polling fallback — if no Realtime event arrives within 3s OR if the
    // channel never opens, fall back to 2s polling. Polling stops automatically
    // once the run reaches a terminal state.
    const startPolling = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(async () => {
        const { data } = await supabase
          .from('agent_runs')
          .select('status,current_node,cost_usd,tokens_in,tokens_out,error_message')
          .eq('run_id', runId)
          .maybeSingle();
        if (data) {
          setSnap(snapshotFromRow(data as AgentRunRow, 'polling'));
          const terminal = ['completed', 'failed', 'cancelled'];
          if (terminal.includes((data as AgentRunRow).status)) {
            clearInterval(pollRef.current!);
            pollRef.current = null;
          }
        }
      }, 2000);
    };
    const fallbackTimer = setTimeout(() => {
      if (!realtimeConnectedRef.current) startPolling();
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      if (pollRef.current) clearInterval(pollRef.current);
      if (channelRef.current) void supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      pollRef.current = null;
      realtimeConnectedRef.current = false;
    };
  }, [runId]);

  return snap;
}
