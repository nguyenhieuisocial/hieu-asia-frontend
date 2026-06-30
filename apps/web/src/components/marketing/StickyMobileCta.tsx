'use client';

/**
 * Wave 60.97.B — Sticky mobile bottom CTA.
 *
 * Mobile-first conversion booster: a full-width sticky CTA bar that appears
 * once the user has scrolled past the hero (≥50vh). Hidden on `md+` because
 * desktop keeps the hero CTA in the viewport via sticky-scroll layout.
 *
 * Why: vault 130 #14 mobile thumb-zone audit showed the primary CTA falls
 * out of viewport on mobile after the first scroll, forcing users to scroll
 * back up to convert. This bar keeps the action one tap away.
 *
 * Behaviour:
 *   - Reveals after `window.scrollY > viewportHeight * 0.5` (one screen)
 *   - Dismissable — sessionStorage key `sticky-cta-dismissed` persists
 *     within a session (re-shows on next visit, not annoying)
 *   - Tap targets ≥44×44 (WCAG 2.5.5)
 *   - Safe-area padded (iPhone home-indicator)
 *   - Tracks `sticky_cta_shown` (first reveal) + `sticky_cta_clicked` events
 *   - Respects `prefers-reduced-motion` (no fade animation)
 *
 * Mount on marketing landing routes (/, /reading/sample-*, /bat-tu, /mbti)
 * that share the same primary action ("Lập lá số miễn phí → /onboarding").
 */

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { cn } from '@hieu-asia/ui';
import { track } from '@/lib/analytics';

const DISMISS_KEY = 'sticky-cta-dismissed';
const SCROLL_THRESHOLD_VH = 0.5; // reveal after 50vh scroll

export interface StickyMobileCtaProps {
  /** Destination URL for the primary CTA. Defaults to `/onboarding`. */
  href?: string;
  /** CTA label. Defaults to "Lập lá số miễn phí". */
  label?: string;
  /** Track ID — appended to PostHog events for funnel attribution. */
  trackId?: string;
}

export function StickyMobileCta({
  href = '/onboarding',
  label = 'Lập lá số miễn phí',
  trackId = 'home',
}: StickyMobileCtaProps) {
  const [visible, setVisible] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const trackedShownRef = React.useRef(false);

  // Read sessionStorage dismissal state on mount.
  React.useEffect(() => {
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === '1') {
        setDismissed(true);
      }
    } catch {
      /* noop */
    }
  }, []);

  // Scroll listener — reveal after threshold, hide before.
  React.useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      const threshold = window.innerHeight * SCROLL_THRESHOLD_VH;
      const shouldShow = window.scrollY > threshold;
      setVisible(shouldShow);
      if (shouldShow && !trackedShownRef.current) {
        trackedShownRef.current = true;
        track('sticky_cta_shown', { track_id: trackId });
      }
    };
    onScroll(); // initial check (covers deep-link with hash anchor)
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed, trackId]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* noop */
    }
    track('sticky_cta_dismissed', { track_id: trackId });
  };

  const handleClick = () => {
    track('sticky_cta_clicked', { track_id: trackId });
  };

  if (dismissed) return null;

  return (
    <div
      className={cn(
        // Mobile-only — desktop hero CTA stays visible.
        'fixed inset-x-0 bottom-0 z-40 md:hidden',
        // Frosted background to keep readability over any content.
        'border-t border-gold/20 bg-card/95 backdrop-blur-md',
        // Safe-area aware padding (iPhone home-indicator clearance).
        'px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3',
        // Smooth reveal/hide. Respect reduced motion via Tailwind plugin.
        'transition-transform duration-300 ease-out motion-reduce:transition-none',
        visible ? 'translate-y-0' : 'translate-y-full',
        // Suppress on print.
        'print:hidden',
      )}
      role="region"
      aria-label="Hành động chính"
    >
      <div className="mx-auto flex max-w-md items-center gap-2">
        <Link
          href={href}
          onClick={handleClick}
          data-track-id={`sticky-cta-${trackId}`}
          className={cn(
            'flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-pill bg-gold px-5 py-3',
            'font-heading text-sm font-semibold text-ink shadow-md shadow-gold/20',
            'transition duration-200 hover:bg-gold-soft active:scale-[0.98]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
        >
          <span>{label}</span>
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Đóng thanh CTA"
          className={cn(
            'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
            'text-muted-foreground hover:bg-foreground/5 hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60',
          )}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
