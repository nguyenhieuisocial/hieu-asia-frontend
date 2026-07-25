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
    // `afterInteractive` khiến Next chèn <link rel="preload" as="script"> cho
    // file này vào <head>. Đo trên bản dựng 2026-07-25: đó là 1 trong ĐÚNG 2
    // preload của cả trang, trong khi font của thẻ <h1> (phần tử LCP) không có
    // preload nào — tức đang ưu tiên ngược. `lazyOnload` bỏ preload và chờ tới
    // sau khi trang tải xong. Đánh đổi: số liệu Ahrefs bắn muộn hơn ~1 giây.
    <Script
      strategy="lazyOnload"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={key}
    />
  );
}
