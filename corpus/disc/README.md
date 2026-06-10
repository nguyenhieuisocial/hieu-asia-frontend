# Corpus — DISC (mô hình hành vi) · nội dung nền cho bản đọc sâu

Nâng `/disc` từ quiz→điểm số thành **bản đọc cá nhân hoá**. Cùng playbook Big Five + MBTI: nội dung nền (đây) + bản đọc AI (endpoint backend) + UI kết quả.

## Nguồn & licence

- Neo vào **mô hình DISC gốc của William Marston** (*Emotions of Normal People*, 1928 — khái niệm miền công cộng). **KHÔNG** sao chép bộ đánh giá thương mại (Wiley Everything DiSC®). Bài quiz hiện dùng là "open-source DiSC short-form" (xem `lib/scoring/disc.ts`).
- Nhãn dẫn nguồn: **"_Theo mô hình DISC (Marston, miền công cộng)_"**.
- Trung thực: DISC đo **cách hành xử** (behavioural style), có thể đổi theo vai trò/môi trường — không phải bản chất cố định, không phải chẩn đoán lâm sàng.

## Văn phong (bắt buộc)

"Không bói toán": mỗi chiều = dải xu hướng hành vi; mô tả **xu hướng + ứng dụng + quyền chủ động**; KHÔNG "bạn LÀ…", KHÔNG đoán số phận. Không đầu nào tốt/xấu hơn.

## Nội dung

- `dimensions.md` — 4 chiều: D (Quyết đoán) · i (Ảnh hưởng) · S (Ổn định) · C (Tuân thủ). Chapter tiền tố chữ cái ("D — Quyết đoán (Dominance)"…).

## Ingest (qua Supabase MCP — như Big Five/MBTI)

DISC retrieve **deterministic** (chọn theo phong cách chính/phụ, không cần embedding thật) → nạp qua MCP `execute_sql` với embedding placeholder `array_fill(0.01::real, array[1536])::vector`. Source `DISC (Marston)`, tags `disc,personality`. Hoặc script:

```
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/disc \
  --source "DISC (Marston)" --tags disc,personality --split-by-heading
```

## Reading contract (cho endpoint `/tools/disc-read` — backend)

**Request:** `{ "scores": { "dominance": 0-100, "influence": 0-100, "steadiness": 0-100, "compliance": 0-100 }, "displayName"?: "..." }`

**Retrieval (deterministic, filter tag `disc`):** backend tự suy **phong cách chính + phụ** (2 chiều điểm cao nhất) → chọn 2 thẻ chiều tương ứng (chapter bắt đầu bằng chữ D/i/S/C).

**Response:** markdown, giọng mentor, ~500–800 từ, các mục: **Chân dung tổng quan / Phong cách chính / Phong cách phụ / Tổ hợp (chính×phụ) / Ứng dụng / Lưu ý** (xu hướng hành vi không phải định mệnh; có thể đổi theo môi trường). Cuối: "_Cơ sở: mô hình DISC (Marston, miền công cộng)_".

> ⚠️ **DÙNG `max_tokens: 8192`** cho Gemini call (`google/gemini-3.5-flash` qua `callGateway`) — bài học Big Five/MBTI: Gemini là model "thinking", max_tokens thấp (2048) → reasoning ăn hết budget → `"empty gateway response"`. ĐỪNG để thấp.

Model mid-tier (Gemini), rate-limit `disc_read` (30/h/IP, key `rl:disc:`) + KV cache theo bộ điểm. Part 3 UI: `/disc` fetch `${API_BASE}/tools/disc-read` → render markdown (mirror big-five/mbti, fallback im lặng).
