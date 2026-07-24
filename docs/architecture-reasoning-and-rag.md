# Sơ đồ luồng: luận giải AI & tra cứu tri thức

Hai luồng "đắt tiền" nhất của hệ thống trước đây chỉ được mô tả bằng chữ, rải rác trong
comment đầu file. Tài liệu này vẽ lại chúng thành sơ đồ để người mới (và người cũ sau vài
tháng) nhìn một cái là biết dữ liệu đi đâu, tiền tiêu ở chỗ nào, và cửa chặn nằm ở đâu.

Sơ đồ dùng cú pháp Mermaid — GitHub, VS Code và hầu hết trình đọc Markdown đều tự vẽ.

Nguồn sự thật là code; nếu sơ đồ lệch code thì code đúng:

- `apps/web/src/app/api/reasoning/tu-vi/full/route.ts` — cửa vào + các cửa chặn
- `apps/web/src/lib/reasoning/tu-vi-graph.ts` — đồ thị Tử Vi (12 cung)
- `apps/web/src/lib/reasoning/bat-tu-graph.ts` — đồ thị Bát Tự (4 trụ)
- `apps/web/src/lib/reasoning/palm-graph.ts` — đồ thị Xem tướng
- `apps/web/src/lib/reasoning/rag.ts` — tra cứu tri thức
- `apps/web/src/lib/reasoning/cost-guard.ts` + `runtime-config.ts` — trần chi phí, nút tắt
- `apps/web/src/lib/edge-config.ts` — nút tắt theo từng tính năng, chế độ bảo trì

---

## 1. Luồng luận giải — từ lúc bấm tới lúc ra bản đọc

Điểm cần nhớ: có **bốn cửa chặn xếp trước mọi lời gọi AI**. Không cửa nào chặn thì tiền
mới bắt đầu tiêu.

```mermaid
flowchart TD
    U["Khách bấm 'Tạo bản đọc'"] --> BOT{"BotID:<br/>máy hay người?"}
    BOT -- "máy" --> R403["403 — dừng"]
    BOT -- "người" --> KILL{"Nút tắt khẩn<br/>killswitch_tuvi<br/>(Edge Config)"}
    KILL -- "đang bật" --> R503["503 + Retry-After — dừng"]
    KILL -- "tắt" --> AUTH{"Đã đăng nhập?"}
    AUTH -- "chưa" --> R401["401 + link đăng nhập — dừng"]
    AUTH -- "rồi" --> QUOTA{"Còn lượt miễn phí?<br/>(1 lượt / 30 ngày)"}
    QUOTA -- "hết" --> RUP["402 — mời nâng cấp"]
    QUOTA -- "còn" --> GUARD{"Trần chi phí ngày<br/>+ nút tắt toàn cục"}
    GUARD -- "vượt trần" --> R402["402/503 — dừng"]
    GUARD -- "trong hạn" --> ROW["Tạo dòng agent_runs<br/>(sổ cái chi phí)"]
    ROW --> GRAPH["Chạy đồ thị luận giải"]
    GRAPH --> SAVE["Lưu bản đọc + tổng chi phí"]
    SAVE --> DONE["Trả kết quả cho khách"]

    ROW -. "Realtime báo tiến độ" .-> DONE
```

### Đồ thị Tử Vi — 12 cung chạy song song

```mermaid
flowchart LR
    START([bắt đầu]) --> P["parse_input<br/>đọc lá số đã tính sẵn"]
    P --> F{"toả ra 12 nhánh<br/>(mỗi cung một nhánh)"}
    F --> A1["analyze_palace · cung 1"]
    F --> A2["analyze_palace · cung 2"]
    F --> AN["… tới cung 12"]
    A1 --> X["cross_reference<br/>đối chiếu chéo các cung"]
    A2 --> X
    AN --> X
    X --> S["synthesize<br/>viết bản đọc cuối"]
    S --> END([xong])

    A1 -. "tra tri thức" .-> RAG[("kho tri thức<br/>reading_corpus")]
    A2 -. "tra tri thức" .-> RAG
    AN -. "tra tri thức" .-> RAG
```

Một cung lỗi **không** làm hỏng cả bài: phần của cung đó thành rỗng và bước đối chiếu chéo
tự xử lý chỗ trống. Chỉ `parse_input` và `synthesize` là hai bước bắt buộc phải thành công.

### Hai đồ thị còn lại (cùng khuôn, ít nhánh hơn)

```mermaid
flowchart LR
    subgraph BT["Bát Tự — 4 trụ"]
        B0([bắt đầu]) --> B1["parse_input"] --> B2{"toả ra 4 trụ"}
        B2 --> B3["analyze_pillar ×4"] --> B4["five_elements_balance"] --> B5["synthesize"] --> B6([xong])
    end
    subgraph PL["Xem tướng — ảnh bàn tay"]
        C0([bắt đầu]) --> C1["parse_input"] --> C2["classify_lines"] --> C3["analyze_lines"] --> C4["synthesize"] --> C5([xong])
    end
```

### Tiền tiêu ở đâu (ước tính một bản đọc Tử Vi)

| Bước | Bậc mô hình | Ước tính |
| --- | --- | --- |
| Tra tri thức (12 lần nhúng) | embedding | ~0,0002 USD |
| Phân tích 12 cung | bậc giữa | ~0,48 USD |
| Đối chiếu chéo | bậc giữa | ~0,06 USD |
| Viết bản đọc cuối | bậc cao | ~1,20 USD |
| **Tổng** | | **~1,74 USD** |

Mỗi bước tự cộng dồn chi phí vào dòng `agent_runs`, nên số liệu trên chỉ là ước tính để
đặt trần — số thật luôn đọc từ sổ cái.

---

## 2. Luồng tra cứu tri thức (RAG)

Có hai nửa tách rời nhau: nạp sách vào kho (chạy tay, thỉnh thoảng) và tra kho (chạy trong
mỗi bản đọc).

```mermaid
flowchart TD
    subgraph NAP["Nạp sách vào kho — chạy tay khi có sách mới"]
        F1["File .md / .txt trong corpus/"] --> F2["Cắt thành đoạn ~500 token<br/>(gối nhau ~50 token)"]
        F2 --> F3["Nhúng từng đoạn thành vector"]
        F3 --> F4[("Bảng reading_corpus<br/>Supabase + pgvector")]
    end

    subgraph TRA["Tra kho — chạy trong mỗi bản đọc"]
        Q1["Nút đồ thị hỏi một câu<br/>(vd 'cung Mệnh, sao Tử Vi')"] --> Q2["Nhúng câu hỏi thành vector"]
        Q2 --> Q3["Gọi hàm retrieve_context<br/>so khớp cosine, lọc theo thẻ"]
        Q3 --> F4
        F4 --> Q4["Trả về k đoạn giống nhất"]
        Q4 --> Q5["Ghép vào lời nhắc gửi cho mô hình"]
    end

    Q3 -. "lỗi mạng / lỗi CSDL" .-> Q6["Bỏ qua phần tra cứu,<br/>vẫn viết bản đọc"]
```

Nguyên tắc quan trọng: **tra cứu hỏng thì bản đọc vẫn ra**, chỉ kém giàu dẫn chứng hơn.
Người gọi bắt lỗi và đi tiếp, không để một lỗi tra cứu chặn cả bài.

Chỉ hàm `retrieve_context` được mở ra ngoài; bảng `reading_corpus` không cấp quyền đọc
trực tiếp cho khách.

---

## 3. Các nút vặn khi có sự cố

Tất cả đọc từ Vercel Edge Config, đổi là có hiệu lực trong ~30 giây, **không cần deploy lại**:

| Khoá | Tác dụng |
| --- | --- |
| `killswitch_tuvi` | Tắt riêng luồng Tử Vi (đắt nhất), Bát Tự và Xem tướng vẫn chạy |
| `killswitch_mentor` | Tắt trò chuyện với Mentor |
| `maintenance_mode` | Chặn toàn site, mọi trang chuyển sang `/maintenance` |
| `reasoning.killSwitch` | Tắt toàn bộ luồng luận giải |
| `reasoning.capUsdPerDayAuthed` | Trần chi phí mỗi ngày cho một tài khoản |
| `reasoning.tierOverride` | Ép mọi lời gọi xuống bậc mô hình rẻ |
