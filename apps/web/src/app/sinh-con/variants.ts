/**
 * Per-variant landing config cho "Sinh con theo năm — đối chiếu tuổi bố mẹ".
 *
 * Mỗi entry là một static SEO landing /sinh-con/<slug> tái dùng SinhConChecker
 * (engine: lib/sinh-con.ts — nạp âm + quan hệ Can Chi đều deterministic) với
 * metadata + nội dung giáo dục + FAQ riêng để là trang THỰC CHẤT, không phải
 * thin doorway. Trang năm (kind 'year') render thêm bảng 12 con giáp tính từ
 * engine — nội dung unique theo năm.
 *
 * Brand voice: đối chiếu theo quan niệm để tham khảo — em bé nào cũng là phúc,
 * KHÔNG có chuyện con "khắc" bố mẹ. Số liệu ngày Tết trong copy đã verify bằng
 * scripts/verify-sinh-con.ts (mùng 1 Bính Ngọ = 17/02/2026 · Đinh Mùi = 06/02/2027).
 */

export interface SinhConVariant {
  slug: string;
  /** Trang năm render thêm hồ sơ năm + bảng 12 con giáp từ engine. */
  year?: number;
  /** Năm preset cho checker. */
  defaultYear: number;
  label: string;
  emoji: string;
  /** Suffix sau chữ vàng "Sinh con", vd "năm 2027 Đinh Mùi". */
  h1Suffix: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  considerations: string[];
  faqs: { q: string; a: string }[];
}

export const VARIANTS: SinhConVariant[] = [
  {
    slug: 'nam-2026',
    year: 2026,
    defaultYear: 2026,
    label: 'Năm 2026',
    emoji: '🐴',
    h1Suffix: 'năm 2026 Bính Ngọ',
    eyebrow: 'Sinh con · Năm 2026',
    seoTitle: 'Sinh con năm 2026 Bính Ngọ — bé mệnh gì, hợp tuổi bố mẹ nào?',
    seoDescription:
      'Bé sinh năm 2026 Bính Ngọ tuổi Ngọ, mệnh Thủy (Thiên Hà Thủy). Đối chiếu với 12 con giáp của bố mẹ: tam hợp Dần – Tuất, lục hợp Mùi, nhóm cần dung hoà Tý, Sửu. Tham khảo theo phong tục, không phán định.',
    intro:
      'Nhập năm sinh của bố mẹ để đối chiếu với bé sinh năm 2026 (Bính Ngọ — tuổi Ngọ, mệnh Thiên Hà Thủy) theo quan niệm Can Chi và ngũ hành. Đây là tham khảo phong tục — em bé nào cũng là phúc của gia đình.',
    considerations: [
      'Bé sinh từ 17/02/2026 (mùng 1 Tết) mới thuộc năm âm Bính Ngọ; sinh trước đó thuộc năm Ất Tỵ 2025.',
      'Bé tuổi Ngọ thuộc nhóm tam hợp Dần – Ngọ – Tuất; bố mẹ tuổi Dần, Tuất là tín hiệu tham khảo đẹp.',
      'Bố mẹ tuổi Mùi tạo cặp lục hợp với bé tuổi Ngọ ("Ngọ – Mùi" là một trong 6 cặp lục hợp).',
      'Bố mẹ tuổi Tý (lục xung) hoặc Sửu (lục hại) — hiểu lành mạnh là "khác nhịp, cần thêm kiên nhẫn", không phải điềm xấu.',
      'Mệnh bé là Thủy (Thiên Hà Thủy — "nước trên trời"): đối chiếu mệnh bố mẹ theo vòng tương sinh Kim → Thủy → Mộc.',
    ],
    faqs: [
      {
        q: 'Bé sinh năm 2026 mệnh gì, tuổi gì?',
        a: 'Năm 2026 là Bính Ngọ. Bé tuổi Ngọ (ngựa), mệnh Thủy — nạp âm Thiên Hà Thủy (nước trên trời, gắn với mưa móc tươi nhuần). Lưu ý mốc Tết: từ 17/02/2026 mới sang năm Bính Ngọ; bé sinh tháng 1 đến giữa tháng 2/2026 vẫn thuộc năm Ất Tỵ 2025, tuổi Tỵ, mệnh Hỏa.',
      },
      {
        q: 'Bố mẹ tuổi nào hợp sinh con năm 2026?',
        a: 'Theo Can Chi, tuổi Ngọ cùng nhóm tam hợp với Dần và Tuất, và tạo cặp lục hợp với Mùi — đó là các tín hiệu tham khảo đẹp. Nhưng đây chỉ là một lát cắt phong tục: không có "tuổi xấu" để sinh con, và rất nhiều gia đình bố mẹ thuộc nhóm "xung – hại" vẫn êm ấm trọn vẹn.',
      },
      {
        q: 'Bố/mẹ tuổi Tý, Sửu có nên kiêng sinh con năm 2026?',
        a: 'Không cần kiêng. Tý – Ngọ là cặp lục xung, Sửu – Ngọ là cặp lục hại theo quan niệm xưa — cách hiểu lành mạnh là hai "nhịp" tính cách khác nhau, bố mẹ có thể cần kiên nhẫn hơn khi đồng hành cùng con. Sức khoẻ của mẹ, sự chuẩn bị của gia đình và tình thương mới là điều quyết định.',
      },
      {
        q: 'Sinh con năm 2026 tháng nào tốt?',
        a: 'Chúng tôi không "chấm điểm" tháng sinh — thời điểm sinh phụ thuộc sức khoẻ mẹ và chỉ định y khoa, và nên theo lời bác sĩ. Nếu gia đình muốn chọn ngày làm các việc liên quan (đầy tháng, về nhà mới…), có thể tham khảo công cụ Xem ngày tốt.',
      },
    ],
  },
  {
    slug: 'nam-2027',
    year: 2027,
    defaultYear: 2027,
    label: 'Năm 2027',
    emoji: '🐐',
    h1Suffix: 'năm 2027 Đinh Mùi',
    eyebrow: 'Sinh con · Năm 2027',
    seoTitle: 'Sinh con năm 2027 Đinh Mùi — bé mệnh gì, hợp tuổi bố mẹ nào?',
    seoDescription:
      'Bé sinh năm 2027 Đinh Mùi tuổi Mùi, mệnh Thủy (Thiên Hà Thủy). Đối chiếu với 12 con giáp của bố mẹ: tam hợp Hợi – Mão, lục hợp Ngọ, nhóm cần dung hoà Sửu, Tý. Tham khảo theo phong tục, không phán định.',
    intro:
      'Nhiều gia đình lên kế hoạch đón bé từ trước cả năm. Nhập năm sinh của bố mẹ để đối chiếu với bé sinh năm 2027 (Đinh Mùi — tuổi Mùi, mệnh Thiên Hà Thủy) theo quan niệm Can Chi và ngũ hành — tham khảo phong tục, không phán định.',
    considerations: [
      'Bé sinh từ 06/02/2027 (mùng 1 Tết) mới thuộc năm âm Đinh Mùi; sinh trước đó thuộc năm Bính Ngọ 2026.',
      'Bé tuổi Mùi thuộc nhóm tam hợp Hợi – Mão – Mùi; bố mẹ tuổi Hợi, Mão là tín hiệu tham khảo đẹp.',
      'Bố mẹ tuổi Ngọ tạo cặp lục hợp với bé tuổi Mùi ("Ngọ – Mùi").',
      'Bố mẹ tuổi Sửu (lục xung) hoặc Tý (lục hại) — hiểu lành mạnh là "khác nhịp, cần thêm kiên nhẫn", không phải điềm xấu.',
      'Mệnh bé là Thủy (Thiên Hà Thủy, cùng nạp âm với 2026 — hai năm Bính Ngọ · Đinh Mùi chung một nạp âm theo vòng 60 Giáp Tý).',
    ],
    faqs: [
      {
        q: 'Bé sinh năm 2027 mệnh gì, tuổi gì?',
        a: 'Năm 2027 là Đinh Mùi. Bé tuổi Mùi (dê), mệnh Thủy — nạp âm Thiên Hà Thủy (nước trên trời). Lưu ý mốc Tết: từ 06/02/2027 mới sang năm Đinh Mùi; bé sinh tháng 1 hoặc đầu tháng 2/2027 vẫn thuộc năm Bính Ngọ 2026, tuổi Ngọ.',
      },
      {
        q: 'Bố mẹ tuổi nào hợp sinh con năm 2027?',
        a: 'Theo Can Chi, tuổi Mùi cùng nhóm tam hợp với Hợi và Mão, và tạo cặp lục hợp với Ngọ — các tín hiệu tham khảo đẹp. Đây là một lát cắt phong tục để gia đình thêm góc nhìn; không có "tuổi xấu" để sinh con.',
      },
      {
        q: 'Vợ chồng cùng đối chiếu thì nhập thế nào?',
        a: 'Nhập cả năm sinh mẹ và bố — công cụ đối chiếu từng người với bé (quan hệ con giáp + mệnh ngũ hành). Nếu muốn xem bức tranh cả nhà nhiều hơn 3 người (thêm anh/chị của bé, ông bà), dùng công cụ Xem hợp nhóm.',
      },
      {
        q: 'Quan niệm "con khắc tuổi bố mẹ" có đáng lo không?',
        a: 'Không. "Xung – hại – khắc" trong Can Chi là cách người xưa mô tả sự khác nhịp giữa hai tuổi, không phải lời phán về phúc hoạ. Không có bằng chứng nào cho việc con "khắc" cha mẹ; em bé nào cũng là phúc. Chúng tôi hiển thị các nhóm này kèm cách hiểu dung hoà để gia đình tham khảo có chừng mực.',
      },
    ],
  },
  {
    slug: 'hop-tuoi-bo-me',
    defaultYear: 2027,
    label: 'Hợp tuổi bố mẹ',
    emoji: '👨‍👩‍👧',
    h1Suffix: 'hợp tuổi bố mẹ',
    eyebrow: 'Sinh con · Hợp tuổi bố mẹ',
    seoTitle: 'Sinh con hợp tuổi bố mẹ — cách đối chiếu con giáp & mệnh (tham khảo)',
    seoDescription:
      'Cách đối chiếu tuổi bố mẹ với năm sinh con theo Can Chi (Tam Hợp, Lục Hợp, Lục Xung, Lục Hại) và mệnh nạp âm (tương sinh – tương khắc). Giải thích minh bạch từng quy tắc — tham khảo phong tục, không phán định.',
    intro:
      'Trang này giải thích minh bạch cách dân gian đối chiếu tuổi bố mẹ với năm sinh của con — gồm quan hệ 12 con giáp (Tam Hợp, Lục Hợp, Lục Xung, Lục Hại) và mệnh nạp âm (tương sinh, tương khắc) — kèm công cụ thử ngay. Tất cả là quan niệm tham khảo: em bé nào cũng là phúc.',
    considerations: [
      'Tam Hợp: 4 nhóm 3 con giáp "cùng nhịp" (Thân–Tý–Thìn, Dần–Ngọ–Tuất, Tỵ–Dậu–Sửu, Hợi–Mão–Mùi).',
      'Lục Hợp: 6 cặp bổ trợ (Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi).',
      'Lục Xung / Lục Hại: các cặp "khác nhịp" — hiểu là lời nhắc dung hoà, không phải điềm xấu.',
      'Mệnh nạp âm theo năm sinh âm lịch (vòng 60 Giáp Tý); đối chiếu theo vòng tương sinh Kim → Thủy → Mộc → Hỏa → Thổ → Kim.',
      'Tuổi luôn tính theo năm ÂM lịch — người sinh tháng 1–2 dương cần để ý mốc Tết.',
    ],
    faqs: [
      {
        q: 'Đối chiếu tuổi bố mẹ với con dựa trên quy tắc nào?',
        a: 'Hai lớp: (1) quan hệ 12 con giáp theo Can Chi — Tam Hợp và Lục Hợp được xem là "cùng nhịp/bổ trợ", Lục Xung và Lục Hại là "khác nhịp, cần dung hoà"; (2) mệnh nạp âm của hai năm sinh — đối chiếu tương sinh, tương khắc theo vòng ngũ hành. Cả hai đều là quy tắc cổ điển, minh bạch, tính ra được — chúng tôi hiển thị đúng quy tắc kèm cách hiểu dung hoà.',
      },
      {
        q: '"Con khắc tuổi bố mẹ" có thật không?',
        a: 'Đây là quan niệm dân gian, không phải sự thật khoa học, và không nên là lý do để lo lắng hay trì hoãn kế hoạch gia đình. Cách chúng tôi trình bày: nêu đúng nhóm Can Chi (kể cả xung/hại) nhưng kèm cách hiểu lành mạnh — khác nhịp thì thêm kiên nhẫn. Em bé không bao giờ "mang lỗi" với cha mẹ.',
      },
      {
        q: 'Nên "chọn năm sinh con" theo tuổi bố mẹ không?',
        a: 'Sức khoẻ của mẹ, điều kiện gia đình và lời khuyên y khoa luôn quan trọng hơn năm sinh. Nếu gia đình đằng nào cũng phân vân giữa vài thời điểm, bảng đối chiếu này là một góc nhìn phong tục để tham khảo thêm — không phải tiêu chí quyết định.',
      },
      {
        q: 'Khác gì công cụ Hợp Tuổi và Xem Hợp Nhóm?',
        a: 'Hợp Tuổi đối chiếu hai người lớn (vợ chồng, đối tác); Xem Hợp Nhóm xem từ 3 người trở lên. Trang Sinh Con tập trung vào quan hệ bố/mẹ với em bé theo năm sinh dự kiến — kèm mệnh nạp âm của bé để gia đình xem luôn gợi ý đặt tên hợp mệnh.',
      },
    ],
  },
];

export function getVariant(slug: string): SinhConVariant | undefined {
  return VARIANTS.find((v) => v.slug === slug);
}
