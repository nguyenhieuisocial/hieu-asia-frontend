'use client';

import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Wave 60.67 — Scrollyteller (NYT / The Pudding-style two-column reveal).
 *
 * Sticky 40% LEFT column tracks the current chapter (eyebrow + title) while
 * the 60% RIGHT column scrolls long-form body content. Mobile (<lg) collapses
 * to a single stacked column — sticky positioning eats too much viewport on
 * thumb-sized screens, and reading flow benefits from a clean top-down rhythm.
 *
 * Implementation choice — IntersectionObserver, NOT `useScroll` + `useTransform`:
 *   The vault 109 §4 spec said "0 KB cost reuse Motion useScroll" assuming
 *   Phase 2's `LazyMotionProvider` had already pulled `m.*` runtime into the
 *   methodology chunk. But Phase 2 only mounts the provider — no rendered
 *   component on `/methodology` actually consumes `m.*` yet, so being the
 *   first consumer here would pull ~15 KB into First Load JS (busts the
 *   "< 5 KB delta" gate).
 *
 *   Same decision matrix BigNumberRow (Wave 60.66.P4) and PullQuote
 *   (Wave 60.66.P5) made: native `IntersectionObserver` + CSS `position:
 *   sticky` + opacity transition delivers the identical visual at 0 KB.
 *   When a later wave puts a real `m.*` consumer on the page, swapping
 *   this implementation is a 5-LOC change.
 *
 * Behavior:
 *   - Desktop ≥ 1024px: 40/60 grid, left column `sticky top-28 self-start`.
 *     Active chapter eyebrow/title fade-cross-fade (opacity 200ms editorial
 *     ease) when scroll passes ~40% of the next chapter section.
 *   - Tablet 768-1023px: 35/65 grid, same sticky behavior.
 *   - Mobile < 768px: single column, no sticky, each chapter renders its own
 *     inline h2 above its body.
 *   - Each chapter `<section>` carries `id={chapter.id}` + `aria-labelledby`
 *     for deep-link anchors (URL hash) and accessibility.
 *   - `prefers-reduced-motion`: skip the opacity transition, just swap text.
 *
 * SEO: every chapter has a real semantic h2 inside its `<section>`, both
 * inline mobile and visually-hidden desktop (still in DOM for crawlers).
 *
 * Tokens (Wave 60.56 P1, no new colors): warm-dark-{50,100} / cream-{50,300,500}
 * / gold / gold-soft / font-marketing-display / font-mono / text-eyebrow /
 * text-section-display / max-w-marketing / ease-editorial.
 */

export type ScrollytellerChapter = {
  /** Unique chapter id (used as React key + URL hash anchor + aria-labelledby base). */
  id: string;
  /** Eyebrow text shown in sticky column when active, e.g. "CHƯƠNG 1 · TRIẾT LÝ". */
  eyebrow?: string;
  /** Chapter title shown in sticky column when active (also as h2 inline mobile). */
  title: ReactNode;
  /** Chapter body content (paragraphs, lists, callouts). */
  content: ReactNode;
};

export type ScrollytellerProps = {
  /** 4-6 chapters. */
  chapters: ScrollytellerChapter[];
  /** Optional eyebrow above the scrollyteller (rendered in sticky column slot when no chapter active). */
  fallbackEyebrow?: string;
};

export function Scrollyteller({
  chapters,
  fallbackEyebrow,
}: ScrollytellerProps) {
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  // Map active idx via IntersectionObserver — fires when each chapter section
  // crosses the ~40% viewport mark. More reliable than scrollYProgress for
  // click-jump-to-anchor (which would otherwise need a separate setState).
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    // Sort visible entries by their top-edge distance from viewport top; the
    // entry closest to (but past) the trigger line is the "active" one.
    const observer = new IntersectionObserver(
      (entries) => {
        // Collect all sections currently above the trigger line.
        const visible: Array<{ idx: number; top: number }> = [];
        for (const entry of entries) {
          const idx = Number(
            (entry.target as HTMLElement).dataset.chapterIdx ?? -1,
          );
          if (idx < 0) continue;
          if (entry.isIntersecting) {
            visible.push({
              idx,
              top: entry.boundingClientRect.top,
            });
          }
        }
        if (visible.length === 0) return;
        // Active = the lowest idx whose top is closest to (but ≤) trigger.
        // Sort by `top` ascending (most negative = furthest above = stickier),
        // pick the largest idx so deeper sections take precedence.
        visible.sort((a, b) => b.idx - a.idx);
        const next = visible[0];
        if (next) setActiveIdx(next.idx);
      },
      {
        // Trigger line ~40% from viewport top.
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0,
      },
    );

    for (const node of sectionRefs.current) {
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [chapters.length]);

  const activeChapter = chapters[activeIdx];
  const stickyEyebrow = useMemo(
    () => activeChapter?.eyebrow ?? fallbackEyebrow ?? '',
    [activeChapter, fallbackEyebrow],
  );

  return (
    <section className="relative bg-warm-dark-50 py-12 md:py-16 lg:py-20">
      <div className="mx-auto grid max-w-marketing grid-cols-1 gap-12 px-6 lg:grid-cols-[40%_60%] lg:gap-16 lg:px-12">
        {/* ─── LEFT sticky column (desktop/tablet) ─── */}
        <aside
          className="hidden lg:block"
          aria-hidden
        >
          <div className="sticky top-28 self-start">
            <div
              key={activeIdx}
              className="motion-safe:animate-[fadeInUp_300ms_cubic-bezier(0.165,0.85,0.45,1)]"
            >
              {stickyEyebrow && (
                <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
                  <span className="mr-2 inline-block h-px w-6 bg-gold align-middle" />
                  {stickyEyebrow}
                </p>
              )}
              <h3 className="mt-6 font-sans text-section-display font-bold tracking-tight text-cream-50">
                {activeChapter?.title}
              </h3>
              <div className="mt-10 flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-cream-500">
                  {String(activeIdx + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
                </span>
                <div className="h-px flex-1 bg-warm-dark-300" />
              </div>
              {/* Mini chapter list — clickable nav */}
              <ol className="mt-6 space-y-3">
                {chapters.map((c, i) => (
                  <li key={c.id}>
                    <a
                      href={`#${c.id}`}
                      className={`block font-sans text-sm leading-snug transition-colors ${
                        i === activeIdx
                          ? 'text-gold-soft'
                          : 'text-cream-500 hover:text-cream-300'
                      }`}
                    >
                      <span className="mr-2 font-mono text-[10px] tracking-[0.18em]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {c.eyebrow ?? c.id}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>

        {/* ─── RIGHT scrolling content column ─── */}
        <div className="space-y-20 lg:space-y-32">
          {chapters.map((chapter, i) => (
            <section
              key={chapter.id}
              id={chapter.id}
              ref={(node) => {
                sectionRefs.current[i] = node;
              }}
              data-chapter-idx={i}
              aria-labelledby={`${chapter.id}-title`}
              className="scroll-mt-32"
            >
              {/* Mobile-only inline header (desktop reads from sticky column). */}
              <header className="lg:hidden">
                {chapter.eyebrow && (
                  <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-gold">
                    <span className="mr-2 inline-block h-px w-6 bg-gold align-middle" />
                    {chapter.eyebrow}
                  </p>
                )}
                <h2
                  id={`${chapter.id}-title`}
                  className="mt-4 font-sans text-section-display font-bold tracking-tight text-cream-50"
                >
                  {chapter.title}
                </h2>
              </header>

              {/* SR-only desktop h2 keeps semantic outline + deep-link target. */}
              <h2
                id={`${chapter.id}-title-sr`}
                className="sr-only hidden lg:block"
              >
                {/* Desktop screen-readers read the chapter title even though
                    it's also rendered in the sticky aside. */}
                {typeof chapter.title === 'string'
                  ? chapter.title
                  : chapter.eyebrow ?? chapter.id}
              </h2>

              <div className="mt-8 lg:mt-0">{chapter.content}</div>
            </section>
          ))}
        </div>
      </div>

      {/* Local keyframes — Tailwind v4 doesn't inject these by default and we
          want a 0-KB CSS-only fade-in for the sticky column re-render. */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0.4; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
