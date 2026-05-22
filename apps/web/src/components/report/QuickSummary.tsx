import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, cn } from '@hieu-asia/ui';
import { Lightbulb, AlertTriangle, Target } from 'lucide-react';

export interface QuickSummaryProps {
  /** 3 items — "3 điều hiểu mình". Extras truncated, fewer rendered as-is. */
  understandings: string[];
  /** 3 items — "3 rủi ro cần chú ý". */
  risks: string[];
  /** 3 items — "3 việc nên làm 30 ngày". Each should start with a verb. */
  actions: string[];
  className?: string;
}

/**
 * Section 1.4 — QuickSummary block.
 *
 * Designed to sit at the TOP of a report (not bottom). 3-column grid on
 * desktop, single-column stacked on mobile.
 */
export function QuickSummary({
  understandings,
  risks,
  actions,
  className,
}: QuickSummaryProps) {
  // Defensive: clamp to 3 items max, but render fewer if provided.
  const u = understandings.slice(0, 3);
  const r = risks.slice(0, 3);
  const a = actions.slice(0, 3);

  return (
    <section
      aria-label="Tóm tắt nhanh"
      className={cn(
        'grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5',
        className,
      )}
    >
      <SummaryColumn
        accent="jade"
        title="3 điều hiểu mình"
        icon={<Lightbulb className="h-4 w-4" aria-hidden="true" />}
        items={u}
      />
      <SummaryColumn
        accent="amber"
        title="3 rủi ro cần chú ý"
        icon={<AlertTriangle className="h-4 w-4" aria-hidden="true" />}
        items={r}
      />
      <SummaryColumn
        accent="gold"
        title="3 việc nên làm 30 ngày"
        icon={<Target className="h-4 w-4" aria-hidden="true" />}
        items={a}
      />
    </section>
  );
}

type Accent = 'jade' | 'amber' | 'gold';

interface SummaryColumnProps {
  accent: Accent;
  title: string;
  icon: React.ReactNode;
  items: string[];
}

function SummaryColumn({ accent, title, icon, items }: SummaryColumnProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <Card className={cn('border', styles.cardBorder, styles.cardBg)}>
      <CardHeader className="pb-3">
        <CardTitle
          className={cn(
            'flex items-center gap-2 text-base font-medium',
            styles.title,
          )}
        >
          <span className={styles.iconWrap}>{icon}</span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có nội dung.</p>
        ) : (
          <ol className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/90">
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold',
                    styles.badge,
                  )}
                >
                  {i + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

const ACCENT_STYLES: Record<
  Accent,
  {
    cardBorder: string;
    cardBg: string;
    title: string;
    iconWrap: string;
    badge: string;
  }
> = {
  jade: {
    cardBorder: 'border-jade-500/30',
    cardBg: 'bg-jade-900/20',
    title: 'text-jade-50',
    iconWrap: 'text-jade-500',
    badge: 'bg-jade-50 text-jade-900',
  },
  amber: {
    cardBorder: 'border-amber-400/30',
    cardBg: 'bg-amber-900/15',
    title: 'text-amber-100',
    iconWrap: 'text-amber-300',
    badge: 'bg-amber-300 text-ink',
  },
  gold: {
    cardBorder: 'border-gold/30',
    cardBg: 'bg-gold/5',
    title: 'text-gold',
    iconWrap: 'text-gold',
    badge: 'bg-gold text-ink',
  },
};
