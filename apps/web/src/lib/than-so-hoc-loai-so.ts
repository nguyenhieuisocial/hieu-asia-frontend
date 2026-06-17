// hieu.asia — 4 loại số trong thần số học Pythagoras (Vận mệnh, Linh hồn, Nhân cách, Ngày sinh).
// Nghĩa lõi bám sát backend tools/than-so-hoc.ts (EXPRESSION_MEANING / SOUL_URGE_MEANING /
// PERSONALITY_MEANING / BIRTHDAY_MEANING); mở rộng thành bài biên tập đầy đủ.
// Giọng phản tư: con số mô tả KHUYNH HƯỚNG, không phán số phận.

export interface LoaiSoMeaning {
  number: number;
  label: string; // "Số 1", "Số 11", …
  core: string; // nghĩa lõi từ backend — 1 câu
  expanded: string; // mở rộng ~3–4 câu
}

export interface LoaiSo {
  slug: string; // "so-van-menh" | "so-linh-hon" | "so-nhan-cach" | "so-ngay-sinh"
  name: string; // tên hiển thị tiếng Việt
  englishName: string; // "Expression" | "Soul Urge" | "Personality" | "Birthday"
  icon: string;
  keyTags: string[];
  overview: string; // ~4–5 câu mô tả loại số
  howToCalc: string; // hướng dẫn tính ~2–3 câu
  whatItReveals: string; // tiết lộ điều gì ~2–3 câu
  notefooter: string; // lời nhắc "không bói toán"
  meanings: LoaiSoMeaning[]; // 1–9 + master 11/22/33 (BIRTHDAY không có master)
  faqs: { q: string; a: string }[];
}

export const LOAI_SO: LoaiSo[] = [
  {
    slug: 'so-van-menh',
    name: 'Số Vận Mệnh',
    englishName: 'Expression Number',
    icon: '✨',
    keyTags: ['tài năng tự nhiên', 'sứ mệnh nghề nghiệp', 'tính từ tên đầy đủ'],
    overview:
      'Số Vận Mệnh (hay Số Biểu Đạt) được rút ra từ toàn bộ tên đầy đủ của bạn khi sinh — không phải tên thường dùng, không phải tên viết tắt, mà là đúng tên trên khai sinh. Đây là con số mô tả "bạn được trang bị gì": những năng khiếu tự nhiên, xu hướng nghề nghiệp, và cách bạn đóng góp giá trị ra thế giới bên ngoài. Nếu số đường đời (số chủ đạo) cho biết bạn đang đi con đường gì, số vận mệnh cho biết bạn mang theo hành lý gì trên con đường ấy. Hai con số này cộng hưởng nhau: khi chúng cùng hướng, năng lượng rất nhất quán; khi chúng khác hướng, bạn sẽ cảm nhận một sức kéo nội tâm thú vị giữa con đường và tài năng.',
    howToCalc:
      'Viết ra tên đầy đủ khi sinh (bao gồm họ, tên đệm, tên) và chuyển mỗi chữ cái thành số theo bảng Pythagoras (A=1, B=2, … I=9, J=1, … Z=8), bao gồm cả phụ âm lẫn nguyên âm. Cộng tất cả các chữ số lại, sau đó rút gọn về một chữ số — ngoại trừ khi kết quả là 11, 22, hoặc 33 thì giữ nguyên (đây là số master). Với tên có dấu tiếng Việt, cần bỏ dấu về chữ La-tinh trước khi tính.',
    whatItReveals:
      'Số vận mệnh hé lộ khuynh hướng nghề nghiệp và lĩnh vực bạn có thể phát triển tự nhiên nhất — không phải nghề duy nhất bạn được phép làm, mà là vùng năng lượng bạn thường tìm thấy mình trong đó. Nó cũng phản ánh cách người khác nhận ra tài năng của bạn, và loại giá trị bạn thường cống hiến mà đôi khi chính bạn không để ý.',
    notefooter:
      'Số vận mệnh mô tả khuynh hướng và tài năng tự nhiên — không phán định bạn phải làm gì hay không thể làm gì. Mọi người đều có thể lựa chọn con đường của mình; con số chỉ là một góc nhìn để tự hiểu bản thân rõ hơn.',
    meanings: [
      {
        number: 1,
        label: 'Số 1',
        core: 'Thiên hướng tự nhiên của bạn là dẫn đầu, đổi mới. Tài năng tự nhiên: khởi nghiệp, lãnh đạo, quyết đoán.',
        expanded:
          'Với số vận mệnh 1, bạn mang năng lượng của người đi tiên phong: tự nhiên khởi xướng, quyết đoán và không cần chờ ai bật đèn xanh. Tài năng lớn nhất nằm ở khả năng biến ý tưởng thành hành động ngay lập tức. Môi trường lý tưởng là nơi bạn được trao quyền tự quyết — khởi nghiệp, lãnh đạo nhóm, hoặc bất kỳ vai trò nào đòi hỏi sự độc lập. Bài toán dài hạn: học hợp tác mà không cảm thấy bị kéo chậm.',
      },
      {
        number: 2,
        label: 'Số 2',
        core: 'Sứ mệnh ngoại giao, hợp tác. Tài năng tự nhiên: tư vấn, kết nối, làm việc nhóm.',
        expanded:
          'Số vận mệnh 2 trang bị cho bạn ăng-ten cảm xúc tinh tế — bạn đọc được điều người khác chưa nói và tự nhiên đứng vào vai người làm dịu căng thẳng. Đây là tài năng vô cùng quý trong thế giới cần nhiều người biết lắng nghe hơn là nói. Các vai trò tư vấn, trung gian, nhân sự, hoặc điều phối là sân chơi tự nhiên của bạn. Điều cần rèn: dám có tiếng nói riêng, không chỉ phục vụ tiếng nói của người khác.',
      },
      {
        number: 3,
        label: 'Số 3',
        core: 'Bạn biểu đạt qua nghệ thuật và lời nói. Tài năng tự nhiên: viết, diễn thuyết, sáng tạo nội dung.',
        expanded:
          'Số vận mệnh 3 là dấu ấn của người truyền cảm hứng qua lời — viết có hồn, nói có duyên, biến chất liệu cuộc sống thành câu chuyện người khác muốn nghe lại. Sáng tạo nội dung, giảng dạy, nghệ thuật biểu diễn hay bất kỳ nghề nào sử dụng ngôn ngữ đều phù hợp. Điểm cần chú ý: óc sáng tạo rộng dễ dẫn đến nhiều dự án bỏ giữa chừng — chọn ít hơn, làm sâu hơn.',
      },
      {
        number: 4,
        label: 'Số 4',
        core: 'Bạn xây dựng nền tảng vững chắc. Tài năng tự nhiên: quản trị, kỹ thuật, hệ thống.',
        expanded:
          'Số vận mệnh 4 mang tài năng của người xây: kỷ luật, hệ thống, và khả năng biến kế hoạch trên giấy thành thứ đứng vững qua thời gian. Quản trị, kỹ thuật, tài chính, vận hành — bất kỳ đâu cần sự đáng tin và tư duy chi tiết đều là địa bàn của bạn. Thách thức: học linh hoạt với thay đổi, vì thế giới đổi nhanh hơn mọi quy trình bền vững nhất.',
      },
      {
        number: 5,
        label: 'Số 5',
        core: 'Bạn truyền cảm hứng tự do và đổi mới. Tài năng tự nhiên: kinh doanh, marketing, du lịch.',
        expanded:
          'Số vận mệnh 5 trang bị khả năng thích nghi nhanh và tư duy đa hướng — bạn học được hầu như bất cứ thứ gì và kết nối được những thế giới khác nhau. Kinh doanh, truyền thông, du lịch, công nghệ hay bất kỳ lĩnh vực nào chuyển động nhanh là nơi bạn phát sáng. Cần phân biệt: tự do có mục đích khác với chạy trốn sự cam kết.',
      },
      {
        number: 6,
        label: 'Số 6',
        core: 'Bạn chữa lành và nuôi dưỡng. Tài năng tự nhiên: giáo dục, y tế, dịch vụ cộng đồng.',
        expanded:
          'Số vận mệnh 6 là tài năng của sự chăm sóc thực tiễn — bạn không chỉ cảm thương mà còn biết nấu nồi cháo, mua đơn thuốc, tổ chức không gian ấm áp cho người khác. Giáo dục, y tế, nhân sự, dịch vụ hay bất kỳ nghề nào cần sự hiện diện tận tụy đều phù hợp. Bài học: chăm người khác bền hơn khi bạn cũng biết chăm mình.',
      },
      {
        number: 7,
        label: 'Số 7',
        core: 'Bạn nghiên cứu và khai sáng. Tài năng tự nhiên: khoa học, tâm linh, phân tích chuyên sâu.',
        expanded:
          'Số vận mệnh 7 mang tài năng của chiều sâu: không thỏa mãn với bề mặt, luôn tìm cái vì sao thêm một tầng nữa. Trực giác của bạn là sản phẩm của hàng nghìn giờ quan sát thầm lặng. Nghiên cứu, phân tích, khoa học, tư vấn chuyên sâu hay tâm linh — môi trường nào trọng chất lượng tư duy thì bạn nở rộ. Cần xây cây cầu từ tư duy về lại hành động.',
      },
      {
        number: 8,
        label: 'Số 8',
        core: 'Bạn vận hành quyền lực và tài chính. Tài năng tự nhiên: tài chính, doanh nghiệp, đầu tư.',
        expanded:
          'Số vận mệnh 8 là tài năng của người điều hành: hiểu hệ thống, biết cách biến nguồn lực thành kết quả lớn hơn, và chịu được áp lực của những quyết định ảnh hưởng lớn. Tài chính, kinh doanh, bất động sản, quản lý cấp cao — đây là địa bàn tự nhiên. Bài học dài hạn: chiếc cân giữa thành tựu vật chất và phần còn lại của đời.',
      },
      {
        number: 9,
        label: 'Số 9',
        core: 'Bạn phụng sự nhân loại. Tài năng tự nhiên: nghệ thuật, công tác xã hội, lãnh đạo nhân văn.',
        expanded:
          'Số vận mệnh 9 mang tầm nhìn rộng nhất trong dãy số — lòng trắc ẩn vượt khỏi vòng thân quen và khả năng truyền cảm hứng cống hiến. Nghệ thuật, giáo dục, y tế cộng đồng, phi lợi nhuận hay bất kỳ lĩnh vực nào gắn với lý tưởng đều phù hợp. Điều cần rèn: gắn lý tưởng với mô hình bền vững để có thể đi dài.',
      },
      {
        number: 11,
        label: 'Số 11',
        core: 'Bạn truyền tải thông điệp tâm linh, ánh sáng và sự khai mở.',
        expanded:
          'Số vận mệnh 11 là số master của cảm hứng và trực giác — phiên bản cường độ cao của số 2. Bạn có khả năng truyền cảm hứng tự nhiên: khi nói từ trực giác thật của mình, lời bạn chạm vào người nghe ở tầng sâu hơn lý lẽ. Giảng dạy, tư vấn tinh thần, nghệ thuật, hay dẫn dắt ý nghĩa đội nhóm là các vai trò phù hợp. Cần nối đất thường xuyên để ăng-ten nhạy không bị quá tải.',
      },
      {
        number: 22,
        label: 'Số 22',
        core: 'Bạn kiến tạo công trình mang tầm vóc thế kỷ.',
        expanded:
          'Số vận mệnh 22 — Master Builder — kết hợp tầm nhìn lớn với đôi tay thực tiễn: không chỉ vẽ giấc mơ mà còn lập được dự toán cho nó. Đây là tài năng hiếm và hệ trọng — phù hợp với sáng lập tổ chức, thiết kế hệ thống quy mô lớn, hạ tầng mang tính di sản. Bài học: chia công trình lớn thành các mốc 90 ngày để tầm nhìn không đè chết bước chân đầu tiên.',
      },
      {
        number: 33,
        label: 'Số 33',
        core: 'Bạn là người thầy chữa lành, mang tình yêu vô điều kiện.',
        expanded:
          'Số vận mệnh 33 — Master Teacher — là tài năng chữa lành và nâng đỡ ở mức phụng sự: sự hiện diện của bạn khiến người khác cảm thấy được phép yếu đuối, được phép lớn lên. Giáo dục, trị liệu, y tế, dẫn dắt cộng đồng hay bất kỳ vai trò nào đặt tình thương làm nền tảng đều phù hợp. Bài học sống còn: để tình thương chảy qua mình thay vì vắt kiệt mình.',
      },
    ],
    faqs: [
      {
        q: 'Số vận mệnh khác gì số chủ đạo (đường đời)?',
        a: 'Số chủ đạo (đường đời) tính từ ngày sinh — nó mô tả hành trình và bài học cuộc đời. Số vận mệnh tính từ tên đầy đủ khi sinh — nó mô tả tài năng tự nhiên và cách bạn đóng góp giá trị ra thế giới. Cả hai cộng hưởng nhau để tạo nên bức tranh đầy đủ hơn về một người.',
      },
      {
        q: 'Tên tôi đã đổi thì tính tên nào?',
        a: 'Về mặt truyền thống, số vận mệnh dùng tên khai sinh gốc — vì đó là tên "trời đặt". Tuy nhiên, nhiều nhà thần số học cho rằng tên thường dùng lâu năm cũng tạo ra rung động riêng. Điều quan trọng hơn là bạn tự hỏi con số nào mô tả bạn chính xác hơn.',
      },
      {
        q: 'Tên tiếng Việt có dấu thì tính thế nào?',
        a: 'Bỏ dấu về chữ La-tinh không dấu trước (ví dụ: Nguyễn → Nguyen, Phương → Phuong), sau đó tra bảng Pythagoras bình thường. Chữ Đ/đ thành D, các nguyên âm đôi như ươ, oa tính từng chữ một.',
      },
    ],
  },
  {
    slug: 'so-linh-hon',
    name: 'Số Linh Hồn',
    englishName: 'Soul Urge Number',
    icon: '💙',
    keyTags: ['khao khát nội tâm', 'động lực sâu', 'tính từ nguyên âm trong tên'],
    overview:
      'Số Linh Hồn (hay Số Trái Tim) là con số bí mật nhất trong bộ số của bạn — nó không nói về tài năng bạn thể hiện ra ngoài mà về điều bạn thực sự khao khát ở trong. Tính từ nguyên âm trong tên đầy đủ khi sinh, số linh hồn hé lộ thứ động lực thầm lặng phía sau mọi quyết định của bạn: điều bạn tìm kiếm trong tình yêu, điều bạn cần để cảm thấy trọn vẹn, và điều mà khi thiếu nó bạn khó lý giải vì sao mình không hạnh phúc dù bề ngoài có đủ thứ. Đây là con số ít người biết về bạn nhất — thậm chí đôi khi chính bạn cũng chưa đặt thành lời.',
    howToCalc:
      'Viết ra tên đầy đủ khi sinh và chỉ lấy các nguyên âm (A, E, I, O, U; trong thần số học Pythagoras tiếng Anh, Y thường được tính là nguyên âm khi nằm giữa các phụ âm). Với tên tiếng Việt, bỏ dấu về La-tinh trước, sau đó lấy nguyên âm. Chuyển mỗi nguyên âm thành số theo bảng Pythagoras, cộng tất cả lại và rút gọn về một chữ số — giữ nguyên nếu ra 11, 22, hoặc 33.',
    whatItReveals:
      'Số linh hồn tiết lộ khao khát sâu nhất của bạn — điều bạn muốn cảm nhận chứ không nhất thiết là điều bạn muốn đạt được. Nó giải thích tại sao hai người cùng số đường đời lại chọn những con đường rất khác nhau: khao khát nội tâm dẫn hướng lựa chọn, ngay cả khi chính bạn không để ý.',
    notefooter:
      'Số linh hồn là lời mời tự hỏi, không phải bản chẩn đoán. Khao khát của bạn là điểm xuất phát — cách bạn chọn đáp ứng nó, cân bằng nó với thực tế, mới là điều tạo nên cuộc đời của bạn.',
    meanings: [
      {
        number: 1,
        label: 'Số 1',
        core: 'Khao khát độc lập, tự khẳng định, được công nhận là người tiên phong.',
        expanded:
          'Linh hồn số 1 khao khát được là mình một cách trọn vẹn — độc lập, tự quyết, không bị định nghĩa bởi kỳ vọng người khác. Sự công nhận bạn thực sự tìm kiếm không phải là vỗ tay từ đám đông mà là khoảnh khắc bạn biết mình đã dẫn đường đúng. Khi thiếu sự tự chủ này, bạn dễ cảm thấy ngột ngạt dù môi trường bình thường. Hỏi mình: tôi đang sống theo định nghĩa của mình hay định nghĩa của ai?',
      },
      {
        number: 2,
        label: 'Số 2',
        core: 'Khao khát hòa bình, kết nối sâu sắc, được yêu thương và chấp nhận.',
        expanded:
          'Linh hồn số 2 khao khát thuộc về — không chỉ có mặt trong mối quan hệ mà thực sự được nhìn thấy và chấp nhận. Hòa bình nội tâm với bạn là hòa bình trong mối quan hệ: khi xung quanh có căng thẳng chưa giải, bạn khó yên. Điều cần rèn là học phân biệt hòa bình thật sự với việc âm thầm chịu đựng để tránh đụng chạm.',
      },
      {
        number: 3,
        label: 'Số 3',
        core: 'Khao khát biểu đạt, vui vẻ, được sống tự do trong sáng tạo.',
        expanded:
          'Linh hồn số 3 khao khát được biểu đạt mà không bị phán xét — nói điều mình thấy, tạo điều mình yêu thích, và cảm thấy cuộc đời là sân chơi chứ không phải bài kiểm tra. Khi bị buộc vào vai trò quá cứng nhắc hoặc môi trường không có chỗ cho sự tươi vui, bạn héo dần. Điều cần nhớ: niềm vui của bạn là năng lượng thật — đừng tự xin lỗi vì nó.',
      },
      {
        number: 4,
        label: 'Số 4',
        core: 'Khao khát ổn định, trật tự, an toàn và có ý nghĩa lâu dài.',
        expanded:
          'Linh hồn số 4 khao khát cảm giác nền tảng vững: công việc có ý nghĩa rõ ràng, mối quan hệ đáng tin cậy, và biết rằng những gì mình xây sẽ đứng vững. Sự hỗn loạn hoặc thiếu cấu trúc làm bạn mệt mỏi hơn bạn nhận ra. Điều cần cân bằng: sự an toàn bạn tìm kiếm từ bên ngoài cuối cùng phải được xây từ bên trong — không có môi trường nào hoàn toàn chắc chắn.',
      },
      {
        number: 5,
        label: 'Số 5',
        core: 'Khao khát trải nghiệm, tự do, không ràng buộc.',
        expanded:
          'Linh hồn số 5 khao khát được sống — không chỉ tồn tại mà trải nghiệm, khám phá, và cảm nhận đời đa dạng. Sự đơn điệu hoặc cảm giác bị nhốt (dù là bởi công việc, mối quan hệ, hay thói quen) sẽ tích tụ như áp suất ngầm. Điều cần rèn: phân biệt tự do thật sự với nhu cầu thoát khỏi trách nhiệm — cam kết đúng người đúng việc không thu hẹp tự do mà tăng chiều sâu.',
      },
      {
        number: 6,
        label: 'Số 6',
        core: 'Khao khát chăm sóc gia đình, cộng đồng, tạo dựng tổ ấm.',
        expanded:
          'Linh hồn số 6 khao khát được thuộc về một tổ ấm — nơi mình được cần đến, được chăm sóc và cũng có thể chăm sóc người khác. Đóng góp thiết thực cho người mình yêu thương mang lại cho bạn cảm giác trọn vẹn mà ít thứ khác có thể thay thế. Điều cần nhớ: muốn chăm người khác bền lâu, bạn cũng phải cho phép mình được nhận lại.',
      },
      {
        number: 7,
        label: 'Số 7',
        core: 'Khao khát sự thật, hiểu biết, không gian tĩnh lặng để suy ngẫm.',
        expanded:
          'Linh hồn số 7 khao khát chiều sâu — không phải thông tin mà là sự hiểu biết thật sự, không phải mối quan hệ nhiều mà là kết nối thật. Tiếng ồn (vật lý và cảm xúc) là dạng kháng lực lớn nhất với bạn; một mình là nạp điện chứ không phải cô đơn. Điều cần rèn: không phải mọi người đều có khả năng đáp lại chiều sâu của bạn — chấp nhận điều đó thay vì rút lui khỏi mọi kết nối.',
      },
      {
        number: 8,
        label: 'Số 8',
        core: 'Khao khát thành tựu, quyền lực, được công nhận về năng lực.',
        expanded:
          'Linh hồn số 8 khao khát được công nhận năng lực và ảnh hưởng — không chỉ có tiền mà là cảm giác mình có tầm vóc, quyết định của mình tạo ra sự khác biệt. Môi trường không thừa nhận hiệu quả của bạn hoặc không cho bạn lớn làm bạn thất vọng nhanh chóng. Câu hỏi cần giữ: khi nào tôi biết mình "đủ" — hay chiếc cột đích luôn dịch xa thêm?',
      },
      {
        number: 9,
        label: 'Số 9',
        core: 'Khao khát đóng góp, chữa lành, để lại di sản nhân văn.',
        expanded:
          'Linh hồn số 9 khao khát đời mình có ý nghĩa vượt ra ngoài bản thân — đóng góp gì đó cho thế giới lớn hơn mình, để lại dấu ấn nhân văn dù lớn dù nhỏ. Công việc thuần túy mưu sinh mà thiếu ý nghĩa sẽ rút cạn năng lượng của bạn theo thời gian. Điều cần rèn: thương thế giới bắt đầu từ những người và điều cụ thể ngay trước mắt bạn.',
      },
      {
        number: 11,
        label: 'Số 11',
        core: 'Khao khát khai sáng, truyền cảm hứng tâm linh.',
        expanded:
          'Linh hồn số 11 khao khát kết nối với điều gì đó lớn hơn — không nhất thiết là tôn giáo, nhưng là cảm giác cuộc đời có chiều sâu và ý nghĩa vượt ra ngoài những gì nhìn thấy. Bạn cũng khao khát được truyền đi điều đó cho người khác. Gánh nặng của ăng-ten nhạy: phân biệt tín hiệu thật với lo âu do mình tự tạo ra.',
      },
      {
        number: 22,
        label: 'Số 22',
        core: 'Khao khát xây dựng điều vĩ đại cho nhân loại.',
        expanded:
          'Linh hồn số 22 khao khát để lại dấu ấn không chỉ trong đời một người — mà là hệ thống, tổ chức, công trình đứng vững qua thời gian và phục vụ nhiều người. Nỗi thất vọng lớn nhất của bạn là khi tầm nhìn bị thu nhỏ bởi những giới hạn tầm thường. Bài học: công trình vĩ đại cũng bắt đầu từ bước đi bình thường đầu tiên.',
      },
      {
        number: 33,
        label: 'Số 33',
        core: 'Khao khát chữa lành thế giới bằng tình yêu.',
        expanded:
          'Linh hồn số 33 khao khát tình yêu không điều kiện — cả nhận và cho đi. Bạn tìm kiếm môi trường nơi sự quan tâm là ngôn ngữ chính, không phải ngoại lệ. Cảm giác trọn vẹn nhất đến khi bạn thấy ai đó lớn lên nhờ sự nâng đỡ của mình. Điều cần rèn: nhận lại không phải là yếu đuối — đó là điều giúp bạn tiếp tục cho đi.',
      },
    ],
    faqs: [
      {
        q: 'Số linh hồn có phải là điều tôi muốn đạt được trong cuộc đời không?',
        a: 'Không hẳn. Số linh hồn là điều bạn muốn CẢM NHẬN — trạng thái nội tâm, không phải mục tiêu bên ngoài. Ví dụ: linh hồn số 8 không nhất thiết muốn trở thành tỷ phú, nhưng sẽ không hạnh phúc trong vai trò mà năng lực của mình không được ghi nhận.',
      },
      {
        q: 'Khao khát của linh hồn có thể thay đổi theo thời gian không?',
        a: 'Con số không thay đổi, nhưng cách bạn sống với nó thay đổi rất nhiều. Trưởng thành thường đồng nghĩa với việc bạn hiểu rõ hơn điều mình thực sự cần, phân biệt được khao khát thật với phản ứng của nỗi sợ.',
      },
    ],
  },
  {
    slug: 'so-nhan-cach',
    name: 'Số Nhân Cách',
    englishName: 'Personality Number',
    icon: '🎭',
    keyTags: ['ấn tượng đầu tiên', 'vẻ ngoài', 'tính từ phụ âm trong tên'],
    overview:
      'Số Nhân Cách tính từ phụ âm trong tên đầy đủ khi sinh — đây là con số mô tả "lớp ngoài" của bạn: năng lượng bạn phát ra khi người khác lần đầu gặp, phong cách mà người ngoài nhận thấy trước khi họ biết bạn sâu. Không phải bạn đang diễn — đây chính là một mặt thật của bạn, chỉ là mặt hướng ra ngoài. Đôi khi số nhân cách và số linh hồn rất gần nhau (bạn thể hiện ra ngoài khá đúng nội tâm); đôi khi chúng cách xa (bạn được nhìn nhận rất khác với điều mình thực sự cảm nhận bên trong). Hiểu cả hai giúp bạn điều chỉnh cách mình xuất hiện trước thế giới một cách có chủ đích.',
    howToCalc:
      'Viết ra tên đầy đủ khi sinh, bỏ dấu về La-tinh nếu là tên tiếng Việt, và chỉ lấy các phụ âm (mọi chữ cái không phải nguyên âm A, E, I, O, U). Chuyển mỗi phụ âm thành số theo bảng Pythagoras, cộng tất cả lại và rút gọn về một chữ số — giữ nguyên nếu ra 11, 22, hoặc 33.',
    whatItReveals:
      'Số nhân cách tiết lộ ấn tượng đầu tiên bạn tạo ra và "màu sắc" bạn mang vào phòng khi bước vào. Nó cũng giải thích tại sao đôi khi người khác mô tả bạn theo cách bạn không nhận ra mình — vì họ thấy lớp nhân cách, trong khi bạn sống từ lớp linh hồn.',
    notefooter:
      'Số nhân cách mô tả xu hướng xuất hiện trước thế giới — không phải bạn bị "đóng khung" vào một vai diễn. Bạn luôn có thể chủ động chọn cách mình thể hiện; con số chỉ giúp bạn nhận ra điểm xuất phát tự nhiên.',
    meanings: [
      {
        number: 1,
        label: 'Số 1',
        core: 'Vẻ ngoài mạnh mẽ, độc lập, quyết đoán. Người khác thấy bạn như một lãnh đạo tự nhiên.',
        expanded:
          'Nhân cách số 1 tỏa ra năng lượng chủ động và quyết đoán — người gặp bạn lần đầu thường cảm nhận ngay có một người biết mình muốn gì. Bạn không cần làm gì nhiều; cách đứng, ánh mắt, tốc độ đưa ra quyết định đã nói lên điều đó. Điều cần chú ý: ấn tượng mạnh mẽ này đôi khi khiến người khác ngại tiếp cận hoặc không dám đề xuất ý kiến — chủ động mời input sẽ cân bằng lại.',
      },
      {
        number: 2,
        label: 'Số 2',
        core: 'Vẻ ngoài dịu dàng, thân thiện. Bạn dễ gần, biết lắng nghe, tạo cảm giác an toàn.',
        expanded:
          'Nhân cách số 2 tạo ra không gian an toàn tự nhiên — người khác dễ dàng mở lòng với bạn ngay từ lần đầu gặp, thường không biết vì sao. Sự dịu dàng và khả năng lắng nghe thật sự là điểm mạnh hiếm có. Điều cần để ý: cái giá của "dễ gần" là đôi khi người khác không nhìn thấy ranh giới của bạn — hãy thể hiện rõ điều bạn muốn khi cần.',
      },
      {
        number: 3,
        label: 'Số 3',
        core: 'Vẻ ngoài vui tươi, hài hước, cuốn hút. Bạn là tâm điểm của các buổi gặp gỡ.',
        expanded:
          'Nhân cách số 3 bước vào phòng và không khí nhẹ hơn — người ta bị thu hút bởi sự tươi vui và lối biểu đạt cuốn hút của bạn mà thường không để ý mình đã nghe bạn nói bao lâu. Đây là tài năng xã hội có giá trị thật. Điều cần để ý: ấn tượng "người vui tươi" đôi khi che khuất chiều sâu của bạn — đừng ngại để người tin cậy nhìn thấy cả mặt nghiêm túc.',
      },
      {
        number: 4,
        label: 'Số 4',
        core: 'Vẻ ngoài chững chạc, đáng tin. Người khác đặt niềm tin vào sự kiên định của bạn.',
        expanded:
          'Nhân cách số 4 toát ra sự đáng tin cậy — người ta tìm đến bạn khi cần ai đó thật sự làm được việc. Sự chững chạc và nhất quán của bạn là thứ hiếm. Điều cần lưu ý: ấn tượng nghiêm túc đôi khi khiến người mới chưa dám gần; một ít cởi mở về sở thích cá nhân giúp bạn trở nên tiếp cận được hơn.',
      },
      {
        number: 5,
        label: 'Số 5',
        core: 'Vẻ ngoài năng động, phóng khoáng, lôi cuốn. Bạn toát lên tinh thần tự do.',
        expanded:
          'Nhân cách số 5 thu hút bằng năng lượng cởi mở và tinh thần phiêu lưu — người ta thường cảm thấy câu chuyện của bạn lúc nào cũng thú vị hơn của họ. Sự đa dạng trong trải nghiệm khiến bạn có nhiều chủ đề kết nối với nhiều kiểu người. Điều cần chú ý: ấn tượng "tự do, không cam kết" có thể khiến người khác ngần ngại tin tưởng bạn với dự án dài hạn — đôi khi cần chủ động chứng minh sự nhất quán.',
      },
      {
        number: 6,
        label: 'Số 6',
        core: 'Vẻ ngoài ấm áp, đáng tin, có trách nhiệm. Người khác tìm đến bạn để được an ủi.',
        expanded:
          'Nhân cách số 6 tỏa ra sự ấm áp chân thật — người ta cảm thấy được chào đón khi ở cạnh bạn và thường tin tưởng bạn với những điều quan trọng. Đây là ảnh hưởng lặng lẽ nhưng sâu. Điều cần để ý: bạn dễ trở thành "người giải quyết vấn đề của cả nhóm" — học cân bằng giữa việc sẵn sàng giúp và đảm bảo nhu cầu của mình cũng được nhìn thấy.',
      },
      {
        number: 7,
        label: 'Số 7',
        core: 'Vẻ ngoài bí ẩn, sâu sắc, hơi kín đáo. Bạn tạo cảm giác trí tuệ và bí ẩn.',
        expanded:
          'Nhân cách số 7 tỏa ra chiều sâu và sự bí ẩn — không phải vì bạn cố tình, mà vì bạn quan sát nhiều hơn chia sẻ, lắng nghe nhiều hơn nói. Người ta thường cảm thấy tò mò muốn biết thêm về bạn. Điều cần lưu ý: sự kín đáo đôi khi bị đọc nhầm là lạnh hoặc không quan tâm — vài dấu hiệu nhỏ thể hiện sự quan tâm giúp rất nhiều.',
      },
      {
        number: 8,
        label: 'Số 8',
        core: 'Vẻ ngoài thành đạt, tự tin, có quyền lực. Bạn toát lên uy quyền tự nhiên.',
        expanded:
          'Nhân cách số 8 bước vào phòng và người ta chú ý — không cần giới thiệu chức danh, vì uy quyền đã được thể hiện qua cách đứng, cách ăn mặc và sự tự tin. Đây là ảnh hưởng đáng giá trong môi trường kinh doanh và lãnh đạo. Điều cần chú ý: uy quyền tự nhiên đôi khi khiến người khác ngại phản biện bạn — chủ động tạo không gian an toàn để nghe ý kiến trái chiều.',
      },
      {
        number: 9,
        label: 'Số 9',
        core: 'Vẻ ngoài rộng lượng, nhân hậu, có tầm nhìn. Người khác cảm nhận lòng nhân ái của bạn.',
        expanded:
          'Nhân cách số 9 tỏa ra sự bao dung và tầm nhìn — người ta cảm nhận bạn quan tâm đến bức tranh lớn hơn, không chỉ lợi ích cá nhân. Điều này tạo ra uy tín đặc biệt trong các vai trò lãnh đạo và phụng sự. Điều cần để ý: ấn tượng "rộng lượng với tất cả" đôi khi khiến người ta không rõ ranh giới của bạn ở đâu — thể hiện rõ điều bạn không thể hoặc không muốn làm giúp mọi người tôn trọng bạn hơn.',
      },
      {
        number: 11,
        label: 'Số 11',
        core: 'Vẻ ngoài cuốn hút bí ẩn, có chiều sâu tâm linh.',
        expanded:
          'Nhân cách số 11 tỏa ra một loại sức hút khó diễn đạt — người ta cảm thấy có điều gì đó khác thường ở bạn, như thể bạn thấy điều họ không thấy. Đây là ảnh hưởng mạnh trong vai trò truyền cảm hứng. Điều cần lưu ý: sức hút này đi kèm với kỳ vọng cao từ người khác — học cách bảo vệ năng lượng và đặt ranh giới lành mạnh.',
      },
      {
        number: 22,
        label: 'Số 22',
        core: 'Vẻ ngoài có tầm vóc, người ta cảm nhận được sức mạnh kiến tạo.',
        expanded:
          'Nhân cách số 22 toát ra một tầm vóc đặc biệt — người ta cảm giác đây là người xây được điều lớn. Sự kết hợp giữa tự tin và thực tiễn khiến bạn đáng tin cậy theo cách hiếm có. Điều cần để ý: tầm vóc lớn đôi khi khiến người khác không dám đề xuất ý tưởng "nhỏ" với bạn — thể hiện sự cởi mở với từng bước nhỏ giúp giữ mọi người xung quanh.',
      },
      {
        number: 33,
        label: 'Số 33',
        core: 'Vẻ ngoài ấm áp, đầy yêu thương, có khả năng chữa lành ngay khi nhìn vào.',
        expanded:
          'Nhân cách số 33 mang một sự ấm áp đặc biệt — người ta cảm thấy được chấp nhận và an toàn ngay khi gặp bạn, nhiều khi không giải thích được vì sao. Đây là ảnh hưởng chữa lành thật sự. Điều cần lưu ý: sự ấm áp này thu hút nhiều người tìm đến trong lúc khó khăn — học cân bằng để không kiệt sức vì quá nhiều người cần bạn cùng một lúc.',
      },
    ],
    faqs: [
      {
        q: 'Số nhân cách có thay đổi khi tôi đổi tên không?',
        a: 'Về nguyên tắc, số nhân cách dùng tên khai sinh gốc nên không thay đổi. Tuy nhiên, nếu bạn dùng một tên khác lâu năm, tên đó cũng tạo ra ấn tượng và năng lượng riêng. Điều thú vị hơn là tự hỏi: con số nào mô tả đúng ấn tượng bạn tạo ra trong thực tế?',
      },
      {
        q: 'Tại sao người khác mô tả tôi khác với cách tôi cảm nhận bản thân?',
        a: 'Đây chính xác là điều số nhân cách và số linh hồn cùng nhau giải thích. Số nhân cách là lớp bạn thể hiện ra ngoài; số linh hồn là lớp bạn sống với bên trong. Khi hai con số này khác nhau, sẽ có khoảng cách giữa "tôi thấy tôi thế nào" và "người khác thấy tôi thế nào" — điều hoàn toàn bình thường.',
      },
    ],
  },
  {
    slug: 'so-ngay-sinh',
    name: 'Số Ngày Sinh',
    englishName: 'Birthday Number',
    icon: '🎂',
    keyTags: ['tài năng bổ trợ', 'ngày trong tháng', 'dễ tính nhất'],
    overview:
      'Số Ngày Sinh là con số đơn giản và cụ thể nhất trong bộ số thần số học — tính trực tiếp từ ngày trong tháng bạn được sinh ra (không tính tháng, không tính năm). Nếu bạn sinh ngày 15, số ngày sinh là 1+5=6; nếu sinh ngày 7, số ngày sinh là 7. Đây không phải con số quan trọng nhất trong bộ số của bạn, nhưng nó tiết lộ một tài năng cụ thể, thực tiễn mà bạn mang theo tự nhiên — thứ hỗ trợ hành trình chính của đường đời. Coi số ngày sinh như một tài năng bổ trợ: nó không thay thế số đường đời hay số vận mệnh, nhưng làm phong phú thêm bức tranh tổng thể.',
    howToCalc:
      'Lấy ngày trong tháng bạn sinh ra (chỉ ngày, không phải tháng hay năm) và rút gọn về một chữ số theo quy tắc Pythagoras — giữ nguyên nếu ra 11 hoặc 22 (33 không xuất hiện vì ngày tối đa là 31). Ví dụ: sinh ngày 29 → 2+9=11 (giữ nguyên vì là số master); sinh ngày 14 → 1+4=5.',
    whatItReveals:
      'Số ngày sinh tiết lộ một tài năng hoặc đặc điểm tự nhiên cụ thể, thường thể hiện rõ nhất trong môi trường làm việc và trong cách bạn đóng góp vào một nhóm. Đây thường là thứ người khác nhận ra ở bạn trước cả khi bạn tự thấy.',
    notefooter:
      'Số ngày sinh mô tả tài năng tự nhiên — không phải giới hạn, không phải định mệnh. Tài năng chỉ phát huy khi được rèn giũa và đặt đúng chỗ; còn lại là do lựa chọn và nỗ lực của bạn.',
    meanings: [
      {
        number: 1,
        label: 'Ngày 1',
        core: 'Tài năng lãnh đạo bẩm sinh, ý chí mạnh, đi đầu trong nhóm.',
        expanded:
          'Sinh ngày 1, bạn mang tài năng khởi xướng và dẫn dắt từ rất sớm — thường là người đầu tiên đề xuất ý tưởng mới, đầu tiên bắt đầu hành động khi nhóm còn do dự. Ý chí mạnh giúp bạn không bỏ cuộc khi gặp trở ngại đầu tiên. Điều cần phát triển thêm: lắng nghe người khác đủ để tài năng lãnh đạo trở thành cái neo cho cả nhóm, không chỉ là cái tôi dẫn đầu.',
      },
      {
        number: 2,
        label: 'Ngày 2',
        core: 'Tài năng ngoại giao, làm việc nhóm hiệu quả.',
        expanded:
          'Sinh ngày 2, bạn có tài năng cảm nhận và điều hòa động lực nhóm — biết ai đang không ổn trước khi họ nói, giúp các bên tìm được điểm đồng thuận mà không ai mất mặt. Đây là kỹ năng xã hội quý hiếm, đặc biệt trong môi trường nhiều cá tính. Điều cần lưu ý: đừng hy sinh quan điểm của mình quá nhiều để giữ hòa khí.',
      },
      {
        number: 3,
        label: 'Ngày 3',
        core: 'Tài năng sáng tạo, biểu đạt nghệ thuật.',
        expanded:
          'Sinh ngày 3, bạn mang tài năng biểu đạt tự nhiên — lời nói, viết lách, thiết kế hay bất kỳ hình thức sáng tạo nào đều có thể là ngôn ngữ của bạn. Ý tưởng đến dễ dàng, và bạn có khả năng làm phức tạp trở nên thú vị và dễ hiểu. Điều cần rèn: tập trung vào một dự án đến cùng trước khi bắt đầu cái tiếp theo.',
      },
      {
        number: 4,
        label: 'Ngày 4',
        core: 'Tài năng tổ chức, kỷ luật, làm việc bền bỉ.',
        expanded:
          'Sinh ngày 4, bạn có tài năng xây dựng hệ thống và duy trì kỷ luật khi người khác đã mất kiên nhẫn. Tính đáng tin của bạn là tài sản thật: người ta biết nếu giao việc cho bạn, việc sẽ xong đúng như thỏa thuận. Điều cần cân bằng: học nhận ra khi nào quy trình đã phục vụ mục đích và khi nào nó trở thành rào cản cần điều chỉnh.',
      },
      {
        number: 5,
        label: 'Ngày 5',
        core: 'Tài năng thích nghi nhanh, đa năng.',
        expanded:
          'Sinh ngày 5, bạn có khả năng học nhanh và thích nghi với nhiều hoàn cảnh khác nhau — thứ rất quý trong thế giới đổi thay liên tục. Bạn thường tìm ra con đường sáng tạo khi người khác bị kẹt trong cách cũ. Điều cần phát triển: chọn vài lĩnh vực để đào sâu thay vì dàn trải, để đa năng trở thành tài sản chiến lược.',
      },
      {
        number: 6,
        label: 'Ngày 6',
        core: 'Tài năng chăm sóc, trách nhiệm với người thân.',
        expanded:
          'Sinh ngày 6, bạn có tài năng chăm sóc và tổ chức môi trường sống — gia đình, nhóm làm việc hay cộng đồng đều được hưởng lợi từ sự chu đáo của bạn. Điều bạn làm cho người khác thường tỉ mỉ và tận tâm hơn những gì họ tự làm được. Điều cần rèn: chăm mình với cùng mức độ chu đáo ấy.',
      },
      {
        number: 7,
        label: 'Ngày 7',
        core: 'Tài năng phân tích, nghiên cứu chuyên sâu.',
        expanded:
          'Sinh ngày 7, bạn có tài năng đào sâu — không dừng ở bề mặt, luôn tìm thêm tầng nữa. Trong công việc, đây là tài năng quý khi cần nghiên cứu, kiểm định hay giải quyết vấn đề phức tạp. Điều cần phát triển: chia sẻ phát hiện của mình — chiều sâu chỉ tạo giá trị khi được đưa ra ánh sáng.',
      },
      {
        number: 8,
        label: 'Ngày 8',
        core: 'Tài năng kinh doanh, quản lý tài chính.',
        expanded:
          'Sinh ngày 8, bạn có bản năng kinh doanh và hiểu tiền tự nhiên hơn nhiều người — biết cơ hội nào đáng theo đuổi và cơ hội nào chỉ trông hấp dẫn. Tư duy chiến lược và khả năng điều hành là điểm mạnh. Điều cần cân bằng: không phải mọi thứ đều đo được bằng tiền; những thứ không đo được đôi khi mới bền nhất.',
      },
      {
        number: 9,
        label: 'Ngày 9',
        core: 'Tài năng truyền cảm hứng, nhân đạo.',
        expanded:
          'Sinh ngày 9, bạn có tài năng nhìn thấy bức tranh lớn và truyền cảm hứng cho người khác hướng đến điều có ý nghĩa hơn. Lòng trắc ẩn rộng của bạn tạo ra ảnh hưởng thật — không phải bằng uy quyền mà bằng sự chân thành. Điều cần phát triển: gắn lý tưởng với hành động cụ thể, thực tiễn, để tài năng này tạo ra thay đổi thật.',
      },
      {
        number: 11,
        label: 'Ngày 11',
        core: 'Tài năng trực giác cao, khai sáng, truyền cảm hứng tâm linh.',
        expanded:
          'Sinh ngày 11 (hoặc 29→2+9=11), bạn mang tài năng của số master 11: trực giác sắc bén và khả năng truyền cảm hứng theo cách chạm vào tầng sâu hơn lý lẽ. Điều cần chú ý: nối đất thường xuyên để ăng-ten nhạy không trở thành lo âu.',
      },
      {
        number: 22,
        label: 'Ngày 22',
        core: 'Tài năng kiến tạo lớn, kết hợp tầm nhìn và thực tiễn.',
        expanded:
          'Sinh ngày 22, bạn mang tài năng của số master 22: khả năng biến giấc mơ lớn thành công trình thực tiễn — không chỉ vẽ kế hoạch mà thật sự xây được. Điều cần nhớ: công trình lớn cũng bắt đầu từ bước nhỏ; đừng để tầm nhìn đè chết hành động.',
      },
    ],
    faqs: [
      {
        q: 'Số ngày sinh có quan trọng bằng số đường đời không?',
        a: 'Số ngày sinh được coi là tài năng bổ trợ — ít quan trọng hơn số đường đời (chủ đạo) hay số vận mệnh, nhưng cụ thể và thực tiễn hơn. Nó thường mô tả đúng một kỹ năng hoặc đặc điểm bạn nhận ra ngay khi đọc.',
      },
      {
        q: 'Nếu tôi sinh ngày 20 thì số ngày sinh là 2 hay 20?',
        a: '2+0=2, nên số ngày sinh của bạn là 2. Tuy nhiên, số 20 trước khi rút gọn cũng mang ý nghĩa riêng trong một số cách đọc nâng cao — nhưng ở mức cơ bản, bạn dùng con số đã rút gọn.',
      },
      {
        q: 'Số ngày sinh có liên quan đến may mắn không?',
        a: 'Không theo nghĩa "ngày sinh đẹp thì may mắn hơn". Số ngày sinh mô tả tài năng tự nhiên — và tài năng chỉ thành may mắn khi được nhận ra, rèn luyện và đặt đúng chỗ.',
      },
    ],
  },
];

/** Tra cứu theo slug — dùng cho generateStaticParams + page. */
export function getLoaiSo(slug: string): LoaiSo | undefined {
  return LOAI_SO.find((l) => l.slug === slug);
}
