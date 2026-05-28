'use client';

import { useRouter } from 'next/navigation';
import { GlassPanel } from './GlassPanel';

/**
 * Wave 60.66.P3 — IntentChips (Option E "Editorial Live" vault 108 §5 + vault 109 §3 Phase 3).
 *
 * Perplexity-style chip row for capturing user intent BEFORE the CTA click.
 * Renders 4-8 chips. On click → router.push(`/onboarding?intent=<slug>`) so
 * the onboarding flow can seed PostHog `onboarding_intent_seed` event for
 * funnel analysis (vault 108 §5 Phase 3).
 *
 * Client component (uses `useRouter`) — kept lean: no Motion runtime, just
 * CSS transitions for hover. This keeps `/` First Load JS within budget
 * (vault 109 §6). PostHog is feature-detected via `window.posthog` to avoid
 * a hard SDK dep at this layer.
 *
 * Glassmorphism wrapper (Wave 60.66.P2 — 3-5 element cap): one panel allowed
 * here per page (BentoLens uses solid bg, hero CTAs use 1 panel via PaintedCanvas
 * = 2 total max). Falls back to opaque warm-dark via `globals.css`
 * `prefers-reduced-transparency` rule.
 *
 * Tokens: warm-dark-{200,300} / gold / gold-soft / cream-300 / rounded-pill /
 * ease-editorial. No new tokens.
 */

export type IntentChip = {
  /** Slug for /onboarding?intent= URL param. */
  slug: string;
  /** Chip label, e.g. "Cung mệnh", "Đại vận". */
  label: string;
};

export type IntentChipsProps = {
  chips: IntentChip[];
  /** Optional eyebrow above chips. */
  eyebrow?: string;
  /** Use glassmorphism background — default true. */
  glass?: boolean;
};

export function IntentChips({ chips, eyebrow, glass = true }: IntentChipsProps) {
  const router = useRouter();

  const handleClick = (slug: string) => {
    // PostHog feature-detect — no hard dep on import (avoid SSR / opt-out issues).
    const ph = (
      window as unknown as {
        posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
      }
    ).posthog;
    try {
      ph?.capture('intent_chip_clicked', { intent: slug });
    } catch {
      /* ignore — analytics best-effort */
    }
    router.push(`/onboarding?intent=${encodeURIComponent(slug)}`);
  };

  const inner = (
    <div className="px-5 py-5">
      {eyebrow && (
        <p className="mb-3 text-center font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
          — {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
        {chips.map((chip) => (
          <button
            key={chip.slug}
            type="button"
            onClick={() => handleClick(chip.slug)}
            // Wave 60.97.1 — `min-h-11` + `touch-manipulation` so each chip
            // hits the 44px tap-target minimum on mobile (was 38px → fail
            // WCAG 2.5.5). `active:bg-muted` gives instant touch feedback on
            // iOS/Android. Visible padding (px-4 py-2) unchanged.
            className="rounded-pill border border-gold/15 bg-card px-4 py-2 font-sans text-sm font-medium text-gold-soft transition-all duration-300 ease-editorial hover:border-gold/30 hover:bg-muted hover:text-gold active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-warm-dark-50 min-h-11 touch-manipulation"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (!glass) {
    return inner;
  }

  return (
    <GlassPanel tint="dark" border="gold" className="overflow-hidden">
      {inner}
    </GlassPanel>
  );
}
