/**
 * Bài học /learn/tuong-mat — bài PHỤ của công cụ /xem-tuong, chỉ về tướng MẶT.
 * Bài CHÍNH của công cụ này là /learn/palm (xem chỉ tay); ở đây chỉ link sang,
 * không dạy lại chỉ tay.
 *
 * GROUNDING — nguồn duy nhất cho mọi câu về công cụ là app/xem-tuong/page.tsx
 * (đọc mã, không đoán). Trang đó là 'use client' và chỉ export default component
 * (FAQS, hằng số, hàm resize đều là biến cục bộ), nên không import được — phần dữ kiện được
 * thuật lại kèm chú nguồn, và hai hằng số duy nhất phải chép tay
 * (RESIZE_MAX_PX = 1024, mức nén JPEG 0,8) được khai báo MỘT chỗ ở
 * ./_active-learning.tsx rồi import về đây.
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ (đọc mã):
 *   • Đầu vào về người dùng: MỘT tấm ảnh + giới tính (ô ghi rõ "không bắt buộc").
 *     Không ngày sinh, không giờ sinh, không tên. `kind` chỉ là nút chọn chế độ
 *     xem chỉ tay / xem tướng mặt.
 *   • resizeToDataUrl(file, maxPx = 1024, quality = 0.8) — thu nhỏ và nén NGAY
 *     TRÊN MÁY người dùng, rồi POST {image_url, kind, gender} tới
 *     `${API_BASE}/tools/vision-read`.
 *   • Đáp trả có đúng một trường nội dung: `reading` — chuỗi Markdown, render
 *     bằng <ReactMarkdown>. KHÔNG điểm số, KHÔNG bảng, KHÔNG toạ độ, KHÔNG
 *     phần trăm ở bất kỳ đâu trong frontend.
 *   • Prompt gửi cho mô hình nằm ở worker backend (repo khác) → bài chỉ khẳng
 *     định phần kiểm được: đầu vào và DẠNG đầu ra.
 *   • Trang tự nói: ảnh "không được lưu trữ"; nhân tướng học "không phải khoa
 *     học được kiểm chứng"; "tướng tự tâm sinh"; không chẩn đoán sức khoẻ hay
 *     tâm lý, không đoán tương lai; chỉ gửi ảnh của chính mình hoặc ảnh người
 *     khác khi đã được họ đồng ý.
 *   • Nếu đã đăng nhập, request còn kèm Bearer token Supabase → có thêm MỘT dữ
 *     kiện về người dùng (tài khoản nào), dù không phải dữ kiện để đọc mặt.
 *
 * CHUYỆN LƯU ẢNH — ĐÃ KIỂM TẬN NƠI (2026-08), đừng hạ xuống thành "cam kết":
 * đọc handler `/tools/vision-read` trong repo backend
 * (../backend/infra/cloudflare/workers/api-gateway/src/index.ts) thì ảnh chỉ
 * được chuyển tiếp cho mô hình rồi thôi — KHÔNG ghi R2, KHÔNG ghi KV, KHÔNG ghi
 * DB; bản ghi chi phí (writeTrace) cố tình để `content: ""`. Đường upload cũ
 * (/v1/uploads/hand-image-url → MinIO) đã CHẾT vì worker không còn route /v1/
 * nào, nên uploadImage luôn rơi vào nhánh dự phòng createObjectURL trong trình
 * duyệt. /methodology và /onboarding/consent đã sửa cho khớp.
 * Ranh giới còn lại phải giữ: ảnh CÓ rời máy bạn để tới nhà cung cấp mô hình —
 * "không lưu" nói về máy chủ hieu.asia, không phải "ảnh không đi đâu cả".
 * Nếu ai đó đổi handler đó, sửa lại bài này; đừng viết theo trí nhớ.
 *
 * CÔNG CỤ KHÔNG TÍNH: tam đình, ngũ quan, thập nhị cung — không có phép đo tỉ
 * lệ, không chấm điểm bộ phận, không chia cung nào. Ba khung đó được dạy ở đây
 * như DI SẢN VĂN HOÁ (khung người xưa dùng để đọc mặt) và bài NÓI THẲNG rằng
 * công cụ không tính chúng. Ba bảng canon định nghĩa một lần ở
 * ./_active-learning.tsx và import về đây → số nói trong bài luôn khớp số dòng.
 *
 * PHẠM VI: chỉ tay thuộc /learn/palm (MỘT câu + link); hiệu ứng Barnum thuộc
 * /learn/barnum; cách kiểm chứng một dự đoán thuộc /learn/kiem-chung.
 *
 * Giọng: đọc như di sản văn hoá và như một cách tập quan sát, KHÔNG phải công cụ
 * đánh giá người. Trung thực về bằng chứng, không hù doạ, không phán số mệnh,
 * không mỉa mai người đọc.
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
  TuongMatFrame,
  TuongMatDepth,
  TuongMatRecall,
  TuongMatChecklist,
  TuongMatWhys,
  TAM_DINH,
  NGU_QUAN,
  THAP_NHI_CUNG,
  RESIZE_MAX_PX,
  JPEG_QUALITY_LABEL,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Tướng mặt là gì — tam đình, ngũ quan, 12 cung',
  description:
    'Nhân tướng khuôn mặt chia mặt theo tam đình, ngũ quan, thập nhị cung. Công cụ hieu.asia chỉ mô tả ảnh bằng AI — không đo, không chấm điểm, không đoán số.',
  alternates: { canonical: 'https://hieu.asia/learn/tuong-mat' },
};

// --- Công cụ /xem-tuong làm gì, theo đúng thứ tự trong mã ---------------------

interface PipelineStep {
  buoc: string;
  chiTiet: string;
}

/** Đường đi của một tấm ảnh, đọc từ app/xem-tuong/page.tsx. */
const PIPELINE: readonly PipelineStep[] = [
  {
    buoc: 'Bạn chọn chế độ và tải ảnh',
    chiTiet:
      'Form có ba ô: loại xem (chỉ tay hoặc tướng mặt), giới tính và một tấm ảnh. Đó là toàn bộ những thứ công cụ hỏi bạn. Một chi tiết nhỏ nên biết: ô giới tính được ghi là “không bắt buộc”, nhưng nó luôn sẵn một lựa chọn và luôn được gửi đi — “không bắt buộc” ở đây nghĩa là bạn không phải đổi, không phải là có thể bỏ trống.',
  },
  {
    buoc: 'Ảnh được nén ngay trên máy bạn',
    chiTiet: `Trước khi rời máy, ảnh bị thu về tối đa ${RESIZE_MAX_PX} điểm ảnh ở cạnh dài và nén JPEG ở mức ${JPEG_QUALITY_LABEL}. Ảnh nhỏ hơn ngưỡng đó thì giữ nguyên kích thước, chỉ bị nén. Bước này làm nhẹ đường truyền, và với ảnh điện thoại — vốn lớn hơn ngưỡng nhiều lần — nó làm mất phần lớn chi tiết rất nhỏ.`,
  },
  {
    buoc: 'Ảnh đã nén được gửi tới máy chủ',
    chiTiet:
      'Gửi kèm loại xem và giới tính tới đúng một điểm cuối phân tích ảnh. Không kèm ngày sinh, giờ sinh hay tên — vì công cụ không hỏi những thứ đó. Nếu bạn đang đăng nhập thì có thêm một vé đăng nhập đi cùng, để máy chủ biết đây là tài khoản nào (trang có sẵn đường mở khoá trả phí, mà thứ mở khoá thì phải gắn với một tài khoản); nó không phải dữ kiện để đọc mặt.',
  },
  {
    buoc: 'Máy chủ trả về một đoạn văn',
    chiTiet:
      'Đáp trả có đúng một trường nội dung: một đoạn chữ do mô hình AI viết. Trang không nhận về điểm số, không nhận về bảng chấm hay toạ độ nào — chỉ có chữ, và chữ đó được hiển thị nguyên vẹn.',
  },
  {
    buoc: 'Trang hiển thị đoạn văn đó',
    chiTiet:
      'Kèm nút chia sẻ, nút tải bản PDF và dòng lưu ý cố định rằng kết quả mang tính tham khảo, không phán định số phận. Trang cũng ghi rằng ảnh không được lưu trữ — và đúng là máy chủ hieu.asia không ghi tấm ảnh vào bất kỳ kho nào: nó chuyển tiếp cho mô hình rồi thôi.',
  },
];

/** Những việc công cụ KHÔNG làm — nói thẳng thay vì để người đọc tự suy. */
const NOT_DOING: readonly string[] = [
  'Không đo tỉ lệ tam đình, không chấm điểm ngũ quan, không chia thập nhị cung. Không chỗ nào trong công cụ tính ba khung ấy — chúng là kiến thức nền của bài học này. Đoạn văn AI viết vẫn có thể mượn chữ của chúng, vì đó là ngôn ngữ của môn này; nhưng mượn chữ thì không phải là đo.',
  'Không nhận ngày sinh hay giờ sinh, nên không dính dáng gì tới lá số hay can chi. Đây là lăng kính đọc ảnh, không phải lăng kính đọc lịch.',
  'Không chẩn đoán sức khoẻ hay tâm lý, không đoán tương lai, không xếp hạng ai với ai.',
  'Không hỏi bạn là ai để đọc mặt: trang chỉ gửi đi tấm ảnh cùng loại xem và giới tính (thêm vé đăng nhập nếu bạn đã đăng nhập), và trong trình duyệt không có bước nào đối chiếu khuôn mặt với một kho ảnh. Phần chạy trên máy chủ thì trình duyệt không tự kiểm được, nhưng mã máy chủ đã được đọc: tấm ảnh chỉ được chuyển tiếp cho mô hình để đọc rồi thôi, không ghi vào kho lưu trữ nào. Điều đó không có nghĩa ảnh không đi đâu cả — nó vẫn rời máy bạn để tới bên chạy mô hình.',
  'Không tính ra một con số nào để bạn so đo: không có thang điểm, không có ngưỡng, không có bảng xếp loại ở bất kỳ đâu trong công cụ.',
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ trong schema
// đúng bằng chữ trên trang. Câu hỏi cố ý KHÁC bộ FAQ của chính trang /xem-tuong
// (ở đó hỏi "dựa trên gì", "ảnh có bị lưu không", "có khoa học không", "tướng xấu
// có phải số khổ", "chụp thế nào cho đẹp") — ở đây hỏi những thứ chỉ bài học mới
// trả lời được.
const FAQS = [
  {
    q: 'Tam đình, ngũ quan, thập nhị cung — công cụ trên hieu.asia có tính không?',
    a: `Không tính. Đọc mã trang công cụ thì thấy nó nhận một tấm ảnh cùng ô giới tính, rồi trả về một đoạn văn do AI viết; không có phép đo tỉ lệ, không có điểm số, không có bảng chia ${THAP_NHI_CUNG.length} cung nào. Đoạn văn ấy vẫn có thể nhắc tên tam đình hay tên một cung, vì đó là ngôn ngữ của môn này — nhưng nhắc tên thì khác với đo. Ba khung được dạy trong bài học này như di sản văn hoá, để bạn hiểu người xưa đọc mặt theo khung nào, chứ không phải để bạn đối chiếu với kết quả máy trả về. Site chọn nói thẳng chỗ không tính, thay vì trình bày như thể có.`,
  },
  {
    q: 'Xem tướng mặt và xem chỉ tay khác nhau chỗ nào?',
    a: 'Khác ở thứ được nhìn và ở bề dày truyền thống. Tướng mặt gắn với hệ hình tượng chia vùng khuôn mặt của nhân tướng học Đông Á; xem chỉ tay đọc các đường nét trên lòng bàn tay và xuất hiện ở nhiều nền văn hoá khác nhau. Trên hieu.asia, cả hai là hai chế độ của cùng một công cụ và đi qua đúng cùng một đường: một tấm ảnh vào, một đoạn văn ra. Vì vậy mọi giới hạn nói ở bài này áp dụng nguyên vẹn cho cả hai.',
  },
  {
    q: 'Vì sao ảnh bị nén nhỏ trước khi gửi, và điều đó ảnh hưởng gì tới kết quả?',
    a: `Nén để đường truyền nhẹ và để dữ liệu rời máy bạn ít nhất có thể — ảnh được thu về tối đa ${RESIZE_MAX_PX} điểm ảnh ở cạnh dài, ngay trên thiết bị của bạn (ảnh vốn nhỏ hơn mức đó thì giữ nguyên kích thước, chỉ bị nén lại). Ảnh chụp bằng điện thoại thường lớn gấp nhiều lần ngưỡng ấy, nên hệ quả cần biết là: phần lớn chi tiết rất nhỏ đã mất trước khi bất cứ ai nhìn thấy tấm ảnh. Nếu một đoạn luận nghe như đang mô tả những nét li ti chính xác tới từng milimet, đó là giọng văn chứ không phải độ chính xác.`,
  },
  {
    q: 'Xem hai lần với hai tấm ảnh của cùng một người thì có ra cùng kết quả không?',
    a: 'Không có gì bảo đảm như vậy. Kết quả là văn bản do một mô hình ngôn ngữ sinh ra chứ không phải đầu ra của một bảng tra cố định, nên ánh sáng, góc chụp, biểu cảm hay chỉ đơn giản là lần chạy khác nhau đều có thể cho câu chữ khác. Đây là một khác biệt lớn so với các công cụ lịch pháp trên site: ở đó cùng đầu vào luôn cho cùng đầu ra, còn ở đây thì không. Biết điều này rồi thì bạn sẽ không đọc kết quả như một kết luận.',
  },
  {
    q: 'Tướng mặt có đổi theo thời gian không?',
    a: 'Có, và chính truyền thống cũng nói vậy. Câu "tướng tự tâm sinh" được nhắc rất nhiều trong nhân tướng học: nét mặt và dáng vẻ phần lớn phản ánh nếp sống, giấc ngủ, tâm thế của giai đoạn hiện tại, và chúng thay đổi. Một khuôn mặt ở tuổi hai mươi không phải khuôn mặt ở tuổi năm mươi. Đây là lý do nội tại của chính truyền thống để không coi một tấm ảnh là bản án cho cả đời người.',
  },
  {
    q: 'Nghiên cứu hiện đại không ủng hộ việc đoán tính cách qua khuôn mặt — vậy vì sao vẫn dạy?',
    a: 'Vì hai câu hỏi khác nhau. "Nó có dự đoán đúng tính cách không" thì câu trả lời trung thực là không: các nghiên cứu tâm lý học hiện đại không tìm thấy liên hệ ổn định giữa đặc điểm khuôn mặt và tính cách. "Nó là gì trong đời sống văn hoá của người Việt" lại là câu hỏi đáng học, vì hệ hình tượng này nằm trong ca dao, trong tuồng chèo, trong cách ông bà mô tả người. Bài này dạy nó theo nghĩa thứ hai, và nói rõ nghĩa thứ nhất để bạn không lẫn hai chuyện.',
  },
  {
    q: 'Có nên xem tướng mặt người khác qua ảnh không?',
    a: 'Không nên, và trang công cụ cũng ghi rõ chỉ nên gửi ảnh của chính bạn hoặc ảnh người khác khi đã được họ đồng ý. Có hai lý do tách bạch. Về bằng chứng: không có liên hệ ổn định nào để dựa vào, nên kết luận rút ra sẽ nói về định kiến của người xem nhiều hơn là về người trong ảnh. Về đối xử: người trong ảnh không có mặt để phản bác, và một nhận xét về ngoại hình thì rất khó gỡ. Tuyển dụng, cho vay, chọn bạn đời — những chỗ ấy càng không phải nơi dùng khuôn mặt làm căn cứ.',
  },
];

const JSONLD = [
  article({
    headline: 'Tướng mặt trong nhân tướng học: tam đình, ngũ quan, thập nhị cung và trạng thái bằng chứng',
    description:
      'Nhân tướng khuôn mặt như một tập tục quan sát: ba khung chia mặt của người xưa, công cụ Xem tướng của hieu.asia thật sự làm gì với tấm ảnh, và vì sao khoa học hiện đại không ủng hộ việc đoán tính cách qua khuôn mặt.',
    url: '/learn/tuong-mat',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Tướng mặt', url: '/learn/tuong-mat' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Tướng mặt — đọc hệ hình tượng của nhân tướng học cho đúng',
    description:
      'Nhân tướng khuôn mặt chia mặt theo tam đình, ngũ quan, thập nhị cung. Công cụ hieu.asia chỉ mô tả ảnh bằng AI — không đo, không chấm điểm, không đoán số.',
    url: '/learn/tuong-mat',
  }),
];

/**
 * Thẻ "lăng kính khác" lấy thẳng từ registry lib/learn/related. Bảng NEIGHBORS
 * ĐÃ có mục 'tuong-mat' → ['palm', 'can-xuong', 'barnum', 'kiem-chung'], nên
 * relatedLearnLenses('tuong-mat') KHÔNG rơi vào nhánh dự phòng "4 chủ đề đầu
 * danh sách" (Tử Vi, Bát Tự, MBTI, Big Five). Đã chạy đối chiếu: kết quả trùng
 * đúng bốn thẻ mà bản chép tay trước đây dựng ra, nên bỏ bản chép tay để hai
 * chỗ không lệch nhau khi registry đổi.
 */
const RELATED_LENSES = relatedLearnLenses('tuong-mat');

const TD = 'px-4 py-2 text-muted-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

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

export default function LearnTuongMatPage() {
  return (
    <LearnArticle
      eyebrow="NHÂN TƯỚNG · KHUÔN MẶT"
      title={
        <>
          Tướng mặt{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(đọc như di sản)</span>
        </>
      }
      standfirst={
        <>
          Người xưa đọc khuôn mặt theo một hệ hình tượng khá chặt chẽ: chia mặt thành tầng, thành
          quan, thành cung. Bài này trình bày khung đó cho tử tế, nói rõ công cụ trên web này thật sự
          làm gì với tấm ảnh của bạn, và nói thẳng khoa học hiện đại đang đứng ở đâu với chuyện đoán
          người qua khuôn mặt.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Tướng mặt' },
      ]}
      relatedLenses={RELATED_LENSES}
      tryCta={{
        heading: 'Thử với ảnh của chính bạn',
        blurb:
          'Công cụ Xem tướng nhận một tấm ảnh khuôn mặt và trả về một đoạn luận bằng chữ. Đọc nó như một tấm gương lạ để tự ngẫm — không phải như một kết luận về bạn.',
        href: '/xem-tuong',
        label: 'Tải ảnh và xem tướng mặt',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <TuongMatFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Nhân tướng khuôn mặt là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nhân tướng học là <strong>bộ môn quan sát đặc điểm khuôn mặt và bàn tay</strong>, có
                truyền thống lâu đời ở Đông Á. Phần dành cho khuôn mặt là phần được hệ thống hoá kỹ
                nhất: người xưa chia gương mặt thành các vùng, đặt tên cho từng vùng, rồi gắn mỗi
                vùng với một mảng việc trong đời. Ba khung quen thuộc nhất là{' '}
                <strong>tam đình</strong> ({TAM_DINH.length} tầng theo chiều dọc),{' '}
                <strong>ngũ quan</strong> ({NGU_QUAN.length} bộ phận được coi là “cơ quan” riêng) và{' '}
                <strong>thập nhị cung</strong> ({THAP_NHI_CUNG.length} vùng trải khắp gương mặt).
              </p>
              <p>
                Cốt lõi của nó là <strong>kinh nghiệm quan sát tích luỹ qua nhiều thế hệ</strong> —
                không phải khoa học được kiểm chứng. Đó cũng đúng là câu mà chính trang công cụ của
                hieu.asia viết ra, và bài này giữ nguyên lập trường ấy thay vì khoác cho chủ đề chiếc
                áo huyền bí.
              </p>
              <p>Cần chốt ngay bốn điều tướng mặt KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một phép đo.</strong> Không có đại lượng nào được đo, không có
                  đơn vị nào được dùng, không có ngưỡng nào để so. Nó là một hệ thống phân loại và ẩn
                  dụ — hữu ích để mô tả, không đủ để kết luận.
                </li>
                <li>
                  <strong>Không phải bản án của cả đời.</strong> Chính truyền thống nói “tướng tự tâm
                  sinh”: nét mặt phản ánh nếp sống hiện tại và thay đổi theo thời gian. Một tấm ảnh
                  là một lát cắt của một giai đoạn.
                </li>
                <li>
                  <strong>Không phải căn cứ để đánh giá người khác.</strong> Đây là ranh giới quan
                  trọng nhất của bài, và mục{' '}
                  <Link href="#trang-thai-bang-chung" className={A}>trạng thái bằng chứng</Link> ở
                  giữa bài nói kỹ vì sao.
                </li>
                <li>
                  <strong>Không phải thứ công cụ trên web này tính ra.</strong> Ba khung ở trên là
                  kiến thức nền do bài học cung cấp. Công cụ chỉ đọc ảnh rồi viết văn — mục{' '}
                  <Link href="#cong-cu-lam-gi" className={A}>công cụ làm gì</Link> mở hộp đen ấy ra.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Một phạm vi bài này cố ý không lấn: xem chỉ tay là chế độ còn lại của cùng công cụ và
                có bài riêng —{' '}
                <Link href="/learn/palm" className={A}>bài Xem chỉ tay</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <TuongMatDepth />,
        },
        {
          id: 'he-hinh-tuong',
          tocLabel: 'Hệ hình tượng',
          heading: 'Hệ hình tượng: người xưa đọc mặt theo khung nào',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ba bảng dưới đây là <strong>di sản văn hoá</strong>, không phải phép tính. Chúng ghi
                cách chia phổ biến trong các bản in nhân tướng học; các bản khác nhau có xê dịch về
                vị trí và tên gọi, và không bản nào là bản chuẩn duy nhất. Đọc chúng để hiểu{' '}
                <strong>cách người xưa tổ chức cái nhìn</strong>, không phải để tự chấm điểm mình.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Tam đình — chia mặt làm {TAM_DINH.length} tầng
              </h3>
              <Scroller minWidth="min-w-[620px]">
                <TableHead cols={['Tầng', 'Vùng trên khuôn mặt', 'Quãng đời được gán']} />
                <tbody>
                  {TAM_DINH.map((r) => (
                    <tr key={r.ten} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {r.ten}
                      </th>
                      <td className={TD}>{r.vung}</td>
                      <td className={TD}>{r.gan}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Chi tiết hay bị kể sót nhất nằm ngay ở đây: canon nhấn mạnh{' '}
                <strong>sự cân đối giữa {TAM_DINH.length} tầng</strong>, chứ không xếp hạng từng
                tầng. “Ba đình cân nhau” mới là điều người xưa khen. Câu cửa miệng kiểu “trán cao thì
                sáng dạ” là bản kể tắt ngoài dân gian — nó bỏ mất phần tương quan, và đó đúng là chỗ
                biến một khung mô tả thành một lời phán về ngoại hình.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ngũ quan — {NGU_QUAN.length} “cơ quan” của gương mặt
              </h3>
              <p>
                Mỗi bộ phận được coi như một chức quan, có việc riêng. Cách đặt tên này cho thấy rõ
                lối tư duy của hệ thống: <strong>gương mặt được hình dung như một triều đình nhỏ</strong>,
                mỗi bộ phận giữ một phần việc.
              </p>
              <Scroller minWidth="min-w-[620px]">
                <TableHead cols={['Bộ phận', 'Tên trong canon', 'Việc được gán']} />
                <tbody>
                  {NGU_QUAN.map((r) => (
                    <tr key={r.bo} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {r.bo}
                      </th>
                      <td className={TD}>{r.ten}</td>
                      <td className={TD}>{r.nghia}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Đáng chú ý: trán và cằm <strong>không</strong> nằm trong ngũ quan — chúng được đọc
                bằng hai khung còn lại: tam đình, và các cung ở trán, ở cằm trong bảng dưới. Còn lông
                mày thì lại là một “quan” riêng, điều làm nhiều người ngạc nhiên. Hai cách chia này không phải hai phiên bản của nhau; chúng là hai lớp nhìn
                khác nhau, chồng lên cùng một khuôn mặt.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Thập nhị cung — {THAP_NHI_CUNG.length} vùng trải khắp gương mặt
              </h3>
              <p>
                Đây là lớp phân giải chi tiết nhất, và cũng là lớp mà các bản in khác nhau nhiều
                nhất. Mỗi cung là một vùng nhỏ, ứng với một mảng việc.
              </p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['Cung', 'Vị trí thường được ghi', 'Mảng việc được gán']} />
                <tbody>
                  {THAP_NHI_CUNG.map((r) => (
                    <tr key={r.ten} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {r.ten}
                      </th>
                      <td className={TD}>{r.viTri}</td>
                      <td className={TD}>{r.viec}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Ba khung này <strong>chồng lên nhau chứ không rời nhau</strong>. Cùng một cái mũi vừa
                thuộc trung đình, vừa là Thẩm biện quan trong ngũ quan, vừa là Tài bạch cung trong
                thập nhị cung. Ba tên gọi cho một bộ phận.
              </p>
              <p className="text-sm text-foreground/70">
                Sự chồng lấn đó vừa là vẻ đẹp vừa là điểm yếu của hệ thống. Vẻ đẹp: nó cho người luận
                một ngôn ngữ giàu để mô tả. Điểm yếu: nó cũng cho{' '}
                <strong>ba cách nói khác nhau về cùng một quan sát</strong>, nên gần như luôn tìm
                được một cách nghe hợp lý — kể cả khi quan sát ban đầu chẳng nói lên điều gì.
              </p>
            </div>
          ),
        },
        {
          id: 'cong-cu-lam-gi',
          tocLabel: 'Công cụ làm gì',
          heading: 'Công cụ Xem tướng thật sự làm gì với tấm ảnh của bạn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này mở hộp đen. Bảng dưới là đường đi của một tấm ảnh, đọc thẳng từ mã của trang
                công cụ chứ không phải mô tả tiếp thị — <strong>{PIPELINE.length} bước</strong>, và
                không có bước nào là đo đạc. Một ranh giới cần nói trước: mã chạy trong trình duyệt
                chỉ cho biết cái gì được gửi đi và cái gì nhận về. Phần chạy trên máy chủ thì phải
                đọc mã máy chủ mới biết — bài này đã đọc, và chỗ nào là chuyện xảy ra bên ngoài tầm
                với của hieu.asia thì bài nói thẳng ra như vậy.
              </p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['Bước', 'Chuyện gì xảy ra', 'Chi tiết']} />
                <tbody>
                  {PIPELINE.map((s, i) => (
                    <tr key={s.buoc} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 tabular-nums font-medium text-foreground">{i + 1}</td>
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {s.buoc}
                      </th>
                      <td className={TD}>{s.chiTiet}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Đọc bảng theo chiều dữ liệu thì thấy rất gọn: <strong>một tấm ảnh vào</strong>,{' '}
                <strong>một đoạn văn ra</strong>. Về bạn, công cụ chỉ hỏi đúng hai thứ — tấm ảnh và ô
                giới tính (cộng vé đăng nhập nếu bạn đã đăng nhập, để máy chủ biết đây là tài khoản
                nào); ô thứ ba trên form chỉ là nút chọn chế độ xem. Nó không biết bạn bao nhiêu
                tuổi, làm nghề gì, đang lo chuyện gì.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Những việc công cụ KHÔNG làm</h3>
              <ul className="list-disc space-y-2 pl-5">
                {NOT_DOING.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>

              <p>
                Có một hệ quả kỹ thuật đáng nhớ khi đọc kết quả. Đây là{' '}
                <strong>đầu ra của một mô hình ngôn ngữ</strong>, không phải đầu ra của một bảng tra
                cố định. Các công cụ lịch pháp trên site — tra can chi, tra ngày giờ — cùng đầu vào
                thì luôn cho cùng đầu ra; ở đây thì không có gì bảo đảm như vậy. Ánh sáng, góc chụp,
                biểu cảm, hay đơn giản là một lần chạy khác, đều có thể cho câu chữ khác.
              </p>
              <p className="text-sm text-foreground/70">
                Cộng thêm bước nén ảnh xuống tối đa {RESIZE_MAX_PX} điểm ảnh cạnh dài, kết luận thực
                dụng là: <strong>đừng đọc kết quả như một phép đo</strong>. Nếu một đoạn luận nghe
                như đang mô tả từng nét li ti thật chính xác, thứ bạn đang gặp là giọng văn tự tin,
                không phải độ phân giải.
              </p>
            </div>
          ),
        },
        {
          id: 'trang-thai-bang-chung',
          tocLabel: 'Trạng thái bằng chứng',
          heading: 'Trạng thái bằng chứng: khoa học nói gì, và lịch sử đã dùng nó vào việc gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phần bài này buộc phải nói thẳng, vì nó là chỗ chủ đề tướng mặt khác hẳn các
                chủ đề lịch pháp trên site. Câu trả lời ngắn:{' '}
                <strong>
                  các nghiên cứu tâm lý học hiện đại không tìm thấy liên hệ ổn định giữa đặc điểm
                  khuôn mặt và tính cách
                </strong>
                . Không phải “chưa đủ dữ liệu”, mà là đã tìm và không thấy thứ đủ ổn định để dựa vào.
              </p>
              <p>
                Nhưng có một phát hiện khác rất đáng học, vì nó giải thích tại sao xem tướng lại
                thuyết phục đến vậy: con người{' '}
                <strong>rất đồng thuận với nhau về ấn tượng</strong> rút ra từ một gương mặt. Đưa một
                tấm ảnh cho nhiều người, phần lớn sẽ rút ra kết luận na ná nhau — người này trông
                đáng tin, người kia trông nghiêm khắc — và họ rút ra gần như tức thì, trước cả khi
                kịp nghĩ.
              </p>
              <p>
                Hai điều đó ghép lại thành bài học cốt lõi của bài học này:{' '}
                <strong>đồng thuận không phải chính xác</strong>. Việc mọi người cùng thấy một ấn
                tượng chỉ chứng minh chúng ta chia chung một khuôn mẫu; nó đo cái nằm trong đầu người
                xem, không đo cái nằm ở người được xem. Muốn biết đúng hay sai thì phải đo tính cách
                người đó bằng một cách độc lập rồi đối chiếu — và đó chính là chỗ liên hệ biến mất.
              </p>
              <p>
                Có thêm một cơ chế nữa khiến bản thân đoạn luận nghe trúng: mô tả tính cách viết đủ
                co giãn thì gần như ai đọc cũng thấy giống mình. Hiện tượng ấy có tên và có bài
                riêng —{' '}
                <Link href="/learn/barnum" className={A}>bài Hiệu ứng Barnum</Link>. Còn muốn biết
                cách tự kiểm một lời đoán thay vì chỉ nhớ những lần trúng, đọc{' '}
                <Link href="/learn/kiem-chung" className={A}>bài Kiểm chứng dự đoán</Link>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Vì sao “đo mặt đoán người” là một chủ đề nhạy cảm
              </h3>
              <p>
                Phần lịch sử này cần được nói ra, chứ không nên lướt qua. Ở châu Âu thế kỷ 19, việc
                đo mặt và đo sọ từng được dựng lên thành một thứ khoa học có vẻ nghiêm túc — đo đạc,
                bảng biểu, thuật ngữ đầy đủ — với tuyên bố rằng có thể nhận ra “loại người” qua hình
                dạng đầu và khuôn mặt, trong đó có cả tuyên bố nhận ra kẻ phạm tội bẩm sinh. Những hệ
                thống ấy về sau bị bác bỏ về mặt khoa học, nhưng trước khi bị bác bỏ, chúng đã được
                dùng để biện minh cho phân biệt chủng tộc, cho chính sách nhập cư kỳ thị và cho việc
                đối xử bất công với những nhóm người cụ thể.
              </p>
              <p>
                Điều đáng lo là kiểu sai ấy vẫn quay lại dưới lớp áo mới. Vài năm gần đây có những
                công bố tuyên bố đoán được đặc điểm cá nhân từ ảnh chân dung bằng học máy, và chúng
                bị phê phán vì đúng một lỗi cũ:{' '}
                <strong>cái mô hình bắt được thường là hoàn cảnh chụp ảnh</strong> — kiểu ảnh, ánh
                sáng, cách chải chuốt, thậm chí nguồn gốc bộ dữ liệu — chứ không phải khuôn mặt.
                Chính xác cao trên một bộ dữ liệu không có nghĩa là đã tìm ra một quy luật về con
                người.
              </p>
              <p className="text-sm text-foreground/70">
                Nói vậy không phải để chê người xưa. Người xưa quan sát trong điều kiện không có công
                cụ kiểm chứng, và họ để lại một hệ hình tượng rất đẹp. Vấn đề chỉ phát sinh khi hệ
                hình tượng đó được dùng như <strong>căn cứ để quyết định về người khác</strong> — và
                đó là ranh giới bài này đề nghị bạn giữ.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: đọc như di sản và như bài tập quan sát',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Gom lại thành những đường ranh rõ ràng, để bạn dùng được ngay mà không phải nhớ cả
                bài.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không dùng lên người khác.</strong> Tuyển dụng, cho vay, chọn bạn đời, xét
                  người lạ — khuôn mặt không phải căn cứ. Người trong ảnh không có mặt để phản bác,
                  và một nhận xét về ngoại hình thì rất khó gỡ. Trang công cụ cũng ghi rõ chỉ nên gửi
                  ảnh của chính bạn, hoặc ảnh người khác khi đã được họ đồng ý.
                </li>
                <li>
                  <strong>Không phán số mệnh, không có tướng “xấu”.</strong> Không một đường nét nào
                  trên một tấm ảnh định đoạt được cuộc đời ai. Nếu ở đâu đó bạn gặp một lời phán về
                  vận hạn kèm theo lời mời mua vật phẩm hoá giải, thì thứ đang được bán là nỗi lo, và
                  hieu.asia không làm việc đó.
                </li>
                <li>
                  <strong>Không thay lời khuyên chuyên môn.</strong> Công cụ không chẩn đoán sức khoẻ
                  hay tâm lý và không đoán tương lai. Một nốt lạ trên da thì đi khám da liễu, không
                  tra tướng số; một quyết định tiền bạc thì nhìn dòng tiền, không nhìn cánh mũi.
                </li>
                <li>
                  <strong>Đừng đọc kết quả như một kết luận.</strong> Nó là văn bản do mô hình sinh
                  ra từ một tấm ảnh đã nén; không có gì bảo đảm hai lần chạy cho cùng câu chữ, không
                  có điểm số, không có ngưỡng.
                  Coi nó là một tấm gương lạ thì được, coi nó là hồ sơ đánh giá thì không.
                </li>
              </ul>
              <p>
                Vậy giữ lại được gì? Hai thứ, và cả hai đều thật.{' '}
                <strong>Một là di sản văn hoá</strong>: biết tam đình, ngũ quan, thập nhị cung là
                biết một phần ngôn ngữ mà ông bà mình dùng để nói về con người — nó nằm trong ca dao,
                trong tuồng chèo, trong cách người Việt tả người.{' '}
                <strong>Hai là bài tập quan sát</strong>: hệ thống này buộc người dùng nó phải nhìn
                kỹ và mô tả trước khi kết luận, mà tách được “mô tả” khỏi “phán xét” vốn là một kỹ
                năng hiếm.
              </p>
              <p className="text-sm text-foreground/70">
                Muốn thấy chủ đề này nằm ở đâu so với các lăng kính khác trên site — cái nào có phép
                tính tái lập được, cái nào không — đọc{' '}
                <Link href="/learn/so-sanh-lang-kinh" className={A}>bài So sánh lăng kính</Link>. Còn
                lập trường chung của site về những gì được khẳng định và không được khẳng định nằm ở{' '}
                <Link href="/methodology" className={A}>trang Phương pháp luận</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <TuongMatWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <TuongMatRecall />,
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
                Chế độ còn lại của cùng công cụ có bài riêng và sâu hơn về đường nét bàn tay:{' '}
                <Link href="/learn/palm" className={A}>bài Xem chỉ tay</Link>. Muốn hiểu vì sao một
                đoạn mô tả tính cách lại nghe trúng với gần như mọi người, đọc{' '}
                <Link href="/learn/barnum" className={A}>bài Hiệu ứng Barnum</Link>; muốn tự kiểm một
                lời đoán một cách sòng phẳng, đọc{' '}
                <Link href="/learn/kiem-chung" className={A}>bài Kiểm chứng dự đoán</Link>.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Nếu bạn muốn một bức tranh về tính cách dựa trên câu trả lời của chính bạn thay vì
                một tấm ảnh, các bảng hỏi dưới đây là lối đi phù hợp hơn — chúng ít nhất hỏi thẳng
                bạn, và bạn kiểm được từng câu trả lời của mình.
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/xem-tuong', label: 'Tải ảnh và xem tướng mặt' },
                    { href: '/mbti', label: 'Trắc nghiệm MBTI 16 nhóm' },
                    { href: '/big-five', label: 'Trắc nghiệm Big Five' },
                    { href: '/disc', label: 'Trắc nghiệm DISC hành vi' },
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
          children: <TuongMatChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
