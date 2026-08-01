/**
 * Nội dung "học chủ động" cho trang /learn/lich-am-duong.
 *
 * GROUNDING — mọi quy tắc lịch pháp nói ở đây đều là quy tắc mà code thật của
 * repo đang chạy, không thêm quy tắc nào khác:
 *   • src/lib/ngay-kieng-ky.ts (thuật toán Hồ Ngọc Đức): TIMEZONE = 7 (ICT);
 *     hằng số tuần trăng 29.530588853 ngày; getSunLongitude() chia hoàng đạo
 *     thành 12 cung 30° (= 12 Trung khí); getLunarMonth11() lấy tháng chứa Đông
 *     chí làm tháng 11 âm; getLeapMonthOffset() chọn tháng nhuận là tháng đầu
 *     tiên KHÔNG có Trung khí; điều kiện có nhuận là hai tháng 11 âm liên tiếp
 *     cách nhau > 365 ngày.
 *   • src/lib/gio-hoang-dao.ts: can chi NGÀY suy thẳng từ số ngày Julian —
 *     chi = (JDN + 1) % 12, can = (JDN + 9) % 10.
 *   • src/app/lich-van-nien/page.tsx: lịch VN tính theo giờ ICT (UTC+7), 105°Đ.
 * Ví dụ năm/ngày cụ thể được TÍNH bằng chính thuật toán trên (+7, và +8 khi đối
 * chiếu lịch Trung Quốc). Lớp "ngày tốt xấu" thuộc /learn/trach-cat, không nói ở đây.
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

export function LichAmDuongFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Người Việt sống cùng lúc với {strong('hai cuốn lịch')}: lịch dương để đi làm, đi học; lịch âm
          để giỗ chạp, rằm, mùng một, Tết. Rất nhiều người dùng cả đời mà chưa từng biết cuốn lịch âm
          ấy được tính ra sao — nên mỗi lần thấy “năm nay nhuận hai tháng 6” hay “Tết năm nay muộn” là
          lại thấy khó hiểu.
        </>
      }
      why={
        <>
          Lịch tồn tại vì con người cần {strong('đo thời gian bằng những thứ lặp lại đều đặn trên trời')}:
          Mặt Trăng tròn – khuyết và Mặt Trời đi hết một vòng mùa. Hai chu kỳ này{' '}
          {strong('không chia hết cho nhau')}, nên mọi nền văn minh đều phải nghĩ ra một cách vá — và âm
          dương lịch là cách vá của phương Đông.
        </>
      }
      what={
        <>
          Lịch Việt Nam là {strong('âm dương lịch')}: THÁNG bám theo Mặt Trăng (mỗi tháng bắt đầu đúng
          ngày sóc — ngày không trăng), NĂM bám theo Mặt Trời (giữ đúng mùa). Nó{' '}
          {strong('không phải')} lịch âm thuần tuý, và {strong('không phải')} một hệ thống bói toán:
          bản thân cuốn lịch chỉ là thiên văn cộng số học.
        </>
      }
      how={
        <>
          12 tháng trăng chỉ dài {strong('≈ 354 ngày')}, ngắn hơn năm mặt trời{' '}
          {strong('≈ 11 ngày')}. Cứ khoảng 2–3 năm, phần thiếu dồn đủ một tháng thì lịch{' '}
          {strong('chèn thêm một tháng nhuận')} để kéo tháng âm về đúng mùa — trung bình{' '}
          {strong('19 năm có 7 tháng nhuận')}.
        </>
      }
      soWhat={
        <>
          Hiểu rồi thì mọi thứ hết bí ẩn: bạn tự giải thích được vì sao Tết nhảy tới nhảy lui trong
          khoảng cuối tháng 1 – giữa tháng 2 dương, vì sao có năm 13 tháng, và vì sao{' '}
          {strong('Tết Việt Nam đôi khi lệch Tết Trung Quốc')} — tất cả đều là hệ quả của phép tính, không
          phải chuyện huyền bí.
        </>
      }
    />
  );
}

export function LichAmDuongDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="lich-am-duong"
        concept="Vì sao Tết mỗi năm rơi vào một ngày dương lịch khác nhau"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có hai cách đếm thời gian. Một cách đếm theo {strong('Mặt Trăng')} tròn rồi khuyết, một
                cách đếm theo {strong('Mặt Trời')} đi hết một vòng bốn mùa. Hai cách đếm này không bằng
                nhau: đếm theo Mặt Trăng thì một năm bị {strong('ngắn hơn')} chừng 11 ngày. Vì thế Tết —
                vốn đếm theo Mặt Trăng — cứ lùi dần trên tờ lịch treo tường.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Một tuần trăng (từ ngày không trăng đến ngày không trăng kế tiếp) dài trung bình{' '}
                  {strong('29,53 ngày')}. Nhân 12 tháng ra {strong('354,37 ngày')}. Còn năm mặt trời dài{' '}
                  {strong('365,2422 ngày')}. Hiệu số: {strong('gần 11 ngày')}.
                </p>
                <p>
                  Nên nếu chỉ đếm 12 tháng trăng, năm sau Tết sẽ đến sớm hơn khoảng 11 ngày so với năm
                  trước. Tết 2024 rơi vào 10/02, Tết 2025 lùi về {strong('29/01')} — đúng 12 ngày sớm
                  hơn. Rồi khi có tháng nhuận, năm âm dài tới 13 tháng, Tết bật ngược lại: Tết 2026 nhảy
                  tới {strong('17/02')}.
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
                  Đây là bài toán {strong('hai chu kỳ không thông ước')}: tháng giao hội 29,530588853
                  ngày và năm chí tuyến 365,2422 ngày không có bội chung nhỏ. Lịch thuần âm (như lịch
                  Hồi giáo) chấp nhận trôi tự do, mỗi năm lùi 11 ngày nên tháng lễ chạy khắp bốn mùa.
                  Lịch thuần dương (Gregory) bỏ hẳn Mặt Trăng.
                </p>
                <p>
                  Âm dương lịch chọn giữ cả hai: mỗi tháng vẫn khớp tuyệt đối với pha Mặt Trăng, còn
                  sai lệch tích luỹ được xả định kỳ bằng một {strong('tháng nhuận')}. Hệ quả là ngày Tết
                  dao động trong biên độ khoảng một tháng dương lịch (cuối tháng 1 đến giữa tháng 2),
                  nhưng {strong('không bao giờ trôi khỏi mùa xuân')} — đó chính là điều lịch thuần âm
                  không làm được.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="lich-am-duong"
        concept="Tháng nhuận từ đâu ra — và ai quyết định nhuận tháng mấy"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi năm lịch âm bị {strong('thiếu mất 11 ngày')} so với các mùa. Ba năm dồn lại là thiếu
                hơn một tháng. Thay vì để mùa lệch đi, người ta {strong('thêm hẳn một tháng nữa')} vào
                năm đó — năm ấy có hai tháng trùng tên, ví dụ hai tháng 6. Giống như xếp hàng thiếu chỗ
                thì kê thêm một ghế.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mốc neo là {strong('Đông chí')}: tháng âm chứa ngày Đông chí luôn được gọi là{' '}
                  {strong('tháng 11')}. Đếm từ tháng 11 năm này tới tháng 11 năm sau, nếu vừa đủ 12 tháng
                  (khoảng 354 ngày) thì năm bình thường; nếu lọt vào 13 tháng (khoảng 384 ngày) thì năm
                  đó {strong('phải có một tháng nhuận')}.
                </p>
                <p>
                  Chọn tháng nào để nhuận? Đường đi biểu kiến của Mặt Trời được chia thành 12 mốc gọi là{' '}
                  {strong('Trung khí')} (Đông chí, Đại hàn, Vũ Thuỷ…), cách nhau đúng 30°. Bình thường
                  mỗi tháng âm “ôm” được một Trung khí. Trong năm 13 tháng, sẽ có một tháng{' '}
                  {strong('không ôm được Trung khí nào')} — tháng đó bị lấy làm tháng nhuận và mang tên
                  của tháng liền trước nó.
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
                  Trong code lịch của hieu.asia, quy tắc này hiện ra rất trần trụi. Hàm tính kinh độ Mặt
                  Trời trả về {strong('số cung 30° (0–11)')} mà Mặt Trời đang đứng — đó chính là 12 Trung
                  khí. Hàm dò tháng nhuận đi lần lượt qua các ngày sóc sau tháng 11 và tìm{' '}
                  {strong('hai ngày sóc liên tiếp rơi vào cùng một cung')}: tháng nằm giữa hai ngày sóc
                  ấy không chứa mốc Trung khí nào → đúng nó là tháng nhuận.
                </p>
                <p>
                  Điều kiện kích hoạt cũng là một phép so sánh duy nhất:{' '}
                  {strong('khoảng cách giữa hai tháng 11 âm liên tiếp > 365 ngày')}. Tính thử: năm 2024
                  cho ra 354 ngày (không nhuận), năm 2025 cho ra {strong('384 ngày')} (nhuận — và tháng
                  không có Trung khí năm đó là tháng nhuận 6). Không có chỗ nào cho ý kiến chủ quan:
                  cùng một múi giờ thì mọi người tính ra cùng một kết quả.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="lich-am-duong"
        concept="Vì sao Tết Việt Nam có năm lệch Tết Trung Quốc"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Việt Nam và Trung Quốc {strong('lệch nhau một tiếng đồng hồ')}. Nếu Mặt Trăng biến mất
                vào lúc gần nửa đêm, thì bên Việt Nam vẫn còn là hôm nay, còn bên Trung Quốc đã sang
                ngày mai. Thế là hai nước ghi mùng 1 vào {strong('hai ngày khác nhau')}, và Tết lệch
                nhau.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lịch Việt Nam tính theo giờ Việt Nam ({strong('UTC+7')}, kinh tuyến 105°Đ); lịch Trung
                  Quốc tính theo giờ Bắc Kinh ({strong('UTC+8')}). Thời điểm sóc là một{' '}
                  {strong('khoảnh khắc vật lý chung')} cho cả hành tinh, nhưng khi quy đổi ra “ngày nào”
                  thì hai múi giờ có thể cho hai đáp án.
                </p>
                <p>
                  Ví dụ rõ nhất là {strong('Tết 2007')}: Việt Nam ăn Tết ngày 17/02, Trung Quốc ngày
                  18/02 — vì thời điểm không trăng rơi vào khoảng sau 23 giờ đêm giờ Việt Nam, tức đã
                  qua 0 giờ ngày hôm sau ở Bắc Kinh.
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
                  Có {strong('hai cơ chế lệch')}, và chúng khác hẳn nhau về quy mô. Cơ chế thứ nhất là
                  lệch ngày sóc như 2007 hoặc 2030 (Việt Nam 02/02, Trung Quốc 03/02) — sai khác{' '}
                  {strong('đúng một ngày')}.
                </p>
                <p>
                  Cơ chế thứ hai nặng hơn nhiều: khi múi giờ làm {strong('lệch chỗ đặt tháng nhuận')},
                  toàn bộ số hiệu tháng sau đó bị dịch đi một bậc. Năm 1985 là ví dụ kinh điển: tính
                  theo +8 thì năm 1984 có nhuận tháng 10, còn tính theo +7 thì không — nên cùng một ngày
                  sóc 21/01/1985, Việt Nam gọi là mùng 1 tháng Giêng (Tết) còn Trung Quốc gọi là mùng 1
                  tháng Chạp. Tết Trung Quốc năm ấy lùi hẳn tới 20/02, {strong('lệch tròn một tháng')}.
                </p>
                <p>
                  Cả hai đều {strong('không phải lỗi')} của bên nào. Lịch là hàm số của thiên văn và múi
                  giờ; đổi múi giờ thì đổi kết quả, y như đồng hồ.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="lich-am-duong"
        concept="Can chi ngày: vì sao nó không reset theo tháng hay năm"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tên ngày kiểu “Giáp Tý, Ất Sửu…” giống một {strong('vòng xoay 60 ô')}: mỗi ngày nhích
                một ô, hết 60 ô thì quay lại ô đầu. Vòng này {strong('không bao giờ dừng')} — không dừng
                khi sang tháng mới, cũng không dừng khi sang năm mới.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  10 Thiên Can ghép với 12 Địa Chi cho {strong('60 tổ hợp')} (không phải 120, vì can và
                  chi luôn cùng chẵn hoặc cùng lẻ). Ngày hôm nay là Ất Hợi thì ngày mai chắc chắn là
                  Bính Tý, cứ thế trượt đều.
                </p>
                <p>
                  Kiểm chứng dễ nhất là bắc qua giao thừa dương lịch: 31/12/2025 là ngày{' '}
                  {strong('Giáp Tuất')}, 01/01/2026 là {strong('Ất Hợi')} — đúng ô kế tiếp, không hề bắt
                  đầu lại. Trong khi đó can chi của {strong('năm')} và {strong('tháng')} thì có mốc bắt
                  đầu hẳn hoi.
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
                  Trong code, can chi ngày không hề đọc tới tháng hay năm âm: nó lấy{' '}
                  {strong('số ngày Julian (JDN)')} — một số đếm ngày tăng đều 1 đơn vị mỗi ngày từ một
                  mốc rất xa trong quá khứ — rồi chia dư: chi = (JDN + 1) chia 12 lấy dư, can = (JDN + 9)
                  chia 10 lấy dư. Vì bội chung nhỏ nhất của 10 và 12 là 60, chuỗi tự lặp đúng{' '}
                  {strong('chu kỳ 60 ngày')}.
                </p>
                <p>
                  Thử lại: 17/02/2026 (mùng 1 Tết) là ngày {strong('Nhâm Tuất')}; cộng đúng 60 ngày ra
                  18/04/2026, lại là {strong('Nhâm Tuất')}. Ý nghĩa thực tế: can chi ngày là một{' '}
                  {strong('đồng hồ độc lập')} chạy song song với lịch, nên tháng nhuận không làm nó
                  ngắt quãng — thêm một tháng vào năm âm cũng không tạo ra ngày nào bị bỏ trống.
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
      'Vì sao lịch Việt Nam được gọi là “âm dương lịch” chứ không phải “lịch âm”?',
    answer: (
      <>
        Vì nó dùng {strong('cả hai')} thiên thể. Phần {strong('âm')}: mỗi tháng bắt đầu đúng ngày sóc
        nên tháng luôn khớp pha Mặt Trăng. Phần {strong('dương')}: nhờ cơ chế tháng nhuận (neo vào Đông
        chí và các Trung khí — tức vị trí Mặt Trời), năm âm luôn được kéo về đúng mùa. Lịch âm thuần
        tuý thì bỏ hẳn phần thứ hai, nên tháng của nó trôi khắp bốn mùa.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Vì sao 12 tháng âm ngắn hơn một năm dương khoảng 11 ngày?',
    choices: [
      {
        text: 'Vì tuần trăng dài 29,53 ngày, nhân 12 chỉ được ≈ 354 ngày, trong khi năm mặt trời dài ≈ 365,24 ngày',
        correct: true,
        note: 'Đúng — hiệu số ≈ 10,9 ngày, làm tròn quen miệng thành “11 ngày”.',
      },
      {
        text: 'Vì lịch âm cố tình bỏ bớt ngày để năm ngắn lại cho dễ nhớ',
        note: 'Không — không ai bỏ ngày; độ dài tháng do chính chu kỳ Mặt Trăng quyết định.',
      },
      {
        text: 'Vì mỗi tháng âm đều có đúng 29 ngày',
        note: 'Không — tháng âm có tháng 29 (thiếu) và tháng 30 (đủ), tuỳ khoảng cách hai ngày sóc.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Trong một năm âm có 13 tháng, tháng nào được chọn làm tháng nhuận?',
    choices: [
      {
        text: 'Tháng nào cũng được, do hội đồng lịch pháp chọn theo phong tục',
        note: 'Không — đây là phép tính thiên văn thuần tuý, không có chỗ cho lựa chọn chủ quan.',
      },
      {
        text: 'Luôn luôn là tháng 6, vì nằm giữa năm',
        note: 'Không — tháng nhuận rơi vào tháng nào là tuỳ năm: 2023 nhuận tháng 2, 2025 nhuận tháng 6, 2028 nhuận tháng 5.',
      },
      {
        text: 'Tháng đầu tiên (sau tháng 11) không chứa Trung khí nào — nó mang tên tháng liền trước',
        correct: true,
        note: 'Đúng — 12 Trung khí cách nhau 30° trên hoàng đạo; tháng “lọt khe” không ôm được mốc nào chính là tháng nhuận.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Chu kỳ Meton “19 năm 7 tháng nhuận” nghĩa là gì?',
    choices: [
      {
        text: '19 năm dương gần bằng đúng 235 tháng âm, mà 235 = 19 × 12 + 7 → phải chèn thêm 7 tháng',
        correct: true,
        note: 'Đúng — 19 năm dương ≈ 6939,60 ngày, 235 tuần trăng ≈ 6939,69 ngày, chỉ lệch chưa tới 0,1 ngày.',
      },
      {
        text: 'Cứ đúng 19 năm thì Tết lại rơi vào cùng một ngày dương lịch',
        note: 'Không hẳn — chu kỳ chỉ gần đúng, phần dư nhỏ vẫn tích luỹ nên ngày Tết không lặp lại chính xác mãi mãi.',
      },
      {
        text: 'Mỗi 19 năm thì có 7 năm không có Tết',
        note: 'Không — năm nào cũng có Tết; 7 ở đây là số tháng nhuận được chèn thêm trong 19 năm.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Nguyên nhân khiến Tết Việt Nam đôi khi lệch Tết Trung Quốc là gì?',
    choices: [
      {
        text: 'Vì hai nước dùng hai bộ quy tắc lịch pháp hoàn toàn khác nhau',
        note: 'Không — quy tắc gần như giống hệt; khác nhau là ở múi giờ dùng để quy đổi thời điểm thiên văn ra ngày.',
      },
      {
        text: 'Vì lịch Việt Nam tính theo giờ UTC+7 còn lịch Trung Quốc theo UTC+8, nên thời điểm sóc có thể rơi vào hai ngày khác nhau',
        correct: true,
        note: 'Đúng — như Tết 2007 (17/02 và 18/02). Nặng hơn, múi giờ còn có thể làm lệch chỗ đặt tháng nhuận (năm 1985 lệch tròn một tháng).',
      },
      {
        text: 'Vì Việt Nam làm tròn ngày Tết cho rơi vào cuối tuần',
        note: 'Không — ngày Tết là kết quả tính toán thiên văn, không được dịch chuyển cho tiện.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Can chi NGÀY (Giáp Tý, Ất Sửu…) vận hành thế nào?',
    choices: [
      {
        text: 'Bắt đầu lại từ Giáp Tý vào mùng 1 mỗi tháng âm',
        note: 'Không — nó không quan tâm tới ranh giới tháng. 31/12/2025 là Giáp Tuất, 01/01/2026 là Ất Hợi, liền mạch.',
      },
      {
        text: 'Bắt đầu lại từ Giáp Tý vào ngày mùng 1 Tết',
        note: 'Không — can chi NĂM mới có mốc đầu năm; can chi NGÀY thì chạy xuyên qua mọi mốc.',
      },
      {
        text: 'Chạy liên tục theo vòng 60, mỗi ngày nhích một bậc, suy thẳng từ số ngày Julian',
        correct: true,
        note: 'Đúng — 17/02/2026 là Nhâm Tuất; cộng đúng 60 ngày ra 18/04/2026 lại là Nhâm Tuất.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: một người nói “năm nay lịch có tháng nhuận nên chắc là năm xui, cần cẩn thận”. Bạn phản hồi thế nào?',
    answer: (
      <>
        Tháng nhuận không mang thông tin lành – dữ nào cả. Nó chỉ là{' '}
        {strong('thao tác kỹ thuật để bù 11 ngày chênh lệch')} giữa 12 tuần trăng và năm mặt trời, kích
        hoạt bởi một phép so sánh: hai tháng 11 âm liên tiếp cách nhau hơn 365 ngày. Trung bình 19 năm
        có 7 lần như vậy — tức gần một phần ba số năm, quá thường xuyên để có thể là điềm gì. Bản thân
        cuốn lịch là {strong('thiên văn và số học')}; những lớp “tốt – xấu” được gắn thêm lên trên là
        phong tục, thuộc một tầng khác và nên đọc như một tầng khác.
      </>
    ),
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Vì sao “mùng 1 âm lịch không nhìn thấy trăng, còn rằm thì trăng tròn” — điều này có phải trùng hợp không?',
    answer: (
      <>
        Không hề trùng hợp, đó là {strong('định nghĩa')} của lịch. Mùng 1 được đặt đúng vào{' '}
        {strong('ngày sóc')} — ngày chứa thời điểm Mặt Trăng đi qua giữa Trái Đất và Mặt Trời, nên mặt
        hướng về ta hoàn toàn tối. Nửa tuần trăng sau đó (khoảng 14–15 ngày) Mặt Trăng đi tới phía đối
        diện Mặt Trời, ta thấy trọn mặt sáng — rơi đúng khoảng ngày 15 âm. Đây là ưu điểm thực dụng của
        lịch âm: {strong('nhìn trăng là ước lượng được ngày')}, hữu ích với người đi biển hay ra đồng
        thời chưa có đồng hồ, lịch in.
      </>
    ),
  },
];

export function LichAmDuongRecall() {
  return <ActiveRecall topicId="lich-am-duong" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được bài toán gốc mà mọi cuốn lịch phải giải: chu kỳ Mặt Trăng và chu kỳ Mặt Trời không chia hết cho nhau.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Giải thích được vì sao 12 tháng âm ngắn hơn năm dương khoảng 11 ngày, bằng hai con số 29,53 và 365,24.',
  },
  {
    id: 'leap',
    facet: 'Tháng nhuận',
    can: 'Mô tả được cách xác định tháng nhuận: neo tháng 11 vào Đông chí, và tháng nhuận là tháng đầu tiên không có Trung khí.',
  },
  {
    id: 'cycle',
    facet: 'Chu kỳ',
    can: 'Nói được vì sao trung bình 19 năm có 7 tháng nhuận (235 tháng âm ≈ 19 năm dương), và nêu được vài năm nhuận cụ thể.',
  },
  {
    id: 'timezone',
    facet: 'Múi giờ',
    can: 'Giải thích được vì sao lịch Việt Nam (+7) và lịch Trung Quốc (+8) có năm cho ra ngày Tết khác nhau — cả kiểu lệch 1 ngày lẫn kiểu lệch 1 tháng.',
  },
  {
    id: 'canchi',
    facet: 'Can chi ngày',
    can: 'Nói được can chi NGÀY chạy liên tục theo vòng 60, không reset theo tháng hay năm — và phân biệt nó với can chi năm.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Tách được hai lớp: bản thân cuốn lịch là thiên văn – toán học, còn “ngày tốt ngày xấu” gắn lên lịch là phong tục.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Chỉ ra được vì sao “năm nhuận” không phải điềm gì, và vì sao lịch không thể chép thuộc lòng mà phải tính bằng thiên văn.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng cho người thân trong 2 phút vì sao Tết mỗi năm một ngày khác, mà không cần dùng công thức nào.',
  },
];

export function LichAmDuongChecklist() {
  return <UnderstandingChecklist topicId="lich-am-duong" facets={FACETS} />;
}

export function LichAmDuongWhys() {
  return (
    <FiveWhys
      topicId="lich-am-duong"
      start={
        <>
          Mở tờ lịch năm 2025 ra, nhiều người ngạc nhiên: năm này có tới{' '}
          <em>hai tháng 6 âm lịch</em>. Có người bảo “năm nhuận là năm đặc biệt, phải kiêng cữ”.
        </>
      }
      chain={[
        {
          question: 'Vì sao năm 2025 lại có hai tháng 6?',
          because: (
            <>
              Vì năm âm đó dài {strong('13 tháng')} chứ không phải 12 — lịch phải chèn thêm một tháng
              và đặt cho nó tên trùng với tháng liền trước.
            </>
          ),
        },
        {
          question: 'Vì sao lại phải chèn thêm một tháng?',
          because: (
            <>
              Vì 12 tháng trăng chỉ dài khoảng {strong('354 ngày')}, thiếu gần 11 ngày so với năm mặt
              trời. Cứ 2–3 năm, chỗ thiếu dồn đủ một tháng thì phải trả lại một lần.
            </>
          ),
        },
        {
          question: 'Vì sao nhất định phải trả lại — cứ để lệch có được không?',
          because: (
            <>
              Được, nhưng khi đó tháng âm sẽ {strong('trôi khỏi mùa')}: chỉ sau vài chục năm, Tết sẽ rơi
              vào giữa hè. Người xưa sống bằng nông nghiệp nên cuốn lịch bắt buộc phải bám mùa vụ.
            </>
          ),
        },
        {
          question: 'Vì sao lại chọn đúng tháng ấy để nhuận, không phải tháng khác?',
          because: (
            <>
              Vì có một tiêu chí máy móc: tháng nhuận là tháng đầu tiên (sau tháng 11 chứa Đông chí){' '}
              {strong('không chứa Trung khí nào')}. Đây là phép đo vị trí Mặt Trời, không phải lựa chọn
              của ai.
            </>
          ),
        },
        {
          question: 'Vậy điều đó nói gì về chuyện “năm nhuận là năm đặc biệt”?',
          because: (
            <>
              Nó nói rằng tháng nhuận thuần tuý là {strong('một thao tác sửa sai số')}. Trung bình 19
              năm có 7 lần — gần một phần ba số năm. Một việc lặp lại thường xuyên như thế thì không thể
              mang ý nghĩa lành dữ gì.
            </>
          ),
        },
      ]}
      root={
        <>
          Cuốn lịch âm dương là một công trình {strong('thiên văn và số học')}, được thiết kế để giải
          một bài toán rất cụ thể: giữ tháng khớp Mặt Trăng mà năm vẫn khớp Mặt Trời. Hiểu như vậy rồi
          thì “năm nhuận”, “Tết sớm – Tết muộn”, “Tết lệch nước bạn” đều trở thành hệ quả tính toán bình
          thường. Còn những lớp ý nghĩa {strong('tốt – xấu')} mà phong tục gắn lên từng ngày là chuyện
          của một tầng khác — đừng gộp hai tầng ấy làm một.
        </>
      }
    />
  );
}
