/**
 * Nội dung "học chủ động" cho trang /learn/barnum — bài CHÍNH THỨC về hiệu ứng
 * Barnum – Forer trên hieu.asia.
 *
 * GROUNDING — nguồn của từng dữ kiện, ghi rõ chỗ nào CHẮC, chỗ nào cố ý nói
 * định tính vì không chắc:
 *
 *   • app/tu-kiem/page.tsx — trang công cụ đích ("Tự kiểm — Đừng tin mù"). Đọc
 *     hết trước khi viết. Ở đó có mảng STATEMENTS gồm ĐÚNG 10 câu, hai nút "Đúng
 *     với tôi" / "Không hẳn", phần lộ kết quả nêu Forer 1948 và LÀM TRÒN điểm
 *     trung bình thành 4,3/5, rồi tới khối "không bói mù" (cụ thể dám sai · trích
 *     nguồn cổ thư · mời bạn tự chấm khắt khe). STATEMENTS là const KHÔNG export
 *     trong một file 'use client' nên KHÔNG import được — các câu trích ở đây
 *     được chép NGUYÊN VĂN kèm số thứ tự hiển thị trên trang đó để đối chiếu
 *     được bằng mắt. Sửa câu bên kia thì phải sửa cả ở đây.
 *
 *   • Thí nghiệm Forer (1948) — kiến thức tâm lý học phổ thông. CHẮC: năm 1948;
 *     Bertram Forer; phát cho sinh viên một bài trắc nghiệm rồi trả lại mỗi
 *     người một bản "phân tích tính cách riêng" mà thực chất TẤT CẢ đều giống
 *     hệt nhau; bản mô tả được ông ghép từ một cuốn sách tử vi mua ở sạp báo;
 *     sinh viên tự chấm độ chính xác trên thang tối đa 5 điểm và trung bình là
 *     4,26. KHÔNG CHẮC nên KHÔNG nêu: sĩ số lớp, phân bố điểm, và thang điểm bắt
 *     đầu từ 0 hay từ 1 — bài chỉ nói "thang tối đa 5 điểm".
 *
 *   • Tên gọi "hiệu ứng Barnum" mượn tên ông bầu gánh xiếc P. T. Barnum — CHẮC.
 *     Ai đặt ra thuật ngữ và năm nào thì KHÔNG nêu vì không chắc.
 *
 *   • Thiên kiến xác nhận và cold reading: mô tả CƠ CHẾ (thứ kiểm được bằng
 *     chính trải nghiệm người đọc), KHÔNG trích số liệu nghiên cứu nào.
 *
 * PHẠM VI — hai chỗ cố ý KHÔNG lấn, chỉ nhắc tên, KHÔNG link vì trang chưa tồn
 * tại: cách kiểm chứng lá số bằng sự kiện quá khứ thật (bài Kiểm chứng, đang
 * viết song song) và cách so sánh hai lăng kính trên cùng một người (bài So sánh
 * lăng kính, viết sau).
 *
 * Giọng: đây là bài hieu.asia tự soi vào chính ngành nghề của mình — thẳng thắn
 * nhưng KHÔNG mỉa mai người thích xem tử vi. Hiệu ứng này bắt cả sinh viên tâm
 * lý học và bắt cả người viết bài; ai coi mình miễn nhiễm là đang dính đúng câu
 * số 8 của bài Tự kiểm.
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

// ── Dữ kiện dùng chung cho CẢ page.tsx lẫn file này ──────────────────────────
// page.tsx import từ đây, không khai lại — để không bao giờ có hai bản số liệu
// lệch nhau giữa thân bài và phần học chủ động.

export const TOPIC_ID = 'barnum';

export const FORER_YEAR = 1948;

/**
 * Điểm trung bình sinh viên tự chấm trong thí nghiệm Forer, dạng NHÃN HIỂN THỊ.
 * Phải dùng dấu PHẨY: trong tiếng Việt dấu chấm là phân cách nghìn, in thẳng số
 * JS ra sẽ đọc thành "bốn trăm hai mươi sáu". Cùng quy ước với /learn/thai-tue
 * ("11,862 năm") và /learn/lich-am-duong ("29,53 ngày").
 */
export const FORER_MEAN_LABEL = '4,26';

/** Bản làm tròn mà trang /tu-kiem đang hiển thị — nêu ra để hai trang không đọc như mâu thuẫn. */
export const TOOL_MEAN_LABEL = '4,3';

/** Số câu trong mảng STATEMENTS của app/tu-kiem/page.tsx. Đếm tay, đã đối chiếu. */
export const STATEMENT_COUNT = 10;

export interface QuotedStatement {
  /** Số thứ tự hiển thị trên /tu-kiem (trang đánh số từ 1). */
  no: number;
  text: string;
}

/**
 * Các câu được trích NGUYÊN VĂN từ bài Tự kiểm để mổ xẻ trong bài học. Dùng
 * object (không phải mảng tra theo chỉ số) để mỗi chỗ trích đều gọi đích danh
 * câu mình muốn, không lệch khi thứ tự thay đổi.
 */
export const QUOTED = {
  s3: { no: 3, text: 'Bạn còn nhiều khả năng tiềm ẩn chưa khai thác hết.' },
  s4: {
    no: 4,
    text: 'Tuy tính cách có vài điểm yếu, nhìn chung bạn biết cách bù đắp chúng.',
  },
  s6: {
    no: 6,
    text: 'Có lúc bạn nghiêm túc nghi ngờ liệu mình đã quyết định hay làm điều đúng chưa.',
  },
  s8: {
    no: 8,
    text: 'Bạn tự hào suy nghĩ độc lập, không vội tin lời người khác nếu chưa đủ bằng chứng.',
  },
  s9: {
    no: 9,
    text: 'Đôi khi bạn cởi mở, hòa đồng; lúc khác lại hướng nội, dè dặt và kín đáo.',
  },
  s10: { no: 10, text: 'Một vài khát vọng của bạn đôi khi khá phi thực tế.' },
} as const satisfies Record<string, QuotedStatement>;

// ── Bản đồ bài học ───────────────────────────────────────────────────────────

export function BarnumFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn đọc một lời luận giải — tử vi, trắc nghiệm tính cách, một lá bài — và bật ra cảm giác{' '}
          {strong('“đúng ghê, sao biết hay vậy”')}. Câu hỏi không phải là lời đó hay hay dở, mà là:
          cảm giác trúng ấy có dùng làm bằng chứng được không?
        </>
      }
      why={
        <>
          Vì đó là {strong('cái cân duy nhất')} mà hầu hết mọi người dùng để chấm một lời giải. Nếu
          cái cân ấy lệch một cách có hệ thống thì mọi kết luận đặt lên nó đều lệch theo — kể cả kết
          luận về những công cụ trên chính web này.
        </>
      }
      what={
        <>
          {strong('Hiệu ứng Barnum – Forer')}: người ta chấm một bản mô tả chung chung là “rất đúng
          với tôi” khi tin rằng bản đó được viết riêng cho mình. Nó KHÔNG nói lời bói đúng hay sai —
          nó nói {strong('cảm giác “đúng” không đo được độ chính xác')}.
        </>
      }
      how={
        <>
          Ba tầng chồng lên nhau: câu chữ được viết sao cho gần như ai đọc cũng khớp;{' '}
          {strong('thiên kiến xác nhận')} khiến bạn chỉ đi tìm ví dụ ủng hộ; và trong buổi xem trực
          tiếp còn thêm {strong('cold reading')} — người nói đọc phản ứng của bạn rồi lái tiếp theo
          nhánh đang trúng.
        </>
      }
      soWhat={
        <>
          Để bạn có {strong('bốn phép tự kiểm')} dùng được ngay với bất kỳ lời mô tả nào — kể cả lời
          của hieu.asia. Kết quả không phải là “đừng xem nữa”, mà là đổi tiêu chuẩn: tin lời{' '}
          {strong('cụ thể, dám sai')} thay vì lời nghe hợp tai.
        </>
      }
    />
  );
}

// ── Ba độ sâu ────────────────────────────────────────────────────────────────

export function BarnumDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId={TOPIC_ID}
        concept="Hiệu ứng Barnum là gì — nói cho gọn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Nếu mình nói {strong('“đôi khi bạn vui, đôi khi bạn buồn”')} thì cả lớp đều gật. Câu
                nào ai nghe cũng thấy đúng thì nó không nói riêng về ai hết — nó chỉ nghe như đang
                nói về bạn thôi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Hiệu ứng Barnum là chuyện này: đưa cho một trăm người{' '}
                  {strong('cùng một bản mô tả tính cách')}, nói với mỗi người rằng bản đó viết riêng
                  cho họ — phần lớn sẽ chấm là rất đúng. Cái tên mượn từ ông bầu gánh xiếc P. T.
                  Barnum, gắn với ý “có một thứ cho tất cả mọi người”.
                </p>
                <p>
                  Cách kiểm nhanh nhất cũng chính là định nghĩa của nó:{' '}
                  {strong('đưa nguyên văn lời mô tả cho một người khác')}. Nếu họ cũng gật, thì câu
                  đó đang mô tả con người nói chung, không phải bạn.
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
                  Chỗ hay bị hiểu lệch: hiệu ứng Barnum{' '}
                  {strong('không phải một phát biểu về nội dung')} của lời bói. Nó là một phát biểu
                  về {strong('phép đo')} — cụ thể là về cái thước mà người đọc dùng để tự chấm. Người
                  ta ước lượng độ chính xác bằng cảm giác khớp, mà cảm giác khớp lại tỉ lệ thuận với
                  độ mơ hồ của câu.
                </p>
                <p>
                  Hệ quả đúng phải rút ra: cảm giác “đúng ghê” không phải bằng chứng ủng hộ, và cũng
                  không phải bằng chứng phản bác — nó đơn giản là{' '}
                  {strong('không mang thông tin')}. Muốn biết một lời mô tả có giá trị hay không thì
                  phải hỏi câu khác: nó có loại trừ được điều gì không.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC_ID}
        concept="Vì sao ta không tự chấm được độ chính xác"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bạn chỉ nhớ những lần đoán trúng, còn những lần đoán trượt thì quên mất. Đếm kiểu đó
                thì lần nào cũng ra {strong('“trúng nhiều lắm”')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Đọc câu “bạn hay lo nghĩ về tương lai”, đầu bạn lập tức đi tìm{' '}
                  {strong('một lần')} bạn đã lo. Tìm thấy là xong — thấy trúng. Nó không đi tìm những
                  ngày bạn chẳng lo gì cả, dù số ngày đó nhiều hơn hẳn. Đó là{' '}
                  {strong('thiên kiến xác nhận')}.
                </p>
                <p>
                  Điều đáng chú ý: {strong('chính bạn là người cung cấp chi tiết')} — cái tên, cái
                  ngày, câu chuyện. Nhưng cảm giác đọng lại thì như thể người kia đã biết sẵn.
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
                  Ba tầng bất đối xứng chồng lên nhau. Một: câu mơ hồ nên{' '}
                  {strong('tập sự kiện khớp rất rộng')}. Hai: việc truy hồi ký ức chỉ chạy theo
                  hướng ủng hộ — tìm một ví dụ đồng ý là việc rẻ, tìm ví dụ phản bác phải cố ý. Ba:
                  lần trúng có câu chuyện để kể lại, lần trượt thì không, nên chỉ có một nửa dữ liệu
                  sống sót trong trí nhớ.
                </p>
                <p>
                  Kết quả là {strong('bộ đếm chỉ chạy một chiều')}. Không thể phá nó bằng cách cố
                  gắng khách quan hơn khi đọc — vì lúc đó đã muộn. Chỉ phá được bằng cách{' '}
                  {strong('ghi ra trước')}: viết điều bạn nghĩ lời giải sẽ nói, và viết cả điều bạn
                  cho là nó sẽ KHÔNG nói, trước khi đọc.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC_ID}
        concept="Cold reading — khi lời mô tả được lái theo bạn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Người nói thử vài hướng khác nhau. Thấy bạn {strong('gật ở hướng nào')} thì họ đi
                tiếp hướng đó, còn hướng bạn lắc đầu thì bỏ qua như chưa từng nói.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Ba nước đi hay gặp: tung một câu{' '}
                  {strong('hai mặt')} để chắc chắn có một nửa trúng; biến câu hỏi thành khẳng định
                  (“nhà mình đang có chuyện với người lớn tuổi, phải không?”) — bạn gật thì thành “đã
                  nói mà”, bạn lắc thì thành “chưa tới, nhưng sắp”; và{' '}
                  {strong('đọc phản ứng')} của bạn để biết nên đi tiếp nhánh nào.
                </p>
                <p>
                  Cuối buổi, thứ bạn nhớ là những câu trúng. Những nhánh đã bị bỏ giữa chừng thì
                  không ai nhắc lại — kể cả bạn.
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
                  Phân biệt cho rõ hai thứ. Hiệu ứng Barnum{' '}
                  {strong('không cần người nói cố ý')}: một bản mô tả in sẵn, một ứng dụng, một câu
                  trả lời do máy sinh ra đều gây được hiệu ứng ấy. Cold reading là{' '}
                  {strong('lớp chủ động')} chồng lên — người nói cập nhật câu chữ theo phản hồi thời
                  gian thực, nên độ “trúng” tăng dần trong cùng một buổi.
                </p>
                <p>
                  Nhưng đừng vội quy kết ác ý. Nhiều người hành nghề{' '}
                  {strong('thật lòng tin vào việc mình làm')} mà vẫn chạy đúng vòng lặp đó, vì phản
                  hồi của người nghe tự động thưởng cho nhánh trúng và làm im nhánh trượt. Cơ chế
                  chạy được mà không cần ai gian dối — đó mới là lý do nó khó nhận ra.
                </p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

// ── Tự kiểm tra ──────────────────────────────────────────────────────────────

const RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: 'q1',
    type: 'open',
    prompt: `Thí nghiệm Forer năm ${FORER_YEAR} làm gì, và kết quả cốt lõi là gì?`,
    answer: (
      <>
        Ông phát cho sinh viên một bài trắc nghiệm, ít lâu sau trả lại mỗi người một bản “phân tích
        tính cách riêng”. Thực chất {strong('tất cả các bản đều giống hệt nhau')}, và được ghép từ
        một cuốn sách tử vi mua ở sạp báo. Sinh viên tự chấm độ chính xác trên thang tối đa 5 điểm,
        trung bình {FORER_MEAN_LABEL}. Kết luận rút ra không phải “sinh viên cả tin”, mà là{' '}
        {strong('cảm giác trúng không phân biệt được lời riêng với lời chung')}.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Bạn đọc một lời luận giải và thấy rất đúng với mình. Điều đó cho biết gì về độ chính xác của người viết?',
    choices: [
      {
        text: 'Gần như không cho biết gì, chừng nào chưa kiểm xem lời đó có đúng với người khác nữa hay không',
        correct: true,
        note: 'Đúng — cảm giác khớp tăng theo độ mơ hồ của câu, nên tự nó không mang thông tin về người viết.',
      },
      {
        text: 'Cho biết người viết có năng lực thật, vì đoán trúng nhiều chi tiết',
        note: 'Không — phần lớn “chi tiết” thường do chính bạn điền vào từ trí nhớ, chứ không nằm trong câu chữ.',
      },
      {
        text: 'Cho biết lời đó sai, vì hễ thấy đúng là dính hiệu ứng Barnum',
        note: 'Cũng không. Hiệu ứng Barnum không chứng minh nội dung sai — nó chỉ nói cảm giác đúng không dùng làm bằng chứng được.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Câu nào dưới đây KHÓ gây hiệu ứng Barnum nhất?',
    choices: [
      {
        text: 'Bạn thích tự do và thấy khó chịu khi bị gò bó',
        note: 'Không — đây là câu đúng với gần như bất kỳ ai, nên hầu như không thể sai.',
      },
      {
        text: 'Trong ba năm tới bạn sẽ chuyển chỗ ở ít nhất một lần',
        correct: true,
        note: 'Đúng. Nó CỤ THỂ nên loại trừ được một khả năng — có mốc thời gian, có sự kiện đếm được, và có thể bị chứng minh là sai.',
      },
      {
        text: 'Có lúc bạn nghi ngờ quyết định của chính mình',
        note: `Không — đây gần như nguyên văn câu số ${QUOTED.s6.no} trong bài Tự kiểm, một câu đúng với hầu hết mọi người.`,
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Phép đảo ngược là gì, và vì sao nó phát hiện được một câu rỗng?',
    answer: (
      <>
        Viết lại câu theo nghĩa {strong('ngược hẳn')} rồi đọc lại. “Bạn là người sống thiên về tình
        cảm” đảo thành “bạn là người sống thiên về lý trí” — cả hai đều có người gật, nên câu gốc
        không loại trừ điều gì. Ngược lại, một câu cụ thể thì bản đảo{' '}
        {strong('nghe sai thấy rõ')}: “bạn sinh vào giờ Tý” đảo thành “bạn không sinh vào giờ Tý” —
        chỉ một trong hai đúng. Câu nào đảo xong vẫn nghe hợp lý thì nó gần như không nói gì.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Vì sao tự mình đếm “trúng bao nhiêu lần” lại không đáng tin?',
    choices: [
      {
        text: 'Vì trí nhớ giữ lại lần trúng và bỏ rơi lần trượt, nên bộ đếm chỉ chạy một chiều',
        correct: true,
        note: 'Đúng — lần trúng có câu chuyện để kể, lần trượt thì trôi qua không ai ghi lại. Cách chữa là ghi ra TRƯỚC khi biết kết quả.',
      },
      {
        text: 'Vì con người vốn kém toán, đếm hay sai số',
        note: 'Không liên quan. Vấn đề không nằm ở phép đếm mà ở việc một nửa dữ liệu không bao giờ được đưa vào để đếm.',
      },
      {
        text: 'Vì mỗi người có một chuẩn “trúng” khác nhau nên không so được',
        note: 'Đó là một khó khăn khác, nhỏ hơn. Vấn đề chính vẫn là dữ liệu vào bị lọc lệch trước khi đếm.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt: `Câu số ${QUOTED.s8.no} trong bài Tự kiểm là “${QUOTED.s8.text}”. Vì sao đây là câu đáng chú ý nhất với người đang học về hiệu ứng Barnum?`,
    answer: (
      <>
        Vì nó là {strong('một câu Barnum nói về chính việc không dính Barnum')}. Hầu như ai cũng tự
        thấy mình là người suy nghĩ độc lập, nên câu này đúng với gần như tất cả — kể cả người vừa
        đọc xong bài này. Bài học rút ra: hiểu về hiệu ứng{' '}
        {strong('không làm bạn miễn nhiễm')}. Nó bắt cả sinh viên tâm lý học lẫn người viết bài. Thứ
        bảo vệ được bạn là một phép kiểm cụ thể làm trên giấy, không phải cảm giác mình tỉnh táo.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Bạn của bạn kết luận: “Vậy hiệu ứng Barnum chứng minh mọi lời bói đều là lừa đảo.” Bạn trả lời thế nào?',
    choices: [
      {
        text: 'Nó không chứng minh điều đó — nó chỉ chứng minh cảm giác “đúng ghê” không dùng làm bằng chứng được',
        correct: true,
        note: 'Đúng. Đây là hai mệnh đề khác nhau: một cái nói về cái thước, một cái nói về nội dung được đo.',
      },
      {
        text: 'Đúng vậy, thí nghiệm đã chứng minh rồi',
        note: 'Không — thí nghiệm đo phản ứng của người ĐỌC, nó không kiểm nội dung nào cả, và cũng không nói gì về ý định của người hành nghề.',
      },
      {
        text: 'Sai — thí nghiệm chỉ đúng với sinh viên, không đúng với người lớn tuổi',
        note: 'Không có căn cứ. Đừng thay một kết luận vội bằng một kết luận vội khác theo hướng ngược lại.',
      },
    ],
  },
];

export function BarnumRecall() {
  return <ActiveRecall topicId={TOPIC_ID} questions={RECALL_QUESTIONS} />;
}

// ── Bạn đã hiểu chưa ─────────────────────────────────────────────────────────

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói được hiệu ứng Barnum là gì bằng một câu: người ta chấm một mô tả chung chung là rất đúng với mình khi tin rằng nó được viết riêng cho mình.',
  },
  {
    id: 'not-what',
    facet: 'Nó KHÔNG là gì',
    can: 'Phân biệt được hai mệnh đề: hiệu ứng nói về độ tin cậy của cảm giác “đúng”, chứ không chứng minh nội dung của bất kỳ lời giải nào là sai.',
  },
  {
    id: 'experiment',
    facet: 'Thí nghiệm gốc',
    can: `Kể lại thí nghiệm Forer ${FORER_YEAR} bằng lời của mình: cùng một bản mô tả cho tất cả, được giới thiệu là bản riêng, và điểm tự chấm trung bình ${FORER_MEAN_LABEL} trên thang tối đa 5.`,
  },
  {
    id: 'sentence-craft',
    facet: 'Bộ công cụ câu chữ',
    can: 'Chỉ ra được ít nhất ba kiểu câu khiến ai đọc cũng thấy đúng — mệnh đề hai mặt, lời khen an toàn, lượng từ mờ — và nói được vì sao mỗi kiểu “an toàn”.',
  },
  {
    id: 'confirmation-bias',
    facet: 'Thiên kiến xác nhận',
    can: 'Giải thích vì sao trí nhớ giữ lần trúng và bỏ lần trượt, và vì sao điều đó khiến việc tự đếm “thầy trúng mấy lần” không đáng tin.',
  },
  {
    id: 'cold-reading',
    facet: 'Cold reading',
    can: 'Phân biệt cold reading với hiệu ứng Barnum: một bên cần người nói đọc phản ứng để lái tiếp, bên kia chạy được cả khi không có ai cố ý.',
  },
  {
    id: 'self-test',
    facet: 'Tự kiểm',
    can: 'Áp được bốn phép tự kiểm vào một lời mô tả có thật: đảo ngược, đưa cho người khác, viết trước, và hỏi câu này loại trừ điều gì.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được vì sao biết về Barnum không có nghĩa mọi thứ đều vô nghĩa, và vì sao một mô tả chung chung vẫn có ích nếu nó giúp bạn đặt câu hỏi đúng.',
  },
  {
    id: 'humility',
    facet: 'Tự soi',
    can: 'Thừa nhận được rằng hiểu về hiệu ứng không làm mình miễn nhiễm — và nhận ra “tôi thì không dễ tin đâu” chính là một câu Barnum.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút, không mỉa mai: vì sao lời bói hay thấy trúng, và làm gì để tự kiểm trước khi tin.',
  },
];

export function BarnumChecklist() {
  return <UnderstandingChecklist topicId={TOPIC_ID} facets={FACETS} />;
}

// ── 5 lần hỏi tại sao ────────────────────────────────────────────────────────

export function BarnumWhys() {
  return (
    <FiveWhys
      topicId={TOPIC_ID}
      start={
        <>
          Một người đi xem về, kể lại: “thầy nói trúng phóc, cứ như biết hết chuyện nhà mình”. Người
          ấy coi cảm giác trúng đó là bằng chứng — buổi xem đã tự chứng minh nó chính xác.
        </>
      }
      chain={[
        {
          question: 'Vì sao người ấy thấy trúng?',
          because: (
            <>
              Vì phần lớn những gì được nói ra {strong('đúng với gần như bất kỳ ai')} trong hoàn cảnh
              đó. Người đến xem thường đang có một chuyện chưa yên, đang phân vân một quyết định,
              đang lo cho một người trong nhà. Nói đúng những điều ấy không cần biết gì về riêng họ.
            </>
          ),
        },
        {
          question: 'Vì sao câu đúng với gần như ai lại nghe như nói riêng về mình?',
          because: (
            <>
              Vì hai thứ cộng lại. Một là {strong('cái khung')}: được giới thiệu là “dành riêng cho
              bạn” thì người nghe đọc theo hướng tìm chỗ khớp. Hai là{' '}
              {strong('người nghe tự điền chi tiết')} — câu nói không có tên ai, không có ngày nào,
              nhưng trí nhớ lập tức cấp đủ cả tên lẫn ngày.
            </>
          ),
        },
        {
          question: 'Vì sao ta tự điền mà không nhận ra mình đang tự điền?',
          because: (
            <>
              Vì tìm một ví dụ {strong('ủng hộ')} là việc não làm gần như tức thì và không tốn công,
              còn tìm ví dụ {strong('phản bác')} thì phải cố ý mới làm được. Phần việc dễ diễn ra
              trong tích tắc nên không để lại cảm giác đã làm gì — nó hiện lên như thể chính người
              kia vừa nói ra.
            </>
          ),
        },
        {
          question: 'Vì sao càng về sau lại càng thấy chắc chắn hơn?',
          because: (
            <>
              Vì cái trúng có câu chuyện để kể, còn cái trượt thì không ai kể. Mỗi lần thuật lại,
              phần trúng được nhắc thêm một lượt và phần trượt lặng đi thêm một chút.{' '}
              {strong('Bộ đếm chỉ chạy một chiều')}, nên độ chắc chắn tăng dần mà chẳng cần thêm dữ
              kiện mới nào.
            </>
          ),
        },
        {
          question: 'Vậy rốt cuộc cảm giác “đúng ghê” đo được cái gì?',
          because: (
            <>
              Đo {strong('độ khớp giữa câu chữ và trí nhớ của chính bạn')} — mà độ khớp ấy lại tăng
              khi câu càng mơ hồ. Nói cách khác, nó đo độ mơ hồ của lời nói, không đo độ chính xác
              của người nói. Đó là lý do “đúng quá mức” là dấu hiệu để dừng lại xem xét, chứ không
              phải để tin thêm.
            </>
          ),
        },
      ]}
      root={
        <>
          Cảm giác trúng là thứ {strong('cần được kiểm')}, không phải thứ dùng để kiểm. Lời đáng tin
          là lời {strong('cụ thể tới mức dám sai')} — nói rõ đến độ nếu sai thì bạn nhận ra ngay.
          Điều này không có nghĩa phải bỏ hết những gì mình thích xem; nó chỉ đổi tiêu chuẩn: gật vì
          đã kiểm, không gật vì nghe hợp tai.
        </>
      }
    />
  );
}
