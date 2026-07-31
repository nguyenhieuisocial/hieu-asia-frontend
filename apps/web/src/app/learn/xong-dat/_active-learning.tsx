/**
 * Nội dung "học chủ động" cho trang /learn/xong-dat.
 *
 * GROUNDING — mọi quy tắc, mốc ngày và cách diễn đạt đều lấy từ:
 *   • lib/xong-dat.ts → defaultTargetYear() (kỳ Tết trang đang nói tới; lật vào
 *     mùng 1 và giữ hết mùng 3), tetMoc() (ngày dương của mùng 1 + ngày liền
 *     trước), cách chấm 3 lớp (chi × chi năm · chi × gia chủ · mệnh × gia chủ),
 *     TIER_META, và ghi chú "tuổi tính theo NĂM ÂM LỊCH".
 *   • lib/tai-lieu/xong-dat-guide.ts → howToChoose() 5 bước, DO_AND_DONT,
 *     XONG_DAT_DISCLAIMER (không có chuyện mời sai tuổi thì xui cả năm).
 *   • lib/sinh-con.ts → yearProfile(): can chi + nạp âm của một năm âm.
 *   • trang công cụ app/xong-dat/ và app/xong-dat/[tuoi] — phạm vi và giọng.
 *
 * PHÂN VAI (chống trùng bài): trang này sở hữu TỤC XÔNG ĐẤT — người đầu tiên
 * bước vào nhà sáng mùng Một, vì sao người Việt coi trọng chuyện đó, chọn người
 * thế nào và nghi thức ra sao. KHÔNG dạy lại hình học tam hợp – lục hợp – lục
 * xung (/learn/tam-hop-luc-xung), nạp âm và mệnh ngũ hành (/learn/nap-am), hay
 * cách chọn ngày giờ (/learn/trach-cat): chỉ nhắc một hai câu rồi link.
 *
 * ⚠️ Năm mục tiêu LẬT vào Tết nên mọi hàm ở đây gọi engine LÚC RENDER, tuyệt
 * đối không gán ra hằng số cấp module (xem ghi chú dài trong lib/nam-muc-tieu).
 *
 * Giọng: phong tục để THAM KHẢO, không phán định, không doạ vận hạn, không bán
 * lễ "giải hạn".
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
import { yearProfile } from '@/lib/sinh-con';
import { defaultTargetYear, tetMoc } from '@/lib/xong-dat';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

export function XongDatFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Gần Tết, cả nhà bắt đầu hỏi nhau một câu quen thuộc:{' '}
          {strong('“năm nay mời ai xông đất?”')} — rồi mỗi người nói một kiểu, người thì lo tuổi
          xung, người thì bảo cứ ai đến trước thì thôi, và không ai giải thích được vì sao.
        </>
      }
      why={
        <>
          Xông đất là {strong('tục mở đầu năm mới')} của người Việt: người đầu tiên bước vào nhà sau
          giao thừa được xem là người “mở khí” cho cả năm. Giá trị của nó nằm ở{' '}
          {strong('cảm giác khởi đầu')} — cả nhà thấy vui và yên tâm khi bước vào một chu kỳ mới.
        </>
      }
      what={
        <>
          Một nghi thức xã hội có {strong('mời trước')}, không phải phép tính về phúc hoạ. Phần “xem
          tuổi” chỉ là {strong('một lớp lọc tham khảo')} khi gia đình đằng nào cũng đang cân nhắc
          giữa vài người quen. {strong('Không phải')} một cơ chế nhân quả.
        </>
      }
      how={
        <>
          Chọn người trước, chọn tuổi sau. Phần tuổi được chấm công khai theo{' '}
          {strong('ba lớp')}: tuổi khách so với chi của năm, tuổi khách so với tuổi gia chủ, và mệnh
          nạp âm hai bên. Cộng ba lớp lại ra một trong bốn nhóm từ “rất hợp” tới “nên cân nhắc”.
        </>
      }
      soWhat={
        <>
          Để bạn {strong('chủ động và tử tế')}: hẹn trước người mình quý, dặn người nhà, chuẩn bị
          lời chúc và phong bao — thay vì để chuyện tuổi tác làm{' '}
          {strong('mất lòng người thân')} hoặc tốn tiền mua lễ “giải hạn”.
        </>
      }
    />
  );
}

export function XongDatDepth() {
  // Kỳ Tết đang nói tới lật vào mùng 1 → phải đọc lúc render, không cấp module.
  const targetYear = defaultTargetYear();
  const target = yearProfile(targetYear)!;
  const tet = tetMoc(targetYear);

  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="xong-dat"
        concept="Vì sao “người đầu tiên” lại được coi trọng đến thế"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy nghĩ tới trang đầu của một quyển vở mới. Ai cũng muốn viết trang đầu thật đẹp,
                vì nhìn nó là thấy vui cả quyển. {strong('Ngày mùng Một là trang đầu của một năm')},
                và người bước vào nhà đầu tiên giống như nét chữ đầu tiên trên trang ấy.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Người Việt có câu {strong('“đầu xuôi đuôi lọt”')}. Xông đất là cách gói câu nói ấy
                  thành một hành động cụ thể: chọn cho khoảnh khắc mở đầu một hình ảnh dễ chịu — một
                  người vui vẻ, chúc Tết, mừng tuổi trẻ con.
                </p>
                <p>
                  Cái được ở đây là {strong('cảm giác an tâm và không khí trong nhà')}, và cái đó có
                  thật. Nó không đến từ năm sinh của khách, mà từ việc cả nhà cùng chuẩn bị cho một
                  khởi đầu tử tế.
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
                  Nói cho chính xác, đây là một {strong('nghi thức đánh dấu mốc')}: cộng đồng gán ý
                  nghĩa cho một thời điểm chuyển giao rồi dựng quanh nó vài quy ước để mọi người có
                  việc mà làm. Cùng họ với tục mở hàng đầu năm hay lời chúc đầu năm.
                </p>
                <p>
                  Vì thế đừng đọc nó như một cơ chế nhân quả. hieu.asia nói thẳng trong phần ghi chú
                  của chính công cụ: {strong('không có chuyện mời sai tuổi thì xui cả năm')}. Quy
                  tắc thì tính ra được và luôn cho cùng kết quả với cùng dữ liệu, nhưng bản thân quy
                  tắc là tập tục truyền lại — không phải điều chắc chắn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="xong-dat"
        concept="Người xông đất là người được MỜI, không phải người tình cờ"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Giống như mời bạn tới dự sinh nhật: bố mẹ {strong('nhắn trước')} cho bạn ấy biết
                mấy giờ đến. Xông đất cũng vậy — nhà mình hẹn sẵn một người, chứ không ngồi chờ xem
                ai bấm chuông trước.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Đây là chỗ nhiều người hiểu ngược. Xông đất không phải cuộc chạy đua “ai đến trước
                  thì tính”, mà là một lời mời: {strong('hẹn trước, nói rõ giờ')}, để người được mời
                  chủ động và không ai vào nhà trước họ.
                </p>
                <p>
                  Kèm theo đó là một việc rất thực tế: dặn người nhà đi chơi giao thừa{' '}
                  {strong('về sau khi khách đã tới')}. Hoặc đơn giản hơn — để chính người trong nhà
                  xông đất cho nhà mình, điều này hoàn toàn được và không kiêng gì cả.
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
                  Hiểu xông đất là một {strong('lời mời có chuẩn bị')} sẽ gỡ được gần hết các tình
                  huống khó xử. Nếu là lời mời thì việc của gia chủ là chuẩn bị: chọn người, hẹn
                  giờ, dặn người nhà, có sẵn phong bao và một lời chúc thật lòng.
                </p>
                <p>
                  Còn nếu ai đó chưa được hẹn mà đã sang, thì{' '}
                  {strong('không có phép xử nào ngoài việc đón tử tế')}. Từ chối hay đuổi khách đã
                  trót vào nhà làm hỏng tình thân — và cái mất đó thì có thật, trong khi cái được
                  chỉ nằm trong một bảng tra.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="xong-dat"
        concept="Ba lớp xem tuổi: hai lớp con giáp, một lớp mệnh"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Người ta hỏi ba câu ngắn: tuổi của khách có {strong('hợp với năm mới')} không, có{' '}
                {strong('hợp với chủ nhà')} không, và {strong('mệnh')} hai bên có đỡ nhau không. Mỗi
                câu được cộng hoặc trừ vài điểm, cuối cùng cộng lại là xong.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lớp 1 so con giáp của khách với {strong('chi của năm')} — Tết {targetYear} là năm{' '}
                  {target.canChi}, chi năm là {target.zodiac.ten}. Lớp 2 so con giáp của khách với{' '}
                  {strong('tuổi gia chủ')}. Lớp 3 so {strong('mệnh nạp âm')} của hai bên theo vòng
                  tương sinh – tương khắc.
                </p>
                <p>
                  Bản thân cách tính “thế nào là hợp, thế nào là xung” không thuộc bài này: nó là
                  hình học của vòng 12 con giáp, có bài riêng. Mệnh ngũ hành cũng vậy. Ở đây bạn chỉ
                  cần biết {strong('ba lớp ấy được dùng để làm gì')}.
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
                  Điểm đáng nói không phải là bảng tra, mà là {strong('thứ tự ưu tiên')}. Trong hướng
                  dẫn của chính công cụ, bước đầu tiên là chọn người, và bước cuối cùng là chốt lại
                  bằng lẽ thường. Ba lớp tuổi nằm kẹp ở giữa — chúng chỉ để{' '}
                  {strong('xếp hạng vài phương án đã lọt vào vòng trong')}.
                </p>
                <p>
                  Trọng số cộng trừ là lựa chọn biên tập để xếp hạng và được công khai ngay trên
                  trang công cụ, không giấu. Nhập cùng dữ liệu thì luôn ra cùng kết quả — nhưng{' '}
                  {strong('tính được không có nghĩa là đúng')}: đó vẫn là quy ước truyền lại.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="xong-dat"
        concept="Tuổi tính theo năm ÂM lịch — ranh giới là mùng 1 Tết"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Con giáp không đổi vào ngày 1 tháng 1 dương lịch, mà đổi vào{' '}
                {strong('mùng 1 Tết')}. Ai sinh trước Tết thì vẫn mang con giáp của năm cũ, dù trên
                giấy khai sinh đã sang năm mới.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mùng 1 Tết {target.canChi} rơi vào {tet.thu}, ngày {strong(tet.ngay)} dương lịch.
                  Nghĩa là người sinh ngày {tet.ngayTruoc} vẫn thuộc{' '}
                  {strong('năm âm liền trước')}, không phải năm {targetYear}.
                </p>
                <p>
                  Đây là chỗ sai phổ biến nhất khi tra tay: lấy nhầm con giáp thì cả ba lớp đều lệch
                  theo. Ai sinh {strong('tháng 1 hoặc đầu tháng 2 dương lịch')} thì nên xác nhận lại
                  can chi trước khi đối chiếu.
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
                  Ngày mùng 1 không được gõ tay ở đâu cả: trang dò thẳng bằng bộ lịch âm trong hệ
                  thống, nên không có chuyện “bảng hết dữ liệu rồi im lặng sai”. Kỳ Tết đang nói tới
                  cũng {strong('tự lật vào mùng 1')} và được giữ hết mùng 3 — đúng ba ngày Tết, để
                  người đọc sáng mùng Một vẫn thấy năm mình đang mở.
                </p>
                <p>
                  Một hệ quả thực hành: nếu bạn tra ra kết quả lệch với người nhà, hãy{' '}
                  {strong('kiểm lại năm âm của cả khách lẫn gia chủ trước tiên')} — gần như luôn là
                  nguyên nhân, chứ không phải do hai bên dùng hai bảng tra khác nhau.
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
    prompt: 'Xông đất là gì, và ai được coi là người xông đất?',
    answer: (
      <>
        Là tục {strong('mở đầu năm mới')}: người đầu tiên bước vào nhà sau giao thừa được xem là
        người “mở khí” cho cả năm. Theo lệ, đó là {strong('người được mời trước')} và hẹn rõ giờ —
        không phải bất kỳ ai tình cờ bấm chuông sớm nhất.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Theo hướng dẫn của công cụ, bước ĐẦU TIÊN khi chọn người xông đất là gì?',
    choices: [
      {
        text: 'Tra tuổi nào tam hợp với chi của năm rồi tìm người có tuổi đó',
        note: 'Không — đó là bước 2. Xét tuổi chỉ diễn ra sau khi đã có vài người trong danh sách.',
      },
      {
        text: 'Chọn người trước: vui vẻ, hoà nhã, gia đình êm ấm, thật lòng quý gia đình bạn',
        correct: true,
        note: 'Đúng — và phần này không nằm trong bảng tra nào cả. Chọn được người rồi mới xét tới tuổi.',
      },
      {
        text: 'Xem ngày mùng Một năm đó có phải ngày hoàng đạo không',
        note: 'Không — đó là chuyện chọn ngày (trạch cát), một môn khác. Ngày xông đất luôn là mùng Một.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'open',
    prompt: 'Ba lớp dùng để chấm điểm một người xông đất là ba lớp nào?',
    answer: (
      <>
        Lớp 1: con giáp của khách so với {strong('chi của năm')}. Lớp 2: con giáp của khách so với{' '}
        {strong('tuổi gia chủ')}. Lớp 3: {strong('mệnh nạp âm')} của khách so với mệnh gia chủ theo
        vòng tương sinh – tương khắc. Ba lớp cộng lại thành một tổng, rồi tổng đó rơi vào một trong
        bốn nhóm.
      </>
    ),
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt:
      'Một người hợp tuổi gia chủ, nhưng mệnh của họ khắc mệnh gia chủ. Engine xếp trường hợp này thế nào?',
    choices: [
      {
        text: 'Vẫn tính bình thường — điểm cộng và điểm trừ bù nhau rồi lấy tổng',
        note: 'Không hẳn. Có một luật riêng cho các trường hợp nặng nhất, đứng trên phép cộng.',
      },
      {
        text: 'Xếp thẳng vào nhóm “nên cân nhắc”, dù tổng điểm có thể không thấp',
        correct: true,
        note: 'Đúng — lớp nào chạm mức trừ nặng nhất thì cắt thẳng, đúng thói quen kiêng phổ biến.',
      },
      {
        text: 'Bỏ qua lớp mệnh vì lớp con giáp quan trọng hơn',
        note: 'Không — cả ba lớp đều được tính, không lớp nào bị bỏ.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Người trong nhà tự xông đất cho nhà mình thì sao?',
    choices: [
      {
        text: 'Không được — người xông đất bắt buộc phải là khách từ ngoài vào',
        note: 'Không — hướng dẫn nói rõ đây là một cách hoàn toàn được, không kiêng gì.',
      },
      {
        text: 'Hoàn toàn được, không kiêng gì — đây là một cách xử lý gọn',
        correct: true,
        note: 'Đúng — thay vì canh cửa lo người lạ vào trước, nhà tự thu xếp là xong.',
      },
      {
        text: 'Được, nhưng phải làm lễ trước khi bước vào',
        note: 'Không — không có lễ nào cả, và hieu.asia không bán lễ “giải hạn”.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Vì sao tuổi phải tính theo năm âm lịch, và ai là người dễ bị tra nhầm con giáp nhất?',
    answer: (
      <>
        Vì con giáp đổi vào {strong('mùng 1 Tết')}, không phải ngày 1 tháng 1 dương lịch. Người sinh{' '}
        {strong('tháng 1 hoặc đầu tháng 2 dương lịch')} — tức trước Tết — thuộc năm âm liền trước.
        Lấy nhầm con giáp thì cả ba lớp chấm đều lệch theo.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: người bác họ cả nhà rất quý muốn sang chúc Tết sáng mùng Một, nhưng bảng tra xếp tuổi bác vào nhóm “nên cân nhắc”. Bạn xử lý thế nào?',
    answer: (
      <>
        Cứ đón bác tử tế. Cái mất khi nhắn một người thân “đừng sang” là{' '}
        {strong('có thật và khó vá')}; cái được chỉ là một quy ước tham khảo. Nếu vẫn muốn theo lệ,
        cách nhẹ nhàng là {strong('mời người khác tới sớm hơn')} và hẹn bác một khung giờ sau đó —
        không cần từ chối ai, càng không cần mua lễ “giải hạn”.
      </>
    ),
  },
];

export function XongDatRecall() {
  return <ActiveRecall topicId="xong-dat" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được xông đất giải quyết chuyện gì (mở đầu năm mới bằng một khoảnh khắc dễ chịu) và nó KHÔNG hứa gì (không phải cơ chế quyết định phúc hoạ cả năm).',
  },
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói rõ ai là người xông đất: người đầu tiên bước vào nhà sau giao thừa — và theo lệ là người được mời trước, hẹn rõ giờ.',
  },
  {
    id: 'order',
    facet: 'Thứ tự',
    can: 'Giải thích vì sao chọn người trước, chọn tuổi sau — và vì sao bước đầu tiên lẫn bước cuối cùng đều không nằm trong bảng tra nào.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Kể được ba lớp chấm điểm (chi khách với chi năm, chi khách với tuổi gia chủ, mệnh hai bên) và biết ba lớp đó cộng lại thành một tổng.',
  },
  {
    id: 'hard-rule',
    facet: 'Luật cắt',
    can: 'Nói được vì sao một lớp bị trừ nặng nhất sẽ đẩy thẳng người đó vào nhóm “nên cân nhắc”, dù tổng điểm chưa hẳn thấp.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt được tiêu chí tính từ năm sinh (tuổi, mệnh) với tiêu chí về con người (tính tình, sự thân thiết, hoàn cảnh trong năm) — và biết loại nào quan trọng hơn.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra bài này không dạy hình học tam hợp – lục xung, không dạy nạp âm, và không dạy chọn ngày giờ — mỗi thứ có bài riêng.',
  },
  {
    id: 'practice',
    facet: 'Vận dụng',
    can: 'Kể được việc cần làm trong thực tế: hẹn trước và nói rõ giờ, dặn người nhà, chuẩn bị phong bao và một lời chúc thật lòng.',
  },
  {
    id: 'ethics',
    facet: 'Cư xử',
    can: 'Nói được vì sao không nên từ chối hay đuổi khách đã trót vào nhà, và vì sao việc “kén người” có thể làm mất lòng họ hàng nhiều hơn là được lợi.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn vẫn thấy mơ hồ (vd vì sao trọng số lại là chừng ấy điểm) — và chấp nhận rằng đó là lựa chọn để xếp hạng, không phải chân lý.',
  },
];

export function XongDatChecklist() {
  return <UnderstandingChecklist topicId="xong-dat" facets={FACETS} />;
}

export function XongDatWhys() {
  return (
    <FiveWhys
      topicId="xong-dat"
      start={
        <>
          Chiều 30 Tết, cả nhà đang bàn chuyện mùng Một. Người bác họ rất thân định sang chúc Tết
          sáng sớm, nhưng có người vừa tra được rằng tuổi bác “không hợp”, và đề nghị nhắn bác dời
          sang mùng Hai.
        </>
      }
      chain={[
        {
          question: 'Vì sao nhắn một người thân “đừng sang” lại là cái giá quá đắt?',
          because: (
            <>
              Vì cái mất là {strong('có thật và khó vá')}: người bị dời lịch sẽ hiểu ra lý do, và
              cảm giác bị coi là điềm xấu thì ở lại rất lâu. Còn cái được chỉ là một{' '}
              {strong('quy ước để tham khảo')}.
            </>
          ),
        },
        {
          question: 'Vì sao gọi nó là quy ước tham khảo, trong khi bảng tra ra kết quả rõ ràng?',
          because: (
            <>
              Vì “tính ra được” và “đúng” là hai chuyện khác nhau. Cách chấm{' '}
              {strong('chỉ dùng năm sinh')} của hai người cộng với năm đang tới; nhập cùng dữ liệu
              thì luôn ra cùng kết quả, nhưng bản thân các quy tắc ấy là{' '}
              {strong('tập tục truyền lại')}, không phải điều chắc chắn.
            </>
          ),
        },
        {
          question: 'Vậy vì sao một tập tục như thế vẫn được giữ tới hôm nay?',
          because: (
            <>
              Vì nó gói một mong muốn rất người: {strong('mở đầu một chu kỳ bằng điều dễ chịu')}.
              “Đầu xuôi đuôi lọt” — cả nhà cùng chuẩn bị cho khoảnh khắc đầu tiên của năm, và cảm
              giác an tâm sinh ra từ đó là thật.
            </>
          ),
        },
        {
          question: 'Nếu giá trị nằm ở khoảnh khắc mở đầu, thì thứ gì thật sự quyết định nó?',
          because: (
            <>
              {strong('Con người bước vào cửa')}, không phải con số năm sinh. Chính hướng dẫn của
              công cụ đặt tiêu chí ấy ở bước đầu tiên — người vui vẻ, hoà nhã, thật lòng quý gia
              đình bạn — và nhắc lại ở bước cuối: một người quen thân, đến sớm, cười nói vui vẻ vẫn
              hơn một cái tên đẹp trên bảng tra mà cả nhà đều gượng gạo.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên làm gì cho gọn và cho tử tế?',
          because: (
            <>
              {strong('Mời trước người mình quý')}, hẹn rõ giờ, dặn người nhà về sau khi khách đã
              tới — hoặc để chính người nhà xông đất, điều đó hoàn toàn được. Ai đã trót sang thì đón
              tử tế. Và {strong('không cần mua lễ giải hạn')} vì lỡ mời “sai tuổi”: đó chính là chỗ
              người ta hay bán nỗi sợ.
            </>
          ),
        },
      ]}
      root={
        <>
          Xông đất là một nghi thức để cả nhà bước vào năm mới trong tâm thế vui vẻ — không phải cái
          van đóng mở vận may. Hiểu đúng thì bạn giữ được cả hai:{' '}
          {strong('tôn trọng nếp nhà')} và {strong('không đánh đổi tình thân')} lấy một dòng trong
          bảng tra.
        </>
      }
    />
  );
}
