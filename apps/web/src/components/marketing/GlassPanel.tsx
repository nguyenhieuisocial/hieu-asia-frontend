import type { ReactNode } from 'react';

/**
 * Wave 60.66.P2 — GlassPanel (Option E "Editorial Live" overlay layer).
 *
 * Reusable glassmorphism wrapper for CTA / trust-line overlays on top of
 * `<PaintedCanvas>` backgrounds. CSS-only (no JS), respects
 * `prefers-reduced-transparency` via the `.glass-panel` className hook in
 * `globals.css` (Wave 60.66.P2 accessibility commitment).
 *
 * Tokens strictly from Wave 60.56 P1: warm-dark / cream / gold. No new colors.
 *
 * Anti-patterns (R6): never stack >3 glass elements (mid-Android jank); never
 * apply over body paragraph text (WCAG contrast fail). Use only for floating
 * accent panels around CTAs and short trust lines.
 */
export type GlassPanelProps = {
  children: ReactNode;
  /** Background tint variant. `dark` (default) = warm-dark-100/55; `light` = white/55. */
  tint?: 'light' | 'dark';
  /** Border accent. `gold` (default) = gold/20 for CTA emphasis; `none` = no border. */
  border?: 'gold' | 'none';
  /** className passthrough (padding, margin, max-width). */
  className?: string;
};

export function GlassPanel({
  children,
  tint = 'dark',
  border = 'gold',
  className,
}: GlassPanelProps) {
  // Tailwind arbitrary-value classes for backdrop-blur and saturate to keep
  // exact 14px / 140% spec without polluting tailwind.config theme.
  const tintClass =
    tint === 'light'
      ? 'bg-white/55 border-white/20'
      : 'bg-warm-dark-100/55 border-warm-dark-300/30';
  const borderClass = border === 'gold' ? 'border-gold/20' : '';

  return (
    <div
      className={`glass-panel relative rounded-2xl border backdrop-blur-[14px] backdrop-saturate-[140%] ${tintClass} ${borderClass} ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
