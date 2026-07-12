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
  /**
   * Chi này ứng giờ nào trong ngày + tháng nào trong năm + phương vị, theo bảng
   * 12 Địa Chi (giờ = 12 canh giờ, tháng suy từ mùa/khí trong nguồn, phương vị
   * lấy đúng nguồn §1.2). Kiến thức lịch pháp Can Chi (miền công cộng).
   */
  hourMonth: string;
  /**
   * Điểm nhấn quan hệ Can Chi: tam hợp với ai (vì sao hợp) và xung với ai (cơ
   * chế gì). PHẢI khớp bảng chân lý hop-tuoi-pairs.ts (TAM_HOP_GROUPS / LUC_XUNG).
   */
  pairNotes: string;
}

// Khoá theo slug. Nội dung = mô tả tính cách con-giáp dân gian phổ biến, mở rộng
// từ blurb + ngũ hành của từng chi; trình bày dạng "xu hướng", không phán định.
const EXTRA: Record<string, ChiExtra> = {
  ty: {
    tagline: 'Người xoay xở — nhanh nhạy, quan sát tinh, thích ứng khéo.',
    strengths: [
      'Nhanh trí, nắm bắt tình huống mới rất nhanh nhờ thói quen quan sát và liên hệ dữ kiện liên tục',
      'Ít bỏ sót chi tiết quanh mình vì luôn để ý những thay đổi nhỏ mà người khác dễ lướt qua',
      'Xoay xở khéo khi hoàn cảnh đổi, do sẵn tính linh hoạt và không ngại thử cách mới',
      'Biết lo xa và vun vén, nên thường có phương án dự phòng trước khi khó khăn ập tới',
    ],
    growthEdges: [
      'Nên chọn ưu tiên thay vì ôm nhiều việc một lúc — ôm quá nhiều dễ khiến việc quan trọng bị loãng',
      'Nên tập tin người và giao bớt việc; giữ hết cho mình sẽ tự giới hạn quy mô mình làm được',
      'Nên dành thời gian đi sâu một hướng thay vì rải mỏng, để sự nhanh nhạy tích lại thành chuyên môn',
    ],
    career: 'Sự nhanh nhạy và khả năng đọc tình huống khiến người tuổi Tý hợp những mảng cần ứng biến và nắm bắt cơ hội: kinh doanh, môi giới, phân tích thị trường, truyền thông hay các nghề dịch vụ đòi hỏi phản xạ nhanh. Điểm cần giữ là đừng ôm quá nhiều đầu việc cùng lúc mà chọn một hướng để tích lũy chuyên môn. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Tý ấm áp và chu đáo, thường âm thầm để ý rồi lo liệu cho người mình thương trước cả khi được nhờ. Mặt cần luyện là hay tự xoay xở một mình và giữ suy nghĩ trong lòng, khiến đối phương khó hiểu hết tâm ý. Khi học cách nói thẳng mong muốn và chia sẻ cả lúc mình đang lo, mối quan hệ sẽ nhẹ nhàng và gần gũi hơn. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Chi Tý ứng giờ Tý (23–1 giờ), lúc đêm sâu nhất trong ngày, và tháng 11 âm lịch giữa mùa đông. Về phương vị, Tý trấn chính Bắc, mang khí Thủy thuần và tính Dương mở đầu vòng mười hai chi.',
    pairNotes: 'Tý hợp nhất với Thân và Thìn, ba chi tụ thành Thủy cục nên dễ cùng hướng, hỗ trợ nhau về tư duy và kế hoạch dài hơi. Ngược lại Tý xung Ngọ vì hai hành Thủy và Hỏa đối khắc — chỉ là khác nhịp cần dung hòa, không phải khắc kỵ.',
  },
  suu: {
    tagline: 'Người xây nền — bền bỉ, kiên định, đáng tin.',
    strengths: [
      'Kiên trì làm tới nơi tới chốn những việc dài hạn, nhờ sức bền và khả năng chịu đựng hiếm có',
      'Giữ lời và giữ cam kết, vì với người tuổi Sửu chữ tín quan trọng hơn cái lợi trước mắt',
      'Chịu khó, không ngại việc nặng, do quen đặt trách nhiệm lên trên sự thoải mái',
      'Vững vàng, ít bị cuốn theo cảm xúc nhất thời, nên là chỗ dựa đáng tin khi tập thể chao đảo',
    ],
    growthEdges: [
      'Nên cởi mở hơn với cách làm mới — bám mãi lối cũ dễ bỏ lỡ cách nhanh hơn, nhẹ hơn',
      'Nên tập linh hoạt khi hoàn cảnh đổi, vì sự kiên định quá mức đôi khi thành bướng bỉnh',
      'Nên chia sẻ cảm xúc nhiều hơn thay vì dồn nén, để người thân không hiểu lầm là lạnh nhạt',
    ],
    career: 'Sự bền bỉ và tinh thần trách nhiệm khiến người tuổi Sửu hợp những việc cần nền tảng vững và làm lâu dài: kỹ thuật, sản xuất, nông nghiệp, tài chính hay vận hành. Họ không giỏi những cú bứt tốc chớp nhoáng, nhưng lại rất mạnh ở việc xây dần và giữ ổn định. Điều nên luyện là bớt ôm hết vào mình và cởi mở hơn với cách làm mới. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Sửu chậm mở lòng nhưng một khi đã gắn bó thì chung thủy và bền bỉ, thường thể hiện bằng hành động chăm lo hơn là lời ngọt ngào. Mặt cần luyện là hay giữ cảm xúc trong lòng, khiến đối phương phải đoán. Khi học cách nói ra suy nghĩ và đón nhận cách yêu khác mình, mối quan hệ sẽ ấm và dễ thở hơn. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Sửu ứng giờ Sửu (1–3 giờ), khoảng khuya trâu dậy nhai lại, và tháng Chạp cuối đông. Phương vị Đông-Bắc, hành Thổ, tính Âm — giai đoạn đất còn lạnh nhưng đã ngậm mầm cho mùa xuân sắp tới.',
    pairNotes: 'Sửu thuộc Kim cục cùng Tỵ và Dậu, nhóm đề cao kỷ luật và độ chính xác nên dễ ăn ý trong việc chuyên môn. Sửu xung Mùi, nhưng cả hai cùng hành Thổ nên không phải đối khắc về hành mà là "xung mộ khố" — các tàng can trong kho đất va nhau.',
  },
  dan: {
    tagline: 'Người mở đường — mạnh mẽ, dũng cảm, truyền cảm hứng.',
    strengths: [
      'Dám nghĩ dám làm, không ngại thử thách, nhờ bản lĩnh và niềm tin vào chính mình',
      'Truyền năng lượng và cảm hứng cho người quanh mình, vì khí thế của họ dễ lan ra tập thể',
      'Thẳng thắn bảo vệ lẽ phải, do coi trọng chính trực hơn sự dễ chịu tạm thời',
      'Sẵn sàng nhận phần khó và đứng mũi chịu sào, nên hợp vai trò dẫn dắt lúc gian nan',
    ],
    growthEdges: [
      'Nên giữ nhịp để không đốt sức quá nhanh — lao hết tốc lực dễ kiệt trước khi tới đích',
      'Nên kiên nhẫn lắng nghe trước khi hành động, vì quyết nhanh đôi khi bỏ sót góc nhìn quan trọng',
      'Nên dành chỗ cho ý kiến khác thay vì áp đặt, để người cùng làm thấy được tôn trọng',
    ],
    career: 'Bản lĩnh và khả năng truyền cảm hứng khiến người tuổi Dần hợp vai trò tiên phong và dẫn dắt: khởi nghiệp, quản lý, thể thao hay những nghề cần dám quyết và chịu trách nhiệm. Họ mạnh ở lúc mở đường và tạo khí thế cho cả nhóm. Điều nên luyện là giữ sức bền và biết lắng nghe để đường dài không hụt hơi. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Dần nồng nhiệt và che chở, yêu là dốc lòng và sẵn sàng đứng ra bảo vệ người mình thương. Mặt cần luyện là cá tính mạnh và nhịp sống nhanh, đôi khi lấn át hoặc quên dành khoảng lặng cho đối phương. Họ hợp người giữ được lửa riêng và cho mình chút tự do để bung năng lượng. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Dần ứng giờ Dần (3–5 giờ), lúc trời sắp hửng, và tháng Giêng mở đầu mùa xuân. Phương vị Đông-Bắc, hành Mộc, tính Dương — khí xuân bắt đầu trỗi, cây cối chuẩn bị đâm chồi.',
    pairNotes: 'Dần cùng Ngọ và Tuất hợp thành Hỏa cục, nhóm nhiều nhiệt huyết và sức bật, hợp khởi sự. Dần xung Thân do hai hành Mộc và Kim đối khắc — chỉ nghĩa là hai nếp sống khác nhịp, cần thấu hiểu nhau hơn chứ không phải điềm xấu.',
  },
  mao: {
    tagline: 'Người giữ hoà khí — tinh tế, ôn hoà, khéo léo.',
    strengths: [
      'Tinh tế, nhạy với cảm xúc và không khí xung quanh, nên thường đọc được điều người khác chưa nói ra',
      'Ôn hoà và giỏi giữ hoà khí, vì biết cách làm dịu căng thẳng thay vì đổ thêm dầu',
      'Lịch thiệp, dễ mến, do chú ý đến cách cư xử và cảm nhận của người đối diện',
      'Có gu thẩm mỹ tốt, yêu sự nhẹ nhàng hài hoà, nên khéo tạo không gian và quan hệ dễ chịu',
    ],
    growthEdges: [
      'Nên đối diện quyết định khó thay vì trì hoãn — né mãi chỉ khiến vấn đề tích lại nặng hơn',
      'Nên tập nói thẳng chính kiến khi cần, vì giữ hoà khí quá mức dễ đánh mất điều mình coi trọng',
      'Nên bớt ngại va chạm để bảo vệ ranh giới của mình, không phải lúc nào nhường cũng là tốt',
    ],
    career: 'Sự khéo léo và tinh tế trong ứng xử khiến người tuổi Mão hợp những việc cần đọc cảm xúc và giữ quan hệ: ngoại giao, dịch vụ, thiết kế, chăm sóc khách hàng hay tư vấn. Họ tạo được sự tin cậy nhờ cách cư xử nhẹ nhàng, có gu. Điều nên luyện là dám ra quyết định khó và nói thẳng chính kiến thay vì né tránh. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Mão dịu dàng, biết nhường nhịn và rất để ý cảm xúc của đối phương, nên thường mang lại cảm giác được nâng niu. Mặt cần luyện là hay ngại va chạm nên dồn nén thay vì nói ra điều chưa hài lòng. Họ hợp một người kiên nhẫn giúp mình cởi mở và cùng chia phần ra quyết định. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Mão ứng giờ Mão (5–7 giờ), lúc mặt trời vừa mọc, và tháng Hai giữa xuân. Phương vị chính Đông, hành Mộc, tính Âm — thời điểm cây cối tươi tốt nhất, khí xuân đang độ viên mãn.',
    pairNotes: 'Mão hợp với Hợi và Mùi thành Mộc cục, nhóm thiên về nuôi dưỡng, nhân hòa và sáng tạo mềm. Mão xung Dậu vì Mộc và Kim đối khắc về hành — cặp khác nhịp này vẫn có thể rất bền khi biết biến khác biệt thành bổ sung.',
  },
  thin: {
    tagline: 'Người dẫn dắt — tự tin, tầm nhìn, giàu năng lượng.',
    strengths: [
      'Có tầm nhìn và hoài bão lớn, nên thường nghĩ xa hơn cái trước mắt',
      'Tự tin đứng mũi chịu sào, vì không ngại nhận trách nhiệm và ánh nhìn của đám đông',
      'Năng lượng dồi dào, dám theo đuổi mục tiêu lớn, do ít bị nản bởi trở ngại ban đầu',
      'Rộng lượng, sẵn lòng nâng đỡ người quanh mình, nên dễ quy tụ được người cùng chí hướng',
    ],
    growthEdges: [
      'Nên lắng nghe nhiều hơn để giữ sự đồng thuận — tầm nhìn lớn vẫn cần người khác đồng hành mới thành',
      'Nên kiềm chế cái tôi khi làm việc nhóm, vì muốn dẫn dắt quá dễ khiến người khác thấy bị lấn',
      'Nên chấp nhận ý kiến trái chiều thay vì bảo vệ mình tới cùng, để quyết định bớt điểm mù',
    ],
    career: 'Tầm nhìn và sức bật khiến người tuổi Thìn hợp vai trò lãnh đạo và kiến tạo: quản lý, khởi nghiệp, truyền thông hay những nghề cần vẽ ra hướng đi và kéo người khác theo. Họ giỏi truyền hoài bão và không ngại mục tiêu lớn. Điều nên luyện là lắng nghe và kiềm chế cái tôi để giữ được người đồng hành đường dài. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Thìn nồng nhiệt và tận tâm với người mình chọn, thường muốn che chở và lo cho đối phương một tương lai vững. Mặt cần luyện là cá tính mạnh và hay muốn dẫn dắt, đôi khi quên hỏi xem người kia thật sự cần gì. Khi học cách lắng nghe và cùng quyết định, hai người sẽ đi được đường dài. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Thìn ứng giờ Thìn (7–9 giờ), lúc sương tan nắng lên, và tháng Ba cuối xuân. Phương vị Đông-Nam, hành Thổ, tính Dương — đất ẩm giao mùa, dân gian gắn với hình tượng rồng gọi mưa.',
    pairNotes: 'Thìn nằm trong Thủy cục cùng Thân và Tý, nhóm coi trọng trí tuệ và kế hoạch dài hơi. Thìn xung Tuất, song hai chi cùng hành Thổ nên đây là "xung mộ khố" — kho đất va nhau — chứ không phải đối khắc về ngũ hành.',
  },
  ti: {
    tagline: 'Người chiều sâu — sâu sắc, điềm tĩnh, trực giác tốt.',
    strengths: [
      'Sâu sắc, nhìn thấu bản chất tình huống, nhờ thói quen quan sát và suy xét kỹ trước khi kết luận',
      'Điềm tĩnh giữa lúc rối ren, vì ít để cảm xúc bên ngoài cuốn đi',
      'Trực giác nhạy khi đọc người và việc, do tinh ý nắm những tín hiệu nhỏ',
      'Kiên định với mục tiêu đã chọn, nên theo đuổi việc khó một cách bền bỉ và kín đáo',
    ],
    growthEdges: [
      'Nên chủ động chia sẻ để người khác hiểu mình hơn — kín quá dễ bị hiểu lầm là xa cách',
      'Nên tập mở lòng và tin tưởng thay vì giữ kín mọi thứ, vì đề phòng quá mức làm hao quan hệ',
      'Nên bớt nghi ngại để cộng tác cởi mở hơn, không phải ai tới gần cũng có ý riêng',
    ],
    career: 'Chiều sâu và khả năng nhìn thấu khiến người tuổi Tỵ hợp việc cần đào sâu và tính chiến lược: nghiên cứu, tài chính, tư vấn hay những nghề đòi hỏi chuyên môn kín kẽ. Họ mạnh ở phân tích và giữ được bình tĩnh khi người khác rối. Điều nên luyện là chủ động chia sẻ và tin người hơn để phối hợp trơn tru. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Tỵ yêu sâu và chung thủy, coi trọng sự chân thành và chiều sâu hơn là vẻ ồn ào bên ngoài. Mặt cần luyện là hay giữ cảm xúc kín, khiến đối phương khó biết mình đang nghĩ gì. Khi tập nói ra điều trong lòng và bớt phòng thủ, mối quan hệ sẽ tin cậy và gần gũi hơn nhiều. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Tỵ ứng giờ Tỵ (9–11 giờ), lúc nắng đã gắt, và tháng Tư mở đầu mùa hạ. Phương vị Đông-Nam, hành Hỏa, tính Âm — khí nóng bắt đầu dâng, đây là chặng chuyển từ xuân sang hè.',
    pairNotes: 'Tỵ hợp cùng Dậu và Sửu thành Kim cục, nhóm quyết đoán, kỷ luật, hợp việc cần chuyên môn. Tỵ xung Hợi do Hỏa và Thủy đối khắc — chỉ là hai nhịp trái chiều cần dung hòa bằng thái độ, tuyệt đối không phải chuyện kiêng kỵ.',
  },
  ngo: {
    tagline: 'Người tự do — nhiệt tình, phóng khoáng, năng động.',
    strengths: [
      'Nhiệt tình và tràn năng lượng, nên dễ khiến người quanh mình phấn chấn theo',
      'Phóng khoáng, cởi mở, dễ kết giao, vì sẵn lòng bắt chuyện và ít giữ khoảng cách',
      'Dám hành động và bứt tốc, do không thích chần chừ khi đã thấy hướng đi',
      'Thẳng thắn, chân thành trong giao tiếp, nên người khác thường biết rõ mình đang ở đâu với họ',
    ],
    growthEdges: [
      'Nên dành chỗ để nghỉ và tránh ôm việc vượt sức — cháy hết mình rồi hụt hơi là điểm dễ vấp',
      'Nên kiên nhẫn theo một việc tới cùng, vì nhiệt nhanh cũng dễ nguội nhanh',
      'Nên lắng lại để cân nhắc trước khi quyết, không phải cơ hội nào cũng đáng lao vào ngay',
    ],
    career: 'Sự năng động và cởi mở khiến người tuổi Ngọ hợp việc nhiều di chuyển và tiếp xúc: kinh doanh, du lịch, thể thao, sự kiện hay bán hàng. Họ mạnh ở khả năng tạo khí thế và bắt nhịp nhanh với người mới. Điều nên luyện là giữ sức và kiên nhẫn theo một việc tới cùng thay vì cả thèm chóng chán. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Ngọ nồng nhiệt và yêu tự do, mang lại sự sôi nổi và những trải nghiệm mới cho mối quan hệ. Mặt cần luyện là nhịp sống nhanh và thích bay nhảy, đôi khi quên vun cho sự ổn định lâu dài. Họ hợp người cùng thích khám phá và biết tôn trọng khoảng riêng của nhau. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Ngọ ứng giờ Ngọ (11–13 giờ), đúng giữa trưa nắng đỉnh, và tháng Năm giữa mùa hạ. Phương vị chính Nam, hành Hỏa, tính Dương — thời điểm dương khí mạnh nhất trong cả vòng mười hai chi.',
    pairNotes: 'Ngọ cùng Dần và Tuất hợp thành Hỏa cục, nhóm hành động mạnh, dễ lan tỏa năng lượng. Ngọ xung Tý vì Hỏa và Thủy đối khắc về hành — cặp nóng và nguội này nếu biết nhường nhịn đúng lúc lại bù trừ tốt cho nhau.',
  },
  mui: {
    tagline: 'Người vun vén — hiền hoà, quan tâm, ấm áp.',
    strengths: [
      'Hiền hoà và biết quan tâm, tạo cảm giác an toàn, nhờ luôn để ý tới cảm xúc người bên cạnh',
      'Giàu lòng trắc ẩn, dễ đồng cảm, vì đặt mình vào vị trí người khác một cách tự nhiên',
      'Kiên nhẫn chăm chút chi tiết, do không ngại bỏ công cho những việc tỉ mỉ',
      'Có gu thẩm mỹ mềm mại và óc sáng tạo, nên khéo làm đẹp cho không gian và quan hệ quanh mình',
    ],
    growthEdges: [
      'Nên giữ ranh giới cho riêng mình thay vì cả nể — chiều mãi dễ khiến mình kiệt sức âm thầm',
      'Nên tự tin vào quyết định của bản thân, vì dựa vào ý người khác quá nhiều dễ đánh mất chính kiến',
      'Nên bày tỏ nhu cầu thay vì luôn nhường, để người thân biết mình cũng cần được quan tâm',
    ],
    career: 'Sự chu đáo và tinh tế khiến người tuổi Mùi hợp việc cần chăm sóc và cảm thông: chăm sóc sức khoẻ, giáo dục, nghệ thuật, dịch vụ hay nhân sự. Họ tạo được môi trường ấm và tỉ mỉ, khiến người quanh mình an tâm. Điều nên luyện là giữ ranh giới và tự tin vào quyết định để không tự làm khó mình vì cả nể. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Mùi dịu dàng và tận tâm vun vén tổ ấm, thường đặt cảm xúc của người thương lên trước cả mình. Mặt cần luyện là hay nhường nhịn và ngại bày tỏ nhu cầu, lâu dần dễ tủi thân. Họ hợp một người biết trân trọng sự chăm chút ấy và cùng gánh vác thay vì để họ lo hết. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Mùi ứng giờ Mùi (13–15 giờ), buổi chiều nắng dịu dần, và tháng Sáu cuối mùa hạ. Phương vị Tây-Nam, hành Thổ, tính Âm — đất giữ hơi nóng, cây trái vào độ chín, khí hè bắt đầu lui.',
    pairNotes: 'Mùi thuộc Mộc cục cùng Hợi và Mão, nhóm nhân hòa, thiên về vun đắp. Mùi xung Sửu nhưng cả hai cùng hành Thổ, nên không phải khắc về hành mà là "xung mộ khố" — tàng can trong hai kho đất va nhau, chỉ cần thêm kiên nhẫn.',
  },
  than: {
    tagline: 'Người sáng tạo — linh hoạt, thông minh, hoạt bát.',
    strengths: [
      'Thông minh, giỏi tìm giải pháp sáng tạo, nhờ đầu óc nhanh và cách nghĩ ít lối mòn',
      'Linh hoạt, thích ứng nhanh với thay đổi, vì không ngại rời vùng quen để thử cái mới',
      'Hoạt bát, hài hước, dễ tạo không khí vui, nên thường là chất keo gắn kết tập thể',
      'Ham học và tò mò, nắm cái mới rất nhanh, do luôn hứng thú với những gì chưa biết',
    ],
    growthEdges: [
      'Nên tập trung để không phân tán quá nhiều hướng — ôm nhiều mối quan tâm dễ khiến không cái nào tới nơi',
      'Nên kiên trì đi tới cùng thay vì cả thèm chóng chán, vì thứ có giá trị thường cần thời gian',
      'Nên giữ sự chân thành thay vì chỉ dựa vào khéo léo, để người khác tin lâu dài chứ không chỉ thấy vui',
    ],
    career: 'Óc sáng tạo và khả năng ứng biến khiến người tuổi Thân hợp việc cần linh hoạt và đổi mới: công nghệ, truyền thông, kinh doanh, giải trí hay những nghề đề cao ý tưởng. Họ nhanh nắm cái mới và giỏi xoay chuyển tình huống. Điều nên luyện là tập trung và kiên trì để tài xoay xở tích lại thành thành tựu bền. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Thân vui vẻ và thú vị khi ở bên, giỏi trò chuyện và làm mới mối quan hệ nên hiếm khi nhàm chán. Mặt cần luyện là dễ chán và thích cái mới, đôi khi thiếu sự bền bỉ để đi đường dài. Họ hợp người hợp gu chuyện trò và giúp mình neo lại ở sự ổn định. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Thân ứng giờ Thân (15–17 giờ), buổi chiều muộn, và tháng Bảy mở đầu mùa thu. Phương vị Tây-Nam, hành Kim, tính Dương — khí kim se lại, trời bắt đầu hanh, chuyển từ hạ sang thu.',
    pairNotes: 'Thân hợp với Tý và Thìn thành Thủy cục, nhóm linh hoạt, giỏi tư duy và ứng biến. Thân xung Dần do Kim và Mộc đối khắc — hai người khác cách ra quyết định, chỉ cần phân vai rõ là khác biệt thành lợi thế đa góc nhìn.',
  },
  dau: {
    tagline: 'Người hoàn thiện — cẩn thận, kỷ luật, tỉ mỉ.',
    strengths: [
      'Cẩn thận và kỷ luật, chú trọng chi tiết, nhờ đặt tiêu chuẩn rõ cho việc mình làm',
      'Ngăn nắp, có tổ chức và trách nhiệm cao, vì thích mọi thứ đâu vào đấy và làm tới cùng',
      'Thẳng thắn, dám nói điều mình nghĩ, do coi trọng sự thật hơn việc làm vừa lòng',
      'Chăm chỉ và làm việc có chuẩn mực, nên kết quả thường chỉn chu, đáng tin',
    ],
    growthEdges: [
      'Nên bớt khắt khe với mình và người khác — tiêu chuẩn cao quá dễ thành áp lực cho cả hai phía',
      'Nên linh hoạt thay vì cứng theo nguyên tắc, vì không phải tình huống nào cũng vừa khuôn',
      'Nên ghi nhận điểm tốt trước khi góp ý, để lời thẳng của mình được đón nhận thay vì gây tổn thương',
    ],
    career: 'Sự chính xác và kỷ luật khiến người tuổi Dậu hợp việc cần quy trình và chuẩn mực: kế toán, kiểm soát chất lượng, quản trị, kỹ thuật hay biên tập. Họ mạnh ở chỗ ít sai sót và giữ mọi thứ chỉn chu. Điều nên luyện là mềm mỏng và linh hoạt hơn để tiêu chuẩn cao không thành áp lực cho người cùng làm. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Dậu tận tâm và chu đáo, thể hiện quan tâm bằng cách lo cho đối phương thật kỹ lưỡng. Mặt cần luyện là hay để ý tiểu tiết và nói thẳng, đôi khi lời quan tâm nghe thành lời phê bình. Khi học cách mềm giọng và ghi nhận trước khi góp ý, người thương sẽ cảm được tình thay vì thấy bị soi. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Dậu ứng giờ Dậu (17–19 giờ), lúc chập tối gà lên chuồng, và tháng Tám giữa mùa thu. Phương vị chính Tây, hành Kim, tính Âm — thời điểm thu hoạch, khí kim đang độ viên mãn nhất.',
    pairNotes: 'Dậu cùng Tỵ và Sửu hợp thành Kim cục, nhóm chú trọng chi tiết và độ chính xác. Dậu xung Mão vì Kim và Mộc đối khắc về hành — cặp khác nhịp này vẫn hợp tác tốt khi giao tiếp rõ ràng, không phải điều để lo sợ.',
  },
  tuat: {
    tagline: 'Người trung thành — trung thực, trách nhiệm, đáng tin.',
    strengths: [
      'Trung thực và giàu nguyên tắc, nhờ coi lẽ phải là chuyện không nhân nhượng',
      'Trung thành, sẵn lòng bảo vệ người mình tin tưởng, vì lòng tin với họ là điều thiêng liêng',
      'Công bằng, coi trọng lẽ phải, do ghét sự thiên vị và bất công',
      'Bền chí, đáng tin trong cam kết, nên là chỗ dựa chắc chắn cho người thân và tập thể',
    ],
    growthEdges: [
      'Nên thư giãn hơn để tránh căng thẳng không cần thiết — gánh quá nhiều lo lắng dễ bào mòn chính mình',
      'Nên tập tin tưởng thay vì luôn cảnh giác, vì đề phòng thường trực làm quan hệ thêm nặng',
      'Nên bớt lo xa để tận hưởng hiện tại, không phải nguy cơ nào cũng đáng canh cánh trong lòng',
    ],
    career: 'Sự chính trực và đáng tin khiến người tuổi Tuất hợp việc cần công tâm và trách nhiệm: pháp lý, an ninh, quản trị, dịch vụ công hay chăm sóc cộng đồng. Họ giữ nguyên tắc và bảo vệ lẽ phải một cách kiên định. Điều nên luyện là thả lỏng bớt và tin tưởng hơn để không tự chất lên mình quá nhiều gánh nặng. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Tuất chân thành và hết lòng bảo vệ người thương, một khi đã tin thì trung thành và bền bỉ. Mặt cần luyện là hay lo xa và cảnh giác, đôi khi khiến cả hai thấy nặng nề vì những nỗi lo chưa xảy ra. Khi học cách buông bớt và tin tưởng, mối quan hệ sẽ nhẹ nhõm và ấm hơn. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Tuất ứng giờ Tuất (19–21 giờ), buổi tối chó canh nhà, và tháng Chín cuối mùa thu. Phương vị Tây-Bắc, hành Thổ, tính Dương — đất khô se, khí thu tàn dần để nhường chỗ cho mùa đông.',
    pairNotes: 'Tuất nằm trong Hỏa cục cùng Dần và Ngọ, nhóm giàu sức bật, hợp khởi sự. Tuất xung Thìn, song hai chi cùng hành Thổ nên là "xung mộ khố" — hai kho đất va nhau — chứ không phải đối khắc ngũ hành, chỉ cần thêm bao dung.',
  },
  hoi: {
    tagline: 'Người rộng lượng — chân thành, hào phóng, dễ chịu.',
    strengths: [
      'Chân thành và rộng lượng, dễ chịu trong giao tiếp, nhờ ít so đo và giàu thiện chí',
      'Lạc quan, nhìn về mặt tốt của mọi việc, nên thường giữ được tinh thần vững khi khó khăn',
      'Bao dung, ít chấp nhặt, vì sẵn lòng cho người khác cơ hội và bỏ qua lỗi nhỏ',
      'Chăm chỉ và biết tận hưởng thành quả, do cân bằng được giữa làm và hưởng',
    ],
    growthEdges: [
      'Nên cân nhắc kỹ hơn khi chi tiêu hay cam kết — cả tin và hào phóng quá dễ khiến mình thiệt',
      'Nên đặt ranh giới để không bị lợi dụng lòng tốt, vì tử tế không đồng nghĩa với chịu thiệt mãi',
      'Nên tập nói "không" khi cần bảo vệ mình, không phải lời nhờ nào cũng buộc phải nhận',
    ],
    career: 'Sự chân thành và tinh thần hợp tác khiến người tuổi Hợi hợp việc cần thiện chí và gắn kết: dịch vụ, ẩm thực, chăm sóc khách hàng, thiện nguyện hay hậu cần. Họ dễ tạo thiện cảm và làm việc nhóm hòa thuận. Điều nên luyện là cân nhắc kỹ khi cam kết, chi tiêu và biết đặt ranh giới để lòng tốt không bị lợi dụng. Đây là xu hướng tham khảo theo con giáp, không phải giới hạn.',
    love: 'Trong tình cảm, người tuổi Hợi ấm áp và bao dung, dễ mang lại cảm giác an toàn và được chấp nhận như mình vốn có. Mặt cần luyện là hay cả nể và cho đi nhiều, đôi khi quên giữ phần cho chính mình. Họ hợp một người biết trân trọng và không lạm dụng sự rộng lượng ấy. Đây là xu hướng tham khảo, không phải khuôn cố định.',
    hourMonth: 'Hợi ứng giờ Hợi (21–23 giờ), lúc đêm đã khuya, và tháng Mười mở đầu mùa đông. Phương vị Tây-Bắc, hành Thủy, tính Âm — khí lạnh về, vạn vật thu mình, khép lại vòng mười hai chi.',
    pairNotes: 'Hợi hợp cùng Mão và Mùi thành Mộc cục, nhóm rộng lượng, thiên về nuôi dưỡng và nhân hòa. Hợi xung Tỵ do Thủy và Hỏa đối khắc — chỉ là khác nhịp cần thấu hiểu, nhiều cặp trái chiều kiểu này lại gắn bó rất bền.',
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
