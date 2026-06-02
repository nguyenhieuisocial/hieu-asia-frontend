# Corpus — Big Five (IPIP) · nội dung nền cho bản đọc sâu

Lớp nội dung nền nâng `/big-five` từ quiz→điểm số thành **bản đọc cá nhân hoá có chiều sâu**. Cùng playbook cổ thư: nội dung nền (đây) + bản đọc AI (endpoint backend) + UI kết quả.

## Nguồn & licence

- **IPIP** (International Personality Item Pool — `ipip.ori.org`) — **public domain** (đã ghi trong `apps/web/src/lib/survey-schema-extended.ts`). Quiz 20 câu = 4 câu/chiều → mức **domain** (chưa tách 30 facet).
- Mô hình Năm Yếu Tố (FFM) — kiến thức nền khoa học, không sao chép văn bản thương mại.
- Nhãn dẫn nguồn user thấy: **"_Theo nghiên cứu Big Five (IPIP)_"**.

## Văn phong (bắt buộc)

"Không bói toán": mỗi chiều là **dải liên tục, không phải hộp/nhãn cố định**; mô tả **xu hướng + biểu hiện + ứng dụng + quyền chủ động**; KHÔNG "bạn LÀ…", KHÔNG đoán số phận; điểm số là lát cắt thời điểm. Trục Neuroticism trình bày trung lập (nhạy ↔ ổn định), không gán "tốt/xấu".

## Nội dung

- `dimensions.md` — 15 thẻ: 5 chiều OCEAN × {tổng quan, cao, thấp}.
- `interactions.md` — 4 thẻ tổ hợp nổi bật (để bản đọc luận theo *pattern* cá nhân).

## Ingest (việc upgrade-dot1)

```
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/big-five \
  --source "Big Five (IPIP)" --tags big-five,personality --split-by-heading
```

## Reading contract (cho endpoint `/tools/bigfive-read` — backend)

**Request:**
```json
{ "scores": { "openness": 0-100, "conscientiousness": 0-100, "extraversion": 0-100,
              "agreeableness": 0-100, "neuroticism": 0-100 },
  "confidence": 0-1, "displayName": "..." }
```

**Retrieval:** mỗi chiều → chọn thẻ `(cao)` nếu điểm ≥ 50, ngược lại `(thấp)`; + thẻ `(tổng quan)` của chiều; + các thẻ tổ hợp khớp pattern (vd cả Openness & Conscientiousness ≥ 50 → "Cởi mở cao × Tận tâm cao"). Lọc theo tags `big-five`.

**Response:** markdown, giọng mentor, ~500–800 từ, 5 mục cố định:
1. **Chân dung tổng quan** — pattern tổng thể (1 đoạn tổng hợp, không liệt kê).
2. **Từng chiều** — đọc điểm CỦA HỌ cho mỗi chiều (neo nội dung nền), 1–2 câu/chiều.
3. **Tổ hợp nổi bật** — 1–2 tương tác đặc trưng nhất của người này.
4. **Ứng dụng** — phát huy thế mạnh / lưu ý điểm mù (cụ thể, không phán).
5. **Lưu ý** — trait là xu hướng không phải định mệnh; ghi chú độ tin nếu `confidence < 0.8`.

Cuối bản đọc: "_Cơ sở: mô hình Big Five (IPIP, public domain)_". Model mid-tier (vd Gemini), cost-guard như các bản đọc khác; nên cache theo bộ điểm để khỏi tính lại.

## Trạng thái

Nội dung nền (Part 1) = ux-batch1 làm. Endpoint (Part 2) + UI kết quả (Part 3) = xem `docs/superpowers/plans/2026-06-02-bigfive-depth-upgrade.md`.
