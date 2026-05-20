import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from './config';

/**
 * Locale resolver for Telegram Mini App.
 *
 * Telegram does not pass Accept-Language reliably; we rely on:
 *   1. `NEXT_LOCALE` cookie (set by language toggle)
 *   2. Accept-Language fallback (preview/desktop)
 *   3. Default 'vi'
 *
 * NOTE: Telegram WebApp SDK exposes `initDataUnsafe.user.language_code` — the
 * client side can `document.cookie='NEXT_LOCALE=...'` once SDK is ready, then
 * reload for full UI translation. See `TelegramThemeBridge` for the pattern.
 */
export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  const messages = (await import(`./messages/${locale}.json`)).default;
  return { locale, messages };
});

async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale;

  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') ?? '';
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.trim().toLowerCase();
  if (preferred && isLocale(preferred)) return preferred;

  return defaultLocale;
}
