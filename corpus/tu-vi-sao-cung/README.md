# Corpus Tử Vi — 168 thẻ sao×cung (Đợt-1)

**168 thẻ** = 14 chính tinh × 12 cung. Mỗi thẻ luận giải xu hướng/tính cách khi một chính tinh tọa thủ một cung cụ thể (mịn hơn bản per-sao `../tu-vi-chinh-tinh/`).

Soạn bằng pipeline **cổ thư-grounded + LLM Agent + agent-reviewer** (14 draft → 14 review, verify citation honesty + brand). Văn phong hieu.asia "không bói toán": thiên hướng + cách ứng xử, KHÔNG phán định mệnh/họa-phúc.

## Phân bố nhãn (trung thực — chống corpus rác)
| tier | số thẻ | nhãn citation |
|---|---|---|
| `methodology` | 160 | "Phương pháp luận hieu.asia" |
| `inference` | 6 | "Suy luận hieu.asia" |
| `classical` | 2 | "Đối chiếu cổ thư" (vd Thái Vi Phú) |

> Reviewer cố ý **hạ hầu hết về `methodology`** thay vì gắn tên chương cổ thư không xác minh được — đúng nguyên tắc README gốc ("KHÔNG bịa"). Nội dung VẪN neo tri thức cổ học (tinh hệ, Miếu/Vượng/Hãm, hội chiếu) nhưng nhãn = hieu.asia tự biên. Muốn nhiều `classical` thật → cần ingest cổ thư public-domain nguyên bản (Lớp 2, bước sau).

## Cấu trúc
`<cung-slug>.md` = 14 thẻ (`## <Sao> tại cung <Cung>` + dòng `> Nguồn:` + thân). `chapter` = tên cung. Mỗi `##` là 1 đơn vị ≤~1.8k ký tự → chunk per-thẻ được (precision retrieval theo (sao,cung)).

## Ingest (việc của agent upgrade-dot1)
Thay 24 thẻ tạm per-sao (`source=tu-vi-chinh-tinh`) bằng bản này:
```bash
pnpm -F web tsx scripts/ingest-corpus.ts ../../corpus/tu-vi-sao-cung \
  --source tu-vi-sao-cung --tags tu-vi,chinh-tinh
```
→ chapter tự = tên cung. Muốn tag per-cung (khớp retrieval `cung-<tên>`): chạy per-file `--tags tu-vi,cung-<slug>` hoặc nâng chunker derive tag từ chapter (tùy bạn).

⚠️ Per AGENT-LOCKS: **ux-batch1 = content (file này), upgrade-dot1 = ingest**. Mình không đụng ingest/retrieval/report-wiring.
