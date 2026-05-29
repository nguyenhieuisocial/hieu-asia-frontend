'use client';

// Wave 60.94.o — RealtimeIndicator component for admin layout.
// Wires useRealtime hook to admin chrome — displays WS connection status
// + invalidates React Query caches on relevant events.

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRealtime, type RealtimeEvent } from '@/hooks/useRealtime';

const STATUS_COLORS: Record<string, string> = {
  connecting: 'bg-amber-500',
  open: 'bg-green-500',
  closing: 'bg-orange-500',
  closed: 'bg-zinc-500',
  error: 'bg-red-500',
};

const STATUS_LABELS: Record<string, string> = {
  connecting: 'Đang kết nối',
  open: 'Trực tiếp',
  closing: 'Đang đóng',
  closed: 'Mất kết nối',
  error: 'Lỗi',
};

/**
 * Triggers React Query invalidations on realtime events.
 * Per-event mapping below — extend as more admin views adopt RT updates.
 */
function invalidateOnEvent(qc: ReturnType<typeof useQueryClient>, event: RealtimeEvent) {
  switch (event.type) {
    case 'new_reading':
      qc.invalidateQueries({ queryKey: ['sessions'] });
      qc.invalidateQueries({ queryKey: ['readings'] });
      qc.invalidateQueries({ queryKey: ['metrics'] });
      break;
    case 'payment_received':
      qc.invalidateQueries({ queryKey: ['payments'] });
      qc.invalidateQueries({ queryKey: ['customers'] });
      qc.invalidateQueries({ queryKey: ['metrics'] });
      break;
    case 'error_threshold':
      qc.invalidateQueries({ queryKey: ['errors'] });
      qc.invalidateQueries({ queryKey: ['metrics'] });
      break;
    case 'admin_action':
      qc.invalidateQueries({ queryKey: ['audit'] });
      break;
  }
}

export function RealtimeIndicator() {
  const qc = useQueryClient();
  const { events, status, peerCount } = useRealtime([
    'new_reading',
    'payment_received',
    'error_threshold',
    'admin_action',
  ]);

  // React Query invalidation on each new event.
  // Wave 60.95.fix: explicit undefined guard for TS `noUncheckedIndexedAccess`
  // strict mode — `events[length-1]` returns `T | undefined` even when length>0.
  useEffect(() => {
    if (events.length === 0) return;
    const latest = events[events.length - 1];
    if (!latest) return;
    invalidateOnEvent(qc, latest);
  }, [events, qc]);

  const dotColor = STATUS_COLORS[status] ?? 'bg-zinc-500';
  const label = STATUS_LABELS[status] ?? status;

  // Wave 63.7 — realtime is a NON-CRITICAL background cache-sync (AdminRealtime
  // DO). The admin works fully without it. When the socket can't connect it was
  // showing a red "● Lỗi" badge in the topbar — a false alarm that reads like
  // the whole admin is broken (founder flagged it). Hide the badge entirely
  // unless the socket is live ('open') or actively connecting; the feature
  // degrades silently instead of crying error.
  if (status === 'error' || status === 'closed' || status === 'closing') {
    return null;
  }

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs"
      title={`WebSocket: ${label}${peerCount > 1 ? ` · ${peerCount} admins online` : ''}${events.length > 0 ? ` · ${events.length} events buffered` : ''}`}
    >
      <span className={`h-2 w-2 rounded-full ${dotColor} ${status === 'open' ? 'animate-pulse' : ''}`} aria-hidden="true" />
      <span className="text-muted-foreground">{label}</span>
      {peerCount > 1 && (
        <span className="text-muted-foreground/70">· {peerCount}</span>
      )}
    </div>
  );
}
