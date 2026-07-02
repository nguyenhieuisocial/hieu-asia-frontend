import type { Activity } from '@/components/lich-van-nien/ActivityChecker';

/**
 * Per-purpose landing config for "Xem ngày tốt theo mục đích".
 *
 * Each entry becomes a static SEO landing route /xem-ngay/<slug> that reuses the
 * existing ActivityChecker (engine: worker /tools/lich-van-nien/check) but is
 * pre-set to one activity, with its own metadata + educational copy + FAQ so it
 * is a substantive page, not a thin doorway. Brand voice: tham khảo theo lịch
 * pháp truyền thống, KHÔNG phán số mệnh.
 */
export interface XemNgayPurpose {
  slug: string;
  activity: Activity;
  /** Card / breadcrumb label, e.g. "Cưới hỏi". */
  label: string;
  emoji: string;
  /** Title suffix after the gold "Xem ngày", e.g. "cưới". */
  h1Suffix: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  /** Short lede under the hero. */
  intro: string;
  /** What the almanac weighs for this activity (plain Vietnamese). */
  considerations: string[];
  faqs: { q: string; a: string }[];
}

export const PURPOSES: XemNgayPurpose[] = [
  {
    slug: 'cuoi-hoi',
    activity: 'cuoi_hoi',
    label: 'Cưới hỏi',
    emoji: '💍',
    h1Suffix: 'cưới hỏi',
    eyebrow: 'Xem ngày · Cưới hỏi',
    seoTitle: 'Xem ngày cưới hỏi tốt — Hoàng đạo, Kim Lâu',
    seoDescription:
      'Chọn ngày cưới hỏi đẹp theo lịch vạn niên: chấm điểm 0–100 theo Hoàng/Hắc đạo, trực ngày, sao tốt xấu và cảnh báo Tam Tai, Kim Lâu. Cá nhân hoá theo tuổi.',
    intro:
      'Nhập ngày dự định cưới và năm sinh để xem ngày đó có thuận cho việc cưới hỏi không. Đây là tham khảo theo lịch pháp truyền thống, giúp bạn cân nhắc — không phải lời phán số mệnh.',
    considerations: [
      'Ngày Hoàng Đạo cộng điểm, Hắc Đạo trừ điểm.',
      'Sao tốt cho cưới hỏi: Thiên Hỷ, Thiên Đức, Nguyệt Đức, Tam Hợp, Lục Hợp.',
      'Sao nên tránh: Cô Thần, Quả Tú, Lục Xung, Tam Sát.',
      'Cảnh báo theo tuổi: năm Tam Tai và phạm Kim Lâu đều trừ điểm.',
      'Nếu ngày bạn chọn điểm thấp, hệ thống gợi ý ngày tốt hơn trong 30 ngày tới.',
    ],
    faqs: [
      {
        q: 'Xem ngày cưới dựa trên những yếu tố nào?',
        a: 'Hệ thống chấm điểm từ Hoàng/Hắc đạo, trực ngày, các sao tốt – xấu của ngày, và cảnh báo Tam Tai / Kim Lâu tính theo năm sinh. Tổng hợp thành điểm 0–100 kèm lý do cụ thể.',
      },
      {
        q: 'Tam Tai và Kim Lâu là gì?',
        a: 'Tam Tai là 3 năm hạn theo nhóm tuổi tam hợp; Kim Lâu là cách tính theo tuổi mụ thường kiêng khi cưới hỏi, làm nhà. Đây là tập tục dân gian — chúng tôi nêu ra để bạn biết và tự cân nhắc.',
      },
      {
        q: 'Có cần nhập năm sinh không?',
        a: 'Không bắt buộc. Nếu nhập, kết quả sẽ tính thêm cảnh báo Tam Tai / Kim Lâu theo tuổi cho chính xác hơn với bạn.',
      },
    ],
  },
  {
    slug: 'khai-truong',
    activity: 'khai_truong',
    label: 'Khai trương',
    emoji: '🏪',
    h1Suffix: 'khai trương',
    eyebrow: 'Xem ngày · Khai trương',
    seoTitle: 'Xem ngày khai trương tốt — mở cửa hàng, công ty',
    seoDescription:
      'Chọn ngày khai trương đẹp theo lịch vạn niên: chấm điểm Hoàng đạo, trực ngày, sao Tài – Lộc và cảnh báo Tam Tai. Gợi ý ngày tốt hơn nếu ngày bạn chọn chưa hợp.',
    intro:
      'Nhập ngày dự định khai trương cửa hàng, công ty để xem ngày đó có thuận cho việc mở hàng không — tham khảo theo lịch pháp truyền thống, giúp bạn an tâm khởi sự.',
    considerations: [
      'Ngày Hoàng Đạo và trực ngày hợp việc mở hàng cộng điểm.',
      'Sao tốt: Thiên Đức, Nguyệt Đức, Tam Hợp.',
      'Sao nên tránh: Đại Hao, Tiểu Hao (hao tài), Lục Xung, Tam Sát.',
      'Cảnh báo năm Tam Tai theo tuổi gia chủ.',
      'Gợi ý 3 ngày tốt hơn trong 30 ngày tới nếu cần.',
    ],
    faqs: [
      {
        q: 'Vì sao nên xem ngày khai trương?',
        a: 'Người kinh doanh thường chọn ngày mở hàng có sao Tài – Lộc tốt và tránh ngày hao tài (Đại Hao, Tiểu Hao). Việc này mang tính tham khảo và tạo tâm lý khởi đầu thuận lợi.',
      },
      {
        q: 'Khai trương có kiêng Tam Tai không?',
        a: 'Nhiều người kiêng làm việc lớn trong năm Tam Tai. Nếu bạn nhập năm sinh, hệ thống sẽ nhắc khi rơi vào năm Tam Tai để bạn cân nhắc.',
      },
      {
        q: 'Ngày tôi chọn điểm thấp thì sao?',
        a: 'Hệ thống tự đề xuất tối đa 3 ngày khác trong 30 ngày tới có điểm cao hơn, kèm thông tin âm lịch và sao của ngày đó.',
      },
    ],
  },
  {
    slug: 'dong-tho',
    activity: 'dong_tho',
    label: 'Động thổ',
    emoji: '🏗️',
    h1Suffix: 'động thổ',
    eyebrow: 'Xem ngày · Động thổ',
    seoTitle: 'Xem ngày động thổ tốt — khởi công xây, sửa nhà',
    seoDescription:
      'Chọn ngày động thổ, khởi công xây dựng theo lịch vạn niên: chấm điểm Hoàng đạo, trực ngày, kèm cảnh báo Tam Tai, Kim Lâu, Hoang Ốc theo tuổi gia chủ.',
    intro:
      'Nhập ngày dự định động thổ, khởi công và năm sinh gia chủ để xem ngày có thuận cho việc xây dựng không — tham khảo theo lịch pháp truyền thống.',
    considerations: [
      'Ngày Hoàng Đạo và trực ngày hợp xây dựng cộng điểm.',
      'Cảnh báo đầy đủ theo tuổi: Tam Tai, Kim Lâu, và Hoang Ốc.',
      'Sao xấu Lục Xung, Tam Sát trừ điểm.',
      'Động thổ là việc trọng — nên nhập năm sinh để tính cảnh báo tuổi.',
      'Gợi ý ngày tốt hơn trong 30 ngày tới nếu ngày chọn chưa đạt.',
    ],
    faqs: [
      {
        q: 'Động thổ cần tránh những gì theo tuổi?',
        a: 'Theo tập tục, người ta thường tránh động thổ khi phạm Tam Tai, Kim Lâu hoặc Hoang Ốc. Nhập năm sinh gia chủ để hệ thống nhắc các cảnh báo này.',
      },
      {
        q: 'Hoang Ốc là gì?',
        a: 'Hoang Ốc là cách tính theo tuổi để xem việc làm nhà có rơi vào cung xấu không. Đây là tập tục dân gian; chúng tôi nêu để bạn tham khảo, không khẳng định đúng – sai.',
      },
      {
        q: 'Tôi mượn tuổi làm nhà thì nhập tuổi ai?',
        a: 'Nếu mượn tuổi, hãy nhập năm sinh của người đứng ra làm lễ động thổ (người được mượn tuổi) để cảnh báo tính đúng theo tuổi đó.',
      },
    ],
  },
  {
    slug: 'nhap-trach',
    activity: 'nhap_trach',
    label: 'Nhập trạch',
    emoji: '🔑',
    h1Suffix: 'nhập trạch',
    eyebrow: 'Xem ngày · Nhập trạch',
    seoTitle: 'Xem ngày nhập trạch tốt — về nhà mới, dọn nhà',
    seoDescription:
      'Chọn ngày nhập trạch (về nhà mới) đẹp theo lịch vạn niên: chấm điểm Hoàng đạo, trực ngày, sao tốt xấu và cảnh báo Tam Tai, Kim Lâu, Hoang Ốc theo tuổi.',
    intro:
      'Nhập ngày dự định dọn về nhà mới và năm sinh để xem ngày có thuận cho việc nhập trạch không — tham khảo theo lịch pháp truyền thống.',
    considerations: [
      'Ngày Hoàng Đạo và trực ngày hợp việc về nhà cộng điểm.',
      'Cảnh báo theo tuổi: Tam Tai, Kim Lâu, Hoang Ốc.',
      'Sao xấu Lục Xung, Tam Sát trừ điểm.',
      'Nên chọn ngày, giờ hoàng đạo để làm lễ nhập trạch.',
      'Gợi ý ngày tốt hơn trong 30 ngày tới nếu cần.',
    ],
    faqs: [
      {
        q: 'Nhập trạch là gì?',
        a: 'Nhập trạch là lễ dọn vào nhà mới, báo cáo với thần linh – gia tiên về nơi ở mới. Người ta thường chọn ngày giờ hoàng đạo, hợp tuổi gia chủ.',
      },
      {
        q: 'Nhập trạch và động thổ có chọn cùng ngày không?',
        a: 'Hai việc khác nhau và thường ở hai thời điểm khác nhau. Bạn có thể xem riêng từng việc; tiêu chí cảnh báo tuổi (Tam Tai, Kim Lâu, Hoang Ốc) áp dụng cho cả hai.',
      },
      {
        q: 'Kết quả có chính xác tuyệt đối không?',
        a: 'Không. Đây là công cụ tham khảo dựa trên quy tắc lịch pháp truyền thống, giúp bạn cân nhắc và an tâm — quyết định cuối cùng là của bạn.',
      },
    ],
  },
  {
    slug: 'xuat-hanh',
    activity: 'xuat_hanh',
    label: 'Xuất hành',
    emoji: '🧭',
    h1Suffix: 'xuất hành',
    eyebrow: 'Xem ngày · Xuất hành',
    seoTitle: 'Xem ngày xuất hành tốt — đi xa đầu năm',
    seoDescription:
      'Chọn ngày xuất hành, đi xa thuận lợi theo lịch vạn niên: chấm điểm Hoàng đạo, trực ngày, sao Tam Hợp – Lục Hợp, tránh Lục Xung, Tam Sát.',
    intro:
      'Nhập ngày dự định xuất hành, đi xa để xem ngày có thuận cho chuyến đi không — tham khảo theo lịch pháp truyền thống, hợp dịp đầu năm.',
    considerations: [
      'Ngày Hoàng Đạo và trực Khai, Kiến hợp xuất hành cộng điểm.',
      'Sao tốt: Tam Hợp, Lục Hợp, Thiên Đức.',
      'Sao nên tránh: Lục Xung, Tam Sát.',
      'Có thể kết hợp xem giờ và hướng xuất hành tốt trong lịch vạn niên.',
      'Gợi ý ngày tốt hơn trong 30 ngày tới nếu cần.',
    ],
    faqs: [
      {
        q: 'Xem ngày xuất hành để làm gì?',
        a: 'Đầu năm hoặc trước chuyến đi xa, nhiều người chọn ngày giờ hoàng đạo, hướng tốt để xuất hành cho hanh thông. Đây là phong tục mang tính tham khảo và tạo tâm thế tốt.',
      },
      {
        q: 'Ngày xuất hành có cần hợp tuổi không?',
        a: 'Tiêu chí chính là Hoàng đạo, trực ngày và sao của ngày. Nếu nhập năm sinh, hệ thống tính thêm cảnh báo tuổi để bạn yên tâm hơn.',
      },
      {
        q: 'Tôi nên đi vào giờ nào?',
        a: 'Trang Lịch Vạn Niên có thông tin giờ hoàng đạo trong ngày. Hãy chọn ngày tốt trước, rồi xem giờ hoàng đạo của ngày đó để khởi hành.',
      },
    ],
  },
  {
    slug: 'mua-xe',
    activity: 'mua_xe',
    label: 'Mua xe',
    emoji: '🚗',
    h1Suffix: 'mua xe',
    eyebrow: 'Xem ngày · Mua xe',
    seoTitle: 'Xem ngày mua xe tốt — nhận xe hanh thông',
    seoDescription:
      'Chọn ngày mua xe, nhận xe đẹp theo lịch vạn niên: chấm điểm Hoàng đạo, trực ngày, sao Tam Hợp – Lục Hợp, tránh Lục Xung, Tam Sát, Đại Hao.',
    intro:
      'Nhập ngày dự định mua hoặc nhận xe để xem ngày có thuận không — tham khảo theo lịch pháp truyền thống, để chuyến xe đầu được hanh thông.',
    considerations: [
      'Ngày Hoàng Đạo cộng điểm, Hắc Đạo trừ điểm.',
      'Sao tốt: Tam Hợp, Lục Hợp.',
      'Sao nên tránh: Lục Xung, Tam Sát, Đại Hao (hao tài).',
      'Nhiều người chọn ngày đẹp để nhận xe và làm lễ cho an tâm.',
      'Gợi ý ngày tốt hơn trong 30 ngày tới nếu cần.',
    ],
    faqs: [
      {
        q: 'Mua xe có cần xem ngày không?',
        a: 'Đây là việc tuỳ tâm. Nhiều người chọn ngày hoàng đạo, tránh ngày hao tài để nhận xe cho yên tâm và may mắn. Công cụ giúp bạn tham khảo nhanh.',
      },
      {
        q: 'Nên xem ngày mua hay ngày nhận xe?',
        a: 'Thường là ngày nhận xe / lăn bánh. Bạn nhập ngày dự kiến nhận xe để chấm điểm cho đúng thời điểm quan trọng.',
      },
      {
        q: 'Ngày đẹp có đảm bảo lái xe an toàn không?',
        a: 'Không. Ngày tốt chỉ mang ý nghĩa tham khảo, tâm lý. An toàn giao thông phụ thuộc vào bạn — hãy luôn cẩn thận khi lái xe.',
      },
    ],
  },
  {
    slug: 'ky-hop-dong',
    activity: 'ky_hop_dong',
    label: 'Ký hợp đồng',
    emoji: '📝',
    h1Suffix: 'ký hợp đồng',
    eyebrow: 'Xem ngày · Ký hợp đồng',
    seoTitle: 'Xem ngày ký hợp đồng tốt — giao dịch thuận lợi',
    seoDescription:
      'Chọn ngày ký hợp đồng, giao dịch quan trọng theo lịch vạn niên: chấm điểm Hoàng đạo, trực ngày, sao Tam Hợp – Lục Hợp, tránh Lục Xung, Tam Sát.',
    intro:
      'Nhập ngày dự định ký kết, giao dịch để xem ngày có thuận cho việc hợp tác không — tham khảo theo lịch pháp truyền thống.',
    considerations: [
      'Ngày Hoàng Đạo và trực Định, Thành hợp ký kết cộng điểm.',
      'Sao tốt: Tam Hợp, Lục Hợp, Thiên Đức.',
      'Sao nên tránh: Lục Xung, Tam Sát.',
      'Phù hợp cho ký hợp đồng, khai trương hợp tác, mở tài khoản lớn.',
      'Gợi ý ngày tốt hơn trong 30 ngày tới nếu cần.',
    ],
    faqs: [
      {
        q: 'Vì sao chọn ngày ký hợp đồng?',
        a: 'Với giao dịch lớn hoặc khởi đầu hợp tác, nhiều người chọn ngày hoàng đạo, hợp lục hợp – tam hợp để mong thuận buồm xuôi gió. Đây là tham khảo, không thay cho thẩm định pháp lý.',
      },
      {
        q: 'Công cụ này có thay luật sư không?',
        a: 'Hoàn toàn không. Xem ngày chỉ là yếu tố tâm lý – phong tục. Nội dung và tính pháp lý của hợp đồng vẫn cần bạn và chuyên gia rà soát kỹ.',
      },
      {
        q: 'Có nên dời ngày nếu điểm thấp?',
        a: 'Tuỳ bạn. Nếu lịch linh hoạt, hệ thống gợi ý vài ngày điểm cao hơn gần đó để bạn cân nhắc; nếu gấp, cứ ưu tiên công việc.',
      },
    ],
  },
];

export function getPurpose(slug: string): XemNgayPurpose | undefined {
  return PURPOSES.find((p) => p.slug === slug);
}
