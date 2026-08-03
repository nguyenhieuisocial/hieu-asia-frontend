/**
 * Nội dung "học chủ động" cho trang /learn/kiem-chung — bài CHÍNH THỨC về cách
 * kiểm một lời tiên đoán (khả sai · tỉ lệ nền · ghi trước rồi mới đối chiếu).
 *
 * GROUNDING — mọi con số về công cụ đều SUY TỪ LIB, không gõ tay:
 *   • lib/backtest/palace-map.ts — PALACE_ORDER (số cung của một lá số),
 *     ALL_STEMS + TU_HOA_BY_STEM (số can năm × số sao Tứ Hóa mỗi năm),
 *     CATEGORY_LABEL (tập lĩnh vực khai được), controlCategory() (bảng đối
 *     chứng âm: mỗi lĩnh vực thật được ghép cố định với một lĩnh vực khác).
 *   • lib/backtest/forecast.ts — FORECAST_CATEGORIES (lĩnh vực dự báo được).
 *   • lib/backtest/scoring.ts (đọc, không import) — palaceBaseRate() đếm trong
 *     10 can năm có mấy can làm một sao Tứ Hóa toạ thủ đúng cung đang xét → đó
 *     là TỈ LỆ NỀN của chính lá số đó.
 *   • lib/backtest/forecast-journal.ts (đọc) — sổ dự báo chỉ lưu mức mạnh, đóng
 *     dấu ngày lưu, chỉ cho đánh giá năm đã tới, đếm cả "không xảy ra".
 *
 * SỐ MINH HOẠ vs SỐ ĐO: mọi tỉ lệ nền trong ví dụ đời thường là SỐ MINH HOẠ để
 * dạy cách tính — KHÔNG phải số đo của hieu.asia. Riêng phép tính "trúng ≥3/4 do
 * ngẫu nhiên" được TÍNH tại chỗ bằng chanceAtLeast() bên dưới, không gõ tay.
 *
 * PHẠM VI: vì sao lời chung chung nghe đúng (hiệu ứng Barnum) có bài riêng — ở
 * đây chỉ nhắc tên một câu; so sánh hai lăng kính có bài riêng; bẫy hồi cứu ở mốc
 * giao vận chỉ nhắc một câu.
 *
 * Giọng: bài này dạy người đọc nghi ngờ CHÍNH sản phẩm một cách có phương pháp.
 * Trung thực, không mỉa mai, không hứa điều chưa đo được.
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
import {
  ALL_STEMS,
  TU_HOA_BY_STEM,
  PALACE_ORDER,
  CATEGORY_LABEL,
  controlCategory,
} from '@/lib/backtest/palace-map';
import { FORECAST_CATEGORIES } from '@/lib/backtest/forecast';
import type { LifeCategory } from '@/lib/backtest/backtest-core';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Hai hàm dùng chung cho CẢ page.tsx (một nguồn duy nhất cho mọi con số) ────

/**
 * Xác suất trúng từ `k` lần trở lên trong `n` lần thử độc lập, mỗi lần trúng với
 * xác suất `p`. Dùng để trả lời câu "khớp 3/4 mốc thì có gì đáng ngạc nhiên
 * không" bằng một phép tính, thay vì bằng cảm giác.
 */
export function chanceAtLeast(k: number, n: number, p: number): number {
  const choose = (a: number, b: number): number => {
    let r = 1;
    for (let i = 1; i <= b; i += 1) r = (r * (a - b + i)) / i;
    return r;
  };
  let sum = 0;
  for (let i = k; i <= n; i += 1) sum += choose(n, i) * p ** i * (1 - p) ** (n - i);
  return sum;
}

/**
 * In số thập phân theo kiểu Việt — dấu PHẨY. In thẳng số JS ra sẽ thành "31.25"
 * mà trong tiếng Việt dấu chấm là phân cách nghìn, nên người đọc hiểu sai hẳn
 * bậc. Cùng quy ước với /learn/lich-am-duong ("29,53 ngày").
 */
export function vnNumber(x: number, digits = 0): string {
  return x.toFixed(digits).replace('.', ',');
}

// ── Dữ kiện suy từ lib ───────────────────────────────────────────────────────

/** Số can năm (10) — mẫu số của tỉ lệ nền mà công cụ tính cho từng cung. */
export const STEM_COUNT = ALL_STEMS.length;

/** Số sao Tứ Hóa mỗi năm phóng ra (4) — tối đa 4 cung được "chiếu" mỗi năm. */
export const HOA_COUNT = Math.max(0, ...Object.values(TU_HOA_BY_STEM).map((v) => v.length));

/** Số cung của một lá số (12). */
export const PALACE_COUNT = PALACE_ORDER.length;

/** Toàn bộ lĩnh vực khai được ở công cụ. */
export const ALL_CATEGORIES = Object.keys(CATEGORY_LABEL) as LifeCategory[];

/** Lĩnh vực dự báo được (loại "mất mát" và "học hành" — xem forecast.ts). */
export const FORECAST_COUNT = FORECAST_CATEGORIES.length;

/**
 * Ví dụ tỉ lệ nền "một nửa": một cung mà trong {STEM_COUNT} can năm có đúng một
 * nửa số can làm Tứ Hóa rơi vào nó. Đây là mức hay gặp, và là mức khiến một lần
 * "khớp" gần như tung đồng xu.
 */
export const DEMO_HITS = Math.round(STEM_COUNT / 2);
export const DEMO_RATE = DEMO_HITS / STEM_COUNT;

/** Bốn mốc tự kiểm — con số người dùng hay nhập (trang công cụ khuyên 3–5). */
export const DEMO_EVENTS = 4;
export const DEMO_WIN = 3;

/** Số lần khớp KỲ VỌNG khi mọi thứ chỉ là ngẫu nhiên. */
export const DEMO_EXPECTED = DEMO_EVENTS * DEMO_RATE;

/** Xác suất khớp ≥3/4 hoàn toàn do ngẫu nhiên, ở mức nền một nửa. */
export const DEMO_CHANCE = chanceAtLeast(DEMO_WIN, DEMO_EVENTS, DEMO_RATE);
export const DEMO_CHANCE_LABEL = vnNumber(DEMO_CHANCE * 100, 2);

/** Cặp đối chứng âm mà công cụ dùng — đọc thẳng từ bảng đã khoá trong mã. */
export const CONTROL_CAREER = CATEGORY_LABEL[controlCategory('career')];
export const CONTROL_WEALTH = CATEGORY_LABEL[controlCategory('wealth')];

export function KiemChungFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn đọc một lời tiên đoán và thấy {strong('“đúng ghê”')}. Nhưng “thấy đúng” là một cảm
          giác, không phải một phép kiểm. Không có phép kiểm thì bạn không phân biệt được một lời nói
          trúng thật với một lời {strong('không thể sai')} — mà hai thứ đó cho cảm giác giống hệt
          nhau.
        </>
      }
      why={
        <>
          Vì đây là {strong('bộ lọc dùng được ở mọi nơi')}: lá số, lời thầy, dự báo thị trường, lời
          hứa của một công ty — và của chính hieu.asia. Học một lăng kính thì chỉ đọc được lăng kính
          đó; học cách kiểm thì đọc được tất cả, kể cả những lăng kính bạn chưa từng gặp.
        </>
      }
      what={
        <>
          Ba câu hỏi, hỏi theo đúng thứ tự: (1) {strong('điều gì sẽ chứng minh nó SAI?')} (2) nếu nó
          trúng thì {strong('trúng hơn tỉ lệ nền')} bao nhiêu? (3) lời ấy được{' '}
          {strong('ghi trước')} hay được dựng lại sau khi đã biết kết quả? Thiếu một câu thì “thấy
          đúng” không còn là bằng chứng.
        </>
      }
      how={
        <>
          Viết lại lời tiên đoán thành một câu có mốc thời gian và có ngưỡng, nêu trước điều sẽ bác
          bỏ nó; ước lượng tỉ lệ nền rồi so; và ghi ra giấy TRƯỚC, hẹn ngày mở. Công cụ{' '}
          {strong('Bằng Chứng')} làm đúng ba việc đó với lá số của bạn: khoá bảng lĩnh vực → cung từ
          trước, hiện tỉ lệ nền của từng cung, và có một sổ dự báo đóng dấu ngày ghi.
        </>
      }
      soWhat={
        <>
          Để bạn {strong('bớt cả tin mà không phải trở nên hoài nghi')}. Kiểm chứng đối xử với “trúng”
          và “trượt” như nhau — nên nó vừa chặn bạn khỏi tin bừa, vừa chặn bạn khỏi bác bừa. Và nó cho
          bạn quyền hỏi bất cứ ai bán lời tiên đoán một câu rất khó né: “nếu lời này sai thì tôi sẽ
          thấy gì?”
        </>
      }
    />
  );
}

export function KiemChungDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="kiem-chung"
        concept="Kiểm chứng một lời tiên đoán nghĩa là gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Nếu bạn nói {strong('“mai trời có thể mưa, cũng có thể không”')} thì bạn không bao giờ
                sai — nhưng câu đó cũng chẳng cho ai biết gì. Muốn biết một lời nói có giỏi hay không,
                trước hết phải có cách để nó {strong('bị sai')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Một lời tiên đoán thực chất là một lời {strong('loại trừ')}: nói “mai mưa” là loại
                  trừ khả năng “mai không mưa”. Câu nào không loại trừ điều gì thì không mang thông
                  tin — bạn nghe xong vẫn biết đúng bằng lúc chưa nghe.
                </p>
                <p>
                  Nên phép kiểm bắt đầu bằng một câu hỏi rất đơn giản:{' '}
                  {strong('“nếu điều này sai thì tôi sẽ thấy gì?”')} Trả lời được trong một câu thì
                  lời đó kiểm được. Không trả lời được thì dù nghe hay tới đâu, nó vẫn chưa phải một
                  khẳng định.
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
                  Khả sai là {strong('điều kiện cần, không phải điều kiện đủ')}. Một câu khả sai vẫn
                  có thể sai bét; nó chỉ mới đủ tư cách để được đem đi kiểm. Đủ tư cách rồi mới tới
                  hai lớp sau: so với tỉ lệ nền, và ghi trước thay vì dựng lại sau.
                </p>
                <p>
                  Chỗ hay hỏng nhất là {strong('cửa thoát hiểm')} gắn kèm — “chưa ứng là do chưa tới
                  lúc”, “do bạn chưa đủ thành tâm”. Cửa ấy biến mọi kết cục thành xác nhận, tức là rút
                  ngược tính khả sai của một câu vốn khả sai. Nghe thì mềm mỏng, nhưng về mặt logic nó
                  huỷ luôn giá trị của lời tiên đoán.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="kiem-chung"
        concept="Vì sao “trúng 70%” có thể vẫn là con số vô giá trị"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bạn đoán {strong('“hôm nay lớp mình có bạn nghỉ học”')} và hầu như hôm nào cũng đúng.
                Nhưng đó là vì lớp đông, ngày nào chẳng có bạn nghỉ — chứ không phải vì bạn giỏi đoán.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Số cần so không phải là 0, mà là {strong('tỉ lệ nền')}: chuyện đó tự xảy ra bao
                  nhiêu phần khi chẳng ai đoán gì cả. Một câu trúng 70% mà tỉ lệ nền cũng 70% thì
                  người nói thêm được đúng {strong('không có gì')}.
                </p>
                <p>
                  Ngược lại, một câu chỉ trúng 40% nhưng chuyện đó vốn chỉ xảy ra 5% số lần thì đã là{' '}
                  {strong('gấp 8 lần nền')} — dù nghe “kém chính xác” hơn hẳn. Câu hỏi đúng không
                  phải “trúng bao nhiêu phần trăm” mà “trúng hơn nền bao nhiêu lần”.
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
                  Trong công cụ Bằng Chứng, tỉ lệ nền được tính cho{' '}
                  {strong('chính lá số của bạn')}: có {STEM_COUNT} can năm, mỗi năm phóng ra{' '}
                  {HOA_COUNT} sao Tứ Hóa; đếm xem trong {STEM_COUNT} can ấy có mấy can khiến một sao
                  Tứ Hóa rơi thẳng vào cung đang xét. Ra {DEMO_HITS}/{STEM_COUNT} thì cung đó tự
                  “sáng” khoảng một nửa số năm — một lần khớp ở đó gần bằng tung đồng xu.
                </p>
                <p>
                  Hệ quả cần thuộc: với mức nền {vnNumber(DEMO_RATE * 100)}% và {DEMO_EVENTS} mốc tự
                  kiểm, số lần khớp {strong('kỳ vọng')} đã là {vnNumber(DEMO_EXPECTED)}, và xác suất
                  khớp từ {DEMO_WIN}/{DEMO_EVENTS} trở lên{' '}
                  {strong('hoàn toàn do ngẫu nhiên')} là {DEMO_CHANCE_LABEL}% — khoảng một phần ba.
                  Nghĩa là cứ ba người tự kiểm bằng {DEMO_EVENTS} mốc thì chừng một người sẽ thấy
                  “{DEMO_WIN}/{DEMO_EVENTS} khớp” mà chẳng cần lá số nói đúng điều gì.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="kiem-chung"
        concept="Ghi trước khác nhìn lại ở chỗ nào"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Đoán trước tỉ số rồi mới xem đá bóng thì mới gọi là đoán. Xem xong trận rồi mới bảo
                {' '}“tôi biết ngay mà” thì {strong('ai cũng nói được')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Nhìn lại quá khứ thì bao giờ cũng khớp, vì bạn có tới hai lần được chọn{' '}
                  {strong('sau khi đã biết kết quả')}: chọn kể sự kiện nào, và chọn coi sự kiện ấy ứng
                  với dấu hiệu nào. Hai lần chọn ấy đủ để làm phồng bất kỳ tỉ lệ trúng nào.
                </p>
                <p>
                  Ghi trước cắt cả hai. Khi lời tiên đoán đã nằm trên giấy kèm ngày tháng, bạn không
                  chọn lại được nữa: kết quả chỉ còn hai đường — {strong('ứng')} hoặc{' '}
                  {strong('không ứng')} — và cả hai đều phải được đếm.
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
                  Công cụ Bằng Chứng chặn lần chọn thứ hai bằng cách{' '}
                  {strong('khoá bảng lĩnh vực → cung trong mã nguồn')}: bạn khai lĩnh vực và năm
                  trước, hệ thống không được phép chọn cung sau khi thấy lá số. Riêng “mất mát” buộc
                  phải khai mất gì, vì mất mát không có một cung cố định — không khai thì công cụ trả
                  về “thiếu thông tin” chứ không tự gán.
                </p>
                <p>
                  Nhưng khoá bảng chỉ chặn được lần chọn thứ hai. Lần chọn thứ nhất — bạn khai năm
                  nào — vẫn còn nguyên, nên {strong('backtest mãi mãi là hồi cứu')}. Đó là lý do công
                  cụ có thêm phần dự báo {FORECAST_COUNT} lĩnh vực cho vài năm tới và một{' '}
                  {strong('sổ theo dõi đóng dấu ngày ghi')}: chỉ phần đó mới là ghi trước thật.
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
    prompt:
      'Một khẳng định thế nào thì gọi là “khả sai”? Nêu một câu KHÔNG khả sai và viết lại cho khả sai.',
    answer: (
      <>
        Khả sai nghĩa là bạn {strong('nêu trước được ít nhất một quan sát')} mà nếu nó xảy ra thì
        khẳng định đó sai. Ví dụ câu không khả sai: “năm nay tài chính của bạn có biến động” — tăng
        cũng đúng, giảm cũng đúng, nên không kết cục nào bác bỏ được nó. Viết lại: “tổng thu nhập năm
        sau của tôi thấp hơn năm nay” — bảng lương cuối năm bác bỏ được ngay. Lưu ý: khả sai không có
        nghĩa là sai; nó chỉ là điều kiện để câu đó {strong('đáng đem đi kiểm')}.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt:
      'Dự đoán A trúng 70% số lần, chuyện đó vốn xảy ra 70% số lần. Dự đoán B trúng 40%, chuyện đó vốn chỉ xảy ra 5%. Cái nào mang nhiều thông tin hơn?',
    choices: [
      {
        text: 'A — vì tỉ lệ trúng cao hơn hẳn',
        note: 'Không. A trúng đúng bằng mức tự xảy ra, tức thêm được 0 thông tin: nói hay không nói cũng vậy.',
      },
      {
        text: 'B — vì nó trúng gấp 8 lần tỉ lệ nền, còn A chỉ bằng đúng nền',
        correct: true,
        note: 'Đúng. Câu hỏi cần hỏi là “trúng hơn nền bao nhiêu lần”, không phải “trúng bao nhiêu phần trăm”.',
      },
      {
        text: 'Bằng nhau — cả hai đều là dự đoán về tương lai',
        note: 'Không. Cùng là dự đoán, nhưng giá trị thông tin khác hẳn nhau vì tỉ lệ nền khác hẳn nhau.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Trong công cụ Bằng Chứng, “tỉ lệ nền” của một cung được tính bằng cách nào?',
    choices: [
      {
        text: `Đếm trong ${STEM_COUNT} can năm có mấy can khiến một sao Tứ Hóa rơi thẳng vào cung đó, tính từ chính lá số của bạn`,
        correct: true,
        note: `Đúng — tính thẳng từ bảng can → Tứ Hóa đã khoá và vị trí sao trong lá số bạn, không phải số trung bình của ai khác. Ra ${DEMO_HITS}/${STEM_COUNT} nghĩa là cung ấy tự "sáng" khoảng một nửa số năm.`,
      },
      {
        text: 'Lấy tỉ lệ trúng trung bình của tất cả người dùng đã tự kiểm trước bạn',
        note: 'Không. hieu.asia chưa công bố con số nào từ dữ liệu người dùng — trang Độ chính xác đang ghi "đang thu thập".',
      },
      {
        text: 'Là một hằng số 50% cho mọi cung',
        note: 'Không. Nó khác nhau theo từng cung và theo từng lá số, vì phụ thuộc các sao nào nằm ở cung nào trong lá số của bạn.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Vì sao nhìn lại quá khứ thì lời tiên đoán nào cũng có vẻ khớp?',
    choices: [
      {
        text: 'Vì quá khứ đã xảy ra rồi nên nó thật hơn tương lai',
        note: 'Không liên quan. Vấn đề không nằm ở quá khứ, mà nằm ở việc bạn được chọn sau khi đã biết kết quả.',
      },
      {
        text: 'Vì bạn chọn sự kiện nào để kể SAU khi đã sống qua chúng, và (nếu không khoá bảng) còn chọn được cả cách đọc cho hợp',
        correct: true,
        note: `Đúng — hai lần chọn sau đều làm phồng tỉ lệ trúng. Trong một lá số có ${PALACE_COUNT} cung, mỗi năm ${HOA_COUNT} sao Tứ Hóa rơi xuống, cộng cung đại vận và các cung hội chiếu: luôn có một chỗ đang "sáng" để chỉ vào.`,
      },
      {
        text: 'Vì trí nhớ con người rất chính xác về các mốc lớn',
        note: 'Ngược lại là đằng khác — nhưng kể cả nhớ chính xác thì việc CHỌN mốc nào để kể vẫn đủ làm lệch kết quả.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: `Bạn khai ${DEMO_EVENTS} sự kiện, ${DEMO_WIN} cái được chấm là khớp, tỉ lệ nền trung bình ${vnNumber(DEMO_RATE * 100)}%. Con số đó nói lên điều gì?`,
    answer: (
      <>
        Nói lên rất ít. Ở mức nền {vnNumber(DEMO_RATE * 100)}%, số lần khớp{' '}
        {strong('kỳ vọng')} đã là {vnNumber(DEMO_EXPECTED)} — tức {DEMO_WIN} chỉ hơn kỳ vọng đúng
        một. Xác suất khớp từ {DEMO_WIN}/{DEMO_EVENTS} trở lên{' '}
        {strong('thuần do ngẫu nhiên')} là {DEMO_CHANCE_LABEL}%, khoảng một phần ba. Kết luận đúng là{' '}
        {strong('“chưa nói được gì”')}, không phải “khá chuẩn”. Muốn có gì để đọc thì cần nhiều mốc
        hơn hẳn, và cần phần ghi trước.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Sổ theo dõi dự báo của công cụ chỉ lưu những dự báo ở mức “nhấn mạnh”. Vì sao?',
    choices: [
      {
        text: 'Để sổ gọn hơn cho dễ nhìn',
        note: 'Không phải lý do. Đây là quyết định về tính trung thực của con số, không phải về giao diện.',
      },
      {
        text: 'Vì mức “một phần” theo thiết kế đã gần mức ngẫu nhiên — đưa vào sổ sẽ thổi phồng tỉ lệ trúng',
        correct: true,
        note: 'Đúng. Một mức chớm nhẹ không phải khẳng định khả sai, nên đếm nó là tự cho điểm miễn phí.',
      },
      {
        text: 'Vì mức “một phần” không tính được',
        note: 'Không — nó vẫn được tính và vẫn hiện trên màn hình; chỉ là không được đưa vào sổ theo dõi.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt:
      'Một dự báo đã ghi trước tới hạn mà không xảy ra. Người xem nói “chưa tới lúc thôi”. Nên đọc câu này thế nào?',
    choices: [
      {
        text: 'Hợp lý — vận số có thể tới muộn',
        note: 'Nếu chấp nhận lý lẽ này thì không còn kết cục nào bác bỏ được dự báo nữa — và lời tiên đoán mất sạch giá trị thông tin.',
      },
      {
        text: 'Đây là cửa thoát hiểm: nó biến một câu vốn khả sai thành câu không thể sai — phải đếm là “không xảy ra”',
        correct: true,
        note: 'Đúng. Chỗ này là ranh giới giữa kiểm chứng và tự trấn an. Muốn dời hạn thì phải ghi hạn mới TRƯỚC, và ghi luôn rằng lần trước đã trượt.',
      },
      {
        text: 'Nên xoá dự báo đó khỏi sổ cho đỡ nhiễu',
        note: 'Không. Xoá phần trượt là cách nhanh nhất để biến một phép đo thành một quảng cáo.',
      },
    ],
  },
];

export function KiemChungRecall() {
  return <ActiveRecall topicId="kiem-chung" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'kha-sai',
    facet: 'Khả sai',
    can: 'Nói được vì sao một khẳng định phải nêu trước điều sẽ bác bỏ nó, và nhận ra ba kiểu làm mất tính khả sai: từ ngữ co giãn, thiếu mốc thời gian và ngưỡng, cửa thoát hiểm gắn kèm.',
  },
  {
    id: 'viet-lai',
    facet: 'Viết lại',
    can: 'Cầm một lời tiên đoán chung chung bất kỳ và viết lại thành câu kiểm được — có mốc thời gian, có ngưỡng, và nói rõ quan sát nào sẽ chứng minh nó sai.',
  },
  {
    id: 'ti-le-nen',
    facet: 'Tỉ lệ nền',
    can: 'Giải thích vì sao phải so tỉ lệ trúng với tỉ lệ nền chứ không phải với 0, và chỉ ra được trường hợp một dự đoán “trúng 70%” mang ít thông tin hơn một dự đoán “trúng 40%”.',
  },
  {
    id: 'doc-con-so',
    facet: 'Đọc con số',
    can: `Nhìn kết quả "khớp ${DEMO_WIN}/${DEMO_EVENTS}" ở mức nền một nửa và nói đúng rằng khoảng ${DEMO_CHANCE_LABEL}% khả năng nó thuần do ngẫu nhiên — nên chưa kết luận được gì.`,
  },
  {
    id: 'ghi-truoc',
    facet: 'Ghi trước',
    can: 'Phân biệt hồi cứu với ghi trước, chỉ ra hai chỗ tự do làm phồng tỉ lệ trúng khi nhìn lại, và tự ghi được một dự báo kèm ngày tháng để sau này đối chiếu công bằng.',
  },
  {
    id: 'cong-cu',
    facet: 'Công cụ làm gì',
    can: 'Nói đúng công cụ Bằng Chứng thật sự có những phần nào: khoá bảng lĩnh vực → cung từ trước, chấm cơ học bốn mức, hiện tỉ lệ nền từng cung, hiện cả lần trượt, dự báo vài năm tới, sổ theo dõi trên máy bạn, và hàng dữ liệu ẩn danh để đo về sau.',
  },
  {
    id: 'chua-co-gi',
    facet: 'Chưa có gì',
    can: 'Biết hieu.asia CHƯA công bố con số độ chính xác nào, và nói được vì sao công bố sớm “cho đẹp” lại là chuyện phải tránh.',
  },
  {
    id: 'gioi-han',
    facet: 'Giới hạn',
    can: 'Nói thẳng rằng tự kiểm vài sự kiện chỉ đủ để bớt cả tin, không đủ để kết luận hệ nào đúng — và kể được cần gì mới kết luận được (mẫu lớn, nhóm đối chứng, phương pháp công bố trước).',
  },
  {
    id: 'khong-hoai-nghi',
    facet: 'Không bác bừa',
    can: 'Giải thích vì sao kiểm chứng phải đối xử với “trúng” và “trượt” như nhau, nên nó chặn cả việc tin bừa lẫn việc bác bừa.',
  },
  {
    id: 'day-lai',
    facet: 'Dạy lại',
    can: 'Giải thích cho một người thân trong một phút, bằng lời thường: vì sao “thấy đúng” chưa phải bằng chứng, và một câu hỏi duy nhất nên hỏi trước khi tin.',
  },
];

export function KiemChungChecklist() {
  return <UnderstandingChecklist topicId="kiem-chung" facets={FACETS} />;
}

export function KiemChungWhys() {
  return (
    <FiveWhys
      topicId="kiem-chung"
      start={
        <>
          Một người tự kiểm lá số bằng {DEMO_EVENTS} mốc quá khứ, thấy {DEMO_WIN} mốc được chấm là
          khớp. Người ấy kết luận: “vậy là lá số chuẩn rồi”, và bắt đầu dùng lá số để quyết những
          việc lớn.
        </>
      }
      chain={[
        {
          question: `Vì sao khớp ${DEMO_WIN}/${DEMO_EVENTS} chưa đủ để kết luận?`,
          because: (
            <>
              Vì con số ấy chưa được đặt cạnh {strong('mức ngẫu nhiên')}. Ở tỉ lệ nền{' '}
              {vnNumber(DEMO_RATE * 100)}%, số lần khớp kỳ vọng đã là {vnNumber(DEMO_EXPECTED)}, và
              khả năng khớp từ {DEMO_WIN}/{DEMO_EVENTS} trở lên thuần do ngẫu nhiên là{' '}
              {DEMO_CHANCE_LABEL}%. Một kết quả xảy ra khoảng một phần ba số lần thì không phải bằng
              chứng.
            </>
          ),
        },
        {
          question: 'Vì sao mức ngẫu nhiên lại không phải là 0?',
          because: (
            <>
              Vì cung nào cũng có sẵn cơ hội “sáng”. Tính trên chính lá số ấy: có {STEM_COUNT} can
              năm, mỗi năm phóng ra {HOA_COUNT} sao Tứ Hóa; một cung điển hình bị chiếu tới ở{' '}
              {DEMO_HITS}/{STEM_COUNT} số can năm. {strong('Nền là một nửa, không phải 0')} — nên nửa
              số lần “khớp” đã được tặng miễn phí.
            </>
          ),
        },
        {
          question: 'Vì sao nhìn lại quá khứ thì tỉ lệ khớp còn phồng thêm nữa?',
          because: (
            <>
              Vì bạn được chọn {strong('hai lần, sau khi đã biết kết quả')}: chọn kể năm nào, và chọn
              coi sự kiện ấy ứng với dấu hiệu nào. Trong {PALACE_COUNT} cung luôn có một chỗ đang
              sáng, nên nếu được tự do gán thì tìm ra chỗ khớp là chuyện gần như chắc chắn.
            </>
          ),
        },
        {
          question: 'Công cụ đã khoá bảng lĩnh vực → cung từ trước, vậy còn thiếu gì?',
          because: (
            <>
              Khoá bảng chỉ chặn được lần chọn thứ hai. Lần chọn thứ nhất vẫn còn:{' '}
              {strong('bạn quyết định khai năm nào')}. Trí nhớ giữ lại những năm có chuyện và bỏ qua
              những năm phẳng lặng, nên mẫu bạn đưa vào đã lệch trước cả khi phép chấm bắt đầu.
            </>
          ),
        },
        {
          question: 'Vì sao chỉ “ghi trước” mới cắt được chỗ lệch ấy?',
          because: (
            <>
              Vì khi dự báo đã nằm trên giấy kèm ngày ghi, {strong('không còn gì để chọn lại')}: năm
              đã cố định, lĩnh vực đã cố định, và chỉ có hai kết cục — ứng hoặc không ứng — mà cả hai
              đều bị đếm. Đó là lý do sổ theo dõi đóng dấu ngày lưu và chỉ cho đánh giá những năm đã
              tới.
            </>
          ),
        },
      ]}
      root={
        <>
          “Thấy đúng” không phải bằng chứng; {strong('trúng hơn nền, có ghi trước, và đếm cả phần trượt')}{' '}
          mới là. Người trong ví dụ chưa sai khi thấy lá số thú vị — chỉ sai ở bước biến một con số
          chưa nói được gì thành căn cứ để quyết việc lớn. Cách xử lý đúng: giữ lá số như một góc
          nhìn, ghi vài dự báo có hạn, rồi vài năm nữa quay lại đọc cả phần ứng lẫn phần không.
        </>
      }
    />
  );
}
