# hieu.asia — Frontend Monorepo

Quality-first user-facing platform cho phân tích tính cách + chiến lược cá nhân (Vietnamese primary).

## Folder map

```
frontend/
├── apps/
│   ├── web/                Next.js 15 — hieu.asia (port 3000)
│   ├── admin/              Next.js 15 — admin.hieu.asia (port 3001)
│   └── miniapp-telegram/   Next.js 15 — miniapp.hieu.asia (port 3002)
├── packages/
│   ├── ui/                 shadcn/ui re-exports + custom (ConsentCheckboxList, InsightCard)
│   ├── types/              TS interfaces mirroring backend Pydantic schemas
│   ├── api-client/         Typed fetch wrapper cho backend FastAPI
│   └── config/             Shared eslint / tsconfig / tailwind preset
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── .npmrc
```

## Stack per app

- **Framework:** Next.js 15 App Router + React 19
- **Style:** Tailwind CSS v4 + shadcn/ui (theme zinc, brand palette áp lên trên)
- **Data:** TanStack Query v5
- **Form:** React Hook Form + Zod
- **Auth:** Auth.js v5 (NextAuth) — providers chưa wire
- **Realtime:** socket.io-client (web only)
- **Animation:** Framer Motion
- **Theme:** next-themes (dark default)
- **Telegram extras** (miniapp): `@twa-dev/sdk`, sync với `Telegram.WebApp.colorScheme`

## Brand palette ([[90 - Frontend Design Spec]])

| Role | Hex | Class alias |
|---|---|---|
| Background đen than | `#0F0F12` | `bg-ink` |
| Background xanh đêm | `#0B1326` | `bg-ink-night` |
| Vàng đồng (accent) | `#B8923D` | `text-gold` / `bg-gold` |
| Tím trầm (accent) | `#3B2754` | `text-purple` / `bg-purple` |
| Xanh ngọc (accent) | `#2D5F5A` | `text-jade` / `bg-jade` |
| Kem ngà (light bg) | `#F2EDE3` | `text-cream` / `bg-cream` |

## Setup

```powershell
# Một lần
corepack enable
corepack prepare pnpm@9.12.0 --activate

# Install
cd C:\Users\Admin\hieu.asia\frontend
pnpm install
```

> **Note:** This monorepo is bootstrapped without running `pnpm install`. Run it before first `dev`.

## Dev commands

```powershell
# All apps cùng lúc (Turborepo)
pnpm dev

# Hoặc từng app
pnpm --filter web dev                # port 3000
pnpm --filter admin dev              # port 3001
pnpm --filter miniapp-telegram dev   # port 3002
```

## Build / lint / test / types

```powershell
pnpm build           # turbo build all
pnpm lint            # turbo lint all
pnpm test            # turbo test all
pnpm types:check     # tsc --noEmit per package
```

## Backend API URL

Mỗi app dùng env var:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Mặc định trỏ về FastAPI local (`backend/api/server.py`). Production sẽ trỏ về `https://api.hieu.asia`.

Copy `.env.example` → `.env.local` trong mỗi app.

## Type sync với backend

`packages/types/src/api.ts` hiện viết tay, mirror `backend/core/schemas.py`.

Phase 2 (Agent D): auto-gen bằng `pydantic2ts` pre-commit hook. Khi đó **không edit file đó tay**.

Xem `packages/types/README.md`.

## Shared packages — import path

```ts
import { Button, InsightCard, ConsentCheckboxList } from '@hieu-asia/ui';
import type { InsightItem, StrategicActionPlan } from '@hieu-asia/types';
import { api, createApiClient } from '@hieu-asia/api-client';
```

## shadcn/ui

Skeleton có Button + Card stubs trong `packages/ui` để code chạy được trước install.

Sau `pnpm install`, init shadcn ở từng app (tuỳ chọn — chỉ khi muốn add primitives ngoài stubs):

```powershell
cd apps/web
pnpm dlx shadcn@latest init
# theme: zinc, base color: zinc, css: src/app/globals.css
pnpm dlx shadcn@latest add button card dialog input form
```

## Liên quan note

- `hieu.asia/82 - Monorepo Structure & Auto-sync.md` — target structure
- `hieu.asia/90 - Frontend Design Spec.md` — 9 screens + style guide
- `backend/core/schemas.py` — source of truth cho types
- `backend/api/server.py` — endpoint surface
