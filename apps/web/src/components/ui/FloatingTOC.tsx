'use client';

/**
 * FloatingTOC — generic floating "jump to section" control for long content pages
 * on mobile (e.g. /methodology/tu-vi). Renders a fixed floating button that opens
 * a bottom Sheet listing every section; tapping one smooth-scrolls the matching
 * anchor (`document.getElementById(id)`) into view. Unlike ReportTOC, this does
 * NOT drive any accordion — it is fully self-contained and only needs the
 * sections' DOM `id`s to already exist on the page.
 *
 * Mobile-only (`md:hidden`) — desktop pages keep their own sticky sidebar TOC.
 * Bottom-LEFT placement mirrors ReportTOC and avoids any bottom-right CTA/FAB.
 *
 * Design: editorial GU — `rounded-card-editorial` (2px), `border-gold/30`,
 * minimal `shadow-sm`, numbered mono index, gold active state. Active section is
 * tracked with a lightweight IntersectionObserver (no scroll listener).
 * Respects `prefers-reduced-motion` (instant jump instead of smooth scroll).
 * Tap targets are >= 44px.
 */

import * as React from 'react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  cn,
} from '@hieu-asia/ui';
import { List, Check } from 'lucide-react';

export interface FloatingTOCItem {
  id: string;
  label: string;
}

export function FloatingTOC({
  items,
  title = 'Mục lục',
}: {
  items: FloatingTOCItem[];
  title?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | undefined>(undefined);
  const reducedMotionRef = React.useRef(false);

  // Read reduced-motion preference once on mount.
  React.useEffect(() => {
    try {
      reducedMotionRef.current = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
    } catch {
      /* ignore */
    }
  }, []);

  // Track the section currently in view to highlight it in the list.
  React.useEffect(() => {
    if (items.length < 2 || typeof IntersectionObserver === 'undefined') return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      // Bias the "active" band toward the top of the viewport.
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const handleSelect = (id: string) => {
    setActiveId(id);
    setOpen(false);
    // Defer until the Sheet close animation has settled so the target's
    // position does not shift mid-scroll.
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: reducedMotionRef.current ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 180);
  };

  return (
    <div className="md:hidden print:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label={`Mở ${title.toLowerCase()}`}
            className="fixed bottom-24 left-4 z-40 h-11 min-h-[44px] gap-2 rounded-card-editorial border-gold/30 bg-card/95 shadow-sm backdrop-blur"
          >
            <List className="size-4" aria-hidden="true" />
            {title}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-card-editorial">
          <SheetTitle className="mb-2 font-heading text-base text-foreground">
            {title}
          </SheetTitle>
          <nav
            aria-label={title}
            className="flex flex-col gap-1 overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))] [max-height:60vh]"
          >
            {items.map((item, i) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex min-h-[44px] items-center justify-between gap-3 rounded-md px-3 py-3 text-left text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                    isActive
                      ? 'bg-gold/10 font-medium text-gold'
                      : 'text-foreground hover:bg-muted/60',
                  )}
                >
                  <span className="inline-flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="w-5 shrink-0 font-mono text-xs text-muted-foreground"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {isActive ? (
                    <Check className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
