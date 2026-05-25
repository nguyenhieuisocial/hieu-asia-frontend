'use client';

/**
 * Wave 60.31 — extracted from inline `<script dangerouslySetInnerHTML>`
 * in `apps/web/src/app/privacy/page.tsx:545-571`.
 *
 * The previous inline script (built from a static template literal) had
 * only theoretical XSS risk because there was no interpolation. But the
 * PATTERN is a footgun: any future maintainer adding `${variable}` to
 * that template would silently introduce a real XSS surface, with no
 * lint or type-check catching it.
 *
 * This client component encapsulates the same behaviour using:
 *   - Real React `onClick` (no string-based handler)
 *   - The existing `reopenBanner()` helper from `/lib/consent.ts` which
 *     centralizes consent-teardown logic (cookie write + custom event
 *     dispatch) — no logic duplication.
 *
 * Privacy page stays a server component (heavy static content); only
 * this small interactive button hydrates client-side.
 *
 * Per vault 94 prevention contract (Wave 60.31): admin/web pages MUST
 * NOT use `<script dangerouslySetInnerHTML>` for click handlers or any
 * other interactive logic. Extract to a `'use client'` component instead.
 * The only acceptable `dangerouslySetInnerHTML` use is structured-data
 * JSON-LD (schema.org metadata for SEO).
 */

import { reopenBanner } from '@/lib/consent';

export function ReopenCmpButton() {
  return (
    <button
      type="button"
      onClick={reopenBanner}
      className="mt-2 rounded-md border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10"
    >
      Quản lý cookies →
    </button>
  );
}
