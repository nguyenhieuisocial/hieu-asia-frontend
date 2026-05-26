/**
 * ChartBanner — visual indicator that a Tử Vi chart has been loaded
 * from stored birth inputs. Used on /decisions/new (and shared with
 * /onboarding per Wave 60.58 plan).
 *
 * Two states:
 * - loaded: jade border + check mark + birth date confirmation
 * - missing: gold-bordered Card with CTA to /onboarding
 *
 * Extracted from /decisions/new monolith (Wave 60.58 T1.1).
 */

import Link from 'next/link';
import { Button, Card, CardContent } from '@hieu-asia/ui';

export type ChartBannerProps = {
  /** When non-null, banner shows the "loaded" jade state with this date. */
  birthDate: string | null;
  /** True while the chart is still being cast — suppresses the "missing" CTA. */
  loading?: boolean;
  /** Where to return after onboarding completes the chart. */
  returnTo?: string;
};

export function ChartBanner({
  birthDate,
  loading = false,
  returnTo = '/decisions/new',
}: ChartBannerProps) {
  if (birthDate) {
    return (
      <div
        className="mb-8 flex items-start gap-3 rounded-lg border border-jade/30 bg-jade/5 p-4"
        data-testid="decision-chart-banner"
      >
        <span className="mt-0.5 text-jade" aria-hidden="true">
          ✓
        </span>
        <p className="text-sm leading-relaxed text-foreground/85">
          <strong className="font-semibold">Lá số đã có</strong> — đang sử
          dụng lá số ngày {birthDate}. Brief sẽ tham chiếu các cung và sao
          trong lá số của bạn.
        </p>
      </div>
    );
  }

  if (loading) return null;

  return (
    <Card className="mb-8 border-gold/20 bg-gold/5">
      <CardContent className="flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-foreground">
            Tạo Decision Brief có lá số (nhanh hơn)
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Nhập ngày & giờ sinh một lần — Brief sẽ tham chiếu cung & sao
            thay vì chỉ dựa vào mô tả.
          </p>
        </div>
        <Button asChild={false} variant="outline">
          <Link href={`/onboarding?returnTo=${encodeURIComponent(returnTo)}`}>
            Lập lá số trước →
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
