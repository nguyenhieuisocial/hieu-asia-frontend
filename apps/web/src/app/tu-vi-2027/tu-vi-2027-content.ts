/**
 * Văn vận-trình "Tử Vi 2027 theo con giáp" — 4 mảng (sự nghiệp / tài lộc / tình
 * cảm / sức khoẻ) + tổng quan + lời khuyên + FAQ riêng, cho 12 con giáp năm Đinh
 * Mùi 2027.
 *
 * Sinh bằng workflow grounded (bám engine Can Chi `con-giap-data.ts`: quan hệ
 * Thái Tuế + ngũ hành + tuổi tam hợp) → humanize → QUA PHẢN BIỆN chống bịa dữ
 * kiện / định mệnh / hù doạ / khuyên y-tài-chính / Barnum. Đây là dữ liệu tĩnh
 * (không gọi AI lúc chạy), ráp ở tầng trang cùng phần deterministic.
 *
 * KHÔNG sửa tay từng câu lẻ — nếu cần đổi giọng, chỉnh ràng buộc rồi sinh lại.
 */

export interface Forecast2027 {
  /** 3-4 câu tổng quan năm, bám quan hệ Thái Tuế + ngũ hành. */
  tongQuan: string;
  suNghiep: string;
  taiLoc: string;
  /** Tình cảm + gia đạo. */
  tinhDuyen: string;
  sucKhoe: string;
  loiKhuyen: string;
  faq: { q: string; a: string }[];
}

export const FORECASTS_2027: Record<string, Forecast2027> = {
  ty: {
    "tongQuan": "Năm Đinh Mùi 2027, tuổi Tý ở thế Hại Thái Tuế (Tý hại Mùi), nên đây là năm hợp với việc đi trước một bước hơn là ngồi chờ mọi chuyện tự ổn. Hành Thủy của tuổi và hành Thổ của năm khắc nhau, không phải điềm dữ mà là lời nhắc rằng nhiều hiểu lầm bắt nguồn từ chuyện nói chưa rõ ý. Vốn nhanh nhạy và quan sát tốt, bạn xoay xở được trong tình huống mới; phần lớn vướng mắc sẽ dịu đi khi bạn nói thẳng điều mình nghĩ. Đây là gợi ý chung theo con giáp, còn vận thật của bạn tùy ngày giờ sinh và cách bạn hành động trong năm.",
    "suNghiep": "Công việc năm nay nghiêng về phía người chủ động hỏi và xác nhận lại cho chắc, thay vì đoán ý người khác. Bạn dễ ôm nhiều việc một lúc, nên chọn vài thứ quan trọng nhất rồi làm cho tới sẽ đỡ rối hơn là dàn mỏng. Khi cần người phối hợp hay đỡ một tay, người tuổi Thân và tuổi Thìn thường dễ ăn ý với bạn.",
    "taiLoc": "Về tiền bạc, thế Hại Thái Tuế nhắc bạn quản lý chặt và ghi rõ các thỏa thuận, nhất là khoản dính tới người khác. Tính bạn linh hoạt, nhạy với cơ hội, nhưng cũng dễ vung tay khi hứng lên, nên giữ thói quen cân nhắc kỹ trước mỗi khoản chi lớn. Đây là chuyện thái độ giữ tiền, không phải lời khuyên rót vốn vào đâu cụ thể.",
    "tinhDuyen": "Trong tình cảm, phần lớn lấn cấn năm nay đến từ chuyện nói nửa chừng rồi để đối phương tự suy ra. Bạn nhạy và để ý nhiều, đôi khi nghĩ thay người kia, nên nói rõ điều mình mong sẽ tránh được những giận hờn không đáng. Với gia đạo, chịu khó ngồi lại trò chuyện thay vì im lặng cho qua sẽ giữ được không khí ấm áp trong nhà.",
    "sucKhoe": "Ôm đồm nhiều thứ cùng lúc dễ khiến bạn xao nhãng chuyện nghỉ ngơi của chính mình. Năm nay nên giữ nhịp sinh hoạt đều, ngủ đủ và đừng để bản thân căng liên tục không có khoảng dừng. Một lịch sống cân bằng giữa làm và nghỉ sẽ giúp đầu óc bạn giữ được sự nhanh nhạy vốn có.",
    "loiKhuyen": "Hãy chủ động lên tiếng sớm, đừng để hiểu lầm tích lại rồi mới gỡ. Chọn vài việc đáng làm nhất để dồn sức, và mạnh dạn nhờ người hợp tuổi một tay khi cần.",
    "faq": [
      {
        "q": "Tuổi Tý hại Thái Tuế năm 2027 có phải là năm xui xẻo không?",
        "a": "Không nên hiểu là năm xui. Tý hại Mùi chỉ là quan hệ cần để ý, mang nghĩa nhắc bạn chủ động và giữ giao tiếp rõ ràng để tránh hiểu lầm, chứ không phải điềm tai ương. Phần lớn vướng mắc trong năm tùy cách bạn xử lý hơn là đã định sẵn."
      },
      {
        "q": "Tuổi Tý năm 2027 nên hợp tác với tuổi nào?",
        "a": "Theo tam hợp của tuổi Tý, người tuổi Thân và tuổi Thìn thường dễ ăn ý và có thể là chỗ dựa khi bạn cần phối hợp công việc. Đây là gợi ý tham khảo theo con giáp; mức độ hợp thật còn tùy lá số ngày giờ sinh và thiện chí của hai bên."
      }
    ]
  },
  suu: {
    "tongQuan": "Năm Đinh Mùi 2027, tuổi Sửu rơi vào thế xung Thái Tuế, vì Sửu và Mùi vốn tương xung. Đây không phải năm xui mà là năm nhắc bạn chủ động: chuyện cũ tưởng yên có thể bị khuấy động, người vốn ngại thay đổi như tuổi Sửu sẽ thấy nhịp năm đẩy mình ra khỏi vùng quen. Điểm thuận là bạn và năm cùng hành Thổ nên về căn bản vẫn đồng điệu, với điều kiện bạn bù được phần mình còn thiếu thay vì cứ giữ một lối cũ. Đây là góc nhìn chung theo con giáp, còn lá số riêng vẫn phải xem theo ngày giờ sinh và nỗ lực của chính bạn.",
    "suNghiep": "Năm xung Thái Tuế thường mang đến biến động về môi trường làm việc, vị trí hay người cùng làm, nên tính kiên định bền bỉ của tuổi Sửu là vốn quý để giữ vững phong độ. Chỗ cần để ý là sự cứng nhắc: khi guồng việc thay đổi, người biết lắng nghe và điều chỉnh sẽ đi nhanh hơn người khăng khăng làm theo cách cũ. Tuổi Tỵ và Dậu hợp với bạn, gặp lúc khó nên mở lời nhờ họ góp ý hoặc bắt tay làm chung.",
    "taiLoc": "Năm cần chủ động thì cách quản lý tiền cũng nên chủ động theo: rà lại các khoản cố định, ghi rõ tiền vào tiền ra thay vì để theo quán tính. Tuổi Sửu vốn chắc tay với tiền bạc, đây là lợi thế, chỉ cần đừng vì ngại thay đổi mà bỏ qua việc xem lại những cam kết tài chính dài hạn đã ký từ trước. Giữ một khoản phòng thân để năm có xáo trộn thì mình vẫn ung dung.",
    "tinhDuyen": "Thế xung dễ làm lộ ra những điều trong nhà hoặc trong tình cảm mà trước nay hai bên cùng tránh nói. Với người bền bỉ, trọng cam kết như tuổi Sửu, đây lại là dịp tốt để nói thẳng và làm rõ, miễn bạn mềm đi một chút thay vì khăng khăng giữ ý mình. Người đang độc thân nên cởi mở hơn trong giao tiếp; người có đôi thì dành thời gian cho gia đạo, đừng để công việc cuốn mất phần chăm nhau.",
    "sucKhoe": "Năm nhiều xáo trộn dễ kéo theo căng thẳng, nhất là khi bạn có thói quen ôm việc và khó buông tay. Giữ nếp sinh hoạt đều, ngủ đủ, và cho mình quãng nghỉ thật sự thay vì lúc nào cũng gồng. Tính kiên trì của tuổi Sửu rất hợp để duy trì một thói quen vận động nhẹ nhàng đều đặn qua cả năm.",
    "loiKhuyen": "Coi năm xung Thái Tuế như lời nhắc hãy bước trước thay vì chờ mọi việc tự yên. Giữ cái bền bỉ vốn có nhưng mở lòng hơn và nhờ tới quý nhân tuổi Tỵ, Dậu khi cần, năm sóng gió vẫn có thể thành năm mình vững thêm.",
    "faq": [
      {
        "q": "Tuổi Sửu xung Thái Tuế năm 2027 có phải là năm xui xẻo không?",
        "a": "Không nên hiểu là xui. Sửu và Mùi tương xung nên 2027 là năm dễ có thay đổi, nhắc bạn chủ động và cẩn trọng hơn, chứ không phải năm đã định sẵn tai ương. Phần lớn vẫn nằm ở cách bạn ứng xử và chuẩn bị. Đây là gợi ý chung theo con giáp; muốn chính xác phải xem lá số theo ngày giờ sinh của riêng bạn."
      },
      {
        "q": "Tuổi nào hợp để tuổi Sửu nhờ cậy trong năm 2027?",
        "a": "Theo tam hợp, tuổi Sửu hợp với tuổi Tỵ và tuổi Dậu, nên đây là những người dễ thành quý nhân, hợp để cùng làm hoặc xin lời khuyên khi gặp việc khó. Đây là trợ lực thuận để bạn chủ động, không phải lời hứa chắc chắn thành công. Kết quả vẫn tùy nỗ lực và lựa chọn của chính bạn."
      }
    ]
  },
  dan: {
    "tongQuan": "Đinh Mùi là năm bình ổn với tuổi Dần. Tuổi của bạn không xung không hợp với Thái Tuế năm nay, nên không có sóng to gió lớn để lo, mà cũng không có cú đẩy trời cho để ỷ lại. Có một điểm đáng chú ý: bản tính Dần thuộc Mộc, ưa mở đường và đi nhanh, còn năm Mùi thuộc Thổ lại chuộng sự chắc chắn, ổn định. Mộc với Thổ ở thế khắc nhẹ, nên năm nay phần nhiều là bài học dung hoà: giữ được cái máu dám làm của mình, nhưng chịu khó đi chậm lại một chút để việc đứng vững.",
    "suNghiep": "Đây là năm hợp để củng cố hơn là bung ra ồ ạt. Tính Dần thích nhảy vào việc mới, mở mặt trận mới, nhưng tông Thổ của năm lại thưởng cho người làm xong việc đang dang dở và làm cho chắc. Nếu cần người cùng làm hay người đỡ lời, tuổi Ngọ và tuổi Tuất là hai tuổi dễ ăn ý với bạn năm nay, có thể chủ động kéo họ vào những việc quan trọng.",
    "taiLoc": "Tiền bạc năm nay nghiêng về giữ và sắp xếp cho gọn hơn là dồn hết vào một canh bạc lớn. Cái khắc nhẹ Mộc với Thổ là lời nhắc đừng để tính sốt ruột muốn thấy kết quả nhanh đẩy bạn vào quyết định vội. Một thói quen ghi rõ tiền vào tiền ra, biết khoản nào đáng và khoản nào theo cảm hứng, sẽ giúp bạn nhẹ đầu suốt năm.",
    "tinhDuyen": "Năng lượng của bạn lớn và cuốn người khác theo, đó là điểm mạnh trong chuyện tình cảm, nhưng cũng dễ khiến đối phương thấy đuối nếu bạn lúc nào cũng đi trước nửa bước. Năm Thổ chuộng sự bền, hợp để vun cái đang có hơn là đổi mới liên tục. Với gia đạo, chịu khó ngồi nghe người nhà nói hết trước khi đưa ý mình ra sẽ giữ được hoà khí.",
    "sucKhoe": "Người tuổi Dần thường có sức và hay làm tới khi cạn pin mới chịu dừng. Năm nay nhịp chung là vừa phải, nên cái cần canh không phải biến cố lớn mà là thói quen đốt sức của chính mình. Ngủ đủ, có quãng nghỉ thật giữa các đợt căng việc, đừng để cơ thể phải lên tiếng rồi mới chịu chậm lại.",
    "loiKhuyen": "Giữ cái máu dám mở đường của tuổi Dần, nhưng năm nay chọn một việc thật sự đáng và theo nó tới cùng, thay vì rải sức ra nhiều hướng. Khi cần đồng minh, đừng ngại rủ tuổi Ngọ và tuổi Tuất cùng làm.",
    "faq": [
      {
        "q": "Tuổi Dần năm 2027 Đinh Mùi có phải năm xung không?",
        "a": "Không. Tuổi Dần bình hoà với Thái Tuế năm Mùi, không xung cũng không hợp trực tiếp, nên tông năm là bình ổn. Chỉ có ngũ hành Mộc của tuổi và Thổ của năm khắc nhẹ, hiểu như một lời nhắc nên dung hoà chứ không phải điềm xấu để lo."
      },
      {
        "q": "Tuổi Dần năm 2027 hợp làm ăn với tuổi nào?",
        "a": "Theo con giáp hợp của tuổi Dần, hai tuổi dễ ăn ý và đỡ việc cho bạn năm nay là Ngọ và Tuất. Đây là gợi ý chung theo con giáp để bạn chủ động tìm người cùng làm, còn duyên hợp tác thật sự vẫn tuỳ lá số chi tiết theo ngày giờ sinh và cách hai bên làm việc với nhau."
      }
    ]
  },
  mao: {
    "tongQuan": "Năm Đinh Mùi 2027, tuổi Mão nằm trong nhóm Tam Hợp với năm (Hợi - Mão - Mùi), nên đây là một năm có nhiều trợ lực và tông chung khá thuận. Mộc của Mão với Thổ của năm có chút tương khắc nhẹ, nhưng nhờ thế tam hợp nên phần va chạm đó không đáng ngại, thậm chí còn là cái cớ để bạn rèn tính quyết đoán. Người tuổi Mão vốn tinh tế, ôn hoà, giỏi giữ hoà khí, năm nay là dịp để những điểm mạnh đó phát huy khi xung quanh có người đỡ đần. Đây là gợi ý tham khảo theo con giáp; lá số chi tiết còn phụ thuộc ngày giờ sinh và nỗ lực của riêng bạn.",
    "suNghiep": "Với thế tam hợp, công việc năm nay dễ gặp người cùng chí hướng và những cơ hội đến từ quan hệ sẵn có. Điểm cần để ý là thói quen trì hoãn quyết định khó của tuổi Mão: khi việc thuận, sự ngần ngại va chạm có thể khiến bạn bỏ lỡ thời điểm. Cứ chủ động lên tiếng, nhận phần việc mình muốn, vì năm nay có chỗ dựa để xoay sở.",
    "taiLoc": "Dòng tiền năm nay có phần dễ thở hơn nhờ trợ lực từ các mối quan hệ, nhưng đó là lý do để quản lý cho gọn chứ không phải để buông lỏng. Tính ôn hoà đôi khi khiến bạn nể nang, khó từ chối chuyện vay mượn hay góp chung; rạch ròi ngay từ đầu sẽ đỡ phải xử lý lúng túng về sau. Giữ thói quen ghi chép thu chi và để ra một khoản dự phòng là cách an tâm nhất.",
    "tinhDuyen": "Tam hợp Hợi - Mão - Mùi mang lại không khí ấm trong chuyện tình cảm và gia đạo, người tuổi Mão dễ được lòng người và giữ được sự hoà thuận quanh mình. Điều đáng lưu ý là đừng vì ngại va chạm mà né tránh những điều cần nói thẳng với người thân hay người thương, bởi im lặng lâu dễ thành khoảng cách. Người tuổi Hợi và Mùi là những người hợp vía, nên chủ động vun đắp những mối quan hệ đó.",
    "sucKhoe": "Năm thuận thường kéo theo nhiều lời mời, nhiều việc, nên nhịp sống dễ bị cuốn nhanh hơn bạn tưởng. Tuổi Mão hay ôm việc trong lòng vì ngại làm phiền người khác, lâu dần dễ mệt mà không nói ra. Giữ giờ giấc ngủ nghỉ đều đặn và cho phép mình chậm lại khi cần là điều nên ưu tiên.",
    "loiKhuyen": "Năm nay có sẵn trợ lực, việc của bạn là chủ động nắm lấy thay vì chờ đợi: nói rõ điều mình muốn, quyết những việc còn để treo, và tựa vào người tuổi Hợi, Mùi khi cần. Thuận lợi chỉ thành kết quả khi bạn bước tới đón nó.",
    "faq": [
      {
        "q": "Tuổi Mão năm 2027 Đinh Mùi có phải năm tốt không?",
        "a": "Theo quan hệ con giáp, Mão nằm trong nhóm Tam Hợp với năm Mùi (Hợi - Mão - Mùi) nên tông chung là một năm thuận, nhiều trợ lực. Mộc của tuổi với Thổ của năm có chút khắc nhẹ nhưng không đáng ngại nhờ thế tam hợp. Cần nhớ đây là nét chung theo con giáp; mức độ thuận lợi thật còn tuỳ ngày giờ sinh và nỗ lực mỗi người."
      },
      {
        "q": "Tuổi Mão năm 2027 hợp với tuổi nào để hợp tác?",
        "a": "Trong nhóm Tam Hợp của tuổi Mão có Hợi và Mùi, nên đây là những tuổi dễ đồng điệu, hợp để cộng tác hay làm chỗ dựa quý nhân. Đây chỉ là gợi ý tham khảo theo con giáp, không phải khuôn cố định; sự ăn ý thực tế vẫn đến từ cách hai người hiểu và phối hợp với nhau."
      }
    ]
  },
  thin: {
    "tongQuan": "Tuổi Thìn bước vào năm Đinh Mùi với một nhịp khá dễ chịu. Bạn hành Thổ, năm Mùi cũng hành Thổ, nên không có chuyện va chạm với Thái Tuế, mọi thứ phần lớn xuôi theo guồng của nó. Đây là kiểu năm bình ổn để bạn củng cố những gì đang có thay vì gồng lên lật ngược thế cờ. Một điểm cần nhớ: người Thìn vốn tự tin, có tầm nhìn và quen đứng mũi chịu sào, nhưng năm nay nghe nhiều hơn nói sẽ giúp bạn đi xa hơn. Đây là gợi ý chung theo con giáp; lá số thật còn phụ thuộc ngày giờ sinh và quan trọng nhất vẫn là cách bạn xoay xở.",
    "suNghiep": "Năm bình ổn hợp với việc làm sâu hơn là làm rộng: giữ vững vai trò đang có, hoàn thiện thứ còn dang dở. Bạn quen dẫn dắt nên dễ ôm hết về mình, nhưng để người khác góp ý và chia việc ra sẽ nhẹ đầu hơn nhiều. Người tuổi Thân và Tý hợp vía với bạn, nên một lời rủ hợp tác hay một góp ý từ họ đáng để cân nhắc nghiêm túc.",
    "taiLoc": "Tài chính năm nay không có sóng lớn, đúng kiểu vào đều ra đều của một năm yên. Đây là lúc để quản lý cho gọn ghẽ: biết tiền đi đâu, để dành được phần nào hay phần đó. Tính bạn quyết đoán, nhưng với khoản tiền lớn thì hỏi thêm người tin cậy rồi mới chốt vẫn hơn là tự tin làm một mình.",
    "tinhDuyen": "Cùng hành Thổ với năm nên chuyện tình cảm và gia đạo nhìn chung êm. Người Thìn cá tính mạnh, đôi khi vô tình lấn át nửa kia mà không để ý, nên năm nay chịu khó lắng nghe sẽ giúp quan hệ ấm hơn. Trong nhà, bớt giành phần đúng về mình một chút là không khí dễ chịu hẳn.",
    "sucKhoe": "Năm bình ổn thường kéo theo nhịp sống đều, nhưng người quen ôm việc như bạn dễ quên mất giới hạn của mình. Ngủ đủ, ăn đúng bữa và cho phép bản thân nghỉ khi thấy đuối là đủ để giữ sức cho cả năm. Đừng đợi đến lúc kiệt rồi mới chịu dừng.",
    "loiKhuyen": "Tận dụng cái nền yên của năm để củng cố thay vì cố tạo biến động lớn. Mở lòng nghe người khác, nhất là tuổi Thân và Tý, rồi tự mình quyết định cuối cùng.",
    "faq": [
      {
        "q": "Tuổi Thìn năm 2027 có phạm Thái Tuế không?",
        "a": "Không. Năm 2027 là Đinh Mùi, chi năm là Mùi. Tuổi Thìn không xung, không hại, không cùng tuổi với Mùi mà ở thế bình hoà, lại cùng hành Thổ với năm, nên đây là một năm tương đối thuận, không phải lo chuyện phạm Thái Tuế."
      },
      {
        "q": "Tuổi Thìn nên hợp tác với tuổi nào trong năm 2027?",
        "a": "Theo tam hợp, tuổi Thìn hợp vía với tuổi Thân và tuổi Tý, nên một lời mời hợp tác hay góp ý từ họ thường đáng cân nhắc. Dù vậy đây chỉ là gợi ý theo con giáp; hợp người hay không còn tuỳ tính cách thật và lá số chi tiết theo ngày giờ sinh của mỗi bên."
      }
    ]
  },
  ti: {
    "tongQuan": "Tuổi Tỵ bước vào năm Mùi (Đinh Mùi) ở thế bình hòa với Thái Tuế, nên 2027 nghiêng về một năm bình ổn hơn là sóng gió, không xung không hại. Hành Hỏa của bạn sinh cho hành Thổ của chi Mùi, nghĩa là năng lượng bạn bỏ ra cho việc mình theo đuổi dễ chuyển thành kết quả thấy được, miễn là bạn chịu khởi động trước thay vì chờ thời. Điểm cần để ý cả năm là cách bạn giao tiếp: khi có ý hay linh cảm về việc gì, hãy nói ra, vì giữ kín dễ khiến người khác hiểu sai ý bạn. Đây là gợi ý chung theo con giáp; lá số riêng theo ngày giờ sinh và cách bạn hành động mới quyết định phần lớn.",
    "suNghiep": "Năm bình ổn hợp để bạn đi đường dài và bồi đắp một hướng rõ ràng, thay vì đặt cược vào một cú nhảy gấp. Quan hệ Hỏa sinh Thổ ủng hộ kiểu làm bền: công sức dồn đều vào một mục tiêu thường dễ tích lại thành thành quả hơn là dàn mỏng nhiều việc. Trong công việc, nếu bạn có thói quen nghĩ kỹ rồi mới nói, hãy chủ động trình bày kế hoạch sớm hơn một nhịp để đồng nghiệp nắm được hướng và đỡ hiểu lầm. Người tuổi Dậu và Sửu là chỗ hợp tác đáng tìm khi bạn cần một cánh tay tin được.",
    "taiLoc": "Tông năm bình ổn nên chuyện tiền bạc khó có biến động lớn, phần nhiều phụ thuộc vào cách bạn sắp xếp. Lập một kế hoạch chi tiêu rõ ràng và giữ một khoản phòng thân sẽ hợp với mạch năm nay hơn là chạy theo cơ hội đến vội. Khi cân nhắc những việc lớn liên quan đến tiền, cứ cho mình thời gian đủ để nhìn kỹ thay vì quyết gấp theo lời rủ.",
    "tinhDuyen": "Nếu bạn thuộc kiểu nghĩ nhiều hơn nói, người bên cạnh đôi khi phải đoán già đoán non về điều bạn muốn. Năm nay đủ êm để vun đắp, với điều kiện bạn chịu mở lời về điều mình thật sự cần thay vì giữ trong lòng rồi tự buồn. Với gia đạo, một câu hỏi han đúng lúc, dù ngắn, thường có sức nặng hơn bạn nghĩ, nên đừng tiếc.",
    "sucKhoe": "Năm không báo hiệu biến động lớn về thể trạng, nhưng nếu bạn hay gom lo lắng vào trong rồi mệt mà không nói, đó là điểm nên để ý. Giữ nhịp ngủ nghỉ đều và cho mình khoảng trống để xả bớt suy nghĩ sẽ giúp đầu óc nhẹ hơn. Khi thấy người uể oải kéo dài, đừng cố chịu một mình, hãy chia sẻ với người thân hoặc đi khám cho yên tâm.",
    "loiKhuyen": "Năm 2027 thuận để bạn chủ động khởi sự một việc mình ấp ủ và mở lời nhiều hơn thường lệ. Linh cảm là điểm mạnh, nhưng phải nói ra và bắt tay làm thì nó mới thành kết quả.",
    "faq": [
      {
        "q": "Tuổi Tỵ năm 2027 có phạm Thái Tuế hay xung khắc gì không?",
        "a": "Không. Tuổi Tỵ ở thế bình hòa với Thái Tuế năm Mùi (Đinh Mùi), không xung không hại, nên 2027 nghiêng về một năm bình ổn. Đây là tông năm chung theo con giáp; muốn biết cụ thể cho riêng mình thì cần xem lá số theo ngày giờ sinh."
      },
      {
        "q": "Năm nay tuổi Tỵ hợp với tuổi nào để làm ăn hay nhờ vả?",
        "a": "Theo tam hợp, tuổi Tỵ hợp với tuổi Dậu và tuổi Sửu, đây là những người dễ thành quý nhân hay cộng sự tin được khi bạn cần. Hợp tuổi chỉ là một trợ lực tham khảo, còn việc thành hay bại vẫn do cách hai bên làm việc với nhau quyết định."
      }
    ]
  },
  ngo: {
    "tongQuan": "Tuổi Ngọ bước vào năm Mùi 2027 với một nhịp hợp dễ chịu: Ngọ và Mùi là Lục Hợp, bạn đứng cùng phe với năm chứ không phải đối đầu. Hành Hỏa của bạn lại sinh cho Thổ của năm Mùi, nên đây là kiểu năm bạn cho đi nhiều thì cũng nhận lại nhiều, hợp để vun quan hệ và mở cơ hội. Vốn nhiệt tình, phóng khoáng và đi nhanh, năm nay bạn dễ tìm được người cùng tần số để cùng làm việc. Đây là góc nhìn chung theo con giáp; lá số riêng còn tùy ngày giờ sinh và phần lớn vẫn nằm ở lựa chọn của chính bạn.",
    "suNghiep": "Năm hợp với năm thường là lúc người ta dễ gật đầu giúp bạn, nên đây là dịp tốt để chủ động đề xuất, kết nối, rủ người cùng làm thay vì ôm hết một mình. Tính bạn đi nhanh và thích tự do, điểm này hợp để khởi xướng cái mới, nhưng nhớ chốt rõ phần việc với người khác để cơ hội không trôi mất giữa chừng. Tuổi Dần và tuổi Tuất là những người hợp tuổi với bạn, dễ thành quý nhân và hợp tác ăn ý, đáng để bạn giữ liên lạc và đặt niềm tin.",
    "taiLoc": "Nhịp hợp của năm dễ mang lại các mối quan hệ và cơ hội mới, mà cơ hội thì thường đi kèm chi tiêu, nên giữ một cuốn sổ chi tiêu rõ ràng sẽ giúp bạn nhiều. Tính phóng khoáng là cái đáng quý của tuổi Ngọ, chỉ cần đừng để nó biến thành chi theo cảm hứng lúc vui. Trước khi rút ví cho một khoản lớn, cho mình một quãng nghỉ để cân nhắc thay vì quyết ngay.",
    "tinhDuyen": "Lục Hợp với năm khiến chuyện tình cảm và gia đạo có không khí ấm, dễ gần, hợp để nối lại những mối quan hệ từng nguội đi. Người độc thân có nhiều dịp gặp gỡ tự nhiên qua bạn bè, công việc; người đang có đôi thì năm nay hợp để cùng vun đắp những việc chung. Bạn vốn nhiệt tình nhưng đi nhanh, nên nhớ chừa thời gian ngồi lại với người thân, lắng nghe nhiều hơn một chút.",
    "sucKhoe": "Tuổi Ngọ sống nhanh, nhiệt, hay nhận nhiều việc cùng lúc, nên năm bận rộn này dễ khiến bạn quên mất việc nghỉ. Giữ một nhịp ngủ, ăn, vận động đều đặn sẽ giúp bạn theo kịp nhịp của chính mình mà không đuối. Khi thấy mệt thì cho phép mình dừng lại, nghỉ chủ động vẫn hơn để cơ thể tự đòi nghỉ.",
    "loiKhuyen": "Năm nay nhiều trợ lực, nên hãy chủ động mở lời, kết nối và rủ người cùng làm thay vì chờ. Đi nhanh là thế mạnh của bạn, chỉ cần chừa cho mình vài khoảng lặng để giữ sức và nhìn lại đường mình đang đi.",
    "faq": [
      {
        "q": "Tuổi Ngọ năm 2027 có phải năm tốt không?",
        "a": "Theo con giáp thì năm Mùi 2027 có nhịp thuận với tuổi Ngọ, vì Ngọ và Mùi là Lục Hợp, lại thêm hành Hỏa của bạn sinh cho Thổ của năm. Nói thuận nghĩa là nhiều trợ lực để bạn chủ động, chứ không phải mọi thứ tự đến. Tốt tới đâu vẫn tùy lá số riêng theo ngày giờ sinh và nỗ lực của chính bạn."
      },
      {
        "q": "Năm 2027 tuổi Ngọ nên hợp tác với tuổi nào?",
        "a": "Tuổi Ngọ hợp với tuổi Dần và tuổi Tuất, nên hai con giáp này thường dễ trở thành quý nhân, làm việc cùng ăn ý. Đây là gợi ý chung để bạn ưu tiên giữ quan hệ, không phải quy tắc cứng; hợp nhau hay không cuối cùng vẫn nằm ở cách hai người làm việc với nhau."
      }
    ]
  },
  mui: {
    "tongQuan": "2027 Đinh Mùi là năm tuổi của bạn, người tuổi Mùi gặp đúng năm bản mệnh. Năm tuổi không phải năm xui như nhiều người vẫn sợ, mà là năm nhắc bạn chủ động đứng ra lo liệu nhiều hơn, vì phần việc thường dồn về phía mình. Năm Đinh Mùi cùng hành Thổ với tuổi, hợp để củng cố nền tảng và giữ ổn định những gì đang có, thay vì đổi hướng gấp gáp. Bản tính hiền hoà, biết lo cho người khác của bạn là điểm mạnh trong năm này, miễn là bạn nhớ giữ ranh giới cho chính mình.",
    "suNghiep": "Đây là năm hợp để làm chắc những việc đang có và kiện toàn cái còn dở, hơn là nhảy sang một hướng hoàn toàn mới. Tuổi Mùi hay được tin tưởng giao việc vì tính chu đáo, nhưng năm bản mệnh dễ khiến bạn ôm thêm phần của người khác rồi tự đuối. Người tuổi Hợi và tuổi Mão hợp vía với bạn, nên ưu tiên bàn bạc, hợp tác với họ khi cần một chỗ dựa đáng tin.",
    "taiLoc": "Tinh thần năm nay nên là giữ và vun cho cái đang có, chưa phải lúc mạo hiểm. Tính cả nể của tuổi Mùi dễ thành chỗ hở về tiền: cho mượn vì ngại từ chối, gánh hộ chi phí cho người thân quen. Một cuốn sổ thu chi rõ ràng và thói quen tách bạch chuyện tiền với chuyện tình cảm sẽ giúp bạn đỡ vướng hơn nhiều.",
    "tinhDuyen": "Sự ấm áp và biết quan tâm là thứ kéo người ta lại gần bạn, năm bản mệnh càng làm nét này nổi rõ. Cái cần để ý là thói quen nhường nhịn quá mức rồi ôm ấm ức trong lòng, nên tập nói thẳng mong muốn của mình sớm thay vì chịu đựng. Trong gia đạo, bạn thường là người giữ hoà khí, nhưng năm nay hãy để người khác cũng có phần lo lắng, đừng một mình gánh hết.",
    "sucKhoe": "Năm tuổi dễ kéo theo nhịp sống bận và nhiều việc dồn lên một người, nên cái cần giữ là giấc ngủ và quãng nghỉ đều đặn. Tuổi Mùi hay lo cho người khác trước rồi quên mình, kết quả là mệt mà không nhận ra. Cứ coi việc nghỉ ngơi của bạn cũng quan trọng như việc bạn đang gánh cho mọi người.",
    "loiKhuyen": "Năm bản mệnh, hãy chủ động sắp xếp việc của mình trước khi nhận thêm việc của người khác, và tập nói \"không\" với những gì vượt sức. Củng cố cái đang có cho vững, dựa vào người tuổi Hợi, tuổi Mão khi cần, rồi từ đó tính bước xa hơn.",
    "faq": [
      {
        "q": "Năm 2027 là năm tuổi của Mùi, có phải năm xui không?",
        "a": "Không nên hiểu là năm xui. 2027 Đinh Mùi là năm bản mệnh của tuổi Mùi, cùng hành Thổ, nên tông chung là năm để chủ động củng cố nền tảng và giữ ổn định, chứ không phải năm tai ương. Cái nó nhắc là bạn cần đứng ra lo liệu nhiều hơn và bổ sung cho mình ở chỗ còn thiếu. Mọi việc vẫn nằm ở lựa chọn và nỗ lực của bạn."
      },
      {
        "q": "Tuổi nào hợp với Mùi để hợp tác trong năm 2027?",
        "a": "Theo tam hợp, người tuổi Hợi và tuổi Mão hợp vía với Mùi, nên là chỗ dựa và quý nhân đáng tin khi bạn cần bàn bạc hay hợp tác. Đây là gợi ý tham khảo theo con giáp; hợp người tới đâu còn tùy lá số chi tiết theo ngày giờ sinh và cả cách hai người ứng xử với nhau."
      }
    ]
  },
  than: {
    "tongQuan": "Năm Đinh Mùi 2027, tuổi Thân ở thế bình hoà với Thái Tuế nên tông năm khá êm, không sóng to gió lớn. Điểm đáng mừng là hành Thổ của năm sinh cho hành Kim của tuổi Thân, giống như có người chống lưng phía sau, nhưng phần nâng đỡ đó chỉ thành hình khi bạn chịu bắt tay vào việc. Người tuổi Thân vốn nhanh nhạy, lắm sáng kiến, nên năm này hợp để chọn một hai hướng rõ ràng mà đi tới thay vì ôm quá nhiều thứ cùng lúc. Dù vậy đây vẫn là góc nhìn chung theo con giáp, lá số riêng còn tuỳ ngày giờ sinh và chính nỗ lực của bạn.",
    "suNghiep": "Tính nhanh trí và khéo xoay xở của bạn dễ phát huy trong năm êm này, nhất là khi gặp việc cần tìm cách làm mới hoặc gỡ thế bí. Cái cần để mắt là thói hiếu động hay kéo bạn nhảy việc giữa chừng, nên chọn được trọng tâm rồi theo cho trọn sẽ ăn điểm hơn là làm dở dang nhiều mối. Người tuổi Tý và tuổi Thìn là chỗ nên giữ liên lạc, hợp để rủ nhau làm chung hay xin một lời góp ý đúng lúc.",
    "taiLoc": "Năm bình ổn thường đi kèm dòng tiền không quá thất thường, hợp để bạn nhìn lại cách thu chi cho gọn ghẽ hơn là trông vào một cú đột biến. Tuổi Thân hay nảy ý mới và đôi khi vung tay theo hứng, nên đặt cho mình một mức chi rõ ràng sẽ giúp giữ được phần dư. Coi đây là dịp xây nền nếp quản lý tiền chứ không phải lúc đặt cược lớn vào điều mình chưa nắm chắc.",
    "tinhDuyen": "Không khí năm dịu nên chuyện tình cảm cũng dễ thở, ít va chạm gay gắt nếu hai bên chịu nói rõ với nhau. Người tuổi Thân lanh lợi và vui tính, đó là điểm cộng khi bắt chuyện, nhưng cái tật mau chán hay nhảy hết chỗ này sang chỗ khác lại dễ khiến người bên cạnh hụt hẫng, nên dành thời gian đều đặn cho người mình thương. Với gia đạo, một bữa cơm chung hay cuộc gọi hỏi han cha mẹ đáng giá hơn nhiều lời hứa để dành.",
    "sucKhoe": "Năm không nhiều biến động lớn nên cơ thể bạn cũng dễ vào nếp, miễn là đừng để tính hiếu động cuốn vào lịch sinh hoạt thất thường. Người tuổi Thân hay làm nhiều việc một lúc rồi thức khuya gắng sức, lâu dần dễ mệt mà không biết, nên ngủ đủ và nghỉ đúng lúc là điều nên giữ. Vận động nhẹ đều đặn hợp với cái tạng thích cử động của bạn hơn là gắng dồn sức từng đợt rồi lại bỏ.",
    "loiKhuyen": "Năm 2027 mở ra thế thuận để bạn chủ động, vậy nên chọn lấy một việc đáng làm rồi theo cho đến nơi thay vì rải sức khắp nơi. Giữ liên hệ với người tuổi Tý, tuổi Thìn và đừng ngại nhờ họ một tay khi cần.",
    "faq": [
      {
        "q": "Tuổi Thân năm 2027 có phải năm xấu không?",
        "a": "Không. Theo dữ kiện năm Đinh Mùi, tuổi Thân ở thế bình hoà với Thái Tuế nên tông năm là bình ổn, không phải năm hạn. Hành Thổ của năm còn sinh cho hành Kim của tuổi Thân, tức năm có phần nâng đỡ nếu bạn chủ động bắt tay vào việc. Đây là góc nhìn chung theo con giáp, mức độ thuận lợi còn tuỳ lá số ngày giờ sinh."
      },
      {
        "q": "Tuổi Thân nên hợp tác hay nhờ cậy ai trong năm này?",
        "a": "Theo tam hợp của tuổi Thân, người tuổi Tý và tuổi Thìn là chỗ dễ đồng điệu, hợp để làm chung việc hoặc xin lời góp ý khi cần quyết định. Đây là gợi ý tham khảo về sự hợp nhau trong cách làm việc, không phải lời chắc chắn về kết quả. Hợp tác thật sự vẫn dựa vào con người cụ thể và cách hai bên làm việc với nhau."
      }
    ]
  },
  dau: {
    "tongQuan": "Năm Đinh Mùi 2027 với người tuổi Dậu là một năm bình ổn, không sóng gió lớn. Mùi thuộc Thổ, Dậu thuộc Kim, mà Thổ thì nuôi Kim, nên nền năm có phần nâng đỡ cái bạn vốn giỏi: sự tỉ mỉ, kỷ luật, làm gì cũng tới nơi tới chốn. Đây không phải năm để chờ một cú nhảy vọt, mà là năm để gặt từ những thứ mình đã chăm chút lâu nay. Dù vậy, đây chỉ là nét chung theo con giáp; lá số thật còn tùy ngày giờ sinh và quan trọng nhất vẫn là cách bạn chủ động sống năm này.",
    "suNghiep": "Tính cẩn thận và để ý chi tiết của bạn được nền năm này ủng hộ, nên những việc đòi hỏi chuẩn xác, theo quy trình, làm đến cùng sẽ là chỗ bạn tỏa sáng. Hợp tác với người tuổi Tỵ, Sửu thường thuận và dễ tìm tiếng nói chung, đáng để mở lòng khi có cơ hội cùng làm. Điểm cần để ý là tiêu chuẩn cao đôi lúc thành khắt khe với đồng nghiệp; nới ra một chút sẽ giúp việc trôi chảy hơn là gồng cho mọi thứ thật hoàn hảo.",
    "taiLoc": "Tiền bạc năm nay nghiêng về ổn định hơn là đột biến, hợp với người vốn thích kiểm soát và lên kế hoạch như bạn. Thói quen ghi chép, cân đối thu chi rõ ràng sẽ phát huy đúng lúc và giúp bạn thấy yên tâm. Chỉ cần để ý đừng vì muốn mọi khoản thật chắc chắn mà bỏ lỡ những việc cần quyết nhanh; chắc chắn là tốt, nhưng quá cầu toàn đôi khi làm chậm.",
    "tinhDuyen": "Trong chuyện tình cảm, sự chỉn chu và để tâm đến chi tiết của bạn là điểm cộng khiến người bên cạnh thấy được trân trọng. Năm bình ổn này hợp để vun đắp những điều nhỏ đều đặn hơn là chờ một khoảnh khắc lớn lao. Với gia đạo, tiêu chuẩn cao mà bạn đặt cho mình đôi khi vô tình thành sự soi xét người thân; bớt khắt khe một chút, không khí trong nhà sẽ ấm hơn.",
    "sucKhoe": "Nhịp năm tương đối êm nên đây là dịp tốt để giữ một lối sống đều đặn thay vì dồn ép bản thân. Người kỷ luật như bạn dễ ôm việc quá tay và quên nghỉ, nên hãy cho mình những khoảng dừng thật sự, ngủ đủ và vận động nhẹ nhàng. Cái tính muốn mọi thứ chỉn chu nếu kéo dài cả vào lúc nghỉ sẽ khiến đầu óc khó thư giãn; tập buông bớt cũng là một cách chăm sức khỏe.",
    "loiKhuyen": "Hãy tận dụng nền năm nâng đỡ này để làm sâu những việc bạn vốn giỏi và mạnh dạn bắt tay với người hợp như tuổi Tỵ, Sửu. Đồng thời, tập nới lỏng tiêu chuẩn một chút với người quanh mình; sự chủ động và bao dung của bạn mới là thứ định hình năm, chứ không phải con giáp.",
    "faq": [
      {
        "q": "Tuổi Dậu năm 2027 Đinh Mùi có phạm Thái Tuế không?",
        "a": "Không. Chi năm là Mùi, còn bạn tuổi Dậu, hai bên ở thế bình hòa với Thái Tuế nên không thuộc nhóm xung, hại hay phạm năm tuổi. Đây là lý do tông năm được xem là bình ổn, không phải năm cần lo lắng đặc biệt. Dù vậy, đây chỉ là nét chung theo con giáp, vận trình thật của bạn còn phụ thuộc ngày giờ sinh cụ thể."
      },
      {
        "q": "Năm 2027 tuổi Dậu hợp làm ăn, hợp tác với tuổi nào?",
        "a": "Theo tam hợp của tuổi Dậu thì tuổi Tỵ và Sửu là những người dễ đồng điệu, hợp để cùng làm việc hay nương tựa khi cần. Điều này không có nghĩa người tuổi khác thì xấu, chỉ là với Tỵ và Sửu bạn thường tìm được tiếng nói chung nhanh hơn. Hãy xem đây là gợi ý tham khảo, còn duyên hợp tác thật sự vẫn nằm ở sự chân thành và nỗ lực của cả hai phía."
      }
    ]
  },
  tuat: {
    "tongQuan": "Năm Đinh Mùi 2027 mang tông bình ổn với người tuổi Tuất, vì Tuất bình hoà với Thái Tuế năm nay chứ không xung không hại. Tuất hành Thổ gặp năm Mùi cũng hành Thổ nên dễ đồng điệu, mọi việc có nền vững để đi từng bước. Điều cần giữ ý là nguyên tắc vốn có của tuổi này: vững thì tốt, nhưng cứng quá lại bỏ lỡ cơ hội, nên năm nay hợp để tập linh hoạt hơn một chút. Đây là góc nhìn chung theo con giáp, còn vận trình thật của bạn vẫn phụ thuộc ngày giờ sinh và cách bạn xoay xở trong từng việc.",
    "suNghiep": "Người tuổi Tuất làm việc có trách nhiệm và đáng tin, năm bình ổn này là lúc thuận để củng cố vị trí và làm sâu thứ mình đang theo. Sự trung thực của bạn dễ được người trên ghi nhận, nhưng nếu cứ ôm hết theo nguyên tắc cứng thì sẽ thấy mệt. Khi cần đồng đội hay người đỡ một tay, người tuổi Dần và tuổi Ngọ thường là chỗ hợp ý để bắt chuyện và phối hợp.",
    "taiLoc": "Tài chính năm nay không có biến động lớn theo tông bình ổn, hợp với cách quản lý kỷ luật vốn là điểm mạnh của bạn. Tuổi Tuất ít khi tiêu hoang, nên việc cần làm chỉ là giữ thói quen ghi chép rõ ràng và đừng vì nể nang mà gánh phần tiền bạc của người khác. Đây chỉ là thái độ chung để tham khảo, mọi quyết định lớn vẫn nên cân theo hoàn cảnh thật của bạn.",
    "tinhDuyen": "Trong tình cảm, sự chân thành và sẵn lòng bảo vệ người mình tin là thứ khiến bạn được quý, năm bình hoà này thuận để vun đắp hơn là xáo trộn. Điều đáng lưu ý là người tuổi Tuất đôi khi giữ nguyên tắc đến mức ít nói ra cảm xúc, nên chủ động mềm lời sẽ giúp người bên cạnh hiểu mình hơn. Gia đạo nhìn chung yên, dành thời gian lắng nghe người thân là cách giữ ấm nhà cửa.",
    "sucKhoe": "Nhịp năm bình ổn nên sức khỏe phần nhiều đi theo cách bạn tự chăm mình. Người sống nhiều nguyên tắc như tuổi Tuất hay ôm việc và căng đầu, nên năm nay nhắc bản thân nghỉ ngơi đúng lúc, ngủ đủ và cho mình khoảng trống thư giãn. Giữ được sự cân bằng giữa làm và nghỉ là điều đáng chú ý nhất.",
    "loiKhuyen": "Giữ sự vững vàng vốn có nhưng cho phép mình linh hoạt hơn một nhịp, và đừng ngại nhờ người tuổi Dần, tuổi Ngọ khi cần phối hợp. Chủ động mềm lời với người thân, năm bình ổn là lúc tốt để xây nền lâu dài.",
    "faq": [
      {
        "q": "Tuổi Tuất năm 2027 có phạm Thái Tuế hay năm tuổi không?",
        "a": "Không. Năm 2027 là Đinh Mùi, tuổi Tuất không xung không hại với Thái Tuế năm nay mà ở thế bình hoà, nên đây là một năm có tông bình ổn. Bạn không cần lo theo kiểu năm hạn, chỉ nên giữ sự chủ động trong các việc của mình."
      },
      {
        "q": "Tuổi Tuất nên hợp tác với tuổi nào trong năm 2027?",
        "a": "Theo Tam Hợp của tuổi Tuất, người tuổi Dần và tuổi Ngọ là nhóm dễ đồng điệu, hợp để phối hợp công việc hay tìm người đỡ một tay. Đây là gợi ý tham khảo theo con giáp, còn duyên hợp tác thực tế vẫn tùy vào con người cụ thể và cách hai bên làm việc với nhau."
      }
    ]
  },
  hoi: {
    "tongQuan": "2027 là năm Đinh Mùi, và tuổi Hợi của bạn nằm chung nhóm Tam Hợp với năm (Hợi - Mão - Mùi), nên đây là một năm có nhiều người đỡ đần, nhiều cửa mở thuận. Hành Thủy của Hợi với hành Thổ của năm Mùi có chút khắc nhẹ, nghĩa là không phải mọi việc đều trôi tuột, đôi lúc vẫn phải gồng một nhịp. Nhưng vì bạn ở trong thế tam hợp, phần trợ lực vẫn nhỉnh hơn phần cản, nên năm này hợp để bạn chủ động bày việc ra làm thay vì ngồi chờ. Đây là góc nhìn chung theo con giáp; lá số riêng theo ngày giờ sinh và cách bạn dụng năm mới quyết định phần lớn.",
    "suNghiep": "Năm tam hợp thường dễ gặp người hợp ý để cùng làm, nhất là người tuổi Mão và tuổi Mùi, nên việc gì cần đồng đội hay cần một người mở lời giúp thì đây là lúc nên mạnh dạn. Tính bạn chân thành, dễ chịu, người ta tin và muốn kéo bạn vào việc, đó là vốn quý cần tận dụng. Điểm cần để ý là đừng vì cả nể mà nhận thêm việc rồi ôm quá tay; chọn vài đầu việc làm cho tới nơi sẽ hơn là gật đầu với tất cả.",
    "taiLoc": "Thế tam hợp đỡ cho chuyện tiền nong dễ thở hơn, có thể có khoản vào từ việc hợp tác hoặc người quen giới thiệu. Nhưng tính lạc quan của tuổi Hợi đôi khi khiến bạn chi tay nhanh hoặc gật đầu cam kết tài chính trước khi tính kỹ, nên năm nay hợp để bạn tập thói quen ghi ra rồi mới quyết. Đây là chuyện thái độ quản lý chung, không phải gợi ý rót tiền vào đâu; khoản nào lớn thì cứ để qua một đêm hẵng chốt.",
    "tinhDuyen": "Hợi vốn rộng lượng và ấm, năm tam hợp lại nhiều dịp gặp gỡ nên chuyện tình cảm và quan hệ thường êm, dễ tìm được tiếng nói chung. Người đang có đôi sẽ thấy hợp để vun vén những việc chung đã hoãn lâu; người độc thân có cơ hội qua bạn bè, người quen giới thiệu, nhất là từ nhóm tuổi Mão, Mùi. Với gia đạo, cái dễ chịu của bạn giúp giữ hòa khí, chỉ cần để ý đừng vì ngại va chạm mà giấu suy nghĩ thật quá lâu.",
    "sucKhoe": "Năm có nhiều việc và nhiều cuộc gặp thì nhịp sống dễ bị kéo căng, nhất là khi bạn quen nhận lời rồi tự gánh. Sức khỏe năm nay chủ yếu là chuyện giữ nhịp: ngủ đủ, ăn đúng giờ, đừng để vui bạn vui bè mà bỏ những thói quen chăm mình. Khi thấy mệt thì cho phép mình dừng một chút, nghỉ đúng lúc sẽ đi được đường dài hơn.",
    "loiKhuyen": "Đây là năm thuận để bạn chủ động mở việc và nhận sự giúp đỡ, nhất là từ người tuổi Mão và Mùi; cứ ngỏ lời, đừng đợi. Giữ thói quen cân nhắc trước khi cam kết tiền bạc hay nhận thêm việc, để cái đà thuận lợi không biến thành ôm đồm.",
    "faq": [
      {
        "q": "Tuổi Hợi năm 2027 có phải năm tốt không?",
        "a": "Theo con giáp thì 2027 (Đinh Mùi) là năm khá thuận cho tuổi Hợi, vì Hợi nằm chung nhóm Tam Hợp với năm (Hợi - Mão - Mùi) nên có nhiều trợ lực và quý nhân. Có chút khắc nhẹ giữa hành Thủy của bạn và hành Thổ của năm, nghĩa là vẫn cần chủ động và cân nhắc, chứ không phải mọi việc tự trôi. Tốt hay không còn tùy ngày giờ sinh và cách bạn dụng năm, đây chỉ là góc nhìn tham khảo theo tuổi."
      },
      {
        "q": "Năm 2027 tuổi Hợi nên hợp tác với tuổi nào?",
        "a": "Theo nhóm Tam Hợp, tuổi Hợi hợp với tuổi Mão và tuổi Mùi, nên năm nay những người thuộc hai tuổi này thường là quý nhân, dễ thành đồng đội hoặc người giúp mở lời cho bạn. Đây là gợi ý chung về sự hợp ý trong làm việc, không phải lời chắc chắn ai cũng giống nhau. Quyết định cuối vẫn nên dựa vào con người cụ thể và việc cụ thể, hợp tuổi chỉ là một điểm tham khảo thêm."
      }
    ]
  },
};

export function getForecast2027(slug: string): Forecast2027 | undefined {
  return FORECASTS_2027[slug];
}
