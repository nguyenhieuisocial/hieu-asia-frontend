'use client';

/**
 * Mode-aware content slots — roadmap §3.5.
 *
 * Both <BeginnerContent> and <ExpertContent> render their children in the
 * initial HTML (important for SEO crawlers and for noscript users) and
 * toggle visibility on the client via `useExpertMode()`.
 *
 * Default state (SSR + pre-hydration): beginner visible, expert hidden.
 * After hydration, the saved/URL mode wins. We hide via CSS (display:none
 * through Tailwind `hidden`) plus `aria-hidden` so screen readers and
 * automated tools don't dual-read.
 *
 * Inline <ExpertTerm> wraps a parenthetical / jargon span that only shows
 * in expert mode — use for things like "tài lộc (cung Tài Bạch)".
 */

import * as React from 'react';
import { useExpertMode } from '@/hooks/use-expert-mode';

interface ModeBlockProps {
  children: React.ReactNode;
  /** Optional className passed through to the wrapper. */
  className?: string;
}

export function BeginnerContent({ children, className }: ModeBlockProps) {
  const { expertMode } = useExpertMode();
  // Before hydration (null) -> show beginner. In expert mode -> hide.
  const hidden = expertMode === true;
  return (
    <div
      data-mode="beginner"
      className={className}
      hidden={hidden}
      aria-hidden={hidden}
    >
      {children}
    </div>
  );
}

export function ExpertContent({ children, className }: ModeBlockProps) {
  const { expertMode } = useExpertMode();
  // Before hydration or in beginner mode -> hide. In expert mode -> show.
  const hidden = expertMode !== true;
  return (
    <div
      data-mode="expert"
      className={className}
      hidden={hidden}
      aria-hidden={hidden}
    >
      {children}
    </div>
  );
}

interface ExpertTermProps {
  children: React.ReactNode;
  /** Optional className. */
  className?: string;
}

/**
 * Inline span that only appears in expert mode. Use for parenthetical
 * Tử Vi terms inside otherwise plain Vietnamese prose, e.g.:
 *   tài lộc<ExpertTerm> (cung Tài Bạch)</ExpertTerm>
 */
export function ExpertTerm({ children, className }: ExpertTermProps) {
  const { expertMode } = useExpertMode();
  const hidden = expertMode !== true;
  return (
    <span
      data-mode="expert"
      className={className}
      hidden={hidden}
      aria-hidden={hidden}
    >
      {children}
    </span>
  );
}
