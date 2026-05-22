/**
 * LeaderboardPodium — Wave 48 server component for top 3 affiliates.
 *
 * Renders a podium layout: #2 left, #1 centre (bigger), #3 right on desktop;
 * stacks #1/#2/#3 vertically on mobile. Server-rendered, no client JS.
 */

import * as React from 'react';

interface PodiumRow {
  affiliate_code: string;
  tier: string | null;
  total_earned_vnd: number;
  total_orders: number;
}

interface Props {
  top3: PodiumRow[];
}

const MEDALS = ['🥇', '🥈', '🥉'];

function vnd(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

export function LeaderboardPodium({ top3 }: Props) {
  if (top3.length === 0) return null;
  // Desktop ordering: #2, #1, #3
  const order = top3.length >= 3 ? [1, 0, 2] : top3.map((_, i) => i);

  return (
    <div className="grid items-end gap-4 sm:grid-cols-3">
      {order.map((i) => {
        const row = top3[i];
        if (!row) return null;
        return <PodiumCard key={row.affiliate_code || i} row={row} rank={i + 1} />;
      })}
    </div>
  );
}

function PodiumCard({ row, rank }: { row: PodiumRow; rank: number }) {
  const isFirst = rank === 1;
  const heightClass = isFirst ? 'sm:py-10' : 'sm:py-6';
  const borderClass = isFirst
    ? 'border-gold/60 bg-gradient-to-b from-gold/10 to-background'
    : 'border-border bg-card/60';
  const scaleClass = isFirst ? 'sm:scale-105 sm:shadow-lg sm:shadow-gold/10' : '';

  return (
    <div
      className={`relative flex flex-col items-center rounded-2xl border px-4 py-6 text-center ${borderClass} ${heightClass} ${scaleClass}`}
    >
      <div className="text-3xl sm:text-4xl" aria-hidden="true">
        {MEDALS[rank - 1]}
      </div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
        #{rank}
      </div>
      <div className="mt-3 font-mono text-base font-semibold text-foreground sm:text-lg">
        {row.affiliate_code || '—'}
      </div>
      {row.tier && (
        <div className="mt-2 inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
          {row.tier}
        </div>
      )}
      <div className={`mt-4 font-heading font-bold text-gold ${isFirst ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
        {vnd(row.total_earned_vnd)}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {row.total_orders.toLocaleString('vi-VN')} đơn
      </div>
    </div>
  );
}
