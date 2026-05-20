# i18n (web)

V1 minimal setup using [next-intl](https://next-intl-docs.vercel.app/).

## What's wired

- `config.ts` — locale list (`vi`, `en`), default = `vi`
- `messages/vi.json` — Vietnamese strings (default, source of truth)
- `messages/en.json` — English mirror
- `request.ts` — server-side locale resolver (cookie → Accept-Language → default)
- `next.config.ts` — `next-intl/plugin` enabled, pointing at `./src/i18n/request.ts`
- `app/layout.tsx` — wraps children in `<NextIntlClientProvider>`

## Status: Phase 1 (skeleton)

Only ~30 key strings are extracted into JSON. Most UI text is still hardcoded
Vietnamese in components.

## Phase 2 (full coverage) — TODO

- [ ] Refactor every Vietnamese literal in `components/*` → `useTranslations()`
- [ ] Add language switcher in header (`NEXT_LOCALE` cookie)
- [ ] Decide on URL strategy:
  - Option A (default): cookie-based, same paths `/onboarding`, `/reading/:id`
  - Option B: localized paths `/en/onboarding`, `/vi/onboarding` (better SEO)
- [ ] Hook `next-intl/middleware` for Option B
- [ ] Translate dynamic content from backend (report text, mentor responses)
  via backend `Accept-Language` header

## Usage

### Server component

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('landing');
  return <h1>{t('title')}</h1>;
}
```

### Client component

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('landing');
  return <h1>{t('title')}</h1>;
}
```

## Adding a string

1. Add to `messages/vi.json` (source of truth)
2. Mirror to `messages/en.json` (English copy)
3. Reference via `t('key')` in component

Keep keys flat/short; nest by surface (landing, errors, processing, …).
