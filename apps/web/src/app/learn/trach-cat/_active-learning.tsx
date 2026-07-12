/**
 * Nội dung "học chủ động" cho trang /learn/trach-cat.
 *
 * Grounded từ các dữ kiện trạch cát (擇吉) đã được xác nhận trong bài: chọn ngày
 * & giờ tốt dựa trên lịch can–chi + ngũ hành + hệ thần sát; quy trình "3 lớp"
 * (hợp tuổi → hợp việc → giờ đẹp); ngày hoàng đạo / 12 Trực; các ngày kiêng phổ
 * biến (Tam Nương, Nguyệt Kỵ, Sát Chủ, Thọ Tử); giờ hoàng đạo suy từ địa chi
 * ngày. KHÔNG thêm dữ kiện mới, KHÔNG bịa bảng chính xác. Giữ giọng "tham khảo
 * theo phong tục, không phán số mệnh — không mê tín, không bán lễ".
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

export function TrachCatFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Sắp có một việc trọng đại — {strong('cưới hỏi, động thổ, khai trương, xuất hành, ký kết')} —
          và bạn muốn chọn một ngày giờ “thuận”, để mọi thứ khởi đầu chỉn chu và trong lòng an tâm hơn.
        </>
      }
      why={
        <>
          Trạch cát (擇吉 — “chọn điều lành”) là cách người xưa {strong('hệ thống hoá')} việc chọn thời
          điểm: dựa trên lịch can–chi, ngũ hành sinh–khắc và hệ thần sát. Nó tồn tại như một{' '}
          {strong('nếp văn hoá')} thể hiện sự chuẩn bị và tôn trọng, không phải bùa phép định sẵn kết
          quả.
        </>
      }
      what={
        <>
          Là việc chọn {strong('ngày và giờ tốt')} cho việc lớn, đối chiếu qua nhiều hệ quy chiếu: ngày
          hoàng đạo, 12 Trực, nhị thập bát tú, giờ hoàng đạo và các ngày kiêng. {strong('Không phải')}
          lời hứa thành công — chỉ là một góc nhìn tham khảo để chuẩn bị.
        </>
      }
      how={
        <>
          Thực dụng theo {strong('3 lớp')}: (1) hợp {strong('tuổi')} — tránh xung/hình/hại, tránh năm
          Kim Lâu, Hoang Ốc, Tam Tai; (2) hợp {strong('việc')} — chọn ngày có Trực/sao phù hợp loại
          việc, tránh ngày kiêng; (3) chọn {strong('giờ hoàng đạo')} trong ngày đó.
        </>
      }
      soWhat={
        <>
          Để bạn khởi sự với một {strong('mốc thời gian đã cân nhắc')} — hợp nhịp sinh hoạt, tránh trùng
          ngày kiêng theo phong tục, và quan trọng nhất là {strong('an tâm để tập trung')} vào phần
          thực chất: con người, năng lực và sự chuẩn bị.
        </>
      }
    />
  );
}

export function TrachCatDepth() {
  return (
    <DepthTabs
      topicId="trach-cat"
      concept="Vì sao chọn ngày tốt giúp ta an tâm — mà vẫn không bảo đảm thành công"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Trạch cát giống như chọn một ngày nắng đẹp để đi chơi xa: chọn khéo thì {strong('dễ chịu')}
              hơn, ai cũng vui. Nhưng chuyến đi vui hay không còn tuỳ mình chuẩn bị kỹ tới đâu — ngày
              đẹp chỉ là {strong('điểm khởi đầu tốt')}, không thay ta làm mọi việc.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Người xưa dựa vào {strong('lịch can–chi')} (âm lịch), ngũ hành sinh–khắc và hệ “thần
                sát” (sao tốt / sao xấu của từng ngày) để xếp ngày nào hợp việc gì. Cách làm gọn là{' '}
                {strong('3 lớp')}: hợp tuổi → hợp việc → chọn giờ đẹp trong ngày.
              </p>
              <p>
                Đây là một {strong('nếp văn hoá')} giúp việc lớn khởi đầu chỉn chu và mọi người thấy an
                tâm. Nhưng ngày giờ chỉ là cái khung — {strong('sự chuẩn bị và con người')} mới quyết
                định kết quả, nên chọn ngày đẹp rồi vẫn phải làm việc cho tử tế.
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
                Trạch cát chồng nhiều {strong('hệ quy chiếu')} lên cùng một ngày: (1) ngày hoàng đạo /
                hắc đạo — mỗi ngày ứng một trong 12 vị thần trực nhật, 6 hoàng đạo là ngày tốt; (2){' '}
                {strong('thập nhị Trực')} (Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu,
                Khai, Bế) — mỗi trực hợp/kỵ loại việc riêng; (3) nhị thập bát tú (28 sao, có tú cát – tú
                hung); (4) {strong('giờ hoàng đạo')} — trong 12 giờ (canh) của ngày có 6 giờ hoàng đạo,
                suy từ địa chi của ngày. Chồng lên nhau là để chọn ngày “sạch” nhiều mặt.
              </p>
              <p>
                Điểm cần giữ tỉnh táo: các hệ này {strong('không đo được nhân quả')} theo nghĩa khoa
                học. Giá trị thật của trạch cát là {strong('đồng bộ nhịp sinh hoạt')} (mọi người sắp
                lịch quanh một mốc đã chọn) cộng {strong('tâm lý an tâm')} khi thấy mình đã chuẩn bị chu
                đáo. Vì thế nó là công cụ tham khảo, không phải phép bảo đảm — và không cần “mua” sự may
                mắn bằng lễ lạt tốn kém.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

export function TrachCatDepthTruc() {
  return (
    <DepthTabs
      topicId="trach-cat"
      concept="Thập nhị Trực (12 Trực) là gì, và vì sao mỗi ngày lại “hợp” một loại việc khác nhau"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              12 Trực giống 12 kiểu ngày thay phiên nhau. Có ngày hợp “làm cho xong”, có ngày hợp
              “dọn bỏ cái cũ”, có ngày hợp “mở ra cái mới”. Mỗi kiểu ngày {strong('giỏi một việc')},
              không có kiểu ngày nào giỏi tất cả.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Mỗi ngày mang một trong 12 Trực xoay vòng theo thứ tự: Kiến, Trừ, Mãn, Bình, Định,
                Chấp, Phá, Nguy, Thành, Thu, Khai, Bế. Tên trực gợi luôn tính chất ngày:{' '}
                {strong('Định')} là ổn định (hợp ký kết, cưới hỏi), {strong('Khai')} là mở ra (hợp
                khai trương), {strong('Bế')} là đóng lại (kỵ mở hàng, khởi sự mới).
              </p>
              <p>
                Vì thế xem trực là cách đọc nhanh: ngày này nghiêng về {strong('khởi sự')} hay nên{' '}
                {strong('kiêng')}. Nhưng không trực nào tốt cho mọi việc — nên trực chỉ là một lớp
                trong nhiều lớp cùng xét.
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
                12 Trực (còn gọi “Kiến Trừ thập nhị khách”) gắn theo quan hệ giữa{' '}
                {strong('địa chi của ngày và địa chi của tháng')}: mỗi tháng, trực Kiến rơi vào ngày
                có chi trùng chi tháng, rồi 11 trực còn lại nối tiếp. Mỗi trực có bảng hợp/kỵ riêng
                theo lịch pháp.
              </p>
              <p>
                Cần biết là các bản lịch có {strong('dị bản nhỏ')}: tên gọi (“Thâu” hay “Thu”) và chi
                tiết hợp/kỵ từng trực không phải lúc nào cũng khớp nhau. Vì vậy nên đọc trực như một
                {' '}<strong>xu hướng tham khảo</strong>, chọn theo một bản lịch nhất quán thay vì so
                nhiều nguồn rồi rối.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}

export function TrachCatDepthSaoGio() {
  return (
    <DepthTabs
      topicId="trach-cat"
      concept="Vì sao cùng một ngày lại có giờ tốt và giờ xấu"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Một ngày được chia thành 12 khung giờ, như 12 ô. Có {strong('6 ô sáng')} (giờ tốt) và
              6 ô cần cẩn thận, xen kẽ nhau. Muốn làm việc quan trọng thì chọn một ô sáng — nhưng ô
              nào sáng thì mỗi ngày lại khác.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                12 canh giờ trong ngày (Tý, Sửu, Dần… Hợi, mỗi canh hai tiếng) được gắn 12 sao thần
                luân phiên: {strong('6 sao hoàng đạo')} (Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức,
                Ngọc Đường, Tư Mệnh) là giờ tốt; {strong('6 sao hắc đạo')} (Thiên Hình, Chu Tước, Bạch
                Hổ, Thiên Lao, Huyền Vũ, Câu Trận) là giờ nên thận trọng.
              </p>
              <p>
                Sao nào rơi vào giờ nào lại {strong('đổi theo địa chi của ngày')}. Đó là lý do giờ tốt
                của hôm nay khác giờ tốt của ngày mai — và vì sao không có “giờ chết” cố định.
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
                Cách xếp: mốc khởi sao Thanh Long đặt theo {strong('chi của ngày')} (bài quyết cổ “Dần
                Thân gia Tý, Mão Dậu Dần, Thìn Tuất Thìn, Tỵ Hợi Ngọ, Tý Ngọ Thân, Sửu Mùi Tuất”), rồi
                xếp vòng 12 sao cố định lên 12 canh. Vì vòng cố định là 6 tốt xen 6 xấu, mỗi ngày{' '}
                {strong('luôn có đúng 6 giờ hoàng đạo')}.
              </p>
              <p>
                Đây chính là phép mà công cụ giờ hoàng đạo của hieu.asia tính ra khi bạn nhập ngày.
                Cùng hệ 12 sao thần này còn được dùng để định {strong('ngày')} hoàng đạo / hắc đạo (khi
                đó mốc khởi đổi theo tháng) — nên bạn sẽ gặp lại đúng những tên sao ấy ở cả lớp ngày lẫn
                lớp giờ.
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
    prompt: 'Quy trình thực dụng “3 lớp” để chọn ngày tốt gồm những lớp nào, theo thứ tự?',
    answer: (
      <>
        Ba lớp theo thứ tự: (1) hợp {strong('tuổi')} — tránh xung/hình/hại con giáp, việc cưới hoặc làm
        nhà tránh năm Kim Lâu, Hoang Ốc, Tam Tai; (2) hợp {strong('việc')} — chọn ngày có Trực và sao
        phù hợp với loại việc, tránh các ngày kiêng; (3) chọn {strong('giờ hoàng đạo')} trong chính
        ngày đã chọn.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Ngày hoàng đạo được hiểu là gì?',
    choices: [
      {
        text: 'Ngày ứng với một trong 6 vị thần thiện (hoàng đạo) trong 12 vị thần trực nhật — được xem là ngày tốt',
        correct: true,
        note: 'Đúng — 6 hoàng đạo (Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức/Bảo Quang, Ngọc Đường, Tư Mệnh) là ngày tốt; 6 hắc đạo còn lại thì kỵ việc lớn.',
      },
      {
        text: 'Ngày Mặt Trời đi qua chính giữa bầu trời',
        note: 'Không — “hoàng đạo” ở đây là khái niệm thần sát trong lịch pháp, không phải hiện tượng thiên văn.',
      },
      {
        text: 'Ngày rằm và mùng một âm lịch',
        note: 'Không — hoàng đạo/hắc đạo xoay theo 12 vị thần trực nhật, không cố định vào rằm hay mùng một.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Ngày Tam Nương theo phong tục rơi vào những ngày âm lịch nào?',
    choices: [
      {
        text: 'Mùng 3, 7, 13, 18, 22, 27',
        correct: true,
        note: 'Đúng — dân gian gọi là ngày Tam Nương, thường tránh khởi sự việc lớn; Nguyệt Kỵ lại là mùng 5, 14, 23.',
      },
      {
        text: 'Mùng 5, 14, 23',
        note: 'Đó là ngày Nguyệt Kỵ, không phải Tam Nương.',
      },
      {
        text: 'Rằm, mùng một và ngày cuối tháng',
        note: 'Không — Tam Nương là một danh sách ngày riêng theo phong tục.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Giờ hoàng đạo trong một ngày được xác định dựa vào đâu?',
    choices: [
      {
        text: 'Suy từ địa chi của chính ngày đó — trong 12 giờ (canh) có 6 giờ là hoàng đạo',
        correct: true,
        note: 'Đúng — mỗi ngày mang một địa chi, từ đó suy ra 6 giờ hoàng đạo (giờ tốt) trong 12 canh.',
      },
      {
        text: 'Cứ ban ngày là giờ hoàng đạo, ban đêm là hắc đạo',
        note: 'Không — giờ hoàng đạo rải cả ngày lẫn đêm, suy theo địa chi của ngày.',
      },
      {
        text: 'Do người xem tự chọn theo cảm giác',
        note: 'Không — giờ hoàng đạo có quy tắc suy từ địa chi ngày, không tuỳ ý.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Một người đã chọn được ngày rất đẹp để khai trương nhưng không chuẩn bị hàng hoá, nhân sự gì. Trạch cát có “cứu” được việc đó không? Vì sao?',
    answer: (
      <>
        Không. Trạch cát chỉ giúp chọn một {strong('mốc khởi đầu đã cân nhắc')} và mang lại sự an tâm,
        thể hiện sự chuẩn bị & tôn trọng — nó {strong('không bảo đảm thành công')}. Điều thực sự quyết
        định vẫn là sự chuẩn bị, con người và năng lực. Ngày đẹp mà thiếu chuẩn bị thì việc vẫn khó
        thành.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Vì sao trong cùng một ngày lại có giờ tốt và giờ xấu?',
    choices: [
      {
        text: 'Mỗi ngày, 12 canh giờ được gắn 12 sao thần luân phiên — 6 sao hoàng đạo (giờ tốt) xen 6 sao hắc đạo (giờ xấu); sao nào rơi giờ nào đổi theo địa chi của ngày',
        correct: true,
        note: 'Đúng — vòng 12 sao cố định là 6 tốt xen 6 xấu, nên mỗi ngày luôn có đúng 6 giờ hoàng đạo, và khung giờ tốt đổi theo chi ngày.',
      },
      {
        text: 'Cứ ban ngày là giờ tốt, ban đêm là giờ xấu',
        note: 'Không — sáu giờ hoàng đạo rải cả ngày lẫn đêm, suy theo địa chi của ngày chứ không theo sáng/tối.',
      },
      {
        text: 'Giờ tốt cố định (ví dụ luôn là giờ Ngọ) cho mọi ngày',
        note: 'Không — mốc khởi sao Thanh Long đổi theo chi ngày, nên giờ tốt hôm nay khác giờ tốt ngày mai.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Một ngày vừa là hoàng đạo, vừa mang trực “Thành” — vậy nó có tốt cho MỌI việc không?',
    choices: [
      {
        text: 'Không — mỗi loại việc còn xét thêm sao ngày riêng: Thiên Hỷ hợp cưới hỏi, còn Đại/Tiểu Hao lại kỵ việc tiền bạc; một ngày hiếm khi tốt cho mọi việc',
        correct: true,
        note: 'Đúng — hoàng đạo và trực chỉ là hai lớp nền; sao ngày gắn với từng loại việc mới quyết định ngày đó hợp cưới, hợp khai trương hay không.',
      },
      {
        text: 'Có — đã là hoàng đạo thì tốt cho tất cả',
        note: 'Không — cùng một ngày có thể tốt cho việc này nhưng vướng sao xấu cho việc khác.',
      },
      {
        text: 'Có, miễn là chọn thêm một giờ hoàng đạo trong ngày',
        note: 'Không — giờ đẹp không xoá được sao xấu gắn với một loại việc cụ thể; vẫn phải xét sao ngày theo việc.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Vận dụng: Vì lý do thực tế, bạn buộc phải khai trương vào một ngày bị coi là “xấu”. Điều đó có làm hỏng việc không, và nên nghĩ thế nào?',
    answer: (
      <>
        Không tất định. Ngày “xấu” theo lịch pháp là {strong('lời nhắc thận trọng')} theo phong tục,
        không phải bản án. Cái quyết định vẫn là sự chuẩn bị — hàng hoá, nhân sự, dịch vụ — chứ không
        phải con số ngày. Bạn có thể chọn một {strong('giờ hoàng đạo')} trong ngày đó, chuẩn bị kỹ hơn
        và giữ tâm thế bình tĩnh; đó mới là cách “hoá giải” thực tế, và cũng đúng tinh thần tham khảo,
        không phán số mệnh.
      </>
    ),
  },
];

export function TrachCatRecall() {
  return <ActiveRecall topicId="trach-cat" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được trạch cát dùng để làm gì (chọn ngày giờ tốt cho việc lớn, để chuẩn bị chỉn chu và an tâm) — và nó KHÔNG hứa gì (không bảo đảm thành công).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả nền tảng: lịch can–chi (âm lịch) + ngũ hành sinh–khắc + hệ thần sát (sao tốt/xấu của từng ngày).',
  },
  {
    id: 'process',
    facet: 'Quy trình',
    can: 'Kể đúng quy trình “3 lớp”: hợp tuổi → hợp việc → chọn giờ hoàng đạo, và giải thích mỗi lớp làm gì.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể được các hệ quy chiếu chính: ngày hoàng đạo/hắc đạo, 12 Trực, nhị thập bát tú, giờ hoàng đạo, thần sát.',
  },
  {
    id: 'layers',
    facet: 'Nhiều lớp sao',
    can: 'Giải thích được các lớp chồng lên nhau khi xét một ngày (hoàng đạo/hắc đạo, 12 Trực, sao ngày theo việc, 12 sao giờ, nhị thập bát tú) — và vì sao một ngày hiếm khi tốt cho mọi việc.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt được ngày Tam Nương (3,7,13,18,22,27) với Nguyệt Kỵ (5,14,23), và biết chúng là quy ước phong tục.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra trạch cát giúp gì (đồng bộ nhịp sinh hoạt + tâm lý an tâm) và KHÔNG giúp gì (không đo nhân quả, không thay sự chuẩn bị).',
  },
  {
    id: 'variants',
    facet: 'Dị bản giữa các lịch',
    can: 'Giải thích được vì sao hai bản lịch có thể nói cùng một ngày tốt/xấu khác nhau (dị bản giữa các sách lịch), và vì sao nên chọn một hệ nhất quán thay vì so nhiều nguồn rồi rối.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao chọn ngày đẹp không đồng nghĩa chắc chắn may mắn, và vì sao không cần tốn tiền mua lễ để “giải”.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân “trạch cát là gì và nên dùng thế nào” bằng lời của bạn, giữ giọng tham khảo.',
  },
];

export function TrachCatChecklist() {
  return <UnderstandingChecklist topicId="trach-cat" facets={FACETS} />;
}

export function TrachCatWhys() {
  return (
    <FiveWhys
      topicId="trach-cat"
      start={
        <>
          Một người xem được ngày cưới rất đẹp (hoàng đạo, hợp tuổi), liền yên tâm rằng hôn nhân chắc
          chắn sẽ hạnh phúc, và bỏ qua việc chuẩn bị, thấu hiểu nhau trước khi về chung nhà.
        </>
      }
      chain={[
        {
          question: 'Vì sao “chọn được ngày đẹp nên hôn nhân chắc chắn hạnh phúc” là suy nghĩ chưa hợp lý?',
          because: <>Vì trạch cát {strong('không bảo đảm')} kết quả của việc đó.</>,
        },
        {
          question: 'Vì sao trạch cát không bảo đảm được kết quả?',
          because: (
            <>
              Vì nó chỉ giúp chọn một {strong('mốc khởi đầu đã cân nhắc')} — điều quyết định thành hay
              bại là sự chuẩn bị, con người và năng lực.
            </>
          ),
        },
        {
          question: 'Vậy giá trị thật của việc chọn ngày tốt nằm ở đâu?',
          because: (
            <>
              Ở chỗ {strong('đồng bộ nhịp sinh hoạt')} (mọi người cùng sắp lịch quanh một mốc) và{' '}
              {strong('tâm lý an tâm')} khi thấy mình đã chuẩn bị chu đáo, đúng phong tục.
            </>
          ),
        },
        {
          question: 'Vì sao đó lại là “tham khảo” chứ không phải quy luật tất định?',
          because: (
            <>
              Vì hệ ngày hoàng đạo, 12 Trực, thần sát… là {strong('quy ước lịch pháp – văn hoá')}, không
              đo được nhân quả theo nghĩa khoa học; nó là khung nhắc nhở, không phải phép màu.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng trạch cát?',
          because: (
            <>
              Vì hiểu đúng rồi thì ta dùng nó để {strong('an tâm và chuẩn bị kỹ hơn')}, chứ không ỷ lại
              vào ngày giờ — càng không cần tốn tiền mua lễ để “giải”.
            </>
          ),
        },
      ]}
      root={
        <>
          Trạch cát là một nếp văn hoá đẹp để khởi sự việc lớn cho chỉn chu và an tâm, không phải lời
          hứa may mắn. Chọn ngày giờ tốt rồi vẫn phải dồn sức vào phần thực chất — con người và sự chuẩn
          bị. Hãy dùng nó như một góc nhìn để chủ động hơn, {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
