/**
 * Nội dung tài liệu tặng "Bộ 3 câu hỏi giúp bạn tự soi mình".
 *
 * Một nguồn sự thật cho trang đọc /tai-lieu/ba-cau-hoi và bản PDF tải về.
 * Đây là khung TỰ SOI — không bói, không phán. Mỗi câu hỏi có: vì sao hỏi,
 * cách trả lời cho ra chuyện, và một ví dụ đã điền sẵn để người đọc bắt chước.
 */

export interface SelfQuestion {
  no: number;
  question: string;
  /** Vì sao câu này đáng hỏi. */
  why: string;
  /** Cách trả lời để câu trả lời có ích, từng bước. */
  how: string[];
  /** Ví dụ đã điền — cho người chưa quen viết ra. */
  example: string;
  /** Cạm bẫy hay gặp khi trả lời câu này. */
  trap: string;
}

export const BA_CAU_HOI_TITLE = 'Bộ 3 câu hỏi giúp bạn tự soi mình';
export const BA_CAU_HOI_SUBTITLE =
  'Khung tự soi trước một quyết định lớn — làm trong 20 phút, không cần biết gì về tử vi';

export const BA_CAU_HOI_INTRO: string[] = [
  'Ba câu hỏi dưới đây không dự đoán điều gì. Chúng chỉ giúp bạn nhìn rõ thứ mình đang có sẵn trong đầu mà chưa gọi tên ra được.',
  'Hãy lấy giấy bút, hoặc mở ghi chú trong điện thoại. Viết ra thật sự, đừng chỉ nghĩ trong đầu — viết ra là nửa phần công dụng của bài này.',
  'Làm cho một quyết định cụ thể bạn đang phân vân: cưới hay chưa cưới, sinh con thời điểm này hay đợi, đổi việc hay ở lại, bán nhà hay giữ.',
];

export const BA_CAU_HOI: SelfQuestion[] = [
  {
    no: 1,
    question: 'Nếu không ai biết tôi chọn gì, tôi sẽ chọn gì?',
    why: 'Phần lớn quyết định khó không khó vì thiếu thông tin, mà khó vì có người đang nhìn. Bỏ người nhìn ra khỏi bức tranh thì câu trả lời thường hiện ra rất nhanh, và nó cho bạn biết bạn thật sự muốn gì.',
    how: [
      'Viết ra phương án bạn sẽ chọn nếu không phải giải thích với bất kỳ ai.',
      'Viết ra tên những người mà ý kiến của họ đang đè lên bạn: cha mẹ, vợ chồng, đồng nghiệp, hàng xóm.',
      'Với từng người, viết một câu: điều tôi sợ họ nghĩ là gì.',
      'Đọc lại. Khoanh tròn nỗi sợ nào thật sự đáng cân nhắc, gạch bỏ nỗi sợ nào chỉ là sợ bị bàn tán.',
    ],
    example:
      'Tôi sẽ nhận việc mới, lương thấp hơn hai triệu nhưng gần nhà. Người đang đè lên tôi là mẹ — tôi sợ mẹ nói tôi thụt lùi. Nhưng mẹ không phải người ngồi xe hai tiếng mỗi ngày.',
    trap: 'Trả lời "tôi cũng không biết". Đó thường là cách né. Cứ chọn đại một phương án rồi xem trong người thấy nhẹ hay thấy nặng — phản ứng đó là câu trả lời.',
  },
  {
    no: 2,
    question: 'Lần trước tôi quyết sai, lúc đó tôi đang ở trong trạng thái nào?',
    why: 'Người ta ít khi sai vì ngu. Người ta sai vì quyết vào lúc mệt, lúc đang giận, lúc vừa bị chê, hoặc lúc đang muốn chứng minh điều gì đó. Trạng thái lặp lại thì sai lầm cũng lặp lại.',
    how: [
      'Nhớ lại hai hoặc ba quyết định bạn tiếc nhất. Ghi năm xảy ra.',
      'Với mỗi lần, ghi: hôm đó tôi đang mệt hay khoẻ, đang một mình hay bị thúc, đang muốn được gì.',
      'Tìm điểm chung giữa các lần đó. Gần như luôn có một điểm chung.',
      'Viết một câu duy nhất: "Tôi không nên quyết việc lớn khi tôi đang ___".',
    ],
    example:
      'Năm 2019 tôi hùn vốn hỏng, năm 2022 tôi mua xe vội. Cả hai lần tôi đều vừa bị chê là nhát và muốn chứng minh ngược lại. Tôi không nên quyết việc lớn khi tôi đang muốn chứng minh với ai đó.',
    trap: 'Đổ lỗi cho hoàn cảnh bên ngoài ("tại thị trường xuống"). Hoàn cảnh thì lần sau lại khác; trạng thái của bạn thì lần sau vẫn thế. Chỉ trạng thái mới học được.',
  },
  {
    no: 3,
    question: 'Một năm nữa nhìn lại, điều gì khiến tôi tiếc hơn: đã làm, hay đã không làm?',
    why: 'Câu này kéo bạn ra khỏi nỗi lo trước mắt và đặt vào chỗ bạn thật sự sẽ đứng. Nó cũng lộ ra thứ chi phí mà người ta hay quên: chi phí của việc không làm gì cả.',
    how: [
      'Tưởng tượng bạn đã chọn phương án A. Viết ba dòng về cuộc sống của bạn sau một năm.',
      'Làm lại với phương án B.',
      'Đọc hai đoạn đó, xem đoạn nào khiến bạn thấy nặng ngực hơn.',
      'Viết ra mốc kiểm tra: "Đến ngày ___ mà chưa có ___ thì tôi chuyển sang phương án còn lại."',
    ],
    example:
      'Nếu tôi không mở quán, một năm nữa tôi vẫn đi làm như cũ và vẫn nghĩ về nó — cái đó tôi tiếc hơn. Mốc kiểm tra: đến 30/6 mà chưa gom đủ vốn ban đầu thì tôi hoãn sang năm, không vay nóng.',
    trap: 'Chỉ tưởng tượng phương án mình thích. Phải viết cả hai, và viết bằng chữ, không nghĩ suông — nghĩ suông thì phương án nào cũng thành màu hồng hoặc màu xám tuỳ tâm trạng lúc đó.',
  },
];

export const BA_CAU_HOI_AFTER: string[] = [
  'Làm xong ba câu, bạn sẽ có trong tay ba thứ: phương án bạn thật sự muốn, trạng thái khiến bạn hay quyết sai, và một mốc kiểm tra cụ thể.',
  'Ba thứ đó đủ để ra quyết định. Lá số, nếu bạn có xem, chỉ thêm được một lớp nữa: xu hướng tự nhiên của bạn nghiêng về đâu, và vì thế bạn dễ hụt ở chỗ nào. Nó bổ sung, không thay thế.',
  'Nếu bạn muốn thử lớp đó, việc lập lá số trên hieu.asia là miễn phí và không cần tài khoản.',
];

export const BA_CAU_HOI_DISCLAIMER =
  'Đây là khung tự soi, không phải tư vấn tâm lý, y tế hay tài chính. Nếu bạn đang trong giai đoạn quá căng thẳng hoặc quyết định liên quan tới sức khoẻ, tiền bạc lớn, hãy trao đổi thêm với người có chuyên môn.';
