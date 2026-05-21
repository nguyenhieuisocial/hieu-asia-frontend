'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { getWebApp } from '@/lib/telegram-init';
import { exchangeInitDataForJwt } from '@/lib/telegram-auth';

/**
 * Sync Telegram themeParams → CSS variables + next-themes color scheme.
 *
 * - Maps every themeParam (bg, text, hint, link, button, secondary_bg, accent, ...)
 *   to `--tg-*` CSS variables on <html>, so the UI can opt-in via CSS.
 * - Mirrors `WebApp.colorScheme` to next-themes ("dark"/"light") and to
 *   `data-tg-color-scheme` on <html> for non-next-themes consumers.
 * - Re-applies on Telegram "themeChanged" event (user toggles theme).
 * - Outside Telegram, no-ops silently.
 * - Also kicks off best-effort initData → JWT exchange (mock when backend unset).
 */
type ThemeParamKey =
  | 'bg_color'
  | 'secondary_bg_color'
  | 'text_color'
  | 'hint_color'
  | 'link_color'
  | 'button_color'
  | 'button_text_color'
  | 'header_bg_color'
  | 'accent_text_color'
  | 'section_bg_color'
  | 'section_header_text_color'
  | 'subtitle_text_color'
  | 'destructive_text_color'
  | 'section_separator_color'
  | 'bottom_bar_bg_color';

const PARAM_TO_VAR: Record<ThemeParamKey, string> = {
  bg_color: '--tg-bg-color',
  secondary_bg_color: '--tg-secondary-bg',
  text_color: '--tg-text-color',
  hint_color: '--tg-hint-color',
  link_color: '--tg-link-color',
  button_color: '--tg-button-color',
  button_text_color: '--tg-button-text-color',
  header_bg_color: '--tg-header-bg',
  accent_text_color: '--tg-accent-text',
  section_bg_color: '--tg-section-bg',
  section_header_text_color: '--tg-section-header-text',
  subtitle_text_color: '--tg-subtitle-text',
  destructive_text_color: '--tg-destructive-text',
  section_separator_color: '--tg-section-separator',
  bottom_bar_bg_color: '--tg-bottom-bar-bg',
};

export function TelegramThemeBridge() {
  const { setTheme } = useTheme();

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const webApp = await getWebApp();
      if (cancelled || !webApp) return;

      const applyTheme = () => {
        const root = document.documentElement;
        const params = webApp.themeParams as Partial<Record<ThemeParamKey, string>> | undefined;
        if (params) {
          for (const [key, cssVar] of Object.entries(PARAM_TO_VAR) as [ThemeParamKey, string][]) {
            const value = params[key];
            if (value) root.style.setProperty(cssVar, value);
          }
        }
        if (webApp.colorScheme === 'dark' || webApp.colorScheme === 'light') {
          root.dataset.tgColorScheme = webApp.colorScheme;
          setTheme(webApp.colorScheme);
        }
      };

      applyTheme();
      webApp.onEvent('themeChanged', applyTheme);

      // Best-effort: get a JWT from initData. Mock-mode if backend unset.
      void exchangeInitDataForJwt();
    })();

    return () => {
      cancelled = true;
    };
  }, [setTheme]);

  return null;
}
