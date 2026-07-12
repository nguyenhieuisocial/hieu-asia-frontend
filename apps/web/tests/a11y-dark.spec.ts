/**
 * Dark-theme accessibility (WCAG 2.2 AA) companion to a11y.spec.ts.
 *
 * The main spec scans only the default (light) theme, so class-based `.dark`
 * contrast regressions never surface — e.g. the gold eyebrow-label tokens
 * (`.dark .text-gold/80|85`) that rendered ~4:1 on the charcoal surfaces and
 * failed AA until 2026-07 (PR #880). This spec forces dark the same way a user
 * who picked dark does — next-themes reads `localStorage.theme` before first
 * paint — then scans the dark-reachable surfaces via the same axe-core config.
 *
 * Home (`/`) is intentionally excluded: it is force-light (theme toggle hidden),
 * so a dark scan there is moot and only re-tests light.
 *
 * Animations are frozen before the scan: fade-in cards straddle the settle
 * window and would poison contrast sampling (see the a11y-home flaky-race
 * incident, 2026-07). Same advisory gate as a11y.spec — fails only on
 * `serious` + `critical`.
 *
 * Runs against LIVE URLs via PLAYWRIGHT_BASE_URL (default https://hieu.asia);
 * wired through the scheduled `a11y` workflow, not on pull_request.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { path: "/onboarding", name: "Onboarding" },
  { path: "/pricing", name: "Pricing" },
  { path: "/features", name: "Features" },
  { path: "/about", name: "About" },
  { path: "/methodology", name: "Methodology" },
  { path: "/signin", name: "Sign in" },
  { path: "/checkout/premium", name: "Checkout premium" },
  { path: "/checkout/mentor", name: "Checkout mentor" },
];

// Freeze CSS + JS-driven fade/transition state so axe samples the settled color.
const FREEZE_ANIM =
  "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;scroll-behavior:auto!important}";

for (const p of PAGES) {
  test(`a11y dark: ${p.name} (${p.path})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    // next-themes applies `.dark` from localStorage before first paint.
    await page.addInitScript(() => {
      try {
        localStorage.setItem("theme", "dark");
      } catch {
        /* storage blocked — assertion below will catch a non-dark load */
      }
    });

    await page.goto(p.path, { waitUntil: "domcontentloaded" });
    await page.addStyleTag({ content: FREEZE_ANIM });
    // /signin long-polls auth and never hits networkidle; 2.5s settle is
    // reliable across every page (matches a11y.spec's fixed-wait approach).
    await page.waitForTimeout(2500);

    // Guard: if a page ever force-lights, the scan would be a silent no-op.
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDark, `${p.path} did not enter dark theme`).toBe(true);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    // eslint-disable-next-line no-console
    console.log(
      `[dark ${p.name}] violations:`,
      results.violations
        .map((v) => `${v.impact}: ${v.id} (${v.nodes.length})`)
        .join("; ") || "none",
    );

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    if (blocking.length > 0) {
      // eslint-disable-next-line no-console
      console.log(
        `Blocking dark a11y violations on ${p.path}:`,
        JSON.stringify(blocking, null, 2),
      );
    }

    expect(blocking).toEqual([]);
  });
}
