/**
 * Nội dung "học chủ động" cho trang /learn/kinh-dich.
 *
 * TẤT CẢ grounded từ chính bài viết Kinh Dịch (âm–dương, bát quái, 64 quẻ kép,
 * Thượng/Hạ quái, Thoán từ / Hào từ, hào động, quẻ chính → quẻ biến, luật đọc số
 * hào động của Chu Hy, "gương soi thế cục chứ không phải sấm định mệnh"). KHÔNG
 * thêm dữ kiện mới. Giữ giọng "tham khảo / góc nhìn, không phán định".
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

export function KinhDichFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Khi đứng trước một tình huống rối — nên tiến hay nên dừng, việc này đang ở giai đoạn nào —
          làm sao có một tấm gương gọn để soi thế cục mà chiêm nghiệm, thay vì loay hoay trong đầu?
        </>
      }
      why={
        <>
          Kinh Dịch — “kinh về sự biến dịch” — là một trong những bộ kinh cổ nhất của văn minh Á
          Đông, hình thành khoảng 3.000 năm trước. Nó tồn tại như một{' '}
          {strong('sách triết lý về quy luật biến dịch')} (âm dương tiêu trưởng, vật cực tất phản) và
          đồng thời là {strong('công cụ chiêm nghiệm')} để soi tình huống đang hỏi.
        </>
      }
      what={
        <>
          Một hệ thống {strong('64 quẻ kép')}, mỗi quẻ là {strong('6 hào')} — nét dương (liền) hoặc
          âm (đứt) chồng lên nhau, mô tả một thế cục điển hình của đời sống. {strong('Không phải')}{' '}
          sấm định mệnh — mỗi quẻ là tấm gương soi một thế cục để bạn chiêm nghiệm.
        </>
      }
      how={
        <>
          Tâm niệm một câu hỏi rõ ràng → gieo 3 đồng xu sáu lần, xếp hào từ dưới lên → ra{' '}
          {strong('quẻ chính')} (thế cục hiện tại). Lật các {strong('hào động')} sang trạng thái
          ngược sẽ ra {strong('quẻ biến')} (hướng chuyển tới). Đọc lời nào thì theo luật số hào động
          của Chu Hy.
        </>
      }
      soWhat={
        <>
          Để đọc thế cục mà {strong('suy ngẫm việc của mình rồi tự quyết')} — giữ sắc thái điều kiện
          của lời cổ (“biết dừng thì tốt, theo đến cùng thì xấu”). Không dự đoán cứng, không thay lời
          khuyên y tế / pháp lý / tài chính.
        </>
      }
    />
  );
}

export function KinhDichDepth() {
  return (
    <DepthTabs
      topicId="kinh-dich"
      concept="Vì sao một quẻ không phải sấm cố định — “hào động” và quẻ biến"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Một quẻ giống như một tấm ảnh chụp {strong('lúc này')}. Nhưng mọi thứ đều đang chuyển
              động — có những chỗ trong ảnh sắp đổi. Kinh Dịch chỉ ra đúng những chỗ đang đổi đó, và
              cho bạn xem cả tấm ảnh {strong('sắp tới')} sẽ ra sao. Nên nó không phải lời phán “đời
              bạn sẽ thế này mãi”.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Khi gieo, mỗi hào ra một trong 4 trạng thái. {strong('Lão dương (9)')} và{' '}
                {strong('lão âm (6)')} là hào “động” — cái gì đến cực thì chuyển hóa, nên sắp lật sang
                trạng thái ngược. Thiếu dương (7) và thiếu âm (8) là hào tĩnh, không đổi.
              </p>
              <p>
                Quẻ rút được ngay là {strong('quẻ chính')} (thế cục hiện tại). Lật mỗi hào động sang
                trạng thái ngược, giữ nguyên hào tĩnh, sẽ ra {strong('quẻ biến')} — gợi ý hướng tình
                huống có thể chuyển tới. Vì thế một lần gieo cho bạn cả “bây giờ” lẫn “đang đi về đâu”,
                chứ không phải một kết cục đóng chặt.
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
                Chính vì quẻ động, phải có luật đọc trọng tâm. hieu.asia theo{' '}
                {strong('phép xét số hào động của Chu Hy')} vì nó tất định (cùng kết quả gieo luôn cho
                cùng cách đọc): 0 hào động đọc Thoán từ quẻ chính; 1 hào đọc đúng Hào từ đó; 2 hào đọc
                cả hai (trọng hào trên); 3 hào đọc lời cả quẻ chính lẫn quẻ biến (trọng quẻ chính); 4–5
                hào đọc các hào tĩnh trên quẻ biến; 6 hào động đọc lời quẻ biến.
              </p>
              <p>
                Trực giác của luật: ít hào động thì tình huống còn ở quẻ chính, đọc chính nó; càng
                nhiều hào động, trọng tâm càng dời sang quẻ biến. Và lời cổ dùng thang cát / hung / hối
                / lận / lệ / {strong('vô cữu')} — các chữ này là đánh giá{' '}
                {strong('có điều kiện theo cách ứng xử')}, không phải sấm về kết quả cố định.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

const RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: 'q1',
    type: 'open',
    prompt: 'Vì sao nói một quẻ Kinh Dịch là “gương soi thế cục”, không phải “sấm định mệnh”?',
    answer: (
      <>
        Vì quẻ {strong('mô tả một tình huống điển hình')} để người hỏi chiêm nghiệm việc của mình,
        không phán một kết cục cố định. Lời cổ thường mang sắc thái điều kiện (“biết dừng thì tốt,
        theo đến cùng thì xấu”), và người hỏi luôn giữ quyền quyết định.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Hào “động” trong một quẻ là hào nào?',
    choices: [
      {
        text: 'Lão dương (số 9) và lão âm (số 6) — sắp lật sang trạng thái ngược',
        correct: true,
        note: 'Đúng — cái gì đến cực thì chuyển hóa; hào động sinh ra quẻ biến.',
      },
      {
        text: 'Thiếu dương (7) và thiếu âm (8)',
        note: 'Ngược lại — đây là hào tĩnh, không đổi.',
      },
      {
        text: 'Hào nằm ở vị trí số 5 của quẻ',
        note: 'Không — “động” là do trạng thái gieo (9 hoặc 6), không do vị trí hào.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Quẻ biến được lập ra bằng cách nào?',
    choices: [
      {
        text: 'Đảo trên–dưới hai quái của quẻ chính',
        note: 'Không — đó là chuyện Thượng/Hạ quái (Thái ↔ Bĩ), không phải cách lập quẻ biến.',
      },
      {
        text: 'Lật mỗi hào động sang trạng thái ngược, giữ nguyên hào tĩnh',
        correct: true,
        note: 'Đúng — nếu không có hào động nào thì không có quẻ biến.',
      },
      {
        text: 'Gieo thêm một lần thứ hai độc lập',
        note: 'Không — quẻ biến suy ra từ chính quẻ chính, không gieo lại.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Chữ “vô cữu” trong lời cổ nghĩa là gì — có phải là “tốt” không?',
    answer: (
      <>
        {strong('Vô cữu')} không phải “tốt”, mà là {strong('“tránh được lỗi nếu xử đúng”')}. Đây là
        một đánh giá có điều kiện theo cách ứng xử, cùng họ với cát / hung / hối / lận / lệ — không
        phải lời sấm về một kết quả cố định.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: gieo xong thấy có 3 hào động. Theo luật Chu Hy, bạn đọc lời nào làm trọng tâm, và vì sao luật lại dời dần sang quẻ biến khi hào động tăng?',
    answer: (
      <>
        3 hào động: đọc {strong('lời quẻ (Thoán từ) của cả quẻ chính lẫn quẻ biến, trọng quẻ chính')}.
        Trực giác của luật: {strong('ít hào động')} thì tình huống còn ở quẻ chính nên đọc chính nó;{' '}
        {strong('càng nhiều hào động')}, thế cục càng đang chuyển hóa nên trọng tâm càng dời sang quẻ
        biến (tới 6 hào động thì đọc hẳn lời quẻ biến).
      </>
    ),
  },
];

export function KinhDichRecall() {
  return <ActiveRecall topicId="kinh-dich" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Kinh Dịch dùng để làm gì (gương soi một thế cục để chiêm nghiệm) — và nó KHÔNG hứa gì (không sấm định mệnh, không thay y tế/pháp lý/tài chính).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả mạch dùng: câu hỏi rõ → gieo 3 xu sáu lần → quẻ chính → lật hào động ra quẻ biến → đọc theo luật số hào động.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt hào động (lão dương 9 / lão âm 6) với hào tĩnh (thiếu dương 7 / thiếu âm 8), và quẻ chính với quẻ biến.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn: “linh nghiệm” huyền bí không được hứa, và vì sao có phái tượng số vs phái nghĩa lý (tham khảo, không tuyệt đối).',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Áp luật Chu Hy cho một số hào động cụ thể (ví dụ 3 hào động đọc lời cả hai quẻ, trọng quẻ chính).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “vô cữu” ≠ tốt, âm/dương ≠ tốt/xấu, và một quẻ ≠ kết cục đóng chặt.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “hào động → quẻ biến” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd bát quái, trình tự Văn Vương, hay luật số hào động) bạn vẫn còn thấy mơ hồ.',
  },
];

export function KinhDichChecklist() {
  return <UnderstandingChecklist topicId="kinh-dich" facets={FACETS} />;
}

export function KinhDichWhys() {
  return (
    <FiveWhys
      topicId="kinh-dich"
      start={
        <>
          Người mới gieo được một quẻ có lời “hung”, liền hoảng “việc này chắc chắn hỏng rồi”.
        </>
      }
      chain={[
        {
          question: 'Vì sao coi một quẻ “hung” là kết cục chắc chắn lại là hiểu sai?',
          because: (
            <>
              Vì một quẻ là {strong('gương soi một thế cục')}, không phải sấm định mệnh — nó mô tả
              tình huống để chiêm nghiệm, không phán kết quả cố định.
            </>
          ),
        },
        {
          question: 'Vì sao quẻ chỉ soi thế cục mà không chốt kết cục?',
          because: (
            <>
              Vì lời cổ mang sắc thái {strong('điều kiện theo cách ứng xử')} — như “trung cát, chung
              hung” (biết dừng thì tốt, theo đến cùng thì xấu), và cả chữ “vô cữu” = tránh lỗi nếu xử
              đúng.
            </>
          ),
        },
        {
          question: 'Vì sao thế cục lại “có điều kiện”, có thể đổi được?',
          because: (
            <>
              Vì quẻ vốn {strong('đang chuyển động')}: các {strong('hào động')} (lão dương 9 / lão âm
              6) sắp lật sang trạng thái ngược, tạo ra quẻ biến — hướng tình huống chuyển tới.
            </>
          ),
        },
        {
          question: 'Vì sao Kinh Dịch lại đặt sự chuyển hóa ở trung tâm như vậy?',
          because: (
            <>
              Vì đây là {strong('“kinh về sự biến dịch”')}: nền của nó là quy luật âm dương tiêu
              trưởng, vật cực tất phản — mọi thịnh suy đều luân chuyển, không có gì đứng yên.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc một quẻ?',
          because: (
            <>
              Vì mục đích là {strong('đọc thế cục để suy ngẫm rồi tự quyết')}, chứ không bắt một quẻ
              chịu trách nhiệm cho một kết cục — người hỏi luôn giữ quyền quyết định.
            </>
          ),
        },
      ]}
      root={
        <>
          Kinh Dịch là kinh về sự biến dịch: một quẻ soi thế cục {strong('hiện tại')} và, qua hào
          động → quẻ biến, gợi hướng {strong('chuyển tới')} — với lời cổ có điều kiện. Đọc nó là để
          chiêm nghiệm và tự quyết, không phải nhận một lời sấm đóng chặt.
        </>
      }
    />
  );
}
