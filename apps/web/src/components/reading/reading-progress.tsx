/**
 * Wave 56 Phase 2.3 — Live reading progress UI.
 *
 * Subscribes to `useAgentRun(runId)` and renders a progress bar + current
 * stage label + (optionally dev-only) running cost meter. Designed for the
 * /reading/processing page (Phase 2.4 wire-up) and any other route that
 * spawns a LangGraph run.
 *
 * Props:
 *   - runId: agent_runs.run_id returned by POST /api/reasoning/tu-vi/full
 *   - onComplete?: callback fired once status reaches 'completed' — host page
 *     can fetch full reading and route to /reading/[id] for display
 *   - onError?: callback fired on terminal 'failed' status with error message
 *   - showCost?: dev/admin only — exposes USD meter (default false in prod)
 */

'use client';

import * as React from 'react';
import { useAgentRun, type AgentRunStatus } from '@/hooks/use-agent-run';

interface ReadingProgressProps {
  runId: string;
  onComplete?: () => void;
  onError?: (message: string) => void;
  showCost?: boolean;
}

const STAGE_LABELS: Record<string, string> = {
  parse_input: 'Đang chuẩn bị dữ liệu lá số…',
  cross_reference: 'Đang đối chiếu 12 cung với nhau…',
  synthesize: 'Đang tổng hợp bản đọc cuối cùng…',
};

function describeStage(currentNode: string | null, status: AgentRunStatus): string {
  if (status === 'completed') return 'Hoàn tất.';
  if (status === 'failed') return 'Có lỗi xảy ra — vui lòng thử lại.';
  if (status === 'cancelled') return 'Đã huỷ.';
  if (!currentNode) return 'Đang khởi tạo…';
  if (currentNode.startsWith('analyze_palace.')) {
    const palace = currentNode.replace('analyze_palace.', '');
    return `Đang phân tích cung ${palace}…`;
  }
  return STAGE_LABELS[currentNode] ?? 'Đang xử lý…';
}

export function ReadingProgress({
  runId,
  onComplete,
  onError,
  showCost = false,
}: ReadingProgressProps) {
  const snap = useAgentRun(runId);

  // Fire callbacks exactly once when terminal state arrives.
  const calledRef = React.useRef(false);
  React.useEffect(() => {
    if (calledRef.current) return;
    if (snap.status === 'completed') {
      calledRef.current = true;
      onComplete?.();
    } else if (snap.status === 'failed') {
      calledRef.current = true;
      onError?.(snap.error ?? 'unknown_error');
    }
  }, [snap.status, snap.error, onComplete, onError]);

  const pct = Math.round(snap.progress * 100);
  const label = describeStage(snap.currentNode, snap.status);
  const isTerminal = ['completed', 'failed', 'cancelled'].includes(snap.status);

  return (
    <section
      aria-live="polite"
      aria-busy={!isTerminal}
      className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card/40 p-6"
    >
      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold/80 sm:text-xs">
        Tiến trình
      </p>
      <p className="mt-3 text-sm leading-relaxed text-foreground sm:text-base">{label}</p>

      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Tiến trình bản đọc"
      >
        <div
          className={`h-full transition-[width] duration-500 ease-out ${
            snap.status === 'failed'
              ? 'bg-destructive'
              : 'bg-gradient-to-r from-gold to-gold-300'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{pct}%</span>
        <span
          className="font-mono"
          title={`Kênh dữ liệu: ${snap.source === 'realtime' ? 'WebSocket' : 'Polling 2s'}`}
        >
          {snap.source === 'realtime' ? '● Realtime' : '○ Polling'}
        </span>
      </div>

      {showCost && (
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <div>
            <dt className="uppercase tracking-wider">Cost</dt>
            <dd className="mt-0.5 font-mono text-foreground">
              ${snap.cost.usd.toFixed(4)}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider">In</dt>
            <dd className="mt-0.5 font-mono text-foreground">
              {snap.cost.tokensIn.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider">Out</dt>
            <dd className="mt-0.5 font-mono text-foreground">
              {snap.cost.tokensOut.toLocaleString()}
            </dd>
          </div>
        </dl>
      )}

      {snap.status === 'failed' && snap.error && (
        <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
          {snap.error}
        </p>
      )}
    </section>
  );
}
