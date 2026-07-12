/**
 * Static reference content for /tu-vi/cung-* and /tu-vi/sao/* SEO pages.
 *
 * Each entry is intentionally factual + non-superstitious. We describe
 * what the palace/star traditionally REPRESENTS in Tử Vi Đẩu Số without
 * making predictive claims. AI Mentor is the layer that personalizes
 * interpretation against a user's actual chart.
 */

export interface PalaceContent {
  slug: string;
  name: string;
  fullName: string;
  domain: string;
  overview: string;
  whatItRepresents: string[];
  howToRead: string[];
  trigon: string[];
  commonStars: string[];
  faq: { q: string; a: string }[];
}

export const PALACES_CONTENT: PalaceContent[] = [
  {
    slug: 'cung-menh',
    name: 'Mệnh',
    fullName: 'Cung Mệnh (命宮)',
    domain: 'Bản chất cốt lõi',
    overview:
      'Cung Mệnh là cung quan trọng nhất trên lá số — đại diện cho khí chất bẩm sinh, thiên hướng phản ứng và bản đồ tính cách cốt lõi. Cùng với cung Thân, đây là phần luận đầu tiên khi đọc một lá số.',
    whatItRepresents: [
      'Khí chất tự nhiên — cách bạn phản ứng khi không kịp suy nghĩ.',
      'Thiên hướng nhận thức — bạn nhìn thế giới qua lăng kính nào (logic, cảm xúc, hành động).',
      'Điểm mạnh và điểm yếu nội tâm — cái nào bẩm sinh, cái nào phải rèn.',
      'Chìa khoá để giải thích nhiều cung khác — Mệnh hợp với Tài Bạch hay Quan Lộc sẽ luận khác hẳn Mệnh khắc.',
    ],
    howToRead: [
      'Xem chính tinh thủ Mệnh — sao nào đứng tại cung Mệnh, miếu/vượng/đắc/hãm.',
      'Xem cát/sát tinh đi kèm — Lộc, Quyền, Khoa, Kỵ tại Mệnh đổi hướng tính cách rõ rệt.',
      'Đối chiếu với cung Thân — Mệnh là khí, Thân là cách hành động. Hai cung đồng/khác cung kể câu chuyện khác nhau.',
      'Luận tam phương tứ chính — Mệnh + Quan Lộc + Tài Bạch + Thiên Di tạo bộ luận chính.',
    ],
    trigon: ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Thiên Di'],
    commonStars: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thái Dương', 'Thái Âm', 'Liêm Trinh', 'Tham Lang', 'Cự Môn'],
    faq: [
      {
        q: 'Mệnh và Thân khác nhau thế nào?',
        a: 'Mệnh là khí chất, cách bạn cảm nhận thế giới. Thân là cách đời sống thực tế kéo bạn hành động. Mệnh và Thân đồng cung → con người nhất quán; khác cung → giữa nội tâm và hành động có khoảng cách cần học cách dung hoà.',
      },
      {
        q: 'Cung Mệnh có sao xấu (Kỵ, Hoá Kỵ) thì sao?',
        a: 'Hoá Kỵ tại Mệnh không phải "đời mạt vận". Đó là tín hiệu một chủ đề cần đặc biệt chú ý trong cách phản ứng — và thường là động cơ phát triển rất mạnh nếu nhận biết được. Luận đúng cần xem cả tứ hoá và sát tinh đi kèm.',
      },
      {
        q: 'Tại sao một số lá số cung Mệnh trống chính tinh?',
        a: 'Khoảng 30% lá số có cung Mệnh "vô chính diệu" — luận theo cung đối diện (xung chiếu) và phụ tinh. Đây không phải dấu hiệu xấu; thường là người có bản sắc đa dạng và phản ứng linh hoạt hơn.',
      },
    ],
  },
  {
    slug: 'cung-phu-mau',
    name: 'Phụ Mẫu',
    fullName: 'Cung Phụ Mẫu (父母宮)',
    domain: 'Cha mẹ, học vấn, người trên',
    overview:
      'Cung Phụ Mẫu phản ánh quan hệ với cha mẹ, người lớn tuổi, cấp trên — và quá trình tiếp nhận tri thức từ người đi trước. Đây cũng là cung của "phông nền" đầu đời: nếp nhà, cách gia đình nhìn thế giới, những thứ bạn mang theo mà ít khi tự nhận ra. Theo cách nhìn cổ truyền, cung này còn gợi phần vốn sức khoẻ và văn hoá mà gia đình truyền lại.',
    whatItRepresents: [
      'Quan hệ với cha mẹ ruột.',
      'Sức khoẻ tinh thần — di truyền và môi trường tuổi nhỏ.',
      'Khả năng học từ người trên (mentor, sếp đầu đời).',
      'Cách bạn ứng xử với "thẩm quyền" (authority).',
      'Nếp nhà và "phông" văn hoá đầu đời — thứ định hình bạn trước khi bạn kịp chọn.',
      'Việc học giai đoạn đầu: tiếp nhận tri thức từ trường lớp, sách vở thuận hay trắc trở.',
      'Theo cổ truyền, cung này còn gợi phần nền thể chất thừa hưởng từ gia đình.',
    ],
    howToRead: [
      'Xem chính tinh tại Phụ Mẫu — có Cát hay Sát?',
      'Đối chiếu với Mệnh — Phụ Mẫu mạnh hỗ trợ Mệnh hay đè nén.',
      'Hoá Kỵ tại Phụ Mẫu thường liên quan đến "vướng" với gia đình hoặc thẩm quyền.',
      'Thái Dương thường được đọc gắn với hình ảnh người cha, Thái Âm với người mẹ; hai sao này sáng hay hãm đổi giọng luận rõ rệt.',
      'Cự Môn tại Phụ Mẫu gợi bất đồng lời qua tiếng lại giữa hai thế hệ — đọc như lời nhắc học cách nói chuyện với người trên.',
      'Tật Ách là cung xung chiếu của Phụ Mẫu: hai cung soi nhau khi luận phần nền thể chất và nếp sinh hoạt thừa hưởng.',
    ],
    trigon: ['Phụ Mẫu', 'Tử Tức', 'Nô Bộc', 'Tật Ách'],
    commonStars: ['Thiên Lương', 'Thái Dương', 'Thiên Đồng'],
    faq: [
      {
        q: 'Cung Phụ Mẫu xấu nghĩa là cha mẹ tôi sẽ gặp vấn đề?',
        a: 'Không. Cung Phụ Mẫu xấu thường nói về CÁCH BẠN TIẾP NHẬN sự bảo bọc/áp đặt, không phải về cha mẹ trực tiếp. Nhiều người có Phụ Mẫu khó vẫn có cha mẹ rất tốt — chỉ là cảm giác chủ quan của họ khác.',
      },
      {
        q: 'Cung Phụ Mẫu có nói về học vấn không?',
        a: 'Có. Ngoài quan hệ cha mẹ, cung này gắn với việc tiếp nhận tri thức từ người trên: thầy cô, trường lớp, người hướng dẫn đầu đời. Phụ Mẫu được cát tinh trợ thường học thuận, dễ gặp thầy tốt; gặp sát tinh thì đường học hay gián đoạn, phải tự bươn nhiều hơn — là xu hướng để chuẩn bị, không phải giới hạn.',
      },
      {
        q: 'Thái Dương, Thái Âm tại Phụ Mẫu đọc thế nào?',
        a: 'Truyền thống đọc Thái Dương gắn với hình ảnh người cha, Thái Âm gắn với người mẹ. Sao sáng thì hình ảnh đó rõ nét, có chỗ dựa; sao hãm thì tình cảm vẫn có nhưng cách thể hiện vụng hoặc xa cách. Đây là xu hướng cảm nhận của người có lá số, không phải phán quyết về cha mẹ bạn.',
      },
    ],
  },
  {
    slug: 'cung-phuc-duc',
    name: 'Phúc Đức',
    fullName: 'Cung Phúc Đức (福德宮)',
    domain: 'Phước báu, tâm thái, sức chịu đựng',
    overview:
      'Cung Phúc Đức phản ánh "vốn nội tâm" — khả năng tận hưởng cuộc sống, sức chịu đựng áp lực, và độ thanh thản. Trong Tử Vi cổ, đây cũng là cung của thiện tâm và phước báu tích luỹ. Người xem lá số thường dồn mắt vào Tài Bạch, Quan Lộc mà lướt qua cung này; trong khi chính Phúc Đức cho biết bạn có tận hưởng nổi thành quả mình kiếm được hay không.',
    whatItRepresents: [
      'Mức năng lượng nội tâm — bạn hồi phục nhanh sau cú sốc đến mức nào.',
      'Khả năng tận hưởng — có người thành công nhưng Phúc Đức yếu vẫn không thấy vui.',
      'Sức chịu đựng áp lực dài hạn.',
      'Khuynh hướng tâm linh / triết lý sống.',
      'Nguồn vui đích thực — hoạt động nào nạp lại năng lượng cho bạn thật sự.',
      'Chất lượng "giấc nghỉ" của tâm trí: đầu óc được buông hay cứ chạy mãi một chủ đề.',
      'Một trong sáu cung mà cung Thân có thể ghép vào — khi đó đời sống tinh thần là mặt trận chính của nửa sau cuộc đời.',
    ],
    howToRead: [
      'Phúc Đức được "trợ" bằng Cát tinh giúp người ta giữ được bình thản trong khủng hoảng.',
      'Phúc Đức cùng nhóm tam hợp với Phu Thê và Thiên Di: tâm thái đổ thẳng vào kỳ vọng trong quan hệ và cách bước ra thế giới.',
      'Phúc Đức và Mệnh đồng dụng → tâm bình, sống thư thái.',
      'Phúc Đức xung chiếu Tài Bạch — cặp "tiền và sự đủ". Phúc Đức yếu thì tiền nhiều vẫn không thấy đủ; luận tiền bạc mà bỏ cung này là thiếu một nửa.',
      'Thiên Đồng tại đây thường dễ an; Thiên Lương thiên về chiêm nghiệm, triết lý; Tham Lang cần trải nghiệm mới thấy sống động.',
      'Hoá Kỵ tại Phúc Đức gợi vòng lặp suy nghĩ khó dứt — tín hiệu nên chủ động chăm sóc sức khoẻ tinh thần.',
    ],
    trigon: ['Phúc Đức', 'Phu Thê', 'Thiên Di', 'Tài Bạch'],
    commonStars: ['Thiên Lương', 'Thiên Cơ', 'Tham Lang'],
    faq: [
      {
        q: 'Phúc Đức có phải là cung "tâm linh" không?',
        a: 'Rộng hơn thế. Phúc Đức nói về tâm thái nói chung: dễ an hay hay lo, nguồn vui đích thực, sức chịu đựng dài hạn. Khuynh hướng tâm linh hoặc triết lý sống chỉ là một phần trong đó — người hoàn toàn không theo tín ngưỡng nào vẫn đọc được cung này như "sức khoẻ tinh thần" của mình.',
      },
      {
        q: 'Vì sao luận tiền bạc lại phải xem cả Phúc Đức?',
        a: 'Vì Phúc Đức xung chiếu Tài Bạch — hai cung soi nhau. Tài Bạch nói chuyện kiếm và tiêu; Phúc Đức nói chuyện có thấy đủ hay không. Người Phúc Đức yếu có thể tiền nhiều vẫn bồn chồn, còn người Phúc Đức vững thấy an với mức vừa phải. Bài toán tiền bạc vì thế luôn có một nửa nằm ở tâm thái.',
      },
      {
        q: 'Phúc Đức xấu có nghĩa là tôi kém phước?',
        a: 'Không nên đọc thành phán quyết. Phúc Đức nhiều sát tinh hoặc Hoá Kỵ thường nói về kiểu tâm trí khó nghỉ: dễ lo xa, hay nghĩ vòng lặp. Đó là điểm xuất phát, không phải bản án — và là chỉ dấu rõ nhất cho biết bạn nên đầu tư vào đâu: giấc ngủ, vận động, người để trò chuyện, nhịp sống chậm hơn.',
      },
    ],
  },
  {
    slug: 'cung-dien-trach',
    name: 'Điền Trạch',
    fullName: 'Cung Điền Trạch (田宅宮)',
    domain: 'Nhà cửa, bất động sản, không gian sống',
    overview:
      'Cung Điền Trạch liên quan tới nhà ở, bất động sản, không gian sống — và rộng hơn là "tổ ấm" cả về vật lý và tinh thần. Trong cặp cung tiền bạc, Điền Trạch là cái kho còn Tài Bạch là dòng tiền: một bên nói chuyện giữ, một bên nói chuyện kiếm và tiêu. Cung này còn trả lời một câu hỏi rất đời: không gian bạn đang sống nạp thêm hay rút bớt năng lượng của bạn mỗi ngày.',
    whatItRepresents: [
      'Bất động sản sở hữu hoặc thừa kế.',
      'Chất lượng không gian sống.',
      'Quan hệ với địa lý quê hương / nơi ở.',
      '"Kho" tài sản dài hạn — khả năng giữ của, khác với dòng tiền ra vào bên Tài Bạch.',
      'Cảm giác "về nhà": nơi ở hiện tại có phải chỗ nghỉ thật sự của bạn không.',
      'Duyên với đất đai, thừa kế, và mức độ gắn bó với nơi chốn.',
    ],
    howToRead: [
      'Cát tinh tại Điền Trạch → dễ tích luỹ tài sản cố định.',
      'Sát tinh → cần thận trọng đầu tư bất động sản, đặc biệt khi đại vận xung Điền Trạch.',
      'Thiên Phủ hoặc Vũ Khúc tại Điền Trạch là tín hiệu tích sản, hợp gắn bó lâu với nhà đất.',
      'Phá Quân tại đây thường gắn với chuyện hay chuyển chỗ ở, thích sửa sang làm lại — nên tính chi phí đổi chỗ vào kế hoạch.',
      'Hoá Kỵ tại Điền Trạch: rà kỹ giấy tờ, pháp lý trước khi ký các giao dịch nhà đất.',
      'Riêng chuyện thời điểm mua bán cần thêm lớp đại vận và lưu niên, không kết luận từ lá số gốc đơn thuần.',
    ],
    trigon: ['Điền Trạch', 'Huynh Đệ', 'Tật Ách', 'Tử Tức'],
    commonStars: ['Thiên Phủ', 'Vũ Khúc', 'Thái Âm'],
    faq: [
      {
        q: 'Điền Trạch khác Tài Bạch chỗ nào?',
        a: 'Tài Bạch là dòng tiền: kiếm thế nào, tiêu thế nào, tâm lý với tiền ra sao. Điền Trạch là cái kho: tài sản đọng lại được bao nhiêu, giữ có bền không. Có người dòng tiền rất mạnh nhưng kho rỗng vì không giữ; có người thu nhập vừa phải mà kho đầy dần. Hai cung bổ nhau, luận tiền nên xem cả cặp.',
      },
      {
        q: 'Điền Trạch xấu có phải là cả đời không mua được nhà?',
        a: 'Không. Cung này nói về khuynh hướng giữ tài sản và độ "lì" của của cải, không phán chuyện sở hữu. Người Điền Trạch nhiều sát tinh vẫn mua được nhà — chỉ là nên kỷ luật hơn: kiểm tra pháp lý kỹ, tránh vay quá sức, và đừng coi nhà đất là kênh lướt sóng.',
      },
      {
        q: 'Cung Điền Trạch có dùng để chọn hướng nhà không?',
        a: 'Không. Hướng nhà, bố trí không gian là việc của Phong Thuỷ — một bộ môn khác. Điền Trạch trong Tử Vi nói về quan hệ giữa bạn với tài sản và nơi ở: giữ của thế nào, gắn bó với nơi chốn ra sao. Hai môn có thể bổ trợ nhau nhưng không thay thế nhau.',
      },
    ],
  },
  {
    slug: 'cung-quan-loc',
    name: 'Quan Lộc',
    fullName: 'Cung Quan Lộc (官祿宮)',
    domain: 'Sự nghiệp, danh vị, vai trò xã hội',
    overview:
      'Cung Quan Lộc đại diện cho sự nghiệp, vai trò xã hội, danh tiếng. Đây là cung số một khi luận về định hướng nghề và môi trường làm việc — luôn xem cùng Tài Bạch và Thiên Di.',
    whatItRepresents: [
      'Kiểu sự nghiệp phù hợp — quản lý, chuyên môn, kinh doanh, sáng tạo.',
      'Môi trường làm việc thuận — có cấu trúc hay tự chủ.',
      'Mức độ thành danh và cách được công nhận.',
      'Tương tác với cấp trên và đối tác công việc.',
    ],
    howToRead: [
      'Xem chính tinh tại Quan Lộc cho biết "khuôn vai trò".',
      'Tứ hoá tại Quan Lộc nói lên giai đoạn nào thăng tiến.',
      'Quan Lộc trống chính tinh → luận theo cung đối diện và bộ tam phương.',
      'So sánh Quan Lộc với Mệnh — đồng dụng thì sự nghiệp ăn khớp tính cách; xung khắc thì phải học cách thích nghi.',
      'Hoá Quyền tại Quan Lộc: giai đoạn được giao việc lớn kèm áp lực; Hoá Kỵ tại đây dễ bị hiểu lầm trong công việc — nên văn bản hoá các thoả thuận.',
      'Vài tín hiệu quen: Tử Vi nghiêng về lãnh đạo, Vũ Khúc về tài chính kỹ thuật, Thất Sát về khởi nghiệp và môi trường cạnh tranh.',
    ],
    trigon: ['Quan Lộc', 'Mệnh', 'Tài Bạch', 'Phu Thê'],
    commonStars: ['Vũ Khúc', 'Tử Vi', 'Thái Dương', 'Liêm Trinh', 'Thất Sát', 'Phá Quân'],
    faq: [
      {
        q: 'Cung Quan Lộc của tôi tốt nhưng đang thất nghiệp — có mâu thuẫn không?',
        a: 'Không. Tử Vi mô tả thiên hướng, không phải sự kiện. Quan Lộc tốt nghĩa là bạn có nền cho sự nghiệp ổn định — nhưng môi trường, ngành, cơ hội cụ thể vẫn do hoàn cảnh thực tế quyết định. Đại vận và lưu niên cho biết giai đoạn nào dễ mở rộng.',
      },
      {
        q: 'Có nên chuyển ngành dựa trên Quan Lộc không?',
        a: 'Quan Lộc cho biết "kiểu vai trò" hợp — bạn hợp làm chuyên môn hay quản lý, làm có cấu trúc hay tự do. Nhưng quyết định chuyển ngành cần xét thêm: tài chính dự phòng, cơ hội thực tế, mức độ kiệt sức. AI Mentor sẽ giúp ghép các yếu tố này.',
      },
      {
        q: 'Quan Lộc có Thất Sát hay Phá Quân là xấu?',
        a: 'Không. Hai sao này chỉ "xấu" khi bị đặt nhầm chỗ. Thất Sát hợp môi trường cạnh tranh, xử lý khủng hoảng; Phá Quân hợp khởi nghiệp, tái cấu trúc, mở cái mới. Đặt họ vào công việc lặp đều, giữ khuôn thì bí bách; đặt vào mặt trận cần người dám quyết thì thành thế mạnh.',
      },
    ],
  },
  {
    slug: 'cung-no-boc',
    name: 'Nô Bộc',
    fullName: 'Cung Nô Bộc (奴僕宮)',
    domain: 'Bạn bè, đồng nghiệp, mạng lưới',
    overview:
      'Cung Nô Bộc (còn gọi là cung Bằng Hữu) đại diện cho mạng lưới quan hệ rộng — bạn bè, đồng nghiệp, người dưới quyền, người mình dìu dắt. Tên cổ nghe nặng phận chủ tớ, nhưng nghĩa hiện đại đơn giản là "vòng người quanh ta". Cung này quan trọng cho cả sự nghiệp lẫn sức khoẻ tinh thần: mạng lưới tốt đỡ ta lên, mạng lưới xấu rút cạn năng lượng lúc nào không hay.',
    whatItRepresents: [
      'Kiểu bạn bè bạn thu hút.',
      'Chất lượng mạng lưới — số lượng nhiều/ít, sâu/nông.',
      'Quan hệ với cấp dưới hoặc người được bạn dìu dắt.',
      'Mạng lưới đang nâng đỡ bạn hay đang rút năng lượng của bạn.',
      'Vai trò tự nhiên của bạn trong nhóm: người kết nối, người cho đi, hay người tựa vào.',
      'Duyên hợp tác làm ăn với bạn bè: thuận hay dễ khúc mắc tiền bạc.',
    ],
    howToRead: [
      'Nô Bộc mạnh + Cát → có bạn bè nâng đỡ trong sự nghiệp.',
      'Nô Bộc xung Mệnh → dễ va chạm với người xung quanh hoặc bị ảnh hưởng nặng bởi môi trường.',
      'Thiên Đồng tại Nô Bộc: bạn bè hoà hợp, chơi bền; Cự Môn: vòng quan hệ nhiều lời qua tiếng lại, nên chọn lọc kỹ.',
      'Hoá Lộc tại đây là tín hiệu cơ hội đến qua người quen; Hoá Kỵ là lời nhắc cẩn trọng khi hùn vốn, cho vay trong vòng bạn bè.',
      'Đối chiếu với Huynh Đệ (người thân cận) để biết nên đầu tư thời gian vào vòng trong hay vòng ngoài.',
    ],
    trigon: ['Nô Bộc', 'Tử Tức', 'Phụ Mẫu', 'Huynh Đệ'],
    commonStars: ['Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
    faq: [
      {
        q: 'Nô Bộc nghĩa là "đầy tớ"? Nghe nặng nề quá.',
        a: 'Đó là tên từ thời cổ, khi xã hội còn phân chủ tớ. Cách gọi hiện đại là cung Bằng Hữu. Phạm vi của nó ngày nay là toàn bộ mạng lưới ngang và dưới: bạn bè, đồng nghiệp, cộng tác viên, nhân viên, học trò — những người không phải người trên (Phụ Mẫu) và không phải ruột thịt gần (Huynh Đệ).',
      },
      {
        q: 'Nô Bộc xấu thì có nên hùn vốn với bạn không?',
        a: 'Cung này không quyết thay bạn. Hoá Kỵ hoặc sát tinh tại Nô Bộc là lời nhắc: tách bạch tiền bạc và tình cảm, giấy tờ rõ ràng ngay từ đầu, đừng "anh em tin nhau là chính". Làm được vậy thì hợp tác với bạn vẫn ổn; không làm được thì rủi ro với bất kỳ ai, chẳng riêng bạn bè.',
      },
      {
        q: 'Nô Bộc khác Huynh Đệ chỗ nào?',
        a: 'Huynh Đệ là vòng trong: anh chị em ruột, bạn thân như ruột thịt, cộng sự sát cánh. Nô Bộc là vòng ngoài rộng hơn: đồng nghiệp, mối quan hệ xã giao, người dưới quyền. Một người có thể Huynh Đệ rất đẹp mà Nô Bộc lận đận — thân ai nấy quý nhưng ra đám đông hay gặp người không hợp, và ngược lại.',
      },
    ],
  },
  {
    slug: 'cung-thien-di',
    name: 'Thiên Di',
    fullName: 'Cung Thiên Di (遷移宮)',
    domain: 'Di chuyển, cơ hội bên ngoài, "thế giới"',
    overview:
      'Cung Thiên Di là cung đối diện Mệnh — nói về "thế giới bên ngoài" và cách nó đón nhận bạn. Liên quan đến di chuyển, đi xa, du học, làm việc ở môi trường mới; và cả "khuôn mặt ra ngoài" — ấn tượng bạn tạo ra nơi người lạ. Mệnh với Thiên Di là cặp trong-ngoài của lá số: hiểu cả hai mới biết mình nên chọn sân nhà hay sân khách.',
    whatItRepresents: [
      'Cơ hội đến từ bên ngoài — du học, xuất ngoại, dự án xa.',
      'Cách bạn được "thế giới" nhìn nhận khi rời khỏi vùng quen.',
      'Cơ duyên với người nước ngoài hoặc vùng khác.',
      '"Khuôn mặt ra ngoài": cách bạn hiện lên trong mắt người lạ, đôi khi khác hẳn con người ở nhà.',
      'Độ hợp với môi trường lạ: ra khỏi vùng quen bạn nở ra hay co lại.',
      'Chỗ dựa khi xa nhà: đi xa dễ gặp người giúp hay dễ va vấp.',
    ],
    howToRead: [
      'Cát tinh tại Thiên Di → đi xa thuận lợi, dễ mở mang sự nghiệp khi rời quê.',
      'Thiên Di xung Mệnh là điều bình thường (luôn xung) — quan trọng là xem sát tinh đi kèm.',
      'Thiên Mã tại Thiên Di: đời gắn với dịch chuyển; Thái Dương sáng tại đây: đi xa dễ được ghi nhận, trọng vọng.',
      'Cự Môn tại Thiên Di là lời nhắc giữ lời ăn tiếng nói nơi đất khách; Hoá Lộc tại đây: cơ hội thường mở ra khi rời vùng quen.',
      'Cách đọc kinh điển: Mệnh mờ nhạt nhưng Thiên Di tốt thường được luận "đi xa thì khá hơn ở nhà".',
    ],
    trigon: ['Thiên Di', 'Phu Thê', 'Phúc Đức', 'Mệnh'],
    commonStars: ['Thái Dương', 'Thiên Mã', 'Thiên Cơ'],
    faq: [
      {
        q: 'Thiên Di tốt có nghĩa là phải ra nước ngoài mới thành công?',
        a: 'Không. "Đi xa" trong Tử Vi rộng hơn chuyện xuất ngoại: đổi thành phố, đổi ngành, đổi môi trường làm việc, bước vào một cộng đồng mới đều tính. Thiên Di tốt nói rằng bạn hợp với dịch chuyển và dễ được đón nhận ở chỗ lạ — còn đi đâu, khi nào, là quyết định của bạn dựa trên điều kiện thực tế.',
      },
      {
        q: 'Vì sao Thiên Di luôn xung chiếu Mệnh?',
        a: 'Đó là cấu trúc cố định của lá số: hai cung đối diện nhau qua tâm. Xung chiếu ở đây không phải "xung khắc xấu" mà là soi chiếu — Mệnh là con người bên trong, Thiên Di là cách thế giới bên ngoài đón con người đó. Đọc cặp này cùng nhau cho biết bạn toả sáng ở vùng quen hay ở vùng đất mới.',
      },
      {
        q: 'Thiên Di xấu thì có nên đi du học, đi làm xa không?',
        a: 'Cung này không cấm ai đi đâu. Thiên Di nhiều sát tinh là lời nhắc: dịch chuyển của bạn cần chuẩn bị kỹ hơn người khác — giấy tờ chắc chắn, tài chính dự phòng, chỗ dựa ở nơi đến. Quyết định cuối cùng nên dựa trên cơ hội và điều kiện thực tế, lá số chỉ giúp bạn biết mình cần phòng bị ở khâu nào.',
      },
    ],
  },
  {
    slug: 'cung-tat-ach',
    name: 'Tật Ách',
    fullName: 'Cung Tật Ách (疾厄宮)',
    domain: 'Sức khoẻ, thể chất, rủi ro',
    overview:
      'Cung Tật Ách phản ánh sức khoẻ thể chất, các bệnh mãn tính có khuynh hướng mắc, và một phần rủi ro tai nạn. Cung này nằm cùng nhóm tam hợp với Huynh Đệ và Điền Trạch, xung chiếu với Phụ Mẫu — cổ nhân xếp sức khoẻ chung mâm với nếp nhà và người thân là có lý: lối sống phần lớn được thừa hưởng. Lưu ý: hieu.asia không CHẨN ĐOÁN BỆNH — đây chỉ là tham khảo, không thay khám y tế.',
    whatItRepresents: [
      'Khuynh hướng thể chất — cơ địa nóng/lạnh, sức bền.',
      'Hệ cơ quan có khuynh hướng yếu (theo cổ truyền).',
      'Phản ứng với stress về mặt thân thể.',
      'Cách cơ thể báo động khi quá tải: mất ngủ, ăn kém, hay đau vặt.',
      'Nhịp hồi phục: bạn thuộc kiểu bền sức đường dài hay bùng nổ rồi cần nghỉ sâu.',
    ],
    howToRead: [
      'Cát tinh tại Tật Ách → cơ địa khoẻ, hồi phục nhanh.',
      'Sát tinh + Hoá Kỵ → cần lưu ý các giai đoạn căng để nghỉ ngơi, không phải dự báo bệnh nặng.',
      'Cổ truyền gán mỗi sao một vùng cơ thể đáng để ý: Thiên Cơ với thần kinh, giấc ngủ; Liêm Trinh với tim mạch, huyết; Cự Môn với tiêu hoá, răng miệng; Thái Âm với nội tiết, mắt. Xem đây là gợi ý tầm soát chủ động, không phải chẩn đoán.',
      'Đọc Tật Ách cùng Phụ Mẫu (cung xung chiếu) — phần nền thể chất và nếp sinh hoạt thừa hưởng.',
      'KHÔNG dùng Tật Ách thay khám bệnh. Có triệu chứng → đi bác sĩ.',
    ],
    trigon: ['Tật Ách', 'Huynh Đệ', 'Điền Trạch', 'Phụ Mẫu'],
    commonStars: ['Thiên Cơ', 'Cự Môn', 'Liêm Trinh'],
    faq: [
      {
        q: 'Cung Tật Ách của tôi xấu, tôi có cần lo bệnh không?',
        a: 'Không nên lo theo cách "Tử Vi báo bệnh". hieu.asia không chẩn đoán. Cung Tật Ách xấu là tín hiệu nên duy trì lối sống lành mạnh và khám sức khoẻ định kỳ — đó là việc ai cũng nên làm bất kể lá số.',
      },
      {
        q: 'Tử Vi có đoán được tôi mắc bệnh gì không?',
        a: 'Không. Truyền thống có gán mỗi sao một vùng cơ thể (Thiên Cơ với thần kinh, Liêm Trinh với tim mạch, Cự Môn với tiêu hoá, Thái Âm với nội tiết) — nhưng đó là cách người xưa mô tả khuynh hướng cơ địa, không phải công cụ chẩn đoán. Có triệu chứng thì đi khám; lá số chỉ gợi ý nên tầm soát chủ động vùng nào.',
      },
      {
        q: 'Sát tinh tại Tật Ách có đáng sợ không?',
        a: 'Không đáng sợ, đáng để ý thì đúng hơn. Kình Dương, Đà La hay Hoá Kỵ tại Tật Ách được đọc là cơ thể phản ứng mạnh với áp lực: căng quá thì báo động sớm hơn người khác. Tín hiệu này nhắc bạn giữ nhịp làm-nghỉ đều đặn và khám định kỳ — là lời nhắc phòng bị, không phải điềm gở.',
      },
    ],
  },
  {
    slug: 'cung-tai-bach',
    name: 'Tài Bạch',
    fullName: 'Cung Tài Bạch (財帛宮)',
    domain: 'Tiền bạc, dòng tiền, cách kiếm và quản lý',
    overview:
      'Cung Tài Bạch phản ánh cách bạn KIẾM TIỀN và CÁCH BẠN QUẢN LÝ tiền — quan trọng không kém Quan Lộc khi luận sự nghiệp. Lưu ý: Tử Vi không phải tư vấn đầu tư.',
    whatItRepresents: [
      'Khuynh hướng kiếm tiền — chuyên môn, kinh doanh, đầu tư, hay thu nhập đa nguồn.',
      'Cách bạn xài và tích luỹ — kỷ luật hay tuỳ hứng.',
      'Mối quan hệ tâm lý với tiền — coi tiền là an toàn, công cụ, hay căng thẳng.',
      'Khả năng đối phó với áp lực tài chính.',
      'Phản ứng khi hụt tiền: co lại phòng thủ hay liều thêm để gỡ.',
      'Dòng tiền, khác với "kho" tài sản bên Điền Trạch — kiếm giỏi chưa chắc giữ giỏi.',
    ],
    howToRead: [
      'Cát tinh + Vũ Khúc/Thiên Phủ tại Tài Bạch → có khả năng tích luỹ.',
      'Sát tinh + Hoá Kỵ → cần quản lý dòng tiền cẩn thận, không nên đầu tư rủi ro cao.',
      'Tài Bạch xung Phúc Đức → tiền nhiều nhưng không thấy đủ; cần xem cả tâm thái.',
      'KHÔNG dùng Tài Bạch để quyết định mua/bán cổ phiếu cụ thể.',
    ],
    trigon: ['Tài Bạch', 'Mệnh', 'Quan Lộc', 'Phúc Đức'],
    commonStars: ['Vũ Khúc', 'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Phá Quân'],
    faq: [
      {
        q: 'Tài Bạch yếu nghĩa là tôi sẽ nghèo?',
        a: 'Không. Tài Bạch yếu thường nói về phong cách quản lý tiền — bạn dễ tiêu tuỳ hứng hơn, hoặc thu nhập không đều. Người Tài Bạch yếu nhưng kỷ luật vẫn tích luỹ tốt; người Tài Bạch mạnh nhưng phóng khoáng vẫn có thể không có dư.',
      },
      {
        q: 'Hoá Lộc vào Tài Bạch là năm phát tài?',
        a: 'Là tín hiệu dòng vào thuận: cơ hội kiếm tiền nhiều hơn, việc liên quan đến tiền trôi chảy hơn. Nhưng "vào thuận" khác "giữ được" — Hoá Lộc không kèm kỷ luật thì tiền đến rồi đi. Đọc đúng là: giai đoạn đáng để chủ động nắm cơ hội, kèm nguyên tắc trích tích luỹ ngay khi tiền về.',
      },
      {
        q: 'Tài Bạch và Quan Lộc khác gì nhau?',
        a: 'Quan Lộc nói về vai trò nghề nghiệp: bạn là ai trong mắt nghề, hợp kiểu công việc nào. Tài Bạch nói về tiền: kiếm kiểu gì, tiêu kiểu gì, tâm lý với tiền ra sao. Có người Quan Lộc rực rỡ mà Tài Bạch thường — danh cao nhưng tiền vừa phải, và ngược lại. Hai cung cùng bộ tam phương với Mệnh nên luôn được đọc cạnh nhau.',
      },
    ],
  },
  {
    slug: 'cung-tu-tuc',
    name: 'Tử Tức',
    fullName: 'Cung Tử Tức (子息宮)',
    domain: 'Con cái, sáng tạo, sản phẩm cá nhân',
    overview:
      'Cung Tử Tức truyền thống nói về con cái — nhưng trong cách đọc hiện đại, nó cũng đại diện cho "sản phẩm sáng tạo" của bạn: dự án, sản phẩm, ý tưởng để lại. Điểm chung của hai nghĩa là sự nuôi dưỡng: bạn kiên nhẫn đến đâu với một thứ lớn chậm hơn kỳ vọng. Canon đương đại ghi tên cung này là Tử Nữ (子女宮); Tử Tức là tên Việt quen dùng.',
    whatItRepresents: [
      'Quan hệ với con cái (nếu có).',
      'Khả năng sáng tạo — sản phẩm, dự án dài hạn.',
      'Cách bạn nuôi dưỡng "thứ gì đó" đến trưởng thành.',
      'Kiểu "người nuôi lớn" của bạn: kiên nhẫn chờ hay sốt ruột can thiệp.',
      'Quan hệ với thế hệ sau nói chung: con cháu, học trò, đàn em.',
      'Độ bền với những việc cần nuôi lâu: viết sách, xây kênh, gây dựng sản phẩm.',
    ],
    howToRead: [
      'Cát + Tử Tức mạnh → con cái thuận hoà hoặc dự án dài hạn dễ thành.',
      'Sát tinh → có thể có "khó khăn ban đầu" — cần kiên nhẫn.',
      'Vài tín hiệu quen: Thiên Đồng thường đọc là con hiền hoà; Tham Lang: con thông minh, hiếu động; Thất Sát: con cá tính mạnh, cần cách dạy tôn trọng sự độc lập.',
      'Hoá Kỵ tại đây gợi lo nghĩ kéo dài quanh con cái hoặc "đứa con tinh thần" — nên chẻ mối lo thành việc làm được từng tuần.',
      'Đọc cùng tam phương (Nô Bộc, Phụ Mẫu) và cung xung chiếu Điền Trạch: chuyện nuôi dưỡng luôn dính với nếp nhà và mạng lưới quanh mình.',
    ],
    trigon: ['Tử Tức', 'Nô Bộc', 'Phụ Mẫu', 'Điền Trạch'],
    commonStars: ['Thiên Đồng', 'Tham Lang', 'Cự Môn'],
    faq: [
      {
        q: 'Cung Tử Tức có nói tôi sẽ có mấy đứa con không?',
        a: 'Sách cổ có những phép luận về đường con cái, nhưng các phái nói rất khác nhau và hieu.asia không dùng lá số để phán chuyện sinh nở — đó là lĩnh vực của y học. Cung này được đọc như khuynh hướng quan hệ giữa bạn và thế hệ sau, cùng cách bạn nuôi dưỡng thứ mình tạo ra.',
      },
      {
        q: 'Vì sao gọi là Tử Tức mà không phải Tử Nữ?',
        a: 'Canon chữ Hán đương đại ghi 子女宮 (Tử Nữ cung); 子息宮 (Tử Tức) là cách gọi văn học cũ hơn. Truyền thống Tử Vi Việt quen dùng tên Tử Tức nên hieu.asia giữ cách gọi này — hai tên chỉ cùng một cung, không khác gì về nội dung luận.',
      },
      {
        q: 'Tôi không định có con, cung này còn ý nghĩa gì?',
        a: 'Còn nguyên. Cách đọc hiện đại coi Tử Tức là cung của mọi thứ bạn "sinh ra và nuôi lớn": dự án dài hơi, tác phẩm, sản phẩm, học trò, thậm chí một cộng đồng bạn gây dựng. Người không sinh con vẫn dùng cung này để hiểu mình nuôi dưỡng kiểu gì — kiên trì, buông lỏng, hay kiểm soát.',
      },
    ],
  },
  {
    slug: 'cung-phu-the',
    name: 'Phu Thê',
    fullName: 'Cung Phu Thê (夫妻宮)',
    domain: 'Bạn đời, hôn nhân, kiểu gắn bó',
    overview:
      'Cung Phu Thê phản ánh kiểu bạn đời bạn thu hút, kiểu quan hệ bạn dễ rơi vào, và động lực hôn nhân. hieu.asia KHÔNG phán "hợp/khắc tuyệt đối" — quan hệ là quá trình hai người cùng học.',
    whatItRepresents: [
      'Kiểu gắn bó (secure/anxious/avoidant trong tâm lý hiện đại).',
      'Nhu cầu cảm xúc chính trong quan hệ.',
      'Rủi ro giao tiếp dễ gặp.',
      'Điều cần học để quan hệ bền.',
    ],
    howToRead: [
      'Xem chính tinh tại Phu Thê — kiểu người bạn dễ rung động.',
      'Sát tinh + Hoá Kỵ → cảm xúc dễ căng, cần học giao tiếp.',
      'Phu Thê và Phúc Đức → kỳ vọng quan hệ có thực tế hay không.',
      'Vài tín hiệu quen: Thái Âm gợi bạn đời dịu dàng; Thái Dương gợi người mạnh mẽ, có vị thế; Tham Lang gợi quan hệ đậm cảm xúc cần thêm sự ổn định. Đọc là khuynh hướng thu hút, không phải mô tả người sẽ cưới.',
      'Phu Thê xung chiếu Quan Lộc: đời sống hôn nhân và sự nghiệp kéo co nhau — luận chuyện cân bằng hai vai nên nhìn cả cặp cung này.',
      'KHÔNG dùng cung Phu Thê để kết luận "có nên chia tay hay không" — quyết định đó cần dữ kiện đời thực + tham vấn người chuyên môn.',
    ],
    trigon: ['Phu Thê', 'Thiên Di', 'Phúc Đức', 'Quan Lộc'],
    commonStars: ['Thái Âm', 'Thiên Đồng', 'Thiên Lương', 'Liêm Trinh'],
    faq: [
      {
        q: 'Cung Phu Thê xấu nghĩa là tôi không có duyên hôn nhân?',
        a: 'Không. Phu Thê "xấu" thường nói về kiểu quan hệ DỄ GẶP — ví dụ dễ vướng người không đồng tần số. Nhận ra khuynh hướng là bước đầu để chọn người phù hợp hơn. Nhiều người có Phu Thê khó vẫn có hôn nhân hạnh phúc khi học được cách giao tiếp.',
      },
      {
        q: 'Phu Thê có Hoá Kỵ là dấu hiệu sẽ chia tay?',
        a: 'Không. Hoá Kỵ tại Phu Thê là "nút thắt cần làm việc": thường là kỳ vọng chưa nói ra, cách giao tiếp gây hiểu lầm, hoặc chủ đề hai người né tránh. Cặp nào cũng có nút thắt; khác biệt nằm ở chỗ có nhận ra và chịu gỡ hay không. Nhận diện sớm nhờ lá số là lợi thế, không phải án treo.',
      },
      {
        q: 'Cung Phu Thê của tôi và của người ấy nói khác nhau thì tin bên nào?',
        a: 'Cả hai — vì mỗi lá số mô tả trải nghiệm của chính chủ. Cung Phu Thê của bạn nói về cách BẠN yêu và kiểu người bạn hút; cung của người ấy nói về cách HỌ yêu. Hai bản mô tả khác nhau là bình thường, giống hai người kể một câu chuyện từ hai phía. Phần chung của quan hệ do hai người cùng xây, không nằm sẵn trong lá số nào.',
      },
    ],
  },
  {
    slug: 'cung-huynh-de',
    name: 'Huynh Đệ',
    fullName: 'Cung Huynh Đệ (兄弟宮)',
    domain: 'Anh chị em, bạn thân, cộng sự gần',
    overview:
      'Cung Huynh Đệ đại diện cho anh chị em ruột, bạn thân, và những người "đồng cấp" trong cuộc sống — khác Nô Bộc (mạng lưới rộng) và khác Phụ Mẫu (người trên). Cách đọc hiện đại mở rộng sang cộng sự sát cánh: người đồng sáng lập, đồng đội làm chung dự án dài. Đây là cung của câu hỏi: ai đứng cạnh mình lúc khó, và mình có đang giữ họ đúng cách.',
    whatItRepresents: [
      'Quan hệ với anh chị em ruột.',
      'Số lượng và chất lượng bạn thân.',
      'Khả năng hợp tác với cộng sự ngang vai.',
      'Kiểu "đồng đội thân nhất" hợp với bạn: người bổ khuyết hay người cùng tần số.',
      'Duyên chung vốn, chung việc với người ngang hàng.',
      'Cách bạn xử lý va chạm với người thân thiết: nói thẳng, im lặng, hay để bụng.',
    ],
    howToRead: [
      'Huynh Đệ mạnh + Cát → có bạn thân hỗ trợ.',
      'Sát tinh → dễ va chạm hoặc khoảng cách với anh chị em.',
      'Vài tín hiệu quen: Thiên Đồng — anh em hoà thuận; Thiên Cơ — mỗi người một hướng, gặp nhau ở việc hơn ở nếp sống; Cự Môn — thương nhau nhưng hay cãi.',
      'Hoá Lộc tại đây thường đọc là cùng người thân làm ăn thuận; Hoá Kỵ là khúc mắc khó nói — nên chủ động mở lời trước.',
      'Tam phương của Huynh Đệ gồm Tật Ách và Điền Trạch, cung xung chiếu là Nô Bộc: chuyện người thân cận luôn được soi cùng sức khoẻ, nhà cửa và vòng bạn rộng.',
    ],
    trigon: ['Huynh Đệ', 'Tật Ách', 'Điền Trạch', 'Nô Bộc'],
    commonStars: ['Thiên Cơ', 'Thái Âm', 'Cự Môn'],
    faq: [
      {
        q: 'Tôi là con một, cung Huynh Đệ có vô nghĩa không?',
        a: 'Không. Với người không có anh chị em ruột, cung này được đọc qua lớp nghĩa mở rộng: bạn thân như ruột thịt, cộng sự sát cánh, người "cùng chiến hào". Con một có Huynh Đệ đẹp thường tự tìm được những người anh em không cùng máu mủ — và cung này nói về cách bạn chọn, giữ những người đó.',
      },
      {
        q: 'Huynh Đệ xấu có phải anh em bất hoà suốt đời?',
        a: 'Không. Sát tinh tại Huynh Đệ nói về điểm dễ va chạm: khác quan điểm, khoảng cách, hay chuyện tiền bạc giữa người thân. Đó là khuynh hướng, không phải án. Biết trước điểm dễ vướng giúp bạn chọn cách nói chuyện khác đi — nhiều gia đình hoà thuận lại chính vì từng va rồi biết đường tránh.',
      },
      {
        q: 'Cung này có dùng khi chọn người đồng sáng lập không?',
        a: 'Dùng được như một góc nhìn: Huynh Đệ cho biết kiểu cộng sự gần hợp với bạn và điểm dễ khúc mắc khi làm chung. Nhưng quyết định chọn người đồng hành cần thêm những thứ lá số không đo được: năng lực, giá trị chung, và một thoả thuận giấy trắng mực đen rõ ràng ngay từ đầu.',
      },
    ],
  },
];

export function findPalaceContent(slug: string): PalaceContent | undefined {
  return PALACES_CONTENT.find((p) => p.slug === slug);
}

// ============================================================================
// Major stars (14 chính tinh)
// ============================================================================

export interface StarContent {
  slug: string;
  name: string;
  category: 'major' | 'aux';
  archetype: string;
  positive: string[];
  caution: string[];
  byPalace: { palace: string; reading: string }[];
  withMutagen?: { type: 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ'; reading: string }[];
}

export const MAJOR_STARS_CONTENT: StarContent[] = [
  {
    slug: 'tu-vi',
    name: 'Tử Vi',
    category: 'major',
    archetype: 'Đế tinh — sao đứng đầu tinh hệ mang tên nó, chủ về lãnh đạo, ổn định và danh dự. Thuộc nhóm Bắc Đẩu chính tinh, cầm trịch bộ Tử - Phủ - Vũ - Tướng: bộ sao của trật tự, địa vị và quản trị nguồn lực.',
    positive: [
      'Có khả năng lãnh đạo, được người khác kính trọng.',
      'Quyết định có chiều sâu, không vội vàng.',
      'Tự trọng cao, giữ chữ tín.',
      'Giữ được sự ổn định khi xung quanh rối loạn — kiểu người "thuyền trưởng" mà tập thể tìm đến lúc sóng gió.',
    ],
    caution: [
      'Dễ cô đơn nếu giữ khoảng cách quá lớn.',
      'Có thể trở nên cứng khi không có Tả Hữu/Khôi Việt hỗ trợ.',
      '"Tử Vi nhập tù" (gặp sát tinh nặng) cần thận trọng.',
      'Đế tinh đứng một mình thiếu bộ phụ tá là "vua không triều thần": uy vẫn có nhưng khó tìm người san sẻ, dễ ôm hết việc về mình.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người có khuynh hướng lãnh đạo, tự trọng cao, ổn định trong khủng hoảng. Điểm nên soi thêm là bộ phụ tinh: Tử Vi được Tả Hữu, Khôi Việt vây quanh là thế "vua có bề tôi giỏi", cổ thư gọi cách Quân Thần Khánh Hội; đứng một mình thì uy vẫn có nhưng dễ cô đơn, khó nhờ vả ai.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp vai trò quản lý, chuyên gia có thẩm quyền, thăng tiến kiểu chậm mà chắc. Môi trường có trật tự, vai vế rõ ràng giúp sao này phát huy; nơi xô bồ thiếu chuẩn mực dễ làm người Tử Vi thấy mất giá trị. Nên đọc cùng Tài Bạch và Thiên Di trong bộ tam phương.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Quản lý tiền có nguyên tắc, không phóng tay, ưu tiên ổn định hơn lợi nhuận cao. Kiểu tích luỹ này bền nhưng có thể lỡ những cơ hội cần quyết nhanh; nếu tam phương có thêm sao động như Thất Sát, Phá Quân thì cán cân sẽ nghiêng sang mạo hiểm hơn.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Cần người bạn đời biết tôn trọng và có sự độc lập riêng; không hợp kiểu quan hệ ràng buộc, kiểm soát. Chỗ dễ vướng là cả hai cùng giữ thể diện, ít ai chịu xuống nước trước; học nhận sai sớm và nói lời mềm là thứ làm quan hệ này nhẹ đi rất nhiều.',
      },
    ],
    withMutagen: [
      {
        type: 'Quyền',
        reading:
          'Tử Vi Hoá Quyền (an theo can Nhâm) tăng uy lực và năng lực ra quyết định — hợp vai trò quản lý cấp cao. Lưu ý riêng bảng Tứ Hoá can Nhâm có phái an khác.',
      },
      {
        type: 'Khoa',
        reading:
          'Tử Vi Hoá Khoa (can Ất) cho danh tiếng tốt, được tin về chữ tín và chuyên môn — hợp các vai trò mentor, cố vấn, người đại diện hình ảnh.',
      },
    ],
  },
  {
    slug: 'thien-co',
    name: 'Thiên Cơ',
    category: 'major',
    archetype: 'Trí tinh — sao của trí tuệ, linh hoạt và thay đổi. Điểm thú vị: Thiên Cơ an theo tinh hệ Tử Vi nhưng lại thuộc nhóm Nam Đẩu chính tinh, và là một góc của bộ "tĩnh" Cơ - Nguyệt - Đồng - Lương: bộ sao của chuyên môn, ổn định và đời sống nội tâm.',
    positive: [
      'Thông minh, học nhanh.',
      'Phản ứng linh hoạt, hợp môi trường biến động.',
      'Nhìn ra cách làm tốt hơn ở hầu hết mọi việc — người của cải tiến, tối ưu.',
      'Hợp vai trò cố vấn, tham mưu: đứng sau tính nước đi hơn là đứng mũi chịu sào.',
    ],
    caution: [
      'Dễ thay đổi, thiếu kiên nhẫn.',
      'Suy nghĩ quá nhiều dễ căng thẳng.',
      'Nhiều ý tưởng nhưng ít cái đi đến cùng nếu thiếu kỷ luật chốt việc.',
      'Cổ truyền gắn Thiên Cơ với thần kinh và giấc ngủ: nghĩ nhiều thì khó ngủ, khó ngủ lại càng nghĩ nhiều.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người nhanh trí, ưa xoay chuyển, ngồi đâu cũng nhìn ra chỗ có thể làm tốt hơn. Nhược điểm đi kèm là dễ phân tán: nhiều ý tưởng nhưng ít cái đi đến cùng. Chọn một mảng đủ rộng để thoả trí tò mò mà vẫn tích luỹ được chiều sâu là lời giải bền nhất.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp việc đa nhiệm, cần đầu óc: tư vấn, phân tích, công nghệ, truyền thông. Môi trường biến động là đất diễn; việc lặp đều một nhịp lâu ngày làm người Thiên Cơ mất lửa. Đổi mới trong phạm vi một nghề thường bền hơn là đổi hẳn nghề liên tục.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Kiếm tiền bằng chất xám: ý tưởng, phân tích, giải pháp. Dòng tiền có thể không đều vì hay thử cái mới; nên có phần thu nhập nền ổn định trước khi thử nghiệm. Tính toán nhanh là lợi thế, miễn là đừng đổi kế hoạch tài chính theo từng cơn hứng.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Cần bạn đời nói chuyện được, cùng bàn ý tưởng; sự im lặng kéo dài làm quan hệ nguội nhanh hơn cãi vã. Đầu óc hay phân tích cũng dễ soi từng chi tiết nhỏ của đối phương — đôi khi điều quan hệ cần là bớt phân tích, thêm hiện diện.',
      },
      {
        palace: 'Tật Ách',
        reading:
          'Cổ truyền gắn Thiên Cơ với thần kinh và giấc ngủ. Tín hiệu nên giữ giờ giấc đều, tách rạch ròi giờ làm và giờ nghỉ, cho đầu óc những khoảng trống thật sự. Đây là gợi ý sinh hoạt, không phải chẩn đoán bệnh.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Thiên Cơ Hoá Lộc (can Ất): cơ hội đến từ ý tưởng và giải pháp — giai đoạn thuận cho việc động não, cải tiến cách làm. Cần kỷ luật chốt việc để ý tưởng thành kết quả.',
      },
      {
        type: 'Quyền',
        reading:
          'Thiên Cơ Hoá Quyền (can Bính): được giao cầm mảng việc cần đầu óc, lời bàn có trọng lượng hơn. Để ý thói quen tự tay làm hết vì nghĩ mình tính nhanh hơn người khác.',
      },
      {
        type: 'Khoa',
        reading:
          'Thiên Cơ Hoá Khoa (can Đinh): uy tín về chuyên môn, học hành thi cử thuận — hợp giai đoạn lấy chứng chỉ, viết lách, chia sẻ kiến thức.',
      },
      {
        type: 'Kỵ',
        reading:
          'Thiên Cơ Hoá Kỵ (can Mậu): đầu óc dễ chạy quá tải, tính toán nhiều mà khó quyết. Lời nhắc là đơn giản hoá: bớt phương án, đặt hạn chót, và giữ giấc ngủ.',
      },
    ],
  },
  {
    slug: 'thai-duong',
    name: 'Thái Dương',
    category: 'major',
    archetype: 'Dương tinh — mặt trời của lá số: năng lượng, danh tiếng, sự hiện diện. Cùng Thái Âm hợp thành cặp Trung Thiên, không thuộc Bắc Đẩu lẫn Nam Đẩu. Độ sáng với sao này quan trọng hơn hầu hết chính tinh khác: mặt trời ban ngày và mặt trời lúc nửa đêm là hai câu chuyện.',
    positive: [
      'Nhiệt huyết, có sức ảnh hưởng.',
      'Hợp với vai trò công khai, lãnh đạo cộng đồng.',
      'Hào phóng, quen cho đi — kiểu người toả sáng để người khác được ấm theo.',
      'Đi xa dễ được ghi nhận: Thái Dương sáng tại Thiên Di là tín hiệu được trọng vọng ở vùng đất mới.',
    ],
    caution: [
      'Dễ kiệt sức.',
      'Khi "hãm" (Thái Dương ban đêm/đông) cần học nghỉ ngơi.',
      'Ví dụ kinh điển: Thái Dương hãm là người giỏi nhưng công lao khó được nhìn thấy — nên chọn môi trường biết ghi nhận.',
      'Quen toả sáng cho người khác mà quên sạc cho mình; ngại từ chối trước đám đông nên dễ ôm việc.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người năng động, hiện diện rõ, có khả năng truyền cảm hứng và kéo mọi người theo. Kèm theo là nguy cơ cháy hết pin: quen làm mặt trời cho người khác mà quên giữ lửa cho mình. Nếu sao ở thế hãm, càng cần chủ động nghỉ và chọn nơi biết ghi nhận công sức.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp vai trò công khai: giảng dạy, truyền thông, dẫn dắt cộng đồng, đại diện tổ chức. Được nhìn thấy là nguồn năng lượng của sao này, nên môi trường ghi nhận công khai quan trọng chẳng kém lương thưởng. Cẩn thận nhận việc quá tay vì ngại từ chối trước đám đông.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền thường đến qua danh tiếng và độ phủ: càng nhiều người biết đến công việc của bạn, dòng vào càng thuận. Điểm cần rèn là tính rộng rãi quá tay, nhất là chi cho hình ảnh và chi cho người khác. Hào phóng có kế hoạch thì bền hơn hào phóng theo hứng.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Gợi ý bạn đời sáng sủa, chủ động, có vị thế riêng — hoặc chính bạn mang năng lượng dẫn dắt vào quan hệ. Chỗ cần để ý: người quen toả sáng đôi khi lấn sân, khiến đối phương thấy mình thành khán giả. Học chia sân khấu là bài học chính của cặp này.',
      },
      {
        palace: 'Phụ Mẫu',
        reading:
          'Truyền thống đọc Thái Dương tại Phụ Mẫu gắn với hình ảnh người cha hoặc người trên có ảnh hưởng mạnh. Sao sáng: chỗ dựa rõ nét; sao hãm: tình thương vẫn có nhưng cách thể hiện xa cách. Đọc như khuynh hướng cảm nhận, không phải phán quyết về cha mẹ.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Thái Dương Hoá Lộc (an theo can Canh): cơ hội đến qua sự hiện diện công khai, thương hiệu cá nhân — giai đoạn hợp bước ra ánh sáng. Lưu ý bảng Tứ Hoá can Canh có phái an khác.',
      },
      {
        type: 'Quyền',
        reading:
          'Thái Dương Hoá Quyền (can Tân): tiếng nói có sức nặng, hợp đứng ra dẫn dắt, phát ngôn; đi kèm là áp lực gánh vác và bị soi nhiều hơn.',
      },
      {
        type: 'Kỵ',
        reading:
          'Thái Dương Hoá Kỵ (can Giáp): dễ mệt vì gánh hình ảnh, công làm khó được ghi nhận đúng. Lời nhắc: bớt gồng, chọn nơi biết trân trọng, và nghỉ cho đủ.',
      },
    ],
  },
  {
    slug: 'vu-khuc',
    name: 'Vũ Khúc',
    category: 'major',
    archetype: 'Tài tinh — sao tiền bạc của lá số, mang tinh thần "kim": kỷ luật, quyết liệt, dứt khoát. Thuộc nhóm Bắc Đẩu chính tinh, là mắt xích tài chính trong bộ Tử - Phủ - Vũ - Tướng: người giữ kỷ luật nguồn lực cho cả bộ sao quản trị.',
    positive: [
      'Có kỷ luật tài chính tốt.',
      'Quyết đoán trong quyết định kinh doanh.',
      'Nói ít làm nhiều, quyết rồi ít khi lung lay.',
      'Hợp tích sản: Vũ Khúc tại Điền Trạch là một trong các tín hiệu tích luỹ nhà đất kinh điển.',
    ],
    caution: [
      'Có thể cứng nhắc.',
      'Khi gặp sát tinh, dễ căng thẳng vì tiền.',
      'Chất "kim" sắc quá hoá lạnh: khó nói lời mềm, khó chịu với sự lề mề của người khác.',
      'Quá tập trung vào con số mà quên vế hưởng thụ — có của mà không có thời gian dùng.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người kỷ luật, thực tế, nói ít làm nhiều; quyết rồi thì ít khi lung lay. Chất "kim" thể hiện ở sự dứt khoát, nhưng đôi khi thành cứng: khó mở lời mềm mỏng, khó chịu với sự chậm chạp. Học diễn đạt sự quan tâm bằng lời, đừng chỉ bằng hành động.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Đất mạnh nhất của sao tiền này: quản lý có hệ thống, tích luỹ qua chuyên môn, ít khi để tiền nằm không. Rủi ro nằm ở chỗ quá chăm chăm vào con số mà quên hưởng thụ; gặp sát tinh thì dễ căng thẳng vì tiền dù thực ra không thiếu.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp ngành có chuẩn mực rõ: tài chính, kế toán, kỹ thuật, vận hành. Giao việc khó kèm hạn chót rõ là cách dùng đúng người Vũ Khúc; việc mơ hồ, cảm tính làm họ nản nhanh. Trong bộ Tử Phủ Vũ Tướng, đây là người giữ kỷ luật nguồn lực.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Gợi ý kiểu gắn bó thực tế: thể hiện tình cảm qua việc lo liệu, gánh vác thay vì lời ngọt. Đối phương có thể thấy thiếu lãng mạn; bản thân lại nghĩ "lo đủ là thương rồi". Tập nói ra điều mình làm và vì sao mình làm — đó là cây cầu cần bắc.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Vũ Khúc Hoá Lộc (can Kỷ): dòng tiền thuận qua chuyên môn và kỷ luật — giai đoạn hợp tăng thu nhập lõi, đàm phán lương, chuẩn hoá lại tài chính cá nhân.',
      },
      {
        type: 'Quyền',
        reading:
          'Vũ Khúc Hoá Quyền (an theo can Canh): được trao quyền quản ngân sách, nguồn lực; sự quyết đoán tăng nhưng dễ áp cách của mình lên người khác. Bảng Tứ Hoá can Canh có phái an khác.',
      },
      {
        type: 'Khoa',
        reading:
          'Vũ Khúc Hoá Khoa (can Giáp): uy tín về sự chắc tay với tiền và số liệu — hợp thi chứng chỉ ngành, nhận vai trò cần được tin cậy về quản trị.',
      },
      {
        type: 'Kỵ',
        reading:
          'Vũ Khúc Hoá Kỵ (an theo can Nhâm): chủ đề tiền cần để tâm — dòng tiền kẹt, khoản phải đòi, quyết định tài chính nên chậm lại một nhịp. Riêng can Nhâm có phái an Tứ Hoá khác.',
      },
    ],
  },
  {
    slug: 'thien-dong',
    name: 'Thiên Đồng',
    category: 'major',
    archetype: 'Phúc tinh — sao của sự hoà hảo, hưởng thụ, dễ chịu. Thuộc nhóm Nam Đẩu chính tinh dù an theo tinh hệ Tử Vi, và là một góc của bộ "tĩnh" Cơ - Nguyệt - Đồng - Lương: khả năng thấy đủ, sống nhẹ là tài sản riêng của sao này.',
    positive: [
      'Tâm tính ôn hoà, dễ kết bạn.',
      'Khả năng tận hưởng cuộc sống.',
      'Biết thấy đủ — thứ nhiều người kiếm cả đời không ra.',
      'Bền bỉ theo kiểu nước chảy: không tranh gắt nhưng ít khi bỏ cuộc giữa chừng.',
    ],
    caution: [
      'Có thể quá dễ dãi với bản thân.',
      'Thiếu động lực phấn đấu nếu không có Cát mạnh.',
      'Ngại va chạm nên hay hoãn việc khó, né cuộc nói chuyện căng.',
      'Sự an nhàn kéo dài dễ thành trì trệ — cần một thử thách vừa sức để giữ độ căng lành mạnh.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người ôn hoà, dễ gần, ưu tiên sống thoải mái hơn tranh hơn thua. Là phúc tinh, thế mạnh nằm ở khả năng thấy đủ và tận hưởng; mặt trái là ngại va chạm, dễ hoãn việc khó. Một mục tiêu có hạn chót rõ giúp cân lại sự dễ chịu bẩm sinh này.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Kiếm tiền không phải động lực số một; tiền với người Thiên Đồng là phương tiện cho đời sống dễ chịu. Dòng tiền thường ổn ở mức đủ; muốn bứt lên cần cát tinh trợ lực hoặc kỷ luật tự đặt. Để ý các khoản chi cho sự thoải mái ngắn hạn.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp môi trường ít đấu đá: dịch vụ, chăm sóc khách hàng, giáo dục, vận hành ổn định. Người Thiên Đồng leo cao bằng sự bền và được lòng người, không bằng giành giật. Điều nên rèn: mỗi năm dám nhận một việc vượt vùng an toàn một chút.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Quan hệ êm đềm là ưu tiên: người Thiên Đồng tại Phu Thê thường nhường nhịn, giữ hoà khí. Rủi ro là "êm" trượt thành "tránh": chuyện khó không nói, để lâu thành xa cách. Hôn nhân bền của sao này cần những cuộc nói chuyện thẳng thắn định kỳ.',
      },
      {
        palace: 'Phúc Đức',
        reading:
          'Đất hợp của phúc tinh: tâm thái dễ an, biết vui với điều nhỏ, ít stress hệ thống. Điểm cần để ý duy nhất là sự an nhàn kéo dài có thể thành trì trệ; giữ một thử thách vừa sức để tinh thần có độ căng lành mạnh.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Thiên Đồng Hoá Lộc (can Bính): giai đoạn hưởng thành quả, đời sống dễ chịu hơn, quan hệ thuận — hợp chăm lo gia đình, sức khoẻ, những thứ nuôi mình lâu dài.',
      },
      {
        type: 'Quyền',
        reading:
          'Thiên Đồng Hoá Quyền (can Đinh): phúc tinh có thêm xương sống — dám đòi hỏi, dám từ chối. Giai đoạn tốt để đặt ranh giới mà vẫn giữ được sự dễ mến.',
      },
      {
        type: 'Kỵ',
        reading:
          'Thiên Đồng Hoá Kỵ (an theo can Canh): sự thoải mái thành chủ đề phải để tâm — dễ chểnh mảng, hưởng trước làm sau. Riêng can Canh có phái an Tứ Hoá khác, không lấy Thiên Đồng làm Kỵ.',
      },
    ],
  },
  {
    slug: 'liem-trinh',
    name: 'Liêm Trinh',
    category: 'major',
    archetype: 'Sao "hai mặt" nổi tiếng của Tử Vi: một nửa kỷ luật sắt, một nửa đam mê ngầm. Thuộc nhóm Bắc Đẩu chính tinh, an theo tinh hệ Tử Vi. Hiểu Liêm Trinh là hiểu cách hai dòng điện ngược chiều ấy bắt tay — hoặc giằng co — trong cùng một con người.',
    positive: [
      'Có kỷ luật cao, theo đuổi mục tiêu lâu dài.',
      'Phù hợp công việc có chuẩn mực nghiêm.',
      'Khi kỷ luật và đam mê cùng hướng, sức bền theo đuổi mục tiêu thuộc loại hiếm có.',
      'Trọng nguyên tắc, làm việc đâu ra đấy, được tin ở những vị trí cần người giữ chuẩn.',
    ],
    caution: [
      'Áp lực nội tâm cao.',
      'Khi gặp Tham Lang hoặc Hoá Kỵ, dễ căng thẳng cá nhân.',
      'Hai phần trong người lệch nhịp thì hay tự trách, khắt khe với chính mình.',
      'Cổ truyền gắn Liêm Trinh với tim mạch, huyết — người căng thẳng ngầm nên để ý nhịp nghỉ (gợi ý sinh hoạt, không phải chẩn đoán).',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người mang hai dòng điện: phần kỷ luật muốn mọi thứ đúng chuẩn, phần đam mê muốn sống hết cảm xúc. Khi hai phần bắt tay, đây là mẫu người theo đuổi mục tiêu bền bỉ hiếm có; khi lệch nhịp, áp lực nội tâm và sự tự trách tăng. Biết xả van đúng cách là kỹ năng sống còn.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp ngành đòi hỏi chuẩn mực cao: kỹ thuật, tài chính, quản trị, hành chính, pháp chế. Người Liêm Trinh làm việc nghiêm và kỳ vọng người khác nghiêm theo, nên hợp tổ chức có kỷ cương; môi trường lỏng lẻo khiến họ vừa mệt vừa khó chịu.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền đến từ chuyên môn và sự bền bỉ, ít hợp kiểu "được ăn cả" cảm tính. Kỷ luật chi tiêu vốn tốt, nhưng lúc cảm xúc dâng cao có thể vung tay ngược hẳn ngày thường; nhận ra nhịp dao động đó của chính mình là cách giữ tiền tốt nhất.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Yêu sâu và kỳ vọng cao, đôi khi cao đến mức khắt khe với chính người mình thương. Quan hệ với người Liêm Trinh cần sự rõ ràng: điều gì là nguyên tắc, điều gì thương lượng được. Nói được điều đó với nhau, phần đam mê của sao này là chất keo rất bền.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Liêm Trinh Hoá Lộc (can Giáp): cơ hội đến từ chính sự nghiêm túc — được chọn mặt gửi vàng, giao vai trò cần người giữ chuẩn. Chuyện đam mê, tình cảm cũng thuận đường hơn.',
      },
      {
        type: 'Kỵ',
        reading:
          'Liêm Trinh Hoá Kỵ (can Bính): cảm xúc và nguyên tắc dễ đá nhau — tự trách, căng thẳng ngầm, vướng chuyện tình cảm khó gỡ. Lời nhắc: đừng xử lý chuyện lòng bằng kỷ luật thép.',
      },
    ],
  },
  {
    slug: 'thien-phu',
    name: 'Thiên Phủ',
    category: 'major',
    archetype: 'Khố tinh — cái kho của lá số: tích luỹ, ổn định, "thủ quỹ". Đứng đầu tinh hệ Thiên Phủ (chuỗi sao an đối xứng với chuỗi Tử Vi) và thuộc nhóm Nam Đẩu chính tinh. Trong bộ Tử - Phủ - Vũ - Tướng, Thiên Phủ là người trông coi nền móng và của cải.',
    positive: [
      'Khả năng tích luỹ tài sản.',
      'Cẩn trọng, ít rủi ro.',
      'Điềm đạm, tạo cảm giác an toàn cho người xung quanh — "thủ quỹ" bẩm sinh của mọi tập thể.',
      'Cùng Thiên Tướng chiếu về Mệnh tạo cách Phủ Tướng Triều Viên: nền ổn định, quản trị nguồn lực tốt, đời sống có trật tự.',
    ],
    caution: [
      'Có thể quá thủ thân, bỏ lỡ cơ hội.',
      'Khó thay đổi khi cần.',
      'Thấy cơ hội vẫn chờ thêm "cho chắc" rồi lỡ nhịp — cẩn trọng là tài sản, cẩn trọng quá là chi phí.',
      'Giữ của giỏi hơn sinh lời; tiếc tiền chi cho việc giúp mình lớn lên là điểm mù hay gặp.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người điềm đạm, biết giữ, tạo cảm giác an toàn cho người quanh mình. Ưu điểm là ổn định, ít khi sa lầy vào rủi ro; nhược là quá thủ thân: thấy cơ hội vẫn chờ thêm "cho chắc" rồi lỡ nhịp. Thỉnh thoảng nên cho phép mình liều một khoản nhỏ có kiểm soát.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tích luỹ ổn định, hợp người làm chuyên môn dài hạn, ít khi túng vì luôn có khoản dằn lưng. Sao này giữ của giỏi hơn sinh lời: danh mục an toàn hợp hơn đầu cơ. Điểm nên rèn là dám chi cho thứ giúp mình tăng giá trị — học hành, sức khoẻ, quan hệ.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp vai trò quản trị nguồn lực: điều hành, tài chính, chuỗi cung ứng, quản lý tài sản. Trong bộ Tử Phủ Vũ Tướng, Thiên Phủ là cái kho — người khiến tổ chức yên tâm rằng nền móng có người trông. Thăng tiến kiểu tin cậy tích luỹ dần, không kiểu ngôi sao.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Gợi ý bạn đời chín chắn, thích ổn định, lo được cho gia đình — hoặc chính bạn tìm cảm giác an toàn trong hôn nhân trước tiên. Chỗ cần để ý: an toàn quá hoá nhàm; quan hệ này cần được làm mới có chủ đích chứ không tự nhiên mới.',
      },
      {
        palace: 'Điền Trạch',
        reading:
          'Đất rất hợp: tích sản, nhà cửa, của cải giữ được lâu và ít hao hụt. Người có bộ này thường yên tâm hơn khi tiền nằm ở tài sản thấy được, sờ được. Chỉ cần tránh dồn hết trứng vào một giỏ nhà đất là thế mạnh này phát huy trọn.',
      },
    ],
  },
  {
    slug: 'thai-am',
    name: 'Thái Âm',
    category: 'major',
    archetype: 'Âm tinh — mặt trăng của lá số: nội tâm, gia đạo, sự tế nhị. Cùng Thái Dương hợp thành cặp Trung Thiên, ngoài Bắc Đẩu lẫn Nam Đẩu; đồng thời là chữ "Nguyệt" trong bộ tĩnh Cơ - Nguyệt - Đồng - Lương. Trăng sáng hay mờ theo vị trí — độ sáng với sao này rất đáng xem.',
    positive: [
      'Nhạy cảm với cảm xúc người khác.',
      'Hợp công việc cần sự tinh tế.',
      'Bền bỉ âm thầm: tích luỹ từng chút, chăm sóc từng việc nhỏ mà thành nền vững.',
      'Giàu đời sống bên trong — quan sát sâu, nhớ lâu, trân trọng điều nhỏ.',
    ],
    caution: [
      'Dễ buồn rầu, suy nghĩ nhiều.',
      'Cần học bộc lộ cảm xúc.',
      'Ít nói thẳng nhu cầu, hay chờ người khác tự hiểu — chờ lâu thành tủi.',
      'Đóng góp thầm lặng nên dễ bị bỏ quên khi xét công; cần học ghi lại và trình bày thành quả.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người tinh tế, quan sát trước nói sau, giàu đời sống bên trong. Sức mạnh nằm ở sự bền và độ sâu tình cảm; điểm dễ vướng là nghĩ nhiều, buồn âm ỉ mà ngoài mặt vẫn "ổn". Tìm được kênh bộc lộ — viết, nghệ thuật, một người tri kỷ — là rất quý.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền tích từ từ như trăng đầy dần: lương, tiết kiệm, tài sản gia đình, thường gắn với nhà đất. Không hợp kiếm nhanh, bù lại ít khi mất nhanh. Việc nên làm sớm: tách bạch tiền của mình và tiền lo cho người thân, kẻo thương người mà hụt quỹ.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp việc cần sự dịu và chu đáo: giáo dục, chăm sóc, nội dung, tài chính cá nhân, hậu cần. Kiểu đóng góp thầm lặng khiến người Thái Âm dễ bị bỏ quên khi xét công — học cách ghi lại và trình bày thành quả là kỹ năng cần bù, không phải khoe khoang.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Trân trọng sự thân mật, cần đối phương biết lắng nghe và để ý điều nhỏ. Người Thái Âm tại Phu Thê ít nói thẳng nhu cầu, hay chờ đối phương tự hiểu; chờ lâu thành tủi. Nói rõ mong muốn không hề làm tình cảm kém lãng mạn đi.',
      },
      {
        palace: 'Phụ Mẫu',
        reading:
          'Truyền thống đọc Thái Âm tại Phụ Mẫu nghiêng về hình ảnh người mẹ hoặc người trên dịu dàng, chăm lo. Sao sáng: sự chăm sóc rõ ràng, ấm áp; sao mờ: tình cảm có nhưng kín tiếng, ít bày tỏ. Là khuynh hướng cảm nhận, không phải phán quyết về gia đình.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Thái Âm Hoá Lộc (can Đinh): dòng vào lặng lẽ mà đều — tiết kiệm, nhà đất, khoản thu ổn định. Giai đoạn thuận cho việc vun vén gia đạo và tài sản dài hạn.',
      },
      {
        type: 'Quyền',
        reading:
          'Thái Âm Hoá Quyền (can Mậu): sự dịu dàng có thêm quyền chủ động — quán xuyến, cầm quỹ, điều phối việc nhà việc cơ quan. Cẩn thận ôm hết việc vì "tự làm cho nhanh".',
      },
      {
        type: 'Khoa',
        reading:
          'Thái Âm Hoá Khoa (can Quý; can Canh cũng an vậy theo bảng engine dùng, riêng can này có phái an khác): uy tín nhẹ nhàng, được quý vì sự chỉn chu — hợp học hành, viết lách, xây hình ảnh đáng tin.',
      },
      {
        type: 'Kỵ',
        reading:
          'Thái Âm Hoá Kỵ (can Ất): nỗi lo quay vào trong — chuyện nhà, tiền tiết kiệm, cảm giác không được thấu hiểu. Lời nhắc: đừng ôm một mình, chia sẻ sớm với người tin được.',
      },
    ],
  },
  {
    slug: 'tham-lang',
    name: 'Tham Lang',
    category: 'major',
    archetype: 'Sao của ham muốn: đào hoa, tham vọng, thay đổi — cả ba trong một. Thuộc nhóm Bắc Đẩu chính tinh, an theo tinh hệ Thiên Phủ, và là chữ "Tham" trong bộ động Sát - Phá - Tham. Gặp Hỏa Tinh hoặc Linh Tinh lại thành cách phát mạnh Hỏa Tham / Linh Tham.',
    positive: [
      'Năng lượng cao, sức quyến rũ.',
      'Tham vọng lớn, sẵn sàng học mới.',
      'Đa năng: học nhanh, bắt sóng xu hướng nhanh, xoay nghề xoay vai được.',
      'Trong bộ Sát Phá Tham, đây là người mở cửa quan hệ và cơ hội cho cả nhóm.',
    ],
    caution: [
      'Dễ phân tán.',
      'Cần thận trọng với "đào hoa quá vượng" — quan hệ phức tạp.',
      'Cái gì cũng muốn thì cái gì cũng dở dang — chọn lọc là bài học lớn nhất.',
      'Gặp Hỏa Tinh / Linh Tinh thành cách phát nhanh, nhưng phát nhanh cần kỷ luật giữ thành quả.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người đa năng, học nhanh, có sức hút — vào phòng là người khác nhận ra. Năng lượng ham muốn là động cơ mạnh: muốn giỏi, muốn đẹp, muốn trải nghiệm. Bài học lớn nhất là chọn lọc: cái gì cũng muốn thì cái gì cũng dở dang.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp nghề dùng sức hút và quan hệ: kinh doanh, ngoại giao, giải trí, marketing, ngành cần bắt xu hướng nhanh. Trong bộ Sát Phá Tham, Tham Lang là người mở cửa quan hệ và cơ hội; kỷ luật theo đuổi đến cùng là mảnh ghép phải tự rèn thêm.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Kiếm tiền có duyên, nhiều nguồn, nhưng tiêu cũng có "duyên" chẳng kém: hàng đẹp, cuộc vui, trải nghiệm mới. Muốn giữ được cần quy tắc tự động, kiểu trích tiết kiệm ngay khi tiền về. Gặp Hỏa Tinh có thể thành cách phát nhanh — càng cần kỷ luật giữ thành quả.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Đời sống tình cảm phong phú, cảm xúc đậm, dễ có nhiều lựa chọn trước khi dừng lại. Chữ "đào hoa" không phải bản án: nó là sức hút, dùng vào đâu do mình chọn. Quan hệ bền của sao này cần sự rõ ràng, chừng mực, và một đối phương đủ thú vị.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Tham Lang Hoá Lộc (can Mậu): duyên và cơ hội cùng đến — quan hệ mới, nguồn thu mới, cuộc vui mới. Giai đoạn thuận cho kinh doanh, giao tế; giữ tỉnh táo trước lời mời quá ngọt.',
      },
      {
        type: 'Quyền',
        reading:
          'Tham Lang Hoá Quyền (can Kỷ): tham vọng có tổ chức hơn — dám nhận mục tiêu lớn, dẫn cuộc chơi thay vì chỉ góp vui. Hợp giai đoạn bứt tốc sự nghiệp.',
      },
      {
        type: 'Kỵ',
        reading:
          'Tham Lang Hoá Kỵ (can Quý): ham muốn thành chủ đề phải để tâm — dễ sa đà cuộc vui, quan hệ ngoài luồng, khoản chi không tên. Đặt ranh giới trước khi vào cuộc, đừng tin "chỉ lần này".',
      },
    ],
  },
  {
    slug: 'cu-mon',
    name: 'Cự Môn',
    category: 'major',
    archetype: 'Ám tinh — sao của lời nói, phân tích và tranh luận. Thuộc nhóm Bắc Đẩu chính tinh, an theo tinh hệ Thiên Phủ. Chữ "ám" không có nghĩa xấu: nó tả đúng bản chất con dao hai lưỡi của ngôn từ — lời nói tạo ra ánh sáng hay bóng tối là do người dùng.',
    positive: [
      'Khả năng phân tích sắc bén.',
      'Hợp công việc dùng lời nói: luật sư, giảng dạy, viết.',
      'Nhìn ra kẽ hở mà người khác bỏ qua — người phản biện có giá trị của mọi tập thể.',
      'Uy tín lời nói càng lâu năm càng có giá; nghề gắn với ngôn từ thường bền.',
    ],
    caution: [
      'Dễ nói nhiều, dễ mâu thuẫn nếu không kiểm soát.',
      'Khi gặp Hoá Kỵ, dễ vướng "khẩu thiệt".',
      'Tranh đúng sai trong lúc nóng làm mất người thân hơn là được lý.',
      'Cổ truyền gắn Cự Môn với tiêu hoá, răng miệng — người hay căng lời nên để ý (gợi ý sinh hoạt, không phải chẩn đoán).',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người lý lẽ, hay hỏi "vì sao", nhìn ra kẽ hở người khác bỏ qua; thuyết phục tốt nhưng nên tiết chế lời. Riêng Cự Môn cư Mệnh tại Tý hoặc Ngọ có cát hoá, cổ thư gọi là cách Thạch Trung Ẩn Ngọc: ngọc trong đá, tài năng nở muộn mà bền.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp nghề sống bằng lời và lập luận: luật, báo chí, giảng dạy, đàm phán, nghiên cứu phản biện. Thăng tiến thường đến sau khi uy tín lời nói được kiểm chứng, nên nghề càng lâu năm càng có giá. Tránh nơi coi việc nói thẳng là chống đối.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền đến từ cái miệng theo nghĩa đẹp: tư vấn, dạy học, viết, đàm phán. Nên tránh kiếm tiền ở vùng xám lời nói — hứa quá, quảng cáo lố — vì sao này vướng thị phi nhanh hơn người khác. Hợp đồng rõ ràng là bạn thân của Cự Môn.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Dễ hiểu lầm vì lời: nói mát, nói quá, tranh đúng sai trong lúc nóng. Điều đáng quý là người nói được thì cũng sửa được — đổi "nói cho hả" thành "nói cho rõ" là quan hệ đổi hẳn không khí. Chọn bạn đời chịu đối thoại, đừng chọn người im lặng trường kỳ.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Cự Môn Hoá Lộc (can Tân): lời nói ra tiền — cơ hội đến qua tư vấn, giảng dạy, đàm phán. Giai đoạn tiếng nói được lắng nghe, hợp mở rộng công việc gắn với truyền đạt.',
      },
      {
        type: 'Quyền',
        reading:
          'Cự Môn Hoá Quyền (can Quý): lập luận có sức nặng — hợp cầm các cuộc đàm phán, phản biện, đại diện phát ngôn. Để ý ranh giới giữa quyết đoán và áp đảo.',
      },
      {
        type: 'Kỵ',
        reading:
          'Cự Môn Hoá Kỵ (can Đinh): khẩu thiệt thành chủ đề chính — dễ bị trích dẫn sai, hiểu lầm qua tin nhắn. Nguyên tắc giai đoạn này: chuyện quan trọng nói trực tiếp, chốt lại bằng văn bản.',
      },
    ],
  },
  {
    slug: 'thien-tuong',
    name: 'Thiên Tướng',
    category: 'major',
    archetype: 'Ấn tinh — con dấu của lá số: phụ tá trung thành, tham mưu, người giữ trật tự và công bằng. Thuộc nhóm Nam Đẩu chính tinh, an theo tinh hệ Thiên Phủ, và là chữ "Tướng" trong bộ quản trị Tử - Phủ - Vũ - Tướng; cùng Thiên Phủ chiếu Mệnh tạo cách Phủ Tướng Triều Viên.',
    positive: [
      'Trung thành, có trách nhiệm.',
      'Hợp vai trò tham mưu / số 2.',
      'Giỏi điều phối, dung hoà các bên — có mặt ở đâu, chỗ đó bớt loạn.',
      'Đáng tin kiểu "nói được làm được", giữ lời ngay cả khi bất lợi.',
    ],
    caution: [
      'Có thể thiếu tự chủ.',
      'Cần học ra quyết định độc lập.',
      'Quen làm người cân bằng nên ngại chọn phe, kể cả khi tình huống buộc phải chọn.',
      'Vai "người đứng giữa" dễ bị kéo vào chuyện bảo lãnh, đứng tên hộ — nên có ranh giới rõ.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người chỉn chu, trọng nghĩa, đáng tin; giỏi điều phối và dung hoà các bên. Ấn tinh là con dấu: có bạn ở đâu, chỗ đó có trật tự và sự công bằng. Điểm cần rèn là chính kiến — quen làm người cân bằng nên ngại chọn phe, kể cả khi cần chọn.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp vai trò tham mưu, phó tướng, quản lý vận hành: chief of staff, COO, trợ lý cấp cao. Toả sáng nhất khi đứng cạnh một người ra quyết định lớn và biến ý tưởng thành trật tự. Muốn lên vai chính, phải luyện ra quyết định một mình, chịu trách nhiệm một mình.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền bạc ổn định theo vai trò: lương thưởng, phúc lợi, hơn là những cú đậm. Người Thiên Tướng chi tiêu chừng mực, hay lo cho người khác chu toàn. Đáng để ý: đừng để vai "người đứng giữa" kéo mình vào chuyện bảo lãnh, đứng tên hộ.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Bạn đời kiểu hậu phương: hỗ trợ tốt, đáng tin, giữ lời. Quan hệ với người Thiên Tướng ít sóng gió nhưng cũng cần được hâm nóng, kẻo thành "hai cộng sự tốt sống chung nhà". Chủ động tạo bất ngờ nhỏ là khoản đầu tư xứng đáng.',
      },
    ],
  },
  {
    slug: 'thien-luong',
    name: 'Thiên Lương',
    category: 'major',
    archetype: 'Ấm tinh — bóng mát của lá số: trưởng thượng, đạo đức, che chở. Thuộc nhóm Nam Đẩu chính tinh, an theo tinh hệ Thiên Phủ, và là chữ "Lương" trong bộ tĩnh Cơ - Nguyệt - Đồng - Lương. Người mang sao này thường già dặn hơn tuổi, và hay gặp quý nhân đúng lúc ngặt.',
    positive: [
      'Có đạo đức cao.',
      'Hợp công việc giúp đỡ, giáo dục, y tế.',
      'Hay gặp quý nhân, nhất là người lớn tuổi — và chính mình cũng thành quý nhân của người khác.',
      'Uy tín xây bằng sự tử tế có chuyên môn, nên bền và càng lâu càng dày.',
    ],
    caution: [
      'Có thể "lo việc thiên hạ" quên việc nhà.',
      'Cần học nói không.',
      'Nhận việc vì thương người rồi quá tải — giúp người cũng cần ngân sách và giới hạn.',
      'Giọng "bề trên" khi khuyên bảo khiến người nghe khó tiếp thu, dù ý tốt.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người có khuynh hướng che chở, thấy chuyện bất bình khó làm ngơ; thường già dặn hơn tuổi. Ấm tinh nghĩa là bóng mát — chỗ người khác tìm đến khi khó. Bài học ngược lại là nói không đúng lúc, kẻo lo việc thiên hạ mà quên việc nhà.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp y tế, giáo dục, pháp lý, tư vấn, công tác xã hội — những nghề đứng về phía con người. Uy tín của người Thiên Lương xây bằng sự tử tế có chuyên môn, nên bền và càng lâu càng dày. Cẩn thận nhận việc vì thương người rồi quá tải.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền không phải trung tâm: đủ sống, đủ giúp người là thấy ổn. Nguồn thu bền thường gắn với nghề chuyên môn và uy tín cá nhân. Điểm cần kỷ luật: các khoản cho vay vì nể, đóng góp vì ngại từ chối — việc giúp người nên có ngân sách riêng.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Trong quan hệ hay đóng vai người lo, người khuyên, đôi khi thành người dạy. Bạn đời cảm được sự tận tâm nhưng có thể ngộp vì được chăm quá tay. Buông bớt vai người bảo hộ, để đối phương được lo lại cho mình — quan hệ sẽ cân hơn hẳn.',
      },
      {
        palace: 'Phúc Đức',
        reading:
          'Phúc dày theo cách nói truyền thống: hay gặp quý nhân lớn tuổi, tâm an khi giúp được người. Đời sống tinh thần thiên về chiêm nghiệm, triết lý, tuổi càng lớn càng vững. Giữ một cộng đồng tử tế quanh mình là cách nuôi phúc cụ thể nhất.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Thiên Lương Hoá Lộc (an theo can Nhâm): lộc đến qua việc giúp người, ngành chăm sóc, và quý nhân đưa đường. Lưu ý bảng Tứ Hoá can Nhâm có phái an khác.',
      },
      {
        type: 'Quyền',
        reading:
          'Thiên Lương Hoá Quyền (can Ất): được trao vai người phân xử, cố vấn có thực quyền — lời khuyên thành quyết định. Để ý giọng "bề trên" khiến người nghe khó tiếp thu.',
      },
      {
        type: 'Khoa',
        reading:
          'Thiên Lương Hoá Khoa (can Kỷ): uy tín học thuật và đạo đức được ghi nhận — hợp thi cử, nghiên cứu, giảng dạy, các vai trò cần được kính trọng.',
      },
    ],
  },
  {
    slug: 'that-sat',
    name: 'Thất Sát',
    category: 'major',
    archetype: 'Tướng tinh — vị tướng ngoài mặt trận: quyết liệt, đột phá, không sợ thay đổi. Thuộc nhóm Nam Đẩu chính tinh, an theo tinh hệ Thiên Phủ, và là chữ "Sát" mở đầu bộ động Sát - Phá - Tham: bộ sao của biến động, dám làm và thăng trầm rõ nét.',
    positive: [
      'Năng lực ra quyết định nhanh.',
      'Khả năng vượt khủng hoảng.',
      'Càng áp lực càng tỉnh — mẫu người được tin giao các mặt trận khó.',
      'Dứt khoát với cái không còn phù hợp, ít khi tiếc nuối dây dưa.',
    ],
    caution: [
      'Dễ va đập.',
      'Cần học nhẫn nại trong việc lâu dài.',
      'Sự nghiệp và đường đời thường có những khúc rẽ gắt — chuẩn bị quỹ dự phòng cho các cú rẽ đó.',
      'Thẳng quá dễ mất lòng; không phải trận nào cũng đáng đánh.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người mạnh mẽ, quyết nhanh, càng khủng hoảng càng tỉnh. Tướng tinh hợp trận mạc: mục tiêu rõ, thời hạn gắt, có đối thủ để vượt. Mặt trái là dễ va đập với người và với đời; học được chữ nhẫn cho những việc dài hơi thì đường đi xa hơn hẳn.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp việc cạnh tranh, áp lực cao: kinh doanh, bán hàng lớn, xử lý khủng hoảng, kỹ thuật khó. Giao cho người Thất Sát một mặt trận, đừng giao một quy trình lặp. Sự nghiệp thường có những cú rẽ dứt khoát thay vì một đường thẳng đều.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền vào ra mạnh tay: dám đặt cược lớn, được thì đậm, mất cũng nhanh. Kỷ luật quản trị rủi ro là ranh giới giữa người Thất Sát tích được của và người làm lại nhiều lần: quỹ dự phòng tách riêng, mức dừng lỗ định trước, không gỡ bằng cách tăng cược.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Yêu kiểu dứt khoát: thích là tiến, hết là dừng, ít vòng vo. Sự thẳng đó dễ làm đối phương thấy thiếu mềm mại; và hai cái tôi mạnh trong một nhà cần luật chơi rõ. Có một mục tiêu chung để cùng chinh phục là cách giữ lửa hợp nhất với sao này.',
      },
    ],
  },
  {
    slug: 'pha-quan',
    name: 'Phá Quân',
    category: 'major',
    archetype: 'Hao tinh — sao phá cách: đổi mới, mạo hiểm, làm lại từ đầu. Thuộc nhóm Bắc Đẩu chính tinh, an theo tinh hệ Thiên Phủ, khép lại bộ động Sát - Phá - Tham. Chữ "hao" nói thật về cái giá của đổi mới: mỗi lần phá là một lần tiêu hao năng lượng, tiền bạc, quan hệ.',
    positive: [
      'Khả năng khởi tạo mới.',
      'Không ngại bỏ cái cũ.',
      'Dám đụng vào thứ người khác né: hệ thống cũ, thói quen cũ, thị trường chưa ai vào.',
      'Sau mỗi lần làm lại thường mạnh hơn phiên bản trước — miễn là có rút bài học.',
    ],
    caution: [
      'Dễ phá rồi không xây.',
      'Cần học hoàn thiện.',
      'Chi mạnh tay cho cái mới; quỹ ổn định hay bị rút cho những cuộc phiêu lưu.',
      'Không phải cái gì cũ cũng đáng phá — giữ lại phần đang chạy tốt là một kỹ năng.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người ưa thay đổi, dám đập đi làm lại thứ người khác không dám đụng. Hao tinh nghĩa là tiêu hao: mỗi lần phá tốn năng lượng, tiền bạc, quan hệ. Chọn đúng thứ đáng phá, và hoàn thiện nốt phần xây sau khi phá — đó là bài học trọn đời của sao này.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp khởi nghiệp, tái cấu trúc, chuyển đổi, mở thị trường mới: nơi cần người đi trước phá băng. Ít hợp việc lặp đều, giữ khuôn. Sự nghiệp thường nhiều chương, mỗi chương một lĩnh vực — đó là kiểu vận hành của sao này, không phải thiếu kiên định.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền vào ra mạnh, chi cho cái mới rất bạo: đồ nghề, dự án, làm lại từ đầu. Được cái dám đầu tư cho thay đổi; mất cái khó giữ quỹ ổn định. Nguyên tắc hợp: khoá một phần thu nhập vào nơi khó rút trước khi bắt đầu cuộc phiêu lưu kế tiếp.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Quan hệ nhiều biến chuyển: yêu nhanh, đổi lớn theo từng giai đoạn đời. Với người Phá Quân, sự ổn định không tự đến mà phải được xây có chủ đích: nghi thức chung, cam kết rõ. Đối phương hợp là người coi thay đổi là làm mới, không phải mối đe doạ.',
      },
      {
        palace: 'Điền Trạch',
        reading:
          'Hay chuyển chỗ ở, thích sửa sang, đập ra làm lại; ngôi nhà với người Phá Quân là một dự án hơn là chốn cố định. Nếu tính mua nhà, hãy cộng thêm chi phí "đổi ý" vào ngân sách và ưu tiên tài sản dễ thanh khoản.',
      },
    ],
    withMutagen: [
      {
        type: 'Lộc',
        reading:
          'Phá Quân Hoá Lộc (can Quý): cái mới ra tiền — dự án làm lại từ đầu, thị trường chưa ai vào. Giai đoạn thuận cho khởi sự; nhớ chốt sổ từng chặng để lộc không theo hao đi mất.',
      },
      {
        type: 'Quyền',
        reading:
          'Phá Quân Hoá Quyền (can Giáp): được trao quyền thay đổi — tái cấu trúc, cầm dự án chuyển đổi. Sức phá có định hướng thành sức bứt; để ý đừng phá luôn cả phần đang chạy tốt.',
      },
    ],
  },
];

// ============================================================================
// Auxiliary stars (phụ tinh / sao bổ trợ) — 33 sao/cặp sao hay được hỏi
// ============================================================================

export const AUX_STARS_CONTENT: StarContent[] = [
  {
    slug: 'thien-ma',
    name: 'Thiên Mã',
    category: 'aux',
    archetype: 'Sao dịch mã — con ngựa trạm của lá số: di chuyển, thay đổi, cơ hội ở phương xa. Thiên Mã không tự quyết tốt xấu; nó tăng tốc cho những gì đi cùng. Đi với tài tinh thì tiền theo bước chân, đi với sao động thì đời càng nhiều chuyến.',
    positive: [
      'Năng động, thích nghi nhanh với môi trường mới.',
      'Hợp công việc đi lại, xê dịch, kết nối nhiều nơi.',
      'Gặp Lộc Tồn tạo cách Lộc Mã — cách kinh điển của người "càng đi càng có": hợp nghề gắn với dịch chuyển, giao thương.',
    ],
    caution: [
      'Dễ thiếu ổn định nếu thay đổi quá nhiều — nên chọn điểm dừng đúng lúc.',
      'Đổi chỗ để giải quyết vấn đề chỉ hiệu quả khi vấn đề nằm ở chỗ, không nằm ở mình.',
    ],
    byPalace: [
      {
        palace: 'Thiên Di',
        reading:
          'Đúng đất của sao dịch mã: đi xa hay đổi môi trường thường mở ra cơ hội, hợp lập nghiệp ngoài quê. Đáng lập một "quỹ dịch chuyển" riêng vì đời bạn sẽ có nhiều chuyến hơn người khác.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Tính hiếu động, ưa trải nghiệm, khó ngồi yên một chỗ. Chọn nghề có yếu tố di chuyển hoặc thay đổi đề tài thường xuyên sẽ dễ chịu hơn là ép mình vào một chỗ ngồi cố định.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền tài gắn với di chuyển: nguồn thu từ nơi xa, việc chạy ngoài, giao thương. Gặp Lộc Tồn thành cách Lộc Mã — dòng tiền theo bước chân; càng chịu đi, cửa kiếm càng mở.',
      },
    ],
  },
  {
    slug: 'ta-phu',
    name: 'Tả Phụ',
    category: 'aux',
    archetype: 'Trợ tinh — một nửa của cặp Tả Phụ - Hữu Bật, nhóm cát tinh hàng đầu: quý nhân, đồng minh, sức mạnh làm việc nhóm. Vai trò của cặp này là giúp chính tinh "đứng vững": Tử Vi thiếu Tả Hữu thường được ví như vua không có triều thần, dễ cô lập.',
    positive: [
      'Có quý nhân hỗ trợ trong sự nghiệp.',
      'Khả năng làm việc nhóm tốt.',
      'Làm mạnh thêm mặt tốt của chính tinh cùng cung — kiểu cánh tay phải khiến người giỏi càng giỏi.',
      'Bản thân cũng là người hay giúp: cho đi trước, nhận lại sau.',
    ],
    caution: [
      'Cần học tự đứng vững khi không có Tả Phụ ở đại vận.',
      'Quen có người đỡ dễ thành ỷ lại — sự giúp đỡ là gia tốc, không phải động cơ chính.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người dễ có quý nhân, có sức hỗ trợ tự nhiên: gặp khó thường có người chìa tay. Đổi lại, chính bạn cũng là kiểu người hay đứng ra đỡ người khác — vòng cho và nhận này là tài sản lớn nhất của sao.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp vai trò có đội ngũ cùng làm, không hợp chiến đấu một mình. Sự nghiệp lên nhanh nhất khi bạn ở trong một ê-kíp tốt — chọn đội trước khi chọn việc là chiến lược đúng với sao này.',
      },
    ],
  },
  {
    slug: 'huu-bat',
    name: 'Hữu Bật',
    category: 'aux',
    archetype: 'Trợ tinh — nửa còn lại của cặp Tả Phụ - Hữu Bật, hỗ trợ thiên về mềm: cảm xúc, tinh thần, sự có mặt đúng lúc. Nếu Tả Phụ là cánh tay đỡ việc thì Hữu Bật là bờ vai đỡ người; cặp này đủ đôi thì chính tinh cùng cung vững hẳn lên.',
    positive: [
      'Có người hỗ trợ về cảm xúc và tinh thần.',
      'Quan hệ mạng lưới rộng.',
      'Khéo trong việc kết nối người với người — kiểu quý nhân thầm lặng của tập thể.',
      'Sự giúp đỡ thường đến từ bạn bè thân tình hơn là từ quan hệ công việc khô khan.',
    ],
    caution: [
      'Khi xa Tả Phụ, có thể cảm thấy cô đơn dù được giúp đỡ.',
      'Giúp người bằng cảm xúc dễ bị cuốn vào chuyện của người khác — cần giữ ranh giới.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Tâm tính ấm áp, dễ kết bạn, được quý vì sự chân thành hơn là vì tài ăn nói. Lúc khó thường có người bên cạnh — và bạn cũng là người mà bạn bè tìm đến trước tiên khi họ cần một chỗ dựa.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Hôn nhân có hỗ trợ từ bạn bè, gia đình hai bên — quan hệ không đơn độc mà có cả một mạng lưới đỡ phía sau. Giữ được sự quý mến của hai họ và nhóm bạn chung là một khoản bảo hiểm tình cảm đáng giá.',
      },
    ],
  },
  {
    slug: 'van-xuong',
    name: 'Văn Xương',
    category: 'aux',
    archetype: 'Văn tinh — một nửa của cặp Văn Xương - Văn Khúc, nghiêng về chữ nghĩa: học vấn, viết lách, văn chương, giấy tờ. Trong cặp văn tinh, Xương là ngòi bút còn Khúc là giọng nói; người có đủ cặp thường vừa viết hay vừa nói khéo.',
    positive: [
      'Khả năng viết và diễn đạt tốt.',
      'Hợp công việc trí thức.',
      'Học hành thi cử có lợi thế: tiếp thu qua sách vở nhanh, trình bày mạch lạc.',
      'Tô thêm nét "có học" cho chính tinh cùng cung — sao mạnh mà thêm Xương thì vừa giỏi vừa nói được viết được.',
    ],
    caution: [
      'Khi gặp Hoá Kỵ, dễ vướng giấy tờ, hợp đồng — đọc kỹ trước khi ký là nguyên tắc sống của người có bộ này.',
      'Chuộng chữ nghĩa quá dễ thành lý thuyết suông; kiến thức cần được đem ra dùng.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người ưa đọc, viết, suy ngẫm; diễn đạt bằng chữ tốt hơn bằng lời nói bột phát. Nuôi thói quen viết đều — nhật ký, ghi chú, bài chia sẻ — là cách rẻ nhất để biến thiên hướng này thành lợi thế nghề nghiệp.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp ngành giáo dục, xuất bản, truyền thông, nghiên cứu — nơi chữ nghĩa là công cụ chính. Bằng cấp, chứng chỉ, bài viết có tên mình là những viên gạch thăng tiến cụ thể của người có Văn Xương tại đây.',
      },
    ],
  },
  {
    slug: 'van-khuc',
    name: 'Văn Khúc',
    category: 'aux',
    archetype: 'Văn tinh — nửa còn lại của cặp Văn Xương - Văn Khúc, nghiêng về nghệ thuật: lời nói, âm nhạc, biểu diễn, cái đẹp. Nếu Văn Xương là ngòi bút thì Văn Khúc là giọng nói và đôi tai thẩm mỹ; sao này cho khả năng chạm vào cảm xúc người khác.',
    positive: [
      'Khả năng diễn đạt qua nghệ thuật.',
      'Hợp công việc cần sự sáng tạo.',
      'Nói có duyên, kể chuyện cuốn — chất "trình diễn" tự nhiên không cần học.',
      'Cảm thụ cái đẹp tốt: nghe ra cái hay, nhìn ra cái đẹp mà người khác lướt qua.',
    ],
    caution: [
      'Cảm xúc dễ thay đổi.',
      'Làm việc theo hứng — ngày thăng hoa ngày nguội lạnh; sản phẩm cần deadline hơn cần cảm hứng.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người có tâm hồn nghệ sĩ: nhạy với cái đẹp, nói chuyện có duyên, sống thiên về cảm nhận. Chọn được nghề cho phép chất nghệ ấy ra tiền thì như cá gặp nước; kẹt trong việc khô khan lâu ngày dễ héo.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp nghệ thuật, ca hát, biểu diễn, sáng tạo nội dung — nghề mà cảm xúc và cái duyên là công cụ lao động. Xây kho tác phẩm đều đặn quan trọng hơn chờ một cú toả sáng: nghề này thắng bằng sự bền.',
      },
    ],
  },
  {
    slug: 'khoi-viet',
    name: 'Thiên Khôi - Thiên Việt',
    category: 'aux',
    archetype: 'Cặp quý nhân tinh — Thiên Khôi và Thiên Việt chuyên về một loại may mắn cụ thể: gặp người trên đỡ đầu. Không phải trúng số, mà là đúng lúc bế tắc có người dày dạn hơn chỉ đường, tiến cử, mở cửa — kiểu quý nhân có thẩm quyền thật.',
    positive: [
      'Có quý nhân lớn tuổi hỗ trợ.',
      'Hợp được mentor có thẩm quyền.',
      'Các bước ngoặt lớn — thi cử, xin việc, thăng chức — thường có bàn tay người trên nhúng vào đúng lúc.',
      'Dễ được người có vị thế tin tưởng và tiến cử, vì toát ra sự đáng đào tạo.',
    ],
    caution: [
      'Cần giữ thái độ khiêm tốn để giữ quý nhân.',
      'Quý nhân mở cửa, còn bước qua cửa và đứng vững là việc của mình — đừng biến người đỡ đầu thành chỗ dựa vĩnh viễn.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Đời thường có người trên giúp ở các bước ngoặt: một người thầy, một người sếp, một tiền bối thấy được tiềm năng của bạn. Việc của bạn là chủ động tìm và giữ những mối quan hệ đó — quý nhân thích người biết hỏi và biết ơn.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Sự nghiệp thuận hơn hẳn khi có người dẫn dắt: hợp môi trường có lớp lang thầy trò, tiền bối hậu bối. Chọn sếp giỏi quan trọng không kém chọn công ty — với bộ sao này, một người thầy tốt đáng giá bằng nhiều năm tự mò.',
      },
    ],
  },
  {
    slug: 'loc-ton',
    name: 'Lộc Tồn',
    category: 'aux',
    archetype: 'Tài tinh trong nhóm phụ tinh — chuyên về tích luỹ, dòng tiền ổn định, bảo toàn vốn. Khác Vũ Khúc (chính tinh tiền bạc, chủ động kiếm), Lộc Tồn là tiền "giữ lại được". Đi cùng Thiên Mã thành cách Lộc Mã: tiền theo bước chân, hợp người hay dịch chuyển.',
    positive: [
      'Tích luỹ tài chính qua chuyên môn.',
      'Khả năng quản lý tiền dài hạn.',
      'Có khoản dằn lưng gần như trong mọi hoàn cảnh — kiểu người "kiến tha lâu đầy tổ".',
      'Gặp Thiên Mã thành cách Lộc Mã: dòng tiền mở ra khi chịu di chuyển, đổi thị trường, đi xa.',
    ],
    caution: [
      'Có thể quá thận trọng, bỏ lỡ cơ hội tăng trưởng.',
      'Tiết kiệm quá tay dễ thành hà tiện với chính mình — tiền để dành là để phục vụ đời sống, không phải ngược lại.',
    ],
    byPalace: [
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền vào đều, hợp tiết kiệm và bảo toàn vốn: gửi định kỳ, tài sản an toàn, chi tiêu có sổ sách. Đây không phải cách giàu nhanh mà là cách hiếm khi rơi vào túng thiếu — thế mạnh đáng quý hơn người ta tưởng.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Người chắc chắn, quý sự ổn định, không thích nợ nần. Xung quanh hay nhờ giữ tiền, giữ quỹ vì độ tin cậy cao. Chỉ cần nhớ chừa chỗ cho vài cơ hội có kiểm soát, đừng để sự an toàn đóng hết mọi cánh cửa.',
      },
    ],
  },
  {
    slug: 'kinh-da',
    name: 'Kình Dương - Đà La',
    category: 'aux',
    archetype: 'Cặp sát tinh — "gai trong vận": áp lực, mâu thuẫn, ma sát. Kình Dương (còn gọi Dương Nhận) cương mãnh, sắc bén như lưỡi dao; Đà La dai dẳng, trì kéo như bánh xe lún cát. Sát tinh không phải điềm gở — nó là độ khó của đề bài, và độ khó rèn ra người giỏi.',
    positive: [
      'Tăng động lực trong khủng hoảng.',
      'Hợp công việc cạnh tranh.',
      'Chất sắc bén của Kình Dương hợp nghề cần độ quyết liệt: phẫu thuật, thể thao, kinh doanh đối đầu, kỹ thuật chính xác.',
      'Người từng qua nhiều ma sát thường lì đòn và thực chiến hơn người thuận buồm.',
    ],
    caution: [
      'Dễ vướng tranh chấp.',
      'Cần kiểm soát phản ứng dưới áp lực.',
      'Kình Dương nóng và nhanh, Đà La lì và dai — biết mình thuộc kiểu nào để chọn cách hạ nhiệt phù hợp.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người có phần "lửa" trong tính cách: phản ứng nhanh, không ngán va chạm. Năng lượng này cần kênh xả hợp — thể thao, mục tiêu cạnh tranh, việc khó — nếu không nó sẽ tự tìm đường ra bằng tranh cãi vặt.',
      },
      {
        palace: 'Tật Ách',
        reading:
          'Lời nhắc cẩn trọng thương tích, va chạm khi vận động và di chuyển — không phải dự báo bệnh nặng. Người có bộ này nên coi trọng đồ bảo hộ, khởi động kỹ, và đừng làm việc nặng lúc đang nóng giận.',
      },
    ],
  },
  {
    slug: 'hoa-linh',
    name: 'Hỏa Tinh - Linh Tinh',
    category: 'aux',
    archetype: 'Cặp sát tinh — biến động đột ngột: Hỏa Tinh bùng như lửa rơm, Linh Tinh âm ỉ như than hồng. Điểm đặc biệt nhất của cặp này: gặp Tham Lang lại thành cách phát mạnh Hỏa Tham / Linh Tham — cú bộc phát bất ngờ, sát tinh đặt đúng chỗ hoá thành lực đẩy.',
    positive: [
      'Khả năng phản ứng nhanh.',
      'Hợp ngành thay đổi liên tục.',
      'Đi cùng Tham Lang thành cách Hỏa Tham / Linh Tham: cơ hội đến bất ngờ, phát nhanh — cách bộc phát kinh điển được cổ thư đặt tên.',
      'Trong khủng hoảng cần người quyết trong vài giây, đây là kiểu người đó.',
    ],
    caution: [
      'Quyết định bốc đồng dễ tốn tiền.',
      'Cần học suy nghĩ trước khi hành động.',
      'Cách Hỏa Tham phát nhanh nhưng giữ được hay không là chuyện khác — bộc phát cần đi kèm kỷ luật chốt lời và giữ thành quả.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người năng lượng cao, ưa đột phá, phản xạ nhanh hơn suy tính. Hợp môi trường nhịp gấp: cấp cứu, thị trường biến động, sự kiện trực tiếp. Quy tắc tự cứu: quyết định lớn để qua một đêm rồi hãy chốt.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền đến và đi đều có thể đột ngột: khoản thu bất ngờ, khoản chi bốc đồng. Gặp Tham Lang cùng bộ là cách Hỏa Tham — có những cú phát nhanh; nguyên tắc là chốt một phần thành quả ngay, đừng để lửa cháy hết rơm.',
      },
    ],
  },
  {
    slug: 'hoa-loc',
    name: 'Hoá Lộc',
    category: 'aux',
    archetype: 'Một trong Tứ Hoá — Lộc: tài lộc, cơ hội, "duyên". Không phải sao độc lập mà là lớp biến hoá gắn vào một sao theo Thiên Can của năm sinh (Tứ Hoá gốc) hoặc của đại vận, lưu niên (Tứ Hoá lưu). Hoá Lộc rơi vào cung nào, cung đó mở cửa thuận.',
    positive: [
      'Năm có Hoá Lộc thường có cơ hội tài chính + nghề mới.',
      'Hợp đẩy sự nghiệp.',
      'Việc thuộc cung có Hoá Lộc trôi chảy hơn bình thường — đúng nghĩa "có duyên": gặp đúng người, đúng dịp.',
      'Là tín hiệu nên chủ động: cửa đang mở thì bước, đừng ngồi chờ lộc tự rơi.',
    ],
    caution: [
      'Cơ hội nhiều nhưng cần kỷ luật để giữ.',
      'Lộc vào tay dễ sinh chủ quan, vung tay — giai đoạn thuận là lúc nên tích, không phải lúc nên xả.',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Giai đoạn thuận cho thăng tiến, mở rộng vai trò: dự án tìm đến, lời mời xuất hiện. Nên chủ động đề xuất việc mình muốn làm — cùng một nỗ lực, giai đoạn này dễ được gật đầu hơn hẳn.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Giai đoạn dòng tiền vào thuận, hợp tích luỹ. Nguyên tắc dùng đúng: trích ngay một phần vào tiết kiệm hoặc tài sản dài hạn khi tiền về — lộc chỉ thành của khi được giữ lại.',
      },
    ],
  },
  {
    slug: 'hoa-ky',
    name: 'Hoá Kỵ',
    category: 'aux',
    archetype: 'Một trong Tứ Hoá — Kỵ: vướng mắc, "nút thắt", chủ đề cần đặc biệt để tâm. Đây là lớp Tứ Hoá bị hiểu sai nhiều nhất: Hoá Kỵ không phải điềm xui, mà là nơi ta dễ tự làm khó mình — và cũng là động cơ trưởng thành mạnh nhất nếu nhận biết được.',
    positive: [
      'Là tín hiệu cảnh báo — ai biết đọc thì tránh được tổn thất.',
      'Tăng động lực rèn luyện.',
      'Chỉ đích danh chủ đề đáng đầu tư công sức nhất trong giai đoạn: mỗi bộ Tứ Hoá luôn có một Hoá Kỵ, đời nào cũng có việc khó cần xử lý — đó là bình thường.',
      'Nút thắt được gỡ chủ động thường biến thành thế mạnh: chỗ từng vấp là chỗ hiểu sâu nhất.',
    ],
    caution: [
      'Không phải "đời mạt vận" — là chủ đề cần xử lý trong năm/giai đoạn đó.',
      'Cẩn trọng quyết định lớn khi Hoá Kỵ tại cung liên quan.',
      'Đọc Hoá Kỵ mà hoảng sợ là đọc sai; đọc rồi lập kế hoạch xử lý mới là đọc đúng.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Chủ đề chính là "tự nhìn lại": dễ để tâm quá mức vào một chuyện, tự làm khó mình. Giai đoạn này không hợp mở rộng vội; hợp sắp xếp lại bên trong — sức khoẻ, thói quen, cách phản ứng.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Giai đoạn cần kỷ luật tài chính cao: tránh đòn bẩy, tránh khoản đầu tư "nghe nói", soát lại các dòng chi. Tiền không biến mất vì Hoá Kỵ — nó chỉ trừng phạt sự bất cẩn nhanh hơn thường lệ.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Giai đoạn cần giao tiếp kỳ vọng rõ — dễ hiểu lầm trong quan hệ, chuyện nhỏ xé ra to. Cách gỡ cụ thể: nói chuyện trực tiếp thay vì nhắn tin, hỏi lại trước khi suy diễn, và đừng để bụng qua đêm.',
      },
    ],
  },
  {
    slug: 'dia-khong-kiep',
    name: 'Địa Không - Địa Kiếp',
    category: 'aux',
    archetype: 'Cặp sát tinh nặng ký nhất theo cách gọi cổ — nhưng bản chất là phá cách: tư duy khác thường, không theo lối mòn, dễ hao hụt vật chất. Cổ thư gọi là "không vong"; cách đọc hiện đại công bằng hơn: đây là sao của người nhìn thế giới bằng con mắt khác số đông.',
    positive: [
      'Tư duy đột phá, không theo lối mòn — hợp sáng tạo, nghiên cứu, tâm linh.',
      'Trải nghiệm mất mát sớm giúp trưởng thành về tinh thần.',
      'Ít bám chấp vật chất hơn người thường — buông được thứ người khác không dám buông.',
      'Những ngành cần nghĩ ngược — nghiên cứu, nghệ thuật khái niệm, triết học, công nghệ mới — là đất dụng võ.',
    ],
    caution: [
      'Tài chính dễ vào ra thất thường — nên tránh đầu cơ, vay đòn bẩy lớn.',
      'Là lực "phá để làm mới", KHÔNG phải điềm xui cố định.',
      'Ý tưởng khác người cần bằng chứng và đồng minh; thiếu hai thứ đó dễ bị gán mác viển vông.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người nghĩ khác số đông, hợp con đường phi truyền thống. Chìa khoá là chọn môi trường trọng ý tưởng lạ: ở đó bạn là người tiên phong; ở môi trường chuộng khuôn phép, cùng bộ óc ấy lại bị xem là kẻ lạc nhịp.',
      },
      {
        palace: 'Tài Bạch',
        reading:
          'Tiền hợp với chuyên môn và sáng tạo hơn là buôn bán đầu cơ. Nguyên tắc an toàn của bộ này: không đòn bẩy lớn, không bỏ hết trứng vào một vụ đặt cược, và để một người thực tế hơn cùng soát các quyết định tiền bạc lớn.',
      },
    ],
  },
  {
    slug: 'hoa-quyen',
    name: 'Hoá Quyền',
    category: 'aux',
    archetype: 'Một trong Tứ Hoá — Quyền: năng lực, quyền hành, làm chủ. Là lớp biến hoá gắn vào một sao theo Thiên Can, cho biết cung nào trong giai đoạn nào bạn được trao thêm quyền — kèm theo đó, tất nhiên, là thêm trách nhiệm và áp lực.',
    positive: [
      'Tăng khả năng nắm việc, ra quyết định, dẫn dắt.',
      'Giai đoạn hợp nhận thêm trách nhiệm, mở rộng tầm ảnh hưởng.',
      'Tiếng nói có trọng lượng hơn: cùng một đề xuất, giai đoạn có Hoá Quyền dễ được lắng nghe hơn.',
      'Hợp đàm phán tăng lương, nhận vai trò mới, đứng ra cầm dự án.',
    ],
    caution: [
      'Dễ ôm việc, cứng nhắc hoặc áp đặt — cần học uỷ quyền.',
      'Quyền tăng thì va chạm cũng tăng: người cùng muốn cầm trịch sẽ xuất hiện, nên thắng bằng kết quả thay vì bằng tranh cãi.',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Giai đoạn thăng tiến, hợp vai trò quản lý: được giao việc lớn, lời đề xuất có sức nặng. Cách dùng đúng là chủ động nhận trách nhiệm rõ ràng, đo được — quyền đi kèm kết quả mới bền.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Khí chất mạnh lên, dám đứng mũi chịu sào, dám va chạm để bảo vệ quan điểm. Để ý giọng nói với người thân: năng lượng "làm chủ" mang về nhà nguyên đai nguyên kiện dễ thành áp đặt.',
      },
    ],
  },
  {
    slug: 'hoa-khoa',
    name: 'Hoá Khoa',
    category: 'aux',
    archetype: 'Một trong Tứ Hoá — Khoa: danh tiếng, học vấn, quý nhân ngầm. Trong bốn Hoá, Khoa là lớp dịu nhất: không bùng nổ như Lộc, không nặng gánh như Quyền — nó làm cho tên tuổi sạch đẹp và đường đi êm, kiểu "hữu xạ tự nhiên hương".',
    positive: [
      'Hợp thi cử, học hành, xây dựng uy tín và hình ảnh.',
      'Có quý nhân nhẹ nhàng giúp đỡ, tiếng lành đồn xa.',
      'Giai đoạn đẹp để lấy bằng cấp, chứng chỉ, công bố công trình, ra mắt tác phẩm gắn tên mình.',
      'Khi gặp rắc rối, danh tiếng tốt tích luỹ từ trước là tấm đệm đỡ — Khoa còn được đọc là "gặp dữ hoá lành" nhẹ nhàng.',
    ],
    caution: [
      'Trợ lực vừa phải — danh tốt nhưng không đẩy mạnh tài lộc trực tiếp.',
      'Đừng nhầm danh với thực: Hoá Khoa cho tiếng thơm, còn thực lực vẫn phải tự bồi.',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp việc cần uy tín, chuyên môn, bằng cấp: giai đoạn nên đầu tư vào chứng chỉ, hồ sơ năng lực, bài viết chuyên môn. Thăng tiến kiểu Khoa là được tiến cử vì tiếng tốt, không phải vì tranh giành.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Phong thái nhã nhặn, dễ được tin tưởng; người khác sẵn lòng gửi gắm việc quan trọng. Tận dụng bằng cách xuất hiện đúng chỗ: hội thảo, cộng đồng nghề, nơi uy tín cá nhân được nhìn thấy.',
      },
    ],
  },
  {
    slug: 'dao-hoa',
    name: 'Đào Hoa',
    category: 'aux',
    archetype: 'Sao đào hoa — sức hút, duyên dáng, quan hệ xã hội. Chữ "đào hoa" trong Tử Vi rộng hơn chuyện tình ái: nó là cái duyên khiến người khác muốn lại gần — thứ vốn liếng vô hình mà nghề nào cần con người cũng trả giá cao.',
    positive: [
      'Có sức hút tự nhiên, dễ gây thiện cảm — hợp nghề giao tiếp, biểu diễn.',
      'Đời sống tình cảm và xã hội phong phú.',
      'Mở cửa quan hệ nhanh: vào môi trường mới không lâu đã có người quen, người giúp.',
      'Duyên dùng đúng chỗ thành lợi thế nghề: bán hàng, ngoại giao, dịch vụ, xây cộng đồng.',
    ],
    caution: [
      'Nhiều mối quan tâm dễ phân tâm — cần rõ ràng, chừng mực trong quan hệ.',
      'Được nhiều người quý cũng có mặt trái: lời ra tiếng vào, hiểu lầm ghen tuông — minh bạch là cách phòng tốt nhất.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người duyên dáng, ăn nói có sức cuốn, đi đâu cũng dễ được thiện cảm. Cái duyên này là tài sản nghề nghiệp thật sự — miễn là dùng nó để mở cửa công việc, đừng chỉ để mở những cánh cửa rắc rối.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Tình duyên sôi nổi, không thiếu lựa chọn; bài toán không phải là tìm mà là giữ. Hợp chủ động vun đắp sự chung thuỷ: ranh giới rõ với các mối quan hệ ngoài, và ưu tiên thời gian cho người mình chọn.',
      },
    ],
  },
  {
    slug: 'hong-loan-thien-hy',
    name: 'Hồng Loan - Thiên Hỷ',
    category: 'aux',
    archetype: 'Cặp hỷ tinh — tình duyên, cưới hỏi, tin vui. Hồng Loan thiên về duyên đôi lứa, Thiên Hỷ thiên về không khí hoan hỉ nói chung: tiệc tùng, tin mừng, sự kiện đáng ăn mừng. Dân gian xem lưu niên gặp cặp này là "năm có tin vui" — đọc đúng là năm THUẬN cho chuyện vui, không phải lời hứa.',
    positive: [
      'Báo hiệu các dịp vui: cưới hỏi, gặp gỡ, gắn kết.',
      'Tâm tính ấm áp, dễ mến.',
      'Không khí quanh người có hỷ tinh thường nhẹ nhõm — họ là người mang tin vui, người được nhờ tổ chức chuyện mừng.',
      'Giai đoạn gặp hỷ tinh hợp làm những việc cần thiện cảm: ra mắt, kết nối, ngỏ lời.',
    ],
    caution: [
      'Là tín hiệu thời điểm thuận, không thay cho việc chủ động xây dựng quan hệ.',
      'Đừng vin vào "năm đẹp" mà vội các quyết định trăm năm — thời điểm thuận cộng lựa chọn đúng mới thành chuyện vui trọn.',
    ],
    byPalace: [
      {
        palace: 'Phu Thê',
        reading:
          'Giai đoạn thuận cho chuyện tình cảm tiến triển, kết đôi: ngỏ lời, ra mắt, về chung nhà đều êm hơn thường lệ. Người đang tìm hiểu nên tận dụng độ thuận này để tiến một bước rõ ràng.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Người vui vẻ, lạc quan, thu hút thiện cảm — kiểu người được mời làm cầu nối, chủ xị những dịp sum vầy. Năng lượng tích cực này là vốn xã hội: giữ nó bằng cách chọn ở gần những người cũng tử tế với mình.',
      },
    ],
  },
  {
    slug: 'long-tri-phuong-cac',
    name: 'Long Trì - Phượng Các',
    category: 'aux',
    archetype: 'Cặp quý tinh — tài hoa, thanh nhã, khoa bảng. Long Trì là ao rồng, Phượng Các là gác phượng: hai hình ảnh của sự thanh cao có học. Cặp sao này tô thêm nét "sang" cho cung nó đứng — kiểu sang của gu và học vấn, không phải của tiền.',
    positive: [
      'Gu thẩm mỹ tốt — hợp nghệ thuật, học thuật, công việc tinh tế.',
      'Phong thái lịch thiệp, được nể trọng.',
      'Hợp thi cử, khoa bảng theo cách nói cổ — môi trường học thuật, thi tuyển là chỗ phát huy.',
      'Làm gì cũng ra nét chỉn chu: sản phẩm qua tay thường đẹp hơn mặt bằng chung.',
    ],
    caution: [
      'Chuộng cái đẹp/hình thức — nên cân bằng với thực tế.',
      'Cầu toàn về thẩm mỹ dễ chậm tiến độ; đôi khi "đủ tốt và đúng hẹn" thắng "hoàn hảo mà trễ".',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp ngành đòi hỏi thẩm mỹ, chuyên môn cao, hình ảnh: thiết kế, kiến trúc, học thuật, thương hiệu. Ở những nghề này, cái gu của bạn là năng lực cạnh tranh — hãy để sản phẩm nói thay.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Người nhã nhặn, ưa sự chỉn chu, tinh tế từ lời ăn tiếng nói đến đồ dùng. Được quý vì phong thái; chỉ cần tránh để sự cầu kỳ thành thước đo xét nét người khác.',
      },
    ],
  },
  {
    slug: 'thien-khoc-thien-hu',
    name: 'Thiên Khốc - Thiên Hư',
    category: 'aux',
    archetype: 'Cặp sao u tịch — Thiên Khốc (tiếng khóc) và Thiên Hư (sự trống): nhạy cảm, hoài niệm, cảm giác thiếu hụt khó gọi tên. Nghe u ám, nhưng lớp nghĩa tích cực rất thật: người từng biết buồn sâu thường hiểu người khác sâu — đó là nguyên liệu của lòng trắc ẩn.',
    positive: [
      'Chiều sâu nội tâm, đồng cảm tốt — hợp việc cần sự tinh tế cảm xúc.',
      'Biết trân trọng điều mình có khi vượt qua cảm giác trống trải.',
      'Nhạy với nỗi buồn của người khác — tố chất của người làm nghề lắng nghe: tâm lý, chăm sóc, viết về con người.',
      'Ký ức và hoài niệm là kho chất liệu sáng tác nếu biết chuyển thành chữ, thành tác phẩm.',
    ],
    caution: [
      'Dễ lo nghĩ, hoài cổ — nên nuôi dưỡng kết nối và lối sống tích cực.',
      'Cảm giác thiếu hụt là khuynh hướng cảm nhận, không phải sự thật khách quan — gọi đúng tên nó là đã bớt nửa sức nặng.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Tâm hồn sâu sắc, đôi khi đa cảm; vui của bạn trầm hơn và buồn của bạn cũng dài hơn người khác. Đừng coi đó là lỗi — nó là độ sâu. Chỉ cần có kênh xả đều đặn: viết, trò chuyện, vận động.',
      },
      {
        palace: 'Phúc Đức',
        reading:
          'Đời sống tinh thần cần được chăm chủ động: người có bộ này không hợp kiểu "kệ, tự khắc ổn". Một nhịp sống có neo — giờ ngủ đều, người tri kỷ, thói quen nuôi tâm trí — đáng giá hơn mọi lời khuyên lạc quan suông.',
      },
    ],
  },
  {
    slug: 'co-than-qua-tu',
    name: 'Cô Thần - Quả Tú',
    category: 'aux',
    archetype: 'Cặp sao cô độc — Cô Thần và Quả Tú: độc lập, thích riêng tư, có khoảng cách tự nhiên trong quan hệ. Tên nghe buồn nhưng cần đọc công bằng: đây là sao của người tự đứng được một mình — phẩm chất mà thời nào cũng hiếm và có giá.',
    positive: [
      'Tự chủ, làm việc độc lập tốt, không phụ thuộc đám đông.',
      'Hợp công việc cần tập trung, chuyên sâu.',
      'Không sợ ở một mình nên ít khi giữ những mối quan hệ độc hại chỉ vì sợ cô đơn.',
      'Nghề cần độ tĩnh — nghiên cứu, viết, kỹ thuật sâu, thủ công tinh xảo — là đất phát huy.',
    ],
    caution: [
      'Dễ thu mình — nên chủ động giữ kết nối với người thân.',
      'Khoảng cách là khuynh hướng, không phải số phận: người có bộ này vẫn gắn bó sâu được, chỉ là cần chủ động hơn người khác một chút.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Tính tự lập cao, thích không gian riêng, thấy nạp năng lượng khi ở một mình. Đừng ép mình quảng giao theo chuẩn người khác; chỉ cần giữ vài kết nối chất lượng và đừng để tuần nào trôi qua không gặp ai.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Cần chủ động vun đắp gần gũi, tránh trượt vào lối sống "ai việc nấy" dưới một mái nhà. Cách gỡ cụ thể: giữ những nghi thức chung nhỏ mà đều — bữa tối cùng nhau, chuyến đi định kỳ, giờ trò chuyện không màn hình.',
      },
    ],
  },
  {
    slug: 'thien-hinh',
    name: 'Thiên Hình',
    category: 'aux',
    archetype: 'Sao kỷ luật — thanh gươm của lá số: nguyên tắc, sắc bén, ưa công lý. Thiên Hình mang hình ảnh hình pháp, khuôn phép; đứng cạnh chính tinh nào là thêm cho sao đó một nét nghiêm. Gươm sắc dùng đúng là công cụ, dùng sai là tự cứa tay.',
    positive: [
      'Kỷ luật, quyết đoán — hợp ngành luật, y, kỹ thuật, quân đội.',
      'Giữ nguyên tắc tốt, làm việc dứt khoát.',
      'Đáng tin ở vị trí gác chuẩn: kiểm định, pháp chế, kiểm soát chất lượng — nơi sự dễ dãi gây hậu quả.',
      'Tự giác cao, ít cần ai nhắc; nói được làm được.',
    ],
    caution: [
      'Dễ khắt khe với mình và người — cần thêm sự mềm mỏng.',
      'Rạch ròi đúng sai quá mức trong quan hệ thân tình dễ thành lạnh; người thân cần sự bao dung trước khi cần phán xử.',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp nghề cần kỷ luật và độ chính xác cao: luật, y, kỹ thuật, kiểm toán, lực lượng vũ trang. Ở những nghề này, sự nghiêm của bạn là tài sản; chỉ cần nhớ đồng nghiệp không phải ai cũng chạy theo chuẩn của mình.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Người cương trực, rạch ròi đúng sai, ghét sự lấp lửng. Được nể vì thẳng, nhưng nên học thêm cách nói thẳng mà không sắc — cùng một sự thật, cách đưa quyết định người nghe tiếp thu hay tự vệ.',
      },
    ],
  },
  {
    slug: 'thien-rieu',
    name: 'Thiên Riêu',
    category: 'aux',
    archetype: 'Sao đa tình — quyến rũ ngầm, nhạy bén tâm lý, chiều sâu cảm xúc. Khác Đào Hoa (duyên bề mặt, ai gặp cũng mến), Thiên Riêu là sức hút của sự bí ẩn: càng tiếp xúc lâu càng thấy cuốn. Đi kèm là độ nhạy đọc vị người khác gần như bản năng.',
    positive: [
      'Tinh tế, có sức hút riêng, nhạy với tâm lý người khác.',
      'Hợp công việc cần thấu hiểu con người.',
      'Đọc được điều người khác không nói ra — tố chất của nghề tâm lý, nhân sự, đàm phán, sáng tác.',
      'Đời sống cảm xúc giàu tầng lớp là kho chất liệu cho nghệ thuật và sự thấu cảm.',
    ],
    caution: [
      'Dễ sa vào cảm xúc/cám dỗ — cần ranh giới rõ ràng.',
      'Độ nhạy tâm lý dùng sai chỗ thành thao túng hoặc bị cuốn vào các mối quan hệ mập mờ — minh bạch với chính mình trước tiên.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người có chiều sâu, đôi khi bí ẩn, đa cảm; ít khi phô hết mình ra ngoài. Sức hút của bạn nằm ở các tầng lớp — nhưng người thân cần được vào tầng trong, đừng để ai thương mình mà vẫn thấy mình là ẩn số.',
      },
      {
        palace: 'Phu Thê',
        reading:
          'Đời sống tình cảm nhiều sắc thái, cảm xúc đậm và phức tạp hơn mặt bằng chung. Nguyên tắc giữ quan hệ bền: minh bạch sớm — nói rõ mình cần gì, đang thấy gì — trước khi cảm xúc kịp rẽ sang đường vòng.',
      },
    ],
  },
  {
    slug: 'tam-thai-bat-toa',
    name: 'Tam Thai - Bát Tọa',
    category: 'aux',
    archetype: 'Cặp quý tinh — Tam Thai và Bát Toạ, hình ảnh ghế ngồi và nghi trượng chốn công đường: địa vị, chỗ đứng, được nâng đỡ. Cặp này không tự tạo tài năng; nó tạo bệ — người có thực lực gặp thêm Tam Thai Bát Toạ thì danh phận đến sớm và vững hơn.',
    positive: [
      'Tăng uy tín, vị thế; dễ được cấp trên/tập thể ghi nhận.',
      'Hợp vai trò có danh phận, đại diện, quản lý.',
      'Trong tập thể thường được đặt vào ghế "có tiếng nói": trưởng nhóm, đại diện phát ngôn, người đứng tên.',
      'Danh phận đến kèm sự nể — thuận cho việc điều phối người và nguồn lực.',
    ],
    caution: [
      'Vị thế đi kèm trách nhiệm — giữ thực lực tương xứng với danh.',
      'Ghế càng cao gió càng mạnh: được ghi nhận nhiều cũng bị soi nhiều, nên giữ sự khiêm cẩn làm áo giáp.',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp thăng tiến, đảm nhận vị trí có tiếng nói: chức danh, vai đại diện, ghế quản lý. Cách dùng đúng là nhận ghế nào chắc ghế đó — mỗi danh phận đều được chống lưng bằng kết quả cụ thể.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Phong thái đĩnh đạc, được nể trọng; vào đám đông thường được nhường vai chủ toạ một cách tự nhiên. Vị thế ấy bền khi bạn dùng nó để nâng người khác lên, không phải để đứng cao hơn họ.',
      },
    ],
  },
  {
    slug: 'an-quang-thien-quy',
    name: 'Ân Quang - Thiên Quý',
    category: 'aux',
    archetype: 'Cặp quý tinh — Ân Quang (ánh sáng ân điển) và Thiên Quý (sự quý hiển): vinh dự, được ghi nhận, khoa danh. Đây là cặp sao của những tấm bằng khen đúng nghĩa — sự công nhận chính thức, có con dấu, đến từ nỗ lực tích luỹ được nhìn thấy.',
    positive: [
      'Hợp thi cử, được công nhận, có phần thưởng/ghi danh.',
      'Quý nhân ngầm nâng đỡ đúng lúc.',
      'Thành tích ít khi bị bỏ sót: làm tốt thường có người ghi nhận, tiến cử — sự tử tế được trả công.',
      'Hợp các cột mốc chính danh: bảo vệ luận án, nhận giải, được bổ nhiệm, vinh danh.',
    ],
    caution: [
      'Vinh dự đến từ tích luỹ thật — không trông chờ may rủi.',
      'Đừng làm việc chỉ để được khen; giải thưởng là sản phẩm phụ của việc làm đến nơi đến chốn.',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Hợp môi trường trọng bằng cấp, thành tích: học thuật, tổ chức lớn, cơ quan có lộ trình rõ. Ở đó nỗ lực của bạn được đo và được thưởng minh bạch — hãy chọn sân chơi có bảng điểm.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Dễ được tin tưởng, giao việc quan trọng; hồ sơ cá nhân thường đẹp hơn tuổi nghề. Giữ chữ tín như giữ vốn — với cặp sao này, uy tín là thứ sinh lãi kép qua từng năm.',
      },
    ],
  },
  {
    slug: 'hoa-cai',
    name: 'Hoa Cái',
    category: 'aux',
    archetype: 'Sao nghệ thuật — chiếc lọng hoa: tài hoa, thiên hướng tâm linh, có phần cô cao. Hoa Cái là sao của người "ở trên núi một mình mà không buồn": gu riêng, thế giới riêng, tiêu chuẩn riêng. Cái giá của sự độc đáo là đôi lúc thấy lạc lõng giữa đám đông.',
    positive: [
      'Năng khiếu nghệ thuật, triết lý, tôn giáo; gu riêng độc đáo.',
      'Khả năng tập trung sâu, làm việc một mình tốt.',
      'Không chạy theo đám đông nên giữ được bản sắc — thương hiệu cá nhân rõ nét là tài sản của sao này.',
      'Hợp các con đường cần chiều sâu đơn độc: sáng tác, tu tập, nghiên cứu, nghề thủ công bậc cao.',
    ],
    caution: [
      'Hơi kiêu, dễ thấy lạc lõng giữa đám đông — nên giữ kết nối.',
      'Tiêu chuẩn riêng cao quá dễ thành khinh khỉnh với cái phổ thông; sự độc đáo không cần phải kèm sự coi thường.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người có cá tính, thiên hướng nghệ thuật hoặc tâm linh, khó lẫn vào đám đông. Đừng gọt mình cho vừa khuôn; hãy tìm cộng đồng nhỏ cùng tần số — vài người hiểu mình đáng giá hơn trăm người quen hời hợt.',
      },
      {
        palace: 'Phúc Đức',
        reading:
          'Đời sống tinh thần phong phú, ưa chiêm nghiệm; một buổi một mình với sách, trà, thiên nhiên nạp năng lượng hơn một bữa tiệc. Cứ sống đúng nhịp đó, chỉ cần đừng để sự một mình thành sự cô lập.',
      },
    ],
  },
  {
    slug: 'tang-mon-bach-ho',
    name: 'Tang Môn - Bạch Hổ',
    category: 'aux',
    archetype: 'Cặp sao thuộc vòng Thái Tuế — Tang Môn gắn với chuyện buồn, hiếu sự; Bạch Hổ gắn với va chạm, thị phi. Đây là sao THEO GIAI ĐOẠN: nó mô tả màu của một năm, một vận, không phải bản tính con người. Đọc đúng là lời nhắc "năm này nên giữ gìn".',
    positive: [
      'Là tín hiệu "năm cần giữ gìn" — biết trước thì chủ động phòng bị.',
      'Gắn với giai đoạn, KHÔNG phải bản tính cố định.',
      'Giá trị thật của cặp sao này là nhắc ta sống chậm lại một nhịp: hỏi thăm người thân, rà lại sức khoẻ, bớt hiếu thắng.',
      'Năm biết mình cần thủ thường lại là năm ít sự cố nhất — vì có chuẩn bị.',
    ],
    caution: [
      'Năm gặp: chú ý sức khoẻ người thân, tránh tranh chấp, đi lại cẩn thận.',
      'KHÔNG phải "điềm gở" — chỉ là nhắc nhở thận trọng, không nên hoảng.',
      'Đừng để nỗi sợ tên sao làm hỏng cả năm; thứ đáng làm là vài việc phòng bị cụ thể, xong rồi sống tiếp bình thường.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Năm hoặc đại vận có cặp này: ưu tiên giữ sức khoẻ và hoà khí — ngủ đủ, khám định kỳ, nhường một câu ở những cuộc tranh cãi không đáng. Phòng bị nhỏ, đổi lại một năm nhẹ đầu.',
      },
      {
        palace: 'Tật Ách',
        reading:
          'Nhắc kiểm tra sức khoẻ định kỳ, đề phòng va chạm nhỏ khi đi lại, chơi thể thao. Là lời nhắc tầm soát chủ động — việc vốn ai cũng nên làm, cặp sao này chỉ khiến ta chịu làm thật.',
      },
    ],
  },
  {
    slug: 'quan-phu',
    name: 'Quan Phù',
    category: 'aux',
    archetype: 'Sao thuộc vòng Thái Tuế — chủ về giấy tờ, kiện tụng, chuyện hành chính công quyền. Như mọi sao vòng Thái Tuế, Quan Phù mô tả chủ đề của giai đoạn chứ không phán bản tính: năm gặp nó, mọi thứ liên quan văn bản và pháp lý đáng được làm kỹ gấp đôi.',
    positive: [
      'Nhắc rà soát hợp đồng, giấy tờ kỹ — tránh sơ suất pháp lý.',
      'Biết trước thì xử lý thủ tục gọn gàng.',
      'Năm hợp dọn dẹp pháp lý tồn đọng: sang tên, công chứng, hoàn thiện giấy tờ nhà đất, chuẩn hoá hợp đồng.',
      'Ai làm nghề gắn với văn bản — luật, hành chính, kế toán — thì đây lại là năm nghề được trọng dụng.',
    ],
    caution: [
      'Năm gặp: cẩn trọng ký kết, đọc kỹ trước khi đặt bút, tránh vướng tranh chấp.',
      'Đừng ký hộ, đứng tên hộ, bảo lãnh miệng trong giai đoạn này — sự cả nể về giấy tờ là chỗ dễ vướng nhất.',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Chú ý hợp đồng, quy định công việc trong giai đoạn này: đọc kỹ điều khoản trước khi nhận việc, đổi vai, cam kết chỉ tiêu. Thoả thuận nào quan trọng đều nên có bản viết — nói miệng là chỗ hiểu lầm mọc lên.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Giai đoạn hợp làm gì cũng rõ ràng văn bản, minh bạch: giữ hoá đơn, lưu biên bản, chốt việc qua thư từ. Kỷ luật giấy tờ vài tháng đổi lấy sự yên tâm cả năm — một giao dịch có lời.',
      },
    ],
  },
  {
    slug: 'thien-quan-thien-phuc',
    name: 'Thiên Quan - Thiên Phúc',
    category: 'aux',
    archetype: 'Cặp phúc tinh — Thiên Quan và Thiên Phúc: che chở, phúc khí, hoá giải khó khăn. Cách hình dung dễ nhất: đây là tấm đệm mỏng lót dưới các cú ngã của đời — không ngăn được cú ngã, nhưng thường làm nó bớt đau hơn đáng lẽ.',
    positive: [
      'Gặp khó dễ có chỗ dựa, "gặp dữ hoá lành".',
      'Tăng phúc đức, hay gặp may đúng lúc ngặt.',
      'Những pha "suýt nữa thì" hoá ra êm: trễ một chuyến xe hỏng, lỡ một vụ làm ăn xấu — may kiểu khó kể nhưng có thật.',
      'Người có cặp này ở cạnh ai, người đó cũng thấy yên tâm hơn — phúc khí có tính lan.',
    ],
    caution: [
      'Phúc là nền — vẫn cần nỗ lực thật để thành kết quả.',
      'Đừng lấy phúc làm bảo hiểm để liều: tấm đệm đỡ được cú ngã, không đỡ được thói quen nhảy từ nóc nhà.',
    ],
    byPalace: [
      {
        palace: 'Phúc Đức',
        reading:
          'Phúc khí dày, tâm an, hậu vận êm — đúng sao đúng cung. Cách nuôi phúc cụ thể nhất: sống tử tế đều đặn, giúp người trong khả năng, và giữ tâm không oán khi gặp chuyện.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Người hiền lành, hay được giúp lúc khó; đi đến đâu cũng có người thương. Của cho không bằng cách sống: chính sự tử tế tích luỹ hàng ngày là nguồn của những cú "may đúng lúc" ấy.',
      },
    ],
  },
  {
    slug: 'thien-duc-nguyet-duc',
    name: 'Thiên Đức - Nguyệt Đức',
    category: 'aux',
    archetype: 'Cặp đức tinh — Thiên Đức và Nguyệt Đức: đức độ, được phù trợ, giảm nhẹ trắc trở. Vai trò kỹ thuật của cặp này trong lá số là "giảm xóc": đứng cùng cung với sao xấu thì làm dịu bớt, đứng cùng sao tốt thì thêm phần nhân hậu cho cách thể hiện.',
    positive: [
      'Giảm bớt ảnh hưởng sao xấu cùng cung; gặp khó có người đỡ.',
      'Tâm thiện, sống có đức nên tích phúc.',
      'Cùng một biến cố, người có đức tinh thường gặp phiên bản nhẹ hơn: có người can, có tin báo sớm, có đường lui.',
      'Sự hiền hoà toát ra khiến người đối diện bớt phòng thủ — lợi thế mềm trong thương lượng và hoà giải.',
    ],
    caution: [
      'Là lực "giảm xóc", không phải bùa hộ mệnh — vẫn cần cẩn trọng.',
      'Hiền quá dễ bị lấn: nhân hậu nên đi kèm ranh giới, thương người nhưng đừng để bị dắt.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Tính nhân hậu, hay làm việc thiện, được quý mến; ít gây thù chuốc oán nên đường đi thoáng. Giữ được tâm ấy qua cả những lúc bị phụ lòng — đó mới là lúc đức tinh phát huy giá trị thật.',
      },
      {
        palace: 'Tật Ách',
        reading:
          'Khi có hạn, thường gặp yếu tố giảm nhẹ: phát hiện sớm, gặp thầy gặp thuốc, có người chăm. Vẫn là lời nhắc khám định kỳ và sống điều độ — đức tinh giảm xóc, không thay được phanh.',
      },
    ],
  },
  {
    slug: 'kiep-sat',
    name: 'Kiếp Sát',
    category: 'aux',
    archetype: 'Sát tinh nhỏ — biến động bất ngờ, hao tài hoặc thay đổi nhanh. Khác Địa Không Địa Kiếp (phá cách trong tư duy), Kiếp Sát thiên về những cú đổi hướng đột ngột của hoàn cảnh: kế hoạch đang chạy bỗng phải rẽ. Bài học nó dạy là quản trị rủi ro.',
    positive: [
      'Quyết đoán, phản ứng nhanh trước biến cố.',
      'Trải biến động giúp học cách phòng bị, quản trị rủi ro.',
      'Người từng qua vài cú rẽ gắt thường có "cơ bắp ứng biến" mà người thuận buồm không có.',
      'Là lời nhắc hữu ích: mọi kế hoạch nên có phương án B — thói quen tốt cho bất kỳ ai.',
    ],
    caution: [
      'Chú ý giữ tài sản, tránh quyết định vội khi cung liên quan có Kiếp Sát.',
      'Là lực "thay đổi đột ngột", KHÔNG phải định mệnh xui xẻo.',
      'Đổi hướng gấp khác với đổi hướng ẩu: kể cả khi buộc phải rẽ, vẫn có vài giờ để nghĩ — hãy dùng chúng.',
    ],
    byPalace: [
      {
        palace: 'Tài Bạch',
        reading:
          'Cẩn trọng dòng tiền, tránh đầu cơ, giữ quỹ dự phòng — với bộ này, quỹ dự phòng không phải lời khuyên chung chung mà là trang bị bắt buộc. Tiền chia giỏ, hạn mức rủi ro định trước, không tất tay.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Cuộc đời nhiều khúc rẽ; bản lĩnh được tôi qua biến động. Người khác sợ thay đổi, bạn thì quen dần với nó — hãy biến kinh nghiệm ứng biến ấy thành nghề: xử lý khủng hoảng, vận hành, thị trường nhanh.',
      },
    ],
  },
  {
    slug: 'tuan-triet',
    name: 'Tuần - Triệt',
    category: 'aux',
    archetype: 'Hai sao "không vong" — Tuần Không và Triệt Lộ án ngữ cung nào thì việc của cung đó hay đến muộn hoặc phải đi đường vòng. Đây là lớp sao RẤT VIỆT: engine iztro gốc Hoa không xuất, hieu.asia tự tính bổ sung — Tuần an theo can-chi năm sinh, Triệt theo can năm sinh, xác định và kiểm được.',
    positive: [
      'Hoá giải bớt sao xấu ở cung bị án ngữ (cái xấu cũng "trống" theo).',
      'Hợp người "nở muộn" — thành quả đến sau nhưng bền.',
      'Đường vòng có cái giá trị riêng: người đi vòng thường hiểu địa hình hơn người đi thẳng.',
      'Truyền thống Tử Vi Việt rất coi trọng lớp này — nhiều ca "lá số đẹp mà đời lận đận giai đoạn đầu" được giải thích bằng Tuần Triệt án ngữ.',
    ],
    caution: [
      'Cung bị Tuần/Triệt thường phát muộn hoặc cần đi đường khác thường — đừng nóng vội.',
      'Là "khoảng lặng / đổi hướng", KHÔNG phải mất trắng.',
      'So bì tiến độ với bạn bè là cách nhanh nhất để khổ với bộ sao này; mốc so đúng là chính mình năm ngoái.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Kiểu người "nở muộn": giai đoạn đầu đời hay lận đận, loay hoay hơn bạn bè, nhưng thành quả đến sau thường chắc. Chiến lược đúng là tích luỹ trong im lặng — kỹ năng, quan hệ, vốn — chờ đúng nhịp của mình.',
      },
      {
        palace: 'Quan Lộc',
        reading:
          'Sự nghiệp lập muộn hoặc rẽ ngang rồi mới vững: học một ngành làm một nghề, đổi hướng giữa chừng rồi mới gặp đúng việc. Đừng đọc đó là thất bại — với Tuần Triệt, đường vòng chính là đường chính.',
      },
    ],
  },
  {
    slug: 'dai-hao-tieu-hao',
    name: 'Đại Hao - Tiểu Hao',
    category: 'aux',
    archetype: 'Cặp hao tinh — Đại Hao và Tiểu Hao: chi tiêu, hao tán, tiền ra nhiều. Tên gọi nói thẳng chức năng: đây là hai "van xả" của dòng tiền trên lá số. Van xả không xấu — nước cần chảy — vấn đề chỉ là xả có kế hoạch hay xả tự do.',
    positive: [
      'Biết trước thì lập kế hoạch chi tiêu, giữ quỹ dự phòng chủ động.',
      'Thường phóng khoáng, rộng rãi với người.',
      'Tiền ra đúng chỗ cũng là đầu tư: người có hao tinh mà chi cho học hành, quan hệ, trải nghiệm thường thu về gấp bội.',
      'Không bủn xỉn, không nặng nề chuyện tiền — sống thoáng, bạn bè quý.',
    ],
    caution: [
      'Năm/cung gặp: rà soát ngân sách, tránh đầu tư bốc đồng.',
      'Là nhắc "giữ tiền", KHÔNG phải phá sản định sẵn.',
      'Kẻ thù thật sự là các khoản rò rỉ nhỏ đều đặn: đăng ký không dùng, mua vì vui mười lăm phút — bịt được chúng là hao tinh hết đáng ngại.',
    ],
    byPalace: [
      {
        palace: 'Tài Bạch',
        reading:
          'Dòng tiền ra vào lớn — quản trị chi tiêu là chìa khoá. Cách hợp nhất với người có bộ này là tự động hoá: trích tiết kiệm ngay khi lương về, đặt hạn mức tiêu theo tuần, để phần "xả" có ngân sách riêng đàng hoàng.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Tính phóng khoáng, rộng rãi, khó nhìn người thân thiếu thốn mà làm ngơ. Đức tính đẹp — chỉ cần học kỷ luật tài chính sớm để sự hào phóng có nền: mình vững thì mới đỡ được người lâu dài.',
      },
    ],
  },
  {
    slug: 'thai-phu-phong-cao',
    name: 'Thai Phụ - Phong Cáo',
    category: 'aux',
    archetype: 'Cặp quý tinh — Thai Phụ và Phong Cáo: bằng cấp, chức danh, giấy tờ vinh danh. Nếu Ân Quang Thiên Quý là sự công nhận nói chung thì cặp này cụ thể hơn nữa: tờ quyết định bổ nhiệm, tấm văn bằng, con dấu chức danh — danh phận thành văn.',
    positive: [
      'Hỗ trợ thi cử, bổ nhiệm, được cấp "danh phận" chính thức.',
      'Tăng uy tín qua chứng chỉ, văn bằng.',
      'Hợp lộ trình sự nghiệp có nấc thang rõ: mỗi chứng chỉ, mỗi lần bổ nhiệm là một bậc chắc chắn.',
      'Danh phận chính thức mở cửa những phòng họp mà thực lực đơn thuần chưa chắc gõ được.',
    ],
    caution: [
      'Danh đi cùng thực lực mới bền — đừng chuộng hình thức.',
      'Sưu tầm bằng cấp không phải mục tiêu; mỗi tấm bằng nên trả lời được câu hỏi "nó mở cánh cửa nào".',
    ],
    byPalace: [
      {
        palace: 'Quan Lộc',
        reading:
          'Thuận bổ nhiệm, thăng chức, được giao trọng trách có danh. Chiến lược hợp: chọn tổ chức có lộ trình thăng tiến minh bạch, và chuẩn bị sẵn hồ sơ năng lực để khi ghế trống, tên bạn nằm sẵn trên bàn.',
      },
      {
        palace: 'Mệnh',
        reading:
          'Hợp môi trường trọng bằng cấp, danh vị: cơ quan, tập đoàn lớn, học thuật. Ở môi trường xuề xoà, thế mạnh này ít đất diễn; ở nơi coi trọng chính danh, nó là bệ phóng thật sự.',
      },
    ],
  },
  {
    slug: 'thien-tho-thien-tai',
    name: 'Thiên Thọ - Thiên Tài',
    category: 'aux',
    archetype: 'Cặp sao phúc — Thiên Thọ (sức bền, điềm đạm, tuổi thọ theo cách nói cổ) và Thiên Tài (năng khiếu, sự lanh lợi). Một sao cho nền, một sao cho ngọn: bền sức để đi đường dài, có khiếu để đường dài ấy không nhàm. Cặp này lặng lẽ nhưng đáng quý.',
    positive: [
      'Thiên Thọ: bền sức, điều độ, nhẫn nại; Thiên Tài: nhạy bén, học nhanh.',
      'Hợp tích luỹ lâu dài và phát huy năng khiếu riêng.',
      'Kết hợp hiếm: vừa có khiếu bắt nhanh, vừa đủ bền để mài khiếu ấy thành nghề — nhiều người chỉ có một trong hai.',
      'Nhịp sống điều độ tự nhiên, ít sa vào cực đoan — nền tốt cho cả sức khoẻ lẫn tài chính.',
    ],
    caution: [
      'Tài cần mài thành kỹ năng thật; thọ cần lối sống lành mạnh đi kèm.',
      'Khiếu mà không luyện thì mãi là trò tiêu khiển; đặt cho năng khiếu một mục tiêu cụ thể để nó có cớ lớn lên.',
    ],
    byPalace: [
      {
        palace: 'Mệnh',
        reading:
          'Người chín chắn hơn tuổi, có khiếu riêng đáng nuôi dưỡng — thứ mà hồi nhỏ hay bị coi là "nghịch vặt" rất có thể là nghề tay trái, thậm chí tay phải, sau này. Đầu tư cho nó sớm và đều.',
      },
      {
        palace: 'Phúc Đức',
        reading:
          'Phúc thọ, tâm an; hợp lối sống điều độ: ngủ đủ, ăn lành, vận động đều. Với cặp sao này, sự đều đặn không nhàm chán — nó là cách bạn nạp năng lượng và giữ được sự bền bỉ hiếm có của mình.',
      },
    ],
  },
];

export const ALL_STARS_CONTENT: StarContent[] = [...MAJOR_STARS_CONTENT, ...AUX_STARS_CONTENT];

export function findStarContent(slug: string): StarContent | undefined {
  return ALL_STARS_CONTENT.find((s) => s.slug === slug);
}
