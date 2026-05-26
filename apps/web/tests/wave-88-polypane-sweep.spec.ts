/**
 * Polypane-replacement multi-viewport sweep (Wave 60.88.B).
 *
 * Polypane control via OS automation was blocked by an overlay app
 * (Alcove menubar widget) covering the permission dialog. Falling
 * back to Playwright-driven capture across the same 3 viewports
 * (mobile 324, tablet 500, laptop 1084) for 6 pages.
 *
 * Output: /tmp/wave-88-polypane/<page>-<viewport>.png
 * Run: PLAYWRIGHT_BASE_URL=https://hieu.asia npx playwright test tests/wave-88-polypane-sweep.spec.ts
 */
import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";

const PAGES = [
  { path: "/", slug: "home" },
  { path: "/pricing", slug: "pricing" },
  { path: "/features", slug: "features" },
  { path: "/about", slug: "about" },
  { path: "/methodology", slug: "methodology" },
  { path: "/signin", slug: "signin" },
];

const VIEWPORTS = [
  { name: "mobile-324", viewport: { width: 324, height: 800 } },
  { name: "tablet-500", viewport: { width: 500, height: 900 } },
  { name: "laptop-1084", viewport: { width: 1084, height: 900 } },
];

const OUT_DIR = "/tmp/wave-88-polypane";
try {
  mkdirSync(OUT_DIR, { recursive: true });
} catch {
  /* exists */
}

for (const v of VIEWPORTS) {
  for (const p of PAGES) {
    test(`sweep ${v.name}: ${p.path}`, async ({ page }) => {
      await page.setViewportSize(v.viewport);
      await page.goto(p.path, { waitUntil: "domcontentloaded" });
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
      await page.screenshot({
        path: `${OUT_DIR}/${p.slug}-${v.name}.png`,
        fullPage: true,
      });
    });
  }
}
