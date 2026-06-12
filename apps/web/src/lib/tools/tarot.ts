// hieu.asia — Tarot engine (78 lá). Client-side draw, seeded shuffle.
// Brand: KHÔNG bói toán/tiên đoán — mỗi lá là một LĂNG KÍNH để tự suy ngẫm.
// Nghĩa viết theo khung "gợi ý phản tư + cách ứng xử", không phán định mệnh.

export type CardOrientation = 'upright' | 'reversed';
export type Arcana = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: number;
  name: string;
  name_vi: string;
  arcana: Arcana;
  suit?: Suit;
  up: string; // gợi ý khi xuôi
  rev: string; // gợi ý khi ngược
}

export interface DrawnCard {
  card: TarotCard;
  orientation: CardOrientation;
}

const MAJOR: Omit<TarotCard, 'id' | 'arcana'>[] = [
  { name: 'The Fool', name_vi: 'Gã Khờ', up: 'khởi đầu mới, dám bước dù chưa chắc chắn', rev: 'liều lĩnh thiếu chuẩn bị; cân nhắc trước khi nhảy' },
  { name: 'The Magician', name_vi: 'Nhà Ảo Thuật', up: 'bạn đã có đủ công cụ — vấn đề là bắt tay làm', rev: 'tài nguyên bị bỏ phí hoặc dùng sai mục đích' },
  { name: 'The High Priestess', name_vi: 'Nữ Tư Tế', up: 'lắng nghe trực giác, điều chưa nói ra', rev: 'đang phớt lờ tiếng nói bên trong' },
  { name: 'The Empress', name_vi: 'Nữ Hoàng', up: 'nuôi dưỡng, sáng tạo, để mọi thứ lớn theo nhịp', rev: 'cho đi quá mức hoặc bỏ bê chăm sóc bản thân' },
  { name: 'The Emperor', name_vi: 'Hoàng Đế', up: 'cấu trúc, kỷ luật, làm chủ tình huống', rev: 'cứng nhắc hoặc kiểm soát quá tay' },
  { name: 'The Hierophant', name_vi: 'Giáo Hoàng', up: 'học từ truyền thống, người đi trước', rev: 'phá khuôn — tự tìm con đường riêng' },
  { name: 'The Lovers', name_vi: 'Đôi Tình Nhân', up: 'một lựa chọn về giá trị và sự gắn kết', rev: 'lệch giá trị; xem lại điều mình thật sự muốn' },
  { name: 'The Chariot', name_vi: 'Cỗ Xe', up: 'tiến lên bằng ý chí và tập trung', rev: 'mất hướng hoặc kéo hai phía ngược nhau' },
  { name: 'Strength', name_vi: 'Sức Mạnh', up: 'kiên nhẫn dịu dàng mạnh hơn ép buộc', rev: 'nghi ngờ bản thân; nuôi lại sự tự tin' },
  { name: 'The Hermit', name_vi: 'Ẩn Sĩ', up: 'lùi lại, dành thời gian một mình để thấy rõ', rev: 'cô lập quá mức; cần kết nối lại' },
  { name: 'Wheel of Fortune', name_vi: 'Bánh Xe Số Phận', up: 'một chu kỳ đang chuyển — thích nghi', rev: 'cảm giác mắc kẹt; điều gì lặp lại bạn nắm được' },
  { name: 'Justice', name_vi: 'Công Lý', up: 'cân nhắc công bằng, nhận trách nhiệm hệ quả', rev: 'né tránh sự thật hoặc thiên vị' },
  { name: 'The Hanged Man', name_vi: 'Người Treo Ngược', up: 'đổi góc nhìn; tạm dừng để hiểu khác đi', rev: 'trì hoãn vô ích; đã đến lúc hành động' },
  { name: 'Death', name_vi: 'Cái Chết', up: 'kết thúc để mở chỗ cho cái mới', rev: 'níu kéo điều nên buông' },
  { name: 'Temperance', name_vi: 'Tiết Độ', up: 'cân bằng, pha trộn vừa phải, đi đường dài', rev: 'thái quá hoặc mất nhịp' },
  { name: 'The Devil', name_vi: 'Ác Quỷ', up: 'nhìn lại ràng buộc/thói quen đang giữ bạn', rev: 'bắt đầu cởi bỏ một xiềng xích' },
  { name: 'The Tower', name_vi: 'Tòa Tháp', up: 'một đổ vỡ phơi bày sự thật — xây lại vững hơn', rev: 'tránh được khủng hoảng nếu chịu thay đổi sớm' },
  { name: 'The Star', name_vi: 'Ngôi Sao', up: 'hy vọng, chữa lành, niềm tin nhẹ nhõm', rev: 'mất niềm tin tạm thời; tự cho mình nghỉ' },
  { name: 'The Moon', name_vi: 'Mặt Trăng', up: 'mơ hồ, nỗi sợ chưa rõ — đừng vội kết luận', rev: 'sương mù đang tan, sự thật dần hiện' },
  { name: 'The Sun', name_vi: 'Mặt Trời', up: 'rõ ràng, sức sống, niềm vui giản dị', rev: 'lạc quan che mắt; nhìn cả mặt khuất' },
  { name: 'Judgement', name_vi: 'Phán Xét', up: 'tự nhìn lại, một lời gọi thức tỉnh', rev: 'phán xét bản thân quá nặng' },
  { name: 'The World', name_vi: 'Thế Giới', up: 'hoàn tất một chặng, trọn vẹn', rev: 'gần xong — đừng bỏ dở phút chót' },
];

// 56 lá Ẩn phụ — nghĩa VIẾT TAY từng lá (nâng cấp 2026-06: trước đây sinh theo khuôn
// rank×suit nên 4 lá cùng hạng đọc na ná nhau). Thứ tự BẮT BUỘC giữ nguyên:
// Gậy → Cốc → Kiếm → Tiền, mỗi chất Át → Vua (id 22..77 — giữ cho seed/share/lá-của-ngày tái lập đúng lá).
const MINOR: Omit<TarotCard, 'id' | 'arcana'>[] = [
  // ===== GẬY (Wands) — hành động · đam mê · năng lượng =====
  { name: 'Ace of Wands', name_vi: 'Át Gậy', suit: 'wands', up: 'tia cảm hứng mới — biến hứng thành một bước thử ngay tuần này', rev: 'ý tưởng nằm trên giấy mãi; hứng tắt vì chưa có bước đầu' },
  { name: 'Two of Wands', name_vi: 'Hai Gậy', suit: 'wands', up: 'ngắm bản đồ, dám hoạch định lớn hơn hiện tại', rev: 'kế hoạch không có ngày bắt đầu; an toàn quá lâu' },
  { name: 'Three of Wands', name_vi: 'Ba Gậy', suit: 'wands', up: 'việc đã có trớn — chuẩn bị bến cho thuyền về, nghĩ chuyện mở rộng', rev: 'kết quả về chậm hơn hẹn; xem lại kỳ vọng trước khi nản' },
  { name: 'Four of Wands', name_vi: 'Bốn Gậy', suit: 'wands', up: 'cột mốc đáng mừng — dừng lại ăn mừng cho tử tế', rev: 'cột mốc bị bỏ quên; cảm giác "nhà" đang lung lay' },
  { name: 'Five of Wands', name_vi: 'Năm Gậy', suit: 'wands', up: 'ý kiến va nhau lành mạnh — đánh vào vấn đề, đừng vào người', rev: 'cãi vã vô ích, hoặc né một cuộc tranh luận cần thiết' },
  { name: 'Six of Wands', name_vi: 'Sáu Gậy', suit: 'wands', up: 'tin vui, được công nhận — nhận lời khen một cách đàng hoàng', rev: 'thành tích rỗng bên trong, hoặc nỗ lực thật chưa ai thấy' },
  { name: 'Seven of Wands', name_vi: 'Bảy Gậy', suit: 'wands', up: 'giữ vững lập trường đã suy xét kỹ — vị thế cao đừng tự bỏ', rev: 'đuối vì phòng thủ quá lâu; xem thứ đang cố thủ còn đáng không' },
  { name: 'Eight of Wands', name_vi: 'Tám Gậy', suit: 'wands', up: 'mọi thứ tăng tốc — trả lời nhanh, đừng để cơ hội nguội', rev: 'trì trệ chờ đợi, hoặc quá nhiều thứ đến cùng lúc thành nhiễu' },
  { name: 'Nine of Wands', name_vi: 'Chín Gậy', suit: 'wands', up: 'chặng cuối — mệt nhưng gần đích hơn cảm giác', rev: 'kiệt sức, hoặc vết cũ làm phòng thủ cả với người tốt' },
  { name: 'Ten of Wands', name_vi: 'Mười Gậy', suit: 'wands', up: 'ôm quá nhiều vai — cây gậy nào thật sự phải là của bạn?', rev: 'bắt đầu buông bớt, giao bớt, học từ chối' },
  { name: 'Page of Wands', name_vi: 'Thị Đồng Gậy', suit: 'wands', up: 'tò mò, dám thử cái mới với con mắt lần đầu', rev: 'cả thèm chóng chán; tò mò chưa có điểm đáp' },
  { name: 'Knight of Wands', name_vi: 'Hiệp Sĩ Gậy', suit: 'wands', up: 'lao tới điều mình muốn một cách dứt khoát', rev: 'bốc đồng, hứa trong cơn hứng rồi nguội giữa chừng' },
  { name: 'Queen of Wands', name_vi: 'Hoàng Hậu Gậy', suit: 'wands', up: 'tự tin ấm áp — nhận vai chính trong đời mình', rev: 'cạn pin phải gồng tươi; so sánh ngầm với người rực rỡ hơn' },
  { name: 'King of Wands', name_vi: 'Vua Gậy', suit: 'wands', up: 'dẫn dắt bằng tầm nhìn — vẽ chân trời rõ cho người cùng đi', rev: 'tầm nhìn thành áp đặt; kỳ vọng cao đốt người làm cùng' },
  // ===== CỐC (Cups) — cảm xúc · quan hệ · trực giác =====
  { name: 'Ace of Cups', name_vi: 'Át Cốc', suit: 'cups', up: 'tim mở lại — đón cảm xúc mới thay vì phân tích nó', rev: 'điều muốn bày tỏ bị nuốt vào; cho đi mà quên chén mình' },
  { name: 'Two of Cups', name_vi: 'Hai Cốc', suit: 'cups', up: 'kết nối hai chiều, ngang tầm mắt — cho và nhận cân nhau', rev: 'nhịp đôi bên lệch; một vết rạn nhỏ chưa ai gọi tên' },
  { name: 'Three of Cups', name_vi: 'Ba Cốc', suit: 'cups', up: 'niềm vui được chia — tụ lại với những người "cùng phe đời"', rev: 'xã giao đông mà rỗng; cảm giác đứng ngoài vòng tròn' },
  { name: 'Four of Cups', name_vi: 'Bốn Cốc', suit: 'cups', up: 'chán giữa no đủ — thử con mắt mới trước khi đòi thứ mới', rev: 'tỉnh ra, thấy "chén thứ tư" đang được chìa ngay bên cạnh' },
  { name: 'Five of Cups', name_vi: 'Năm Cốc', suit: 'cups', up: 'buồn cho trọn phần đã đổ — hai chén sau lưng vẫn nguyên', rev: 'bắt đầu quay người: thấy thứ còn lại, kể chuyện cũ nhẹ hơn' },
  { name: 'Six of Cups', name_vi: 'Sáu Cốc', suit: 'cups', up: 'ký ức ấm, người cũ chốn cũ — múc nước từ giếng gốc rễ', rev: 'kẹt trong "ngày xưa" được tô đẹp; ký ức là chỗ thăm, không phải chỗ ở' },
  { name: 'Seven of Cups', name_vi: 'Bảy Cốc', suit: 'cups', up: 'nhiều viễn cảnh lấp lánh — mơ là nguyên liệu, chưa phải món ăn', rev: 'tỉnh mộng: gạch bớt lựa chọn, chọn một thứ để cam kết' },
  { name: 'Eight of Cups', name_vi: 'Tám Cốc', suit: 'cups', up: 'rời cái đủ-mà-thiếu để đi tìm cái đúng', rev: 'biết phải đi mà chân chưa nhấc; hoặc đi mà chưa rõ tìm gì' },
  { name: 'Nine of Cups', name_vi: 'Chín Cốc', suit: 'cups', up: 'toại nguyện — cho phép mình nhận là "mình đang ổn"', rev: 'thỏa mãn để khoe; điều ước thành hóa ra là ước đi mượn' },
  { name: 'Ten of Cups', name_vi: 'Mười Cốc', suit: 'cups', up: 'viên mãn tình thân — công trình của nhiều năm vun, tiếp tục bảo trì', rev: 'bức tranh đẹp che vết rạn; kỳ vọng cổ tích chấm rớt hạnh phúc thật' },
  { name: 'Page of Cups', name_vi: 'Thị Đồng Cốc', suit: 'cups', up: 'tín hiệu cảm xúc bất ngờ — đừng vội chê nó "vớ vẩn"', rev: 'nhạy cảm thành dễ vỡ; mơ mộng thành thoát ly' },
  { name: 'Knight of Cups', name_vi: 'Hiệp Sĩ Cốc', suit: 'cups', up: 'lời mời từ trái tim — làm điều đẹp một cách tử tế', rev: 'lời ngọt nhiều hơn việc làm; cảm xúc dâng nhanh rút nhanh' },
  { name: 'Queen of Cups', name_vi: 'Hoàng Hậu Cốc', suit: 'cups', up: 'thấu cảm sâu mà vẫn giữ được mình — chén có nắp, chân trên bờ', rev: 'thấm nỗi người đến kiệt; ranh giới nhòe' },
  { name: 'King of Cups', name_vi: 'Vua Cốc', suit: 'cups', up: 'điềm tĩnh giữa sóng — cảm đủ nhưng không để sóng cầm lái', rev: 'nén cảm xúc thành xa cách; bình tĩnh giả đóng băng người gần' },
  // ===== KIẾM (Swords) — tư duy · lời nói · sự thật =====
  { name: 'Ace of Swords', name_vi: 'Át Kiếm', suit: 'swords', up: 'đầu óc bừng rõ — gọi đúng tên vấn đề, dùng độ sắc ngay', rev: 'rối trí, thông tin nhiễu; đừng quyết lớn lúc này' },
  { name: 'Two of Swords', name_vi: 'Hai Kiếm', suit: 'swords', up: 'bế tắc lựa chọn — không quyết cũng là một quyết định, thường đắt nhất', rev: 'thế cân đang vỡ; được buộc phải chọn đôi khi là ơn' },
  { name: 'Three of Swords', name_vi: 'Ba Kiếm', suit: 'swords', up: 'nỗi đau từ sự thật — đau nhưng giải phóng khỏi một ảo tưởng đắt hơn', rev: 'vết thương bắt đầu khép; đến lúc rút kiếm ra khỏi tim' },
  { name: 'Four of Swords', name_vi: 'Bốn Kiếm', suit: 'swords', up: 'nghỉ có chủ đích — kiếm treo lên chứ không gãy', rev: 'ép mình chạy khi đèn đã đỏ; hoặc kỳ nghỉ thành nơi trốn' },
  { name: 'Five of Swords', name_vi: 'Năm Kiếm', suit: 'swords', up: 'thắng keo này mất gì? — nhìn tổng sổ trước khi hơn thua', rev: 'buông cuộc cãi không lối ra; có trận thắng cũ đáng một lời xin lỗi' },
  { name: 'Six of Swords', name_vi: 'Sáu Kiếm', suit: 'swords', up: 'chuyến đò sang trang — mang bài học theo như hành lý, không để nó dìm thuyền', rev: 'thân đã đi mà đầu còn ở bến cũ; đi mà chưa dứt thì chưa phải đi' },
  { name: 'Seven of Swords', name_vi: 'Bảy Kiếm', suit: 'swords', up: 'đi đường vòng khôn khéo — nhưng nếu bị thấy toàn cảnh, bạn còn ổn không?', rev: 'nước đi vụng lộ ra; người bị lừa khéo nhất có khi là chính mình' },
  { name: 'Eight of Swords', name_vi: 'Tám Kiếm', suit: 'swords', up: 'nhà tù xây bằng ý nghĩ — dây trói lỏng hơn cảm giác nhiều', rev: 'dải bịt mắt đang tuột: thử cái "không thể" và thấy nó được' },
  { name: 'Nine of Swords', name_vi: 'Chín Kiếm', suit: 'swords', up: 'lo âu ba giờ sáng — kiếm treo trên tường, không đâm vào người', rev: 'trời sáng dần: nỗi sợ viết ra giấy ngắn hơn tưởng' },
  { name: 'Ten of Swords', name_vi: 'Mười Kiếm', suit: 'swords', up: 'kết thúc dứt điểm — món quà lạnh lùng là sự RÕ RÀNG, và bình minh phía sau', rev: 'đang gượng dậy; hoặc tình huống chưa "mười kiếm" như cảm giác' },
  { name: 'Page of Swords', name_vi: 'Thị Đồng Kiếm', suit: 'swords', up: 'óc tò mò háo hức — thu thập, hỏi tới gốc trước khi quyết', rev: 'lời vội cứa người; tranh luận để tỏ ra sắc' },
  { name: 'Knight of Swords', name_vi: 'Hiệp Sĩ Kiếm', suit: 'swords', up: 'thấy rõ việc phải làm và làm ngay, nói thẳng điều phải nói', rev: 'tốc độ thiếu vô lăng — tin nhắn lúc sôi để ngăn nháp tới mai' },
  { name: 'Queen of Swords', name_vi: 'Hoàng Hậu Kiếm', suit: 'swords', up: 'hỏi thẳng đáp thật, ranh giới rõ — sự rõ ràng là một dạng tử tế', rev: 'sắc thành giáp lạnh; kiếm để cắt sự dối, không phải cắt sự gần' },
  { name: 'King of Swords', name_vi: 'Vua Kiếm', suit: 'swords', up: 'quyết bằng tiêu chí đặt trước — cảm xúc được nghe nhưng không cầm bút ký', rev: 'đúng quy trình mà mất con người; lập luận dùng để áp đảo' },
  // ===== TIỀN (Pentacles) — công việc · vật chất · sức khỏe =====
  { name: 'Ace of Pentacles', name_vi: 'Át Tiền', suit: 'pentacles', up: 'cơ hội thật, cầm được — hạt giống cần trồng xuống, không phải ngắm', rev: 'cơ hội nguội vì chần chừ; kế hoạch chưa bám đất' },
  { name: 'Two of Pentacles', name_vi: 'Hai Tiền', suit: 'pentacles', up: 'tung hứng nhiều vai — biết quả nào thủy tinh, quả nào cao su', rev: 'số bóng vượt số tay; chủ động hạ một quả trước khi nó tự rơi' },
  { name: 'Three of Pentacles', name_vi: 'Ba Tiền', suit: 'pentacles', up: 'tay nghề gặp đúng sân — mỗi người một vai, công trình thành hình', rev: 'vai lệch, ôm hết vì "không tin ai"; làm-cho-xong thứ đáng làm-cho-tới' },
  { name: 'Four of Pentacles', name_vi: 'Bốn Tiền', suit: 'pentacles', up: 'giữ chắc, phòng thân — nhưng giữ đến mức nào thì nó giữ ngược lại bạn?', rev: 'nới tay đúng lúc cho học hành, sức khỏe; hoặc cơn sợ mất đang siết thêm' },
  { name: 'Five of Pentacles', name_vi: 'Năm Tiền', suit: 'pentacles', up: 'mùa đông vật chất — ô cửa sáng gần hơn bạn tưởng, nhưng phải gõ', rev: 'tuyết đang tan; bạn vừa làm điều khó nhất: mở miệng nhờ' },
  { name: 'Six of Pentacles', name_vi: 'Sáu Tiền', suit: 'pentacles', up: 'cho và nhận đúng cách — quan trọng là dòng chảy còn thông', rev: 'món quà kèm dây trói; lòng tốt có điều kiện là hợp đồng trá hình' },
  { name: 'Seven of Pentacles', name_vi: 'Bảy Tiền', suit: 'pentacles', up: 'đứng tựa cuốc đánh giá vụ mùa — kiên nhẫn với đúng cây', rev: 'sốt ruột nhổ cây xem rễ; hoặc tiếc công tưới mãi đất cằn' },
  { name: 'Eight of Pentacles', name_vi: 'Tám Tiền', suit: 'pentacles', up: 'mài tay nghề bằng lặp lại có chủ đích — khắc đồng sau tốt hơn đồng trước một li', rev: 'làm như máy mất chữ chủ đích; đứt mạch rèn ở đoạn "chưa giỏi"' },
  { name: 'Nine of Pentacles', name_vi: 'Chín Tiền', suit: 'pentacles', up: 'tự chủ — vườn mình trồng, tận hưởng một mình mà vẫn đầy', rev: 'vườn đẹp mà chủ vườn cô đơn; "tự do" đứng trên nền nợ' },
  { name: 'Ten of Pentacles', name_vi: 'Mười Tiền', suit: 'pentacles', up: 'xây thứ còn lại sau mình — nền cho nhiều đời, không chỉ một đời', rev: 'của để dành thành mồi tranh chấp; bề thế ngoài, lạnh tanh trong' },
  { name: 'Page of Pentacles', name_vi: 'Thị Đồng Tiền', suit: 'pentacles', up: 'học-để-làm — "đồng tiền đầu tiên" nhỏ mà thật', rev: 'sưu tầm khóa học, kế hoạch mãi không tới ngày bắt đầu' },
  { name: 'Knight of Pentacles', name_vi: 'Hiệp Sĩ Tiền', suit: 'pentacles', up: 'chậm mà chắc — sáng nào cũng ra ruộng, tiến 1% mỗi ngày', rev: 'chậm rơi mất chữ chắc; cầu toàn thành cớ chưa ra mắt' },
  { name: 'Queen of Pentacles', name_vi: 'Hoàng Hậu Tiền', suit: 'pentacles', up: 'vun vén thiết thực — biến nguồn lực hữu hạn thành đời sống đầy đặn', rev: 'chăm cả nhà trừ chính mình; chu toàn nuôi oán thầm' },
  { name: 'King of Pentacles', name_vi: 'Vua Tiền', suit: 'pentacles', up: 'vững vàng và rộng tay — dùng của cải che chở người khác', rev: 'đo mọi thứ bằng tiền; giàu nhất phòng họp, nghèo nhất bàn ăn' },
];

/** Bộ bài đầy đủ 78 lá. */
export const DECK: TarotCard[] = [
  ...MAJOR.map((c, i) => ({ ...c, id: i, arcana: 'major' as const })),
  ...MINOR.map((c, i) => ({ ...c, id: 22 + i, arcana: 'minor' as const })),
];

// Seeded RNG (mulberry32) cho draw tái lập (vd lá của ngày). Không seed → Math.random.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Rút n lá từ bộ 78. Fisher-Yates shuffle + orientation xuôi/ngược.
 * @param n số lá (1–10)
 * @param seed tùy chọn — cùng seed cho cùng kết quả (vd seed theo ngày)
 */
export function drawCards(n: number, seed?: number): DrawnCard[] {
  const count = Math.max(1, Math.min(10, Math.floor(n)));
  const rand = seed === undefined ? Math.random : mulberry32(seed);
  const deck = DECK.slice();
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = deck[i]!;
    deck[i] = deck[j]!;
    deck[j] = tmp;
  }
  return deck.slice(0, count).map((card) => ({
    card,
    orientation: rand() < 0.5 ? 'reversed' : 'upright',
  }));
}

/**
 * Lá của ngày — seed theo NGÀY (giờ VN, UTC+7) → một lá cố định suốt cả ngày,
 * CHUNG cho mọi người. KHÔNG phải tiên đoán về ngày của bạn — chỉ là một lá để
 * dừng lại và ngẫm; ý nghĩa nằm ở điều chính bạn soi thấy.
 * Thuần hàm (server-safe): cùng ngày ⇒ cùng lá + cùng chiều.
 */
export function cardOfTheDay(now: Date = new Date()): { drawn: DrawnCard; dateLabel: string } {
  const vn = new Date(now.getTime() + 7 * 3600_000); // UTC+7
  const y = vn.getUTCFullYear();
  const m = vn.getUTCMonth() + 1;
  const d = vn.getUTCDate();
  const drawn = drawCards(1, y * 10000 + m * 100 + d)[0]!;
  const dateLabel = `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  return { drawn, dateLabel };
}
