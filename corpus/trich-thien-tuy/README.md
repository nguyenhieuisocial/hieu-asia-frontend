# Corpus — Trích Thiên Tủy (lớp đối chiếu cổ thư, Bát Tự)

Lớp **`_Đối chiếu cổ thư_`** cho Bát Tự — (1) 10 Thiên Can (nhất là khi đứng làm **Nhật chủ** = "cái tôi" của lá số) và (2) các **nguyên lý nền tảng** khi đọc một lá số. Dẫn nguồn về *Trích Thiên Tủy* (滴天髓).

## Nguồn gốc & liêm chính

- **Bản gốc public-domain:** *Trích Thiên Tủy* trên Wikisource Hán văn — Thiên Can Luận (天干論, `滴天髓/02`) cho thiên can; phần Thông Thần Luận (通神論) cho nguyên lý: Suy Vượng (`/12`), Trung Hòa (`/13`), Thuận Nghịch (`/15`), Địa Chi (`/03`), Tính Tình (`/34`). Tương truyền Lưu Bá Ôn (đời Minh) → hết hạn bản quyền.
- **Không bịa câu cổ thư:** mỗi thẻ nhúng **nguyên văn Hán** = bài tụng tả từng can (lấy từ bản thô `?action=raw`). Bài tụng tả bản chất ngũ hành, không phán họa-phúc → giữ gần nguyên ý.
- **Văn phong "không bói toán":** rút hình tượng & khí chất của can → xu hướng tính cách + cách ứng xử.

## Nội dung

- `thien-can.md` — 10 Thiên Can: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý. Mỗi can = 1 thẻ luận bản chất Nhật chủ.
- `nguyen-ly.md` — 5 nguyên lý nền tảng (Thông Thần Luận): Vượng Suy, Trung Hòa, Thuận Nghịch, Địa Chi, Tính Tình. Mỗi nguyên lý = 1 thẻ — cách ĐỌC lá số cân bằng, không phán mệnh cứng.

## Ingest (việc của upgrade-dot1)

Khuyến nghị `--split-by-heading` (mỗi can = 1 row, chunk sạch → semantic match chính xác hơn; cờ này đã thêm vào script ở PR #97):

```
pnpm -F web tsx scripts/ingest-corpus.ts \
  ../../corpus/trich-thien-tuy \
  --source "Trích Thiên Tủy" \
  --tags bat-tu,classic \
  --split-by-heading
```

Bát Tự retrieve **semantic** (đã live, sim ≥0.35, tag `bat-tu`) → lên thật được ngay sau ingest, không đổi pipeline.
