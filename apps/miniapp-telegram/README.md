# miniapp-telegram (apps/miniapp-telegram)

Telegram Mini App surface for `miniapp.hieu.asia` — opens inside Telegram WebView via BotFather Mini App link.

## Scripts

```
pnpm dev          # localhost:3002
pnpm build
pnpm lint
pnpm types:check
```

## Performance

- **Target Lighthouse mobile: ≥ 90** (Mini App is mobile-only)
- Cold-start budget: first paint < 1.5s on 4G (Telegram WebView wraps Chrome 100+)
- Keep First Load JS under 120 kB per route (current routes 115-122 kB)

## i18n

Phase 1 skeleton via `next-intl` (locale resolved from cookie + Accept-Language).
Telegram WebApp SDK exposes `initDataUnsafe.user.language_code` — Phase 2 will
sync that into the `NEXT_LOCALE` cookie via TelegramThemeBridge.

## CSP

`Content-Security-Policy: frame-ancestors 'self' https://*.telegram.org https://web.telegram.org`
set in `next.config.ts` to allow embedding in Telegram WebView.
