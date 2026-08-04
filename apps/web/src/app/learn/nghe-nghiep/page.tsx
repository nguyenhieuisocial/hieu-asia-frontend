/**
 * Bài học /learn/nghe-nghiep — bài CHÍNH THỨC về gợi ý nhóm nghề trên hieu.asia.
 * Công cụ đích: /career-fit (Nhóm Nghề).
 *
 * CÔNG CỤ THẬT SỰ TÍNH GÌ + GROUNDING: xem đầu file ./_active-learning.tsx —
 * nơi khai báo mirror của engine (repo backend, `src/tools/career-fit.ts`). MỌI
 * con số trên trang này (điểm thô, bề rộng thang, số giá trị bị kẹp ở hai đầu,
 * điểm của ba hồ sơ ví dụ) đều suy từ mirror đó, không gõ tay.
 *
 * PHẠM VI (chống trùng): KHÔNG dạy lại MBTI / DISC / Big Five — mỗi hệ có bài
 * riêng, ở đây chỉ link. KHÔNG lấn /learn/ra-quyet-dinh và /learn/so-sanh-lang-kinh.
 *
 * Giọng: mô hình gợi ý nghề đo SỞ THÍCH và THIÊN HƯỚNG, không đo năng lực, không
 * dự báo thành công; "hợp nghề" là một phân bố; phần lớn thứ quyết định sự nghiệp
 * nằm NGOÀI mọi bài trắc nghiệm.
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
  NgheNghiepFrame, NgheNghiepDepth, NgheNghiepRecall, NgheNghiepChecklist, NgheNghiepWhys,
  PREF_GROUPS, CATEGORIES, SAMPLE_CATEGORY, SCORED_PROFILES, pickLabel, type PrefKey,
  BASELINE, ELEMENT_BONUS, SCORE_MIN, SCORE_MAX, TOP_N, PREF_SWING, SWING_VS_ELEMENT,
  RAW_MIN, RAW_MAX, RAW_SPAN, RAW_AT_CEILING, RAW_AT_FLOOR,
  BIRTH_YEAR_SAMPLE, CHI_BY_SOLAR_YEAR, CHI_BY_LUNAR_YEAR,
  ELEMENT_BY_SOLAR_YEAR, ELEMENT_BY_LUNAR_YEAR,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Gợi ý nhóm nghề — trắc nghiệm đo được gì',
  description:
    'Trắc nghiệm hướng nghiệp đo sở thích, không đo năng lực. Công cụ Nhóm Nghề cộng điểm từ 5 câu bạn tự khai — kết quả là một phân bố, không phải một đáp án.',
  alternates: { canonical: 'https://hieu.asia/learn/nghe-nghiep' },
};

// --- Dữ kiện hiển thị, suy từ mirror engine ---------------------------------

const PREF_COUNT = PREF_GROUPS.length;
const CATEGORY_COUNT = CATEGORIES.length;
const SAMPLE_NAME = SAMPLE_CATEGORY?.name ?? 'nhóm mẫu';

/** Số nhóm KHÔNG lọt top — để nói đúng "3 trên 5" mà không gõ tay số. */
const NON_TOP_COUNT = CATEGORY_COUNT - TOP_N;

/** Hệ số có dấu, kiểu Việt: dùng dấu trừ thật thay vì gạch nối. */
function signed(n: number): string {
  if (n > 0) return `+${n}`;
  if (n < 0) return `−${Math.abs(n)}`;
  return '0';
}

/** Số thập phân hiển thị phải dùng dấu PHẨY — quy ước chung của khu /learn. */
const vn = (n: number) => String(n).replace('.', ',');

/** Chuỗi "lựa chọn (hệ số)" của một câu tự khai, với nhóm mẫu. */
function optionsLine(options: { label: string; coeff: number }[]): string {
  return options.map((o) => `${o.label} (${signed(o.coeff)})`).join(' · ');
}

/** Năm lựa chọn của một hồ sơ ví dụ, viết thành một dòng. */
function picksLine(picks: Record<PrefKey, string>): string {
  return PREF_GROUPS.map((g) => pickLabel(g.key, picks[g.key])).join(' · ');
}

const CASE_TOP = SCORED_PROFILES[0];
const CASE_TWIN = SCORED_PROFILES[1];
const CASE_MID = SCORED_PROFILES[2];

/** Nhãn dùng chung cho mỗi đích — một đích, một nhãn, dùng lại ở mọi chỗ. */
const CTA_LABEL = 'Thử công cụ Nhóm Nghề';
const TUVI_TOOL_LABEL = 'Tử Vi nghề nghiệp';

// FAQ khai báo MỘT lần, dùng cho CẢ accordion hiển thị lẫn FAQPage JSON-LD →
// chữ trong schema luôn khớp chữ trên trang. Câu hỏi cố ý KHÁC bộ FAQ đang có
// trên chính trang /career-fit (ở đó hỏi "có phải bói nghề không", "cần nhập
// gì"), và KHÁC các bài về bảng hỏi tính cách.
const FAQS = [
  {
    q: 'Trắc nghiệm hướng nghiệp có nói được tôi hợp nghề nào không?',
    a: `Nó nói được một nửa. Mọi mô hình loại này đo sở thích và thiên hướng — bạn muốn tự chủ tới đâu, chịu rủi ro tới đâu, thích làm việc một mình hay giữa đám đông — nên phát biểu đúng của kết quả là "nhóm nghề này hợp với kiểu làm việc bạn vừa mô tả". Nửa còn lại thì nó không chạm tới: nó không đo năng lực vì chưa từng thấy bạn làm việc thật, và không dự báo thành công vì thành công còn phụ thuộc thị trường, cơ hội, người dẫn dắt và số giờ bạn đã bỏ ra. Ba câu "hợp sở thích", "sẽ giỏi" và "sẽ thành công" khác nhau rất xa, nhưng một bảng xếp hạng có điểm số dễ khiến người đọc gộp cả ba làm một.`,
  },
  {
    q: 'Công cụ Nhóm Nghề của hieu.asia dựa vào cái gì để gợi ý?',
    a: `Dựa vào ${PREF_COUNT} lựa chọn bạn tự khai về cách mình làm việc, cộng một tín hiệu nhẹ từ năm sinh. Phép tính rất gọn: mỗi nhóm trong ${CATEGORY_COUNT} nhóm nghề khởi đầu ở điểm nền ${BASELINE}; mỗi lựa chọn của bạn cộng hoặc trừ một hệ số cố định; nếu mệnh suy từ năm sinh nằm trong danh sách mệnh ưu tiên của nhóm thì cộng thêm ${ELEMENT_BONUS} điểm; cuối cùng làm tròn và kẹp về thang ${SCORE_MIN}–${SCORE_MAX}, xếp hạng rồi lấy ${TOP_N} nhóm đầu. Không có bước nào khác. Công cụ không hỏi giờ sinh, và ngày cùng tháng sinh bạn nhập vào cũng không được dùng — chỉ năm.`,
  },
  {
    q: 'Giới tính bắt buộc nhập thì được dùng vào việc gì?',
    a: 'Không việc gì trong phần chấm điểm. Ô giới tính là bắt buộc để yêu cầu được chấp nhận, nhưng đọc mã của công cụ thì nó chỉ được kiểm tra hợp lệ rồi dừng ở đó — không một nhóm nghề nào cộng hay trừ điểm vì nó. Ngày và tháng sinh cũng vậy: chúng được kiểm tra cho đúng định dạng, sau đó chỉ phần năm được lấy ra để suy mệnh. Nói thẳng ra như vậy tốt hơn là để bạn tưởng kết quả có tính tới nhiều thứ hơn thực tế.',
  },
  {
    q: `Vì sao hai người cùng được ${SCORE_MAX}/${SCORE_MAX} mà vẫn khác nhau?`,
    a: `Vì thang hiển thị hẹp hơn phép tính bên trong. Với ${SAMPLE_NAME}, điểm thô có thể chạy từ ${RAW_MIN} tới ${RAW_MAX} — một khoảng rộng ${RAW_SPAN} điểm — rồi bị ép vào thang ${SCORE_MIN}–${SCORE_MAX}. Hệ quả là ${RAW_AT_CEILING} giá trị điểm thô khác nhau đều hiển thị thành ${SCORE_MAX}/${SCORE_MAX}, và ${RAW_AT_FLOOR} giá trị ở đầu kia đều thành ${SCORE_MIN}/${SCORE_MAX}. Điểm tối đa vì vậy không có nghĩa là "hoàn hảo", nó chỉ có nghĩa là "đã chạm trần". Đây cũng là lý do không nên đọc chênh lệch một điểm giữa hai nhóm như một sự thật.`,
  },
  {
    q: 'Nên đọc kết quả thế nào cho đúng?',
    a: `Đọc cả dải điểm thay vì chỉ nhìn nhóm đứng đầu. Những nhóm cao gần bằng nhau nên được coi là cùng một tập hướng đáng thử — thứ tự giữa chúng có thể đảo chỉ vì bạn đổi một câu trả lời, hoặc vì điểm thưởng mệnh ${ELEMENT_BONUS} điểm rơi vào nhóm này chứ không rơi vào nhóm kia. Ngược lại, nhóm nào thấp hẳn so với phần còn lại mới là tín hiệu đáng lưu tâm, vì khoảng cách lớn thì khó lật. Và ${NON_TOP_COUNT} nhóm không lọt top cũng không phải bị loại — chúng chỉ ít khớp hơn với cách bạn vừa mô tả mình.`,
  },
  {
    q: 'Kết quả của tôi khác với kết quả bài trắc nghiệm khác thì tin cái nào?',
    a: 'Đừng chọn tin cái nào. Hãy tách hai phần: phần các bài đồng ý với nhau là tín hiệu đáng tin hơn, ghi lại và ưu tiên; phần chúng mâu thuẫn thì không bài nào có thẩm quyền hơn bài nào, nên cách xử lý duy nhất còn lại là đi thử. Đặt một phép thử có thời hạn — một dự án nhỏ, một kỳ thực tập, vài tháng làm thêm buổi tối — rồi để kết quả thật của phép thử quyết định. Cái bẫy hay gặp là chọn bài nào dễ nghe nhất rồi gọi đó là "đối chiếu nhiều nguồn".',
  },
  {
    q: 'Kết quả không hợp với nghề tôi đang theo — có nên bỏ không?',
    a: 'Không nên, ít nhất là không phải vì lý do đó. Thứ bạn đã tích luỹ khi theo một nghề vài năm là số giờ làm việc thật, và đó lại đúng là thứ mà không bảng hỏi nào nhìn thấy được. Một kết quả xếp nghề bạn đang làm ở giữa bảng chỉ có nghĩa là kiểu làm việc bạn vừa tự khai không trùng khít với nhóm đó — nó không nói bạn kém, cũng không nói bạn sẽ không tiến xa. Cách dùng lành mạnh hơn: giữ việc đang làm và dùng kết quả để tìm phần việc bên trong nghề ấy hợp với bạn hơn, hoặc cắt ra một phép thử nhỏ cho hướng mới trước khi động tới việc chính.',
  },
  {
    q: 'Khác gì với Tử Vi nghề nghiệp trên cùng site?',
    a: 'Khác cả đầu vào lẫn câu hỏi được trả lời. Công cụ Nhóm Nghề chấm điểm từ những gì bạn tự khai về cách mình làm việc, nên nó phản chiếu chính lời bạn nói và đổi theo khi bạn khai khác đi. Tử Vi nghề nghiệp thì đọc cung Quan Lộc trong lá số nên cần cả ngày và giờ sinh, và nó thuộc về một hệ quy ước hoàn toàn khác. Hai cái không kiểm chứng lẫn nhau: trùng nhau cũng không làm cái nào đúng hơn, khác nhau cũng không làm cái nào sai. Nếu bạn định dùng cả hai, hãy dùng như hai góc nhìn để tự đối chiếu, không phải như hai phiếu bầu.',
  },
];

const JSONLD = [
  article({
    headline: 'Gợi ý nhóm nghề: mô hình đo được gì, không đo được gì và đọc kết quả ra sao',
    description:
      'Mô hình gợi ý nghề đo sở thích và thiên hướng tự khai, không đo năng lực và không dự báo thành công. Bài giải thích công cụ Nhóm Nghề chấm điểm ra sao và vì sao kết quả là một phân bố.',
    url: '/learn/nghe-nghiep',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Gợi ý nhóm nghề', url: '/learn/nghe-nghiep' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Gợi ý nhóm nghề — đọc trắc nghiệm hướng nghiệp cho đúng',
    description:
      'Trắc nghiệm hướng nghiệp đo sở thích, không đo năng lực. Công cụ Nhóm Nghề cộng điểm từ 5 câu bạn tự khai — kết quả là một phân bố, không phải một đáp án.',
    url: '/learn/nghe-nghiep',
  }),
];

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

export default function LearnNgheNghiepPage() {
  return (
    <LearnArticle
      eyebrow="HƯỚNG NGHIỆP · TRẮC NGHIỆM"
      title={
        <>
          Gợi ý nhóm nghề{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">(và giới hạn của nó)</span>
        </>
      }
      standfirst={
        <>
          Một bài trắc nghiệm hướng nghiệp trả về ba nhóm nghề kèm điểm trên thang mười, trông chắc
          nịch như kết quả xét nghiệm. Bài này mở nắp ra: nó đo cái gì, nó cộng điểm ra sao, vì sao
          “hợp nghề” là một phân bố chứ không phải một đáp án — và vì sao phần quyết định nhất của sự
          nghiệp lại nằm ngoài mọi bài test.
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Gợi ý nhóm nghề' },
      ]}
      relatedLenses={relatedLearnLenses('nghe-nghiep')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Công cụ Nhóm Nghề chấm cả ${CATEGORY_COUNT} nhóm theo ${PREF_COUNT} lựa chọn bạn tự khai rồi xếp hạng — hãy đọc cả bảng điểm, đừng chỉ đọc nhóm đứng đầu.`,
        href: '/career-fit',
        label: CTA_LABEL,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <NgheNghiepFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Trắc nghiệm hướng nghiệp đo gì — và KHÔNG đo gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mọi công cụ gợi ý nghề — dài hay ngắn, miễn phí hay trả tiền — đều đi qua đúng một
                cửa: <strong>bạn tự khai</strong>. Bạn nói mình thích tự chủ hay thích được dẫn dắt,
                thích ổn định hay chịu được biến động, làm việc tốt nhất một mình hay giữa đám đông.
                Máy nhận những câu ấy, đối chiếu với một bảng đã dựng sẵn, rồi trả về danh sách nhóm
                nghề khớp nhất với <em>mô tả</em> đó.
              </p>
              <p>
                Vì vậy phát biểu đúng của một kết quả hướng nghiệp là:{' '}
                <strong>“nhóm nghề này hợp với kiểu làm việc bạn vừa mô tả”</strong>. Ba câu sau đây
                nghe gần giống nhau nhưng khác hẳn về nội dung, và một bảng xếp hạng có điểm số rất dễ
                khiến người đọc gộp cả ba làm một:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>“Hợp sở thích của bạn.”</strong> Đây là điều bài test nói được — trong phạm
                  vi những gì bạn vừa khai, tại thời điểm bạn khai.
                </li>
                <li>
                  <strong>“Bạn sẽ giỏi nghề này.”</strong> Bài test không nói được. Năng lực chỉ đo
                  bằng mẫu công việc thật: bài tập, sản phẩm, kỳ thử việc. Không bảng hỏi nào thay
                  được phần đó, kể cả bảng hỏi hàng trăm câu.
                </li>
                <li>
                  <strong>“Bạn sẽ thành công ở nghề này.”</strong> Càng không. Thành công còn phụ
                  thuộc thị trường, cơ hội, người dẫn dắt và số giờ bạn bỏ ra — bốn thứ nằm ngoài mọi
                  bảng hỏi. Mục{' '}
                  <Link href="#gioi-han" className={A}>
                    giới hạn
                  </Link>{' '}
                  ở cuối bài nói kỹ chỗ này.
                </li>
              </ul>
              <p>
                Còn một lớp nữa ít người để ý: kết quả nói về{' '}
                <strong>cái bạn tin về mình lúc điền</strong>, chứ không phải về bạn. Đang chán việc
                thì người ta khai “muốn tự chủ tối đa” nhiều hơn hẳn lúc đang hài lòng. Cùng một
                người, cách nhau sáu tháng, có thể ra hai bảng xếp hạng khác nhau mà chẳng có gì trong
                đời họ thay đổi.
              </p>
              <p className="text-sm text-foreground/70">
                Hai phạm vi bài này cố ý không lấn: cách gộp gợi ý từ nhiều hệ khác nhau thuộc bài{' '}
                <Link href="/learn/so-sanh-lang-kinh" className={A}>
                  So sánh lăng kính
                </Link>
                ; còn khung để biến một gợi ý thành quyết định thuộc bài{' '}
                <Link href="/learn/ra-quyet-dinh" className={A}>
                  Ra quyết định
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
          children: <NgheNghiepDepth />,
        },
        {
          id: 'cong-cu-tinh-gi',
          tocLabel: 'Công cụ tính gì',
          heading: 'Công cụ Nhóm Nghề thật sự tính gì — mở nắp ra xem',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này mô tả đúng những gì mã của công cụ làm, không thêm không bớt. Đầu vào chỉ có
                ba thứ: <strong>ngày sinh</strong>, <strong>giới tính</strong> và{' '}
                <strong>{PREF_COUNT} lựa chọn</strong> về cách bạn làm việc. Trong ba thứ đó, chỉ{' '}
                {PREF_COUNT} lựa chọn và <em>phần năm</em> của ngày sinh là thật sự đi vào phép tính.
              </p>
              <p>
                Bảng dưới liệt kê {PREF_COUNT} câu tự khai cùng hệ số mà mỗi lựa chọn cộng hoặc trừ.
                Hệ số hiển thị là cột của nhóm <strong>{SAMPLE_NAME}</strong> — mỗi nhóm nghề có một
                cột riêng, nhưng cấu trúc thì y hệt nhau.
              </p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['Câu tự khai', `Ba lựa chọn và hệ số với nhóm ${SAMPLE_NAME}`]} />
                <tbody>
                  {PREF_GROUPS.map((g) => (
                    <tr key={g.key} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {g.label}
                      </th>
                      <td className={TD}>{optionsLine(g.options)}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Điểm của một nhóm được ráp lại đúng theo thứ tự này:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Bắt đầu ở <strong>điểm nền {BASELINE}</strong> — mọi nhóm đều khởi đầu bằng nhau.
                </li>
                <li>
                  Cộng hệ số của <strong>từng lựa chọn</strong> trong {PREF_COUNT} câu bạn vừa khai.
                </li>
                <li>
                  Cộng <strong>{ELEMENT_BONUS} điểm</strong> nếu mệnh suy từ năm sinh nằm trong danh
                  sách mệnh ưu tiên của nhóm đó.
                </li>
                <li>
                  <strong>Làm tròn rồi kẹp</strong> về thang {SCORE_MIN}–{SCORE_MAX}.
                </li>
                <li>
                  Xếp hạng cả {CATEGORY_COUNT} nhóm theo điểm, đưa <strong>{TOP_N} nhóm đầu</strong>{' '}
                  lên phần nổi bật và vẫn hiển thị đủ bảng.
                </li>
              </ol>

              <h3 className="text-lg font-semibold text-foreground">
                Danh sách {CATEGORY_COUNT} nhóm là cố định
              </h3>
              <p>
                Công cụ không nghĩ ra nghề mới cho bạn. Nó luôn xếp hạng đúng{' '}
                {CATEGORY_COUNT} nhóm dưới đây — đó vừa là ưu điểm (kết quả ổn định, so sánh được),
                vừa là giới hạn (nghề của bạn có thể nằm ngang giữa hai nhóm hoặc không thuộc nhóm
                nào).
              </p>
              <Scroller minWidth="min-w-[760px]">
                <TableHead cols={['Nhóm nghề', 'Vài nghề ví dụ', `Mệnh được cộng ${ELEMENT_BONUS} điểm`]} />
                <tbody>
                  {CATEGORIES.map((c) => (
                    <tr key={c.name} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {c.name}
                      </th>
                      <td className={TD}>{c.examples}</td>
                      <td className={TD}>{c.elements.join(' · ')}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>

              <h3 className="text-lg font-semibold text-foreground">
                Bốn điều công cụ KHÔNG làm
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không đọc giờ sinh.</strong> Công cụ không hỏi giờ, nên mọi phép cần giờ
                  sinh đều nằm ngoài phạm vi của nó.
                </li>
                <li>
                  <strong>Không dùng ngày và tháng sinh.</strong> Bạn nhập trọn ngày sinh, nhưng chỉ{' '}
                  <em>năm</em> được lấy ra để suy mệnh; ngày và tháng chỉ được kiểm tra cho đúng định
                  dạng rồi bỏ qua.
                </li>
                <li>
                  <strong>Không dùng giới tính để chấm điểm.</strong> Ô này bắt buộc nhập để yêu cầu
                  được chấp nhận, nhưng nó không cộng hay trừ điểm ở bất kỳ nhóm nào.
                </li>
                <li>
                  <strong>Không có mô hình ngôn ngữ nào viết riêng cho bạn.</strong> Điểm số, thứ hạng
                  và cả câu “vì sao hợp” đều là phép cộng và chuỗi mẫu chọn theo bậc điểm; phần lưu ý
                  cuối kết quả là mấy câu cố định, ai cũng như nhau.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Một chi tiết nên biết khi đối chiếu: mệnh ở đây suy từ{' '}
                <strong>năm dương lịch</strong> của ngày sinh, không quy đổi sang năm âm. Người sinh
                những ngày đầu tháng 1 — tức trước Tết — vì vậy sẽ được gán mệnh của năm dương chứ
                không phải năm âm. Ví dụ năm {BIRTH_YEAR_SAMPLE} cho chi {CHI_BY_SOLAR_YEAR}, mệnh{' '}
                {ELEMENT_BY_SOLAR_YEAR}; còn theo năm âm liền trước thì là chi {CHI_BY_LUNAR_YEAR},
                mệnh {ELEMENT_BY_LUNAR_YEAR}. Vì sao mốc đổi năm lại là Tết, xem bài{' '}
                <Link href="/learn/can-chi" className={A}>
                  Thiên can – Địa chi
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'phan-bo-khong-dap-an',
          tocLabel: 'Phân bố, không phải đáp án',
          heading: '“Hợp nghề” là một phân bố — bằng chứng nằm ngay trong phép tính',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Công cụ chấm cả {CATEGORY_COUNT} nhóm rồi mới xếp hạng, và nó đưa lên {TOP_N} nhóm chứ
                không đưa một. Đó không phải để cho đẹp: khi hai nhóm cách nhau ít điểm thì thứ tự
                giữa chúng gần như không mang thông tin. Ba hồ sơ dưới đây cho thấy điều đó rõ hơn mọi
                lời giải thích — cả ba cùng năm sinh {BIRTH_YEAR_SAMPLE}, chỉ khác phần tự khai, và
                điểm được tính bằng đúng phép cộng vừa mô tả cho nhóm {SAMPLE_NAME}.
              </p>
              <Scroller minWidth="min-w-[900px]">
                <TableHead
                  cols={['Hồ sơ', `${PREF_COUNT} lựa chọn tự khai`, 'Mệnh', 'Điểm thô', 'Màn hình hiện']}
                />
                <tbody>
                  {SCORED_PROFILES.map((p) => (
                    <tr key={p.name} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {p.name}
                      </th>
                      <td className={TD}>{picksLine(p.picks)}</td>
                      <td className={TD}>{p.element}</td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">{p.raw}</td>
                      <td className="px-4 py-2 tabular-nums font-medium text-foreground">
                        {p.score}/{SCORE_MAX}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Hai hàng đầu là <strong>cùng một người đổi đúng một câu trả lời</strong>: điểm thô rơi
                từ {CASE_TOP?.raw} xuống {CASE_TWIN?.raw}, nhưng màn hình vẫn ghi{' '}
                {CASE_TWIN?.score}/{SCORE_MAX} y như cũ. Còn hàng cuối là người chọn phương án ở giữa
                ở cả {PREF_COUNT} câu, và chỉ vì thế mà xuống {CASE_MID?.score}/{SCORE_MAX}.
                Không có dữ kiện nào khác tham gia vào chênh lệch ấy.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Thang điểm mất thông tin ở hai đầu
              </h3>
              <p>
                Với nhóm {SAMPLE_NAME}, điểm thô có thể chạy từ <strong>{RAW_MIN}</strong> tới{' '}
                <strong>{RAW_MAX}</strong> — rộng {RAW_SPAN} điểm — trong khi thang hiển thị chỉ có{' '}
                {SCORE_MAX} bậc. Bước kẹp cuối cùng vì vậy làm rất nhiều việc:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>{RAW_AT_CEILING} giá trị điểm thô khác nhau</strong> đều hiển thị thành{' '}
                  {SCORE_MAX}/{SCORE_MAX}. Điểm tối đa không có nghĩa “hoàn hảo”, nó chỉ có nghĩa “đã
                  chạm trần”.
                </li>
                <li>
                  <strong>{RAW_AT_FLOOR} giá trị ở đầu kia</strong> đều thành {SCORE_MIN}/{SCORE_MAX}.
                  Một nhóm bị {SCORE_MIN} điểm có thể chỉ hơi lệch, cũng có thể lệch rất xa — nhìn con
                  số không phân biệt được.
                </li>
                <li>
                  Ở giữa thang, chênh lệch <strong>{ELEMENT_BONUS} điểm</strong> giữa hai nhóm nhỏ
                  đúng bằng điểm thưởng mệnh. Nghĩa là riêng năm sinh đã đủ để đảo thứ hạng của hai
                  nhóm sát nhau — nhưng cũng chỉ đảo được đúng chừng đó, vì{' '}
                  {PREF_COUNT} câu tự khai có thể dịch chuyển tới {PREF_SWING} điểm, tức{' '}
                  <strong>gấp {vn(SWING_VS_ELEMENT)} lần</strong> sức nặng của mệnh.
                </li>
              </ul>
              <p>
                Rút ra ba cách đọc, dùng được cho bất kỳ bài trắc nghiệm hướng nghiệp nào chứ không
                riêng công cụ này:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Đọc cả dải, không đọc một dòng.</strong> Các nhóm cao gần bằng nhau là một
                  tập hướng đáng thử, không phải một thứ hạng.
                </li>
                <li>
                  <strong>Chênh lệch nhỏ thì bỏ qua.</strong> Nếu đổi một câu trả lời là hai nhóm
                  hoán chỗ thì thứ tự giữa chúng không phải thông tin.
                </li>
                <li>
                  <strong>Chú ý khoảng cách lớn, không phải vị trí.</strong> Nhóm thấp hẳn so với phần
                  còn lại mới là tín hiệu khó lật — và ngay cả nó cũng chỉ nói về sở thích tự khai.
                </li>
              </ol>
              <p className="text-sm text-foreground/70">
                Cảm giác “kết quả này đúng ghê” khi đọc phần mô tả cũng cần được cảnh giác — mô tả
                càng chung thì càng dễ thấy đúng với mọi người. Cơ chế đó có bài riêng:{' '}
                <Link href="/learn/barnum" className={A}>
                  Hiệu ứng Barnum
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'ngoai-bai-test',
          tocLabel: 'Phần nằm ngoài bài test',
          heading: 'Phần quyết định sự nghiệp nằm ngoài mọi bài trắc nghiệm',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phần trung thực nhất của bài, và cũng là phần ít công cụ nào chịu nói. Kể cả
                khi một bài trắc nghiệm đo sở thích chính xác tuyệt đối, nó vẫn bỏ trống bốn thứ mà
                phần lớn quỹ đạo nghề nghiệp của một người phụ thuộc vào:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Thị trường.</strong> Nghề nào đang tuyển, mức lương ra sao, ngành nào đang
                  co lại. Bảng hỏi không biết năm nay là năm nào.
                </li>
                <li>
                  <strong>Cơ hội.</strong> Một lời giới thiệu, một dự án tình cờ được giao, một công
                  ty vừa mở văn phòng ở thành phố bạn sống. Phần lớn bước ngoặt nghề nghiệp đến từ
                  đây, và không ai dự báo được.
                </li>
                <li>
                  <strong>Người dẫn dắt.</strong> Một người sếp chịu chỉ việc, một đồng nghiệp giỏi
                  ngồi cạnh. Cùng một người vào hai môi trường khác nhau có thể ra hai kết cục khác
                  hẳn.
                </li>
                <li>
                  <strong>Số giờ đã bỏ ra.</strong> Thứ duy nhất trong bốn cái nằm hoàn toàn trong tay
                  bạn — và cũng là thứ mà không bảng hỏi nào nhìn thấy.
                </li>
              </ul>
              <p>
                Chi tiết thứ tư là chỗ hay bị đọc ngược. Trực giác nói: thích trước, rồi giỏi, rồi
                thành công. Thực tế thường chạy theo chiều kia —{' '}
                <strong>làm nhiều thì giỏi lên, giỏi lên thì thấy thích</strong>. Nếu vậy thì một kết
                quả “không hợp” ở nghề bạn mới bắt đầu chưa nói lên nhiều, vì cái làm nên sự hợp còn
                chưa kịp hình thành.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Đối chiếu nhiều nguồn mà không biến nó thành cái cớ
              </h3>
              <p>
                Nhiều người làm liền mấy bài rồi bối rối vì kết quả không khớp. Cách xử lý gọn gồm ba
                bước, và bước thứ ba mới là bước quan trọng:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Giữ phần trùng nhau.</strong> Điều mà nhiều nguồn cùng chỉ ra là tín hiệu
                  đáng tin hơn — không phải vì chúng xác nhận lẫn nhau, mà vì nó nhất quán qua nhiều
                  cách hỏi khác nhau.
                </li>
                <li>
                  <strong>Không phân xử phần mâu thuẫn bằng cách chọn bài dễ nghe.</strong> Khi hai
                  nguồn nói khác nhau, không nguồn nào có thẩm quyền hơn. Chọn cái vừa ý rồi gọi đó là
                  “đối chiếu” chỉ là tự xác nhận điều mình đã muốn.
                </li>
                <li>
                  <strong>Biến phần mâu thuẫn thành một phép thử có thời hạn.</strong> Một dự án nhỏ,
                  một kỳ thực tập, vài tháng làm thêm buổi tối — đặt trước mốc thời gian và tiêu chí
                  dừng. Kết quả của phép thử là dữ kiện thật; điểm số trên bảng thì không.
                </li>
              </ol>
              <p>
                Và một ranh giới cần giữ chặt: <strong>gợi ý nghề không phải giấy phép để bỏ dở</strong>.
                Nếu bạn đang theo một nghề vài năm, thứ bạn tích luỹ được là số giờ làm việc thật —
                đúng cái mà bài test không nhìn thấy. Một bảng xếp hạng đặt nghề ấy ở giữa bảng không
                đủ tư cách để xoá nó. Ngược lại, làm đi làm lại bài test tới khi ra kết quả mong muốn
                thì kết quả cũng hết giá trị, vì lúc đó bạn chỉ đang chép lại lựa chọn có sẵn trong
                đầu.
              </p>
              <p className="text-sm text-foreground/70">
                Nếu bạn muốn thêm góc nhìn về chính mình trước khi thử, các bảng hỏi tính cách có bài
                riêng trên hieu.asia:{' '}
                <Link href="/learn/mbti" className={A}>
                  bài MBTI
                </Link>
                ,{' '}
                <Link href="/learn/disc" className={A}>
                  bài DISC
                </Link>{' '}
                và{' '}
                <Link href="/learn/big-five" className={A}>
                  bài Big Five
                </Link>
                . Chúng đo tính cách chứ không gợi ý nghề, nên hãy đọc như dữ liệu bổ sung, không phải
                như phiếu bầu thứ hai.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: gợi ý là điểm khởi đầu, không phải kết luận',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nói thẳng để không ai đọc quá tay. Công cụ Nhóm Nghề là một{' '}
                <strong>phép cộng trên {PREF_COUNT} câu bạn tự khai</strong>, cộng một tín hiệu nhẹ từ
                năm sinh. Nó hữu ích ở chỗ buộc bạn phát biểu thành lời cách mình muốn làm việc — chỉ
                riêng việc đó đã đáng — nhưng nó không có thẩm quyền nào với đời bạn.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Kết quả phản chiếu chính lời bạn nói.</strong> Bạn khai khác đi là bảng đổi
                  theo. Điều này khiến nó dễ trở thành một tấm gương xác nhận: người đang muốn nghỉ
                  việc sẽ khai theo hướng khiến bảng ủng hộ mình nghỉ việc.
                </li>
                <li>
                  <strong>Điểm số trông chính xác hơn thực chất.</strong> Thứ hạng và thang{' '}
                  {SCORE_MIN}–{SCORE_MAX} gợi liên tưởng tới kết quả xét nghiệm, nhưng xét nghiệm đo
                  một đại lượng ngoài đời, còn ở đây đầu vào chính là câu bạn vừa gõ.
                </li>
                <li>
                  <strong>Phần chữ giải thích là chuỗi mẫu.</strong> Câu “vì sao hợp” được chọn theo
                  bậc điểm chứ không phân tích riêng hồ sơ của bạn — kể cả khi nó viết như thể vừa đếm
                  lại từng tiêu chí. Đừng đọc nó như một nhận xét cá nhân.
                </li>
                <li>
                  <strong>Danh sách nhóm là đóng.</strong> Chỉ có {CATEGORY_COUNT} nhóm; nghề của bạn
                  có thể nằm vắt ngang hai nhóm hoặc không thuộc nhóm nào. {NON_TOP_COUNT} nhóm không
                  lọt top cũng không phải bị loại.
                </li>
                <li>
                  <strong>Không có gì để “hoá giải”.</strong> hieu.asia không bán và không khuyên mua
                  bất cứ thứ gì để “đổi mệnh nghề nghiệp”. Nếu ai đó dùng kết quả một bài trắc nghiệm
                  để bán cho bạn một khoá học hay một dịch vụ “sửa số”, đó là lúc nên dừng lại.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh gói trong một câu: <strong>dùng để rút ngắn danh sách đi thử</strong>,
                không dùng để chốt danh sách. Nó không thay được lời khuyên nghề nghiệp từ người trong
                ngành, không thay được dữ liệu thị trường lao động, và tuyệt đối không phải căn cứ để
                nghỉ việc trong một tuần.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <NgheNghiepWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <NgheNghiepRecall />,
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
                Nếu bạn định dùng kết quả này cho một quyết định lớn, hai bài sau đi tiếp phần mà bài
                này chỉ chạm tới: cách gộp gợi ý từ nhiều hệ khác nhau, và cách biến một gợi ý thành
                một quyết định có tiêu chí dừng.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn một góc nhìn theo hệ quy ước khác về nghề nghiệp, công cụ{' '}
                <Link href="/tu-vi-nghe-nghiep" className={A}>
                  {TUVI_TOOL_LABEL}
                </Link>{' '}
                đọc cung Quan Lộc và cần cả giờ sinh — khác hẳn phép cộng trong bài này.
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/career-fit', label: CTA_LABEL },
                    { href: '/tu-vi-nghe-nghiep', label: TUVI_TOOL_LABEL },
                    { href: '/mbti', label: 'Trắc nghiệm MBTI' },
                    { href: '/big-five', label: 'Trắc nghiệm Big Five' },
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
          children: <NgheNghiepChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
