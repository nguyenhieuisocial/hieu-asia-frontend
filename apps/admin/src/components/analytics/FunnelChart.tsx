'use client';

import * as React from 'react';

export interface FunnelStage {
  key: string;
  label: string;
  count: number;
}

export function FunnelChart({ stages }: { stages: FunnelStage[] }) {
  const max = Math.max(1, ...stages.map(s => s.count));
  const top = stages[0]?.count ?? 0;

  return (
    <div className="space-y-2">
      {stages.map((s, i) => {
        const pct = (s.count / max) * 100;
        const ofTop = top > 0 ? (s.count / top) * 100 : 0;
        return (
          <div key={s.key} className="space-y-1">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-foreground/85">{s.label}</span>
              <span className="tabular-nums text-muted-foreground">
                <span className="font-medium text-foreground">{s.count.toLocaleString('vi-VN')}</span>
                {i > 0 && <span className="ml-2 text-muted-foreground">({ofTop.toFixed(1)}%)</span>}
              </span>
            </div>
            <div className="h-7 w-full overflow-hidden rounded bg-card/60">
              <div
                className="h-full rounded bg-gradient-to-r from-gold to-gold-300 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
