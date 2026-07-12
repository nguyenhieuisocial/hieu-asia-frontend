/**
 * Accessibility scan with ALL severities (Wave 60.85 advanced audit).
 *
 * Distinct from tests/a11y.spec.ts which only fails on serious + critical.
 * This variant LOGS minor + moderate too, so the audit doc can list
 * polish targets without breaking CI.
 *
 * Output: each test writes its violations to /tmp/wave-60-85-axe/<slug>.json
 * Aggregate: jq across files in /tmp/wave-60-85-axe/
 */
import { test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, mkdirSync } from "node:fs";

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

const OUT_DIR = "/tmp/wave-60-85-axe";
try {
  mkdirSync(OUT_DIR, { recursive: true });
} catch {
  /* exists */
}

for (const p of PAGES) {
  test(`a11y-full: ${p.name} (${p.path})`, async ({ page }) => {
    await page.goto(p.path, { waitUntil: "domcontentloaded" });
    // Stabilise entrance animations for the whole settle window (see
    // tests/a11y.spec.ts): reveal fades that straddle the settle otherwise make
    // axe composite mid-fade opacity into false-positive contrast failures. Snap
    // durations to 0 so the audit reflects the settled, as-read state. Injected
    // before the settle wait. Matches tests/visual.spec.ts.
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
    await page.waitForTimeout(2000);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();

    const compact = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      sampleTargets: v.nodes.slice(0, 3).map((n) => n.target),
    }));

    const slug = p.path.replace(/\//g, "_") || "home";
    writeFileSync(
      `${OUT_DIR}/${slug}.json`,
      JSON.stringify(
        {
          page: p.path,
          name: p.name,
          totals: {
            all: results.violations.length,
            critical: results.violations.filter((v) => v.impact === "critical")
              .length,
            serious: results.violations.filter((v) => v.impact === "serious")
              .length,
            moderate: results.violations.filter((v) => v.impact === "moderate")
              .length,
            minor: results.violations.filter((v) => v.impact === "minor")
              .length,
          },
          violations: compact,
        },
        null,
        2,
      ),
    );

    // eslint-disable-next-line no-console
    console.log(
      `${p.path}: ${compact.length} violations (critical=${compact.filter((v) => v.impact === "critical").length}, serious=${compact.filter((v) => v.impact === "serious").length}, moderate=${compact.filter((v) => v.impact === "moderate").length}, minor=${compact.filter((v) => v.impact === "minor").length})`,
    );
  });
}
