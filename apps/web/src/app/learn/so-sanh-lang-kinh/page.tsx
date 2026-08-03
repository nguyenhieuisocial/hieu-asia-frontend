/**
 * Bài học /learn/so-sanh-lang-kinh — bài CHÍNH THỨC về việc đối chiếu hai lăng
 * kính trên hieu.asia. Công cụ tương ứng: /so-sanh.
 *
 * GROUNDING — nguồn dữ kiện DUY NHẤT là `lib/so-sanh.ts` (COMPARISONS, đọc hết)
 * cùng hai trang công cụ `app/so-sanh/page.tsx` và `app/so-sanh/[cap]/page.tsx`.
 * Mọi con số và mọi câu trích đều import từ `./_active-learning` (nơi đặt toàn
 * bộ phép suy, xem GROUNDING đầy đủ ở đầu file đó) rồi render — KHÔNG gõ tay:
 *   • PAIR_COUNT / TOOL_COUNT / POSSIBLE_PAIRS / CROSS_FAMILY_PAIRS
 *   • DIM_COUNT / AXES / AXIS_COUNT / SHARED_AXES / SINGLE_FAMILY_AXES
 *   • SCIENCE_AXIS + SCIENCE_PAIRS, cellFor(), các cặp trích nguyên văn.
 *
 * CÔNG CỤ /so-sanh THẬT SỰ LÀM GÌ: hiển thị các cặp so sánh ĐÃ SOẠN SẴN — giới
 * thiệu, bảng đối chiếu theo trục, "chọn A khi…", "chọn B khi…", kết luận, FAQ,
 * link sang hai công cụ, nút chia sẻ. Nó KHÔNG nhận dữ liệu người dùng, KHÔNG
 * đọc kết quả bạn đã làm, KHÔNG đối chiếu hai kết quả CỦA BẠN, KHÔNG chấm điểm
 * trùng khớp và KHÔNG xếp hạng tổng thể. Trang nói thẳng điều đó ở mục Tổng quan
 * và mục Giới hạn, thay vì để người đọc tưởng web làm hộ phần đối chiếu.
 *
 * KIỂM CHỨNG SỐ LIỆU (chạy lại được từ chính COMPARISONS): 6 cặp · 7 công cụ ·
 * 21 cặp có thể ghép · 0 cặp bắc cầu giữa hai họ · 29 ô đối chiếu trên 18 trục ·
 * 16 trục chỉ sống trong một họ · 2 trục dùng chung ("Mạnh ở", "Cơ sở") · trục
 * "Cơ sở khoa học" chỉ có ở 2 cặp, cả hai đều trong họ bảng hỏi.
 *
 * PHẠM VI: vì sao lời chung chung nghe đúng thuộc /learn/barnum (ở đây MỘT đoạn
 * + link); cách kiểm một khẳng định thuộc /learn/kiem-chung (MỘT đoạn + link);
 * nội dung từng hệ thuộc bài riêng (chỉ link). Giọng: không hệ nào "thắng"; mâu
 * thuẫn là dấu hiệu câu hỏi đặt sai; "cùng hữu ích" KHÔNG nghĩa là "cùng đúng".
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
import { COMPARISONS } from '@/lib/so-sanh';
import {
  SoSanhFrame,
  SoSanhDepth,
  SoSanhRecall,
  SoSanhChecklist,
  SoSanhWhys,
  PAIR_COUNT,
  TOOLS,
  TOOL_COUNT,
  POSSIBLE_PAIRS,
  CROSS_FAMILY_PAIRS,
  DIM_COUNT,
  AXES,
  AXIS_COUNT,
  SHARED_AXES,
  SINGLE_FAMILY_AXES,
  SCIENCE_AXIS,
  SCIENCE_PAIRS,
  QUESTION_AXIS,
  QUESTION_DIM,
  SHARED_AXIS_DEMO,
  MBTI_TRONG_TAM,
  TU_VI_MANH_O,
  OVERLAP_FAQ,
  MBTI_BIG_FIVE,
  THAN_SO_TU_VI,
  familyOf,
  FAMILY_LABEL,
  type AxisStat,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤47 ký tự: root layout nối thêm " · hieu.asia" (12) → render ≤60.
  title: 'So sánh hai lăng kính — đọc sao cho đúng',
  // ≤160 ký tự.
  description:
    'Hai hệ nói khác nhau mà vẫn cùng hữu ích vì mỗi hệ trả lời một loại câu hỏi. Cách đối chiếu hai kết quả — không cộng điểm, không lấy trung bình.',
  alternates: { canonical: 'https://hieu.asia/learn/so-sanh-lang-kinh' },
};

const A = 'text-gold-700 underline-offset-4 hover:underline';
const TD = 'px-4 py-2 text-muted-foreground';

/**
 * Bài Học riêng của từng công cụ. Khai TĨNH và chỉ gồm route đã kiểm là có thật
 * — công cụ nào chưa có bài thì bảng để trống thay vì sinh một link đoán mò.
 */
const LEARN_HREF: Record<string, string> = {
  '/mbti': '/learn/mbti',
  '/big-five': '/learn/big-five',
  '/disc': '/learn/disc',
  '/enneagram': '/learn/enneagram',
  '/tu-vi': '/learn/tu-vi',
  '/bat-tu': '/learn/bat-tu',
  '/than-so-hoc': '/learn/than-so-hoc',
};

/** Nhãn "trục này xuất hiện ở họ nào" cho bảng thống kê trục. */
function famLabel(axis: AxisStat): string {
  return [...axis.families]
    .map((f) => (f === 'bac-cau' ? 'Cặp bắc cầu' : FAMILY_LABEL[f]))
    .join(' + ');
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ trên trang. Cố ý KHÁC bộ FAQ đã có trên từng trang /so-sanh/[cap] (ở đó
// hỏi "cái nào đúng hơn", "nên làm cái nào trước" cho TỪNG cặp cụ thể), KHÁC bộ
// FAQ của /learn/barnum (hỏi về cơ chế khiến câu mơ hồ nghe đúng) và KHÁC bộ FAQ
// của /learn/kiem-chung (hỏi về khả sai và tỉ lệ nền).
const FAQS = [
  {
    q: 'Hai lăng kính nói khác nhau thì hệ nào đúng?',
    a: `Câu hỏi này thường không có đáp án, và đó không phải là né tránh. Mỗi hệ chỉ nói được về những thứ nằm trong bộ khái niệm của nó, nên khi hai kết luận nghe như cãi nhau thì phần lớn trường hợp chúng đang nói về hai đại lượng khác nhau. Việc cần làm đầu tiên không phải chọn phe mà là xem lại câu hỏi bạn đang hỏi thuộc loại nào — làm rõ chỗ đó thì thường chỉ còn đúng một hệ thật sự đang trả lời nó. Xếp hạng chỉ hợp lệ khi cả hai cùng đứng trên một trục mà cả hai định nghĩa được.`,
  },
  {
    q: 'Hiệu lực cấu trúc nghĩa là gì, nói ngắn gọn?',
    a: `Là chuyện một mô hình chỉ đo được cái mà chính nó định nghĩa được. Cái cân không nói được bạn tốt bụng bao nhiêu — không phải vì cân hỏng, mà vì trong cân không có khái niệm ấy. Tương tự, một bài trắc nghiệm bốn chữ cái không có khái niệm "cung" nên không thể nói gì về cung Tài Bạch của bạn; nếu vẫn có câu trả lời thì đó là do người diễn giải thêm vào, không phải do hệ suy ra. Hiệu lực của một mô hình bị chặn bởi chính cấu trúc của nó.`,
  },
  {
    q: 'Có thể cộng điểm hoặc lấy trung bình kết quả của hai hệ không?',
    a: `Không nên, vì cộng và lấy trung bình chỉ có nghĩa khi hai số cùng đơn vị. Bằng chứng đọc được ngay trong dữ liệu của trang So sánh: ${DIM_COUNT} ô đối chiếu nằm trên ${AXIS_COUNT} trục, mà ${SINGLE_FAMILY_AXES} trục chỉ xuất hiện trong một họ duy nhất — phần lớn thứ đem ra so được đều là chuyện nội bộ của một họ. Trung bình của hai đại lượng không cùng thang là một con số trông có vẻ khách quan mà thực ra rỗng.`,
  },
  {
    q: 'Trang So sánh có tự đối chiếu hai kết quả của tôi không?',
    a: `Không. Trang So sánh hiển thị ${PAIR_COUNT} cặp đã soạn sẵn: giới thiệu, bảng đối chiếu theo trục, gợi ý nên chọn bên nào khi nào, kết luận và câu hỏi thường gặp. Nó không nhận dữ liệu của bạn, không đọc kết quả bạn đã làm, không chấm điểm trùng khớp giữa hai kết quả và không xếp hạng tổng thể. Việc đối chiếu hai kết quả của chính bạn là kỹ năng đọc bạn tự làm — bài này dạy cách làm, còn công cụ thì không làm hộ phần đó.`,
  },
  {
    q: 'Vì sao không có cặp nào ghép một bài trắc nghiệm với một hệ lá số?',
    a: `Đúng là không có: trong ${PAIR_COUNT} cặp thì có ${CROSS_FAMILY_PAIRS} cặp bắc cầu giữa hai họ, và ${TOOL_COUNT} công cụ được nêu tên đáng lẽ ghép được tới ${POSSIBLE_PAIRS} cặp. Bài này không đọc được ý định của người dựng bảng, nhưng lý do kỹ thuật thì thấy ngay từ cấu trúc dữ liệu: một bảng đối chiếu cần trục mà cả hai vế cùng định nghĩa được, mà ${SINGLE_FAMILY_AXES} trên ${AXIS_COUNT} trục chỉ sống trong một họ. Không có trục chung thì bảng sẽ chỉ là hai cột chữ đặt cạnh nhau.`,
  },
  {
    q: 'Hai hệ độc lập cùng nói một điều thì có đáng tin hơn không?',
    a: `Chưa chắc, và đây là chỗ dễ hụt chân nhất. Hai lời trùng nhau có thể chỉ vì cả hai đều mơ hồ đủ để hợp với gần như bất kỳ ai — cơ chế đó có bài riêng trên hieu.asia. Cũng có thể vì bạn đọc cả hai sau khi đã biết rõ mình, nên tự nối chúng lại với nhau mà không nhận ra. Sự trùng khớp chỉ có giá trị khi từng khẳng định đủ cụ thể để có thể sai, và điều đó phải kiểm riêng chứ không suy ra từ việc hai bên cùng nói.`,
  },
  {
    q: 'Muốn xem nhiều hệ thì nên bắt đầu từ đâu?',
    a: `Bắt đầu từ câu hỏi bạn đang thật sự có, không phải từ hệ nào nổi tiếng hơn. Nếu câu hỏi là về cách bạn tư duy, giao tiếp hay nạp năng lượng thì đó là địa hạt của các bảng hỏi tính cách; nếu câu hỏi là về những lĩnh vực nổi bật của đời sống thì đó là địa hạt của các hệ suy từ dữ kiện sinh. Mỗi trang so sánh cặp đôi trên hieu.asia đều có sẵn hai ô "chọn bên nào khi nào" để bạn đối chiếu với nhu cầu của mình.`,
  },
  {
    q: 'Nói hai hệ "cùng hữu ích" có phải là nói chúng ngang nhau về độ tin cậy không?',
    a: `Không, và bài này không nói vậy. "Cùng hữu ích" chỉ có nghĩa là mỗi hệ trả lời được một loại câu hỏi mà hệ kia không có khái niệm để chạm tới. Về độ tin cậy thì phải xét trên trục cụ thể: trong dữ liệu trang So sánh, trục "${SCIENCE_AXIS}" chỉ xuất hiện ở ${SCIENCE_PAIRS.length} cặp và cả ${SCIENCE_PAIRS.length} cặp đó đều nằm trong họ bảng hỏi, nơi hai bên cùng định nghĩa được khái niệm đo lại nhiều lần. Ngoài trục đó ra, việc gọi một hệ là "đáng tin hơn" thường là so hai thứ không cùng thang.`,
  },
];

const JSONLD = [
  article({
    headline: 'So sánh hai lăng kính: vì sao hai hệ nói khác nhau mà vẫn cùng hữu ích',
    description:
      'Mỗi hệ trả lời một loại câu hỏi khác nhau nên chúng không phủ định cũng không xác nhận nhau. Khái niệm hiệu lực cấu trúc và cách đối chiếu hai kết quả cho tử tế.',
    url: '/learn/so-sanh-lang-kinh',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'So sánh lăng kính', url: '/learn/so-sanh-lang-kinh' },
  ]),
  faqPage(FAQS),
  course({
    name: 'So sánh hai lăng kính — đọc hai kết quả mà không phải bỏ cái nào',
    description:
      'Hai hệ nói khác nhau mà vẫn cùng hữu ích vì mỗi hệ trả lời một loại câu hỏi. Cách đối chiếu hai kết quả — không cộng điểm, không lấy trung bình.',
    url: '/learn/so-sanh-lang-kinh',
  }),
];

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

export default function LearnSoSanhLangKinhPage() {
  return (
    <LearnArticle
      eyebrow="TƯ DUY PHẢN BIỆN · ĐỐI CHIẾU"
      title={
        <>
          Hai lăng kính nói khác nhau{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (mà không cái nào sai)
          </span>
        </>
      }
      standfirst={
        <>
          Bạn ra “thiên về hướng nội” ở một bài trắc nghiệm, rồi đọc lá số thấy đời mình mạnh ở
          khoản giao thiệp. Bài này giải thích vì sao hai câu ấy có thể cùng đúng, khi nào thì so
          sánh hai hệ là hợp lệ, và cách đối chiếu hai kết quả mà không cộng điểm, không lấy trung
          bình, không phải bỏ bớt một bên.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'So sánh lăng kính' },
      ]}
      relatedLenses={relatedLearnLenses('so-sanh-lang-kinh')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Trang So sánh có ${PAIR_COUNT} cặp lăng kính đã soạn sẵn: bảng đối chiếu theo từng trục, gợi ý nên chọn bên nào khi nào, và kết luận cân bằng cho mỗi cặp.`,
        href: '/so-sanh',
        label: 'Đọc bảng so sánh từng cặp',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <SoSanhFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'So sánh hai lăng kính là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trên hieu.asia, “so sánh lăng kính” là việc đặt hai hệ cạnh nhau trên những{' '}
                <strong>trục mà cả hai đều định nghĩa được</strong>, rồi đọc xem mỗi bên mạnh ở đâu
                và hợp với nhu cầu nào. Công cụ{' '}
                <Link href="/so-sanh" className={A}>
                  So sánh
                </Link>{' '}
                hiện có {PAIR_COUNT} cặp như vậy, gồm {TOOL_COUNT} công cụ khác nhau:
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                {COMPARISONS.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/so-sanh/${c.slug}`} className={A}>
                      {c.a.ten} và {c.b.ten}
                    </Link>{' '}
                    <span className="text-muted-foreground">— {c.dims.length} trục đối chiếu</span>
                  </li>
                ))}
              </ul>
              <p>
                Mỗi trang cặp gồm đúng những phần này:{' '}
                <strong>giới thiệu, bảng đối chiếu theo trục, gợi ý chọn bên nào khi nào, kết luận
                và câu hỏi thường gặp</strong>. Toàn bộ là nội dung biên tập soạn sẵn — không có
                phép tính nào chạy khi bạn mở trang.
              </p>
              <p>Vì vậy cần chốt ngay bốn điều công cụ KHÔNG làm:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không nhận dữ liệu của bạn.</strong> Trang So sánh không hỏi ngày sinh,
                  không hỏi kết quả trắc nghiệm, không đọc bài bạn đã làm trước đó.
                </li>
                <li>
                  <strong>Không đối chiếu hai kết quả của bạn với nhau.</strong> Nó so sánh hai{' '}
                  <em>hệ</em>, không so sánh hai <em>kết quả</em>. Phần đối chiếu kết quả là kỹ năng
                  đọc — bài này dạy cách làm bằng tay, và nói thẳng rằng web không làm hộ.
                </li>
                <li>
                  <strong>Không có điểm trùng khớp, không xếp hạng tổng thể.</strong> Không cặp nào
                  kết thúc bằng một bên thắng; cũng không có con số nào đo “hai hệ hợp nhau bao
                  nhiêu phần trăm”.
                </li>
                <li>
                  <strong>Không phủ hết mọi cặp.</strong> {TOOL_COUNT} công cụ về lý thuyết ghép
                  được {POSSIBLE_PAIRS} cặp, công cụ đang có {PAIR_COUNT}. Các lăng kính khác của
                  site — Tarot, Kinh Dịch, xem chỉ tay — không xuất hiện trong cặp nào.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Hai phạm vi bài này cố ý không lấn: vì sao một lời chung chung lại khiến ai đọc cũng
                thấy đúng thuộc bài{' '}
                <Link href="/learn/barnum" className={A}>
                  Hiệu ứng Barnum
                </Link>
                ; còn cách kiểm một khẳng định cụ thể trước khi tin thuộc bài{' '}
                <Link href="/learn/kiem-chung" className={A}>
                  Kiểm chứng dự đoán
                </Link>
                . Nội dung của từng hệ thì mỗi hệ có bài riêng, bài này chỉ trỏ sang.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <SoSanhDepth />,
        },
        {
          id: 'loai-cau-hoi',
          tocLabel: 'Loại câu hỏi',
          heading: 'Mỗi hệ trả lời một LOẠI câu hỏi khác nhau',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Điểm khởi đầu của cả bài nằm ở đây. Người ta hay hỏi “hệ nào đúng hơn” vì ngầm giả
                định cả hai đang trả lời <strong>cùng một câu hỏi</strong>. Thực ra không phải: một
                bài trắc nghiệm tính cách hỏi bạn thích xử lý thông tin và nạp năng lượng kiểu nào;
                một lá số hỏi đời bạn có những lĩnh vực nào nổi bật.
              </p>
              <p>
                Đây không phải cách diễn đạt của riêng bài này. Chính dữ liệu của công cụ có một
                trục tên “{QUESTION_AXIS}”, và hai ô của nó được ghi là{' '}
                {QUESTION_DIM ? (
                  <>
                    <strong>{QUESTION_DIM.a}</strong> với <strong>{QUESTION_DIM.b}</strong>
                  </>
                ) : (
                  <>hai câu hỏi khác nhau</>
                )}{' '}
                — tức bảng so sánh cũng phân biệt các hệ theo{' '}
                <strong>loại câu hỏi chúng trả lời</strong>, không phải theo độ đúng.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                {TOOL_COUNT} công cụ xuất hiện trong các cặp
              </h3>
              <p>
                Cột “Họ” là <strong>cách gom nhóm của bài này</strong>, không có sẵn trong dữ liệu
                công cụ. Căn cứ để gom: công cụ ghi trục “Dữ liệu cần” (ngày và giờ sinh, hoặc họ
                tên) cho đúng ba hệ ở nhóm dưới. Cột mô tả lấy nguyên văn dòng mà công cụ gắn cho
                từng hệ.
              </p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['Công cụ', 'Họ (cách gom của bài)', 'Công cụ mô tả là', 'Bài học riêng']} />
                <tbody>
                  {TOOLS.map((t) => {
                    const learn = LEARN_HREF[t.href];
                    return (
                      <tr key={t.href} className="border-b border-border/60 last:border-b-0">
                        <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                          <Link href={t.href} className={A}>
                            {t.ten}
                          </Link>
                        </th>
                        <td className={TD}>{FAMILY_LABEL[familyOf(t.href)]}</td>
                        <td className={TD}>{t.tag}</td>
                        <td className="px-4 py-2">
                          {learn ? (
                            <Link href={learn} className={A}>
                              Bài {t.ten}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Scroller>
              <p>
                Chia theo hai họ ấy rồi nhìn lại {PAIR_COUNT} cặp của công cụ thì thấy một điều đáng
                chú ý: có đúng <strong>{CROSS_FAMILY_PAIRS} cặp</strong> bắc cầu giữa hai họ. Mọi
                cặp đều nằm gọn trong một họ.
              </p>
              <p className="text-sm text-foreground/70">
                Bài này không đọc được ý định của người dựng bảng nên không gán cho họ lý do nào. Chỉ
                nêu điều đọc được: muốn dựng một bảng đối chiếu thì phải có trục mà cả hai vế cùng
                định nghĩa được — và mục sau cho thấy trục như vậy hiếm tới mức nào.
              </p>
            </div>
          ),
        },
        {
          id: 'hieu-luc-cau-truc',
          tocLabel: 'Hiệu lực cấu trúc',
          heading: 'Hiệu lực cấu trúc: một mô hình chỉ đo được cái nó định nghĩa được',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là khái niệm lõi của bài. Nói gọn:{' '}
                <strong>hiệu lực của một mô hình bị chặn bởi chính cấu trúc của nó</strong>. Cái cân
                không nói được bạn tốt bụng bao nhiêu — không phải vì cân hỏng, mà vì trong cân
                không có chỗ nào để chứa khái niệm ấy. Hỏi một câu nằm ngoài bộ khái niệm của một hệ
                thì câu trả lời nhận được <strong>không phải là sai, mà là không có nghĩa</strong>.
              </p>
              <p>
                Điều này đo được ngay trên dữ liệu của công cụ. {PAIR_COUNT} cặp cộng lại có{' '}
                <strong>{DIM_COUNT} ô đối chiếu</strong>, xếp trên <strong>{AXIS_COUNT} trục</strong>{' '}
                khác nhau. Trong đó <strong>{SINGLE_FAMILY_AXES} trục</strong> chỉ xuất hiện trong
                một họ duy nhất, và chỉ {SHARED_AXES.length} trục có mặt ở cả hai họ.
              </p>
              <Scroller minWidth="min-w-[640px]">
                <TableHead cols={['Trục đối chiếu', 'Số cặp dùng', 'Xuất hiện ở họ']} />
                <tbody>
                  {AXES.map((axis) => (
                    <tr key={axis.aspect} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {axis.aspect}
                      </th>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {axis.slugs.length}
                      </td>
                      <td className={TD}>{famLabel(axis)}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Bảng trên chính là hiệu lực cấu trúc hiện ra dưới dạng dữ liệu: phần lớn thứ đem ra
                so được đều là chuyện <strong>nội bộ của một họ</strong> — vì một trục của họ này
                thường không có nghĩa gì trong họ kia.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Cạm bẫy: cùng tên trục không có nghĩa cùng thang đo
              </h3>
              <p>
                {SHARED_AXES.length} trục dùng chung là chỗ dễ hụt chân nhất. Chúng khiến hai ô nằm
                cùng một hàng, trông như so được với nhau — trong khi nội dung bên trong thuộc hai
                loại đại lượng khác nhau. Dưới đây là nguyên văn các ô đó:
              </p>
              <Scroller minWidth="min-w-[820px]">
                <TableHead cols={['Trục', 'Cặp', 'Vế trái ghi gì', 'Vế phải ghi gì']} />
                <tbody>
                  {SHARED_AXES.flatMap((axis) =>
                    COMPARISONS.filter((c) => axis.slugs.includes(c.slug)).map((c) => {
                      const dim = c.dims.find((d) => d.aspect === axis.aspect);
                      return (
                        <tr
                          key={`${axis.aspect}-${c.slug}`}
                          className="border-b border-border/60 last:border-b-0"
                        >
                          <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                            {axis.aspect}
                          </th>
                          <td className={TD}>{c.title}</td>
                          <td className={TD}>{dim?.a ?? '—'}</td>
                          <td className={TD}>{dim?.b ?? '—'}</td>
                        </tr>
                      );
                    }),
                  )}
                </tbody>
              </Scroller>
              {SHARED_AXIS_DEMO ? (
                <p className="text-sm text-foreground/70">
                  Đọc theo hàng thì thấy ngay. Cùng nằm trên trục “{SHARED_AXIS_DEMO.aspect}”, cặp{' '}
                  {SHARED_AXIS_DEMO.birth.title} ghi “{SHARED_AXIS_DEMO.birthCell}”, còn cặp{' '}
                  {SHARED_AXIS_DEMO.quiz.title} ghi “{SHARED_AXIS_DEMO.quizCell}”. Một bên nói về
                  các lĩnh vực của đời sống, bên kia nói về động lực bên trong —{' '}
                  <strong>không nằm trên một thang để mà xếp hơn kém</strong>, chỉ cái tên trục là
                  giống nhau.
                </p>
              ) : null}

              <h3 className="text-lg font-semibold text-foreground">
                Có trục chung thì xếp hạng lại hợp lệ
              </h3>
              <p>
                Hệ quả ngược cũng đúng, và cần nói cho rõ để bài không trượt sang thuyết “cái gì
                cũng như nhau”. Khi hai hệ <strong>cùng định nghĩa được một trục</strong> thì so hơn
                kém trên trục đó hoàn toàn có nghĩa. Trong dữ liệu công cụ, trục “{SCIENCE_AXIS}”
                xuất hiện ở {SCIENCE_PAIRS.length} cặp — và đúng ở đó bảng mới nói thẳng bên nào có
                nền vững hơn:
              </p>
              <Scroller minWidth="min-w-[760px]">
                <TableHead cols={['Cặp', `Vế trái trên trục “${SCIENCE_AXIS}”`, 'Vế phải']} />
                <tbody>
                  {SCIENCE_PAIRS.map((c) => {
                    const dim = c.dims.find((d) => d.aspect === SCIENCE_AXIS);
                    return (
                      <tr key={c.slug} className="border-b border-border/60 last:border-b-0">
                        <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                          <Link href={`/so-sanh/${c.slug}`} className={A}>
                            {c.title}
                          </Link>
                        </th>
                        <td className={TD}>{dim?.a ?? '—'}</td>
                        <td className={TD}>{dim?.b ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Scroller>
              <p>
                Cả {SCIENCE_PAIRS.length} cặp ấy đều nằm trong họ bảng hỏi, nơi hai bên cùng có khái
                niệm “đo lại nhiều lần thì kết quả có ổn định không”. Còn ở cặp giữa hai hệ khác gốc
                thì công cụ nói thẳng điều ngược lại:{' '}
                {THAN_SO_TU_VI ? (
                  <em>“{THAN_SO_TU_VI.bottomLine}”</em>
                ) : (
                  <em>không đối chiếu đúng–sai được</em>
                )}
              </p>
              <p className="text-sm text-foreground/70">
                Quy tắc rút ra gọn một câu:{' '}
                <strong>có trục chung thì được xếp hạng, không có thì dừng lại</strong>. Dừng ở đây
                không phải là chịu thua — nó là nói đúng giới hạn của phép so sánh.
              </p>
            </div>
          ),
        },
        {
          id: 'doi-chieu-tu-te',
          tocLabel: 'Đối chiếu tử tế',
          heading: 'Đối chiếu hai kết quả cho tử tế — dịch trước, so sau',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này là kỹ năng đọc của bạn, không phải tính năng của web — nhắc lại cho rõ vì
                nhiều người mở trang So sánh với kỳ vọng nó ghép hộ hai kết quả. Cách làm gồm ba
                bước, và một danh sách ba việc <strong>đừng làm</strong>.
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Hỏi mỗi kết quả đang trả lời câu gì.</strong> Viết câu hỏi ấy ra bằng lời
                  thường, một dòng cho mỗi bên. Nếu hai dòng khác nhau — thường là vậy — thì bạn đã
                  biết chúng không cãi nhau được.
                </li>
                <li>
                  <strong>Tìm trục chung.</strong> Có trục mà cả hai cùng định nghĩa thì mới so.
                  Không có thì dừng, và giữ cả hai như hai mô tả song song.
                </li>
                <li>
                  <strong>Dịch sang một ngôn ngữ rồi tìm chỗ trùng.</strong> Bỏ hết thuật ngữ, viết
                  lại mỗi kết luận thành một câu về hành vi hoặc hoàn cảnh cụ thể. Chỗ nào hai bản
                  dịch nói cùng một điều, đó mới là chỗ đáng chú ý.
                </li>
              </ol>
              <p>Ba việc đừng làm, vì cả ba đều giả định một thang đo chung vốn không tồn tại:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Đừng cộng điểm.</strong> Không có đơn vị chung thì tổng không có nghĩa.
                </li>
                <li>
                  <strong>Đừng lấy trung bình.</strong> Trung bình của hai đại lượng khác thang là
                  một con số trông có vẻ khách quan mà rỗng.
                </li>
                <li>
                  <strong>Đừng bỏ bớt một bên cho gọn.</strong> Bỏ đi là mất luôn phần câu hỏi mà
                  chỉ bên ấy chạm tới được.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">
                Một ca cụ thể: “hướng nội” gặp “mạnh về giao thiệp”
              </h3>
              <p>
                Áp ba bước vào đúng tình huống ở đầu bài. Bước một: trắc nghiệm đang trả lời câu về{' '}
                <strong>cách bạn tư duy và nạp năng lượng</strong> — nguyên văn dữ liệu công cụ ghi
                trọng tâm của MBTI là “{MBTI_TRONG_TAM ?? '—'}”. Lá số đang trả lời câu về{' '}
                <strong>các lĩnh vực của đời sống</strong> — công cụ ghi Tử Vi mạnh ở “
                {TU_VI_MANH_O ?? '—'}”.
              </p>
              <p>
                Bước hai: hai câu ấy không có trục chung, nên dừng — không xếp hạng, không kết luận
                bên nào sai. Bước ba, dịch cả hai sang lời thường: “gặp đông người xong thì tôi cần
                thời gian một mình để hồi sức” và “phần lớn việc đáng kể của đời tôi diễn ra qua
                quan hệ với người khác”. Hai câu này{' '}
                <strong>cùng đúng được với một người</strong> — một câu nói về chi phí năng lượng,
                câu kia nói về nơi các sự kiện diễn ra.
              </p>
              <p className="text-sm text-foreground/70">
                Cái tưởng là mâu thuẫn biến mất không phải nhờ khoan dung với cả hai bên, mà nhờ
                tách một câu hỏi mập mờ thành hai câu hỏi rõ ràng.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ca ngược lại: khi hai hệ thật sự nói về cùng một thứ
              </h3>
              <p>
                Không phải cặp nào cũng vô phương đối chiếu. Với hai hệ cùng họ, trục chung có sẵn
                và việc đối chiếu trở nên bình thường. Nguyên văn câu trả lời của công cụ cho câu
                hỏi liệu{' '}
                {MBTI_BIG_FIVE ? (
                  <Link href={`/so-sanh/${MBTI_BIG_FIVE.slug}`} className={A}>
                    {MBTI_BIG_FIVE.title}
                  </Link>
                ) : (
                  <>hai hệ cùng họ</>
                )}{' '}
                có mâu thuẫn nhau không: {OVERLAP_FAQ ? <em>“{OVERLAP_FAQ.a}”</em> : <em>—</em>}
              </p>
              <p>
                Chú ý chỗ then chốt trong câu đó: lý do hai hệ nhất quán là vì chúng{' '}
                <strong>đo những chiều chồng lấn nhau</strong>, chứ không phải vì cả hai cùng đúng
                một cách thần kỳ. Có chiều chồng lấn thì mới có gì để nhất quán — đúng cùng một quy
                tắc đã nói ở mục trên, chỉ nhìn từ phía thuận.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: “cùng hữu ích” không có nghĩa là “cùng đúng”',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bài này rất dễ bị đọc chệch thành “mọi hệ đều có lý riêng nên đừng phán xét gì cả”.
                Không phải vậy, và phần này nói rõ những chỗ bài không bênh.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hữu ích và đúng là hai chuyện khác nhau.</strong> Một hệ có thể hữu ích
                  như khung để bạn tự chiêm nghiệm mà vẫn không có bằng chứng nào cho thấy nó dự báo
                  được điều gì. Bài này chỉ nói các hệ không phủ định nhau; nó không nói hệ nào
                  đúng.
                </li>
                <li>
                  <strong>Hai hệ cùng nói một điều KHÔNG phải là bằng chứng.</strong> Đây là chỗ hụt
                  chân phổ biến nhất sau khi đọc một bài như bài này: thấy hai bên trùng nhau rồi
                  tin chắc gấp đôi. Sự trùng khớp có thể chỉ vì cả hai đều mơ hồ đủ để hợp với gần
                  như ai — cơ chế đó nằm ở bài{' '}
                  <Link href="/learn/barnum" className={A}>
                    Hiệu ứng Barnum
                  </Link>
                  . Muốn biết một khẳng định có đứng được không thì phải kiểm riêng nó, theo cách ở
                  bài{' '}
                  <Link href="/learn/kiem-chung" className={A}>
                    Kiểm chứng dự đoán
                  </Link>
                  .
                </li>
                <li>
                  <strong>Trục chung vẫn cho phép nói bên nào vững hơn.</strong> Trong dữ liệu công
                  cụ, trục “{SCIENCE_AXIS}” chỉ dùng ở {SCIENCE_PAIRS.length} cặp trong họ bảng hỏi,
                  và ở đó bảng nói thẳng bên nào có nền nghiên cứu vững hơn. Bài không xoá điều đó
                  đi để giữ hoà khí.
                </li>
                <li>
                  <strong>Công cụ không đối chiếu hộ bạn.</strong> Nhắc lần cuối vì đây là hiểu lầm
                  hay gặp nhất: trang So sánh không nhận dữ liệu của bạn và không ghép hai kết quả.
                  Nó đối chiếu hai <em>hệ</em>, còn hai <em>kết quả</em> thì bạn tự đọc.
                </li>
                <li>
                  <strong>Phạm vi phủ còn hẹp.</strong> {PAIR_COUNT} cặp trên {POSSIBLE_PAIRS} cặp
                  ghép được từ {TOOL_COUNT} công cụ, và {CROSS_FAMILY_PAIRS} cặp bắc cầu giữa hai
                  họ. Nhiều câu hỏi so sánh mà bạn đang có sẽ không có sẵn trang tương ứng — lúc đó
                  ba bước ở mục trên là thứ bạn dùng.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh: xem mỗi lăng kính như một{' '}
                <strong>ngôn ngữ mô tả có phạm vi riêng</strong> — biết nó nói được về cái gì, biết
                nó im lặng ở đâu, và đừng bắt nó trả lời câu nằm ngoài phạm vi ấy. Không lăng kính
                nào, dù một hay ghép nhiều, thay được lời khuyên y tế, pháp lý hay tài chính từ
                người có chuyên môn.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <SoSanhWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <SoSanhRecall />,
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
                Bài này chỉ nói về cách đặt hai hệ cạnh nhau, không giảng lại nội dung hệ nào. Muốn
                hiểu từng hệ thì đọc bài riêng của nó:{' '}
                <Link href="/learn/mbti" className={A}>
                  MBTI
                </Link>
                ,{' '}
                <Link href="/learn/big-five" className={A}>
                  Big Five
                </Link>
                ,{' '}
                <Link href="/learn/enneagram" className={A}>
                  Enneagram
                </Link>
                ,{' '}
                <Link href="/learn/disc" className={A}>
                  DISC
                </Link>
                ,{' '}
                <Link href="/learn/tu-vi" className={A}>
                  Tử Vi
                </Link>
                ,{' '}
                <Link href="/learn/bat-tu" className={A}>
                  Bát Tự
                </Link>{' '}
                và{' '}
                <Link href="/learn/than-so-hoc" className={A}>
                  Thần Số Học
                </Link>
                .
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn xem bảng đối chiếu của một cặp cụ thể?{' '}
                <Link href="/so-sanh" className={A}>
                  Mở trang So sánh lăng kính →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/so-sanh', label: 'So sánh lăng kính' },
                    { href: '/mbti', label: 'Trắc nghiệm MBTI' },
                    { href: '/tu-vi', label: 'Xem Tử Vi' },
                    { href: '/tu-kiem', label: 'Tự kiểm — Đừng tin mù' },
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
          children: <SoSanhChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
