'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

/**
 * Wave 60.83.4 — removed Wave 60.95.aj route-aware `forcedTheme="dark"`
 * override now that Phase 1-3 of Wave 60.83 migrated all marketing,
 * audience, and home tokens to theme-aware. Light mode renders correctly
 * site-wide so the override is no longer needed.
 *
 * Defaults preserved at the layout call-site:
 * - `defaultTheme="dark"` — first-visit users land on dark (vault 108 brand
 *   default identity)
 * - `enableSystem={false}` — does NOT auto-follow OS preference; light
 *   mode is purely opt-in via the toggle in SiteNav
 *
 * History:
 *  - Wave 60.95.aj (hotfix): pathname-gated forcedTheme="dark" on marketing
 *    routes to mask the dark-text-on-dark-bg bug when localStorage
 *    `theme=light` from a product toggle bled into marketing.
 *  - Wave 60.83.4 (this commit): override removed — root cause fixed at the
 *    component level instead of papered over at the provider level.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
