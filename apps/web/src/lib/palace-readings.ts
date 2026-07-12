/**
 * Decision-framing content for /learn/tu-vi/cung-[slug] pages.
 *
 * Distinct from tuvi-content.ts: tuvi-content focuses on SEO/factual
 * reference; this file focuses on HOW a reading unfolds for that palace
 * and which decisions it actually informs. Anti-fatalism tone.
 *
 * Grounding: kien-thuc-nguon/tu-vi.md (§1 bảng 12 cung, §2 bảng 14 chính tinh,
 * §3 độ sáng, §4 Tứ Hóa, §5 phụ tinh, §9 quy trình luận, §10 khung luận 12 cung).
 * Mọi câu về tam phương tứ chính khớp bảng `trigon` trong tuvi-content.ts
 * (đã khóa bằng tuvi-content.test.ts) — xem palace-readings.test.ts.
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
  /** Câu hỏi trung tâm mà cung này thực sự trả lời. */
  coreQuestion: string;
  /** Cách luận cung này cho sâu: nhìn chính tinh gì, tam phương nào, bẫy gì. */
  readingGuide: string;
  /** Ngộ nhận hay gặp về cung này, mỗi mục kèm đính chính ngắn. */
  commonMisreads: string[];
  /** Nhóm tam hợp + cung xung chiếu — khớp bảng trigon đã khóa test trong tuvi-content.ts. */
  trioNote: string;
}

export const PALACE_READINGS: PalaceReading[] = [
  {
    slug: 'cung-menh',
    name: 'Mệnh',
    fullName: 'Cung Mệnh (命宮)',
    domain: 'Bản thân — khí chất cốt lõi',
    governs:
      'Cung Mệnh phản ánh khí chất bẩm sinh: cách bạn phản ứng khi chưa kịp suy nghĩ, lăng kính bạn nhìn thế giới, điểm mạnh nào có sẵn và điểm yếu nào phải rèn. Đây là cung gốc để đối chiếu mọi cung còn lại; một sao tốt ở Tài Bạch sẽ luận khác hẳn nếu Mệnh là người dè dặt hay người liều lĩnh. Cổ thư đặt Mệnh cạnh cung Thân: Mệnh là khí chất trời sinh, Thân là nơi đời sống thực tế kéo ta dồn sức về sau. Khoảng ba phần mười lá số có cung Mệnh trống chính tinh; khi đó phải mượn sao cung Thiên Di đối diện để luận, và đó không phải dấu hiệu xấu.',
    keyStars: [
      { name: 'Tử Vi', signal: 'Khí chất thủ lĩnh, giữ chữ tín, cần vai trò có quyền điều phối mới yên tâm; thiếu Tả Phụ, Hữu Bật phụ trợ thì dễ cô đơn trên ghế cao.' },
      { name: 'Thiên Phủ', signal: 'Người tích luỹ, ổn định, thận trọng trước rủi ro; mặt trái là quá thủ thân, chậm nắm cơ hội.' },
      { name: 'Liêm Trinh', signal: 'Nội tâm phức tạp, hai mặt kỷ luật và đam mê; theo đuổi mục tiêu rất lâu nhưng áp lực tự tạo cũng lớn.' },
      { name: 'Hoá Khoa', signal: 'Học thuật, tiếng tăm, được công nhận qua chữ nghĩa/chuyên môn.' },
      { name: 'Hoá Kỵ', signal: 'Đề tài bạn để tâm quá mức, dễ tự làm khó mình; không phải đời mạt, mà là động cơ trưởng thành nếu nhận ra.' },
    ],
    framework: [
      'Quan sát chính tinh thủ Mệnh và độ sáng miếu, vượng, đắc, hãm — sao có "đẹp" trong cung không, hay đang yếu thế.',
      'Nếu Mệnh trống chính tinh (vô chính diệu), mượn sao cung Thiên Di đối diện để luận, rồi mới xét phụ tinh.',
      'Đối chiếu cung Thân: Mệnh là khí, Thân là hành động. Đồng cung → nhất quán; khác cung → có khoảng cách nội tâm và đời sống.',
      'Kéo tam phương tứ chính: gộp Mệnh với Tài Bạch, Quan Lộc và cung xung chiếu Thiên Di; nhận diện lá số thuộc bộ Sát Phá Tham, Cơ Nguyệt Đồng Lương hay Tử Phủ Vũ Tướng để chọn giọng luận động, tĩnh hay quản trị.',
      'Dịch sang quyết định: khí chất này hợp môi trường nào, công việc nào tiêu hao năng lượng, đâu là điểm cần rèn thay vì gồng.',
    ],
    decisionQuestions: [
      'Tôi nên chọn nghề cần thi đấu liên tục hay nghề cần kiên trì lâu năm?',
      'Khi mâu thuẫn xảy ra, phản ứng nguyên thuỷ của tôi có giúp ích hay phá hỏng?',
      'Đâu là môi trường khiến tôi mất pin nhanh nhất và tôi đang ở đó vì lý do gì?',
      'Tôi đang cố sửa một tính cách bẩm sinh — hay thực ra cần thiết kế lại bối cảnh?',
      'Tôi thuộc kiểu bứt phá theo đợt hay bền bỉ đường dài, và nhịp làm việc hiện tại có đang đi ngược kiểu đó?',
      'Nếu phải chọn giữa vai trò được đứng tên và vai trò được yên ổn làm chuyên môn, tôi chọn gì mà không tiếc?',
    ],
    coreQuestion:
      'Khí chất bẩm sinh của tôi hợp môi trường nào, điểm nào nên rèn và điểm nào nên thiết kế lại bối cảnh thay vì gồng ép?',
    readingGuide:
      'Luận Mệnh đi theo thứ tự, đừng nhảy cóc. Trước hết xem chính tinh thủ Mệnh và độ sáng của nó: cùng một sao, đóng ở chi này thì miếu, chi khác lại hãm, cường độ biểu hiện khác hẳn nhau. Kế đó xem Tứ Hóa gốc rơi vào đâu, vì Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ mới là thứ khiến hai lá số "giống nhau trên giấy" luận ra khác nhau. Sau cùng mới tới phụ tinh tô màu. Tất cả đặt trong tam phương tứ chính: Mệnh gộp với Tài Bạch, Quan Lộc và Thiên Di, không bao giờ đọc lẻ. Bẫy hay gặp nhất là thấy một sát tinh hay Hóa Kỵ tại Mệnh liền kết luận "số khổ". Sao hãm gặp cát tinh phụ trợ vẫn dùng được; sao miếu gặp sát tinh nặng vẫn trục trặc. Hóa Kỵ chỉ ra đề tài bạn để tâm quá mức, không phải bản án.',
    commonMisreads: [
      '"Hóa Kỵ tại Mệnh là đời mạt vận." Sai: Hóa Kỵ chỉ ra đề tài bạn để tâm quá mức, dễ tự làm khó mình. Nhận diện được thì nó thành động cơ trưởng thành.',
      '"Cung Mệnh trống chính tinh là số xấu." Khoảng ba phần mười lá số như vậy (vô chính diệu); luận bằng cách mượn sao cung Thiên Di đối diện, và thường là người linh hoạt, bản sắc đa dạng.',
      '"Chỉ cần đọc cung Mệnh là biết hết một người." Một cung không bao giờ đọc lẻ; thiếu tam phương tứ chính thì mới thấy một phần tư câu chuyện.',
    ],
    trioNote:
      'Mệnh cùng nhóm tam hợp với Tài Bạch và Quan Lộc; cung xung chiếu là Thiên Di. Bốn cung này họp thành bộ luận chính của cả lá số: bạn là ai (Mệnh), kiếm sống ra sao (Tài Bạch), đứng ở vai trò nào (Quan Lộc) và xuất hiện thế nào khi ra ngoài (Thiên Di). Cung đối luôn chiếu sang, nên Mệnh hãm mà Thiên Di sáng thường được luận là "đi xa thì khá hơn ở nhà".',
  },
  {
    slug: 'cung-phu-mau',
    name: 'Phụ Mẫu',
    fullName: 'Cung Phụ Mẫu (父母宮)',
    domain: 'Cha mẹ — gốc gia đình',
    governs:
      'Cung Phụ Mẫu phản ánh quan hệ với cha mẹ và rộng hơn là người trên: sếp lớn, thầy, người đỡ đầu. Cổ thư xếp cung này cùng nhóm học vấn, vì nó nói về cách bạn tiếp nhận tri thức và khuôn phép từ thế hệ trước. Nó cũng gợi ý sức khoẻ thừa hưởng và "phông" văn hoá đầu đời mà bạn mang theo rất lâu. Một điểm hay bị bỏ qua: cung này mô tả cách bạn cảm nhận sự bảo bọc hay áp đặt, chứ không phải bản án dành cho cha mẹ. Hai anh em ruột sinh khác giờ có thể có cung Phụ Mẫu khác hẳn nhau, dù cha mẹ là một.',
    keyStars: [
      { name: 'Thái Dương', signal: 'Gắn với hình ảnh người cha và người trên có vai vế; khi hãm, thường là cảm giác cha xa cách hoặc ít hiện diện.' },
      { name: 'Thái Âm', signal: 'Gắn với hình ảnh người mẹ; tình cảm sâu và tinh tế, nhưng kỳ vọng ngầm cũng theo đó mà nhiều.' },
      { name: 'Cự Môn', signal: 'Khẩu thiệt — bất đồng quan điểm, tranh cãi nhiều dù vẫn yêu thương.' },
      { name: 'Hoá Lộc', signal: 'Cha mẹ có điều kiện hoặc hỗ trợ tài chính được.' },
      { name: 'Hoá Kỵ', signal: 'Nút thắt với người trên hoặc với thẩm quyền nói chung; cần ranh giới rõ ràng thay vì chịu đựng.' },
    ],
    framework: [
      'Đọc chính tinh cùng Thái Dương / Thái Âm để hiểu hình ảnh cha và mẹ riêng biệt.',
      'Xét độ sáng của Thái Dương, Thái Âm nếu hai sao này có mặt: sáng hay hãm đổi hẳn sắc thái hình ảnh cha mẹ trong lá số.',
      'Đối chiếu với cung Mệnh: bạn giống ai hơn, và xung đột nội tâm có phải đến từ kế thừa chưa được hoá giải?',
      'Kéo tam phương tứ chính: Phụ Mẫu gộp với Tử Tức, Nô Bộc và cung xung chiếu Tật Ách — xem cả vòng người quanh mình thay vì một quan hệ đơn lẻ.',
      'Chuyển sang quyết định: ranh giới nào cần đặt, kỳ vọng nào của cha mẹ cần ngừng vác, cuộc trò chuyện nào nên có khi còn kịp.',
    ],
    decisionQuestions: [
      'Tôi nên mở cuộc nói chuyện thẳng với cha/mẹ về kỳ vọng — hay tạm gác lại?',
      'Tôi đang sống đời mình hay đời cha mẹ muốn?',
      'Có dấu hiệu sức khoẻ nào trong gia đình tôi cần chủ động tầm soát?',
      'Ranh giới tài chính với cha mẹ hiện tại có lành mạnh không?',
      'Với sếp hoặc thầy hiện tại, tôi đang lặp lại kịch bản từng có với cha mẹ — hay đã ứng xử khác đi?',
      'Nếp nhà nào tôi muốn giữ lại cho con mình, nếp nào nên dừng ở thế hệ tôi?',
    ],
    coreQuestion:
      'Tôi tiếp nhận sự bảo bọc, kỳ vọng của cha mẹ và người trên như thế nào, và cần đặt ranh giới ở đâu?',
    readingGuide:
      'Cung Phụ Mẫu nên đọc bằng hai lớp. Lớp sao: Thái Dương gắn với hình ảnh cha, Thái Âm gắn với hình ảnh mẹ; xem độ sáng của hai sao này để biết hình ảnh nào đậm, hình ảnh nào mờ trong cảm nhận của bạn. Cự Môn ở đây thường là nhà hay tranh luận, thương nhau bằng lời khó nghe; Hóa Kỵ là nút thắt với người trên, từ cha mẹ tới sếp. Lớp thứ hai là chính bạn: cung này tả cách bạn tiếp nhận sự bảo bọc và áp đặt, nên phần cảm nhận chủ quan chiếm tỷ trọng lớn — cùng một người cha, hai anh em có thể cảm nhận rất khác. Đặt cung trong tam phương tứ chính: Phụ Mẫu gộp với Tử Tức, Nô Bộc và cung xung chiếu Tật Ách. Bẫy hay gặp nhất là đọc cung này thành lời phán về vận hạn cha mẹ. Nó nói về một mối quan hệ cần chăm, không nói người thân sắp gặp chuyện.',
    commonMisreads: [
      '"Cung Phụ Mẫu xấu nghĩa là cha mẹ sắp gặp nạn." Sai: cung này tả cách bạn tiếp nhận sự bảo bọc hay áp đặt, không phán vận hạn của cha mẹ.',
      '"Cung này chỉ nói về cha mẹ ruột." Nó phủ cả người trên nói chung: thầy, sếp đầu đời, người đỡ đầu, và cách bạn phản ứng với thẩm quyền.',
    ],
    trioNote:
      'Phụ Mẫu cùng nhóm tam hợp với Tử Tức và Nô Bộc; cung xung chiếu là Tật Ách. Ba cung tam hợp vẽ trọn vòng người quanh bạn theo trục thế hệ: người trên (Phụ Mẫu), người mình sinh thành hoặc dìu dắt (Tử Tức), người ngang vai trong mạng lưới (Nô Bộc). Cung đối Tật Ách luôn chiếu sang, khớp với ý cổ truyền rằng cung Phụ Mẫu cũng gợi sức khoẻ thừa hưởng — luận thể chất thường phải ngoái nhìn cung này.',
  },
  {
    slug: 'cung-phuc-duc',
    name: 'Phúc Đức',
    fullName: 'Cung Phúc Đức (福德宮)',
    domain: 'Tinh thần — nội tâm sâu',
    governs:
      'Cung Phúc Đức nói về thế giới bên trong: bạn có dễ an không, đâu là nguồn vui đích thực, đâu là gốc của lo âu lặp đi lặp lại. Khác với Mệnh (khí chất phản ứng), Phúc Đức là nền tinh thần nằm sâu hơn: sức chịu đựng dài hạn, khả năng hồi phục sau cú sốc, khuynh hướng triết lý hay tâm linh. Tử Vi cổ gọi đây là cung phước báu tích luỹ; cách đọc hiện đại nhìn nó như "vốn nội tâm". Người xem lá số thường lướt qua cung này, nhưng nó quyết định thành công có đổi được thành dễ chịu hay không.',
    keyStars: [
      { name: 'Thiên Đồng', signal: 'Dễ an, hài lòng với điều nhỏ — nhưng cũng dễ trì hoãn.' },
      { name: 'Thiên Lương', signal: 'Triết lý, ưa suy ngẫm, thích che chở người khác; cẩn thận lo việc thiên hạ mà quên việc nhà.' },
      { name: 'Tham Lang', signal: 'Khao khát hưởng thụ và trải nghiệm; cần đa dạng để không chán.' },
      { name: 'Hoá Khoa', signal: 'Tìm được an qua học hỏi, đọc sách, viết lách.' },
      { name: 'Hoá Kỵ', signal: 'Có vòng lặp suy nghĩ tiêu cực — cần nhận diện và can thiệp sớm.' },
    ],
    framework: [
      'Xác định sao chủ Phúc Đức và mức độ miếu vượng để hiểu "nền cảm xúc" của bạn.',
      'Soi Tứ Hóa: Hóa Kỵ đóng Phúc Đức là chỗ tâm trí dễ mắc kẹt vào một đề tài, đáng để tâm gỡ sớm thay vì đọc thành "phước mỏng".',
      'Soi chiếu với Mệnh và Thiên Di — Phúc Đức cho biết nội tâm, hai cung kia cho biết bạn xuất hiện ra ngoài thế nào. Nếu lệch nhau quá xa, có sự dồn nén.',
      'Kéo tam phương tứ chính: Phúc Đức gộp với Phu Thê, Thiên Di và cung xung chiếu Tài Bạch; cặp Phúc Đức và Tài Bạch chiếu nhau lý giải vì sao có người tiền nhiều vẫn không thấy đủ.',
      'Dịch ra hành động: thói quen tinh thần nào nên giữ, thói quen nào đang ăn mòn năng lượng dài hạn.',
    ],
    decisionQuestions: [
      'Tôi đang nuôi dưỡng nội tâm bằng gì — và cái đó có còn phù hợp năm nay?',
      'Cơn lo âu của tôi có gốc thật hay chỉ là vòng lặp suy nghĩ?',
      'Có nên đầu tư thời gian/tiền cho trị liệu, thiền, hay một khoá học chiêm nghiệm?',
      'Điều gì khiến tôi thấy đời đáng sống — và tôi đang dành bao nhiêu giờ mỗi tuần cho nó?',
      'Khi mọi thứ bên ngoài đều ổn mà trong lòng vẫn trống, tôi thường lấp bằng gì: mua sắm, công việc, hay mạng xã hội?',
      'Ai là người tôi có thể ngồi im cùng mà không cần diễn — và bao lâu rồi tôi chưa gặp họ?',
    ],
    coreQuestion:
      'Điều gì thực sự làm tôi an, và những lo âu lặp đi lặp lại của tôi bắt nguồn từ đâu?',
    readingGuide:
      'Muốn luận Phúc Đức cho sâu, bắt đầu từ sao chủ và độ sáng để nhận diện "nền cảm xúc": Thiên Đồng dễ an, Thiên Lương thích suy ngẫm, Tham Lang cần trải nghiệm mới thấy sống. Kế đó soi Tứ Hóa. Hóa Kỵ đóng cung này hay hiện ra ngoài đời thành những đêm nằm nhai lại một chuyện đã qua, càng nghĩ càng rối; dấu hiệu ấy nên được ngắt sớm, bằng vận động, bằng một người đủ tin để kể, và nó không nói gì về chuyện phước dày hay mỏng. Rồi đặt cung vào tam phương tứ chính: Phúc Đức gộp với Phu Thê, Thiên Di và cung xung chiếu Tài Bạch. Cặp Phúc Đức và Tài Bạch đáng ngẫm nhất: tiền và cảm giác đủ chiếu thẳng vào nhau, nên có người kiếm rất khá mà vẫn thấy thiếu. Bẫy của cung này là đọc thành "số sướng, số khổ". Phúc Đức không đo mức sống; nó đo khả năng chuyển những gì mình có thành bình an — và khả năng đó rèn được bằng thói quen, môi trường, có khi bằng trị liệu.',
    commonMisreads: [
      '"Phúc Đức tốt là số hưởng, có tiền có nhà." Nhầm cung: vật chất nằm ở Tài Bạch và Điền Trạch. Phúc Đức đo vốn nội tâm — khả năng thấy đủ, chịu áp lực, hồi phục sau biến cố.',
      '"Hóa Kỵ tại Phúc Đức là phước mỏng." Sai: đó là tín hiệu vòng lặp suy nghĩ tiêu cực cần nhận diện sớm — thứ can thiệp được bằng thói quen, trị liệu, môi trường.',
    ],
    trioNote:
      'Phúc Đức cùng nhóm tam hợp với Phu Thê và Thiên Di; cung xung chiếu là Tài Bạch. Đời sống tinh thần không đứng một mình: nó nương vào người bạn đời (Phu Thê) và môi trường bên ngoài (Thiên Di). Riêng cặp xung chiếu Phúc Đức và Tài Bạch là cặp kinh điển: tiền và cảm giác đủ chiếu thẳng vào nhau. Phúc Đức yếu thì tiền nhiều vẫn thấy thiếu, nên luận chuyện tiền bao giờ cũng phải ngó sang cung này.',
  },
  {
    slug: 'cung-dien-trach',
    name: 'Điền Trạch',
    fullName: 'Cung Điền Trạch (田宅宮)',
    domain: 'Nhà cửa — tài sản dài hạn',
    governs:
      'Cung Điền Trạch quản nhà cửa, đất đai, tài sản cố định và môi trường sống. Nó là "kho" của lá số, khác với Tài Bạch là "ống dẫn": tiền chảy vào nhiều mà kho không giữ được thì cuối cùng vẫn trắng tay. Cổ thư còn nhìn cung này ở chuyện thừa kế, hương hoả, đất quê. Trong đời sống hiện đại, Điền Trạch nói thêm một chuyện ít ai để ý: quan hệ của bạn với "nơi chốn" — bạn thuộc kiểu cần một mái nhà cắm rễ, hay kiểu sống xê dịch, chỗ ở chỉ là trạm dừng. Biết mình thuộc kiểu nào, quyết định mua hay thuê nhẹ đi một nửa.',
    keyStars: [
      { name: 'Thiên Phủ', signal: 'Khả năng tích luỹ tài sản, gắn bó với một nơi ở lâu dài.' },
      { name: 'Vũ Khúc', signal: 'Sao tiền đi với đất: hợp tích sản, đầu tư bất động sản có kỷ luật.' },
      { name: 'Phá Quân', signal: 'Hay chuyển nhà, đổi địa điểm; tài sản đến rồi đi.' },
      { name: 'Hoá Lộc', signal: 'Có duyên với nhà đất, mua bán dễ có lời.' },
      { name: 'Hoá Kỵ', signal: 'Vướng giấy tờ, tranh chấp; cần cẩn trọng với hợp đồng.' },
    ],
    framework: [
      'Xem chính tinh đóng cung và sao hung kèm để biết xu hướng ổn định hay xê dịch.',
      'Đối chiếu Tài Bạch (dòng tiền) và Điền Trạch (kho tài sản): vào nhiều mà không giữ lại được là vấn đề ở Điền Trạch.',
      'Kéo tam phương tứ chính: Điền Trạch gộp với Huynh Đệ, Tật Ách và cung xung chiếu Tử Tức — chỗ ở, người thân kề vai và sức vóc cùng kể chuyện "hậu phương".',
      'Áp lớp thời gian: khi Tứ Hóa của đại vận hay lưu niên rơi vào Điền Trạch, chủ đề nhà đất thường nổi lên trong giai đoạn đó — thời điểm nên rà lại giấy tờ và kế hoạch mua bán.',
      'Dịch sang quyết định: thời điểm mua, thuê hay bán — và lưu ý điều khoản pháp lý nào nếu Hoá Kỵ động.',
    ],
    decisionQuestions: [
      'Tôi nên mua nhà bây giờ, hay tích luỹ thêm và thuê thêm vài năm?',
      'Có nên chuyển về quê / chuyển ra thành phố lớn năm nay?',
      'Khoản đầu tư đất đai sắp ký có rủi ro pháp lý không?',
      'Môi trường sống hiện tại có thực sự khiến tôi nạp lại được năng lượng?',
      'Căn nhà tôi đang nhắm là để ở, để đầu tư, hay để chứng minh điều gì đó với người khác?',
      'Nếu buộc phải chuyển chỗ ở trong sáu tháng tới, tôi thấy nhẹ nhõm hay hoảng — và điều đó nói gì về nhu cầu gốc rễ của tôi?',
    ],
    coreQuestion:
      'Tôi hợp an cư một chỗ hay sống xê dịch, và tài sản dài hạn của tôi nên gom về đâu?',
    readingGuide:
      'Đọc Điền Trạch theo ba bước. Bước một, xem chính tinh giữ cung: Thiên Phủ hay Vũ Khúc nghiêng về tích sản, gắn bó một chỗ; Phá Quân nghiêng về đổi chỗ, tài sản vào ra. Bước hai, soi Tứ Hóa: Hóa Lộc là có duyên nhà đất; Hóa Kỵ là tín hiệu rà kỹ giấy tờ, pháp lý trước khi ký bất cứ thứ gì. Bước ba, đặt cung vào tam phương tứ chính: Điền Trạch gộp với Huynh Đệ, Tật Ách và cung xung chiếu Tử Tức. Nhớ phân vai với Tài Bạch: bên đó là dòng tiền, bên này là kho; kiếm tốt mà không giữ được thì vấn đề nằm ở kho, không nằm ở nguồn. Bẫy hay gặp là thấy sát tinh ở Điền Trạch liền sợ "mất nhà". Sát tinh ở đây thường chỉ nói chỗ ở kém yên hoặc hay xê dịch — một tín hiệu để cẩn trọng hợp đồng và chọn chỗ kỹ hơn, không phải điềm gở.',
    commonMisreads: [
      '"Phá Quân ở Điền Trạch là mất nhà." Sai: sao này tả xu hướng hay đổi chỗ ở, tài sản vào ra — người thuê nhà chuyển trọ nhiều lần cũng nghiệm thấy, chẳng cần "mất" gì.',
      '"Điền Trạch với Tài Bạch là một." Hai cung phân vai rõ: Tài Bạch là dòng tiền chảy, Điền Trạch là kho chứa. Kiếm giỏi mà không tích được, vấn đề nằm ở kho.',
      '"Hóa Kỵ ở đây là chắc chắn dính tranh chấp đất." Đó là tín hiệu cẩn trọng giấy tờ, hợp đồng — lời nhắc rà pháp lý kỹ hơn người khác, không phải bản án.',
    ],
    trioNote:
      'Điền Trạch cùng nhóm tam hợp với Huynh Đệ và Tật Ách; cung xung chiếu là Tử Tức. Nhóm này nói về phần "hậu phương" của lá số: chỗ ở (Điền Trạch), người thân kề vai (Huynh Đệ) và sức vóc để gánh vác (Tật Ách). Cung đối Tử Tức chiếu sang gợi một câu hỏi thực tế: tài sản này rồi để lại cho ai, cho cái gì — con cái, hay những "đứa con tinh thần" mình gây dựng. Hai cung nhà cửa và con cái nằm đối nhau, nên luận chuyện thừa kế hay để dành đều phải nhìn cả cặp.',
  },
  {
    slug: 'cung-quan-loc',
    name: 'Quan Lộc',
    fullName: 'Cung Quan Lộc (官祿宮)',
    domain: 'Sự nghiệp — vai trò xã hội',
    governs:
      'Cung Quan Lộc quản sự nghiệp, chức vụ, danh vị và vai trò xã hội. Khác với "kiếm được bao nhiêu" (việc của Tài Bạch), Quan Lộc trả lời "bạn là ai trong mắt nghề": tự làm hay làm thuê, kỹ thuật hay quản lý, sáng tạo hay vận hành, cần cấu trúc hay cần tự do. Truyền thống coi đây là cung trọng tâm khi luận định hướng nghề, nhưng luôn dặn đọc chung với Tài Bạch và Thiên Di. Một điều cần nhớ: Quan Lộc mô tả thiên hướng, không phải sự kiện — cung đẹp không tự sinh chức tước, nó chỉ cho biết bạn hợp kiểu vai trò nào để đỡ tốn một quãng đời đi vòng.',
    keyStars: [
      { name: 'Tử Vi', signal: 'Hợp vai trò lãnh đạo, điều phối; bị ép làm cấp dưới sẽ trầy trật.' },
      { name: 'Vũ Khúc', signal: 'Hợp tài chính, kỹ thuật, nghề có công thức rõ ràng.' },
      { name: 'Thất Sát', signal: 'Ra quyết định nhanh, vượt khủng hoảng tốt; hợp khởi nghiệp, mở đường, việc cạnh tranh cao.' },
      { name: 'Hoá Quyền', signal: 'Có quyền lực thực tế, được giao việc lớn — nhưng áp lực theo cùng.' },
      { name: 'Hoá Kỵ', signal: 'Va vấp trong công việc, dễ bị hiểu lầm; cần văn bản hoá.' },
    ],
    framework: [
      'Đọc chính tinh Quan Lộc để xác định "hình thái nghề" hợp khí chất.',
      'Soi độ sáng và Tứ Hóa tại cung: Hóa Quyền là được giao việc lớn kèm áp lực; Hóa Kỵ là dễ bị hiểu lầm nơi công sở, nên tập thói quen trao đổi bằng văn bản.',
      'Kéo bộ luận sự nghiệp từ cung Mệnh: Mệnh, Quan Lộc, Tài Bạch, Thiên Di kể trọn câu chuyện bạn là ai, làm gì, kiếm thế nào, gặp ai. Còn tam phương tứ chính của chính cung Quan Lộc gồm Mệnh, Tài Bạch và cung xung chiếu Phu Thê.',
      'Áp lớp thời gian: đại vận và lưu niên cho biết giai đoạn nào nên bung, giai đoạn nào nên củng cố — cùng một cung Quan Lộc, hai giai đoạn có thể cần hai chiến lược ngược nhau.',
      'Dịch sang quyết định: nên ở lại hay nhảy việc, chuyên môn hoá sâu hay mở rộng, làm thuê hay tự mở.',
    ],
    decisionQuestions: [
      'Tôi nên nhận lời thăng chức quản lý, hay tiếp tục là chuyên gia kỹ thuật?',
      'Đây có phải lúc nhảy việc, hay vấn đề nằm ở tôi chứ không phải công ty?',
      'Tôi muốn nổi tiếng trong ngành hay muốn tự chủ thời gian — và nghề tôi đang theo phục vụ vế nào?',
      'Cơ hội khởi nghiệp này hợp khí chất của tôi không, hay chỉ vì FOMO?',
      'Ba năm tới tôi muốn giỏi thêm kỹ năng nào — và công việc hiện tại có cho tôi đất luyện kỹ năng đó?',
      'Nếu bỏ hết chức danh, phần việc nào tôi vẫn muốn tự tay làm — và nó chiếm bao nhiêu phần thời gian hiện tại?',
    ],
    coreQuestion:
      'Tôi là ai trong mắt nghề: hợp vai trò nào, môi trường nào, và lúc này nên tiến, giữ hay đổi hướng?',
    readingGuide:
      'Luận Quan Lộc bắt đầu từ chính tinh để nhận "khuôn vai trò": Tử Vi hợp cầm trịch, Vũ Khúc hợp việc có công thức và kỷ luật, Thất Sát hợp mở đường trong môi trường cạnh tranh. Kế đó xem độ sáng và Tứ Hóa. Hóa Quyền đóng cung này, bạn hay được đẩy lên gánh phần việc nặng hơn chức danh đang mang, và sức ép đi kèm là cái giá của chỗ đứng. Hóa Kỵ thì hay vướng chuyện lời nói chốn làm việc: một câu dặn miệng bị nhớ sai cũng đủ thành chuyện, nên việc quan trọng cứ chốt lại qua email hay biên bản. Cung này không đứng một mình: tam phương tứ chính của Quan Lộc gồm Mệnh, Tài Bạch và cung xung chiếu Phu Thê — nghĩa là sự nghiệp luôn được luận cạnh con người thật, dòng tiền thật và đời sống gia đình. Bẫy phổ biến là tưởng Quan Lộc đẹp thì thăng tiến tự đến. Cung chỉ tả thiên hướng; ngành, cơ hội, nỗ lực vẫn quyết định phần lớn. Câu hỏi đúng không phải "bao giờ tôi lên chức" mà là "vai trò nào hợp để tôi đi đường dài".',
    commonMisreads: [
      '"Quan Lộc đẹp là chắc chắn thăng quan tiến chức." Cung tả thiên hướng, không tả sự kiện: nó nói bạn hợp kiểu vai trò nào, còn cơ hội với nỗ lực vẫn là chuyện đời thực.',
      '"Quan Lộc xấu là thất nghiệp cả đời." Sai: thường chỉ là môi trường hoặc kiểu vai trò đang chọn không hợp khí chất — đổi cách làm việc nhiều khi hết "xấu".',
      '"Chỉ cần nhìn Quan Lộc để chọn nghề." Phải kéo cả Mệnh, Tài Bạch và cung xung chiếu Phu Thê; nghề nghiệp không tách khỏi con người, dòng tiền và đời sống gia đình.',
    ],
    trioNote:
      'Quan Lộc cùng nhóm tam hợp với Mệnh và Tài Bạch; cung xung chiếu là Phu Thê. Ba cung tam hợp họp thành trục con người, sự nghiệp và tiền: khí chất nào thì hợp vai trò đó, vai trò nào thì ra dòng tiền đó. Cổ thư xếp Quan Lộc đối cung với Phu Thê: chuyện nghề và chuyện nhà chiếu thẳng vào nhau, một bên quá tải thì bên kia nhận sức ép — luận sự nghiệp tử tế phải hỏi cả nhịp sống gia đình.',
  },
  {
    slug: 'cung-no-boc',
    name: 'Nô Bộc',
    fullName: 'Cung Nô Bộc (奴僕宮)',
    domain: 'Bạn bè — cấp dưới — mạng lưới',
    governs:
      'Cung Nô Bộc nói về bạn bè, đồng nghiệp ngang vai và người làm cùng, làm dưới quyền bạn. Tên cổ nghe nặng tôn ti nên nhiều sách nay gọi là cung Bằng Hữu. Đây là cung "mạng lưới": quanh bạn có người tin cậy không, bạn dễ tìm cộng sự hay quen làm một mình, và đám đông quanh bạn đang nâng bạn lên hay rút dần năng lượng. Với người đi làm, cung này còn kể chuyện đội nhóm: bạn thu hút kiểu cộng sự nào, giữ người có bền không. Nó không đếm số bạn bè; nó tả chất của những quan hệ đó.',
    keyStars: [
      { name: 'Thiên Đồng', signal: 'Bạn bè hài hoà, dễ chia sẻ; ít xung đột.' },
      { name: 'Cự Môn', signal: 'Hay có hiểu lầm với bạn; cần nói chuyện thẳng.' },
      { name: 'Tham Lang', signal: 'Mạng lưới rộng, nhiều cuộc vui; đông nhưng cần tỉnh để biết ai thật.' },
      { name: 'Hoá Lộc', signal: 'Bạn bè giúp đỡ vật chất hoặc cơ hội nghề được.' },
      { name: 'Hoá Kỵ', signal: 'Bị bạn bè/cộng sự kéo xuống; cẩn trọng khi hùn vốn.' },
    ],
    framework: [
      'Quan sát chính tinh và sao hung — Nô Bộc tốt nghĩa là bạn bè "đỡ" được mình; xấu nghĩa là mạng lưới rút năng lượng.',
      'Soi Hóa Lộc / Hóa Kỵ tại đây, vì cung này nhạy chuyện hùn hạp: Lộc là bạn mang cơ hội tới; Kỵ là tín hiệu cẩn trọng khi chung tiền, đứng tên hộ, bảo lãnh.',
      'Đối chiếu Quan Lộc: cộng sự trong nghề có hỗ trợ bạn hay đang là rào cản?',
      'Kéo tam phương tứ chính: Nô Bộc gộp với Tử Tức, Phụ Mẫu và cung xung chiếu Huynh Đệ — vòng người rộng và vòng người ruột soi lẫn nhau.',
      'Dịch sang quyết định: ai trong vòng tròn cần giữ thân hơn, ai cần dãn ra, có nên mở rộng mạng lưới chủ động trong năm tới.',
    ],
    decisionQuestions: [
      'Tôi nên hùn vốn với người bạn này — hay giữ tình bạn và tìm cộng sự khác?',
      'Vòng tròn bạn bè hiện tại đang nâng tôi lên hay kéo tôi xuống?',
      'Tôi cô đơn vì khí chất, hay vì chưa thực sự đầu tư cho quan hệ?',
      'Có nên xây cộng đồng quanh chuyên môn của mình thay vì làm một mình?',
      'Ba người tôi gặp nhiều nhất nửa năm qua đang kéo tôi về hướng nào?',
      'Tôi là người cho đi hay người nhận trong phần lớn quan hệ — và tỷ lệ đó có đang làm tôi kiệt sức?',
    ],
    coreQuestion:
      'Mạng lưới quanh tôi đang nâng tôi lên hay rút năng lượng của tôi, và ai là người đáng giữ thân?',
    readingGuide:
      'Cung Nô Bộc luận theo phép trừ: trước hết bỏ định kiến từ cái tên. Nó không xếp hạng ai hầu ai; nó tả chất lượng vòng người ngang vai quanh bạn. Xem chính tinh: Thiên Đồng là mạng lưới êm, ít va chạm; Cự Môn là dễ hiểu lầm, cần nói thẳng; Tham Lang là quen rộng, vui nhiều nhưng cần lọc. Soi tiếp Hóa Lộc và Hóa Kỵ, vì cung này dính nhiều tới chuyện hùn hạp. Lộc đóng ở đây, cơ hội làm ăn hay đến qua người quen giới thiệu. Kỵ thì ngược lại: lời rủ góp vốn, nhờ đứng tên, nhờ bảo lãnh cần đọc kỹ gấp đôi, càng thân càng phải rõ giấy tờ. Đặt cung vào tam phương tứ chính: Nô Bộc gộp với Tử Tức, Phụ Mẫu và cung xung chiếu Huynh Đệ — vòng xã giao rộng luôn được so với vòng ruột thịt. Bẫy lớn nhất là đọc Nô Bộc xấu thành "sẽ bị phản bội". Cung chỉ nhắc bạn chọn lọc và giữ ranh giới tiền bạc, không phán ai sẽ trở mặt.',
    commonMisreads: [
      '"Tên Nô Bộc nghĩa là cung này coi bạn bè như người hầu." Tên cổ mang dấu thời đại; nhiều sách nay gọi là cung Bằng Hữu, và nội dung thật là chất lượng mạng lưới ngang vai quanh bạn.',
      '"Nô Bộc xấu là sẽ bị bạn bè phản bội." Sai: đó là tín hiệu chọn lọc kỹ hơn và giữ ranh giới tiền bạc — nhất là khi hùn vốn — không phải lời phán ai đó sẽ trở mặt.',
    ],
    trioNote:
      'Nô Bộc cùng nhóm tam hợp với Tử Tức và Phụ Mẫu; cung xung chiếu là Huynh Đệ. Nhóm tam hợp này gom đủ các vòng người quanh bạn: người trên (Phụ Mẫu), người sau mình (Tử Tức) và mạng lưới ngang vai (Nô Bộc). Cung đối Huynh Đệ chiếu sang là một phép thử hay: bạn xã giao đông tới đâu cũng phải so với số người thân được như ruột thịt — hai cung này lệch nhau quá xa là tín hiệu đáng ngồi lại xem mình đang đầu tư quan hệ kiểu gì.',
  },
  {
    slug: 'cung-thien-di',
    name: 'Thiên Di',
    fullName: 'Cung Thiên Di (遷移宮)',
    domain: 'Di chuyển — ra ngoài xã hội',
    governs:
      'Cung Thiên Di là "khuôn mặt ra ngoài": bạn thể hiện thế nào khi rời khỏi nhà, người lạ đọc bạn ra sao trong lần gặp đầu. Nó cũng quản chuyện di chuyển: đi xa, du học, xuất ngoại, đổi môi trường sống có thuận không. Trên lá số, Thiên Di luôn nằm đối diện cung Mệnh, và cấu trúc này có ý riêng: con người bên trong và cách xuất hiện bên ngoài là hai nửa của cùng một câu chuyện, nửa này thiếu gì thì nhìn sang nửa kia. Có người Mệnh lặng mà ra ngoài như thay pin; lại có người chỉ thật sự là mình khi ở nhà.',
    keyStars: [
      { name: 'Thiên Mã', signal: 'Sao di động điển hình: hay xê dịch, hợp công việc đi lại nhiều; gặp Lộc Tồn thành cách Lộc Mã — tiền theo bước chân.' },
      { name: 'Thái Dương', signal: 'Ra ngoài được trọng vọng, hợp đi xa lập nghiệp.' },
      { name: 'Cự Môn', signal: 'Ra ngoài dễ gặp khẩu thiệt; cần thận trọng lời nói.' },
      { name: 'Hoá Lộc', signal: 'Đi xa có cơ hội tài chính, hợp xuất ngoại.' },
      { name: 'Hoá Kỵ', signal: 'Đi xa gặp trở ngại; nên cân nhắc kỹ chuyến đi quan trọng.' },
    ],
    framework: [
      'Đọc chính tinh Thiên Di và mức độ cát hung — Thiên Di tốt mà Mệnh hãm thường được luận "đi xa thì khá hơn ở nhà".',
      'Nhớ cấu trúc: Thiên Di luôn là cung đối của Mệnh trên mọi lá số — "xung" ở đây là cấu trúc, không phải điềm; cái cần xem là sao bên trong cát hay sát.',
      'So sánh Mệnh vs Thiên Di: cùng tốt → linh hoạt; Mệnh xấu Thiên Di tốt → đi xa phát; Mệnh tốt Thiên Di xấu → ở yên thì thuận.',
      'Áp lớp thời gian: Tứ Hóa lưu rơi vào Thiên Di thường trùng giai đoạn chuyện đi lại, đổi môi trường nổi lên — thời điểm để cân nhắc lời mời xa nhà nghiêm túc hơn.',
      'Dịch sang quyết định: thời điểm chuyển môi trường, du học, hay nhận dự án quốc tế.',
    ],
    decisionQuestions: [
      'Tôi nên nhận cơ hội đi nước ngoài 2 năm — hay ở lại củng cố nền tảng trong nước?',
      'Tôi hợp làm việc tại văn phòng cố định hay nghề phải đi lại?',
      'Khuôn mặt xã hội của tôi khác con người thật bao nhiêu, và tôi có ổn với điều đó?',
      'Chuyến đi/khoá học xa nhà sắp tới có thực sự xứng với chi phí?',
      'Lần gần nhất rời vùng quen, tôi đã lớn lên hay chỉ mệt hơn — và điều gì tạo ra khác biệt đó?',
      'Tôi muốn đi vì phía trước có điều đáng tới, hay vì phía sau có điều muốn trốn?',
    ],
    coreQuestion:
      'Ra khỏi vùng quen — đi xa, đổi môi trường, xuất ngoại — tôi thuận hơn hay khó hơn ở yên?',
    readingGuide:
      'Luận Thiên Di trước hết phải nhớ một điều về cấu trúc: cung này luôn đối diện cung Mệnh trên mọi lá số, nên "Mệnh xung Thiên Di" không phải điềm — cái cần xem là sao bên trong cát hay sát. Đọc chính tinh: Thiên Mã là hay xê dịch, hợp nghề di chuyển; Thái Dương là ra ngoài được trọng vọng; Cự Môn nhắc giữ lời nơi xa lạ. So sánh trực tiếp với Mệnh: Mệnh lặng mà Thiên Di sáng, đổi môi trường thường có lợi; Mệnh vững mà Thiên Di nhiều sát tinh, ở yên xây nền lại hay hơn. Tam phương tứ chính của cung này gồm Phu Thê, Phúc Đức và cung xung chiếu Mệnh. Bẫy hay gặp: tưởng Thiên Di đẹp thì phải xuất ngoại mới thành công. Không hẳn — cung chỉ nói bạn thuận khi đổi môi trường, mà "môi trường" có thể là thành phố khác, ngành khác, thậm chí một vòng quan hệ khác.',
    commonMisreads: [
      '"Mệnh xung Thiên Di là điềm xấu." Mọi lá số đều vậy: Thiên Di là cung đối của Mệnh theo cấu trúc. Cái cần xem là sao bên trong cát hay sát, không phải chuyện "xung".',
      '"Thiên Di đẹp thì phải ra nước ngoài mới thành công." Cung chỉ nói bạn thuận khi đổi môi trường; môi trường mới có thể là thành phố khác, ngành khác, không nhất thiết xuất ngoại.',
    ],
    trioNote:
      'Thiên Di cùng nhóm tam hợp với Phu Thê và Phúc Đức; cung xung chiếu là Mệnh. Nghe lạ mà hợp lý: cách bạn thể hiện khi ra ngoài (Thiên Di) dính chặt với nền tinh thần (Phúc Đức) và người đồng hành (Phu Thê). Còn cặp Mệnh và Thiên Di là trục đối chiếu nổi tiếng nhất lá số: con người bên trong và khuôn mặt ngoài xã hội chiếu thẳng vào nhau — Mệnh hãm mà Thiên Di sáng thường được luận "đi xa thì khá hơn ở nhà".',
  },
  {
    slug: 'cung-tat-ach',
    name: 'Tật Ách',
    fullName: 'Cung Tật Ách (疾厄宮)',
    domain: 'Sức khoẻ — tai ách',
    governs:
      'Cung Tật Ách phản ánh sức khoẻ, thể chất và những rủi ro thân thể theo cách nhìn cổ truyền: cơ địa bền hay mỏng, hệ cơ quan nào dễ yếu, cơ thể phản ứng với căng thẳng ra sao. Giá trị thật của cung này không nằm ở chuyện "đoán bệnh" — nó không đoán được và không nên dùng để đoán. Giá trị nằm ở chỗ nhắc bạn tầm soát chủ động: biết mình dễ yếu ở đâu để đầu tư phòng ngừa sớm, thay vì đợi cơ thể lên tiếng. Mọi triệu chứng thật đều thuộc về bác sĩ, không thuộc về lá số; cung này chỉ giúp bạn xếp lịch khám trước khi có triệu chứng.',
    keyStars: [
      { name: 'Thiên Cơ', signal: 'Thần kinh nhạy, dễ mất ngủ; cần quản lý stress.' },
      { name: 'Liêm Trinh', signal: 'Tim mạch, huyết áp, máu — cần khám định kỳ.' },
      { name: 'Cự Môn', signal: 'Tiêu hoá, miệng — chú ý ăn uống, răng lợi.' },
      { name: 'Thái Âm', signal: 'Phụ khoa / nội tiết / mắt; cần chăm sóc giấc ngủ.' },
      { name: 'Hoá Kỵ', signal: 'Đề tài sức khoẻ dễ thành ám ảnh hoặc bị bỏ bê — chọn một thái cực sai sẽ tổn hại.' },
    ],
    framework: [
      'Đọc chính tinh và sao hung tại Tật Ách để biết hệ cơ quan nào dễ tổn thương (theo cách gán cổ truyền).',
      'Đối chiếu với cung Mệnh và Phúc Đức: nhiều bệnh tâm thể bắt nguồn từ căng thẳng nội tâm.',
      'Đừng dừng ở một sao: sát tinh tại Tật Ách là tín hiệu nhắc giữ gìn, không phải dự báo bệnh; lấy một sao ra hù dọa là kiểu đọc sai kinh điển.',
      'Kéo tam phương tứ chính: Tật Ách gộp với Huynh Đệ, Điền Trạch và cung xung chiếu Phụ Mẫu — nơi cổ truyền gửi manh mối về sức khoẻ thừa hưởng.',
      'Dịch ra hành động cụ thể: gói tầm soát nào nên làm năm nay, thói quen nào cần thay đổi, lúc nào nên đi khám thay vì chịu đựng.',
    ],
    decisionQuestions: [
      'Tôi nên đầu tư vào gói khám tổng quát chuyên sâu — hay chỉ duy trì khám cơ bản?',
      'Triệu chứng kéo dài này là do stress công việc hay thực sự cần chuyên khoa?',
      'Có nên thay đổi lối sống (giấc ngủ, vận động, ăn uống) trước khi cơ thể "lên tiếng" mạnh hơn?',
      'Bảo hiểm sức khoẻ hiện tại có đủ cho rủi ro mà cung này cảnh báo?',
      'Cơ thể tôi thường báo trước bằng tín hiệu nào khi quá tải: mất ngủ, đau vai gáy, hay rối loạn tiêu hoá?',
      'Tôi đang coi sức khoẻ là tài sản để đầu tư hay chi phí để cắt — lịch tuần này phản ánh câu trả lời nào?',
    ],
    coreQuestion:
      'Cơ thể tôi dễ yếu ở hệ nào, và nên chủ động tầm soát, điều chỉnh lối sống ra sao?',
    readingGuide:
      'Tật Ách là cung phải luận thận trọng nhất lá số. Trình tự: xem chính tinh để biết hệ cơ quan mà cổ truyền gán cho sao đó — Thiên Cơ với thần kinh và giấc ngủ, Liêm Trinh với tim mạch, Cự Môn với tiêu hoá, Thái Âm với nội tiết; rồi xem sát tinh và Hóa Kỵ để biết mức độ cần để tâm. Đặt cung vào tam phương tứ chính: Tật Ách gộp với Huynh Đệ, Điền Trạch và cung xung chiếu Phụ Mẫu, nơi cổ truyền gửi manh mối về sức khoẻ thừa hưởng: tiền sử bệnh của gia đình là dữ kiện thật, đáng tra hơn mọi lá số. Hai bẫy cần tránh tuyệt đối: một, đọc thành chẩn đoán kiểu "cung này báo bệnh gan" — lá số không chẩn đoán được; hai, lấy một sát tinh ra hù dọa. Cách dùng đúng chỉ có một: biến tín hiệu thành lịch tầm soát định kỳ và thói quen sống, còn triệu chứng thật thì đi bác sĩ, không đi xem số.',
    commonMisreads: [
      '"Cung Tật Ách báo trước bệnh gì, năm nào phát." Lá số không chẩn đoán và không hẹn ngày; nó chỉ gợi hệ cơ quan nên để tâm để tầm soát sớm. Triệu chứng thật thì đi bác sĩ.',
      '"Tật Ách nhiều sát tinh là đoản mệnh." Đây là kiểu hù dọa kinh điển cần tránh xa: sát tinh chỉ là tín hiệu nhắc giữ gìn, và tuổi thọ không sao nào phán được.',
    ],
    trioNote:
      'Tật Ách cùng nhóm tam hợp với Huynh Đệ và Điền Trạch; cung xung chiếu là Phụ Mẫu. Nhóm này là phần hậu cần của đời sống: sức vóc (Tật Ách), người thân kề vai (Huynh Đệ), chốn ở (Điền Trạch) — nền có vững thì các cung tiền tài, sự nghiệp mới đứng được. Cung đối Phụ Mẫu chiếu sang khớp với ý cổ truyền rằng thể chất có phần thừa hưởng từ gia đình, nên tiền sử sức khoẻ nhà mình là dữ kiện đáng tra trước mọi lá số.',
  },
  {
    slug: 'cung-tai-bach',
    name: 'Tài Bạch',
    fullName: 'Cung Tài Bạch (財帛宮)',
    domain: 'Tiền bạc — dòng tiền',
    governs:
      'Cung Tài Bạch quản dòng tiền hằng ngày: tiền vào, tiền ra, cách bạn kiếm và cách bạn tiêu. Khác với Điền Trạch là kho tài sản, Tài Bạch là "ống dẫn" — nó tả phong cách kiếm tiền (đều đặn hay đột biến, một nguồn hay đa nguồn) và cả mối quan hệ tâm lý của bạn với đồng tiền: coi tiền là an toàn, là công cụ, hay là nguồn căng thẳng. Phần tâm lý này thường quan trọng hơn phần kỹ thuật, vì người sợ tiền lẫn người ham tiền đều ra quyết định méo. Cung này không chọn giúp mã cổ phiếu; nó giúp bạn hiểu bàn tay đang cầm tiền.',
    keyStars: [
      { name: 'Vũ Khúc', signal: 'Sao tiền điển hình: kỷ luật tài chính, quyết đoán kinh doanh; gặp sát tinh dễ căng thẳng vì tiền.' },
      { name: 'Thiên Phủ', signal: 'Giữ tiền giỏi, ít rủi ro, tích luỹ tốt.' },
      { name: 'Phá Quân', signal: 'Tiền vào ra mạnh, không tích được lâu.' },
      { name: 'Hoá Lộc', signal: 'Có duyên với tiền, dòng vào dễ.' },
      { name: 'Hoá Kỵ', signal: 'Tiền vướng nợ, lừa đảo hoặc tranh chấp; cẩn trọng giao dịch lớn.' },
    ],
    framework: [
      'Đọc chính tinh Tài Bạch để biết "hình thái dòng tiền" — đều đặn hay đột biến, tự tay kiếm hay từ hệ thống.',
      'Soi Tứ Hóa: Hóa Lộc là dòng vào có duyên nhưng phải kỷ luật mới giữ được; Hóa Kỵ là tín hiệu rà nợ nần, hợp đồng, khoản cho vay.',
      'Đối chiếu Quan Lộc (nghề) và Điền Trạch (tài sản): nghề kiếm được nhưng không tích được = lỗ hổng ở Điền Trạch hoặc Phúc Đức.',
      'Nhớ lằn ranh: cung này luận phong cách và tâm lý với tiền, không chọn mã cổ phiếu, không thay tư vấn tài chính có giấy phép.',
      'Dịch sang quyết định tài chính: ngưỡng rủi ro hợp lý, kênh tiết kiệm/đầu tư nào, khi nào nên dừng tay.',
    ],
    decisionQuestions: [
      'Tôi nên đầu tư vào cổ phiếu/quỹ ổn định — hay khoản rủi ro cao có thể đổi đời?',
      'Vì sao tôi kiếm được nhưng cuối tháng không còn gì — vấn đề ở thu hay chi?',
      'Có nên vay để mở rộng việc làm ăn, hay giai đoạn này cần co lại?',
      'Mối quan hệ tâm lý của tôi với tiền (sợ hay tham) đang chi phối quyết định không?',
      'Khoản chi nào tháng nào cũng lặp lại mà tôi chưa từng chất vấn?',
      'Nếu thu nhập đứt ba tháng, tôi cầm cự được bao lâu — và con số đó khiến tôi muốn làm gì ngay tuần này?',
    ],
    coreQuestion:
      'Tiền của tôi vào ra theo kiểu nào, và tâm lý của tôi với tiền đang giúp hay đang phá các quyết định lớn?',
    readingGuide:
      'Luận Tài Bạch đi từ "hình thái dòng tiền": chính tinh cho biết tiền của bạn vào đều hay vào theo đợt — Vũ Khúc và Thiên Phủ nghiêng về kỷ luật, tích luỹ; Phá Quân là vào mạnh ra mạnh, cần chặn bớt đầu ra. Soi Tứ Hóa: Hóa Lộc là dòng vào có duyên nhưng phải kỷ luật mới giữ được; Hóa Kỵ là tín hiệu rà nợ nần, hợp đồng, khoản cho vay. Đặt cung vào tam phương tứ chính: Tài Bạch gộp với Mệnh, Quan Lộc và cung xung chiếu Phúc Đức. Cặp Tài Bạch và Phúc Đức trả lời câu hỏi nhiều người mắc: vì sao kiếm được mà vẫn thấy thiếu — vì cảm giác đủ nằm bên Phúc Đức, không nằm trong số dư tài khoản. Bẫy cần tránh: dùng cung này chọn kênh đầu tư cụ thể. Lá số tả phong cách và tâm lý với tiền; chọn mã, chọn kênh là việc của kiến thức tài chính và khẩu vị rủi ro thật.',
    commonMisreads: [
      '"Tài Bạch yếu là số nghèo." Sai: cung tả phong cách quản tiền — dễ tiêu tuỳ hứng, thu nhập không đều. Người Tài Bạch yếu mà kỷ luật vẫn tích luỹ tốt hơn người cung đẹp mà phóng tay.',
      '"Hóa Lộc tại Tài Bạch là sắp trúng lớn, cứ mạnh tay." Lộc là duyên và cơ hội, không phải két sắt: thiếu kỷ luật thì dòng vào bao nhiêu trôi đi bấy nhiêu.',
      '"Xem Tài Bạch để biết nên mua cổ phiếu nào." Cung này không chọn kênh đầu tư; nó chỉ giúp bạn hiểu tâm lý của chính mình khi cầm tiền.',
    ],
    trioNote:
      'Tài Bạch cùng nhóm tam hợp với Mệnh và Quan Lộc; cung xung chiếu là Phúc Đức. Tiền không tự đứng một mình: nó ra từ con người (Mệnh) và vai trò nghề (Quan Lộc), nên bộ ba này luôn luận chung. Cặp xung chiếu Tài Bạch và Phúc Đức là bài học kinh điển: tiền và cảm giác đủ chiếu vào nhau, kiếm giỏi mà nền tinh thần mỏng thì bao nhiêu cũng thấy thiếu — muốn sửa chuyện tiền, lắm khi phải sửa từ tâm thái.',
  },
  {
    slug: 'cung-tu-tuc',
    name: 'Tử Tức',
    fullName: 'Cung Tử Tức (子息宮)',
    domain: 'Con cái — sáng tạo — kế thừa',
    governs:
      'Cung Tử Tức quản chuyện con cái: mối quan hệ với con, độ vất vả khi nuôi dạy, kiểu tính cách con dễ mang. Cổ thư còn xem cả chuyện sinh nở ở cung này, nhưng đó là lĩnh vực của y khoa hiện đại — lá số chỉ nên dùng cho phần quan hệ và cách nuôi dạy. Cách đọc hiện đại mở rộng thêm một tầng đáng giá: Tử Tức là cung của mọi "đứa con", gồm cả con tinh thần như dự án, tác phẩm, học trò, doanh nghiệp bạn gây dựng. Người không sinh con vẫn có cung Tử Tức sống động; câu hỏi chỉ đổi từ "nuôi con thế nào" thành "nuôi thứ mình tạo ra thế nào".',
    keyStars: [
      { name: 'Thiên Đồng', signal: 'Con hiền, quan hệ ấm áp.' },
      { name: 'Tham Lang', signal: 'Con thông minh, hiếu động; có thể có nhiều con.' },
      { name: 'Thất Sát', signal: 'Con cá tính mạnh, khó kèm cặp theo lối truyền thống.' },
      { name: 'Hoá Lộc', signal: 'Con cái có duyên tài lộc, hỗ trợ cha mẹ.' },
      { name: 'Hoá Kỵ', signal: 'Có khó khăn về sinh nở hoặc lo nghĩ kéo dài về con.' },
    ],
    framework: [
      'Đọc chính tinh và sao hung để biết "phong cách làm cha mẹ" hợp với bạn.',
      'Mở rộng nghĩa hiện đại: cung này còn nói về "con tinh thần" — dự án, tác phẩm, học trò; người không sinh con vẫn có cung Tử Tức sống động.',
      'Đối chiếu Phu Thê và Phúc Đức: gốc gia đình bạn dựng có vững không, có đủ năng lượng tinh thần để nuôi dạy không.',
      'Kéo tam phương tứ chính: Tử Tức gộp với Nô Bộc, Phụ Mẫu và cung xung chiếu Điền Trạch — dòng chảy thế hệ và tổ ấm luận chung một mạch.',
      'Dịch sang quyết định: thời điểm sinh con, phong cách giáo dục, đầu tư cho dự án sáng tạo của riêng bạn.',
    ],
    decisionQuestions: [
      'Vợ chồng tôi nên có con vào năm nào — hay tập trung sự nghiệp thêm vài năm?',
      'Tôi đang ép con vào khuôn mình muốn — hay thực sự nghe con là ai?',
      'Dự án sáng tạo cá nhân của tôi có đáng đầu tư tiếp, hay đang trở thành gánh nặng?',
      'Có nên cân nhắc hỗ trợ y tế (IVF, hiếm muộn) thay vì chờ tự nhiên?',
      'Tôi muốn truyền lại điều gì — tiền, nghề, hay cách sống — và tôi đã bắt đầu chưa?',
      'Con tôi (hoặc học trò, đàn em) đang cần tôi lùi lại ở điểm nào để tự lớn?',
    ],
    coreQuestion:
      'Tôi nuôi lớn "những đứa con" của mình — con cái lẫn dự án, tác phẩm — theo cách nào thì thuận?',
    readingGuide:
      'Cung Tử Tức luận theo hai tầng. Tầng truyền thống là quan hệ với con: chính tinh gợi kiểu tính cách con dễ mang và cách kèm cặp hợp — Thiên Đồng là con hiền, quan hệ ấm; Tham Lang là con lanh, hiếu động, cần đất chạy; Thất Sát là con cá tính mạnh, ép khuôn chỉ gãy. Tầng hiện đại rộng hơn: mọi thứ bạn "sinh ra và nuôi lớn" — dự án, tác phẩm, học trò — đều đọc được ở đây, nên người chưa hoặc không sinh con vẫn dùng được cung này. Soi thêm Hóa Kỵ: thường là lo nghĩ kéo dài về con cái, hoặc về đứa con tinh thần đang nuôi. Tam phương tứ chính: Tử Tức gộp với Nô Bộc, Phụ Mẫu và cung xung chiếu Điền Trạch. Bẫy nặng nhất là đọc "Tử Tức xấu" thành "không có con" hay "con hư". Chuyện sinh nở thuộc y khoa, còn con người thì không sao nào phán trước được; cung chỉ gợi cách nuôi cho thuận tay.',
    commonMisreads: [
      '"Tử Tức xấu là không có con." Chuyện sinh nở thuộc về y khoa, không thuộc về lá số. Cung này tả mối quan hệ và nỗi lo quanh chuyện con cái, cùng cách nuôi dạy cho thuận.',
      '"Thất Sát ở Tử Tức là con hư, khó dạy." Sai: đó là con cá tính mạnh — ép vào khuôn truyền thống thì gãy, đổi cách kèm thì thành đứa trẻ có chủ kiến.',
      '"Người không sinh con thì cung này bỏ trống." Cách đọc hiện đại xem đây là cung của mọi "đứa con": dự án, tác phẩm, học trò — ai đang nuôi lớn một thứ gì đó đều dùng được.',
    ],
    trioNote:
      'Tử Tức cùng nhóm tam hợp với Nô Bộc và Phụ Mẫu; cung xung chiếu là Điền Trạch. Nhóm tam hợp xếp bạn vào giữa một dòng chảy thế hệ: nhận từ người trên (Phụ Mẫu), trao cho người sau (Tử Tức), cùng những người đồng hành ngang vai (Nô Bộc). Cung đối Điền Trạch chiếu sang đặt câu hỏi thực tế: tổ ấm và tài sản gây dựng rồi sẽ về đâu — hai cung con cái và nhà cửa nằm đối nhau trên lá số, luận chuyện thừa kế hay để dành đều phải nhìn cả cặp.',
  },
  {
    slug: 'cung-phu-the',
    name: 'Phu Thê',
    fullName: 'Cung Phu Thê (夫妻宮)',
    domain: 'Hôn nhân — bạn đời',
    governs:
      'Cung Phu Thê phản ánh hôn nhân và người bạn đời: kiểu người bạn dễ rung động, kiểu quan hệ bạn dễ rơi vào, độ bền và điểm dễ va chạm. Khác chuyện "yêu ai" thoáng qua, cung này nói về người sống cùng nhà, cùng đếm tiền, cùng nuôi con. Nó không phán "hợp" hay "khắc" tuyệt đối — thứ nó tả là khuôn mẫu: bạn cần gì ở một người, bạn dễ vấp ở đâu, và bài học nào lặp lại qua các mối quan hệ. Đọc đúng, cung Phu Thê giống tấm gương soi cách mình yêu hơn là lời tiên tri về người sẽ cưới.',
    keyStars: [
      { name: 'Thái Âm', signal: 'Bạn đời dịu dàng, gia đình êm ấm.' },
      { name: 'Thái Dương', signal: 'Bạn đời mạnh mẽ, có vị trí xã hội.' },
      { name: 'Tham Lang', signal: 'Quan hệ nhiều sắc thái, đam mê cao; cần ổn định mới bền.' },
      { name: 'Hoá Quyền', signal: 'Bạn đời có quyền lực, cá tính mạnh; cần tôn trọng nhau.' },
      { name: 'Hoá Kỵ', signal: 'Có nút thắt khó gỡ trong tình cảm — không phải định mệnh, là chỗ phải làm việc.' },
    ],
    framework: [
      'Đọc chính tinh và sao hung tại Phu Thê để hình dung "khuôn người" hợp với bạn.',
      'Soi Tứ Hóa: Hóa Kỵ tại Phu Thê là nút thắt giao tiếp và kỳ vọng cần làm việc, không phải định mệnh chia tay — khác biệt giữa hai cách đọc này là khác biệt giữa công cụ và lời nguyền.',
      'Đối chiếu Mệnh và Tử Tức: bạn là ai trong tình yêu, và bạn có sẵn sàng cho phần sau (nuôi con cùng) không.',
      'Kéo tam phương tứ chính: Phu Thê gộp với Thiên Di, Phúc Đức và cung xung chiếu Quan Lộc — hôn nhân không tách khỏi môi trường sống, nền tinh thần và nhịp công việc.',
      'Dịch sang quyết định: nên đầu tư cho mối quan hệ hiện tại, hay buông; nên cưới năm nào, làm sao dung hoà khi cá tính khác.',
    ],
    decisionQuestions: [
      'Mối quan hệ này đang bế tắc do bản chất khác biệt hay do thiếu giao tiếp?',
      'Tôi nên cưới năm nay — hay cần thêm thời gian để cả hai trưởng thành?',
      'Tôi đang chọn bạn đời theo khí chất thật của mình, hay theo kỳ vọng gia đình?',
      'Có ranh giới nào trong hôn nhân cần đặt lại để cả hai cùng thở được?',
      'Điều tôi phàn nàn nhiều nhất về người ấy có phải cũng là điều từng hút tôi lúc đầu?',
      'Hai đứa cãi nhau về tiền, về giờ giấc, hay thực ra về việc ai được quyền quyết?',
    ],
    coreQuestion:
      'Tôi hợp kiểu bạn đời nào, mối quan hệ của tôi bền ở đâu và dễ va chạm ở điểm nào?',
    readingGuide:
      'Luận Phu Thê bắt đầu từ chính tinh để hình dung "khuôn người" bạn dễ rung động: Thái Âm là kiểu dịu, chăm; Thái Dương là kiểu mạnh, có vị thế; Tham Lang là quan hệ đậm đà nhiều sắc thái, cần nền ổn định mới bền. Kế đó soi Tứ Hóa: Hóa Quyền là bạn đời cá tính mạnh, cần học chia quyền; Hóa Kỵ là nút thắt giao tiếp và kỳ vọng — chỗ phải làm việc, không phải "định mệnh chia tay". Đặt cung vào tam phương tứ chính: Phu Thê gộp với Thiên Di, Phúc Đức và cung xung chiếu Quan Lộc; hôn nhân vì thế luôn được luận cạnh nền tinh thần của chính bạn và nhịp công việc của cả hai. Bẫy phổ biến nhất: mang lá số hai người ra "chấm hợp khắc" rồi kết luận bỏ hay cưới. Cung Phu Thê tả cách bạn yêu và chỗ bạn dễ vấp; quyết định hệ trọng cần dữ kiện đời thực, có khi cần cả người tư vấn chuyên môn.',
    commonMisreads: [
      '"Hóa Kỵ tại Phu Thê là định mệnh chia tay." Sai: đó là nút thắt giao tiếp và kỳ vọng cần làm việc — nhiều cặp bền lâu chính vì biết mình phải làm việc ở chỗ nào.',
      '"Phu Thê xấu là không có duyên hôn nhân." Cung tả kiểu quan hệ dễ gặp, không tả kết cục; nhận ra khuynh hướng là bước đầu để chọn người và cách yêu phù hợp hơn.',
      '"Ghép hai lá số thấy khắc là nên bỏ." Không có phép "chấm hợp khắc tuyệt đối" nào đủ tin để quyết chuyện hệ trọng; quan hệ là quá trình hai người cùng học, không phải phép cộng hai lá số.',
    ],
    trioNote:
      'Phu Thê cùng nhóm tam hợp với Thiên Di và Phúc Đức; cung xung chiếu là Quan Lộc. Hôn nhân trong Tử Vi không đọc một mình: nó nương vào nền tinh thần của chính bạn (Phúc Đức) và cách hai người bước ra thế giới (Thiên Di). Cặp đối Phu Thê và Quan Lộc chiếu thẳng vào nhau: nghề nghiệp căng thì gia đạo nhận sóng, gia đạo ấm thì sự nghiệp có hậu phương — luận bên này mà quên bên kia là luận thiếu một nửa.',
  },
  {
    slug: 'cung-huynh-de',
    name: 'Huynh Đệ',
    fullName: 'Cung Huynh Đệ (兄弟宮)',
    domain: 'Anh chị em — đồng đội ruột',
    governs:
      'Cung Huynh Đệ quản anh chị em ruột: quan hệ thân hay nhạt, có đỡ nhau được không, có khúc mắc gì âm ỉ. Lối xem cũ có đếm cả số anh em ở cung này, nhưng thời sinh ít con, phần đáng dùng là chất của quan hệ chứ không phải con số. Cách đọc hiện đại mở rộng ra "đồng đội ruột": những người gắn bó như máu mủ dù không cùng nhà — bạn nối khố, cộng sự sáng lập, đồng nghiệp vào sinh ra tử. Cung này trả lời một câu hỏi mà nhiều người né: quanh mình có ai là ruột thịt thật sự không, hay chỉ đông người quen.',
    keyStars: [
      { name: 'Thiên Đồng', signal: 'Anh chị em hoà hợp, hỗ trợ nhau.' },
      { name: 'Thiên Cơ', signal: 'Anh chị em thông minh, mỗi người đi một hướng.' },
      { name: 'Cự Môn', signal: 'Hay tranh cãi với anh chị em dù bản chất vẫn yêu thương.' },
      { name: 'Hoá Lộc', signal: 'Anh chị em hỗ trợ vật chất hoặc cùng làm ăn được.' },
      { name: 'Hoá Kỵ', signal: 'Có khúc mắc khó nói; cần dành thời gian thật để hoá giải.' },
    ],
    framework: [
      'Đọc chính tinh để hình dung số lượng và hình thái quan hệ với anh chị em.',
      'Soi Hóa Lộc / Hóa Kỵ trước mọi quyết định chung tiền với người thân: Lộc là cùng làm ăn được; Kỵ là khúc mắc khó nói, thứ chỉ gỡ bằng thời gian thật ngồi với nhau.',
      'Đối chiếu Phụ Mẫu và Nô Bộc: gia đình gốc + bạn bè cùng kể chuyện "hệ hỗ trợ" của bạn dày hay mỏng.',
      'Kéo tam phương tứ chính: Huynh Đệ gộp với Tật Ách, Điền Trạch và cung xung chiếu Nô Bộc — vòng ruột thịt luôn được so với vòng xã giao.',
      'Dịch sang quyết định: có nên hợp tác kinh doanh với anh chị em, có món nợ tình cảm nào cần trả, có cuộc gặp nào nên chủ động.',
    ],
    decisionQuestions: [
      'Tôi có nên cùng anh/chị/em mở công ty — hay tách rõ kinh tế để giữ tình?',
      'Tôi đang gánh thay vai trò của anh/chị/em — và điều đó có công bằng?',
      'Có cuộc trò chuyện nào với anh chị em tôi đã trì hoãn quá lâu?',
      'Đồng đội thân nhất hiện tại của tôi có thực sự là "huynh đệ" — hay tôi đang một mình mà không biết?',
      'Trong nhà, ai đang là người giữ hoà khí — và cái giá người đó trả có ai nhìn thấy không?',
      'Nếu mai này cha mẹ không còn, anh chị em tôi còn lý do gì để gặp nhau — và tôi có muốn xây lý do đó từ bây giờ?',
    ],
    coreQuestion:
      'Anh chị em và những cộng sự thân như ruột thịt là chỗ dựa của tôi, hay là món nợ tình cảm tôi đang gánh?',
    readingGuide:
      'Cung Huynh Đệ đọc nhẹ tay nhưng đọc thật. Chính tinh cho biết hình thái quan hệ: Thiên Đồng là anh em hoà thuận, đỡ nhau được; Thiên Cơ là mỗi người một hướng, thân mà ít gặp; Cự Môn là hay cãi nhau dù bản chất vẫn thương. Trước khi tính chuyện chung tiền với người trong nhà, nhìn Hóa Lộc và Hóa Kỵ. Lộc đóng ở đây, anh em bắt tay làm ăn thường thuận, miễn sổ sách rành mạch từ đầu. Kỵ là dấu hiệu có chuyện gì đó chưa nói hết với nhau từ lâu; kiểu khúc mắc ấy không xử được bằng chuyển khoản, chỉ gỡ được qua những buổi ngồi lại thật sự. Tam phương tứ chính: Huynh Đệ gộp với Tật Ách, Điền Trạch và cung xung chiếu Nô Bộc; phép so hai vòng người, ruột thịt và xã giao, nằm ngay trong cấu trúc này. Bẫy hay gặp: cố đọc ra "nhà này mấy anh em" — lối đếm số lượng là cách cũ, độ tin thấp trong thời sinh ít con. Phần dùng được là chất của quan hệ và khả năng hợp tác, nhất là khi anh em tính chuyện làm ăn chung.',
    commonMisreads: [
      '"Cung Huynh Đệ cho biết chính xác nhà có mấy anh em." Lối đếm số lượng là cách cũ, độ tin thấp; phần dùng được là hình thái quan hệ và khả năng hợp tác.',
      '"Cự Môn ở Huynh Đệ là anh em từ mặt nhau." Sai: sao này tả nhà hay tranh luận, thương nhau bằng lời khó nghe — biết vậy để đổi cách nói, không phải để buông.',
    ],
    trioNote:
      'Huynh Đệ cùng nhóm tam hợp với Tật Ách và Điền Trạch; cung xung chiếu là Nô Bộc. Nhóm này là phần nền của đời sống: người thân kề vai (Huynh Đệ), sức khoẻ (Tật Ách) và chốn ở (Điền Trạch) cùng quyết định bạn có hậu phương hay không. Cung đối Nô Bộc chiếu sang để so hai vòng người, ruột thịt và xã giao: người có trăm bạn nhậu mà không có một người gọi được lúc ba giờ sáng sẽ thấy cặp cung này nói rất đúng chuyện của mình.',
  },
];

export function findPalaceReading(slug: string): PalaceReading | undefined {
  return PALACE_READINGS.find((p) => p.slug === slug);
}
