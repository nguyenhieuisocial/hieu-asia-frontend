/**
 * Nội dung "học chủ động" cho trang /learn/tarot.
 *
 * TẤT CẢ grounded từ chính bài viết Tarot (78 lá = 22 Ẩn Chính + 56 Ẩn Phụ,
 * bốn chất Gậy–Cốc–Kiếm–Tiền, hành trình Gã Khờ, các lá hay bị hù dọa, lá ngược,
 * cốt truyện số Át→10, lá-của-ngày chung cho mọi người, các kiểu trải bài,
 * đọc tổng thể). KHÔNG thêm dữ kiện mới. Giữ giọng "lá bài là
 * lăng kính để hiểu mình, không phán số mệnh" — tham khảo / góc nhìn, không phán định.
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

export function TarotFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao dừng lại soi một tình huống đang rối — nên nghĩ gì, cảm gì, làm gì — để hiểu mình rõ
          hơn rồi tự ra quyết định, thay vì cứ luẩn quẩn trong đầu?
        </>
      }
      why={
        <>
          Tarot ra đời khoảng thế kỷ 15 ở Ý như bài chơi, mãi cuối thế kỷ 18 mới được gán nghĩa bói
          toán. Ở đây nó tồn tại như một {strong('lăng kính để tự suy ngẫm')} — mỗi lá gợi một câu
          hỏi, không phải lời tiên tri.
        </>
      }
      what={
        <>
          Một bộ {strong('78 lá')}: 22 Ẩn Chính (chủ đề lớn, bước ngoặt) và 56 Ẩn Phụ (đời sống
          thường ngày, chia 4 chất). {strong('Không phải')} công cụ bói tương lai hay phán “sắp giàu /
          sắp chia tay / gặp hạn” — lá bài gợi câu hỏi, bạn giữ câu trả lời.
        </>
      }
      how={
        <>
          Đặt một câu hỏi mở trong lòng → rút lá (một lá, ba lá, hoặc trải sâu hơn) → đọc. Người đọc
          giỏi {strong('không đọc từng lá rời')}: nhìn bức tranh chung trước — tỉ lệ Ẩn Chính / Ẩn
          Phụ, chất nào áp đảo — rồi mới soi từng lá trong ngữ cảnh câu hỏi.
        </>
      }
      soWhat={
        <>
          Để {strong('hiểu mình và ra quyết định tỉnh táo hơn')} — không đổi vận, không giải hạn,
          không thay lời khuyên y tế / pháp lý / tài chính. Kết quả luôn là “xu hướng nếu giữ nguyên
          hướng đi”, không phải định mệnh cứng.
        </>
      }
    />
  );
}

export function TarotDepth() {
  return (
    <div className="space-y-4">
      <DepthTabs
        topicId="tarot"
        concept="Vì sao không đọc từng lá rời — đọc cả bức tranh chung"
        levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đừng đoán cả câu chuyện chỉ bằng một bức tranh. Rút được một lá trông “đáng sợ” rồi
              hoảng là sai. Phải nhìn {strong('cả bộ tranh vừa rút')} cùng nhau — và nhớ mình đang hỏi
              điều gì — mới ra ý nghĩa thật.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Người đọc giỏi nhìn {strong('bức tranh chung')} trước khi chốt từng lá: nhiều Ẩn Chính
                nghĩa là chủ đề lớn, bài học sâu; toàn Ẩn Phụ nghĩa là chuyện đời thường trong tầm
                xoay xở.
              </p>
              <p>
                {strong('Chất')} nào áp đảo cho biết trọng tâm: nhiều Kiếm → nặng về đầu óc / xung
                đột; nhiều Cốc → cảm xúc / quan hệ; nhiều Gậy → hành động; nhiều Tiền → tiền bạc /
                thực tế. Cùng một lá, đặt cạnh các lá khác và gắn vào câu hỏi của bạn, sẽ mang sắc
                thái khác nhau.
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
                Một mạch đọc có lớp lang: (1) đọc tỉ lệ {strong('Ẩn Chính / Ẩn Phụ')} để định độ lớn
                của chủ đề; (2) xem chất nào áp đảo để định trọng tâm (Gậy Lửa, Cốc Nước, Kiếm Khí,
                Tiền Đất — theo chuẩn RWS/Golden Dawn); (3) với Ẩn Phụ có thể mượn “cốt truyện số”
                Át→10; (4) đọc từng lá trong ngữ cảnh vị trí trải bài và câu hỏi.
              </p>
              <p>
                Và “lá nặng” không đồng nghĩa với điềm xấu: {strong('Cái Chết')} là chuyển hóa,{' '}
                {strong('Tòa Tháp')} là phơi bày nền móng sai để xây lại đúng. {strong('Lá ngược')}{' '}
                cũng không tự động xấu — thường là năng lượng bị nghẽn / hướng vào trong, và với các lá
                nặng chiều ngược hay là dấu phục hồi. Có trường phái đọc tất cả như xuôi; đó là lựa
                chọn hợp lệ.
              </p>
            </>
          ),
        },
        ]}
      />
      <DepthTabs
        topicId="tarot"
        concept="Lá hoàng gia (court cards) đang chỉ ai?"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trong bộ bài có 16 lá vẽ người: Thị Đồng, Hiệp Sĩ, Hoàng Hậu, Vua. Lá vẽ người
                {strong(' không nhất thiết là một người khác')} — nhiều khi nó là một phần của
                chính mình, giống như mình lúc thì ham chơi, lúc thì nghiêm túc.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Một lá hoàng gia có thể chỉ (a) {strong('một người thật')} quanh bạn, (b){' '}
                  {strong('một mặt của chính bạn')}, hoặc (c) {strong('một kiểu năng lượng')},
                  cách hành xử.
                </p>
                <p>
                  Đọc theo hai trục: {strong('cấp bậc')} = mức trưởng thành của năng lượng (Thị
                  Đồng học việc → Hiệp Sĩ lao đi → Hoàng Hậu làm chủ từ bên trong → Vua làm chủ
                  hướng ra ngoài); {strong('chất')} = lĩnh vực (Gậy ý chí, Cốc cảm xúc, Kiếm tư
                  duy, Tiền thực tế).
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
                  Ghép hai trục cho chân dung đủ sắc thái: {strong('Hoàng Hậu Cốc')} = làm chủ
                  cảm xúc từ bên trong — thấu cảm sâu mà vẫn giữ được mình; chiều ngược là chìm
                  trong cảm xúc người khác đến kiệt. {strong('Hiệp Sĩ')} là thái cực của chất
                  (quá nhiều hoặc quá ít) nên thường là lá "đậm và bốc" nhất trong bốn cấp.
                </p>
                <p>
                  Khi rút trúng lá hoàng gia, câu làm việc tốt nhất là hỏi: lá này gợi đến ai —
                  hay khía cạnh nào của chính mình? {strong('Không chốt cứng')} "đây là người
                  X".
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="tarot"
        concept="Lá ngược (reversed) nghĩa là gì?"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Lá lật ngược {strong('không phải lá xấu')}. Nó giống chiếc đèn đang bị che bớt:
                ánh sáng vẫn là ánh sáng, chỉ đang bị chặn lại, hoặc đang chiếu vào bên trong.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Bốn cách luận phổ biến: (1) {strong('nghẽn / chậm lại')} — năng lượng bị cản,
                đến trễ; (2) {strong('hướng vào trong')} — chuyện đang diễn ra bên trong thay vì
                ra ngoài; (3) {strong('thái quá hoặc thiếu hụt')}; (4){' '}
                {strong('đang gỡ / sắp qua')} — với lá "nặng" như Ba Kiếm, Mười Kiếm, chiều
                ngược hay là dấu phục hồi.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Không cách nào là duy nhất đúng — chọn theo ngữ cảnh câu hỏi và cả trải bài.
                  Ví dụ cùng quy tắc "thái quá / thiếu hụt" nhưng hai hướng ngược nhau: Tiết Độ
                  ngược = mất điều độ (thái quá), Sức Mạnh ngược = thiếu tự tin (thiếu hụt).
                </p>
                <p>
                  Có trường phái {strong('bỏ hẳn lá ngược')}, đọc tất cả như xuôi và để toàn
                  cảnh trải bài quyết sắc thái — lựa chọn hợp lệ. Công cụ ở đây có rút chiều
                  ngược (50/50 mỗi lá) và luôn khung nó là {strong('"mặt trầm để soi"')}, không
                  phải điềm gở.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="tarot"
        concept="Cốt truyện số Át→10 — một mạch lặp ở cả bốn chất"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                40 lá số giống {strong('bốn cuốn truyện kể cùng một câu chuyện')}: bắt đầu (Át),
                gặp khó ở giữa đường (5), về đích (10). Mỗi cuốn chỉ khác ở chỗ nó kể về gì —
                chuyện làm, chuyện thương, chuyện nghĩ, hay chuyện có. Thuộc một cốt truyện là
                đoán được hướng của cả bốn cuốn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mạch đầy đủ: {strong('Át')} là hạt mầm thuần khiết nhất của chất; 2 lựa chọn
                  đôi; 3 thành hình bước đầu; 4 ổn định, đôi khi trì trệ; {strong('5 xáo trộn')};
                  6 hồi phục; 7 đánh giá, kiên trì; 8 vận động; 9 gần trọn, đỉnh cảm xúc của
                  chất; {strong('10 trọn vẹn hoặc quá tải')} — đỉnh điểm, chuyển sang chu kỳ mới.
                </p>
                <p>
                  Cùng một số qua bốn chất là {strong('cùng mô-típ, mỗi chất một mặt đời')}: Năm
                  Gậy là ý kiến va nhau, Năm Cốc là nỗi buồn cho phần đã đổ, Năm Kiếm hỏi
                  {' "'}thắng keo này mất gì{'"'}, Năm Tiền là mùa đông vật chất.
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
                  Đây là {strong('khung gợi ý, không phải công thức cứng')}: sắc thái từng lá vẫn
                  lệch theo chất — số 8 chẳng hạn, là vận động nhanh, chuyên cần, hay rời đi tùy
                  chất. Vì vậy công cụ trên hieu.asia viết nghĩa từng lá riêng, không sinh máy
                  móc theo số × chất; khi đọc, ưu tiên nghĩa cụ thể của lá hơn là suy từ số.
                </p>
                <p>
                  Chỗ dùng đắt nhất của cốt truyện số là {strong('đọc tổng thể')}: nhiều lá cùng
                  số trong một trải (vd ba lá số 5) cho thấy cùng một mô-típ đang lặp ở nhiều mặt
                  đời sống. Nó khoanh vùng chủ đề để soi kỹ hơn, không phải {'"'}điềm xấu nhân
                  ba{'"'}.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="tarot"
        concept="Vì sao lá-của-ngày chung cho mọi người — Tarot ở đây không tiên tri"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi ngày trang web lật ra một lá, {strong('ai vào xem cũng thấy đúng lá đó')} —
                giống câu đố treo trước cửa lớp: cả lớp đọc chung một câu, nhưng mỗi bạn nghĩ ra
                câu trả lời của riêng mình. Lá bài là câu đố gợi nghĩ, không phải quả cầu tiên
                tri.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Tarot ra đời ở Ý thế kỷ 15 như bài chơi; mãi cuối thế kỷ 18 mới được gán nghĩa
                  bói toán. Nghĩa {'"'}tiên tri{'"'} là {strong('lớp gán thêm về sau')}, không
                  phải bản chất gốc của bộ bài.
                </p>
                <p>
                  Trên hieu.asia, một lá rút ra là {strong('một câu hỏi gợi mở')}: lấy nghĩa cốt
                  lõi cộng một câu hỏi tự soi, rồi áp vào tình huống thật của mình. Lá {'"'}tương
                  lai{'"'} hay {'"'}kết quả{'"'} luôn được khung là xu hướng nếu giữ nguyên hướng
                  đi — người hỏi vẫn là người chọn.
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
                  Lá-của-ngày cố định theo ngày (giờ Việt Nam) và {strong('chung cho mọi người')}{' '}
                  — công cụ nói thẳng nó không phải tiên đoán về ngày của bạn. Nếu lá bài
                  {' "'}biết trước{'"'} chuyện riêng từng người thì một lá chung cho tất cả là vô
                  nghĩa; nó đứng được chính vì giá trị nằm ở {strong('phía người soi')}: cùng một
                  lá, mỗi người mang một tình huống và một câu hỏi khác nên soi ra một điều khác.
                </p>
                <p>
                  Cùng logic đó, một buổi đọc tử tế không phán {'"'}sắp giàu / sắp chia tay / gặp
                  hạn{'"'}, không bán {'"'}đổi vận, giải hạn{'"'}, và không thay lời khuyên y tế,
                  pháp lý, tài chính. Tarot ở đây để{' '}
                  {strong('hiểu mình và ra quyết định tỉnh táo hơn')} — quyền quyết định luôn ở
                  người hỏi.
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
    prompt: 'Vì sao “rút được một lá trông đáng sợ rồi hoảng” là cách đọc Tarot sai?',
    answer: (
      <>
        Vì không đọc từng lá rời. Người đọc giỏi nhìn {strong('bức tranh chung')} trước — tỉ lệ Ẩn
        Chính / Ẩn Phụ, chất nào áp đảo — rồi mới soi từng lá trong ngữ cảnh câu hỏi. Một lá đứng
        riêng, tách khỏi các lá khác và khỏi câu hỏi, chưa nói lên điều gì.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Bốn chất Gậy – Cốc – Kiếm – Tiền ứng với nguyên tố nào (theo chuẩn RWS/Golden Dawn)?',
    choices: [
      {
        text: 'Gậy = Lửa, Cốc = Nước, Kiếm = Khí, Tiền = Đất',
        correct: true,
        note: 'Đúng — hieu.asia theo chuẩn RWS/Golden Dawn.',
      },
      {
        text: 'Gậy = Khí, Cốc = Nước, Kiếm = Lửa, Tiền = Đất',
        note: 'Đây là biến thể ảnh hưởng từ Aleister Crowley (đảo Gậy và Kiếm), không phải chuẩn dùng ở đây.',
      },
      {
        text: 'Cả bốn chất đều ứng chung một nguyên tố',
        note: 'Không — mỗi chất ứng một nguyên tố và một lĩnh vực đời sống riêng.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Lá 13 Cái Chết trong Tarot thường nói về điều gì?',
    choices: [
      {
        text: 'Sự chuyển hóa — một giai đoạn / vai trò kết thúc để mở chỗ cho cái mới',
        correct: true,
        note: 'Đúng — gần như không bao giờ nói về cái chết thật.',
      },
      { text: 'Một điềm báo cái chết thật sắp xảy ra', note: 'Không — đây chính là ngộ nhận phổ biến nhất về lá này.' },
      { text: 'Lá bài đã bị rút sai, cần xáo lại', note: 'Không — Cái Chết là một lá hợp lệ trong 22 Ẩn Chính.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Lá ngược (reversed) có phải luôn mang nghĩa xấu không?',
    choices: [
      {
        text: 'Có — lá ngược luôn là điềm xấu',
        note: 'Sai — lá ngược không tự động xấu.',
      },
      {
        text: 'Không — thường là năng lượng bị nghẽn / hướng vào trong; với các lá “nặng” chiều ngược hay là dấu phục hồi',
        correct: true,
        note: 'Đúng. Có trường phái còn đọc tất cả như xuôi, đó cũng là lựa chọn hợp lệ.',
      },
      { text: 'Lá ngược không có nghĩa gì, luôn bỏ qua', note: 'Không — nó mang sắc thái riêng, chỉ là không tự động xấu.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Cùng một câu hỏi, hai lượt rút cho ra các lá khác nhau; một buổi đọc tử tế vẫn dẫn tới ý nghĩa khác nhau. Nêu ít nhất một lý do.',
    answer: (
      <>
        Lý do rõ nhất là {strong('bức tranh chung')} khác nhau: tỉ lệ Ẩn Chính / Ẩn Phụ cho biết chủ
        đề lớn hay chuyện đời thường, và {strong('chất áp đảo')} định trọng tâm (nhiều Kiếm → đầu óc /
        xung đột, nhiều Cốc → cảm xúc, nhiều Gậy → hành động, nhiều Tiền → thực tế). Ngoài ra{' '}
        {strong('vị trí trải bài')} và {strong('câu hỏi')} bạn đặt cũng làm cùng một lá mang nghĩa
        khác — vì mỗi lần rút phản ánh câu hỏi và tâm thế ngay lúc đó.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Rút trúng một lá hoàng gia (ví dụ Hoàng Hậu Cốc), nên hiểu lá này chỉ ai?',
    choices: [
      {
        text: 'Có thể là một người thật, một mặt của chính mình, hoặc một kiểu năng lượng — tự hỏi lá gợi đến ai / khía cạnh nào',
        correct: true,
        note: 'Đúng — khung hai trục cấp bậc × chất giúp đọc, nhưng không chốt cứng.',
      },
      {
        text: 'Luôn là một người thật ngoài đời mà mình cần dè chừng',
        note: 'Không — chốt cứng "đây là người X" là cách đọc dễ sai nhất với lá hoàng gia.',
      },
      {
        text: 'Cấp bậc của lá cho biết tuổi tác hay tình trạng hôn nhân của người đó',
        note: 'Không — cấp bậc nói về mức trưởng thành của năng lượng, không phải nhân khẩu học.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Trong trải bài Celtic Cross, lá số 10 "Kết quả khả dĩ" nên hiểu thế nào?',
    choices: [
      {
        text: 'Xu hướng nếu giữ nguyên đường đi — người hỏi vẫn là người chọn',
        correct: true,
        note: 'Đúng — lá 10 không phải định mệnh cứng.',
      },
      {
        text: 'Định mệnh chắc chắn xảy ra, không thay đổi được',
        note: 'Sai — chính bài đã nhấn: lá "kết quả" luôn được khung là xu hướng, quyền tự quyết ở người hỏi.',
      },
      {
        text: 'Lá quan trọng duy nhất; chín lá còn lại chỉ phụ họa',
        note: 'Không — mỗi ô có vai trò riêng, và tổng thể trải bài quan trọng hơn từng lá.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Một trải bài ra ba lá cùng số 5 (Năm Gậy, Năm Cốc, Năm Tiền). Theo cách đọc tổng thể, điều đó gợi gì?',
    answer: (
      <>
        Số lặp là một tín hiệu tổng thể: {strong('cùng một mô-típ đang lặp ở nhiều mặt đời sống')}.
        Trong cốt truyện số, 5 là xáo trộn, va chạm — thử thách giữa chặng: ý kiến va nhau (Gậy),
        nỗi buồn cho phần đã mất (Cốc), mùa đông vật chất (Tiền). Không phải "điềm xấu nhân ba" —
        nó khoanh vùng chủ đề để mình soi kỹ hơn.
      </>
    ),
  },
];

export function TarotRecall() {
  return <ActiveRecall topicId="tarot" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Tarot dùng để làm gì (lăng kính dừng lại soi một tình huống để hiểu mình) — và nó KHÔNG hứa gì (không bói tương lai, không đổi vận, không thay y tế/pháp lý/tài chính).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch đọc: nhìn bức tranh chung (tỉ lệ Ẩn Chính/Ẩn Phụ, chất áp đảo) trước → rồi soi từng lá trong ngữ cảnh vị trí trải bài và câu hỏi.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt 22 Ẩn Chính (chủ đề lớn, bước ngoặt) với 56 Ẩn Phụ (đời sống thường ngày, 4 chất) — và nói được vì sao KHÔNG đọc một lá rời.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của Tarot và vì sao có dị biệt giữa các trường phái (đánh số Sức Mạnh/Công Lý, nguyên tố Gậy/Kiếm, dùng hay không dùng lá ngược) — tham khảo, không tuyệt đối.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao cùng một câu hỏi mà hai lượt rút vẫn dẫn tới ý nghĩa khác nhau (bức tranh chung, chất áp đảo, vị trí trải bài, tâm thế lúc rút).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao Cái Chết không = chết thật, Tòa Tháp/Ác Quỷ/Mặt Trăng không = điềm gở, và lá ngược không = luôn xấu.',
  },
  {
    id: 'court',
    facet: 'Lá hoàng gia',
    can: 'Đọc một lá hoàng gia theo hai trục (cấp bậc × chất) — và nói được vì sao không chốt cứng "đây là người X".',
  },
  {
    id: 'spread',
    facet: 'Trải bài',
    can: 'Kể được vai trò các ô trong trải một lá / ba lá / Celtic Cross — và giải thích vì sao lá "kết quả" chỉ là xu hướng nếu giữ nguyên hướng đi.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “đọc cả bức tranh, không đọc từng lá rời” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd bốn chất, mạch số Át→10, hành trình Gã Khờ) bạn vẫn còn thấy mơ hồ.',
  },
];

export function TarotChecklist() {
  return <UnderstandingChecklist topicId="tarot" facets={FACETS} />;
}

export function TarotWhys() {
  return (
    <FiveWhys
      topicId="tarot"
      start={
        <>
          Người mới rút bài thấy lá Cái Chết hiện lên, liền hoảng “sắp có chuyện chẳng lành”.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy lá Cái Chết rồi hoảng lại là sai?',
          because: (
            <>
              Vì lá Cái Chết gần như {strong('không bao giờ')} nói về cái chết thật — nó là chuyển
              hóa, một giai đoạn kết thúc để mở chỗ cho cái mới.
            </>
          ),
        },
        {
          question: 'Vì sao không được kết luận chỉ từ một lá như vậy?',
          because: (
            <>
              Vì Tarot {strong('không đọc từng lá rời')}: phải nhìn bức tranh chung — tỉ lệ Ẩn Chính /
              Ẩn Phụ, chất nào áp đảo — rồi mới soi từng lá.
            </>
          ),
        },
        {
          question: 'Vì sao phải nhìn cả bức tranh chung?',
          because: (
            <>
              Vì các lá {strong('bổ nghĩa cho nhau')}: cùng một lá đặt cạnh các lá khác, ở vị trí trải
              bài khác, sẽ mang sắc thái khác.
            </>
          ),
        },
        {
          question: 'Vì sao ngữ cảnh lại đổi nghĩa một lá như vậy?',
          because: (
            <>
              Vì mỗi lần rút phản ánh {strong('câu hỏi và tâm thế ngay lúc đó')} — lá bài là lăng kính
              để soi tình huống của bạn, không phải lời phán cố định.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc Tarot?',
          because: (
            <>
              Vì mục đích là {strong('hiểu mình để tự quyết định')}, không bắt một lá bài phán số mệnh
              — bạn vẫn luôn là người giữ câu trả lời.
            </>
          ),
        },
      ]}
      root={
        <>
          Tarot là một lăng kính phản tư, không phải lời tiên tri. Một lá đứng riêng chưa nói lên điều
          gì — đọc lẻ một lá và hù dọa chính mình là cách chắc chắn nhất để hiểu sai. Luôn đặt nó
          trong cả bức tranh chung và câu hỏi bạn đang soi.
        </>
      }
    />
  );
}
