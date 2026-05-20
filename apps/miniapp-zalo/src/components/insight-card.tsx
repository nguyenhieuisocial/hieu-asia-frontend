import { Card, CardContent } from '@hieu-asia/ui';

interface Props {
  title: string;
  insight: string;
  risk?: string;
  action?: string;
}

/**
 * Compact mobile-first insight card — adapted from
 * `apps/web/src/components/report-tabs.tsx` for narrow Mini App viewport.
 */
export function InsightCard({ title, insight, risk, action }: Props) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-5">
        <p className="font-heading text-base font-semibold text-gold">{title}</p>
        <div>
          <p className="text-xs uppercase tracking-widest text-cream/40">Nhận định</p>
          <p className="mt-1 text-sm text-cream/90">{insight}</p>
        </div>
        {risk ? (
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-300/70">Rủi ro</p>
            <p className="mt-1 text-sm text-cream/80">{risk}</p>
          </div>
        ) : null}
        {action ? (
          <div>
            <p className="text-xs uppercase tracking-widest text-jade/80">Hành động</p>
            <p className="mt-1 text-sm text-cream/80">{action}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
