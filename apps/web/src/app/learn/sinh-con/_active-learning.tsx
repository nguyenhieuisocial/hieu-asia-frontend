/**
 * Nội dung "học chủ động" cho trang /learn/sinh-con — bài CHÍNH THỨC về việc chọn
 * năm sinh con theo mệnh.
 *
 * GROUNDING — mọi can chi, mệnh và nhãn quan hệ trên file này đều SUY TẠI RUNTIME:
 *   • lib/sinh-con.ts — yearProfile(), checkParentChild(), zodiacRelationTable(),
 *     PARENT_CHILD_COPY (SÁU nhóm quan hệ con giáp mà công cụ phân biệt).
 *   • lib/dat-ten-ngu-hanh.ts — ELEMENTS (5 hành) để đọc tên mệnh.
 *
 * CÔNG CỤ /sinh-con LÀM GÌ (đọc code, không đoán): BA ô, đều theo NĂM ÂM nhưng không
 * cùng kiểu — năm bé là ô CHỌN chỉ mở đúng ba năm (CHILD_YEARS trong SinhConChecker),
 * năm sinh mẹ và năm sinh bố là hai ô NHẬP số (1900–2100, literal trong parseYear() và
 * parseYear() KHÔNG chạy cho ô năm bé); trả can chi + con giáp + nạp âm + mệnh
 * của bé, rồi đối chiếu TỪNG phụ huynh với bé theo HAI lớp (quan hệ 12 con giáp; tương
 * sinh – tương khắc giữa hai mệnh nạp âm). KHÔNG nhận tháng/ngày/giờ sinh, KHÔNG nhận
 * giới tính, KHÔNG nhận tuổi mẹ / sức khoẻ / kinh tế, KHÔNG chấm điểm, KHÔNG xếp hạng
 * năm, KHÔNG đối chiếu bố với mẹ, KHÔNG lập lá số cho bé.
 *
 * PHẠM VI: KHÔNG dạy lại cách dựng nạp âm (bài /learn/nap-am), KHÔNG dạy lại hình học
 * vòng 12 chi (bài /learn/tam-hop-luc-xung), KHÔNG dạy đặt tên hợp mệnh
 * (bài /learn/dat-ten-ngu-hanh).
 *
 * Giọng: bảng tra là nét văn hoá để tham khảo, không phải tiêu chí sàng lọc. Lõi đạo
 * đức: sức khoẻ mẹ, tuổi mẹ, điều kiện kinh tế và sự sẵn sàng của cả hai người quan
 * trọng hơn mọi bảng tra; tuyệt đối không dùng bảng này để trách một đứa trẻ đã sinh.
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
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import {
  yearProfile,
  checkParentChild,
  zodiacRelationTable,
  PARENT_CHILD_COPY,
  type RelationTone,
} from '@/lib/sinh-con';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Suy dữ kiện từ lib (không gõ tay con số nào ngoài các năm ví dụ) ──────────

/** Năm bé dùng làm ví dụ xuyên suốt bài — cùng năm với page.tsx. */
const FOCUS_YEAR = 2027;
/** Hai năm sinh phụ huynh ví dụ — chọn để hai lớp đối chiếu KHÔNG cùng hướng. */
const MOTHER_YEAR = 1996;
const FATHER_YEAR = 1993;

/**
 * Bản sao có chủ đích của `CHILD_YEARS` trong SinhConChecker.tsx (const nội bộ, không export
 * nên không import được). Ô năm bé là ô CHỌN và chỉ mở đúng những năm này.
 */
const TOOL_CHILD_YEARS = [2026, 2027, 2028] as const;
const YEAR_FIRST = TOOL_CHILD_YEARS[0];
const YEAR_LAST = TOOL_CHILD_YEARS[TOOL_CHILD_YEARS.length - 1];

/** Số ô của công cụ: 1 ô chọn năm bé + 2 ô nhập năm sinh mẹ / bố. */
const PARENT_INPUT_COUNT = 2;
const INPUT_COUNT = PARENT_INPUT_COUNT + 1;

const FOCUS = yearProfile(FOCUS_YEAR);
const FOCUS_CANCHI = FOCUS?.canChi ?? '—';
const FOCUS_TEN = FOCUS?.zodiac.ten ?? '—';
const FOCUS_NAPAM = FOCUS?.napAmName ?? '—';
const FOCUS_MENH = FOCUS ? ELEMENTS[FOCUS.element].name : '—';

const TONE_LABEL: Record<RelationTone, string> = {
  hop: 'hợp',
  'luu-y': 'lưu ý',
  'trung-tinh': 'trung tính',
};

/** Sáu nhóm quan hệ con giáp mà công cụ phân biệt. */
const RELATION_LABELS = Object.values(PARENT_CHILD_COPY).map((c) => c.label);
const RELATION_COUNT = RELATION_LABELS.length;

/** 12 con giáp bố/mẹ × quan hệ với bé sinh năm FOCUS_YEAR. */
const ZODIAC_ROWS = zodiacRelationTable(FOCUS_YEAR);
const ZODIAC_COUNT = ZODIAC_ROWS.length;

const countTone = (tone: RelationTone) => ZODIAC_ROWS.filter((r) => r.copy.tone === tone).length;

const COUNT_HOP = countTone('hop');
const COUNT_LUU_Y = countTone('luu-y');
const COUNT_TRUNG_TINH = countTone('trung-tinh');

/** Đối chiếu hai phụ huynh ví dụ với bé — dùng lại đúng hàm mà công cụ gọi. */
const ME_CHECK = checkParentChild(MOTHER_YEAR, FOCUS_YEAR);
const BO_CHECK = checkParentChild(FATHER_YEAR, FOCUS_YEAR);

const ME_TEN = ME_CHECK?.parent.zodiac.ten ?? '—';
const BO_TEN = BO_CHECK?.parent.zodiac.ten ?? '—';
const ME_RELATION = ME_CHECK?.relationCopy.label ?? '—';
const BO_RELATION = BO_CHECK?.relationCopy.label ?? '—';
const ME_MENH = ME_CHECK ? ELEMENTS[ME_CHECK.parent.element].name : '—';
const BO_MENH = BO_CHECK ? ELEMENTS[BO_CHECK.parent.element].name : '—';
const ME_TONE = ME_CHECK ? TONE_LABEL[ME_CHECK.relationCopy.tone] : '—';
const BO_TONE = BO_CHECK ? TONE_LABEL[BO_CHECK.relationCopy.tone] : '—';
const ME_MENH_TONE = ME_CHECK ? TONE_LABEL[ME_CHECK.menh.tone] : '—';
const BO_MENH_TONE = BO_CHECK ? TONE_LABEL[BO_CHECK.menh.tone] : '—';

/** Số hành trong vòng ngũ hành — đọc từ ELEMENTS thay vì gõ tay. */
const ELEMENT_COUNT = Object.keys(ELEMENTS).length;

/**
 * Con giáp bố/mẹ thật sự ở thế Lục Xung với bé sinh FOCUS_YEAR — dùng cho kịch bản
 * FiveWhys, để "xung tuổi bố" trong truyện là một trường hợp engine sinh ra được
 * chứ không phải một con giáp bịa.
 */
const XUNG_ROW = ZODIAC_ROWS.find((r) => r.kind === 'luc-xung');
const XUNG_TEN = XUNG_ROW?.zodiac.ten ?? '—';
const XUNG_LABEL = XUNG_ROW?.copy.label ?? '—';

export function SinhConFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Hai vợ chồng đang tính chuyện có em bé, và ai đó trong nhà nói{' '}
          {strong('“năm đó không hợp tuổi bố, chờ sang năm đi”')}. Không ai nói rõ câu đó được tính
          ra từ đâu, dựa trên dữ kiện gì, và nó đáng nặng bao nhiêu so với những thứ khác đang phải
          cân nhắc.
        </>
      }
      why={
        <>
          Vì đây là chỗ một phép tra phong tục có thể {strong('gây thiệt hại thật')}: dời một năm
          sinh không giống dời một buổi khai trương — mẹ thêm một tuổi, kế hoạch của cả nhà xê dịch,
          và trong vài trường hợp là thêm rủi ro y khoa. Hiểu đúng cơ chế giúp bạn cân đúng trọng
          lượng của nó.
        </>
      }
      what={
        <>
          Công cụ tra {strong('con giáp và mệnh nạp âm')} của bé theo năm sinh âm lịch, rồi đối
          chiếu với tuổi bố mẹ theo hai lớp: quan hệ {ZODIAC_COUNT} con giáp, và tương sinh – tương
          khắc giữa hai mệnh. Nó có đúng {INPUT_COUNT} ô, mỗi ô một con số năm: một ô{' '}
          {strong('chọn')} năm bé (hiện chỉ mở {TOOL_CHILD_YEARS.length} năm {YEAR_FIRST}–
          {YEAR_LAST}) và {PARENT_INPUT_COUNT} ô nhập năm sinh của mẹ và của bố.
        </>
      }
      how={
        <>
          Đặt nhãn của bé cạnh nhãn của từng phụ huynh rồi đọc quan hệ. Lớp con giáp cho{' '}
          {RELATION_COUNT} nhóm; lớp mệnh cho quan hệ sinh – khắc trên vòng {ELEMENT_COUNT} hành.
          Hai lớp hiển thị {strong('cạnh nhau, không cộng lại')} — công cụ không chấm điểm và không
          xếp hạng năm nào tốt hơn.
        </>
      }
      soWhat={
        <>
          Để bạn đọc kết quả như một {strong('nét văn hoá')} chứ không phải một cánh cửa sàng lọc:
          biết nó không hề nhận dữ kiện về sức khoẻ mẹ, tuổi mẹ, kinh tế hay sự sẵn sàng của hai
          người — và biết {strong('tuyệt đối không dùng nó để trách một đứa trẻ đã sinh ra')}.
        </>
      }
    />
  );
}

export function SinhConDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="sinh-con"
        concept="“Hợp tuổi bố mẹ” thật ra được tính bằng gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi năm có một con vật và một “màu” riêng. Em bé sinh năm nào thì mang con vật và
                màu của năm đó. Bố mẹ cũng vậy. Người ta đặt các con vật và các màu cạnh nhau xem
                chúng {strong('có thích nhau không')} — giống như xếp chỗ ngồi trong lớp.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi năm âm lịch có một cặp can chi. Từ cặp đó ra {strong('con giáp')} của năm và{' '}
                  {strong('mệnh nạp âm')} của năm. Bé sinh năm {FOCUS_YEAR} là năm {FOCUS_CANCHI},
                  tuổi {FOCUS_TEN}, nạp âm {FOCUS_NAPAM}, tức mệnh {FOCUS_MENH}.
                </p>
                <p>
                  “Hợp tuổi bố mẹ” chỉ là đặt hai nhãn ấy cạnh nhãn của bố và của mẹ rồi đọc quan
                  hệ: con giáp cùng nhóm hay đối nhau, mệnh sinh nhau hay khắc nhau. Không có phép
                  tính nào khác, và {strong('không có ô nào để nhập thêm dữ kiện')}.
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
                  Trong mã của hieu.asia, một người được mô tả bằng đúng một số nguyên: năm âm lịch.
                  Từ đó suy ra can chi, con giáp, tên nạp âm và hành của nạp âm. Quan hệ bố/mẹ – bé
                  được phân thành {RELATION_COUNT} nhóm ở lớp con giáp, và đọc theo vòng sinh – khắc
                  ở lớp mệnh. {strong('Không tham số nào khác')} — không tháng, không ngày, không
                  giờ, không giới tính.
                </p>
                <p>
                  Hệ quả cần nhớ: mọi em bé sinh cùng một năm âm lịch có cùng con giáp và cùng mệnh.
                  Đây là {strong('lát cắt thô nhất')} trong các phép tra, nên kết quả không thể nói
                  điều gì riêng về một gia đình cụ thể — nó chỉ mô tả quan hệ giữa các nhãn lịch.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="sinh-con"
        concept="Hai lớp — và vì sao chúng không được cộng lại"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có hai người chấm bài, và họ chấm hai môn khác nhau. Người thứ nhất chấm{' '}
                {strong('con vật')}, người thứ hai chấm {strong('màu')}. Đôi khi một người khen, một
                người lắc đầu — và không ai cộng hai điểm ấy lại thành một.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lớp thứ nhất nhìn con giáp và chia thành {RELATION_COUNT} nhóm:{' '}
                  {RELATION_LABELS[0]}, {RELATION_LABELS[1]}, {RELATION_LABELS[2]},{' '}
                  {RELATION_LABELS[3]}, {RELATION_LABELS[4]}, {RELATION_LABELS[5]}. Lớp thứ hai nhìn
                  mệnh nạp âm và đọc theo vòng {ELEMENT_COUNT} hành: bên nào sinh bên nào, hay hai
                  bên khắc nhau.
                </p>
                <p>
                  Hai lớp {strong('không bắt buộc cùng sắc thái')}. Với bé sinh {FOCUS_CANCHI}, mẹ
                  tuổi {ME_TEN} ở nhóm {ME_RELATION} ({ME_TONE}) tại lớp con giáp nhưng lớp mệnh của
                  mẹ lại là {ME_MENH_TONE}; bố tuổi {BO_TEN} ở nhóm {BO_RELATION} ({BO_TONE}) mà lớp
                  mệnh lại là {BO_MENH_TONE}. Công cụ hiển thị cả hai dòng, để nguyên như vậy.
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
                  Hai lớp đến từ hai hệ khác nhau: vòng {ZODIAC_COUNT} địa chi, và vòng{' '}
                  {ELEMENT_COUNT} hành thông qua bảng nạp âm. Không truyền thống nào quy định tỉ
                  trọng giữa chúng, nên{' '}
                  {strong('mọi con số tổng đều là do người viết công cụ đặt ra')}. Đó là lý do
                  hieu.asia không xuất một điểm số “hợp bao nhiêu phần trăm”.
                </p>
                <p>
                  Đây cũng là chỗ dễ nhận ra công cụ nào đang bán niềm tin: một con số duy nhất luôn
                  dễ tin hơn hai dòng mâu thuẫn, nhưng nó được tạo ra bằng cách{' '}
                  {strong('giấu đi phần mâu thuẫn')}. Khi hai lớp ngược nhau, câu trả lời trung thực
                  là quan niệm xưa không có kết luận cho trường hợp đó.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="sinh-con"
        concept="Vì sao bảng tra không đủ tư cách quyết định chuyện sinh con"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Bảng này chỉ biết đúng {strong('một điều')}: mọi người sinh năm nào. Nó không biết
                mẹ có khoẻ không, nhà có đủ chỗ cho em bé không, bố mẹ đã sẵn sàng chưa. Người biết
                những điều ấy là bác sĩ và chính hai người.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Công cụ có {INPUT_COUNT} ô, mỗi ô một con số năm — một ô chọn năm bé trong{' '}
                  {TOOL_CHILD_YEARS.length} năm đang mở, {PARENT_INPUT_COUNT} ô nhập năm sinh của
                  mẹ và của bố. Nghĩa là nó{' '}
                  {strong('không có chỗ để nhận')} sức khoẻ của mẹ, tuổi của mẹ khi mang thai, điều
                  kiện kinh tế của gia đình, hay việc hai người đã thật sự muốn chưa.
                </p>
                <p>
                  Nhưng đúng bốn thứ đó mới ảnh hưởng thật tới một lần sinh nở và tới những năm đầu
                  đời của em bé. Bảng tra im lặng về chúng không phải vì chúng nhỏ, mà vì{' '}
                  {strong('phép tính không chứa được chúng')}.
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
                  Đặt cạnh nhau hai vế của việc dời năm sinh cho “hợp tuổi”: bên chi phí là{' '}
                  {strong('rủi ro thai sản tăng theo tuổi mẹ')} — một đại lượng y học đo được; bên
                  lợi ích là việc trùng nhóm con giáp — chưa có phép đo nào. Đổi một thứ đo được lấy
                  một thứ không đo được là một cuộc trao đổi tồi, và nó tồi hơn nữa khi mẹ đã lớn
                  tuổi.
                </p>
                <p>
                  Vì vậy thứ tự đúng là: quyết bằng sức khoẻ, tuổi, kinh tế và sự sẵn sàng trước —
                  rồi mới mở bảng tra nếu vẫn thấy vui.{' '}
                  {strong('Nếu bảng tra đang là lý do dời quyết định thì thứ tự đã bị đảo ngược')}.
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
    prompt: 'Công cụ sinh con nhận những dữ kiện gì — và KHÔNG nhận những gì?',
    answer: (
      <>
        Nhận đúng {INPUT_COUNT} ô, mỗi ô là {strong('một con số năm âm lịch')}: một ô chọn năm bé
        dự kiến sinh (hiện chỉ mở {TOOL_CHILD_YEARS.length} năm {YEAR_FIRST}–{YEAR_LAST}, không
        gõ được năm khác), rồi {PARENT_INPUT_COUNT} ô nhập năm sinh mẹ và năm sinh bố. Không nhận
        tháng, ngày hay giờ sinh, không nhận giới tính, và
        không có ô nào cho sức khoẻ của mẹ, tuổi mẹ khi sinh, điều kiện kinh tế hay sự sẵn sàng của
        hai người. Vì vậy kết quả chỉ mô tả quan hệ giữa các nhãn lịch, không nói gì về một gia đình
        cụ thể.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Công cụ đối chiếu bố mẹ với bé theo mấy lớp, và đó là những lớp nào?',
    choices: [
      {
        text: `Hai lớp: quan hệ ${ZODIAC_COUNT} con giáp giữa tuổi bố/mẹ và tuổi bé, và tương sinh – tương khắc giữa hai mệnh nạp âm`,
        correct: true,
        note: 'Đúng — và hai lớp được hiển thị cạnh nhau chứ không cộng thành một điểm số.',
      },
      {
        text: 'Một lớp duy nhất là mệnh nạp âm, con giáp chỉ để hiển thị cho vui',
        note: `Không — lớp con giáp là một phép tính thật, chia quan hệ thành ${RELATION_COUNT} nhóm và ảnh hưởng trực tiếp tới dòng kết quả.`,
      },
      {
        text: 'Ba lớp: con giáp, mệnh nạp âm, và lá số Bát Tự của bé',
        note: 'Không — công cụ không lập lá số hay Bát Tự cho bé. Nó chỉ chạy trên năm âm lịch.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: `Trong ${ZODIAC_COUNT} con giáp mà bố hoặc mẹ có thể mang, với một em bé sinh năm ${FOCUS_CANCHI} thì bao nhiêu con giáp rơi vào nhóm cần lưu ý?`,
    choices: [
      {
        text: `${COUNT_LUU_Y} con giáp — phần còn lại là ${COUNT_HOP} thuộc nhóm hợp và ${COUNT_TRUNG_TINH} thuộc nhóm trung tính`,
        correct: true,
        note: 'Đúng. Phần lớn tổ hợp không được xếp vào nhóm hợp mà cũng không bị xếp vào nhóm lưu ý — đó đã là câu trả lời cho phần lớn gia đình đang lo.',
      },
      {
        text: 'Khoảng một nửa, nên xác suất “không hợp” là rất cao',
        note: `Không — đếm lại bảng trong bài thì chỉ có ${COUNT_LUU_Y} trên ${ZODIAC_COUNT}. Cảm giác “rất cao” đến từ việc nhóm lưu ý được kể lại nhiều hơn.`,
      },
      {
        text: 'Không con giáp nào, vì bộ quy tắc đã bỏ hết các nhóm tiêu cực',
        note: 'Không — bộ quy tắc vẫn giữ đủ nhóm Lục Xung và Lục Hại, chỉ diễn giải chúng theo hướng “khác nhịp, cần dung hoà” thay vì hù doạ.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Vì sao công cụ không gộp hai lớp thành một điểm số “hợp bao nhiêu phần trăm”?',
    answer: (
      <>
        Vì hai lớp đến từ hai hệ khác nhau — vòng {ZODIAC_COUNT} địa chi và vòng {ELEMENT_COUNT}{' '}
        hành qua bảng nạp âm — và {strong('không truyền thống nào quy định tỉ trọng giữa chúng')}.
        Mọi con số tổng vì thế đều là do người viết công cụ tự đặt ra. Với bé sinh {FOCUS_CANCHI},
        mẹ tuổi {ME_TEN} ở nhóm {ME_RELATION} tại lớp con giáp ({ME_TONE}) trong khi lớp mệnh của mẹ
        lại là {ME_MENH_TONE}; bố tuổi {BO_TEN} thì ở nhóm {BO_RELATION} ({BO_TONE}) với lớp mệnh là{' '}
        {BO_MENH_TONE}. Hai lớp ngược hướng chính là dấu hiệu quan niệm xưa không có kết luận cho
        trường hợp đó.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Kết quả ra nhóm “lưu ý” cho một trong hai vợ chồng. Xử lý thế nào cho lành mạnh?',
    choices: [
      {
        text: 'Cứ theo kế hoạch — nhóm lưu ý chỉ là lời nhắc “khác nhịp, cần dung hoà”, nó không biết gì về sức khoẻ, tài chính hay sự sẵn sàng của hai người',
        correct: true,
        note: 'Đúng. Và dời năm là cái giá thật: thêm một năm chờ, mẹ thêm một tuổi khi mang thai.',
      },
      {
        text: 'Dời sang năm khác cho chắc, mất một năm cũng không sao',
        note: 'Mất một năm là mất thật, còn cái được thì nằm trong một quy ước lịch. Với người mẹ đã lớn tuổi, đây là cuộc trao đổi rất bất lợi.',
      },
      {
        text: 'Tìm dịch vụ hoá giải để đổi kết quả trước khi sinh',
        note: 'Không có gì để hoá giải, vì không có tác động nào được đo. Nỗi lo về tuổi con bị dùng để bán hàng là chỗ nên cảnh giác nhất.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt:
      'Một người họ hàng nói cháu bé sinh năm “xung tuổi bố” nên nhà mới làm ăn thất bát. Bạn trả lời sao?',
    choices: [
      {
        text: 'Bảng tra mô tả quan hệ giữa hai nhãn lịch và nói rõ không có chuyện con “khắc” cha mẹ; hơn nữa đứa trẻ không chọn năm sinh của mình',
        correct: true,
        note: 'Đúng — và quan hệ trong bảng là hai chiều, nên nếu đó là lỗi thì lỗi thuộc về cả hai phía như nhau. Chỉ đứa trẻ bị mang tiếng vì nó yếu thế nhất trong nhà.',
      },
      {
        text: 'Im lặng cho nhà yên, dù sao cũng chỉ là câu nói',
        note: 'Đứa trẻ nghe câu đó lặp lại sẽ tin. Đây là loại tổn thương kéo dài nhiều năm, không phải một câu nói thoáng qua.',
      },
      {
        text: 'Đưa cháu đi làm lễ đổi vận cho yên chuyện',
        note: 'Cách này thừa nhận tiền đề sai — rằng có gì đó ở đứa trẻ cần sửa. Vấn đề nằm ở cách người lớn dùng bảng tra, không nằm ở em bé.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt: `Vận dụng: bé dự kiến sinh ngày 20 tháng 1 dương lịch năm ${FOCUS_YEAR}. Tra theo năm nào, và vì sao dễ nhầm?`,
    answer: (
      <>
        Phải tra theo {strong('năm âm liền trước')}, không phải năm {FOCUS_YEAR}. Vì mốc đổi năm âm
        là mùng 1 Tết chứ không phải ngày 1 tháng 1 dương lịch, nên bé sinh trong tháng 1 hoặc đầu
        tháng 2 dương lịch, trước Tết, vẫn thuộc năm âm cũ. Nhầm chỗ này là lệch một con giáp và
        lệch luôn mệnh nạp âm — tức sai {strong('cả hai lớp')} cùng lúc. Lưu ý này áp dụng cho cả
        năm sinh của bố mẹ, không riêng năm của bé.
      </>
    ),
  },
];

export function SinhConRecall() {
  return <ActiveRecall topicId="sinh-con" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'inputs',
    facet: 'Đầu vào',
    can: `Nói được công cụ có đúng ${INPUT_COUNT} ô, mỗi ô là một con số năm âm lịch — trong đó ô năm bé là ô CHỌN chỉ mở ${TOOL_CHILD_YEARS.length} năm, còn ${PARENT_INPUT_COUNT} ô năm sinh bố mẹ mới là ô nhập tự do — và kể ra được những thứ nó hoàn toàn không nhận: tháng, ngày, giờ sinh, giới tính, sức khoẻ, kinh tế.`,
  },
  {
    id: 'two-layers',
    facet: 'Hai lớp đối chiếu',
    can: `Phân biệt lớp con giáp (${RELATION_COUNT} nhóm quan hệ giữa tuổi bố/mẹ và tuổi bé) với lớp mệnh nạp âm (sinh – khắc trên vòng ${ELEMENT_COUNT} hành), và biết mỗi lớp đọc ra từ đâu.`,
  },
  {
    id: 'no-score',
    facet: 'Không có điểm số',
    can: 'Giải thích vì sao công cụ không gộp hai lớp thành một con số, và vì sao một điểm số duy nhất lại đáng ngờ hơn là đáng tin.',
  },
  {
    id: 'distribution',
    facet: 'Đọc bảng 12 con giáp',
    can: `Đếm được với một năm sinh bất kỳ thì bao nhiêu con giáp bố mẹ rơi vào nhóm hợp, lưu ý và trung tính — và hiểu vì sao dời năm chỉ xoay bảng đi chứ không làm bảng rộng ra.`,
  },
  {
    id: 'lunar-boundary',
    facet: 'Mốc năm âm',
    can: 'Nhớ rằng cả hai lớp chạy trên năm âm lịch, năm âm đổi ở Tết, nên bé sinh trước Tết thuộc năm âm liền trước — và lệch chỗ này là sai cả hai lớp.',
  },
  {
    id: 'what-matters-more',
    facet: 'Thứ nặng hơn bảng tra',
    can: 'Kể được bốn thứ quan trọng hơn mọi bảng tra — sức khoẻ của mẹ, tuổi của mẹ, điều kiện kinh tế, sự sẵn sàng của cả hai người — và nói được vì sao công cụ không có chỗ nào để nhận chúng.',
  },
  {
    id: 'cost-of-delay',
    facet: 'Cái giá của việc dời năm',
    can: 'Đặt được hai vế cạnh nhau: rủi ro thai sản tăng theo tuổi mẹ là thứ đo được, còn lợi ích của việc trùng nhóm con giáp thì chưa ai đo được.',
  },
  {
    id: 'never-blame',
    facet: 'Ranh giới đạo đức',
    can: 'Nói thẳng được rằng bảng này tuyệt đối không dùng để trách một đứa trẻ đã sinh ra, và đưa ra được lý do: quan hệ trong bảng là hai chiều, và đứa trẻ không chọn năm sinh của mình.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút, bằng lời thường: công cụ tính gì, nó không biết gì, và vì sao không nên để nó quyết định thời điểm sinh con.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Nói được phần nào bạn chưa nắm — ví dụ vì sao một năm lại ứng với đúng tên nạp âm đó — và biết bài nào trên hieu.asia lấp phần ấy.',
  },
];

export function SinhConChecklist() {
  return <UnderstandingChecklist topicId="sinh-con" facets={FACETS} />;
}

export function SinhConWhys() {
  return (
    <FiveWhys
      topicId="sinh-con"
      start={
        <>
          Một cặp vợ chồng đã sẵn sàng đón con. Bố cầm tinh con {XUNG_TEN}, mà bé sinh năm{' '}
          {FOCUS_CANCHI} thì tuổi {XUNG_TEN} rơi đúng vào nhóm {XUNG_LABEL} — nghe nói vậy là{' '}
          {strong('không hợp tuổi bố')}, hai người quyết định lùi kế hoạch lại một năm. Người mẹ năm
          nay đã ngoài ba mươi.
        </>
      }
      chain={[
        {
          question: 'Vì sao lại nói là “không hợp tuổi bố”?',
          because: (
            <>
              Vì bé sinh năm {FOCUS_CANCHI} mang tuổi {FOCUS_TEN} và mệnh {FOCUS_MENH}; đặt cạnh
              tuổi và mệnh của bố, bộ quy tắc trả về một trong {RELATION_COUNT} nhóm ở lớp con giáp
              và một quan hệ sinh – khắc ở lớp mệnh. {strong('Đó là toàn bộ nội dung của câu nói')}{' '}
              — hai nhãn lịch đứng cạnh nhau.
            </>
          ),
        },
        {
          question: 'Vì sao một nhóm trong đó lại bị hiểu là điều xấu?',
          because: (
            <>
              Vì các nhóm mang tên nghe nặng — Lục Xung, Lục Hại — trong khi{' '}
              {strong('nội dung của chúng chỉ là “khác nhịp, cần dung hoà”')}. Chính lời diễn
              giải mà công cụ hiển thị cũng nói rõ không có chuyện con “khắc” hay mang lỗi với cha
              mẹ. Cái nặng nằm ở tên gọi, không nằm ở quy tắc.
            </>
          ),
        },
        {
          question: 'Vì sao người ta vẫn tin cái tên hơn là nội dung?',
          because: (
            <>
              Vì phép tra này {strong('không thể sai')}. Nhà nào cũng có năm khó; nếu năm khó rơi
              đúng vào lúc có bé thì cái nhãn được nhớ lại, còn hàng nghìn gia đình “xung tuổi” sống
              yên ổn thì không ai kể. Bộ đếm chỉ chạy một chiều — đó là cách mọi phép tra không kiểm
              được vẫn giữ được uy tín.
            </>
          ),
        },
        {
          question: 'Vậy lùi một năm thì đổi được gì?',
          because: (
            <>
              Không đổi được thứ đang lo, vì dời năm chỉ{' '}
              {strong('xoay bảng đi chứ không thoát khỏi bảng')}: năm mới có thể hợp với bố nhưng
              lại rơi vào nhóm lưu ý với mẹ. Trong {ZODIAC_COUNT} con giáp thì sườn đếm luôn giữ
              nguyên — mỗi con giáp luôn có đúng một bạn Lục Xung và một bạn Lục Hại.
            </>
          ),
        },
        {
          question: 'Còn cái mất thì là gì?',
          because: (
            <>
              {strong('Người mẹ thêm một tuổi khi mang thai')} — và rủi ro thai sản tăng theo tuổi
              mẹ là điều y học đo được, trong khi lợi ích của việc trùng nhóm con giáp thì chưa ai
              đo được. Cộng thêm một năm kế hoạch của cả nhà bị đẩy lùi. Cái mất là thật và cụ thể;
              cái được nằm trong một quy ước.
            </>
          ),
        },
      ]}
      root={
        <>
          Bảng đối chiếu là một nét văn hoá đẹp để gia đình thêm một góc nhìn, không phải một cánh
          cửa sàng lọc. Quyết bằng sức khoẻ của mẹ, tuổi của mẹ, điều kiện kinh tế và sự sẵn sàng
          của cả hai người trước — rồi mới mở bảng tra nếu vẫn thấy vui. Và dù kết quả ra sao,{' '}
          {strong('không bao giờ dùng nó để trách một đứa trẻ đã sinh ra')}: em bé không chọn năm
          sinh của mình.
        </>
      }
    />
  );
}
