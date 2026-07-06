# \_metrics — mốc đo "trước/sau" cho UI System Overhaul (note 167)

Snapshot số đo tại từng thời điểm, để **chứng minh cải thiện bằng số** (không nói "should").

- `baseline-2026-07-04.json` — mốc GỐC trước khi thi công (bước S1). Bundle-size
  (HTML/JS/CSS, uncompressed) của 5 trang đại diện đo trên prod.
- Chụp lại bằng: `node scripts/ui-metrics/capture-bundle-baseline.mjs > _metrics/after-<ngày>.json`
- So sánh ở bước **S20 (perf)** — cổng "JS/CSS/HTML giảm rõ vs baseline" (§FF/§II).

Các mốc khác (web-vitals, phễu chuyển đổi) bổ sung khi có quyền PostHog/PageSpeed.
