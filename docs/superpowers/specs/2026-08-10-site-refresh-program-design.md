# Chương trình Đại tu Giao diện Toàn site — Design Spec

> **Chốt bởi founder 2026-08-10:** cách làm là A ("xây chuẩn trước, phủ theo lớp") nhưng **đích đến là C (đại tu toàn bộ)** — chương trình chỉ hoàn thành khi 100% site khoác chuẩn mới, không trang nào còn diện mạo cũ. Mức thay đổi phải đủ đậm để người dùng quen thuộc nhận ra site đã "lột xác", không phải tinh chỉnh lặt vặt.

## 1. Mục tiêu & phạm vi

**Mục tiêu cuối (terminal state):** toàn bộ ~1.290 trang của hieu.asia (web chính; admin + miniapp KHÔNG thuộc phạm vi đợt này) render qua MỘT hệ thống thiết kế chuẩn hoá duy nhất, được founder duyệt bằng mắt trên Claude Design trước khi hiện thực hoá.

**Hướng thẩm mỹ (chốt bởi founder):** GIỮ nền "Như giấy cũ" (vault 138: bảng màu Paper/Charcoal + Ochre/Gold, 2 font Newsreader + Be Vietnam Pro, góc 2px, màu ngũ hành) làm gốc — nhưng cho phép thay đổi MẠNH về bố cục, thành phần, trải nghiệm theo cả 4 trục:

1. **Hiện đại + sống động** — chuẩn chuyển động mới (micro-interaction, transition tinh tế, CSS-first, tôn trọng `prefers-reduced-motion`)
2. **Thoáng + sang** — nâng nhịp khoảng trắng, bố cục rộng rãi hơn, tinh giản mật độ
3. **Trực quan + nhiều hình** — chuẩn hoá và mở rộng đồ hoạ dữ liệu (lá số 12 cung, bát tự 4 trụ, biểu đồ ngũ hành) + bộ minh hoạ thương hiệu
4. **Chuyên nghiệp + đáng tin** — nhất quán tuyệt đối từng chi tiết (đích: 0 pattern cũ sót lại, đo bằng máy)

## 2. Kiến trúc chương trình — 3 giai đoạn

### Giai đoạn 1 — Thư viện thiết kế trên Claude Design (visual source of truth)

- Tạo project **mới** "hieu.asia Design System" trên claude.ai/design qua DesignSync (project "iFan Design System" hiện có là của sản phẩm khác — không đụng).
- Mỗi thẻ = file HTML preview **tự chứa** (không CDN/lib ngoài), build local rồi sync theo đúng thứ tự bắt buộc của DesignSync: list/read → finalize_plan → write_files.
- Nhóm thẻ (groups):
  - **Foundations** — Colors (day/night + 5 màu ngũ hành), Type (thang 9 bậc), Spacing (nhịp dọc), **Motion** (mới: bộ timing/easing/duration tokens + demo từng primitive)
  - **Components** — Buttons, Cards, Forms/Inputs, Nav + Footer, Badges/Chips, FAQ accordion, Pricing tier, Editorial list, Banner/Toast, Table (mobile-safe)
  - **Data-viz** — Lá số 12 cung, Bát tự 4 trụ, Ngũ hành (bars/radar), Đại vận timeline — chuẩn hoá từ SVG hiện có
  - **Illustrations** — 6 icon thương hiệu hiện có (LaSo, BatTu, DaiVan, DuongDoi, Mbti, ThanSo) + các icon mở rộng cần thêm
  - **Page patterns** — Hero, section rhythm, khuôn trang công cụ (tool-page template), khuôn reading/report, mobile patterns
- **Cổng duyệt:** founder mở claude.ai/design, duyệt/chê TỪNG NHÓM. Giai đoạn 2 chỉ bắt đầu với những nhóm đã duyệt.

### Giai đoạn 2 — Nâng linh kiện trong code

- Đưa token mới vào `packages/config/tailwind-preset.ts` + `apps/web/tailwind.config.ts` + `globals.css` (motion tokens, spacing bổ sung).
- Nâng/bổ sung component dùng chung khớp thẻ đã duyệt.
- **Gộp nợ design cũ vào giai đoạn này** (xoá 3 dự án song song):
  - Task #35 — eyebrow token sweep (419 chỗ an toàn / 32 chỗ xem tay; plan sẵn: `docs/superpowers/plans/2026-08-10-sitewide-eyebrow-token-sweep.md`)
  - Vault 167 T13 — spacing/max-width tokens (mới migrate 32 file)
  - Vault 167 T17 — 13 chỗ hardcode màu + ~120 inline-style tĩnh
- Mỗi cụm = worktree + PR riêng, verify đủ (tsc/lint/build/seo-guard/GitNexus detect_changes + screenshot 2 theme).

### Giai đoạn 3 — Áp toàn site theo 4 đợt (TẤT CẢ đều thuộc phạm vi cam kết — không đợt nào là "tuỳ chọn")

| Đợt | Phạm vi | Ghi chú |
|---|---|---|
| 3a | Phễu: home, /pricing, /features, /about, /methodology, checkout, /onboarding | ~8 trang, tác động doanh thu trực tiếp |
| 3b | Trải nghiệm: /reading, /dashboard, /mentor, /account | Nhiều màn tương tác, cần test kỹ |
| 3c | ~10 khuôn mẫu trang công cụ | Phủ ~1.200 trang templated (tu-vi-*, xem-*, sao-han, ban-menh, hop-tuoi, learn/*, than-so-hoc...) |
| 3d | Mop-up: affiliate, community, changelog, brand, misc | Quét sót — chạy audit máy để tìm |

Mỗi đợt: worktree → PR → verify sống trên production cả 2 theme (screenshot qua Cent Browser thật) → merge-poll tới MERGED → mới sang đợt kế.

## 3. Ràng buộc cứng (mọi PR phải giữ)

1. **Không đổi URL nào** — 1.290 trang giữ nguyên URL/title/description/JSON-LD đã lên top Google; `seo-guard.mjs` 0 vi phạm mới ở mọi PR.
2. **Không lặp 2 lỗi đã ghi sổ:** hreflang không đặt ở layout dùng chung (bug PR #1027); không gọi `cookies()`/`headers()` trong render path (sự cố cache 248 route — cảnh báo trong `i18n/request.ts`).
3. **Performance floor:** không tăng First Load JS đáng kể; chuyển động CSS-first, JS-motion phải lazy; giữ static rendering cho mọi trang đang static; không phá floor `MIN_PAGES=1000` của seo-guard.
4. **A11y:** contrast AA cả 2 theme, focus ring, mọi chuyển động mới tôn trọng `prefers-reduced-motion`, tap target ≥44px.
5. **Quy trình bất biến của repo:** GitNexus impact trước khi sửa symbol, detect_changes trước commit, commit nhỏ theo cụm, không `--amend`, merge-poll đọc tận mắt MERGED.

## 4. Tiêu chí hoàn thành (definition of done cho CẢ chương trình)

1. Founder đã duyệt bằng mắt toàn bộ nhóm thẻ trên Claude Design.
2. **100% trang** render qua hệ chuẩn mới — audit máy (grep pattern cũ: pill/bg-gold, text-[12px]/[13px] eyebrow viết tay, hardcode màu, inline-style tĩnh) = **0 kết quả sót** ngoài danh sách miễn trừ có ghi lý do.
3. Mọi đợt đã verify sống trên production cả 2 theme.
4. Đo sau 2–4 tuần qua PostHog: scroll-depth, bounce, sticky-CTA CTR so với baseline hiện tại (đã có số đo Wave 65).
5. Vault cập nhật: 138 (bổ sung chuẩn mới đã duyệt), 167 (đóng các mục đã gộp), nhật ký 94.

## 5. Ngoài phạm vi (nói rõ để khỏi hiểu lầm)

- Admin (`apps/admin`) + 2 miniapp — đợt sau, chuẩn dùng lại được.
- Trang `/en` — áp chuẩn mới nhưng KHÔNG mở rộng dịch thêm trang (đó là chương trình i18n riêng).
- Đổi nội dung chữ nghĩa/định vị thương hiệu (4 câu sai sự thật trong brand kit là việc riêng đang chờ founder chốt câu chữ).
- Các việc bảo mật 🔴 từ đợt quét vault 2026-08-10 (xoay khoá, sao lưu, hoa hồng) — KHÔNG bị chương trình này chen hàng; chúng vẫn ưu tiên cao hơn và chỉ founder làm được.

## 6. Rủi ro & giảm nhẹ

| Rủi ro | Giảm nhẹ |
|---|---|
| Đại tu làm vỡ SEO đang tốt | Ràng buộc cứng #1 + seo-guard mọi PR + không đổi URL/cấu trúc heading |
| Chuyển động làm nặng trang | CSS-first, lazy JS, đo Lighthouse/First-Load mỗi đợt |
| Lệch chuẩn giữa các đợt (làm lâu) | Thư viện Claude Design là nguồn sự thật duy nhất; mọi PR đối chiếu về thẻ đã duyệt |
| Phạm vi phình (scope creep) | Mọi ý tưởng mới → ghi vào backlog giai đoạn sau, không chen vào đợt đang chạy |
| Founder bận không duyệt kịp | Cổng duyệt theo NHÓM thẻ (không phải từng thẻ) — mỗi lần duyệt ~5-10 phút |
