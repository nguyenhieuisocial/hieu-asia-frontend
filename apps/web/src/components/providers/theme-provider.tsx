'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Wave 62.05b — pathname-aware `forcedTheme="dark"` re-introduced for
 * Night "Khoảng lặng" experience routes per vault 138 "Như giấy cũ" spec.
 *
 * Two-mode architecture:
 *
 *   Day "Giấy thấm" (Paper × Ink × Ochre) — for REASONING surfaces:
 *     · / (homepage) — landing + value prop
 *     · /pricing /features /about /methodology /sample-report
 *     · /learn /cam-nang /faq /changelog
 *     · /onboarding /signin
 *     · /account/* (utility)
 *
 *   Night "Khoảng lặng" (Charcoal × Bone × Gold-soft) — for EXPERIENCE
 *   surfaces where the reading itself happens. Founder spec rationale:
 *   "Trải nghiệm lá số là một khoảng lặng — không phải app productivity."
 *     · /reading — the actual chart + AI analysis
 *     · /dashboard — saved chart + pinned insights
 *     · /tu-vi-2026 /tu-vi-hom-nay /tu-vi-nghe-nghiep /tu-vi-tai-chinh
 *       /tu-vi-tinh-yeu — pre-rendered tử vi audience routes
 *     · /dai-van-hien-tai — đại vận timeline
 *     · /mentor — mentor conversation surface
 *
 * Other routes default to whatever the layout's defaultTheme dictates
 * (Wave 62.05b ships defaultTheme="light"), and remain user-toggleable
 * via the SiteNav theme-toggle.
 *
 * History:
 *  - Wave 60.95.aj (hotfix): pathname-gated forcedTheme="dark" on marketing
 *    to mask dark-text-on-dark-bg bug when localStorage `theme=light` from
 *    a product toggle bled into marketing.
 *  - Wave 60.83.4: override removed — root cause fixed at the component
 *    level instead of papered over.
 *  - Wave 62.05b (this commit): pathname-aware forcedTheme RE-INTRODUCED
 *    with the OPPOSITE intent — force DARK on experience routes while
 *    marketing goes LIGHT (Paper). This is not a regression of 60.83.4;
 *    it's a deliberate two-mode brand architecture per vault 138.
 */
// 2026-06-22 — Founder: light/dark toggle TRÊN MỌI TRANG.
//  · Khóa forced-dark "Night/Khoảng lặng" (NIGHT_MODE_ROUTES) ĐÃ GỠ (PR trước):
//    /tu-vi-*, /dai-van-hien-tai, /reading, /dashboard, /mentor đều
//    theme-token-aware → render đúng cả light lẫn dark, chỉ bị khóa vì "vibe".
//  · Khóa force-light trang chủ '/' nay CŨNG GỠ: MultiHero/FourLens đã chuyển
//    màu cấu trúc (INK/PAPER/SOFT) sang biến theme → bật dark không còn vỡ.
// Không còn route nào bị ép theme; tất cả theo nút toggle của SiteNav.
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
