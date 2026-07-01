/**
 * Nội dung "học chủ động" cho trang /learn/chiem-tinh.
 *
 * TẤT CẢ grounded từ chính bài viết Chiêm tinh phương Tây (bản đồ sao, hoàng đạo
 * nhiệt đới, 12 cung = nguyên tố × tính chất, 10 thiên thể, bộ ba Mặt Trời –
 * Mặt Trăng – cung Mọc, 12 nhà, góc hợp, bẫy Barnum, giới hạn nhạy giờ / trường
 * phái). KHÔNG thêm dữ kiện mới. Giữ giọng "tham khảo / góc nhìn, không phán định".
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

export function ChiemTinhFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao có một tấm bản đồ về chính mình — bản ngã, đời sống cảm xúc, cách người khác thấy
          bạn, các lĩnh vực đời sống — để hiểu thiên hướng của mình mà ra quyết định hợp lý hơn?
        </>
      }
      why={
        <>
          Chiêm tinh phương Tây dựng một {strong('bản đồ sao thiên cung')} — ảnh chụp bầu trời tại
          thời điểm và nơi sinh. Vị trí Mặt Trời, Mặt Trăng và các hành tinh trên vòng hoàng đạo phản
          ánh xu hướng của một người. Nó tồn tại như một {strong('xu hướng để hiểu mình')}, không phải
          lời phán số mệnh.
        </>
      }
      what={
        <>
          Bản đồ ghi vị trí Mặt Trời, Mặt Trăng và các hành tinh trên {strong('12 cung hoàng đạo')}{' '}
          (mỗi cung 30°), cộng {strong('cung Mọc')} và {strong('12 nhà')}. {strong('Không phải')} để
          biết tương lai cố định — nó là xu hướng để hiểu mình, không phải định mệnh.
        </>
      }
      how={
        <>
          Nhập giờ + nơi sinh → dựng bản đồ sao (hoàng đạo nhiệt đới). Luận giải là đọc tổ hợp:{' '}
          {strong('hành tinh nào — ở cung nào — trong nhà nào — hợp góc gì')}. Đừng đọc lẻ một cung
          Mặt Trời: bộ ba Mặt Trời – Mặt Trăng – cung Mọc mới là chân dung cốt lõi.
        </>
      }
      soWhat={
        <>
          Để nhận diện thiên hướng, điểm mạnh, điểm dễ vấp rồi {strong('quyết định phù hợp hơn')} —
          không phán giàu/nghèo/số khổ, không thay lời khuyên y tế / pháp lý / tài chính.
        </>
      }
    />
  );
}

export function ChiemTinhDepth() {
  return (
    <DepthTabs
      topicId="chiem-tinh"
      concept="Vì sao đừng chỉ đọc cung Mặt Trời — “bộ ba cốt lõi”"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Đừng tả một người chỉ bằng một câu. Bản đồ sao cũng vậy: chỉ đọc “cung Mặt Trời” (cái mà
              ai cũng biết) là mới thấy một mảnh. Phải nhìn cả {strong('“bộ ba”')} — Mặt Trời, Mặt
              Trăng và cung Mọc — mới ra chân dung thật.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Cung Mặt Trời là {strong('bản chất, mục tiêu sống')}; Mặt Trăng là{' '}
                {strong('đời sống cảm xúc, nhu cầu an toàn')}; cung Mọc là {strong('lớp vỏ')} — cách
                thế giới thấy bạn và ấn tượng đầu tiên. Ba lớp này ghép lại mới thành chân dung cốt
                lõi.
              </p>
              <p>
                Mô tả cung Mặt Trời là chung cho cả tháng sinh nên dễ rơi vào “bẫy Barnum” — ai đọc
                cũng thấy đúng. Muốn có ý nghĩa cá nhân thì phải dẫn theo dữ kiện thật: Mặt Trăng, cung
                Mọc, hành tinh ở nhà nào, hợp góc gì.
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
                Luận giải kết hợp ba lớp: {strong('hành tinh')} (cái gì) — {strong('cung')} (kiểu gì)
                — {strong('nhà')} (lĩnh vực nào), rồi phủ {strong('góc hợp')} để thấy các phần trong
                một người “nói chuyện” với nhau hài hoà hay căng. Cung Mọc quyết định cách xếp toàn bộ
                12 nhà nên nó là phần {strong('nhạy giờ nhất')} (đổi cung mỗi khoảng 2 giờ).
              </p>
              <p>
                Có thể nhìn thêm bức tranh tổng: các thiên thể nghiêng về nguyên tố nào, tính chất nào
                — nhưng đếm chỉ là gợi ý thô vì trọng số mỗi thiên thể không bằng nhau. Và góc “căng”
                (vuông góc, đối đỉnh) không đồng nghĩa xui, góc “hài hoà” (tam hợp, lục hợp) không đảm
                bảo tốt: tránh dán nhãn tốt/xấu cứng.
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
    prompt: 'Vì sao “chỉ đọc cung Mặt Trời” là cách đọc bản đồ sao chưa đủ?',
    answer: (
      <>
        Vì mô tả cung Mặt Trời là chung cho cả tháng sinh nên dễ rơi vào {strong('bẫy Barnum')} — ai
        đọc cũng thấy đúng. Chân dung cốt lõi cần cả {strong('bộ ba')} Mặt Trời (bản chất/mục tiêu) –
        Mặt Trăng (đời sống cảm xúc) – cung Mọc (lớp vỏ), rồi cá nhân hoá bằng hành tinh ở nhà nào,
        hợp góc gì.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Mỗi cung hoàng đạo được định nghĩa bằng giao của hai trục nào?',
    choices: [
      {
        text: 'Nguyên tố (Lửa, Đất, Khí, Nước) và tính chất (Tiên phong, Kiên định, Linh hoạt)',
        correct: true,
        note: 'Đúng — 4 nguyên tố × 3 tính chất = 12 tổ hợp duy nhất.',
      },
      {
        text: 'Hành tinh cai quản và số nhà',
        note: 'Không — nhà và hành tinh là lớp khác; cung được định nghĩa bằng nguyên tố × tính chất.',
      },
      {
        text: 'Cung Mọc và Thiên đỉnh (MC)',
        note: 'Không — đó là các góc của bản đồ, không phải cách phân loại một cung.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Vì sao cung Mọc (Ascendant) là phần “nhạy giờ nhất” của bản đồ?',
    choices: [
      {
        text: 'Vì nó đổi cung mỗi khoảng 2 giờ và quyết định cách xếp toàn bộ 12 nhà, nên giờ sinh sai sẽ làm cung Mọc/nhà sai',
        correct: true,
        note: 'Đúng — thiếu giờ chính xác thì cung Mọc và 12 nhà có thể lệch.',
      },
      {
        text: 'Vì cung Mọc luôn quan trọng hơn cả cung Mặt Trời',
        note: 'Không — cung Mọc là một phần của bộ ba, không phải “luôn quan trọng nhất”.',
      },
      {
        text: 'Vì cung Mọc không phụ thuộc nơi sinh',
        note: 'Ngược lại — cung Mọc phụ thuộc cả giờ và nơi sinh.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Góc “căng” (vuông góc 90°, đối đỉnh 180°) có đồng nghĩa với “xui” không?',
    choices: [
      {
        text: 'Có — góc căng luôn xấu, góc hài hoà luôn tốt',
        note: 'Sai — bài đọc tránh dán nhãn tốt/xấu cứng.',
      },
      {
        text: 'Không — góc căng cho động lực trưởng thành; góc hài hoà cho tài năng nhưng dễ ỷ lại',
        correct: true,
        note: 'Đúng. Căng ≠ xui, hài hoà ≠ đảm bảo tốt.',
      },
      {
        text: 'Góc hợp không ảnh hưởng gì tới cách luận',
        note: 'Không — góc hợp cho biết các phần trong một người “nói chuyện” hài hoà hay căng.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Hai người sinh cùng ngày (cùng cung Mặt Trời) nhưng chân dung bản đồ sao vẫn khác nhau. Nêu ít nhất một lý do.',
    answer: (
      <>
        Lý do rõ nhất là {strong('cung Mọc')}: nó phụ thuộc giờ + nơi sinh và đổi cung mỗi khoảng 2
        giờ, nên hai người sinh cùng ngày mà khác giờ/nơi sẽ có cung Mọc — và cách xếp 12 nhà — khác
        nhau. Ngoài ra {strong('Mặt Trăng')}, vị trí các hành tinh {strong('ở nhà nào')} và{' '}
        {strong('góc hợp')} giữa chúng cũng khiến chân dung khác đi, dù cùng cung Mặt Trời.
      </>
    ),
  },
];

export function ChiemTinhRecall() {
  return <ActiveRecall topicId="chiem-tinh" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được bản đồ sao dùng để làm gì (xu hướng để hiểu mình) — và nó KHÔNG hứa gì (không phán giàu/nghèo/số khổ, không thay y tế/pháp lý).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả cách luận: hành tinh (cái gì) — ở cung (kiểu gì) — trong nhà (lĩnh vực nào) — rồi phủ góc hợp.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói được vì sao KHÔNG chỉ đọc cung Mặt Trời — vai trò của bộ ba Mặt Trời – Mặt Trăng – cung Mọc.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra giới hạn của chiêm tinh (nhạy giờ, sát ranh giới cung, khác biệt trường phái — tham khảo, không tuyệt đối).',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao hai người cùng cung Mặt Trời vẫn có chân dung khác nhau (cung Mọc, Mặt Trăng, hành tinh ở nhà nào, góc hợp).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao góc “căng” không = xui, không có hai cung “khắc” nhau theo kiểu định mệnh, và “12 con giáp” không phải 12 cung hoàng đạo.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại “mỗi cung = tính chất + nguyên tố” cho một người chưa biết, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào (vd 12 nhà, góc hợp, hoàng đạo nhiệt đới vs sao trời) bạn vẫn còn thấy mơ hồ.',
  },
];

export function ChiemTinhChecklist() {
  return <UnderstandingChecklist topicId="chiem-tinh" facets={FACETS} />;
}

export function ChiemTinhWhys() {
  return (
    <FiveWhys
      topicId="chiem-tinh"
      start={
        <>
          Người mới đọc mô tả cung Mặt Trời của mình, thấy “đúng ghê”, liền tin đó là toàn bộ chân
          dung của mình.
        </>
      }
      chain={[
        {
          question: 'Vì sao thấy mô tả cung Mặt Trời “đúng ghê” lại chưa đủ để tin đó là toàn bộ?',
          because: (
            <>
              Vì mô tả cung Mặt Trời là {strong('chung cho cả tháng sinh')} — dễ rơi vào “bẫy Barnum”,
              ai đọc cũng thấy đúng.
            </>
          ),
        },
        {
          question: 'Vì sao mô tả chung lại dễ khiến ai đọc cũng thấy đúng?',
          because: (
            <>
              Vì nó không dùng dữ kiện riêng của bạn. Chân dung cốt lõi cần cả {strong('bộ ba')} Mặt
              Trời – Mặt Trăng – cung Mọc, chứ không chỉ một cung.
            </>
          ),
        },
        {
          question: 'Vì sao phải cần tới bộ ba, và cả hành tinh ở nhà nào, góc hợp gì?',
          because: (
            <>
              Vì mỗi lớp nói một điều khác: hành tinh (cái gì) — cung (kiểu gì) — nhà (lĩnh vực nào) —
              góc hợp (các phần “nói chuyện” hài hoà hay căng).
            </>
          ),
        },
        {
          question: 'Vì sao các lớp lại ghép được thành một chân dung?',
          because: (
            <>
              Vì bản đồ sao là {strong('một hệ thống')} tổ hợp, không phải một nhãn cung đơn lẻ dán lên
              người.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên đọc bản đồ sao?',
          because: (
            <>
              Vì mục đích là thấy {strong('bức tranh tổng thể')} để hiểu mình, không để một cung Mặt
              Trời quyết định toàn bộ con người bạn.
            </>
          ),
        },
      ]}
      root={
        <>
          Cung Mặt Trời chỉ là một mảnh. Bản đồ sao là một hệ thống tổ hợp — muốn có ý nghĩa cá nhân
          phải cá nhân hoá bằng dữ kiện thật (bộ ba Mặt Trời – Mặt Trăng – cung Mọc, hành tinh ở nhà
          nào, góc hợp gì), và luôn đọc như xu hướng để hiểu mình, không phải định mệnh.
        </>
      }
    />
  );
}
