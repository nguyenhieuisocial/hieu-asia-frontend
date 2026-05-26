/**
 * Extreme viewport sanity check (Wave 60.85).
 *
 * Captures full-page screenshots at 320×653 (Galaxy Fold inner)
 * and 2560×1440 (4K) for the 8 marketing/auth/checkout pages
 * covered by Wave 60.78/60.80 audits.
 *
 * Output: tests/visual.spec.ts-snapshots/<file>.png — first run
 * is a baseline; subsequent runs diff against it.
 *
 * Run: `pnpm --filter web exec playwright test tests/extreme-viewports.spec.ts --update-snapshots`
 */
import { test, expect } from "@playwright/test";

const PAGES = [
  "/",
  "/pricing",
  "/features",
  "/about",
  "/methodology",
  "/signin",
  "/checkout/premium",
  "/checkout/mentor",
];

const EXTREME = [
  { name: "galaxy-fold-320", viewport: { width: 320, height: 653 } },
  { name: "4k-2560", viewport: { width: 2560, height: 1440 } },
];

for (const v of EXTREME) {
  for (const path of PAGES) {
    test(`extreme ${v.name}: ${path}`, async ({ page }) => {
      await page.setViewportSize(v.viewport);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2000);
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
      const slug = path.replace(/\//g, "_") || "home";
      await expect(page).toHaveScreenshot(`extreme-${v.name}-${slug}.png`, {
        fullPage: true,
      });
    });
  }
}
