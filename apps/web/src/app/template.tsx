'use client';

import * as React from 'react';

/**
 * Template — Next remounts this on every client navigation (unlike layout.tsx
 * which persists), so the `.page-fade` class replays a soft opacity fade-in on
 * each route change → mượt, hết "bụp".
 *
 * Design constraints:
 * - Opacity ONLY (CSS in globals.css, no transform) → KHÔNG tạo containing
 *   block, giữ nguyên `position: fixed/sticky` của SiteNav + StickyMobileCta.
 * - Bỏ qua animation ở LẦN RENDER ĐẦU (module flag) → không trì hoãn LCP; chỉ
 *   fade khi người dùng điều hướng giữa các trang.
 * - Reduced-motion: `.page-fade` đã gated trong globals.css → hiện ngay.
 */
let isFirstRender = true;

export default function Template({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const skip = isFirstRender;
  isFirstRender = false;
  return <div className={skip ? undefined : 'page-fade'}>{children}</div>;
}
