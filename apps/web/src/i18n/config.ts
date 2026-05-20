/**
 * Locale configuration for hieu.asia web app.
 *
 * V1: default Vietnamese, English available as toggle.
 * V2: add Chinese (zh) + Thai (th) for SEA expansion.
 */

export const locales = ['vi', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'vi';

export const localeLabels: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
