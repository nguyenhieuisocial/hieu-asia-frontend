# HANDOFF — Promote "Bốn lăng kính" editorial homepage → production

**Từ:** agent `feat/hero-lab-prototype` (hero-lab) · **Cho:** agent/owner đang giữ `app/page.tsx` + homepage waves
**Trạng thái:** Founder ĐÃ DUYỆT promote (chọn "#3"). Cần owner `page.tsx` thực hiện vì file bị khoá (coordination).
**Demo sống (noindex, đã verify):** `/muc-lab/home`

---

## Yêu cầu
Thay hero + flow homepage production bằng homepage **"Bốn lăng kính → AI"** (editorial, SVG/CSS, KHÔNG WebGL) — đã build & verify ở route demo noindex `/muc-lab/home`. Định vị **"editorial decoder, không bói toán"** (research-backed: hero cosmos/WebGL là anti-pattern → branch này đã revert swap cosmos khỏi `page.tsx`, `page.tsx` hiện == main).

## Vì sao (tóm tắt research)
- Reference teardowns (Co-Star/The Pattern/Chani/New Yorker/Atlantic): thắng = editorial + anti-prediction disclaimer; thua = mystical clichés (star-field, tinh vân tím = cosmos).
- Best-practice 2025-26 mobile-first: sample-output & methodology là đòn bẩy convert/trust cao nhất; pricing đầy đủ KHÔNG nên ở homepage.
- Chi tiết: `docs/superpowers/plans/2026-05-30-muc-lab-staging-homepage.md` + research trong transcript.

## Thành phần (đã verify ở /muc-lab/home)
Thứ tự production đề xuất (mobile-first, context-first):
1. **MultiHero** 🆕 — hero "4 lăng kính" SVG/CSS (thay HeroCosmos/HeroV4)
2. **NotOraclesStrip** 🆕 — dải "không đoán số"
3. ScanRow *(reuse; sửa nhẹ copy intent-year: "…đọc chu kỳ thời gian so với lá số gốc")*
4. **Methodology** 🆕 — "show your work" (4 hệ → 1 lời khuyên, số cụ thể)
5. WhyTrust *(reuse)*
6. HowToStart *(reuse)*
7. SampleOutputShowcase + MentorSampleInteractive *(reuse)*
8. **FreeReadingTeaser** 🆕 — nhập ngày sinh → "ví dụ minh hoạ" (có nhãn) + privacy
9. SocialProofQuiet *(reuse)*
10. **MissionNote** 🆕 — founder **ẩn danh** → trust qua sứ mệnh (không tên/ảnh)
11. FaqAccordion *(reuse; +câu "khác gì thầy bói")*
12. **PricingLite** 🆕 — rút gọn + link `/pricing` (thay full PricingTierV2 trên homepage)
13. **Final CTA** 🆕
14. SiteFooter + StickyMobileCta *(reuse)*

## Component MỚI cần relocate (owner quyết vị trí cuối)
Đang ở `app/muc-lab/` (vùng KHÔNG khoá, của hero-lab agent) — owner move vào `components/home/` hoặc `components/marketing/`:
- `app/muc-lab/MultiHero.tsx` + `FourLens.tsx` + `LensGlyphs.tsx` (hero, self-contained)
- `app/muc-lab/home/sections/`: `NotOraclesStrip.tsx`, `Methodology.tsx`, `FreeReadingTeaser.tsx` (client), `MissionNote.tsx`, `PricingLite.tsx`
- Compose tham chiếu: `app/muc-lab/home/page.tsx`

## Lưu ý kỹ thuật (đã xử lý sẵn)
- **Zero dep mới**: muc-lab hero là SVG/CSS thuần. (+deps trên branch này là cho cosmos/hero-lab WebGL ĐÃ BỎ — KHÔNG cần cho promotion.)
- **a11y AA**: nút filled dùng token `--primary-cta` (#8A6128) + `text-primary-foreground` → đạt 5:1. Đúng 1 `<h1>`, 1 `<main>` (đã sửa `<section>`), 0 dead link, focus-visible, reduced-motion-safe, input có label.
- **Brand-voice "không bói toán"**: copy đã rà (bỏ "thời vận/vùng tối/soi/tương lai/tiên tri"); teaser "ví dụ minh hoạ" nhãn rõ (chưa nối AI thật → giữ nhãn hoặc wire AI khi sẵn).
- **Verified Playwright** 360/390/768/1280 + reduced-motion: overflow 0, không layout-jump, tap-target ≥44px.

## Coordination (theo upgrade plan `encapsulated-skipping-tiger.md`)
- `page.tsx`, `components/home/*`, `marketing/*`, `globals.css` = owner-held → **owner apply**.
- Plan gate: homepage/landing changes **SAU wave-64/CMS merge** → owner sequence cho phù hợp.
- Branch `feat/hero-lab-prototype` hiện **không đụng file khoá** (`page.tsx` == main, HeroCosmos đã xoá) → an toàn lấy component, không conflict.
- Founder note: muc-lab demo giữ noindex để đối chiếu cho tới khi promote xong.
