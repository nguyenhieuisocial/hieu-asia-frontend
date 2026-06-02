# Corpus nguồn luận giải — RAG `reading_corpus`

Nội dung nguồn để neo luận giải AI vào tri thức có cơ sở (Trụ A "Sâu & Tin" của big-upgrade). Nạp vào Supabase `reading_corpus` qua `apps/web/scripts/ingest-corpus.ts`; retrieval ở `lib/reasoning/rag.ts` (`retrieveContext`) inject vào prompt mỗi cung/trụ.

## Xuất xứ & bản quyền (QUAN TRỌNG)

Chiến lược hybrid 3 lớp (xem plan `big-upgrade`):

1. **Lớp nền — team-authored (thư mục này):** thẻ diễn giải **do hieu.asia tự biên soạn** (AI-draft, **cần chuyên gia review trước khi bật site-wide**). KHÔNG sao chép nguyên văn sách thương mại → an toàn bản quyền. Nhãn citation: **"Theo phương pháp luận hieu.asia"**.
2. **Lớp uy tín — cổ thư public-domain** (✅ ĐÃ thêm 2026-06-02 — xem mục "Lớp cổ thư" bên dưới): bản gốc cổ văn hết hạn bản quyền (Tử Vi Đẩu Số Toàn Thư, Uyên Hải Tử Bình, Trích Thiên Tủy), tự dịch-diễn giải, **nhúng nguyên văn Hán trong mỗi thẻ để kiểm chứng**. Nhãn: "Đối chiếu cổ thư X".
3. **Lớp cấp phép — chuyên gia** (sau).

⚠️ KHÔNG ingest nguyên văn sách đang bán. Mọi nguồn ghi rõ `license` khi mở rộng schema.

## Cấu trúc

```
corpus/<source-slug>/<chapter>.md
```
- Thư mục con = `source` (slug). File `.md`/`.txt` = `chapter`.
- Mỗi file được chunk ~500 token (≈2000 ký tự), embed `openai/text-embedding-3-small` (1536-dim), upsert vào `reading_corpus`.

Hiện có (STARTER — cần chuyên gia review):
| Source | Nội dung | Tags đề xuất |
|---|---|---|
| `tu-vi-chinh-tinh` | 14 chính tinh Tử Vi (2 tinh hệ) | `tu-vi,chinh-tinh` |
| `bat-tu-thap-than` | 10 Thập Thần Bát Tự | `bat-tu,thap-than` |

### Lớp cổ thư — public-domain, grounded (✅ live 2026-06-02)

Mỗi thẻ nhúng **nguyên văn Hán** (`> Nguyên văn:`) trích từ bản gốc Wikisource/ctext → kiểm chứng được, không bịa câu. Văn phong "không bói toán" (rút bản chất → xu hướng, lược phán họa-phúc). Nhãn citation: **"Đối chiếu cổ thư …"**.

| Source (`--source`) | Nội dung | Tags | Retrieval |
|---|---|---|---|
| `tu-vi-dau-so-toan-thu` | Tử Vi: 14 chính tinh (卷一) + 6 Lục cát / 6 Lục sát / 4 Tứ Hóa (卷二) | `tu-vi,classic` | exact-match `retrieveTuViClassic` (chapter = tên sao) — **ingest `--split-by-heading`** |
| `uyen-hai-tu-binh` | Bát Tự: 10 Thập Thần | `bat-tu,classic` | semantic (sim ≥0.35) |
| `trich-thien-tuy` | Bát Tự: 10 Thiên Can (Nhật chủ) | `bat-tu,classic` | semantic |

```bash
# Tử Vi cổ thư — PHẢI --split-by-heading (chapter = tên sao, khớp exact-match):
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/tu-vi-dau-so-toan-thu \
  --source "Tử Vi Đẩu Số Toàn Thư" --tags tu-vi,classic --split-by-heading

# Bát Tự cổ thư — semantic (khuyến nghị --split-by-heading cho chunk sạch per-mục):
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/uyen-hai-tu-binh \
  --source "Uyên Hải Tử Bình" --tags bat-tu,classic --split-by-heading
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/trich-thien-tuy \
  --source "Trích Thiên Tủy" --tags bat-tu,classic --split-by-heading
```

⚠️ Phụ tinh/Tứ Hóa Tử Vi: thẻ đã sẵn nhưng cần upgrade-dot1 mở `retrieveTuViClassic` để match phụ tinh + Tứ Hóa (xem `tu-vi-dau-so-toan-thu/README.md`).

## Lệnh nạp (cần env)

Yêu cầu: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, và khóa Vercel AI Gateway (cho embed). **Service-role ghi thẳng DB production** — chạy có chủ đích.

```bash
# Dry-run kiểm format trước (vẫn cần env để khởi tạo client):
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/tu-vi-chinh-tinh \
  --source tu-vi-chinh-tinh --tags tu-vi,chinh-tinh --dry-run

# Nạp thật (idempotent — xoá rows cũ cùng source rồi nạp lại):
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/tu-vi-chinh-tinh \
  --source tu-vi-chinh-tinh --tags tu-vi,chinh-tinh

pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/bat-tu-thap-than \
  --source bat-tu-thap-than --tags bat-tu,thap-than
```

## Retrieval (cách corpus được dùng)

- `tu-vi-graph.ts` gọi `retrieveContext({ query, tags: ['tu-vi', 'cung-<tên>'] })` mỗi cung; `bat-tu-graph.ts` tương tự. `filter_tags` khớp **bất kỳ** tag → chunk gắn `tu-vi` được nhận cho mọi truy vấn Tử Vi.
- Miss non-fatal: thiếu corpus → luận giải vẫn chạy bằng kiến thức nền của model (citation-rate thấp, không vỡ).

## Mở rộng tiếp theo
- Tử Vi: phụ tinh (Tả/Hữu, Xương/Khúc, Khôi/Việt, Lộc Tồn…), Tứ Hóa, ý nghĩa 12 cung, đại vận–lưu niên.
- Bát Tự: dụng thần/hỉ kỵ, Thập Nhị Trường Sinh, Thần Sát.
- Lớp cổ thư public-domain + quy trình chuyên gia review (gate chất lượng trước khi bật citation site-wide).
