/**
 * Nội dung "học chủ động" cho trang /learn/can-xuong (Cân Xương Đoán Số).
 *
 * TẤT CẢ grounded từ mô tả phương pháp cân xương tính lượng: gán "trọng lượng
 * xương" (lạng / chỉ) cho 4 yếu tố ngày sinh ÂM LỊCH (năm can–chi, tháng, ngày,
 * giờ), cộng lại thành tổng "cân nặng xương", mỗi mức tổng ứng một bài thơ đoán
 * vận. Tương truyền của Viên Thiên Cang đời Đường. KHÔNG bịa bảng trọng lượng cụ
 * thể. Giữ giọng "tham khảo theo phong tục — giải trí, không phán số mệnh".
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

export function CanXuongFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Nhiều người tò mò muốn có {strong('một cái nhìn nhanh về vận số')} qua ngày giờ sinh — một
          lời động viên theo phong tục, thay vì lo lắng mơ hồ hay tin vào lời phán chắc nịch.
        </>
      }
      why={
        <>
          Cân xương đoán số (稱骨算命) là cách bói dân gian {strong('tương truyền của Viên Thiên Cang')}{' '}
          đời Đường: quy ngày giờ sinh thành một con số dễ nhớ — “cân nặng xương” — rồi đọc bài thơ
          tương ứng. Nó tồn tại như một {strong('di sản văn hoá dân gian')}, không phải phán quyết.
        </>
      }
      what={
        <>
          Gán {strong('trọng lượng xương')} (đơn vị lạng / chỉ) cho 4 yếu tố ngày sinh âm lịch: năm
          (theo can–chi), tháng, ngày, giờ. Cộng lại được {strong('tổng “cân nặng xương”')} (khoảng 2
          lạng 1 đến ~7 lạng 1). Mỗi mức tổng ứng một {strong('bài thơ')} đoán vận — đọc như lời động
          viên, không phải kết luận về đời người.
        </>
      }
      how={
        <>
          Tra bảng cố định cho từng yếu tố (60 can–chi năm, 12 tháng, 30 ngày, 12 giờ), cộng 4 trọng
          lượng lại rồi đối chiếu tổng với {strong('bài thơ')} tương ứng. Bạn không cần nhớ bảng — công
          cụ tự tra khi bạn nhập {strong('ngày giờ sinh âm lịch')}.
        </>
      }
      soWhat={
        <>
          Để có {strong('một bài thơ đọc cho vui')}, mang tính động viên tích cực — nhưng luôn nhớ đây
          là phương pháp rất thô, {strong('hàng triệu người cùng “cân nặng”')} và cùng bài thơ, nên chỉ
          nên xem như giải trí và tham khảo.
        </>
      }
    />
  );
}

export function CanXuongDepth() {
  return (
    <div className="space-y-4">
    <DepthTabs
      topicId="can-xuong"
      concept="Vì sao “cân nặng xương” chỉ nên đọc như lời động viên, không phải phán số mệnh"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Cân xương giống như một trò cân: mỗi phần ngày sinh của bạn (năm, tháng, ngày, giờ) được
              cho một “cân nặng” nho nhỏ, cộng lại thành một con số. {strong('Con số càng nặng')} thì
              bài thơ nghe càng vui — nhưng đó chỉ là một bài thơ để đọc cho vui, không phải sự thật về
              cuộc đời bạn.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Người ta gán một {strong('trọng lượng')} (tính bằng lạng, chỉ) cho từng yếu tố: năm
                sinh theo can–chi, tháng, ngày, giờ — tất cả theo {strong('lịch âm')}. Cộng 4 trọng
                lượng lại được tổng “cân nặng xương”, rồi tra sang một bài thơ đoán vận.
              </p>
              <p>
                Thường tổng nặng ứng bài thơ nghe “sang, thuận” hơn, tổng nhẹ ứng bài “vất vả” hơn.
                Nhưng đó chỉ là {strong('quan niệm dân gian mang tính động viên')} — không phải chấm
                điểm cuộc đời ai, và tuyệt đối không phải “cân nhẹ = số khổ”.
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
                Mỗi yếu tố tra theo một bảng cố định: {strong('60 can–chi năm')}, 12 tháng, 30 ngày âm,
                12 giờ (canh giờ). Bốn giá trị cộng lại cho một tổng rơi vào khoảng 2 lạng 1 đến ~7 lạng
                1; mỗi mức tổng ánh xạ tới đúng một bài thơ đoán vận đã được soạn sẵn.
              </p>
              <p>
                Điểm cần hiểu để giữ tỉnh táo: cân xương {strong('chỉ phụ thuộc ngày–giờ sinh theo can chi')} nên rất thô — độ phân giải rất thấp, {strong('hàng triệu người trùng “cân nặng”')}{' '}
                và trùng bài thơ. Nó không dựng lá số chi tiết như Bát Tự hay Tử Vi, nên không cá nhân
                hoá. Biết vậy rồi thì đọc bài thơ như một lời động viên, không xem là phán quyết.
              </p>
            </>
          ),
        },
      ]}
    />

    <DepthTabs
      topicId="can-xuong"
      concept="Vì sao rất nhiều người trùng số cân — “độ phân giải” của phép cân"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Tưởng tượng chỉ có {strong('vài chục cái hộp')}, mà cả nước ai cũng phải xếp vào một
              hộp. Rất nhiều người rơi chung một hộp, nên trùng nhau là chuyện đương nhiên — không
              phải máy tính bị sai.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Cân xương nén cả ngày–giờ sinh về {strong('một con số tổng')}, mà tổng chỉ có
                khoảng vài chục mức. Ai cùng năm–tháng–ngày–giờ can chi thì cùng tổng, cùng một bài
                thơ.
              </p>
              <p>
                Vì thế hàng triệu người trùng kết quả — đó là bản chất {strong('“độ phân giải thấp”')},
                không phải công cụ tính sai.
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
                So với Bát Tự / Tử Vi dựng lá số nhiều trụ, nhiều sao, cân xương chỉ có{' '}
                {strong('một chiều thông tin')} là con số tổng. Số mức tổng hữu hạn (rơi trong
                khoảng ~2 lạng 1 đến ~7 lạng 1) đem chia cho cả dân số, nên mỗi bài thơ dùng chung
                cho vô số người.
              </p>
              <p>
                Một bài thơ dùng chung thì về nguyên tắc {strong('không thể là phán quyết riêng')}{' '}
                cho ai. Hiểu vậy rồi thì đọc bài thơ như một lời động viên là cách dùng đúng tinh
                thần.
              </p>
            </>
          ),
        },
      ]}
    />

    <DepthTabs
      topicId="can-xuong"
      concept="Bốn trọng lượng góp vào: năm, tháng, ngày, giờ"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Cân xương chỉ nhìn vào {strong('bốn thứ')} trong ngày sinh của bạn: năm, tháng, ngày và
              giờ. Mỗi thứ được cho một “cân nặng” nho nhỏ. Không phải cân cả người bạn đâu, chỉ cân bốn
              con số ngày sinh thôi. Cộng bốn cân nặng đó lại là ra một con số để đọc thơ.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Bốn yếu tố góp trọng lượng đều lấy theo {strong('lịch âm')}: năm sinh tra theo can–chi
                (như Canh Ngọ, Tân Mùi), tháng theo tháng âm từ giêng đến chạp, ngày theo ngày âm mùng 1
                đến 30, và giờ theo 12 canh giờ (Tý, Sửu, Dần…).
              </p>
              <p>
                Mỗi yếu tố có một bảng riêng, cho một giá trị tính bằng {strong('lạng hoặc chỉ')}. Bạn
                không phải nhớ bảng nào; công cụ tự tra khi bạn nhập ngày giờ sinh.
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
                Chỉ có {strong('đúng bốn yếu tố này')} góp vào tổng, không có gì khác: không nơi sinh,
                không tên, không lá số nhiều tầng. Mỗi yếu tố tra một bảng cố định — 60 can–chi cho năm,
                12 tháng, 30 ngày âm, 12 canh giờ — rồi bốn giá trị cộng lại.
              </p>
              <p>
                Con số cụ thể của từng ô nằm trong các bảng truyền thống. Điều đáng nắm ở đây là biết{' '}
                {strong('bốn yếu tố nào')} tạo nên tổng, thay vì nhận một kết quả như “hộp đen”.
              </p>
            </>
          ),
        },
      ]}
    />

    <DepthTabs
      topicId="can-xuong"
      concept="Cách cộng bốn trọng lượng thành tổng rồi tra bài thơ"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Sau khi mỗi phần ngày sinh có một cân nặng nhỏ, bạn {strong('cộng cả bốn lại')} thành một
              con số lớn hơn. Con số tổng đó dắt bạn tới đúng một bài thơ. Giống như cộng điểm bốn môn
              thành một tổng, rồi xem tổng ấy ứng bài thơ nào. Chỉ con số cộng xong mới quan trọng, không
              phải từng phần lẻ.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Ba bước rất gọn. Một, tra bốn trọng lượng từ năm, tháng, ngày, giờ âm lịch. Hai,{' '}
                {strong('cộng cả bốn')} lại thành tổng “cân nặng xương”, thường rơi vào khoảng 2 lạng 1
                đến chừng 7 lạng 1. Ba, đối chiếu tổng ấy với đúng một bài thơ đã soạn sẵn.
              </p>
              <p>
                Theo quan niệm dân gian, tổng nặng thường ứng bài nghe “sang, thuận” hơn, tổng nhẹ ứng
                bài “vất vả” hơn — nhưng chỉ nên đọc như {strong('lời động viên')} thôi.
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
                Điểm cần nắm: thứ dùng để tra thơ là {strong('con số tổng')}, không phải từng trọng
                lượng riêng lẻ. Bốn giá trị cộng lại rơi vào một mức trong khoảng 2 lạng 1 đến chừng 7
                lạng 1, và mỗi mức tổng ứng đúng một bài thơ đã soạn sẵn.
              </p>
              <p>
                Toàn bộ chỗ “khó” của phương pháp chỉ là đổi ngày dương sang ngày âm rồi tra bốn bảng;
                phần còn lại là {strong('một phép cộng và một lần đối chiếu')}. Công cụ làm hết các bước
                này khi bạn nhập ngày giờ sinh âm lịch.
              </p>
            </>
          ),
        },
      ]}
    />

    <DepthTabs
      topicId="can-xuong"
      concept="Nguồn gốc Viên Thiên Cang — và vì sao bản văn định hình ở đời sau"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Người ta kể rằng cách cân xương này do một ông tên {strong('Viên Thiên Cang')} sống thời
              nhà Đường ngày xưa nghĩ ra. Gắn với tên một người nổi tiếng khiến nhiều người tin hơn.
              Nhưng thật ra các bảng số và bài thơ ta dùng bây giờ được nhiều người thêm thắt qua nhiều
              đời, chứ không phải một mình ông ấy viết ra hết.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Cân xương thường được gắn với {strong('Viên Thiên Cang')}, một nhà thiên văn và tướng số
                nổi tiếng đời Đường. Gắn tên một danh nhân đời Đường giúp phương pháp có “gốc gác” và sức
                thuyết phục trong dân gian.
              </p>
              <p>
                Nhưng bản văn phổ biến hôm nay — các bảng trọng lượng và bộ bài thơ —{' '}
                {strong('định hình ở đời sau')}, không hẳn nguyên vẹn từ thời ông. Nói cách khác, đây là
                một di sản văn hoá được bồi đắp qua nhiều đời.
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
                Cần phân biệt hai chuyện: cái tên gắn với phương pháp, và văn bản thực sự đang lưu hành.
                Viên Thiên Cang là danh nhân đời Đường, nhưng các bảng trọng lượng và bộ bài thơ như ta
                thấy ngày nay {strong('định hình ở đời sau')}, hơn là công thức nguyên vẹn của một tác giả
                duy nhất.
              </p>
              <p>
                Đó là đặc điểm của một văn bản dân gian được bồi đắp qua nhiều đời. Hiểu vậy rồi thì trân
                trọng cân xương vì {strong('sự mộc mạc và tinh thần động viên')} của nó, chứ không phải vì
                nó “chính xác”.
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
    prompt: 'Cân xương đoán số cộng “cân nặng xương” từ bốn yếu tố nào của ngày sinh?',
    answer: (
      <>
        Từ bốn yếu tố theo {strong('lịch âm')}: {strong('năm sinh (theo can–chi), tháng, ngày và giờ')}
        . Mỗi yếu tố được gán một trọng lượng (lạng / chỉ), cộng lại thành tổng “cân nặng xương”, rồi
        tra sang bài thơ đoán vận tương ứng.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Cân xương đoán số tính theo lịch nào?',
    choices: [
      { text: 'Lịch dương (dương lịch)', note: 'Không — cân xương tra theo can–chi nên dùng lịch âm.' },
      {
        text: 'Lịch âm (âm lịch)',
        correct: true,
        note: 'Đúng — cả 4 yếu tố năm–tháng–ngày–giờ đều tra theo lịch âm và can–chi.',
      },
      { text: 'Tùy người, âm hay dương đều được', note: 'Không — phương pháp gốc dựa trên can–chi âm lịch.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Vì sao rất nhiều người có cùng “cân nặng xương” và cùng một bài thơ?',
    choices: [
      {
        text: 'Vì cân xương chỉ dựa trên ngày–giờ sinh theo can chi nên rất thô, độ phân giải thấp',
        correct: true,
        note: 'Đúng — cùng năm–tháng–ngày–giờ can chi thì trùng tổng, nên hàng triệu người trùng bài thơ.',
      },
      { text: 'Vì bài thơ được chọn ngẫu nhiên mỗi lần tra', note: 'Không — mỗi tổng ứng cố định một bài thơ.' },
      { text: 'Vì công cụ bị lỗi tính toán', note: 'Không — đó là bản chất thô của phương pháp, không phải lỗi.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Tổng “cân nặng” nhẹ có nghĩa là “số khổ” không?',
    choices: [
      {
        text: 'Có — cân nhẹ chắc chắn là số vất vả cả đời',
        note: 'Không — đây chỉ là quan niệm dân gian mang tính động viên, không phải phán quyết số mệnh.',
      },
      {
        text: 'Không — đó chỉ là quan niệm dân gian; nên đọc bài thơ như lời động viên, không phải phán số mệnh',
        correct: true,
        note: 'Đúng — cân xương rất thô, không cá nhân hoá; “nặng/nhẹ” không quyết định đời ai.',
      },
      { text: 'Không rõ, còn tuỳ công cụ nào tính', note: 'Không — bản chất phương pháp là tham khảo, dù công cụ nào.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Vì sao cân xương không cá nhân hoá bằng Bát Tự hay Tử Vi, dù cùng dùng ngày giờ sinh?',
    answer: (
      <>
        Vì cân xương chỉ {strong('quy 4 yếu tố ngày sinh về một con số duy nhất')} (tổng cân nặng) rồi
        tra một bài thơ soạn sẵn — độ phân giải rất thấp. Còn Bát Tự và Tử Vi {strong('dựng cả lá số chi tiết')} (nhiều trụ, sao, tương tác) nên phân biệt được nhiều người hơn. Vì thế cân xương chỉ
        nên xem như giải trí và tham khảo.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Hai người cùng tổng lạng và cùng bài thơ, nhưng cuộc đời rất khác nhau — vì sao?',
    choices: [
      {
        text: 'Vì cân xương nén cả ngày giờ sinh về một con số, độ phân giải thấp nên không phân biệt được hai cuộc đời',
        correct: true,
        note: 'Đúng — phương pháp thô, không cá nhân hoá; cùng số không có nghĩa cùng một đời.',
      },
      { text: 'Vì chắc chắn một trong hai người đã nhập sai ngày sinh', note: 'Không — cùng dữ liệu vẫn ra cùng kết quả; trùng số là bình thường.' },
      { text: 'Vì công cụ chọn bài thơ ngẫu nhiên mỗi lần', note: 'Không — mỗi tổng ứng cố định một bài thơ, không ngẫu nhiên.' },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vì sao trang này chọn không in bảng số lạng cụ thể của từng năm / tháng / ngày / giờ? Đó có phải là giấu giếm không?',
    answer: (
      <>
        Không phải giấu. Các bảng cân xương {strong('lưu truyền với nhiều dị bản')}: in đúng một
        bản dễ khiến người đọc tưởng đó là “bản chuẩn” rồi tranh cãi “sai bảng”. Cách trung thực hơn
        là {strong('chọn một bản nhất quán và nói rõ mình chọn một bản')} — công cụ vẫn tính đầy đủ
        và cho bạn tổng cùng bài thơ, còn trang học thì giải thích cơ chế thay vì phát tán một bảng
        như thể nó là con số duy nhất đúng.
      </>
    ),
  },
];

export function CanXuongRecall() {
  return <ActiveRecall topicId="can-xuong" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được cân xương đoán số dùng để làm gì (một cái nhìn nhanh, mang tính động viên theo phong tục) — và nó KHÔNG hứa gì (không phán số mệnh).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả cách tính: gán trọng lượng (lạng/chỉ) cho năm–tháng–ngày–giờ âm lịch → cộng lại thành tổng “cân nặng xương” → tra bài thơ tương ứng.',
  },
  {
    id: 'walkthrough',
    facet: 'Đi một vòng',
    can: 'Đi được một vòng ví dụ ở mức khung: từ ngày giờ sinh âm lịch → tra 4 trọng lượng → cộng thành tổng → ra bài thơ tương ứng, mà không cần nhớ con số cụ thể.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể được đúng 4 yếu tố góp trọng lượng: năm (can–chi), tháng, ngày, giờ — tất cả theo lịch âm.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được cân xương khác Bát Tự / Tử Vi ở chỗ nào: cân xương rất thô, chỉ ra một con số; Bát Tự / Tử Vi dựng lá số chi tiết.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra vì sao hàng triệu người trùng “cân nặng” và trùng bài thơ — độ phân giải thấp, không cá nhân hoá.',
  },
  {
    id: 'variants',
    facet: 'Dị bản',
    can: 'Nói được vì sao cân xương có nhiều dị bản (bảng số, thậm chí tách thơ nam – nữ) và vì sao công cụ chọn một bản nhất quán rồi nói rõ, thay vì coi một bảng là “bản chuẩn duy nhất”.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “cân nhẹ” KHÔNG = “số khổ”, và vì sao nên đọc bài thơ như lời động viên chứ không tin tuyệt đối.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân “cân xương đoán số là gì và nên hiểu ra sao” bằng lời của bạn, giữ giọng tham khảo.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (vd nguồn gốc Viên Thiên Cang, cách tra bảng can–chi) bạn vẫn còn thấy mơ hồ.',
  },
];

export function CanXuongChecklist() {
  return <UnderstandingChecklist topicId="can-xuong" facets={FACETS} />;
}

export function CanXuongWhys() {
  return (
    <FiveWhys
      topicId="can-xuong"
      start={
        <>
          Một người cân xương ra tổng “nhẹ”, đọc bài thơ nghe vất vả, liền buồn lo cho rằng cả đời mình
          sẽ long đong, kém may mắn.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy tổng “nhẹ” rồi buồn lo cả đời lại là phản ứng chưa hợp lý?',
          because: <>Vì “cân nhẹ” {strong('không')} có nghĩa là số khổ — đó chỉ là quan niệm dân gian.</>,
        },
        {
          question: 'Vì sao “cân nặng nhẹ” không quyết định được số phận một người?',
          because: (
            <>
              Vì cân xương {strong('chỉ dựa trên ngày–giờ sinh theo can chi')}, quy tất cả về một con số
              duy nhất — độ phân giải rất thấp.
            </>
          ),
        },
        {
          question: 'Vì sao độ phân giải thấp lại khiến kết quả không đáng để phán số mệnh?',
          because: (
            <>
              Vì {strong('hàng triệu người trùng “cân nặng”')} và trùng bài thơ — một bài thơ dùng chung
              cho vô số người thì không thể là phán quyết riêng cho ai.
            </>
          ),
        },
        {
          question: 'Vì sao cân xương lại thô hơn nhiều so với Bát Tự hay Tử Vi?',
          because: (
            <>
              Vì Bát Tự và Tử Vi {strong('dựng cả lá số chi tiết')} (nhiều trụ, nhiều sao, tương tác),
              còn cân xương chỉ cộng 4 trọng lượng thành một tổng rồi tra thơ.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc kết quả cân xương?',
          because: (
            <>
              Vì hiểu bản chất rồi thì nên xem cân xương như {strong('giải trí và tham khảo')} — đọc bài
              thơ như một lời động viên tích cực, không tin tuyệt đối, không để nó định đoạt tâm trạng.
            </>
          ),
        },
      ]}
      root={
        <>
          Cân xương đoán số là một nét văn hoá dân gian thú vị để có một bài thơ đọc cho vui, không phải
          bản án. Cân nặng hay nhẹ đều không quyết định đời ai — hãy dùng nó như một góc nhìn nhẹ nhàng,{' '}
          {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
