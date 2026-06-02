# Corpus — Tử Vi Đẩu Số Toàn Thư (lớp đối chiếu cổ thư)

Lớp **`_Đối chiếu cổ thư_`** cho Tử Vi, bổ sung lên trên lớp phương pháp luận (`corpus/tu-vi-sao-cung/`). Mỗi thẻ dẫn nguồn về *Tử Vi Đẩu Số Toàn Thư* — bộ sách nền của Tử Vi Đẩu Số.

## Nguồn gốc & liêm chính

- **Bản gốc public-domain:** *Tử Vi Đẩu Số Toàn Thư* (紫微斗數全書), bản Hán văn trên Wikisource (`zh.wikisource.org/wiki/紫微斗數全書`). Tác giả tương truyền Trần Đoàn (đời Tống), văn bản đời Minh → hết hạn bản quyền.
- **Không bịa câu cổ thư:** mỗi thẻ nhúng **nguyên văn Hán** ở dòng `> Nguyên văn:` (trích đúng từ bản gốc, phần *Chư Tinh Vấn Đáp Luận* 諸星問答論 và *Thái Vi Phú* 太微賦). Bản dịch + phần luận bám sát nguyên văn, kiểm chứng được.
- **Văn phong "không bói toán":** chỉ rút tính chất sao → xu hướng & cách ứng xử; lược/diễn lại các đoạn phán định mệnh, họa-phúc. Bản thân *Thái Vi Phú* cũng dạy: *"thọ yểu hiền ngu, giàu nghèo sang hèn — không thể luận một cách máy móc, vơ đũa cả nắm"* (壽夭賢愚，富貴貧賤，不可一概論議) — đúng tinh thần của hieu.asia.

## Nội dung

- `chinh-tinh.md` — 14 chính tinh (Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh, Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân). Từ *Chư Tinh Vấn Đáp Luận* (卷一).
- `phu-tinh.md` — 6 Lục cát (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt) + 6 Lục sát (Kình Dương, Đà La, Hỏa Tinh, Linh Tinh, Địa Không, Địa Kiếp) + 4 Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ). Từ 卷二. Mỗi sao = 1 thẻ; tên thẻ khớp chính tả iztro.

## Ingest (việc của upgrade-dot1)

Nhãn nguồn user thấy = giá trị `--source` (đặt nhãn CÓ NGHĨA). Dùng `--split-by-heading` (PR #97) để mỗi sao = 1 row, `chapter` = tên sao → khớp exact-match `retrieveTuViClassic`:

```
pnpm -F web tsx scripts/ingest-corpus.ts \
  ../../corpus/tu-vi-dau-so-toan-thu \
  --source "Tử Vi Đẩu Số Toàn Thư" \
  --tags tu-vi,classic \
  --split-by-heading
```

**Retrieval:**
- **Chính tinh — ĐÃ LIVE:** `retrieveTuViClassic` (orchestrate, PR #31) exact-match `chapter = <chính tinh>` theo top chính tinh của lá số. ⚠️ Phải ingest `--split-by-heading` (chapter = tên sao bare); re-run size-chunk sẽ phá exact-match (xem `scripts/ingest-corpus.ts`).
- **Phụ tinh / Tứ Hóa — CẦN MỞ retrieval:** thẻ đã sẵn (chapter = tên phụ tinh / tên Tứ Hóa khớp iztro). Cần upgrade-dot1 mở `retrieveTuViClassic` (hoặc lượt riêng) để match **phụ tinh có trong lá số** + **Tứ Hóa qua mutagen** (sao nào hóa Lộc/Quyền/Khoa/Kỵ), giống cách phụ tinh + Tứ Hóa đang được xử ở pipeline chính.
