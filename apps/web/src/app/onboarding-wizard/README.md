# /onboarding-wizard — Wave 58

Mandatory 4-step onboarding the user must complete before their first
reading. Replaces the optional `/account?tab=chart` capture.

## Files

- `page.tsx` — the wizard UI (client component, `useState`-driven).
- `/api/onboarding/complete/route.ts` — POST endpoint that PATCHes
  `hieu_asia.users` via service-role.
- `backend/infra/supabase/migrations/0036_users_onboarding_columns.sql` —
  stub migration adding `onboarding_completed_at`, `chart_data`, `phone`,
  `consent_flags`. **Not applied yet.** Apply via Supabase MCP after the
  wizard has been smoke-tested in preview.

## Steps

| # | Fields |
|---|--------|
| 1 | `full_name` (required), `gender` M/F/NB (required) |
| 2 | `birth_year` 1900-2100 (req), `birth_month` 1-12 (req), `birth_day` 1-31 (req), `birth_hour` 0-23 (opt — checkbox "Tôi không nhớ giờ sinh") |
| 3 | `phone` Vietnam +84 (opt), `sms_anniversary` (default on), `zalo_optin` (default on) |
| 4 | `email_tips` (default on), `meta_retargeting` (default off), `google_retargeting` (default off), `zalo_oa_broadcast` (default on) |

## TODOs — needs founder review before wiring

1. **`/auth/callback` redirect gate.** The callback page currently sends
   every authed user to `/account` (or the `?next=` target). Wave 58
   requires it to instead:

       SELECT onboarding_completed_at FROM hieu_asia.users WHERE id = $userId
       IF NULL → router.replace('/onboarding-wizard?next=' + originalNext)

   Not done in this PR — founder needs to confirm UX (what happens if
   user pastes a deep link to a reading? Persist `next` through the
   wizard. Currently `page.tsx` already honours `?next=` on completion,
   but the redirect from callback needs wiring.)

2. **Apply migration 0036.** The wizard will return a 503 with the
   message `migration 0036 not applied — onboarding columns missing`
   until the SQL stub is executed. Apply via Supabase MCP once the
   preview build looks right.

3. **Backfill existing users.** Anyone who signed up before Wave 58 will
   have `onboarding_completed_at IS NULL` once the migration lands, and
   will be forced through the wizard on next session. Decide whether to
   pre-fill `onboarding_completed_at = NOW()` for legacy users who
   already filled `/account?tab=chart` so they aren't re-asked.

4. **Consent audit trail.** `consent_flags` jsonb is written but not
   versioned. For NĐ 13/2023 compliance the founder may want a separate
   `consent_events` append-only log (timestamp, source, flag, value).

5. **PostHog identify props** — currently the wizard ships these on
   completion: `full_name`, `gender`, `birth_year`, `has_phone`,
   `has_marketing_consent_email`, `_meta`, `_google`, `_zalo`. Confirm
   these match the property names the analytics dashboards expect.
