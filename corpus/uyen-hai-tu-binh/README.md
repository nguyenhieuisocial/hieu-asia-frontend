# Corpus — Uyên Hải Tử Bình (lớp đối chiếu cổ thư, Bát Tự)

Lớp **`_Đối chiếu cổ thư_`** cho Bát Tự, dẫn nguồn về *Uyên Hải Tử Bình* (淵海子平) — bộ sách nền của Tử Bình.

## Nguồn gốc & liêm chính

- **Bản gốc public-domain:** *Uyên Hải Tử Bình*, bản Hán văn trên Wikisource (`zh.wikisource.org/wiki/淵海子平`). Soạn từ đời Tống–Minh → hết hạn bản quyền.
- **Không bịa câu cổ thư:** mỗi thẻ nhúng **nguyên văn Hán** (`> Nguyên văn:`), lấy từ câu **định nghĩa cấu trúc** của từng Thập Thần (quan hệ sinh-khắc + âm-dương). Lấy từ **bản thô (`?action=raw`)** để verbatim chuẩn.
- **Văn phong "không bói toán":** chỉ rút bản chất thần → xu hướng & cách ứng xử. **Lược bỏ** các câu phán họa-phúc của bản gốc (vd 傷官 "務要傷盡", 劫財 "剋夫", 偏官 "多凶暴") — chỉ trích phần định nghĩa trung tính.

## Nội dung

- `thap-than.md` — 10 Thập Thần: Chính Quan, Thất Sát, Chính Tài, Thiên Tài, Chính Ấn, Thiên Ấn, Thực Thần, Thương Quan, Tỷ Kiên, Kiếp Tài. Mỗi thần = 1 thẻ luận bản chất (năng lượng quan hệ → xu hướng).

## Ingest (việc của upgrade-dot1)

```
pnpm -F web tsx scripts/ingest-corpus.ts \
  ../../corpus/uyen-hai-tu-binh \
  --source "Uyên Hải Tử Bình" \
  --tags bat-tu,classic
```

Bát Tự retrieve theo **semantic** (đã chạy live, ngưỡng sim ≥0.35, tag `bat-tu`) → các thẻ này **lên thật được ngay** sau ingest, không cần đổi pipeline (khác với lớp Tử Vi cấp-sao còn chờ xác nhận retrieval).
