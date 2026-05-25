/**
 * useReadingSession — live view of a reading session.
 *
 * Strategy:
 *  1. Initial fetch via `/api/reading/[id]` (server-side proxy).
 *  2. Subscribe to Supabase Realtime on `hieu_asia.reading_sessions`
 *     filtered by `session_id=eq.${id}` for UPDATE events.
 *  3. If Realtime never connects (env missing, channel error, or no
 *     SUBSCRIBED status within a grace window), fall back to polling
 *     every 5s.
 *
 * The hook exposes `state`, `reading`, `error` and a `retry` action.
 */

import * as React from 'react';
import * as Sentry from '@sentry/nextjs';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  ApiClientError,
  getReading,
  type Reading,
  type ReadingState,
} from './api-client';
import { getBrowserSupabase } from './supabase-client';

const POLL_FALLBACK_MS = 5000;
const REALTIME_CONNECT_GRACE_MS = 4000;

export interface UseReadingSessionResult {
  reading: Reading | null;
  state: ReadingState | null;
  error: string | null;
  /** Realtime if subscribed, else 'polling'. Useful for diagnostics. */
  transport: 'realtime' | 'polling' | 'idle';
  retry: () => void;
}

/**
 * Extract the canonical `state` from a Realtime UPDATE payload row.
 * The raw row has shape `{ session_id, state_json: {...}, updated_at }`.
 */
function extractStateFromRow(
  row: Record<string, unknown> | null | undefined,
): ReadingState | null {
  if (!row) return null;
  const sj = (row.state_json ?? null) as Record<string, unknown> | null;
  if (!sj) return null;
  const s = (sj.state ?? sj.status ?? null) as string | null;
  return (s as ReadingState | null) ?? null;
}

function isTerminal(s: ReadingState | null): boolean {
  return (
    !!s &&
    (s === 'report_ready' ||
      s === 'error_internal' ||
      s.startsWith('error_at_'))
  );
}

export function useReadingSession(
  readingId: string,
): UseReadingSessionResult {
  const [reading, setReading] = React.useState<Reading | null>(null);
  const [state, setState] = React.useState<ReadingState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [transport, setTransport] = React.useState<
    'realtime' | 'polling' | 'idle'
  >('idle');
  const [nonce, setNonce] = React.useState(0);

  const retry = React.useCallback(() => {
    setError(null);
    setState(null);
    setReading(null);
    setNonce((n) => n + 1);
  }, []);

  React.useEffect(() => {
    if (!readingId) return;
    let cancelled = false;
    let pollTimer: number | undefined;
    let graceTimer: number | undefined;
    let pollingActive = false;
    let channel: RealtimeChannel | null = null;

    const fetchOnce = async (): Promise<ReadingState | null> => {
      try {
        const r = await getReading(readingId);
        if (cancelled) return null;
        setReading(r);
        const next = r?.state ?? null;
        setState(next);
        return next;
      } catch (err) {
        if (cancelled) return null;
        const msg =
          err instanceof ApiClientError
            ? `Không kết nối được máy chủ (${err.status}).`
            : 'Không kết nối được máy chủ.';
        setError(msg);
        return null;
      }
    };

    const startPolling = () => {
      if (pollingActive || cancelled) return;
      pollingActive = true;
      setTransport('polling');
      const tick = async () => {
        const next = await fetchOnce();
        if (cancelled) return;
        if (isTerminal(next)) return;
        pollTimer = window.setTimeout(tick, POLL_FALLBACK_MS);
      };
      pollTimer = window.setTimeout(tick, POLL_FALLBACK_MS);
    };

    // Kick off initial fetch, then optionally attach Realtime.
    void fetchOnce().then((s) => {
      if (cancelled) return;
      if (isTerminal(s)) return;

      const supabase = getBrowserSupabase();
      if (!supabase) {
        startPolling();
        return;
      }

      // iOS WebKit (and other strict contexts) can throw DOMException
      // SecurityError synchronously from `new WebSocket(...)` inside Supabase
      // Realtime's `.subscribe()` / reconnect path. Wrap to fall back to
      // polling instead of bubbling to the React commit phase.
      // Fixes HIEU-ASIA-WORKER-7 + HIEU-ASIA-WORKER-8.
      try {
        channel = supabase
          .channel(`reading-session-${readingId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'hieu_asia',
              table: 'reading_sessions',
              filter: `session_id=eq.${readingId}`,
            },
            (payload: { new?: Record<string, unknown> }) => {
              if (cancelled) return;
              const nextState = extractStateFromRow(payload.new);
              if (nextState) setState(nextState);
              // Re-fetch the shaped Reading so consumers always see a
              // consistent view (insights/report fields, not raw JSONB).
              void fetchOnce();
            },
          )
          .subscribe((status: string) => {
            if (cancelled) return;
            if (status === 'SUBSCRIBED') {
              setTransport('realtime');
              if (graceTimer) {
                window.clearTimeout(graceTimer);
                graceTimer = undefined;
              }
            } else if (
              status === 'CHANNEL_ERROR' ||
              status === 'TIMED_OUT' ||
              status === 'CLOSED'
            ) {
              startPolling();
            }
          });

        // Grace window: if Realtime doesn't reach SUBSCRIBED, switch to polling.
        graceTimer = window.setTimeout(() => {
          if (cancelled) return;
          startPolling();
        }, REALTIME_CONNECT_GRACE_MS);
      } catch (err) {
        // WebSocket constructor or subscribe threw synchronously
        // (iOS Safari/Chrome-iOS WebKit SecurityError). Fall back to polling.
        // Capture to Sentry so we can monitor fallback rate per device/region
        // and detect new SecurityError variants slipping through.
        Sentry.captureException(err, {
          tags: { area: 'realtime-fallback', hook: 'useReadingSession' },
          extra: { readingId },
        });
        channel = null;
        startPolling();
      }
    });

    return () => {
      cancelled = true;
      if (pollTimer) window.clearTimeout(pollTimer);
      if (graceTimer) window.clearTimeout(graceTimer);
      if (channel) {
        try {
          const supabase = getBrowserSupabase();
          supabase?.removeChannel(channel);
        } catch {
          /* ignore */
        }
      }
    };
  }, [readingId, nonce]);

  return { reading, state, error, transport, retry };
}
