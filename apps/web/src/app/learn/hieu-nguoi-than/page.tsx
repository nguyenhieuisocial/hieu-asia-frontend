/**
 * Bài học /learn/hieu-nguoi-than — bài Học CHÍNH THỨC của công cụ
 * /family-profiles (Hồ sơ gia đình).
 *
 * GROUNDING — nguồn dữ kiện, đọc HẾT trước khi viết:
 *   • app/family-profiles/page.tsx — TOÀN BỘ trang công cụ (thư mục chỉ có đúng
 *     một file này, không có component con). Trang là Server Component TĨNH:
 *     KHÔNG ô nhập, KHÔNG form, KHÔNG gọi API, KHÔNG đọc/ghi dữ liệu. Nội dung:
 *     banner cảnh báo phải có sự đồng ý của người thân; BA bước dự kiến (STEPS);
 *     BỐN cam kết riêng tư (PRIVACY_BULLETS); BA thẻ hồ sơ minh hoạ
 *     (DEMO_PROFILES — Cha / Mẹ / Vợ-Chồng, mỗi thẻ kèm "Tính năng đang phát
 *     triển"); BA nút dẫn sang /xem-hop-nhom, /compatibility, /onboarding/topic.
 *   • lib/site-registry.ts — TOOL_REGISTRY mục '/family-profiles' (catalog.name,
 *     catalog.desc, relatedLabel) + RELATED_TOOLS['/family-profiles'].
 *     IMPORT rồi render qua ./_active-learning, KHÔNG gõ tay.
 *   • ./_active-learning.tsx — một nguồn duy nhất cho TOOL_NAME / TOOL_DESC /
 *     TOOL_HREF / TOOL_RELATED / DEMO_PHRASE và toàn bộ khối học chủ động.
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ (đọc code, không đoán):
 *   • HÔM NAY: không nhận đầu vào, không lưu, không tính. Là trang giới thiệu
 *     một tính năng đang phát triển; ba hồ sơ hiển thị là chữ viết sẵn.
 *   • DỰ KIẾN (theo mô tả của chính trang): nhập ngày sinh + tên gọi → hồ sơ cơ
 *     bản (con giáp, ngũ hành, tổng quát tính cách, KHÔNG luận giải chuyên sâu)
 *     → ghép với lá số của bạn để gợi ý giao tiếp.
 *   • KHÔNG có, kể cả trong mô tả dự kiến: điểm hợp/khắc giữa hai người, điểm
 *     hợp cả nhóm, xếp hạng thành viên, hay lời khuyên hành động dành cho người
 *     kia. Bài này vì thế KHÔNG dạy mấy phần đó.
 *
 * PHẠM VI — không lấn bài khác: điểm hợp giữa HAI người thuộc /learn/hop-doi,
 * hợp NHÓM 3–6 người thuộc /learn/dong-nhom. Cả hai trang ĐÃ tồn tại (kiểm bằng
 * ls, và cả hai đã có mặt trong LEARN_TOPICS + sitemap) → bài này chỉ nêu ranh
 * giới rồi LINK sang, không mô tả lại nội dung. Chọn năm sinh cho con thuộc bài
 * Sinh con — không nhắc nội dung. Vì sao lời mô tả chung chung nghe rất đúng
 * thuộc bài Hiệu ứng Barnum (trang có thật → có link).
 *
 * Giọng: trung thực về giới hạn, không doạ, không phán số mệnh, không mỉa mai
 * người đọc. Lõi riêng của bài: đạo đức khi đọc lăng kính cho NGƯỜI KHÁC.
 */

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  HieuNguoiThanFrame,
  HieuNguoiThanDepth,
  HieuNguoiThanRecall,
  HieuNguoiThanChecklist,
  HieuNguoiThanWhys,
  TOOL_HREF,
  TOOL_NAME,
  TOOL_DESC,
  TOOL_LABEL,
  TOOL_RELATED,
  DEMO_PHRASE,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤47 ký tự: root layout nối thêm " · hieu.asia" (12) → tổng ≤60.
  title: 'Hiểu người thân — phối hợp, không dán nhãn',
  // ≤160 ký tự.
  description:
    'Đọc lăng kính cho người thân: dùng để phối hợp thay vì dán nhãn, rủi ro riêng khi mô tả trẻ con, và vì sao lưu ngày sinh người khác thì nên hỏi ý họ.',
  alternates: { canonical: 'https://hieu.asia/learn/hieu-nguoi-than' },
};

const TD = 'px-4 py-2 text-muted-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

/** Route của chính bài này — lọc khỏi TOOL_RELATED để không tự link về mình. */
const SELF_HREF = '/learn/hieu-nguoi-than';

function TableHead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-card/60">
        {cols.map((c) => (
          <th key={c} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function Scroller({ minWidth, children }: { minWidth: string; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minWidth} text-left text-sm`}>{children}</table>
    </div>
  );
}

// ── Bảng "công cụ khai gì" — hai dòng đầu render THẲNG từ sổ đăng ký ─────────

const TOOL_FACTS: { label: string; value: string }[] = [
  { label: 'Tên trong danh mục công cụ', value: TOOL_NAME },
  { label: 'Công cụ tự mô tả', value: TOOL_DESC },
  {
    label: 'Hiện trạng hôm nay',
    value:
      'Trang giới thiệu tĩnh. Không có ô nhập, không gọi máy chủ, không lưu và không tính gì. Ba hồ sơ hiển thị là chữ viết sẵn để minh hoạ giao diện.',
  },
  {
    label: 'Đầu vào dự kiến',
    value: 'Ngày sinh và tên gọi (không cần tên thật) của một người trong nhà.',
  },
  {
    label: 'Kết quả dự kiến',
    value:
      'Hồ sơ cơ bản: con giáp, ngũ hành, vài dòng tính cách tổng quát. Trang ghi rõ là không luận giải chuyên sâu.',
  },
  {
    label: 'Bước ghép dự kiến',
    value: 'Ghép hồ sơ thành viên với lá số của bạn để gợi ý cách giao tiếp và tránh xung đột.',
  },
  {
    label: 'Công cụ KHÔNG làm',
    value:
      'Ba bước mà trang mô tả không gồm: chấm điểm hợp – khắc giữa hai người, tính độ hợp cả nhóm, xếp hạng thành viên, hay đưa lời khuyên hành động dành cho người kia. Bài này vì vậy cũng không dạy mấy phần đó.',
  },
];

// ── Năm câu tự soi: cùng một dòng chữ, hai cách dùng ngược nhau ──────────────

const USE_ROWS: { hoi: string; phoiHop: string; danNhan: string }[] = [
  {
    hoi: 'Câu này làm đổi hành vi của ai?',
    phoiHop: 'Của bạn — cách mở lời, chọn lúc nói, nói bao nhiêu là đủ.',
    danNhan:
      'Không đổi việc bạn định làm. Nó đổi cách bạn nhìn người kia, rồi lặng lẽ khiến bạn hỏi ít đi.',
  },
  {
    hoi: 'Có cách nào cho thấy nó sai không?',
    phoiHop: 'Có. Thử cách mới vài lần trong tuần này; không đổi được gì thì bỏ.',
    danNhan: 'Không. Người kia im lặng cũng khớp, nói nhiều cũng khớp.',
  },
  {
    hoi: 'Nó mở ra hay khép lại cuộc nói chuyện?',
    phoiHop: 'Mở ra — dẫn tới một câu hỏi dành cho chính người đó.',
    danNhan: 'Khép lại — dùng để kết thúc tranh luận, hoặc để khỏi phải bàn nữa.',
  },
  {
    hoi: 'Nếu người kia nghe được thì họ thấy gì?',
    phoiHop: 'Thấy mình được để ý, và đính chính được nếu bạn hiểu sai.',
    danNhan: 'Thấy mình bị xếp vào một ô, và không có cách nào cãi lại.',
  },
  {
    hoi: 'Một tháng sau nó còn nguyên như cũ không?',
    phoiHop: 'Không. Nó được cập nhật theo những gì bạn quan sát được.',
    danNhan: 'Còn, và dày thêm. Mỗi lần khớp là một lần cái nhãn cứng lại.',
  },
];

// ── Câu nên và không nên nói ────────────────────────────────────────────────

const SHOULD_SAY: { cau: string; viSao: string }[] = [
  {
    cau: '“Mỗi lần nhà mình bàn chuyện tiền mà phải quyết ngay thì hay căng. Lần sau con nêu trước rồi để bố nghĩ tới tối, được không?”',
    viSao: 'Mô tả một quan sát của bạn và đề nghị một cách làm. Người kia gật hay lắc đều được.',
  },
  {
    cau: '“Bố thích nghe kết quả trước hay nghe đầu đuôi trước ạ?”',
    viSao: 'Hỏi thẳng thứ mà bảng tra chỉ đoán được. Câu trả lời của người thật luôn thắng.',
  },
  {
    cau: '“Anh cần bao lâu để nghĩ? Em chờ tới tối nay được.”',
    viSao: 'Bạn đổi nhịp của mình thay vì đổi con người của họ, và nói rõ giới hạn của mình.',
  },
  {
    cau: '“Con thấy dạo này mẹ hay để ý không khí trong nhà. Có chuyện gì mẹ đang lo không ạ?”',
    viSao: 'Biến một dòng mô tả thành một câu hỏi. Người thật trả lời là cách kiểm trực tiếp nhất.',
  },
];

const SHOULD_NOT_SAY: { cau: string; viSao: string }[] = [
  {
    cau: '“Tuổi bố là vậy đó, nói cũng không nghe đâu.”',
    viSao: 'Quy toàn bộ một con người về một ô lịch, và dùng ô đó để thôi không nói chuyện nữa.',
  },
  {
    cau: '“Em xem hồ sơ của anh rồi, anh đúng kiểu người ích kỷ.”',
    viSao:
      'Mượn một bảng tra làm chỗ dựa cho phán xét. Người nghe không cãi được vì cái bị mang ra không phải hành vi mà là bản chất.',
  },
  {
    cau: '“Tại mệnh anh vậy nên anh mới cáu, chứ không phải lỗi anh.”',
    viSao:
      'Mặt còn lại của cùng một lỗi: dùng nhãn để bào chữa. Nghe dịu hơn nhưng cũng xoá mất phần người ta thật sự chọn.',
  },
  {
    cau: '“Con bé này vốn nhút nhát, đừng ép nó.”',
    viSao:
      'Nói trước mặt một đứa trẻ thì câu này vừa dạy nó tin vào cái nhãn, vừa dặn người lớn xung quanh giao ít cơ hội hơn cho nó.',
  },
  {
    cau: '“Đã bảo mà, đúng như trang kia nói luôn.”',
    viSao:
      'Biến một lần trùng khớp ngẫu nhiên thành bằng chứng. Bạn có hàng chục năm ký ức nên lần nào cũng tìm được một lần trùng.',
  },
];

// FAQ khai báo MỘT lần, dùng cho CẢ accordion hiển thị lẫn FAQPage JSON-LD →
// chữ trong schema đúng bằng chữ trên trang. Câu hỏi cố ý không trùng bộ FAQ của
// các bài khác: ở đây toàn bộ đều xoay quanh việc đọc cho NGƯỜI KHÁC.
const FAQS = [
  {
    q: `Công cụ ${TOOL_NAME} đã dùng được chưa?`,
    a: `Chưa. Ở thời điểm bài này được viết, trang ${TOOL_NAME} là một trang giới thiệu tĩnh: nó không có ô nhập, không gọi máy chủ, không lưu và không tính gì cả. Ba hồ sơ bạn thấy trên trang là chữ viết sẵn để minh hoạ giao diện, không phải kết quả tính cho ai — chính mỗi thẻ cũng ghi "Tính năng đang phát triển". Những gì trang mô tả về ba bước và về hồ sơ cơ bản là kế hoạch, không phải thứ đang chạy. Bài học này viết trước phần đạo đức, vì đó là phần cần hiểu xong trước khi có nút bấm chứ không phải sau.`,
  },
  {
    q: 'Xem lá số cho người thân mà không nói với họ thì có gì sai?',
    a: 'Ngày sinh của một người là dữ liệu cá nhân của họ, không phải của bạn — bạn chỉ tình cờ biết. Lưu nó vào một dịch vụ nào đó là quyết định thay họ về dữ liệu của chính họ. Chính trang công cụ cũng đặt sẵn một cảnh báo ngay đầu trang: không luận sâu lá số người thân khi chưa có sự đồng ý của họ. Cách xử lý gọn nhất là hỏi một câu bằng lời thường, kiểu "con định lưu ngày sinh của bố mẹ vào một trang xem tử vi cho vui, bố mẹ có ngại không?". Họ đồng ý thì thoải mái; họ không muốn thì thôi, và điều đó không có gì đáng ngại.',
  },
  {
    q: 'Làm sao biết mình đang phối hợp hay đang dán nhãn?',
    a: 'Hỏi đúng một câu: điều bạn vừa nghĩ ra làm đổi hành vi của ai? Nếu nó đổi hành vi của BẠN — bạn sẽ nói gọn hơn, chọn lúc khác, cho người kia thêm thời gian — thì đó là phối hợp, và bạn kiểm được ngay trong tuần này xem cách mới có hiệu quả hơn không. Nếu nó không đổi hành vi của ai mà chỉ đổi cách bạn nhìn người kia, thì đó là dán nhãn. Dấu hiệu nhận ra rõ nhất là cái nhãn không thể sai: người kia im lặng cũng khớp, nói nhiều cũng khớp. Một câu không thể sai thì không mang thông tin nào.',
  },
  {
    q: 'Có nên xem cho con nhỏ không?',
    a: 'Nếu xem, hãy hạ nó xuống mức thấp nhất và đừng bao giờ nói cái nhãn ra trước mặt đứa trẻ. Có ba lý do khiến trẻ là trường hợp riêng. Một, lời tiên tri tự ứng nghiệm: trẻ nghe mô tả về mình rồi hành xử theo, còn người lớn thì giao ít cơ hội hơn cho cái nhãn — hai chiều khớp nhau thành vòng khép kín. Hai, tính cách trẻ chưa định hình, nên mọi mô tả ở trẻ đều kém ổn định hơn ở người lớn: đúng hôm nay có thể sai hẳn vài năm sau. Ba, trẻ chưa tự đồng ý được, người lớn quyết hộ, nên chuẩn phải cao hơn chứ không thấp hơn. Nếu một dòng nào đó khiến bạn định giảm kỳ vọng dành cho con, đó chính là dòng phải bỏ.',
  },
  {
    q: 'Người nhà tôi không tin tử vi. Tôi có nên nói ra chuyện đã xem không?',
    a: 'Nên, nếu bạn đã lưu dữ liệu của họ — vì phần cần nói không phải là "anh tin hay không tin", mà là "em có lưu ngày sinh của anh ở chỗ này". Hai chuyện đó tách rời nhau: một người hoàn toàn có thể không tin nhưng vẫn không phiền, hoặc rất tin nhưng lại không muốn bị người khác tra. Còn phần nội dung thì không cần kể, và thường không nên kể: thứ hữu ích cho bạn là cách bạn mở lời, chứ không phải mấy dòng mô tả. Nếu họ tò mò muốn xem sâu về chính mình thì mời họ tự lập hồ sơ — đó cũng đúng cam kết thứ tư mà trang công cụ nêu.',
  },
  {
    q: 'Tôi đọc hồ sơ thấy đúng y như người nhà mình. Vậy chẳng phải là bằng chứng sao?',
    a: 'Cảm giác trúng là một trải nghiệm thật, nhưng nó không đo được điều bạn tưởng nó đo. Bạn sống cùng người đó hàng chục năm, nên kho ký ức của bạn đủ lớn để tìm ra ví dụ khớp với gần như mọi mô tả — và bạn chỉ nhớ những lần khớp, không đếm những lần trật. Đọc cho người lạ còn thiếu dữ liệu để tự thuyết phục; đọc cho người thân thì không bao giờ thiếu. Muốn biết một mô tả có thật sự nói đúng người kia không thì cách chắc nhất là biến nó thành một dự đoán cụ thể cho tuần tới rồi xem có xảy ra không — hoặc đơn giản hơn, hỏi thẳng chính người đó.',
  },
  {
    q: 'Hồ sơ nói vợ/chồng tôi cần không gian riêng. Tôi dùng câu đó để giải thích mọi lần họ im lặng được không?',
    a: 'Không nên, và đây đúng là chỗ trượt phổ biến nhất. Một câu giải thích được mọi lần im lặng thì cũng sẽ giải thích được mọi lần nói nhiều, mọi lần cáu, mọi lần vui — tức là nó không phân biệt được gì cả. Nguy hiểm thật sự nằm ở chỗ khác: khi bạn đã có sẵn một lời giải thích, bạn thôi không hỏi nữa. Mà lần im lặng hôm nay có thể vì công việc, vì sức khoẻ, hoặc vì chính chuyện giữa hai người — ba nguyên nhân rất khác nhau và cần ba cách xử lý rất khác nhau. Cách dùng lành mạnh là để dòng mô tả gợi cho bạn một câu hỏi, rồi hỏi.',
  },
  {
    q: 'Có nên dùng hồ sơ người thân để quyết định thay họ không?',
    a: 'Không. Chọn trường cho con, khuyên ai đó nghỉ việc, quyết chuyện tiền bạc hay chuyện chữa bệnh — không việc nào trong số đó nên có mặt một bảng tra suy từ ngày sinh. Lý do rất đơn giản: đầu vào của hồ sơ chỉ có ngày sinh và một tên gọi do bạn tự đặt, mà con giáp với ngũ hành lại lấy theo năm sinh, nên mọi người sinh cùng năm đều nhận cùng một mô tả — và không có phép đo nào cho thấy nó dự đoán được cách một con người cụ thể phản ứng. Dùng nó cho những quyết định có hậu quả với người khác là để một thứ không mang thông tin quyết định thay bạn. Hồ sơ chỉ nên dừng ở mức gợi ý cách bạn mở lời với người trong nhà.',
  },
];

const JSONLD = [
  article({
    headline: 'Hiểu người thân: đọc lăng kính cho người khác mà không dán nhãn họ',
    description:
      'Cùng một dòng mô tả có thể dùng để phối hợp hoặc để dán nhãn. Bài phân biệt hai cách dùng, nói rủi ro riêng khi mô tả trẻ con, và phần quyền riêng tư khi lưu hồ sơ người thân.',
    url: '/learn/hieu-nguoi-than',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Hiểu người thân', url: '/learn/hieu-nguoi-than' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Hiểu người thân — dùng lăng kính để phối hợp, không để dán nhãn',
    description:
      'Đọc lăng kính cho người khác: phân biệt phối hợp với dán nhãn, rủi ro đặc thù với trẻ con, quyền riêng tư khi lưu hồ sơ người thân, và những câu nên hay không nên nói.',
    url: '/learn/hieu-nguoi-than',
  }),
];

export default function LearnHieuNguoiThanPage() {
  return (
    <LearnArticle
      eyebrow="QUAN HỆ · ĐẠO ĐỨC ĐỌC LĂNG KÍNH"
      title={
        <>
          Hiểu người thân{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (phối hợp, không dán nhãn)
          </span>
        </>
      }
      standfirst={
        <>
          Đọc lá số cho mình thì sai bạn tự sửa. Đọc cho mẹ, cho chồng, cho con thì người bị mô tả
          không biết, không đọc được và không cãi được. Bài này nói về đúng khoảng chênh đó — phần
          đạo đức mà gần như không trang xem tử vi nào chịu nói.
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Hiểu người thân' },
      ]}
      relatedLenses={relatedLearnLenses('hieu-nguoi-than')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Trang ${TOOL_NAME} hiện là bản giới thiệu: nó cho bạn thấy tính năng dự kiến trông ra sao, kèm bốn cam kết riêng tư và cảnh báo về sự đồng ý — chưa nhận và chưa lưu dữ liệu của ai.`,
        href: TOOL_HREF,
        label: `Xem trang ${TOOL_NAME}`,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <HieuNguoiThanFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Hồ sơ người thân là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Một <strong>hồ sơ người thân</strong> là vài dòng mô tả về một người trong nhà, suy
                ra từ ngày sinh của họ. Trên hieu.asia, chỗ dành cho việc đó là trang{' '}
                <Link href={TOOL_HREF} className={A}>
                  {TOOL_NAME}
                </Link>
                . Trước khi bàn nên dùng nó thế nào, cần nói rõ nó đang là cái gì — vì phần lớn nội
                dung trên trang ấy hiện là <strong>kế hoạch</strong>, không phải thứ đang chạy.
              </p>
              <Scroller minWidth="min-w-[680px]">
                <TableHead cols={['Mục', 'Nội dung']} />
                <tbody>
                  {TOOL_FACTS.map((f) => (
                    <tr key={f.label} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {f.label}
                      </th>
                      <td className={TD}>{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Hai dòng đầu của bảng được đọc thẳng từ sổ đăng ký công cụ của site, nên nếu công cụ
                đổi tên hay đổi mô tả thì bảng này đổi theo. Các dòng còn lại tóm từ chính trang{' '}
                {TOOL_NAME}. Có một chỗ vênh nên chỉ ra: dòng thứ hai — câu giới thiệu ngắn trong
                danh mục — có chữ <em>hợp khắc</em>, trong khi ba bước mà chính trang mô tả thì dừng
                ở hồ sơ cơ bản và gợi ý giao tiếp; phần chấm hợp – khắc nằm ở hai công cụ khác. Câu
                quảng bá một dòng thường hứa rộng hơn thứ trang đó thật sự mô tả, và đây là ví dụ
                ngay tại chỗ.
              </p>
              <p>Bốn điều một hồ sơ người thân KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một kết luận về con người.</strong> Thứ duy nhất nó có thể là
                  một <strong>giả thuyết về cách nói chuyện</strong> — một cách mở lời để bạn đem đi
                  thử, và người thật có quyền phủ quyết.
                </li>
                <li>
                  <strong>Không phải thông tin riêng của người đó.</strong> Đầu vào chỉ có ngày sinh
                  — tên gọi chỉ là nhãn bạn tự đặt — mà con giáp với ngũ hành lại lấy theo{' '}
                  <strong>năm</strong> sinh, nên mọi người sinh cùng năm đều nhận cùng phần mô tả ấy.
                  Nó không biết người kia đang ốm, đang áp lực công việc, hay vừa cãi nhau với ai.
                </li>
                <li>
                  <strong>Không phải cái để đem ra làm bằng chứng.</strong> Câu “đã bảo mà, đúng như
                  trang kia nói” biến một lần trùng khớp thành một phán quyết — trong khi bạn có sẵn
                  hàng chục năm ký ức để tìm ra lần trùng khớp ấy.
                </li>
                <li>
                  <strong>Không phải cái để quyết định thay người khác.</strong> Chọn trường cho con,
                  khuyên ai nghỉ việc, quyết chuyện tiền hay chuyện chữa bệnh — không việc nào nên có
                  mặt một bảng tra suy từ ngày sinh.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba phạm vi bài này cố ý không lấn, vì công cụ cũng không tính: <strong>điểm hợp</strong>{' '}
                giữa hai người và <strong>độ hợp của cả nhóm</strong> ba tới sáu người là việc của
                hai công cụ khác, mỗi cái có bài riêng —{' '}
                <Link href="/learn/hop-doi" className={A}>
                  Điểm hợp đôi
                </Link>{' '}
                và{' '}
                <Link href="/learn/dong-nhom" className={A}>
                  Động lực nhóm
                </Link>
                ; còn chuyện chọn năm sinh cho con thuộc một chủ đề khác hẳn. Ở đây chỉ bàn đúng một
                việc: bạn đã có trong tay vài dòng mô tả về một người thân — rồi sao nữa.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <HieuNguoiThanDepth />,
        },
        {
          id: 'phoi-hop-hay-dan-nhan',
          tocLabel: 'Phối hợp hay dán nhãn',
          heading: 'Cùng một dòng chữ, hai cách dùng ngược nhau',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Đây là phần lõi của bài. Giả sử bạn đọc được về mẹ mình dòng “{DEMO_PHRASE}” — đúng
                một trong những câu đang nằm trên trang công cụ. Cùng dòng chữ ấy dẫn tới hai con
                đường không liên quan gì tới nhau:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Phối hợp:</strong> “có thể mẹ để ý không khí trong nhà nhiều hơn mình
                  tưởng — tối nay mình hỏi mẹ thấy thế nào trước, rồi mới bàn chuyện tiền.” Bạn đổi{' '}
                  <strong>thứ tự và cách mở lời của mình</strong>, rồi nhìn xem có dễ nói chuyện hơn
                  không.
                </li>
                <li>
                  <strong>Dán nhãn:</strong> “mẹ nhạy cảm lắm, nói gì cũng suy diễn.” Câu này{' '}
                  <strong>kết thúc</strong> cuộc nói chuyện, và từ đó mọi phản ứng của mẹ đều được
                  bạn đọc qua cái nhãn ấy.
                </li>
              </ul>
              <p>
                Năm câu hỏi dưới đây tách hai con đường ra. Không cần nhớ hết — chỉ cần nhớ câu đầu
                tiên là đủ dùng trong phần lớn tình huống.
              </p>
              <Scroller minWidth="min-w-[820px]">
                <TableHead cols={['Câu hỏi tự soi', 'Dùng để phối hợp', 'Dùng để dán nhãn']} />
                <tbody>
                  {USE_ROWS.map((r) => (
                    <tr key={r.hoi} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {r.hoi}
                      </th>
                      <td className={TD}>{r.phoiHop}</td>
                      <td className={TD}>{r.danNhan}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Dán nhãn có hai mặt, và mặt dịu dàng cũng là dán nhãn
              </h3>
              <p>
                Ai cũng nhận ra mặt thứ nhất: dùng nhãn để <strong>phán xét</strong> — “tuổi đó là
                vậy đó”, “người mệnh ấy ích kỷ lắm”. Mặt thứ hai khó nhận ra hơn nhiều vì nó nghe rất
                bao dung: dùng nhãn để <strong>bào chữa</strong> — “tại mệnh anh vậy nên anh mới
                cáu”, “con nó sinh năm ấy nên nó lì, chịu thôi”.
              </p>
              <p>
                Cả hai đều làm cùng một việc: <strong>xoá phần người ta thật sự chọn</strong>. Người
                bị phán xét mất quyền được nhìn khác đi; người được bào chữa mất luôn trách nhiệm với
                hành vi của mình — và mất cả cơ hội sửa. Nếu một dòng mô tả khiến bạn thôi không mong
                đợi gì ở ai đó nữa, kể cả theo hướng thông cảm, thì nó đã vượt khỏi vai trò của nó.
              </p>
              <p className="text-sm text-foreground/70">
                Vì sao một dòng mô tả chung chung lại nghe đúng đến vậy — nhất là khi bạn đọc về
                người mình đã quen hàng chục năm — là chủ đề của bài{' '}
                <Link href="/learn/barnum" className={A}>
                  Hiệu ứng Barnum
                </Link>
                . Còn cách kiểm một lời mô tả bằng chuyện đã xảy ra thật thì nằm ở bài{' '}
                <Link href="/learn/kiem-chung" className={A}>
                  Kiểm chứng dự đoán
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'voi-tre-con',
          tocLabel: 'Riêng với trẻ con',
          heading: 'Với trẻ con, mức rủi ro khác hẳn',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Trang công cụ ghi rõ đối tượng gồm cả <strong>con</strong>. Đây là chỗ cần cẩn thận
                nhất trong toàn bộ chủ đề, vì ba lý do cộng lại chứ không phải một.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  <strong>Nhãn dễ thành lời tiên tri tự ứng nghiệm.</strong> Đứa trẻ nghe người lớn
                  mô tả mình rồi dần hành xử theo mô tả đó; cùng lúc, người lớn giao ít cơ hội hơn
                  cho cái nhãn — không cho “đứa nhút nhát” lên phát biểu, không giao việc khó cho
                  “đứa hậu đậu”. Hai chiều khớp nhau thành một vòng khép kín, và sau vài năm cái nhãn
                  trông rất giống một sự thật khách quan.
                </li>
                <li>
                  <strong>Tính cách trẻ chưa định hình.</strong> Cách một đứa trẻ phản ứng còn thay
                  đổi nhiều theo tuổi và theo môi trường, nên mọi mô tả tính cách ở trẻ đều kém ổn
                  định hơn ở người lớn — mô tả có vẻ đúng lúc lên sáu hoàn toàn có thể sai hẳn lúc
                  mười sáu. Một cái nhãn thì không tự hết hạn.
                </li>
                <li>
                  <strong>Trẻ chưa tự đồng ý được.</strong> Người lớn còn có thể nghe một nhận xét về
                  mình rồi bác lại, hoặc quyết định không lưu ngày sinh của mình ở đâu cả. Đứa trẻ
                  thì người lớn quyết hộ toàn bộ. Chuẩn vì vậy phải cao hơn, không phải thấp hơn.
                </li>
              </ol>
              <p>
                Cơ chế này không cần huyền học mới có — nó y hệt cơ chế của cái nhãn “dốt toán” trong
                lớp học. Nhưng nhãn suy từ ngày sinh có thêm một tầng khó gỡ:{' '}
                <strong>nguồn của nó là một dữ kiện không bao giờ đổi</strong>. Đứa trẻ có thể chứng
                minh mình làm được một bài toán khó, nhưng không thể chứng minh mình không sinh vào
                ngày đó.
              </p>
              <p>Ba việc nên giữ, nếu bạn vẫn muốn xem cho con:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không nói cái nhãn trước mặt trẻ</strong> — và cũng không nói trước mặt họ
                  hàng hay trong nhóm chat gia đình, vì trẻ sẽ nghe lại từ người khác.
                </li>
                <li>
                  <strong>Chỉ dùng để nhắc chính mình kiên nhẫn hơn.</strong> “Có thể con cần thêm
                  thời gian làm quen” là một lời nhắc cho bạn. “Con bé này vốn nhát” là một bản án
                  cho nó.
                </li>
                <li>
                  <strong>Bỏ ngay dòng nào làm bạn hạ kỳ vọng.</strong> Nếu sau khi đọc, bạn định
                  đăng ký ít lớp hơn, giao ít việc hơn, hay thôi không mời con thử một thứ gì đó —
                  thì cái giá đã rơi vào đời đứa trẻ, còn cái lợi thì vẫn chưa thấy đâu.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ranh giới cần nói rõ: chuyện chọn năm sinh cho con hay đối chiếu mệnh của bé với tuổi
                bố mẹ là một chủ đề khác hẳn, không thuộc bài này. Ở đây chỉ bàn việc{' '}
                <strong>mô tả một đứa trẻ đã sinh ra rồi</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'du-lieu-cua-nguoi-khac',
          tocLabel: 'Dữ liệu của người khác',
          heading: 'Lưu hồ sơ người thân là lưu dữ liệu của người khác',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Điều dễ quên nhất: ngày sinh của mẹ bạn là{' '}
                <strong>dữ liệu cá nhân của mẹ bạn</strong>, không phải của bạn. Bạn chỉ tình cờ
                biết. Đưa nó vào một dịch vụ là quyết định thay người khác về dữ liệu của chính họ —
                dù bạn hoàn toàn có thiện ý.
              </p>
              <p>
                Công cụ có ý thức về chuyện này. Trang {TOOL_NAME} đặt một banner cảnh báo ngay ở
                đầu trang — <em>không luận sâu lá số người thân khi chưa có sự đồng ý của họ</em> —
                và nêu bốn cam kết riêng tư:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>hồ sơ thành viên chỉ lưu trong tài khoản của bạn, không chia sẻ, không lập chỉ mục;</li>
                <li>chỉ làm phân tích cơ bản, không luận giải chuyên sâu khi chưa có sự đồng ý của họ;</li>
                <li>bạn xoá hồ sơ được bất cứ lúc nào, không giữ bản sao lưu;</li>
                <li>muốn luận giải chuyên sâu thì mời chính người đó tự tạo tài khoản.</li>
              </ul>
              <p>
                Bốn cam kết ấy là điều đáng có. Nhưng hãy đọc kỹ chúng ràng buộc <em>ai</em>: chúng
                ràng buộc <strong>hệ thống</strong>. Không cam kết nào trong đó ngăn được chỗ rò rỉ
                thật sự phổ biến — <strong>chính bạn kể lại</strong> nội dung hồ sơ ở bữa cơm, trong
                nhóm chat họ hàng, hoặc trong một lúc đang bực. Một mô tả bị đem ra giữa đám đông thì
                dù máy chủ có kín tới đâu cũng đã lộ rồi.
              </p>
              <p>
                Và riêng tư không đồng nghĩa với chính xác. Giữ kín một mô tả sai thì vẫn là đang giữ
                một mô tả sai; nó chỉ khiến người bị mô tả càng khó biết mà đính chính.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Hỏi ý người thân — một câu là đủ
              </h3>
              <p>
                Không cần trịnh trọng, không cần giải thích cả hệ thống tử vi. Điều cần nói không
                phải “anh có tin không”, mà là “em có lưu dữ liệu của anh ở chỗ này”. Hai chuyện đó
                tách rời nhau: một người có thể không tin nhưng chẳng phiền, hoặc rất tin nhưng lại
                không muốn bị người khác tra.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>“Con định lưu ngày sinh của bố mẹ vào một trang xem tử vi để xem cho vui, bố mẹ có ngại không ạ?”</li>
                <li>“Em có xem thử phần hợp giao tiếp, có ngày sinh của anh trong đó. Anh thấy sao?”</li>
                <li>“Nếu anh muốn xem kỹ về chính mình thì tự lập hồ sơ riêng sẽ đúng hơn — em không xem hộ.”</li>
              </ul>
              <p>
                Họ đồng ý thì thoải mái. Họ không muốn thì thôi, và đó là một câu trả lời hoàn toàn
                bình thường — xoá đi là xong. Nếu bạn thấy khó mở lời câu hỏi này, thì thường đó
                chính là tín hiệu rằng việc đang làm cần được hỏi.
              </p>
              <p className="text-sm text-foreground/70">
                Cách hieu.asia xử lý dữ liệu nói chung nằm ở{' '}
                <Link href="/privacy" className={A}>
                  trang Chính sách riêng tư
                </Link>
                . Nhưng phần thuộc về bạn thì không có chính sách nào thay được: bạn là người quyết
                định kể lại hay không.
              </p>
            </div>
          ),
        },
        {
          id: 'nen-va-khong-nen-noi',
          tocLabel: 'Nên và không nên nói',
          heading: 'Sau khi xem: nên nói gì, không nên nói gì',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Phần lớn thiệt hại không xảy ra lúc bạn đọc, mà xảy ra lúc bạn{' '}
                <strong>nói ra</strong>. Nguyên tắc gọn nhất: nói về{' '}
                <strong>điều bạn quan sát được và điều bạn định làm</strong>, đừng nói về{' '}
                <strong>người kia là ai</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Nên nói</h3>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['Câu', 'Vì sao dùng được']} />
                <tbody>
                  {SHOULD_SAY.map((s) => (
                    <tr key={s.cau} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 text-foreground">{s.cau}</td>
                      <td className={TD}>{s.viSao}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>

              <h3 className="pt-2 text-lg font-semibold text-foreground">Không nên nói</h3>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['Câu', 'Vì sao nên tránh']} />
                <tbody>
                  {SHOULD_NOT_SAY.map((s) => (
                    <tr key={s.cau} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 text-foreground">{s.cau}</td>
                      <td className={TD}>{s.viSao}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Để ý điểm chung của cột bên trái ở bảng thứ nhất: không câu nào nhắc tới lá số, con
                giáp hay ngũ hành. Đó không phải vì phải giấu — mà vì phần thật sự có ích cho quan hệ
                nằm ở <strong>cách bạn mở lời</strong>, còn nguồn gợi ý cho cách mở lời ấy thì người
                kia không cần phải quan tâm.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cái này không biết gì về người thân của bạn',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Nói thẳng, vì đây là chủ đề dễ được dùng để nói thay người khác nhất trên cả khu tra
                cứu.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Công cụ chưa chạy.</strong> Mọi thứ trên trang {TOOL_NAME} hôm nay là mô tả
                  một tính năng dự kiến. Không có hồ sơ nào được tạo, không dữ liệu nào được lưu, và
                  ba thẻ minh hoạ là chữ viết sẵn.
                </li>
                <li>
                  <strong>Kể cả khi chạy, đầu vào vẫn rất thô.</strong> Ngày sinh và một tên gọi —
                  không có gì về hoàn cảnh, sức khoẻ, công việc hay chuyện đang xảy ra giữa hai
                  người. Không phép đo nào cho thấy ngày sinh dự đoán được cách một người cụ thể phản
                  ứng.
                </li>
                <li>
                  <strong>Cảm giác “đúng ghê” không phải bằng chứng.</strong> Với người bạn đã sống
                  cùng hàng chục năm, bạn luôn tìm được ví dụ khớp cho gần như mọi mô tả — và chỉ nhớ
                  những lần khớp.
                </li>
                <li>
                  <strong>Không thay chuyên môn.</strong> Nếu người thân của bạn đang có dấu hiệu
                  trầm cảm, lo âu, hay quan hệ trong nhà đang đổ vỡ, thì thứ cần là bác sĩ hoặc
                  chuyên gia tham vấn, không phải một dòng mô tả tính cách. Đừng dùng hồ sơ để tự
                  chẩn đoán cho người khác.
                </li>
                <li>
                  <strong>Không dùng cho việc có hậu quả với người khác.</strong> Tuyển người, cho
                  vay, chọn trường cho con, khuyên ai nghỉ việc — không việc nào nên có mặt một bảng
                  tra suy từ ngày sinh.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh gói gọn trong một câu:{' '}
                <strong>để hồ sơ gợi cho bạn một câu hỏi, rồi đi hỏi người thật</strong>. Nếu bạn
                thấy mình đang dùng nó để khỏi phải hỏi, thì nó đang làm hại đúng cái quan hệ mà bạn
                định cải thiện.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <HieuNguoiThanWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <HieuNguoiThanRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
            <>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map((f, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded border border-border px-4"
                  >
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Ba bài đọc tiếp nếu bạn muốn đi xa hơn. Vì sao một mô tả chung chung lại nghe đúng
                với mọi người nằm ở{' '}
                <Link href="/learn/barnum" className={A}>
                  bài Hiệu ứng Barnum
                </Link>
                , còn cách kiểm một lời mô tả bằng chuyện đã xảy ra thật nằm ở{' '}
                <Link href="/learn/kiem-chung" className={A}>
                  bài Kiểm chứng dự đoán
                </Link>
                . Muốn hiểu chính lát cắt con giáp mà hồ sơ dự kiến dùng thì đọc{' '}
                <Link href="/learn/con-giap" className={A}>
                  bài 12 con giáp
                </Link>
                .
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: TOOL_HREF, label: TOOL_LABEL },
                    ...TOOL_RELATED.filter((l) => l.href !== SELF_HREF),
                  ]}
                />
              </div>
            </>
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <HieuNguoiThanChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
