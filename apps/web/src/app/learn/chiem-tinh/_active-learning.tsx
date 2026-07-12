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
    <div className="space-y-5">
      <DepthTabs
        topicId="chiem-tinh"
        concept="Vì sao đừng chỉ đọc cung Mặt Trời — “bộ ba cốt lõi”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Đừng tả một người chỉ bằng một câu. Bản đồ sao cũng vậy: chỉ đọc “cung Mặt Trời”
                (cái mà ai cũng biết) là mới thấy một mảnh. Phải nhìn cả {strong('“bộ ba”')} — Mặt
                Trời, Mặt Trăng và cung Mọc — mới ra chân dung thật.
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
                  {strong('đời sống cảm xúc, nhu cầu an toàn')}; cung Mọc là {strong('lớp vỏ')} —
                  cách thế giới thấy bạn và ấn tượng đầu tiên. Ba lớp này ghép lại mới thành chân
                  dung cốt lõi.
                </p>
                <p>
                  Mô tả cung Mặt Trời là chung cho cả tháng sinh nên dễ rơi vào “bẫy Barnum” — ai
                  đọc cũng thấy đúng. Muốn có ý nghĩa cá nhân thì phải dẫn theo dữ kiện thật: Mặt
                  Trăng, cung Mọc, hành tinh ở nhà nào, hợp góc gì.
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
                  Luận giải kết hợp ba lớp: {strong('hành tinh')} (cái gì) — {strong('cung')} (kiểu
                  gì) — {strong('nhà')} (lĩnh vực nào), rồi phủ {strong('góc hợp')} để thấy các phần
                  trong một người “nói chuyện” với nhau hài hoà hay căng. Cung Mọc quyết định cách
                  xếp toàn bộ 12 nhà nên nó là phần {strong('nhạy giờ nhất')} (đổi cung mỗi khoảng 2
                  giờ).
                </p>
                <p>
                  Có thể nhìn thêm cân bằng nguyên tố: các thiên thể nghiêng về nguyên tố nào, tính
                  chất nào — nhưng đếm chỉ là gợi ý thô vì trọng số mỗi thiên thể không bằng nhau. Và
                  góc “căng” (vuông góc, đối đỉnh) không đồng nghĩa xui, góc “hài hoà” (tam hợp, lục
                  hợp) không đảm bảo tốt: tránh dán nhãn tốt/xấu cứng.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="chiem-tinh"
        concept="“Nhà” (house) là gì — cùng một hành tinh mà khác lĩnh vực đời sống"
        levels={[
          {
            id: 'nha-eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cung nói bạn có tính cách kiểu gì. {strong('Nhà')} nói cái đó xảy ra ở{' '}
                {strong('chỗ nào')} trong đời — chuyện tiền, chuyện học, chuyện gia đình hay chuyện
                bạn bè. Mười hai nhà là mười hai khu vực của cuộc sống.
              </p>
            ),
          },
          {
            id: 'nha-eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Nhà chia bản đồ thành 12 lĩnh vực đời sống: nhà 1 là bản thân, nhà 7 là hôn
                  nhân/đối tác, nhà 10 là sự nghiệp… Một hành tinh rơi vào nhà nào thì “chuyện” của
                  hành tinh đó diễn ra mạnh ở lĩnh vực ấy.
                </p>
                <p>
                  hieu.asia dùng hệ {strong('Whole-Sign')}: mỗi nhà phủ trọn một cung, nhà 1 là cung
                  chứa cung Mọc. Vì cung Mọc phụ thuộc giờ sinh, nên cách xếp 12 nhà cũng nhạy giờ
                  theo.
                </p>
              </>
            ),
          },
          {
            id: 'nha-expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Ghép ba lớp: {strong('hành tinh')} (cái gì) — {strong('cung')} (kiểu gì) —{' '}
                  {strong('nhà')} (lĩnh vực nào). Ví dụ Sao Kim (tình yêu/giá trị) ở Ma Kết (nghiêm
                  túc, dài hạn) trong nhà 7 (hôn nhân) → xu hướng yêu chậm mà chắc, coi trọng cam kết
                  bền.
                </p>
                <p>
                  Có nhiều hệ chia nhà (Placidus, Koch, Equal, Whole-Sign…). Ở đây chỉ dùng
                  Whole-Sign vì nó cổ nhất và mỗi nhà = một cung trọn; hệ khác có thể cho ranh giới
                  nhà hơi khác — đừng trộn hệ khi luận.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="chiem-tinh"
        concept="“Góc hợp” (aspect) là gì — các phần trong bạn nói chuyện với nhau"
        levels={[
          {
            id: 'goc-eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Các hành tinh đứng cách nhau những khoảng nhất định trên vòng tròn. Khoảng đó cho
                biết hai phần trong con người bạn có {strong('ăn ý')} với nhau không — có cái hợp
                nhau êm, có cái cọ nhau.
              </p>
            ),
          },
          {
            id: 'goc-eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Góc hợp là khoảng cách góc giữa hai thiên thể. Năm góc lớn: trùng tụ 0°, lục hợp
                  60°, vuông góc 90°, tam hợp 120°, đối đỉnh 180°. Góc “căng” (vuông góc, đối đỉnh)
                  cho ma sát và động lực; góc “hài hoà” (tam hợp, lục hợp) cho sự trôi chảy.
                </p>
                <p>
                  Góc không cần khít tuyệt đối mới tính — có một khoảng sai số cho phép gọi là{' '}
                  {strong('orb')}. Orb càng nhỏ thì góc càng khít, ảnh hưởng càng rõ.
                </p>
              </>
            ),
          },
          {
            id: 'goc-expert',
            label: 'Chuyên gia',
            content: (
              <>
                <p>
                  Công cụ cho orb khoảng 8° khi có Mặt Trời/Mặt Trăng, 6° cho các cặp còn lại; mỗi
                  cặp hành tinh chỉ giữ một góc khít nhất.
                </p>
                <p>
                  Lưu ý nguồn: Ptolemy nguyên gốc chỉ xếp bốn góc 60°/90°/120°/180° là “aspect”;
                  trùng tụ 0° được chiêm tinh hiện đại tính thêm như góc 0°, còn hệ cổ điển coi nó là
                  “đứng cùng chỗ”. Công cụ chỉ tính năm góc lớn này, không tính các góc nhỏ (quincunx
                  150°, semisextile 30°…).
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
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Trong bản đồ sao, “nhà” (house) nói lên điều gì?',
    choices: [
      {
        text: 'Lĩnh vực đời sống mà một hành tinh tác động: tiền bạc, hôn nhân, sự nghiệp, gia đình…',
        correct: true,
        note: 'Đúng — hành tinh (cái gì) × cung (kiểu gì) × nhà (lĩnh vực nào).',
      },
      {
        text: 'Tính cách kiểu gì — giống như nguyên tố và tính chất của cung',
        note: 'Không — đó là việc của cung; nhà nói “ở lĩnh vực nào của đời sống”.',
      },
      {
        text: 'Hành tinh nào cai quản (chủ quản) cung đó',
        note: 'Không — chủ quản là chuyện của cung, không phải của nhà.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Sao Thủy nghịch hành (Mercury retrograde) có phải điềm khiến “mọi thứ đều hỏng” không?',
    choices: [
      {
        text: 'Đúng — cứ Thủy nghịch là mọi việc sẽ trục trặc',
        note: 'Sai — đó là cách hiểu bị thổi phồng.',
      },
      {
        text: 'Không — retrograde là chuyển động lùi biểu kiến, hiện tượng bình thường; gán mọi trục trặc cho nó là thổi phồng',
        correct: true,
        note: 'Đúng. Có trường phái coi đó là lúc nên rà soát, nhưng không phải điềm gở tự động.',
      },
      {
        text: 'Không cần bận tâm — công cụ ở đây tính sẵn transit Thủy nghịch mỗi ngày cho bạn',
        note: 'Không — công cụ tập trung bản đồ lúc sinh, chưa tính transit theo ngày hiện tại.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt: 'Vì sao “hợp cung Mặt Trời” chưa đủ để kết luận hai người có hợp nhau hay không?',
    answer: (
      <>
        Vì cung Mặt Trời chỉ là {strong('một lát cắt thô')}. Độ hợp thật của hai người cần cả bản đồ
        đầy đủ — {strong('Mặt Trăng, Sao Kim, Sao Hỏa, cung Mọc')}… — mới đủ chuyện. Và{' '}
        {strong('không có hai cung “khắc” nhau theo kiểu định mệnh')}: khác biệt là cần thấu hiểu và
        nhường nhau, không phải “không thể yêu”.
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
    id: 'timelayer',
    facet: 'Phạm vi công cụ',
    can: 'Phân biệt được bản đồ natal với transit/tiến trình, và biết công cụ ở đây tập trung bản đồ lúc sinh — chưa tính transit theo ngày hiện tại.',
  },
  {
    id: 'balance',
    facet: 'Cân bằng nguyên tố',
    can: 'Đọc được ý nghĩa khi bản đồ trội hoặc thiếu một nguyên tố/tính chất, và biết vì sao “đếm” chỉ là gợi ý thô.',
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
