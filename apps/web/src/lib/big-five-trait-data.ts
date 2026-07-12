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
  everydaySigns: string; // dấu hiệu đời thường của điểm cao vs thấp (2-3 cặp ví dụ cụ thể)
}

const TRAITS: Record<string, BigFiveTraitRaw> = {
  openness: {
    vi: 'Cởi mở',
    en: 'Openness',
    letter: 'O',
    tagline: 'Mức độ bạn tìm đến cái mới, ý tưởng và trải nghiệm — so với ưa điều quen thuộc.',
    overview:
      'Cởi mở (Openness to Experience) đo mức bạn bị thu hút bởi cái mới, trừu tượng và đa dạng. Người điểm cao tò mò, giàu trí tưởng tượng, thích khám phá và dễ hứng thú với ý tưởng chưa quen; người điểm thấp thực tế, ưa cái quen thuộc và đã được kiểm chứng, thấy an tâm khi mọi thứ chạy theo lối đã biết. Đây là một dải trung lập, không phải thang đo thông minh hay óc sáng tạo: điểm cao mở đường cho cái mới nhưng dễ chán việc lặp, điểm thấp giữ cho mọi thứ ổn định nhưng đôi khi bỏ lỡ dịp đổi mới. Mỗi đầu hợp với một loại bối cảnh khác nhau.',
    highProfile: ['Tò mò, sáng tạo, giàu trí tưởng tượng', 'Thích ý tưởng trừu tượng và trải nghiệm mới', 'Cởi mở với cái khác biệt và đa dạng văn hoá'],
    lowProfile: ['Thực tế, cụ thể, ưa điều quen thuộc', 'Tin vào quy trình đã được kiểm chứng', 'Tập trung vào hiện tại hơn là giả thuyết'],
    facets: [
      { label: 'Trí tưởng tượng', gloss: 'thế giới nội tâm phong phú; hay mơ mộng, dựng lên cảnh tượng trong đầu' },
      { label: 'Thẩm mỹ', gloss: 'rung cảm với nghệ thuật, cái đẹp; dễ xúc động trước một bản nhạc hay khung cảnh' },
      { label: 'Cảm xúc', gloss: 'nhận biết và trân trọng cảm xúc; để ý sắc thái tình cảm bên trong mình' },
      { label: 'Phiêu lưu', gloss: 'thích thử điều mới, đổi thói quen; ngại đi mãi một đường mòn' },
      { label: 'Ham trí tuệ', gloss: 'thích ý tưởng, tranh luận khái niệm; bị cuốn vào những câu hỏi trừu tượng' },
      { label: 'Cởi mở giá trị', gloss: 'sẵn sàng xét lại quan niệm cũ; ít bám cứng vào lối nghĩ quen' },
    ],
    highContext: 'Điểm cao hợp công việc sáng tạo, nghiên cứu, chiến lược, nghệ thuật — nơi cần ý tưởng mới và dám thử điều chưa ai làm.',
    lowContext: 'Điểm thấp hợp công việc cần ổn định, quy trình, chi tiết thực tế và nhất quán — nơi "đúng như mọi lần" quan trọng hơn "khác đi cho mới".',
    balanceNote: 'Điểm giữa: vừa cởi mở với cái mới vừa biết giữ điều đã hiệu quả, thử cái lạ mà không phá cái đang chạy tốt.',
    everydaySigns:
      'Điểm cao: đi du lịch thích lạc vào ngõ lạ, đọc sách hay nhảy sang chủ đề chưa từng biết. Điểm thấp: chọn quán quen đã hợp khẩu vị, tin vào công thức đã chạy tốt. Cao hay hỏi "nếu làm khác thì sao", thấp hay hỏi "cách này đã chắc chưa". Không đầu nào hơn — một bên mở lối mới, một bên giữ cái đã hiệu quả.',
  },
  conscientiousness: {
    vi: 'Tận tâm',
    en: 'Conscientiousness',
    letter: 'C',
    tagline: 'Mức độ bạn kỷ luật, có tổ chức và theo đuổi mục tiêu — so với linh hoạt, tuỳ hứng.',
    overview:
      'Tận tâm đo khả năng tự kiểm soát, tổ chức và bền bỉ với mục tiêu. Điểm cao gắn với kỷ luật, đáng tin và hiệu suất, thường lên kế hoạch rồi làm tới cùng; điểm thấp gắn với linh hoạt, ngẫu hứng và dễ thích nghi, thoải mái để mọi thứ mở đến phút chót. Trong nghiên cứu, đây là một trong những chiều dự báo tốt cho thành tựu học tập và công việc, nhưng điểm thấp không có nghĩa là lười: nó nghiêng về ứng biến hơn là bám lịch. Cả hai đầu đều có chỗ dùng, chỉ khác cách người ta xoay xở với thời gian và cam kết.',
    highProfile: ['Kỷ luật, ngăn nắp, có kế hoạch', 'Đáng tin, giữ cam kết', 'Bền bỉ theo đuổi mục tiêu đến cùng'],
    lowProfile: ['Linh hoạt, dễ thích nghi, ngẫu hứng', 'Thoải mái, ít bị gò bó bởi lịch trình', 'Phản ứng nhanh với tình huống mới'],
    facets: [
      { label: 'Năng lực', gloss: 'tự tin mình làm được việc; thấy mình đủ sức xử lý phần được giao' },
      { label: 'Ngăn nắp', gloss: 'thích trật tự, gọn gàng; khó chịu khi đồ đạc hay lịch trình lộn xộn' },
      { label: 'Trách nhiệm', gloss: 'giữ lời, làm tròn bổn phận; ngại để người khác phải gánh phần của mình' },
      { label: 'Cầu tiến', gloss: 'đặt mục tiêu cao, nỗ lực đạt; muốn làm hơn mức đủ' },
      { label: 'Kỷ luật', gloss: 'làm tới cùng dù chán; cưỡng được cám dỗ bỏ dở giữa chừng' },
      { label: 'Thận trọng', gloss: 'cân nhắc trước khi hành động; nghĩ tới hậu quả rồi mới quyết' },
    ],
    highContext: 'Điểm cao hợp vai trò cần độ tin cậy — quản lý, tài chính, vận hành, y tế, kỹ thuật, nơi sai sót hay lỡ hẹn phải trả giá đắt.',
    lowContext: 'Điểm thấp hợp công việc cần ứng biến, sáng tạo tự do, ít quy trình cứng — nơi bám lịch quá chặt lại làm mất cơ hội.',
    balanceNote: 'Điểm giữa: vừa có kế hoạch vừa đủ linh hoạt khi cần đổi hướng, giữ được nhịp mà không cứng nhắc.',
    everydaySigns:
      'Điểm cao: lên lịch trước, ghi việc ra danh sách rồi gạch dần cho hết. Điểm thấp: ứng biến theo ngày, để mọi thứ mở đến phút chót. Cao thấy deadline là ranh giới thiêng; thấp thấy deadline là gợi ý co giãn được. Cao đáng tin ở sự đều đặn, thấp linh hoạt khi kế hoạch phải đổi gấp.',
  },
  extraversion: {
    vi: 'Hướng ngoại',
    en: 'Extraversion',
    letter: 'E',
    tagline: 'Mức độ bạn nạp năng lượng từ tương tác xã hội — so với từ không gian riêng.',
    overview:
      'Hướng ngoại đo mức bạn tìm kiếm và nạp năng lượng từ thế giới bên ngoài, đặc biệt là con người. Điểm cao năng động, hoạt ngôn, thích đám đông và thường nghĩ bằng cách nói ra; điểm thấp (hướng nội) trầm tĩnh, thích chiều sâu, cần thời gian một mình để hồi sức và hay nghĩ xong mới nói. Không đầu nào tốt hơn, và đây không phải thang đo mức tử tế hay khả năng giao tiếp: người hướng nội vẫn có thể nói chuyện rất khéo, chỉ là sau đó cần nghỉ. Khác biệt cốt lõi nằm ở nguồn nạp năng lượng, không phải ở việc ai thân thiện hơn ai.',
    highProfile: ['Năng động, hoạt ngôn, thích giao tiếp', 'Nạp năng lượng từ đám đông và hoạt động', 'Lạc quan, dễ bắt chuyện'],
    lowProfile: ['Trầm tĩnh, thích chiều sâu hơn bề rộng', 'Nạp năng lượng từ không gian riêng', 'Suy nghĩ kỹ trước khi lên tiếng'],
    facets: [
      { label: 'Nồng ấm', gloss: 'thân thiện, dễ gần; tạo cảm giác gần gũi với người mới quen' },
      { label: 'Thích giao du', gloss: 'thích ở giữa nhiều người; thấy vui khi có đông người quanh mình' },
      { label: 'Quyết đoán', gloss: 'dám lên tiếng, dẫn dắt; không ngại đứng ra chủ trì' },
      { label: 'Năng động', gloss: 'nhịp sống bận rộn, nhiều việc; thích guồng quay có việc để làm' },
      { label: 'Tìm hứng khởi', gloss: 'thích kích thích, mới lạ; bị hút bởi cảm giác sôi động' },
      { label: 'Cảm xúc tích cực', gloss: 'hay vui vẻ, hào hứng; dễ bật lên niềm vui và tiếng cười' },
    ],
    highContext: 'Điểm cao hợp bán hàng, lãnh đạo, truyền thông, dịch vụ — nơi nhiều tương tác và cần chủ động bắt chuyện.',
    lowContext: 'Điểm thấp hợp công việc cần tập trung sâu, độc lập, ít ồn ào — nơi sự yên tĩnh giúp làm việc tốt hơn.',
    balanceNote: 'Điểm giữa (ambivert): linh hoạt giữa giao tiếp và làm việc một mình, biết lúc nào nên hoà vào lúc nào nên lui về.',
    everydaySigns:
      'Điểm cao: sau một buổi tiệc thấy nạp đầy năng lượng, dễ mở lời trước với người lạ. Điểm thấp: sau buổi đông người thấy cạn pin, cần một góc yên để hồi sức. Cao hay nghĩ bằng cách nói ra, thấp thường nói ra sau khi đã nghĩ xong. Đây là khác nhau ở nguồn năng lượng, không phải ở mức tử tế.',
  },
  agreeableness: {
    vi: 'Dễ chịu',
    en: 'Agreeableness',
    letter: 'A',
    tagline: 'Mức độ bạn đặt hoà hợp, tin tưởng và hợp tác — so với thẳng thắn, cạnh tranh.',
    overview:
      'Dễ chịu đo cách bạn đối xử với người khác. Điểm cao gắn với đồng cảm, tin tưởng và hợp tác, thường đặt hoà khí và lợi ích chung lên trước; điểm thấp gắn với thẳng thắn, hoài nghi lành mạnh và đặt logic trước cảm xúc, sẵn sàng nói điều khó nghe khi thấy cần. Cả hai đầu đều có giá trị tuỳ bối cảnh: đầu cao giữ được quan hệ và sự tin cậy, nhưng dễ bị lợi dụng nếu cả nể; đầu thấp bảo vệ được lập trường và sự thật, nhưng dễ bị hiểu là gai góc. Đây không phải thang đo lòng tốt, mà là mức bạn ưu tiên hoà hợp so với thẳng thắn.',
    highProfile: ['Đồng cảm, tin tưởng, vị tha', 'Đặt hoà hợp và hợp tác lên trước', 'Sẵn lòng giúp đỡ, nhường nhịn'],
    lowProfile: ['Thẳng thắn, đặt logic trước cảm xúc', 'Cạnh tranh, dám bảo vệ quan điểm', 'Hoài nghi lành mạnh, khó bị thuyết phục'],
    facets: [
      { label: 'Tin tưởng', gloss: 'tin vào thiện ý người khác; cho người ta cái lợi của sự nghi ngờ' },
      { label: 'Chân thành', gloss: 'thẳng thắn, không vụ lợi; ngại dùng mẹo hay nói vòng để đạt ý mình' },
      { label: 'Vị tha', gloss: 'thích giúp đỡ người khác; thấy vui khi làm được điều tốt cho ai đó' },
      { label: 'Thuận hợp tác', gloss: 'nhường để giữ hoà khí; tránh đối đầu khi có thể dàn hoà' },
      { label: 'Khiêm tốn', gloss: 'không phô trương bản thân; ngại kể công hay đứng trên người khác' },
      { label: 'Mềm lòng', gloss: 'dễ động lòng trước người khác; xót khi thấy ai gặp khó' },
    ],
    highContext: 'Điểm cao hợp chăm sóc, giáo dục, làm việc nhóm, dịch vụ, nhân sự — nơi sự tin cậy và đồng cảm là cốt lõi.',
    lowContext: 'Điểm thấp hợp vai trò cần quyết định cứng rắn, đàm phán, phản biện — nơi phải dám nói không và giữ lập trường.',
    balanceNote: 'Điểm giữa: vừa hợp tác vừa biết giữ lập trường khi cần, tử tế mà không tự để mình bị lấn.',
    everydaySigns:
      'Điểm cao: gặp xung đột thì tìm cách dàn hoà, dễ cho người khác cái lợi của sự nghi ngờ. Điểm thấp: nói thẳng điều chưa ổn, giữ lập trường dù mất lòng. Cao hay hỏi "thế này có công bằng với mọi người không", thấp hay hỏi "thế này có đúng logic không". Mỗi bên hợp một loại tình huống.',
  },
  neuroticism: {
    vi: 'Nhạy cảm cảm xúc',
    en: 'Neuroticism',
    letter: 'N',
    tagline: 'Mức độ bạn phản ứng mạnh với stress và cảm xúc — so với điềm tĩnh, ổn định.',
    overview:
      'Nhạy cảm cảm xúc (Neuroticism — đầu ngược lại là ổn định cảm xúc) đo mức bạn dễ trải nghiệm lo âu, buồn bã hay căng thẳng. Đây là một dải TRUNG LẬP, không phải bệnh lý hay khuyết điểm: đầu nhạy cảm giúp bạn tinh tế, đồng cảm và cảnh giác sớm với rủi ro, hay dựng sẵn phương án cho tình huống xấu; đầu ổn định giúp bạn điềm tĩnh dưới áp lực, ít bị cảm xúc cuốn đi và phục hồi nhanh sau va vấp. Cần phân biệt rõ: điểm cao ở chiều này là một thiên hướng phản ứng mạnh với stress, không đồng nghĩa với rối loạn tâm lý. Mỗi đầu có cái giá và cái được riêng, hợp với những hoàn cảnh khác nhau.',
    highProfile: ['Nhạy cảm, tinh tế với rủi ro và cảm xúc', 'Cảm nhận sâu, dễ đồng cảm nỗi đau người khác', 'Cảnh giác, hay chuẩn bị cho tình huống xấu'],
    lowProfile: ['Điềm tĩnh, ổn định dưới áp lực', 'Ít bị stress cuốn đi', 'Phục hồi nhanh sau khó khăn'],
    facets: [
      { label: 'Lo âu', gloss: 'hay lo lắng, căng thẳng; đầu óc dễ chạy trước tới điều có thể trục trặc' },
      { label: 'Dễ cáu', gloss: 'nhạy với bực bội, khó chịu; ngưỡng chịu đựng thấp khi bị làm phiền' },
      { label: 'U sầu', gloss: 'dễ buồn, dễ nản; tâm trạng chùng xuống khi mọi thứ không như ý' },
      { label: 'Ngượng ngùng', gloss: 'để ý ánh nhìn của người khác; dễ thấy lúng túng trước đám đông' },
      { label: 'Khó tiết chế', gloss: 'khó cưỡng ham muốn nhất thời; dễ chiều theo cơn thèm hay bốc đồng' },
      { label: 'Dễ tổn thương', gloss: 'khó xoay xở khi stress dồn dập; dễ mất bình tĩnh lúc căng thẳng chồng chất' },
    ],
    highContext: 'Đầu nhạy cảm hợp vai trò cần tỉ mỉ, lường rủi ro, đồng cảm sâu — kiểm soát chất lượng, chăm sóc, sáng tạo, nơi bắt được tín hiệu xấu sớm là một lợi thế.',
    lowContext: 'Đầu ổn định hợp vai trò áp lực cao, ra quyết định khẩn, lãnh đạo trong khủng hoảng — nơi giữ được cái đầu lạnh quan trọng hơn cả.',
    balanceNote: 'Điểm giữa: đủ nhạy để cảnh giác, đủ vững để không bị cảm xúc cuốn đi.',
    everydaySigns:
      'Đầu nhạy cảm: trước một chuyến quan trọng đã dựng sẵn phương án cho tình huống xấu, để ý từng dấu hiệu bất thường. Đầu ổn định: gặp trục trặc vẫn giữ giọng đều, ngủ được sau một ngày căng. Nhạy cảm bắt tín hiệu rủi ro sớm; ổn định giữ nhịp khi quanh mình rối. Đây là dải trung lập, không phải mạnh hay yếu.',
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
