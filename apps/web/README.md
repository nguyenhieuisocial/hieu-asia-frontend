# web (apps/web)

Next.js 15 app for `hieu.asia` — landing, onboarding, reading flow, dashboard.

## Scripts

```
pnpm dev          # localhost:3000
pnpm build        # production build
pnpm analyze      # bundle analyzer (opens browser report)
pnpm lint
pnpm types:check
```

## Performance

- **Target Lighthouse mobile: ≥ 90** (LCP < 2.5s, CLS < 0.1, INP < 200ms)
- Performance budget: per-asset chunk warns at > 250 kB (see `next.config.ts`)
- Run `pnpm analyze` before merging large UI changes
- Verify with `pnpm dlx unlighthouse --site https://hieu.asia` after deploy

## i18n

Phase 1 skeleton via `next-intl`. See `src/i18n/README.md`.
