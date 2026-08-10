'use client';

import { useEffect } from 'react';

/**
 * Corrects `<html lang>` on pages whose language differs from the root
 * layout's hardcoded `lang="vi"`. Mount this ONCE near the top of any
 * non-Vietnamese page (e.g. `app/en/page.tsx`). Renders nothing.
 *
 * Why client-side: the root layout cannot read per-request locale without
 * calling `headers()`/`cookies()`, which would mark all 1,113 pages dynamic
 * (see the warning comment in `src/i18n/request.ts`). This runs after
 * hydration instead — negligible cost for a single attribute on one page.
 */
export function SetHtmlLang({ lang }: { lang: string }): null {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}
