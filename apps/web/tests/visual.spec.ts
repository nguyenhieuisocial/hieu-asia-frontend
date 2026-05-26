/**
 * Visual regression (VRT) baseline diff via Playwright toHaveScreenshot.
 * Wave 60.80 — free quality stack (no Chromatic account).
 *
 * Baselines stored in `tests/visual.spec.ts-snapshots/` — must be COMMITTED.
 * Update baselines (after intentional UI change):
 *   `pnpm --filter web test:visual:update`
 *
 * Compares per-page full-page screenshots at:
 *   - chromium-desktop (1440x900)
 *   - chromium-mobile (iPhone SE)
 *
 * threshold 0.2 + maxDiffPixels 100 inherited from playwright.config.ts.
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

for (const path of PAGES) {
  test(`visual: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    // /signin has long-polling auth retry that never reaches networkidle;
    // domcontentloaded + 2s settle window is reliable across all 8 pages.
    await page.waitForTimeout(2000);
    // Stabilise animations so diffs are deterministic
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
    await expect(page).toHaveScreenshot(
      `${path.replace(/\//g, "_") || "home"}.png`,
      { fullPage: true },
    );
  });
}
