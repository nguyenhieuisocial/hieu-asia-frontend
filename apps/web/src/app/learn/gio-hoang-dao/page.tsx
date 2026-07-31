/**
 * /learn/gio-hoang-dao — bài học nền tảng về CHỌN GIỜ (không phải chọn ngày).
 *
 * GROUNDING — mọi tên sao, khung giờ và quy tắc khởi giờ đều lấy từ:
 *   • lib/gio-hoang-dao.ts — BRANCHES, HOUR_RANGE, HOANG_DAO_STARS,
 *     HAC_DAO_STARS (import trực tiếp, không chép tay), vòng 12 sao STARS,
 *     THANH_LONG_OFFSET (mốc khởi Thanh Long theo CHI NGÀY) và công thức xếp sao
 *     `STARS[((h - offset) % 12 + 12) % 12]`.
 *   • lib/gio-hoang-dao-stars.ts — SAO_GIO (ý nghĩa từng sao, giọng tỉnh táo).
 *   • app/gio-hoang-dao/ — trang công cụ và thư viện /y-nghia.
 * Hai ví dụ tra tay (8/8/2026 Giáp Dần và 10/8/2026 Bính Thìn) là kết quả của
 * chính computeGioHoangDao() với hai ngày đó — KHÔNG tự suy, không làm tròn.
 *
 * PHÂN VAI (chống trùng nội dung): phần chọn NGÀY thuộc /learn/trach-cat. Bài
 * này chỉ sở hữu phần chọn GIỜ và trỏ link sang các lớp khác.
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
  BRANCHES,
  HOUR_RANGE,
  HOANG_DAO_STARS,
  HAC_DAO_STARS,
  type Branch,
} from '@/lib/gio-hoang-dao';
import {
  GioHoangDaoFrame,
  GioHoangDaoDepth,
  GioHoangDaoRecall,
  GioHoangDaoChecklist,
  GioHoangDaoWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤48 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: 'Giờ Hoàng Đạo — 12 canh giờ và cách khởi giờ',
  description:
    'Giờ hoàng đạo: 12 canh giờ địa chi, 6 sao hoàng đạo và 6 sao hắc đạo, cách khởi giờ theo chi ngày. Vì sao giờ tốt đổi mỗi ngày — tham khảo phong tục.',
  alternates: { canonical: 'https://hieu.asia/learn/gio-hoang-dao' },
};

// Mốc khởi sao Thanh Long theo CHI NGÀY — chép đúng từ THANH_LONG_OFFSET trong
// lib/gio-hoang-dao.ts (hằng số nội bộ, không export). Offset = chỉ số canh giờ
// (0 = Tý, 2 = Dần, 4 = Thìn…) nơi vòng 12 sao bắt đầu bằng Thanh Long.
const KHOI_THANH_LONG: { chiNgay: string; gio: Branch; quyet: string }[] = [
  { chiNgay: 'Dần · Thân', gio: 'Tý', quyet: 'Dần Thân gia Tý' },
  { chiNgay: 'Mão · Dậu', gio: 'Dần', quyet: 'Mão Dậu Dần' },
  { chiNgay: 'Thìn · Tuất', gio: 'Thìn', quyet: 'Thìn Tuất Thìn' },
  { chiNgay: 'Tỵ · Hợi', gio: 'Ngọ', quyet: 'Tỵ Hợi Ngọ' },
  { chiNgay: 'Tý · Ngọ', gio: 'Thân', quyet: 'Tý Ngọ Thân' },
  { chiNgay: 'Sửu · Mùi', gio: 'Tuất', quyet: 'Sửu Mùi Tuất' },
];

// Vòng 12 sao trực giờ — thứ tự CỐ ĐỊNH, chép đúng mảng STARS trong
// lib/gio-hoang-dao.ts (6 sao good xen 6 sao !good).
const VONG_12_SAO: { name: string; good: boolean }[] = [
  { name: 'Thanh Long', good: true }, { name: 'Minh Đường', good: true },
  { name: 'Thiên Hình', good: false }, { name: 'Chu Tước', good: false },
  { name: 'Kim Quỹ', good: true }, { name: 'Thiên Đức', good: true },
  { name: 'Bạch Hổ', good: false }, { name: 'Ngọc Đường', good: true },
  { name: 'Thiên Lao', good: false }, { name: 'Huyền Vũ', good: false },
  { name: 'Tư Mệnh', good: true }, { name: 'Câu Trận', good: false },
];

// Hai ví dụ tra tay đặt cạnh nhau — cột A = computeGioHoangDao(8, 8, 2026)
// (ngày Giáp Dần, chi Dần → khởi Thanh Long tại giờ Tý); cột B =
// computeGioHoangDao(10, 8, 2026) (ngày Bính Thìn, chi Thìn → khởi tại giờ Thìn).
const SO_SANH: { gio: Branch; a: string; aGood: boolean; b: string; bGood: boolean }[] = [
  { gio: 'Tý', a: 'Thanh Long', aGood: true, b: 'Thiên Lao', bGood: false },
  { gio: 'Sửu', a: 'Minh Đường', aGood: true, b: 'Huyền Vũ', bGood: false },
  { gio: 'Dần', a: 'Thiên Hình', aGood: false, b: 'Tư Mệnh', bGood: true },
  { gio: 'Mão', a: 'Chu Tước', aGood: false, b: 'Câu Trận', bGood: false },
  { gio: 'Thìn', a: 'Kim Quỹ', aGood: true, b: 'Thanh Long', bGood: true },
  { gio: 'Tỵ', a: 'Thiên Đức', aGood: true, b: 'Minh Đường', bGood: true },
  { gio: 'Ngọ', a: 'Bạch Hổ', aGood: false, b: 'Thiên Hình', bGood: false },
  { gio: 'Mùi', a: 'Ngọc Đường', aGood: true, b: 'Chu Tước', bGood: false },
  { gio: 'Thân', a: 'Thiên Lao', aGood: false, b: 'Kim Quỹ', bGood: true },
  { gio: 'Dậu', a: 'Huyền Vũ', aGood: false, b: 'Thiên Đức', bGood: true },
  { gio: 'Tuất', a: 'Tư Mệnh', aGood: true, b: 'Bạch Hổ', bGood: false },
  { gio: 'Hợi', a: 'Câu Trận', aGood: false, b: 'Ngọc Đường', bGood: true },
];

function SaoCell({ name, good }: { name: string; good: boolean }) {
  return (
    <td className={good ? 'px-3 py-1.5 font-medium text-emerald-400' : 'px-3 py-1.5 text-muted-foreground'}>
      {name} <span className="font-mono text-[11px]">{good ? '· tốt' : '· xấu'}</span>
    </td>
  );
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Canh giờ là gì và vì sao một giờ âm dài hai tiếng đồng hồ?',
    a: 'Người xưa chia một ngày thành 12 phần, mỗi phần gọi là một canh giờ và mang tên một địa chi: Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi. Vì 24 giờ đồng hồ chia cho 12 canh nên mỗi canh dài đúng 2 tiếng. Khi ai đó nói "giờ Ngọ" là họ nói cả khung 11h–13h, không phải riêng mốc 12h — bạn có trọn hai tiếng để làm việc chính, không cần canh đúng phút.',
  },
  {
    q: 'Giờ Tý bắt đầu lúc mấy giờ?',
    a: 'Giờ Tý là khung 23h–1h, tức bắt đầu từ 11 giờ đêm chứ không phải đúng nửa đêm — nửa đêm nằm ở giữa khung. Đây là chi tiết hay gây nhầm khi tra tay: phần 23h–24h của đêm hôm trước, về mặt canh giờ, đã thuộc giờ Tý. Các canh sau cộng dần hai tiếng: Sửu 1h–3h, Dần 3h–5h, Mão 5h–7h, Thìn 7h–9h, Tỵ 9h–11h, Ngọ 11h–13h, Mùi 13h–15h, Thân 15h–17h, Dậu 17h–19h, Tuất 19h–21h, Hợi 21h–23h.',
  },
  {
    q: 'Mỗi ngày có bao nhiêu giờ hoàng đạo?',
    a: 'Luôn đúng 6 giờ hoàng đạo và 6 giờ hắc đạo. Lý do: vòng 12 sao trực giờ gồm 6 sao lành và 6 sao dữ, được xếp đủ một lần lên 12 canh giờ, nên tỉ lệ 6–6 không bao giờ đổi. Thứ thay đổi theo từng ngày là giờ NÀO tốt, còn số lượng thì cố định — không có ngày nào toàn giờ xấu.',
  },
  {
    q: 'Vì sao cùng là giờ Tý mà ngày này tốt, ngày kia lại xấu?',
    a: 'Vì vòng 12 sao giữ nguyên thứ tự nhưng điểm xuất phát đổi theo địa chi của NGÀY. Ngày mang chi Dần khởi sao Thanh Long tại giờ Tý, nên giờ Tý hôm đó là Thanh Long (đại cát). Ngày mang chi Thìn lại khởi Thanh Long tại giờ Thìn, cả vòng bị đẩy đi, nên chính khung 23h–1h ấy rơi vào Thiên Lao (hắc đạo). Không có giờ nào tốt hay xấu vĩnh viễn — phải tra theo ngày cụ thể.',
  },
  {
    q: 'Cách khởi giờ hoàng đạo theo chi ngày như thế nào?',
    a: 'Bài quyết cổ ghi sáu vế: "Dần Thân gia Tý, Mão Dậu Dần, Thìn Tuất Thìn, Tỵ Hợi Ngọ, Tý Ngọ Thân, Sửu Mùi Tuất". Nghĩa là ngày chi Dần hoặc Thân thì khởi Thanh Long tại giờ Tý; ngày chi Mão hoặc Dậu khởi tại giờ Dần; và cứ thế. Từ mốc đó xếp lần lượt vòng 12 sao cố định — Thanh Long, Minh Đường, Thiên Hình, Chu Tước, Kim Quỹ, Thiên Đức, Bạch Hổ, Ngọc Đường, Thiên Lao, Huyền Vũ, Tư Mệnh, Câu Trận — lên 12 canh giờ, quay vòng khi hết.',
  },
  {
    q: 'Thiên Đức và Bảo Quang có phải cùng một sao không?',
    a: 'Đúng, cùng một sao với hai tên gọi. Sao thứ sáu trong vòng 12 sao trực giờ được một số bản lịch ghi là Thiên Đức, số khác ghi là Bảo Quang. Gặp bảng ghi "Bảo Quang" thì hiểu đó chính là Thiên Đức, đừng tưởng là một sao thứ mười ba. Đây là kiểu dị bản tên gọi rất thường gặp trong tư liệu lịch pháp.',
  },
  {
    q: 'Việc gấp rơi đúng vào giờ hắc đạo thì phải làm sao?',
    a: 'Trước hết đừng lo: trong chính ngày đó vẫn còn 5 giờ hoàng đạo khác, thường có ít nhất một khung thuận tiện. Nếu không khung nào tiện thật, cứ làm vào giờ đã hẹn và bù bằng sự chuẩn bị kỹ hơn — đọc lại giấy tờ, xác minh thông tin, đi sớm hơn. "Giờ xấu" là lời nhắc thận trọng theo phong tục, không phải điều cấm, và hieu.asia không bán lễ hoá giải.',
  },
  {
    q: 'Giờ hoàng đạo có cơ sở thiên văn không?',
    a: 'Không. 12 "sao" trực giờ là thần sát trong lịch pháp, không phải thiên thể có thật, và cách xếp chúng lên 12 canh giờ là một quy ước truyền lại qua sách phong tục. Không có phép đo thiên văn nào xác nhận Thanh Long "đang ở" giờ Tý của ngày Dần. Biết vậy để dùng cho đúng: giờ hoàng đạo là một mốc văn hoá giúp khởi sự vững tâm, không phải quy luật tự nhiên.',
  },
  {
    q: 'Chọn giờ hoàng đạo có cần chọn ngày tốt trước không?',
    a: 'Theo trình tự trạch cát truyền thống thì chọn ngày trước, chọn giờ sau — giờ là lớp cuối cùng. Nhưng thực tế nhiều người đã bị ràng buộc ngày (lịch nghỉ, lịch hẹn của đối tác, ngày cơ quan làm việc) và chỉ còn chọn được giờ. Trường hợp đó vẫn dùng được bình thường: ngày nào cũng có đủ 6 giờ hoàng đạo để chọn.',
  },
];

const JSONLD = [
  article({
    headline: 'Giờ Hoàng Đạo: 12 canh giờ, 12 sao trực giờ và cách khởi giờ theo chi ngày',
    description:
      'Giờ hoàng đạo — 12 canh giờ địa chi, 6 sao hoàng đạo / 6 sao hắc đạo và cách khởi vòng sao theo chi ngày, kèm ví dụ tra tay. Góc nhìn tham khảo, không mê tín.',
    url: '/learn/gio-hoang-dao',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Giờ Hoàng Đạo', url: '/learn/gio-hoang-dao' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Giờ Hoàng Đạo — 12 canh giờ và cách khởi giờ theo ngày',
    description:
      'Giờ hoàng đạo: 12 canh giờ địa chi, 6 sao hoàng đạo và 6 sao hắc đạo, cách khởi giờ theo chi ngày. Vì sao giờ tốt đổi mỗi ngày — tham khảo phong tục.',
    url: '/learn/gio-hoang-dao',
  }),
];

const linkCls = 'text-gold-700 underline-offset-4 hover:underline';

export default function LearnGioHoangDaoPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · CHỌN GIỜ"
      title={
        <>
          Giờ{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">Hoàng Đạo</span>
        </>
      }
      standfirst={
        <>
          Ngày đã chọn xong, còn lại một câu hỏi rất đời: “mấy giờ thì bắt đầu?”. Người xưa chia ngày
          thành 12 canh giờ và cho rằng mỗi canh do một sao cai quản — 6 canh lành là giờ hoàng đạo,
          6 canh còn lại nên thận trọng. Đây là một quy ước phong tục để tham khảo, không phải quy
          luật tự nhiên.
        </>
      }
      readMeta="9 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Giờ Hoàng Đạo' },
      ]}
      relatedLenses={relatedLearnLenses('gio-hoang-dao')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập một ngày bất kỳ (hoặc để nguyên hôm nay), hệ thống hiển thị đủ 12 canh giờ kèm khung giờ đồng hồ, đánh dấu giờ hoàng đạo — hắc đạo và gợi ý giờ tốt kế tiếp trong ngày.',
        href: '/gio-hoang-dao',
        label: 'Tra giờ hoàng đạo theo ngày',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <GioHoangDaoFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Giờ hoàng đạo là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Theo lịch pháp truyền thống, một ngày được chia thành <strong>12 canh giờ</strong>,
                mỗi canh dài hai tiếng đồng hồ và mang tên một địa chi. Mỗi canh được xem là do một
                trong <strong>12 sao trực giờ</strong> cai quản: 6 sao lành làm nên{' '}
                <strong>giờ hoàng đạo</strong> (giờ tốt), 6 sao dữ làm nên <strong>giờ hắc đạo</strong>{' '}
                (giờ nên thận trọng).
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Giờ hoàng đạo là <strong>một mốc để khởi sự cho vững tâm</strong> — có giờ hẹn rõ
                  ràng, mọi người cùng có mặt, tâm thế bình tĩnh. Không phải lời bảo đảm việc sẽ
                  thành.
                </li>
                <li>
                  <strong>Không có “giờ chết”.</strong> 12 sao luân phiên đều đặn mỗi ngày; ai cũng đi
                  qua cả giờ tốt lẫn giờ xấu hằng ngày mà cuộc sống vẫn diễn ra bình thường.
                </li>
                <li>
                  Giờ tốt <strong>không cố định</strong> — nó đổi theo từng ngày. Nhớ “giờ Tý là giờ
                  tốt” rồi áp cho mọi ngày là cách hiểu sai phổ biến nhất.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground">
                Bài này nói về GIỜ — không nói về ngày
              </h3>
              <p>
                Chọn thời điểm trong phong tục có nhiều lớp; bài này chỉ sở hữu <strong>lớp giờ</strong>.
                Những lớp khác có bài và công cụ riêng, để bạn không phải đọc lẫn:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chọn ngày tốt theo loại việc</strong> (cưới hỏi, động thổ, khai trương…) —{' '}
                  <Link href="/xem-ngay" className={linkCls}>công cụ xem ngày tốt</Link>, nền tảng lý
                  thuyết ở bài <Link href="/learn/trach-cat" className={linkCls}>Trạch Cát</Link>.
                </li>
                <li>
                  <strong>Ngày kiêng kỵ</strong> (Tam Nương, Nguyệt Kỵ…) —{' '}
                  <Link href="/ngay-kieng-ky" className={linkCls}>tra ngày kiêng kỵ</Link>.
                </li>
                <li>
                  <strong>Hướng xuất hành</strong> (đi về hướng nào) —{' '}
                  <Link href="/xuat-hanh" className={linkCls}>xem hướng xuất hành</Link>.
                </li>
                <li>
                  <strong>Đổi ngày âm – dương, can chi của ngày</strong> —{' '}
                  <Link href="/lich-van-nien" className={linkCls}>Lịch Vạn Niên</Link>.
                </li>
              </ul>
              <p>
                Một điều để giữ đúng tinh thần: đây không phải công cụ để hù doạ hay bán lễ. hieu.asia
                trình bày để bạn <strong>tham khảo</strong>, không phán số mệnh và{' '}
                <strong>không bán lễ hoá giải giờ xấu</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <GioHoangDaoDepth />,
        },
        {
          id: 'muoi-hai-gio-dia-chi',
          tocLabel: '12 giờ địa chi',
          heading: '12 canh giờ địa chi ↔ khung giờ đồng hồ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trước khi nói tốt – xấu, phải biết “giờ Tý”, “giờ Ngọ” là mấy giờ đồng hồ. Một ngày 24
                tiếng chia cho 12 canh, nên <strong>mỗi canh giờ dài đúng 2 tiếng</strong>. Đây là
                bảng quy đổi mà công cụ dùng:
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[320px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">#</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">Canh giờ</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Khung giờ đồng hồ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {BRANCHES.map((b, i) => (
                      <tr key={b} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-mono text-xs text-gold-700">
                          {String(i + 1).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-2 font-medium text-foreground">Giờ {b}</td>
                        <td className="px-4 py-2 text-muted-foreground">{HOUR_RANGE[b]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Hai điều dễ nhầm trong bảng này</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Giờ Tý bắt đầu từ 23h, không phải 0h.</strong> Nửa đêm nằm ở <em>giữa</em>{' '}
                  giờ Tý. Vì thế khung 23h–24h của đêm hôm trước, về mặt canh giờ, đã thuộc giờ Tý —
                  chi tiết nhỏ nhưng hay làm lệch một bậc khi tra tay.
                </li>
                <li>
                  <strong>Một canh giờ là cả hai tiếng.</strong> “Làm việc vào giờ Thìn” nghĩa là bất
                  cứ lúc nào trong 7h–9h đều được, không cần canh đúng 8h. Điều này khiến việc chọn
                  giờ dễ thu xếp hơn nhiều người tưởng.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Bảng quy đổi này cố định, không đổi theo ngày. Thứ đổi theo ngày là{' '}
                <em>sao nào rơi vào canh giờ nào</em> — phần đó ở hai mục tiếp theo.
              </p>
            </div>
          ),
        },
        {
          id: 'sao-truc-gio',
          tocLabel: '12 sao trực giờ',
          heading: '12 sao trực giờ: 6 hoàng đạo, 6 hắc đạo',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mỗi canh giờ được xem là do một sao “trực” (cai quản). Vòng gồm đúng{' '}
                <strong>12 sao</strong>: <strong>6 sao lành (hoàng đạo)</strong> và{' '}
                <strong>6 sao dữ (hắc đạo)</strong>. Vì cả 12 sao đều được xếp đúng một lần lên 12
                canh giờ, mỗi ngày luôn có <strong>đúng 6 giờ tốt và 6 giờ cần thận trọng</strong> —
                tỉ lệ này không bao giờ đổi.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    6 sao hoàng đạo — giờ tốt
                  </p>
                  <ul className="mt-3 space-y-3">
                    {HOANG_DAO_STARS.map((s) => (
                      <li key={s.name} className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">{s.name}.</span> {s.meaning}
                        {s.suits ? (
                          <>
                            {' '}
                            <span className="text-foreground/70">Hợp:</span> {s.suits}
                          </>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    6 sao hắc đạo — giờ nên thận trọng
                  </p>
                  <ul className="mt-3 space-y-3">
                    {HAC_DAO_STARS.map((s) => (
                      <li key={s.name} className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">{s.name}.</span> {s.meaning}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Thứ tự vòng sao — cố định, không đổi
              </h3>
              <p>
                Điều quan trọng để hiểu mục sau: 12 sao này{' '}
                <strong>luôn nối tiếp nhau theo một thứ tự bất biến</strong>, 6 lành xen 6 dữ. Ngày
                nào cũng vậy:
              </p>
              <div className="flex flex-wrap gap-2">
                {VONG_12_SAO.map((s, i) => (
                  <span
                    key={s.name}
                    className={[
                      'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm',
                      s.good
                        ? 'border-emerald-500/40 bg-emerald-500/[0.06] text-foreground'
                        : 'border-border bg-card/40 text-muted-foreground',
                    ].join(' ')}
                  >
                    <span aria-hidden="true" className="font-mono text-[11px] text-gold-700">
                      {i + 1}
                    </span>
                    {s.name}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                Hết Câu Trận thì quay lại Thanh Long. Chỉ có <strong>điểm xuất phát</strong> của vòng
                là đổi theo ngày — xem mục kế tiếp. Muốn đọc kỹ từng sao (biểu tượng, việc hợp, gợi ý
                dùng tỉnh táo), xem{' '}
                <Link href="/gio-hoang-dao/y-nghia" className={linkCls}>
                  thư viện ý nghĩa 12 sao giờ
                </Link>
                .
              </p>
              <p className="text-sm text-foreground/70">
                Một lưu ý khi đọc chéo nguồn: sao thứ sáu trong vòng được ghi là{' '}
                <strong>Thiên Đức</strong> ở nơi này và <strong>Bảo Quang</strong> ở nơi khác — cùng
                một sao, hai tên gọi. Dị bản tên gọi kiểu này rất thường gặp trong tư liệu lịch pháp.
              </p>
            </div>
          ),
        },
        {
          id: 'cach-khoi-gio',
          tocLabel: 'Cách khởi giờ',
          heading: 'Cách khởi giờ theo chi ngày — vì sao giờ tốt đổi mỗi ngày',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phần lõi của bài. Vòng 12 sao không đổi thứ tự, nhưng{' '}
                <strong>bắt đầu từ canh giờ nào thì đổi theo địa chi của NGÀY</strong>. Đó là lý do
                bảng giờ tốt hôm nay khác hôm qua.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Bước 1 — Lấy địa chi của ngày</h3>
              <p>
                Mỗi ngày trong lịch âm mang một cặp can – chi (ví dụ ngày Giáp Dần, ngày Bính Thìn). Ở
                bước này ta chỉ cần <strong>chi</strong> (Dần, Thìn…), chưa cần can. Bạn không phải tự
                tính: công cụ suy can chi ngày từ số ngày Julian, còn{' '}
                <Link href="/lich-van-nien" className={linkCls}>Lịch Vạn Niên</Link> cũng hiển thị sẵn
                can chi của từng ngày.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Tra mốc khởi sao Thanh Long
              </h3>
              <p>
                Bài quyết cổ gói toàn bộ quy tắc trong sáu vế:{' '}
                <em>“Dần Thân gia Tý, Mão Dậu Dần, Thìn Tuất Thìn, Tỵ Hợi Ngọ, Tý Ngọ Thân, Sửu Mùi
                Tuất”</em>. Đọc là: ngày mang chi Dần hoặc Thân thì đặt Thanh Long vào giờ Tý; ngày
                chi Mão hoặc Dậu thì đặt vào giờ Dần; và cứ thế.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[460px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Chi của NGÀY
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Khởi Thanh Long tại giờ
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Khung giờ
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Vế trong bài quyết
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {KHOI_THANH_LONG.map((r) => (
                      <tr key={r.chiNgay} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">Ngày {r.chiNgay}</td>
                        <td className="px-4 py-2 text-foreground">Giờ {r.gio}</td>
                        <td className="px-4 py-2 text-muted-foreground">{HOUR_RANGE[r.gio]}</td>
                        <td className="px-4 py-2 text-muted-foreground">“{r.quyet}”</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Chú ý điểm hay vấp: cột đầu là chi của <strong>NGÀY</strong>, cột thứ hai là{' '}
                <strong>GIỜ</strong>. Hai thứ dùng chung bộ 12 tên nên rất dễ đọc nhầm thành “ngày Dần
                thì giờ Dần”.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Rải vòng 12 sao rồi đọc kết quả
              </h3>
              <p>
                Từ canh giờ khởi, đặt lần lượt Thanh Long → Minh Đường → Thiên Hình → Chu Tước → Kim
                Quỹ → Thiên Đức → Bạch Hổ → Ngọc Đường → Thiên Lao → Huyền Vũ → Tư Mệnh → Câu Trận vào
                các canh giờ kế tiếp, hết Hợi thì vòng về Tý. Canh giờ nào nhận được một trong{' '}
                <strong>6 sao hoàng đạo</strong> thì canh đó là <strong>giờ tốt</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Hai ví dụ tra tay, đặt cạnh nhau</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Ví dụ 1 — ngày 8/8/2026</strong> là ngày <strong>Giáp Dần</strong>. Chi ngày
                  là Dần → theo vế “Dần Thân gia Tý”, khởi Thanh Long tại <strong>giờ Tý</strong>.
                </li>
                <li>
                  <strong>Ví dụ 2 — ngày 10/8/2026</strong> là ngày <strong>Bính Thìn</strong>. Chi
                  ngày là Thìn → theo vế “Thìn Tuất Thìn”, khởi Thanh Long tại{' '}
                  <strong>giờ Thìn</strong>. Cả vòng bị đẩy đi bốn bậc so với ví dụ 1.
                </li>
              </ul>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[460px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-3 py-2.5 font-semibold text-foreground">Canh giờ</th>
                      <th scope="col" className="px-3 py-2.5 font-semibold text-foreground">
                        8/8/2026 · ngày Giáp Dần
                      </th>
                      <th scope="col" className="px-3 py-2.5 font-semibold text-foreground">
                        10/8/2026 · ngày Bính Thìn
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SO_SANH.map((r) => (
                      <tr key={r.gio} className="border-b border-border/60 last:border-b-0">
                        <td className="px-3 py-1.5 font-medium text-foreground">
                          {r.gio}{' '}
                          <span className="font-normal text-muted-foreground">
                            ({HOUR_RANGE[r.gio]})
                          </span>
                        </td>
                        <SaoCell name={r.a} good={r.aGood} />
                        <SaoCell name={r.b} good={r.bGood} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Sáu giờ hoàng đạo ngày <strong>8/8/2026</strong>: Tý (23h–1h), Sửu (1h–3h), Thìn
                (7h–9h), Tỵ (9h–11h), Mùi (13h–15h), Tuất (19h–21h). Còn ngày{' '}
                <strong>10/8/2026</strong>: Dần (3h–5h), Thìn (7h–9h), Tỵ (9h–11h), Thân (15h–17h),
                Dậu (17h–19h), Hợi (21h–23h).
              </p>
              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                <p className="font-heading text-sm font-semibold text-foreground">
                  Cùng giờ Tý, hai kết quả trái ngược
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Cùng là khung <strong className="text-foreground">23h–1h</strong>: ngày 8/8/2026 đó
                  là <strong className="text-foreground">Thanh Long</strong> — sao đứng đầu, đại cát;
                  nhưng ngày 10/8/2026 chính khung ấy lại là{' '}
                  <strong className="text-foreground">Thiên Lao</strong> — hắc đạo. Đây là lý do không
                  thể học thuộc “giờ nào tốt” một lần rồi dùng mãi:{' '}
                  <strong className="text-foreground">phải tra theo ngày cụ thể</strong>. Cũng để ý
                  giờ Thìn và giờ Tỵ tình cờ tốt ở cả hai ngày — chuyện trùng khớp bình thường, không
                  phải quy luật.
                </p>
              </div>
              <p className="text-sm text-foreground/70">
                Bạn không cần thuộc bài quyết:{' '}
                <Link href="/gio-hoang-dao" className={linkCls}>công cụ giờ hoàng đạo</Link> tự xác
                định can chi ngày và rải vòng sao khi bạn nhập ngày. Phần này chỉ để bạn hiểu con số ở
                đâu ra, thay vì nhận một kết quả “hộp đen”.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: giờ tốt giúp gì, không giúp gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nói thẳng để không hiểu sai — đây là phần quan trọng nhất của bài, quan trọng hơn cả
                các bảng tra ở trên.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Đây là quy ước phong tục, không có cơ sở thiên văn
              </h3>
              <p>
                12 “sao” trực giờ là <strong>thần sát trong lịch pháp</strong>, không phải thiên thể
                có thật. Không kính thiên văn nào nhìn thấy Thanh Long, và không phép đo nào xác nhận
                nó “đang ở” giờ Tý của ngày Dần. Cách rải vòng sao theo chi ngày là{' '}
                <strong>một quy ước do người xưa đặt ra rồi truyền lại</strong> — chặt chẽ về mặt hệ
                thống (đều đặn, cân bằng, dễ nhớ) nhưng không phải quy luật tự nhiên đo được. Đọc nó
                như <strong>một nét văn hoá đáng trân trọng</strong>, không phải bản dự báo.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Giờ tốt giúp được gì thật</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Một mốc để mọi người cùng có mặt.</strong> Việc lớn thường có nhiều người
                  tham gia; một khung giờ đã thống nhất giúp cả nhà, cả nhóm thu xếp quanh nó.
                </li>
                <li>
                  <strong>Tâm thế bình tĩnh khi bắt đầu.</strong> Cảm giác “mình đã chọn thời điểm tử
                  tế cho việc này” là một giá trị tâm lý có thật, nhất là trước việc hệ trọng.
                </li>
                <li>
                  <strong>Sự tôn trọng phong tục</strong> với người thân lớn tuổi — nhiều gia đình xem
                  giờ chính vì lý do này, và đó là một lý do đẹp.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground">
                Giờ tốt không thay thế sự chuẩn bị
              </h3>
              <p>
                Một hợp đồng đọc kỹ vẫn an toàn hơn hợp đồng ký vội trong giờ Thanh Long. Một chuyến
                đi kiểm tra xe cẩn thận vẫn an toàn hơn chuyến đi khởi hành đúng giờ đẹp. Một cửa hàng
                khai trương giờ Kim Quỹ vẫn cần sản phẩm tốt thì khách mới quay lại.{' '}
                <strong>Phần chuẩn bị mới là phần quyết định</strong>; giờ đẹp là lớp áo, không phải
                phần lõi.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Đừng để lỡ việc vì chờ giờ</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Đừng thức đêm để làm việc “cho đúng giờ đẹp”.</strong> Giờ Tý là 23h–1h —
                  không đáng đánh đổi giấc ngủ và sự tỉnh táo để ký một tờ giấy sớm hơn vài tiếng.
                </li>
                <li>
                  <strong>Đừng dời cả buổi hẹn chỉ vì một khung giờ.</strong> Trong cùng ngày luôn còn
                  5 giờ hoàng đạo khác; hầu như luôn có một khung tiện cho mọi người.
                </li>
                <li>
                  <strong>Nếu cả 6 giờ tốt đều bất tiện, cứ làm vào giờ thuận tiện.</strong> “Giờ xấu”
                  là lời nhắc thận trọng, không phải điều cấm. Bù lại bằng sự cẩn thận thật — đọc kỹ
                  giấy tờ, xác minh thông tin, đi sớm hơn. Đó mới là cách “hoá giải” trong tầm tay, và
                  hieu.asia không bán lễ hoá giải giờ xấu.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Một điều kỹ thuật nhỏ nhưng nên biết: công cụ tính theo{' '}
                <strong>giờ Việt Nam (UTC+7)</strong>, không theo đồng hồ máy của bạn. Nếu bạn đang ở
                múi giờ khác, hãy quy đổi trước khi đối chiếu với lịch làm việc tại chỗ.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <GioHoangDaoWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <GioHoangDaoRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
            <>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="rounded border border-border px-4">
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Muốn biết hôm nay giờ nào tốt?{' '}
                <Link href="/gio-hoang-dao" className={linkCls}>
                  Tra giờ hoàng đạo miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/gio-hoang-dao', label: 'Tra giờ hoàng đạo theo ngày' },
                    { href: '/xem-ngay', label: 'Xem ngày tốt cho việc của bạn' },
                    { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
                    { href: '/xuat-hanh', label: 'Hướng xuất hành' },
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
          children: <GioHoangDaoChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
