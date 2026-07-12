/**
 * Nội dung "học chủ động" cho trang /learn/tu-vi — bài flagship.
 *
 * TẤT CẢ grounded từ chính bài viết Tử Vi (12 cung, tam phương tứ chính, trình
 * tự luận 6 bước, 14 chính tinh + độ sáng 7 bậc + phụ tinh, Tứ Hóa, hai trục
 * phân loại chính tinh, Cục, cung Thân, Tuần Triệt, vô chính diệu). KHÔNG
 * thêm dữ kiện mới. Giữ giọng "lá số là bản đồ, không phải kịch bản".
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

export function TuViFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao có một tấm bản đồ phân vùng đời sống — sức khỏe, tiền bạc, tình cảm, sự nghiệp — để
          biết mình mạnh ở mảng nào, dễ vấp ở mảng nào, mà ra quyết định hợp lý hơn?
        </>
      }
      why={
        <>
          Tử Vi Đẩu Số khởi từ Trung Hoa thời Tống, tương truyền do Trần Đoàn hệ thống hóa: vị trí
          các sao quanh sao Tử Vi tại thời khắc sinh phản ánh cấu trúc số mệnh. Nó tồn tại như một{' '}
          {strong('bản đồ để hiểu mình')}, không phải kịch bản định sẵn.
        </>
      }
      what={
        <>
          Lá số chia đời người thành {strong('12 cung')} (Mệnh, Tài Bạch, Phu Thê, Quan Lộc…), mỗi
          cung một lĩnh vực, có các sao đóng vào. {strong('Không phải')} để biết tương lai cố định —
          lá số là bản đồ, không phải kịch bản.
        </>
      }
      how={
        <>
          Nhập ngày giờ sinh → an 14 chính tinh + phụ tinh vào 12 cung. Luận một cung{' '}
          {strong('không bao giờ đọc lẻ')}: phải gộp tam phương tứ chính. Trình tự: chính tinh + độ
          sáng + Cục → tam phương tứ chính → Tứ Hóa → phụ tinh → lớp thời gian (đại vận, lưu niên).
        </>
      }
      soWhat={
        <>
          Để nhận diện thiên hướng, điểm mạnh, điểm dễ vấp rồi {strong('quyết định phù hợp hơn')} —
          không dự đoán trúng số, không thay thế lời khuyên y tế / pháp lý / tài chính.
        </>
      }
    />
  );
}

export function TuViDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="tu-vi"
        concept="Vì sao không bao giờ đọc một cung lẻ — “tam phương tứ chính”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Đừng chấm điểm một cầu thủ chỉ bằng một pha bóng. Một cung trong lá số cũng vậy:
                thấy một sao “xấu” ở một cung rồi hoảng là sai. Phải nhìn cả {strong('“đội hình”')}{' '}
                — cung đó cùng các cung liên quan — mới ra bức tranh thật.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi cung phải đọc cùng {strong('tam phương tứ chính')}: chính cung + cung đối diện
                  (xung chiếu) + hai cung tam hợp — bốn cung chiếu vào nhau và cùng tạo nên bức
                  tranh.
                </p>
                <p>
                  Ví dụ xét sự nghiệp thì đọc cả bộ{' '}
                  {strong('Mệnh · Quan Lộc · Tài Bạch · Thiên Di')}, chứ không chỉ cung Quan Lộc.
                  Nhờ vậy một cung Mệnh hơi yếu nhưng cung Thiên Di đối diện tốt vẫn luận được “đi
                  xa thì khá hơn ở nhà”.
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
                  Trình tự luận có cơ sở đủ sáu bước: (1) định Mệnh, Thân, Cục — sao thủ Mệnh là
                  gì, {strong('độ sáng')} ra sao (đủ bảy bậc, từ miếu tới hãm); (2) đọc Mệnh trong
                  tam phương tứ chính; (3) phủ {strong('Tứ Hóa')} gốc để thấy thế mạnh và nút thắt;
                  (4) phụ tinh tô màu; (5) luận cung cụ thể theo câu hỏi thật, luôn kéo cung đối và
                  tam hợp; (6) áp lớp thời gian (đại vận, lưu niên).
                </p>
                <p>
                  Khoảng 30% lá số có Mệnh {strong('vô chính diệu')} (không có chính tinh) — không
                  xấu, cách luận là mượn sao cung đối diện rồi xét phụ tinh. Và “hãm” không đồng
                  nghĩa với xấu, “miếu” không đồng nghĩa với tốt: còn tùy cát tinh / sát tinh đi
                  kèm.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tu-vi"
        concept="Tứ Hóa — bốn “biến hóa” làm mỗi lá số, mỗi năm có chủ đề riêng"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tùy năm sinh, bốn ngôi sao trong lá số được gắn thêm bốn “gia vị”: một vị ngọt (Hóa
                Lộc — cơ hội), một vị đậm (Hóa Quyền — cầm trịch), một vị thanh (Hóa Khoa — tiếng
                thơm), và một vị đắng (Hóa Kỵ — bài khó). Lá số nào cũng đủ bốn vị. Có vị đắng
                không có nghĩa là món ăn hỏng; đó chỉ là chỗ cần nhai chậm hơn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Tứ Hóa gồm {strong('Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ')} — bốn biến hóa gắn
                  vào bốn sao tùy Thiên Can của năm sinh. Đây là phần làm hai lá số trông giống
                  nhau trên giấy lại luận khác nhau.
                </p>
                <p>
                  Chưa hết: mỗi đại vận và mỗi năm cũng có Can riêng, kéo theo bộ{' '}
                  {strong('Tứ Hóa lưu')} riêng — vì vậy mỗi chặng mười năm, mỗi năm có một chủ đề.
                  Hóa Kỵ không phải điềm gở: lá số nào cũng có một Hóa Kỵ, nó chỉ đánh dấu đề tài
                  bạn dễ để tâm quá mức.
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
                  Luận Tứ Hóa đúng là luận theo {strong('cung rơi')}: Hóa Kỵ vào Tài Bạch gợi kỷ
                  luật tiền; vào Phu Thê gợi làm rõ kỳ vọng khi giao tiếp; vào Quan Lộc gợi văn bản
                  hóa để tránh hiểu lầm. Hóa Khoa là trợ lực vừa phải — hợp thi cử, uy tín — không
                  đẩy tài lộc trực tiếp.
                </p>
                <p>
                  Hai điểm chuyên sâu: bảng Tứ Hóa của vài Thiên Can (nhất là Canh, Nhâm) có{' '}
                  {strong('dị biệt giữa các phái')} — engine theo một bảng nhất quán, không nhận đó
                  là “cách duy nhất đúng”; và có nhánh “phi tinh tứ hóa” luận sao bay giữa các cung
                  — một trường phái riêng, không bắt buộc.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tu-vi"
        concept="Độ sáng miếu – hãm: cường độ của sao, không phải điểm tốt xấu"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cùng một bóng đèn, cắm ở phòng này sáng rực, sang phòng khác lại lù mù. Ngôi sao
                trong lá số cũng vậy: đứng ô này thì mạnh, ô kia thì yếu. Nhưng đèn lù mù không
                phải đèn hỏng — kê thêm một tấm gương (sao tốt bên cạnh) là vẫn đủ sáng để đọc
                sách. Đừng vội chê một ngôi sao chỉ vì nó đang đứng chỗ tối.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi sao ở 12 vị trí có độ sáng khác nhau, xếp thành{' '}
                  {strong('bảy bậc: miếu, vượng, đắc, lợi, bình, bất, hãm')} — từ sáng nhất tới tối
                  nhất. Độ sáng đo cường độ biểu hiện, không phải điểm tốt xấu.
                </p>
                <p>
                  Ví dụ kinh điển: Thái Dương hãm ở người sinh ban đêm hay mùa đông — vẫn là người
                  giỏi, nhưng dễ kiệt sức và công lao khó được nhìn thấy. Bài học rút ra không phải
                  “số khổ”, mà là học cách nghỉ và chọn môi trường biết ghi nhận.
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
                  Độ sáng là lớp tinh chỉnh nằm giữa các lớp khác: chính tinh định khuôn, độ sáng
                  định cường độ, rồi mới tới Tứ Hóa và phụ tinh — tất cả đặt trong tam phương tứ
                  chính. {strong('Sao hãm gặp cát tinh phụ trợ vẫn dùng được')}; sao miếu gặp sát
                  tinh nặng vẫn trục trặc, nên không bao giờ kết luận từ độ sáng đứng một mình.
                </p>
                <p>
                  Về thuật ngữ: bậc tối nhất chữ Hán là 陷; sách Việt ghi “hãm” hoặc “Hạn” —
                  cùng một bậc.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tu-vi"
        concept="Cục — nhịp khởi đại vận của riêng bạn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi người lên “chuyến tàu mười năm” của đời mình ở một ga khác nhau: có người lên
                từ ga số 2, có người ga số 6. Cục chính là tấm vé ghi số ga đó. Lên sớm hay muộn
                không ai hơn ai — chỉ là nhịp tàu của mỗi người khác nhau, và biết số ga giúp mình
                khỏi sốt ruột so đo với tàu của người khác.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Sau khi định cung Mệnh, lá số được gán một Cục:{' '}
                  {strong('Thủy Nhị (2), Mộc Tam (3), Kim Tứ (4), Thổ Ngũ (5), Hỏa Lục (6)')}.
                </p>
                <p>
                  Cục có hai việc kỹ thuật: cùng ngày sinh âm lịch định vị trí khởi sao Tử Vi khi
                  an lá số, và con số của Cục là {strong('tuổi bắt đầu đại vận đầu tiên')} — người
                  Thủy Nhị khởi vận khoảng 2 tuổi, người Hỏa Lục khoảng 6 tuổi. Từ đó mỗi đại vận
                  dài 10 năm.
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
                  Lớp tinh tế hơn là quan hệ Mệnh và Cục: hành của Cục sinh, khắc hay hoà với hành
                  cung Mệnh và sao thủ Mệnh, gợi ý “khí gốc” thuận hay nghịch. Nhưng đây cũng là
                  phần {strong('các phái tranh luận nhiều')}, từ cách tính Cục đến cách phối Mệnh
                  Cục.
                </p>
                <p>
                  Cách dùng an toàn và có cơ sở: lấy Cục để giải thích nhịp khởi vận sớm hay muộn,
                  không lấy Cục để phán mệnh tốt xấu.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tu-vi"
        concept="Tuần – Triệt: chậm lại, nhưng cũng nhẹ đi"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tưởng tượng một cánh cửa có tấm rèm dày chắn ngang. Đồ tốt trong phòng khó mang ra
                nhanh, mà bụi bẩn ngoài kia cũng khó bay vào. Tuần và Triệt giống tấm rèm đó: cung
                nào bị chắn thì việc trong cung chậm lại, nhưng cái xấu cũng nhẹ đi. Chậm không
                phải là mất — chỉ cần kiên nhẫn hơn người khác một chút.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Tuần Không và Triệt Lộ là hai sao {strong('“không vong”')} án ngữ cung: việc
                  trong cung đến muộn hơn hoặc phải đi đường vòng, đồng thời sao xấu trong cung
                  cũng giảm lực. Vì vậy người có Tuần Triệt đóng ở cung trọng yếu hay được mô tả là
                  kiểu “nở muộn”.
                </p>
                <p>
                  Sai lầm phổ biến là nghe “bị Triệt” rồi hoảng — thực tế không vong cắt cả hai
                  chiều, tốt lẫn xấu.
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
                  Đây là nét rất Việt: hai sao quen thuộc với người xem Tử Vi Việt nhưng thư viện
                  an sao gốc Hoa (iztro) không xuất. Engine hieu.asia tự tính bổ sung —{' '}
                  {strong('Tuần an theo can chi năm sinh, Triệt theo Can năm sinh')}, quy tắc cố
                  định nên cùng một người luôn ra cùng kết quả.
                </p>
                <p>
                  Khi luận, Tuần Triệt xếp ở lớp phụ tinh: xét sau chính tinh, độ sáng và Tứ Hóa,
                  và luôn trong tam phương tứ chính.
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
    prompt: 'Vì sao “thấy một sao xấu ở một cung rồi hoảng” là cách đọc lá số sai?',
    answer: (
      <>
        Vì một cung không bao giờ luận đơn lẻ. Phải đọc cùng {strong('tam phương tứ chính')} (chính
        cung + cung xung chiếu + hai cung tam hợp); bốn cung chiếu vào nhau mới tạo nên bức tranh.
        Một sao đứng riêng chưa nói lên điều gì.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Tam phương tứ chính gồm những cung nào?',
    choices: [
      { text: 'Chỉ riêng cung đang xét', note: 'Đọc một cung lẻ chính là sai lầm phổ biến nhất.' },
      {
        text: 'Chính cung + cung xung chiếu (đối diện) + hai cung tam hợp',
        correct: true,
        note: 'Đúng — bốn cung này chiếu vào nhau.',
      },
      { text: 'Cả 12 cung cùng một lúc', note: 'Không phải tất cả 12 cung, mà là bộ bốn cung liên quan.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Cung Mệnh “vô chính diệu” (không có chính tinh nào đóng) nghĩa là gì?',
    choices: [
      {
        text: 'Khoảng 30% lá số có; luận bằng cách mượn sao cung đối diện + xét phụ tinh; thường là người linh hoạt theo hoàn cảnh',
        correct: true,
        note: 'Đúng — không phải dấu hiệu xấu.',
      },
      { text: 'Một dấu hiệu xấu, báo đời lận đận', note: 'Không — vô chính diệu không phải điềm xấu.' },
      { text: 'Lá số đã bị tính sai, cần lập lại', note: 'Không — đây là trường hợp hợp lệ và khá phổ biến.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Sao “hãm” (độ sáng yếu) có đồng nghĩa với “xấu” không?',
    choices: [
      {
        text: 'Có — sao hãm luôn xấu, sao miếu luôn tốt',
        note: 'Sai — độ sáng là cường độ biểu hiện, không phải tốt/xấu cố định.',
      },
      {
        text: 'Không — sao hãm gặp cát tinh vẫn dùng được, sao miếu gặp sát tinh nặng vẫn trục trặc',
        correct: true,
        note: 'Đúng. Phải xét cát / sát tinh đi kèm.',
      },
      { text: 'Độ sáng của sao không ảnh hưởng gì tới cách luận', note: 'Không — độ sáng cho biết cường độ biểu hiện mạnh hay yếu.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Hai người có lá số trông gần giống nhau trên giấy (các sao chính ở cùng cung), nhưng một buổi luận tử tế vẫn luận khác nhau. Nêu ít nhất một lý do.',
    answer: (
      <>
        Lý do rõ nhất là {strong('Tứ Hóa')} (Hóa Lộc / Quyền / Khoa / Kỵ gắn vào sao tùy Thiên Can
        năm sinh) — chính phần này làm hai lá số giống nhau trên giấy lại luận khác nhau, và làm mỗi
        năm có một chủ đề riêng. Ngoài ra {strong('độ sáng')} của sao (miếu / vượng / hãm), Cục, và
        lớp {strong('thời gian')} (đại vận, lưu niên) cũng khiến cùng cấu trúc nhưng nhịp vận khác.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt:
      'Trục "tinh hệ Tử Vi / tinh hệ Thiên Phủ" và trục "Bắc Đẩu / Nam Đẩu" quan hệ với nhau thế nào?',
    choices: [
      {
        text: 'Là một: tinh hệ Tử Vi chính là các sao Bắc Đẩu, tinh hệ Thiên Phủ chính là các sao Nam Đẩu',
        note: 'Đây là lỗi gộp hai trục rất dễ mắc — ví dụ Thiên Cơ thuộc tinh hệ Tử Vi nhưng lại là sao Nam Đẩu.',
      },
      {
        text: 'Bắc Đẩu / Nam Đẩu chỉ dùng cho phụ tinh, không áp dụng cho 14 chính tinh',
        note: 'Không — cả hai trục đều phân loại 14 chính tinh.',
      },
      {
        text: 'Hai trục phân loại độc lập: một theo cách an sao, một theo phân hệ tinh đẩu',
        correct: true,
        note: 'Đúng. Ví dụ Tham Lang, Cự Môn, Phá Quân thuộc tinh hệ Thiên Phủ (an sao) nhưng là sao Bắc Đẩu (tinh đẩu).',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Con số trong tên Cục (Thủy Nhị, Hỏa Lục…) cho biết điều gì?',
    choices: [
      {
        text: 'Tuổi bắt đầu đại vận đầu tiên: Thủy Nhị Cục khởi vận khoảng 2 tuổi, Hỏa Lục Cục khoảng 6 tuổi',
        correct: true,
        note: 'Đúng. Cục còn dùng để định vị trí khởi sao Tử Vi khi an lá số.',
      },
      {
        text: 'Điểm chấm mệnh tốt xấu: số Cục càng cao, mệnh càng tốt',
        note: 'Không — bài đã lưu ý: đừng phán mệnh tốt xấu từ Cục; nó chủ yếu nói nhịp khởi vận sớm hay muộn.',
      },
      {
        text: 'Số chính tinh tối đa có thể đóng trong một cung',
        note: 'Không — con số của Cục không liên quan tới số sao trong cung.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'mcq',
    prompt: 'Cung bạn quan tâm bị Tuần hoặc Triệt án ngữ. Cách hiểu đúng là gì?',
    choices: [
      {
        text: 'Coi như mất cung đó: mọi việc thuộc lĩnh vực ấy sẽ thất bại',
        note: 'Không — đây đúng kiểu lấy một sao ra hù dọa mà bài đã cảnh báo.',
      },
      {
        text: 'Không cần bận tâm, vì Tuần Triệt chỉ là sao trang trí, không có vai trò khi luận',
        note: 'Không — Tuần Triệt có vai trò thật: làm chậm, làm nhẹ cả tốt lẫn xấu trong cung.',
      },
      {
        text: 'Việc thường đến muộn hoặc đi đường vòng, bù lại cái xấu trong cung cũng được "trống" bớt — hợp kiểu người nở muộn',
        correct: true,
        note: 'Đúng. Không vong cắt cả hai chiều, nên chậm mà không mất.',
      },
    ],
  },
];

export function TuViRecall() {
  return <ActiveRecall topicId="tu-vi" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được lá số Tử Vi dùng để làm gì (bản đồ phân vùng đời sống) — và nó KHÔNG hứa gì (không dự đoán trúng số, không thay y tế/pháp lý).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch luận: chính tinh + độ sáng + Cục → tam phương tứ chính → Tứ Hóa → phụ tinh → lớp thời gian.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao KHÔNG đọc một cung lẻ — vai trò của tam phương tứ chính.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của Tử Vi và vì sao Tứ Hóa có dị biệt giữa các phái (tham khảo, không tuyệt đối).',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao hai lá số giống nhau trên giấy vẫn luận khác nhau (Tứ Hóa, độ sáng, lớp thời gian).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “sao hãm” không = xấu, Mệnh vô chính diệu không = xấu, Hóa Kỵ không = mạt vận, Tuần Triệt không = mất cung.',
  },
  {
    id: 'two-axes',
    facet: 'Hai trục phân loại',
    can: 'Kể được hai trục phân loại chính tinh (tinh hệ an sao vs Bắc / Nam / Trung Thiên đẩu) và vì sao không được gộp làm một.',
  },
  {
    id: 'time-layers',
    facet: 'Lớp thời gian',
    can: 'Phân biệt đại vận, tiểu hạn, lưu niên; nói được vì sao mỗi vận, mỗi năm có bộ Tứ Hóa lưu riêng.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “tam phương tứ chính” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd Cục, Tứ Hóa) bạn vẫn còn thấy mơ hồ.',
  },
];

export function TuViChecklist() {
  return <UnderstandingChecklist topicId="tu-vi" facets={FACETS} />;
}

export function TuViWhys() {
  return (
    <FiveWhys
      topicId="tu-vi"
      start={
        <>
          Người mới xem lá số thấy một sao “xấu” đóng ở cung Phu Thê, liền hoảng “hôn nhân sẽ đổ vỡ”.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy một sao “xấu” ở một cung rồi hoảng lại là sai?',
          because: <>Vì một cung {strong('không bao giờ')} luận đơn lẻ.</>,
        },
        {
          question: 'Vì sao không được đọc một cung lẻ?',
          because: (
            <>
              Vì phải đọc cùng {strong('tam phương tứ chính')}: chính cung + cung xung chiếu + hai
              cung tam hợp — bốn cung chiếu vào nhau.
            </>
          ),
        },
        {
          question: 'Vì sao bốn cung lại phải chiếu vào nhau?',
          because: (
            <>
              Vì các cung tương tác và bù / khắc nhau — ví dụ một cung yếu nhưng cung đối diện tốt
              thường được luận khá hơn.
            </>
          ),
        },
        {
          question: 'Vì sao chúng lại tương tác như vậy?',
          because: <>Vì lá số là {strong('một hệ thống')} liên kết, không phải 12 ô rời rạc.</>,
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc lá số?',
          because: (
            <>
              Vì mục đích là thấy {strong('bức tranh tổng thể')} để hiểu mình, không bắt một ngôi sao
              chịu trách nhiệm cho cả một mảng đời.
            </>
          ),
        },
      ]}
      root={
        <>
          Lá số Tử Vi là một hệ thống tương tác. Một sao đứng riêng chưa nói lên điều gì — đọc lẻ một
          cung là cách chắc chắn nhất để kết luận sai. Luôn đặt nó trong tam phương tứ chính và cả
          bức tranh.
        </>
      }
    />
  );
}
