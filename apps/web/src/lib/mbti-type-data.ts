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
}

const TYPES: Record<string, MbtiTypeRaw> = {
  INTJ: {
    nick: 'Nhà Chiến Lược',
    group: 'NT',
    tagline: 'Tầm nhìn dài hạn, độc lập và đầy tính chiến lược.',
    letters: 'Hướng nội (I) · Trực giác (N) · Lý trí (T) · Nguyên tắc (J)',
    overview:
      'INTJ nhìn xa, thích xây hệ thống và biến ý tưởng trừu tượng thành kế hoạch khả thi. Họ độc lập, coi trọng năng lực và thường tự đặt tiêu chuẩn cao cho bản thân lẫn công việc.',
    stack: ['Ni', 'Te', 'Fi', 'Se'],
    strengths: ['Tư duy chiến lược, nhìn ra bức tranh dài hạn', 'Độc lập, quyết đoán, tự định hướng', 'Kiên định theo đuổi mục tiêu đã chọn'],
    growth: ['Mở lòng với cảm xúc — của mình và của người khác', 'Chấp nhận không phải việc gì cũng cần tối ưu', 'Kiên nhẫn hơn với người làm theo nhịp khác'],
    workStyle:
      'Toả sáng ở vai trò cần hoạch định, hệ thống và tầm nhìn — chiến lược, thiết kế giải pháp, nghiên cứu, quản lý dự án dài hạn. Hợp môi trường tự chủ, ít bị quản lý vi mô.',
    relationships:
      'Gắn bó sâu với số ít người thân thiết; thể hiện quan tâm qua hành động và giải pháp hơn lời nói. Điều nên luyện là bày tỏ cảm xúc rõ ràng hơn.',
  },
  INTP: {
    nick: 'Nhà Tư Tưởng',
    group: 'NT',
    tagline: 'Ham phân tích, tò mò và yêu sự mạch lạc của logic.',
    letters: 'Hướng nội (I) · Trực giác (N) · Lý trí (T) · Linh hoạt (P)',
    overview:
      'INTP say mê tìm hiểu nguyên lý vận hành của mọi thứ, xây những mô hình tư duy chặt chẽ trong đầu. Họ khách quan, độc lập và thường đặt câu hỏi "tại sao" trước khi chấp nhận điều gì.',
    stack: ['Ti', 'Ne', 'Si', 'Fe'],
    strengths: ['Phân tích sắc bén, tư duy logic chặt chẽ', 'Tò mò trí tuệ, cởi mở với ý tưởng mới', 'Khách quan, nhìn vấn đề đa chiều'],
    growth: ['Biến ý tưởng thành hành động thay vì mãi lý thuyết', 'Quan tâm tới cảm xúc trong tương tác hằng ngày', 'Chốt quyết định thay vì phân tích vô tận'],
    workStyle:
      'Sâu sắc ở công việc cần phân tích, mô hình hoá và sáng tạo giải pháp — nghiên cứu, lập trình, khoa học dữ liệu, kỹ thuật, học thuật. Hợp không gian linh hoạt, được tự do khám phá.',
    relationships:
      'Trung thành, tôn trọng tự do của đôi bên; kết nối qua đối thoại trí tuệ. Điều nên luyện là chú ý và đáp lại nhu cầu cảm xúc của người thân.',
  },
  ENTJ: {
    nick: 'Nhà Chỉ Huy',
    group: 'NT',
    tagline: 'Quyết đoán, có tổ chức và sinh ra để dẫn dắt.',
    letters: 'Hướng ngoại (E) · Trực giác (N) · Lý trí (T) · Nguyên tắc (J)',
    overview:
      'ENTJ nhìn ra mục tiêu rồi tổ chức người và nguồn lực để đạt được. Họ tự tin, thẳng thắn, giỏi hoạch định dài hạn và thúc đẩy mọi thứ tiến về phía trước.',
    stack: ['Te', 'Ni', 'Se', 'Fi'],
    strengths: ['Lãnh đạo tự nhiên, quyết đoán', 'Tư duy chiến lược kết hợp khả năng tổ chức', 'Tự tin, hiệu quả, hướng kết quả'],
    growth: ['Lắng nghe và ghi nhận cảm xúc đội ngũ', 'Chậm lại để cân nhắc ý kiến khác trước khi chốt', 'Cho phép bản thân nghỉ ngơi, không chỉ làm việc'],
    workStyle:
      'Mạnh ở vai trò lãnh đạo, vận hành và chiến lược — quản lý, khởi nghiệp, tư vấn, điều hành. Hợp môi trường có mục tiêu rõ, quyền quyết định và thử thách lớn.',
    relationships:
      'Tận tâm và muốn cùng người thân phát triển; dễ vô tình quá thẳng. Điều nên luyện là mềm mỏng hơn và để người khác dẫn dắt đôi lúc.',
  },
  ENTP: {
    nick: 'Người Tranh Biện',
    group: 'NT',
    tagline: 'Nhanh trí, thích ý tưởng mới và mê tranh luận.',
    letters: 'Hướng ngoại (E) · Trực giác (N) · Lý trí (T) · Linh hoạt (P)',
    overview:
      'ENTP bật ra ý tưởng liên tục, thích thử thách giả định và nhìn vấn đề từ nhiều góc. Họ linh hoạt, hoạt ngôn và hào hứng với khả năng mới hơn là quy trình cố định.',
    stack: ['Ne', 'Ti', 'Fe', 'Si'],
    strengths: ['Sáng tạo, nhiều ý tưởng và giải pháp', 'Linh hoạt, ứng biến nhanh', 'Hùng biện, dám thách thức lối mòn'],
    growth: ['Đi tới cùng thay vì bỏ dở khi hết hứng', 'Để ý tranh luận có làm tổn thương người khác không', 'Xây kỷ luật cho các việc đều đặn, ít hấp dẫn'],
    workStyle:
      'Bùng nổ ở môi trường đổi mới, nhiều ý tưởng — khởi nghiệp, marketing, sáng tạo sản phẩm, tư vấn. Hợp công việc đa dạng, ít lặp lại và được tự do thử nghiệm.',
    relationships:
      'Vui, kích thích trí tuệ, mang năng lượng mới cho mối quan hệ. Điều nên luyện là sự ổn định và lắng nghe cảm xúc thay vì biến mọi thứ thành cuộc tranh luận.',
  },
  INFJ: {
    nick: 'Người Cố Vấn',
    group: 'NF',
    tagline: 'Sâu sắc, lý tưởng và thấu cảm khác thường.',
    letters: 'Hướng nội (I) · Trực giác (N) · Cảm xúc (F) · Nguyên tắc (J)',
    overview:
      'INFJ kết hợp trực giác về con người với khát khao tạo ra ý nghĩa. Họ kín đáo nhưng giàu niềm tin nội tâm, nhìn ra động cơ ẩn của người khác và hướng tới điều tốt đẹp lâu dài.',
    stack: ['Ni', 'Fe', 'Ti', 'Se'],
    strengths: ['Thấu cảm sâu, hiểu động cơ của người khác', 'Kiên định với giá trị và lý tưởng', 'Sáng tạo, nhìn ra ý nghĩa và viễn cảnh'],
    growth: ['Đặt ranh giới, tránh ôm hết cảm xúc người khác', 'Chấp nhận sự không hoàn hảo của thực tế', 'Chia sẻ nhu cầu của mình thay vì âm thầm chịu đựng'],
    workStyle:
      'Phát huy ở công việc giúp người và mang ý nghĩa — tư vấn, trị liệu, giáo dục, viết lách, lĩnh vực phi lợi nhuận. Hợp môi trường yên tĩnh, giá trị rõ ràng và được làm việc chiều sâu.',
    relationships:
      'Tận tụy, tìm kết nối chân thật và sâu sắc; dễ kiệt sức vì cho đi quá nhiều. Điều nên luyện là nói thẳng nhu cầu và giữ năng lượng cho chính mình.',
  },
  INFP: {
    nick: 'Người Lý Tưởng',
    group: 'NF',
    tagline: 'Giàu giá trị nội tâm, chân thật và đầy lòng trắc ẩn.',
    letters: 'Hướng nội (I) · Trực giác (N) · Cảm xúc (F) · Linh hoạt (P)',
    overview:
      'INFP sống theo la bàn giá trị bên trong và khao khát được là chính mình. Họ giàu trí tưởng tượng, đồng cảm, luôn đi tìm ý nghĩa và muốn thế giới tốt đẹp, nhân văn hơn.',
    stack: ['Fi', 'Ne', 'Si', 'Te'],
    strengths: ['Trung thành với giá trị, chính trực', 'Đồng cảm và bao dung với người khác', 'Sáng tạo, giàu trí tưởng tượng'],
    growth: ['Biến lý tưởng thành bước hành động cụ thể', 'Bớt khắt khe và tự phê phán bản thân', 'Đối diện mâu thuẫn thay vì né tránh'],
    workStyle:
      'Toả sáng ở công việc sáng tạo và mang ý nghĩa — viết lách, nghệ thuật, tư vấn, giáo dục, công tác xã hội. Hợp môi trường tôn trọng giá trị cá nhân, ít cạnh tranh ngột ngạt.',
    relationships:
      'Sâu sắc, tận tâm và trân trọng sự chân thật; dễ tổn thương khi giá trị bị xúc phạm. Điều nên luyện là trao đổi thẳng thắn thay vì giữ trong lòng.',
  },
  ENFJ: {
    nick: 'Người Truyền Cảm Hứng',
    group: 'NF',
    tagline: 'Ấm áp, lôi cuốn và sinh ra để nâng đỡ người khác.',
    letters: 'Hướng ngoại (E) · Trực giác (N) · Cảm xúc (F) · Nguyên tắc (J)',
    overview:
      'ENFJ nhạy với nhu cầu của người xung quanh và giỏi truyền động lực để mọi người cùng tiến bộ. Họ ấm áp, có sức ảnh hưởng, hướng tập thể tới mục tiêu chung đầy ý nghĩa.',
    stack: ['Fe', 'Ni', 'Se', 'Ti'],
    strengths: ['Truyền cảm hứng, dẫn dắt bằng sự đồng cảm', 'Đọc cảm xúc tập thể tinh tế', 'Tận tâm giúp người khác phát triển'],
    growth: ['Chăm sóc nhu cầu của chính mình, tránh kiệt sức', 'Chấp nhận không thể làm hài lòng tất cả', 'Đón nhận góp ý mà không thấy bị chối bỏ'],
    workStyle:
      'Mạnh ở vai trò dẫn dắt con người — giáo dục, đào tạo, nhân sự, truyền thông, lãnh đạo cộng đồng. Hợp môi trường hợp tác, có sứ mệnh rõ và được tạo tác động lên người khác.',
    relationships:
      'Quan tâm sâu, luôn vun đắp cho người thân; dễ quên bản thân vì lo cho người khác. Điều nên luyện là cân bằng cho–nhận và đặt ranh giới lành mạnh.',
  },
  ENFP: {
    nick: 'Nhà Vận Động',
    group: 'NF',
    tagline: 'Nhiệt huyết, giàu cảm hứng và yêu con người.',
    letters: 'Hướng ngoại (E) · Trực giác (N) · Cảm xúc (F) · Linh hoạt (P)',
    overview:
      'ENFP tràn năng lượng, nhìn thấy tiềm năng ở mọi người và mọi ý tưởng. Họ nồng nhiệt, sáng tạo, ghét sự gò bó và luôn tìm kiếm trải nghiệm cùng ý nghĩa mới.',
    stack: ['Ne', 'Fi', 'Te', 'Si'],
    strengths: ['Nhiệt huyết, lan toả cảm hứng', 'Sáng tạo, nhìn ra khả năng và tiềm năng', 'Ấm áp, dễ kết nối với nhiều kiểu người'],
    growth: ['Theo đuổi đến cùng thay vì nhảy việc liên tục', 'Xây thói quen và kỷ luật cho việc đều đặn', 'Đối diện chi tiết thực tế thay vì né tránh'],
    workStyle:
      'Bùng nổ ở công việc sáng tạo, nhiều người và ý tưởng — truyền thông, marketing, sự kiện, khởi nghiệp, giáo dục. Hợp môi trường linh hoạt, đa dạng và giàu ý nghĩa.',
    relationships:
      'Nồng nhiệt, chân thành, mang niềm vui cho mối quan hệ; dễ chán khi thiếu mới mẻ. Điều nên luyện là sự bền bỉ và chú ý tới nhu cầu dài hạn của đôi bên.',
  },
  ISTJ: {
    nick: 'Người Trách Nhiệm',
    group: 'SJ',
    tagline: 'Đáng tin, thực tế và làm việc theo nguyên tắc.',
    letters: 'Hướng nội (I) · Cảm nhận (S) · Lý trí (T) · Nguyên tắc (J)',
    overview:
      'ISTJ coi trọng trách nhiệm, sự thật và truyền thống. Họ tỉ mỉ, có hệ thống, giữ lời và làm tới nơi tới chốn — chỗ dựa vững chắc cho gia đình lẫn tổ chức.',
    stack: ['Si', 'Te', 'Fi', 'Ne'],
    strengths: ['Đáng tin, có trách nhiệm và kỷ luật', 'Tỉ mỉ, chính xác với chi tiết', 'Thực tế, bình tĩnh xử lý công việc'],
    growth: ['Cởi mở hơn với cách làm và ý tưởng mới', 'Bày tỏ cảm xúc thay vì giữ kín', 'Linh hoạt khi kế hoạch buộc phải thay đổi'],
    workStyle:
      'Vững vàng ở công việc cần chính xác, quy trình và độ tin cậy — kế toán, kiểm toán, vận hành, hành chính, kỹ thuật, pháp lý. Hợp môi trường rõ vai trò, ổn định.',
    relationships:
      'Chung thuỷ, tận tâm và giữ cam kết; thể hiện tình cảm qua hành động chăm lo cụ thể. Điều nên luyện là nói lời yêu thương và cởi mở với điều mới.',
  },
  ISFJ: {
    nick: 'Người Bảo Vệ',
    group: 'SJ',
    tagline: 'Tận tụy, chu đáo và âm thầm chăm lo cho người khác.',
    letters: 'Hướng nội (I) · Cảm nhận (S) · Cảm xúc (F) · Nguyên tắc (J)',
    overview:
      'ISFJ kết hợp sự chu đáo với tinh thần trách nhiệm. Họ nhớ những điều nhỏ nhặt, lặng lẽ lo cho người thân và giữ cho mọi thứ ấm áp, ổn định.',
    stack: ['Si', 'Fe', 'Ti', 'Ne'],
    strengths: ['Chu đáo, tận tâm chăm sóc người khác', 'Đáng tin, kiên nhẫn và bền bỉ', 'Nhớ chi tiết, giữ gìn sự ổn định'],
    growth: ['Đặt ranh giới, dám nói "không"', 'Bày tỏ nhu cầu của mình thay vì cam chịu', 'Cởi mở với thay đổi và cách làm mới'],
    workStyle:
      'Phát huy ở vai trò chăm sóc và hỗ trợ — y tế, điều dưỡng, giáo dục, hành chính, dịch vụ khách hàng. Hợp môi trường hài hoà, có cấu trúc và được giúp người cụ thể.',
    relationships:
      'Ấm áp, tận tụy, luôn ở bên khi cần; dễ hi sinh quá mức. Điều nên luyện là tự chăm sóc bản thân và nói rõ mong muốn của mình.',
  },
  ESTJ: {
    nick: 'Nhà Điều Hành',
    group: 'SJ',
    tagline: 'Tổ chức tốt, thực tế và làm việc dứt khoát.',
    letters: 'Hướng ngoại (E) · Cảm nhận (S) · Lý trí (T) · Nguyên tắc (J)',
    overview:
      'ESTJ giỏi tổ chức người và việc theo trật tự rõ ràng. Họ thực tế, quyết đoán, coi trọng trách nhiệm và đưa mọi thứ vào quy củ để chạy trơn tru.',
    stack: ['Te', 'Si', 'Ne', 'Fi'],
    strengths: ['Tổ chức và quản lý hiệu quả', 'Quyết đoán, đáng tin, có trách nhiệm', 'Thực tế, hướng kết quả rõ ràng'],
    growth: ['Mềm mỏng và lắng nghe cảm xúc người khác', 'Cởi mở với cách làm khác truyền thống', 'Chấp nhận rằng không phải lúc nào mình cũng đúng'],
    workStyle:
      'Mạnh ở vai trò quản lý và vận hành — điều hành, quản lý dự án, hành chính, hậu cần, kinh doanh. Hợp môi trường có cấu trúc, mục tiêu rõ và quyền tổ chức công việc.',
    relationships:
      'Tận tâm, đáng tin, gánh vác cho gia đình; đôi khi quá áp đặt cách làm của mình. Điều nên luyện là kiên nhẫn và để người thân được khác biệt.',
  },
  ESFJ: {
    nick: 'Người Chăm Sóc',
    group: 'SJ',
    tagline: 'Hoà đồng, chu đáo và gắn kết mọi người.',
    letters: 'Hướng ngoại (E) · Cảm nhận (S) · Cảm xúc (F) · Nguyên tắc (J)',
    overview:
      'ESFJ ấm áp, hướng tới cộng đồng và giỏi tạo bầu không khí hài hoà. Họ chú ý tới nhu cầu của người xung quanh, nhiệt tình hỗ trợ và gìn giữ các mối quan hệ.',
    stack: ['Fe', 'Si', 'Ne', 'Ti'],
    strengths: ['Hoà đồng, gắn kết và chăm lo cho tập thể', 'Tận tâm, đáng tin, có trách nhiệm', 'Nhạy với nhu cầu và cảm xúc người khác'],
    growth: ['Bớt phụ thuộc vào sự công nhận từ người khác', 'Đặt ranh giới và chăm sóc nhu cầu của mình', 'Đón nhận góp ý mà không thấy bị tổn thương'],
    workStyle:
      'Toả sáng ở vai trò phục vụ và kết nối con người — chăm sóc khách hàng, nhân sự, y tế, giáo dục, tổ chức sự kiện. Hợp môi trường hợp tác, ấm áp và rõ kỳ vọng.',
    relationships:
      'Quan tâm, tận tụy và luôn vun vén; dễ buồn khi nỗ lực không được ghi nhận. Điều nên luyện là cho đi mà không kỳ vọng đền đáp và tự trân trọng bản thân.',
  },
  ISTP: {
    nick: 'Nhà Kỹ Thuật',
    group: 'SP',
    tagline: 'Thực tế, điềm tĩnh và giỏi xử lý vấn đề tại chỗ.',
    letters: 'Hướng nội (I) · Cảm nhận (S) · Lý trí (T) · Linh hoạt (P)',
    overview:
      'ISTP thích tự tay mày mò, hiểu cách mọi thứ vận hành và giải quyết vấn đề thực tế. Họ điềm tĩnh, độc lập, linh hoạt và phản ứng tốt trong tình huống cần ứng biến.',
    stack: ['Ti', 'Se', 'Ni', 'Fe'],
    strengths: ['Giỏi xử lý vấn đề thực tế, thực hành', 'Điềm tĩnh, lý trí dưới áp lực', 'Linh hoạt, thích nghi nhanh với tình huống'],
    growth: ['Chia sẻ suy nghĩ và cảm xúc nhiều hơn', 'Cam kết dài hạn thay vì chỉ thích tự do', 'Quan tâm tới tác động cảm xúc của lời nói/hành động'],
    workStyle:
      'Mạnh ở công việc thực hành, kỹ thuật và xử lý sự cố — cơ khí, kỹ thuật, IT, vận hành, thể thao, nghề thủ công. Hợp môi trường tự chủ, ít quy tắc rườm rà.',
    relationships:
      'Trung thực, dễ chịu, tôn trọng không gian riêng; ngại bày tỏ cảm xúc. Điều nên luyện là chủ động chia sẻ và đáp lại nhu cầu tình cảm của người thân.',
  },
  ISFP: {
    nick: 'Người Nghệ Sĩ',
    group: 'SP',
    tagline: 'Dịu dàng, tinh tế và sống theo cảm nhận của mình.',
    letters: 'Hướng nội (I) · Cảm nhận (S) · Cảm xúc (F) · Linh hoạt (P)',
    overview:
      'ISFP cảm nhận thế giới qua giác quan và giá trị nội tâm, thường thể hiện mình qua cái đẹp và hành động hơn lời nói. Họ hiền hoà, sống cho hiện tại và trân trọng tự do cá nhân.',
    stack: ['Fi', 'Se', 'Ni', 'Te'],
    strengths: ['Tinh tế, có gu thẩm mỹ và sáng tạo', 'Ấm áp, chân thành, sống đúng giá trị', 'Linh hoạt, dễ chịu, tận hưởng hiện tại'],
    growth: ['Lập kế hoạch dài hạn thay vì chỉ sống cho hiện tại', 'Bày tỏ chính kiến thay vì né tránh va chạm', 'Tin vào năng lực của mình hơn'],
    workStyle:
      'Phát huy ở công việc sáng tạo và cảm quan — thiết kế, nghệ thuật, ẩm thực, chăm sóc, nghề thủ công. Hợp môi trường linh hoạt, tôn trọng cá tính và ít gò bó.',
    relationships:
      'Dịu dàng, tận tâm, thể hiện tình cảm qua cử chỉ chu đáo; ngại xung đột. Điều nên luyện là nói thẳng cảm xúc và nhu cầu thay vì giữ trong lòng.',
  },
  ESTP: {
    nick: 'Người Năng Động',
    group: 'SP',
    tagline: 'Nhanh nhạy, thực tế và dám hành động.',
    letters: 'Hướng ngoại (E) · Cảm nhận (S) · Lý trí (T) · Linh hoạt (P)',
    overview:
      'ESTP đọc tình huống nhanh và hành động dứt khoát, thích thử thách và những gì diễn ra ngay trước mắt. Họ thực tế, gan dạ, hoạt bát và xoay xở giỏi trong khủng hoảng.',
    stack: ['Se', 'Ti', 'Fe', 'Ni'],
    strengths: ['Nhanh nhạy, quyết đoán trong hành động', 'Thực tế, giỏi ứng biến tình huống', 'Tự tin, năng lượng cao, dám thử'],
    growth: ['Cân nhắc hệ quả dài hạn trước khi hành động', 'Kiên nhẫn với việc cần chiều sâu, thời gian', 'Chú ý tới cảm xúc của người khác'],
    workStyle:
      'Bùng nổ ở công việc nhịp nhanh, thực tế — kinh doanh, bán hàng, thể thao, ứng cứu, vận hành, khởi nghiệp. Hợp môi trường năng động, có thử thách và phản hồi tức thì.',
    relationships:
      'Vui, sôi nổi, mang lại trải nghiệm thú vị; dễ thiếu kiên nhẫn với chiều sâu cảm xúc. Điều nên luyện là sự bền bỉ và lắng nghe sâu hơn.',
  },
  ESFP: {
    nick: 'Người Trình Diễn',
    group: 'SP',
    tagline: 'Vui tươi, nồng nhiệt và sống hết mình với hiện tại.',
    letters: 'Hướng ngoại (E) · Cảm nhận (S) · Cảm xúc (F) · Linh hoạt (P)',
    overview:
      'ESFP mang năng lượng ấm áp, thích kết nối và làm cho khoảnh khắc trở nên sống động. Họ thực tế, hào phóng cảm xúc, nhạy với con người và tận hưởng cuộc sống bằng mọi giác quan.',
    stack: ['Se', 'Fi', 'Te', 'Ni'],
    strengths: ['Hoạt bát, lan toả niềm vui và năng lượng', 'Ấm áp, hào phóng, dễ gần', 'Thực tế, nhạy bén với hiện tại và con người'],
    growth: ['Lập kế hoạch và nghĩ tới tương lai', 'Đối diện vấn đề khó thay vì né tránh', 'Cân bằng giữa vui chơi và trách nhiệm'],
    workStyle:
      'Toả sáng ở công việc nhiều tương tác và sáng tạo — sự kiện, biểu diễn, bán hàng, dịch vụ, du lịch, giáo dục mầm non. Hợp môi trường sống động, linh hoạt, nhiều con người.',
    relationships:
      'Nồng nhiệt, vui vẻ, hết lòng với người thân; dễ ngại những cuộc trò chuyện nặng nề. Điều nên luyện là đối diện mâu thuẫn và nghĩ cho đường dài.',
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
