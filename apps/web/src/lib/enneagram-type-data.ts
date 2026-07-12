// hieu.asia — Dữ liệu trang chi tiết cho 9 nhóm Enneagram (/learn/enneagram/[type]).
//
// KHÔNG bịa: toàn bộ nội dung tâm lý lấy TỪ engine `lib/scoring/enneagram.ts`
// (TYPE_META + WINGS + INTEGRATION/DISINTEGRATION — vốn đã grounded theo
// Riso–Hudson) và chỉ gói lại + sinh FAQ deterministic. Phần `workStyle` là mô
// tả XU HƯỚNG nghề (lời mình, theo khung Enneagram-at-work phổ biến, miền công
// cộng) — luôn đóng khung "xu hướng, không phán", kèm hướng phát triển.

import {
  TYPE_META,
  WINGS,
  INTEGRATION,
  DISINTEGRATION,
  ENNEAGRAM_TYPE_ORDER,
  type EnneagramType,
  type EnneagramTypeMeta,
} from './scoring/enneagram';

export const ENNEAGRAM_SLUGS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

// Ba trung tâm (triad) — dùng để liệt kê "cùng trung tâm".
const CENTER_GROUPS: EnneagramType[][] = [
  [8, 9, 1], // Bản năng (bụng)
  [2, 3, 4], // Cảm xúc (tim)
  [5, 6, 7], // Tư duy (đầu)
];

// Xu hướng nghề nghiệp — mô tả tendency theo khung Enneagram-at-work, KHÔNG phán.
const WORK_STYLE: Record<EnneagramType, string> = {
  1: 'Toả sáng ở nơi đề cao chất lượng, chuẩn mực và sự chính trực — kiểm soát chất lượng, quy trình, pháp lý, kế toán, biên tập, giáo dục. Nhóm 1 hợp môi trường có tiêu chí đúng–sai rõ ràng, nơi sự tỉ mỉ và trách nhiệm được coi trọng; họ thường là người giữ chuẩn cho cả đội. Điều nên luyện là buông bớt tiêu chuẩn "hoàn hảo" để khỏi tự bào mòn và khỏi soi lỗi đồng nghiệp quá mức — giao việc rồi chấp nhận cách làm khác mình cũng là một kỹ năng nghề.',
  2: 'Mạnh ở những vai trò chăm sóc và kết nối con người — nhân sự, chăm sóc khách hàng, y tế, điều dưỡng, giáo dục, công tác xã hội. Nhóm 2 đọc nhu cầu người khác nhanh và tạo được không khí ấm áp, gắn kết trong đội; họ hợp nơi việc giúp người là phần chính của công việc. Điều nên luyện là đặt ranh giới: học nói "không", không ôm hết phần người khác, và để tâm tới nhu cầu lẫn giới hạn của chính mình trước khi kiệt sức vì lo cho mọi người.',
  3: 'Bứt phá trong môi trường có mục tiêu, đo lường và cơ hội thể hiện — kinh doanh, marketing, bán hàng, lãnh đạo, khởi nghiệp, thể thao thành tích. Nhóm 3 đặt mục tiêu rõ, thích nghi nhanh và biết truyền động lực cho người quanh mình; họ thường là đầu tàu kéo cả đội tiến. Điều nên nhớ là giá trị bản thân không chỉ nằm ở thành tích: dám để lộ một thất bại thật, dành chỗ cho cảm xúc và cho quan hệ không đo bằng KPI, sẽ giúp họ bền và thật hơn.',
  4: 'Phát huy ở công việc sáng tạo, mang dấu ấn cá nhân — nghệ thuật, thiết kế, viết lách, âm nhạc, thương hiệu, trị liệu tâm lý. Nhóm 4 đem chiều sâu cảm xúc và con mắt thẩm mỹ vào việc, thấy được sắc thái mà người khác bỏ qua; họ hợp nơi cho phép cá tính và cảm xúc có chỗ. Điều nên luyện là kỷ luật để biến cảm hứng thành sản phẩm hoàn chỉnh — đi hết một việc dù cảm hứng đã nguội — và bớt so mình với người khác giữa chừng.',
  5: 'Sâu sắc ở công việc cần phân tích, chuyên môn và tính độc lập — nghiên cứu, công nghệ, kỹ thuật, học thuật, phân tích dữ liệu, viết chuyên sâu. Nhóm 5 đào một vấn đề tới tận gốc và giữ được cái đầu tỉnh táo, khách quan giữa lúc rối; họ hợp không gian yên tĩnh, tự chủ, ít bị ngắt quãng. Điều nên luyện là bước ra cộng tác và chia sẻ kết quả sớm thay vì giữ riêng tới khi "đủ hiểu", và tập có mặt với đồng đội cả về cảm xúc, không chỉ về ý tưởng.',
  6: 'Đáng tin ở vai trò cần cẩn trọng, lường rủi ro và bền bỉ — vận hành, quản trị rủi ro, an ninh, kiểm toán, hỗ trợ kỹ thuật, hậu cần. Nhóm 6 nhìn ra chỗ có thể hỏng trước khi nó hỏng và chuẩn bị phương án; họ là chỗ dựa chắc chắn cho cả đội, hợp nơi vai trò rõ ràng và có người đáng tin bên cạnh. Điều nên luyện là tin vào phán đoán của chính mình thay vì liên tục hỏi xin trấn an, và tách nỗi lo tưởng tượng khỏi rủi ro có bằng chứng thật.',
  7: 'Bùng nổ trong môi trường đa dạng, nhiều ý tưởng và ít gò bó — khởi nghiệp, truyền thông, tổ chức sự kiện, sáng tạo nội dung, du lịch, phát triển sản phẩm. Nhóm 7 nhìn ra khả năng mới, kết nối các mảnh rời và tiếp năng lượng cho cả nhóm khi mọi thứ chùng xuống; họ hợp việc mới mẻ liên tục. Điều nên luyện là kỷ luật đi tới cùng: chọn vài thứ để làm cho sâu và hoàn tất, thay vì nhảy sang việc mới ngay khi vừa thấy chán hay khó.',
  8: 'Mạnh ở vị trí cần quyết đoán, chịu trách nhiệm và dẫn dắt — quản lý, khởi nghiệp, đàm phán, vận hành, các vai trò bảo vệ, xử lý khủng hoảng. Nhóm 8 dám đứng mũi chịu sào, ra quyết định dứt khoát và che chở đội của mình trước sức ép bên ngoài; họ hợp nơi được tự chủ, không bị vi mô quản lý. Điều nên luyện là lắng nghe và tin tưởng để không lấn át đội ngũ — hỏi trước khi đè, và cho người khác không gian làm theo cách của họ.',
  9: 'Vững vàng ở vai trò cần điều phối, hoà giải và kiên nhẫn — điều phối dự án, tư vấn, nhân sự, dịch vụ, chăm sóc cộng đồng, trung gian đàm phán. Nhóm 9 thấy được nhiều phía, giữ được sự bình tĩnh và làm chất keo gắn kết những người khó ngồi cùng nhau; họ hợp môi trường hợp tác, ít xung đột gay gắt. Điều nên luyện là chủ động nêu ý kiến và ưu tiên việc của chính mình — nói rõ mình muốn gì thay vì luôn xuôi theo, kẻo mờ nhạt ngay trong việc mình phụ trách.',
};

// TYPE_EXTRA — bốn lớp nội dung sâu cho từng nhóm (chân dung sâu · nét qua ba bản
// năng · dễ nhận nhầm · thực hành phát triển). Grounded từ TYPE_META (khao khát /
// nỗi sợ / điểm mạnh / hướng phát triển / khi căng thẳng) — chỉ diễn giải cách các
// động lực đó vận hành trong đời thường, KHÔNG thêm dữ kiện mới. Phần bản năng
// (sp/sx/so) ở mức PHÁC HOẠ, kèm nhắc rõ trắc nghiệm của site không đo bản năng.
export interface EnneagramTypeExtra {
  deepProfile: string; // chân dung sâu: khao khát–nỗi sợ vận hành thế nào trong đời thường
  subtypeNotes: string; // nét khác nhau qua ba bản năng (phác họa + hedge)
  misidentifications: string; // hay nhận nhầm với nhóm nào, phân biệt bằng ĐỘNG CƠ
  growthPractices: string; // 2–3 thực hành cụ thể đời thường, không phán
}

export const TYPE_EXTRA: Record<EnneagramType, EnneagramTypeExtra> = {
  1: {
    deepProfile:
      'Nhóm 1 mang trong đầu một hình mẫu "lẽ ra phải thế này" và đo mọi việc theo nó. Khao khát sống đúng đắn khiến họ để ý từng chỗ lệch, tự đặt tiêu chuẩn cao và làm việc kỹ tới mức người khác thấy khó theo. Mặt sau của điều đó là một giọng phê phán bên trong hiếm khi tắt: sai một chút đã thấy như mình kém cỏi về mặt đạo đức. Lúc mệt, họ dễ soi lỗi người khác và bực với những gì chưa hoàn hảo. Điều họ thường không nhận ra là "đủ tốt" cũng là một lựa chọn tử tế, trước hết với chính mình.',
    subtypeNotes:
      'Ở bản năng tự tồn (sp), chuẩn mực của nhóm 1 đổ vào nề nếp, ngăn nắp, lo xa cho sinh hoạt. Ở xã hội (so), họ thành người làm gương, muốn chỉnh cả tập thể cho đúng. Ở thân mật (sx), lý tưởng dồn vào một người, dễ khắt khe với người gần nhất. Chỉ là phác họa; bài trắc nghiệm ở đây tìm nhóm và cánh, chưa tách được bản năng trội.',
    misidentifications:
      'Hay bị lẫn với nhóm 6 và nhóm 8. Nhóm 6 cũng tận tâm, đúng mực nhưng chạy bằng nhu cầu an toàn, không phải một chuẩn "đúng" bên trong; nhóm 8 cũng gay gắt nhưng muốn làm chủ, không phải muốn đúng. Phân biệt bằng động cơ: đang muốn "đúng", muốn "an toàn", hay muốn "làm chủ"?',
    growthPractices:
      'Mỗi ngày chọn một việc làm ở mức "đủ tốt" rồi dừng lại, không chỉnh thêm. Khi nghe giọng phê phán trong đầu, viết ra một câu tử tế hơn cho chính mình. Và trước khi sửa lưng ai, thử hỏi năm năm nữa chuyện này có còn quan trọng không.',
  },
  2: {
    deepProfile:
      'Nhóm 2 để ý nhu cầu người khác trước cả nhu cầu của mình, và giỏi thật. Khao khát được thương, được cần đến khiến họ hào phóng, tinh tế, luôn có mặt khi ai đó cần. Nhưng nỗi sợ trở thành người thừa dễ biến sự cho đi thành một cách để được giữ lại: giúp nhiều, khó nói "không", rồi thầm mong được đáp lại. Khi không được ghi nhận, họ tủi thân mà ít nói ra. Bước ngoặt của nhóm 2 là nhận ra mình cũng có nhu cầu, và cho đi vì thật lòng muốn, chứ không phải để đổi lấy tình cảm.',
    subtypeNotes:
      'Ở tự tồn (sp), nhóm 2 chăm sóc qua những việc thiết thân, lo cái ăn cái ở cho người mình thương. Ở xã hội (so), họ giúp cả nhóm, trở thành người kết nối ai cũng cần. Ở thân mật (sx), họ dồn toàn bộ quan tâm vào một người, muốn thành thiết yếu với người đó. Đây là nét phác; trắc nghiệm ở đây không đo được bản năng nào trội.',
    misidentifications:
      'Hay bị lẫn với nhóm 9. Cả hai đều chiều người, dễ quên mình, nhưng nhóm 2 chủ động tiến tới một người cụ thể để được cần đến, còn nhóm 9 hoà tan vào người khác để tránh va chạm. Hỏi động cơ: đang muốn được cần, hay chỉ muốn giữ cho yên?',
    growthPractices:
      'Mỗi tuần làm một việc chỉ cho riêng mình, không cần xin phép ai. Tập nói "để tôi nghĩ đã" thay vì gật ngay khi có người nhờ. Và khi thấy mình đang giúp để được thương, thử cho đi một lần mà không nhắc lại, không chờ đáp lễ.',
  },
  3: {
    deepProfile:
      'Nhóm 3 đặt mục tiêu rõ và lao tới, thích nghi nhanh để thành phiên bản hiệu quả nhất trong từng hoàn cảnh. Khao khát sâu là được thấy có giá trị, và họ học cách chứng minh điều đó bằng thành tích. Cái giá đi kèm: giá trị bản thân dễ dính chặt vào kết quả, nên thất bại chạm vào một nỗi sợ lớn hơn nó nhiều. Để giữ hình ảnh "ổn", họ dễ gạt cảm xúc thật sang bên và làm quá sức. Điều nhóm 3 cần nghe là: bạn có giá trị cả khi không đạt được gì, và người ta thương con người thật hơn một bảng thành tích.',
    subtypeNotes:
      'Ở tự tồn (sp), nhóm 3 gắn thành công với an toàn vật chất, chăm chỉ, tự lực. Ở xã hội (so), họ giỏi đọc "sân khấu" tập thể, muốn được nhóm công nhận. Ở thân mật (sx), họ dồn sức hấp dẫn và thành tích vào việc làm hài lòng, chinh phục một người cụ thể. Mới là phác họa; bản năng trội cần quan sát sâu, không suy ra từ bài rút gọn.',
    misidentifications:
      'Hay bị lẫn với nhóm 1 và nhóm 7. Nhóm 1 cũng chuẩn mực cao nhưng vì muốn "đúng", còn nhóm 3 vì muốn "trông thành công". Nhóm 7 cũng nhiều năng lượng nhưng chạy theo trải nghiệm, còn nhóm 3 chạy theo kết quả được ghi nhận. Nhìn động cơ, đừng nhìn nhịp độ.',
    growthPractices:
      'Cuối ngày ghi lại một điều khiến bạn thấy vui mà không dính gì tới thành tích. Thử chia sẻ một thất bại thật với người bạn tin. Và dành thời gian ở bên ai đó mà không "diễn", không đo mình qua ánh nhìn của họ.',
  },
  4: {
    deepProfile:
      'Nhóm 4 cảm nhận sâu và muốn sống thật với những gì mình cảm. Khao khát có một bản sắc riêng khiến họ hướng tới cái đẹp, chiều sâu, những điều mang tính cá nhân, và thường thấy mình khác đám đông. Mặt tối là cảm giác thiếu một mảnh gì đó mà người khác dường như đang có: họ so sánh, tiếc nuối, rồi chìm vào tâm trạng. Khi ấy điều đang có bị lu mờ trước điều còn thiếu. Nhóm 4 lớn lên khi biết trân trọng cái bình thường mình đang nắm, và biến cảm xúc thành sản phẩm, thành kết nối, thay vì chỉ ở lại trong nó.',
    subtypeNotes:
      'Ở tự tồn (sp), nhóm 4 chịu đựng lặng lẽ, biến thiếu thốn thành sức bền hằng ngày. Ở xã hội (so), họ thấy mình lạc lõng giữa nhóm, vừa muốn thuộc về vừa muốn khác biệt. Ở thân mật (sx), cường độ cảm xúc dồn vào một quan hệ, khao khát được thấu hiểu tận cùng. Chỉ là nét gợi; trắc nghiệm ở đây chưa nói được bạn thuộc bản năng nào.',
    misidentifications:
      'Hay bị lẫn với nhóm 5 (và đôi khi nhóm 2). Nhóm 4 và nhóm 5 đều hướng nội, đời sống bên trong đậm, nhưng nhóm 4 lao vào cảm xúc để tìm bản sắc, còn nhóm 5 rút khỏi cảm xúc để giữ năng lượng và hiểu biết. Điểm phân biệt là quan hệ với cảm xúc, không phải vẻ trầm lặng.',
    growthPractices:
      'Mỗi sáng ghi ba điều bình thường mình đang có, để cân lại cái nhìn hay dừng ở chỗ thiếu. Khi tâm trạng kéo xuống, làm xong một việc nhỏ trước khi bàn tới cảm xúc. Và biến một cảm hứng thành sản phẩm hoàn chỉnh, dù nó chưa "hoàn hảo".',
  },
  5: {
    deepProfile:
      'Nhóm 5 quan sát trước khi nhập cuộc và cần nhiều thời gian một mình để nghĩ. Khao khát hiểu thấu và tự chủ khiến họ tích kiến thức như tích năng lượng, để không phải dựa vào ai. Đằng sau là nỗi sợ bị vắt cạn: đòi hỏi cảm xúc, thời gian, sự có mặt liên tục làm họ thấy đuối, nên họ rút về, giữ khoảng cách. Càng căng, họ càng thu mình và dè sẻn cả năng lượng lẫn cảm xúc. Chỗ trưởng thành của nhóm 5 là bước vào cuộc sống và chia sẻ điều mình biết, thay vì chỉ đứng ngoài nhìn và giữ cho riêng mình.',
    subtypeNotes:
      'Ở tự tồn (sp), nhóm 5 rút về không gian riêng, dè sẻn thời gian và nhu cầu tối thiểu. Ở xã hội (so), họ kết nối qua tri thức, quây quanh nhóm cùng mối quan tâm chuyên sâu. Ở thân mật (sx), họ chọn lọc gắt, chỉ mở lòng thật sâu với một vài người hiếm hoi. Đây là phác họa; bài ở đây tìm nhóm và cánh, không đo bản năng trội.',
    misidentifications:
      'Hay bị lẫn với nhóm 9 và nhóm 4. Nhóm 5 và nhóm 9 đều lặng, tách khỏi ồn ào, nhưng nhóm 5 tách để bảo toàn và phân tích, còn nhóm 9 lặng để né xáo trộn. Khác nhóm 4 ở chỗ nhóm 5 giữ khoảng cách với cảm xúc thay vì đắm vào. Phân biệt bằng lý do rút lui, không phải bản thân việc rút lui.',
    growthPractices:
      'Mỗi tuần một lần chia sẻ điều mình đang tìm hiểu, thay vì cất kỹ tới khi "đủ hiểu". Nhận lời một buổi gặp người thay vì tự nạp năng lượng một mình. Và thử nói cảm xúc ngay lúc nó đang xảy ra, không đợi phân tích xong mới nói.',
  },
  6: {
    deepProfile:
      'Nhóm 6 luôn lường trước điều có thể trục trặc để kịp chuẩn bị. Khao khát an toàn và một chỗ dựa đáng tin khiến họ trung thành, trách nhiệm, giữ lời tới cùng. Nhưng cái đầu hay chạy trước tới kịch bản xấu, nên họ dễ lo những chuyện chưa xảy ra và đi hỏi xin trấn an. Khi hoài nghi dâng cao, họ vừa muốn tin vừa nghi ngờ chính điều mình tin, do dự rồi có lúc phản ứng thái quá vì sợ. Nhóm 6 vững hơn khi tập tin vào phán đoán của chính mình, và tách nỗi lo tưởng tượng khỏi rủi ro có bằng chứng thật.',
    subtypeNotes:
      'Ở tự tồn (sp), nhóm 6 tìm an toàn qua chuẩn bị, dự phòng, giữ những gì chắc chắn. Ở xã hội (so), họ trung thành với nhóm, tổ chức, quy tắc như một chỗ dựa. Ở thân mật (sx), họ dựa vào một người tin cậy, đôi khi thử thách để chắc người đó đáng tin. Mới là nét gợi; bản năng trội không suy ra được từ trắc nghiệm ngắn.',
    misidentifications:
      'Hay bị lẫn với nhóm 1. Cả hai đều tận tâm, trách nhiệm, nhưng nhóm 1 làm vì muốn "đúng", còn nhóm 6 làm vì muốn "an toàn, có chỗ dựa". Hỏi động cơ: đang chỉnh cho đúng, hay đang phòng cho chắc?',
    growthPractices:
      'Mỗi ngày ra một quyết định nhỏ mà không hỏi xin trấn an. Khi lo, viết ra thành hai cột: "điều mình đang tưởng tượng" và "điều thật sự có bằng chứng". Và ghi lại những lần mình đã đoán đúng, để nhớ rằng phán đoán của mình đáng tin.',
  },
  7: {
    deepProfile:
      'Nhóm 7 hào hứng với ý tưởng mới và luôn có nhiều dự định phía trước. Khao khát một cuộc đời phong phú, tự do khiến họ nhanh nhẹn, lạc quan, giỏi nhìn ra khả năng. Nhưng phía dưới sự vui vẻ là một nỗi né tránh: khi buồn chán hay đau khổ ập đến, họ lập tức chuyển sang điều tích cực hơn, lên kế hoạch cho niềm vui kế tiếp. Vì thế họ dễ bỏ dở, nhảy việc khi vừa thấy nhạt, và ngại ngồi lại với cảm xúc khó. Nhóm 7 trọn vẹn hơn khi ở lại với hiện tại và đi tới cùng một việc, thay vì luôn chạy tới cái mới.',
    subtypeNotes:
      'Ở tự tồn (sp), nhóm 7 lo cho mình no đủ, gom cơ hội và nguồn vui thiết thực. Ở xã hội (so), họ là chất xúc tác của nhóm, kéo mọi người vào cuộc vui. Ở thân mật (sx), họ mê những trải nghiệm và người mang lại cường độ, ngại bị buộc chặt. Chỉ là phác họa; trắc nghiệm ở đây chưa tách được bản năng nào trội.',
    misidentifications:
      'Hay bị lẫn với nhóm 3 (và đôi khi nhóm 8). Nhóm 7 và nhóm 3 đều nhanh, lạc quan, nhiều việc, nhưng nhóm 7 muốn trải nghiệm phong phú và né đau, còn nhóm 3 muốn thành tựu được ghi nhận. Nhìn vào thứ họ đang đuổi theo: niềm vui và lựa chọn, hay kết quả và hình ảnh.',
    growthPractices:
      'Chọn một việc đang thấy chán và làm nốt tới hết trước khi bắt việc mới. Khi khó chịu, ngồi với nó vài phút thay vì lấp ngay bằng một kế hoạch vui. Và giữ lịch gọn lại, ưu tiên vài thứ làm cho sâu thay vì nhiều thứ chạm hời hợt.',
  },
  8: {
    deepProfile:
      'Nhóm 8 thẳng thắn, mạnh mẽ và sẵn sàng đứng ra khi cần quyết. Khao khát tự làm chủ đời mình khiến họ ghét bị kiểm soát, và bản năng che chở người yếu thế rất rõ. Nhưng bên dưới lớp vỏ cứng là một điều họ ít cho ai thấy: nỗi sợ bị tổn thương, bị phụ thuộc. Để không lộ ra mềm yếu, họ nắm quyền kiểm soát, nói to, đôi khi lấn át cả người mình thương. Càng căng, họ càng đề phòng và muốn nắm mọi thứ. Nhóm 8 lớn lên khi dám để lộ phần mềm và tin người khác mà không thấy như thế là bị đe doạ.',
    subtypeNotes:
      'Ở tự tồn (sp), nhóm 8 dồn sức bảo đảm nền tảng vật chất và sự tự chủ. Ở xã hội (so), họ đứng ra bảo vệ nhóm, thách thức bất công, nắm vai dẫn dắt. Ở thân mật (sx), họ gắn bó mãnh liệt, dốc toàn lực cho người và điều mình chọn. Đây là nét phác; bài rút gọn ở đây không đo bản năng trội.',
    misidentifications:
      'Hay bị lẫn với nhóm 3 và nhóm 1. Cả ba đều mạnh mẽ, quyết đoán, nhưng nhóm 8 muốn tự chủ và không bị kiểm soát; nhóm 3 muốn trông thành công; nhóm 1 muốn làm đúng. Hỏi động cơ đằng sau vẻ "gắt", đừng dừng ở vẻ ngoài quyết liệt.',
    growthPractices:
      'Nói ra một điều mình đang thấy khó với người thân, không bọc nó bằng vẻ cứng. Giao một việc cho người khác và để họ làm theo cách của họ. Và trước khi "đè" để giải quyết cho nhanh, hỏi một câu để nghe phía bên kia.',
  },
  9: {
    deepProfile:
      'Nhóm 9 coi trọng sự hoà hợp và có tài thấy được nhiều phía cùng lúc. Khao khát bình yên, cả bên trong lẫn với mọi người, khiến họ bao dung, kiên nhẫn, dễ chịu. Nhưng để giữ yên, họ hay gạt mong muốn của chính mình xuống: xuôi theo người khác, trì hoãn việc của mình, tránh những cuộc va chạm cần thiết. Lâu dần họ mờ nhạt đi ngay trong đời mình, và cơn giận bị nén lại rò ra thành sự lì. Nhóm 9 hiện diện trọn vẹn hơn khi dám nói ra mình muốn gì và làm việc quan trọng của mình trước, thay vì trôi theo.',
    subtypeNotes:
      'Ở tự tồn (sp), nhóm 9 tìm bình yên qua thói quen, tiện nghi, nhịp sống êm. Ở xã hội (so), họ hoà vào nhóm, làm cầu nối, ngại nổi bật. Ở thân mật (sx), họ hoà tan vào một người thân thiết, dễ đánh mất ranh giới của mình. Chỉ là phác họa; trắc nghiệm ở đây tìm nhóm và cánh, không đo bản năng trội.',
    misidentifications:
      'Hay bị lẫn với nhóm 2 và nhóm 5. Nhóm 9 và nhóm 2 đều để người khác lên trước, nhưng nhóm 9 hoà tan để giữ yên, còn nhóm 2 tiến tới để được cần. Nhóm 9 và nhóm 5 đều rút lui, nhưng nhóm 9 rút để tránh xung đột, còn nhóm 5 rút để giữ năng lượng. Phân biệt bằng động cơ rút lui.',
    growthPractices:
      'Mỗi ngày nói rõ một mong muốn của mình, dù nhỏ ("tôi muốn ăn món này"). Làm việc quan trọng nhất của mình trước khi trôi vào việc lặt vặt. Và khi định "cho qua" một bất đồng, thử nói ra một câu thay vì im.',
  },
};

export interface TypeRef {
  n: EnneagramType;
  slug: string;
  name: string;
}

export interface EnneagramTypeData {
  n: EnneagramType;
  meta: EnneagramTypeMeta;
  wingLeft: TypeRef;
  wingRight: TypeRef;
  growthArrow: TypeRef; // integration (an toàn / trưởng thành)
  stressArrow: TypeRef; // disintegration (căng thẳng)
  centerMates: TypeRef[]; // 2 nhóm còn lại cùng trung tâm
  others: TypeRef[]; // 8 nhóm còn lại
  workStyle: string;
  deepProfile: string; // chân dung sâu (TYPE_EXTRA)
  subtypeNotes: string; // nét qua ba bản năng (TYPE_EXTRA)
  misidentifications: string; // dễ nhận nhầm với nhóm nào (TYPE_EXTRA)
  growthPractices: string; // thực hành phát triển (TYPE_EXTRA)
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
}

const refOf = (n: EnneagramType): TypeRef => ({ n, slug: String(n), name: TYPE_META[n].name });

export const listTypes = (): TypeRef[] => ENNEAGRAM_TYPE_ORDER.map(refOf);

function toType(slug: string): EnneagramType | null {
  const n = Number(slug);
  return Number.isInteger(n) && ENNEAGRAM_TYPE_ORDER.includes(n as EnneagramType)
    ? (n as EnneagramType)
    : null;
}

export function buildType(slug: string): EnneagramTypeData | null {
  const n = toType(slug);
  if (!n) return null;

  const meta = TYPE_META[n];
  const [l, r] = WINGS[n];
  const integ = INTEGRATION[n];
  const disint = DISINTEGRATION[n];
  const group = CENTER_GROUPS.find((g) => g.includes(n)) ?? [];
  const centerMates = group.filter((t) => t !== n).map(refOf);
  const others = ENNEAGRAM_TYPE_ORDER.filter((t) => t !== n).map(refOf);
  const workStyle = WORK_STYLE[n];
  const extra = TYPE_EXTRA[n];

  const seoTitle = `Enneagram Nhóm ${n} — ${meta.name}`;
  const seoDescription = `Nhóm ${n} Enneagram (${meta.name}): khao khát, nỗi sợ cốt lõi, điểm mạnh, hướng phát triển, cánh và mũi tên phát triển. Mô tả xu hướng, không phán số mệnh.`;

  const faqs: { q: string; a: string }[] = [
    {
      q: `Enneagram nhóm ${n} — "${meta.name}" — là người thế nào?`,
      a: `Nhóm ${n} thuộc trung tâm ${meta.center}. ${meta.tagline} Động lực sâu nhất: ${meta.desire} Nỗi sợ nền tảng: ${meta.fear}`,
    },
    {
      q: `Điểm mạnh và điều nhóm ${n} cần lưu ý là gì?`,
      a: `Điểm mạnh nổi bật: ${meta.strengths} Hướng phát triển: ${meta.growth}`,
    },
    {
      q: `Cánh ${n}w${l} và ${n}w${r} khác nhau ra sao?`,
      a: `Mỗi người nhóm ${n} thường nghiêng về một trong hai nhóm liền kề trên vòng tròn. Cánh ${n}w${l} pha thêm nét của ${TYPE_META[l].name} (nhóm ${l}); cánh ${n}w${r} pha thêm nét của ${TYPE_META[r].name} (nhóm ${r}). Cùng là nhóm ${n} nhưng hai cánh tạo nên sắc thái khá khác nhau.`,
    },
    {
      q: `Khi căng thẳng hay khi phát triển, nhóm ${n} thay đổi thế nào?`,
      a: `Theo các "mũi tên" của Riso–Hudson: khi an toàn và trưởng thành, nhóm ${n} hấp thụ nét tốt của ${TYPE_META[integ].name} (nhóm ${integ}); khi căng thẳng, dễ ngả sang mặt kém của ${TYPE_META[disint].name} (nhóm ${disint}). Chính vì có hướng đi này mà Enneagram thiên về phát triển, không phải dán nhãn cố định.`,
    },
    {
      q: `Nhóm ${n} hợp với công việc nào?`,
      a: `${workStyle} Đây là xu hướng tham khảo theo khung Enneagram, không phải giới hạn — người nhóm ${n} vẫn thành công ở rất nhiều lĩnh vực.`,
    },
    {
      q: `Enneagram nhóm ${n} có chính xác không?`,
      a: `Enneagram là mô hình phát triển bản thân, không phải phép đo khoa học như xét nghiệm. Kết quả phản ánh xu hướng động lực để bạn tự soi, không phải lời phán số mệnh. Hãy xem nhóm ${n} như một góc nhìn — bạn vẫn là người quyết định mình trở thành ai.`,
    },
  ];

  return {
    n,
    meta,
    wingLeft: refOf(l),
    wingRight: refOf(r),
    growthArrow: refOf(integ),
    stressArrow: refOf(disint),
    centerMates,
    others,
    workStyle,
    deepProfile: extra.deepProfile,
    subtypeNotes: extra.subtypeNotes,
    misidentifications: extra.misidentifications,
    growthPractices: extra.growthPractices,
    seoTitle,
    seoDescription,
    faqs,
  };
}
