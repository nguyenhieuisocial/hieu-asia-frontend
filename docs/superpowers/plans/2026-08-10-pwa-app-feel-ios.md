# PWA — đưa hieu.asia về cảm giác app iOS

**Ngày:** 2026-08-10 · **Phạm vi:** `apps/web` · **Trạng thái:** plan, chưa code

---

## 1. Hiện trạng — ĐÃ ĐO, không suy đoán

| Thứ                                     | Trạng thái               | Bằng chứng                                                                                                                         |
| --------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Web app manifest                        | ✅ có                    | `src/app/manifest.ts` — `display: standalone`, `orientation: portrait`, `theme_color`, `background_color`                          |
| Icon                                    | ✅ đủ bộ                 | 192/512 `any` + 192/512 `maskable` (đệm 20% safe-zone) + `apple-icon.png` 180                                                      |
| `viewport-fit: cover`                   | ✅ có                    | `layout.tsx` §viewport — `env(safe-area-inset-*)` mới resolve thật trên iPhone                                                     |
| `interactiveWidget: resizes-content`    | ✅ có                    | cùng chỗ — bàn phím không che composer                                                                                             |
| Safe-area padding                       | ✅ dùng 17 chỗ           | `grep safe-area-inset` trong `src`                                                                                                 |
| Bottom nav kiểu app                     | ✅ có                    | `components/product/BottomNavBar.tsx` — chỉ render khi `display-mode: standalone`                                                  |
| FAB / AppShell / lời mời cài đặt        | ✅ có                    | `Fab.tsx`, `AppShell.tsx`, `PwaInstallPrompt.tsx`                                                                                  |
| Service worker                          | ⚠️ chỉ có push           | `public/sw.js` 47 dòng — `install`/`activate`/`push`/`notificationclick`. **Không có `fetch` handler, không cache, không offline** |
| Đăng ký SW                              | ⚠️ chỉ khi bật thông báo | `components/daily/SubscribePush.tsx:81` — ai không bật push thì **không có SW nào chạy**                                           |
| Splash screen iOS                       | ❌ không có              | không có `apple-touch-startup-image` ở đâu                                                                                         |
| `apple-mobile-web-app-status-bar-style` | ❌ không có              | grep toàn `src` + `public`: 0 kết quả                                                                                              |

### ⚠️ Một giả định SAI đã bị bác bỏ trước khi kịp viết code

Nhìn thấy `appleWebApp` / `apple-mobile-web-app-capable` **không có ở đâu cả**, kết luận đầu tiên
là "vậy trên iPhone thêm vào màn hình chính sẽ mở như tab Safari chứ không phải app, nên toàn bộ
BottomNavBar + safe-area đã làm đều vô hình trên iOS". **Sai.**

Safari hỗ trợ web app manifest từ iOS 11.4 (2018): site nào có manifest đặt `display: standalone`
là mở ở chế độ app. Thẻ `apple-mobile-web-app-capable` là **di sản, nay không còn được khuyến
nghị** — thậm chí có thể làm hỏng trải nghiệm cài đặt khi trình duyệt không nạp được manifest. Từ
iOS 26, mọi site thêm vào màn hình chính mặc định mở dạng web app kể cả không có manifest.

→ **Standalone trên iOS ĐANG CHẠY SẴN.** Không có lỗ hổng nào ở đây, và **không được** thêm
`appleWebApp` của Next chỉ để cho "đủ bộ" — nó phát ra đúng cái thẻ di sản kia.

→ Bài học ghi lại: "thiếu thẻ meta" ≠ "tính năng hỏng". Phải hỏi xem nền tảng đã thay đường khác
chưa, trước khi vá cái mình tưởng là thiếu.

---

## 2. Khoảng trống THẬT, xếp theo giá trị / rủi ro

### P1 — Mất mạng là gãy hoàn toàn 🔴 giá trị cao nhất

App đã cài mà rớt mạng thì hiện **trang lỗi của trình duyệt** — thứ phá cảm giác app nhanh nhất.
Không có `fetch` handler nghĩa là: không offline fallback, không cache app shell, mở lại app lần
hai vẫn tải mạng từ đầu.

Nặng thêm: SW **chỉ được đăng ký khi người dùng bấm bật thông báo**. Ai chỉ cài app mà không bật
push thì không có SW nào chạy — nên kể cả sau này thêm cache, phần lớn người dùng vẫn không nhận.

**Việc:**

1. Tách đăng ký SW ra khỏi `SubscribePush` → đăng ký sớm ở tầng app cho mọi người dùng.
   Giữ nguyên phần xin quyền push (đó vẫn phải do người dùng bấm).
2. Thêm `fetch` handler vào `public/sw.js`:
   - **Chỉ** navigation request → network-first, rớt thì trả `/offline`.
   - Static asset (`/_next/static/*`, font, icon) → cache-first (bất biến, có hash).
   - **KHÔNG** đụng `/api/*`, không cache HTML động của trang luận giải.
3. Thêm route `src/app/offline/page.tsx` — tĩnh, tự chứa, không gọi API.

**Verify:** DevTools → Application → Service Workers → tick Offline → điều hướng phải ra `/offline`
chứ không ra trang lỗi Chrome; `/api/*` khi online vẫn đi thẳng mạng (xem tab Network).

**Rủi ro cần canh:** SW cache sai làm người dùng kẹt ở bản cũ. Chặn bằng: chỉ cache asset có hash,
navigation luôn network-first, `skipWaiting` + `clients.claim` (đã có sẵn), và đặt tên cache có
version để lần activate sau xoá cache cũ.

### P2 — Nháy trắng lúc mở app trên iPhone 🟠

iOS không tự sinh splash từ `background_color`; thiếu `apple-touch-startup-image` thì mở app thấy
màn trắng ~1s. Cần ảnh theo từng kích thước màn hình, sinh bằng script từ icon + `background_color`
`#0F0F12`.

**Verify:** mở app đã cài trên iPhone thật, quay màn hình lúc khởi động.

### P3 — Thanh trạng thái chưa liền mạch 🟠

`apple-mobile-web-app-status-bar-style: black-translucent` cho nội dung tràn lên dưới thanh trạng
thái — đúng cái nhìn "full-bleed" của app iOS. Đây là thẻ Apple **không** bị manifest thay thế, nên
vẫn phải khai tay.

⚠️ Nhưng Next gộp nó chung trong `appleWebApp`, mà `appleWebApp` cũng phát ra thẻ `capable` di sản
đã nói ở §1. → Phải khai thẻ này **bằng tay** trong `<head>`, không dùng `appleWebApp`.
Cần đo lại một lượt safe-area sau khi đổi, vì `black-translucent` làm layout dịch lên.

### P4 — Chi tiết cảm giác chạm 🟡 (đợt sau, cần đo trên máy thật)

Overscroll bounce, tap highlight, momentum scroll, chuyển trang. Chưa đo nên **chưa liệt kê thành
việc** — liệt kê bây giờ là đoán.

---

## 3. Thứ tự đề xuất

P1 trước (một PR, có test), rồi P3 (nhỏ, nhưng phải đo lại safe-area), rồi P2 (cần sinh ảnh).
P4 mở phiên đo riêng trên iPhone thật.

**Không gộp P1 và P3 vào một PR:** P3 đổi layout toàn site, cần nhìn riêng.

---

**Cross-link:** [[94 - Master Infrastructure Reference]] · note 167 (UI System Overhaul) ·
`components/product/BottomNavBar.tsx` (nơi định nghĩa "chế độ app")
