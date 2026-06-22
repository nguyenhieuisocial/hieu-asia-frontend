/**
 * Dữ liệu cụm "Cung hoàng đạo" (chiêm tinh phương Tây — 12 cung Mặt Trời).
 *
 * GROUNDING (chống bịa — thống nhất toàn site):
 *  - Mọi dữ kiện thiên văn (cung, nguyên tố, tính chất, hành tinh chủ quản, khoảng
 *    ngày quy ước) là kiến thức chiêm tinh phương Tây chuẩn mực, kiểm chứng được.
 *  - Cung của MỘT ngày sinh cụ thể được tính bằng ENGINE thật `western-astrology.ts`
 *    (vị trí Mặt Trời theo Meeus, đã kiểm chứng <0.01° vs astronomy-engine) —
 *    KHÔNG tra bảng cứng → ranh giới cung luôn đúng theo từng năm.
 *  - Mô tả tính cách là "xu hướng" theo nguyên tố/tính chất, văn phong khám phá bản
 *    thân, KHÔNG phán số mệnh.
 *  - Độ hợp giữa các cung suy ra THEO LUẬT từ nguyên tố (triplicity) + cung đối
 *    (180°) — đúng khung chiêm tinh cổ điển, không bịa từng cặp.
 */
import {
  ZODIAC,
  ELEMENT_TENDENCY,
  julianDay,
  sunLongitude,
  type ZodiacSign,
  type ZodiacElement,
} from './western-astrology';
import type { FaqItem } from './seo/jsonld';

/** Slug 12 cung, xếp THEO idx của ZODIAC (0 = Bạch Dương … 11 = Song Ngư). */
export const CUNG_SLUGS = [
  'bach-duong',
  'kim-nguu',
  'song-tu',
  'cu-giai',
  'su-tu',
  'xu-nu',
  'thien-binh',
  'bo-cap',
  'nhan-ma',
  'ma-ket',
  'bao-binh',
  'song-ngu',
] as const;
export type CungSlug = (typeof CUNG_SLUGS)[number];

interface SignExtra {
  /** Tên tiếng Anh (người Việt cũng tìm bằng tên Anh). */
  english: string;
  /** Khoảng ngày quy ước (tropical). Mốc ranh giới lệch ±1 ngày tuỳ năm → dùng
   *  công cụ (tính theo Mặt Trời thật) cho ca sinh sát ranh giới. */
  dateLabel: string;
  /** Hành tinh chủ quản (cổ điển). */
  rulingPlanet: string;
  /** Hành tinh chủ quản theo chiêm tinh HIỆN ĐẠI (chỉ ghi khi khác cổ điển). */
  rulingPlanetModern?: string;
  /** Câu định vị ngắn. */
  tagline: string;
  strengths: string[];
  growthEdges: string[];
  love: string;
  work: string;
}

// Khoá theo idx ZODIAC. Nội dung = liên hệ chuẩn mực của từng cung theo nguyên
// tố + tính chất; trình bày dạng "xu hướng", không phán định.
const EXTRA: Record<number, SignExtra> = {
  0: {
    english: 'Aries',
    dateLabel: '21/3 – 19/4',
    rulingPlanet: 'Sao Hỏa (♂)',
    tagline: 'Người mở đường — hành động trước, nghĩ sau.',
    strengths: [
      'Dám nghĩ dám làm, khởi sự nhanh hơn hầu hết mọi người',
      'Thẳng thắn, ít vòng vo',
      'Can đảm nhận phần việc khó, không ngại va chạm',
      'Truyền năng lượng và nhiệt cho cả nhóm',
    ],
    growthEdges: [
      'Dễ nóng vội, thiếu kiên nhẫn với việc chậm',
      'Khởi đầu nhiều nhưng theo đến cùng ít',
      'Học dừng một nhịp để nghe trước khi phản ứng',
    ],
    love: 'Chủ động theo đuổi, nồng nhiệt từ đầu. Hợp người giữ được lửa và cho mình khoảng tự do để xoay.',
    work: 'Giỏi mở đường, khởi động cái mới. Tỏa sáng ở vai trò tiên phong hơn là việc lặp đi lặp lại.',
  },
  1: {
    english: 'Taurus',
    dateLabel: '20/4 – 20/5',
    rulingPlanet: 'Sao Kim (♀)',
    tagline: 'Người xây nền — chậm mà chắc, bền mà sâu.',
    strengths: [
      'Kiên nhẫn, bền bỉ, làm tới nơi tới chốn',
      'Thực tế và đáng tin, giữ lời',
      'Biết tận hưởng cái đẹp, cái ngon, sự thoải mái',
      'Giữ được bình tĩnh khi quanh mình rối ren',
    ],
    growthEdges: [
      'Ngại thay đổi, dễ bám thói quen cũ',
      'Đôi khi cứng đầu, khó lay chuyển',
      'Cẩn thận đừng để vật chất/sở hữu lấn át',
    ],
    love: 'Chậm mở lòng nhưng một khi gắn bó thì chung thủy và ấm. Cần sự ổn định và gần gũi thật.',
    work: 'Làm việc đều tay, kết quả chắc. Mạnh ở mảng cần kiên trì, tài chính và thẩm mỹ.',
  },
  2: {
    english: 'Gemini',
    dateLabel: '21/5 – 20/6',
    rulingPlanet: 'Sao Thủy (☿)',
    tagline: 'Người kết nối — tò mò, nhanh trí, đa năng.',
    strengths: [
      'Nhanh trí, học và nắm cái mới rất nhanh',
      'Giao tiếp khéo, dễ bắt chuyện và kết nối',
      'Tò mò, biết nhiều thứ, linh hoạt',
      'Xoay chuyển tốt khi hoàn cảnh đổi',
    ],
    growthEdges: [
      'Dễ phân tán, khó tập trung lâu một việc',
      'Cả thèm chóng chán',
      'Cần kỷ luật để biến lời nói thành việc làm',
    ],
    love: 'Cần trò chuyện hợp gu và đầu óc được kích thích. Sợ nhàm chán hơn sợ khoảng cách.',
    work: 'Hợp việc cần thông tin, viết lách, bán hàng, truyền thông. Giỏi cầm nhiều việc cùng lúc.',
  },
  3: {
    english: 'Cancer',
    dateLabel: '21/6 – 22/7',
    rulingPlanet: 'Mặt Trăng (☽)',
    tagline: 'Người che chở — giàu cảm xúc, gắn bó tổ ấm.',
    strengths: [
      'Giàu tình cảm, biết chăm sóc người thân',
      'Trực giác nhạy, đọc được không khí',
      'Gắn bó gia đình, trân trọng kỷ niệm',
      'Trung thành và bao dung với người mình thương',
    ],
    growthEdges: [
      'Hay giữ trong lòng, dễ hờn dỗi',
      'Tâm trạng lên xuống theo cảm xúc',
      'Tập buông những chuyện cũ đã qua',
    ],
    love: 'Ấm áp, che chở, muốn xây một tổ ấm thật. Cần cảm giác an toàn và được cần đến.',
    work: 'Mạnh ở việc cần thấu cảm và chăm sóc: giáo dục, y tế, dịch vụ, công việc nuôi dưỡng.',
  },
  4: {
    english: 'Leo',
    dateLabel: '23/7 – 22/8',
    rulingPlanet: 'Mặt Trời (☉)',
    tagline: 'Người tỏa sáng — ấm áp, tự tin, hào phóng.',
    strengths: [
      'Tự tin, dám đứng ra dẫn dắt',
      'Hào phóng, ấm áp với người quanh mình',
      'Cuốn hút, biết truyền cảm hứng',
      'Trung thành và chân thành',
    ],
    growthEdges: [
      'Cần được công nhận, dễ tự ái khi bị phớt lờ',
      'Đôi khi muốn làm trung tâm',
      'Tập lắng nghe và nhường ánh đèn cho người khác',
    ],
    love: 'Nồng nhiệt, lãng mạn, yêu là hết mình. Cần được trân trọng và tự hào về người mình yêu.',
    work: 'Tỏa sáng ở vai trò dẫn dắt, trình diễn, sáng tạo. Làm tốt nhất khi nỗ lực được ghi nhận.',
  },
  5: {
    english: 'Virgo',
    dateLabel: '23/8 – 22/9',
    rulingPlanet: 'Sao Thủy (☿)',
    tagline: 'Người hoàn thiện — tỉ mỉ, thực tế, tận tâm.',
    strengths: [
      'Tỉ mỉ, cẩn thận, ít bỏ sót chi tiết',
      'Giỏi phân tích và cải thiện mọi thứ cho hữu ích hơn',
      'Tận tâm phục vụ, làm việc có trách nhiệm',
      'Thực tế và đáng tin với việc cần chính xác',
    ],
    growthEdges: [
      'Hay cầu toàn, tự phê bình hơi nặng',
      'Dễ lo lắng những tiểu tiết nhỏ',
      'Tập hài lòng với "đủ tốt" thay vì "hoàn hảo"',
    ],
    love: 'Thể hiện tình cảm qua hành động chăm lo cụ thể. Cần người trân trọng sự tận tụy thầm lặng.',
    work: 'Xuất sắc ở việc cần chính xác và quy trình: kiểm soát chất lượng, biên tập, y tế, phân tích.',
  },
  6: {
    english: 'Libra',
    dateLabel: '23/9 – 22/10',
    rulingPlanet: 'Sao Kim (♀)',
    tagline: 'Người cân bằng — công bằng, khéo léo, yêu cái đẹp.',
    strengths: [
      'Coi trọng công bằng, giỏi nhìn nhiều phía',
      'Khéo dung hòa, làm dịu căng thẳng',
      'Gu thẩm mỹ tốt, yêu cái đẹp và sự hài hòa',
      'Dễ mến, biết hợp tác',
    ],
    growthEdges: [
      'Khó ra quyết định, hay phân vân',
      'Ngại xung đột nên đôi khi nể nang quá mức',
      'Tập đứng vững với chính kiến của mình',
    ],
    love: 'Coi trọng sự hài hòa, lãng mạn và bình đẳng. Thường sống tốt nhất khi có một nửa song hành.',
    work: 'Hợp việc cần cân bằng lợi ích: đàm phán, thiết kế, luật, quan hệ công chúng.',
  },
  7: {
    english: 'Scorpio',
    dateLabel: '23/10 – 21/11',
    rulingPlanet: 'Sao Hỏa (♂)',
    rulingPlanetModern: 'Sao Diêm Vương (♇)',
    tagline: 'Người chiều sâu — mãnh liệt, kiên định, trực giác sắc.',
    strengths: [
      'Sâu sắc, đi tới tận cùng bản chất sự việc',
      'Ý chí mạnh, kiên định với điều đã chọn',
      'Trực giác sắc bén, nhìn thấu người khác',
      'Trung thành tuyệt đối với người mình tin tưởng',
    ],
    growthEdges: [
      'Hay ghen và muốn kiểm soát',
      'Khó tha thứ, dễ giữ trong lòng',
      'Tập mở lòng và tin tưởng thay vì luôn phòng thủ',
    ],
    love: 'Yêu sâu và hết mình, cần sự thật lòng và chiều sâu. Khó chấp nhận phản bội.',
    work: 'Mạnh ở việc cần đào sâu: nghiên cứu, điều tra, tâm lý, tài chính, xoay chuyển khủng hoảng.',
  },
  8: {
    english: 'Sagittarius',
    dateLabel: '22/11 – 21/12',
    rulingPlanet: 'Sao Mộc (♃)',
    tagline: 'Người lữ hành — lạc quan, yêu tự do, ham khám phá.',
    strengths: [
      'Lạc quan, nhìn về phía trước',
      'Ham học hỏi và khám phá điều mới',
      'Chân thành, thẳng thắn',
      'Tầm nhìn rộng, hướng tới ý nghĩa lớn',
    ],
    growthEdges: [
      'Thiếu kiên nhẫn với chi tiết và thủ tục',
      'Hứa nhiều, đôi khi ngại ràng buộc',
      'Nói thẳng quá đôi khi vô ý làm người khác đau',
    ],
    love: 'Cần một người bạn đồng hành cùng phiêu lưu và tôn trọng tự do của nhau. Sợ gò bó.',
    work: 'Hợp việc liên quan du lịch, giáo dục, xuất bản, quốc tế, mở rộng thị trường.',
  },
  9: {
    english: 'Capricorn',
    dateLabel: '22/12 – 19/1',
    rulingPlanet: 'Sao Thổ (♄)',
    tagline: 'Người leo núi — kỷ luật, kiên nhẫn, xây dài hạn.',
    strengths: [
      'Kỷ luật và trách nhiệm cao',
      'Kiên nhẫn xây mục tiêu dài hạn từng bước',
      'Thực tế, đáng tin, chịu khó',
      'Bền chí, không bỏ cuộc giữa chừng',
    ],
    growthEdges: [
      'Dễ quá nghiêm túc, ôm việc vào mình',
      'Đôi khi coi nhẹ cảm xúc và nghỉ ngơi',
      'Sợ thất bại nên ngại thử cái rủi ro',
    ],
    love: 'Thể hiện qua cam kết và lo toan thực tế. Chậm mở lòng nhưng một khi đã chọn thì bền.',
    work: 'Leo bậc thang sự nghiệp bài bản. Mạnh ở quản lý, vận hành, tài chính, việc cần uy tín dài lâu.',
  },
  10: {
    english: 'Aquarius',
    dateLabel: '20/1 – 18/2',
    rulingPlanet: 'Sao Thổ (♄)',
    rulingPlanetModern: 'Sao Thiên Vương (♅)',
    tagline: 'Người khác biệt — độc lập, sáng tạo, đi trước thời đại.',
    strengths: [
      'Độc lập, có chính kiến riêng',
      'Sáng tạo, tư duy cởi mở, đi trước thời đại',
      'Quan tâm cộng đồng và điều công bằng',
      'Khách quan, nhìn việc bằng lý trí',
    ],
    growthEdges: [
      'Đôi khi xa cách về mặt cảm xúc',
      'Bướng theo cách riêng của mình',
      'Tập để lý trí và sự gần gũi cùng tồn tại',
    ],
    love: 'Cần là bạn tri kỷ trước khi là người yêu. Trân trọng tự do và sự khác biệt của nhau.',
    work: 'Hợp công nghệ, đổi mới, khoa học, hoạt động xã hội — việc cần ý tưởng khác thường.',
  },
  11: {
    english: 'Pisces',
    dateLabel: '19/2 – 20/3',
    rulingPlanet: 'Sao Mộc (♃)',
    rulingPlanetModern: 'Sao Hải Vương (♆)',
    tagline: 'Người mơ mộng — đồng cảm, tinh tế, giàu trực giác.',
    strengths: [
      'Giàu trí tưởng tượng và chất nghệ sĩ',
      'Đồng cảm sâu, dễ thấu hiểu người khác',
      'Bao dung, vị tha',
      'Trực giác mạnh, nhạy với điều tinh tế',
    ],
    growthEdges: [
      'Dễ mơ mộng, đôi khi xa rời thực tế',
      'Hay nhập tâm cảm xúc của người khác',
      'Tập đặt ranh giới và đối mặt thay vì trốn tránh',
    ],
    love: 'Lãng mạn, sẵn lòng hy sinh, dễ hòa vào người mình yêu. Cần ranh giới lành mạnh để không đánh mất mình.',
    work: 'Tỏa sáng ở nghệ thuật, chữa lành, việc cần trực giác và lòng trắc ẩn.',
  },
};

/** Nguyên tố bổ trợ (Lửa↔Khí cùng "dương/chủ động"; Đất↔Nước cùng "âm/tiếp nhận"). */
const ELEMENT_SUPPORT: Record<ZodiacElement, ZodiacElement> = {
  Lửa: 'Khí',
  Khí: 'Lửa',
  Đất: 'Nước',
  Nước: 'Đất',
};

export interface SignRef {
  name: string;
  slug: string;
  symbol: string;
}

function refOf(idx: number): SignRef {
  const z = ZODIAC[idx]!;
  return { name: z.name, slug: CUNG_SLUGS[idx]!, symbol: z.symbol };
}

/**
 * Tính cung Mặt Trời (sun sign) cho một ngày sinh bằng ENGINE THẬT — không tra bảng.
 * Dùng cho công cụ "Bạn là cung gì?" (chạy cả ở client). Giờ mặc định 12:00 (cung
 * Mặt Trời hầu như không phụ thuộc giờ trừ ca sinh sát ranh giới — đã gắn cờ nearCusp).
 */
export function sunSignFromDate(
  year: number,
  month: number,
  day: number,
): { sign: ZodiacSign; slug: string; nearCusp: boolean } {
  const jd = julianDay(year, month, day, 12, 0, 0);
  const lon = ((sunLongitude(jd) % 360) + 360) % 360;
  const idx = Math.floor(lon / 30) % 12;
  const degreeInSign = lon - idx * 30;
  return {
    sign: ZODIAC[idx]!,
    slug: CUNG_SLUGS[idx]!,
    nearCusp: degreeInSign < 1 || degreeInSign > 29,
  };
}

export interface CungData {
  idx: number;
  slug: string;
  z: ZodiacSign;
  extra: SignExtra;
  elementTendency: string;
  /** Cung đối (180°) — vừa hút vừa thử thách. */
  opposite: SignRef;
  /** Hợp tự nhiên: cùng nguyên tố (2 cung còn lại). */
  sameElement: SignRef[];
  /** Bổ trợ: nguyên tố bổ trợ (3 cung). */
  support: SignRef[];
  supportElement: ZodiacElement;
  faqs: FaqItem[];
  seoTitle: string;
  seoDescription: string;
}

/** Dòng tóm tắt cho danh sách hub (lưới 12 cung). */
export interface CungSummary extends SignRef {
  element: ZodiacElement;
  quality: ZodiacSign['quality'];
  dateLabel: string;
  tagline: string;
}

export function listCung(): CungSummary[] {
  return ZODIAC.map((z) => ({
    name: z.name,
    slug: CUNG_SLUGS[z.idx]!,
    symbol: z.symbol,
    element: z.element,
    quality: z.quality,
    dateLabel: EXTRA[z.idx]!.dateLabel,
    tagline: EXTRA[z.idx]!.tagline,
  }));
}

export function buildCung(slug: string): CungData | null {
  const idx = (CUNG_SLUGS as readonly string[]).indexOf(slug);
  if (idx < 0) return null;
  const z = ZODIAC[idx]!;
  const extra = EXTRA[idx]!;

  const sameElement: SignRef[] = ZODIAC.filter(
    (o) => o.element === z.element && o.idx !== idx,
  ).map((o) => refOf(o.idx));
  const supportElement = ELEMENT_SUPPORT[z.element];
  // Cung đối (idx+6) LUÔN cùng nguyên tố bổ trợ (cùng polarity) → phải loại khỏi
  // danh sách "bổ trợ" để "Bổ trợ" và "Cung đối" không trùng nhau (opposition ≠
  // sextile). Còn lại đúng 2 cung bổ trợ thật.
  const oppIdx = (idx + 6) % 12;
  const support: SignRef[] = ZODIAC.filter(
    (o) => o.element === supportElement && o.idx !== oppIdx,
  ).map((o) => refOf(o.idx));
  const opposite = refOf(oppIdx);

  const planetLine = extra.rulingPlanetModern
    ? `${extra.rulingPlanet} (hiện đại: ${extra.rulingPlanetModern})`
    : extra.rulingPlanet;

  const faqs: FaqItem[] = [
    {
      q: `Cung ${z.name} sinh ngày nào?`,
      a: `Cung ${z.name} (${extra.english}) ứng với người sinh khoảng ${extra.dateLabel}. Mốc ranh giới có thể lệch một ngày tuỳ năm; nếu bạn sinh sát đầu hoặc cuối khoảng này, hãy dùng công cụ "Bạn là cung gì?" — nó tính theo vị trí Mặt Trời thật cho đúng ngày của bạn.`,
    },
    {
      q: `Cung ${z.name} hợp với cung nào nhất?`,
      a: `Theo nguyên tố, ${z.name} (${z.element}) hòa hợp tự nhiên với ${sameElement
        .map((s) => s.name)
        .join(', ')} (cùng ${z.element}) và được bổ trợ bởi ${support
        .map((s) => s.name)
        .join(', ')} (${supportElement}). Cung đối là ${opposite.name} — kiểu hợp "vừa hút vừa thử thách". Đây là xu hướng chung; độ hợp thật của hai người còn tùy lá số đầy đủ, không chỉ cung Mặt Trời.`,
    },
    {
      q: `Cung ${z.name} thuộc nguyên tố gì, do hành tinh nào chủ quản?`,
      a: `${z.name} thuộc nguyên tố ${z.element}, tính chất ${z.quality}, hành tinh chủ quản là ${planetLine}. Người nhiều ${z.element} thường ${ELEMENT_TENDENCY[z.element]}`,
    },
    {
      q: `Tính cách cung ${z.name} có đúng với mọi người cùng cung không?`,
      a: `Không hoàn toàn. Cung Mặt Trời chỉ là MỘT mảnh của bản đồ sao. Cung Mọc, Mặt Trăng và các hành tinh khác — vốn phụ thuộc giờ và nơi sinh — mới vẽ nên bức tranh đầy đủ. Vì vậy hai người cùng cung ${z.name} vẫn có thể rất khác nhau. Đây là gợi ý để hiểu mình, không phải lời phán số mệnh.`,
    },
  ];

  const seoTitle = `Cung ${z.name} (${extra.dateLabel}): tính cách, hợp cung nào, tình yêu & sự nghiệp`;
  const seoDescription = `Cung ${z.name} — ${extra.english}, nguyên tố ${z.element}, ${z.quality}, chủ quản bởi ${extra.rulingPlanet}. Tính cách, điểm mạnh, điều nên lưu ý, cung hợp và xu hướng tình yêu – công việc. Tính theo thiên văn thật, tham khảo, không phán số mệnh.`;

  return {
    idx,
    slug,
    z,
    extra,
    elementTendency: ELEMENT_TENDENCY[z.element],
    opposite,
    sameElement,
    support,
    supportElement,
    faqs,
    seoTitle,
    seoDescription,
  };
}
