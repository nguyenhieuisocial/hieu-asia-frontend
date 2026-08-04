/**
 * Nội dung "học chủ động" cho /learn/giao-van — MỐC CHUYỂN giữa hai chặng đại vận.
 *
 * GROUNDING (mọi khẳng định đều truy được về một trong các nguồn sau; KHÔNG
 * thêm dữ kiện mới, KHÔNG gõ tay con số mà engine tính ra được — phần số liệu
 * nằm ở page.tsx và suy tại runtime bằng `calculateBazi()`):
 *   • src/lib/bazi.ts — computeDaiVan(): tuổi khởi vận = số ngày từ lúc sinh tới
 *     mốc tiết khí (kế nếu thuận / trước nếu nghịch) CHIA 3 rồi `Math.round`,
 *     tối thiểu 1; 9 trụ vận, mỗi trụ bước ±1 từ trụ THÁNG trên vòng can chi và
 *     phủ 10 năm tuổi (endAge = startAge + 9); tenGod = Thập Thần của can vận so
 *     với Nhật Chủ. CAN_ELEMENT xếp theo đúng thứ tự tương sinh, mỗi hành 2 can
 *     → hai trụ vận liền nhau (bước ±1) hoặc cùng hành can, hoặc lệch đúng một
 *     bước trên vòng tương sinh. 9 trụ = 9 can liên tiếp (bỏ chính can tháng)
 *     → 9 Thập Thần khác nhau, thiếu đúng Thập Thần của trụ tháng.
 *   • src/lib/age.ts — `ageFromDate()`: tuổi dương, TRỪ THÊM 1 nếu chưa qua
 *     sinh nhật trong năm. TRƯỚC 04/08/2026, src/app/dai-van-hien-tai/form.tsx
 *     dùng công thức KHÁC (`new Date().getFullYear() - birthYear`, chỉ trừ
 *     năm) trong khi src/components/time-flow/TimeFlowChecker.tsx (dùng ở
 *     /timeline) đã tính đúng — hai công cụ lệch nhau đúng 1 năm ở quãng từ
 *     đầu năm tới TRƯỚC sinh nhật. Đã gộp về DÙNG CHUNG `ageFromDate()`. Phần
 *     "hai công cụ dùng hai quy ước" trong bài giờ kể lại như CASE STUDY LỊCH
 *     SỬ (đã sửa), KHÔNG còn mô tả hành vi hiện tại — đừng viết lại thành thì
 *     hiện tại nếu sửa file này.
 *   • src/components/time-flow/TimeFlowChecker.tsx (dùng ở /timeline) — render
 *     CẢ CHUỖI đại vận (mọi chặng, chặng hiện tại được tô sáng), kèm câu "đọc
 *     theo trình tự tuổi… đây là khung tham khảo để soi nhịp dài hạn, không
 *     phải dự đoán may rủi".
 *   • src/app/timeline/page.tsx — đại vận = giai đoạn 10 năm, lưu niên = năm,
 *     lưu nguyệt = tháng.
 *
 * KHÔNG CÓ TRONG NGUỒN THÌ KHÔNG VIẾT: không công cụ nào của site tính ra NGÀY
 * GIỜ giao vận — engine chỉ cho mốc theo TUỔI TRÒN. Cũng không có tham số "vùng
 * giao vận" nào trong repo. Vì vậy bài KHÔNG dạy cách bấm ngày giao vận và
 * KHÔNG khẳng định vùng giáp ranh dài mấy năm.
 *
 * PHẠM VI: đại vận là gì / vì sao 10 năm / Tử Vi và Bát Tự lệch mốc thuộc
 * /learn/dai-van (chỉ nhắc một câu + link). Cách kiểm chứng một dự đoán là chủ
 * đề riêng — chỉ nêu tên, không dạy.
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

export function GiaoVanFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Biết mình đang ở chặng nào rồi thì câu hỏi tiếp theo luôn là{' '}
          {strong('sắp sang chặng mới thì sao')}. Và đây đúng là chỗ dễ đọc sai nhất: người ta
          gom mọi thay đổi lớn trong đời về đúng cái mốc ấy, rồi tin rằng cái mốc gây ra chúng.
        </>
      }
      why={
        <>
          Vì chuỗi đại vận là các con số tuổi nối nhau, chỗ hai chặng gặp nhau trông rất{' '}
          {strong('dứt khoát trên bảng')} — một tuổi kết thúc, tuổi kế bắt đầu. Cảm giác dứt
          khoát đó khiến vùng giáp ranh bị đọc như một cái ngưỡng có thật.
        </>
      }
      what={
        <>
          Giao vận là {strong('mốc chuyển')} giữa hai chặng — một ranh giới trên bảng chia. Nó{' '}
          {strong('không phải')} một ngày giờ (công cụ của site chỉ cho mốc theo tuổi tròn),
          không phải công tắc bật tắt, và không phải nguyên nhân của biến cố.
        </>
      }
      how={
        <>
          Cả chuỗi neo vào {strong('một con số duy nhất')}: tuổi khởi vận. Bên Bát Tự, con số ấy
          ra từ một phép chia rồi làm tròn. Đổi nó một đơn vị thì toàn bộ mốc dịch theo một năm
          — nên mốc là hệ quả của cách chia, không phải một điểm được đo.
        </>
      }
      soWhat={
        <>
          Để đọc {strong('xu hướng của cả chuỗi')} thay vì soi một điểm cắt — và để thôi dồn
          hoặc né những quyết định lớn quanh một con số tuổi.
        </>
      }
    />
  );
}

export function GiaoVanDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="giao-van"
        concept="Vì sao vùng giáp ranh giữa hai chặng lại khó đọc"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trời chuyển từ chiều sang tối không có một giây bấm công tắc — có một quãng
                nhá nhem mà bạn không gọi được là chiều hay tối. Chỗ hai chặng vận gặp nhau
                cũng vậy: {strong('hai chặng chồng bóng lên nhau')} trong đầu người đọc, nên
                chuyện gì xảy ra quanh đó cũng gán được cho bên này hoặc bên kia.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Trên bảng thì rất gọn: chặng cũ hết ở một tuổi, chặng mới bắt đầu ở tuổi kế.
                  Nhưng khi đọc, người ta không dừng ở một năm — họ nới ra{' '}
                  {strong('vài năm mỗi bên')} và gọi cả vùng đó là giao vận. Vùng càng rộng thì
                  càng nhiều chuyện rơi vào trong.
                </p>
                <p>
                  Thêm một lớp nữa: quanh mốc, cả hai nhãn đều nghe hợp lý. Chuyện xảy ra ở tuổi
                  sát ranh giới có thể được giải thích bằng chặng cũ (dư âm) hoặc chặng mới
                  (đến sớm). Một lời giải thích {strong('không bao giờ sai được')} thì cũng
                  không nói được điều gì.
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
                  Điểm mấu chốt: bản thân cái mốc đã nhoè sẵn trước khi ai kịp nới nó. Bên Bát
                  Tự, tuổi khởi vận là kết quả của một phép chia rồi{' '}
                  {strong('làm tròn về năm nguyên')} — phần lẻ bị bỏ, nên ranh giới thật không
                  nằm đúng ở sinh nhật nào cả.
                </p>
                <p>
                  Và con số tuổi dùng để chiếu vào bảng cũng có hai quy ước: lấy năm trừ năm, hay
                  tính đã qua sinh nhật chưa. Hai công cụ trên chính hieu.asia từng dùng hai quy
                  ước khác nhau (lỗi thật, đã sửa) — trong quãng từ đầu năm tới trước sinh nhật,
                  chúng từng lệch nhau đúng một tuổi. Cộng lại: {strong('ranh giới nhoè ít nhất một năm')}{' '}
                  ngay từ trong cách tính, chưa cần ai diễn giải rộng ra.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="giao-van"
        concept="Mốc chuyển ra từ một phép chia và một lần làm tròn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Chia một cái bánh dài cho 9 người: chỗ dao cắt xuống là do{' '}
                {strong('cách chia')} quyết định, chứ cái bánh không có sẵn vạch ở đó. Mốc giao
                vận cũng là vết dao, không phải vạch có sẵn trong đời.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bên Bát Tự, engine đếm số ngày từ lúc sinh tới mốc tiết khí gần nhất, chia cho
                  ba, rồi {strong('làm tròn')} thành một số tuổi nguyên. Đó là tuổi khởi vận.
                  Chặng sau bắt đầu ngay sau chặng trước, nên chỉ cần con số đầu tiên đó, cả
                  chuỗi mốc có luôn.
                </p>
                <p>
                  Hệ quả rất cụ thể: hai người sinh cách nhau {strong('vài ngày')} có thể nhận
                  hai bộ mốc lệch nhau nguyên một năm, dù nhãn các chặng giống hệt. Không phải
                  đời họ khác nhau một năm — chỉ là phép chia rơi vào hai bên của một lần làm
                  tròn.
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
                  Chú ý cấu trúc của phép tính: nó biến một khoảng cách{' '}
                  {strong('liên tục')} (số ngày tới tiết khí) thành một con số{' '}
                  {strong('rời rạc')} (tuổi nguyên). Mọi thông tin về phần lẻ bị vứt đi ngay ở
                  bước đó, và không có API nào của site trả lại phần lẻ ấy.
                </p>
                <p>
                  Vì vậy câu hỏi "đúng ngày nào tôi sang vận" không có câu trả lời trong hệ
                  này — không phải vì khó tính, mà vì{' '}
                  {strong('đại lượng đó không tồn tại trong output')}. Ai đưa bạn một ngày giờ
                  giao vận chính xác đến phút thì con số ấy đến từ một quy ước khác, không phải
                  từ phép tính đang được dùng ở đây.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="giao-van"
        concept="Soi một điểm và đọc một chuỗi là hai việc khác nhau"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Nhìn một tấm ảnh chụp bạn đang bước hụt thì tưởng bạn ngã. Xem cả đoạn phim mới
                thấy bạn chỉ đang chạy. {strong('Một điểm không kể được câu chuyện')} — chuỗi
                thì có.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Câu hỏi "chặng này tốt hay xấu" là soi một điểm. Câu hỏi{' '}
                  {strong('trọng tâm đang trượt về đâu')} là đọc một chuỗi. Chuỗi trả lời được,
                  vì các chặng không nhảy lung tung: mỗi chặng chỉ bước đúng một bước trên vòng
                  can chi so với chặng liền trước.
                </p>
                <p>
                  Nghĩa là hai chặng cạnh nhau là {strong('cặp gần nhau nhất')} mà hệ này tạo ra
                  được — không phải hai thái cực. Điều đó đủ để thấy mốc giữa chúng không thể là
                  một cú lật.
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
                  Có một tính chất của chuỗi ít ai để ý và nó đáng giá hơn mọi lời luận về từng
                  chặng: chín chặng quét qua{' '}
                  {strong('chín trong mười Thập Thần')}, thiếu đúng một cái — cái ứng với trụ
                  tháng. Bộ nhãn gần như đầy đủ, và điều đó đúng với{' '}
                  {strong('mọi lá số')}, không riêng ai.
                </p>
                <p>
                  Hệ quả: một cái nhãn đơn lẻ hầu như không phân biệt được bạn với người khác,
                  vì gần như ai cũng có nó ở đâu đó trong chuỗi. Thứ mang thông tin là{' '}
                  {strong('thứ tự')} — nhãn nào rơi vào quãng tuổi nào — chứ không phải sự có
                  mặt của một nhãn.
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
    type: 'mcq',
    prompt: 'Trong Bát Tự, mốc chuyển giữa hai chặng được xác định thế nào?',
    choices: [
      {
        text: 'Bằng một ngày giờ cụ thể, tính từ thời điểm sinh đến từng phút',
        note: 'Không. Engine chỉ cho mốc theo tuổi tròn — nó không xuất ra ngày giờ nào cả.',
      },
      {
        text: 'Cả chuỗi neo vào tuổi khởi vận: số ngày từ lúc sinh tới mốc tiết khí gần nhất chia ba rồi làm tròn; các chặng sau nối tiếp nhau',
        correct: true,
        note: 'Đúng — và vì có bước làm tròn nên phần lẻ bị bỏ ngay trong phép tính.',
      },
      {
        text: 'Luôn rơi đúng vào sinh nhật của năm chuyển chặng',
        note: 'Không — mốc là một con số tuổi trên bảng, không gắn với ngày sinh nhật.',
      },
    ],
  },
  {
    id: 'q2',
    type: 'open',
    prompt:
      'Hai người sinh cách nhau ĐÚNG MỘT NGÀY, cùng giờ, cùng giới. Bộ mốc chuyển của họ có thể khác nhau không? Vì sao?',
    answer: (
      <>
        Có thể khác — và khác nguyên một năm. Tuổi khởi vận là số ngày tới mốc tiết khí{' '}
        {strong('chia ba rồi làm tròn')}, nên cứ khoảng ba ngày sinh lệch là con số ấy đổi một
        đơn vị. Hai người rơi vào hai bên của một lần làm tròn sẽ nhận hai bộ mốc lệch nhau một
        năm, dù nhãn các chặng của họ giống hệt nhau. Đó là bằng chứng gọn nhất rằng mốc là{' '}
        {strong('kết quả của cách chia')}, không phải một thời điểm được đo.
      </>
    ),
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt:
      'Cùng một người, cùng một ngày tra, mà hai công cụ trên hieu.asia từng báo hai chặng khác nhau (lỗi thật, tới 04/08/2026). Nguyên nhân là gì?',
    choices: [
      {
        text: 'Một trong hai công cụ tính sai phép chia đại vận',
        note: 'Không — phép chia chặng của cả hai đều đúng. Chỗ lệch nằm ở một bước khác: cách quy đổi năm sinh thành tuổi.',
      },
      {
        text: 'Hai công cụ dùng hai quy ước tuổi khác nhau (lấy năm trừ năm, hay tính đã qua sinh nhật chưa), lệch nhau một tuổi trong quãng từ đầu năm tới trước sinh nhật — nếu tuổi đó rơi sát mốc thì ra hai chặng',
        correct: true,
        note: 'Đúng — và đây chính xác là lỗi đã xảy ra trên site. Đã gộp về dùng chung một công thức để hai công cụ luôn khớp nhau.',
      },
      {
        text: 'Do giờ sinh nhập khác nhau',
        note: 'Giờ sinh có ảnh hưởng thật, nhưng ở đây cùng dữ liệu vào mà vẫn lệch — nguyên nhân nằm ở cách tính tuổi.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Chặng kế tiếp có phải luôn trái ngược với chặng đang ở không?',
    choices: [
      {
        text: 'Không — mỗi chặng chỉ bước đúng một bước trên vòng can chi so với chặng liền trước, nên hai chặng cạnh nhau là cặp gần nhau nhất mà hệ tạo ra được',
        correct: true,
        note: 'Đúng. Hành của can vận hoặc giữ nguyên, hoặc dịch đúng một bước trên vòng tương sinh — không nhảy sang hành khắc.',
      },
      {
        text: 'Có — chặng sau luôn đảo ngược chặng trước, đó là ý nghĩa của giao vận',
        note: 'Không có gì trong cách dựng chuỗi tạo ra sự đảo ngược đó.',
      },
      {
        text: 'Tuỳ, không có quy luật nào cả',
        note: 'Có quy luật: bước ±1 trên vòng can chi, cố định theo chiều thuận hay nghịch.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt:
      'Nếu coi “vùng giao vận” là mốc cộng trừ hai năm, thì vùng đó chiếm bao nhiêu phần của một chặng mười năm?',
    choices: [
      {
        text: 'Khoảng một phần mười',
        note: 'Ít hơn thực tế nhiều — mốc cộng trừ hai năm đã là năm năm.',
      },
      {
        text: 'Khoảng một nửa — năm năm trong mười',
        correct: true,
        note: 'Đúng. Nới vùng đủ rộng thì gần như mọi biến cố trong đời đều rơi vào trong nó.',
      },
      {
        text: 'Không tính được vì engine không định nghĩa vùng giao vận',
        note: 'Engine đúng là không định nghĩa vùng nào — nhưng nếu người đọc tự nới ra thì phần trăm đó tính được, và đó chính là vấn đề.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Một người nói: “Nhìn lại thì đúng năm giao vận tôi mất việc — chuẩn không cần chỉnh.” Hãy chỉ ra vì sao câu đó chưa chứng minh được gì.',
    answer: (
      <>
        Ba chỗ hổng. Một: {strong('cửa sổ quá rộng')} — nếu vùng giao vận được nới cộng trừ hai
        năm thì nó phủ một nửa số năm của chặng, mà biến cố trong đời thì rải đều, nên trúng là
        chuyện xác suất chứ không phải chuyện linh nghiệm. Hai:{' '}
        {strong('bản thân mốc đã nhoè')} — làm tròn trong phép tính đủ để "đúng năm" xê dịch, và
        từng nhoè thêm vì hai công cụ trên site dùng hai quy ước tuổi khác nhau (lỗi thật, nay đã
        sửa). Ba: {strong('chỉ đếm lần trúng')} — không ai đếm những mốc giao vận trôi qua mà
        chẳng có gì xảy ra, cũng không đếm những biến cố lớn rơi vào giữa chặng. Muốn thành bằng
        chứng thì phải nói TRƯỚC, nói cụ thể, và đếm cả lần trật.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Đọc “cả chuỗi” thay vì soi một điểm nghĩa là làm gì?',
    choices: [
      {
        text: 'Cộng điểm tốt xấu của chín chặng lại rồi lấy trung bình',
        note: 'Không — không có thang điểm nào để cộng, và trung bình của chín chặng thì chẳng nói gì về giai đoạn nào cả.',
      },
      {
        text: 'Chỉ đọc chặng đầu và chặng cuối cho nhanh',
        note: 'Không — bỏ mất phần giữa là bỏ mất chính cái xu hướng.',
      },
      {
        text: 'Nhìn thứ tự và chiều trượt của cả dãy: nhãn nào rơi vào quãng tuổi nào, cụm nào lặp lại, chuỗi đang nghiêng dần về đâu',
        correct: true,
        note: 'Đúng. Thông tin nằm ở thứ tự, không nằm ở sự có mặt của một nhãn — vì bộ nhãn gần như đầy đủ với mọi lá số.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'mcq',
    prompt: 'Sắp tới mốc chuyển chặng, có nên dời quyết định lớn sang bên kia mốc không?',
    choices: [
      {
        text: 'Nên — chờ qua mốc cho chắc',
        note: 'Đây đúng là ngộ nhận tốn kém nhất: bạn trả thời gian thật cho một ranh giới do phép chia đặt ra.',
      },
      {
        text: 'Không — mốc là ranh giới trên bảng chia, đã nhoè sẵn ít nhất một năm; dồn việc vào nó hay né nó đều là để một con số làm thay việc cân nhắc',
        correct: true,
        note: 'Đúng. Có triệu chứng thì đi khám, có hợp đồng thì đọc kỹ — mốc chuyển không có thẩm quyền với những việc đó.',
      },
      {
        text: 'Nên dồn hết việc lớn vào đúng năm chuyển để “mở vận”',
        note: 'Cũng sai, và sai theo cùng một kiểu: vẫn là giao quyết định cho một con số tuổi.',
      },
    ],
  },
];

export function GiaoVanRecall() {
  return <ActiveRecall topicId="giao-van" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được giao vận trả lời câu hỏi gì (hai chặng nối nhau ở đâu) — và KHÔNG trả lời câu gì (đúng ngày giờ nào, chuyện gì sẽ xảy ra).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả được đường đi của một mốc: số ngày tới mốc tiết khí → chia ba → làm tròn thành tuổi khởi vận → các chặng nối tiếp → mốc chuyển nằm giữa hai chặng.',
  },
  {
    id: 'sensitivity',
    facet: 'Độ nhạy',
    can: 'Giải thích được vì sao sinh lệch vài ngày là cả bộ mốc dịch nguyên một năm, trong khi nhãn các chặng không đổi.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Tách được ba thứ hay bị gộp: mốc trên bảng, vùng giáp ranh do người đọc tự nới, và biến cố có thật trong đời.',
  },
  {
    id: 'sequence',
    facet: 'Đọc chuỗi',
    can: 'Nói được đọc cả dãy khác soi một chặng ở chỗ nào, và chỉ ra được xu hướng của một chuỗi thay vì phán một điểm.',
  },
  {
    id: 'hindsight',
    facet: 'Bẫy hồi cứu',
    can: 'Giải thích được vì sao nhìn lại quá khứ bao giờ cũng thấy “đúng lúc giao vận có biến”, và vì sao điều đó không phải bằng chứng.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được vì sao mốc chuyển là quy ước chia chứ không phải công tắc — và dùng được ít nhất hai lý do kiểm chứng được.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao không nên dồn quyết định lớn vào một mốc, và cũng không nên né nó.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người chưa biết vì sao mốc chuyển đã nhoè sẵn, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (phép làm tròn, hai quy ước tuổi, cách đọc chuỗi) bạn vẫn còn thấy mơ hồ.',
  },
];

export function GiaoVanChecklist() {
  return <UnderstandingChecklist topicId="giao-van" facets={FACETS} />;
}

export function GiaoVanWhys() {
  return (
    <FiveWhys
      topicId="giao-van"
      start={
        <>
          “Nhìn lại thì năm nào giao vận nhà tôi cũng có biến — nên năm sau sắp chuyển chặng,
          tôi hoãn hết việc lớn lại đã.”
        </>
      }
      chain={[
        {
          question: 'Vì sao chuyện “năm giao vận nào cũng có biến” chưa chứng minh được gì?',
          because: (
            <>
              Vì vùng được gọi là giao vận thường được nới rộng vài năm mỗi bên, mà{' '}
              {strong('biến cố trong đời thì rải đều')} — trúng là chuyện xác suất, không phải
              chuyện linh nghiệm.
            </>
          ),
        },
        {
          question: 'Vì sao người ta lại nới vùng đó ra rộng như vậy?',
          because: (
            <>
              Vì mốc chỉ là {strong('một con số tuổi tròn')}, không kèm ngày giờ. Không có ranh
              giới sắc nét để bám, người đọc tự cho nó một vùng đệm — và vùng đệm thì co giãn
              theo nhu cầu giải thích.
            </>
          ),
        },
        {
          question: 'Vì sao mốc lại chỉ là một con số tuổi tròn?',
          because: (
            <>
              Vì phép tính sinh ra nó đã {strong('làm tròn ngay từ đầu')}: số ngày từ lúc sinh
              tới mốc tiết khí chia cho ba, rồi lấy số nguyên. Phần lẻ bị bỏ và không có chỗ nào
              trả nó lại. Con số tuổi dùng để chiếu vào bảng cũng có hai quy ước khác nhau.
            </>
          ),
        },
        {
          question: 'Vì sao dù nhoè như vậy mà ta vẫn thấy nó “đúng”?',
          because: (
            <>
              Vì chuỗi chín chặng quét gần hết bộ nhãn của hệ, nên{' '}
              {strong('luôn có một nhãn khớp')} với chuyện đã xảy ra. Cộng thêm thói quen chỉ
              nhớ những lần trùng và bỏ qua những mốc trôi đi trong yên ắng.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng chuỗi đại vận?',
          because: (
            <>
              Vì giá trị của nó nằm ở {strong('xu hướng của cả dãy')} — trọng tâm đang trượt về
              đâu qua vài chục năm — chứ không nằm ở điểm cắt. Dồn hay né quyết định lớn quanh
              một điểm cắt là trả thời gian thật cho một vết dao trên bảng chia.
            </>
          ),
        },
      ]}
      root={
        <>
          Mốc chuyển là chỗ hệ này đặt dao xuống để chia đời người thành chặng, không phải chỗ
          đời người thật sự gãy. Bằng chứng nằm ngay trong phép tính: đổi ngày sinh vài ngày là
          cả bộ mốc dịch một năm, trong khi nhãn các chặng không đổi một chữ.
        </>
      }
    />
  );
}
