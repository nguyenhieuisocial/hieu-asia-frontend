# English Locale Architecture (v1: /en homepage) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a real, Google-indexable English homepage at `/en`, plus a browser-language suggestion banner (dismissible, remembered), without touching any of the 1,113 existing indexed Vietnamese URLs or their caching/rendering behavior.

**Architecture:** `/en` is a plain, standalone Next.js route (`app/en/page.tsx`) — NOT part of a `[locale]` dynamic-segment framework. This sidesteps two traps the codebase has already been burned by and documented against: (1) the hreflang-inheritance bug fixed in PR #1027 (shared-layout `alternates.languages` leaking to every child page) — avoided by setting `alternates.languages` only on the two specific pages that have a real counterpart (`/` and `/en`), never on the root layout; (2) the dynamic-rendering cache collapse documented in `i18n/request.ts` (calling `cookies()`/`headers()` in `getRequestConfig` marked 248 routes dynamic and broke CDN caching + social-link unfurls) — avoided entirely because this plan adds **zero** middleware changes and **zero** calls to `cookies()`/`headers()` in the render path. The suggestion banner reads `navigator.language` client-side only. `next-intl`'s existing static `'vi'` resolution in `request.ts` is untouched.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind (existing utility classes), no new dependencies.

## Global Constraints

- `apps/web/src/i18n/request.ts`'s default export MUST stay a static `getRequestConfig` (no `cookies()`/`headers()` calls) — do not "fix" this as part of this plan.
- `apps/web/src/middleware.ts` MUST NOT be modified by this plan — the suggestion banner is 100% client-side.
- No existing route's URL, HTML output byte-for-byte (outside the two files that intentionally change: `app/page.tsx` metadata + `app/layout.tsx` banner mount), or `.next/server/app` static output count may change for any page other than the new `/en`.
- `apps/web/scripts/seo-guard.mjs` must still pass after `pnpm build` (`MIN_PAGES = 1000` floor, `TITLE_MAX = 60`, `DESCRIPTION_MAX = 160`, no duplicate title/description site-wide, canonical graph checks). Read the script's current behavior — do not edit it; the new `/en/index.html` will be picked up automatically by its `.next/server/app` walk.
- Every new/changed file must run `impact()` (GitNexus) before editing existing symbols, and `detect_changes()` before commit, per this repo's `CLAUDE.md`.
- v1 scope is intentionally lean: `/en` homepage covers hero + value prop + pricing + FAQ + closing CTA only. `SiteNav` and `SiteFooter` are reused as-is (Vietnamese labels) for v1 — this is a known, documented limitation, not an oversight. Peripheral/exploratory sections (interactive birth-chart calculator, Oracle graph, sample-report showcase, Mentor demo, social-proof quotes) are explicitly OUT of scope for v1.
- Currency: display VND only (via existing `formatVND`), in English sentence structure. No USD conversion — out of scope per explicit decision (no real USD payment path exists yet).
- Do not touch `apps/web/src/lib/user-preferences.ts` / `components/settings/LanguagePreference.tsx` (dead/orphaned code) — explicitly out of scope.

---

### Task 1: Locale-suggestion helper module

**Files:**
- Create: `apps/web/src/lib/locale-suggestion.ts`

**Interfaces:**
- Produces: `EN_AVAILABLE_PAGES: Record<string, string>` (Vietnamese pathname → English counterpart pathname), `isDismissed(): boolean`, `dismiss(): void`, `prefersNonVietnamese(): boolean`, `getEnglishCounterpart(pathname: string): string | null`.

- [ ] **Step 1: Write the file**

```ts
/**
 * Locale-suggestion helper — v1.
 *
 * Purely client-side (no cookies()/headers() in the render path — see the
 * big warning comment in i18n/request.ts for why that matters). Reads
 * `navigator.language` to decide whether to suggest the English page, and
 * remembers a dismissal in localStorage so we never ask twice.
 */

const STORAGE_KEY = 'hieu.locale-suggestion.dismissed';

/**
 * Vietnamese pathname → English counterpart. Only pages that actually HAVE
 * a real (hand-translated) English version belong here. Add an entry only
 * when the English page ships — an entry pointing at a non-existent page
 * would 404 the suggestion.
 */
export const EN_AVAILABLE_PAGES: Record<string, string> = {
  '/': '/en',
};

/** Returns the English counterpart for a pathname, or null if none exists yet. */
export function getEnglishCounterpart(pathname: string): string | null {
  return EN_AVAILABLE_PAGES[pathname] ?? null;
}

/** Has the visitor already dismissed the suggestion (any page, ever)? */
export function isDismissed(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Remember the dismissal — never ask again on this browser. */
export function dismiss(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // localStorage unavailable (private mode / quota) — fail silently,
    // banner will just show again next visit. Not worth blocking on.
  }
}

/**
 * True when the browser's language setting is NOT Vietnamese. Uses
 * `navigator.language` (the user's actual browser/OS setting — a real
 * language preference, unlike IP which only indicates physical location).
 */
export function prefersNonVietnamese(): boolean {
  if (typeof navigator === 'undefined' || !navigator.language) return false;
  return !navigator.language.toLowerCase().startsWith('vi');
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/lib/locale-suggestion.ts
git commit -m "feat(i18n): add locale-suggestion helper module"
```

---

### Task 2: `SetHtmlLang` — fix `<html lang>` on English pages without touching the root layout

**Files:**
- Create: `apps/web/src/components/i18n/SetHtmlLang.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `SetHtmlLang({ lang }: { lang: string }): null` — a client component with no visible output.

**Why this exists:** `app/layout.tsx` hardcodes `<html lang="vi">` and is the ONLY place `<html>` can be declared in the App Router (nested layouts cannot redeclare it). Reading the real locale there would require `headers()`/`cookies()` in the root layout — the exact anti-pattern `i18n/request.ts` warns against, since the root layout wraps every one of the 1,113 pages. This component sidesteps that entirely: it sets `document.documentElement.lang` client-side, scoped only to the one page that imports it.

- [ ] **Step 1: Write the file**

```tsx
'use client';

import { useEffect } from 'react';

/**
 * Corrects `<html lang>` on pages whose language differs from the root
 * layout's hardcoded `lang="vi"`. Mount this ONCE near the top of any
 * non-Vietnamese page (e.g. `app/en/page.tsx`). Renders nothing.
 *
 * Why client-side: the root layout cannot read per-request locale without
 * calling `headers()`/`cookies()`, which would mark all 1,113 pages dynamic
 * (see the warning comment in `src/i18n/request.ts`). This runs after
 * hydration instead — negligible cost for a single attribute on one page.
 */
export function SetHtmlLang({ lang }: { lang: string }): null {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/i18n/SetHtmlLang.tsx
git commit -m "feat(i18n): add SetHtmlLang client component"
```

---

### Task 3: Hide the Google Translate widget on English pages

**Files:**
- Modify: `apps/web/src/components/i18n/GoogleTranslate.tsx`

**Interfaces:**
- Consumes: `usePathname` from `next/navigation` (new import).
- Produces: unchanged public signature `GoogleTranslate({ className }: { className?: string })`.

Run `impact({target: "GoogleTranslate", direction: "upstream"})` before editing — expected: 1 caller (`SiteNav.tsx`), LOW risk (early-return added, no signature change).

- [ ] **Step 1: Add the pathname guard**

In `apps/web/src/components/i18n/GoogleTranslate.tsx`, add the import at the top (after the existing `lucide-react` import on line 4):

```tsx
import { usePathname } from 'next/navigation';
```

Then, inside `export function GoogleTranslate(...)` (currently starting at line 138), add a guard as the very first lines of the function body, before the existing `React.useState` calls:

```tsx
export function GoogleTranslate({ className = '' }: { className?: string }): React.JSX.Element | null {
  // Offering to "translate" a page that's already in English (or another
  // real, hand-translated locale) is nonsensical and can mistranslate it —
  // hide the widget entirely on those routes. Extend this prefix list as
  // more locale-specific routes ship.
  const pathname = usePathname();
  if (pathname?.startsWith('/en')) return null;

  const [open, setOpen] = React.useState(false);
```

(Note the return type changes from `React.JSX.Element` to `React.JSX.Element | null` in the signature — update that too.)

- [ ] **Step 2: Verify with typecheck**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/i18n/GoogleTranslate.tsx
git commit -m "fix(i18n): hide Google Translate widget on /en routes"
```

---

### Task 4: `LocaleSuggestionBanner` component

**Files:**
- Create: `apps/web/src/components/i18n/LocaleSuggestionBanner.tsx`

**Interfaces:**
- Consumes: `getEnglishCounterpart`, `isDismissed`, `dismiss`, `prefersNonVietnamese` from `@/lib/locale-suggestion` (Task 1); `usePathname` from `next/navigation`.
- Produces: `LocaleSuggestionBanner(): React.ReactElement | null`, mounted globally in `app/layout.tsx` (Task 5).

Styling mirrors `ConsentBanner`'s positioning conventions (fixed bottom, rounded card, gold accent) but anchored top-right instead of bottom-left so it never collides with `ConsentBanner` or `StickyMobileCta` if all three happen to be visible at once.

- [ ] **Step 1: Write the file**

```tsx
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  dismiss,
  getEnglishCounterpart,
  isDismissed,
  prefersNonVietnamese,
} from '@/lib/locale-suggestion';

/**
 * "View in English?" suggestion banner — v1.
 *
 * Shows only when ALL of these hold:
 *   1. The current page has a real English counterpart (EN_AVAILABLE_PAGES).
 *   2. The browser's language setting isn't Vietnamese (navigator.language —
 *      the user's actual preference, not IP/location).
 *   3. The visitor hasn't dismissed it before (localStorage, remembered
 *      forever — "nhớ luôn, không hỏi lại").
 *
 * A SUGGESTION, never a forced redirect: Google explicitly discourages
 * auto-redirecting by IP/geo because crawlers (which request from a single
 * location) would then never see the other-language content, and it wrongly
 * assumes location implies language.
 */
export function LocaleSuggestionBanner(): React.ReactElement | null {
  const pathname = usePathname();
  const [show, setShow] = React.useState(false);
  const target = pathname ? getEnglishCounterpart(pathname) : null;

  React.useEffect(() => {
    if (!target) return;
    if (isDismissed()) return;
    if (!prefersNonVietnamese()) return;
    setShow(true);
  }, [target]);

  if (!show || !target) return null;

  const close = () => {
    dismiss();
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Language suggestion"
      className="fixed right-4 top-20 z-50 w-[min(320px,calc(100vw-2rem))] rounded-lg border border-gold/30 bg-card/95 p-4 text-sm text-foreground shadow-2xl backdrop-blur"
    >
      <p className="text-foreground/90">This page is also available in English.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={target}
          className="rounded-md bg-gold px-3 py-1.5 text-xs font-semibold text-ink hover:bg-gold/90"
          onClick={dismiss}
        >
          View in English
        </a>
        <button
          type="button"
          onClick={close}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-card"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/components/i18n/LocaleSuggestionBanner.tsx
git commit -m "feat(i18n): add LocaleSuggestionBanner component"
```

---

### Task 5: Mount the banner in the root layout

**Files:**
- Modify: `apps/web/src/app/layout.tsx`

Run `impact({target: "RootLayout", direction: "upstream"})` before editing — expected CRITICAL/HIGH risk flag simply because every page depends on the root layout; this is an ADDITIVE-only change (one new sibling component, same pattern as the existing `<ConsentBanner />` two lines above it) so the actual behavioral blast radius is zero for existing components.

- [ ] **Step 1: Import the component**

In `apps/web/src/app/layout.tsx`, add this import after the existing `import { ConsentBanner } from '@/components/cmp/ConsentBanner';` (line 21):

```tsx
import { LocaleSuggestionBanner } from '@/components/i18n/LocaleSuggestionBanner';
```

- [ ] **Step 2: Mount it next to `<ConsentBanner />`**

Find this block (around line 350-353):

```tsx
                <ConsentBanner />
```

Change to:

```tsx
                <ConsentBanner />
                {/* Wave i18n-v1 — suggests the /en counterpart when the
                    visitor's browser language isn't Vietnamese and the
                    current page has a real English version. Client-only,
                    dismissible, remembered — never forces a redirect. */}
                <LocaleSuggestionBanner />
```

- [ ] **Step 3: Verify with typecheck**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/layout.tsx
git commit -m "feat(i18n): mount LocaleSuggestionBanner in root layout"
```

---

### Task 6: Add `en` + `x-default` to the Vietnamese homepage's hreflang

**Files:**
- Modify: `apps/web/src/app/page.tsx`

**Learning from PR #1027 (do not repeat):** this change is scoped to `app/page.tsx`'s OWN `metadata.alternates` export only — never touch the root layout's metadata for this.

- [ ] **Step 1: Extend `alternates`**

Find (around line 63-68):

```tsx
  // Wave 65.01 — languages chuyển từ root layout về đây: chỉ trang chủ mang
  // hreflang vi-VN tự trỏ mình (layout cũ làm MỌI trang con hreflang về '/').
  alternates: {
    canonical: 'https://hieu.asia/',
    languages: { 'vi-VN': 'https://hieu.asia/' },
  },
```

Replace with:

```tsx
  // Wave 65.01 — languages chuyển từ root layout về đây: chỉ trang chủ mang
  // hreflang vi-VN tự trỏ mình (layout cũ làm MỌI trang con hreflang về '/').
  // Wave i18n-v1 — added `en` now that a real (hand-translated) /en homepage
  // exists. Scoped to THIS page's own metadata only — see PR #1027 for why a
  // shared-layout `languages` block is wrong (it leaked to every child page).
  alternates: {
    canonical: 'https://hieu.asia/',
    languages: {
      'vi-VN': 'https://hieu.asia/',
      en: 'https://hieu.asia/en',
      'x-default': 'https://hieu.asia/',
    },
  },
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/page.tsx
git commit -m "feat(seo): add en + x-default hreflang to homepage"
```

---

### Task 7: The English homepage

**Files:**
- Create: `apps/web/src/app/en/page.tsx`

**Interfaces:**
- Consumes: `PRICING`, `formatVND` from `@/lib/pricing`; `SiteNav` from `@/components/home/SiteNav`; `SiteFooter` from `@/components/home/SiteFooter`; `FaqAccordion`, `type FaqItem` from `@/components/home/FaqAccordion`; `StickyMobileCta` from `@/components/marketing/StickyMobileCta`; `JsonLd` from `@/components/seo/JsonLd`; `faqPage` from `@/lib/seo/jsonld`; `SetHtmlLang` from `@/components/i18n/SetHtmlLang` (Task 2).

- [ ] **Step 1: Write the file**

```tsx
import type { Metadata } from 'next';
import { PRICING, formatVND } from '@/lib/pricing';
import { SiteNav } from '@/components/home/SiteNav';
import { SiteFooter } from '@/components/home/SiteFooter';
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion';
import { StickyMobileCta } from '@/components/marketing/StickyMobileCta';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPage } from '@/lib/seo/jsonld';
import { SetHtmlLang } from '@/components/i18n/SetHtmlLang';

// Wave i18n-v1 — first real (hand-translated) English page. Scope is
// intentionally lean: hero + value prop + pricing + FAQ + closing CTA only.
// SiteNav/SiteFooter are reused as-is (Vietnamese labels) for v1 — a known,
// documented limitation, not an oversight (see the plan doc for why).
export const metadata: Metadata = {
  title: { absolute: 'Vietnamese Astrology & Four Pillars AI — hieu.asia' },
  description:
    'Tử Vi and Bát Tự charts calculated from your real birth date and time — cross-checked with MBTI and Big Five. No vague fortune-telling, no scare tactics.',
  alternates: {
    canonical: 'https://hieu.asia/en',
    languages: {
      'vi-VN': 'https://hieu.asia/',
      en: 'https://hieu.asia/en',
      'x-default': 'https://hieu.asia/',
    },
  },
  openGraph: {
    title: 'hieu.asia — Understand yourself. Decide for yourself.',
    description:
      'An AI-guided companion built on East Asian astrology and modern psychology — now in English.',
    url: 'https://hieu.asia/en',
    siteName: 'hieu.asia',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'hieu.asia — an AI companion for understanding yourself and making decisions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hieu.asia — Understand yourself. Decide for yourself.',
    description: 'Tử Vi · Bát Tự · MBTI, read by AI.',
    images: [{ url: '/og-image.jpg', alt: 'hieu.asia' }],
  },
};

// Matches the exact pattern `app/page.tsx`'s `HomeFaqEntry` uses: every item
// carries BOTH a display version (`a`, JSX, can hold `<strong>` etc.) and a
// plain-text crawler version (`aCrawler`, ≤200 chars, no markup) — the two
// must be kept in sync by hand when either changes. This avoids extracting
// text back out of JSX at runtime, which breaks for any answer that mixes
// plain strings with elements like `<strong>` (React children become an
// array, not a string, in that case).
interface EnFaqEntry extends FaqItem {
  aCrawler: string;
}

const EN_FAQ: readonly EnFaqEntry[] = [
  {
    q: 'Does hieu.asia predict the future?',
    aCrawler:
      "No. We don't claim to predict the future. The goal is to help you see your behavioral patterns and innate tendencies clearly, so you can make better decisions yourself.",
    a: (
      <p>
        No. We don&apos;t claim to predict the future. The goal is to help
        you see your behavioral patterns and innate tendencies clearly, so
        you can make better decisions yourself.
      </p>
    ),
  },
  {
    q: "I don't know my exact birth time — can I still use this?",
    aCrawler:
      'Yes. You can start with MBTI, Big Five, Numerology, and Face Reading without a birth time, and update your chart later once you find more accurate information.',
    a: (
      <p>
        Yes. You can start with MBTI, Big Five, Numerology, and Face
        Reading without a birth time, and update your chart later once you
        find more accurate information.
      </p>
    ),
  },
  {
    q: 'How is my personal data protected?',
    aCrawler:
      "Data is transmitted over encrypted TLS. Reports and exported files are stored on infrastructure with encryption at rest (Cloudflare R2 / Supabase Storage). We don't sell your data or use it to train models. You can delete your account anytime from your Account page.",
    a: (
      <p>
        Data is transmitted over encrypted TLS. Reports and exported files
        are stored on infrastructure with encryption at rest (Cloudflare R2
        / Supabase Storage). We don&apos;t sell your data or use it to
        train models. You can delete your account anytime from your
        Account page.
      </p>
    ),
  },
  {
    q: 'How much does it cost? Is there a free plan?',
    aCrawler: `Standard is free and includes the intake survey plus basic lookup tools. Premium ${formatVND(PRICING.premium.vnd)} one-time (1 full chart + PDF + 3 Mentor questions). Mentor ${formatVND(PRICING.monthly.vnd)}/month or ${formatVND(PRICING.yearly.vnd)}/year (30 Mentor questions/day + yearly-cycle readings). Lifetime ${formatVND(PRICING.lifetime.vnd)} one-time.`,
    a: (
      <p>
        <strong>Standard is free</strong> — the intake survey plus basic
        lookup tools. <strong>Premium {formatVND(PRICING.premium.vnd)} one-time</strong> (1
        full chart + PDF + 3 Mentor questions).{' '}
        <strong>Mentor {formatVND(PRICING.monthly.vnd)}/month</strong> or{' '}
        <strong>{formatVND(PRICING.yearly.vnd)}/year</strong> (30 Mentor
        questions/day + yearly-cycle readings).{' '}
        <strong>Lifetime {formatVND(PRICING.lifetime.vnd)} one-time</strong>.
      </p>
    ),
  },
  {
    q: 'Can I cancel anytime?',
    aCrawler:
      "Yes. Cancel from your Account page — your plan stays active until the end of the paid period, no auto-renewal. Within 24 hours of purchase, if your report hasn't been generated yet, you get a full refund, no questions asked.",
    a: (
      <p>
        Yes. Cancel from your Account page — your plan stays active until
        the end of the paid period, no auto-renewal. Within 24 hours of
        purchase, if your report hasn&apos;t been generated yet, you get a
        full refund, no questions asked.
      </p>
    ),
  },
  {
    q: 'How is hieu.asia different from other fortune-telling apps?',
    aCrawler:
      "Three things: Tử Vi and Bát Tự are calculated using the Northern-school method with 114 stars, not pulled from a lookup table; the AI Mentor holds a real, contextual conversation, not a scripted chatbot; the tone stays calm and non-deterministic — you're always the one who decides.",
    a: (
      <p>
        Three things: (1) Tử Vi and Bát Tự are calculated using the
        Northern-school method with 114 stars — not pulled from a lookup
        table; (2) the AI Mentor holds a real, contextual conversation, not
        a scripted chatbot; (3) the tone stays calm and non-deterministic —
        you&apos;re always the one who decides.
      </p>
    ),
  },
];

const FAQ_JSONLD = {
  ...faqPage(EN_FAQ.map((e) => ({ q: e.q, a: e.aCrawler }))),
  inLanguage: 'en',
};

export default function EnglishLandingPage() {
  return (
    <>
      <SetHtmlLang lang="en" />
      <JsonLd data={FAQ_JSONLD} />
      <SiteNav />
      <main id="main-content" className="min-h-screen bg-background text-foreground pt-16">
        {/* Hero — static, no interactive calculator (v1 scope cut; the VN
            homepage's InstantChartHero widget is out of scope for now). */}
        <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-24">
          <p className="font-mono text-editorial-mono uppercase tracking-[0.12em] text-primary/90">
            Real charts · no fortune-telling
          </p>
          <h1 className="mt-4 text-balance font-editorial-display text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-5xl">
            Understand yourself through <em className="italic text-primary">real charts</em> — not vague predictions.
          </h1>
          <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tử Vi (Vietnamese astrology) and Bát Tự (Four Pillars) calculated
            from your actual birth date and time — cross-checked against
            modern psychology (MBTI, Big Five). No scare tactics, no ritual
            sales.
          </p>
          <a
            href="/onboarding"
            className="mt-8 inline-flex items-center justify-center rounded-[2px] bg-[hsl(var(--primary-cta))] px-8 py-3 font-editorial-display text-base font-medium text-primary-foreground transition-all duration-300 hover:brightness-110"
          >
            Get my free chart →
          </a>
          <p className="mt-3 font-mono text-editorial-mono uppercase tracking-[0.12em] text-muted-foreground">
            No card required · takes about 30 seconds
          </p>
        </section>

        {/* Value prop — condensed version of the VN homepage's Methodology
            section (full component out of scope for v1). */}
        <section className="border-y border-border bg-muted/30 py-12">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
              hieu.asia combines four lenses — Vietnamese astrology (Tử Vi),
              Chinese Four Pillars (Bát Tự), and modern psychology (MBTI,
              Big Five) — into one picture, read by an AI Mentor you can
              actually talk to. Every calculation runs from your real birth
              data, not a lookup table.
            </p>
          </div>
        </section>

        {/* Pricing — plain JSX, not the shared PricingTierV2 component
            (that component has Vietnamese strings hard-coded into its JSX,
            not exposed as props — see plan doc Task 7 context). Same VND
            prices as the Vietnamese homepage (single source of truth:
            lib/pricing.ts), English sentence structure around them. */}
        <section id="pricing" className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center font-editorial-display text-2xl font-normal text-foreground sm:text-3xl">
            Go as deep as you want
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/40 p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">Free</h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">{formatVND(PRICING.standard.vnd)}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Intake survey and basic lookup tools — no card needed.
              </p>
              <a
                href="/onboarding"
                className="mt-4 inline-block rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card"
              >
                Start free
              </a>
            </div>
            <div className="rounded-2xl border border-gold/40 bg-card/60 p-6 ring-1 ring-gold/20">
              <h3 className="font-heading text-lg font-semibold text-foreground">Premium</h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatVND(PRICING.premium.vnd)} <span className="text-sm font-normal text-muted-foreground">one-time</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                One full chart + PDF + 3 Mentor questions.
              </p>
              <a
                href="/onboarding"
                className="mt-4 inline-block rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold/90"
              >
                Unlock 1 chart
              </a>
            </div>
            <div className="rounded-2xl border border-border bg-card/40 p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">Mentor</h3>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatVND(PRICING.monthly.vnd)} <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                30 Mentor questions/day, plus yearly-cycle readings.
              </p>
              <a
                href="/onboarding"
                className="mt-4 inline-block rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card"
              >
                Start with Mentor
              </a>
            </div>
          </div>
          <p className="mt-6 text-center text-xs uppercase tracking-[0.12em] text-muted-foreground">
            Full refund within 24h if your report hasn&apos;t been generated yet · 14-day guarantee
          </p>
        </section>

        <FaqAccordion
          items={EN_FAQ}
          id="faq"
          eyebrow="Frequently asked"
          title="Everything you'd want to ask first"
        />

        <div className="mx-auto flex max-w-marketing-tight flex-col items-center gap-3 px-6 py-10 text-center sm:py-12">
          <p className="font-editorial-display text-2xl leading-snug text-foreground sm:text-3xl">
            Ready? Your chart is <em className="italic text-primary">calculated in 30 seconds</em>.
          </p>
          <a
            href="/onboarding"
            className="inline-flex items-center justify-center rounded-[2px] bg-[hsl(var(--primary-cta))] px-8 py-3 font-editorial-display text-base font-medium text-primary-foreground transition-all duration-300 hover:brightness-110"
          >
            Get my free chart →
          </a>
          <p className="font-mono text-editorial-mono uppercase tracking-[0.12em] text-muted-foreground">
            No card required · your chart is yours to keep
          </p>
        </div>
      </main>
      <SiteFooter />
      <StickyMobileCta trackId="home-en" label="Get my chart" />
    </>
  );
}
```

- [ ] **Step 2: Verify with typecheck**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/en/page.tsx
git commit -m "feat(i18n): add English homepage at /en"
```

---

### Task 8: Sitemap — add the `/en` entry with bidirectional `alternates`

**Files:**
- Modify: `apps/web/src/app/sitemap.ts`

**Interfaces:**
- Consumes: existing `BASE_URL` constant (line 35), existing `now` variable used by every entry.

- [ ] **Step 1: Add `alternates` to the existing `/` entry**

Find (line 141):

```ts
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
```

Replace with:

```ts
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: { vi: `${BASE_URL}/`, en: `${BASE_URL}/en` } },
    },
    {
      url: `${BASE_URL}/en`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: { vi: `${BASE_URL}/`, en: `${BASE_URL}/en` } },
    },
```

- [ ] **Step 2: Verify with typecheck**

Run: `cd apps/web && pnpm exec tsc --noEmit`
Expected: no errors (`MetadataRoute.Sitemap` entries support an optional `alternates.languages` field natively).

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/sitemap.ts
git commit -m "feat(seo): add /en to sitemap with bidirectional hreflang alternates"
```

---

### Task 9: Full verification sweep

**Files:** none (verification only).

- [ ] **Step 1: GitNexus impact check on every edited symbol**

Run for each of: `RootLayout` (app/layout.tsx), `GoogleTranslate`, `LandingPage` (app/page.tsx). Confirm no HIGH/CRITICAL risk beyond the expected "many pages depend on root layout" (additive-only, already justified in Task 5).

- [ ] **Step 2: Typecheck + lint + build**

Run: `cd apps/web && pnpm exec tsc --noEmit && pnpm lint && pnpm build`
Expected: all three pass clean. Build output must include `.next/server/app/en.html` (or equivalent) as a NEW static file — confirm with:

```bash
ls apps/web/.next/server/app/en*
```

Expected: file exists.

- [ ] **Step 3: Run the SEO guard**

Run: `cd apps/web && node scripts/seo-guard.mjs`
Expected: exits 0. Total page count should read 1,114 or 1,115 (was 1,113 — `+1` for `/en`, possibly `+1` more if the guard also separately counts a redirect artifact). If it flags `duplicate-title`/`duplicate-description` between `/` and `/en`, that means the English title/description in Task 7 wasn't actually distinct — fix the copy, don't suppress the check.

- [ ] **Step 4: `detect_changes()` before commit**

Run GitNexus `detect_changes({scope: "compare", base_ref: "main"})`. Confirm the affected symbol/process list matches exactly the 8 files touched in Tasks 1-8 — no surprise blast radius.

- [ ] **Step 5: Manual live verification (after merge) via the real Cent Browser session**

1. Navigate to `https://hieu.asia/` with the browser's language NOT set to Vietnamese (or override `navigator.language` via devtools) — confirm the suggestion banner appears top-right, links to `/en`, and dismissing it persists across a reload.
2. Navigate to `https://hieu.asia/en` directly — confirm: `<html lang="en">` (inspect via devtools, not view-source — it's set client-side), no Google Translate widget icon in the nav, pricing shows the same VND amounts as `/`, FAQ accordion opens/closes, all CTAs point to `/onboarding`.
3. View page source (not rendered DOM) on both `/` and `/en` — confirm each has TWO `<link rel="alternate" hreflang="...">` tags pointing at each other plus one `x-default`, and that `/pricing`, `/learn/*`, or any other Vietnamese page does NOT have a `languages` block (regression check for the PR #1027 bug class).
4. Fetch `https://hieu.asia/sitemap.xml` and confirm both `https://hieu.asia/` and `https://hieu.asia/en` appear with `<xhtml:link>` alternate entries.

- [ ] **Step 6: Update the vault journal**

Append a dated section to `archive/94-historical-waves-2026-08.md` documenting: the architecture decision (standalone `/en` route, not `[locale]` framework — and why), the two prior bugs this deliberately avoids repeating, the v1 scope cut (which sections were left untranslated and why), and the follow-up queue (Google Translate phase-out per-page as more English pages ship, more pages translated by traffic priority, the orphaned `LanguagePreference` UI left untouched).
