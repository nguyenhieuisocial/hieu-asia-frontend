/**
 * Bài học /learn/nhip-song — bài CHÍNH THỨC về "chia nhịp để lên kế hoạch".
 *
 * NGUỒN GROUNDING DUY NHẤT: app/ban-do/page.tsx (đọc trực tiếp, không đoán).
 * Trang đó KHÔNG export hằng số nào — `QUARTERS`, `formatVnToday()`,
 * `formatVnLastDayOfMonth()` đều là const/hàm nội bộ của module, chỉ có
 * `metadata`, `dynamic` và default component được export. Vì vậy bài này KHÔNG
 * import được gì từ nó, và cũng CỐ Ý KHÔNG chép lại câu chữ gợi ý của trang
 * (chép = tạo bản sao sẽ trôi khỏi nguồn ngay lần sửa đầu tiên). Thứ được mô tả
 * ở đây là CẤU TRÚC trang, thứ ổn định và kiểm lại được bằng mắt trong 10 giây:
 *
 * CÔNG CỤ /ban-do THẬT SỰ LÀM GÌ (đọc code):
 *   • Render 4 khối nhịp cố định: Hôm nay · Tuần này · Tháng này · Năm nay.
 *   • TÍNH tại thời điểm mở trang đúng HAI mốc thời gian, đều từ đồng hồ hệ
 *     thống + Intl với timeZone 'Asia/Ho_Chi_Minh':
 *       – formatVnToday(now)          → thứ + ngày/tháng/năm của hôm nay;
 *       – formatVnLastDayOfMonth(now) → ngày cuối tháng hiện tại (ngày đặt lịch
 *         nhìn lại tháng).
 *     `export const dynamic = 'force-dynamic'` nên hai mốc này luôn đúng thật.
 *   • MỌI dòng khuyên còn lại (gợi ý ngày, chủ đề tuần, mục tiêu tháng, "chủ đề
 *     lưu niên", 4 ô quý kèm nhãn Thuận lợi/Cẩn trọng, danh sách quyết định
 *     lớn) là CHỮ CỐ ĐỊNH trong mã nguồn — giống hệt nhau với mọi người xem,
 *     mọi lúc. Nhãn "lưu niên" ở khối năm giữ nguyên chữ của trang vì đó là chỗ
 *     dễ nhầm nhất, không phải lưu niên tính từ lá số (xem /learn/luu-nien).
 *   • Trang CHỈ ĐỂ ĐỌC: không có input, không lưu gì — nên bài không được nói
 *     hay ám chỉ rằng người đọc "điền" được vào trang.
 *   • KHÔNG nhận ngày giờ sinh, KHÔNG đọc lá số, KHÔNG gọi API nào. Chính trang
 *     dán nhãn "Nội dung minh hoạ — chưa kết nối lá số của bạn" ở đầu và ghi
 *     dưới khối năm rằng lá số riêng sẽ cá nhân hoá nhiều hơn.
 *
 * VÌ VẬY BÀI NÀY KHÔNG DẠY: cách công cụ "chấm" một giai đoạn tốt hay xấu —
 * công cụ không tính phần đó, nên bài không dạy phần đó.
 *
 * PHẠM VI (chống trùng): chu kỳ 10 năm thuộc /learn/dai-van; chồng lớp năm lên
 * vận thuộc /learn/luu-nien; mốc chuyển tiết thuộc /learn/tiet-khi; chọn ngày
 * giờ thuộc /learn/trach-cat — mỗi bài chỉ được nhắc MỘT câu + link.
 *
 * Giọng: nhịp là công cụ TỔ CHỨC CÔNG VIỆC, không phải huyền học và không phải
 * dự báo. Không doạ, không phán số mệnh, không chê người đọc.
 */

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { learnTopicBySlug } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  NhipFrame,
  NhipDepth,
  NhipRecall,
  NhipChecklist,
  NhipWhys,
  BAN_DO_TRACKS,
  TRACK_COUNT,
  COMPUTED_COUNT,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Nhịp tuần – tháng – quý để lên kế hoạch',
  description:
    'Nhịp tuần, tháng, quý là khung tổ chức công việc, không phải dự báo. Cách đặt việc lớn vào giai đoạn bạn thật sự rảnh, thay vì chờ một giai đoạn đẹp.',
  alternates: { canonical: 'https://hieu.asia/learn/nhip-song' },
};

// --- Dữ kiện của bài --------------------------------------------------------
// `BAN_DO_TRACKS` / `TRACK_COUNT` / `COMPUTED_COUNT` khai báo MỘT lần ở
// ./_active-learning và import về đây, nên hai file của bài không bao giờ lệch
// số với nhau. Mọi con số hiển thị dưới đây đều suy từ `.length`.

/** Bốn thứ đếm được để trả lời "giai đoạn này tôi có thật sự rảnh không". */
const CAPACITY_CHECKS: { thu: string; cauHoi: string }[] = [
  {
    thu: 'Giờ trống liền mạch mỗi tuần',
    cauHoi:
      'Mở lịch tuần thật ra. Sau những việc bắt buộc, còn lại bao nhiêu khối thời gian không bị cắt vụn?',
  },
  {
    thu: 'Tiền dự phòng',
    cauHoi:
      'Nếu việc này chậm gấp đôi dự kiến, bạn còn trả được chi phí cố định trong bao nhiêu tháng?',
  },
  {
    thu: 'Người đỡ việc',
    cauHoi:
      'Khi bạn kẹt, ai nhận bàn giao? Phải là một cái tên cụ thể, không phải “chắc sẽ có người”.',
  },
  {
    thu: 'Hạn cứng bên ngoài',
    cauHoi:
      'Mùa vụ của ngành, kỳ tuyển sinh, hạn hợp đồng, lịch gia đình — cái nào không thể dời?',
  },
];

/** Ranh giới giữa "gợi ý nhịp" và "dự báo", theo từng khía cạnh. */
const BOUNDARY_ROWS: { khia: string; nhip: string; duBao: string }[] = [
  {
    khia: 'Nói về cái gì',
    nhip: 'Khi nào bạn đặt việc xuống, và khi nào bạn dừng lại nhìn lại.',
    duBao: 'Chuyện gì sẽ xảy ra với bạn trong giai đoạn đó.',
  },
  {
    khia: 'Đầu vào',
    nhip: 'Lịch có thật của bạn: giờ trống, tiền dự phòng, người đỡ việc, hạn cứng.',
    duBao: 'Một bảng tra mà bạn không kiểm được đầu vào lẫn cách suy ra kết luận.',
  },
  {
    khia: 'Kiểm lại được không',
    nhip: 'Được. Cuối kỳ đếm: việc đã đặt có xong không, buổi nhìn lại có diễn ra không.',
    duBao: 'Rất khó, vì lời thường đủ rộng để giai đoạn nào cũng thấy khớp.',
  },
  {
    khia: 'Sai thì mất gì',
    nhip: 'Bạn dời một khối lịch. Chi phí nhỏ, sửa được ngay trong tuần.',
    duBao: 'Bạn đã hoãn một mùa hoặc một năm. Chi phí thật, và không lấy lại được.',
  },
  {
    khia: 'Trang /ban-do đang là cái nào',
    nhip: `Mới là khung nhịp: ${TRACK_COUNT} khối cố định kèm ${COMPUTED_COUNT} mốc ngày được tính thật. Trang chỉ để đọc, không có ô nào nhập được — phần đầu vào vẫn phải do bạn tự lấy từ lịch của mình.`,
    duBao: 'Không phải. Phần chữ hiện tại là bản mẫu cố định, và trang tự ghi rõ điều đó.',
  },
];

// FAQ khai báo MỘT lần, dùng cho cả accordion hiển thị lẫn FAQPage JSON-LD →
// chữ trong schema luôn khớp chữ trên trang. Câu hỏi cố ý khác bộ FAQ của
// /learn/dai-van (chu kỳ 10 năm), /learn/luu-nien (chồng lớp) và
// /learn/trach-cat (chọn ngày giờ).
const FAQS = [
  {
    q: 'Bản đồ nhịp ở trang /ban-do có phải một dự báo tương lai không?',
    a: `Không. Đọc mã nguồn thì trang tính đúng ${COMPUTED_COUNT} thứ tại thời điểm bạn mở: thứ và ngày hôm nay theo múi giờ Việt Nam, và ngày cuối cùng của tháng hiện tại để bạn đặt lịch nhìn lại tháng. Cả hai đều là mốc thời gian đọc từ đồng hồ, không phải phán đoán về chuyện sẽ xảy ra. Phần còn lại của trang là khung ${TRACK_COUNT} khối — hôm nay, tuần này, tháng này, năm nay — dùng làm mẫu để bạn tự sắp việc theo bốn nhịp ấy. Lưu ý một chi tiết dễ hiểu nhầm: trang chỉ để đọc, không có ô nào nhập được, nên chỗ ghi việc thật vẫn là sổ hoặc lịch của bạn.`,
  },
  {
    q: 'Vậy những dòng gợi ý cho tuần và tháng đang dựa trên cái gì?',
    a: 'Hiện tại chúng chưa dựa trên dữ liệu riêng của bạn. Đó là chữ mẫu cố định nằm sẵn trong mã nguồn: ai mở trang cũng thấy đúng những dòng ấy, hôm nay hay tháng sau cũng vậy. Trang không hỏi ngày giờ sinh, không đọc lá số và không gọi dữ liệu nào của bạn — nên nó tự dán nhãn “Nội dung minh hoạ — chưa kết nối lá số của bạn” ngay đầu trang. Nói thẳng ra thì phần chữ ấy đang là ví dụ về hình thức trình bày, không phải kết quả tính cho riêng ai.',
  },
  {
    q: 'Muốn chia nhịp tuần – tháng – quý thì có cần huyền học không?',
    a: 'Không cần chút nào. Nhịp là công cụ tổ chức công việc, và ba nhịp phổ biến nhất đã có sẵn trong đời sống: tuần khớp với lịch làm việc, tháng khớp với chu kỳ lương và hoá đơn, quý khớp với mùa vụ và các kỳ báo cáo. Một cuốn sổ giấy làm được đúng việc này. Một tấm bản đồ thời gian, kể cả trang bản đồ trên hieu.asia, chỉ giúp bạn nhìn thấy nhịp ấy chứ không phải nguồn tạo ra nhịp — và chỗ ghi việc thật vẫn là sổ hoặc lịch của bạn.',
  },
  {
    q: 'Vì sao có nhịp thì làm được việc hơn?',
    a: 'Vì bốn lý do rất trần trụi. Nhịp tạo điểm dừng — không có mốc thì gần như không ai tự dừng lại để nhìn lại. Nhịp tạo hạn, mà việc không có hạn thì trôi vô hạn. Nhịp gom việc cùng loại vào cùng một khối nên bạn đỡ mất công chuyển qua chuyển lại giữa các loại việc. Và nhịp cho bạn một câu từ chối có căn cứ: “tuần này đã đầy, tuần sau tôi nhận” dễ nói hơn nhiều so với “tôi không muốn”.',
  },
  {
    q: 'Nếu bản đồ nói giai đoạn này không thuận, tôi có nên hoãn việc lớn không?',
    a: 'Không nên hoãn chỉ vì lý do đó, và đây là chỗ quan trọng nhất của cả bài. Hoãn không phải một hành động trung tính: bạn mất đà, mất cửa sổ thời gian của thị trường, tiền thuê và chi phí cố định vẫn chạy, người đồng hành có thể đi tìm việc khác, và bạn quay lại với ít dự phòng hơn lúc đầu. Nếu sau đó kết quả kém đi thì nguyên nhân đo được nằm ở chính việc hoãn, chứ không nằm ở giai đoạn. Hãy quyết định bằng lịch thật và tiền thật của bạn.',
  },
  {
    q: 'Làm sao biết một giai đoạn có thật sự rảnh hay không?',
    a: `Đếm ${CAPACITY_CHECKS.length} thứ, tất cả đều đếm được: số khối giờ trống liền mạch mỗi tuần sau khi trừ việc bắt buộc; số tháng bạn còn trả nổi chi phí cố định nếu việc chậm gấp đôi dự kiến; tên cụ thể của người nhận bàn giao khi bạn kẹt; và những hạn cứng bên ngoài không thể dời như mùa vụ, kỳ tuyển sinh, hạn hợp đồng, lịch gia đình. Nếu bốn ô này trống thì giai đoạn ấy không rảnh, dù bất kỳ bảng nào gọi nó là thuận lợi.`,
  },
  {
    q: 'Nhịp quý trong bài này có phải là đại vận, lưu niên hay tiết khí không?',
    a: 'Không, đó là những khái niệm khác và mỗi cái đã có bài riêng trên hieu.asia. Quý ở đây chỉ là ba tháng lịch dương, một đơn vị hành chính quen thuộc trong công việc — không mang nghĩa vận hạn nào. Có một chỗ dễ nhầm nên nói trước: khối năm trên trang bản đồ đặt tên dòng đầu là “chủ đề lưu niên”, nhưng đó vẫn là một câu cố định trong mã nguồn chứ không phải lưu niên tính từ lá số của ai — trang không nhận ngày giờ sinh thì không có gì để tính. Bài này cố ý chỉ nói về nhịp như một khung lập kế hoạch, và để phần chu kỳ vận cho các bài chuyên sâu tương ứng.',
  },
  {
    q: 'Tôi từng hoãn một việc vì đọc thấy giai đoạn đó không thuận, và kết quả sau đó đúng là kém. Vậy chẳng phải lời đó đã đúng sao?',
    a: 'Chưa kết luận được như vậy, vì giữa lời cảnh báo và kết quả kém có một sự kiện thứ ba: quyết định hoãn của chính bạn. Muốn biết lời đó có đúng hay không, phải so với trường hợp bạn vẫn làm — mà trường hợp ấy đã không xảy ra. Trong khi đó, chi phí của việc hoãn thì đo được rõ ràng. Cách kiểm lành mạnh cho lần sau: viết trước điều bạn dự đoán, ghi rõ mốc nào thì coi là sai, rồi mở ra đối chiếu đúng hạn.',
  },
];

const JSONLD = [
  article({
    headline: 'Nhịp sống: chia tuần, tháng, quý để lên kế hoạch chứ không phải để chờ vận',
    description:
      'Vì sao có nhịp thì làm được việc hơn, cách đặt việc lớn vào giai đoạn bạn thật sự rảnh, và ranh giới giữa một gợi ý nhịp với một dự báo.',
    url: '/learn/nhip-song',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Nhịp sống', url: '/learn/nhip-song' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Nhịp sống — chia tuần, tháng, quý để lên kế hoạch',
    description:
      'Nhịp tuần, tháng, quý là khung tổ chức công việc, không phải dự báo. Cách đặt việc lớn vào giai đoạn bạn thật sự rảnh, thay vì chờ một giai đoạn đẹp.',
    url: '/learn/nhip-song',
  }),
];

const TD = 'px-4 py-2 text-muted-foreground';
const A = 'text-gold-700 underline-offset-4 hover:underline';

/**
 * Bốn lăng kính gần nghĩa cho khối "Các lăng kính khác".
 *
 * KHÔNG dùng `relatedLearnLenses('nhip-song')`: slug này chưa có trong
 * LEARN_TOPICS/NEIGHBORS (lib/learn/related.ts) nên hàm đó rơi vào nhánh dự
 * phòng "lấy 4 chủ đề đầu bảng" và hiển thị Tử Vi / Bát Tự / MBTI / Big Five —
 * bốn chủ đề không liên quan gì tới nhịp lập kế hoạch. Ở đây tra thẳng theo
 * slug bằng API có sẵn `learnTopicBySlug`, nên nếu ai đó xoá/đổi slug thì mục
 * đó tự biến mất chứ không dẫn tới link 404.
 */
const RELATED_LENSES = ['dai-van', 'luu-nien', 'tiet-khi', 'trach-cat']
  .map((slug) => learnTopicBySlug(slug))
  .filter((t): t is NonNullable<typeof t> => t !== undefined)
  .map(({ eyebrow, name, href }) => ({ eyebrow, name, href }));

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

export default function LearnNhipSongPage() {
  return (
    <LearnArticle
      eyebrow="LẬP KẾ HOẠCH · NHỊP THỜI GIAN"
      title={
        <>
          Nhịp sống{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (tuần – tháng – quý)
          </span>
        </>
      }
      standfirst={
        <>
          Chia thời gian thành tuần, tháng, quý là một trong những việc rẻ nhất mà bạn có thể làm cho
          công việc của mình. Nhưng nó chỉ có tác dụng khi dùng để <strong>đặt việc xuống</strong> —
          chứ không phải để chờ một giai đoạn được gọi là đẹp. Bài này nói rõ nhịp giúp gì, dùng bản
          đồ thời gian thế nào, và vạch ranh giới giữa một gợi ý nhịp với một lời dự báo.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Nhịp sống' },
      ]}
      relatedLenses={RELATED_LENSES}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Trang Bản đồ chia sẵn ${TRACK_COUNT} khối nhịp — hôm nay, tuần này, tháng này, năm nay — và tính giúp bạn ${COMPUTED_COUNT} mốc ngày: hôm nay là ngày mấy, và ngày cuối tháng để đặt lịch nhìn lại.`,
        href: '/ban-do',
        label: 'Mở bản đồ nhịp',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <NhipFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Nhịp lập kế hoạch là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Nhịp</strong> ở đây có nghĩa rất đời thường: bạn cắt dòng thời gian liên tục
                thành những đoạn có đầu có cuối, rồi gắn cho mỗi đoạn một việc và một buổi nhìn lại.
                Tuần, tháng, quý là ba đoạn quen thuộc nhất vì chúng vốn đã tồn tại trong đời sống —
                lịch làm việc chạy theo tuần, lương và hoá đơn chạy theo tháng, mùa vụ và các kỳ báo
                cáo chạy theo quý.
              </p>
              <p>
                Một <strong>bản đồ thời gian</strong> chỉ là chỗ để bạn ghi các đoạn ấy xuống cho
                khỏi trôi. Trang{' '}
                <Link href="/ban-do" className={A}>
                  Bản đồ của bạn
                </Link>{' '}
                trên hieu.asia chia sẵn {TRACK_COUNT} khối: hôm nay, tuần này, tháng này, năm nay.
                Nói cho đúng thì trang ấy <strong>chỉ để đọc</strong> — nó cho bạn nhìn thấy bốn
                nhịp, còn chỗ ghi việc thật vẫn là sổ tay hoặc ứng dụng lịch của bạn.
              </p>
              <p>Cần chốt ngay bốn điều nhịp KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải một phép đo vận.</strong> Việc chia tuần – tháng – quý không lấy
                  dữ liệu nào từ bạn và không suy ra điều gì sẽ xảy ra. Nó chỉ là cách cắt lịch.
                </li>
                <li>
                  <strong>Không phải thứ cần huyền học mới có.</strong> Một cuốn sổ giấy và một cây
                  bút là đủ. Không có hệ tra cứu nào tạo ra nhịp cho bạn — bạn tự đặt.
                </li>
                <li>
                  <strong>Không phải lời hứa rằng việc sẽ xong.</strong> Nhịp làm cho tiến độ{' '}
                  <em>nhìn thấy được</em>, còn xong hay không vẫn phụ thuộc vào thời gian, tiền và
                  người mà bạn thật sự có.
                </li>
                <li>
                  <strong>Không phải lý do để chờ.</strong> Đây là điểm bài này quay lại nhiều lần:
                  nhịp dùng để <strong>đặt</strong> việc, không dùng để <strong>hoãn</strong> việc.
                  Mục <Link href="#gioi-han" className={A}>giới hạn</Link> nói kỹ chỗ này.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Bốn phạm vi bài này cố ý không lấn: chu kỳ mười năm thuộc bài{' '}
                <Link href="/learn/dai-van" className={A}>Đại vận</Link>; cách chồng lớp năm lên vận
                thuộc bài <Link href="/learn/luu-nien" className={A}>Lưu niên</Link>; mốc chuyển giữa
                các tiết trong năm thuộc bài{' '}
                <Link href="/learn/tiet-khi" className={A}>24 tiết khí</Link>; còn chọn ngày giờ cho
                một việc cụ thể thuộc bài{' '}
                <Link href="/learn/trach-cat" className={A}>Trạch cát</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <NhipDepth />,
        },
        {
          id: 'vi-sao-can-nhip',
          tocLabel: 'Vì sao cần nhịp',
          heading: 'Vì sao có nhịp thì làm được việc hơn — chuyện tổ chức, không phải huyền học',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Câu trả lời không có gì bí ẩn, và cũng không cần viện tới bất kỳ hệ tra cứu nào. Bốn
                cơ chế sau đủ giải thích gần hết:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Nhịp tạo điểm dừng.</strong> Nếu không có mốc, gần như không ai tự dừng
                  lại giữa dòng để hỏi “việc này còn đáng làm không”. Một buổi nhìn lại cuối tuần
                  hoặc cuối tháng là chỗ duy nhất câu hỏi ấy được đặt ra đúng lúc — trước khi bạn đã
                  đổ thêm ba tháng vào một việc sai.
                </li>
                <li>
                  <strong>Nhịp tạo hạn.</strong> Việc không có hạn thì trôi vô hạn. Gắn một việc vào
                  “tuần này” là tự đặt một hạn nhỏ, đủ gần để bạn còn nhớ và đủ nhẹ để trượt cũng
                  không sập gì.
                </li>
                <li>
                  <strong>Nhịp gom việc cùng loại.</strong> Dồn các cuộc gọi vào một buổi, các việc
                  cần yên tĩnh vào một khối khác — bạn đỡ phải chuyển qua chuyển lại giữa hai kiểu
                  đầu óc rất khác nhau, và mỗi lần chuyển như vậy đều mất thời gian khởi động lại.
                </li>
                <li>
                  <strong>Nhịp cho bạn một câu từ chối có căn cứ.</strong> “Tuần này đã đầy, tuần
                  sau tôi nhận” là câu dễ nói và dễ được chấp nhận hơn nhiều so với “tôi không
                  muốn”. Không có nhịp thì bạn không có căn cứ nào để nói câu đó, nên thường sẽ nhận
                  hết.
                </li>
              </ul>
              <p>
                Ba nhịp thông dụng chia việc theo độ lớn khá tự nhiên. <strong>Tuần</strong> hợp với
                việc thực thi: đủ ngắn để nhớ, đủ dài để làm xong một thứ có hình. <strong>Tháng</strong>{' '}
                hợp với việc phải tích luỹ mới thấy kết quả, và trùng luôn với chu kỳ tiền vào tiền
                ra. <strong>Quý</strong> hợp với việc đổi hướng: ba tháng là khoảng vừa đủ để một
                thay đổi kịp cho ra tín hiệu, chứ chưa đủ lâu để bạn kẹt cứng vào một lựa chọn sai.
              </p>
              <p className="text-sm text-foreground/70">
                Lưu ý về giới hạn của chính đoạn này: đây là kinh nghiệm tổ chức công việc, được viết
                ra để bạn thử và tự kiểm bằng lịch của mình, chứ không phải một quy luật nghiệm đúng
                với mọi người. Nếu công việc của bạn có mùa vụ riêng, hãy cắt nhịp theo mùa vụ ấy.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-do-tinh-gi',
          tocLabel: 'Bản đồ tính gì',
          heading: 'Trang /ban-do thật sự tính gì cho bạn — và phần nào là chữ mẫu',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phần quan trọng nhất để bạn đọc trang cho đúng. Bảng dưới tách rạch ròi hai
                thứ: cột giữa là những gì trang <strong>tính lúc bạn mở</strong>, cột phải là những
                gì đã <strong>nằm sẵn trong mã nguồn</strong> dưới dạng chữ cố định — nghĩa là ai mở
                cũng thấy giống hệt nhau.
              </p>
              <Scroller minWidth="min-w-[820px]">
                <TableHead
                  cols={['Khối trên trang', 'Được tính lúc bạn mở trang', 'Phần chữ cố định']}
                />
                <tbody>
                  {BAN_DO_TRACKS.map((t) => (
                    <tr key={t.khoi} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {t.khoi}
                      </th>
                      <td className="px-4 py-2 text-foreground">
                        {t.tinh ?? <span className="text-muted-foreground">Không tính gì</span>}
                      </td>
                      <td className={TD}>
                        {t.coDinh.length} mục: {t.coDinh.join(', ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Đọc bảng theo cột giữa thì thấy ngay: trong {TRACK_COUNT} khối, chỉ có{' '}
                {COMPUTED_COUNT} khối chứa thứ được tính thật, và cả {COMPUTED_COUNT} thứ ấy đều là{' '}
                <strong>mốc thời gian đọc từ đồng hồ</strong> theo múi giờ Việt Nam — hôm nay là thứ
                mấy ngày mấy, và ngày cuối cùng của tháng này. Không có phép tính nào khác trên
                trang.
              </p>
              <p>
                Điều đó dẫn tới ba hệ quả nên nói thẳng. Thứ nhất, trang{' '}
                <strong>không hỏi ngày giờ sinh và không đọc lá số của bạn</strong>, nên phần chữ
                khuyên hiện tại chưa phải kết quả tính cho riêng ai. Thứ hai, chính trang tự dán
                nhãn “Nội dung minh hoạ — chưa kết nối lá số của bạn” ngay đầu và ghi lại điều tương
                tự ở cuối khối năm — bạn không cần tin bài này, mở trang ra là thấy. Thứ ba, vì trang
                không chấm điểm giai đoạn dựa trên dữ liệu nào của bạn, nên{' '}
                <strong>bài này không dạy cách đọc các nhãn giai đoạn như một kết luận</strong>: công
                cụ không tính phần đó.
              </p>
              <p>
                Vậy phần chữ mẫu ấy dùng được vào việc gì? Dùng như một{' '}
                <strong>danh sách câu hỏi gợi ý</strong>. Khối tuần hỏi bạn bốn điều — chủ đề tuần là
                gì, hành động chính là gì, cuộc trò chuyện nào nên có, rủi ro nào cần quản trị. Đó là
                bộ khung tốt để tự trả lời bằng nội dung của chính bạn, và giá trị nằm ở câu trả lời
                của bạn chứ không nằm ở câu mẫu.
              </p>
              <p className="text-sm text-foreground/70">
                Nếu bạn muốn bản đồ chạy theo dữ liệu của mình thay vì bản mẫu, trang có lối để bạn{' '}
                <Link href="/onboarding/topic" className={A}>
                  nhập ngày giờ sinh một lần
                </Link>
                . Bài này không hứa thay trang: cái gì đã có thì mô tả đúng như đang có.
              </p>
            </div>
          ),
        },
        {
          id: 'dat-viec-vao-lich',
          tocLabel: 'Đặt việc vào lịch',
          heading: 'Đặt việc lớn vào giai đoạn bạn THẬT SỰ rảnh',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là cách dùng một bản đồ thời gian cho ra giá trị. Nguyên tắc gọn trong một câu:{' '}
                <strong>
                  đặt việc lớn vào giai đoạn bạn có dung lượng thật, chứ không vào giai đoạn được gọi
                  là đẹp
                </strong>
                . Và “có dung lượng thật” là thứ đếm được, không phải cảm giác.
              </p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead cols={['Thứ cần đếm', 'Câu hỏi cụ thể để tự trả lời']} />
                <tbody>
                  {CAPACITY_CHECKS.map((c) => (
                    <tr key={c.thu} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {c.thu}
                      </th>
                      <td className={TD}>{c.cauHoi}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                {CAPACITY_CHECKS.length} câu hỏi ấy có một tính chất chung: câu trả lời là con số
                hoặc một cái tên, nên bạn không tự lừa mình được. Nếu cả{' '}
                {CAPACITY_CHECKS.length} ô đều trống thì giai đoạn đó{' '}
                <strong>không rảnh</strong>, bất kể bảng nào gọi nó là thuận lợi.
              </p>
              <p>Quy trình bốn bước, làm một lần mất chừng nửa buổi:</p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Viết ra các ràng buộc cứng có thật.</strong> Hạn hợp đồng, mùa cao điểm của
                  ngành, kỳ tuyển sinh, lịch gia đình, những tháng chắc chắn bận. Đây là phần khung
                  không dời được, và nó phải được vẽ trước mọi thứ khác.
                </li>
                <li>
                  <strong>Đánh dấu các giai đoạn còn dung lượng.</strong> Dùng đúng{' '}
                  {CAPACITY_CHECKS.length} thứ ở bảng trên. Thường bạn sẽ thấy trong một năm chỉ có
                  vài đoạn thật sự trống — và biết điều đó sớm đã là một kết quả tốt.
                </li>
                <li>
                  <strong>Đặt MỘT việc lớn vào MỘT giai đoạn.</strong> Không hai. Việc lớn thứ hai
                  trong cùng một quý gần như luôn ăn vào phần dự phòng của việc thứ nhất, và cả hai
                  cùng chậm.
                </li>
                <li>
                  <strong>Đặt sẵn mốc nhìn lại, kèm điều kiện dừng.</strong> Viết trước: đến ngày này
                  mà chưa có dấu hiệu nào thì tôi dừng hoặc đổi cách. Không có điều kiện dừng viết
                  sẵn thì bạn sẽ luôn tìm được lý do đi tiếp.
                </li>
              </ol>
              <p>
                Khi bản đồ và lịch thật mâu thuẫn, <strong>lịch thật luôn thắng</strong>. Một giai
                đoạn được gắn nhãn thuận lợi mà bạn đang có hai hạn hợp đồng và một người thân nằm
                viện thì đó không phải giai đoạn để mở việc mới. Ngược lại, một giai đoạn không được
                gắn nhãn gì nhưng bạn có sáu tuần trống, tiền dự phòng đủ và người đỡ việc rõ ràng
                thì đó chính là lúc nên làm.
              </p>
              <p className="text-sm text-foreground/70">
                Chọn ngày giờ cụ thể cho một việc — cưới hỏi, mở hàng, động thổ — là một chủ đề khác
                và có bài riêng ở{' '}
                <Link href="/learn/trach-cat" className={A}>
                  Trạch cát
                </Link>
                . Ở đây ta chỉ nói tới quy mô tuần, tháng và quý.
              </p>
            </div>
          ),
        },
        {
          id: 'goi-y-hay-du-bao',
          tocLabel: 'Gợi ý hay dự báo',
          heading: 'Ranh giới: một gợi ý nhịp khác một lời dự báo ở chỗ nào',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Hai thứ này rất dễ lẫn vì chúng dùng chung một loại câu chữ — cùng nói về thời gian,
                cùng dùng những từ như “giai đoạn”, “nên”, “tránh”. Nhưng chúng khác nhau ở đầu vào
                và ở cái giá phải trả khi sai:
              </p>
              <Scroller minWidth="min-w-[860px]">
                <TableHead cols={['Khía cạnh', 'Gợi ý nhịp', 'Lời dự báo']} />
                <tbody>
                  {BOUNDARY_ROWS.map((r) => (
                    <tr key={r.khia} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {r.khia}
                      </th>
                      <td className="px-4 py-2 text-foreground">{r.nhip}</td>
                      <td className={TD}>{r.duBao}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>
                Có một phép thử nhanh để biết bạn đang cầm cái nào trong tay:{' '}
                <strong>hỏi xem lời ấy có thể sai không, và sai thì nhìn ra bằng gì</strong>. “Tuần
                này tôi đặt hai khối hai giờ cho bản kế hoạch” là câu có thể sai và cuối tuần mở lịch
                ra là biết ngay. “Giai đoạn này không thuận cho việc mới” thì gần như không có cách
                nào để nói nó đã sai — và một câu không thể sai thì cũng không mang thông tin nào cho
                quyết định.
              </p>
              <p>
                <strong>Điểm nhấn của cả bài nằm ở đây.</strong> Nếu bạn hoãn một việc vì bản đồ nói
                giai đoạn này không thuận, thì chính việc hoãn mới là nguyên nhân của kết quả kém sau
                đó — không phải giai đoạn. Cơ chế rất cụ thể và đếm được: bạn mất đà, cửa sổ thời
                gian của thị trường hẹp lại, chi phí cố định vẫn chạy trong lúc chưa có gì thu về,
                người định đi cùng bạn có thể nhận việc khác, và khi quay lại bạn có ít tiền dự phòng
                hơn lúc đầu. Đó là năm thứ mất đi, không có thứ nào trong đó là bí ẩn.
              </p>
              <p>
                Cái bẫy nằm ở bước cuối: khi kết quả kém xuất hiện <em>sau</em> lời cảnh báo, người
                ta ghi vào sổ rằng lời cảnh báo đã đúng. Nhưng giữa lời cảnh báo và kết quả có một sự
                kiện thứ ba mà không ai ghi vào sổ — <strong>quyết định hoãn của chính bạn</strong>.
                Muốn biết lời ấy có đúng hay không thì phải so với trường hợp bạn vẫn làm, mà trường
                hợp đó đã bị chính bạn xoá đi.
              </p>
              <p>
                Bài kiểm tra ngược, dùng được cho mọi lời khuyên theo giai đoạn:{' '}
                <strong>
                  nếu không biết bản đồ nói gì, hôm nay tôi có làm việc này không
                </strong>
                ? Nếu câu trả lời là có, thì hãy làm. Nếu là không, thì lý do thật nằm ở chỗ khác —
                thiếu tiền, thiếu người, chưa đủ rõ — và đó mới là thứ đáng đi sửa.
              </p>
              <p className="text-sm text-foreground/70">
                Vì sao những câu mô tả giai đoạn lại luôn thấy đúng, bài{' '}
                <Link href="/learn/barnum" className={A}>
                  Hiệu ứng Barnum
                </Link>{' '}
                giải thích riêng phần đó. Còn cách viết trước một dự đoán rồi đối chiếu đúng hạn thì
                nằm ở bài{' '}
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
          heading: 'Giới hạn: nhịp là khung tổ chức, không phải bằng chứng về tương lai',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này nói thẳng, kể cả những chỗ bất lợi cho chính công cụ trên web này.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Bản đồ hiện chưa cá nhân hoá.</strong> Trong {TRACK_COUNT} khối, chỉ{' '}
                  {COMPUTED_COUNT} mốc ngày được tính thật; toàn bộ phần chữ khuyên là bản mẫu cố
                  định như nhau với mọi người. Đừng đọc nó như thông tin về riêng bạn, vì nó chưa
                  phải vậy — và trang cũng tự nói như thế.
                </li>
                <li>
                  <strong>Nhãn “thuận lợi” hay “cẩn trọng” không đến từ dữ liệu của bạn.</strong> Vì
                  vậy chúng không đủ tư cách để bạn dời một quyết định có tiền và người ở trong đó.
                  Hãy để lịch thật, tiền dự phòng và các hạn cứng quyết định.
                </li>
                <li>
                  <strong>Nhịp không tạo ra dung lượng.</strong> Chia lịch đẹp cỡ nào cũng không làm
                  bạn có thêm giờ, thêm tiền hay thêm người. Nếu ba thứ đó thiếu, thứ cần sửa là ba
                  thứ đó — bảng biểu chỉ giúp bạn nhìn thấy chúng thiếu sớm hơn.
                </li>
                <li>
                  <strong>Chia nhịp quá dày lại phản tác dụng.</strong> Nếu mỗi tuần đều có bốn buổi
                  nhìn lại và mười hai chỉ số, bạn sẽ dành phần lớn thời gian để quản lý cái bảng
                  thay vì làm việc. Một buổi nhìn lại mỗi tuần và một buổi mỗi tháng là đủ cho hầu
                  hết người.
                </li>
                <li>
                  <strong>Kinh nghiệm tổ chức không phải quy luật.</strong> Những gì bài này nói về
                  tuần – tháng – quý là cách làm phổ biến và dễ kiểm bằng lịch của bạn, không phải
                  kết luận nghiệm đúng với mọi ngành nghề. Ngành có mùa vụ riêng thì cắt nhịp theo
                  mùa vụ ấy.
                </li>
              </ul>
              <p>
                Cách dùng lành mạnh: xem bản đồ như <strong>một tờ giấy có kẻ sẵn ô</strong> — nó
                giúp bạn nhớ dừng lại, nhớ đặt hạn, nhớ chỉ nhận một việc lớn mỗi giai đoạn. Nó không
                thay lời khuyên y tế, pháp lý hay tài chính, và không có ô nào trên đó đủ tư cách để
                bạn hoãn một việc mà mọi điều kiện thật đều đã sẵn sàng.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <NhipWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <NhipRecall />,
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
                Nếu bạn muốn đi tiếp sang các chu kỳ mà huyền học phương Đông thật sự có tính: chu kỳ
                mười năm nằm ở bài{' '}
                <Link href="/learn/dai-van" className={A}>
                  Đại vận
                </Link>
                , cách chồng lớp năm lên vận nằm ở bài{' '}
                <Link href="/learn/luu-nien" className={A}>
                  Lưu niên
                </Link>
                , còn mốc chuyển giữa các tiết trong năm nằm ở bài{' '}
                <Link href="/learn/tiet-khi" className={A}>
                  24 tiết khí
                </Link>
                . Ba bài đó nói về cách tính; bài bạn đang đọc nói về cách sắp việc.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn thử ngay khung {TRACK_COUNT} khối?{' '}
                <Link href="/ban-do" className={A}>
                  Xem bản đồ nhịp theo tuần, tháng và năm →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/ban-do', label: 'Bản đồ nhịp theo tuần/tháng/năm' },
                    { href: '/onboarding/topic', label: 'Nhập ngày giờ sinh một lần' },
                    { href: '/tu-vi-hom-nay', label: 'Tử Vi hôm nay' },
                    { href: '/tu-vi-2026', label: 'Tử Vi 2026 theo con giáp' },
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
          children: <NhipChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
