'use client';

import Link from 'next/link';

/**
 * Wave 60.56 P2.2 — PreviewReadingCard (Option D "Warm-Dark Editorial").
 *
 * Sell-side preview card for /signin. R1 forensic audit flagged the current
 * sign-in surface (Card-in-cream "Continue with Google") as the weakest page
 * in the marketing funnel (DNA 3.1/5) because it asks for credentials before
 * demonstrating value. This component shows a real Tử Vi cung snapshot
 * (cung name, optional star list, insight quote) above the sign-in form,
 * sketching the payoff before the gate.
 *
 * Tokens (from `apps/web/tailwind.config.ts`, Wave 60.56 P1 commit 0b38173):
 *   bg-card / border-border / text-foreground / text-foreground/95 /
 *   text-muted-foreground / text-muted-foreground/70 / text-gold / text-gold-soft /
 *   border-gold-soft / font-editorial-display / font-mono / text-eyebrow /
 *   rounded-card-editorial / rounded-pill / ease-editorial
 */
export type PreviewReadingCardProps = {
  /** Italic serif headline, e.g. "Cung Mệnh". */
  cungName: string;
  /** Sans subtitle under the cung name, e.g. "Tử Vi · Bản đồ sao thời điểm sinh". */
  cungSubtitle?: string;
  /** Optional star pills, e.g. ["Tử Vi", "Thiên Tướng", "Hữu Bật"]. */
  starList?: string[];
  /** Italic serif quote — the actual insight being sold. */
  insightQuote: string;
  /** Mono uppercase attribution line under the quote. */
  insightAuthor?: string;
  /** Pill CTA label, e.g. "Tiếp tục đăng nhập để xem đầy đủ". */
  ctaLabel: string;
  /** CTA destination — anchor (`#signin-form`) or full route. */
  ctaHref: string;
  /** Extra wrapper classes (e.g. layout width on parent grid). */
  className?: string;
};

/**
 * 8-pointed lotus / compass-rose ornament. Matches the gold-ring spirit of
 * MarketingHero without duplicating the double-ring SVG.
 */
function LotusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2 L14 8 L20 9 L15 13 L17 19 L12 16 L7 19 L9 13 L4 9 L10 8 Z" />
    </svg>
  );
}

export function PreviewReadingCard({
  cungName,
  cungSubtitle,
  starList,
  insightQuote,
  insightAuthor,
  ctaLabel,
  ctaHref,
  className,
}: PreviewReadingCardProps) {
  return (
    <div
      className={`relative bg-card rounded-card-editorial border border-border p-8 md:p-12 ${className ?? ''}`}
    >
      <LotusIcon className="absolute right-6 top-6 size-8 text-gold opacity-10" />

      <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
        — LÁ SỐ MẪU · DEMO
      </p>

      <h3 className="mt-4 font-editorial-display text-3xl italic text-foreground">
        {cungName}
      </h3>

      {cungSubtitle && (
        <p className="mt-1 font-sans text-sm text-muted-foreground">{cungSubtitle}</p>
      )}

      {starList && starList.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {starList.map((star) => (
            <li
              key={star}
              className="rounded-pill bg-muted px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              {star}
            </li>
          ))}
        </ul>
      )}

      <blockquote className="mt-8 border-l-2 border-gold-soft pl-6">
        <p className="font-editorial-display text-xl italic leading-relaxed text-foreground/95">
          {insightQuote}
        </p>
        {insightAuthor && (
          <footer className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            — {insightAuthor}
          </footer>
        )}
      </blockquote>

      <Link
        href={ctaHref}
        className="mt-8 inline-flex w-full items-center justify-center rounded-pill bg-gold px-7 py-4 font-sans text-sm font-medium text-ink transition-all duration-300 ease-editorial hover:bg-gold-soft"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
