# Mỗi công cụ một bài Học riêng — kế hoạch chương trình

> **Cho agent:** dùng `superpowers:executing-plans` để làm từng đợt. Đây là bản
> đồ dài hạn, không phải việc làm một lần: mỗi đợt viết vài bài rồi xoá đúng
> chừng đó slug khỏi `PENDING`.

**Vấn đề thật (đo ngày 31/07/2026).** Nút "Học" trên trang công cụ dẫn người đọc
sang bài của công cụ khác: 5 công cụ ngày–giờ (`/lich-van-nien`, `/xem-ngay`,
`/gio-hoang-dao`, `/ngay-kieng-ky`, `/thien-van`) cùng trỏ về `/learn/trach-cat`,
nên bấm "Học" từ lịch thiên văn lại rơi vào bài chọn ngày cưới; 36 công cụ khác
không có bài Học nào nên chỉ trỏ về hub `/learn`.

**Đích đến.** `PENDING` rỗng: mọi công cụ công khai có đúng một bài Học của riêng
nó, và không bài nào bị hai công cụ dùng chung.

---

## Nguồn sự thật & bất biến

Bản đồ: [`apps/web/src/lib/learn/tool-coverage.ts`](../../../apps/web/src/lib/learn/tool-coverage.ts) —
`tool-coverage.test.ts` canh 3 bất biến:

1. Mọi công cụ công khai (có `catalog` hoặc `home` trong `TOOL_REGISTRY`) phải có
   mặt trong `TOOL_LEARN_MAP` hoặc `EXEMPT_TOOLS`.
2. Không hai công cụ nào trỏ về cùng một bài Học.
3. Mọi đích không nằm trong `PENDING` phải là trang có thật trên đĩa.

Viết xong bài nào thì **xoá slug đó khỏi `PENDING`** — test lập tức đòi trang phải
tồn tại, nên không thể "coi như xong" mà chưa có trang.

## Khuôn một bài Học (rút từ 8 bài đợt 1)

- `page.tsx` (server) + `_active-learning.tsx` (client, phần tương tác).
- Header comment ghi rõ **GROUNDING**: bài lấy quy tắc/con số từ file engine nào.
  Số liệu **import** từ lib của công cụ, không gõ lại — bảng trong bài không được
  phép lệch với kết quả công cụ.
- `metadata`: title ≤ 60 ký tự, description ≤ 160, `alternates.canonical` tuyệt đối.
- JSON-LD: `article` + `breadcrumb` + `course` + `faqPage`; **chữ trong schema ===
  chữ hiển thị** (FAQ khai báo một lần, dùng cho cả accordion lẫn schema).
- Đăng ký ở 4 chỗ: `LEARN_TOPICS` + `NEIGHBORS` (`lib/learn/related.ts`), một lộ
  trình trong `lib/learn/paths.ts`, `TOOL_REGISTRY` (`learn` + `related`), và bỏ
  slug khỏi `PENDING`. Sitemap tự suy từ `LEARN_TOPICS`, không phải sửa tay.
- Giọng: phong tục/mô hình để **tham khảo**, không hù doạ, không bán lễ giải hạn.
- **Lõi riêng:** mỗi bài chỉ giải thích cơ chế của chính nó; thứ thuộc bài khác
  thì nhắc tên kèm link, không giải thích lại.

## Cổng kiểm mỗi đợt

```bash
cd apps/web && pnpm types:check && pnpm test && pnpm lint && pnpm seo-guard && pnpm ui-guard
```

---

## Đợt 1 — XONG (31/07/2026)

8 bài: `kim-lau`, `tam-tai`, `hoang-oc`, `bat-trach`, `cung-hoang-dao`,
`lich-am-duong`, `gio-hoang-dao`, `ngay-kieng-ky`. Kèm 2 lộ trình mới trong
`paths.ts` ("Ngày giờ tốt xấu", "Xem tuổi việc lớn") và sitemap chuyển từ danh
sách gõ tay sang suy từ `LEARN_TOPICS`.

## Còn lại — 35 bài, lõi riêng từng bài

Cột "lõi riêng" là ranh giới chống lấn: viết đúng phần đó, phần còn lại chỉ link.

### Đợt 2 — việc lớn theo tuổi (5 bài)

| Công cụ | Bài | Lõi riêng |
|---|---|---|
| `/xem-tuoi-cuoi` | `/learn/cuoi-hoi` | Cách gộp nhiều điều kiện cưới hỏi vào một kết luận (Kim Lâu + Tam Tai + xung năm) và xử lý khi chúng mâu thuẫn. Cơ chế từng hạn: link sang bài riêng. |
| `/khai-truong` | `/learn/khai-truong` | Chọn năm/ngày mở hàng theo tuổi chủ: xung Thái Tuế và Tam Tai áp vào việc kinh doanh. |
| `/xong-dat` | `/learn/xong-dat` | Tục xông đất: vì sao chọn theo tam hợp/lục hợp + ngũ hành, và nó khác "chọn ngày" ra sao. |
| `/tra-cuu-tuoi` | `/learn/doc-mot-tuoi` | Đọc **một tuổi** như một hồ sơ: các lớp thông tin suy từ năm sinh và thứ tự đọc chúng. |
| `/xem-tuong` (phụ) | `/learn/tuong-mat` | Nhân tướng khuôn mặt như tập tục quan sát: đọc gì được, giới hạn ở đâu (bài chính `/learn/palm` là chỉ tay). |

### Đợt 3 — ngày giờ & thiên văn (2 bài)

| Công cụ | Bài | Lõi riêng |
|---|---|---|
| `/xuat-hanh` | `/learn/xuat-hanh` | Hỷ Thần / Tài Thần: hướng xuất hành suy từ Can ngày, khác hẳn hướng nhà theo cung phi. |
| `/thien-van` | `/learn/thien-van` | Thiên văn quan sát được: nhật/nguyệt thực, phân–chí — hiện tượng thật, tách bạch với tầng diễn giải phong tục. |

### Đợt 4 — phong thuỷ chuyên sâu (4 bài)

| Công cụ | Bài | Lõi riêng |
|---|---|---|
| `/huong-ban-lam-viec` | `/learn/du-nien` | 8 du niên (Sinh Khí, Thiên Y, Diên Niên…) và cách áp cho chỗ ngồi. Cung phi: link `/learn/bat-trach`. |
| `/phi-tinh` | `/learn/huyen-khong-phi-tinh` | Huyền Không phi tinh: nguyên vận, sơn tinh/hướng tinh, Vượng sơn Vượng hướng — lý khí, khác Bát Trạch. |
| `/thuoc-lo-ban` | `/learn/thuoc-lo-ban` | Thước Lỗ Ban: các dải cát/hung, vì sao có nhiều loại thước và đo cái gì. |
| `/mau-xe-hop-menh` | `/learn/ngu-hanh-mau-sac` | Ngũ hành ↔ màu sắc: sinh/khắc áp vào chọn màu, và giới hạn của cách suy này. |

### Đợt 5 — nền tảng can chi & lập lá số (6 bài)

| Công cụ | Bài | Lõi riêng |
|---|---|---|
| `/ban-menh` | `/learn/nap-am` | Nạp âm 60 hoa giáp: mệnh năm sinh được gán thế nào, khác gì "hành của Chi". |
| `/luc-thap-hoa-giap` | `/learn/can-chi` | 10 Can × 12 Chi → chu kỳ 60: cách ghép và cách đọc bảng. |
| `/tuong-hop-12-con-giap` | `/learn/tam-hop-luc-xung` | Tam hợp / lục xung / lục hại giữa 12 Chi — luật hình học của vòng tròn 12. |
| `/tinh-menh-cuc` | `/learn/menh-cuc` | Tính Mệnh và Cục từ ngày giờ sinh — bước tiền đề trước khi an sao. |
| `/la-so-tu-vi` | `/learn/lap-la-so` | Quy trình lập lá số Tử Vi: an 12 cung, an sao chính/phụ, độ sáng. |
| `/la-so-bat-tu` | `/learn/lap-bat-tu` | Quy trình lập Tứ Trụ: 8 chữ theo tiết khí, Nhật Chủ, Thập Thần. |

### Đợt 6 — vận theo thời gian (6 bài)

| Công cụ | Bài | Lõi riêng |
|---|---|---|
| `/dai-van-hien-tai` | `/learn/dai-van` | Đại vận 10 năm: chia vận, thuận/nghịch, đọc chủ đề một giai đoạn. |
| `/timeline` | `/learn/giao-van` | Giao vận: điều gì xảy ra ở mốc chuyển giữa hai đại vận, vì sao vùng giáp ranh khó đọc. |
| `/tu-vi-hom-nay` | `/learn/nhat-van` | Vận ngày: nó suy từ đâu, vì sao biên độ nhỏ và không nên đọc như dự báo. |
| `/tu-vi-thang` | `/learn/tiet-khi` | 24 tiết khí: trụ tháng đổi theo tiết chứ không theo mùng 1 âm lịch. |
| `/tu-vi-2026` | `/learn/thai-tue` | Thái Tuế: xung/hình/hại Thái Tuế trong một năm cụ thể nghĩa là gì. |
| `/tu-vi-2027` | `/learn/luu-nien` | Lưu niên: sao hạn chảy theo năm, khác đại vận và khác Thái Tuế thế nào. |

### Đợt 7 — văn hoá, quan hệ & tư duy phản biện (12 bài)

| Công cụ | Bài | Lõi riêng |
|---|---|---|
| `/that-tich-2026` | `/learn/that-tich` | Thất Tịch: gốc tích Ngưu Lang – Chức Nữ và tục lệ quanh ngày này. |
| `/valentine-2027` | `/learn/ngay-tinh-yeu` | Ngày lễ tình yêu: du nhập, cách các hệ xem tình duyên gắn vào một ngày dương lịch. |
| `/ban-do` | `/learn/nhip-song` | Nhịp tuần/tháng/năm: vì sao chia nhịp giúp lên kế hoạch, và ranh giới với "dự báo". |
| `/compatibility` | `/learn/hop-doi` | Hợp đôi: các trục so khớp giữa hai người và ý nghĩa của một điểm số hợp. |
| `/xem-hop-nhom` | `/learn/dong-nhom` | Nhóm 3–6 người: hợp từng cặp không cộng dồn thành hợp cả nhóm. |
| `/family-profiles` | `/learn/hieu-nguoi-than` | Đọc hồ sơ người thân có đạo đức: dùng để phối hợp, không để dán nhãn. |
| `/sinh-con` | `/learn/sinh-con` | Mệnh & con giáp của bé, đối chiếu tuổi bố mẹ — nói rõ đây là phong tục tham khảo. |
| `/bang-chung` | `/learn/kiem-chung` | Kiểm chứng bằng quá khứ thật: hồi cứu, xác nhận thiên lệch, cách tự kiểm nghiêm. |
| `/tu-kiem` | `/learn/barnum` | Hiệu ứng Barnum: vì sao lời mô tả chung chung luôn thấy đúng. |
| `/so-sanh` | `/learn/so-sanh-lang-kinh` | Đặt hai lăng kính cạnh nhau: mỗi hệ trả lời loại câu hỏi nào, không hệ nào bao trùm hệ kia. |
| `/decision-simulator` | `/learn/ra-quyet-dinh` | Dùng lá số như một khung đặt câu hỏi khi ra quyết định, không phải máy chọn hộ. |
| `/career-fit` | `/learn/nghe-nghiep` | Thiên hướng nghề: kết hợp tín hiệu tính cách + lá số, và giới hạn khi dự đoán nghề nghiệp. |

---

## Ghi chú

- `EXEMPT_TOOLS` (`/reading`, `/hoi-dap`) không phải công cụ tính toán nên không
  có bài riêng — cả hai trỏ về hub `/learn`.
- `/tu-vi-nghe-nghiep`, `/tu-vi-tinh-yeu`, `/tu-vi-tai-chinh` dùng trang con sẵn
  có của `/learn/tu-vi` (cung Quan Lộc / Phu Thê / Tài Bạch), **không** tạo bài mới.
