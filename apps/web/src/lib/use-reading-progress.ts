'use client';

/**
 * Custom hook wrapping socket.io-client for reading processing events.
 *
 * Falls back to a synthetic timer-driven progression when no `session_id`
 * is supplied or the connection fails — keeps demo flow alive without backend.
 */

import * as React from 'react';
import { io, type Socket } from 'socket.io-client';

export type StepKey =
  | 'prepare_context'
  | 'vision'
  | 'logic'
  | 'psychology'
  | 'alignment'
  | 'report';

export type StepState = 'pending' | 'running' | 'done';

export interface StepStatus {
  key: StepKey;
  label: string;
  state: StepState;
}

export type ProcessingStatus = 'idle' | 'running' | 'completed' | 'failed';

export interface UseReadingProgressOpts {
  sessionId?: string | null;
  mock?: boolean;
  /** Per-step duration when in mock mode (ms). */
  mockStepMs?: number;
}

const STEPS: { key: StepKey; label: string }[] = [
  { key: 'prepare_context', label: 'Đang dựng dữ liệu nền…' },
  { key: 'vision', label: 'Đang phân tích ảnh bàn tay…' },
  { key: 'logic', label: 'Đang lập ma trận ngày sinh…' },
  { key: 'psychology', label: 'Đang đối chiếu tâm lý hành vi…' },
  { key: 'alignment', label: 'Đang đồng bộ Hội đồng Agent…' },
  { key: 'report', label: 'Đang biên tập Cẩm Nang Cuộc Đời…' },
];

const EVENT_TO_STEP: Record<string, StepKey> = {
  'reading.running': 'prepare_context',
  'step:vision_started': 'vision',
  'step:logic_started': 'logic',
  'step:psychology_started': 'psychology',
  'step:alignment_started': 'alignment',
  'step:report_started': 'report',
};

function initialSteps(): StepStatus[] {
  return STEPS.map((s) => ({ ...s, state: 'pending' as StepState }));
}

function advance(steps: StepStatus[], toKey: StepKey): StepStatus[] {
  const idx = steps.findIndex((s) => s.key === toKey);
  return steps.map((s, i) => {
    if (i < idx) return { ...s, state: 'done' };
    if (i === idx) return { ...s, state: 'running' };
    return { ...s, state: 'pending' };
  });
}

function completeAll(steps: StepStatus[]): StepStatus[] {
  return steps.map((s) => ({ ...s, state: 'done' }));
}

export function useReadingProgress(opts: UseReadingProgressOpts) {
  const { sessionId, mock = false, mockStepMs = 3500 } = opts;
  const [steps, setSteps] = React.useState<StepStatus[]>(initialSteps);
  const [status, setStatus] = React.useState<ProcessingStatus>('idle');
  const [error, setError] = React.useState<string | null>(null);

  // Mock progression (no sessionId or `mock=true`)
  React.useEffect(() => {
    const useMock = mock || !sessionId;
    if (!useMock) return;

    setStatus('running');
    let cancelled = false;
    let i = 0;

    const firstStep = STEPS[0];
    if (firstStep) setSteps(advance(initialSteps(), firstStep.key));

    const tick = () => {
      if (cancelled) return;
      i += 1;
      const next = STEPS[i];
      if (!next) {
        setSteps(completeAll);
        setStatus('completed');
        return;
      }
      setSteps((prev) => advance(prev, next.key));
      timer = window.setTimeout(tick, mockStepMs);
    };

    let timer = window.setTimeout(tick, mockStepMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [mock, sessionId, mockStepMs]);

  // Real socket.io subscription
  React.useEffect(() => {
    if (mock || !sessionId) return;

    const url = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
    let socket: Socket | null = null;
    let cancelled = false;

    try {
      socket = io(url, { transports: ['websocket', 'polling'], reconnection: true });
      socket.on('connect', () => {
        if (cancelled || !socket) return;
        socket.emit('join_session', { session_id: sessionId });
        setStatus('running');
        setSteps(advance(initialSteps(), 'prepare_context'));
      });

      Object.entries(EVENT_TO_STEP).forEach(([eventName, stepKey]) => {
        socket!.on(eventName, () => {
          if (cancelled) return;
          setSteps((prev) => advance(prev, stepKey));
        });
      });

      socket.on('reading.completed', () => {
        if (cancelled) return;
        setSteps(completeAll);
        setStatus('completed');
      });

      socket.on('reading.failed', (payload: { error?: string }) => {
        if (cancelled) return;
        setError(payload?.error ?? 'Quá trình phân tích thất bại.');
        setStatus('failed');
      });

      socket.on('connect_error', (err) => {
        console.warn('[socket] connect_error:', err.message);
      });
    } catch (e) {
      console.warn('[socket] init failed:', e);
    }

    return () => {
      cancelled = true;
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, [mock, sessionId]);

  return { steps, status, error };
}

export const STEP_DEFINITIONS = STEPS;
