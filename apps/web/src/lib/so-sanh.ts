/**
 * Data cho các trang SEO "so sánh lăng kính" (/so-sanh/[cap]).
 *
 * Mỗi mục so sánh 2 công cụ mà hieu.asia ĐANG có (link 2 chiều = phễu). Nội
 * dung KHÁCH QUAN, cân bằng — không dìm bên nào; on-brand "credible, không bói
 * toán". Pure data, không React.
 */

export interface ToolRef {
  ten: string;
  href: string;
  /** Mô tả 1 dòng. */
  tag: string;
}

export interface CompareDim {
  aspect: string;
  a: string;
  b: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Comparison {
  slug: string;
  /** Tiêu đề ngắn "MBTI vs Big Five". */
  title: string;
  a: ToolRef;
  b: ToolRef;
  /** Tổng quan 1-2 câu. */
  intro: string;
  /** Bảng đối chiếu. */
  dims: CompareDim[];
  whenA: string;
  whenB: string;
  /** Kết luận cân bằng, không phán "cái nào hơn". */
  bottomLine: string;
  faqs: Faq[];
}

export const COMPARISONS: readonly Comparison[] = [
  {
    slug: 'mbti-vs-big-five',
    title: 'MBTI vs Big Five',
    a: { ten: 'MBTI', href: '/mbti', tag: '16 nhóm tính cách' },
    b: { ten: 'Big Five', href: '/big-five', tag: '5 chiều OCEAN' },
    intro:
      'MBTI chia con người thành 16 nhóm dễ nhớ; Big Five (OCEAN) đo 5 chiều tính cách theo thang liên tục và được giới nghiên cứu tâm lý tin dùng hơn. Đây là hai lăng kính bổ trợ nhau, không loại trừ nhau.',
    dims: [
      {
        aspect: 'Cách phân loại',
        a: '16 nhóm rời rạc (mỗi chiều chọn 1 trong 2 cực)',
        b: '5 thang điểm liên tục (cao ↔ thấp), không "đóng hộp"',
      },
      {
        aspect: 'Cơ sở khoa học',
        a: 'Rất phổ biến, dễ tiếp cận; độ ổn định khi đo lại thấp hơn',
        b: 'Nền nghiên cứu vững, ổn định cao khi đo lại',
      },
      {
        aspect: 'Mức dễ nhớ',
        a: 'Rất dễ (4 chữ cái, vd INFJ)',
        b: 'Là hồ sơ 5 điểm — ít "nhãn" để gắn nhưng chính xác hơn',
      },
      {
        aspect: 'Hay dùng cho',
        a: 'Hiểu nhanh phong cách bản thân, giao tiếp, chia sẻ',
        b: 'Mô tả sâu, dùng trong tuyển dụng & nghiên cứu',
      },
      {
        aspect: 'Kết quả nhận được',
        a: 'Một trong 16 kiểu tính cách',
        b: 'Hồ sơ phần trăm theo 5 chiều',
      },
    ],
    whenA:
      'Khi bạn muốn một "nhãn" dễ nhớ để bắt đầu hiểu mình và dễ chia sẻ với người khác.',
    whenB:
      'Khi bạn muốn bức tranh chính xác, nhiều sắc thái và gần với nghiên cứu tâm lý.',
    bottomLine:
      'Không cái nào "đúng hơn" tuyệt đối: MBTI dễ vào và dễ nhớ, Big Five sâu và ổn định. Làm cả hai sẽ cho góc nhìn đầy đủ nhất về bản thân.',
    faqs: [
      {
        q: 'MBTI hay Big Five chính xác hơn?',
        a: 'Big Five có nền nghiên cứu và độ ổn định khi đo lại cao hơn; MBTI mạnh ở tính dễ hiểu và dễ chia sẻ. Tuỳ mục đích của bạn, không có cái "thắng" tuyệt đối.',
      },
      {
        q: 'Nên làm cái nào trước?',
        a: 'Thường nên làm MBTI để bắt đầu nhanh, rồi làm Big Five để hiểu sâu và chính xác hơn.',
      },
      {
        q: 'Hai kết quả có mâu thuẫn nhau không?',
        a: 'Hiếm khi — hai hệ đo nhiều chiều chồng lấn (ví dụ tính Hướng ngoại), nên kết quả thường nhất quán và bổ sung cho nhau.',
      },
    ],
  },
  {
    slug: 'tu-vi-vs-bat-tu',
    title: 'Tử Vi vs Bát Tự',
    a: { ten: 'Tử Vi', href: '/tu-vi', tag: 'Đẩu Số · 12 cung' },
    b: { ten: 'Bát Tự', href: '/bat-tu', tag: 'Tứ Trụ · Can Chi' },
    intro:
      'Tử Vi Đẩu Số lập lá số 12 cung với hàng chục sao; Bát Tự (Tứ Trụ) dựa trên Can - Chi của giờ, ngày, tháng, năm sinh. Đây là hai trường phái luận mệnh Á Đông khác nhau về cách tiếp cận — bổ sung cho nhau.',
    dims: [
      {
        aspect: 'Cơ sở',
        a: '12 cung + các sao (vị trí sao nằm ở cung nào)',
        b: '4 trụ Can - Chi + tương tác Ngũ Hành',
      },
      {
        aspect: 'Trực quan',
        a: 'Lá số nhiều sao, sinh động, nhiều lớp thông tin',
        b: 'Tám chữ gọn, thiên về cân bằng ngũ hành',
      },
      {
        aspect: 'Mạnh ở',
        a: 'Bức tranh chi tiết theo từng lĩnh vực (Mệnh, Quan, Tài, Phối…)',
        b: 'Dụng thần, cân bằng ngũ hành, xem đại vận theo chu kỳ',
      },
      {
        aspect: 'Dữ liệu cần',
        a: 'Ngày và GIỜ sinh chính xác',
        b: 'Ngày và GIỜ sinh chính xác',
      },
      {
        aspect: 'Cách đọc',
        a: 'Theo cung mình quan tâm',
        b: 'Theo nhật chủ + ngũ hành thịnh/suy',
      },
    ],
    whenA: 'Khi bạn muốn xem chi tiết từng khía cạnh cuộc đời theo từng cung.',
    whenB:
      'Khi bạn muốn hiểu cốt lõi ngũ hành, dụng thần và chu kỳ vận (đại vận).',
    bottomLine:
      'Hai cách nhìn bổ sung nhau; nhiều người xem cả hai để đối chiếu. hieu.asia trình bày như công cụ tham khảo và chiêm nghiệm để hiểu mình rõ hơn — không phán định số phận.',
    faqs: [
      {
        q: 'Tử Vi và Bát Tự cái nào đúng hơn?',
        a: 'Không có cái "đúng hơn" — đây là hai hệ thống khác nhau và bổ sung nhau. Giá trị nằm ở cách diễn giải có chiều sâu và trung thực, không ở việc chọn phe.',
      },
      {
        q: 'Cần gì để xem hai loại này?',
        a: 'Cả hai đều cần ngày và giờ sinh chính xác (lịch âm/dương đã quy đổi đúng).',
      },
      {
        q: 'Nên xem cái nào?',
        a: 'Muốn chi tiết theo từng lĩnh vực thì xem Tử Vi; muốn cốt lõi ngũ hành và chu kỳ vận thì xem Bát Tự. Lý tưởng là xem cả hai rồi đối chiếu.',
      },
    ],
  },
  {
    slug: 'mbti-vs-disc',
    title: 'MBTI vs DISC',
    a: { ten: 'MBTI', href: '/mbti', tag: '16 nhóm tư duy' },
    b: { ten: 'DISC', href: '/disc', tag: '4 phong cách hành vi' },
    intro:
      'MBTI mô tả cách bạn tư duy và nạp năng lượng (16 nhóm); DISC tập trung vào phong cách HÀNH VI và giao tiếp (4 nhóm D/i/S/C), rất hay dùng nơi công sở. Một cái nhìn vào bên trong, một cái nhìn vào cách bạn tương tác.',
    dims: [
      {
        aspect: 'Trọng tâm',
        a: 'Nhận thức và tư duy nội tâm',
        b: 'Hành vi quan sát được, cách giao tiếp',
      },
      { aspect: 'Số nhóm', a: '16 kiểu', b: '4 phong cách (D / i / S / C)' },
      {
        aspect: 'Bối cảnh hay dùng',
        a: 'Hiểu bản thân, định hướng nghề & học',
        b: 'Làm việc nhóm, bán hàng, lãnh đạo',
      },
      {
        aspect: 'Độ sâu vs nhanh gọn',
        a: 'Sâu về động cơ bên trong',
        b: 'Nhanh, thực dụng cho tương tác hằng ngày',
      },
    ],
    whenA: 'Khi bạn muốn hiểu sâu cách mình suy nghĩ và ra quyết định.',
    whenB: 'Khi bạn muốn cải thiện giao tiếp và phối hợp trong công việc.',
    bottomLine:
      'MBTI trả lời "tại sao bạn nghĩ như vậy", DISC trả lời "bạn cư xử thế nào với người khác". Ghép cả hai cho bức tranh vừa sâu vừa thực dụng.',
    faqs: [
      {
        q: 'MBTI và DISC khác nhau ở đâu?',
        a: 'MBTI thiên về tư duy nội tâm (16 nhóm); DISC thiên về hành vi và giao tiếp (4 nhóm). Chúng bổ sung chứ không thay thế nhau.',
      },
      {
        q: 'Cho công việc nên dùng cái nào?',
        a: 'DISC thực dụng cho giao tiếp và làm việc nhóm; MBTI hợp để hiểu sâu bản thân và định hướng. Nhiều nơi dùng cả hai.',
      },
    ],
  },
  {
    slug: 'mbti-vs-enneagram',
    title: 'MBTI vs Enneagram',
    a: { ten: 'MBTI', href: '/mbti', tag: '16 nhóm tư duy' },
    b: { ten: 'Enneagram', href: '/enneagram', tag: '9 nhóm động lực' },
    intro:
      'MBTI mô tả CÁCH bạn tư duy và tiếp nhận thông tin (16 nhóm); Enneagram đào vào ĐỘNG LỰC và nỗi sợ cốt lõi đứng sau hành vi (9 nhóm). Một bên trả lời "bạn vận hành thế nào", một bên trả lời "vì sao bạn làm vậy".',
    dims: [
      {
        aspect: 'Trọng tâm',
        a: 'Cách tư duy, nạp năng lượng, ra quyết định',
        b: 'Động lực sâu: điều bạn khao khát & nỗi sợ nền tảng',
      },
      {
        aspect: 'Số nhóm',
        a: '16 nhóm (4 trục lưỡng cực)',
        b: '9 nhóm + cánh (wing) + mũi tên phát triển',
      },
      {
        aspect: 'Thiên về',
        a: 'Mô tả phong cách nhận thức (khá tĩnh)',
        b: 'Phát triển bản thân (có đường trưởng thành/áp lực)',
      },
      {
        aspect: 'Cơ sở',
        a: 'Thuyết Jung; bị phản biện độ tin cậy',
        b: 'Mô hình phát triển bản thân; nền thực nghiệm hạn chế',
      },
      {
        aspect: 'Trả lời câu hỏi',
        a: '"Tôi vận hành thế nào?"',
        b: '"Vì sao tôi như vậy?"',
      },
    ],
    whenA:
      'Khi bạn muốn hiểu phong cách tư duy, giao tiếp, học tập và làm việc của mình.',
    whenB:
      'Khi bạn muốn chạm vào động lực sâu, nỗi sợ cốt lõi và một con đường để trưởng thành.',
    bottomLine:
      'Không cái nào thay được cái nào: MBTI mô tả "phần mềm tư duy", Enneagram chạm "động cơ bên dưới". Nhiều người ghép cả hai (ví dụ INFP nhóm 4) cho bức tranh đầy đủ nhất.',
    faqs: [
      {
        q: 'MBTI và Enneagram khác nhau thế nào?',
        a: 'MBTI mô tả cách bạn tư duy và tiếp nhận thông tin; Enneagram đào vào động lực và nỗi sợ cốt lõi sau hành vi. Một cái về "cách", một cái về "vì sao".',
      },
      {
        q: 'Nên làm cái nào trước?',
        a: 'MBTI dễ vào hơn nên hợp để bắt đầu; Enneagram chạm sâu hơn về động lực, hợp khi bạn muốn đi vào "vì sao". Làm cả hai bổ sung nhau.',
      },
      {
        q: 'Cái nào "khoa học" hơn?',
        a: 'Cả hai đều bị giới hàn lâm phản biện về độ tin cậy và không phải chẩn đoán. Nếu cần nền thực nghiệm vững hơn, hãy kết hợp với Big Five.',
      },
    ],
  },
  {
    slug: 'enneagram-vs-big-five',
    title: 'Enneagram vs Big Five',
    a: { ten: 'Enneagram', href: '/enneagram', tag: '9 nhóm động lực' },
    b: { ten: 'Big Five', href: '/big-five', tag: '5 chiều OCEAN' },
    intro:
      'Enneagram nhóm con người theo 9 động lực cốt lõi và mở ra con đường phát triển; Big Five (OCEAN) đo 5 chiều tính cách trên thang liên tục với nền nghiên cứu vững nhất. Một bên giàu ý nghĩa phát triển, một bên chính xác và đo lường được.',
    dims: [
      {
        aspect: 'Cách phân loại',
        a: '9 nhóm + cánh (theo động lực)',
        b: '5 thang liên tục, không "đóng hộp"',
      },
      {
        aspect: 'Cơ sở khoa học',
        a: 'Mô hình phát triển bản thân; thực nghiệm hạn chế',
        b: 'Nền nghiên cứu vững, ổn định cao khi đo lại',
      },
      {
        aspect: 'Mạnh ở',
        a: 'Hiểu "vì sao", nỗi sợ, hướng trưởng thành',
        b: 'Mô tả chính xác, có khả năng dự báo',
      },
      {
        aspect: 'Hay dùng cho',
        a: 'Phát triển bản thân, chiêm nghiệm, trị liệu',
        b: 'Nghiên cứu, tuyển dụng, đo lường',
      },
      {
        aspect: 'Kết quả nhận được',
        a: 'Một nhóm chính + cánh',
        b: 'Hồ sơ phần trăm theo 5 chiều',
      },
    ],
    whenA:
      'Khi bạn muốn hiểu động lực sâu và một lộ trình phát triển có ý nghĩa.',
    whenB:
      'Khi bạn muốn bức tranh chính xác, đo được và gần với khoa học tâm lý.',
    bottomLine:
      'Big Five mạnh về độ chính xác, Enneagram mạnh về chiều sâu phát triển. Đọc Big Five để biết "bạn ở đâu trên các thang", đọc Enneagram để hiểu "vì sao và đi tới đâu".',
    faqs: [
      {
        q: 'Enneagram hay Big Five chính xác hơn?',
        a: 'Big Five có nền thực nghiệm và độ ổn định cao hơn hẳn; Enneagram không mạnh về đo lường nhưng giàu ý nghĩa phát triển. Tuỳ mục đích của bạn.',
      },
      {
        q: 'Vì sao nhiều nhà tâm lý thích Big Five?',
        a: 'Vì 5 chiều nổi lên từ phân tích thống kê hàng nghìn từ mô tả tính cách qua nhiều nền văn hoá, và ổn định khi đo lại — nên đáng tin trong nghiên cứu.',
      },
      {
        q: 'Vậy còn dùng Enneagram làm gì?',
        a: 'Enneagram trả lời điều Big Five không nhắm tới: động lực sâu, nỗi sợ cốt lõi và con đường trưởng thành. Nó là công cụ chiêm nghiệm, không phải phép đo.',
      },
    ],
  },
  {
    slug: 'than-so-hoc-vs-tu-vi',
    title: 'Thần Số Học vs Tử Vi',
    a: { ten: 'Thần Số Học', href: '/than-so-hoc', tag: 'Số chủ đạo · Pythagoras' },
    b: { ten: 'Tử Vi', href: '/tu-vi', tag: 'Đẩu Số · 12 cung' },
    intro:
      'Thần Số Học (Tây phương) rút các con số chủ đạo từ ngày sinh và tên; Tử Vi (Á Đông) lập lá số 12 cung với hàng chục sao. Hai truyền thống khác hẳn về nguồn gốc và cách tính — cùng là lăng kính để chiêm nghiệm, không phán số phận.',
    dims: [
      {
        aspect: 'Nguồn gốc',
        a: 'Tây phương, gắn với Pythagoras',
        b: 'Á Đông (Trung Hoa) — Đẩu Số',
      },
      {
        aspect: 'Dữ liệu cần',
        a: 'Ngày sinh + họ tên',
        b: 'Ngày và GIỜ sinh chính xác',
      },
      {
        aspect: 'Cách tính',
        a: 'Quy các số về 1–9 (và 11/22/33)',
        b: 'An sao theo can chi vào 12 cung',
      },
      {
        aspect: 'Trực quan',
        a: 'Vài con số chủ đạo, dễ nhớ',
        b: 'Lá số nhiều sao, nhiều lớp thông tin',
      },
      {
        aspect: 'Mạnh ở',
        a: 'Tổng quan tính cách & chu kỳ năm, nhanh gọn',
        b: 'Chi tiết theo từng lĩnh vực (Mệnh, Tài, Quan, Phối…)',
      },
    ],
    whenA:
      'Khi bạn muốn một cái nhìn nhanh, dễ nhớ về thiên hướng và chu kỳ năm cá nhân.',
    whenB:
      'Khi bạn muốn bức tranh chi tiết, nhiều lớp theo từng khía cạnh cuộc đời.',
    bottomLine:
      'Hai hệ khác nguồn gốc nên không "đối chiếu đúng-sai" được; mỗi cái cho một góc nhìn. Xem Thần Số Học để nắm nhanh, xem Tử Vi để đi sâu — đọc như gợi ý chiêm nghiệm.',
    faqs: [
      {
        q: 'Thần Số Học và Tử Vi cái nào đúng hơn?',
        a: 'Hai hệ khác nguồn gốc và cách tính, không có cái "đúng hơn". Giá trị nằm ở cách diễn giải trung thực, không ở việc chọn phe.',
      },
      {
        q: 'Có cần giờ sinh không?',
        a: 'Thần Số Học chỉ cần ngày sinh và họ tên; Tử Vi cần cả giờ sinh chính xác mới lập đúng lá số.',
      },
      {
        q: 'Nên xem cái nào trước?',
        a: 'Thần Số Học nhanh và dễ vào; Tử Vi sâu và chi tiết hơn. Nhiều người xem Thần Số Học trước rồi sang Tử Vi để đào sâu.',
      },
    ],
  },
] as const;

const BY_SLUG: ReadonlyMap<string, Comparison> = new Map(
  COMPARISONS.map((c) => [c.slug, c]),
);

export function findComparison(slug: string): Comparison | undefined {
  return BY_SLUG.get(slug);
}

export function allComparisonSlugs(): string[] {
  return COMPARISONS.map((c) => c.slug);
}
