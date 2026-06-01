# Corpus Bát Tự — 108 thẻ (Đợt-1, ưu tiên pipeline)

**108 thẻ** = 12 mảng (3 batch). Pipeline báo cáo hiện tính **Bát Tự** → câu retrieve nghiêng Bát Tự → batch **dùng được NGAY** (per steer agent-ingest). Grounding đã LIVE.

| Mảng | File | Thẻ |
|---|---|---|
| Thập Thần (sâu) | `thap-than.md` | 10 |
| Dụng Thần | `dung-than.md` | 6 |
| Cách cục | `cach-cuc.md` | 10 |
| Thập Nhị Trường Sinh | `truong-sinh.md` | 12 |
| Thiên Can | `thien-can.md` | 10 |
| Địa Chi | `dia-chi.md` | 12 |
| Quan hệ Can-Chi | `quan-he-can-chi.md` | 8 |
| Thần Sát | `than-sat.md` | 14 |
| Thập Thần theo thời vận | `van-thap-than.md` | 10 |
| Đại Vận | `dai-van.md` | 5 |
| Lưu Niên | `luu-nien.md` | 5 |
| Tương tác thời vận ↔ nguyên cục | `thoi-van-tuong-tac.md` | 6 |

Pipeline: **cổ thư-grounded + LLM Agent + adversarial-review-fix baked-in**.

## Phân bố nhãn (108 thẻ)
| tier | thẻ | nhãn |
|---|---|---|
| `classical` | ~60 | "Đối chiếu cổ thư" |
| `methodology` | ~45 | "Phương pháp luận hieu.asia" |
| `inference` | ~3 | "Suy luận hieu.asia" |

Cổ thư ref (book-level): Tử Bình Chân Thuyên · Uyên Hải Tử Bình · Trích Thiên Tủy · Cùng Thông Bảo Giám · Tam Mệnh Thông Hội.

> ⚠️ `classical` = ref **BOOK-LEVEL** (đôi khi tên thiên có thật — vd Tử Bình Chân Thuyên có "Luận Thực Thần / Thương Quan / Tài") tới 5 cổ thư public-domain THẬT. **KHÔNG bịa câu trích nguyên văn** (grep verify; vài attribution câu trích đã softened về concept-level). Cards tự hạ methodology khi không chắc. *Nên chuyên gia spot-check.*

## Brand "không bói toán" — adversarial enforce
- fatalism words = **0** (chỉ trong hedge *"KHÔNG phải…"*).
- **Trường Sinh** (Bệnh/Tử/Mộ/Tuyệt) → pha năng lượng.
- **Thần Sát tên dữ** (Kiếp Sát/Vong Thần/Dương Nhận) → marker năng lượng, tự debunk.
- **Xung/Hình/Hại** → động lực ma sát.
- **Thời vận** (rủi ro vận-hạn CAO NHẤT) → "năm/vận tốt-xấu" reframed 100% thành CHỦ ĐỀ năng lượng của giai đoạn + cách ứng xử (*"không phải năm tốt hay xấu: kết quả phụ thuộc cách bạn ứng xử"*); "phạm Thái Tuế"/"Phản Ngâm" = ma sát/lặp năng lượng, KHÔNG phải hạn.

## Ingest (agent upgrade-dot1)
```bash
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/bat-tu --source bat-tu --tags bat-tu,...
```
→ chapter tự = tên mảng (12 chapter). Bát Tự **10 → 108 thẻ**. Per hợp đồng: tag có `bat-tu`, sim ≥0.35. ux-batch1 KHÔNG đụng ingest/retrieval/report.
