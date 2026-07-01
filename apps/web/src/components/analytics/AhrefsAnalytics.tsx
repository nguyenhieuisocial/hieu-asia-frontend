"use client";

import Script from "next/script";

/**
 * Ahrefs Web Analytics loader — cookieless and GDPR/CCPA-friendly, so (like
 * Plausible) it needs no consent gate and mounts directly in the layout.
 *
 * `data-key` is the public hieu.asia AWT project key (visible in the tag on
 * every page — not a secret). Defaults to the project key so it works without
 * extra Vercel env config; override with `NEXT_PUBLIC_AHREFS_ANALYTICS_KEY`.
 */
export function AhrefsAnalytics() {
  const key =
    process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY ?? "L9Xonm5PrDJxxTZ5zQzTGw";
  if (!key) return null;
  return (
    <Script
      strategy="afterInteractive"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={key}
    />
  );
}
