# Phân tích từ khóa & ưu tiên nội dung SEO — hieu.asia (03/08/2026)

**Nguồn dữ liệu:** (1) Sitemap live hieu.asia (1.021 URL) + cây route `frontend/apps/web/src/app`; (2) Google Suggest tiếng Việt — 15 hạt giống + biến thể a-z, thu về **1.808 cụm truy vấn unique**; (3) Cấu trúc trang chủ 3 đối thủ: tuvi.vn, lichngaytot.com, xemtuong.net. Không có số volume tuyệt đối (chưa có Ahrefs/GSC) — độ ưu tiên xếp theo: mật độ xuất hiện trong Suggest × độ dài đuôi (dễ thắng với site DR thấp) × phù hợp định vị chống mê tín × giá trị phễu về lá số miễn phí.

## Tóm tắt 5 dòng

1. **Kho trang hiện có đã phủ rất rộng** (1.021 URL) — vấn đề chính không phải thiếu trang mà là **title/nội dung chưa khớp đúng cụm từ người dùng gõ** (thiếu modifier "nữ mạng/nam mạng", "online miễn phí", "năm sinh").
2. **Lỗ hổng lớn nhất:** cụm **tử vi 2026 theo can-chi + giới tính** ("tử vi bính dần 2026 nữ mạng", "tử vi quý dậu 1993 năm 2026"...) — chiếm áp đảo Suggest, đuôi dài, cạnh tranh thấp, hieu.asia mới chỉ có 12 trang theo chi.
3. **Vũ khí độc quyền chưa khai thác:** cụm câu hỏi hoài nghi ("thần số học có đúng không", "hợp tuổi có quan trọng không", "tử vi không nhớ giờ sinh") — đúng định vị chống mê tín, gần như không đối thủ nào dám viết thật.
4. **Mùa vụ Q4/2026 phải đón trước 01/11:** sao hạn 2027, tử vi 2027 can-chi, tuổi xông đất Tết Đinh Mùi 2027 (trang 2027 khung đã có, cần mở rộng).
5. **Tuyệt đối không đu theo** con số may mắn/lô đề, giải mã giấc mơ đánh con gì, sim phong thủy, văn khấn cúng sao — dù volume cao, trái định vị thương hiệu.

---

## Bảng từ khóa ưu tiên (~36 cụm)

Ý định: **INF** = tìm hiểu · **TOOL** = tìm công cụ · **TXN** = gần chuyển đổi. Mùa vụ: **EG** = quanh năm · **2026/2027/Tết** = thời điểm.

| # | Cụm từ khóa (đại diện) | Ý định | Mùa vụ | Trang đích | Trạng thái | Ưu tiên | Lý do |
|---|---|---|---|---|---|---|---|
| 1 | tử vi {can-chi} 2026 nữ mạng / nam mạng (60 hoa giáp × 2) | INF | 2026 | /tu-vi-2026/{can-chi} | **CẦN TẠO** (mới có 12 chi) | **P1** | Cụm đuôi dài áp đảo Suggest; đối thủ làm bài báo rời rạc, mình làm programmatic + CTA lá số |
| 2 | lá số tử vi online miễn phí / lập lá số tử vi | TOOL | EG | /la-so-tu-vi | Đã có — tối ưu title | **P1** | Từ khóa phễu lõi; Suggest xác nhận modifier "online", "miễn phí", "trọn đời" |
| 3 | lá số tử vi không biết giờ sinh / không nhớ giờ sinh | TOOL | EG | /tu-vi/rectify | Đã có — tối ưu title + nội dung | **P1** | Ngách gần như KHÔNG có đối thủ làm tool; xuất hiện 4+ biến thể Suggest; rất đúng brand (trung thực về độ bất định) |
| 4 | sao la hầu là gì / sao kế đô / sao thái bạch... (9 sao) | INF | Tết+EG | /sao-han/y-nghia/{sao} | **CẦN TẠO** | **P1** | Suggest dày đặc ("hạn sao kế đô nữ", "sao la hầu là gì"); viết góc giải thích nguồn gốc + phản biện, link tool /sao-han |
| 5 | dâng sao giải hạn có cần không / cúng sao giải hạn | INF | Tết | /cam-nang/dang-sao-giai-han-co-can-khong | Đã có — mở rộng, đón Tết | **P1** | Bài brand-defining; volume bùng nổ tháng Giêng; mình là bên duy nhất trả lời "không cần" có căn cứ |
| 6 | thần số học có đúng không / thần số học lừa đảo | INF | EG | /learn/kiem-chung hoặc bài mới | **CẦN TẠO** | **P1** | Câu hỏi hoài nghi có trong Suggest — người hỏi chính là persona "muốn hiểu mình, ghét mê tín" |
| 7 | hợp tuổi có quan trọng không / không hợp tuổi lấy nhau có sao không / hợp tuổi nhưng khắc mệnh | INF | EG | bài mới (cụm 2-3 bài) | **CẦN TẠO** | **P1** | Suggest nhiều biến thể; intent đau thật (sắp cưới bị cản); dẫn thẳng về /hop-tuoi + /compatibility |
| 8 | sao hạn 2026 các tuổi / sao hạn 2026 nữ mạng | INF | 2026 | /sao-han + /sao-han/{chi} | Đã có — tối ưu title | P1 | Đầu bảng Suggest của seed; thêm biến thể "các tuổi", "nữ/nam mạng" vào title/H2 |
| 9 | tử vi 2026 bính ngọ (năm Bính Ngọ) | INF | 2026 | /tu-vi-2026 | Đã có — tối ưu title "Tử vi năm Bính Ngọ 2026" | P1 | Người dùng gọi 2026 bằng tên can-chi; title hiện chưa chắc chứa "Bính Ngọ" |
| 10 | bát tự là gì / bát tự khác gì tử vi / bát tự hay tử vi đúng hơn | INF | EG | /learn/bat-tu + /so-sanh/tu-vi-vs-bat-tu | Đã có — tối ưu | P1 | "bát tự và tử vi cái nào đúng hơn" có trong Suggest — trang so-sanh của mình sinh ra để trả lời đúng câu này |
| 11 | bát tự online / lá số bát tự free / luận giải bát tự online | TOOL | EG | /la-so-bat-tu | Đã có — tối ưu title | P1 | Tool-seeking, cạnh tranh thấp hơn tử vi nhiều; là sản phẩm lõi thứ 2 |
| 12 | sao hạn 2027 các tuổi | INF | **Q4→Tết 2027** | /sao-han-2027 hoặc mục trong /sao-han | **CẦN TẠO trước 01/11/2026** | **P1** | Suggest đã xuất hiện "sao hạn năm 2027 các tuổi" ngay từ tháng 8; ai index sớm thắng |
| 13 | tử vi 2027 tuổi {chi} / {can-chi} | INF | Q4→2027 | /tu-vi-2027/{chi} | Đã có khung 12 chi — bổ sung nội dung + can-chi | **P1** | Lợi thế đi trước hiếm có (đối thủ chưa làm 2027); nhân bản cách làm mục #1 |
| 14 | tuổi xông đất 2027 / hợp tuổi xông nhà năm 2027 | TXN | Q4→Tết | /xong-dat (+ landing "Tết Đinh Mùi 2027") | Đã có khung — cần bản 2027 | **P1** | Suggest: "hợp tuổi xông đất", "xông nhà năm nay"; cao điểm T12–T2; trang theo năm sinh đã sẵn |
| 15 | mbti test tiếng việt / mbti test miễn phí | TOOL | EG | /mbti, /tu-kiem | Đã có — tối ưu title | P2 | Volume rất lớn nhưng cạnh tranh cao; chỉ cần title đúng "trắc nghiệm MBTI tiếng Việt miễn phí" là ăn được đuôi |
| 16 | thần số học online miễn phí / thần số học ngày sinh | TOOL | EG | /than-so-hoc | Đã có — tối ưu title | P2 | Modifier "online miễn phí" lặp lại khắp Suggest |
| 17 | thần số học năm cá nhân 2026 | INF | 2026 | trang mới trong /than-so-hoc | **CẦN TẠO** | P2 | Có trong Suggest, chưa có trang; tính tự động được → hợp sản phẩm |
| 18 | thần số học mũi tên / biểu đồ ngày sinh | INF | EG | trang mới trong /than-so-hoc | **CẦN TẠO** | P2 | Nhiều biến thể ("mũi tên 123", "biểu đồ ngày sinh và tên"); bổ trợ tool sẵn có |
| 19 | {năm sinh} hợp tuổi gì / {năm sinh} hợp yêu tuổi nào | INF | EG | /hop-tuoi/sinh-nam-{yyyy} | **CẦN TẠO** (hub 1990–2008) | P2 | Suggest dày: "2003 hợp tuổi gì", "1997 hợp tuổi nào", "2005 hợp yêu tuổi nào"; programmatic dễ, phễu về /hop-tuoi |
| 20 | hợp tuổi làm ăn / xem tuổi hợp làm ăn | TXN | EG | /hop-tuoi/business | Đã có — tối ưu title | P2 | Intent giá trị cao (khởi nghiệp/hùn vốn) |
| 21 | tử vi tuần mới 12 con giáp | INF | EG (recurring) | /tu-vi-tuan (chuyên mục) | **CẦN TẠO** (mới có 1 bài lẻ /cam-nang) | P2 | Cả 3 đối thủ sống nhờ recurring content; mình có 1 bài one-off — cần chu kỳ hoá |
| 22 | bát tự dụng thần là gì / bát tự khuyết mộc, khuyết kim / thân vượng nhược | INF | EG | /learn/bat-tu/* (3-5 trang con) | **CẦN TẠO** | P2 | Suggest chuyên sâu bất ngờ nhiều; ai gõ cụm này sắp trả tiền cho luận giải bát tự |
| 23 | bát tự hôn nhân / bát tự cặp đôi | INF→TOOL | EG | landing mới → /compatibility | **CẦN TẠO** | P2 | Ghép sản phẩm compatibility sẵn có với cụm chưa ai làm tử tế |
| 24 | tháng {1-12} là cung gì / cung hoàng đạo các tháng | INF | EG | /cung-hoang-dao/thang-{n} (12 trang) | **CẦN TẠO** | P2 | Câu hỏi định nghĩa, cạnh tranh thấp, internal link về 12 trang cung sẵn có |
| 25 | xem ngày cưới 2026/2027 theo tuổi cô dâu chú rể | TXN | EG+mùa cưới | /xem-ngay/cuoi-hoi | Đã có — tối ưu + biến thể năm | P2 | Suggest: "xem ngày cưới hỏi theo tuổi cô dâu chú rể 2026"; mùa cưới Q4 |
| 26 | xem tuổi làm nhà năm 2027 / 2028 | TXN | Q4 | /xem-tuoi-lam-nha (thêm hub theo năm mục tiêu) | **CẦN TẠO** biến thể năm | P2 | Người dùng tìm theo năm ĐỘNG THỔ chứ không chỉ năm sinh; hiện chỉ có trang theo năm sinh |
| 27 | đặt tên cho con gái/trai sinh năm 2026, 2027 | TXN | 2026-27 | /dat-ten-ngu-hanh/sinh-nam-2026 (+2027) | Đã có 2026 — tạo bản 2027 | P2 | Suggest xác nhận; 2027 gộp vào gói Q4 |
| 28 | tử vi trọn đời có đáng tin không | INF | EG | bài mới (góc phản biện) | **CẦN TẠO** | P2 | "tử vi trọn đời" head-term quá cạnh tranh — đánh bằng góc nghi vấn đúng brand, phễu về lá số |
| 29 | gieo quẻ kinh dịch online / gieo quẻ hỏi việc | TOOL | EG | /gieo-que | Đã có — tối ưu title | P2 | Giữ khung "công cụ chiêm nghiệm/ra quyết định", không đi hướng xin xăm |
| 30 | xem ngày dạm ngõ / xem ngày dọn nhà | TXN | EG | /xem-ngay/dam-ngo (mới), /xem-ngay/nhap-trach (tối ưu) | Nửa có nửa tạo | P3 | Bổ sung 1-2 sự kiện còn thiếu trong bộ /xem-ngay |
| 31 | đặt tên cho con theo thần số học | INF | EG | bài mới nối /dat-ten-ngu-hanh × /than-so-hoc | **CẦN TẠO** | P3 | Cross-product độc đáo, có trong Suggest |
| 32 | đặt tên con trai/gái họ Nguyễn (Trần, Lê...) | TXN | EG | /dat-ten-ngu-hanh/ho-{ten} | **CẦN TẠO** | P3 | Đuôi dài đều đặn; làm sau khi cụm #27 chạy tốt |
| 33 | cung hoàng đạo hôm nay | INF | EG daily | mục daily trong /cung-hoang-dao | **CẦN TẠO** | P3 | Volume lớn nhưng đối thủ mạnh + content daily tốn máy; chỉ làm nếu tự động hoá được như /tu-vi-hom-nay |
| 34 | tháng cô hồn 2026 kiêng gì (góc khoa học) | INF | T8/2026 (NGAY BÂY GIỜ) | /thang-co-hon-2026 | Đã có — refresh + đẩy internal link | P2 | Đang đúng mùa (tháng 7 âm = 8/2026); bài phản biện "kiêng gì là đủ" rất hợp brand |
| 35 | mệnh gì sinh năm {yyyy} / tử vi 2026 mệnh gì | INF | EG | /ban-menh/{yyyy} | Đã có — tối ưu title | P3 | Trang đã phủ 1950–2026; chỉ cần title dạng câu hỏi "Sinh năm X mệnh gì?" |
| 36 | valentine 2027 / thất tịch / ngày lễ tình yêu hợp tuổi | INF | mùa lễ | /valentine-2027, /that-tich-2026 | Đã có — giữ lịch refresh | P3 | Khung đã sẵn, chỉ cần cập nhật đúng nhịp |

---

## (a) Trang ĐÃ CÓ — chỉ cần tối ưu title/nội dung

Nguyên tắc chung: **title hiện tại thiếu đúng các modifier người dùng gõ**. Bổ sung theo công thức: `[Từ khóa chính] + [online/miễn phí hoặc năm] + [nữ mạng/nam mạng nếu áp dụng] — hieu.asia`.

| Trang | Cụm cần khớp |
|---|---|
| /la-so-tu-vi | "lá số tử vi online miễn phí", "lập lá số tử vi" |
| /tu-vi/rectify | "lá số tử vi không biết giờ sinh" ← **ưu tiên cao nhất nhóm này** |
| /la-so-bat-tu, /bat-tu | "bát tự online miễn phí", "luận giải bát tự" |
| /tu-vi-2026 (+/{chi}) | "tử vi năm Bính Ngọ 2026", "+ nữ mạng/nam mạng" |
| /sao-han (+/{chi}) | "sao hạn 2026 các tuổi", "nữ mạng/nam mạng" |
| /than-so-hoc | "thần số học online miễn phí", "theo ngày sinh và tên" |
| /mbti, /tu-kiem | "trắc nghiệm MBTI tiếng Việt miễn phí" |
| /hop-tuoi (+/business) | "xem hợp tuổi vợ chồng theo năm sinh", "hợp tuổi làm ăn" |
| /xem-ngay/cuoi-hoi | "xem ngày cưới theo tuổi cô dâu chú rể 2026/2027" |
| /so-sanh/tu-vi-vs-bat-tu | "bát tự và tử vi cái nào đúng hơn" |
| /cam-nang/dang-sao-giai-han-co-can-khong | "cúng sao giải hạn", "dâng sao giải hạn là gì" |
| /gieo-que | "gieo quẻ kinh dịch online" |
| /ban-menh/{yyyy} | "sinh năm X mệnh gì" |
| /thang-co-hon-2026 | refresh đúng mùa (đang là tháng 8/2026) |

## (b) Lỗ hổng nội dung — VIẾT MỚI (xếp theo độ khó thấp → cao)

1. **Cụm câu hỏi hoài nghi (dễ nhất, không ai cạnh tranh):** "thần số học có đúng không", "hợp tuổi có quan trọng không", "không hợp tuổi lấy nhau có sao không", "tử vi trọn đời có đáng tin", "tử vi dựa vào đâu". ~5-6 bài, mỗi bài phễu về đúng tool tương ứng.
2. **9 trang sao chiếu mệnh** (/sao-han/y-nghia/la-hau, ke-do, thai-bach, van-hon, tho-tu, thuy-dieu, thai-duong, thai-am, moc-duc): nguồn gốc + vì sao không cần cúng giải + CTA xem hạn thật bằng tool.
3. **Programmatic tử vi 2026 theo can-chi × giới** (~120 trang từ dữ liệu sẵn có của engine) — lỗ hổng traffic lớn nhất.
4. **Hub "{năm sinh} hợp tuổi gì"** (1990–2008, ~19 trang programmatic).
5. **12 trang "tháng X là cung gì"**.
6. **Bát tự chuyên sâu:** dụng thần là gì, bát tự khuyết ngũ hành, thân vượng/nhược, bát tự hôn nhân (nối /compatibility).
7. **Thần số học mở rộng:** năm cá nhân 2026, các mũi tên, biểu đồ ngày sinh.
8. **Chuyên mục tử vi tuần** (recurring, tự động hoá từ engine như tu-vi-hom-nay).
9. Bổ sung /xem-ngay: dạm ngõ; cân nhắc "cắt tóc" (đặt khung "quan niệm dân gian", không khẳng định).

## (c) Cụm mùa vụ — lịch đón trước

| Thời điểm xuất bản | Cụm | Trang |
|---|---|---|
| **Ngay (T8/2026)** | tháng cô hồn 2026, rằm tháng 7 góc văn hoá | /thang-co-hon-2026 (refresh) |
| **T9-T10/2026** | mùa cưới: xem ngày cưới cuối 2026 + đầu 2027, xem tuổi cưới 2027 | /xem-ngay/cuoi-hoi, /xem-tuoi-cuoi |
| **Trước 01/11/2026** | sao hạn 2027, tử vi 2027 can-chi, đặt tên con 2027, xem tuổi làm nhà 2027 | tạo mới + mở rộng /tu-vi-2027 |
| **T12/2026** | tuổi xông đất Tết Đinh Mùi 2027, xuất hành 2027, khai trương đầu năm | /xong-dat, /xuat-hanh-2027, /khai-truong |
| **T1-T2/2027** | dâng sao giải hạn (bài phản biện đón sóng), sao hạn từng tuổi | /cam-nang/... + /sao-han-2027 |
| **Quy luật chung** | Cụm "tử vi 20XX" bắt đầu có search từ ~T10 năm trước → mọi trang năm mới phải index trước 01/11 | — |

---

## Top 10 việc làm ngay (xếp hạng)

1. **Tối ưu title/meta ~15 trang tool + trang năm hiện có** theo bảng (a) — công sức thấp nhất, tác động nhanh nhất (mục #2, 3, 8, 9, 10, 11, 15, 16).
2. **Xây programmatic "tử vi 2026 {can-chi} nữ/nam mạng"** (~120 trang) dưới /tu-vi-2026 — lỗ hổng traffic lớn nhất, dữ liệu engine đã có.
3. **Tối ưu /tu-vi/rectify** thành trang đích cho "lá số tử vi không biết giờ sinh" — ngách độc quyền, khớp brand 100%.
4. **Viết 9 trang sao chiếu mệnh** góc giải thích + phản biện, internal link từ /sao-han và 12 trang /sao-han/{chi}.
5. **Viết cụm 5-6 bài câu hỏi hoài nghi** ("...có đúng không", "...có sao không") — content khác biệt duy nhất trên thị trường.
6. **Đóng gói Q4-2026:** sao hạn 2027 + nội dung tử vi 2027 + đặt tên con 2027 + xem tuổi làm nhà 2027; deadline xuất bản 01/11/2026.
7. **Refresh /thang-co-hon-2026 ngay tuần này** (đang giữa mùa) + đẩy internal link từ trang chủ/lịch.
8. **Hub "{năm sinh} hợp tuổi gì"** 1990–2008 → phễu về /hop-tuoi và /compatibility.
9. **Chuyển "tử vi tuần" thành chuyên mục recurring tự động** thay vì bài lẻ trong /cam-nang.
10. **12 trang "tháng X là cung gì"** + cụm bát tự chuyên sâu (dụng thần, khuyết ngũ hành) — làm cuốn chiếu sau khi 1-9 chạy.

## KHÔNG làm (trái định vị chống mê tín)

- **Con số may mắn hôm nay / số đề / xổ số theo tuổi** — cả tuvi.vn và lichngaytot đều sống nhờ cụm này; volume rất lớn nhưng phá nát định vị.
- **Giải mã giấc mơ ("mơ thấy X đánh con gì")** — cụm chủ lực của lichngaytot; tuyệt đối tránh.
- **Bùa, ngải, vật phẩm giải hạn, cúng sao giải hạn (hướng dẫn cách cúng)** — chỉ viết bài PHẢN BIỆN như đang có, không viết bài how-to.
- **Sim phong thủy / số điện thoại hợp tuổi / biển số xe hợp mệnh** — mê tín thương mại hoá.
- **Xin xăm, quẻ xăm Quan Âm/Khổng Minh** (khác với gieo quẻ Kinh Dịch chiêm nghiệm đang có) — không mở rộng sang hướng cầu xin.
- **Bói nốt ruồi, xem tướng đoán vận mệnh kiểu khẳng định** — giữ /xem-tuong và /learn/palm ở khung "quan sát + giải trí có kiểm chứng", không mở cụm nốt ruồi.
- **Xem giờ mất, trùng tang, bốc mộ, an táng** — nhạy cảm, dễ gây hại tâm lý, trái đạo đức thương hiệu.
- **Văn khấn** — không thuộc sản phẩm; nếu muốn phủ văn hoá thì chỉ ở dạng bài giải thích phong tục, không ưu tiên trong 6 tháng tới.

---

*Ghi chú phương pháp: không có số volume tuyệt đối nên ưu tiên dựa trên tần suất/độ phủ trong Google Suggest (proxy của demand), độ dài đuôi (proxy của độ khó), và giá trị phễu. Khi có GSC đủ dữ liệu (sau ~2 tháng traffic tăng), nên chạy lại vòng 2 để hiệu chỉnh bằng số impression thật.*
