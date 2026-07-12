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
    <div className="space-y-4">
      <BigFiveDepthSpectrum />
      <BigFiveDepthFacet />
      <BigFiveDepthWhyFive />
      <BigFiveDepthMidpoint />
      <BigFiveDepthSnapshot />
    </div>
  );
}

function BigFiveDepthSpectrum() {
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

function BigFiveDepthFacet() {
  return (
    <DepthTabs
      topicId="big-five"
      concept="Facet là gì, và vì sao hai người cùng điểm tổng vẫn khác nhau"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Mỗi chiều lớn giống một cái hộp to, bên trong có {strong('sáu ngăn nhỏ')} gọi là facet.
              Hai bạn cùng &ldquo;hộp Cởi mở đầy như nhau&rdquo; vẫn có thể đầy ở những ngăn khác nhau.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Chiều Cởi mở gồm sáu facet: Trí tưởng tượng, Thẩm mỹ, Cảm xúc, Phiêu lưu, Ham trí tuệ,
                Cởi mở giá trị. Bạn có thể {strong('cao ở Thẩm mỹ mà bình thường ở Phiêu lưu')}.
              </p>
              <p>
                Điểm tổng của một chiều chỉ là trung bình của sáu ngăn, nên nó {strong('giấu đi')} sự
                khác biệt bên trong. Muốn hiểu một người kỹ hơn thì nhìn xuống tầng facet.
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
                Năm chiều nhân sáu facet cho {strong('ba mươi khía cạnh')}. Facet giúp phân giải sâu
                hơn: hai người cùng điểm tổng một chiều vẫn có thể có hồ sơ facet khác hẳn, dẫn tới cách
                hành xử khác nhau.
              </p>
              <p>
                Đây là lý do đọc Big Five ở tầng facet cho chân dung tinh hơn là chỉ nhìn năm con số
                lớn. Bộ facet ở đây là bản miền công cộng (họ IPIP-NEO), đúng bộ mà công cụ của
                hieu.asia dùng.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

function BigFiveDepthWhyFive() {
  return (
    <DepthTabs
      topicId="big-five"
      concept="Vì sao là năm chiều, không phải bốn hay sáu"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Người ta không tự chọn con số năm rồi bắt tính cách chia vừa. Họ gom {strong('rất nhiều từ tả người')}{' '}
              lại, xếp những từ hay đi cùng nhau thành nhóm, và đếm ra khoảng năm nhóm cứ hiện lên.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Từ kho từ mô tả tính cách, khi xếp những từ thường đi cùng nhau, các nhà nghiên cứu
                thấy chúng {strong('dồn về năm cụm lớn')}, lặp lại qua nhiều ngôn ngữ và mẫu người.
              </p>
              <p>
                Con số năm là thứ {strong('nổi lên từ dữ liệu')}, không phải đặt trước rồi nhồi vào.
                Chính vì thế nó đáng tin hơn một bảng phân loại do ai đó tự nghĩ ra.
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
                Năm là điểm hội tụ phổ biến nhất, nhưng {strong('không phải bất biến')}. Có mô hình đề
                xuất sáu chiều, có cách gộp thành ít hơn tuỳ phương pháp và mẫu nghiên cứu.
              </p>
              <p>
                Điều đáng nói là năm chiều {strong('tái lập được')} ở nhiều bối cảnh khác nhau, nên giới
                hàn lâm dùng nó làm khung tham chiếu chung — một sự đồng thuận thực dụng, không phải
                chân lý đóng.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

function BigFiveDepthMidpoint() {
  return (
    <DepthTabs
      topicId="big-five"
      concept="Vì sao điểm ở giữa dải (ambivert) là một kết quả thật, không phải “chưa xác định”"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Hỏi &ldquo;bạn thích ngọt hay mặn?&rdquo; có người mê cả hai, tuỳ bữa. Đâu phải họ chưa
              biết mình thích gì. Trên dải Hướng ngoại cũng thế: đứng ở giữa nghĩa là bạn{' '}
              {strong('linh hoạt')}, lúc thích gặp gỡ lúc thích ở một mình — một câu trả lời thật,
              không phải bỏ trống.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Vì mỗi chiều là một {strong('dải liên tục')}, ai cũng đứng ở đâu đó trên thước, kể cả
                khúc giữa. Điểm giữa trên Hướng ngoại (hay gọi là ambivert) nghĩa là bạn xoay được giữa
                giao tiếp và làm việc một mình tuỳ hoàn cảnh.
              </p>
              <p>
                Điều này khác kiểu test &ldquo;đóng hộp&rdquo;, nơi phải rơi vào bên này hoặc bên kia.
                Ở Big Five, điểm giữa {strong('hợp lệ y như')} điểm ở hai đầu, không phải &ldquo;kết quả
                lỗi&rdquo; hay &ldquo;chưa đủ dữ liệu&rdquo;.
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
                Coi điểm giữa là &ldquo;chưa xác định&rdquo; là hiểu nhầm bản chất thang đo. Dải liên
                tục không đòi bạn phải lệch hẳn về một đầu; đứng ở khúc giữa là {strong('một vị trí thật trên thước')},
                không phải chỗ trống chờ điền.
              </p>
              <p>
                Ý nghĩa thực dụng: đừng ép kết quả thành &ldquo;hướng nội hay hướng ngoại&rdquo;. Nếu
                bạn ở giữa, cái đáng đọc là bạn co giãn theo bối cảnh. Muốn hiểu kỹ hơn thì nhìn xuống
                tầng {strong('facet')}, vì hai người cùng điểm giữa vẫn có thể mạnh yếu khác nhau ở từng
                facet.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

function BigFiveDepthSnapshot() {
  return (
    <DepthTabs
      topicId="big-five"
      concept="Vì sao điểm Big Five là ảnh chụp một thời điểm, có thể đổi theo giai đoạn đời"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đo chiều cao hồi lớp 1 khác lớp 9. Cái thước không sai, chỉ là bạn đã lớn lên. Điểm Big
              Five cũng là {strong('số đo ở lúc bạn làm bài')}, không phải con dấu đóng chặt cho cả đời.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Big Five đo xu hướng của bạn ở {strong('thời điểm làm bài')}. Xu hướng đó có thể đổi
                theo giai đoạn: hoàn cảnh sống, công việc, những gì bạn trải qua đều có thể kéo một chiều
                dịch đi ít nhiều.
              </p>
              <p>
                Vì thế điểm số là một lát cắt để hiểu mình lúc này, không phải bản án cố định. Làm lại
                bài sau vài năm, con số có thể khác, và điều đó {strong('bình thường')}.
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
                Điểm là một {strong('lát cắt, không phải hằng số')}. Big Five mô tả xu hướng chứ không
                khắc một bản chất bất biến, nên theo giai đoạn đời và hoàn cảnh, vị trí của bạn trên mỗi
                dải có thể xê dịch.
              </p>
              <p>
                Chỗ này nối với một giới hạn đã nói: nhãn &ldquo;cao/thấp&rdquo; chỉ là quy ước ngưỡng,
                và điểm dựa trên tự đánh giá nên còn chịu cả tâm trạng lúc làm bài. Gộp lại, cách đọc
                đúng là xem kết quả như một {strong('góc nhìn để hiểu mình')} và tự quyết ở hiện tại, kết
                hợp với các lăng kính khác, đừng biến nó thành cái nhãn nhốt mình cả đời.
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
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Nhược điểm nào sau đây là thật của Big Five?',
    choices: [
      {
        text: 'Phần lớn nghiên cứu dựng trên nhóm dân cư phương Tây, học vấn cao (WEIRD), nên tính phổ quát ở mọi văn hoá vẫn còn bàn cãi',
        correct: true,
        note: 'Đúng — đây là giới hạn WEIRD; thêm nữa, bài đo dựa trên tự đánh giá nên có thiên lệch.',
      },
      {
        text: 'Nó xếp mỗi người vào 1 trong 16 hộp cứng',
        note: 'Không — đó là MBTI; Big Five dùng dải liên tục.',
      },
      {
        text: 'Nó đo được giá trị và phẩm chất của một con người',
        note: 'Không — Big Five mô tả xu hướng, không đo giá trị con người.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt: 'Vì sao con số “năm” chiều lại đáng tin hơn là do ai đó chọn sẵn?',
    answer: (
      <>
        Vì năm chiều {strong('không được đặt trước rồi nhồi dữ liệu vào')}. Khi gom từ mô tả tính cách
        và xếp những từ hay đi cùng nhau, các nhà nghiên cứu thấy chúng dồn về khoảng năm cụm, lặp lại
        qua nhiều ngôn ngữ và mẫu người. Vẫn có tranh luận (vài mô hình đề xuất sáu chiều), nhưng năm
        là {strong('điểm hội tụ phổ biến nhất')}, nổi lên từ dữ liệu.
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
    id: 'history',
    facet: 'Dòng lịch sử',
    can: 'Kể lại dòng lexical: Allport–Odbert lọc từ trong từ điển, Cattell rút gọn, phân tích nhân tố hội tụ về năm, Goldberg phổ biến tên "Big Five", Costa–McCrae chuẩn hoá bộ đo NEO.',
  },
  {
    id: 'limits',
    facet: 'Giới hạn của chuẩn',
    can: 'Nói được các giới hạn: mẫu nghiên cứu thiên về nhóm WEIRD, tự đánh giá có thiên lệch, nhãn cao/thấp là quy ước ngưỡng, và mô hình không đo giá trị con người.',
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
