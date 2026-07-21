/**
 * Journey smoke — đi TRỌN hành trình khách trên PRODUCTION (vault 167 §I, T28).
 *
 * VÌ SAO CÓ FILE NÀY: mọi audit trước đều đọc code từng phần tử. Lỗi TÍCH HỢP —
 * dữ liệu không mang được sang bước sau, deep-link mất query, trang chặn-đăng-nhập
 * quăng lỗi thay vì chuyển hướng — không hiện ra khi đọc tĩnh. Ngày 2026-07-21 đã
 * xác nhận một sự thật khiến việc này thành ưu tiên: **chưa từng có giao dịch nào
 * đi trọn từ đầu đến cuối** (5 lần ngân hàng báo tiền, 0 lần thành đơn). Không ai
 * đi bộ hết luồng thì không ai biết nó gãy ở đâu.
 *
 * PHẠM VI TRUNG THỰC — đọc trước khi tin kết quả:
 * - Hành trình 1 (khách mới, ẩn danh) kiểm được TRỌN VẸN. Đây là luồng ra tiền.
 * - Hành trình 2 và 3 cần ĐĂNG NHẬP. Test này KHÔNG đăng nhập (không nhét thông
 *   tin đăng nhập vào CI), nên chỉ kiểm tới cổng: chặn đúng cách, giữ đích đến,
 *   không quăng lỗi. Phần SAU đăng nhập vẫn CHƯA có ai đi — đừng đọc file này
 *   thành "3 hành trình đã được phủ".
 * - Chạy vào PROD thật (PLAYWRIGHT_BASE_URL, mặc định https://hieu.asia) nên nó
 *   kiểm cái ĐANG CHẠY, không phải bản build cục bộ.
 */
import { test, expect, type ConsoleMessage, type Page } from "@playwright/test";

/** Khoá hồ sơ ngày sinh dùng chung — nguồn: src/lib/birth-profile.ts */
const BIRTH_PROFILE_KEY = "hieu:birth-profile";

/** Câu hiện ra khi một công cụ TỰ ĐIỀN từ hồ sơ đã lưu — src/components/tools/SavedBirthInfoHint.tsx */
const AUTOFILL_HINT = "Đã tự điền từ thông tin bạn nhập trước";

/**
 * Bỏ qua tiếng ồn không phải lỗi của mình: script bên thứ ba trong in-app
 * browser (Zalo), lỗi mạng của tracker, ResizeObserver. Sentry 30 ngày cho thấy
 * `zaloJSV2` là nhiễu thường trực — bắt nó sẽ làm test đỏ vì lý do vô nghĩa.
 */
const IGNORED_CONSOLE = [
  /zaloJSV2/i,
  /ResizeObserver loop/i,
  /Failed to load resource/i,
  /net::ERR_/i,
  /posthog|sentry|googletagmanager|doubleclick/i,
  // Log TRANG TRÍ vô hình (`font-size:0; color:transparent`) — thư viện nào đó
  // in watermark ở mức `error` trên /account. Lọc theo mẫu HẸP, không nới lỏng
  // cả nhóm.
  // ⚠️ CHƯA TRUY RA NGUỒN. Giữ nguyên `%d` = NaN trong chuỗi vì đó là điểm đáng
  // ngờ duy nhất: nếu sau này tìm ra đây là số liệu THẬT bị NaN (không phải
  // watermark) thì phải bỏ dòng lọc này và sửa gốc, đừng để nó im mãi. Ghi ở
  // đây thay vì xoá lặng lẽ, đúng tinh thần "im lặng là lỗi" của phiên 21/07.
  /font-size:0;\s*color:transparent/i,
  // WebKit/Safari chưa hỗ trợ khoá viewport `interactive-widget` (Chrome có).
  // Cảnh báo tương thích trình duyệt thuần tuý, không phải lỗi của mình — và
  // KHÔNG nên bỏ khoá đó khỏi viewport vì Chrome đang dùng thật.
  /Viewport argument key "interactive-widget"/i,
];

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
    errors.push(text.slice(0, 200));
  });
  page.on("pageerror", (e) => {
    const text = String(e?.message ?? e);
    if (IGNORED_CONSOLE.some((re) => re.test(text))) return;
    errors.push(`pageerror: ${text.slice(0, 200)}`);
  });
  return errors;
}

// ── HÀNH TRÌNH 1 — KHÁCH MỚI, ẨN DANH (luồng ra tiền) ───────────────────────
test.describe("Journey 1 — khách mới (ẩn danh)", () => {
  test("home → công cụ → hồ sơ mang theo → trang giá", async ({ page }) => {
    const errors = collectErrors(page);

    // B1 — trang chủ lên được.
    const home = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(home?.status(), "trang chủ phải 200").toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();

    // B2 — vào một công cụ đọc hồ sơ ngày sinh dùng chung.
    const tool = await page.goto("/tam-tai", { waitUntil: "domcontentloaded" });
    expect(tool?.status(), "/tam-tai phải 200").toBe(200);

    // B3 — GIẢ LẬP "đã nhập ở bước trước". Ghi thẳng hồ sơ thay vì lái form:
    // test này kiểm CƠ CHẾ MANG THEO (tính năng "nhập 1 lần, tool khác tự điền",
    // PR #866), không kiểm UI của riêng một form — lái form sẽ vỡ mỗi lần đổi
    // giao diện mà không nói gì về tích hợp.
    await page.evaluate(
      ([key, value]) => window.localStorage.setItem(key, value),
      [BIRTH_PROFILE_KEY, JSON.stringify({ year: 1992, month: 2, day: 14, gender: "nam", calendar: "duong" })] as const,
    );

    // B4 — CÔNG CỤ KHÁC phải tự điền. Đây là cái audit tĩnh không thấy được.
    await page.goto("/sao-han", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByText(AUTOFILL_HINT, { exact: false }),
      "công cụ thứ hai phải tự điền từ hồ sơ đã lưu (tính năng mang-theo)",
    ).toBeVisible({ timeout: 10_000 });

    // B5 — tới được trang giá (cuối phễu công khai).
    const pricing = await page.goto("/pricing", { waitUntil: "domcontentloaded" });
    expect(pricing?.status(), "/pricing phải 200").toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();

    expect(errors, `lỗi console trong hành trình 1:\n${errors.join("\n")}`).toEqual([]);
  });

  test("hồ sơ RỖNG thì công cụ KHÔNG được báo đã tự điền", async ({ page }) => {
    // Mặt trái của B4: nếu hint hiện cả khi chưa có hồ sơ thì assertion trên là
    // vô nghĩa (luôn xanh). Test này giữ cho test kia thật sự có ý nghĩa.
    await page.goto("/sao-han", { waitUntil: "domcontentloaded" });
    await page.evaluate((key) => window.localStorage.removeItem(key), BIRTH_PROFILE_KEY);
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByText(AUTOFILL_HINT, { exact: false })).toHaveCount(0);
  });
});

// ── HÀNH TRÌNH 2 — KHÁCH QUAY LẠI (chỉ tới cổng đăng nhập) ──────────────────
test.describe("Journey 2 — khách quay lại (chưa đăng nhập)", () => {
  test("deep-link vùng riêng tư → chuyển hướng đúng, GIỮ đích đến", async ({ page }) => {
    const errors = collectErrors(page);

    const res = await page.goto("/account", { waitUntil: "domcontentloaded" });
    expect(res?.status(), "/account không được lỗi máy chủ").toBeLessThan(400);
    await page.waitForTimeout(2500); // /account long-poll auth, không bao giờ networkidle

    const url = new URL(page.url());
    // Chấp nhận cả hai thiết kế: chuyển sang /signin, hoặc /account tự render
    // trạng thái chưa-đăng-nhập. Cái KHÔNG chấp nhận được là trang trắng/lỗi.
    const landedSignin = url.pathname.startsWith("/signin");
    if (landedSignin) {
      // Nếu đã chuyển hướng thì phải GIỮ đích đến, nếu không khách đăng nhập
      // xong bị vứt về trang chủ và mất mạch — lỗi tích hợp kinh điển.
      expect(url.search, "chuyển hướng phải mang theo đích đến (?next=)").toContain("next");
    }
    await expect(page.locator("h1, h2").first()).toBeVisible();

    expect(errors, `lỗi console hành trình 2:\n${errors.join("\n")}`).toEqual([]);
  });

  test("mở bài đọc không tồn tại → không vỡ trang", async ({ page }) => {
    const res = await page.goto("/reading/khong-ton-tai-smoke-test", { waitUntil: "domcontentloaded" });
    // 404 hay chuyển hướng đều được; 5xx thì không.
    expect(res?.status(), "id sai không được gây lỗi máy chủ").toBeLessThan(500);
  });
});

// ── HÀNH TRÌNH 3 — CỘNG TÁC VIÊN (chỉ phần công khai) ───────────────────────
test.describe("Journey 3 — cộng tác viên (chưa đăng nhập)", () => {
  test("trang giới thiệu affiliate lên được", async ({ page }) => {
    const errors = collectErrors(page);
    const res = await page.goto("/affiliate", { waitUntil: "domcontentloaded" });
    expect(res?.status(), "/affiliate phải lên được").toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
    expect(errors, `lỗi console hành trình 3:\n${errors.join("\n")}`).toEqual([]);
  });

  test("link giới thiệu ?ref= giữ được mã qua điều hướng", async ({ page }) => {
    // Mất mã giới thiệu = mất hoa hồng của CTV mà không ai biết — đúng dạng lỗi
    // im lặng đang được rà trong phiên 2026-07-21.
    await page.goto("/?ref=SMOKETEST", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    const cookies = await page.context().cookies();
    const refCookie = cookies.find((c) => c.name === "hieu_ref");
    expect(refCookie?.value, "middleware phải ghi cookie hieu_ref từ ?ref=").toBe("SMOKETEST");
  });
});
