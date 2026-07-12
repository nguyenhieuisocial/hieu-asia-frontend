/**
 * Nội dung "học chủ động" cho trang /learn/bat-tu — bài exemplar.
 *
 * TẤT CẢ grounded từ chính bài viết bat-tu (Nhật Chủ vượng/nhược, Thập Thần,
 * Dụng Thần, Thần Sát) — KHÔNG thêm dữ kiện mới. Giữ giọng "góc nhìn tham khảo,
 * không phán định". Mỗi khối là một wrapper mỏng quanh component dùng chung, để
 * page.tsx chỉ cần thả vào mảng sections.
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

export function BatTuFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Làm sao biết năng lượng bẩm sinh của mình thiên về đâu — mạnh ở mặt nào, thiếu ở mặt
          nào — để hiểu mình rõ hơn và chọn hướng đi hợp lý hơn?
        </>
      }
      why={
        <>
          Bát Tự ra đời từ lịch Can–Chi của người xưa: quy thời khắc sinh thành một bộ mã Ngũ
          Hành để soi xu hướng. Nó tồn tại vì con người luôn muốn một tấm bản đồ để tự hiểu — không
          phải để “biết trước số phận”.
        </>
      }
      what={
        <>
          8 chữ = 4 trụ ({strong('Năm, Tháng, Ngày, Giờ')}), mỗi trụ một Thiên Can + một Địa Chi.
          Đây là bản đồ năng lượng Ngũ Hành tại thời điểm bạn sinh ra — {strong('không phải')} một
          lời phán định mệnh.
        </>
      }
      how={
        <>
          Lấy Can ngày làm {strong('Nhật Chủ')} (“tôi”) → xét tôi {strong('vượng hay nhược')} theo
          mùa sinh, gốc rễ và vây cánh → quy 7 chữ còn lại thành {strong('Thập Thần')} → chọn{' '}
          {strong('Dụng Thần')} (hành giúp lá số cân bằng).
        </>
      }
      soWhat={
        <>
          Để hiểu thiên hướng và điểm cân bằng của mình rồi {strong('tự quyết')} — không phải để
          “đổi mệnh, giải hạn”. Một bài đọc tử tế luôn nói rõ đây là cách luận có cơ sở, không tuyệt
          đối.
        </>
      }
    />
  );
}

export function BatTuDepth() {
  return (
    <div className="space-y-5">
      <DepthTabs
        topicId="bat-tu"
        concept="Nhật Chủ vượng hay nhược — vì sao đây là bước đầu tiên"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng “tôi” là một cái cây. Cây khoẻ hay yếu tuỳ vào: có trồng đúng mùa
                không, rễ có bám đất không, xung quanh có nhiều cây cùng phe nâng đỡ không. Cây{' '}
                {strong('khoẻ')} thì cần bớt tưới; cây {strong('yếu')} thì cần thêm nước, thêm nắng.
                Bát Tự xem “cái tôi” của bạn đang là cây khoẻ hay cây yếu.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Nhật Chủ')} là Thiên Can của ngày sinh — đại diện cho “bạn”. Trước khi
                  nói tốt hay xấu, phải biết Nhật Chủ {strong('mạnh (vượng)')} hay{' '}
                  {strong('yếu (nhược)')}, vì cùng một quan hệ Ngũ Hành nhưng người mạnh và người
                  yếu lại luận theo hướng khác nhau, đôi khi ngược hẳn.
                </p>
                <p>
                  Ba căn cứ chính: {strong('mùa sinh')} (mạnh nhất), {strong('gốc rễ')} trong các
                  chi, và số {strong('“đồng minh”')} so với {strong('“đối thủ”')} trong lá số.
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
                  Phán định vượng–nhược dựa trên ba lớp: {strong('đắc lệnh')} (trạng thái mùa của
                  Nhật Chủ qua Chi Tháng — Vượng / Tướng / Hưu / Tù / Tử), {strong('đắc địa')}{' '}
                  (thông căn — tàng can các chi cùng hành hoặc hành sinh Nhật Chủ), và{' '}
                  {strong('đắc thế')} (so lực phe Tỷ Kiếp + Ấn với phe Quan Sát + Tài + Thực Thương).
                </p>
                <p>
                  Chỉ “đếm số chữ mỗi hành” là cách thô và dễ sai — phải xét cả tổ hợp, hội cục, can
                  hợp hoá. Đây là bước nền để chọn Dụng Thần, và cũng là chỗ các trường phái có thể
                  kết luận khác nhau cho cùng một lá số.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="bat-tu"
        concept="Thập Thần — 10 mối quan hệ với “tôi”"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Đặt “tôi” ở giữa. Người quanh tôi có mấy kiểu: người giống tôi (bạn bè), việc tôi
                làm ra (tôi vẽ, tôi hát), đồ tôi giữ (tiền, đồ chơi), người quản tôi (thầy cô), và
                người nuôi tôi (ba mẹ). Thập Thần chỉ là {strong('cách gọi tên')} năm kiểu quan hệ
                đó cho gọn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Thập Thần (十神)')} là 10 tên gọi cho quan hệ Ngũ Hành giữa mỗi chữ trong
                  lá số với Nhật Chủ. Gốc là 5 nhóm: {strong('đồng hành')} với tôi, thứ{' '}
                  {strong('tôi sinh ra')}, thứ {strong('tôi khắc')}, thứ {strong('khắc tôi')}, thứ{' '}
                  {strong('sinh ra tôi')}.
                </p>
                <p>
                  Mỗi nhóm tách đôi theo âm–dương nên thành 10. Chúng đánh dấu các mảng đời sống: bản
                  thân, tài năng, tiền bạc, sự nghiệp, học vấn. Điều quan trọng:{' '}
                  {strong('không thần nào tốt hay xấu cố định')} — còn tuỳ lá số đang cần gì.
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
                  Năm quan hệ gốc: {strong('Tỷ Kiếp')} (đồng hành), {strong('Thực Thương')} (Nhật
                  Chủ sinh ra), {strong('Tài')} (Nhật Chủ khắc), {strong('Quan Sát')} (khắc Nhật
                  Chủ), {strong('Ấn')} (sinh Nhật Chủ). Mỗi nhóm tách đôi theo âm–dương: khác âm–dương
                  cho ra thần “chính”, cùng âm–dương cho ra thần “thiên/lệch” (ví dụ với Tài: khác =
                  Chính Tài, cùng = Thiên Tài; với Quan Sát: khác = Chính Quan, cùng = Thất Sát).
                </p>
                <p>
                  Không đọc một thần một cách máy móc. Luận chuẩn là{' '}
                  {strong('Thập Thần × vượng/nhược × Dụng Thần')}: cùng một Thất Sát, thân vượng có
                  thể “dùng” được (cần Thực Thần chế Sát hoặc Ấn hoá Sát), thân nhược thì nó thành áp
                  lực đè.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="bat-tu"
        concept="Dụng Thần — vì sao đây là chìa khoá của cả lá số"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Lá số như một nồi canh. {strong('Dụng Thần')} là thứ còn thiếu để nồi canh vừa
                miệng: nhạt quá thì thêm muối, mặn quá thì thêm nước. Nó là thứ kéo mọi vị về{' '}
                {strong('cân bằng')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Dụng Thần (用神)')} là hành làm lá số cân bằng và chạy tốt nhất, ví như
                  “vị thuốc”. Nguyên tắc phổ biến nhất: thân {strong('yếu')} thì dùng hành{' '}
                  {strong('sinh/trợ')} mình (Ấn, Tỷ Kiếp); thân {strong('mạnh')} thì dùng hành{' '}
                  {strong('tiết/khắc/hao')} bớt (Thực Thương, Quan Sát, Tài).
                </p>
                <p>
                  Tìm được Dụng Thần rồi thì mới biết Thập Thần nào đang “dùng được”, hành nào nên
                  bổ trợ trong môi trường sống. Đây là lúc mọi mảnh ghép ráp lại thành một bức tranh
                  có hướng.
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
                  Nguyên tắc gốc là {strong('phù–ức')} (nâng cái yếu, ép cái mạnh). Ngoài ra còn:{' '}
                  {strong('điều hậu')} (lá số quá lạnh cần Hỏa, quá nóng cần Thủy),{' '}
                  {strong('thông quan')} (hai hành khắc nhau gay gắt thì cần một hành trung gian),
                  và bệnh–dược. Hành có lợi gọi là {strong('Hỷ Dụng')}, hành bất lợi gọi là{' '}
                  {strong('Kỵ Thần')}.
                </p>
                <p>
                  Đây là phần khó và dễ sai nhất; các trường phái có thể chọn khác nhau cho cùng một
                  lá số. Vì vậy nên trình bày {strong('có cơ sở')} (vượng/nhược + mùa) và nói rõ đây
                  là một cách luận phổ biến, không tuyệt đối — chứ không biến thành chuyện “đổi mệnh,
                  giải hạn”.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="bat-tu"
        concept="Tàng can — vì sao một Chi lại chứa nhiều hành"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Mỗi con giáp (Địa Chi) giống một cái hộp. Nhìn bên ngoài chỉ thấy một màu — đó là
                “hành chính”. Nhưng mở hộp ra, bên trong còn cất thêm vài món nhỏ. Vì thế một con
                giáp tuy mang một hành vẫn {strong('giữ thêm chút hành khác')} nấp bên trong.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Tàng can (藏干)')} là các Thiên Can “ẩn” bên trong một Địa Chi. Mỗi chi
                  có một hành chính, nhưng vì cất thêm can ẩn nên nó {strong('“chứa” thêm vài hành')}
                  {' '}từ các can nằm bên trong. Ví dụ chi {strong('Sửu')} hành chính là Thổ, nhưng
                  tàng Quý (Thủy), Tân (Kim) và Kỷ (Thổ).
                </p>
                <p>
                  Bốn chi Thổ — Sửu, Mùi, Thìn, Tuất — hay được ví như những {strong('“kho”')} cất
                  nhiều can. Nhờ tàng can, người luận biết Nhật Chủ có {strong('“gốc rễ”')} trong các
                  chi hay không.
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
                  Tàng can là căn cứ của {strong('đắc địa (thông căn)')}: Nhật Chủ có “rễ” khi tàng
                  can của một chi cùng hành với nó, hoặc là hành sinh ra nó. Đây là một trong ba căn
                  cứ xét vượng/nhược, nên {strong('không thể đọc trọn một chi chỉ bằng hành bề mặt')}
                  {' '}— phải xét cả các can ẩn.
                </p>
                <p>
                  Cũng vì thế, khi hai “kho” Thổ đối nhau — {strong('Sửu–Mùi')} và{' '}
                  {strong('Thìn–Tuất')} — thì chính các can ẩn bên trong va nhau, gọi là{' '}
                  {strong('“xung mộ khố”')}, chứ không đơn thuần là hai hành Thổ khắc nhau.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="bat-tu"
        concept="Vòng Trường Sinh — 12 pha của khí"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Khí của “tôi” giống một đời cây: nảy mầm, lớn lên, ra hoa rực rỡ nhất, rồi lá rụng,
                thu mình lại vào mùa đông, rồi lại nảy mầm. Mười hai pha chỉ là mười hai chặng{' '}
                {strong('lên rồi xuống')} đó. Pha “mùa đông” (Tử, Mộ) không phải là cây chết — chỉ là
                lúc nghỉ để bật lại.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  {strong('Vòng Trường Sinh (十二長生)')} đặt Nhật Chủ lên mỗi Địa Chi rồi hỏi: ở đây
                  “khí” của tôi đang ở pha nào. Mười hai pha nối thành một vòng: Trường Sinh → Mộc
                  Dục → Quan Đới → Lâm Quan → {strong('Đế Vượng')} (đỉnh) → Suy → Bệnh → Tử → Mộ →
                  Tuyệt → Thai → Dưỡng.
                </p>
                <p>
                  Nó cho biết ở trụ đó khí đang mạnh hay yếu, góp phần đánh giá vượng/nhược. Nhớ:
                  {' '}{strong('“Tử” và “Mộ” nói về cường độ khí đang thu lại')}, không phải điềm chết
                  chóc.
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
                  Pha khí là một lát cắt {strong('bổ sung')} cho vượng/nhược, không thay ba căn cứ
                  chính (đắc lệnh, đắc địa, đắc thế). Đỉnh của vòng là {strong('Đế Vượng')} (khí thịnh
                  nhất), đáy là {strong('Tuyệt')} (khí gần như tận). Riêng {strong('Mộ')} là pha thu
                  tàng, còn gọi là “kho” — nghỉ và tích trữ, không phải suy sụp.
                </p>
                <p>
                  Vì vậy đừng đọc một pha như điềm lành hay dữ tuyệt đối. Cùng một pha vẫn phải soi
                  chung với cả lá số — {strong('nó chỉ mô tả cường độ khí')}, không phán chuyện sống
                  chết hay tuổi thọ.
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
      'Vì sao trước khi nói một lá Bát Tự “tốt” hay “xấu”, người luận phải biết Nhật Chủ vượng hay nhược trước?',
    answer: (
      <>
        Vì cùng một quan hệ Ngũ Hành (cùng một Thập Thần) nhưng với thân vượng và thân nhược lại
        luận theo hướng khác nhau, đôi khi ngược hẳn. “Tốt/xấu” phụ thuộc lá số đang cần thêm hay
        cần bớt hành đó — nên phải biết vượng/nhược trước khi kết luận.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Trong ba căn cứ đánh giá Nhật Chủ mạnh–yếu, yếu tố nào ảnh hưởng MẠNH nhất?',
    choices: [
      {
        text: 'Số lượng chữ cùng hành với Nhật Chủ (đếm cho nhanh)',
        note: 'Đếm số chữ chỉ là gợi ý thô và dễ sai.',
      },
      {
        text: 'Mùa sinh — tức Chi Tháng (đắc lệnh)',
        correct: true,
        note: 'Đúng: mùa sinh (đắc lệnh) là yếu tố mạnh nhất trong ba căn cứ.',
      },
      {
        text: 'Có sao Đào Hoa hay Quý Nhân hay không',
        note: 'Thần Sát chỉ là lớp phụ “tô màu”, không quyết định vượng/nhược.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Dụng Thần là gì?',
    choices: [
      {
        text: 'Hành giúp lá số cân bằng và vận hành tốt nhất — ví như “vị thuốc”',
        correct: true,
        note: 'Đúng. Thân nhược thường dùng hành sinh/trợ; thân vượng thường dùng hành tiết/khắc/hao.',
      },
      {
        text: 'Ngôi sao tốt nhất, quyền lực nhất trong lá số',
        note: 'Dụng Thần là một HÀNH cân bằng lá số, không phải một ngôi sao.',
      },
      {
        text: 'Một phép “giải hạn, đổi mệnh” cho người xấu số',
        note: 'Một bài đọc tử tế không bán chuyện “đổi mệnh, giải hạn”.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Thần Sát (Đào Hoa, Quý Nhân…) có quyết định số mệnh không?',
    choices: [
      {
        text: 'Có — đó là phần lõi, quan trọng nhất của lá số',
        note: 'Không. Phần lõi là Thập Thần và Dụng Thần.',
      },
      {
        text: 'Không — chỉ là lớp phụ “tô màu”, tra theo bảng cố định',
        correct: true,
        note: 'Đúng. Thần Sát không thay phần lõi, chỉ nên dùng để tham khảo thêm.',
      },
      {
        text: 'Có — chỉ riêng Đào Hoa là đủ để luận chuyện tình duyên',
        note: 'Không nên dùng riêng một Thần Sát để phán hay hù doạ.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: Hai người cùng có “Tài” (sao tiền bạc) mạnh trong lá số. Vì sao chưa chắc cả hai đều luận giống nhau, hay đều “giàu”?',
    answer: (
      <>
        Vì còn tuỳ Nhật Chủ vượng hay nhược. Thân vượng gặp Tài thì đủ sức “gánh” được Tài (thường
        luận thuận); còn thân nhược mà Tài quá vượng thì rơi vào cảnh “thân nhược tài đa” — đuối sức,
        khó giữ. Luận chuẩn là {strong('Thập Thần × vượng/nhược × Dụng Thần')}, không đọc một ngôi
        sao một cách máy móc.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Vì sao người ta nói một Địa Chi có thể “chứa” nhiều hành?',
    choices: [
      {
        text: 'Vì mỗi Địa Chi ẩn bên trong một hoặc vài Thiên Can (tàng can), nên mang theo hành của các can ẩn đó',
        correct: true,
        note: 'Đúng. Ví dụ Sửu (hành chính Thổ) tàng Quý (Thủy), Tân (Kim), Kỷ (Thổ) — nên đọc trọn một chi phải xét cả các can ẩn.',
      },
      {
        text: 'Vì mỗi Địa Chi tự đổi hành theo mùa trong năm',
        note: 'Hành chính của Chi là cố định. Cái làm nó “chứa nhiều hành” là các can ẩn bên trong (tàng can), không phải đổi theo mùa.',
      },
      {
        text: 'Vì Thiên Can và Địa Chi thật ra là một thứ, chỉ gọi hai tên',
        note: 'Can và Chi là hai hệ riêng. Chi ẩn chứa can bên trong, nhưng không phải cùng một thứ.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'mcq',
    prompt: 'Trong Vòng Trường Sinh, một trụ rơi vào pha “Mộ” hay “Tử” nghĩa là gì?',
    choices: [
      {
        text: 'Là điềm báo về bệnh tật hay cái chết của người đó',
        note: 'Không. “Tử/Mộ” chỉ nói về cường độ khí đang thu lại, không phải điềm chết chóc.',
      },
      {
        text: 'Là một pha khí của Nhật Chủ đang yếu hoặc thu tàng — chỉ mô tả cường độ, không phải điềm dữ',
        correct: true,
        note: 'Đúng. 12 pha (Trường Sinh → Đế Vượng → … → Mộ → Tuyệt → Thai → Dưỡng) là vòng lên–xuống của khí, giống bốn mùa của một đời cây.',
      },
      {
        text: 'Là pha mạnh nhất, đỉnh cao của lá số',
        note: 'Pha đỉnh là Đế Vượng, không phải Mộ hay Tử.',
      },
    ],
  },
  {
    id: 'q8',
    type: 'open',
    prompt: 'Bát Tự có cần đúng giờ sinh không? Vì sao?',
    answer: (
      <>
        Có, và khá quan trọng. Trụ Giờ là {strong('một trong bốn trụ')} — tức khoảng 1/4 thông tin
        lá số, ứng với con cái, vận về già và phần “đầu ra” của đời người. Sai giờ thì sai cả trụ
        Giờ; mà vì giờ đổi theo mỗi canh giờ (khoảng 2 tiếng), lệch giờ có thể kéo theo lệch cả cách
        luận Thập Thần, vượng/nhược và Dụng Thần. Nếu không chắc giờ, nên xem phần luận theo giờ là{' '}
        {strong('tương đối')} và cố tra lại giấy tờ khai sinh.
      </>
    ),
  },
];

export function BatTuRecall() {
  return <ActiveRecall topicId="bat-tu" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Bát Tự sinh ra để trả lời câu hỏi gì — và nó KHÔNG hứa hẹn điều gì.',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả lại mạch luận: Nhật Chủ → vượng/nhược → Thập Thần → Dụng Thần.',
  },
  {
    id: 'building-blocks',
    facet: 'Bảng chữ cái',
    can: 'Kể được vai trò của Thiên Can và Địa Chi, và vì sao một Địa Chi có thể chứa nhiều hành (tàng can).',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Chỉ ra Bát Tự khác Tử Vi ở đâu (cân bằng Ngũ Hành trong 4 trụ vs hệ sao trên 12 cung).',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Nói được chỗ luận dễ sai nhất (chọn Dụng Thần) và vì sao các trường phái có thể khác nhau.',
  },
  {
    id: 'application',
    facet: 'Vận dụng',
    can: 'Giải thích vì sao cùng một Thập Thần lại luận khác nhau giữa thân vượng và thân nhược.',
  },
  {
    id: 'time',
    facet: 'Lá số động',
    can: 'Nói được vì sao một lá Bát Tự không “đứng yên” mà chuyển theo thời gian qua Đại Vận (10 năm) và Lưu Niên (từng năm).',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao Thần Sát hay việc “đếm số chữ” không quyết định số mệnh.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại khái niệm “Nhật Chủ vượng/nhược” cho một người chưa biết gì, bằng lời của bạn.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được khái niệm nào trong bài bạn vẫn còn thấy mơ hồ, cần đọc lại.',
  },
];

export function BatTuChecklist() {
  return <UnderstandingChecklist topicId="bat-tu" facets={FACETS} />;
}

export function BatTuWhys() {
  return (
    <FiveWhys
      topicId="bat-tu"
      start={
        <>
          Cùng một sao Tài (tiền bạc) mạnh trong lá số: người này luận là điềm giàu, người kia lại
          luận là gánh nặng.
        </>
      }
      chain={[
        {
          question: 'Vì sao cùng một sao Tài lại luận ngược nhau ở hai người?',
          because: <>Vì còn tùy {strong('Nhật Chủ')} (cái “tôi”) đang vượng hay nhược.</>,
        },
        {
          question: 'Vì sao vượng hay nhược lại làm đổi cách luận?',
          because: (
            <>
              Vì thân vượng đủ sức “gánh” được Tài (thường luận thuận); còn thân nhược mà Tài quá
              nhiều thì rơi vào {strong('“thân nhược tài đa”')} — đuối sức, khó giữ.
            </>
          ),
        },
        {
          question: 'Vì sao phải “gánh” được thì mới tốt?',
          because: (
            <>
              Vì cốt lõi Bát Tự là {strong('cân bằng Ngũ Hành')} — lệch quá về bất kỳ bên nào đều bất
              lợi, không riêng gì Tài.
            </>
          ),
        },
        {
          question: 'Vì sao cân bằng lại là thước đo?',
          because: (
            <>
              Vì {strong('Dụng Thần')} — hành kéo lá số về cân bằng — mới là gốc quyết định điều gì
              “tốt”, điều gì “cần bớt”.
            </>
          ),
        },
        {
          question: 'Vì sao vậy thì không có “sao tốt tuyệt đối”?',
          because: <>Vì tốt hay xấu là {strong('tương đối')} với nhu cầu cân bằng riêng của từng lá số.</>,
        },
      ]}
      root={
        <>
          Trong Bát Tự không có sao tốt hay xấu cố định. Một yếu tố “tốt” hay “xấu” tùy nó có giúp lá
          số {strong('của bạn')} cân bằng hơn không — nên đây là cách luận có cơ sở, không phải lời
          phán định mệnh.
        </>
      }
    />
  );
}
