// hieu.asia — Dữ liệu trang chi tiết 16 nhóm MBTI (/learn/mbti/[type]).
//
// KHÔNG phải MBTI® có bản quyền: nội dung dựa trên KHUNG bốn lưỡng cực Jung
// (E/I · S/N · T/F · J/P) + chuỗi chức năng nhận thức (cognitive functions) —
// kiến thức miền công cộng. Mô tả là XU HƯỚNG trên một phổ, không phải nhãn cố
// định hay lời phán. Tên gọi tiếng Việt là mô tả chung (không dùng nhãn thương
// hiệu của bên thứ ba). Chuỗi chức năng theo trật tự Trội–Phụ trợ–Cấp ba–Ẩn
// (Myers/Grant) — đã rà kỹ từng nhóm.

export const MBTI_SLUGS = [
  'intj', 'intp', 'entj', 'entp',
  'infj', 'infp', 'enfj', 'enfp',
  'istj', 'isfj', 'estj', 'esfj',
  'istp', 'isfp', 'estp', 'esfp',
] as const;

export type MbtiGroupKey = 'NT' | 'NF' | 'SJ' | 'SP';

export interface MbtiGroupMeta {
  name: string; // tiếng Việt
  en: string; // tên nhóm phổ biến
  theme: string;
}

export const MBTI_GROUPS: Record<MbtiGroupKey, MbtiGroupMeta> = {
  NT: { name: 'Nhà Phân Tích', en: 'Analysts', theme: 'Tư duy hệ thống, chiến lược, ham hiểu nguyên lý.' },
  NF: { name: 'Nhà Ngoại Giao', en: 'Diplomats', theme: 'Lý tưởng, đồng cảm, hướng tới ý nghĩa và con người.' },
  SJ: { name: 'Người Gìn Giữ', en: 'Sentinels', theme: 'Trật tự, trách nhiệm, đáng tin và thực tế.' },
  SP: { name: 'Nhà Khám Phá', en: 'Explorers', theme: 'Linh hoạt, thực tế, nhạy với hiện tại và hành động.' },
};

// Tám chức năng nhận thức + diễn giải ngắn (tiếng Việt).
export const FUNCTION_GLOSS: Record<string, string> = {
  Ni: 'Trực giác hướng nội — nhìn ra mẫu hình ngầm và viễn cảnh dài hạn',
  Ne: 'Trực giác hướng ngoại — bật ra nhiều khả năng, liên kết ý tưởng',
  Si: 'Cảm nhận hướng nội — ghi nhớ chi tiết, kinh nghiệm và sự ổn định',
  Se: 'Cảm nhận hướng ngoại — nhạy với hiện tại, phản ứng và hành động tức thì',
  Ti: 'Tư duy hướng nội — phân tích logic, đi tìm sự mạch lạc bên trong',
  Te: 'Tư duy hướng ngoại — tổ chức, đo lường, ra quyết định hiệu quả ngoài thực tế',
  Fi: 'Cảm xúc hướng nội — la bàn giá trị cá nhân, sống thật với chính mình',
  Fe: 'Cảm xúc hướng ngoại — đọc và hài hoà cảm xúc của tập thể',
};

export const FUNCTION_ROLES = ['Trội', 'Phụ trợ', 'Cấp ba', 'Ẩn (kém)'] as const;

interface MbtiTypeRaw {
  nick: string;
  group: MbtiGroupKey;
  tagline: string;
  letters: string; // ý nghĩa 4 chữ cái cho nhóm này
  overview: string;
  stack: [string, string, string, string]; // Trội → Ẩn
  strengths: string[];
  growth: string[];
  workStyle: string;
  relationships: string;
  atBest: string; // khi phát triển lành mạnh (dominant + phụ trợ ăn khớp)
  underStress: string; // dưới áp lực, gắn với chức năng kém (Ẩn)
  commonConfusions: string; // hay nhầm với nhóm nào + mẹo phân biệt
  growthPath: string; // hướng phát triển gắn chức năng phụ trợ / cấp ba
}

const TYPES: Record<string, MbtiTypeRaw> = {
  INTJ: {
    nick: 'Nhà Chiến Lược',
    group: 'NT',
    tagline: 'Tầm nhìn dài hạn, độc lập và đầy tính chiến lược.',
    letters: 'Hướng nội (I) · Trực giác (N) · Lý trí (T) · Nguyên tắc (J)',
    overview:
      'INTJ nhìn xa, thích xây hệ thống và biến ý tưởng trừu tượng thành kế hoạch khả thi. Họ độc lập, coi trọng năng lực và thường tự đặt tiêu chuẩn cao cho bản thân lẫn công việc. Chuỗi Ni–Te lý giải nét đặc trưng: trực giác hướng nội gom mọi dữ kiện thành một viễn cảnh dài hạn duy nhất, rồi tư duy hướng ngoại bày viễn cảnh đó thành kế hoạch và tiêu chuẩn đo được. Vì vậy INTJ thường đã thấy đích trước khi người khác kịp bàn đường đi, và ít kiên nhẫn với việc lặp lại điều đã rõ trong đầu họ.',
    stack: ['Ni', 'Te', 'Fi', 'Se'],
    strengths: ['Tư duy chiến lược, nhìn ra bức tranh dài hạn', 'Độc lập, quyết đoán, tự định hướng', 'Kiên định theo đuổi mục tiêu đã chọn'],
    growth: ['Mở lòng với cảm xúc — của mình và của người khác', 'Chấp nhận không phải việc gì cũng cần tối ưu', 'Kiên nhẫn hơn với người làm theo nhịp khác'],
    workStyle:
      'Toả sáng ở vai trò cần hoạch định, hệ thống và tầm nhìn — chiến lược, thiết kế giải pháp, nghiên cứu, quản lý dự án dài hạn. Hợp môi trường tự chủ, ít bị quản lý vi mô.',
    relationships:
      'Gắn bó sâu với số ít người thân thiết; thể hiện quan tâm qua hành động và giải pháp hơn lời nói. Điều nên luyện là bày tỏ cảm xúc rõ ràng hơn.',
    atBest:
      'Khi phát triển lành mạnh, INTJ giữ được tầm nhìn Ni nhưng để Te phục vụ mục tiêu chung thay vì kiểm soát tiểu tiết. Họ tin tưởng giao việc, giải thích lý do đằng sau tiêu chuẩn và biết dừng tối ưu đúng lúc — một người dẫn đường điềm tĩnh, nhìn xa mà không lạnh lùng.',
    underStress:
      'Dưới áp lực kéo dài, chức năng kém Se trồi lên vụng về. INTJ có thể mất kết nối với hiện tại, buông mình vào ăn uống, mua sắm hay chi tiết cảm giác để giải toả, hoặc quay ra soi lỗi vặt quanh mình. Dấu hiệu quen thuộc là bồn chồn, khó ngồi yên và cáu vì những thứ nhỏ.',
    commonConfusions:
      'Hay bị nhầm với INTP. Cả hai đều kín và ưa tư duy trừu tượng, nhưng INTJ dẫn bằng Ni–Te nên muốn chốt kế hoạch và đóng vấn đề lại; INTP dẫn bằng Ti–Ne nên thích để ngỏ, mổ xẻ mãi cho tới khi mạch lạc. Mẹo phân biệt: đặt trước họ một quyết định — INTJ tìm kết luận, INTP tìm thêm giả thuyết.',
    growthPath:
      'Điểm tựa trưởng thành nằm ở việc dùng Te (phụ trợ) để hiện thực hoá thay vì áp đặt, và tập lắng nghe Fi (cấp ba) — la bàn giá trị riêng. Khi biết hỏi thêm một câu, việc này có hợp với điều mình thật sự trân trọng không, quyết định của INTJ bớt khô cứng và bền hơn.',
  },
  INTP: {
    nick: 'Nhà Tư Tưởng',
    group: 'NT',
    tagline: 'Ham phân tích, tò mò và yêu sự mạch lạc của logic.',
    letters: 'Hướng nội (I) · Trực giác (N) · Lý trí (T) · Linh hoạt (P)',
    overview:
      'INTP say mê tìm hiểu nguyên lý vận hành của mọi thứ, xây những mô hình tư duy chặt chẽ trong đầu. Họ khách quan, độc lập và thường đặt câu hỏi "tại sao" trước khi chấp nhận điều gì. Chuỗi Ti–Ne tạo nên phong cách riêng: tư duy hướng nội đòi mọi thứ phải mạch lạc từ bên trong, còn trực giác hướng ngoại liên tục bật ra khả năng và phản ví dụ. Vì thế INTP hiếm khi chịu một câu trả lời gọn ghẽ; họ thấy ngay ngoại lệ và muốn tinh chỉnh mô hình cho tới lúc nó thật sự khớp.',
    stack: ['Ti', 'Ne', 'Si', 'Fe'],
    strengths: ['Phân tích sắc bén, tư duy logic chặt chẽ', 'Tò mò trí tuệ, cởi mở với ý tưởng mới', 'Khách quan, nhìn vấn đề đa chiều'],
    growth: ['Biến ý tưởng thành hành động thay vì mãi lý thuyết', 'Quan tâm tới cảm xúc trong tương tác hằng ngày', 'Chốt quyết định thay vì phân tích vô tận'],
    workStyle:
      'Sâu sắc ở công việc cần phân tích, mô hình hoá và sáng tạo giải pháp — nghiên cứu, lập trình, khoa học dữ liệu, kỹ thuật, học thuật. Hợp không gian linh hoạt, được tự do khám phá.',
    relationships:
      'Trung thành, tôn trọng tự do của đôi bên; kết nối qua đối thoại trí tuệ. Điều nên luyện là chú ý và đáp lại nhu cầu cảm xúc của người thân.',
    atBest:
      'Khi ở phong độ tốt, INTP để Ne (phụ trợ) đưa mô hình trong đầu ra thế giới thật: họ dựng nguyên mẫu, viết ra, thử nghiệm thay vì chỉ nghĩ. Sự chặt chẽ của Ti khi đó biến thành lời giải sáng rõ mà người khác dùng được, không còn là mê cung riêng của họ.',
    underStress:
      'Dưới áp lực, chức năng kém Fe bung ra khó kiểm soát. INTP vốn điềm tĩnh có thể bỗng nhạy cảm quá mức chuyện được coi trọng hay không, giận dỗi vì cảm giác bị phớt lờ, hoặc vụng về bộc phát cảm xúc rồi tự trách. Càng căng, họ càng rút vào phân tích để né cảm giác ngổn ngang.',
    commonConfusions:
      'Hay bị nhầm với INTJ và ISTP. So với INTJ: INTP để ngỏ và ưa giả thuyết, INTJ muốn chốt và thực thi. So với ISTP (cũng Ti trội): ISTP hướng ra hành động cụ thể qua Se, còn INTP mải theo ý tưởng và khả năng qua Ne. Mẹo: xem họ hào hứng với bản vẽ trong đầu hay với việc bắt tay làm ngay.',
    growthPath:
      'Hướng phát triển là để Ne (phụ trợ) đẩy ý tưởng thành việc làm được, và chăm bón Si (cấp ba) để giữ nếp sinh hoạt, hoàn tất điều đã bắt đầu. Một bước nhỏ nhưng khó với INTP: chọn một mô hình đủ tốt và thực thi, thay vì cải tiến vô tận trong đầu.',
  },
  ENTJ: {
    nick: 'Nhà Chỉ Huy',
    group: 'NT',
    tagline: 'Quyết đoán, có tổ chức và sinh ra để dẫn dắt.',
    letters: 'Hướng ngoại (E) · Trực giác (N) · Lý trí (T) · Nguyên tắc (J)',
    overview:
      'ENTJ nhìn ra mục tiêu rồi tổ chức người và nguồn lực để đạt được. Họ tự tin, thẳng thắn, giỏi hoạch định dài hạn và thúc đẩy mọi thứ tiến về phía trước. Chuỗi Te–Ni là cỗ máy của họ: tư duy hướng ngoại dựng cấu trúc, thời hạn và cách đo hiệu quả, còn trực giác hướng nội cho thấy nước đi vài bước sau. Ghép lại, ENTJ vừa vạch chiến lược vừa bắt tay điều phối ngay, và thường sốt ruột khi thấy nguồn lực bị lãng phí.',
    stack: ['Te', 'Ni', 'Se', 'Fi'],
    strengths: ['Lãnh đạo tự nhiên, quyết đoán', 'Tư duy chiến lược kết hợp khả năng tổ chức', 'Tự tin, hiệu quả, hướng kết quả'],
    growth: ['Lắng nghe và ghi nhận cảm xúc đội ngũ', 'Chậm lại để cân nhắc ý kiến khác trước khi chốt', 'Cho phép bản thân nghỉ ngơi, không chỉ làm việc'],
    workStyle:
      'Mạnh ở vai trò lãnh đạo, vận hành và chiến lược — quản lý, khởi nghiệp, tư vấn, điều hành. Hợp môi trường có mục tiêu rõ, quyền quyết định và thử thách lớn.',
    relationships:
      'Tận tâm và muốn cùng người thân phát triển; dễ vô tình quá thẳng. Điều nên luyện là mềm mỏng hơn và để người khác dẫn dắt đôi lúc.',
    atBest:
      'Khi phát triển lành mạnh, ENTJ dùng Ni (phụ trợ) để chọn đúng trận thay vì thắng mọi trận, và mở đường cho người khác toả sáng chứ không chỉ ra lệnh. Sự quyết đoán khi đó đi kèm lắng nghe: họ dựng ra một đội mạnh và một hướng đi rõ mà mọi người thật lòng muốn theo.',
    underStress:
      'Dưới áp lực, chức năng kém Fi trồi lên đột ngột. ENTJ vốn lý trí có thể ứ nghẹn cảm xúc không gọi tên được, bùng lên vì thấy giá trị bị chà đạp, hoặc âm thầm nghi ngờ liệu mình có được ai thật sự quan tâm. Càng mệt, họ càng đẩy mạnh việc để khỏi phải chạm vào phần dễ tổn thương đó.',
    commonConfusions:
      'Hay bị nhầm với ESTJ. Cả hai đều dẫn bằng Te nên đều tổ chức giỏi và dứt khoát, nhưng ENTJ theo sau bằng Ni nên hướng về chiến lược, tương lai và ý tưởng trừu tượng; ESTJ theo sau bằng Si nên bám quy trình đã được kiểm chứng và hiện tại cụ thể. Mẹo: hỏi họ thích tái phát minh hay chuẩn hoá cái đang chạy.',
    growthPath:
      'Hướng phát triển là để Ni (phụ trợ) làm chậm phản xạ chốt-liền của Te, dành chỗ cho tầm nhìn và cho ý kiến khác. Bồi thêm Se (cấp ba) để tận hưởng hiện tại, nghỉ ngơi thật sự. Khi đó ENTJ dẫn dắt bằng ảnh hưởng nhiều hơn bằng áp lực.',
  },
  ENTP: {
    nick: 'Người Tranh Biện',
    group: 'NT',
    tagline: 'Nhanh trí, thích ý tưởng mới và mê tranh luận.',
    letters: 'Hướng ngoại (E) · Trực giác (N) · Lý trí (T) · Linh hoạt (P)',
    overview:
      'ENTP bật ra ý tưởng liên tục, thích thử thách giả định và nhìn vấn đề từ nhiều góc. Họ linh hoạt, hoạt ngôn và hào hứng với khả năng mới hơn là quy trình cố định. Chuỗi Ne–Ti giải thích vì sao họ mê tranh biện: trực giác hướng ngoại tung ra hàng loạt liên tưởng, còn tư duy hướng nội đứng sau kiểm tra tính nhất quán. ENTP thử ý tưởng bằng cách phản biện nó, nên nhiều khi cãi để hiểu chứ không phải để thắng — điều dễ khiến người đối diện hiểu lầm.',
    stack: ['Ne', 'Ti', 'Fe', 'Si'],
    strengths: ['Sáng tạo, nhiều ý tưởng và giải pháp', 'Linh hoạt, ứng biến nhanh', 'Hùng biện, dám thách thức lối mòn'],
    growth: ['Đi tới cùng thay vì bỏ dở khi hết hứng', 'Để ý tranh luận có làm tổn thương người khác không', 'Xây kỷ luật cho các việc đều đặn, ít hấp dẫn'],
    workStyle:
      'Bùng nổ ở môi trường đổi mới, nhiều ý tưởng — khởi nghiệp, marketing, sáng tạo sản phẩm, tư vấn. Hợp công việc đa dạng, ít lặp lại và được tự do thử nghiệm.',
    relationships:
      'Vui, kích thích trí tuệ, mang năng lượng mới cho mối quan hệ. Điều nên luyện là sự ổn định và lắng nghe cảm xúc thay vì biến mọi thứ thành cuộc tranh luận.',
    atBest:
      'Khi ở phong độ tốt, ENTP để Ti (phụ trợ) chọn lọc và theo đuổi một trong vô số ý tưởng tới nơi tới chốn. Họ vẫn tinh nghịch, nhiều liên tưởng, nhưng biết đặt sức sáng tạo vào một việc đủ lâu để nó ra thành quả — chứ không bỏ dở ngay khi tia hào hứng đầu tiên tắt.',
    underStress:
      'Dưới áp lực, chức năng kém Si trồi lên. ENTP vốn phóng khoáng có thể mắc kẹt trong lo lắng về chi tiết cỏn con, phóng đại một triệu chứng cơ thể, hoặc thấy ngột ngạt vì thói quen và ràng buộc. Càng căng, họ càng bồn chồn muốn thoát ra bằng một ý tưởng mới thay vì đối diện việc dở dang.',
    commonConfusions:
      'Hay bị nhầm với ENFP. Cả hai đều dẫn bằng Ne nên đều nhiều ý tưởng, hoạt ngôn và ghét gò bó, nhưng ENTP quyết bằng Ti (logic, tính nhất quán) còn ENFP quyết bằng Fi (giá trị, con người). Mẹo: khi bất đồng, ENTP hỏi điều này có hợp lý không, ENFP hỏi điều này có đúng với giá trị mình không.',
    growthPath:
      'Hướng phát triển là để Ti (phụ trợ) neo lại dòng ý tưởng của Ne, chọn một hướng và cam kết. Chăm thêm Fe (cấp ba) để đọc xem lời tranh biện của mình có làm tổn thương ai không. Kỷ luật với vài việc đều đặn, nhàm chán chính là bài tập khó mà đáng giá nhất với ENTP.',
  },
  INFJ: {
    nick: 'Người Cố Vấn',
    group: 'NF',
    tagline: 'Sâu sắc, lý tưởng và thấu cảm khác thường.',
    letters: 'Hướng nội (I) · Trực giác (N) · Cảm xúc (F) · Nguyên tắc (J)',
    overview:
      'INFJ kết hợp trực giác về con người với khát khao tạo ra ý nghĩa. Họ kín đáo nhưng giàu niềm tin nội tâm, nhìn ra động cơ ẩn của người khác và hướng tới điều tốt đẹp lâu dài. Chuỗi Ni–Fe làm nên chất riêng: trực giác hướng nội cho họ một hình dung sâu về nơi mọi thứ đang hướng tới, còn cảm xúc hướng ngoại khiến họ chăm chút sự hài hoà của người xung quanh. Vì vậy INFJ thường hình dung được hướng đi dài hạn, đồng thời cảm nhận rất rõ tâm trạng từng người trong phòng.',
    stack: ['Ni', 'Fe', 'Ti', 'Se'],
    strengths: ['Thấu cảm sâu, hiểu động cơ của người khác', 'Kiên định với giá trị và lý tưởng', 'Sáng tạo, nhìn ra ý nghĩa và viễn cảnh'],
    growth: ['Đặt ranh giới, tránh ôm hết cảm xúc người khác', 'Chấp nhận sự không hoàn hảo của thực tế', 'Chia sẻ nhu cầu của mình thay vì âm thầm chịu đựng'],
    workStyle:
      'Phát huy ở công việc giúp người và mang ý nghĩa — tư vấn, trị liệu, giáo dục, viết lách, lĩnh vực phi lợi nhuận. Hợp môi trường yên tĩnh, giá trị rõ ràng và được làm việc chiều sâu.',
    relationships:
      'Tận tụy, tìm kết nối chân thật và sâu sắc; dễ kiệt sức vì cho đi quá nhiều. Điều nên luyện là nói thẳng nhu cầu và giữ năng lượng cho chính mình.',
    atBest:
      'Khi phát triển lành mạnh, INFJ để Fe (phụ trợ) đưa tầm nhìn Ni ra thành lời và hành động cụ thể giúp được người khác. Họ giữ ranh giới đủ tốt để không kiệt sức, nói thẳng điều mình tin mà vẫn ấm áp — một người vừa sâu sắc vừa vững, chứ không chỉ lặng lẽ gánh cảm xúc thiên hạ.',
    underStress:
      'Dưới áp lực, chức năng kém Se bung ra thô vụng. INFJ vốn tiết chế có thể lao vào ăn uống, mua sắm hay xem hết tập này tới tập khác để tê liệt cảm giác, hoặc bỗng chú ý ám ảnh vào chi tiết vật chất quanh mình. Đó là dấu hiệu họ đã cho đi quá nhiều và cần rút về nạp lại.',
    commonConfusions:
      'Hay bị nhầm với INFP. Cả hai đều là người hướng nội lý tưởng, nhưng INFJ dẫn bằng Ni–Fe nên hướng ra hài hoà tập thể và một viễn cảnh tập trung; INFP dẫn bằng Fi–Ne nên bám giá trị cá nhân và bung nhiều khả năng. Mẹo: INFJ hay lo cầu nối giữa mọi người, INFP hay giữ cho mình được sống thật với chính mình.',
    growthPath:
      'Hướng phát triển là để Fe (phụ trợ) biến trực giác thành đóng góp thấy được, đồng thời tập Ti (cấp ba) để tư duy độc lập, bớt cuốn theo cảm xúc người khác. Bài tập khó nhất: nói ra nhu cầu của mình sớm, thay vì âm thầm chịu đựng tới lúc bùng.',
  },
  INFP: {
    nick: 'Người Lý Tưởng',
    group: 'NF',
    tagline: 'Giàu giá trị nội tâm, chân thật và đầy lòng trắc ẩn.',
    letters: 'Hướng nội (I) · Trực giác (N) · Cảm xúc (F) · Linh hoạt (P)',
    overview:
      'INFP sống theo la bàn giá trị bên trong và khao khát được là chính mình. Họ giàu trí tưởng tượng, đồng cảm, luôn đi tìm ý nghĩa và muốn thế giới tốt đẹp, nhân văn hơn. Chuỗi Fi–Ne là nguồn sức của họ: cảm xúc hướng nội giữ một hệ giá trị sâu và riêng, còn trực giác hướng ngoại mở ra vô số khả năng và cách nhìn. Vì thế INFP có thể rất mềm mỏng bên ngoài nhưng cực kỳ kiên định bên trong khi chạm tới điều họ thật sự tin.',
    stack: ['Fi', 'Ne', 'Si', 'Te'],
    strengths: ['Trung thành với giá trị, chính trực', 'Đồng cảm và bao dung với người khác', 'Sáng tạo, giàu trí tưởng tượng'],
    growth: ['Biến lý tưởng thành bước hành động cụ thể', 'Bớt khắt khe và tự phê phán bản thân', 'Đối diện mâu thuẫn thay vì né tránh'],
    workStyle:
      'Toả sáng ở công việc sáng tạo và mang ý nghĩa — viết lách, nghệ thuật, tư vấn, giáo dục, công tác xã hội. Hợp môi trường tôn trọng giá trị cá nhân, ít cạnh tranh ngột ngạt.',
    relationships:
      'Sâu sắc, tận tâm và trân trọng sự chân thật; dễ tổn thương khi giá trị bị xúc phạm. Điều nên luyện là trao đổi thẳng thắn thay vì giữ trong lòng.',
    atBest:
      'Khi ở phong độ tốt, INFP để Ne (phụ trợ) biến giá trị thành dự án, câu chuyện, việc làm chạm được người khác. Họ bớt tự trách, chấp nhận bản nháp chưa hoàn hảo và cứ làm. Lý tưởng khi đó không còn nằm trong đầu mà thành đóng góp thật, nhẹ nhàng mà bền bỉ.',
    underStress:
      'Dưới áp lực, chức năng kém Te bung ra vụng về. INFP vốn ôn hoà có thể bỗng gay gắt phê phán năng lực của mình và người khác, lập danh sách việc dày đặc rồi thấy ngợp, hoặc buột ra những lời phán xét lạnh lùng khác hẳn thường ngày. Đó là dấu hiệu họ đang quá tải và cần lùi lại.',
    commonConfusions:
      'Hay bị nhầm với INFJ và ISFP. So với INFJ: INFP dẫn bằng Fi nên đặt giá trị cá nhân lên trước, INFJ dẫn bằng Ni–Fe nên hướng ra hài hoà tập thể. So với ISFP (cũng Fi trội): ISFP neo vào Se, sống với giác quan và hiện tại; INFP neo vào Ne, sống với ý tưởng và khả năng. Mẹo: hỏi họ nạp năng lượng bằng trải nghiệm hay bằng tưởng tượng.',
    growthPath:
      'Hướng phát triển là để Ne (phụ trợ) mở giá trị ra thành hành động thử nghiệm, và tập Si (cấp ba) để giữ nếp, đi tới cùng một việc. Về lâu dài, làm quen với Te — chia mục tiêu thành bước cụ thể — giúp INFP đưa lý tưởng ra đời thực mà không tự đè bẹp mình.',
  },
  ENFJ: {
    nick: 'Người Truyền Cảm Hứng',
    group: 'NF',
    tagline: 'Ấm áp, lôi cuốn và sinh ra để nâng đỡ người khác.',
    letters: 'Hướng ngoại (E) · Trực giác (N) · Cảm xúc (F) · Nguyên tắc (J)',
    overview:
      'ENFJ nhạy với nhu cầu của người xung quanh và giỏi truyền động lực để mọi người cùng tiến bộ. Họ ấm áp, có sức ảnh hưởng, hướng tập thể tới mục tiêu chung đầy ý nghĩa. Chuỗi Fe–Ni tạo nên sức lôi cuốn: cảm xúc hướng ngoại bắt sóng tâm trạng và nhu cầu của cả nhóm, còn trực giác hướng nội cho họ hình dung về nơi nhóm có thể đi tới. Ghép lại, ENFJ vừa đọc được lòng người vừa vẽ ra một tầm nhìn khiến người ta muốn cùng bước tới.',
    stack: ['Fe', 'Ni', 'Se', 'Ti'],
    strengths: ['Truyền cảm hứng, dẫn dắt bằng sự đồng cảm', 'Đọc cảm xúc tập thể tinh tế', 'Tận tâm giúp người khác phát triển'],
    growth: ['Chăm sóc nhu cầu của chính mình, tránh kiệt sức', 'Chấp nhận không thể làm hài lòng tất cả', 'Đón nhận góp ý mà không thấy bị chối bỏ'],
    workStyle:
      'Mạnh ở vai trò dẫn dắt con người — giáo dục, đào tạo, nhân sự, truyền thông, lãnh đạo cộng đồng. Hợp môi trường hợp tác, có sứ mệnh rõ và được tạo tác động lên người khác.',
    relationships:
      'Quan tâm sâu, luôn vun đắp cho người thân; dễ quên bản thân vì lo cho người khác. Điều nên luyện là cân bằng cho–nhận và đặt ranh giới lành mạnh.',
    atBest:
      'Khi phát triển lành mạnh, ENFJ để Ni (phụ trợ) neo sự tận tâm vào một mục tiêu rõ, thay vì dàn mỏng để làm hài lòng tất cả. Họ nâng người khác lên mà vẫn giữ được mình, biết nói không và nhận góp ý mà không thấy bị chối bỏ — một người dẫn dắt truyền cảm hứng nhưng không đánh mất bản thân.',
    underStress:
      'Dưới áp lực, chức năng kém Ti trồi lên lệch nhịp. ENFJ vốn ấm áp có thể rút vào phân tích lạnh lùng, xoáy vào một lỗi logic nhỏ, hoặc bỗng hoài nghi và xa cách khác hẳn thường ngày. Đó thường là dấu hiệu họ đã lo cho người khác quá nhiều mà quên chính mình.',
    commonConfusions:
      'Hay bị nhầm với ENFP. Cả hai đều là người NF hướng ngoại nồng ấm, nhưng ENFJ dẫn bằng Fe (hài hoà tập thể) và theo sau bằng Ni (một tầm nhìn tập trung); ENFP dẫn bằng Ne (nhiều ý tưởng) neo trên Fi (giá trị riêng). Mẹo: ENFJ chú ý cả nhóm đang cảm thấy gì, ENFP hào hứng với khả năng và ghét bị bó buộc.',
    growthPath:
      'Hướng phát triển là để Ni (phụ trợ) giúp chọn nơi đặt sự quan tâm, và tập Se (cấp ba) để sống với hiện tại, nghỉ ngơi thật. Bài học lớn: chăm nhu cầu của chính mình không phải là ích kỷ mà là điều kiện để tiếp tục nâng đỡ người khác lâu dài.',
  },
  ENFP: {
    nick: 'Nhà Vận Động',
    group: 'NF',
    tagline: 'Nhiệt huyết, giàu cảm hứng và yêu con người.',
    letters: 'Hướng ngoại (E) · Trực giác (N) · Cảm xúc (F) · Linh hoạt (P)',
    overview:
      'ENFP tràn năng lượng, nhìn thấy tiềm năng ở mọi người và mọi ý tưởng. Họ nồng nhiệt, sáng tạo, ghét sự gò bó và luôn tìm kiếm trải nghiệm cùng ý nghĩa mới. Chuỗi Ne–Fi giải thích nét đặc trưng: trực giác hướng ngoại bung ra khả năng khắp nơi, còn cảm xúc hướng nội lọc xem điều nào thật sự hợp với giá trị của họ. Vì vậy ENFP hào hứng với muôn vàn hướng đi, nhưng chỉ dốc lòng cho những gì chạm tới điều họ tin là ý nghĩa.',
    stack: ['Ne', 'Fi', 'Te', 'Si'],
    strengths: ['Nhiệt huyết, lan toả cảm hứng', 'Sáng tạo, nhìn ra khả năng và tiềm năng', 'Ấm áp, dễ kết nối với nhiều kiểu người'],
    growth: ['Theo đuổi đến cùng thay vì nhảy việc liên tục', 'Xây thói quen và kỷ luật cho việc đều đặn', 'Đối diện chi tiết thực tế thay vì né tránh'],
    workStyle:
      'Bùng nổ ở công việc sáng tạo, nhiều người và ý tưởng — truyền thông, marketing, sự kiện, khởi nghiệp, giáo dục. Hợp môi trường linh hoạt, đa dạng và giàu ý nghĩa.',
    relationships:
      'Nồng nhiệt, chân thành, mang niềm vui cho mối quan hệ; dễ chán khi thiếu mới mẻ. Điều nên luyện là sự bền bỉ và chú ý tới nhu cầu dài hạn của đôi bên.',
    atBest:
      'Khi ở phong độ tốt, ENFP để Fi (phụ trợ) chọn lấy một, hai hướng đáng giá trong biển ý tưởng của Ne rồi theo tới cùng. Họ vẫn lan toả cảm hứng và kết nối được nhiều kiểu người, nhưng có đủ chiều sâu và bền bỉ để biến nhiệt huyết thành thành quả thật, không chỉ là những khởi đầu dang dở.',
    underStress:
      'Dưới áp lực, chức năng kém Si trồi lên. ENFP vốn phóng khoáng có thể sa vào lo lắng chi tiết, phóng đại một dấu hiệu cơ thể, hoặc thấy nghẹt thở vì thói quen và ràng buộc. Càng căng, họ càng muốn nhảy sang trải nghiệm mới để trốn cảm giác mắc kẹt thay vì hoàn tất việc đang dở.',
    commonConfusions:
      'Hay bị nhầm với ESFP và ENTP. So với ESFP: ENFP dẫn bằng Ne nên sống với ý tưởng và khả năng, ESFP dẫn bằng Se nên sống với giác quan và hiện tại. So với ENTP (cũng Ne trội): ENTP quyết bằng Ti (logic), ENFP quyết bằng Fi (giá trị). Mẹo: xem họ bị cuốn bởi khả năng tương lai hay bởi khoảnh khắc trước mắt.',
    growthPath:
      'Hướng phát triển là để Fi (phụ trợ) neo dòng ý tưởng vào điều mình thật sự trân trọng, chọn và ở lại. Tập thêm Te (cấp ba) để chia mục tiêu thành bước, dựng chút kỷ luật cho việc đều đặn. Với ENFP, đi hết một con đường thường quý hơn mở thêm mười con đường mới.',
  },
  ISTJ: {
    nick: 'Người Trách Nhiệm',
    group: 'SJ',
    tagline: 'Đáng tin, thực tế và làm việc theo nguyên tắc.',
    letters: 'Hướng nội (I) · Cảm nhận (S) · Lý trí (T) · Nguyên tắc (J)',
    overview:
      'ISTJ coi trọng trách nhiệm, sự thật và truyền thống. Họ tỉ mỉ, có hệ thống, giữ lời và làm tới nơi tới chốn — chỗ dựa vững chắc cho gia đình lẫn tổ chức. Chuỗi Si–Te lý giải sự đáng tin của họ: cảm nhận hướng nội lưu giữ kinh nghiệm, chi tiết và cách làm đã được kiểm chứng, còn tư duy hướng ngoại tổ chức chúng thành quy trình hiệu quả. Vì vậy ISTJ tin vào cái đã chạy tốt hơn là cái nghe hay, và thường là người đảm bảo mọi thứ vận hành đúng như đã hứa.',
    stack: ['Si', 'Te', 'Fi', 'Ne'],
    strengths: ['Đáng tin, có trách nhiệm và kỷ luật', 'Tỉ mỉ, chính xác với chi tiết', 'Thực tế, bình tĩnh xử lý công việc'],
    growth: ['Cởi mở hơn với cách làm và ý tưởng mới', 'Bày tỏ cảm xúc thay vì giữ kín', 'Linh hoạt khi kế hoạch buộc phải thay đổi'],
    workStyle:
      'Vững vàng ở công việc cần chính xác, quy trình và độ tin cậy — kế toán, kiểm toán, vận hành, hành chính, kỹ thuật, pháp lý. Hợp môi trường rõ vai trò, ổn định.',
    relationships:
      'Chung thuỷ, tận tâm và giữ cam kết; thể hiện tình cảm qua hành động chăm lo cụ thể. Điều nên luyện là nói lời yêu thương và cởi mở với điều mới.',
    atBest:
      'Khi phát triển lành mạnh, ISTJ giữ được sự chắc chắn của Si nhưng để Te mở ra với cách làm mới khi có bằng chứng nó tốt hơn. Họ vững vàng mà không cứng nhắc, giữ lời và gánh vác, đồng thời học được cách nói ra sự quan tâm thay vì chỉ lặng lẽ lo toan cho người thân.',
    underStress:
      'Dưới áp lực, chức năng kém Ne trồi lên tối màu. ISTJ vốn điềm tĩnh có thể bị cuốn vào tưởng tượng về những viễn cảnh xấu nhất, thấy mọi khả năng đều chực đổ vỡ, hoặc bồn chồn vì cảm giác mất kiểm soát. Đó là dấu hiệu họ cần lùi lại, về với việc quen thuộc và nghỉ ngơi.',
    commonConfusions:
      'Hay bị nhầm với ISFJ. Cả hai đều dẫn bằng Si nên đều đáng tin, tỉ mỉ và trọng truyền thống, nhưng ISTJ theo sau bằng Te nên nghiêng về nhiệm vụ, logic và quy trình; ISFJ theo sau bằng Fe nên nghiêng về con người, chăm sóc và hài hoà. Mẹo: khi có việc, ISTJ hỏi quy trình đúng là gì, ISFJ hỏi ai cần được giúp.',
    growthPath:
      'Hướng phát triển là để Te (phụ trợ) đón cách làm mới có bằng chứng, thay vì mặc định bám cái cũ. Chăm thêm Fi (cấp ba) để nhận ra và nói ra cảm xúc của mình. Một bài tập nhỏ mà lớn: thử một cách khác trước khi kết luận cách cũ vẫn tốt nhất.',
  },
  ISFJ: {
    nick: 'Người Bảo Vệ',
    group: 'SJ',
    tagline: 'Tận tụy, chu đáo và âm thầm chăm lo cho người khác.',
    letters: 'Hướng nội (I) · Cảm nhận (S) · Cảm xúc (F) · Nguyên tắc (J)',
    overview:
      'ISFJ kết hợp sự chu đáo với tinh thần trách nhiệm. Họ nhớ những điều nhỏ nhặt, lặng lẽ lo cho người thân và giữ cho mọi thứ ấm áp, ổn định. Chuỗi Si–Fe làm nên sự tận tuỵ ấy: cảm nhận hướng nội ghi nhớ chi tiết, thói quen và điều từng khiến người thân vui, còn cảm xúc hướng ngoại thôi thúc họ chăm cho không khí quanh mình êm ấm. Vì thế ISFJ thường là người âm thầm nhớ ngày quan trọng của bạn và lo trước những thứ bạn chưa kịp nghĩ tới.',
    stack: ['Si', 'Fe', 'Ti', 'Ne'],
    strengths: ['Chu đáo, tận tâm chăm sóc người khác', 'Đáng tin, kiên nhẫn và bền bỉ', 'Nhớ chi tiết, giữ gìn sự ổn định'],
    growth: ['Đặt ranh giới, dám nói "không"', 'Bày tỏ nhu cầu của mình thay vì cam chịu', 'Cởi mở với thay đổi và cách làm mới'],
    workStyle:
      'Phát huy ở vai trò chăm sóc và hỗ trợ — y tế, điều dưỡng, giáo dục, hành chính, dịch vụ khách hàng. Hợp môi trường hài hoà, có cấu trúc và được giúp người cụ thể.',
    relationships:
      'Ấm áp, tận tụy, luôn ở bên khi cần; dễ hi sinh quá mức. Điều nên luyện là tự chăm sóc bản thân và nói rõ mong muốn của mình.',
    atBest:
      'Khi ở phong độ tốt, ISFJ để Fe (phụ trợ) chăm người khác mà vẫn giữ ranh giới cho mình, dám nói không khi cần. Họ vẫn là chỗ dựa ấm áp, tin cậy, nhưng không còn âm thầm hi sinh tới kiệt sức — biết đón nhận sự chăm sóc ngược lại và nói rõ điều mình mong muốn.',
    underStress:
      'Dưới áp lực, chức năng kém Ne trồi lên u ám. ISFJ vốn bình thản có thể bị cuốn vào lo xa về những điều xấu có thể xảy ra, phóng đại nguy cơ, hoặc thấy tương lai đầy bất trắc. Đó thường là lúc họ đã lo cho mọi người quá nhiều và cần được nghỉ, được trấn an.',
    commonConfusions:
      'Hay bị nhầm với ISTJ và INFJ. So với ISTJ (cùng Si trội): ISFJ theo sau bằng Fe nên ưu tiên con người và hài hoà, ISTJ theo sau bằng Te nên ưu tiên nhiệm vụ và quy trình. So với INFJ: ISFJ neo vào Si (chi tiết, ký ức cụ thể), INFJ neo vào Ni (mẫu hình, viễn cảnh trừu tượng). Mẹo: hỏi họ tin vào kinh nghiệm đã có hay vào linh cảm về hướng đi.',
    growthPath:
      'Hướng phát triển là để Fe (phụ trợ) hướng cả vào việc chăm chính mình, không chỉ chăm người khác. Tập thêm Ti (cấp ba) để tư duy độc lập, phân biệt điều mình thật sự muốn với điều người khác kỳ vọng. Học nói không sớm chính là món quà ISFJ tặng cho sự bền bỉ của mình.',
  },
  ESTJ: {
    nick: 'Nhà Điều Hành',
    group: 'SJ',
    tagline: 'Tổ chức tốt, thực tế và làm việc dứt khoát.',
    letters: 'Hướng ngoại (E) · Cảm nhận (S) · Lý trí (T) · Nguyên tắc (J)',
    overview:
      'ESTJ giỏi tổ chức người và việc theo trật tự rõ ràng. Họ thực tế, quyết đoán, coi trọng trách nhiệm và đưa mọi thứ vào quy củ để chạy trơn tru. Chuỗi Te–Si là thế mạnh của họ: tư duy hướng ngoại dựng quy trình, phân vai và đo kết quả, còn cảm nhận hướng nội cung cấp kho kinh nghiệm về cái đã chạy tốt. Vì thế ESTJ thường là người biến một nhóm lộn xộn thành một cỗ máy vận hành đều, và ít kiên nhẫn với những lời hứa suông thiếu bằng chứng.',
    stack: ['Te', 'Si', 'Ne', 'Fi'],
    strengths: ['Tổ chức và quản lý hiệu quả', 'Quyết đoán, đáng tin, có trách nhiệm', 'Thực tế, hướng kết quả rõ ràng'],
    growth: ['Mềm mỏng và lắng nghe cảm xúc người khác', 'Cởi mở với cách làm khác truyền thống', 'Chấp nhận rằng không phải lúc nào mình cũng đúng'],
    workStyle:
      'Mạnh ở vai trò quản lý và vận hành — điều hành, quản lý dự án, hành chính, hậu cần, kinh doanh. Hợp môi trường có cấu trúc, mục tiêu rõ và quyền tổ chức công việc.',
    relationships:
      'Tận tâm, đáng tin, gánh vác cho gia đình; đôi khi quá áp đặt cách làm của mình. Điều nên luyện là kiên nhẫn và để người thân được khác biệt.',
    atBest:
      'Khi phát triển lành mạnh, ESTJ dùng Si (phụ trợ) làm nền vững nhưng vẫn để chỗ cho cách làm mới và cho tiếng nói khác trước khi chốt. Họ gánh vác đáng tin, đưa mọi thứ vào nề nếp, đồng thời học được cách mềm mỏng và ghi nhận cảm xúc — dẫn dắt bằng sự công tâm chứ không chỉ bằng quyền.',
    underStress:
      'Dưới áp lực, chức năng kém Fi trồi lên đột ngột. ESTJ vốn cứng cỏi có thể ứ nghẹn cảm xúc không gọi tên được, bùng lên vì thấy bị coi thường, hoặc âm thầm nghi ngờ liệu công sức của mình có được ai trân trọng. Càng mệt, họ càng siết chặt kiểm soát để né phần dễ tổn thương đó.',
    commonConfusions:
      'Hay bị nhầm với ENTJ và ISTJ. So với ENTJ (cùng Te trội): ESTJ theo sau bằng Si nên bám quy trình đã kiểm chứng và hiện tại; ENTJ theo sau bằng Ni nên hướng chiến lược và tương lai. So với ISTJ: ESTJ hướng ngoại, chủ động tổ chức người khác; ISTJ hướng nội, lặng lẽ làm tròn phần của mình. Mẹo: xem họ thích chuẩn hoá cái đang chạy hay tái phát minh.',
    growthPath:
      'Hướng phát triển là để Si (phụ trợ) làm điểm tựa mà không thành xiềng xích, mở lòng với ý tưởng mới có bằng chứng. Tập chạm tới Fi (cấp ba) để nhận ra cảm xúc của mình và của người thân. Chấp nhận rằng không phải lúc nào mình cũng đúng chính là bước trưởng thành khó nhất với ESTJ.',
  },
  ESFJ: {
    nick: 'Người Chăm Sóc',
    group: 'SJ',
    tagline: 'Hoà đồng, chu đáo và gắn kết mọi người.',
    letters: 'Hướng ngoại (E) · Cảm nhận (S) · Cảm xúc (F) · Nguyên tắc (J)',
    overview:
      'ESFJ ấm áp, hướng tới cộng đồng và giỏi tạo bầu không khí hài hoà. Họ chú ý tới nhu cầu của người xung quanh, nhiệt tình hỗ trợ và gìn giữ các mối quan hệ. Chuỗi Fe–Si tạo nên chất kết nối ấy: cảm xúc hướng ngoại bắt sóng và điều hoà tâm trạng cả nhóm, còn cảm nhận hướng nội nhớ những chi tiết, dịp và thói quen gắn mọi người lại. Vì thế ESFJ thường là người giữ lửa cho các mối quan hệ, người khiến mọi người cảm thấy được nhớ tới và được chăm.',
    stack: ['Fe', 'Si', 'Ne', 'Ti'],
    strengths: ['Hoà đồng, gắn kết và chăm lo cho tập thể', 'Tận tâm, đáng tin, có trách nhiệm', 'Nhạy với nhu cầu và cảm xúc người khác'],
    growth: ['Bớt phụ thuộc vào sự công nhận từ người khác', 'Đặt ranh giới và chăm sóc nhu cầu của mình', 'Đón nhận góp ý mà không thấy bị tổn thương'],
    workStyle:
      'Toả sáng ở vai trò phục vụ và kết nối con người — chăm sóc khách hàng, nhân sự, y tế, giáo dục, tổ chức sự kiện. Hợp môi trường hợp tác, ấm áp và rõ kỳ vọng.',
    relationships:
      'Quan tâm, tận tụy và luôn vun vén; dễ buồn khi nỗ lực không được ghi nhận. Điều nên luyện là cho đi mà không kỳ vọng đền đáp và tự trân trọng bản thân.',
    atBest:
      'Khi ở phong độ tốt, ESFJ chăm lo cho tập thể từ một chỗ đứng vững, không cần được công nhận mới thấy đủ. Họ gắn kết mọi người, nhớ điều quan trọng với từng người, nhưng vẫn giữ ranh giới và đón nhận góp ý như thông tin chứ không như lời chối bỏ — một người vun vén rộng lòng mà không tự đánh mất mình.',
    underStress:
      'Dưới áp lực, chức năng kém Ti trồi lên lệch nhịp. ESFJ vốn ấm áp có thể trở nên xét nét, xoáy vào lỗi logic của người khác, hoặc rút vào phân tích lạnh lùng khác hẳn thường ngày. Đó thường là dấu hiệu họ đã cho đi nhiều mà cảm thấy không được đáp lại, và cần được trấn an.',
    commonConfusions:
      'Hay bị nhầm với ENFJ và ISFJ. So với ENFJ (cùng Fe trội): ESFJ theo sau bằng Si nên bám hiện tại, truyền thống và nhu cầu cụ thể; ENFJ theo sau bằng Ni nên hướng về một tầm nhìn dài hạn. So với ISFJ: ESFJ hướng ngoại, chủ động kết nối cả nhóm; ISFJ hướng nội, lặng lẽ chăm vài người thân. Mẹo: xem họ chăm cái hiện có hay dẫn dắt tới điều chưa có.',
    growthPath:
      'Hướng phát triển là để Si (phụ trợ) làm nền cho sự chăm sóc mà không biến thành áp lực phải hoàn hảo. Tập dùng Ti (cấp ba) để tự đánh giá bản thân bằng tiêu chuẩn của mình, thay vì phụ thuộc lời khen. Học tách giá trị của mình khỏi phản ứng của người khác là bước trưởng thành lớn với ESFJ.',
  },
  ISTP: {
    nick: 'Nhà Kỹ Thuật',
    group: 'SP',
    tagline: 'Thực tế, điềm tĩnh và giỏi xử lý vấn đề tại chỗ.',
    letters: 'Hướng nội (I) · Cảm nhận (S) · Lý trí (T) · Linh hoạt (P)',
    overview:
      'ISTP thích tự tay mày mò, hiểu cách mọi thứ vận hành và giải quyết vấn đề thực tế. Họ điềm tĩnh, độc lập, linh hoạt và phản ứng tốt trong tình huống cần ứng biến. Chuỗi Ti–Se lý giải phong cách của họ: tư duy hướng nội bóc tách logic vận hành của sự vật, còn cảm nhận hướng ngoại cho họ phản xạ nhạy với hiện tại và hành động tức thì. Vì vậy ISTP học bằng cách bắt tay làm và tháo lắp, và thường là người bình tĩnh nhất khi cần xử lý sự cố ngay tại chỗ.',
    stack: ['Ti', 'Se', 'Ni', 'Fe'],
    strengths: ['Giỏi xử lý vấn đề thực tế, thực hành', 'Điềm tĩnh, lý trí dưới áp lực', 'Linh hoạt, thích nghi nhanh với tình huống'],
    growth: ['Chia sẻ suy nghĩ và cảm xúc nhiều hơn', 'Cam kết dài hạn thay vì chỉ thích tự do', 'Quan tâm tới tác động cảm xúc của lời nói/hành động'],
    workStyle:
      'Mạnh ở công việc thực hành, kỹ thuật và xử lý sự cố — cơ khí, kỹ thuật, IT, vận hành, thể thao, nghề thủ công. Hợp môi trường tự chủ, ít quy tắc rườm rà.',
    relationships:
      'Trung thực, dễ chịu, tôn trọng không gian riêng; ngại bày tỏ cảm xúc. Điều nên luyện là chủ động chia sẻ và đáp lại nhu cầu tình cảm của người thân.',
    atBest:
      'Khi phát triển lành mạnh, ISTP để Se (phụ trợ) đưa sự hiểu biết của Ti vào việc làm thật, khéo léo mà không liều lĩnh. Họ vẫn giữ được sự tự chủ và điềm tĩnh quý giá, nhưng học được cách chia sẻ suy nghĩ và ở lại với cam kết — một người vừa giỏi tay nghề vừa đáng tin trong quan hệ.',
    underStress:
      'Dưới áp lực, chức năng kém Fe bung ra khó kiểm soát. ISTP vốn kín tiếng có thể bỗng bùng nổ cảm xúc, nhạy cảm quá mức chuyện được coi trọng, hoặc lóng ngóng khi phải bày tỏ tình cảm. Càng căng, họ càng rút vào việc riêng và không gian một mình để lấy lại thăng bằng.',
    commonConfusions:
      'Hay bị nhầm với INTP và ISFP. So với INTP (cùng Ti trội): ISTP hướng ra hành động cụ thể qua Se, INTP mải ý tưởng và khả năng qua Ne. So với ISFP: ISTP quyết bằng Ti (logic, cơ chế), ISFP quyết bằng Fi (giá trị, thẩm mỹ). Mẹo: hỏi họ bị hút bởi câu cái này hoạt động thế nào hay câu cái này có ý nghĩa gì với tôi.',
    growthPath:
      'Hướng phát triển là để Se (phụ trợ) gắn kỹ năng vào việc có ích lâu dài, thay vì chỉ chạy theo cái thú vị trước mắt. Chạm dần tới Fe (cấp ba) để chú ý tác động cảm xúc của lời nói, hành động. Chủ động chia sẻ một chút với người thân là bài tập nhỏ nhưng đổi được rất nhiều với ISTP.',
  },
  ISFP: {
    nick: 'Người Nghệ Sĩ',
    group: 'SP',
    tagline: 'Dịu dàng, tinh tế và sống theo cảm nhận của mình.',
    letters: 'Hướng nội (I) · Cảm nhận (S) · Cảm xúc (F) · Linh hoạt (P)',
    overview:
      'ISFP cảm nhận thế giới qua giác quan và giá trị nội tâm, thường thể hiện mình qua cái đẹp và hành động hơn lời nói. Họ hiền hoà, sống cho hiện tại và trân trọng tự do cá nhân. Chuỗi Fi–Se làm nên chất nghệ sĩ: cảm xúc hướng nội giữ một hệ giá trị sâu và riêng, còn cảm nhận hướng ngoại khiến họ nhạy bén với màu sắc, âm thanh, chất liệu của khoảnh khắc. Vì thế ISFP thường nói bằng việc làm và tác phẩm hơn bằng lời, và giữ chính kiến rất kiên định dưới vẻ ngoài mềm mỏng.',
    stack: ['Fi', 'Se', 'Ni', 'Te'],
    strengths: ['Tinh tế, có gu thẩm mỹ và sáng tạo', 'Ấm áp, chân thành, sống đúng giá trị', 'Linh hoạt, dễ chịu, tận hưởng hiện tại'],
    growth: ['Lập kế hoạch dài hạn thay vì chỉ sống cho hiện tại', 'Bày tỏ chính kiến thay vì né tránh va chạm', 'Tin vào năng lực của mình hơn'],
    workStyle:
      'Phát huy ở công việc sáng tạo và cảm quan — thiết kế, nghệ thuật, ẩm thực, chăm sóc, nghề thủ công. Hợp môi trường linh hoạt, tôn trọng cá tính và ít gò bó.',
    relationships:
      'Dịu dàng, tận tâm, thể hiện tình cảm qua cử chỉ chu đáo; ngại xung đột. Điều nên luyện là nói thẳng cảm xúc và nhu cầu thay vì giữ trong lòng.',
    atBest:
      'Khi ở phong độ tốt, ISFP để Se (phụ trợ) biến giá trị nội tâm thành tác phẩm và hành động chạm được người khác. Họ vẫn dịu dàng, sống thật với mình, nhưng đủ tự tin để nói ra chính kiến và tin vào năng lực bản thân — một người nghệ sĩ vừa tinh tế vừa dám hiện diện, không còn lặng lẽ nhường nhịn.',
    underStress:
      'Dưới áp lực, chức năng kém Te trồi lên vụng về. ISFP vốn ôn hoà có thể bỗng gay gắt về hiệu quả, phê phán năng lực của mình và người khác, hoặc cố kiểm soát mọi thứ bằng danh sách và quy tắc khác hẳn thường ngày. Đó là dấu hiệu họ đang quá tải và cần rút về với điều mình yêu thích.',
    commonConfusions:
      'Hay bị nhầm với INFP và ISTP. So với INFP (cùng Fi trội): ISFP neo vào Se, sống với giác quan và hiện tại; INFP neo vào Ne, sống với ý tưởng và khả năng. So với ISTP: ISFP quyết bằng Fi (giá trị, thẩm mỹ), ISTP quyết bằng Ti (logic, cơ chế). Mẹo: xem họ hướng tới cái đẹp và ý nghĩa hay tới cách vận hành của sự vật.',
    growthPath:
      'Hướng phát triển là để Se (phụ trợ) đưa giá trị thành hành động đều đặn, và chạm dần tới Ni (cấp ba) để nghĩ xa hơn hiện tại, đặt mục tiêu dài hạn. Về sau, làm quen với Te — chia việc thành bước — giúp ISFP hiện thực hoá điều mình trân trọng mà không đánh mất sự tự nhiên.',
  },
  ESTP: {
    nick: 'Người Năng Động',
    group: 'SP',
    tagline: 'Nhanh nhạy, thực tế và dám hành động.',
    letters: 'Hướng ngoại (E) · Cảm nhận (S) · Lý trí (T) · Linh hoạt (P)',
    overview:
      'ESTP đọc tình huống nhanh và hành động dứt khoát, thích thử thách và những gì diễn ra ngay trước mắt. Họ thực tế, gan dạ, hoạt bát và xoay xở giỏi trong khủng hoảng. Chuỗi Se–Ti giải thích sự nhanh nhạy ấy: cảm nhận hướng ngoại thu trọn dữ kiện của khoảnh khắc, còn tư duy hướng nội lập tức tính nước đi hợp lý nhất. Vì vậy ESTP thường là người ra tay khi người khác còn đang bàn, và học tốt nhất bằng trải nghiệm trực tiếp hơn là lý thuyết.',
    stack: ['Se', 'Ti', 'Fe', 'Ni'],
    strengths: ['Nhanh nhạy, quyết đoán trong hành động', 'Thực tế, giỏi ứng biến tình huống', 'Tự tin, năng lượng cao, dám thử'],
    growth: ['Cân nhắc hệ quả dài hạn trước khi hành động', 'Kiên nhẫn với việc cần chiều sâu, thời gian', 'Chú ý tới cảm xúc của người khác'],
    workStyle:
      'Bùng nổ ở công việc nhịp nhanh, thực tế — kinh doanh, bán hàng, thể thao, ứng cứu, vận hành, khởi nghiệp. Hợp môi trường năng động, có thử thách và phản hồi tức thì.',
    relationships:
      'Vui, sôi nổi, mang lại trải nghiệm thú vị; dễ thiếu kiên nhẫn với chiều sâu cảm xúc. Điều nên luyện là sự bền bỉ và lắng nghe sâu hơn.',
    atBest:
      'Khi phát triển lành mạnh, ESTP để Ti (phụ trợ) đặt câu hỏi hệ quả dài hạn trước khi lao vào, biến sự gan dạ thành nước đi khôn ngoan. Họ vẫn năng lượng cao, ứng biến giỏi, nhưng biết dừng để nghĩ và chú ý tới cảm xúc người khác — một người hành động dứt khoát mà không bốc đồng.',
    underStress:
      'Dưới áp lực, chức năng kém Ni trồi lên tối màu. ESTP vốn lạc quan có thể bỗng bị ám bởi những viễn cảnh xấu mơ hồ, thấy điềm gở trong mọi thứ, hoặc rút lui khác hẳn thường ngày. Đó là dấu hiệu họ đã chạy theo hiện tại quá lâu mà chưa dừng lại nhìn đường dài.',
    commonConfusions:
      'Hay bị nhầm với ESFP và ISTP. So với ESFP (cùng Se trội): ESTP quyết bằng Ti (logic, chiến thuật), ESFP quyết bằng Fi (giá trị, con người). So với ISTP: ESTP hướng ngoại, chủ động lao vào tình huống; ISTP hướng nội, lặng lẽ mày mò một mình. Mẹo: khi có việc gấp, ESTP hỏi cách nào hiệu quả nhất, ESFP hỏi điều này ảnh hưởng tới ai.',
    growthPath:
      'Hướng phát triển là để Ti (phụ trợ) neo lại phản xạ hành-động-ngay của Se, cân nhắc hệ quả trước khi ra tay. Chạm dần tới Fe (cấp ba) để đọc và tôn trọng cảm xúc người khác. Kiên nhẫn với những việc cần chiều sâu và thời gian là bài tập khó mà đáng giá nhất với ESTP.',
  },
  ESFP: {
    nick: 'Người Trình Diễn',
    group: 'SP',
    tagline: 'Vui tươi, nồng nhiệt và sống hết mình với hiện tại.',
    letters: 'Hướng ngoại (E) · Cảm nhận (S) · Cảm xúc (F) · Linh hoạt (P)',
    overview:
      'ESFP mang năng lượng ấm áp, thích kết nối và làm cho khoảnh khắc trở nên sống động. Họ thực tế, hào phóng cảm xúc, nhạy với con người và tận hưởng cuộc sống bằng mọi giác quan. Chuỗi Se–Fi làm nên sức hút của họ: cảm nhận hướng ngoại cho họ hoà mình trọn vẹn vào hiện tại, còn cảm xúc hướng nội khiến họ chân thành và trung thành với điều mình quý. Vì thế ESFP thường là người khiến bữa tiệc vui hơn và khiến người bên cạnh thấy được chú ý, được sống trong khoảnh khắc.',
    stack: ['Se', 'Fi', 'Te', 'Ni'],
    strengths: ['Hoạt bát, lan toả niềm vui và năng lượng', 'Ấm áp, hào phóng, dễ gần', 'Thực tế, nhạy bén với hiện tại và con người'],
    growth: ['Lập kế hoạch và nghĩ tới tương lai', 'Đối diện vấn đề khó thay vì né tránh', 'Cân bằng giữa vui chơi và trách nhiệm'],
    workStyle:
      'Toả sáng ở công việc nhiều tương tác và sáng tạo — sự kiện, biểu diễn, bán hàng, dịch vụ, du lịch, giáo dục mầm non. Hợp môi trường sống động, linh hoạt, nhiều con người.',
    relationships:
      'Nồng nhiệt, vui vẻ, hết lòng với người thân; dễ ngại những cuộc trò chuyện nặng nề. Điều nên luyện là đối diện mâu thuẫn và nghĩ cho đường dài.',
    atBest:
      'Khi ở phong độ tốt, ESFP để Fi (phụ trợ) neo niềm vui vào điều mình thật sự trân trọng, và dám đối diện việc khó thay vì né. Họ vẫn lan toả năng lượng ấm áp, sống động, nhưng có đủ chiều sâu và trách nhiệm để nghĩ cho đường dài — một người vui sống mà vẫn đáng tin, không chỉ chạy theo khoảnh khắc.',
    underStress:
      'Dưới áp lực, chức năng kém Ni trồi lên nặng nề. ESFP vốn tươi vui có thể bỗng bị cuốn vào linh cảm u ám về tương lai, gán ý nghĩa xấu cho mọi việc, hoặc thu mình khác hẳn thường ngày. Đó là dấu hiệu họ đã tránh né điều khó quá lâu và cần dừng lại đối diện.',
    commonConfusions:
      'Hay bị nhầm với ENFP và ESTP. So với ENFP: ESFP dẫn bằng Se nên sống với giác quan và hiện tại, ENFP dẫn bằng Ne nên sống với ý tưởng và khả năng. So với ESTP (cùng Se trội): ESFP quyết bằng Fi (giá trị, con người), ESTP quyết bằng Ti (logic, chiến thuật). Mẹo: xem họ bị hút bởi khoảnh khắc trước mắt hay bởi khả năng chưa xảy ra.',
    growthPath:
      'Hướng phát triển là để Fi (phụ trợ) giúp chọn điều đáng theo giữa muôn vàn thú vui, và tập dùng Te (cấp ba) để lập kế hoạch, chia việc thành bước. Chạm dần tới Ni giúp ESFP nghĩ xa hơn hiện tại. Đối diện một cuộc trò chuyện khó thay vì né chính là bước trưởng thành lớn.',
  },
};

export interface MbtiTypeData extends MbtiTypeRaw {
  code: string; // 'INTJ'
  slug: string; // 'intj'
  groupMeta: MbtiGroupMeta;
  stackDetail: { fn: string; role: string; gloss: string }[];
  groupMates: TypeRef[];
  others: TypeRef[];
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

export interface TypeRef {
  code: string;
  slug: string;
  nick: string;
  group: MbtiGroupKey;
}

const codeOf = (slug: string) => slug.toUpperCase();

const refOf = (slug: string): TypeRef => {
  const code = codeOf(slug);
  const t = TYPES[code];
  if (!t) throw new Error(`Unknown MBTI type: ${code}`);
  return { code, slug, nick: t.nick, group: t.group };
};

export const listTypes = (): TypeRef[] => MBTI_SLUGS.map((s) => refOf(s));

export function buildType(slugRaw: string): MbtiTypeData | null {
  const slug = slugRaw.toLowerCase();
  if (!(MBTI_SLUGS as readonly string[]).includes(slug)) return null;
  const code = codeOf(slug);
  const t = TYPES[code];
  if (!t) return null;

  const groupMeta = MBTI_GROUPS[t.group];
  const stackDetail = t.stack.map((fn, i) => ({
    fn,
    role: FUNCTION_ROLES[i] ?? '',
    gloss: FUNCTION_GLOSS[fn] ?? '',
  }));
  const groupMates = MBTI_SLUGS.filter(
    (s) => s !== slug && TYPES[codeOf(s)]?.group === t.group,
  ).map(refOf);
  const others = MBTI_SLUGS.filter((s) => s !== slug).map(refOf);

  const seoTitle = `MBTI ${code} — ${t.nick}`;
  const seoDescription = `${code} (${t.nick}): tổng quan, điểm mạnh, hướng phát triển, chuỗi chức năng nhận thức (${t.stack.join('–')}), công việc và tình cảm. Không phán số mệnh.`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `MBTI ${code} (${t.nick}) là người thế nào?`,
      a: `${t.overview} Bốn chữ cái: ${t.letters}.`,
    },
    {
      q: `Điểm mạnh và điều ${code} cần lưu ý là gì?`,
      a: `Điểm mạnh: ${t.strengths.join('; ')}. Hướng phát triển: ${t.growth.join('; ')}.`,
    },
    {
      q: `Chuỗi chức năng nhận thức của ${code} là gì?`,
      a: `${code} có trật tự chức năng ${t.stack.join(' – ')}: ${stackDetail
        .map((s) => `${s.role} ${s.fn} (${s.gloss})`)
        .join('; ')}. Đây là khung lý thuyết để hiểu cách ${code} xử lý thông tin và ra quyết định.`,
    },
    {
      q: `${code} hợp với công việc nào?`,
      a: `${t.workStyle} Đây là xu hướng tham khảo, không phải giới hạn — ${code} vẫn thành công ở nhiều lĩnh vực khác.`,
    },
    {
      q: `${code} trong các mối quan hệ thế nào?`,
      a: t.relationships,
    },
    {
      q: `MBTI ${code} có chính xác không?`,
      a: `MBTI là khung phân loại để tự phản tỉnh, bị nhiều nhà tâm lý học phản biện về độ tin cậy và không phải chẩn đoán. Kết quả phản ánh xu hướng tự nhiên, có thể đổi theo giai đoạn cuộc đời. Hãy xem ${code} như một góc nhìn — không phải nhãn cố định hay lời phán số mệnh.`,
    },
    {
      q: `${code} hay bị nhầm với nhóm nào, phân biệt thế nào?`,
      a: t.commonConfusions,
    },
    {
      q: `${code} nên phát triển theo hướng nào?`,
      a: t.growthPath,
    },
  ];

  return {
    ...t,
    code,
    slug,
    groupMeta,
    stackDetail,
    groupMates,
    others,
    seoTitle,
    seoDescription,
    faqs,
  };
}
