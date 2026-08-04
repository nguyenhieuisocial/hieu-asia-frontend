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

## ✅ ĐÃ ĐẠT ĐÍCH (03/08/2026)

`PENDING` **rỗng**. Khu Học đi từ **18 → 61 chủ đề**; 43 bài viết mới qua 9 đợt.
Ba bất biến do `tool-coverage.test.ts` canh nay đúng trọn vẹn, và chúng là thứ
giữ cho tình trạng cũ không tái diễn khi thêm công cụ mới sau này.

**Việc còn lại — không phải phủ sóng mà là CHẤT LƯỢNG:**

- 6 bài của đợt cuối (`doc-mot-tuoi`, `nhat-van`, `tuong-mat`, `that-tich`,
  `ngay-tinh-yeu`, `sinh-con`) đã xuất bản nhưng vòng kiểm đối nghịch của chúng
  chết vì hết hạn token. Đang chạy lại. **Đừng coi là xong cho tới khi có kết
  quả kiểm** — 8 đợt trước, đợt nào vòng kiểm cũng tìm ra lỗi thật.
- Hai việc phát sinh đã ghi trong các mục bên dưới: rà lại `/ban-do` (metadata
  hứa "gợi ý cá nhân hoá theo lá số" trong khi trang render nội dung tĩnh), và
  hai trang `/dai-van-hien-tai` vs `/timeline` đang dùng hai quy ước tuổi khác
  nhau nên có thể xếp cùng một người vào hai chặng vận khác nhau.

**Bài học vận hành rút ra sau 9 đợt (giữ lại cho chương trình sau):**

1. **Vòng kiểm đối nghịch là thứ đáng giá nhất.** Không đợt nào sạch. Lỗi nặng
   nhất đều thuộc loại đọc lướt không thấy: một câu hình học sai trong FAQ của
   đúng bài "khoa học", `11.862` in dấu chấm nên tiếng Việt đọc thành mười một
   nghìn, một quy tắc mà cả ba ví dụ minh hoạ đều không kích hoạt được, và một
   kịch bản dựng trên con số mà engine không bao giờ sinh ra.
2. **Dùng `pipeline()` chứ đừng `parallel()` cho lô nhiều bài.** Một agent kẹt
   51 phút đã chặn vòng kiểm của 5 bài đã viết xong.
3. **Commit + push sau MỖI đợt.** Phiên khác chạy song song trên cùng thư mục đã
   `git checkout` hai lần, mỗi lần làm toàn bộ file chưa commit biến mất.
4. **Cấm agent sửa registry.** Đăng ký tập trung sau mỗi đợt; nếu không, các
   agent song song ghi đè nhau.

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

## Phong thuỷ chuyên sâu — XONG (01/08/2026)

Tương ứng bảng "Đợt 4" bên dưới, đã làm sớm vì 3 công cụ (`/phi-tinh`,
`/huong-ban-lam-viec`, `/thuoc-lo-ban`) đang dùng chung bài ô `/learn/phong-thuy`.
4 bài: `huyen-khong-phi-tinh`, `du-nien`, `thuoc-lo-ban`, `ngu-hanh-mau-sac`.
Kèm lộ trình mới `phong-thuy-chuyen-sau` (`bat-trach` chuyển từ `ung-dung-doi-song`
sang làm bài mở đầu cụm) và cụm mới cùng tên trên hub. `app/sitemap.ts` đổi sang
bảng `LEARN_PUBLISHED` (slug → ngày xuất bản) để các bài sau chỉ cần thêm một dòng.

Verify: `tsc` sạch · `vitest` 881/881 · `npm run build` exit 0 · 12/12 bài mới có
tiêu đề ≤60 và mô tả ≤160 đo trên HTML build · sitemap 30 bài Học.

### Ba bài học rút ra (đừng lặp lại)

1. **Commit + push sau MỖI đợt.** 01/08 một phiên Claude khác chạy song song trên
   cùng repo đã `git checkout` sang nhánh của nó → toàn bộ file đợt 1 biến mất khỏi
   cây làm việc. Lấy lại được vì đợt 1 đã commit lên `feat/learn-per-tool-wave1`.
   Dấu hiệu: file "biến mất" nhưng `git reflog` vẫn còn commit.
2. **Rà link tạm sau mỗi đợt.** Agent viết bài khi nhánh chưa có bài anh em sẽ trỏ
   tạm sang bài khác (`thuoc-lo-ban` từng trỏ `/learn/phong-thuy` thay cho
   `/learn/bat-trach`). Grep `TODO` + link tạm trong các bài mới trước khi commit.
3. **Chạy vitest từ `frontend/apps/web`** — test dùng `process.cwd()`; chạy từ gốc
   repo sẽ báo đỏ giả ở `jsonld-escape.guard.test.ts`.

## Nền tảng can chi + xuất hành — XONG (01/08/2026)

4 bài: `can-chi` (10 can × 12 chi, vì sao ra 60 chứ không phải 120), `nap-am`
(mệnh ngũ hành ra từ nạp âm chứ không từ can/chi năm sinh), `tam-hop-luc-xung`
(hình học vòng 12 chi: tam hợp = tam giác đều, lục xung = đối đỉnh), `xuat-hanh`
(Hỷ Thần / Tài Thần theo can NGÀY, khác hướng nhà theo tuổi).
Lộ trình mới `nen-tang-can-chi`; `xuat-hanh` vào lộ trình `ngay-gio-tot-xau`;
hub thêm cụm "Nền tảng can chi" (34 chủ đề).

Verify: tsc sạch · vitest 902/902 · build exit 0 · 4/4 bài đạt tiêu đề ≤60 và mô
tả ≤160 trên HTML build · sitemap 34 bài Học · hub hiển thị đủ 4 thẻ.

## Việc lớn theo tuổi + thiên văn — XONG (01/08/2026)

4 bài: `cuoi-hoi` (nhiều hạn gộp thành một kết luận + xác suất năm "sạch" tính từ
engine), `khai-truong` (Thái Tuế, xung Thái Tuế, năm tuổi), `xong-dat` (tục chọn
người xông đất: tiêu chí lá số vs tiêu chí con người), `thien-van` (nhật/nguyệt
thực, phân–chí, và cây cầu La Hầu – Kế Đô = giao điểm quỹ đạo).
`/thien-van` cuối cùng đã rời khỏi `/learn/trach-cat` — đây là ánh xạ sai rõ nhất
của tình trạng cũ (bấm Học từ lịch thiên văn lại ra bài chọn ngày cưới).

Verify: tsc sạch · vitest 902/902 · build exit 0 · 4/4 bài đạt tiêu đề ≤60 và mô
tả ≤160 trên HTML build · sitemap 38 bài Học · hub đủ 4 thẻ.

### Hai việc còn treo, phải làm khi tới lượt (đừng quên)

1. **Khi viết `/learn/thai-tue`** (thuộc `/tu-vi-2026`): `/learn/khai-truong` hiện đang trả lời
   "Thái Tuế là gì" trong FAQPage của nó — có rào phạm vi ("trong cách tính của hieu.asia…")
   nhưng vẫn phải rút gọn và trỏ sang bài Thái Tuế khi bài đó ra đời, kẻo hai trang cùng
   trả lời một câu. Eyebrow của `khai-truong` đã đổi sang `MỞ HÀNG` để nhường chỗ.
2. **`khai-truong/_active-learning.tsx`** còn gõ tay "3 năm Tam Tai / 1 năm xung trong mỗi 12"
   và "Kim Lâu 4 năm trong mỗi 9" — đúng và mang tính định nghĩa của tục lệ, nhưng `page.tsx`
   cùng bài đã suy `MIN_HOP`/`MAX_HOP`/`OVERLAP_CHIS` từ engine. Nên suy nốt cho nhất quán.

## Lập lá số & tứ trụ — XONG (01/08/2026)

4 bài: `menh-cuc` (Cục là gì, con số 2–6, vì sao thiếu Cục thì không an được sao),
`lap-la-so` (quy trình an cung – an Mệnh/Thân – an chính tinh – độ sáng),
`tiet-khi` (24 tiết khí thuộc lịch DƯƠNG, và đó là lúc trụ tháng đổi),
`lap-bat-tu` (trụ năm đổi ở Lập Xuân chứ không ở Tết; Ngũ Thử Độn cho trụ giờ).
Lộ trình mới `lap-la-so-tu-tru`; hub thêm cụm cùng tên (42 chủ đề).

Verify: tsc sạch · vitest 902/902 · build exit 0 · 4/4 bài đạt tiêu đề ≤60 và mô
tả ≤160 trên HTML build · sitemap 42 bài Học · hub đủ 4 thẻ.

**Hai guard bắt lỗi trong đợt này (giữ lại làm kinh nghiệm):**
- `cta-consistency.guard` — nhãn link "lập lá số" bị dùng cho HAI đích (bài Học mới
  và `/onboarding`). Đặt tên link trong bài mới phải tránh trùng nhãn hành động đã
  có. Đã đổi thành "quy trình lập lá số".
- `tool-coverage` bắt đúng một slug bị quên xoá khỏi `PENDING`.

**Việc phát sinh cần kiểm riêng:** repo ghi MÂU THUẪN số lượng sao Tử Vi — chỗ 114,
chỗ 121 (mô tả catalog `/la-so-tu-vi` ghi "121 sao"). Agent viết `lap-la-so` đã cố ý
KHÔNG nêu con số nào vì không biết bên nào đúng. Cần rà và thống nhất một con số.

## Còn lại — 19 bài, lõi riêng từng bài

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

### Đợt 4 — phong thuỷ chuyên sâu — ĐÃ XONG 01/08/2026

4 bài này đã viết và verify, xem mục "Phong thuỷ chuyên sâu — XONG" ở trên.
Bảng chi tiết đã gỡ khỏi đây để agent sau không viết lại lần nữa.

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
