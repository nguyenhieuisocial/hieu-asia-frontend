/**
 * Nội dung "học chủ động" cho trang /learn/kinh-dich.
 *
 * TẤT CẢ grounded từ chính bài viết Kinh Dịch (âm–dương, bát quái, 64 quẻ kép,
 * Thượng/Hạ quái với cặp Thái ↔ Bĩ, Thoán từ / Hào từ, nhãn hào + đắc trung /
 * đắc chính, hào động, quẻ chính → quẻ biến, luật đọc số hào động của Chu Hy,
 * Dụng Cửu / Dụng Lục, trình tự Văn Vương với cặp Ký Tế → Vị Tế, ngũ hành của
 * quái + hai phái nghĩa lý / tượng số, "gương soi thế cục chứ không phải
 * sấm định mệnh"). KHÔNG thêm dữ kiện mới. Giữ giọng "tham khảo / góc nhìn,
 * không phán định".
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

export function KinhDichFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Khi đứng trước một tình huống rối — nên tiến hay nên dừng, việc này đang ở giai đoạn nào —
          làm sao có một tấm gương gọn để soi thế cục mà chiêm nghiệm, thay vì loay hoay trong đầu?
        </>
      }
      why={
        <>
          Kinh Dịch — “kinh về sự biến dịch” — là một trong những bộ kinh cổ nhất của văn minh Á
          Đông, hình thành khoảng 3.000 năm trước. Nó tồn tại như một{' '}
          {strong('sách triết lý về quy luật biến dịch')} (âm dương tiêu trưởng, vật cực tất phản) và
          đồng thời là {strong('công cụ chiêm nghiệm')} để soi tình huống đang hỏi.
        </>
      }
      what={
        <>
          Một hệ thống {strong('64 quẻ kép')}, mỗi quẻ là {strong('6 hào')} — nét dương (liền) hoặc
          âm (đứt) chồng lên nhau, mô tả một thế cục điển hình của đời sống. {strong('Không phải')}{' '}
          sấm định mệnh — mỗi quẻ là tấm gương soi một thế cục để bạn chiêm nghiệm.
        </>
      }
      how={
        <>
          Tâm niệm một câu hỏi rõ ràng → gieo 3 đồng xu sáu lần, xếp hào từ dưới lên → ra{' '}
          {strong('quẻ chính')} (thế cục hiện tại). Lật các {strong('hào động')} sang trạng thái
          ngược sẽ ra {strong('quẻ biến')} (hướng chuyển tới). Đọc lời nào thì theo luật số hào động
          của Chu Hy.
        </>
      }
      soWhat={
        <>
          Để đọc thế cục mà {strong('suy ngẫm việc của mình rồi tự quyết')} — giữ sắc thái điều kiện
          của lời cổ (“biết dừng thì tốt, theo đến cùng thì xấu”). Không dự đoán cứng, không thay lời
          khuyên y tế / pháp lý / tài chính.
        </>
      }
    />
  );
}

export function KinhDichDepth() {
  return (
    <div className="space-y-4">
      <DepthTabs
        topicId="kinh-dich"
        concept="Vì sao một quẻ không phải sấm cố định — “hào động” và quẻ biến"
        levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Một quẻ giống như một tấm ảnh chụp {strong('lúc này')}. Nhưng mọi thứ đều đang chuyển
              động — có những chỗ trong ảnh sắp đổi. Kinh Dịch chỉ ra đúng những chỗ đang đổi đó, và
              cho bạn xem cả tấm ảnh {strong('sắp tới')} sẽ ra sao. Nên nó không phải lời phán “đời
              bạn sẽ thế này mãi”.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Khi gieo, mỗi hào ra một trong 4 trạng thái. {strong('Lão dương (9)')} và{' '}
                {strong('lão âm (6)')} là hào “động” — cái gì đến cực thì chuyển hóa, nên sắp lật sang
                trạng thái ngược. Thiếu dương (7) và thiếu âm (8) là hào tĩnh, không đổi.
              </p>
              <p>
                Quẻ rút được ngay là {strong('quẻ chính')} (thế cục hiện tại). Lật mỗi hào động sang
                trạng thái ngược, giữ nguyên hào tĩnh, sẽ ra {strong('quẻ biến')} — gợi ý hướng tình
                huống có thể chuyển tới. Vì thế một lần gieo cho bạn cả “bây giờ” lẫn “đang đi về đâu”,
                chứ không phải một kết cục đóng chặt.
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
                Chính vì quẻ động, phải có luật đọc trọng tâm. hieu.asia theo{' '}
                {strong('phép xét số hào động của Chu Hy')} vì nó tất định (cùng kết quả gieo luôn cho
                cùng cách đọc): 0 hào động đọc Thoán từ quẻ chính; 1 hào đọc đúng Hào từ đó; 2 hào đọc
                cả hai (trọng hào trên); 3 hào đọc lời cả quẻ chính lẫn quẻ biến (trọng quẻ chính); 4–5
                hào đọc các hào tĩnh trên quẻ biến; 6 hào động đọc lời quẻ biến.
              </p>
              <p>
                Trực giác của luật: ít hào động thì tình huống còn ở quẻ chính, đọc chính nó; càng
                nhiều hào động, trọng tâm càng dời sang quẻ biến. Và lời cổ dùng thang cát / hung / hối
                / lận / lệ / {strong('vô cữu')} — các chữ này là đánh giá{' '}
                {strong('có điều kiện theo cách ứng xử')}, không phải sấm về kết quả cố định.
              </p>
            </>
          ),
        },
        ]}
      />
      <DepthTabs
        topicId="kinh-dich"
        concept="Đắc trung – đắc chính: vì sao hào 2 và hào 5 hay được khen"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Xếp sáu bạn thành hai hàng, mỗi hàng ba bạn. Bạn đứng {strong('giữa hàng')}{' '}
                nhìn được cả hai phía, không bị chen ở mép. Trong một quẻ sáu bậc, bậc 2 và
                bậc 5 chính là hai chỗ “đứng giữa” như vậy — nên thường là chỗ vững nhất.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi quẻ gồm hai quái ba hào. Hào 2 nằm giữa Hạ quái, hào 5 nằm giữa Thượng
                  quái — gọi là {strong('đắc trung')}: giữ được mức trung, không lệch cực,
                  nên lời hào ở hai vị này thường nghiêng lành.
                </p>
                <p>
                  Còn {strong('đắc chính')} (đương vị): hào dương nằm ở vị lẻ (1, 3, 5), hào
                  âm nằm ở vị chẵn (2, 4, 6) — nét nằm đúng vị của nó. Nhãn{' '}
                  {strong('Cửu Ngũ')} (hào 5 dương) vừa trung vừa chính — vị đẹp kinh điển,
                  như hào “rồng bay trên trời” của quẻ Càn.
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
                  Khi hai tiêu chí vênh nhau, truyền thống chú giải thường coi{' '}
                  {strong('trung quý hơn chính')}. Ví dụ hào 2 quẻ Thái là nét dương ở vị
                  chẵn — không “đúng vị” theo luật chung — nhưng nhờ đắc trung mà lời hào
                  vẫn nghiêng khen, khép lại bằng “đắc thượng vu trung hành” (được hợp với
                  đạo trung).
                </p>
                <p>
                  Lưu ý ranh giới: đây là lớp cấu trúc giải thích khuynh hướng khen chê của
                  lời hào, {strong('không phải luật thắng thua tuyệt đối')}. Công cụ gieo
                  quẻ của hieu.asia dẫn lời hào và ý nghĩa vị trí; đắc trung – đắc chính là
                  nguyên tắc chung để tự đối chiếu khi đọc.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="kinh-dich"
        concept="Thoán từ vs Hào từ — lời của cả quẻ và lời của từng bước"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Một quyển truyện có {strong('câu tóm tắt ngoài bìa')} và{' '}
                {strong('lời ghi chú ở từng trang')}. Muốn biết cả câu chuyện, đọc bìa —
                muốn biết mình đang ở khúc nào, đọc lời của trang đó. Thoán từ là “bìa”,
                Hào từ là “lời từng trang”.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Thoán từ')} là lời quẻ: mỗi quẻ một câu tổng quát cho cả thế cục
                  — 64 lời. {strong('Hào từ')} là lời riêng của từng hào — 64 × 6 = 384 lời,
                  cộng hai lời đặc biệt {strong('Dụng Cửu')} (Càn) và {strong('Dụng Lục')}{' '}
                  (Khôn) chỉ dùng khi cả sáu hào đều động.
                </p>
                <p>
                  Khi gieo, {strong('số hào động')} quyết định đọc lời nào làm trọng tâm —
                  đó chính là luật Chu Hy ở khái niệm bên trên.
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
                  Cả hai lớp lời đều thuộc phần {strong('Kinh')} (~Tây Chu) — tầng văn bản
                  cổ nhất; phần {strong('Truyện (Thập Dực)')} giải nghĩa ra đời muộn hơn.
                  Thoán từ dùng lặp lại các mô-típ: nguyên hanh (hanh thông từ gốc), lợi
                  trinh (lợi về sự bền chính — không phải “trinh tiết”), lợi thiệp đại xuyên
                  (thuận cho việc khó đáng làm), lợi kiến đại nhân (nên tìm người có tầm
                  giúp).
                </p>
                <p>
                  Thang đánh giá cát / hung / hối / lận / lệ / {strong('vô cữu')} chạy xuyên
                  cả Thoán từ lẫn Hào từ — và luôn là đánh giá{' '}
                  {strong('có điều kiện theo cách ứng xử')}, không phải sấm về kết quả cố
                  định.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="kinh-dich"
        concept="Thượng quái – Hạ quái: cùng hai quái, đảo trên dưới là đổi cả thế cục"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Lấy hai khối xếp hình, một khối tên {strong('Trời')}, một khối tên{' '}
                {strong('Đất')}. Chồng Đất lên trên Trời được một hình; đổi chỗ hai khối
                cho nhau lại ra hình khác hẳn. Quẻ Kinh Dịch cũng vậy: cùng hai khối,
                nhưng khối nào nằm trên, khối nào nằm dưới sẽ cho hai quẻ khác nhau, nghĩa
                cũng khác nhau.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi quẻ kép là một {strong('quái trên (Thượng, hào 4–6)')} chồng lên một{' '}
                  {strong('quái dưới (Hạ, hào 1–3)')}; 8 × 8 = 64 tổ hợp. Khi luận, Hạ quái
                  thường ứng với bên trong, khởi đầu, việc gần; Thượng quái ứng với bên
                  ngoài, về sau, hướng vận động.
                </p>
                <p>
                  Cặp ví dụ kinh điển: {strong('Thái')} (Đất trên Trời) là khí giao hòa,
                  thông; {strong('Bĩ')} (Trời trên Đất) là khí không giao, tắc. Cùng đúng
                  hai quái Càn và Khôn, chỉ đảo trên dưới mà một bên thông, một bên tắc —
                  nên đọc quẻ phải nhìn tương quan trên–dưới, không chỉ dịch tên quẻ.
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
                  64 quẻ xếp theo {strong('trình tự Văn Vương')}, đi thành 32 cặp đi đôi:
                  hầu hết là cặp lật ngược — quẻ sau chính là quẻ trước úp ngược lại. Riêng
                  bốn cặp mà lật ngược vẫn trùng chính nó (Càn–Khôn, Khảm–Ly, Di–Đại Quá,
                  Trung Phu–Tiểu Quá) thì đi theo lối đối âm dương từng hào. Thái ↔ Bĩ
                  thuộc nhóm hiếm vừa lật ngược vừa đối nhau từng nét: đổi âm dương cả sáu
                  hào quẻ Thái thì ra đúng quẻ Bĩ.
                </p>
                <p>
                  Trình tự này cũng là thứ tự mà {strong('Tự quái truyện')} (một thiên của
                  Thập Dực) giải nghĩa vì sao quẻ này nối tiếp quẻ kia, và nó khép lại bằng
                  cặp Ký Tế → Vị Tế: mọi hoàn thành đều chứa mầm dở dang mới.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="kinh-dich"
        concept="Ngũ hành của quái — lớp tham khảo, không phải xương sống"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi khối xếp hình còn được dán thêm một {strong('nhãn màu')}. Nhãn giúp bạn
                liên tưởng thêm một chút, nhưng câu chuyện nằm ở chính hình xếp được, không
                nằm ở cái nhãn. Trong Kinh Dịch, mỗi quái cũng có một “nhãn” ngũ hành như
                vậy — xem cho biết, còn lời quẻ mới là phần chính.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi quái mang một hành: {strong('Càn, Đoài = Kim')};{' '}
                  {strong('Chấn, Tốn = Mộc')}; {strong('Khảm = Thủy')};{' '}
                  {strong('Ly = Hỏa')}; {strong('Cấn, Khôn = Thổ')}. Giữa các hành có tương
                  sinh (Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh
                  Mộc) và tương khắc (Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc
                  Kim, Kim khắc Mộc).
                </p>
                <p>
                  Áp vào một quẻ kép, quan hệ giữa Thượng quái và Hạ quái có thể tô thêm màu
                  cho luận giải: trên sinh dưới đọc như ngoại lực nâng đỡ, trên khắc dưới
                  như áp lực từ bên trên dội xuống. Nhưng đây là {strong('lớp tham khảo')} —
                  nghĩa của quẻ vẫn đứng trên Thoán từ, Hào từ và thế cục.
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
                  Đây đúng là chỗ hai trường phái chia đường. {strong('Phái tượng số')} khai
                  thác mạnh ngũ hành với các phép như lục hào hay Mai Hoa Dịch Số:{' '}
                  {strong('nạp giáp')} gán thiên can, địa chi vào từng hào để mỗi hào mang
                  một hành riêng mà xét sinh khắc; {strong('lục thân')} gán các hào vào vai
                  quan hệ so với người hỏi (cha mẹ, anh em, con cháu, tài lộc, chức sự).{' '}
                  {strong('Phái nghĩa lý')} lại ít dùng ngũ hành, đọc Dịch làm sách triết lý
                  về thế cục.
                </p>
                <p>
                  hieu.asia nghiêng về nghĩa lý: công cụ gieo quẻ hiện chỉ giữ hành của quái
                  để liên tưởng, chưa tính nạp giáp hay lục thân, nên bài đọc không dựng dự
                  đoán trên ngũ hành quẻ. Có trường phái làm khác — đó là khác biệt về đường
                  lối, không phải chuyện đúng sai.
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
    prompt: 'Vì sao nói một quẻ Kinh Dịch là “gương soi thế cục”, không phải “sấm định mệnh”?',
    answer: (
      <>
        Vì quẻ {strong('mô tả một tình huống điển hình')} để người hỏi chiêm nghiệm việc của mình,
        không phán một kết cục cố định. Lời cổ thường mang sắc thái điều kiện (“biết dừng thì tốt,
        theo đến cùng thì xấu”), và người hỏi luôn giữ quyền quyết định.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Hào “động” trong một quẻ là hào nào?',
    choices: [
      {
        text: 'Lão dương (số 9) và lão âm (số 6) — sắp lật sang trạng thái ngược',
        correct: true,
        note: 'Đúng — cái gì đến cực thì chuyển hóa; hào động sinh ra quẻ biến.',
      },
      {
        text: 'Thiếu dương (7) và thiếu âm (8)',
        note: 'Ngược lại — đây là hào tĩnh, không đổi.',
      },
      {
        text: 'Hào nằm ở vị trí số 5 của quẻ',
        note: 'Không — “động” là do trạng thái gieo (9 hoặc 6), không do vị trí hào.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Quẻ biến được lập ra bằng cách nào?',
    choices: [
      {
        text: 'Đảo trên–dưới hai quái của quẻ chính',
        note: 'Không — đó là chuyện Thượng/Hạ quái (Thái ↔ Bĩ), không phải cách lập quẻ biến.',
      },
      {
        text: 'Lật mỗi hào động sang trạng thái ngược, giữ nguyên hào tĩnh',
        correct: true,
        note: 'Đúng — nếu không có hào động nào thì không có quẻ biến.',
      },
      {
        text: 'Gieo thêm một lần thứ hai độc lập',
        note: 'Không — quẻ biến suy ra từ chính quẻ chính, không gieo lại.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Chữ “vô cữu” trong lời cổ nghĩa là gì — có phải là “tốt” không?',
    answer: (
      <>
        {strong('Vô cữu')} không phải “tốt”, mà là {strong('“tránh được lỗi nếu xử đúng”')}. Đây là
        một đánh giá có điều kiện theo cách ứng xử, cùng họ với cát / hung / hối / lận / lệ — không
        phải lời sấm về một kết quả cố định.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: gieo xong thấy có 3 hào động. Theo luật Chu Hy, bạn đọc lời nào làm trọng tâm, và vì sao luật lại dời dần sang quẻ biến khi hào động tăng?',
    answer: (
      <>
        3 hào động: đọc {strong('lời quẻ (Thoán từ) của cả quẻ chính lẫn quẻ biến, trọng quẻ chính')}.
        Trực giác của luật: {strong('ít hào động')} thì tình huống còn ở quẻ chính nên đọc chính nó;{' '}
        {strong('càng nhiều hào động')}, thế cục càng đang chuyển hóa nên trọng tâm càng dời sang quẻ
        biến (tới 6 hào động thì đọc hẳn lời quẻ biến).
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Hào 2 và hào 5 được gọi là “đắc trung” vì sao?',
    choices: [
      {
        text: 'Vì nằm giữa quái của mình: hào 2 giữa Hạ quái, hào 5 giữa Thượng quái',
        correct: true,
        note: 'Đúng — giữ được mức trung, không lệch cực, nên lời hào ở hai vị này thường nghiêng lành.',
      },
      {
        text: 'Vì hai hào này luôn là hào dương',
        note: 'Không — trung là chuyện vị trí; âm hay dương là chuyện của nét nằm ở đó (đắc chính mới xét âm dương với vị chẵn lẻ).',
      },
      {
        text: 'Vì hai hào này dễ thành hào động nhất',
        note: 'Không — động hay tĩnh do kết quả gieo (9/6 hay 7/8), không do vị trí hào.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Khi nào mới đọc lời Dụng Cửu / Dụng Lục?',
    choices: [
      {
        text: 'Khi gieo được Thuần Càn hoặc Thuần Khôn mà cả sáu hào đều động',
        correct: true,
        note: 'Đúng — hai lời chốt đặc biệt này thay cho lời quẻ biến trong đúng tình huống đó.',
      },
      {
        text: 'Bất kỳ quẻ nào có sáu hào động',
        note: 'Không — quẻ khác sáu hào động thì đọc lời quẻ của quẻ biến; Dụng Cửu / Dụng Lục chỉ dành cho Càn và Khôn.',
      },
      {
        text: 'Mỗi lần gieo ra quẻ Càn hoặc Khôn, dù mấy hào động',
        note: 'Không — Càn / Khôn ít hào động vẫn đọc theo luật chung (0 hào đọc Thoán từ, 1 hào đọc đúng hào đó…).',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Trình tự Văn Vương kết thúc bằng cặp quẻ nào, và cách kết đó nói gì về tinh thần của Kinh Dịch?',
    answer: (
      <>
        Kết bằng {strong('Ký Tế (“đã xong”) rồi Vị Tế (“chưa xong”)')}. Hàm ý: mọi sự hoàn
        thành đều chứa mầm dở dang mới — vòng biến dịch không khép lại, nên không có thế cục
        nào là kết cục đóng chặt.
      </>
    ),
  },
];

export function KinhDichRecall() {
  return <ActiveRecall topicId="kinh-dich" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Kinh Dịch dùng để làm gì (gương soi một thế cục để chiêm nghiệm) — và nó KHÔNG hứa gì (không sấm định mệnh, không thay y tế/pháp lý/tài chính).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch dùng: câu hỏi rõ → gieo 3 xu sáu lần → quẻ chính → lật hào động ra quẻ biến → đọc theo luật số hào động.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt hào động (lão dương 9 / lão âm 6) với hào tĩnh (thiếu dương 7 / thiếu âm 8), và quẻ chính với quẻ biến.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn: “linh nghiệm” huyền bí không được hứa, và vì sao có phái tượng số vs phái nghĩa lý (tham khảo, không tuyệt đối).',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Áp luật Chu Hy cho một số hào động cụ thể (ví dụ 3 hào động đọc lời cả hai quẻ, trọng quẻ chính).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “vô cữu” ≠ tốt, âm/dương ≠ tốt/xấu, và một quẻ ≠ kết cục đóng chặt.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “hào động → quẻ biến” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'reading-layers',
    facet: 'Tầng văn bản',
    can: 'Phân biệt được Thoán từ (lời cả quẻ) với Hào từ (lời từng hào), đọc được nhãn hào kiểu Sơ Cửu / Lục Nhị / Cửu Ngũ, và biết Dụng Cửu / Dụng Lục chỉ dành cho Càn / Khôn khi sáu hào đều động.',
  },
  {
    id: 'position-sense',
    facet: 'Vị trí hào',
    can: 'Chỉ được hào đắc trung (hào 2 và hào 5) trong một quẻ bất kỳ, nói được đắc chính là gì, và vì sao truyền thống thường quý trung hơn chính.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd bát quái, trình tự Văn Vương, hay luật số hào động) bạn vẫn còn thấy mơ hồ.',
  },
];

export function KinhDichChecklist() {
  return <UnderstandingChecklist topicId="kinh-dich" facets={FACETS} />;
}

export function KinhDichWhys() {
  return (
    <FiveWhys
      topicId="kinh-dich"
      start={
        <>
          Người mới gieo được một quẻ có lời “hung”, liền hoảng “việc này chắc chắn hỏng rồi”.
        </>
      }
      chain={[
        {
          question: 'Vì sao coi một quẻ “hung” là kết cục chắc chắn lại là hiểu sai?',
          because: (
            <>
              Vì một quẻ là {strong('gương soi một thế cục')}, không phải sấm định mệnh — nó mô tả
              tình huống để chiêm nghiệm, không phán kết quả cố định.
            </>
          ),
        },
        {
          question: 'Vì sao quẻ chỉ soi thế cục mà không chốt kết cục?',
          because: (
            <>
              Vì lời cổ mang sắc thái {strong('điều kiện theo cách ứng xử')} — như “trung cát, chung
              hung” (biết dừng thì tốt, theo đến cùng thì xấu), và cả chữ “vô cữu” = tránh lỗi nếu xử
              đúng.
            </>
          ),
        },
        {
          question: 'Vì sao thế cục lại “có điều kiện”, có thể đổi được?',
          because: (
            <>
              Vì quẻ vốn {strong('đang chuyển động')}: các {strong('hào động')} (lão dương 9 / lão âm
              6) sắp lật sang trạng thái ngược, tạo ra quẻ biến — hướng tình huống chuyển tới.
            </>
          ),
        },
        {
          question: 'Vì sao Kinh Dịch lại đặt sự chuyển hóa ở trung tâm như vậy?',
          because: (
            <>
              Vì đây là {strong('“kinh về sự biến dịch”')}: nền của nó là quy luật âm dương tiêu
              trưởng, vật cực tất phản — mọi thịnh suy đều luân chuyển, không có gì đứng yên.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc một quẻ?',
          because: (
            <>
              Vì mục đích là {strong('đọc thế cục để suy ngẫm rồi tự quyết')}, chứ không bắt một quẻ
              chịu trách nhiệm cho một kết cục — người hỏi luôn giữ quyền quyết định.
            </>
          ),
        },
      ]}
      root={
        <>
          Kinh Dịch là kinh về sự biến dịch: một quẻ soi thế cục {strong('hiện tại')} và, qua hào
          động → quẻ biến, gợi hướng {strong('chuyển tới')} — với lời cổ có điều kiện. Đọc nó là để
          chiêm nghiệm và tự quyết, không phải nhận một lời sấm đóng chặt.
        </>
      }
    />
  );
}
