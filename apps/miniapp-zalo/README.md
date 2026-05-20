# @hieu-asia/miniapp-zalo

Zalo Mini App for hieu.asia — Cẩm Nang Cuộc Đời AI.

## Stack

- React 19 + react-router-dom v7 (HashRouter — required by Zalo CDN)
- Vite 6 + `zmp-cli` (Zalo's build wrapper)
- `zmp-sdk` for native APIs (auth, payment, share)
- Shared workspace packages: `@hieu-asia/ui`, `@hieu-asia/types`, `@hieu-asia/api-client`
- Tailwind v4 + same brand preset as web app

## Dev

```bash
# from frontend/ workspace root
pnpm install
pnpm --filter @hieu-asia/miniapp-zalo dev      # Vite preview at :3003
pnpm --filter @hieu-asia/miniapp-zalo types:check
```

Local Vite preview will **not** have working `zmp-sdk` calls — every helper
in `src/lib/zalo-*.ts` falls back to a guest / mock implementation so the
flow still works for dev.

### Env

| Var | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend FastAPI base URL |

## Deploy (manual — Zalo doesn't auto-deploy from git)

1. `pnpm --filter @hieu-asia/miniapp-zalo build` → produces `dist/`
2. Zip `dist/` (the Zalo Mini App Console expects a flat archive)
3. Open <https://mini.zalo.me/> → your app → upload zip
4. Submit for review
5. After approval, publish via console

> Vercel does **not** apply here. The Mini App lives on Zalo's CDN.

## Routes

| Path | File | Spec ref |
|---|---|---|
| `/` | `pages/index.tsx` | Landing (90 §1) |
| `/consent` | `pages/consent.tsx` | Onboarding (90 §2) |
| `/reading/new` | `pages/reading/new.tsx` | Birth data (90 §3) |
| `/reading/:id/upload` | `pages/reading/[id]/upload.tsx` | Palm photo (90 §4) |
| `/reading/:id/survey` | `pages/reading/[id]/survey.tsx` | Survey (90 §5) |
| `/reading/:id/processing` | `pages/reading/[id]/processing.tsx` | Agent progress (90 §6) |
| `/reading/:id/report` | `pages/reading/[id]/report.tsx` | Master report (90 §7) |
| `/reading/:id/mentor` | `pages/reading/[id]/mentor.tsx` | Live mentor chat (90 §8) |
| `/dashboard` | `pages/dashboard.tsx` | History + plan (90 §9) |

## Required setup before publishing

- Register Mini App in <https://mini.zalo.me/> to get an App ID
- Configure `app-config.json` `app.id` if Zalo provisions a fixed ID
- Allowlist backend domain in Zalo Console (Mini Apps block arbitrary fetch URLs)
- Wire Zalo Pay merchant credentials (Phase 2 — currently stubbed in `src/lib/zalo-payment.ts`)
