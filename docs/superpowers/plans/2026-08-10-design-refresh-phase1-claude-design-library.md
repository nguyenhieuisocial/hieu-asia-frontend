# Design Refresh — Phase 1: Claude Design Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Spec gốc: `docs/superpowers/specs/2026-08-10-site-refresh-program-design.md`. Phase 1 KHÔNG đụng code sản phẩm — chỉ tạo bundle preview HTML + sync lên Claude Design cho founder duyệt bằng mắt.

**Goal:** Bundle ~22 thẻ preview HTML tự chứa trong `design-system/` (repo frontend, ngoài build path của apps), sync lên project mới "hieu.asia Design System" trên claude.ai/design qua DesignSync.

**Token-economy note (founder yêu cầu):** plan này KHÔNG nhúng full HTML của 22 thẻ (viết 1 lần lúc thi công, không viết 2 lần). Plan chốt: template skeleton, giá trị token chính xác, inventory từng thẻ, và quy trình sync.

## Global Constraints

- Mỗi thẻ = 1 file HTML **tự chứa** (inline CSS/SVG, KHÔNG CDN/font ngoài — dùng system-font fallback stack mô phỏng: serif stack cho Newsreader, sans stack cho Be Vietnam Pro, ghi chú tên font thật trên thẻ).
- Dòng ĐẦU TIÊN mỗi file: `<!-- @dsCard group="<Group>" -->` (DesignSync đọc marker này để dựng card index).
- Giá trị màu/chữ/spacing phải khớp CHÍNH XÁC vault 138 + tailwind config (bảng dưới) — thẻ là nguồn sự thật tương lai, sai số = lệch chuẩn ngay từ gốc.
- Phần "tươi mới" (motion, spacing nâng, data-viz chuẩn hoá) là ĐỀ XUẤT THIẾT KẾ trong thẻ — founder duyệt/chê từng nhóm trước khi vào code.
- `design-system/` nằm ngoài mọi build: thêm vào `.gitignore`? KHÔNG — commit vào repo (là tài sản), nhưng không import từ apps/*.

## Token values (nguồn sự thật — trích vault 138, verified 2026-08-10)

```
Day:   bg #F3ECDD (Paper) · text #171411 (Ink) · accent #A47532 (Ochre) · border #CCC0A6
Night: bg #15110C (Charcoal) · text #E8DCC1 (Bone) · accent #D4A261 (Gold-soft) · border #3A3122
Ngũ hành (chip/dataviz only, theme-stable): Kim #7D8A98 · Mộc #6B8154 · Thuỷ #3F5D6F · Hoả #A44A36 · Thổ #A07842
Type scale (px/line/tracking): 88/0.95/-0.02em · 64/1.0/-0.02em · 48/1.05/-0.02em · 32/1.15/-0.01em · 24/1.2/0 · 19/1.45/0 · 16/1.55/0 · 13/1.5/0.02em · 11/1.4/0.12em
Fonts: Newsreader (display serif, 300-800 var + italic) · Be Vietnam Pro (body sans 400-700 + italic). CHỈ 2 font.
Spacing: card 32 · block 48 · section 88 · hero 128
Corners: 2px (editorial). Buttons: serif label, KHÔNG pill.
Motion (ĐỀ XUẤT MỚI — chưa có trong hệ): duration-fast 150ms · duration-base 300ms · duration-slow 500ms · ease-editorial cubic-bezier(0.34,1.56,0.64,1) (đã dùng lẻ tẻ trong code, nay chính thức hoá) · ease-out-soft cubic-bezier(0.25,0.8,0.4,1) · reveal: fade+8px-rise · press: scale(0.98) · LUÔN gate prefers-reduced-motion
```

## Card template skeleton (dùng cho MỌI thẻ)

```html
<!-- @dsCard group="<Group>" -->
<!doctype html><html><head><meta charset="utf-8"><style>
  :root{--bg:#F3ECDD;--fg:#171411;--accent:#A47532;--border:#CCC0A6}
  .night{--bg:#15110C;--fg:#E8DCC1;--accent:#D4A261;--border:#3A3122}
  body{margin:0;font-family:'Be Vietnam Pro',system-ui,sans-serif;background:var(--bg);color:var(--fg)}
  .serif{font-family:'Newsreader',Georgia,serif}
  .panel{padding:32px;border-bottom:1px solid var(--border)}
  /* card-specific styles below */
</style></head><body>
  <div class="panel"><!-- day-mode specimen --></div>
  <div class="panel night"><!-- night-mode specimen --></div>
</body></html>
```

Mỗi thẻ hiện CẢ 2 chế độ sáng/tối trong 1 file (2 panel) — founder so sánh 1 lần.

## Card inventory (22 thẻ, 5 nhóm)

| # | Path | Group | Nội dung |
|---|---|---|---|
| 1 | foundations/colors.html | Foundations | Swatch 2 chế độ + 5 ngũ hành + quy tắc dùng (ngũ hành KHÔNG làm nền) |
| 2 | foundations/type.html | Foundations | Specimen 9 bậc, cả 2 font, chú thích vai trò từng bậc |
| 3 | foundations/spacing.html | Foundations | Nhịp dọc 4 token hiện tại + ĐỀ XUẤT nâng (thêm bậc thoáng hơn cho hero/section theo trục "thoáng+sang") |
| 4 | foundations/motion.html | Foundations | MỚI: bảng duration/easing + demo sống từng primitive (hover-lift, reveal, press, accordion) + khối reduced-motion |
| 5 | components/buttons.html | Components | Primary/secondary/ghost × 2 theme × trạng thái (default/hover/press/focus/disabled) — recipe 2px + serif |
| 6 | components/cards.html | Components | Card editorial, card pricing-tier, card tool-result — 2 theme |
| 7 | components/forms.html | Components | Input/select/Time24-style/radio/checkbox/error state — 2 theme |
| 8 | components/nav-footer.html | Components | Nav desktop+mobile drawer pattern, footer — thu nhỏ tỷ lệ |
| 9 | components/badges-chips.html | Components | Badge KHUYÊN DÙNG, chip ngũ hành, tag trạng thái |
| 10 | components/faq.html | Components | Accordion native details/summary style chuẩn |
| 11 | components/pricing-tier.html | Components | Thẻ giá đầy đủ theo quy tắc vault 138 (serif tier name, ₫ phrase, mid-dot) |
| 12 | components/editorial-list.html | Components | Danh sách số thứ tự mono + heading italic + rule |
| 13 | components/banner-toast.html | Components | Consent banner, locale banner, toast — vị trí + hình thái |
| 14 | components/table.html | Components | Bảng mobile-safe (scroll trong khung, không tràn trang) |
| 15 | dataviz/la-so-12-cung.html | Data-viz | SVG 12 cung chuẩn hoá + caption MỆNH — currentColor 2 theme |
| 16 | dataviz/bat-tu-4-tru.html | Data-viz | 4 trụ can-chi + nhãn — chuẩn mới trực quan hơn |
| 17 | dataviz/ngu-hanh.html | Data-viz | Bars + radar 5 hành dùng đúng 5 hex — 2 theme |
| 18 | dataviz/dai-van-timeline.html | Data-viz | Timeline 10 năm/cung — pattern mới cho trục "trực quan" |
| 19 | illustrations/brand-icons.html | Illustrations | 6 icon hiện có (LaSo/BatTu/DaiVan/DuongDoi/Mbti/ThanSo) vẽ lại inline + đề xuất icon thiếu |
| 20 | patterns/hero.html | Page patterns | Khuôn hero mới (thoáng hơn, motion reveal, anchor lá số) |
| 21 | patterns/tool-page.html | Page patterns | Khuôn trang công cụ chuẩn (phủ ~1.200 trang): breadcrumb/H1/input/result/related |
| 22 | patterns/reading-report.html | Page patterns | Khuôn màn đọc báo cáo (night-first, nhịp đọc dài) |

## Tasks

### Task 1: Scaffold + Foundations (thẻ 1-4)
- [ ] Tạo `design-system/` + viết 4 thẻ Foundations theo template + bảng token trên. Thẻ motion có demo CSS thật (hover/animation inline).
- [ ] Mở từng file bằng browser local xác nhận render đúng 2 panel. Commit `design(ds): foundations cards`.

### Task 2: Components (thẻ 5-14)
- [ ] Viết 10 thẻ Components. Mỗi thẻ: specimen 2 theme, đúng recipe vault 138, phần "tươi" (motion hover, khoảng thở) áp theo thẻ motion/spacing đề xuất.
- [ ] Kiểm render. Commit `design(ds): component cards`.

### Task 3: Data-viz + Illustrations (thẻ 15-19)
- [ ] Viết 5 thẻ. SVG inline, `currentColor` cho theme-aware, 5 hex ngũ hành cứng (theme-stable).
- [ ] Kiểm render. Commit `design(ds): dataviz + illustration cards`.

### Task 4: Page patterns (thẻ 20-22)
- [ ] Viết 3 thẻ khuôn trang (tỷ lệ thu nhỏ, chú thích vùng). Commit `design(ds): page pattern cards`.

### Task 5: Sync lên Claude Design
- [ ] `DesignSync create_project` name "hieu.asia Design System" → lấy projectId.
- [ ] `finalize_plan` writes `["foundations/*.html","components/*.html","dataviz/*.html","illustrations/*.html","patterns/*.html"]`, localDir = `design-system/`.
- [ ] `write_files` theo planId (localPath — nội dung không vào context).
- [ ] `list_files` xác nhận đủ 22 path. Báo founder link claude.ai/design.

### Task 6: Cổng duyệt founder
- [ ] Founder duyệt/chê theo NHÓM. Ghi phản hồi → sửa thẻ → re-sync (chỉ file đổi). Nhóm nào DUYỆT thì Phase 2 (nâng linh kiện code) mới bắt đầu cho nhóm đó — plan Phase 2 viết riêng sau cổng này.
