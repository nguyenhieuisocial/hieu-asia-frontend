/**
 * Nội dung "học chủ động" cho trang /learn/ngay-kieng-ky.
 *
 * GROUNDING — mọi dữ kiện lấy từ:
 *   • src/lib/ngay-kieng-ky.ts  (TAM_NUONG_DAYS = 3,7,13,18,22,27 · NGUYET_KY_DAYS
 *     = 5,14,23 · DUONG_CONG_BY_MONTH 1→13 2→11 3→9 4→7 5→5 6→3 7→8&29 8→27 9→25
 *     10→23 11→21 12→19 · Nguyệt Tận = ngày cuối tháng âm · KIENG_KY_INFO: điển
 *     tích Muội Hỷ – Đát Kỷ – Bao Tự, câu ca dao "Mùng năm, mười bốn, hai ba…",
 *     tên Dương Quân Tùng)
 *   • trang công cụ src/app/ngay-kieng-ky/page.tsx (FAQ + khung "một lời nhắn")
 *
 * Các con số ĐẾM (10–12 ngày kiêng mỗi tháng âm, 126–127 ngày mỗi năm 12 tháng)
 * là phép hợp tập hợp trên chính bốn danh sách trên — suy ra, không thêm nguồn mới.
 *
 * Phân vai: bài này chỉ nói mặt KIÊNG. Chọn ngày tốt / 12 Trực / hoàng đạo thuộc
 * /learn/trach-cat; giờ tốt thuộc /gio-hoang-dao; Tam Tai – Kim Lâu có trang riêng.
 *
 * Giọng: tôn trọng phong tục, không hù doạ — giúp người đọc bớt sợ, không sợ thêm.
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

export function KiengKyFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Sắp cưới hỏi, khai trương hay đi xa, ai đó nhắc {strong('“hôm ấy là ngày kiêng đấy”')} —
          và bạn không biết ngày đó là ngày nào, vì sao bị kiêng, có thật sự phải tránh không.
        </>
      }
      why={
        <>
          Người xưa đặt ra vài bộ ngày cố định trên lịch âm để nhắc nhau{' '}
          {strong('thận trọng khi khởi sự việc lớn')}. Đó là một nét văn hoá truyền miệng — cách
          gói lời dặn “đừng vội” vào một con số dễ nhớ.
        </>
      }
      what={
        <>
          Bốn bộ ngày kiêng phổ biến: {strong('Tam Nương')} (mùng 3, 7, 13, 18, 22, 27),{' '}
          {strong('Nguyệt Kỵ')} (mùng 5, 14, 23), {strong('Dương Công Kỵ Nhật')} (13 ngày cố định
          trong năm) và {strong('Nguyệt Tận')} (ngày cuối tháng âm). {strong('Không phải')} lời
          phán rằng ngày đó sẽ có chuyện xấu.
        </>
      }
      how={
        <>
          Tất cả tính theo {strong('ngày âm lịch')}, không phải ngày dương. Đổi ngày dương sang
          ngày âm, rồi đối chiếu xem con số ấy có nằm trong bốn danh sách trên không. Công cụ tự
          đổi lịch và tra giúp bạn.
        </>
      }
      soWhat={
        <>
          Để biết {strong('nên cân nhắc gì')} khi hẹn ngày việc trọng — và biết luôn một điều ít ai
          nói: cộng cả bốn bộ lại thì mỗi tháng âm đã có {strong('10–12 ngày')} bị kiêng. Kiêng hết
          thì không còn ngày để sống.
        </>
      }
    />
  );
}

export function KiengKyDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="ngay-kieng-ky"
        concept="Ngày kiêng kỵ là quy ước trên lịch, không phải điều quan sát được"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ngày kiêng giống như {strong('lời dặn của ông bà')} được ghi sẵn vào lịch: “ngày này
                thì khoan hãy làm việc lớn nhé”. Nó được ghi từ trước, chứ không phải ai đó nhìn
                thấy điều gì xấu xảy ra trong ngày hôm ấy rồi mới ghi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cả bốn bộ ngày kiêng đều là {strong('con số cố định trên lịch âm')}: Tam Nương
                  luôn là mùng 3, 7, 13, 18, 22, 27; Nguyệt Kỵ luôn là mùng 5, 14, 23; Dương Công
                  mỗi tháng âm một ngày; Nguyệt Tận luôn là ngày cuối tháng.
                </p>
                <p>
                  Nghĩa là danh sách này {strong('lặp lại y hệt')} tháng này qua tháng khác, năm này
                  qua năm khác, với mọi người, ở mọi nơi. Nó không đổi theo tuổi bạn, việc bạn làm
                  hay chuyện đang xảy ra ngoài đời.
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
                  Đây là điểm phân biệt quan trọng: ngày kiêng là {strong('quy ước lịch pháp')} —
                  một tập hợp đóng, biết trước, kiểm tra được bằng phép đối chiếu số. Nó không phải
                  kết quả của việc theo dõi rồi thống kê chuyện thực tế xảy ra vào từng ngày.
                </p>
                <p>
                  Hệ quả thực hành: bạn có thể {strong('tra chính xác')} một ngày có bị kiêng hay
                  không (đổi lịch dương sang âm rồi so danh sách), nhưng không thể kiểm chứng việc
                  kiêng có “hiệu quả” hay không. Hai câu hỏi khác nhau, và chỉ câu đầu có đáp án.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="ngay-kieng-ky"
        concept="Vì sao ngày kiêng luôn tính theo ngày âm, không theo ngày dương"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ngày kiêng đếm theo {strong('mặt trăng')}: mùng 1 là hôm trăng bắt đầu mọc lại, rằm
                là hôm trăng tròn. Tờ lịch treo tường của mình thì đếm theo mặt trời. Hai cách đếm
                khác nhau, nên phải đổi qua lại mới biết hôm nay là mùng mấy âm.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mọi bộ ngày kiêng đều được truyền lại bằng {strong('số ngày âm')} — “mùng 5, mười
                  bốn, hai ba”, chứ không ai nói “ngày 5 tháng 7 dương lịch”. Vì tháng âm chỉ dài 29
                  hoặc 30 ngày còn tháng dương 28–31 ngày, hai lịch trượt khỏi nhau liên tục.
                </p>
                <p>
                  Nên cùng một ngày dương lịch, năm nay là ngày kiêng thì sang năm{' '}
                  {strong('gần như chắc chắn không còn')}. Đó là lý do phải đổi lịch trước khi tra,
                  và cũng là chỗ nhầm phổ biến nhất khi tự đếm.
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
                  Lịch âm Việt Nam là {strong('âm – dương lịch')}: ngày trong tháng bám chu kỳ tuần
                  trăng, còn tháng nhuận được chèn thêm để năm âm không trôi khỏi mùa. Vì vậy phép
                  đổi dương sang âm không phải một phép trừ đơn giản mà cần tính điểm sóc (đầu tuần
                  trăng) theo múi giờ — công cụ dùng múi giờ +7 cho Việt Nam.
                </p>
                <p>
                  Một chi tiết đáng lưu ý: {strong('cùng một ngày dương lịch')} có thể ra ngày âm
                  khác nhau ở hai múi giờ khác nhau, nên lịch âm Việt Nam và lịch âm Trung Quốc đôi
                  khi lệch nhau một ngày. Ngày kiêng theo đó cũng lệch — thêm một dấu hiệu cho thấy
                  đây là quy ước, không phải hiện tượng.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="ngay-kieng-ky"
        concept="Thận trọng và sợ hãi khác nhau ở đâu"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                {strong('Thận trọng')} là “mình soạn đồ kỹ hơn một chút cho chắc”.{' '}
                {strong('Sợ hãi')} là “thôi không đi nữa”. Ngày kiêng là lời dặn soạn đồ kỹ hơn,
                không phải lời bảo đừng đi.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Thận trọng thì {strong('làm thêm việc có ích')}: kiểm lại giấy tờ, xác nhận lại
                  giờ hẹn, hỏi lại người nhà. Sợ hãi thì chỉ {strong('bỏ đi cơ hội')} rồi tự trấn an
                  bằng cách nghĩ mình đã tránh được điều gì đó.
                </p>
                <p>
                  Phong tục ngày kiêng vốn được truyền lại để nhắc điều thứ nhất. Nếu nó khiến bạn
                  làm điều thứ hai, thì lời nhắc đã bị dùng sai chỗ.
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
                  Có một cách tự kiểm rất gọn: hỏi xem việc kiêng ngày{' '}
                  {strong('có làm bạn chuẩn bị tốt hơn không')}. Nếu dời lịch để họ hàng đông đủ,
                  người lớn an tâm, mọi người đỡ áy náy — đó là giá trị thật, và nó nằm ở{' '}
                  {strong('sự đồng thuận')} chứ không nằm ở con số ngày.
                </p>
                <p>
                  Nhưng nếu việc kiêng khiến bạn trì hoãn vô hạn, trả thêm tiền để “hoá giải”, hay
                  quy mọi chuyện trục trặc về ngày đã chọn, thì cái giá đã vượt xa lợi ích.
                  hieu.asia trình bày để bạn tra cứu và tự quyết —{' '}
                  {strong('không phán số mệnh, không bán lễ')}.
                </p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

/** Khối 3 độ sâu nhúng riêng trong mục Nguyệt Kỵ — vì sao lại đúng 5, 14, 23. */
export function KiengKyDepthNguyetKy() {
  return (
    <DepthTabs
      topicId="ngay-kieng-ky"
      concept="Vì sao lại đúng mùng 5, 14 và 23 — không phải ba con số ngẫu nhiên"
      levels={[
        {
          id: 'eli5',
          label: 'Trẻ 5 tuổi',
          content: (
            <p>
              Thử cộng các chữ số xem: 5 là 5. Ngày 14 thì 1 + 4 = 5. Ngày 23 thì 2 + 3 = 5. Ba ngày
              này đều {strong('ra số 5')}. Người xưa thấy trùng nhau như vậy nên gom lại thành một
              nhóm cho dễ nhớ.
            </p>
          ),
        },
        {
          id: 'eli14',
          label: 'Người 14 tuổi',
          content: (
            <>
              <p>
                Ba ngày cách nhau {strong('đúng 9 ngày')}: 5 → 14 → 23. Cộng thêm 9 thì tổng các chữ
                số không đổi (14 lên 23 là chữ số hàng chục tăng 1, hàng đơn vị giảm 1). Vì thế cả
                ba ngày đều có tổng chữ số bằng 5.
              </p>
              <p>
                Ngày thứ tư của dãy sẽ là 32 — {strong('vượt quá tháng âm')} vốn chỉ có 29 hoặc 30
                ngày. Nên mỗi tháng chỉ có đúng ba ngày Nguyệt Kỵ, không nhiều hơn.
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
                Nói gọn: Nguyệt Kỵ là tập các ngày {strong('d ≡ 5 (mod 9)')} nằm trong một tháng âm.
                Tổng chữ số bất biến khi cộng 9 chính là quy tắc chia hết cho 9 quen thuộc — nên dãy
                5, 14, 23 tự nhiên rơi ra, và dừng lại ở 23 vì tháng âm không có ngày 32.
              </p>
              <p>
                Còn vì sao lại chọn số 5? Cách giải thích thường được truyền lại là số 5 đứng{' '}
                {strong('giữa chừng')} trong mười số đầu — “nửa đời nửa đoạn”, chưa trọn vẹn để khởi
                sự. Đây là lời giải thích của phong tục,{' '}
                {strong('không phải một luận cứ kiểm chứng được')}: cấu trúc số thì rõ ràng, còn ý
                nghĩa gán cho số 5 là quy ước văn hoá.
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
    type: 'mcq',
    prompt: 'Ngày Tam Nương là những ngày âm lịch nào?',
    choices: [
      {
        text: 'Mùng 3, 7, 13, 18, 22, 27',
        correct: true,
        note: 'Đúng — sáu ngày cố định, lặp lại y hệt trong mọi tháng âm.',
      },
      { text: 'Mùng 5, 14, 23', note: 'Đó là Nguyệt Kỵ, một bộ ngày kiêng khác.' },
      {
        text: 'Ngày cuối cùng của tháng âm',
        note: 'Đó là Nguyệt Tận — “trăng đã hết”, ngày 30 hoặc 29 âm.',
      },
    ],
  },
  {
    id: 'q2',
    type: 'open',
    prompt: 'Vì sao Nguyệt Kỵ lại rơi đúng vào mùng 5, 14 và 23?',
    answer: (
      <>
        Vì cộng các chữ số của cả ba ngày đều ra {strong('5')} (5; 1 + 4; 2 + 3). Ba ngày cách nhau
        đúng 9, mà cộng thêm 9 thì tổng chữ số không đổi — nên dãy là 5, 14, 23. Ngày kế tiếp sẽ là
        32, {strong('vượt quá tháng âm')} (29 hoặc 30 ngày), nên mỗi tháng chỉ có đúng ba ngày.
      </>
    ),
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Dương Công Kỵ Nhật có bao nhiêu ngày trong một năm âm lịch 12 tháng?',
    choices: [
      { text: '6 ngày', note: 'Không — 6 là số ngày Tam Nương trong MỘT tháng.' },
      {
        text: '13 ngày',
        correct: true,
        note: 'Đúng — mỗi tháng âm một ngày, riêng tháng 7 có hai ngày (mùng 8 và 29).',
      },
      { text: '36 ngày', note: 'Không — Dương Công mỗi tháng chỉ một ngày, trừ tháng 7.' },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt:
      'Cộng cả bốn bộ ngày kiêng lại, một tháng âm có khoảng bao nhiêu ngày bị kiêng — và điều đó nói lên gì?',
    answer: (
      <>
        Khoảng {strong('10 đến 12 ngày')} tuỳ tháng (Tam Nương 6 + Nguyệt Kỵ 3 + Nguyệt Tận 1 +
        Dương Công 0–2 ngày mới, vì Dương Công nhiều tháng trùng sẵn với hai bộ kia). Trên một tháng
        âm 29–30 ngày, đó là {strong('hơn một phần ba')}. Nghĩa là kiêng hết mọi ngày trong danh
        sách thì gần như không còn ngày nào để khởi sự — nên phong tục vốn chỉ dành cho{' '}
        {strong('việc trọng đại')}, không phải cho sinh hoạt thường ngày.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Ngày kiêng kỵ được tính theo lịch nào?',
    choices: [
      {
        text: 'Lịch âm — phải đổi ngày dương sang ngày âm rồi mới tra',
        correct: true,
        note: 'Đúng — mọi bộ ngày kiêng đều truyền lại bằng số ngày âm.',
      },
      {
        text: 'Lịch dương, nên ngày kiêng năm nào cũng rơi vào cùng một ngày dương lịch',
        note: 'Không — hai lịch trượt khỏi nhau, nên ngày dương tương ứng đổi mỗi năm.',
      },
      {
        text: 'Tuỳ tuổi từng người, mỗi người một danh sách riêng',
        note: 'Không — danh sách là cố định và giống nhau với mọi người. Hạn theo tuổi là hệ khác.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Nếu việc quan trọng buộc phải rơi vào một ngày kiêng thì nên hiểu thế nào?',
    choices: [
      {
        text: 'Chắc chắn sẽ hỏng việc, nên huỷ bằng mọi giá',
        note: 'Không — phong tục là lời nhắc thận trọng, không phải phán quyết.',
      },
      {
        text: 'Đây là quy ước nhắc thận trọng; chuẩn bị chu đáo mới là điều quyết định',
        correct: true,
        note: 'Đúng — giá trị thật nằm ở sự cẩn thận và đồng thuận, không nằm ở con số ngày.',
      },
      {
        text: 'Phải làm lễ hoá giải rồi mới được tiến hành',
        note: 'Không — hieu.asia không bán lễ và không cho rằng phải “giải” gì mới yên.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: bạn của bạn nói “tháng nào cũng có ngày kiêng nên tôi chỉ làm việc lớn vào ngày sạch”. Bạn sẽ chỉ ra điều gì?',
    answer: (
      <>
        Rằng bốn bộ ngày kiêng đã chiếm {strong('10–12 ngày mỗi tháng âm')}, tức hơn một phần ba.
        Nếu cộng thêm các hệ kiêng khác nữa thì số ngày “sạch” còn rất ít, và việc chọn ngày biến
        thành nguồn lo mới. Cách dùng lành mạnh là{' '}
        {strong('chọn một bộ quy ước và bám theo nó')}, chỉ áp cho việc thật sự trọng đại — thay vì
        cộng dồn mọi danh sách kiêng rồi tự dồn mình vào chân tường.
      </>
    ),
  },
];

export function KiengKyRecall() {
  return <ActiveRecall topicId="ngay-kieng-ky" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được ngày kiêng kỵ dùng để làm gì (lời nhắc thận trọng khi khởi sự việc trọng đại) — và nó KHÔNG hứa gì (không báo trước chuyện xấu sẽ xảy ra).',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể đúng bốn bộ ngày kiêng và ngày của từng bộ: Tam Nương (3, 7, 13, 18, 22, 27), Nguyệt Kỵ (5, 14, 23), Dương Công Kỵ Nhật (13 ngày trong năm), Nguyệt Tận (ngày cuối tháng âm).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Giải thích được vì sao Nguyệt Kỵ đúng là 5, 14, 23 (ba ngày cách nhau 9, tổng chữ số đều bằng 5) và vì sao không có ngày thứ tư.',
  },
  {
    id: 'calendar',
    facet: 'Lịch',
    can: 'Nói được vì sao phải đổi ngày dương sang ngày âm trước khi tra, và vì sao ngày dương tương ứng đổi theo từng năm.',
  },
  {
    id: 'arithmetic',
    facet: 'Đếm lại',
    can: 'Ước lượng được tổng số ngày kiêng trong một tháng âm (10–12 ngày, hơn một phần ba) và nêu vì sao Dương Công nhiều tháng không làm tăng con số đó.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Phân biệt ngày kiêng (cố định theo ngày âm, giống nhau với mọi người) với các hạn tính theo tuổi như Tam Tai, Kim Lâu, và với việc chọn ngày tốt bên trạch cát.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra được đây là phong tục truyền miệng, không có cơ sở kiểm chứng — tra được một ngày có bị kiêng hay không, nhưng không kiểm chứng được việc kiêng có tác dụng gì.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao rơi vào ngày kiêng không đồng nghĩa với xui rủi, và vì sao không cần tốn tiền “hoá giải”.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho người thân “ngày kiêng là gì, nên dùng tới đâu” bằng lời của bạn, giữ giọng tôn trọng phong tục mà không gieo lo sợ.',
  },
];

export function KiengKyChecklist() {
  return <UnderstandingChecklist topicId="ngay-kieng-ky" facets={FACETS} />;
}

export function KiengKyWhys() {
  return (
    <FiveWhys
      topicId="ngay-kieng-ky"
      start={
        <>
          Một người xem lịch thấy hôm nay là mùng 5 âm — ngày Nguyệt Kỵ. Cuộc hẹn ký hợp đồng đã
          chốt từ lâu, nhưng họ huỷ, dời sang tuần sau, và cả ngày vẫn thấy bất an.
        </>
      }
      chain={[
        {
          question: 'Vì sao huỷ hẳn việc chỉ vì hôm nay là mùng 5 lại là phản ứng chưa cân?',
          because: (
            <>
              Vì nếu kiêng đủ mọi ngày trong danh sách thì mỗi tháng âm mất{' '}
              {strong('10 đến 12 ngày')} — hơn một phần ba tháng. Không ai sống được như vậy.
            </>
          ),
        },
        {
          question: 'Vì sao lại nhiều tới mức đó?',
          because: (
            <>
              Vì bốn bộ ngày kiêng {strong('chồng lên nhau')}: Tam Nương 6 ngày, Nguyệt Kỵ 3 ngày,
              Nguyệt Tận 1 ngày, cộng thêm Dương Công Kỵ Nhật — và chúng phần lớn không trùng nhau.
            </>
          ),
        },
        {
          question: 'Vì sao bốn bộ ấy tồn tại song song mà không ai gộp lại thành một?',
          because: (
            <>
              Vì mỗi bộ ra đời từ một nguồn riêng: Tam Nương từ {strong('điển tích')} ba người phụ
              nữ trong sử Trung Hoa, Nguyệt Kỵ từ câu ca dao và phép cộng chữ số ra 5, Dương Công từ{' '}
              {strong('lịch pháp cổ')}, Nguyệt Tận từ hình ảnh trăng đã hết.
            </>
          ),
        },
        {
          question: 'Vì sao những nguồn ấy đều là quy ước chứ không phải quan sát?',
          because: (
            <>
              Vì cả bốn đều là {strong('ngày cố định trên lịch âm')}, lặp lại y hệt mỗi tháng, mỗi
              năm, với mọi người. Không bộ nào hình thành từ việc theo dõi rồi ghi lại chuyện thật
              sự xảy ra vào những ngày đó.
            </>
          ),
        },
        {
          question: 'Vì sao điều đó đổi cách ta nên dùng danh sách ngày kiêng?',
          because: (
            <>
              Vì cái còn lại có giá trị là {strong('lời nhắc thận trọng')} cho việc trọng đại và sự
              đồng thuận với người thân — chứ không phải bản thân con số ngày. Dùng đúng phần đó thì
              phong tục giúp ta chỉn chu; dùng sai thì nó chỉ sinh thêm nỗi lo.
            </>
          ),
        },
      ]}
      root={
        <>
          Ngày kiêng kỵ là cách ông bà gói lời dặn “việc lớn thì đừng vội” vào những con số dễ nhớ.
          Biết ngày nào bị kiêng là điều tra cứu được; tin rằng ngày đó sẽ mang lại điều xấu thì
          không. Giữ lại phần thận trọng, bỏ đi phần sợ hãi —{' '}
          {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
