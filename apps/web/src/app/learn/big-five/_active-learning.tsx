/**
 * Nội dung "học chủ động" cho trang /learn/big-five (OCEAN 5 chiều).
 *
 * TẤT CẢ grounded từ chính bài viết Big Five và lib/big-five-trait-data.ts
 * (5 chiều O·C·E·A·N; lexical hypothesis; mỗi chiều là DẢI LIÊN TỤC, không đầu
 * nào "tốt/xấu"; khác MBTI 16 hộp; điểm là lát cắt thời điểm, có thể đổi; facet;
 * Neuroticism là dải trung lập). KHÔNG thêm dữ kiện mới. Giữ giọng "mô tả xu
 * hướng, không phán định — tham khảo, không dán nhãn".
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

export function BigFiveFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao mô tả tính cách một người theo cách vừa {strong('gần thực tế')} vừa có cơ sở, để
          hiểu mình thiên về đâu — mà không đóng khung mình vào một cái “kiểu” cứng nhắc?
        </>
      }
      why={
        <>
          Big Five (OCEAN) không do ai “nghĩ ra”. Năm chiều này {strong('nổi lên từ phân tích thống kê')}{' '}
          hàng nghìn từ mô tả tính cách qua nhiều ngôn ngữ và nền văn hoá (lexical hypothesis), nên
          giới hàn lâm tin cậy hơn hẳn các bài phân loại “đóng hộp”.
        </>
      }
      what={
        <>
          Năm chiều độc lập: {strong('Cởi mở, Tận tâm, Hướng ngoại, Dễ chịu, Nhạy cảm cảm xúc')}. Mỗi
          chiều là một {strong('dải liên tục')}, không phải “ô đóng”, {strong('không có đầu nào')} tốt
          hay xấu hơn — chỉ là thiên hướng tự nhiên của bạn.
        </>
      }
      how={
        <>
          Trả lời bộ câu hỏi rồi cho ra một {strong('điểm trên mỗi dải')} (thay vì xếp bạn vào 1 trong
          16 “kiểu” như MBTI). Mỗi chiều còn chia nhỏ thành các {strong('facet')}, nên hai người cùng
          điểm tổng vẫn có thể khác nhau ở từng khía cạnh.
        </>
      }
      soWhat={
        <>
          Để {strong('hiểu mình và tự quyết')}: biết đầu dải nào hợp bối cảnh nào rồi chọn việc, chọn
          cách hành xử phù hợp hơn — không dùng để dán nhãn hay phán xét, và điểm số chỉ là một lát
          cắt ở thời điểm làm bài.
        </>
      }
    />
  );
}

export function BigFiveDepth() {
  return (
    <DepthTabs
      topicId="big-five"
      concept="Vì sao Big Five là “dải liên tục”, không phải “16 cái hộp”"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đừng hỏi “bạn cao hay thấp?” như thể chỉ có hai loại người. Chiều cao là một{' '}
              {strong('cây thước')}: ai cũng đứng ở đâu đó trên thước, chẳng ai “thuộc hộp cao” hay
              “hộp thấp”. Tính cách trong Big Five cũng vậy — bạn đứng ở một điểm trên mỗi dải, và{' '}
              {strong('không đầu nào tốt hơn đầu nào')}.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                MBTI xếp bạn vào 1 trong {strong('16 “kiểu” cố định')}. Big Five thì cho bạn một điểm
                trên {strong('năm dải liên tục')} — gần thực tế hơn, vì con người hiếm khi rơi gọn vào
                một cái hộp.
              </p>
              <p>
                Ví dụ Hướng ngoại không phải “có hoặc không”. Có người ở giữa dải (ambivert): linh hoạt
                giữa giao tiếp và làm việc một mình. Điểm ở giữa là hợp lệ và rất bình thường, chứ
                không phải “chưa xác định được kiểu”.
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
                Năm chiều không do ai đặt ra mà {strong('nổi lên từ phân tích thống kê')} hàng nghìn từ
                mô tả tính cách qua nhiều ngôn ngữ (lexical hypothesis), rồi được đo lại nhiều lần —
                nên chúng có độ ổn định và khả năng dự báo cao hơn các bài phân loại đóng hộp.
              </p>
              <p>
                Mỗi chiều còn phân rã thành các {strong('facet')} (ví dụ Cởi mở gồm Trí tưởng tượng,
                Thẩm mỹ, Ham trí tuệ, Cởi mở giá trị…), nên hai người {strong('cùng điểm tổng')} vẫn có
                thể rất khác nhau ở từng facet. Và điểm là một {strong('lát cắt ở thời điểm làm bài')},
                không cố định cả đời — đọc như một góc nhìn, không phải nhãn dán.
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
    prompt: 'Big Five khác MBTI ở điểm cốt lõi nào?',
    answer: (
      <>
        MBTI xếp bạn vào {strong('1 trong 16 “kiểu” cố định')}; Big Five cho bạn một điểm trên{' '}
        {strong('năm dải liên tục')}. Cách dải liên tục gần thực tế hơn vì con người hiếm khi rơi gọn
        vào một cái hộp — và Big Five cũng có nền thực nghiệm mạnh hơn.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Vì sao Big Five được xem là mô hình “khoa học” nhất về tính cách?',
    choices: [
      {
        text: 'Năm chiều nổi lên từ phân tích thống kê hàng nghìn từ mô tả tính cách qua nhiều ngôn ngữ (lexical hypothesis)',
        correct: true,
        note: 'Đúng — không ai “nghĩ ra”; chúng nổi lên từ dữ liệu và có độ ổn định, dự báo cao.',
      },
      {
        text: 'Vì do một nhà tâm lý nổi tiếng tự nghĩ ra và đặt tên',
        note: 'Ngược lại — điểm mạnh của Big Five là KHÔNG do ai “nghĩ ra”.',
      },
      {
        text: 'Vì nó xếp mỗi người vào đúng một kiểu duy nhất',
        note: 'Đó là lối “đóng hộp” của type-test, không phải Big Five.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Điểm “Nhạy cảm cảm xúc” (Neuroticism) cao có phải điều xấu không?',
    choices: [
      {
        text: 'Có — điểm cao là khuyết điểm cần sửa',
        note: 'Không — đây là một dải trung lập, không phải bệnh lý hay khuyết điểm.',
      },
      {
        text: 'Không — đây là dải trung lập: đầu nhạy cảm giúp tinh tế, đồng cảm, cảnh giác rủi ro; đầu ổn định giúp điềm tĩnh dưới áp lực',
        correct: true,
        note: 'Đúng — mỗi đầu hợp với những bối cảnh khác nhau.',
      },
      {
        text: 'Không — vì chiều này không ảnh hưởng gì tới đời sống',
        note: 'Không hẳn — nó có ý nghĩa, chỉ là không có đầu nào “xấu” cố định.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: 'Vì sao một điểm ở GIỮA dải (ví dụ Hướng ngoại) là hợp lệ, không phải “kết quả lỗi”?',
    answer: (
      <>
        Vì mỗi chiều là một {strong('dải liên tục')}, ai cũng đứng ở đâu đó trên thước. Điểm giữa
        (ambivert) nghĩa là {strong('linh hoạt giữa giao tiếp và làm việc một mình')} — một thiên
        hướng thật, không phải “chưa xác định được kiểu”.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Hai người cùng điểm tổng chiều Cởi mở, nhưng đọc kỹ vẫn thấy họ khác nhau. Vì sao?',
    answer: (
      <>
        Vì mỗi chiều còn chia nhỏ thành các {strong('facet')} (Cởi mở gồm Trí tưởng tượng, Thẩm mỹ,
        Cảm xúc, Phiêu lưu, Ham trí tuệ, Cởi mở giá trị). Hai người {strong('cùng điểm tổng')} vẫn có
        thể mạnh/yếu ở những facet khác nhau — nên chân dung thật khác nhau.
      </>
    ),
  },
];

export function BigFiveRecall() {
  return <ActiveRecall topicId="big-five" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Big Five dùng để làm gì (mô tả xu hướng tính cách gần thực tế, có cơ sở để hiểu mình) — và nó KHÔNG dùng để dán nhãn hay phán xét.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả được năm chiều O·C·E·A·N và vì sao chúng nổi lên từ phân tích thống kê ngôn ngữ (lexical hypothesis), không do ai “nghĩ ra”.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được Big Five khác MBTI thế nào: điểm trên năm dải liên tục, thay vì xếp vào 1 trong 16 hộp cố định.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra được giới hạn: điểm là một lát cắt ở thời điểm làm bài, không cố định cả đời, và nên kết hợp với các lăng kính khác.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao hai người cùng điểm tổng một chiều vẫn khác nhau (do khác nhau ở từng facet).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “Nhạy cảm cảm xúc cao” không = xấu, và điểm ở giữa dải không = kết quả lỗi.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại ý “dải liên tục, không có đầu nào tốt/xấu” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd facet, lexical hypothesis) bạn vẫn còn thấy mơ hồ.',
  },
];

export function BigFiveChecklist() {
  return <UnderstandingChecklist topicId="big-five" facets={FACETS} />;
}

export function BigFiveWhys() {
  return (
    <FiveWhys
      topicId="big-five"
      start={
        <>
          Làm xong trắc nghiệm, nhiều người muốn hỏi “vậy tôi thuộc kiểu người nào?” và mong nhận một
          cái nhãn gọn gàng.
        </>
      }
      chain={[
        {
          question: 'Vì sao Big Five không trả lời “bạn thuộc kiểu nào”?',
          because: (
            <>
              Vì Big Five không xếp bạn vào một “kiểu”, mà cho bạn {strong('một điểm trên năm dải')}.
            </>
          ),
        },
        {
          question: 'Vì sao lại là điểm trên dải, chứ không phải một cái hộp?',
          because: (
            <>
              Vì mỗi chiều là một {strong('dải liên tục')} — con người hiếm khi rơi gọn vào một hộp,
              nên đo bằng dải sẽ gần thực tế hơn.
            </>
          ),
        },
        {
          question: 'Vì sao đo bằng dải liên tục lại đáng tin hơn?',
          because: (
            <>
              Vì năm chiều {strong('nổi lên từ phân tích thống kê')} hàng nghìn từ mô tả qua nhiều
              ngôn ngữ (lexical hypothesis), rồi được đo lại nhiều lần — nên ổn định và dự báo tốt hơn.
            </>
          ),
        },
        {
          question: 'Vì sao không đầu dải nào được coi là “tốt” hay “xấu”?',
          because: (
            <>
              Vì mỗi đầu {strong('hợp với những bối cảnh khác nhau')} — ví dụ đầu nhạy cảm giúp tinh
              tế, cảnh giác rủi ro; đầu ổn định giúp điềm tĩnh dưới áp lực.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc kết quả?',
          because: (
            <>
              Vì mục đích là {strong('hiểu mình và tự quyết')}, không phải nhận một cái nhãn — và điểm
              chỉ là lát cắt ở thời điểm làm bài, có thể đổi theo giai đoạn.
            </>
          ),
        },
      ]}
      root={
        <>
          Big Five mô tả {strong('xu hướng')}, không dán nhãn: bạn là một chân dung điểm trên năm dải
          liên tục, không có đầu nào tốt/xấu. Đọc như một góc nhìn để hiểu mình và tự quyết, đừng biến
          nó thành cái hộp nhốt mình vào.
        </>
      }
    />
  );
}
