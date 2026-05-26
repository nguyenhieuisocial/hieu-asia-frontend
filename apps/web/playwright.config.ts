/**
 * Playwright config for apps/web (Wave 60.80).
 *
 * Used for:
 *   - tests/a11y.spec.ts (axe-core WCAG scan)
 *   - tests/visual.spec.ts (toHaveScreenshot VRT)
 *
 * Distinct from sibling e2e/ workspace (which targets multi-app cross-surface flows).
 * This config focuses on apps/web only and runs against production by default.
 */
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: "disabled",
    },
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "https://hieu.asia",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "chromium-mobile",
      use: { ...devices["iPhone SE"] },
    },
  ],
});
