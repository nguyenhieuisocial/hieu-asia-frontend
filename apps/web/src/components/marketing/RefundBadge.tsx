/**
 * Wave 60.56 P2.5 — RefundBadge (Option D R3 differentiation #4 trust signal).
 *
 * Jade-tinted mono pill rendering "N NGÀY HOÀN TIỀN" with a small filled
 * dot leader. Used on pricing tiers and checkout CTAs to surface the
 * refund guarantee — calm semantic color, no shouting.
 */
export type RefundBadgeProps = {
  days: number;
  className?: string;
};

export function RefundBadge({ days, className }: RefundBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-jade ${className ?? ''}`}
    >
      <span className="size-1.5 rounded-full bg-jade" aria-hidden />
      {days} NGÀY HOÀN TIỀN
    </span>
  );
}
