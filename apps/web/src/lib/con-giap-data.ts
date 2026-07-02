/**
 * Dữ liệu trang chi tiết cho cụm "12 Con Giáp" (/learn/con-giap/[slug]).
 *
 * WRAP, KHÔNG viết lại: nguồn sự thật về 12 con giáp (slug, tên, ngũ hành,
 * emoji, blurb) và mọi quan hệ Tam Hợp / Lục Xung lấy từ `hop-tuoi-pairs.ts`
 * (ZODIAC + relationOf). Năm sinh ví dụ suy ra bằng engine thật
 * `xem-tuoi-cuoi.ts` (canChiOfYear) — không tra bảng cứng.
 *
 * PHẦN MỚI DUY NHẤT = EXTRA: tagline + điểm mạnh + điều nên luyện + xu hướng
 * nghề + tình cảm cho từng con giáp. Đây là mô tả tính cách con-giáp dân gian
 * phổ biến (miền công cộng), NEO theo ngũ hành + blurb sẵn có (mở rộng, KHÔNG
 * mâu thuẫn). Giọng "tham khảo, không phán số mệnh": không bói toán, không
 * số/màu/hướng may mắn, không ngôn ngữ hù doạ "đại kỵ/khắc".
 *
 * LƯU Ý TÊN GỌI: con giáp thứ 4 trong tiếng Việt là **Mèo** (không phải Thỏ như
 * Trung Quốc). Kho ZODIAC giữ `ten: 'Mão'` (địa chi) — tầng trình bày nên hiển
 * thị "Mão (Mèo)". KHÔNG sửa hop-tuoi-pairs.ts.
 */
import { ZODIAC, findZodiac, relationOf, type Zodiac } from './hop-tuoi-pairs';
import { canChiOfYear } from './xem-tuoi-cuoi';
import type { FaqItem } from './seo/jsonld';

/** Slug 12 con giáp, theo đúng thứ tự địa chi trong ZODIAC. */
export const CON_GIAP_SLUGS = ZODIAC.map((z) => z.slug);

interface ChiExtra {
  /** Câu định vị ngắn. */
  tagline: string;
  strengths: string[];
  /** "Điều nên luyện" — không định mệnh, luôn kèm hướng phát triển. */
  growthEdges: string[];
  /** 1-2 câu, kết bằng "xu hướng tham khảo, không giới hạn". */
  career: string;
  love: string;
}

// Khoá theo slug. Nội dung = mô tả tính cách con-giáp dân gian phổ biến, mở rộng
// từ blurb + ngũ hành của từng chi; trình bày dạng "xu hướng", không phán định.
const EXTRA: Record<string, ChiExtra> = {
  ty: {
    tagline: 'Người xoay xở — nhanh nhạy, quan sát tinh, thích ứng khéo.',
    strengths: [
      'Nhanh trí, nắm bắt tình huống mới rất nhanh',
      'Quan sát tinh tế, ít bỏ sót chi tiết quanh mình',
      'Linh hoạt, xoay xở khéo khi hoàn cảnh đổi',
      'Tiết kiệm, biết lo xa và vun vén',
    ],
    growthEdges: [
      'Nên luyện chọn ưu tiên thay vì ôm nhiều việc một lúc',
      'Nên tập tin người và giao bớt việc cho người khác',
      'Nên dành thời gian đi sâu một hướng thay vì rải mỏng',
    ],
    career: 'Hợp mảng cần nhạy bén và ứng biến: kinh doanh, môi giới, phân tích, dịch vụ. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Ấm áp và biết chăm chút người thân, chỉ cần học cách mở lòng chia sẻ suy nghĩ thật thay vì tự xoay một mình.',
  },
  suu: {
    tagline: 'Người xây nền — bền bỉ, kiên định, đáng tin.',
    strengths: [
      'Kiên trì, làm tới nơi tới chốn những việc dài hạn',
      'Đáng tin, giữ lời và giữ cam kết',
      'Chăm chỉ, chịu khó, không ngại việc nặng',
      'Vững vàng, ít bị cuốn theo cảm xúc nhất thời',
    ],
    growthEdges: [
      'Nên tập cởi mở hơn với cách làm mới thay vì bám lối cũ',
      'Nên luyện linh hoạt khi hoàn cảnh đổi thay',
      'Nên chia sẻ cảm xúc nhiều hơn thay vì giữ trong lòng',
    ],
    career: 'Hợp việc cần kiên nhẫn và nền tảng vững: kỹ thuật, sản xuất, nông nghiệp, tài chính, vận hành. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Chậm mở lòng nhưng một khi gắn bó thì chung thuỷ và bền, cần một người trân trọng sự tận tuỵ thầm lặng.',
  },
  dan: {
    tagline: 'Người mở đường — mạnh mẽ, dũng cảm, truyền cảm hứng.',
    strengths: [
      'Dám nghĩ dám làm, không ngại thử thách',
      'Truyền năng lượng và cảm hứng cho người quanh mình',
      'Chính trực, thẳng thắn bảo vệ lẽ phải',
      'Tự tin dẫn dắt, sẵn sàng nhận phần khó',
    ],
    growthEdges: [
      'Nên luyện giữ nhịp để không đốt sức quá nhanh',
      'Nên tập kiên nhẫn và lắng nghe trước khi hành động',
      'Nên dành chỗ cho ý kiến khác thay vì áp đặt',
    ],
    career: 'Hợp vai trò tiên phong và dẫn dắt: khởi nghiệp, quản lý, thể thao, các nghề cần bản lĩnh. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Nồng nhiệt và che chở, hợp người giữ được lửa và cho mình khoảng tự do để bung năng lượng.',
  },
  mao: {
    tagline: 'Người giữ hoà khí — tinh tế, ôn hoà, khéo léo.',
    strengths: [
      'Tinh tế, nhạy với cảm xúc và không khí xung quanh',
      'Ôn hoà, giỏi giữ hoà khí trong các mối quan hệ',
      'Lịch thiệp, dễ mến, biết cách cư xử',
      'Gu thẩm mỹ tốt, yêu sự nhẹ nhàng và hài hoà',
    ],
    growthEdges: [
      'Nên luyện đối diện quyết định khó thay vì trì hoãn',
      'Nên tập nói thẳng chính kiến khi cần',
      'Nên bớt ngại va chạm để bảo vệ điều mình coi trọng',
    ],
    career: 'Hợp việc cần sự khéo léo và thẩm mỹ: ngoại giao, dịch vụ, thiết kế, chăm sóc khách hàng, tư vấn. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Dịu dàng và biết nhường nhịn, cần một người kiên nhẫn giúp mình cởi mở và cùng ra quyết định.',
  },
  thin: {
    tagline: 'Người dẫn dắt — tự tin, tầm nhìn, giàu năng lượng.',
    strengths: [
      'Có tầm nhìn và hoài bão lớn',
      'Tự tin, hợp vai trò đứng mũi chịu sào',
      'Năng lượng dồi dào, dám theo đuổi mục tiêu lớn',
      'Rộng lượng, sẵn lòng nâng đỡ người quanh mình',
    ],
    growthEdges: [
      'Nên luyện lắng nghe nhiều hơn để giữ sự đồng thuận',
      'Nên tập kiềm chế cái tôi khi làm việc nhóm',
      'Nên chấp nhận ý kiến khác thay vì luôn muốn dẫn dắt',
    ],
    career: 'Hợp vai trò lãnh đạo và sáng tạo tầm nhìn: quản lý, khởi nghiệp, truyền thông, các nghề cần sức bật. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Nồng nhiệt và tận tâm với người mình chọn, cần học cách lắng nghe để cùng nhau đi đường dài.',
  },
  ti: {
    tagline: 'Người chiều sâu — sâu sắc, điềm tĩnh, trực giác tốt.',
    strengths: [
      'Sâu sắc, nhìn thấu bản chất tình huống',
      'Điềm tĩnh, giữ được bình tĩnh khi quanh mình rối ren',
      'Trực giác nhạy bén khi đọc người và việc',
      'Kiên định với mục tiêu đã chọn',
    ],
    growthEdges: [
      'Nên luyện chủ động chia sẻ để người khác hiểu mình hơn',
      'Nên tập mở lòng và tin tưởng thay vì luôn giữ kín',
      'Nên bớt nghi ngại để cộng tác cởi mở hơn',
    ],
    career: 'Hợp việc cần đào sâu và chiến lược: nghiên cứu, tài chính, tư vấn, các nghề cần chuyên môn kín kẽ. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Yêu sâu và chung thuỷ, cần sự chân thành và chiều sâu; nên tập nói ra cảm xúc thay vì giữ trong lòng.',
  },
  ngo: {
    tagline: 'Người tự do — nhiệt tình, phóng khoáng, năng động.',
    strengths: [
      'Nhiệt tình, tràn đầy năng lượng và tinh thần lạc quan',
      'Phóng khoáng, cởi mở, dễ kết giao',
      'Nhanh nhẹn, dám hành động và bứt tốc',
      'Chân thành, thẳng thắn trong giao tiếp',
    ],
    growthEdges: [
      'Nên dành chỗ để nghỉ và tránh ôm việc vượt sức',
      'Nên luyện kiên nhẫn theo một việc tới cùng',
      'Nên tập lắng đọng để cân nhắc trước khi quyết',
    ],
    career: 'Hợp việc năng động, nhiều di chuyển: kinh doanh, du lịch, thể thao, sự kiện, bán hàng. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Nồng nhiệt và tự do, hợp người đồng hành cùng khám phá và tôn trọng không gian riêng của nhau.',
  },
  mui: {
    tagline: 'Người vun vén — hiền hoà, quan tâm, ấm áp.',
    strengths: [
      'Hiền hoà, biết quan tâm và tạo cảm giác an toàn',
      'Giàu lòng trắc ẩn, dễ đồng cảm với người khác',
      'Kiên nhẫn, chịu khó chăm chút chi tiết',
      'Sáng tạo, có gu thẩm mỹ mềm mại',
    ],
    growthEdges: [
      'Nên học giữ ranh giới cho riêng mình thay vì cả nể',
      'Nên luyện tự tin vào quyết định của bản thân',
      'Nên tập bày tỏ nhu cầu thay vì luôn nhường nhịn',
    ],
    career: 'Hợp việc cần chăm sóc và tinh tế: chăm sóc sức khoẻ, giáo dục, nghệ thuật, dịch vụ, nhân sự. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Dịu dàng và tận tâm vun vén tổ ấm, cần một người biết trân trọng và cùng chia sẻ gánh nặng.',
  },
  than: {
    tagline: 'Người sáng tạo — linh hoạt, thông minh, hoạt bát.',
    strengths: [
      'Thông minh, giỏi tìm giải pháp sáng tạo',
      'Linh hoạt, thích ứng nhanh với thay đổi',
      'Hoạt bát, hài hước, dễ tạo không khí vui',
      'Ham học, tò mò và nắm cái mới rất nhanh',
    ],
    growthEdges: [
      'Nên luyện tập trung để không phân tán quá nhiều hướng',
      'Nên tập kiên trì đi tới cùng thay vì cả thèm chóng chán',
      'Nên giữ sự chân thành thay vì chỉ dựa vào khéo léo',
    ],
    career: 'Hợp việc cần sáng tạo và ứng biến: công nghệ, truyền thông, kinh doanh, giải trí, đổi mới. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Vui vẻ và thú vị khi ở bên, cần người hợp gu trò chuyện; nên luyện sự ổn định để gắn bó lâu dài.',
  },
  dau: {
    tagline: 'Người hoàn thiện — cẩn thận, kỷ luật, tỉ mỉ.',
    strengths: [
      'Cẩn thận, kỷ luật, chú trọng chi tiết',
      'Ngăn nắp, có tổ chức và trách nhiệm cao',
      'Thẳng thắn, dám nói điều mình nghĩ',
      'Chăm chỉ, làm việc có tiêu chuẩn rõ ràng',
    ],
    growthEdges: [
      'Nên bớt khắt khe với mình và với người khác',
      'Nên luyện linh hoạt thay vì cứng theo nguyên tắc',
      'Nên tập ghi nhận điểm tốt trước khi góp ý',
    ],
    career: 'Hợp việc cần chính xác và quy trình: kế toán, kiểm soát chất lượng, quản trị, kỹ thuật, biên tập. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Tận tâm và chu đáo trong chăm lo, cần học cách mềm mỏng để lời quan tâm không thành lời phê bình.',
  },
  tuat: {
    tagline: 'Người trung thành — trung thực, trách nhiệm, đáng tin.',
    strengths: [
      'Trung thực, giàu nguyên tắc và trách nhiệm',
      'Trung thành, sẵn lòng bảo vệ người mình tin tưởng',
      'Công bằng, coi trọng lẽ phải',
      'Bền chí, đáng tin trong những cam kết',
    ],
    growthEdges: [
      'Nên thư giãn hơn để tránh căng thẳng không cần thiết',
      'Nên luyện tin tưởng thay vì luôn cảnh giác',
      'Nên bớt lo xa để tận hưởng hiện tại',
    ],
    career: 'Hợp việc cần chính trực và tin cậy: pháp lý, an ninh, quản trị, dịch vụ công, chăm sóc cộng đồng. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Chân thành và hết lòng bảo vệ người thương, cần học cách buông lo lắng để mối quan hệ nhẹ nhàng hơn.',
  },
  hoi: {
    tagline: 'Người rộng lượng — chân thành, hào phóng, dễ chịu.',
    strengths: [
      'Chân thành, rộng lượng và dễ chịu trong giao tiếp',
      'Lạc quan, nhìn về mặt tốt của mọi việc',
      'Bao dung, ít so đo và giàu thiện chí',
      'Chăm chỉ, biết tận hưởng thành quả của mình',
    ],
    growthEdges: [
      'Nên cân nhắc kỹ hơn khi chi tiêu hay cam kết',
      'Nên luyện đặt ranh giới để không bị lợi dụng lòng tốt',
      'Nên tập nói "không" khi cần bảo vệ mình',
    ],
    career: 'Hợp việc cần sự chân thành và hợp tác: dịch vụ, ẩm thực, chăm sóc khách hàng, thiện nguyện, hậu cần. Đây là xu hướng tham khảo, không giới hạn.',
    love: 'Ấm áp và bao dung, dễ tạo cảm giác an toàn; cần một người biết trân trọng và không lạm dụng sự rộng lượng của mình.',
  },
};

export interface ChiRef {
  slug: string;
  ten: string;
  emoji: string;
}

function refOf(z: Zodiac): ChiRef {
  return { slug: z.slug, ten: z.ten, emoji: z.emoji };
}

/** Năm sinh ví dụ: quét ~1936–2032, lấy các năm có chi khớp tên con giáp. */
function exampleYearsFor(z: Zodiac): number[] {
  const out: number[] = [];
  for (let year = 1936; year <= 2032; year++) {
    if (canChiOfYear(year).chi === z.ten) out.push(year);
  }
  return out;
}

export interface ConGiapData {
  z: Zodiac;
  extra: ChiExtra;
  /** Tam Hợp: 2 con giáp cùng nhóm tam giác. */
  tamHop: ChiRef[];
  /** Lục Xung (tứ hành xung theo cặp): 1 con giáp đối xung. */
  tuHanhXung: ChiRef;
  /** Năm sinh ví dụ (>=5). */
  exampleYears: number[];
  /** 11 con giáp còn lại. */
  others: ChiRef[];
  faqs: FaqItem[];
  seoTitle: string;
  seoDescription: string;
}

export const listConGiap = () => ZODIAC.map(refOf);

export function buildConGiap(slug: string): ConGiapData | null {
  const z = findZodiac(slug);
  if (!z) return null;
  const extra = EXTRA[slug];
  if (!extra) return null;

  const tamHop: ChiRef[] = ZODIAC.filter(
    (o) => relationOf(z.slug, o.slug) === 'tam-hop',
  ).map(refOf);
  const xung = ZODIAC.find((o) => relationOf(z.slug, o.slug) === 'luc-xung');
  // Mỗi chi có đúng 1 cặp lục xung trong bảng Can Chi — luôn tồn tại.
  const tuHanhXung: ChiRef = refOf(xung!);
  const exampleYears = exampleYearsFor(z);
  const others: ChiRef[] = ZODIAC.filter((o) => o.slug !== z.slug).map(refOf);

  const tamHopNames = tamHop.map((t) => t.ten).join(', ');
  const yearList = exampleYears.join(', ');

  const faqs: FaqItem[] = [
    {
      q: `Người tuổi ${z.ten} sinh năm nào?`,
      a: `Một số năm sinh tuổi ${z.ten} (địa chi ${z.ten}) gồm: ${yearList}. Mỗi con giáp lặp lại theo chu kỳ 12 năm, nên bạn cứ cộng hoặc trừ 12 từ các năm này để ra thêm.`,
    },
    {
      q: `Tuổi ${z.ten} tính cách thế nào?`,
      a: `${z.blurb} Đây là mô tả xu hướng theo con giáp để tham khảo, không phải lời phán về từng người.`,
    },
    {
      q: `Tuổi ${z.ten} hợp và xung với tuổi nào?`,
      a: `Theo Can Chi, tuổi ${z.ten} thuộc nhóm Tam Hợp với ${tamHopNames}, và Lục Xung với ${tuHanhXung.ten}. "Xung" chỉ có nghĩa hai nếp sống khác nhịp, cần dung hoà nhiều hơn — không phải điều xấu. Muốn xem cụ thể một cặp, hãy dùng công cụ xem hợp tuổi tại /learn/hop-tuoi.`,
    },
    {
      q: `Tuổi ${z.ten} thuộc ngũ hành gì?`,
      a: `Địa chi ${z.ten} thuộc hành ${z.nguHanh}. Ngũ hành là một lát cắt tham khảo giúp hiểu xu hướng tính cách, không quyết định số phận.`,
    },
    {
      q: `Tuổi ${z.ten} hợp nghề gì?`,
      a: `${extra.career} Con giáp chỉ là một góc nhìn nhỏ — người tuổi ${z.ten} vẫn thành công ở rất nhiều lĩnh vực khác nhau.`,
    },
    {
      q: `Xem tuổi ${z.ten} có chính xác không?`,
      a: `Đây là tri thức con giáp dân gian dùng để tham khảo và hiểu mình, không phải phép đo khoa học hay lời tiên tri. Chúng tôi không bịa "số may mắn", "màu hợp mệnh" hay lời hù doạ — tính cách và tương lai của bạn do chính bạn quyết định.`,
    },
  ];

  const seoTitle = `Tuổi ${z.ten} (${z.nguHanh}): tính cách, hợp tuổi, sự nghiệp`;
  const seoDescription = `Tuổi ${z.ten} — hành ${z.nguHanh}. Tính cách, điểm mạnh, tam hợp (${tamHopNames}), lục xung (${tuHanhXung.ten}), năm sinh và xu hướng nghề nghiệp, tình cảm. Tham khảo, không phán số mệnh.`;

  return {
    z,
    extra,
    tamHop,
    tuHanhXung,
    exampleYears,
    others,
    faqs,
    seoTitle,
    seoDescription,
  };
}
