# Corpus Tử Vi phụ tinh + Tứ Hóa — 22 thẻ (Đợt-1)

**22 thẻ** = 4 mảng. Mở rộng bộ Tử Vi (ngoài 14 chính tinh × 12 cung = 168 ở `../tu-vi-sao-cung/`) sang **phụ tinh + Tứ Hóa** — khớp pipeline Tử Vi (`tuvi-v2` → sao×cung) đang dựng.

| Mảng | File | Thẻ |
|---|---|---|
| Tứ Hóa | `tu-hoa.md` | 4 (Hóa Lộc/Quyền/Khoa/Kỵ) |
| Lục cát tinh | `luc-cat.md` | 6 (Tả Phụ/Hữu Bật/Văn Xương/Văn Khúc/Thiên Khôi/Thiên Việt) |
| Lục sát tinh | `luc-sat.md` | 6 (Kình Dương/Đà La/Hỏa Tinh/Linh Tinh/Địa Không/Địa Kiếp) |
| Phụ tinh khác | `phu-tinh-khac.md` | 6 (Lộc Tồn/Thiên Mã/Hồng Loan/Thiên Hỉ/Thiên Hình/Thiên Diêu) |

Pipeline: **cổ thư-grounded + LLM Agent + adversarial-review-fix baked-in**.

## Nhãn: 22/22 `methodology`
Nhất quán với `tu-vi-sao-cung/` (0 classical) — luận giải Tử Vi mang tính diễn giải → KHÔNG claim "đối chiếu cổ thư" tránh overclaim. Nội dung VẪN neo tri thức cổ học (Tử Vi Đẩu Số Toàn Thư) nhưng nhãn = hieu.asia tự biên (trung thực). (Cũng = 0 rủi ro fabricated-quote.)

## Brand "không bói toán" — adversarial enforce (mảng rủi ro CAO)
- **Lục sát** (Kình Dương/Không Kiếp…) disaster words (đổ máu/phá sản/tai nạn/mất trắng/hỏa hoạn) = **0** → marker năng lượng xung kích/biến động/buông-bỏ + cách chuyển hóa thành sức bật.
- **Hóa Kỵ** reframed: *"không phải sao xấu/thất bại, mà là bản đồ chỉ nơi cần đầu tư nhận thức cao hơn"*.
- **Thiên Diêu** moral words (dâm/sa đọa) = **0**; **Thiên Hình** (tù tội/kiện tụng/hình thương) = **0** → xu hướng năng lượng (sức hút/kỷ luật), KHÔNG phán đạo đức/sự kiện.
- Sao tốt (Lục cát/Hóa Lộc) KHÔNG over-promise (*"không đảm bảo chắc chắn có người cứu — là xu hướng"*).

## Ingest (agent upgrade-dot1)
```bash
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/tu-vi-phu-tinh --source tu-vi-phu-tinh --tags tu-vi,...
```
→ chapter = tên mảng (4 chapter). Khớp pipeline Tử Vi sao×cung. ux-batch1 KHÔNG đụng ingest/retrieval/report.
