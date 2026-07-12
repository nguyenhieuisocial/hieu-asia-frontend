/**
 * Nội dung "học chủ động" cho trang /learn/dat-ten-ngu-hanh.
 *
 * TẤT CẢ grounded từ quan niệm đặt tên theo Ngũ Hành: chọn tên bổ trợ hành
 * đang thiếu / là dụng thần trong Bát Tự bé, nhận biết hành của chữ qua bộ thủ
 * chữ Hán hoặc nghĩa, rồi ghép thành tên hay (nghĩa đẹp + âm hài hoà + hợp
 * phong tục). KHÔNG thêm dữ kiện mới. Giữ giọng "tham khảo theo phong tục,
 * không máy móc" — đề cao NGHĨA + ÂM + tình cảm gia đình hơn quy tắc cứng, và
 * trung thực về giới hạn (ngũ hành trong tên không quyết định vận mệnh).
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

export function DatTenFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bố mẹ muốn đặt cho con một cái tên {strong('vừa hay vừa có ý nghĩa')}, và nghe nói “nên chọn
          tên hợp ngũ hành” — nhưng không biết bắt đầu từ đâu, sợ chọn sai hoặc chọn chữ khó đọc chỉ
          để “đủ hành”.
        </>
      }
      why={
        <>
          Đặt tên theo Ngũ Hành là một {strong('nét văn hoá phương Đông')}: chọn tên sao cho hành của
          nó bổ trợ cho lá số Bát Tự của bé — bổ hành đang thiếu, tránh hành gây xung khắc, giúp cân
          bằng Kim – Mộc – Thủy – Hỏa – Thổ. Đây là một lớp tham khảo, không phải luật bắt buộc.
        </>
      }
      what={
        <>
          Một cái tên hay trước hết là {strong('nghĩa đẹp + âm dễ thương + tình cảm gia đình gửi gắm')}.
          Ngũ hành chỉ là {strong('lớp tham khảo bổ sung')} — không nên máy móc chọn chữ khó đọc, khó
          hiểu chỉ để cho “đủ hành”.
        </>
      }
      how={
        <>
          Ba bước: (1) {strong('lập Bát Tự bé')} để xem hành nào thiếu (dụng thần); (2){' '}
          {strong('chọn chữ mang hành cần bổ')} — nhận biết qua bộ thủ chữ Hán hoặc qua nghĩa/âm; (3){' '}
          {strong('ghép thành tên hay')}: nghĩa đẹp, âm hài hoà, hợp họ và phong tục gia đình.
        </>
      }
      soWhat={
        <>
          Để chọn được một cái tên {strong('theo con cả đời')} mà bé sống thoải mái, tự hào — dùng ngũ
          hành như một góc gợi ý để tham khảo, chứ không để áp lực “đúng hành” lấn át ý nghĩa và sự dễ
          thương của tên.
        </>
      }
    />
  );
}

export function DatTenDepth() {
  return (
    <div className="space-y-6">
    <DepthTabs
      topicId="dat-ten-ngu-hanh"
      concept="Vì sao ngũ hành chỉ là lớp tham khảo, còn nghĩa và âm mới là cái gốc của một tên hay"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đặt tên cho em bé giống như tặng một món quà đi theo cả đời. Món quà ấy cần{' '}
              {strong('dễ thương và dễ gọi')} trước đã. Có người còn xem thêm “em bé thiếu chất gì” để
              chọn chữ hợp — nhưng đó chỉ là {strong('điểm cộng thêm')}, không phải điều quan trọng nhất.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Người ta lập {strong('Bát Tự')} của bé (từ giờ – ngày – tháng – năm sinh) để xem trong
                năm hành Kim – Mộc – Thủy – Hỏa – Thổ, hành nào đang {strong('thiếu')} hoặc cần bổ (gọi
                là dụng thần). Rồi chọn chữ mang hành đó để đặt tên, giúp lá số cân bằng hơn.
              </p>
              <p>
                Nhận biết hành của một chữ thường qua {strong('bộ thủ chữ Hán')}: chữ có bộ Thủy (氵)
                thuộc hành Thủy, bộ Mộc (木) thuộc hành Mộc… Nhưng quy tắc này chỉ để tham khảo — chọn
                chữ mà {strong('nghĩa đẹp, âm hay')} vẫn quan trọng hơn là ép cho đủ hành.
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
                Quy trình đầy đủ: lập Bát Tự → xét vượng – nhược của Nhật Chủ và ngũ hành trong tứ trụ →
                xác định {strong('dụng thần')} (hành cần bổ), tránh hành gây xung khắc. Sau đó chọn chữ
                mang hành cần bổ, nhận biết qua {strong('bộ thủ')} (Thủy 氵: Giang, Hà, Hải, Khê; Mộc 木:
                Lâm, Nam, Bách, Kha; Hỏa 火/日: Huân, Dương, Minh; Kim 金: Ngân, Cẩm, Chung; Thổ 土/山:
                Sơn, Khôn, Phong) hoặc qua nghĩa/âm gợi hành.
              </p>
              <p>
                Một số trường phái thêm lớp {strong('số nét chữ')} (Thiên/Địa/Nhân/Tổng cách, tam tài) —
                phức tạp, tuỳ hệ, chỉ nên xem là {strong('lớp tham khảo phụ')}. Điều cần giữ tỉnh táo:
                ngũ hành trong tên là quan niệm văn hoá, {strong('không có bằng chứng quyết định vận mệnh')}.
                Đừng để áp lực “chọn đúng hành” lấn át nghĩa đẹp, âm hay và sự thoải mái của bé.
              </p>
            </>
          ),
        },
      ]}
    />
    <DepthTabs
      topicId="dat-ten-ngu-hanh"
      concept="Dụng thần: hành cần bổ, tìm ra bằng cách lập Bát Tự xem hành nào vượng, hành nào nhược"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Mỗi em bé sinh ra mang sẵn năm loại “chất”: Kim, Mộc, Thủy, Hỏa, Thổ. Có bé nhiều chất
              này mà ít chất kia. Người lớn nhìn xem bé đang {strong('thiếu chất nào')}, rồi chọn một
              cái tên bù vào cho cân. Chất đang thiếu ấy chính là cái ta muốn thêm qua tên.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Người ta lập {strong('Bát Tự')} của bé từ giờ, ngày, tháng, năm sinh, rồi nhìn xem
                trong đó hành nào {strong('vượng')} (mạnh), hành nào {strong('nhược')} (yếu) hay thiếu
                hẳn.
              </p>
              <p>
                Hành đang thiếu, cần được nâng đỡ để lá số cân bằng, gọi là {strong('dụng thần')} —
                chính là hành ta muốn bổ qua cái tên. Đồng thời tránh những hành gây xung khắc kẻo lá
                số lệch thêm.
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
                Bước đầu của quy trình đặt tên: từ tứ trụ, xét {strong('vượng – nhược')} của lá số rồi
                xác định {strong('dụng thần')} — hành cần bổ để đưa lá số về cân bằng, đồng thời tránh
                hành gây xung khắc. Đừng đoán bằng mắt: phải lập Bát Tự mới biết vì sao chọn hành này
                chứ không phải hành kia.
              </p>
              <p>
                Bạn không cần tự tính tay, có thể để công cụ hỗ trợ; phần hiểu này để bạn không nhận
                một gợi ý kiểu {strong('“hộp đen”')}. Và nhớ: đây mới là hành cần bổ, chưa phải cả cái
                tên.
              </p>
            </>
          ),
        },
      ]}
    />
    <DepthTabs
      topicId="dat-ten-ngu-hanh"
      concept="Nhận biết hành của một chữ: qua bộ thủ chữ Hán, hay qua nghĩa và âm"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Mỗi chữ dùng để đặt tên cũng được xếp vào một hành. Làm sao biết chữ nào thuộc hành nào?
              Nhìn {strong('nghĩa')} của nó là ra: chữ gợi tới nước — sông, suối, biển — thường thuộc
              Thủy; chữ gợi tới cây cối thuộc Mộc; chữ gợi tới ánh sáng, mặt trời thuộc Hỏa.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Cách phổ biến nhất là nhận biết qua {strong('bộ thủ chữ Hán')}: chữ chứa bộ Thủy (氵)
                thuộc Thủy, bộ Mộc (木) thuộc Mộc, bộ Hỏa (火) hay Nhật (日) thuộc Hỏa, bộ Kim (金)
                thuộc Kim, bộ Thổ (土) hay Sơn (山) thuộc Thổ.
              </p>
              <p>
                Ngoài bộ thủ, người ta còn xét theo {strong('nghĩa')} hoặc {strong('âm')} gợi hành.
                Các cách này bổ sung cho nhau, và việc xếp một chữ vào hành nào ít nhiều mang tính quy
                ước.
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
                Ba lối nhận biết — {strong('bộ thủ, nghĩa, âm')} — được dùng song song. Bộ thủ cho tín
                hiệu rõ nhất (Giang, Hà, Hải, Khê đều mang bộ Thủy), nhưng nhiều chữ Việt được xếp hành
                chủ yếu theo nghĩa, nên cách xếp có phần {strong('quy ước')} chứ không phải luật cứng.
              </p>
              <p>
                Hệ quả thực dụng: đừng câu nệ một chữ phải “đúng bộ” bằng mọi giá. Trong số các chữ hợp
                hành, hãy chọn chữ {strong('nghĩa đẹp và âm hay')}, đừng ép lấy một chữ khó đọc chỉ vì
                nó đúng bộ thủ.
              </p>
            </>
          ),
        },
      ]}
    />
    <DepthTabs
      topicId="dat-ten-ngu-hanh"
      concept="Tam tài, tứ cách: lớp đếm nét chữ Hán, vì sao chỉ nên xem là tham khảo phụ"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Ngoài chuyện xem hành của chữ, có người còn {strong('đếm số nét')} viết ra mỗi chữ, rồi
              từ những con số đó đoán tốt hay xấu. Cách này rắc rối và không mấy hợp với tên tiếng
              Việt, nên chỉ xem cho biết, đừng lo lắng theo nó.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                {strong('Tam tài')} là Thiên – Địa – Nhân; {strong('tứ cách')} là Thiên cách, Địa
                cách, Nhân cách, Tổng cách. Người ta đếm số nét từng chữ Hán trong họ tên, cộng theo
                công thức để ra các “cách”, rồi luận cát – hung. Hệ này phổ biến trong danh học Nhật –
                Hàn.
              </p>
              <p>
                Vấn đề: tên thuần Việt viết bằng chữ Quốc ngữ, {strong('không có số nét chữ Hán cố định')},
                nên áp lớp này vào khá khập khiễng.
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
                Một chữ Việt có thể ứng với nhiều chữ Hán khác nhau, mỗi chữ số nét khác nhau, nên kết
                quả tam tài – tứ cách thành ra {strong('tuỳ cách quy chữ')} và dễ mâu thuẫn giữa các
                hệ. Vì vậy hieu.asia không lấy lớp này làm chính, chỉ xem là {strong('tham khảo phụ')} —
                phần chính vẫn là hành, nghĩa và âm.
              </p>
              <p>
                Rộng hơn: cả ngũ hành lẫn số nét trong tên đều là {strong('quan niệm văn hoá')}, không
                có bằng chứng quyết định vận mệnh, nên đừng câu nệ.
              </p>
            </>
          ),
        },
      ]}
    />
    </div>
  );
}

export function DatTenDepthSinh() {
  return (
    <DepthTabs
      topicId="dat-ten-ngu-hanh"
      concept="Bổ hành thông minh: dùng chính hành thiếu, hoặc dùng hành SINH ra nó"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Nếu bé “thiếu lửa”, ta có thể cho thêm lửa, hoặc cho thêm {strong('củi')} — vì củi nuôi
              lửa cháy. Trong ngũ hành, cây/củi (Mộc) {strong('nuôi')} lửa (Hỏa). Bổ bằng cái nuôi
              dưỡng cũng là một cách hay, nhẹ nhàng hơn.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Ngũ hành có {strong('vòng tương sinh')}: Mộc → Hỏa → Thổ → Kim → Thủy → Mộc (mỗi hành
                sinh ra, nuôi hành kế tiếp). Nên khi cần bổ một hành X, có hai hướng: dùng{' '}
                {strong('chính hành X')} (bổ thẳng), hoặc dùng {strong('hành sinh ra X')} — kiểu “mẹ
                nuôi con”.
              </p>
              <p>
                Ví dụ bé thiếu Hỏa: có thể chọn chữ hành Hỏa, mà cũng có thể chọn chữ hành{' '}
                {strong('Mộc')} vì Mộc sinh Hỏa. Cách thứ hai giống như “thêm củi cho lửa” — bồi dưỡng
                hành thiếu thay vì dồn thẳng.
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
                Đây là kỹ thuật {strong('phù dụng thần')}: hoặc bổ trực tiếp bằng đồng hành, hoặc phù
                trợ bằng hành tương sinh (hành “mẹ” sinh ra hành cần bổ). Các trường phái không hoàn
                toàn thống nhất — có phái ưu tiên bổ thẳng, có phái cho rằng khi hành thiếu quá yếu thì
                phù bằng hành sinh sẽ bền hơn; và còn phải nhìn bối cảnh cả tứ trụ, không máy móc.
              </p>
              <p>
                Chính công cụ gợi ý hành hợp của hieu.asia cũng đi theo hướng này: nó gợi ý cả{' '}
                {strong('hành sinh ra mệnh')} lẫn {strong('hành đồng loại')}, chứ không chỉ một hành.
                Dù vậy, hãy nhớ đây vẫn là lớp tham khảo — nghĩa đẹp và âm hay mới là gốc của một cái
                tên.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

const RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: 'q1',
    type: 'open',
    prompt: 'Ý tưởng cốt lõi của đặt tên theo Ngũ Hành là gì?',
    answer: (
      <>
        Chọn tên (tên đệm + tên chính) sao cho {strong('hành của tên bổ trợ cho lá số Bát Tự của bé')} —
        bổ hành đang thiếu / là dụng thần, tránh hành gây xung khắc — để cân bằng Kim – Mộc – Thủy –
        Hỏa – Thổ. Đây là một lớp tham khảo, không phải luật bắt buộc.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Làm sao biết bé đang thiếu hành nào để bổ?',
    choices: [
      {
        text: 'Lập Bát Tự của bé từ giờ – ngày – tháng – năm sinh, xem hành nào vượng/nhược, thiếu hành nào (dụng thần)',
        correct: true,
        note: 'Đúng — đó là bước 1, xác định hành cần bổ.',
      },
      { text: 'Nhìn vào họ của bố để suy ra', note: 'Không — họ không cho biết hành thiếu; phải xét Bát Tự.' },
      { text: 'Chọn đại một hành cho đẹp', note: 'Không — cần lập Bát Tự để biết hành nào cần bổ.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Có bắt buộc phải đặt tên theo ngũ hành không?',
    choices: [
      {
        text: 'Không — một tên hay trước hết là nghĩa đẹp + âm dễ thương + tình cảm gia đình; ngũ hành chỉ là lớp tham khảo',
        correct: true,
        note: 'Đúng — ngũ hành là điểm cộng thêm, không phải luật cứng.',
      },
      { text: 'Có — nếu không hợp hành thì bé sẽ gặp xui', note: 'Không — ngũ hành trong tên không quyết định vận mệnh.' },
      { text: 'Có — mọi cái tên đều phải đủ 5 hành', note: 'Không — không có quy tắc “đủ 5 hành” bắt buộc.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Có nên chọn một chữ khó đọc, khó hiểu chỉ để cho “đủ hành” không?',
    choices: [
      {
        text: 'Không — tên theo con cả đời, nên ưu tiên để bé đọc – viết dễ, sống thoải mái; đừng máy móc vì đủ hành',
        correct: true,
        note: 'Đúng — nghĩa đẹp và âm hay quan trọng hơn việc ép đủ hành.',
      },
      {
        text: 'Có — miễn đủ hành là được, khó đọc cũng không sao',
        note: 'Không — chọn chữ khó chỉ để đủ hành là máy móc, dễ khiến bé chịu thiệt.',
      },
      { text: 'Có — chữ càng lạ càng quý', note: 'Không — lạ không đồng nghĩa với hay; dễ đọc dễ viết mới lợi cho bé.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Bát Tự bé cho thấy thiếu hành Thủy. Bạn sẽ chọn chữ theo hướng nào, và cần cân nhắc thêm điều gì trước khi chốt tên?',
    answer: (
      <>
        Ưu tiên chữ mang {strong('hành Thủy')} — nhận biết qua bộ thủ Thủy (氵) như Giang, Hà, Hải,
        Khê, hoặc qua nghĩa/âm gợi Thủy. Nhưng trước khi chốt vẫn cần cân nhắc: {strong('nghĩa đẹp')},{' '}
        {strong('âm hài hoà')} với họ (thanh điệu dễ nghe), dễ đọc dễ viết, không phạm huý / trùng tên
        người trên trong nhà. Nếu chữ hợp hành nhưng khó đọc hoặc nghĩa không hay, nên chọn phương án
        khác — vì tên đi theo con cả đời.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt:
      'Bé thiếu hành Hỏa. Ngoài chọn chữ hành Hỏa, theo nguyên tắc tương sinh còn cách bổ nào?',
    choices: [
      {
        text: 'Chọn chữ hành Mộc — vì Mộc sinh Hỏa (mẹ nuôi con), bồi dưỡng hành Hỏa một cách gián tiếp',
        correct: true,
        note: 'Đúng — trong vòng tương sinh Mộc → Hỏa, dùng hành sinh ra hành thiếu là cách “thêm củi cho lửa”.',
      },
      {
        text: 'Chọn chữ hành Thủy cho “mát”',
        note: 'Không — Thủy khắc Hỏa, không bồi dưỡng mà làm hao hành Hỏa.',
      },
      {
        text: 'Chọn chữ hành Kim',
        note: 'Không — Kim không sinh Hỏa (ngược lại Hỏa khắc Kim); không phải hành “mẹ” của Hỏa.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt: 'Tục kiêng huý là gì, và nên xem nó thế nào khi đặt tên cho con?',
    answer: (
      <>
        Kiêng huý là tục {strong('tránh dùng thẳng tên')} người bậc trên — ông bà, cha mẹ, người đã
        khuất trong họ; thời xưa còn kiêng cả tên vua quan. Vì thế nhiều nhà tránh đặt tên con trùng
        tên người trên để giữ tôn ti và tránh phạm huý. Đây là {strong('phong tục')}, không phải luật
        — nên tôn trọng nếp nhà, nhưng không cần lo sợ, và vẫn lấy nghĩa đẹp, âm hay làm gốc.
      </>
    ),
  },
];

export function DatTenRecall() {
  return <ActiveRecall topicId="dat-ten-ngu-hanh" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được đặt tên theo ngũ hành dùng để làm gì (chọn tên bổ hành thiếu trong Bát Tự bé) — và nó KHÔNG hứa gì (không quyết định vận mệnh, không bắt buộc).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả được quy trình 3 bước: lập Bát Tự tìm hành cần bổ → chọn chữ mang hành đó → ghép thành tên hay.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Nhận biết hành của một chữ qua bộ thủ chữ Hán (Thủy 氵, Mộc 木, Hỏa 火/日, Kim 金, Thổ 土/山) hoặc qua nghĩa/âm gợi hành.',
  },
  {
    id: 'tuong-sinh',
    facet: 'Tương sinh',
    can: 'Giải thích được cách bổ hành theo tương sinh: dùng chính hành cần bổ (bổ thẳng), hoặc dùng hành SINH ra nó (mẹ nuôi con) — ví dụ thiếu Hỏa có thể dùng Mộc vì Mộc sinh Hỏa.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt được “tên hợp hành” với “tên hay”: một tên hay cần nghĩa đẹp + âm hài hoà + hợp phong tục, ngũ hành chỉ là lớp thêm.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra lớp số nét chữ (tam tài, tứ cách) chỉ là tham khảo phụ, tuỳ hệ; và ngũ hành trong tên là quan niệm văn hoá, không có bằng chứng quyết định vận mệnh.',
  },
  {
    id: 'phong-tuc',
    facet: 'Phong tục',
    can: 'Nói được các phong tục quanh việc đặt tên (kiêng huý — tránh trùng tên bậc trên trong họ) là tập tục để cân nhắc, không phải luật, và nên tôn trọng mà không lo sợ.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao KHÔNG nên chọn chữ khó đọc / khó hiểu chỉ để “đủ hành”, và vì sao không cần lo sợ nếu tên chưa “đúng hành”.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân “đặt tên theo ngũ hành là gì và nên hiểu ra sao” bằng lời của bạn, giữ giọng tham khảo, đề cao nghĩa và âm.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd cách lập Bát Tự, xác định dụng thần, đọc bộ thủ) bạn vẫn còn thấy mơ hồ.',
  },
];

export function DatTenChecklist() {
  return <UnderstandingChecklist topicId="dat-ten-ngu-hanh" facets={FACETS} />;
}

export function DatTenWhys() {
  return (
    <FiveWhys
      topicId="dat-ten-ngu-hanh"
      start={
        <>
          Một cặp bố mẹ nghe nói con “thiếu hành Kim”, liền định chọn một chữ Hán rất lạ và khó đọc chỉ
          vì nó mang bộ Kim — dù cả nhà thấy tên ấy trúc trắc, khó gọi và nghĩa không rõ.
        </>
      }
      chain={[
        {
          question: 'Vì sao chọn một chữ khó đọc chỉ vì nó “đủ hành” lại là quyết định chưa hợp lý?',
          because: (
            <>
              Vì một cái tên hay trước hết là {strong('nghĩa đẹp + âm dễ thương')}, chứ không phải chỉ
              cần mang đúng hành.
            </>
          ),
        },
        {
          question: 'Vì sao nghĩa và âm lại quan trọng hơn việc “đủ hành”?',
          because: (
            <>
              Vì tên là {strong('món quà theo con cả đời')} — bé sẽ đọc, viết, giới thiệu tên mình mỗi
              ngày; dễ đọc dễ hiểu và tự hào với tên mới là điều bé cần.
            </>
          ),
        },
        {
          question: 'Vì sao ngũ hành lại chỉ nên là một lớp tham khảo, không phải luật bắt buộc?',
          because: (
            <>
              Vì ngũ hành trong tên là {strong('quan niệm văn hoá')}, không có bằng chứng quyết định vận
              mệnh — nó gợi ý để cân bằng, không phải điều kiện để bé được hạnh phúc.
            </>
          ),
        },
        {
          question: 'Vì sao vẫn có người muốn xem ngũ hành khi đặt tên?',
          because: (
            <>
              Vì đó là một {strong('nét văn hoá đẹp')}: bố mẹ gửi mong muốn con được cân bằng, may mắn
              vào cái tên. Dùng như lời chúc để tham khảo thì rất ý nghĩa.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đặt tên cho con?',
          because: (
            <>
              Vì hiểu vậy rồi thì ta {strong('không máy móc')}: lấy nghĩa đẹp – âm hay – tình cảm gia
              đình làm gốc, xem ngũ hành như một góc gợi ý; nếu chữ hợp hành mà khó đọc hoặc nghĩa
              không hay thì chọn phương án khác.
            </>
          ),
        },
      ]}
      root={
        <>
          Đặt tên theo ngũ hành là một nét văn hoá đáng trân trọng để gửi lời chúc cân bằng vào tên
          con, nhưng không phải bản án. Hãy để {strong('nghĩa đẹp, âm hay và tình cảm gia đình')} làm
          gốc, ngũ hành là lớp tham khảo — {strong('tham khảo, không máy móc')}.
        </>
      }
    />
  );
}
