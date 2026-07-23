/**
 * Nội dung TRỌN VẸN của sách điện tử tặng: "Hiểu lá số của mình mà không mê tín".
 *
 * Một nguồn sự thật cho CẢ HAI bề mặt:
 *  - Trang đọc /tai-lieu/sach-hieu-la-so (đọc thẳng trên web, không cần email).
 *  - Bản PDF tải về qua <DownloadToolPdfButton> (cổng email → /email/subscribe).
 *
 * Nguyên tắc viết (bám giọng sản phẩm):
 *  - Người đọc mục tiêu: người lớn tuổi, không quen thuật ngữ. Câu ngắn, chữ
 *    thường ngày, mỗi ý có ví dụ cụ thể.
 *  - Nói rõ căn cứ: phần nào là phép tính lịch pháp (kiểm chứng được), phần nào
 *    là quy ước/diễn giải (tham khảo).
 *  - Không hù doạ, không hứa quá, không dùng chữ "định mệnh"/"bói".
 *  - Độ dài nhắm ~15–20 phút đọc (≈4.000 chữ).
 */

export interface EbookSection {
  /** Số chương hiển thị, vd "Chương 1". */
  label: string;
  heading: string;
  /** Mỗi phần tử là một đoạn văn. */
  paragraphs: string[];
}

export const EBOOK_TITLE = 'Hiểu lá số của mình mà không mê tín';
export const EBOOK_SUBTITLE =
  'Cuốn sách nhỏ dành cho người muốn xem lá số một cách tỉnh táo — đọc trong khoảng 15–20 phút';
export const EBOOK_READ_MINUTES = 18;

export const EBOOK_INTRO: string[] = [
  'Cuốn sách nhỏ này viết cho một người cụ thể: người đã từng đi xem một lần, nghe xong thấy vừa hay vừa ngờ ngợ, về nhà không biết nên tin bao nhiêu phần.',
  'Tôi không viết để thuyết phục bạn rằng tử vi đúng. Tôi cũng không viết để chứng minh nó sai. Tôi viết để bạn có một cách đọc lá số mà sau đó bạn vẫn là người cầm quyết định, chứ không phải một người ngồi chờ điều gì sẽ tới.',
  'Bạn không cần biết trước gì cả. Không cần thuộc tên sao, không cần nhớ can chi. Chỗ nào cần thuật ngữ, tôi sẽ giải thích bằng lời thường ngay tại chỗ.',
];

export const EBOOK_SECTIONS: EbookSection[] = [
  {
    label: 'Chương 1',
    heading: 'Lá số là gì, nói cho gọn',
    paragraphs: [
      'Lá số là một tờ giấy ghi lại vị trí của thời gian bạn sinh ra. Ngày, giờ, tháng, năm sinh của bạn được đổi sang cách ghi thời gian của người xưa, rồi sắp lên một khung có sẵn. Khung đó chia làm 12 ô, mỗi ô ứng với một mặt của đời sống: chuyện tiền bạc, chuyện gia đình, chuyện công việc, chuyện sức khoẻ, và vài mặt khác.',
      'Phần lập ra tờ giấy đó là phép tính. Nó giống như đổi từ ki-lô-gam sang cân, hay đổi từ giờ Việt Nam sang giờ Nhật. Ai tính cũng ra một kết quả, không phụ thuộc vào việc người tính có thiện cảm với bạn hay không. Nếu hai người tính ra hai lá số khác nhau từ cùng một ngày giờ sinh, thì chắc chắn có một người tính sai — không phải "trường phái khác nhau".',
      'Phần diễn giải tờ giấy đó thì khác hẳn. Đó là chỗ người ta đọc ý nghĩa: ô này mạnh thì con người bạn ra sao, ô kia có sao xấu thì nên cẩn thận điều gì. Phần này là quy ước do nhiều đời truyền lại, có sách chép thế này, có sách chép thế kia. Nó không phải phép đo. Nó là một cách nhìn.',
      'Nhớ kỹ ranh giới này thôi là bạn đã tránh được phần lớn rắc rối. Khi ai đó nói "lá số của cô có sao Thiên Cơ ở cung Mệnh", đó là phần tính, kiểm tra được. Khi người đó nói tiếp "nên năm nay cô phải cúng giải hạn", đó là phần diễn giải, và là diễn giải của riêng người đó.',
    ],
  },
  {
    label: 'Chương 2',
    heading: 'Vì sao lời nào nghe cũng thấy đúng',
    paragraphs: [
      'Có một chuyện đã được thử nghiệm rất nhiều lần ở nhiều nước. Người ta đưa cho một nhóm đông người cùng MỘT bản mô tả tính cách, nói với mỗi người rằng đây là bản riêng của họ. Phần lớn đọc xong đều gật đầu: đúng quá, sao mà đúng thế.',
      'Bản mô tả đó viết bằng những câu như: "Bên ngoài bạn tỏ ra vững vàng nhưng bên trong đôi lúc lo lắng." "Bạn có những khả năng chưa dùng hết." "Có lúc bạn rất hoà đồng, có lúc lại muốn ở một mình."',
      'Đọc lại ba câu trên mà xem. Chúng đúng với hầu như tất cả mọi người. Ai mà chẳng có lúc lo, ai mà chẳng có phần chưa dùng tới, ai mà chẳng có hôm muốn yên tĩnh. Câu càng chung chung thì càng dễ đúng, và cảm giác "đúng quá" đó không chứng minh được điều gì về lá số cả.',
      'Cách tự kiểm rất đơn giản: đọc một lời nhận xét về mình, rồi thử hỏi "câu này có đúng với ba người hàng xóm của tôi không?". Nếu đúng với cả ba, thì đó là câu nói về con người nói chung, không phải nói về bạn. Một lời đáng giá phải là lời mà nếu đem sang người khác thì sai.',
      'Ví dụ cho dễ hình dung. Câu "bà là người sống tình cảm, hay nghĩ cho người khác" gần như đúng với mọi bà mẹ. Còn câu "bà thường quyết định nhanh, và những lần bà hối tiếc phần lớn là lúc quyết trong khi đang mệt" thì cụ thể hơn hẳn — nó có thể sai, và chính vì có thể sai nên nó mới đáng để đối chiếu.',
    ],
  },
  {
    label: 'Chương 3',
    heading: 'Ba câu hỏi nên hỏi trước khi tin một lời nào đó',
    paragraphs: [
      'Câu thứ nhất: căn cứ ở đâu? Người nói phải chỉ được ra chỗ dựa: ô nào trên lá số, sao nào, giai đoạn nào. Nếu chỉ nghe "tôi nhìn là biết" thì đó là cảm nhận của người ta, không phải điều rút ra từ lá số của bạn. Cảm nhận không có gì xấu, nhưng đừng nhầm nó với căn cứ.',
      'Câu thứ hai: lời này có thể sai không? Một lời nhận xét tử tế phải có khả năng bị bác. "Năm nay bà nên giữ tiền, tránh cho vay khoản lớn" là lời có thể đối chiếu sau một năm. "Năm nay vận bà chuyển" thì chuyển kiểu gì cũng đúng, nên nó chẳng nói gì.',
      'Câu thứ ba: nghe xong tôi làm gì được? Lời nào dẫn tới một việc bạn tự làm được thì có ích. Lời nào chỉ dẫn tới việc phải trả thêm tiền cho người nói thì bạn nên dừng lại một nhịp.',
      'Ba câu này không dành riêng cho tử vi. Bạn dùng chúng khi nghe tư vấn bảo hiểm, nghe quảng cáo thuốc bổ, nghe con cháu bàn chuyện đầu tư cũng được. Chúng chỉ là thói quen hỏi lại trước khi gật đầu.',
    ],
  },
  {
    label: 'Chương 4',
    heading: 'Đối chiếu với quá khứ, không đoán tương lai',
    paragraphs: [
      'Đây là phần tôi cho là quan trọng nhất trong cả cuốn sách.',
      'Cách dùng lá số an toàn nhất không phải là hỏi "sang năm tôi thế nào", mà là nhìn ngược lại: những năm đã qua, lá số ghi gì, và đời thật của tôi diễn ra ra sao.',
      'Bạn lấy giấy bút, viết ra ba việc lớn đã xảy ra trong đời mình và năm xảy ra. Đổi việc, chuyển nhà, cưới xin, một năm ốm đau, một năm làm ăn khấm khá. Rồi xem lá số nói gì về đúng những năm đó.',
      'Sẽ có chỗ khớp. Bạn sẽ thấy hơi lạnh sống lưng. Nhưng đừng dừng ở đó — hãy đếm cả chỗ KHÔNG khớp. Có năm lá số ghi là năm sóng gió mà bạn sống rất yên. Có năm lá số ghi thuận mà bạn lại mất mát. Những chỗ trật đó mới là thứ cho bạn biết nên tin ở mức nào.',
      'Người xem chỉ khoe chỗ khớp và im lặng về chỗ trật thì bạn đang nghe một bài bán hàng, không phải một bài đối chiếu. Ở hieu.asia chúng tôi làm ngược lại: có một phần tên là Bằng Chứng, nơi bạn nhập một việc đã xảy ra và hệ thống cho bạn xem lá số năm đó ghi gì, kể cả khi nó không khớp.',
      'Vì sao phải làm vậy? Vì tương lai thì chưa ai kiểm được, còn quá khứ thì bạn kiểm được ngay hôm nay. Ai muốn bạn tin về tương lai thì trước hết phải chịu được bài kiểm tra về quá khứ.',
    ],
  },
  {
    label: 'Chương 5',
    heading: 'Xem tuổi, xem ngày, xem hướng — hiểu cho đúng',
    paragraphs: [
      'Người Việt mình hay xem ngày cưới, xem tuổi làm nhà, xem tuổi xông đất, xem hướng bàn thờ. Những việc này có nên làm không?',
      'Tôi nghĩ là nên, nhưng nên hiểu đúng nó là gì. Đó là phong tục. Phong tục có giá trị thật: nó làm cả nhà cùng bàn bạc, cùng chuẩn bị, cùng thấy trọng việc mình sắp làm. Một đám cưới được chọn ngày cẩn thận thì cả nhà đều thấy an tâm hơn, và sự an tâm đó là có thật.',
      'Cái không nên là biến phong tục thành nỗi sợ. Không có chuyện mời sai tuổi xông đất thì xui cả năm. Không có chuyện làm nhà lệch một tháng thì hỏng cả đời. Khi ai đó nói với bạn kiểu đó, để rồi đề nghị bán cho bạn một lễ giải, thì thứ đang được bán là nỗi sợ chứ không phải kiến thức.',
      'Cách dùng lành mạnh: xem ngày để chọn trong vài phương án đều tiện cho gia đình. Nếu ngày "đẹp nhất" lại là ngày con cháu không về được, thì chọn ngày con cháu về được. Người đến dự đông đủ quan trọng hơn con số trên tờ lịch.',
      'Một điều kỹ thuật nhỏ nhưng hay bị nhầm: tuổi trong các bảng tra này tính theo năm âm lịch. Người sinh tháng 1 hoặc đầu tháng 2 dương lịch, tức là trước Tết, thì thuộc năm âm liền trước. Nhiều người tra nhầm chỗ này rồi lo lắng vô ích.',
    ],
  },
  {
    label: 'Chương 6',
    heading: 'Lá số nói được gì và không nói được gì',
    paragraphs: [
      'Lá số nói được về xu hướng. Chẳng hạn: người này thiên về suy nghĩ kỹ rồi mới làm, người kia thiên về làm rồi sửa. Người này hợp việc cần bền, người kia hợp việc cần nhanh. Xu hướng là thứ có ích, vì biết xu hướng của mình thì biết mình dễ hỏng ở đâu.',
      'Lá số không nói được về sự việc cụ thể. Nó không cho biết bạn sẽ trúng số bao nhiêu, con bạn thi trường nào, hay bệnh của bạn là bệnh gì. Ai nói được những thứ đó từ lá số thì họ đang đoán, và bạn nên biết là họ đang đoán.',
      'Lá số cũng không thay được bác sĩ, luật sư, kế toán. Đau ngực thì đi khám. Tranh chấp đất thì hỏi luật. Không có ô nào trên lá số chữa được bệnh tim.',
      'Còn một giới hạn nữa ít người nói: giờ sinh. Nhiều người lớn tuổi không nhớ chính xác giờ mình ra đời, giấy tờ cũ cũng có khi ghi giờ hành chính chứ không phải giờ thật. Giờ sinh lệch thì một phần lá số lệch theo. Trường hợp đó thì nên xem phần nào phụ thuộc vào giờ, phần nào không, và giảm mức tin ở phần phụ thuộc giờ. Một người đọc tử tế sẽ nói với bạn điều này ngay từ đầu.',
    ],
  },
  {
    label: 'Chương 7',
    heading: 'Cách dùng lá số cho một quyết định thật',
    paragraphs: [
      'Giả sử bạn đang phân vân: có nên nghỉ việc hiện tại để làm việc khác không. Đây là cách tôi đề nghị.',
      'Bước một, viết câu hỏi cho thật cụ thể. Không phải "đời tôi sẽ ra sao" mà là "trong sáu tháng tới, tôi nên ở lại hay chuyển".',
      'Bước hai, viết ra những gì bạn đã biết mà không cần lá số: thu nhập hiện tại, khoản để dành, sức khoẻ, ý kiến của người nhà. Phần này thường quyết định phần lớn câu trả lời, và nó chẳng liên quan gì tới sao với cung.',
      'Bước ba, giờ mới xem lá số, và chỉ xem để trả lời một câu: xu hướng của tôi khiến tôi dễ sai ở chỗ nào trong loại quyết định này. Nếu lá số cho thấy bạn thuộc kiểu quyết nhanh, thì rủi ro của bạn là chuyển vội. Nếu bạn thuộc kiểu cân nhắc mãi, thì rủi ro của bạn là để lỡ.',
      'Bước bốn, đặt một mốc kiểm tra. Ví dụ: "đến cuối tháng 9 mà chưa có nơi nào nhận thì tôi ở lại thêm một năm". Có mốc thì bạn hết phải nghĩ lại mỗi đêm.',
      'Bạn để ý là lá số ở đây không quyết hộ bạn. Nó chỉ soi vào điểm mù. Đó là toàn bộ công dụng lành mạnh của nó.',
    ],
  },
  {
    label: 'Chương 8',
    heading: 'Dấu hiệu nhận ra chỗ xem không đàng hoàng',
    paragraphs: [
      'Thứ nhất, doạ trước rồi bán sau. Nghe xong thấy sợ, và cách hết sợ là trả tiền. Đây là dấu hiệu rõ nhất.',
      'Thứ hai, nói chắc như đinh đóng cột về những chuyện không ai biết chắc. Ngày nào, số tiền bao nhiêu, người nào. Sự chắc chắn quá mức là dấu hiệu của bán hàng, không phải của hiểu biết.',
      'Thứ ba, không cho bạn giữ lại gì. Nói miệng một buổi, về nhà quên gần hết, muốn xem lại thì phải đến lần nữa.',
      'Thứ tư, không chịu nói mình dựa vào đâu. Hỏi "vì sao thầy nói vậy" mà bị gạt đi, thì đó là chỗ không nên quay lại.',
      'Thứ năm, số tiền cứ lớn dần. Lần đầu vài trăm, lần sau vài triệu cho một lễ giải. Nếu bạn thấy mình đang đi trên con đường đó, hãy dừng và kể cho một người thân nghe. Nói ra với người ngoài cuộc thường đủ để tỉnh lại.',
    ],
  },
  {
    label: 'Chương 9',
    heading: 'Nếu bạn muốn tự xem lá số của mình',
    paragraphs: [
      'Bạn cần đúng ba thứ: ngày sinh, giờ sinh (biết áng chừng cũng được, nhưng phải biết là mình chỉ áng chừng), và nơi sinh.',
      'Có lá số rồi thì đọc theo thứ tự này cho đỡ rối. Trước hết xem ô Mệnh — đây là ô nói về tính cách chung. Sau đó xem một ô ứng với việc bạn đang quan tâm, ví dụ đang lo chuyện làm ăn thì xem ô Tài, đang lo chuyện con cái thì xem ô Tử. Đừng đọc cả 12 ô một lượt, đọc thế chỉ rối thêm.',
      'Với mỗi điều đọc được, làm bài kiểm ba câu ở Chương 3: căn cứ ở đâu, có thể sai không, tôi làm gì được. Ghi lại những câu vượt qua được cả ba. Bỏ qua phần còn lại, không tiếc.',
      'Rồi làm bài đối chiếu quá khứ ở Chương 4. Sau bước này bạn sẽ có một con số trong đầu — kiểu như "cái này đúng chừng sáu phần mười với tôi". Con số đó chính là mức tin hợp lý của riêng bạn, và nó đáng giá hơn bất cứ lời quả quyết nào của người khác.',
      'Trên hieu.asia, việc lập lá số là miễn phí và không cần tài khoản. Hệ thống tính theo lịch tiết khí và phép an sao truyền thống, và ở mỗi kết luận quan trọng đều có chỗ để bạn xem căn cứ. Bạn xem lá số đầy đủ trước; phần đọc sâu là phần trả tiền, nhưng bạn quyết sau khi đã thấy lá số của mình.',
    ],
  },
];

export const EBOOK_CLOSING: string[] = [
  'Nếu bạn chỉ nhớ được một câu từ cuốn sách này, tôi mong đó là câu này: lá số là tấm bản đồ, không phải cuốn kịch bản.',
  'Bản đồ cho bạn biết chỗ nào dốc, chỗ nào có sông. Nó không quyết định bạn đi đâu, và nó không đi thay bạn. Người cầm bản đồ vẫn phải tự bước.',
  'Chúc bạn xem lá số của mình một cách nhẹ nhàng, và giữ được sự tỉnh táo mà bạn vốn đã có.',
];

/** Câu nhắc giới hạn — bắt buộc hiện ở cả trang đọc lẫn bản PDF. */
export const EBOOK_DISCLAIMER =
  'Cuốn sách này trình bày cách đọc lá số theo tập tục và cổ thư Á Đông, để tham khảo. Phần lập lá số là phép tính lịch pháp, kiểm chứng được; phần luận giải là quy ước truyền lại, không phải điều chắc chắn. Sách không thay thế ý kiến của bác sĩ, luật sư hay chuyên gia tài chính.';
