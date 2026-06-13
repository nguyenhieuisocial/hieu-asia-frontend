// hieu.asia — Nội dung trang ý nghĩa 12 sao giờ (hoàng đạo / hắc đạo), lane nâng-cấp-dữ-liệu-mỏng 2026-06.
// name/good COPY từ engine lib/gio-hoang-dao.ts (STARS) — giữ đúng thứ tự vòng 12 sao để khớp công cụ.
// Trước đây mỗi sao chỉ có 1 dòng nghĩa; đây là bài biên tập đầy đủ cho thư viện trang tĩnh.
// Giọng phản tư: "giờ tốt" là quy ước chọn thời điểm để khởi sự với tâm thế vững — không phải định mệnh,
// và không có giờ nào là "giờ chết". Hợp brand "không bói mù".

export interface SaoGio {
  slug: string;
  name: string; // tên sao ("Thanh Long"…)
  good: boolean; // true = hoàng đạo (giờ tốt), false = hắc đạo (giờ xấu)
  element?: string; // hành/biểu tượng nếu có
  keyTags: string[];
  overview: string; // sao này là gì, biểu tượng, vì sao được coi tốt/xấu — 3–4 câu
  favors?: string; // (sao tốt) việc thường được nhắc là hợp
  cautions?: string; // (sao xấu) việc nên cẩn trọng — KHÔNG dọa, chỉ nhắc
  reflect: string[]; // câu hỏi/gợi ý dùng giờ một cách tỉnh táo
}

export const SAO_GIO: SaoGio[] = [
  {
    slug: 'thanh-long',
    name: 'Thanh Long',
    good: true,
    keyTags: ['đại cát', 'khởi sự lớn', 'may mắn toàn diện'],
    overview:
      'Thanh Long (Rồng Xanh) là sao đứng đầu trong sáu sao hoàng đạo — được xem là giờ đẹp nhất trong ngày theo phong tục. Hình tượng con rồng phương Đông gắn với sinh khí, quyền uy và sự hanh thông, nên giờ Thanh Long thường được chọn cho những việc trọng đại nhất: cưới hỏi, động thổ, khai trương, xuất hành. Hiểu cho đúng: đây là một quy ước văn hoá để chọn thời điểm khởi sự với tâm thế tự tin — không phải lời bảo đảm thành công.',
    favors: 'Cưới hỏi, khởi công xây dựng, khai trương, xuất hành, ký kết việc lớn.',
    reflect: [
      'Việc trọng đại bạn định làm: chọn giờ đẹp giúp tâm bạn vững hơn — nhưng phần chuẩn bị thật (con người, tiền bạc, kế hoạch) đã đủ chưa?',
      'Nếu không có giờ Thanh Long trong ngày bạn cần, một giờ hoàng đạo khác cũng đủ — đừng dời cả việc lớn vì một khung giờ.',
    ],
  },
  {
    slug: 'minh-duong',
    name: 'Minh Đường',
    good: true,
    keyTags: ['quý nhân', 'gặp gỡ', 'đàm phán thuận'],
    overview:
      'Minh Đường (Sảnh Sáng) là sao hoàng đạo gắn với sự che chở của quý nhân và không khí sáng sủa, đường hoàng. Theo phong tục, giờ này thuận cho những việc cần sự ủng hộ của người khác: gặp đối tác, đàm phán, phỏng vấn xin việc, trình bày trước người có quyền quyết định. Cốt lõi của "giờ quý nhân" rất đời: chọn lúc mình tỉnh táo và chỉn chu nhất để gặp người quan trọng — phần còn lại nằm ở sự chân thành và chuẩn bị của bạn.',
    favors: 'Gặp đối tác, đàm phán, phỏng vấn, trình bày, giao dịch cần người khác gật đầu.',
    reflect: [
      'Cuộc gặp quan trọng sắp tới: bạn đã chuẩn bị điều mình muốn nói rõ chưa — giờ đẹp chỉ giúp bạn bình tĩnh hơn để nói nó.',
      'Quý nhân thật thường là người mình từng tử tế; giờ Minh Đường nhắc bạn đến đúng hẹn và đàng hoàng, không thay được mối quan hệ đã vun.',
    ],
  },
  {
    slug: 'thien-hinh',
    name: 'Thiên Hình',
    good: false,
    keyTags: ['hình thương', 'kiện tụng', 'nên thận trọng'],
    overview:
      'Thiên Hình là một trong sáu sao hắc đạo, theo quan niệm dân gian chủ về hình phạt, va chạm pháp lý, thương tổn. Vì vậy giờ Thiên Hình thường được khuyên tránh cho những việc dễ sinh tranh chấp hoặc rủi ro thân thể: ký kết hợp đồng quan trọng, phẫu thuật, xuất hành xa. Nói cho rõ: "giờ xấu" trong phong tục là lời nhắc thận trọng hơn, KHÔNG phải điềm tai hoạ chắc chắn — sống cẩn thận và làm việc tử tế quan trọng hơn mọi khung giờ.',
    cautions: 'Nên cẩn trọng khi ký kết, phẫu thuật, xuất hành xa, hoặc việc dễ dẫn đến tranh chấp.',
    reflect: [
      'Nếu việc gấp rơi vào giờ này, đừng hoảng — kiểm tra kỹ giấy tờ và lời lẽ là cách "hoá giải" thực tế nhất.',
      'Tránh được giờ xấu thì tốt; nhưng một bản hợp đồng đọc kỹ vẫn an toàn hơn một giờ đẹp mà ký vội.',
    ],
  },
  {
    slug: 'chu-tuoc',
    name: 'Chu Tước',
    good: false,
    element: 'Hoả',
    keyTags: ['khẩu thiệt', 'thị phi', 'cẩn ngôn'],
    overview:
      'Chu Tước (Chim Sẻ Đỏ) là sao hắc đạo mang hành Hoả, theo quan niệm dân gian chủ về khẩu thiệt — thị phi, cãi vã, lời qua tiếng lại. Giờ Chu Tước thường được khuyên tránh cho việc dễ sinh bất hoà bằng lời: tranh luận căng thẳng, ký kết có nhiều bên, phát ngôn trước đám đông. Cách hiểu lành mạnh: đây là lời nhắc "uốn lưỡi trước khi nói" — một thói quen tốt ở bất kỳ giờ nào, không riêng giờ này.',
    cautions: 'Nên giữ lời khi tranh luận, ký kết nhiều bên, phát ngôn công khai; cẩn thận lửa và nước sôi.',
    reflect: [
      'Cuộc trao đổi dễ căng sắp tới: bạn đang muốn thắng cuộc cãi, hay muốn giải quyết vấn đề? Câu trả lời quan trọng hơn khung giờ.',
      'Một câu nói nóng buột ra lúc nào cũng hại — giờ Chu Tước chỉ nhắc bạn điều bạn vốn đã biết.',
    ],
  },
  {
    slug: 'kim-quy',
    name: 'Kim Quỹ',
    good: true,
    keyTags: ['tài lộc', 'phúc đức', 'việc tiền bạc'],
    overview:
      'Kim Quỹ (Rương Vàng) là sao hoàng đạo gắn với tài lộc, phúc đức và chuyện con cái, gia đạo. Theo phong tục, giờ này thuận cho các việc liên quan tiền bạc và sự sung túc: mở hàng, cầu tài, khai trương cửa tiệm, các việc gia đình mong cát tường. Hiểu đúng tinh thần: chọn giờ Kim Quỹ là gửi gắm một mong ước tốt lành vào việc mình làm — còn tiền có vào hay không vẫn do sản phẩm, dịch vụ và sự chăm chỉ của bạn quyết định.',
    favors: 'Mở hàng, cầu tài, khai trương, giao dịch tiền bạc, việc gia đạo mong cát tường.',
    reflect: [
      'Mở hàng giờ đẹp là một khởi đầu vui; nhưng khách quay lại vì chất lượng, không vì khung giờ khai trương.',
      'Bạn đang mong điều tốt cho việc gì? Gửi mong ước ấy vào hành động cụ thể hôm nay, không chỉ vào giờ.',
    ],
  },
  {
    slug: 'thien-duc',
    name: 'Thiên Đức',
    good: true,
    keyTags: ['che chở', 'hoá giải', 'bình an'],
    overview:
      'Thiên Đức (Đức Trời, còn gọi Bảo Quang) là sao hoàng đạo mang ý nghĩa được che chở và hoá giải điều xấu. Theo phong tục, giờ Thiên Đức thuận cho những việc cầu sự bình an và nhẹ nhõm: lễ bái, cầu an, hoà giải, bắt đầu một việc cần sự yên ổn. Đây là sao "lành" nhất về tinh thần — và cũng là lời nhắc đẹp: nhiều khi điều ta cần không phải may mắn lớn, mà là một khoảng bình an để làm việc cho tử tế.',
    favors: 'Lễ bái, cầu an, hoà giải mâu thuẫn, khởi sự việc cần sự yên ổn.',
    reflect: [
      'Việc bạn định làm trong giờ này cần sự bình an — bạn đã cho mình đủ tĩnh để làm nó tử tế chưa?',
      'Hoà giải với ai đó: giờ đẹp giúp mở lời, nhưng thành ý của bạn mới là thứ hàn gắn.',
    ],
  },
  {
    slug: 'bach-ho',
    name: 'Bạch Hổ',
    good: false,
    keyTags: ['đao thương', 'hao tổn', 'cẩn trọng di chuyển'],
    overview:
      'Bạch Hổ (Hổ Trắng) là sao hắc đạo, theo quan niệm dân gian chủ về đao thương, hao tổn, tai nạn. Vì vậy giờ Bạch Hổ thường được khuyên tránh cho những việc có rủi ro thân thể hoặc mất mát: phẫu thuật, đi xa, khởi công việc nguy hiểm, việc hệ trọng. Cần nói thẳng: tên sao nghe dữ nhưng đây chỉ là một mức trong vòng quay 12 sao mỗi ngày — không có "giờ định mệnh", và sự cẩn thận thực tế (đội mũ bảo hiểm, kiểm tra an toàn) bảo vệ bạn tốt hơn mọi khung giờ.',
    cautions: 'Nên cẩn trọng khi phẫu thuật, đi xa, khởi công việc nguy hiểm; chú ý an toàn lao động.',
    reflect: [
      'Nếu việc quan trọng rơi vào giờ này, sự an toàn thật (kiểm tra, bảo hộ, đi chậm lại) đáng giá hơn việc đổi giờ.',
      'Tên sao dữ dằn không có nghĩa ngày của bạn xấu — nó chỉ là một lát cắt hai tiếng trong ngày.',
    ],
  },
  {
    slug: 'ngoc-duong',
    name: 'Ngọc Đường',
    good: true,
    keyTags: ['thanh quý', 'học hành', 'thi cử'],
    overview:
      'Ngọc Đường (Sảnh Ngọc) là sao hoàng đạo gắn với sự thanh quý, sáng sủa và đường học vấn hanh thông. Theo phong tục, giờ này đặc biệt thuận cho việc liên quan tri thức và giấy tờ trang trọng: ký kết, học tập, thi cử, lập nghiệp, làm hồ sơ quan trọng. Tinh thần đẹp của sao này: nó đề cao sự học và sự chỉn chu — hai thứ giúp ích cho bạn ở mọi giờ trong đời, không chỉ trong khung hai tiếng được gọi tên.',
    favors: 'Ký kết, nộp hồ sơ, học tập, thi cử, khai bút, bắt đầu việc cần sự chỉn chu.',
    reflect: [
      'Kỳ thi hay việc giấy tờ quan trọng: giờ đẹp giúp bạn bước vào với tâm thế tốt — nhưng sự ôn luyện mới quyết định kết quả.',
      'Chọn giờ Ngọc Đường để bắt đầu học một điều mới cũng được; quan trọng là bạn duy trì nó những ngày sau.',
    ],
  },
  {
    slug: 'thien-lao',
    name: 'Thiên Lao',
    good: false,
    keyTags: ['giam hãm', 'ràng buộc', 'tránh cam kết dài'],
    overview:
      'Thiên Lao (Ngục Trời) là sao hắc đạo, theo quan niệm dân gian chủ về sự giam hãm, ràng buộc, vướng víu. Giờ Thiên Lao thường được khuyên tránh cho những việc tạo ra cam kết khó gỡ: vay mượn lớn, ký hợp đồng dài hạn, khởi sự việc dễ bị trói chân về sau. Hiểu cho tỉnh: đây không phải điềm tù tội, mà là lời nhắc cân nhắc kỹ trước khi buộc mình vào một ràng buộc dài — điều luôn đáng làm, bất kể giờ nào.',
    cautions: 'Nên cân nhắc kỹ khi vay mượn lớn, ký cam kết dài hạn, khởi sự khó rút lui về sau.',
    reflect: [
      'Cam kết dài hạn bạn sắp ký: bạn đã đọc kỹ điều khoản thoát chưa? Đó mới là "cách hoá giải" thật của giờ này.',
      'Nếu một ràng buộc khiến bạn lăn tăn ngay từ đầu, sự lăn tăn ấy đáng nghe hơn cả lịch giờ tốt xấu.',
    ],
  },
  {
    slug: 'huyen-vu',
    name: 'Huyền Vũ',
    good: false,
    keyTags: ['mất mát', 'tiểu nhân', 'cẩn trọng tiền bạc'],
    overview:
      'Huyền Vũ (Rùa Đen) là sao hắc đạo, theo quan niệm dân gian chủ về mất mát, trộm cắp, tiểu nhân ám hại. Giờ Huyền Vũ thường được khuyên cẩn trọng với tiền bạc và giao dịch: chuyển khoản lớn, giao dịch với người lạ, mang theo nhiều tài sản khi đi xa. Cách dùng lành mạnh: xem đây là lời nhắc kiểm tra kỹ trước khi trao tiền hay tin ai — một thói quen phòng vệ tốt mà thời nào, giờ nào cũng nên có.',
    cautions: 'Nên cẩn trọng khi chuyển khoản lớn, giao dịch với người lạ, mang nhiều tài sản đi xa.',
    reflect: [
      'Giao dịch lớn sắp tới: bạn đã xác minh người nhận và thông tin chưa? Đó là tấm khiên thật, không phải khung giờ.',
      '"Tiểu nhân" khó tránh bằng cách đổi giờ; tránh bằng cách cẩn thận với lòng tin và giấy tờ thì được.',
    ],
  },
  {
    slug: 'tu-menh',
    name: 'Tư Mệnh',
    good: true,
    keyTags: ['thuận lợi', 'được hộ trì', 'việc hành chính'],
    overview:
      'Tư Mệnh (Thần coi mệnh) là sao hoàng đạo mang ý nghĩa thuận lợi và được hộ trì, đặc biệt vào ban ngày càng tốt. Theo phong tục, giờ Tư Mệnh hợp cho các việc giấy tờ, đăng ký, hành chính, buôn bán — những việc cần trôi chảy, đúng quy trình. Đây là sao "thuận buồm" của đời thường: nó nhắc rằng chọn đúng lúc để xử lý việc thủ tục (lúc cơ quan mở cửa, lúc mình tỉnh táo) thì việc trôi — một sự thật rất thực tế ẩn sau lớp áo phong tục.',
    favors: 'Làm giấy tờ, đăng ký, nộp hồ sơ hành chính, buôn bán, khởi sự việc cần trôi chảy.',
    reflect: [
      'Việc thủ tục hay rắc rối: chọn giờ đẹp ban ngày cũng là chọn lúc người ta làm việc — sự trùng khớp ấy mới khiến việc trôi.',
      'Giờ thuận giúp tâm bạn nhẹ; chuẩn bị đủ giấy tờ trước khi đi mới giúp việc xong.',
    ],
  },
  {
    slug: 'cau-tran',
    name: 'Câu Trận',
    good: false,
    keyTags: ['vướng mắc', 'dây dưa', 'tránh khởi sự'],
    overview:
      'Câu Trận (thế trận trói buộc) là sao hắc đạo, theo quan niệm dân gian chủ về sự vướng mắc, dây dưa, kiện tụng kéo dài. Giờ Câu Trận thường được khuyên tránh cho việc dễ rơi vào tình trạng lằng nhằng khó dứt: khởi công, di chuyển lớn, ký kết phức tạp nhiều ràng buộc. Hiểu cho đúng: tên sao chỉ mô tả một thế cục "dễ rối", không phải lời nguyền — và việc rối hay gọn phần lớn do mình chuẩn bị kỹ hay sơ sài, hơn là do giờ.',
    cautions: 'Nên cẩn trọng khi khởi công, di chuyển lớn, ký kết nhiều ràng buộc phức tạp.',
    reflect: [
      'Việc nhiều bên dễ rối sắp làm: bạn đã làm rõ ai chịu trách nhiệm gì chưa? Sự rõ ràng gỡ rối tốt hơn việc chọn giờ.',
      'Nếu một việc vốn đã rắc rối, đổi giờ không làm nó gọn lại — chia nhỏ và làm rõ từng phần thì có.',
    ],
  },
];

/** Tra cứu theo slug — dùng cho generateStaticParams + page. */
export function getSaoGio(slug: string): SaoGio | undefined {
  return SAO_GIO.find((s) => s.slug === slug);
}
