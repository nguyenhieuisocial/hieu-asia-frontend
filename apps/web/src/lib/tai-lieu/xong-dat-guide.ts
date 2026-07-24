/**
 * Phần chữ CỐ ĐỊNH của tài liệu tặng "Tuổi xông đất Tết Đinh Mùi 2027".
 *
 * Tách khỏi component để trang đọc (server) và payload PDF (client) dùng chung
 * một nguồn — hai bản không lệch nhau. Phần SỐ LIỆU (tuổi hợp, nhóm nên cân
 * nhắc) không nằm ở đây: nó tính từ engine `lib/xong-dat.ts` theo tuổi gia chủ.
 */

export interface GuideStep {
  heading: string;
  body: string;
}

export const HOW_TO_CHOOSE: readonly GuideStep[] = [
  {
    heading: 'Bước 1 — Chọn người trước, chọn tuổi sau',
    body: 'Người xông đất là người đầu tiên bước vào nhà bạn sau giao thừa. Theo lệ, nên là người vui vẻ, hoà nhã, gia đình êm ấm, năm vừa rồi làm ăn thuận và thật lòng quý gia đình bạn. Đây là phần quan trọng nhất và nó không nằm trong bảng tra nào cả. Chọn được người như vậy rồi mới xét tới tuổi.',
  },
  {
    heading: 'Bước 2 — Xét tuổi so với chi của năm',
    body: 'Tết 2027 là năm Đinh Mùi, chi năm là Mùi. Người có tuổi thuộc nhóm tam hợp hoặc lục hợp với chi Mùi được xem là thuận. Người có tuổi xung với chi năm, hoặc trùng đúng tuổi Mùi (dân gian gọi là phạm Thái Tuế), thì theo lệ thường để dành cho dịp khác.',
  },
  {
    heading: 'Bước 3 — Xét tuổi so với tuổi gia chủ',
    body: 'Gia chủ ở đây là người đứng tên nhà hoặc người lớn nhất trong nhà. Người xông đất hợp với tuổi gia chủ theo tam hợp hoặc lục hợp thì được chuộng hơn; xung với tuổi gia chủ thì theo lệ nên tránh.',
  },
  {
    heading: 'Bước 4 — Xét mệnh ngũ hành',
    body: 'Mỗi năm sinh ứng với một mệnh nạp âm (Kim, Mộc, Thuỷ, Hoả, Thổ). Trường hợp được chuộng nhất là mệnh của khách tương sinh cho mệnh gia chủ, theo cách nói xưa là khách "tiếp khí" cho nhà. Trường hợp thường được tránh là mệnh khách khắc mệnh gia chủ.',
  },
  {
    heading: 'Bước 5 — Chốt lại bằng lẽ thường',
    body: 'Nếu người hợp tuổi nhất lại là người bạn không thân, hoặc ở xa không sang được, thì chọn người khác. Một người quen thân, đến sớm, cười nói vui vẻ vẫn hơn một cái tên đẹp trên bảng tra mà cả nhà đều gượng gạo.',
  },
] as const;

export const DO_AND_DONT: readonly { heading: string; items: readonly string[] }[] = [
  {
    heading: 'Ba việc nên làm',
    items: [
      'Hẹn trước với người bạn muốn mời, nói rõ giờ, để họ chủ động và không ai vào nhà trước.',
      'Dặn người nhà đi chơi giao thừa về sau khi khách đã tới — hoặc để chính người nhà xông đất, điều này hoàn toàn được, không kiêng gì.',
      'Chuẩn bị sẵn phong bao mừng tuổi và một lời chúc thật lòng. Không khí là thứ người ta nhớ, không phải con số tuổi.',
    ],
  },
  {
    heading: 'Ba việc không cần làm',
    items: [
      'Không cần mua lễ giải hạn vì lỡ mời sai tuổi. Không có căn cứ nào cho việc đó, và đây là chỗ người ta hay bán nỗi sợ.',
      'Không cần từ chối hay đuổi khách đã trót vào nhà. Xử sự như vậy làm hỏng tình thân, mà cái mất đó thì có thật.',
      'Không cần đi tìm thầy để xem lại cho chắc nếu bảng tra đã cho bạn vài phương án. Cách chấm ở đây công khai, bạn tự đối chiếu được.',
    ],
  },
] as const;

export const XONG_DAT_DISCLAIMER =
  'Đây là gợi ý theo quan niệm Can Chi và ngũ hành, để THAM KHẢO. Cách chấm được nêu công khai và nhập cùng dữ liệu thì luôn ra cùng kết quả — nhưng bản thân các quy tắc này là tập tục truyền lại, không phải điều chắc chắn. Không có chuyện mời sai tuổi thì xui cả năm. Lưu ý kỹ thuật: tuổi tính theo NĂM ÂM LỊCH, người sinh tháng 1–2 dương lịch (trước Tết) thuộc năm âm liền trước.';

/** Mùng 1 Tết Đinh Mùi — khớp app/xong-dat/years.ts và app/tu-vi-2027. */
export const TET_2027_MUNG_1 = '06/02/2027';
