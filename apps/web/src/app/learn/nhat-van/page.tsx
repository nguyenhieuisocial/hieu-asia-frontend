/**
 * Bài học /learn/nhat-van — bài CHÍNH THỨC về "tử vi hôm nay theo con giáp".
 *
 * GROUNDING — không gõ tay bảng nào, mọi con số đều SUY TẠI RUNTIME:
 *   • lib/gio-hoang-dao.ts — BRANCHES (12 địa chi) và dayCanChi(dd, mm, yy):
 *     can chi NGÀY suy từ số ngày Julian (chi = (JDN+1)%12, can = (JDN+9)%10).
 *     Số 12 (số nhóm con giáp) lấy từ BRANCHES.length; chu kỳ lặp của can chi
 *     ngày do quét chính dayCanChi mà ra, không chép từ sách.
 *   • app/tu-vi-hom-nay/page.tsx + [zodiac]/page.tsx — công cụ đích: 12 thẻ con
 *     giáp, mỗi thẻ điểm tổng quan 1–10 + một câu; trang con thêm 4 lĩnh vực và
 *     4 mục vận may + dòng "nên tránh"; khối lưu ý "dự báo chung theo 12 con
 *     giáp, không phải lá số cá nhân"; mục lá số riêng dùng LoTrinhChart — chỉ
 *     dựng lá số khi trình duyệt đã có ngày giờ sinh đã lưu, chưa có thì hiện
 *     InviteCard "Lập lá số của tôi" → /decisions/new (không nhập tại chỗ);
 *     resolveDailySummaries()/isGenericSummary() thay hoặc bỏ câu chung chung.
 *
 * CÔNG CỤ THẬT SỰ LÀM GÌ (đọc code, không đoán): nhận đúng MỘT dữ kiện là con
 * giáp (bấm thẻ, không có ô nhập ngày/giờ sinh) → trả điểm + chữ cho từng con
 * giáp trong ngày. KHÔNG hỏi ngày–tháng–giờ–nơi sinh ở phần dự báo con giáp,
 * KHÔNG hiển thị can chi ngày (chỉ ngày dương + ngày âm), KHÔNG chấm ngày tốt –
 * xấu theo việc, KHÔNG xếp giờ hoàng đạo, KHÔNG tính vận năm. Cách máy chủ sinh
 * ra chữ và các con số may mắn nằm ở phía API, không có trong mã trang → bài
 * KHÔNG dạy phần đó và nói thẳng là không dạy, thay vì đoán.
 *
 * PHẠM VI: vòng can chi thuộc /learn/can-chi (ở đây MỘT câu + link); chấm ngày
 * thuộc /learn/trach-cat; giờ trong ngày thuộc /learn/gio-hoang-dao; vận năm
 * thuộc /learn/luu-nien; vì sao lời chung vẫn thấy đúng thuộc /learn/barnum.
 * Bài này chỉ nói MỘT chuyện: độ mịn. Giọng: không hù doạ, không mỉa mai người
 * đọc, không phán số mệnh — kết luận là "đọc như lời nhắc để tự vấn".
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
import { BRANCHES, dayCanChi } from '@/lib/gio-hoang-dao';
import {
  NhatVanFrame,
  NhatVanDepth,
  NhatVanRecall,
  NhatVanChecklist,
  NhatVanWhys,
} from './_active-learning';

// --- Hiển thị số theo kiểu Việt --------------------------------------------
// BẮT BUỘC: tiếng Việt dùng dấu PHẨY cho phần thập phân và dấu CHẤM cho hàng
// nghìn — ngược hẳn với cách JS in số. In thẳng 8.333 ra trang sẽ bị đọc thành
// "tám nghìn ba trăm ba mươi ba", sai gấp 1000 lần, mà mấy con số này còn nằm
// trong FAQPage JSON-LD nên Google và trợ lý AI trích lại nguyên văn.

/** 8.333… → "8,3" · 100 → "100" (bỏ phần thập phân bằng 0). */
function viNum(n: number, digits = 1): string {
  let s = n.toFixed(digits);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s.replace('.', ',');
}

/** 4380 → "4.380". */
function viInt(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Số người, làm tròn tới bậc dễ đọc: 8333333 → "8,3 triệu"; 694444 → "694 nghìn". */
function people(n: number): string {
  if (n >= 1_000_000) return `${viNum(n / 1_000_000, 1)} triệu`;
  return `${viInt(n / 1000)} nghìn`;
}

// --- Dữ kiện suy từ lib ------------------------------------------------------

/**
 * Số nhóm mà lớp "tử vi theo con giáp" chia dân số ra. KHÔNG gõ tay số 12: nó
 * chính là số địa chi trong BRANCHES — 12 con giáp là 12 địa chi.
 */
const GROUP_COUNT = BRANCHES.length;

/** Ngày VÍ DỤ cố định để minh hoạ can chi ngày. KHÔNG phải hôm nay, và cố ý không phải hôm nay. */
const EXAMPLE_DAY = { d: 1, m: 1, y: 2026 } as const;
const EXAMPLE_DAY_LABEL = `${EXAMPLE_DAY.d}/${EXAMPLE_DAY.m}/${EXAMPLE_DAY.y}`;

/** Ngày dương cách ngày ví dụ `offset` ngày. */
function shiftedDay(offset: number): { d: number; m: number; y: number } {
  const t = Date.UTC(EXAMPLE_DAY.y, EXAMPLE_DAY.m - 1, EXAMPLE_DAY.d) + offset * 86_400_000;
  const dt = new Date(t);
  return { d: dt.getUTCDate(), m: dt.getUTCMonth() + 1, y: dt.getUTCFullYear() };
}

/** Nhãn can chi của ngày cách ngày ví dụ `offset` ngày — gọi thẳng dayCanChi(). */
function dayLabelAt(offset: number): string {
  const s = shiftedDay(offset);
  return dayCanChi(s.d, s.m, s.y).label;
}

/**
 * Chu kỳ lặp của can chi NGÀY, đo bằng cách quét chính dayCanChi() cho tới khi
 * gặp lại đúng nhãn của ngày ví dụ. Không chép con số từ sách.
 */
const DAY_CYCLE = (() => {
  const first = dayLabelAt(0);
  for (let k = 1; k <= 200; k += 1) if (dayLabelAt(k) === first) return k;
  return 0;
})();

/** Ba ngày liên tiếp từ ngày ví dụ — để thấy can chi ngày nhích một bước mỗi ngày. */
const THREE_DAYS = [0, 1, 2].map((offset) => {
  const s = shiftedDay(offset);
  return { date: `${s.d}/${s.m}/${s.y}`, label: dayLabelAt(offset) };
});

/**
 * Dân số Việt Nam, làm tròn. ĐÂY LÀ SỐ NGOÀI: không lib nào của site suy ra
 * được, nên khai báo tại một chỗ, gọi rõ là con số làm tròn, và mọi phép chia
 * bên dưới đều tính từ nó.
 */
const VN_POPULATION = 100_000_000;

/** Số ngày trong một năm, làm tròn — dùng để đếm số ô, không phải để tính lịch. */
const DAYS_IN_YEAR = 365;

/** Số canh giờ trong ngày — cũng chính là 12 địa chi, lấy từ BRANCHES. */
const HOUR_SLOTS = BRANCHES.length;

/**
 * Trên CÙNG một năm sinh: thêm ngày sinh và giờ sinh thì số ô tăng bao nhiêu
 * lần so với lớp con giáp (lớp con giáp gộp cả năm sinh vào đúng một ô).
 */
const FINER_TIMES = DAYS_IN_YEAR * HOUR_SLOTS;

/** Ba cách chia dân số, để thấy 12 nhóm là thô tới mức nào. */
const SPLIT_ROWS = [
  {
    label: 'Không chia — một lời cho tất cả',
    buckets: 1,
    note: 'Không công cụ nào làm thế, nhưng đây là mốc để so.',
  },
  {
    label: `Theo ${GROUP_COUNT} con giáp — đúng cái công cụ đang làm`,
    buckets: GROUP_COUNT,
    note: 'Mỗi ngày có đúng chừng ấy bản dự báo cho cả nước.',
  },
  {
    label: 'Theo con giáp và giờ sinh',
    buckets: GROUP_COUNT * HOUR_SLOTS,
    note: 'Công cụ KHÔNG làm bậc này — nêu ra để thấy chỉ cần thêm một dữ kiện là số ô đã khác hẳn.',
  },
];

/** Công cụ trả về những gì — đọc từ mã trang /tu-vi-hom-nay và trang con của nó. */
const TOOL_GIVES = [
  {
    field: 'Điểm tổng quan',
    detail: 'Một số trên thang 1–10 cho mỗi con giáp, kèm một câu tóm tắt ngắn.',
  },
  {
    field: 'Bốn lĩnh vực',
    detail: 'Sự nghiệp, tình duyên, tài lộc, sức khoẻ — mỗi lĩnh vực một điểm và một câu.',
  },
  {
    field: 'Bốn mục vận may',
    detail: 'Số may mắn, màu may mắn, hướng tốt và giờ tốt của ngày.',
  },
  {
    field: 'Một dòng nên tránh',
    detail: 'Việc được nhắc là nên hoãn hoặc nên cẩn thận trong ngày.',
  },
];

/** Công cụ KHÔNG làm gì — cũng đọc từ mã, và mỗi dòng đều chỉ được chỗ làm việc đó. */
const TOOL_DOESNT = [
  'Không hỏi ngày, tháng, giờ hay nơi sinh. Ở phần dự báo theo con giáp, thao tác duy nhất là bấm vào con giáp của bạn — nên hai người cùng con giáp luôn nhận đúng một bản.',
  'Không hiển thị can chi của ngày. Trang chính chỉ ghi ngày dương; mười hai trang con ghi ngày dương kèm ngày âm — không trang nào ghi can chi ngày.',
  'Không chấm ngày tốt – xấu theo việc, không xếp đủ 12 canh giờ thành hoàng đạo – hắc đạo, không tính vận năm. Mục "giờ tốt" ở bảng trên chỉ là một dòng gợi ý theo con giáp, không phải bảng xếp giờ của cả ngày. Ba việc đó là ba công cụ khác, mỗi cái có bài học riêng.',
  'Không giải thích cách máy chủ sinh ra chữ và các con số may mắn — phép sinh nằm ở phía máy chủ chứ không có trong mã trang, nên bài này không dạy phần đó thay vì đoán.',
];

// Nhãn CTA — mỗi đích đúng MỘT nhãn trên toàn trang, dùng lại cho cả liên kết
// trong bài lẫn khối công cụ liên quan (guard cta-consistency chặn nếu lệch).
const L_TOOL = 'Xem Tử Vi hôm nay theo con giáp';
const L_LASO = 'Lập lá số Tử Vi cá nhân';
const L_GIO = 'Tra giờ hoàng đạo trong ngày';
const L_XEM_NGAY = 'Xem ngày tốt theo việc';

// Khai báo SAU các hằng suy ra ở trên vì description dùng chúng: `const` ở module
// scope nằm trong TDZ cho tới dòng khai báo, đọc sớm hơn là ReferenceError lúc
// build. Title nguồn 46 ký tự, description 156 ký tự.
export const metadata: Metadata = {
  title: 'Tử vi hôm nay theo con giáp — 12 ô cho cả nước',
  description: `Tử vi hôm nay chia cả nước thành đúng ${GROUP_COUNT} nhóm theo con giáp — mỗi nhóm khoảng ${people(VN_POPULATION / GROUP_COUNT)} người nhận cùng một lời. Đọc như lời nhắc tự vấn, không phải dự báo.`,
  alternates: { canonical: 'https://hieu.asia/learn/nhat-van' },
};

// FAQ khai báo MỘT lần, dùng cho CẢ accordion hiển thị lẫn FAQPage JSON-LD →
// chữ trong schema luôn khớp chữ trên trang.
const FAQS = [
  {
    q: 'Tử vi hôm nay theo con giáp chia dân số thành bao nhiêu nhóm?',
    a: `Đúng ${GROUP_COUNT} nhóm, vì có ${GROUP_COUNT} con giáp và công cụ chỉ nhận đúng một dữ kiện là con giáp của bạn. Lấy con số làm tròn ${people(VN_POPULATION)} người Việt Nam mà chia đều, mỗi nhóm khoảng ${people(VN_POPULATION / GROUP_COUNT)} người cùng đọc một bản trong cùng một ngày. Phép chia đều này là để thấy độ thô, không phải thống kê dân số thật — số người thật của mỗi con giáp có chênh nhau, nhưng chênh vài phần trăm thì không đổi được kết luận.`,
  },
  {
    q: 'Vậy có phải tử vi hôm nay là sai không?',
    a: 'Không phải "sai" theo nghĩa tính nhầm, mà là "thô" theo nghĩa không đủ mịn để nói riêng về một người. Một bản dự báo dùng đúng một dữ kiện thì không thể phân biệt được hai người cùng con giáp nhưng khác nghề, khác sức khoẻ, khác hoàn cảnh. Nó vẫn có thể hữu ích như một lời nhắc để bạn tự vấn buổi sáng; chỉ đừng đọc nó như một dự báo về việc sẽ xảy ra với riêng bạn.',
  },
  {
    q: 'Lá số cá nhân mịn hơn bao nhiêu?',
    a: `Lá số dùng đủ giờ – ngày – tháng – năm sinh, và công cụ lập lá số của hieu.asia còn hỏi thêm giới tính. Nếu chỉ xét những người sinh cùng một năm — tức cùng một con giáp — thì lớp con giáp gộp tất cả vào đúng một ô, còn lá số tách tiếp theo ngày sinh trong năm (khoảng ${DAYS_IN_YEAR} ngày) và theo giờ sinh (${HOUR_SLOTS} canh giờ), thành khoảng ${viInt(FINER_TIMES)} ô. Nói cách khác, chỉ riêng việc thêm ngày và giờ sinh đã làm phép chia mịn lên khoảng ${viInt(FINER_TIMES)} lần. Mịn hơn không tự động có nghĩa là đúng hơn, nhưng thô như lớp con giáp thì chắc chắn không thể nói riêng về ai.`,
  },
  {
    q: 'Vì sao đọc tử vi hôm nay vẫn thấy đúng?',
    a: 'Vì ba cơ chế cộng lại. Thứ nhất, lời viết đủ rộng để hầu như ai cũng nhận ra mình trong đó — đây là hiệu ứng Barnum, có bài riêng trên hieu.asia. Thứ hai, sau khi đọc bạn để ý những chuyện khớp và quên những chuyện không khớp, nên tối lại tổng kết thì thấy trúng. Thứ ba, lời dặn còn tự làm cho mình đúng: đọc câu "hôm nay dễ va chạm lời nói" rồi cả ngày nói năng cẩn thận hơn thì ngày đó êm thật. Cơ chế thứ nhất nằm ở cách viết, hai cơ chế sau nằm ở phía người đọc — không cơ chế nào là bằng chứng về sức dự báo.',
  },
  {
    q: 'Can chi của ngày có được dùng trong bản dự báo con giáp không?',
    a: `Có thể có, và bài này không khẳng định thay bạn được: dòng mô tả của trang công cụ — thẻ mô tả dùng cho kết quả tìm kiếm và cho khung xem trước khi chia sẻ link, không phải chữ hiện trên trang — ghi là tính theo can chi ngày, nhưng phép sinh ra chữ và điểm nằm ở máy chủ nên không đọc được từ mã trang. Thứ đọc được từ mã trang chỉ là công cụ KHÔNG hiển thị can chi ngày — trang chính ghi ngày dương, mười hai trang con ghi ngày dương kèm ngày âm. Và dù có dùng thì cũng không làm bản dự báo mịn thêm chút nào, vì can chi ngày là đại lượng của lịch chứ không của riêng ai: hàm tính can chi ngày của hieu.asia cho ngày ví dụ ${EXAMPLE_DAY_LABEL} ra ${THREE_DAYS[0]?.label}, hôm sau ${THREE_DAYS[1]?.label}, rồi lặp lại đúng nhãn cũ sau ${DAY_CYCLE} ngày — và hôm nay cả nước đều đang sống cùng một can chi ngày, nên nó không phân biệt được người này với người kia.`,
  },
  {
    q: 'Đọc tử vi hôm nay thế nào cho lành mạnh?',
    a: 'Đọc như một lời nhắc để tự vấn, không phải một dự báo để tuân theo. Thấy dòng "cẩn thận lời nói" thì hỏi hôm nay mình có cuộc nói chuyện nào dễ căng không; thấy dòng "thuận việc giấy tờ" thì nhớ ra hồ sơ đang treo. Ngược lại, đừng để nó quyết định thay bạn: không hoãn cuộc hẹn quan trọng, không dời lịch khám bệnh, không đổi quyết định tiền bạc chỉ vì một dòng chữ viết chung cho hàng triệu người.',
  },
  {
    q: 'Nếu muốn một bản riêng cho mình thì dùng gì?',
    a: 'Dùng lá số cá nhân, tức bản lập từ giờ – ngày – tháng – năm sinh và giới tính của chính bạn. Trên chính trang tử vi hôm nay, hieu.asia dành một mục riêng bên dưới phần dự báo con giáp cho lá số thật và ghi rõ đây là hai lớp khác nhau; mục ấy dựng lá số nếu bạn đã lưu ngày giờ sinh, còn chưa lưu thì hiện lời mời lập lá số. Cần nói thẳng luôn: lá số mịn hơn nhiều lần, nhưng mịn hơn không có nghĩa là đã được kiểm chứng — nó vẫn là một hệ quy ước để soi mình, không phải phép đo.',
  },
];

const JSONLD = [
  article({
    headline: 'Tử vi hôm nay theo con giáp: vì sao đây là lớp thô nhất trong mọi phép xem',
    description: `Bản dự báo theo con giáp chia cả nước thành đúng ${GROUP_COUNT} nhóm, mỗi nhóm khoảng ${people(VN_POPULATION / GROUP_COUNT)} người nhận cùng một lời. Bài giải thích độ mịn đó, vì sao lời chung vẫn thấy đúng, và cách đọc lành mạnh.`,
    url: '/learn/nhat-van',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Tử vi hôm nay theo con giáp', url: '/learn/nhat-van' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Tử vi hôm nay theo con giáp — đọc đúng độ mịn của nó',
    description: `Tử vi hôm nay chia cả nước thành đúng ${GROUP_COUNT} nhóm theo con giáp. Bài học chỉ ra độ thô của phép chia đó, vì sao lời chung vẫn thấy đúng, và cách dùng như lời nhắc tự vấn.`,
    url: '/learn/nhat-van',
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

export default function LearnNhatVanPage() {
  return (
    <LearnArticle
      eyebrow="TỬ VI HẰNG NGÀY · ĐỘ MỊN"
      title={
        <>
          Tử vi hôm nay theo con giáp{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (lớp thô nhất)
          </span>
        </>
      }
      standfirst={
        <>
          Mỗi sáng có {GROUP_COUNT} bản dự báo cho cả nước, và bạn nhận bản nào là do đúng một dữ
          kiện quyết định: con giáp. Bài này không bảo bạn ngừng đọc — nó chỉ đo giúp bạn xem lời ấy
          được viết cho bao nhiêu người, để bạn đặt nó đúng chỗ trong ngày của mình.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Tử vi hôm nay theo con giáp' },
      ]}
      relatedLenses={relatedLearnLenses('nhat-van')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb: `Trang Tử Vi hôm nay hiển thị ${GROUP_COUNT} thẻ con giáp với điểm tổng quan và tóm tắt của ngày. Mở lên và tự kiểm chứng điều bài này nói: bản của bạn được viết cho bạn, hay cho cả nhóm ${people(VN_POPULATION / GROUP_COUNT)} người?`,
        href: '/tu-vi-hom-nay',
        label: L_TOOL,
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <NhatVanFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Tử vi hôm nay theo con giáp là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mỗi ngày, trang Tử Vi hôm nay của hieu.asia dựng <strong>{GROUP_COUNT} thẻ</strong>,
                mỗi thẻ ứng với một con giáp. Ngay ở trang chính, mỗi thẻ đã hiện sẵn một điểm tổng
                quan trên thang 1–10 kèm một câu tóm tắt; bấm vào thẻ con giáp của mình là sang
                trang con, ở đó có thêm bốn lĩnh vực, bốn mục vận may và một dòng nên tránh.
              </p>
              <p>
                Toàn bộ phép chọn nằm ở <strong>một dữ kiện duy nhất</strong>: con giáp của bạn, tức
                địa chi của năm sinh. Không có ô nhập ngày sinh, không có giờ sinh, không có giới
                tính hay nơi sinh. Đó là điều cần nhớ trước khi đọc bất cứ dòng nào bên dưới đây.
              </p>
              <p>
                Ngày thì cũng có can chi riêng và nó chạy liên tục — hàm tính can chi ngày của
                hieu.asia cho ngày ví dụ {EXAMPLE_DAY_LABEL} ra {THREE_DAYS[0]?.label}, hôm sau{' '}
                {THREE_DAYS[1]?.label}, hôm sau nữa {THREE_DAYS[2]?.label}, và lặp lại đúng nhãn cũ
                sau {DAY_CYCLE} ngày; cấu tạo của vòng ấy thuộc bài{' '}
                <Link href="/learn/can-chi" className={A}>Thiên can – Địa chi</Link>. Nhưng đó là
                đại lượng của <strong>lịch</strong>, không phải của bạn: hôm nay cả nước đang sống
                cùng một can chi ngày.
              </p>
              <p>
                {TOOL_GIVES.length} thứ công cụ đưa ra, liệt kê nguyên trạng theo đúng mã của trang
                chứ không phải theo trí nhớ:
              </p>
              <Scroller minWidth="min-w-[620px]">
                <TableHead cols={['Mục', 'Nội dung']} />
                <tbody>
                  {TOOL_GIVES.map((row) => (
                    <tr key={row.field} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {row.field}
                      </th>
                      <td className={TD}>{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p>Và {TOOL_DOESNT.length} thứ nó không làm, nói thẳng:</p>
              <ul className="list-disc space-y-2 pl-5">
                {TOOL_DOESNT.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p>
                Thêm hai điều cần chốt. Thứ nhất,{' '}
                <strong>đây không phải lá số cá nhân của bạn</strong> — chính trang công cụ ghi sẵn
                dòng lưu ý ấy ngay dưới tiêu đề, và dành hẳn một mục riêng bên dưới cho lá số thật
                (mục ấy chỉ dựng được lá số khi bạn đã lưu ngày giờ sinh ở nơi khác trên hieu.asia;
                chưa lưu thì nó hiện lời mời lập lá số).
                Thứ hai, <strong>đây không phải dự báo đã được kiểm chứng</strong>: không có phép
                kiểm nào cho thấy điểm số của một ngày đoán trước được điều sẽ xảy ra — mục{' '}
                <Link href="#gioi-han" className={A}>giới hạn</Link> ở cuối bài nói kỹ chỗ này.
              </p>
              <p className="text-sm text-foreground/70">
                Bài này cố ý chỉ nói MỘT chuyện: <strong>độ mịn</strong>. Ba việc ở dòng thứ ba bên
                trên đều có bài riêng — chấm ngày tốt – xấu theo việc ở bài{' '}
                <Link href="/learn/trach-cat" className={A}>Trạch cát</Link>, xếp giờ trong ngày ở
                bài <Link href="/learn/gio-hoang-dao" className={A}>Giờ hoàng đạo</Link>, vận trình
                theo năm ở bài <Link href="/learn/luu-nien" className={A}>Lưu niên</Link>; còn những
                ngày kiêng theo phong tục ở bài{' '}
                <Link href="/learn/ngay-kieng-ky" className={A}>Ngày kiêng kỵ</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <NhatVanDepth />,
        },
        {
          id: 'phep-chia-12',
          tocLabel: `Phép chia ${GROUP_COUNT}`,
          heading: `Phép chia ${GROUP_COUNT}: một lời cho khoảng ${people(VN_POPULATION / GROUP_COUNT)} người`,
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là con số đáng nhớ nhất của bài. Lấy dân số Việt Nam làm tròn{' '}
                <strong>{people(VN_POPULATION)} người</strong> chia cho {GROUP_COUNT} con giáp:
                trung bình mỗi nhóm khoảng{' '}
                <strong>{people(VN_POPULATION / GROUP_COUNT)} người</strong> cùng đọc một bản dự báo
                trong cùng một ngày. Không phải một nghìn, không phải một trăm nghìn — chừng ấy triệu
                người, cùng một đoạn chữ.
              </p>
              <Scroller minWidth="min-w-[680px]">
                <TableHead
                  cols={['Cách chia dân số', 'Số ô', 'Trung bình mỗi ô', 'Ghi chú']}
                />
                <tbody>
                  {SPLIT_ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-border/60 last:border-b-0">
                      <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                        {row.label}
                      </th>
                      <td className="px-4 py-2 tabular-nums text-foreground">
                        {viInt(row.buckets)}
                      </td>
                      <td className="px-4 py-2 tabular-nums text-foreground">
                        {people(VN_POPULATION / row.buckets)}
                      </td>
                      <td className={TD}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </Scroller>
              <p className="text-sm text-foreground/70">
                Ba dòng trên là <strong>phép chia đều</strong>, cố ý làm thật thô để thấy bậc độ lớn.
                Số người thật của mỗi con giáp có chênh nhau đôi chút — năm nhiều trẻ, năm ít trẻ —
                nhưng chênh vài phần trăm thì không đổi được kết luận: một bản dự báo theo con giáp
                luôn được viết cho hàng triệu người cùng lúc.
              </p>
              <p>
                Hệ quả trực tiếp, và nó chặt như một phép tính chứ không phải một ý kiến: bản dự báo
                ấy <strong>không thể chứa thông tin riêng về bạn</strong>. Một hàm chỉ nhận vào con
                giáp thì không có cách nào trả ra thứ phụ thuộc vào nghề của bạn, sức khoẻ của bạn
                hay việc bạn đang chuẩn bị. Nếu bạn thấy nó nói trúng chuyện riêng, phần trúng ấy đến
                từ chỗ khác — mục{' '}
                <Link href="#vi-sao-thay-dung" className={A}>vì sao vẫn thấy đúng</Link> nói rõ đến
                từ đâu.
              </p>
              <p>
                Một cách kiểm nhanh mà bạn tự làm được trong ba mươi giây: mở trang công cụ, đọc bản
                của con giáp mình, rồi đọc thêm hai con giáp bất kỳ khác. Nếu cả ba đều có chỗ khớp
                với ngày hôm nay của bạn, thì thứ đang khớp không phải con giáp.
              </p>
            </div>
          ),
        },
        {
          id: 'so-voi-la-so',
          tocLabel: 'So với lá số',
          heading: 'So với lá số cá nhân: chênh nhau bao nhiêu bậc mịn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Lá số cá nhân dùng đủ <strong>giờ – ngày – tháng – năm sinh</strong>, và công cụ lập
                lá số của hieu.asia còn hỏi thêm <strong>giới tính</strong>. Để so cho công bằng,
                bảng dưới chỉ đếm hai dữ kiện ngày và giờ, và chỉ xét những người{' '}
                <strong>sinh cùng một năm</strong>, tức cùng một con giáp: lớp con giáp gộp toàn bộ
                nhóm ấy vào đúng một ô, còn lá số thì tách tiếp.
              </p>
              <Scroller minWidth="min-w-[720px]">
                <TableHead
                  cols={[
                    'Dữ kiện đầu vào',
                    'Số ô trong cùng một năm sinh',
                    'Công cụ nào dùng',
                  ]}
                />
                <tbody>
                  <tr className="border-b border-border/60">
                    <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                      Chỉ năm sinh (con giáp)
                    </th>
                    <td className="px-4 py-2 tabular-nums text-foreground">1</td>
                    <td className={TD}>Bản dự báo theo con giáp trên trang Tử Vi hôm nay.</td>
                  </tr>
                  <tr className="border-b border-border/60">
                    <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                      Thêm ngày sinh trong năm
                    </th>
                    <td className="px-4 py-2 tabular-nums text-foreground">
                      {viInt(DAYS_IN_YEAR)}
                    </td>
                    <td className={TD}>Các phép lập lá số đều cần dữ kiện này.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                      Thêm giờ sinh ({HOUR_SLOTS} canh giờ)
                    </th>
                    <td className="px-4 py-2 tabular-nums text-foreground">
                      {viInt(FINER_TIMES)}
                    </td>
                    <td className={TD}>
                      Lá số cá nhân — thiếu giờ sinh là lập không đủ. Công cụ còn hỏi thêm giới
                      tính, nên đây là con số sàn.
                    </td>
                  </tr>
                </tbody>
              </Scroller>
              <p>
                Đọc cột giữa từ trên xuống: trong cùng một năm sinh, lớp con giáp có{' '}
                <strong>một ô</strong>, còn lá số có ít nhất khoảng{' '}
                <strong>{viInt(FINER_TIMES)} ô</strong> — mịn hơn ít nhất chừng {viInt(FINER_TIMES)}{' '}
                lần. {HOUR_SLOTS} canh giờ ở dòng cuối chính là{' '}
                {HOUR_SLOTS} địa chi, cùng bộ với {GROUP_COUNT} con giáp; còn{' '}
                {viInt(DAYS_IN_YEAR)} là số ngày trong năm, làm tròn.
              </p>
              <p>
                Bây giờ là câu quan trọng nhất của cả mục này, và nó cắt cả hai chiều:{' '}
                <strong>mịn hơn không tự động nghĩa là đúng hơn</strong>. Lá số cá nhân vẫn là một hệ
                quy ước, chưa có phép kiểm nào chứng minh nó dự báo được. Điều bảng trên chứng minh
                chỉ đúng một chiều: lớp con giáp <em>chắc chắn</em> không đủ mịn để nói riêng về một
                người. Muốn xem thế nào là kiểm chứng một phép xem, đọc bài{' '}
                <Link href="/learn/kiem-chung" className={A}>Kiểm chứng</Link>.
              </p>
              <p className="text-sm text-foreground/70">
                Nếu bạn muốn bản mịn hơn cho chính mình:{' '}
                <Link href="/la-so-tu-vi" className={A}>{L_LASO}</Link>. Trang Tử Vi hôm nay cũng
                dành một mục riêng bên dưới phần dự báo con giáp cho lá số thật, kèm dòng nói rõ đây
                là hai lớp khác nhau — mục ấy dựng lá số nếu bạn đã lưu ngày giờ sinh, còn chưa lưu
                thì hiện lời mời lập lá số.
              </p>
            </div>
          ),
        },
        {
          id: 'vi-sao-thay-dung',
          tocLabel: 'Vì sao vẫn thấy đúng',
          heading: 'Vì sao lời viết cho hàng triệu người vẫn thấy đúng với riêng bạn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nếu bạn từng đọc và thấy trúng, bạn không cả tin và cũng không ngốc. Cảm giác trúng
                ấy có thật, và có ba cơ chế giải thích được nó: cơ chế đầu nằm ở{' '}
                <strong>cách viết</strong>, hai cơ chế sau nằm ở <strong>phía người đọc</strong>.
                Không cơ chế nào là bằng chứng về sức dự báo.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  <strong>Lời đủ rộng để ai cũng nhận ra mình.</strong> Những câu như
                  &ldquo;hôm nay bạn nên cẩn thận trong giao tiếp&rdquo; đúng với gần như mọi người,
                  mọi ngày. Đây là <strong>hiệu ứng Barnum</strong>, đã có bài riêng và có cả cách
                  tự thử ở đó: <Link href="/learn/barnum" className={A}>Hiệu ứng Barnum</Link>.
                </li>
                <li>
                  <strong>Bạn tự lọc bằng chứng sau khi đọc.</strong> Đọc xong câu &ldquo;dễ va chạm
                  lời nói&rdquo;, cả ngày bạn để ý những lúc suýt va chạm và bỏ qua những lúc êm
                  thấm. Tối lại tổng kết thì thấy trúng. Bộ đếm chỉ chạy một chiều, vì phần không
                  khớp không được ghi lại.
                </li>
                <li>
                  <strong>Lời dặn tự làm cho mình đúng.</strong> Đọc câu nhắc cẩn thận rồi cả ngày
                  nói năng chừng mực hơn thì ngày đó êm thật. Đây là kết quả tốt — nhưng nó đến từ
                  việc bạn đã hành động khác đi, không phải từ việc bản dự báo nhìn thấy trước.
                </li>
              </ol>
              <p>
                Có một chi tiết trong mã của công cụ đáng kể lại, vì nó là bằng chứng cho cơ chế thứ
                nhất — cái nằm ở cách viết. Nội dung chữ do máy chủ sinh, và các bản của {GROUP_COUNT} con giáp có xu
                hướng <strong>trôi về cùng một kiểu câu chung chung</strong> — thứ ai đọc cũng thấy
                hợp. Trang công cụ phải có sẵn một lớp chặn: nó nhận diện câu chung chung rồi thay
                bằng câu riêng theo từng con giáp, và ở trang con thì bỏ hẳn phần chữ của một lĩnh
                vực nếu câu đó rơi vào dạng chung chung. Ngay cả người làm công cụ cũng phải chủ động
                chống lại kiểu viết &ldquo;đúng với mọi người&rdquo;, vì đó là mặc định tự nhiên của
                mọi bản dự báo viết cho hàng triệu người.
              </p>
              <p>
                Ba cơ chế này cộng lại đủ mạnh để một bản viết cho khoảng{' '}
                {people(VN_POPULATION / GROUP_COUNT)} người vẫn thấy như viết riêng cho một người.
                Biết chúng không làm mất đi cái hay của thói quen đọc buổi sáng; nó chỉ giúp bạn
                không nhầm cảm giác trúng với bằng chứng về sức dự báo.
              </p>
              <p className="text-sm text-foreground/70">
                Có một phép thử tự làm được: sáng mai, trước khi đọc, ghi ra giấy ba điều bạn nghĩ sẽ
                xảy ra trong ngày. Tối đối chiếu cả ba với bản dự báo, rồi tự chấm xem bên nào sát
                ngày thật của bạn hơn — bạn biết về ngày của bạn nhiều hơn mọi phép chia{' '}
                {GROUP_COUNT} ô cộng lại.
              </p>
            </div>
          ),
        },
        {
          id: 'dung-lanh-manh',
          tocLabel: 'Dùng lành mạnh',
          heading: 'Cách dùng lành mạnh: đọc như lời nhắc để tự vấn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bài này không kết luận &ldquo;đừng đọc nữa&rdquo;. Một thói quen buổi sáng khiến bạn
                dừng lại ba mươi giây và nghĩ về ngày của mình là một thói quen tốt, kể cả khi cái
                cớ để dừng lại là một bản dự báo chung. Vấn đề không nằm ở việc đọc, mà ở việc trao
                cho nó quyền quyết định.
              </p>
              <p>Ba cách dùng khiến nó có ích:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Đổi câu phán thành câu hỏi.</strong> Đọc &ldquo;hôm nay dễ căng thẳng
                  chuyện tiền bạc&rdquo; thì đừng nhận nó là dự báo; hãy hỏi &ldquo;hôm nay mình có
                  khoản nào đang treo không?&rdquo;. Câu hỏi ấy là của bạn, và câu trả lời cũng vậy.
                </li>
                <li>
                  <strong>Lấy nó làm chuông báo, không lấy làm bản đồ.</strong> Chuông chỉ nhắc bạn
                  nhìn quanh; bản đồ mới là thứ chỉ đường. Đường đi trong ngày của bạn nằm ở lịch
                  hẹn, ở việc đang dở, ở sức khoẻ hôm nay — chứ không ở một dòng chữ.
                </li>
                <li>
                  <strong>Đọc xong thì ghi lại một điều mình sẽ làm.</strong> Một câu thôi. Thứ có
                  ích cho ngày của bạn là hành động ấy, không phải điểm số bạn vừa đọc.
                </li>
              </ul>
              <p>Và ba chỗ nên dừng lại:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Đừng hoãn việc thật vì một dòng chữ chung.</strong> Cuộc hẹn quan trọng,
                  buổi phỏng vấn, chuyến đi đã đặt vé — hoãn là mất thật, còn cái được chỉ là sự an
                  tâm về một bản viết cho hàng triệu người.
                </li>
                <li>
                  <strong>Đừng để nó chạm vào sức khoẻ, pháp lý hay tiền bạc.</strong> Không dời lịch
                  khám bệnh, không bỏ thuốc, không ký hay không ký một hợp đồng vì điểm số của ngày.
                  Những việc ấy có tiêu chí riêng và tiêu chí ấy kiểm chứng được.
                </li>
                <li>
                  <strong>Đừng trả tiền để &ldquo;hoá giải&rdquo; một ngày điểm thấp.</strong> Điểm
                  của ngày là một con số hiển thị, không phải một đại lượng đo được, nên cũng không
                  có gì để hoá giải. hieu.asia không bán và không khuyên mua thứ gì cho việc đó.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Nếu điều bạn thật sự cần là chọn thời điểm cho một việc cụ thể — ký kết, khởi công,
                đi xa — thì đó là phép tính khác hẳn, dùng dữ kiện khác:{' '}
                <Link href="/xem-ngay" className={A}>{L_XEM_NGAY}</Link>. Bài học đứng sau nó là{' '}
                <Link href="/learn/trach-cat" className={A}>Trạch cát</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: nói thẳng bài này chứng minh được gì và không chứng minh được gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>Để bạn không mang từ đây đi một khẳng định rộng hơn thứ đã chứng minh:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Điều bài này chứng minh:</strong> lớp dự báo theo con giáp chỉ có{' '}
                  {GROUP_COUNT} ô, nên mỗi ô trung bình khoảng{' '}
                  {people(VN_POPULATION / GROUP_COUNT)} người. Đây là số học, không phải quan điểm:
                  một phép chỉ nhận con giáp thì không thể trả ra thứ riêng của một người.
                </li>
                <li>
                  <strong>Điều bài này KHÔNG chứng minh:</strong> rằng các lớp mịn hơn thì đúng. Lá
                  số cá nhân mịn hơn nhiều lần, nhưng mịn là chuyện độ phân giải, còn đúng là chuyện
                  kiểm chứng — hai trục khác nhau, và trục thứ hai thì chưa có phép kiểm nào ngã ngũ.
                </li>
                <li>
                  <strong>Phần bài này cố ý không dạy:</strong> cách máy chủ sinh ra chữ, điểm số và
                  các con số may mắn của từng ngày. Phép sinh nằm ở phía máy chủ chứ không có trong
                  mã trang, nên nói về nó là đoán — mà đoán rồi viết ra thì bài mất chính cái tính
                  trung thực nó đang đòi hỏi ở người khác.
                </li>
                <li>
                  <strong>Không có gì để hoá giải.</strong> Điểm thấp của một ngày không phải một
                  lực; nó là một con số hiển thị. Nên cũng không có dịch vụ nào cần mua, và cảnh giác
                  là hợp lý khi ai đó dùng một dòng dự báo để bán hàng cho bạn.
                </li>
              </ul>
              <p>
                Cách đặt bài này vào đúng chỗ: nó là thước đo <strong>độ mịn</strong>, một thước duy
                nhất. Dùng nó để biết một lời được viết cho bao nhiêu người, rồi tự quyết định cho
                lời ấy bao nhiêu trọng lượng trong ngày của mình. Nó không thay được lời khuyên y
                tế, pháp lý hay tài chính.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <NhatVanWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <NhatVanRecall />,
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
                Muốn hiểu vòng lịch đứng dưới mọi phép tra này, đọc bài{' '}
                <Link href="/learn/can-chi" className={A}>Thiên can – Địa chi</Link>. Muốn hiểu vì
                sao một lời chung vẫn thấy trúng, đọc bài{' '}
                <Link href="/learn/barnum" className={A}>Hiệu ứng Barnum</Link>. Còn vận trình theo
                năm — lớp mịn hơn ngày một chút nhưng vẫn theo tuổi — thuộc bài{' '}
                <Link href="/learn/luu-nien" className={A}>Lưu niên</Link>.
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/tu-vi-hom-nay', label: L_TOOL },
                    { href: '/la-so-tu-vi', label: L_LASO },
                    { href: '/gio-hoang-dao', label: L_GIO },
                    { href: '/xem-ngay', label: L_XEM_NGAY },
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
          children: <NhatVanChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
