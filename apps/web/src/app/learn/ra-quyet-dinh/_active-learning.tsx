/**
 * Nội dung "học chủ động" cho trang /learn/ra-quyet-dinh — bài CHÍNH THỨC về
 * cách dùng một lăng kính khi đứng trước quyết định lớn.
 *
 * GROUNDING — công cụ đích là /decision-simulator, đã đọc HẾT mã của nó:
 *   • app/decision-simulator/page.tsx — toàn bộ công cụ nằm trong MỘT file
 *     'use client', gồm cả component con ChoiceFields. Trong đó: CRITERIA (bộ
 *     tiêu chí, mỗi tiêu chí là MỘT CÂU HỎI chứ không phải một thang điểm),
 *     TOPIC_OPTIONS (danh sách chủ đề), canSubmit (tiêu đề 5–100 ký tự sau khi
 *     bỏ khoảng trắng, mô tả ≤ 500 ký tự), và handleSubmit chỉ làm đúng một
 *     việc: setShowFramework(true).
 *   • app/decision-simulator/layout.tsx — metadata tự mô tả: "Hỗ trợ tư duy
 *     quyết định, không thay quyết định."
 *   • components/tools/DownloadToolPdfButton.tsx — nút Tải PDF: người đã đăng
 *     nhập tải thẳng, khách ẩn danh phải nhập email trước.
 *
 * VÌ SAO CHÉP NGUYÊN VĂN THAY VÌ IMPORT: CRITERIA và TOPIC_OPTIONS nằm trong
 * một module đánh dấu 'use client' và KHÔNG được export. Server Component
 * không "dot" được vào module client (Next.js biến mọi export của module client
 * thành client reference), nên không thể import giá trị thật. Khối dưới đây là
 * bản SAO NGUYÊN VĂN và là NGUỒN DUY NHẤT cho cả page.tsx của bài — mọi con số
 * hiển thị đều suy từ nó (.length), không gõ tay chữ số nào.
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ (đọc code, không đoán): nhận 2 tiêu đề + 2 mô tả tuỳ
 * chọn + 1 chủ đề, rồi HIỆN RA bộ câu hỏi cố định kèm tên hai lựa chọn của bạn.
 * KHÔNG chấm điểm, KHÔNG xếp hạng, KHÔNG khuyến nghị chọn bên nào, KHÔNG đọc lá
 * số hay tính cách, KHÔNG lưu gì lại, và chủ đề KHÔNG làm đổi bộ tiêu chí.
 * Những phần đó bài này nói thẳng là công cụ không có nên không dạy.
 *
 * PHẠM VI: cơ chế khiến lời chung chung nghe đúng thuộc bài /learn/barnum;
 * cách kiểm một lời tiên đoán bằng dữ kiện thuộc bài /learn/kiem-chung; vì sao
 * hai hệ nói khác nhau thuộc bài /learn/so-sanh-lang-kinh (đã tồn tại).
 *
 * Giọng: lăng kính để MỞ RỘNG lựa chọn chứ không chọn hộ; không phán số mệnh,
 * không doạ, không mỉa mai người đọc.
 */

import { LearnFrame } from '@/components/learn/active/LearnFrame';
import { DepthTabs } from '@/components/learn/active/DepthTabs';
import { FiveWhys } from '@/components/learn/active/FiveWhys';
import { ActiveRecall, type RecallQuestion } from '@/components/learn/active/ActiveRecall';
import {
  UnderstandingChecklist,
  type UnderstandingFacet,
} from '@/components/learn/active/UnderstandingChecklist';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Bản sao nguyên văn dữ kiện của /decision-simulator ────────────────

/** CRITERIA trong app/decision-simulator/page.tsx — sao nguyên văn. */
export const CRITERIA: readonly { name: string; question: string }[] = [
  {
    name: 'Hợp xu hướng hiện tại',
    question: 'Lựa chọn nào hợp hơn với hướng bạn đang đi trong 1–2 năm tới?',
  },
  {
    name: 'Rủi ro tài chính',
    question: 'Nếu kịch bản xấu nhất xảy ra, lựa chọn nào bạn còn chịu được về tiền bạc?',
  },
  {
    name: 'Cơ hội học nhanh',
    question: 'Lựa chọn nào buộc bạn học kỹ năng mới hoặc trưởng thành nhanh hơn?',
  },
  {
    name: 'Áp lực tinh thần',
    question: 'Lựa chọn nào khiến bạn căng thẳng kéo dài hơn — và bạn chịu được bao lâu?',
  },
  {
    name: 'Tác động dài hạn',
    question: 'Sau 3–5 năm nhìn lại, lựa chọn nào để lại nền tảng tốt hơn?',
  },
  {
    name: 'Điều kiện nên chọn',
    question: 'Mỗi lựa chọn chỉ thực sự đúng khi điều kiện nào là thật?',
  },
];

/** TOPIC_OPTIONS trong cùng file — chỉ lấy nhãn hiển thị. */
export const TOPIC_LABELS: readonly string[] = ['Sự nghiệp', 'Tài chính', 'Quan hệ', 'Khác'];

/** Ràng buộc nhập liệu đọc từ canSubmit + thuộc tính của Input/Textarea. */
export const TITLE_MIN = 5;
export const TITLE_MAX = 100;
export const DESC_MAX = 500;

/** Số lựa chọn công cụ nhận cùng lúc — form chỉ dựng đúng hai khối A và B. */
export const CHOICE_SLOTS = 2;

/** Số câu hỏi bạn phải tự trả lời sau khi bấm nút: mỗi tiêu chí × mỗi lựa chọn. */
export const ANSWERS_TO_WRITE = CRITERIA.length * CHOICE_SLOTS;

const FIRST_CRITERION = CRITERIA[0]?.name ?? '';
const RISK_CRITERION = CRITERIA[1]?.name ?? '';
const CONDITION_CRITERION = CRITERIA[CRITERIA.length - 1]?.name ?? '';
const CONDITION_QUESTION = CRITERIA[CRITERIA.length - 1]?.question ?? '';

export function RaQuyetDinhFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn đang đứng trước một việc lớn — đổi việc, vay mua nhà, cưới hay chưa cưới — và câu hỏi
          trong đầu đã rút gọn thành {strong('“chọn A hay B?”')}. Ở trạng thái đó, rất nhiều người
          mở một app bói, gieo một quẻ, hoặc nhắn cho thầy để xin một câu trả lời dứt khoát.
        </>
      }
      why={
        <>
          Vì một quyết định lớn hỏng hiếm khi hỏng ở chỗ {strong('chọn nhầm ô')}. Nó thường hỏng
          sớm hơn: bạn chưa viết ra mình đang tối ưu điều gì, chưa nghĩ tới phương án thứ ba, và
          chưa định nghĩa thế nào là sai để còn rút sớm. Xin một câu trả lời từ bên ngoài không lấp
          được ba chỗ trống đó — nó chỉ giúp bạn thôi phải nhìn vào chúng.
        </>
      }
      what={
        <>
          Bài này nói về một cách dùng: lăng kính là {strong('bộ câu hỏi')}, không phải bộ đáp án.
          Nó không biết A và B của bạn là gì, nên không thể nói bên nào đúng. Việc nó làm được là
          buộc bạn nhìn sang những mặt bạn chưa nghĩ tới — rồi bạn tự quyết.
        </>
      }
      how={
        <>
          Đúng như công cụ Mô Phỏng Quyết Định của hieu.asia đang làm: bạn gõ tên{' '}
          {strong(CHOICE_SLOTS + ' lựa chọn')}, nó hiện ra {strong(CRITERIA.length + ' câu hỏi')} và
          đặt tên hai lựa chọn của bạn cạnh mỗi câu — {strong('không có điểm số nào')}, không xếp
          hạng, không kết luận. Phần trả lời là việc của bạn.
        </>
      }
      soWhat={
        <>
          Để lần tới, khi thấy mình sắp gõ “nên chọn A hay B” vào một hệ bói, bạn đổi được câu hỏi
          thành {strong('“tôi đang chưa nhìn thấy mặt nào?”')} — và giữ lại quyền quyết định, cùng
          với bài học đi kèm nó.
        </>
      }
    />
  );
}

export function RaQuyetDinhDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="ra-quyet-dinh"
        concept="Lăng kính dùng để mở rộng lựa chọn, không phải để chọn hộ"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Khi phải chọn giữa hai món đồ chơi, người lớn hay hỏi bạn: “con thích cái nào hơn?”,
                “cái nào chơi được lâu hơn?”, “cái nào dễ hỏng?”. Họ {strong('không chọn thay bạn')}{' '}
                — họ chỉ nhắc bạn nhìn thêm vài chỗ mà bạn quên nhìn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Một lăng kính (tử vi, MBTI, hay một bộ tiêu chí) không có thông tin về hai lựa
                  chọn của bạn. Nó không biết lương bao nhiêu, sếp thế nào, nhà còn bao nhiêu tiền —
                  khác hẳn một người bạn thân, người mà bạn kể cho nghe đúng những dữ kiện ấy. Nên
                  thứ một lăng kính tạo ra được là {strong('câu hỏi')}, không phải đáp án.
                </p>
                <p>
                  Cái được của việc trả lời một bộ câu hỏi là bạn phát hiện ra chỗ mình{' '}
                  {strong('không viết nổi một chữ nào')}. Đó chính là phần bạn chưa biết — và nó
                  đáng giá hơn nhiều so với một lời phán “chọn A đi”.
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
                  Nói cho gọn: một quyết định có hai phần rất khác nhau —{' '}
                  {strong('chất lượng quá trình')} và {strong('chất lượng kết quả')}. Bạn chỉ kiểm
                  soát được phần đầu. Một quá trình tốt vẫn có thể ra kết quả xấu vì rủi ro, và một
                  quá trình tệ đôi khi vẫn may. Vì thế đánh giá bản thân theo kết quả là học sai bài.
                </p>
                <p>
                  Lăng kính can thiệp được vào phần quá trình: nó thêm các chiều bạn chưa xét. Nó{' '}
                  {strong('không')} can thiệp được vào phần kết quả, vì nó không nhận vào một dữ
                  kiện nào của tình huống. Đó là lý do một hệ bói có thể hữu ích như bộ khơi câu hỏi
                  mà vẫn vô ích như bộ dự báo.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="ra-quyet-dinh"
        concept="Vì sao “nên chọn A hay B” là câu hỏi đặt sai"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Nếu bạn hỏi một cái hộp kín “con nên ăn kẹo hay ăn bánh?”, cái hộp{' '}
                {strong('không biết')} bạn có kẹo gì, bánh gì, hay bạn vừa ăn no chưa. Câu trả lời
                của nó chỉ là một tiếng động, còn cái bụng là của bạn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Câu hỏi “A hay B” chứa sẵn một giả định lớn: rằng {strong('chỉ có A và B')}. Rất
                  nhiều quyết định lớn có phương án thứ ba tốt hơn cả hai — làm thử nhỏ, hoãn có
                  điều kiện, thương lượng lại, hoặc làm cả hai ở quy mô nhỏ. Hỏi kiểu nhị phân là tự
                  bỏ mất phần đó trước khi bắt đầu.
                </p>
                <p>
                  Thêm nữa: một câu trả lời dứt khoát từ bên ngoài nghe rất{' '}
                  {strong('nhẹ người')}, vì nó lấy đi trách nhiệm. Nhưng nếu hỏng thì bạn không rút
                  được bài học nào — lỗi đã được gán cho quẻ, cho số, cho thầy.
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
                  Ba tầng cốt lõi, tách riêng cho rõ — phần chính của bài còn tách thêm tầng khung
                  câu hỏi và tầng trách nhiệm. Một là {strong('tầng thông tin')}: đầu vào của
                  một hệ bói (ngày giờ sinh, một lần gieo) không chứa dữ kiện nào về A và B, nên đầu
                  ra không thể chứa thông tin về chúng.
                </p>
                <p>
                  Hai là {strong('tầng kiểm chứng')}: bạn chỉ sống được một nhánh, không có nhánh
                  đối chứng, nên gần như không bao giờ biết lời khuyên ấy đúng hay sai. Ba là{' '}
                  {strong('tầng diễn giải')}: một câu chung chung sẽ tự khớp vào phương án bạn đã
                  nghiêng sẵn, nên bạn tưởng mình nhận được câu trả lời trong khi thật ra vừa nghe
                  lại chính mình.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="ra-quyet-dinh"
        concept="Công cụ Mô Phỏng Quyết Định thật sự làm gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bạn viết tên hai việc mình đang phân vân. Máy đưa lại cho bạn một{' '}
                {strong('tờ giấy có sẵn câu hỏi')}, và tên hai việc của bạn nằm cạnh từng câu. Máy
                không khoanh tròn giúp bạn cái nào cả.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bạn nhập tiêu đề cho {strong(CHOICE_SLOTS + ' lựa chọn')} (mỗi tiêu đề {TITLE_MIN}
                  –{TITLE_MAX} ký tự), thêm mô tả nếu muốn, chọn một chủ đề trong{' '}
                  {TOPIC_LABELS.length} chủ đề, rồi bấm nút. Cái hiện ra là{' '}
                  {strong(CRITERIA.length + ' tiêu chí')} — và mỗi tiêu chí là một câu hỏi để bạn tự
                  trả lời cho cả hai bên.
                </p>
                <p>
                  Không có điểm, không có bên thắng. Chính trang công cụ ghi rõ ở đầu: đây là khung
                  giúp bạn tự cân nhắc, {strong('không phải máy chấm điểm hộ')}.
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
                  Đọc mã thì thấy rất gọn: hàm xử lý khi bấm nút chỉ bật một cờ hiển thị, không gọi
                  phép tính nào, không gọi máy chủ nào. Bộ tiêu chí là một hằng số cố định, nên{' '}
                  {strong('chủ đề bạn chọn không làm đổi câu hỏi')} — nó chỉ được ghi lại trong bản
                  PDF, ở dòng phụ đề và ở mục hai lựa chọn.
                </p>
                <p>
                  Hệ quả cần biết trước khi dùng: công cụ {strong('không đọc lá số')} và không đọc
                  kết quả trắc nghiệm tính cách của bạn; trang cũng{' '}
                  {strong('không giữ lại')} những gì bạn gõ — rời trang là mất, và nội dung chỉ rời
                  khỏi trình duyệt khi bạn bấm tải bản PDF. Khối lượng việc thật nằm ở phía bạn:{' '}
                  {ANSWERS_TO_WRITE} ô cần trả lời, tức {CRITERIA.length} câu hỏi nhân{' '}
                  {CHOICE_SLOTS} lựa chọn.
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
    prompt:
      'Công cụ Mô Phỏng Quyết Định nhận vào những gì, trả ra những gì — và có chấm điểm cho A hay B không?',
    answer: (
      <>
        Nhận vào tiêu đề của {CHOICE_SLOTS} lựa chọn ({TITLE_MIN}–{TITLE_MAX} ký tự mỗi tiêu đề),
        mô tả tuỳ chọn tối đa {DESC_MAX} ký tự, và một chủ đề. Trả ra{' '}
        {strong(CRITERIA.length + ' tiêu chí, mỗi tiêu chí là một câu hỏi')}, kèm tên hai lựa chọn
        của bạn đặt cạnh nhau. {strong('Không chấm điểm, không xếp hạng, không khuyến nghị')} — phần
        trả lời hoàn toàn là việc của bạn.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Chọn chủ đề “Tài chính” thay vì “Sự nghiệp” thì bộ tiêu chí đổi thế nào?',
    choices: [
      {
        text: 'Bộ tiêu chí được thay bằng một bộ chuyên về tiền bạc',
        note: 'Không — bộ tiêu chí là một hằng số cố định trong mã, dùng chung cho mọi chủ đề.',
      },
      {
        text: `Không đổi gì cả — vẫn đúng ${CRITERIA.length} tiêu chí đó; chủ đề chỉ được ghi lại trong bản PDF`,
        correct: true,
        note: 'Đúng. Biết điều này để không kỳ vọng công cụ “hiểu ngữ cảnh” — nó không có phần đó.',
      },
      {
        text: 'Thứ tự tiêu chí được sắp xếp lại theo mức quan trọng với chủ đề',
        note: 'Không — không có bước sắp xếp nào; danh sách render đúng thứ tự khai báo.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt:
      'Bạn nghĩ ra “nghỉ việc mở quán cà phê” trước, rồi mọi phương án sau đều được đem so với nó. Đây là thiên kiến nào?',
    choices: [
      {
        text: 'Neo vào phương án đầu — cái nghĩ ra trước biến thành thước đo cho tất cả cái sau',
        correct: true,
        note: 'Đúng. Dấu hiệu nhận ra: bạn hỏi “có bằng mở quán không?” chứ không hỏi “cái nào hợp tiêu chí của tôi hơn?”.',
      },
      {
        text: 'Sợ mất mát — bạn sợ mất khoản đã bỏ ra',
        note: 'Chưa đúng ở ca này. Sợ mất mát là khi danh sách “những thứ sẽ mất” đọc nặng hơn hẳn danh sách “những thứ sẽ được” cùng độ lớn — chứ không phải chuyện phương án nghĩ ra đầu tiên chiếm mất chỗ tham chiếu.',
      },
      {
        text: 'Tìm thông tin xác nhận — bạn chỉ đọc bài viết ủng hộ mở quán',
        note: 'Đó là thiên kiến khác và thường đến SAU: khi đã neo rồi, bạn mới đi tìm bằng chứng cho cái neo.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt:
      'Vì sao hỏi một hệ bói “nên chọn A hay B” là đặt sai câu hỏi, kể cả khi bạn tin vào hệ đó?',
    answer: (
      <>
        Vì đầu vào của phép tính (ngày giờ sinh, hoặc một lần gieo){' '}
        {strong('không chứa dữ kiện nào về A và B')} — không lương, không hợp đồng, không sức khoẻ —
        nên đầu ra không thể chứa thông tin về chúng. Thêm hai chỗ nữa: bạn chỉ sống một nhánh nên
        không có gì để đối chiếu xem lời khuyên đúng hay sai, và một câu chung chung sẽ tự khớp vào
        phương án bạn đã nghiêng sẵn. Câu hỏi dùng được thì khác:{' '}
        {strong('“tôi đang chưa nhìn thấy mặt nào?”')}
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt:
      'Bạn gieo quẻ, ra kết quả không vừa ý, nên gieo lại lần nữa. Vấn đề lớn nhất của việc này là gì?',
    choices: [
      {
        text: 'Gieo nhiều lần làm loãng linh nghiệm của quẻ',
        note: 'Đây vẫn là lập luận bên trong hệ. Vấn đề nằm ở tầng khác và không cần tin hay không tin hệ nào.',
      },
      {
        text: 'Không có vấn đề gì, hỏi lại cho chắc là bình thường',
        note: 'Có vấn đề: nếu bạn chỉ dừng khi ra kết quả mình muốn, thì thứ quyết định cuối cùng là mong muốn của bạn, không phải quẻ.',
      },
      {
        text: 'Bạn đang lọc kết quả cho khớp điều mình đã muốn — tức là đã quyết rồi, chỉ đang đi tìm giấy phép',
        correct: true,
        note: 'Đúng. Và nếu đã quyết rồi thì tự nhận cho sòng phẳng sẽ đỡ mất thời gian hơn.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Phép thử lật: “nếu kết quả ra ngược lại, tôi có đổi ý không?” — trả lời “không” thì nói lên điều gì?',
    answer: (
      <>
        Nói rằng bạn {strong('đã quyết xong rồi')} và đang đi tìm một lời chuẩn thuận. Điều đó không
        xấu — nhưng biết là mình đang làm vậy sẽ tiết kiệm được thời gian, tiền, và tránh cảm giác
        hụt hẫng khi kết quả không chiều mình. Nếu câu trả lời là “có, tôi sẽ đổi ý”, thì hãy viết
        ra {strong('đổi vì dữ kiện nào')} — thường thứ bạn cần là dữ kiện đó, không phải một lời
        phán.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'open',
    prompt: `Vận dụng: bạn đang phân vân giữa hai lời mời làm việc. Tiêu chí “${CONDITION_CRITERION}” buộc bạn viết ra cái gì — và vì sao nó là tiêu chí đáng làm trước nhất?`,
    answer: (
      <>
        Nó hỏi: “{CONDITION_QUESTION}”. Tức bạn phải viết ra{' '}
        {strong('điều kiện khiến mỗi bên là lựa chọn đúng')} — ví dụ “A đúng nếu sếp trực tiếp là
        người tôi đã làm cùng” hay “B đúng nếu tôi giữ được hai buổi tối mỗi tuần”. Đáng làm trước
        vì nó biến một cuộc tranh cãi trong đầu thành thứ{' '}
        {strong('kiểm được sau vài tháng')}: điều kiện không thành thì bạn biết mình cần xem lại,
        thay vì chịu đựng thêm một năm rồi mới nhận ra.
      </>
    ),
  },
];

export function RaQuyetDinhRecall() {
  return <ActiveRecall topicId="ra-quyet-dinh" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói được vì sao một lăng kính chỉ tạo ra câu hỏi chứ không tạo ra đáp án: nó không nhận vào dữ kiện nào của tình huống bạn đang cân nhắc.',
  },
  {
    id: 'tool-scope',
    facet: 'Công cụ làm gì',
    can: `Mô tả đúng công cụ Mô Phỏng Quyết Định: nhận ${CHOICE_SLOTS} tiêu đề + mô tả tuỳ chọn + 1 chủ đề, hiện ra ${CRITERIA.length} câu hỏi, và không chấm điểm cho bên nào.`,
  },
  {
    id: 'tool-limits',
    facet: 'Công cụ KHÔNG làm gì',
    can: 'Kể được các phần công cụ không có: không xếp hạng, không khuyến nghị, không đọc lá số hay tính cách, không lưu dữ liệu, và chủ đề không làm đổi bộ tiêu chí.',
  },
  {
    id: 'biases',
    facet: 'Nhận diện thiên kiến',
    can: 'Nhận ra ba thiên kiến hay bẻ cong quyết định lớn — neo vào phương án đầu, sợ mất mát, tìm thông tin xác nhận — và chỉ ra dấu hiệu của từng cái trong chính câu chữ mình đang dùng.',
  },
  {
    id: 'wrong-question',
    facet: 'Câu hỏi sai',
    can: 'Giải thích được vì sao “nên chọn A hay B” là câu hỏi đặt sai với một hệ bói, tách bạch tầng thông tin, tầng kiểm chứng và tầng diễn giải.',
  },
  {
    id: 'widen',
    facet: 'Mở rộng lựa chọn',
    can: 'Biến một câu hỏi nhị phân thành ít nhất ba phương án (làm thử nhỏ, hoãn có điều kiện, thương lượng lại) trước khi đem bất cứ thứ gì ra so.',
  },
  {
    id: 'criteria-first',
    facet: 'Tiêu chí trước',
    can: 'Nói được vì sao phải viết tiêu chí và ngưỡng TRƯỚC khi mở bất kỳ kết quả nào, và điều gì xảy ra nếu viết sau.',
  },
  {
    id: 'flip-test',
    facet: 'Phép thử lật',
    can: 'Dùng được câu hỏi “nếu kết quả ngược lại tôi có đổi ý không?” và đọc đúng ý nghĩa của cả hai câu trả lời.',
  },
  {
    id: 'process-vs-outcome',
    facet: 'Ranh giới',
    can: 'Phân biệt chất lượng quá trình với chất lượng kết quả, và không đánh giá một quyết định chỉ bằng chuyện nó có may hay không.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho một người thân đang phân vân trong một phút: vì sao đừng hỏi “chọn A hay B”, và ba việc nên làm trước khi quyết.',
  },
];

export function RaQuyetDinhChecklist() {
  return <UnderstandingChecklist topicId="ra-quyet-dinh" facets={FACETS} />;
}

export function RaQuyetDinhWhys() {
  return (
    <FiveWhys
      topicId="ra-quyet-dinh"
      start={
        <>
          Một người phân vân giữa ở lại công ty cũ và nhận lời mời mới. Cân mãi không xong, họ gieo
          một quẻ, ra “nên đi”, và nộp đơn ngay hôm sau. Sáu tháng sau họ nói: “biết vậy đã không
          nghe.”
        </>
      }
      chain={[
        {
          question: 'Vì sao họ đi hỏi thay vì tự cân nhắc tiếp?',
          because: (
            <>
              Vì cân mãi mà hai bên cứ {strong('ngang nhau về cảm giác')}. Ở thế bí đó, một câu trả
              lời dứt khoát từ bên ngoài gỡ được sự khó chịu ngay lập tức — nó chấm dứt việc phải
              nghĩ, và đó chính là phần dễ chịu nhất.
            </>
          ),
        },
        {
          question: 'Vì sao cân mãi mà hai bên cứ ngang nhau?',
          because: (
            <>
              Vì chưa bao giờ viết ra {strong('mình đang tối ưu cái gì')}. Không có tiêu chí thì
              không có thang để so: mỗi lần nghĩ tới A lại thấy điểm mạnh của A, nghĩ tới B lại thấy
              điểm mạnh của B, và vòng lặp không có điểm dừng.
            </>
          ),
        },
        {
          question: 'Vì sao không chịu viết tiêu chí ra?',
          because: (
            <>
              Vì viết ra là phải thừa nhận {strong('đánh đổi')}: nếu ghi “thu nhập quan trọng hơn
              thời gian với con”, bạn phải nhìn thẳng vào điều đó. Để trống thì giữ được cảm giác
              mình sẽ không phải bỏ gì cả — dễ chịu hơn, nhưng cũng là lý do quyết định mãi không
              chốt được.
            </>
          ),
        },
        {
          question: 'Vì sao câu “nên đi” của quẻ lại nghe thuyết phục đến thế?',
          because: (
            <>
              Vì nó {strong('không chứa thông tin nào')} về hai công việc đó, nên đầu người nghe tự
              lấp vào bằng lý lẽ của chính mình. Bạn nghe thấy điều bạn vốn đã nghiêng về, rồi tưởng
              đó là một nguồn độc lập vừa xác nhận cho mình.
            </>
          ),
        },
        {
          question: 'Vậy vì sao sáu tháng sau mới thấy hối?',
          because: (
            <>
              Vì cái sai không nằm ở chỗ “đi hay ở”, mà ở chỗ chưa bao giờ đặt{' '}
              {strong('điều kiện để nhận ra mình sai')}: lương thấp hơn bao nhiêu thì thôi, sếp kiểu
              gì thì rút, sau mấy tháng thì xem lại. Không có mốc nào để soi, nên người ta chịu đựng
              lâu hơn mức cần thiết rồi mới nhìn lại.
            </>
          ),
        },
      ]}
      root={
        <>
          Gốc rễ không phải là chọn nhầm ô, mà là {strong('một quyết định chưa từng được viết ra')}:
          không tiêu chí, không phương án thứ ba, không điều kiện dừng. Lăng kính không lấp được ba
          chỗ trống đó — nhưng nếu dùng như bộ câu hỏi, nó chỉ thẳng cho bạn thấy chúng đang ở đâu.
          Còn khi có ai nhận quyết thay bạn, thứ bạn mất không phải là tiền quẻ, mà là bài học.
        </>
      }
    />
  );
}

/** Tên tiêu chí dùng lại ở page.tsx cho phần ví dụ — tránh gõ tay hai nơi. */
export const CRITERION_NAMES = {
  first: FIRST_CRITERION,
  risk: RISK_CRITERION,
  condition: CONDITION_CRITERION,
} as const;
