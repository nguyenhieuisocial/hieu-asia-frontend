/**
 * Nội dung "học chủ động" cho trang /learn/nhip-song.
 *
 * NGUỒN GROUNDING DUY NHẤT: app/ban-do/page.tsx (đọc trực tiếp). Trang đó không
 * export hằng nào — `QUARTERS` và hai hàm định dạng ngày đều là const nội bộ —
 * nên KHÔNG import được. Vì vậy hình dạng của công cụ được mô tả MỘT LẦN ở file
 * này (`BAN_DO_TRACKS`) rồi page.tsx import lại; hai file không bao giờ lệch số
 * với nhau, và mọi con số hiển thị đều suy từ `.length` chứ không gõ tay.
 *
 * CÔNG CỤ /ban-do THẬT SỰ LÀM GÌ (đọc code, không đoán): render 4 khối nhịp cố
 * định (Hôm nay · Tuần này · Tháng này · Năm nay); tính đúng HAI mốc thời gian
 * lúc mở trang, cả hai qua Intl với timeZone 'Asia/Ho_Chi_Minh' — ngày hôm nay
 * và ngày cuối tháng hiện tại (`dynamic = 'force-dynamic'` nên luôn tươi). Mọi
 * dòng khuyên khác là chữ cố định trong mã nguồn, giống nhau với mọi người xem:
 * trang không nhận ngày giờ sinh, không đọc lá số, không gọi API, và tự dán nhãn
 * "nội dung minh hoạ — chưa kết nối lá số của bạn".
 *
 * KHÔNG DẠY ở đây (vì công cụ không tính): cách chấm một giai đoạn tốt hay xấu
 * dựa trên dữ liệu của người dùng.
 *
 * PHẠM VI (chống trùng): chu kỳ 10 năm → /learn/dai-van; chồng lớp năm lên vận
 * → /learn/luu-nien; mốc chuyển tiết → /learn/tiet-khi; chọn ngày giờ cho một
 * việc → /learn/trach-cat. Ở đây chỉ nhắc tên, không dạy lại. Giọng: nhịp là
 * công cụ TỔ CHỨC CÔNG VIỆC — không doạ, không phán số mệnh, không chê người
 * đọc đã từng hoãn việc.
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

// ── Hình dạng của công cụ /ban-do — một nguồn cho cả hai file ────────

export interface BanDoTrack {
  /** Tên khối đúng như trên trang. */
  khoi: string;
  /** Thứ được TÍNH lúc mở trang; null = khối này không tính gì. */
  tinh: string | null;
  /** Các trường chữ cố định trong khối. */
  coDinh: string[];
}

export const BAN_DO_TRACKS: BanDoTrack[] = [
  {
    khoi: 'Hôm nay',
    tinh: 'Thứ và ngày dương lịch của hôm nay, theo múi giờ Việt Nam',
    coDinh: ['gợi ý ngắn', 'việc nên tập trung', 'việc nên tránh', 'một câu hỏi cuối ngày'],
  },
  {
    khoi: 'Tuần này',
    tinh: null,
    coDinh: ['chủ đề tuần', 'hành động chính', 'cuộc trò chuyện nên có', 'rủi ro cần quản trị'],
  },
  {
    khoi: 'Tháng này',
    tinh: 'Ngày cuối cùng của tháng hiện tại, để bạn đặt lịch ngồi nhìn lại tháng',
    coDinh: ['mục tiêu tháng', 'năng lượng sự nghiệp', 'năng lượng tài chính', 'quan hệ'],
  },
  {
    khoi: 'Năm nay',
    tinh: null,
    coDinh: [
      // Đúng nhãn trên trang là "chủ đề lưu niên" — giữ nguyên chữ ấy, vì đó
      // chính là chỗ dễ nhầm nhất (lưu niên vốn là lớp vận tính từ lá số, còn
      // dòng này chỉ là chữ cố định). Đổi thành "chủ đề của năm" là làm nhẹ đi
      // đúng chỗ bài cần chỉ ra.
      'chủ đề lưu niên',
      'bốn ô quý, mỗi ô một nhãn kèm một dòng ghi chú',
      'các quyết định lớn nên chuẩn bị',
    ],
  },
];

/** Số khối nhịp trang chia sẵn. */
export const TRACK_COUNT = BAN_DO_TRACKS.length;
/** Số khối có chứa thứ được tính thật lúc mở trang. */
export const COMPUTED_COUNT = BAN_DO_TRACKS.filter((t) => t.tinh !== null).length;
/** Tên các khối + các cơ chế của nhịp — nhắc lại trong lời văn mà không gõ tay. */
const TRACK_NAMES = BAN_DO_TRACKS.map((t) => t.khoi.toLowerCase()).join(', ');
const MECHANISMS = ['điểm dừng', 'hạn', 'gom việc cùng loại', 'căn cứ để từ chối'];

export function NhipFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn có một việc lớn đã chuẩn bị gần xong, rồi mở một trang xem giai đoạn và thấy dòng chữ{' '}
          {strong('“giai đoạn này nên cẩn trọng”')}. Thế là hoãn. Vài tháng sau việc đó ra kết quả
          kém hơn kỳ vọng, và bạn kết luận rằng dòng chữ kia đã đúng.
        </>
      }
      why={
        <>
          Vì trong chuỗi sự kiện ấy có một mắt xích không ai ghi vào sổ:{' '}
          {strong('chính quyết định hoãn')}. Hoãn không miễn phí — nó ăn vào đà, vào cửa sổ thời
          gian, vào tiền dự phòng. Không tách được mắt xích này thì bạn sẽ lặp lại vòng đó mỗi năm.
        </>
      }
      what={
        <>
          Chia nhịp là cắt dòng thời gian thành những đoạn có đầu có cuối — {strong('tuần')},{' '}
          {strong('tháng')}, {strong('quý')} — rồi gắn cho mỗi đoạn một việc và một buổi nhìn lại.
          Đây là chuyện tổ chức công việc, không cần bất kỳ hệ tra cứu nào mới có.
        </>
      }
      how={
        <>
          Viết ra các ràng buộc cứng có thật trước, đánh dấu giai đoạn còn dung lượng bằng những thứ{' '}
          {strong('đếm được')} (giờ trống, tiền dự phòng, người đỡ việc), rồi đặt đúng một việc lớn
          vào một giai đoạn kèm mốc nhìn lại. Bản đồ chỉ là chỗ ghi những thứ đó xuống.
        </>
      }
      soWhat={
        <>
          Để bạn dùng nhịp theo chiều {strong('đặt việc xuống')} chứ không phải chiều{' '}
          {strong('chờ một giai đoạn đẹp')} — và để khi cầm bất kỳ lời khuyên theo giai đoạn nào,
          bạn hỏi được câu quan trọng nhất: lời này có thể sai không, và sai thì nhìn ra bằng gì?
        </>
      }
    />
  );
}

export function NhipDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="nhip-song"
        concept="Nhịp lập kế hoạch là gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Một cái bánh dài rất khó ăn hết trong một lần. Nhưng cắt thành từng khoanh thì mỗi
                lần ăn một khoanh là được. {strong('Chia nhịp')} là cắt thời gian thành từng khoanh
                như vậy, để mỗi khoanh mình làm xong một việc.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Ba khoanh quen nhất là {strong('tuần')}, {strong('tháng')} và {strong('quý')} — ba
                  tháng một. Chúng không phải do ai nghĩ ra cho vui: lịch học và lịch làm chạy theo
                  tuần, tiền lương và hoá đơn chạy theo tháng, còn mùa vụ và các kỳ tổng kết chạy
                  theo quý.
                </p>
                <p>
                  Mỗi khoanh có hai thứ: một việc chính để làm, và một buổi cuối khoanh để nhìn lại
                  xem xong tới đâu. Chỉ vậy thôi. {strong('Không cần bói toán gì cả')} — một cuốn sổ
                  giấy làm được đúng việc này.
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
                  Giá trị của nhịp đến từ {MECHANISMS.length} cơ chế rời nhau:{' '}
                  {strong(MECHANISMS.join(' · '))}. Điểm dừng buộc bạn hỏi “việc này còn đáng làm
                  không” trước khi đổ thêm nguồn lực; hạn chặn việc trôi vô hạn; gom việc giảm số lần
                  phải khởi động lại đầu óc; còn căn cứ để từ chối biến “tôi không muốn” thành “tuần
                  này đã đầy”. Cần nói rõ mức độ chắc chắn: đây là{' '}
                  {strong('kinh nghiệm tổ chức công việc')}, viết ra để bạn thử và tự kiểm bằng lịch
                  của mình, không phải quy luật nghiệm đúng với mọi ngành — ngành có mùa vụ riêng thì
                  cắt nhịp theo mùa vụ ấy.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="nhip-song"
        concept="Bản đồ /ban-do đang tính gì cho bạn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trang đó giống một tờ giấy đã kẻ sẵn {TRACK_COUNT} ô: {TRACK_NAMES}. Máy{' '}
                {strong('điền sẵn ngày tháng')} cho đúng, còn chữ trong ô là chữ mẫu — muốn thành
                của bạn thì {strong('bạn tự viết vào sổ của mình')}, vì tờ giấy này chỉ để nhìn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Trang chia sẵn {TRACK_COUNT} khối: {TRACK_NAMES}. Trong {TRACK_COUNT} khối đó, chỉ
                  có {COMPUTED_COUNT} thứ được máy tính ra lúc bạn mở trang — hôm nay là thứ mấy ngày
                  mấy theo giờ Việt Nam, và ngày cuối tháng này để bạn đặt lịch ngồi nhìn lại tháng.
                </p>
                <p>
                  Mọi dòng khuyên còn lại là {strong('chữ mẫu cố định')}: ai mở trang cũng thấy đúng
                  những dòng ấy. Trang không hỏi ngày giờ sinh và không đọc lá số của bạn, nên nó
                  cũng tự ghi ngay đầu trang rằng đây là nội dung minh hoạ.
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
                  Đọc mã nguồn thì hai mốc ngày ấy đi qua bộ định dạng theo múi giờ{' '}
                  {strong('Asia/Ho_Chi_Minh')}, và trang được đánh dấu render động nên mốc luôn tươi
                  chứ không bị đóng băng lúc build. Đó là toàn bộ phần tính toán —{' '}
                  {strong('không có tham số nào của người dùng đi vào trang')}.
                </p>
                <p>
                  Hệ quả cho cách đọc: các nhãn giai đoạn trên trang{' '}
                  {strong('không đến từ dữ liệu của bạn')}, nên chúng chưa đủ tư cách làm căn cứ dời
                  một quyết định có tiền và người ở trong đó. Bài này cố ý không dạy cách “giải” các
                  nhãn ấy, vì công cụ không tính phần đó — dạy sẽ là gán cho công cụ thứ nó không
                  làm.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="nhip-song"
        concept="Vì sao hoãn theo nhãn giai đoạn lại tự làm hỏng kết quả"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bạn đã xếp xong đồ để đi chơi, rồi có người bảo “hôm nay chưa hợp”. Bạn tháo đồ ra.
                Hôm sau xếp lại thì {strong('mệt hơn')} và thiếu vài món. Chuyến đi kém vui — nhưng
                lý do là việc tháo đồ ra, chứ không phải hôm qua xấu.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Hoãn một việc lớn không phải hành động trung tính. Bạn mất đà, mất cửa sổ thời gian
                  mà khách đang cần, trong khi tiền thuê và chi phí cố định vẫn chạy. Người định làm
                  cùng bạn có thể nhận việc khác. Khi quay lại, bạn có{' '}
                  {strong('ít dự phòng hơn lúc đầu')}.
                </p>
                <p>
                  Rồi kết quả kém xuất hiện sau lời cảnh báo, nên nó bị đọc như bằng chứng rằng lời
                  cảnh báo đã đúng. Nhưng giữa hai sự kiện có một sự kiện thứ ba:{' '}
                  {strong('chính quyết định hoãn')}.
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
                  Đây là một vòng tự xác nhận: lời khuyên đổi hành vi, hành vi tạo kết quả, kết quả
                  được đọc ngược lại như bằng chứng cho lời khuyên. Vòng này{' '}
                  {strong('không thể sai')} theo cách người ta thường kiểm — vì trường hợp đối chứng,
                  tức bạn vẫn làm, đã bị chính quyết định hoãn xoá đi.
                </p>
                <p>
                  Cách thoát khỏi vòng: viết trước dự đoán kèm{' '}
                  {strong('điều kiện coi là sai')} và một mốc thời gian, rồi mở ra đối chiếu đúng
                  hạn. Và trước mỗi lần định hoãn, hỏi câu ngược: nếu không biết bản đồ nói gì, hôm
                  nay tôi có làm việc này không?
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
    prompt: 'Trang bản đồ nhịp thật sự tính gì cho bạn, và phần nào không phải kết quả tính?',
    answer: (
      <>
        Trang chia sẵn {TRACK_COUNT} khối ({TRACK_NAMES}) và tính đúng {COMPUTED_COUNT} thứ lúc bạn
        mở: ngày hôm nay theo múi giờ Việt Nam, và ngày cuối tháng hiện tại để đặt lịch nhìn lại.
        Phần chữ khuyên còn lại là {strong('bản mẫu cố định')} — giống nhau với mọi người xem, vì
        trang không nhận ngày giờ sinh và không đọc lá số nào.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Vì sao chia nhịp tuần – tháng – quý lại giúp làm được việc hơn?',
    choices: [
      {
        text: `Vì nó tạo điểm dừng để nhìn lại, tạo hạn cho việc, gom việc cùng loại và cho bạn căn cứ để từ chối — ${MECHANISMS.length} cơ chế tổ chức công việc`,
        correct: true,
        note: 'Đúng — không cơ chế nào trong đó cần tới một hệ tra cứu; một cuốn sổ giấy làm được.',
      },
      {
        text: 'Vì mỗi giai đoạn mang một loại năng lượng khác nhau, làm đúng giai đoạn thì việc dễ thành',
        note: 'Đây là cách nói của dự báo, không phải của lập kế hoạch. Không có phép đo nào cho “năng lượng giai đoạn”, và công cụ trên hieu.asia cũng không tính đại lượng đó.',
      },
      {
        text: 'Vì bảng biểu càng chi tiết thì càng làm được nhiều việc',
        note: 'Ngược lại là đằng khác. Chia nhịp quá dày khiến bạn dành phần lớn thời gian quản lý cái bảng thay vì làm việc.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt:
      'Bạn đã chuẩn bị xong việc mở một lớp học vào tháng sau, nhưng bản đồ gắn nhãn cẩn trọng cho giai đoạn đó. Nên làm gì?',
    choices: [
      {
        text: 'Cứ làm, và quyết định bằng lịch thật: giờ trống, tiền dự phòng, người đỡ việc, hạn cứng bên ngoài',
        correct: true,
        note: 'Đúng. Nhãn ấy không đến từ dữ liệu của bạn, còn bốn thứ kia thì đếm được và trực tiếp quyết định việc có chạy nổi hay không.',
      },
      {
        text: 'Hoãn sang giai đoạn được gắn nhãn thuận lợi cho chắc',
        note: 'Hoãn không miễn phí: mất đà, mất cửa sổ tuyển sinh, chi phí cố định vẫn chạy, người đồng hành có thể đi. Nếu sau đó kết quả kém, nguyên nhân đo được nằm ở việc hoãn.',
      },
      {
        text: 'Vẫn mở nhưng nhờ người khác đứng tên để tránh giai đoạn xấu',
        note: 'Đổi tên người không đổi được giờ trống, tiền dự phòng hay nhu cầu của học viên — tức không đổi được thứ gì thật sự quyết định kết quả.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Một “gợi ý nhịp” khác một “lời dự báo” ở đầu vào và ở cái giá khi sai thế nào?',
    answer: (
      <>
        Gợi ý nhịp lấy đầu vào từ {strong('lịch có thật của bạn')} — giờ trống, tiền dự phòng, người
        đỡ việc, hạn cứng — và nói bạn đặt việc xuống lúc nào; sai thì dời một khối lịch, chi phí nhỏ
        và sửa ngay được. Lời dự báo nói về chuyện sẽ xảy ra, đầu vào bạn không kiểm được, sai thì
        cái giá là {strong('một mùa hoặc một năm đã hoãn')}. Phép thử: lời ấy có thể sai không?
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt:
      'Một người hoãn việc vì đọc thấy giai đoạn không thuận, sau đó kết quả kém thật. Kết luận nào đúng?',
    choices: [
      {
        text: 'Chưa kết luận được lời kia đúng, vì giữa lời cảnh báo và kết quả có quyết định hoãn của chính người ấy',
        correct: true,
        note: 'Đúng — và trường hợp đối chứng, tức nếu vẫn làm, đã bị chính quyết định hoãn xoá đi nên không còn gì để so.',
      },
      {
        text: 'Lời kia đã đúng, vì kết quả kém xảy ra đúng như cảnh báo',
        note: 'Đây chính là cái bẫy của bài. Kết quả xảy ra sau một lời không có nghĩa là do lời đó — ở đây có một nguyên nhân đo được nằm giữa: việc hoãn.',
      },
      {
        text: 'Không kết luận được gì cả, mọi thứ đều ngẫu nhiên',
        note: 'Cũng không đúng. Chi phí của việc hoãn là thứ đo được: mất đà, cửa sổ thời gian hẹp lại, chi phí cố định vẫn chạy.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt: 'Bạn đo “giai đoạn này tôi có thật sự rảnh không” bằng những thứ nào?',
    answer: (
      <>
        Bằng bốn thứ đếm được: số khối giờ trống liền mạch mỗi tuần sau khi trừ việc bắt buộc; số
        tháng còn trả nổi chi phí cố định nếu việc chậm gấp đôi dự kiến; {strong('tên cụ thể')} của
        người nhận bàn giao khi bạn kẹt; và hạn cứng bên ngoài không thể dời (mùa vụ, kỳ tuyển sinh,
        hạn hợp đồng, lịch gia đình). Bốn ô đều trống thì giai đoạn đó không rảnh.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'open',
    prompt: 'Vận dụng: một quý còn trống, hai việc lớn đều muốn làm. Xử lý thế nào?',
    answer: (
      <>
        Chọn {strong('một')}. Việc lớn thứ hai đặt vào cùng một quý gần như luôn ăn vào phần dự phòng
        của việc thứ nhất, kết cục là cả hai cùng chậm. Đặt việc quan trọng hơn vào quý đó kèm mốc
        nhìn lại và điều kiện dừng viết sẵn; việc còn lại ghi vào quý sau, kèm lý do phải chờ.
      </>
    ),
  },
];

export function NhipRecall() {
  return <ActiveRecall topicId="nhip-song" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói được chia nhịp là cắt thời gian thành các đoạn có đầu có cuối, mỗi đoạn gắn một việc và một buổi nhìn lại — và rằng việc này không cần tới bất kỳ hệ tra cứu nào.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Kể được vì sao có nhịp thì làm được việc hơn: nhịp tạo điểm dừng, tạo hạn, gom việc cùng loại, và cho bạn một câu từ chối có căn cứ.',
  },
  {
    id: 'tool-scope',
    facet: 'Công cụ tính gì',
    can: `Nói đúng rằng trang bản đồ chia ${TRACK_COUNT} khối nhưng chỉ tính ${COMPUTED_COUNT} mốc ngày, còn phần chữ khuyên là bản mẫu cố định giống nhau với mọi người.`,
  },
  {
    id: 'capacity',
    facet: 'Đo dung lượng',
    can: 'Trả lời được câu “giai đoạn này tôi có rảnh không” bằng bốn thứ đếm được: giờ trống liền mạch mỗi tuần, tiền dự phòng, tên người đỡ việc, và các hạn cứng bên ngoài không dời được.',
  },
  {
    id: 'placement',
    facet: 'Đặt việc',
    can: 'Chạy được quy trình bốn bước: vẽ ràng buộc cứng trước, đánh dấu giai đoạn còn dung lượng, đặt MỘT việc lớn vào MỘT giai đoạn, và viết sẵn mốc nhìn lại kèm điều kiện dừng. Khi bản đồ và lịch thật mâu thuẫn thì lịch thật thắng.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Phân biệt được một gợi ý nhịp với một lời dự báo qua đầu vào, qua cái giá phải trả khi sai, và dùng được phép thử “lời này có thể sai không, sai thì nhìn ra bằng gì”.',
  },
  {
    id: 'reverse-cause',
    facet: 'Nguyên nhân ngược',
    can: 'Chỉ ra được rằng nếu hoãn việc vì một nhãn giai đoạn thì chính việc hoãn là nguyên nhân đo được của kết quả kém sau đó, và gọi tên được các chi phí cụ thể của việc hoãn.',
  },
  {
    id: 'limits',
    facet: 'Giới hạn của chính bài',
    can: 'Thừa nhận nhịp không tạo thêm giờ, tiền hay người; chia nhịp quá dày thì phản tác dụng; và những gì bài này nói là kinh nghiệm tổ chức, không phải quy luật đúng với mọi ngành.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho một người bạn trong một phút: nhịp dùng để đặt việc xuống chứ không để chờ, và vì sao hoãn theo nhãn giai đoạn lại tự tạo ra kết quả mà người ta tưởng là ứng nghiệm.',
  },
];

export function NhipChecklist() {
  return <UnderstandingChecklist topicId="nhip-song" facets={FACETS} />;
}

export function NhipWhys() {
  return (
    <FiveWhys
      topicId="nhip-song"
      start={
        <>
          Một người đã chuẩn bị xong để mở lớp dạy thêm vào quý tới: phòng đã thuê, học viên đã hỏi,
          người phụ đã hẹn. Mở bản đồ thấy quý đó mang nhãn cẩn trọng, người ấy dời sang quý sau. Ba
          tháng sau lớp mở ra, tuyển được ít hơn hẳn dự kiến.
        </>
      }
      chain={[
        {
          question: 'Vì sao người ấy dời lịch mở lớp?',
          because: (
            <>
              Vì đọc nhãn của giai đoạn như một {strong('lời nói về kết quả')} — hiểu rằng làm vào
              quý đó thì dễ hỏng. Trong khi thứ nhãn ấy có thể nói, nhiều nhất, chỉ là một gợi ý về
              cách sắp việc.
            </>
          ),
        },
        {
          question: 'Vì sao một nhãn như vậy lại trông giống lời nói về kết quả?',
          because: (
            <>
              Vì nó dùng ngôn ngữ của kết quả — thuận lợi, cẩn trọng — trong khi đầu vào của nó lúc
              này chỉ là {strong('chữ mẫu cố định')}. Trang có ghi rõ rằng nội dung đang là minh hoạ
              và chưa nối với lá số của ai, nhưng dòng chữ ấy nhỏ hơn và nằm cạnh phần trông như kết
              luận.
            </>
          ),
        },
        {
          question: 'Vì sao chữ mẫu ấy vẫn khiến người đọc thấy đúng với mình?',
          because: (
            <>
              Vì lời được viết đủ rộng để {strong('giai đoạn nào cũng khớp')}: ai cũng có lúc nên cẩn
              trọng, ai cũng có việc nên tập trung. Cơ chế này đã có tên và có bài riêng trên
              hieu.asia.
            </>
          ),
        },
        {
          question: 'Vì sao sau khi hoãn, kết quả lại kém đi thật?',
          because: (
            <>
              Vì hoãn có chi phí đếm được: qua mất cửa sổ đầu năm học lúc phụ huynh đang tìm lớp, học
              viên đã hỏi thì đi nơi khác, tiền thuê phòng vẫn chạy khi chưa có thu, người phụ nhận
              việc khác. {strong('Kém đi là hệ quả của việc hoãn')}, không phải của giai đoạn.
            </>
          ),
        },
        {
          question: 'Vậy vì sao người ấy vẫn tin rằng nhãn kia đã đúng?',
          because: (
            <>
              Vì kết quả kém xuất hiện {strong('sau')} lời cảnh báo, nên nó được đọc như bằng chứng.
              Trường hợp đối chứng — nếu vẫn mở đúng quý đầu — đã bị chính quyết định hoãn xoá đi,
              nên không còn gì để so. Một vòng như vậy không bao giờ báo sai, và cũng vì thế nó không
              mang thông tin nào cho lần quyết định sau.
            </>
          ),
        },
      ]}
      root={
        <>
          Nhịp dùng để {strong('đặt việc xuống')}, không dùng để chờ. Khi bạn đổi hành vi vì một nhãn
          giai đoạn, kết quả sau đó đo hành vi của bạn chứ không đo nhãn. Giữ khung tuần – tháng –
          quý vì nó giúp bạn nhớ dừng lại và nhớ đặt hạn; nhưng quyết định làm hay không thì để cho
          giờ trống, tiền dự phòng và những hạn cứng có thật lên tiếng.
        </>
      }
    />
  );
}
