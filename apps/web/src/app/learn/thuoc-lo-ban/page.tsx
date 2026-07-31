/**
 * Bài học /learn/thuoc-lo-ban.
 *
 * GROUNDING (mọi dữ kiện đều lấy từ đúng hai nguồn mà công cụ dùng):
 *   1. Trang công cụ — apps/web/src/app/thuoc-lo-ban/page.tsx
 *      → 4 lựa chọn thước (TYPE_OPTIONS: nhãn + gợi ý dùng cho vật gì), luồng
 *        nhập cm → tra cung → hiển thị Tốt/Xấu, "vị trí trong chu kỳ", và gợi ý
 *        kích thước tốt gần nhất nhỏ hơn / lớn hơn.
 *   2. Bộ dữ liệu thật của công cụ — backend repo, file
 *      infra/cloudflare/workers/api-gateway/src/tools/thuoc-lo-ban.ts
 *      → 4 RulerDef (length, label, 8 blocks × 4 subs, fortune, meaning);
 *        lookupAt() lấy phần dư theo chu kỳ, blockSize = length / 8,
 *        subSize = blockSize / 4; fortune = "Tốt" CHỈ KHI cả cung lẫn ô con đều
 *        "Tốt"; findNearestGood() dò theo bước 0.1 cm, tối đa 1000 bước mỗi phía
 *        và chỉ chạy khi kết quả là "Xấu".
 *
 * Bảng RULERS bên dưới CHÉP ĐÚNG tên cung, tên ô con, tính chất và ý nghĩa từ
 * nguồn (2) — không diễn giải lại, không thêm cung nào. Các mốc cm trong bảng
 * được TÍNH từ length nên luôn khớp thuật toán, không gõ tay.
 *
 * Mọi ví dụ số trong bài đã chạy lại bằng đúng thuật toán trên trước khi viết.
 *
 * Phạm vi: bài này chỉ nói về KÍCH THƯỚC. Hướng nhà / cung phi (Bát Trạch), phi
 * tinh (/learn/huyen-khong-phi-tinh), chọn ngày (/learn/trach-cat) và ngũ hành màu
 * sắc (/mau-xe-hop-menh) chỉ được nhắc tên + link, không giải thích cơ chế.
 *
 * (Ghi chú cũ đã xử lý: bài viết lúc /learn/bat-trach chưa tồn tại nên tạm trỏ về
 * /learn/phong-thuy; bài Bát Trạch nay đã có nên 2 link đó đã chuyển sang route đúng.)
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
  LoBanFrame,
  LoBanDepth,
  LoBanRecall,
  LoBanChecklist,
  LoBanWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Thước Lỗ Ban — 4 loại thước và các cung tốt xấu',
  description:
    'Thước Lỗ Ban: 4 loại thước (42.9, 38.8, 52.2, Đinh Lan 38.4 cm), 8 cung tốt – xấu, cách đo thông thuỷ hay phủ bì và cách đọc kết quả.',
  alternates: { canonical: 'https://hieu.asia/learn/thuoc-lo-ban' },
};

type Fortune = 'Tốt' | 'Xấu';

interface Cung {
  name: string;
  fortune: Fortune;
  /** 4 ô con, đúng thứ tự trong nguồn. Trong bộ dữ liệu công cụ, cả 4 ô con
   *  luôn mang cùng tính chất Tốt/Xấu với cung mẹ. */
  subs: string[];
  meaning: string;
}

interface Ruler {
  key: string;
  /** Nhãn trong ô chọn "Loại thước" của công cụ. */
  pickerLabel: string;
  /** Gợi ý dùng cho vật gì, chép từ ô chọn của công cụ. */
  hint: string;
  length: number;
  blocks: Cung[];
}

// CHÉP ĐÚNG từ backend/.../tools/thuoc-lo-ban.ts (LO_BAN_42_9, LO_BAN_38_8,
// THUOC_BAN_52_2, DINH_LAN) + nhãn/hint từ TYPE_OPTIONS của trang công cụ.
const RULERS: Ruler[] = [
  {
    key: 'lo_ban_42_9',
    pickerLabel: 'Lỗ Ban 42.9 cm',
    hint: 'Thông thủy — cửa, cổng, bàn thờ',
    length: 42.9,
    blocks: [
      { name: 'Quý Nhân', fortune: 'Tốt', subs: ['Quyền lộc', 'Trung tín', 'Tác quan', 'Phát đạt'],
        meaning: 'Quý nhân phù trợ, được giúp đỡ, gặp may mắn trong công việc và quan hệ.' },
      { name: 'Hiểm Họa', fortune: 'Xấu', subs: ['Án sát', 'Hồi lộc', 'Quan quỷ', 'Thất tài'],
        meaning: 'Tai họa, rủi ro, bệnh tật ập đến. Tránh dùng kích thước trong cung này.' },
      { name: 'Thiên Tai', fortune: 'Xấu', subs: ['Hỉ sự', 'Hoạnh tài', 'Quan tước', 'Quan lộc'],
        meaning: 'Thiên tai bất ngờ, tai bay vạ gió, kiện tụng. Cần tránh.' },
      { name: 'Thiên Tài', fortune: 'Tốt', subs: ['Thi thư', 'Văn học', 'Thanh quý', 'Tác lộc'],
        meaning: 'Tài lộc do trời ban. Hợp dùng cho cửa chính, két sắt, bàn thờ.' },
      { name: 'Nhân Lộc', fortune: 'Tốt', subs: ['Trí tôn', 'Phú quý', 'Tiến bảo', 'Thập thiện'],
        meaning: 'Phước lộc nhờ người, gia đạo viên mãn, con cháu hiếu thảo. Hợp cho phòng khách.' },
      { name: 'Cô Độc', fortune: 'Xấu', subs: ['Bãi tuyệt', 'Vô tự', 'Ly hương', 'Tài thất'],
        meaning: 'Cô độc, ly tán gia đình, ly hôn. Tuyệt đối tránh ở phòng ngủ, cửa chính.' },
      { name: 'Thiên Tặc', fortune: 'Xấu', subs: ['Tai chí', 'Tử tuyệt', 'Bệnh lâm', 'Khẩu thiệt'],
        meaning: 'Trộm cắp, mất của, gặp tiểu nhân hãm hại. Tránh dùng cho két, cửa chính.' },
      { name: 'Tể Tướng', fortune: 'Tốt', subs: ['Đăng khoa', 'Kim ngọc', 'Quý tử', 'Đại cát'],
        meaning: 'Đại quý, được làm quan lớn, danh tiếng vang xa. Hợp cho cửa chính nhà công sở.' },
    ],
  },
  {
    key: 'lo_ban_38_8',
    pickerLabel: 'Lỗ Ban 38.8 cm',
    hint: 'Dương trạch — đồ vật, giường, tủ',
    length: 38.8,
    blocks: [
      { name: 'Tài', fortune: 'Tốt', subs: ['Tài đức', 'Bảo khố', 'Lục hợp', 'Nghênh phúc'],
        meaning: 'Tài lộc, thịnh vượng. Hợp cho bàn làm việc, két sắt.' },
      { name: 'Bệnh', fortune: 'Xấu', subs: ['Thoái tài', 'Công sự', 'Lao chấp', 'Cô quả'],
        meaning: 'Bệnh tật, ốm đau, đen đủi. Tránh ở phòng ngủ, giường.' },
      { name: 'Ly', fortune: 'Xấu', subs: ['Trường khố', 'Khẩu thiệt', 'Quan quỷ', 'Thất thoát'],
        meaning: 'Ly tán, xa cách, gia đạo bất ổn. Tránh dùng cho cửa, giường.' },
      { name: 'Nghĩa', fortune: 'Tốt', subs: ['Thêm con', 'Ích lợi', 'Quý tử', 'Đại cát'],
        meaning: 'Nghĩa khí, hợp tác tốt, được trợ giúp. Hợp cho bàn thờ, phòng họp.' },
      { name: 'Quan', fortune: 'Tốt', subs: ['Thuận khoa', 'Hoạnh tài', 'Tấn ích', 'Phú quý'],
        meaning: 'Công danh, sự nghiệp thăng tiến. Hợp cho bàn làm việc, văn phòng.' },
      { name: 'Kiếp', fortune: 'Xấu', subs: ['Tử biệt', 'Thoái khẩu', 'Ly hương', 'Tài thất'],
        meaning: 'Cướp bóc, mất mát, gặp tai họa. Tránh dùng cho két, cửa chính.' },
      { name: 'Hại', fortune: 'Xấu', subs: ['Tai chí', 'Tử tuyệt', 'Bệnh lâm', 'Khẩu thiệt'],
        meaning: 'Tai hại, đau ốm, gặp họa. Tránh dùng cho giường, bàn ăn.' },
      { name: 'Bản', fortune: 'Tốt', subs: ['Tài chí', 'Đăng khoa', 'Tiến bảo', 'Hưng vượng'],
        meaning: 'Bản mệnh, vững vàng, gốc rễ chắc. Hợp cho cửa chính, giường ngủ.' },
    ],
  },
  {
    key: 'thuoc_ban_52_2',
    pickerLabel: 'Thước Ban 52.2 cm',
    hint: 'Âm trạch — mộ phần',
    length: 52.2,
    blocks: [
      { name: 'Đinh', fortune: 'Tốt', subs: ['Phúc tinh', 'Cập đệ', 'Tài vượng', 'Đăng khoa'],
        meaning: 'Đinh tài, con cháu đông đúc. Hợp cho cải táng, mộ phần.' },
      { name: 'Hại', fortune: 'Xấu', subs: ['Khẩu thiệt', 'Bệnh lâm', 'Tử tuyệt', 'Họa chí'],
        meaning: 'Tai hại, con cháu đoản mệnh. Tránh tuyệt đối.' },
      { name: 'Vượng', fortune: 'Tốt', subs: ['Thiên đức', 'Hỉ sự', 'Tiến bảo', 'Nạp phúc'],
        meaning: 'Hưng vượng, con cháu phát đạt. Hợp cho mộ phần tổ tiên.' },
      { name: 'Khổ', fortune: 'Xấu', subs: ['Thất thoát', 'Quan quỷ', 'Kiếp tài', 'Vô tự'],
        meaning: 'Khổ đau, con cháu chìm trong nghèo khó. Tránh.' },
      { name: 'Nghĩa', fortune: 'Tốt', subs: ['Đại cát', 'Tài vượng', 'Lợi ích', 'Thiên khố'],
        meaning: 'Nghĩa khí, con cháu hiếu thảo. Hợp cho bàn thờ.' },
      { name: 'Quan', fortune: 'Tốt', subs: ['Phú quý', 'Tấn bảo', 'Hoạnh tài', 'Thuận khoa'],
        meaning: 'Công danh con cháu, có quan lộc. Hợp cho mộ phần.' },
      { name: 'Tử', fortune: 'Xấu', subs: ['Ly hương', 'Tử biệt', 'Thoái đinh', 'Thất thoát'],
        meaning: 'Tử khí, con cháu đoản mệnh, gia đạo lụi. Tránh tuyệt đối.' },
      { name: 'Hưng', fortune: 'Tốt', subs: ['Đăng khoa', 'Quý tử', 'Tài chí', 'Hưng vượng'],
        meaning: 'Hưng thịnh, gia đạo vĩnh viễn phát triển. Hợp cho mộ phần đại tự.' },
    ],
  },
  {
    key: 'dinh_lan',
    pickerLabel: 'Thước Đinh Lan 38.4 cm',
    hint: 'Quan tài, mộ phần',
    length: 38.4,
    blocks: [
      { name: 'Đinh', fortune: 'Tốt', subs: ['Phúc tinh', 'Cập đệ', 'Tài vượng', 'Đăng khoa'],
        meaning: 'Đinh tài, con cháu đông. Hợp cho quan tài.' },
      { name: 'Hại', fortune: 'Xấu', subs: ['Khẩu thiệt', 'Bệnh lâm', 'Tử tuyệt', 'Họa chí'],
        meaning: 'Tai họa con cháu. Tránh.' },
      { name: 'Vượng', fortune: 'Tốt', subs: ['Thiên đức', 'Hỉ sự', 'Tiến bảo', 'Nạp phúc'],
        meaning: 'Hưng vượng. Hợp cho quan tài tổ tiên.' },
      { name: 'Khổ', fortune: 'Xấu', subs: ['Thất thoát', 'Quan quỷ', 'Kiếp tài', 'Vô tự'],
        meaning: 'Con cháu khổ đau, nghèo khó. Tránh.' },
      { name: 'Nghĩa', fortune: 'Tốt', subs: ['Đại cát', 'Tài vượng', 'Lợi ích', 'Thiên khố'],
        meaning: 'Nghĩa khí, hiếu thảo. Hợp cho quan tài.' },
      { name: 'Quan', fortune: 'Tốt', subs: ['Phú quý', 'Tấn bảo', 'Hoạnh tài', 'Thuận khoa'],
        meaning: 'Con cháu có quan lộc. Hợp cho quan tài.' },
      { name: 'Tử', fortune: 'Xấu', subs: ['Ly hương', 'Tử biệt', 'Thoái đinh', 'Thất thoát'],
        meaning: 'Tử khí, gia đạo lụi. Tránh tuyệt đối.' },
      { name: 'Hưng', fortune: 'Tốt', subs: ['Đăng khoa', 'Quý tử', 'Tài chí', 'Hưng vượng'],
        meaning: 'Hưng thịnh, gia đạo phát triển. Hợp cho quan tài đại tự.' },
    ],
  },
];

/** Bỏ số 0 thừa ở đuôi để bảng đọc được (5.3625 giữ nguyên, 4.8000 → 4.8). */
function fmt(n: number, digits = 4): string {
  return String(Number(n.toFixed(digits)));
}

function goodCount(r: Ruler): number {
  return r.blocks.filter((b) => b.fortune === 'Tốt').length;
}

function FortuneTag({ fortune }: { fortune: Fortune }) {
  const good = fortune === 'Tốt';
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        good
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
          : 'border-rose-500/40 bg-rose-500/10 text-rose-400'
      }`}
    >
      {fortune}
    </span>
  );
}

/** Hàng tiêu đề dùng chung cho mọi bảng trong bài. */
function THead({ cols }: { cols: string[] }) {
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

const MONO_CELL = 'whitespace-nowrap px-4 py-2 font-mono text-xs text-muted-foreground';

/** Bảng 8 cung của một cây thước. Mốc cm tính từ length nên luôn khớp công cụ. */
function CungTable({ ruler }: { ruler: Ruler }) {
  const blockSize = ruler.length / 8;
  const good = goodCount(ruler);
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <caption className="px-4 pt-3 text-left text-sm font-semibold text-foreground">
          {ruler.pickerLabel} — 8 cung ({good} tốt / {8 - good} xấu)
        </caption>
        <THead cols={['Cung', 'Tính chất', 'Đoạn trong chu kỳ', '4 ô con', 'Ý nghĩa theo công cụ']} />
        <tbody>
          {ruler.blocks.map((b, i) => (
            <tr key={b.name} className="border-b border-border/60 last:border-b-0 align-top">
              <td className="px-4 py-2 font-medium text-foreground">{b.name}</td>
              <td className="px-4 py-2"><FortuneTag fortune={b.fortune} /></td>
              <td className={MONO_CELL}>
                {fmt(i * blockSize)} – {fmt((i + 1) * blockSize)} cm
              </td>
              <td className="px-4 py-2 text-muted-foreground">{b.subs.join(' · ')}</td>
              <td className="px-4 py-2 text-muted-foreground">{b.meaning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking).
const FAQS = [
  {
    // Câu hỏi ở đây phải KHÁC câu trên trang công cụ /thuoc-lo-ban: hai trang cùng
    // phát FAQPage JSON-LD, hỏi trùng chữ mà trả lời khác nhau là tự cạnh tranh
    // trên cùng một truy vấn. Trang công cụ giữ câu ngắn "Thước Lỗ Ban là gì?",
    // bài Học hỏi sâu hơn một tầng.
    q: 'Thước Lỗ Ban đo cái gì mà thước xây dựng không đo được?',
    a: 'Không đo thêm chiều dài nào cả — nó đọc chính con số bạn vừa đo theo một thang khác. Thước xây dựng trả lời "bao nhiêu centimet"; thước Lỗ Ban chia chiều dài đó thành các cung Tốt – Xấu và trả lời "con số này rơi vào cung nào". Đây là quy ước truyền thống của nghề mộc, mang tính tham khảo — không phải định luật và cũng không phải tiêu chuẩn xây dựng.',
  },
  {
    q: 'Vì sao có nhiều loại thước Lỗ Ban với chiều dài khác nhau?',
    a: 'Vì mỗi loại lập cho một đối tượng đo khác nhau: thước 42.9 cm (thông thủy) cho khoảng trống như cửa, cổng, bàn thờ; thước 38.8 cm (dương trạch) cho đồ vật như giường, tủ, bàn; thước Ban 52.2 cm và thước Đinh Lan 38.4 cm dùng cho âm trạch (mộ phần, quan tài). Chọn đúng loại thước theo vật cần đo mới ra kết quả phù hợp.',
  },
  {
    q: 'Vì sao cùng một kích thước lại tốt ở thước này mà xấu ở thước kia?',
    a: 'Vì kết quả không đọc từ con số thô mà từ phần dư của con số đó trong chu kỳ cây thước. Chiều rộng 90 cm để lại 4.2 cm trên thước 42.9 cm (rơi vào cung Quý Nhân — tốt), nhưng để lại 12.4 cm trên thước 38.8 cm (rơi vào cung Ly — xấu). Nói cách khác, tốt hay xấu là thuộc tính của cặp kích thước và cây thước, không phải của riêng kích thước.',
  },
  {
    q: 'Đo thông thủy hay đo phủ bì?',
    a: 'Với cửa, cổng (thước thông thủy 42.9 cm) thường đo khoảng thông thủy — tức lọt lòng, phần trống ánh sáng đi qua, không tính bề dày khuôn. Với đồ vật (thước dương trạch 38.8 cm) đo kích thước phủ bì của vật, tính cả khung viền. Đo đúng quy ước của từng loại thước thì kết quả mới chuẩn.',
  },
  {
    q: 'Mỗi cung chia thành 4 ô con, ô con có lật ngược được kết quả không?',
    a: 'Công cụ kết luận Tốt chỉ khi cả cung lớn lẫn ô con đều tốt. Trong bộ dữ liệu công cụ đang dùng, cả 4 ô con của một cung luôn cùng tính chất với cung mẹ, nên trên thực tế cung lớn quyết định. Lưu ý tên ô con không suy ra tốt xấu: cung Thiên Tai của thước 42.9 cm là cung xấu nhưng bốn ô con lại tên là Hỉ sự, Hoạnh tài, Quan tước, Quan lộc.',
  },
  {
    q: 'Đã lỡ làm cửa rơi vào cung xấu thì xử lý thế nào?',
    a: 'Đây chỉ là một yếu tố tham khảo theo phong tục, không phải điều bắt buộc. Nếu còn dễ chỉnh, bạn có thể nhích sang kích thước tốt gần nhất cho an tâm; nếu không, công năng và sự chắc chắn của vật dụng vẫn là điều quan trọng hơn cả. Không nên phá đi làm lại chỉ vì lệch một hai centimet.',
  },
  {
    q: 'Vì sao mỗi nơi ghi chiều dài thước hơi khác nhau?',
    a: 'Vì các xưởng và sách truyền lại những bộ số hơi lệch nhau (ví dụ 42.9 so với 43 cm), và cách chia ô con cũng có dị bản. Cùng một kích thước vì thế có thể ra cung khác ở nguồn khác. Công cụ của hieu.asia chốt theo một bộ số đã cấu hình và tra nhất quán theo bộ đó, nên hãy đọc kết quả như theo bộ thước này thay vì tranh cãi vài milimet.',
  },
  {
    q: 'Thước Lỗ Ban có nói gì về hướng nhà hay ngày động thổ không?',
    a: 'Không. Thước Lỗ Ban chỉ nói về kích thước. Hướng nhà và cung phi thuộc Bát Trạch, lớp thời gian thuộc Huyền Không Phi Tinh, còn chọn ngày giờ thuộc Trạch Cát — đó là các hệ riêng, có cách tính riêng và kết quả của hệ này không suy ra hệ kia.',
  },
];

const JSONLD = [
  article({
    headline: 'Thước Lỗ Ban: bốn loại thước, các cung tốt – xấu và cách đo đúng',
    description:
      'Thước Lỗ Ban có nhiều loại với chiều dài khác nhau: 42.9 cm thông thủy, 38.8 cm dương trạch, 52.2 cm và Đinh Lan 38.4 cm cho âm trạch. Bài học giải thích 8 cung tốt – xấu, cách đo thông thủy hay phủ bì, và vì sao cùng một kích thước lại tốt ở thước này mà xấu ở thước kia.',
    url: '/learn/thuoc-lo-ban',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Thước Lỗ Ban', url: '/learn/thuoc-lo-ban' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Thước Lỗ Ban — 4 loại thước và các cung tốt xấu',
    description:
      'Thước Lỗ Ban: 4 loại thước (42.9, 38.8, 52.2, Đinh Lan 38.4 cm), 8 cung tốt – xấu, cách đo thông thuỷ hay phủ bì và cách đọc kết quả.',
    url: '/learn/thuoc-lo-ban',
  }),
];

export default function LearnThuocLoBanPage() {
  return (
    <LearnArticle
      eyebrow="PHONG THỦY · NGHỀ MỘC"
      title={
        <>
          Thước{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">Lỗ Ban</span>
        </>
      }
      standfirst={
        <>
          Thước Lỗ Ban không phải một cây thước, mà là bốn — mỗi cây một chiều dài, một bộ cung, một
          loại vật để đo. Hiểu đúng bốn cây thước đó là hết sạch mọi tranh cãi kiểu “sao thợ nói tốt
          mà cửa hàng nói xấu”.
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Thước Lỗ Ban' },
      ]}
      relatedLenses={relatedLearnLenses('thuoc-lo-ban')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập kích thước (cm) và chọn loại thước, công cụ tra cung Tốt / Xấu, ô con, ý nghĩa, và nếu xấu thì gợi ý kích thước tốt gần nhất nhỏ hơn hoặc lớn hơn.',
        href: '/thuoc-lo-ban',
        label: 'Tra thước Lỗ Ban',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <LoBanFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Thước Lỗ Ban là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Thước Lỗ Ban là <strong>cây thước phong thủy của nghề mộc cổ truyền</strong>. Trên
                thân thước, chiều dài được chia thành các cung mang nhãn <strong>Tốt</strong> hoặc{' '}
                <strong>Xấu</strong>; khi đóng cửa, đóng giường hay làm bàn thờ, thợ cố chọn kích
                thước rơi vào cung tốt. Đó là toàn bộ ý tưởng — đơn giản hơn nhiều so với tiếng đồn.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu, vì đây là chỗ hay bị thổi phồng:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Thước Lỗ Ban là <strong>quy ước nghề nghiệp được truyền lại</strong>, mang tính tham
                  khảo — không phải định luật vật lý, không phải tiêu chuẩn xây dựng, và không thay
                  thế yêu cầu kỹ thuật của công trình.
                </li>
                <li>
                  Nó chỉ nói về <strong>kích thước</strong>. Nó không nói gì về hướng nhà, về vận khí
                  theo thời gian, hay về ngày giờ tốt để làm — đó là những hệ khác hoàn toàn.
                </li>
                <li>
                  Kết quả “xấu” <strong>không phải một lời cảnh báo về an toàn</strong>. Một kích thước
                  rơi cung xấu vẫn có thể là kích thước chắc chắn, đúng chuẩn, dùng tốt cả đời.
                </li>
              </ul>
              <p>
                Ba hệ hay bị gộp chung với thước Lỗ Ban, nhưng có cách tính riêng và không suy ra nhau:{' '}
                <Link href="/learn/bat-trach" className="text-gold-700 underline-offset-4 hover:underline">
                  Bát Trạch (hướng nhà, cung phi)
                </Link>
                ,{' '}
                <Link
                  href="/learn/huyen-khong-phi-tinh"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Huyền Không Phi Tinh
                </Link>{' '}
                và{' '}
                <Link href="/learn/trach-cat" className="text-gold-700 underline-offset-4 hover:underline">
                  Trạch Cát (chọn ngày giờ)
                </Link>
                . Bài này không đụng tới cơ chế của chúng.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <LoBanDepth />,
        },
        {
          id: 'cac-loai-thuoc',
          tocLabel: 'Bốn loại thước',
          heading: 'Bốn loại thước: chiều dài khác nhau vì đo thứ khác nhau',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là điểm gây nhầm nhiều nhất: <strong>không có “cây thước Lỗ Ban”</strong> ở số ít.
                Công cụ của hieu.asia dùng bốn cây, mỗi cây một chu kỳ riêng và một mục đích riêng.
                Chọn sai cây thước thì kết quả đúng cũng vô nghĩa.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <THead cols={['Loại thước', 'Chu kỳ', 'Mỗi cung', 'Mỗi ô con', 'Dùng để đo gì']} />
                  <tbody>
                    {RULERS.map((r) => (
                      <tr key={r.key} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">{r.pickerLabel}</td>
                        <td className={MONO_CELL}>{fmt(r.length)} cm</td>
                        <td className={MONO_CELL}>{fmt(r.length / 8)} cm</td>
                        <td className={MONO_CELL}>{fmt(r.length / 32, 6)} cm</td>
                        <td className="px-4 py-2 text-muted-foreground">{r.hint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Cấu trúc bốn cây giống hệt nhau: mỗi chu kỳ chia làm <strong>8 cung đều nhau</strong>{' '}
                (mỗi cung = chu kỳ ÷ 8), và mỗi cung lại chia làm <strong>4 ô con đều nhau</strong>{' '}
                (mỗi ô = cung ÷ 4). Khác nhau ở ba chỗ: chiều dài chu kỳ, bộ tên cung, và vì thế là các
                mốc centimet.
              </p>
              <p>
                Cách chọn thực dụng cho nhà ở: <strong>đo khoảng trống thì lấy thước 42.9 cm</strong>{' '}
                (cửa, cổng, bàn thờ — phần trống lọt lòng), <strong>đo vật thì lấy thước 38.8 cm</strong>{' '}
                (giường, tủ, bàn). Hai cây còn lại — thước Ban 52.2 cm và thước Đinh Lan 38.4 cm — dành
                cho phần âm trạch: mộ phần, quan tài. Đừng dùng chúng cho đồ trong nhà ở.
              </p>
              <p className="text-sm text-foreground/70">
                Lưu ý về độ mịn: trên thước 42.9 cm mỗi ô con chỉ rộng {fmt(42.9 / 32, 6)} cm, trên
                thước 38.8 cm là {fmt(38.8 / 32, 6)} cm. Nghĩa là phép đo của bạn phải chính xác hơn
                một centimet thì kết quả ô con mới có nghĩa — đo bằng thước dây võng hay đo lúc chưa
                hoàn thiện bề mặt đều đủ để lệch sang ô khác.
              </p>
            </div>
          ),
        },
        {
          id: 'cung-tot-xau',
          tocLabel: 'Các cung tốt – xấu',
          heading: 'Các cung trên từng cây thước và ý nghĩa',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <p>
                Bảng dưới đây chép đúng bộ cung mà công cụ dùng, kèm mốc centimet của từng cung{' '}
                <strong>tính trong một chu kỳ</strong> (không phải kích thước thật — kích thước thật
                phải lấy phần dư trước, xem mục sau). Cột ý nghĩa là mô tả công cụ trả về cho cung đó.
              </p>
              <p>
                Quy tắc kết luận của công cụ: kết quả là <strong>Tốt</strong> chỉ khi{' '}
                <strong>cả cung lớn lẫn ô con</strong> đều tốt. Trong bộ dữ liệu này, bốn ô con của một
                cung luôn cùng tính chất với cung mẹ, nên cung lớn là thứ quyết định, còn ô con nói rõ
                sắc thái.
              </p>

              {RULERS.slice(0, 2).map((r) => (
                <CungTable key={r.key} ruler={r} />
              ))}

              <p>
                Hai cây thước dương trạch ở trên chia đều <strong>4 cung tốt và 4 cung xấu</strong>,
                xếp xen kẽ theo cụm. Hai cây âm trạch dưới đây dùng chung một bộ tên cung (Đinh, Hại,
                Vượng, Khổ, Nghĩa, Quan, Tử, Hưng) nhưng{' '}
                <strong>chu kỳ khác nhau nên mốc centimet khác nhau</strong> — cùng một kích thước vẫn
                có thể ra hai cung khác nhau giữa chúng.
              </p>

              {RULERS.slice(2).map((r) => (
                <CungTable key={r.key} ruler={r} />
              ))}

              <p className="text-sm text-foreground/70">
                Một cái bẫy khi đọc bảng: <strong>tên ô con không suy ra được tốt hay xấu</strong>. Cung
                Thiên Tai của thước 42.9 cm là cung xấu, nhưng bốn ô con của nó tên là Hỉ sự, Hoạnh
                tài, Quan tước, Quan lộc — toàn chữ nghe thuận tai. Luôn đọc nhãn Tốt/Xấu trước, tên
                sau.
              </p>
            </div>
          ),
        },
        {
          id: 'cach-do-dung',
          tocLabel: 'Cách đo đúng',
          heading: 'Cách đo đúng và cách đọc kết quả',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">Bước 1 — Xác định bạn đang đo gì</h3>
              <p>
                Khoảng trống (cửa, cổng, bàn thờ) hay vật thể (giường, tủ, bàn)? Câu trả lời quyết định
                cây thước, và cây thước quyết định kết quả. Đây là bước quan trọng nhất, không phải bước
                nhập số.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Đo theo đúng quy ước của cây thước đó
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Thước 42.9 cm (thông thuỷ)</strong>: đo <strong>lọt lòng</strong> — phần trống
                  thật sự, từ mép trong khuôn bên này sang mép trong khuôn bên kia, không tính bề dày
                  khuôn.
                </li>
                <li>
                  <strong>Thước 38.8 cm (dương trạch)</strong>: đo <strong>phủ bì</strong> — trọn vật,
                  tính cả khung viền.
                </li>
              </ul>
              <p>
                Đo phủ bì rồi tra bằng thước thông thuỷ (hoặc ngược lại) là lỗi phổ biến nhất — và công
                cụ không thể phát hiện giúp bạn, vì nó chỉ nhận được một con số.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Đo từng chiều một, đơn vị centimet
              </h3>
              <p>
                Một cánh cửa có chiều rộng và chiều cao khác nhau, nên hai chiều có hai phần dư khác
                nhau và hoàn toàn có thể rộng thì tốt mà cao thì xấu. Tra riêng từng chiều. Công cụ nhận
                số lẻ tới <strong>0.1 cm</strong>, nên đừng làm tròn về số chẵn trước khi nhập.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 4 — Đọc kết quả theo đúng thứ tự
              </h3>
              <p>
                Đọc <strong>nhãn Tốt/Xấu</strong> trước, rồi tên cung, rồi tên ô con. Dòng “vị trí trong
                chu kỳ” cho biết phần dư của kích thước — chính con số đã quyết định kết quả. Nếu kết quả
                là Xấu, công cụ đưa thêm <strong>kích thước tốt gần nhất nhỏ hơn và lớn hơn</strong>; hai
                gợi ý này chỉ xuất hiện khi kết quả xấu.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ví dụ 1 — Cửa chính rộng 81 cm</h3>
              <p>
                Cửa là khoảng thông thuỷ nên chọn thước <strong>42.9 cm</strong>. Cây thước đặt được 1
                lần, còn thừa 81 − 42.9 = <strong>38.1 cm</strong>. Tra bảng ở trên: 38.1 cm nằm trong
                đoạn 37.5375 – 42.9 cm, tức cung <strong>Tể Tướng</strong> (cung tốt), và rơi vào ô con
                đầu tiên là <strong>Đăng khoa</strong>. Kết quả: <strong>Tốt</strong>. Vì cả cung lẫn ô
                con đều tốt nên không có gợi ý điều chỉnh nào — đó là dấu hiệu bạn đã ở kích thước ổn.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ví dụ 2 — Cửa chính cao 212 cm</h3>
              <p>
                Vẫn thước <strong>42.9 cm</strong>, nhưng lần này chiều cao. Đặt được 4 lần (4 × 42.9 =
                171.6 cm), còn thừa <strong>40.4 cm</strong>. Con số này vẫn nằm trong cung{' '}
                <strong>Tể Tướng</strong>, nhưng lùi sâu hơn nên rơi vào ô con thứ ba là{' '}
                <strong>Quý tử</strong>. Kết quả: <strong>Tốt</strong>. Hai ví dụ này cho thấy vì sao bộ
                số đẹp của thợ hay lặp lại theo bước đúng bằng chu kỳ cây thước.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ví dụ 3 — Cửa rộng 100 cm: khi kết quả là Xấu
              </h3>
              <p>
                Thước <strong>42.9 cm</strong>, phần dư là 100 − 42.9 × 2 = <strong>14.2 cm</strong>, rơi
                vào đoạn 10.725 – 16.0875 cm tức cung <strong>Thiên Tai</strong> (cung xấu), ô con{' '}
                <strong>Quan tước</strong>. Kết quả: <strong>Xấu</strong> — dù cái tên “Quan tước” nghe
                rất được. Công cụ gợi ý hai kích thước tốt gần nhất: <strong>91.1 cm</strong> (Quý Nhân ·
                Phát đạt) nếu thu vào, hoặc <strong>101.9 cm</strong> (Thiên Tài · Thi thư) nếu nới ra.
                Ở đây nới ra 1.9 cm rõ ràng dễ hơn thu vào gần 9 cm — hãy chọn theo phía ít ảnh hưởng
                công năng nhất.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ví dụ 4 — Vì sao 90 cm vừa tốt vừa xấu
              </h3>
              <p>
                Cùng chiều rộng 90 cm. Trên thước <strong>42.9 cm</strong>: phần dư 90 − 42.9 × 2 = 4.2
                cm → cung <strong>Quý Nhân</strong>, ô con <strong>Phát đạt</strong> → <strong>Tốt</strong>
                . Trên thước <strong>38.8 cm</strong>: phần dư 90 − 38.8 × 2 = 12.4 cm → cung{' '}
                <strong>Ly</strong>, ô con <strong>Quan quỷ</strong> → <strong>Xấu</strong>. Không cây nào
                sai cả: 90 cm là cửa thì tra thước 42.9 cm, là chiều dài mặt bàn thì tra thước 38.8 cm.
                Chiều ngược lại cũng có: 120 cm là Xấu trên thước 42.9 cm (cung Thiên Tặc) nhưng Tốt trên
                thước 38.8 cm (cung Tài).
              </p>
              <p className="text-sm text-foreground/70">
                Vì thế, chọn cây thước theo kết quả mình muốn nghe là cách nhanh nhất để bộ số mất hết ý
                nghĩa. Chọn thước theo vật đo, rồi chấp nhận kết quả của nó.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: đọc tới đây rồi thì bớt lo được nhiều',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Các trường phái ghi chiều dài thước hơi khác nhau
              </h3>
              <p>
                Các xưởng và sách truyền lại những bộ số lệch nhau đôi chút — ví dụ{' '}
                <strong>42.9 so với 43 cm</strong> — và cách chia ô con cũng có dị bản. Hệ quả: cùng một
                kích thước có thể ra cung khác ở nguồn khác, nhất là khi nó nằm sát biên giữa hai cung.
                Công cụ chốt theo một bộ số đã cấu hình và tra nhất quán theo bộ đó. Hãy đọc kết quả như{' '}
                <strong>“theo bộ thước này”</strong>, đừng biến chênh lệch vài milimet thành tranh cãi
                đúng sai.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Kích thước công năng phải đứng trước kích thước phong thuỷ
              </h3>
              <p>
                Thứ tự này không đảo được. Cửa phải đủ rộng để người và đồ đạc đi lọt, đủ để khiêng tủ
                lạnh vào, đủ để thoát hiểm khi có sự cố; giường phải vừa người nằm; bậc thang phải an
                toàn khi bước. Những yêu cầu đó có hậu quả thật và tức thì. Cung Lỗ Ban thì không —{' '}
                <strong>nó là một cái nhãn đặt cho đoạn thước</strong>. Khi hai thứ mâu thuẫn, công năng
                thắng, không cần đắn đo.
              </p>
              <p>
                Cách dùng lành mạnh nhất: chọn xong vài phương án <strong>đều đạt về công năng</strong>,
                rồi mới lấy thước Lỗ Ban làm tiêu chí phụ để chốt một trong số đó.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Đừng phá cửa vì lệch một centimet
              </h3>
              <p>
                Kích thước tốt gần nhất thường chỉ cách vài centimet, nên nếu còn đang ở khâu đặt hàng
                thì chỉnh rất dễ. Nhưng nếu cửa đã lắp, giường đã đóng xong, đo lại thấy lệch sang cung
                xấu — <strong>ghi nhận rồi thôi</strong>. Đập đi làm lại là đánh đổi chi phí, thời gian
                và đôi khi cả kết cấu, để lấy một quy ước tham khảo. Không cân xứng.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ba giới hạn kỹ thuật khác</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Độ chính xác của phép đo phải nhỏ hơn ô con.</strong> Ô con chỉ rộng khoảng
                  1.2 – 1.7 cm tuỳ thước, nên đo cẩu thả là kết quả ô con mất nghĩa dù màn hình vẫn hiện
                  một câu trả lời trông rất chắc chắn.
                </li>
                <li>
                  <strong>Công cụ chỉ tra một chiều mỗi lần.</strong> Một vật có nhiều chiều; tra đủ từng
                  chiều rồi hãy kết luận, và đừng ngạc nhiên khi chiều này tốt chiều kia xấu.
                </li>
                <li>
                  <strong>Thước Lỗ Ban không nói gì ngoài kích thước.</strong> Hướng nhà và cung phi (
                  <Link href="/learn/bat-trach" className="text-gold-700 underline-offset-4 hover:underline">
                    Bát Trạch
                  </Link>
                  ), lớp thời gian (
                  <Link
                    href="/learn/huyen-khong-phi-tinh"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    Huyền Không Phi Tinh
                  </Link>
                  ), chọn ngày giờ (
                  <Link href="/learn/trach-cat" className="text-gold-700 underline-offset-4 hover:underline">
                    Trạch Cát
                  </Link>
                  ) và màu sắc theo ngũ hành (
                  <Link href="/mau-xe-hop-menh" className="text-gold-700 underline-offset-4 hover:underline">
                    màu hợp mệnh
                  </Link>
                  ) là những hệ riêng biệt. Kết quả tốt ở hệ này không suy ra hệ kia, và cũng không bù
                  trừ cho nhau.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <LoBanWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <LoBanRecall />,
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
                Có sẵn số đo trong tay?{' '}
                <Link
                  href="/thuoc-lo-ban"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Tra thước Lỗ Ban miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/thuoc-lo-ban', label: 'Tra thước Lỗ Ban' },
                    { href: '/xem-tuoi-lam-nha', label: 'Xem tuổi làm nhà' },
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
          children: <LoBanChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
