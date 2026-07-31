/**
 * Nội dung "học chủ động" cho trang /learn/nap-am.
 *
 * TẤT CẢ dữ kiện lấy từ chính engine của công cụ /ban-menh:
 *   • lib/dat-ten-ngu-hanh.ts → computeBanMenh(): cycle = (nămÂm − 4) % 60;
 *     napAm = NAP_AM[floor(cycle / 2)] — nguồn của "2 năm liền dùng chung 1 tên
 *     nạp âm"; bảng NAP_AM có đúng 30 mục, chia đều 5 hành × 6 tên. ELEMENTS cho
 *     tên hiển thị 5 hành và quan hệ sinh – khắc.
 *   • lib/sinh-con.ts → yearProfile(year) → { canChi, napAmName, element }. Mọi
 *     cặp can chi ↔ tên nạp âm nêu dưới đây đều đối chiếu bằng engine này (vd
 *     Giáp Tý · Ất Sửu = Hải Trung Kim; Canh Ngọ · Tân Mùi = Lộ Bàng Thổ; Canh
 *     Thìn · Tân Tỵ = Bạch Lạp Kim; Bính Ngọ · Đinh Mùi = Thiên Hà Thủy).
 *   • lib/ban-menh-data.ts → buildBanMenh(): màu hợp / nghề hợp CHỈ suy từ
 *     `element`, KHÔNG từ `napAmName` — cơ sở cho khẳng định "hai nạp âm cùng
 *     hành thì công cụ xử lý y hệt nhau". Tuổi theo NĂM ÂM LỊCH (đổi vào Tết).
 *
 * KHÔNG lấn sân: cơ chế 10 Can × 12 Chi và chu kỳ 60 → /luc-thap-hoa-giap; chọn
 * màu theo hành → /learn/ngu-hanh-mau-sac; đặt tên → /learn/dat-ten-ngu-hanh.
 *
 * Giọng: quy ước để THAM KHẢO, tra được minh bạch — không phán số mệnh, không
 * bán chuyện "đổi mệnh".
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

export function NapAmFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Ai cũng biết nói {strong('“tôi mệnh Kim”')}, nhưng hỏi cái mệnh ấy ở đâu ra thì hầu hết
          dừng lại. Người đoán mệnh nằm trong chữ Can, người đoán nằm ở con giáp — cả hai đều trượt,
          và vì trượt nên rất dễ tự tra ra một kết quả sai rồi tin theo.
        </>
      }
      why={
        <>
          Vì {strong('nạp âm')} là chặng bị bỏ qua giữa năm sinh và ngũ hành bản mệnh. Thiếu chặng
          này, mọi thứ suy tiếp từ mệnh — màu sắc, chữ đặt tên, cách đọc các bảng tra cổ — đều đứng
          trên một con số bạn không kiểm được.
        </>
      }
      what={
        <>
          Một bảng đặt tên: mỗi cặp can chi trong vòng 60 được gán một cái tên giàu hình ảnh, và tên
          luôn kết thúc bằng một hành. Bảng gán theo cặp nên 60 cặp chỉ sinh ra{' '}
          {strong('30 tên nạp âm')}, mỗi tên dùng chung cho {strong('hai năm liền kề')}.
        </>
      }
      how={
        <>
          Đi bốn chặng: năm dương → năm âm (đổi vào Tết) → cặp can chi → tra bảng ra tên nạp âm →{' '}
          {strong('lấy chữ cuối của tên làm hành bản mệnh')}. Ví dụ năm âm Canh Ngọ tra ra Lộ Bàng
          Thổ, chữ cuối là Thổ nên mệnh Thổ — dù can là Canh.
        </>
      }
      soWhat={
        <>
          Để bạn {strong('tự kiểm được kết quả')} thay vì nhận một chữ “mệnh Kim” không rõ nguồn — và
          để biết đúng tầm của nó: một quy ước chỉ phân giải tới mức năm, {strong('không dùng để phán')}{' '}
          hai người hợp hay khắc nhau.
        </>
      }
    />
  );
}

export function NapAmDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="nap-am"
        concept="Vì sao 60 cặp can chi chỉ ra 30 tên nạp âm"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tưởng tượng 60 chiếc ghế xếp thành hàng dài. Người xưa không đặt tên cho từng chiếc,
                mà {strong('cứ hai chiếc cạnh nhau thì đặt chung một cái tên')}. Vậy 60 chiếc ghế chỉ
                cần 30 cái tên là đủ. Nạp âm là những cái tên ấy.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Vòng can chi có 60 năm, xếp thứ tự từ Giáp Tý. Bảng nạp âm gán tên{' '}
                {strong('theo từng cặp hai năm liền nhau')}: Giáp Tý và Ất Sửu cùng mang tên Hải
                Trung Kim; Bính Dần và Đinh Mão cùng mang tên Lô Trung Hỏa; cứ thế cho hết vòng. 60
                chia cho 2 bằng 30, nên có đúng {strong('30 tên nạp âm')} — và hệ quả rất dễ kiểm:
                người sinh 1984 và người sinh 1985 cùng mệnh.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Trong công cụ, chuyện “theo cặp” gói gọn trong một phép chia hai. Vị trí của năm
                  trong vòng 60 được tính bằng phần dư khi chia 60, rồi{' '}
                  {strong('chia đôi lấy phần nguyên')} để tra bảng 30 mục. Hai vị trí liền nhau (một
                  chẵn một lẻ) luôn cho cùng một chỉ số, nên luôn cùng một tên.
                </p>
                <p>
                  Lưu ý một cạm bẫy: cặp được chia theo{' '}
                  {strong('vị trí trong vòng, không phải theo “năm chẵn – năm lẻ”')}. Người sinh 1995
                  ghép cặp với 1994 (Giáp Tuất · Ất Hợi, cùng Sơn Đầu Hỏa) chứ không ghép với 1996.
                  Muốn biết mình đứng đầu hay cuối cặp, cứ tra một lượt hai năm liền kề.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="nap-am"
        concept="Mệnh ra từ nạp âm — không từ can, không từ chi"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Năm sinh của bạn có một cái tên riêng, ví dụ {strong('“vàng trong lòng biển”')}. Chữ
                cuối của cái tên đó cho biết bạn mệnh gì. Không phải nghe chữ đầu tiên của năm, cũng
                không phải nhìn con giáp — mà là {strong('chữ cuối của cái tên')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Nhiều người nghĩ chữ Canh nghe như kim loại thì mệnh phải là Kim. Thử kiểm: năm
                  1990 là Canh Ngọ, tra bảng ra {strong('Lộ Bàng Thổ')} nên mệnh {strong('Thổ')}. Năm
                  2000 là Canh Thìn, tra ra {strong('Bạch Lạp Kim')} nên mệnh {strong('Kim')}. Cùng
                  chữ Canh mà hai mệnh khác nhau.
                </p>
                <p>
                  Với con giáp cũng vậy. Năm chi Tý trong một vòng 60 có tới năm năm, và chúng ra đủ
                  cả năm hành: Giáp Tý là Kim, Bính Tý là Thủy, Mậu Tý là Hỏa, Canh Tý là Thổ, Nhâm
                  Tý là Mộc. Nên {strong('cùng tuổi Tý hoàn toàn có thể khác mệnh')}.
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
                  Cần tách ba lớp hay bị gộp làm một. Lớp một: hành của{' '}
                  {strong('Thiên Can và Địa Chi')} — mỗi can, mỗi chi đều có hành riêng, dùng khi
                  luận lá số Bát Tự. Lớp hai: {strong('con giáp')}, đi theo chi. Lớp ba:{' '}
                  {strong('nạp âm')} của cặp can chi — và chỉ lớp này mới sinh ra ngũ hành bản mệnh.
                </p>
                <p>
                  Ba lớp cùng xuất phát từ một cặp can chi nên rất dễ tưởng là một. Nhưng chúng độc
                  lập: biết hành của can không suy ra được nạp âm, và biết con giáp cũng không.{' '}
                  {strong('Bảng nạp âm là bước tra bắt buộc')}, không nhẩm tắt được. Khi kết quả bạn
                  tra tay lệch với công cụ, hãy kiểm xem mình có đang đọc mệnh thẳng từ can hoặc từ
                  con giáp không — đó gần như luôn là nguyên nhân.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="nap-am"
        concept="Tên nạp âm là hình ảnh: “vàng trong biển”, “lửa trong lò”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ba mươi cái tên đều là {strong('những bức tranh nhỏ')}: vàng nằm trong lòng biển, lửa
                cháy trong lò, đất ven đường, cây tùng cây bách, nước sông trên trời. Người xưa đặt
                tên như vậy cho dễ nhớ, giống như ta đặt biệt danh cho bạn bè.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Mỗi tên nạp âm gồm hai phần: phần trước là hình ảnh, phần cuối là tên hành.{' '}
                {strong('Hải Trung Kim')} là “vàng trong lòng biển”, {strong('Lô Trung Hỏa')} là “lửa
                trong lò”, {strong('Lộ Bàng Thổ')} là “đất ven đường”, {strong('Đại Hải Thủy')} là
                “nước biển cả”. Vì cùng một hành có tới sáu tên, người xưa cần sáu hình ảnh để phân
                biệt: cùng là Kim mà có vàng trong biển, vàng nơi mũi kiếm, vàng lẫn trong cát, vàng
                làm trâm xuyến…
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Câu hỏi hay gặp: hình ảnh ấy có “nói” gì thêm về người mang mệnh không? Trả lời cho
                  đúng mức: {strong('về mặt hệ thống thì không')}. Trong công cụ của hieu.asia, mọi
                  thứ suy tiếp — màu hợp, màu nên hạn chế, nhóm nghề — đều tính từ{' '}
                  {strong('hành')}, còn tên nạp âm chỉ dùng để hiển thị. Hai người mệnh Hải Trung Kim
                  và Kiếm Phong Kim nhận kết quả y hệt nhau.
                </p>
                <p>
                  Sách xưa có thêm lời bàn riêng cho từng tên, nhưng các bản truyền lại{' '}
                  {strong('không thống nhất')} nên hieu.asia không suy diễn thêm. Cách đọc lành mạnh:
                  xem hình ảnh như một{' '}
                  {strong('mnemonic — cái móc để nhớ, không phải dữ kiện để luận')}.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="nap-am"
        concept="30 tên nhưng chỉ 5 hành — con số ấy nói lên điều gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ba mươi cái tên được chia vào {strong('năm rổ')}: rổ Kim, rổ Mộc, rổ Thủy, rổ Hỏa, rổ
                Thổ. Mỗi rổ đúng sáu cái tên, không rổ nào nhiều hơn. Cuối cùng, mọi người trên đời
                chỉ rơi vào năm cái rổ đó thôi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                30 tên chia đều cho 5 hành, {strong('mỗi hành đúng 6 tên')}. Nghĩa là khi ai đó nói
                “tôi mệnh Kim”, thực ra có sáu cách nói khác nhau cùng dẫn về hành Kim, và câu nói đã
                bỏ mất phần tên riêng. Nhìn theo hướng ngược lại thì con số này hơi đáng suy nghĩ: cả
                nhân loại được chia vào vỏn vẹn {strong('5 nhóm mệnh')}.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Đây là chỗ để đặt kỳ vọng cho đúng. Nạp âm là một phép{' '}
                  {strong('ánh xạ 60 → 30 → 5')}: sáu mươi cặp can chi gom về ba mươi tên, ba mươi
                  tên gom về năm hành. Mỗi bước gom là một bước mất thông tin, và tới bước cuối chỉ
                  còn lại năm giá trị. Vì vậy nạp âm hợp với vai trò{' '}
                  {strong('một lát cắt văn hoá dễ tra')}, không hợp với vai trò mô tả một cá nhân —
                  muốn thế phải xuống tới bốn trụ giờ – ngày – tháng – năm của lá số Bát Tự.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="nap-am"
        concept="Ranh giới năm âm: sinh trước Tết thì lấy mệnh năm nào"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Năm âm lịch {strong('chỉ đổi vào Tết')}, không đổi vào đêm giao thừa dương lịch. Nên
                em bé sinh vào tháng Một dương, khi Tết còn chưa tới, vẫn được tính là{' '}
                {strong('người của năm cũ')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Nạp âm tính theo năm âm lịch. Người sinh tháng 1 hoặc đầu tháng 2 dương lịch, tức{' '}
                {strong('trước Tết')}, thuộc năm âm liền trước — nên mệnh của họ là mệnh của{' '}
                {strong('năm trước')}, không phải năm dương trên giấy khai sinh. Chênh một năm là
                chuyện lớn, vì hai năm liền kề có thể thuộc hai cặp nạp âm khác nhau và ra hai hành
                khác hẳn.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Công cụ quy năm sinh về năm âm theo đúng quy ước dân gian{' '}
                  {strong('tuổi tính theo năm âm lịch')}. Điểm cần cẩn thận không nằm ở phép tính mà
                  ở dữ liệu đầu vào: rất nhiều người khai năm dương mà quên mình sinh trước Tết.
                </p>
                <p>
                  Cách kiểm nhanh: tra cả năm liền trước lẫn năm bạn nghĩ là của mình. Cùng một cặp
                  nạp âm thì kết luận không đổi; khác cặp thì đây đúng là trường hợp phải xác định
                  ngày Tết trước. {strong('Đây là chỗ sai phổ biến nhất khi tra cứu thực tế.')}
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
    prompt: 'Vòng 60 cặp can chi sinh ra bao nhiêu tên nạp âm — và vì sao lại là con số đó?',
    answer: (
      <>
        {strong('30 tên')}. Vì bảng nạp âm gán tên theo cặp: hai cặp can chi liền kề dùng chung một
        tên, nên 60 chia 2 còn 30. Ví dụ Giáp Tý và Ất Sửu cùng là Hải Trung Kim; Canh Thìn và Tân
        Tỵ cùng là Bạch Lạp Kim.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ngũ hành bản mệnh của một người được suy ra từ đâu?',
    choices: [
      {
        text: 'Từ Thiên Can của năm sinh',
        note: 'Không — 6 năm can Canh trong một vòng 60 rơi vào 3 hành khác nhau (Thổ, Mộc, Kim).',
      },
      {
        text: 'Từ chữ cuối của tên nạp âm ứng với cặp can chi năm sinh',
        correct: true,
        note: 'Đúng — đường đi là năm âm → cặp can chi → tra bảng ra tên nạp âm → lấy chữ hành ở cuối tên.',
      },
      {
        text: 'Từ con giáp (Địa Chi) của năm sinh',
        note: 'Không — 5 năm chi Tý trong một vòng 60 ra đủ cả 5 hành khác nhau.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Năm âm Canh Ngọ tra ra nạp âm Lộ Bàng Thổ. Vậy người sinh năm đó mệnh gì?',
    choices: [
      {
        text: 'Mệnh Kim, vì can Canh',
        note: 'Không — đây chính là chỗ nhầm phổ biến nhất. Can không quyết định hành bản mệnh.',
      },
      {
        text: 'Mệnh Hỏa, vì chi Ngọ',
        note: 'Không — chi quyết định con giáp, không quyết định hành bản mệnh.',
      },
      {
        text: 'Mệnh Thổ, vì tên nạp âm kết thúc bằng chữ Thổ',
        correct: true,
        note: 'Đúng — luôn lấy chữ cuối của tên nạp âm. Lộ Bàng Thổ nghĩa là “đất ven đường”.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Hai người cùng cầm tinh con chuột (chi Tý) thì có chắc cùng mệnh không?',
    choices: [
      {
        text: 'Có — cùng con giáp thì cùng mệnh',
        note: 'Không — con giáp đi theo chi, còn mệnh đi theo nạp âm; hai lớp khác nhau.',
      },
      {
        text: 'Không — 5 năm chi Tý trong một vòng 60 rơi vào đủ cả 5 hành',
        correct: true,
        note: 'Đúng — Giáp Tý là Kim, Bính Tý là Thủy, Mậu Tý là Hỏa, Canh Tý là Thổ, Nhâm Tý là Mộc.',
      },
      {
        text: 'Chỉ cùng mệnh nếu sinh cách nhau đúng 12 năm',
        note: 'Không — cách nhau 12 năm là cùng con giáp, nhưng nạp âm chỉ lặp lại sau đúng 60 năm.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Cùng là hành Kim mà có tới 6 tên nạp âm khác nhau — sự khác nhau đó có ý nghĩa gì?',
    answer: (
      <>
        Về mặt hệ thống thì {strong('không khác')}: mọi thứ suy tiếp từ mệnh (màu hợp, màu nên hạn
        chế, nhóm nghề) đều tính từ hành, còn tên nạp âm chỉ để hiển thị. Sáu tên là sáu{' '}
        {strong('hình ảnh')} giúp phân biệt và dễ nhớ — vàng trong biển, vàng nơi mũi kiếm, vàng lẫn
        trong cát… Sách xưa có lời bàn riêng cho từng tên nhưng các bản không thống nhất, nên không
        nên suy diễn thêm.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Bạn sinh giữa tháng 1 dương lịch, trước Tết. Nạp âm của bạn lấy theo năm nào?',
    choices: [
      {
        text: 'Năm dương lịch ghi trên giấy khai sinh',
        note: 'Không — nạp âm tính theo năm âm lịch, mà năm âm chỉ đổi vào Tết.',
      },
      {
        text: 'Năm âm liền trước, vì năm âm chưa đổi',
        correct: true,
        note: 'Đúng — sinh trước Tết là vẫn thuộc năm âm cũ, nên mệnh là mệnh của năm cũ.',
      },
      {
        text: 'Tùy chọn, vì hai năm liền kề luôn chung một nạp âm',
        note: 'Không — hai năm liền kề chỉ chung nạp âm khi cùng một cặp; lệch cặp là đổi cả hành.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Một người kết luận “mệnh Thủy khắc mệnh Hỏa nên hai đứa này không hợp nhau”. Sai ở đâu?',
    answer: (
      <>
        Sai ở chỗ nhảy từ quan hệ giữa hai {strong('hành')} sang kết luận về hai {strong('con người')}
        . Nạp âm chỉ phân giải tới mức năm sinh: mọi người sinh cùng một năm âm đều chung một mệnh,
        và cả nhân loại chỉ được chia vào 5 nhóm hành. Một phép chia thô như vậy{' '}
        {strong('không đủ để phán về một mối quan hệ cụ thể')} — đọc nó như lát cắt tham khảo, không
        phải kết luận.
      </>
    ),
  },
];

export function NapAmRecall() {
  return <ActiveRecall topicId="nap-am" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được nạp âm giải quyết chuyện gì: nó là chặng nối giữa năm sinh và ngũ hành bản mệnh — thiếu chặng này thì chữ “mệnh Kim” không kiểm được.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Đi được trọn bốn chặng: năm dương → năm âm (đổi vào Tết) → cặp can chi → tra bảng ra tên nạp âm → lấy chữ cuối làm hành bản mệnh.',
  },
  {
    id: 'structure',
    facet: 'Cấu trúc',
    can: 'Giải thích vì sao 60 cặp can chi chỉ có 30 tên nạp âm (gán theo cặp, hai năm liền kề chung một tên) và vì sao 30 tên chia đều thành 5 hành × 6 tên.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Tách được ba lớp hay bị gộp: hành của Can/Chi (dùng trong Bát Tự), con giáp (đi theo chi), và nạp âm (chỗ duy nhất sinh ra hành bản mệnh).',
  },
  {
    id: 'evidence',
    facet: 'Kiểm chứng',
    can: 'Nêu được ít nhất một bằng chứng tự kiểm: 6 năm can Canh ra 3 hành khác nhau, hoặc 5 năm chi Tý ra đủ 5 hành khác nhau.',
  },
  {
    id: 'naming',
    facet: 'Tên gọi',
    can: 'Đọc được cấu trúc một tên nạp âm (hình ảnh + tên hành) và nói được vì sao phần hình ảnh chỉ là cái móc để nhớ, không phải dữ kiện để luận.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra nạp âm chỉ phân giải tới mức NĂM, nên không dùng để phán hai người hợp hay khắc, và không thay được lá số Bát Tự.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nhớ hai bẫy thường gặp: đọc mệnh thẳng từ can hoặc từ con giáp, và quên rằng người sinh trước Tết vẫn thuộc năm âm liền trước.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút: mệnh ở đâu ra, vì sao hai năm liền có thể cùng mệnh — giữ giọng tham khảo, không phán số mệnh.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào vẫn còn mơ hồ (vd vì sao bảng lại gán đúng những hành ấy) — và chấp nhận rằng bảng truyền tới ta ở dạng đã hoàn thành, không kèm lập luận đủ chặt.',
  },
];

export function NapAmChecklist() {
  return <UnderstandingChecklist topicId="nap-am" facets={FACETS} />;
}

export function NapAmWhys() {
  return (
    <FiveWhys
      topicId="nap-am"
      start={
        <>
          Một người sinh năm 1990 tự tra: “năm tôi là Canh Ngọ, chữ Canh nghe như kim loại, chắc tôi
          mệnh Kim”. Rồi anh mua đồ màu trắng, chọn màu xe theo mệnh Kim — trong khi mọi bảng tra đều
          ghi anh mệnh Thổ.
        </>
      }
      chain={[
        {
          question: 'Vì sao đọc mệnh thẳng từ chữ Canh lại ra kết quả sai?',
          because: (
            <>
              Vì hành bản mệnh {strong('không nằm ở Thiên Can')}. Năm Canh Ngọ tra bảng ra nạp âm Lộ
              Bàng Thổ, và chữ cuối của tên ấy mới là hành bản mệnh — tức Thổ.
            </>
          ),
        },
        {
          question: 'Vì sao lại phải đi vòng qua một cái tên như “Lộ Bàng Thổ”?',
          because: (
            <>
              Vì mệnh được định bằng {strong('bảng nạp âm')}: mỗi cặp can chi trong vòng 60 được gán
              một tên riêng, tên nào cũng kết thúc bằng một trong năm hành. Bảng gán theo cặp nên 60
              cặp chỉ sinh ra 30 tên.
            </>
          ),
        },
        {
          question: 'Có thể bỏ bảng đó đi mà nhẩm tắt từ can hoặc từ con giáp không?',
          because: (
            <>
              Không. Cứ kiểm bằng chính dữ liệu: 6 năm mang can Canh trong một vòng 60 rơi vào{' '}
              {strong('3 hành khác nhau')}, còn 5 năm mang chi Tý rơi vào{' '}
              {strong('đủ cả 5 hành')}. Không có quy tắc tắt nào sống sót qua hai phép thử đó.
            </>
          ),
        },
        {
          question: 'Vậy bảng ấy dựa trên lập luận gì mà gán như thế?',
          because: (
            <>
              Phải trả lời cho thật: bảng đến với chúng ta như một {strong('quy ước được truyền lại')}
              , ở dạng đã hoàn thành. Tên gọi “nạp âm” nghĩa đen là gán vào âm luật và tương truyền
              gắn với nhạc luật cổ, nhưng phần lập luận truyền tới tay người dùng hôm nay{' '}
              {strong('không đủ chặt để tự dựng lại')} bảng từ đầu.
            </>
          ),
        },
        {
          question: 'Biết vậy rồi thì nên dùng nạp âm ở mức nào?',
          because: (
            <>
              Đúng tầm của nó: một quy ước {strong('tra được minh bạch')}, hữu ích để hiểu vì sao ông
              bà nhắc tới “mệnh” của một năm và để tham khảo cho những lựa chọn nhẹ nhàng. Nhưng nó
              chỉ phân giải tới mức năm, nên {strong('không dùng để phán hai người hợp hay khắc')};
              muốn nói về một cá nhân thì phải xuống tới lá số Bát Tự.
            </>
          ),
        },
      ]}
      root={
        <>
          Sai lầm ban đầu không nằm ở chỗ tin hay không tin, mà ở chỗ{' '}
          {strong('bỏ qua một chặng trong phép tính')}. Biết mệnh ra từ nạp âm, bạn tự kiểm được kết
          quả của mình — và cũng biết luôn giới hạn của nó: {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
