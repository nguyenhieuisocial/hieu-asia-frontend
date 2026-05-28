'use client';

import { m, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Wave 60.95.j P2-#18 — Scroll-linked motion on hero badge (vault 130 §III P2 #18).
 *
 * Editorial parallax for the hero eyebrow: as the user scrolls through the first
 * 200vh, the badge fades from opacity 1 → 0.4 and translates Y 0 → 40px. Feels
 * "editorial" (slow, opacity-led) rather than "flashy" (fast, big translate).
 *
 * Why a wrapper, not edits to MarketingHero: gitnexus impact analysis on
 * MarketingHero returned HIGH risk (6 direct callers — /pricing, /features,
 * /about, /methodology, /checkout/mentor, /checkout/premium). The scroll motion
 * should only apply to the home hero, so this client-only wrapper sits as the
 * `eyebrow` ReactNode passed by `apps/web/src/app/page.tsx` and leaves
 * MarketingHero untouched.
 *
 * Renders as a `<span>` so it nests cleanly inside MarketingHero's existing
 * `<p>` eyebrow row (which contains the gold horizontal-rule prefix).
 *
 * Motion bundle: this is the first `/` route consumer of `m.*` from `motion/react`
 * — adds ~15 KB First Load JS to home chunk (Scrollyteller / BigNumberRow Phase
 * 2-4 comments explicitly defer this). Acceptable for P2 polish wave (vault 130
 * §III). LazyMotionProvider in apps/web/src/app/layout.tsx already provides
 * `domAnimation` features for this `m.*` consumer.
 *
 * Accessibility: respects `prefers-reduced-motion` via `useReducedMotion()` —
 * renders children with no transform / opacity binding when the user opts out.
 */
export function HeroBadgeScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  // Page-level scrollY (no target ref) — simpler + correct for "from page top".
  const { scrollY } = useScroll();
  // 200vh window: 0px → ~1.6kpx on a 800px viewport. Using a fixed px range
  // (computed via `window.innerHeight * 2`) would need useEffect; binding to a
  // generous fixed 1600px keeps it 0-dep and matches the editorial 200vh feel
  // across typical 700-1000px viewports (interpolation clamps at the endpoints).
  const opacity = useTransform(scrollY, [0, 1600], [1, 0.4], { clamp: true });
  const y = useTransform(scrollY, [0, 1600], [0, 40], { clamp: true });

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <m.span style={{ opacity, y, display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
      {children}
    </m.span>
  );
}
