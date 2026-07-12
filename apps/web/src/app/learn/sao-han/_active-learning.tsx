/**
 * Nội dung "học chủ động" cho trang /learn/sao-han.
 *
 * TẤT CẢ grounded từ chính công cụ /sao-han và lib/sao-han.ts (9 sao Cửu Diệu,
 * cách tính theo tuổi mụ + giới tính, phân loại tốt/trung/xấu, nguồn gốc
 * Navagraha, La Hầu / Kế Đô là giao điểm chứ không phải sao thật). KHÔNG thêm dữ
 * kiện mới. Giữ giọng "tham khảo, không phán định — không mê tín, không bán lễ".
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

export function SaoHanFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Đầu năm nhiều người muốn biết {strong('“năm nay nên lưu ý điều gì”')} — một lời nhắc theo
          phong tục để sống chủ động hơn, thay vì lo lắng mơ hồ hay nghe theo lời phán số mệnh.
        </>
      }
      why={
        <>
          Sao hạn (Cửu Diệu niên hạn) là cách người xưa gửi lời nhắc ấy {strong('lên bầu trời')}: mỗi
          năm có một trong 9 sao “chiếu” vào mỗi người. Nó tồn tại như một{' '}
          {strong('di sản văn hoá tín ngưỡng')}, không phải án phạt định sẵn.
        </>
      }
      what={
        <>
          9 sao {strong('Cửu Diệu')}: 3 sao tốt (Thái Dương, Thái Âm, Mộc Đức), 3 trung tính (Thổ Tú,
          Thủy Diệu, Vân Hớn), 3 sao xấu (La Hầu, Kế Đô, Thái Bạch). {strong('Không phải')} lời phán
          may – rủi chắc chắn — chỉ là một góc nhìn để tham khảo.
        </>
      }
      how={
        <>
          Lấy {strong('tuổi mụ')} (≈ năm xem − năm sinh + 1), rồi lấy phần dư khi chia cho 9; đối chiếu
          vào {strong('bảng riêng cho nam và nữ')} — cùng một tuổi, sao chiếu của nam và nữ khác nhau.
          Công cụ tự tính khi bạn nhập năm sinh + giới tính.
        </>
      }
      soWhat={
        <>
          Để biết năm nay {strong('nên cẩn trọng điều gì')} (lời nói, tiền bạc – giấy tờ, sức khoẻ) và
          chủ động hơn — gặp sao xấu không phải điều đáng sợ, gặp sao tốt cũng không nên buông lơi.
        </>
      }
    />
  );
}

export function SaoHanDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="sao-han"
        concept="Vì sao “sao xấu” không có nghĩa là chắc chắn gặp xui"
        levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Sao hạn giống như dự báo thời tiết: năm “trời có thể mưa” thì mình mang theo ô cho chắc,
              chứ không phải chắc chắn ướt. {strong('Sao xấu')} chỉ là lời nhắc “năm nay cẩn thận hơn”,
              không phải điều đáng sợ.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                9 sao chia làm ba nhóm: {strong('cát tinh')} (Thái Dương, Thái Âm, Mộc Đức) hàm ý năm
                hanh thông; {strong('trung tính')} (Thổ Tú, Thủy Diệu, Vân Hớn) nhẹ nhàng, có vài điều
                cần chú ý; {strong('hung tinh')} (La Hầu, Kế Đô, Thái Bạch) hàm ý năm nên thận trọng.
              </p>
              <p>
                Nhưng “hung tinh” chỉ gợi ý {strong('nên cẩn trọng')} — giữ lời nói, thận trọng tiền
                bạc – giấy tờ, chú ý sức khoẻ. Sống cẩn thận và chủ động vẫn quan trọng hơn mọi điềm
                báo.
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
                Sao được suy từ {strong('tuổi mụ')} (năm xem − năm sinh + 1) lấy phần dư khi chia 9, rồi
                đối chiếu bảng {strong('riêng theo giới tính')}. Ví dụ với nam: dư 1 → La Hầu, dư 5 →
                Thái Dương, chia hết cho 9 → Mộc Đức; nữ có bảng khác (dư 1 → Kế Đô…). Cùng một tuổi,
                sao của nam và nữ do đó không giống nhau.
              </p>
              <p>
                Điểm cần hiểu để giữ tỉnh táo: {strong('La Hầu và Kế Đô không phải sao thật')} — là hai
                giao điểm nơi quỹ đạo Mặt Trăng cắt hoàng đạo (vùng trời xảy ra nhật thực, nguyệt
                thực). 7 “sao” còn lại mới là thiên thể thật (Mặt Trời, Mặt Trăng và 5 hành tinh). Biết
                nguồn gốc rồi thì không cần sợ, càng không cần tốn tiền “giải” một giao điểm hình học.
              </p>
            </>
          ),
        },
      ]}
      />
      <DepthTabs
        topicId="sao-han"
        concept="La Hầu – Kế Đô là gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mặt Trăng đi trên bầu trời theo một con đường riêng, con đường ấy {strong('cắt')} đường
                đi của Mặt Trời ở hai điểm. Thỉnh thoảng, đúng gần hai điểm đó, Mặt Trời hoặc Mặt Trăng
                trông như {strong('bị nuốt mất')} (nhật thực, nguyệt thực). Người xưa chưa biết vì sao,
                nên tưởng tượng có hai “ông sao” dữ ở đó và đặt tên là La Hầu, Kế Đô. Thật ra đó chỉ là
                hai {strong('điểm cắt')} trên bầu trời, không phải sao.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Quỹ đạo Mặt Trăng cắt đường hoàng đạo (đường đi biểu kiến của Mặt Trời) tại hai giao
                  điểm: giao điểm Bắc là {strong('La Hầu (Rahu)')}, giao điểm Nam là{' '}
                  {strong('Kế Đô (Ketu)')} — một cặp đối xứng nhau.
                </p>
                <p>
                  Đó chính là {strong('vùng trời xảy ra nhật thực, nguyệt thực')}. Người xưa thấy nhật
                  nguyệt “bị nuốt” ở đúng vùng ấy nên dựng thành thần thoại, và hai “sao” này mang nghĩa{' '}
                  {strong('che khuất, xáo trộn')} từ đó — thành hai hung tinh trong Cửu Diệu.
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
                  Trong Navagraha (9 “thiên thể” của thiên văn Ấn Độ cổ), Rahu và Ketu được đếm là hai
                  graha bên cạnh 7 thiên thể thật — dù chúng là {strong('điểm hình học')}, không phải
                  vật thể. Sang Cửu Diệu Đông Á, cặp giao điểm này thành hai hung tinh: La Hầu gắn với
                  thị phi, miệng tiếng (lời truyền nói nặng hơn với nam); Kế Đô gắn với buồn phiền, hao
                  tài (nặng hơn với nữ).
                </p>
                <p>
                  Hệ quả thực hành: đã hiểu La Hầu, Kế Đô là {strong('giao điểm quỹ đạo')} thì không có
                  gì để “giải” cả. Đọc hai sao này như lời nhắc cẩn trọng về lời nói, tiền bạc, sức
                  khoẻ trong năm — {strong('tham khảo, không phán định')}.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="sao-han"
        concept="Tuổi mụ là gì và vì sao tra sao hạn phải dùng tuổi mụ"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                {strong('Tuổi mụ')} là cách đếm tuổi của ông bà mình: em bé vừa chào đời đã được tính 1
                tuổi, qua năm mới lại thêm 1 tuổi nữa. Vì vậy tuổi mụ thường lớn hơn tuổi trên giấy
                khai sinh. Tra sao hạn phải dùng tuổi này, giống như chơi trò nào thì theo luật của trò
                đó.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Công thức: {strong('tuổi mụ ≈ năm xem − năm sinh + 1')}. Người sinh 1990 xem hạn năm
                  2026 có tuổi mụ 37, dù tuổi dương mới 36.
                </p>
                <p>
                  Sao hạn là phong tục gắn với lịch âm, mọi bảng tra truyền lại đều lập theo tuổi mụ.
                  Nhập nhầm tuổi dương là lệch sang sao khác ngay, vì chỉ chênh một tuổi thôi cũng đổi
                  phần dư khi chia 9.
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
                  Về mặt tính toán, tuổi mụ chỉ là {strong('chỉ số đầu vào')}: lấy tuổi mụ chia 9 giữ
                  phần dư (0 đến 8), phần dư quyết định sao. Sai một tuổi nghĩa là sai một bậc trong chu
                  kỳ 9 năm. Đây là chỗ nhầm phổ biến nhất khi tra tay rồi thấy kết quả khác với công cụ.
                </p>
                <p>
                  Một chi tiết hay bị bỏ sót: phần dư 0 (tuổi mụ chia hết cho 9: tuổi 9, 18, 27, 36…)
                  vẫn có sao riêng — nam gặp {strong('Mộc Đức')}, nữ gặp {strong('Thủy Diệu')}, không
                  phải "không có sao".
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="sao-han"
        concept="Ba nhóm cát – trung – hung: nhãn nhóm nói gì và không nói gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                9 sao được chia vào ba giỏ: giỏ {strong('dễ chịu')}, giỏ {strong('bình thường')} và giỏ{' '}
                {strong('nên cẩn thận')}. Cái giỏ chỉ cho biết năm đó cần chú ý nhiều hay ít, chứ không
                nói trước chuyện gì sẽ xảy ra.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Cát tinh')} (Thái Dương, Thái Âm, Mộc Đức) hàm ý năm hanh thông.{' '}
                  {strong('Trung tính')} (Thổ Tú, Thủy Diệu, Vân Hớn) là năm bình thường, có vài điểm
                  cần để ý. {strong('Hung tinh')} (La Hầu, Kế Đô, Thái Bạch) hàm ý năm nên thận trọng.
                </p>
                <p>
                  Nhãn nhóm chỉ là "tông" chung của năm theo phong tục. Nội dung cụ thể (lời nói, tiền
                  bạc, sức khoẻ, đi lại) nằm trong mô tả của từng sao, nên đọc nhãn xong vẫn cần đọc
                  tiếp sao của mình.
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
                  Ranh giới ba nhóm không tuyệt đối giữa các tài liệu. {strong('Vân Hớn')} mang hình
                  ảnh lửa nên hay bị tưởng nhầm là hung tinh, nhưng theo cách chia phổ biến nó thuộc
                  nhóm trung tính. {strong('Thủy Diệu')} thì có trường phái xem là cát tinh nhẹ.
                </p>
                <p>
                  Vì vậy nên đọc nhãn nhóm như một cách gom sơ bộ. Muốn biết năm đó nên cẩn trọng điều
                  gì, hãy đọc mô tả của chính sao ấy, đừng dừng ở hai chữ tốt – xấu.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="sao-han"
        concept="Đọc 'tháng cần lưu ý' của từng sao thế nào cho đúng"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi sao có vài tháng được người xưa dặn {strong('để ý thêm')}, giống như mẹ dặn "tuần
                này con nhớ mang áo mưa". Đó là lời dặn cho một quãng ngắn, không phải cả năm lúc nào
                cũng phải lo.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Các tháng này tính theo {strong('âm lịch')} và khác nhau tuỳ sao. Sao tốt có "tháng
                  tốt": Thái Dương thường nhắc tháng 6 và tháng 10, Mộc Đức tháng 10 và tháng 12. Sao
                  cần thận trọng có "tháng cần lưu ý": La Hầu tháng 1 và tháng 7, Kế Đô tháng 3 và
                  tháng 9, Thái Bạch tháng 5.
                </p>
                <p>
                  Cách dùng hợp lý: tới những tháng đó thì nhớ lại lời nhắc của sao mình (lời nói, tiền
                  bạc, sức khoẻ), chứ không phải kiêng làm mọi việc trong tháng ấy.
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
                  Con số tháng là quy ước truyền qua sách phong tục, và các nguồn{' '}
                  {strong('không hoàn toàn thống nhất')}: với Thái Bạch, tháng 5 âm được nhắc rộng rãi,
                  một số nguồn cổ ghi thêm tháng 2 và tháng 8. Có sao còn ghi cả hai chiều trong một
                  năm, như Thái Âm: tháng 9 thường nhắc là tháng tốt, riêng tháng 11 lại dặn chú ý sức
                  khoẻ.
                </p>
                <p>
                  Nên xem lớp chi tiết này là {strong('tham khảo trong tham khảo')}. Nguồn này ghi khác
                  nguồn kia là chuyện bình thường của tư liệu phong tục, không có bảng tháng nào là
                  "chuẩn thiên văn" cả.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="sao-han"
        concept="Cửu Diệu đứng đâu giữa Tử Vi, Tam Tai, Kim Lâu"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trong tủ sách phong tục có nhiều {strong('cuốn sổ')} khác nhau: sổ sao hạn, sổ Tam Tai,
                sổ Kim Lâu, và bộ Tử Vi dày nhất. Mỗi sổ có luật riêng, nên đừng lấy kết quả của sổ này
                đem gán cho sổ kia.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Bốn hệ khác nhau ở dữ liệu đầu vào và mục đích. {strong('Sao hạn Cửu Diệu')} chỉ cần
                  năm sinh và giới tính, chu kỳ 9 năm. {strong('Tam Tai')} tính theo con giáp, kéo dài
                  ba năm liên tiếp theo nhóm tuổi. {strong('Kim Lâu')} thường được xem khi tính chuyện
                  cưới hỏi, làm nhà.
                </p>
                <p>
                  Còn {strong('Tử Vi Đẩu Số')} lập lá số theo đủ giờ, ngày, tháng, năm sinh với một hệ
                  sao riêng — khác hẳn về độ chi tiết so với ba loại hạn tuổi kia.
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
                  Hai chỗ dễ trộn nhất. Thứ nhất, {strong('tên sao trùng nhau')}: Thái Dương, Thái Âm
                  vừa là sao Cửu Diệu vừa là tên sao trong Tử Vi, nhưng cách tính và vai trò khác hẳn.
                  "Năm nay chiếu Thái Dương" bên sao hạn không nói gì về sao Thái Dương trong lá số Tử
                  Vi của bạn.
                </p>
                <p>
                  Thứ hai, {strong('cộng dồn hạn')}: một năm có thể "dính" hạn ở hệ này mà hoàn toàn
                  bình thường ở hệ kia, vì mỗi hệ chia nhóm theo cách riêng. Đọc từng hệ theo đúng luật
                  của nó, và nhớ cả ba loại hạn tuổi đều là phong tục để tham khảo, không phải phán
                  quyết.
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
    prompt: 'Cách tính sao hạn dựa trên hai thông tin nào của một người?',
    answer: (
      <>
        Dựa trên {strong('tuổi mụ')} (tuổi âm ≈ năm xem − năm sinh + 1) và {strong('giới tính')}. Lấy
        tuổi mụ chia 9 lấy phần dư, rồi đối chiếu vào bảng riêng cho nam và nữ — vì cùng một tuổi, sao
        chiếu mệnh của nam và nữ khác nhau.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ba sao nào thuộc nhóm cát tinh (tốt) trong Cửu Diệu?',
    choices: [
      { text: 'La Hầu, Kế Đô, Thái Bạch', note: 'Đây là ba hung tinh (nhóm cần thận trọng).' },
      {
        text: 'Thái Dương, Thái Âm, Mộc Đức',
        correct: true,
        note: 'Đúng — ba cát tinh: mặt trời, mặt trăng và sao Mộc.',
      },
      { text: 'Thổ Tú, Thủy Diệu, Vân Hớn', note: 'Đây là ba sao trung tính.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'La Hầu và Kế Đô thực chất là gì?',
    choices: [
      {
        text: 'Hai giao điểm nơi quỹ đạo Mặt Trăng cắt hoàng đạo — vùng trời xảy ra nhật/nguyệt thực',
        correct: true,
        note: 'Đúng — không phải sao thật; đó là Rahu và Ketu.',
      },
      { text: 'Hai ngôi sao chổi cổ đại', note: 'Không — chúng không phải thiên thể có thật.' },
      { text: 'Hai hành tinh trong hệ Mặt Trời', note: 'Không — 5 hành tinh thật ứng với các sao khác.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Gặp năm có sao xấu (La Hầu, Kế Đô, Thái Bạch) thì nên hiểu thế nào?',
    choices: [
      {
        text: 'Chắc chắn sẽ gặp xui, nên làm lễ giải hạn cho an tâm',
        note: 'Không — sao xấu không đồng nghĩa chắc chắn gặp rủi; hieu.asia không bán lễ giải.',
      },
      {
        text: 'Là lời nhắc nên cẩn trọng hơn (lời nói, tiền bạc – giấy tờ, sức khoẻ); chủ động vẫn là điều quan trọng nhất',
        correct: true,
        note: 'Đúng — tham khảo để sống chủ động, không phải điềm báo cố định.',
      },
      { text: 'Cả năm không nên làm việc gì lớn', note: 'Không — phong tục chỉ gợi ý thận trọng, không cấm đoán.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Vì sao cùng sinh một năm, hai anh em (một nam một nữ) lại có sao hạn khác nhau trong cùng một năm xem?',
    answer: (
      <>
        Vì sao hạn tra theo {strong('bảng riêng cho nam và nữ')}. Dù tuổi mụ (và phần dư khi chia 9)
        giống nhau, bảng nam và bảng nữ ánh xạ phần dư đó sang các sao khác nhau — nên cùng một tuổi,
        nam và nữ chiếu hai sao khác nhau.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Sao hạn lặp lại theo chu kỳ bao nhiêu năm — và vì sao?',
    choices: [
      {
        text: '9 năm — vì có đúng 9 sao, tra theo phần dư khi chia tuổi mụ cho 9',
        correct: true,
        note: 'Đúng — phần dư 0 đến 8 ứng với 9 sao, nên cứ 9 năm một người quay lại đúng sao cũ.',
      },
      {
        text: '12 năm — vì tính theo 12 con giáp',
        note: 'Không — con giáp là hệ khác (vd Tam Tai mới tính theo con giáp); sao hạn chia tuổi mụ cho 9.',
      },
      {
        text: '60 năm — vì theo lục thập hoa giáp',
        note: 'Không — sao hạn chỉ dùng phép chia 9 trên tuổi mụ, không dùng vòng 60 năm.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Vì sao bảng tra sao của nam và nữ khác nhau?',
    choices: [
      {
        text: 'Vì vị trí các thiên thể trên trời khác nhau tuỳ giới tính người xem',
        note: 'Không — vị trí thiên thể không phụ thuộc người xem; đây chính là ngộ nhận bài đã đính chính.',
      },
      {
        text: 'Đó là quy ước dân gian truyền lại qua sách phong tục, không có cơ sở thiên văn',
        correct: true,
        note: 'Đúng — hai bảng là quy ước văn hoá; tài liệu phong tục không ghi lý do gốc của cách chia này.',
      },
      {
        text: 'Vì tuổi mụ của nam và nữ được tính theo hai công thức khác nhau',
        note: 'Không — tuổi mụ tính như nhau (năm xem − năm sinh + 1); chỉ bảng ánh xạ sao là khác.',
      },
    ],
  },
];

export function SaoHanRecall() {
  return <ActiveRecall topicId="sao-han" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được sao hạn dùng để làm gì (lời nhắc theo phong tục “năm nay nên lưu ý điều gì”) — và nó KHÔNG hứa gì (không phán may – rủi chắc chắn).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả cách suy ra sao: tuổi mụ (năm xem − năm sinh + 1) → chia 9 lấy dư → đối chiếu bảng riêng nam/nữ.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể được 9 sao Cửu Diệu và chia đúng 3 nhóm: cát tinh, trung tính, hung tinh.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao cùng tuổi nhưng nam và nữ lại có sao chiếu khác nhau.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra La Hầu và Kế Đô không phải sao thật (là giao điểm hoàng đạo), 7 “sao” còn lại mới là thiên thể thật.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “sao xấu” không = chắc chắn gặp xui, và vì sao không cần sợ hay tốn tiền giải hạn.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân “sao hạn là gì và nên hiểu ra sao” bằng lời của bạn, giữ giọng tham khảo.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd nguồn gốc Navagraha, bảng nam/nữ) bạn vẫn còn thấy mơ hồ.',
  },
];

export function SaoHanChecklist() {
  return <UnderstandingChecklist topicId="sao-han" facets={FACETS} />;
}

export function SaoHanWhys() {
  return (
    <FiveWhys
      topicId="sao-han"
      start={
        <>
          Đầu năm, một người tra thấy mình gặp sao Thái Bạch (“Thái Bạch quét sạch cửa nhà”), liền lo
          lắng cả năm sẽ mất mát, tính đi làm lễ giải hạn cho yên tâm.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy sao xấu rồi lo lắng cả năm lại là phản ứng chưa hợp lý?',
          because: <>Vì sao xấu {strong('không')} có nghĩa là chắc chắn gặp xui.</>,
        },
        {
          question: 'Vì sao sao xấu không đồng nghĩa với chắc chắn gặp xui?',
          because: (
            <>
              Vì theo quan niệm dân gian, đó chỉ là năm {strong('nên cẩn trọng hơn')} — giữ lời nói,
              thận trọng tiền bạc – giấy tờ, chú ý sức khoẻ.
            </>
          ),
        },
        {
          question: 'Vì sao lại chỉ là một lời nhắc “cẩn trọng”, không phải án phạt?',
          because: (
            <>
              Vì sao hạn là cách người xưa gửi lời nhắc {strong('“năm nay nên lưu ý điều gì”')} lên
              bầu trời — một di sản văn hoá, mang tính tham khảo.
            </>
          ),
        },
        {
          question: 'Vì sao lại là văn hoá tham khảo chứ không phải quy luật tất định?',
          because: (
            <>
              Vì bản thân các “sao” không quyết định đời ai — thậm chí La Hầu và Kế Đô{' '}
              {strong('không phải sao thật')}, chỉ là giao điểm hình học nơi xảy ra nhật/nguyệt thực.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên phản ứng với sao hạn?',
          because: (
            <>
              Vì hiểu nguồn gốc rồi thì {strong('không cần sợ')}, càng không cần tốn tiền “giải” một
              giao điểm — điều thực sự quyết định là sống cẩn thận và chủ động.
            </>
          ),
        },
      ]}
      root={
        <>
          Sao hạn là một nét văn hoá lâu đời để nhắc nhau sống cẩn trọng theo từng năm, không phải bản
          án. Gặp sao tốt đừng buông lơi, gặp sao xấu cũng không đáng sợ — hãy dùng nó như một góc nhìn
          để chủ động hơn, {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
