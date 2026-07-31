/**
 * Nội dung "học chủ động" cho trang /learn/xuat-hanh.
 *
 * GROUNDING (không có dữ kiện nào nằm ngoài các nguồn này):
 *   • lib/xuat-hanh.ts — HY_THAN, TAI_THAN (import trực tiếp để phần "chốt đáp
 *     án" luôn khớp bảng, không gõ tay), computeXuatHanh() suy hướng từ
 *     `dayCanChi.stem` (THIÊN CAN của ngày), phần chú nguồn trong docstring:
 *     Hỷ Thần theo khẩu quyết 《考原》 (đồng thuận Việt + Trung); Tài Thần dùng
 *     bản lịch vạn niên Việt Nam (7 hướng, không dùng Đông Bắc) và có nhiều phái
 *     Trung Quốc khác nhau; mốc xác thực 17/02/2026 (Nhâm Tuất) → Chính Nam /
 *     Chính Tây và 29/01/2025 (Mậu Tuất) → Hỷ Thần Đông Nam.
 *   • lib/gio-hoang-dao.ts — dayCanChi() (can chi ngày từ số ngày Julian), dùng
 *     để lấy can của các ngày ví dụ 7/9/2026 (Giáp Thân), 9/9/2026 (Bính Tuất),
 *     17/9/2026 (Giáp Ngọ).
 *   • app/xuat-hanh/ + components/xuat-hanh/XuatHanhChecker.tsx — cách trang công
 *     cụ mô tả hai vị thần và các cảnh báo minh bạch.
 *
 * PHÂN VAI: bài này chỉ sở hữu HƯỚNG xuất hành. Chọn ngày → /learn/trach-cat;
 * chọn giờ → /learn/gio-hoang-dao; hướng nhà theo cung phi → /learn/bat-trach.
 * Ở đây chỉ nhắc và trỏ link, KHÔNG giảng lại. Giữ giọng "tra cứu phong tục để
 * tham khảo — không phán số mệnh".
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
import { HY_THAN, TAI_THAN } from '@/lib/xuat-hanh';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

/** Đáp án hướng lấy thẳng từ bảng của lib, không chép tay. */
const hy = (can: string) => HY_THAN[can]!;
const tai = (can: string) => TAI_THAN[can]!;

export function XuatHanhFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Sáng mùng Một Tết (hoặc hôm bạn đi xa, đi mở hàng, đi ký kết), người nhà hỏi{' '}
          {strong('“năm nay xuất hành hướng nào?”')} — và bạn muốn có một câu trả lời rõ ràng, kiểm
          chứng được, thay vì mỗi người nói một phách.
        </>
      }
      why={
        <>
          Người xưa cho rằng mỗi ngày có những phương vị “gặp” thần lành: {strong('Hỷ Thần')} chủ
          may mắn, hỉ sự và {strong('Tài Thần')} chủ tài lộc. Bước ra đúng phía ấy là một nghi thức
          khởi đầu — một nét văn hoá, không phải quy luật tự nhiên.
        </>
      }
      what={
        <>
          Hai hướng này suy từ {strong('thiên can của NGÀY')} — chỉ vậy. Không dùng tuổi, không dùng
          giới tính, không dùng cả chi của ngày. Hệ quả: cùng một ngày thì{' '}
          {strong('cả nhà chung một cặp hướng')}, ai tra cũng ra như nhau.
        </>
      }
      how={
        <>
          Lấy can chi của ngày, giữ lại {strong('chữ đầu tiên')} (can), dóng xuống bảng 10 dòng là ra
          hai hướng. Vì vòng can có 10 tên nên hướng xuất hành{' '}
          {strong('lặp lại theo chu kỳ 10 ngày')}. Công cụ tự làm hết khi bạn nhập ngày.
        </>
      }
      soWhat={
        <>
          Để bạn giữ được nếp đẹp mà {strong('không đánh đổi an toàn')}: hướng chỉ là lớp nghi thức
          ngoài cùng, còn đường đi an toàn và sự chuẩn bị mới quyết định chuyến đi. Và để bạn không
          gộp nhầm với {strong('hướng nhà theo tuổi')} — một hệ hoàn toàn khác.
        </>
      }
    />
  );
}

export function XuatHanhDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="xuat-hanh"
        concept="Vì sao hướng xuất hành đổi theo NGÀY mà không đổi theo người"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hướng xuất hành giống như {strong('thời tiết')}: hôm nay cả xóm cùng nắng, mai cả xóm
                cùng mưa. Nó thuộc về {strong('cái ngày')}, không thuộc về từng người. Nên hôm nay bà,
                mẹ và bé bước ra cửa đều cùng một hướng — không ai có hướng riêng cả.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi ngày trong lịch âm mang một cặp tên gọi kiểu “ngày Giáp Thân”, “ngày Bính Tuất”.
                  Chữ đầu là {strong('thiên can')} (10 tên: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân,
                  Nhâm, Quý), chữ sau là {strong('địa chi')} (12 tên quen thuộc: Tý, Sửu, Dần…).
                </p>
                <p>
                  Hướng xuất hành {strong('chỉ đọc chữ đầu')}. Bảng tra chỉ có đúng 10 dòng cho 10
                  can, và trong bảng không hề có cột nào cho năm sinh. Vì thế trong cùng một ngày, mọi
                  người đều dùng chung một kết quả — điều này rất dễ kiểm chứng: bạn và người hàng xóm
                  cùng nhập một ngày vào công cụ sẽ thấy hai màn hình giống hệt nhau.
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
                  Nói bằng ngôn ngữ dữ liệu: hàm tính hướng nhận vào một ngày dương lịch, suy ra can
                  chi ngày, rồi {strong('chỉ dùng phần can')} để tra hai bảng. Không có tham số nào
                  khác đi vào phép tính — không tuổi, không giới tính, không nơi ở. Đây là lý do
                  hieu.asia gọi lớp này là {strong('minh bạch và kiểm chứng được')}: không có chỗ cho
                  ai đó “xem riêng” rồi ra một kết quả đặc biệt.
                </p>
                <p>
                  Điều đó cũng vạch ra một ranh giới hữu ích khi đọc các nguồn khác: hễ ai bảo bạn
                  hướng xuất hành của bạn khác hướng của người bên cạnh {strong('trong cùng một ngày')},
                  thì họ đang nói về một hệ khác (thường là hướng theo cung phi, tức hướng nhà theo
                  tuổi) chứ không phải hệ này.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="xuat-hanh"
        concept="Chu kỳ 10 ngày: vì sao là 10 chứ không phải 7 hay 12"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng {strong('10 tấm thẻ')} xếp thành vòng tròn, mỗi tấm ghi một hướng.
                Mỗi ngày ta lật sang tấm kế tiếp. Lật hết 10 tấm thì quay lại tấm đầu — nên cứ{' '}
                {strong('10 ngày')} là hướng lại giống y như cũ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Thiên can là một vòng gồm đúng 10 tên, chạy tuần tự rồi quay lại đầu. Vì hướng xuất
                  hành chỉ phụ thuộc can, chu kỳ của nó {strong('bằng đúng chu kỳ của can: 10 ngày')}
                  . Không phải 7 như tuần lễ, cũng không phải 12 như vòng con giáp.
                </p>
                <p>
                  Kiểm chứng bằng ví dụ thật: {strong('7/9/2026')} là ngày Giáp Thân, và{' '}
                  {strong('17/9/2026')} — đúng 10 ngày sau — là ngày Giáp Ngọ. Chi đã đổi từ Thân
                  sang Ngọ, nhưng can vẫn là Giáp, nên cả hai ngày đều có Hỷ Thần {hy('Giáp')} và Tài
                  Thần {tai('Giáp')}.
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
                  Điểm tinh tế: can và chi chạy song song nhưng lệch chu kỳ (10 và 12), nên cặp can
                  chi đầy đủ mới lặp sau {strong('60 ngày')} — đó là vòng lục thập hoa giáp. Nhưng
                  hướng xuất hành chỉ lấy một nửa thông tin, nên nó lặp sớm hơn nhiều: 10 ngày.
                </p>
                <p>
                  Hệ quả thực hành đáng nhớ: trong một tháng dương lịch, mỗi cặp hướng xuất hiện{' '}
                  {strong('khoảng ba lần')}. Nghĩa là nếu hôm nay hướng bất tiện với bạn, bạn không
                  cần chờ lâu — nhưng cũng nghĩa là đừng kỳ vọng “hướng đẹp” là chuyện hiếm có khó
                  tìm. Nó quay lại đều đặn như một cái đồng hồ.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="xuat-hanh"
        concept="Hỷ Thần và Tài Thần: hai bảng, hai kiểu gom can"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có {strong('hai ông thần')} được nhắc tới. Một ông lo chuyện {strong('vui')} — đi chơi
                Tết, đi gặp người mình quý. Một ông lo chuyện {strong('tiền')} — đi bán hàng, đi làm
                ăn. Mỗi ngày hai ông đứng ở hai phía khác nhau, ta chọn phía nào hợp với việc mình
                định làm.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Hỷ Thần')} (喜神) là phương vị cầu may mắn, hỉ sự — hợp với chuyến đi mong
                  điều lành nói chung. {strong('Tài Thần')} (財神) là phương vị cầu tài lộc — hợp với
                  việc làm ăn, mở hàng, giao dịch.
                </p>
                <p>
                  Hai bảng gom 10 can theo hai kiểu khác nhau, nên số hướng cũng khác. Bảng Hỷ Thần
                  ghép 10 can thành {strong('5 cặp')}, mỗi cặp một hướng. Bảng Tài Thần chia mịn hơn:
                  có cặp dùng chung, có can đứng riêng, tổng cộng {strong('7 hướng')} và{' '}
                  {strong('không dùng Đông Bắc')}. Số hướng khác nhau không có nghĩa vị nào “mạnh”
                  hơn.
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
                  Nhìn kỹ cách gom sẽ thấy hai bảng có cấu trúc rất khác nhau. Hỷ Thần ghép hai can{' '}
                  {strong('cách nhau đúng 5 bậc')} trong vòng 10 can (Giáp thứ 1 với Kỷ thứ 6, Ất thứ
                  2 với Canh thứ 7…), nên gói được vào một khẩu quyết năm vế và gần như không nguồn
                  nào chép lệch. Tài Thần thì ghép các can {strong('liền kề')} (Giáp – Ất, Bính –
                  Đinh, Canh – Tân) và để bốn can Mậu, Kỷ, Nhâm, Quý mỗi can một hướng — cấu trúc
                  không đối xứng, không có khẩu quyết ngắn nào gói nổi.
                </p>
                <p>
                  Chính chỗ “không gói được thành quy luật gọn” ấy giải thích vì sao{' '}
                  {strong('Tài Thần có nhiều phái chép khác nhau')} còn Hỷ Thần thì không. hieu.asia
                  chọn bản lịch vạn niên Việt Nam cho Tài Thần và {strong('ghi rõ lựa chọn đó')} thay
                  vì trình bày như thể chỉ có một phiên bản duy nhất trên đời.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="xuat-hanh"
        concept="Hướng xuất hành và hướng nhà: hai hệ đừng gộp"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hướng xuất hành giống {strong('cái áo mặc hôm nay')} — mỗi ngày một khác. Hướng nhà
                giống {strong('chiều cao của bạn')} — cả năm không đổi. Hai thứ đó chẳng liên quan gì
                tới nhau, đừng đem so với nhau.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Hướng nhà theo phong thuỷ Bát Trạch tính từ {strong('năm sinh và giới tính')} của
                  người, ra một thứ gọi là cung phi, rồi từ đó chia 8 hướng thành nhóm hợp và không
                  hợp. Nó áp cho {strong('những thứ đứng yên')}: cửa chính, bếp, giường.
                </p>
                <p>
                  Hướng xuất hành thì tính từ {strong('can của ngày')}, đổi mỗi ngày, và áp cho{' '}
                  {strong('phía bạn bước ra')} khi rời nhà hôm đó. Một câu để nhớ:{' '}
                  {strong('hướng xuất hành đi theo tờ lịch, hướng nhà đi theo con người')}.
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
                  Vì hai hệ dùng đầu vào khác nhau (ngày với người) và áp lên đối tượng khác nhau
                  (chuyến đi với ngôi nhà), chúng {strong('không mâu thuẫn và cũng không cộng dồn')}.
                  Nhà quay hướng Tây mà hôm nay Hỷ Thần ở Đông Bắc không phải là “xung”: cửa vẫn đứng
                  yên chỗ cũ, còn bạn thì đi về phía Đông Bắc một đoạn rồi đi tiếp việc của mình.
                </p>
                <p>
                  Sai lầm hay gặp là cố ghép hai kết luận thành một điểm số tổng — kiểu “hướng nhà tốt
                  nhưng hướng xuất hành xấu nên hôm nay coi như hoà”. Không có phép cộng nào như vậy
                  cả, vì {strong('hai hệ không đo cùng một thứ')}. Muốn dùng thì dùng riêng, đọc riêng
                  từng lớp.
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
    type: 'mcq',
    prompt: 'Hướng xuất hành của một ngày được suy ra từ đâu?',
    choices: [
      {
        text: 'Từ năm sinh của người đi (cung phi)',
        note: 'Không — đó là cách tính hướng NHÀ theo Bát Trạch, một hệ hoàn toàn khác.',
      },
      {
        text: 'Từ thiên can của ngày (Giáp, Ất, Bính…)',
        correct: true,
        note: 'Đúng — chỉ can của ngày, nên cùng một ngày thì mọi người chung một cặp hướng.',
      },
      {
        text: 'Từ địa chi của ngày (Tý, Sửu, Dần…)',
        note: 'Không — chi của ngày dùng ở lớp chọn GIỜ (khởi vòng sao trực giờ), không dùng cho hướng.',
      },
    ],
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Hai người trong cùng một nhà, một người sinh 1970, một người sinh 2005, cùng ra khỏi nhà một buổi sáng. Hướng xuất hành của họ thế nào?',
    choices: [
      {
        text: 'Giống hệt nhau — vì hướng chỉ phụ thuộc ngày',
        correct: true,
        note: 'Đúng — bảng tra không có cột nào cho năm sinh; ai tra cũng ra như nhau.',
      },
      {
        text: 'Khác nhau — vì mỗi người một tuổi, một mệnh',
        note: 'Không — đó là cách hoạt động của hướng nhà theo cung phi, không phải hướng xuất hành.',
      },
      {
        text: 'Còn tuỳ ai bước ra cửa trước',
        note: 'Không — thứ tự ra cửa không nằm trong dữ liệu tính hướng.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'open',
    prompt: 'Vì sao hướng xuất hành lặp lại theo chu kỳ 10 ngày, chứ không phải 7 hay 12 ngày?',
    answer: (
      <>
        Vì vòng {strong('thiên can chỉ có 10 tên')} (Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm,
        Quý) rồi quay lại đầu, mà hướng xuất hành chỉ phụ thuộc can. 7 là chu kỳ của tuần lễ, 12 là
        chu kỳ của địa chi — cả hai đều không liên quan. Kiểm chứng: 7/9/2026 là ngày Giáp Thân và
        17/9/2026 là ngày Giáp Ngọ, chi đã khác nhưng can vẫn là Giáp nên hai hướng giống hệt.
      </>
    ),
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Ngày 9/9/2026 là ngày Bính Tuất. Hướng Hỷ Thần hôm đó là hướng nào?',
    choices: [
      {
        text: hy('Bính'),
        correct: true,
        note: 'Đúng — giữ can Bính, dóng xuống bảng Hỷ Thần là ra ngay; phần chi Tuất không dùng tới.',
      },
      {
        text: tai('Bính'),
        note: 'Đây là hướng TÀI THẦN của ngày can Bính — nhầm cột.',
      },
      {
        text: hy('Giáp'),
        note: 'Đây là hướng Hỷ Thần của ngày can Giáp — nhầm dòng.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Nói bằng lời của bạn: hướng xuất hành khác hướng nhà (Bát Trạch) ở những điểm nào?',
    answer: (
      <>
        Khác ở đầu vào, ở nhịp đổi và ở đối tượng áp dụng. Hướng xuất hành tính từ{' '}
        {strong('can của NGÀY')}, đổi mỗi ngày và lặp sau 10 ngày, áp cho{' '}
        {strong('phía bạn bước ra')} hôm đó — cùng ngày thì cả nhà giống nhau. Hướng nhà tính từ{' '}
        {strong('năm sinh và giới tính của NGƯỜI')}, gắn với người đó lâu dài, áp cho{' '}
        {strong('những thứ đứng yên')} như cửa chính, bếp, giường — mỗi người một bảng riêng. Một câu
        để nhớ: hướng xuất hành đi theo tờ lịch, hướng nhà đi theo con người.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Vì sao hai cuốn lịch có thể ghi hướng Tài Thần khác nhau cho cùng một ngày?',
    choices: [
      {
        text: 'Vì một trong hai cuốn in sai',
        note: 'Thường không phải vậy — mỗi cuốn có thể đang theo một phái khác nhau và đều nhất quán trong hệ của mình.',
      },
      {
        text: 'Vì Tài Thần có nhiều phái tính khác nhau; hieu.asia chọn bản lịch vạn niên Việt Nam và ghi rõ lựa chọn đó',
        correct: true,
        note: 'Đúng — và chính việc các bản chép khác nhau là bằng chứng đây là quy ước phong tục, không phải hiện tượng đo được.',
      },
      {
        text: 'Vì hướng Tài Thần còn phụ thuộc nơi bạn đang đứng',
        note: 'Không — dữ liệu tính hướng chỉ có can của ngày, không có vị trí địa lý.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Hướng Hỷ Thần hôm nay là Đông Bắc, nhưng đường phía Đông Bắc đang sửa, tối và xa hơn 6 km. Cách xử lý hợp lý nhất?',
    choices: [
      {
        text: 'Cứ đi đường Đông Bắc cho đúng hướng, cẩn thận hơn là được',
        note: 'Không nên — bạn đang đổi một lợi ích tinh thần lấy một rủi ro có thật trên đường.',
      },
      {
        text: 'Đi đường an toàn như bình thường; hướng chỉ là lớp nghi thức, không đáng đánh đổi',
        correct: true,
        note: 'Đúng — đường đi an toàn và sự chuẩn bị quan trọng hơn hướng đi rất nhiều.',
      },
      {
        text: 'Hoãn chuyến đi sang ngày khác có hướng dễ đi hơn',
        note: 'Hiếm khi cần — và nếu việc gấp thì hoãn còn tốn kém hơn cả đi vòng.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt: 'Bảng tra hướng xuất hành KHÔNG chứa những gì? Kể ít nhất ba thứ.',
    answer: (
      <>
        Nó không chứa {strong('quãng đường phải đi')}, {strong('thời gian phải đi')}, {strong('giờ xuất phát')}
        , câu khấn, lễ vật hay bất kỳ nghi thức nào — và cũng không có cột nào cho tuổi người đi. Toàn
        bộ dữ liệu chỉ là 10 dòng can ngày với hai cột hướng. Gặp một con số cụ thể kiểu “đi đủ bao
        nhiêu mét mới tính”, hãy hiểu đó là tập tục địa phương hoặc ý người viết, không đến từ bảng
        tra này. Riêng {strong('giờ')} xuất phát thì có lớp riêng — đọc ở bài Giờ Hoàng Đạo.
      </>
    ),
  },
];

export function XuatHanhRecall() {
  return <ActiveRecall topicId="xuat-hanh" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được hướng xuất hành dùng để làm gì (chọn phía bước ra khi rời nhà trong một ngày cụ thể) — và nó KHÔNG hứa gì.',
  },
  {
    id: 'input',
    facet: 'Đầu vào',
    can: 'Chỉ đúng được thứ duy nhất quyết định hướng: thiên can của NGÀY — không phải tuổi, không phải giới tính, không phải chi của ngày.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Phân biệt được hai vị: Hỷ Thần (喜神) chủ may mắn, hỉ sự; Tài Thần (財神) chủ tài lộc — và biết chọn vị nào theo việc mình định làm.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Tra tay được trong hai bước: lấy can chi ngày → giữ phần can → dóng xuống bảng 10 dòng đọc hai ô hướng.',
  },
  {
    id: 'cycle',
    facet: 'Chu kỳ',
    can: 'Giải thích được vì sao hướng lặp lại sau đúng 10 ngày (vòng can có 10 tên), và vì sao không phải 7 hay 12.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Nói rõ hướng xuất hành khác hướng nhà theo cung phi thế nào — đổi theo ngày với cố định theo người, chuyến đi với ngôi nhà — và vì sao không cộng dồn hai hệ.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được bài này chỉ sở hữu lớp HƯỚNG; chọn ngày, chọn giờ, ngày kiêng kỵ và hướng nhà là các lớp khác, có bài và công cụ riêng.',
  },
  {
    id: 'sources',
    facet: 'Nguồn & dị bản',
    can: 'Biết Hỷ Thần theo khẩu quyết cổ 《考原》 gần như không có tranh cãi, còn Tài Thần có nhiều phái — hieu.asia dùng bản lịch vạn niên Việt Nam và ghi rõ điều đó.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao không cần quay lại khi lỡ đi nhầm phía, vì sao không nên đi vòng qua đường nguy hiểm để "đúng hướng", và vì sao không có gì cần hoá giải.',
  },
  {
    id: 'apply',
    facet: 'Vận dụng & dạy lại',
    can: 'Với một ngày cụ thể, tự tra ra hai hướng rồi quyết định được hôm nay có tiện đi theo hướng đó không — và giảng lại cho người thân bằng lời của bạn, giữ giọng tham khảo.',
  },
];

export function XuatHanhChecklist() {
  return <UnderstandingChecklist topicId="xuat-hanh" facets={FACETS} />;
}

export function XuatHanhWhys() {
  return (
    <FiveWhys
      topicId="xuat-hanh"
      start={
        <>
          Sáng mùng Một, một người tra thấy Hỷ Thần ở {strong('Đông Bắc')}. Nhưng con đường phía Đông
          Bắc đang sửa, tối và vòng thêm mấy cây số. Người ấy vẫn quyết đi đường đó, chở theo cả nhà,
          vì “đầu năm phải xuất hành đúng hướng”.
        </>
      }
      chain={[
        {
          question: 'Vì sao quyết định đó đáng xem lại?',
          because: (
            <>
              Vì nó {strong('đổi một rủi ro có thật lấy một lợi ích tinh thần')}. Đường đang sửa, trời
              tối, đi vòng — đó là những yếu tố làm tăng khả năng xảy ra chuyện thật, còn hướng thì
              không tác động gì tới mặt đường.
            </>
          ),
        },
        {
          question: 'Vì sao có thể nói hướng không tác động gì tới chuyến đi?',
          because: (
            <>
              Vì hướng xuất hành là {strong('một quy ước lịch pháp')}, không phải một điều kiện vật
              lý. “Hỷ Thần”, “Tài Thần” là thần sát trong lịch cổ —{' '}
              {strong('không phải thiên thể có thật')}, không có phép đo nào xác nhận Tài Thần “đang
              đứng” ở Chính Đông vào một ngày Bính.
            </>
          ),
        },
        {
          question: 'Có bằng chứng nào cho thấy đó là quy ước chứ không phải quy luật?',
          because: (
            <>
              Có, và rất rõ: {strong('các phái ghi khác nhau')}. Riêng bảng Tài Thần đã có mấy dòng
              tư liệu Trung Hoa cho ra hướng khác nhau ở cùng một ngày, nên hai cuốn lịch có thể ghi
              hai kết quả. Nếu đây là hiện tượng đo được thì đã không có chuyện mỗi bản chép một kiểu.
            </>
          ),
        },
        {
          question: 'Vậy vì sao tục này vẫn tồn tại và vẫn đáng giữ?',
          because: (
            <>
              Vì cái nó cho là {strong('giá trị nghi thức và giá trị tình cảm')}: bước ra cửa với một
              ý định rõ ràng thay vì trong vội vã, và cùng người thân lớn tuổi giữ một nếp đẹp đầu
              năm. Hai thứ đó có thật — chỉ khác hẳn với “bảo đảm may mắn”.
            </>
          ),
        },
        {
          question: 'Biết vậy thì cách dùng hướng xuất hành nên đổi thế nào?',
          because: (
            <>
              Nó chuyển hướng từ {strong('điều kiện bắt buộc')} thành {strong('lựa chọn khi tiện')}.
              Tiện đường thì bước ra phía đó rồi đi tiếp; không tiện thì đi đường an toàn nhất và bỏ
              qua, {strong('không cần quay lại, không cần hoá giải')}. Thứ tự ưu tiên đúng là: an toàn
              và chuẩn bị trước, hướng sau.
            </>
          ),
        },
      ]}
      root={
        <>
          Hướng xuất hành là một cách đẹp để mở đầu một ngày quan trọng: rõ ràng, minh bạch, cùng
          ngày thì cả nhà chung một hướng nên không ai phải “xem riêng”. Nhưng nó là quy ước phong
          tục, không phải quy luật tự nhiên — nên đừng bao giờ để nó đứng trên sự an toàn của chuyến
          đi. {strong('Tham khảo, không phán định.')}
        </>
      }
    />
  );
}
