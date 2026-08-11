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

### ~~P2 — Nháy trắng lúc mở app trên iPhone~~ ✅ XONG 10/08/2026

18 ảnh splash (chân dung, iPhone + iPad) sinh bằng `pnpm --filter web gen:splash`, khai qua
`components/pwa/AppleSplashLinks.tsx`. Kiểm lại nguồn trước khi làm: iOS 17/18 **vẫn** không đọc
`background_color` của manifest để dựng splash, nên `apple-touch-startup-image` vẫn là đường duy nhất.

**Bắt được một lỗi thật của bộ ảnh thương hiệu khi làm** — xem §4.

### P3 — Thanh trạng thái chưa liền mạch 🔴 KHÔNG làm mù được (đã đo)

`apple-mobile-web-app-status-bar-style: black-translucent` cho nội dung tràn lên dưới thanh trạng
thái — đúng cái nhìn "full-bleed" của app iOS. Đây là thẻ Apple **không** bị manifest thay thế, nên
vẫn phải khai tay. Next gộp nó trong `appleWebApp` (kèm thẻ `capable` di sản ở §1) ⇒ phải khai
**bằng tay** trong `<head>`.

⚠️ **Nhưng ĐỪNG bật trước khi làm việc dưới đây.** Đếm ngày 10/08 trên toàn `apps/web`:

| `env(safe-area-inset-*)` | Số chỗ |
|---|---|
| `-bottom` | 14 |
| `-left` / `-right` | 2 |
| **`-top`** | **0** |

Bật `black-translucent` là nội dung dịch LÊN dưới thanh trạng thái, mà **không có một chỗ nào**
trong site đang chừa lề trên. Kết quả: chữ nằm đè lên đồng hồ / pin trên mọi trang. Đây không phải
"đổi một dòng" như plan bản đầu ước lượng — nó là **một đợt quét toàn site** thêm lề trên, rồi mới
đo trên iPhone thật.

→ Nâng P3 từ 🟠 "nhỏ" lên 🔴 "cần một đợt riêng". Ước lượng cũ sai vì đoán, giờ có số đếm.

### P4 — Chi tiết cảm giác chạm 🟡 (đợt sau, cần đo trên máy thật)

Overscroll bounce, tap highlight, momentum scroll, chuyển trang. Chưa đo nên **chưa liệt kê thành
việc** — liệt kê bây giờ là đoán.

---

## 3. Thứ tự đề xuất

P1 trước (một PR, có test), rồi P3 (nhỏ, nhưng phải đo lại safe-area), rồi P2 (cần sinh ảnh).
P4 mở phiên đo riêng trên iPhone thật.

**Không gộp P1 và P3 vào một PR:** P3 đổi layout toàn site, cần nhìn riêng.

---

---

## 4. ⚠️ Lỗi bộ ảnh thương hiệu phát hiện khi làm P2 — CHƯA SỬA

`public/icon-maskable-512.png` **không phải một maskable icon đúng nghĩa**. Đo được:

- Viền ngoài 20% (safe-zone): nền tối `#0a0a0c` ✅ đúng.
- Nhưng ô logo bên trong `(51,51)→(459,459)` **mang theo nền TRẮNG** của `icon-512.png` ở 4 góc —
  tức bản maskable được tạo bằng cách dán ảnh nền trắng vào giữa một khung tối, chứ không phải
  render lại từ nguồn.

**Hệ quả ngoài splash:** manifest khai file này với `purpose: "maskable"`, tức **Android dùng nó
làm icon màn hình chính**. Android cắt theo mặt nạ tròn/squircle quanh vùng 80% — đúng vùng có 4
góc trắng. Nhiều khả năng icon trên máy Android đang có vệt trắng ở góc. **Chưa kiểm trên máy
Android thật nên không khẳng định**, nhưng đủ căn cứ để phải xem.

Script splash đã tự né được (cắt ô + bo góc), nhưng đó là **vá ở hạ nguồn**. Sửa tận gốc là render
lại `icon-maskable-512.png` từ file thiết kế nguồn với nền tối tràn viền — cần file gốc, không làm
được từ PNG đã bẹt.

→ **Việc riêng, không được quên:** kiểm icon trên một máy Android thật, rồi làm lại ảnh nguồn.

---

**Cross-link:** [[94 - Master Infrastructure Reference]] · note 167 (UI System Overhaul) ·
`components/product/BottomNavBar.tsx` (nơi định nghĩa "chế độ app")
