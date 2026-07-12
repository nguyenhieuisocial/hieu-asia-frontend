/**
 * Nội dung "học chủ động" cho trang /learn/mbti — bài flagship.
 *
 * TẤT CẢ grounded từ chính bài viết MBTI trên cùng trang: 4 trục I/E·N/S·T/F·J/P,
 * 16 nhóm, lịch sử (Jung 1921 → Briggs–Myers), tám chức năng nhận thức và chuỗi
 * trội→kém, cùng phần phê bình định tính (đo lại có thể đổi, nhị phân cắt dải liên
 * tục, hiệu ứng Barnum, không đo năng lực). KHÔNG thêm dữ kiện ngoài trang. Giữ
 * giọng "khung để hiểu mình, không phán/dán nhãn".
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

export function MbtiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Vì sao có người “sạc pin” bằng tụ tập đông vui, còn bạn cần ở một mình mới lại sức? Làm
          sao mô tả thiên hướng tâm lý của mình một cách có hệ thống — để hiểu mình và hợp tác với
          người khác tốt hơn?
        </>
      }
      why={
        <>
          MBTI dựng trên thuyết tâm lý của Carl Jung, được Myers–Briggs hệ thống thành 4 trục dễ
          dùng. Nó tồn tại vì người ta cần một {strong('ngôn ngữ chung')} để nói về khác biệt tính
          cách mà không phán “ai đúng ai sai”.
        </>
      }
      what={
        <>
          4 trục lưỡng cực (I/E, N/S, T/F, J/P) ghép thành {strong('16 nhóm')}. Đây là{' '}
          {strong('thiên hướng tự nhiên')} — {strong('không phải')} “ô đóng”, không phải chẩn đoán,
          và không đo năng lực.
        </>
      }
      how={
        <>
          Trả lời bộ câu hỏi → mỗi trục nghiêng về một bên → ghép 4 chữ thành 1 trong 16 nhóm. Mỗi
          nhóm còn có một chuỗi {strong('chức năng nhận thức')} (theo Jung) lý giải vì sao nó vận
          hành như vậy.
        </>
      }
      soWhat={
        <>
          Để hiểu cách mình nạp năng lượng, chú ý, quyết định, sắp xếp — và hiểu người khác vận hành
          khác mình ra sao. Dùng để {strong('cảm thông và hợp tác')}, không để dán nhãn hay phán xét.
        </>
      }
    />
  );
}

export function MbtiDepth() {
  return (
    <div className="space-y-4">
      <DepthTabs
        topicId="mbti"
        concept="Bốn trục thực sự hỏi bạn điều gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bốn chữ trong một nhóm như INTJ giống {strong('bốn câu hỏi nhỏ')} về bạn: bạn nạp
                lại sức bằng cách ở một mình hay chơi cùng mọi người? Bạn hay để ý cái tổng thể hay
                từng chi tiết? Khi phải chọn, bạn nghe cái đầu hay nghe lòng mình? Bạn thích lên lịch
                sẵn hay để tuỳ lúc? Mỗi chữ là câu trả lời của bạn cho một câu hỏi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi trục hỏi một chuyện khác nhau. {strong('I/E')} hỏi năng lượng của bạn đến từ
                  đâu: ở một mình hay ở bên người khác. {strong('N/S')} hỏi bạn quen chú ý vào cái
                  gì: khả năng và mẫu hình, hay chi tiết và dữ kiện trước mắt.
                </p>
                <p>
                  {strong('T/F')} hỏi bạn ra quyết định dựa vào đâu: logic, hay giá trị và cảm xúc.{' '}
                  {strong('J/P')} hỏi bạn thích sống có kế hoạch đóng sẵn hay để mở, ứng biến. Ghép
                  bốn câu trả lời lại thành một trong 16 nhóm.
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
                  Hai trục giữa gắn với việc tâm trí làm gì: {strong('N/S')} là cách{' '}
                  {strong('thu nhận thông tin')}, còn {strong('T/F')} là cách{' '}
                  {strong('ra quyết định')}. {strong('I/E')} chỉ hướng của năng lượng; {strong('J/P')}{' '}
                  là trục Briggs–Myers thêm vào so với Jung, nói bạn quen sắp xếp cuộc sống chặt hay
                  lỏng.
                </p>
                <p>
                  Điểm cần nhớ: mỗi trục là một {strong('thiên hướng giữa hai cực')}, không phải điểm
                  số đo bạn nghiêng bao nhiêu. Vì bị cắt thành hai nửa, người nằm gần giữa một trục
                  dễ đổi bên khi làm lại — nên bốn chữ cái là điểm khởi đầu để tự quan sát, chưa phải
                  kết luận đóng chặt.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="mbti"
        concept="“Thiên hướng”, không phải năng lực, cũng không phải nhãn cố định"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bạn thuận tay phải, nhưng tay trái vẫn viết được — chỉ là không quen bằng. MBTI nói
                về {strong('“tay thuận” trong tâm lý')}: bạn nghiêng về kiểu nào một cách tự nhiên,
                chứ không phải bạn “chỉ làm được mỗi kiểu đó”.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi trục MBTI là một {strong('thiên hướng')}, như chuyện thuận tay: ai cũng dùng
                  được cả hai bên, chỉ là một bên thấy tự nhiên và đỡ tốn sức hơn.
                </p>
                <p>
                  Vì vậy “I” (hướng nội) không có nghĩa bạn không bao giờ thích giao tiếp; “T” (lý
                  trí) không có nghĩa bạn vô cảm. Và vì là thiên hướng chứ không phải nhãn khắc đá,{' '}
                  {strong('kết quả có thể đổi theo giai đoạn cuộc đời')}.
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
                  MBTI mô tả {strong('preference')} (thiên hướng) giữa hai cực, không đo năng lực
                  hay cường độ đặc điểm. Mỗi loại còn gắn một chuỗi {strong('chức năng nhận thức')}{' '}
                  theo Jung — ví dụ INTJ dẫn đầu bằng Trực giác hướng nội (Ni) rồi Tư duy hướng ngoại
                  (Te) — giúp lý giải vì sao hai loại trông gần giống nhau lại vận hành khác.
                </p>
                <p>
                  Lưu ý quan trọng: MBTI {strong('bị nhiều nhà tâm lý phản biện')} về độ tin cậy
                  (test–retest reliability). Nên dùng như khung tự phản tỉnh và đối thoại, kết hợp
                  với các góc nhìn khác — không như một chẩn đoán.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="mbti"
        concept="Chức năng nhận thức là gì (lớp bên dưới bốn chữ cái)"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bốn chữ cái như INTJ là {strong('cái tên ngoài cửa')}. Chức năng nhận thức là{' '}
                {strong('cách bài trí bên trong nhà')}: hai nhà cùng có phòng khách nhưng mỗi nhà kê
                một kiểu. Nó nói tâm trí bạn quen nhìn và quyết theo lối nào.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi nhóm dùng bốn chức năng theo thứ tự ưu tiên: {strong('trội → phụ trợ → cấp ba → kém')}.
                  Ví dụ INTJ dẫn bằng Ni (gom dữ kiện thành một viễn cảnh) rồi Te (biến viễn cảnh
                  thành kế hoạch đo được).
                </p>
                <p>
                  Thứ tự này giải thích “gu” xử lý của từng nhóm, {strong('sâu hơn bốn chữ cái')} —
                  và cho thấy vì sao hai nhóm chung nhiều chữ cái vẫn vận hành khác nhau.
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
                  Có tám chức năng: bốn cách thu nhận thông tin (Ni, Ne, Si, Se) và bốn cách ra quyết
                  định (Ti, Te, Fi, Fe), mỗi loại lại hướng vào trong hoặc ra ngoài. Chức năng{' '}
                  {strong('kém')} (thứ tư) là chỗ mỗi nhóm dễ lóng ngóng và hay trồi lên khi căng
                  thẳng.
                </p>
                <p>
                  Cần sòng phẳng: đây là lớp lý thuyết hấp dẫn nhưng {strong('trừu tượng và khó đo')}{' '}
                  hơn cả bốn trục. Hãy dùng nó như khung để tự quan sát, đừng coi là sự thật đã được
                  kiểm định.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="mbti"
        concept="Vì sao cùng một nhóm mà hai người vẫn khác nhau"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hai bạn cùng tên “Nam” vẫn là {strong('hai người khác nhau')}. Cùng một nhóm MBTI
                cũng vậy: giống nhau ở vài thiên hướng lớn, nhưng mỗi người một câu chuyện riêng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  MBTI chỉ nắm {strong('bốn thiên hướng')}. Còn lại — trải nghiệm sống, văn hoá, tuổi
                  tác, mức mạnh yếu của từng thiên hướng — thì khác nhau ở mỗi người.
                </p>
                <p>
                  Người nằm {strong('gần ranh giới')} một trục lại càng dễ trông khác hẳn người
                  nghiêng hẳn về một bên, dù cả hai cùng một nhóm.
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
                  Cùng bốn chữ cái, hai người vẫn khác vì: mức độ nghiêng của mỗi trục khác nhau; các
                  chức năng phụ trợ và cấp ba phát triển tới đâu là tuỳ người; và tính cách trải trên
                  một {strong('dải liên tục')} nên một nhãn chỉ là điểm gần đúng.
                </p>
                <p>
                  Đó cũng là lý do {strong('đừng dùng một nhóm để tiên đoán chắc chắn')} hành vi cụ
                  thể của ai — nhóm gợi ý xu hướng chung, không quyết định từng lựa chọn của một con
                  người.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="mbti"
        concept="Vì sao giới chuyên môn khuyên đừng dùng MBTI để tuyển người"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                MBTI hỏi bạn {strong('thích dùng tay nào')}, chứ không chấm bạn viết chữ đẹp tới đâu.
                Muốn biết ai làm được việc thì phải xem họ làm, không thể nhìn nhóm tính cách rồi
                đoán.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  MBTI đo {strong('thiên hướng')} — kiểu nào bạn thấy tự nhiên — chứ không đo{' '}
                  {strong('năng lực')} hay kết quả công việc. Hai người cùng một nhóm vẫn có thể
                  người hợp việc này, người hợp việc kia.
                </p>
                <p>
                  Thêm nữa, kết quả còn đổi khi làm lại. Lấy nhóm MBTI ra để nhận hay loại ứng viên
                  vì thế dễ thành {strong('dán nhãn')}, gạt oan người vốn làm được.
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
                  MBTI đo thiên hướng, không đo hiệu quả, lại có {strong('độ tin cậy đo lại')} chưa
                  cao. Dựa vào nó để sàng lọc hay đề bạt vừa thiếu căn cứ, vừa dễ loại người oan — nên
                  giới chuyên môn từ lâu khuyến cáo {strong('không dùng MBTI cho tuyển dụng')}.
                </p>
                <p>
                  Chỗ nó hợp thì ngược lại: để mỗi người tự hiểu mình, và để một đội nhóm có ngôn ngữ
                  chung nói về khác biệt trong cách làm việc. Cùng một công cụ, dùng để cảm thông thì
                  mở ra hợp tác, dùng để chấm điểm người thì thành cái nhãn đóng khung.
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
    prompt: 'Vì sao nói chữ “I” (hướng nội) là một THIÊN HƯỚNG, chứ không phải một cái nhãn cố định?',
    answer: (
      <>
        Vì mỗi trục là thiên hướng tự nhiên (như chuyện thuận tay): người hướng nội vẫn giao tiếp
        được, chỉ là nạp lại năng lượng bằng thời gian ở một mình. Và vì là thiên hướng chứ không
        phải “ô đóng”, kết quả có thể thay đổi theo giai đoạn cuộc đời.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Trục N/S nói về điều gì?',
    choices: [
      { text: 'Hướng nội vs hướng ngoại', note: 'Đó là trục I/E (nguồn năng lượng).' },
      {
        text: 'Chú ý vào khả năng & mẫu hình (Trực giác) vs vào chi tiết & dữ kiện (Cảm nhận)',
        correct: true,
        note: 'Đúng. N = iNtuition, S = Sensing.',
      },
      { text: 'Quyết định theo logic vs theo cảm xúc', note: 'Đó là trục T/F (cách quyết định).' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'MBTI có phải một công cụ chẩn đoán đã được khoa học kiểm chứng chắc chắn không?',
    choices: [
      {
        text: 'Không — nó bị nhiều nhà tâm lý phản biện về độ tin cậy; dùng tốt nhất như khung tự phản tỉnh, kết hợp góc nhìn khác',
        correct: true,
        note: 'Đúng. MBTI là khung phân loại, không phải chẩn đoán.',
      },
      { text: 'Có, đây là chẩn đoán tâm lý y khoa chính thức', note: 'Không — MBTI không phải chẩn đoán.' },
      {
        text: 'Có, và kết quả của một người không bao giờ thay đổi',
        note: 'Không — kết quả có thể đổi theo giai đoạn cuộc đời.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Dùng MBTI thế nào cho đúng tinh thần?',
    choices: [
      { text: 'Để dán nhãn và phán xét người khác', note: 'Bài viết nói thẳng: đừng dùng MBTI để dán nhãn.' },
      {
        text: 'Để hiểu cách mình & người khác vận hành tự nhiên, từ đó cảm thông và hợp tác',
        correct: true,
        note: 'Đúng — đây là mục đích lành mạnh của MBTI.',
      },
      {
        text: 'Để biết chắc chắn nghề nào mình hợp và chốt luôn',
        note: 'MBTI gợi ý thiên hướng, không “chốt” số phận hay nghề nghiệp.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Một bạn ENFP và một bạn INTJ làm chung nhóm và hay xích mích. Dùng khung MBTI, giải thích vì sao họ dễ va nhau — và họ có thể bổ trợ nhau thế nào?',
    answer: (
      <>
        Cả hai cùng nghiêng {strong('N')} (thích ý tưởng, mẫu hình) nên dễ hợp về tầm nhìn. Nhưng họ
        khác ở {strong('T/F')} (INTJ quyết theo logic, ENFP cân nhắc giá trị/cảm xúc) và {strong('J/P')}{' '}
        (INTJ thích đóng kế hoạch, ENFP thích để mở, ứng biến) — nên dễ va khi một bên muốn chốt còn
        bên kia muốn linh hoạt. Bổ trợ: INTJ giúp cấu trúc và hoàn tất, ENFP giúp mở rộng ý tưởng và
        gắn kết mọi người. Nhớ: đây là thiên hướng để cảm thông, không phải lý do dán nhãn.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'MBTI bắt nguồn từ đâu?',
    choices: [
      {
        text: 'Từ thuyết các kiểu tâm lý của Carl Jung (1921), sau được Briggs và Myers hệ thống thành bộ câu hỏi 16 nhóm',
        correct: true,
        note: 'Đúng. Jung nêu lý thuyết; hai mẹ con Briggs–Myers biến nó thành bảng câu hỏi từ thập niên 1940.',
      },
      {
        text: 'Do một hãng công nghệ xây dựng gần đây bằng dữ liệu lớn',
        note: 'Không — gốc của MBTI có từ đầu thế kỷ 20, trước thời máy tính.',
      },
      {
        text: 'Là một chẩn đoán y khoa chính thức trong ngành tâm thần học',
        note: 'Không — MBTI không phải chẩn đoán y khoa.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Chuỗi chức năng nhận thức (trội → phụ trợ → cấp ba → kém) giúp giải thích điều gì mà bốn chữ cái không nói hết?',
    choices: [
      {
        text: 'Vì sao hai nhóm chung nhiều chữ cái vẫn vận hành khác nhau',
        correct: true,
        note: 'Đúng. Trật tự ưu tiên của các chức năng tạo nên “gu” xử lý riêng của từng nhóm.',
      },
      {
        text: 'Nhóm nào thông minh hơn nhóm nào',
        note: 'Không — MBTI không đo năng lực hay trí thông minh.',
      },
      {
        text: 'Nhóm nào là “phiên bản tốt hơn” trong 16 nhóm',
        note: 'Không có nhóm tốt hơn nhóm khác; mỗi nhóm là một thiên hướng.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Vận dụng: Một người bạn khoe “bài MBTI đúng từng câu về mình”. Dựa vào phần vị trí khoa học, hãy nêu một lý do vì sao mô tả có thể thấy “đúng” mà chưa chắc do bài đo trúng — và một lý do vì sao không nên dùng kết quả để chốt nghề cho bạn ấy.',
    answer: (
      <>
        Thấy “đúng” có thể do {strong('hiệu ứng Barnum')}: mô tả nhóm thường đủ chung chung để hầu
        như ai đọc cũng gật, chứ không hẳn vì bài đo trúng riêng bạn ấy. Không nên dùng để chốt nghề
        vì MBTI {strong('đo thiên hướng, không đo năng lực')} hay hiệu quả công việc, lại có thể ra
        kết quả khác khi làm lại — nó hợp để hiểu mình và bắt chuyện, không phải để quyết định con
        đường sự nghiệp.
      </>
    ),
  },
];

export function MbtiRecall() {
  return <ActiveRecall topicId="mbti" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được MBTI giúp trả lời câu hỏi gì về bản thân — và nó KHÔNG đo năng lực, không chẩn đoán.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả 4 trục (I/E, N/S, T/F, J/P) nói về điều gì và ghép thành 16 nhóm ra sao.',
  },
  {
    id: 'history',
    facet: 'Lịch sử',
    can: 'Kể được MBTI ra đời thế nào: từ thuyết Jung (1921) tới bộ câu hỏi của Briggs–Myers, và vì sao nó phổ biến nhưng không phải chuẩn học thuật.',
  },
  {
    id: 'functions',
    facet: 'Chức năng nhận thức',
    can: 'Đọc được chuỗi trội → phụ trợ → cấp ba → kém của một nhóm và nói được nó bổ sung gì so với bốn chữ cái.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt “thiên hướng” với “năng lực” và với “nhãn cố định” — vì sao “I” không có nghĩa không thể giao tiếp.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được vì sao MBTI bị phản biện về độ tin cậy, và nên dùng kết hợp các góc nhìn khác.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Dùng MBTI để giải thích vì sao hai người làm việc / ra quyết định khác nhau, và bổ trợ nhau thế nào.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao KHÔNG nên dùng MBTI để dán nhãn, phán xét, hay “chốt” số phận / nghề nghiệp.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại ý nghĩa một trục (vd N/S) cho người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd chuỗi chức năng nhận thức) bạn vẫn còn thấy mơ hồ.',
  },
];

export function MbtiChecklist() {
  return <UnderstandingChecklist topicId="mbti" facets={FACETS} />;
}

export function MbtiWhys() {
  return (
    <FiveWhys
      topicId="mbti"
      start={<>Một người có kết quả “INTP” nhưng tuần này thấy mình hành xử khác hẳn mô tả INTP.</>}
      chain={[
        {
          question: 'Vì sao một người “INTP” lại có lúc hành xử khác hẳn mô tả?',
          because: (
            <>
              Vì MBTI đo {strong('thiên hướng')}, không phải một khuôn cố định buộc người ta hành xử
              theo.
            </>
          ),
        },
        {
          question: 'Vì sao thiên hướng lại cho phép hành xử khác đi?',
          because: (
            <>
              Vì thiên hướng như {strong('“tay thuận”')} — bạn vẫn dùng được cả hai bên, chỉ là một
              bên thấy tự nhiên hơn.
            </>
          ),
        },
        {
          question: 'Vì sao con người không bị khóa vào một bên?',
          because: <>Vì người ta thích nghi theo hoàn cảnh; bối cảnh khác nhau gọi ra mặt khác nhau.</>,
        },
        {
          question: 'Vì sao kết quả lại có thể đổi theo thời gian?',
          because: <>Vì thiên hướng có thể dịch chuyển theo {strong('giai đoạn cuộc đời')} và trải nghiệm.</>,
        },
        {
          question: 'Vì sao vậy thì không nên dùng MBTI để “chốt” một người?',
          because: (
            <>
              Vì MBTI là khung {strong('tự phản tỉnh')} (còn bị phản biện về độ tin cậy), không phải
              chẩn đoán cố định.
            </>
          ),
        },
      ]}
      root={
        <>
          MBTI mô tả thiên hướng linh hoạt, không phải bản chất khắc đá. Dùng nó để hiểu và cảm thông
          cách mình & người khác vận hành — {strong('đừng')} dùng để dán nhãn hay khóa chặt ai vào
          một loại.
        </>
      }
    />
  );
}
