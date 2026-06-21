/**
 * Case studies — illustrative composite narratives (NOT real users).
 *
 * Each case is a worked example written to show how Tử Vi + Decision Brief
 * could be applied to a life decision. The personas, situations, charts and
 * reflections are composites authored to teach the process — they are not
 * accounts of identified real users, and there is no claim of consent.
 *
 * The `illustrative` flag must surface to readers in the UI label.
 */

export interface CaseStudy {
  slug: string;
  title: string;
  excerpt: string;
  /** Persona summary — a composite, not a real person. */
  persona: string;
  /** Year the example is set in. */
  year: number;
  /** What the chart highlighted — referenced to methodology, not prescription. */
  insight: string;
  /** The worked-through decision + the broad outcome in the example. */
  decision: string;
  /** Reflection written in-character for the example. */
  reflection: string;
  /** Methodology pages this case touches — for cross-link. */
  related: Array<{ href: string; label: string }>;
  /** Disclaimer: case studies illustrate process, not outcome guarantee. */
  publishedAt: string;
  /** Always true: this is an illustrative composite, not a real user. */
  illustrative: true;
  /** UI label that must be shown to readers. */
  illustrativeLabel: string;
}

/** Shared label so every case carries the same unambiguous wording. */
export const ILLUSTRATIVE_LABEL = 'Tình huống minh hoạ — không phải người dùng thật';

export const CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: 'tu-bo-cong-viec-on-dinh',
    title: 'Bỏ công việc ổn định để khởi nghiệp ở tuổi 28',
    excerpt:
      'T. đã làm 5 năm trong ngân hàng. Lá số chỉ ra Tài Bạch tốt nhưng Sự Nghiệp thiếu Hoá Quyền. Decision Brief giúp T. thấy: bài toán không phải "có nên đi" mà "đi với cấu trúc tài chính nào".',
    persona: 'Nữ, 28 tuổi, ngành tài chính, đã có 1 con nhỏ',
    year: 2025,
    insight:
      'Cung Tài Bạch của T. có Vũ Khúc + Tả Phù — đối ứng với phong cách quản lý tiền cẩn trọng + cần đồng đội. Cung Quan Lộc có Tử Vi nhưng thiếu Hoá Quyền, nghĩa là khả năng lãnh đạo mạnh nhưng dễ ngại bước đầu. Methodology /methodology/tu-vi giải thích chi tiết tổ hợp này.',
    decision:
      'T. không nghỉ ngay. T. lập kế hoạch 18 tháng: 6 tháng tích luỹ 12 tháng chi phí gia đình, 6 tháng làm song song dự án nhỏ buổi tối, 6 tháng cuối chuyển full-time khi dự án có doanh thu. Decision Brief giúp T. nhận ra: cấu trúc tài chính tốt là điều kiện đủ, không phải bài kiểm tra thái độ.',
    reflection:
      '"Trước đây tôi cứ nghĩ phải có dũng cảm mới bỏ việc. Sau khi đọc lá số tôi hiểu — dũng cảm của tôi nằm ở việc làm bài tập về nhà, không phải nhảy vực. Đó là cách tôi cảm thấy ổn nhất."',
    related: [
      { href: '/methodology/tu-vi', label: 'Methodology Tử Vi đầy đủ' },
      { href: '/tu-vi-nghe-nghiep', label: 'Lộ trình quyết định nghề nghiệp' },
      { href: '/decisions/new', label: 'Tạo Decision Brief cho quyết định của bạn' },
    ],
    publishedAt: '2026-03-08',
    illustrative: true,
    illustrativeLabel: ILLUSTRATIVE_LABEL,
  },
  {
    slug: 'chon-truong-cho-con-vao-cap-2',
    title: 'Chọn trường cấp 2 cho con — khi cha mẹ bất đồng',
    excerpt:
      'A. và chồng tranh cãi 3 tháng về việc cho con học trường công gần nhà hay trường tư xa hơn. Lá số con nói gì? Lá số cha mẹ nói gì về cách họ ra quyết định khi không đồng ý?',
    persona: 'Nữ, 36 tuổi, mẹ 2 con, đang sống ở TP.HCM',
    year: 2025,
    insight:
      'Lá số con (12 tuổi, cung Mệnh có Thiên Cơ + Cự Môn) → cần môi trường ổn định + thầy cô có khả năng đối thoại. Hai trường ứng viên không khác biệt lớn về chất lượng giảng dạy; khác biệt thực sự là khoảng cách + nhịp gia đình. Compatibility check (/compatibility) giữa A. và chồng cho thấy điểm va chạm chính là phong cách ra quyết định: A. cần data, chồng cần cảm giác.',
    decision:
      'A. và chồng dành 1 buổi tối làm Decision Brief CHUNG (không phải cho con — cho cách hai người quyết định). Sau đó họ chọn trường công gần nhà với lý do: tiết kiệm 2 tiếng đi lại = 2 tiếng cả nhà ăn tối cùng nhau. Quyết định không phải về trường, mà về nhịp gia đình họ muốn giữ.',
    reflection:
      '"Tử Vi không nói trường nào tốt hơn — nó giúp chúng tôi nhìn ra chúng tôi đang tranh cãi nhầm câu hỏi. Khi đổi câu hỏi, đáp án thành đơn giản."',
    related: [
      { href: '/compatibility', label: 'Hợp đôi 2 lá số' },
      { href: '/tu-vi-tinh-yeu', label: 'Lộ trình quyết định gia đình' },
      { href: '/methodology/tu-vi', label: 'Cung Phụ Mẫu trong Methodology' },
    ],
    publishedAt: '2026-02-18',
    illustrative: true,
    illustrativeLabel: ILLUSTRATIVE_LABEL,
  },
  {
    slug: 'doi-nghe-sau-30-tuoi',
    title: 'Đổi ngành nghề sau 30 — khi đam mê và tài chính cùng đói',
    excerpt:
      'M. làm developer 8 năm, muốn chuyển sang viết. Career Fit cho thấy điểm phù hợp 65 (không cao, không thấp). Bài học: career fit chỉ là một dữ liệu, không phải án quyết.',
    persona: 'Nam, 31 tuổi, kỹ sư phần mềm, sống một mình',
    year: 2026,
    insight:
      'Career Fit của M. cho ngành "viết / nội dung" = 65/100. Cung Sự Nghiệp có Thiên Đồng + Thái Âm — nhân từ + nhạy cảm, hợp ngành cần đồng cảm với người đọc. Cung Tài Bạch không đẹp — M. dễ chi tiêu cảm xúc khi stress. Methodology /methodology/algorithm-changelog mô tả cách Career Fit tính toán.',
    decision:
      'M. không nghỉ. M. dùng 90 ngày để: viết 1 bài/tuần trên blog cá nhân, tính thực tế chi phí sống 6 tháng nếu giảm thu nhập 50%, và quan trọng nhất — nói chuyện với 5 người đã chuyển ngành ở tuổi 30+ để hiểu họ chi tiêu cảm xúc thế nào. Sau 90 ngày, M. quyết định: viết là sở thích nghiêm túc, không phải nghề. M. ở lại engineering nhưng dành 6 giờ/tuần cho viết.',
    reflection:
      '"Tôi đã hoảng vì Career Fit chỉ 65. Sau đó tôi hiểu: 65 không phải điểm trượt, là điểm cần kế hoạch B. Khi tôi có kế hoạch B, tôi không cần đổi nghề — tôi cần đổi tỷ lệ thời gian."',
    related: [
      { href: '/career-fit', label: 'Career Fit công cụ' },
      { href: '/methodology/algorithm-changelog', label: 'Cách Career Fit tính điểm' },
      { href: '/tu-vi-nghe-nghiep', label: 'Lộ trình nghề nghiệp' },
    ],
    publishedAt: '2026-04-22',
    illustrative: true,
    illustrativeLabel: ILLUSTRATIVE_LABEL,
  },
  {
    slug: 'quan-he-vo-chong-ran-nut',
    title: 'Quan hệ vợ chồng có dấu hiệu rạn nứt — có nên ly hôn?',
    excerpt:
      'Sau 3 năm ngại đối diện vấn đề, T. gần như quyết định ly hôn. Lá số chỉ ra cung Phu Thê có Thiên Cơ + Hoá Kỵ — đối ứng hôn nhân nhiều biến động nhưng không tự nhiên đổ vỡ. Compatibility check với chồng cho thấy điểm va chạm chính: cách giải toả căng thẳng.',
    persona: 'Nữ, 42 tuổi, kế toán, 12 năm hôn nhân, 1 con tuổi teen',
    year: 2025,
    insight:
      'Cung Phu Thê (Thiên Cơ + Hoá Kỵ) — biến động cao, nhưng không phải mệnh "ly tán". Compatibility với chồng (Mộc + Kim) tương khắc về phong cách giao tiếp, không phải về giá trị cốt lõi. Methodology /methodology/tu-vi giải thích chi tiết.',
    decision:
      'T. không quyết định ngay. Dùng 60 ngày để: viết Decision Brief mỗi tuần về 1 va chạm cụ thể, đăng ký 1 phiên tư vấn cặp đôi, và quan trọng nhất — dừng tự đổ lỗi. Sau 60 ngày, T. + chồng quyết định không ly hôn nhưng đăng ký liệu trình counseling 6 tháng. 18 tháng sau, T. nói "vẫn có lúc khó, nhưng không còn nghĩ đến chuyện kết thúc."',
    reflection:
      '"Lá số không nói tôi nên ở hay đi. Nó cho tôi khung để hỏi câu đúng: \'Vấn đề là phong cách hay là giá trị?\' Khi rõ là phong cách, tôi mới dám chọn ở lại để thay đổi phong cách thay vì bỏ giá trị."',
    related: [
      { href: '/compatibility', label: 'Hợp đôi 2 lá số' },
      { href: '/tu-vi-tinh-yeu', label: 'Lộ trình quyết định gia đình' },
      { href: '/decisions/new', label: 'Tạo Decision Brief cho quyết định của bạn' },
      { href: '/methodology/tu-vi', label: 'Methodology Tử Vi đầy đủ' },
    ],
    publishedAt: '2026-04-05',
    illustrative: true,
    illustrativeLabel: ILLUSTRATIVE_LABEL,
  },
  {
    slug: 'dau-tu-bat-dong-san-dau-tien',
    title: 'Đầu tư bất động sản đầu tiên — có nên nhảy vào lúc thị trường đỉnh?',
    excerpt:
      'Sau 8 năm tích luỹ, M. gần như chốt mua căn hộ chung cư TP.HCM thì đại vận sắp chuyển. Lá số chỉ ra cung Tài Bạch + Điền Trạch — không hợp đầu tư BĐS chu kỳ ngắn. Decision Brief cùng tư vấn tài chính giúp M. nhìn ra: bài toán không phải mua hay không, mà là cho mục đích gì.',
    persona: 'Nam, 35 tuổi, kỹ sư, đã tiết kiệm 8 năm, đang phân vân giữa 2 căn hộ ở TP.HCM và Đà Nẵng',
    year: 2026,
    insight:
      'Cung Điền Trạch (Thái Âm + Phong Cáo) — phù hợp BĐS để ở/dài hạn, không hợp lướt sóng. Cung Tài Bạch (Vũ Khúc) — quản lý tiền cẩn trọng. Đại vận 36-45 chuyển sang cung Mệnh có Thiên Cơ — biến động sự nghiệp cao. Methodology /methodology/algorithm-changelog mô tả cách tính đại vận.',
    decision:
      'M. quyết định: không mua BĐS ngay. Thay vào đó: 50% tiền tiết kiệm gửi ETF quốc tế (đa dạng hoá), 30% giữ tiền mặt (đệm chuyển nghề), 20% mua căn studio Đà Nẵng làm second home (không vay). Lý do: cung Điền Trạch hợp BĐS ở thật, đại vận 36-45 không hợp lock liquidity. 12 tháng sau, M. đổi nghề thành công nhờ có đệm tiền mặt.',
    reflection:
      '"Bạn bè bảo tôi mua ngay vì \'giá lên\'. Lá số bảo tôi đứt mạch nếu đại vận chuyển. Cuối cùng tôi không mua theo logic \'giá\', tôi mua theo logic \'cuộc đời tôi sẽ ra sao 5 năm tới\'."',
    related: [
      { href: '/career-fit', label: 'Career Fit công cụ' },
      { href: '/tu-vi-nghe-nghiep', label: 'Lộ trình nghề nghiệp' },
      { href: '/lo-trinh/ke-hoach-nam', label: 'Lộ trình kế hoạch năm' },
      { href: '/methodology/tu-vi', label: 'Methodology Tử Vi đầy đủ' },
    ],
    publishedAt: '2026-03-20',
    illustrative: true,
    illustrativeLabel: ILLUSTRATIVE_LABEL,
  },
  {
    slug: 'khoi-nghiep-lan-thu-3',
    title: 'Khởi nghiệp lần thứ 3 sau 2 thất bại — có nên thử nữa?',
    excerpt:
      'Sau 2 lần đóng startup (1 lần do market timing, 1 lần do co-founder), Q. ngại thử lần 3. Lá số chỉ ra cung Mệnh có Phá Quân + Liêm Trinh — mẫu hình "phải vỡ rồi mới định hình". Decision Brief giúp Q. tách 2 thất bại thành 2 bài học khác nhau.',
    persona: 'Nam, 41 tuổi, founder 2 startup đã đóng, đang phân vân giữa đi làm thuê an toàn vs thử lần nữa với ý tưởng mới',
    year: 2025,
    insight:
      'Cung Mệnh (Phá Quân + Liêm Trinh) — sáng tạo + bứt phá, nhưng dễ tự đốt mình. Cung Quan Lộc (Tử Vi + Hoá Lộc) — phù hợp lãnh đạo có chiều sâu, không hợp "fast & loose". Hai thất bại trước: lần 1 đúng năng lực sai timing, lần 2 sai năng lực (chọn co-founder không phù hợp). Methodology /methodology/tu-vi chi tiết Phá Quân + Liêm Trinh.',
    decision:
      'Q. không đi làm thuê. Q. cũng không khởi nghiệp ngay. Dùng 90 ngày để: viết Decision Brief về 3 ý tưởng đang có, gặp 10 người đã trải qua startup lần 3+ (network sâu), và xây cấu trúc co-founder/advisor TRƯỚC khi quyết định ý tưởng. Sau 90 ngày, Q. chọn ý tưởng thứ 2 (B2B SaaS) cùng 1 co-founder cũ từ lần 1 (đã biết nhau 8 năm). 18 tháng sau, startup raise được seed, Q. nói "lần này tôi không sợ vỡ — tôi sợ vỡ không có học."',
    reflection:
      '"Lá số không bảo tôi sẽ thành công. Nó bảo tôi: \'Bạn được sinh ra để vỡ và xây lại — không có cách khác.\' Khi tôi chấp nhận điều đó, tôi không còn sợ thử nữa."',
    related: [
      { href: '/career-fit', label: 'Career Fit công cụ' },
      { href: '/tu-vi-nghe-nghiep', label: 'Lộ trình nghề nghiệp' },
      { href: '/decisions/new', label: 'Tạo Decision Brief cho quyết định của bạn' },
      { href: '/methodology/tu-vi', label: 'Methodology Tử Vi đầy đủ' },
    ],
    publishedAt: '2026-05-10',
    illustrative: true,
    illustrativeLabel: ILLUSTRATIVE_LABEL,
  },
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function listCaseStudies(): readonly CaseStudy[] {
  return CASE_STUDIES;
}
