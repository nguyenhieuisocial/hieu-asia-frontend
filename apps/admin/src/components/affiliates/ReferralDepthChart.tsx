'use client';

/**
 * Referral-network depth distribution for the Referrals tab. Wave 60.62.
 *
 * Fed ONLY the promoter rows the tab already fetched (the same
 * `/api/admin/affiliates/promoters` list it builds the tree from). Counts how
 * many promoters sit at each `depth`, rendered as a horizontal funnel — this
 * is the genuine "shape" of the network (root → L1 → L2 → …), NOT a synthetic
 * signup→paid funnel (that data isn't fetched here). No new endpoints, no
 * Recharts (pure CSS bars, matching FunnelChart house style).
 */

import * as React from 'react';
import { ChartSection } from './ChartSection';

export interface DepthRow {
  depth: number;
}

export function ReferralDepthChart({ rows }: { rows: DepthRow[] }) {
  const stages = React.useMemo(() => {
    const byDepth = new Map<number, number>();
    for (const r of rows) {
      const d = Number.isFinite(r.depth) ? r.depth : 0;
      byDepth.set(d, (byDepth.get(d) ?? 0) + 1);
    }
    const depths = Array.from(byDepth.keys()).sort((a, b) => a - b);
    return depths.map((d) => ({
      depth: d,
      label: d === 0 ? 'Root (cấp 0)' : `Cấp ${d}`,
      count: byDepth.get(d) ?? 0,
    }));
  }, [rows]);

  const max = Math.max(1, ...stages.map((s) => s.count));
  const top = stages[0]?.count ?? 0;

  return (
    <ChartSection
      title="Phân bố mạng lưới theo độ sâu"
      source="affiliate_network · đếm promoter ở mỗi cấp"
      empty={stages.length === 0}
    >
      <div className="space-y-2">
        {stages.map((s, i) => {
          const pct = (s.count / max) * 100;
          const ofTop = top > 0 ? (s.count / top) * 100 : 0;
          return (
            <div key={s.depth} className="space-y-1">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-foreground/85">{s.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {s.count.toLocaleString('vi-VN')}
                  </span>
                  {i > 0 && <span className="ml-2">({ofTop.toFixed(1)}% so với root)</span>}
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
    </ChartSection>
  );
}
