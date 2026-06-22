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
    trigon: ['Phụ Mẫu', 'Tử Tức', 'Nô Bộc', 'Tật Ách'],
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
    trigon: ['Phúc Đức', 'Phu Thê', 'Thiên Di', 'Tài Bạch'],
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
    trigon: ['Điền Trạch', 'Huynh Đệ', 'Tật Ách', 'Tử Tức'],
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
    trigon: ['Nô Bộc', 'Tử Tức', 'Phụ Mẫu', 'Huynh Đệ'],
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
    trigon: ['Thiên Di', 'Phu Thê', 'Phúc Đức', 'Mệnh'],
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
    trigon: ['Tật Ách', 'Huynh Đệ', 'Điền Trạch', 'Phụ Mẫu'],
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
    trigon: ['Tài Bạch', 'Mệnh', 'Quan Lộc', 'Phúc Đức'],
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
    trigon: ['Tử Tức', 'Nô Bộc', 'Phụ Mẫu', 'Điền Trạch'],
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
    trigon: ['Phu Thê', 'Thiên Di', 'Phúc Đức', 'Quan Lộc'],
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
    trigon: ['Huynh Đệ', 'Tật Ách', 'Điền Trạch', 'Nô Bộc'],
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
      { palace: 'Quan Lộc', reading: 'Hợp ngành đòi hỏi chuẩn mực cao: kỹ thuật, tài chính, quản trị, hành chính.' },
      { palace: 'Tài Bạch', reading: 'Tiền đến từ chuyên môn và bền bỉ; tránh kiểu "được ăn cả" cảm tính.' },
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
      { palace: 'Mệnh', reading: 'Người điềm đạm, biết giữ, tạo cảm giác an toàn cho người quanh mình.' },
      { palace: 'Điền Trạch', reading: 'Hợp tích sản, nhà cửa; của cải giữ được lâu, ít hao hụt.' },
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
      { palace: 'Quan Lộc', reading: 'Hợp nghề cần giao tiếp, ngoại giao, sáng tạo, làm nhiều mảng.' },
      { palace: 'Phu Thê', reading: 'Đời sống tình cảm phong phú; cần rõ ràng, chừng mực để bền lâu.' },
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
      { palace: 'Mệnh', reading: 'Người lý lẽ, hay đặt câu hỏi; thuyết phục tốt nhưng nên tiết chế lời.' },
      { palace: 'Phu Thê', reading: 'Dễ hiểu lầm do lời nói — giao tiếp thẳng thắn, tránh "nói mát".' },
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
      { palace: 'Mệnh', reading: 'Người chỉn chu, trọng nghĩa, đáng tin; giỏi điều phối, dung hoà.' },
      { palace: 'Phu Thê', reading: 'Bạn đời hỗ trợ tốt; hợp vai "hậu phương" vững cho nhau.' },
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
      { palace: 'Quan Lộc', reading: 'Hợp y tế, giáo dục, pháp lý, tư vấn — nghề "chăm sóc người khác".' },
      { palace: 'Phúc Đức', reading: 'Phúc dày, hay gặp quý nhân lớn tuổi; tâm an khi giúp được người.' },
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
      { palace: 'Quan Lộc', reading: 'Hợp việc cần quyết đoán, chịu áp lực: quản lý, kinh doanh, kỹ thuật khó.' },
      { palace: 'Tài Bạch', reading: 'Tiền vào ra mạnh; nên có kỷ luật quản trị rủi ro, giữ quỹ dự phòng.' },
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
      { palace: 'Quan Lộc', reading: 'Hợp khởi nghiệp, tái cấu trúc, nghề đổi mới; ít hợp việc lặp đều đặn.' },
      { palace: 'Phu Thê', reading: 'Quan hệ nhiều biến chuyển; cần chủ động vun đắp sự ổn định.' },
    ],
  },
];

// ============================================================================
// Auxiliary stars (phụ tinh / sao bổ trợ) — top 10 most-asked
// ============================================================================

export const AUX_STARS_CONTENT: StarContent[] = [
  {
    slug: 'thien-ma',
    name: 'Thiên Mã',
    category: 'aux',
    archetype: 'Sao dịch mã — di chuyển, thay đổi, cơ hội ở phương xa.',
    positive: [
      'Năng động, thích nghi nhanh với môi trường mới.',
      'Hợp công việc đi lại, xê dịch, kết nối nhiều nơi.',
    ],
    caution: [
      'Dễ thiếu ổn định nếu thay đổi quá nhiều — nên chọn điểm dừng đúng lúc.',
    ],
    byPalace: [
      { palace: 'Thiên Di', reading: 'Đi xa hay đổi môi trường thường mở ra cơ hội; hợp lập nghiệp ngoài quê.' },
      { palace: 'Mệnh', reading: 'Tính hiếu động, ưa trải nghiệm, khó ngồi yên một chỗ.' },
      { palace: 'Tài Bạch', reading: 'Tiền tài gắn với di chuyển; gặp Lộc Tồn (Lộc Mã) thì dòng tiền theo bước chân.' },
    ],
  },
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
  {
    slug: 'dia-khong-kiep',
    name: 'Địa Không - Địa Kiếp',
    category: 'aux',
    archetype: 'Cặp sát tinh — phá cách, tư duy khác thường, dễ hao hụt vật chất.',
    positive: [
      'Tư duy đột phá, không theo lối mòn — hợp sáng tạo, nghiên cứu, tâm linh.',
      'Trải nghiệm mất mát sớm giúp trưởng thành về tinh thần.',
    ],
    caution: [
      'Tài chính dễ vào ra thất thường — nên tránh đầu cơ, vay đòn bẩy lớn.',
      'Là lực "phá để làm mới", KHÔNG phải điềm xui cố định.',
    ],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người nghĩ khác số đông, hợp con đường phi truyền thống.' },
      { palace: 'Tài Bạch', reading: 'Tiền hợp với chuyên môn/sáng tạo hơn là buôn bán đầu cơ.' },
    ],
  },
  {
    slug: 'hoa-quyen',
    name: 'Hoá Quyền',
    category: 'aux',
    archetype: 'Tứ hoá — Quyền (năng lực, quyền hành, làm chủ).',
    positive: [
      'Tăng khả năng nắm việc, ra quyết định, dẫn dắt.',
      'Giai đoạn hợp nhận thêm trách nhiệm, mở rộng tầm ảnh hưởng.',
    ],
    caution: ['Dễ ôm việc, cứng nhắc hoặc áp đặt — cần học uỷ quyền.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Giai đoạn thăng tiến, hợp vai trò quản lý, chủ động đề xuất.' },
      { palace: 'Mệnh', reading: 'Khí chất mạnh lên, dám đứng mũi chịu sào.' },
    ],
  },
  {
    slug: 'hoa-khoa',
    name: 'Hoá Khoa',
    category: 'aux',
    archetype: 'Tứ hoá — Khoa (danh tiếng, học vấn, quý nhân ngầm).',
    positive: [
      'Hợp thi cử, học hành, xây dựng uy tín và hình ảnh.',
      'Có quý nhân nhẹ nhàng giúp đỡ, tiếng lành đồn xa.',
    ],
    caution: ['Trợ lực vừa phải — danh tốt nhưng không đẩy mạnh tài lộc trực tiếp.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Hợp việc cần uy tín, chuyên môn, bằng cấp.' },
      { palace: 'Mệnh', reading: 'Phong thái nhã nhặn, dễ được tin tưởng.' },
    ],
  },
  {
    slug: 'dao-hoa',
    name: 'Đào Hoa',
    category: 'aux',
    archetype: 'Sao đào hoa — sức hút, duyên dáng, quan hệ xã hội.',
    positive: [
      'Có sức hút tự nhiên, dễ gây thiện cảm — hợp nghề giao tiếp, biểu diễn.',
      'Đời sống tình cảm và xã hội phong phú.',
    ],
    caution: ['Nhiều mối quan tâm dễ phân tâm — cần rõ ràng, chừng mực trong quan hệ.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người duyên dáng, ăn nói có sức cuốn.' },
      { palace: 'Phu Thê', reading: 'Tình duyên sôi nổi; hợp chủ động vun đắp sự chung thuỷ.' },
    ],
  },
  {
    slug: 'hong-loan-thien-hy',
    name: 'Hồng Loan - Thiên Hỷ',
    category: 'aux',
    archetype: 'Cặp hỷ tinh — tình duyên, cưới hỏi, tin vui.',
    positive: [
      'Báo hiệu các dịp vui: cưới hỏi, gặp gỡ, gắn kết.',
      'Tâm tính ấm áp, dễ mến.',
    ],
    caution: ['Là tín hiệu thời điểm thuận, không thay cho việc chủ động xây dựng quan hệ.'],
    byPalace: [
      { palace: 'Phu Thê', reading: 'Giai đoạn thuận cho chuyện tình cảm tiến triển, kết đôi.' },
      { palace: 'Mệnh', reading: 'Người vui vẻ, lạc quan, thu hút thiện cảm.' },
    ],
  },
  {
    slug: 'long-tri-phuong-cac',
    name: 'Long Trì - Phượng Các',
    category: 'aux',
    archetype: 'Cặp quý tinh — tài hoa, thanh nhã, khoa bảng.',
    positive: [
      'Gu thẩm mỹ tốt — hợp nghệ thuật, học thuật, công việc tinh tế.',
      'Phong thái lịch thiệp, được nể trọng.',
    ],
    caution: ['Chuộng cái đẹp/hình thức — nên cân bằng với thực tế.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Hợp ngành đòi hỏi thẩm mỹ, chuyên môn cao, hình ảnh.' },
      { palace: 'Mệnh', reading: 'Người nhã nhặn, ưa sự chỉn chu, tinh tế.' },
    ],
  },
  {
    slug: 'thien-khoc-thien-hu',
    name: 'Thiên Khốc - Thiên Hư',
    category: 'aux',
    archetype: 'Cặp sao u tịch — nhạy cảm, hoài niệm, cảm giác thiếu hụt.',
    positive: [
      'Chiều sâu nội tâm, đồng cảm tốt — hợp việc cần sự tinh tế cảm xúc.',
      'Biết trân trọng điều mình có khi vượt qua cảm giác trống trải.',
    ],
    caution: ['Dễ lo nghĩ, hoài cổ — nên nuôi dưỡng kết nối và lối sống tích cực.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Tâm hồn sâu sắc, đôi khi đa cảm.' },
      { palace: 'Phúc Đức', reading: 'Cần chủ động chăm sóc đời sống tinh thần.' },
    ],
  },
  {
    slug: 'co-than-qua-tu',
    name: 'Cô Thần - Quả Tú',
    category: 'aux',
    archetype: 'Cặp sao cô độc — độc lập, thích riêng tư, có khoảng cách trong quan hệ.',
    positive: [
      'Tự chủ, làm việc độc lập tốt, không phụ thuộc đám đông.',
      'Hợp công việc cần tập trung, chuyên sâu.',
    ],
    caution: ['Dễ thu mình — nên chủ động giữ kết nối với người thân.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Tính tự lập cao, thích không gian riêng.' },
      { palace: 'Phu Thê', reading: 'Cần chủ động vun đắp gần gũi, tránh "ai việc nấy".' },
    ],
  },
  {
    slug: 'thien-hinh',
    name: 'Thiên Hình',
    category: 'aux',
    archetype: 'Sao kỷ luật — nguyên tắc, sắc bén, ưa công lý.',
    positive: [
      'Kỷ luật, quyết đoán — hợp ngành luật, y, kỹ thuật, quân đội.',
      'Giữ nguyên tắc tốt, làm việc dứt khoát.',
    ],
    caution: ['Dễ khắt khe với mình và người — cần thêm sự mềm mỏng.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Hợp nghề cần kỷ luật và độ chính xác cao.' },
      { palace: 'Mệnh', reading: 'Người cương trực, rạch ròi đúng sai.' },
    ],
  },
  {
    slug: 'thien-rieu',
    name: 'Thiên Riêu',
    category: 'aux',
    archetype: 'Sao đa tình — quyến rũ, nhạy bén tâm lý, chiều sâu cảm xúc.',
    positive: [
      'Tinh tế, có sức hút riêng, nhạy với tâm lý người khác.',
      'Hợp công việc cần thấu hiểu con người.',
    ],
    caution: ['Dễ sa vào cảm xúc/cám dỗ — cần ranh giới rõ ràng.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người có chiều sâu, đôi khi bí ẩn, đa cảm.' },
      { palace: 'Phu Thê', reading: 'Đời sống tình cảm nhiều sắc thái; nên minh bạch.' },
    ],
  },
  {
    slug: 'tam-thai-bat-toa',
    name: 'Tam Thai - Bát Tọa',
    category: 'aux',
    archetype: 'Cặp quý tinh — địa vị, chỗ đứng, được nâng đỡ.',
    positive: [
      'Tăng uy tín, vị thế; dễ được cấp trên/tập thể ghi nhận.',
      'Hợp vai trò có danh phận, đại diện, quản lý.',
    ],
    caution: ['Vị thế đi kèm trách nhiệm — giữ thực lực tương xứng với danh.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Hợp thăng tiến, đảm nhận vị trí có tiếng nói.' },
      { palace: 'Mệnh', reading: 'Phong thái đĩnh đạc, được nể trọng.' },
    ],
  },
  {
    slug: 'an-quang-thien-quy',
    name: 'Ân Quang - Thiên Quý',
    category: 'aux',
    archetype: 'Cặp quý tinh — vinh dự, được ghi nhận, khoa danh.',
    positive: [
      'Hợp thi cử, được công nhận, có phần thưởng/ghi danh.',
      'Quý nhân ngầm nâng đỡ đúng lúc.',
    ],
    caution: ['Vinh dự đến từ tích luỹ thật — không trông chờ may rủi.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Hợp môi trường trọng bằng cấp, thành tích.' },
      { palace: 'Mệnh', reading: 'Dễ được tin tưởng, giao việc quan trọng.' },
    ],
  },
  {
    slug: 'hoa-cai',
    name: 'Hoa Cái',
    category: 'aux',
    archetype: 'Sao nghệ thuật — tài hoa, thiên hướng tâm linh, có phần cô cao.',
    positive: [
      'Năng khiếu nghệ thuật, triết lý, tôn giáo; gu riêng độc đáo.',
      'Khả năng tập trung sâu, làm việc một mình tốt.',
    ],
    caution: ['Hơi kiêu, dễ thấy lạc lõng giữa đám đông — nên giữ kết nối.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người có cá tính, thiên hướng nghệ thuật/tâm linh.' },
      { palace: 'Phúc Đức', reading: 'Đời sống tinh thần phong phú, ưa chiêm nghiệm.' },
    ],
  },
  {
    slug: 'tang-mon-bach-ho',
    name: 'Tang Môn - Bạch Hổ',
    category: 'aux',
    archetype: 'Cặp sao vòng Thái Tuế — chủ đề buồn phiền, va chạm, cần thận trọng theo giai đoạn.',
    positive: [
      'Là tín hiệu "năm cần giữ gìn" — biết trước thì chủ động phòng bị.',
      'Gắn với giai đoạn, KHÔNG phải bản tính cố định.',
    ],
    caution: [
      'Năm gặp: chú ý sức khoẻ người thân, tránh tranh chấp, đi lại cẩn thận.',
      'KHÔNG phải "điềm gở" — chỉ là nhắc nhở thận trọng, không nên hoảng.',
    ],
    byPalace: [
      { palace: 'Mệnh', reading: 'Năm/đại vận có: ưu tiên giữ sức khoẻ và hoà khí.' },
      { palace: 'Tật Ách', reading: 'Nhắc kiểm tra sức khoẻ định kỳ, đề phòng va chạm nhỏ.' },
    ],
  },
  {
    slug: 'quan-phu',
    name: 'Quan Phù',
    category: 'aux',
    archetype: 'Sao vòng Thái Tuế — giấy tờ, kiện tụng, chuyện hành chính.',
    positive: [
      'Nhắc rà soát hợp đồng, giấy tờ kỹ — tránh sơ suất pháp lý.',
      'Biết trước thì xử lý thủ tục gọn gàng.',
    ],
    caution: ['Năm gặp: cẩn trọng ký kết, đọc kỹ trước khi đặt bút, tránh vướng tranh chấp.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Chú ý hợp đồng, quy định công việc trong giai đoạn này.' },
      { palace: 'Mệnh', reading: 'Năm hợp làm gì cũng rõ ràng văn bản, minh bạch.' },
    ],
  },
  {
    slug: 'thien-quan-thien-phuc',
    name: 'Thiên Quan - Thiên Phúc',
    category: 'aux',
    archetype: 'Cặp phúc tinh — che chở, phúc khí, hoá giải khó khăn.',
    positive: [
      'Gặp khó dễ có chỗ dựa, "gặp dữ hoá lành".',
      'Tăng phúc đức, hay gặp may đúng lúc ngặt.',
    ],
    caution: ['Phúc là nền — vẫn cần nỗ lực thật để thành kết quả.'],
    byPalace: [
      { palace: 'Phúc Đức', reading: 'Phúc khí dày, tâm an, hậu vận êm.' },
      { palace: 'Mệnh', reading: 'Người hiền lành, hay được giúp lúc khó.' },
    ],
  },
  {
    slug: 'thien-duc-nguyet-duc',
    name: 'Thiên Đức - Nguyệt Đức',
    category: 'aux',
    archetype: 'Cặp đức tinh — đức độ, được phù trợ, giảm nhẹ trắc trở.',
    positive: [
      'Giảm bớt ảnh hưởng sao xấu cùng cung; gặp khó có người đỡ.',
      'Tâm thiện, sống có đức nên tích phúc.',
    ],
    caution: ['Là lực "giảm xóc", không phải bùa hộ mệnh — vẫn cần cẩn trọng.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Tính nhân hậu, hay làm việc thiện, được quý mến.' },
      { palace: 'Tật Ách', reading: 'Khi có hạn, thường gặp yếu tố giảm nhẹ.' },
    ],
  },
  {
    slug: 'kiep-sat',
    name: 'Kiếp Sát',
    category: 'aux',
    archetype: 'Sát tinh — biến động bất ngờ, hao tài hoặc thay đổi nhanh.',
    positive: [
      'Quyết đoán, phản ứng nhanh trước biến cố.',
      'Trải biến động giúp học cách phòng bị, quản trị rủi ro.',
    ],
    caution: [
      'Chú ý giữ tài sản, tránh quyết định vội khi cung liên quan có Kiếp Sát.',
      'Là lực "thay đổi đột ngột", KHÔNG phải định mệnh xui xẻo.',
    ],
    byPalace: [
      { palace: 'Tài Bạch', reading: 'Cẩn trọng dòng tiền, tránh đầu cơ, giữ quỹ dự phòng.' },
      { palace: 'Mệnh', reading: 'Cuộc đời nhiều khúc rẽ — bản lĩnh tôi luyện qua biến động.' },
    ],
  },
  {
    slug: 'tuan-triet',
    name: 'Tuần - Triệt',
    category: 'aux',
    archetype: 'Hai sao "không vong" — làm chậm/hoá giải cung chúng án ngữ; việc hay đến muộn hoặc đi đường vòng.',
    positive: [
      'Hoá giải bớt sao xấu ở cung bị án ngữ (cái xấu cũng "trống" theo).',
      'Hợp người "nở muộn" — thành quả đến sau nhưng bền.',
    ],
    caution: [
      'Cung bị Tuần/Triệt thường phát muộn hoặc cần đi đường khác thường — đừng nóng vội.',
      'Là "khoảng lặng / đổi hướng", KHÔNG phải mất trắng.',
    ],
    byPalace: [
      { palace: 'Mệnh', reading: 'Hay "nở muộn"; tin vào hành trình dài, không so bì giai đoạn đầu.' },
      { palace: 'Quan Lộc', reading: 'Sự nghiệp lập muộn hoặc rẽ ngang rồi mới vững.' },
    ],
  },
  {
    slug: 'dai-hao-tieu-hao',
    name: 'Đại Hao - Tiểu Hao',
    category: 'aux',
    archetype: 'Cặp hao tinh — chi tiêu, hao tán, tiền ra nhiều.',
    positive: [
      'Biết trước thì lập kế hoạch chi tiêu, giữ quỹ dự phòng chủ động.',
      'Thường phóng khoáng, rộng rãi với người.',
    ],
    caution: [
      'Năm/cung gặp: rà soát ngân sách, tránh đầu tư bốc đồng.',
      'Là nhắc "giữ tiền", KHÔNG phải phá sản định sẵn.',
    ],
    byPalace: [
      { palace: 'Tài Bạch', reading: 'Dòng tiền ra vào lớn — quản trị chi tiêu là chìa khoá.' },
      { palace: 'Mệnh', reading: 'Tính phóng khoáng; hợp học kỷ luật tài chính sớm.' },
    ],
  },
  {
    slug: 'thai-phu-phong-cao',
    name: 'Thai Phụ - Phong Cáo',
    category: 'aux',
    archetype: 'Cặp quý tinh — bằng cấp, chức danh, giấy tờ vinh danh.',
    positive: [
      'Hỗ trợ thi cử, bổ nhiệm, được cấp "danh phận" chính thức.',
      'Tăng uy tín qua chứng chỉ, văn bằng.',
    ],
    caution: ['Danh đi cùng thực lực mới bền — đừng chuộng hình thức.'],
    byPalace: [
      { palace: 'Quan Lộc', reading: 'Thuận bổ nhiệm, thăng chức, được giao trọng trách có danh.' },
      { palace: 'Mệnh', reading: 'Hợp môi trường trọng bằng cấp, danh vị.' },
    ],
  },
  {
    slug: 'thien-tho-thien-tai',
    name: 'Thiên Thọ - Thiên Tài',
    category: 'aux',
    archetype: 'Cặp sao phúc — Thọ (sức bền, điềm đạm) + Tài (năng khiếu, lanh lợi).',
    positive: [
      'Thiên Thọ: bền sức, điều độ, nhẫn nại; Thiên Tài: nhạy bén, học nhanh.',
      'Hợp tích luỹ lâu dài và phát huy năng khiếu riêng.',
    ],
    caution: ['Tài cần mài thành kỹ năng thật; thọ cần lối sống lành mạnh đi kèm.'],
    byPalace: [
      { palace: 'Mệnh', reading: 'Người chín chắn hơn tuổi, có khiếu riêng đáng nuôi dưỡng.' },
      { palace: 'Phúc Đức', reading: 'Phúc thọ, tâm an; hợp lối sống điều độ.' },
    ],
  },
];

export const ALL_STARS_CONTENT: StarContent[] = [...MAJOR_STARS_CONTENT, ...AUX_STARS_CONTENT];

export function findStarContent(slug: string): StarContent | undefined {
  return ALL_STARS_CONTENT.find((s) => s.slug === slug);
}
