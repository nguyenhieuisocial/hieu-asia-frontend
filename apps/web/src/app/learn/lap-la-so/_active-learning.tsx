/**
 * Nội dung "học chủ động" cho trang /learn/lap-la-so.
 *
 * GROUNDING — mọi dữ kiện dưới đây lấy từ chính công cụ /la-so-tu-vi và các
 * file nó dùng, KHÔNG thêm dữ kiện mới:
 *   • components/la-so-tu-vi/LaSoChecker.tsx — form hỏi ĐÚNG BA ô (ngày sinh
 *     dương, giờ sinh, giới tính); `parseHour()` chỉ lấy phần GIỜ 0–23, bỏ
 *     phút, mặc định 12; nhãn "vô chính diệu" khi cung Mệnh không có chính
 *     tinh; sao hiển thị kèm độ sáng trong ngoặc.
 *   • lib/tuvi-client.ts — `CastChartInput` = { birthSolarDate, birthHour,
 *     gender }; `cacheKey()` ghép đúng bộ khoá đó ⇒ cùng đầu vào luôn ra cùng
 *     lá số; `TuViPalace` có `earthlyBranch` + `isBodyPalace` (cung Thân là CỜ
 *     trên một cung, không phải cung thứ 13); `TuViStar.brightness` TUỲ CHỌN.
 *   • app/tinh-menh-cuc/form.tsx §"Cách tính Mệnh — Thân — Cục": an Mệnh theo
 *     tháng âm + giờ trên vòng 12 chi; Thân đếm NGƯỢC chiều, luôn rơi vào một
 *     trong sáu cung; Cục = can năm + vị trí Mệnh, tra nạp âm; âm dương năm
 *     sinh + giới tính quyết định CHIỀU đại vận.
 *   • lib/gio-hoang-dao.ts — BRANCHES + HOUR_RANGE (12 canh giờ × 2 tiếng);
 *     lib/ngay-kieng-ky.ts — solarToLunar (lịch âm Hồ Ngọc Đức, UTC+7).
 *
 * PHÂN VAI: bài này sở hữu QUY TRÌNH LẬP. Ý nghĩa từng cung / tam phương tứ
 * chính / cách LUẬN thuộc /learn/tu-vi; Mệnh & Cục trỏ /tinh-menh-cuc. KHÔNG
 * nêu tổng số sao (các nguồn trong repo ghi khác nhau). Giọng: con số là tính
 * toán xác định, phần luận là tham khảo — không phán số mệnh, không hù doạ.
 */

import * as React from 'react';
import { solarToLunar } from '@/lib/ngay-kieng-ky';
import { canChiOfYear } from '@/lib/xem-tuoi-cuoi';
import { LearnFrame } from '@/components/learn/active/LearnFrame';
import { DepthTabs } from '@/components/learn/active/DepthTabs';
import { FiveWhys } from '@/components/learn/active/FiveWhys';
import { ActiveRecall, type RecallQuestion } from '@/components/learn/active/ActiveRecall';
import {
  UnderstandingChecklist,
  type UnderstandingFacet,
} from '@/components/learn/active/UnderstandingChecklist';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;

// Ví dụ "bẫy Tết" — KHÔNG gõ tay số: `solarToLunar` ra ngày âm, `canChiOfYear` tra can chi từ năm âm đó.
const TET_TRAP_SOLAR = { d: 20, m: 1, y: 1993 } as const;
const TET_TRAP_LUNAR = solarToLunar(TET_TRAP_SOLAR.d, TET_TRAP_SOLAR.m, TET_TRAP_SOLAR.y);
const TET_TRAP_CANCHI = canChiOfYear(TET_TRAP_LUNAR.year).name;

export function LapLaSoFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn nhập ngày giờ sinh, bấm một nút, và vài giây sau màn hình hiện ra một tấm lưới 12 ô
          đầy chữ Hán Việt. {strong('Không ai nói cho bạn biết nó đi từ ngày sinh tới tấm lưới đó bằng cách nào')}{' '}
          — nên tấm lá số trông như phép màu, hoặc như trò lừa, tuỳ bạn tin hay không tin.
        </>
      }
      why={
        <>
          Vì {strong('phần lập lá số là tính toán xác định')}, không phải cảm nhận của thầy. Ai nhập
          cùng một ngày, cùng một giờ, cùng giới tính cũng ra cùng một lá số. Hiểu được quy trình
          nghĩa là bạn kiểm tra được — và biết chỗ nào có thể sai.
        </>
      }
      what={
        <>
          Một chuỗi phép đổi có thứ tự: ngày giờ sinh dương lịch →{' '}
          {strong('đổi sang âm lịch')} → đổi giờ đồng hồ sang {strong('canh giờ')} → dựng khung 12
          địa chi → {strong('định cung Mệnh, cung Thân')} → an chính tinh vào các cung → gắn độ
          sáng và Tứ Hóa cho từng sao.
        </>
      }
      how={
        <>
          Công cụ chỉ hỏi {strong('ba dữ kiện')}: ngày sinh dương lịch, giờ sinh, giới tính. Bài này
          dạy bạn tự làm được hai bước đầu bằng tay (đổi lịch, đổi canh giờ), và hiểu đủ rõ các bước
          sau để đọc kết quả mà không phải tin mù.
        </>
      }
      soWhat={
        <>
          Để bạn phân biệt {strong('đâu là con số, đâu là diễn giải')}: nếu lá số của bạn sai, gần
          như luôn là do dữ liệu đầu vào sai chứ không phải máy “phán nhầm”. Và để bạn biết chính
          xác giới hạn của nó — một tấm lá số chỉ biết đúng ba con số về bạn.
        </>
      }
    />
  );
}

export function LapLaSoDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="lap-la-so"
        concept="Vì sao bước đầu tiên bắt buộc là đổi sang âm lịch"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tử Vi được viết ra khi người ta {strong('chỉ dùng lịch âm')}. Mọi bảng tra trong đó
                đều nói theo ngày âm, tháng âm. Nên đưa ngày dương vào là như đọc sai ngôn ngữ — phải
                dịch trước đã.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Ba con số của lịch âm được dùng ở ba chỗ khác nhau:{' '}
                  {strong('tháng âm')} góp phần định cung Mệnh và cung Thân,{' '}
                  {strong('ngày âm')} góp phần định chỗ đứng của sao Tử Vi, còn{' '}
                  {strong('năm âm')} cho ra can chi năm sinh — thứ quyết định Cục và bộ Tứ Hóa gốc.
                </p>
                <p>
                  Vì vậy sai lịch không phải sai một chỗ mà {strong('sai dây chuyền')}: lệch năm âm
                  là lệch cả Cục lẫn Tứ Hóa, tức gần như lệch nguyên lá số.
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
                  Chỗ hiểm nhất là {strong('ranh giới Tết')}. Người sinh tháng 1 hoặc đầu tháng 2
                  dương lịch rất dễ vẫn thuộc {strong('năm âm lịch trước')} — nghĩa là can chi năm
                  sinh khác hẳn con số bạn quen nói. Đây là nguyên nhân số một khiến hai chỗ tra ra
                  hai lá số khác nhau.
                </p>
                <p>
                  hieu.asia đổi lịch bằng thuật toán lịch âm Việt Nam (Hồ Ngọc Đức) tính theo múi giờ{' '}
                  {strong('UTC+7')}. Đó là một quy ước rõ ràng, không phải suy đoán: cùng một ngày
                  dương luôn cho cùng một ngày âm. Nhưng nó cũng có nghĩa là lịch âm{' '}
                  {strong('theo giờ Việt Nam')} — điều đáng biết nếu bạn sinh ở nước khác.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="lap-la-so"
        concept="Địa bàn 12 chi đứng yên — 12 cung mới là thứ xoay"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Hãy tưởng tượng một {strong('mặt đồng hồ 12 số')} vẽ sẵn trên bàn: Tý, Sửu, Dần… Hợi.
                Mười hai số ấy không bao giờ di chuyển. Cái xoay là {strong('mười hai tấm thẻ tên')}{' '}
                — Mệnh, Phụ Mẫu, Phúc Đức… — bạn đặt lên mặt đồng hồ đó, bắt đầu từ chỗ nào là tuỳ
                ngày giờ sinh.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Lá số có {strong('hai lớp nhãn chồng lên nhau')}. Lớp dưới là địa bàn: 12 ô cố
                  định mang tên 12 địa chi, ô nào ở đâu là ở đó với mọi người. Lớp trên là 12 cung
                  — Mệnh, Phụ Mẫu, Phúc Đức, và tiếp tục theo một vòng {strong('không đổi thứ tự')}.
                </p>
                <p>
                  Cả việc lập lá số, ở phần khung, gói lại thành một câu hỏi duy nhất:{' '}
                  {strong('cung Mệnh rơi vào ô địa chi nào?')} Trả lời xong câu đó, 11 cung còn lại
                  tự có chỗ, vì vòng cung không bao giờ đảo thứ tự.
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
                  Trong dữ liệu mà engine trả về, hai lớp này là hai trường tách rời: mỗi cung có tên
                  riêng và có {strong('địa chi riêng')}, còn phần thông tin chung của lá số ghi thẳng{' '}
                  {strong('địa chi của cung Mệnh')} và {strong('địa chi của cung Thân')}. Nghĩa là
                  cấu trúc “nhãn trên khung” không phải cách nói ẩn dụ — nó đúng như vậy trong dữ
                  liệu.
                </p>
                <p>
                  Mỗi ô địa bàn còn mang một {strong('thiên can')} riêng nữa. Bạn chưa cần dùng tới
                  nó để đọc lá số cơ bản, nhưng nó là lý do vì sao hai lá số cùng có “Mệnh tại Ngọ”
                  vẫn không hoàn toàn giống nhau.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="lap-la-so"
        concept="Vì sao giờ sinh là dữ kiện đắt nhất trong ba dữ kiện"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ngày sinh cho biết bạn ở {strong('trang nào')} của cuốn sách. Giờ sinh cho biết bạn ở{' '}
                {strong('dòng nào')} trên trang đó. Đọc nhầm dòng thì cả trang vẫn đúng, nhưng câu bạn
                đọc được lại là câu của người khác.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Giờ sinh không được dùng theo phút, mà được quy về {strong('canh giờ')} — một
                  trong 12 khối, mỗi khối {strong('2 tiếng')}. Sinh 9h30 hay 10h45 đều là giờ Tỵ, và
                  cho ra lá số y hệt nhau.
                </p>
                <p>
                  Nhưng bước qua ranh giới khối là chuyện khác: 10h45 và 11h15 chỉ cách nhau nửa
                  tiếng mà đã là hai canh giờ (Tỵ và Ngọ), nên {strong('cung Mệnh dịch chỗ')} — và
                  cung Mệnh dịch thì cả 11 cung còn lại dịch theo.
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
                  Công cụ chỉ đọc {strong('phần giờ')} bạn nhập và bỏ phần phút. Điều này{' '}
                  {strong('không làm mất gì')}: mọi ranh giới canh giờ đều rơi đúng vào đầu một giờ
                  lẻ (23h, 1h, 3h…), nên phút không bao giờ đổi được kết luận. Nhắc lại cho rõ, vì
                  nhiều người tưởng phải nhớ giờ sinh tới từng phút mới lập được lá số.
                </p>
                <p>
                  Không nhớ giờ thì để {strong('12:00')} (giờ Ngọ) — đó là mặc định của công cụ. Cần
                  trung thực: đó là một {strong('phỏng đoán')}, không phải dữ liệu. Cách kiểm rẻ nhất
                  là lập thêm một lá số ở canh giờ liền kề: nếu phần bạn quan tâm không đổi thì giờ
                  sinh không phải chỗ cần lo; nếu đổi, hãy đi hỏi lại người nhà trước khi đọc tiếp.
                </p>
              </>
            ),
          },
        ]}
      />
      <DepthTabs
        topicId="lap-la-so"
        concept="Cung Thân: vì sao nó chỉ có sáu chỗ để rơi vào"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cung Mệnh và cung Thân được đếm từ cùng một chỗ, nhưng{' '}
                {strong('đi ngược hướng nhau')} — như hai người cùng xuất phát, một người đi tới, một
                người đi lui. Vì thế khoảng cách giữa hai người luôn là số chẵn bước.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cả cung Mệnh lẫn cung Thân đều được định từ tháng sinh âm lịch và giờ sinh; khác
                  nhau ở chỗ {strong('đếm ngược chiều nhau')} theo giờ. Nên mỗi khi giờ sinh nhích
                  một canh, Mệnh lùi một ô thì Thân tiến một ô — khoảng cách giữa chúng đổi{' '}
                  {strong('hai ô')} một lần.
                </p>
                <p>
                  Đó chính là lý do cung Thân không bao giờ rơi vào cung lẻ. Nó chỉ có thể trùng vào{' '}
                  {strong('sáu cung')}: Mệnh, Phúc Đức, Quan Lộc, Thiên Di, Tài Bạch, Phu Thê — đúng
                  danh sách mà công cụ ghi trong phần giải thích của nó.
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
                  Trong dữ liệu, cung Thân không phải một cung thứ 13 mà là một{' '}
                  {strong('cờ đánh dấu')} bật lên trên đúng một trong 12 cung đã có. Cấu trúc dữ liệu
                  nói thẳng điều mà sách hay diễn đạt vòng vo: Thân{' '}
                  {strong('ghép chồng')} lên một cung, không đứng riêng.
                </p>
                <p>
                  Trường hợp Mệnh và Thân đồng cung (khoảng cách bằng 0) là một trong sáu khả năng
                  đó, không phải điều bất thường. Còn Mệnh và Thân{' '}
                  {strong('nói gì')} về một người thì thuộc phần luận — bài Tử Vi 12 cung phụ trách,
                  bài này chỉ chịu trách nhiệm chỉ ra chúng nằm ở đâu và vì sao.
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
    prompt: 'Công cụ lập lá số hỏi bạn đúng những dữ kiện nào — và KHÔNG hỏi gì?',
    answer: (
      <>
        Đúng ba: {strong('ngày sinh dương lịch')}, {strong('giờ sinh')}, {strong('giới tính')}. Nó{' '}
        {strong('không hỏi nơi sinh')}, không hỏi tên, không hỏi bất cứ điều gì về đời bạn. Vì không
        hỏi nơi sinh nên nó cũng không hiệu chỉnh giờ theo kinh độ — phần đó công cụ không tính nên
        bài này không dạy.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Vì sao bước đầu tiên của việc lập lá số là đổi ngày sinh sang âm lịch?',
    choices: [
      {
        text: 'Vì mọi bảng tra trong Tử Vi nói theo ngày, tháng, năm âm lịch — tháng âm dùng để định cung Mệnh, ngày âm dùng để định chỗ sao Tử Vi, năm âm cho ra can chi năm sinh',
        correct: true,
        note: 'Đúng — sai lịch là sai dây chuyền, không phải sai một chỗ.',
      },
      {
        text: 'Vì lịch âm chính xác hơn lịch dương',
        note: 'Không — đây không phải chuyện chính xác, mà là chuyện đơn vị. Tử Vi được viết bằng đơn vị âm lịch nên phải dịch sang trước.',
      },
      {
        text: 'Vì ngày âm quyết định giới tính âm dương của lá số',
        note: 'Không — âm dương ở đây tính theo can chi NĂM sinh kết hợp giới tính, và nó dùng để định chiều đại vận.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Hai người sinh cùng ngày, một người 9h30, một người 10h45. Lá số của họ ra sao?',
    choices: [
      {
        text: 'Giống hệt nhau — cả hai đều thuộc giờ Tỵ (9h–11h), mà lá số an theo canh giờ chứ không theo phút',
        correct: true,
        note: 'Đúng. Công cụ còn bỏ hẳn phần phút; điều đó không mất gì vì mọi ranh giới canh giờ rơi vào đầu giờ lẻ.',
      },
      {
        text: 'Khác nhau — chênh 75 phút là đủ đổi lá số',
        note: 'Không. Chênh bao nhiêu không quan trọng bằng việc có bước qua ranh giới canh giờ hay không.',
      },
      {
        text: 'Không xác định được nếu chưa biết nơi sinh',
        note: 'Không — công cụ không hỏi nơi sinh, nên nơi sinh không tham gia vào phép tính.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'open',
    prompt: `Người sinh ngày ${TET_TRAP_SOLAR.d}/${TET_TRAP_SOLAR.m}/${TET_TRAP_SOLAR.y} dương lịch thì can chi năm sinh lấy theo năm âm lịch nào? Vì sao đây là chỗ dễ sai nhất?`,
    answer: (
      <>
        Đổi ra lịch âm, ngày đó là {strong(`${TET_TRAP_LUNAR.day}/${TET_TRAP_LUNAR.month}`)} của{' '}
        {strong(`năm âm lịch ${TET_TRAP_LUNAR.year}`)} — tức vẫn còn trước Tết, nên can chi năm sinh
        là {strong(TET_TRAP_CANCHI)} chứ không phải can chi của năm dương lịch ghi trên giấy khai
        sinh. Đây là chỗ dễ sai nhất vì người ta quen lấy luôn năm dương lịch làm năm sinh; lệch năm
        âm là {strong('lệch can chi năm')}, kéo theo lệch Cục và lệch cả bộ Tứ Hóa gốc — tức lệch
        gần như nguyên lá số.
      </>
    ),
  },
  {
    id: 'q5',
    type: 'mcq',
    prompt: 'Trên lá số, cái gì cố định và cái gì thay đổi theo từng người?',
    choices: [
      {
        text: 'Vòng 12 địa chi (địa bàn) cố định; vị trí cung Mệnh trên vòng đó thay đổi, và 11 cung còn lại xếp theo Mệnh với thứ tự không đổi',
        correct: true,
        note: 'Đúng — nên câu hỏi cốt lõi của phần khung chỉ là “Mệnh rơi vào ô địa chi nào”.',
      },
      {
        text: 'Cung Mệnh luôn ở ô Tý, các sao mới là thứ di chuyển',
        note: 'Không — cung Mệnh có thể rơi vào bất kỳ ô nào trong 12 ô địa chi; engine trả riêng địa chi của cung Mệnh cho từng lá số.',
      },
      {
        text: 'Thứ tự 12 cung đổi theo giới tính',
        note: 'Không — thứ tự vòng cung không đổi. Giới tính (cùng âm dương năm sinh) quyết định CHIỀU đi của đại vận.',
      },
    ],
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt: 'Cung Thân có thể rơi vào bao nhiêu cung, và vì sao?',
    choices: [
      {
        text: 'Sáu cung, vì Mệnh và Thân đếm ngược chiều nhau theo giờ nên khoảng cách giữa chúng luôn là số chẵn ô',
        correct: true,
        note: 'Đúng — sáu cung đó là Mệnh, Phúc Đức, Quan Lộc, Thiên Di, Tài Bạch, Phu Thê.',
      },
      {
        text: 'Cả 12 cung, tuỳ ngày giờ sinh',
        note: 'Không — khoảng cách chẵn loại hẳn sáu cung ở vị trí lẻ.',
      },
      {
        text: 'Không cung nào — cung Thân là cung thứ 13 nằm riêng',
        note: 'Không. Trong dữ liệu, cung Thân là một cờ đánh dấu bật trên một trong 12 cung đã có, không phải cung thứ 13.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Độ sáng (miếu, vượng, đắc, hãm) từ đâu mà ra — và vì sao “hãm” không có nghĩa là xấu?',
    answer: (
      <>
        Nó là một {strong('thuộc tính được tính ra cùng lúc với việc an sao')}: mỗi sao ứng với mỗi ô
        địa chi có một bậc sáng cố định theo bảng, nên nó xuất hiện sẵn bên cạnh tên sao chứ không
        phải điểm ai chấm. Nó mô tả {strong('cường độ biểu hiện')} của sao ở vị trí đó, không phải
        điểm tốt xấu — nên sao hãm gặp cát tinh phụ trợ vẫn dùng được, sao miếu gặp sát tinh nặng vẫn
        trục trặc. Không phải sao nào cũng có độ sáng; nhiều phụ tinh không mang trường này.
      </>
    ),
  },
  {
    id: 'q8',
    type: 'open',
    prompt:
      'Hai người sinh cùng ngày, cùng canh giờ, cùng giới tính. Lá số của họ khác nhau ở điểm nào?',
    answer: (
      <>
        {strong('Không khác gì cả')} — lá số của họ giống nhau từng ô. Đây không phải lỗi của công
        cụ mà là {strong('giới hạn của chính hệ thống')}: nó chỉ nhận đúng ba dữ kiện về bạn, nên
        chỉ phân biệt được người ta tới mức đó. Hai người có lá số y hệt vẫn sống hai cuộc đời hoàn
        toàn khác nhau — và điều đó không hề mâu thuẫn với Tử Vi, chừng nào ta đọc lá số như một hệ
        biểu tượng để soi mình, không phải như một phép đo.
      </>
    ),
  },
];

export function LapLaSoRecall() {
  return <ActiveRecall topicId="lap-la-so" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được lập lá số là làm gì (đổi ngày giờ sinh thành một tấm bản đồ 12 cung theo bảng cố định) và nó KHÔNG làm gì (không đọc đời bạn, không phán số mệnh).',
  },
  {
    id: 'inputs',
    facet: 'Đầu vào',
    can: 'Kể đúng ba dữ kiện công cụ cần — ngày sinh dương lịch, giờ sinh, giới tính — và nói được nó KHÔNG hỏi nơi sinh, nên không hiệu chỉnh giờ theo kinh độ.',
  },
  {
    id: 'order',
    facet: 'Thứ tự',
    can: 'Đọc lại được sáu bước theo đúng thứ tự, và giải thích vì sao không được đảo: mỗi bước ăn kết quả của bước trước, nên sai một bước là hỏng mọi bước sau.',
  },
  {
    id: 'calendar',
    facet: 'Đổi lịch',
    can: 'Giải thích vì sao phải đổi sang âm lịch trước, và chỉ ra bẫy Tết: sinh tháng 1 hoặc đầu tháng 2 dương lịch có thể vẫn thuộc năm âm lịch trước.',
  },
  {
    id: 'hour',
    facet: 'Canh giờ',
    can: 'Nói được giờ sinh được quy về canh giờ 2 tiếng, nên chênh vài phút thường không đổi gì, nhưng bước qua ranh giới canh giờ là đổi cả lá số.',
  },
  {
    id: 'frame',
    facet: 'Khung & nhãn',
    can: 'Phân biệt được địa bàn 12 địa chi (cố định) với 12 cung (xoay theo cung Mệnh), và nói được vì sao định xong cung Mệnh là 11 cung còn lại tự có chỗ.',
  },
  {
    id: 'than',
    facet: 'Cung Thân',
    can: 'Giải thích vì sao cung Thân chỉ rơi vào sáu cung, và vì sao nó không phải cung thứ 13 mà là một dấu ghép chồng lên một cung có sẵn.',
  },
  {
    id: 'stars',
    facet: 'An sao',
    can: 'Nói được chính tinh không rải ngẫu nhiên mà đi thành hai chuỗi neo vào nhau, và vì sao chuyện có cung chứa nhiều sao còn cung không có sao nào là hệ quả tất yếu.',
  },
  {
    id: 'brightness',
    facet: 'Độ sáng',
    can: 'Nói đúng miếu, vượng, đắc, hãm là mô tả cường độ biểu hiện theo vị trí — được tính ra cùng lúc với an sao, không phải điểm tốt xấu ai chấm.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra được rằng hai người cùng ngày, cùng canh giờ, cùng giới tính sẽ có lá số giống hệt nhau — và nói thẳng điều đó nghĩa là gì.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho người thân trong một phút: lá số đi từ ngày giờ sinh tới tấm lưới 12 ô bằng cách nào, và phải kiểm gì trước khi kết luận “lá số sai” — giữ giọng “đây là tính toán”, không thần bí hoá.',
  },
];

export function LapLaSoChecklist() {
  return <UnderstandingChecklist topicId="lap-la-so" facets={FACETS} />;
}

export function LapLaSoWhys() {
  return (
    <FiveWhys
      topicId="lap-la-so"
      start={
        <>
          Một người vừa lập lá số lần đầu. Nhìn tấm lưới 12 ô dày đặc tên sao, họ kết luận: “máy đọc
          được đời tôi rồi” — và bắt đầu sợ những ô có chữ trông dữ.
        </>
      }
      chain={[
        {
          question: 'Vì sao “máy đọc được đời tôi” là một kết luận vội?',
          because: (
            <>
              Vì máy chưa hề nhận được thông tin nào về đời bạn. Nó chỉ nhận{' '}
              {strong('ba dữ kiện: ngày sinh dương lịch, giờ sinh, giới tính')} — không tên, không
              nơi sinh, không một chi tiết nào khác.
            </>
          ),
        },
        {
          question: 'Vậy từ ba dữ kiện đó, máy đã làm gì để ra tấm lưới kia?',
          because: (
            <>
              Một chuỗi phép đổi có thứ tự: đổi sang {strong('âm lịch')}, đổi giờ sang{' '}
              {strong('canh giờ')}, dựng khung 12 địa chi, định {strong('cung Mệnh')} rồi xếp 11
              cung còn lại, an chính tinh, gắn độ sáng và Tứ Hóa. Không bước nào cần biết gì về bạn
              ngoài ba con số ban đầu.
            </>
          ),
        },
        {
          question: 'Vì sao chuỗi phép đổi ấy không thể là một lời phán về bạn?',
          because: (
            <>
              Vì nó {strong('lặp lại được')} và {strong('không phân biệt được người')}. Ai nhập cùng
              ba dữ kiện cũng nhận về tấm lá số giống hệt — kể cả hai người xa lạ sống hai cuộc đời
              chẳng liên quan gì nhau.
            </>
          ),
        },
        {
          question: 'Nếu vậy thì tấm lá số còn để làm gì?',
          because: (
            <>
              Để làm {strong('một hệ biểu tượng có kỷ luật')}: nó cho bạn một bộ từ vựng và một tấm
              bản đồ để soi mình theo từng lĩnh vực, thay vì nghĩ lan man. Giá trị nằm ở{' '}
              {strong('câu hỏi nó gợi ra')}, không nằm ở lời tiên đoán — vì nó không tiên đoán gì
              cả.
            </>
          ),
        },
        {
          question: 'Hiểu tới đây thì nên làm gì với ô có chữ trông dữ?',
          because: (
            <>
              Đừng sợ nó, và cũng đừng vội đọc nó. Việc đúng là quay lại{' '}
              {strong('kiểm dữ liệu đầu vào trước')} — ngày âm có đúng không, nhất là nếu bạn sinh
              gần Tết; canh giờ có đúng không. Xong mới sang phần luận, và phần luận thì{' '}
              {strong('không bao giờ đọc một ô lẻ')}.
            </>
          ),
        },
      ]}
      root={
        <>
          Lập lá số là {strong('tính toán')}; đọc lá số là {strong('diễn giải')}. Trộn hai thứ là
          nguồn gốc của cả sự sợ hãi lẫn sự chế giễu quanh Tử Vi. Tách được chúng ra, bạn giữ được
          phần kiểm chứng được và vẫn tự do với phần còn lại — tham khảo, không phán định.
        </>
      }
    />
  );
}
