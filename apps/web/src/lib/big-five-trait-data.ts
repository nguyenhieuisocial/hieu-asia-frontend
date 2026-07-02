// hieu.asia — Dữ liệu trang chi tiết 5 chiều Big Five / OCEAN (/learn/big-five/[trait]).
//
// Big Five là mô hình tính cách có nền thực nghiệm vững nhất (lexical hypothesis;
// Costa & McCrae / IPIP-NEO — facet miền công cộng). Khác type-test: mỗi chiều là
// một DẢI LIÊN TỤC, KHÔNG có đầu nào "tốt/xấu" hơn → trang mô tả cả hai đầu (cao/
// thấp) + facet, đóng khung trung lập. Bám nhãn engine (lib/scoring/big-five.ts:
// openness/conscientiousness/extraversion/agreeableness/neuroticism) + /learn/big-five.

export const BIG_FIVE_SLUGS = [
  'openness',
  'conscientiousness',
  'extraversion',
  'agreeableness',
  'neuroticism',
] as const;

interface BigFiveTraitRaw {
  vi: string;
  en: string;
  letter: string; // O C E A N
  tagline: string;
  overview: string;
  highProfile: string[];
  lowProfile: string[];
  facets: { label: string; gloss: string }[];
  highContext: string;
  lowContext: string;
  balanceNote: string;
}

const TRAITS: Record<string, BigFiveTraitRaw> = {
  openness: {
    vi: 'Cởi mở',
    en: 'Openness',
    letter: 'O',
    tagline: 'Mức độ bạn tìm đến cái mới, ý tưởng và trải nghiệm — so với ưa điều quen thuộc.',
    overview:
      'Cởi mở (Openness to Experience) đo mức bạn bị thu hút bởi cái mới, trừu tượng và đa dạng. Người điểm cao tò mò, giàu trí tưởng tượng, thích khám phá; người điểm thấp thực tế, ưa cái quen thuộc và đã được kiểm chứng. Đây là một dải trung lập — mỗi đầu hợp với bối cảnh khác nhau.',
    highProfile: ['Tò mò, sáng tạo, giàu trí tưởng tượng', 'Thích ý tưởng trừu tượng và trải nghiệm mới', 'Cởi mở với cái khác biệt và đa dạng văn hoá'],
    lowProfile: ['Thực tế, cụ thể, ưa điều quen thuộc', 'Tin vào quy trình đã được kiểm chứng', 'Tập trung vào hiện tại hơn là giả thuyết'],
    facets: [
      { label: 'Trí tưởng tượng', gloss: 'thế giới nội tâm phong phú' },
      { label: 'Thẩm mỹ', gloss: 'rung cảm với nghệ thuật, cái đẹp' },
      { label: 'Cảm xúc', gloss: 'nhận biết và trân trọng cảm xúc' },
      { label: 'Phiêu lưu', gloss: 'thích thử điều mới, đổi thói quen' },
      { label: 'Ham trí tuệ', gloss: 'thích ý tưởng, tranh luận khái niệm' },
      { label: 'Cởi mở giá trị', gloss: 'sẵn sàng xét lại quan niệm cũ' },
    ],
    highContext: 'Điểm cao hợp công việc sáng tạo, nghiên cứu, chiến lược, nghệ thuật — nơi cần ý tưởng mới.',
    lowContext: 'Điểm thấp hợp công việc cần ổn định, quy trình, chi tiết thực tế và nhất quán.',
    balanceNote: 'Điểm giữa: vừa cởi mở với cái mới vừa biết giữ điều đã hiệu quả.',
  },
  conscientiousness: {
    vi: 'Tận tâm',
    en: 'Conscientiousness',
    letter: 'C',
    tagline: 'Mức độ bạn kỷ luật, có tổ chức và theo đuổi mục tiêu — so với linh hoạt, tuỳ hứng.',
    overview:
      'Tận tâm đo khả năng tự kiểm soát, tổ chức và bền bỉ với mục tiêu. Điểm cao gắn với kỷ luật, đáng tin và hiệu suất; điểm thấp gắn với linh hoạt, ngẫu hứng và dễ thích nghi. Đây là một trong những chiều dự báo tốt nhất cho thành tựu học tập và công việc trong nghiên cứu.',
    highProfile: ['Kỷ luật, ngăn nắp, có kế hoạch', 'Đáng tin, giữ cam kết', 'Bền bỉ theo đuổi mục tiêu đến cùng'],
    lowProfile: ['Linh hoạt, dễ thích nghi, ngẫu hứng', 'Thoải mái, ít bị gò bó bởi lịch trình', 'Phản ứng nhanh với tình huống mới'],
    facets: [
      { label: 'Năng lực', gloss: 'tự tin mình làm được việc' },
      { label: 'Ngăn nắp', gloss: 'thích trật tự, gọn gàng' },
      { label: 'Trách nhiệm', gloss: 'giữ lời, làm tròn bổn phận' },
      { label: 'Cầu tiến', gloss: 'đặt mục tiêu cao, nỗ lực đạt' },
      { label: 'Kỷ luật', gloss: 'làm tới cùng dù chán' },
      { label: 'Thận trọng', gloss: 'cân nhắc trước khi hành động' },
    ],
    highContext: 'Điểm cao hợp vai trò cần độ tin cậy — quản lý, tài chính, vận hành, y tế, kỹ thuật.',
    lowContext: 'Điểm thấp hợp công việc cần ứng biến, sáng tạo tự do, ít quy trình cứng.',
    balanceNote: 'Điểm giữa: vừa có kế hoạch vừa đủ linh hoạt khi cần đổi hướng.',
  },
  extraversion: {
    vi: 'Hướng ngoại',
    en: 'Extraversion',
    letter: 'E',
    tagline: 'Mức độ bạn nạp năng lượng từ tương tác xã hội — so với từ không gian riêng.',
    overview:
      'Hướng ngoại đo mức bạn tìm kiếm và nạp năng lượng từ thế giới bên ngoài, đặc biệt là con người. Điểm cao năng động, hoạt ngôn, thích đám đông; điểm thấp (hướng nội) trầm tĩnh, thích chiều sâu và thời gian một mình. Không đầu nào tốt hơn — chỉ khác nguồn năng lượng.',
    highProfile: ['Năng động, hoạt ngôn, thích giao tiếp', 'Nạp năng lượng từ đám đông và hoạt động', 'Lạc quan, dễ bắt chuyện'],
    lowProfile: ['Trầm tĩnh, thích chiều sâu hơn bề rộng', 'Nạp năng lượng từ không gian riêng', 'Suy nghĩ kỹ trước khi lên tiếng'],
    facets: [
      { label: 'Nồng ấm', gloss: 'thân thiện, dễ gần' },
      { label: 'Thích giao du', gloss: 'thích ở giữa nhiều người' },
      { label: 'Quyết đoán', gloss: 'dám lên tiếng, dẫn dắt' },
      { label: 'Năng động', gloss: 'nhịp sống bận rộn, nhiều việc' },
      { label: 'Tìm hứng khởi', gloss: 'thích kích thích, mới lạ' },
      { label: 'Cảm xúc tích cực', gloss: 'hay vui vẻ, hào hứng' },
    ],
    highContext: 'Điểm cao hợp bán hàng, lãnh đạo, truyền thông, dịch vụ — nơi nhiều tương tác.',
    lowContext: 'Điểm thấp hợp công việc cần tập trung sâu, độc lập, ít ồn ào.',
    balanceNote: 'Điểm giữa (ambivert): linh hoạt giữa giao tiếp và làm việc một mình.',
  },
  agreeableness: {
    vi: 'Dễ chịu',
    en: 'Agreeableness',
    letter: 'A',
    tagline: 'Mức độ bạn đặt hoà hợp, tin tưởng và hợp tác — so với thẳng thắn, cạnh tranh.',
    overview:
      'Dễ chịu đo cách bạn đối xử với người khác. Điểm cao gắn với đồng cảm, tin tưởng và hợp tác; điểm thấp gắn với thẳng thắn, hoài nghi lành mạnh và đặt logic trước cảm xúc. Cả hai đầu đều có giá trị tuỳ bối cảnh.',
    highProfile: ['Đồng cảm, tin tưởng, vị tha', 'Đặt hoà hợp và hợp tác lên trước', 'Sẵn lòng giúp đỡ, nhường nhịn'],
    lowProfile: ['Thẳng thắn, đặt logic trước cảm xúc', 'Cạnh tranh, dám bảo vệ quan điểm', 'Hoài nghi lành mạnh, khó bị thuyết phục'],
    facets: [
      { label: 'Tin tưởng', gloss: 'tin vào thiện ý người khác' },
      { label: 'Chân thành', gloss: 'thẳng thắn, không vụ lợi' },
      { label: 'Vị tha', gloss: 'thích giúp đỡ người khác' },
      { label: 'Thuận hợp tác', gloss: 'nhường để giữ hoà khí' },
      { label: 'Khiêm tốn', gloss: 'không phô trương bản thân' },
      { label: 'Mềm lòng', gloss: 'dễ động lòng trước người khác' },
    ],
    highContext: 'Điểm cao hợp chăm sóc, giáo dục, làm việc nhóm, dịch vụ, nhân sự.',
    lowContext: 'Điểm thấp hợp vai trò cần quyết định cứng rắn, đàm phán, phản biện.',
    balanceNote: 'Điểm giữa: vừa hợp tác vừa biết giữ lập trường khi cần.',
  },
  neuroticism: {
    vi: 'Nhạy cảm cảm xúc',
    en: 'Neuroticism',
    letter: 'N',
    tagline: 'Mức độ bạn phản ứng mạnh với stress và cảm xúc — so với điềm tĩnh, ổn định.',
    overview:
      'Nhạy cảm cảm xúc (Neuroticism — đầu ngược lại là ổn định cảm xúc) đo mức bạn dễ trải nghiệm lo âu, buồn bã hay căng thẳng. Đây là một dải TRUNG LẬP, không phải bệnh lý hay khuyết điểm: đầu nhạy cảm giúp bạn tinh tế, đồng cảm và cảnh giác sớm với rủi ro; đầu ổn định giúp bạn điềm tĩnh dưới áp lực.',
    highProfile: ['Nhạy cảm, tinh tế với rủi ro và cảm xúc', 'Cảm nhận sâu, dễ đồng cảm nỗi đau người khác', 'Cảnh giác, hay chuẩn bị cho tình huống xấu'],
    lowProfile: ['Điềm tĩnh, ổn định dưới áp lực', 'Ít bị stress cuốn đi', 'Phục hồi nhanh sau khó khăn'],
    facets: [
      { label: 'Lo âu', gloss: 'hay lo lắng, căng thẳng' },
      { label: 'Dễ cáu', gloss: 'nhạy với bực bội, khó chịu' },
      { label: 'U sầu', gloss: 'dễ buồn, dễ nản' },
      { label: 'Ngượng ngùng', gloss: 'để ý ánh nhìn của người khác' },
      { label: 'Khó tiết chế', gloss: 'khó cưỡng ham muốn nhất thời' },
      { label: 'Dễ tổn thương', gloss: 'khó xoay xở khi stress dồn dập' },
    ],
    highContext: 'Đầu nhạy cảm hợp vai trò cần tỉ mỉ, lường rủi ro, đồng cảm sâu (kiểm soát chất lượng, chăm sóc, sáng tạo).',
    lowContext: 'Đầu ổn định hợp vai trò áp lực cao, ra quyết định khẩn, lãnh đạo trong khủng hoảng.',
    balanceNote: 'Điểm giữa: đủ nhạy để cảnh giác, đủ vững để không bị cảm xúc cuốn đi.',
  },
};

export interface TraitRef {
  slug: string;
  vi: string;
  en: string;
  letter: string;
}

export interface BigFiveTraitData extends BigFiveTraitRaw {
  slug: string;
  others: TraitRef[];
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

const refOf = (slug: string): TraitRef => {
  const t = TRAITS[slug];
  if (!t) throw new Error(`Unknown Big Five trait: ${slug}`);
  return { slug, vi: t.vi, en: t.en, letter: t.letter };
};

export const listTraits = (): TraitRef[] => BIG_FIVE_SLUGS.map(refOf);

export function buildTrait(slugRaw: string): BigFiveTraitData | null {
  const slug = slugRaw.toLowerCase();
  if (!(BIG_FIVE_SLUGS as readonly string[]).includes(slug)) return null;
  const t = TRAITS[slug];
  if (!t) return null;

  const others = BIG_FIVE_SLUGS.filter((s) => s !== slug).map(refOf);
  const seoTitle = `${t.vi} (${t.en}) trong Big Five`;
  const seoDescription = `${t.vi}/${t.en} trong Big Five (OCEAN): người điểm cao vs điểm thấp, các facet và ứng dụng công việc. Mô tả xu hướng, không có đầu nào tốt hơn.`;

  const facetText = t.facets.map((f) => `${f.label} (${f.gloss})`).join('; ');

  const faqs: { q: string; a: string }[] = [
    {
      q: `${t.vi} (${t.en}) trong Big Five là gì?`,
      a: t.overview,
    },
    {
      q: `Điểm ${t.vi} CAO nghĩa là sao?`,
      a: `${t.highProfile.join('; ')}. ${t.highContext}`,
    },
    {
      q: `Điểm ${t.vi} THẤP nghĩa là sao?`,
      a: `${t.lowProfile.join('; ')}. ${t.lowContext}`,
    },
    {
      q: `${t.vi} gồm những khía cạnh (facet) nào?`,
      a: `Chiều ${t.vi} thường được chia nhỏ thành các facet: ${facetText}. Hai người cùng điểm tổng vẫn có thể khác nhau ở từng facet.`,
    },
    {
      q: `Điểm ${t.vi} cao hay thấp thì tốt hơn?`,
      a: `Không đầu nào tốt hay xấu hơn — đây là một dải trung lập, mỗi đầu hợp với bối cảnh khác nhau. ${t.balanceNote} Big Five mô tả xu hướng để bạn hiểu mình, không phải lời phán.`,
    },
  ];

  return {
    ...t,
    slug,
    others,
    seoTitle,
    seoDescription,
    faqs,
  };
}
