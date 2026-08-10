/**
 * /learn/ngay-kieng-ky — bài học về các NGÀY DÂN GIAN KIÊNG.
 *
 * GROUNDING (chép đúng, không tự chế số):
 *   • src/lib/ngay-kieng-ky.ts
 *       TAM_NUONG_DAYS      = [3, 7, 13, 18, 22, 27]
 *       NGUYET_KY_DAYS      = [5, 14, 23]
 *       DUONG_CONG_BY_MONTH = 1→13 · 2→11 · 3→9 · 4→7 · 5→5 · 6→3 · 7→[8, 29] ·
 *                             8→27 · 9→25 · 10→23 · 11→21 · 12→19
 *       Nguyệt Tận          = ngày cuối tháng âm (30 hoặc 29), phát hiện bằng
 *                             cách xem hôm sau có phải mùng 1 âm không
 *       KIENG_KY_INFO       = tên · mô tả ngày · summary (điển tích Muội Hỷ –
 *                             Đát Kỷ – Bao Tự; câu ca dao "Mùng năm, mười bốn,
 *                             hai ba…"; tên Dương Quân Tùng) · advice
 *   • src/app/ngay-kieng-ky/page.tsx (trang công cụ) — FAQ và khung "một lời nhắn".
 *
 * Các con số ĐẾM ở mục "dem-lai-cho-tinh" là phép hợp bốn tập hợp trên, đã đối
 * chiếu bằng máy: 10–12 ngày kiêng mỗi tháng âm; 126 ngày mỗi năm 12 tháng nếu
 * tháng 7 âm có 29 ngày, 127 nếu tháng 7 có 30 ngày. KHÔNG thêm dữ kiện ngoài lib.
 *
 * PHÂN VAI (chống trùng nội dung):
 *   • Bài này sở hữu mặt KIÊNG — ngày nào, gốc tích, kiêng việc gì, đếm lại cho tỉnh.
 *   • CHỌN ngày tốt, 12 Trực, ngày hoàng đạo → /learn/trach-cat và /xem-ngay.
 *   • Giờ tốt trong ngày → /gio-hoang-dao.  Hạn theo tuổi → /tam-tai, /kim-lau.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  KiengKyFrame,
  KiengKyDepth,
  KiengKyDepthNguyetKy,
  KiengKyRecall,
  KiengKyChecklist,
  KiengKyWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Ngày kiêng kỵ — Tam Nương, Nguyệt Kỵ, Dương Công',
  description:
    'Ngày kiêng kỵ dân gian: Tam Nương, Nguyệt Kỵ (mùng 5, 14, 23), Dương Công Kỵ Nhật — ngày nào, gốc tích, kiêng việc gì. Tham khảo phong tục, không hù doạ.',
  alternates: { canonical: 'https://hieu.asia/learn/ngay-kieng-ky' },
};

// Tam Nương — 6 ngày CHÉP ĐÚNG từ TAM_NUONG_DAYS. Cột "vị trí" chỉ mô tả chỗ
// đứng trong tháng; cột "cách ngày trước" là phép trừ trên chính danh sách đó
// (dùng để chỉ ra: Tam Nương KHÔNG có quy luật số học đều như Nguyệt Kỵ).
const TAM_NUONG_ROWS: { day: string; part: string; gap: string }[] = [
  { day: 'Mùng 3', part: 'Đầu tháng', gap: '—' },
  { day: 'Mùng 7', part: 'Đầu tháng', gap: '4 ngày' },
  { day: 'Ngày 13', part: 'Giữa tháng', gap: '6 ngày' },
  { day: 'Ngày 18', part: 'Giữa tháng', gap: '5 ngày' },
  { day: 'Ngày 22', part: 'Cuối tháng', gap: '4 ngày' },
  { day: 'Ngày 27', part: 'Cuối tháng', gap: '5 ngày' },
];

// Dương Công Kỵ Nhật — CHÉP ĐÚNG từ DUONG_CONG_BY_MONTH. Cột "trùng với" là kết
// quả đối chiếu với TAM_NUONG_DAYS / NGUYET_KY_DAYS, dùng cho mục đếm lại.
const DUONG_CONG_ROWS: { month: string; day: string; overlap: string }[] = [
  { month: 'Tháng 1', day: 'Ngày 13', overlap: 'Trùng Tam Nương' },
  { month: 'Tháng 2', day: 'Ngày 11', overlap: 'Ngày riêng' },
  { month: 'Tháng 3', day: 'Mùng 9', overlap: 'Ngày riêng' },
  { month: 'Tháng 4', day: 'Mùng 7', overlap: 'Trùng Tam Nương' },
  { month: 'Tháng 5', day: 'Mùng 5', overlap: 'Trùng Nguyệt Kỵ' },
  { month: 'Tháng 6', day: 'Mùng 3', overlap: 'Trùng Tam Nương' },
  { month: 'Tháng 7', day: 'Mùng 8 và ngày 29', overlap: 'Cả hai đều là ngày riêng' },
  { month: 'Tháng 8', day: 'Ngày 27', overlap: 'Trùng Tam Nương' },
  { month: 'Tháng 9', day: 'Ngày 25', overlap: 'Ngày riêng' },
  { month: 'Tháng 10', day: 'Ngày 23', overlap: 'Trùng Nguyệt Kỵ' },
  { month: 'Tháng 11', day: 'Ngày 21', overlap: 'Ngày riêng' },
  { month: 'Tháng 12', day: 'Ngày 19', overlap: 'Ngày riêng' },
];

// Đếm lại — hợp bốn tập hợp theo từng tháng âm (đã đối chiếu bằng máy).
// Tháng 7 ra 12 ngày nếu tháng đó có 30 ngày, 11 nếu chỉ có 29 (khi ấy ngày 29
// vừa là Dương Công vừa là Nguyệt Tận). Các tháng còn lại không đổi theo độ dài.
const DEM_LAI_ROWS: { month: string; count: string; why: string }[] = [
  { month: 'Tháng 1', count: '10', why: 'Dương Công (13) trùng sẵn Tam Nương' },
  { month: 'Tháng 2', count: '11', why: 'Dương Công (11) là ngày riêng' },
  { month: 'Tháng 3', count: '11', why: 'Dương Công (9) là ngày riêng' },
  { month: 'Tháng 4', count: '10', why: 'Dương Công (7) trùng sẵn Tam Nương' },
  { month: 'Tháng 5', count: '10', why: 'Dương Công (5) trùng sẵn Nguyệt Kỵ' },
  { month: 'Tháng 6', count: '10', why: 'Dương Công (3) trùng sẵn Tam Nương' },
  { month: 'Tháng 7', count: '12', why: 'Hai ngày Dương Công (8 và 29) đều riêng' },
  { month: 'Tháng 8', count: '10', why: 'Dương Công (27) trùng sẵn Tam Nương' },
  { month: 'Tháng 9', count: '11', why: 'Dương Công (25) là ngày riêng' },
  { month: 'Tháng 10', count: '10', why: 'Dương Công (23) trùng sẵn Nguyệt Kỵ' },
  { month: 'Tháng 11', count: '11', why: 'Dương Công (21) là ngày riêng' },
  { month: 'Tháng 12', count: '11', why: 'Dương Công (19) là ngày riêng' },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Ngày kiêng kỵ là gì và gồm những ngày nào?',
    a: 'Là những ngày âm lịch cố định mà phong tục dân gian khuyên tránh khởi sự việc trọng đại. Bốn bộ phổ biến: Tam Nương (mùng 3, 7, 13, 18, 22, 27), Nguyệt Kỵ (mùng 5, 14, 23), Dương Công Kỵ Nhật (mỗi tháng âm một ngày, riêng tháng 7 có hai ngày — tổng 13 ngày trong năm) và Nguyệt Tận (ngày cuối tháng âm, 30 hoặc 29). Danh sách này giống nhau với mọi người, không đổi theo tuổi hay theo việc — đó là quy ước văn hoá để tham khảo, không phải lời phán về số mệnh.',
  },
  {
    q: 'Vì sao Nguyệt Kỵ lại đúng là mùng 5, 14 và 23?',
    a: 'Vì cộng các chữ số của cả ba ngày đều ra 5: 5; 1 + 4 = 5; 2 + 3 = 5. Ba ngày cách nhau đúng 9 ngày, mà cộng thêm 9 thì tổng các chữ số không đổi, nên dãy tự nhiên là 5, 14, 23. Ngày kế tiếp của dãy sẽ là 32 — vượt quá tháng âm vốn chỉ có 29 hoặc 30 ngày, nên mỗi tháng chỉ có đúng ba ngày Nguyệt Kỵ. Còn vì sao chọn số 5 thì lời giải thích lưu truyền là số 5 nằm giữa chừng trong mười số đầu, "nửa đời nửa đoạn", chưa trọn vẹn để khởi sự — đây là cách hiểu của phong tục, không phải một luận cứ kiểm chứng được.',
  },
  {
    q: 'Ngày Tam Nương bắt nguồn từ đâu?',
    a: 'Tên gọi gắn với điển tích ba người phụ nữ trong sử Trung Hoa — Muội Hỷ, Đát Kỷ và Bao Tự — vốn được truyền thuyết gắn với sự suy vong của các triều đại Hạ, Thương, Chu. Người xưa lấy đó làm hình ảnh để nhắc nhau thận trọng khi khởi sự. Cần nói rõ: đây là truyền thuyết, và cách quy trách nhiệm sụp đổ của cả một triều đại cho ba người phụ nữ là góc nhìn của người xưa, không phải kết luận lịch sử. Chúng ta có thể giữ lời nhắc thận trọng mà không cần giữ phần quy kết đó.',
  },
  {
    q: 'Dương Công Kỵ Nhật gồm những ngày nào?',
    a: 'Mỗi tháng âm một ngày, riêng tháng 7 có hai ngày: tháng 1 ngày 13, tháng 2 ngày 11, tháng 3 mùng 9, tháng 4 mùng 7, tháng 5 mùng 5, tháng 6 mùng 3, tháng 7 mùng 8 và ngày 29, tháng 8 ngày 27, tháng 9 ngày 25, tháng 10 ngày 23, tháng 11 ngày 21, tháng 12 ngày 19 — tổng cộng 13 ngày trong một năm 12 tháng âm. Bộ ngày này được nhắc trong lịch pháp cổ, gắn với tên Dương Quân Tùng, thường được khuyên tránh khi khởi công, xây dựng hay cưới hỏi.',
  },
  {
    q: 'Ngày Nguyệt Tận là ngày nào?',
    a: 'Nguyệt Tận nghĩa là "trăng đã hết" — ngày cuối cùng của tháng âm lịch, tức ngày 30 nếu tháng đủ hoặc ngày 29 nếu tháng thiếu. Theo phong tục, người xưa tránh khởi sự việc lớn, xuất hành hay cưới hỏi vào ngày này vì coi đó là thời điểm "tận", chưa trọn vẹn để bắt đầu. Vì tháng âm dài ngắn khác nhau nên ngày Nguyệt Tận không cố định là 30 — muốn biết chính xác phải đổi lịch, hoặc xem hôm sau có phải mùng 1 âm hay không.',
  },
  {
    q: 'Cộng hết lại thì một tháng có bao nhiêu ngày kiêng?',
    a: 'Từ 10 đến 12 ngày, tuỳ tháng. Tam Nương 6 ngày và Nguyệt Kỵ 3 ngày không trùng nhau, cộng thêm Nguyệt Tận là 10 ngày; Dương Công Kỵ Nhật có sáu tháng trùng sẵn với hai bộ kia (tháng 1, 4, 5, 6, 8, 10) nên không làm tăng, các tháng còn lại thêm một ngày, riêng tháng 7 thêm hai. Trên một tháng âm 29–30 ngày, đó là hơn một phần ba. Con số này đáng biết, vì nó cho thấy phong tục vốn chỉ dành cho việc trọng đại — nếu áp cho mọi việc thì gần như không còn ngày nào để sống.',
  },
  {
    q: 'Ngày kiêng kỵ khác gì với việc xem ngày tốt?',
    a: 'Khác hướng nhìn. Ngày kiêng là một danh sách cố định theo ngày âm, giống nhau với mọi người và mọi việc — bạn chỉ cần tra xem ngày đó có nằm trong danh sách không. Còn chọn ngày tốt (trạch cát) là đối chiếu nhiều lớp: ngày hoàng đạo, 12 Trực, sao tốt xấu ứng với từng loại việc và từng tuổi người chủ sự, nên cùng một ngày có thể hợp việc này mà không hợp việc kia. Trên hieu.asia, phần chọn ngày tốt nằm ở bài Trạch Cát và công cụ xem ngày; bài này chỉ nói về mặt kiêng.',
  },
  {
    q: 'Rơi vào ngày kiêng thì có cần làm lễ hoá giải không?',
    a: 'Không. Đây là phong tục truyền miệng mang ý nhắc thận trọng, không phải quy tắc bắt buộc và cũng không có "phép giải" nào cần mua. Nếu lịch linh hoạt, nhiều gia đình dời việc trọng sang ngày khác cho mọi người an tâm — giá trị nằm ở sự đồng thuận đó. Nếu không dời được thì điều quyết định vẫn là chuẩn bị chu đáo, chứ không phải bản thân con số ngày. hieu.asia trình bày để bạn tra cứu và tự quyết định, không phán số mệnh và không bán lễ.',
  },
];

const JSONLD = [
  article({
    headline:
      'Ngày kiêng kỵ dân gian: Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật — hiểu để bớt sợ',
    description:
      'Các ngày dân gian kiêng theo âm lịch: Tam Nương, Nguyệt Kỵ (mùng 5, 14, 23), Dương Công Kỵ Nhật, Nguyệt Tận — ngày nào, gốc tích, kiêng việc gì, và cộng lại thì mỗi tháng mất bao nhiêu ngày. Góc nhìn tham khảo, không hù doạ.',
    url: '/learn/ngay-kieng-ky',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Ngày kiêng kỵ', url: '/learn/ngay-kieng-ky' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Ngày kiêng kỵ — Tam Nương, Nguyệt Kỵ, Dương Công',
    description:
      'Ngày kiêng kỵ dân gian: Tam Nương, Nguyệt Kỵ (mùng 5, 14, 23), Dương Công Kỵ Nhật — ngày nào, gốc tích, kiêng việc gì. Tham khảo phong tục, không hù doạ.',
    url: '/learn/ngay-kieng-ky',
  }),
];

export default function LearnNgayKiengKyPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · NGÀY KIÊNG"
      title={
        <>
          Ngày{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            kiêng kỵ
          </span>
        </>
      }
      standfirst={
        <>
          Mùng 5, mười bốn, hai ba… Có những ngày âm lịch mà ông bà ta dặn nhau khoan hãy khởi sự
          việc lớn. Bài này nói rõ ngày nào, vì sao lại là những ngày ấy, kiêng việc gì — và một
          phép cộng ít ai làm: kiêng hết thì mỗi tháng còn lại bao nhiêu ngày.
        </>
      }
      readMeta="9 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Ngày kiêng kỵ' },
      ]}
      relatedLenses={relatedLearnLenses('ngay-kieng-ky')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập một ngày dương lịch, hệ thống đổi sang ngày âm và cho biết ngày đó có rơi vào Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật hay Nguyệt Tận không, kèm danh sách ngày kiêng của cả tháng.',
        href: '/ngay-kieng-ky',
        label: 'Tra ngày kiêng kỵ',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <KiengKyFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Ngày kiêng kỵ là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Ngày kiêng kỵ</strong> là những ngày <strong>âm lịch cố định</strong> mà
                phong tục dân gian khuyên tránh khi khởi sự việc trọng đại — cưới hỏi, khai trương,
                động thổ, đi xa. Bốn bộ phổ biến nhất là <strong>Tam Nương</strong>,{' '}
                <strong>Nguyệt Kỵ</strong>, <strong>Dương Công Kỵ Nhật</strong> và{' '}
                <strong>Nguyệt Tận</strong>. Mỗi bộ có một danh sách ngày riêng, một gốc tích riêng,
                và một nhóm việc thường được nhắc.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Ngày kiêng là <strong>quy ước theo phong tục</strong>, giống nhau với mọi người và
                  lặp lại y hệt mỗi tháng — không phải dự báo rằng ngày đó sẽ có chuyện xấu.
                </li>
                <li>
                  Danh sách này <strong>không đổi theo tuổi</strong> của bạn. Các hạn tính theo tuổi
                  là hệ khác hẳn (xem <strong>Tam Tai</strong>, <strong>Kim Lâu</strong> ở cuối bài).
                </li>
                <li>
                  Nó cũng <strong>không phải cách chọn ngày tốt</strong>. Kiêng là loại bớt; chọn
                  ngày tốt là đối chiếu nhiều lớp theo từng loại việc — một việc khác, có trang riêng.
                </li>
              </ul>
              <p>
                Và một điều để giữ đúng tinh thần ngay từ dòng đầu: bài này viết để bạn{' '}
                <strong>bớt sợ chứ không sợ thêm</strong>. Biết ngày nào bị kiêng là chuyện tra cứu
                được; tin rằng ngày đó sẽ mang lại điều xấu thì không. hieu.asia trình bày để bạn{' '}
                <strong>tham khảo</strong>, không phán số mệnh và <strong>không bán lễ</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <KiengKyDepth />,
        },
        {
          id: 'tam-nuong',
          tocLabel: 'Tam Nương',
          heading: 'Tam Nương — sáu ngày mỗi tháng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Tam Nương</strong> là sáu ngày âm lịch cố định trong <em>mỗi</em> tháng:{' '}
                <strong>mùng 3, mùng 7, ngày 13, 18, 22 và 27</strong>. Đây là bộ ngày kiêng đông
                ngày nhất, và cũng là bộ được nhắc nhiều nhất khi bàn chuyện cưới hỏi, khai trương,
                động thổ hay đi xa.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Ngày âm lịch
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Nằm ở
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Cách ngày Tam Nương trước
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TAM_NUONG_ROWS.map((row) => (
                      <tr key={row.day} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 text-foreground">{row.day}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.part}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.gap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Cột cuối cho thấy một điều đáng chú ý: khoảng cách giữa các ngày Tam Nương{' '}
                <strong>không đều</strong> (4, 6, 5, 4, 5). Khác với Nguyệt Kỵ ở mục sau, Tam Nương
                không có quy luật số học nào rút ra được — nó là một danh sách được truyền lại
                nguyên vẹn. Cách nhớ dễ nhất là để ý sáu ngày đi thành ba cặp: đầu tháng (3 và 7),
                giữa tháng (13 và 18), cuối tháng (22 và 27).
              </p>
              <h3 className="text-lg font-semibold text-foreground">Gốc tích cái tên</h3>
              <p>
                Tên gọi gắn với một <strong>điển tích</strong>: ba người phụ nữ trong sử Trung Hoa —{' '}
                <strong>Muội Hỷ</strong>, <strong>Đát Kỷ</strong> và <strong>Bao Tự</strong> — vốn
                được truyền thuyết gắn với sự suy vong của ba triều đại Hạ, Thương và Chu. Người xưa
                mượn hình ảnh ấy để nhắc nhau rằng có những thời điểm nên khoan khởi sự.
              </p>
              <p className="text-sm text-foreground/70">
                Nói thẳng một điều để đọc cho đúng: đây là <strong>truyền thuyết</strong>, và việc
                quy sự sụp đổ của cả một triều đại cho ba người phụ nữ là góc nhìn của người xưa,
                không phải kết luận của sử học. Ta hoàn toàn có thể giữ lại lời nhắc thận trọng mà
                không cần giữ phần quy kết ấy.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Thường kiêng việc gì</h3>
              <p>
                Theo phong tục, Tam Nương thường được nhắc khi <strong>cưới hỏi</strong>,{' '}
                <strong>khai trương</strong>, <strong>động thổ</strong> và <strong>đi xa</strong> —
                tức những việc lớn, khó làm lại. Nếu lịch linh hoạt, nhiều gia đình dời việc trọng
                sang ngày khác cho an tâm. Còn việc thường ngày — đi làm, đi học, gặp gỡ, mua sắm —
                thì không cần kiêng.
              </p>
            </div>
          ),
        },
        {
          id: 'nguyet-ky',
          tocLabel: 'Nguyệt Kỵ',
          heading: 'Nguyệt Kỵ — mùng 5, 14, 23 và bí mật của con số 5',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Nguyệt Kỵ</strong> là ba ngày âm lịch: <strong>mùng 5, ngày 14 và ngày 23</strong>
                . Dân gian có câu ca dao quen thuộc:
              </p>
              <blockquote className="rounded-xl border-l-2 border-gold/50 bg-card/40 px-5 py-4">
                <p className="font-heading text-base leading-relaxed text-foreground">
                  “Mùng năm, mười bốn, hai ba;
                  <br />
                  đi chơi cũng thiệt nữa là đi buôn.”
                </p>
                <footer className="mt-2 text-sm text-muted-foreground">
                  Dị bản khác: “…làm gì cũng bại, chẳng ra việc gì.”
                </footer>
              </blockquote>
              <p>
                Vì gắn với chuyện “đi chơi”, “đi buôn” nên Nguyệt Kỵ thường được nhắc khi{' '}
                <strong>xuất hành</strong>, <strong>buôn bán</strong> và <strong>ký kết</strong> —
                khác trọng tâm với Tam Nương (nghiêng về cưới hỏi, động thổ).
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Vì sao lại đúng 5, 14 và 23?
              </h3>
              <p>
                Đây là điểm thú vị nhất của cả bài, và nó là <strong>một phép cộng</strong>, không
                phải một điều huyền bí. Thử cộng các chữ số:
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { d: 'Mùng 5', sum: '5', note: 'chỉ một chữ số' },
                  { d: 'Ngày 14', sum: '1 + 4 = 5', note: 'cách mùng 5 đúng 9 ngày' },
                  { d: 'Ngày 23', sum: '2 + 3 = 5', note: 'cách ngày 14 đúng 9 ngày' },
                ].map((c) => (
                  <div key={c.d} className="rounded-xl border border-gold/25 bg-card/40 p-4">
                    <p className="font-heading text-base font-semibold text-foreground">{c.d}</p>
                    <p className="mt-1 font-mono text-sm text-gold-700">{c.sum}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.note}</p>
                  </div>
                ))}
              </div>
              <p>
                Cả ba đều ra <strong>5</strong>. Lý do rất gọn: ba ngày cách nhau{' '}
                <strong>đúng 9 ngày</strong>, mà cộng thêm 9 thì tổng các chữ số không đổi (hàng chục
                tăng 1, hàng đơn vị giảm 1). Nên dãy tự nhiên chạy 5 → 14 → 23. Ngày kế tiếp sẽ là{' '}
                <strong>32</strong> — vượt quá tháng âm vốn chỉ có 29 hoặc 30 ngày. Vì thế mỗi tháng
                có <strong>đúng ba</strong> ngày Nguyệt Kỵ, không thể nhiều hơn.
              </p>
              <p>
                Còn vì sao lại là số 5 mà không phải số khác? Cách giải thích được truyền lại là số 5
                đứng <strong>giữa chừng</strong> trong mười số đầu — “nửa đời nửa đoạn”, chưa trọn
                vẹn để bắt đầu một việc. Cần phân biệt rạch ròi hai lớp ở đây:{' '}
                <strong>cấu trúc số thì kiểm được</strong> (ai cũng cộng lại thấy đúng), còn{' '}
                <strong>ý nghĩa gán cho số 5 là quy ước văn hoá</strong> — không có cách nào kiểm
                chứng, và cũng không cần kiểm chứng để trân trọng nó như một nét văn hoá.
              </p>
              <KiengKyDepthNguyetKy />
            </div>
          ),
        },
        {
          id: 'duong-cong-ky-nhat',
          tocLabel: 'Dương Công Kỵ Nhật',
          heading: 'Dương Công Kỵ Nhật — 13 ngày rải đều cả năm',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Dương Công Kỵ Nhật</strong> khác hai bộ trên ở chỗ: nó không lặp lại giống
                nhau mỗi tháng mà <strong>mỗi tháng âm một ngày riêng</strong>, riêng tháng 7 có hai
                ngày — tổng cộng <strong>13 ngày</strong> trong một năm 12 tháng. Bộ ngày này được
                nhắc trong lịch pháp cổ, gắn với tên <strong>Dương Quân Tùng</strong>, và thường
                được khuyên tránh khi <strong>khởi công</strong>, <strong>xây dựng</strong> và{' '}
                <strong>cưới hỏi</strong>.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[460px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Tháng âm lịch
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Ngày Dương Công
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Đối chiếu với hai bộ trên
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DUONG_CONG_ROWS.map((row) => (
                      <tr key={row.month} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 text-muted-foreground">{row.month}</td>
                        <td className="px-4 py-2 text-foreground">{row.day}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.overlap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Một quy luật ẩn trong bảng
              </h3>
              <p>
                Đọc cột giữa từ trên xuống sẽ thấy bộ ngày này gần như là{' '}
                <strong>hai dãy số giảm đều</strong>, mỗi bước 2 ngày:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tháng 1 đến tháng 6:</strong> 13 → 11 → 9 → 7 → 5 → 3.
                </li>
                <li>
                  <strong>Tháng 7 đến tháng 12:</strong> 29 → 27 → 25 → 23 → 21 → 19.
                </li>
                <li>
                  <strong>Ngoại lệ duy nhất:</strong> tháng 7 có thêm <strong>mùng 8</strong> — con
                  số duy nhất không nằm trong hai dãy trên.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Biết quy luật này thì không cần học thuộc 13 con số: chỉ cần nhớ hai dãy giảm đều và
                một ngoại lệ. Đây cũng là một dấu hiệu nữa cho thấy các bộ ngày kiêng được{' '}
                <strong>soạn theo lịch</strong> chứ không rút ra từ việc quan sát điều gì.
              </p>
            </div>
          ),
        },
        {
          id: 'nguyet-tan',
          tocLabel: 'Nguyệt Tận',
          heading: 'Nguyệt Tận — ngày khép lại tháng âm',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Nguyệt Tận</strong> nghĩa là “trăng đã hết” — <strong>ngày cuối cùng</strong>{' '}
                của tháng âm lịch. Đây là bộ ngày kiêng duy nhất không gắn với một con số cố định:
                tháng đủ thì là <strong>ngày 30</strong>, tháng thiếu thì là <strong>ngày 29</strong>
                .
              </p>
              <p>
                Cách nhận biết chắc chắn nhất là nhìn sang hôm sau: nếu ngày mai là{' '}
                <strong>mùng 1 âm lịch</strong> thì hôm nay chính là Nguyệt Tận. Công cụ tra cứu dùng
                đúng cách này, nên bạn không cần nhớ tháng nào đủ, tháng nào thiếu.
              </p>
              <p>
                Theo phong tục, người xưa tránh <strong>khởi sự việc lớn</strong>,{' '}
                <strong>xuất hành</strong> và <strong>cưới hỏi</strong> vào ngày này, vì coi đó là
                thời điểm “tận” — mọi thứ đang khép lại, chưa trọn vẹn để bắt đầu. Hình ảnh ấy rất
                dễ hiểu và cũng khá đẹp: đợi trăng mọc lại rồi hãy mở đầu một việc mới.
              </p>
              <p className="text-sm text-foreground/70">
                Cũng như ba bộ trên, đây là <strong>quy ước theo lịch</strong>. Việc thường ngày —
                kể cả tổng kết công việc, thanh toán, dọn dẹp cuối tháng — thì không cần kiêng; thậm
                chí ngày cuối tháng còn hợp với những việc mang tính khép lại.
              </p>
            </div>
          ),
        },
        {
          id: 'dem-lai-cho-tinh',
          tocLabel: 'Đếm lại cho tỉnh',
          heading: 'Đếm lại cho tỉnh: kiêng hết thì còn mấy ngày để sống?',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phép tính hiếm khi được làm, mà lại là phần quan trọng nhất của bài. Bốn bộ
                ngày kiêng ở trên <strong>chồng lên nhau</strong> trong cùng một tháng âm. Cộng
                chúng lại (và trừ đi phần trùng nhau), ta được:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tam Nương</strong> 6 ngày + <strong>Nguyệt Kỵ</strong> 3 ngày ={' '}
                  <strong>9 ngày</strong> — hai bộ này không trùng nhau ngày nào.
                </li>
                <li>
                  Cộng <strong>Nguyệt Tận</strong> (ngày cuối tháng) thành <strong>10 ngày</strong>.
                </li>
                <li>
                  <strong>Dương Công Kỵ Nhật</strong> có sáu tháng trùng sẵn với hai bộ đầu (tháng 1,
                  4, 5, 6, 8, 10) nên không làm tăng; các tháng còn lại thêm 1 ngày, riêng tháng 7
                  thêm 2.
                </li>
              </ul>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Tháng âm lịch
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Số ngày bị kiêng
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Vì sao ra con số đó
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEM_LAI_ROWS.map((row) => (
                      <tr key={row.month} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 text-muted-foreground">{row.month}</td>
                        <td className="px-4 py-2 font-mono text-foreground">{row.count}</td>
                        <td className="px-4 py-2 text-muted-foreground">{row.why}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Tháng 7 ra 12 ngày khi tháng đó có 30 ngày; nếu chỉ có 29 ngày thì còn 11, vì khi ấy
                ngày 29 vừa là Dương Công vừa là Nguyệt Tận. Các tháng khác không đổi theo độ dài
                tháng.
              </p>
              <div className="rounded-card-editorial border border-gold/25 bg-card/40 p-5 sm:p-6">
                <p className="font-mono text-eyebrow uppercase text-gold-700">
                  Con số cuối cùng
                </p>
                <p className="mt-2 text-base leading-relaxed text-foreground">
                  <strong>10 đến 12 ngày kiêng mỗi tháng âm</strong> — trên một tháng chỉ dài 29 hoặc
                  30 ngày, đó là <strong>hơn một phần ba</strong>. Cộng cả năm 12 tháng:{' '}
                  <strong>126 hoặc 127 ngày</strong> (tuỳ tháng 7 âm có 29 hay 30 ngày), tức khoảng{' '}
                  <strong>hơn một phần ba số ngày trong năm</strong>.
                </p>
              </div>
              <p>
                Con số đó nói lên điều gì? Không phải rằng phong tục sai. Mà rằng phong tục{' '}
                <strong>vốn không được thiết kế để áp cho mọi việc</strong>. Cứ mười ngày thì có ba
                bốn ngày nằm trong danh sách — nếu kiêng tất, bạn sẽ không còn ngày nào để cưới, để
                mở hàng, để đi công tác, để ký một hợp đồng bình thường.
              </p>
              <p>
                Người xưa hiểu rất rõ điều này, nên lời dặn luôn gắn với ba chữ{' '}
                <strong>“việc trọng đại”</strong>. Không có bản truyền nào bảo phải kiêng đi làm,
                kiêng đi học, kiêng gặp bạn bè vào mùng 5. Nỗi lo chỉ xuất hiện khi ta lấy một lời
                dặn dành cho vài dịp lớn trong đời rồi áp lên từng ngày sống.
              </p>
              <p className="text-sm text-foreground/70">
                Có một cách dùng lành mạnh mà nhiều gia đình đang làm: <strong>chọn một bộ</strong>{' '}
                mình thấy hợp lý nhất (thường là Tam Nương, hoặc Tam Nương cộng Nguyệt Kỵ), chỉ áp
                cho vài việc thật sự lớn, và bám theo nó. Cộng dồn mọi danh sách kiêng từ mọi nguồn
                là con đường ngắn nhất dẫn tới chỗ không còn ngày nào “sạch”.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn — phong tục nói được gì và không nói được gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ngày kiêng kỵ là <strong>phong tục truyền miệng</strong>. Các danh sách được chép lại
                trong sách lịch và truyền qua nhiều đời, nhưng không kèm theo dữ liệu hay lập luận
                nào chứng minh. Nói cho rõ ràng thay vì nói vòng:{' '}
                <strong>không có cơ sở kiểm chứng</strong> cho việc những ngày này khác các ngày còn
                lại.
              </p>
              <p>Có một ranh giới đáng nhớ, và nó khá gọn:</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    Trả lời được
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                    <li>Ngày mai có phải Tam Nương không? — tra được, chính xác.</li>
                    <li>Tháng này có bao nhiêu ngày kiêng? — đếm được.</li>
                    <li>Ngày 14 âm rơi vào ngày dương nào? — đổi lịch là ra.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    Không trả lời được
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                    <li>Kiêng ngày ấy có giúp việc thuận hơn không?</li>
                    <li>Làm vào ngày kiêng thì rủi ro tăng bao nhiêu?</li>
                    <li>Vì sao ba nàng lại ứng vào đúng sáu ngày đó?</li>
                  </ul>
                </div>
              </div>
              <p>
                Thêm vài giới hạn nên biết. Các nguồn <strong>không hoàn toàn thống nhất</strong>:
                câu ca dao Nguyệt Kỵ có nhiều dị bản, và mỗi vùng còn có thêm những ngày kiêng riêng
                mà bài này không liệt kê. Ngày âm cũng <strong>phụ thuộc múi giờ</strong> — lịch âm
                Việt Nam tính theo múi giờ +7 nên đôi khi lệch một ngày so với lịch âm nước khác, kéo
                theo ngày kiêng cũng lệch.
              </p>
              <p>
                Vậy giữ lại gì? Giữ lại phần <strong>thận trọng</strong>: dừng một nhịp trước việc
                lớn, hỏi lại người thân, kiểm lại giấy tờ, thống nhất với gia đình. Đó là giá trị
                thật, và nó không đến từ con số ngày mà từ chính thói quen dừng lại ấy. Còn{' '}
                <strong>nỗi sợ</strong> thì bỏ đi được: rơi vào ngày kiêng không có nghĩa là chuyện
                sẽ hỏng, và tránh được ngày kiêng cũng không thay cho sự chuẩn bị.
              </p>
              <p className="text-sm text-foreground/70">
                Nếu vì lý do thực tế (lịch nghỉ, sức khoẻ, thời tiết, người thân xa về) mà việc buộc
                phải rơi vào một ngày kiêng, đừng để điều đó thành nỗi áy náy kéo dài. Không cần
                “hoá giải”, không cần mua gì cả — hieu.asia không bán lễ và không cho rằng phải giải
                gì mới yên.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <KiengKyWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <KiengKyRecall />,
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
              <div className="mt-6 space-y-3 text-foreground/85 leading-relaxed">
                <p className="text-sm">
                  Bài này chỉ nói mặt <strong>kiêng</strong>. Ba hướng đi tiếp nếu bạn cần mặt còn
                  lại:
                </p>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  <li>
                    Muốn <strong>chọn ngày tốt</strong> cho một việc cụ thể (12 Trực, ngày hoàng
                    đạo): đọc{' '}
                    <Link
                      href="/learn/trach-cat"
                      className="text-gold-700 underline-offset-4 hover:underline"
                    >
                      bài Trạch Cát
                    </Link>{' '}
                    rồi dùng{' '}
                    <Link
                      href="/xem-ngay"
                      className="text-gold-700 underline-offset-4 hover:underline"
                    >
                      công cụ xem ngày tốt
                    </Link>
                    .
                  </li>
                  <li>
                    Đã có ngày, muốn chọn <strong>giờ</strong> trong ngày:{' '}
                    <Link
                      href="/gio-hoang-dao"
                      className="text-gold-700 underline-offset-4 hover:underline"
                    >
                      tra giờ hoàng đạo
                    </Link>
                    .
                  </li>
                  <li>
                    Các hạn tính theo <strong>tuổi</strong> (khác hẳn ngày kiêng):{' '}
                    <Link
                      href="/tam-tai"
                      className="text-gold-700 underline-offset-4 hover:underline"
                    >
                      Tam Tai
                    </Link>{' '}
                    và{' '}
                    <Link
                      href="/kim-lau"
                      className="text-gold-700 underline-offset-4 hover:underline"
                    >
                      Kim Lâu
                    </Link>
                    .
                  </li>
                </ul>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Muốn biết một ngày cụ thể có bị kiêng không?{' '}
                <Link
                  href="/ngay-kieng-ky"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Tra ngày kiêng kỵ miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/ngay-kieng-ky', label: 'Tra ngày kiêng kỵ' },
                    { href: '/xem-ngay', label: 'Xem ngày tốt cho việc của bạn' },
                    { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
                    { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
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
          children: <KiengKyChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
