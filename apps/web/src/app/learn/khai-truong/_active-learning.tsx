/**
 * Nội dung "học chủ động" cho trang /learn/khai-truong.
 *
 * GROUNDING — mọi dữ kiện dưới đây chép/suy trực tiếp từ:
 *   • lib/khai-truong.ts → checkOpeningYear(): xét ĐÚNG hai hạn cho việc mở
 *     hàng là Tam Tai và xung Thái Tuế; thang kết luận 3 bậc
 *     (tamTai → 'pham' | xung → 'can-nhac' | sạch → 'thuan'); câu diễn giải
 *     "Năm X trùng chi tuổi (năm tuổi / Thái Tuế) — chỉ là lưu ý nhẹ, không
 *     phải hạn cấm khai trương"; và ghi chú engine cố ý LOẠI Kim Lâu / Hoang Ốc
 *     vì hai hạn đó dành cho xây nhà và cưới hỏi.
 *   • lib/xem-tuoi-cuoi.ts → canChiOfYear(), LUC_XUNG (6 cặp chi đối nhau),
 *     checkXungNam() (isXung = LUC_XUNG[chi tuổi] === chi năm; isNamTuoi =
 *     chi năm trùng chi tuổi), TAM_TAI_YEARS.
 *   • trang công cụ app/khai-truong/ + KhaiTruongChecker.tsx → xét tuổi NGƯỜI
 *     ĐỨNG TÊN kinh doanh; tuổi tính theo năm âm lịch (sinh tháng 1–2 dương
 *     trước Tết thì nhập lùi 1 năm); bước sau khi xem tuổi là chọn NGÀY GIỜ;
 *     "quyết định mở hay hoãn nên dựa trên thị trường, vốn và việc chuẩn bị".
 *
 * PHÂN VAI (chống trùng bài): bài này sở hữu THÁI TUẾ và việc mở hàng. Cơ chế
 * Tam Tai thuộc /learn/tam-tai (ở đây chỉ nhắc 1–2 câu + link); hình học vòng
 * 12 chi thuộc /learn/tam-hop-luc-xung; chọn ngày tốt thuộc /learn/trach-cat;
 * giờ thuộc /learn/gio-hoang-dao.
 *
 * Giọng: phong tục được tính minh bạch để THAM KHẢO, không phán số mệnh,
 * không hù doạ, không bán lễ "giải hạn".
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

export function KhaiTruongFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn sắp mở quán, mở cửa hàng, mở công ty — và có người hỏi{' '}
          {strong('“năm nay tuổi mình khai trương được không?”')}. Hoặc bạn tự tra thử rồi gặp một
          dòng chữ lạ: “xung Thái Tuế”, “năm tuổi” — mà không ai giải thích đó là gì.
        </>
      }
      why={
        <>
          Trong tục lệ của người Việt, mở hàng được xếp vào nhóm{' '}
          {strong('việc khởi sự')} — nhóm việc mà dân gian dặn nhau xem năm trước khi làm. Vì thế
          người kinh doanh thường để ý chuyện năm–tuổi kỹ hơn hẳn các việc thường ngày.
        </>
      }
      what={
        <>
          Là phép so tuổi {strong('người đứng tên kinh doanh')} với{' '}
          {strong('năm định mở')}, qua đúng hai hạn: Tam Tai và xung Thái Tuế.{' '}
          {strong('Không xét Kim Lâu hay Hoang Ốc')} — hai hạn đó dành cho việc cưới hỏi và xây nhà.
          Nó {strong('không phải')} lời hứa cửa hàng sẽ đông khách.
        </>
      }
      how={
        <>
          Đổi năm sinh và năm định mở ra {strong('can chi')}, rồi so hai chi với nhau. Chi năm nằm
          trong 3 năm Tam Tai của tuổi → dân gian kiêng khởi sự. Chi năm{' '}
          {strong('đối')} chi tuổi (lục xung) → “xung Thái Tuế”, cần cân nhắc. Chi năm{' '}
          {strong('trùng')} chi tuổi → “năm tuổi”, chỉ là lưu ý nhẹ. Sạch cả hai → hợp tuổi.
        </>
      }
      soWhat={
        <>
          Để việc lọc năm chỉ tốn {strong('ba mươi giây')} thay vì mấy tuần lo lắng — rồi bạn dồn
          sức cho thứ thật sự quyết định một cửa hàng sống được:{' '}
          {strong('sản phẩm, vị trí, dòng tiền và khách quen')}.
        </>
      }
    />
  );
}

export function KhaiTruongDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="khai-truong"
        concept="Thái Tuế là gì trong cách tính này"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi năm có một {strong('con giáp cầm cờ')}: năm con Ngựa, năm con Dê, năm con Khỉ…
                Người xưa gọi con giáp cầm cờ của năm đó là {strong('Thái Tuế')}. Xem tuổi khai
                trương chỉ là đặt con giáp của năm cạnh con giáp của bạn rồi hỏi: hai con này đứng
                cùng chỗ, đứng đối nhau, hay chẳng liên quan?
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi năm âm lịch có một cặp {strong('can chi')} riêng, ví dụ Bính Ngọ hay Đinh Mùi.
                  Phần {strong('chi')} (Tý, Sửu, Dần, Mão…) chính là con giáp của năm. Trong cách
                  tính của công cụ, {strong('Thái Tuế được đọc qua chi của năm')}.
                </p>
                <p>
                  Tuổi bạn cũng có một chi — chi của năm bạn sinh. Toàn bộ phần “Thái Tuế” trong xem
                  tuổi khai trương gói lại thành {strong('hai câu hỏi')}: chi năm có{' '}
                  {strong('trùng')} chi tuổi không, và chi năm có {strong('đối')} chi tuổi không.
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
                  Nói chính xác theo engine: công cụ lấy{' '}
                  {strong('canChiOfYear(năm sinh).chi')} và {strong('canChiOfYear(năm xem).chi')},
                  rồi trả về hai cờ. {strong('isNamTuoi')} bật khi hai chi bằng nhau — dân gian gọi
                  là “năm tuổi”, và engine ghi rõ đây{' '}
                  {strong('chỉ là lưu ý nhẹ, không phải hạn cấm khai trương')}.{' '}
                  {strong('isXung')} bật khi chi năm là chi đối của chi tuổi trong bảng lục xung.
                </p>
                <p>
                  Cần trung thực về phạm vi: sách vở dân gian còn kể nhiều biến thể khác quanh chữ
                  Thái Tuế. Công cụ của hieu.asia{' '}
                  {strong('chỉ tính đúng hai quan hệ trùng chi và lục xung')} — nên bài này cũng
                  không dạy thứ mà công cụ không tính. Biết rõ ranh giới của một phép tính là phần
                  quan trọng nhất của việc hiểu nó.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="khai-truong"
        concept="“Xung Thái Tuế” và “năm tuổi” khác nhau ở đâu"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tưởng tượng một mặt đồng hồ có 12 con giáp. {strong('Năm tuổi')} là khi kim chỉ đúng
                vào con giáp của bạn. {strong('Năm xung')} là khi kim chỉ vào ô{' '}
                {strong('đối diện thẳng')} bên kia mặt đồng hồ. Hai chuyện khác nhau, và cách nửa
                vòng đồng hồ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Vòng 12 chi xếp thành vòng tròn. Hai chi {strong('đối nhau')} — cách nhau 6 bước —
                  là một cặp lục xung: Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi. Chi
                  năm rơi đúng chi đối của tuổi bạn thì gọi là {strong('xung Thái Tuế')}.
                </p>
                <p>
                  Hệ quả rất dễ nhớ: mỗi 12 năm, bạn có {strong('đúng 1 năm tuổi')} và{' '}
                  {strong('đúng 1 năm xung')}, và hai năm đó luôn{' '}
                  {strong('cách nhau đúng 6 năm')}. Vì sao lại là 6 bước thì trọn phần hình học nằm
                  ở bài Tam hợp – Lục xung.
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
                  Điểm khác biệt quan trọng nằm ở {strong('kết luận')}, không chỉ ở tên gọi. Trong
                  engine, năm tuổi {strong('không')} làm đổi kết luận: một năm chỉ trùng chi tuổi vẫn
                  cho verdict {strong('“hợp tuổi khai trương”')}, kèm một dòng lưu ý. Còn năm xung
                  hạ verdict xuống bậc {strong('“cần cân nhắc”')}.
                </p>
                <p>
                  Đây là chỗ nhiều người nhầm nặng nhất khi nghe truyền miệng: gộp “năm tuổi” với
                  “xung Thái Tuế” thành một nỗi lo chung. Hai điều kiện được tính bằng hai phép so
                  khác nhau ({strong('trùng chi')} và {strong('chi đối')}), cho hai mức kết luận
                  khác nhau, và không bao giờ xảy ra cùng một năm.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="khai-truong"
        concept="Vì sao tục kinh doanh đặc biệt để ý chuyện năm"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có những việc làm đi làm lại mỗi ngày, sai thì làm lại. Có những việc{' '}
                {strong('chỉ mở màn một lần')} — như buổi khai trương của một cửa hàng. Người xưa
                dặn nhau xem năm cho đúng nhóm việc “mở màn” ấy.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Hạn dân gian xét cho khai trương đều là hạn của việc{' '}
                  {strong('khởi sự')}. Lời dặn đi kèm Tam Tai được truyền lại nguyên văn là “kiêng
                  khởi sự, mở mang” — mà mở hàng chính là khởi sự điển hình.
                </p>
                <p>
                  Vì thế cùng một tuổi, cùng một năm, tục lệ có thể nói khác nhau tuỳ{' '}
                  {strong('việc bạn định làm')}: cưới hỏi xét Kim Lâu, xây nhà xét Hoang Ốc, mở hàng
                  xét Tam Tai và xung Thái Tuế. Không có một bảng “tốt/xấu” chung cho mọi việc.
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
                  Đó là lý do engine khai trương{' '}
                  {strong('cố ý loại Kim Lâu và Hoang Ốc')} thay vì gộp cho “đầy đủ”. Gộp thêm hạn
                  không thuộc việc này chỉ làm một chuyện: tăng tỉ lệ báo “xấu” mà không tăng chút
                  đúng đắn nào — tức là {strong('doạ sai')}.
                </p>
                <p>
                  Con số nói rõ điều đó. Khai trương chỉ xét 3 năm Tam Tai và 1 năm xung trong mỗi
                  12 năm, nên phần lớn số năm vẫn là năm hợp tuổi. Nếu nhét thêm Kim Lâu (4 năm phạm
                  trong mỗi 9 năm) vào cùng một phép, số năm “sạch” tụt xuống rất nhanh — và người
                  đọc sẽ tin rằng mình{' '}
                  {strong('gần như lúc nào cũng vướng hạn')}, điều mà chính tục lệ không hề nói.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="khai-truong"
        concept="Vì sao xem tuổi mới là bước một, chưa phải là xong"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Chọn năm giống như chọn {strong('tháng đi chơi')}. Chọn xong tháng vẫn còn phải chọn{' '}
                {strong('ngày nào')} và {strong('mấy giờ')} thì đi. Ba câu hỏi khác nhau, hỏi lần
                lượt.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Xem tuổi khai trương chỉ trả lời câu hỏi{' '}
                  {strong('“NĂM này có hợp để khởi sự không”')} — nó chạy trên đúng hai dữ kiện: năm
                  sinh chủ và năm định mở. Nó hoàn toàn không biết ngày nào trong năm bạn sẽ mở cửa.
                </p>
                <p>
                  Chọn {strong('ngày')} là một tầng khác (ngày hoàng đạo, hợp mệnh, tránh ngày kiêng
                  kỵ), và chọn {strong('giờ')} lại là tầng thứ ba. Ba tầng dùng ba cách tính riêng,
                  không suy ra được từ nhau.
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
                  Thứ tự thực hành gọn nhất là {strong('năm → ngày → giờ')}: lọc năm trước vì nó rẻ
                  nhất và loại được nhiều lựa chọn nhất, rồi mới xuống ngày và giờ. Làm ngược lại thì
                  bạn có thể chọn xong một ngày rất đẹp trong một năm mà chính bạn muốn tránh.
                </p>
                <p>
                  Và cần nhớ ranh giới cuối: cả ba tầng cộng lại vẫn chỉ là{' '}
                  {strong('cách chọn một cái mốc')}. Không tầng nào trong đó nói được cửa hàng có
                  khách hay không — phần ấy nằm ở hàng hoá, mặt bằng, giá vốn và việc bạn giữ được
                  bao nhiêu người quay lại.
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
    prompt: 'Xem tuổi khai trương cần đúng những dữ kiện nào, và xét những hạn nào?',
    answer: (
      <>
        Cần {strong('năm sinh của người đứng tên kinh doanh')} và {strong('năm định khai trương')}.
        Từ hai năm đó suy ra can chi rồi xét đúng hai hạn: {strong('Tam Tai')} và{' '}
        {strong('xung Thái Tuế')}. Không xét Kim Lâu hay Hoang Ốc — hai hạn đó dành cho cưới hỏi và
        xây nhà.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Trong cách tính của công cụ, “Thái Tuế” được đọc qua cái gì?',
    choices: [
      {
        text: 'Chi (con giáp) của năm đang xét',
        correct: true,
        note: 'Đúng — công cụ so chi của năm với chi của tuổi, chỉ qua hai quan hệ: trùng chi và chi đối (lục xung).',
      },
      {
        text: 'Can (Giáp, Ất, Bính…) của năm đang xét',
        note: 'Không — phép so chạy trên phần chi, không phải phần can. Can vẫn hiện trong tên năm nhưng không tham gia kết luận.',
      },
      {
        text: 'Tuổi mụ của chủ kinh doanh',
        note: 'Không — tuổi mụ chia 9 là cách tính Kim Lâu, dành cho cưới hỏi. Khai trương không dùng tuổi mụ.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Chi của năm định mở TRÙNG đúng chi tuổi chủ. Công cụ kết luận thế nào?',
    choices: [
      {
        text: 'Là “năm tuổi” — vẫn xếp hợp tuổi khai trương, chỉ kèm một dòng lưu ý nhẹ',
        correct: true,
        note: 'Đúng — engine ghi rõ đây chỉ là lưu ý nhẹ, không phải hạn cấm khai trương.',
      },
      {
        text: 'Là xung Thái Tuế — hạ xuống bậc “cần cân nhắc”',
        note: 'Không — xung là khi chi năm ĐỐI chi tuổi, không phải trùng. Trùng và đối cách nhau nửa vòng 12 chi.',
      },
      {
        text: 'Là nặng nhất — dân gian kiêng khởi sự',
        note: 'Không — bậc nặng nhất trong công cụ dành cho Tam Tai, không dành cho năm tuổi.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Một người tuổi Tý. Năm nào là năm xung Thái Tuế của họ?',
    choices: [
      { text: 'Năm Tý', note: 'Không — năm Tý là “năm tuổi” của họ (trùng chi), chỉ là lưu ý nhẹ.' },
      {
        text: 'Năm Ngọ',
        correct: true,
        note: 'Đúng — Tý và Ngọ là một cặp lục xung (hai chi đối nhau trên vòng 12).',
      },
      {
        text: 'Năm Mão',
        note: 'Không — chi đối của Mão là Dậu. Mỗi chi chỉ có đúng một chi đối.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vì sao năm tuổi và năm xung Thái Tuế của cùng một người luôn cách nhau đúng 6 năm — và mỗi thứ chỉ xuất hiện một lần trong 12 năm?',
    answer: (
      <>
        Vì 12 chi xếp thành một vòng, và {strong('lục xung là hai chi đối nhau')} — cách nhau đúng 6
        bước trên vòng đó. Chi năm chạy hết một vòng sau 12 năm, nên trong mỗi 12 năm chi năm trùng
        chi tuổi {strong('đúng một lần')} (năm tuổi) và rơi vào chi đối{' '}
        {strong('đúng một lần')} (năm xung), hai lần ấy cách nhau nửa vòng, tức 6 năm.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Vì sao xem tuổi khai trương cố ý KHÔNG tính Kim Lâu và Hoang Ốc?',
    choices: [
      {
        text: 'Vì hai hạn đó dành cho cưới hỏi và xây nhà; gộp vào sẽ báo “xấu” nhiều hơn mà không đúng hơn',
        correct: true,
        note: 'Đúng — engine loại có chủ đích để khỏi doạ sai, và trang công cụ nói rõ lý do đó.',
      },
      {
        text: 'Vì hai hạn đó quá khó tính, phải có thầy mới tra được',
        note: 'Không — Kim Lâu chỉ là phép chia 9, và hieu.asia có công cụ riêng cho nó. Lý do loại là phạm vi việc, không phải độ khó.',
      },
      {
        text: 'Vì hai hạn đó đã bị chứng minh là sai',
        note: 'Không — chúng vẫn được tính đúng ở đúng loại việc của chúng. Vấn đề chỉ là dùng đúng chỗ.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Sau khi biết năm định mở hợp tuổi, bước tiếp theo là gì?',
    choices: [
      {
        text: 'Xong rồi — chọn năm hợp tuổi là đủ cho một buổi khai trương',
        note: 'Chưa — xem tuổi chỉ trả lời câu hỏi về NĂM. Ngày và giờ là hai tầng tính riêng.',
      },
      {
        text: 'Chọn NGÀY mở hàng trong năm đó, rồi chọn GIỜ trong ngày',
        correct: true,
        note: 'Đúng — thứ tự năm → ngày → giờ. Ba tầng dùng ba cách tính khác nhau, không suy ra được từ nhau.',
      },
      {
        text: 'Làm lễ giải hạn cho chắc',
        note: 'Không — hieu.asia không bán lễ “giải hạn” và không cho rằng phải “giải” mới yên.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Vận dụng: chủ quán vướng Tam Tai đúng năm định mở, nhưng mặt bằng đã thuê và hàng đã nhập. Bạn khuyên gì?',
    answer: (
      <>
        Nói thẳng cả hai phía. Một là: Tam Tai và xung Thái Tuế là{' '}
        {strong('tập tục để tham khảo, không phải lời phán')} — vẫn có người khởi sự trong năm Tam
        Tai và chọn ngày giờ kỹ hơn. Hai là: nếu không gấp và muốn theo tục thì công cụ liệt kê sẵn
        các năm hợp tuổi gần nhất. Nhưng điều quan trọng nhất là{' '}
        {strong('quyết định mở hay hoãn nên dựa trên thị trường, vốn và việc chuẩn bị')} — hàng đã
        nhập và mặt bằng đã thuê là những dữ kiện thật, nặng hơn một phép so hai chi.
      </>
    ),
  },
];

export function KhaiTruongRecall() {
  return <ActiveRecall topicId="khai-truong" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được xem tuổi khai trương dùng để làm gì (lọc NĂM khởi sự theo tuổi người đứng tên) — và nó KHÔNG hứa gì về việc buôn bán đắt hàng.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Tính được từ đầu đến cuối: năm sinh → chi tuổi, năm định mở → chi năm, rồi so hai chi để ra một trong ba bậc kết luận.',
  },
  {
    id: 'thai-tue',
    facet: 'Thái Tuế',
    can: 'Giải thích được Thái Tuế trong cách tính này chính là chi của năm, và công cụ chỉ xét hai quan hệ: trùng chi và chi đối.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt rạch ròi “năm tuổi” (trùng chi — lưu ý nhẹ, vẫn hợp) với “xung Thái Tuế” (chi đối — hạ xuống bậc cần cân nhắc).',
  },
  {
    id: 'cycle',
    facet: 'Chu kỳ',
    can: 'Chỉ ra vì sao mỗi 12 năm chỉ có 1 năm tuổi và 1 năm xung, và vì sao hai năm ấy luôn cách nhau đúng 6 năm.',
  },
  {
    id: 'scope',
    facet: 'Phạm vi',
    can: 'Nói được vì sao khai trương không xét Kim Lâu / Hoang Ốc, và vì sao gộp thêm hạn không thuộc việc này là doạ sai.',
  },
  {
    id: 'workflow',
    facet: 'Quy trình',
    can: 'Kể đúng thứ tự năm → ngày → giờ, và biết mỗi tầng dùng một cách tính riêng, không suy ra được từ tầng trước.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói thẳng được rằng thứ quyết định một cửa hàng sống được là sản phẩm, vị trí, dòng tiền và khách quen — không phải năm mở hàng.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho một người bạn đang mở quán trong một phút: xét gì, ba bậc kết luận nghĩa là gì, và nên làm gì tiếp — giữ giọng tham khảo.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn vẫn thấy mơ hồ (vd vì sao đúng ba năm Tam Tai, vì sao chi đối lại bị coi là “khắc”) — và biết bài nào giải thích tiếp.',
  },
];

export function KhaiTruongChecklist() {
  return <UnderstandingChecklist topicId="khai-truong" facets={FACETS} />;
}

export function KhaiTruongWhys() {
  return (
    <FiveWhys
      topicId="khai-truong"
      start={
        <>
          Một người sắp mở cửa hàng tra thử tuổi mình, và thấy dòng chữ “xung Thái Tuế” cho đúng năm
          đã định. Cả nhà xôn xao: người bảo dời sang năm khác, người bảo đi tìm thầy cúng cho yên
          tâm rồi hãy mở.
        </>
      }
      chain={[
        {
          question: 'Vì sao vội dời lịch hay đi mua lễ “giải hạn” là phản ứng vội?',
          because: (
            <>
              Vì “xung Thái Tuế” không phải một lời phán. Trong công cụ, nó chỉ hạ kết luận xuống bậc{' '}
              {strong('“cần cân nhắc”')} — bậc giữa của một thang ba bậc, không phải bậc cấm.
            </>
          ),
        },
        {
          question: 'Vì sao nó chỉ là bậc giữa mà không phải bậc nặng nhất?',
          because: (
            <>
              Vì thang kết luận được xếp theo đúng mức nặng nhẹ của tục lệ: vướng{' '}
              {strong('Tam Tai')} thì dân gian kiêng khởi sự; chỉ {strong('xung tuổi')} thì cân
              nhắc; sạch cả hai thì hợp tuổi. Còn {strong('năm tuổi')} thậm chí không hạ bậc nào.
            </>
          ),
        },
        {
          question: 'Vì sao một quan hệ giữa hai chi lại đáng để cân nhắc đến thế?',
          because: (
            <>
              Vì lục xung là {strong('hai chi đối nhau')} trên vòng 12 — người xưa đọc thế đối đó là
              “khắc”. Mỗi tuổi chỉ có đúng một chi đối, nên trong 12 năm chỉ có{' '}
              {strong('đúng một năm')} rơi vào trường hợp này. Chính vì hiếm nên nó được nhớ kỹ.
            </>
          ),
        },
        {
          question: 'Vậy vì sao riêng giới kinh doanh lại soi chuyện năm kỹ hơn người khác?',
          because: (
            <>
              Vì các hạn được xét cho khai trương đều là hạn của việc{' '}
              {strong('khởi sự')}: lời dặn truyền lại cùng Tam Tai đúng là “kiêng khởi sự, mở mang”.
              Mở hàng là khởi sự điển hình, nên nó rơi trọn vào nhóm việc ấy — trong khi cưới hỏi
              hay xây nhà lại xét bằng những hạn khác hẳn.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây rồi thì nên làm gì cho đúng?',
          because: (
            <>
              Coi việc xem tuổi đúng như bản chất của nó: một{' '}
              {strong('bộ lọc năm tốn ba mươi giây')}. Muốn theo tục thì chọn một năm hợp tuổi —
              công cụ liệt kê sẵn các năm gần nhất. Không muốn dời thì cứ mở, và chọn ngày giờ kỹ
              hơn. Điều duy nhất không nên là để một phép so hai chi{' '}
              {strong('quyết định thay')} cho hàng hoá, mặt bằng và dòng tiền.
            </>
          ),
        },
      ]}
      root={
        <>
          Thái Tuế ở đây chỉ là {strong('chi của năm')}, và “xung Thái Tuế” chỉ là chuyện chi năm
          đứng đối chi tuổi. Đó là một lời nhắc theo phong tục để bạn tham khảo, không phải bản án —
          và {strong('quyết định mở hay hoãn nên dựa trên thị trường, vốn và việc chuẩn bị')}, những
          thứ ảnh hưởng thật đến cửa hàng của bạn.
        </>
      }
    />
  );
}
