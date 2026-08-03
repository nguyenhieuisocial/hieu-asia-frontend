/**
 * Nội dung "học chủ động" + mọi hằng số / phép tính nền cho trang /learn/dong-nhom.
 * Công cụ đích: /xem-hop-nhom.
 *
 * GROUNDING (đọc code, không đoán) — mọi con số hiển thị đều suy tại runtime từ
 * đúng công thức của engine:
 *   • app/xem-hop-nhom/page.tsx — MIN_MEMBERS = 3, MAX_MEMBERS = 6; mỗi thành viên
 *     nhập tên gọi (tuỳ chọn) + NGÀY SINH + giới tính (KHÔNG có ô giờ sinh); danh
 *     sách cặp sắp GIẢM DẦN theo điểm; khối "Cặp nên chú ý" chỉ hiện khi có cặp yếu.
 *   • ../backend/infra/cloudflare/workers/api-gateway/src/tools/compatibility-group.ts
 *     — hai vòng lặp i<j chấm MỌI cặp; groupScore = max(1, min(10, round(tổng điểm
 *     cặp / số cặp))); avgScore mỗi người = trung bình các cặp có người đó (round1);
 *     role mặc định "Hoà nhịp ổn với cả nhóm", chỉ khi spread >= 1.5 mới gán hai
 *     nhãn ở hai đầu; signalOfOverall >=8 / <=4; friction = 2 cặp thấp nhất, lọc <= 6.
 *   • .../src/tools/compatibility-pair.ts — 5 chiều chấm cặp (Tính cách, Giao tiếp,
 *     Mục tiêu, Tài chính, Gia đình); overallScore = trung bình 5 chiều. Thuần xác
 *     định, KHÔNG gọi LLM, KHÔNG đọc giờ sinh.
 *
 * CÔNG CỤ KHÔNG LÀM: không xét ba người trở lên cùng lúc; không có bộ vai khởi
 * xướng / kết nối / giữ nhịp / soi lỗi (chỉ ĐÚNG BA nhãn, hai trong ba có điều
 * kiện); không đo chất lượng quyết định; không lập lá số.
 *
 * PHẠM VI: KHÔNG dạy lại cách chấm MỘT cặp (bài Hợp đôi — chỉ nhắc tên, chưa có
 * route nên không link), KHÔNG dạy lại bảng hợp/khắc 12 con giáp (/learn/hop-tuoi)
 * hay hình học vòng 12 chi (/learn/tam-hop-luc-xung). Giọng: trung thực về giới
 * hạn, không doạ, không phán số mệnh, không dán nhãn ai.
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

// ── Hằng số phản chiếu ĐÚNG engine ───────────────────────────────────────────
// Engine ở repo backend nên không import trực tiếp được. Mỗi hằng số dưới đây khai
// báo MỘT lần kèm nguồn, và mọi con số trên bài đều suy ra từ chúng — không gõ tay
// lần thứ hai ở bất kỳ đâu. Nguồn: compatibility-group.ts (MIN_GROUP / MAX_GROUP /
// spread 1.5 / friction <= 6, lấy 2 cặp / signalOfOverall) và compatibility-pair.ts
// (5 chiều chấm cặp). Ba chuỗi ROLE_* là nguyên văn nhãn engine trả về.
export const MIN_GROUP = 3;
export const MAX_GROUP = 6;
export const SPREAD_THRESHOLD = 1.5;
export const FRICTION_MAX_SCORE = 6;
export const FRICTION_SLOTS = 2;
export const SIGNAL_THUAN_MIN = 8;
export const SIGNAL_CHU_Y_MAX = 4;
export const DIMENSIONS = ['Tính cách', 'Giao tiếp', 'Mục tiêu', 'Tài chính', 'Gia đình'] as const;
export const ROLE_DEFAULT = 'Hoà nhịp ổn với cả nhóm';
export const ROLE_TOP = 'Chất keo gắn kết — hợp nhịp với nhiều người nhất';
export const ROLE_BOTTOM = 'Cần thêm cầu nối — dễ lệch sóng, nên chủ động trao đổi';

/** Mọi cỡ nhóm công cụ nhận, suy từ hai mốc trên. */
export const GROUP_SIZES: number[] = Array.from(
  { length: MAX_GROUP - MIN_GROUP + 1 },
  (_, i) => MIN_GROUP + i,
);

// ── Phép tính, phản chiếu đúng công thức engine ──────────────────────────────

/** Số cặp trong nhóm n người = số vòng lặp i < j. */
export const pairCount = (n: number): number => (n * (n - 1)) / 2;

/** Điểm nhóm = làm tròn trung bình điểm CÁC CẶP, kẹp 1..10 (clamp của engine). */
export const groupScoreOf = (pairScores: number[]): number =>
  Math.max(1, Math.min(10, Math.round(pairScores.reduce((s, x) => s + x, 0) / pairScores.length)));

/** signalOfOverall: >=8 thuận, <=4 cần chú ý, còn lại trung tính. */
export const bandOf = (score: number): string =>
  score >= SIGNAL_THUAN_MIN ? 'thuận' : score <= SIGNAL_CHU_Y_MAX ? 'cần chú ý' : 'trung tính';

/** round1 của engine — điểm trung bình mỗi người có 1 chữ số thập phân. */
export const round1 = (n: number): number => Math.round(n * 10) / 10;

/**
 * Số thập phân HIỂN THỊ phải dùng dấu PHẨY kiểu Việt: in thẳng số JS ra thì "1.5"
 * bị đọc thành một nghìn năm trăm. Cùng quy ước với /learn/thai-tue ("11,862 năm").
 */
export const vn = (n: number, digits = 1): string => n.toFixed(digits).replace('.', ',');

export interface WeakPairCase {
  size: number;
  pairs: number;
  meanLabel: string;
  groupScore: number;
  band: string;
  spreadLabel: string;
  labelled: boolean;
}

/**
 * Kịch bản kiểm được bằng tay: MỌI cặp đạt `high` điểm, riêng cặp cuối cùng — tức
 * hai người cuối danh sách — chỉ `low` điểm. Dựng đúng danh sách cặp mà engine dựng
 * (hai vòng lặp i < j), rồi chạy đúng các phép của engine lên đó.
 */
export function buildOneWeakPairCase(size: number, high: number, low: number): WeakPairCase {
  const pairs: { a: number; b: number; score: number }[] = [];
  for (let i = 0; i < size; i += 1) {
    for (let j = i + 1; j < size; j += 1) pairs.push({ a: i, b: j, score: high });
  }
  const weakest = pairs[pairs.length - 1];
  if (weakest) weakest.score = low;

  const scores = pairs.map((p) => p.score);
  const mean = scores.reduce((s, x) => s + x, 0) / scores.length;
  const avgs = Array.from({ length: size }, (_, i) => {
    const mine = pairs.filter((p) => p.a === i || p.b === i);
    return round1(mine.reduce((s, p) => s + p.score, 0) / mine.length);
  });
  const spread = round1(Math.max(...avgs) - Math.min(...avgs));
  const groupScore = groupScoreOf(scores);

  return {
    size,
    pairs: pairs.length,
    meanLabel: vn(mean, 1),
    groupScore,
    band: bandOf(groupScore),
    spreadLabel: vn(spread, 1),
    labelled: spread >= SPREAD_THRESHOLD,
  };
}

/**
 * Hai mức điểm cặp của kịch bản demo — hai con số DUY NHẤT được chọn tay trong cả
 * bài; mọi hệ quả đều tính ra từ chúng bằng đúng công thức của engine.
 */
export const CASE_HIGH = 8;
export const CASE_LOW = 3;

export const WEAK_CASES: WeakPairCase[] = GROUP_SIZES.map((size) =>
  buildOneWeakPairCase(size, CASE_HIGH, CASE_LOW),
);
export const CASE_MIN = buildOneWeakPairCase(MIN_GROUP, CASE_HIGH, CASE_LOW);
export const CASE_MAX = buildOneWeakPairCase(MAX_GROUP, CASE_HIGH, CASE_LOW);

/** Trọng số của MỘT cặp trong điểm nhóm, tính theo phần trăm. */
const weightPct = (n: number): string => vn(100 / pairCount(n), 1);

// ── Các khối học chủ động ────────────────────────────────────────────────────

export function DongNhomFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn nhập cả nhà vào một công cụ và nhận về {strong('một con số cho cả nhóm')}. Con số ấy
          nghe như một kết luận — nhưng nó gộp từ đâu ra, giữ lại được gì và làm mất cái gì thì không
          ai nói.
        </>
      }
      why={
        <>
          Vì huyền học cổ chỉ định nghĩa quan hệ giữa {strong('hai')} địa chi. Không có bảng nào cho
          quan hệ của sáu con giáp cùng lúc, nên mọi điểm số dành cho cả nhóm đều là{' '}
          {strong('một phép gộp do người viết công cụ chọn')}. Biết phép gộp đó thì bạn đọc kết quả
          như đọc một bảng số, không phải như nghe một lời phán.
        </>
      }
      what={
        <>
          Công cụ nhận {MIN_GROUP}–{MAX_GROUP} người, chấm {strong('mọi cặp')} trong nhóm rồi lấy{' '}
          {strong('trung bình các cặp')} làm điểm nhóm. Nhóm {MAX_GROUP} người là{' '}
          {pairCount(MAX_GROUP)} cặp. Không có phép nào xét ba người trở lên cùng lúc.
        </>
      }
      how={
        <>
          Với mỗi người bạn nhập tên gọi (tuỳ chọn), ngày sinh và giới tính — {strong('không có ô giờ sinh')}.
          Mỗi cặp được chấm trên {DIMENSIONS.length} chiều rồi lấy trung bình thành điểm cặp; các
          điểm cặp lại được trung bình thành điểm nhóm; sau đó tách ra thành điểm từng người, bảng
          từng cặp và tối đa {FRICTION_SLOTS} cặp nên chú ý.
        </>
      }
      soWhat={
        <>
          Để bạn ngừng đọc con số to và bắt đầu đọc {strong('bảng từng cặp')} — chỗ duy nhất còn giữ
          thông tin về ai đang lệch với ai. Và để không ai bị loại khỏi một nhóm vì một con số suy ra
          từ năm sinh.
        </>
      }
    />
  );
}

export function DongNhomDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="dong-nhom"
        concept="Điểm của cả nhóm ra từ đâu"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Máy không biết chấm điểm cho cả nhóm một lần. Nó chỉ biết{' '}
                {strong('chấm từng đôi một')}: bạn với bạn A, bạn với bạn B, bạn A với bạn B… Chấm
                xong hết thì nó cộng lại rồi chia đều, ra một điểm chung.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Mỗi cặp hai người được chấm trên {DIMENSIONS.length} chiều — {DIMENSIONS.join(', ')}{' '}
                — rồi lấy trung bình {DIMENSIONS.length} chiều đó thành điểm của cặp, thang 1 đến 10.
                Điểm nhóm là {strong('trung bình của tất cả các điểm cặp')}, làm tròn về số nguyên.
                Nhóm {MIN_GROUP} người có {pairCount(MIN_GROUP)} cặp, nhóm {MAX_GROUP} người có{' '}
                {pairCount(MAX_GROUP)} cặp. Cộng lại, chia cho số cặp, xong.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <p>
                Trong mã nguồn, phép gộp là đúng một dòng:{' '}
                {strong('làm tròn tổng điểm các cặp chia số cặp')}, rồi kẹp vào khoảng 1–10 — điểm
                nhóm là số nguyên, còn điểm từng người giữ một chữ số thập phân, nên hai con số có độ
                mịn khác nhau. Hệ quả quan trọng: trung bình là phép{' '}
                {strong('tuyến tính và không có trọng số')}. Chọn phép gộp khác — lấy cặp thấp nhất
                chẳng hạn — thì cùng một nhóm ra con số khác hẳn, và không phép nào “đúng theo cổ
                thư” cả, vì cổ thư không có phép gộp.
              </p>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="dong-nhom"
        concept="Vì sao số quan hệ phình nhanh hơn số người"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ba bạn chơi với nhau thì có {pairCount(MIN_GROUP)} đôi bạn. Thêm một bạn nữa vào,
                bạn mới ấy phải làm quen với {strong('cả ba bạn cũ')} — nên số đôi bạn tăng nhanh hơn
                số người rất nhiều.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Số cặp trong nhóm n người là {strong('n × (n − 1) ÷ 2')}. Nhóm {MIN_GROUP} người:{' '}
                {pairCount(MIN_GROUP)} cặp. Nhóm {MAX_GROUP} người: {pairCount(MAX_GROUP)} cặp — số
                người gấp đôi mà số quan hệ gấp{' '}
                {pairCount(MAX_GROUP) / pairCount(MIN_GROUP)}. Người thứ n bước vào mang theo{' '}
                {strong('n − 1 quan hệ mới')}, mỗi quan hệ với một người đã có mặt. Đó là lý do rất
                thật khiến nhóm đông khó điều phối hơn, chẳng cần huyền học nào giải thích.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <p>
                Vì số cặp tăng theo bình phương,{' '}
                {strong('trọng số của một cặp bất kỳ là 1 chia số cặp')}: {weightPct(MIN_GROUP)}% ở
                nhóm {MIN_GROUP} người, {weightPct(MAX_GROUP)}% ở nhóm {MAX_GROUP} người. Đây chính
                là cơ chế làm loãng — nhóm càng đông thì một mâu thuẫn càng khó lộ ra ở con số chung,
                không phải vì mâu thuẫn nhỏ đi mà vì {strong('mẫu số lớn lên')}. Cũng vì thế, so hai
                nhóm khác cỡ bằng điểm nhóm là so hai thứ không cùng thang.
              </p>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="dong-nhom"
        concept="“Vai trò trong nhóm” — công cụ thật sự có gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Máy chỉ biết nói ba câu: {strong('bình thường')}, {strong('hợp với nhiều người nhất')}{' '}
                và {strong('cần nói chuyện nhiều hơn')}. Hai câu sau chỉ nói khi có ai đó cách xa hẳn
                những người còn lại.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <p>
                Mỗi người có một điểm trung bình với phần còn lại của nhóm. Engine sắp mọi người theo
                điểm đó rồi hỏi: cao nhất hơn thấp nhất bao nhiêu? Chưa tới {vn(SPREAD_THRESHOLD, 1)}{' '}
                thì {strong('không ai được gán nhãn gì')}. Nghĩa là công cụ{' '}
                {strong('không có')} bộ vai kiểu người khởi xướng, người kết nối, người giữ nhịp,
                người soi lỗi — nó có đúng ba nhãn, hai trong ba là có điều kiện.
              </p>
            ),
          },
          {
            id: 'expert',
            label: 'Chuyên gia',
            content: (
              <p>
                Ngưỡng {vn(SPREAD_THRESHOLD, 1)} chặn việc dán nhãn cho ai đó chỉ vì thấp hơn người
                khác {vn(0.1, 1)} điểm — đáng khen, nhưng cũng làm nhãn{' '}
                {strong('gần như biến mất ở nhóm đông')}: cùng một cặp lệch, nhóm {CASE_MIN.size}{' '}
                người chênh {CASE_MIN.spreadLabel} nên có nhãn, nhóm {CASE_MAX.size} người chỉ{' '}
                {CASE_MAX.spreadLabel} nên không. Còn một chỗ kém chặt: khi hai người bằng điểm nhau
                ở đáy bảng, chỉ người đứng sau trong danh sách nhập nhận nhãn — đổi thứ tự gõ tên thì
                nhãn chuyển sang người kia.
              </p>
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
    prompt: `Nhóm ${MAX_GROUP} người thì công cụ chấm bao nhiêu cặp, và điểm nhóm ra từ đâu?`,
    answer: (
      <>
        {pairCount(MAX_GROUP)} cặp, theo công thức n × (n − 1) ÷ 2. Điểm nhóm là{' '}
        {strong('trung bình của ' + pairCount(MAX_GROUP) + ' điểm cặp đó')}, làm tròn về số nguyên
        và kẹp trong khoảng 1–10. Không có phép tính nào xét ba người trở lên cùng lúc — cả nhóm chỉ
        được nhìn qua các cặp rồi gộp lại.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: `Thêm người thứ ${MAX_GROUP} vào một nhóm ${MAX_GROUP - 1} người thì sinh thêm bao nhiêu quan hệ mới?`,
    choices: [
      {
        text: 'Đúng một quan hệ mới, vì chỉ thêm đúng một người',
        note: `Không — người mới phải ghép với TỪNG người đã có mặt. Số cặp nhảy từ ${pairCount(MAX_GROUP - 1)} lên ${pairCount(MAX_GROUP)}.`,
      },
      {
        text: `${pairCount(MAX_GROUP) - pairCount(MAX_GROUP - 1)} quan hệ mới — một với mỗi người đã có mặt`,
        correct: true,
        note: `Đúng. Người thứ n mang theo n − 1 quan hệ mới, nên số cặp tăng theo bình phương chứ không theo đường thẳng.`,
      },
      {
        text: 'Hai quan hệ mới: một với người thân nhất và một với cả nhóm',
        note: 'Không — engine không có khái niệm "quan hệ với cả nhóm". Chỉ có quan hệ giữa hai người.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: `Nhóm ${CASE_MAX.size} người: ${CASE_MAX.pairs - 1} cặp đạt ${CASE_HIGH} điểm, đúng một cặp chỉ ${CASE_LOW} điểm. Điểm nhóm hiển thị là bao nhiêu?`,
    choices: [
      {
        text: `${CASE_MAX.groupScore}/10 — mức mà công cụ gọi là “${CASE_MAX.band}”`,
        correct: true,
        note: `Đúng: trung bình thật là ${CASE_MAX.meanLabel} rồi làm tròn. Một cặp chỉ nắm ${weightPct(CASE_MAX.size)}% trọng số nên gần như không kéo được con số chung.`,
      },
      {
        text: `${CASE_LOW}/10 — vì có một cặp lệch nặng thì cả nhóm phải hạ xuống`,
        note: 'Không — engine lấy trung bình, không lấy cặp thấp nhất. Đó là một phép gộp khác, cũng biện minh được, nhưng không phải phép mà công cụ này dùng.',
      },
      {
        text: `${CASE_MIN.groupScore}/10 — giống hệt nhóm ${CASE_MIN.size} người có cùng cặp lệch đó`,
        note: `Không, và đây chính là điểm mấu chốt của bài: cùng cặp lệch ấy, nhóm ${CASE_MIN.size} người ra ${CASE_MIN.groupScore}/10 còn nhóm ${CASE_MAX.size} người ra ${CASE_MAX.groupScore}/10.`,
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Công cụ gán vai trò cho các thành viên như thế nào?',
    choices: [
      {
        text: 'Mỗi người một vai riêng: khởi xướng, kết nối, giữ nhịp, soi lỗi',
        note: 'Không — công cụ KHÔNG tính bộ vai này. Đó là cách phân vai của các bài viết về làm việc nhóm, không có trong engine.',
      },
      {
        text: 'Không có nhãn nào cả, chỉ có điểm số',
        note: `Không — có ba nhãn. Mặc định là “${ROLE_DEFAULT}”, cộng thêm hai nhãn ở hai đầu bảng khi đủ điều kiện.`,
      },
      {
        text: `Có đúng ba nhãn; hai nhãn ở hai đầu chỉ xuất hiện khi chênh lệch đạt ${vn(SPREAD_THRESHOLD, 1)} trở lên`,
        correct: true,
        note: `Đúng. Nhãn mặc định là “${ROLE_DEFAULT}”; chỉ khi người cao nhất hơn người thấp nhất từ ${vn(SPREAD_THRESHOLD, 1)} điểm thì mới có “${ROLE_TOP}” và “${ROLE_BOTTOM}”.`,
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Kết quả không hiện khối “Cặp nên chú ý”. Điều đó có nghĩa là gì — và KHÔNG có nghĩa là gì?',
    answer: (
      <>
        Nó chỉ có nghĩa là {strong('hai cặp thấp nhất đều trên ' + FRICTION_MAX_SCORE + ' điểm')} —
        engine lấy {FRICTION_SLOTS} cặp thấp nhất rồi lọc, chỉ giữ cặp từ {FRICTION_MAX_SCORE} điểm
        trở xuống. Nó KHÔNG có nghĩa là nhóm không có va chạm nào: thang điểm này chỉ đọc con giáp
        của năm sinh, giới tính và chuỗi ngày sinh, nên có vô số nguồn mâu thuẫn thật mà nó không
        nhìn thấy.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Bạn đang lập một đội bốn người cho một dự án và định giữ lại tổ hợp nào cho điểm nhóm cao nhất. Nên không?',
    choices: [
      {
        text: 'Nên — điểm cao nghĩa là nhóm phối hợp tốt hơn nên chạy nhanh hơn',
        note: 'Không. Điểm cao nghĩa là "ít ma sát dự đoán", không phải "quyết định tốt hơn". Người hay phản biện thường bị chấm thấp, mà đó lại là người phát hiện lỗ hổng.',
      },
      {
        text: 'Không nên — thang này không nhìn thấy năng lực, và chính công cụ ghi rõ đừng dùng kết quả để loại trừ một thành viên',
        correct: true,
        note: 'Đúng. Dùng đúng cách là: nhóm đã có sẵn thì đọc khối cặp nên chú ý để chuẩn bị cách nói chuyện — không phải để lọc người.',
      },
      {
        text: 'Nên, miễn là bạn không nói cho những người bị loại biết lý do',
        note: 'Vẫn không. Vấn đề không nằm ở việc giấu, mà ở chỗ tiêu chí lọc được suy từ năm sinh — nó không chứa thông tin nào về việc người đó làm được gì.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt: 'Nói bằng lời của bạn: vì sao “hợp từng cặp” không cộng dồn thành “hợp cả nhóm”?',
    answer: (
      <>
        Vì phép gộp là một {strong('phép nén')}: nó đổi {pairCount(MAX_GROUP)} con số lấy một con số,
        và thứ bị vứt đi chính là chỗ lệch. Nhóm càng đông thì mẫu số càng lớn, một cặp lệch càng
        chìm — ở nhóm {MAX_GROUP} người, một cặp chỉ nắm {weightPct(MAX_GROUP)}% trọng số. Thêm nữa,
        engine không có phép nào xét ba người cùng lúc, nên “hợp cả nhóm” không phải một đại lượng
        được đo mà là một cách tóm tắt. Bản gốc vẫn nằm ở bảng từng cặp.
      </>
    ),
  },
];

export function DongNhomRecall() {
  return <ActiveRecall topicId="dong-nhom" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: `Nói được công cụ nhận ${MIN_GROUP}–${MAX_GROUP} người, chấm mọi cặp rồi lấy trung bình các cặp làm điểm nhóm — và rằng không có phép nào xét ba người trở lên cùng lúc.`,
  },
  {
    id: 'combinatorics',
    facet: 'Số quan hệ',
    can: `Tính nhẩm được số cặp của một nhóm bất kỳ bằng n × (n − 1) ÷ 2, và giải thích vì sao người thứ n mang theo n − 1 quan hệ mới chứ không phải một.`,
  },
  {
    id: 'averaging',
    facet: 'Cơ chế phép gộp',
    can: `Chỉ ra vì sao cùng một cặp lệch lại cho hai kết luận trái ngược ở nhóm ${MIN_GROUP} người và nhóm ${MAX_GROUP} người — vì trọng số một cặp tụt từ ${weightPct(MIN_GROUP)}% xuống ${weightPct(MAX_GROUP)}%.`,
  },
  {
    id: 'reading',
    facet: 'Đọc kết quả',
    can: `Biết đọc theo thứ tự đúng: bảng từng cặp và khối cặp nên chú ý trước, con số nhóm sau — và hiểu vì sao không thấy khối cặp nên chú ý không đồng nghĩa với nhóm không có va chạm.`,
  },
  {
    id: 'roles',
    facet: 'Vai trò',
    can: `Nói đúng công cụ có ĐÚNG BA nhãn vai trò, hai trong ba chỉ xuất hiện khi chênh lệch đạt ${vn(SPREAD_THRESHOLD, 1)} — và rằng nó KHÔNG có bộ vai khởi xướng / kết nối / giữ nhịp / soi lỗi.`,
  },
  {
    id: 'tool-scope',
    facet: 'Công cụ tính gì',
    can: 'Kể được đầu vào thật sự: ngày sinh, giới tính, tên gọi — không giờ sinh, không lá số, không mô hình ngôn ngữ; nên cùng danh sách người thì luôn ra cùng kết quả.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Phân biệt được "ít ma sát dự đoán" với "ra quyết định tốt", và nói được vì sao dùng điểm hợp để chọn hay loại người là dùng sai công cụ.',
  },
  {
    id: 'limits',
    facet: 'Giới hạn',
    can: 'Nêu được ít nhất hai chỗ phép gộp còn thô: trung bình là lựa chọn của người viết công cụ chứ không có trong cổ thư, và khi hai người bằng điểm ở đáy thì chỉ một người nhận nhãn.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người trong nhà trong một phút, bằng lời thường: con số chung được cộng chia thế nào, vì sao nên nhìn bảng cặp, và vì sao không ai bị dán nhãn vì con số đó.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn chưa nắm — ví dụ điểm của một cặp được chấm ra sao trên năm chiều — và biết bài nào trên hieu.asia lấp phần đó.',
  },
];

export function DongNhomChecklist() {
  return <UnderstandingChecklist topicId="dong-nhom" facets={FACETS} />;
}

export function DongNhomWhys() {
  return (
    <FiveWhys
      topicId="dong-nhom"
      start={
        <>
          Một nhóm {CASE_MAX.size} người chạy công cụ, thấy {CASE_MAX.groupScore}/10 và câu tóm tắt
          nói nhóm có nền cộng hưởng tốt. Cả nhóm yên tâm, không ai đọc tiếp phần bên dưới. Ba tháng
          sau, đúng hai người trong nhóm nghỉ chơi vì một chuyện tưởng nhỏ.
        </>
      }
      chain={[
        {
          question: 'Vì sao điểm nhóm vẫn cao dù trong nhóm có một cặp lệch nặng?',
          because: (
            <>
              Vì điểm nhóm là {strong('trung bình của tất cả các cặp')}. Nhóm {CASE_MAX.size} người
              có {CASE_MAX.pairs} cặp, nên một cặp chỉ nắm {weightPct(CASE_MAX.size)}% trọng số.{' '}
              {CASE_MAX.pairs - 1} cặp {CASE_HIGH} điểm cộng một cặp {CASE_LOW} điểm cho trung bình{' '}
              {CASE_MAX.meanLabel} — làm tròn thành {CASE_MAX.groupScore}. Cặp lệch vẫn nằm nguyên
              trong bảng, chỉ là không lộ ra ở con số to.
            </>
          ),
        },
        {
          question: 'Vì sao lại chọn phép trung bình chứ không phải phép khác?',
          because: (
            <>
              Vì engine {strong('không có phép nào xét ba người trở lên cùng lúc')}. Mọi quan hệ đều
              đi qua cặp, nên muốn có một con số cho cả nhóm thì buộc phải gộp các cặp lại — và trung
              bình là cách gộp đơn giản nhất, dễ kiểm nhất. Nó là một lựa chọn hợp lý, không phải một
              chân lý.
            </>
          ),
        },
        {
          question: 'Vì sao không có phép nào xét cả nhóm một lần?',
          because: (
            <>
              Vì thứ được thừa hưởng từ cổ thư chỉ là {strong('quan hệ giữa hai địa chi')}: tam hợp,
              lục xung, lục hại, ngũ hành sinh khắc. Không có bảng nào định nghĩa quan hệ của sáu chi
              cùng lúc — nên mọi con số dành cho cả nhóm, của công cụ này hay của bất kỳ ai, đều là
              phát minh hiện đại chứ không phải di sản.
            </>
          ),
        },
        {
          question: 'Vì sao một con số duy nhất vẫn hấp dẫn đến thế?',
          because: (
            <>
              Vì nó cho cảm giác {strong('đã có câu trả lời')} mà không phải đọc {CASE_MAX.pairs}{' '}
              dòng bảng — và vì nó luôn nghe đúng: nhóm nào cũng có lúc hợp lúc lệch, nên một câu tóm
              tắt chung chung gần như không thể sai. Đó là lý do nhóm ở trên dừng đọc ngay sau con số.
            </>
          ),
        },
        {
          question: 'Vậy con số nhóm nên được dùng vào việc gì?',
          because: (
            <>
              Dùng như {strong('tiêu đề của một bảng')}, không phải như kết luận. Giá trị thật nằm ở
              hai chỗ bên dưới: danh sách từng cặp sắp từ cao xuống thấp, và khối cặp nên chú ý kèm
              câu gợi ý để mở lời — nhóm ở đầu mục này nếu đọc tiếp đã thấy đúng cặp đó nằm ngay ở kia.
            </>
          ),
        },
      ]}
      root={
        <>
          Hợp từng cặp không cộng dồn thành hợp cả nhóm. Trung bình là một phép nén, và cái bị nén
          mất luôn là chỗ lệch — thứ bạn cần biết nhất. {strong('Đọc bảng gốc, đừng đọc bản tóm tắt')}
          , và nhớ rằng ngay cả bảng gốc cũng chỉ suy từ năm sinh: nó là chỗ để bắt đầu một cuộc nói
          chuyện, không phải chỗ để kết thúc.
        </>
      }
    />
  );
}
