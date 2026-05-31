# Corpus Tử Vi — 168 thẻ sao×cung (Đợt-1)

**168 thẻ** = 14 chính tinh × 12 cung. Mỗi thẻ luận giải xu hướng/tính cách khi một chính tinh tọa thủ một cung cụ thể (mịn hơn bản per-sao `../tu-vi-chinh-tinh/`).

Soạn bằng pipeline **cổ thư-grounded + LLM Agent + 2 vòng reviewer** (14 draft → 14 review → 12 adversarial review per-cung). Văn phong hieu.asia "không bói toán": thiên hướng + cách ứng xử, KHÔNG phán định mệnh/họa-phúc.

## Phân bố nhãn (trung thực — chống corpus rác)
| tier | số thẻ | nhãn citation |
|---|---|---|
| `methodology` | 162 | "Phương pháp luận hieu.asia" |
| `inference` | 6 | "Suy luận hieu.asia" |
| `classical` | 0 | — |

> **Vòng adversarial review (12 agent per-cung)** đã: (a) sửa **29 thẻ** có fatalism tinh vi mà pass-1 bỏ sót ("không có hồi kết", "hiếm khi đổ sụp", "an vui bền vững khi Miếu", "xung đột khó tránh"…); (b) **hạ cả 2 thẻ `classical` → `methodology`** (citation "Thái Vi Phú" không xác minh chắc → an toàn, KHÔNG bịa). Corpus giờ 100% nhãn tự-biên (methodology/inference) — VẪN neo tri thức cổ học (tinh hệ, Miếu/Vượng/Hãm, hội chiếu) nhưng KHÔNG claim cổ thư chưa verify. Muốn `classical` thật → ingest cổ thư public-domain nguyên bản (Lớp 2, bước sau).

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
