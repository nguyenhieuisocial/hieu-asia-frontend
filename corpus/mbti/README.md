# Corpus — MBTI (loại hình tâm lý) · nội dung nền cho bản đọc sâu

Lớp nội dung nền nâng `/mbti` từ quiz→ra-type thành **bản đọc cá nhân hoá**. Cùng playbook Big Five: nội dung nền (đây) + bản đọc AI (endpoint backend) + UI kết quả.

## Nguồn & licence (QUAN TRỌNG — nhãn hiệu)

- **MBTI®** là nhãn hiệu của The Myers-Briggs Company → **KHÔNG sao chép mô tả 16-type chính thức**. Nội dung ở đây **viết bằng lời hieu.asia**, neo vào **lý thuyết loại hình tâm lý kiểu Jung** (Carl Jung, *Psychological Types* 1921 — khái niệm public-domain) + khung **4 lưỡng cực** + nhóm khí chất phổ biến.
- Nhãn dẫn nguồn: **"_Theo khung loại hình tâm lý (kiểu Jung)_"** — KHÔNG ghi là MBTI® chính thức.
- **Trung thực về độ tín:** MBTI là **khung tự-phản-tỉnh**, validity bị giới khoa học tranh luận (khác Big Five có cơ sở thực nghiệm mạnh). Nội dung khung điều này: xu hướng/sở thích trên một dải, **không phải nhãn cố định**, type có thể đổi.

## Văn phong (bắt buộc)

"Không bói toán": mỗi lưỡng cực = dải sở thích; mô tả **xu hướng + ứng dụng + quyền chủ động**; KHÔNG "bạn LÀ…", KHÔNG đoán số phận.

## Nội dung

- `dichotomies.md` — 8 cực: E/I · S/N · T/F · J/P. Chapter tiền tố chữ cái ("E — Hướng ngoại"…).
- `temperaments.md` — 4 khí chất: NT/NF/SJ/SP.

## Ingest (ux-batch1 đã/đang nạp qua Supabase MCP)

Big Five retrieve deterministic → mình nạp qua MCP với embedding placeholder (không cần service-role). MBTI tương tự. Hoặc lệnh script:

```
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/mbti \
  --source "MBTI (Jung)" --tags mbti,personality --split-by-heading
```

## Reading contract (cho endpoint `/tools/mbti-read` — backend handoff)

**Request:** `{ "type": "INTJ", "axes"?: {...optional strengths}, "displayName"?: "..." }`

**Retrieval (deterministic, filter tag `mbti`):** chọn 4 thẻ cực theo từng chữ của type (chapter bắt đầu bằng chữ đó: I/N/T/J) + 1 thẻ khí chất (suy: có N→NT nếu T / NF nếu F; có S→SJ nếu J / SP nếu P).

**Response:** markdown, giọng mentor, ~500–800 từ, 5 mục: **Chân dung tổng quan / Từng lưỡng cực / Khí chất / Ứng dụng / Lưu ý** (xu hướng không định mệnh; nhắc khung tự-phản-tỉnh). Cuối: "_Cơ sở: khung loại hình tâm lý (kiểu Jung)_".

> ⚠️ **BÀI HỌC BIG FIVE — DÙNG `max_tokens: 8192`** cho Gemini call (model `google/gemini-3.5-flash` qua `callGateway`). Big Five ban đầu set 2048 → Gemini thinking ăn hết budget → `"empty gateway response"`; bump 8192 mới ra bản đọc (PR backend #46). ĐỪNG để 2048.

Model mid-tier (Gemini), rate-limit + KV cache theo type. Part 3 UI: `/mbti` result fetch `${API_BASE}/tools/mbti-read` → render markdown (mirror big-five/xem-tuong).
