/**
 * Per-variant landing config for "Đặt tên con theo ngũ hành".
 *
 * Each entry becomes a static SEO landing route /dat-ten-ngu-hanh/<slug> that
 * reuses the existing DatTenNguHanhChecker engine (client-side nạp-âm) but is
 * pre-set (gender) and wrapped in its own metadata + educational copy + FAQ so
 * it is a substantive page targeting a distinct high-intent search, NOT a thin
 * doorway. Brand voice: gợi ý tham khảo theo phong tục, KHÔNG phán số mệnh con.
 */

export type GenderDefault = 'ca' | 'nam' | 'nu';

export interface DatTenVariant {
  slug: string;
  /** Pre-selects the checker's gender filter. */
  defaultGender: GenderDefault;
  /** Breadcrumb / nav label, e.g. "Con trai". */
  label: string;
  emoji: string;
  /** Suffix after the gold "Đặt tên", e.g. "con trai theo ngũ hành". */
  h1Suffix: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  /** Short lede under the hero. */
  intro: string;
  considerations: string[];
  faqs: { q: string; a: string }[];
}

export const VARIANTS: DatTenVariant[] = [
  {
    slug: 'con-trai',
    defaultGender: 'nam',
    label: 'Con trai',
    emoji: '👦',
    h1Suffix: 'con trai theo ngũ hành',
    eyebrow: 'Đặt tên · Con trai',
    seoTitle: 'Đặt tên con trai hợp mệnh theo ngũ hành',
    seoDescription:
      'Tra mệnh ngũ hành của bé trai theo ngày sinh (nạp âm) và gợi ý tên hợp mệnh theo hành tương sinh, ý nghĩa mạnh mẽ. Gợi ý tham khảo — không phán số mệnh.',
    intro:
      'Nhập ngày sinh của bé trai để xem mệnh ngũ hành và gợi ý những cái tên hợp mệnh, ý nghĩa — tham khảo theo phong tục, không phải lời định đoạt tương lai của con.',
    considerations: [
      'Mệnh của bé tính theo nạp âm năm sinh âm lịch (công cụ tự đổi ngày dương sang âm, tính cả mốc Tết).',
      'Theo quan niệm tương sinh, tên nên thuộc hành sinh ra mệnh bé hoặc cùng mệnh; tránh hành tương khắc.',
      'Tên con trai thường gửi gắm sự mạnh mẽ, chí hướng — nhưng ý nghĩa đẹp và dễ gọi mới là điều quan trọng nhất.',
      'Gợi ý tên dựa trên nghĩa chữ Hán-Việt (phổ biến nhất); một số trường phái tính theo số nét chữ.',
    ],
    faqs: [
      {
        q: 'Đặt tên con trai theo ngũ hành cần lưu ý gì?',
        a: 'Trước tiên xác định mệnh ngũ hành của bé theo năm sinh, rồi chọn tên thuộc hành tương sinh (hoặc cùng mệnh) để hài hoà. Quan trọng không kém là tên dễ gọi, ý nghĩa tốt và hợp với họ, tên đệm của gia đình.',
      },
      {
        q: 'Tên đệm cho con trai chọn thế nào?',
        a: 'Tên đệm có thể cùng hành với tên chính để bổ trợ, hoặc theo truyền thống dòng họ (chữ lót đời). Đây là lựa chọn theo phong tục và sở thích gia đình — công cụ chỉ gợi ý phần tên theo hành để bạn tham khảo.',
      },
      {
        q: 'Tên hợp mệnh có giúp con trai thành đạt không?',
        a: 'Không. Đặt tên theo ngũ hành là một nét văn hoá để cha mẹ gửi gắm mong ước, không định đoạt cuộc đời con. Sự nuôi dạy và tình yêu thương của cha mẹ mới là điều quyết định.',
      },
    ],
  },
  {
    slug: 'con-gai',
    defaultGender: 'nu',
    label: 'Con gái',
    emoji: '👧',
    h1Suffix: 'con gái theo ngũ hành',
    eyebrow: 'Đặt tên · Con gái',
    seoTitle: 'Đặt tên con gái hợp mệnh theo ngũ hành',
    seoDescription:
      'Tra mệnh ngũ hành của bé gái theo ngày sinh (nạp âm) và gợi ý tên hợp mệnh theo hành tương sinh, ý nghĩa dịu dàng. Gợi ý tham khảo — không phán số mệnh.',
    intro:
      'Nhập ngày sinh của bé gái để xem mệnh ngũ hành và gợi ý những cái tên hợp mệnh, ý nghĩa và đẹp — tham khảo theo phong tục, không phải lời định đoạt tương lai của con.',
    considerations: [
      'Mệnh của bé tính theo nạp âm năm sinh âm lịch (công cụ tự đổi ngày dương sang âm, tính cả mốc Tết).',
      'Theo quan niệm tương sinh, tên nên thuộc hành sinh ra mệnh bé hoặc cùng mệnh; tránh hành tương khắc.',
      'Tên con gái thường gửi gắm sự dịu dàng, tinh tế — nhưng ý nghĩa đẹp và dễ gọi mới là điều quan trọng nhất.',
      'Gợi ý tên dựa trên nghĩa chữ Hán-Việt (phổ biến nhất); một số trường phái tính theo số nét chữ.',
    ],
    faqs: [
      {
        q: 'Đặt tên con gái theo ngũ hành cần lưu ý gì?',
        a: 'Xác định mệnh ngũ hành của bé theo năm sinh, rồi chọn tên thuộc hành tương sinh (hoặc cùng mệnh) để hài hoà. Ngoài hợp mệnh, một cái tên con gái hay thường mềm mại, dễ gọi và mang ý nghĩa đẹp.',
      },
      {
        q: 'Tên con gái nên ghép đôi (tên kép) hay tên đơn?',
        a: 'Tuỳ sở thích gia đình. Tên kép (hai chữ) giúp tên phong phú và dễ chọn chữ hợp hành hơn; tên đơn gọn gàng, hiện đại. Công cụ gợi ý phần tên theo hành để bạn linh hoạt phối với tên đệm.',
      },
      {
        q: 'Tên hợp mệnh có quyết định hạnh phúc của con gái không?',
        a: 'Không. Đây chỉ là một nét văn hoá để cha mẹ gửi gắm mong ước. Một cái tên đẹp cùng tình yêu thương và sự nuôi dạy của cha mẹ mới là điều quan trọng nhất.',
      },
    ],
  },
  {
    slug: 'sinh-nam-2026',
    defaultGender: 'ca',
    label: 'Sinh năm 2026',
    emoji: '🐴',
    h1Suffix: 'con sinh năm 2026 (Bính Ngọ)',
    eyebrow: 'Đặt tên · Năm 2026',
    seoTitle: 'Đặt tên con sinh 2026 Bính Ngọ — hợp mệnh Thủy',
    seoDescription:
      'Bé sinh năm Bính Ngọ 2026 nạp âm Thiên Hà Thủy — mệnh Thủy. Gợi ý tên hợp mệnh theo hành tương sinh (Kim, Thủy), kèm ý nghĩa. Tham khảo — không phán số mệnh.',
    intro:
      'Phần lớn bé sinh trong năm 2026 thuộc năm Bính Ngọ — nạp âm Thiên Hà Thủy, mệnh Thủy. Nhập đúng ngày sinh để công cụ tính chính xác theo âm lịch (bé sinh trước Tết Bính Ngọ vẫn thuộc năm cũ), rồi xem gợi ý tên hợp mệnh.',
    considerations: [
      'Năm Bính Ngọ 2026 mang nạp âm Thiên Hà Thủy → mệnh Thủy.',
      'Theo tương sinh, bé mệnh Thủy thường hợp tên hành Kim (Kim sinh Thủy) hoặc hành Thủy; tránh hành Thổ (Thổ khắc Thủy).',
      'Tên gợi hành Thủy: Hà, Hải, Vân, Giang…; gợi hành Kim: Kim, Ngân, Cương… (theo nghĩa chữ Hán-Việt).',
      'Mốc Tết quan trọng: bé sinh đầu năm 2026 trước Tết Bính Ngọ vẫn thuộc năm Ất Tỵ — hãy nhập đúng ngày sinh để công cụ xác định mệnh.',
    ],
    faqs: [
      {
        q: 'Bé sinh năm 2026 mệnh gì?',
        a: 'Bé sinh năm Bính Ngọ 2026 thuộc nạp âm Thiên Hà Thủy, tức mệnh Thủy. Lưu ý: bé sinh trong tháng 1–2/2026 trước Tết Bính Ngọ vẫn thuộc năm Ất Tỵ (mệnh Phú Đăng Hỏa) — nên nhập đúng ngày sinh để công cụ tính theo âm lịch.',
      },
      {
        q: 'Con 2026 mệnh Thủy nên đặt tên hành nào?',
        a: 'Theo quan niệm tương sinh, mệnh Thủy hợp với tên thuộc hành Kim (Kim sinh Thủy) hoặc cùng hành Thủy để bổ trợ; thường tránh hành Thổ vì Thổ khắc Thủy. Đây là gợi ý tham khảo, không bắt buộc.',
      },
      {
        q: 'Có nhất thiết phải đặt tên hợp mệnh cho con 2026 không?',
        a: 'Không. Đặt tên theo ngũ hành chỉ là một nét văn hoá tham khảo. Một cái tên hay, ý nghĩa đẹp, dễ gọi và tình yêu thương của cha mẹ mới là điều quan trọng nhất với con.',
      },
    ],
  },
];

export function getVariant(slug: string): DatTenVariant | undefined {
  return VARIANTS.find((v) => v.slug === slug);
}
