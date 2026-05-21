'use client';

/**
 * Bottom-right realtime ticker for new conversions / payouts.
 * Subscribes to a Supabase Realtime channel if `getBrowserSupabase()`
 * is configured. If env vars are missing, the component renders nothing.
 */

import * as React from 'react';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { vnd } from '@/lib/affiliate-admin-api';
import { cn } from '@hieu-asia/ui';

interface TickerItem {
  id: string;
  message: string;
  amount?: number;
  ts: number;
}

interface NotificationPayload {
  event_type?: string;
  affiliate_code?: string;
  amount?: number;
  message?: string;
}

const CHANNEL = 'affiliate_events';
const MAX_VISIBLE = 4;
const FADE_AFTER_MS = 8000;

export function PaymentTicker() {
  const [items, setItems] = React.useState<TickerItem[]>([]);

  React.useEffect(() => {
    const supa = getBrowserSupabase();
    if (!supa) return;

    const channel = supa.channel(CHANNEL).on(
      'broadcast',
      { event: 'conversion' },
      (msg: { payload: NotificationPayload }) => {
        const p = msg.payload ?? {};
        const code = p.affiliate_code ?? 'unknown';
        const amount = typeof p.amount === 'number' ? p.amount : undefined;
        const text =
          p.message ?? `Conversion mới · ${code}${amount ? ` · +${vnd(amount)}` : ''}`;
        pushItem({ id: crypto.randomUUID(), message: text, amount, ts: Date.now() });
      },
    );
    channel.subscribe();

    function pushItem(item: TickerItem) {
      setItems((cur) => [item, ...cur].slice(0, MAX_VISIBLE));
      setTimeout(() => {
        setItems((cur) => cur.filter((x) => x.id !== item.id));
      }, FADE_AFTER_MS);
    }

    return () => {
      supa.removeChannel(channel);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 flex w-72 flex-col gap-2">
      {items.map((it) => (
        <div
          key={it.id}
          className={cn(
            'pointer-events-auto rounded-lg border border-gold/30 bg-ink/95 px-3 py-2 text-sm text-cream shadow-lg backdrop-blur',
            'animate-in slide-in-from-right-4 duration-300',
          )}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-gold" aria-hidden />
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold/80">
              Live
            </span>
          </div>
          <p className="mt-0.5 text-sm">{it.message}</p>
        </div>
      ))}
    </div>
  );
}
