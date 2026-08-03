/**
 * Bài học /learn/that-tich — bài CHÍNH THỨC về Thất Tịch trên hieu.asia.
 *
 * NGUỒN (grounding) — không gõ tay ngày nào, không gõ tay con số thiên văn nào:
 *   • ./_active-learning.tsx — nơi khai báo DUY NHẤT của mọi dữ kiện dùng chung
 *     (ngày âm–dương suy từ solarToLunar() của lib/ngay-kieng-ky.ts; toạ độ, độ
 *     sáng, khoảng cách của Altair / Vega / Deneb; và các con số dẫn xuất như
 *     khoảng cách góc, khoảng cách thật, giờ sao lên cao nhất). Trang này IMPORT
 *     rồi render, nên hai file không thể lệch nhau.
 *   • app/that-tich-2026/page.tsx — trang công cụ đích, đã đọc hết. Bảng mốc
 *     ngày ở đây tái lập đúng bộ mốc của trang đó (mùng 1 / mùng 7 / rằm tháng
 *     7 âm) nhưng suy lại bằng engine lịch thay vì chép số.
 *
 * CÔNG CỤ /that-tich-2026 THẬT SỰ LÀM GÌ:
 *   CÓ — nêu ngày dương của 7/7 âm cùng hai mốc lân cận; kể sự tích; nói thẳng
 *   tục ăn chè đậu đỏ là trào lưu mạng chứ không phải nghi lễ cổ; trả lời 5 câu
 *   hỏi thường gặp; dẫn sang /hop-tuoi, /tarot, /la-so-tu-vi, /xem-ngay; tự
 *   chuyển hướng về trang thường niên khi hết mùa.
 *   KHÔNG — không nhận ngày sinh, không tính gì theo người dùng, không có bản đồ
 *   sao, không tính vị trí thiên thể, không dự đoán chuyện tình cảm. Toàn bộ phần
 *   thiên văn của bài là KIẾN THỨC NỀN và bài nói rõ công cụ không tính phần này.
 *
 * PHẠM VI (chống trùng): vì sao 7/7 âm trôi trên lịch dương → MỘT câu + link tới
 * /learn/lich-am-duong. Bầu trời thật nói chung → link /learn/thien-van. So sánh
 * Thất Tịch với các ngày lễ tình nhân khác thuộc chủ đề Ngày tình yêu, bài này
 * không bàn.
 *
 * GIỌNG: sao là THẬT, cầu Ô Thước là TRUYỆN. Không doạ, không phán duyên số,
 * không hứa đổi vận, không mỉa mai người giữ tục lệ.
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
  ThatTichFrame,
  ThatTichDepth,
  ThatTichRecall,
  ThatTichChecklist,
  ThatTichWhys,
  MILESTONES,
  STARS,
  ALTAIR,
  VEGA,
  DENEB,
  SEP_DEG,
  REAL_SEP_LY,
  DENEB_LY_RANGE,
  DENEB_FARTHER_RANGE,
  CULMINATION_HOUR,
  HANOI_LAT,
  CA_MAU_LAT,
  THAT_TICH_DATE,
  THAT_TICH_NEXT,
  THAT_TICH_YEAR,
  zenithGapDeg,
  fmtFull,
  fmtShort,
  vn,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Thất Tịch: truyện Ngưu Lang và sao trên trời',
  description:
    'Thất Tịch là mùng 7 tháng 7 âm. Ngưu Lang là sao Altair, Chức Nữ là sao Vega — hai sao có thật, hai bên dải Ngân Hà. Cầu Ô Thước là truyện, sao là thật.',
  alternates: { canonical: 'https://hieu.asia/learn/that-tich' },
};

// --- Dữ kiện render thẳng từ khối khai báo dùng chung ------------------------

const HANOI_GAP = vn(zenithGapDeg(HANOI_LAT, ALTAIR.decDeg));
// Cà Mau lệch chưa tới một độ nên phải in một chữ số thập phân: làm tròn về số
// nguyên sẽ ra "lệch chừng 0 độ", đọc như một khẳng định tuyệt đối sai.
const CA_MAU_GAP = vn(zenithGapDeg(CA_MAU_LAT, ALTAIR.decDeg), 1);

/** Hai tầng của cùng một ngày: cột trái đo được, cột phải là chuyện người kể. */
const TWO_LAYERS: readonly { chuDe: string; doDuoc: string; laTruyen: string }[] = [
  {
    chuDe: 'Hai nhân vật',
    doDuoc: `Hai ngôi sao thật: ${ALTAIR.ten} và ${VEGA.ten}, nhìn thấy bằng mắt thường.`,
    laTruyen: 'Chàng chăn trâu và cô gái dệt vải, yêu nhau rồi bị chia cắt.',
  },
  {
    chuDe: 'Con sông',
    doDuoc: 'Dải Ngân Hà — ánh sáng gộp lại của hàng trăm tỉ ngôi sao trong thiên hà của chúng ta.',
    laTruyen: 'Sông Ngân, do một bàn tay quyền lực vạch ra để chia đôi hai người.',
  },
  {
    chuDe: 'Cây cầu',
    doDuoc: 'Không có gì. Vùng trời giữa hai sao chính là dải Ngân Hà, và nó ở đó quanh năm.',
    laTruyen: 'Cầu Ô Thước do đàn quạ bắc, chỉ hiện ra đúng đêm mùng 7 tháng 7.',
  },
  {
    chuDe: 'Cuộc gặp mỗi năm',
    doDuoc: `Hai sao cách nhau khoảng ${vn(SEP_DEG)} độ trên trời quanh năm và khoảng ${vn(REAL_SEP_LY)} năm ánh sáng trong không gian thật. Khoảng cách ấy không đổi.`,
    laTruyen: 'Mỗi năm một lần, hai người được gặp nhau trọn một đêm.',
  },
  {
    chuDe: 'Mưa ngâu tháng 7',
    doDuoc: 'Cuối mùa mưa ở miền Bắc — mưa rả rích nhiều ngày là chuyện khí hậu, năm nào cũng có.',
    laTruyen: 'Nước mắt của hai người lúc chia tay.',
  },
];

// FAQ khai báo MỘT lần, dùng cho cả accordion hiển thị lẫn FAQPage JSON-LD →
// chữ trong schema luôn đúng bằng chữ trên trang. Bộ câu hỏi cố ý KHÁC bộ FAQ
// của công cụ /that-tich-2026 (ở đó hỏi "ngày nào", "có phải Valentine châu Á",
// "ăn chè đậu đỏ", "tháng cô hồn có kiêng cưới", "xem duyên theo lá số là gì").
const FAQS = [
  {
    q: 'Ngưu Lang và Chức Nữ có phải là hai ngôi sao có thật không?',
    a: `Có. Chức Nữ là sao ${VEGA.ten} trong chòm ${VEGA.chomSao}, Ngưu Lang là sao ${ALTAIR.ten} trong chòm ${ALTAIR.chomSao}. Đây không phải cách gán ghép của đời sau: thiên văn Trung Hoa cổ gọi thẳng hai ngôi ấy là ${VEGA.tenHan} và ${ALTAIR.tenHan} — tên nhân vật chính là tên sao. Cả hai đều thuộc nhóm sáng nhất bầu trời đêm nên bạn nhìn thấy được bằng mắt thường, không cần kính, kể cả từ sân thượng thành phố nếu trời quang.`,
  },
  {
    q: 'Đêm Thất Tịch hai ngôi sao đó có lại gần nhau không?',
    a: `Không. Trên bầu trời chúng cách nhau khoảng ${vn(SEP_DEG)} độ và con số đó gần như không đổi trong suốt đời một con người. Trong không gian thật, tính cả chênh lệch khoảng cách tới Trái Đất, hai sao cách nhau khoảng ${vn(REAL_SEP_LY)} năm ánh sáng — nghĩa là một tia sáng phát đi từ sao này phải mất chừng ấy năm mới tới sao kia. Cái thật sự đổi theo mùa là chỗ đứng của Trái Đất trên quỹ đạo, khiến cụm sao lên cao vào đầu đêm mùa hè và khuất đi vào mùa đông.`,
  },
  {
    q: 'Vậy cầu Ô Thước ứng với thứ gì trên trời?',
    a: 'Không ứng với thứ gì cả — đó là phần truyện. Ranh giới nên nhớ rất gọn: dải Ngân Hà là thật, hai ngôi sao là thật, mùa nhìn rõ chúng là thật; còn đàn quạ bắc cầu và cuộc gặp mỗi năm một lần là do người kể chuyện thêm vào. Nói vậy không làm câu chuyện kém hay đi. Nó chỉ giúp bạn không dùng một câu chuyện đẹp làm bằng chứng cho một điều nó không hề chứng minh.',
  },
  {
    q: 'Tam giác Mùa hè là gì, và có liên quan gì tới Thất Tịch?',
    a: `Là hình tam giác nối ba ngôi sao sáng của ba chòm khác nhau: ${VEGA.ten}, ${ALTAIR.ten} và ${DENEB.ten}. Đây là một hình vẽ nối sao cho dễ nhớ, không phải một chòm sao chính thức. Liên quan tới Thất Tịch ở chỗ hai đỉnh của tam giác chính là hai nhân vật trong truyện, còn đỉnh thứ ba nằm ngay trong dải Ngân Hà. Đỉnh thứ ba không có vai nào trong truyện Ngưu Lang – Chức Nữ, nhưng nó là mốc dễ thấy nhất để bạn định vị hai ngôi kia trên trời.`,
  },
  {
    q: 'Ở Việt Nam nhìn thấy được không, và nhìn lúc nào?',
    a: `Được, và rất dễ. Vào mùa Thất Tịch, cụm ba sao này lên cao nhất vào khoảng ${CULMINATION_HOUR} giờ, tức chừng ${CULMINATION_HOUR - 12} giờ tối. ${ALTAIR.ten} có xích vĩ ${vn(ALTAIR.decDeg, 1)} độ, xấp xỉ vĩ độ cực nam của nước ta — nên ở mũi Cà Mau nó gần như đi qua đúng đỉnh đầu, còn ở Hà Nội cũng chỉ lệch khỏi đỉnh khoảng ${HANOI_GAP} độ. Điều kiện cần là trời quang và ít ánh đèn: hai ngôi sao thì thành phố vẫn thấy, nhưng muốn thấy dải Ngân Hà mờ vắt giữa chúng thì phải ra chỗ tối.`,
  },
  {
    q: 'Vì sao Thất Tịch năm nào cũng rơi vào một ngày dương lịch khác nhau?',
    a: `Vì ngày này cố định trên lịch âm chứ không phải lịch dương: nó luôn là mùng 7 tháng 7 âm. Năm ${THAT_TICH_YEAR} rơi vào ${fmtFull(THAT_TICH_DATE)}, còn năm ${THAT_TICH_YEAR + 1} lại là ${fmtShort(THAT_TICH_NEXT)}. Nguyên nhân là tháng âm đếm theo tuần trăng còn năm dương đếm theo vòng Trái Đất quanh Mặt Trời, hai thước đo không chia hết cho nhau nên mốc trôi qua lại giữa các năm.`,
  },
  {
    q: 'Trang Thất Tịch của hieu.asia có tính gì theo ngày sinh của tôi không?',
    a: `Không. Trang Thất Tịch ${THAT_TICH_YEAR} là một trang thông tin theo mùa: nó nêu ngày dương của 7/7 âm cùng vài mốc lân cận trong tháng 7 âm, kể sự tích, nói thẳng rằng tục ăn chè đậu đỏ là trào lưu mạng chứ không phải nghi lễ cổ truyền, rồi dẫn bạn sang các công cụ khác nếu bạn muốn xem tiếp. Nó không có ô nhập ngày sinh, không tính gì riêng cho bạn, không có bản đồ sao và không tính vị trí thiên thể. Phần thiên văn trong bài học này là kiến thức nền để bạn tự ngắm trời, công cụ không tính phần đó.`,
  },
  {
    q: 'Không ăn chè đậu đỏ, không cầu gì trong ngày này thì có sao không?',
    a: 'Không sao cả. Đây là một ngày trong lịch, không phải một cánh cửa chỉ mở một lần rồi đóng. Nếu bạn thấy vui khi rủ bạn bè đi ăn chè hay ra sân ngắm sao thì cứ làm, niềm vui đó là thật. Chỉ nên cảnh giác khi ai đó biến ngày này thành nỗi sợ bỏ lỡ để bán cho bạn một thứ gì đó. hieu.asia không bán vật phẩm cầu duyên và không đoán ngày bạn gặp được ai.',
  },
];

const JSONLD = [
  article({
    headline: 'Thất Tịch: sự tích Ngưu Lang – Chức Nữ và hai ngôi sao có thật trên bầu trời',
    description:
      'Thất Tịch là mùng 7 tháng 7 âm lịch. Ngưu Lang là sao Altair, Chức Nữ là sao Vega — hai ngôi sao thật nằm hai bên dải Ngân Hà, cùng Deneb tạo thành Tam giác Mùa hè. Bài tách rõ phần đo được với phần là truyện.',
    url: '/learn/that-tich',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Thất Tịch', url: '/learn/that-tich' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Thất Tịch — truyện Ngưu Lang – Chức Nữ và bầu trời thật',
    description:
      'Thất Tịch là mùng 7 tháng 7 âm. Ngưu Lang là sao Altair, Chức Nữ là sao Vega — hai sao có thật, hai bên dải Ngân Hà. Cầu Ô Thước là truyện, sao là thật.',
    url: '/learn/that-tich',
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

export default function LearnThatTichPage() {
  return (
    <LearnArticle
      eyebrow="TỤC LỆ · THIÊN VĂN"
      title={
        <>
          Thất Tịch{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (truyện và bầu trời thật)
          </span>
        </>
      }
      standfirst={
        <>
          Mùng 7 tháng 7 âm lịch, người ta kể chuyện Ngưu Lang – Chức Nữ gặp nhau trên cầu Ô Thước.
          Điều ít được nói tới: hai nhân vật ấy là hai ngôi sao có thật, đang ở trên đầu bạn đúng
          mùa này. Bài này chỉ cho bạn thấy chúng — và tách rạch ròi phần nhìn được với phần là
          truyện.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Thất Tịch' },
      ]}
      relatedLenses={relatedLearnLenses('that-tich')}
      tryCta={{
        heading: 'Xem ngày và các mốc trong tháng',
        blurb: `Trang Thất Tịch ${THAT_TICH_YEAR} nêu ngày dương của mùng 7 tháng 7 âm cùng các mốc lân cận, kể sự tích và dẫn sang các công cụ khác. Đó là một trang thông tin theo mùa — không nhận ngày sinh và không tính gì riêng cho bạn.`,
        href: '/that-tich-2026',
        label: `Xem trang Thất Tịch ${THAT_TICH_YEAR}`,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <ThatTichFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Thất Tịch là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Thất Tịch nghĩa đen là <strong>đêm mùng bảy</strong>: ngày mùng 7 tháng 7 âm lịch.
                Năm {THAT_TICH_YEAR}, ngày ấy rơi vào <strong>{fmtFull(THAT_TICH_DATE)}</strong>.
                Nội dung của ngày là một câu chuyện — chàng chăn trâu Ngưu Lang và cô gái dệt vải
                Chức Nữ bị chia hai bên sông Ngân, mỗi năm chỉ gặp nhau một lần khi đàn quạ bắc cầu
                Ô Thước.
              </p>
              <p>
                Điểm khiến ngày này đáng học hơn hầu hết các ngày lễ khác:{' '}
                <strong>hai nhân vật trong truyện là hai ngôi sao có thật</strong>, và mùa kể chuyện
                đúng là mùa hai ngôi sao ấy lên cao nhất trên trời Việt Nam. Câu chuyện không lơ
                lửng trong không khí — nó neo vào một thứ bạn ra sân là nhìn thấy.
              </p>
              <p>Cần chốt ngay bốn điều Thất Tịch KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một hiện tượng thiên văn xảy ra trong đêm đó.</strong> Hai ngôi
                  sao không xích lại gần nhau. Thứ đổi theo mùa là chỗ đứng của Trái Đất, không phải
                  chỗ đứng của các vì sao.
                </li>
                <li>
                  <strong>Không phải một phép đo về chuyện tình cảm của bạn.</strong> Không có một
                  dữ kiện cá nhân nào tham gia: cùng một ngày, cùng một bầu trời cho tất cả mọi
                  người.
                </li>
                <li>
                  <strong>Không phải một ngày lễ tình nhân theo nghĩa quen thuộc.</strong> Gốc của
                  truyện là xa cách và chờ đợi. Ở Trung Hoa xưa đêm này là <em>lễ Khất Xảo</em> —
                  con gái cầu cho khéo tay, giỏi nữ công, không phải cầu người yêu.
                </li>
                <li>
                  <strong>Không phải một ngày cố định trên lịch dương.</strong> Nó cố định trên lịch
                  âm (7/7) nên trôi trên lịch dương: {fmtShort(THAT_TICH_DATE)} năm{' '}
                  {THAT_TICH_YEAR}, {fmtShort(THAT_TICH_NEXT)} năm {THAT_TICH_YEAR + 1}.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Vì sao một ngày âm lịch lại trôi trên lịch dương — tuần trăng và năm mặt trời không
                chia hết cho nhau — thuộc bài{' '}
                <Link href="/learn/lich-am-duong" className={A}>
                  Lịch âm dương
                </Link>
                . Bài này chỉ dùng kết quả. Còn phần so sánh Thất Tịch với các ngày lễ tình nhân
                khác thuộc chủ đề Ngày tình yêu, không nằm trong phạm vi ở đây.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <ThatTichDepth />,
        },
        {
          id: 'truyen-va-tuc-le',
          tocLabel: 'Truyện và tục lệ',
          heading: 'Câu chuyện, và những tục lệ mọc quanh mùng 7 tháng 7',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bản kể phổ biến ở Việt Nam rất gọn. Chức Nữ là người dệt vải trên trời, phải lòng
                chàng chăn trâu Ngưu Lang dưới hạ giới. Vì mối duyên trái phép, hai người bị chia
                cắt hai bên sông Ngân; mỗi năm đúng đêm mùng 7 tháng 7, đàn quạ bay lên bắc thành
                cầu Ô Thước cho họ gặp nhau một lần.
              </p>
              <p>
                Đáng chú ý là <strong>giọng gốc của ngày này không vui</strong>. Nó là chuyện về xa
                cách, chờ đợi và giữ lòng — gần với một bài thơ buồn hơn là một dịp hò hẹn. Cách gọi
                “ngày lễ tình nhân phương Đông” là chuyện của thời nay, không phải của bản kể xưa.
              </p>
              <p>Ba lớp tục lệ khác nhau đã lần lượt đắp lên cùng một ngày:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Lễ Khất Xảo (Trung Hoa cổ).</strong> Con gái bày kim chỉ, thi xâu kim dưới
                  trăng, cầu cho khéo tay như Chức Nữ. Nội dung là <em>nghề</em>, không phải{' '}
                  <em>duyên</em>.
                </li>
                <li>
                  <strong>Mưa ngâu (Việt Nam).</strong> Tháng 7 âm ở miền Bắc rơi vào cuối mùa mưa,
                  mưa rả rích nhiều ngày liền. Dân gian gọi đó là mưa ngâu, gắn vào nước mắt của hai
                  người — một cái tên đẹp đặt cho một hiện tượng khí hậu.
                </li>
                <li>
                  <strong>Chè đậu đỏ (mới, lan từ mạng xã hội).</strong> Không có trong nghi lễ cổ
                  truyền. Trang công cụ của hieu.asia cũng nói thẳng điều này, và nói thêm rằng rủ
                  nhau đi ăn chè là một cái cớ dễ thương để gặp gỡ — giá trị nằm ở chỗ gặp nhau, chứ
                  không phải ở bát chè.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Thất Tịch nằm trong tháng 7 âm lịch, tháng mà dân gian quen gọi là tháng cô hồn, và
                cách đó hơn một tuần là rằm tháng 7 — lễ Vu Lan. Ba mốc khác nhau, ba tục khác nhau,
                rất hay bị gộp làm một. Bảng dưới đây tách chúng ra theo đúng ngày.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ba mốc trong tháng 7 âm, năm {THAT_TICH_YEAR}
              </h3>
              <p>
                Cột ngày dương không được gõ tay: trang này suy lại bằng đúng hàm đổi lịch âm –
                dương mà mọi công cụ ngày–giờ của hieu.asia đang dùng, nên nếu engine lịch đổi thì
                bảng dưới đổi theo.
              </p>
              <Scroller minWidth="min-w-[620px]">
                <TableHead cols={['Mốc âm lịch', 'Ngày dương', 'Ghi chú']} />
                <tbody>
                  {MILESTONES.map((m) => (
                    <tr key={m.lunar} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {m.lunar}
                      </th>
                      <td className="px-4 py-2 tabular-nums text-foreground">{fmtFull(m.date)}</td>
                      <td className={TD}>{m.note}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Muốn tra ngày âm, can chi và giờ hoàng đạo của một ngày bất kỳ thì dùng{' '}
                <Link href="/lich-van-nien" className={A}>
                  Lịch vạn niên 2026
                </Link>
                ; còn nếu bạn đang cân nhắc việc trọng đại trong tháng này, xem{' '}
                <Link href="/thang-co-hon-2026" className={A}>
                  Tháng cô hồn 2026
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'hai-ngoi-sao',
          tocLabel: 'Hai ngôi sao thật',
          heading: 'Ngưu Lang là Altair, Chức Nữ là Vega — hai ngôi sao có thật',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phần lõi của bài. Hai nhân vật trong truyện không phải hình ảnh ước lệ: người
                xưa đặt tên cho <strong>hai ngôi sao cụ thể</strong> trên bầu trời, và tên nhân vật
                chính là tên sao. Chức Nữ là ngôi mà thiên văn ngày nay gọi là{' '}
                <strong>{VEGA.ten}</strong>; Ngưu Lang là <strong>{ALTAIR.ten}</strong>.
              </p>
              <p>
                Vị trí của chúng mới là chỗ khiến câu chuyện gần như tự kể ra:{' '}
                <strong>hai ngôi đứng hai bên dải Ngân Hà</strong>, vệt sáng mờ vắt ngang bầu trời
                mùa hè. Một con sông ánh sáng chia đôi trời, hai ngôi sáng nhất đứng đối nhau qua bờ
                — người xưa nhìn thấy đúng hình ảnh ấy trước khi có bất kỳ câu chuyện nào.
              </p>
              <Scroller minWidth="min-w-[880px]">
                <TableHead
                  cols={[
                    'Sao',
                    'Tên trong thiên văn Hán cổ',
                    'Chòm sao',
                    'Cấp sao',
                    'Khoảng cách',
                    'So với dải Ngân Hà',
                  ]}
                />
                <tbody>
                  {STARS.map((s) => (
                    <tr key={s.ten} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {s.ten}
                      </th>
                      <td className={TD}>{s.tenHan}</td>
                      <td className={TD}>{s.chomSao}</td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {vn(s.capSao, 2)}
                      </td>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {s.ly === undefined
                          ? `${DENEB_LY_RANGE} năm ánh sáng (chưa thống nhất)`
                          : `${vn(s.ly, 1)} năm ánh sáng`}
                      </td>
                      <td className={TD}>{s.viTriNganHa}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Đọc cột cấp sao ngược với trực giác: <strong>số càng nhỏ thì nhìn càng sáng</strong>
                . Vì vậy {VEGA.ten} ({vn(VEGA.capSao, 2)}) sáng hơn {ALTAIR.ten} (
                {vn(ALTAIR.capSao, 2)}), và cả hai đều thuộc nhóm sáng nhất bầu trời đêm — mắt
                thường thấy được, không cần kính.
              </p>
              <p>
                Cột khoảng cách là chỗ câu chuyện và phép đo tách hẳn nhau. Trên bầu trời, hai ngôi
                cách nhau khoảng <strong>{vn(SEP_DEG)} độ</strong> — con số suy từ toạ độ của chúng
                chứ không ước chừng bằng mắt. Nhưng đó chỉ là khoảng cách <em>góc</em>, tức hình
                chiếu lên vòm trời. Tính cả chênh lệch khoảng cách tới Trái Đất, hai sao thật sự
                cách nhau <strong>khoảng {vn(REAL_SEP_LY)} năm ánh sáng</strong>.
              </p>
              <p>
                Nói cho dễ hình dung: nếu Chức Nữ bật một ngọn đèn ngay lúc này, Ngưu Lang phải chờ{' '}
                <strong>chừng {vn(REAL_SEP_LY)} năm</strong> mới thấy ánh đèn ấy. Không có cuộc gặp
                nào mỗi năm một lần, và khoảng cách đó gần như không nhúc nhích trong suốt một đời
                người.
              </p>
              <p className="text-sm text-foreground/70">
                Ngôi thứ ba trong bảng, {DENEB.ten}, không có vai nào trong truyện Ngưu Lang – Chức
                Nữ. Nó có mặt ở đây vì hai lý do: nó nằm ngay trong dải Ngân Hà nên là mốc định vị
                tốt, và nó là đỉnh thứ ba của Tam giác Mùa hè ở mục sau. Đáng chú ý là nó chỉ trông
                mờ hơn {ALTAIR.ten} một chút trong khi ở xa hơn <strong>khoảng{' '}
                {DENEB_FARTHER_RANGE} lần</strong> — nghĩa là bản thân nó sáng khủng khiếp. Con số
                khoảng cách của {DENEB.ten} là ước lượng: các phép đo cho ra khoảng{' '}
                {DENEB_LY_RANGE} năm ánh sáng, chênh nhau gần gấp đôi, nên chỉ nên dùng để so độ
                lớn chứ đừng trích như một con số chắc chắn.
              </p>
            </div>
          ),
        },
        {
          id: 'tam-giac-mua-he',
          tocLabel: 'Tam giác Mùa hè',
          heading: 'Tam giác Mùa hè: nhìn ở đâu, nhìn lúc nào trên trời Việt Nam',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ba ngôi {VEGA.ten}, {ALTAIR.ten} và {DENEB.ten} nối lại thành một tam giác lớn gọi
                là <strong>Tam giác Mùa hè</strong>. Cần nói rõ ngay: đây là một{' '}
                <strong>hình vẽ nối sao cho dễ nhớ</strong>, không phải một chòm sao chính thức — ba
                đỉnh thuộc ba chòm khác nhau, và chúng chẳng liên quan gì tới nhau trong không gian
                thật. Giá trị của nó thuần tuý là giá trị của một tấm bản đồ.
              </p>
              <p>
                Vì sao mùa này lại nhìn rõ? Trái Đất quay quanh Mặt Trời, nên mỗi mùa buổi tối ta
                nhìn về một hướng khác của vũ trụ. Cuối mùa hè, hướng buổi tối của chúng ta trỏ đúng
                vào vùng trời có ba ngôi sao này. <strong>Các ngôi sao không đi đâu cả</strong> — ta
                mới là người đi vòng quanh.
              </p>
              <p>Ba điều giúp bạn tìm được chúng trong một buổi tối:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Chọn giờ.</strong> Quanh ngày Thất Tịch, cụm sao lên cao nhất vào khoảng{' '}
                  <strong>{CULMINATION_HOUR} giờ</strong> — tức chừng {CULMINATION_HOUR - 12} giờ
                  tối. Trước hoặc sau vài giờ vẫn thấy, chỉ là thấp hơn.
                </li>
                <li>
                  <strong>Nhìn lên gần đỉnh đầu.</strong> Xích vĩ của {ALTAIR.ten} là{' '}
                  {vn(ALTAIR.decDeg, 1)} độ, xấp xỉ vĩ độ cực nam nước ta. Ở mũi Cà Mau (khoảng{' '}
                  {vn(CA_MAU_LAT, 1)} độ Bắc) nó gần như đi qua đúng đỉnh đầu, lệch chừng{' '}
                  {CA_MAU_GAP} độ; ở Hà Nội (khoảng {vn(HANOI_LAT, 1)} độ Bắc) cũng chỉ lệch khoảng{' '}
                  {HANOI_GAP} độ. Nghĩa là cả nước đều nhìn được rất cao, không bị nhà cửa che.
                </li>
                <li>
                  <strong>Nhận ra hai ngôi sáng nhất rồi lần ra ngôi thứ ba.</strong> {VEGA.ten}{' '}
                  sáng nhất trong ba; {ALTAIR.ten} ở phía bên kia vệt Ngân Hà;{' '}
                  {DENEB.ten} là đỉnh còn lại, nằm chìm trong chính vệt sáng đó.
                </li>
              </ol>
              <p className="text-sm text-foreground/70">
                Một lưu ý thật thà: hai ngôi sao thì thành phố vẫn thấy, nhưng{' '}
                <strong>dải Ngân Hà thì cần trời tối</strong>. Ở nội đô, ánh đèn xoá gần hết vệt
                sáng mờ ấy — nên nếu muốn nhìn thấy “con sông” trong truyện, hãy ra chỗ ít đèn vào
                một đêm quang mây. Cái bạn nhìn thấy không phụ thuộc vào việc hôm đó có phải Thất
                Tịch hay không: cả tháng đều thấy, ngày Thất Tịch chỉ là ngày người ta hẹn nhau cùng
                ngẩng lên.
              </p>
              <p className="text-sm text-foreground/70">
                Bầu trời thật nói chung — nhật thực, nguyệt thực, vì sao lịch pháp phương Đông lại
                gắn với các chu kỳ quan sát được — nằm ở bài{' '}
                <Link href="/learn/thien-van" className={A}>
                  Lịch thiên văn
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'sao-that-cau-la-truyen',
          tocLabel: 'Tách hai tầng',
          heading: 'Tách hai tầng: cái gì đo được, cái gì là truyện',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là kỹ năng đáng mang đi khỏi bài này nhất, và nó dùng được ở mọi chủ đề khác
                trong khu Học. Cùng một đêm Thất Tịch có hai tầng chồng lên nhau: một tầng{' '}
                <strong>kiểm được bằng mắt và bằng phép đo</strong>, một tầng{' '}
                <strong>do người kể chuyện dựng nên</strong>. Cả hai đều đáng giữ, nhưng không được
                nhầm cái này thành cái kia.
              </p>
              <Scroller minWidth="min-w-[780px]">
                <TableHead cols={['Chi tiết', 'Tầng đo được', 'Tầng là truyện']} />
                <tbody>
                  {TWO_LAYERS.map((r) => (
                    <tr key={r.chuDe} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {r.chuDe}
                      </th>
                      <td className="px-4 py-2 text-foreground">{r.doDuoc}</td>
                      <td className={TD}>{r.laTruyen}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Bảng trên liệt kê <strong>năm chi tiết</strong>. Để ý một điều: cột giữa không hề
                nghèo hơn cột phải. Chuyện hai ngôi sao cách nhau {vn(REAL_SEP_LY)} năm ánh sáng và
                ánh sáng phải mất chừng ấy năm để đi từ ngôi này sang ngôi kia, tự nó đã là một hình
                ảnh về khoảng cách mạnh không kém cây cầu quạ.
              </p>
              <p>
                Vì sao phải tách? Vì{' '}
                <strong>gộp lại thì hỏng cả hai</strong>. Câu chuyện bị đem ra làm bằng chứng cho
                một chuyển động không có thật thì nó hoá sai; còn phép đo bị bọc trong truyện thì
                không ai kiểm lại được nữa. Tách ra, bạn giữ nguyên vẹn cả hai: một câu chuyện đáng
                kể lại cho con cháu, và một bầu trời có thể chỉ tận nơi cho chúng xem.
              </p>
              <p className="text-sm text-foreground/70">
                Cùng một cách đọc áp được cho phần lớn nội dung ở khu Học: hỏi “chỗ nào đo được?” và
                “chỗ nào là quy ước hoặc là truyện?”, rồi ghi rõ ranh giới thay vì trình bày cả gói
                như nhau.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: một ngày trong lịch không nói gì về chuyện tình cảm của bạn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này nói thẳng, vì Thất Tịch là dịp dễ bị dùng để bán nỗi lo nhất trong năm.
                Thất Tịch là một <strong>ngày trong lịch âm cộng một câu chuyện</strong>. Không có
                đại lượng nào ngoài đời tương ứng với “vận duyên trong ngày Thất Tịch”, nên cũng
                không có gì để đo và không có gì để cầu.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Ngày này giống nhau với tất cả mọi người.</strong> Không có dữ kiện cá
                  nhân nào tham gia — cùng một ngày, cùng một bầu trời. Bất cứ ai nói ngày Thất Tịch
                  tác động riêng tới bạn đều đang thêm vào một thứ không có trong phép tính.
                </li>
                <li>
                  <strong>Không có “bỏ lỡ”.</strong> Đây là một mốc lặp lại hằng năm, không phải một
                  cánh cửa chỉ mở một lần. Nếu bạn bận, không ăn chè, không ra sân ngắm sao thì cũng
                  không mất gì cả — hai ngôi sao ấy còn ở đó cả tháng, và còn ở đó rất lâu sau đời
                  chúng ta.
                </li>
                <li>
                  <strong>Phần thiên văn trong bài này công cụ không tính.</strong> Trang Thất Tịch{' '}
                  {THAT_TICH_YEAR} của hieu.asia không có bản đồ sao, không tính vị trí thiên thể,
                  không nhận ngày sinh. Những con số về sao ở trên là kiến thức nền để bạn tự ngắm
                  trời, chứ không phải kết quả của một công cụ nào.
                </li>
                <li>
                  <strong>Các con số thiên văn có sai số.</strong> Khoảng cách tới {DENEB.ten} chỉ
                  là ước lượng — các phép đo cho ra khoảng {DENEB_LY_RANGE} năm ánh sáng, chênh nhau
                  gần gấp đôi. Giờ cụm sao lên cao nhất cũng là ước lượng thô, xê dịch vài chục phút
                  tuỳ ngày và tuỳ nơi bạn đứng.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh: xem Thất Tịch như một{' '}
                <strong>cái hẹn văn hoá để cùng ngẩng đầu lên</strong> — biết ngày ấy tính từ đâu,
                biết câu chuyện của nó, và biết chỉ cho người bên cạnh hai ngôi sao có thật. Nó
                không thay được lời khuyên nào về đời sống thật của bạn, và tuyệt đối không phải lý
                do để mua bất cứ thứ gì nhằm “cầu duyên”.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <ThatTichWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <ThatTichRecall />,
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
                Muốn đi tiếp theo hướng bầu trời, đọc{' '}
                <Link href="/learn/thien-van" className={A}>
                  Lịch thiên văn
                </Link>
                . Muốn hiểu vì sao ngày 7/7 âm trôi trên lịch dương, đọc{' '}
                <Link href="/learn/lich-am-duong" className={A}>
                  Lịch âm dương
                </Link>
                .
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/that-tich-2026', label: `Xem trang Thất Tịch ${THAT_TICH_YEAR}` },
                    { href: '/lich-van-nien', label: 'Lịch vạn niên 2026' },
                    { href: '/thang-co-hon-2026', label: 'Tháng cô hồn 2026' },
                    { href: '/hop-tuoi', label: 'Xem hợp tuổi' },
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
          children: <ThatTichChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
