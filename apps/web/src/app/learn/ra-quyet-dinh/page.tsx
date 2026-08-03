/**
 * Bài học /learn/ra-quyet-dinh — bài CHÍNH THỨC về cách dùng lăng kính khi
 * đứng trước một quyết định lớn. Công cụ tương ứng: /decision-simulator.
 *
 * GROUNDING — mọi dữ kiện về công cụ import từ ./_active-learning (MỘT nguồn
 * duy nhất; xem phần GROUNDING đầy đủ ở đầu file đó): CRITERIA, TOPIC_LABELS,
 * TITLE_MIN, TITLE_MAX, DESC_MAX, CHOICE_SLOTS, ANSWERS_TO_WRITE,
 * CRITERION_NAMES. Nguồn gốc của các hằng số đó là app/decision-simulator/
 * page.tsx (đã đọc hết, gồm cả component con ChoiceFields) và
 * app/decision-simulator/layout.tsx. KHÔNG gõ tay lại con số nào ở đây — mọi
 * số lượng đều render bằng `.length`.
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ: hiện ra một bộ câu hỏi cố định kèm tên hai lựa chọn
 * người dùng vừa gõ. KHÔNG chấm điểm, KHÔNG xếp hạng, KHÔNG khuyến nghị, KHÔNG
 * đọc lá số / trắc nghiệm tính cách, KHÔNG lưu dữ liệu, và chủ đề KHÔNG làm đổi
 * bộ tiêu chí. Bài này nói thẳng những phần đó là phần công cụ không có, nên
 * không dạy — thay vì gán cho công cụ thứ nó không làm.
 *
 * PHẠM VI: vì sao lời chung chung nghe đúng → bài /learn/barnum (link, không
 * giảng lại); cách kiểm một lời tiên đoán bằng dữ kiện → bài /learn/kiem-chung
 * (link, không giảng lại). Bài so sánh hai lăng kính đang viết song song, chưa
 * tồn tại nên không có link nào trỏ tới.
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
  RaQuyetDinhFrame,
  RaQuyetDinhDepth,
  RaQuyetDinhRecall,
  RaQuyetDinhChecklist,
  RaQuyetDinhWhys,
  CRITERIA,
  TOPIC_LABELS,
  TITLE_MIN,
  TITLE_MAX,
  DESC_MAX,
  CHOICE_SLOTS,
  ANSWERS_TO_WRITE,
  CRITERION_NAMES,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤47 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: 'Ra quyết định: lăng kính mở rộng lựa chọn',
  // ≤160 ký tự.
  description:
    'Lăng kính không chọn hộ bạn — nó giúp liệt kê những mặt bạn chưa nghĩ tới. Ba thiên kiến hay gặp khi quyết định lớn, và quy trình 5 bước dùng được ngay.',
  alternates: { canonical: 'https://hieu.asia/learn/ra-quyet-dinh' },
};

const A = 'text-gold-700 underline-offset-4 hover:underline';
const TD = 'px-4 py-2 align-top text-muted-foreground';

function TableHead({ cols }: { cols: readonly string[] }) {
  return (
    <thead>
      <tr className="border-b border-border bg-card/60">
        {cols.map((c) => (
          <th key={c} scope="col" className="px-4 py-2.5 text-left font-semibold text-foreground">
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

// --- Dữ kiện của bài (khai một lần, đếm bằng .length) ------------------------

/**
 * Ba thiên kiến hay bẻ cong một quyết định lớn. Mỗi dòng phải có VÍ DỤ THẬT SỰ
 * kích hoạt đúng thiên kiến đó — không dùng chung một ví dụ cho cả ba.
 */
const BIASES = [
  {
    ten: 'Neo vào phương án đầu',
    trongDau: '“Cái này có bằng phương án ban đầu của tôi không?”',
    viDu:
      'Bạn nghĩ ra “nghỉ việc mở quán cà phê” trước tiên. Từ đó, mọi phương án sau (xin chuyển bộ phận, làm thêm buổi tối, thương lượng lương) đều bị đem ra so với cái quán — chứ không so với tiêu chí của bạn. Phương án đầu đã biến thành cái thước.',
    dauHieu: 'Bạn mô tả các phương án khác bằng cách nói chúng giống hay khác phương án đầu.',
    cauHoiPha: 'Nếu phương án đầu chưa từng xuất hiện trong đầu tôi, tôi sẽ so những cái còn lại với nhau bằng thước nào?',
  },
  {
    ten: 'Sợ mất mát',
    trongDau: '“Bỏ đi thì mất hết những gì đang có.”',
    viDu:
      'Việc mới trả cao hơn, nhưng đổi lại bạn mất nhóm đồng nghiệp hợp ý, mất chỗ ngồi quen, mất phụ cấp đi lại. Trên giấy bạn lời; trong đầu, danh sách “những thứ sẽ mất” đọc nặng hơn hẳn danh sách “những thứ sẽ được” cùng độ lớn — nên bạn ở lại mà vẫn thấy mình đang quyết định tỉnh táo.',
    dauHieu:
      'Bạn liệt kê phần sẽ mất chi tiết hơn hẳn phần sẽ được, và tính cả những thứ đã bỏ ra rồi không lấy lại được nữa.',
    cauHoiPha:
      'Nếu hôm nay tôi đang ở bên kia và được mời quay về đây với đúng điều kiện này, tôi có nhận không?',
  },
  {
    ten: 'Tìm thông tin xác nhận',
    trongDau: '“Để tôi tìm thêm cho chắc” — nhưng chỉ tìm phía mình đã nghiêng.',
    viDu:
      'Đã muốn đi du học, bạn đọc các bài “du học đổi đời tôi” và hỏi những người đã đi, chứ không hỏi những người đã bỏ về giữa chừng. Cùng cơ chế: gieo quẻ ra kết quả không vừa ý thì gieo lại, và dừng đúng lúc ra kết quả mình muốn.',
    dauHieu: 'Bạn dừng tìm hiểu ngay khi gặp thông tin ủng hộ, và tìm tiếp khi gặp thông tin ngược.',
    cauHoiPha: 'Tôi đã chủ động đi tìm ai là người phản đối lựa chọn này, và nghe hết lý do của họ chưa?',
  },
];

/** Vì sao hỏi một hệ bói “nên chọn A hay B” là đặt sai câu hỏi. */
const WRONG_QUESTION_REASONS = [
  {
    tang: 'Tầng thông tin',
    y: 'Đầu vào của phép tính không chứa dữ kiện nào về A và B. Ngày giờ sinh, một lần gieo, một bộ bài — không cái nào biết lương bao nhiêu, hợp đồng ràng buộc gì, sức khoẻ của mẹ bạn ra sao. Đầu ra không thể chứa thông tin mà đầu vào chưa từng nhận.',
  },
  {
    tang: 'Tầng kiểm chứng',
    y: 'Bạn chỉ sống được một nhánh. Không có nhánh đối chứng để so, nên gần như không bao giờ biết lời khuyên ấy đúng hay sai — kể cả nhiều năm sau.',
  },
  {
    tang: 'Tầng diễn giải',
    y: 'Một câu chung chung sẽ tự khớp vào phương án bạn đã nghiêng sẵn. Bạn tưởng vừa nhận được một ý kiến độc lập, trong khi thật ra vừa nghe lại chính mình bằng một giọng khác.',
  },
  {
    tang: 'Tầng khung câu hỏi',
    y: 'Chữ “hay” trong “A hay B” đã chốt sẵn rằng chỉ có hai đường. Rất nhiều quyết định lớn có đường thứ ba tốt hơn cả hai — làm thử ở quy mô nhỏ, hoãn kèm điều kiện, thương lượng lại, hoặc làm cả hai trong sáu tháng. Hỏi kiểu nhị phân là tự bỏ mất phần đó trước khi bắt đầu.',
  },
  {
    tang: 'Tầng trách nhiệm',
    y: 'Một câu trả lời dứt khoát từ bên ngoài nghe rất nhẹ người vì nó cầm hộ phần trách nhiệm. Nhưng nếu hỏng, bài học cũng đi theo: lỗi đã được gán cho quẻ, cho số, cho thầy — còn bạn không rút được gì cho lần sau.',
  },
];

/** Quy trình dùng được ngay. Mỗi bước: làm gì → vì sao bước đó cần. */
const STEPS = [
  {
    lam: 'Viết tiêu chí và ngưỡng TRƯỚC khi mở bất kỳ kết quả nào',
    chiTiet:
      'Ba đến năm dòng là đủ: bạn đang tối ưu cái gì, và mức nào thì gọi là đạt. Ví dụ “thu nhập không thấp hơn hiện tại quá 15%”, “về nhà trước 7 giờ tối ít nhất bốn ngày một tuần”.',
    viSao:
      'Viết sau khi đã xem kết quả thì tiêu chí sẽ tự uốn theo kết quả — bạn sẽ thấy tiêu chí nào cũng hợp lý miễn nó dẫn tới điều mình đã muốn.',
  },
  {
    lam: 'Mở rộng từ hai ô ra ít nhất ba phương án',
    chiTiet:
      'Thêm vào danh sách: bản thu nhỏ của A, bản thu nhỏ của B, “chưa phải bây giờ, xem lại sau ba tháng nếu điều kiện X thành”, và “thương lượng lại chính chỗ đang có”.',
    viSao:
      'Đây là bước có giá trị lớn nhất và hay bị bỏ nhất. Câu hỏi nhị phân che mất những đường ít rủi ro hơn cả hai đường đang cân.',
  },
  {
    lam: 'Trả lời từng câu hỏi cho CẢ hai bên, không bỏ trống',
    chiTiet:
      'Đây là chỗ dùng công cụ. Với mỗi tiêu chí, viết một câu cho A và một câu cho B — đủ bộ là ' +
      ANSWERS_TO_WRITE +
      ' ô.',
    viSao:
      'Ô nào bạn không viết nổi chính là chỗ bạn chưa biết. Phát hiện ra một chỗ trống có giá hơn nhiều so với một lời phán, vì chỗ trống thì đi hỏi được người thật.',
  },
  {
    lam: 'Đặt câu hỏi ngược cho từng phương án',
    chiTiet:
      'Với mỗi bên, viết ra: điều kiện nào khiến nó là lựa chọn đúng, và dấu hiệu nào sẽ cho bạn biết nó đang sai. Tiêu chí “' +
      CRITERION_NAMES.condition +
      '” của công cụ hỏi đúng vế đầu.',
    viSao:
      'Không có dấu hiệu sai thì bạn không có cách nào phát hiện sớm, và sẽ chịu đựng lâu hơn mức cần thiết trước khi nhìn lại.',
  },
  {
    lam: 'Làm phép thử lật, rồi ghi lại quyết định',
    chiTiet:
      'Tự hỏi: “nếu kết quả tra cứu ra ngược lại, tôi có đổi ý không?”. Sau đó ghi ba dòng vào một chỗ cố định: tôi chọn gì, vì tiêu chí nào, và ngày nào sẽ đọc lại.',
    viSao:
      'Trả lời “không” nghĩa là bạn đã quyết xong và đang tìm giấy phép — biết vậy thì đỡ mất thời gian. Còn bản ghi ba dòng là thứ duy nhất giúp bạn học được từ quyết định này, thay vì nhớ lại nó theo cách có lợi cho mình.',
  },
];

/** Công cụ CÓ gì và KHÔNG có gì — cột phải là phần bài học cố ý không dạy. */
const TOOL_SCOPE = [
  {
    phan: 'Nhận vào',
    co: `${CHOICE_SLOTS} tiêu đề (mỗi tiêu đề ${TITLE_MIN}–${TITLE_MAX} ký tự), mô tả tuỳ chọn tối đa ${DESC_MAX} ký tự cho mỗi bên, và một chủ đề trong ${TOPIC_LABELS.length} chủ đề.`,
    khong: 'Không nhận ngày giờ sinh, không nhận kết quả trắc nghiệm tính cách, không nhận số liệu tài chính.',
  },
  {
    phan: 'Xử lý',
    co: 'Kiểm tra độ dài phần nhập rồi hiện khung câu hỏi ra ngay trên trình duyệt.',
    khong: 'Không có phép tính nào, không gọi máy chủ, không gọi AI. Bấm nút chỉ làm hiện phần đang ẩn.',
  },
  {
    phan: 'Trả ra',
    co: `${CRITERIA.length} tiêu chí, mỗi tiêu chí là một câu hỏi, kèm tên hai lựa chọn của bạn đặt cạnh nhau để bạn tự đối chiếu.`,
    khong: 'Không điểm số, không phần trăm, không xếp hạng, không câu kết luận “nên chọn A”.',
  },
  {
    phan: 'Chủ đề bạn chọn',
    co: 'Xuất hiện lại ở dòng phụ đề của bản PDF tải về.',
    khong: 'Không làm đổi bộ tiêu chí — bộ câu hỏi là cố định cho mọi chủ đề.',
  },
  {
    phan: 'Mô tả bạn gõ thêm',
    co: 'Được đưa vào bản PDF dưới mục bối cảnh của từng lựa chọn.',
    khong: 'Không hiện trong khung câu hỏi trên màn hình — ở đó chỉ có tiêu đề của hai lựa chọn.',
  },
  {
    phan: 'Sau khi bạn rời trang',
    co: 'Bản PDF nếu đã tải thì vẫn còn trên máy bạn.',
    khong:
      'Trang không giữ lại nội dung bạn gõ — không tài khoản, không lịch sử, mở lại là trang trắng. Nội dung chỉ rời khỏi trình duyệt đúng một lúc: khi bạn bấm tải PDF, nó được gửi sang máy chủ để dựng file.',
  },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ trong
// schema đúng bằng chữ trên trang. Cố ý KHÔNG trùng câu hỏi với /learn/barnum
// (ở đó hỏi về cơ chế khiến lời mơ hồ nghe đúng) và /learn/kiem-chung (ở đó hỏi
// về khả sai và tỉ lệ nền).
const FAQS = [
  {
    q: 'Công cụ Mô Phỏng Quyết Định có nói cho tôi biết nên chọn A hay B không?',
    a: `Không, và đó là thiết kế có chủ ý. Bạn gõ tên ${CHOICE_SLOTS} lựa chọn, công cụ hiện ra ${CRITERIA.length} tiêu chí — mỗi tiêu chí là một câu hỏi — rồi đặt tên hai lựa chọn của bạn cạnh từng câu để bạn tự đối chiếu. Trong mã không có bước chấm điểm, không có bước xếp hạng và không có câu kết luận nào. Chính trang công cụ ghi rõ ở đầu rằng đây là khung giúp bạn tự cân nhắc, không phải máy chấm điểm hộ.`,
  },
  {
    q: 'Vì sao hỏi tử vi hay gieo quẻ “nên chọn A hay B” lại là đặt sai câu hỏi?',
    a: `Vì đầu vào của những phép tính đó không chứa dữ kiện nào về A và B. Ngày giờ sinh hay một lần gieo không biết lương bao nhiêu, hợp đồng ràng buộc gì, gia đình bạn đang cần gì — nên đầu ra không thể chứa thông tin về hai lựa chọn ấy. Thêm vào đó, bạn chỉ sống một nhánh nên không có gì để đối chiếu xem lời khuyên đúng hay sai; và một câu chung chung sẽ tự khớp vào phương án bạn đã nghiêng sẵn. Câu hỏi dùng được thì khác hẳn: “tôi đang chưa nhìn thấy mặt nào của việc này?”`,
  },
  {
    q: 'Vậy xem lăng kính trước một quyết định lớn có ích gì không?',
    a: 'Có, nếu bạn dùng nó như một bộ khơi câu hỏi. Một hệ thống có sẵn nhiều chiều — sự nghiệp, tiền bạc, sức khoẻ, quan hệ, thời điểm — sẽ kéo bạn nhìn sang những mặt bạn đang bỏ qua, đơn giản vì nó không bỏ qua mặt nào. Cái được là danh sách những điều bạn chưa nghĩ tới, chứ không phải câu trả lời. Sau khi có danh sách đó, phần quyết định vẫn là của bạn và nên là của bạn.',
  },
  {
    q: 'Chọn chủ đề Sự nghiệp hay Tài chính thì bộ tiêu chí có khác nhau không?',
    a: `Không khác. Bộ tiêu chí là một danh sách cố định trong mã, dùng chung cho cả ${TOPIC_LABELS.length} chủ đề; chủ đề bạn chọn chỉ xuất hiện lại ở dòng phụ đề của bản PDF tải về. Nói rõ điều này để bạn không kỳ vọng công cụ “hiểu ngữ cảnh” rồi thất vọng — nó không có phần đó, nên bài này cũng không dạy cách khai thác thứ nó không làm.`,
  },
  {
    q: 'Tôi muốn phần phân tích theo lá số của riêng mình thì dùng gì?',
    a: 'Đó là một sản phẩm khác trên hieu.asia, tên là Decision Brief, và nó chạy bằng AI có đọc lá số cùng kết quả trắc nghiệm tính cách của bạn. Công cụ Mô Phỏng Quyết Định thì không: nó không nhận ngày giờ sinh và không đọc hồ sơ nào cả. Dù dùng cái nào, nguyên tắc trong bài vẫn giữ nguyên — viết tiêu chí trước, mở rộng phương án, và tự chốt phần quyết định.',
  },
  {
    q: 'Công cụ có lưu lại hai lựa chọn tôi vừa gõ không?',
    a: 'Không. Mọi thứ bạn nhập chỉ nằm trong trình duyệt cho tới khi bạn rời trang; không có tài khoản, không có lịch sử, mở lại là trang trắng. Có đúng một lúc nội dung ấy rời khỏi máy bạn: khi bạn bấm tải PDF, nó được gửi sang máy chủ để dựng file. Nếu muốn giữ lại thì hãy tải bản PDF trước khi đóng tab — người đã đăng nhập tải thẳng, khách chưa đăng nhập sẽ được hỏi email trước.',
  },
  {
    q: 'Nếu tôi đã gieo quẻ rồi và kết quả ngược với thứ tôi muốn thì sao?',
    a: 'Hãy dùng nó làm một phép thử về chính mình. Nếu bạn thấy muốn gieo lại lần nữa, thì câu trả lời thật đã lộ ra rồi: bạn đã quyết xong và đang đi tìm một lời chuẩn thuận. Điều đó không có gì đáng xấu hổ, nhưng nhận ra sớm sẽ tiết kiệm được thời gian và tiền. Còn nếu bạn thật sự sẵn sàng đổi ý vì kết quả đó, hãy viết ra bạn đổi ý vì dữ kiện nào — thường thứ bạn đang thiếu là dữ kiện, không phải một lời phán.',
  },
  {
    q: 'Làm sao biết mình đã quyết định tốt hay chưa, khi chưa thấy kết quả?',
    a: 'Tách hai thứ hay bị gộp: chất lượng quá trình và chất lượng kết quả. Bạn chỉ kiểm soát được phần quá trình — có viết tiêu chí trước không, có mở rộng ra ngoài hai phương án không, có đặt điều kiện để nhận ra mình sai không, có ghi lại để đọc lại sau không. Một quá trình tốt vẫn có thể ra kết quả xấu vì rủi ro, và một quá trình cẩu thả đôi khi vẫn may. Chấm điểm bản thân bằng kết quả là học sai bài, vì lần sau bạn sẽ lặp lại đúng cái quá trình đã may.',
  },
];

const JSONLD = [
  article({
    headline: 'Ra quyết định lớn: dùng lăng kính để mở rộng lựa chọn, không phải để chọn hộ',
    description:
      'Ba thiên kiến hay bẻ cong một quyết định lớn, vì sao hỏi một hệ bói “nên chọn A hay B” là đặt sai câu hỏi, và quy trình năm bước tự chốt quyết định.',
    url: '/learn/ra-quyet-dinh',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Ra quyết định', url: '/learn/ra-quyet-dinh' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Ra quyết định lớn — dùng lăng kính đúng cách',
    description:
      'Lăng kính không chọn hộ bạn. Bài học chỉ ra ba thiên kiến hay gặp, vì sao câu hỏi “nên chọn A hay B” là sai, và quy trình năm bước để tự quyết.',
    url: '/learn/ra-quyet-dinh',
  }),
];

export default function LearnRaQuyetDinhPage() {
  return (
    <LearnArticle
      eyebrow="TƯ DUY · QUYẾT ĐỊNH"
      title={
        <>
          Ra quyết định{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (lăng kính mở rộng lựa chọn)
          </span>
        </>
      }
      standfirst={
        <>
          Trước một việc lớn, câu hỏi trong đầu thường đã rút gọn thành “chọn A hay B?” — và đó là
          lúc nhiều người đi hỏi một hệ bói. Bài này giải thích vì sao câu hỏi ấy đặt sai chỗ, ba
          thiên kiến hay bẻ cong quyết định lớn, và một quy trình năm bước để dùng lăng kính đúng
          việc: liệt kê những mặt bạn chưa nghĩ tới, rồi tự quyết.
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Ra quyết định' },
      ]}
      relatedLenses={relatedLearnLenses('ra-quyet-dinh')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Gõ tên ${CHOICE_SLOTS} lựa chọn bạn đang cân, công cụ hiện ra ${CRITERIA.length} câu hỏi để bạn tự trả lời cho cả hai bên — không chấm điểm, không chọn hộ.`,
        href: '/decision-simulator',
        label: 'Mở công cụ so sánh 2 lựa chọn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <RaQuyetDinhFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Dùng lăng kính khi ra quyết định là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                “Lăng kính” ở đây là bất cứ hệ thống nào bạn soi vào trước một quyết định: một lá số
                Tử Vi, một kết quả MBTI, một quẻ gieo, một bộ tiêu chí, hay cả một người bạn thân
                chịu ngồi nghe. Điểm chung của chúng là{' '}
                <strong>không có thông tin nào về hai lựa chọn của bạn</strong>. Không cái nào biết
                mức lương, điều khoản hợp đồng, sức khoẻ của mẹ bạn, hay việc con bạn sắp vào lớp
                một.
              </p>
              <p>
                Vì vậy thứ một lăng kính tạo ra được là <strong>câu hỏi</strong>, không phải đáp án.
                Và đó không phải lời an ủi: một bộ câu hỏi tốt buộc bạn nhìn sang những chiều bạn
                đang bỏ qua, đơn giản vì nó không bỏ qua chiều nào. Cái bạn thu được là{' '}
                <strong>danh sách những điều mình chưa nghĩ tới</strong> — thường có giá hơn nhiều
                so với một lời phán.
              </p>
              <p>Cần chốt ngay bốn điều nó KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải máy chọn hộ.</strong> Công cụ Mô Phỏng Quyết Định của hieu.asia
                  không chấm điểm cho A hay B, không xếp hạng và không kết luận. Nó đưa ra{' '}
                  {CRITERIA.length} câu hỏi rồi trả phần trả lời về cho bạn.
                </li>
                <li>
                  <strong>Không phải nguồn thông tin về tình huống của bạn.</strong> Không phép tra
                  cứu nào biết những dữ kiện quyết định chuyện thành bại. Cái gì đầu vào chưa nhận
                  thì đầu ra không thể có.
                </li>
                <li>
                  <strong>Không phải dự báo kết quả.</strong> Kể cả một lời khuyên rất hợp lý cũng
                  không kiểm được, vì bạn chỉ sống một nhánh và không có nhánh đối chứng — phần này
                  bài{' '}
                  <Link href="/learn/kiem-chung" className={A}>
                    Kiểm chứng dự đoán
                  </Link>{' '}
                  nói kỹ.
                </li>
                <li>
                  <strong>Không phải chỗ gửi trách nhiệm.</strong> Nhờ một câu trả lời bên ngoài
                  quyết hộ thì lúc hỏng, bài học cũng đi theo cái nhãn “tại số” — bạn không rút được
                  gì cho lần sau.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Hai phạm vi bài này cố ý không lấn: vì sao một lời mô tả chung chung lại khiến ai đọc
                cũng thấy đúng thuộc bài{' '}
                <Link href="/learn/barnum" className={A}>
                  Hiệu ứng Barnum
                </Link>
                ; còn cách kiểm một lời tiên đoán bằng dữ kiện đã xảy ra thuộc bài{' '}
                <Link href="/learn/kiem-chung" className={A}>
                  Kiểm chứng dự đoán
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <RaQuyetDinhDepth />,
        },
        {
          id: 'ba-thien-kien',
          tocLabel: 'Ba thiên kiến',
          heading: 'Ba thiên kiến hay bẻ cong một quyết định lớn',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Trước khi bàn tới việc soi lăng kính nào, đáng nhìn vào chỗ hỏng thường xảy ra sớm
                hơn: cách bạn dựng bài toán. {BIASES.length} thiên kiến dưới đây không phải chuyện
                của người nhẹ dạ — chúng xuất hiện ở cả những người rất tỉnh táo, và thường{' '}
                <strong>không cảm thấy như thiên kiến</strong> mà cảm thấy như suy nghĩ hợp lý.
              </p>
              <Scroller minWidth="min-w-[820px]">
                <TableHead cols={['Thiên kiến', 'Nghe như thế nào trong đầu', 'Ví dụ', 'Câu hỏi phá thế']} />
                <tbody>
                  {BIASES.map((b) => (
                    <tr key={b.ten} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left align-top font-medium text-foreground">
                        {b.ten}
                      </th>
                      <td className={TD}>{b.trongDau}</td>
                      <td className={TD}>{b.viDu}</td>
                      <td className="px-4 py-2 align-top text-foreground">{b.cauHoiPha}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <h3 className="text-lg font-semibold text-foreground">Dấu hiệu nhận ra ngay trên chính câu chữ của bạn</h3>
              <ul className="list-disc space-y-2 pl-5">
                {BIASES.map((b) => (
                  <li key={b.ten}>
                    <strong>{b.ten}:</strong> {b.dauHieu}
                  </li>
                ))}
              </ul>
              <p>
                Ba cái này hay đi thành chuỗi: bạn <strong>neo</strong> vào phương án nghĩ ra đầu
                tiên, rồi <strong>sợ mất</strong> những gì đã bỏ vào nó, rồi đi{' '}
                <strong>tìm thông tin xác nhận</strong> cho lựa chọn đã nghiêng. Đến lúc mở một hệ
                tra cứu ra, bạn không còn đang hỏi nữa — bạn đang xin một chữ ký.
              </p>
              <p className="text-sm text-foreground/70">
                Cơ chế khiến lời chung chung nghe như nói riêng cho mình là chuyện của bài{' '}
                <Link href="/learn/barnum" className={A}>
                  Hiệu ứng Barnum
                </Link>{' '}
                — ở đây chỉ cần nhớ rằng nó cộng hưởng rất mạnh với thiên kiến thứ ba trong bảng.
              </p>
            </div>
          ),
        },
        {
          id: 'cau-hoi-sai',
          tocLabel: 'Câu hỏi đặt sai',
          heading: 'Vì sao hỏi “nên chọn A hay B” là đặt sai câu hỏi',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Giả sử bạn tin vào một hệ tra cứu. Ngay cả khi tin, câu hỏi “nên chọn A hay B” vẫn
                hỏng ở {WRONG_QUESTION_REASONS.length} tầng khác nhau — và phần lớn trong số đó
                không liên quan gì tới chuyện hệ ấy đúng hay không.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                {WRONG_QUESTION_REASONS.map((r) => (
                  <li key={r.tang}>
                    <strong>{r.tang}.</strong> {r.y}
                  </li>
                ))}
              </ol>
              <p>
                Chú ý tầng thứ tư: đó là tầng tốn kém nhất và ít ai để ý nhất. Khi bạn gõ vào ô tìm
                kiếm “nên nghỉ việc hay ở lại”, bạn vừa xoá sổ những phương án như{' '}
                <em>xin chuyển bộ phận</em>, <em>giảm giờ làm trong sáu tháng</em>,{' '}
                <em>thương lượng lại phạm vi công việc</em>, hay{' '}
                <em>ở lại thêm một quý với điều kiện cụ thể</em> — mà rất có thể một trong số đó mới
                là đường tốt nhất.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Đổi thành câu hỏi dùng được</h3>
              <p>
                Cùng một lần tra cứu, cùng một lăng kính, chỉ đổi câu hỏi thì cái bạn thu về đổi hẳn:
              </p>
              <Scroller minWidth="min-w-[640px]">
                <TableHead cols={['Câu hỏi đặt sai', 'Câu hỏi dùng được', 'Vì sao khác']} />
                <tbody>
                  <tr className="border-b border-border/60">
                    <th scope="row" className="px-4 py-2 text-left align-top font-medium text-foreground">
                      “Tôi nên chọn A hay B?”
                    </th>
                    <td className={TD}>“Mỗi bên có mặt nào tôi chưa nghĩ tới?”</td>
                    <td className={TD}>
                      Câu sau xin một danh sách, thứ mà một bộ câu hỏi tạo ra được. Câu trước xin một
                      kết luận, thứ nằm ngoài khả năng của mọi phép tra.
                    </td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <th scope="row" className="px-4 py-2 text-left align-top font-medium text-foreground">
                      “Năm nay tôi có nên đổi việc không?”
                    </th>
                    <td className={TD}>
                      “Điều kiện nào phải đúng thì việc đổi mới hợp lý — và tôi kiểm được điều kiện
                      đó chưa?”
                    </td>
                    <td className={TD}>
                      Câu sau biến một cảm giác thành thứ kiểm được sau vài tháng, nên bạn phát hiện
                      sai sớm thay vì chịu đựng.
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-2 text-left align-top font-medium text-foreground">
                      “Kết quả này có hợp với tôi không?”
                    </th>
                    <td className={TD}>
                      “Nếu kết quả ra ngược lại, tôi có đổi ý không?”
                    </td>
                    <td className={TD}>
                      Câu sau lộ ra bạn đang hỏi thật hay đang xin chuẩn thuận — và đó là thông tin
                      quan trọng nhất trong cả lần tra cứu.
                    </td>
                  </tr>
                </tbody>
              </Scroller>
            </div>
          ),
        },
        {
          id: 'cong-cu-lam-gi',
          tocLabel: 'Công cụ làm gì',
          heading: 'Công cụ Mô Phỏng Quyết Định thật sự làm gì — và không làm gì',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Đây là phần quan trọng nhất của bài, vì nó quyết định bạn nên kỳ vọng gì. Công cụ
                được dựng đúng theo tinh thần ở trên:{' '}
                <strong>nó đưa câu hỏi, bạn đưa câu trả lời</strong>.
              </p>
              <Scroller minWidth="min-w-[820px]">
                <TableHead cols={['Phần', 'Công cụ CÓ', 'Công cụ KHÔNG có']} />
                <tbody>
                  {TOOL_SCOPE.map((t) => (
                    <tr key={t.phan} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left align-top font-medium text-foreground">
                        {t.phan}
                      </th>
                      <td className="px-4 py-2 align-top text-foreground">{t.co}</td>
                      <td className={TD}>{t.khong}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Vì công cụ không có phần chấm điểm và không có phần đọc lá số, bài này cũng{' '}
                <strong>không dạy cách cho điểm hay gán trọng số</strong> cho từng tiêu chí, và không
                dạy cách “đối chiếu lựa chọn với lá số”. Gán cho công cụ những thứ nó không làm sẽ
                khiến bạn chờ một kết quả không bao giờ hiện ra.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                {CRITERIA.length} câu hỏi bạn sẽ nhận được
              </h3>
              <p>
                Bảng dưới đây là nguyên văn bộ tiêu chí của công cụ. Đọc kỹ cột phải: tất cả đều là{' '}
                <strong>câu hỏi</strong>, không có cái nào là một mệnh đề phán xét.
              </p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['#', 'Tiêu chí', 'Câu hỏi bạn phải tự trả lời cho cả hai bên']} />
                <tbody>
                  {CRITERIA.map((c, i) => (
                    <tr key={c.name} className="border-b border-border/60 last:border-b-0">
                      <td className="px-4 py-2 align-top font-mono text-xs text-gold-700">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <th scope="row" className="px-4 py-2 text-left align-top font-medium text-foreground">
                        {c.name}
                      </th>
                      <td className={TD}>{c.question}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Tổng cộng là <strong>{ANSWERS_TO_WRITE} ô cần viết</strong> — {CRITERIA.length} câu
                hỏi nhân {CHOICE_SLOTS} lựa chọn. Nghe nhiều, nhưng đó chính là phần việc mà một lời
                phán giúp bạn né tránh, và cũng chính là phần duy nhất tạo ra hiểu biết mới. Ô nào
                bạn không viết nổi một chữ chính là <strong>thu hoạch thật</strong> của lần này: nó
                chỉ ra chỗ bạn đang thiếu thông tin, và chỗ thiếu thông tin thì đi hỏi người thật
                được.
              </p>
              <p className="text-sm text-foreground/70">
                Nếu bạn muốn một bản phân tích có đọc lá số và kết quả trắc nghiệm tính cách của
                riêng mình, đó là sản phẩm khác trên hieu.asia —{' '}
                <Link href="/decisions/new" className={A}>
                  Decision Brief
                </Link>
                . Công cụ trong bài này cố tình không nhận ngày giờ sinh.
              </p>
            </div>
          ),
        },
        {
          id: 'quy-trinh',
          tocLabel: `Quy trình ${STEPS.length} bước`,
          heading: `Quy trình ${STEPS.length} bước dùng được ngay`,
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Quy trình này không cần tin hay không tin bất cứ hệ nào. Nó chỉ sắp lại thứ tự các
                việc, và thứ tự chính là phần quan trọng: <strong>bước một phải xong trước khi bạn
                mở bất kỳ kết quả tra cứu nào</strong>.
              </p>
              <ol className="space-y-4">
                {STEPS.map((s, i) => (
                  <li
                    key={s.lam}
                    className="rounded-card-editorial border border-border bg-card/40 p-4 sm:p-5"
                  >
                    <p className="font-heading text-base font-semibold text-foreground">
                      <span aria-hidden="true" className="mr-2.5 font-mono text-sm text-gold-700">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {s.lam}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.chiTiet}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                        Vì sao{' '}
                      </span>
                      {s.viSao}
                    </p>
                  </li>
                ))}
              </ol>
              <p>
                Một lưu ý thực dụng ở bước hai: công cụ chỉ nhận {CHOICE_SLOTS} lựa chọn mỗi lượt.
                Có phương án thứ ba thì chạy thêm một lượt nữa (chẳng hạn “phương án thứ ba” đấu với
                bên đang thắng), hoặc tải bản PDF của từng lượt rồi đặt cạnh nhau. Đây là giới hạn
                của công cụ, không phải gợi ý rằng chỉ nên có hai đường.
              </p>
              <p className="text-sm text-foreground/70">
                Bước một — viết tiêu chí và ngưỡng trước khi nhìn kết quả — là cùng một nguyên tắc
                với việc khoá bảng trước khi chấm điểm một lời tiên đoán, giải thích kỹ trong bài{' '}
                <Link href="/learn/kiem-chung" className={A}>
                  Kiểm chứng dự đoán
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: quy trình tốt không bảo đảm kết quả tốt',
          children: (
            <div className="space-y-4 leading-relaxed text-foreground/85">
              <p>
                Phần này nói thẳng, để bài không tự bán quá lời. Mọi thứ ở trên chỉ tác động vào{' '}
                <strong>chất lượng quá trình</strong>. Không có gì trong đây tác động được vào{' '}
                <strong>chất lượng kết quả</strong>, vì kết quả còn phụ thuộc vào những thứ nằm ngoài
                tầm bạn.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Một quyết định tốt vẫn có thể ra kết quả xấu.</strong> Và ngược lại, một
                  quyết định cẩu thả đôi khi vẫn may. Nếu bạn chấm điểm bản thân bằng kết quả, lần
                  sau bạn sẽ lặp lại đúng cái quá trình đã gặp may — đó là học sai bài.
                </li>
                <li>
                  <strong>Viết tiêu chí ra không làm mất cảm giác.</strong> Cảm giác là dữ kiện thật
                  và đáng ghi vào bảng, chỉ đừng để nó là dữ kiện duy nhất. Người viết tiêu chí xong
                  vẫn thấy nặng lòng khi chọn — điều đó bình thường.
                </li>
                <li>
                  <strong>Công cụ trong bài là bộ khung chung.</strong> {CRITERIA.length} tiêu chí cố
                  định không thể vừa vặn với mọi tình huống; có việc cần thêm chiều (pháp lý, sức
                  khoẻ, người phụ thuộc) mà khung không hỏi. Cứ thêm dòng của riêng bạn — khung này
                  không có gì thiêng.
                </li>
                <li>
                  <strong>Bài này không thay lời khuyên chuyên môn.</strong> Quyết định liên quan tới
                  y tế, pháp lý hay một khoản vay lớn cần người có chuyên môn nhìn vào số liệu thật
                  của bạn. Một bộ câu hỏi giúp bạn chuẩn bị cho cuộc trò chuyện đó, không thay thế
                  nó.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh, gói trong một câu: dùng lăng kính để{' '}
                <strong>mở rộng danh sách những điều cần nghĩ</strong>, dùng tiêu chí của chính bạn
                để thu hẹp lại, và giữ chữ ký cuối cùng cho mình.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <RaQuyetDinhWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <RaQuyetDinhRecall />,
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
                Bài này chỉ chạm tới một mảnh của tư duy phản biện. Muốn hiểu vì sao một lời mô tả
                chung chung lại khiến ai đọc cũng gật đầu, đọc{' '}
                <Link href="/learn/barnum" className={A}>
                  bài Hiệu ứng Barnum
                </Link>
                ; muốn biết cách kiểm một lời tiên đoán bằng chính các sự kiện đã xảy ra, đọc{' '}
                <Link href="/learn/kiem-chung" className={A}>
                  bài Kiểm chứng dự đoán
                </Link>
                .
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/decision-simulator', label: 'Mô phỏng quyết định' },
                    { href: '/journal', label: 'Nhật ký quyết định' },
                    { href: '/tu-kiem', label: 'Tự kiểm — Đừng tin mù' },
                    { href: '/bang-chung', label: 'Bằng Chứng' },
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
          children: <RaQuyetDinhChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
