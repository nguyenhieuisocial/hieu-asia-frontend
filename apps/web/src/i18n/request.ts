import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from './config';

/**
 * Server-side locale resolver. Resolution order:
 *   1. `NEXT_LOCALE` cookie (user-toggled)
 *   2. `Accept-Language` header (browser preference)
 *   3. defaultLocale ('vi')
 *
 * Used by next-intl's plugin to load messages per request.
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
