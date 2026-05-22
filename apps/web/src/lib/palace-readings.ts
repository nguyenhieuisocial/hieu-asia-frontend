/**
 * Decision-framing content for /learn/tu-vi/cung-[slug] pages.
 *
 * Distinct from tuvi-content.ts: tuvi-content focuses on SEO/factual
 * reference; this file focuses on HOW a reading unfolds for that palace
 * and which decisions it actually informs. Anti-fatalism tone.
 */

export interface PalaceReading {
  slug: string;
  name: string;
  fullName: string;
  domain: string;
  governs: string;
  keyStars: { name: string; signal: string }[];
  framework: string[];
  decisionQuestions: string[];
}

export const PALACE_READINGS: PalaceReading[] = [
  {
    slug: 'cung-menh',
    name: 'Mệnh',
    fullName: 'Cung Mệnh (命宮)',
    domain: 'Bản thân — khí chất cốt lõi',
    governs:
      'Cung Mệnh phản ánh khí chất bẩm sinh — cách bạn phản ứng khi chưa kịp suy nghĩ, lăng kính bạn nhìn thế giới. Đây là cung gốc để đối chiếu mọi cung còn lại; một sao tốt ở Tài Bạch sẽ luận khác hẳn nếu Mệnh là người dè dặt hay người liều lĩnh.',
    keyStars: [
      { name: 'Tử Vi', signal: 'Khí chất thủ lĩnh, cần vai trò có quyền điều phối mới yên tâm.' },
      { name: 'Thiên Phủ', signal: 'Người tích luỹ, ổn định, thận trọng trước rủi ro.' },
      { name: 'Liêm Trinh', signal: 'Nội tâm phức tạp, dễ cực đoan — hoặc kỷ luật, hoặc bốc đồng.' },
      { name: 'Hoá Khoa', signal: 'Học thuật, tiếng tăm, được công nhận qua chữ nghĩa/chuyên môn.' },
      { name: 'Hoá Kỵ', signal: 'Đề tài ám ảnh — nơi bạn để tâm quá mức, dễ tự làm khó mình.' },
    ],
    framework: [
      'Quan sát chính tinh thủ Mệnh và miếu vượng — sao có "đẹp" trong cung không, hay bị hãm.',
      'Đối chiếu cung Thân: Mệnh là khí, Thân là hành động. Đồng cung → nhất quán; khác cung → có khoảng cách nội tâm và đời sống.',
      'Dịch sang quyết định: khí chất này hợp môi trường nào, công việc nào tiêu hao năng lượng, đâu là điểm cần rèn thay vì gồng.',
    ],
    decisionQuestions: [
      'Tôi nên chọn nghề cần thi đấu liên tục hay nghề cần kiên trì lâu năm?',
      'Khi mâu thuẫn xảy ra, phản ứng nguyên thuỷ của tôi có giúp ích hay phá hỏng?',
      'Đâu là môi trường khiến tôi mất pin nhanh nhất và tôi đang ở đó vì lý do gì?',
      'Tôi đang cố sửa một tính cách bẩm sinh — hay thực ra cần thiết kế lại bối cảnh?',
    ],
  },
  {
    slug: 'cung-phu-mau',
    name: 'Phụ Mẫu',
    fullName: 'Cung Phụ Mẫu (父母宮)',
    domain: 'Cha mẹ — gốc gia đình',
    governs:
      'Cung Phụ Mẫu phản ánh quan hệ với cha mẹ và rộng hơn là người trên — sếp lớn, thầy, người đỡ đầu. Cung này cũng gợi ý sức khoẻ thừa hưởng và "phông" văn hoá đầu đời mà bạn mang theo cả đời.',
    keyStars: [
      { name: 'Thái Dương', signal: 'Cha mạnh mẽ, có vai vế; nếu hãm thì cha vắng mặt hoặc xa cách.' },
      { name: 'Thái Âm', signal: 'Mẹ giữ vai trò trụ; quan hệ tình cảm sâu nhưng dễ bị thao túng cảm xúc.' },
      { name: 'Cự Môn', signal: 'Khẩu thiệt — bất đồng quan điểm, tranh cãi nhiều dù vẫn yêu thương.' },
      { name: 'Hoá Lộc', signal: 'Cha mẹ có điều kiện hoặc hỗ trợ tài chính được.' },
      { name: 'Hoá Kỵ', signal: 'Có nút thắt khó gỡ với người trên; cần ranh giới rõ ràng.' },
    ],
    framework: [
      'Đọc chính tinh cùng Thái Dương / Thái Âm để hiểu hình ảnh cha và mẹ riêng biệt.',
      'Đối chiếu với cung Mệnh: bạn giống ai hơn, và xung đột nội tâm có phải đến từ kế thừa chưa được hoá giải?',
      'Chuyển sang quyết định: ranh giới nào cần đặt, kỳ vọng nào của cha mẹ cần ngừng vác, cuộc trò chuyện nào nên có khi còn kịp.',
    ],
    decisionQuestions: [
      'Tôi nên mở cuộc nói chuyện thẳng với cha/mẹ về kỳ vọng — hay tạm gác lại?',
      'Tôi đang sống đời mình hay đời cha mẹ muốn?',
      'Có dấu hiệu sức khoẻ nào trong gia đình tôi cần chủ động tầm soát?',
      'Ranh giới tài chính với cha mẹ hiện tại có lành mạnh không?',
    ],
  },
  {
    slug: 'cung-phuc-duc',
    name: 'Phúc Đức',
    fullName: 'Cung Phúc Đức (福德宮)',
    domain: 'Tinh thần — nội tâm sâu',
    governs:
      'Cung Phúc Đức nói về thế giới bên trong: bạn có dễ an không, đâu là nguồn vui đích thực, đâu là gốc của lo âu lặp đi lặp lại. Khác với Mệnh (khí chất), Phúc Đức là nền tảng tinh thần — phần ít người nhìn thấy nhưng quyết định bạn vui hay khổ.',
    keyStars: [
      { name: 'Thiên Đồng', signal: 'Dễ an, hài lòng với điều nhỏ — nhưng cũng dễ trì hoãn.' },
      { name: 'Thiên Lương', signal: 'Triết lý, ưa suy ngẫm, thích giúp người.' },
      { name: 'Tham Lang', signal: 'Khao khát hưởng thụ và trải nghiệm; cần đa dạng để không chán.' },
      { name: 'Hoá Khoa', signal: 'Tìm được an qua học hỏi, đọc sách, viết lách.' },
      { name: 'Hoá Kỵ', signal: 'Có vòng lặp suy nghĩ tiêu cực — cần nhận diện và can thiệp sớm.' },
    ],
    framework: [
      'Xác định sao chủ Phúc Đức và mức độ miếu vượng để hiểu "nền cảm xúc" của bạn.',
      'Soi chiếu với Mệnh và Thiên Di — Phúc Đức cho biết nội tâm, hai cung kia cho biết bạn xuất hiện ra ngoài thế nào. Nếu lệch nhau quá xa, có sự dồn nén.',
      'Dịch ra hành động: thói quen tinh thần nào nên giữ, thói quen nào đang ăn mòn năng lượng dài hạn.',
    ],
    decisionQuestions: [
      'Tôi đang nuôi dưỡng nội tâm bằng gì — và cái đó có còn phù hợp năm nay?',
      'Cơn lo âu của tôi có gốc thật hay chỉ là vòng lặp suy nghĩ?',
      'Có nên đầu tư thời gian/tiền cho trị liệu, thiền, hay một khoá học chiêm nghiệm?',
      'Điều gì khiến tôi thấy đời đáng sống — và tôi đang dành bao nhiêu giờ mỗi tuần cho nó?',
    ],
  },
  {
    slug: 'cung-dien-trach',
    name: 'Điền Trạch',
    fullName: 'Cung Điền Trạch (田宅宮)',
    domain: 'Nhà cửa — tài sản dài hạn',
    governs:
      'Cung Điền Trạch quản nhà cửa, đất đai, tài sản cố định và môi trường sống. Trong xã hội hiện đại, cung này còn nói về quan hệ với "nơi gốc rễ" — bạn cần một mái nhà ổn định hay sống xê dịch là tốt nhất.',
    keyStars: [
      { name: 'Thiên Phủ', signal: 'Khả năng tích luỹ tài sản, gắn bó với một nơi ở lâu dài.' },
      { name: 'Vũ Khúc', signal: 'Tiền vào đất đai, hợp đầu tư bất động sản.' },
      { name: 'Phá Quân', signal: 'Hay chuyển nhà, đổi địa điểm; tài sản đến rồi đi.' },
      { name: 'Hoá Lộc', signal: 'Có duyên với nhà đất, mua bán dễ có lời.' },
      { name: 'Hoá Kỵ', signal: 'Vướng giấy tờ, tranh chấp; cần cẩn trọng với hợp đồng.' },
    ],
    framework: [
      'Xem chính tinh đóng cung và sao hung kèm để biết xu hướng ổn định hay xê dịch.',
      'Đối chiếu Tài Bạch (dòng tiền) và Điền Trạch (kho tài sản): vào nhiều mà không giữ lại được là vấn đề ở Điền Trạch.',
      'Dịch sang quyết định: thời điểm mua, thuê hay bán — và lưu ý điều khoản pháp lý nào nếu Hoá Kỵ động.',
    ],
    decisionQuestions: [
      'Tôi nên mua nhà bây giờ, hay tích luỹ thêm và thuê thêm vài năm?',
      'Có nên chuyển về quê / chuyển ra thành phố lớn năm nay?',
      'Khoản đầu tư đất đai sắp ký có rủi ro pháp lý không?',
      'Môi trường sống hiện tại có thực sự khiến tôi nạp lại được năng lượng?',
    ],
  },
  {
    slug: 'cung-quan-loc',
    name: 'Quan Lộc',
    fullName: 'Cung Quan Lộc (官祿宮)',
    domain: 'Sự nghiệp — vai trò xã hội',
    governs:
      'Cung Quan Lộc quản sự nghiệp, chức vụ, vai trò xã hội. Khác với "kiếm được bao nhiêu" (đó là Tài Bạch), Quan Lộc nói về "bạn là ai trong mắt nghề" — tự làm hay làm thuê, kỹ thuật hay quản lý, sáng tạo hay vận hành.',
    keyStars: [
      { name: 'Tử Vi', signal: 'Hợp vai trò lãnh đạo, điều phối; bị ép làm cấp dưới sẽ trầy trật.' },
      { name: 'Vũ Khúc', signal: 'Hợp tài chính, kỹ thuật, nghề có công thức rõ ràng.' },
      { name: 'Thất Sát', signal: 'Hợp khởi nghiệp, mở đường, công việc cạnh tranh cao.' },
      { name: 'Hoá Quyền', signal: 'Có quyền lực thực tế, được giao việc lớn — nhưng áp lực theo cùng.' },
      { name: 'Hoá Kỵ', signal: 'Va vấp trong công việc, dễ bị hiểu lầm; cần văn bản hoá.' },
    ],
    framework: [
      'Đọc chính tinh Quan Lộc để xác định "hình thái nghề" hợp khí chất.',
      'Tam phương tứ chính Mệnh – Quan Lộc – Tài Bạch – Thiên Di kể câu chuyện đầy đủ: bạn là ai, làm gì, kiếm thế nào, gặp ai.',
      'Dịch sang quyết định: nên ở lại hay nhảy việc, chuyên môn hoá sâu hay mở rộng, làm thuê hay tự mở.',
    ],
    decisionQuestions: [
      'Tôi nên nhận lời thăng chức quản lý, hay tiếp tục là chuyên gia kỹ thuật?',
      'Đây có phải lúc nhảy việc, hay vấn đề nằm ở tôi chứ không phải công ty?',
      'Tôi muốn nổi tiếng trong ngành hay muốn tự chủ thời gian — và nghề tôi đang theo phục vụ vế nào?',
      'Cơ hội khởi nghiệp này hợp khí chất của tôi không, hay chỉ vì FOMO?',
    ],
  },
  {
    slug: 'cung-no-boc',
    name: 'Nô Bộc',
    fullName: 'Cung Nô Bộc (奴僕宮)',
    domain: 'Bạn bè — cấp dưới — mạng lưới',
    governs:
      'Cung Nô Bộc nói về bạn bè, đồng nghiệp ngang vai và người làm cùng/dưới quyền bạn. Trong xã hội hiện đại, đây là cung "mạng lưới" — bạn có người tin cậy quanh mình không, bạn dễ tìm cộng sự hay luôn làm một mình.',
    keyStars: [
      { name: 'Thiên Đồng', signal: 'Bạn bè hài hoà, dễ chia sẻ; ít xung đột.' },
      { name: 'Cự Môn', signal: 'Hay có hiểu lầm với bạn; cần nói chuyện thẳng.' },
      { name: 'Tham Lang', signal: 'Mạng lưới rộng, nhiều mối quan hệ giải trí.' },
      { name: 'Hoá Lộc', signal: 'Bạn bè giúp đỡ vật chất hoặc cơ hội nghề được.' },
      { name: 'Hoá Kỵ', signal: 'Bị bạn bè/cộng sự kéo xuống; cẩn trọng khi hùn vốn.' },
    ],
    framework: [
      'Quan sát chính tinh và sao hung — Nô Bộc tốt nghĩa là bạn bè "đỡ" được mình; xấu nghĩa là mạng lưới rút năng lượng.',
      'Đối chiếu Quan Lộc: cộng sự trong nghề có hỗ trợ bạn hay đang là rào cản?',
      'Dịch sang quyết định: ai trong vòng tròn cần giữ thân hơn, ai cần dãn ra, có nên mở rộng mạng lưới chủ động trong năm tới.',
    ],
    decisionQuestions: [
      'Tôi nên hùn vốn với người bạn này — hay giữ tình bạn và tìm cộng sự khác?',
      'Vòng tròn bạn bè hiện tại đang nâng tôi lên hay kéo tôi xuống?',
      'Tôi cô đơn vì khí chất, hay vì chưa thực sự đầu tư cho quan hệ?',
      'Có nên xây cộng đồng quanh chuyên môn của mình thay vì làm một mình?',
    ],
  },
  {
    slug: 'cung-thien-di',
    name: 'Thiên Di',
    fullName: 'Cung Thiên Di (遷移宮)',
    domain: 'Di chuyển — ra ngoài xã hội',
    governs:
      'Cung Thiên Di là "khuôn mặt ra ngoài" — bạn thể hiện thế nào khi ra khỏi nhà, hợp ở quê hay đi xa, du học/xuất ngoại có duyên không. Đây cũng là cung đối chiếu trực diện với cung Mệnh, kể phần còn lại của câu chuyện về bạn.',
    keyStars: [
      { name: 'Thiên Mã', signal: 'Hay di chuyển, hợp công việc đi lại nhiều.' },
      { name: 'Thái Dương', signal: 'Ra ngoài được trọng vọng, hợp đi xa lập nghiệp.' },
      { name: 'Cự Môn', signal: 'Ra ngoài dễ gặp khẩu thiệt; cần thận trọng lời nói.' },
      { name: 'Hoá Lộc', signal: 'Đi xa có cơ hội tài chính, hợp xuất ngoại.' },
      { name: 'Hoá Kỵ', signal: 'Đi xa gặp trở ngại; nên cân nhắc kỹ chuyến đi quan trọng.' },
    ],
    framework: [
      'Đọc chính tinh Thiên Di và mức độ cát hung — Thiên Di tốt thường ngược lại với Mệnh hãm (đi xa thì khá hơn ở nhà).',
      'So sánh Mệnh vs Thiên Di: cùng tốt → linh hoạt; Mệnh xấu Thiên Di tốt → đi xa phát; Mệnh tốt Thiên Di xấu → ở yên thì thuận.',
      'Dịch sang quyết định: thời điểm chuyển môi trường, du học, hay nhận dự án quốc tế.',
    ],
    decisionQuestions: [
      'Tôi nên nhận cơ hội đi nước ngoài 2 năm — hay ở lại củng cố nền tảng trong nước?',
      'Tôi hợp làm việc tại văn phòng cố định hay nghề phải đi lại?',
      'Khuôn mặt xã hội của tôi khác con người thật bao nhiêu, và tôi có ổn với điều đó?',
      'Chuyến đi/khoá học xa nhà sắp tới có thực sự xứng với chi phí?',
    ],
  },
  {
    slug: 'cung-tat-ach',
    name: 'Tật Ách',
    fullName: 'Cung Tật Ách (疾厄宮)',
    domain: 'Sức khoẻ — tai ách',
    governs:
      'Cung Tật Ách phản ánh sức khoẻ, thiên hướng bệnh tật và những "vận đen" có thể gặp. Đây là cung nhắc bạn tầm soát chủ động — không phải để sợ, mà để biết cơ thể mình dễ yếu chỗ nào và cần đầu tư phòng ngừa.',
    keyStars: [
      { name: 'Thiên Cơ', signal: 'Thần kinh nhạy, dễ mất ngủ; cần quản lý stress.' },
      { name: 'Liêm Trinh', signal: 'Tim mạch, huyết áp, máu — cần khám định kỳ.' },
      { name: 'Cự Môn', signal: 'Tiêu hoá, miệng — chú ý ăn uống, răng lợi.' },
      { name: 'Thái Âm', signal: 'Phụ khoa / nội tiết / mắt; cần chăm sóc giấc ngủ.' },
      { name: 'Hoá Kỵ', signal: 'Đề tài sức khoẻ dễ thành ám ảnh hoặc bị bỏ bê — chọn một thái cực sai sẽ tổn hại.' },
    ],
    framework: [
      'Đọc chính tinh và sao hung tại Tật Ách để biết hệ cơ quan nào dễ tổn thương.',
      'Đối chiếu với cung Mệnh và Phúc Đức: nhiều bệnh tâm thể bắt nguồn từ căng thẳng nội tâm.',
      'Dịch ra hành động cụ thể: gói tầm soát nào nên làm năm nay, thói quen nào cần thay đổi, lúc nào nên đi khám thay vì chịu đựng.',
    ],
    decisionQuestions: [
      'Tôi nên đầu tư vào gói khám tổng quát chuyên sâu — hay chỉ duy trì khám cơ bản?',
      'Triệu chứng kéo dài này là do stress công việc hay thực sự cần chuyên khoa?',
      'Có nên thay đổi lối sống (giấc ngủ, vận động, ăn uống) trước khi cơ thể "lên tiếng" mạnh hơn?',
      'Bảo hiểm sức khoẻ hiện tại có đủ cho rủi ro mà cung này cảnh báo?',
    ],
  },
  {
    slug: 'cung-tai-bach',
    name: 'Tài Bạch',
    fullName: 'Cung Tài Bạch (財帛宮)',
    domain: 'Tiền bạc — dòng tiền',
    governs:
      'Cung Tài Bạch quản dòng tiền hằng ngày — tiền vào, tiền ra, cách bạn kiếm và tiêu. Khác với Điền Trạch (kho tài sản), Tài Bạch là "ống dẫn" — nó cho biết phong cách kiếm tiền và mối quan hệ tâm lý của bạn với đồng tiền.',
    keyStars: [
      { name: 'Vũ Khúc', signal: 'Sao tiền điển hình; hợp tài chính, kế toán, đầu tư.' },
      { name: 'Thiên Phủ', signal: 'Giữ tiền giỏi, ít rủi ro, tích luỹ tốt.' },
      { name: 'Phá Quân', signal: 'Tiền vào ra mạnh, không tích được lâu.' },
      { name: 'Hoá Lộc', signal: 'Có duyên với tiền, dòng vào dễ.' },
      { name: 'Hoá Kỵ', signal: 'Tiền vướng nợ, lừa đảo hoặc tranh chấp; cẩn trọng giao dịch lớn.' },
    ],
    framework: [
      'Đọc chính tinh Tài Bạch để biết "hình thái dòng tiền" — đều đặn hay đột biến, tự tay kiếm hay từ hệ thống.',
      'Đối chiếu Quan Lộc (nghề) và Điền Trạch (tài sản): nghề kiếm được nhưng không tích được = lỗ hổng ở Điền Trạch hoặc Phúc Đức.',
      'Dịch sang quyết định tài chính: ngưỡng rủi ro hợp lý, kênh tiết kiệm/đầu tư nào, khi nào nên dừng tay.',
    ],
    decisionQuestions: [
      'Tôi nên đầu tư vào cổ phiếu/quỹ ổn định — hay khoản rủi ro cao có thể đổi đời?',
      'Vì sao tôi kiếm được nhưng cuối tháng không còn gì — vấn đề ở thu hay chi?',
      'Có nên vay để mở rộng việc làm ăn, hay giai đoạn này cần co lại?',
      'Mối quan hệ tâm lý của tôi với tiền (sợ hay tham) đang chi phối quyết định không?',
    ],
  },
  {
    slug: 'cung-tu-tuc',
    name: 'Tử Tức',
    fullName: 'Cung Tử Tức (子息宮)',
    domain: 'Con cái — sáng tạo — kế thừa',
    governs:
      'Cung Tử Tức quản chuyện con cái — số con, mối quan hệ với con, độ vất vả trong việc nuôi dạy. Trong cách đọc hiện đại, cung này còn nói về "sáng tạo" — những đứa con tinh thần như dự án, tác phẩm, học trò.',
    keyStars: [
      { name: 'Thiên Đồng', signal: 'Con hiền, quan hệ ấm áp.' },
      { name: 'Tham Lang', signal: 'Con thông minh, hiếu động; có thể có nhiều con.' },
      { name: 'Thất Sát', signal: 'Con cá tính mạnh, khó kèm cặp theo lối truyền thống.' },
      { name: 'Hoá Lộc', signal: 'Con cái có duyên tài lộc, hỗ trợ cha mẹ.' },
      { name: 'Hoá Kỵ', signal: 'Có khó khăn về sinh nở hoặc lo nghĩ kéo dài về con.' },
    ],
    framework: [
      'Đọc chính tinh và sao hung để biết "phong cách làm cha mẹ" hợp với bạn.',
      'Đối chiếu Phu Thê và Phúc Đức: gốc gia đình bạn dựng có vững không, có đủ năng lượng tinh thần để nuôi dạy không.',
      'Dịch sang quyết định: thời điểm sinh con, phong cách giáo dục, đầu tư cho dự án sáng tạo của riêng bạn.',
    ],
    decisionQuestions: [
      'Vợ chồng tôi nên có con vào năm nào — hay tập trung sự nghiệp thêm vài năm?',
      'Tôi đang ép con vào khuôn mình muốn — hay thực sự nghe con là ai?',
      'Dự án sáng tạo cá nhân của tôi có đáng đầu tư tiếp, hay đang trở thành gánh nặng?',
      'Có nên cân nhắc hỗ trợ y tế (IVF, hiếm muộn) thay vì chờ tự nhiên?',
    ],
  },
  {
    slug: 'cung-phu-the',
    name: 'Phu Thê',
    fullName: 'Cung Phu Thê (夫妻宮)',
    domain: 'Hôn nhân — bạn đời',
    governs:
      'Cung Phu Thê phản ánh hôn nhân và người bạn đời — kiểu người bạn hợp, độ bền của mối quan hệ, các điểm dễ va chạm. Khác với chuyện "yêu ai" thoáng qua, cung này nói về bạn đời thực sự — người sống cùng nhà, cùng đếm tiền, cùng nuôi con.',
    keyStars: [
      { name: 'Thái Âm', signal: 'Bạn đời dịu dàng, gia đình êm ấm.' },
      { name: 'Thái Dương', signal: 'Bạn đời mạnh mẽ, có vị trí xã hội.' },
      { name: 'Tham Lang', signal: 'Quan hệ nhiều sắc thái, đam mê cao; cần ổn định mới bền.' },
      { name: 'Hoá Quyền', signal: 'Bạn đời có quyền lực, cá tính mạnh; cần tôn trọng nhau.' },
      { name: 'Hoá Kỵ', signal: 'Có nút thắt khó gỡ trong tình cảm — không phải định mệnh, là chỗ phải làm việc.' },
    ],
    framework: [
      'Đọc chính tinh và sao hung tại Phu Thê để hình dung "khuôn người" hợp với bạn.',
      'Đối chiếu Mệnh và Tử Tức: bạn là ai trong tình yêu, và bạn có sẵn sàng cho phần sau (nuôi con cùng) không.',
      'Dịch sang quyết định: nên đầu tư cho mối quan hệ hiện tại, hay buông; nên cưới năm nào, làm sao dung hoà khi cá tính khác.',
    ],
    decisionQuestions: [
      'Mối quan hệ này đang bế tắc do bản chất khác biệt hay do thiếu giao tiếp?',
      'Tôi nên cưới năm nay — hay cần thêm thời gian để cả hai trưởng thành?',
      'Tôi đang chọn bạn đời theo khí chất thật của mình, hay theo kỳ vọng gia đình?',
      'Có ranh giới nào trong hôn nhân cần đặt lại để cả hai cùng thở được?',
    ],
  },
  {
    slug: 'cung-huynh-de',
    name: 'Huynh Đệ',
    fullName: 'Cung Huynh Đệ (兄弟宮)',
    domain: 'Anh chị em — đồng đội ruột',
    governs:
      'Cung Huynh Đệ quản anh chị em ruột — số người, quan hệ, mức độ hỗ trợ. Trong xã hội hiện đại, cung này còn được mở rộng ra "đồng đội thân nhất" — những người gắn bó như ruột thịt dù không cùng máu.',
    keyStars: [
      { name: 'Thiên Đồng', signal: 'Anh chị em hoà hợp, hỗ trợ nhau.' },
      { name: 'Thiên Cơ', signal: 'Anh chị em thông minh, mỗi người đi một hướng.' },
      { name: 'Cự Môn', signal: 'Hay tranh cãi với anh chị em dù bản chất vẫn yêu thương.' },
      { name: 'Hoá Lộc', signal: 'Anh chị em hỗ trợ vật chất hoặc cùng làm ăn được.' },
      { name: 'Hoá Kỵ', signal: 'Có khúc mắc khó nói; cần dành thời gian thật để hoá giải.' },
    ],
    framework: [
      'Đọc chính tinh để hình dung số lượng và hình thái quan hệ với anh chị em.',
      'Đối chiếu Phụ Mẫu và Nô Bộc: gia đình gốc + bạn bè cùng kể chuyện "hệ hỗ trợ" của bạn dày hay mỏng.',
      'Dịch sang quyết định: có nên hợp tác kinh doanh với anh chị em, có món nợ tình cảm nào cần trả, có cuộc gặp nào nên chủ động.',
    ],
    decisionQuestions: [
      'Tôi có nên cùng anh/chị/em mở công ty — hay tách rõ kinh tế để giữ tình?',
      'Tôi đang gánh thay vai trò của anh/chị/em — và điều đó có công bằng?',
      'Có cuộc trò chuyện nào với anh chị em tôi đã trì hoãn quá lâu?',
      'Đồng đội thân nhất hiện tại của tôi có thực sự là "huynh đệ" — hay tôi đang một mình mà không biết?',
    ],
  },
];

export function findPalaceReading(slug: string): PalaceReading | undefined {
  return PALACE_READINGS.find((p) => p.slug === slug);
}
