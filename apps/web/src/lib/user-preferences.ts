'use client';

import * as React from 'react';
import { getSupabaseAuth } from './auth-client';

const STORAGE_KEY = 'hieu.user.preferences';

export type HoroscopeTime = '06' | '07' | '08' | '22';
export type Language = 'vi' | 'en';
export type DateFormat = 'solar' | 'lunar' | 'both';
export type ThemeMode = 'dark' | 'light' | 'system';
export type FontSize = 'default' | 'large' | 'xl';

export interface UserPreferences {
  notifications: {
    daily_push: boolean;
    daily_telegram: boolean;
    daily_email: boolean;
    lunar_reminder: boolean;
    horoscope_time: HoroscopeTime;
    reading_complete: boolean;
  };
  locale: {
    language: Language;
    date_format: DateFormat;
    timezone: string;
  };
  theme: {
    mode: ThemeMode;
    reduced_motion: boolean;
    font_size: FontSize;
    high_contrast: boolean;
  };
  privacy: {
    analytics_opt_in: boolean;
    marketing_email: boolean;
    personalized: boolean;
  };
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  notifications: {
    daily_push: false,
    daily_telegram: false,
    daily_email: false,
    lunar_reminder: false,
    horoscope_time: '06',
    reading_complete: true,
  },
  locale: {
    language: 'vi',
    date_format: 'both',
    timezone:
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh'
        : 'Asia/Ho_Chi_Minh',
  },
  theme: {
    mode: 'dark',
    reduced_motion: false,
    font_size: 'default',
    high_contrast: false,
  },
  privacy: {
    analytics_opt_in: false,
    marketing_email: false,
    personalized: true,
  },
};

function mergeWithDefaults(partial: Partial<UserPreferences>): UserPreferences {
  return {
    notifications: { ...DEFAULT_PREFERENCES.notifications, ...(partial.notifications ?? {}) },
    locale: { ...DEFAULT_PREFERENCES.locale, ...(partial.locale ?? {}) },
    theme: { ...DEFAULT_PREFERENCES.theme, ...(partial.theme ?? {}) },
    privacy: { ...DEFAULT_PREFERENCES.privacy, ...(partial.privacy ?? {}) },
  };
}

export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_PREFERENCES;
  try {
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return mergeWithDefaults(parsed);
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences, userId?: string | null): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));

  // Fire-and-forget sync to Worker if analytics opted in.
  if (prefs.privacy.analytics_opt_in && userId) {
    (async () => {
      const sb = getSupabaseAuth();
      let token: string | undefined;
      if (sb) {
        const { data } = await sb.auth.getSession();
        token = data.session?.access_token;
      }
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      fetch('/api/user/preferences', {
        method: 'POST',
        headers,
        body: JSON.stringify({ user_id: userId, prefs }),
      }).catch(() => {
        /* best-effort */
      });
    })().catch(() => {
      /* best-effort */
    });
  }
}

/**
 * Apply preferences side-effects to the DOM.
 *
 * - theme.mode: handled separately via next-themes setTheme(); we only set
 *   data-theme as a backup for non-React consumers.
 * - reduced_motion: data-reduced-motion attribute on <html>.
 * - font_size: html font-size override (rem scale).
 * - high_contrast: data-high-contrast attribute on <html>.
 */
export function applyPreferencesEffects(prefs: UserPreferences): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.dataset.reducedMotion = prefs.theme.reduced_motion ? 'true' : 'false';
  root.dataset.highContrast = prefs.theme.high_contrast ? 'true' : 'false';

  const fontSizePx =
    prefs.theme.font_size === 'xl' ? '20px' : prefs.theme.font_size === 'large' ? '18px' : '16px';
  root.style.fontSize = fontSizePx;
}

export function usePreferences(userId?: string | null) {
  const [prefs, setPrefs] = React.useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const loaded = loadPreferences();
    setPrefs(loaded);
    applyPreferencesEffects(loaded);
    setHydrated(true);
  }, []);

  const update = React.useCallback(
    (patch: Partial<UserPreferences>) => {
      setPrefs((prev) => {
        const next: UserPreferences = {
          notifications: { ...prev.notifications, ...(patch.notifications ?? {}) },
          locale: { ...prev.locale, ...(patch.locale ?? {}) },
          theme: { ...prev.theme, ...(patch.theme ?? {}) },
          privacy: { ...prev.privacy, ...(patch.privacy ?? {}) },
        };
        savePreferences(next, userId);
        applyPreferencesEffects(next);
        return next;
      });
    },
    [userId],
  );

  return { prefs, update, hydrated };
}
