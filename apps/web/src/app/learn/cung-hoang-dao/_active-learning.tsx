/**
 * Nội dung "học chủ động" cho trang /learn/cung-hoang-dao.
 *
 * GROUNDING (chống bịa — mọi dữ kiện lấy từ chính codebase):
 *  - `lib/western-astrology.ts` → ZODIAC (12 cung: tên, ký hiệu, nguyên tố, tam
 *    thái/quality) + ELEMENT_TENDENCY (xu hướng 4 nguyên tố).
 *  - `lib/cung-hoang-dao-data.ts` → EXTRA qua buildCung(): khoảng ngày quy ước
 *    (dateLabel), tên tiếng Anh, hành tinh chủ quản cổ điển + hiện đại;
 *    sunSignFromDate() tính cung bằng vị trí Mặt Trời THẬT (Meeus), gắn cờ
 *    nearCusp; ELEMENT_SUPPORT (Lửa↔Khí "dương/chủ động", Đất↔Nước "âm/tiếp nhận").
 *  - `lib/cung-hoang-dao-hop-data.ts` → 5 nhóm quan hệ suy theo luật nguyên tố.
 *  - Trang công cụ `app/cung-hoang-dao/` → SunSignFinder (hỗ trợ 1900–2100, tính
 *    theo giờ trưa, cảnh báo sát ranh giới), hub 12 cung nhóm theo nguyên tố.
 *
 * PHÂN VAI: bài này CHỈ sở hữu bản thân 12 cung (ngày, nguyên tố, tam thái, hành
 * tinh chủ) + vấn đề tuế sai / chòm sao thật / Xà Phu. Bản đồ sao cá nhân, 12 nhà,
 * góc hợp, cung Mọc thuộc /learn/chiem-tinh — chỉ trỏ sang, KHÔNG giải thích lại.
 *
 * Giọng: tôn trọng người thích chiêm tinh nhưng trung thực về bằng chứng.
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

const TOPIC = 'cung-hoang-dao';

export function CungHoangDaoFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Ai cũng biết mình "cung gì", nhưng rất ít người nói được{' '}
          {strong('cung đó thực chất là cái gì')}: nó đo cái gì trên trời, vì sao lại đúng 12 cung, và
          vì sao thỉnh thoảng lại có tin "cung của bạn vừa bị đổi".
        </>
      }
      why={
        <>
          Vì cung hoàng đạo là {strong('một hệ ký hiệu')} chia đường đi của Mặt Trời trong năm thành
          12 phần bằng nhau. Nó có cấu trúc rõ ràng và học được — chứ không phải một danh sách 12 mô
          tả tính cách phải học thuộc.
        </>
      }
      what={
        <>
          Mỗi cung là một ô {strong('30°')} trên vòng hoàng đạo, mang đúng một tổ hợp{' '}
          {strong('nguyên tố')} (Lửa, Đất, Khí, Nước) × {strong('tam thái')} (Tiên phong, Kiên định,
          Linh hoạt), kèm một hành tinh chủ quản theo truyền thống.
        </>
      }
      how={
        <>
          Nhớ hai trục thay vì nhớ 12 mô tả: 4 nguyên tố × 3 tam thái = 12 tổ hợp{' '}
          {strong('không trùng nhau')}. Biết cung nào thuộc ô nào là suy ra được "chất" của cung,
          thay vì học vẹt.
        </>
      }
      soWhat={
        <>
          Để đọc cung hoàng đạo như {strong('một ngôn ngữ chung để nói về mình')} — hiểu nó đo gì,
          không đo gì — và để không hoảng khi gặp tin giật tít kiểu "có cung thứ 13".
        </>
      }
    />
  );
}

export function CungHoangDaoDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId={TOPIC}
        concept="Cung hoàng đạo của bạn thực chất là ô nào trên vòng tròn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng bầu trời là một cái bánh tròn được cắt thành{' '}
                {strong('12 miếng bằng nhau')}. Suốt một năm, Mặt Trời đi hết một vòng quanh cái bánh
                đó. Miếng bánh mà Mặt Trời đang đứng vào {strong('ngày bạn sinh')} chính là cung của
                bạn. Chỉ vậy thôi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Vòng hoàng đạo là một vòng tròn {strong('360°')}, chia thành 12 cung, mỗi cung đúng{' '}
                  {strong('30°')}. "Cung hoàng đạo" (còn gọi cung Mặt Trời) là cung chứa Mặt Trời vào
                  ngày bạn sinh.
                </p>
                <p>
                  Mặt Trời đi được khoảng 1° mỗi ngày, nên mỗi cung kéo dài khoảng 30 ngày — đó là lý
                  do mỗi cung ứng với một khoảng ngày dài chừng một tháng, chứ không phải con số
                  ngẫu nhiên.
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
                  Điểm cần nắm: 12 ô 30° đều nhau là một {strong('quy ước hình học')}, không phải 12
                  chòm sao. Mốc 0° của cung Bạch Dương được gắn vào{' '}
                  {strong('điểm xuân phân')} — nên toàn bộ vòng bám theo mùa.
                </p>
                <p>
                  Vì thế các khoảng ngày trong bảng chỉ là {strong('quy ước')}, có thể lệch ±1 ngày
                  tuỳ năm. Công cụ ở hieu.asia không tra bảng cứng mà tính{' '}
                  {strong('kinh độ Mặt Trời thật')} cho đúng ngày bạn nhập, hỗ trợ khoảng 1900–2100;
                  ca sinh sát đầu hoặc cuối một cung được gắn cờ cảnh báo riêng vì kết quả mặc định
                  lấy theo giờ trưa.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Vì sao đúng 12 cung — không phải 10 hay 14"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có {strong('4 màu áo')} (Lửa, Đất, Khí, Nước) và {strong('3 kiểu chạy')} (mở đầu, giữ
                vững, xoay chuyển). Ghép mỗi màu áo với mỗi kiểu chạy, bạn được đúng 12 bộ khác nhau
                — không thừa một bộ nào, cũng không thiếu bộ nào. 12 cung ra từ đó.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi cung được định nghĩa bằng {strong('một nguyên tố')} + {strong('một tam thái')}.
                  Có 4 nguyên tố (mỗi nguyên tố 3 cung) và 3 tam thái (mỗi tam thái 4 cung).{' '}
                  {strong('4 × 3 = 12')}.
                </p>
                <p>
                  Điều đáng chú ý: không có hai cung nào trùng tổ hợp. Bọ Cạp là cung Nước Kiên định
                  duy nhất, Ma Kết là cung Đất Tiên phong duy nhất. Nhớ hai trục là suy được chất của
                  cung, khỏi học thuộc 12 đoạn mô tả rời rạc.
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
                  Đi vòng quanh hoàng đạo theo thứ tự cung: {strong('nguyên tố lặp mỗi 4 cung')}, còn{' '}
                  {strong('tam thái lặp mỗi 3 cung')}. Vì 3 và 4 nguyên tố cùng nhau, cặp (nguyên tố,
                  tam thái) phải quay đủ 12 bước mới trở về tổ hợp ban đầu — nên hệ khép kín ở đúng 12
                  và mọi tổ hợp xuất hiện đúng một lần.
                </p>
                <p>
                  Hệ quả hình học rất gọn: ba cung cùng nguyên tố nằm cách nhau {strong('120°')} (một
                  tam giác đều trên vòng), bốn cung cùng tam thái nằm cách nhau {strong('90°')} (một
                  hình vuông). Cấu trúc 12 cung không phải danh sách — nó là một lưới.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Hoàng đạo tropical: cung bám mùa, không bám chòm sao"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cung hoàng đạo giống như {strong('cách đánh dấu mùa')}. Cung đầu tiên bắt đầu đúng
                ngày {strong('xuân phân')} — ngày mà ban ngày và ban đêm dài gần bằng nhau. Nó là cái
                mốc của mùa, không phải một hình vẽ sao trên trời.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Có hai cách gắn mốc 0° cho vòng hoàng đạo.{' '}
                  {strong('Hoàng đạo nhiệt đới (tropical)')} lấy 0° Bạch Dương = điểm xuân phân, tức
                  bám theo mùa; đây là hệ phổ biến ở phương Tây và là hệ hieu.asia dùng.{' '}
                  {strong('Hoàng đạo sao trời (sidereal)')} bám vị trí chòm sao thật, dùng trong chiêm
                  tinh Vệ Đà.
                </p>
                <p>
                  Hai hệ hiện lệch nhau khoảng {strong('24°')} — gần trọn một cung. Đó là lý do cùng
                  một ngày sinh, hai hệ có thể cho ra hai cung khác nhau mà không bên nào "sai": chúng
                  đo hai thứ khác nhau.
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
                  Chữ "tropical" ở đây gắn với các điểm chí và điểm phân, tức khung mùa của Trái Đất,
                  chứ không gắn với nền sao. Nói cách khác: cung Bạch Dương nghĩa là{' '}
                  {strong('30° đầu tiên tính từ xuân phân')}, không phải "Mặt Trời đang ở trước chòm
                  Bạch Dương".
                </p>
                <p>
                  Ranh giới ngày lệch ±1 ngày tuỳ năm vì năm chí tuyến dài khoảng 365,2422 ngày —
                  không chia chẵn thành số ngày, nên xuân phân rơi vào giờ khác nhau mỗi năm và bị năm
                  nhuận kéo lại. Vì thế bảng ngày là {strong('quy ước')}, còn con số dùng để xác định
                  cung phải là kinh độ Mặt Trời tính cho đúng năm sinh.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId={TOPIC}
        concept="Xà Phu (Ophiuchus) và chuyện “cung của tôi bị đổi”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Thỉnh thoảng có tin đồn: "bây giờ có 13 cung, bạn không còn là cung cũ nữa". Đừng lo.
                Người ta đang đem {strong('cái bánh 12 miếng')} so với{' '}
                {strong('các hình vẽ sao thật')} trên trời — hai thứ khác nhau, nên không ai đổi cung
                của bạn cả.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Các chòm sao thật rộng hẹp rất khác nhau. Trên đường Mặt Trời đi, chòm Bọ Cạp chỉ
                  chiếm khoảng một tuần, trong khi có một chòm khác — {strong('Xà Phu (Ophiuchus)')} —
                  chiếm hơn hai tuần vào đầu tháng 12, dù nó không nằm trong danh sách 12 cung.
                </p>
                <p>
                  Nếu chia hoàng đạo theo chòm sao thật thì đúng là có 13 vùng dài ngắn không đều.
                  Nhưng chiêm tinh tropical {strong('không chia theo chòm sao')} — nó chia 12 ô đều
                  nhau theo mùa. Vậy nên "cung thứ 13" không làm cung của bạn đổi.
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
                  Ranh giới các chòm sao được Hiệp hội Thiên văn Quốc tế (IAU) chuẩn hoá từ năm 1930
                  để phục vụ {strong('thiên văn')}, không phải để phục vụ chiêm tinh. Việc Mặt Trời đi
                  qua vùng trời của Xà Phu là dữ kiện thiên văn có thật và không mới.
                </p>
                <p>
                  Đợt "NASA đổi cung hoàng đạo" lan truyền năm 2016 thực chất bắt nguồn từ một bài phổ
                  biến khoa học nhắc lại đúng dữ kiện trên, rồi bị giật tít. Hai điều nên nhớ:{' '}
                  {strong('không cơ quan nào có thẩm quyền "đổi" một hệ quy ước')}, và cũng{' '}
                  {strong('không cơ quan khoa học nào công nhận hệ đó như một phép đo')}. Nói được cả
                  hai vế mới là hiểu đúng.
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
    prompt: 'Cung hoàng đạo (cung Mặt Trời) của một người được xác định như thế nào?',
    answer: (
      <>
        Vòng hoàng đạo 360° được chia thành 12 cung, mỗi cung {strong('30°')}. Cung của bạn là cung
        chứa {strong('Mặt Trời')} vào ngày bạn sinh. Khoảng ngày trong bảng chỉ là quy ước và có thể
        lệch ±1 ngày tuỳ năm, nên với ca sinh sát ranh giới cần tính theo vị trí Mặt Trời thật.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Vì sao hệ này có đúng 12 cung?',
    choices: [
      {
        text: 'Vì có 4 nguyên tố × 3 tam thái = 12 tổ hợp duy nhất, không trùng nhau',
        correct: true,
        note: 'Đúng — mỗi cung là một tổ hợp nguyên tố × tam thái xuất hiện đúng một lần.',
      },
      {
        text: 'Vì trên đường Mặt Trời đi có đúng 12 chòm sao',
        note: 'Không — chia theo chòm sao thật sẽ ra 13 vùng dài ngắn không đều, gồm cả Xà Phu.',
      },
      {
        text: 'Vì một năm có 12 tháng nên chia theo tháng',
        note: 'Không — cung chia theo góc 30° trên hoàng đạo, nên ranh giới cung rơi vào giữa tháng dương lịch chứ không trùng mốc đầu tháng.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Ba cung nào cùng thuộc nguyên tố Nước?',
    choices: [
      {
        text: 'Bạch Dương, Sư Tử, Nhân Mã',
        note: 'Đây là ba cung Lửa.',
      },
      {
        text: 'Cự Giải, Bọ Cạp, Song Ngư',
        correct: true,
        note: 'Đúng — ba cung Nước: thiên về cảm xúc, trực giác và đồng cảm.',
      },
      {
        text: 'Song Tử, Thiên Bình, Bảo Bình',
        note: 'Đây là ba cung Khí.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Tuế sai khiến điểm xuân phân trôi đi với tốc độ nào?',
    choices: [
      {
        text: 'Khoảng 1° mỗi 72 năm — trọn một vòng mất khoảng 26.000 năm',
        correct: true,
        note: 'Đúng — chậm tới mức một đời người gần như không nhận ra, nhưng cộng dồn hai nghìn năm thì đủ làm hai hệ lệch khoảng 24°.',
      },
      {
        text: 'Khoảng 1° mỗi năm — trọn một vòng mất 360 năm',
        note: 'Không — nhanh như vậy thì cung sẽ đổi trong vòng một đời người, điều đó không xảy ra.',
      },
      {
        text: 'Không trôi; điểm xuân phân là một điểm cố định trên nền sao',
        note: 'Không — trục quay Trái Đất lắc như con quay, nên điểm xuân phân trôi dần trên nền sao.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Nghe tin "có cung thứ 13 (Xà Phu), cung của bạn đã đổi" thì nên hiểu thế nào?',
    choices: [
      {
        text: 'Đúng — nên đọc lại mô tả theo cung mới của mình',
        note: 'Không — cung hoàng đạo tropical không định nghĩa theo chòm sao, nên không có gì để đổi.',
      },
      {
        text: 'Đó là so nhầm hai hệ: hoàng đạo tropical chia 12 ô đều theo mùa, còn chòm sao thật thì rộng hẹp không đều',
        correct: true,
        note: 'Đúng — hai hệ đo hai thứ khác nhau; việc Mặt Trời đi qua vùng trời Xà Phu là dữ kiện thiên văn có thật và không mới.',
      },
      {
        text: 'Đó là tin bịa hoàn toàn, chòm Xà Phu không có thật',
        note: 'Không — Xà Phu là một chòm sao có thật, ranh giới đã được IAU chuẩn hoá từ 1930. Cái sai nằm ở kết luận, không ở chòm sao.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'open',
    prompt:
      'Vì sao Sao Thủy được coi là chủ quản của cả Song Tử lẫn Xử Nữ, trong khi Mặt Trời chỉ chủ một cung?',
    answer: (
      <>
        Vì cách gán chủ quản {strong('cổ điển')} chỉ có 7 thiên thể nhìn được bằng mắt thường cho 12
        cung. Mặt Trời (Sư Tử) và Mặt Trăng (Cự Giải) mỗi vị giữ một cung, năm hành tinh còn lại mỗi
        vị giữ hai cung, sắp đối xứng qua trục Cự Giải – Sư Tử. Đây là{' '}
        {strong('một sơ đồ được sắp đặt')} của truyền thống, không phải phát hiện thiên văn.
      </>
    ),
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt:
      'Các nghiên cứu tâm lý quy mô lớn nói gì về liên hệ giữa ngày sinh và tính cách?',
    choices: [
      {
        text: 'Đã xác nhận liên hệ rõ ràng giữa cung Mặt Trời và các nét tính cách',
        note: 'Không — đây chính là điều các nghiên cứu KHÔNG tìm thấy.',
      },
      {
        text: 'Không tìm thấy liên hệ ổn định; phần "thấy đúng" phần lớn đến từ mô tả chung ai đọc cũng thấy hợp',
        correct: true,
        note: 'Đúng — hiệu ứng Barnum: mô tả đủ chung thì gần như ai cũng nhận ra mình trong đó.',
      },
      {
        text: 'Chưa từng có nghiên cứu nào kiểm chứng chuyện này',
        note: 'Không — đã có nhiều nghiên cứu, kể cả thử nghiệm mù đôi; kết quả đều không ủng hộ.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Vận dụng: hai người bạn cùng cung Kim Ngưu nhưng tính cách khác hẳn nhau. Giải thích bằng những gì bài đã nói.',
    answer: (
      <>
        Cung Mặt Trời chỉ chia cả nhân loại thành {strong('12 nhóm theo tháng sinh')} — quá thô để mô
        tả một cá nhân. Ngay trong khung chiêm tinh, cung Mọc và các vị trí khác (phụ thuộc{' '}
        {strong('giờ và nơi sinh')}) mới làm nên khác biệt, và phần đó thuộc bài{' '}
        {strong('bản đồ sao')}. Ngoài khung đó, tính cách còn do vô số yếu tố mà ngày sinh không nắm
        được — nên hai người cùng cung khác nhau là chuyện bình thường, không phải "mô tả cung sai".
      </>
    ),
  },
];

export function CungHoangDaoRecall() {
  return <ActiveRecall topicId={TOPIC} questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Nói được cung hoàng đạo là ô 30° chứa Mặt Trời vào ngày sinh, trên vòng hoàng đạo 360° chia 12 phần bằng nhau.',
  },
  {
    id: 'structure',
    facet: 'Cấu trúc',
    can: 'Giải thích được vì sao đúng 12 cung: 4 nguyên tố × 3 tam thái = 12 tổ hợp duy nhất, mỗi tổ hợp xuất hiện đúng một lần.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Xếp đúng 12 cung vào 4 nhóm nguyên tố và 3 nhóm tam thái, không cần nhìn bảng.',
  },
  {
    id: 'rulers',
    facet: 'Chủ quản',
    can: 'Nói được vì sao một hành tinh cổ điển cai quản hai cung, và vì sao chỉ ba cung có thêm chủ quản hiện đại.',
  },
  {
    id: 'precession',
    facet: 'Tuế sai',
    can: 'Giải thích được hoàng đạo tropical bám mùa chứ không bám chòm sao, và vì sao tuế sai làm hai hệ lệch khoảng 24°.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Phản biện được tin "cung thứ 13 / NASA đổi cung hoàng đạo" bằng lý do đúng, thay vì chỉ nói "tin giả".',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra được phần nào là dữ kiện thiên văn kiểm chứng được (góc, ngày, tuế sai) và phần nào là gán ý nghĩa của truyền thống (tính cách, chủ quản).',
  },
  {
    id: 'evidence',
    facet: 'Bằng chứng',
    can: 'Nói thẳng được rằng nghiên cứu tâm lý không tìm thấy liên hệ ổn định giữa ngày sinh và tính cách, và giải thích được vì sao mô tả cung vẫn "thấy đúng".',
  },
  {
    id: 'scope',
    facet: 'Phạm vi',
    can: 'Biết chỗ dừng của bài này: 12 cung và tuế sai; còn cung Mọc, 12 nhà, góc hợp thuộc bài bản đồ sao.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người bạn "cung hoàng đạo là gì và không là gì" trong hai phút, bằng lời của bạn.',
  },
];

export function CungHoangDaoChecklist() {
  return <UnderstandingChecklist topicId={TOPIC} facets={FACETS} />;
}

export function CungHoangDaoWhys() {
  return (
    <FiveWhys
      topicId={TOPIC}
      start={
        <>
          Một bài viết lan truyền: "NASA đã đổi cung hoàng đạo, có cung thứ 13 tên Xà Phu — bạn không
          còn là Bọ Cạp nữa". Người đọc hoang mang, thấy như vừa bị lấy mất một phần nhận dạng của
          mình.
        </>
      }
      chain={[
        {
          question: 'Vì sao tin đó không làm cung của bạn thay đổi?',
          because: (
            <>
              Vì cung hoàng đạo đang dùng {strong('không được định nghĩa theo chòm sao thật')} — nên
              chuyện chòm sao nằm ở đâu không đụng tới nó.
            </>
          ),
        },
        {
          question: 'Vậy cung được định nghĩa theo cái gì?',
          because: (
            <>
              Theo {strong('mùa')}: mốc 0° của cung Bạch Dương gắn vào điểm xuân phân, rồi vòng 360°
              được chia đều thành 12 ô 30°. Cung của bạn là ô chứa Mặt Trời vào ngày sinh.
            </>
          ),
        },
        {
          question: 'Vì sao người xưa lại gắn vào mùa mà không gắn vào chòm sao?',
          because: (
            <>
              Vì thứ họ thật sự theo dõi là {strong('chu kỳ Mặt Trời và mùa vụ')}. Thêm nữa, khoảng
              hai nghìn năm trước hai cách gắn mốc gần như trùng nhau, nên khác biệt chưa lộ ra để mà
              phải chọn.
            </>
          ),
        },
        {
          question: 'Vì sao bây giờ hai cách gắn mốc lại lệch nhau?',
          because: (
            <>
              Vì {strong('tuế sai')}: trục quay Trái Đất lắc chậm như một con quay, khiến điểm xuân
              phân trôi khoảng 1° mỗi 72 năm (trọn vòng mất khoảng 26.000 năm). Cộng dồn qua hai nghìn
              năm, độ lệch đã tới khoảng 24° — gần trọn một cung.
            </>
          ),
        },
        {
          question: 'Vì sao hiểu điều đó lại đổi cách ta phản ứng với tin giật tít?',
          because: (
            <>
              Vì khi đã biết "cung" là một {strong('ô 30° trong hệ quy ước theo mùa')}, ta thấy ngay
              hai điều: không có ai "đổi" được nó, và nó chưa bao giờ là tuyên bố "hôm bạn sinh có
              chòm sao X đứng sau Mặt Trời".
            </>
          ),
        },
      ]}
      root={
        <>
          Cung hoàng đạo là một {strong('hệ ký hiệu theo mùa')} có cấu trúc chặt chẽ và học được — chứ
          không phải một phép đo về con người. Hiểu đúng nó thì vừa không bị tin giật tít làm hoang
          mang, vừa không phải đặt lên nó kỳ vọng mà nó không gánh nổi:{' '}
          {strong('một ngôn ngữ chung để nói về mình, không phải lời phán số mệnh')}.
        </>
      }
    />
  );
}
