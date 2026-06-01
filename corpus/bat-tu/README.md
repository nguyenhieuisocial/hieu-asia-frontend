# Corpus Bát Tự — 82 thẻ (Đợt-1, ưu tiên pipeline)

**82 thẻ** = 8 mảng (2 batch). Pipeline báo cáo hiện tính **Bát Tự** → câu retrieve nghiêng Bát Tự → batch **dùng được NGAY** (per steer agent-ingest). Grounding đã LIVE.

| Mảng | File | Thẻ |
|---|---|---|
| Thập Thần (sâu) | `thap-than.md` | 10 (Tỷ Kiên → Kiêu Thần) — thay 10 stopgap cũ |
| Dụng Thần | `dung-than.md` | 6 |
| Cách cục | `cach-cuc.md` | 10 |
| Thập Nhị Trường Sinh | `truong-sinh.md` | 12 |
| Thiên Can | `thien-can.md` | 10 (Giáp → Quý) |
| Địa Chi | `dia-chi.md` | 12 (Tý → Hợi) |
| Quan hệ Can-Chi | `quan-he-can-chi.md` | 8 (hợp/xung/hình/hại/phá) |
| Thần Sát | `than-sat.md` | 14 (Quý Nhân/Đào Hoa/Dịch Mã… + Kiếp Sát/Vong Thần/Dương Nhận) |

Pipeline: **cổ thư-grounded + LLM Agent + adversarial-review-fix baked-in**.

## Phân bố nhãn (82 thẻ)
| tier | thẻ | nhãn |
|---|---|---|
| `classical` | ~46 | "Đối chiếu cổ thư" |
| `methodology` | ~36 | "Phương pháp luận hieu.asia" |

Cổ thư ref (book-level): Tử Bình Chân Thuyên · Uyên Hải Tử Bình · Trích Thiên Tủy · Cùng Thông Bảo Giám · Tam Mệnh Thông Hội.

> ⚠️ `classical` = ref **BOOK-LEVEL** tới 5 cổ thư public-domain THẬT cho concept chúng genuinely định nghĩa (Tử Bình Chân Thuyên = cách cục; Trích Thiên Tủy = Dụng Thần + Can/Chi nature; Tam Mệnh Thông Hội = Thần Sát…). **KHÔNG bịa chương / câu trích** (grep verify; 2 attribution câu trích đã softened về concept-level). Cards tự hạ methodology khi không chắc (vd Bính/Canh). *Nên chuyên gia spot-check trước khi coi là thẩm quyền tuyệt đối.*

## Brand "không bói toán" — adversarial enforce
- fatalism words (tốt số/xấu số/phú quý/nghèo hèn/tai họa) = **0** (chỉ xuất hiện trong câu hedge *"KHÔNG phải…"*).
- Cách đọc định-mệnh-hoá bị DEBUNK ngay trong thẻ.
- **Trường Sinh** (Bệnh/Tử/Mộ/Tuyệt) → pha năng lượng (*"Mộ không phải mồ mả"*, *"Tuyệt như khoảng lặng giữa hai nhịp thở"*).
- **Thần Sát tên dữ** (Kiếp Sát/Vong Thần/Dương Nhận/Cô Thần) → marker năng lượng (*"Kiếp Sát: tên gợi cướp bóc nhưng KHÔNG phải sự kiện thật"*).
- **Xung/Hình/Hại** → động lực ma sát (*"Xung không phải tai họa"*, *"Hình không phải ngục tù/kiện tụng"*).

## Ingest (agent upgrade-dot1)
```bash
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/bat-tu --source bat-tu --tags bat-tu,...
```
→ chapter tự = tên mảng (8 chapter). `thap-than` thay 10 stopgap; 7 mảng còn lại MỚI → Bát Tự **10 → 82 thẻ**. Per hợp đồng: tag có `bat-tu`, sim ≥0.35. ux-batch1 KHÔNG đụng ingest/retrieval/report.
