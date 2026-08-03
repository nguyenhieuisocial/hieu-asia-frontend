/**
 * Nội dung "học chủ động" cho trang /learn/doc-mot-tuoi.
 *
 * NGUỒN GROUNDING (đọc code, không đoán) — công cụ đích là trang
 * `app/tra-cuu-tuoi/` gồm `page.tsx` + `TraCuuTuoi.tsx`. Mọi con số dưới đây
 * được suy TẠI RUNTIME bằng đúng những hàm mà `TraCuuTuoi.tsx` gọi:
 *   • lib/sinh-con.ts        — yearProfile(năm) → canChi, zodiac, napAmName, element
 *   • lib/dat-ten-ngu-hanh.ts— ELEMENTS[...]   → tên mệnh ngũ hành
 *   • lib/xem-tuoi-cuoi.ts   — CHI, canChiOfYear, checkKimLau, checkTamTai,
 *                              checkXungNam
 *   • lib/xem-tuoi-lam-nha.ts— checkHoangOc
 *   • lib/sao-han.ts         — computeSaoHan(năm, giới tính, năm xét)
 *   • lib/huong-nha.ts       — computeHuongNha(năm, giới tính), groupLabel
 *
 * CÔNG CỤ THẬT SỰ NHẬN GÌ: đúng HAI dữ kiện — NĂM sinh dương lịch và GIỚI TÍNH.
 * Không có ô ngày, không có ô tháng, không có ô giờ, và KHÔNG có ô chọn "năm
 * muốn xét": khối "Năm nay với tuổi này" luôn dùng `new Date().getFullYear()`.
 * Vì vậy bảng nhiều năm trong bài được nói rõ là "chạy lại cùng phép tính cho
 * nhiều năm", KHÔNG trình bày như một tính năng của công cụ.
 *
 * PHẠM VI: cơ chế từng hạn thuộc bài riêng — Kim Lâu, Tam Tai, sao hạn, nạp âm,
 * can chi mỗi thứ một bài; ở đây chỉ MỘT câu + link. Lõi riêng của bài này là
 * PHÂN LOẠI theo độ chắc: lịch–toán / phong tục / không suy được.
 *
 * Giọng: trung thực về giới hạn, không doạ, không phán số mệnh, không mỉa mai
 * người đọc.
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
import { CHI, canChiOfYear, checkKimLau, checkTamTai, checkXungNam } from '@/lib/xem-tuoi-cuoi';
import { checkHoangOc } from '@/lib/xem-tuoi-lam-nha';
import { yearProfile } from '@/lib/sinh-con';
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { computeSaoHan } from '@/lib/sao-han';
import { computeHuongNha, groupLabel } from '@/lib/huong-nha';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// ── Suy dữ kiện từ lib (không gõ tay con số nào) ─────────────────────

/** Độ dài vòng can chi, đo bằng chính canChiOfYear thay vì gõ "60". */
const CYCLE = (() => {
  const base = canChiOfYear(1900).name;
  for (let n = 1; n <= 240; n += 1) {
    if (canChiOfYear(1900 + n).name === base) return n;
  }
  return 0;
})();

/** Năm sinh làm ví dụ xuyên suốt bài. Đây là DỮ KIỆN ĐẦU VÀO, không phải kết quả. */
const BIRTH = 1990;
/** Năm bắt đầu của dãy năm đem ra đối chiếu. Cũng là dữ kiện đầu vào. */
const START_YEAR = 2026;

const P = yearProfile(BIRTH);
const CAN_CHI = P?.canChi ?? '—';
const ZODIAC = P?.zodiac.ten ?? '—';
const NAP_AM = P?.napAmName ?? '—';
const MENH = P ? ELEMENTS[P.element].name : '—';

/** Một vòng 12 năm kể từ START_YEAR — đủ để mọi chi năm xuất hiện đúng một lần. */
const EXAM_YEARS = Array.from({ length: CHI.length }, (_, i) => START_YEAR + i);

// checkKimLau trả `type?: KimLauType` — KHÔNG phạm là `undefined`, không phải
// null; so với null thì lọc nào cũng lọt hết và mọi con số dưới đây sẽ sai.
const KIM_LAU_YEARS = EXAM_YEARS.filter((y) => !!checkKimLau(BIRTH, y).type);
const TAM_TAI_YEARS = EXAM_YEARS.filter((y) => checkTamTai(BIRTH, y).isTamTai);

/** Năm mà cả bốn lớp hạn trong bảng của bài đều ghi "Không". */
const CLEAN_YEARS = EXAM_YEARS.filter((y) => {
  const x = checkXungNam(BIRTH, y);
  return !checkKimLau(BIRTH, y).type && !checkTamTai(BIRTH, y).isTamTai && !x.isXung
    && !x.isNamTuoi && !checkHoangOc(BIRTH, y).isPham;
});

/**
 * Năm dùng cho kịch bản "5 lần hỏi tại sao": lấy năm PHẠM đầu tiên trong dãy
 * thay vì gõ tay, để câu chuyện luôn khớp với thứ phép tính thật sự trả về.
 */
const KL_YEAR = KIM_LAU_YEARS[0] ?? START_YEAR;
const KIM_LAU_CASE = checkKimLau(BIRTH, KL_YEAR);

/** Cùng một năm sinh, đổi mỗi giới tính — hai lớp này đổi theo. */
const HUONG_NAM = computeHuongNha(BIRTH, 'nam');
const HUONG_NU = computeHuongNha(BIRTH, 'nu');
const SAO_NAM = computeSaoHan(BIRTH, 'nam', START_YEAR)?.sao.name ?? '—';
const SAO_NU = computeSaoHan(BIRTH, 'nu', START_YEAR)?.sao.name ?? '—';

export function DocMotTuoiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn nhập một năm sinh vào trang tra cứu, và màn hình trả về cả một trang: can chi, con
          giáp, nạp âm, mệnh, Kim Lâu, Tam Tai, Hoang Ốc, sao hạn, hướng nhà, màu hợp, nghề hợp.
          Câu hỏi không ai trả lời giúp bạn là:{' '}
          {strong('trong đống đó, cái nào chắc và cái nào chỉ là quy ước?')}
        </>
      }
      why={
        <>
          Vì mọi thứ hiện ra cùng một khuôn, cùng một cỡ chữ, nên trông chúng{' '}
          {strong('có vẻ chắc như nhau')}. Trên thực tế chúng thuộc những loại rất khác: một loại là
          phép chia ai làm cũng ra một kết quả, một loại là tục lệ truyền lại, và một loại thì từ năm
          sinh không suy ra được. Trộn ba loại đó lại là cách người ta bắt đầu hoãn cưới, hoãn xây
          nhà và trả tiền cho những thứ không cần trả.
        </>
      }
      what={
        <>
          Công cụ chỉ nhận đúng {strong('hai dữ kiện')}: năm sinh dương lịch và giới tính. Từ hai
          dữ kiện đó, kết quả tách được thành ba tầng: {strong('lịch–toán')} (can chi, con giáp, nạp
          âm, mệnh — suy bằng phép chia), {strong('phong tục')} (Kim Lâu, Tam Tai, Hoang Ốc, sao hạn,
          cung phi) và {strong('phần không suy được')} (giờ sinh, lá số, tính cách cụ thể).
        </>
      }
      how={
        <>
          Với mỗi dòng kết quả, hỏi đúng hai câu. Câu một:{' '}
          {strong('phép tính có ra một kết quả duy nhất không?')} Câu hai:{' '}
          {strong('kết quả ấy có nói gì về đời bạn không?')} Tầng lịch–toán trả lời có – không (nó
          chỉ là tên gọi của năm). Tầng phong tục trả lời có – chưa có phép đo nào. Đó là toàn bộ
          cách đọc.
        </>
      }
      soWhat={
        <>
          Để bạn dùng được trang tra cứu mà không bị nó dẫn: lấy phần lịch–toán làm kiến thức nền
          (nó đúng theo định nghĩa và tra ở đâu cũng khớp), đọc phần phong tục như{' '}
          {strong('tục lệ để tham khảo')}, và không đòi ở một năm sinh cái mà một năm sinh không
          chứa.
        </>
      }
    />
  );
}

export function DocMotTuoiDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="doc-mot-tuoi"
        concept="Một năm sinh chứa được bao nhiêu thông tin"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Năm sinh giống như {strong('tên của cái năm')} bạn ra đời. Biết tên năm thì biết năm
                đó là năm con gì — thế thôi. Nó không biết bạn cao hay thấp, thích vẽ hay thích đá
                bóng, cũng như biết tên một lớp học thì chưa biết gì về từng bạn trong lớp.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lịch can chi ghép Thiên Can với Địa Chi thành một vòng {CYCLE} năm. Nói bạn sinh
                  năm {BIRTH} là nói bạn thuộc ô {CAN_CHI} — con {ZODIAC}, nạp âm {NAP_AM}, mệnh{' '}
                  {MENH}. Bốn thứ này {strong('suy thẳng ra từ năm')}, không cần hỏi thêm gì.
                </p>
                <p>
                  Nhưng vì vòng chỉ có {CYCLE} ô, nên năm sinh chia toàn bộ dân số thành{' '}
                  {strong(CYCLE + ' nhóm')}. Ai sinh cùng năm âm lịch với bạn thì có y hệt bốn dòng
                  đó. Một thông tin dùng chung cho hàng triệu người thì không thể là mô tả riêng của
                  một người.
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
                  Đo bằng lượng thông tin thì rõ hơn: một năm sinh chọn 1 trong {CYCLE} ô. Thêm giới
                  tính — dữ kiện thứ hai và cũng là dữ kiện cuối cùng mà công cụ nhận — thì thành{' '}
                  {strong(CYCLE * 2 + ' nhóm')}. Toàn bộ trang kết quả, dù dài đến đâu, cũng chỉ là{' '}
                  {strong('một hàng trong bảng ' + CYCLE * 2 + ' hàng')} đã tính sẵn.
                </p>
                <p>
                  Hệ quả trực tiếp: mọi câu trên trang đó đều là {strong('mô tả nhóm')}. Nó có thể
                  đúng về mặt phép tính mà vẫn không nói được gì riêng về bạn — giống như biết một
                  người sinh tháng 5 thì chưa biết gì về người đó, dù “sinh tháng 5” là một sự thật
                  không bàn cãi.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="doc-mot-tuoi"
        concept="Ba tầng độ chắc trong cùng một trang kết quả"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có ba loại câu trên màn hình. Loại một giống như{' '}
                {strong('phép tính hai cộng hai')} — ai làm cũng ra một đáp án. Loại hai giống như{' '}
                {strong('luật chơi ông bà đặt ra')} — làm theo thì vui, nhưng đó là luật chơi. Loại
                ba là những thứ máy {strong('không biết')}, vì bạn chưa kể cho nó nghe.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Tầng lịch–toán: can chi, con giáp, nạp âm, mệnh ngũ hành, tuổi mụ. Đây là{' '}
                  {strong('phép chia lấy dư')} trên năm sinh. Đối chiếu với bất kỳ cuốn lịch nào
                  cũng khớp, vì nó chính là cách gọi tên năm chứ không phải một lời tiên đoán.
                </p>
                <p>
                  Tầng phong tục: Kim Lâu, Tam Tai, Hoang Ốc, sao hạn, cung phi. Cũng có công thức
                  rõ ràng — ví dụ Kim Lâu là {strong('tuổi mụ chia 9')} rồi xem số dư — nhưng{' '}
                  {strong('vì sao lại là những số dư ấy')} thì không ai chứng minh được. Đó là tục
                  lệ truyền lại.
                </p>
                <p>
                  Tầng thứ ba là những gì công cụ {strong('không có dữ kiện để tính')}: giờ sinh,
                  ngày sinh, và mọi thứ cần tới chúng.
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
                  Hai tầng đầu đều {strong('tất định')} — cùng đầu vào thì cùng đầu ra, chạy lại bao
                  nhiêu lần cũng thế. Nên “chắc” ở đây phải tách làm hai trục:{' '}
                  {strong('chắc về phép tính')} và {strong('chắc về nội dung')}. Cả hai tầng đều
                  chắc ở trục một. Chỉ tầng lịch–toán chắc ở trục hai, và chắc theo nghĩa yếu nhất
                  có thể: nó đúng {strong('theo định nghĩa')}, vì nó chỉ đang phát biểu tên của năm.
                </p>
                <p>
                  Tầng phong tục thì khác về loại: nó phát biểu một điều{' '}
                  {strong('về đời sống')} — năm này kém thuận cho việc kia — nên về nguyên tắc kiểm
                  được, và cho tới nay chưa có phép kiểm nào đứng sau. Công cụ hiển thị nguyên phép
                  tính (tuổi mụ bao nhiêu, chia mấy, dư mấy) nên bạn kiểm được nó{' '}
                  {strong('có tính đúng theo quy ước hay không')}; còn bản thân quy ước thì không
                  kiểm được bằng cách nào.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="doc-mot-tuoi"
        concept="Vì sao thêm một dữ kiện lại làm kết quả đổi"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hai bạn sinh cùng một năm thì {strong('con giáp giống hệt nhau')}. Nhưng nếu một bạn
                là nam, một bạn là nữ, thì có mấy dòng ở cuối trang lại{' '}
                {strong('khác nhau')} — vì mấy dòng đó dùng thêm cả thông tin nam hay nữ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cùng sinh năm {BIRTH}: can chi vẫn là {CAN_CHI}, nạp âm vẫn là {NAP_AM}, mệnh vẫn
                  là {MENH} — không đổi. Nhưng cung phi thì nam ra {HUONG_NAM.cungPhi} (
                  {groupLabel(HUONG_NAM.group)}) còn nữ ra {HUONG_NU.cungPhi} (
                  {groupLabel(HUONG_NU.group)}), và sao hạn năm {START_YEAR} thì nam là {SAO_NAM},
                  nữ là {SAO_NU}.
                </p>
                <p>
                  Đây là cách nhanh nhất để thấy {strong('mỗi dòng ăn theo một bộ dữ kiện khác nhau')}
                  . Muốn biết một dòng nói được gì, hãy hỏi trước: nó được tính từ cái gì?
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
                  Có ba bộ đầu vào trong cùng một trang. Bộ một là{' '}
                  {strong('năm sinh')} (can chi, con giáp, nạp âm, mệnh). Bộ hai là{' '}
                  {strong('năm sinh + năm đang xét')} (tuổi mụ, Kim Lâu, Tam Tai, xung năm, Hoang
                  Ốc). Bộ ba là {strong('năm sinh + giới tính')} (cung phi, hướng nhà) — và sao hạn
                  dùng cả ba.
                </p>
                <p>
                  Biết một dòng thuộc bộ nào là biết ngay giới hạn của nó. Dòng thuộc bộ hai{' '}
                  {strong('đổi theo từng năm')}, nên không thể là một đặc điểm cố định của bạn. Dòng
                  thuộc bộ một thì {strong('không bao giờ đổi')}, nên không thể nói gì về một thời
                  điểm cụ thể. Rất nhiều lời khuyên sai đến từ việc đọc một dòng bộ hai như thể nó
                  thuộc bộ một.
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
  { id: 'q1',
    type: 'open',
    prompt: 'Công cụ Tra cứu tuổi nhận vào những dữ kiện nào — và KHÔNG nhận cái gì?',
    answer: (
      <>
        Đúng hai dữ kiện: {strong('năm sinh dương lịch')} và {strong('giới tính')}. Không có ô ngày,
        ô tháng hay ô giờ sinh, nên nó không lập được lá số cá nhân và cũng không xét cho một ngày
        cụ thể. Nó cũng không có ô chọn năm muốn xem: phần “năm nay với tuổi này” luôn tính theo{' '}
        {strong('năm hiện tại')}.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: `Trong kết quả cho năm sinh ${BIRTH}, dòng nào thuộc tầng lịch–toán (suy bằng phép chia, ai tính cũng ra một kết quả)?`,
    choices: [
      { text: `Can chi ${CAN_CHI}, con giáp ${ZODIAC}, nạp âm ${NAP_AM}, mệnh ${MENH}`, correct: true,
        note: 'Đúng — bốn dòng này chỉ là cách gọi tên năm, đối chiếu cuốn lịch nào cũng khớp.' },
      { text: 'Kim Lâu, Tam Tai, Hoang Ốc',
        note: 'Không — ba dòng này có công thức rõ, nhưng lý do chọn đúng những con số trong công thức là quy ước phong tục, không chứng minh được.',
      },
      { text: 'Sao hạn và hướng nhà theo cung phi',
        note: 'Không — hai dòng này còn cần thêm giới tính, và thuộc hệ Cửu Diệu / Bát Trạch, tức tầng phong tục.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Nói “Kim Lâu là tất định” và “Kim Lâu là đúng” khác nhau ở chỗ nào?',
    choices: [
      { text: 'Tất định = cùng đầu vào thì luôn cùng đầu ra; đúng = có phép đo cho thấy nó tương ứng với điều gì đó ngoài đời. Kim Lâu đạt vế đầu, chưa có vế sau', correct: true,
        note: 'Đúng. Máy tính bỏ túi cũng tất định, điều đó không làm cho mọi phép tính nó chạy đều nói lên sự thật về đời bạn.' },
        { text: 'Không khác gì — tính ra được một kết quả duy nhất nghĩa là kết quả đó đúng',
        note: 'Không. Một quy ước bất kỳ cũng cho ra kết quả duy nhất; tính nhất quán không thay cho bằng chứng.' },
      { text: 'Khác ở chỗ Kim Lâu dùng số còn các lớp khác dùng chữ',
        note: 'Không — cả hai tầng đều dùng số. Khác nhau ở việc con số ấy phát biểu điều gì.' },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: `Hai người cùng sinh năm ${BIRTH}, một nam một nữ. Phần nào của kết quả KHÁC nhau?`,
    choices: [
      { text: `Cung phi và sao hạn khác (${HUONG_NAM.cungPhi} với ${HUONG_NU.cungPhi}; ${SAO_NAM} với ${SAO_NU} cho năm ${START_YEAR}); còn can chi, nạp âm, mệnh thì giống hệt`, correct: true,
        note: 'Đúng — vì cung phi và sao hạn dùng thêm giới tính, còn ba dòng kia chỉ dùng năm sinh.' },
      { text: 'Khác toàn bộ, vì nam và nữ được tính bằng hai hệ hoàn toàn riêng',
        note: `Không — can chi ${CAN_CHI} và nạp âm ${NAP_AM} chỉ phụ thuộc năm sinh nên hai người giống hệt nhau.` },
      { text: 'Không khác gì cả, giới tính chỉ để đổi cách xưng hô',
        note: 'Không — giới tính là đầu vào thật của phép tính cung phi và sao hạn, đổi nó là đổi kết quả.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: `Vì sao “năm sinh ${BIRTH}” không thể là câu trả lời cho câu hỏi “năm nay tôi có nên làm nhà không”?`,
    answer: (
      <>
        Vì các lớp hạn không phải thuộc tính của năm sinh, mà là quan hệ giữa{' '}
        {strong('năm sinh và năm đang xét')} — đổi năm xét là đổi kết quả. Chạy đúng phép tính của
        công cụ cho {EXAM_YEARS.length} năm liên tiếp kể từ {START_YEAR}, người sinh {BIRTH} phạm Kim
        Lâu ở {KIM_LAU_YEARS.length} năm và nằm trong Tam Tai ở {TAM_TAI_YEARS.length} năm, còn lại
        thì không. Quan trọng hơn: kể cả khi biết năm nào “phạm”, phép tính đó vẫn{' '}
        {strong('không biết gì về tiền, giấy tờ, nhà thầu hay sức khoẻ của bạn')} — mà đó mới là thứ
        quyết định việc làm nhà.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Bạn muốn biết “tính cách thật của tôi thế nào”. Trang tra cứu theo năm sinh giúp được tới đâu?',
    choices: [
      { text: 'Không tới đâu — nó chỉ có một năm sinh, tức một nhóm; mọi mô tả tính cách ở đó là mô tả nhóm', correct: true,
        note: 'Đúng. Và mô tả nhóm viết đủ rộng thì ai đọc cũng thấy giống mình — đó là hiệu ứng Barnum.' },
      {
        text: 'Giúp hoàn toàn, vì con giáp quyết định tính cách',
        note: 'Không — con giáp chỉ là tên của năm. Cùng một con giáp có hàng triệu người rất khác nhau.' },
      { text: 'Giúp nếu nhập thêm giới tính cho chính xác',
        note: `Không — thêm giới tính chỉ chia nhỏ từ ${CYCLE} nhóm thành ${CYCLE * 2} nhóm, vẫn là nhóm.` },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt: 'Một người bảo bạn: “năm sinh của bạn hợp nghề kinh doanh, đừng làm kỹ thuật”. Bạn phản hồi thế nào cho đúng?',
    answer: (
      <>
        Nói rõ hai chuyện. Một: gợi ý nghề trên trang tra cứu suy từ{' '}
        {strong('mệnh ngũ hành của năm sinh')}, tức từ đúng một dữ kiện dùng chung cho cả một nhóm{' '}
        {CYCLE} — nó được ghi là “tham khảo” chứ không phải kết luận. Hai: nghề nghiệp phụ thuộc
        năng lực, thị trường và cơ hội của riêng bạn, những thứ mà{' '}
        {strong('một năm sinh không chứa')}. Giữ gợi ý ấy như một gợi mở để nghĩ thêm thì được;
        dùng nó để loại bỏ một hướng đi thì không.
      </>
    ),
  },
];

export function DocMotTuoiRecall() {
  return <ActiveRecall topicId="doc-mot-tuoi" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'inputs', facet: 'Đầu vào',
    can: 'Nói được công cụ chỉ nhận năm sinh dương lịch và giới tính — không ngày, không tháng, không giờ — và vì sao điều đó chặn trần mọi kết luận rút ra từ nó.' },
  { id: 'layer-calendar', facet: 'Tầng lịch–toán',
    can: 'Chỉ ra can chi, con giáp, nạp âm, mệnh ngũ hành là suy bằng phép chia từ năm, ai tính cũng ra một kết quả, và giải thích vì sao chúng đúng theo định nghĩa chứ không phải một tiên đoán.' },
  { id: 'layer-custom', facet: 'Tầng phong tục',
    can: 'Xếp đúng Kim Lâu, Tam Tai, Hoang Ốc, sao hạn, cung phi vào tầng quy ước, và nói được vì sao có công thức rõ ràng vẫn không đồng nghĩa với có bằng chứng.' },
  { id: 'layer-none', facet: 'Phần không suy được',
    can: 'Liệt kê được những thứ một năm sinh không chứa: giờ sinh, lá số cá nhân, tính cách cụ thể, sự kiện sẽ xảy ra — và biết vì sao thêm dữ kiện chỉ làm chi tiết hơn chứ không tự động đúng hơn.' },
  { id: 'two-axes', facet: 'Hai trục “chắc”',
    can: 'Phân biệt được “tất định” (cùng đầu vào cho cùng đầu ra) với “có bằng chứng”, và dùng cặp câu hỏi này để tự phân loại bất kỳ dòng kết quả nào.' },
  { id: 'input-sets', facet: 'Mỗi dòng một bộ đầu vào',
    can: 'Nói được dòng nào chỉ cần năm sinh, dòng nào cần thêm năm đang xét, dòng nào cần thêm giới tính — và vì sao dòng đổi theo năm thì không thể là đặc điểm cố định của một người.' },
  { id: 'group-not-you', facet: 'Mô tả nhóm',
    can: 'Giải thích một năm sinh đặt bạn vào 1 trong 60 nhóm (120 nếu kể cả giới tính), nên mọi kết luận từ nó là mô tả nhóm chứ không phải mô tả bạn.' },
  { id: 'tool-scope', facet: 'Ranh giới công cụ',
    can: 'Nói đúng thứ công cụ làm (gom các lát cắt phong tục của một năm sinh về một chỗ, hiện rõ từng phép tính) và thứ nó không làm (không chọn ngày, không xét cho một việc cụ thể, không lập lá số).' },
  { id: 'decision', facet: 'Quyết định',
    can: 'Nói được vì sao không hoãn một việc lớn chỉ vì một dòng “phạm”, và đâu là những tiêu chí thật sự nên cân nhắc thay vào đó.' },
  { id: 'teach-back', facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút, bằng lời thường: trang kết quả có ba loại câu, mỗi loại đọc một kiểu, và vì sao không cần sợ loại thứ hai.' },
];

export function DocMotTuoiChecklist() {
  return <UnderstandingChecklist topicId="doc-mot-tuoi" facets={FACETS} />;
}

export function DocMotTuoiWhys() {
  return (
    <FiveWhys
      topicId="doc-mot-tuoi"
      start={
        <>
          Một người sinh năm {BIRTH} nhập năm sinh vào trang tra cứu ở năm {KL_YEAR}, thấy dòng{' '}
          {strong('“phạm ' + (KIM_LAU_CASE.type ?? 'Kim Lâu') + '”')} hiện lên, và quyết định lùi đám
          cưới sang năm sau. Người ấy tin rằng máy vừa cho biết một sự thật về năm nay của mình.
        </>
      }
      chain={[
        {
          question: 'Vì sao màn hình hiện chữ “phạm”?',
          because: (
            <>
              Vì công cụ lấy {strong('tuổi mụ')} của người đó ở năm đang xét — tại năm {KL_YEAR} là{' '}
              {KIM_LAU_CASE.ageMu} — rồi {strong('chia cho 9')} và xem số dư, ở đây dư{' '}
              {KIM_LAU_CASE.remainder}. Dư rơi vào nhóm được quy ước là phạm thì hiện chữ phạm. Toàn
              bộ nội dung của dòng đó là một phép chia, và công cụ hiển thị luôn cả số dư để bạn nhìn
              thấy.
            </>
          ),
        },
        {
          question: 'Vì sao chia cho 9, và vì sao đúng những số dư ấy?',
          because: (
            <>
              Đây là chỗ chuỗi lý do {strong('dừng lại')}. Cách chia và các số dư là{' '}
              {strong('quy ước truyền lại')} trong sách phong tục, không suy ra được từ thiên văn
              hay từ vòng can chi. Nói cách khác: phép tính thì kiểm được, còn lý do chọn phép tính
              ấy thì không.
            </>
          ),
        },
        {
          question: 'Vì sao một quy ước không kiểm được lại hiện ra trông chắc chắn như vậy?',
          because: (
            <>
              Vì nó được trình bày {strong('cạnh những dòng thật sự chắc')}. Can chi {CAN_CHI}, nạp
              âm {NAP_AM}, mệnh {MENH} đều đúng và tra ở đâu cũng khớp; khi Kim Lâu nằm cùng khuôn,
              cùng cỡ chữ, cùng một cái nhãn màu, thì {strong('độ tin cậy bị lây')} từ dòng trên
              xuống dòng dưới. Đó là hiệu ứng của cách bày, không phải của nội dung.
            </>
          ),
        },
        {
          question: 'Vì sao chuyện đó lại nguy hiểm hơn một lời phán ngoài quán nước?',
          because: (
            <>
              Vì lời phán ngoài quán thì ai cũng biết là để nghe cho vui, còn màn hình{' '}
              {strong('có số, có phép chia, có số dư')} nên trông như một phép đo. Cảm giác chính
              xác đến từ tính nhất quán của phép tính, chứ không từ bằng chứng — mà hai thứ đó rất
              dễ nhầm.
            </>
          ),
        },
        {
          question: 'Vậy lùi đám cưới một năm thì được gì và mất gì?',
          because: (
            <>
              Được sự an tâm về một quy ước. Mất một năm thật — tiền cọc, lịch của hai họ, kế hoạch
              của hai người — và sang năm lại có{' '}
              {strong('một nhãn kiêng khác đang chờ')}, vì các lớp hạn nối nhau liên tục chứ không
              chừa năm nào trống hẳn. {strong('Cái giá là thật')}, còn cái được thì nằm trong một
              cuốn sách tục lệ.
            </>
          ),
        },
      ]}
      root={
        <>
          Gốc của chuyện không nằm ở Kim Lâu, mà ở chỗ{' '}
          {strong('ba loại thông tin khác nhau được bày chung một khuôn')}. Tách được chúng ra thì
          bạn vẫn dùng trang tra cứu bình thường, vẫn giữ tục lệ nếu thấy có ý nghĩa với gia đình —
          nhưng biết rõ mình đang giữ một tục lệ, chứ không phải đang tuân theo một phép đo.
        </>
      }
    />
  );
}
