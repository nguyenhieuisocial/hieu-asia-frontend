'use client';

import { LazyMotion, domAnimation } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Wave 60.66.P2 — Root LazyMotion provider.
 *
 * Enables `m.div` / `m.section` (etc.) usage anywhere in the tree with
 * the smaller 4.6 KB initial bundle. `domAnimation` features (~15 KB)
 * are lazy-loaded on first animated component mount. `strict` mode
 * throws if a child uses `motion.div` directly — forces discipline so
 * Phase 3-5 reveals all flow through `m.*` and benefit from code-split.
 *
 * R6 finding: 4.6 KB + 15 KB lazy vs 30+ KB full motion → ~50% savings
 * on initial JS for marketing pages that don't animate above-the-fold.
 *
 * NOTE: existing 5 `framer-motion` imports (reading/processing, hero-entrance,
 * processing-stepper, landing/Hero, animations/TextRotate) are isolated to
 * non-home product surfaces and remain on `framer-motion@11` — no interaction
 * with this LazyMotion tree. Phase 3-5 will migrate incrementally.
 */
export function LazyMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
