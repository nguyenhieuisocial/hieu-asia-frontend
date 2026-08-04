/**
 * Nội dung "học chủ động" cho trang /learn/hieu-nguoi-than — bài Học CHÍNH THỨC
 * của công cụ /family-profiles.
 *
 * GROUNDING — nguồn duy nhất là chính công cụ đích, đọc HẾT trước khi viết:
 *   • app/family-profiles/page.tsx — TOÀN BỘ trang, không có component con nào
 *     khác (thư mục chỉ có đúng page.tsx). Trang này là SERVER component TĨNH:
 *     không có ô nhập, không có form, không gọi API, không đọc/ghi dữ liệu.
 *     Nội dung gồm: banner cảnh báo "KHÔNG luận sâu lá số người thân khi chưa
 *     có sự đồng ý của họ"; mảng STEPS mô tả BA bước dự kiến; mảng
 *     PRIVACY_BULLETS gồm BỐN cam kết riêng tư; mảng DEMO_PROFILES gồm BA thẻ
 *     minh hoạ (Cha / Mẹ / Vợ-Chồng) mà mỗi thẻ đều kèm câu "Tính năng đang
 *     phát triển"; và BA nút dẫn sang /xem-hop-nhom, /compatibility,
 *     /onboarding/topic.
 *   • lib/site-registry.ts — TOOL_REGISTRY (mục '/family-profiles': catalog.name,
 *     catalog.desc, relatedLabel) và RELATED_TOOLS['/family-profiles'].
 *     IMPORT rồi render, không gõ tay — công cụ đổi tên/mô tả thì bài đổi theo.
 *
 * VÌ SAO CÒN CHỖ PHẢI GÕ TAY: STEPS / PRIVACY_BULLETS / DEMO_PROFILES trong
 * family-profiles/page.tsx là hằng cục bộ, KHÔNG export, mà bài này chỉ được tạo
 * 2 file nên không sửa file công cụ để export. Vì vậy phần mô tả ba bước, bốn
 * cam kết và cụm chữ trích từ thẻ minh hoạ ("nhạy cảm với không khí gia đình")
 * là chép nguyên văn/tóm ý từ file đó — kiểm lại khi công cụ thay đổi.
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ (đọc code, không đoán): HÔM NAY nó KHÔNG lưu gì, KHÔNG
 * tính gì, KHÔNG nhận đầu vào nào. Nó là trang giới thiệu một tính năng đang
 * phát triển. Ba hồ sơ trên trang là chữ viết sẵn, không phải kết quả tính. Mọi
 * câu về "hồ sơ sẽ có gì" trong bài đều được nói ở thì DỰ KIẾN, đúng như trang
 * tự mô tả.
 *
 * PHẠM VI — KHÔNG lấn bài khác: điểm hợp giữa HAI người thuộc /learn/hop-doi,
 * hợp cả NHÓM 3–6 người thuộc /learn/dong-nhom — hai trang đó ĐÃ tồn tại, nên
 * page.tsx nêu ranh giới rồi link sang, không mô tả lại. Chọn năm sinh cho con
 * và đối chiếu mệnh bố mẹ thuộc bài Sinh con → không nhắc nội dung.
 *
 * Giọng: trung thực về giới hạn, không doạ, không phán số mệnh, không mỉa mai
 * người đọc. Lõi đạo đức là "phối hợp, không dán nhãn".
 */

import * as React from 'react';
import Link from 'next/link';
import { LearnFrame } from '@/components/learn/active/LearnFrame';
import { DepthTabs } from '@/components/learn/active/DepthTabs';
import { FiveWhys } from '@/components/learn/active/FiveWhys';
import { ActiveRecall, type RecallQuestion } from '@/components/learn/active/ActiveRecall';
import {
  UnderstandingChecklist,
  type UnderstandingFacet,
} from '@/components/learn/active/UnderstandingChecklist';
import { TOOL_REGISTRY, RELATED_TOOLS, type RelatedLink } from '@/lib/site-registry';

const strong = (s: string) => <strong className="text-foreground">{s}</strong>;
const A = 'text-gold-700 underline-offset-4 hover:underline';

// ── Dữ kiện đọc thẳng từ sổ đăng ký công cụ (không gõ tay) ───────────────────

/** Route của công cụ đích. */
export const TOOL_HREF = '/family-profiles';

const TOOL_ENTRY = TOOL_REGISTRY.find((e) => e.href === TOOL_HREF);

/** Tên công cụ đúng như catalog /cong-cu hiển thị. */
export const TOOL_NAME = TOOL_ENTRY?.catalog?.name ?? 'Hồ sơ gia đình';

/** Mô tả công cụ tự khai trong catalog. */
export const TOOL_DESC = TOOL_ENTRY?.catalog?.desc ?? '';

/** Nhãn dùng khi công cụ này xuất hiện như một link liên quan ở nơi khác. */
export const TOOL_LABEL = TOOL_ENTRY?.relatedLabel ?? 'Hồ sơ gia đình';

/** Các công cụ mà chính /family-profiles khai là liên quan tới nó. */
export const TOOL_RELATED: RelatedLink[] = RELATED_TOOLS[TOOL_HREF] ?? [];

/**
 * Cụm chữ trích nguyên văn từ thẻ minh hoạ "Mẹ" trên trang công cụ. Dùng làm ví
 * dụ chạy xuyên bài để mọi lập luận đều bám vào chữ THẬT của công cụ, không phải
 * chữ do bài này nghĩ ra.
 */
export const DEMO_PHRASE = 'nhạy cảm với không khí gia đình';

export function HieuNguoiThanFrame() {
  return (
    <LearnFrame
      problem={
        <>
          Bạn vừa đọc một dòng mô tả về mẹ, về chồng, hay về đứa con của mình — và không biết nên
          làm gì tiếp. Nói lại cho họ nghe? Giữ trong đầu? Từ hôm nay nhìn họ khác đi? Không ai chỉ
          bạn cách xử lý một mô tả về {strong('người khác')}, trong khi mọi hướng dẫn đọc lá số đều
          mặc định bạn đang đọc về chính mình.
        </>
      }
      why={
        <>
          Vì đọc cho người khác lệch hẳn về mặt {strong('quyền')}. Bạn đọc cho mình thì bạn vừa là
          người mô tả vừa là người bị mô tả, sai thì bạn tự sửa. Đọc cho người thân thì người bị mô
          tả {strong('không biết, không đọc được, không cãi được')} — mọi cơ chế tự sửa đều bị cắt.
        </>
      }
      what={
        <>
          Một hồ sơ người thân là vài dòng suy từ ngày sinh và tên gọi. Nó là một{' '}
          {strong('giả thuyết về cách nói chuyện')}, không phải một kết luận về con người. Và ở thời
          điểm này, trang {TOOL_NAME} còn chưa chạy: nó mô tả tính năng sắp có, chưa nhận và chưa lưu
          dữ liệu của ai.
        </>
      }
      how={
        <>
          Ranh giới nằm ở chỗ hồ sơ làm đổi hành vi của {strong('ai')}. Dùng để phối hợp thì nó đổi
          cách BẠN mở lời, chọn lúc, nói bao nhiêu — và bạn kiểm được ngay trong tuần này. Dùng để
          dán nhãn thì nó đổi cách bạn {strong('nhìn')} người kia, đóng khung họ vào một câu không
          thể sai.
        </>
      }
      soWhat={
        <>
          Để bạn giữ được cái lợi thật — bớt vài cuộc cãi vã không đáng — mà không trả cái giá thật:
          một người bị rút gọn thành một nhãn, hoặc một đứa trẻ lớn lên bên trong cái nhãn người lớn
          gán cho nó. Và để bạn nhớ hỏi một câu rất đơn giản trước khi lưu ngày sinh của người khác.
        </>
      }
    />
  );
}

export function HieuNguoiThanDepth() {
  return (
    <div className="space-y-6">
      <DepthTabs
        topicId="hieu-nguoi-than"
        concept="Một hồ sơ người thân thực chất chứa gì"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Trang này ghi mấy dòng về người nhà mình, đoán ra từ{' '}
                {strong('ngày sinh')} của họ. Giống như đoán bạn cùng lớp thích gì chỉ dựa vào sinh
                nhật của bạn ấy. Có thể vui, nhưng muốn biết bạn ấy thật sự thích gì thì vẫn phải{' '}
                {strong('hỏi')}.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Theo mô tả của chính trang công cụ, bạn nhập {strong('ngày sinh và tên gọi')} (tên
                  gọi thôi, không cần tên thật) của một người trong nhà. Hệ thống dự kiến dựng một hồ
                  sơ cơ bản — con giáp, ngũ hành, vài dòng tính cách tổng quát — rồi ghép với lá số
                  của bạn để gợi ý cách nói chuyện.
                </p>
                <p>
                  Chú ý cái không có trong danh sách đó: hệ thống{' '}
                  {strong('không hỏi người kia câu nào')} và không quan sát họ ngày nào. Nên thứ bạn
                  đọc được suy từ một con số trên lịch, chứ không suy từ con người đang sống cùng
                  bạn.
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
                  Đầu vào chỉ có ngày sinh, mà hai thứ trang hứa — con giáp và ngũ hành — lại lấy
                  theo NĂM sinh: ba thẻ minh hoạ trên trang ghi “Tuổi Quý Mão”, “Tuổi Bính Ngọ”,
                  “Tuổi Mậu Thìn”, đều là can chi của năm. Nên{' '}
                  {strong('mọi người sinh cùng năm nhận cùng một mô tả')}: độ phân giải thật của hồ
                  sơ nhiều nhất là 60 ô của một vòng hoa giáp, chứ không phải từng ngày — còn khoảng
                  khác biệt giữa hai người bất kỳ trong cùng một ô thì không có gì thu hẹp lại. Giá
                  trị khả dĩ của hồ sơ vì thế nằm ở chỗ nó {strong('đặt câu hỏi')}, không nằm ở chỗ
                  nó trả lời.
                </p>
                <p>
                  Và một sự thật quan trọng hơn mọi lý luận trên: hôm nay trang{' '}
                  {TOOL_NAME} {strong('chưa chạy')}. Nó không có ô nhập, không gọi API, không lưu gì.
                  Ba thẻ hồ sơ hiển thị trên đó là chữ viết sẵn để minh hoạ giao diện, không phải kết
                  quả tính cho ai cả.
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="hieu-nguoi-than"
        concept="Phối hợp và dán nhãn — khác nhau ở chỗ nào"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Có hai cách dùng. Cách thứ nhất: “mẹ hay lo, vậy mình gọi về sớm cho mẹ đỡ lo” —{' '}
                {strong('mình làm khác đi')}. Cách thứ hai: “mẹ hay lo lắm, nói gì cũng vậy thôi” —{' '}
                {strong('mình dán cho mẹ một cái nhãn')} rồi thôi không nghe nữa. Cách một giúp
                được, cách hai thì không.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Cùng một dòng chữ, hai cách dùng ngược nhau. Dùng để{' '}
                  {strong('phối hợp')} là bạn đổi hành vi của mình: nói gọn hơn, chọn lúc khác, cho
                  người kia thêm thời gian. Dùng để {strong('dán nhãn')} là bạn đổi cách nhìn người
                  kia mà không đổi việc mình định làm — có chăng chỉ là hỏi ít đi và nghe ít đi.
                </p>
                <p>
                  Ba dấu hiệu bạn đang dán nhãn: mọi hành vi của người kia đều được quy về một câu;
                  cái nhãn được dùng để {strong('kết thúc')} một cuộc nói chuyện chứ không mở nó ra;
                  và cái nhãn không bao giờ sai — người kia im lặng cũng khớp, nói nhiều cũng khớp.
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
                  Phép phân biệt gọn nhất là {strong('tính khả sai')}. Dùng để phối hợp thì bạn sinh
                  ra một dự đoán có thể sai và kiểm được trong tuần này: “nếu mình nói gọn lại, bố sẽ
                  bớt ngắt lời”. Thử, rồi nhìn kết quả. Sai thì bỏ giả thuyết.
                </p>
                <p>
                  Dùng để dán nhãn thì bạn sinh ra một lời giải thích{' '}
                  {strong('không thể sai')}, nên nó không mang thông tin nào — nó chỉ đổi cảm giác
                  của bạn về người kia. Hai biến thể hay gặp và đều tệ như nhau: nhãn dùng để{' '}
                  {strong('phán xét')} (“tuổi đó là vậy đó”) và nhãn dùng để{' '}
                  {strong('bào chữa')} (“tại mệnh anh vậy nên anh mới cáu”).
                </p>
              </>
            ),
          },
        ]}
      />

      <DepthTabs
        topicId="hieu-nguoi-than"
        concept="Vì sao với trẻ con thì mức rủi ro khác hẳn"
        levels={[
          {
            id: 'eli5',
            label: 'Trẻ 5 tuổi',
            content: (
              <p>
                Nếu người lớn cứ nói “bé này nhát lắm”, thì bé sẽ tin là mình nhát thật, và người lớn
                cũng ít cho bé thử những việc mới. Thế là câu nói đó{' '}
                {strong('tự biến thành sự thật')} — dù lúc đầu nó chỉ là một câu đoán.
              </p>
            ),
          },
          {
            id: 'eli14',
            label: 'Người 14 tuổi',
            content: (
              <>
                <p>
                  Có ba lý do khiến trẻ con là trường hợp riêng. Thứ nhất,{' '}
                  {strong('lời tiên tri tự ứng nghiệm')}: đứa trẻ nghe mô tả về mình rồi hành xử theo
                  mô tả đó, còn người lớn thì giao ít cơ hội hơn cho cái nhãn — hai chiều khớp nhau
                  thành một vòng khép kín.
                </p>
                <p>
                  Thứ hai, trẻ {strong('chưa định hình')}: cách một đứa trẻ phản ứng còn đang thay
                  đổi theo tuổi, nên mọi mô tả tính cách ở trẻ đều kém ổn định hơn ở người lớn — mô
                  tả đúng hôm nay có thể sai hẳn vài năm sau. Thứ ba, trẻ{' '}
                  {strong('chưa tự đồng ý được')}: người lớn quyết hộ, nên chuẩn phải cao hơn chứ
                  không thấp hơn.
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
                  Cơ chế này không cần huyền học mới có: nó y hệt cơ chế của nhãn “dốt toán” trong
                  lớp học. Nhưng nhãn suy từ ngày sinh thêm một tầng khó gỡ, vì{' '}
                  {strong('nguồn của nó là một dữ kiện không đổi')}. Đứa trẻ có thể chứng minh mình
                  làm được một bài toán khó, nhưng không thể chứng minh mình không sinh vào ngày đó.
                </p>
                <p>
                  Hệ quả thực hành: với trẻ, hãy hạ hồ sơ xuống mức thấp nhất — dùng để{' '}
                  {strong('nhắc mình kiên nhẫn hơn')}, không bao giờ để mô tả đứa trẻ trước mặt nó,
                  trước mặt họ hàng, hay trong nhóm chat gia đình. Nếu một dòng nào đó khiến bạn định
                  giảm kỳ vọng dành cho con, thì đó chính là lúc phải bỏ dòng đó đi.
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
    prompt: `Hôm nay trang ${TOOL_NAME} thật sự lưu và hiển thị những gì?`,
    answer: (
      <>
        Hôm nay nó {strong('không lưu gì và không tính gì')}. Trang không có ô nhập, không gọi máy
        chủ, không tạo hồ sơ nào. Thứ nó hiển thị là mô tả một tính năng đang phát triển: ba bước dự
        kiến, bốn cam kết riêng tư, và ba thẻ hồ sơ minh hoạ bằng chữ viết sẵn. Mọi câu về “hồ sơ sẽ
        có con giáp, ngũ hành, vài dòng tính cách” đều là dự kiến, không phải thứ đang chạy.
      </>
    ),
  },
  {
    id: 'q2',
    type: 'mcq',
    prompt: 'Đâu là dấu hiệu rõ nhất cho thấy bạn đang DÁN NHÃN chứ không phải phối hợp?',
    choices: [
      {
        text: 'Bạn thấy mô tả đó khớp với rất nhiều kỷ niệm về người kia',
        note: 'Chưa đủ để kết luận — nhưng cũng không phải bằng chứng cho điều ngược lại: bạn có hàng chục năm ký ức nên tìm được ví dụ khớp với gần như mọi mô tả.',
      },
      {
        text: 'Cái nhãn giải thích được cả hành vi đó lẫn hành vi ngược lại, nên không có cách nào cho thấy nó sai',
        correct: true,
        note: 'Đúng. Một câu không thể sai thì không mang thông tin — nó chỉ đổi cảm giác của bạn về người kia.',
      },
      {
        text: 'Bạn đổi cách mở lời với người kia sau khi đọc',
        note: 'Đó lại là dấu hiệu của phối hợp: bạn đổi hành vi của chính mình và có thể kiểm xem cách mới có hiệu quả hơn không.',
      },
    ],
  },
  {
    id: 'q3',
    type: 'open',
    prompt:
      'Bạn đọc được dòng mô tả rằng mẹ bạn “nhạy cảm với không khí gia đình”. Nêu một cách dùng để PHỐI HỢP và một cách dùng để DÁN NHÃN.',
    answer: (
      <>
        Phối hợp: “có thể mẹ để ý không khí trong nhà nhiều hơn mình tưởng — tối nay mình hỏi mẹ thấy
        thế nào trước, rồi mới bàn chuyện tiền.” Bạn đổi{' '}
        {strong('thứ tự và cách mở lời của mình')}, rồi xem có dễ nói chuyện hơn không. Dán nhãn:
        “mẹ nhạy cảm lắm, nói gì cũng suy diễn” — câu này {strong('kết thúc')} cuộc nói chuyện, và
        từ đó mọi phản ứng của mẹ đều bị bạn đọc qua cái nhãn ấy.
      </>
    ),
  },
  {
    id: 'q4',
    type: 'mcq',
    prompt: 'Vì sao dán nhãn cho một đứa trẻ nguy hiểm hơn dán nhãn cho người lớn?',
    choices: [
      {
        text: 'Vì trẻ con không quan tâm tới huyền học nên nghe gì tin nấy',
        note: 'Không phải chuyện tin hay không tin huyền học. Vấn đề là nhãn được người lớn lặp lại và được dùng để phân phối cơ hội cho đứa trẻ.',
      },
      {
        text: 'Vì lá số của trẻ khó lập chính xác hơn lá số người lớn',
        note: 'Không — phép lập không khác gì. Cái khác nằm ở hậu quả của cái nhãn, không nằm ở phép tính.',
      },
      {
        text: 'Vì nhãn dễ thành lời tiên tri tự ứng nghiệm, tính cách trẻ còn đang thay đổi, và trẻ chưa tự đồng ý được',
        correct: true,
        note: 'Đúng — ba lý do cộng lại. Đứa trẻ vừa hành xử theo mô tả, vừa nhận ít cơ hội hơn từ người lớn, mà lại không có tiếng nói nào trong việc mình bị mô tả.',
      },
    ],
  },
  {
    id: 'q5',
    type: 'open',
    prompt:
      'Bạn muốn lưu ngày sinh của bố mẹ vào một công cụ xem tử vi. Bạn cần làm gì trước, và vì sao?',
    answer: (
      <>
        Hỏi họ một câu, bằng lời thường: “con định lưu ngày sinh của bố mẹ vào một trang xem tử vi để
        xem cho vui, bố mẹ có ngại không?”. Vì{' '}
        {strong('ngày sinh là dữ liệu cá nhân của họ, không phải của bạn')} — bạn chỉ tình cờ biết.
        Chính trang công cụ cũng đặt cảnh báo ngay đầu trang là không luận sâu lá số người thân khi
        chưa có sự đồng ý của họ. Nếu họ không muốn thì thôi; nếu họ muốn xem kỹ hơn thì mời họ tự
        lập hồ sơ của chính mình.
      </>
    ),
  },
  {
    id: 'q6',
    type: 'mcq',
    prompt:
      'Bốn cam kết riêng tư trên trang công cụ (chỉ lưu trong tài khoản bạn, chỉ phân tích cơ bản, xoá được bất cứ lúc nào, mời người kia tự lập hồ sơ) bảo vệ được tới đâu?',
    choices: [
      {
        text: 'Chúng ràng buộc HỆ THỐNG, không ràng buộc bạn — người kể lại nội dung hồ sơ cho họ hàng vẫn là bạn',
        correct: true,
        note: 'Đúng. Chỗ rò rỉ thường gặp nhất không phải máy chủ mà là bữa cơm và nhóm chat gia đình.',
      },
      {
        text: 'Chúng đảm bảo hồ sơ không bao giờ sai vì dữ liệu được giữ kín',
        note: 'Riêng tư và chính xác là hai chuyện khác nhau. Giữ kín một mô tả sai vẫn là giữ một mô tả sai.',
      },
      {
        text: 'Chúng thay được việc hỏi ý người thân, vì đằng nào dữ liệu cũng an toàn',
        note: 'Ngược lại — chính trang đó đặt banner cảnh báo phải có sự đồng ý. Cam kết kỹ thuật không thay được một câu hỏi giữa người với người.',
      },
    ],
  },
  {
    id: 'q7',
    type: 'open',
    prompt:
      'Vận dụng: sau khi đọc hồ sơ của chồng/vợ, bạn định nói lại cho họ nghe. Một câu NÊN nói và một câu KHÔNG nên nói là gì?',
    answer: (
      <>
        Nên: “em thấy mỗi lần mình bàn chuyện lớn mà anh phải quyết ngay thì hay căng. Lần sau em nêu
        trước rồi để anh nghĩ tới tối, được không?” — mô tả{' '}
        {strong('quan sát của bạn')} và đề nghị một cách làm, người kia gật hay lắc đều được. Không
        nên: “em xem hồ sơ của anh rồi, anh đúng kiểu người cần không gian riêng, nên anh mới lạnh
        nhạt” — câu này {strong('kết luận thay cho người kia')} và mượn một bảng tra để làm chỗ dựa
        cho phán xét.
      </>
    ),
  },
];

export function HieuNguoiThanRecall() {
  return <ActiveRecall topicId="hieu-nguoi-than" questions={RECALL_QUESTIONS} />;
}

const FACETS: UnderstandingFacet[] = [
  {
    id: 'tool-scope',
    facet: 'Công cụ làm gì',
    can: `Nói đúng hiện trạng: trang ${TOOL_NAME} chưa nhận đầu vào, chưa lưu và chưa tính gì — nó mô tả ba bước dự kiến, bốn cam kết riêng tư và ba thẻ hồ sơ viết sẵn để minh hoạ.`,
  },
  {
    id: 'definition',
    facet: 'Định nghĩa',
    can: 'Diễn đạt được rằng một hồ sơ người thân là giả thuyết về cách nói chuyện, không phải kết luận về con người — và biết vì sao cách gọi tên ấy đổi toàn bộ cách dùng.',
  },
  {
    id: 'distinction',
    facet: 'Phân biệt',
    can: 'Chỉ ra khác biệt giữa dùng để phối hợp (đổi hành vi của mình, có thể kiểm) và dùng để dán nhãn (đóng khung người kia bằng một câu không thể sai).',
  },
  {
    id: 'labels-two-faces',
    facet: 'Hai mặt của nhãn',
    can: 'Nhận ra nhãn có thể dùng để phán xét người khác lẫn để bào chữa cho chính mình, và cả hai đều là dán nhãn dù nghe rất khác nhau.',
  },
  {
    id: 'children',
    facet: 'Trẻ con',
    can: 'Giải thích ba lý do khiến trẻ là trường hợp riêng: vòng lặp tự ứng nghiệm, tính cách chưa định hình, và việc trẻ chưa tự đồng ý được.',
  },
  {
    id: 'privacy',
    facet: 'Quyền riêng tư',
    can: 'Nói được vì sao lưu hồ sơ người thân là lưu dữ liệu của người khác, và hỏi được một câu xin phép bằng lời thường, không lên gân.',
  },
  {
    id: 'speech',
    facet: 'Lời nói',
    can: 'Đưa ra được vài câu nên nói và vài câu không nên nói sau khi xem hồ sơ, và giải thích vì sao câu mô tả quan sát an toàn hơn câu kết luận về con người.',
  },
  {
    id: 'why-it-feels-true',
    facet: 'Vì sao thấy đúng',
    can: 'Chỉ ra vì sao mô tả về người mình quen lại càng dễ thấy “đúng ghê”: bạn có sẵn kho ký ức để tìm ví dụ khớp với gần như mọi mô tả.',
  },
  {
    id: 'boundary',
    facet: 'Ranh giới',
    can: 'Biết những việc không được dùng hồ sơ để làm: chẩn đoán tâm lý cho người thân, quyết định thay họ, hay dùng làm bằng chứng trong một cuộc tranh cãi.',
  },
  {
    id: 'teach-back',
    facet: 'Dạy lại',
    can: 'Giải thích cho một người trong nhà trong một phút: hồ sơ này dùng để làm gì, không dùng để làm gì, và vì sao bạn hỏi ý họ trước khi lưu ngày sinh.',
  },
];

export function HieuNguoiThanChecklist() {
  return <UnderstandingChecklist topicId="hieu-nguoi-than" facets={FACETS} />;
}

export function HieuNguoiThanWhys() {
  return (
    <FiveWhys
      topicId="hieu-nguoi-than"
      start={
        <>
          Một người mở hồ sơ của mẹ và đọc thấy dòng “{DEMO_PHRASE}”. Từ hôm đó, mỗi lần mẹ góp ý
          chuyện gì, người ấy nghĩ ngay “mẹ lại nhạy cảm rồi” — và không còn nghe nội dung mẹ nói
          nữa.
        </>
      }
      chain={[
        {
          question: 'Vì sao một dòng mô tả lại đủ sức đổi cách nghe?',
          because: (
            <>
              Vì nó đưa ra một {strong('lời giải thích gọn')} cho thứ vốn rối. Quan hệ trong nhà có
              hàng trăm nguyên nhân chồng lên nhau; một câu năm chữ gom hết lại thành một nguyên
              nhân duy nhất. Bộ não thích lời giải thích gọn hơn lời giải thích đúng, nhất là lúc
              đang mệt.
            </>
          ),
        },
        {
          question: 'Vì sao lời giải thích ấy nghe thuyết phục đến vậy?',
          because: (
            <>
              Vì bạn sống cùng người đó hàng chục năm. Kho ký ức của bạn đủ lớn để tìm ra ví dụ khớp
              với {strong('gần như mọi mô tả')} — và bạn chỉ nhớ những lần khớp. Đây là hiệu ứng
              Barnum ở dạng nặng hơn: đọc cho người lạ còn thiếu dữ liệu để tự thuyết phục, đọc cho
              người thân thì không bao giờ thiếu.{' '}
              <Link href="/learn/barnum" className={A}>
                Bài Hiệu ứng Barnum
              </Link>{' '}
              nói kỹ cơ chế này.
            </>
          ),
        },
        {
          question: 'Vì sao càng thấy khớp lại càng nguy?',
          because: (
            <>
              Vì mỗi lần khớp, bạn {strong('ngừng hỏi thêm một chút')}. Cái nhãn dần thay thế việc
              quan sát: bạn không còn để ý hôm nay mẹ nói gì, chỉ để ý mẹ đang “nhạy cảm” hay không.
              Đến một lúc, bạn phản ứng với cái nhãn chứ không phản ứng với người.
            </>
          ),
        },
        {
          question: 'Vì sao người kia không sửa lại được?',
          because: (
            <>
              Vì họ {strong('không biết cái nhãn tồn tại')}. Nó nằm trong đầu bạn — và nếu sau này
              có hồ sơ thật thì hồ sơ cũng nằm trong tài khoản của bạn; người bị mô tả không đọc,
              không phản biện, không cập nhật được. Một mô tả mà đối tượng
              của nó không có quyền cãi thì không còn cơ chế nào để tự sửa — nó chỉ dày thêm theo
              thời gian.
            </>
          ),
        },
        {
          question: 'Vậy gốc rễ nằm ở đâu?',
          because: (
            <>
              Ở chỗ hồ sơ được đọc như một {strong('kết luận về một con người')}, trong khi thứ duy
              nhất nó có thể là {strong('giả thuyết về một cách nói chuyện')}. Đổi đúng một chữ đó
              thì mọi thứ còn lại tự về đúng chỗ: giả thuyết thì phải đem thử, thử thì có thể sai, và
              sai thì bỏ.
            </>
          ),
        },
      ]}
      root={
        <>
          Giữ hồ sơ ở đúng vai trò giả thuyết. Nó gợi cho bạn một cách mở lời; bạn thử; rồi để{' '}
          {strong('người thật quyết định giả thuyết đó đúng hay sai')}. Người thật luôn có quyền phủ
          quyết bảng tra — kể cả khi bảng tra nghe có vẻ hiểu họ hơn bạn.
        </>
      }
    />
  );
}
