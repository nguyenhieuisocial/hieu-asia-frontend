/**
 * Nội dung "học chủ động" cho trang /learn/hoang-oc.
 *
 * GROUNDING (không có dữ kiện nào ngoài hai nguồn này):
 *   • src/lib/xem-tuoi-lam-nha.ts — HOANG_OC_BY_STEP (6 cung, tốt/xấu, lời chú
 *     giải), checkHoangOc (tuổi mụ = năm khởi công − năm sinh + 1; bước =
 *     tuổi mụ % 6, dư 0 tính là 6), checkBuildYear (xét tuổi người đứng ra
 *     khởi công; phạm bất kỳ hạn nào trong Kim Lâu / Hoang Ốc / Tam Tai là
 *     "không được tuổi"; lục xung chỉ là điểm trừ nhẹ).
 *   • trang công cụ src/app/xem-tuoi-lam-nha/** — FAQ tục mượn tuổi (người
 *     thân/quen nam giới, thường lớn tuổi hơn, không phạm cả ba hạn năm đó,
 *     đứng ra khởi công thay, giấy bán nhà tượng trưng rồi chuộc lại khi
 *     xong), lưu ý tuổi mụ theo năm âm lịch, và giọng "không doạ, không bán
 *     lễ giải hạn — quyết định thật nằm ở tài chính, giấy phép, mùa thi công".
 *
 * KHÔNG lấn sang bài khác: Kim Lâu, Tam Tai, Bát Trạch/hướng nhà chỉ được
 * nhắc TÊN để phân biệt, không giải thích cách tính.
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

export function HoangOcFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Gia đình sắp xây hoặc sửa nhà, người lớn trong nhà hỏi{' '}
          {strong('“năm nay có được tuổi không”')} — và bạn muốn hiểu con số ấy ở đâu ra trước khi
          quyết định hoãn hay làm.
        </>
      }
      why={
        <>
          Làm nhà là việc lớn, tốn kém và khó sửa lại. Người xưa cần một{' '}
          {strong('mốc chung để cả nhà cùng dừng lại cân nhắc')} trước khi động thổ — Hoang Ốc là một
          trong những mốc đó, dùng riêng cho chuyện làm nhà.
        </>
      }
      what={
        <>
          Một vòng {strong('6 cung')} tra từ tuổi mụ: Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài,
          Ngũ Thọ Tử, Lục Hoang Ốc. Ba cung được coi là tốt (1, 2, 4), ba cung dân gian kiêng khởi
          công (3, 5, 6). {strong('Không phải')} lời phán nhà sẽ hỏng hay người sẽ gặp hoạ.
        </>
      }
      how={
        <>
          Lấy {strong('tuổi mụ')} (≈ năm khởi công − năm sinh + 1) của{' '}
          {strong('người đứng ra khởi công')}, chia 6 lấy phần dư (dư 0 tính là 6), rồi đọc tên cung
          tương ứng. Chỉ một phép chia — không cần giờ sinh, không cần lá số.
        </>
      }
      soWhat={
        <>
          Để biết {strong('vì sao')} có kết luận đó thay vì nghe một lời phán, và để hiểu tục{' '}
          {strong('mượn tuổi')} — cách dân gian xử lý khi gia chủ phạm cung xấu mà vẫn cần xây.
          Quyết định cuối vẫn nên dựa trên tài chính, giấy phép và mùa thi công.
        </>
      }
    />
  );
}

export function HoangOcDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="hoang-oc"
        concept="Vì sao Hoang Ốc chỉ cần đúng một phép chia cho 6"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tưởng tượng một vòng tròn có {strong('6 ô')}, giống ô cờ cá ngựa. Bạn bao nhiêu tuổi
                thì đếm bấy nhiêu ô, hết vòng thì quay lại ô đầu. Dừng ở ô nào thì ô đó là “cung” của
                bạn năm ấy. Có ô người xưa bảo đẹp, có ô người xưa bảo nên đợi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Vòng có đúng 6 cung nên thay vì đếm từng ô, chỉ cần lấy {strong('tuổi mụ chia 6')}{' '}
                  và giữ phần dư. Dư 1 là cung 1, dư 2 là cung 2… riêng {strong('dư 0 tính là cung 6')}{' '}
                  (vì đếm hết đúng một vòng thì dừng ở ô cuối, không phải ô số 0).
                </p>
                <p>
                  Hệ quả: cung Hoang Ốc {strong('lặp lại đúng 6 năm một lần')}. Năm nay bạn ở Lục
                  Hoang Ốc thì 6 năm nữa bạn lại ở Lục Hoang Ốc, đều đặn như kim đồng hồ.
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
                  Toàn bộ Hoang Ốc là một phép ánh xạ {strong('tuổi mụ → 1 trong 6 nhãn')}. Đầu vào
                  duy nhất là năm sinh (qua tuổi mụ) và năm khởi công; không có giới tính, không có
                  tháng – ngày – giờ sinh, không có dữ liệu về mảnh đất hay ngôi nhà.
                </p>
                <p>
                  Vì vậy nó chia mọi gia chủ trên đời thành đúng {strong('6 nhóm')} cho mỗi năm. Người
                  xây biệt thự ba tầng và người sửa lại cái bếp, nếu sinh cùng năm, sẽ nhận cùng một
                  kết luận. Biết độ thô đó là điều kiện để đọc kết quả cho đúng tầm: một lời nhắc
                  chung, không phải chẩn đoán riêng cho công trình của bạn.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="hoang-oc"
        concept="Ba cung xấu nói gì — và không nói gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trong 6 ô thì có 3 ô người xưa dặn {strong('“năm nay khoan đã”')} và 3 ô dặn “được
                đấy”. Ô dặn khoan đã không có nghĩa là nhà sẽ đổ — chỉ là lời dặn của người lớn để cả
                nhà nghĩ kỹ thêm.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Ba cung dân gian kiêng khởi công là {strong('Tam Địa Sát (3)')},{' '}
                  {strong('Ngũ Thọ Tử (5)')} và {strong('Lục Hoang Ốc (6)')}. Ba cung được coi là tốt
                  là {strong('Nhất Cát (1)')}, {strong('Nhì Nghi (2)')} và {strong('Tứ Tấn Tài (4)')}.
                </p>
                <p>
                  Đáng chú ý: bảng tra chỉ ghi ba cung xấu là “dân gian kiêng khởi công năm này” —{' '}
                  {strong('cùng một dòng chú giải cho cả ba')}. Tục dừng ở mức kiêng, không xếp cung
                  nào nặng hơn cung nào, và cũng không nói điều gì sẽ xảy ra nếu vẫn làm.
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
                  Tên các cung mang sắc thái rất mạnh — “Địa Sát”, “Thọ Tử” — nên dễ đọc thành lời
                  cảnh báo về tính mạng. Nhưng nội dung tra cứu thực tế chỉ có hai trạng thái:{' '}
                  {strong('kiêng')} hoặc {strong('không kiêng')}. Sức nặng nằm ở cái tên, không nằm ở
                  dữ liệu.
                </p>
                <p>
                  Ba cung xấu trên sáu cung nghĩa là {strong('một nửa số năm')} của bất kỳ ai cũng rơi
                  vào nhóm kiêng. Một quy tắc gạch đi phân nửa số năm thì bản thân việc “phạm” không
                  còn nhiều sức phân biệt — nên hãy đọc nó như mốc dừng để chuẩn bị kỹ, không phải
                  lệnh cấm.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="hoang-oc"
        concept="Mượn tuổi làm nhà — cơ chế thật đằng sau"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Nếu bố mẹ “không được tuổi” thì nhờ một {strong('bác trong họ')} đứng ra làm lễ khởi
                công hộ. Nhà vẫn là nhà mình, chỉ là hôm động thổ bác đứng tên thay. Xong nhà thì gia
                đình nhận lại, như trò đổi vai một lúc rồi trả về.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Theo tục, người được mượn tuổi thường là {strong('nam giới, người thân hoặc người quen')}
                  , {strong('lớn tuổi hơn gia chủ')}, và quan trọng nhất: năm đó{' '}
                  {strong('không phạm cả ba hạn')} Kim Lâu, Hoang Ốc, Tam Tai thì việc mượn mới được
                  coi là trọn vẹn.
                </p>
                <p>
                  Trình tự: gia chủ làm {strong('giấy bán nhà tượng trưng')} cho người đứng thay;
                  người đó đứng ra động thổ, khởi công; nhà hoàn thành thì gia chủ{' '}
                  {strong('chuộc lại')}. Toàn bộ là nghi thức, không phải giao dịch thật.
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
                  Vì sao mượn tuổi lại “có tác dụng” trong chính hệ này? Vì luật chơi ghi rõ: hạn xét
                  theo tuổi mụ của {strong('người đứng ra khởi công')}. Đổi người đứng ra khởi công là
                  đổi luôn con số được đem chia 6 — nên kết quả đổi theo. Đây là{' '}
                  {strong('hệ quả logic của chính quy tắc')}, không phải một phép thuật thứ hai được
                  thêm vào.
                </p>
                <p>
                  Và đó cũng là chỗ để nhìn cho tỉnh: một hệ mà tự nó mở sẵn lối ra bằng cách đổi
                  người đứng tên thì rõ ràng nó là {strong('nghi thức xã hội')}, không phải quy luật
                  tự nhiên. Giấy tượng trưng không đổi được nền móng, ngân sách hay mùa mưa — cái nó
                  đổi là sự yên tâm và đồng thuận trong nhà, thứ cũng có giá trị thật nhưng nên gọi
                  đúng tên.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="hoang-oc"
        concept="Hoang Ốc đứng đâu giữa các hạn khác khi làm nhà"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Khi làm nhà, người lớn giở {strong('mấy cuốn sổ')} khác nhau ra xem: sổ Hoang Ốc, sổ
                Kim Lâu, sổ Tam Tai, rồi còn sổ xem hướng nhà nữa. Mỗi cuốn có luật riêng, không
                cuốn nào thay được cuốn nào.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Khi chọn NĂM khởi công, dân gian thường xét ba hạn: {strong('Kim Lâu')},{' '}
                  {strong('Hoang Ốc')} và {strong('Tam Tai')}. Không phạm cả ba thì gọi là “được
                  tuổi”. Riêng Hoang Ốc là vòng dùng {strong('riêng cho chuyện làm nhà')} — đám cưới
                  không xét cung này.
                </p>
                <p>
                  Đó là lý do một người có thể {strong('cưới được')} trong năm nay mà vẫn chưa “được
                  tuổi” {strong('làm nhà')}: bộ hạn đem ra xét không giống nhau.
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
                  Ba lớp câu hỏi khác nhau, đừng trộn. {strong('Hoang Ốc / Kim Lâu / Tam Tai')} trả
                  lời “NĂM này có nên khởi công không” theo tuổi gia chủ. {strong('Chọn ngày động thổ')}{' '}
                  trả lời “NGÀY nào trong năm”. Còn {strong('hướng nhà (Bát Trạch)')} trả lời “nhà
                  quay về đâu” — không liên quan gì tới vòng 6 cung này.
                </p>
                <p>
                  Ngoài ba hạn chính còn một lưu ý nhẹ: chi của năm khởi công{' '}
                  {strong('lục xung')} với chi tuổi gia chủ. Trong cách tính của công cụ, đây chỉ là{' '}
                  {strong('điểm trừ')} khiến kết luận thành “cần cân nhắc”, không đủ để gọi là phạm
                  hạn.
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
    prompt: 'Hoang Ốc tra từ thông tin gì, và vòng này có bao nhiêu cung?',
    answer: (
      <>
        Tra từ {strong('tuổi mụ')} (≈ năm khởi công − năm sinh + 1) của người đứng ra khởi công.
        Vòng có {strong('6 cung')}: Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục
        Hoang Ốc. Lấy tuổi mụ chia 6 giữ phần dư (dư 0 tính là cung 6) rồi đọc tên cung.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ba cung nào dân gian kiêng khởi công?',
    choices: [
      {
        text: 'Nhất Cát, Nhì Nghi, Tứ Tấn Tài',
        note: 'Ngược lại — đây là ba cung được coi là tốt để khởi công.',
      },
      {
        text: 'Tam Địa Sát, Ngũ Thọ Tử, Lục Hoang Ốc',
        correct: true,
        note: 'Đúng — ba cung ở bước 3, 5 và 6 trên vòng.',
      },
      {
        text: 'Nhì Nghi, Tam Địa Sát, Ngũ Thọ Tử',
        note: 'Không — Nhì Nghi là cung tốt (chủ về thuận lợi, có lộc).',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Gia chủ có tuổi mụ 42 trong năm định khởi công thì rơi cung nào?',
    choices: [
      {
        text: 'Nhất Cát — vì 42 chia 6 dư 0, coi như quay về đầu vòng',
        note: 'Không — dư 0 KHÔNG quay về cung 1; theo cách đếm, đếm trọn một vòng thì dừng ở cung cuối.',
      },
      {
        text: 'Lục Hoang Ốc — vì 42 chia 6 dư 0, mà dư 0 được tính là bước 6',
        correct: true,
        note: 'Đúng — 42 = 7 × 6, đếm hết vòng nên dừng ở cung 6, là cung dân gian kiêng.',
      },
      {
        text: 'Không rơi cung nào — 42 chia hết cho 6 nên năm đó Hoang Ốc bỏ trống',
        note: 'Không — mọi tuổi mụ đều rơi vào đúng một trong 6 cung, không có trường hợp trống.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Theo tục, người được mượn tuổi cần thoả điều kiện nào là quan trọng nhất?',
    choices: [
      {
        text: 'Chỉ cần là người trong họ và đồng ý đứng tên hộ',
        note: 'Chưa đủ — quan hệ thân quen là điều kiện phụ, không phải điều kiện chính.',
      },
      {
        text: 'Chỉ cần lớn tuổi hơn gia chủ',
        note: 'Chưa đủ — thường chọn người lớn tuổi hơn, nhưng đó chưa phải điều kiện quyết định.',
      },
      {
        text: 'Năm khởi công đó bản thân người ấy không phạm cả ba hạn Kim Lâu, Hoang Ốc, Tam Tai',
        correct: true,
        note: 'Đúng — mượn một người cũng đang phạm hạn thì theo tục việc mượn không trọn vẹn. Thường chọn nam giới, người thân/quen, lớn tuổi hơn gia chủ.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Vì sao đổi người đứng ra khởi công lại làm kết quả Hoang Ốc đổi theo — mà không cần bất kỳ nghi lễ nào khác?',
    answer: (
      <>
        Vì quy tắc ghi rõ hạn được xét theo tuổi mụ của {strong('người đứng ra khởi công')}. Đổi
        người là đổi con số đem chia 6, nên cung tra ra đổi theo. Đây là hệ quả logic của chính luật
        chơi — cũng là dấu hiệu cho thấy Hoang Ốc là một{' '}
        {strong('nghi thức xã hội')}, không phải quy luật tự nhiên.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Vì sao cùng một người, năm nay cưới được mà lại chưa “được tuổi” làm nhà?',
    choices: [
      {
        text: 'Vì tuổi mụ khi xem cưới và khi xem làm nhà được tính bằng hai công thức khác nhau',
        note: 'Không — tuổi mụ tính như nhau: năm xem − năm sinh + 1.',
      },
      {
        text: 'Vì làm nhà xét thêm vòng Hoang Ốc, còn cưới hỏi thì không dùng vòng này',
        correct: true,
        note: 'Đúng — Hoang Ốc là vòng dân gian dùng riêng cho việc làm nhà, nên bộ hạn đem ra xét không giống nhau.',
      },
      {
        text: 'Vì làm nhà xét tuổi vợ, còn cưới xét tuổi chồng',
        note: 'Không — điểm khác nằm ở bộ hạn được xét, không phải ở chuyện đổi người.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Hoang Ốc KHÔNG trả lời câu hỏi nào dưới đây?',
    choices: [
      {
        text: 'Năm nay tuổi gia chủ rơi vào cung nào trong 6 cung',
        note: 'Đây đúng là việc Hoang Ốc làm — ánh xạ tuổi mụ sang một trong 6 cung.',
      },
      {
        text: 'Nhà nên quay về hướng nào cho hợp gia chủ',
        correct: true,
        note: 'Đúng — hướng nhà là chuyện của Bát Trạch, một hệ hoàn toàn khác; Hoang Ốc chỉ xét NĂM khởi công.',
      },
      {
        text: 'Năm nay theo tục có nên khởi công hay nên đợi',
        note: 'Đây là đúng phạm vi của Hoang Ốc, dù chỉ ở mức một lời nhắc.',
      },
    ],
  },
];

export function HoangOcRecall() {
  return <ActiveRecall topicId="hoang-oc" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Hoang Ốc dùng để làm gì (một mốc dân gian khi chọn NĂM khởi công) — và nó KHÔNG hứa gì về chất lượng ngôi nhà hay số phận gia chủ.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Tự tính được: tuổi mụ = năm khởi công − năm sinh + 1 → chia 6 lấy phần dư → dư 0 tính là 6 → đọc tên cung.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể đúng tên và thứ tự 6 cung, chỉ ra ba cung tốt (1, 2, 4) và ba cung dân gian kiêng (3, 5, 6).',
  },
  {
    id: 'whose-age',
    facet: 'Xét tuổi ai',
    can: 'Nói được Hoang Ốc xét tuổi mụ của người đứng ra khởi công (thường là trụ cột đứng tên nhà), không phải tuổi của cả nhà cộng lại.',
  },
  {
    id: 'borrow',
    facet: 'Mượn tuổi',
    can: 'Giải thích được ai mượn được, các bước theo phong tục, và vì sao đổi người đứng ra khởi công lại làm kết quả đổi theo.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao cưới được mà chưa chắc “được tuổi” làm nhà, và Hoang Ốc khác gì với việc chọn ngày động thổ hay xem hướng nhà.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra Hoang Ốc chỉ dùng một con số (tuổi mụ) nên chia mọi gia chủ thành đúng 6 nhóm — không biết gì về nền đất, ngân sách, giấy phép hay mùa mưa.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao tên cung nghe nặng (Địa Sát, Thọ Tử) không đồng nghĩa với tai hoạ, và vì sao mượn tuổi là nghi thức tâm lý – xã hội chứ không phải phép thuật.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho người thân “Hoang Ốc là gì, tính thế nào, nên hiểu tới đâu” bằng lời của bạn, giữ giọng tham khảo — không doạ.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd cách đếm dư 0, các bước mượn tuổi) bạn vẫn còn thấy mơ hồ và cần đọc lại.',
  },
];

export function HoangOcChecklist() {
  return <UnderstandingChecklist topicId="hoang-oc" facets={FACETS} />;
}

export function HoangOcWhys() {
  return (
    <FiveWhys
      topicId="hoang-oc"
      start={
        <>
          Một gia đình tra thấy gia chủ năm nay rơi cung {strong('Lục Hoang Ốc')}, liền quyết định
          hoãn xây thêm vài năm — dù mái đã dột, tiền đã vay được và thợ đã hẹn.
        </>
      }
      chain={[
        {
          question: 'Vì sao hoãn ngay chỉ vì rơi một cung lại là quyết định chưa cân nhắc đủ?',
          because: (
            <>
              Vì kết luận ấy đến từ đúng {strong('một phép chia')}: tuổi mụ chia 6, lấy phần dư.
            </>
          ),
        },
        {
          question: 'Vì sao một phép chia cho 6 không đủ để quyết một việc lớn như xây nhà?',
          because: (
            <>
              Vì nó chỉ chia mọi gia chủ thành {strong('6 nhóm theo tuổi mụ')} — không biết gì về nền
              đất, ngân sách, giấy phép hay mùa mưa của chính công trình bạn.
            </>
          ),
        },
        {
          question: 'Vậy vì sao người xưa vẫn giữ tục này, nếu nó thô như thế?',
          because: (
            <>
              Vì làm nhà là việc {strong('lớn, tốn kém và khó sửa lại')}. Một mốc chung khiến cả nhà
              dừng lại, bàn kỹ và cùng đồng thuận trước khi động thổ.
            </>
          ),
        },
        {
          question: 'Vì sao chính tục ấy lại sinh ra cách hoá giải là “mượn tuổi”?',
          because: (
            <>
              Vì hạn được xét theo tuổi của {strong('người đứng ra khởi công')}. Đổi người đứng ra là
              đổi con số đem chia — luật chơi tự mở sẵn một lối ra.
            </>
          ),
        },
        {
          question: 'Vì sao chi tiết đó thay đổi cách ta nên đọc Hoang Ốc?',
          because: (
            <>
              Vì một hệ có thể {strong('gỡ bằng cách đổi người đứng tên')} thì nó là nghi thức xã hội
              — giúp cả nhà yên tâm và đồng lòng — chứ không phải quy luật tự nhiên quyết định ngôi
              nhà bền hay hỏng.
            </>
          ),
        },
      ]}
      root={
        <>
          Hoang Ốc là một mốc dừng để cả nhà cân nhắc trước khi làm việc lớn, không phải bản án cho
          năm đó. Rơi cung xấu thì hỏi thêm: tiền, giấy phép, mùa thi công đã sẵn chưa — và nếu gia
          đình vẫn muốn giữ tục thì có tục mượn tuổi. Đọc nó như{' '}
          {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
