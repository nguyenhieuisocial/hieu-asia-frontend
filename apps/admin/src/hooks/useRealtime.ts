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

  // Stable primitive key — `topics` is a fresh array literal on every render at
  // the call site, so depending on the array reference rebuilt the socket on
  // EVERY render (infinite reconnect). Depend on the joined string instead.
  const topicsKey = topics.join(',');

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return; // SSR guard

    // Clear any pending backoff reconnect so timers/sockets never stack.
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.hieu.asia';
    const wsUrl = apiUrl.replace(/^http/, 'ws') + '/admin/realtime/connect';

    setStatus('connecting');

    // Fetch a short-lived HMAC ticket from the server (master admin token stays
    // server-side; only the ticket travels in the WS URL — see BUG #3 fix).
    void (async () => {
      let ticket: string;
      let admin_email: string;
      let expires_at: number;
      try {
        const res = await fetch('/api/admin/realtime/ticket', { cache: 'no-store' });
        if (!res.ok) {
          setStatus('error');
          return;
        }
        const data = (await res.json()) as {
          ok?: boolean;
          ticket?: string;
          admin_email?: string;
          expires_at?: number;
        };
        if (!data.ok || !data.ticket || !data.admin_email || !data.expires_at) {
          setStatus('error');
          return;
        }
        ticket = data.ticket;
        admin_email = data.admin_email;
        expires_at = data.expires_at;
      } catch {
        setStatus('error');
        return;
      }

      const url = `${wsUrl}?ticket=${encodeURIComponent(ticket)}&admin_email=${encodeURIComponent(admin_email)}&expires=${expires_at}&topics=${topicsKey}`;
      // Một số trình duyệt (vd Chrome trên iOS, hoặc ngữ cảnh bị chặn cookie/WS)
      // ném SecurityError NGAY tại `new WebSocket(...)`. Vì khối này chạy trong
      // async IIFE, lỗi không-bắt sẽ nổi thành unhandled-rejection và đổ vào
      // Sentry (DOMException 18). Realtime là tính năng PHỤ — bắt tại đây, set
      // 'error' và dừng; admin vẫn chạy đầy đủ không cần realtime.
      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch {
        setStatus('error');
        return;
      }
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
        // Ignore the close of a socket already superseded by a reconnect — else its
        // async close would schedule a duplicate reconnect racing the new socket.
        if (wsRef.current !== ws) return;
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
    })();
  }, [topicsKey]);

  const reconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    if (wsRef.current) {
      closedByCallerRef.current = true;
      wsRef.current.close();
      wsRef.current = null; // mark superseded so the old close handler no-ops
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
