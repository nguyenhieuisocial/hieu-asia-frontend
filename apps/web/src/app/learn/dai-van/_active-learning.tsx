/**
 * Nội dung "học chủ động" cho /learn/dai-van — lớp vận 10 năm.
 *
 * GROUNDING (mọi khẳng định đều truy được về một trong các nguồn sau, KHÔNG
 * thêm dữ kiện mới, KHÔNG gõ tay con số mà engine tính ra được):
 *   • src/lib/bazi.ts — computeDaiVan(): chiều thuận khi (năm dương + nam) hoặc
 *     (năm âm + nữ); tuổi khởi vận = số ngày từ lúc sinh tới tiết kế (thuận) /
 *     tiết trước (nghịch) chia 3, làm tròn, tối thiểu 1; trụ vận bước ±1 từ trụ
 *     THÁNG trên vòng can chi; mỗi trụ phủ 10 năm tuổi; tenGod = Thập Thần của
 *     can vận so với Nhật Chủ.
 *   • src/app/dai-van-hien-tai/form.tsx — đại vận là chu kỳ 10 năm trong Tử Vi;
 *     Cục cho tuổi khởi vận (2–6); âm dương năm sinh + giới tính cho chiều;
 *     chiếu tuổi hiện tại vào các chặng để tìm cung đại vận; "đại vận đóng ở
 *     cung khó nghĩa là giai đoạn đó cuộc sống ưu tiên bài học của cung ấy —
 *     không phải lời tuyên án 10 năm"; giờ sinh sai thì lệch kết quả.
 *   • src/app/tinh-menh-cuc/form.tsx — Cục xác định từ can năm sinh kết hợp vị
 *     trí cung Mệnh (KHÔNG dùng giới tính); con số của Cục (2–6) là tuổi bắt
 *     đầu đại vận đầu tiên.
 *   • src/app/timeline/page.tsx — đại vận = giai đoạn 10 năm, lưu niên = năm.
 *   • src/app/learn/tu-vi/page.tsx — đại vận lần lượt đi qua từng cung, mỗi
 *     chặng mang Can-Chi riêng.
 *
 * PHẠM VI: không dạy lại Cục (/learn/menh-cuc), 12 cung (/learn/tu-vi), Thập
 * Thần (/learn/bat-tu); không lấn sang lớp từng năm (lưu niên) và thời điểm
 * chuyển giữa hai chặng (giao vận) — hai chủ đề riêng.
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

export function DaiVanFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Lá số gốc mô tả cả đời một lượt, nên nó không trả lời được câu hỏi thực tế nhất:{' '}
          {strong('giai đoạn này của tôi đang xoay quanh chuyện gì')}? Cần một lớp chia đời
          người thành từng chặng để nói chuyện cho có mốc.
        </>
      }
      why={
        <>
          Cả Tử Vi lẫn Bát Tự đều thêm một lớp thời gian dài {strong('10 năm')} gọi là đại
          vận. Nó tồn tại để chuyển bản đồ tĩnh thành nhịp: cùng một lá số, mỗi chặng mười năm
          lại nghiêng về một lĩnh vực khác.
        </>
      }
      what={
        <>
          Đại vận là {strong('một chặng 10 năm')} kèm nhãn riêng — trong Tử Vi là một cung của
          lá số, trong Bát Tự là một cặp Can-Chi. Nó {strong('không phải')} dự báo thành bại,
          không phải lớp vận từng năm, và cũng không phải thời điểm chuyển giữa hai chặng.
        </>
      }
      how={
        <>
          Ba dữ kiện dựng nên một bộ chặng: {strong('tuổi khởi vận')}, {strong('chiều đi')}{' '}
          (thuận hay nghịch), và {strong('nhãn của từng chặng')}. Muốn biết mình đang ở đâu thì
          chiếu tuổi hiện tại vào bộ chặng đó. Điểm cốt tử: Tử Vi và Bát Tự tính ba dữ kiện này
          theo hai cách khác nhau nên cho hai bộ mốc khác nhau.
        </>
      }
      soWhat={
        <>
          Để {strong('đặt mục tiêu hợp nhịp giai đoạn')} thay vì chạy theo lịch của người khác
          — chứ không phải để hoãn quyết định lớn chờ cho hết mười năm.
        </>
      }
    />
  );
}

export function DaiVanDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="dai-van"
        concept="Vì sao đời người lại được chia thành từng chặng mười năm"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Một cuốn truyện dài quá thì người ta chia thành các chương để dễ kể. Đại vận là
                cách chia đời người thành từng chương, mỗi chương mười năm. Chia chương không
                làm câu chuyện đổi đi — nó chỉ giúp ta nói{' '}
                {strong('đoạn này đang kể về cái gì')} thay vì kể một hơi từ đầu tới cuối.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lá số gốc mô tả thiên hướng cả đời, nhưng đời có nhịp: giai đoạn này nặng về
                  nghề, giai đoạn kia nặng về nhà cửa. Cả Tử Vi lẫn Bát Tự đều thêm một{' '}
                  {strong('lớp thời gian')} để mô tả nhịp đó, và cả hai đều chọn đơn vị mười
                  năm.
                </p>
                <p>
                  Trong Tử Vi, mỗi chặng đóng ở một cung của lá số nên chủ đề mười năm ấy
                  nghiêng về lĩnh vực của cung đó. Trong Bát Tự, mỗi chặng là một cặp Can-Chi
                  đặt thêm vào bên cạnh bốn trụ gốc.
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
                  Con số 10 là {strong('đơn vị đếm của hệ')}, không phải một chu kỳ đo được.
                  Không có phép đo nào cho thấy đời người đổi nhịp đúng mỗi mười năm; mười năm
                  được chọn vì nó chia gọn: 12 cung của lá số Tử Vi nhân 10 phủ 120 năm, dư so
                  với một đời người.
                </p>
                <p>
                  Hệ quả thực dụng: ranh giới giữa hai chặng sắc nét{' '}
                  {strong('trên bảng tra')} chứ không sắc nét trong đời. Dùng đại vận để chọn
                  trọng tâm cho một quãng dài thì hợp lý; dùng nó để định ngày lành tháng tốt
                  thì sai công cụ.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="dai-van"
        concept="Tử Vi khởi từ Cục, Bát Tự khởi từ trụ tháng — vì sao hai bộ mốc lệch nhau"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hai người cùng đi bộ dọc một con đường, nhưng một người bắt đầu đếm bước từ cột
                đèn, người kia đếm từ gốc cây. Đi cùng quãng đường mà số bước đọc ra khác nhau —
                không ai đếm sai cả, chỉ là {strong('mốc xuất phát khác nhau')}. Tử Vi và Bát
                Tự đếm chặng mười năm đúng kiểu đó.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Tử Vi lấy tuổi khởi vận từ {strong('Cục')} của lá số — một con số cố định
                  trong khoảng 2 đến 6 — rồi cho chặng chạy lần lượt qua các cung. Bát Tự thì
                  khởi từ {strong('trụ tháng')}: bước tới hoặc lùi trên vòng can chi, mỗi bước
                  là một chặng.
                </p>
                <p>
                  Tuổi khởi vận của Bát Tự cũng tính kiểu khác: đếm số ngày từ lúc sinh tới mốc
                  tiết khí gần nhất rồi chia ba. Vì vậy nó không bị bó trong khoảng 2 đến 6 như
                  Cục. Hai cách tính khác nhau thì cho hai bộ mốc khác nhau — chuyện bình
                  thường, không phải công cụ nào tính sai.
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
                  Có một điểm rất dễ bỏ sót:{' '}
                  {strong('giới tính ảnh hưởng hai hệ theo hai mức khác nhau')}. Cục suy từ can
                  năm sinh kết hợp vị trí cung Mệnh, hoàn toàn không dùng giới tính — nên hai
                  người cùng ngày giờ sinh khác giới có{' '}
                  {strong('cùng tuổi khởi vận Tử Vi')}, chỉ khác chiều đi.
                </p>
                <p>
                  Bên Bát Tự thì khác hẳn: chiều quyết định đo về phía tiết kế hay tiết trước,
                  mà chiều lại phụ thuộc giới tính — nên đổi giới tính là đổi luôn cả{' '}
                  {strong('tuổi khởi vận')}, không chỉ thứ tự. Đó là lý do một cặp sinh đôi
                  khác giới có thể đọc ra hai bộ mốc lệch nhau vài năm ngay từ chặng đầu.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="dai-van"
        concept="Chặng bị gọi là “xấu” — đọc thế nào cho khỏi hỏng mười năm"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Học kỳ này lớp học nhiều môn Toán hơn môn Vẽ. Điều đó không có nghĩa học kỳ này
                là học kỳ tồi — chỉ có nghĩa {strong('môn Toán đang chiếm nhiều giờ hơn')}. Một
                chặng vận bị gọi là khó cũng vậy: nó nói lĩnh vực nào đang chiếm chỗ, không nói
                bạn sẽ thắng hay thua.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cách đọc lành mạnh: đại vận rơi vào một cung khó nghĩa là giai đoạn đó cuộc
                  sống {strong('ưu tiên bài học của cung ấy')} — ví dụ chặng rơi vào cung sức
                  khoẻ thì đó là lời nhắc đầu tư cho sức khoẻ. Đó là trọng tâm cần chú ý, không
                  phải lời tuyên án mười năm.
                </p>
                <p>
                  Và đây là chỗ nhiều người mất tiền lẫn mất thời gian: nghe "sắp vào vận xấu"
                  rồi hoãn cưới, hoãn đổi việc, hoãn cả đi khám.{' '}
                  {strong('Mười năm là thời gian thật')}, còn ranh giới của chặng chỉ là quy
                  ước tính toán.
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
                  Có một phép thử tự kiểm rất gọn: nếu một chặng "xấu" thật sự là quy luật thì
                  hai hệ phải chỉ vào cùng một quãng tuổi. Thực tế Tử Vi và Bát Tự cho{' '}
                  {strong('hai bộ mốc khác nhau')} trên cùng một người. Khi hai bản đồ vẽ ranh
                  giới ở hai chỗ, ranh giới đó nên được đọc như quy ước của từng bản đồ.
                </p>
                <p>
                  Rủi ro thật sự không nằm ở chặng vận mà ở{' '}
                  {strong('cách chọn hệ')}: tra cả hai rồi lấy bên nào nói điều mình muốn nghe.
                  Làm vậy thì kết quả không còn nói gì về đời bạn nữa, nó chỉ phản chiếu mong
                  muốn của bạn. Chọn một hệ trước khi tra, và đọc trọn kết quả của hệ đó.
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
      'Hai người sinh CÙNG ngày, CÙNG giờ, chỉ khác giới tính. Tuổi bắt đầu đại vận của họ giống hay khác nhau — trong Tử Vi, và trong Bát Tự?',
    answer: (
      <>
        Khác nhau tuỳ hệ. {strong('Tử Vi: giống')} — tuổi khởi vận là con số của Cục, mà Cục
        suy từ can năm sinh kết hợp vị trí cung Mệnh, không dùng giới tính; khác nhau chỉ là
        chiều đi. {strong('Bát Tự: khác')} — tuổi khởi vận đo bằng số ngày từ lúc sinh tới mốc
        tiết khí, nhưng đo về phía trước hay phía sau là do chiều quyết định, mà chiều thì phụ
        thuộc giới tính.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Trong Bát Tự, tuổi bắt đầu đại vận được tính thế nào?',
    choices: [
      {
        text: 'Luôn rơi vào khoảng 2 đến 6 tuổi, tuỳ Cục của lá số',
        note: 'Đó là cách của Tử Vi. Bát Tự không dùng Cục.',
      },
      {
        text: 'Đếm số ngày từ lúc sinh tới mốc tiết khí gần nhất (kế hoặc trước, tuỳ chiều) rồi chia ba',
        correct: true,
        note: 'Đúng — vì vậy nó không bị bó trong khoảng 2 đến 6.',
      },
      {
        text: 'Luôn bắt đầu đúng ở tuổi 10, cho mọi lá số',
        note: 'Không — không có mốc cố định nào cho mọi người.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Chiều đi thuận hay nghịch của đại vận do đâu quyết định?',
    choices: [
      {
        text: 'Giờ sinh: sinh ban ngày đi thuận, ban đêm đi nghịch',
        note: 'Không — giờ sinh ảnh hưởng chỗ khác, không quyết định chiều.',
      },
      {
        text: 'Nhật Chủ mạnh hay yếu',
        note: 'Không — đó là một lớp luận khác, không dính tới chiều đi.',
      },
      {
        text: 'Âm dương của năm sinh kết hợp giới tính: dương nam và âm nữ đi thuận, âm nam và dương nữ đi nghịch',
        correct: true,
        note: 'Đúng, và cả hai hệ dùng chung quy tắc này — chỉ khác thứ mà chặng chạy trên.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt:
      'Bạn tra đại vận theo Tử Vi ra một bộ mốc, tra theo Bát Tự ra bộ mốc khác. Nên hiểu thế nào?',
    choices: [
      {
        text: 'Một trong hai công cụ đang tính sai, phải tìm ra bên đúng',
        note: 'Không — cả hai đều chạy đúng quy tắc của hệ mình.',
      },
      {
        text: 'Hai hệ khởi từ hai chỗ khác nhau và đếm hai thứ khác nhau nên cho hai bộ mốc; đọc riêng từng hệ, đừng trộn',
        correct: true,
        note: 'Đúng. Tử Vi khởi từ Cục rồi chạy qua các cung; Bát Tự khởi từ trụ tháng rồi bước trên vòng can chi.',
      },
      {
        text: 'Lấy trung bình hai mốc để ra con số chính xác hơn',
        note: 'Không — trộn hai hệ tạo ra một con số không thuộc hệ nào.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Đại vận hiện tại rơi vào một cung hay một trụ bị coi là “khó”. Cách hiểu đúng là gì?',
    choices: [
      {
        text: 'Mười năm xui, nên hoãn mọi quyết định lớn cho tới khi qua chặng',
        note: 'Đây đúng là ngộ nhận tốn kém nhất: mười năm là thời gian thật, ranh giới chặng chỉ là quy ước.',
      },
      {
        text: 'Giai đoạn này cuộc sống đang ưu tiên bài học của lĩnh vực đó — là trọng tâm cần chú ý, không phải bản án mười năm',
        correct: true,
        note: 'Đúng. Đại vận nói lĩnh vực nào đang được ưu tiên, không nói thành hay bại.',
      },
      {
        text: 'Không có ý nghĩa gì, vì đại vận chỉ là con số',
        note: 'Cũng không — nó có ích như một gợi ý đặt trọng tâm, chỉ là đừng đọc thành lời tiên đoán.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Tuổi hiện tại của bạn nhỏ hơn tuổi khởi vận. Kết quả là gì?',
    choices: [
      {
        text: 'Chưa vào chặng nào — chặng đầu tiên bắt đầu đúng ở tuổi khởi vận',
        correct: true,
        note: 'Đúng, và công cụ sẽ báo không xác định được đại vận hiện tại thay vì đoán bừa.',
      },
      {
        text: 'Lùi về chặng liền trước để đọc',
        note: 'Không có chặng nào trước chặng đầu tiên.',
      },
      {
        text: 'Tự động tính là đang ở chặng thứ nhất',
        note: 'Không — chặng thứ nhất chỉ bắt đầu từ tuổi khởi vận trở đi.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: một người bạn nói “năm sau tôi hết vận xấu rồi mới dám mở quán”. Bạn sẽ chỉ ra hai chỗ hổng nào trong câu đó?',
    answer: (
      <>
        Hổng thứ nhất: {strong('mốc “hết vận” phụ thuộc hệ nào đang được tra')} — Tử Vi và Bát
        Tự cho hai bộ mốc khác nhau trên cùng một người, nên "năm sau" của hệ này không phải
        "năm sau" của hệ kia. Hổng thứ hai:{' '}
        {strong('đại vận không nói thành hay bại')}, nó chỉ nói lĩnh vực nào đang là trọng tâm;
        thứ quyết định quán có sống được là vốn, mặt bằng, tay nghề và nhu cầu thật — những
        thứ kiểm được. Hoãn một năm để chờ một quy ước tính toán là trả thời gian thật cho một
        ranh giới trên bảng tra.
      </>
    ),
  },
];

export function DaiVanRecall() {
  return <ActiveRecall topicId="dai-van" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được đại vận trả lời câu hỏi gì (giai đoạn mười năm này lĩnh vực nào đang được ưu tiên) — và nó KHÔNG trả lời câu gì (thành hay bại, nên hay không nên).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả được đường đi đầy đủ: tuổi khởi vận → chiều thuận hay nghịch → nhãn từng chặng → chiếu tuổi hiện tại vào bộ chặng.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Chỉ ra Tử Vi và Bát Tự khác nhau ở hai chỗ: ĐIỂM KHỞI (Cục và các cung, so với trụ tháng và vòng can chi) và CÁCH LẤY TUỔI KHỞI VẬN.',
  },
  {
    id: 'gender',
    facet: 'Vai trò giới tính',
    can: 'Giải thích được vì sao đổi giới tính chỉ đảo chiều trong Tử Vi nhưng đổi cả tuổi khởi vận trong Bát Tự.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Tự suy ra được mình đang ở chặng thứ mấy khi đã biết tuổi khởi vận và chiều đi, không cần mở công cụ.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được vì sao chặng mười năm là quy ước đếm chứ không phải chu kỳ đo được — và dùng chính việc hai hệ lệch mốc làm bằng chứng.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao một chặng “xấu” không có nghĩa mười năm xui, và vì sao không nên hoãn quyết định lớn để chờ hết vận.',
  },
  {
    id: 'scope',
    facet: 'Đúng lớp',
    can: 'Phân biệt lớp mười năm (đại vận) với lớp từng năm (lưu niên) và với thời điểm chuyển giữa hai chặng (giao vận) — hai chủ đề riêng, không gộp vào đây.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người chưa biết vì sao hai hệ cho hai bộ mốc, bằng ví dụ của riêng bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào (tuổi khởi vận, chiều đi, nhãn chặng) bạn vẫn còn thấy mơ hồ.',
  },
];

export function DaiVanChecklist() {
  return <UnderstandingChecklist topicId="dai-van" facets={FACETS} />;
}

export function DaiVanWhys() {
  return (
    <FiveWhys
      topicId="dai-van"
      start={
        <>
          Nghe nói mình “sắp vào đại vận xấu”, nhiều người hoãn cưới, hoãn đổi việc, hoãn cả
          việc đi khám — chờ cho qua mười năm rồi tính.
        </>
      }
      chain={[
        {
          question: 'Vì sao hoãn mười năm để chờ hết vận lại là một quyết định tồi?',
          because: (
            <>
              Vì mười năm là {strong('thời gian thật')}, còn ranh giới của chặng chỉ là một quy
              ước tính toán.
            </>
          ),
        },
        {
          question: 'Vì sao ranh giới của chặng chỉ là quy ước?',
          because: (
            <>
              Vì nó do phép tính của từng hệ đặt ra: Tử Vi lấy con số của Cục làm tuổi khởi
              vận, Bát Tự đếm số ngày từ lúc sinh tới mốc tiết khí rồi chia ba.{' '}
              {strong('Hai phép tính khác nhau, hai mốc khác nhau')} trên cùng một người.
            </>
          ),
        },
        {
          question: 'Vì sao hai hệ lại đặt mốc khác nhau, nếu chúng cùng nói về một đời người?',
          because: (
            <>
              Vì chúng khởi từ hai chỗ khác nhau và đếm hai thứ khác nhau: Tử Vi khởi từ Cục
              rồi cho chặng chạy qua các cung của lá số; Bát Tự khởi từ{' '}
              {strong('trụ tháng')} rồi bước tới hoặc lùi trên vòng can chi.
            </>
          ),
        },
        {
          question: 'Vì sao nhiều người vẫn tin ranh giới đó là thật?',
          because: (
            <>
              Vì bảng tra in ra rất dứt khoát — một con số tuổi, một cái tên chặng. Con số{' '}
              {strong('sắc nét trên giấy')} rất dễ bị đọc thành sắc nét ngoài đời.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng đại vận?',
          because: (
            <>
              Vì đại vận chỉ nói {strong('lĩnh vực nào đang được ưu tiên')} trong giai đoạn này
              — nó là gợi ý để đặt mục tiêu hợp nhịp, không phải giấy phép hay lệnh cấm cho
              mười năm.
            </>
          ),
        },
      ]}
      root={
        <>
          Đại vận là cách một hệ chia đời người thành từng chặng cho dễ nói chuyện, không phải
          một cái đồng hồ có thật trong đời. Việc Tử Vi và Bát Tự chia khác nhau chính là bằng
          chứng gọn nhất: nếu ranh giới mười năm là quy luật, hai hệ đã phải chỉ vào cùng một
          mốc.
        </>
      }
    />
  );
}
