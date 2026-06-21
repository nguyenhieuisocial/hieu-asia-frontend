// hieu.asia — Thoán từ (卦辞) NGUYÊN VĂN 64 quẻ Chu Dịch (Kinh Dịch) + phiên âm + nghĩa.
//
// Tầng GROUNDING cổ thư cho trang ý nghĩa quẻ: trích NGUYÊN VĂN thoán từ — phần
// lời quẻ cổ nhất (~Tây Chu), thuộc PHẠM VI CÔNG CỘNG — để người đọc thấy nội
// dung biên tập (que-kinh-dich.ts) bắt rễ vào cổ thư thật, không phải lời tự đoán.
// Cùng tinh thần lớp "Đối chiếu cổ thư" của Tử Vi.
//
// NGUỒN nguyên văn (chữ Hán): Wikisource tiếng Trung — zh.wikisource.org/wiki/周易/<tên quẻ>
//   (bản chữ Hán phạm vi công cộng; lấy nguyên byte, không qua mô hình dịch).
// PHIÊN ÂM Hán-Việt + DIỄN NGHĨA: chéo-kiểm 2 lượt phiên âm độc lập (60/64 khớp
//   tuyệt đối; 4 dị âm 觀/汔/巳 đã chọn âm chuẩn). Là CÔNG CỤ ĐỌC, không thay
//   bản dịch học thuật; nên có thầy Kinh Dịch rà tinh khi có điều kiện.
// id KHỚP King Wen 1..64 của que-kinh-dich.ts (đã đối chiếu tên 卦 ↔ Hán-Việt).

export interface ThoanTu {
  /** Nguyên văn chữ Hán (卦辞) — phạm vi công cộng. */
  han: string;
  /** Phiên âm Hán-Việt. */
  hanViet: string;
  /** Diễn nghĩa tiếng Việt ngắn, trung thành. */
  nghia: string;
}

/** Dòng ghi nguồn hiển thị kèm trích dẫn. */
export const THOAN_TU_SOURCE =
  'Nguyên văn Thoán từ (卦辞) — Chu Dịch (Kinh Dịch), văn bản cổ thuộc phạm vi công cộng (đối chiếu Wikisource).';

/** Thoán từ theo id quẻ (King Wen 1..64). */
export const THOAN_TU: Record<number, ThoanTu> = {
  1: { han: '元亨。利貞。', hanViet: 'Nguyên hanh. Lợi trinh.', nghia: 'Hanh thông từ gốc. Lợi về sự bền chính.' },
  2: { han: '元亨。利牝馬之貞。', hanViet: 'Nguyên hanh. Lợi tẫn mã chi trinh.', nghia: 'Hanh thông từ gốc. Lợi ở sự bền chính của ngựa cái (thuận theo, nhu thuận mà giữ bền).' },
  3: { han: '元亨，利貞。勿用有攸往，利建侯。', hanViet: 'Nguyên hanh, lợi trinh. Vật dụng hữu du vãng, lợi kiến hầu.', nghia: 'Hanh thông từ gốc, lợi về bền chính. Chớ vội có chỗ đi xa; nên lập tước hầu (dựng người giúp việc).' },
  4: { han: '亨。匪我求童蒙，童蒙求我。初筮告，再三瀆，瀆則不告。利貞。', hanViet: 'Hanh. Phỉ ngã cầu đồng mông, đồng mông cầu ngã. Sơ phệ cáo, tái tam độc, độc tắc bất cáo. Lợi trinh.', nghia: 'Hanh thông. Chẳng phải ta cầu trẻ thơ ngu muội, mà trẻ thơ cầu ta. Lần đầu bói thì bảo cho; hỏi đi hỏi lại nhiều lần là nhờn, nhờn thì không bảo nữa. Lợi về bền chính.' },
  5: { han: '有孚，光亨。貞吉，利涉大川。', hanViet: 'Hữu phu, quang hanh. Trinh cát, lợi thiệp đại xuyên.', nghia: 'Có lòng thành tín, sáng tỏ và hanh thông. Giữ chính thì tốt, lợi cho việc vượt sông lớn.' },
  6: { han: '有孚，窒，惕，中吉，終凶。利見大人，不利涉大川。', hanViet: 'Hữu phu, trất, dịch, trung cát, chung hung. Lợi kiến đại nhân, bất lợi thiệp đại xuyên.', nghia: 'Có lòng thành nhưng bị ngăn trở, nên lo sợ giữ mình; nửa chừng thì tốt, đến cùng thì xấu. Nên gặp bậc đại nhân, không lợi cho việc vượt sông lớn.' },
  7: { han: '貞丈人吉，无咎。', hanViet: 'Trinh trượng nhân cát, vô cữu.', nghia: 'Giữ chính, có bậc trưởng giả (tướng lĩnh) thì tốt, không lỗi.' },
  8: { han: '吉。原筮元永貞，无咎。不寧方來，後夫凶。', hanViet: 'Cát. Nguyên phệ nguyên vĩnh trinh, vô cữu. Bất ninh phương lai, hậu phu hung.', nghia: 'Tốt. Xét lại từ đầu, giữ đạo lâu dài và chính bền thì không lỗi. Kẻ chưa yên cũng tìm đến quy phụ; ai đến sau thì xấu.' },
  9: { han: '亨。密雲不雨，自我西郊。', hanViet: 'Hanh. Mật vân bất vũ, tự ngã tây giao.', nghia: 'Hanh thông. Mây dày mà chưa mưa, từ cánh đồng phía tây của ta (khí tụ chưa thành, sức nuôi còn nhỏ).' },
  10: { han: '履虎尾，不咥人，亨。', hanViet: 'Lý hổ vĩ, bất điệt nhân, hanh.', nghia: 'Giẫm lên đuôi cọp mà cọp không cắn người; hanh thông (giữ lễ cẩn thận thì qua được nguy).' },
  11: { han: '小往大來，吉亨。', hanViet: 'Tiểu vãng đại lai, cát hanh.', nghia: 'Cái nhỏ đi, cái lớn đến; tốt và hanh thông.' },
  12: { han: '否之匪人，不利君子貞，大往小來。', hanViet: 'Bĩ chi phỉ nhân, bất lợi quân tử trinh, đại vãng tiểu lai.', nghia: 'Bế tắc, chẳng phải đạo người; không lợi cho sự giữ chính của người quân tử; cái lớn đi, cái nhỏ đến.' },
  13: { han: '同人于野，亨。 利涉大川，利君子貞。', hanViet: 'Đồng nhân vu dã, hanh. Lợi thiệp đại xuyên, lợi quân tử trinh.', nghia: 'Cùng người hòa hợp nơi đồng nội (rộng rãi, công khai), hanh thông. Lợi cho việc vượt sông lớn, lợi về sự giữ chính của người quân tử.' },
  14: { han: '元亨。', hanViet: 'Nguyên hanh.', nghia: 'Hanh thông lớn từ gốc.' },
  15: { han: '亨，君子有終。', hanViet: 'Hanh, quân tử hữu chung.', nghia: 'Hanh thông; người quân tử (giữ khiêm) thì có kết cục tốt đẹp.' },
  16: { han: '利建侯行師。', hanViet: 'Lợi kiến hầu hành sư.', nghia: 'Lợi cho việc lập tước hầu và dấy binh.' },
  17: { han: '元亨。利貞。无咎。', hanViet: 'Nguyên hanh. Lợi trinh. Vô cữu.', nghia: 'Hanh thông từ gốc. Lợi về bền chính. Không lỗi.' },
  18: { han: '元亨。利涉大川。先甲三日，後甲三日。', hanViet: 'Nguyên hanh. Lợi thiệp đại xuyên. Tiên giáp tam nhật, hậu giáp tam nhật.', nghia: 'Hanh thông từ gốc. Lợi cho việc vượt sông lớn. Trước ngày giáp ba ngày, sau ngày giáp ba ngày (lo liệu kỹ trước và sau khi sửa đổi).' },
  19: { han: '元亨。利貞。至于八月有凶。', hanViet: 'Nguyên hanh. Lợi trinh. Chí vu bát nguyệt hữu hung.', nghia: 'Hanh thông từ gốc. Lợi về bền chính. Đến tháng tám thì có điều xấu (thịnh rồi sẽ suy).' },
  20: { han: '盥而不荐，有孚顒若。', hanViet: 'Quán nhi bất tiến, hữu phu ngung nhược.', nghia: 'Đã rửa tay (làm lễ) mà chưa dâng lễ vật; lòng thành kính trang nghiêm khiến người ngưỡng vọng.' },
  21: { han: '亨。利用獄。', hanViet: 'Hanh. Lợi dụng ngục.', nghia: 'Hanh thông. Lợi cho việc dùng hình ngục (xử án).' },
  22: { han: '亨。小利有攸往。', hanViet: 'Hanh. Tiểu lợi hữu du vãng.', nghia: 'Hanh thông. Có chút lợi cho việc có chỗ tiến tới.' },
  23: { han: '不利。有攸往。', hanViet: 'Bất lợi. Hữu du vãng.', nghia: 'Không lợi cho việc có chỗ tiến tới (đang lúc bị bào mòn, không nên hành động).' },
  24: { han: '亨。出入无疾，朋來无咎。反復其道，七日來復，利有攸往。', hanViet: 'Hanh. Xuất nhập vô tật, bằng lai vô cữu. Phản phục kỳ đạo, thất nhật lai phục, lợi hữu du vãng.', nghia: 'Hanh thông. Ra vào không trở ngại, bạn bè đến cũng không lỗi. Quay về theo đạo của nó, bảy ngày thì trở lại; lợi cho việc có chỗ tiến tới.' },
  25: { han: '元亨。利貞。其匪正有眚，不利有攸往。', hanViet: 'Nguyên hanh. Lợi trinh. Kỳ phỉ chính hữu sảnh, bất lợi hữu du vãng.', nghia: 'Hanh thông từ gốc. Lợi về bền chính. Nếu không giữ chính thì gặp tai họa, không lợi cho việc có chỗ tiến tới.' },
  26: { han: '利貞，不家食吉，利涉大川。', hanViet: 'Lợi trinh, bất gia thực cát, lợi thiệp đại xuyên.', nghia: 'Lợi về bền chính; không ăn ở nhà (đem tài ra giúp đời) thì tốt; lợi cho việc vượt sông lớn.' },
  27: { han: '貞吉。觀頤，自求口實。', hanViet: 'Trinh cát. Quán di, tự cầu khẩu thực.', nghia: 'Giữ chính thì tốt. Xem cách nuôi dưỡng, tự mình tìm lấy miếng ăn (chính đáng).' },
  28: { han: '棟橈，利有攸往，亨。', hanViet: 'Đống nạo, lợi hữu du vãng, hanh.', nghia: 'Cây xà nhà oằn cong (gánh quá nặng); lợi cho việc có chỗ tiến tới, hanh thông.' },
  29: { han: '有孚，維心亨。行有尚。', hanViet: 'Hữu phu, duy tâm hanh. Hành hữu thượng.', nghia: 'Có lòng thành tín, chỉ riêng tâm là hanh thông. Hành động sẽ được chuộng (vượt được hiểm).' },
  30: { han: '利貞。亨。畜牝牛，吉。', hanViet: 'Lợi trinh. Hanh. Súc tẫn ngưu, cát.', nghia: 'Lợi về bền chính. Hanh thông. Nuôi bò cái (giữ nết nhu thuận) thì tốt.' },
  31: { han: '亨。利貞。取女吉。', hanViet: 'Hanh. Lợi trinh. Thú nữ cát.', nghia: 'Hanh thông. Lợi về bền chính. Cưới vợ thì tốt.' },
  32: { han: '亨，无咎。利貞，利有攸往。', hanViet: 'Hanh, vô cữu. Lợi trinh, lợi hữu du vãng.', nghia: 'Hanh thông, không lỗi. Lợi về bền chính, lợi cho việc có chỗ tiến tới (giữ được lâu dài).' },
  33: { han: '亨。小利貞。', hanViet: 'Hanh. Tiểu lợi trinh.', nghia: 'Hanh thông (nhờ biết lui ẩn đúng lúc). Có chút lợi về bền chính.' },
  34: { han: '利貞。', hanViet: 'Lợi trinh.', nghia: 'Lợi về bền chính (đang lúc cường thịnh, cần giữ chính).' },
  35: { han: '康侯用錫馬蕃庶，晝日三接。', hanViet: 'Khang hầu dụng tích mã phồn thứ, trú nhật tam tiếp.', nghia: 'Bậc hầu yên dân được ban ngựa nhiều đàn, một ngày được tiếp kiến ba lần (tiến lên, được trọng dụng).' },
  36: { han: '利艱貞。', hanViet: 'Lợi gian trinh.', nghia: 'Lợi ở chỗ giữ bền chính trong lúc gian nan (ánh sáng bị che, nên giấu mình giữ đạo).' },
  37: { han: '利女貞。', hanViet: 'Lợi nữ trinh.', nghia: 'Lợi về sự giữ chính của người nữ (mỗi người giữ đúng phận trong nhà).' },
  38: { han: '小事吉。', hanViet: 'Tiểu sự cát.', nghia: 'Việc nhỏ thì tốt (đang lúc trái lìa, chưa nên làm việc lớn).' },
  39: { han: '利西南，不利東北；利見大人，貞吉。', hanViet: 'Lợi tây nam, bất lợi đông bắc; lợi kiến đại nhân, trinh cát.', nghia: 'Lợi về phía tây nam, không lợi phía đông bắc; nên gặp bậc đại nhân, giữ chính thì tốt.' },
  40: { han: '利西南，无所往，其來復吉。有攸往，夙吉。', hanViet: 'Lợi tây nam, vô sở vãng, kỳ lai phục cát. Hữu du vãng, túc cát.', nghia: 'Lợi về phía tây nam; nếu không còn việc phải đi thì trở về là tốt. Nếu còn chỗ phải đi, đi sớm thì tốt.' },
  41: { han: '有孚，元吉。无咎，可貞，利有攸往。曷之用？二簋可用享。', hanViet: 'Hữu phu, nguyên cát. Vô cữu, khả trinh, lợi hữu du vãng. Hạt chi dụng? Nhị quỹ khả dụng hưởng.', nghia: 'Có lòng thành, tốt từ gốc. Không lỗi, có thể giữ chính, lợi cho việc có chỗ tiến tới. Dùng gì để tế? Hai bát cơm cũng đủ để dâng cúng (giảm bớt mà cốt ở lòng thành).' },
  42: { han: '利有攸往。利涉大川。', hanViet: 'Lợi hữu du vãng. Lợi thiệp đại xuyên.', nghia: 'Lợi cho việc có chỗ tiến tới. Lợi cho việc vượt sông lớn.' },
  43: { han: '揚于王庭，孚號，有厲，告自邑，不利即戎，利有攸往。', hanViet: 'Dương vu vương đình, phu hào, hữu lệ, cáo tự ấp, bất lợi tức nhung, lợi hữu du vãng.', nghia: 'Nêu rõ (tội) nơi sân vua, lấy lòng thành mà hô cáo, có điều nguy; trước hãy răn bảo trong ấp mình, không lợi cho việc dùng binh, lợi cho việc có chỗ tiến tới.' },
  44: { han: '女壯，勿用取女。', hanViet: 'Nữ tráng, vật dụng thú nữ.', nghia: 'Người nữ quá mạnh (âm khí lấn lên); chớ cưới người nữ ấy.' },
  45: { han: '亨。王假有廟，利見大人，亨。利貞。用大牲吉，利有攸往。', hanViet: 'Hanh. Vương cách hữu miếu, lợi kiến đại nhân, hanh. Lợi trinh. Dụng đại sinh cát, lợi hữu du vãng.', nghia: 'Hanh thông. Vua đến nhà tông miếu (tụ họp lòng người), nên gặp bậc đại nhân, hanh thông. Lợi về bền chính. Dùng vật tế lớn thì tốt, lợi cho việc có chỗ tiến tới.' },
  46: { han: '元亨，用見大人，勿恤，南征吉。', hanViet: 'Nguyên hanh, dụng kiến đại nhân, vật tuất, nam chinh cát.', nghia: 'Hanh thông từ gốc; nên gặp bậc đại nhân, chớ lo lắng; tiến về phía nam thì tốt (đi lên thuận lợi).' },
  47: { han: '亨，貞大人吉，无咎，有言不信。', hanViet: 'Hanh, trinh đại nhân cát, vô cữu, hữu ngôn bất tín.', nghia: 'Hanh thông; bậc đại nhân giữ chính thì tốt, không lỗi; có nói ra cũng chẳng ai tin (đang lúc khốn cùng, cốt giữ mình).' },
  48: { han: '改邑不改井，无喪无得，往來井井。汔至亦未繘井。羸其瓶，凶。', hanViet: 'Cải ấp bất cải tỉnh, vô táng vô đắc, vãng lai tỉnh tỉnh. Hất chí diệc vị duật tỉnh. Luy kỳ bình, hung.', nghia: 'Dời làng chứ không dời giếng; không mất không thêm; người qua lại cùng dùng chung giếng. Nước gần đến miệng mà chưa kéo lên khỏi giếng; nếu để vỡ gàu thì xấu (việc dở dang, công bỏ phí).' },
  49: { han: '巳日乃孚，元亨。利貞。悔亡。', hanViet: 'Tỵ nhật nãi phu, nguyên hanh. Lợi trinh. Hối vong.', nghia: 'Đến ngày (đúng thời) thì người ta mới tin theo việc đổi mới; hanh thông từ gốc. Lợi về bền chính. Hết điều hối tiếc.' },
  50: { han: '元吉，亨。', hanViet: 'Nguyên cát, hanh.', nghia: 'Tốt từ gốc, hanh thông.' },
  51: { han: '亨。震來虩虩，笑言啞啞。震驚百里，不喪匕鬯。', hanViet: 'Hanh. Chấn lai hịch hịch, tiếu ngôn ách ách. Chấn kinh bách lý, bất táng chủy sưởng.', nghia: 'Hanh thông. Sấm động đến khiến người sợ hãi run rẩy, rồi sau cười nói vui vẻ. Sấm vang kinh động trăm dặm mà người chủ tế không đánh rơi muỗng và rượu nghệ (giữ vững lòng trước biến động).' },
  52: { han: '艮其背，不獲其身，行其庭，不見其人，无咎。', hanViet: 'Cấn kỳ bối, bất hoạch kỳ thân, hành kỳ đình, bất kiến kỳ nhân, vô cữu.', nghia: 'Ngăn dừng ở lưng (chỗ không động), nên không thấy được thân mình; đi qua sân mà không thấy người; không lỗi (dừng đúng lúc, lòng tĩnh không vọng động).' },
  53: { han: '女歸吉，利貞。', hanViet: 'Nữ quy cát, lợi trinh.', nghia: 'Người nữ về nhà chồng thì tốt; lợi về bền chính (tiến dần có thứ tự).' },
  54: { han: '征凶，无攸利。', hanViet: 'Chinh hung, vô du lợi.', nghia: 'Tiến tới thì xấu, không có gì lợi (không giữ đúng phận, danh không chính).' },
  55: { han: '亨。王假之，勿憂，宜日中。', hanViet: 'Hanh. Vương cách chi, vật ưu, nghi nhật trung.', nghia: 'Hanh thông. Vua đạt tới mức ấy (thịnh lớn), chớ lo; nên như mặt trời giữa trưa (sáng tỏ mà giữ được lúc thịnh).' },
  56: { han: '小亨，旅貞吉。', hanViet: 'Tiểu hanh, lữ trinh cát.', nghia: 'Hanh thông nhỏ; người đi đường (lữ khách) giữ chính thì tốt.' },
  57: { han: '小亨。利有攸往。利見大人。', hanViet: 'Tiểu hanh. Lợi hữu du vãng. Lợi kiến đại nhân.', nghia: 'Hanh thông nhỏ. Lợi cho việc có chỗ tiến tới. Nên gặp bậc đại nhân (thuận theo, len vào được).' },
  58: { han: '亨。利貞。', hanViet: 'Hanh. Lợi trinh.', nghia: 'Hanh thông (hòa duyệt). Lợi về bền chính.' },
  59: { han: '亨。王假有廟，利涉大川，利貞。', hanViet: 'Hanh. Vương cách hữu miếu, lợi thiệp đại xuyên, lợi trinh.', nghia: 'Hanh thông. Vua đến nhà tông miếu (gom lại lòng người đang ly tán), lợi cho việc vượt sông lớn, lợi về bền chính.' },
  60: { han: '亨。苦節不可貞。', hanViet: 'Hanh. Khổ tiết bất khả trinh.', nghia: 'Hanh thông. Tiết chế đến mức khổ sở thì không thể giữ mãi (tiết độ vừa phải mới bền).' },
  61: { han: '豚魚吉，利涉大川，利貞。', hanViet: 'Đồn ngư cát, lợi thiệp đại xuyên, lợi trinh.', nghia: 'Lòng thành cảm đến cả heo cá thì tốt; lợi cho việc vượt sông lớn; lợi về bền chính.' },
  62: { han: '亨。利貞。可小事，不可大事。飛鳥遺之音，不宜上宜下，大吉。', hanViet: 'Hanh. Lợi trinh. Khả tiểu sự, bất khả đại sự. Phi điểu di chi âm, bất nghi thượng nghi hạ, đại cát.', nghia: 'Hanh thông. Lợi về bền chính. Nên làm việc nhỏ, không nên làm việc lớn. Chim bay để lại tiếng kêu: không nên bay lên cao mà nên hạ xuống thấp; rất tốt (vượt nhỏ thì giữ khiêm hạ).' },
  63: { han: '亨小。利貞。初吉終亂。', hanViet: 'Hanh tiểu. Lợi trinh. Sơ cát chung loạn.', nghia: 'Hanh thông nhỏ. Lợi về bền chính. Lúc đầu thì tốt, về sau hóa loạn (việc đã thành rồi dễ buông lơi).' },
  64: { han: '亨。小狐汔濟，濡其尾，无攸利。', hanViet: 'Hanh. Tiểu hồ hất tế, nhu kỳ vĩ, vô du lợi.', nghia: 'Hanh thông. Con cáo nhỏ gần qua được sông thì lại ướt cái đuôi; không có gì lợi (sắp xong mà hỏng vì thiếu thận trọng).' },
};

/** Tra Thoán từ theo id quẻ. */
export function getThoanTu(id: number): ThoanTu | undefined {
  return THOAN_TU[id];
}
