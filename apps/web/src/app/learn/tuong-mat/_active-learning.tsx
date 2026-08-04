/**
 * Nội dung "học chủ động" cho trang /learn/tuong-mat — bài PHỤ của công cụ
 * /xem-tuong, chỉ nói về tướng MẶT. Bài chính của công cụ là /learn/palm.
 *
 * GROUNDING — nguồn duy nhất là app/xem-tuong/page.tsx ('use client', chỉ export
 * default component nên các hằng số KHÔNG import được → đọc mã rồi thuật lại). Công cụ THẬT SỰ:
 * nhận MỘT tấm ảnh + giới tính (ô ghi rõ "không bắt buộc"), không ngày/giờ sinh,
 * không tên; resizeToDataUrl(file, maxPx = 1024, quality = 0.8) nén ảnh NGAY
 * TRÊN MÁY người dùng; POST {image_url, kind, gender} tới /tools/vision-read;
 * đáp trả có đúng một trường nội dung `reading` — chuỗi Markdown render bằng
 * <ReactMarkdown>. KHÔNG điểm số, KHÔNG bảng, KHÔNG phép đo nào trong frontend.
 * Prompt nằm ở worker backend (repo khác) → chỉ khẳng định phần kiểm được: đầu
 * vào và DẠNG đầu ra. Trang tự nói: ảnh "không được lưu trữ"; "không phải khoa
 * học được kiểm chứng"; "tướng tự tâm sinh"; không chẩn đoán sức khoẻ/tâm lý,
 * không đoán tương lai; chỉ gửi ảnh của mình hoặc ảnh người khác khi được đồng ý.
 * Riêng câu "không được lưu trữ" đã kiểm tận nơi ở handler /tools/vision-read
 * bên repo backend (2026-08): ảnh chỉ chuyển tiếp cho mô hình, không ghi R2/KV/DB
 * — xem chú thích dài đầu ./page.tsx. Đừng hạ nó xuống thành "cam kết".
 *
 * CÔNG CỤ KHÔNG TÍNH tam đình / ngũ quan / thập nhị cung — ba khung đó dạy ở đây
 * như DI SẢN VĂN HOÁ và bài nói thẳng là công cụ không tính chúng.
 *
 * PHẠM VI: chỉ tay → /learn/palm; Barnum → /learn/barnum; kiểm chứng dự đoán →
 * /learn/kiem-chung. Giọng: di sản văn hoá + bài tập quan sát, KHÔNG phải công
 * cụ đánh giá người; trung thực về bằng chứng, không hù doạ, không phán số mệnh.
 */

import * as React from 'react';
import { LearnFrame } from '@/components/learn/active/LearnFrame';
import { DepthTabs } from '@/components/learn/active/DepthTabs';
import { FiveWhys } from '@/components/learn/active/FiveWhys';
import { ActiveRecall, type RecallQuestion } from '@/components/learn/active/ActiveRecall';
import {
  UnderstandingChecklist,
  type UnderstandingFacet,
} from '@/components/learn/active/UnderstandingChecklist';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Hằng số đọc từ mã công cụ ────────────────────────────────────────
// Tham số mặc định của resizeToDataUrl() trong app/xem-tuong/page.tsx. Hàm nằm
// trong 'use client' page và KHÔNG export → chép kèm nguồn là cách trung thực nhất.
export const RESIZE_MAX_PX = 1024;
/** Nhãn HIỂN THỊ mức nén JPEG. Dấu PHẨY kiểu Việt — dấu chấm bị đọc là phân cách nghìn. */
export const JPEG_QUALITY_LABEL = '0,8';

// ── Hệ hình tượng của nhân tướng khuôn mặt (DI SẢN, không phải phép tính) ──
// Canon dân gian — cách chia phổ biến trong các bản in (các bản có xê dịch vị
// trí và tên gọi). Công cụ /xem-tuong KHÔNG tính bảng nào dưới đây. Định nghĩa
// MỘT lần tại đây, page.tsx import về render bảng VÀ lấy số lượng → số nói trong
// bài không bao giờ lệch với số dòng trong bảng.

export const TAM_DINH: readonly { ten: string; vung: string; gan: string }[] = [
  { ten: 'Thượng đình', vung: 'Từ chân tóc xuống tới ấn đường (khoảng giữa hai đầu lông mày)', gan: 'Quãng đầu đời — thời được nuôi dạy, học hành' },
  { ten: 'Trung đình', vung: 'Từ ấn đường xuống tới chuẩn đầu (đầu mũi)', gan: 'Quãng giữa — thời tự lập, làm việc' },
  { ten: 'Hạ đình', vung: 'Từ nhân trung xuống tới cằm', gan: 'Quãng sau — thời an cư, con cháu' },
];

export const NGU_QUAN: readonly { bo: string; ten: string; nghia: string }[] = [
  { bo: 'Tai', ten: 'Thái thính quan', nghia: 'cơ quan nghe — quan sát việc tiếp nhận' },
  { bo: 'Lông mày', ten: 'Bảo thọ quan', nghia: 'cơ quan giữ gìn — quan sát nền tính khí' },
  { bo: 'Mắt', ten: 'Giám sát quan', nghia: 'cơ quan trông coi — quan sát sự tỉnh táo' },
  { bo: 'Mũi', ten: 'Thẩm biện quan', nghia: 'cơ quan phân định — quan sát cách giữ và chi' },
  { bo: 'Miệng', ten: 'Xuất nạp quan', nghia: 'cơ quan ra vào — quan sát lời nói, ăn uống' },
];

export const THAP_NHI_CUNG: readonly { ten: string; viTri: string; viec: string }[] = [
  { ten: 'Mệnh cung', viTri: 'Ấn đường — khoảng giữa hai đầu lông mày', viec: 'Nền chung của cả gương mặt' },
  { ten: 'Tài bạch cung', viTri: 'Mũi — đầu mũi và hai cánh mũi', viec: 'Tiền bạc, cách giữ của' },
  { ten: 'Huynh đệ cung', viTri: 'Hai hàng lông mày', viec: 'Anh em, bạn bè' },
  { ten: 'Điền trạch cung', viTri: 'Mí trên, khoảng giữa mắt và lông mày', viec: 'Nhà cửa, ruộng vườn' },
  { ten: 'Nam nữ cung', viTri: 'Vùng ngay dưới mắt (ngoạ tàm)', viec: 'Con cái' },
  { ten: 'Nô bộc cung', viTri: 'Hai bên cằm dưới', viec: 'Người dưới quyền, người giúp việc' },
  { ten: 'Thê thiếp cung', viTri: 'Đuôi mắt (gian môn)', viec: 'Vợ chồng, bạn đời' },
  { ten: 'Tật ách cung', viTri: 'Sống mũi giữa hai mắt (sơn căn)', viec: 'Ốm đau, tai ách' },
  { ten: 'Thiên di cung', viTri: 'Hai bên trán sát thái dương', viec: 'Đi xa, chuyển chỗ' },
  { ten: 'Quan lộc cung', viTri: 'Giữa trán', viec: 'Việc làm, chức phận' },
  { ten: 'Phúc đức cung', viTri: 'Góc trán trên hai bên', viec: 'Phúc phần, sự an ổn' },
  { ten: 'Phụ mẫu cung', viTri: 'Hai bên trán trên cao (nhật giác, nguyệt giác)', viec: 'Cha mẹ' },
];

export function TuongMatFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn tải một tấm ảnh chân dung lên rồi nhận về mấy đoạn chữ nói về tính cách mình. Câu hỏi
          không tránh được là: {strong('nó đọc cái gì trên mặt tôi để nói được như vậy')}?
        </>
      }
      why={
        <>
          Vì đây là lăng kính {strong('dễ bị dùng lên người khác')} nhất trong cả khu tra cứu. Lá số
          cần ngày sinh, trắc nghiệm cần người ta tự trả lời; còn khuôn mặt thì ai cũng nhìn thấy mà
          không cần xin phép.
        </>
      }
      what={
        <>
          Nhân tướng khuôn mặt là một {strong('tập tục quan sát')} lâu đời ở Đông Á: chia mặt thành
          các vùng rồi gắn mỗi vùng với một mảng việc trong đời. Ba khung quen thuộc nhất là{' '}
          {strong('tam đình')}, {strong('ngũ quan')} và {strong('thập nhị cung')} — một hệ hình
          tượng, không phải một phép đo.
        </>
      }
      how={
        <>
          Công cụ trên hieu.asia nhận đúng {strong('một tấm ảnh')} cộng một ô giới tính, rồi
          trả về {strong('một đoạn văn')} do mô hình AI viết. Nó{' '}
          {strong('không đo tỉ lệ, không chấm điểm, không chia cung')} — ba khung ở trên là kiến thức
          nền của bài này, không phải thứ máy tính ra.
        </>
      }
      soWhat={
        <>
          Để bạn đọc kết quả như {strong('một tấm gương lạ')}: hữu ích ở chỗ nó bắt bạn dừng lại nhìn
          kỹ và tự ngẫm, vô dụng ở chỗ nó phán — và để bạn không dùng khuôn mặt, của mình hay của ai,
          làm căn cứ đánh giá một con người.
        </>
      }
    />
  );
}

export function TuongMatDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="tuong-mat"
        concept="Nhân tướng khuôn mặt là loại tri thức gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ngày xưa người lớn hay nhìn mặt nhau rồi đoán tính nết, giống như mình nhìn trời rồi
                đoán mưa. Họ đặt tên cho từng chỗ trên mặt — chỗ trán, chỗ mũi, chỗ cằm — để{' '}
                {strong('dễ kể lại cho người sau')}. Đó là một câu chuyện được truyền đời, không phải
                một cái thước.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Nhân tướng học là {strong('kinh nghiệm quan sát gom góp qua nhiều thế hệ')}: người
                xưa không có bảng hỏi, không có thống kê, nhưng có rất nhiều thời gian nhìn người, và
                họ ghi lại rồi sắp thành khung cho gọn. Điểm yếu nằm ngay trong cách làm đó — những
                gì {strong('không khớp')} thì thường không được ghi lại, mà một hệ thống chỉ giữ các
                trường hợp trúng sẽ luôn trông rất đúng.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Đây là tri thức thuộc loại {strong('phân loại và ẩn dụ')}, không phải loại{' '}
                  {strong('giả thuyết kiểm được')}: nó chia một vật thể liên tục (khuôn mặt) thành ô
                  rời rạc, gán cho mỗi ô một miền nghĩa, rồi diễn giải bằng ngôn ngữ đủ co giãn để
                  gần như luôn khớp với người đang nghe.
                </p>
                <p>
                  Muốn kiểm được, phải nói trước điều gì sẽ khiến nó SAI — đúng thứ mà cách diễn đạt
                  co giãn kia loại bỏ. Nên bài này xếp nhân tướng khuôn mặt vào{' '}
                  {strong('di sản văn hoá')}, và cách đọc lành mạnh nhất là đọc như một bài tập
                  quan sát.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tuong-mat"
        concept="Ba khung chia mặt: tam đình, ngũ quan, thập nhị cung"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Người xưa chia khuôn mặt như chia một tấm bản đồ: {strong('tầng trên')} là trán,{' '}
                {strong('tầng giữa')} là mắt mũi, {strong('tầng dưới')} là miệng cằm. Rồi họ đặt tên
                cho từng ô, giống như mình đặt tên cho từng phòng trong nhà.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Tam đình')} chia mặt làm {TAM_DINH.length} tầng theo chiều dọc.{' '}
                  {strong('Ngũ quan')} là {NGU_QUAN.length} bộ phận được coi là “cơ quan” riêng — tai,
                  lông mày, mắt, mũi, miệng. {strong('Thập nhị cung')} là cách chia chi tiết hơn, trải{' '}
                  {THAP_NHI_CUNG.length} vùng ra khắp gương mặt, mỗi vùng ứng với một mảng việc.
                </p>
                <p>
                  Điều hay bị kể sót: canon nhấn mạnh {strong('sự cân đối giữa các phần')} chứ không
                  phải phần nào “tốt”. Ba đình cân nhau mới là ý người xưa khen — không phải trán cao
                  thì hơn người trán thấp.
                </p>
              </>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Ba khung này là {strong('ba lớp phân giải')} của cùng một thao tác: chia vùng rồi
                  gán nghĩa. Chúng chồng lên nhau — cùng một cái mũi vừa là trung đình, vừa là Thẩm
                  biện quan, vừa là Tài bạch cung.
                </p>
                <p>
                  Đó chính là chỗ nên cảnh giác: người luận có{' '}
                  {strong('ba cách nói về cùng một quan sát')} nên gần như luôn tìm được một cách
                  nghe hợp lý. Thêm nữa các bản in không thống nhất về vị trí và tên gọi từng cung —
                  bảng trong bài ghi cách chia phổ biến, không phải cách duy nhất.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tuong-mat"
        concept="Công cụ Xem tướng thật sự làm gì với tấm ảnh"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bạn đưa một tấm ảnh cho máy. Máy {strong('nhìn ảnh rồi kể lại bằng chữ')} — giống như
                bạn kể cho bà nghe bức tranh mình vừa vẽ. Máy không lấy thước ra đo, cũng không cho
                điểm ai cả.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Về bạn, công cụ chỉ hỏi {strong('hai thứ')}: tấm ảnh, và giới tính — không ngày
                sinh, không giờ sinh, không tên (ô thứ ba trên form chỉ là nút chọn xem chỉ tay hay
                xem tướng mặt); ảnh còn được thu nhỏ và nén ngay trên máy bạn trước khi gửi. Đầu ra là {strong('một đoạn văn')}: công cụ không có ô điểm, không có bảng chấm,
                không có thang phần trăm nào. Vì vậy mọi con số trong bài này là kiến thức nền do bài
                viết cung cấp, {strong('không phải thứ công cụ tính ra')}.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Đọc mã trang công cụ thì thấy rành mạch: ảnh được thu về tối đa{' '}
                  {strong(RESIZE_MAX_PX + ' điểm ảnh')} ở cạnh dài và nén JPEG ở mức{' '}
                  {JPEG_QUALITY_LABEL}, rồi gửi kèm loại xem và giới tính tới một điểm cuối duy nhất.
                  Đáp trả có đúng một trường nội dung: {strong('một chuỗi Markdown')}.
                </p>
                <p>
                  Hệ quả đáng nhớ: đây là {strong('đầu ra của một mô hình ngôn ngữ')}, không phải của
                  một bảng tra cố định — không có gì bảo đảm hai lần chạy cho cùng câu chữ, và bước
                  nén đã làm mất phần lớn chi tiết nhỏ. Nếu kết quả nghe như một phép đo chính xác,
                  đó là giọng văn chứ không phải độ chính xác.
                </p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

const RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: 'q1',
    type: 'open',
    prompt: 'Công cụ Xem tướng nhận vào những dữ kiện gì về bạn, và trả ra cái gì?',
    answer: (
      <>
        Nó hỏi đúng {strong('hai thứ')}: một tấm ảnh, và giới tính — ô thứ ba trên form chỉ là nút
        chọn chế độ chỉ tay / tướng mặt. Không ngày sinh, không giờ sinh, không tên (nếu bạn đang
        đăng nhập thì có thêm một vé đăng nhập để máy chủ biết đây là tài khoản nào, không phải
        dữ kiện để đọc mặt). Trả ra {strong('một đoạn văn')} do mô hình AI viết, hiển thị dưới dạng
        chữ. Trong cả công cụ không có ô điểm, không có bảng chấm nào — nên đừng đọc kết quả như một
        phép đo.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: `Tam đình chia khuôn mặt làm ${TAM_DINH.length} tầng. Điều canon nhấn mạnh là gì?`,
    choices: [
      {
        text: 'Tầng nào nở nang hơn thì mảng đời tương ứng tốt hơn',
        note: 'Đây là cách kể tắt ngoài dân gian, và là cách dễ dẫn tới phán xét ngoại hình nhất.',
      },
      {
        text: 'Sự cân đối giữa ba tầng — ba đình cân nhau mới là điều người xưa khen',
        correct: true,
        note: 'Đúng. Canon nói về tương quan giữa các phần, không xếp hạng từng phần. Trán cao không “hơn” trán thấp.',
      },
      {
        text: 'Chỉ tầng giữa là đáng kể, hai tầng kia chỉ để tham khảo',
        note: 'Không — cả ba tầng đều nằm trong khung, và ý nghĩa nằm ở chỗ chúng cân nhau tới đâu.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: `Ngũ quan gồm ${NGU_QUAN.length} bộ phận nào?`,
    choices: [
      {
        text: 'Trán, mắt, mũi, miệng, cằm',
        note: 'Không — trán và cằm thuộc cách chia tam đình, không nằm trong ngũ quan.',
      },
      {
        text: 'Tai, lông mày, mắt, mũi, miệng',
        correct: true,
        note: 'Đúng. Lần lượt là Thái thính quan, Bảo thọ quan, Giám sát quan, Thẩm biện quan, Xuất nạp quan.',
      },
      {
        text: 'Mắt, mũi, miệng, tai, tóc',
        note: 'Không — tóc không được xếp vào ngũ quan; chỗ của lông mày mới là một “quan” riêng.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt:
      'Nhiều người cùng nhìn một khuôn mặt và cùng rút ra một ấn tượng. Vì sao điều đó KHÔNG chứng minh ấn tượng ấy đúng?',
    answer: (
      <>
        Vì {strong('đồng thuận và chính xác là hai chuyện khác nhau')}. Việc mọi người nhìn một
        gương mặt rồi cùng thấy “người này hiền” chỉ cho thấy chúng ta chia sẻ chung một khuôn mẫu
        ấn tượng — nó đo cái nằm trong đầu người xem, không đo cái nằm ở người được xem. Muốn biết
        đúng hay không thì phải có một phép đo độc lập về chính người đó rồi đối chiếu, và đó đúng
        là chỗ các nghiên cứu tâm lý học hiện đại{' '}
        {strong('không tìm được liên hệ ổn định')} giữa đặc điểm khuôn mặt và tính cách.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Việc nào sau đây công cụ Xem tướng KHÔNG làm?',
    choices: [
      {
        text: 'Mô tả những nét nhìn thấy được trong ảnh rồi viết thành đoạn văn',
        note: 'Cái này thì có — đó chính là toàn bộ những gì nó làm.',
      },
      {
        text: 'Đo tỉ lệ tam đình, chấm điểm ngũ quan và chia thập nhị cung thành bảng',
        correct: true,
        note: 'Đúng — không chỗ nào trong công cụ đo hay chấm điểm. Đoạn văn có thể mượn chữ của ba khung ấy vì đó là ngôn ngữ của môn này, nhưng mượn chữ không phải là đo; ba khung là kiến thức nền của bài học.',
      },
      {
        text: 'Nén ảnh ngay trên máy bạn trước khi gửi đi',
        note: 'Cái này thì có — ảnh được thu nhỏ và nén trước khi rời máy bạn.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt:
      'Bạn định dùng ảnh chân dung trong hồ sơ để lọc ứng viên tuyển dụng, lấy công cụ này làm căn cứ. Nên xử lý thế nào?',
    choices: [
      {
        text: 'Không dùng — sai cả về bằng chứng lẫn về đối xử với người khác',
        correct: true,
        note: 'Đúng. Không có liên hệ ổn định nào để dựa vào, và đây đúng là kiểu dùng mà lịch sử đã cho thấy hậu quả. Trang công cụ cũng nói rõ: chỉ gửi ảnh của chính mình, hoặc ảnh người khác khi đã được họ đồng ý.',
      },
      {
        text: 'Dùng được nếu chỉ coi là một tiêu chí phụ, không phải tiêu chí chính',
        note: 'Không. Một căn cứ không có cơ sở thì đặt ở vị trí phụ vẫn làm lệch quyết định — chỉ khó truy ra hơn.',
      },
      {
        text: 'Dùng được nếu báo trước cho ứng viên biết',
        note: 'Không. Báo trước giải quyết vấn đề đồng ý, không giải quyết vấn đề căn cứ sai.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: bạn nhận được một đoạn luận nghe rất trúng. Làm gì tiếp theo để biết nó trúng thật hay chỉ nghe như trúng?',
    answer: (
      <>
        Đọc lại từng câu và hỏi {strong('câu này có thể sai với ai không')} — nếu gần như đúng với
        mọi người thì nó chưa nói gì về bạn. Rồi rút ra {strong('một điều kiểm được')} trong tháng
        tới và ghi lại kết quả, thay vì chỉ nhớ những lần trúng.
      </>
    ),
  },
];

export function TuongMatRecall() {
  return <ActiveRecall topicId="tuong-mat" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói được nhân tướng khuôn mặt là một tập tục quan sát truyền đời — chia mặt thành vùng rồi gán nghĩa cho từng vùng — chứ không phải một phép đo.',
  },
  {
    id: 'khung',
    facet: 'Hệ hình tượng',
    can: 'Kể được ba khung chia mặt và điểm khác nhau giữa chúng: tam đình chia theo tầng dọc, ngũ quan lấy từng bộ phận làm một “cơ quan”, thập nhị cung trải các vùng nhỏ ra khắp gương mặt.',
  },
  {
    id: 'can-doi',
    facet: 'Đọc đúng canon',
    can: 'Chỉ ra rằng canon nói về sự cân đối giữa các phần chứ không xếp hạng từng phần — nên “trán cao thì hơn” là cách kể tắt, không phải nội dung gốc.',
  },
  {
    id: 'tool-scope',
    facet: 'Công cụ làm gì',
    can: 'Nói đúng công cụ nhận vào gì (một tấm ảnh và một ô giới tính) và trả ra gì (một đoạn văn), và nói được nó không đo, không chấm điểm, không chia cung.',
  },
  {
    id: 'evidence',
    facet: 'Trạng thái bằng chứng',
    can: 'Phân biệt được đồng thuận với chính xác: nhiều người cùng thấy một ấn tượng không có nghĩa ấn tượng đó đúng, và giải thích được vì sao cần một phép đo độc lập.',
  },
  {
    id: 'history',
    facet: 'Lịch sử',
    can: 'Kể được vì sao “đo mặt đoán người” là một chủ đề nhạy cảm — nó từng được dựng thành khoa học giả để phân loại và kỳ thị con người, và kiểu sai đó vẫn tái xuất dưới dạng công nghệ mới.',
  },
  {
    id: 'ranh-gioi',
    facet: 'Ranh giới',
    can: 'Nói được công cụ không chẩn đoán sức khoẻ hay tâm lý, không đoán tương lai, và không thay thế lời khuyên y tế, pháp lý hay tài chính.',
  },
  {
    id: 'nguoi-khac',
    facet: 'Với người khác',
    can: 'Giải thích được vì sao không dùng khuôn mặt người khác làm căn cứ đánh giá họ, và vì sao chỉ nên gửi ảnh của chính mình hoặc ảnh người khác khi đã được họ đồng ý.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút: người xưa đọc mặt theo khung nào, vì sao nó vẫn đáng biết như di sản, và vì sao nó không dùng để chấm điểm ai.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn chưa nắm — ví dụ vì sao một mô tả co giãn lại luôn nghe trúng — và biết bài nào trên hieu.asia lấp phần đó.',
  },
];

export function TuongMatChecklist() {
  return <UnderstandingChecklist topicId="tuong-mat" facets={FACETS} />;
}

export function TuongMatWhys() {
  return (
    <FiveWhys
      topicId="tuong-mat"
      start={
        <>
          Một người được nhận xét là “trán hẹp thì không hợp đường học hành”. Người ấy tin, rồi bỏ ý
          định đi học tiếp một khoá đã chuẩn bị gần xong.
        </>
      }
      chain={[
        {
          question: 'Vì sao câu nhận xét đó nghe có lý?',
          because: (
            <>
              Vì nó dựa vào một khung có thật: {strong('tam đình')} gán tầng trên của khuôn mặt cho
              quãng đầu đời, tức quãng được nuôi dạy và học hành. Câu nói mượn uy tín của một hệ
              thống lâu đời nên nghe như đang trích quy tắc, chứ không phải đang phỏng đoán.
            </>
          ),
        },
        {
          question: 'Vì sao người xưa lại lập ra cách gán vùng mặt với việc đời như vậy?',
          because: (
            <>
              Vì đó là {strong('công cụ sắp xếp của một thời chưa có thống kê')}: muốn truyền kinh
              nghiệm nhìn người cho đời sau thì phải có chỗ để cất, và chia cơ thể thành bản đồ là
              cách cất gọn nhất. Lối làm này có ở rất nhiều nền văn hoá, không riêng Đông Á.
            </>
          ),
        },
        {
          question: 'Vì sao ấn tượng từ khuôn mặt lại mạnh đến thế, kể cả với người không tin tướng số?',
          because: (
            <>
              Vì bộ não hình thành ấn tượng về một gương mặt {strong('gần như tức thì')}, trước cả
              khi kịp nghĩ — và ấn tượng ấy khá đồng đều giữa những người cùng nền văn hoá. Sự đồng
              đều đó làm ta tưởng mình đang thấy một sự thật khách quan.
            </>
          ),
        },
        {
          question: 'Vì sao “ai nhìn cũng thấy giống nhau” lại không đủ để kết luận là đúng?',
          because: (
            <>
              Vì nó chỉ chứng minh chúng ta {strong('chia chung một khuôn mẫu')}, không chứng minh
              khuôn mẫu ấy khớp với con người thật. Muốn biết đúng hay sai phải đo tính cách người đó
              bằng một cách độc lập rồi đối chiếu — và khi làm đúng như vậy, các nghiên cứu tâm lý
              học hiện đại {strong('không tìm được liên hệ ổn định')} giữa đặc điểm khuôn mặt và
              tính cách.
            </>
          ),
        },
        {
          question: 'Vậy vì sao chuyện này quan trọng hơn một trò vui?',
          because: (
            <>
              Vì cái giá không rơi vào lý thuyết mà rơi vào người thật. Ở ví dụ trên là một khoá học
              bị bỏ dở. Ở quy mô lớn hơn, {strong('lịch sử đã có bài học đắt')}: việc đo mặt, đo sọ
              để phân loại con người từng được dựng thành khoa học giả và dùng để biện minh cho kỳ
              thị. Một căn cứ không có cơ sở, khi được dùng để quyết định về người khác, thì luôn
              gây hại theo một chiều.
            </>
          ),
        },
      ]}
      root={
        <>
          Nhân tướng khuôn mặt đáng giữ như {strong('di sản văn hoá')} và đáng dùng như một bài tập
          quan sát — nó dạy ta nhìn kỹ và mô tả trước khi phán. Nhưng nó{' '}
          {strong('không phải công cụ đánh giá người')}: không dùng để kết luận về mình, và tuyệt
          đối không dùng để kết luận về người khác.
        </>
      }
    />
  );
}
