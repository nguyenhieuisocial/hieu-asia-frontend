'use client';

/**
 * ScrollProgress
 * ---------------
 * A thin, fixed top progress bar (gold) that fills horizontally as the page
 * is scrolled from top (0%) to bottom (100%).
 *
 * Design intent: premium / editorial. The bar itself is a subtle gold accent
 * that grows in width; it is NOT a decorative animation — it always reflects
 * the real scroll position. Because of that, it works the same whether or not
 * the user prefers reduced motion. The only thing reduced motion changes is
 * whether the width change is eased (a short CSS transition) or snaps
 * instantly. We keep that distinction small and tasteful.
 *
 * Behaviour:
 *  - Fixed to the top of the viewport, full width, very high z-index.
 *  - pointer-events: none so it never intercepts clicks.
 *  - Width is driven by scrollTop / (scrollHeight - clientHeight), clamped 0..1.
 *  - One passive scroll listener + a resize listener, both cleaned up on unmount.
 *  - Updates are coalesced into a single requestAnimationFrame to avoid
 *    layout thrash on rapid scroll events; the RAF is cancelled on unmount.
 *  - SSR-safe: every window/document/matchMedia access lives inside useEffect.
 */

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface ScrollProgressProps {
  /** Optional extra classes for the fixed track wrapper. */
  className?: string;
  /** Bar thickness in pixels. Defaults to 3px (thin, editorial). */
  height?: number;
}

export function ScrollProgress({
  className,
  height = 3,
}: ScrollProgressProps): React.JSX.Element {
  // Scroll completion in the range 0..1. Drives the fill width.
  const [progress, setProgress] = useState<number>(0);
  // When reduced motion is requested we drop the easing transition so the
  // bar snaps to position instead of gliding.
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  // Holds the pending RAF id so we can coalesce scroll/resize updates and
  // cancel any in-flight frame on unmount.
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // --- prefers-reduced-motion: detect + stay in sync if the user toggles it.
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(motionQuery.matches);
    const onMotionChange = (event: MediaQueryListEvent): void => {
      setReduceMotion(event.matches);
    };
    motionQuery.addEventListener('change', onMotionChange);

    // --- Core measurement: how far down the document are we, 0..1?
    const measure = (): void => {
      const doc = document.documentElement;
      // Total scrollable distance. Guard against zero/negative on short pages.
      const scrollable = doc.scrollHeight - doc.clientHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }
      const ratio = doc.scrollTop / scrollable;
      // Clamp to 0..1 (overscroll / rubber-banding can push outside).
      const clamped = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio;
      setProgress(clamped);
    };

    // Coalesce bursts of scroll/resize events into one measurement per frame.
    const scheduleMeasure = (): void => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        measure();
      });
    };

    // Initial paint reflects current position (e.g. restored scroll on reload).
    measure();

    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);

    return () => {
      motionQuery.removeEventListener('change', onMotionChange);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    // Fixed, full-width track pinned to the very top. pointer-events: none so
    // it never blocks interaction with the page beneath it.
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      {/* The gold fill. scaleX is GPU-friendly and avoids reflow on each frame.
          transform-origin left so it grows from the start of the line. */}
      <div
        style={{
          height: '100%',
          width: '100%',
          transformOrigin: 'left center',
          transform: `scaleX(${progress})`,
          // Brand gold → ochre, left-to-right, for a touch of depth.
          background:
            'linear-gradient(90deg, #E0AE62 0%, #A47532 100%)',
          // Slow, soft easing when motion is allowed; snap when reduced.
          transition: reduceMotion ? 'none' : 'transform 120ms ease-out',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
