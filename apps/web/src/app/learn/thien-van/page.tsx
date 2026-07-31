/**
 * Bài học /learn/thien-van — bài KHOA HỌC của khu Học.
 *
 * GROUNDING — mọi ngày giờ, loại thực và mốc phân – chí đều được IMPORT rồi
 * render, KHÔNG gõ tay (lib đổi thì trang này đổi theo). Nguồn:
 *   • lib/sky-events.ts → SKY_EVENTS (sự kiện 2026–2030, tính sẵn bằng thư viện
 *     mã-nguồn-mở astronomy-engine, quy về giờ VN UTC+7), LUNAR_META /
 *     SOLAR_META / SEASON_META (nhãn + mô tả hiện tượng), kindMeta().
 *   • trang công cụ app/thien-van/page.tsx → nhật thực lọc theo NGƯỜI QUAN SÁT
 *     tại Hà Nội nên chỉ liệt kê cái xem được từ VN; nguyệt thực toàn cầu (xem
 *     được khi Trăng trên đường chân trời); cảnh báo KHÔNG nhìn thẳng Mặt Trời;
 *     `fmtVN()` đổi "YYYY-MM-DD HH:mm" → "DD/MM/YYYY · HH:mm" (chép lại ở dưới
 *     để hai trang hiển thị giống hệt nhau).
 *
 * Hằng số thiên văn phổ thông (sách giáo khoa, không phải dữ liệu riêng của
 * lib): tuần trăng ~29,53 ngày; quỹ đạo Mặt Trăng nghiêng ~5,1° so với hoàng
 * đạo; chu kỳ Saros ~18 năm 11 ngày; trục Trái Đất nghiêng ~23,4°.
 *
 * PHÂN VAI (chống trùng nội dung): bài này sở hữu CƠ CHẾ nhật/nguyệt thực, lý
 * do không có thực mỗi tháng, và ý nghĩa thiên văn của bốn điểm phân – chí.
 * KHÔNG giảng lại 9 sao Cửu Diệu (/learn/sao-han), tháng nhuận & âm dương lịch
 * (/learn/lich-am-duong), chọn ngày tốt (/learn/trach-cat) — chỉ nhắc kèm link.
 *
 * Giọng: hiện tượng ĐO ĐƯỢC và TÍNH TRƯỚC ĐƯỢC. Lớp "điềm báo" là văn hoá —
 * nói rõ ra chứ không trộn vào tầng khoa học, và không chế nhạo người tin.
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
import { SKY_EVENTS, SEASON_META, SOLAR_META, kindMeta, type SkyEvent } from '@/lib/sky-events';
import {
  ThienVanFrame,
  ThienVanDepth,
  ThienVanRecall,
  ThienVanChecklist,
  ThienVanWhys,
  ThienVanDataNote,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Nhật thực, nguyệt thực và bốn điểm phân – chí',
  description:
    'Cơ chế nhật thực – nguyệt thực, vì sao không tháng nào cũng có, bốn điểm phân – chí và lịch sự kiện xem tại Việt Nam. Hiện tượng đo được, không phải điềm báo.',
  alternates: { canonical: 'https://hieu.asia/learn/thien-van' },
};

/** Class của link trong thân bài — gom một chỗ cho gọn. */
const LINK = 'text-gold-700 underline-offset-4 hover:underline';

// ── Dữ liệu: LỌC & ĐẾM từ SKY_EVENTS, không gõ tay con số nào ────────────────

/** "2026-03-03 18:33" → "03/03/2026 · 18:33" (giống hệt công cụ /thien-van). */
function fmtVN(dateVN: string): string {
  const [d = '', t = ''] = dateVN.split(' ');
  const [y = '', m = '', day = ''] = d.split('-');
  return `${day}/${m}/${y} · ${t}`;
}

const ECLIPSES: SkyEvent[] = SKY_EVENTS.filter((e) => e.type !== 'season');
const LUNAR: SkyEvent[] = SKY_EVENTS.filter((e) => e.type === 'lunar');
const SEASONS: SkyEvent[] = SKY_EVENTS.filter((e) => e.type === 'season');

/** Khoảng năm phủ bởi một nhóm sự kiện, suy từ chính dateVN. */
function yearSpan(events: SkyEvent[]): string {
  const years = events.map((e) => e.dateVN.slice(0, 4)).sort();
  const first = years[0];
  const last = years[years.length - 1];
  if (!first || !last) return '';
  return first === last ? first : `${first}–${last}`;
}

const ALL_SPAN = yearSpan(SKY_EVENTS);
const SEASON_SPAN = yearSpan(SEASONS);

/** Các mức nguyệt thực THỰC SỰ có trong dữ liệu, theo thứ tự xuất hiện. */
const LUNAR_KINDS = Array.from(new Set(LUNAR.map((e) => e.kind)));

/** Bốn loại mốc mùa, lấy theo thứ tự xuất hiện trong dữ liệu (xuân → đông). */
const SEASON_KINDS = Array.from(new Set(SEASONS.map((e) => e.kind)));

/** Các năm có đủ mốc phân – chí trong dữ liệu. */
const SEASON_YEARS = Array.from(new Set(SEASONS.map((e) => e.dateVN.slice(0, 4)))).sort();

const seasonLabel = (kind: string) => SEASON_META[kind]?.label ?? kind;
const seasonWhat = (kind: string) => SEASON_META[kind]?.what ?? '';
/** Ngày giờ VN của một mốc mùa trong một năm, đã định dạng. */
const seasonAt = (year: string, kind: string): string => {
  const ev = SEASONS.find((e) => e.kind === kind && e.dateVN.startsWith(year));
  return ev ? fmtVN(ev.dateVN) : '—';
};

/** Ghi chú thêm cho một dòng thực — lấy thẳng số của lib, không làm tròn lại. */
function eclipseNote(e: SkyEvent): string {
  if (e.type !== 'solar') return '';
  const parts: string[] = [];
  if (e.obscuration != null) parts.push(`che khoảng ${e.obscuration}% đĩa Mặt Trời`);
  if (e.altitude != null) parts.push(`Mặt Trời ở độ cao khoảng ${e.altitude}°`);
  return parts.join(' · ');
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ hiển thị (chống cloaking). Câu hỏi CỐ Ý khác bộ FAQ trên trang công cụ
// /thien-van (bên đó hỏi "năm 2026 có trăng máu không", "VN có nhật thực
// không", "có ảnh hưởng vận mệnh không"); ở đây hỏi về CƠ CHẾ.
const FAQS = [
  {
    q: 'Vì sao không phải tháng nào cũng có nhật thực và nguyệt thực?',
    a: 'Vì mặt phẳng quỹ đạo Mặt Trăng nghiêng khoảng 5,1 độ so với mặt phẳng quỹ đạo Trái Đất quanh Mặt Trời. Mỗi tuần trăng khoảng 29,53 ngày đều có một lần trăng non và một lần trăng tròn, nhưng phần lớn các lần đó Mặt Trăng đi trượt hơi cao hơn hoặc hơi thấp hơn cái bóng. Hai mặt phẳng nghiêng nhau chỉ cắt nhau tại hai điểm, gọi là giao điểm; thực chỉ xảy ra khi trăng non hoặc trăng tròn rơi đủ gần một giao điểm, tức là vài lần mỗi năm chứ không phải mỗi tháng.',
  },
  {
    q: 'Nhật thực và nguyệt thực khác nhau ở chỗ nào?',
    a: 'Khác ở thiên thể nào đứng giữa. Nhật thực là Mặt Trăng đi vào giữa và che Mặt Trời, nên chỉ xảy ra vào ngày trăng non. Nguyệt thực là Trái Đất đi vào giữa và đổ bóng lên Mặt Trăng, nên chỉ xảy ra vào đêm trăng tròn. Hệ quả thực tế: bóng Mặt Trăng nhỏ nên nhật thực chỉ quét một dải hẹp trên mặt đất và phụ thuộc nơi bạn đứng, còn nguyệt thực thì mọi người đang thấy Mặt Trăng trên bầu trời đều xem được cùng lúc.',
  },
  {
    q: 'Nguyệt thực toàn phần vì sao Mặt Trăng lại đỏ chứ không biến mất?',
    a: 'Vì khí quyển Trái Đất bẻ cong một phần ánh sáng Mặt Trời vòng vào bên trong vùng bóng tối, đồng thời tán xạ mất phần ánh sáng xanh và chỉ để lọt ánh sáng đỏ. Thứ chiếu lên Mặt Trăng lúc đó chính là ánh hoàng hôn và bình minh của toàn bộ Trái Đất cộng lại, nên đĩa Trăng ngả màu đỏ đồng. Dân gian gọi hiện tượng này là trăng máu, nhưng màu đỏ chỉ là kết quả của việc lọc ánh sáng, không mang ý nghĩa gì khác.',
  },
  {
    q: 'Nguyệt thực nửa tối là gì, vì sao khó nhìn thấy?',
    a: 'Bóng của Trái Đất có hai lớp: vùng bóng tối ở lõi và vùng nửa tối bao quanh. Nguyệt thực nửa tối là khi Mặt Trăng chỉ đi qua vùng nửa tối, nên độ sáng giảm rất ít và đĩa Trăng chỉ hơi xám đi ở một phía. Loại này gần như không nhận ra được bằng mắt thường. Lịch thiên văn vẫn liệt kê nó để danh sách đầy đủ, nhưng bạn đừng kỳ vọng nhìn thấy một cảnh tượng rõ ràng như nguyệt thực toàn phần.',
  },
  {
    q: 'Vì sao nhật thực nhìn từ Việt Nam thường chỉ là nhật thực một phần?',
    a: 'Vì bóng tối của Mặt Trăng chỉ vẽ trên mặt đất một dải rất hẹp, thường vài trăm kilômét. Chỉ những nơi nằm trong dải đó mới thấy nhật thực toàn phần; các vùng rộng lớn xung quanh chỉ thấy Mặt Trời bị khuyết một phần. Lịch thiên văn của hieu.asia lọc theo người quan sát tại Việt Nam, nên chỉ liệt kê những lần thực thực sự nhìn được từ đây kèm mức che cụ thể của mỗi lần.',
  },
  {
    q: 'Xuân phân, hạ chí, thu phân, đông chí có ý nghĩa thiên văn gì?',
    a: 'Bốn mốc này sinh ra vì trục quay của Trái Đất nghiêng khoảng 23,4 độ và giữ nguyên hướng nghiêng suốt vòng đi quanh Mặt Trời. Hai điểm phân là lúc Mặt Trời cắt qua xích đạo trời, khi đó ngày và đêm dài gần bằng nhau. Hai điểm chí là lúc Mặt Trời lệch xa xích đạo trời nhất, cho ngày dài nhất năm ở hạ chí và đêm dài nhất năm ở đông chí đối với bắc bán cầu. Mỗi mốc là một thời điểm cụ thể tính được tới từng phút, không phải trọn một ngày.',
  },
  {
    q: 'Vì sao nhà thiên văn tính trước được nhật thực hàng nghìn năm?',
    a: 'Vì chuyển động của Mặt Trời, Trái Đất và Mặt Trăng tuân theo cơ học đã biết và rất đều đặn, nên vị trí của chúng ở bất kỳ thời điểm nào trong quá khứ hay tương lai đều giải ra được. Ngay từ thời cổ đại người ta đã nhận ra các lần thực lặp lại theo chu kỳ Saros, khoảng 18 năm 11 ngày, và dự báo được bằng mẫu lặp đó. Đây cũng là bằng chứng mạnh nhất cho thấy đây là hiện tượng cơ học: một mô hình sai sẽ lệch dần và lộ ra sau vài chu kỳ.',
  },
  {
    q: 'La Hầu và Kế Đô trong sao hạn có liên quan gì đến nhật thực, nguyệt thực?',
    a: 'Có, và đây là mối liên hệ trực tiếp. La Hầu và Kế Đô không phải thiên thể mà chính là hai giao điểm nơi quỹ đạo Mặt Trăng cắt hoàng đạo, tức đúng hai vùng trời xảy ra nhật thực và nguyệt thực. Người xưa quan sát rất chính xác rằng mọi lần Mặt Trời hay Mặt Trăng bị nuốt đều xảy ra ở đó, nhưng chưa có mô hình để giải thích nên đã dựng nên thần thoại quanh hai điểm này. Cần tách hai tầng: hiện tượng là có thật và tính trước được, còn cách diễn giải thành điềm báo là một lớp văn hoá về sau.',
  },
  {
    q: 'Xem nhật thực thế nào cho an toàn?',
    a: 'Tuyệt đối không nhìn thẳng vào Mặt Trời, kể cả khi đĩa Mặt Trời đã bị che gần hết. Phải dùng kính lọc chuyên dụng dành cho quan sát Mặt Trời; kính râm thông thường, phim chụp X-quang hay đĩa CD đều không đủ an toàn. Tổn thương võng mạc có thể xảy ra mà người xem không hề thấy đau, vì võng mạc không có thụ thể đau. Nguyệt thực thì ngược lại: xem bằng mắt thường hoàn toàn an toàn, không cần thiết bị gì.',
  },
];

const JSONLD = [
  article({
    headline: 'Nhật thực, nguyệt thực và bốn điểm phân – chí: hiểu cơ chế bầu trời',
    description:
      'Cơ chế nhật thực và nguyệt thực, vì sao không tháng nào cũng có thực, ba mức nguyệt thực, bốn điểm phân – chí, và cây cầu tới La Hầu – Kế Đô trong phong tục.',
    url: '/learn/thien-van',
    type: 'TechArticle',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Lịch thiên văn', url: '/learn/thien-van' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Nhật thực, nguyệt thực và bốn điểm phân – chí',
    description:
      'Cơ chế nhật thực – nguyệt thực, vì sao không tháng nào cũng có, bốn điểm phân – chí và lịch sự kiện xem tại Việt Nam. Hiện tượng đo được, không phải điềm báo.',
    url: '/learn/thien-van',
  }),
];

export default function LearnThienVanPage() {
  return (
    <LearnArticle
      eyebrow="KHOA HỌC · THIÊN VĂN"
      title={
        <>
          Nhật thực, nguyệt thực{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            và bốn điểm phân – chí
          </span>
        </>
      }
      standfirst={
        <>
          Đây là bài khoa học của khu Học. Không có lá số, không có điềm báo — chỉ có ba thiên thể
          chuyển động theo quy luật đã biết, đều đặn tới mức con người tính trước được hàng nghìn năm.
          Hiểu được cơ chế ấy, bạn cũng hiểu luôn vì sao người xưa lại đặt tên thần cho hai điểm trên
          bầu trời.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Lịch thiên văn' },
      ]}
      relatedLenses={relatedLearnLenses('thien-van')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Xem lịch nhật thực, nguyệt thực và bốn điểm phân – chí quan sát được tại Việt Nam, kèm ngày giờ theo giờ VN và dòng thời gian trực quan.',
        href: '/thien-van',
        label: 'Mở lịch thiên văn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <ThienVanFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Lịch thiên văn là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Lịch thiên văn</strong> là bảng thời điểm của những hiện tượng xảy ra do vị
                trí tương đối giữa Mặt Trời, Trái Đất và Mặt Trăng: <strong>nhật thực</strong>,{' '}
                <strong>nguyệt thực</strong>, và <strong>bốn điểm phân – chí</strong>. Tất cả đều là
                hệ quả của chuyển động cơ học, nên đều{' '}
                <strong>tính trước được và kiểm chứng được</strong>.
              </p>
              <p>
                Nói thẳng ngay từ đầu để không hiểu nhầm:{' '}
                <strong>đây là hiện tượng đo được, không phải điềm báo</strong>. Ngày giờ trong lịch
                không nói gì về vận mệnh của ai. Nó chỉ nói: vào đúng phút đó, ba thiên thể sẽ nằm ở
                đúng vị trí đó — và bất kỳ ai ngước lên đúng lúc cũng kiểm chứng được.
              </p>
              <p>Cần phân biệt rõ ba thứ hay bị gộp làm một:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Lịch thiên văn</strong> (bài này): hiện tượng vật lý, có thời điểm chính xác
                  tới từng phút, ai cũng quan sát được.
                </li>
                <li>
                  <strong>Lịch pháp</strong> — chuyện tháng nhuận, vì sao Tết lệch, cách âm dương lịch
                  ghép tháng theo Trăng và năm theo Mặt Trời. Bài riêng:{' '}
                  <Link href="/learn/lich-am-duong" className={LINK}>
                    Lịch âm dương
                  </Link>
                  .
                </li>
                <li>
                  <strong>Phong tục chọn ngày</strong> — ngày tốt, giờ hoàng đạo, kiêng kỵ: một lớp
                  văn hoá đặt lên trên cuốn lịch. Bài riêng:{' '}
                  <Link href="/learn/trach-cat" className={LINK}>
                    Trạch Cát
                  </Link>
                  .
                </li>
              </ul>
              <p>
                Bài này chỉ nhận phần đầu tiên, nhưng nhận trọn: bạn sẽ hiểu tới tận cơ chế —{' '}
                <strong>vì sao có thực</strong>, <strong>vì sao không có thực mỗi tháng</strong>, và{' '}
                <strong>vì sao bốn mốc phân – chí lại tồn tại</strong>. hieu.asia là trang về huyền
                học, nhưng ở đây thì không có gì huyền cả: nếu có một bài trên trang này bạn có thể
                tin <strong>như tin một quyển sách vật lý</strong>, thì là bài này.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <ThienVanDepth />,
        },
        {
          id: 'nhat-thuc-nguyet-thuc',
          tocLabel: 'Nhật thực & nguyệt thực',
          heading: 'Nhật thực – nguyệt thực: cơ chế và vì sao không có mỗi tháng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Nguyệt thực: Trái Đất đổ bóng lên Mặt Trăng
              </h3>
              <p>
                Mặt Trăng không tự phát sáng — nó chỉ hắt lại ánh Mặt Trời. Vào đêm{' '}
                <strong>trăng tròn</strong>, ba thiên thể xếp thành hàng với{' '}
                <strong>Trái Đất ở giữa</strong>. Nếu hàng đủ thẳng, Mặt Trăng đi vào cái bóng Trái
                Đất kéo dài phía sau lưng, và nguồn sáng của nó bị cắt. Cái bóng ấy có{' '}
                <strong>hai lớp</strong>: phần lõi tối hẳn (vùng bóng tối) và phần viền mờ bao quanh
                (vùng nửa tối). Mặt Trăng đi vào lớp nào, đi sâu đến đâu — đó chính là thứ quyết định
                “mức” của lần nguyệt thực.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Nhật thực: Mặt Trăng che Mặt Trời
              </h3>
              <p>
                Đảo lại thứ tự: vào ngày <strong>trăng non</strong>, Mặt Trăng đi vào giữa và chắn
                trước Mặt Trời. Trùng hợp đẹp đẽ nhất của bầu trời chúng ta là Mặt Trời to hơn Mặt
                Trăng khoảng 400 lần nhưng cũng ở xa hơn khoảng 400 lần, nên nhìn từ Trái Đất{' '}
                <strong>hai đĩa gần bằng nhau</strong> — đủ để Mặt Trăng che vừa khít Mặt Trời.
              </p>
              <p>
                Khác biệt quan trọng so với nguyệt thực:{' '}
                <strong>nhật thực phụ thuộc nơi bạn đứng</strong>. Bóng Mặt Trăng chỉ vẽ trên mặt đất
                một dải hẹp; ngoài dải đó, người ta chỉ thấy Mặt Trời khuyết một phần. Còn nguyệt thực
                thì <strong>ai đang thấy Mặt Trăng trên trời đều xem được cùng lúc</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Chốt lõi: vì sao không có thực mỗi tháng
              </h3>
              <p>
                Đây là câu hỏi hay nhất của cả bài. Mỗi <strong>~29,53 ngày</strong> (một tuần trăng)
                luôn có đúng một lần trăng non và một lần trăng tròn. Vậy nếu quỹ đạo Mặt Trăng nằm
                trùng mặt phẳng quỹ đạo Trái Đất, thì <strong>tháng nào cũng phải có</strong> cả nhật
                thực lẫn nguyệt thực — mỗi tháng một cặp, đều như vắt chanh.
              </p>
              <p>
                Thực tế không vậy, vì quỹ đạo Mặt Trăng{' '}
                <strong>nghiêng khoảng 5,1° so với mặt phẳng quỹ đạo Trái Đất</strong>. Chỉ hơn năm độ
                thôi, nhưng đủ để cái bóng trượt hụt: hầu hết các lần trăng non, Mặt Trăng đi ngang{' '}
                <em>bên trên</em> hoặc <em>bên dưới</em> đĩa Mặt Trời; hầu hết các lần trăng tròn, nó
                đi lệch khỏi bóng Trái Đất.
              </p>
              <p>
                Hai mặt phẳng nghiêng nhau thì cắt nhau theo một đường, và đường đó gặp quỹ đạo Mặt
                Trăng ở <strong>đúng hai điểm — gọi là giao điểm</strong>. Thực chỉ xảy ra khi pha
                trăng non hoặc trăng tròn rơi <strong>đủ gần một trong hai giao điểm</strong>. Vì thế
                thực đến theo “mùa”, vài lần mỗi năm.
              </p>
              <p className="text-sm text-foreground/70">
                Ghi nhớ câu này, vì phần La Hầu – Kế Đô ở dưới xoay quanh đúng nó:{' '}
                <strong>mọi lần thực trong lịch sử đều xảy ra ở đúng hai vùng trời</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Các mức thực</h3>
              <p>
                Lịch của hieu.asia dùng đúng bộ nhãn dưới đây — cũng là bộ nhãn trong công cụ, nên hai
                nơi không thể mô tả khác nhau:
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Mức
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hiện tượng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {LUNAR_KINDS.map((kind) => {
                      const sample = LUNAR.find((e) => e.kind === kind);
                      const meta = sample ? kindMeta(sample) : undefined;
                      return (
                        <tr key={kind} className="border-b border-border/60">
                          <td className="px-4 py-2 font-medium text-foreground">
                            {meta?.label ?? kind}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{meta?.what ?? ''}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className="px-4 py-2 font-medium text-foreground">{SOLAR_META.label}</td>
                      <td className="px-4 py-2 text-muted-foreground">{SOLAR_META.what}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Trên phạm vi toàn cầu còn có nhật thực toàn phần và nhật thực hình khuyên (khi Mặt
                Trăng ở xa nên đĩa của nó nhỏ hơn đĩa Mặt Trời, để lộ một vòng sáng). Trong khoảng dữ
                liệu này, những lần quan sát được từ Việt Nam đều mang nhãn{' '}
                <strong>{SOLAR_META.label}</strong> — xem cột Mức ở bảng dưới.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Lịch nhật thực – nguyệt thực {ALL_SPAN} (giờ Việt Nam)
              </h3>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Ngày giờ (giờ VN)
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Loại
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Mức
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Ghi chú
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ECLIPSES.map((e) => (
                      <tr key={e.dateUTC} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">
                          {fmtVN(e.dateVN)}
                        </td>
                        <td className="px-4 py-2 text-foreground">
                          {e.type === 'solar' ? 'Nhật thực' : 'Nguyệt thực'}
                        </td>
                        <td className="px-4 py-2 text-foreground">{kindMeta(e).label}</td>
                        <td className="px-4 py-2 text-muted-foreground">{eclipseNote(e)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Nhật thực trong bảng được lọc theo <strong>người quan sát tại Việt Nam</strong>, nên
                đây là những lần bạn thật sự nhìn được từ đây chứ không phải mọi lần trên thế giới.
                Nguyệt thực thì mang tính toàn cầu — điều kiện duy nhất là Mặt Trăng đang ở{' '}
                <strong>trên đường chân trời</strong> nơi bạn đứng vào lúc đó.
              </p>
              <ThienVanDataNote />
            </div>
          ),
        },
        {
          id: 'phan-chi',
          tocLabel: 'Bốn điểm phân – chí',
          heading: 'Bốn điểm phân – chí: nhịp một năm của Trái Đất',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nếu trục quay của Trái Đất dựng thẳng đứng so với mặt phẳng quỹ đạo, hành tinh này sẽ
                không có mùa: ngày nào cũng dài như ngày nào, ở đâu cũng vậy. Nhưng trục Trái Đất{' '}
                <strong>nghiêng khoảng 23,4°</strong>, và nó <strong>giữ nguyên hướng nghiêng</strong>{' '}
                suốt vòng đi quanh Mặt Trời. Toàn bộ chuyện bốn mùa sinh ra từ đúng chi tiết đó.
              </p>
              <p>
                Hệ quả: có hai thời điểm trong năm mà trục không ngả về phía Mặt Trời cũng không ngả
                ra xa — <strong>hai điểm phân</strong>. Và hai thời điểm mà độ ngả đạt cực đại về một
                phía — <strong>hai điểm chí</strong>. Nói theo ngôn ngữ thiên văn cho chặt:{' '}
                <strong>điểm phân</strong> là lúc Mặt Trời cắt
                qua <strong>xích đạo trời</strong>; <strong>điểm chí</strong> là lúc Mặt Trời lệch xa
                xích đạo trời nhất về bắc hoặc về nam. Vì được định nghĩa bằng một vị trí cụ thể, mỗi
                mốc là <strong>một thời điểm tính được tới từng phút</strong> — không phải trọn một
                ngày.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Mốc
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Ý nghĩa thiên văn
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SEASON_KINDS.map((kind) => (
                      <tr key={kind} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">
                          {seasonLabel(kind)}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{seasonWhat(kind)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Mốc phân – chí {SEASON_SPAN} (giờ Việt Nam)
              </h3>
              <p>
                Xếp theo năm sẽ thấy ngay điều đáng chú ý: cùng một mốc{' '}
                <strong>không rơi vào đúng một ngày giờ mỗi năm</strong>, mà nhích dần. Lý do đơn
                giản — một vòng quanh Mặt Trời không dài đúng số nguyên ngày, nên thời điểm trôi
                khoảng gần 6 giờ mỗi năm rồi được kéo về khi có ngày 29/2.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Năm
                      </th>
                      {SEASON_KINDS.map((kind) => (
                        <th
                          key={kind}
                          scope="col"
                          className="px-4 py-2.5 font-semibold text-foreground"
                        >
                          {seasonLabel(kind)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SEASON_YEARS.map((year) => (
                      <tr key={year} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium tabular-nums text-foreground">
                          {year}
                        </td>
                        {SEASON_KINDS.map((kind) => (
                          <td key={kind} className="px-4 py-2 tabular-nums text-muted-foreground">
                            {seasonAt(year, kind)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Lưu ý một chỗ dễ giật mình: có mốc rơi vào rạng sáng ngày hôm sau theo giờ Việt Nam so
                với ngày bạn thường thấy trên các trang quốc tế. Đó không phải sai lệch — chỉ là cùng
                một khoảnh khắc, đọc ở <strong>hai múi giờ khác nhau</strong>.
              </p>
              <p>
                Cuối cùng, một ranh giới cần giữ:{' '}
                <strong>đông chí còn được cuốn âm dương lịch dùng làm mốc neo</strong> để xác định
                tháng 11 âm và từ đó suy ra tháng nhuận. Nhưng đó là <em>cách con người dùng</em> mốc
                thiên văn, thuộc về lịch pháp chứ không phải bản thân hiện tượng. Phần đó nằm trong
                bài{' '}
                <Link href="/learn/lich-am-duong" className={LINK}>
                  Lịch âm dương
                </Link>{' '}
                — ở đây không giảng lại.
              </p>
            </div>
          ),
        },
        {
          id: 'la-hau-ke-do',
          tocLabel: 'La Hầu – Kế Đô',
          heading: 'Cây cầu: giao điểm quỹ đạo và hai “sao” trong phong tục',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nhớ lại câu đã ghi ở trên:{' '}
                <strong>
                  mọi lần nhật thực và nguyệt thực đều xảy ra ở đúng hai điểm — nơi quỹ đạo Mặt Trăng
                  cắt hoàng đạo
                </strong>
                . Hai điểm đó, trong tục xem sao hạn của phương Đông, chính là{' '}
                <strong>La Hầu</strong> và <strong>Kế Đô</strong>.
              </p>
              <p>
                Đây là một trong những cây cầu đẹp nhất giữa khoa học và văn hoá, nên cần kể cho đúng.
                Người xưa <strong>quan sát rất chính xác</strong>: họ ghi nhận rằng Mặt Trời và Mặt
                Trăng chỉ “bị nuốt” ở hai vùng trời nhất định, và hai vùng ấy đối xứng nhau qua Trái
                Đất. Cái họ chưa có là mô hình để giải thích <em>vì sao</em>. Thiếu mô hình, họ làm
                điều tự nhiên nhất của con người: <strong>đặt tên và kể một câu chuyện</strong>. Từ
                đó, hai điểm hình học trở thành hai “hung tinh” trong bảng Cửu Diệu, mang nghĩa che
                khuất và xáo trộn — nghĩa vay thẳng từ chính hiện tượng che khuất mà chúng gây ra.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Tách rõ hai tầng</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tầng hiện tượng</strong> — có hai giao điểm quỹ đạo, và nhật thực – nguyệt
                  thực chỉ xảy ra quanh chúng. <strong>Kiểm chứng được</strong>: tính trước tới từng
                  phút, ai cũng quan sát lại được.
                </li>
                <li>
                  <strong>Tầng diễn giải</strong> — hai điểm ấy là “sao xấu” La Hầu – Kế Đô, năm gặp
                  phải thì nên thận trọng. <strong>Không kiểm chứng được</strong>: đây là quy ước văn
                  hoá, không suy ra được từ hiện tượng.
                </li>
              </ul>
              <p>
                Trộn hai tầng lại là chỗ sinh ra mọi hiểu nhầm. Tầng trên là{' '}
                <strong>thiên văn</strong>: đúng, đo được, không phụ thuộc niềm tin của ai. Tầng dưới
                là <strong>văn hoá</strong>: một cách người xưa nói về nỗi lo trước điều chưa hiểu —
                đáng trân trọng như một di sản, nhưng không phải kết luận khoa học.
              </p>
              <p className="text-sm text-foreground/70">
                Bài này dừng ở đây, vì phần còn lại thuộc về bài khác. Muốn biết đủ 9 sao Cửu Diệu, vì
                sao nam nữ tra hai bảng khác nhau, và “giải hạn” nên hiểu thế nào, đọc{' '}
                <Link href="/learn/sao-han" className={LINK}>
                  bài Sao Hạn
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Ranh giới & an toàn',
          heading: 'Ranh giới: cái tính được, cái không — và cách xem cho an toàn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Phần thiên văn tính được và kiểm chứng được
              </h3>
              <p>
                Ngày, giờ, mức che, độ cao của thiên thể lúc đỉnh — tất cả đều là kết quả tính toán,
                không phải ước lượng. Lịch của hieu.asia được tính bằng một{' '}
                <strong>thư viện thiên văn mã nguồn mở</strong>, nên bạn đối chiếu với bất kỳ nguồn
                thiên văn nào khác thì các con số cũng phải khớp. Con người đã tính đúng các lần thực
                từ trước khi có kính thiên văn, dựa vào chu kỳ lặp{' '}
                <strong>Saros ~18 năm 11 ngày</strong>. Một mô hình sai sẽ lệch dần rồi lộ ra sau vài
                chu kỳ — mô hình này thì khớp qua hàng thế kỷ, cả khi tính ngược về các lần thực ghi
                trong sử sách.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Phần “điềm báo” không thuộc về thiên văn
              </h3>
              <p>
                Mọi khẳng định kiểu “nhật thực báo hiệu tai hoạ”, “trăng máu là điềm dữ” đều nằm ở{' '}
                <strong>tầng văn hoá</strong>, không phải kết luận khoa học. Không có cơ chế nào để
                một cái bóng vũ trụ tác động tới công việc hay sức khoẻ của một người.
              </p>
              <p>
                Có một lập luận rất gọn để nhớ:{' '}
                <strong>một sự kiện đã được tính trước hàng thế kỷ thì không “báo hiệu” điều gì</strong>
                . Nó chỉ báo rằng ba thiên thể sắp thẳng hàng — đúng như đã tính từ lâu. Nói vậy không
                phải để chê người tin: nỗi sợ ấy từng rất hợp lý khi chưa ai biết cơ chế. Chỉ là hôm
                nay chúng ta đã biết.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Giới hạn của chính bảng này</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Dữ liệu chỉ phủ <strong>{ALL_SPAN}</strong>, và các mốc phân – chí chỉ có tới{' '}
                  <strong>{SEASON_SPAN}</strong> — không phải một lịch vô hạn.
                </li>
                <li>
                  Nhật thực được lọc theo <strong>người quan sát tại Hà Nội</strong>. Đứng ở đầu kia
                  đất nước, thời điểm và mức che có thể chênh chút ít.
                </li>
                <li>
                  Nguyệt thực mang tính toàn cầu, nhưng bạn chỉ xem được nếu{' '}
                  <strong>Mặt Trăng đang ở trên đường chân trời</strong> lúc xảy ra — và nếu trời
                  quang mây.
                </li>
                <li>
                  Bảng này <strong>không nói gì</strong> về ngày tốt xấu, tháng nhuận hay giờ hoàng
                  đạo. Đó là câu hỏi của những bài khác.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">
                An toàn khi xem: điều duy nhất bắt buộc phải nhớ
              </h3>
              <div className="rounded-xl border border-gold/30 bg-card/40 p-4">
                <p>
                  <strong>
                    ⚠️ Không nhìn trực tiếp vào Mặt Trời khi xem nhật thực — phải dùng kính lọc chuyên
                    dụng.
                  </strong>{' '}
                  Cảnh báo này nằm ngay trong mô tả nhật thực của công cụ, và cần được nhắc lại nghiêm
                  túc: kính râm thường, phim chụp X-quang hay đĩa CD đều{' '}
                  <strong>không đủ an toàn</strong>. Tổn thương võng mạc có thể xảy ra mà bạn{' '}
                  <strong>không thấy đau</strong>, vì võng mạc không có thụ thể đau — nên cảm giác
                  “nhìn nhanh chút không sao” là một cảm giác sai.
                </p>
                <p className="mt-3">
                  <strong>Nguyệt thực thì ngược lại hoàn toàn:</strong> xem bằng mắt thường an toàn
                  tuyệt đối, không cần thiết bị gì. Đó cũng là hiện tượng dễ rủ cả nhà cùng xem nhất.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <ThienVanWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <ThienVanRecall />,
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
                Bài này chỉ nhận phần thiên văn. Tháng nhuận và chuyện Tết lệch nằm ở{' '}
                <Link href="/learn/lich-am-duong" className={LINK}>
                  Lịch âm dương
                </Link>
                ; chọn ngày giờ nằm ở{' '}
                <Link href="/learn/trach-cat" className={LINK}>
                  Trạch Cát
                </Link>
                ; còn đủ 9 sao Cửu Diệu thì ở{' '}
                <Link href="/learn/sao-han" className={LINK}>
                  Sao Hạn
                </Link>
                .
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn biết lần thực gần nhất xem được từ Việt Nam rơi vào ngày giờ nào?{' '}
                <Link href="/thien-van" className={LINK}>
                  Mở lịch thiên văn miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/thien-van', label: 'Lịch thiên văn' },
                    { href: '/lich-van-nien', label: 'Lịch vạn niên' },
                    { href: '/ban-do-sao', label: 'Bản đồ sao' },
                    { href: '/cung-hoang-dao', label: 'Cung hoàng đạo' },
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
          children: <ThienVanChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
