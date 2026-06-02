# Corpus — Tử Vi Đẩu Số Toàn Thư (lớp đối chiếu cổ thư)

Lớp **`_Đối chiếu cổ thư_`** cho Tử Vi, bổ sung lên trên lớp phương pháp luận (`corpus/tu-vi-sao-cung/`). Mỗi thẻ dẫn nguồn về *Tử Vi Đẩu Số Toàn Thư* — bộ sách nền của Tử Vi Đẩu Số.

## Nguồn gốc & liêm chính

- **Bản gốc public-domain:** *Tử Vi Đẩu Số Toàn Thư* (紫微斗數全書), bản Hán văn trên Wikisource (`zh.wikisource.org/wiki/紫微斗數全書`). Tác giả tương truyền Trần Đoàn (đời Tống), văn bản đời Minh → hết hạn bản quyền.
- **Không bịa câu cổ thư:** mỗi thẻ nhúng **nguyên văn Hán** ở dòng `> Nguyên văn:` (trích đúng từ bản gốc, phần *Chư Tinh Vấn Đáp Luận* 諸星問答論 và *Thái Vi Phú* 太微賦). Bản dịch + phần luận bám sát nguyên văn, kiểm chứng được.
- **Văn phong "không bói toán":** chỉ rút tính chất sao → xu hướng & cách ứng xử; lược/diễn lại các đoạn phán định mệnh, họa-phúc. Bản thân *Thái Vi Phú* cũng dạy: *"thọ yểu hiền ngu, giàu nghèo sang hèn — không thể luận một cách máy móc, vơ đũa cả nắm"* (壽夭賢愚，富貴貧賤，不可一概論議) — đúng tinh thần của hieu.asia.

## Nội dung

- `chinh-tinh.md` — 14 chính tinh (Tử Vi, Thiên Cơ, Thái Dương, Vũ Khúc, Thiên Đồng, Liêm Trinh, Thiên Phủ, Thái Âm, Tham Lang, Cự Môn, Thiên Tướng, Thiên Lương, Thất Sát, Phá Quân). Mỗi sao = 1 thẻ luận tính sao (khí chất → xu hướng).

## Ingest (việc của upgrade-dot1)

Nhãn nguồn user thấy = giá trị `--source` (đặt nhãn CÓ NGHĨA, không để slug):

```
pnpm -F web tsx scripts/ingest-corpus.ts \
  ../../corpus/tu-vi-dau-so-toan-thu \
  --source "Tử Vi Đẩu Số Toàn Thư" \
  --tags tu-vi,classic
```

**Cần xác nhận về retrieval:** các thẻ này là **luận tính SAO** (không gắn cung), nên không khớp kiểu exact-match `<sao> tại cung <cung>` của pipeline Tử Vi hiện tại. Cần upgrade-dot1 xác nhận thẻ `tu-vi,classic` được retrieve theo **semantic** (như các thẻ Bát Tự classical đang chạy), hoặc thêm một lượt match cấp-sao khi sao đó xuất hiện trong lá số.
