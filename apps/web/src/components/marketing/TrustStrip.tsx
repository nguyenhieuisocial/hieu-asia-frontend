/**
 * Wave 60.35 — trust strip for marketing pages.
 *
 * 3 fact-based pillars (NOT fabricated user counts — honest brand voice
 * "Hiểu mình. Quyết định mình.").
 *
 * - 14-day refund: real policy (matches /terms §4 + pricing trustLine). The
 *   24h "no questions asked" window is the sub-clause for readings not yet
 *   generated — kept in the detail line, never as the headline number.
 * - Cloudflare edge: real infra (vault 88 cloud-first architecture)
 * - Transparent methodology: real product principle (every reading shows
 *   the AI prompt + source data used; not a black box)
 *
 * Designed to sit above the tier grid on /pricing and as a secondary
 * row on /features to reduce CTA-click hesitation.
 *
 * Refined minimalism per Wave 60.35 design direction: small cards, mono
 * eyebrow + heading number, single accent gold. No emoji, no badge
 * inflation, no fake review stars.
 */

import { ShieldCheck, Globe2, ScrollText, Layers, CreditCard } from 'lucide-react';

export interface Pillar {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  value: string;
  label: string;
  detail: string;
}

/**
 * Default pillars — pricing-flavored (refund safety, infra, methodology).
 * Optimized for the conversion-decision moment on `/pricing`.
 */
export const PRICING_PILLARS: readonly Pillar[] = [
  {
    Icon: ShieldCheck,
    value: '14 ngày',
    label: 'Bảo đảm hoàn tiền',
    detail: 'Chưa tạo báo cáo: hoàn 100% trong 24 giờ, không hỏi lý do. Sau đó: 14 ngày nếu lỗi kỹ thuật hoặc không đúng mô tả.',
  },
  {
    Icon: Globe2,
    value: 'Edge',
    label: 'Cloudflare 300+ POP',
    detail: 'Dữ liệu cá nhân ở Singapore. Phản hồi ~150ms.',
  },
  {
    Icon: ScrollText,
    value: 'Mở',
    label: 'Phương pháp minh bạch',
    detail: 'Mỗi báo cáo kèm prompt + dữ liệu nguồn. Không hộp đen.',
  },
];

/**
 * Wave 60.37.d HIGH-8 (sub-agent B): features-flavored pillars — product-
 * discovery focused, not conversion-safety focused. Users on /features are
 * exploring, not paying yet. Pillars match the page topic:
 *   - "10 tính năng" mirrors the hero eyebrow.
 *   - "Không cần thẻ" matches the CTA strip promise ("Miễn phí, không cần thẻ").
 *   - "Phương pháp minh bạch" kept — most relevant trust signal for a
 *     methodology-driven product on its capabilities page.
 */
export const FEATURES_PILLARS: readonly Pillar[] = [
  {
    Icon: Layers,
    value: '10',
    label: 'Tính năng · 3 chương',
    detail: 'Tử Vi · Bát Tự · MBTI · Palm · Mentor và 5 cái khác.',
  },
  {
    Icon: CreditCard,
    value: 'Miễn phí',
    label: 'Không yêu cầu thẻ',
    detail: 'Khảo sát đầu vào không thu phí, không cần đăng ký tài khoản.',
  },
  {
    Icon: ScrollText,
    value: 'Mở',
    label: 'Phương pháp minh bạch',
    detail: 'Mỗi báo cáo kèm prompt + dữ liệu nguồn. Không hộp đen.',
  },
];

interface TrustStripProps {
  className?: string;
  /** Custom 3-pillar set. Defaults to PRICING_PILLARS (refund safety). */
  pillars?: readonly Pillar[];
}

export function TrustStrip({ className, pillars = PRICING_PILLARS }: TrustStripProps) {
  return (
    <ul
      className={[
        'mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3',
        className ?? '',
      ].join(' ')}
    >
      {pillars.map(({ Icon, value, label, detail }) => (
        // Wave 60.37 — Sub-agent A CRIT-3 + HIGH-3: bg-card/30 invisible in
        // both modes, value text-xl orphans short labels like "Edge"/"Mở".
        // Bump bg → bg-card/70 (sharp contrast in dark over ink, clear white
        // card over cream in light). Combine value+label into one heading
        // line so short labels never sit alone in dead vertical space.
        <li
          key={label}
          className="flex flex-col gap-2 rounded-xl border border-border bg-card/70 p-4"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden={true} />
            <p className="font-heading text-base font-semibold leading-tight text-foreground">
              <span className="text-gold">{value}</span>
              <span className="font-normal text-muted-foreground"> · {label}</span>
            </p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
        </li>
      ))}
    </ul>
  );
}
