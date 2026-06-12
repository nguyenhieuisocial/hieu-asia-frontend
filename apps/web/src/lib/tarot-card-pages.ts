// hieu.asia — Nội dung trang ý nghĩa 22 lá Ẩn chính (Major Arcana).
// Nghĩa theo truyền thống Rider–Waite–Smith, viết lại bằng giọng phản tư của site:
// lá bài GỢI CÂU HỎI, người đọc giữ câu trả lời — không phán định mệnh, không hù dọa.
// Tách khỏi lib/tools/tarot.ts (engine rút bài) vì đây là dữ liệu BIÊN TẬP cho trang tĩnh.

import { MINOR_PAGES } from './tarot-card-pages-minor';

export interface TarotCardPage {
  slug: string;
  name: string; // tên tiếng Anh (người Việt tìm kiếm chủ yếu bằng tên này)
  name_vi: string;
  number: number; // Ẩn chính: 0–21 theo RWS · Ẩn phụ: 1–14 (Át → Vua) trong chất
  arcana?: 'major' | 'minor'; // mặc định (không khai) = major
  suit_vi?: string; // Ẩn phụ: Gậy · Cốc · Kiếm · Tiền
  keyUp: string[]; // từ khóa nghĩa xuôi
  keyRev: string[]; // từ khóa nghĩa ngược
  image: string; // hình ảnh biểu tượng trên lá (hệ RWS)
  up: string; // nghĩa xuôi — đoạn văn
  rev: string; // nghĩa ngược — đoạn văn (khung "mặt trầm", không phải điềm xấu)
  love: string; // góc tình cảm – quan hệ
  work: string; // góc công việc – tiền bạc
  reflect: string[]; // câu hỏi tự soi
  ease?: string; // lời trấn an cho các lá hay bị hù dọa
}

export const MAJOR_PAGES: TarotCardPage[] = [
  {
    slug: 'the-fool',
    name: 'The Fool',
    name_vi: 'Gã Khờ',
    number: 0,
    keyUp: ['khởi đầu mới', 'hồn nhiên', 'dám bước', 'tự do'],
    keyRev: ['liều lĩnh', 'thiếu chuẩn bị', 'ngại bắt đầu'],
    image:
      'Một người trẻ đứng sát mép vực, mặt ngẩng lên trời, tay nải nhỏ trên vai và bông hồng trắng trên tay; chú chó nhỏ nhảy bên chân như vừa cảnh báo vừa cổ vũ. Mang số 0 — chưa là gì cả, nên có thể trở thành bất cứ điều gì.',
    up: 'Gã Khờ là lá của những khởi đầu chưa có gì bảo đảm: việc mới, nơi ở mới, một mối quan hệ vừa chớm, một ý tưởng chưa ai tin. Nó gợi tinh thần bước đi với sự tò mò thay vì chờ đủ 100% chắc chắn — vì hầu hết những điều đáng giá đều bắt đầu khi ta chưa sẵn sàng hoàn toàn. Lá này không bảo bạn nhắm mắt nhảy, nó hỏi: nếu bớt sợ đi một nửa, bạn sẽ bắt đầu từ đâu?',
    rev: 'Ở chiều ngược, năng lượng khởi đầu ấy đang lệch nhịp: hoặc bạn lao đi mà chưa nhìn xuống chân (hứa hẹn vội, ký vội, yêu vội), hoặc ngược lại — đứng mãi ở mép vực vì đợi một sự chắc chắn không bao giờ đến. Đáng xem lại: cái bạn gọi là "thận trọng" có thực sự là thận trọng, hay là sợ?',
    love: 'Trong tình cảm, Gã Khờ thường chạm vào giai đoạn mới quen hoặc cảm giác muốn làm mới một mối quan hệ đã cũ. Nó gợi sự chân thật không tính toán — nhưng cũng nhắc rằng hồn nhiên khác với vô tâm.',
    work: 'Về công việc, lá này hay xuất hiện khi bạn cân nhắc đổi hướng, học nghề mới, khởi sự riêng. Câu hỏi nó đặt ra không phải "có chắc thành công không" mà là "bước thử nhỏ nhất, ít rủi ro nhất mình có thể làm tuần này là gì".',
    reflect: [
      'Điều gì bạn đã muốn bắt đầu từ lâu nhưng cứ đợi "đủ sẵn sàng"?',
      'Nếu thất bại không ai biết, bạn có làm không? Câu trả lời nói gì về nỗi sợ của bạn?',
    ],
  },
  {
    slug: 'the-magician',
    name: 'The Magician',
    name_vi: 'Nhà Ảo Thuật',
    number: 1,
    keyUp: ['đủ công cụ', 'chủ động', 'biến ý thành việc', 'tập trung'],
    keyRev: ['tài nguyên bỏ phí', 'nói nhiều làm ít', 'dùng sai chỗ'],
    image:
      'Một người đứng trước bàn bày đủ bốn biểu tượng — gậy, cốc, kiếm, đồng tiền — một tay chỉ trời, một tay chỉ đất, trên đầu là ký hiệu vô cực. Mọi nguyên liệu đã có mặt; việc còn lại là bắt tay làm.',
    up: 'Nhà Ảo Thuật nói một điều rất thực tế: bạn đã có đủ — kỹ năng, mối quan hệ, kinh nghiệm, công cụ — để bắt đầu điều đang nghĩ trong đầu. Lá này xuất hiện như lời nhắc rằng khoảng cách giữa ý tưởng và kết quả không nằm ở việc thiếu thứ gì, mà ở việc chưa xếp những thứ đang có thành một hành động cụ thể. Sức mạnh của nó là sự tập trung: một mục tiêu, một việc, làm tới nơi.',
    rev: 'Chiều ngược của lá này là cảm giác "có tiềm năng mà mãi chưa thành hình": tài nguyên rải rác, bắt đầu nhiều thứ nhưng không thứ nào tới đích, hoặc dùng sự khéo léo của mình vào việc không đáng. Đôi khi nó còn chạm vào kiểu người nói rất hay về dự định — và chỉ dừng ở nói.',
    love: 'Trong quan hệ, Nhà Ảo Thuật gợi sự chủ động: nói rõ điều mình muốn thay vì chờ người kia đoán. Ở mặt trầm, để ý xem có ai đang "diễn" nhiều hơn là thật — kể cả chính mình.',
    work: 'Đây là một trong những lá thuận nhất cho công việc: kỹ năng đang khớp với cơ hội. Hãy chọn một dự án cụ thể để dồn lực thay vì rải đều — và bắt đầu bằng việc nhỏ có thể xong trong hôm nay.',
    reflect: [
      'Bạn đang chờ thêm điều kiện gì — và nếu nhìn kỹ, nó có thật sự cần không?',
      'Nếu chỉ được giữ một dự định để làm tới cùng, bạn giữ cái nào?',
    ],
  },
  {
    slug: 'the-high-priestess',
    name: 'The High Priestess',
    name_vi: 'Nữ Tư Tế',
    number: 2,
    keyUp: ['trực giác', 'im lặng quan sát', 'điều chưa nói ra', 'chiều sâu'],
    keyRev: ['phớt lờ linh cảm', 'ồn ào lấn át', 'tự cắt khỏi cảm nhận'],
    image:
      'Người phụ nữ ngồi giữa hai cây cột sáng – tối, sau lưng là tấm rèm thêu lựu che một vùng nước sâu, tay giữ cuộn sách hé mở. Không phải mọi điều đáng biết đều được nói thành lời.',
    up: 'Nữ Tư Tế là lá của cái biết không cần lập luận: linh cảm rằng có gì đó chưa ổn, cảm giác rằng câu chuyện còn một lớp nữa phía sau. Lá này không khuyên hành động ngay — nó khuyên lùi lại, im lặng và quan sát thêm một nhịp, vì thông tin quan trọng nhất lúc này có thể chưa lộ ra. Trực giác của bạn đã ghi nhận nhiều hơn những gì lý trí kịp gọi tên.',
    rev: 'Ngược chiều, lá này hỏi: lần gần nhất bạn nghe thấy tiếng nói nhỏ bên trong — và gạt đi — là khi nào? Mặt trầm của Nữ Tư Tế là sống ồn quá mức để khỏi phải nghe chính mình: lúc nào cũng bận, lúc nào cũng lướt, quyết định theo ý người khác cho nhanh.',
    love: 'Trong tình cảm, lá này hay chạm vào những điều cả hai đều biết mà chưa ai nói. Một cuộc trò chuyện thật — chậm, không buộc tội — có thể là điều mối quan hệ đang chờ.',
    work: 'Về công việc, đừng vội chốt khi dữ kiện chưa đủ; để ý những tín hiệu nhỏ (giọng email, điều không được nhắc tới trong cuộc họp). Người giỏi lắng nghe đang có lợi thế hơn người nói to.',
    reflect: [
      'Linh cảm nào bạn đang có mà chưa dám gọi thành lời?',
      'Nếu phải ngồi yên 10 phút không điện thoại, điều gì sẽ nổi lên đầu tiên?',
    ],
  },
  {
    slug: 'the-empress',
    name: 'The Empress',
    name_vi: 'Nữ Hoàng',
    number: 3,
    keyUp: ['nuôi dưỡng', 'sáng tạo', 'sung túc', 'lớn theo nhịp tự nhiên'],
    keyRev: ['cho đi quá mức', 'bỏ bê bản thân', 'bóp nghẹt thay vì nuôi'],
    image:
      'Người phụ nữ ngồi thư thái giữa cánh đồng lúa chín, gối nệm thêu hình sao Kim, dòng suối chảy qua rừng phía sau. Mọi thứ quanh bà đều đang lớn — không thứ gì bị ép lớn.',
    up: 'Nữ Hoàng là lá của sự nuôi dưỡng: chăm một dự án, một đứa trẻ, một khu vườn, một cơ thể, một ý tưởng — và để nó lớn theo nhịp của nó. Lá này gợi sự sung túc đến từ chăm sóc đều đặn chứ không phải từ ép buộc; nó cũng nhắc về sự dễ chịu vật chất rất đời thường: bữa ăn tử tế, giấc ngủ đủ, không gian sống dễ thở. Điều bạn kiên nhẫn chăm hôm nay là thứ sẽ nuôi lại bạn sau này.',
    rev: 'Mặt trầm của Nữ Hoàng là cho đi đến cạn: lo cho tất cả mọi người trừ chính mình, hoặc chăm kỹ đến mức thành kiểm soát — không để con người, dự án, mối quan hệ có chỗ tự thở. Cũng có khi nó chạm vào giai đoạn sáng tạo bị tắc vì bạn đang vắt kiệt thay vì bồi đắp.',
    love: 'Trong tình cảm, lá này gợi sự ấm áp, chăm sóc, có thể cả chuyện gia đình – con cái. Câu hỏi ngược lại đáng giá không kém: trong mối quan hệ này, ai đang chăm ai — và có cân không?',
    work: 'Về công việc, Nữ Hoàng hợp với giai đoạn ươm: xây nền, đào tạo người, làm thương hiệu tử tế. Đừng đòi quả ngay trong mùa đang gieo.',
    reflect: [
      'Bạn đang nuôi điều gì — và điều gì đang nuôi lại bạn?',
      'Lần gần nhất bạn chăm sóc chính mình như chăm một người mình thương là khi nào?',
    ],
  },
  {
    slug: 'the-emperor',
    name: 'The Emperor',
    name_vi: 'Hoàng Đế',
    number: 4,
    keyUp: ['kỷ luật', 'cấu trúc', 'làm chủ', 'ranh giới rõ'],
    keyRev: ['cứng nhắc', 'kiểm soát quá tay', 'sợ buông quyền'],
    image:
      'Vị vua ngồi thẳng trên ngai đá tạc đầu cừu núi, áo giáp ẩn dưới hoàng bào, sau lưng là dãy núi trơ. Mọi thứ ở đây đều vững — và đều do tay ông sắp đặt.',
    up: 'Hoàng Đế là lá của trật tự do chính mình dựng lên: lịch sinh hoạt, nguyên tắc chi tiêu, ranh giới trong quan hệ, quy trình trong công việc. Nó xuất hiện khi điều bạn cần không phải cảm hứng mà là kỷ luật — một cái khung đủ vững để những thứ quan trọng không bị cuốn trôi theo cảm xúc từng ngày. Làm chủ ở đây nghĩa là: bạn quyết định luật chơi của đời mình, rồi tôn trọng chính luật đó.',
    rev: 'Ngược chiều, cái khung ấy đang siết quá chặt — với người khác (quản lý từng li, không tin ai làm được) hoặc với chính mình (tự ép đến mức mất hết mềm mại). Cũng có khi lá này chạm vào quan hệ với một người quyền uy: sếp, cha, người luôn "biết điều gì tốt nhất cho bạn".',
    love: 'Trong tình cảm, Hoàng Đế gợi sự đáng tin, che chở, cam kết rõ ràng. Mặt trầm là quan hệ nghiêng thành kiểm soát — yêu thương không cần phải đi kèm xin phép.',
    work: 'Về công việc, đây là lá của hệ thống: quy trình, kế hoạch, vai trò rõ. Nếu mọi thứ đang rối, thứ cần làm trước không phải cố gắng hơn mà là sắp xếp lại.',
    reflect: [
      'Vùng nào trong đời bạn đang thiếu một cái khung — và vùng nào đang bị khung siết nghẹt?',
      'Bạn đặt ranh giới vì điều mình quý, hay vì nỗi sợ mất kiểm soát?',
    ],
  },
  {
    slug: 'the-hierophant',
    name: 'The Hierophant',
    name_vi: 'Giáo Hoàng',
    number: 5,
    keyUp: ['truyền thống', 'người thầy', 'chuẩn mực', 'thuộc về một cộng đồng'],
    keyRev: ['phá khuôn', 'nghi ngờ giáo điều', 'tự tìm đường'],
    image:
      'Vị giáo chủ ngồi giữa hai cột đá, tay nâng ba ngón ban phúc, dưới chân là hai chiếc chìa khóa bắt chéo và hai môn đồ quỳ nghe. Tri thức ở đây được trao truyền — từ người đi trước sang người đi sau.',
    up: 'Giáo Hoàng đại diện cho những con đường đã được nhiều người đi: học từ thầy, theo lề lối gia đình, làm theo chuẩn nghề, gắn mình vào một cộng đồng có quy tắc. Lá này nhắc rằng không phải bài học nào cũng cần tự trả giá mới có — kinh nghiệm của người đi trước là đường tắt hợp pháp. Nó cũng chạm vào nhu cầu thuộc về: một nhóm, một niềm tin, một nghi thức cho đời sống bớt chông chênh.',
    rev: 'Ngược chiều, lá này hỏi: quy tắc nào bạn đang theo chỉ vì "xưa nay vẫn thế"? Mặt trầm của Giáo Hoàng là giáo điều — làm theo đám đông để an toàn, hoặc một người "thầy" đòi được tin tuyệt đối. Có lúc trưởng thành nghĩa là kính trọng truyền thống mà vẫn chọn lối riêng.',
    love: 'Trong tình cảm, lá này hay gắn với các cột mốc chuẩn mực: ra mắt, cưới hỏi, kỳ vọng của hai gia đình. Đáng hỏi: hai bạn đang sống theo nhịp của nhau, hay theo kịch bản của người khác?',
    work: 'Về công việc, hợp với việc học bài bản, thi chứng chỉ, tìm mentor, vào môi trường có lề lối. Mặt trầm: quy trình cũ có thể đang là thứ cản chính bạn.',
    reflect: [
      'Chuẩn mực nào đang nâng đỡ bạn — và chuẩn mực nào chỉ đang trói bạn?',
      'Nếu không sợ ai thất vọng, bạn có chọn khác đi không?',
    ],
  },
  {
    slug: 'the-lovers',
    name: 'The Lovers',
    name_vi: 'Đôi Tình Nhân',
    number: 6,
    keyUp: ['lựa chọn từ giá trị', 'gắn kết', 'hòa hợp', 'chân thật'],
    keyRev: ['lệch giá trị', 'lưỡng lự', 'chọn theo người khác'],
    image:
      'Hai con người đứng dưới thiên thần dang cánh, sau người nữ là cây tri thức quấn rắn, sau người nam là cây bốc lửa. Một lựa chọn lớn luôn có hai phía: điều mình muốn và điều mình tin.',
    up: 'Nhiều người nghĩ Đôi Tình Nhân chỉ nói chuyện yêu đương, nhưng cốt lõi của lá này là lựa chọn dựa trên giá trị: chọn người để gắn bó, chọn việc để theo, chọn điều để trung thực. Nó xuất hiện khi một quyết định đòi bạn trả lời câu hỏi sâu hơn "cái nào lợi hơn" — đó là "mình là người thế nào, và lựa chọn nào khớp với con người đó". Sự hòa hợp thật đến từ hai phía nhìn cùng một hướng, không phải hai phía nhìn nhau mãi.',
    rev: 'Ngược chiều, lá này chạm vào cảm giác lệch pha: điều bạn làm không còn khớp điều bạn tin, hoặc mối gắn kết đang duy trì bằng quán tính thay vì lựa chọn. Cũng có khi nó là sự lưỡng lự kéo dài — không chọn, thực ra, cũng là một lựa chọn.',
    love: 'Trong tình cảm, đây là lá của sự gắn kết có ý thức: ở lại vì muốn ở lại, không phải vì ngại đổi thay. Nếu đang phân vân giữa hai người hay hai hướng, hãy so bằng giá trị sống, đừng so bằng điều kiện.',
    work: 'Về công việc, lá này hay xuất hiện ở ngã rẽ nghề nghiệp: lời mời hấp dẫn nhưng lệch giá trị, hay công việc lương thấp hơn mà đúng người đúng việc. Tiền bù được nhiều thứ, trừ cảm giác phản bội chính mình mỗi sáng.',
    reflect: [
      'Lựa chọn trước mặt bạn: phương án nào khiến bạn tự hào hơn về chính mình sau 5 năm?',
      'Bạn đang chọn — hay đang để hoàn cảnh chọn giúp?',
    ],
  },
  {
    slug: 'the-chariot',
    name: 'The Chariot',
    name_vi: 'Cỗ Xe',
    number: 7,
    keyUp: ['ý chí', 'tập trung tiến lên', 'thắng nhờ kỷ luật', 'cầm cương'],
    keyRev: ['mất lái', 'hai lực kéo ngược', 'hùng hổ thiếu hướng'],
    image:
      'Chiến binh đứng trên cỗ xe do hai nhân sư đen – trắng kéo, mỗi con nhìn một hướng; không có dây cương, xe chạy bằng ý chí của người cầm lái. Tiến được hay không nằm ở việc giữ hai lực ngược cùng phục vụ một hướng.',
    up: 'Cỗ Xe là lá của giai đoạn dồn lực: mục tiêu đã rõ, giờ là lúc gom hết những phần ngược chiều trong mình — ham muốn và lý trí, liều và sợ — bắt chúng cùng kéo về một phía. Nó gợi chiến thắng đến từ kỷ luật và tập trung, không phải từ may mắn. Nếu đang đà tiến, lá này bảo: giữ tay lái, đừng để chuyện bên đường làm chệch hướng.',
    rev: 'Ngược chiều, hai con nhân sư đang kéo về hai phía: bạn muốn hai điều mâu thuẫn cùng lúc, hoặc lao rất nhanh mà không chắc về đâu. Bận rộn không đồng nghĩa với tiến bộ — có khi cần dừng xe để xem lại bản đồ.',
    love: 'Trong tình cảm, Cỗ Xe gợi giai đoạn cần chủ động làm rõ: mối quan hệ này đang đi về đâu? Mặt trầm là kéo–đẩy liên tục, hai người hai nhịp không ai chịu khớp.',
    work: 'Về công việc, rất hợp các mục tiêu có deadline: thi cử, ra mắt sản phẩm, chạy dự án. Chia mục tiêu thành chặng và đừng nhận thêm việc lệch hướng trong lúc tăng tốc.',
    reflect: [
      'Hai lực nào trong bạn đang kéo ngược nhau — và hướng nào bạn thật sự muốn?',
      'Tốc độ hiện tại là tiến lên, hay chỉ là chạy trốn cảm giác đứng yên?',
    ],
  },
  {
    slug: 'strength',
    name: 'Strength',
    name_vi: 'Sức Mạnh',
    number: 8,
    keyUp: ['mạnh mẽ dịu dàng', 'kiên nhẫn', 'thuần phục nỗi sợ', 'lòng trắc ẩn'],
    keyRev: ['tự nghi ngờ', 'mất bình tĩnh', 'cứng để che yếu'],
    image:
      'Người phụ nữ nhẹ nhàng khép miệng một con sư tử bằng hai bàn tay trần, trên đầu là ký hiệu vô cực. Không roi, không xích — con thú dữ được thuần bằng sự điềm tĩnh.',
    up: 'Sức Mạnh trong lá này không phải cơ bắp hay áp đảo, mà là sự điềm tĩnh trước thứ gầm gừ — cơn giận của chính mình, nỗi sợ, một người đang căng thẳng, một tình huống dễ bùng nổ. Nó gợi cách thắng bằng kiên nhẫn và lòng trắc ẩn: không phủ nhận phần bản năng, mà ngồi cùng nó đủ lâu để nó dịu xuống. Người mạnh nhất trong phòng thường là người không cần lớn tiếng.',
    rev: 'Ngược chiều, con sư tử đang thắng: bạn phản ứng thay vì hồi đáp, hoặc tỏ ra cứng cỏi bên ngoài để che sự tự nghi ngờ bên trong. Lá này nhắc rằng thừa nhận "mình đang đuối" với đúng người cũng là một dạng can đảm.',
    love: 'Trong tình cảm, Sức Mạnh gợi sự bao dung với phần chưa hoàn hảo của nhau — và của chính mình. Mặt trầm: nhịn không phải là dịu dàng; nhịn lâu sẽ thành nợ.',
    work: 'Về công việc, hợp những việc cần bền bỉ và xử lý con người: đàm phán căng, khách hàng khó, đội nhóm đang nóng. Phản hồi chậm một nhịp thường tốt hơn trả lời ngay khi đang sôi.',
    reflect: [
      '"Con sư tử" của bạn lúc này là gì — cơn giận, nỗi sợ, hay sự sốt ruột?',
      'Bạn đang đối xử với chính mình bằng kỷ luật hay bằng roi vọt?',
    ],
  },
  {
    slug: 'the-hermit',
    name: 'The Hermit',
    name_vi: 'Ẩn Sĩ',
    number: 9,
    keyUp: ['rút lui có chủ đích', 'tìm câu trả lời bên trong', 'người dẫn đường', 'chín chắn'],
    keyRev: ['cô lập quá mức', 'trốn trong đơn độc', 'từ chối giúp đỡ'],
    image:
      'Ông lão đứng trên đỉnh núi tuyết, tay nâng cây đèn có ngôi sao sáu cánh, tay kia chống gậy. Ngọn đèn chỉ soi vừa một bước chân — nhưng thế là đủ để đi tiếp.',
    up: 'Ẩn Sĩ là lá của việc lùi ra khỏi tiếng ồn để nghe được câu trả lời của chính mình: tạm ngắt mạng xã hội, đi đâu đó một mình, hoặc đơn giản là từ chối vài cuộc vui để ở với câu hỏi đang treo. Nó cũng là lá của người dẫn đường — giai đoạn này bạn có thể đang cần một người từng trải, hoặc chính bạn đang trở thành ngọn đèn cho ai đó. Câu trả lời bạn tìm không nằm ở thêm ý kiến, mà ở bớt tiếng ồn.',
    rev: 'Ngược chiều, sự một mình đã chuyển từ lựa chọn thành lẩn trốn: né người vì ngại va chạm, tự cô lập rồi kết luận "không ai hiểu mình". Lá này hỏi thẳng: bạn đang rút lui để nhìn rõ, hay đang trốn để khỏi phải quyết?',
    love: 'Trong tình cảm, Ẩn Sĩ gợi nhu cầu không gian riêng — điều lành mạnh nếu nói rõ, dễ thành vết nứt nếu im lặng biến mất. Người đang độc thân: giai đoạn hiểu mình trước khi tìm người hiểu mình.',
    work: 'Về công việc, hợp các việc cần đào sâu một mình: nghiên cứu, viết, học kỹ năng khó. Nếu bế tắc đã lâu, một mentor có thể rút ngắn cho bạn vài năm mò mẫm.',
    reflect: [
      'Câu hỏi nào bạn cứ mang đi hỏi khắp nơi — trong khi thật ra bạn đã biết câu trả lời?',
      'Sự một mình hiện tại đang nạp năng lượng cho bạn, hay đang rút dần?',
    ],
  },
  {
    slug: 'wheel-of-fortune',
    name: 'Wheel of Fortune',
    name_vi: 'Bánh Xe Số Phận',
    number: 10,
    keyUp: ['chu kỳ chuyển', 'thời điểm', 'thích nghi', 'vận hội'],
    keyRev: ['cảm giác mắc kẹt', 'lặp lại vòng cũ', 'đổ cho số'],
    image:
      'Bánh xe lớn quay giữa trời, bốn góc là bốn sinh vật cầm sách, nhân sư ngồi trên đỉnh và rắn trườn xuống bên dưới. Có kẻ đang lên, có kẻ đang xuống — bánh xe không dừng cho riêng ai.',
    up: 'Bánh Xe Số Phận nhắc một sự thật vừa khiêm tốn vừa nhẹ nhõm: có những lực nằm ngoài tay mình — thời điểm, hoàn cảnh, may rủi — và đời đi theo chu kỳ chứ không theo đường thẳng. Khi lá này xuất hiện, thường một giai đoạn đang chuyển: việc cũ khép, cửa mới hé. Việc của bạn không phải điều khiển bánh xe, mà là nhận ra mình đang ở đoạn nào của vòng quay để hành xử cho hợp — lúc thuận thì tận dụng, lúc nghịch thì giữ sức.',
    rev: 'Ngược chiều, lá này chạm vào cảm giác kẹt trong vòng lặp: chuyện cũ tái diễn, người cũ kiểu cũ, lỗi cũ phạm lại. Đáng hỏi: trong vòng lặp đó, đâu là phần "số", đâu là phần kịch bản do chính mình diễn lại? Phần thứ hai — đổi được.',
    love: 'Trong tình cảm, Bánh Xe gợi những bước ngoặt đến từ thời điểm: gặp đúng người lúc không ngờ, hoặc mối quan hệ sang giai đoạn mới. Điều giữ được qua các mùa không phải may mắn mà là cách hai người cùng thích nghi.',
    work: 'Về công việc, để ý các tín hiệu đổi chiều của môi trường — ngành, công ty, thị trường. Người khôn không cưỡng chu kỳ; họ chuẩn bị trước khi chu kỳ đổi.',
    reflect: [
      'Điều gì trong đời bạn cứ lặp lại — và phần nào của vòng lặp ấy nằm trong tay bạn?',
      'Nếu giai đoạn này là một mùa, nó là mùa gì — và mùa đó nên làm gì?',
    ],
  },
  {
    slug: 'justice',
    name: 'Justice',
    name_vi: 'Công Lý',
    number: 11,
    keyUp: ['công bằng', 'nhân quả', 'trách nhiệm', 'quyết định tỉnh táo'],
    keyRev: ['né sự thật', 'thiên vị', 'đổ lỗi'],
    image:
      'Người ngồi giữa hai cột, một tay nâng cân, một tay dựng thẳng thanh kiếm. Cân để cân nhắc đủ phía; kiếm để khi đã rõ thì cắt dứt khoát.',
    up: 'Công Lý là lá của nhân quả và trách nhiệm: kết quả hôm nay phần lớn là tổng các lựa chọn hôm trước — của mình và của người. Nó xuất hiện khi bạn cần một quyết định tỉnh táo, đủ dữ kiện, không để cảm tình hay sợ hãi đặt ngón tay lên bàn cân. Lá này cũng gợi các việc giấy tờ, thỏa thuận, phân xử: làm cho đàng hoàng, rõ ràng, để sau này không ai phải nhớ lại trong ấm ức.',
    rev: 'Ngược chiều, đâu đó đang có sự né tránh: né nhìn phần lỗi của mình, hoặc ôm hết lỗi về mình để khỏi phải đối chất. Công bằng với người khác thì dễ nói; công bằng với chính mình — không tự bào chữa, cũng không tự hành — mới khó.',
    love: 'Trong tình cảm, Công Lý gợi sự sòng phẳng về công sức: ai đang gánh phần nặng hơn, điều đó có được nhìn nhận không? Một mối quan hệ bền là nơi cả hai cùng thấy "thế là công bằng".',
    work: 'Về công việc, hợp lúc thương lượng lương, ký kết, phân chia quyền lợi. Ghi mọi thỏa thuận ra giấy — sự rõ ràng là cách giữ quan hệ, không phải biểu hiện thiếu tin nhau.',
    reflect: [
      'Trong chuyện đang cân nhắc, nếu bỏ hết thiện cảm và ác cảm, sự việc còn lại là gì?',
      'Có hậu quả nào bạn đang nhận mà chưa từng truy về lựa chọn gốc của chính mình?',
    ],
  },
  {
    slug: 'the-hanged-man',
    name: 'The Hanged Man',
    name_vi: 'Người Treo Ngược',
    number: 12,
    keyUp: ['đổi góc nhìn', 'tạm dừng có chủ đích', 'buông để hiểu', 'hy sinh ngắn đổi sáng dài'],
    keyRev: ['trì hoãn vô ích', 'hy sinh không ai cần', 'kẹt mà không học'],
    image:
      'Một người treo ngược chân trên cây chữ T, chân kia gập thành số 4, hai tay sau lưng — và gương mặt bình thản, quanh đầu tỏa sáng. Bị treo, nhưng không khổ: từ tư thế này, thế giới hiện ra khác hẳn.',
    up: 'Người Treo Ngược là lá của sự tạm dừng có chủ đích: việc chưa xuôi, đẩy tiếp chỉ tốn sức — thay vào đó, dừng lại và nhìn từ phía ngược. Điều trông như thất bại có khi là dữ liệu; người trông như đối thủ có khi đang nói đúng. Lá này cũng chạm vào những hy sinh ngắn hạn để đổi lấy cái nhìn dài hạn: chậm một nhịp thăng tiến để học, lùi một bước trong tranh cãi để giữ điều lớn hơn.',
    rev: 'Ngược chiều, sự tạm dừng đã quá hạn thành trì hoãn, hoặc sự hy sinh đã thành thói quen không ai yêu cầu mà cũng chẳng đổi được gì. Nếu bạn đã nhìn đủ mọi góc rồi — lá này bảo: đến lúc thả chân xuống đất và làm.',
    love: 'Trong tình cảm, Người Treo Ngược gợi việc thử đứng hẳn về phía người kia một lần — không phải để nhường, mà để hiểu. Mặt trầm: một bên cứ "chịu đựng thêm chút nữa" năm này qua năm khác.',
    work: 'Về công việc, dự án bế tắc có khi cần đổi đề bài thay vì đổi nỗ lực: hỏi lại "vấn đề thật sự là gì". Một ngày lùi lại quan sát có thể tiết kiệm một tháng làm sai hướng.',
    reflect: [
      'Chuyện đang bế tắc — bạn đã thử nhìn nó bằng con mắt của phía bên kia chưa?',
      'Điều bạn đang "hy sinh vì..." — người đó/việc đó có thật sự cần sự hy sinh ấy không?',
    ],
  },
  {
    slug: 'death',
    name: 'Death',
    name_vi: 'Cái Chết',
    number: 13,
    keyUp: ['khép một chương', 'chuyển hóa', 'buông cái đã xong', 'chỗ cho cái mới'],
    keyRev: ['níu kéo', 'sợ thay đổi', 'kết thúc kéo lê'],
    image:
      'Bộ xương mặc giáp cưỡi ngựa trắng cầm cờ hoa hồng trắng; vua gục dưới chân, em bé ngước nhìn không sợ, và phía xa mặt trời đang mọc giữa hai ngọn tháp. Một điều khép lại — và ánh sáng phía sau nó.',
    up: 'Cái Chết trong Tarot gần như không bao giờ nói về cái chết thể xác — nó nói về sự khép lại của một chương: một vai trò đã hết vai, một mối quan hệ đã đi trọn đường của nó, một phiên bản của chính mình đã chật. Lá này gợi rằng thứ đang kết thúc không phải bị cướp đi, mà là đã xong; và chỗ trống nó để lại chính là nơi điều mới sẽ mọc. Chuyển hóa thật sự bắt đầu khi ta thôi hô hấp nhân tạo cho cái đã hết thở.',
    rev: 'Ngược chiều, lá này chạm vào sự níu kéo: biết là xong rồi mà chưa buông — vì tiếc công, vì sợ trống, vì "biết đâu". Kết thúc bị kéo lê thường đau hơn kết thúc được thừa nhận. Câu hỏi của lá: bạn đang giữ điều đó, hay điều đó đang giữ bạn?',
    love: 'Trong tình cảm, Death có thể là khép một mối quan hệ — nhưng cũng rất thường là khép một giai đoạn của cùng mối quan hệ ấy (hết tuần trăng mật, con cái ra riêng) để bước sang giai đoạn mới thật hơn.',
    work: 'Về công việc, hợp lúc nghỉ việc cũ, đóng dự án không còn lý do tồn tại, bỏ một dòng sản phẩm. Đóng cho gọn ghẽ — bàn giao tử tế, cảm ơn rồi đi — là kỹ năng ít người luyện.',
    reflect: [
      'Điều gì trong đời bạn đã "xong" mà bạn còn chưa cho phép nó xong?',
      'Nếu chương này khép hôm nay, dòng đầu tiên của chương mới bạn muốn viết gì?',
    ],
    ease:
      'Lá này hay bị dùng để hù dọa — xin nói thẳng: trong truyền thống Tarot, Death nghĩa là chuyển hóa, không phải điềm tang tóc. Nơi nào dùng lá này để dọa bạn rồi gợi ý "lễ hóa giải", nơi đó đang bán nỗi sợ, không phải tri thức.',
  },
  {
    slug: 'temperance',
    name: 'Temperance',
    name_vi: 'Tiết Độ',
    number: 14,
    keyUp: ['cân bằng', 'pha trộn vừa độ', 'kiên nhẫn đường dài', 'điều hòa'],
    keyRev: ['thái quá', 'mất nhịp', 'vá víu cực đoan'],
    image:
      'Thiên thần một chân chạm nước một chân trên bờ, rót nước qua lại giữa hai chiếc ly theo dòng chảy không đứt. Phép màu ở đây rất lặng lẽ: đúng liều, đúng nhịp, đều đặn.',
    up: 'Tiết Độ là lá của sự vừa độ — thứ nghe tẻ nhạt nhưng là nền của mọi thứ bền: ăn ngủ điều độ, chi tiêu có nhịp, làm việc có nghỉ, nói chuyện có lắng nghe. Nó gợi việc pha trộn những thứ tưởng đối lập thành một hỗn hợp sống được: lý trí với cảm xúc, tham vọng với sức khỏe, cái tôi với cái chung. Đường dài không thuộc về người chạy nhanh nhất mà thuộc về người giữ được nhịp.',
    rev: 'Ngược chiều, đâu đó đang quá liều: làm quá, chơi quá, lo quá, kỳ vọng quá. Hoặc bạn đang vá một cực đoan này bằng một cực đoan khác — nhịn cả tuần rồi bùng một bữa, im lặng cả tháng rồi nổ một trận. Cân bằng không phải điểm đến, nó là động tác chỉnh liên tục.',
    love: 'Trong tình cảm, Tiết Độ gợi sự điều hòa hai nhịp sống khác nhau — người nhanh người chậm, người nói người nghĩ. Không ai phải biến thành người kia; chỉ cần cả hai cùng chỉnh về một nhịp chung.',
    work: 'Về công việc, lá này nhắc về tính bền: tiến độ đều mỗi ngày thắng những cú nước rút kiệt sức. Nếu đang định "all-in", hỏi lại: phương án nào cho phép mình còn đứng vững nếu sai?',
    reflect: [
      'Vùng nào trong đời bạn đang quá liều — và liều đúng trông như thế nào?',
      'Hai thứ nào trong bạn đang bị xem là đối nghịch, mà thật ra có thể pha vào nhau?',
    ],
  },
  {
    slug: 'the-devil',
    name: 'The Devil',
    name_vi: 'Ác Quỷ',
    number: 15,
    keyUp: ['nhìn thẳng ràng buộc', 'thói quen trói buộc', 'cám dỗ', 'phần bóng tối'],
    keyRev: ['bắt đầu cởi trói', 'tỉnh ra', 'lấy lại quyền chọn'],
    image:
      'Hình nhân sừng dơi ngồi trên bệ đá, dưới chân là hai con người bị xích — nhưng nhìn kỹ, vòng xích quanh cổ họ lỏng đến mức tự tháo được. Họ ở lại không phải vì xích chặt, mà vì đã quen.',
    up: 'Ác Quỷ là lá can đảm nhất bộ bài: nó mời bạn nhìn thẳng vào thứ đang trói mình — một thói quen biết là hại mà chưa bỏ, một mối quan hệ ở lại vì sợ hơn vì thương, một món nợ, một cơn nghiện nhỏ (điện thoại, mua sắm, sự công nhận). Chi tiết đắt nhất nằm ở vòng xích lỏng: phần lớn ràng buộc tồn tại được nhờ ta thôi để ý đến nó. Gọi đúng tên xiềng xích là một nửa của tự do.',
    rev: 'Ngược chiều, lá này mang tin tốt: bạn đang tỉnh ra — thấy được trò chơi, thấy được cái giá, và bắt đầu nới xích. Giai đoạn cai bất cứ thứ gì đều xấu trời vài đoạn đầu; đừng nhầm cơn vật vã với dấu hiệu "mình không làm được".',
    love: 'Trong tình cảm, Ác Quỷ chạm vào những gắn bó nặng về chiếm hữu, ghen tuông, hoặc lệ thuộc — nhầm cảm giác "không sống thiếu nhau được" với tình thương. Thương nhau mà tự do mới khó; trói nhau thì dễ.',
    work: 'Về công việc, để ý các "xiềng vàng": lương tốt cho công việc đang bào mòn mình, hoặc lối làm ăn dễ dãi đang dần thành thói. Hỏi: cái giá thật của sự thoải mái này là gì?',
    reflect: [
      'Thói quen hay mối ràng buộc nào bạn vẫn bao biện là "không bỏ được" — xích đó chặt thật, hay bạn đã quen?',
      'Điều gì bạn đang đánh đổi để giữ sự dễ chịu trước mắt?',
    ],
    ease:
      'Tên lá nghe đáng sợ nhưng đây không phải "quỷ ám" hay điềm dữ — nó là tấm gương soi thói quen và ràng buộc rất con người. Không có gì để cúng giải ở đây; chỉ có một câu hỏi để tự trả lời.',
  },
  {
    slug: 'the-tower',
    name: 'The Tower',
    name_vi: 'Tòa Tháp',
    number: 16,
    keyUp: ['sự thật phơi bày', 'đổ vỡ đột ngột', 'nền móng lộ ra', 'giải phóng'],
    keyRev: ['khủng hoảng tránh được', 'sợ đổ vỡ', 'trì hoãn cú sập'],
    image:
      'Tòa tháp trên đỉnh núi đá bị sét đánh bay vương miện, lửa bùng qua cửa sổ, hai người rơi xuống. Tháp sập không phải vì sét — sét chỉ phơi ra điều đã mục từ bên trong.',
    up: 'Tòa Tháp là lá của cú sốc nói thật: một niềm tin, một kế hoạch, một hình ảnh được dựng công phu bỗng lộ ra phần móng yếu — qua một tin bất ngờ, một sự thật vỡ lở, một biến cố không hẹn. Đau, nhưng lá này nhấn vào nửa sau của câu chuyện: thứ sập được là thứ vốn không vững, và cái còn đứng lại sau cơn rung mới là cái thật. Nhiều điều tốt nhất trong đời người được xây trên nền của một tòa tháp cũ đã sập.',
    rev: 'Ngược chiều, lá này gợi cú sập đang được trì hoãn: vết nứt đã thấy mà cứ trét sơn lên, hoặc chính bạn đang gồng giữ một thứ nên để nó tự sụp. Đổ vỡ chủ động — thừa nhận sớm, đập đi xây lại sớm — luôn rẻ hơn đổ vỡ bị động.',
    love: 'Trong tình cảm, Tòa Tháp hay chạm vào khoảnh khắc vỡ ra sự thật về nhau hoặc về chính mối quan hệ. Sau cơn rung, câu hỏi không phải "tại ai" mà là: phần nào của nền móng đáng được xây lại — và có xây lại không?',
    work: 'Về công việc, lá này gợi các cú phanh gấp: dự án đổ, tổ chức tái cấu trúc, kế hoạch phá sản giữa chừng. Cứu được gì thì cứu, nhưng đừng dựng lại y nguyên cái vừa sập — nó sập có lý do.',
    reflect: [
      'Trong đời bạn lúc này, có "tòa tháp" nào đang đứng bằng vẻ ngoài nhiều hơn bằng móng?',
      'Cú đổ vỡ gần nhất đã dạy bạn điều gì mà êm đềm không dạy nổi?',
    ],
    ease:
      'The Tower bị coi là lá "dữ" nhất bộ — nhưng nó không hứa tai nạn cho bạn. Nó là hình ảnh về việc sự thật phơi bày thì đau mà lành. Ai dùng lá này để dọa bạn về "đại hạn" rồi mời mua lễ, hãy rời đi.',
  },
  {
    slug: 'the-star',
    name: 'The Star',
    name_vi: 'Ngôi Sao',
    number: 17,
    keyUp: ['hy vọng', 'chữa lành', 'niềm tin trở lại', 'chân thật với mình'],
    keyRev: ['mất niềm tin tạm thời', 'kiệt quệ', 'hoài nghi mọi thứ'],
    image:
      'Sau cơn bão của Tòa Tháp, một người quỳ bên hồ nước dưới bầu trời đầy sao, hai bình nước rót xuống đất và xuống hồ, không che giấu, không phòng thủ. Trời đêm — nhưng đầy sao.',
    up: 'Ngôi Sao là quãng thở sau biến cố: vết thương bắt đầu lành, niềm tin bắt đầu mọc lại — nhỏ thôi, nhưng thật. Lá này gợi sự chữa lành đến từ việc thôi gồng: sống chậm lại, làm điều đơn giản tốt cho mình, ở cạnh người không bắt mình phải diễn. Nó cũng là lá của cảm hứng và phương hướng: giữa trời tối, bạn không cần thấy cả con đường — chỉ cần một ngôi sao để đi theo là đủ.',
    rev: 'Ngược chiều, lá này chạm vào giai đoạn cạn pin niềm tin: nỗ lực mãi chưa thấy hồi đáp, nên bắt đầu nghi ngờ cả những điều vốn quý. Đây không phải lúc quyết định lớn; đây là lúc nghỉ — niềm tin cũng như sức lực, hết thì nạp, không phải hết là mất.',
    love: 'Trong tình cảm, Ngôi Sao gợi sự hồi phục sau tổn thương: dám mở lòng lại, hoặc hai người hàn gắn bằng sự chân thật trần trụi hơn trước. Đừng vội — lành da non cần thời gian.',
    work: 'Về công việc, hợp giai đoạn sau thất bại: rút bài học, làm lại với kỳ vọng thực tế hơn. Một mục tiêu xa làm la bàn cộng vài việc nhỏ mỗi ngày — đó là công thức của lá này.',
    reflect: [
      'Điều gì gần đây cho bạn lại chút niềm tin — và làm sao để gần nó hơn?',
      'Nếu thôi gồng, bạn sẽ thừa nhận điều gì với chính mình?',
    ],
  },
  {
    slug: 'the-moon',
    name: 'The Moon',
    name_vi: 'Mặt Trăng',
    number: 18,
    keyUp: ['mơ hồ', 'nỗi sợ chưa rõ mặt', 'ảo ảnh', 'trực giác trong sương'],
    keyRev: ['sương tan dần', 'sự thật hiện ra', 'bớt tự dọa mình'],
    image:
      'Mặt trăng lưỡi liềm ôm trong trăng tròn, nhỏ giọt sáng xuống con đường chạy giữa hai ngọn tháp; chó nhà và sói cùng tru, tôm hùm bò lên từ đáy nước. Mọi thứ đều thật một nửa — như mọi cảnh vật dưới ánh trăng.',
    up: 'Mặt Trăng là lá của những giai đoạn không nhìn rõ: thông tin nhiễu, người nói một đằng làm một nẻo, và nỗi bất an không gọi được tên. Lá này khuyên hai việc nghe có vẻ ngược nhau: đừng vội kết luận hay ký kết gì trong sương — nhưng cũng đừng gạt bỏ cảm giác "có gì đó không ổn", vì dưới trăng, trực giác thường thấy trước lý trí. Sợ nhất của con người là điều chưa rõ mặt; mà điều chưa rõ mặt thì hay được trí tưởng tượng vẽ to gấp ba.',
    rev: 'Ngược chiều, sương đang tan: hiểu lầm được giải, sự thật lộ dần, hoặc bạn nhận ra con quái vật mình sợ bấy lâu chỉ là cái bóng của chính nỗi lo. Đây là lúc tốt để kiểm chứng lại các giả định cũ — nhiều cái đã hết đúng.',
    love: 'Trong tình cảm, Mặt Trăng chạm vào những vùng chưa nói hết: cảm giác bất an, nghi ngờ chưa có bằng chứng, hoặc tự vẽ kịch bản trong đầu rồi tự đau. Thay vì đoán, hỏi thẳng — nhẹ nhàng, nhưng thẳng.',
    work: 'Về công việc, cẩn trọng với các thỏa thuận mập mờ, lời hứa miệng, số liệu chưa kiểm chứng. Việc cần làm không phải là lo nhiều hơn, mà là biến mỗi nỗi lo thành một câu hỏi kiểm chứng được.',
    reflect: [
      'Nỗi lo lớn nhất của bạn lúc này — bạn đang có bằng chứng nào, và đang tưởng tượng phần nào?',
      'Câu hỏi nào nếu dám hỏi thẳng sẽ làm tan một nửa màn sương?',
    ],
  },
  {
    slug: 'the-sun',
    name: 'The Sun',
    name_vi: 'Mặt Trời',
    number: 19,
    keyUp: ['rõ ràng', 'sức sống', 'niềm vui giản dị', 'thành quả nhìn thấy được'],
    keyRev: ['lạc quan che mắt', 'vui gượng', 'quên mặt khuất'],
    image:
      'Mặt trời tỏa tia thẳng và tia sóng trên một em bé cởi trần cưỡi ngựa trắng, tay giương cờ đỏ, sau lưng là tường hoa hướng dương. Không ẩn dụ phức tạp — chỉ là ánh sáng, và niềm vui không cần lý do.',
    up: 'Mặt Trời là lá sáng nhất bộ bài: mọi thứ ra ánh sáng — nỗ lực được nhìn nhận, hiểu lầm được giải, sức khỏe và tinh thần đi lên. Nó gợi kiểu niềm vui không cần điều kiện hoành tráng: làm xong việc tử tế, chơi với người mình quý, một ngày nắng đẹp. Lá này cũng nhắc về sự minh bạch: lúc này càng sống rõ ràng — nói thật, làm thật, khoe đúng cái có thật — mọi thứ càng thuận.',
    rev: 'Ngược chiều, ánh nắng hơi chói: lạc quan đến mức bỏ qua dữ kiện xấu, hoặc gồng vui trên mạng trong khi bên trong đang mỏi. Niềm vui thật chịu được câu hỏi; niềm vui diễn thì sợ câu hỏi.',
    love: 'Trong tình cảm, Mặt Trời gợi giai đoạn ấm và rõ: yêu mà không phải đoán, vui mà không phải diễn. Nếu đang tìm hiểu ai đó, sự thoải mái như trẻ con chơi với nhau là tín hiệu rất đáng tin.',
    work: 'Về công việc, thành quả đang ở dạng nhìn thấy được — hợp lúc trình bày, ra mắt, nhận việc lớn hơn. Tận hưởng, nhưng đừng ký thêm cam kết chỉ vì đang phấn khích.',
    reflect: [
      'Điều gì khiến bạn vui kiểu giản dị — và sao lâu rồi bạn không xếp lịch cho nó?',
      'Niềm lạc quan hiện tại đang đứng trên dữ kiện, hay đứng trên mong muốn?',
    ],
  },
  {
    slug: 'judgement',
    name: 'Judgement',
    name_vi: 'Phán Xét',
    number: 20,
    keyUp: ['thức tỉnh', 'tổng kết nửa chặng', 'tha thứ cho mình', 'lời gọi lớn'],
    keyRev: ['tự phán quá nặng', 'né nhìn lại', 'điếc với lời gọi'],
    image:
      'Thiên thần thổi kèn giữa trời, những con người vươn dậy từ các nấm mộ, tay mở về phía âm thanh. Không phải cảnh phán tội — là cảnh được đánh thức.',
    up: 'Phán Xét là lá của khoảnh khắc nhìn lại cả chặng: đời mình đến đây là vì những lựa chọn nào, cái nào đáng giữ, cái nào nên khép — và mình muốn nửa chặng sau khác đi ra sao. Nó thường đến cùng một "lời gọi": cảm giác ngày càng rõ rằng mình được sinh ra để làm việc gì đó cụ thể hơn hiện tại. Tổng kết tử tế khác với tự hành: nhìn lỗi cũ để rút bài học, rồi tha cho mình mà đi tiếp.',
    rev: 'Ngược chiều, hoặc bạn đang tự xử mình quá nặng vì chuyện đã qua — bản án không ai tuyên ngoài chính bạn — hoặc đang né cuộc nhìn lại vì sợ thấy điều phải thay đổi. Lời gọi bên trong bị lờ đi không biến mất; nó chỉ chuyển thành cảm giác sống sai sai kéo dài.',
    love: 'Trong tình cảm, Phán Xét gợi cuộc nói chuyện tổng kết: mình đã đối xử với nhau thế nào, và muốn tiếp theo ra sao. Có những mối quan hệ "sống lại" thật sự — sau khi cả hai dám nhìn lại không né.',
    work: 'Về công việc, hợp các dịp đánh giá lại nghề nghiệp: nghề này còn là lời gọi hay chỉ còn là lương? Nếu câu trả lời làm bạn chột dạ, đó chính là thông tin quý nhất năm.',
    reflect: [
      'Nếu phải tổng kết chặng vừa qua trong ba dòng, bạn viết gì?',
      'Lời gọi nào bên trong bạn đã nghe thấy nhiều lần mà vẫn giả vờ chưa nghe?',
    ],
  },
  {
    slug: 'the-world',
    name: 'The World',
    name_vi: 'Thế Giới',
    number: 21,
    keyUp: ['hoàn tất', 'trọn vẹn', 'được ghi nhận', 'khép vòng để mở vòng mới'],
    keyRev: ['gần xong bỏ dở', 'thiếu một mảnh', 'sợ khép lại'],
    image:
      'Người vũ công khoác dải lụa nhảy giữa vòng nguyệt quế khép kín, bốn góc trời là bốn gương mặt chứng kiến. Lá cuối của hành trình Ẩn chính: vòng tròn đã tròn.',
    up: 'Thế Giới là lá của sự hoàn tất xứng đáng: một chặng dài — học hành, dự án, chữa lành, một giai đoạn đời — đi đến điểm trọn vẹn, và lần này có cả sự công nhận từ bên ngoài lẫn cảm giác "đủ" từ bên trong. Lá này nhắc một việc hay bị bỏ qua: ăn mừng và khép lại cho đàng hoàng. Vòng tròn nào được khép tử tế sẽ trả lại năng lượng sạch cho vòng mới; vòng nào bỏ lửng sẽ âm thầm rút điện mãi về sau.',
    rev: 'Ngược chiều, đích đã trong tầm mắt mà chân chùng lại: 90% rồi bỏ dở, hoặc xong việc mà không dám nhận là xong — cứ thấy thiếu một mảnh. Đôi khi mảnh thiếu là thật (một cuộc trò chuyện chưa nói, một lời cảm ơn chưa gửi); đôi khi nó chỉ là nỗi sợ phải bước sang chương mới.',
    love: 'Trong tình cảm, Thế Giới gợi độ chín của quan hệ: đi qua đủ mùa và thấy mình vẫn chọn nhau. Với người vừa khép một mối quan hệ dài: khép trọn — hiểu, tha, cảm ơn — trước khi mở cửa mới.',
    work: 'Về công việc, hợp lúc về đích: bàn giao, tốt nghiệp, ra mắt bản hoàn chỉnh. Viết lại bài học của cả chặng khi còn nóng — đó là tài sản mang sang vòng sau.',
    reflect: [
      'Điều gì trong đời bạn đang ở mức 90% — và mảnh 10% còn lại thật ra là gì?',
      'Thành quả nào bạn đã đạt mà chưa từng cho phép mình ăn mừng tử tế?',
    ],
  },
];

/** Tra cứu theo slug — dùng cho generateStaticParams + page. */
export function getMajorPage(slug: string): TarotCardPage | undefined {
  return MAJOR_PAGES.find((c) => c.slug === slug);
}

// Đợt 2: gộp 22 Ẩn chính + 56 Ẩn phụ thành một thư viện 78 lá.
// (minor chỉ import TYPE từ file này — type bị xoá khi compile nên không có vòng import runtime.)

/** Đủ bộ 78 lá theo thứ tự: 22 Ẩn chính (0–21) rồi 4 chất × 14 (Át → Vua). */
export const ALL_PAGES: TarotCardPage[] = [...MAJOR_PAGES, ...MINOR_PAGES];

/** Tra cứu trong cả 78 lá. */
export function getCardPage(slug: string): TarotCardPage | undefined {
  return ALL_PAGES.find((c) => c.slug === slug);
}
