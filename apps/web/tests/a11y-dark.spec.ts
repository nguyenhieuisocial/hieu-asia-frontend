/**
 * Dark-theme accessibility (WCAG 2.2 AA) companion to a11y.spec.ts.
 * DISCOVERY SWEEP (temporary broad list) — token-level dark contrast audit.
 * Desktop-only to keep the broad sweep within the scheduled run budget.
 */
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { path: "/onboarding", name: "onboarding" },
  { path: "/pricing", name: "pricing" },
  { path: "/features", name: "features" },
  { path: "/about", name: "about" },
  { path: "/methodology", name: "methodology" },
  { path: "/signin", name: "signin" },
  { path: "/checkout/premium", name: "checkout premium" },
  { path: "/checkout/mentor", name: "checkout mentor" },
  { path: "/methodology/ai-safety", name: "methodology ai safety" },
  { path: "/methodology/model-card", name: "methodology model card" },
  { path: "/methodology/algorithm-changelog", name: "methodology algorithm changelog" },
  { path: "/methodology/bat-tu", name: "methodology bat tu" },
  { path: "/methodology/tu-vi", name: "methodology tu vi" },
  { path: "/learn", name: "learn" },
  { path: "/learn/bat-tu", name: "learn bat tu" },
  { path: "/learn/mbti", name: "learn mbti" },
  { path: "/learn/tu-vi", name: "learn tu vi" },
  { path: "/learn/tarot", name: "learn tarot" },
  { path: "/learn/kinh-dich", name: "learn kinh dich" },
  { path: "/learn/enneagram", name: "learn enneagram" },
  { path: "/learn/disc", name: "learn disc" },
  { path: "/learn/chiem-tinh", name: "learn chiem tinh" },
  { path: "/learn/than-so-hoc", name: "learn than so hoc" },
  { path: "/learn/phong-thuy", name: "learn phong thuy" },
  { path: "/learn/big-five", name: "learn big five" },
  { path: "/learn/con-giap", name: "learn con giap" },
  { path: "/learn/sao-han", name: "learn sao han" },
  { path: "/learn/mbti/intj", name: "learn mbti intj" },
  { path: "/learn/enneagram/1", name: "learn enneagram 1" },
  { path: "/learn/disc/d", name: "learn disc d" },
  { path: "/learn/con-giap/ty", name: "learn con giap ty" },
  { path: "/learn/big-five/openness", name: "learn big five openness" },
  { path: "/learn/tu-vi/cung-menh", name: "learn tu vi cung menh" },
  { path: "/bat-tu", name: "bat tu" },
  { path: "/la-so-tu-vi", name: "la so tu vi" },
  { path: "/la-so-bat-tu", name: "la so bat tu" },
  { path: "/mbti", name: "mbti" },
  { path: "/disc", name: "disc" },
  { path: "/enneagram", name: "enneagram" },
  { path: "/big-five", name: "big five" },
  { path: "/career-fit", name: "career fit" },
  { path: "/compatibility", name: "compatibility" },
  { path: "/tarot", name: "tarot" },
  { path: "/gieo-que", name: "gieo que" },
  { path: "/can-xuong", name: "can xuong" },
  { path: "/than-so-hoc", name: "than so hoc" },
  { path: "/xem-tuong", name: "xem tuong" },
  { path: "/kim-lau", name: "kim lau" },
  { path: "/ban-do-sao", name: "ban do sao" },
  { path: "/ban-menh", name: "ban menh" },
  { path: "/dat-ten-ngu-hanh", name: "dat ten ngu hanh" },
  { path: "/hop-tuoi", name: "hop tuoi" },
  { path: "/cung-hoang-dao", name: "cung hoang dao" },
  { path: "/tu-vi-nghe-nghiep", name: "tu vi nghe nghiep" },
  { path: "/tu-vi-tai-chinh", name: "tu vi tai chinh" },
  { path: "/tu-vi-tinh-yeu", name: "tu vi tinh yeu" },
  { path: "/dai-van-hien-tai", name: "dai van hien tai" },
  { path: "/annual-planning", name: "annual planning" },
  { path: "/weekly-review", name: "weekly review" },
  { path: "/xem-hop-nhom", name: "xem hop nhom" },
  { path: "/decision-simulator", name: "decision simulator" },
  { path: "/lo-trinh", name: "lo trinh" },
  { path: "/cong-cu", name: "cong cu" },
  { path: "/cam-nang", name: "cam nang" },
  { path: "/bang-chung", name: "bang chung" },
  { path: "/hoi-dap", name: "hoi dap" },
  { path: "/lich-van-nien", name: "lich van nien" },
  { path: "/changelog", name: "changelog" },
  { path: "/brand", name: "brand" },
  { path: "/cung-hoang-dao/bach-duong", name: "cung hoang dao bach duong" },
  { path: "/tu-vi-2026/ty", name: "tu vi 2026 ty" },
  { path: "/tu-vi-2027/ty", name: "tu vi 2027 ty" },
  { path: "/tu-vi-hom-nay/ty", name: "tu vi hom nay ty" },
  { path: "/sao-han/ty", name: "sao han ty" },
  { path: "/xem-tuoi-cuoi/sinh-nam-1990", name: "xem tuoi cuoi sinh nam 1990" },
  { path: "/huong-nha/tuoi-1965", name: "huong nha tuoi 1965" },
  { path: "/khai-truong/sinh-nam-1970", name: "khai truong sinh nam 1970" },
  { path: "/cam-nang/ngu-hanh-tuong-sinh-tuong-khac-la-gi", name: "cam nang ngu hanh tuong sinh tuong khac la gi" },
  { path: "/gieo-que/y-nghia/thuan-can", name: "gieo que y nghia thuan can" },
  { path: "/than-so-hoc/y-nghia/so-1", name: "than so hoc y nghia so 1" },
  { path: "/tarot/y-nghia/the-fool", name: "tarot y nghia the fool" },
  { path: "/ban-menh/1950", name: "ban menh 1950" },
  { path: "/hop-tuoi/tuoi/ty-ty", name: "hop tuoi tuoi ty ty" },
  { path: "/xem-ngay/cuoi-hoi", name: "xem ngay cuoi hoi" },
];

const FREEZE_ANIM =
  "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;scroll-behavior:auto!important}";

for (const p of PAGES) {
  test(`a11y dark: ${p.name} (${p.path})`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.includes("mobile"), "desktop-only sweep");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      try { localStorage.setItem("theme", "dark"); } catch { /* noop */ }
    });
    await page.goto(p.path, { waitUntil: "domcontentloaded" });
    await page.addStyleTag({ content: FREEZE_ANIM });
    await page.waitForTimeout(2500);
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
      results.violations.map((v) => `${v.impact}: ${v.id} (${v.nodes.length})`).join("; ") || "none",
    );
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    if (blocking.length > 0) {
      // eslint-disable-next-line no-console
      console.log(`Blocking dark a11y violations on ${p.path}:`, JSON.stringify(blocking, null, 2));
    }
    expect(blocking).toEqual([]);
  });
}
