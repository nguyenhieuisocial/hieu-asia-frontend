# admin.hieu.asia

Operations console for hieu.asia — V1 mock-driven, real backend wiring pending.

## Run

```powershell
pnpm --filter admin dev    # port 3001
pnpm --filter admin analyze    # bundle analyzer
```

## Performance

- **Target Lighthouse desktop: ≥ 90** (admin is desktop-first, internal use)
- Mobile target: ≥ 75 (internal tool, low priority)
- Per-asset budget warns at > 300 kB in production (recharts ships ~150 kB)

## Auth

V1: cookie-based session, allow-list email.
- Set env `ADMIN_EMAILS="you@hieu.asia,ops@hieu.asia"`.
- Login at `/login` with one of those emails (no password — V1 only).
- Middleware redirects unauthenticated traffic to `/login`.

V2 plan: replace `/api/admin/login` with Auth.js EmailProvider magic link or GitHub OAuth restricted by `isAdminEmail()`.

## Required backend endpoints (TODO)

All mock today. See `src/lib/admin-api.ts` for the exact contract used by the UI.

```
GET  /admin/users?search=&page=&page_size=&plan=
GET  /admin/users/{id}

GET  /admin/sessions?status=&search=&from=&to=&page=&page_size=
GET  /admin/sessions/{id}

GET  /admin/tasks?status=&page=&page_size=
POST /admin/tasks/{id}/retry
GET  /admin/queue/depth

GET  /admin/cost/by_day?days=30
GET  /admin/cost/top_spenders?limit=10

GET  /admin/rag/chunks
POST /admin/rag/ingest        body: { source_id, source_title, discipline, chunks[], license_status }
GET  /admin/qdrant/stats

GET  /admin/payments?status=&page=&page_size=
POST /admin/payments/{id}/refund
GET  /admin/coupons
POST /admin/coupons           body: { code, discount_percent, max_redemptions, active, expires_at }
PATCH /admin/coupons/{code}   body: { active }

GET  /admin/feature_flags
PATCH /admin/feature_flags    body: { mentor_chat_enabled?, premium_signup_open?, telegram_login_enabled?, rag_ingestion_lock? }

GET  /admin/kpis              // total_users, readings_today, active_mentor_sessions, weekly_revenue_usd, eval_avg_score
GET  /admin/readings/per_day?days=30
```

All endpoints should require admin auth (e.g. JWT with `role=admin`). Returning JSON envelopes the same shape as the mock types in `src/lib/mock-data.ts`.

## Pages

- `/` overview KPIs + 30-day readings chart
- `/users` — users table, filters, drawer detail
- `/sessions` — reading sessions table + filters
- `/sessions/[id]` — final report + mentor chat history
- `/tasks` — Celery monitor with auto-refresh + retry button
- `/cost` — Langfuse-style cost dashboard (stacked bar by model)
- `/rag` — chunks list + ingest form + Qdrant stats
- `/payments` — Stripe transactions + refund + coupon manager
- `/settings` — feature flags + env display
