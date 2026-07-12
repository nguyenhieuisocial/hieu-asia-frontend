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
    tagline: 'Người mở đường — bản năng lao vào trước khi kịp cân nhắc.',
    strengths: [
      'Dám nghĩ dám làm, khởi sự nhanh hơn hầu hết mọi người, vì phản xạ đầu tiên là bắt tay vào chứ không đứng phân vân',
      'Thẳng thắn, ít vòng vo, nên người khác luôn biết mình đang đứng ở đâu với bạn',
      'Can đảm nhận phần việc khó, coi trở ngại là thứ để vượt qua chứ không phải để né',
      'Truyền lửa cho cả nhóm, khí thế của bạn dễ kéo người quanh mình bật dậy theo',
    ],
    growthEdges: [
      'Nóng vội, thiếu kiên nhẫn với việc chậm, vì muốn thấy kết quả ngay nên hay bỏ qua khâu chuẩn bị',
      'Khởi đầu nhiều mà theo đến cùng ít, do lửa bốc lên nhanh và cũng nguội nhanh khi việc hết mới mẻ',
      'Nên tập dừng một nhịp để nghe trước khi phản ứng, vì câu bật ra tức thì đôi khi làm hỏng việc',
    ],
    love: 'Bạn yêu chủ động và nồng nhiệt: đã thích là theo đuổi tới cùng, không giấu. Sức hút nằm ở sự thẳng thắn, nhưng cũng vì nóng mà dễ mất kiên nhẫn khi quan hệ vào giai đoạn êm, cần vun vén từng ngày. Người hợp với bạn giữ được lửa riêng, dám nói lại và cho bạn khoảng tự do để xoay, thay vì bám chặt khiến bạn thấy ngột. Điều đáng luyện là ở lại đủ lâu để một mối quan hệ kịp sâu.',
    work: 'Bạn mạnh nhất khi mở đường: khởi động dự án mới, phá thế bí, làm cái chưa ai làm. Deadline gấp khiến bạn hưng phấn hơn là sợ. Chỗ cần để ý là đoạn giữa và đoạn cuối, khi việc thành lặp lại và cần người kiên trì ngồi hoàn thiện, đó không phải sở trường. Ghép với một người tỉ mỉ lo phần theo tới đích, hoặc tự ép mình chốt xong một việc trước khi nhảy sang việc mới, bạn sẽ đi xa hơn.',
  },
  1: {
    english: 'Taurus',
    dateLabel: '20/4 – 20/5',
    rulingPlanet: 'Sao Kim (♀)',
    tagline: 'Người xây nền — chậm mà chắc, một khi đã bám thì khó lay.',
    strengths: [
      'Kiên nhẫn, bền bỉ, làm tới nơi tới chốn, vì đã bắt đầu là muốn giữ đến khi ra kết quả thật',
      'Thực tế và đáng tin, giữ lời, nên người ta yên tâm giao việc dài hạn cho bạn',
      'Biết tận hưởng cái đẹp, cái ngon, sự thoải mái, nhờ giác quan nhạy với những gì cụ thể',
      'Giữ được bình tĩnh khi quanh mình rối, vì bạn bám vào cái chắc chắn thay vì cuốn theo hoảng loạn',
    ],
    growthEdges: [
      'Ngại thay đổi, dễ bám thói quen cũ, do cái quen mang lại cảm giác an toàn',
      'Đôi khi cứng đầu, khó lay chuyển một khi đã quyết, vì đổi ý làm bạn thấy bất an',
      'Nên coi chừng để vật chất và sở hữu lấn át, khi tiện nghi biến thành thước đo duy nhất',
    ],
    love: 'Bạn mở lòng chậm nhưng một khi đã gắn bó thì chung thủy và ấm. Tình cảm của bạn thể hiện qua những thứ chạm được: bữa ăn, cái ôm, sự có mặt đều đặn, hơn là lời hoa mỹ. Vì cần cảm giác chắc chắn, bạn dễ hoảng khi người kia thất thường hoặc quan hệ mập mờ. Người hợp với bạn coi trọng sự ổn định và gần gũi thật, chịu ở lại xây từng ngày thay vì hứa hẹn rồi biến mất.',
    work: 'Bạn làm việc đều tay và kết quả chắc, mạnh ở những mảng cần kiên trì lâu dài: tài chính, thẩm mỹ, thủ công, vận hành ổn định. Bạn không thích bị hối hay bị đổi hướng liên tục, vì mỗi lần đổi là phải xây lại từ đầu. Chỗ cần để ý là lúc công việc đòi xoay nhanh, sự chắc chắn của bạn có thể thành chậm chân. Học chấp nhận vài thay đổi có tính toán sẽ giúp bạn không bị bỏ lại.',
  },
  2: {
    english: 'Gemini',
    dateLabel: '21/5 – 20/6',
    rulingPlanet: 'Sao Thủy (☿)',
    tagline: 'Người kết nối — đầu óc chạy nhanh, thích nếm nhiều hơn là đào sâu.',
    strengths: [
      'Nhanh trí, nắm cái mới rất nhanh, vì đầu óc luôn mở và tò mò với mọi thứ',
      'Giao tiếp khéo, dễ bắt chuyện và kết nối, nhờ khả năng đọc và bắt nhịp người đối diện',
      'Biết nhiều thứ, linh hoạt, do sẵn sàng thử và học ở nhiều mảng cùng lúc',
      'Xoay chuyển tốt khi hoàn cảnh đổi, vì bạn không ngại rời kế hoạch cũ để bắt cái đang tới',
    ],
    growthEdges: [
      'Dễ phân tán, khó tập trung lâu một việc, vì cái mới luôn kéo sự chú ý đi chỗ khác',
      'Cả thèm chóng chán, khi việc mất đi cái mới mẻ thì hứng thú cũng nguội',
      'Cần kỷ luật để biến lời nói thành việc làm, vì nghĩ ra ý thì dễ, ngồi làm tới cùng mới khó',
    ],
    love: 'Bạn cần trò chuyện hợp gu và đầu óc được kích thích; một người yêu mà bạn thấy nhàm sẽ khó giữ chân bạn hơn là một người ở xa. Sức hút của bạn là sự dí dỏm và luôn có chuyện để nói. Vì mau chán, bạn dễ bị hiểu là hời hợt; thật ra bạn cần người biết làm mới quan hệ để cùng đi lâu. Học ở lại qua đoạn hết mới mẻ là bài lớn nhất của bạn trong tình cảm.',
    work: 'Bạn hợp việc cần thông tin và ngôn ngữ: viết lách, bán hàng, truyền thông, môi giới, bất cứ chỗ nào phải nói và kết nối. Bạn giỏi cầm nhiều việc cùng lúc và ứng biến nhanh khi tình huống đổi. Điểm yếu là những việc dài, lặp và đòi độ sâu, bạn dễ bỏ dở giữa chừng. Chọn môi trường nhiều biến động, hoặc ghép với người lo phần theo dõi và hoàn thiện, sẽ giúp thế mạnh của bạn không bị phí.',
  },
  3: {
    english: 'Cancer',
    dateLabel: '21/6 – 22/7',
    rulingPlanet: 'Mặt Trăng (☽)',
    tagline: 'Người che chở — sống bằng cảm xúc và ký ức, gắn chặt với tổ ấm.',
    strengths: [
      'Giàu tình cảm, biết chăm sóc người thân, vì bạn thật sự cảm được nhu cầu của người quanh mình',
      'Trực giác nhạy, đọc được không khí, nhờ luôn để ý tới sắc thái cảm xúc trong phòng',
      'Gắn bó gia đình, trân trọng kỷ niệm, do quá khứ và người thân là chỗ dựa lớn của bạn',
      'Trung thành và bao dung với người mình thương, sẵn lòng bao bọc họ khi họ yếu',
    ],
    growthEdges: [
      'Hay giữ trong lòng, dễ hờn dỗi, vì bạn cảm nhiều nhưng ngại nói thẳng điều làm mình đau',
      'Tâm trạng lên xuống theo cảm xúc, khi chuyện bên ngoài dội vào thế giới bên trong',
      'Nên tập buông những chuyện cũ đã qua, vì ký ức đẹp cũng có thể thành xiềng giữ bạn lại',
    ],
    love: 'Bạn yêu ấm áp và che chở, muốn xây một tổ ấm thật chứ không phải một mối quan hệ hời hợt. Bạn cần cảm giác an toàn và được cần đến; khi thấy chắc chắn, bạn cho đi rất nhiều. Nhưng vì nhạy cảm, bạn dễ tổn thương bởi những dấu hiệu nhỏ và hay tự diễn giải im lặng của người kia thành xa cách. Người hợp với bạn kiên nhẫn trấn an và không chơi trò lúc nóng lúc lạnh, thứ khiến bạn bất an nhất.',
    work: 'Bạn mạnh ở việc cần thấu cảm và chăm sóc: giáo dục, y tế, dịch vụ, chăm khách, những nghề nuôi dưỡng con người. Bạn tạo được cảm giác an toàn cho cả nhóm và nhớ rõ ai cần gì. Điểm cần để ý là bạn dễ mang cảm xúc cá nhân vào công việc và khó tách chuyện riêng với việc chung. Một môi trường tôn trọng, ít công kích cá nhân sẽ giúp bạn phát huy; nơi cạnh tranh gay gắt dễ làm bạn kiệt.',
  },
  4: {
    english: 'Leo',
    dateLabel: '23/7 – 22/8',
    rulingPlanet: 'Mặt Trời (☉)',
    tagline: 'Người tỏa sáng — hào phóng, cần được thấy và được ghi nhận.',
    strengths: [
      'Tự tin, dám đứng ra dẫn dắt, vì bạn không ngại nhận trách nhiệm và ánh nhìn của đám đông',
      'Hào phóng, ấm áp với người quanh mình, cho đi rộng rãi khi thấy được trân trọng',
      'Cuốn hút, biết truyền cảm hứng, nhờ sức nóng và sự chân thành khó giấu',
      'Trung thành và chân thành, một khi đã coi ai là người của mình thì bảo vệ tới cùng',
    ],
    growthEdges: [
      'Cần được công nhận, dễ tự ái khi bị phớt lờ, vì sự ghi nhận là nhiên liệu tinh thần của bạn',
      'Đôi khi muốn làm trung tâm, khiến người khác thấy khó chen vào',
      'Nên tập lắng nghe và nhường ánh đèn cho người khác, vì hào quang chia sẻ được thì bền hơn',
    ],
    love: 'Bạn yêu nồng nhiệt và lãng mạn, đã yêu là hết mình và muốn người kia tự hào về mình. Bạn cho đi hào phóng nhưng cũng cần được đáp lại bằng sự trân trọng công khai; một lời khen hay cái nắm tay trước mặt người khác nuôi bạn nhiều hơn bạn thừa nhận. Vì cái tôi lớn, bạn dễ dỗi khi thấy bị coi nhẹ. Người hợp với bạn biết ngưỡng mộ thật lòng và không ngại nói ra, thay vì giữ tình cảm trong bụng.',
    work: 'Bạn tỏa sáng ở vai trò dẫn dắt, trình diễn, sáng tạo, bất cứ chỗ nào cho phép bạn thể hiện cá tính riêng. Bạn làm tốt nhất khi nỗ lực được nhìn thấy và ghi nhận. Mặt trái là khi công việc thầm lặng hoặc công lao bị người khác nhận, bạn dễ hụt hẫng và mất động lực. Chọn nơi có sân khấu để thể hiện, đồng thời học ghi nhận đóng góp của đồng đội, bạn vừa giữ được lửa vừa được lòng người.',
  },
  5: {
    english: 'Virgo',
    dateLabel: '23/8 – 22/9',
    rulingPlanet: 'Sao Thủy (☿)',
    tagline: 'Người hoàn thiện — nhìn ra chỗ chưa ổn để sửa, phục vụ bằng sự tỉ mỉ.',
    strengths: [
      'Tỉ mỉ, cẩn thận, ít bỏ sót chi tiết, vì mắt bạn tự động bắt những chỗ chưa ổn',
      'Giỏi phân tích và cải thiện mọi thứ cho hữu ích hơn, nhờ luôn hỏi "cái này làm tốt hơn được không"',
      'Tận tâm phục vụ, làm việc có trách nhiệm, do bạn thấy giá trị của mình ở chỗ giúp việc chạy trơn',
      'Thực tế và đáng tin với việc cần chính xác, người ta yên tâm giao phần đòi độ chuẩn cho bạn',
    ],
    growthEdges: [
      'Hay cầu toàn, tự phê bình hơi nặng, vì cái thước bạn đặt cho mình cao hơn cho người khác',
      'Dễ lo lắng những tiểu tiết nhỏ, khi một lỗi con con cũng làm bạn day dứt',
      'Nên tập hài lòng với "đủ tốt" thay vì "hoàn hảo", vì chờ hoàn hảo thường là chờ mãi không xong',
    ],
    love: 'Bạn thể hiện tình cảm qua hành động chăm lo cụ thể hơn là lời đường mật: nhớ bạn thích gì, lo cho bạn những thứ nhỏ nhặt, sửa sang mọi thứ cho tiện. Vì quen soi lỗi để cải thiện, bạn dễ vô tình góp ý nhiều đến mức người kia thấy bị chê. Bạn cần người trân trọng sự tận tụy thầm lặng và hiểu rằng khi bạn nhắc nhở là bạn đang quan tâm. Học nói lời khen ra tiếng sẽ làm quan hệ của bạn dịu hơn nhiều.',
    work: 'Bạn xuất sắc ở việc cần chính xác và quy trình: kiểm soát chất lượng, biên tập, kế toán, y tế, phân tích, bất cứ chỗ nào một lỗi nhỏ gây hậu quả lớn. Bạn cải tiến quy trình giỏi và hiếm khi để lọt sai sót. Mặt cần để ý là dễ sa vào tiểu tiết và khó giao việc vì sợ người khác làm không đủ chuẩn. Học tin và ủy quyền, cùng chấp nhận rằng "xong" quan trọng hơn "hoàn hảo", sẽ giúp bạn đỡ kiệt sức.',
  },
  6: {
    english: 'Libra',
    dateLabel: '23/9 – 22/10',
    rulingPlanet: 'Sao Kim (♀)',
    tagline: 'Người cân bằng — luôn tìm điểm hài hòa, ngại đẩy tới xung đột.',
    strengths: [
      'Coi trọng công bằng, giỏi nhìn nhiều phía, vì bạn tự đặt mình vào chỗ của từng bên',
      'Khéo dung hòa, làm dịu căng thẳng, nhờ khả năng nói sao cho các bên đều nghe được',
      'Gu thẩm mỹ tốt, yêu cái đẹp và sự hài hòa, do bạn nhạy với cân đối và tỷ lệ',
      'Dễ mến, biết hợp tác, vì bạn ưu tiên giữ mối quan hệ hơn là thắng cho bằng được',
    ],
    growthEdges: [
      'Khó ra quyết định, hay phân vân, vì thấy được cái lý của mọi phương án nên khó chọn một',
      'Ngại xung đột nên đôi khi nể nang quá mức, khiến chính kiến của mình bị mờ đi',
      'Nên tập đứng vững với ý mình, vì chiều lòng tất cả thường là không thật lòng với ai',
    ],
    love: 'Bạn coi trọng sự hài hòa, lãng mạn và bình đẳng, thường sống tốt nhất khi có một nửa song hành. Bạn giỏi làm người kia thấy được lắng nghe và chiều chuộng. Nhưng vì ngại mất lòng, bạn hay nuốt bực bội và tránh nói thẳng điều mình cần, để rồi dồn nén lại bung ra sau. Người hợp với bạn khuyến khích bạn nói thật lòng và không lợi dụng sự dễ chịu của bạn. Học cãi nhau lành mạnh sẽ cứu quan hệ của bạn nhiều hơn là luôn nhường.',
    work: 'Bạn hợp việc cần cân bằng lợi ích và con mắt thẩm mỹ: đàm phán, thiết kế, luật, quan hệ công chúng, điều phối. Bạn làm dịu được những bàn họp căng và tìm ra phương án các bên chấp nhận. Điểm cần để ý là khi phải quyết nhanh và dứt khoát một mình, bạn dễ chần chừ và trì hoãn. Đặt hạn chót cho chính mình, hoặc làm ở nơi có người cùng chốt, sẽ giúp thế mạnh dung hòa của bạn không biến thành do dự.',
  },
  7: {
    english: 'Scorpio',
    dateLabel: '23/10 – 21/11',
    rulingPlanet: 'Sao Hỏa (♂)',
    rulingPlanetModern: 'Sao Diêm Vương (♇)',
    tagline: 'Người chiều sâu — cảm xúc mãnh liệt, đi tới tận cùng hoặc không gì cả.',
    strengths: [
      'Sâu sắc, đi tới tận cùng bản chất sự việc, vì bạn không chịu dừng ở lớp vỏ bề mặt',
      'Ý chí mạnh, kiên định với điều đã chọn, một khi đã quyết thì hiếm gì lay chuyển được',
      'Trực giác sắc bén, nhìn thấu người khác, nhờ luôn đọc động cơ ẩn sau lời nói',
      'Trung thành tuyệt đối với người mình tin tưởng, sẵn sàng bảo vệ tới cùng',
    ],
    growthEdges: [
      'Hay ghen và muốn kiểm soát, vì bạn đầu tư cảm xúc quá sâu nên sợ mất',
      'Khó tha thứ, dễ giữ trong lòng, do một khi bị phản bội thì vết hằn rất lâu phai',
      'Nên tập mở lòng và tin tưởng thay vì luôn phòng thủ, vì tường quá cao thì người thật lòng cũng không vào được',
    ],
    love: 'Bạn yêu sâu và hết mình, cần sự thật lòng và chiều sâu chứ không chịu nổi hời hợt. Khi đã trao lòng tin, bạn gắn bó mãnh liệt và đòi hỏi tương tự từ người kia. Vì đầu tư nhiều, bạn cực kỳ nhạy với dấu hiệu phản bội và khó tha thứ khi bị lừa dối. Người hợp với bạn minh bạch, chịu được chiều sâu cảm xúc của bạn và không chơi trò úp mở. Học buông bớt nhu cầu kiểm soát sẽ giúp tình yêu của bạn bớt ngột ngạt.',
    work: 'Bạn mạnh ở việc cần đào sâu và giữ kín: nghiên cứu, điều tra, tâm lý, tài chính, xoay chuyển khủng hoảng. Bạn bám mục tiêu tới cùng và nhìn ra điều người khác bỏ sót. Mặt cần để ý là bạn dễ biến bất đồng công việc thành chuyện cá nhân và ghi thù dai. Chọn nơi cho phép bạn tập trung sâu và tin bạn với thông tin nhạy cảm, đồng thời học tách cái tôi khỏi va chạm nghề nghiệp, bạn sẽ vừa hiệu quả vừa đỡ mệt.',
  },
  8: {
    english: 'Sagittarius',
    dateLabel: '22/11 – 21/12',
    rulingPlanet: 'Sao Mộc (♃)',
    tagline: 'Người lữ hành — đói tự do và ý nghĩa, luôn hướng về chân trời kế.',
    strengths: [
      'Lạc quan, nhìn về phía trước, vì bạn tin đâu đó luôn có cánh cửa khác mở ra',
      'Ham học hỏi và khám phá điều mới, do thế giới với bạn là một chỗ để đi và hiểu',
      'Chân thành, thẳng thắn, nói thật lòng thay vì lựa lời cho êm tai',
      'Tầm nhìn rộng, hướng tới ý nghĩa lớn, nhờ luôn hỏi "tất cả những cái này để làm gì"',
    ],
    growthEdges: [
      'Thiếu kiên nhẫn với chi tiết và thủ tục, vì bạn dồn hứng vào tầm nhìn lớn và thấy việc con con vướng chân',
      'Hứa nhiều, đôi khi ngại ràng buộc, khi tự do bị siết là bản năng đầu tiên muốn chạy',
      'Nói thẳng quá đôi khi vô ý làm người khác đau, vì bạn quên rằng sự thật cần cả cách nói',
    ],
    love: 'Bạn cần một người bạn đồng hành cùng phiêu lưu và tôn trọng tự do của nhau, hơn là một người muốn giữ bạn trong khuôn. Bạn yêu cởi mở, chân thành, đem lại tiếng cười và những trải nghiệm mới. Nhưng vì sợ gò bó, bạn dễ lảng khi quan hệ đòi cam kết và trách nhiệm hằng ngày. Người hợp với bạn cho bạn khoảng trời riêng mà vẫn có mặt khi cần. Học hiểu rằng gắn bó sâu không đồng nghĩa mất tự do là bước trưởng thành của bạn.',
    work: 'Bạn hợp việc liên quan du lịch, giáo dục, xuất bản, quốc tế, mở rộng thị trường, bất cứ chỗ nào cho bạn học cái mới và đi xa. Bạn truyền cảm hứng giỏi và thấy được hướng lớn khi người khác còn kẹt trong tiểu tiết. Điểm yếu là những việc lặp, đòi tuân thủ quy trình chặt và ngồi một chỗ lâu. Chọn vai trò có sự thay đổi và tầm nhìn, ghép với người lo phần chi tiết, sẽ giúp bạn đi đường dài mà không thấy tù túng.',
  },
  9: {
    english: 'Capricorn',
    dateLabel: '22/12 – 19/1',
    rulingPlanet: 'Sao Thổ (♄)',
    tagline: 'Người leo núi — nhắm đỉnh xa và leo từng bậc bằng kỷ luật.',
    strengths: [
      'Kỷ luật và trách nhiệm cao, vì bạn coi lời hứa và mục tiêu là chuyện nghiêm túc',
      'Kiên nhẫn xây mục tiêu dài hạn từng bước, do bạn chịu được phần thưởng đến muộn',
      'Thực tế, đáng tin, chịu khó, người ta biết giao việc cho bạn là yên tâm có kết quả',
      'Bền chí, không bỏ cuộc giữa chừng, vì với bạn dừng lại nửa đường là thất bại',
    ],
    growthEdges: [
      'Dễ quá nghiêm túc, ôm việc vào mình, vì tin rằng mình không làm thì không ai làm đủ chuẩn',
      'Đôi khi coi nhẹ cảm xúc và nghỉ ngơi, khi năng suất bị đặt lên trên cả sức khỏe',
      'Sợ thất bại nên ngại thử cái rủi ro, do hình ảnh vững chãi khiến bạn ngại mạo hiểm',
    ],
    love: 'Bạn thể hiện tình cảm qua cam kết và lo toan thực tế hơn là lời lãng mạn: xây dựng, chu cấp, có mặt bền bỉ. Bạn mở lòng chậm nhưng một khi đã chọn thì gắn bó lâu dài và nghiêm túc. Vì quen kìm nén, bạn dễ bị hiểu là lạnh hoặc khô khan, trong khi bên trong sâu sắc hơn nhiều. Người hợp với bạn kiên nhẫn với vẻ dè dặt của bạn và trân trọng sự đáng tin. Học để cảm xúc lộ ra sẽ giúp người kia chạm được vào bạn.',
    work: 'Bạn leo bậc thang sự nghiệp bài bản và mạnh ở quản lý, vận hành, tài chính, những việc cần uy tín dài lâu. Bạn lập kế hoạch xa, chịu được áp lực và kiên trì tới khi đạt mục tiêu. Mặt cần để ý là ôm việc quá nhiều, khó buông và dễ đánh đồng giá trị bản thân với thành tích. Học ủy quyền, cho phép mình nghỉ và chấp nhận vài rủi ro có tính toán, bạn sẽ đi xa mà không kiệt sức giữa đường.',
  },
  10: {
    english: 'Aquarius',
    dateLabel: '20/1 – 18/2',
    rulingPlanet: 'Sao Thổ (♄)',
    rulingPlanetModern: 'Sao Thiên Vương (♅)',
    tagline: 'Người khác biệt — nghĩ bằng lý trí, đứng hơi lệch khỏi đám đông.',
    strengths: [
      'Độc lập, có chính kiến riêng, vì bạn quen tự nghĩ thay vì chạy theo số đông',
      'Sáng tạo, tư duy cởi mở, đi trước thời đại, do bạn không bị trói bởi cách làm cũ',
      'Quan tâm cộng đồng và điều công bằng, hướng tới cái tốt cho nhiều người hơn là lợi riêng',
      'Khách quan, nhìn việc bằng lý trí, giữ được cái đầu tỉnh khi người khác cuốn theo cảm xúc',
    ],
    growthEdges: [
      'Đôi khi xa cách về mặt cảm xúc, vì bạn xử lý thế giới bằng lý trí trước khi bằng con tim',
      'Bướng theo cách riêng của mình, khi khác biệt trở thành cố chấp chỉ để không giống ai',
      'Nên tập để lý trí và sự gần gũi cùng tồn tại, vì hiểu một người không thay được cảm giác thân mật',
    ],
    love: 'Bạn cần là bạn tri kỷ trước khi là người yêu, trân trọng tự do và sự khác biệt của nhau. Bạn thu hút bằng đầu óc độc đáo và sự tôn trọng không gian riêng. Nhưng vì thiên về lý trí, bạn dễ bị thấy là xa cách hoặc khó gần về cảm xúc, và ngại những màn thân mật ướt át. Người hợp với bạn coi trọng tình bạn bên trong tình yêu và không đòi bạn phải giống người khác. Học ở gần mà không thấy mất tự do là bài của bạn.',
    work: 'Bạn hợp công nghệ, đổi mới, khoa học, hoạt động xã hội, những việc cần ý tưởng khác thường và tầm nhìn tương lai. Bạn nhìn ra hướng đi mới khi người khác còn bám cái cũ, và làm việc tốt trong nhóm hướng tới mục tiêu chung. Điểm cần để ý là bạn có thể phản đối chỉ để khác biệt, hoặc lơ là mặt cảm xúc của đồng đội. Chọn nơi trọng sáng tạo và cho bạn tự do làm theo cách riêng, bạn sẽ đóng góp được nhiều nhất.',
  },
  11: {
    english: 'Pisces',
    dateLabel: '19/2 – 20/3',
    rulingPlanet: 'Sao Mộc (♃)',
    rulingPlanetModern: 'Sao Hải Vương (♆)',
    tagline: 'Người mơ mộng — thấm cảm xúc quanh mình, ranh giới cái tôi mỏng.',
    strengths: [
      'Giàu trí tưởng tượng và chất nghệ sĩ, vì tâm hồn bạn sống nhiều trong thế giới bên trong',
      'Đồng cảm sâu, dễ thấu hiểu người khác, do bạn cảm được điều họ chưa nói ra',
      'Bao dung, vị tha, sẵn lòng tha thứ và nhìn ra chỗ tốt của người khác',
      'Trực giác mạnh, nhạy với điều tinh tế, bắt được những tín hiệu mà người khác bỏ qua',
    ],
    growthEdges: [
      'Dễ mơ mộng, đôi khi xa rời thực tế, vì thế giới trong đầu hấp dẫn hơn việc phải làm',
      'Hay nhập tâm cảm xúc của người khác, đến mức không phân được đâu là cảm xúc của mình',
      'Nên tập đặt ranh giới và đối mặt thay vì trốn tránh, vì né tránh chỉ dời cái khó sang mai',
    ],
    love: 'Bạn yêu lãng mạn và sẵn lòng hy sinh, dễ hòa vào người mình yêu tới mức quên cả nhu cầu của bản thân. Bạn cho đi dịu dàng và thấu cảm hiếm có. Nhưng vì ranh giới mỏng, bạn dễ lý tưởng hóa người kia, bỏ qua dấu hiệu xấu và ở lại trong quan hệ không lành chỉ vì thương. Người hợp với bạn nâng đỡ chứ không lợi dụng lòng tốt của bạn. Giữ được một ranh giới lành mạnh để không đánh mất mình là điều quan trọng nhất với bạn trong tình cảm.',
    work: 'Bạn tỏa sáng ở nghệ thuật, chữa lành, chăm sóc, những việc cần trực giác và lòng trắc ẩn. Bạn đưa được cái đẹp và sự tinh tế vào nơi mình làm, và an ủi người khác rất khéo. Điểm cần để ý là môi trường quá khô, quá cạnh tranh hay đầy deadline cứng dễ làm bạn ngợp và mất phương hướng. Chọn công việc có ý nghĩa với bạn và một chỗ dựa về cấu trúc, thời hạn, quy trình rõ, sẽ giúp tài năng của bạn có đất mà không bị cuốn trôi.',
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

  const seoTitle = `Cung ${z.name}: tính cách & hợp cung`;
  const seoDescription = `Cung ${z.name} — ${extra.english}, nguyên tố ${z.element}. Tính cách, điểm mạnh, cung hợp, xu hướng tình yêu & công việc. Tham khảo, không phán số mệnh.`;

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
