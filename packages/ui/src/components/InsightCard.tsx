import * as React from 'react';
import type { InsightItem } from '@hieu-asia/types';
import { cn } from '../lib/utils';

/**
 * Standard insight card per [[90 - Frontend Design Spec]] §7.
 *
 * Format chuẩn cho mọi insight trong báo cáo:
 *   title (optional)
 *   📌 Nhận định  — assessment
 *   ⚠️ Rủi ro     — risk (optional)
 *   🎯 Hành động  — action
 *
 * Biến "luận giải" thành "cố vấn hành động".
 */

export interface InsightCardProps {
  insight: InsightItem;
  className?: string;
}

export function InsightCard({ insight, className }: InsightCardProps) {
  const { title, assessment, risk, action } = insight;

  return (
    <article
      className={cn(
        'rounded-lg border border-gold/15 bg-card p-5 text-foreground shadow-sm backdrop-blur-sm',
        className,
      )}
    >
      {title && (
        <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">{title}</h3>
      )}

      <section className="space-y-3 text-sm leading-relaxed">
        <div>
          <p className="mb-1 font-medium text-gold">📌 Nhận định</p>
          <p className="text-foreground/90">{assessment}</p>
        </div>

        {risk && (
          <div>
            <p className="mb-1 font-medium text-gold">⚠️ Rủi ro</p>
            <p className="text-foreground/80">{risk}</p>
          </div>
        )}

        <div>
          <p className="mb-1 font-medium text-gold">🎯 Hành động</p>
          <p className="text-foreground/90">{action}</p>
        </div>
      </section>
    </article>
  );
}
