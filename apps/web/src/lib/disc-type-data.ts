// hieu.asia — Dữ liệu trang chi tiết 4 nhóm DISC (/learn/disc/[type]).
//
// DISC = mô hình hành vi của William Marston (1928, miền công cộng) — KHÔNG phải
// Wiley DiSC® có bản quyền. Nội dung mô tả XU HƯỚNG hành vi trên một phổ, không
// phải nhãn cố định hay lời phán; bám đúng nhãn engine (lib/scoring/disc.ts:
// dominance/influence/steadiness/compliance) và trang /learn/disc.
//
// Hai trục: nhịp độ (nhanh–quyết liệt ↔ chậm–ôn hoà) × trọng tâm (việc ↔ người).
// Vòng tròn: D (nhanh+việc) → I (nhanh+người) → S (chậm+người) → C (chậm+việc).

export const DISC_SLUGS = ['d', 'i', 's', 'c'] as const;

interface DiscStyleRaw {
  vi: string;
  en: string;
  pace: string;
  focus: string;
  tagline: string;
  overview: string;
  strengths: string[];
  growth: string[];
  workStyle: string;
  communication: string;
  underPressure: string;
  collaboration: string; // phối hợp với 3 nhóm còn lại (mỗi nhóm 1 câu cụ thể)
  misreads: string; // nhóm này hay bị hiểu lầm là gì, và sự thật là gì
  neighbors: string[]; // 2 nhóm liền kề trên vòng tròn (slug)
  opposite: string; // nhóm đối (slug)
}

const STYLES: Record<string, DiscStyleRaw> = {
  d: {
    vi: 'Thống trị',
    en: 'Dominance',
    pace: 'Nhanh, quyết liệt',
    focus: 'Tập trung vào việc',
    tagline: 'Quyết đoán, hướng kết quả, thích dẫn dắt và kiểm soát.',
    overview:
      'Người nhóm D lấy kết quả làm thước đo. Họ ra quyết định nhanh, nói thẳng vào việc và sẵn sàng nhận phần khó về mình. Đặt một mục tiêu rõ trước mặt, họ lao tới và ít bận tâm chuyện phải làm vừa lòng tất cả. Sức mạnh của họ là dám chịu trách nhiệm và đẩy việc qua điểm nghẽn; mặt trái là dễ sốt ruột với người cần thời gian và đôi khi quên hỏi ý người khác trước khi quyết. Trên hai trục DISC, nhóm D nằm ở góc nhanh và hướng việc — đó là gốc của cả điểm mạnh lẫn điểm cần để ý.',
    strengths: ['Quyết đoán, dám nhận rủi ro', 'Hướng kết quả, đẩy việc về đích', 'Tự tin, chủ động dẫn dắt'],
    growth: ['Kiên nhẫn và lắng nghe người khác', 'Mềm mỏng hơn khi giao tiếp', 'Cân nhắc chi tiết trước khi quyết'],
    workStyle:
      'Mạnh ở vai trò lãnh đạo, ra quyết định và vận hành dưới áp lực — quản lý, kinh doanh, khởi nghiệp, đàm phán. Hợp môi trường có quyền tự chủ và mục tiêu rõ.',
    communication:
      'Thích trao đổi ngắn gọn, đi thẳng vào kết quả. Để làm việc với nhóm D: nói trọng tâm, đưa lựa chọn rõ ràng và tôn trọng thời gian của họ.',
    underPressure: 'Khi căng thẳng dễ nóng vội, áp đặt và thiếu kiên nhẫn với người làm chậm.',
    collaboration:
      'Với nhóm I, người D nên chừa chỗ cho sự hào hứng và ghi nhận công khai, thay vì chỉ chăm chăm chốt việc. Với nhóm S, D cần báo trước thay đổi và hạ nhịp, vì người S bị dồn gấp sẽ âm thầm rút lui. Với nhóm C, D nên đưa lý do và số liệu thay vì ra lệnh, vì người C phải thấy quy trình hợp lý mới yên tâm làm nhanh.',
    misreads:
      'Nhóm D hay bị đọc là lạnh lùng hoặc thích áp đặt. Thật ra phần lớn sự thẳng thừng đó đến từ việc họ đang dồn sức vào kết quả, không phải công kích cá nhân. Khi hiểu D coi thời gian là thứ quý, ta bớt thấy họ vô cảm và dễ phối hợp hơn.',
    neighbors: ['i', 'c'],
    opposite: 's',
  },
  i: {
    vi: 'Ảnh hưởng',
    en: 'Influence',
    pace: 'Nhanh, quyết liệt',
    focus: 'Tập trung vào người',
    tagline: 'Cởi mở, nhiệt tình, giỏi kết nối và truyền cảm hứng.',
    overview:
      'Người nhóm I sống bằng kết nối. Họ thích trò chuyện, thuyết phục và kéo cả nhóm vào một tâm trạng tích cực. Ý tưởng đến nhanh, lời nói cũng nhanh, và họ giỏi làm người khác thấy được truyền cảm hứng. Điểm mạnh là mở ra quan hệ và giữ lửa cho tập thể; điểm cần để ý là dễ bỏ dở chi tiết và mệt với việc lặp đi lặp lại một mình. Trên hai trục DISC, nhóm I nằm ở góc nhanh và hướng người — cùng nhịp gấp với D nhưng dồn sự chú ý vào con người thay vì vào việc.',
    strengths: ['Cởi mở, dễ kết nối nhiều người', 'Nhiệt tình, tạo không khí tích cực', 'Thuyết phục và truyền cảm hứng'],
    growth: ['Chú ý chi tiết và theo việc đến cùng', 'Cân bằng cảm xúc khi ra quyết định', 'Lắng nghe nhiều hơn thay vì nói quá nhiều'],
    workStyle:
      'Toả sáng ở vai trò giao tiếp và kết nối — bán hàng, marketing, truyền thông, quan hệ khách hàng, đào tạo, sự kiện. Hợp môi trường năng động, nhiều tương tác.',
    communication:
      'Thích trò chuyện thân thiện và được ghi nhận. Để làm việc với nhóm I: cởi mở, dành chút thời gian hàn huyên và công nhận đóng góp của họ.',
    underPressure: 'Khi căng thẳng dễ sa đà cảm xúc, mất tập trung và né tránh việc đơn điệu.',
    collaboration:
      'Với nhóm D, người I nên gói năng lượng lại thành vài điểm chốt để không bị coi là nói lan man. Với nhóm S, I cần chậm lại và lắng nghe nhiều hơn, vì người S ngại bị cuốn theo nhịp quá dồn. Với nhóm C, I nên chuẩn bị dữ liệu và cam kết theo việc đến cùng, vì người C tin vào bằng chứng hơn là sự nhiệt tình.',
    misreads:
      'Nhóm I hay bị gắn nhãn hời hợt hoặc chỉ giỏi nói. Thật ra sự cởi mở đó là cách họ xây lòng tin và mở đường cho những việc khó nói. Khi có người lo phần chi tiết cùng, người I thường theo đuổi mục tiêu bền hơn ta tưởng.',
    neighbors: ['d', 's'],
    opposite: 'c',
  },
  s: {
    vi: 'Kiên định',
    en: 'Steadiness',
    pace: 'Chậm, ôn hoà',
    focus: 'Tập trung vào người',
    tagline: 'Điềm đạm, kiên nhẫn, đáng tin và coi trọng hoà hợp.',
    overview:
      'Người nhóm S giữ nhịp cho tập thể. Họ điềm đạm, kiên nhẫn, lắng nghe kỹ và trung thành với người và việc đã chọn. Thay vì phá cách, họ muốn mọi thứ chạy đều và hoà thuận, nên thường là chỗ dựa lặng lẽ mà ai cũng cần khi căng thẳng. Điểm mạnh là sự bền bỉ và đáng tin; điểm cần để ý là ngại thay đổi gấp và khó nói "không". Trên hai trục DISC, nhóm S nằm ở góc chậm và hướng người — cùng hướng người với I nhưng đi bằng nhịp ôn hoà thay vì sôi nổi.',
    strengths: ['Kiên nhẫn, điềm đạm, đáng tin', 'Lắng nghe và hỗ trợ người khác', 'Bền bỉ, giữ nhịp ổn định'],
    growth: ['Cởi mở hơn với thay đổi', 'Dám nói "không" và nêu chính kiến', 'Chủ động thay vì chờ đợi'],
    workStyle:
      'Vững vàng ở vai trò cần ổn định và phối hợp — vận hành, hỗ trợ, chăm sóc khách hàng, nhân sự, hậu cần, điều dưỡng. Hợp môi trường hài hoà, ít biến động đột ngột.',
    communication:
      'Thích sự nhẹ nhàng, chân thành và được báo trước thay đổi. Để làm việc với nhóm S: kiên nhẫn, tạo cảm giác an toàn và tránh ép thay đổi gấp.',
    underPressure: 'Khi căng thẳng dễ thu mình, ngại va chạm và âm thầm chịu đựng.',
    collaboration:
      'Với nhóm D, người S cần được báo trước và nói rõ giới hạn của mình thay vì âm thầm chịu. Với nhóm I, S nên đón nhận sự sôi nổi nhưng vẫn giữ nhịp đều để việc không loãng. Với nhóm C, S dễ đồng điệu ở sự cẩn thận, chỉ cần cùng nhau dám quyết khi đã đủ dữ liệu thay vì trì hoãn mãi.',
    misreads:
      'Nhóm S hay bị hiểu là thụ động hoặc thiếu chính kiến. Thật ra họ có quan điểm rõ, chỉ đặt hoà khí lên trước nên ít phát biểu ồn ào. Khi thấy an toàn và được hỏi thẳng, người S nói ra điều rất đáng nghe.',
    neighbors: ['i', 'c'],
    opposite: 'd',
  },
  c: {
    vi: 'Tuân thủ',
    en: 'Conscientiousness',
    pace: 'Chậm, ôn hoà',
    focus: 'Tập trung vào việc',
    tagline: 'Cẩn thận, chính xác, coi trọng chất lượng và quy chuẩn.',
    overview:
      'Người nhóm C theo đuổi sự đúng. Họ phân tích kỹ, coi trọng dữ liệu, làm theo quy trình và đặt tiêu chuẩn cao cho chất lượng. Trước khi quyết, họ muốn hiểu rõ vì sao, nên đôi khi trông chậm nhưng ít khi sai vặt. Điểm mạnh là sự chính xác và tư duy hệ thống; điểm cần để ý là dễ cầu toàn và chần chừ khi dữ liệu chưa đủ. Trên hai trục DISC, nhóm C nằm ở góc chậm và hướng việc — cùng hướng việc với D nhưng đi bằng nhịp thận trọng thay vì quyết liệt.',
    strengths: ['Cẩn thận, chính xác, có hệ thống', 'Phân tích kỹ trước khi quyết', 'Tôn trọng quy trình và chất lượng'],
    growth: ['Quyết định cả khi dữ liệu chưa hoàn hảo', 'Bớt cầu toàn để kịp tiến độ', 'Cởi mở với góc nhìn cảm xúc của người khác'],
    workStyle:
      'Sâu sắc ở công việc cần độ chính xác — kế toán, kiểm toán, phân tích, kỹ thuật, pháp lý, kiểm soát chất lượng, nghiên cứu. Hợp môi trường rõ tiêu chí, ít ngẫu hứng.',
    communication:
      'Thích thông tin rõ ràng, có dữ liệu, không vòng vo cảm xúc. Để làm việc với nhóm C: chuẩn bị kỹ, đưa số liệu và cho họ thời gian phân tích.',
    underPressure: 'Khi căng thẳng dễ cầu toàn quá mức, chần chừ và hay phê phán.',
    collaboration:
      'Với nhóm D, người C nên đưa kết luận trước rồi mới tới lý lẽ, vì D sốt ruột với phần dẫn dắt dài. Với nhóm I, C cần kiên nhẫn với sự ngẫu hứng và giúp biến ý tưởng thành kế hoạch cụ thể. Với nhóm S, C dễ hợp ở sự chỉn chu, chỉ cần cùng nhau tránh biến thận trọng thành trì hoãn.',
    misreads:
      'Nhóm C hay bị chê là khó tính hoặc bắt bẻ. Thật ra sự soi xét đó nhắm vào chất lượng công việc, không phải vào con người. Khi tiêu chí được nói rõ từ đầu, người C là hàng rào đáng quý chặn lỗi trước khi nó lọt ra ngoài.',
    neighbors: ['s', 'd'],
    opposite: 'i',
  },
};

export interface DiscStyleRef {
  slug: string;
  letter: string; // 'D'
  vi: string;
}

export interface DiscStyleData extends DiscStyleRaw {
  slug: string;
  letter: string;
  neighborRefs: DiscStyleRef[];
  oppositeRef: DiscStyleRef;
  others: DiscStyleRef[];
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

const refOf = (slug: string): DiscStyleRef => {
  const s = STYLES[slug];
  if (!s) throw new Error(`Unknown DISC style: ${slug}`);
  return { slug, letter: slug.toUpperCase(), vi: s.vi };
};

export const listStyles = (): DiscStyleRef[] => DISC_SLUGS.map(refOf);

export function buildStyle(slugRaw: string): DiscStyleData | null {
  const slug = slugRaw.toLowerCase();
  if (!(DISC_SLUGS as readonly string[]).includes(slug)) return null;
  const s = STYLES[slug];
  if (!s) return null;

  const letter = slug.toUpperCase();
  const neighborRefs = s.neighbors.map(refOf);
  const oppositeRef = refOf(s.opposite);
  const others = DISC_SLUGS.filter((x) => x !== slug).map(refOf);

  const seoTitle = `DISC Nhóm ${letter} — ${s.vi} (${s.en})`;
  const seoDescription = `Nhóm ${letter} DISC (${s.vi}/${s.en}): tổng quan, điểm mạnh, hướng phát triển, cách giao tiếp – làm việc, công việc hợp. Mô tả xu hướng, không phán số mệnh.`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `DISC nhóm ${letter} (${s.vi}) là người thế nào?`,
      a: `${s.overview} Trên hai trục DISC, nhóm ${letter} thuộc nhịp ${s.pace.toLowerCase()} và ${s.focus.toLowerCase()}.`,
    },
    {
      q: `Điểm mạnh và điều nhóm ${letter} cần lưu ý là gì?`,
      a: `Điểm mạnh: ${s.strengths.join('; ')}. Hướng phát triển: ${s.growth.join('; ')}.`,
    },
    {
      q: `Làm việc và giao tiếp với người nhóm ${letter} thế nào?`,
      a: s.communication,
    },
    {
      q: `Nhóm ${letter} hợp với công việc nào?`,
      a: `${s.workStyle} Đây là xu hướng tham khảo, không phải giới hạn — ai cũng có thể làm tốt ở nhiều lĩnh vực.`,
    },
    {
      q: `Nhóm ${letter} khi căng thẳng thế nào?`,
      a: s.underPressure,
    },
    {
      q: `DISC nhóm ${letter} có chính xác không?`,
      a: `DISC mô tả phong cách hành vi ở thời điểm làm bài, không phải năng lực hay giá trị con người và không cố định cả đời. Phong cách có thể đổi theo vai trò (ở nhà khác ở công ty). Hãy xem nhóm ${letter} như một góc nhìn để hiểu mình và giao tiếp tốt hơn — không phải nhãn cố định hay lời phán.`,
    },
  ];

  return {
    ...s,
    slug,
    letter,
    neighborRefs,
    oppositeRef,
    others,
    seoTitle,
    seoDescription,
    faqs,
  };
}
