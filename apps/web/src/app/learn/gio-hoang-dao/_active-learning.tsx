/**
 * Nội dung "học chủ động" cho trang /learn/gio-hoang-dao.
 *
 * GROUNDING (không có dữ kiện nào nằm ngoài các nguồn này):
 *   • lib/gio-hoang-dao.ts — BRANCHES, HOUR_RANGE, vòng 12 sao STARS (6 good /
 *     6 !good), THANH_LONG_OFFSET (mốc khởi Thanh Long theo CHI NGÀY), công thức
 *     xếp sao `STARS[((h - offset) % 12 + 12) % 12]`, Ngũ Thử Độn cho can giờ
 *     (`hourStemBase = (stemIndex % 5) * 2`), currentHourIndex / nextGoodHour.
 *   • lib/gio-hoang-dao-stars.ts — SAO_GIO (overview / favors / cautions).
 *   • app/gio-hoang-dao/ (trang công cụ + /y-nghia) — cách trình bày và định vị.
 *
 * PHÂN VAI: bài này chỉ sở hữu phần chọn GIỜ. Phần chọn NGÀY thuộc
 * /learn/trach-cat — ở đây chỉ nhắc và trỏ link, KHÔNG giảng lại.
 *
 * Giữ giọng "tra cứu phong tục để tham khảo — không phán số mệnh".
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

export function GioHoangDaoFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn đã có ngày để làm một việc quan trọng — ký kết, xuất hành, mở hàng — và muốn biết{' '}
          {strong('trong ngày đó nên bắt đầu vào lúc mấy giờ')} theo phong tục, thay vì chọn đại rồi
          băn khoăn.
        </>
      }
      why={
        <>
          Người xưa chia một ngày thành {strong('12 canh giờ')} và cho rằng mỗi canh do một trong 12
          sao “trực giờ” cai quản — 6 sao lành làm nên {strong('giờ hoàng đạo')}, 6 sao dữ làm nên{' '}
          {strong('giờ hắc đạo')}. Đây là một lớp trong lịch pháp truyền thống, tồn tại như một nét
          văn hoá chứ không phải quy luật tự nhiên.
        </>
      }
      what={
        <>
          Mỗi ngày có {strong('đúng 6 giờ hoàng đạo và 6 giờ hắc đạo')} — con số luôn cân, không ngày
          nào toàn giờ xấu. 6 sao hoàng đạo: Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức (còn gọi Bảo
          Quang), Ngọc Đường, Tư Mệnh. {strong('Không phải')} lời hứa thành công, cũng không có “giờ
          chết”.
        </>
      }
      how={
        <>
          Từ {strong('chi của NGÀY')} suy ra canh giờ khởi sao Thanh Long, rồi xếp vòng 12 sao cố
          định lên 12 canh giờ theo thứ tự. Vì mốc khởi đổi theo ngày nên{' '}
          {strong('cùng một giờ Tý, ngày này là giờ tốt, ngày kia lại là giờ xấu')}. Công cụ tự tính
          khi bạn nhập ngày.
        </>
      }
      soWhat={
        <>
          Để chọn được một khung giờ {strong('thuận tiện mà vẫn hợp phong tục')} cho việc chính (giờ
          xuất hành, giờ ký kết) — và để không hoảng khi việc gấp rơi vào giờ hắc đạo: trong cùng
          ngày luôn còn 5 giờ tốt khác để dời sang.
        </>
      }
    />
  );
}

export function GioHoangDaoDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="gio-hoang-dao"
        concept="Vì sao một “giờ” của người xưa dài bằng hai giờ đồng hồ"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ngày nay ta chia một ngày thành 24 phần, mỗi phần gọi là một tiếng. Ngày xưa ông bà
                chia một ngày thành {strong('12 phần')} thôi, nên mỗi phần dài{' '}
                {strong('gấp đôi')} — bằng hai tiếng đồng hồ bây giờ. Mỗi phần được đặt một cái tên
                như giờ Tý, giờ Sửu, giờ Dần…
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Một ngày có 24 giờ đồng hồ, chia cho 12 canh giờ thì mỗi canh đúng{' '}
                  {strong('2 tiếng')}. 12 canh giờ mang tên 12 địa chi theo đúng thứ tự: Tý, Sửu,
                  Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi.
                </p>
                <p>
                  Vì sao lại là 12? Vì hệ can–chi của lịch âm vốn dùng {strong('12 địa chi')} để đánh
                  số mọi thứ — năm, tháng, ngày và cả giờ. Dùng chung một bộ tên giúp lịch pháp ghép
                  các lớp lại với nhau bằng cùng một ngôn ngữ.
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
                  Hệ quả thực hành của việc “một giờ âm = hai giờ đồng hồ”: khi ai đó nói “giờ Ngọ”,
                  họ nói tới cả khung {strong('11h–13h')}, không phải riêng 12h. Bạn có{' '}
                  {strong('trọn hai tiếng')} để đặt việc chính vào đó — không cần canh đúng phút.
                </p>
                <p>
                  Giờ cũng có {strong('can')} chứ không chỉ chi. Can của giờ suy từ can của ngày theo
                  phép Ngũ Thử Độn, nên công cụ hiển thị đầy đủ dạng “Giáp Tý”, “Ất Sửu”… Ví dụ ngày
                  8/8/2026 là ngày Giáp Dần thì giờ Tý của ngày đó là{' '}
                  {strong('giờ Giáp Tý')}; còn ngày 10/8/2026 (Bính Thìn) thì giờ Tý là{' '}
                  {strong('giờ Mậu Tý')}. Với việc chọn giờ tốt/xấu bạn chỉ cần chi giờ — can giờ là
                  lớp thông tin thêm.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="gio-hoang-dao"
        concept="Vì sao cùng là giờ Tý mà hôm nay tốt, hôm kia lại xấu"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng 12 chiếc ghế xếp thành vòng tròn — đó là 12 khung giờ. Có 12 “ông
                sao” lần lượt ngồi vào ghế, 6 ông hiền và 6 ông dữ. Mỗi ngày, các ông{' '}
                {strong('bắt đầu ngồi từ một chiếc ghế khác nhau')}. Nên chiếc ghế “giờ Tý” hôm nay
                có ông hiền ngồi, hôm khác lại là ông dữ.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Vòng 12 sao {strong('không đổi thứ tự')}: Thanh Long → Minh Đường → Thiên Hình →
                  Chu Tước → Kim Quỹ → Thiên Đức → Bạch Hổ → Ngọc Đường → Thiên Lao → Huyền Vũ → Tư
                  Mệnh → Câu Trận, rồi quay lại đầu. Thứ đổi mỗi ngày là{' '}
                  {strong('điểm xuất phát')} của vòng ấy.
                </p>
                <p>
                  Điểm xuất phát do {strong('chi của NGÀY')} quyết định. Ngày mang chi Dần thì Thanh
                  Long khởi ở giờ Tý; ngày mang chi Thìn thì Thanh Long khởi ở giờ Thìn. Cả vòng bị
                  đẩy đi, nên bảng giờ tốt của hai ngày khác hẳn nhau.
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
                  Đối chiếu hai ngày thật cho rõ. Ngày {strong('8/8/2026 (Giáp Dần)')} — chi ngày Dần
                  → khởi Thanh Long tại giờ Tý → giờ Tý (23h–1h) là{' '}
                  {strong('Thanh Long, đại cát')}. Ngày {strong('10/8/2026 (Bính Thìn)')} — chi ngày
                  Thìn → khởi Thanh Long tại giờ Thìn → cũng khung 23h–1h ấy lại rơi vào{' '}
                  {strong('Thiên Lao, hắc đạo')}.
                </p>
                <p>
                  Đây là chỗ khiến nhiều người hiểu sai nhất: họ nhớ “giờ Tý là giờ tốt” như một sự
                  thật cố định rồi áp cho mọi ngày. Không có giờ nào tốt vĩnh viễn, cũng không có giờ
                  nào xấu vĩnh viễn — {strong('phải tra theo ngày cụ thể')}. Vì mốc khởi phụ thuộc
                  chi ngày, một khung giờ sẽ lần lượt đi qua đủ cả 12 sao khi ngày đổi.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="gio-hoang-dao"
        concept="Vòng 12 sao trực giờ: 6 hoàng đạo xen 6 hắc đạo"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trong 12 “ông sao” thì có {strong('6 ông hiền')} và {strong('6 ông dữ')}, và họ đứng
                xen kẽ nhau. Vì thế ngày nào cũng có đủ 6 khung giờ đẹp — không có ngày nào toàn giờ
                xấu cả.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  6 sao hoàng đạo (giờ tốt): {strong('Thanh Long')} (đại cát),{' '}
                  {strong('Minh Đường')} (quý nhân phù trợ), {strong('Kim Quỹ')} (tài lộc, gia đạo),{' '}
                  {strong('Thiên Đức')} (che chở, hoá giải — còn gọi Bảo Quang),{' '}
                  {strong('Ngọc Đường')} (thanh quý, học hành) và {strong('Tư Mệnh')} (thuận lợi,
                  việc hành chính).
                </p>
                <p>
                  6 sao hắc đạo (giờ nên thận trọng): Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao, Huyền
                  Vũ, Câu Trận. Dù mốc khởi vòng đổi theo ngày,{' '}
                  {strong('tỉ lệ luôn là 6 – 6')} vì cả 12 sao đều được xếp đúng một lần lên 12 canh
                  giờ.
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
                  Cùng bộ 12 sao thần này còn được dùng ở cấp NGÀY (ngày hoàng đạo / hắc đạo) — chỉ
                  khác quy tắc khởi vòng. Nghĩa là “Thanh Long” bạn thấy ở đây và “ngày Thanh Long”
                  trong lịch là {strong('cùng một hệ thần sát, khác cấp áp dụng')}. Phần chọn ngày
                  không thuộc bài này; xem ở bài Trạch Cát.
                </p>
                <p>
                  Một chi tiết dễ vấp khi đọc chéo nguồn: sao thứ sáu trong vòng được ghi là{' '}
                  {strong('Thiên Đức ở nơi này, Bảo Quang ở nơi khác')} — cùng một sao, hai tên gọi.
                  Gặp bảng ghi “Bảo Quang” thì hiểu đó chính là Thiên Đức, đừng tưởng là sao thứ 13.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="gio-hoang-dao"
        concept="Giờ Tý bắt đầu từ 23h — con số dễ nhầm nhất"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Giờ Tý không bắt đầu lúc 12 giờ đêm như ta hay nghĩ, mà bắt đầu sớm hơn{' '}
                {strong('một tiếng')}: từ 11 giờ đêm tới 1 giờ sáng. Nửa đêm nằm ngay{' '}
                {strong('giữa')} giờ Tý.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Khung giờ Tý là {strong('23h–1h')}, nên nó nằm vắt qua hai ngày dương lịch. Các
                  canh sau đó cứ cộng dần hai tiếng: Sửu 1h–3h, Dần 3h–5h, Mão 5h–7h, Thìn 7h–9h, Tỵ
                  9h–11h, Ngọ 11h–13h, Mùi 13h–15h, Thân 15h–17h, Dậu 17h–19h, Tuất 19h–21h, Hợi
                  21h–23h.
                </p>
                <p>
                  Vì vậy khi tra giờ hoàng đạo cho một ngày, phần 23h–24h của{' '}
                  {strong('đêm hôm trước')} về mặt canh giờ đã thuộc về giờ Tý — chi tiết nhỏ nhưng
                  hay gây lệch một bậc khi tra tay.
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
                  Công cụ quy đổi bằng cách cộng 1 vào giờ đồng hồ rồi chia đôi: 23h → canh 0 (Tý),
                  1h → canh 1 (Sửu)… Nhờ vậy mốc 23h rơi đúng đầu giờ Tý.
                </p>
                <p>
                  Quan trọng hơn: giờ được tính theo {strong('giờ Việt Nam (UTC+7)')}, không theo
                  đồng hồ máy của bạn. Ai đang ở múi giờ khác mở công cụ vẫn thấy “giờ tốt kế tiếp”
                  tính theo giờ Việt Nam — đúng với thói quen dùng lịch âm trong nước, nhưng cần biết
                  để khỏi lệch khi bạn đang ở nước ngoài.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="gio-hoang-dao"
        concept="Giờ tốt giúp được gì thật — và không giúp được gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Chọn giờ đẹp giống như mặc bộ đồ tươm tất trước khi đi làm việc quan trọng: nó khiến
                mình {strong('yên tâm và chỉn chu hơn')}. Nhưng bộ đồ đẹp không làm bài tập thay
                mình, và giờ đẹp cũng vậy.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cái được thật: một mốc giờ rõ ràng để mọi người cùng có mặt, một tâm thế bình tĩnh
                  khi bắt đầu, và sự tôn trọng phong tục với người thân lớn tuổi. Đó là{' '}
                  {strong('giá trị tâm lý và giá trị tổ chức')} — có thật, nhưng khác hẳn với “bảo
                  đảm thành công”.
                </p>
                <p>
                  Cái không được: giờ hoàng đạo {strong('không')} thay thế phần chuẩn bị. Hợp đồng
                  đọc kỹ vẫn an toàn hơn hợp đồng ký vội trong giờ đẹp; chuyến đi kiểm tra xe kỹ vẫn
                  an toàn hơn chuyến đi khởi hành đúng giờ Thanh Long.
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
                  Có một lớp sự thật rất đời ẩn dưới lớp áo phong tục: nhiều giờ hoàng đạo được nhắc
                  cho việc hành chính, giấy tờ lại rơi vào {strong('ban ngày')} — đúng lúc cơ quan mở
                  cửa và người ta tỉnh táo nhất. Chọn “giờ thuận” theo nghĩa đó thì việc trôi thật,
                  nhưng lý do là sự trùng khớp thực tế chứ không phải phép màu.
                </p>
                <p>
                  Ranh giới cần giữ: đừng để việc chờ giờ làm {strong('lỡ việc thật')}. Giờ Tý là
                  23h–1h — không đáng thức đêm để ký giấy tờ chỉ vì khung đó đẹp. Trong cùng ngày còn
                  5 giờ hoàng đạo khác, và nếu cả 6 giờ tốt đều bất tiện thì làm vào giờ thuận tiện
                  với sự chuẩn bị kỹ vẫn là lựa chọn hợp lý.
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
    prompt: 'Một canh giờ (giờ âm) dài bao lâu, và vì sao lại như vậy?',
    answer: (
      <>
        Dài {strong('2 giờ đồng hồ')}. Vì người xưa chia một ngày 24 tiếng thành{' '}
        {strong('12 canh giờ')} mang tên 12 địa chi (Tý, Sửu, Dần… Hợi), nên mỗi canh bằng 24 ÷ 12 = 2
        tiếng. Khi nói “giờ Ngọ” là nói cả khung 11h–13h, không phải riêng 12h.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Giờ Tý ứng với khung giờ đồng hồ nào?',
    choices: [
      { text: '0h–2h', note: 'Không — đây là nhầm lẫn phổ biến vì nghĩ giờ Tý bắt đầu đúng nửa đêm.' },
      {
        text: '23h–1h',
        correct: true,
        note: 'Đúng — giờ Tý bắt đầu từ 23h, nửa đêm nằm ở giữa khung.',
      },
      { text: '22h–24h', note: 'Không — 21h–23h là giờ Hợi, 23h mới bắt đầu giờ Tý.' },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Sáu sao hoàng đạo (làm nên giờ tốt) là những sao nào?',
    choices: [
      {
        text: 'Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao, Huyền Vũ, Câu Trận',
        note: 'Đây là 6 sao hắc đạo — giờ nên thận trọng.',
      },
      {
        text: 'Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức, Ngọc Đường, Tư Mệnh',
        correct: true,
        note: 'Đúng — Thiên Đức còn được ghi là Bảo Quang ở một số bản lịch.',
      },
      {
        text: 'Thái Dương, Thái Âm, Mộc Đức, Thổ Tú, Thủy Diệu, Vân Hớn',
        note: 'Không — đây là sao Cửu Diệu của sao hạn theo tuổi, một hệ hoàn toàn khác.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Mỗi ngày có bao nhiêu giờ hoàng đạo?',
    choices: [
      {
        text: 'Đúng 6 giờ — vì vòng 12 sao có 6 sao lành, xếp đủ một lần lên 12 canh giờ',
        correct: true,
        note: 'Đúng — tỉ lệ luôn cân 6 tốt / 6 xấu, không ngày nào toàn giờ xấu.',
      },
      { text: 'Thay đổi tuỳ ngày, có ngày nhiều có ngày ít', note: 'Không — thứ đổi theo ngày là giờ NÀO tốt, còn số lượng thì luôn là 6.' },
      { text: 'Có ngày không có giờ hoàng đạo nào', note: 'Không — vì cả 12 sao đều được xếp đúng một lần nên luôn có đủ 6 giờ tốt.' },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt: 'Vì sao cùng là giờ Tý mà ngày này được coi là giờ tốt, ngày kia lại là giờ xấu?',
    answer: (
      <>
        Vì vòng 12 sao giữ nguyên thứ tự nhưng {strong('điểm xuất phát đổi theo chi của NGÀY')}. Ngày
        chi Dần khởi Thanh Long tại giờ Tý → giờ Tý là Thanh Long (đại cát). Ngày chi Thìn khởi Thanh
        Long tại giờ Thìn → giờ Tý bị đẩy thành Thiên Lao (hắc đạo). Nên không có giờ nào tốt hay xấu
        vĩnh viễn — phải tra theo ngày cụ thể.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Ngày mang chi Dần (hoặc Thân) thì sao Thanh Long khởi ở canh giờ nào?',
    choices: [
      { text: 'Giờ Dần (3h–5h)', note: 'Không — nhầm chi NGÀY với chi GIỜ; hai thứ này khác nhau.' },
      { text: 'Giờ Thìn (7h–9h)', note: 'Không — đó là mốc của ngày chi Thìn và chi Tuất.' },
      {
        text: 'Giờ Tý (23h–1h)',
        correct: true,
        note: 'Đúng — theo bài quyết “Dần Thân gia Tý”: ngày Dần và ngày Thân khởi Thanh Long tại giờ Tý.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Việc quan trọng buộc phải làm đúng vào một giờ hắc đạo. Cách xử lý hợp lý nhất là gì?',
    choices: [
      { text: 'Dời hẳn sang ngày khác cho chắc', note: 'Thường không cần — trong chính ngày đó vẫn còn 5 giờ hoàng đạo khác để chọn.' },
      {
        text: 'Xem còn giờ hoàng đạo nào khác trong ngày không; nếu không tiện thì cứ làm và chuẩn bị kỹ hơn',
        correct: true,
        note: 'Đúng — giờ xấu là lời nhắc thận trọng, không phải điều cấm; đừng để chờ giờ làm lỡ việc.',
      },
      {
        text: 'Làm lễ hoá giải giờ xấu trước khi bắt đầu',
        note: 'Không cần — hieu.asia không bán lễ và không cho rằng phải “giải” mới yên.',
      },
    ],
  },
];

export function GioHoangDaoRecall() {
  return <ActiveRecall topicId="gio-hoang-dao" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được giờ hoàng đạo dùng để làm gì (chọn khung giờ khởi sự trong một ngày đã có) — và nó KHÔNG hứa gì (không bảo đảm việc thành).',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể được 12 canh giờ địa chi kèm khung giờ đồng hồ, và biết một canh giờ dài 2 tiếng.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả cách khởi giờ: chi của NGÀY → canh giờ khởi Thanh Long → xếp vòng 12 sao cố định lên 12 canh giờ.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Giải thích được vì sao cùng một giờ Tý mà ngày này tốt, ngày kia xấu — và vì sao không có “giờ tốt cố định”.',
  },
  {
    id: 'stars',
    facet: 'Sáu sao lành',
    can: 'Gọi tên 6 sao hoàng đạo (Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức/Bảo Quang, Ngọc Đường, Tư Mệnh) và biết mỗi sao thường được nhắc hợp việc gì.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói rõ bài này chỉ nói về chọn GIỜ; chọn ngày, ngày kiêng kỵ và hướng xuất hành là các lớp khác, tra ở công cụ khác.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao “giờ xấu” không phải điềm tai hoạ, vì sao ngày nào cũng có đủ 6 giờ tốt, và vì sao không nên để việc chờ giờ mà lỡ.',
  },
  {
    id: 'apply',
    facet: 'Vận dụng',
    can: 'Với một ngày cụ thể, tự chọn được một khung giờ vừa hợp phong tục vừa thuận tiện thật cho việc của mình.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho người thân “giờ hoàng đạo là gì và nên dùng thế nào” bằng lời của bạn, giữ giọng tham khảo.',
  },
];

export function GioHoangDaoChecklist() {
  return <UnderstandingChecklist topicId="gio-hoang-dao" facets={FACETS} />;
}

export function GioHoangDaoWhys() {
  return (
    <FiveWhys
      topicId="gio-hoang-dao"
      start={
        <>
          Một người hẹn ký hợp đồng lúc 10h sáng, tra thấy khung 9h–11h hôm đó rơi vào giờ hắc đạo
          (Chu Tước — chủ khẩu thiệt, thị phi), liền định dời cả buổi ký sang một ngày khác.
        </>
      }
      chain={[
        {
          question: 'Vì sao dời hẳn sang ngày khác là phản ứng chưa cần thiết?',
          because: (
            <>
              Vì ngay trong chính ngày đó vẫn còn {strong('5 giờ hoàng đạo khác')} để chọn — chỉ cần
              đổi khung giờ, không cần đổi ngày.
            </>
          ),
        },
        {
          question: 'Vì sao chắc chắn ngày nào cũng còn giờ hoàng đạo khác?',
          because: (
            <>
              Vì vòng 12 sao trực giờ có đúng {strong('6 sao lành và 6 sao dữ')}, được xếp đủ một lần
              lên 12 canh giờ. Tỉ lệ 6 – 6 không bao giờ đổi.
            </>
          ),
        },
        {
          question: 'Vậy cái gì đổi theo từng ngày, nếu số lượng thì không?',
          because: (
            <>
              Chỉ có {strong('điểm xuất phát của vòng sao')}. Chi của NGÀY quyết định canh giờ khởi
              Thanh Long — bài quyết cổ ghi “Dần Thân gia Tý, Mão Dậu Dần, Thìn Tuất Thìn, Tỵ Hợi
              Ngọ, Tý Ngọ Thân, Sửu Mùi Tuất”.
            </>
          ),
        },
        {
          question: 'Vì sao mốc khởi ấy lại được đặt như vậy — có gì trên trời quy định không?',
          because: (
            <>
              Không. Đó là một {strong('quy ước lịch pháp')} do người xưa truyền lại. 12 “sao” trực
              giờ là thần sát trong lịch, {strong('không phải thiên thể')} — không có phép đo thiên
              văn nào xác nhận Thanh Long “đang ở” giờ Tý của ngày Dần.
            </>
          ),
        },
        {
          question: 'Biết đó là quy ước thì cách dùng giờ hoàng đạo nên đổi thế nào?',
          because: (
            <>
              Nó chuyển giờ tốt từ “điều kiện bắt buộc” thành{' '}
              {strong('một mốc để khởi sự cho vững tâm')}. Chọn được thì tốt; không chọn được thì
              chuẩn bị kỹ và cứ làm — điều quyết định
              nằm ở phần chuẩn bị, không ở khung giờ.
            </>
          ),
        },
      ]}
      root={
        <>
          Giờ hoàng đạo là một cách đẹp để đặt mốc cho việc quan trọng: có giờ hẹn rõ ràng, mọi người
          cùng có mặt, tâm thế bình tĩnh. Nhưng nó là quy ước phong tục, không phải quy luật tự
          nhiên — nên đừng sợ giờ xấu, và tuyệt đối đừng để việc chờ giờ làm lỡ việc thật.{' '}
          {strong('Tham khảo, không phán định.')}
        </>
      }
    />
  );
}
