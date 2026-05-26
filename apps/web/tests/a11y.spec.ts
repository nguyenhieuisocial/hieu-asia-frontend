/**
 * Accessibility (WCAG 2.2 AA) scan via axe-core on Playwright.
 * Wave 60.80 — free quality stack (no SaaS account required).
 *
 * Runs across 8 marketing + auth + checkout pages. Fails the PR
 * only on `serious` + `critical` violations; `minor` + `moderate`
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
];

for (const p of PAGES) {
  test(`a11y: ${p.name} (${p.path})`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: "domcontentloaded" });
    // /signin has long-polling auth retry that never reaches networkidle;
    // 2s settle window is reliable across all 8 pages.
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
