/**
 * Nội dung "học chủ động" cho trang /learn/nhat-van — bài CHÍNH THỨC về
 * "tử vi hôm nay theo con giáp".
 *
 * GROUNDING — mọi con số trên file này đều SUY TẠI RUNTIME, không gõ tay:
 *   • lib/gio-hoang-dao.ts — BRANCHES (12 địa chi, cũng chính là 12 con giáp và
 *     12 canh giờ) và dayCanChi(dd, mm, yy) (can chi NGÀY suy từ số ngày Julian).
 *     Số nhóm lấy từ BRANCHES.length; chu kỳ lặp của can chi ngày do quét chính
 *     dayCanChi mà ra.
 *   • app/tu-vi-hom-nay/page.tsx + [zodiac]/page.tsx — công cụ đích: chọn bản
 *     bằng ĐÚNG MỘT dữ kiện là con giáp; không có ô nhập ngày/giờ/nơi sinh ở
 *     phần dự báo con giáp; lá số thật nằm ở khối riêng bên dưới.
 *
 * PHẠM VI: KHÔNG dạy lại cấu tạo vòng can chi (bài /learn/can-chi), KHÔNG dạy
 * lại hiệu ứng Barnum ở mức chi tiết (bài /learn/barnum), KHÔNG dạy chấm ngày
 * (bài /learn/trach-cat) hay giờ trong ngày (bài /learn/gio-hoang-dao) hay vận
 * năm (bài /learn/luu-nien). Bài này chỉ nói MỘT chuyện: độ mịn.
 *
 * Giọng: không hù doạ, không mỉa mai người đọc, không phán số mệnh. Kết luận là
 * "đọc như lời nhắc để tự vấn", không phải "đừng đọc nữa".
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
import { BRANCHES, dayCanChi } from '@/lib/gio-hoang-dao';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Hiển thị số theo kiểu Việt ───────────────────────────────────────
// Dấu PHẨY cho thập phân, dấu CHẤM cho hàng nghìn — ngược với cách JS in số.
// Xem chú thích cùng tên ở page.tsx: in thẳng 8.333 ra sẽ bị đọc thành tám nghìn.

function viNum(n: number, digits = 1): string {
  let s = n.toFixed(digits);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s.replace('.', ',');
}

function viInt(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 8333333 → "8,3 triệu"; 694444 → "694 nghìn". */
function people(n: number): string {
  if (n >= 1_000_000) return `${viNum(n / 1_000_000, 1)} triệu`;
  return `${viInt(n / 1000)} nghìn`;
}

// ── Suy dữ kiện từ lib (không gõ tay con số nào) ─────────────────────

/** Số nhóm mà lớp dự báo theo con giáp chia dân số ra = số địa chi. */
const GROUP_COUNT = BRANCHES.length;

/** Số canh giờ trong ngày — cùng bộ 12 địa chi. */
const HOUR_SLOTS = BRANCHES.length;

/** Dân số Việt Nam, LÀM TRÒN. Số ngoài, không lib nào suy ra được. */
const VN_POPULATION = 100_000_000;

/** Số ngày trong năm, làm tròn — dùng để đếm số ô, không phải để tính lịch. */
const DAYS_IN_YEAR = 365;

/** Cùng một năm sinh: thêm ngày và giờ sinh thì số ô mịn lên bấy nhiêu lần. */
const FINER_TIMES = DAYS_IN_YEAR * HOUR_SLOTS;

const PER_GROUP = people(VN_POPULATION / GROUP_COUNT);

/** Ngày VÍ DỤ cố định — KHÔNG phải hôm nay, và cố ý không phải hôm nay. */
const EXAMPLE_DAY = { d: 1, m: 1, y: 2026 } as const;
const EXAMPLE_DAY_LABEL = `${EXAMPLE_DAY.d}/${EXAMPLE_DAY.m}/${EXAMPLE_DAY.y}`;

function dayLabelAt(offset: number): string {
  const t = Date.UTC(EXAMPLE_DAY.y, EXAMPLE_DAY.m - 1, EXAMPLE_DAY.d) + offset * 86_400_000;
  const dt = new Date(t);
  return dayCanChi(dt.getUTCDate(), dt.getUTCMonth() + 1, dt.getUTCFullYear()).label;
}

/** Chu kỳ lặp của can chi NGÀY, đo bằng cách quét chính dayCanChi(). */
const DAY_CYCLE = (() => {
  const first = dayLabelAt(0);
  for (let k = 1; k <= 200; k += 1) if (dayLabelAt(k) === first) return k;
  return 0;
})();

const EXAMPLE_DAY_CANCHI = dayLabelAt(0);
const NEXT_DAY_CANCHI = dayLabelAt(1);

/** Một con giáp lấy từ chính BRANCHES để làm nhân vật ví dụ. */
const EX_BRANCH = BRANCHES[8];

export function NhatVanFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Mỗi sáng bạn mở điện thoại và đọc một dòng kiểu {strong('“hôm nay tuổi bạn nên cẩn thận”')}.
          Nó thường nghe hợp lý, đôi khi nghe trúng đến mức khó chịu. Nhưng không ai nói cho bạn biết
          dòng ấy được viết cho bao nhiêu người.
        </>
      }
      why={
        <>
          Vì đây là {strong('lớp tra cứu phổ biến nhất')} — thứ hàng triệu người đọc mỗi ngày, và
          cũng là lớp {strong('thô nhất')}. Không biết độ thô của nó thì rất dễ trao cho nó quyền
          quyết định những việc mà nó không có cách nào biết.
        </>
      }
      what={
        <>
          Bản dự báo theo con giáp được chọn bằng {strong('đúng một dữ kiện')}: con giáp của bạn. Cả
          nước vì thế được chia thành đúng {GROUP_COUNT} nhóm, trung bình mỗi nhóm khoảng{' '}
          {strong(PER_GROUP + ' người')} cùng đọc một bản trong cùng một ngày.
        </>
      }
      how={
        <>
          Đo độ mịn bằng cách đếm số ô. Lớp con giáp: {GROUP_COUNT} ô cho cả nước. Lá số cá nhân dùng
          đủ giờ – ngày – tháng – năm: chỉ riêng trong một năm sinh nó đã tách thành khoảng{' '}
          {strong(viInt(FINER_TIMES) + ' ô')}. Cùng một thước đo, hai bậc khác hẳn nhau.
        </>
      }
      soWhat={
        <>
          Để bạn vẫn đọc nếu thích, nhưng đọc như {strong('một lời nhắc để tự vấn')} chứ không phải
          một dự báo để tuân theo: không hoãn việc thật, không dời lịch khám, không đổi quyết định
          tiền bạc vì một dòng chữ viết cho hàng triệu người.
        </>
      }
    />
  );
}

export function NhatVanDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="nhat-van"
        concept="Vì sao gọi đây là lớp thô nhất"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tưởng tượng cả trường có {GROUP_COUNT} cái hộp thư, và mỗi bạn được xếp vào một hộp
                theo con vật của năm sinh. Sáng nào cô cũng bỏ vào mỗi hộp {strong('một tờ giấy')} —
                ai chung hộp thì nhận đúng tờ giống nhau.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Công cụ chỉ hỏi bạn {strong('một điều')}: con giáp. Vậy nên cả nước chỉ có{' '}
                  {GROUP_COUNT} bản dự báo mỗi ngày. Lấy con số làm tròn{' '}
                  {people(VN_POPULATION)} người mà chia đều thì mỗi bản dành cho khoảng{' '}
                  {PER_GROUP} người.
                </p>
                <p>
                  Điều đó không có nghĩa bản ấy được viết ẩu. Nó chỉ có nghĩa là{' '}
                  {strong('bản ấy không thể biết gì riêng về bạn')} — không biết bạn làm nghề gì,
                  đang lo chuyện gì, hôm nay có hẹn với ai.
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
                  Nói theo kiểu hàm số: đầu vào là một biến rời rạc có {GROUP_COUNT} giá trị, nên tập
                  đầu ra cũng có tối đa {GROUP_COUNT} phần tử trong một ngày. Mọi thông tin phụ thuộc
                  vào biến khác — nghề nghiệp, sức khoẻ, lịch làm việc — đều{' '}
                  {strong('không thể xuất hiện ở đầu ra')}. Đây là chặn trên, không phải nhận xét về
                  chất lượng người viết.
                </p>
                <p>
                  Hệ quả kiểm được ngay: hai người cùng con giáp, khác nhau mọi thứ còn lại, luôn
                  nhận đúng một bản. Nếu bạn thấy bản ấy nói trúng chuyện riêng, phần trúng đến từ
                  phía người đọc chứ không từ phép chia.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="nhat-van"
        concept="Đo độ mịn: con giáp so với lá số cá nhân"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Một cái rổ to đựng chung tất cả các bạn sinh cùng năm. Nếu xếp thêm theo{' '}
                {strong('ngày sinh')} rồi theo {strong('giờ sinh')} thì cái rổ ấy vỡ ra thành rất
                nhiều rổ nhỏ — mỗi rổ chỉ còn vài bạn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Xét những người sinh cùng một năm. Lớp con giáp gộp tất cả vào{' '}
                  {strong('một ô')}. Lá số cá nhân tách tiếp theo ngày sinh trong năm (khoảng{' '}
                  {viInt(DAYS_IN_YEAR)} ngày) và theo giờ sinh ({HOUR_SLOTS} canh giờ), thành khoảng{' '}
                  {strong(viInt(FINER_TIMES) + ' ô')}.
                </p>
                <p>
                  Tức là mịn hơn chừng {viInt(FINER_TIMES)} lần. Con số {HOUR_SLOTS} canh giờ chính
                  là {HOUR_SLOTS} địa chi — cùng bộ với {GROUP_COUNT} con giáp, chỉ dùng cho giờ thay
                  vì cho năm.
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
                  Cần tách hai trục thường bị gộp: {strong('độ phân giải')} và {strong('độ đúng')}.
                  Phép đếm ô ở trên chỉ nói về trục thứ nhất. Nó chứng minh được một chiều duy nhất:
                  lớp con giáp không đủ mịn để nói riêng về một người.
                </p>
                <p>
                  Chiều ngược lại {strong('không')} suy ra được. Lá số cá nhân mịn hơn nhiều bậc
                  nhưng vẫn là một hệ quy ước chưa có phép kiểm nào ngã ngũ. Ai lấy bảng đếm ô này để
                  kết luận “vậy lá số thì đúng” là đã khẳng định rộng hơn thứ chứng minh được.
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
    prompt: 'Công cụ tử vi hôm nay nhận vào bao nhiêu dữ kiện của bạn, và là dữ kiện gì?',
    answer: (
      <>
        Đúng {strong('một')}: con giáp, tức địa chi năm sinh. Ở phần dự báo theo con giáp không có ô
        nhập ngày, tháng, giờ hay nơi sinh — thao tác duy nhất là bấm vào con giáp của mình. Hệ quả:
        hai người cùng con giáp luôn nhận đúng một bản, không có ngoại lệ.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: `Chia dân số Việt Nam (làm tròn ${people(VN_POPULATION)} người) cho ${GROUP_COUNT} con giáp thì trung bình mỗi nhóm bao nhiêu người?`,
    choices: [
      {
        text: `Khoảng ${PER_GROUP} người mỗi nhóm`,
        correct: true,
        note: 'Đúng — đây là phép chia đều để thấy bậc độ lớn. Số người thật của mỗi con giáp có chênh nhau, nhưng chênh vài phần trăm thì không đổi kết luận.',
      },
      {
        text: 'Khoảng vài chục nghìn người mỗi nhóm',
        note: `Không — nhỏ hơn thực tế rất nhiều lần. Chỉ chia cho ${GROUP_COUNT} nhóm thì mỗi nhóm vẫn còn hàng triệu người.`,
      },
      {
        text: 'Không tính được vì mỗi người một khác',
        note: 'Tính được, và chính chỗ tính được mới là điều đáng nhớ: số nhóm cố định bằng số con giáp, nên số người mỗi nhóm suy ra ngay.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: `Trong cùng một năm sinh, lá số cá nhân mịn hơn lớp con giáp khoảng bao nhiêu lần?`,
    choices: [
      {
        text: `Khoảng ${viInt(FINER_TIMES)} lần — thêm ngày sinh trong năm và ${HOUR_SLOTS} canh giờ`,
        correct: true,
        note: `Đúng: ${viInt(DAYS_IN_YEAR)} ngày nhân ${HOUR_SLOTS} canh giờ. Nhưng mịn hơn chỉ là độ phân giải, chưa phải độ đúng.`,
      },
      {
        text: `Đúng ${HOUR_SLOTS} lần, vì chỉ có giờ sinh là dữ kiện thêm`,
        note: 'Thiếu ngày sinh. Lá số dùng đủ giờ – ngày – tháng – năm, nên phải nhân cả số ngày trong năm.',
      },
      {
        text: 'Không mịn hơn, chỉ là cách gọi khác của cùng một phép',
        note: 'Không — lớp con giáp gộp cả năm sinh vào một ô, còn lá số tách tiếp theo ngày và giờ.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Kể ba cơ chế khiến một lời viết cho hàng triệu người vẫn thấy đúng với riêng bạn.',
    answer: (
      <>
        Một, lời được viết {strong('đủ rộng')} để ai cũng nhận ra mình — hiệu ứng Barnum. Hai, sau
        khi đọc bạn {strong('tự lọc bằng chứng')}: nhớ những lúc khớp, quên những lúc không khớp. Ba,
        lời dặn {strong('tự làm cho mình đúng')}: đọc câu nhắc cẩn thận rồi cả ngày cẩn thận hơn thì
        ngày đó êm thật. Cơ chế đầu nằm ở cách viết, hai cơ chế sau nằm ở phía người đọc — không cái
        nào là bằng chứng về sức dự báo.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: `Người tuổi ${EX_BRANCH} đọc thấy hôm nay “không thuận việc giấy tờ”, mà chiều nay đã hẹn nộp hồ sơ. Nên làm gì?`,
    choices: [
      {
        text: 'Cứ nộp — dòng đó viết cho cả nhóm hàng triệu người, không biết gì về bộ hồ sơ này',
        correct: true,
        note: 'Đúng. Nếu muốn cẩn thận thì kiểm lại giấy tờ trước khi đi — đó là hành động có ích thật, khác hẳn với việc hoãn.',
      },
      {
        text: 'Hoãn sang ngày điểm cao hơn cho chắc',
        note: 'Hoãn là mất thật: lượt hẹn, thời gian, đôi khi cả cơ hội. Còn cái được chỉ là sự an tâm về một dòng chữ chung.',
      },
      {
        text: 'Nhờ người khác tuổi hợp hơn đi nộp thay',
        note: 'Không đổi được gì. Người đi nộp đổi thì cái nhãn đổi, còn bộ hồ sơ và người xét duyệt thì vẫn nguyên.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt: 'Can chi của ngày có phải là thông tin riêng của bạn không? Vì sao?',
    answer: (
      <>
        Không. Can chi ngày là đại lượng của {strong('lịch')}: hàm tính can chi ngày của hieu.asia
        cho ngày ví dụ {EXAMPLE_DAY_LABEL} ra {EXAMPLE_DAY_CANCHI}, hôm sau {NEXT_DAY_CANCHI}, rồi
        lặp lại đúng nhãn cũ sau {DAY_CYCLE} ngày. Hôm nay cả nước đang sống cùng một can chi ngày,
        nên nó không thể là thứ phân biệt người này với người kia. Ngoài ra trang tử vi hôm nay không
        hiển thị can chi ngày — phần ngày trên trang là ngày dương kèm ngày âm.
      </>
    ),
  },
];

export function NhatVanRecall() {
  return <ActiveRecall topicId="nhat-van" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: `Nói được bản dự báo theo con giáp là gì: mỗi ngày ${GROUP_COUNT} bản cho cả nước, chọn bằng đúng một dữ kiện là con giáp của người đọc.`,
  },
  {
    id: 'input',
    facet: 'Đầu vào của công cụ',
    can: 'Kể đúng công cụ hỏi gì và không hỏi gì: không có ngày, tháng, giờ hay nơi sinh ở phần dự báo con giáp — nên hai người cùng tuổi luôn nhận cùng một bản.',
  },
  {
    id: 'granularity',
    facet: 'Độ mịn',
    can: `Tính được con số then chốt: dân số làm tròn chia cho ${GROUP_COUNT} nhóm ra khoảng ${PER_GROUP} người mỗi nhóm, và giải thích được vì sao phép chia đó là một chặn trên chứ không phải một lời chê.`,
  },
  {
    id: 'compare',
    facet: 'So với lá số',
    can: `Giải thích được vì sao trong cùng một năm sinh, lá số mịn hơn khoảng ${viInt(FINER_TIMES)} lần: thêm ngày sinh trong năm và thêm ${HOUR_SLOTS} canh giờ.`,
  },
  {
    id: 'why-feels-true',
    facet: 'Vì sao thấy đúng',
    can: 'Kể được ba cơ chế phía người đọc — lời viết đủ rộng, tự lọc bằng chứng, lời dặn tự làm cho mình đúng — và hiểu vì sao cảm giác trúng không phải bằng chứng.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Tách được hai trục độ phân giải và độ đúng: mịn hơn không tự động nghĩa là đúng hơn, nên không dùng bài này để kết luận rằng lá số cá nhân đã được kiểm chứng.',
  },
  {
    id: 'decision',
    facet: 'Quyết định',
    can: 'Nói được vì sao không hoãn việc thật, không dời lịch khám bệnh và không đổi quyết định tiền bạc vì một dòng dự báo chung — và vì sao không có gì để mua để hoá giải.',
  },
  {
    id: 'healthy-use',
    facet: 'Dùng lành mạnh',
    can: 'Đổi được một câu phán thành một câu hỏi tự vấn, dùng bản dự báo như chuông nhắc chứ không như bản đồ, và ghi lại một việc mình sẽ làm sau khi đọc.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút, bằng lời thường, rằng dòng tử vi sáng nay được viết cho bao nhiêu người — mà không làm họ thấy bị chê là cả tin.',
  },
];

export function NhatVanChecklist() {
  return <UnderstandingChecklist topicId="nhat-van" facets={FACETS} />;
}

export function NhatVanWhys() {
  return (
    <FiveWhys
      topicId="nhat-van"
      start={
        <>
          Một người tuổi {EX_BRANCH} đọc bản tử vi buổi sáng, thấy dòng “hôm nay không thuận việc
          giấy tờ”, liền nhắn hoãn buổi nộp hồ sơ đã hẹn từ tuần trước.
        </>
      }
      chain={[
        {
          question: 'Vì sao người ấy lại nhận đúng dòng đó?',
          because: (
            <>
              Vì người ấy bấm vào con giáp của mình, và công cụ chọn bản{' '}
              {strong('chỉ bằng dữ kiện đó')}. Không có ngày sinh, không có giờ sinh, không có thông
              tin gì về bộ hồ sơ hay buổi hẹn chiều nay.
            </>
          ),
        },
        {
          question: 'Vì sao một dữ kiện lại đủ để công cụ ra một bản?',
          because: (
            <>
              Vì lớp này cố ý chia cả nước thành đúng {GROUP_COUNT} nhóm — bằng số con giáp. Mỗi ngày
              có {GROUP_COUNT} bản, và trung bình {strong('mỗi bản dành cho khoảng ' + PER_GROUP + ' người')}.
              Đó là thiết kế của lớp này, không phải sơ suất.
            </>
          ),
        },
        {
          question: `Vì sao một lời viết cho ${PER_GROUP} người vẫn nghe như nói về mình?`,
          because: (
            <>
              Vì nó được viết {strong('đủ rộng')} để ai cũng nhận ra mình, và vì sau khi đọc, người
              ta để ý những chuyện khớp rồi quên những chuyện không khớp. Cảm giác trúng là thật, chỉ
              là nó sinh ra ở phía người đọc.
            </>
          ),
        },
        {
          question: 'Vì sao cảm giác ấy đủ sức khiến người ta hoãn một việc thật?',
          because: (
            <>
              Vì hoãn {strong('trông như không mất gì')}: chỉ là dời một buổi. Còn rủi ro thì mơ hồ
              nên nghe có vẻ lớn hơn. Bộ não so một cái giá tưởng là nhỏ với một mối lo không có
              hình dạng, và chọn hoãn cho yên.
            </>
          ),
        },
        {
          question: 'Vậy buổi hẹn bị hoãn ấy thật sự mất gì?',
          because: (
            <>
              Mất một lượt hẹn, mất thời gian chờ lượt sau, đôi khi mất cả hạn nộp. Và{' '}
              {strong('ngày mai lại có một dòng khác')} — bản dự báo thì ngày nào cũng có, nên lý do
              để hoãn thì không bao giờ hết.
            </>
          ),
        },
      ]}
      root={
        <>
          Gốc của chuyện không nằm ở việc đọc tử vi buổi sáng — đó là một thói quen vô hại, có khi
          còn dễ chịu. Gốc nằm ở chỗ {strong('trao quyền quyết định cho một lời chung')}. Biết dòng
          ấy được viết cho khoảng {PER_GROUP} người là đủ để giữ thói quen mà không giao cho nó việc
          nó không làm được: bạn đọc để tự vấn, còn quyết định vẫn là của bạn.
        </>
      }
    />
  );
}
