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
      'Cung Phụ Mẫu phản ánh quan hệ với cha mẹ, người lớn tuổi, cấp trên — và quá trình tiếp nhận tri thức từ truyền thống. Cũng liên quan tới sức khoẻ tinh thần và "vốn nền" mà gia đình truyền lại.',
    whatItRepresents: [
      'Quan hệ với cha mẹ ruột.',
      'Sức khoẻ tinh thần — di truyền và môi trường tuổi nhỏ.',
      'Khả năng học từ người trên (mentor, sếp đầu đời).',
      'Cách bạn ứng xử với "thẩm quyền" (authority).',
    ],
    howToRead: [
      'Xem chính tinh tại Phụ Mẫu — có Cát hay Sát?',
      'Đối chiếu với Mệnh — Phụ Mẫu mạnh hỗ trợ Mệnh hay đè nén.',
      'Hoá Kỵ tại Phụ Mẫu thường liên quan đến "vướng" với gia đình hoặc thẩm quyền.',
    ],
    trigon: ['Phụ Mẫu', 'Phúc Đức', 'Thiên Di', 'Quan Lộc'],
    commonStars: ['Thiên Lương', 'Thái Dương', 'Thiên Đồng'],
    faq: [
      {
        q: 'Cung Phụ Mẫu xấu nghĩa là cha mẹ tôi sẽ gặp vấn đề?',
        a: 'Không. Cung Phụ Mẫu xấu thường nói về CÁCH BẠN TIẾP NHẬN sự bảo bọc/áp đặt, không phải về cha mẹ trực tiếp. Nhiều người có Phụ Mẫu khó vẫn có cha mẹ rất tốt — chỉ là cảm giác chủ quan của họ khác.',
      },
    ],
  },
  {
    slug: 'cung-phuc-duc',
    name: 'Phúc Đức',
    fullName: 'Cung Phúc Đức (福德宮)',
    domain: 'Phước báu, tâm thái, sức chịu đựng',
    overview:
      'Cung Phúc Đức phản ánh "vốn nội tâm" — khả năng tận hưởng cuộc sống, sức chịu đựng áp lực, và độ thanh thản. Trong Tử Vi cổ, đây cũng là cung của thiện tâm và phước báu tích luỹ.',
    whatItRepresents: [
      'Mức năng lượng nội tâm — bạn hồi phục nhanh sau cú sốc đến mức nào.',
      'Khả năng tận hưởng — có người thành công nhưng Phúc Đức yếu vẫn không thấy vui.',
      'Sức chịu đựng áp lực dài hạn.',
      'Khuynh hướng tâm linh / triết lý sống.',
    ],
    howToRead: [
      'Phúc Đức được "trợ" bằng Cát tinh giúp người ta giữ được bình thản trong khủng hoảng.',
      'Phúc Đức xung Phu Thê → kỳ vọng quá cao trong quan hệ, dễ thất vọng.',
      'Phúc Đức và Mệnh đồng dụng → tâm bình, sống thư thái.',
    ],
    trigon: ['Phúc Đức', 'Phụ Mẫu', 'Tài Bạch', 'Phu Thê'],
    commonStars: ['Thiên Lương', 'Thiên Cơ', 'Tham Lang'],
    faq: [],
  },
  {
    slug: 'cung-dien-trach',
    name: 'Điền Trạch',
    fullName: 'Cung Điền Trạch (田宅宮)',
    domain: 'Nhà cửa, bất động sản, không gian sống',
    overview:
      'Cung Điền Trạch liên quan tới nhà ở, bất động sản, không gian sống — và rộng hơn là "tổ ấm" cả về vật lý và tinh thần.',
    whatItRepresents: [
      'Bất động sản sở hữu hoặc thừa kế.',
      'Chất lượng không gian sống.',
      'Quan hệ với địa lý quê hương / nơi ở.',
    ],
    howToRead: [
      'Cát tinh tại Điền Trạch → dễ tích luỹ tài sản cố định.',
      'Sát tinh → cần thận trọng đầu tư bất động sản, đặc biệt khi đại vận xung Điền Trạch.',
    ],
    trigon: ['Điền Trạch', 'Tử Tức', 'Huynh Đệ', 'Nô Bộc'],
    commonStars: ['Thiên Phủ', 'Vũ Khúc', 'Thái Âm'],
    faq: [],
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
    ],
    trigon: ['Quan Lộc', 'Mệnh', 'Tài Bạch', 'Thiên Di'],
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
    ],
  },
  {
    slug: 'cung-no-boc',
    name: 'Nô Bộc',
    fullName: 'Cung Nô Bộc (奴僕宮)',
    domain: 'Bạn bè, đồng nghiệp, mạng lưới',
    overview:
      'Cung Nô Bộc (còn gọi là cung Bằng Hữu) đại diện cho mạng lưới quan hệ rộng — bạn bè, đồng nghiệp, người dưới quyền. Quan trọng cho cả sự nghiệp và sức khoẻ tinh thần.',
    whatItRepresents: [
      'Kiểu bạn bè bạn thu hút.',
      'Chất lượng mạng lưới — số lượng nhiều/ít, sâu/nông.',
      'Quan hệ với cấp dưới hoặc người được bạn dìu dắt.',
    ],
    howToRead: [
      'Nô Bộc mạnh + Cát → có bạn bè nâng đỡ trong sự nghiệp.',
      'Nô Bộc xung Mệnh → dễ va chạm với người xung quanh hoặc bị ảnh hưởng nặng bởi môi trường.',
    ],
    trigon: ['Nô Bộc', 'Huynh Đệ', 'Điền Trạch', 'Tử Tức'],
    commonStars: ['Thiên Đồng', 'Thiên Cơ', 'Cự Môn'],
    faq: [],
  },
  {
    slug: 'cung-thien-di',
    name: 'Thiên Di',
    fullName: 'Cung Thiên Di (遷移宮)',
    domain: 'Di chuyển, cơ hội bên ngoài, "thế giới"',
    overview:
      'Cung Thiên Di là cung đối diện Mệnh — nói về "thế giới bên ngoài" tác động lên bạn. Liên quan đến di chuyển, đi xa, du học, làm việc ở môi trường mới.',
    whatItRepresents: [
      'Cơ hội đến từ bên ngoài — du học, xuất ngoại, dự án xa.',
      'Cách bạn được "thế giới" nhìn nhận khi rời khỏi vùng quen.',
      'Cơ duyên với người nước ngoài hoặc vùng khác.',
    ],
    howToRead: [
      'Cát tinh tại Thiên Di → đi xa thuận lợi, dễ mở mang sự nghiệp khi rời quê.',
      'Thiên Di xung Mệnh là điều bình thường (luôn xung) — quan trọng là xem sát tinh đi kèm.',
    ],
    trigon: ['Thiên Di', 'Mệnh', 'Quan Lộc', 'Tài Bạch'],
    commonStars: ['Thái Dương', 'Thiên Mã', 'Thiên Cơ'],
    faq: [],
  },
  {
    slug: 'cung-tat-ach',
    name: 'Tật Ách',
    fullName: 'Cung Tật Ách (疾厄宮)',
    domain: 'Sức khoẻ, thể chất, rủi ro',
    overview:
      'Cung Tật Ách phản ánh sức khoẻ thể chất, các bệnh mãn tính có khuynh hướng mắc, và một phần rủi ro tai nạn. Lưu ý: hieu.asia không CHẨN ĐOÁN BỆNH — đây chỉ là tham khảo, không thay khám y tế.',
    whatItRepresents: [
      'Khuynh hướng thể chất — cơ địa nóng/lạnh, sức bền.',
      'Hệ cơ quan có khuynh hướng yếu (theo cổ truyền).',
      'Phản ứng với stress về mặt thân thể.',
    ],
    howToRead: [
      'Cát tinh tại Tật Ách → cơ địa khoẻ, hồi phục nhanh.',
      'Sát tinh + Hoá Kỵ → cần lưu ý các giai đoạn căng để nghỉ ngơi, không phải dự báo bệnh nặng.',
      'KHÔNG dùng Tật Ách thay khám bệnh. Có triệu chứng → đi bác sĩ.',
    ],
    trigon: ['Tật Ách', 'Phu Thê', 'Phụ Mẫu', 'Tài Bạch'],
    commonStars: ['Thiên Cơ', 'Cự Môn', 'Liêm Trinh'],
    faq: [
      {
        q: 'Cung Tật Ách của tôi xấu, tôi có cần lo bệnh không?',
        a: 'Không nên lo theo cách "Tử Vi báo bệnh". hieu.asia không chẩn đoán. Cung Tật Ách xấu là tín hiệu nên duy trì lối sống lành mạnh và khám sức khoẻ định kỳ — đó là việc ai cũng nên làm bất kể lá số.',
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
    ],
    howToRead: [
      'Cát tinh + Vũ Khúc/Thiên Phủ tại Tài Bạch → có khả năng tích luỹ.',
      'Sát tinh + Hoá Kỵ → cần quản lý dòng tiền cẩn thận, không nên đầu tư rủi ro cao.',
      'Tài Bạch xung Phúc Đức → tiền nhiều nhưng không thấy đủ; cần xem cả tâm thái.',
      'KHÔNG dùng Tài Bạch để quyết định mua/bán cổ phiếu cụ thể.',
    ],
    trigon: ['Tài Bạch', 'Quan Lộc', 'Mệnh', 'Thiên Di'],
    commonStars: ['Vũ Khúc', 'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Phá Quân'],
    faq: [
      {
        q: 'Tài Bạch yếu nghĩa là tôi sẽ nghèo?',
        a: 'Không. Tài Bạch yếu thường nói về phong cách quản lý tiền — bạn dễ tiêu tuỳ hứng hơn, hoặc thu nhập không đều. Người Tài Bạch yếu nhưng kỷ luật vẫn tích luỹ tốt; người Tài Bạch mạnh nhưng phóng khoáng vẫn có thể không có dư.',
      },
    ],
  },
  {
    slug: 'cung-tu-tuc',
    name: 'Tử Tức',
    fullName: 'Cung Tử Tức (子息宮)',
    domain: 'Con cái, sáng tạo, sản phẩm cá nhân',
    overview:
      'Cung Tử Tức truyền thống nói về con cái — nhưng trong cách đọc hiện đại, nó cũng đại diện cho "sản phẩm sáng tạo" của bạn: dự án, sản phẩm, ý tưởng để lại.',
    whatItRepresents: [
      'Quan hệ với con cái (nếu có).',
      'Khả năng sáng tạo — sản phẩm, dự án dài hạn.',
      'Cách bạn nuôi dưỡng "thứ gì đó" đến trưởng thành.',
    ],
    howToRead: [
      'Cát + Tử Tức mạnh → con cái thuận hoà hoặc dự án dài hạn dễ thành.',
      'Sát tinh → có thể có "khó khăn ban đầu" — cần kiên nhẫn.',
    ],
    trigon: ['Tử Tức', 'Điền Trạch', 'Nô Bộc', 'Huynh Đệ'],
    commonStars: ['Thiên Đồng', 'Tham Lang', 'Cự Môn'],
    faq: [],
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
      'KHÔNG dùng cung Phu Thê để kết luận "có nên chia tay hay không" — quyết định đó cần dữ kiện đời thực + tham vấn người chuyên môn.',
    ],
    trigon: ['Phu Thê', 'Phúc Đức', 'Tật Ách', 'Quan Lộc'],
    commonStars: ['Thái Âm', 'Thiên Đồng', 'Thiên Lương', 'Liêm Trinh'],
    faq: [
      {
        q: 'Cung Phu Thê xấu nghĩa là tôi không có duyên hôn nhân?',
        a: 'Không. Phu Thê "xấu" thường nói về kiểu quan hệ DỄ GẶP — ví dụ dễ vướng người không đồng tần số. Nhận ra khuynh hướng là bước đầu để chọn người phù hợp hơn. Nhiều người có Phu Thê khó vẫn có hôn nhân hạnh phúc khi học được cách giao tiếp.',
      },
    ],
  },
  {
    slug: 'cung-huynh-de',
    name: 'Huynh Đệ',
    fullName: 'Cung Huynh Đệ (兄弟宮)',
    domain: 'Anh chị em, bạn thân, cộng sự gần',
    overview:
      'Cung Huynh Đệ đại diện cho anh chị em ruột, bạn thân, và những người "đồng cấp" trong cuộc sống — khác Nô Bộc (mạng lưới rộng) và khác Phụ Mẫu (người trên).',
    whatItRepresents: [
      'Quan hệ với anh chị em ruột.',
      'Số lượng và chất lượng bạn thân.',
      'Khả năng hợp tác với cộng sự ngang vai.',
    ],
    howToRead: [
      'Huynh Đệ mạnh + Cát → có bạn thân hỗ trợ.',
      'Sát tinh → dễ va chạm hoặc khoảng cách với anh chị em.',
    ],
    trigon: ['Huynh Đệ', 'Nô Bộc', 'Tử Tức', 'Điền Trạch'],
    commonStars: ['Thiên Cơ', 'Thái Âm', 'Cự Môn'],
    faq: [],
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
    archetype: 'Đế tinh — sao của lãnh đạo, ổn định, danh dự.',
    positive: [
      'Có khả năng lãnh đạo, được người khác kính trọng.',
      'Quyết định có chiều sâu, không vội vàng.',
      'Tự trọng cao, giữ chữ tín.',
    ],
    caution: [
      'Dễ cô đơn nếu giữ khoảng cách quá lớn.',
      'Có thể trở nên cứng khi không có Tả Hữu/Khôi Việt hỗ trợ.',
      '"Tử Vi nhập tù" (gặp sát tinh nặng) cần thận trọng.',
    ],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người có khuynh hướng lãnh đạo, tự trọng cao, ổn định trong khủng hoảng.' },
      { palace: 'Quan Lộc', reading: 'Hợp vai trò quản lý, chuyên gia có thẩm quyền, dễ thăng tiến chậm nhưng chắc.' },
      { palace: 'Tài Bạch', reading: 'Quản lý tiền có nguyên tắc, không phóng tay, ưu tiên ổn định hơn lợi nhuận cao.' },
      { palace: 'Phu Thê', reading: 'Cần người bạn đời tôn trọng và độc lập; không hợp người ràng buộc.' },
    ],
    withMutagen: [
      { type: 'Quyền', reading: 'Tử Vi Hoá Quyền tăng uy lực và năng lực ra quyết định — vai trò quản lý cấp cao.' },
      { type: 'Khoa', reading: 'Tử Vi Hoá Khoa cho danh tiếng tốt, hợp các vai trò mentor / chuyên gia.' },
    ],
  },
  {
    slug: 'thien-co',
    name: 'Thiên Cơ',
    category: 'major',
    archetype: 'Sao của trí tuệ, linh hoạt và thay đổi.',
    positive: ['Thông minh, học nhanh.', 'Phản ứng linh hoạt, hợp môi trường biến động.'],
    caution: ['Dễ thay đổi, thiếu kiên nhẫn.', 'Suy nghĩ quá nhiều dễ căng thẳng.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người thông minh, ưa biến đổi; cần ổn định để không bị phân tán.' },
      { palace: 'Quan Lộc', reading: 'Hợp công việc đa nhiệm, tư vấn, công nghệ, truyền thông.' },
    ],
  },
  {
    slug: 'thai-duong',
    name: 'Thái Dương',
    category: 'major',
    archetype: 'Dương tinh — năng lượng, danh tiếng, sự hiện diện.',
    positive: ['Nhiệt huyết, có sức ảnh hưởng.', 'Hợp với vai trò công khai, lãnh đạo cộng đồng.'],
    caution: ['Dễ kiệt sức.', 'Khi "hãm" (Thái Dương ban đêm/đông) cần học nghỉ ngơi.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người năng động, có khả năng truyền cảm hứng.' },
      { palace: 'Quan Lộc', reading: 'Hợp vai trò công khai, giảng dạy, marketing, lãnh đạo.' },
    ],
  },
  {
    slug: 'vu-khuc',
    name: 'Vũ Khúc',
    category: 'major',
    archetype: 'Tài tinh — kỷ luật, quyết liệt, tinh thần "kim".',
    positive: ['Có kỷ luật tài chính tốt.', 'Quyết đoán trong quyết định kinh doanh.'],
    caution: ['Có thể cứng nhắc.', 'Khi gặp sát tinh, dễ căng thẳng vì tiền.'],
    byPalace: [
      { palace: 'Tài Bạch', reading: 'Quản lý tiền có hệ thống, dễ tích luỹ qua chuyên môn.' },
      { palace: 'Quan Lộc', reading: 'Hợp ngành tài chính, kế toán, kỹ sư, nghề có chuẩn mực rõ.' },
    ],
  },
  {
    slug: 'thien-dong',
    name: 'Thiên Đồng',
    category: 'major',
    archetype: 'Phúc tinh — hoà hảo, hưởng thụ, dễ chịu.',
    positive: ['Tâm tính ôn hoà, dễ kết bạn.', 'Khả năng tận hưởng cuộc sống.'],
    caution: ['Có thể quá dễ dãi với bản thân.', 'Thiếu động lực phấn đấu nếu không có Cát mạnh.'],
    byPalace: [
      { palace: 'Phúc Đức', reading: 'Tâm thái thanh thản, ít stress hệ thống.' },
      { palace: 'Phu Thê', reading: 'Quan hệ hôn nhân êm đềm khi đối phương hợp tần số.' },
    ],
  },
  {
    slug: 'liem-trinh',
    name: 'Liêm Trinh',
    category: 'major',
    archetype: 'Sao của kỷ luật + đam mê, có "hai mặt".',
    positive: ['Có kỷ luật cao, theo đuổi mục tiêu lâu dài.', 'Phù hợp công việc có chuẩn mực nghiêm.'],
    caution: ['Áp lực nội tâm cao.', 'Khi gặp Tham Lang hoặc Hoá Kỵ, dễ căng thẳng cá nhân.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người có hai mặt: phần kỷ luật + phần đam mê. Cần biết cân bằng.' },
    ],
  },
  {
    slug: 'thien-phu',
    name: 'Thiên Phủ',
    category: 'major',
    archetype: 'Khố tinh — tích luỹ, ổn định, "thủ quỹ".',
    positive: ['Khả năng tích luỹ tài sản.', 'Cẩn trọng, ít rủi ro.'],
    caution: ['Có thể quá thủ thân, bỏ lỡ cơ hội.', 'Khó thay đổi khi cần.'],
    byPalace: [
      { palace: 'Tài Bạch', reading: 'Tích luỹ ổn định, hợp người làm chuyên môn dài hạn.' },
    ],
  },
  {
    slug: 'thai-am',
    name: 'Thái Âm',
    category: 'major',
    archetype: 'Âm tinh — nội tâm, gia đạo, tế nhị.',
    positive: ['Nhạy cảm với cảm xúc người khác.', 'Hợp công việc cần sự tinh tế.'],
    caution: ['Dễ buồn rầu, suy nghĩ nhiều.', 'Cần học bộc lộ cảm xúc.'],
    byPalace: [
      { palace: 'Phu Thê', reading: 'Trân trọng quan hệ thân mật, cần đối phương biết lắng nghe.' },
      { palace: 'Tài Bạch', reading: 'Tiền tích luỹ từ từ, thường qua bất động sản hoặc tài sản gia đình.' },
    ],
  },
  {
    slug: 'tham-lang',
    name: 'Tham Lang',
    category: 'major',
    archetype: 'Đào hoa + tham vọng + thay đổi.',
    positive: ['Năng lượng cao, sức quyến rũ.', 'Tham vọng lớn, sẵn sàng học mới.'],
    caution: ['Dễ phân tán.', 'Cần thận trọng với "đào hoa quá vượng" — quan hệ phức tạp.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người đa năng, học nhanh, có sức hút.' },
    ],
  },
  {
    slug: 'cu-mon',
    name: 'Cự Môn',
    category: 'major',
    archetype: 'Sao của lời nói, phân tích, tranh luận.',
    positive: ['Khả năng phân tích sắc bén.', 'Hợp công việc dùng lời nói: luật sư, giảng dạy, viết.'],
    caution: ['Dễ nói nhiều, dễ mâu thuẫn nếu không kiểm soát.', 'Khi gặp Hoá Kỵ, dễ vướng "khẩu thiệt".'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Hợp nghề dùng ngôn ngữ — luật, báo chí, giảng dạy.' },
    ],
  },
  {
    slug: 'thien-tuong',
    name: 'Thiên Tướng',
    category: 'major',
    archetype: 'Phụ tá — trung thành, tham mưu, hỗ trợ.',
    positive: ['Trung thành, có trách nhiệm.', 'Hợp vai trò tham mưu / số 2.'],
    caution: ['Có thể thiếu tự chủ.', 'Cần học ra quyết định độc lập.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Hợp vai trò chief of staff, COO, trợ lý cấp cao.' },
    ],
  },
  {
    slug: 'thien-luong',
    name: 'Thiên Lương',
    category: 'major',
    archetype: 'Trưởng thượng — đạo đức, từ thiện, mentoring.',
    positive: ['Có đạo đức cao.', 'Hợp công việc giúp đỡ, giáo dục, y tế.'],
    caution: ['Có thể "lo việc thiên hạ" quên việc nhà.', 'Cần học nói không.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người có khuynh hướng giúp đỡ — cần cân bằng giữa cho và giữ.' },
    ],
  },
  {
    slug: 'that-sat',
    name: 'Thất Sát',
    category: 'major',
    archetype: 'Quyết liệt, đột phá, không sợ thay đổi.',
    positive: ['Năng lực ra quyết định nhanh.', 'Khả năng vượt khủng hoảng.'],
    caution: ['Dễ va đập.', 'Cần học nhẫn nại trong việc lâu dài.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người mạnh mẽ, hợp môi trường cạnh tranh.' },
    ],
  },
  {
    slug: 'pha-quan',
    name: 'Phá Quân',
    category: 'major',
    archetype: 'Phá cách — đổi mới, mạo hiểm, làm lại từ đầu.',
    positive: ['Khả năng khởi tạo mới.', 'Không ngại bỏ cái cũ.'],
    caution: ['Dễ phá rồi không xây.', 'Cần học hoàn thiện.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người ưa thay đổi, hợp startup hoặc nghề chuyển đổi liên tục.' },
    ],
  },
];

// ============================================================================
// Auxiliary stars (phụ tinh / sao bổ trợ) — top 10 most-asked
// ============================================================================

export const AUX_STARS_CONTENT: StarContent[] = [
  {
    slug: 'ta-phu',
    name: 'Tả Phụ',
    category: 'aux',
    archetype: 'Sao trợ tinh — người hỗ trợ, đồng minh.',
    positive: ['Có quý nhân hỗ trợ trong sự nghiệp.', 'Khả năng làm việc nhóm tốt.'],
    caution: ['Cần học tự đứng vững khi không có Tả Phụ ở đại vận.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người dễ có quý nhân, có sức hỗ trợ tự nhiên.' },
      { palace: 'Quan Lộc', reading: 'Hợp vai trò có team support, không hợp solo.' },
    ],
  },
  {
    slug: 'huu-bat',
    name: 'Hữu Bật',
    category: 'aux',
    archetype: 'Sao trợ tinh — cặp với Tả Phụ, hỗ trợ từ phía nữ/bạn.',
    positive: ['Có người hỗ trợ về cảm xúc và tinh thần.', 'Quan hệ mạng lưới rộng.'],
    caution: ['Khi xa Tả Phụ, có thể cảm thấy cô đơn dù được giúp đỡ.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Tâm tính ấm áp, dễ kết bạn.' },
      { palace: 'Phu Thê', reading: 'Hôn nhân có hỗ trợ từ bạn bè, gia đình hai bên.' },
    ],
  },
  {
    slug: 'van-xuong',
    name: 'Văn Xương',
    category: 'aux',
    archetype: 'Văn tinh — học vấn, viết lách, văn chương.',
    positive: ['Khả năng viết và diễn đạt tốt.', 'Hợp công việc trí thức.'],
    caution: ['Khi gặp Hoá Kỵ, dễ vướng giấy tờ, hợp đồng.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người ưa đọc, viết, suy ngẫm.' },
      { palace: 'Quan Lộc', reading: 'Hợp ngành giáo dục, xuất bản, truyền thông.' },
    ],
  },
  {
    slug: 'van-khuc',
    name: 'Văn Khúc',
    category: 'aux',
    archetype: 'Văn tinh — nghệ thuật, lời nói, biểu diễn.',
    positive: ['Khả năng diễn đạt qua nghệ thuật.', 'Hợp công việc cần sự sáng tạo.'],
    caution: ['Cảm xúc dễ thay đổi.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người có tâm hồn nghệ sĩ.' },
      { palace: 'Quan Lộc', reading: 'Hợp nghệ thuật, ca hát, biểu diễn, sáng tạo nội dung.' },
    ],
  },
  {
    slug: 'khoi-viet',
    name: 'Thiên Khôi - Thiên Việt',
    category: 'aux',
    archetype: 'Quý nhân tinh — gặp người trên đỡ đầu.',
    positive: ['Có quý nhân lớn tuổi hỗ trợ.', 'Hợp được mentor có thẩm quyền.'],
    caution: ['Cần giữ thái độ khiêm tốn để giữ quý nhân.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Đời thường có người trên giúp ở các bước ngoặt.' },
    ],
  },
  {
    slug: 'loc-ton',
    name: 'Lộc Tồn',
    category: 'aux',
    archetype: 'Tài tinh — tích luỹ, dòng tiền ổn định.',
    positive: ['Tích luỹ tài chính qua chuyên môn.', 'Khả năng quản lý tiền dài hạn.'],
    caution: ['Có thể quá thận trọng, bỏ lỡ cơ hội tăng trưởng.'],
    byPalace: [
      { palace: 'Tài Bạch', reading: 'Tiền vào đều, hợp tiết kiệm và bảo toàn vốn.' },
    ],
  },
  {
    slug: 'kinh-da',
    name: 'Kình Dương - Đà La',
    category: 'aux',
    archetype: 'Sát tinh nhẹ — áp lực, mâu thuẫn, "gai trong vận".',
    positive: ['Tăng động lực trong khủng hoảng.', 'Hợp công việc cạnh tranh.'],
    caution: ['Dễ vướng tranh chấp.', 'Cần kiểm soát phản ứng dưới áp lực.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người có phần "lửa" trong tính cách — cần kênh hợp để xả.' },
      { palace: 'Tật Ách', reading: 'Cẩn trọng thương tích, không phải dự báo bệnh nặng.' },
    ],
  },
  {
    slug: 'hoa-linh',
    name: 'Hỏa Tinh - Linh Tinh',
    category: 'aux',
    archetype: 'Sát tinh — biến động đột ngột.',
    positive: ['Khả năng phản ứng nhanh.', 'Hợp ngành thay đổi liên tục.'],
    caution: ['Quyết định bốc đồng dễ tốn tiền.', 'Cần học suy nghĩ trước khi hành động.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người có năng lượng cao, ưa đột phá.' },
    ],
  },
  {
    slug: 'hoa-loc',
    name: 'Hoá Lộc',
    category: 'aux',
    archetype: 'Tứ hoá — Lộc (tài lộc, cơ hội).',
    positive: ['Năm có Hoá Lộc thường có cơ hội tài chính + nghề mới.', 'Hợp đẩy sự nghiệp.'],
    caution: ['Cơ hội nhiều nhưng cần kỷ luật để giữ.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Năm thuận cho thăng tiến, mở rộng vai trò.' },
      { palace: 'Tài Bạch', reading: 'Năm dòng tiền tốt, hợp tích luỹ.' },
    ],
  },
  {
    slug: 'hoa-ky',
    name: 'Hoá Kỵ',
    category: 'aux',
    archetype: 'Tứ hoá — Kỵ (vướng mắc, cần chú ý).',
    positive: ['Là tín hiệu cảnh báo — ai biết đọc thì tránh được tổn thất.', 'Tăng động lực rèn luyện.'],
    caution: ['Không phải "đời mạt vận" — là chủ đề cần xử lý trong năm/giai đoạn đó.', 'Cẩn trọng quyết định lớn khi Hoá Kỵ tại cung liên quan.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Năm có Hoá Kỵ tại Mệnh — chủ đề chính là "tự nhìn lại". Không hợp mở rộng vội.' },
      { palace: 'Tài Bạch', reading: 'Năm cần kỷ luật tài chính cao — tránh leverage.' },
      { palace: 'Phu Thê', reading: 'Năm cần giao tiếp kỳ vọng rõ — dễ hiểu lầm trong quan hệ.' },
    ],
  },
];

export const ALL_STARS_CONTENT: StarContent[] = [...MAJOR_STARS_CONTENT, ...AUX_STARS_CONTENT];

export function findStarContent(slug: string): StarContent | undefined {
  return ALL_STARS_CONTENT.find((s) => s.slug === slug);
}
