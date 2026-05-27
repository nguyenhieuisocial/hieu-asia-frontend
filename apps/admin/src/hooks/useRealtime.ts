// hieu.asia — useRealtime React hook for admin dashboard (Wave 60.94.n)
//
// Connects to AdminRealtime DO via WebSocket. Reconnects on disconnect with
// exponential backoff. Filters events by topic subscription.
//
// Usage:
//   const { events, status, reconnect } = useRealtime(['new_reading', 'payment_received']);
//   useEffect(() => {
//     for (const ev of events) {
//       if (ev.type === 'new_reading') refetchReadings();
//       if (ev.type === 'payment_received') refetchPayments();
//     }
//   }, [events]);

import { useEffect, useRef, useState, useCallback } from 'react';

export type RealtimeTopic = 'new_reading' | 'payment_received' | 'error_threshold' | 'admin_action';

export interface RealtimeEvent {
  type: RealtimeTopic;
  payload: Record<string, unknown>;
  timestamp: number;
}

export interface RealtimeConnectedMsg {
  type: 'connected';
  subscriber_id: string;
  topics: RealtimeTopic[];
  peer_count: number;
}

export type RealtimeMessage = RealtimeEvent | RealtimeConnectedMsg;

export type RealtimeStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'error';

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;
const MAX_BUFFERED_EVENTS = 100;

export function useRealtime(topics: RealtimeTopic[]) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [status, setStatus] = useState<RealtimeStatus>('connecting');
  const [peerCount, setPeerCount] = useState<number>(0);

  const wsRef = useRef<WebSocket | null>(null);
  const backoffRef = useRef<number>(INITIAL_BACKOFF_MS);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedByCallerRef = useRef<boolean>(false);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return; // SSR guard

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';
    const wsUrl = apiUrl.replace(/^http/, 'ws') + '/admin/realtime/connect';

    // Get admin email + token from secure cookie (server reads ADMIN_COOKIE_SECRET-signed)
    // For MVP: pull token from sessionStorage — production should use httpOnly cookie + server fetch
    const token = sessionStorage.getItem('admin_realtime_token') ?? '';
    const adminEmail = sessionStorage.getItem('admin_email') ?? '';

    if (!token || !adminEmail) {
      setStatus('error');
      return;
    }

    const url = `${wsUrl}?token=${encodeURIComponent(token)}&admin_email=${encodeURIComponent(adminEmail)}&topics=${topics.join(',')}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    setStatus('connecting');

    ws.addEventListener('open', () => {
      setStatus('open');
      backoffRef.current = INITIAL_BACKOFF_MS; // reset backoff after successful connect
    });

    ws.addEventListener('message', (e) => {
      try {
        const msg = JSON.parse(e.data) as RealtimeMessage;
        if (msg.type === 'connected') {
          setPeerCount(msg.peer_count);
          return;
        }
        // Event
        setEvents((prev) => {
          const next = [...prev, msg];
          // Cap buffer to avoid memory bloat on long-running sessions
          return next.length > MAX_BUFFERED_EVENTS ? next.slice(-MAX_BUFFERED_EVENTS) : next;
        });
      } catch {
        // Ignore malformed messages
      }
    });

    ws.addEventListener('close', () => {
      setStatus('closed');
      if (closedByCallerRef.current) return; // intentional close, no reconnect
      // Exponential backoff reconnect
      const backoff = backoffRef.current;
      backoffRef.current = Math.min(backoffRef.current * 2, MAX_BACKOFF_MS);
      reconnectTimerRef.current = setTimeout(() => {
        connect();
      }, backoff);
    });

    ws.addEventListener('error', () => {
      setStatus('error');
    });
  }, [topics]);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      closedByCallerRef.current = true;
      wsRef.current.close();
    }
    closedByCallerRef.current = false;
    backoffRef.current = INITIAL_BACKOFF_MS;
    connect();
  }, [connect]);

  useEffect(() => {
    closedByCallerRef.current = false;
    connect();
    return () => {
      closedByCallerRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { events, status, peerCount, reconnect };
}
