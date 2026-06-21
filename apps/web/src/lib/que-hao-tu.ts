// hieu.asia — Hào từ (爻辞) NGUYÊN VĂN 384 hào (64 quẻ × 6) Chu Dịch + phiên âm + nghĩa.
//
// Đào sâu tầng grounding (cùng tinh thần que-thoan-tu.ts): mỗi HÀO ĐỘNG khi gieo
// quẻ sẽ dẫn được LỜI HÀO cổ thật, không phải lời tự đoán. Dùng cho:
//   - kết quả /gieo-que (hào động → lời hào tương ứng),
//   - phần "Sáu hào" trên trang ý nghĩa quẻ /gieo-que/y-nghia/[slug].
//
// NGUỒN nguyên văn (chữ Hán): Wikisource tiếng Trung — zh.wikisource.org/wiki/周易/<quẻ>
//   (văn bản cổ ~Tây Chu, PHẠM VI CÔNG CỘNG; lấy NGUYÊN BYTE, parse deterministic,
//   không qua mô hình → 0 rủi ro sai chữ khi trích). 384 dòng khớp số (64×6).
// PHIÊN ÂM Hán-Việt + DIỄN NGHĨA: sinh có kiểm (1 agent/quẻ, schema ràng buộc;
//   giữ NGUYÊN han từ nguồn, chỉ phiên âm/diễn nghĩa là sinh) — CÔNG CỤ ĐỌC,
//   nên có thầy Kinh Dịch rà tinh khi có điều kiện.
// 用九/用六 (Càn/Khôn) ở HAO_TU_EXTRA. id khớp King Wen của que-kinh-dich.ts.

export interface HaoTuLine {
  /** Vị trí hào 1..6 (1 = hào đáy). */
  line: number;
  /** Nhãn hào cổ điển (初九, 六二, 上九…). */
  label: string;
  /** Nguyên văn chữ Hán (爻辞) — phạm vi công cộng. */
  han: string;
  /** Phiên âm Hán-Việt. */
  hanViet: string;
  /** Diễn nghĩa tiếng Việt ngắn, trung thành. */
  nghia: string;
}

export interface HaoTuExtra {
  label: string;
  han: string;
  hanViet: string;
  nghia: string;
}

export const HAO_TU_SOURCE =
  'Nguyên văn Hào từ (爻辞) — Chu Dịch (Kinh Dịch), văn bản cổ thuộc phạm vi công cộng (đối chiếu Wikisource).';

/** 6 hào từ theo id quẻ (King Wen 1..64). */
export const HAO_TU: Record<number, HaoTuLine[]> = {
  1: [
    { line: 1, label: '初九', han: '潛龍勿用。', hanViet: 'Tiềm long vật dụng.', nghia: 'Rồng còn ẩn dưới sâu, chưa nên hành động. Lúc thời cơ chưa tới, nên giữ mình chờ đợi, không vội thi thố.' },
    { line: 2, label: '九二', han: '見龍在田，利見大人。', hanViet: 'Hiện long tại điền, lợi kiến đại nhân.', nghia: 'Rồng đã hiện trên ruộng đồng, có lợi khi gặp được bậc đại nhân. Tài năng bắt đầu lộ ra, nên tìm người hiền giúp đỡ.' },
    { line: 3, label: '九三', han: '君子終日乾乾，夕惕若；厲，无咎。', hanViet: 'Quân tử chung nhật càn càn, tịch dịch nhược; lệ, vô cữu.', nghia: 'Người quân tử suốt ngày gắng sức không nghỉ, đến tối vẫn lo lắng đề phòng; tuy có nguy nhưng không lỗi lầm.' },
    { line: 4, label: '九四', han: '或躍在淵，无咎。', hanViet: 'Hoặc dược tại uyên, vô cữu.', nghia: 'Như rồng có khi nhảy vọt lên, có khi còn ở vực sâu; tùy thời tiến lui, không lỗi lầm.' },
    { line: 5, label: '九五', han: '飛龍在天，利見大人。', hanViet: 'Phi long tại thiên, lợi kiến đại nhân.', nghia: 'Rồng bay trên trời, có lợi khi gặp bậc đại nhân. Đạt đến vị trí cao quý, thời thịnh vượng nhất.' },
    { line: 6, label: '上九', han: '亢龍，有悔。', hanViet: 'Kháng long, hữu hối.', nghia: 'Rồng bay quá cao, có điều hối tiếc. Lên đến cực điểm thì sẽ suy, nên biết dừng đúng lúc.' },
  ],
  2: [
    { line: 1, label: '初六', han: '履霜，堅冰至。', hanViet: 'lý sương, kiên băng chí.', nghia: 'Giẫm lên sương, băng dày sắp tới. Thấy dấu hiệu nhỏ phải lường trước hậu quả lớn.' },
    { line: 2, label: '六二', han: '直方大，不習无不利。', hanViet: 'trực phương đại, bất tập vô bất lợi.', nghia: 'Ngay thẳng, vuông vức, rộng lớn; không cần tập luyện mà không gì là không lợi.' },
    { line: 3, label: '六三', han: '含章，可貞。或從王事，无成有終。', hanViet: 'hàm chương, khả trinh. hoặc tòng vương sự, vô thành hữu chung.', nghia: 'Ngậm giữ vẻ đẹp tài năng, có thể giữ chính bền. Hoặc theo việc của vua, không nhận công đầu mà vẫn có kết cục tốt.' },
    { line: 4, label: '六四', han: '括囊，无咎无譽。', hanViet: 'quát nang, vô cữu vô dự.', nghia: 'Thắt chặt miệng túi, không lỗi cũng không khen. Kín đáo giữ mình để tránh tai họa.' },
    { line: 5, label: '六五', han: '黃裳，元吉。', hanViet: 'hoàng thường, nguyên cát.', nghia: 'Xiêm màu vàng, rất tốt lành. Giữ đức trung hậu, khiêm nhường ở ngôi giữa thì cát.' },
    { line: 6, label: '上六', han: '龍戰于野，其血玄黃。', hanViet: 'long chiến vu dã, kỳ huyết huyền hoàng.', nghia: 'Rồng đánh nhau nơi đồng nội, máu chảy đen vàng. Âm cực thịnh tranh với dương, hai bên đều tổn thương.' },
  ],
  3: [
    { line: 1, label: '初九', han: '磐桓，利居貞，利建侯。', hanViet: 'Bàn hoàn, lợi cư trinh, lợi kiến hầu.', nghia: 'Còn ngần ngừ chưa tiến; nên giữ vững chính đạo, nên lập người giúp việc (dựng chư hầu).' },
    { line: 2, label: '六二', han: '屯如邅如，乘馬班如，匪寇婚媾，女子貞不字，十年乃字。', hanViet: 'Truân như chiên như, thừa mã ban như, phỉ khấu hôn cấu, nữ tử trinh bất tự, thập niên nãi tự.', nghia: 'Khó khăn quanh quẩn, cưỡi ngựa đi rồi lại dừng; không phải giặc mà là đến cầu hôn. Người con gái giữ trinh chưa nhận lời, mười năm sau mới thành đôi.' },
    { line: 3, label: '六三', han: '即鹿无虞，惟入于林中，君子幾不如舍，往吝。', hanViet: 'Tức lộc vô ngu, duy nhập vu lâm trung, quân tử cơ bất như xả, vãng lận.', nghia: 'Đuổi hươu mà không có người dẫn đường, chỉ đi sâu vào rừng. Người quân tử biết cơ nên thôi, đi tiếp thì gặp tiếc hận.' },
    { line: 4, label: '六四', han: '乘馬班如，求婚媾，往，吉无不利。', hanViet: 'Thừa mã ban như, cầu hôn cấu, vãng, cát vô bất lợi.', nghia: 'Cưỡi ngựa đi rồi lại dừng, đi cầu hôn; tiến tới thì tốt lành, không gì là không lợi.' },
    { line: 5, label: '九五', han: '屯其膏；小貞吉，大貞凶。', hanViet: 'Truân kỳ cao; tiểu trinh cát, đại trinh hung.', nghia: 'Ân huệ bị ngưng đọng khó ban ra; giữ chính trong việc nhỏ thì tốt, làm việc lớn thì hung.' },
    { line: 6, label: '上六', han: '乘馬班如，泣血漣如。', hanViet: 'Thừa mã ban như, khấp huyết liên như.', nghia: 'Cưỡi ngựa đi rồi lại dừng, khóc đến chảy máu mắt ròng ròng.' },
  ],
  4: [
    { line: 1, label: '初六', han: '發蒙，利用刑人，用說桎梏，以往吝。', hanViet: 'phát mông, lợi dụng hình nhân, dụng thoát chất cốc, dĩ vãng lận.', nghia: 'Mở mang sự mông muội, nên dùng phép tắc để răn người, để cởi bỏ gông cùm; nhưng cứ thế tiến tới thì gặp tiếc hận.' },
    { line: 2, label: '九二', han: '包蒙吉，納婦吉，子克家。', hanViet: 'bao mông cát, nạp phụ cát, tử khắc gia.', nghia: 'Bao dung kẻ mông muội thì tốt, nạp vợ thì tốt; con cái có thể đảm đương việc nhà.' },
    { line: 3, label: '六三', han: '勿用取女，見金夫，不有躬，无攸利。', hanViet: 'vật dụng thủ nữ, kiến kim phu, bất hữu cung, vô du lợi.', nghia: 'Chớ cưới người con gái này; thấy người đàn ông có tiền thì không giữ được mình, không có gì lợi.' },
    { line: 4, label: '六四', han: '困蒙，吝。', hanViet: 'khốn mông, lận.', nghia: 'Bị vây khốn trong sự mông muội, đáng tiếc.' },
    { line: 5, label: '六五', han: '童蒙，吉。', hanViet: 'đồng mông, cát.', nghia: 'Mông muội ngây thơ như trẻ thơ biết thuận theo dạy bảo, tốt lành.' },
    { line: 6, label: '上九', han: '擊蒙，不利為寇，利禦寇。', hanViet: 'kích mông, bất lợi vi khấu, lợi ngự khấu.', nghia: 'Trừng trị sự mông muội; không nên đi gây hại như giặc cướp, mà nên phòng chống giặc cướp.' },
  ],
  5: [
    { line: 1, label: '初九', han: '需于郊，利用恆，无咎。', hanViet: 'nhu vu giao, lợi dụng hằng, vô cữu.', nghia: 'Chờ đợi ở ngoài đồng xa. Lợi ở việc giữ lòng kiên định bền bỉ, không có lỗi.' },
    { line: 2, label: '九二', han: '需于沙，小有言，終吉。', hanViet: 'nhu vu sa, tiểu hữu ngôn, chung cát.', nghia: 'Chờ đợi nơi bãi cát. Hơi có lời tiếng dị nghị, nhưng rốt cuộc được tốt lành.' },
    { line: 3, label: '九三', han: '需于泥，致寇至。', hanViet: 'nhu vu nê, trí khấu chí.', nghia: 'Chờ đợi nơi bùn lầy, chuốc lấy giặc cướp kéo đến.' },
    { line: 4, label: '六四', han: '需于血，出自穴。', hanViet: 'nhu vu huyết, xuất tự huyệt.', nghia: 'Chờ đợi nơi máu me hiểm nguy, phải thoát ra khỏi hang hốm.' },
    { line: 5, label: '九五', han: '需于酒食，貞吉。', hanViet: 'nhu vu tửu thực, trinh cát.', nghia: 'Chờ đợi trong rượu và thức ăn. Giữ chính bền thì tốt lành.' },
    { line: 6, label: '上六', han: '入于穴，有不速之客三人來，敬之終吉。', hanViet: 'nhập vu huyệt, hữu bất tốc chi khách tam nhân lai, kính chi chung cát.', nghia: 'Vào trong hang. Có ba người khách không mời mà đến; kính trọng họ thì rốt cuộc được tốt lành.' },
  ],
  6: [
    { line: 1, label: '初六', han: '不永所事，小有言，終吉。', hanViet: 'bất vĩnh sở sự, tiểu hữu ngôn, chung cát.', nghia: 'Không kéo dài việc tranh tụng; tuy có chút lời qua tiếng lại, nhưng cuối cùng tốt lành.' },
    { line: 2, label: '九二', han: '不克訟，歸而逋，其邑人三百戶无眚。', hanViet: 'bất khắc tụng, quy nhi bô, kỳ ấp nhân tam bách hộ vô sảnh.', nghia: 'Tranh tụng không thắng được, lui về lánh đi; ấp nhỏ ba trăm nhà nên không gặp tai vạ.' },
    { line: 3, label: '六三', han: '食舊德，貞厲，終吉。或從王事，无成。', hanViet: 'thực cựu đức, trinh lệ, chung cát. Hoặc tòng vương sự, vô thành.', nghia: 'Giữ ăn lộc cũ, dẫu chính bền vẫn có nguy, nhưng cuối cùng tốt. Nếu theo việc của vua thì không nên nhận lấy thành công cho riêng mình.' },
    { line: 4, label: '九四', han: '不克訟，復即命渝，安貞吉。', hanViet: 'bất khắc tụng, phục tức mệnh du, an trinh cát.', nghia: 'Tranh tụng không thắng; quay về thuận theo mệnh lý, đổi lòng, giữ yên chính bền thì tốt.' },
    { line: 5, label: '九五', han: '訟，元吉。', hanViet: 'tụng, nguyên cát.', nghia: 'Xử việc tranh tụng được công bằng, cả lớn đều tốt lành.' },
    { line: 6, label: '上九', han: '或錫之鞶帶，終朝三褫之。', hanViet: 'hoặc tích chi bàn đái, chung triêu tam sỉ chi.', nghia: 'Dẫu được ban thưởng đai lớn nhờ thắng kiện, thì chỉ trong một buổi sáng cũng bị tước đoạt mấy lần; vinh quang ấy không bền.' },
  ],
  7: [
    { line: 1, label: '初六', han: '師出以律，否臧，凶。', hanViet: 'Sư xuất dĩ luật, phủ tang, hung.', nghia: 'Quân ra trận phải có kỷ luật; nếu kỷ luật không nghiêm thì hung.' },
    { line: 2, label: '九二', han: '在師中吉，无咎；王三錫命。', hanViet: 'Tại sư trung cát, vô cữu; vương tam tích mệnh.', nghia: 'Ở trong quân giữ đạo trung chính thì tốt, không lỗi; nhà vua ba lần ban mệnh khen thưởng.' },
    { line: 3, label: '六三', han: '師或輿尸，凶。', hanViet: 'Sư hoặc dư thi, hung.', nghia: 'Quân có khi chở xác về, hung.' },
    { line: 4, label: '六四', han: '師左次，无咎。', hanViet: 'Sư tả thứ, vô cữu.', nghia: 'Quân lui đóng về bên trái (rút lui giữ thế), không lỗi.' },
    { line: 5, label: '六五', han: '田有禽，利執言，无咎。長子帥師，弟子輿尸，貞凶。', hanViet: 'Điền hữu cầm, lợi chấp ngôn, vô cữu. Trưởng tử suất sư, đệ tử dư thi, trinh hung.', nghia: 'Ngoài đồng có cầm thú phá hoại, nên ra lệnh đánh bắt thì không lỗi. Để con trưởng thống lĩnh quân thì được; nếu giao cho kẻ kém (con thứ) thì chở xác về, giữ vậy ắt hung.' },
    { line: 6, label: '上六', han: '大君有命，開國承家，小人勿用。', hanViet: 'Đại quân hữu mệnh, khai quốc thừa gia, tiểu nhân vật dụng.', nghia: 'Bậc đại quân ban mệnh lệnh, luận công phong nước lập nhà; nhưng kẻ tiểu nhân thì chớ dùng (vào việc lớn).' },
  ],
  8: [
    { line: 1, label: '初六', han: '有孚，比之，无咎。有孚盈缶，終來有它，吉。', hanViet: 'Hữu phu, tỷ chi, vô cữu. Hữu phu doanh phữu, chung lai hữu tha, cát.', nghia: 'Có lòng thành tín mà gần gũi, thân phụ với nhau thì không lỗi. Lòng thành đầy ắp như rượu đầy vò, rốt cuộc còn có cái phúc bất ngờ đến, tốt.' },
    { line: 2, label: '六二', han: '比之自內，貞吉。', hanViet: 'Tỷ chi tự nội, trinh cát.', nghia: 'Thân phụ, gần gũi từ bên trong mà ra; giữ chính bền thì tốt.' },
    { line: 3, label: '六三', han: '比之匪人。', hanViet: 'Tỷ chi phỉ nhân.', nghia: 'Thân phụ, gần gũi nhầm phải kẻ không đáng (không phải người tốt).' },
    { line: 4, label: '六四', han: '外比之，貞吉。', hanViet: 'Ngoại tỷ chi, trinh cát.', nghia: 'Gần gũi, thân phụ với người bên ngoài; giữ chính bền thì tốt.' },
    { line: 5, label: '九五', han: '顯比。王用三驅，失前禽，邑人不誡，吉。', hanViet: 'Hiển tỷ. Vương dụng tam khu, thất tiền cầm, ấp nhân bất giới, cát.', nghia: 'Thân phụ một cách quang minh chính đại. Vua đi săn vây ba mặt, thả con thú chạy phía trước, người trong ấp không phải đề phòng kinh sợ, tốt.' },
    { line: 6, label: '上六', han: '比之无首，凶。', hanViet: 'Tỷ chi vô thủ, hung.', nghia: 'Gần gũi, thân phụ mà không có người đứng đầu (không khởi đầu cho đúng), xấu.' },
  ],
  9: [
    { line: 1, label: '初九', han: '復自道，何其咎，吉。', hanViet: 'phục tự đạo, hà kỳ cữu, cát.', nghia: 'Trở lại theo đúng đường của mình, có lỗi gì đâu, tốt lành.' },
    { line: 2, label: '九二', han: '牽復，吉。', hanViet: 'khiên phục, cát.', nghia: 'Cùng nhau dắt nhau trở về, tốt lành.' },
    { line: 3, label: '九三', han: '輿說輻，夫妻反目。', hanViet: 'dư thoát bức, phu thê phản mục.', nghia: 'Xe tuột mất nan hoa, vợ chồng trở mặt nhau.' },
    { line: 4, label: '六四', han: '有孚，血去惕出，无咎。', hanViet: 'hữu phu, huyết khứ dịch xuất, vô cữu.', nghia: 'Có lòng thành tín, máu được trừ đi, lo sợ tan biến, không lỗi.' },
    { line: 5, label: '九五', han: '有孚攣如，富以其鄰。', hanViet: 'hữu phu luyến như, phú dĩ kỳ lân.', nghia: 'Có lòng thành tín ràng buộc gắn bó, đem sự giàu có chia cùng láng giềng.' },
    { line: 6, label: '上九', han: '既雨既處，尚德載，婦貞厲，月幾望，君子征凶。', hanViet: 'ký vũ ký xử, thượng đức tải, phụ trinh lệ, nguyệt cơ vọng, quân tử chinh hung.', nghia: 'Mưa đã rơi đã tạnh, đức được chứa đầy chở nặng, vợ giữ chính bền vẫn có nguy; trăng gần tròn; người quân tử nếu tiến lên thì hung.' },
  ],
  10: [
    { line: 1, label: '初九', han: '素履，往无咎。', hanViet: 'tố lý, vãng vô cữu.', nghia: 'Đi theo lối mộc mạc, giản dị; cứ bước tới thì không có lỗi.' },
    { line: 2, label: '九二', han: '履道坦坦，幽人貞吉。', hanViet: 'lý đạo thản thản, u nhân trinh cát.', nghia: 'Đường đi bằng phẳng thênh thang; người ẩn dật giữ vững chính đạo thì tốt lành.' },
    { line: 3, label: '六三', han: '眇能視，跛能履，履虎尾，咥人，凶。武人為于大君。', hanViet: 'miễu năng thị, bả năng lý, lý hổ vĩ, điệt nhân, hung. vũ nhân vi vu đại quân.', nghia: 'Chột mắt mà tưởng thấy rõ, què chân mà tưởng đi được; giẫm lên đuôi hổ, bị cắn, hung. Kẻ võ biền liều lĩnh muốn làm vua lớn.' },
    { line: 4, label: '九四', han: '履虎尾，愬愬終吉。', hanViet: 'lý hổ vĩ, sách sách chung cát.', nghia: 'Giẫm lên đuôi hổ, biết sợ hãi cẩn trọng thì cuối cùng được tốt lành.' },
    { line: 5, label: '九五', han: '夬履，貞厲。', hanViet: 'quải lý, trinh lệ.', nghia: 'Bước đi quyết đoán cương quyết; dù giữ chính đạo vẫn có điều nguy.' },
    { line: 6, label: '上九', han: '視履考祥，其旋元吉。', hanViet: 'thị lý khảo tường, kỳ toàn nguyên cát.', nghia: 'Xem xét lại đường đã đi, suy xét điềm lành dữ; nếu vẹn toàn thì rất tốt.' },
  ],
  11: [
    { line: 1, label: '初九', han: '拔茅茹以其彙，征吉。', hanViet: 'Bạt mao nhự dĩ kỳ vị, chinh cát.', nghia: 'Nhổ rễ cỏ tranh kéo theo cả khóm cùng loại; tiến lên thì tốt.' },
    { line: 2, label: '九二', han: '包荒。用馮河，不遐遺；朋亡。得尚于中行。', hanViet: 'Bao hoang. Dụng bằng hà, bất hà di; bằng vong. Đắc thượng vu trung hành.', nghia: 'Bao dung chốn hoang vu. Dám lội sông không thuyền, không bỏ sót nơi xa; không kết bè cánh riêng. Được phù hợp với đạo trung chính.' },
    { line: 3, label: '九三', han: '无平不陂，无往不復，艱貞无咎。勿恤其孚，于食有福。', hanViet: 'Vô bình bất pha, vô vãng bất phục, gian trinh vô cữu. Vật tuất kỳ phu, vu thực hữu phúc.', nghia: 'Không phẳng nào mà chẳng nghiêng, không đi nào mà chẳng trở lại; giữ chính trong gian khó thì không lỗi. Chớ lo về lòng thành, trong ăn ở vẫn có phúc.' },
    { line: 4, label: '六四', han: '翩翩，不富以其鄰；不戒以孚。', hanViet: 'Phiên phiên, bất phú dĩ kỳ lân; bất giới dĩ phu.', nghia: 'Phấp phới bay xuống, chẳng giàu mà vẫn cùng láng giềng; không răn bảo mà vẫn lấy lòng thành tin nhau.' },
    { line: 5, label: '六五', han: '帝乙歸妹，以祉，元吉。', hanViet: 'Đế Ất quy muội, dĩ chỉ, nguyên cát.', nghia: 'Vua Đế Ất gả em gái, nhờ đó được phúc, rất tốt lành.' },
    { line: 6, label: '上六', han: '城復于隍，勿用師，自邑告命，貞吝。', hanViet: 'Thành phục vu hoàng, vật dụng sư, tự ấp cáo mệnh, trinh lận.', nghia: 'Thành lở đổ xuống hào; chớ dùng binh, từ trong ấp ban ra mệnh lệnh; giữ chính vẫn đáng tiếc hối tiếc.' },
  ],
  12: [
    { line: 1, label: '初六', han: '拔茅茹以其彙，貞吉。亨。', hanViet: 'bạt mao như dĩ kỳ vị, trinh cát. Hanh.', nghia: 'Nhổ cỏ tranh kéo theo cả chùm rễ; giữ vững chính đạo thì tốt, hanh thông. Bậc quân tử khi thời bế tắc nên rút lui cùng đồng loại, giữ tiết tháo.' },
    { line: 2, label: '六二', han: '包承，小人吉，大人否。亨。', hanViet: 'bao thừa, tiểu nhân cát, đại nhân bĩ. Hanh.', nghia: 'Bao dung vâng chịu: kẻ tiểu nhân thì tốt, người quân tử thì gặp bế tắc nhưng vẫn hanh thông. Quân tử không hùa theo a dua dù thời thế bất lợi.' },
    { line: 3, label: '六三', han: '包羞。', hanViet: 'bao tu.', nghia: 'Ôm chứa điều xấu hổ. Ở thời bĩ mà bất chính, vị không xứng, mang nỗi nhục trong lòng.' },
    { line: 4, label: '九四', han: '有命，无咎，疇離祉。', hanViet: 'hữu mệnh, vô cữu, trù li chỉ.', nghia: 'Có mệnh trời (theo lẽ phải mà hành), không lỗi; những người cùng chí hướng đều được hưởng phúc. Thời bĩ bắt đầu chuyển, hành động thuận mệnh thì không sai.' },
    { line: 5, label: '九五', han: '休否，大人吉。其亡其亡，繫于苞桑。', hanViet: 'hưu bĩ, đại nhân cát. Kỳ vong kỳ vong, hệ vu bao tang.', nghia: 'Chấm dứt cảnh bế tắc, bậc đại nhân được tốt lành. Luôn nhắc \'sắp mất, sắp mất\' để phòng giữ, như buộc vào gốc dâu cho thật vững chắc.' },
    { line: 6, label: '上九', han: '傾否，先否後喜。', hanViet: 'khuynh bĩ, tiên bĩ hậu hỉ.', nghia: 'Lật đổ thế bĩ; trước bế tắc, sau vui mừng. Bĩ cực đến cùng thì xoay sang thái, gian nan qua đi thì có niềm vui.' },
  ],
  13: [
    { line: 1, label: '初九', han: '同人于門，無咎。', hanViet: 'đồng nhân vu môn, vô cữu.', nghia: 'Hòa đồng với người ở ngoài cửa (rộng rãi, công khai, không thiên vị), không lỗi.' },
    { line: 2, label: '六二', han: '同人于宗，吝。', hanViet: 'đồng nhân vu tông, lận.', nghia: 'Chỉ hòa đồng trong phạm vi họ hàng phe nhóm của mình, hẹp hòi, đáng tiếc.' },
    { line: 3, label: '九三', han: '伏戎于莽，升其高陵，三歲不興。', hanViet: 'phục nhung vu mãng, thăng kỳ cao lăng, tam tuế bất hưng.', nghia: 'Phục binh nơi bụi rậm, lại trèo lên gò cao dò xét; nhưng ba năm vẫn không dám dấy động.' },
    { line: 4, label: '九四', han: '乘其墉，弗克，攻吉。', hanViet: 'thừa kỳ dung, phất khắc, công cát.', nghia: 'Trèo lên tường thành định tấn công nhưng không thắng nổi; biết dừng quay về lẽ phải nên được tốt lành.' },
    { line: 5, label: '九五', han: '同人，先號啕而后笑。大師克相遇。', hanViet: 'đồng nhân, tiên hào đào nhi hậu tiếu. Đại sư khắc tương ngộ.', nghia: 'Người hòa đồng trước kêu khóc sau cười: phải dùng đại quân chiến thắng mới được gặp nhau.' },
    { line: 6, label: '上九', han: '同人于郊，無悔。', hanViet: 'đồng nhân vu giao, vô hối.', nghia: 'Hòa đồng với người nơi đồng nội xa xôi; tuy chưa trọn chí lớn nhưng không có gì hối hận.' },
  ],
  14: [
    { line: 1, label: '初九', han: '无交害，匪咎，艱則无咎。', hanViet: 'vô giao hại, phỉ cữu, gian tắc vô cữu.', nghia: 'Chưa dính líu điều hại, không có lỗi; nếu giữ lòng cẩn trọng nơi gian khó thì không lỗi.' },
    { line: 2, label: '九二', han: '大車以載，有攸往，无咎。', hanViet: 'đại xa dĩ tải, hữu du vãng, vô cữu.', nghia: 'Dùng xe lớn để chở, có nơi để đi tới, không có lỗi.' },
    { line: 3, label: '九三', han: '公用亨于天子，小人弗克。', hanViet: 'công dụng hanh vu thiên tử, tiểu nhân phất khắc.', nghia: 'Bậc công hầu dâng hiến, được thông đạt lên thiên tử; kẻ tiểu nhân không làm nổi việc ấy.' },
    { line: 4, label: '九四', han: '匪其彭，无咎。', hanViet: 'phỉ kỳ bành, vô cữu.', nghia: 'Không phô trương quá thịnh, biết tự kiềm chế thì không có lỗi.' },
    { line: 5, label: '六五', han: '厥孚交如，威如；吉。', hanViet: 'quyết phu giao như, uy như; cát.', nghia: 'Lấy lòng thành tín mà giao tiếp, lại có oai nghiêm; được tốt lành.' },
    { line: 6, label: '上九', han: '自天佑之，吉无不利。', hanViet: 'tự thiên hựu chi, cát vô bất lợi.', nghia: 'Được trời phù trợ, tốt lành, không gì là không lợi.' },
  ],
  15: [
    { line: 1, label: '初六', han: '謙謙君子，用涉大川，吉。', hanViet: 'khiêm khiêm quân tử, dụng thiệp đại xuyên, cát.', nghia: 'Người quân tử khiêm tốn lại càng khiêm tốn; nhờ vậy mà vượt qua được sông lớn, tốt lành.' },
    { line: 2, label: '六二', han: '鳴謙，貞吉。', hanViet: 'minh khiêm, trinh cát.', nghia: 'Đức khiêm tốn lộ ra bên ngoài; giữ vững chính đạo thì tốt.' },
    { line: 3, label: '九三', han: '勞謙君子，有終吉。', hanViet: 'lao khiêm quân tử, hữu chung cát.', nghia: 'Người quân tử có công lao mà vẫn khiêm nhường; giữ được đến cùng nên tốt lành.' },
    { line: 4, label: '六四', han: '无不利，撝謙。', hanViet: 'vô bất lợi, huy khiêm.', nghia: 'Không gì là không lợi; phát huy và biểu lộ đức khiêm tốn.' },
    { line: 5, label: '六五', han: '不富，以其鄰，利用侵伐，无不利。', hanViet: 'bất phú, dĩ kỳ lân, lợi dụng xâm phạt, vô bất lợi.', nghia: 'Không cậy giàu mà vẫn được láng giềng theo về; lợi cho việc dùng binh chinh phạt, không gì là không lợi.' },
    { line: 6, label: '上六', han: '鳴謙，利用行師，征邑國。', hanViet: 'minh khiêm, lợi dụng hành sư, chinh ấp quốc.', nghia: 'Đức khiêm tốn nổi danh; lợi cho việc cất quân, chinh phạt ấp nước của chính mình.' },
  ],
  16: [
    { line: 1, label: '初六', han: '鳴豫，凶。', hanViet: 'Minh dự, hung.', nghia: 'Khoe khoang vui sướng ra mặt, dẫn đến điều hung.' },
    { line: 2, label: '六二', han: '介于石，不終日，貞吉。', hanViet: 'Giới vu thạch, bất chung nhật, trinh cát.', nghia: 'Cứng vững như đá, không đợi hết ngày đã sớm quyết định; giữ chính bền thì tốt lành.' },
    { line: 3, label: '六三', han: '盱豫，悔。遲有悔。', hanViet: 'Hu dự, hối. Trì hữu hối.', nghia: 'Ngước nhìn người trên cầu vui, sẽ hối tiếc; chần chừ chậm trễ cũng có điều hối tiếc.' },
    { line: 4, label: '九四', han: '由豫，大有得。勿疑。朋盍簪。', hanViet: 'Do dự, đại hữu đắc. Vật nghi. Bằng hạp trâm.', nghia: 'Niềm vui do mình mà ra, được lớn. Chớ nghi ngại; bạn bè tụ về quây quần như trâm cài.' },
    { line: 5, label: '六五', han: '貞疾，恆不死。', hanViet: 'Trinh tật, hằng bất tử.', nghia: 'Giữ chính trong cảnh bệnh tật khó khăn, lâu dài vẫn không đến nỗi mất.' },
    { line: 6, label: '上六', han: '冥豫，成有渝，无咎。', hanViet: 'Minh dự, thành hữu du, vô cữu.', nghia: 'Mê đắm trong vui sướng tối tăm, nhưng nếu đã thành mà biết thay đổi thì không lỗi.' },
  ],
  17: [
    { line: 1, label: '初九', han: '官有渝，貞吉。出門交有功。', hanViet: 'Quan hữu du, trinh cát. Xuất môn giao hữu công.', nghia: 'Chức vị có thay đổi, giữ chính bền thì tốt. Ra khỏi cửa giao tiếp rộng thì có kết quả.' },
    { line: 2, label: '六二', han: '系小子，失丈夫。', hanViet: 'Hệ tiểu tử, thất trượng phu.', nghia: 'Ràng buộc với kẻ nhỏ thì mất bậc trượng phu.' },
    { line: 3, label: '六三', han: '系丈夫，失小子。隨，有求得利，居貞。', hanViet: 'Hệ trượng phu, thất tiểu tử. Tùy, hữu cầu đắc lợi, cư trinh.', nghia: 'Ràng buộc với bậc trượng phu thì mất kẻ nhỏ. Đi theo mà cầu thì được lợi, nên ở yên giữ chính.' },
    { line: 4, label: '九四', han: '隨有獲，貞凶。有孚在道，以明，何咎。', hanViet: 'Tùy hữu hoạch, trinh hung. Hữu phu tại đạo, dĩ minh, hà cữu.', nghia: 'Đi theo mà có thu hoạch, dù giữ chính cũng có hung. Giữ lòng thành nơi đạo lý, sáng tỏ thì có lỗi gì.' },
    { line: 5, label: '九五', han: '孚于嘉，吉。', hanViet: 'Phu vu gia, cát.', nghia: 'Thành tín nơi điều tốt đẹp, tốt lành.' },
    { line: 6, label: '上六', han: '拘系之，乃從維之。王用亨于西山。', hanViet: 'Câu hệ chi, nãi tùng duy chi. Vương dụng hanh vu tây sơn.', nghia: 'Trói buộc giữ chặt lấy, rồi lại theo mà ràng thêm. Vua dùng lễ tế ở núi phía tây.' },
  ],
  18: [
    { line: 1, label: '初六', han: '幹父之蠱，有子考，无咎，厲終吉。', hanViet: 'cán phụ chi cổ, hữu tử khảo, vô cữu, lệ chung cát.', nghia: 'Sửa việc đổ nát do cha để lại; có con đảm đương thì cha không lỗi. Tuy gặp nguy nhưng cuối cùng tốt lành.' },
    { line: 2, label: '九二', han: '幹母之蠱，不可貞。', hanViet: 'cán mẫu chi cổ, bất khả trinh.', nghia: 'Sửa việc đổ nát do mẹ để lại; chớ nên cứng cỏi giữ chính quá mức, cần mềm mỏng uyển chuyển.' },
    { line: 3, label: '九三', han: '幹父之蠱，小有悔，无大咎。', hanViet: 'cán phụ chi cổ, tiểu hữu hối, vô đại cữu.', nghia: 'Sửa việc đổ nát do cha để lại; tuy có chút hối tiếc nhưng không lỗi lớn.' },
    { line: 4, label: '六四', han: '裕父之蠱，往見吝。', hanViet: 'dụ phụ chi cổ, vãng kiến lận.', nghia: 'Dung túng để mặc việc đổ nát của cha; cứ thế đi tới sẽ gặp điều đáng tiếc, hổ thẹn.' },
    { line: 5, label: '六五', han: '幹父之蠱，用譽。', hanViet: 'cán phụ chi cổ, dụng dự.', nghia: 'Sửa việc đổ nát do cha để lại; làm được nên đáng khen, được tiếng tốt.' },
    { line: 6, label: '上九', han: '不事王侯，高尚其事。', hanViet: 'bất sự vương hầu, cao thượng kỳ sự.', nghia: 'Không màng phụng sự vương hầu; giữ chí cao thượng, lấy đức hạnh của mình làm điều đáng quý.' },
  ],
  19: [
    { line: 1, label: '初九', han: '咸臨，貞吉。', hanViet: 'hàm lâm, trinh cát.', nghia: 'Cùng nhau tiến tới giám lâm; giữ chính bền thì tốt lành.' },
    { line: 2, label: '九二', han: '咸臨，吉无不利。', hanViet: 'hàm lâm, cát vô bất lợi.', nghia: 'Cùng nhau tiến tới giám lâm; tốt lành, không gì là không lợi.' },
    { line: 3, label: '六三', han: '甘臨，无攸利。既憂之，无咎。', hanViet: 'cam lâm, vô du lợi. ký ưu chi, vô cữu.', nghia: 'Lấy ngọt ngào lấy lòng mà giám lâm, không có gì lợi. Nhưng đã biết lo lắng sửa mình thì không lỗi.' },
    { line: 4, label: '六四', han: '至臨，无咎。', hanViet: 'chí lâm, vô cữu.', nghia: 'Giám lâm đến mức chí thành tận tâm, không có lỗi.' },
    { line: 5, label: '六五', han: '知臨，大君之宜，吉。', hanViet: 'tri lâm, đại quân chi nghi, cát.', nghia: 'Lấy trí tuệ mà giám lâm, đó là điều thích hợp của bậc quân vương lớn, tốt lành.' },
    { line: 6, label: '上六', han: '敦臨，吉无咎。', hanViet: 'đôn lâm, cát vô cữu.', nghia: 'Lấy đức dày dặn đôn hậu mà giám lâm, tốt lành, không có lỗi.' },
  ],
  20: [
    { line: 1, label: '初六', han: '童觀，小人无咎，君子吝。', hanViet: 'đồng quán, tiểu nhân vô cữu, quân tử lận.', nghia: 'Cái nhìn nông cạn như trẻ con; với kẻ tầm thường thì không có lỗi, nhưng với người quân tử thì đáng tiếc, hổ thẹn.' },
    { line: 2, label: '六二', han: '窺觀，利女貞。', hanViet: 'khuy quán, lợi nữ trinh.', nghia: 'Nhìn lén qua khe cửa, tầm nhìn hạn hẹp; chỉ hợp với sự giữ mình bền chính của người nữ.' },
    { line: 3, label: '六三', han: '觀我生，進退。', hanViet: 'quán ngã sinh, tiến thoái.', nghia: 'Xem xét đời sống và hành vi của chính mình để quyết định nên tiến hay nên lui.' },
    { line: 4, label: '六四', han: '觀國之光，利用賓于王。', hanViet: 'quán quốc chi quang, lợi dụng tân vu vương.', nghia: 'Chiêm ngưỡng sự rạng rỡ tốt đẹp của nước; nên làm khách được nhà vua trọng dụng.' },
    { line: 5, label: '九五', han: '觀我生，君子无咎。', hanViet: 'quán ngã sinh, quân tử vô cữu.', nghia: 'Tự xét đời sống và đức hạnh của mình; người quân tử làm vậy thì không có lỗi.' },
    { line: 6, label: '上九', han: '觀其生，君子无咎。', hanViet: 'quán kỳ sinh, quân tử vô cữu.', nghia: 'Xem xét đời sống và hành vi của người khác (cùng tự soi mình); người quân tử như vậy thì không có lỗi.' },
  ],
  21: [
    { line: 1, label: '初九', han: '屨校滅趾，无咎。', hanViet: 'lũ giảo diệt chỉ, vô cữu.', nghia: 'Mang gông cùm vào chân, che mất ngón chân. Không lỗi (hình phạt nhẹ buổi đầu để răn, tránh lỗi lớn).' },
    { line: 2, label: '六二', han: '噬膚滅鼻，无咎。', hanViet: 'phệ phu diệt tị, vô cữu.', nghia: 'Cắn vào da thịt mềm, ngập mất mũi. Không lỗi.' },
    { line: 3, label: '六三', han: '噬臘肉，遇毒；小吝，无咎。', hanViet: 'phệ tích nhục, ngộ độc; tiểu lận, vô cữu.', nghia: 'Cắn miếng thịt khô ướp, gặp phải độc; hơi đáng tiếc, nhưng không lỗi.' },
    { line: 4, label: '九四', han: '噬乾胏，得金矢，利艱貞，吉。', hanViet: 'phệ can chí, đắc kim thỉ, lợi gian trinh, cát.', nghia: 'Cắn miếng thịt khô còn xương, được mũi tên đồng; lợi ở việc giữ chính bền trong gian khó. Tốt lành.' },
    { line: 5, label: '六五', han: '噬乾肉，得黃金，貞厲，无咎。', hanViet: 'phệ can nhục, đắc hoàng kim, trinh lệ, vô cữu.', nghia: 'Cắn miếng thịt khô, được vàng ròng; giữ chính mà vẫn nên thận trọng đề phòng. Không lỗi.' },
    { line: 6, label: '上九', han: '何校滅耳，凶。', hanViet: 'hà giảo diệt nhĩ, hung.', nghia: 'Mang gông nặng trên cổ, che mất tai. Hung (không chịu nghe lời răn, hình phạt nặng).' },
  ],
  22: [
    { line: 1, label: '初九', han: '賁其趾，舍車而徒。', hanViet: 'bí kỳ chỉ, xả xa nhi đồ.', nghia: 'Tô điểm ngón chân (bước đi của mình); bỏ xe mà đi bộ. Giữ liêm khiết, thà đi chân chứ không nhận xe không chính đáng.' },
    { line: 2, label: '六二', han: '賁其須。', hanViet: 'bí kỳ tu.', nghia: 'Tô điểm bộ râu. Râu nương theo cằm mà động; ý nói trang sức phải đi theo bản chất, không tự mình tách riêng.' },
    { line: 3, label: '九三', han: '賁如濡如，永貞吉。', hanViet: 'bí như nhu như, vĩnh trinh cát.', nghia: 'Vẻ tô điểm tươi nhuận, óng ả. Cứ giữ chính bền lâu thì tốt lành, chớ vì được tô điểm mà buông lơi đạo chính.' },
    { line: 4, label: '六四', han: '賁如皤如，白馬翰如，匪寇婚媾。', hanViet: 'bí như bà như, bạch mã hàn như, phỉ khấu hôn cấu.', nghia: 'Tô điểm mà trắng trong giản dị, ngựa trắng phi như bay. Người đến chẳng phải giặc cướp mà là cầu hôn phối.' },
    { line: 5, label: '六五', han: '賁於丘園，束帛戔戔，吝，終吉。', hanViet: 'bí ư khâu viên, thúc bạch tiên tiên, lận, chung cát.', nghia: 'Tô điểm nơi gò vườn (chốn ẩn dật), lễ vật lụa bó ít ỏi mọn. Tuy có chỗ đáng tiếc hổ thẹn, nhưng cuối cùng được tốt lành.' },
    { line: 6, label: '上九', han: '白賁，无咎。', hanViet: 'bạch bí, vô cữu.', nghia: 'Tô điểm bằng sắc trắng (mộc mạc, không màu mè). Trở về sự giản dị tự nhiên nên không lỗi.' },
  ],
  23: [
    { line: 1, label: '初六', han: '剝牀以足，蔑貞凶。', hanViet: 'bác sàng dĩ túc, miệt trinh hung.', nghia: 'Bóc giường từ chân giường; phá bỏ sự chính bền, hung.' },
    { line: 2, label: '六二', han: '剝牀以辨，蔑貞凶。', hanViet: 'bác sàng dĩ biện, miệt trinh hung.', nghia: 'Bóc giường đến phần khung đỡ; phá bỏ sự chính bền, hung.' },
    { line: 3, label: '六三', han: '剝之，无咎。', hanViet: 'bác chi, vô cữu.', nghia: 'Tuy ở trong thời bóc lột nhưng giữ được, không lỗi.' },
    { line: 4, label: '六四', han: '剝牀以膚，凶。', hanViet: 'bác sàng dĩ phu, hung.', nghia: 'Bóc giường đến cả da thịt người nằm, hung.' },
    { line: 5, label: '六五', han: '貫魚，以宮人寵，无不利。', hanViet: 'quán ngư, dĩ cung nhân sủng, vô bất lợi.', nghia: 'Xâu cá thành chuỗi, dẫn cung nhân được sủng ái có thứ tự, không gì là không lợi.' },
    { line: 6, label: '上九', han: '碩果不食，君子得輿，小人剝廬。', hanViet: 'thạc quả bất thực, quân tử đắc dư, tiểu nhân bác lư.', nghia: 'Quả lớn còn sót chẳng bị ăn; quân tử được xe (dân chở), tiểu nhân thì phá cả nhà mình.' },
  ],
  24: [
    { line: 1, label: '初九', han: '不復遠，无袛悔，元吉。', hanViet: 'bất phục viễn, vô chi hối, nguyên cát.', nghia: 'Trở lại khi chưa đi xa, không tới mức hối hận, lớn lành.' },
    { line: 2, label: '六二', han: '休復，吉。', hanViet: 'hưu phục, cát.', nghia: 'Trở lại một cách tốt đẹp, lành.' },
    { line: 3, label: '六三', han: '頻復，厲无咎。', hanViet: 'tần phục, lệ vô cữu.', nghia: 'Trở lại nhiều lần, tuy nguy nhưng không lỗi.' },
    { line: 4, label: '六四', han: '中行獨復。', hanViet: 'trung hành độc phục.', nghia: 'Đi giữa đường, một mình quay trở lại.' },
    { line: 5, label: '六五', han: '敦復，无悔。', hanViet: 'đôn phục, vô hối.', nghia: 'Trở lại một cách đôn hậu, không hối hận.' },
    { line: 6, label: '上六', han: '迷復，凶，有災眚。用行師，終有大敗，以其國君，凶；至于十年，不克征。', hanViet: 'mê phục, hung, hữu tai sảnh. dụng hành sư, chung hữu đại bại, dĩ kỳ quốc quân, hung; chí vu thập niên, bất khắc chinh.', nghia: 'Mê muội không biết quay lại, hung, có tai họa. Dùng để ra quân thì cuối cùng đại bại, liên lụy cả vua nước mình, hung; đến mười năm vẫn không thể chinh phạt.' },
  ],
  25: [
    { line: 1, label: '初九', han: '无妄，往吉。', hanViet: 'vô vọng, vãng cát.', nghia: 'Không càn bậy, giữ lòng chân chính; tiến tới thì tốt.' },
    { line: 2, label: '六二', han: '不耕穫，不菑畬，則利有攸往。', hanViet: 'bất canh hoạch, bất chuy dư, tắc lợi hữu du vãng.', nghia: 'Không cày mà mong gặt, không khai hoang mà mong ruộng tốt; không cầu lợi vọng tưởng thì có lợi cho việc tiến tới.' },
    { line: 3, label: '六三', han: '无妄之災，或系之牛，行人之得，邑人之災。', hanViet: 'vô vọng chi tai, hoặc hệ chi ngưu, hành nhân chi đắc, ấp nhân chi tai.', nghia: 'Tai họa bất ngờ không do lỗi mình: con bò buộc đó bị người qua đường dắt mất, hóa thành tai vạ cho người trong làng.' },
    { line: 4, label: '九四', han: '可貞，无咎。', hanViet: 'khả trinh, vô cữu.', nghia: 'Có thể giữ vững chính bền; không có lỗi.' },
    { line: 5, label: '九五', han: '无妄之疾，勿藥有喜。', hanViet: 'vô vọng chi tật, vật dược hữu hỉ.', nghia: 'Bệnh đến không do mình gây ra; không cần dùng thuốc cũng có điều mừng (tự khỏi).' },
    { line: 6, label: '上九', han: '无妄，行有眚，无攸利。', hanViet: 'vô vọng, hành hữu sảnh, vô du lợi.', nghia: 'Tuy lòng chân chính nhưng đã đến lúc cùng, cứ tiến thì gặp tai vạ; không có gì lợi.' },
  ],
  26: [
    { line: 1, label: '初九', han: '有厲利已。', hanViet: 'hữu lệ lợi dĩ.', nghia: 'Có hiểm nguy, nên dừng lại thì có lợi.' },
    { line: 2, label: '九二', han: '輿說輹。', hanViet: 'dư thoát phúc.', nghia: 'Trục xe rời ra, xe không thể chạy; biết tự kiềm chế dừng lại.' },
    { line: 3, label: '九三', han: '良馬逐，利艱貞。曰閑輿衛，利有攸往。', hanViet: 'lương mã trục, lợi gian trinh. viết nhàn dư vệ, lợi hữu du vãng.', nghia: 'Ngựa tốt rong ruổi đuổi theo, nên giữ chính bền trong gian khó. Lo luyện tập việc giữ gìn xe cộ phòng vệ, có lợi khi tiến tới.' },
    { line: 4, label: '六四', han: '童牛之牿，元吉。', hanViet: 'đồng ngưu chi cốc, nguyên cát.', nghia: 'Đặt thanh chắn lên sừng con bê khi còn nhỏ, ngăn ngừa từ sớm; rất tốt lành.' },
    { line: 5, label: '六五', han: '豶豕之牙，吉。', hanViet: 'phần thỉ chi nha, cát.', nghia: 'Chế phục được nanh của con heo đã thiến, dịu sức hung hăng; tốt lành.' },
    { line: 6, label: '上九', han: '何天之衢，亨。', hanViet: 'hà thiên chi cù, hanh.', nghia: 'Gánh vác con đường lớn của trời, thông suốt rộng mở; hanh thông.' },
  ],
  27: [
    { line: 1, label: '初九', han: '舍爾靈龜，觀我朵頤，凶。', hanViet: 'Xá nhĩ linh quy, quan ngã đóa di, hung.', nghia: 'Bỏ con rùa thiêng của mình, lại nhìn ta mà thèm thuồng nhóp nhép, xấu.' },
    { line: 2, label: '六二', han: '顛頤，拂經，于丘頤，征凶。', hanViet: 'Điên di, phất kinh, vu khâu di, chinh hung.', nghia: 'Nuôi dưỡng trái lẽ, ngược với đạo thường; cầu nuôi ở chỗ cao, tiến lên thì xấu.' },
    { line: 3, label: '六三', han: '拂頤，貞凶，十年勿用，无攸利。', hanViet: 'Phất di, trinh hung, thập niên vật dụng, vô du lợi.', nghia: 'Trái đạo nuôi dưỡng, dù chính cũng xấu; mười năm chớ dùng, không có gì lợi.' },
    { line: 4, label: '六四', han: '顛頤吉，虎視眈眈，其欲逐逐，无咎。', hanViet: 'Điên di cát, hổ thị đam đam, kỳ dục trục trục, vô cữu.', nghia: 'Cầu nuôi ở dưới mà được tốt; như hổ nhìn chăm chăm, lòng mong cầu nối tiếp, không lỗi.' },
    { line: 5, label: '六五', han: '拂經，居貞吉，不可涉大川。', hanViet: 'Phất kinh, cư trinh cát, bất khả thiệp đại xuyên.', nghia: 'Tuy trái đạo thường, giữ vững chính bền thì tốt; nhưng chưa thể vượt sông lớn.' },
    { line: 6, label: '上九', han: '由頤，厲吉，利涉大川。', hanViet: 'Do di, lệ cát, lợi thiệp đại xuyên.', nghia: 'Mọi sự nuôi dưỡng do mình mà ra; biết lo sợ thận trọng thì tốt, lợi cho việc vượt sông lớn.' },
  ],
  28: [
    { line: 1, label: '初六', han: '藉用白茅，无咎。', hanViet: 'Tạ dụng bạch mao, vô cữu.', nghia: 'Lót đồ bằng cỏ tranh trắng; cẩn thận chu đáo nên không có lỗi.' },
    { line: 2, label: '九二', han: '枯楊生稊，老夫得其女妻，无不利。', hanViet: 'Khô dương sinh đề, lão phu đắc kỳ nữ thê, vô bất lợi.', nghia: 'Cây dương khô mọc mầm non; ông già lấy được vợ trẻ, không gì là không lợi.' },
    { line: 3, label: '九三', han: '棟橈，凶。', hanViet: 'Đống nạo, hung.', nghia: 'Cây rường cong oằn xuống; hung hiểm, gánh quá sức nên đổ vỡ.' },
    { line: 4, label: '九四', han: '棟隆，吉。有它吝。', hanViet: 'Đống long, cát. Hữu tha lận.', nghia: 'Cây rường vững vàng nhô lên; tốt. Nhưng nếu sinh lòng riêng khác thì hối tiếc.' },
    { line: 5, label: '九五', han: '枯楊生華，老婦得其士夫，无咎无譽。', hanViet: 'Khô dương sinh hoa, lão phụ đắc kỳ sĩ phu, vô cữu vô dự.', nghia: 'Cây dương khô trổ hoa; bà già lấy được chồng trẻ, không lỗi cũng chẳng vinh dự gì.' },
    { line: 6, label: '上六', han: '過涉滅頂，凶，无咎。', hanViet: 'Quá thiệp diệt đính, hung, vô cữu.', nghia: 'Lội qua chỗ nước quá sâu, ngập cả đỉnh đầu; hung, nhưng vì việc nghĩa nên không bị chê trách.' },
  ],
  29: [
    { line: 1, label: '初六', han: '習坎，入于坎窞，凶。', hanViet: 'Tập khảm, nhập vu khảm đạm, hung.', nghia: 'Hiểm chồng hiểm, sa vào hố sâu của hiểm nạn, hung.' },
    { line: 2, label: '九二', han: '坎有險，求小得。', hanViet: 'Khảm hữu hiểm, cầu tiểu đắc.', nghia: 'Đang ở chỗ hiểm nguy, cầu mong điều nhỏ thì được.' },
    { line: 3, label: '六三', han: '來之坎坎，險且枕，入于坎窞，勿用。', hanViet: 'Lai chi khảm khảm, hiểm thả chẩm, nhập vu khảm đạm, vật dụng.', nghia: 'Tới lui đều gặp hiểm, hiểm nạn lại còn chồng chất, sa vào hố sâu, chớ hành động.' },
    { line: 4, label: '六四', han: '樽酒簋貳，用缶，納約自牖，終无咎。', hanViet: 'Tôn tửu quỹ nhị, dụng phẫu, nạp ước tự dũ, chung vô cữu.', nghia: 'Một chén rượu, hai bát cơm, dùng đồ sành mộc mạc, đưa lễ ước hẹn qua cửa sổ; rốt cuộc không lỗi.' },
    { line: 5, label: '九五', han: '坎不盈，祗既平，无咎。', hanViet: 'Khảm bất doanh, chỉ kí bình, vô cữu.', nghia: 'Hố hiểm chưa đầy, đến khi đã bằng phẳng thì không lỗi.' },
    { line: 6, label: '上六', han: '係用徽纆，寘于叢棘，三歲不得，凶。', hanViet: 'Hệ dụng huy mặc, trí vu tùng cức, tam tuế bất đắc, hung.', nghia: 'Bị trói bằng dây thừng, giam nơi bụi gai, ba năm không thoát ra được, hung.' },
  ],
  30: [
    { line: 1, label: '初九', han: '履錯然，敬之无咎。', hanViet: 'lý thác nhiên, kính chi vô cữu.', nghia: 'Bước đi còn lẫn lộn, ngổn ngang; giữ lòng kính cẩn thì không lỗi.' },
    { line: 2, label: '六二', han: '黃離，元吉。', hanViet: 'hoàng ly, nguyên cát.', nghia: 'Bám vào sắc vàng (đạo trung chính); rất tốt lành.' },
    { line: 3, label: '九三', han: '日昃之離，不鼓缶而歌，則大耋之嗟，凶。', hanViet: 'nhật trắc chi ly, bất cổ phẫu nhi ca, tắc đại điệt chi ta, hung.', nghia: 'Mặt trời đã xế bóng; không gõ vò mà ca hát vui vầy, lại than thở cảnh tuổi già; hung.' },
    { line: 4, label: '九四', han: '突如其來如，焚如，死如，棄如。', hanViet: 'đột như kỳ lai như, phần như, tử như, khí như.', nghia: 'Đến đột ngột dữ dội như lửa thiêu đốt, như chết, như bị bỏ rơi.' },
    { line: 5, label: '六五', han: '出涕沱若，戚嗟若，吉。', hanViet: 'xuất thế đà nhược, thích ta nhược, cát.', nghia: 'Nước mắt tuôn rơi đầm đìa, lo buồn than thở; nhưng rốt cuộc cát.' },
    { line: 6, label: '上九', han: '王用出征，有嘉折首，獲匪其醜，无咎。', hanViet: 'vương dụng xuất chinh, hữu gia chiết thủ, hoạch phỉ kỳ xú, vô cữu.', nghia: 'Vua dùng để xuất quân chinh phạt; có công chém đầu kẻ cầm đầu, chỉ bắt kẻ đầu sỏ chứ không bắt vạ đồng bọn; không lỗi.' },
  ],
  31: [
    { line: 1, label: '初六', han: '咸其拇。', hanViet: 'hàm kỳ mẫu.', nghia: 'Cảm ứng đến ngón chân cái. Mới chớm động, chưa đủ tác động gì.' },
    { line: 2, label: '六二', han: '咸其腓，凶，居吉。', hanViet: 'hàm kỳ phì, hung, cư cát.', nghia: 'Cảm ứng đến bắp chân: vọng động thì hung; giữ yên một chỗ thì tốt.' },
    { line: 3, label: '九三', han: '咸其股，執其隨，往吝。', hanViet: 'hàm kỳ cổ, chấp kỳ tùy, vãng lận.', nghia: 'Cảm ứng đến bắp đùi, cứ bám theo người khác mà động; tiến tới thì đáng tiếc.' },
    { line: 4, label: '九四', han: '貞吉悔亡，憧憧往來，朋從爾思。', hanViet: 'trinh cát hối vong, sung sung vãng lai, bằng tùng nhĩ tư.', nghia: 'Giữ chính thì tốt, hối hận tiêu tan. Lòng dạ thấp thỏm qua lại, bạn bè sẽ thuận theo ý nghĩ của ngươi.' },
    { line: 5, label: '九五', han: '咸其脢，无悔。', hanViet: 'hàm kỳ mỗi, vô hối.', nghia: 'Cảm ứng đến phần lưng trên (sau tim); không có gì hối hận.' },
    { line: 6, label: '上六', han: '咸其輔，頰，舌。', hanViet: 'hàm kỳ phụ, giáp, thiệt.', nghia: 'Cảm ứng đến hàm, má, lưỡi: chỉ cảm bằng lời nói suông.' },
  ],
  32: [
    { line: 1, label: '初六', han: '浚恆，貞凶，无攸利。', hanViet: 'tuấn hằng, trinh hung, vô du lợi.', nghia: 'Đòi sự bền lâu quá sâu xa ngay từ đầu; giữ vậy thì xấu, không có gì lợi.' },
    { line: 2, label: '九二', han: '悔亡。', hanViet: 'hối vong.', nghia: 'Nỗi hối hận tiêu mất.' },
    { line: 3, label: '九三', han: '不恆其德，或承之羞，貞吝。', hanViet: 'bất hằng kỳ đức, hoặc thừa chi tu, trinh lận.', nghia: 'Không giữ bền cái đức của mình, có khi phải chịu hổ thẹn; cứ vậy thì đáng tiếc.' },
    { line: 4, label: '九四', han: '田无禽。', hanViet: 'điền vô cầm.', nghia: 'Đi săn mà không được thú; nhọc công vô ích.' },
    { line: 5, label: '六五', han: '恆其德，貞，婦人吉，夫子凶。', hanViet: 'hằng kỳ đức, trinh, phụ nhân cát, phu tử hung.', nghia: 'Giữ bền cái đức ấy: với người vợ thì tốt, với người chồng (kẻ trượng phu) thì xấu.' },
    { line: 6, label: '上六', han: '振恆，凶。', hanViet: 'chấn hằng, hung.', nghia: 'Dao động không yên mà mong giữ bền, xấu.' },
  ],
  33: [
    { line: 1, label: '初六', han: '遯尾，厲，勿用有攸往。', hanViet: 'độn vĩ, lệ, vật dụng hữu du vãng.', nghia: 'Lui chạy mà ở phía sau cùng, nguy. Chớ làm gì, chớ tiến đi đâu (cứ ở yên thì tránh được họa).' },
    { line: 2, label: '六二', han: '執之用黃牛之革，莫之勝說。', hanViet: 'chấp chi dụng hoàng ngưu chi cách, mạc chi thắng thoát.', nghia: 'Giữ chặt như buộc bằng da bò vàng, không ai cởi ra được. Ý chí kiên định, không thể lay chuyển.' },
    { line: 3, label: '九三', han: '系遯，有疾厲，畜臣妾吉。', hanViet: 'hệ độn, hữu tật lệ, súc thần thiếp cát.', nghia: 'Bị ràng buộc nên không lui được, có bệnh hoạn nguy khốn. Nuôi tôi tớ thê thiếp thì tốt (chỉ hợp việc nhỏ trong nhà).' },
    { line: 4, label: '九四', han: '好遯君子吉，小人否。', hanViet: 'hảo độn quân tử cát, tiểu nhân phủ.', nghia: 'Yêu mến mà vẫn dứt lui được, người quân tử thì tốt; kẻ tiểu nhân thì không làm được vậy.' },
    { line: 5, label: '九五', han: '嘉遯，貞吉。', hanViet: 'gia độn, trinh cát.', nghia: 'Lui chạy một cách tốt đẹp, hợp thời đúng mực; giữ chính bền thì tốt lành.' },
    { line: 6, label: '上九', han: '肥遯，无不利。', hanViet: 'phì độn, vô bất lợi.', nghia: 'Lui xa thong dong, dư dả không vướng bận; không gì là không lợi.' },
  ],
  34: [
    { line: 1, label: '初九', han: '壯于趾，征凶，有孚。', hanViet: 'Tráng vu chỉ, chinh hung, hữu phu.', nghia: 'Hùng mạnh ở ngón chân; tiến lên thì hung, dù có lòng thành cũng vậy. Sức mạnh dồn vào chỗ thấp nhất mà vội tiến là điềm xấu.' },
    { line: 2, label: '九二', han: '貞吉。', hanViet: 'Trinh cát.', nghia: 'Giữ vững chính bền thì tốt lành.' },
    { line: 3, label: '九三', han: '小人用壯，君子用罔，貞厲。羝羊觸藩，羸其角。', hanViet: 'Tiểu nhân dụng tráng, quân tử dụng võng, trinh lệ. Đê dương xúc phiên, luy kỳ giác.', nghia: 'Kẻ tiểu nhân dùng sức mạnh, người quân tử coi như không có; cố giữ thì nguy. Như con dê đực húc vào giậu, mắc kẹt sừng không gỡ ra được.' },
    { line: 4, label: '九四', han: '貞吉悔亡，藩決不羸，壯于大輿之輹。', hanViet: 'Trinh cát hối vong, phiên quyết bất luy, tráng vu đại dư chi phúc.', nghia: 'Giữ chính thì tốt, hối hận tiêu tan; giậu vỡ ra nên sừng không còn mắc kẹt, sức mạnh như trục bánh của cỗ xe lớn.' },
    { line: 5, label: '六五', han: '喪羊于易，无悔。', hanViet: 'Táng dương vu dị, vô hối.', nghia: 'Mất con dê một cách dễ dàng (buông bỏ sức cứng), không có gì phải hối hận.' },
    { line: 6, label: '上六', han: '羝羊觸藩，不能退，不能遂，无攸利，艱則吉。', hanViet: 'Đê dương xúc phiên, bất năng thoái, bất năng toại, vô du lợi, gian tắc cát.', nghia: 'Dê đực húc giậu, không lui được, cũng không tiến được, chẳng có lợi gì; chịu khó nhọc gắng vượt khó thì mới tốt.' },
  ],
  35: [
    { line: 1, label: '初六', han: '晉如，摧如，貞吉。罔孚，裕无咎。', hanViet: 'tấn như, tồi như, trinh cát. Võng phu, dụ vô cữu.', nghia: 'Tiến lên rồi bị ngăn lùi; giữ chính thì tốt. Chưa được tin cậy, cứ thong thả khoan hòa thì không lỗi.' },
    { line: 2, label: '六二', han: '晉如，愁如，貞吉。受茲介福，于其王母。', hanViet: 'tấn như, sầu như, trinh cát. Thụ tư giới phúc, vu kỳ vương mẫu.', nghia: 'Tiến lên mà lo buồn; giữ chính thì tốt. Sẽ nhận được phúc lớn này từ bậc vương mẫu.' },
    { line: 3, label: '六三', han: '眾允，悔亡。', hanViet: 'chúng duẫn, hối vong.', nghia: 'Được mọi người tin theo, điều hối tiếc tiêu tan.' },
    { line: 4, label: '九四', han: '晉如鼫鼠，貞厲。', hanViet: 'tấn như thạch thử, trinh lệ.', nghia: 'Tiến lên như con chuột lớn (tham mà sợ); giữ vậy thì nguy.' },
    { line: 5, label: '六五', han: '悔亡，失得勿恤，往吉无不利。', hanViet: 'hối vong, thất đắc vật tuất, vãng cát vô bất lợi.', nghia: 'Điều hối tiếc tiêu tan; chớ lo việc được mất, cứ tiến thì tốt, không gì không lợi.' },
    { line: 6, label: '上九', han: '晉其角，維用伐邑，厲吉无咎，貞吝。', hanViet: 'tấn kỳ giác, duy dụng phạt ấp, lệ cát vô cữu, trinh lận.', nghia: 'Tiến đến chỗ sừng (cùng cực, cứng nhọn); chỉ nên dùng để chinh phạt ấp ấp nhỏ. Tuy nguy nhưng tốt và không lỗi; nhưng giữ mãi vậy thì đáng tiếc.' },
  ],
  36: [
    { line: 1, label: '初九', han: '明夷于飛，垂其翼。君子于行，三日不食，有攸往，主人有言。', hanViet: 'minh di vu phi, thùy kỳ dực. quân tử vu hành, tam nhật bất thực, hữu du vãng, chủ nhân hữu ngôn.', nghia: 'Ánh sáng bị thương khi đang bay, rủ thấp đôi cánh. Người quân tử lên đường, ba ngày không ăn, có nơi để đến, chủ nhà có lời chê trách.' },
    { line: 2, label: '六二', han: '明夷，夷于左股，用拯馬壯，吉。', hanViet: 'minh di, di vu tả cổ, dụng chửng mã tráng, cát.', nghia: 'Ánh sáng bị thương, bị thương ở vế trái, dùng ngựa khỏe để cứu giúp, tốt lành.' },
    { line: 3, label: '九三', han: '明夷于南狩，得其大首，不可疾貞。', hanViet: 'minh di vu nam thú, đắc kỳ đại thủ, bất khả tật trinh.', nghia: 'Ánh sáng bị thương, đi săn ở phương nam, bắt được kẻ đầu sỏ lớn, nhưng không thể vội vàng giữ chính.' },
    { line: 4, label: '六四', han: '入于左腹，獲明夷之心，于出門庭。', hanViet: 'nhập vu tả phúc, hoạch minh di chi tâm, vu xuất môn đình.', nghia: 'Vào bên bụng trái, nắm được lòng của kẻ làm tổn thương ánh sáng, rồi ra khỏi cổng sân.' },
    { line: 5, label: '六五', han: '箕子之明夷，利貞。', hanViet: 'cơ tử chi minh di, lợi trinh.', nghia: 'Cảnh ánh sáng bị thương của Cơ Tử, lợi về giữ vững chính bền.' },
    { line: 6, label: '上六', han: '不明晦，初登于天，后入于地。', hanViet: 'bất minh hối, sơ đăng vu thiên, hậu nhập vu địa.', nghia: 'Không sáng mà tối tăm, ban đầu lên tận trời, sau rơi xuống đất.' },
  ],
  37: [
    { line: 1, label: '初九', han: '閑有家，悔亡。', hanViet: 'nhàn hữu gia, hối vong.', nghia: 'Đề phòng, lập nề nếp trong nhà ngay từ đầu thì hối hận tiêu mất.' },
    { line: 2, label: '六二', han: '无攸遂，在中饋，貞吉。', hanViet: 'vô du toại, tại trung quỹ, trinh cát.', nghia: 'Không tự ý làm theo ý riêng, lo việc bếp núc nuôi dưỡng trong nhà; giữ chính bền thì tốt.' },
    { line: 3, label: '九三', han: '家人嗃嗃，悔厲吉；婦子嘻嘻，終吝。', hanViet: 'gia nhân hác hác, hối lệ cát; phụ tử hi hi, chung lận.', nghia: 'Người nhà nghiêm khắc gắt gao, tuy có hối tiếc và nguy nhưng rốt cuộc tốt; vợ con cười đùa buông tuồng, cuối cùng đáng tiếc.' },
    { line: 4, label: '六四', han: '富家，大吉。', hanViet: 'phú gia, đại cát.', nghia: 'Làm cho nhà giàu có, rất tốt lành.' },
    { line: 5, label: '九五', han: '王假有家，勿恤。吉。', hanViet: 'vương cách hữu gia, vật tuất. cát.', nghia: 'Vua lấy đức cảm hóa, đến với cả nhà; không phải lo lắng. Tốt.' },
    { line: 6, label: '上九', han: '有孚威如，終吉。', hanViet: 'hữu phu uy như, chung cát.', nghia: 'Có lòng thành tín và oai nghiêm, rốt cuộc tốt lành.' },
  ],
  38: [
    { line: 1, label: '初九', han: '悔亡，喪馬勿逐，自復；見惡人无咎。', hanViet: 'hối vong, táng mã vật trục, tự phục; kiến ác nhân vô cữu.', nghia: 'Hối hận tiêu tan. Mất ngựa chớ đuổi theo, nó tự trở về; gặp kẻ xấu cũng không lỗi.' },
    { line: 2, label: '九二', han: '遇主于巷，无咎。', hanViet: 'ngộ chủ vu hạng, vô cữu.', nghia: 'Gặp được chủ nơi ngõ hẻm, không có lỗi.' },
    { line: 3, label: '六三', han: '見輿曳，其牛掣，其人天且劓，无初有終。', hanViet: 'kiến dư duệ, kỳ ngưu xế, kỳ nhân thiên thả nghĩ, vô sơ hữu chung.', nghia: 'Thấy xe bị kéo lê, con trâu bị ghì lại, người ấy bị cắt tóc lại bị xẻo mũi. Lúc đầu chẳng ra gì nhưng về sau có kết cục tốt.' },
    { line: 4, label: '九四', han: '睽孤，遇元夫，交孚，厲无咎。', hanViet: 'khuê cô, ngộ nguyên phu, giao phu, lệ vô cữu.', nghia: 'Trong cảnh chia lìa cô độc, gặp người bạn tốt, lấy lòng thành mà giao kết; tuy nguy hiểm nhưng không có lỗi.' },
    { line: 5, label: '六五', han: '悔亡，厥宗噬膚，往何咎。', hanViet: 'hối vong, quyết tông phệ phu, vãng hà cữu.', nghia: 'Hối hận tiêu tan. Người cùng họ cắn vào da thịt (thân gần như cắn miếng thịt mềm); tiến tới thì có lỗi gì đâu.' },
    { line: 6, label: '上九', han: '睽孤， 見豕負涂，載鬼一車， 先張之弧，后說之弧，匪寇婚媾，往遇雨則吉。', hanViet: 'khuê cô, kiến thỉ phụ đồ, tải quỷ nhất xa, tiên trương chi hồ, hậu thoát chi hồ, phỉ khấu hôn cấu, vãng ngộ vũ tắc cát.', nghia: 'Trong cảnh chia lìa cô độc, thấy con lợn lấm bùn, một xe chở đầy ma quỷ. Trước thì giương cung định bắn, sau lại buông cung; chẳng phải giặc cướp mà là cầu hôn. Tiến tới gặp mưa thì tốt lành.' },
  ],
  39: [
    { line: 1, label: '初六', han: '往蹇，來譽。', hanViet: 'Vãng kiển, lai dự.', nghia: 'Đi tới thì gặp khó, quay về thì được khen ngợi.' },
    { line: 2, label: '六二', han: '王臣蹇蹇，匪躬之故。', hanViet: 'Vương thần kiển kiển, phỉ cung chi cố.', nghia: 'Bề tôi của vua chồng chất gian nan, không phải vì lợi riêng của bản thân.' },
    { line: 3, label: '九三', han: '往蹇來反。', hanViet: 'Vãng kiển lai phản.', nghia: 'Đi tới thì gặp khó, nên quay trở lại.' },
    { line: 4, label: '六四', han: '往蹇來連。', hanViet: 'Vãng kiển lai liên.', nghia: 'Đi tới thì gặp khó, quay về thì liên kết hợp sức với người.' },
    { line: 5, label: '九五', han: '大蹇朋來。', hanViet: 'Đại kiển bằng lai.', nghia: 'Gian nan lớn, bạn bè tìm đến giúp đỡ.' },
    { line: 6, label: '上六', han: '往蹇來碩，吉；利見大人。', hanViet: 'Vãng kiển lai thạc, cát; lợi kiến đại nhân.', nghia: 'Đi tới thì gặp khó, quay về thì được lớn lao, tốt lành; nên ra mắt bậc đại nhân.' },
  ],
  40: [
    { line: 1, label: '初六', han: '无咎。', hanViet: 'vô cữu.', nghia: 'Không lỗi.' },
    { line: 2, label: '九二', han: '田獲三狐，得黃矢，貞吉。', hanViet: 'điền hoạch tam hồ, đắc hoàng thỉ, trinh cát.', nghia: 'Đi săn bắt được ba con cáo, được mũi tên màu vàng; giữ chính bền thì tốt.' },
    { line: 3, label: '六三', han: '負且乘，致寇至，貞吝。', hanViet: 'phụ thả thừa, trí khấu chí, trinh lận.', nghia: 'Vác nặng trên lưng mà lại ngồi xe, chuốc lấy giặc cướp đến; giữ vậy thì đáng tiếc, hổ thẹn.' },
    { line: 4, label: '九四', han: '解而拇，朋至斯孚。', hanViet: 'giải nhi mẫu, bằng chí tư phu.', nghia: 'Cởi bỏ ngón chân cái (kẻ tiểu nhân bám víu), bạn bè đến mới có lòng thành tin nhau.' },
    { line: 5, label: '六五', han: '君子維有解，吉；有孚于小人。', hanViet: 'quân tử duy hữu giải, cát; hữu phu vu tiểu nhân.', nghia: 'Người quân tử cởi gỡ được vướng mắc thì tốt; lòng thành ấy cảm hóa được cả kẻ tiểu nhân.' },
    { line: 6, label: '上六', han: '公用射隼，于高墉之上，獲之，无不利。', hanViet: 'công dụng xạ chuẩn, vu cao dung chi thượng, hoạch chi, vô bất lợi.', nghia: 'Bậc vương công bắn con chim cắt ở trên bức tường cao, bắt được nó, không gì là không lợi.' },
  ],
  41: [
    { line: 1, label: '初九', han: '已事遄往，无咎，酌損之。', hanViet: 'Dĩ sự thuyên vãng, vô cữu, chước tổn chi.', nghia: 'Xong việc thì mau rời đi, không lỗi; nhưng nên cân nhắc mức độ bớt cho phải chừng.' },
    { line: 2, label: '九二', han: '利貞，征凶，弗損益之。', hanViet: 'Lợi trinh, chinh hung, phất tổn ích chi.', nghia: 'Lợi ở giữ chính bền; tiến lên thì hung; chớ tự bớt mình mà lại làm lợi cho người.' },
    { line: 3, label: '六三', han: '三人行，則損一人；一人行，則得其友。', hanViet: 'Tam nhân hành, tắc tổn nhất nhân; nhất nhân hành, tắc đắc kỳ hữu.', nghia: 'Ba người cùng đi thì bớt mất một người; một người đi thì tìm được bạn.' },
    { line: 4, label: '六四', han: '損其疾，使遄有喜，无咎。', hanViet: 'Tổn kỳ tật, sử thuyên hữu hỉ, vô cữu.', nghia: 'Bớt được tật bệnh, khiến mau có điều mừng, không lỗi.' },
    { line: 5, label: '六五', han: '或益之，十朋之龜弗克違，元吉。', hanViet: 'Hoặc ích chi, thập bằng chi quy phất khắc vi, nguyên cát.', nghia: 'Có người giúp ích cho, mai rùa quý giá mười xâu cũng không thể chối từ, rất tốt lành.' },
    { line: 6, label: '上九', han: '弗損益之，无咎，貞吉，利有攸往，得臣无家。', hanViet: 'Phất tổn ích chi, vô cữu, trinh cát, lợi hữu du vãng, đắc thần vô gia.', nghia: 'Không bớt mình mà vẫn làm lợi cho người, không lỗi, giữ chính thì tốt, lợi cho việc tiến tới, được người theo phục mà không cứ riêng nhà mình.' },
  ],
  42: [
    { line: 1, label: '初九', han: '利用為大作，元吉，无咎。', hanViet: 'lợi dụng vi đại tác, nguyên cát, vô cữu.', nghia: 'Lợi cho việc làm lớn, rất tốt lành, không lỗi.' },
    { line: 2, label: '六二', han: '或益之，十朋之龜弗克違，永貞吉。王用享于帝，吉。', hanViet: 'hoặc ích chi, thập bằng chi quy phất khắc vi, vĩnh trinh cát. Vương dụng hưởng vu đế, cát.', nghia: 'Có người làm lợi thêm cho, mai rùa quý mười bằng cũng không thể trái, giữ chính lâu dài thì tốt. Vua dâng tế lên Thượng Đế, tốt lành.' },
    { line: 3, label: '六三', han: '益之用凶事，无咎。有孚中行，告公用圭。', hanViet: 'ích chi dụng hung sự, vô cữu. Hữu phu trung hành, cáo công dụng khuê.', nghia: 'Dùng việc lợi vào lúc tai họa, không lỗi. Có lòng thành, giữ đạo trung, báo lên bậc trên dùng ngọc khuê làm tin.' },
    { line: 4, label: '六四', han: '中行，告公從。利用為依遷國。', hanViet: 'trung hành, cáo công tòng. Lợi dụng vi y thiên quốc.', nghia: 'Giữ đạo trung, báo lên bậc trên thì được nghe theo. Lợi cho việc nương dựa mà dời nước.' },
    { line: 5, label: '九五', han: '有孚惠心，勿問元吉。有孚惠我德。', hanViet: 'hữu phu huệ tâm, vật vấn nguyên cát. Hữu phu huệ ngã đức.', nghia: 'Có lòng thành mang tâm ban ơn, chẳng cần hỏi cũng rất tốt lành. Có lòng thành cảm đức của ta.' },
    { line: 6, label: '上九', han: '莫益之，或擊之，立心勿恆，凶。', hanViet: 'mạc ích chi, hoặc kích chi, lập tâm vật hằng, hung.', nghia: 'Chẳng ai làm lợi cho, lại có người công kích; lập tâm không bền vững, xấu.' },
  ],
  43: [
    { line: 1, label: '初九', han: '壯于前趾，往不勝為咎。', hanViet: 'Tráng vu tiền chỉ, vãng bất thắng vi cữu.', nghia: 'Mạnh ở ngón chân phía trước; tiến lên mà không thắng nổi thì có lỗi.' },
    { line: 2, label: '九二', han: '惕號，莫夜有戎，勿恤。', hanViet: 'Dịch hào, mạc dạ hữu nhung, vật tuất.', nghia: 'Cảnh giác mà kêu lên; đang đêm có binh đao cũng chớ lo.' },
    { line: 3, label: '九三', han: '壯于頄，有凶。君子夬夬，獨行遇雨，若濡有慍，无咎。', hanViet: 'Tráng vu quỹ, hữu hung. Quân tử quải quải, độc hành ngộ vũ, nhược nhu hữu uấn, vô cữu.', nghia: 'Mạnh hiện ra ở gò má, có điều dữ. Người quân tử quyết đoán dứt khoát; đi một mình gặp mưa, ướt át mà có chút bực, nhưng không có lỗi.' },
    { line: 4, label: '九四', han: '臀无膚，其行次且。牽羊悔亡，聞言不信。', hanViet: 'Đồn vô phu, kỳ hành thứ thư. Khiên dương hối vong, văn ngôn bất tín.', nghia: 'Mông không có da, bước đi ngập ngừng khó nhọc. Dắt dê theo thì hối hận mất đi, nhưng nghe lời nói lại chẳng tin.' },
    { line: 5, label: '九五', han: '莧陸夬夬，中行无咎。', hanViet: 'Hiện lục quải quải, trung hành vô cữu.', nghia: 'Như rau sam dễ đứt, quyết đoán dứt khoát; giữ đạo trung mà đi thì không có lỗi.' },
    { line: 6, label: '上六', han: '无號，終有凶。', hanViet: 'Vô hào, chung hữu hung.', nghia: 'Không kêu la cảnh báo được nữa; cuối cùng có điều dữ.' },
  ],
  44: [
    { line: 1, label: '初六', han: '系于金柅，貞吉，有攸往，見凶，羸豕孚踟躅。', hanViet: 'hệ vu kim nê, trinh cát, hữu du vãng, kiến hung, luy thỉ phu trì trục.', nghia: 'Buộc vào cái hãm bằng kim, giữ chính thì tốt; nếu cứ tiến tới thì gặp hung. Như con lợn gầy yếu mà lòng vẫn bồn chồn quẩn quanh không yên.' },
    { line: 2, label: '九二', han: '包有魚，无咎，不利賓。', hanViet: 'bao hữu ngư, vô cữu, bất lợi tân.', nghia: 'Trong bọc có cá, không lỗi; nhưng không nên đem ra đãi khách.' },
    { line: 3, label: '九三', han: '臀无膚，其行次且，厲，无大咎。', hanViet: 'đồn vô phu, kỳ hành thứ thư, lệ, vô đại cữu.', nghia: 'Mông không có da, bước đi ngập ngừng khó khăn; có nguy nhưng không lỗi lớn.' },
    { line: 4, label: '九四', han: '包无魚，起凶。', hanViet: 'bao vô ngư, khởi hung.', nghia: 'Trong bọc không có cá; khởi sự thì gặp hung.' },
    { line: 5, label: '九五', han: '以杞包瓜，含章，有隕自天。', hanViet: 'dĩ kỷ bao qua, hàm chương, hữu vẫn tự thiên.', nghia: 'Lấy lá cây kỷ che bọc quả dưa, ngậm chứa vẻ đẹp bên trong; điều tốt lành tự trời rơi xuống.' },
    { line: 6, label: '上九', han: '姤其角，吝，无咎。', hanViet: 'cấu kỳ giác, lận, vô cữu.', nghia: 'Gặp nhau ở chỗ sừng (cao xa, cứng cỏi), đáng tiếc tiếc nuối, nhưng không lỗi.' },
  ],
  45: [
    { line: 1, label: '初六', han: '有孚不終，乃亂乃萃，若號一握為笑，勿恤，往无咎。', hanViet: 'hữu phu bất chung, nãi loạn nãi tụy, nhược hào nhất ác vi tiếu, vật tuất, vãng vô cữu.', nghia: 'Có lòng thành nhưng không bền tới cùng, nên khi loạn khi tụ; nếu kêu lên rồi nắm tay nhau mà cười, thì chớ lo, cứ đi tới sẽ không lỗi.' },
    { line: 2, label: '六二', han: '引吉，无咎，孚乃利用禴。', hanViet: 'dẫn cát, vô cữu, phu nãi lợi dụng dược.', nghia: 'Được dẫn dắt mà đến với nhau thì tốt, không lỗi; lòng thành thì dù lễ mỏng (tế dược) cũng có lợi.' },
    { line: 3, label: '六三', han: '萃如，嗟如，无攸利，往无咎，小吝。', hanViet: 'tụy như, ta như, vô du lợi, vãng vô cữu, tiểu lận.', nghia: 'Muốn tụ họp mà phải than thở, không có lợi gì; nhưng cứ đi tới thì không lỗi, chỉ hơi đáng tiếc.' },
    { line: 4, label: '九四', han: '大吉，无咎。', hanViet: 'đại cát, vô cữu.', nghia: 'Rất tốt lành thì mới không lỗi.' },
    { line: 5, label: '九五', han: '萃有位，无咎。匪孚，元永貞，悔亡。', hanViet: 'tụy hữu vị, vô cữu. phỉ phu, nguyên vĩnh trinh, hối vong.', nghia: 'Tụ họp mà có ngôi vị, không lỗi. Nếu lòng người chưa thành tin, thì giữ đạo chính lâu dài cho bền, hối hận sẽ mất.' },
    { line: 6, label: '上六', han: '齎咨涕洟，无咎。', hanViet: 'tê tư thế di, vô cữu.', nghia: 'Than thở, nước mắt nước mũi giàn giụa; biết vậy mà sửa thì không lỗi.' },
  ],
  46: [
    { line: 1, label: '初六', han: '允升，大吉。', hanViet: 'doãn thăng, đại cát.', nghia: 'Được tin theo mà tiến lên, rất tốt lành.' },
    { line: 2, label: '九二', han: '孚乃利用禴，无咎。', hanViet: 'phu nãi lợi dụng dược, vô cữu.', nghia: 'Có lòng thành tín thì dù lễ tế đơn sơ mùa hạ cũng có lợi, không lỗi.' },
    { line: 3, label: '九三', han: '升虛邑。', hanViet: 'thăng hư ấp.', nghia: 'Tiến lên vào ấp trống không, thuận lợi không gặp trở ngại.' },
    { line: 4, label: '六四', han: '王用亨于岐山，吉无咎。', hanViet: 'vương dụng hanh vu kỳ sơn, cát vô cữu.', nghia: 'Vua dùng để tế hanh thông ở núi Kỳ, tốt lành, không lỗi.' },
    { line: 5, label: '六五', han: '貞吉，升階。', hanViet: 'trinh cát, thăng giai.', nghia: 'Giữ chính bền thì tốt, tiến lên từng bậc thềm.' },
    { line: 6, label: '上六', han: '冥升，利于不息之貞。', hanViet: 'minh thăng, lợi vu bất tức chi trinh.', nghia: 'Tiến lên trong mờ tối, nên giữ sự chính bền không ngừng nghỉ.' },
  ],
  47: [
    { line: 1, label: '初六', han: '臀困于株木，入于幽谷，三歲不覿。', hanViet: 'đồn khốn vu chu mộc, nhập vu u cốc, tam tuế bất địch.', nghia: 'Mông đít bị khốn nơi gốc cây, sa vào hang tối, ba năm không gặp ai.' },
    { line: 2, label: '九二', han: '困于酒食，朱紱方來，利用亨祀，征凶，无咎。', hanViet: 'khốn vu tửu thực, chu phất phương lai, lợi dụng hanh tự, chinh hung, vô cữu.', nghia: 'Khốn quẫn giữa rượu thịt, dải lụa đỏ vừa đến, nên dùng việc cúng tế; tiến lên thì hung, nhưng không lỗi.' },
    { line: 3, label: '六三', han: '困于石，據于蒺藜，入于其宮，不見其妻，凶。', hanViet: 'khốn vu thạch, cứ vu tật lê, nhập vu kỳ cung, bất kiến kỳ thê, hung.', nghia: 'Bị khốn bởi đá, tựa vào bụi gai, vào nhà mình mà không thấy vợ, hung.' },
    { line: 4, label: '九四', han: '來徐徐，困于金車，吝，有終。', hanViet: 'lai từ từ, khốn vu kim xa, lận, hữu chung.', nghia: 'Đến chậm rãi, bị khốn bởi xe vàng, đáng tiếc, nhưng cuối cùng có kết quả tốt.' },
    { line: 5, label: '九五', han: '劓刖，困于赤紱，乃徐有說，利用祭祀。', hanViet: 'nghĩ ngoạt, khốn vu xích phất, nãi từ hữu duyệt, lợi dụng tế tự.', nghia: 'Bị cắt mũi chặt chân, khốn bởi dải lụa đỏ, rồi dần dần được thoải mái, nên dùng việc tế tự.' },
    { line: 6, label: '上六', han: '困于葛藟，于臲卼，曰動悔。有悔，征吉。', hanViet: 'khốn vu cát luỹ, vu niết ngột, viết động hối. hữu hối, chinh cát.', nghia: 'Bị khốn bởi dây sắn, ở chỗ chông chênh nguy ngập, nói rằng động thì hối. Đã biết hối, tiến lên thì cát.' },
  ],
  48: [
    { line: 1, label: '初六', han: '井泥不食，舊井无禽。', hanViet: 'Tỉnh nê bất thực, cựu tỉnh vô cầm.', nghia: 'Giếng bùn lầy không uống được; giếng cũ bỏ hoang đến chim cũng không tới.' },
    { line: 2, label: '九二', han: '井谷射鮒，瓮敝漏。', hanViet: 'Tỉnh cốc xạ phụ, úng tệ lậu.', nghia: 'Nước giếng rò xuống khe chỉ nuôi cá nhỏ; vò sứt mẻ nên rò rỉ hết.' },
    { line: 3, label: '九三', han: '井渫不食，為我心惻，可用汲，王明，并受其福。', hanViet: 'Tỉnh tiết bất thực, vi ngã tâm trắc, khả dụng cấp, vương minh, tịnh thụ kỳ phúc.', nghia: 'Giếng đã vét trong mà không ai uống, khiến lòng ta xót xa; nước ấy có thể múc dùng; nếu vua sáng suốt, mọi người cùng hưởng phúc.' },
    { line: 4, label: '六四', han: '井甃，无咎。', hanViet: 'Tỉnh trứu, vô cữu.', nghia: 'Xây gạch sửa thành giếng, không có lỗi.' },
    { line: 5, label: '九五', han: '井冽，寒泉食。', hanViet: 'Tỉnh liệt, hàn tuyền thực.', nghia: 'Nước giếng trong mát, suối lạnh dùng uống được.' },
    { line: 6, label: '上六', han: '井收勿幕，有孚元吉。', hanViet: 'Tỉnh thu vật mạc, hữu phu nguyên cát.', nghia: 'Giếng đã thành, chớ đậy che lại; giữ lòng thành tín thì cả lớn tốt lành.' },
  ],
  49: [
    { line: 1, label: '初九', han: '鞏用黃牛之革。', hanViet: 'củng dụng hoàng ngưu chi cách.', nghia: 'Buộc chặt bằng da bò vàng. Chưa đến lúc thay đổi, hãy giữ vững, đừng vọng động.' },
    { line: 2, label: '六二', han: '巳日乃革之，征吉，无咎。', hanViet: 'tị nhật nãi cách chi, chinh cát, vô cữu.', nghia: 'Đến đúng thời mới tiến hành thay đổi; tiến lên thì tốt, không lỗi.' },
    { line: 3, label: '九三', han: '征凶，貞厲，革言三就，有孚。', hanViet: 'chinh hung, trinh lệ, cách ngôn tam tựu, hữu phu.', nghia: 'Tiến vội thì gặp dữ, giữ chính cũng còn nguy; bàn việc cải cách phải cân nhắc nhiều lần, có lòng tin thành mới được.' },
    { line: 4, label: '九四', han: '悔亡，有孚改命，吉。', hanViet: 'hối vong, hữu phu cải mệnh, cát.', nghia: 'Hối tiếc tiêu tan; có lòng thành tín mà thay đổi mệnh, tốt lành.' },
    { line: 5, label: '九五', han: '大人虎變，未占有孚。', hanViet: 'đại nhân hổ biến, vị chiêm hữu phu.', nghia: 'Bậc đại nhân biến hóa rạng rỡ như cọp; chưa cần bói cũng đã có lòng tin theo.' },
    { line: 6, label: '上六', han: '君子豹變，小人革面，征凶，居貞吉。', hanViet: 'quân tử báo biến, tiểu nhân cách diện, chinh hung, cư trinh cát.', nghia: 'Người quân tử đổi mới như beo thay lông, kẻ tiểu nhân chỉ đổi ngoài mặt; tiến tới thì hung, giữ yên chính đạo thì tốt.' },
  ],
  50: [
    { line: 1, label: '初六', han: '鼎顛趾，利出否，得妾以其子，无咎。', hanViet: 'đỉnh điên chỉ, lợi xuất bĩ, đắc thiếp dĩ kỳ tử, vô cữu.', nghia: 'Cái đỉnh lật chân ngược lên, có lợi cho việc đổ bỏ cặn xấu; được thiếp lại nhờ con của nàng, không lỗi.' },
    { line: 2, label: '九二', han: '鼎有實，我仇有疾，不我能即，吉。', hanViet: 'đỉnh hữu thực, ngã cừu hữu tật, bất ngã năng tức, cát.', nghia: 'Trong đỉnh có vật thực; kẻ đối địch với ta đang gặp bệnh hoạn, không thể đến gần ta được, tốt lành.' },
    { line: 3, label: '九三', han: '鼎耳革，其行塞，雉膏不食，方雨虧悔，終吉。', hanViet: 'đỉnh nhĩ cách, kỳ hành tắc, trĩ cao bất thực, phương vũ khuy hối, chung cát.', nghia: 'Tai đỉnh biến đổi, đường đi bị nghẽn, thịt chim trĩ béo mà không được ăn; khi mưa xuống thì nỗi hối tiếc tiêu vơi, sau cùng tốt lành.' },
    { line: 4, label: '九四', han: '鼎折足，覆公餗，其形渥，凶。', hanViet: 'đỉnh chiết túc, phúc công tốc, kỳ hình ác, hung.', nghia: 'Đỉnh gãy chân, đổ cả thức ăn dâng vua, dáng vẻ nhơ nhuốc ướt đẫm, hung.' },
    { line: 5, label: '六五', han: '鼎黃耳金鉉，利貞。', hanViet: 'đỉnh hoàng nhĩ kim huyễn, lợi trinh.', nghia: 'Đỉnh có tai vàng và đòn xỏ bằng kim loại, lợi về sự giữ chính bền.' },
    { line: 6, label: '上九', han: '鼎玉鉉，大吉，无不利。', hanViet: 'đỉnh ngọc huyễn, đại cát, vô bất lợi.', nghia: 'Đỉnh có đòn xỏ bằng ngọc, rất tốt lành, không gì là không lợi.' },
  ],
  51: [
    { line: 1, label: '初九', han: '震來虩虩，后笑言啞啞，吉。', hanViet: 'chấn lai hích hích, hậu tiếu ngôn ách ách, cát.', nghia: 'Sấm động tới làm sợ hãi run rẩy, nhưng sau đó cười nói vui vẻ; tốt lành. Biết kinh sợ mà phòng bị nên cuối cùng được an.' },
    { line: 2, label: '六二', han: '震來厲，億喪貝，躋于九陵，勿逐，七日得。', hanViet: 'chấn lai lệ, ức táng bối, tê vu cửu lăng, vật trục, thất nhật đắc.', nghia: 'Sấm động tới đầy nguy hiểm, e mất của cải, phải trèo lên gò cao chín tầng để lánh. Đừng đuổi theo của đã mất, bảy ngày sau sẽ lấy lại được.' },
    { line: 3, label: '六三', han: '震蘇蘇，震行无眚。', hanViet: 'chấn tô tô, chấn hành vô sảnh.', nghia: 'Sấm động khiến bồn chồn không yên; nếu vì sợ mà chịu chuyển mình hành động thì không gặp tai họa.' },
    { line: 4, label: '九四', han: '震遂泥。', hanViet: 'chấn toại nê.', nghia: 'Sấm động mà sa lầy trong bùn, không vùng dậy được; ý chỉ sự trì trệ không phấn chấn nổi.' },
    { line: 5, label: '六五', han: '震往來厲，億无喪，有事。', hanViet: 'chấn vãng lai lệ, ức vô táng, hữu sự.', nghia: 'Sấm động qua lại đều nguy hiểm, nhưng xét ra không mất mát gì; vẫn giữ được phận sự của mình.' },
    { line: 6, label: '上六', han: '震索索，視矍矍，征凶。震不于其躬，于其鄰，无咎。婚媾有言。', hanViet: 'chấn tác tác, thị quắc quắc, chinh hung. chấn bất vu kì cung, vu kì lân, vô cữu. hôn cấu hữu ngôn.', nghia: 'Sấm động làm rụng rời, mắt nhìn ngơ ngác hoảng hốt; tiến tới thì hung. Nếu sấm chưa giáng vào mình mà giáng vào hàng xóm, biết phòng trước thì không lỗi. Việc hôn nhân sẽ có lời tiếng dị nghị.' },
  ],
  52: [
    { line: 1, label: '初六', han: '艮其趾，无咎，利永貞。', hanViet: 'cấn kì chỉ, vô cữu, lợi vĩnh trinh.', nghia: 'Dừng nơi ngón chân (dừng ngay từ đầu, khi chưa cất bước), không lỗi; nên giữ chính bền lâu.' },
    { line: 2, label: '六二', han: '艮其腓，不拯其隨，其心不快。', hanViet: 'cấn kì phì, bất chửng kì tùy, kì tâm bất khoái.', nghia: 'Dừng nơi bắp chân; không cứu được kẻ mình đi theo, đành theo mà không tự chủ, nên trong lòng không vui.' },
    { line: 3, label: '九三', han: '艮其限，列其夤，厲薰心。', hanViet: 'cấn kì hạn, liệt kì dần, lệ huân tâm.', nghia: 'Dừng nơi lưng (eo), đến mức rách cả thịt lưng; nguy, sự lo âu nung nấu trong lòng.' },
    { line: 4, label: '六四', han: '艮其身，无咎。', hanViet: 'cấn kì thân, vô cữu.', nghia: 'Dừng nơi thân mình (giữ mình yên, biết tự ngăn), không lỗi.' },
    { line: 5, label: '六五', han: '艮其輔，言有序，悔亡。', hanViet: 'cấn kì phụ, ngôn hữu tự, hối vong.', nghia: 'Dừng nơi miệng (giữ lời), nói năng có thứ lớp chừng mực, nên hối hận tiêu mất.' },
    { line: 6, label: '上九', han: '敦艮，吉。', hanViet: 'đôn cấn, cát.', nghia: 'Đôn hậu trong sự dừng (giữ đạo dừng một cách dày dặn, vững vàng đến cùng), tốt lành.' },
  ],
  53: [
    { line: 1, label: '初六', han: '鴻漸于干，小子厲，有言，无咎。', hanViet: 'hồng tiệm vu can, tiểu tử lệ, hữu ngôn, vô cữu.', nghia: 'Chim hồng tiến dần đến bờ nước. Người trẻ gặp nguy, bị trách móc, nhưng không có lỗi.' },
    { line: 2, label: '六二', han: '鴻漸于磐，飲食衎衎，吉。', hanViet: 'hồng tiệm vu bàn, ẩm thực khản khản, cát.', nghia: 'Chim hồng tiến dần đến tảng đá lớn, ăn uống vui hòa thư thái, tốt lành.' },
    { line: 3, label: '九三', han: '鴻漸于陸，夫征不復，婦孕不育，凶；利禦寇。', hanViet: 'hồng tiệm vu lục, phu chinh bất phục, phụ dựng bất dục, hung; lợi ngự khấu.', nghia: 'Chim hồng tiến dần lên gò đất cao. Chồng đi xa không trở về, vợ mang thai mà không nuôi được, xấu; nên phòng chống giặc cướp.' },
    { line: 4, label: '六四', han: '鴻漸于木，或得其桷，无咎。', hanViet: 'hồng tiệm vu mộc, hoặc đắc kỳ giác, vô cữu.', nghia: 'Chim hồng tiến dần lên cây. Có khi tìm được cành ngang bằng phẳng để đậu, không có lỗi.' },
    { line: 5, label: '九五', han: '鴻漸于陵，婦三歲不孕，終莫之勝，吉。', hanViet: 'hồng tiệm vu lăng, phụ tam tuế bất dựng, chung mạc chi thắng, cát.', nghia: 'Chim hồng tiến dần lên gò cao. Người vợ ba năm không mang thai, nhưng rốt cuộc không gì cản được, tốt lành.' },
    { line: 6, label: '上九', han: '鴻漸于陸，其羽可用為儀，吉。', hanViet: 'hồng tiệm vu lục, kỳ vũ khả dụng vi nghi, cát.', nghia: 'Chim hồng tiến dần lên đường mây cao. Lông cánh của nó có thể dùng làm vật trang nghi lễ, tốt lành.' },
  ],
  54: [
    { line: 1, label: '初九', han: '歸妹以娣，跛能履，征吉。', hanViet: 'quy muội dĩ đễ, bả năng lý, chinh cát.', nghia: 'Gả em gái làm thiếp; người què vẫn bước đi được; tiến lên thì tốt.' },
    { line: 2, label: '九二', han: '眇能視，利幽人之貞。', hanViet: 'miễu năng thị, lợi u nhân chi trinh.', nghia: 'Người chột vẫn nhìn được; lợi cho sự bền chí của người ẩn dật giữ mình ngay thẳng.' },
    { line: 3, label: '六三', han: '歸妹以須，反歸以娣。', hanViet: 'quy muội dĩ tu, phản quy dĩ đễ.', nghia: 'Gả em gái mà phải chờ đợi; quay về làm thiếp thì hơn.' },
    { line: 4, label: '九四', han: '歸妹愆期，遲歸有時。', hanViet: 'quy muội khiên kỳ, trì quy hữu thì.', nghia: 'Việc gả em gái lỡ kỳ hẹn; gả muộn cũng có thời của nó.' },
    { line: 5, label: '六五', han: '帝乙歸妹，其君之袂，不如其娣之袂良，月幾望，吉。', hanViet: 'đế ất quy muội, kỳ quân chi mệ, bất như kỳ đễ chi mệ lương, nguyệt cơ vọng, cát.', nghia: 'Vua Đế Ất gả em gái; tay áo của cô dâu chính không đẹp bằng tay áo của người thiếp; trăng gần tròn; tốt.' },
    { line: 6, label: '上六', han: '女承筐无實，士刲羊无血，无攸利。', hanViet: 'nữ thừa khuông vô thực, sĩ khuê dương vô huyết, vô du lợi.', nghia: 'Người con gái bưng giỏ mà không có gì trong giỏ; kẻ sĩ cắt cổ dê mà không có máu; không có gì lợi.' },
  ],
  55: [
    { line: 1, label: '初九', han: '遇其配主，雖旬无咎，往有尚。', hanViet: 'ngộ kỳ phối chủ, tuy tuần vô cữu, vãng hữu thượng.', nghia: 'Gặp người chủ tương xứng với mình. Tuy ở cùng nhau trọn tuần cũng không lỗi; tiến tới thì được khen chuộng.' },
    { line: 2, label: '六二', han: '豐其蔀，日中見斗，往得疑疾，有孚發若，吉。', hanViet: 'phong kỳ bộ, nhật trung kiến đẩu, vãng đắc nghi tật, hữu phu phát nhược, cát.', nghia: 'Che lớn bằng tấm mành, giữa trưa mà thấy sao Bắc Đẩu. Tiến tới thì bị nghi ngờ ghét bỏ; nếu giữ lòng thành mà phát lộ ra thì tốt.' },
    { line: 3, label: '九三', han: '豐其沛，日中見沫，折其右肱，无咎。', hanViet: 'phong kỳ phái, nhật trung kiến muội, chiết kỳ hữu quăng, vô cữu.', nghia: 'Che lớn bằng màn dày, giữa trưa mà thấy sao nhỏ mờ. Gãy cánh tay phải; nhưng không có lỗi.' },
    { line: 4, label: '九四', han: '豐其蔀，日中見斗，遇其夷主，吉。', hanViet: 'phong kỳ bộ, nhật trung kiến đẩu, ngộ kỳ di chủ, cát.', nghia: 'Che lớn bằng tấm mành, giữa trưa mà thấy sao Bắc Đẩu. Gặp được người chủ ngang hàng với mình, tốt.' },
    { line: 5, label: '六五', han: '來章，有慶譽，吉。', hanViet: 'lai chương, hữu khánh dự, cát.', nghia: 'Vời người tài giỏi rực rỡ đến, có phúc lành và tiếng khen, tốt.' },
    { line: 6, label: '上六', han: '豐其屋，蔀其家，窺其戶，闃其无人，三歲不觌，凶。', hanViet: 'phong kỳ ốc, bộ kỳ gia, khuy kỳ hộ, khuých kỳ vô nhân, tam tuế bất địch, hung.', nghia: 'Nhà cửa to lớn nhưng che kín cả gia thất; nhìn vào cửa thì vắng lặng không một bóng người, ba năm chẳng gặp được ai, hung.' },
  ],
  56: [
    { line: 1, label: '初六', han: '旅瑣瑣，斯其所取災。', hanViet: 'lữ tỏa tỏa, tư kỳ sở thủ tai.', nghia: 'Kẻ lữ hành nhỏ nhen vụn vặt, chính vì thế mà tự chuốc lấy tai họa.' },
    { line: 2, label: '六二', han: '旅即次，懷其資，得童僕貞。', hanViet: 'lữ tức thứ, hoài kỳ tư, đắc đồng bộc trinh.', nghia: 'Người lữ hành tới được quán trọ, mang theo của cải, lại được tôi tớ trung thành chính trực.' },
    { line: 3, label: '九三', han: '旅焚其次，喪其童僕，貞厲。', hanViet: 'lữ phần kỳ thứ, táng kỳ đồng bộc, trinh lệ.', nghia: 'Người lữ hành để cháy quán trọ, mất cả tôi tớ; dù giữ chính cũng nguy.' },
    { line: 4, label: '九四', han: '旅于處，得其資斧，我心不快。', hanViet: 'lữ vu xứ, đắc kỳ tư phủ, ngã tâm bất khoái.', nghia: 'Người lữ hành tạm có chỗ ở, được tiền của và rìu phòng thân, nhưng lòng vẫn chẳng vui.' },
    { line: 5, label: '六五', han: '射雉一矢亡，終以譽命。', hanViet: 'xạ trĩ nhất thỉ vong, chung dĩ dự mệnh.', nghia: 'Bắn chim trĩ, mất một mũi tên, nhưng cuối cùng được khen ngợi và ban tước mệnh.' },
    { line: 6, label: '上九', han: '鳥焚其巢，旅人先笑后號咷。喪牛于易，凶。', hanViet: 'điểu phần kỳ sào, lữ nhân tiên tiếu hậu hào đào. táng ngưu vu dị, hung.', nghia: 'Chim bị cháy tổ; người lữ hành trước cười sau khóc than. Mất bò nơi đất Dị, hung.' },
  ],
  57: [
    { line: 1, label: '初六', han: '進退，利武人之貞。', hanViet: 'tiến thoái, lợi vũ nhân chi trinh.', nghia: 'Tiến lui do dự; nên giữ sự kiên định của người vũ dũng.' },
    { line: 2, label: '九二', han: '巽在牀下，用史巫紛若，吉无咎。', hanViet: 'tốn tại sàng hạ, dụng sử vu phân nhược, cát vô cữu.', nghia: 'Khiêm thuận đến mức nép dưới giường; nhờ thầy cúng, thầy bói cầu khấn rối rít, được tốt lành, không lỗi.' },
    { line: 3, label: '九三', han: '頻巽，吝。', hanViet: 'tần tốn, lận.', nghia: 'Khiêm thuận một cách miễn cưỡng lặp đi lặp lại, đáng tiếc.' },
    { line: 4, label: '六四', han: '悔亡，田獲三品。', hanViet: 'hối vong, điền hoạch tam phẩm.', nghia: 'Hối hận tiêu tan; đi săn được ba loại thú (thu hoạch lớn).' },
    { line: 5, label: '九五', han: '貞吉悔亡，无不利。无初有終，先庚三日，后庚三日，吉。', hanViet: 'trinh cát hối vong, vô bất lợi. vô sơ hữu chung, tiên canh tam nhật, hậu canh tam nhật, cát.', nghia: 'Giữ chính bền thì tốt, hối hận tiêu tan, không gì bất lợi. Không có khởi đầu tốt nhưng có kết cục tốt; ba ngày trước ngày canh, ba ngày sau ngày canh, tốt lành.' },
    { line: 6, label: '上九', han: '巽在牀下，喪其資斧，貞凶。', hanViet: 'tốn tại sàng hạ, táng kỳ tư phủ, trinh hung.', nghia: 'Khiêm thuận đến mức nép dưới giường, đánh mất tiền của và búa rìu (vốn liếng); giữ như vậy thì hung.' },
  ],
  58: [
    { line: 1, label: '初九', han: '和兌，吉。', hanViet: 'Hòa đoài, cát.', nghia: 'Hòa thuận vui vẻ, tốt lành.' },
    { line: 2, label: '九二', han: '孚兌，吉，悔亡。', hanViet: 'Phu đoài, cát, hối vong.', nghia: 'Lấy lòng thành tín mà vui, tốt, điều hối tiếc tiêu mất.' },
    { line: 3, label: '六三', han: '來兌，凶。', hanViet: 'Lai đoài, hung.', nghia: 'Tìm cách lấy lòng người để cầu vui, hung.' },
    { line: 4, label: '九四', han: '商兌，未寧，介疾有喜。', hanViet: 'Thương đoài, vị ninh, giới tật hữu hỷ.', nghia: 'Còn tính toán so đo cái vui, lòng chưa yên; nếu giữ giới hạn xa điều xấu thì có điều mừng.' },
    { line: 5, label: '九五', han: '孚于剝，有厲。', hanViet: 'Phu vu bác, hữu lệ.', nghia: 'Đặt lòng tin vào kẻ tiểu nhân hay bào mòn mình, có nguy.' },
    { line: 6, label: '上六', han: '引兌。', hanViet: 'Dẫn đoài.', nghia: 'Dụ dẫn, lôi kéo người khác để mua vui.' },
  ],
  59: [
    { line: 1, label: '初六', han: '用拯馬壯，吉。', hanViet: 'dụng chửng mã tráng, cát.', nghia: 'Dùng ngựa khỏe để cứu giúp, tốt lành.' },
    { line: 2, label: '九二', han: '渙奔其机，悔亡。', hanViet: 'hoán bôn kỳ cơ, hối vong.', nghia: 'Trong lúc ly tán, chạy đến nương tựa chỗ dựa vững, niềm hối tiếc tiêu tan.' },
    { line: 3, label: '六三', han: '渙其躬，无悔。', hanViet: 'hoán kỳ cung, vô hối.', nghia: 'Giải tan sự ràng buộc nơi bản thân, không có gì hối tiếc.' },
    { line: 4, label: '六四', han: '渙其群，元吉。渙有丘，匪夷所思。', hanViet: 'hoán kỳ quần, nguyên cát. hoán hữu khâu, phỉ di sở tư.', nghia: 'Giải tán bè đảng riêng, rất tốt lành. Tan rồi tụ thành gò lớn, đó không phải điều người thường nghĩ tới được.' },
    { line: 5, label: '九五', han: '渙汗其大號，渙王居，无咎。', hanViet: 'hoán hãn kỳ đại hào, hoán vương cư, vô cữu.', nghia: 'Ban bố hiệu lệnh lớn như mồ hôi thấm ra (đã phát thì không thu lại), tản phát của cải nơi vương cư, không lỗi.' },
    { line: 6, label: '上九', han: '渙其血，去逖出，无咎。', hanViet: 'hoán kỳ huyết, khứ địch xuất, vô cữu.', nghia: 'Giải tan nguy hại đổ máu, tránh xa lo sợ mà thoát ra, không lỗi.' },
  ],
  60: [
    { line: 1, label: '初九', han: '不出戶庭，无咎。', hanViet: 'Bất xuất hộ đình, vô cữu.', nghia: 'Không ra khỏi sân nhà, không lỗi. Biết giữ mình, im lặng đúng lúc nên không gặp tai họa.' },
    { line: 2, label: '九二', han: '不出門庭，凶。', hanViet: 'Bất xuất môn đình, hung.', nghia: 'Không ra khỏi cửa sân, xấu. Tiết chế quá mức, bỏ lỡ thời cơ nên gặp điều chẳng lành.' },
    { line: 3, label: '六三', han: '不節若，則嗟若，无咎。', hanViet: 'Bất tiết nhược, tắc ta nhược, vô cữu.', nghia: 'Không biết tiết chế thì sẽ phải than thở; nhưng tự biết hối nên không còn lỗi.' },
    { line: 4, label: '六四', han: '安節，亨。', hanViet: 'An tiết, hanh.', nghia: 'Yên ổn trong sự tiết chế, hanh thông. Giữ chừng mực một cách tự nhiên nên mọi việc suôn sẻ.' },
    { line: 5, label: '九五', han: '甘節，吉；往有尚。', hanViet: 'Cam tiết, cát; vãng hữu thượng.', nghia: 'Tiết chế một cách vui thuận, tốt lành; tiến tới thì được chuộng, được tôn trọng.' },
    { line: 6, label: '上六', han: '苦節，貞凶，悔亡。', hanViet: 'Khổ tiết, trinh hung, hối vong.', nghia: 'Tiết chế khắc khổ quá đáng, cố giữ thì xấu; nhưng biết thay đổi thì hối hận tiêu tan.' },
  ],
  61: [
    { line: 1, label: '初九', han: '虞吉，有他不燕。', hanViet: 'sơ cửu. ngu cát, hữu tha bất yến.', nghia: 'Liệu định sẵn (giữ lòng chuyên nhất) thì tốt; nếu có lòng khác thì chẳng được yên.' },
    { line: 2, label: '九二', han: '鳴鶴在陰，其子和之，我有好爵，吾與爾靡之。', hanViet: 'cửu nhị. minh hạc tại âm, kỳ tử hòa chi, ngã hữu hảo tước, ngô dữ nhĩ mĩ chi.', nghia: 'Hạc kêu nơi khuất, con nó họa theo; ta có chén rượu ngon, ta cùng ngươi chia hưởng. Lòng thành cảm ứng nhau dù xa cách.' },
    { line: 3, label: '六三', han: '得敵，或鼓或罷，或泣或歌。', hanViet: 'lục tam. đắc địch, hoặc cổ hoặc bãi, hoặc khấp hoặc ca.', nghia: 'Gặp đối thủ (kẻ tương đắc), lúc đánh trống lúc nghỉ, lúc khóc lúc hát. Lòng dao động không yên định.' },
    { line: 4, label: '六四', han: '月几望，馬匹亡，无咎。', hanViet: 'lục tứ. nguyệt cơ vọng, mã thất vong, vô cữu.', nghia: 'Trăng gần tròn; ngựa cùng đôi mất bạn (bỏ bè đảng để theo trên). Không lỗi.' },
    { line: 5, label: '九五', han: '有孚攣如，无咎。', hanViet: 'cửu ngũ. hữu phu luyến như, vô cữu.', nghia: 'Có lòng thành tín ràng buộc quy tụ mọi người lại. Không lỗi.' },
    { line: 6, label: '上九', han: '翰音登于天，貞凶。', hanViet: 'thượng cửu. hàn âm đăng vu thiên, trinh hung.', nghia: 'Tiếng gà (chỉ hư danh, lời suông) bay lên tận trời; giữ mãi như vậy thì hung.' },
  ],
  62: [
    { line: 1, label: '初六', han: '飛鳥以凶。', hanViet: 'phi điểu dĩ hung.', nghia: 'Chim bay lên cao, mang điều hung. Vượt quá phận mà liều lĩnh tiến, ắt gặp tai họa.' },
    { line: 2, label: '六二', han: '過其祖，遇其妣；不及其君，遇其臣；无咎。', hanViet: 'quá kỳ tổ, ngộ kỳ tỉ; bất cập kỳ quân, ngộ kỳ thần; vô cữu.', nghia: 'Vượt qua ông, gặp được bà; không vươn tới vua, mà gặp được bề tôi. Giữ đúng phận khiêm nhường nên không lỗi.' },
    { line: 3, label: '九三', han: '弗過防之，從或戕之，凶。', hanViet: 'phất quá phòng chi, tòng hoặc tường chi, hung.', nghia: 'Không quá đề phòng kẻ tiểu nhân, buông theo thì có thể bị chúng hãm hại, hung.' },
    { line: 4, label: '九四', han: '无咎，弗過遇之。往厲必戒，勿用永貞。', hanViet: 'vô cữu, phất quá ngộ chi. Vãng lệ tất giới, vật dụng vĩnh trinh.', nghia: 'Không lỗi, không vượt quá mà gặp được phải lẽ. Đi tới có nguy nên phải răn dè; chớ cố chấp giữ mãi một đường.' },
    { line: 5, label: '六五', han: '密云不雨，自我西郊，公弋取彼在穴。', hanViet: 'mật vân bất vũ, tự ngã tây giao, công dặc thủ bỉ tại huyệt.', nghia: 'Mây dày mà không mưa, từ cõi tây nhà ta. Bậc công dùng tên bắn lấy con vật ẩn trong hang.' },
    { line: 6, label: '上六', han: '弗遇過之，飛鳥離之，凶，是謂災眚。', hanViet: 'phất ngộ quá chi, phi điểu li chi, hung, thị vị tai sảnh.', nghia: 'Không gặp được phải lẽ mà vượt quá độ; như chim bay mắc vào lưới, hung. Đó gọi là tai họa cả từ trời lẫn do người gây ra.' },
  ],
  63: [
    { line: 1, label: '初九', han: '曳其輪，濡其尾，无咎。', hanViet: 'Duệ kỳ luân, nhu kỳ vĩ, vô cữu.', nghia: 'Kéo lê bánh xe lại, làm ướt cái đuôi; biết kiềm giữ, chậm rãi nên không lỗi.' },
    { line: 2, label: '六二', han: '婦喪其茀，勿逐，七日得。', hanViet: 'Phụ táng kỳ phất, vật trục, thất nhật đắc.', nghia: 'Người đàn bà mất tấm rèm che xe; chớ vội đuổi theo tìm, bảy ngày sẽ lấy lại được.' },
    { line: 3, label: '九三', han: '高宗伐鬼方，三年克之，小人勿用。', hanViet: 'Cao tông phạt quỷ phương, tam niên khắc chi, tiểu nhân vật dụng.', nghia: 'Vua Cao Tông đánh nước Quỷ Phương, ba năm mới thắng; chớ dùng kẻ tiểu nhân vào việc lớn.' },
    { line: 4, label: '六四', han: '繻有衣袽，終日戒。', hanViet: 'Nhu hữu y nhữ, chung nhật giới.', nghia: 'Thuyền rỉ nước, có sẵn giẻ rách để vá; suốt ngày phải đề phòng cảnh giác.' },
    { line: 5, label: '九五', han: '東鄰殺牛，不如西鄰之禴祭，實受其福。', hanViet: 'Đông lân sát ngưu, bất như tây lân chi thược tế, thực thụ kỳ phúc.', nghia: 'Nhà phía đông giết bò cúng lớn, không bằng lễ cúng đạm bạc của nhà phía tây mà thật lòng được hưởng phúc.' },
    { line: 6, label: '上六', han: '濡其首，厲。', hanViet: 'Nhu kỳ thủ, lệ.', nghia: 'Để ướt cả cái đầu, nguy hiểm.' },
  ],
  64: [
    { line: 1, label: '初六', han: '濡其尾，吝。', hanViet: 'Nhu kì vĩ, lận.', nghia: 'Ướt cái đuôi, đáng tiếc.' },
    { line: 2, label: '九二', han: '曳其輪，貞吉。', hanViet: 'Duệ kì luân, trinh cát.', nghia: 'Kéo lê bánh xe lại, giữ chính bền thì tốt.' },
    { line: 3, label: '六三', han: '未濟，征凶，利涉大川。', hanViet: 'Vị tế, chinh hung, lợi thiệp đại xuyên.', nghia: 'Việc chưa xong, tiến lên thì hung, nhưng lợi cho việc vượt sông lớn.' },
    { line: 4, label: '九四', han: '貞吉，悔亡，震用伐鬼方，三年有賞于大國。', hanViet: 'Trinh cát, hối vong, chấn dụng phạt quỷ phương, tam niên hữu thưởng vu đại quốc.', nghia: 'Giữ chính bền thì tốt, hối hận tiêu mất; hăng hái dùng binh đánh nước Quỷ Phương, ba năm được thưởng nơi nước lớn.' },
    { line: 5, label: '六五', han: '貞吉，无悔，君子之光，有孚，吉。', hanViet: 'Trinh cát, vô hối, quân tử chi quang, hữu phu, cát.', nghia: 'Giữ chính bền thì tốt, không hối hận; là ánh sáng của người quân tử, có lòng thành tín, tốt lành.' },
    { line: 6, label: '上九', han: '有孚于飲酒，无咎，濡其首，有孚失是。', hanViet: 'Hữu phu vu ẩm tửu, vô cữu, nhu kì thủ, hữu phu thất thị.', nghia: 'Có lòng thành tín mà uống rượu thì không lỗi; nhưng ướt cả đầu, dù có lòng thành cũng mất lẽ phải.' },
  ],
};

/** 用九 (quẻ 1 Càn) / 用六 (quẻ 2 Khôn) — chỉ hiện khi cả 6 hào đều động. */
export const HAO_TU_EXTRA: Record<number, HaoTuExtra> = {
  1: { label: '用九', han: '見羣龍无首，吉。', hanViet: 'Hiện quần long vô thủ, cát.', nghia: 'Thấy bầy rồng mà không con nào tranh đứng đầu, tốt lành. Cứng mà biết mềm, không cố chấp ngôi đầu thì được cát tường.' },
  2: { label: '用六', han: '利永貞。', hanViet: 'lợi vĩnh trinh.', nghia: 'Lợi ở việc giữ chính bền lâu dài.' },
};

/** Tra lời hào theo id quẻ + vị trí hào (1..6). */
export function getHaoTu(id: number, line: number): HaoTuLine | undefined {
  return HAO_TU[id]?.find((l) => l.line === line);
}

/** Tra 用九/用六 (chỉ quẻ 1 & 2). */
export function getHaoTuExtra(id: number): HaoTuExtra | undefined {
  return HAO_TU_EXTRA[id];
}
