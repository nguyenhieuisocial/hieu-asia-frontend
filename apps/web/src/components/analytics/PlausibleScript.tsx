"use client";

import Script from "next/script";

/**
 * Plausible Analytics loader. Only renders the <script> when
 * `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is configured — otherwise no-op.
 *
 * `script.tagged-events.js` enables both auto page views and the
 * `plausible(eventName, { props })` API used by `lib/analytics.ts`.
 */
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC
    ?? "https://plausible.io/js/script.tagged-events.js";
  return (
    <Script
      strategy="afterInteractive"
      src={src}
      data-domain={domain}
    />
  );
}
