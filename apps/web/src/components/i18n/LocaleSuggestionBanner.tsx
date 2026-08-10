'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  dismiss,
  getEnglishCounterpart,
  isDismissed,
  prefersNonVietnamese,
} from '@/lib/locale-suggestion';

/**
 * "View in English?" suggestion banner — v1.
 *
 * Shows only when ALL of these hold:
 *   1. The current page has a real English counterpart (EN_AVAILABLE_PAGES).
 *   2. The browser's language setting isn't Vietnamese (navigator.language —
 *      the user's actual preference, not IP/location).
 *   3. The visitor hasn't dismissed it before (localStorage, remembered
 *      forever — "nhớ luôn, không hỏi lại").
 *
 * A SUGGESTION, never a forced redirect: Google explicitly discourages
 * auto-redirecting by IP/geo because crawlers (which request from a single
 * location) would then never see the other-language content, and it wrongly
 * assumes location implies language.
 */
export function LocaleSuggestionBanner(): React.ReactElement | null {
  const pathname = usePathname();
  const [show, setShow] = React.useState(false);
  const target = pathname ? getEnglishCounterpart(pathname) : null;

  React.useEffect(() => {
    if (!target) return;
    if (isDismissed()) return;
    if (!prefersNonVietnamese()) return;
    setShow(true);
  }, [target]);

  if (!show || !target) return null;

  const close = () => {
    dismiss();
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Language suggestion"
      className="fixed right-4 top-20 z-50 w-[min(320px,calc(100vw-2rem))] rounded-lg border border-gold/30 bg-card/95 p-4 text-sm text-foreground shadow-2xl backdrop-blur"
    >
      <p className="text-foreground/90">This page is also available in English.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={target}
          className="rounded-md bg-gold px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gold/90"
          onClick={dismiss}
        >
          View in English
        </a>
        <button
          type="button"
          onClick={close}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-card"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
