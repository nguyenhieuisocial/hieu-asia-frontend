# Homepage motion & i18n guardrails

Hard-won conventions for the homepage (and any marketing surface). Breaking these
has caused real regressions before (untranslated Vietnamese leaking through Google
Translate, an invalid `<style>` inside the LCP `<h1>`, motion that ignored the
user's reduced-motion preference). Keep them.

## 1. Translation (Google Translate)

Google Translate only translates **real DOM text nodes** read at load + as the user
scrolls.

- ✅ Render user-facing text as DOM text (plain elements, `ShimmerText`, `CountUp`).
- ❌ Never put user-facing text in `<canvas>` (`fillText`) or swap it in via JS only —
  it cannot be translated. (This is why OracleBrain is HTML+SVG `<text>`, not canvas,
  and why the rotating hero words render all variants stacked in the DOM.)
- The language picker (`components/i18n/GoogleTranslate.tsx`) drives Google via the
  `googtrans` cookie + reload; Google's script loads lazily only after a language is
  chosen (clean default load for VN visitors).
- After any homepage text change, sanity-check translation (load with `googtrans=/vi/en`).

## 2. Reduced motion

Motion is gated **globally**:
- `@media (prefers-reduced-motion: reduce) *` disables all transitions/animations.
- `[data-reduced-motion='true']` (user opt-in from /settings) does the same.

Implications when adding effects:
- Plain Tailwind `transition` / `hover:` / `active:` / `focus:` utilities are
  **automatically safe** — the global rule disables them under reduced-motion. No
  per-element gating needed.
- New `@keyframes`-based animation should be wrapped in
  `@media (prefers-reduced-motion: no-preference) { … }` (see `.fx-shimmer`, `.faq-answer`,
  `rv-*`, `ob-*` in `globals.css`).

## 3. Motion vocabulary (reuse, don't reinvent)

| Tool | What it does | Note |
|------|--------------|------|
| `<RevealOnScroll>` + `rv-up`/`rv-fade`/`rv-draw-*` | fade/rise/draw-in on scroll | child `rv-*` only animates under a `[data-in]` ancestor → the section must be wrapped in `<RevealOnScroll>`. Stagger via inline `style={{ animationDelay }}`. |
| `.fx-shimmer` (`ShimmerText`) | gold light-sweep on text | one shared class + keyframe in `globals.css`. **Do not** inject a per-instance `<style>` (it leaks CSS into the element's `textContent`, invalid inside `<h1>`). |
| `CountUp` | animates a number when scrolled into view | keeps the final value in SSR/DOM (crawler- + translate-safe). |
| `AuroraBackdrop` | slow ambient gradient drift | hero/front-door background only; keep it sparse. |
| `Marquee`, `ScrollProgress` | ticker / scroll bar | — |
| `ob-*`, `faqOpen` | OracleBrain constellation / FAQ open | section-specific. |

## 4. Mobile tap feedback (80% of users are on mobile)

The global press-scale rule only targets `button` and `a[role="button"]`:

```css
button:active, a[role='button']:active, [type='submit']:active { transform: scale(0.97) }
```

Plain `<a>` / `<Link>` **card** links get nothing on tap. When a card or link is a
primary tap target, add `active:scale-[0.98]` (and, if it has a border,
`active:border-primary/40`) so the tap is felt on touch. Hover-only states
(`hover:-translate-y-*`, `hover:shadow-*`) never fire on touch — pair them with an
`active:` equivalent where the feedback matters.

## 5. Above-the-fold / LCP

Do **not** add scroll-reveal (`rv-*`) to above-the-fold or LCP content (e.g. the
`InstantChartHero` `<h1>`): it flashes blank on first paint (mobile) and hurts LCP.
Above-the-fold emphasis = ambient background (`AuroraBackdrop`) + in-place accents
(`ShimmerText`), not entrance animation.
