# PostHog Integration — hieu.asia web

Comprehensive PostHog wiring for the Next.js app shell. This document covers
every option, the rationale, and the workflow for adding new flags / surveys
/ exception filters.

## Files

| Path | Role |
|---|---|
| `src/components/PostHogProvider.tsx` | React provider — init + auth identify + manual `$pageview` |
| `src/lib/posthog.ts` | Singleton init, opt-in/out helpers, super-properties |
| `src/lib/identify.ts` | Build full user profile, alias anon→user, attach group analytics |
| `src/lib/analytics.ts` | `track()` fan-out: Plausible + PostHog + Worker KV |
| `src/lib/feature-flags.ts` | Typed flag IDs + `useFeatureFlag()` hook |
| `src/lib/survey.ts` | `useSurvey()` schema-only hook |
| `src/lib/web-vitals.ts` | Forwards LCP/CLS/INP/TTFB/FCP as `$web_vitals` events |

## Environment

```
NEXT_PUBLIC_POSTHOG_KEY   = phc_…    (Project API key)
NEXT_PUBLIC_POSTHOG_HOST  = https://eu.i.posthog.com   (or us.i.posthog.com)
```

When `NEXT_PUBLIC_POSTHOG_KEY` is missing, `getPostHog()` returns `null` and
every helper in `analytics.ts`, `identify.ts`, `feature-flags.ts`, `survey.ts`
silently no-ops. The build still succeeds; the runtime stays green.

## Init config — every option explained

Set in `src/lib/posthog.ts` inside `posthog.init(key, { … })`.

| Option | Value | Why |
|---|---|---|
| `api_host` | env / `https://eu.i.posthog.com` | Data residency. Vietnam traffic still routes through EU for GDPR overlap. |
| `capture_pageview` | `false` | Next.js App Router doesn't full-reload. We fire `$pageview` manually on every `usePathname()` change. |
| `capture_pageleave` | `true` | Drives accurate bounce + time-on-page. |
| `disable_session_recording` | `false` | Recordings on — needed for UX debug & funnel review. |
| `autocapture` | `true` | Auto click/form/change events. Also powers Heatmaps. |
| `enable_heatmaps` | `true` | Explicit opt-in for v1.95+ — toolbar overlay needs this. |
| `capture_exceptions` | `true` | Hooks `window.onerror` + `unhandledrejection`. Pairs with Sentry (which we keep for stack-trace fidelity). |
| `capture_performance` | `true` | Web Vitals + paint metrics (we also fire typed `$web_vitals` events). |
| `enable_recording_console_log` | `false` | Privacy — recordings can leak tokens / PII from `console.log`. |
| `respect_dnt` | `true` | Honour browser Do-Not-Track header. |
| `person_profiles` | `'identified_only'` | GDPR — anonymous visitors stay event-only; profiles created only on `identify()`. |
| `cross_subdomain_cookie` | `true` | Persist distinct_id across `*.hieu.asia` if we add subdomains. |
| `persistence` | `'localStorage+cookie'` | Cookie alone doesn't survive 7-day Safari ITP. LS alone breaks SSR. Both. |
| `session_recording.maskAllInputs` | `false` | We want readable replays. |
| `session_recording.maskTextSelector` | `'.posthog-mask'` | Per-element opt-out — add `className="posthog-mask"` to PII spans. |
| `session_recording.maskInputOptions.password` | `true` | Always mask password fields. |

## Identify flow

`src/lib/identify.ts:identifyUser(supabaseUser)` fires on:

- `supabase.auth.getSession()` resolves with a user (page load after login).
- `onAuthStateChange()` reports `SIGNED_IN`.

What it does:

1. Reads localStorage `hieu.user_id` (anonymous id set pre-signup) and
   `posthog.alias(user.id, anonId)` so PostHog merges browse → identified
   data into one timeline.
2. Calls `posthog.identify(user.id, { email, full_name, signup_date,
   last_login_at, locale, timezone, membership_tier, is_affiliate, … })`.
3. Attaches groups: `membership_tier` (free/standard/premium/lifetime) and
   `persona` (founder/genz/midage/…) for cohort filtering in PostHog.

## Feature flags

Define flags in PostHog dashboard, mirror the key in `FLAGS`:

```ts
// src/lib/feature-flags.ts
export const FLAGS = {
  EXPERT_MODE_DEFAULT_ON: "expert-mode-default-on",
  PRICING_LAUNCH_BANNER: "pricing-launch-banner",
  MENTOR_SKILLS_ROLLOUT: "mentor-skills-rollout",
} as const;
```

Consume:

```tsx
import { useFeatureFlag, FLAGS } from "@/lib/feature-flags";

const showBanner = useFeatureFlag(FLAGS.PRICING_LAUNCH_BANNER, true);
//                                                                ^
//                                          default while PostHog loads /
//                                          when blocked by ad-blocker.
```

For non-React contexts (initializers, event handlers) use the imperative
`readFeatureFlag(FLAGS.…)` — returns `undefined` until flag config loads.

### Currently wired flags

| Flag key | Default | Consumer | Effect |
|---|---|---|---|
| `expert-mode-default-on` | `false` | `useExpertMode()` | New visitors (no LS) start in expert mode when true. |
| `pricing-launch-banner` | `true` | `/pricing` page | Hides the LAUNCH30 banner when false. |
| `mentor-skills-rollout` | `true` | `/reading/[id]/mentor` | Hides quick-prompt skills when false. |

### Adding a new flag

1. PostHog → Feature Flags → New → set key, rollout %, conditions.
2. Add a `const NEW_FLAG = "your-key"` to `FLAGS` with JSDoc.
3. `useFeatureFlag(FLAGS.NEW_FLAG, fallback)` in your component.
4. Append a row to the "Currently wired flags" table above.

## Exception capture

Two layers run in parallel:

1. **Sentry** (`src/app/error.tsx`, `src/app/global-error.tsx`) — captures
   error-boundary errors with full stack traces and source maps.
2. **PostHog** (`capture_exceptions: true`) — auto-captures `window.onerror`
   + `unhandledrejection` for everything outside React boundaries (async
   handlers, timers, fetch). Attached to the session replay so we can watch
   the moment of failure.

No manual wiring needed — both are init-time.

## Surveys

Authored in PostHog dashboard. Consume via `useSurvey(surveyId)`:

```tsx
const { survey, dismiss, sendResponse } = useSurvey("018xx-…");
if (!survey) return null;
// render your own UI, then call sendResponse({ q1: "…" })
```

PostHog also ships an auto-rendered widget — currently disabled (we render
our own). Enable by setting `surveys: { enable: true }` in init.

## Reading recordings

PostHog Cloud → Session Replay → filter by:

- `distinct_id` = Supabase user UUID (for known users).
- `$current_url` contains `/reading/` (for the funnel).
- `membership_tier` group = `premium` (for paying-user UX issues).

Recordings retain 30 days on the free plan, longer on paid.

## Heatmaps

Auto-collected when `autocapture: true` AND `enable_heatmaps: true`. View
in PostHog → Web → Heatmaps. Toolbar overlay works on production when the
PostHog browser extension is installed.

## Privacy / GDPR

- `respect_dnt: true` — DNT browsers never get tracked.
- `person_profiles: 'identified_only'` — anonymous visitors don't create
  profiles, only events.
- Reading-app: `localStorage['hieu.user.preferences'].privacy.analytics_opt_in
  === false` triggers `posthog.opt_out_capturing()` at init. Toggle from the
  Account → Privacy page.
- `.posthog-mask` className on any element redacts text from recordings.

## Verify locally

```bash
cd frontend
pnpm --filter web build   # must pass with and without NEXT_PUBLIC_POSTHOG_KEY
pnpm --filter web dev
```

Open DevTools → Network → filter `posthog` — you should see batched `/e/`
posts on click + navigation, and `/flags/` on load. With key missing, zero
requests fire (silent degrade).
