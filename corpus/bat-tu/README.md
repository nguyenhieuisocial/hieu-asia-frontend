# Corpus Bát Tự — 38 thẻ (Đợt-1, ưu tiên pipeline)

**38 thẻ** = 4 mảng. Pipeline báo cáo hiện tính **Bát Tự** (chưa tính Tử Vi) → câu retrieve nghiêng Bát Tự → đây là batch **dùng được NGAY** (per steer agent-ingest).

| Mảng | File | Thẻ |
|---|---|---|
| Thập Thần (sâu) | `thap-than.md` | 10 (Tỷ Kiên → Kiêu Thần) — thay 10 thẻ stopgap per-thần cũ |
| Dụng Thần | `dung-than.md` | 6 (khái niệm + thân vượng/nhược + điều hậu/thông quan/bệnh-dược) |
| Cách cục | `cach-cuc.md` | 10 (Chính Quan/Thất Sát/Tài/Thực/Thương/Ấn/Lộc-Nhận/Tòng/Hóa) |
| Thập Nhị Trường Sinh | `truong-sinh.md` | 12 (Trường Sinh → Dưỡng) |

Pipeline: **cổ thư-grounded + LLM Agent + adversarial-review-fix baked-in** (4 draft → 4 review đối nghịch, sửa fatalism + citation + generic ngay trong pipeline).

## Phân bố nhãn
| tier | thẻ | nhãn |
|---|---|---|
| `methodology` | 21 | "Phương pháp luận hieu.asia" |
| `classical` | 17 | "Đối chiếu cổ thư" (Tử Bình Chân Thuyên / Uyên Hải Tử Bình / Trích Thiên Tủy / Cùng Thông Bảo Giám) |

> ⚠️ **17 `classical` = ref BOOK-LEVEL tới 4 cổ thư public-domain THẬT** cho concept chúng genuinely định nghĩa (vd Tử Bình Chân Thuyên = sách gốc về cách cục; Trích Thiên Tủy = về Dụng Thần). **KHÔNG bịa tên chương / câu trích cụ thể** (đã grep verify). Khác Tử Vi (mapping sao×cung mang tính diễn giải → hạ hết methodology); Bát Tự giải thích concept CÓ TÊN trong cổ thư → "đối chiếu" hợp lý hơn. *Vẫn nên chuyên gia spot-check trước khi coi là thẩm quyền tuyệt đối.*

## Brand "không bói toán"
Adversarial review enforce: fatalism words (tốt số/xấu số/phú quý/nghèo hèn/tai họa) = **0**. Các cách đọc cũ định-mệnh-hoá được DEBUNK ngay trong thẻ ("Thương Quan phá Quan = xui" → "đó là định mệnh hoá một xu hướng hành vi").
**Trường Sinh** (Bệnh/Tử/Mộ/Tuyệt) reframed 100% thành PHA NĂNG LƯỢNG — mỗi thẻ tự debunk: *"Trường Sinh không liên quan cái chết"*, *"Mộ không phải mồ mả"*, *"Tuyệt như khoảng lặng giữa hai nhịp thở, không phải ngừng thở"*.

## Ingest (agent upgrade-dot1)
```bash
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/bat-tu --source bat-tu --tags bat-tu,...
```
→ chapter tự = tên mảng. `thap-than.md` thay 10 thẻ stopgap; 3 mảng còn lại MỚI → Bát Tự 10 → 38 thẻ. Per hợp đồng: tag có `bat-tu`, sim ≥0.35. ux-batch1 KHÔNG đụng ingest/retrieval/report.
