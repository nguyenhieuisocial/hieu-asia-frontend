# Giai đoạn 2 design refresh — kế hoạch áp dụng cho toàn site + trang chủ

**Ngày:** 2026-08-11 · **Trạng thái:** đang thực thi, cập nhật liên tục ·
**Nguồn sự thật:** 22 thẻ đã duyệt trong `design-system/` (PR #1075, đồng bộ
trên claude.ai/design)

Founder đã trao toàn quyền thực thi mảng này, không cần duyệt từng bước —
nhưng mỗi bước vẫn kiểm chứng bằng số đo thật + ảnh chụp thật trên production,
đúng kỷ luật đã dùng suốt phiên làm việc này.

---

## 1. Đã xong — nền tảng dùng chung (mọi trang tự động thừa hưởng)

| # | Việc | PR | Cách áp | Đã kiểm |
|---|---|---|---|---|
| 1 | Màu nền tảng (Paper/Ink/Charcoal/Bone/Gold-soft) | [#1076](https://github.com/nguyenhieuisocial/hieu-asia-frontend/pull/1076) | 1 token CSS (`globals.css` `:root`/`.dark`) | Đo màu computed thật trên production, cả 2 chế độ, bấm toggle thật |
| 2 | Nút lún khi bấm (`ds-press`) | [#1074](https://github.com/nguyenhieuisocial/hieu-asia-frontend/pull/1074) | 1 class dùng chung, áp vào `Button` | Playwright giữ chuột, đo `transform` thật |
| 3 | Hình khối — bo góc phẳng 2px | [#1077](https://github.com/nguyenhieuisocial/hieu-asia-frontend/pull/1077) | 1 token CSS (`--radius`) + 1 dòng preset | Đo `border-radius` computed thật trên production |
| 4 | Gỡ mìn `.ds-reveal` (ẩn nội dung vĩnh viễn) | [#1074](https://github.com/nguyenhieuisocial/hieu-asia-frontend/pull/1074) | Xoá class hỏng, trỏ về hệ `rv-*` sẵn có | — |

**Vì sao nhóm này an toàn để làm không cần duyệt trước:** cả 4 việc đều là
**một điểm sửa, lan ra toàn site qua CSS/class dùng chung** — không đụng nội
dung, không đụng cấu trúc từng trang, rủi ro thấp và dễ đảo ngược (revert 1
file). Đây là lý do chúng đi trước.

---

## 2. Đang cân nhắc — CẦN CẨN TRỌNG HƠN, không phải "1 token là xong"

### 2a. Thang chữ (type scale)

Bộ 22 thẻ chốt thang 9 bậc: `88/64/48/32/24/19/16/13/11px`, mỗi bậc có
line-height + tracking riêng, dùng 2 font Newsreader (serif hiển thị) + Be
Vietnam Pro (thân bài).

**Đo thật trước khi động vào:** `text-xs`/`text-sm`/`text-base`/`text-lg` của
Tailwind (thang mặc định, KHÔNG được ghi đè trong preset — khác hẳn
`borderRadius` đã ghi đè) đang được dùng **4.614 lần** trên toàn `apps/web/src`
(934+2482+570+628), cộng **195 chỗ** viết cứng `text-[Npx]` không qua token
nào cả.

→ **Đây KHÔNG phải một token để lật.** `borderRadius`/màu là thuộc tính THUẦN
THỊ GIÁC — đổi giá trị không thay đổi Ý NGHĨA gì. Cỡ chữ thì khác: `text-sm`
ở một chỗ là nhãn phụ, ở chỗ khác là thân đoạn văn — đổi cả thang cùng lúc có
thể làm nhãn quá to hoặc thân bài quá nhỏ tuỳ ngữ cảnh, không đoán trước được
mà không nhìn từng trang. Làm ẩu ở đây là đúng loại lỗi CLAUDE.md cấm ("fix
cho có" — áp bừa để trông như đã fix).

**Kế hoạch:** không lật thang mặc định. Thay vào đó, mỗi khi CHẠM vào một
trang/component vì lý do khác (ví dụ làm khuôn trang công cụ ở mục 3), tiện
thể đối chiếu cỡ chữ trang đó với 9 bậc đã duyệt và sửa tại chỗ — tích luỹ dần,
không làm một lượt 1200 trang.

### 2b. Nhịp khoảng cách (spacing)

Bộ thẻ đề xuất 4 bậc: `card 32 · block 48 · section 88 · hero 128`. Một phần
đã được đưa vào code TRƯỚC phiên này (PR #1068, trước cả lúc tôi bắt đầu):
token `breath` (64px, 6 chỗ dùng) và `chapter` (176px, 57 chỗ dùng) đã có
trong `tailwind.config.ts` nhưng **chưa được đối chiếu lại với đúng 4 bậc mà
22 thẻ chốt** — hai việc này (token cũ trước phiên, thẻ mới trong phiên) có
thể đang lệch nhau. Cần đo lại trước khi mở rộng dùng thêm.

### 2c. Thành phần đồ hoạ riêng — "Bộ Não Oracle" (trang chủ)

`OracleGraph`/`OracleBrain`/`BaziRevealPanel` (khối cuối trang chủ, phần "Bộ
não Oracle") dùng CSS khối `.ob-*` trong `globals.css` — viết cứng nhiều mã
màu theo bảng CŨ (`#e0ae62` Warm gold, `#14161a`…), KHÔNG qua token nào. Sau
khi màu nền tảng đổi (mục 1.1), khối này có thể lệch tông nhẹ so với phần còn
lại của trang chủ.

→ **Cố ý CHƯA sửa trong đợt này.** Đây là minh hoạ đồ hoạ phức tạp (glow, hiệu
ứng hover, nhiều lớp) được canh bằng mắt cho đúng MỘT bảng màu — đổi vài mã hex
lẻ tẻ theo kiểu tìm-thay dễ tạo ra hình ảnh nửa mới nửa cũ, xấu hơn để nguyên.
Cần một phiên riêng nhìn trực tiếp minh hoạ rồi canh lại toàn bộ, không phải
việc "tiện tay" được.

---

## 3. Việc lớn còn treo — khuôn trang + trang chủ

Ba khuôn trang đã duyệt trong bộ thẻ nhưng **chưa áp cho trang thật nào**:

| Thẻ đã duyệt | Áp cho | Quy mô | Mức rủi ro |
|---|---|---|---|
| `patterns/hero.html` | Trang chủ (`InstantChartHero.tsx` + `MultiHero.tsx`) | 1 trang, nhưng là **cửa ngõ chuyển đổi chính của cả site** | Cao — sai là ảnh hưởng doanh thu trực tiếp |
| `patterns/tool-page.html` | ~1.200 trang công cụ (breadcrumb/H1/input/kết quả) | Rất lớn, nhưng LẶP LẠI cùng một khuôn | Trung bình — sai một khuôn là sai hàng loạt, nhưng dễ phát hiện qua 1 trang mẫu trước |
| `patterns/reading-report.html` | Màn đọc báo cáo lá số (đêm mặc định, nhịp đọc dài) | Trung bình, ít trang nhưng đọc lâu | Trung bình — ảnh hưởng trải nghiệm đọc, không ảnh hưởng chuyển đổi |

**Vì sao KHÔNG làm chung một lượt với mục 1:** đây là thay đổi **cấu trúc và
nội dung**, không phải token thuần thị giác. Trang chủ đặc biệt nhạy — founder
đã đặt cụm từ "homepage" riêng trong yêu cầu, đúng là chỗ cần nhìn kỹ nhất chứ
không phải làm nhanh nhất.

### Thứ tự đề xuất (làm được ngay, không cần chờ)

1. **`patterns/tool-page.html` → 1 trang mẫu thật** (ví dụ `/bat-tu`, đã có
   sẵn trong ảnh chụp kiểm chứng ở mục 1) — làm 1 trang, founder/tôi tự nhìn
   so với thẻ đã duyệt, đúng kiểu rồi mới nhân ra các trang cùng khuôn còn
   lại theo từng cụm route (tránh sửa 1.200 file cùng lúc — CLAUDE.md cấm
   "áp bừa để trông như đã fix").
2. **`patterns/reading-report.html`** — sau khi khuôn tool-page ổn, vì màn đọc
   báo cáo dùng chung nhiều linh kiện với trang công cụ (nút, thẻ trích dẫn).
3. **`patterns/hero.html` → trang chủ** — làm SAU CÙNG trong nhóm này, cần
   nhìn kỹ nhất vì rủi ro chuyển đổi cao nhất. Vẫn trong phạm vi "toàn quyền,
   không chờ duyệt", nhưng thứ tự để rủi ro cao nhất được làm với nhiều ngữ
   cảnh nhất (đã quen tay với 2 khuôn kia trước).

---

## 4. Nhật ký thực thi

- **11/08/2026, đợt 1:** #1076 (màu) + #1077 (hình khối) — merge, verify
  production. Phát hiện phụ: khối `.ob-*` (Oracle Brain, trang chủ) lệch tông
  sau đổi màu — ghi mục 2c, chưa sửa.
- *(cập nhật tiếp khi có tiến độ mới)*

**Cross-link:** `docs/superpowers/plans/2026-08-10-design-refresh-phase1-claude-design-library.md`
· [[94 - Master Infrastructure Reference]]
