// hieu.asia — Nội dung trang ý nghĩa 56 lá Ẩn phụ (Minor Arcana), đợt 2 thư viện tarot.
// Nghĩa theo truyền thống Rider–Waite–Smith, giọng phản tư của site (gợi câu hỏi, không phán).
// Khác engine lib/tools/tarot.ts (nghĩa 1 dòng cho lượt rút): đây là dữ liệu BIÊN TẬP cho trang tĩnh.
// name_vi khớp đúng tên hiển thị của engine ("Át Gậy" … "Vua Tiền") để người rút tra được lá vừa gặp.

import type { TarotCardPage } from './tarot-card-pages';

export const MINOR_PAGES: TarotCardPage[] = [
  // ============ GẬY (Wands) — lửa: hành động, đam mê, năng lượng ============
  {
    slug: 'ace-of-wands',
    name: 'Ace of Wands',
    name_vi: 'Át Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 1,
    keyUp: ['tia cảm hứng', 'khởi sự', 'đam mê mới'],
    keyRev: ['hứng tắt nhanh', 'trì hoãn khởi đầu'],
    image:
      'Một bàn tay vươn ra từ mây, nắm cây gậy còn đang đâm chồi xanh. Năng lượng sống ở dạng thô nhất: một xung lực muốn-bắt-đầu.',
    symbols:
      'Bàn tay vươn ra từ đám mây: cơ hội đến như được trao, không phải thứ nặn ra bằng cố gắng. Cây gậy còn đâm chồi xanh, tức năng lượng ở dạng sống, chưa định hình nhưng đang lớn. Phía xa là tòa lâu đài trên đồi: đích đến khả dĩ, còn cách một quãng đường. Trong hệ RWS, Gậy thuộc nguyên tố Lửa; Át Gậy là hạt lửa nguyên chất mà mọi câu chuyện của bộ này khởi đi từ đó.',
    storyArc:
      'Điểm khởi phát của cốt truyện Gậy: hạt mầm thuần khiết nhất của Lửa, một xung lực muốn bắt đầu, chưa kèm kế hoạch hay gánh nặng nào. Các lá sau sẽ lần lượt thử thách tia lửa này; còn ở đây, việc duy nhất là đừng để nó tắt trước khi kịp bén.',
    up: 'Át Gậy là tia lửa: một ý tưởng, một cơ hội, một việc khiến bạn rạo rực muốn làm ngay. Lá này không hứa kết quả — nó chỉ xác nhận rằng nguồn năng lượng đang có thật, và năng lượng kiểu này không giữ được lâu trong kho. Cách dùng tốt nhất: biến hứng thành một bước thử nhỏ trong vòng vài ngày, trước khi đời thường kịp dập tắt nó. Một cách rất cụ thể: hẹn chính mình một buổi trong tuần chỉ để phác bản nháp đầu tiên, gọi một cuộc điện thoại, đăng ký một buổi học thử. Cơ hội mới không cần bạn giỏi ngay; nó chỉ cần bạn có mặt lúc lửa còn nóng.',
    rev: 'Chiều ngược là cái hứng bị nghẽn: ý tưởng nằm trong sổ tay mãi không thành việc, hoặc bắt đầu rồi xìu sau ba hôm. Đáng hỏi: thứ này thật sự là đam mê của bạn — hay chỉ là cơn hào hứng mượn từ người khác? Nếu đã vài lần định bắt đầu mà chưa lần nào nhúc nhích, cái thiếu thường không phải thời gian, mà một bước mở màn đủ nhỏ để làm ngay hôm nay: mở tài liệu, đặt tên dự án, nhắn cho một người liên quan.',
    love: 'Trong tình cảm: một rung động mới, hoặc lửa cũ bỗng được khơi lại. Đừng phân tích vội — cho cảm xúc này một cơ hội được thử. Với người đang trong quan hệ lâu năm, lá này gợi việc chủ động tạo lại một cái hẹn kiểu thời mới quen; lửa cũ không tự cháy lại, nhưng bén nhanh khi có người chịu quẹt diêm.',
    work: 'Trong công việc: thời điểm tốt để pitch ý tưởng, mở dự án, học thứ mình tò mò. Bước thử rẻ nhất trong tuần này là gì? Nếu chưa ai trao cơ hội, thử tự tạo một cái: đề xuất một cải tiến nhỏ, nhận phần việc chưa ai nhận. Năng lượng Át Gậy đứng về phía người đi bước trước.',
    reflect: [
      'Ý tưởng nào khiến bạn háo hức ba ngày liên tiếp gần đây?',
      'Nếu chỉ có một giờ để bắt đầu nó ngay hôm nay, bạn sẽ làm gì trong giờ đó?',
    ],
  },
  {
    slug: 'two-of-wands',
    name: 'Two of Wands',
    name_vi: 'Hai Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 2,
    keyUp: ['tầm nhìn', 'lập kế hoạch', 'chọn hướng đi'],
    keyRev: ['sợ rời vùng an toàn', 'kế hoạch trên giấy'],
    image:
      'Một người đứng trên tường lâu đài, tay cầm quả địa cầu nhỏ, mắt nhìn ra biển. Thế giới trong tay — nhưng vẫn đang đứng trong tường thành của mình.',
    symbols:
      'Người đứng trên tường thành cao: vị trí đã an toàn và có tầm nhìn. Quả địa cầu nhỏ gọn trong lòng bàn tay: thế giới thu về dạng ngắm nghía được — giai đoạn hoạch định, mọi thứ còn trong hình dung. Một cây gậy được giữ trong tay, cây kia gắn cố định vào tường: một phần đời đã ổn định, một phần đang chờ được mang đi. Ánh mắt hướng ra biển, nơi mọi kế hoạch sớm muộn phải rời bờ.',
    storyArc:
      'Bước hai của cốt truyện Gậy: sau tia lửa của Át là thế cân bằng đôi — ở lại nơi an toàn hay mang lửa đi xa. Số 2 trong mọi chất nói về lựa chọn và quan hệ hai chiều; riêng ở bộ Gậy, nó thành câu hỏi về tầm nhìn: có dám hoạch định lớn hơn hiện tại không.',
    up: 'Hai Gậy là khoảnh khắc sau tia lửa: bạn đã có ý định, giờ là lúc ngắm bản đồ — đi đâu, đánh đổi gì, phạm vi nào vừa sức. Lá này quý ở chỗ nó cho phép tham vọng: dám hình dung một tương lai lớn hơn hiện tại. Kế hoạch tốt không phải kế hoạch hoàn hảo, mà là kế hoạch đủ rõ để bước chân đầu tiên biết đặt vào đâu. Giai đoạn này chưa cần đi xa, chỉ cần trung thực về đích muốn tới; người không dám nói to tham vọng của mình thường cũng không dám bước bước đầu tiên.',
    rev: 'Ngược chiều, quả địa cầu vẫn nằm trong tay mà chân không rời tường thành: tính mãi, cân nhắc mãi, an toàn quá lâu. Một kế hoạch không có ngày bắt đầu chỉ là một giấc mơ có gạch đầu dòng. Dấu hiệu nhận biết: bạn thuộc lòng ưu nhược điểm của từng phương án nhưng chưa đặt nổi một ngày khởi hành. Thử đảo cách làm — chọn ngày trước, rồi để kế hoạch tự xếp quanh cái mốc đó.',
    love: 'Trong tình cảm: hai người nên ngồi vẽ chung một bức tranh xa hơn — sống ở đâu, tiền bạc thế nào, muốn đời chung ra sao. Khác tầm nhìn không đáng sợ bằng không ai dám nói tầm nhìn của mình. Nếu một người vẽ tương lai còn người kia chỉ ậm ừ, đó là dữ kiện đáng ngồi lại nói chuyện, không phải chuyện nhỏ để bỏ qua.',
    work: 'Trong công việc: thời điểm hoạch định — mở rộng hay đào sâu, thị trường nào, kỹ năng nào cần trước. Viết kế hoạch ra giấy kèm một mốc ngày cụ thể. Kế hoạch nằm trong đầu là tài sản riêng; kế hoạch viết ra có mốc ngày là cam kết. Khoảng cách giữa hai thứ đó chính là điều lá này muốn bạn nhìn.',
    reflect: [
      'Bức tranh 3 năm tới bạn thật sự muốn trông như thế nào — nói to lên được không?',
      'Điều gì giữ bạn trong "tường thành" hiện tại: sự hợp lý, hay sự quen?',
    ],
  },
  {
    slug: 'three-of-wands',
    name: 'Three of Wands',
    name_vi: 'Ba Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 3,
    keyUp: ['có trớn ban đầu', 'mở rộng', 'chờ thuyền về'],
    keyRev: ['chậm trễ', 'kỳ vọng lệch thực tế'],
    image:
      'Người đàn ông đứng trên đồi cao nhìn ra biển, ba cây gậy cắm vững quanh mình, những con thuyền đang dong buồm phía xa. Việc đã khởi hành — giờ là đoạn giữ nhịp và ngóng kết quả.',
    symbols:
      'Người đứng trên đồi cao, đã ra khỏi tường thành của Hai Gậy: tầm nhìn giờ là của người trong cuộc, không còn là người đứng ngắm. Ba cây gậy cắm vững quanh mình: những gì đã gây dựng tự đứng được. Thuyền buồm ngoài khơi: phần việc đã gửi đi, đang vận hành ngoài tầm tay. Tư thế tĩnh mà không rảnh — đó là dáng của sự chủ động chờ, khác hẳn ngồi không.',
    storyArc:
      'Bước ba của cốt truyện Gậy: thành hình bước đầu. Số 3 trong mọi chất là lúc lựa chọn của số 2 bắt đầu ra kết quả sớm và mở rộng; ở bộ Gậy, đó là cảnh thuyền đã rời bến — việc đã có trớn, câu hỏi chuyển từ "có làm không" sang "lớn tới đâu".',
    up: 'Ba Gậy là giai đoạn việc đã chạy: những gì bạn gieo bắt đầu có trớn, cơ hội mở rộng xuất hiện — đối tác mới, thị trường xa hơn, vòng quan hệ rộng hơn. Lá này gợi tư thế chủ động chờ: không ngồi không, mà chuẩn bị sẵn bến bãi cho lúc thuyền về. Tầm nhìn đã thành chuyển động; đừng quay đầu giữa chừng chỉ vì kết quả chưa cập cảng. Chuẩn bị bến bãi nghĩa là gì? Người sẽ cùng làm tiếp, quy trình cho đơn hàng thứ hai, sức chứa cho giai đoạn đông việc hơn. Thuyền về mà bến chưa sẵn thì thành quả cũng rối.',
    rev: 'Ngược chiều: thuyền về chậm hơn hẹn, hoặc chở về thứ khác kỳ vọng. Trước khi nản, kiểm tra lại — kỳ vọng ban đầu có thực tế không, và độ trễ này là tín hiệu xấu hay chỉ là nhịp bình thường của biển? Cách làm cụ thể: đặt lại mốc thời gian thực tế, hỏi người đi trước xem nhịp này có bình thường không, rồi mới quyết định có đổi hướng.',
    love: 'Trong tình cảm: mối quan hệ cần không gian lớn hơn — chuyến đi chung, kế hoạch chung, hoặc đơn giản là dám nghĩ xa hơn vài tháng tới. Một chuyến đi xa cùng nhau là phép thử tốt: người ta lộ cách phối hợp, cách xử lý trục trặc, rõ hơn cả năm hẹn hò quanh quẩn.',
    work: 'Trong công việc: kết quả đầu tiên ló dạng — đúng lúc cân nhắc mở rộng. Nhưng mở rộng trên cái đang chạy tốt, đừng mở rộng để chạy trốn cái đang dở dang. Dấu hiệu nên mở rộng: việc hiện tại chạy ổn mà không cần bạn trực từng giờ. Nếu vẫn phải vá mỗi ngày, mở rộng chỉ nhân đôi chỗ rách.',
    reflect: [
      '"Con thuyền" nào bạn đã thả đi và đang ngóng — bạn đã chuẩn bị gì cho lúc nó về?',
      'Nếu kết quả về chậm 3 tháng so với mong đợi, kế hoạch của bạn còn đứng vững không?',
    ],
  },
  {
    slug: 'four-of-wands',
    name: 'Four of Wands',
    name_vi: 'Bốn Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 4,
    keyUp: ['ăn mừng', 'mái ấm', 'cột mốc', 'sum họp'],
    keyRev: ['cột mốc bị bỏ quên', 'bất ổn chỗ ở'],
    image:
      'Bốn cây gậy dựng thành cổng kết hoa, hai người nâng bó hoa chào đón, phía sau là tòa nhà vững và đám đông vui. Hình ảnh của lễ mừng và một nơi để trở về.',
    symbols:
      'Bốn cây gậy dựng thành cổng, kết vòng hoa trái: cấu trúc đầu tiên của bộ Gậy — lửa đã thành nơi chốn. Hai người nâng hoa chào đón, đám đông phía sau: niềm vui ở đây mang tính cộng đồng, không phải thành tựu đơn độc. Tòa nhà vững phía xa: một nền tảng để trở về. Số 4 là hình của sự ổn định; ở bộ Gậy, sự ổn định mang gương mặt một lễ mừng.',
    storyArc:
      'Bước bốn của cốt truyện Gậy: dừng lại và giữ vững. Sau khi việc có trớn ở Ba Gậy, số 4 là trạm nghỉ có chủ đích — ăn mừng cột mốc, củng cố cảm giác nhà. Nghỉ ở đây không phải trì trệ; nó nạp sức cho cú xáo trộn sắp tới ở Năm Gậy.',
    up: 'Bốn Gậy là cột mốc đáng mừng: tân gia, cưới hỏi, xong một chặng, đội nhóm gắn kết, gia đình sum vầy. Lá này nhắc một việc người chăm chỉ hay quên: dừng lại ăn mừng. Niềm vui được đánh dấu tử tế sẽ thành ký ức nuôi mình lúc khó; thành quả không được ăn mừng thì chỉ là một dòng gạch đầu dòng trôi qua. Lễ không cần to: một bữa ăn đàng hoàng, một lời cảm ơn nói trước mặt nhau, một tấm ảnh in ra. Điều quan trọng là có một khoảnh khắc được đánh dấu "chúng ta đã tới đây".',
    rev: 'Ngược chiều: một cột mốc đi qua mà không ai buồn đánh dấu, hoặc cảm giác "nhà" đang lung lay — nơi ở, nơi làm, nhóm bạn không còn cho cảm giác thuộc về. Đáng hỏi: bạn cần sửa chỗ đứng, hay cần tìm chỗ mới? Nếu sự lung lay đến từ chỗ ở hay nhóm đang gắn bó, đừng vội kết luận một mình; kiểm tra xem đó là vấn đề của nơi chốn, hay của một giai đoạn ai cũng đang mỏi.',
    love: 'Trong tình cảm: giai đoạn ấm — ra mắt, về chung, kỷ niệm. Hãy là người chủ động tạo dịp; sự gắn bó được nuôi bằng những lễ nhỏ đều đặn hơn là lễ to hiếm hoi. Chú ý cả những lễ của riêng hai người: kỷ niệm ngày quen, thói quen tối thứ sáu. Bỏ chúng vài lần thì dễ, gây lại nhịp mới khó.',
    work: 'Trong công việc: dự án cán mốc — tổ chức một buổi tổng kết tử tế cho cả nhóm. Văn hóa ăn mừng đúng lúc giữ người giỏi hơn lương thưởng đơn thuần. Buổi tổng kết còn là chỗ ghi nhận công khai từng người; ai được gọi tên đúng việc sẽ nhớ rất lâu.',
    reflect: [
      'Thành quả nào gần đây của bạn xứng đáng một bữa ăn mừng mà bạn đã bỏ qua?',
      'Nơi nào cho bạn cảm giác "về nhà" — và bạn có đang vun cho nơi đó không?',
    ],
  },
  {
    slug: 'five-of-wands',
    name: 'Five of Wands',
    name_vi: 'Năm Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 5,
    keyUp: ['va chạm ý kiến', 'cạnh tranh', 'tập dượt'],
    keyRev: ['cãi vã vô ích', 'né xung đột cần thiết'],
    image:
      'Năm thanh niên khua năm cây gậy vào nhau — nhìn như đánh nhau, nhưng không ai bị thương. Một trận tập dượt nhiều hơn một trận chiến.',
    symbols:
      'Năm người vung năm cây gậy theo năm hướng, không ai trúng ai: cảnh hỗn loạn nhưng không đổ máu. Trang phục mỗi người một kiểu: năm ý chí, năm cách nhìn, chưa ai chịu xếp thành đội hình. Đây là hình ảnh trung thực về xung đột đời thường — ồn ào, tốn sức, và thường vô hại hơn cảm giác. Số 5 ở mọi chất là cú xáo trộn giữa chặng; ở bộ Gậy, nó mang dạng va chạm của các ý chí.',
    storyArc:
      'Bước năm của cốt truyện Gậy: thử thách giữa chặng. Sự ổn định của Bốn Gậy không kéo dài mãi — khi nhiều ngọn lửa cùng cháy, va chạm là chuyện tất yếu. Vượt qua được cú xáo trộn này, năng lượng chung mới gom lại thành chiến thắng có người công nhận ở Sáu Gậy.',
    up: 'Năm Gậy là sự va chạm ồn ào mà ít sát thương: họp hành tranh cãi, đồng nghiệp ganh đua, anh em khắc khẩu. Lá này gợi cách nhìn lành mạnh về xung đột: ý kiến va nhau là cách ý tưởng được tôi luyện — miễn là đánh vào vấn đề, không đánh vào người. Cạnh tranh đúng kiểu làm tất cả cùng giỏi lên. Muốn va chạm sinh lợi, cần luật chơi rõ; thiếu luật, tranh luận chỉ là năm cây gậy khua trong không khí — mỏi tay tất cả, không xây được gì.',
    rev: 'Ngược chiều có hai mặt: hoặc cãi nhau triền miên về thứ không đáng (cái tôi đội lốt quan điểm), hoặc né tránh một cuộc tranh luận cần thiết để giữ hòa khí giả. Im lặng cho yên chuyện thường chỉ hoãn chuyện, không yên chuyện. Phép thử nhanh: cuộc cãi này có sinh ra quyết định nào không? Ba lần tranh luận không ra một quyết định là dấu hiệu cái tôi đã ngồi vào ghế của vấn đề.',
    love: 'Trong tình cảm: khắc khẩu chưa chắc là khắc mệnh — nhưng để ý xem hai người đang tranh luận để hiểu nhau, hay để thắng nhau. Cặp nào cũng có vài đề tài "gậy khua" kinh niên; đáng lo không phải vì còn cãi, mà khi một người thôi buồn cãi — im lặng mới là tín hiệu nguội.',
    work: 'Trong công việc: môi trường đang nhiều tiếng nói. Đặt luật chơi cho tranh luận (nói có dữ kiện, không cắt lời, chốt người quyết) sẽ biến ồn ào thành chất lượng. Nếu bạn là người điều phối, đừng dập tranh luận quá sớm; ý tưởng tốt nhất thường xuất hiện sau khi các ý dễ dãi đã bị loại.',
    reflect: [
      'Cuộc tranh cãi gần nhất của bạn: đánh vào vấn đề hay đánh vào người?',
      'Có cuộc đối thoại khó nào bạn đang né mà càng né càng phình to?',
    ],
  },
  {
    slug: 'six-of-wands',
    name: 'Six of Wands',
    name_vi: 'Sáu Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 6,
    keyUp: ['thắng lợi', 'được công nhận', 'tin vui'],
    keyRev: ['hư danh', 'sợ thất bại công khai', 'thiếu ghi nhận'],
    image:
      'Người kỵ sĩ đội vòng nguyệt quế cưỡi ngựa qua đám đông, cây gậy trên tay cũng kết vòng hoa. Chiến thắng — và quan trọng không kém: được mọi người nhìn thấy.',
    symbols:
      'Kỵ sĩ đội vòng nguyệt quế — biểu tượng chiến thắng có từ thời Hy La — cưỡi ngựa đi giữa đám đông. Cây gậy trên tay cũng kết vòng hoa: thành quả được trưng ra, không giấu. Đám đông vây quanh: sự công nhận là một phần của chiến thắng, con người cần được nhìn thấy. Nhưng người ngồi trên ngựa cũng là người dễ ngã nhất nếu chỉ sống bằng tiếng vỗ tay — lá này chứa cả lời khen lẫn lời nhắc.',
    storyArc:
      'Bước sáu của cốt truyện Gậy: hồi phục và hài hòa sau va chạm. Số 6 ở mọi chất là lúc mọi thứ vào lại quỹ đạo; ở bộ Gậy, nó thành tin vui và sự công nhận — cuộc đấu ở Năm Gậy đã ra kết quả, và kết quả được mang ra giữa đám đông.',
    up: 'Sáu Gậy là tin vui sau nỗ lực: được khen đúng việc, đậu kỳ thi, dự án thành, lời mời tốt tìm đến. Lá này nói về sự công nhận — thứ con người ai cũng cần dù hay chối. Nhận lời khen một cách đàng hoàng ("cảm ơn, tôi đã làm việc thật") cũng là một kỹ năng; khiêm tốn giả vờ đôi khi chỉ là cách từ chối niềm vui của chính mình. Sự công nhận còn là tài nguyên: dùng nó để mở cánh cửa kế tiếp — một lời giới thiệu, một dự án lớn hơn — thay vì chỉ đóng khung treo tường.',
    rev: 'Ngược chiều: hoặc thành tích chỉ đẹp trên bề mặt (đám đông vỗ tay nhưng mình biết rõ phần rỗng), hoặc nỗ lực thật mà không ai ghi nhận — và bạn bắt đầu nghi ngờ giá trị của mình. Giá trị của việc bạn làm không chờ tiếng vỗ tay mới tồn tại. Nếu đang ở phía không được ghi nhận, thử một việc ít ai làm: tự kể thành quả của mình có dữ kiện, đúng dịp, đúng người. Chờ được phát hiện là chiến lược rủi ro.',
    love: 'Trong tình cảm: đừng tiếc lời ghi nhận nhau — "em thấy anh đã cố" có sức nặng hơn nhiều món quà. Người được nhìn thấy sẽ ở lại. Lời ghi nhận cụ thể mới nặng ký: nói đúng việc người kia đã làm, đúng cái giá họ đã trả, thay vì một câu khen chung chung.',
    work: 'Trong công việc: thời điểm tốt để trình bày thành quả, xin tăng lương, ứng tuyển vị trí cao hơn. Kể đúng công sức của mình không phải là khoe. Ghi lại thành tích kèm số liệu ngay khi còn nóng; đến kỳ đánh giá, trí nhớ của mọi người luôn ngắn hơn bạn tưởng.',
    reflect: [
      'Lời khen gần nhất bạn nhận: bạn đã đón nó thế nào — và vì sao?',
      'Ai quanh bạn đang xứng đáng một lời ghi nhận mà bạn chưa nói ra?',
    ],
  },
  {
    slug: 'seven-of-wands',
    name: 'Seven of Wands',
    name_vi: 'Bảy Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 7,
    keyUp: ['giữ vững lập trường', 'bảo vệ thành quả', 'kiên cường'],
    keyRev: ['đuối sức', 'cố thủ thứ không đáng'],
    image:
      'Một người đứng trên gò cao, cầm gậy gạt sáu cây gậy chĩa lên từ phía dưới. Vị thế cao hơn — nhưng phải liên tục chống đỡ.',
    symbols:
      'Người đứng trên gò cao vung gậy gạt sáu cây gậy chĩa lên từ phía dưới: vị thế cao hơn, nhưng một mình. Không thấy mặt người tấn công — thách thức trong đời thường cũng vậy, nhiều khi là dư luận, hoài nghi, tiêu chuẩn của người khác, không rõ mặt ai. Chi tiết hai chiếc giày khác nhau ở nhân vật thường được đọc là thế đứng chưa hoàn hảo: phòng thủ trong tư thế chông chênh mà vẫn trụ được.',
    storyArc:
      'Bước bảy của cốt truyện Gậy: kiên trì và đối mặt. Số 7 ở mọi chất là chặng đánh giá — thứ mình giữ có đáng giữ không. Sau vinh quang của Sáu Gậy, vị trí cao bắt đầu bị thách thức; giữ được qua chặng này mới tới được cú tăng tốc của Tám Gậy.',
    up: 'Bảy Gậy xuất hiện khi điều bạn xây bắt đầu bị thách thức: quan điểm bị phản bác, vị trí bị nhòm ngó, lựa chọn sống bị người thân chất vấn. Lá này gợi sự kiên định có căn cứ: nếu bạn đã suy xét kỹ và vẫn tin, hãy giữ — người đứng trên gò có lợi thế, đừng tự bỏ gò chạy xuống. Bị phản đối không có nghĩa là sai; mọi thứ đáng giá đều từng bị phản đối. Kiên định có căn cứ nghĩa là trả lời được hai câu: mình giữ điều này vì lý do gì, và bằng chứng nào sẽ khiến mình đổi ý. Có câu trả lời cho cả hai, bạn đứng rất vững.',
    rev: 'Ngược chiều: cuộc phòng thủ đã kéo quá dài và bạn đuối — hoặc tệ hơn, thứ đang cố thủ không còn đáng để thủ. Kiên định và cố chấp giống nhau ở tư thế, khác nhau ở câu hỏi: "nếu có bằng chứng ngược, mình có đổi ý không?" Một cách gỡ: liệt kê ra giấy cái giá của việc giữ và cái giá của việc buông. Nhiều cuộc phòng thủ tự kết thúc khi nhìn thấy con số.',
    love: 'Trong tình cảm: có thể bạn đang phải bảo vệ lựa chọn của mình trước gia đình, bạn bè. Nghe hết — rồi tự quyết. Người ngoài góp ý đời bạn, nhưng không sống đời bạn. Ranh giới lành mạnh: tiếp nhận góp ý với thái độ tử tế, nhưng quyền quyết chuyện đời mình không đem ra biểu quyết.',
    work: 'Trong công việc: cạnh tranh tăng, ý tưởng bị thử lửa. Chuẩn bị dữ kiện kỹ hơn thay vì nói to hơn. Khi ý tưởng bị chất vấn, người thắng không phải người nói to nhất mà là người có dữ kiện dày nhất; về gom thêm một lớp số liệu rồi quay lại bàn.',
    reflect: [
      'Điều bạn đang bảo vệ: bạn giữ nó vì còn tin, hay vì đã lỡ tuyên bố?',
      'Trận nào đáng đánh tiếp, trận nào nên rút để giữ sức cho trận đáng?',
    ],
  },
  {
    slug: 'eight-of-wands',
    name: 'Eight of Wands',
    name_vi: 'Tám Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 8,
    keyUp: ['tăng tốc', 'tin tức dồn dập', 'mọi thứ chuyển động'],
    keyRev: ['chậm trễ', 'loạn nhịp', 'tin nhiễu'],
    image:
      'Tám cây gậy bay song song giữa trời quang, không người, không cản trở. Lá hiếm hoi không có nhân vật — vì nhân vật chính là tốc độ.',
    symbols:
      'Tám cây gậy bay song song qua bầu trời quang, cùng hướng, cùng độ nghiêng, đang chúc xuống như sắp chạm đất: mọi thứ về đích cùng lúc. Đây là một trong số ít lá RWS không có nhân vật — khi tốc độ là chủ đề, con người chỉ việc thuận theo. Dòng sông và đồng cỏ yên bình bên dưới: chuyển động nhanh không đồng nghĩa hỗn loạn; tám cây gậy nhanh mà thẳng hàng.',
    storyArc:
      'Bước tám của cốt truyện Gậy: vận động nhanh. Số 8 mỗi chất mang một sắc riêng — ở bộ Gậy là tốc độ thuần: sau khi trụ vững qua thử thách của Bảy Gậy, các cánh cửa mở cùng lúc. Hưởng cái đà này, nhưng để dành sức: chặng gần cuối ở Chín Gậy sẽ cần nó.',
    up: 'Tám Gậy là giai đoạn mọi thứ tăng tốc: tin nhắn dồn về, cơ hội đến nhanh, việc tưởng lâu bỗng xong sớm. Lá này khuyên thuận theo đà: trả lời nhanh, quyết nhanh những thứ đã đủ dữ kiện, đừng để cơ hội nguội vì thói quen "để mai tính". Nhưng tốc độ chỉ đẹp khi có hướng — tám cây gậy bay cùng một phía. Cách nhận diện giai đoạn này: những việc từng chờ hàng tháng bỗng có phản hồi trong vài ngày. Ưu tiên dứt điểm từng việc một; tốc độ cao mà nhảy cóc giữa mười việc thì thành quay vòng tại chỗ.',
    rev: 'Ngược chiều: mọi thứ ì lại — chờ phản hồi, chờ duyệt, chờ người. Hoặc ngược lại: quá nhiều thứ bay đến cùng lúc thành nhiễu. Lúc này thứ cần không phải nhanh hơn mà là lọc: việc nào thật sự cần bạn tuần này? Một bộ lọc đơn giản: việc này nếu không làm tuần này thì mất gì? Không mất gì rõ ràng thì xếp hàng sau.',
    love: 'Trong tình cảm: chuyện tiến triển nhanh — nhắn nhiều, gặp dày, cảm xúc tăng tốc. Tận hưởng, nhưng thỉnh thoảng kiểm tra xem cả hai có đang cùng một vận tốc. Một câu đáng hỏi thẳng khi mọi thứ đang nhanh: mình tiến nhanh vì hợp, hay vì cả hai cùng sợ khoảng lặng?',
    work: 'Trong công việc: giai đoạn bận tốt — nhiều chuyển động, nhiều phản hồi. Dọn lịch để bắt kịp; một ngày chậm lúc này đắt hơn bình thường. Trả lời nhanh nhưng đừng hứa nhanh — lời hứa là thứ duy nhất không nên đưa ra ở tốc độ cao.',
    reflect: [
      'Cơ hội nào đang chờ một câu trả lời của bạn lâu hơn mức nó đáng phải chờ?',
      'Tốc độ hiện tại của bạn: đang có hướng, hay chỉ đang có đà?',
    ],
  },
  {
    slug: 'nine-of-wands',
    name: 'Nine of Wands',
    name_vi: 'Chín Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 9,
    keyUp: ['chặng cuối', 'bền bỉ', 'cảnh giác có lý do'],
    keyRev: ['kiệt sức', 'phòng thủ quá đà'],
    image:
      'Người lính băng đầu, tựa vào cây gậy, sau lưng là hàng rào tám cây gậy thẳng đứng. Mệt và đầy vết trận — nhưng vẫn đứng.',
    symbols:
      'Người lính băng đầu tựa vào cây gậy: vết thương là thật, và cây gậy từng là vũ khí giờ thành gậy chống. Hàng rào tám cây gậy dựng sau lưng: mọi trận đã qua xếp thành lũy — kinh nghiệm vừa bảo vệ vừa che bớt tầm nhìn. Ánh mắt ngoái nhìn cảnh giác: người từng trầy trật không còn ngây thơ, nhưng cũng dễ thấy kẻ địch ở nơi chỉ có người qua đường.',
    storyArc:
      'Bước chín của cốt truyện Gậy: gần trọn — đỉnh cảm xúc của bộ Lửa, ở đây mang dạng mệt mà chưa được buông. Sau cú tăng tốc của Tám Gậy, sức cạn dần trong khi đích ở ngay kia; qua được nhịp này, Mười Gậy sẽ đặt câu hỏi cuối: gánh gì tiếp, buông gì xuống.',
    up: 'Chín Gậy là lá của chặng cuối: đã đi xa, đã trầy trật, và đích thật sự không còn xa. Lá này thừa nhận cái mệt của bạn là có thật — đồng thời nhắc rằng kinh nghiệm từ những lần vấp chính là hàng rào đang bảo vệ bạn. Đừng nhầm "mệt" với "sai đường"; người về đích thường là người chịu mệt thêm đúng một chặng nữa. Hai việc giúp chặng cuối bớt dài: đo lại quãng đường còn lại bằng con số thay vì bằng cảm giác, và tìm một người đi cùng đoạn cuối — không ai quy định phải về đích một mình.',
    rev: 'Ngược chiều: sự bền bỉ đã chuyển thành kiệt quệ, hoặc những vết thương cũ làm bạn phòng thủ với cả người không định làm hại mình. Nghỉ không phải là bỏ cuộc — và không phải ai đến gần cũng là để tấn công. Phân biệt giúp: kiệt sức cần nghỉ, còn phòng thủ quá đà cần một lần dám tin thử. Hai bệnh khác nhau, đừng uống chung một thuốc.',
    love: 'Trong tình cảm: vết thương cũ có thể đang khiến bạn thủ thế với người mới. Cẩn trọng là khôn; mặc nguyên giáp đi hẹn hò thì không. Người mới không nợ bạn lời xin lỗi của người cũ. Thử hạ một thanh gậy của hàng rào xuống mỗi lần họ chứng minh được một điều nhỏ.',
    work: 'Trong công việc: dự án ở đoạn 80% — đoạn dễ bỏ nhất. Chia phần còn lại thành mục tiêu thật nhỏ và đi từng bước. Đánh dấu từng phần vừa xong nghe có vẻ thừa, nhưng chính nó giữ chân người chạy đường dài qua đoạn khó nhất.',
    reflect: [
      'Thứ bạn sắp bỏ cuộc: còn bao xa nữa thật sự — đã đo chưa, hay chỉ cảm thấy xa?',
      'Hàng rào nào của bạn đang bảo vệ, hàng rào nào đang giam?',
    ],
  },
  {
    slug: 'ten-of-wands',
    name: 'Ten of Wands',
    name_vi: 'Mười Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 10,
    keyUp: ['quá tải', 'gánh nhiều vai', 'trách nhiệm chồng'],
    keyRev: ['buông bớt', 'học từ chối', 'san sẻ'],
    image:
      'Một người ôm cả bó mười cây gậy, còng lưng đi về phía ngôi làng phía xa — gậy che luôn tầm nhìn phía trước. Gánh được, nhưng không thấy đường.',
    symbols:
      'Người ôm bó mười cây gậy trước ngực, lưng còng, bước về ngôi làng phía xa: đích có thật và không xa, nhưng tư thế ôm khiến mỗi bước đều nặng. Chi tiết đắt nhất: bó gậy che luôn tầm nhìn phía trước — người gánh quá nhiều mất trước tiên không phải sức, mà là khả năng thấy đường. Không ai trong tranh bắt anh ôm cả bó; đó là lựa chọn, và lựa chọn thì đổi được.',
    storyArc:
      'Bước mười, chặng cuối cốt truyện Gậy: trọn vẹn nhưng quá tải. Ngọn lửa khởi đi từ Át giờ thành cả bó trách nhiệm trên vai. Số 10 vừa là đỉnh vừa là cửa sang chu kỳ mới: đặt bớt gánh xuống, chọn lại tia lửa nào đáng mang theo, rồi bắt đầu một vòng Át mới.',
    up: 'Mười Gậy là sức nặng của thành công: việc nhiều vì bạn làm được việc, vai nhiều vì bạn đáng tin. Nhưng lá này chỉ thẳng cái giá: ôm hết thì lưng còng và mắt không còn thấy hướng. Câu hỏi của nó rất thực dụng: trong bó gậy đang vác, cây nào thật sự phải là của bạn — và cây nào bạn vác chỉ vì không ai dám nói "để tôi". Một bài tập cụ thể: viết mọi việc đang ôm ra một cột, cột bên cạnh ghi "ai giao việc này cho mình". Nhiều dòng sẽ trống — đó chính là những cây gậy tự nguyện vác.',
    rev: 'Ngược chiều là tin tốt đang đến gần: bạn bắt đầu thấy mình không cần vác hết — giao bớt, từ chối bớt, bỏ hẳn vài thứ. Buông một việc không quan trọng để làm tốt việc quan trọng không phải là thất hứa, đó là trung thực về giới hạn. Giao việc lần đầu luôn chậm hơn tự làm; đó là học phí trả một lần, còn tự ôm là học phí trả hằng tuần.',
    love: 'Trong tình cảm: một người gánh hết — tiền, nhà cửa, cảm xúc — lâu dần sẽ thành một người oán thầm. Chia gánh là việc của hai người, nói ra là bước đầu. Nói ra cần cụ thể: không phải "anh chẳng giúp gì" mà là "tuần này em cần anh nhận hẳn việc đón con". Gánh chỉ san được khi từng món có tên.',
    work: 'Trong công việc: liệt kê mọi việc đang ôm, đánh dấu thứ chỉ-mình-làm-được. Phần còn lại: giao, hoãn, hoặc bỏ. Cảnh giác với phần thưởng của người gánh giỏi: càng gánh tốt càng được giao thêm — người biết từ chối đúng lúc giữ chữ tín lâu hơn người nhận tất rồi trễ tất.',
    reflect: [
      'Việc nào bạn đang vác mà thật ra không ai yêu cầu bạn vác?',
      'Nếu buộc phải bỏ 3 thứ khỏi vai trong tuần này, bạn bỏ gì — và điều gì cản bạn làm thế ngay?',
    ],
  },
  {
    slug: 'page-of-wands',
    name: 'Page of Wands',
    name_vi: 'Thị Đồng Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 11,
    keyUp: ['tò mò', 'tin vui về cơ hội', 'tinh thần thử nghiệm'],
    keyRev: ['cả thèm chóng chán', 'thiếu kiên trì'],
    image:
      'Chàng trai trẻ giữa sa mạc, ngắm cây gậy đâm chồi trên tay như ngắm một điều kỳ diệu nhỏ. Chưa có chiến tích — nhưng có thứ quý không kém: sự háo hức.',
    symbols:
      'Chàng trai trẻ đứng giữa vùng đất trống, ngắm cây gậy đâm chồi trên tay như ngắm một điều lạ. Trang phục điểm hình kỳ nhông lửa — sinh vật gắn với nguyên tố Lửa, còn thấy trên giáp Hiệp Sĩ và áo choàng Vua Gậy. Trong tranh chưa có trận chiến, chưa có thành quả, chỉ có sự chú tâm háo hức: giá trị của người mới không nằm ở cái đã làm được, mà ở con mắt chưa bị thói quen làm mờ.',
    storyArc:
      'Lá hoàng gia đầu tiên của bộ Gậy, đọc theo hai trục: cấp Thị Đồng là người học việc, lần đầu chạm vào chất; chất Gậy là ý chí và đam mê. Ghép lại: người mới của ngọn lửa — tò mò, dám thử, chưa bị kinh nghiệm ghìm tay. Có thể là một người trẻ quanh bạn, hoặc chính phần ham thử của bạn.',
    up: 'Thị Đồng Gậy là tinh thần người mới bắt đầu: tò mò, dám thử, chưa bị kinh nghiệm làm cho rụt rè. Lá này hay báo một tin vui nhỏ về cơ hội — lời rủ rê một dự án, một lớp học, một chuyến đi. Nó cũng nhắc người đã "già nghề": thử làm lại điều gì đó với con mắt lần đầu, bạn sẽ thấy thứ mà sự thành thạo che mất. Như mọi lá hoàng gia, nó có thể chỉ một người thật quanh bạn, một vai bạn đang đóng, hoặc một kiểu năng lượng đang cần được dùng — với Thị Đồng Gậy, thường là lời nhắc cho phần ham thử trong chính mình.',
    rev: 'Ngược chiều: hứng nhanh nguội nhanh, nhảy từ thứ này sang thứ khác mà không thứ nào quá ba tuần. Tò mò là tài sản; tò mò không có điểm đáp thì chỉ là giải trí. Cách chữa không phải ép mình kiên trì mọi thứ, mà là chọn lọc: mỗi quý chỉ cho phép một hai cuộc thử mới, đổi lại mỗi cuộc phải có điểm kiểm tra ở tuần thứ tư.',
    love: 'Trong tình cảm: năng lượng tán tỉnh, rủ rê, làm quen — vui và nhẹ. Cứ để nhẹ, nhưng chân thành: đùa vui khác với đùa giỡn cảm xúc người khác. Nếu đối phương mang năng lượng này, đừng vội đòi cam kết dài hạn ở tuần thứ hai; xem sự háo hức có sống qua nổi vài lần trục trặc nhỏ không.',
    work: 'Trong công việc: hợp giai đoạn học việc, thử vai mới, làm prototype. Cho phép mình làm dở lúc đầu — đó là học phí rẻ nhất. Người mới trong nhóm là tài nguyên hay bị bỏ phí: câu hỏi "ngớ ngẩn" của họ thường chỉ ra đúng chỗ quy trình đã lỗi thời. Nếu bạn là người mới, cứ hỏi.',
    reflect: [
      'Lần gần nhất bạn thử một thứ hoàn toàn mới là khi nào?',
      'Trong các thứ đang "thèm thử", thứ nào bạn sẵn lòng theo ít nhất ba tháng?',
    ],
  },
  {
    slug: 'knight-of-wands',
    name: 'Knight of Wands',
    name_vi: 'Hiệp Sĩ Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 12,
    keyUp: ['nhiệt huyết', 'hành động táo bạo', 'lao về mục tiêu'],
    keyRev: ['bốc đồng', 'hứa rồi rời đi', 'nóng vội'],
    image:
      'Hiệp sĩ trên lưng ngựa chồm vó, áo giáp điểm hình kỳ nhông lửa, lông mũ như ngọn lửa bốc. Năng lượng đẹp nhất và khó kiểm soát nhất của bộ Gậy.',
    symbols:
      'Hiệp sĩ trên lưng ngựa đang chồm vó, giáp điểm hình kỳ nhông lửa, chỏm mũ và tay áo tua ra như ngọn lửa đang bốc. Ngựa của bốn Hiệp Sĩ mỗi con một nhịp; con này ở thế lao — nhiệt và tốc độ là bản chất của lá. Sa mạc phía sau: lửa lớn thì đất quanh khô; người mang năng lượng này đi tới đâu cũng gây chuyển động, và cũng cần một người giữ nước bên cạnh.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Hiệp Sĩ là hành động ở thái cực — phiên bản đậm và bốc nhất của chất; chất Gậy là ý chí, đam mê. Ghép lại thành cú lao của ngọn lửa: đẹp, dứt khoát, dễ quá đà. Lá có thể chỉ một người như vậy quanh bạn, hoặc chính giai đoạn bạn đang muốn lao.',
    up: 'Hiệp Sĩ Gậy là cú lao tới: nhận việc khó, chuyển nơi sống, theo đuổi điều mình muốn một cách công khai và rực rỡ. Lá này quý ở sự dứt khoát — trong khi người khác còn cân nhắc, bạn đã ở trên đường. Có những cánh cửa chỉ mở cho người dám gõ mạnh. Thời điểm hợp nhất với năng lượng này: khi mọi phân tích đã xong mà việc vẫn đứng yên, cần đúng một cú đẩy không do dự. Khi đó, sự dứt khoát là kỹ năng, không phải liều lĩnh.',
    rev: 'Ngược chiều: lửa thành bốc đồng — quyết trong cơn hứng, hứa trong cơn vui, rồi nguội giữa chừng để lại dở dang cho người khác dọn. Trước cú lao kế tiếp, trả lời một câu: "ai sẽ gánh nếu mình đổi ý?" Thêm một bài kiểm tra: hình dung tuần thứ sáu, khi việc hết mới mẻ và bắt đầu lặp. Vẫn còn muốn làm ở tuần thứ sáu thì lao được; chỉ háo hức ngày khai trương thì chưa.',
    love: 'Trong tình cảm: cuốn hút mãnh liệt, tiến nhanh, nhiều cử chỉ lớn. Đẹp — nếu đi kèm khả năng ở lại khi hết tuần trăng mật. Nhìn hành động lặp lại, đừng chỉ nhìn màn mở đầu: có đến đúng hẹn không, có nhớ chuyện bạn kể không, có còn đó khi bạn ốm không.',
    work: 'Trong công việc: hợp các cú đẩy lớn — ra mắt, chạy chiến dịch, mở thị trường. Cặp với một người giỏi vận hành để lửa của bạn không đốt luôn quy trình: một người châm lửa, một người giữ cho lửa cháy trong lò thay vì cháy lan.',
    reflect: [
      'Điều gì bạn đang muốn lao vào — và bạn đã hình dung tới tuần thứ sáu chưa, hay mới tới ngày khai trương?',
      'Lời hứa nào bạn từng buông giữa chừng — nó dạy bạn gì về lời hứa sắp tới?',
    ],
  },
  {
    slug: 'queen-of-wands',
    name: 'Queen of Wands',
    name_vi: 'Hoàng Hậu Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 13,
    keyUp: ['tự tin ấm áp', 'truyền cảm hứng', 'sống rõ mình'],
    keyRev: ['cạn năng lượng', 'so sánh', 'ghen tị ngầm'],
    image:
      'Hoàng hậu ngồi thẳng, tay cầm gậy, tay cầm hoa hướng dương, con mèo đen ngồi dưới chân. Rực rỡ mà không chói; có cả phần bóng tối được thuần hóa.',
    symbols:
      'Hoàng hậu ngồi thẳng, một tay cầm gậy, một tay cầm hoa hướng dương: quyền lực và sức sống trưng ra cùng lúc, không giấu bên nào. Hoa hướng dương quay về phía sáng — kiểu người tự nhiên hút ánh nhìn vì sống đúng hướng của mình. Con mèo đen ngồi trước ngai: phần bản năng, phần bóng tối không bị chối bỏ mà được thuần hóa và ngồi yên đúng chỗ. Rực rỡ mà có gốc.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Hoàng Hậu là làm chủ chất từ bên trong; chất Gậy là lửa của ý chí và đam mê. Ghép lại: ngọn lửa đã thành hơi ấm ổn định — tự tin không cần phô, đủ sáng để soi cả người bên cạnh. Có thể là một người quanh bạn, hoặc phần rực rỡ bạn đang cất bớt.',
    up: 'Hoàng Hậu Gậy là kiểu tự tin làm người khác ấm lên thay vì lép vế: biết mình muốn gì, nói được điều mình nghĩ, và còn dư năng lượng để cổ vũ người bên cạnh. Lá này gợi bạn bước ra ánh sáng của chính mình — nhận vai chính trong đời mình thay vì làm khán giả nhiệt tình của đời người khác. Tự tin kiểu này không đến từ việc không sợ, mà từ việc biết rõ mình đứng vì điều gì; người thấy bạn sống đúng mình lâu ngày sẽ tự thấy được phép sống đúng họ.',
    rev: 'Ngược chiều: pin cạn — vẫn phải tươi cười vận hành mọi thứ trong khi bên trong đã mỏi; hoặc ngọn lửa chuyển thành so sánh, ghen tị ngầm với người đang rực rỡ hơn. Người khác tỏa sáng không làm tối phần của bạn. Khi thấy mình soi đời người khác nhiều hơn chăm đời mình, đó là đồng hồ báo pin: không phải bạn kém đi, chỉ là lâu rồi chưa nạp thứ nuôi lửa riêng.',
    love: 'Trong tình cảm: sự cuốn hút của bạn nằm ở việc sống đúng mình — đừng gọt bớt cá tính cho vừa một khuôn. Người phù hợp yêu bạn ở bản gốc. Người gọt mình cho vừa khuôn sẽ hấp dẫn được người thích cái khuôn, không phải người thương cái gốc; về lâu dài đó là cuộc trao đổi lỗ.',
    work: 'Trong công việc: hợp vai trò cần truyền lửa — dẫn nhóm, thuyết trình, xây văn hóa. Nhớ lịch nạp năng lượng của chính mình trước khi phát cho người khác. Sức truyền lửa nằm ở sự thật hơn ở kỹ thuật trình bày: kể cả chuyện đã thất bại ra sao, đội sẽ tin hơn mười trang trình chiếu đẹp.',
    reflect: [
      'Ở đâu bạn đang sống "bản rút gọn" của chính mình — và vì ai?',
      'Điều gì nạp lại năng lượng cho bạn thật sự — lần cuối bạn làm nó là bao giờ?',
    ],
  },
  {
    slug: 'king-of-wands',
    name: 'King of Wands',
    name_vi: 'Vua Gậy',
    arcana: 'minor',
    suit_vi: 'Gậy',
    number: 14,
    keyUp: ['lãnh đạo bằng tầm nhìn', 'dám quyết', 'truyền hướng đi'],
    keyRev: ['độc đoán', 'kỳ vọng đốt người khác'],
    image:
      'Vị vua ngồi nghiêng người về phía trước như sắp đứng dậy, áo choàng thêu kỳ nhông lửa cắn đuôi thành vòng tròn. Quyền lực ở đây không tĩnh — nó luôn chực hành động.',
    symbols:
      'Vị vua ngồi nghiêng người về phía trước như sắp đứng dậy: quyền lực của bộ Gậy không ngồi yên trên ngai. Áo choàng và lưng ngai phủ hình kỳ nhông lửa cắn đuôi thành vòng tròn — ngọn lửa tự nuôi, ý chí đã thành chu trình chứ không còn là cơn bốc. Cây gậy trong tay vẫn đâm chồi: sau bao năm, lửa của ông vẫn là lửa sống, chưa thành tro của sự cứng nhắc.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Vua là làm chủ chất hướng ra ngoài — dẫn dắt, chịu trách nhiệm; chất Gậy là ý chí và tầm nhìn. Ghép lại: người cầm lửa cho cả nhóm, đặt hướng và truyền hướng. Lá có thể chỉ một người dẫn dắt quanh bạn, hoặc chính vai trò mà đời đang đẩy bạn vào.',
    up: 'Vua Gậy là người cầm lửa đã chín: vẫn nguyên đam mê của tuổi trẻ nhưng thêm khả năng nhìn xa và chịu trách nhiệm. Lá này gợi vai trò dẫn dắt — đặt hướng, truyền lửa, dám quyết những việc người khác né. Lãnh đạo kiểu Vua Gậy không quản từng li; ông vẽ chân trời rõ đến mức người khác tự muốn đi về phía đó. Phép thử của người đặt hướng: nói tầm nhìn trong một câu mà người nghe kể lại được cho người thứ ba. Chưa kể lại được nghĩa là chưa rõ — rõ trước đã, truyền sau.',
    rev: 'Ngược chiều: tầm nhìn thành áp đặt — "hướng của tôi là hướng duy nhất", kỳ vọng cao đến mức đốt cháy người làm cùng, nghe góp ý như nghe xúc phạm. Lửa lớn cần lò tốt; không có lò, nó chỉ là đám cháy. Người lãnh đạo nghe góp ý như nghe xúc phạm sẽ chỉ còn nhận được im lặng; và sự im lặng của một đội là thứ đắt nhất mà không hóa đơn nào ghi.',
    love: 'Trong tình cảm: bạn (hoặc người ấy) là kiểu dẫn dắt, quyết đoán, che chở. Đẹp khi đối phương được hỏi ý; ngột khi mọi quyết định đã được quyết hộ. Che chở khác quyết định hộ: một bên cho người kia chỗ dựa, một bên lấy mất của họ tay lái. Thỉnh thoảng hỏi "em muốn thế nào" trước khi đưa phương án.',
    work: 'Trong công việc: thời điểm nhận vai lớn hơn — dẫn dự án, đại diện tiếng nói chung. Đặt hướng xong, hãy lùi một bước cho người khác chỗ trổ tài: để người khác làm khác cách mình mà vẫn tới đích. Ai qua được cửa đó mới thật sự chuyển từ giỏi việc sang giỏi dẫn.',
    reflect: [
      'Nếu phải phát biểu "chân trời" của nhóm/gia đình mình trong một câu, bạn nói gì?',
      'Kỳ vọng của bạn đang nâng người quanh mình lên, hay đang đè họ xuống?',
    ],
  },

  // ============ CỐC (Cups) — nước: cảm xúc, quan hệ, trực giác ============
  {
    slug: 'ace-of-cups',
    name: 'Ace of Cups',
    name_vi: 'Át Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 1,
    keyUp: ['mở lòng', 'cảm xúc mới', 'lòng trắc ẩn'],
    keyRev: ['đè nén cảm xúc', 'cho mà quên nhận'],
    image:
      'Bàn tay từ mây nâng chiếc chén trào năm dòng nước, chim bồ câu ngậm bánh thánh sà xuống. Trái tim ở trạng thái đầy — và đang tràn ra ngoài.',
    symbols:
      'Bàn tay từ mây nâng chiếc chén trào năm dòng nước: cảm xúc khi đầy thì tự tràn, không cần ép. Chim bồ câu ngậm chiếc bánh tròn sà xuống chén — hình ảnh mang gốc Thánh thể trong tranh RWS, thường được đọc là điều lành đi vào đời sống thường ngày. Mặt nước bên dưới điểm hoa súng: đời sống cảm xúc có hệ sinh thái riêng, được chăm thì tự nở. Chén ở đây được trao; việc của người nhận là mở tay.',
    storyArc:
      'Điểm khởi phát của cốt truyện Cốc: hạt mầm thuần khiết nhất của Nước — một dòng cảm xúc vừa mở, chưa gắn tên ai, chưa thành quan hệ nào. Các lá sau sẽ đưa dòng nước này qua kết nối, tiệc vui, chán chường, mất mát; còn ở đây, chỉ cần đừng đậy nắp sớm.',
    up: 'Át Cốc là khởi đầu của dòng cảm xúc: một tình cảm mới chớm, một tình bạn ấm lên, lòng trắc ẩn bỗng mở với người lạ, hay đơn giản là cảm giác "tim mình mềm lại" sau một thời gian khô. Lá này khuyên đón nhận thay vì phân tích: cảm xúc đến trước, tên gọi tính sau. Chén đầy thì tự tràn — yêu thương thật không cần gồng để phát. Giai đoạn tim mềm lại này đáng được bảo vệ: bớt lịch với người làm mình phải diễn, thêm giờ cho người và việc khiến mình thật. Cảm xúc mới như nước đầu nguồn, trong hay đục là do đoạn chảy đầu tiên.',
    rev: 'Ngược chiều: dòng nước bị chặn — có điều muốn bày tỏ mà nuốt vào, hoặc cho đi nhiều đến mức quên mất chén của mình cũng cần được rót. Cảm xúc bị đè lâu không biến mất; nó chỉ đổi cửa ra, thường là cửa xấu hơn. Kiểm tra nhanh cho cả hai kiểu nghẽn: tuần qua bạn nói thật cảm xúc của mình được mấy lần — và có ai hỏi thăm bạn không?',
    love: 'Trong tình cảm: thời điểm đẹp để bày tỏ, làm lành, hoặc mở lòng lại sau tổn thương. Một lời thật lòng lúc này nặng ký hơn mọi chiến thuật. Mở lòng lại không cần một cú nhảy; một tin nhắn thật, một buổi cà phê không kỳ vọng cũng đã là mở.',
    work: 'Trong công việc: để lòng tốt có chỗ — giúp một đồng nghiệp, nói một lời tử tế. Môi trường làm việc đổi chất từ những việc nhỏ thế này. Người khơi được dòng đó thường thành chỗ tin của cả nhóm lúc khó — một vị trí không chức danh nào ghi nhưng ai cũng biết.',
    reflect: [
      'Điều gì bạn đang muốn bày tỏ mà cứ nuốt lại — và sợ gì nếu nói ra?',
      'Chén của bạn dạo này được rót bằng gì — và ai rót?',
    ],
  },
  {
    slug: 'two-of-cups',
    name: 'Two of Cups',
    name_vi: 'Hai Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 2,
    keyUp: ['kết nối hai chiều', 'tâm đầu ý hợp', 'đồng minh'],
    keyRev: ['lệch nhịp', 'rạn nhỏ chưa nói'],
    image:
      'Hai người nâng chén trao nhau dưới biểu tượng trượng thần Hermes và đầu sư tử có cánh — một nghi thức của sự bình đẳng và tin cậy.',
    symbols:
      'Hai người nâng chén trao nhau, mắt ngang tầm mắt: nghi thức của sự bình đẳng. Giữa họ là cây trượng hai rắn quấn có cánh — biểu tượng trao đổi và y thuật từ thời cổ, ở đây đọc là sự chữa lành đến từ kết nối thật. Trên cùng là đầu sư tử có cánh: đam mê được nâng đỡ bởi tinh thần, không chỉ bản năng. Mọi chi tiết trong tranh đều có đôi và cân.',
    storyArc:
      'Bước hai của cốt truyện Cốc: quan hệ hai chiều. Dòng cảm xúc mở ra ở Át giờ tìm được một người đối diện — số 2 ở mọi chất nói về cân bằng đôi và lựa chọn; ở bộ Cốc, nó thành lời cam kết nhỏ đầu tiên giữa hai phía. Từ đây, vòng tròn sẽ rộng dần ở Ba Cốc.',
    up: 'Hai Cốc là kết nối hai chiều ở dạng đẹp nhất: hai người nhìn nhau ngang tầm mắt — một mối tình cân xứng, một tình bạn tri kỷ, một cộng sự hiểu ý. Lá này nhấn vào chữ "hai chiều": cho và nhận, nói và nghe, nâng và được nâng. Những liên minh như vậy không tự nhiên có; chúng được xây từ nhiều lần trao chén nhỏ. Dấu hiệu của kết nối cân: sau mỗi lần gặp, cả hai đều đầy hơn chứ không ai cạn đi. Những mối như vậy đáng được đặt lịch tử tế như đặt lịch làm việc.',
    rev: 'Ngược chiều: nhịp đôi bên đang lệch — một người nghiêng nhiều hơn, một vết rạn nhỏ chưa ai gọi tên. Rạn nhỏ xử lý sớm là chuyện năm phút; để lâu thành chuyện năm tháng. Vết rạn thường có tên rất cụ thể: một lời hứa quên, một lần cần mà vắng, một câu đùa trúng chỗ đau. Gọi tên sớm với nhau thì ngắn; để mỗi người tự diễn giải thì dài.',
    love: 'Trong tình cảm: giai đoạn tâm đầu ý hợp, hoặc cơ hội hàn gắn thật sự nếu cả hai cùng bước một bước. Hãy là người chìa chén trước. Hàn gắn luôn cần một người bước trước; bước trước không phải thua, là trưởng thành hơn nửa nhịp.',
    work: 'Trong công việc: hợp tác một-một rất thuận — tìm một đồng minh, một người cố vấn, một cộng sự bù kỹ năng. Quan hệ chất lượng hơn quan hệ số lượng. Một cộng sự cùng giá trị và bù kỹ năng đáng giá hơn năm mối xã giao; đầu tư vào một hai người như vậy là khoản sinh lãi bền nhất của sự nghiệp.',
    reflect: [
      'Mối quan hệ nào của bạn đang thật sự hai chiều — và bạn có nói cho họ biết bạn quý điều đó?',
      'Vết lệch nhỏ nào bạn đang thấy mà chưa gọi tên?',
    ],
  },
  {
    slug: 'three-of-cups',
    name: 'Three of Cups',
    name_vi: 'Ba Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 3,
    keyUp: ['tình bạn', 'ăn mừng cùng nhau', 'cộng đồng nâng đỡ'],
    keyRev: ['ngợp tiệc tùng', 'xã giao rỗng', 'cảm giác bị ra rìa'],
    image:
      'Ba người phụ nữ nâng chén thành vòng tròn giữa vườn trái chín — niềm vui ở dạng tập thể, không ai là trung tâm, ai cũng là một phần.',
    symbols:
      'Ba người phụ nữ nâng chén thành vòng tròn, xoay mặt vào nhau: niềm vui khép thành vòng, không có khán giả, chỉ có người trong cuộc. Dưới chân là hoa trái mùa gặt: tiệc ở đây mừng thành quả có thật, không phải tiệc để khoe. Không ai đứng cao hơn ai trong tranh — tình bạn ở dạng đẹp nhất là vòng tròn, không phải bậc thang.',
    storyArc:
      'Bước ba của cốt truyện Cốc: thành hình và mở rộng. Kết nối đôi ở Hai Cốc giờ nở thành vòng tròn bạn bè — số 3 ở mọi chất là lúc năng lượng lan ra thành hợp tác, chia sẻ. Sau tiệc vui này, Bốn Cốc sẽ đặt câu hỏi ngược: khi đủ đầy rồi mà lòng vẫn chán thì sao.',
    up: 'Ba Cốc là niềm vui được chia: bạn bè tụ lại, hội nhóm ăn mừng, những người "cùng phe đời" có mặt đúng lúc. Lá này nhắc một sự thật giản dị: niềm vui nhân lên khi chia, nỗi buồn nhẹ đi khi kể. Nếu lâu rồi chưa gặp đám bạn thân — đó không phải chuyện nhỏ, đó là một khoản đầu tư đang bị bỏ quên. Vòng tròn nào cũng cần một người chịu làm đầu mối rủ rê; nếu nhóm của bạn lâu rồi không gặp, khả năng cao ai cũng đang chờ người khác nhắn trước. Làm người nhắn trước đi.',
    rev: 'Ngược chiều: lịch xã giao dày mà rỗng — đông người, ít thân; hoặc cảm giác đứng ngoài vòng tròn, nhìn cuộc vui qua màn hình người khác. Chất của vài tình bạn sâu đáng giá hơn lượng của trăm cái gật đầu. Cảm giác bị ra rìa đôi khi đến từ việc so đời thật của mình với ảnh chụp của người khác; ảnh chụp không có phần mệt, phần cãi nhau, phần hóa đơn.',
    love: 'Trong tình cảm: đưa nhau vào vòng bạn bè của mình là một cột mốc thật. Mặt trầm: để ý khi "cuộc vui chung" thành nơi trốn những cuộc trò chuyện riêng. Cách một người cư xử trong vòng bạn bè của họ cũng nói nhiều điều mà buổi hẹn hai người không lộ: cách họ được quý, cách họ đối xử với người không cần lấy lòng.',
    work: 'Trong công việc: thành quả của nhóm — ăn mừng kiểu nhóm. Văn hóa đồng đội xây từ những dịp vui có chủ đích. Tin vui chung nên được mừng bằng tên từng người có phần, không phải một câu khen cả đội chung chung; niềm vui có địa chỉ mới nuôi được lần sau.',
    reflect: [
      'Ba người nào bạn muốn có mặt trong vòng tròn của mình mười năm nữa — họ có biết không?',
      'Lịch gặp gỡ của bạn dạo này: nhiều cuộc đông người hay đủ cuộc thân tình?',
    ],
  },
  {
    slug: 'four-of-cups',
    name: 'Four of Cups',
    name_vi: 'Bốn Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 4,
    keyUp: ['chán chường', 'thờ ơ', 'không thấy cơ hội trước mặt'],
    keyRev: ['tỉnh ra', 'nhận lời mời', 'biết ơn trở lại'],
    image:
      'Chàng trai khoanh tay ngồi dưới gốc cây, nhìn ba chiếc chén trước mặt đầy chán nản — không thấy chiếc chén thứ tư đang được mây chìa ra ngay bên cạnh.',
    symbols:
      'Chàng trai khoanh tay ngồi dưới gốc cây, mắt nhìn xuống ba chiếc chén trước mặt: tư thế đóng, từ vòng tay đến ánh nhìn. Bàn tay từ mây chìa chén thứ tư ngay tầm với — cùng mô-típ bàn tay của các lá Át: một khởi đầu mới đang được trao, nhưng người nhận không quay sang. Gốc cây và thế ngồi vững: đây không phải khủng hoảng, chỉ là no đủ đến mức tê. Vấn đề của tranh không nằm ở thiếu chén, mà ở hướng nhìn.',
    storyArc:
      'Bước bốn của cốt truyện Cốc: ổn định hóa thành trì trệ. Số 4 ở mọi chất là dừng lại giữ vững; ở bộ Cốc, sự đứng yên của cảm xúc sinh ra chán chường — sau tiệc vui Ba Cốc, lòng bão hòa. Cú lắc để tỉnh sẽ đến ở Năm Cốc, dưới dạng không ai muốn: mất mát.',
    up: 'Bốn Cốc là cơn chán giữa no đủ: mọi thứ ổn mà không thấy vui, lời mời đến mà không buồn nhận, cơ hội trước mặt mà mắt nhìn xuyên qua. Lá này không mắng bạn vô ơn — nó chỉ ra rằng sự bão hòa cảm xúc là có thật, và đôi khi cái cần không phải thứ mới, mà là con mắt mới nhìn thứ đang có. Thử một tuần "con mắt mới": đổi đường đi làm, ăn quán chưa từng vào, hỏi người quen một câu chưa từng hỏi. Cơn chán nhiều khi không cần đời mới, chỉ cần góc nhìn lệch đi vài độ.',
    rev: 'Ngược chiều là cú tỉnh: nhận ra chén thứ tư, nói "có" với một lời mời suýt bỏ qua, thấy lại vị của những thứ quen. Giai đoạn chán thường là buồng chờ của một giai đoạn khác — miễn là đừng xây nhà luôn trong buồng chờ. Chén thứ tư hay đến dưới dạng không ngờ: lời rủ của người ít nói chuyện, một việc nhỏ ngoài chuyên môn. Cái giá của một buổi thử thấp hơn nhiều cái giá của một năm chán.',
    love: 'Trong tình cảm: sự nguội không phải lúc nào cũng do hết yêu — nhiều khi do hết để ý. Thử nhìn người bên cạnh như lần đầu gặp: họ có gì mà ngày xưa bạn đã chọn? Một câu hỏi phục hồi sự chú ý: tuần này người ấy đã làm điều gì mà nếu người lạ làm, bạn sẽ khen? Sự quen làm ta quên khen những thứ vẫn đáng khen.',
    work: 'Trong công việc: chán việc chưa chắc cần đổi việc — thử đổi cách làm, nhận một mảng mới, dạy lại người mới. Nếu đã thử mà vẫn trơ, đó mới là dữ kiện. Dạy nghề cho người vào sau là cách nhanh nhất thấy lại vị nghề: phải gọi tên được thứ mình làm giỏi, và thấy nó qua con mắt người đang háo hức.',
    reflect: [
      '"Chén thứ tư" nào có thể đang được chìa ra mà bạn chưa buồn quay sang nhìn?',
      'Cơn chán này muốn nói gì: cần nghỉ, cần mới, hay cần nhìn lại cách bạn đang sống ngày thường?',
    ],
  },
  {
    slug: 'five-of-cups',
    name: 'Five of Cups',
    name_vi: 'Năm Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 5,
    keyUp: ['tiếc nuối', 'mất mát', 'nhìn mãi phần đổ'],
    keyRev: ['quay lại nhìn phần còn', 'chấp nhận', 'bước tiếp'],
    image:
      'Người khoác áo choàng đen đứng cúi đầu trước ba chiếc chén đổ — sau lưng vẫn còn hai chén đứng nguyên, và một cây cầu dẫn về phía ngôi nhà bên kia sông.',
    symbols:
      'Người khoác áo choàng đen đứng cúi đầu trước ba chén đổ: màu áo và tư thế là tang phục của một mất mát có thật. Hai chén sau lưng còn nguyên — chi tiết định nghĩa cả lá bài: phần còn lại luôn tồn tại, chỉ nằm ngoài hướng nhìn. Cây cầu bắc qua sông dẫn về ngôi nhà: lối về không biến mất, nó chờ. Dòng sông giữa tranh: nước mắt có chỗ của nó, và cũng có bờ.',
    storyArc:
      'Bước năm của cốt truyện Cốc: thử thách giữa chặng, ở bộ Nước mang dạng mất mát. Cơn chán của Bốn Cốc bị thay bằng nỗi buồn thật — số 5 nào cũng là cú xáo trộn. Nhưng cốt truyện không dừng ở đây: Sáu Cốc kế tiếp là hồi phục, múc lại nước ấm từ ký ức.',
    up: 'Năm Cốc là nỗi buồn của mất mát: một chuyện không thành, một người rời đi, một cơ hội đổ. Lá này không bảo "vui lên" — nó cho phép bạn đứng đó buồn cho trọn, vì phần đổ là thật và xứng đáng được tiếc. Nhưng nó cũng đặt sẵn chi tiết: hai chén sau lưng còn nguyên, và có một cây cầu. Khi nào sẵn sàng — chỉ cần quay người. Buồn cho trọn cũng có kỹ thuật: đặt cho nỗi buồn một cái khung — viết ra, kể với một người, khóc một trận — thay vì để nó loang cả ngày dưới dạng tê liệt. Nỗi buồn có khung thì đi qua; nỗi buồn loang thì ở lại.',
    rev: 'Ngược chiều: cú quay người ấy đang diễn ra — bạn bắt đầu thấy thứ còn lại, kể về chuyện cũ mà giọng đã nhẹ. Tha thứ (cho người, và cho mình) không phải là nói chuyện cũ đúng; nó là thôi để chuyện cũ đặt lịch cho ngày mới. Một dấu hiệu hồi phục thật: kể lại chuyện cũ mà bắt đầu nhớ ra được vài chi tiết tốt, không chỉ toàn phần đổ. Trí nhớ công bằng trở lại là da non của tâm lý.',
    love: 'Trong tình cảm: sau đổ vỡ, đừng vội kết luận về cả phần đời còn lại. Người cũ lấy đi ba chén — không lấy được hai chén và cây cầu. Ba chén đổ dạy bài học về người này; đừng để nó thành bản án cho mọi người sau. Người mới xứng đáng gặp phiên bản đã lành của bạn.',
    work: 'Trong công việc: dự án thất bại — khóc xong thì làm "lễ rút kinh nghiệm" cho tử tế: cái gì đổ vì mình, cái gì đổ vì trời, lần sau khác chỗ nào. Tách được ba cột đó — quyết định của mình, hoàn cảnh, may rủi — là lấy lại được quyền chủ động cho lần sau.',
    reflect: [
      'Bạn đã cho mình buồn đủ chưa — hay đang dùng bận rộn để khỏi buồn?',
      '"Hai chiếc chén còn đứng" của bạn lúc này là gì?',
    ],
    ease:
      'Lá này hay bị đọc thành "điềm mất mát sắp tới" — không phải. Nó mô tả một trạng thái tiếc nuối đang có, và nhắc rằng còn thứ chưa đổ. Không ai cần cúng gì để "giải" một nỗi buồn; nỗi buồn cần được sống cho trọn rồi đi qua.',
  },
  {
    slug: 'six-of-cups',
    name: 'Six of Cups',
    name_vi: 'Sáu Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 6,
    keyUp: ['ký ức ấm', 'hoài niệm', 'người cũ – chốn cũ', 'lòng tốt vô tư'],
    keyRev: ['kẹt trong quá khứ', 'lý tưởng hóa ngày xưa'],
    image:
      'Trong sân làng cũ, đứa trẻ lớn trao chén đầy hoa trắng cho đứa trẻ nhỏ hơn. Sáu chén đầy hoa — quà của ký ức, cho đi không tính toán.',
    symbols:
      'Sân một khu nhà cũ, đứa trẻ lớn cúi trao chén đầy hoa trắng cho đứa nhỏ: cử chỉ cho không tính toán — thứ người lớn ít còn giữ được. Sáu chén đều đầy hoa: ký ức khi được nhớ lại thường đầy hơn thực tế từng có, tranh không giấu điều đó. Khung cảnh tường đá, tháp canh cũ: quá khứ là nơi kiên cố, an toàn — và cũng vì thế mà dễ ở lại quá lâu.',
    storyArc:
      'Bước sáu của cốt truyện Cốc: hồi phục và hài hòa lại. Sau mất mát của Năm Cốc, dòng nước tìm về giếng cũ — ký ức, người xưa, chốn cũ — để lấy lại vị ngọt. Số 6 là cho-nhận và chữa lành; nghỉ đủ ở đây rồi, Bảy Cốc sẽ thử lòng bằng những giấc mơ mới.',
    up: 'Sáu Cốc là mùi của tuổi thơ: người bạn cũ nhắn tin, về thăm chốn cũ, lật lại album, hay một cử chỉ tốt vô tư làm bạn nhớ rằng mình từng hồn nhiên thế nào. Lá này gợi giá trị của gốc rễ: thỉnh thoảng múc nước từ giếng cũ — gọi cho người xưa, cảm ơn người từng giúp — không phải để quay lại sống ở đó, mà để nhớ mình lớn lên từ đâu. Một việc nhỏ đáng làm ngay: gửi lời cảm ơn muộn cho một người từng giúp mình mà chưa từng được nghe điều đó. Món quà này rẻ với người gửi và lớn với người nhận hơn bạn tưởng nhiều.',
    rev: 'Ngược chiều: hoài niệm thành nơi trốn — "ngày xưa" được tô đẹp tới mức hiện tại không cách gì cạnh tranh nổi. Ký ức là chỗ để thăm, không phải chỗ để ở. Phép thử xem hoài niệm có thành xích không: "ngày xưa" xuất hiện trong câu chuyện của bạn bao nhiêu lần một tuần — và có lần nào kèm một việc đang làm hôm nay không?',
    love: 'Trong tình cảm: người cũ xuất hiện lại, hoặc hai người ôn kỷ niệm và thấy ấm. Hỏi thật: thứ đang nhớ là con người đó hôm nay — hay phiên bản của họ trong ký ức? Nối lại chỉ đáng khi cả hai đã khác đi ở đúng chỗ từng làm nhau đau; nhớ cái ấm mà quên cái vì-sao-kết-thúc là đọc lại chương cũ, không phải viết chương mới.',
    work: 'Trong công việc: kỹ năng hay mối quan hệ từ thời xưa có thể đang dùng lại được. Gửi một lời hỏi thăm tử tế đến người từng dìu mình — không cần lý do. Danh bạ cũ là mỏ bị bỏ quên: đồng nghiệp cũ, thầy cũ, khách cũ đều là người đã biết chất lượng của bạn.',
    reflect: [
      'Ký ức nào nuôi bạn — và ký ức nào đang giữ chân bạn?',
      'Ai trong quá khứ xứng đáng một lời cảm ơn mà bạn chưa từng gửi?',
    ],
  },
  {
    slug: 'seven-of-cups',
    name: 'Seven of Cups',
    name_vi: 'Bảy Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 7,
    keyUp: ['nhiều lựa chọn', 'mơ mộng', 'ảo ảnh hấp dẫn'],
    keyRev: ['tỉnh mộng', 'chọn một và làm'],
    image:
      'Bóng người đứng trước bảy chiếc chén lơ lửng trên mây, mỗi chén một báu vật: lâu đài, vòng nguyệt quế, rắn, châu báu… — thứ nào cũng lấp lánh, và tất cả đều đang ở trên mây.',
    symbols:
      'Bóng người tối sẫm đứng quay lưng, trước mặt là bảy chén lơ lửng trên mây: người nhìn thì tối, thứ được nhìn thì lấp lánh — tranh nói hộ trạng thái bị viễn cảnh hút mất mình. Trong các chén: lâu đài, châu báu, vòng nguyệt quế, gương mặt người, rắn, và một bóng người phủ vải tỏa sáng — mỗi chén một kiểu ham muốn, lẫn cả thứ đáng ngại được bọc đẹp. Tất cả cùng đứng trên mây: chưa cái nào có chân dưới đất.',
    storyArc:
      'Bước bảy của cốt truyện Cốc: chọn lựa khó. Số 7 ở mọi chất là chặng đánh giá và đối mặt; ở bộ Nước, đó là cuộc đối mặt với chính ham muốn của mình — bảy viễn cảnh, chỉ được cam kết một. Chọn xong, Tám Cốc sẽ đo tiếp: dám rời cái đủ để theo cái đúng không.',
    up: 'Bảy Cốc là cơn say lựa chọn: nhiều hướng đi, nhiều viễn cảnh, nhiều "giá như" — và chính sự nhiều ấy gây tê liệt. Lá này không chê giấc mơ; nó chỉ nhắc rằng mơ là nguyên liệu, không phải món ăn. Bảy giấc mơ trên mây không bằng một giấc mơ được kéo xuống đất kèm bước đi đầu tiên. Cách kéo mơ xuống đất: với mỗi viễn cảnh, viết một dòng "ngày thường của nó trông thế nào" — mở quán không phải là đứng quầy cười với khách, mà là dậy lúc năm giờ và đếm hàng tồn. Viễn cảnh nào sống được qua bản mô tả ngày thường mới đáng theo.',
    rev: 'Ngược chiều là sự tỉnh: bạn bắt đầu phân biệt được lấp lánh và giá trị, gạch bớt lựa chọn, chọn một thứ để cam kết. Cảm giác "đóng bớt cửa" hơi tiếc — nhưng mọi cánh cửa đều chỉ mở cho người đã bước hẳn vào một hành lang. Đóng cửa cũng có kỹ thuật: không cần tuyên bố từ bỏ mãi mãi, chỉ cần hoãn có thời hạn — "cái này để năm sau xét lại". Não chịu buông dễ hơn nhiều khi biết cửa chỉ khép, không khóa.',
    love: 'Trong tình cảm: phân vân giữa nhiều đối tượng, hoặc yêu một hình mẫu tưởng tượng hơn là con người thật trước mặt. Người thật có khuyết điểm; hình mẫu thì không bao giờ ôm được. Câu hỏi công bằng hơn cho người thật: người này, nguyên bản thế này, có làm đời mình tốt lên qua từng quý không?',
    work: 'Trong công việc: nhiều ý tưởng, nhiều "cơ hội lớn" — đặt cho mỗi thứ một phép thử rẻ trong hai tuần, dữ kiện sẽ chọn thay cảm giác. Mỗi phép thử cần một tiêu chí đo cụ thể viết trước; ý tưởng nào cũng lấp lánh cho tới khi gặp bảng tính.',
    reflect: [
      'Trong các viễn cảnh đang ôm, cái nào bạn sẵn lòng trả giá để theo — không chỉ thích khi nghĩ tới?',
      'Bước đầu tiên rẻ nhất để kéo giấc mơ số một xuống đất là gì?',
    ],
  },
  {
    slug: 'eight-of-cups',
    name: 'Eight of Cups',
    name_vi: 'Tám Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 8,
    keyUp: ['rời bỏ thứ đủ-mà-thiếu', 'đi tìm ý nghĩa', 'can đảm buông'],
    keyRev: ['sợ rời đi', 'đi mà chưa rõ vì sao'],
    image:
      'Dưới ánh trăng, một người chống gậy quay lưng bỏ lại tám chiếc chén xếp ngay ngắn, men theo lạch nước đi về phía núi. Tám chén không đổ — chỉ là không còn đủ.',
    symbols:
      'Tám chén xếp ngay ngắn ở tiền cảnh, hàng trên hụt một chỗ — khe trống của chén thứ chín không tồn tại: điều còn thiếu không nằm trong những gì đã xếp được. Người chống gậy quay lưng đi về phía núi dưới ánh trăng: cuộc rời đi diễn ra trong đêm, lặng lẽ, không tuyên bố. Vầng trăng được vẽ kèm gương mặt nghiêng nhìn xuống: thời khắc của trực giác — có những quyết định chỉ nghe rõ khi xung quanh im.',
    storyArc:
      'Bước tám của cốt truyện Cốc: rời đi. Số 8 mỗi chất một sắc — ở bộ Nước là cuộc chia tay có ý thức với cái đủ-mà-thiếu, sau khi Bảy Cốc đã lọc xong ảo ảnh. Đi qua được chặng này, Chín Cốc chờ ở phía kia với đúng thứ đang tìm: sự toại nguyện thật.',
    up: 'Tám Cốc là cuộc rời đi khó giải thích nhất: thứ bỏ lại không tệ — công việc ổn, mối quan hệ êm, cuộc sống đáng mơ với người ngoài — nhưng bên trong bạn biết nó thiếu một chén. Lá này công nhận thứ can đảm ít được vỗ tay: dám rời cái đủ để đi tìm cái đúng. Không phải mọi cuộc ra đi đều là chạy trốn; có những cuộc ra đi là trưởng thành. Cuộc rời đi kiểu Tám Cốc có đặc điểm nhận dạng: không giận ai, không đổ lỗi, chỉ là một buổi nhìn lại và thấy mình đã lớn hơn chỗ đang đứng. Kiểu chia tay ít kịch tính nhất — và cần nhiều can đảm nhất.',
    rev: 'Ngược chiều: hoặc bạn biết phải đi mà chân chưa nhấc nổi (tiếc công xếp tám chén), hoặc đã đi mà thật ra chưa trả lời được "đi tìm gì" — và nguy cơ là tới nơi mới lại xếp đúng tám chén cũ. Trước khi đi, một bài kiểm tra trung thực: điều đang thiếu là thiếu ở nơi này, hay thiếu ở chính mình và sẽ đi theo sang nơi mới? Trả lời sai câu này, người ta chuyển chỗ cả đời mà không đổi được gì.',
    love: 'Trong tình cảm: cảm giác "đủ mà thiếu" trong một mối quan hệ đáng được nói ra trước khi đáng được rời đi. Có khi chén thứ chín nằm ngay trong cuộc trò chuyện chưa từng có. Nhiều mối quan hệ kết thúc không phải vì thiếu chén thứ chín, mà vì không ai dám nói mình đang đi tìm nó.',
    work: 'Trong công việc: rời vị trí tốt để theo điều có ý nghĩa hơn — hợp lệ, miễn đã thử sửa tại chỗ và đã định nghĩa được "ý nghĩa hơn" là gì. Cần thêm một con số: số tháng sống được không lương. Có định nghĩa và có con số, cuộc rời đi là trưởng thành; thiếu cả hai, nó dễ chỉ là chạy.',
    reflect: [
      'Thứ gì trong đời bạn đang "đủ mà thiếu" — thiếu chính xác cái gì?',
      'Nếu rời đi, bạn đi TÌM gì — nói được thành một câu không?',
    ],
  },
  {
    slug: 'nine-of-cups',
    name: 'Nine of Cups',
    name_vi: 'Chín Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 9,
    keyUp: ['mãn nguyện', 'điều ước thành', 'biết đủ'],
    keyRev: ['thỏa mãn bề mặt', 'khoe để lấp', 'rỗng bên trong'],
    image:
      'Người đàn ông ngồi khoanh tay mỉm cười, sau lưng là kệ cong xếp chín chiếc chén như huy chương. Truyền thống gọi đây là "lá điều ước" — cảm giác được toại nguyện.',
    symbols:
      'Người đàn ông ngồi giữa tranh, tay khoanh, nét mặt thỏa: tư thế của người đã xong việc và biết mình xong việc. Chín chén xếp vòng cung trên kệ phủ vải xanh phía sau — thành quả bày như huy chương, nhưng đáng để ý: chúng ở sau lưng, người ngồi không cần ngoái ngắm nữa. Truyền thống gọi đây là lá điều ước; bức tranh thì nhắc thêm một ý: toại nguyện là dám ngồi xuống với cái mình có.',
    storyArc:
      'Bước chín của cốt truyện Cốc: gần trọn — đỉnh cảm xúc của bộ Nước ở phía toại nguyện. Cuộc đi tìm của Tám Cốc đã tới nơi: điều ước thành hình. Số 9 là đỉnh của phần cá nhân; còn một bước nữa, Mười Cốc, khi niềm vui riêng hòa được vào những người mình thương.',
    up: 'Chín Cốc là khoảnh khắc "được": điều mong mỏi thành hình, và bạn được phép ngồi xuống tận hưởng nó không áy náy. Lá này dạy một kỹ năng bị xem nhẹ: biết nhận mình đang ổn. Nhiều người leo cả đời mà không một lần đứng lại ở đỉnh nào để thở — đỉnh nào cũng chỉ là trạm tiếp nhiên liệu cho đỉnh sau. Hôm nay, cho phép mình toại nguyện. Toại nguyện cũng cần nghi thức: nói to điều mình biết ơn, đãi mình một bữa, kể với người đã góp phần. Không đánh dấu, não sẽ trượt luôn sang mục tiêu kế tiếp và cái "được" này coi như chưa từng xảy ra.',
    rev: 'Ngược chiều: nụ cười cho khán giả — thành tựu để đăng, để kể, nhưng đêm về thấy rỗng. Hỏi thẳng: điều ước đã thành kia là ước của bạn, hay ước bạn mượn từ kỳ vọng người khác? Phép thử điều-ước-đi-mượn: nếu không được kể cho ai, thành tựu này còn lại bao nhiêu phần vui? Phần còn lại là của bạn thật; phần bốc hơi là phần vay của ánh nhìn người khác.',
    love: 'Trong tình cảm: hài lòng thật với những gì đang có — và nói cho người kia biết. Mặt trầm: vẻ "ổn cả" trưng ra ngoài đôi khi là lý do không ai hỏi bạn câu hỏi sâu. Câu "em đang hạnh phúc" là câu ít được nói nhất trong các cặp lâu năm; người kia không đọc được lòng bạn, và sự im lặng dễ bị hiểu thành điều ngược lại.',
    work: 'Trong công việc: mục tiêu đạt — chốt sổ, thưởng cho mình, rồi mới đặt mục tiêu mới. Đặt mục tiêu mới NGAY khi vừa đạt là cách chắc nhất để không bao giờ thấy đủ. Chốt sổ gồm cả việc ghi lại cách đã làm được; công thức thành công không ghi lại là tài sản để quên ngoài mưa.',
    reflect: [
      'Điều gì bạn từng ước có — và hiện đang có mà quên mất mình từng ước?',
      'Nếu không ai biết đến thành tựu này, nó còn làm bạn vui không?',
    ],
  },
  {
    slug: 'ten-of-cups',
    name: 'Ten of Cups',
    name_vi: 'Mười Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 10,
    keyUp: ['viên mãn quan hệ', 'gia đình thuận', 'hạnh phúc bền'],
    keyRev: ['hình ảnh hoàn hảo che vết rạn', 'kỳ vọng cổ tích'],
    image:
      'Đôi vợ chồng dang tay dưới cầu vồng mười chén, hai đứa trẻ nhảy múa bên cạnh, xa xa là mái nhà bên dòng sông. Bức tranh "về đích" của bộ Cốc.',
    symbols:
      'Cầu vồng vắt ngang trời với mười chén xếp dọc theo: phúc lành hiện rõ thành hình, không còn phải tin suông. Đôi vợ chồng đứng sát nhau cùng dang tay về phía đó, hai đứa trẻ nắm tay nhảy múa bên cạnh: hai thế hệ, hai kiểu tận hưởng cùng một mái ấm. Ngôi nhà nhỏ bên dòng sông và rặng cây: đủ, không dư. Mọi thứ trong bức "về đích" của bộ Cốc đều là thứ tiền không mua thẳng được.',
    storyArc:
      'Bước mười, chặng cuối cốt truyện Cốc: trọn vẹn. Dòng cảm xúc khởi từ Át, qua kết nối, mất mát, ra đi và toại nguyện, giờ thành mái ấm — niềm vui bền của số 10 khác niềm vui riêng của số 9 ở chỗ có người để chia. Vòng khép; chu kỳ cảm xúc mới lại bắt đầu từ một Át khác.',
    up: 'Mười Cốc là viên mãn của tình thân: gia đình thuận, các mối quan hệ cốt lõi lành mạnh, cảm giác "mình có nơi để thuộc về". Lá này nhắc rằng hạnh phúc kiểu này trông như quà nhưng thật ra là công trình: nó được xây bằng nhiều năm lắng nghe, nhường nhịn, sửa chữa. Nếu bạn đang có nó — đó không phải may mắn suông, hãy tiếp tục bảo trì. Bảo trì gồm những việc rất thường: bữa cơm đủ mặt không điện thoại, cãi nhau có luật, xin lỗi không để qua đêm. Nghe nhỏ, nhưng mười chén được giữ bằng đúng những việc nhỏ đó.',
    rev: 'Ngược chiều: bức tranh đẹp dùng để che — nhà ngoài ấm trong lạnh, ảnh gia đình rạng rỡ đăng từ một bàn ăn im lặng. Hoặc kỳ vọng "cổ tích" cao đến mức hạnh phúc thật (vốn có cãi vã, có mệt) bị chấm rớt. Hạnh phúc thật không hoàn hảo; nó chỉ cần thật. Một cách phân biệt: hạnh phúc thật chịu được người ngoài nhìn vào lúc chưa dọn nhà; hình ảnh hạnh phúc thì cần dàn dựng trước.',
    love: 'Trong tình cảm: tầm nhìn về mái ấm chung — đáng nói với nhau một cách cụ thể: "gia đình hạnh phúc" với mỗi người trông khác nhau thế nào. Hai bức tranh khớp được bảy phần là đủ xây — nhưng phải nhìn thấy tranh của nhau trước đã.',
    work: 'Trong công việc: cân bằng được việc và nhà lúc này quý hơn thăng tiến. Một quyết định nghề nghiệp tốt là quyết định mà 5 người ở "mười chén" của bạn không phải trả giá. Thước đo đáng dùng cho mọi lời mời hấp dẫn: nó lấy đi bao nhiêu bữa tối trong tuần? Có những mức lương thực chất là giá bán của mười chiếc chén.',
    reflect: [
      '"Mười chén" của bạn gồm những ai — lịch của bạn tuần này có phản ánh điều đó?',
      'Ở nhà bạn, điều gì đang được giữ cho "trông ổn" thay vì được sửa cho ổn thật?',
    ],
  },
  {
    slug: 'page-of-cups',
    name: 'Page of Cups',
    name_vi: 'Thị Đồng Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 11,
    keyUp: ['tín hiệu cảm xúc mới', 'trực giác chớm nở', 'sáng tạo hồn nhiên'],
    keyRev: ['dễ tổn thương', 'mơ mộng quá đà'],
    image:
      'Thị đồng áo hoa đứng bên bờ biển, nâng chén — và một chú cá nhỏ ngó ra khỏi chén nhìn lại. Điều bất ngờ dễ thương từ thế giới cảm xúc.',
    symbols:
      'Thị đồng áo hoa đứng bên bờ biển, dáng thoải mái gần như diễn kịch: người trẻ của bộ Nước không gồng nghiêm. Con cá nhỏ ngó ra từ chén nhìn lại chủ nhân — một trong những hình ảnh lạ nhất bộ Ẩn phụ: cảm xúc và trực giác trồi lên kiểu bất ngờ, hơi buồn cười, và chỉ hiện với người chịu nhìn vào chén của mình. Biển sau lưng gợn sóng nhẹ: nội tâm động, nhưng chưa bão.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Thị Đồng là người học việc, lần đầu chạm vào chất; chất Cốc là cảm xúc và trực giác. Ghép lại: người mới của thế giới nội tâm — dễ rung động, giàu tưởng tượng, chưa phân biệt thạo tín hiệu với tiếng ồn. Có thể là một người trẻ nhạy cảm quanh bạn, hoặc phần hồn nhiên bạn đang bỏ đói.',
    up: 'Thị Đồng Cốc là tin nhắn từ trái tim: một rung động không hẹn, một ý tưởng sáng tạo ngộ nghĩnh, một giấc mơ kỳ lạ đáng ghi lại, một lời mời mang màu cảm xúc. Lá này gợi thái độ hồn nhiên với đời sống bên trong: đừng vội phán xét cảm xúc "vớ vẩn" — con cá trong chén chỉ ngoi lên với người chịu nhìn vào chén. Tập một thói quen nhỏ: ghi lại những rung động lạ trong ngày. Đọc lại sau một tháng, bạn sẽ thấy trực giác của mình có khẩu vị riêng — và thường đúng ở những vùng nào.',
    rev: 'Ngược chiều: nhạy cảm thành dễ vỡ — một lời nói nhẹ cũng thành sóng lớn; hoặc mơ mộng thành thoát ly, sống trong kịch bản tưởng tượng nhiều hơn đời thật. Cảm xúc là tín hiệu, không phải mệnh lệnh. Cách phân biệt tín hiệu với kịch bản tự viết: tín hiệu thường ngắn và cụ thể; kịch bản thì dài, nhiều tập, và mình luôn là nhân vật chính bị đối xử tệ. Thấy mình đang viết tập ba, dừng lại hỏi dữ kiện.',
    love: 'Trong tình cảm: một tín hiệu mới — tin nhắn làm quen, cử chỉ ngọt bất ngờ. Đón bằng sự tò mò nhẹ nhõm, đừng vội viết cả cuốn tiểu thuyết từ một cái nhìn. Giai đoạn này cần độ nhẹ: trả lời thật, gặp thử, quan sát — đặt cả kỳ vọng đời người lên một tin nhắn là cách nhanh nhất bóp chết một khả năng đẹp.',
    work: 'Trong công việc: ý tưởng "ngây ngô" trong cuộc họp có khi là ý hay nhất — nói ra. Người mới hỏi câu lạ thường thấy thứ người cũ đã quen mắt. Ý tưởng ngộ nghĩnh cần một cái khung để không bay mất: nói ra kèm một ví dụ ứng dụng, dù thô. Ý tưởng có ví dụ sống lâu gấp ba ý tưởng chỉ có cảm hứng.',
    reflect: [
      'Cảm xúc lạ nào gần đây bạn gạt đi vì "vớ vẩn" — nếu nó là tín hiệu thì nó báo gì?',
      'Lần cuối bạn làm một việc sáng tạo chỉ để vui là khi nào?',
    ],
  },
  {
    slug: 'knight-of-cups',
    name: 'Knight of Cups',
    name_vi: 'Hiệp Sĩ Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 12,
    keyUp: ['lãng mạn', 'lời mời từ trái tim', 'theo đuổi lý tưởng'],
    keyRev: ['hứa ngọt làm mỏng', 'thất thường', 'lãng mạn hóa mọi thứ'],
    image:
      'Hiệp sĩ trên ngựa trắng đi nước kiệu chậm rãi, tay nâng chén như đang dâng tặng, áo giáp gắn cánh ở mũ và gót. Người mang lời tỏ bày đến — một cách đầy nghi thức.',
    symbols:
      'Hiệp sĩ đi nước kiệu chậm, chén nâng ngang ngực như đang dâng tặng: trong bốn Hiệp Sĩ, chỉ con ngựa này bước thong thả — cảm xúc muốn được trao có nghi thức, không phải cơn lũ. Mũ giáp và gót giày gắn cánh: mô-típ của thần đưa tin, người mang thông điệp từ trái tim. Dòng sông nhỏ chảy qua tranh: nước ở đây có hướng, chưa tràn bờ. Vẻ đẹp của lá nằm ở sự chủ ý trong từng cử chỉ.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Hiệp Sĩ là hành động ở thái cực; chất Cốc là cảm xúc. Ghép lại: người hành động vì trái tim — tỏ bày, mời gọi, theo đuổi lý tưởng — kèm rủi ro của thái cực: cảm xúc dâng nhanh thì rút cũng nhanh. Có thể là một người đang tiến về phía bạn, hoặc chính bạn đang muốn tỏ bày.',
    up: 'Hiệp Sĩ Cốc là người theo đuổi bằng trái tim: lời tỏ tình, lời mời hợp tác đầy cảm hứng, một đề nghị làm điều đẹp đẽ. Lá này cũng là lời nhắc về phong cách: có những việc nên làm cho đẹp — chọn lời, chọn lúc, chọn cách. Sự lãng mạn (với người, với nghề, với đời) không phải xa xỉ; nó là cách nói "điều này xứng đáng được làm tử tế". Làm điều đẹp một cách tử tế còn gồm việc chọn thời điểm của người nhận: lời mời hay nhất cũng hỏng nếu đến lúc người ta đang ngập việc. Sự lãng mạn trưởng thành có thêm một kỹ năng: đọc lịch của đối phương.',
    rev: 'Ngược chiều: chén đưa ra mà chân không đứng yên — lời ngọt nhiều hơn việc làm, cảm xúc dâng nhanh rút nhanh, yêu cái cảm giác đang yêu hơn là yêu người trước mặt. Kiểm chứng đơn giản: nhìn độ lặp lại, đừng nhìn độ long lanh. Nếu người đang say cảm xúc là chính bạn, tự hỏi: mình đã làm được việc gì cụ thể cho người này, ngoài nói và hứa? Danh sách trống là câu trả lời.',
    love: 'Trong tình cảm: giai đoạn được (hoặc nên) tỏ bày. Nếu bạn là người nhận: tận hưởng, và quan sát hành động sau lời nói. Nếu bạn là người trao: hứa ít thôi, làm đủ. Người nhận có quyền chậm: cảm ơn chân thành, xin thời gian, nhìn hành động các tuần sau. Lời đẹp là cửa mở, không phải hợp đồng.',
    work: 'Trong công việc: lời mời dự án "đúng mơ ước" — kiểm tra phần ruột (tiền, người, cam kết) trước khi ký vì phần vỏ. Giấc mơ tử tế không sợ bị hỏi giấy tờ; bên nào khó chịu khi bị hỏi ngân sách và mốc thời gian, bên đó đang bán vỏ.',
    reflect: [
      'Bạn đang theo đuổi điều gì bằng cả trái tim — và đã làm nó tử tế tới mức nào?',
      'Lời hứa nào của bạn (hoặc dành cho bạn) đang chờ được chứng minh bằng việc làm?',
    ],
  },
  {
    slug: 'queen-of-cups',
    name: 'Queen of Cups',
    name_vi: 'Hoàng Hậu Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 13,
    keyUp: ['thấu cảm sâu', 'lắng nghe', 'an toàn cảm xúc'],
    keyRev: ['thấm nỗi người đến kiệt', 'mất ranh giới'],
    image:
      'Hoàng hậu ngồi trên ngai sát mép nước, nâng chiếc chén có nắp đóng kín — hiếm hoi trong bộ bài — chân không chạm nước mà chạm bờ.',
    symbols:
      'Hoàng hậu ngồi trên ngai đặt sát mép nước, ngai chạm hình vỏ sò và các thiên thần nước nhỏ: quyền uy của bà thuộc về thế giới cảm xúc. Chiếc chén trong tay có nắp đóng, quai tạc hình thiên thần — chiếc chén duy nhất đóng nắp trong cả bộ bài: chiều sâu nội tâm được giữ gìn, không phơi tràn lan. Bàn chân đặt trên bờ sỏi, không nhúng nước: thấu hiểu nước mà không tan vào nước.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Hoàng Hậu là làm chủ chất từ bên trong; chất Cốc là cảm xúc, trực giác. Ghép lại thành mức chín nhất của thấu cảm: cảm được nỗi người mà vẫn giữ được hình dạng mình. Có thể là người hay lắng nghe bạn, hoặc lời nhắc về ranh giới cho chính bạn khi thương người.',
    up: 'Hoàng Hậu Cốc là người mà ai cũng tìm đến để được nghe: thấu cảm sâu, giữ chuyện kín, làm người khác an toàn để yếu lòng. Chi tiết đắt của lá nằm ở chiếc chén có nắp và bàn chân trên bờ: hiểu nước mà không tan vào nước — cảm được nỗi người mà vẫn giữ được hình dạng của mình. Đó là thấu cảm bền, khác với thấm nỗi người rồi chìm cùng. Thấu cảm bền có cấu trúc: nghe hết mà không vội sửa, hỏi "bạn cần được nghe hay cần lời khuyên", và biết điểm dừng của vai mình. Người được nghe đúng cách tự tìm ra lối; bạn không phải vác hộ.',
    rev: 'Ngược chiều: ranh giới nhòe — nỗi buồn của người thành nỗi buồn của mình, nghe cả thế giới mà không ai nghe mình, kiệt vì làm "trạm cứu hộ cảm xúc" không giờ đóng cửa. Người giúp giỏi nhất là người còn nguyên. Ba dấu hiệu ranh giới đang nhòe: nghĩ về chuyện của người khác lúc nửa đêm, thấy có lỗi khi từ chối nghe, và mệt sau mỗi cuộc trò chuyện thay vì đầy. Đủ cả ba là lúc dựng lại hàng rào.',
    love: 'Trong tình cảm: sự dịu dàng và lắng nghe của bạn là tài sản — miễn nó chảy hai chiều. Một mối quan hệ mà chỉ một người làm chén chứa thì chén ấy sớm tràn. Chén có nắp không có nghĩa khép lòng với người thương; nghĩa là chọn lúc mở — người bạn đời xứng đáng thấy cả phần nước động bên trong, theo nhịp bạn sẵn sàng.',
    work: 'Trong công việc: hợp vai chăm người — nhân sự, chăm khách, dẫn dắt tinh thần nhóm. Đặt giờ "đóng quầy" cảm xúc rõ ràng để còn sạc lại. Và định giá đúng việc giữ nhiệt độ cảm xúc cho nhóm: nó vô hình trong báo cáo nhưng quyết định người ở hay đi — nếu bạn đang làm việc đó, ghi nó vào phần đóng góp của mình, đàng hoàng.',
    reflect: [
      'Ai là người nghe của bạn — và bạn có cho phép mình được nghe không?',
      'Ranh giới nào bạn cần dựng lại để thương người mà không hao mình?',
    ],
  },
  {
    slug: 'king-of-cups',
    name: 'King of Cups',
    name_vi: 'Vua Cốc',
    arcana: 'minor',
    suit_vi: 'Cốc',
    number: 14,
    keyUp: ['điềm tĩnh giữa sóng', 'trưởng thành cảm xúc', 'cân bằng tình – lý'],
    keyRev: ['nén thành xa cách', 'điều khiển êm ái'],
    image:
      'Vị vua ngồi trên ngai đá nổi giữa biển động — cá nhảy, thuyền nghiêng phía xa — mà gương mặt và tay chén vẫn yên. Không phải biển lặng; là người lặng.',
    symbols:
      'Ngai đá đặt trên bệ nổi giữa biển động: cá lớn quẫy sóng một bên, con thuyền nghiêng phía xa — thế giới cảm xúc quanh ông không hề lặng. Nhưng vua ngồi yên, chén và trượng cầm chắc, nét mặt không đổi: sự điềm tĩnh này là kết quả của luyện, không phải của vô cảm. Ông không chối bỏ biển, cũng không để biển tràn lên ngai: giữ được quan hệ làm việc với chính cảm xúc của mình — nghề khó nhất của bộ Cốc.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Vua là làm chủ chất hướng ra ngoài; chất Cốc là cảm xúc. Ghép lại: người dùng độ chín cảm xúc để giữ vững cả một vùng — gia đình, đội nhóm — giữa sóng. Có thể là chỗ dựa điềm tĩnh quanh bạn, hoặc phẩm chất mà tình huống hiện tại đang đòi ở bạn.',
    up: 'Vua Cốc là độ chín của cảm xúc: vẫn cảm đủ — giận, buồn, thất vọng — nhưng không để con sóng nào cầm lái. Trong nhà, đây là người giữ nhiệt độ; trong nhóm, là người mà khủng hoảng tìm đến để được nói chuyện tử tế. Lá này gợi phép thử của trưởng thành: bị chạm đúng chỗ đau mà vẫn chọn được lời tử tế — không phải vì sợ, mà vì đã hiểu mình. Phép thử ấy rất đời: khoảng lặng hai giây trước khi trả lời chính là toàn bộ nội công. Hai giây đó đủ để chọn lời mình sẽ không phải hối.',
    rev: 'Ngược chiều: sự điềm tĩnh là vỏ — bên dưới là cảm xúc bị nén lâu thành lạnh, thành xa cách, có khi thành kiểm soát êm ái (dùng sự "bình tĩnh hơn" để làm người khác thấy mình vô lý). Bình tĩnh thật mở cửa; bình tĩnh giả đóng băng. Kiểm soát êm ái khó nhận diện vì nó đội lốt trưởng thành: không quát, không đập bàn. Nếu sau các cuộc nói chuyện, người kia luôn là người xin lỗi — nhìn lại.',
    love: 'Trong tình cảm: vững chãi của bạn là chỗ tựa — nhưng người thương cần cả phần thật đang xao động bên dưới. Cho người ấy thấy sóng của mình cũng là một dạng tin tưởng. Nó còn cho người thương một việc để làm cho bạn — và được cần đến cũng là một nhu cầu của tình yêu.',
    work: 'Trong công việc: hợp vai xử lý khủng hoảng, hòa giải, dẫn dắt giai đoạn nhạy cảm. Đừng để "anh ấy lúc nào chẳng ổn" thành lý do không ai hỏi bạn có ổn không. Vai hòa giải có một cạm bẫy: thành cái thùng chứa mọi bức xúc. Nhận nghe, nhưng chuyển vấn đề về đúng chỗ giải quyết; thùng chứa không đáy nào rồi cũng thủng.',
    reflect: [
      'Cơn sóng nào bạn đang giữ dưới mặt nước — giữ vì ai, và giá là gì?',
      'Lần gần nhất bạn nói "tôi đang buồn/giận" một cách bình thản là khi nào?',
    ],
  },

// ============ KIẾM (Swords) — khí: tư duy, lời nói, sự thật ============
  {
    slug: 'ace-of-swords',
    name: 'Ace of Swords',
    name_vi: 'Át Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 1,
    keyUp: ['sự thật rõ ra', 'quyết định sắc bén', 'ý tưởng đột phá'],
    keyRev: ['rối trí', 'sự thật bị bẻ cong'],
    image:
      'Bàn tay từ mây nắm thanh kiếm dựng thẳng, mũi kiếm xuyên qua vương miện kết vòng lá. Trí tuệ ở khoảnh khắc sắc nhất: cắt xuyên mọi lớp nhiễu.',
    symbols:
      'Bàn tay từ mây nắm thanh kiếm dựng thẳng, mũi kiếm xuyên qua vương miện kết vòng lá: trí tuệ ở độ sắc nhất chạm tới thắng lợi — nhưng vương miện treo trên mũi kiếm, giữ được hay không là chuyện của người cầm. Nền tranh là dãy núi xám trơ: sự thật kiểu bộ Kiếm không ấm áp, nó trần và rõ. Kiếm hai lưỡi: cùng một sự thật có thể giải phóng hoặc gây thương, tùy tay dùng.',
    storyArc:
      'Điểm khởi phát của cốt truyện Kiếm: hạt mầm thuần khiết nhất của Khí — một nhận thức vừa bừng rõ, chưa qua va chạm nào. Cốt truyện bộ này gập ghềnh nhất trong bốn chất: từ độ sắc ban đầu, các lá sau đi qua bế tắc, đau, lo âu, tới tận đáy — rồi mới học được cách dùng kiếm cho đúng.',
    up: 'Át Kiếm là khoảnh khắc đầu óc bừng rõ: gọi đúng tên vấn đề sau bao ngày lờ mờ, nhìn xuyên một chuyện rối, hoặc một ý tưởng sắc đến mức mọi thứ quanh nó tự xếp hàng. Lá này khuyên dùng độ sắc ấy ngay — viết xuống, nói ra, quyết định — vì sự trong trẻo của tâm trí cũng có hạn dùng như mọi món tươi. Đóng gói nó lại: vấn đề viết thành một câu, quyết định thành một dòng, gửi đi hoặc dán lên bàn. Ngày mai sương mù đời thường sẽ quay lại; thứ đã viết xuống thì không mờ theo.',
    rev: 'Ngược chiều: lưỡi kiếm cùn hoặc bị bẻ — nghĩ mãi không ra đầu mối, thông tin nhiễu, hoặc ai đó (kể cả chính mình) đang uốn sự thật cho vừa ý muốn. Lúc này đừng quyết lớn; hãy đi tìm thêm một dữ kiện thật thay vì thêm một ý kiến. Nhận diện sự thật bị bẻ cong: khi một lập luận cần quá nhiều ngoại lệ để đứng được, hoặc khi mình đang tìm bằng chứng cho kết luận đã chọn sẵn. Cả hai đều là kiếm cùn đội lốt kiếm sắc.',
    love: 'Trong tình cảm: một sự thật cần được nói rõ — càng nói sớm bằng lời tử tế, càng đỡ phải nói muộn bằng lời sắc. Nói tử tế cần chuẩn bị: chọn lúc cả hai còn sức, nói về hành vi thay vì về con người, nói điều mình cần thay vì điều người kia sai.',
    work: 'Trong công việc: hợp lúc phân tích, đặt lại vấn đề, viết đề xuất. Câu hỏi đúng đáng giá hơn mười câu trả lời nhanh. Một trang giấy trắng và câu hỏi "vấn đề thật sự là gì" đáng giá hơn ba cuộc họp; phần lớn dự án kẹt không phải vì thiếu giải pháp mà vì đang giải sai đề.',
    reflect: [
      'Vấn đề bạn đang gặp — gọi tên nó trong MỘT câu, được không?',
      'Sự thật nào bạn đã thấy rõ mà còn chần chừ chưa nói?',
    ],
  },
  {
    slug: 'two-of-swords',
    name: 'Two of Swords',
    name_vi: 'Hai Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 2,
    keyUp: ['bế tắc lựa chọn', 'né quyết định', 'đình chiến tạm'],
    keyRev: ['buộc phải mở mắt', 'dữ kiện mới phá thế cân'],
    image:
      'Người phụ nữ bịt mắt ngồi quay lưng ra biển, hai tay bắt chéo ôm hai thanh kiếm. Thế cân bằng — nhưng là thứ cân bằng phải gồng mới giữ được.',
    symbols:
      'Người phụ nữ bịt mắt ngồi trên ghế đá, hai tay bắt chéo trước ngực ôm hai thanh kiếm cân đối: thế thủ hoàn hảo — và không làm được gì khác ngoài giữ thế. Dải bịt mắt: không nhìn là một lựa chọn, không phải số phận. Sau lưng là vùng biển với những mỏm đá lô nhô: dữ kiện thật vẫn ở đó, chỉ đang bị quay lưng. Mảnh trăng non trên góc trời: quyết định bị treo thường treo qua nhiều đêm.',
    storyArc:
      'Bước hai của cốt truyện Kiếm: cân bằng đôi — nhưng ở bộ Khí, thế cân thành thế kẹt: hai lựa chọn nặng ngang nhau và một người không dám đặt kiếm xuống. Độ sắc của Át chưa mất, chỉ đang bị khoanh tay giữ chặt; càng treo lâu, cái giá càng lớn dần.',
    up: 'Hai Kiếm là thế "chưa chọn được": hai phương án nặng ngang nhau, hoặc một quyết định bạn cố tình bịt mắt để khỏi phải đưa ra. Lá này chỉ ra một sự thật khó chịu: không quyết cũng là một quyết định — và thường là quyết định tốn kém nhất, vì hai tay bạn bận ôm kiếm nên không làm được gì khác. Cái thiếu thường không phải dữ kiện, mà là sự dám chịu cái giá của một bên. Kỹ thuật phá thế cân: thay vì hỏi "bên nào đúng", hỏi "cái giá của từng bên, mình trả nổi cái nào". Quyết định khó thường không phải chọn giữa đúng và sai, mà giữa hai cái giá.',
    rev: 'Ngược chiều: thế cân đang vỡ — một dữ kiện mới, một biến cố, hoặc cảm xúc dồn tới mức không bịt mắt nổi nữa. Khó chịu, nhưng là tin tốt: được buộc phải chọn đôi khi là ơn. Chỉ một lưu ý: việc đầu tiên khi thế cân vỡ không phải quyết ngay, mà là nhìn thẳng dữ kiện mới trong một ngày yên — quyết định ra đời trong cơn chấn động thường mang hình dạng của cơn chấn động.',
    love: 'Trong tình cảm: đứng giữa hai người, hoặc giữa đi và ở. Hỏi thật: bạn đang cân nhắc, hay đang trì hoãn nỗi đau của việc chọn? Đứng giữa lâu ngày là bất công với cả ba; và người đứng giữa thường quên tính một cái giá: chính mình cũng đang mòn đi trong lúc treo.',
    work: 'Trong công việc: hai hướng đều "được" — đặt deadline cho chính mình, liệt kê cái giá của TỪNG bên (kể cả bên "không làm gì"), rồi chọn. Deadline tự đặt cần một người làm chứng: hẹn một đồng nghiệp "thứ sáu tôi sẽ nói quyết định cho anh". Lời hứa có người nghe mạnh gấp mấy lời hứa trong đầu.',
    reflect: [
      'Quyết định nào bạn đang bịt mắt với nó — và bịt mắt đang tốn của bạn thứ gì mỗi tuần?',
      'Nếu buộc phải chọn trong 24 giờ, bạn sẽ chọn gì? Cảm giác đầu tiên khi nghĩ thế nói lên điều gì?',
    ],
  },
  {
    slug: 'three-of-swords',
    name: 'Three of Swords',
    name_vi: 'Ba Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 3,
    keyUp: ['đau lòng', 'sự thật làm tổn thương', 'nỗi đau có tên'],
    keyRev: ['bắt đầu lành', 'tha thứ', 'rút kiếm ra'],
    image:
      'Trái tim đỏ giữa trời mưa xám, ba thanh kiếm xuyên qua. Một trong những hình ảnh thẳng thắn nhất bộ bài: đau là đau, không né.',
    symbols:
      'Trái tim đỏ lơ lửng giữa nền trời xám, ba thanh kiếm đâm xuyên, mưa xiên hạt: một trong những lá hiếm hoi của RWS không có người, không có đất — chỉ còn đúng cái đau, vẽ thẳng, không trang trí. Mưa trong tranh là chi tiết có hậu: mưa nghĩa là trời đang xả, và mưa nào cũng có lúc tạnh. Kiếm là biểu tượng của sự thật trong bộ Khí: tim này đau vì một điều thật vừa lộ.',
    storyArc:
      'Bước ba của cốt truyện Kiếm. Số 3 ở mọi chất là thành hình bước đầu; ở bộ Kiếm, cái thành hình đầu tiên thường là một sự thật — và sự thật chạm vào chỗ đau. Đây là khung gợi ý, không phải luật; điều chắc chắn hơn: ngay sau cú đau này, Bốn Kiếm là lệnh nghỉ để lành.',
    up: 'Ba Kiếm là nỗi đau do sự thật gây ra: lời nói làm tổn thương, một sự phản bội, một tin không muốn nghe. Lá này không tô hồng — nó thừa nhận vết đâm là thật. Nhưng để ý: kiếm là biểu tượng của trí tuệ; nỗi đau kiểu này luôn kèm một sự thật vừa lộ ra, và sự thật đó — dù đau — thường giải phóng ta khỏi một ảo tưởng đắt đỏ hơn. Nỗi đau cần được gọi đúng tên mới xử lý được: bị phản bội khác bị thất vọng, bị nói dối khác bị hiểu lầm. Gọi tên càng chính xác, vết cắt càng gọn và càng dễ khép.',
    rev: 'Ngược chiều: giai đoạn rút kiếm — vết thương bắt đầu khép, kể lại chuyện cũ thấy bớt nghẹn, sẵn sàng tha (cho người, hoặc cho mình). Đừng vội ép lành; nhưng cũng đừng giữ kiếm trong tim làm kỷ niệm. Tha thứ hay bị hiểu nhầm là nói "chuyện đó không sao"; thực ra nó là "chuyện đó có sao, và tôi chọn không mang nó theo nữa". Hai câu khác nhau một trời.',
    love: 'Trong tình cảm: tổn thương cần được gọi tên giữa hai người — vết đau nói ra là vết đau bắt đầu được xử lý. Im lặng nuôi sẹo xấu hơn nói chuyện vụng về. Một luật đáng dùng cho cuộc nói chuyện này: mỗi người được kể hết phần mình mà không bị cắt lời, kể xong mới tới lượt phản hồi. Nghe hết một lần nhiều khi chữa được nửa vết.',
    work: 'Trong công việc: phản hồi phũ, dự án tâm huyết bị bác. Cho mình một ngày buồn, rồi tách bạch: phần nào là nỗi đau cái tôi, phần nào là bài học dùng được. Kỹ năng tách nội dung khỏi giọng điệu — lọc lấy một điều dùng được, phần cách-nói-tệ trả lại người nói — là áo giáp tốt nhất của người làm nghề.',
    reflect: [
      'Nỗi đau này đang dạy bạn sự thật gì mà trước đó bạn không chịu nhìn?',
      'Bạn cần gì để bắt đầu rút kiếm ra — thời gian, lời xin lỗi, hay một quyết định của chính mình?',
    ],
    ease:
      'Lá này trông đáng sợ nhưng không phải "điềm" cho chuyện dữ sắp tới — nó mô tả một nỗi đau đang/đã có, và mở lối nghĩ về nó. Nỗi đau không cần lễ giải; nó cần được thừa nhận và được thời gian.',
  },
  {
    slug: 'four-of-swords',
    name: 'Four of Swords',
    name_vi: 'Bốn Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 4,
    keyUp: ['nghỉ để phục hồi', 'tạm rút lui', 'tĩnh để nghĩ'],
    keyRev: ['ép mình chạy tiếp', 'nghỉ thành trốn'],
    image:
      'Trong nhà nguyện tĩnh, một hiệp sĩ nằm yên như tượng, hai tay chắp; ba thanh kiếm treo trên tường, một thanh nằm dưới thân. Vũ khí treo lên — chưa vứt, chỉ treo.',
    symbols:
      'Hiệp sĩ nằm thẳng trên phiến đá trong nhà nguyện, hai tay chắp trước ngực như tượng mộ cổ: nghỉ ở đây có tính nghi thức, chủ động, không phải gục ngã. Ba thanh kiếm treo trên tường chỉ mũi xuống, một thanh khắc nằm dọc dưới thân: vũ khí được cất khỏi tay nhưng không vứt — trận chiến tạm hoãn, không bị xóa. Ô cửa kính màu phía trên: chỗ nghỉ được chọn là nơi lành. Tĩnh, nhưng là cái tĩnh có chủ đích.',
    storyArc:
      'Bước bốn của cốt truyện Kiếm: dừng lại giữ vững — sau cú đau của Ba Kiếm, số 4 mang nghĩa đúng nhất của nó: ổn định để hồi sức. Đây là lá "được phép nghỉ" hiếm hoi của bộ Khí; nghỉ cho đủ, vì Năm Kiếm phía trước là một trận va chạm tốn sức khác.',
    up: 'Bốn Kiếm là lệnh nghỉ có chủ đích: sau (hoặc giữa) một trận chiến dài, tâm trí cần một quãng im — ngủ đủ, tắt thông báo, một ngày không quyết định gì. Lá này phân biệt rõ: nghỉ không phải bỏ cuộc; kiếm treo trên tường chứ không gãy. Người biết nghỉ đúng lúc quay lại trận với lưỡi kiếm sắc hơn kẻ gồng thêm ba tuần bằng dao cùn. Nghỉ có chủ đích nên được lên lịch như một cuộc họp: có giờ bắt đầu, giờ kết thúc, nội dung rõ. Nghỉ trôi nổi không hẹn giờ thường thành lướt điện thoại ba tiếng và mệt hơn.',
    rev: 'Ngược chiều: hoặc bạn đang ép mình chạy khi đồng hồ đỏ đèn (cáu vô cớ, ngủ kém, đọc ba lần một đoạn — đó là chuông), hoặc kỳ nghỉ đã dài quá hạn thành nơi trốn việc quay lại. Nghỉ có ngày kết thúc; trốn thì không. Các tín hiệu chuông kể trên hay bị hẹn "xong đợt này rồi tính"; xuất hiện đủ mà vẫn cố, cái giá sẽ tính bằng tuần chứ không bằng ngày.',
    love: 'Trong tình cảm: đôi khi hai người cần một nhịp lặng — không phải chiến tranh lạnh, mà là cùng thống nhất "mình nghỉ tranh luận tới cuối tuần rồi nói tiếp bằng cái đầu mát". Nhịp lặng có hẹn khác chiến tranh lạnh ở đúng hai điểm: có thỏa thuận, và có ngày quay lại. Thiếu hai thứ đó, im lặng là vũ khí chứ không phải chỗ nghỉ.',
    work: 'Trong công việc: xếp một quãng trắng thật sự vào lịch. Não giải bài toán khó lúc đi dạo giỏi hơn lúc nhìn trừng màn hình. Bảo vệ quãng trắng như bảo vệ cuộc hẹn với khách lớn: tắt thông báo, báo trước với nhóm. Não cần chỗ trống để xếp lại; không ai xếp kho lúc xe hàng vẫn đang vào.',
    reflect: [
      'Cơ thể bạn đang phát tín hiệu gì mà bạn cứ hẹn "xong đợt này rồi tính"?',
      'Kỳ nghỉ gần nhất của bạn có ngày bắt đầu — nó có ngày kết thúc chưa?',
    ],
  },
  {
    slug: 'five-of-swords',
    name: 'Five of Swords',
    name_vi: 'Năm Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 5,
    keyUp: ['thắng mà mất', 'xung đột tổn thương', 'cái giá của hơn thua'],
    keyRev: ['buông cuộc cãi', 'làm hòa', 'rút bài học'],
    image:
      'Kẻ thắng ôm năm thanh kiếm nhếch mép nhìn hai người thua lặng lẽ bỏ đi về phía biển động. Trận đã xong — và sân chiến trống rỗng hơn trước.',
    symbols:
      'Kẻ thắng đứng ôm ba thanh kiếm, hai thanh khác nằm dưới đất, khóe miệng nhếch: chiến lợi phẩm nhiều hơn hai tay cầm nổi. Hai người thua bỏ đi về phía biển, một người ôm mặt: cái giá của trận này hiện rõ ở sau lưng kẻ thắng. Bầu trời mây rách xơ xác: không khí sau một cuộc hơn thua chẳng lành cho bên nào. Tranh không nói ai đúng — nó chỉ hỏi: sân này còn lại gì.',
    storyArc:
      'Bước năm của cốt truyện Kiếm: va chạm giữa chặng — và ở bộ Khí, cú xáo trộn mang dạng xung đột có kẻ thắng người thua. Khác Năm Gậy tập dượt vô hại, Năm Kiếm để lại vết. Bài học ở đây dẫn thẳng tới lá kế: Sáu Kiếm là chuyến đò rời khỏi chính những bãi chiến như thế.',
    up: 'Năm Kiếm hỏi một câu khó: thắng cái này, bạn mất cái gì? Có những cuộc cãi thắng bằng lý mà thua bằng tình; có những ván "đúng" mà xong rồi chẳng ai muốn ngồi cùng bàn. Lá này không cấm bạn thắng — nó bắt bạn nhìn tổng sổ: hơn thua xong, trên sân còn lại ai? Đôi khi rời cuộc chiến không phải vì yếu, mà vì thấy cái giá. Trước khi vào một cuộc hơn thua, điền nhanh ba ô: thắng thì được gì, giá phải trả là gì, một năm sau còn thấy đáng không. Ô thứ ba trống là dấu hiệu nên rời sân.',
    rev: 'Ngược chiều: bạn bắt đầu buông — xin lỗi trước, bỏ qua một câu khích, rời một cuộc cãi không lối ra. Nhẹ hẳn. Bài học đắt nhất của Năm Kiếm ngược: có những "trận thắng" cũ đáng được xin lỗi lại. Lời xin lỗi ấy không làm bạn thấp đi; nó thường là tin nhắn khó gửi nhất và được nhớ lâu nhất trong cả mối quan hệ.',
    love: 'Trong tình cảm: nếu cãi nhau mà mục tiêu là thắng, cả hai cùng thua. Thử đổi câu hỏi từ "ai đúng" sang "mình đang bảo vệ điều gì, và điều đó có cần kiểu bảo vệ này không". Trong nhà, mỗi trận "thắng" đều được ghi sổ ở đâu đó trong lòng người thua; sổ ấy đầy thì tình cạn. Đổi luật chơi: cùng thắng một vấn đề, hoặc cùng thua trước nó.',
    work: 'Trong công việc: cẩn thận chiến thắng đốt cầu — hơn một keo trước mặt sếp mà mất một đồng minh mười năm. Sự nghiệp là trò chơi lặp, không phải ván một lần. Danh tiếng "người hay đúng" và "người nên mời vào dự án" là hai danh tiếng khác nhau; cái thứ hai nuôi sự nghiệp dài hơn nhiều.',
    reflect: [
      'Cuộc hơn thua nào bạn đang theo mà phần thưởng thật ra chỉ là cảm giác thắng?',
      'Có cây cầu nào bạn đã đốt mà giờ đáng bắc lại — bắt đầu bằng gì?',
    ],
  },
  {
    slug: 'six-of-swords',
    name: 'Six of Swords',
    name_vi: 'Sáu Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 6,
    keyUp: ['chuyển tiếp', 'rời vùng dữ sang vùng lặng', 'đi về phía bình yên'],
    keyRev: ['hành lý cũ kéo lại', 'chưa dứt được'],
    image:
      'Người lái đò chở người phụ nữ trùm khăn và đứa trẻ qua sông; sáu thanh kiếm cắm ở mũi thuyền cùng sang sông. Nước phía sau gợn, nước phía trước lặng.',
    symbols:
      'Con đò chở người phụ nữ trùm khăn và đứa trẻ, người lái đò đứng chống sào phía sau: một cuộc sang sông có người giúp — không ai tự chèo qua mọi biến cố một mình. Sáu thanh kiếm cắm thẳng ở mũi thuyền: bài học và vết cũ đi cùng chuyến; có những thứ phải mang theo, nhưng mang theo khác với để chúng cầm lái. Mặt nước bên phải thuyền gợn, phía trước phẳng dần: đang đi đúng hướng, từ động sang lặng.',
    storyArc:
      'Bước sáu của cốt truyện Kiếm: hồi phục và di chuyển. Số 6 ở mọi chất là hài hòa lại; ở bộ Khí, sự hồi phục mang hình chuyến đò — rời bãi chiến của Năm Kiếm sang bờ lặng hơn. Đây là lá bản lề: nửa sau cốt truyện Kiếm sẽ đấu với kẻ địch bên trong thay vì bên ngoài.',
    up: 'Sáu Kiếm là chuyến đò sang trang: rời một giai đoạn sóng gió — đổi chỗ ở, đổi việc, ra khỏi một mối quan hệ bào mòn — về phía nước lặng hơn. Lá này thật thà ở chi tiết sáu thanh kiếm vẫn trên thuyền: ta mang theo bài học (và cả vết xước) của chuyện cũ, không xóa được — nhưng chở chúng sang sông như hành lý, khác hẳn để chúng dìm thuyền. Sang trang hiệu quả cần một nghi thức nhỏ đánh dấu: dọn lại bàn làm việc, viết một trang khép sổ, một chuyến đi ngắn. Không có vạch kẻ, tâm trí không biết chuyện cũ đã sang chương.',
    rev: 'Ngược chiều: chuyến đi bị neo — lý trí biết phải sang sông mà tay chưa buông bến cũ; hoặc thân đã đi xa mà đầu vẫn mở "căn phòng cũ" mỗi đêm. Đi mà chưa dứt thì chưa phải là đi. Một mẹo nghe máy móc mà được việc: giao cho chuyện cũ một giờ cố định — được nghĩ về nó mười lăm phút tối thứ tư. Nỗi nhớ có giờ hẹn sẽ thôi gõ cửa cả tuần.',
    love: 'Trong tình cảm: giai đoạn sau giông — cùng nhau (hoặc một mình) chèo về phía êm. Đừng đòi hết buồn ngay; nước lặng dần theo từng nhịp chèo. Giúp nhau sang sông không phải là kéo người kia đi nhanh hơn nhịp của họ; là ngồi cùng thuyền và chèo phần mình. Mỗi người có tốc độ tạnh mưa riêng.',
    work: 'Trong công việc: chuyển việc/chuyển nhóm để thoát môi trường độc hại là chính đáng. Mang theo bài học, để lại sự cay đắng — công ty mới không nợ bạn lời xin lỗi của công ty cũ. Ba tháng đầu ở chỗ mới, hạn chế kể xấu chỗ cũ: người nghe không có bối cảnh, và bạn cần chỗ trống trong đầu cho cái mới hơn là củi cho lửa cũ.',
    reflect: [
      'Bạn đang ở khúc nào của chuyến đò: chưa xuống thuyền, đang giữa sông, hay đã cập mà chưa chịu lên bờ?',
      'Trong "sáu thanh kiếm" mang theo, thanh nào là bài học, thanh nào chỉ là oán cũ vô dụng?',
    ],
  },
  {
    slug: 'seven-of-swords',
    name: 'Seven of Swords',
    name_vi: 'Bảy Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 7,
    keyUp: ['mưu lược', 'đi đường vòng', 'hành động một mình'],
    keyRev: ['lộ bài', 'tự lừa mình', 'trả giá cho đường tắt'],
    image:
      'Một người ôm năm thanh kiếm rón rén rời trại địch lúc ban ngày, ngoái nhìn sau lưng; hai thanh kiếm còn cắm lại. Khôn — và đang đi bằng đầu ngón chân.',
    symbols:
      'Người đàn ông ôm năm thanh kiếm nhón chân rời trại, mắt ngoái lại sau lưng: tư thế của người biết rõ mình đang làm gì — và biết rõ nó không đường hoàng. Hai thanh kiếm còn cắm lại: nước đi khôn nào cũng bỏ sót thứ gì đó. Dãy lều rực màu và nhóm người xa xa phía sau: chuyện diễn ra giữa ban ngày, sát bên cộng đồng — bí mật kiểu này sống bằng việc không ai buồn quay đầu nhìn.',
    storyArc:
      'Bước bảy của cốt truyện Kiếm: chặng đánh giá và chọn lựa khó — ở bộ Khí, phép thử xoay quanh sự trung thực: khôn khéo tới đâu thì thành gian? Sau khi rời bãi chiến ở Sáu Kiếm, người ta học đi đường vòng; Bảy Kiếm hỏi đường vòng ấy có chịu nổi ánh sáng không.',
    up: 'Bảy Kiếm là nước đi khôn khéo: không đối đầu trực diện mà đi vòng — đàm phán riêng, giữ bài kín, rút êm khỏi cuộc không đáng. Có lúc đó là chiến lược hợp lệ (không phải trận nào cũng cần kèn trống). Nhưng lá này luôn kèm câu kiểm tra: nếu việc này bị nhìn thấy toàn cảnh, bạn còn thấy ổn không? Khéo léo và gian dối chỉ cách nhau đúng câu đó. Chiến lược kín hợp lệ có giấy khai sinh rõ: nó bảo vệ việc chung hoặc quyền riêng tư chính đáng, không lấy gì của ai. Soát nước đi của mình bằng đúng tiêu chí đó.',
    rev: 'Ngược chiều: nước đi vụng lộ ra — kế hoạch bị nhìn thấu, đường tắt bắt đầu tính lãi; hoặc người bị lừa khéo nhất hóa ra là chính mình ("chỉ lần này", "ai chẳng thế"). Trung thực muộn vẫn rẻ hơn bị phát hiện. Tự lừa mình tinh vi hơn lừa người: nó không nói dối, chỉ chọn lọc sự thật. Một buổi kể toàn bộ câu chuyện cho người mình tin — không cắt đoạn nào — là máy quét gian lận tốt nhất.',
    love: 'Trong tình cảm: có gì đó đang được giấu "cho yên" — bí mật nhỏ trả góp thành khoảng cách lớn. Úp mở lâu ngày chính là một dạng nói dối. Ranh giới giữa riêng tư và bí mật: riêng tư là thứ không cần kể; bí mật là thứ phải giấu vì kể ra sẽ đổ vỡ. Mỗi bí mật đang giữ là một khoản vay đang tính lãi ngày.',
    work: 'Trong công việc: giữ chiến lược kín là quyền; nhận công người khác, đi đêm sau lưng đội — là khoản vay lãi cao. Danh tiếng là tài sản gây dựng chậm, mất nhanh. Trong môi trường nhiều nước đi sau lưng, người chơi bài ngửa lâu dài lại thắng: ai cũng biết tìm họ khi cần một câu trả lời thật — vị trí đó không ai cạnh tranh nổi.',
    reflect: [
      'Nước đi nào bạn đang giấu — nếu mọi người thấy hết, bạn có còn đi nước đó?',
      'Đường tắt nào bạn đang đi mà sâu trong lòng biết là sẽ phải quay lại trả?',
    ],
  },
  {
    slug: 'eight-of-swords',
    name: 'Eight of Swords',
    name_vi: 'Tám Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 8,
    keyUp: ['tự trói bằng niềm tin', 'cảm giác hết đường', 'nhà tù trong đầu'],
    keyRev: ['cởi trói', 'nhìn ra lựa chọn', 'bước ra'],
    image:
      'Người phụ nữ bịt mắt, thân quấn vải, đứng giữa tám thanh kiếm cắm xuống đất. Nhìn kỹ: dây trói lỏng, chân không bị buộc, và giữa các thanh kiếm có lối đi.',
    symbols:
      'Người phụ nữ bị bịt mắt, thân quấn vải, đứng giữa vòng tám thanh kiếm cắm xuống đất: nhìn xa như chuồng giam, nhìn gần thì kiếm chỉ cắm một phía và các khe đủ rộng để bước qua. Dây quấn lỏng, chân trần không bị buộc: mọi ràng buộc trong tranh đều tháo được — trừ dải bịt mắt, thứ phải tự tay gỡ. Lâu đài trên núi phía xa: thế giới bên ngoài vẫn nguyên đó, đợi.',
    storyArc:
      'Bước tám của cốt truyện Kiếm: số 8 ở các chất khác là tăng tốc hay chuyên cần, riêng bộ Khí rẽ vào trong — sau những trận ngoài kia, kẻ giam mình giờ là chính ý nghĩ. Đây là lá mở màn chặng cuối gập ghềnh của bộ Kiếm; thoát được nhà tù này, lo âu của Chín Kiếm mới có đường xử.',
    up: 'Tám Kiếm là nhà tù xây bằng ý nghĩ: "tôi không thể nghỉ việc", "nói ra cũng vô ích", "giờ này còn làm lại sao kịp". Tình huống thật có ràng buộc thật — nhưng lá này chỉ vào phần trói LỎNG: bao nhiêu phần của bức tường là sự thật đã kiểm chứng, bao nhiêu phần là câu niệm lâu năm chưa từng thử lại? Người bịt mắt không thấy lối đi không có nghĩa là lối đi không có. Cách kiểm kê bức tường: viết từng câu "tôi không thể..." ra giấy, cạnh mỗi câu ghi lần gần nhất đã kiểm chứng nó. Nhiều bức tường được xây hoàn toàn bằng lời kể, có khi từ chục năm trước.',
    rev: 'Ngược chiều: dải bịt mắt đang tuột — bạn thử cái "không thể" và nó… được; hỏi câu "ai bảo thế?" và không tìm ra tác giả nào ngoài mình. Tự do đôi khi chỉ cách một cú thử nhỏ. Cú thử nhỏ là chìa khóa đúng cỡ: chưa cần nghỉ việc, thử xin làm khác quy trình một lần; chưa cần nói hết, thử nói một phần. Mỗi cú thử thành công nới dải bịt mắt thêm một nấc.',
    love: 'Trong tình cảm: cảm giác "mắc kẹt" trong quan hệ đáng được tách đôi — phần ràng buộc thật (con cái, cam kết) và phần tự trói ("không ai khác chịu nổi tôi"). Phần hai gỡ được. Câu "không ai khác chịu nổi tôi" là câu tự trói kinh điển: nó chưa từng được kiểm chứng, vì người nói nó chưa từng cho ai cơ hội chứng minh điều ngược lại.',
    work: 'Trong công việc: "không thể" nào của bạn đã hơn một năm chưa kiểm chứng lại? Thị trường đổi, kỹ năng bạn đổi — bức tường cũ có khi đã thành cửa. Hỏi ba người ngoài cuộc "tình huống này anh thấy có lối nào": người trong vòng kiếm nhìn thấy tám thanh, người ngoài thường thấy tám khe hở. Góc nhìn là thứ rẻ nhất mà ít ai chịu đi mượn.',
    reflect: [
      'Niềm tin nào đang trói bạn mà bạn chưa từng đem ra kiểm chứng?',
      'Nếu một người bạn kể đúng tình huống của bạn, bạn sẽ chỉ cho họ lối ra nào? Sao lối đó không áp dụng cho mình?',
    ],
  },
  {
    slug: 'nine-of-swords',
    name: 'Nine of Swords',
    name_vi: 'Chín Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 9,
    keyUp: ['lo âu đêm', 'vòng nghĩ xoáy', 'nỗi sợ phình to trong bóng tối'],
    keyRev: ['sáng dần', 'nói ra nỗi sợ', 'tách lo thật khỏi lo ảo'],
    image:
      'Người ngồi bật dậy giữa đêm, hai tay ôm mặt; chín thanh kiếm treo ngang tường tối. Trên chăn thêu hoa hồng và ký hiệu chiêm tinh — đời thật bên dưới vẫn nguyên, chỉ tâm trí đang gào.',
    symbols:
      'Người ngồi bật dậy trên giường giữa đêm, hai tay ôm mặt: tư thế của cơn lo không có kẻ địch nào trong phòng. Chín thanh kiếm treo ngang trên tường tối — treo, không đâm ai: mối nguy trong tranh chưa từng chạm vào người. Tấm chăn thêu hoa hồng xen ký hiệu chiêm tinh: đời sống thật bên dưới vẫn đủ đầy, có trật tự; màn đêm chỉ che nó khỏi tầm mắt. Thành giường khắc cảnh một người thua trận: nỗi sợ hay phát lại chuyện cũ.',
    storyArc:
      'Bước chín của cốt truyện Kiếm: đỉnh cảm xúc của chất — với bộ Khí là đỉnh lo âu, phiên bản ngược của Chín Cốc toại nguyện. Nhà tù ý nghĩ ở Tám Kiếm về đêm phóng to thành kịch bản thảm họa. Còn một bước nữa là đáy thật ở Mười Kiếm — và nghịch lý: đáy thật lại dễ xử hơn đêm dài tưởng tượng.',
    up: 'Chín Kiếm là ba giờ sáng của tâm trí: lo âu xoáy vòng, kịch bản xấu tự nhân bản, một nỗi xấu hổ cũ phát lại không ai yêu cầu. Lá này tách bạch giúp bạn: chín thanh kiếm treo TRÊN TƯỜNG, không đâm vào người — phần lớn khổ lúc này là khổ trong đầu, to hơn nhiều so với chuyện ngoài đời. Không phải chuyện không có thật; là kích thước bị đêm phóng đại. Một kỹ thuật cũ mà hiệu quả: để giấy bút cạnh giường, lo gì viết nấy, rồi hẹn "mai xử". Não gào vì sợ quên nhiệm vụ canh gác; giao ca cho tờ giấy, nó chịu im hơn hẳn.',
    rev: 'Ngược chiều: trời đang sáng — nói được nỗi sợ ra miệng với một người, viết nó xuống giấy và thấy nó… ngắn hơn tưởng. Lo âu sợ nhất ánh sáng và giấy bút: thứ mơ hồ thì khổng lồ, thứ được viết ra thì có kích thước. Làm thêm một bảng đối chiếu định kỳ: cột một ghi các kịch bản xấu từng dựng, cột hai ghi cái thật sự đã xảy ra. Sau vài tháng, tỉ lệ trúng của "nhà tiên tri ba giờ sáng" tự nó thành thuốc.',
    love: 'Trong tình cảm: kịch bản ghen tuông/lo mất tự dựng lúc đêm — đem ra hỏi thẳng vào ban ngày. Người thương không đọc được suy nghĩ; nỗi lo không nói là nỗi lo tự nuôi. Khung giờ cũng quan trọng như nội dung: chuyện lo lắng về nhau hẹn nói vào buổi sáng cuối tuần, không nói sau mười giờ đêm — cùng một câu chuyện, kể ban đêm nghe nặng gấp ba.',
    work: 'Trong công việc: lo về deadline/sai sót — đổi "lo" thành "danh sách": việc gì làm được ngay mai, việc gì ngoài tầm. Não thôi gào khi tay có việc. Chia đôi sổ cho rõ: phần trong tầm tay xử bằng hành động, phần ngoài tầm (quyết định của người khác, thị trường) xử bằng chấp nhận — trộn lẫn hai phần là công thức mất ngủ.',
    reflect: [
      'Nỗi lo to nhất đêm qua: viết nó thành MỘT câu trên giấy — nó còn to thế không?',
      'Trong các kịch bản xấu đang chạy trong đầu, cái nào từng thật sự xảy ra?',
    ],
    ease:
      'Nếu lo âu mất ngủ kéo dài nhiều tuần và lấn vào ban ngày, đó là chuyện sức khỏe đáng được hỗ trợ chuyên môn (bác sĩ, chuyên gia tâm lý) — một lá bài không chẩn đoán được điều đó, và không nghi thức nào thay được một cuộc hẹn đúng người.',
  },
  {
    slug: 'ten-of-swords',
    name: 'Ten of Swords',
    name_vi: 'Mười Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 10,
    keyUp: ['chạm đáy', 'kết thúc hẳn', 'không còn gì để mất — và rạng đông'],
    keyRev: ['hồi phục', 'đứng dậy', 'thôi kịch tính hóa'],
    image:
      'Người nằm sấp bên bờ nước, mười thanh kiếm cắm dọc lưng — và phía chân trời, mặt trời đang mọc, vàng rực dưới mây đen. Tối nhất của bộ Kiếm, kèm bình minh trong cùng một khung hình.',
    symbols:
      'Người nằm sấp sát mép nước, mười thanh kiếm cắm dọc lưng: mười — nhiều hơn mức cần để kết thúc — là cách tranh nói "chuyện này xong hẳn, không mơ hồ". Tấm vải đỏ vắt ngang thân, bàn tay buông xuôi: buông thật sự, hết gồng. Nhưng chân trời phía xa đang rạng: mặt trời mọc dưới lớp mây đen, mặt nước phẳng như gương. Trong cùng một khung hình, RWS đặt cái kết tuyệt đối cạnh khởi đầu chắc chắn — không lá nào nói điều đó rõ hơn.',
    storyArc:
      'Bước mười, chặng cuối cốt truyện Kiếm: đỉnh điểm và chuyển chu kỳ — ở bộ Khí là chạm đáy để được sang trang. Lo âu của Chín Kiếm sợ đủ thứ; Mười Kiếm là lúc điều sợ nhất đã xảy ra xong, và hóa ra phần khó nhất là đoạn chờ. Vòng mới bắt đầu từ một Át Kiếm khác: nhận thức mới, sắc và sạch.',
    up: 'Mười Kiếm là cú kết không thể chối: dự án sập hẳn, mối quan hệ chấm dứt hẳn, một giai đoạn bị đóng dấu "hết". Đau — nhưng lá này có một món quà lạnh lùng: sự RÕ RÀNG. Hết thật rồi, nghĩa là thôi hy vọng vớt vát, thôi chết dần — và mọi năng lượng được trả về cho ngày mai. Mặt trời trong tranh không phải trang trí: đáy là nơi duy nhất mà mọi hướng còn lại đều là đi lên. Việc nên làm đầu tiên sau một cú kết: ngủ, ăn, và kể chuyện đó ra một lần trọn vẹn với người an toàn. Bài học rút lúc còn choáng thường sai; sự rõ ràng cần vài ngày để lắng.',
    rev: 'Ngược chiều: bạn đang gượng dậy — vết thương khép, bài học rút, và bắt đầu kể lại chuyện cũ như chuyện đã qua. Cũng có khi lá nhắc nhẹ: tình huống chưa đến mức "mười kiếm" như cảm giác — bớt một nửa kịch tính, còn lại dễ xử hơn nhiều. Câu hỏi hạ nhiệt: "trên thang mười, chuyện này thật sự mấy kiếm?" Nhiều biến cố được cảm nhận là mười nhưng đo lại chỉ sáu — khoảng chênh còn lại toàn do mình tự cắm thêm.',
    love: 'Trong tình cảm: nếu đã thật sự kết thúc, điều tử tế nhất với chính mình là thừa nhận nó kết thúc. Đóng cửa hẳn thì cửa khác mới có chỗ mở. Kết thúc được thừa nhận tử tế còn cho phép giữ lại phần tốt đã có; kết thúc bị chối bỏ thì thiêu luôn cả kỷ niệm. Cách khép quyết định thứ còn lại trong tay.',
    work: 'Trong công việc: thất bại trọn vẹn — làm "khám nghiệm" tử tế: nguyên nhân, bài học, thứ giữ lại. Nhiều sự nghiệp đẹp xây trên nền một lần sập hẳn. Buổi khám nghiệm nên có luật "không truy tội người, chỉ truy lỗi hệ thống": người ta chỉ nói thật khi biết sự thật không bị dùng để xử mình.',
    reflect: [
      'Điều gì trong đời bạn cần được thừa nhận là "đã hết" để bạn được tự do?',
      'Nhìn lại lần chạm đáy cũ: nó đã mở ra điều gì mà lúc đó bạn không thấy?',
    ],
    ease:
      'Hình ảnh lá này dữ dội nhưng nghĩa của nó là "một kết thúc dứt điểm + khởi đầu phía sau" — không phải điềm tai họa thể xác. Ai dùng lá này để dọa bạn về "đại nạn" rồi gợi ý lễ giải, nơi đó đang kinh doanh nỗi sợ.',
  },
  {
    slug: 'page-of-swords',
    name: 'Page of Swords',
    name_vi: 'Thị Đồng Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 11,
    keyUp: ['tò mò thông tin', 'óc quan sát', 'học hỏi nhanh'],
    keyRev: ['lời vội', 'soi mói', 'nói trước nghĩ sau'],
    image:
      'Người trẻ cầm kiếm dựng đứng trên gò cao, gió thổi tóc và cây nghiêng, mắt ngoái quan sát xung quanh. Tâm trí trẻ giữa trời nhiều gió — nhạy và động.',
    symbols:
      'Người trẻ đứng trên gò đất cao, hai tay nắm kiếm dựng chếch, thân xoay một hướng mắt nhìn hướng khác: tư thế của người đang canh mọi phía — óc quan sát ở trạng thái bật. Gió thổi tóc, cây nghiêng, mây rối phía sau: bộ Khí đúng nghĩa đen, mọi thứ quanh lá này đều đang động. Bầy chim bay xa trên trời: tin tức, tín hiệu, những mẩu thông tin lướt qua — nghề của Thị Đồng Kiếm là bắt chúng.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Thị Đồng là học việc, lần đầu chạm vào chất; chất Kiếm là tư duy và lời nói. Ghép lại: người mới của thế giới thông tin — hỏi nhanh, bắt tín hiệu nhạy, đôi khi nói nhanh hơn nghĩ. Có thể là một người trẻ sắc sảo quanh bạn, hoặc chính giai đoạn thu thập của bạn.',
    up: 'Thị Đồng Kiếm là cái đầu háo hức: thích hỏi, thích tra, bắt tín hiệu nhanh, nói chuyện gì cũng muốn hiểu tới gốc. Lá này hợp giai đoạn thu thập — học kỹ năng mới, tìm hiểu trước khi quyết, lắng nghe các bên. Sự tỉnh táo non trẻ có cái hay: chưa đủ định kiến để bỏ sót điều người "biết rồi" hay bỏ sót. Giai đoạn thu thập cần một cột sống: câu hỏi trung tâm viết sẵn trên đầu trang. Không có nó, sự tò mò trôi thành lướt — biết thêm trăm thứ mà không trả lời được thứ cần.',
    rev: 'Ngược chiều: năng lượng ấy đổ vào chỗ rẻ — hóng chuyện, bắt lỗi vặt, tranh luận để tỏ ra sắc, nói trước nghĩ sau làm đứt tay người (và mình). Thông minh chưa kèm tử tế thì mới chỉ là nhanh. Luật ba giây trước khi bấm gửi: đọc lại một lần bằng mắt người nhận. Câu chữ sắc đi nhanh hơn người viết nghĩ, và vết nó cứa thì ở lại lâu hơn cả cuộc tranh luận.',
    love: 'Trong tình cảm: tò mò về nhau là tốt — soi điện thoại, kiểm tra ngầm là phá. Câu hỏi thẳng thắn xây niềm tin nhanh hơn cuộc điều tra giỏi nhất. Niềm tin xây bằng điều tra ngầm thì mỗi phát hiện — dù vô hại — đều thành vết nứt mới, vì chính phương pháp đã là vết nứt rồi.',
    work: 'Trong công việc: hợp nghiên cứu, kiểm chứng, đặt câu hỏi trong họp. Trước khi gửi tin nhắn sắc, đọc lại một lần bằng mắt người nhận. Người đặt câu hỏi làm rõ vấn đề có giá trị ngang người trả lời; đừng ngại làm người hỏi "câu ai cũng đang thắc mắc mà không ai mở miệng".',
    reflect: [
      'Bạn đang tò mò điều gì — và sự tò mò đó đang phục vụ việc gì lớn hơn?',
      'Lời nhanh nào gần đây của bạn đã cứa ai đó — có đáng một lời đính chính?',
    ],
  },
  {
    slug: 'knight-of-swords',
    name: 'Knight of Swords',
    name_vi: 'Hiệp Sĩ Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 12,
    keyUp: ['lao thẳng vào mục tiêu', 'quyết liệt', 'nói thẳng làm nhanh'],
    keyRev: ['hấp tấp', 'cãi thắng bằng mọi giá', 'lao không nhìn đường'],
    image:
      'Hiệp sĩ thúc ngựa phi nước đại ngược chiều gió, kiếm giơ cao, mây rách thành vệt. Tốc độ tối đa của tâm trí biến thành hành động.',
    symbols:
      'Hiệp sĩ rạp mình trên lưng ngựa phi nước đại, kiếm giơ chéo trời, áo choàng và bờm ngựa bạt về sau: tốc độ chiếm trọn khung hình. Chạy ngược chiều gió — cây cối ngả một đằng, người phi một nẻo: năng lượng này không đợi thuận chiều mới đi. Mây rách thành vệt, chim tán loạn: khi tâm trí quyết ở tốc độ này, khung cảnh xung quanh chỉ còn là vệt nhòe — sức mạnh và điểm mù nằm cùng một chỗ.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Hiệp Sĩ là hành động ở thái cực; chất Kiếm là tư duy, lời nói. Ghép lại: ý nghĩ biến thẳng thành hành động không qua trạm kiểm — sức phá trì trệ lớn nhất bộ bài, độ sát thương phụ cũng vậy. Có thể là người quyết liệt quanh bạn, hoặc cơn sốt ruột chính đáng của bạn lúc này.',
    up: 'Hiệp Sĩ Kiếm là cú xung phong của lý trí: thấy rõ việc phải làm và làm ngay, nói rõ điều phải nói và nói thẳng. Khi cần ai đó phá vỡ trì trệ, đặt vấn đề gai góc lên bàn, đẩy một việc kẹt lâu — đây là năng lượng đúng. Trì hoãn có chi phí; có những cánh cửa chỉ mở khi bị đạp. Năng lượng này dùng đúng nhất cho việc đã chín phân tích: mọi dữ kiện có rồi, chỉ thiếu người dám bấm nút. Khi đó, do dự mới là rủi ro, và cú xung phong là kết luận hợp lý chứ không phải liều.',
    rev: 'Ngược chiều: tốc độ thiếu vô lăng — quyết khi chưa đủ dữ kiện, gửi tin nhắn lúc đang sôi, cãi để thắng chứ không để đúng, và để lại sau lưng một loạt đổ vỡ "không cố ý". Chậm 24 giờ hiếm khi hỏng việc; nhanh 5 phút thì hỏng được khối thứ. Quy tắc hạ nhiệt cho người nhanh: mọi thứ viết lúc sôi được quyền viết — nhưng lưu nháp; gửi là việc của sáng mai. Chưa ai hối hận vì gửi trễ mười hai tiếng một bức thư giận.',
    love: 'Trong tình cảm: thẳng thắn là quý — nhưng nói thẳng KHÔNG đồng nghĩa nói phũ. Cùng một nội dung, cách nói quyết định người kia nghe được hay chỉ đỡ đòn. Kiểm tra nhanh trước cuộc nói thẳng: mục tiêu là để người kia hiểu, hay để mình xả? Hai mục tiêu cho hai kết cục khác hẳn nhau.',
    work: 'Trong công việc: hợp xử lý khủng hoảng, chốt việc tồn đọng. Luật tự đặt: email/tin nhắn viết lúc giận — để ngăn nháp tới sáng mai. Người phá kẹt giỏi nên tự biết mình không phải người giữ nhịp giỏi: xử xong khủng hoảng, trả việc về cho người vận hành; ở lại quá lâu, cùng một năng lượng từ thuốc thành bệnh.',
    reflect: [
      'Việc gì đáng được bạn "xung phong" ngay tuần này — và việc gì bạn đang xung phong chỉ vì sốt ruột?',
      'Lần gần nhất sự nhanh của bạn phải trả giá — bài học còn nhớ không?',
    ],
  },
  {
    slug: 'queen-of-swords',
    name: 'Queen of Swords',
    name_vi: 'Hoàng Hậu Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 13,
    keyUp: ['nhìn rõ', 'ranh giới sắc', 'hỏi thẳng đáp thật'],
    keyRev: ['lạnh thành giáp', 'phán xét', 'cô lập bằng lý trí'],
    image:
      'Hoàng hậu ngồi nghiêng, kiếm dựng thẳng một tay, tay kia chìa ra như nói "trình bày đi — sự thật thôi". Gương mặt đã đi qua nhiều chuyện, không còn dễ bị ru.',
    symbols:
      'Hoàng hậu ngồi nghiêng trên ngai chạm hình bướm và thiên thần nhỏ — bướm là mô-típ của bộ Khí: tâm trí đã qua biến đổi mới đạt độ tỉnh này. Kiếm dựng thẳng đứng trong tay phải, tay trái chìa ra phía trước: một tay giữ chuẩn, một tay mời sự thật bước tới, không chặn ai. Mây tụ thấp dưới chân trời: bà ngồi cao hơn sương mù, không cao hơn con người. Gương mặt nhìn ngang, không cười không dọa: sự thật ở đây không cần trang trí.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Hoàng Hậu là làm chủ chất từ bên trong; chất Kiếm là tư duy, sự thật. Ghép lại: sự tỉnh táo đã nội hóa thành nhân cách — nhìn rõ, nói thật, ranh giới sắc mà không ác. Có thể là một người từng trải quanh bạn, hoặc phần lý trí đã trả học phí của chính bạn.',
    up: 'Hoàng Hậu Kiếm là sự tỉnh táo có học phí: từng đau nên nhìn rõ, từng bị ngọt lừa nên quý sự thật hơn lời êm. Bà đại diện cho kiểu giao tiếp đáng tin nhất — hỏi thẳng, đáp thật, ranh giới rõ, không úp mở. Quanh người như vậy, ai cũng biết mình đứng ở đâu; sự rõ ràng là một dạng tử tế bị đánh giá thấp. Kiểu giao tiếp này còn một tầng ít ai thấy: nó tiết kiệm cho người khác — không ai phải đoán ý, dò thái độ, đọc giữa dòng. Sống cạnh người rõ ràng, chi phí tinh thần thấp hẳn.',
    rev: 'Ngược chiều: sự sắc thành giáp — chữ "không" buông trước khi nghe hết, lý trí dùng làm hào nước cách người, mọi mềm yếu (của mình lẫn của người) bị xử như lỗi hệ thống. Kiếm để cắt sự dối, không phải cắt sự gần. Câu hỏi mở lại cánh cổng: lần gần nhất cho ai đó cơ hội giải thích trước khi kết luận là bao giờ? Người trước mặt không phải người cũ, và họ xứng đáng một phiên tòa riêng.',
    love: 'Trong tình cảm: tiêu chuẩn rõ và ranh giới sắc giúp bạn không sa vào quan hệ rẻ; chỉ canh đừng để hàng rào cao tới mức người thật lòng cũng không trèo nổi. Và nhớ chiều ngược lại: đòi sự thật mà không trao sự thật là hợp đồng một chiều — nói cả điều mình sợ, mình cần; đó là phần khó nói nhất, cũng là phần người thương chờ nghe nhất.',
    work: 'Trong công việc: hợp vai phản biện, rà soát, đàm phán. Một câu góp ý thật mà tử tế đáng giá hơn mười câu khen xã giao. Công thức góp ý kiểu Hoàng Hậu Kiếm: sự việc cụ thể, ảnh hưởng của nó, đề nghị rõ. Không vòng vo mở bài, không nhân tiện xử luôn chuyện cũ — một lần một việc, nói xong là xong.',
    reflect: [
      'Ranh giới nào của bạn đang bảo vệ bạn — ranh giới nào đang giam bạn?',
      'Bạn đòi sự thật từ người khác — bạn có cho người khác sự thật về cảm xúc của mình không?',
    ],
  },
  {
    slug: 'king-of-swords',
    name: 'King of Swords',
    name_vi: 'Vua Kiếm',
    arcana: 'minor',
    suit_vi: 'Kiếm',
    number: 14,
    keyUp: ['phán đoán khách quan', 'nguyên tắc', 'quyết bằng tiêu chí'],
    keyRev: ['cứng lý bỏ tình', 'lạm dụng lập luận', 'lạnh quyền uy'],
    image:
      'Vị vua ngồi chính diện — hiếm hoi trong bộ bài — kiếm hơi nghiêng, mắt nhìn thẳng người đối diện. Tư thế của người ra phán quyết và chịu trách nhiệm về nó.',
    symbols:
      'Vị vua ngồi chính diện, nhìn thẳng người đối diện — góc ngồi hiếm trong bộ bài: phán quyết không né ánh mắt ai. Kiếm trong tay hơi nghiêng, không dựng thẳng tuyệt đối như của Hoàng Hậu: luật có chỗ cho cân nhắc. Ngai chạm hình bướm — mô-típ tâm trí biến đổi của bộ Khí — và hai cánh chim trên nền trời: tầm nhìn từ trên cao. Áo trong xanh dương, áo choàng tím: lý trí khoác ngoài, chiều sâu ở lớp trong.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Vua là làm chủ chất hướng ra ngoài; chất Kiếm là tư duy, phán đoán. Ghép lại: lý trí thành thẩm quyền công khai — đặt chuẩn, phân xử, chịu trách nhiệm về phán quyết. Có thể là người cầm cân quanh bạn, hoặc vai trọng tài mà một quyết định lớn đang đòi bạn đóng.',
    up: 'Vua Kiếm là chuẩn mực của quyết định lý trí: đặt tiêu chí trước khi nhìn phương án, nghe đủ các bên, quyết theo nguyên tắc chứ không theo người quen. Lá này gợi lúc cần bạn đứng vai trọng tài cho chính đời mình — tiền bạc, pháp lý, chọn hướng lớn: cảm xúc được lắng nghe, nhưng không được cầm bút ký. Trình tự đúng của quyết định hệ trọng: tiêu chí viết trước, phương án xếp sau, cảm giác kiểm tra cuối cùng. Đảo ngược trình tự — chọn trước rồi tìm lý — là lỗi phổ biến nhất của người thông minh.',
    rev: 'Ngược chiều: nguyên tắc thành nhà đá — đúng quy trình mà mất con người, thắng lý mà thua sạch tình; hoặc trí tuệ bị dùng để áp đảo ("nói không lại tôi nghĩa là tôi đúng"). Người giỏi lập luận nhất phòng họp chưa chắc là người đúng nhất — chỉ là người khó bị cãi nhất. Thắng mọi cuộc tranh luận trong nhà là một loại thua toàn cục: người kia thôi tranh luận, rồi thôi kể, rồi thôi hỏi. Sự im lặng quanh người giỏi lý là cái giá chậm mà chắc.',
    love: 'Trong tình cảm: sự vững và rạch ròi của bạn là chỗ dựa; nhưng người thương cần được nghe bằng tim trước khi được phân xử bằng đầu. Có những cuộc nói chuyện không cần phán quyết, chỉ cần ngồi cạnh. Một câu đáng học thuộc: "anh chưa cần đưa giải pháp, anh nghe đây" — nhiều khi người thương chỉ cần thẩm phán bước xuống ghế, ngồi cạnh mình ở băng ghế dài.',
    work: 'Trong công việc: hợp vai quyết định lớn, xử tranh chấp, đặt chuẩn. Công khai tiêu chí trước — quyền lực minh bạch thì bền. Công bố tiêu chí trước còn một lợi ích ngầm: nó bảo vệ chính bạn khỏi nghi ngờ thiên vị; quyền lực minh bạch ít bị thách thức hơn quyền lực bí ẩn.',
    reflect: [
      'Quyết định nào bạn sắp đưa ra — tiêu chí của nó đã được viết xuống trước, hay đang được nắn theo kết quả muốn có?',
      'Ở đâu bạn đang "đúng quy trình" mà lạnh dần với người?',
    ],
  },

// ============ TIỀN (Pentacles) — đất: công việc, vật chất, sức khỏe ============
  {
    slug: 'ace-of-pentacles',
    name: 'Ace of Pentacles',
    name_vi: 'Át Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 1,
    keyUp: ['cơ hội thật', 'hạt giống vật chất', 'khởi đầu vững'],
    keyRev: ['cơ hội vuột', 'kế hoạch thiếu rễ'],
    image:
      'Bàn tay từ mây nâng đồng tiền vàng trên khu vườn xanh, lối đi xuyên cổng hoa dẫn về phía núi. Cơ hội ở dạng cụ thể nhất — cầm được, trồng được.',
    symbols:
      'Bàn tay từ mây nâng đồng tiền vàng khắc ngôi sao năm cánh: cơ hội của bộ Đất hiện ra ở dạng cầm nắm được. Bên dưới là khu vườn được chăm, hàng giậu hoa trắng, lối đi xuyên cổng vòm lá dẫn về rặng núi: của cải trong hệ RWS luôn đặt giữa khung cảnh vun trồng — có đất, có lối, có đường xa. Cơ hội được trao, nhưng cổng vòm nhắc: nhận rồi vẫn phải tự bước tiếp.',
    storyArc:
      'Điểm khởi phát của cốt truyện Tiền: hạt mầm thuần khiết nhất của Đất — một cơ hội vật chất có thật, chưa thành hình hài gì. Cốt truyện bộ này dài hơi nhất: từ hạt giống hôm nay, qua tung hứng, thiếu hụt, rèn nghề, tới di sản nhiều thế hệ ở lá Mười. Mọi thứ bắt đầu bằng việc trồng nó xuống.',
    up: 'Át Tiền là hạt giống của thế giới vật chất: một lời mời việc, một khoản để dành đầu tiên, một khách hàng đầu tiên, một nền móng sức khỏe mới (giấc ngủ, buổi tập đầu). Khác Át Gậy bốc lửa, Át Tiền nói giọng của đất: cơ hội này THẬT — và như mọi hạt giống thật, nó cần được trồng xuống chứ không phải được ngắm. Một bước cụ thể tuần này đáng giá hơn một kế hoạch đẹp tháng sau. Đặc điểm của cơ hội kiểu Đất: nó không giục — không ai đếm ngược, không khan hiếm ồn ào. Vì không giục nên nó dễ bị hoãn; và hoãn chính là cách phổ biến nhất người ta đánh mất nó.',
    rev: 'Ngược chiều: hạt giống nằm mãi trên bàn — cơ hội đến rồi nguội vì chần chừ, hoặc kế hoạch tài chính/sự nghiệp nghe hay mà không bám đất (số liệu đâu, khách đâu, ai trả tiền?). Mơ không có rễ thì gió nhẹ cũng bay. Bài kiểm tra độ bám đất cho mọi kế hoạch: khách đầu tiên là ai, tiền đầu tiên từ đâu, bước làm được trong bảy ngày tới là gì. Ba câu trả lời cụ thể là rễ; thiếu chúng, kế hoạch hay mấy cũng chỉ là lá.',
    love: 'Trong tình cảm: giai đoạn xây nền thực tế — minh bạch chuyện tiền, thói quen sống, nhịp sinh hoạt. Lãng mạn bền đứng trên nền móng chứ không thay nền móng. Chuyện tiền nói với nhau càng sớm càng nhẹ; cãi nhau về tiền sau này mới là thứ ăn mòn lãng mạn, không phải cuộc trò chuyện sớm về nó.',
    work: 'Trong công việc: lời mời/dự án/nguồn thu mới đáng nắm. Trước khi gật: viết ra con số thật và bước đầu tiên cụ thể. Cơ hội thật thường trông nhỏ hơn cơ hội ảo: một khách đầu tiên trả giá thấp vẫn quý hơn mười lời hứa hợp tác lớn. Cái nhỏ mà thật thì nhân lên được; cái to mà ảo thì chỉ tan ra.',
    reflect: [
      'Cơ hội cụ thể nào đang nằm trên bàn bạn — bước "trồng xuống" nhỏ nhất là gì?',
      'Trong các dự định, cái nào có rễ (số liệu, người thật, tiền thật) — cái nào mới chỉ có lá?',
    ],
  },
  {
    slug: 'two-of-pentacles',
    name: 'Two of Pentacles',
    name_vi: 'Hai Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 2,
    keyUp: ['tung hứng nhiều vai', 'linh hoạt', 'giữ nhịp dòng tiền'],
    keyRev: ['quá tải đa nhiệm', 'rơi bóng', 'cần chọn ưu tiên'],
    image:
      'Người trẻ nhún nhảy tung hứng hai đồng tiền nối nhau bằng dải lụa hình số 8 vô cực; sau lưng, hai con thuyền cưỡi sóng lớn. Giữ thăng bằng — trong chuyển động, không phải trong đứng yên.',
    symbols:
      'Người trẻ đứng nhún theo nhịp, hai đồng tiền trong hai tay nối bằng dải lụa uốn hình số tám nằm ngang — ký hiệu vô cực: việc tung hứng của đời thường không có ngày kết thúc, chỉ có nhịp tốt hay xấu. Sau lưng, hai con thuyền cưỡi sóng cao: bối cảnh vốn không lặng, thăng bằng phải tìm trong chuyển động. Bộ trang phục sặc sỡ kiểu nghệ sĩ diễn trò: giữ được nhịp còn cần cả sự khôi hài.',
    storyArc:
      'Bước hai của cốt truyện Tiền: cân bằng đôi. Hạt giống ở Át đã thành việc thật, và việc thật lập tức sinh đôi: việc cũ với việc mới, thu với chi, làm với sống. Số 2 của bộ Đất không đứng yên như thế cân của bộ Kiếm — nó là thăng bằng động, giữ bằng nhịp. Ổn nhịp rồi mới hợp tác được ở Ba Tiền.',
    up: 'Hai Tiền là nghệ thuật tung hứng của đời thường: việc chính và việc phụ, công việc và gia đình, khoản thu và khoản chi. Lá này công nhận: bận kiểu này là bình thường, và thăng bằng không phải trạng thái tĩnh mà là điều chỉnh liên tục — như người trên thuyền giữa sóng. Bí quyết của nó: đừng cố giữ mọi quả bóng cùng độ cao; biết quả nào bằng thủy tinh, quả nào bằng cao su. Nhịp tốt có cấu trúc: mỗi vai một khung giờ riêng, các khung không giẫm nhau. Khổ nhất không phải người nhiều việc, mà người để mọi việc chạy cùng lúc trong đầu.',
    rev: 'Ngược chiều: số quả bóng đã vượt số tay — deadline chồng, hẹn quên, tiền lệch sổ. Đây không phải lỗi đạo đức, chỉ là toán học: thứ gì cũng ưu tiên nghĩa là không thứ gì ưu tiên. Hạ một quả bóng xuống một cách CÓ CHỦ ĐÍCH trước khi nó tự rơi. Ba dấu hiệu sắp rơi bóng: quên hẹn nhỏ, trả lời tin nhắn trong đầu rồi tưởng đã trả lời thật, và hai tuần liền không còn buổi tối nào trống. Thấy đủ ba, hạ một quả ngay tuần này.',
    love: 'Trong tình cảm: người yêu/bạn đời không nên thường trực là "quả bóng cao su" — thứ luôn bị hoãn vì "đợt này bận". Vài đợt-này nối nhau là một năm. Câu nói cứu được nhiều mối quan hệ của người bận: "tối thứ năm là của em, cố định, không dời". Một khung giờ nhỏ mà chắc thắng mười lời hứa bù đắp.',
    work: 'Trong công việc: viết hết các vai đang gánh ra giấy, đánh dấu 2 quả thủy tinh. Lịch của tuần phải nhìn thấy 2 quả đó trước. Khi được giao thêm việc, câu trả lời chuyên nghiệp không phải "vâng" hay "không" mà là: "được, vậy trong các việc đang chạy, việc nào lùi lại?" — trả bài toán ưu tiên về đúng người có quyền xếp.',
    reflect: [
      'Quả bóng nào của bạn là thủy tinh mà đang bị tung như cao su?',
      'Việc gì bạn nên CHỦ ĐỘNG đặt xuống tuần này, trước khi nó tự rơi?',
    ],
  },
  {
    slug: 'three-of-pentacles',
    name: 'Three of Pentacles',
    name_vi: 'Ba Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 3,
    keyUp: ['tay nghề được nhìn nhận', 'cộng tác chất lượng', 'mỗi người một vai'],
    keyRev: ['lệch vai', 'ôm hết một mình', 'làm cho xong'],
    image:
      'Trong nhà thờ đang xây, người thợ trẻ đứng trên ghế trao đổi với tu sĩ và kiến trúc sư cầm bản vẽ. Ba người ba nghề — cùng một công trình.',
    symbols:
      'Ba con người trong một nhà thờ đang xây: người thợ trẻ đứng trên ghế dở tay việc, tu sĩ và người cầm bản vẽ đối diện — tay nghề, mục đích và thiết kế cùng có mặt. Ba đồng tiền khắc trên vòm đá phía trên đầu: thành quả chung nằm cao hơn cả ba, không của riêng ai. Người thợ trẻ nhất nhưng đứng cao nhất trong tranh: trong cuộc hợp tác tử tế, người làm được việc được nâng lên, bất kể tuổi và vai.',
    storyArc:
      'Bước ba của cốt truyện Tiền: thành hình bước đầu qua hợp tác. Số 3 ở mọi chất là mở rộng; ở bộ Đất, nó cụ thể thành công trình chung — tay nghề cá nhân lần đầu ghép vào việc lớn hơn mình. Học được cách giữ vai ở đây, Bốn Tiền sẽ thử tiếp bằng câu hỏi: giữ thành quả thế nào cho khỏi thành khư khư.',
    up: 'Ba Tiền là khoảnh khắc tay nghề gặp đúng sân: việc bạn làm tốt được người khác cần đến, và công trình lớn hơn sức một người bắt đầu thành hình nhờ mỗi người giữ đúng vai. Lá này đề cao một thứ ít được khen: sự chuyên nghiệp — đến đúng giờ, làm đúng cam kết, hỏi khi chưa rõ. Đội tốt không phải đội toàn sao; là đội mà bản vẽ, viên gạch và lời cầu nguyện chịu nói chuyện với nhau. Sự chuyên nghiệp có một định nghĩa gọn: làm cho người khác lên kế hoạch được dựa trên mình — báo sớm khi trễ cũng nằm trong đó.',
    rev: 'Ngược chiều: công trình trục trặc vì vai lệch — người giỏi bị xếp sai chỗ, kẻ ôm hết việc vì "không tin ai", phối hợp toàn hiểu lầm vì chẳng ai chịu hỏi lại. Hoặc chính bạn đang làm-cho-xong một việc xứng đáng được làm-cho-tới. Ôm hết việc có một cái giá khuất: người khác thôi cố gắng, vì đằng nào cũng bị làm lại. Vòng xoáy này chỉ cắt được bằng một lần dám giao kèm hướng dẫn tử tế.',
    love: 'Trong tình cảm: một mái nhà cũng là công trình ba bên — hai người và bản vẽ chung. Phân vai theo sở trường, đừng theo khuôn "việc này phải của ai". Bản vẽ chung cần được xem lại định kỳ: con nhỏ, việc đổi, sức khác — phân vai từng hợp không có nghĩa mãi hợp. Mỗi năm một buổi ngồi lại là đủ.',
    work: 'Trong công việc: thời điểm tốt để nhận dự án chung, xin phản hồi từ người giỏi hơn, hoặc đứng ra điều phối. Tay nghề + phối hợp = hơn cả tài năng đơn lẻ. Xin phản hồi là kỹ năng tăng tốc rẻ nhất: mang sản phẩm cụ thể, hỏi câu cụ thể, cảm ơn bằng cách áp dụng thật. Người giỏi không tiếc lời khuyên với người biết dùng lời khuyên.',
    reflect: [
      'Trong "công trình" hiện tại của bạn, ai đang giữ vai gì — có vai nào đang lệch?',
      'Kỹ năng nào của bạn đáng được mang ra "công trình" lớn hơn thay vì chỉ dùng một mình?',
    ],
  },
  {
    slug: 'four-of-pentacles',
    name: 'Four of Pentacles',
    name_vi: 'Bốn Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 4,
    keyUp: ['giữ chắc', 'an toàn tài chính', 'ổn định có kiểm soát'],
    keyRev: ['khư khư', 'sợ mất đến tê liệt', 'nới tay'],
    image:
      'Người đàn ông ngồi ôm khư một đồng tiền trước ngực, một đồng đội trên đầu, hai đồng đè dưới hai bàn chân — phía sau là thành phố ông không còn bước vào được, vì tay chân đều bận giữ.',
    symbols:
      'Người đàn ông ngồi ôm khư đồng tiền trước ngực bằng cả hai tay, một đồng đội trên vương miện, hai đồng ghim dưới hai bàn chân: bốn đồng tiền khóa đúng bốn thứ — trái tim, cái đầu và hai bước chân. Thành phố phía sau lưng: cộng đồng, cơ hội, đời sống vẫn diễn ra, nhưng người giữ của không còn tay nào để chạm vào chúng. Tư thế ngồi vững như tượng: an toàn tuyệt đối, và bất động cũng tuyệt đối.',
    storyArc:
      'Bước bốn của cốt truyện Tiền: ổn định và giữ vững — số 4 đúng chất Đất nhất, nên cũng dễ quá liều nhất: giữ thành khư khư, vững thành bất động. Sau thành quả chung ở Ba Tiền, câu hỏi chuyển thành giữ bao nhiêu là đủ. Ngay sau đó, Năm Tiền là mùa thiếu hụt — lời nhắc rằng an toàn tuyệt đối không tồn tại.',
    up: 'Bốn Tiền là bản năng giữ: tiết kiệm, phòng thân, không tiêu hoang, giữ việc ổn định. Trong chừng mực, đây là trí khôn của đất — ai từng thiếu sẽ hiểu giá trị của một khoản đệm. Lá này xuất hiện để xác nhận nhu cầu an toàn của bạn là chính đáng… và để hỏi nhỏ một câu: giữ đến mức nào thì sự an toàn bắt đầu giữ ngược lại bạn? Khoản đệm nên có con số cụ thể: mấy tháng chi tiêu, bao nhiêu là chạm mức. Có con số, sự phòng thân là chiến lược; không có con số, nó thành cảm giác không-bao-giờ-đủ — và cảm giác đó không có đáy.',
    rev: 'Ngược chiều có hai cửa: hoặc bạn đang nới tay đúng lúc — dám chi cho học hành, sức khỏe, trải nghiệm, dám rời "việc ổn định" đã hết chỗ lớn; hoặc cơn sợ mất đang siết thêm — kiểm soát tiền của người thân, đếm đi đếm lại thứ không ai lấy. Tiền là công cụ; công cụ ôm trước ngực thì không dùng được. Phân biệt nới tay khôn với vung tay: khoản chi có làm tăng năng lực kiếm hoặc sức khỏe dài hạn không. Chi cho tài sản sinh lời khác hẳn chi cho cảm giác giàu.',
    love: 'Trong tình cảm: giữ người quá chặt — kiểm soát, ghen, "không cho đi đâu" — là cách chắc nhất để bóp nghẹt thứ mình sợ mất. Bàn tay mở giữ được nhiều hơn nắm đấm. Người từng thiếu thốn hay giữ người theo cách giữ của; nếu đó là bạn, nói thẳng với người thương gốc rễ nỗi sợ — được hiểu "vì sao anh hay lo mất" dễ chịu hơn nhiều so với bị siết mà không rõ lý do.',
    work: 'Trong công việc: phòng thủ tài chính tốt rồi thì câu hỏi kế tiếp là sinh lời và phát triển — tiền đứng yên là tiền teo dần theo trượt giá. Nghịch lý của phòng thủ áp dụng cho mọi thứ của bộ Đất: kỹ năng không dùng thì mòn, quan hệ không tưới thì nguội. Thứ gì không được gieo lại đều đang teo chậm — kể cả sự ổn định.',
    reflect: [
      'Bạn đang GIỮ thứ gì chặt nhất — và việc giữ đó đang tốn của bạn cơ hội nào?',
      'Khoản chi nào bạn luôn tiếc nhưng sâu xa biết là đáng (sức khỏe, học, quan hệ)?',
    ],
  },
  {
    slug: 'five-of-pentacles',
    name: 'Five of Pentacles',
    name_vi: 'Năm Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 5,
    keyUp: ['thiếu hụt', 'cảm giác bị bỏ ngoài', 'giai đoạn khó khăn'],
    keyRev: ['hồi phục', 'dám nhận giúp đỡ', 'cửa gần hơn mình nghĩ'],
    image:
      'Hai người rách rưới dắt nhau đi trong tuyết — một người chống nạng — ngang qua ô cửa kính nhà thờ sáng đèn ấm. Họ không nhìn thấy: cửa vào ở ngay gần.',
    symbols:
      'Hai người đi trong tuyết dưới ô cửa kính màu sáng đèn: một người chống nạng, một người choàng khăn rách — thiếu thốn trong tranh có đủ mặt: tiền, sức khỏe, hơi ấm. Ô cửa kính vẽ năm đồng tiền trên nhánh cây, phía trong là nơi có sẵn sự giúp đỡ — nhưng tranh không vẽ cánh cửa: người đi qua phải tự tìm lối vào, và họ đang cúi đầu bước thẳng. Tuyết dày nhưng chân họ vẫn bước: chưa ai dừng.',
    storyArc:
      'Bước năm của cốt truyện Tiền: thử thách giữa chặng — ở bộ Đất là mùa thiếu hụt theo nghĩa đen: tiền, sức, chỗ ấm. Sau sự đủ đầy khép kín của Bốn Tiền, số 5 lật mặt kia của vật chất. Chặng này không kéo dài mãi: Sáu Tiền ngay sau là dòng cho-nhận — với điều kiện người trong tuyết chịu gõ cửa.',
    up: 'Năm Tiền là mùa đông của vật chất: kẹt tiền, mất việc, sức khỏe xuống — và thứ buốt hơn cả là cảm giác bị bỏ lại bên ngoài, một mình. Lá này không phủ nhận cái khó; nó chỉ vào ô cửa sáng trong tranh: sự giúp đỡ thường gần hơn ta tưởng — người thân, bạn cũ, cộng đồng, chính sách — nhưng cửa không tự mở cho người nhất quyết đi qua trong im lặng. Nghèo một mùa không định nghĩa một đời. Mở miệng nhờ có kỹ thuật riêng: nói cụ thể mình cần gì, trong bao lâu, và mình đang tự làm gì song song. Lời nhờ kiểu đó là lời mời tham gia một kế hoạch đứng dậy — người tử tế nhận ra ngay sự khác biệt.',
    rev: 'Ngược chiều: tuyết đang tan — việc mới ló, nợ vơi dần, sức khỏe nhích lên; hoặc chính bạn vừa làm điều khó nhất: mở miệng nhờ. Hồi phục vật chất luôn chậm hơn mong muốn — nhưng đường cong đã đổi hướng là điều đáng ghi nhận. Trong giai đoạn hồi, kỷ luật quan trọng hơn tốc độ: trả nợ theo lịch dù món nhỏ, giữ một thói quen sức khỏe dù ngắn. Đường đi lên được xây bằng nhịp đều, không phải bằng vài cú may.',
    love: 'Trong tình cảm: khó khăn vật chất thử độ thật của một mối quan hệ — và cũng dễ sinh tự ti, xa cách. Nói thật tình cảnh với người bên cạnh; nghèo không nhục, giấu mới mệt. Phần lớn khoảng cách trong mùa nghèo không do thiếu tiền, mà do một người quyết định chịu lạnh một mình.',
    work: 'Trong công việc: giai đoạn hụt — đừng rút lui khỏi các mối quan hệ nghề nghiệp vì ngại; đa số việc mới đến qua một người quen biết mình đang cần. Danh sách "ô cửa sáng" nghề nghiệp đáng viết ra giấy: người từng làm cùng, hội nhóm nghề, chương trình hỗ trợ. Mười tin nhắn thật lòng vào danh sách đó hiệu quả hơn ba trăm hồ sơ rải vu vơ.',
    reflect: [
      '"Ô cửa sáng" nào đang ở gần mà bạn chưa gõ — vì ngại, vì sĩ diện, hay vì nghĩ mình không xứng?',
      'Nếu bạn của bạn ở đúng tình cảnh này, bạn sẽ bảo họ làm gì đầu tiên?',
    ],
    ease:
      'Lá này mô tả một GIAI ĐOẠN thiếu hụt, không phải lời phán "số nghèo". Không có nghi lễ nào đổi được dòng tiền; thứ đổi được nó là thời gian, sự giúp đỡ và vài quyết định — và cả ba đều ở phía cửa, không ở phía tuyết.',
  },
  {
    slug: 'six-of-pentacles',
    name: 'Six of Pentacles',
    name_vi: 'Sáu Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 6,
    keyUp: ['cho và nhận', 'hào phóng có cân', 'dòng chảy công bằng'],
    keyRev: ['cho kèm dây trói', 'nhận kèm ơn nặng', 'lệch quyền lực'],
    image:
      'Thương nhân một tay cầm cân, tay kia thả tiền cho một trong hai người quỳ xin. Lòng tốt — được đặt cạnh một chiếc cân.',
    symbols:
      'Thương nhân đứng giữa, tay phải thả những đồng xu cho một trong hai người quỳ, tay trái cầm chiếc cân đĩa thăng bằng: lòng tốt và sự đo lường trong cùng một người — cho cũng cần công bằng. Hai người quỳ cùng chìa tay, nhưng chỉ một người đang được cho; tranh giữ nguyên sự bất đối xứng đó như một câu hỏi. Thế đứng-quỳ chênh nhau rõ rệt: dòng cho-nhận luôn kèm chênh lệch quyền lực — nhìn thấy nó là bước đầu để không lạm nó.',
    storyArc:
      'Bước sáu của cốt truyện Tiền: hồi phục và cho-nhận. Số 6 ở mọi chất là hài hòa lại; ở bộ Đất, sự hài hòa mang hình dòng chảy vật chất — người qua mùa tuyết của Năm Tiền giờ đứng ở đầu kia, học cách cho. Dòng chảy thông rồi mới tới phút đứng lặng đánh giá vụ mùa ở Bảy Tiền.',
    up: 'Sáu Tiền là dòng chảy cho–nhận: lúc dư giúp người, lúc ngặt được giúp — và cả hai vai đều cần học. Cho đúng cách (đúng người, đúng lúc, không kể công) là một kỹ năng; nhận một cách đàng hoàng (biết ơn mà không quỵ lụy) là kỹ năng khó hơn. Lá này nhắc: hôm nay bạn ở đầu nào của dòng chảy không quan trọng bằng việc dòng chảy còn thông. Cho đúng cách còn gồm cho đúng thứ: đôi khi người ta cần một lời giới thiệu, một buổi chỉ việc, một cơ hội được tin — hơn là tiền. Món quà tốt nhất làm người nhận mạnh lên, không làm họ cần mình thêm.',
    rev: 'Ngược chiều: chiếc cân lệch — món quà kèm dây điều khiển ("tôi cho anh thì anh phải…"), khoản giúp thành món nợ ơn trả mãi không hết, hoặc cho để được thấy mình cao hơn. Cũng có khi là phía bạn: cho đi để mua sự công nhận, hoặc nhận mãi thành quen. Lòng tốt có điều kiện là một hợp đồng trá hình. Phép thử món quà sạch: nếu người nhận không bao giờ trả lại được và không ai biết, mình còn muốn cho không? Trả lời thật, chiếc cân trong tay tự thẳng lại.',
    love: 'Trong tình cảm: để ý cán cân quyền lực — ai luôn là người "ban", ai luôn là người "chịu ơn"? Quan hệ khỏe là nơi cả hai thay phiên được yếu. Sổ ghi ơn là thuốc độc chậm của đời sống chung: "anh đã vì em mà..." lặp đủ nhiều thì tình thành nợ. Cho nhau rồi quên đi được mới là cho.',
    work: 'Trong công việc: trả công xứng đáng, chia quyền lợi rõ, mentor người sau. Sự hào phóng đúng chỗ là khoản đầu tư lãi dài nhất. Mentor người sau có một luật ngầm công bằng: truyền lại thứ mình từng được nhận, cộng thêm một chút. Chuỗi cho-nhận kiểu đó là quỹ uy tín của cả một đời nghề.',
    reflect: [
      'Bạn cho đi dễ hơn hay nhận về dễ hơn — và điều đó nói gì về bạn?',
      'Món "quà" nào bạn từng cho/nhận mà kèm dây — giờ gỡ được không?',
    ],
  },
  {
    slug: 'seven-of-pentacles',
    name: 'Seven of Pentacles',
    name_vi: 'Bảy Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 7,
    keyUp: ['chờ vụ chín', 'đánh giá lại đầu tư', 'kiên nhẫn có tính toán'],
    keyRev: ['sốt ruột nhổ cây', 'tưới chỗ không ra quả'],
    image:
      'Người làm vườn tựa cằm lên cán cuốc, đứng lặng nhìn giàn cây trĩu bảy đồng tiền. Không hái, không cuốc — đang ĐÁNH GIÁ.',
    symbols:
      'Người làm vườn tựa cằm lên cán cuốc, đứng lặng nhìn giàn cây nơi bảy đồng tiền đang lớn như trái: tư thế nghỉ tay giữa vụ — không hái, không cuốc, chỉ nhìn. Cây trĩu quả nhưng chưa trái nào rời cành: thành quả có thật mà chưa dùng được, đúng cái lửng lơ của mọi khoản đầu tư giữa chừng. Gương mặt trầm ngâm không vui không buồn: đánh giá tử tế cần đúng khoảng cách đó — đủ gần để thấy, đủ lạnh để đếm.',
    storyArc:
      'Bước bảy của cốt truyện Tiền: chặng đánh giá. Số 7 ở mọi chất là kiên trì và chọn lựa khó; ở bộ Đất, nó thành buổi kiểm kê giữa vụ — tiếp tục tưới hay dồn đất cho cây khác. Quyết xong mới vào được giai đoạn rèn sâu của Tám Tiền: chọn đúng cây rồi, mỗi nhát cuốc sau đó mới đáng.',
    up: 'Bảy Tiền là phút đứng lặng của nhà đầu tư (tiền, công sức, năm tháng): cây đã trồng, quả đang lớn — giờ là lúc hỏi câu lạnh lùng: vụ này có đáng tiếp không? Lá này quý ở sự trung thực giữa chừng: kiên nhẫn là đức tính, nhưng kiên nhẫn với đúng cây; còn đứng đợi quả ở cây không ra quả thì gọi là lãng phí có kỷ luật. Nhìn số liệu, không nhìn hy vọng. Buổi đứng tựa cuốc nên có ba con số: đã bỏ vào bao nhiêu, đang ra bao nhiêu, xu hướng ba tháng gần nhất. Xu hướng quan trọng hơn mức: cây đang lớn dù còn nhỏ khác hẳn cây to mà ngừng lớn.',
    rev: 'Ngược chiều: hoặc sốt ruột nhổ cây lên xem rễ (kiểm tra liên tục, đổi kế hoạch mỗi tuần — cây nào sống nổi), hoặc nhận ra mình đã tưới quá lâu một mảnh đất cằn vì tiếc công đã đổ. Công đã đổ không quay lại được; chỉ chọn được nơi đổ công tiếp theo. Tiếc công là cái bẫy tâm lý kinh điển: công cũ không được phép có phiếu bầu. Câu hỏi duy nhất hợp lệ: từ hôm nay, đồng công kế tiếp đặt đâu thì đáng nhất.',
    love: 'Trong tình cảm: mối quan hệ cũng có mùa vụ — có giai đoạn chỉ thấy chăm mà chưa thấy ngọt. Đánh giá bằng hướng đi (có lớn dần không) chứ không bằng một tuần xấu trời. Thước đo đúng cho mùa chăm-chưa-ngọt: mình có đang lớn lên cạnh người này không — thay vì mình có đang vui mỗi ngày không. Hai thước cho hai kết luận rất khác.',
    work: 'Trong công việc: dự án/kỹ năng/kênh nào đầu tư mãi chưa ra số? Đặt một mốc kiểm: thêm X tháng với tiêu chí Y — đạt thì tiếp, không thì dồn đất cho cây khác. Mốc kiểm nên đặt trước khi bắt đầu, không phải khi đã nản: viết lúc đầu vụ là cam kết, viết lúc giữa vụ dễ thành lý do rút được ngụy trang.',
    reflect: [
      'Khoản đầu tư công sức nào của bạn đáng một buổi "đứng tựa cuốc" đánh giá thật lạnh?',
      'Bạn đang kiên nhẫn với cây có quả non — hay đang tiếc công với đất cằn?',
    ],
  },
  {
    slug: 'eight-of-pentacles',
    name: 'Eight of Pentacles',
    name_vi: 'Tám Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 8,
    keyUp: ['mài giũa tay nghề', 'chuyên tâm', 'lặp lại có chủ đích'],
    keyRev: ['làm máy móc mất hồn', 'đứt mạch rèn luyện'],
    image:
      'Người thợ trẻ ngồi khắc đồng tiền thứ tám, sáu đồng đã xong treo trên cột và một đồng đặt dưới đất; thành phố mờ phía xa — anh quay lưng lại với nó để ngồi đây khắc.',
    symbols:
      'Người thợ ngồi trên ghế dài, đục từng nét lên đồng tiền thứ tám; sáu đồng đã hoàn thiện treo thẳng hàng trên cột gỗ, một đồng chờ dưới chân: quá trình được bày ra theo đúng nghĩa đen — cái đã xong, cái đang làm, cái sắp tới. Thành phố mờ phía chân trời sau lưng: phần thưởng và danh tiếng có đó, nhưng người thợ quay lưng lại với nó để nhìn vào nét đục. Sự tập trung trong tranh im như tờ: nghề được rèn trong im lặng.',
    storyArc:
      'Bước tám của cốt truyện Tiền: chuyên cần — sắc thái số 8 riêng của bộ Đất, khác cú tăng tốc của Gậy hay cuộc rời đi của Cốc. Sau khi chọn đúng cây ở Bảy Tiền, đây là giai đoạn cúi đầu rèn: lặp có chủ đích, mỗi lần khá hơn một li. Thành quả tự chủ của Chín Tiền được đúc chính ở những giờ này.',
    up: 'Tám Tiền là lá của giờ-bay: tay nghề không đến từ tài năng trời cho mà từ con số lần lặp có chủ đích — khắc xong một đồng, treo lên, khắc tiếp đồng sau tốt hơn một li. Lá này gợi giai đoạn cúi đầu luyện: học sâu một kỹ năng, làm đi làm lại một dạng việc tới mức thành phản xạ. Thành phố (danh tiếng, cơ hội) ở phía xa kia sẽ tự tìm đến người có tám đồng tiền khắc đẹp treo trên cột. Lặp có chủ đích khác lặp thường ở một điểm: mỗi lần làm đều có một thứ cụ thể muốn khá hơn. Kinh nghiệm không tự cộng dồn theo thâm niên.',
    rev: 'Ngược chiều: sự lặp mất chữ "chủ đích" — làm như máy, mười năm kinh nghiệm thực ra là một năm lặp mười lần; hoặc mạch rèn đứt giữa chừng vì hết kiên nhẫn với đoạn "chưa giỏi". Đoạn xấu hổ giữa người-mới và người-giỏi là đoạn ai cũng phải bò qua — không có đường vòng. Một sự thật an ủi cho đoạn đó: cảm giác mình làm dở chính là dấu hiệu con mắt đã giỏi hơn đôi tay. Khoảng chênh ấy là động cơ, không phải bản án; người bỏ cuộc thường bỏ ngay trước khúc tay bắt kịp mắt.',
    love: 'Trong tình cảm: yêu lâu cũng là một tay nghề — lắng nghe, xin lỗi, làm lành đều giỏi lên nhờ luyện. Đừng mong "tự nhiên hợp"; hãy luyện thành hợp. Cặp nào giỏi làm lành, cặp đó sống thọ — và giỏi là do luyện, không do hên.',
    work: 'Trong công việc: chọn MỘT kỹ năng đòn bẩy và đặt lịch luyện đều (30–60 phút/ngày thắng 8 tiếng/cuối tuần). Giỏi một thứ sâu mở nhiều cửa hơn biết mười thứ nông. Chọn kỹ năng đòn bẩy bằng hai câu hỏi: việc gì mình làm mà người khác hay nhờ, và thị trường trả giá tăng dần cho việc gì? Giao của hai đường đó là chỗ đáng đặt ba mươi phút mỗi ngày.',
    reflect: [
      'Kỹ năng nào nếu giỏi hơn 2 bậc sẽ đổi hẳn đời bạn — và lịch luyện nó đâu?',
      'Việc lặp lại hằng ngày của bạn: đang là luyện có chủ đích, hay là chạy máy?',
    ],
  },
  {
    slug: 'nine-of-pentacles',
    name: 'Nine of Pentacles',
    name_vi: 'Chín Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 9,
    keyUp: ['tự chủ', 'thành quả tự thân', 'tận hưởng một mình đàng hoàng'],
    keyRev: ['thành quả mà cô lập', 'phụ thuộc dán mác tự do'],
    image:
      'Người phụ nữ áo thêu hoa đứng giữa vườn nho trĩu quả của chính mình, chim ưng đậu trên găng tay — biểu tượng của bản năng đã được thuần. Sự sung túc — và một mình — mà đầy đặn.',
    symbols:
      'Người phụ nữ áo dài thêu hoa đứng một mình giữa vườn nho trĩu quả, chín đồng tiền lẫn trong tán lá: sự sung túc ở đây là cây nhà lá vườn, không phải của được tặng. Chim ưng đội mũ trùm đậu yên trên găng tay: bản năng mạnh được huấn luyện đến mức đậu yên theo ý chủ — tự do của lá này có kỷ luật làm xương sống. Con ốc sên nhỏ dưới chân tranh: thứ xây chậm mà chắc, đúng nhịp của cả khu vườn.',
    storyArc:
      'Bước chín của cốt truyện Tiền: gần trọn — đỉnh phần cá nhân của bộ Đất: kỷ luật những ngày Tám Tiền đã thành khu vườn tự nuôi được chủ. Số 9 là toại nguyện kiểu vật chất: tự chủ, một mình mà đầy. Bước cuối còn lại — Mười Tiền — sẽ hỏi tiếp: khu vườn này để lại gì cho người sau.',
    up: 'Chín Tiền là phần thưởng của kỷ luật dài hạn: cuộc sống tự chủ — tiền mình kiếm, vườn mình trồng, thời gian mình quyết — và khả năng tận hưởng nó một mình mà không thấy thiếu. Lá này tôn vinh một dạng giàu ít được nói tới: không cần ai chống lưng, không cần ai vỗ tay, vẫn sống đầy. Trước khi là "một nửa" của bất kỳ ai, hãy là một-người-nguyên-vẹn như thế này. Phép thử ngày thường của sự tự chủ: một buổi tối một mình không màn hình có dễ chịu không, một bữa ngon tự đãi có trọn vị không. Qua được phép thử đó, bạn bước vào mọi mối quan hệ với tư thế chọn, không phải tư thế cần.',
    rev: 'Ngược chiều: hoặc vườn đẹp mà chủ vườn cô đơn — thành công xây bằng cách cắt hết kết nối; hoặc vẻ "tự chủ" bên ngoài đang đứng trên nền phụ thuộc (tiêu trước trả sau, sống bằng hình ảnh). Tự do tài chính giả mạo là loại nợ đắt nhất. Nhận diện nó bằng một câu hỏi: nếu nguồn thu dừng ba tháng, lối sống này còn đứng không? Câu trả lời không cần kể ai nghe, nhưng chính mình phải biết.',
    love: 'Trong tình cảm: người hấp dẫn nhất là người không CẦN ai cứu — đến với nhau vì muốn, không vì thiếu. Nhưng tự chủ không có nghĩa là không cho ai vào vườn. Cửa vườn nên có then cài chứ đừng xây tường kín: cần người để chia không làm bạn kém độc lập đi.',
    work: 'Trong công việc: hái thành quả đã chín — và bảo vệ thứ làm ra nó: kỷ luật, chuẩn mực, lòng tự trọng nghề. Đừng hạ giá mình lúc đang được giá. Lúc đang được giá là lúc dễ phá giá nhất: nhận bừa việc dưới chuẩn vì nể, giảm giá vì ngại. Chuẩn mực giữ vững trong mùa tốt chính là thứ bảo kê cho mùa xấu.',
    reflect: [
      '"Khu vườn" bạn đang xây: mười năm nữa nó nuôi bạn được không, hay vẫn cần bạn còng lưng tưới?',
      'Bạn có dám tận hưởng một mình — một bữa ngon, một chuyến đi — mà không thấy cần ai chứng kiến?',
    ],
  },
  {
    slug: 'ten-of-pentacles',
    name: 'Ten of Pentacles',
    name_vi: 'Mười Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 10,
    keyUp: ['bền vững dài hạn', 'tài sản truyền đời', 'gốc rễ gia tộc'],
    keyRev: ['tranh chấp tài sản', 'bền ngoài rạn trong'],
    image:
      'Cụ già khoác áo thêu nho ngồi cùng đôi chó, đôi vợ chồng trẻ và đứa cháu dưới cổng vòm khắc gia huy; mười đồng tiền xếp thành Cây Sự Sống phủ lên toàn cảnh. Ba thế hệ trong một khung hình.',
    symbols:
      'Cụ già khoác áo thêu chùm nho ngồi bên rìa, hai con chó trắng dụi vào tay: người đã xong phần mình, giờ ngồi nhìn. Đôi vợ chồng trẻ trò chuyện dưới cổng vòm khắc gia huy, đứa trẻ níu bên cạnh: ba thế hệ, mỗi lớp một việc. Mười đồng tiền rải trên tranh theo sơ đồ Cây Sự Sống của truyền thống Kabbalah — lớp biểu tượng chìm hiếm hoi lộ rõ trong bộ Ẩn phụ: của cải khi đủ đầy nối vào một trật tự lớn hơn một đời người.',
    storyArc:
      'Bước mười, chặng cuối cốt truyện Tiền: trọn vẹn ở tầm dài nhất — hạt giống của Át, qua rèn giũa và tự chủ, giờ thành nền cho nhiều thế hệ. Số 10 ở đây đặt câu hỏi chín nhất của vật chất: thứ này còn lại gì khi mình không còn cầm nó. Vòng mới của một người khác sẽ bắt đầu từ chính nền này.',
    up: 'Mười Tiền là tầm nhìn dài hơn một đời: tài sản, nghề, nếp nhà, giá trị — những thứ được xây để truyền lại. Lá này kéo câu hỏi từ "tháng này dư bao nhiêu" lên "mình đang xây cái gì còn lại sau mình": căn nhà cho con, nghề truyền cho trò, quỹ học cho cháu, hay đơn giản là nếp sống tử tế mà thế hệ sau nhìn vào. Giàu một đời là giỏi; để lại nền cho nhiều đời là khôn. Di sản không chỉ là tài sản đứng tên: cách một nhà nói chuyện với nhau về tiền, thói quen làm việc tử tế, cả tấm gương dám xin lỗi — những thứ đó truyền qua quan sát, không qua công chứng, và bền hơn sổ đỏ.',
    rev: 'Ngược chiều: chính thứ "của để dành" thành mồi lửa — tranh chấp thừa kế, anh em sứt mẻ vì đất, hôn nhân tính bằng tài sản; hoặc gia tộc bề thế mà bên trong lạnh tanh. Của cải không có người tử tế đi kèm thì chỉ là kho thuốc nổ có sổ đỏ. Phòng tranh chấp rẻ hơn xử tranh chấp cả trăm lần: giấy tờ rõ khi còn khỏe, nói chuyện thừa kế khi chưa ai cần đến nó. Nhà nào coi đó là chuyện gở sẽ trả giá bằng đúng thứ định giữ: hòa khí.',
    love: 'Trong tình cảm: cưới nhau cũng là nhập hai "hệ gia đình" — nói chuyện sớm về tiền chung, trách nhiệm hai bên nội ngoại, kỳ vọng con cái. Không lãng mạn, nhưng cứu được rất nhiều lãng mạn về sau. Đi qua vài dịp giỗ tết cùng nhau trước khi cưới đáng giá hơn mười buổi hẹn đẹp.',
    work: 'Trong công việc: nghĩ hạ tầng — quỹ dự phòng, bảo hiểm, di chúc, hệ thống làm việc không phụ thuộc một người. Thứ bền là thứ chạy được khi bạn vắng mặt. Bài kiểm tra hệ thống bền: bạn nghỉ hai tuần không điện thoại, việc còn chạy không? Chưa chạy được thì thứ bạn có là công việc tự làm chủ, chưa phải cơ nghiệp.',
    reflect: [
      'Sau bạn, thứ gì còn lại — và bạn có đang xây nó một cách có chủ đích?',
      'Trong nhà bạn, chuyện tiền – đất – thừa kế: đã nói rõ với nhau, hay đang để "sau này tính"?',
    ],
  },
  {
    slug: 'page-of-pentacles',
    name: 'Page of Pentacles',
    name_vi: 'Thị Đồng Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 11,
    keyUp: ['ham học thực tế', 'mầm kế hoạch', 'bắt đầu từ việc nhỏ'],
    keyRev: ['mơ kế hoạch không bước đầu', 'học mãi không hành'],
    image:
      'Người trẻ đứng giữa đồng cỏ, nâng đồng tiền ngang tầm mắt ngắm nghía như ngắm một thế giới — phía xa là luống đất mới cày. Sự nghiêm túc đáng yêu của người mới bắt đầu.',
    symbols:
      'Người trẻ đứng giữa cánh đồng, hai tay nâng đồng tiền ngang tầm mắt, nhìn chăm chú như đọc sách: với bộ Đất, cả thế giới vật chất là giáo trình. Luống đất mới cày phía sau và rặng cây xa: bài học ở đây gắn với mùa vụ — học là để gieo. Bước chân đang đi mà mắt không rời đồng tiền: sự chăm chú của người mới có thể vấp, nhưng chính nó là thứ người cũ đánh mất trước tiên.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Thị Đồng là học việc, lần đầu chạm vào chất; chất Tiền là vật chất, thực tế. Ghép lại: người học nghề của thế giới thật — học để làm, chậm mà nghiêm túc. Có thể là một người trẻ cầu tiến quanh bạn, hoặc chính giai đoạn gieo hạt kiến thức của bạn lúc này.',
    up: 'Thị Đồng Tiền là tinh thần học-để-làm: đăng ký khóa học và làm bài tập thật, đọc sách kèm áp dụng, tập tành khoản đầu tư đầu tiên bằng số tiền nhỏ. Lá này gợi sự khởi đầu khiêm tốn mà chắc: ai cũng phải có "đồng tiền đầu tiên" — dự án đầu tay, khách đầu tiên, tháng lương đầu — và cách cầm đồng đầu tiên định hình cách cầm những đồng sau. Tỉ lệ vàng cho giai đoạn này: một phần học, một phần làm ngay điều vừa học. Sách đọc xong áp dụng trong tuần thì thành của mình; để sang tháng thì thành của tác giả mãi mãi.',
    rev: 'Ngược chiều: học thành trốn — sưu tầm khóa học, đánh dấu bài "để dành đọc", kế hoạch chi tiết tới mức không bao giờ tới ngày bắt đầu. Kiến thức chưa hành là hàng tồn kho; thêm nữa chỉ thêm chật. Sưu tầm khóa học là hình thức trì hoãn được xã hội khen ngợi — nguy hiểm chính ở chỗ đó. Quy tắc tự cứu: không mua khóa mới khi khóa cũ chưa xong bài tập cuối.',
    love: 'Trong tình cảm: giai đoạn tìm hiểu nghiêm túc, chậm mà thật. Đừng coi nhẹ những "bài học nhỏ": cách người ta đối xử với phục vụ bàn, cách giữ lời hứa vặt. Ai làm tốt bài nhỏ mới đáng được giao bài lớn — quy luật này đúng cả trong tình cảm.',
    work: 'Trong công việc: nhận việc nhỏ làm thật kỹ — người mới nổi bật bằng độ tin cậy trước khi nổi bật bằng tài. Hỏi nhiều, ghi chép, làm lại. Vòng lặp xây uy tín nhanh nhất: nhận việc nhỏ, làm kỹ hơn kỳ vọng, xin nhận xét, làm tốt hơn ở việc kế. Bốn nhịp đó lặp sáu tháng tạo ra thứ tài năng suông không mua được: sự tin cậy.',
    reflect: [
      'Thứ bạn đang học: bài tập THỰC HÀNH gần nhất bạn làm là gì, bao giờ?',
      '"Đồng tiền đầu tiên" nào bạn có thể kiếm/làm ra trong 30 ngày tới — nhỏ thôi, nhưng thật?',
    ],
  },
  {
    slug: 'knight-of-pentacles',
    name: 'Knight of Pentacles',
    name_vi: 'Hiệp Sĩ Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 12,
    keyUp: ['bền bỉ', 'chậm mà chắc', 'đáng tin cậy'],
    keyRev: ['ì trệ', 'cầu toàn hóa trì hoãn', 'chán việc lặp'],
    image:
      'Hiệp sĩ ngồi trên con ngựa cày đứng yên giữa ruộng đã vỡ luống, ngắm đồng tiền trên tay. Con ngựa duy nhất đứng yên trong bốn Hiệp Sĩ — vì việc của anh không cần phi, cần cày.',
    symbols:
      'Hiệp sĩ ngồi trên con ngựa cày đen đứng yên giữa cánh đồng đã vỡ luống — con ngựa duy nhất không di chuyển trong bốn Hiệp Sĩ: sức mạnh ở đây không phô bằng tốc độ mà bằng sức bền kéo cày. Đồng tiền đặt ngay ngắn trên tay, được ngắm chứ không được tung: người này không đánh bạc với thành quả. Nhánh lá sồi trên mũ giáp: sự chắc bền mọc chậm. Cánh đồng vỡ luống sau lưng: việc hôm qua làm xong thật.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Hiệp Sĩ là hành động — nhưng chất Tiền kéo hành động về thái cực chậm-chắc thay vì lao nhanh: đây là Hiệp Sĩ duy nhất tiến bằng nhịp đều. Ghép lại: sự bền bỉ thành người. Có thể là đồng đội đáng tin nhất của bạn, hoặc lời nhắc về nhịp cày cho việc bạn đang nóng ruột.',
    up: 'Hiệp Sĩ Tiền là người về đích kiểu nông dân: không cú nước rút nào ngoạn mục, chỉ là sáng nào cũng ra ruộng. Lá này tôn vinh thứ năng lực bị mạng xã hội bỏ quên: làm việc nhàm một cách xuất sắc, giữ lời một cách buồn tẻ, tiến 1% một ngày trong im lặng. Khi mọi người mải tìm đường tắt, người đi đường dài thẳng lại thành nhanh nhất. Sức mạnh của nhịp đều nằm ở chỗ nó miễn nhiễm với cảm hứng: ngày chán vẫn ra ruộng, ngày hăng cũng chỉ cày phần của ngày. Nhờ vậy đường đi tính trước được — và trong mọi kế hoạch dài, tính trước được quý hơn xuất sắc thất thường.',
    rev: 'Ngược chiều: chậm-mà-chắc rơi mất vế "chắc", còn lại chậm — quy trình thành lối mòn, cẩn thận thành lề mề, cầu toàn thành cớ hoãn ("chưa hoàn hảo nên chưa ra mắt"). Cũng có khi là cơn chán chính đáng của người làm mãi việc lặp: cày giỏi cũng cần thấy mùa gặt. Lối mòn nhận diện bằng câu hỏi: lần cuối mình đổi cách làm việc này là bao giờ? Quy trình tốt cũng cần được xét lại mỗi năm; sự cẩn thận không được xét lại sẽ hóa thạch thành sự ì.',
    love: 'Trong tình cảm: kiểu người không lãng mạn ồn ào nhưng có mặt mỗi-lần-cần. Nếu bạn đang được yêu kiểu này — đừng nhầm sự ổn định với sự nhạt; nếu bạn đang yêu kiểu này — thỉnh thoảng tặng một bất ngờ, ngựa cày cũng biết vui. Cần thêm lời ngọt? Nói thẳng mong muốn — họ làm được, chỉ là không tự nghĩ ra.',
    work: 'Trong công việc: hợp các việc cần độ tin tưởng dài — vận hành, chất lượng, tài chính. Đặt mốc "đủ tốt để giao" rõ ràng, kẻo cầu toàn ăn mất deadline. Cầu toàn có điểm hòa vốn: qua một mức, mỗi giờ đánh bóng thêm không tăng giá trị cho người dùng nữa. Định nghĩa "đủ tốt" bằng tiêu chí của người nhận, không phải bằng cảm giác an tâm của người làm.',
    reflect: [
      'Việc "nhàm mà quan trọng" nào bạn đang làm đều — và đã bao giờ tự ghi nhận mình vì nó?',
      'Ở đâu sự cẩn thận của bạn đang thành cái cớ để chưa bắt đầu/chưa ra mắt?',
    ],
  },
  {
    slug: 'queen-of-pentacles',
    name: 'Queen of Pentacles',
    name_vi: 'Hoàng Hậu Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 13,
    keyUp: ['chăm lo thiết thực', 'vun vén', 'ấm no có bàn tay người giữ'],
    keyRev: ['ôm việc nhà quên mình', 'lo vật chất quên hơi ấm'],
    image:
      'Hoàng hậu ngồi giữa vòm hoa trái, cúi nhìn đồng tiền trên lòng như nhìn một sinh linh cần chăm; chú thỏ nâu nhảy ở góc tranh. Sung túc ở đây có mùi cơm chín, không phải mùi két sắt.',
    symbols:
      'Hoàng hậu ngồi giữa vòm hoa hồng và cây trái, cúi đầu nhìn đồng tiền đặt trên lòng như nhìn một sinh linh cần chăm: của cải trong tay bà là thứ sống, cần vun, không phải thứ khóa két. Ngai chạm hình hoa trái; chú thỏ nâu nhảy ở góc tranh: sự sinh sôi hiện diện khắp khung hình. Giữa thiên nhiên um tùm, bà là lá hoàng gia gần đất nhất bộ bài: quyền uy của người biến đất thành cơm.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Hoàng Hậu là làm chủ chất từ bên trong; chất Tiền là vật chất, đời sống thật. Ghép lại: người nuôi cả một hệ sinh thái bằng sự vun vén — làm chủ vật chất để chăm người, không phải để đếm. Có thể là người giữ ấm trong nhà bạn, hoặc phần tự chăm lo mà bạn đang nợ chính mình.',
    up: 'Hoàng Hậu Tiền là người giữ ấm cả một hệ sinh thái: nhà có cơm nóng, sổ chi tiêu cân, người ốm có thuốc, khách đến có chỗ ngồi tử tế — và thường kiêm luôn việc kiếm ra tiền cho tất cả những thứ đó. Lá này gọi tên đúng một dạng tài năng hay bị gọi sai là "đảm đang vặt": biến nguồn lực hữu hạn thành đời sống đầy đặn là một nghề thực thụ, dù chẳng ai trao chức danh. Tài năng ấy nhận ra được bằng kết quả lặng lẽ của nó: cùng một khoản tiền, nhà này ấm hơn nhà kia; cùng một quỹ giờ, người này vẫn có bữa cơm tử tế.',
    rev: 'Ngược chiều: người giữ ấm cho cả nhà là người duy nhất không ai hỏi có lạnh không — chăm tất cả trừ chính mình, oán thầm tích dần dưới sự chu toàn; hoặc sự chăm lo trượt thành đo đếm vật chất ("đủ ăn đủ mặc là được") mà quên mất nhà cần cả hơi ấm phi vật chất. Tự chăm mình không phải ích kỷ; là bảo trì cái máy đang nuôi cả hệ. Oán thầm tích theo công thức: làm mà không được thấy, lâu dần thành làm mà không được hỏi. Đừng đợi đến lúc bùng — kê những việc vô hình mình đang gánh ra bàn khi chưa giận.',
    love: 'Trong tình cảm: đừng để một người mãi đóng vai "hậu cần" — thỉnh thoảng đổi vai: người được chăm đi chợ, người hay chăm được ngồi không một bữa. Đổi vai có tác dụng kép: người hay chăm được nghỉ, và người được chăm hiểu ra khối lượng thật của việc "tự nhiên có cơm ăn". Sự biết ơn cụ thể sinh ra từ trải nghiệm, không từ lời nhắc.',
    work: 'Trong công việc: hợp vai quản trị nguồn lực — ngân sách, vận hành, văn hóa "có người lo cho mình" trong nhóm. Định giá đúng công việc chăm sóc, của người khác và của chính mình. Các việc chăm sóc vô hình — đưa người mới vào guồng, giữ tinh thần, nhớ khách quen — nên được ghi vào mô tả công việc và kỳ đánh giá: thứ không được đo sẽ không được quý.',
    reflect: [
      'Ai đang là "Hoàng Hậu Tiền" trong nhà/nhóm của bạn — họ được chăm lại bằng gì?',
      'Nếu là bạn: tuần này bạn tự vun cho mình thứ gì — như cách bạn vẫn vun cho người khác?',
    ],
  },
  {
    slug: 'king-of-pentacles',
    name: 'King of Pentacles',
    name_vi: 'Vua Tiền',
    arcana: 'minor',
    suit_vi: 'Tiền',
    number: 14,
    keyUp: ['vững vàng vật chất', 'Midas có kiểm soát', 'bảo trợ rộng tay'],
    keyRev: ['đo mọi thứ bằng tiền', 'bảo thủ', 'giàu mà kẹt'],
    image:
      'Vị vua ngồi giữa vườn nho trĩu quả, áo choàng thêu kín chùm nho, tay đặt hờ lên đồng tiền lớn, chân gác lên đầu heo rừng tạc đá — sau lưng là tòa lâu đài ông đã xây xong. Người không cần chứng minh gì thêm.',
    symbols:
      'Vị vua ngồi giữa vườn nho trĩu quả, áo choàng thêu kín chùm nho và lá: sự giàu có phủ lên người ông tự nhiên như một lớp vải, không cần trưng. Tay đặt hờ lên đồng tiền lớn, tay kia cầm vương trượng: của cải chỉ là một nửa quyền uy, nửa kia là trách nhiệm. Dưới chân vua là một hình tạc đá, chi tiết mờ thường được đọc là đầu thú hoặc mũ giáp hiệp sĩ: dù đọc cách nào, nghĩa vẫn một hướng — bản năng hoang và thời chinh chiến đã bị chế ngự, thành bệ để đặt chân. Tòa lâu đài sau tường thành: cơ nghiệp xây xong, đứng vững không cần ông trông.',
    storyArc:
      'Đọc theo hai trục hoàng gia: cấp Vua là làm chủ chất hướng ra ngoài; chất Tiền là vật chất, của cải. Ghép lại: điểm chín của cả bộ Đất — làm ra, giữ được, và dùng của cải làm mái che cho người khác. Có thể là người bảo trợ trong đời bạn, hoặc câu hỏi về cách dùng sự vững vàng bạn đang có.',
    up: 'Vua Tiền là điểm chín của bộ Tiền: làm ra của cải một cách đều đặn, giữ được nó một cách khôn ngoan, và — dấu hiệu của sự chín thật — dùng nó để che chở người khác: trả lương tử tế, đầu tư cho người trẻ, làm chỗ dựa cho gia đình. Lá này gợi tư duy "người làm vườn giàu": không chạy theo cơn sốt, trồng thứ hợp đất mình, để lãi kép và uy tín làm việc của chúng. Thêm một nguyên tắc của kiểu làm vườn này: không nhổ cây lên xem rễ mỗi lần thị trường hắt hơi. Nghe chậm, nhưng đây là kiểu giàu ngủ được ngon.',
    rev: 'Ngược chiều: chiếc thước đo duy nhất còn lại là tiền — quan hệ tính bằng lợi, lời khuyên nào không ra số đều bị gạt, con cái nghe "ba bận" nhiều hơn "ba nghe đây"; hoặc sự vững thành sự kẹt: từ chối mọi cái mới vì "xưa nay vẫn ổn". Giàu nhất phòng họp mà nghèo nhất bàn ăn là một kết cục có thật. Khi chiếc thước tiền nuốt các thước khác, người giàu là người thấy ít nhất: mọi thứ không quy được ra số đều thành vô hình — mà những thứ quý nhất trong nhà đều thuộc nhóm đó.',
    love: 'Trong tình cảm: sự bảo bọc vật chất là một ngôn ngữ yêu — nhưng đừng để nó là ngôn ngữ duy nhất. Người thân cần ông vua bước ra khỏi ngai, không cần thêm một khoản chu cấp. Bước ra khỏi ngai có nghĩa cụ thể: có mặt ở buổi họp phụ huynh, rửa bát không coi là "giúp", nghe chuyện không nhìn đồng hồ. Sự hiện diện là khoản chu cấp duy nhất không thuê ai làm thay được.',
    work: 'Trong công việc: thời điểm nghĩ như chủ — xây hệ thống sinh lời bền, đa dạng nguồn thu, nâng người dưới mình lên. Của bền nhất ông vua này có không phải vàng, là chữ tín. Nâng người dưới lên là phép nhân cuối cùng của sự nghiệp: kèm một người giỏi lên thay mình là cách duy nhất để chính mình rảnh tay lên tiếp. Ai giữ ghế bằng cách giữ bí quyết, người đó tự xây trần cho mình.',
    reflect: [
      'Ngoài tiền, bạn đang giàu thứ gì — và thứ đó có đang được đầu tư tiếp?',
      'Ai từng nâng bạn lúc bạn chưa có gì — giờ bạn đang nâng ai?',
    ],
  },
];
