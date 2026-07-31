/**
 * Nội dung "học chủ động" cho trang /learn/tam-tai.
 *
 * GROUNDING (giống page.tsx — không thêm dữ kiện nào ngoài các nguồn này):
 *   - lib/tam-tai-data.ts  → 4 nhóm Tam Hợp, 3 địa chi năm Tam Tai của mỗi nhóm,
 *                            danh sách năm dương lịch 2024–2044, bộ FAQ gốc
 *                            ("ba con giáp cách nhau 4 năm", "cả nhóm cùng bước
 *                            vào 3 năm Tam Tai giống nhau", "không bán lễ giải
 *                            hạn").
 *   - lib/xem-tuoi-cuoi.ts → CHI, ANIMAL_BY_CHI, canChiOfYear(), TAM_TAI_YEARS.
 *   - app/tam-tai/**       → "Hiểu đúng về Tam Tai", nghĩa đen "ba tai", năm
 *                            "vào" – "giữa" – "ra", chu kỳ 12 năm, giọng tham
 *                            khảo (không hù doạ, không phán số mệnh).
 *
 * Các con số dương lịch nêu trong bài đều nằm trong cửa sổ tĩnh 2024–2044 mà lib
 * sinh ra, hoặc suy trực tiếp từ canChiOfYear. KHÔNG bịa thêm năm, thêm ý nghĩa.
 *
 * KHÔNG lấn sân bài khác: Kim Lâu, Hoang Ốc, sao hạn Cửu Diệu, tam hợp – lục
 * xung dạng hình học chỉ được nhắc tên, không giải thích cơ chế.
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

export function TamTaiFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Sắp có việc trọng đại — cưới hỏi, làm nhà, khai trương, đầu tư lớn — và bạn nghe ai đó nói{' '}
          {strong('“tuổi này đang Tam Tai”')}. Câu hỏi thật sự cần trả lời là: điều đó nghĩa là gì, và
          nó có đáng để hoãn cả kế hoạch không?
        </>
      }
      why={
        <>
          Tam Tai là một {strong('tập tục dân gian theo hệ Can Chi')}: cách người xưa đánh dấu vài năm
          trong đời để nhắc nhau chậm lại một nhịp trước việc lớn. Nó tồn tại như một nếp văn hoá, không
          phải một lời phán số mệnh.
        </>
      }
      what={
        <>
          12 con giáp chia thành {strong('4 nhóm tam hợp')}, mỗi nhóm 3 con giáp cách nhau 4 năm. Mỗi
          nhóm gánh {strong('3 năm Tam Tai liền nhau')} — dân gian gọi là năm “vào”, “giữa”, “ra” — rồi
          12 năm sau lặp lại. {strong('Không phải')} điềm gở cố định, cũng không phải lệnh cấm.
        </>
      }
      how={
        <>
          Đổi năm sinh dương lịch ra {strong('con giáp')} (địa chi), xem con giáp đó thuộc{' '}
          {strong('nhóm tam hợp')} nào, rồi đọc 3 địa chi năm Tam Tai của nhóm. Chỉ vậy — công cụ tự
          làm cả ba bước khi bạn nhập năm sinh.
        </>
      }
      soWhat={
        <>
          Để dùng đúng một lời nhắc {strong('“cân nhắc kỹ, chuẩn bị chu đáo”')} cho việc trọng đại — và
          để không sợ hãi hay tốn tiền “giải hạn” vì một cách chia mà lúc nào cũng có một phần tư số
          người đang mang nhãn.
        </>
      }
    />
  );
}

export function TamTaiDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="tam-tai"
        concept="Vì sao Tam Tai tra theo NHÓM tam hợp, không theo từng tuổi"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                12 con giáp được xếp vào {strong('4 cái rổ')}, mỗi rổ 3 con giáp. Tam Tai không hỏi
                “bạn là con gì” mà hỏi {strong('“bạn nằm trong rổ nào”')} — cả rổ cùng vào, cùng ra,
                giống như cả lớp cùng nghỉ hè một lúc chứ không ai nghỉ riêng.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Mỗi nhóm tam hợp gồm 3 con giáp {strong('cách nhau 4 năm')} theo vòng Can Chi. Bốn
                  nhóm đó là: Tý – Thìn – Thân; Sửu – Tỵ – Dậu; Dần – Ngọ – Tuất; Mão – Mùi – Hợi.
                </p>
                <p>
                  Theo quan niệm, cả ba con giáp trong một nhóm{' '}
                  {strong('cùng bước vào 3 năm Tam Tai giống hệt nhau')}. Vì thế bảng tra chỉ có 4
                  dòng cho 12 con giáp — biết mình ở nhóm nào là biết luôn 3 năm, không cần tra riêng
                  từng tuổi.
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
                  Nói theo ngôn ngữ dữ liệu: bảng Tam Tai là một ánh xạ từ{' '}
                  {strong('12 địa chi năm sinh')} sang chỉ {strong('4 bộ ba địa chi năm')}. Ba khoá
                  khác nhau (ba con giáp cùng nhóm) trỏ về đúng một giá trị — nên độ phân giải thật sự
                  của Tam Tai là 4, không phải 12.
                </p>
                <p>
                  Hệ quả cần nhớ khi đọc kết quả: hai người sinh cách nhau 4 hay 8 năm vẫn có chung bộ
                  ba năm Tam Tai. Nếu bạn thấy “tuổi tôi và tuổi anh ấy khác nhau mà sao cùng phạm một
                  lúc”, đó không phải lỗi của công cụ — đó chính là cấu trúc của cách tính.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tam-tai"
        concept="Vì sao đúng 3 năm — và vì sao 12 năm sau mới lặp lại"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Cái tên đã nói rồi: {strong('“Tam Tai” nghĩa là “ba tai”')} — ba năm. Và vì tên năm
                chạy vòng quanh theo 12 con giáp, đi hết một vòng 12 năm thì bộ ba năm ấy mới quay lại
                với rổ của bạn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Tam Tai xét theo {strong('địa chi của năm')}, mà vòng địa chi có đúng 12 con giáp.
                  Nên khi 3 năm Tam Tai của một nhóm trôi qua, phải đủ một vòng 12 năm thì đúng ba địa
                  chi ấy mới trở lại.
                </p>
                <p>
                  Ví dụ nhóm Dần – Ngọ – Tuất gặp Tam Tai vào các năm Thân, Dậu, Tuất: trong khoảng
                  2024–2044 đó là {strong('2028, 2029, 2030')} rồi {strong('2040, 2041, 2042')} — cách
                  nhau đúng 12 năm.
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
                  Con số 3 khớp trọn vẹn với cấu trúc:{' '}
                  {strong('4 nhóm × 3 năm = 12 = đúng một vòng địa chi')}. Bốn bộ ba năm Tam Tai không
                  chồng lên nhau và cũng không chừa năm nào: Dần–Mão–Thìn, Tỵ–Ngọ–Mùi, Thân–Dậu–Tuất,
                  Hợi–Tý–Sửu ghép lại vừa đủ 12 địa chi.
                </p>
                <p>
                  Hệ quả rất đáng suy nghĩ: {strong('năm nào cũng là năm Tam Tai của đúng một nhóm')}.
                  Không có năm “sạch” cho tất cả mọi người, và cũng không có năm mà nhiều hơn một nhóm
                  cùng phạm. Đây là quan sát rút thẳng từ bảng, không phải lời lý giải của phong tục —
                  tài liệu truyền lại không ghi vì sao mỗi nhóm nhận đúng bộ ba năm ấy.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tam-tai"
        concept="Năm “vào” – “giữa” – “ra”: nhãn nói gì và không nói gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Ba năm Tam Tai được gọi vui là năm {strong('vào')}, năm {strong('giữa')} và năm{' '}
                {strong('ra')} — giống như bước vào phòng, đứng trong phòng, rồi bước ra. Ba chữ đó chỉ
                cho biết {strong('đang ở đoạn nào')}, không nói năm nào đáng lo hơn năm nào.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Ba năm Tam Tai luôn đứng liền nhau theo thứ tự địa chi. Năm đầu tiên là năm “vào”,
                  năm thứ hai là năm “giữa”, năm thứ ba là năm “ra”. Ví dụ nhóm Sửu – Tỵ – Dậu gặp Tam
                  Tai vào Hợi (vào), Tý (giữa), Sửu (ra) — quy ra dương lịch là{' '}
                  {strong('2031, 2032, 2033')}.
                </p>
                <p>
                  Điều cần cẩn thận: ba nhãn này chỉ đánh dấu {strong('vị trí')} của năm trong đợt.
                  Cách tính mà hieu.asia dùng không gán mức nặng – nhẹ khác nhau cho từng năm, nên đừng
                  suy diễn thêm.
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
                  Trong dữ liệu, một nhóm chỉ có {strong('một danh sách 3 địa chi theo thứ tự')} — và
                  thứ tự ấy là toàn bộ ý nghĩa của “vào – giữa – ra”. Không có trường nào ghi mức độ,
                  không có trọng số, không có lời dặn riêng cho từng năm.
                </p>
                <p>
                  Vì vậy khi gặp một nguồn nói “năm vào nặng nhất” hay “năm ra mới đáng ngại”, hãy hiểu
                  đó là {strong('lớp diễn giải thêm')} của nguồn đó, không phải phần lõi của cách tính.
                  hieu.asia giữ đúng phần có căn cứ và nói rõ phần nào không có — đó là cách đọc phong
                  tục mà không bị dẫn dắt.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="tam-tai"
        concept="Vì sao “chia 12 con giáp vào 4 rổ” là một phép chia rất thô"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Tưởng tượng cả trường chỉ chia thành {strong('4 đội')}. Mỗi lần đến lượt, cả một đội
                cùng bị gọi tên — dù trong đội có bạn cao bạn thấp, bạn thích vẽ bạn thích đá bóng.
                Cách chia ấy nhanh và dễ nhớ, nhưng {strong('không nói được gì riêng')} về từng bạn.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Tam Tai chỉ dùng đúng {strong('một dữ kiện')}: con giáp của năm sinh. Không tháng,
                  không ngày, không giờ sinh, không hoàn cảnh sống. Rồi 12 con giáp lại gom tiếp vào 4
                  nhóm — nên hai người rất khác nhau vẫn nhận cùng một kết quả.
                </p>
                <p>
                  Và vì 4 nhóm phủ kín vòng 12 năm, {strong('lúc nào cũng có một phần tư số người')}{' '}
                  đang “trong Tam Tai”. Một nhãn mà 1/4 dân số luôn mang thì không thể là lời tiên đoán
                  riêng cho ai.
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
                  Đặt cạnh nhau cho dễ thấy: đầu vào là 1 biến rời rạc 12 giá trị, đầu ra là 1 nhãn nhị
                  phân (có / không) với {strong('tỷ lệ dương cố định 25%')} ở mọi năm. Không có tham số
                  nào khác để phân biệt người này với người kia.
                </p>
                <p>
                  Kết luận thực hành không phải là “vứt bỏ Tam Tai”, mà là{' '}
                  {strong('đặt nó đúng chỗ')}: dùng như một lời nhắc chung để chậm lại một nhịp trước
                  việc trọng đại, chứ không dùng như căn cứ để hoãn kế hoạch ba năm hay để chi tiền cho
                  lễ “giải hạn” — hieu.asia không bán những thứ đó.
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
    prompt: 'Tam Tai được tra dựa trên dữ kiện nào của một người, và cho ra kết quả gì?',
    answer: (
      <>
        Dựa trên đúng một dữ kiện: {strong('con giáp (địa chi) của năm sinh dương lịch')}. Từ con giáp
        suy ra {strong('nhóm tam hợp')} (3 con giáp cách nhau 4 năm), rồi từ nhóm đọc ra{' '}
        {strong('3 năm Tam Tai liền nhau')} của nhóm đó. Không xét tháng, ngày, giờ sinh hay giới tính.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Vì sao bảng tra Tam Tai chỉ có 4 dòng cho 12 con giáp?',
    choices: [
      {
        text: 'Vì chỉ có 4 con giáp là thật sự phạm Tam Tai, 8 con giáp còn lại thì không',
        note: 'Không — cả 12 con giáp đều có 3 năm Tam Tai, chỉ khác nhau ở chỗ rơi vào năm nào.',
      },
      {
        text: 'Vì 12 con giáp chia thành 4 nhóm tam hợp, và cả 3 con giáp trong một nhóm cùng bước vào 3 năm Tam Tai giống hệt nhau',
        correct: true,
        note: 'Đúng — Tam Tai tra theo nhóm, không theo từng tuổi; ba khoá cùng trỏ về một kết quả.',
      },
      {
        text: 'Vì bảng đã rút gọn cho dễ nhìn, tra đầy đủ vẫn phải xem 12 dòng riêng',
        note: 'Không — đây không phải rút gọn hiển thị; cách tính vốn chỉ phân biệt 4 nhóm.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'mcq',
    prompt: 'Tam Tai lặp lại theo chu kỳ bao nhiêu năm — và vì sao?',
    choices: [
      {
        text: '12 năm — vì Tam Tai xét theo địa chi của năm, mà vòng địa chi có đúng 12 con giáp',
        correct: true,
        note: 'Đúng — hết một vòng 12 năm thì đúng ba địa chi Tam Tai của nhóm mới trở lại.',
      },
      {
        text: '9 năm — vì tính theo tuổi mụ chia 9',
        note: 'Không — phép chia 9 thuộc hệ khác; Tam Tai chỉ xét địa chi năm.',
      },
      {
        text: '60 năm — vì theo vòng lục thập hoa giáp',
        note: 'Không — Tam Tai chỉ dùng vòng 12 địa chi, không dùng vòng 60 năm.',
      },
    ],
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Năm “vào”, năm “giữa”, năm “ra” cho biết điều gì?',
    choices: [
      {
        text: 'Năm “vào” là năm nặng nhất, năm “ra” đã nhẹ đi nhiều',
        note: 'Không — cách tính không gán mức nặng – nhẹ cho từng năm; đó là suy diễn thêm.',
      },
      {
        text: 'Chỉ cho biết năm đó đứng thứ nhất, thứ hai hay thứ ba trong đợt 3 năm',
        correct: true,
        note: 'Đúng — ba nhãn chỉ đánh dấu vị trí trong đợt, không nói gì về mức độ.',
      },
      {
        text: 'Cho biết nên kiêng việc gì trong từng năm cụ thể',
        note: 'Không — dữ liệu không kèm danh mục kiêng kỵ theo từng năm.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Vận dụng: bạn sinh năm 1990. Hãy tự lần lại ba bước để biết mình gặp Tam Tai vào những năm nào.',
    answer: (
      <>
        Bước 1: 1990 − 4 = 1986, chia 12 dư 6 → con giáp {strong('Ngọ')} (con Ngựa). Bước 2: tuổi Ngọ
        thuộc nhóm tam hợp {strong('Dần, Ngọ, Tuất')}. Bước 3: nhóm này gặp Tam Tai vào các năm{' '}
        {strong('Thân, Dậu, Tuất')} — quy ra dương lịch trong khoảng 2024–2044 là 2028, 2029, 2030 rồi
        2040, 2041, 2042.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt:
      'Trong bất kỳ một năm nào, khoảng bao nhiêu phần dân số được xem là “đang trong Tam Tai”?',
    choices: [
      {
        text: 'Một phần tư — vì 4 nhóm × 3 năm phủ trọn vòng 12 năm, nên năm nào cũng có đúng một nhóm (3 trong 12 con giáp) đang phạm',
        correct: true,
        note: 'Đúng — và chính con số này cho thấy Tam Tai là nhãn chung, không phải tiên đoán riêng.',
      },
      {
        text: 'Rất ít — chỉ những người sinh vào một số năm đặc biệt',
        note: 'Không — mọi con giáp đều có phần của mình trong vòng 12 năm.',
      },
      {
        text: 'Một nửa — vì mỗi nhóm gồm 6 con giáp',
        note: 'Không — mỗi nhóm tam hợp chỉ có 3 con giáp, tức một phần tư của 12.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Một người bạn định hoãn đám cưới suốt ba năm vì “đang Tam Tai”. Bạn sẽ nói lại thế nào cho đúng tinh thần phong tục?',
    answer: (
      <>
        Rằng Tam Tai là {strong('lời nhắc cân nhắc kỹ')}, không phải điềm gở cố định và cũng không phải
        lệnh cấm — nhiều người vẫn tiến hành việc trọng đại trong năm Tam Tai sau khi chuẩn bị chu đáo.
        Cách chia lại rất thô (chỉ dùng con giáp năm sinh, 12 con giáp gom vào 4 nhóm, lúc nào cũng có
        một phần tư số người đang mang nhãn). Nên điều đáng làm là chuẩn bị kỹ và quyết định tỉnh táo,{' '}
        {strong('không cần hoãn và cũng không cần mua lễ “giải hạn”')}.
      </>
    ),
  },
];

export function TamTaiRecall() {
  return <ActiveRecall topicId="tam-tai" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'problem',
    facet: 'Vấn đề',
    can: 'Nói được Tam Tai dùng để làm gì (lời nhắc chậm lại một nhịp trước việc trọng đại) — và nó KHÔNG hứa gì (không dự đoán may – rủi, không phải lệnh cấm).',
  },
  {
    id: 'mechanism',
    facet: 'Cơ chế',
    can: 'Mô tả đủ ba bước tra: năm sinh dương lịch → con giáp (địa chi) → nhóm tam hợp → 3 địa chi năm Tam Tai của nhóm.',
  },
  {
    id: 'components',
    facet: 'Thành phần',
    can: 'Kể được 4 nhóm tam hợp (Tý – Thìn – Thân; Sửu – Tỵ – Dậu; Dần – Ngọ – Tuất; Mão – Mùi – Hợi) và biết mỗi nhóm ứng với 3 năm Tam Tai liền nhau.',
  },
  {
    id: 'discrimination',
    facet: 'Phân biệt',
    can: 'Giải thích được vì sao Tam Tai tra theo NHÓM chứ không theo từng tuổi, và vì sao hai người sinh cách nhau 4 hay 8 năm lại cùng phạm một lúc.',
  },
  {
    id: 'cycle',
    facet: 'Nhịp thời gian',
    can: 'Nói được vì sao mỗi đợt kéo dài đúng 3 năm và vì sao phải 12 năm sau mới lặp lại; hiểu “vào – giữa – ra” chỉ là vị trí trong đợt.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Chỉ ra Tam Tai chỉ dùng một dữ kiện duy nhất (con giáp năm sinh), và ở bất kỳ năm nào cũng luôn có một phần tư số người đang mang nhãn này.',
  },
  {
    id: 'guard',
    facet: 'Tránh ngộ nhận',
    can: 'Nói được vì sao không cần hoãn hết việc lớn suốt ba năm và vì sao không cần tốn tiền mua lễ “giải hạn”.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giảng lại cho một người thân “Tam Tai là gì, tra thế nào, nên hiểu ra sao” bằng lời của bạn, giữ giọng tham khảo — không doạ.',
  },
  {
    id: 'metacognition',
    facet: 'Tự biết chỗ hổng',
    can: 'Chỉ ra được phần nào bạn vẫn còn mơ hồ (ví dụ cách đổi năm sinh ra con giáp, hay vì sao mỗi nhóm nhận đúng bộ ba năm ấy — điều mà tài liệu truyền lại không ghi lý do).',
  },
];

export function TamTaiChecklist() {
  return <UnderstandingChecklist topicId="tam-tai" facets={FACETS} />;
}

export function TamTaiWhys() {
  return (
    <FiveWhys
      topicId="tam-tai"
      start={
        <>
          Một cặp đôi tra thấy tuổi mình “đang Tam Tai”, liền tính hoãn đám cưới thêm ba năm cho qua
          hạn, đồng thời hỏi nhau nên làm lễ “giải hạn” ở đâu.
        </>
      }
      chain={[
        {
          question: 'Vì sao hoãn ba năm và tìm lễ “giải hạn” là phản ứng chưa hợp lý?',
          because: (
            <>
              Vì Tam Tai {strong('không phải điềm gở cố định')} và cũng không phải lệnh cấm — nhiều
              người vẫn tiến hành việc trọng đại trong năm Tam Tai sau khi cân nhắc kỹ và chuẩn bị chu
              đáo.
            </>
          ),
        },
        {
          question: 'Vì sao nó chỉ là lời nhắc, không phải một dự báo?',
          because: (
            <>
              Vì cách tra chỉ dùng đúng {strong('một dữ kiện')}: con giáp của năm sinh. Không tháng,
              không ngày, không giờ sinh, không hoàn cảnh riêng của ai.
            </>
          ),
        },
        {
          question: 'Vì sao một dữ kiện duy nhất lại khiến kết quả trở nên rất thô?',
          because: (
            <>
              Vì 12 con giáp còn được gom tiếp vào {strong('4 nhóm tam hợp')} — cả ba con giáp trong
              một nhóm nhận chung một bộ ba năm, nên hai người rất khác nhau vẫn ra cùng một kết quả.
            </>
          ),
        },
        {
          question: 'Vì sao cách chia 4 nhóm cho thấy đây không thể là lời tiên đoán riêng cho ai?',
          because: (
            <>
              Vì 4 nhóm × 3 năm phủ trọn vòng 12 năm, nên {strong('năm nào cũng có đúng một nhóm')}{' '}
              đang trong Tam Tai — tức lúc nào cũng có một phần tư số người mang nhãn này.
            </>
          ),
        },
        {
          question: 'Vì sao hiểu điều đó lại đổi cách ta nên phản ứng?',
          because: (
            <>
              Vì thứ thật sự quyết định kết quả của một việc lớn là{' '}
              {strong('chuẩn bị kỹ và quyết định tỉnh táo')}, không phải hoãn cho qua một nhãn chung —
              càng không phải tốn tiền “giải” nó. hieu.asia không bán lễ “giải hạn”.
            </>
          ),
        },
      ]}
      root={
        <>
          Tam Tai là một nếp văn hoá đánh dấu nhịp 3-năm-trong-mỗi-12-năm của từng nhóm tam hợp, để
          nhắc nhau chậm lại một nhịp trước việc trọng đại. Giữ lấy phần lời nhắc ấy, bỏ đi phần lo sợ:{' '}
          {strong('tham khảo, không phán định')}.
        </>
      }
    />
  );
}
