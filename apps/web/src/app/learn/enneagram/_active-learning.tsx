/**
 * Nội dung "học chủ động" cho trang /learn/enneagram.
 *
 * TẤT CẢ grounded từ chính bài viết Enneagram (9 nhóm theo động lực sâu, 3 trung
 * tâm Bản năng/Tình cảm/Lý trí, cánh — wing, mũi tên phát triển/căng thẳng theo
 * Riso–Hudson) và lib nội dung (lib/scoring/enneagram.ts, lib/enneagram-type-data.ts).
 * KHÔNG thêm dữ kiện mới. Giữ giọng "bản đồ để hiểu mình, không phải cái hộp để
 * nhốt" — tham khảo / góc nhìn, không phán định.
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

export function EnneagramFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao hiểu được {strong('vì sao mình lại phản ứng như vậy')} — điều gì thật sự thôi thúc
          mình phía sau hành vi — để bớt tự trách, hiểu người khác hơn và biết mình nên luyện gì?
        </>
      }
      why={
        <>
          Enneagram xếp con người thành chín nhóm dựa trên {strong('động lực sâu bên trong')} — điều
          bạn khao khát và điều bạn sợ — chứ không phải hành vi bề mặt. Nó tồn tại như một{' '}
          {strong('bản đồ để hiểu mình')}, không phải chiếc hộp để nhốt.
        </>
      }
      what={
        <>
          Chín nhóm chia theo {strong('3 trung tâm')} (Bản năng · Tình cảm · Lý trí), mỗi nhóm có một
          khao khát và một nỗi sợ cốt lõi. {strong('Không phải')} nhãn để dán hay lời tiên tri — đó là
          lý do hai người trông rất khác nhau vẫn có thể cùng một nhóm.
        </>
      }
      how={
        <>
          Nhận diện nhóm chính qua động lực (sợ gì / muốn gì), rồi đọc thêm ba lớp:{' '}
          {strong('cánh')} (nghiêng về một nhóm liền kề) và {strong('mũi tên')} (khi phát triển hấp
          thụ nét tốt của một nhóm khác, khi căng thẳng ngả sang mặt kém của một nhóm khác).
        </>
      }
      soWhat={
        <>
          Để {strong('hiểu động cơ, điểm mạnh và điều cần luyện')} rồi tự quyết mình muốn trở thành ai
          — không dùng số nhóm để bào chữa, không đóng khung người khác, không thay lời khuyên chuyên
          môn.
        </>
      }
    />
  );
}

export function EnneagramDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="enneagram"
        concept="Động lực cốt lõi: mỗi nhóm chạy sau một khao khát và một nỗi sợ"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ai cũng có một điều {strong('rất muốn có')} và một điều {strong('rất sợ mất')}.
                Enneagram nhìn vào hai thứ giấu bên trong đó, thay vì nhìn bạn đang làm gì bên ngoài.
                Có bạn luôn muốn được thương và sợ thành người thừa; có bạn luôn muốn làm đúng và sợ
                mình sai. Chính cái muốn và cái sợ đó mới cho biết bạn thuộc nhóm nào, chứ không phải
                chuyện bạn nói nhiều hay ít.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi nhóm được xác định bởi một cặp: {strong('khao khát cốt lõi')} (điều luôn hướng
                  tới) và {strong('nỗi sợ cốt lõi')} (điều luôn né). Nhóm 1 khao khát sống đúng đắn,
                  sợ mình sai. Nhóm 2 khao khát được cần đến, sợ thành người thừa. Nhóm 5 khao khát
                  hiểu thấu và tự chủ, sợ bị vắt cạn.
                </p>
                <p>
                  Hành vi bề mặt chỉ là cách mỗi người xoay xở quanh cặp động lực đó. Vì thế hai người
                  làm những việc rất khác nhau vẫn có thể {strong('cùng một nhóm')} — cùng một động cơ
                  đứng phía sau.
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
                  Điểm phân biệt của Enneagram: nó phân loại theo {strong('động lực cốt lõi')} — cặp
                  khao khát và nỗi sợ chạy phía sau hành vi — chứ không theo tập hành vi quan sát được
                  ở bề mặt. Cùng một động cơ có thể hiện ra rất nhiều hành vi khác nhau, tùy mức lành
                  mạnh và cánh của người đó; đó là lý do hai người trông rất khác nhau vẫn có thể cùng
                  một nhóm.
                </p>
                <p>
                  {strong('Nhóm chính')} khá ổn định theo thời gian, còn thứ thay đổi là cách bạn
                  biểu hiện nó. Vì vậy để tìm đúng nhóm, câu hỏi cốt lõi là “tôi thật sự sợ và khao
                  khát điều gì”, không phải “tôi thường cư xử ra sao”.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="enneagram"
        concept="Ba trung tâm: mỗi cụm nhóm vật lộn với một cảm xúc lõi"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Khi gặp chuyện, có người {strong('làm liền')} (nghe cái bụng), có người để ý{' '}
                {strong('ai thương mình không')} (nghe trái tim), có người {strong('nghĩ cho kỹ đã')}{' '}
                (nghe cái đầu). Enneagram xếp chín nhóm vào ba kiểu phản ứng đầu tiên đó.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Ba trung tâm chia theo nguồn phản ứng đầu tiên. Nhóm {strong('bụng')} (8·9·1) nhạy
                  với chuyện kiểm soát và, theo cách trình bày phổ biến, vật lộn với cơn{' '}
                  {strong('giận')}. Nhóm {strong('tim')} (2·3·4) nhạy với hình ảnh bản thân và vật lộn
                  với nỗi {strong('xấu hổ')}. Nhóm {strong('đầu')} (5·6·7) nhạy với an toàn và vật lộn
                  với nỗi {strong('sợ')}.
                </p>
                <p>
                  Trong cùng một cụm, mỗi nhóm xử cảm xúc lõi đó một kiểu khác nhau — đó là lý do ba
                  nhóm liền nhau lại có họ với nhau.
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
                  Theo cách trình bày phổ biến, ba trung tâm gắn với ba cảm xúc nền:{' '}
                  {strong('giận (bụng), xấu hổ (tim), sợ (đầu)')}. Trong mỗi cụm, một nhóm hướng cảm
                  xúc ấy ra ngoài, một nhóm nén vào trong, một nhóm lảng khỏi hoặc “quên” nó.
                </p>
                <p>
                  Đây là cách sắp xếp mang tính {strong('khung để hiểu và nhớ')}, giúp thấy vì sao ba
                  nhóm cùng cụm có chung một mối bận tâm — không phải một khẳng định thần kinh học đo
                  được.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="enneagram"
        concept="Cánh (wing): chút gia vị làm hai người cùng nhóm khác hẳn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bạn có một màu áo thích nhất ({strong('nhóm chính')}), nhưng hay khoác thêm một chiếc
                áo bên cạnh ({strong('cánh')}). Cùng thích một màu mà mỗi người khoác thêm chiếc khác,
                nên trông vẫn khác nhau.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Trên vòng tròn Enneagram, mỗi nhóm nằm giữa hai nhóm liền kề. {strong('Cánh')} là
                  việc bạn nghiêng thêm về một trong hai nhóm đó.
                </p>
                <p>
                  Ví dụ nhóm 9 có thể là {strong('9w1')} (thêm nét kỷ luật, nguyên tắc của nhóm 1) hoặc{' '}
                  {strong('9w8')} (thêm nét quyết liệt, gan góc của nhóm 8). Cánh {strong('không đổi')}{' '}
                  nhóm chính, nó chỉ pha thêm sắc thái.
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
                  Cánh giải thích phần lớn khác biệt giữa hai người cùng nhóm chính: nhóm chính giữ
                  nguyên {strong('động lực cốt lõi')}, cánh mượn thêm một ít hương vị của một nhóm kề.
                  Có người có cánh rõ, có người khá cân bằng cả hai cánh.
                </p>
                <p>
                  Cần phân biệt cánh với mũi tên: {strong('cánh là nhóm KỀ')} (cố định hai lựa chọn),
                  còn {strong('mũi tên nối tới nhóm XA hơn')} và mô tả sự dịch chuyển theo trạng thái
                  lành mạnh hay căng thẳng.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="enneagram"
        concept="Vì sao Enneagram không phải cái nhãn cố định — “mũi tên” phát triển và căng thẳng"
        levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Bạn không phải lúc nào cũng giống hệt nhau. Lúc {strong('vui khỏe')} bạn hiện ra phiên
              bản đẹp hơn; lúc {strong('mệt và căng')} bạn dễ lộ ra mặt xấu. Enneagram nói mỗi nhóm
              cũng vậy — nên số nhóm không phải cái tên cố định dán lên bạn mãi mãi.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Mỗi nhóm nối với hai nhóm khác bằng {strong('mũi tên')}: khi bạn thoải mái và trưởng
                thành, bạn {strong('hấp thụ nét tốt')} của một nhóm; khi căng thẳng, bạn ngả sang{' '}
                {strong('mặt kém')} của một nhóm khác.
              </p>
              <p>
                Ví dụ nhóm 9 (Ôn hoà) lúc phát triển mượn nét chủ động, quyết đoán của nhóm 3; lúc
                stress lại ngả sang mặt lo xa, hoài nghi của nhóm 6. Chính vì có đường đi này mà
                Enneagram thiên về {strong('phát triển')} hơn là dán nhãn.
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
                Theo mô hình mũi tên của {strong('Riso–Hudson')}, mỗi nhóm có một hướng{' '}
                {strong('phát triển (integration)')} khi an toàn, lành mạnh và một hướng{' '}
                {strong('áp lực (disintegration)')} khi căng thẳng. Đọc một người là đọc cả trục
                động: nhóm chính + cánh (nghiêng về một nhóm liền kề) + vị trí trên hai mũi tên.
              </p>
              <p>
                Vì thế cùng một số nhóm vẫn cho ra nhiều sắc thái: cánh khác nhau, và mức lành
                mạnh/căng thẳng khác nhau kéo người ta về hai đầu mũi tên khác nhau. Enneagram mô tả{' '}
                {strong('xu hướng động lực trên một phổ')}, không phải phép đo khoa học như xét nghiệm.
              </p>
            </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="enneagram"
        concept="Chín mức phát triển: cùng một nhóm vẫn có phiên bản sáng và phiên bản tối"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cùng một người, lúc {strong('khoẻ khoắn')} thì dễ thương, lúc {strong('mệt mỏi')} thì
                khó ở. Trong Enneagram, cùng một nhóm cũng có ngày sáng ngày tối như vậy. Có lúc bạn
                dùng tính cách của mình theo kiểu đẹp nhất, có lúc lại theo kiểu gắt gỏng nhất. Vậy
                nên biết mình nhóm mấy vẫn chưa đủ — còn phải xem hôm nay mình đang ở phiên bản đẹp
                hay phiên bản xấu của nhóm đó.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Riso và Hudson thêm một ý: trong cùng một nhóm, người ta dao động trên một dải “mức
                  độ lành mạnh”, chia thành chín mức gộp lại thành {strong('ba vùng')}.
                </p>
                <p>
                  {strong('Vùng lành mạnh')}: điểm mạnh của nhóm toả sáng, phòng vệ nhẹ đi.{' '}
                  {strong('Vùng trung bình')}: nơi phần lớn chúng ta sống, cơ chế phòng vệ lộ rõ
                  nhưng vẫn xoay xở được. {strong('Vùng kém lành mạnh')}: nỗi sợ cốt lõi lấn át, hành
                  vi cứng nhắc, tự hại hoặc làm khổ người xung quanh. Hai người cùng nhóm 8 có thể rất
                  khác: một người che chở rộng lượng, một người áp đặt kiểm soát.
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
                  Nhóm cho biết bạn thường {strong('bắt đầu từ đâu')}; mức phát triển cho biết bạn
                  đang dùng động lực ấy theo hướng {strong('cởi mở hay cứng nhắc')}. Chín mức là một
                  dải liên tục, không phải nhãn cố định — cùng một người xê dịch lên xuống theo giai
                  đoạn đời, sức khoẻ, hoàn cảnh.
                </p>
                <p>
                  Cần nói thẳng: đây là ý tưởng khung, {strong('không phải thang đo chính xác')}.
                  Không có “điểm mức” nào chấm được bằng một bài trắc nghiệm ngắn, kể cả bài của
                  hieu.asia. Hãy đọc nó như lời nhắc rằng cùng một nhóm vẫn có nhiều phiên bản và bạn
                  di chuyển được, đừng biến nó thành một con số để tự dán lên mình.
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
    prompt: 'Enneagram phân nhóm con người dựa trên điều gì — và điều đó khác gì với việc mô tả hành vi bề mặt?',
    answer: (
      <>
        Dựa trên {strong('động lực sâu bên trong')}: điều bạn khao khát và điều bạn sợ, chứ không phải
        hành vi bề mặt. Đó là lý do hai người trông rất khác nhau vẫn có thể cùng một nhóm — vì cùng
        một động cơ cốt lõi đứng phía sau.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ba trung tâm (triad) của Enneagram là gì, và nhóm nào thuộc trung tâm nào?',
    choices: [
      {
        text: 'Bản năng (8·9·1) · Tình cảm (2·3·4) · Lý trí (5·6·7)',
        correct: true,
        note: 'Đúng — Bản năng (bụng), Tình cảm (tim), Lý trí (đầu).',
      },
      {
        text: 'Hướng nội · Hướng ngoại · Trung tính, chia đều 3 nhóm mỗi bên',
        note: 'Đó là kiểu chia của mô hình khác; Enneagram chia theo Bản năng / Tình cảm / Lý trí.',
      },
      {
        text: 'Quá khứ · Hiện tại · Tương lai',
        note: 'Không — ba trung tâm nói về nguồn phản ứng (bản năng, cảm xúc, suy nghĩ), không phải thời gian.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: '“Cánh” (wing) trong Enneagram nghĩa là gì?',
    choices: [
      { text: 'Một nhóm thứ hai mạnh ngang nhóm chính, khiến bạn thuộc cả hai nhóm', note: 'Không — cánh chỉ pha thêm sắc thái, không thay nhóm chính.' },
      {
        text: 'Ảnh hưởng từ một trong hai nhóm liền kề trên vòng tròn, tạo nên sắc thái riêng',
        correct: true,
        note: 'Đúng — ví dụ nhóm 9 có thể nghiêng cánh 1 hoặc cánh 8.',
      },
      { text: 'Nhóm bạn sẽ chuyển sang khi trưởng thành', note: 'Đó là mũi tên phát triển, không phải cánh.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Theo các “mũi tên” của Riso–Hudson, một người thay đổi thế nào khi phát triển so với khi căng thẳng?',
    choices: [
      { text: 'Khi nào cũng giữ nguyên một kiểu — nhóm là cố định, không đổi', note: 'Không — chính mũi tên khiến Enneagram thiên về phát triển, không cố định.' },
      { text: 'Khi phát triển ngả sang mặt kém của nhóm khác; khi căng thẳng hấp thụ nét tốt', note: 'Ngược rồi — phát triển hấp thụ nét TỐT, căng thẳng ngả sang mặt KÉM.' },
      {
        text: 'Khi an toàn, trưởng thành thì hấp thụ nét tốt của một nhóm; khi căng thẳng thì ngả sang mặt kém của một nhóm khác',
        correct: true,
        note: 'Đúng — đó là hai hướng integration / disintegration.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Một người nói “tôi nhóm 8 nên mới gắt, chịu thôi”. Vì sao đây là cách dùng Enneagram sai?',
    answer: (
      <>
        Vì Enneagram là {strong('bản đồ để soi mình, không phải lời tiên tri')} hay cái cớ. Dùng số
        nhóm để {strong('bào chữa')} là biến một công cụ tự nhận thức thành nhãn để nhốt mình. Đúng
        tinh thần là: nhận ra động lực và mặt dễ vấp của nhóm 8 (dễ áp đặt khi căng thẳng) rồi{' '}
        {strong('chủ động luyện')} hướng phát triển — chứ không phải đóng khung “tôi vốn thế”.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Enneagram (hệ chín kiểu tính cách) có phải một “cổ thư ngàn năm” không?',
    choices: [
      {
        text: 'Không — hệ chín kiểu tính cách là công trình hiện đại, hình thành khoảng giữa thế kỷ 20 qua Ichazo rồi Naranjo; chỉ riêng biểu tượng cửu giác là cũ hơn (truyền qua Gurdjieff)',
        correct: true,
        note: 'Đúng — nói thẳng: phần “chín kiểu tính cách” là công trình hiện đại, không phải minh triết cổ đại.',
      },
      {
        text: 'Có — đây là bộ môn cổ đại hàng nghìn năm, giữ nguyên từ xưa tới nay',
        note: 'Đây chính là ngộ nhận phổ biến bài đính chính: hệ chín kiểu mới được bồi đắp trong khoảng nửa thế kỷ gần đây.',
      },
      {
        text: 'Có — do Riso và Hudson viết ra từ thời cổ đại',
        note: 'Không — Riso và Hudson là người hiện đại; họ phổ biến phần cánh, mũi tên, mức phát triển, không phải tác giả cổ đại.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt:
      'Theo cách trình bày phổ biến, ba trung tâm (bụng / tim / đầu) gắn với ba cảm xúc lõi nào?',
    choices: [
      {
        text: 'Bụng — vui · Tim — buồn · Đầu — tức',
        note: 'Không khớp; ba cảm xúc lõi theo cách trình bày phổ biến là giận, xấu hổ, sợ.',
      },
      {
        text: 'Bụng (8·9·1) — giận · Tim (2·3·4) — xấu hổ · Đầu (5·6·7) — sợ',
        correct: true,
        note: 'Đúng — đây là cách sắp xếp khung phổ biến, không phải một khẳng định thần kinh học.',
      },
      {
        text: 'Ba trung tâm không liên quan gì tới cảm xúc, chỉ nói về nghề nghiệp',
        note: 'Ba trung tâm nói về nguồn phản ứng và cảm xúc lõi, không phải nghề.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Trắc nghiệm Enneagram trên hieu.asia có nói được bạn thuộc bản năng trội nào (sp / sx / so) không? Vì sao?',
    answer: (
      <>
        {strong('Không')}. Bài trắc nghiệm ở đây chỉ tìm {strong('nhóm chính và cánh')}. Bản năng
        (tự tồn sp, xã hội so, thân mật sx) và {strong('subtype')} — ghép nhóm với bản năng thành hai
        mươi bảy tổ hợp — là {strong('lớp nâng cao')}, cần quan sát sâu mới xác định được, nên một bài
        rút gọn không đo. Phần bản năng trên trang chỉ ở mức phác họa để bạn hình dung, không phải kết
        quả đo cho riêng bạn.
      </>
    ),
  },
];

export function EnneagramRecall() {
  return <ActiveRecall topicId="enneagram" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Bạn hiểu nếu giải thích được Enneagram dùng để làm gì (bản đồ hiểu động cơ của mình) — và nó KHÔNG hứa gì (không phải lời tiên tri, không thay lời khuyên chuyên môn).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Bạn hiểu nếu mô tả được cách đọc một nhóm: động lực cốt lõi (sợ gì / muốn gì) → trung tâm → cánh → hai mũi tên phát triển và căng thẳng.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Bạn hiểu nếu nói được vì sao Enneagram (đào vào động lực, nỗi sợ cốt lõi) khác MBTI (mô tả cách tư duy, tiếp nhận thông tin) và vì sao chúng bổ sung nhau.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Bạn hiểu nếu chỉ ra được giới hạn của Enneagram — là góc nhìn tham khảo trên một phổ, không phải phép đo khoa học như xét nghiệm.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Bạn hiểu nếu giải thích được vì sao hai người trông rất khác nhau vẫn có thể cùng một nhóm (cùng động lực cốt lõi, khác cánh và mức lành mạnh/căng thẳng).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Bạn hiểu nếu nói được vì sao không được dùng số nhóm để bào chữa hay đóng khung người khác — và vì sao không nhóm nào “tốt/xấu” hơn nhóm nào.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Bạn hiểu nếu giảng lại được “cánh” và “mũi tên” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'history',
    facet: 'Nguồn gốc',
    can: 'Bạn hiểu nếu kể được vì sao Enneagram chín kiểu KHÔNG phải “cổ thư ngàn năm” — biểu tượng cửu giác cũ hơn (truyền qua Gurdjieff), còn hệ chín kiểu là công trình hiện đại do Ichazo, Naranjo rồi Riso–Hudson bồi đắp.',
  },
  {
    id: 'depth-layers',
    facet: 'Lớp nâng cao',
    can: 'Bạn hiểu nếu nói được ba bản năng (sp/sx/so) và “mức phát triển” là gì ở mức khái niệm — và biết trắc nghiệm ở đây chỉ tìm nhóm chính + cánh, không đo bản năng hay subtype.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Bạn hiểu nếu chỉ ra được khái niệm nào (vd trung tâm, cánh, hay hai mũi tên) bạn vẫn còn thấy mơ hồ.',
  },
];

export function EnneagramChecklist() {
  return <UnderstandingChecklist topicId="enneagram" facets={FACETS} />;
}

export function EnneagramWhys() {
  return (
    <FiveWhys
      topicId="enneagram"
      start={
        <>
          Ai đó tự nhận “tôi nhóm 8 nên mới gắt, chịu thôi” — dùng số nhóm Enneagram như một cái cớ.
        </>
      }
      chain={[
        {
          question: 'Vì sao lấy số nhóm ra bào chữa lại là dùng Enneagram sai?',
          because: (
            <>
              Vì Enneagram là {strong('bản đồ để soi mình, không phải lời tiên tri')} hay cái cớ để
              khỏi thay đổi.
            </>
          ),
        },
        {
          question: 'Vì sao nó chỉ là bản đồ chứ không phải điều cố định?',
          because: (
            <>
              Vì mỗi nhóm có {strong('mũi tên')}: khi phát triển hấp thụ nét tốt của một nhóm, khi
              căng thẳng ngả sang mặt kém của nhóm khác — bạn không đứng yên một chỗ.
            </>
          ),
        },
        {
          question: 'Vì sao Enneagram mô tả động cơ có thể dịch chuyển như vậy?',
          because: (
            <>
              Vì nó phân nhóm theo {strong('động lực sâu bên trong')} (sợ gì / muốn gì), chứ không
              phải khoá bạn vào một tập hành vi bề mặt.
            </>
          ),
        },
        {
          question: 'Vì sao nhìn vào động lực lại quan trọng hơn nhìn hành vi?',
          because: (
            <>
              Vì cùng một động cơ có thể hiện ra rất nhiều hành vi khác nhau — đó là lý do hai người
              trông khác nhau vẫn {strong('cùng một nhóm')}, và một người vẫn thay đổi được cách biểu
              hiện.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng Enneagram?',
          because: (
            <>
              Vì mục đích là {strong('hiểu động cơ để chủ động luyện và trưởng thành')}, không phải
              dán một cái nhãn rồi nhốt mình (hay người khác) trong đó.
            </>
          ),
        },
      ]}
      root={
        <>
          Enneagram là bản đồ động lực để phát triển, không phải cái hộp để nhốt. Số nhóm cho biết
          bạn thường bắt đầu từ đâu và dễ vấp ở đâu — nhưng cánh, hai mũi tên và lựa chọn của bạn mới
          quyết định bạn trở thành ai. Dùng nó để soi mình rồi hành động, đừng dùng để bào chữa.
        </>
      }
    />
  );
}
