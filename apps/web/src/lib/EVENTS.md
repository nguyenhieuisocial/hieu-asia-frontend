# Event Taxonomy

Canonical list of every event the web app fires through `track()` in
`src/lib/analytics.ts`. Schema definitions live in `event-taxonomy.ts` —
this file describes intent, when each event fires, and how to interpret it
in PostHog.

All events fan out to three sinks:

1. **PostHog** — primary funnel + replay + cohort engine
2. **Plausible** — public, lightweight pageview counters
3. **Worker KV** — `/api/analytics/event` → admin funnel store

PostHog also attaches the following **super-properties** to every event
(registered once on init in `posthog.ts`):

| Property | Source |
|---|---|
| `app_version` | hardcoded constant (`v2.3`) |
| `build_env` | `process.env.NODE_ENV` |
| `platform` | `"web"` |
| `locale` | `navigator.language` |
| `timezone` | `Intl.DateTimeFormat().resolvedOptions().timeZone` |
| `screen_resolution` | `screen.width × screen.height` |
| `viewport` | `innerWidth × innerHeight` |
| `pixel_ratio` | `devicePixelRatio` |
| `connection_type` | `navigator.connection?.effectiveType` |
| `prefers_reduced_motion` | matchMedia query |
| `prefers_dark_mode` | matchMedia query |

User-level properties (set via `identify()` after auth, see `identify.ts`):
`email`, `email_verified`, `full_name`, `avatar_url`, `signup_date`,
`last_login_at`, `locale`, `timezone`, `is_affiliate`, `affiliate_tier`,
`membership_tier`.

Group analytics: `membership_tier` (free/standard/premium/lifetime) and
`persona` (founder/genz/midage/…).

---

## Funnel events (legacy, already wired)

| Event | When fires | PostHog interpretation |
|---|---|---|
| `consent_given` | User accepts terms in `<ConsentForm>` | First step of onboarding funnel |
| `palm_uploaded` | After successful image upload | Drop-off here = upload UX problem |
| `survey_completed` | User submits onboarding survey | Drop-off here = survey too long |
| `report_viewed` | First time the report page renders | Activation event |
| `mentor_message_sent` | Any user message in mentor chat | Engagement metric |
| `payment_intent_created` | Checkout opened | Top of payment funnel |
| `payment_completed` | Successful payment | Conversion event |
| `affiliate_link_clicked` | Outbound affiliate click | Affiliate dashboard input |
| `daily_horoscope_subscribed` | Daily push/email opt-in | Retention input |
| `tool_used` | Any utility tool (Hop Tuoi, Lich Van Nien, …) | Engagement breakdown |

## Reading lifecycle

| Event | Props | Notes |
|---|---|---|
| `reading_started` | `method`, `has_birth_data` | Fires when user clicks "Bắt đầu" on a reading method |
| `reading_completed` | `method`, `duration_seconds`, `sections_viewed` | Fires when report page exits (`beforeunload`) or user clicks "Done" |
| `reading_abandoned` | `method`, `last_step` | Pageleave during a reading flow before completion |

## Mentor

| Event | Notes |
|---|---|
| `mentor_chat_session_started` | First message in a new mentor session |
| `mentor_chat_message_sent` | Every user/assistant message — `role` differentiates |
| `mentor_chat_quick_prompt_used` | Click on a quick-prompt chip |

## Commerce

| Event | Notes |
|---|---|
| `pricing_page_viewed` | `/pricing` mount, includes which tier cards rendered |
| `pricing_tier_clicked` | Click on a specific tier card |
| `payment_failed` | Provider returned error or user cancelled |
| `pdf_download_clicked` | Reading PDF export |

## Engagement

| Event | Notes |
|---|---|
| `cta_clicked` | Any landing-page CTA — `cta_id` is stable, `position` is 1-indexed |
| `share_clicked` | Share button — `network` is the destination |
| `error_displayed` | Toast/banner shown to user — `error_message_hash` is a sha-1 of the message so PII isn't leaked |

## Auth

| Event | Notes |
|---|---|
| `signup_started` | `/signin` form submitted for the first time per browser |
| `signup_completed` | Auth callback completes for a brand-new `created_at` (<60s) |
| `signin_started` | Same form submitted again later |
| `signin_completed` | Auth callback completes for a returning user |
| `user_identified` | Fires alongside `identify()` — useful as a join key |

## Experiments

| Event | Notes |
|---|---|
| `feature_flag_evaluated` | Auto-fired by `useFeatureFlag()` once per (key, variant) per session — lets you correlate downstream metrics with the variant the user actually saw |

## Performance

| Event | Notes |
|---|---|
| `$web_vitals` | LCP / CLS / INP / TTFB / FCP — see `web-vitals.ts`. `rating` is "good" / "needs-improvement" / "poor" per Web Vitals thresholds. Cohort users on this to see if perf affects conversion. |

---

## Dashboard setup checklist (PostHog UI)

After deploy, configure in PostHog:

1. **Funnels** — create with the event order above (`reading_started` →
   `consent_given` → `palm_uploaded` → `survey_completed` →
   `report_viewed` → `payment_completed`).
2. **Group types** — Project Settings → add `membership_tier` and
   `persona` so you can break down insights by cohort.
3. **Feature flags** — author flags with the keys used in
   `useFeatureFlag()`. Use multivariate for pricing/copy A/B tests.
4. **Surveys** — author in dashboard, copy survey id, render via
   `useSurvey(id)` in the component.
5. **Insights** — create `$web_vitals` trends by `metric` to monitor LCP
   regression by route.

## Privacy / opt-out

- `localStorage.hieu.user.preferences.privacy.analytics_opt_in === false`
  → `opt_out_capturing()` called on init.
- Toggle in `/settings → Privacy` re-fires `optInPostHog()` /
  `optOutPostHog()` immediately.
- Inputs marked `class="posthog-mask"` are scrubbed in session replay;
  password inputs are always masked.
