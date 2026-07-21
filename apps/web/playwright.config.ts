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
      // ⚠️ TÊN GÂY HIỂU NHẦM — ĐỌC TRƯỚC KHI TIN KẾT QUẢ CI.
      // Project này tên "chromium-mobile" nhưng KHÔNG chạy Chromium: preset
      // `devices["iPhone SE"]` mang `defaultBrowserType: "webkit"`, nên nó chạy
      // **WebKit (Safari)**. Ai đọc log CI thấy "chromium-mobile" rồi kết luận
      // "Chrome mobile đã pass/fail" là hiểu SAI engine.
      //
      // Chuyện này có thật, không phải giả định: 2026-07-21 journey-smoke đỏ đúng
      // ở project này với 2 lỗi mà chromium desktop KHÔNG tái hiện được — vì đó là
      // lỗi riêng của Safari (chặn fetch `cache:"force-cache"` trên route
      // no-store; và rơi RSC payload khiến mọi lần bấm link trên iPhone là tải lại
      // cả trang).
      //
      // KHÔNG đổi tên project: 8 ảnh mẫu VRT đang gắn chuỗi "chromium-mobile" trong
      // tên file, đổi là mất baseline. Giữ tên + ghi chú này là lựa chọn ít rủi ro
      // hơn. Nếu sau này thật sự cần Chrome-mobile, THÊM project mới
      // (`...devices["Pixel 7"]`) chứ đừng sửa cái này.
      name: "chromium-mobile",
      use: { ...devices["iPhone SE"] },
    },
  ],
});
