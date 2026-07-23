/**
 * Accessibility (WCAG 2.2 AA) scan via axe-core on Playwright.
 * Wave 60.80 — free quality stack (no SaaS account required).
 *
 * Runs across marketing + auth + checkout + funnel/tool pages. Fails the
 * run only on `serious` + `critical` violations; `minor` + `moderate`
 * are logged as warnings to keep signal high.
 *
 * Local run: `pnpm --filter web test:a11y`
 * Override base URL: `PLAYWRIGHT_BASE_URL=https://preview.vercel.app pnpm --filter web test:a11y`
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { path: "/", name: "Home" },
  { path: "/pricing", name: "Pricing" },
  { path: "/features", name: "Features" },
  { path: "/about", name: "About" },
  { path: "/methodology", name: "Methodology" },
  { path: "/signin", name: "Sign in" },
  { path: "/checkout/premium", name: "Checkout premium" },
  { path: "/checkout/mentor", name: "Checkout mentor" },
  // Funnel/tool surface — the free-tool + hub + learn pages organic traffic
  // lands on before converting. Uncovered until now; scanned at rest (the
  // animation-freeze below neutralises staggered entrance fades).
  { path: "/cong-cu", name: "Tools hub" },
  { path: "/la-so-tu-vi", name: "Tu Vi tool" },
  { path: "/la-so-bat-tu", name: "Bat Tu tool" },
  { path: "/mbti", name: "MBTI tool" },
  { path: "/enneagram", name: "Enneagram tool" },
  { path: "/disc", name: "DISC tool" },
  { path: "/big-five", name: "Big Five tool" },
  { path: "/sample-report", name: "Sample report" },
  { path: "/learn", name: "Learn hub" },
  { path: "/tu-vi-hom-nay", name: "Daily horoscope" },
];

for (const p of PAGES) {
  test(`a11y: ${p.name} (${p.path})`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: "domcontentloaded" });
    // Stabilise entrance animations for the whole settle window. Reveal
    // sections (e.g. PricingTierV2's staggered fade: 1.5s IntersectionObserver
    // fallback + 0.6s opacity transition) otherwise straddle the 2s settle, so
    // axe composites an element's mid-fade opacity and reports fully-AA text as
    // a transient false-positive contrast failure (flaky 0/8/19 nodes on Home).
    // Zeroing animation/transition duration makes every reveal snap to its
    // settled state instantly, so contrast (WCAG 1.4.3) is measured on the text
    // as read, not mid-transition. Injected before the settle wait so no
    // sampling window can catch a fade in flight. Same technique
    // tests/visual.spec.ts uses for deterministic screenshots.
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `,
    });
    // /signin has long-polling auth retry that never reaches networkidle;
    // 2s settle window is reliable across all pages.
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    const all = results.violations; // all severities (Wave 60.88.B)
    // eslint-disable-next-line no-console
    console.log(
      `[${p.name}] violations:`,
      all
        .map((v) => `${v.impact}: ${v.id} (${v.nodes.length})`)
        .join("; ") || "none",
    );

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    if (blocking.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        `Blocking a11y violations on ${p.path}:`,
        JSON.stringify(blocking, null, 2),
      );
    }

    expect(blocking).toEqual([]);
  });
}
