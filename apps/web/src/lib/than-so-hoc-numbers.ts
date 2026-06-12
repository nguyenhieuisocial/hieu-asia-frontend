// hieu.asia — Nội dung trang ý nghĩa 12 số chủ đạo (thần số học Pythagoras), lane nâng-cấp-dữ-liệu-mỏng 2026-06.
// Nghĩa lõi BÁM SÁT backend tools/than-so-hoc.ts (LIFE_PATH_MEANING) để tool và thư viện nói cùng một giọng;
// ở đây mở rộng thành bài biên tập đầy đủ. Giọng phản tư: con số mô tả KHUYNH HƯỚNG, không phán số phận.

export interface SoChuDao {
  number: number; // 1–9, 11, 22, 33
  slug: string; // "so-1" … "so-33"
  archetype: string; // tên gọi ngắn ("Người tiên phong")
  master?: boolean;
  keyTags: string[];
  overview: string; // chân dung khuynh hướng — 3–5 câu
  strengths: string[]; // 3–4 điểm mạnh
  challenge: string; // bài học/thử thách — đoạn văn
  love: string;
  work: string;
  reflect: string[];
}

export const SO_CHU_DAO: SoChuDao[] = [
  {
    number: 1,
    slug: 'so-1',
    archetype: 'Người tiên phong',
    keyTags: ['dẫn dắt', 'độc lập', 'khởi xướng'],
    overview:
      'Số 1 là năng lượng của sự bắt đầu: dám đi trước, dám đứng tên, dám chịu trách nhiệm cho lựa chọn của mình. Người mang khuynh hướng này thường khó chịu khi phải chờ lệnh — họ làm tốt nhất khi được trao một vùng đất trống và quyền quyết định. Ý chí và sự độc lập là tài sản quý nhất của số 1; cũng chính hai thứ ấy, khi quá liều, trở thành cái tôi khó hợp tác.',
    strengths: ['Khởi xướng nhanh, không chờ ai cho phép', 'Quyết đoán, dám chịu trách nhiệm', 'Tự lực — ngã tự đứng dậy', 'Truyền năng lượng "làm được" cho người xung quanh'],
    challenge:
      'Bài học lớn của số 1 là học hợp tác mà không thấy mình bị chậm lại: lắng nghe hết một ý kiến trước khi phản biện, chia việc mà không giành lại giữa chừng, và chấp nhận rằng "cùng thắng" nhiều khi bền hơn "thắng một mình". Cái tôi của số 1 là động cơ — nó chỉ thành vấn đề khi ngồi nhầm chỗ ghế lái trong các mối quan hệ.',
    love: 'Trong tình cảm, số 1 chủ động và rõ ràng — nhưng người thương không phải đội nhóm để dẫn dắt. Học hỏi ý trước khi quyết hộ; nhường quyền chọn quán ăn cũng là một bài tập tốt.',
    work: 'Hợp vai mở đường: khởi nghiệp, dẫn dự án mới, vị trí cần quyết nhanh. Cạm bẫy nghề nghiệp: ôm hết vì "tự làm nhanh hơn" — đó là cách chắc nhất để mãi làm một mình.',
    reflect: ['Lần gần nhất bạn để người khác dẫn và việc vẫn tốt — cảm giác ấy thế nào?', 'Việc gì bạn đang chờ ai đó "bật đèn xanh" trong khi thật ra bạn tự bật được?'],
  },
  {
    number: 2,
    slug: 'so-2',
    archetype: 'Người hòa giải',
    keyTags: ['kết nối', 'nhạy cảm', 'đồng đội'],
    overview:
      'Số 2 là năng lượng của sự kết nối: nhạy với cảm xúc người khác, giỏi lắng nghe, tự nhiên đứng vào vai người làm dịu căng thẳng. Trong một thế giới ồn ào toàn người muốn nói, số 2 là người thực sự nghe — và vì thế thường được tin cậy hơn họ tưởng. Sức mạnh của số 2 không gây tiếng động: nó nằm ở những mối quan hệ được vun bền và những xung đột được tháo trước khi kịp nổ.',
    strengths: ['Thấu cảm — đọc được điều người khác chưa nói', 'Khéo léo trong tình huống nhạy cảm', 'Kiên nhẫn vun đắp quan hệ dài hạn', 'Làm việc nhóm tự nhiên, không cần là trung tâm'],
    challenge:
      'Bài học của số 2 là dám có tiếng nói: nói "không" mà không cảm thấy tội lỗi, nêu nhu cầu của mình trước khi kiệt sức, và hiểu rằng ranh giới không làm mất lòng người tử tế — nó chỉ làm phiền người đang lợi dụng. Nhạy cảm là ăng-ten quý; đừng để nó biến thành máy dò ý người khác để sống thay đời mình.',
    love: 'Số 2 yêu sâu và chăm chút — nhưng dễ tự xóa mình để giữ hòa khí. Mối quan hệ lành mạnh cần cả hai tiếng nói; im lặng kéo dài không phải là hòa thuận, nó là nợ chưa đòi.',
    work: 'Hợp các vai cầu nối: nhân sự, chăm khách, điều phối, ngoại giao nội bộ. Để được ghi nhận đúng, tập kể lại đóng góp của mình bằng con số — việc "giữ cho êm" rất thật nhưng vô hình.',
    reflect: ['Nhu cầu nào của bạn đã lâu chưa được nói thành lời?', 'Bạn đang giữ hòa khí cho ai bằng chi phí của chính mình?'],
  },
  {
    number: 3,
    slug: 'so-3',
    archetype: 'Người biểu đạt',
    keyTags: ['sáng tạo', 'giao tiếp', 'truyền cảm hứng'],
    overview:
      'Số 3 là năng lượng của sự biểu đạt: nói có duyên, viết có hồn, kể chuyện khiến người khác muốn nghe tiếp. Niềm vui và óc sáng tạo là dấu ấn — người số 3 bước vào phòng, không khí thường nhẹ đi một bậc. Họ nhìn đời như kho chất liệu: chuyện buồn mấy rồi cũng thành một câu chuyện kể được, và chính khả năng ấy chữa lành cho cả người kể lẫn người nghe.',
    strengths: ['Diễn đạt — biến ý tưởng phức tạp thành lời dễ nghe', 'Sáng tạo đa dạng: viết, nói, thiết kế, nội dung', 'Lạc quan có sức lan', 'Kết bạn nhanh, mạng lưới rộng'],
    challenge:
      'Bài học của số 3 là đi đến cùng: trăm ý tưởng nở ra nhưng cây nào cũng tưới một tuần rồi bỏ thì vườn mãi không có quả. Chọn ít hơn, làm sâu hơn; và cẩn thận với cái bẫy "được vỗ tay" — sự công nhận tức thời (like, lời khen) ngọt nhưng dễ thay thế mục tiêu dài hạn. Nỗi buồn cũng cần được sống thật thay vì lập tức đóng gói thành chuyện vui kể cho người khác.',
    love: 'Số 3 mang lại tiếng cười và sự lãng mạn đầy màu — nhưng thân mật thật sự cần cả những cuộc nói chuyện không-vui: tiền, tổn thương, kỳ vọng. Đừng dùng sự hài hước làm áo giáp mãi.',
    work: 'Hợp nghề nội dung, truyền thông, giảng dạy, sáng tạo. Kỷ luật một-dự-án-tới-cùng đáng giá hơn năng khiếu thứ mười một.',
    reflect: ['Dự án nào bạn đã bỏ ở mức 70% — điều gì sẽ xảy ra nếu quay lại làm nốt 30%?', 'Lần cuối bạn cho phép mình buồn thật, không pha trò, là khi nào?'],
  },
  {
    number: 4,
    slug: 'so-4',
    archetype: 'Người xây nền',
    keyTags: ['kỷ luật', 'đáng tin', 'hệ thống'],
    overview:
      'Số 4 là năng lượng của nền móng: làm việc có hệ thống, giữ lời như giữ của, biến những kế hoạch trên giấy thành công trình đứng được qua mưa bão. Người số 4 hiếm khi là người nói hay nhất phòng — họ là người mà cả phòng tìm đến khi cần việc chắc chắn xong. Thành công của số 4 ít kịch tính: nó được xây từng viên gạch một, và vì thế khó sụp.',
    strengths: ['Đáng tin tuyệt đối — hứa là làm', 'Tư duy hệ thống, quy trình, chi tiết', 'Bền bỉ qua giai đoạn nhàm chán mà người khác bỏ cuộc', 'Quản lý tiền bạc và nguồn lực chắc tay'],
    challenge:
      'Bài học của số 4 là sự mềm: thế giới đổi nhanh hơn mọi quy trình, và "xưa nay vẫn làm thế" không phải lý lẽ. Tập đón thay đổi như dữ kiện mới thay vì mối đe dọa; thử nghiệm nhỏ trước khi bác bỏ; và cho phép mình nghỉ — cỗ máy chạy bền nhờ có bảo trì, con người cũng vậy. Cứng quá thì không phải vững, là giòn.',
    love: 'Số 4 yêu bằng sự ổn định: có mặt, đúng hẹn, lo liệu chu toàn. Nhớ thêm gia vị bất ngờ — sự lãng mạn không nằm trong lịch cũng đáng được tồn tại.',
    work: 'Hợp vận hành, tài chính, kỹ thuật, quản lý chất lượng — nơi sai một li đi một dặm. Cẩn thận bẫy cầu toàn: "đủ tốt để giao đúng hạn" thường thắng "hoàn hảo mà trễ".',
    reflect: ['Quy trình nào của bạn đã thành lối mòn — nếu hôm nay xây lại từ đầu, bạn có xây y hệt?', 'Bạn đã xếp lịch cho việc nghỉ ngơi nghiêm túc như xếp lịch công việc chưa?'],
  },
  {
    number: 5,
    slug: 'so-5',
    archetype: 'Người tự do',
    keyTags: ['phiêu lưu', 'thích nghi', 'trải nghiệm'],
    overview:
      'Số 5 là năng lượng của sự chuyển động: tò mò với mọi cánh cửa, thích nghi nhanh với môi trường mới, sống bằng trải nghiệm hơn bằng tài sản. Đời người số 5 thường nhiều khúc quanh hơn người khác — đổi nghề, đổi chỗ, đổi vai — và đó không phải thiếu định hướng: tự do chính là định hướng của họ. Họ là người mang tin tức, mang gió mới vào những chỗ đang tù đọng.',
    strengths: ['Thích nghi cực nhanh với cái mới', 'Đa năng — học gì cũng vào', 'Giao tiếp rộng, kết nối nhiều thế giới', 'Can đảm rời vùng an toàn'],
    challenge:
      'Bài học của số 5 là phân biệt tự do với chạy trốn: rời đi vì phía trước có điều đáng đến, khác với rời đi vì ở lại phải cam kết. Một vài neo tự chọn — một kỹ năng lõi, một vài người, một nguyên tắc tài chính — không giết tự do; chúng là thứ khiến tự do bền được. Phóng túng không kiểm soát (chi tiêu, cảm xúc, cam kết) là mặt tối quen thuộc của số này.',
    love: 'Số 5 cần người hiểu rằng khoảng trời riêng là oxy của họ — và chính họ cần học rằng cam kết không phải lồng giam: cam kết đúng người là sân bay, không phải xiềng.',
    work: 'Hợp nghề nhiều biến động: kinh doanh, truyền thông, du lịch, công nghệ, nghề tự do. Giữ một sợi chỉ đỏ xuyên các lần đổi vai — nhảy việc có chủ đề thì thành đa năng, không chủ đề thì thành đứt quãng.',
    reflect: ['Lần rời đi gần nhất của bạn: hướng tới điều gì, hay tránh khỏi điều gì?', 'Cái neo nào nếu có sẽ làm tự do của bạn bền hơn thay vì hẹp đi?'],
  },
  {
    number: 6,
    slug: 'so-6',
    archetype: 'Người chăm sóc',
    keyTags: ['trách nhiệm', 'gia đình', 'che chở'],
    overview:
      'Số 6 là năng lượng của sự chăm lo: tự nhiên đứng vào vai người giữ ấm — trong nhà là người vun bữa cơm, trong nhóm là người nhớ sinh nhật, trong khủng hoảng là người mọi người gọi đầu tiên. Tình thương của số 6 thiết thực: không nói nhiều, mà nồi cháo đã nấu, đơn thuốc đã mua. Cộng đồng nào có một người số 6 đúng nghĩa, cộng đồng ấy có một mái hiên.',
    strengths: ['Tận tụy với người mình nhận trách nhiệm', 'Tạo cảm giác an toàn, ấm áp cho người xung quanh', 'Thẩm mỹ chăm chút — nhà cửa, bữa ăn, không gian', 'Đáng tin trong vai trò gia đình và cộng đồng'],
    challenge:
      'Bài học của số 6 có hai tầng: một, chăm mình như chăm người — người giữ ấm cho cả nhà thường là người duy nhất không ai hỏi có lạnh không; hai, thương mà không kiểm soát — "muốn tốt cho con/em/anh" dễ trượt thành quyết hộ đời người khác. Tình thương trưởng thành biết đứng cạnh đỡ, thay vì đứng trước che mất đường.',
    love: 'Số 6 là bạn đời kiểu tổ ấm — thủy chung, vun vén. Cẩn thận thói "ghi sổ hy sinh": cho đi rồi âm thầm chờ được đền đáp là công thức của oán. Cho vì muốn cho, hoặc nói thẳng điều mình cần.',
    work: 'Hợp giáo dục, y tế, nhân sự, dịch vụ, quản gia tổ chức. Học ủy quyền — gánh hết việc của đội không phải chăm đội, là làm đội yếu đi.',
    reflect: ['Tuần này bạn đã chăm mình bằng đúng sự chu đáo bạn dành cho người khác chưa?', 'Sự giúp đỡ nào của bạn đang khiến người kia nhỏ lại thay vì lớn lên?'],
  },
  {
    number: 7,
    slug: 'so-7',
    archetype: 'Người tìm chân lý',
    keyTags: ['sâu sắc', 'trực giác', 'nghiên cứu'],
    overview:
      'Số 7 là năng lượng của chiều sâu: không thỏa mãn với câu trả lời bề mặt, luôn hỏi "vì sao" thêm một tầng nữa. Người số 7 cần khoảng lặng như cần khí thở — một mình với sách, với suy nghĩ, với câu hỏi lớn — và từ những khoảng lặng ấy họ mang về thứ đám đông không có: cái nhìn xuyên. Trực giác của số 7 thường đúng một cách khó giải thích, vì nó là kết quả của hàng nghìn giờ quan sát thầm lặng.',
    strengths: ['Phân tích sâu, không bị bề mặt đánh lừa', 'Trực giác sắc — bắt được tín hiệu nhỏ', 'Tự học bền bỉ, chuyên môn hóa cao', 'Bình tĩnh, không chạy theo đám đông'],
    challenge:
      'Bài học của số 7 là cây cầu về lại thế giới: chiều sâu chỉ thành giá trị khi được chia sẻ, và sự một mình chỉ lành mạnh khi là lựa chọn chứ không phải pháo đài. Tập tin người từng bước — không ai đáng tin 100% ngay, nhưng cô lập để khỏi thất vọng là trả giá quá đắt cho sự an toàn. Đầu óc hoài nghi của bạn rất quý; đừng để nó hoài nghi luôn cả những điều ấm áp có thật.',
    love: 'Số 7 cần người tôn trọng thế giới nội tâm của mình — và cần tự nhắc: người thương không đọc được suy nghĩ; sự im lặng giàu ý nghĩa với bạn có thể là sự xa cách với họ. Mở cửa từng phòng một.',
    work: 'Hợp nghiên cứu, phân tích, kỹ thuật chuyên sâu, viết lách học thuật. Chọn môi trường trọng chất lượng tư duy; chợ ồn ào làm số 7 héo.',
    reflect: ['Phát hiện sâu sắc nào của bạn đang nằm trong ngăn kéo vì ngại chia sẻ?', 'Sự một mình hiện tại của bạn là khoảng lặng nuôi dưỡng, hay pháo đài né tránh?'],
  },
  {
    number: 8,
    slug: 'so-8',
    archetype: 'Người kiến tạo quyền lực',
    keyTags: ['tham vọng', 'tài chính', 'điều hành'],
    overview:
      'Số 8 là năng lượng của quyền lực vật chất: hiểu tiền, hiểu hệ thống, hiểu cách biến nguồn lực thành kết quả lớn hơn. Người số 8 có tham vọng tự nhiên và không cần xin lỗi vì điều đó — họ sinh ra để điều hành, để nhân giá trị lên, để đứng ở nơi quyết định được đưa ra. Cuộc đời số 8 thường có biên độ lớn: thắng lớn, vấp lớn, học lớn — và chính các chu kỳ ấy tôi luyện bản lĩnh điều hành thật.',
    strengths: ['Tư duy tài chính và đầu tư bẩm sinh', 'Điều hành — biến hỗn loạn thành hệ thống chạy', 'Chịu được áp lực và quyết định lớn', 'Tham vọng đủ lớn để kéo cả đội đi xa'],
    challenge:
      'Bài học của số 8 là chiếc cân: vật chất và phần còn lại của đời. Quyền lực là công cụ trung tính — dùng để nâng người thì thành uy tín, dùng để đè người thì thành nợ; tiền là thước đo tốt cho hiệu quả nhưng là thước đo tồi cho con người. Số 8 trưởng thành khi học được câu khó nhất với họ: "đủ" — và khi bảng thành tích có thêm những dòng không quy được ra số.',
    love: 'Số 8 thể hiện tình cảm qua sự bảo bọc vật chất — đáng quý, nhưng người thân cần thời gian và sự hiện diện của bạn hơn một khoản chu cấp nữa. Ghế CEO để ở công ty; về nhà làm người nhà.',
    work: 'Hợp kinh doanh, tài chính, quản lý cấp cao, bất động sản. Xây thêm vòng kiểm soát đạo đức quanh các quyết định lúc thắng lớn — đó là lúc số 8 dễ trượt nhất.',
    reflect: ['Định nghĩa "đủ" của bạn là gì — có con số cụ thể không, hay cứ thêm mãi?', 'Quyền lực hiện tại của bạn đang nâng ai lên?'],
  },
  {
    number: 9,
    slug: 'so-9',
    archetype: 'Người nhân đạo',
    keyTags: ['trắc ẩn', 'lý tưởng', 'cống hiến'],
    overview:
      'Số 9 là năng lượng của vòng tròn khép lại: con số cuối cùng của dãy đơn, mang trong mình một chút của tất cả các số trước — vì thế người số 9 hiểu được nhiều kiểu người một cách lạ lùng. Lòng trắc ẩn của họ vượt khỏi vòng thân quen: chuyện bất công ở đâu đó cũng làm họ trăn trở như chuyện nhà. Số 9 sống đẹp nhất khi đời họ phụng sự một điều lớn hơn chính họ.',
    strengths: ['Trắc ẩn rộng — thương được cả người dưng', 'Tầm nhìn lý tưởng, truyền cảm hứng cống hiến', 'Bao dung, ít chấp vặt', 'Nghệ sĩ tính — cảm thụ sâu cái đẹp và nỗi người'],
    challenge:
      'Bài học của số 9 là học buông và học nhận: buông những điều đã hết vai trò (mối quan hệ, vai trò cũ, nỗi đau cũ) — vì số 9 là số của sự hoàn tất, mà người số 9 lại hay níu; và nhận — cho phép người khác giúp lại mình, vì người cho mãi mà không nhận sẽ vơi đến đáy lúc nào không hay. Lý tưởng lớn cũng cần kế toán: thương thế giới mà quên trả tiền điện nhà mình thì lý tưởng khó đi xa.',
    love: 'Số 9 yêu bao dung và sâu — nhưng hay đặt người thương vào lý tưởng hóa rồi thất vọng vì người thật. Yêu con người trước mặt, không phải phiên bản hoàn hảo trong đầu.',
    work: 'Hợp giáo dục, y tế cộng đồng, phi lợi nhuận, nghệ thuật, nghề chữa lành. Gắn lý tưởng với mô hình bền vững — người làm việc thiện kiệt sức là tổn thất kép.',
    reflect: ['Điều gì đã hoàn tất vai trò trong đời bạn mà bạn còn đang ôm?', 'Lần cuối bạn để người khác giúp mình là bao giờ — và vì sao lâu thế?'],
  },
  {
    number: 11,
    slug: 'so-11',
    archetype: 'Người truyền cảm hứng',
    master: true,
    keyTags: ['trực giác phi thường', 'nhạy cảm cao', 'khai sáng'],
    overview:
      'Số 11 là số master đầu tiên — phiên bản cường độ cao của số 2: vẫn là năng lượng kết nối và thấu cảm, nhưng ăng-ten nhạy gấp nhiều lần. Người số 11 bắt được những tần số người khác không nghe thấy: không khí của một căn phòng, điều chưa nói trong một cuộc họp, xu hướng trước khi nó thành xu hướng. Họ có khả năng truyền cảm hứng tự nhiên — khi nói từ trực giác thật của mình, lời họ chạm vào người nghe ở tầng sâu hơn lý lẽ.',
    strengths: ['Trực giác gần như tiên cảm — bắt tín hiệu cực sớm', 'Truyền cảm hứng, nâng tinh thần đám đông', 'Thấu cảm sâu sắc với nỗi người', 'Tư duy tầm nhìn, thấy bức tranh lớn'],
    challenge:
      'Cái giá của ăng-ten nhạy là nhiễu: số 11 dễ lo âu, dễ quá tải cảm xúc, dễ sống trong tầm nhìn mà quên xây bậc thang tới đó. Bài học kép: một, nối đất — ngủ đủ, vận động, những thói quen rất "đất" giữ cho dây đàn căng không đứt; hai, hành động hóa — mỗi tầm nhìn phải được dịch thành một bước nhỏ tuần này, nếu không nó chỉ là điện không có dây dẫn. Số master không phải đẳng cấp cao hơn — nó là bài tập khó hơn.',
    love: 'Số 11 cảm nhận được mọi gợn sóng của người thương — kể cả những gợn không có thật do chính mình phóng đại. Kiểm chứng cảm giác bằng câu hỏi thẳng trước khi tin nó hoàn toàn.',
    work: 'Hợp vai truyền cảm hứng: giảng dạy, tư vấn, nghệ thuật, dẫn dắt tinh thần đội nhóm. Cặp với người giỏi thực thi để tầm nhìn có chân.',
    reflect: ['Tầm nhìn nào của bạn đã quá hạn được dịch thành một bước hành động cụ thể?', 'Cảm giác bất an gần đây: bao nhiêu phần là tín hiệu thật, bao nhiêu phần là nhiễu của dây đàn quá căng?'],
  },
  {
    number: 22,
    slug: 'so-22',
    archetype: 'Người kiến tạo bậc thầy',
    master: true,
    keyTags: ['biến mơ thành thật', 'công trình lâu dài', 'tầm vóc lớn'],
    overview:
      'Số 22 — Master Builder — là phiên bản cường độ cao của số 4: vẫn là năng lượng xây nền, nhưng ở quy mô công trình thế hệ. Người số 22 mang một tổ hợp hiếm: tầm nhìn lớn của người mơ mộng cộng đôi tay thực tế của người thợ — họ không chỉ vẽ giấc mơ, họ lập được dự toán cho nó. Những gì số 22 xây, khi xây trọn, thường đứng lâu hơn đời họ: tổ chức, hệ thống, công trình, di sản.',
    strengths: ['Kết hợp tầm nhìn + thực thi — hiếm và quý', 'Xây hệ thống quy mô lớn, nghĩ bằng thập kỷ', 'Kỷ luật thép phục vụ giấc mơ lớn', 'Đáng tin ở những việc hệ trọng'],
    challenge:
      'Gánh nặng của số 22 là chính tiềm năng của nó: cảm giác "mình sinh ra để làm điều lớn" tạo áp lực khiến nhiều người số 22 hoặc tê liệt không dám bắt đầu (sợ không xứng tầm), hoặc nửa vời (làm việc nhỏ cho an toàn rồi day dứt). Bài học: công trình thế kỷ cũng xây bằng từng viên gạch thường — cứ đặt viên hôm nay; và tầm vóc không đo bằng quy mô khởi đầu mà bằng độ bền của thứ được xây. Số master là bài tập khó hơn, không phải vé hạng sang.',
    love: 'Số 22 dễ dồn hết tâm trí cho "công trình" mà quên ngôi nhà cảm xúc cũng cần xây bằng vật liệu thời gian. Đưa người thương vào tầm nhìn — làm đồng kiến trúc sư, đừng để họ làm khán giả.',
    work: 'Hợp sáng lập, kiến trúc hệ thống, hạ tầng, tổ chức quy mô. Chia giấc mơ 10 năm thành các mốc 90 ngày — đó là cách số 22 khỏi bị tầm nhìn của chính mình đè.',
    reflect: ['"Công trình đời" của bạn — nếu phải gọi tên trong một câu — là gì?', 'Viên gạch nào của nó có thể được đặt ngay tuần này, dù nhỏ?'],
  },
  {
    number: 33,
    slug: 'so-33',
    archetype: 'Người thầy phụng sự',
    master: true,
    keyTags: ['chữa lành', 'nâng đỡ', 'tình thương vô điều kiện'],
    overview:
      'Số 33 — Master Teacher — là số master hiếm gặp nhất, phiên bản cường độ cao của số 6: năng lượng chăm sóc được nâng thành sứ mệnh phụng sự. Người số 33 có khả năng đặc biệt trong việc chữa lành và nâng đỡ — sự hiện diện của họ làm người khác thấy được phép yếu đuối, được phép lớn lên. Họ dạy không chỉ bằng lời mà bằng chính cách sống; ảnh hưởng của một số 33 trưởng thành lan qua nhiều thế hệ học trò, con cháu, cộng đồng.',
    strengths: ['Chữa lành — người khác tự nhiên mở lòng với bạn', 'Dạy dỗ, nâng đỡ người khác lớn lên', 'Tình thương rộng không điều kiện', 'Trách nhiệm sâu với cộng đồng'],
    challenge:
      'Bài học sống còn của số 33 là cái máng xối: nước chảy qua chứ không trữ trong — người phụng sự phải học cách để tình thương chảy QUA mình thay vì vắt KIỆT mình. Kiệt sức vì người khác không phải đức hạnh, nó là lỗi kỹ thuật của hệ thống cho-nhận; người thầy gục ngã thì lớp học tan. Học nói không, học nghỉ, học nhận lại — và buông kỳ vọng "phải cứu được tất cả": bạn là người thầy, không phải đấng cứu thế. Số master là trách nhiệm nặng hơn, không phải hào quang.',
    love: 'Số 33 dễ biến mối quan hệ thành lớp học hoặc phòng trị liệu — người thương cần một người bạn đời, không cần thêm một người thầy. Cho phép mình được yếu, được chăm, được là học trò trong chính nhà mình.',
    work: 'Hợp giáo dục, trị liệu, y tế, công tác xã hội, dẫn dắt cộng đồng. Xây cấu trúc tự bảo vệ: giờ nghỉ thiêng liêng, người giám sát chính mình, nhịp nạp lại định kỳ.',
    reflect: ['Bình của bạn đang còn bao nhiêu phần — và ai/điều gì đang rót lại cho bạn?', 'Ai trong đời bạn cần bạn là người thân bình thường hơn là người nâng đỡ?'],
  },
];

/** Tra cứu theo slug — dùng cho generateStaticParams + page. */
export function getSoChuDao(slug: string): SoChuDao | undefined {
  return SO_CHU_DAO.find((n) => n.slug === slug);
}
