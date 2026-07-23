/**
 * Ad-hoc axe runner cho một danh sách trang, chạy với dev server cục bộ.
 * Dùng để KIỂM CHỨNG các bản vá trợ năng trước khi commit — không nằm trong CI.
 *   node scripts/a11y-local-check.mjs http://localhost:3111 /hoi-dap /xem-tuong
 * Mặc định chạy chế độ TỐI; đặt A11Y_THEME=light để soi chế độ sáng.
 */
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const [base, ...paths] = process.argv.slice(2);
if (!base || paths.length === 0) {
  console.error('usage: node scripts/a11y-local-check.mjs <baseUrl> <path...>');
  process.exit(1);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const theme = process.env.A11Y_THEME === 'light' ? 'light' : 'dark';
await ctx.addInitScript((t) => {
  try {
    localStorage.setItem('theme', t);
  } catch {
    /* noop */
  }
}, theme);
const page = await ctx.newPage();

for (const p of paths) {
  try {
    await page.goto(base + p, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForTimeout(3500);
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains('dark'),
    );
    if ((theme === 'dark') !== isDark) {
      console.log(`  !! ${p}: chế độ màu không khớp (mong ${theme})`);
    }
    const res = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const blocking = res.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    console.log(
      `\n=== ${p} (dark=${isDark}) → ${blocking.length ? '' : 'none'}` +
        blocking.map((v) => `${v.id}(${v.nodes.length})`).join(' '),
    );
    for (const v of blocking) {
      for (const n of v.nodes.slice(0, 6)) {
        console.log(`  [${v.id}] ${n.target.join(' ')}`);
        console.log(`      ${(n.failureSummary || '').split('\n').join(' | ').slice(0, 300)}`);
      }
    }
  } catch (e) {
    console.log(`\n=== ${p} ERROR ${e.message.split('\n')[0]}`);
  }
}

await browser.close();
