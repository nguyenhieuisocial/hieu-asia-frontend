/**
 * Wave 60.35 — trust strip for marketing pages.
 *
 * 3 fact-based pillars (NOT fabricated user counts — honest brand voice
 * "Hiểu mình. Quyết định mình.").
 *
 * - 24h refund: real policy (vault 80 / pricing page hero already cites)
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

import { ShieldCheck, Globe2, ScrollText } from 'lucide-react';

interface Pillar {
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  value: string;
  label: string;
  detail: string;
}

const PILLARS: readonly Pillar[] = [
  {
    Icon: ShieldCheck,
    value: '24 giờ',
    label: 'Hoàn tiền không hỏi',
    detail: 'Trước khi báo cáo tạo xong, hoàn 100% chỉ với 1 click.',
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

interface TrustStripProps {
  className?: string;
}

export function TrustStrip({ className }: TrustStripProps) {
  return (
    <ul
      className={[
        'mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3',
        className ?? '',
      ].join(' ')}
    >
      {PILLARS.map(({ Icon, value, label, detail }) => (
        <li
          key={label}
          className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/30 p-4 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-gold/80" aria-hidden={true} />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
          </div>
          <p className="font-heading text-xl font-semibold leading-none text-foreground">
            {value}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">{detail}</p>
        </li>
      ))}
    </ul>
  );
}
