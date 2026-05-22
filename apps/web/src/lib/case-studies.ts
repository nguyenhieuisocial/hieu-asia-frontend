/**
 * Case studies — anonymized user narratives.
 *
 * Showcases how Tử Vi + Decision Brief was applied to a real life decision.
 * Privacy: no birth data, no real names (T., A., M.), no identifying details.
 * Source: paraphrased + de-identified user feedback, used with permission.
 */

export interface CaseStudy {
  slug: string;
  title: string;
  excerpt: string;
  /** Persona summary — generic enough to not identify anyone. */
  persona: string;
  /** Year the decision was made. */
  year: number;
  /** What the chart highlighted — referenced to methodology, not prescription. */
  insight: string;
  /** What they decided + the broad outcome. */
  decision: string;
  /** Their reflection in their own (paraphrased) words. */
  reflection: string;
  /** Methodology pages this case touches — for cross-link. */
  related: Array<{ href: string; label: string }>;
  /** Disclaimer: case studies illustrate process, not outcome guarantee. */
  publishedAt: string;
}

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
      { href: '/lo-trinh/su-nghiep', label: 'Lộ trình quyết định nghề nghiệp' },
      { href: '/decisions/new', label: 'Tạo Decision Brief cho quyết định của bạn' },
    ],
    publishedAt: '2026-03-08',
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
      { href: '/lo-trinh/tinh-cam', label: 'Lộ trình quyết định gia đình' },
      { href: '/methodology/tu-vi', label: 'Cung Phụ Mẫu trong Methodology' },
    ],
    publishedAt: '2026-02-18',
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
      { href: '/lo-trinh/su-nghiep', label: 'Lộ trình nghề nghiệp' },
    ],
    publishedAt: '2026-04-22',
  },
] as const;

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function listCaseStudies(): readonly CaseStudy[] {
  return CASE_STUDIES;
}
