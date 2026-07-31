/**
 * /learn/xuat-hanh — bài học nền tảng về HƯỚNG XUẤT HÀNH (không phải giờ, không
 * phải hướng nhà).
 *
 * GROUNDING — mọi dữ kiện về hướng đều lấy từ:
 *   • lib/xuat-hanh.ts — HY_THAN và TAI_THAN (import trực tiếp rồi render, KHÔNG
 *     gõ tay lại bảng), type Direction, computeXuatHanh() (hướng suy theo
 *     `g.dayCanChi.stem` — tức THIÊN CAN của ngày), cùng phần chú nguồn trong
 *     docstring của lib: Hỷ Thần theo khẩu quyết 《考原》; Tài Thần dùng bản lịch
 *     vạn niên Việt Nam (7 hướng, không dùng Đông Bắc), có nhiều phái Trung Quốc
 *     khác nhau (玉匣记 / 协纪辨方书 / 择吉纲要).
 *   • lib/gio-hoang-dao.ts — dayCanChi() (can chi ngày suy từ số ngày Julian:
 *     `stemIndex = (JDN+9)%10`), dùng để lấy can của các ngày ví dụ.
 *   • app/xuat-hanh/ + components/xuat-hanh/XuatHanhChecker.tsx — cách trang công
 *     cụ mô tả hai vị thần và các cảnh báo minh bạch.
 *
 * Ba ví dụ tra tay (7/9/2026 Giáp Thân, 9/9/2026 Bính Tuất, 17/9/2026 Giáp Ngọ)
 * là kết quả của chính dayCanChi() + HY_THAN/TAI_THAN với các ngày đó. Ví dụ
 * kiểm chứng 17/2/2026 (Nhâm Tuất → Chính Nam / Chính Tây) lấy đúng mốc xác thực
 * end-to-end ghi trong docstring lib/xuat-hanh.ts.
 *
 * PHÂN VAI (chống trùng): chọn NGÀY → /learn/trach-cat; chọn GIỜ →
 * /learn/gio-hoang-dao; cuốn lịch → /learn/lich-am-duong; hướng NHÀ theo cung phi
 * → /learn/bat-trach. Bài này chỉ sở hữu HƯỚNG XUẤT HÀNH theo can ngày; giờ xuất
 * hành chỉ nhắc 1–2 câu rồi trỏ link.
 */

import type { ReactNode } from 'react';
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
import { HY_THAN, TAI_THAN, type Direction } from '@/lib/xuat-hanh';
import {
  XuatHanhFrame,
  XuatHanhDepth,
  XuatHanhRecall,
  XuatHanhChecklist,
  XuatHanhWhys,
} from './_active-learning';

export const metadata: Metadata = {
  // ≤48 ký tự: root layout nối thêm " · hieu.asia" (12) và seo-guard chặn ở 60.
  title: 'Hướng xuất hành — Hỷ Thần & Tài Thần',
  description:
    'Hướng xuất hành theo phong tục: Hỷ Thần, Tài Thần suy từ can của ngày. Bảng tra 10 can, ví dụ tra tay và phân biệt với hướng nhà theo tuổi.',
  alternates: { canonical: 'https://hieu.asia/learn/xuat-hanh' },
};

// Thứ tự 10 thiên can lấy đúng thứ tự khai báo của HY_THAN trong lib/xuat-hanh.ts
// (Giáp → Quý), vốn khớp mảng STEMS của lib/gio-hoang-dao.ts. Lấy bằng
// Object.keys thay vì gõ tay để bảng dưới luôn đi theo lib.
const CAN_ORDER = Object.keys(HY_THAN);

/** Gom 10 can theo hướng — dùng để thấy "bao nhiêu can dùng chung một hướng". */
function groupByDirection(table: Record<string, Direction>): [Direction, string[]][] {
  const out = new Map<Direction, string[]>();
  for (const can of CAN_ORDER) {
    const dir = table[can]!;
    const list = out.get(dir);
    if (list) list.push(can);
    else out.set(dir, [can]);
  }
  return [...out.entries()];
}

const HY_GROUPS = groupByDirection(HY_THAN);
const TAI_GROUPS = groupByDirection(TAI_THAN);

/** Những can mà Hỷ Thần và Tài Thần rơi vào cùng một hướng — tính từ lib. */
const CAN_TRUNG_HUONG = CAN_ORDER.filter((can) => HY_THAN[can] === TAI_THAN[can]);

// Ba ví dụ tra tay. Can chi ngày = dayCanChi() của lib/gio-hoang-dao.ts; hướng =
// HY_THAN / TAI_THAN của chính can đó (không chép tay hướng — render từ bảng).
const VI_DU: { ngay: string; canChi: string; can: string; y: string }[] = [
  {
    ngay: '7/9/2026',
    canChi: 'Giáp Thân',
    can: 'Giáp',
    y: 'Mốc gốc để so sánh.',
  },
  {
    ngay: '9/9/2026',
    canChi: 'Bính Tuất',
    can: 'Bính',
    y: 'Chỉ cách 2 ngày mà cả hai hướng đều đổi.',
  },
  {
    ngay: '17/9/2026',
    canChi: 'Giáp Ngọ',
    can: 'Giáp',
    y: 'Cách ví dụ 1 đúng 10 ngày → can lặp lại → hướng y hệt, dù chi đã khác.',
  },
];

const linkCls = 'text-gold-700 underline-offset-4 hover:underline';

// Bảng đối chiếu hai hệ. Cột "xuất hành" chỉ nói lại đúng những gì lib/xuat-hanh.ts
// làm; cột "hướng nhà" cố ý giữ ở mức khái quát rồi trỏ sang /learn/bat-trach —
// bài đó mới là chủ sở hữu nội dung cung phi.
const SO_SANH: { tieuChi: string; xuatHanh: ReactNode; nha: ReactNode }[] = [
  {
    tieuChi: 'Căn cứ vào',
    xuatHanh: 'Thiên can của NGÀY',
    nha: 'Năm sinh và giới tính của NGƯỜI (cung phi)',
  },
  {
    tieuChi: 'Đổi khi nào',
    xuatHanh: 'Mỗi ngày một khác, lặp lại sau 10 ngày',
    nha: 'Không đổi — gắn với người đó lâu dài',
  },
  {
    tieuChi: 'Mọi người có giống nhau?',
    xuatHanh: 'Có — cùng ngày thì cả nhà chung một cặp hướng',
    nha: 'Không — mỗi người một bảng riêng',
  },
  {
    tieuChi: 'Áp vào cái gì',
    xuatHanh: 'Phía bạn bước ra khi rời nhà hôm đó',
    nha: 'Cửa chính, bếp, giường — những thứ đứng yên',
  },
  {
    tieuChi: 'Số hướng dùng đến',
    xuatHanh: `Hỷ Thần ${HY_GROUPS.length}, Tài Thần ${TAI_GROUPS.length}`,
    nha: 'Đủ 8 hướng, chia thành nhóm hợp / không hợp',
  },
  {
    tieuChi: 'Học ở đâu',
    xuatHanh: 'Trang này',
    nha: (
      <Link href="/learn/bat-trach" className={linkCls}>
        Bài Bát Trạch
      </Link>
    ),
  },
];

/** Thẻ "hướng ← các can dùng hướng đó", dựng thẳng từ HY_GROUPS / TAI_GROUPS. */
function GroupCard({
  tone,
  title,
  groups,
  note,
}: {
  tone: 'hy' | 'tai';
  title: string;
  groups: [Direction, string[]][];
  note: string;
}) {
  const chip =
    tone === 'hy'
      ? 'border-gold/40 bg-gold/[0.07]'
      : 'border-emerald-500/40 bg-emerald-500/[0.06]';
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="font-heading text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {groups.map(([dir, cans]) => (
          <li key={dir} className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-medium text-foreground ${chip}`}
            >
              {dir}
            </span>
            <span className="text-muted-foreground">← ngày can {cans.join(' · ')}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
// CÂU HỎI CỐ Ý KHÁC với FAQ trên trang công cụ /xuat-hanh (trang đó hỏi "hôm nay
// hướng nào", "Hỷ Thần khác Tài Thần thế nào", "đi sai hướng có sao không",
// "Tết 2027 hướng nào") — ở đây hỏi phần cơ chế và phần dễ hiểu sai.
const FAQS = [
  {
    q: 'Hướng xuất hành tính theo tuổi người đi hay theo ngày?',
    a: 'Theo ngày, không theo tuổi. Cụ thể hơn: chỉ theo thiên can của ngày (Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý). Nghĩa là trong cùng một ngày, cả nhà bạn — ông bà, bố mẹ, con cái, khách tới chơi — đều có chung một hướng Hỷ Thần và chung một hướng Tài Thần. Không ai cần khai năm sinh, và cũng không có chuyện "hướng của tôi khác hướng của anh" trong cùng ngày.',
  },
  {
    q: 'Vì sao cứ 10 ngày hướng xuất hành lại lặp lại y hệt?',
    a: 'Vì thiên can là một vòng gồm đúng 10 tên, chạy tuần tự rồi quay lại đầu: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý, rồi lại Giáp. Hướng xuất hành chỉ phụ thuộc can, nên hôm nay và ngày thứ 10 sau đó luôn cùng một cặp hướng. Ví dụ 7/9/2026 là ngày Giáp Thân và 17/9/2026 là ngày Giáp Ngọ — chi đã đổi từ Thân sang Ngọ nhưng can vẫn là Giáp, nên hướng Hỷ Thần và Tài Thần giống hệt nhau.',
  },
  {
    q: 'Chi của ngày (Tý, Sửu, Dần…) có ảnh hưởng tới hướng xuất hành không?',
    a: 'Không. Hướng xuất hành chỉ đọc phần can, phần chi bị bỏ qua hoàn toàn ở bước này. Đây là chỗ rất hay nhầm vì ngày nào cũng được gọi bằng cả cặp, ví dụ "ngày Giáp Thân". Chi của ngày có vai trò ở lớp khác — nó quyết định cách khởi vòng sao để tính giờ hoàng đạo, tức phần chọn GIỜ chứ không phải phần chọn hướng.',
  },
  {
    q: 'Vì sao Hỷ Thần chỉ dùng 5 hướng còn Tài Thần dùng 7 hướng?',
    a: 'Vì hai bảng gom can theo hai kiểu khác nhau. Bảng Hỷ Thần ghép 10 can thành 5 cặp, mỗi cặp dùng chung một hướng, nên chỉ cần 5 hướng: bốn hướng góc (Đông Bắc, Tây Bắc, Tây Nam, Đông Nam) và Chính Nam. Bảng Tài Thần chia mịn hơn: có cặp dùng chung hướng, có can đứng riêng một hướng, tổng cộng 7 hướng và không dùng Đông Bắc. Số hướng khác nhau chỉ phản ánh cách gom của từng bảng, không có nghĩa vị này "mạnh" hơn vị kia.',
  },
  {
    q: 'Có ngày nào Hỷ Thần và Tài Thần chỉ về cùng một hướng không?',
    a: 'Có. Trong 10 can chỉ duy nhất ngày mang can Tân là hai vị cùng chỉ về Tây Nam — hôm đó bước ra một hướng là xong cả hai. Ngược lại, ngày can Ất và ngày can Quý là hai trường hợp hai hướng đối nhau đúng 180 độ (Tây Bắc và Đông Nam), tức không thể đi cả hai. Gặp ngày như vậy thì chọn theo việc bạn định làm, hoặc đơn giản là chọn hướng nào tiện đường hơn.',
  },
  {
    q: 'Các cuốn lịch ghi hướng Tài Thần khác nhau thì tin bản nào?',
    a: 'Đây là điểm hieu.asia nói thẳng thay vì giấu: hướng Tài Thần có nhiều phái tính khác nhau trong tư liệu Trung Hoa, nên hai cuốn lịch có thể ghi hai hướng khác nhau cho cùng một ngày mà không bên nào "sai" theo hệ của mình. Công cụ ở đây dùng bản phổ biến trong lịch vạn niên Việt Nam vì đó là chuẩn quen thuộc với tục xuất hành của người Việt. Hướng Hỷ Thần thì gần như không có tranh cãi — các nguồn Việt và Trung đều khớp.',
  },
  {
    q: 'Xuất hành đúng hướng rồi có cần xem giờ nữa không?',
    a: 'Không bắt buộc — hướng và giờ là hai lớp độc lập, dùng riêng vẫn được. Nếu muốn dùng cả hai thì chúng bổ sung cho nhau: hướng trả lời "bước ra phía nào", giờ trả lời "bước ra lúc mấy giờ". Ngày nào cũng có đúng 6 giờ hoàng đạo để chọn, nên thường không khó thu xếp. Phần chọn giờ có bài học và công cụ riêng, bài này không giảng lại.',
  },
  {
    q: 'Ra khỏi nhà rồi mới nhớ ra mình đi sai hướng thì có phải quay vào làm lại không?',
    a: 'Không cần. Đây là phong tục cầu may để bắt đầu ngày với tâm thế tích cực, không phải một thủ tục có hiệu lực hay vô hiệu. Quay xe giữa đường, đi vòng qua đoạn lạ hoặc lùi lịch hẹn chỉ để "sửa hướng" thường tạo ra rủi ro thật lớn hơn nhiều so với lợi ích tinh thần mà nó mang lại. Cũng xin nói rõ luôn: bảng dữ liệu của hieu.asia chỉ chứa hướng theo can ngày, không chứa quãng đường, thời gian hay nghi thức nào — nên không có "đi bao xa mới tính", và hieu.asia không bán lễ hoá giải.',
  },
];

const JSONLD = [
  article({
    headline:
      'Hướng xuất hành: Hỷ Thần, Tài Thần và cách tra theo thiên can của ngày',
    description:
      'Hướng xuất hành theo phong tục — Hỷ Thần và Tài Thần suy từ thiên can của ngày, bảng tra đủ 10 can, ví dụ tra tay và ranh giới với hướng nhà theo tuổi.',
    url: '/learn/xuat-hanh',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Hướng xuất hành', url: '/learn/xuat-hanh' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Hướng xuất hành — Hỷ Thần, Tài Thần theo can ngày',
    description:
      'Hướng xuất hành theo phong tục: Hỷ Thần, Tài Thần suy từ can của ngày. Bảng tra 10 can, ví dụ tra tay và phân biệt với hướng nhà theo tuổi.',
    url: '/learn/xuat-hanh',
  }),
];

export default function LearnXuatHanhPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · HƯỚNG XUẤT HÀNH"
      title={
        <>
          Hướng{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">xuất hành</span>
        </>
      }
      standfirst={
        <>
          Sáng mùng Một, nhiều nhà bước ra cửa rồi đi hẳn về một phía trước khi tới nơi cần tới. Phía
          ấy gọi là hướng xuất hành — người xưa tin mỗi ngày có một phương vị “gặp” Hỷ Thần và một
          phương vị “gặp” Tài Thần. Điều quan trọng cần biết trước: hướng này suy theo{' '}
          <strong>ngày</strong>, không theo tuổi người đi, và đây là quy ước phong tục để tham khảo.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Hướng xuất hành' },
      ]}
      relatedLenses={relatedLearnLenses('xuat-hanh')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập một ngày bất kỳ (hoặc để nguyên hôm nay), hệ thống hiển thị can chi của ngày, hướng Hỷ Thần, hướng Tài Thần và các giờ hoàng đạo trong ngày — cùng một engine can chi với Lịch Vạn Niên của site.',
        href: '/xuat-hanh',
        label: 'Tra hướng xuất hành theo ngày',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <XuatHanhFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Hướng xuất hành là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Hướng xuất hành</strong> là phương vị mà theo phong tục, người ta hướng về khi
                rời nhà đi làm việc đầu tiên trong ngày — rõ nhất là sáng mùng Một Tết, nhưng cũng
                được nhiều người tra vào ngày đi xa, ngày mở hàng, ngày đi ký kết. Mỗi ngày có{' '}
                <strong>hai phương vị</strong> được nhắc: <strong>Hỷ Thần</strong> (喜神) cho việc cầu
                may mắn, hỉ sự; và <strong>Tài Thần</strong> (財神) cho việc cầu tài lộc.
              </p>
              <p>
                Điểm mấu chốt của cả bài, nói ngay từ đầu: hai hướng này{' '}
                <strong>suy từ thiên can của NGÀY</strong> — chỉ vậy thôi. Không dùng năm sinh, không
                dùng giới tính, không dùng mệnh, không dùng chi của ngày. Hệ quả rất dễ kiểm chứng:
                trong cùng một ngày, <strong>mọi người đều có chung một cặp hướng</strong>. Ai tra
                cũng ra kết quả như nhau.
              </p>
              <p>Và đây là những gì hướng xuất hành KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải hướng nhà.</strong> Hướng nhà theo Bát Trạch tính từ{' '}
                  <em>tuổi người</em> và gắn với ngôi nhà lâu dài; hướng xuất hành đổi mỗi ngày và
                  không liên quan gì tới ngôi nhà — có hẳn một mục riêng ở dưới để bạn không gộp nhầm.
                </li>
                <li>
                  <strong>Không phải lời bảo đảm.</strong> Đi đúng hướng không hứa hẹn tiền vào hay
                  việc thuận; đi trái hướng cũng không có nghĩa hôm đó xui.
                </li>
                <li>
                  <strong>Không phải một thủ tục có “hiệu lực”.</strong> Không có bước nào bị hỏng nếu
                  bạn quên, không có gì phải làm lại, và hieu.asia{' '}
                  <strong>không bán lễ hoá giải</strong>.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground">
                Bài này nói về HƯỚNG — không nói về ngày, giờ hay hướng nhà
              </h3>
              <p>
                Việc “chọn thời điểm và phương vị” trong phong tục có nhiều lớp. Bài này chỉ sở hữu{' '}
                <strong>lớp hướng xuất hành</strong>; các lớp khác có bài và công cụ riêng để bạn
                không phải đọc lẫn:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chọn NGÀY tốt theo loại việc</strong> —{' '}
                  <Link href="/learn/trach-cat" className={linkCls}>bài Trạch Cát</Link>, công cụ{' '}
                  <Link href="/xem-ngay" className={linkCls}>xem ngày tốt</Link>. Riêng ngày kiêng kỵ
                  có <Link href="/learn/ngay-kieng-ky" className={linkCls}>bài riêng</Link>.
                </li>
                <li>
                  <strong>Chọn GIỜ trong ngày</strong> (12 canh giờ, sao trực giờ) —{' '}
                  <Link href="/learn/gio-hoang-dao" className={linkCls}>bài Giờ Hoàng Đạo</Link>.
                </li>
                <li>
                  <strong>Hướng NHÀ theo cung phi</strong> —{' '}
                  <Link href="/learn/bat-trach" className={linkCls}>bài Bát Trạch</Link>.
                </li>
                <li>
                  <strong>Cuốn lịch, đổi ngày âm – dương, can chi từng ngày</strong> —{' '}
                  <Link href="/learn/lich-am-duong" className={linkCls}>bài Lịch âm dương</Link>.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Về <strong>giờ xuất hành</strong>: công cụ có hiển thị kèm các giờ hoàng đạo trong
                ngày, nhưng đó là lớp chọn giờ — cơ chế và bảng tra nằm ở bài Giờ Hoàng Đạo. Ở đây
                chúng ta tập trung vào phương vị.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <XuatHanhDepth />,
        },
        {
          id: 'cac-vi-than-huong',
          tocLabel: 'Hai vị thần hướng',
          heading: 'Hỷ Thần và Tài Thần: mỗi vị chủ về điều gì',
          children: (
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Công cụ của hieu.asia tính đúng <strong>hai</strong> phương vị, không hơn. Mỗi vị gắn
                với một loại mong muốn khác nhau, nên khi ngày đó hai hướng không trùng nhau, bạn chọn
                theo việc mình định làm.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gold/30 bg-gold/[0.05] p-4">
                  <p className="font-heading text-base font-semibold text-foreground">
                    Hỷ Thần <span className="font-normal text-muted-foreground">(喜神)</span>
                  </p>
                  <p className="mt-1 text-sm text-gold-700">Cầu may mắn, hỉ sự</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    “Hỷ” là niềm vui, việc mừng. Đây là phương vị được nhắc cho những chuyến đi mong
                    gặp điều lành nói chung: đi chúc Tết, đi hỏi cưới, đi gặp người mình quý, đi bắt
                    đầu một việc mới. Bảng Hỷ Thần theo{' '}
                    <strong className="text-foreground">khẩu quyết cổ 《考原》</strong>, và các nguồn
                    Việt lẫn Trung gần như không mâu thuẫn nhau ở bảng này. Dùng đúng{' '}
                    <strong className="text-foreground">{HY_GROUPS.length} hướng</strong>: bốn hướng
                    góc và Chính Nam.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                  <p className="font-heading text-base font-semibold text-foreground">
                    Tài Thần <span className="font-normal text-muted-foreground">(財神)</span>
                  </p>
                  <p className="mt-1 text-sm text-emerald-500">Cầu tài lộc</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    “Tài” là tiền tài. Đây là phương vị được nhắc cho việc liên quan tới làm ăn: mở
                    hàng, đi giao dịch, đi ký kết, đi thu tiền. hieu.asia dùng{' '}
                    <strong className="text-foreground">bản lịch vạn niên Việt Nam</strong> —{' '}
                    <strong className="text-foreground">có nhiều phái Trung Hoa tính khác nhau</strong>{' '}
                    (玉匣记, 协纪辨方书, 择吉纲要), nên hai cuốn lịch có thể ghi hai hướng khác nhau cho
                    cùng một ngày. Chúng tôi ghi rõ điều này thay vì giấu đi. Dùng{' '}
                    <strong className="text-foreground">{TAI_GROUPS.length} hướng</strong> —{' '}
                    <strong className="text-foreground">không dùng Đông Bắc</strong>.
                  </p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Hai bảng gom 10 can theo hai kiểu khác nhau
              </h3>
              <p>
                Nhìn cách gom sẽ hiểu vì sao số hướng của hai vị lệch nhau. Dưới đây là chính hai bảng
                của công cụ, chỉ được sắp lại theo hướng:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <GroupCard
                  tone="hy"
                  title={`Hỷ Thần — ${HY_GROUPS.length} hướng, mỗi hướng 2 can`}
                  groups={HY_GROUPS}
                  note="Để ý quy luật: hai can dùng chung một hướng luôn cách nhau đúng 5 bậc trong vòng 10 can (Giáp thứ 1 – Kỷ thứ 6, Ất thứ 2 – Canh thứ 7…). Nhờ vậy chỉ cần nhớ 5 vế là đủ cả 10 ngày."
                />
                <GroupCard
                  tone="tai"
                  title={`Tài Thần — ${TAI_GROUPS.length} hướng, gom không đều`}
                  groups={TAI_GROUPS}
                  note="Ở đây các can ghép chung lại là can liền kề (Giáp – Ất, Bính – Đinh, Canh – Tân), còn bốn can Mậu, Kỷ, Nhâm, Quý mỗi can một hướng riêng. Không có khẩu quyết ngắn nào gói được bảng này, nên tra bảng vẫn là cách chắc chắn nhất."
                />
              </div>
              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                <p className="font-heading text-sm font-semibold text-foreground">
                  Hai hướng trùng nhau, và hai hướng ngược nhau
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Đọc chéo hai bảng sẽ thấy hai trường hợp đáng nhớ. Chỉ ngày mang can{' '}
                  <strong className="text-foreground">{CAN_TRUNG_HUONG.join(', ')}</strong> là Hỷ Thần
                  và Tài Thần cùng chỉ về một hướng — hôm đó bước ra một phía là xong cả hai. Ngược
                  lại, ngày can <strong className="text-foreground">Ất</strong> (Tây Bắc / Đông Nam)
                  và ngày can <strong className="text-foreground">Quý</strong> (Đông Nam / Tây Bắc) có
                  hai hướng <strong className="text-foreground">đối nhau 180 độ</strong> — không thể
                  đi cả hai, buộc phải chọn theo việc mình định làm, hoặc đơn giản là chọn phía tiện
                  đường hơn.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'bang-tra-theo-can-ngay',
          tocLabel: 'Bảng tra 10 can',
          heading: 'Bảng tra: can của ngày → hướng của từng vị',
          children: (
            <div className="space-y-5 text-foreground/85 leading-relaxed">
              <p>
                Đây là toàn bộ dữ liệu mà công cụ dùng — đúng{' '}
                <strong>10 dòng cho 10 thiên can</strong>, không hơn. Biết can của ngày là tra ra
                ngay, không phải tính gì thêm.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">#</th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Can của NGÀY
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hỷ Thần (cầu may)
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Tài Thần (cầu tài)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CAN_ORDER.map((can, i) => (
                      <tr key={can} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-mono text-xs text-gold-700">
                          {String(i + 1).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-2 font-medium text-foreground">Ngày {can}</td>
                        <td className="px-4 py-2 text-foreground">{HY_THAN[can]}</td>
                        <td className="px-4 py-2 text-muted-foreground">{TAI_THAN[can]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Bảng này <strong>không có cột nào cho tuổi</strong>, cũng không có cột nào cho chi của
                ngày — bằng chứng trực quan cho câu “hướng đổi theo ngày, không đổi theo người”.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Tra tay trong hai bước</h3>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Lấy can chi của ngày</strong> rồi giữ lại phần <strong>can</strong> (chữ đầu
                  tiên). Bạn không cần tự tính:{' '}
                  <Link href="/lich-van-nien" className={linkCls}>Lịch Vạn Niên</Link> hiển thị sẵn
                  can chi từng ngày, và công cụ xuất hành cũng tự suy bằng cùng một engine.
                </li>
                <li>
                  <strong>Dóng can đó xuống bảng trên</strong>, đọc hai ô hướng. Xong. Phần chi (chữ
                  thứ hai) bỏ qua — nó chỉ có việc ở lớp chọn giờ.
                </li>
              </ol>
              <h3 className="text-lg font-semibold text-foreground">Ba ví dụ tra tay</h3>
              <ul className="list-disc space-y-2 pl-5">
                {VI_DU.map((v) => (
                  <li key={v.ngay}>
                    <strong>{v.ngay}</strong> — ngày {v.canChi}. Giữ can <strong>{v.can}</strong>,
                    dóng xuống bảng: Hỷ Thần <strong>{HY_THAN[v.can]}</strong>, Tài Thần{' '}
                    <strong>{TAI_THAN[v.can]}</strong>. {v.y}
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                <p className="font-heading text-sm font-semibold text-foreground">
                  Ví dụ 1 và ví dụ 3 nói lên toàn bộ cơ chế
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Ngày <strong className="text-foreground">7/9/2026 (Giáp Thân)</strong> và ngày{' '}
                  <strong className="text-foreground">17/9/2026 (Giáp Ngọ)</strong> cách nhau đúng 10
                  ngày. Chi đã đổi từ Thân sang Ngọ, mùa đã khác, thứ trong tuần đã khác — nhưng vì
                  can vẫn là Giáp nên hai hướng{' '}
                  <strong className="text-foreground">giống hệt nhau</strong>. Còn ngày{' '}
                  <strong className="text-foreground">9/9/2026 (Bính Tuất)</strong>, chỉ cách ví dụ 1
                  có hai hôm, đã đổi cả hai hướng. Vòng can gồm 10 tên nên{' '}
                  <strong className="text-foreground">hướng xuất hành lặp lại theo chu kỳ 10 ngày</strong>
                  , không phải 7 ngày như tuần lễ và cũng không phải 12 như con giáp.
                </p>
              </div>

              <p className="text-sm text-foreground/70">
                Một mốc để bạn tự kiểm chứng công cụ: ngày <strong>17/2/2026</strong> là ngày{' '}
                <strong>Nhâm Tuất</strong> — tra bảng ra Hỷ Thần <strong>{HY_THAN['Nhâm']}</strong>,
                Tài Thần <strong>{TAI_THAN['Nhâm']}</strong>. Bạn có thể nhập chính ngày đó vào{' '}
                <Link href="/xuat-hanh" className={linkCls}>công cụ xuất hành</Link> và đối chiếu.
              </p>
            </div>
          ),
        },
        {
          id: 'khac-huong-nha-the-nao',
          tocLabel: 'Khác hướng nhà ra sao',
          heading: 'Đừng gộp với hướng nhà: hai hệ hoàn toàn khác nhau',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là hiểu nhầm phổ biến nhất về chủ đề này, và nó gây hậu quả thật: có người tra
                được “hướng tốt” của mình rồi tưởng đó là hướng phải đi mỗi sáng; có người tra hướng
                xuất hành hôm nay rồi định xoay lại cửa nhà. Cả hai đều lẫn hai hệ vốn không dính gì
                tới nhau.
              </p>

              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground"> </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hướng xuất hành
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hướng nhà (Bát Trạch)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SO_SANH.map((r) => (
                      <tr key={r.tieuChi} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">{r.tieuChi}</td>
                        <td className="px-4 py-2 text-foreground">{r.xuatHanh}</td>
                        <td className="px-4 py-2 text-muted-foreground">{r.nha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Một câu để không bao giờ lẫn nữa
              </h3>
              <p>
                <strong>Hướng xuất hành đi theo tờ lịch; hướng nhà đi theo con người.</strong> Xé một
                tờ lịch là hướng xuất hành đổi. Còn hướng nhà thì có xé hết cuốn lịch cũng không đổi,
                vì nó tính từ năm sinh — thứ cả đời chỉ có một.
              </p>
              <p>
                Vì thế hai hệ <strong>không mâu thuẫn nhau và cũng không cộng dồn với nhau</strong>.
                Nhà bạn quay hướng Tây mà hôm nay Hỷ Thần ở Đông Bắc thì chẳng có gì “xung” cả: cửa
                nhà vẫn đứng yên ở chỗ của nó, còn bạn thì đi bộ hoặc chạy xe về phía Đông Bắc một
                đoạn rồi đi tiếp việc của mình. Đừng cố ghép điểm số của hai hệ lại thành một kết
                luận — chúng không đo cùng một thứ.
              </p>
              <p className="text-sm text-foreground/70">
                Nói thêm cho đủ: hướng bàn làm việc, hướng bếp… đều thuộc nhóm “đồ vật đứng yên trong
                nhà”, tức cùng phe với hướng nhà chứ không phải phe hướng xuất hành. Xem{' '}
                <Link href="/huong-nha" className={linkCls}>công cụ hướng nhà</Link> nếu bạn cần lớp
                đó.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: hướng giúp gì, không giúp gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phần quan trọng nhất của bài — quan trọng hơn cả bảng tra ở trên.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Đây là quy ước phong tục, không có cơ sở thiên văn
              </h3>
              <p>
                “Hỷ Thần”, “Tài Thần” là <strong>thần sát trong lịch pháp</strong> — những cái tên
                trong hệ thống lịch cổ, <strong>không phải thiên thể có thật</strong>. Không kính
                thiên văn nào nhìn thấy Tài Thần đang đứng ở Chính Đông vào một ngày Bính. Cách gán
                mỗi can một phương vị là <strong>một quy ước do người xưa đặt ra rồi truyền lại</strong>
                : gọn gàng, dễ nhớ, lặp đúng chu kỳ 10 ngày — nhưng không phải quy luật tự nhiên đo
                được.
              </p>
              <p>
                Bằng chứng rõ nhất cho việc đây là quy ước: <strong>các phái ghi khác nhau</strong>.
                Riêng bảng Tài Thần đã có mấy dòng tư liệu Trung Hoa cho ra hướng khác nhau ở cùng một
                ngày, và hieu.asia chọn bản lịch vạn niên Việt Nam vì đó là chuẩn quen thuộc với tục
                xuất hành của người Việt. Nếu đây là một hiện tượng đo được thì đã không có chuyện các
                bản chép mỗi bản một kiểu.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Nó giúp được gì thật</h3>
              <p>
                Ba thứ, và cả ba đều có thật. <strong>Một nghi thức khởi đầu nhẹ nhàng</strong> — bước
                ra cửa với một ý định rõ ràng thay vì trong vội vã, giá trị tâm lý này rõ nhất vào
                sáng mùng Một. <strong>Một điểm chung với người thân lớn tuổi</strong> — nhiều gia
                đình giữ tục này vì tình cảm chứ không vì tin nó “linh”, và cùng nhau giữ một nếp đẹp
                là lý do đủ tốt. <strong>Sự minh bạch</strong> — vì hướng chỉ suy từ can ngày nên ai
                tra cũng ra như nhau, không có chỗ cho ai đó “xem riêng cho bạn” rồi ra kết quả đặc
                biệt và bán kèm dịch vụ.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Đường đi an toàn quan trọng hơn hướng đi
              </h3>
              <p>
                Nói rất rõ ràng: <strong>một chuyến đi được chuẩn bị kỹ luôn giá trị hơn một chuyến
                đi đúng hướng</strong>. Kiểm tra xe, ngủ đủ trước khi lái đường dài, xem trước lộ
                trình, mang đủ giấy tờ, không uống rượu — đó mới là những thứ thật sự quyết định
                chuyến đi của bạn kết thúc thế nào. Hướng xuất hành nằm ở lớp ngoài cùng, lớp nghi
                thức.
              </p>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] p-4">
                <p className="font-heading text-sm font-semibold text-foreground">
                  Đừng đánh đổi an toàn để lấy “đúng hướng”
                </p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Đừng đi vòng qua đoạn đường xấu, đường lạ,
                    đường tối</strong> chỉ để xuất phát đúng phương vị. Rủi ro có thật của một cung
                    đường xấu lớn hơn nhiều lần lợi ích tinh thần của việc đi đúng hướng.
                  </li>
                  <li>
                    <strong className="text-foreground">Đừng quay đầu xe giữa dòng phương tiện</strong>{' '}
                    khi sực nhớ ra mình đi nhầm phía. Không có gì phải sửa cả.
                  </li>
                  <li>
                    <strong className="text-foreground">Đừng để trễ giờ</strong> — trễ chuyến bay, trễ
                    cuộc hẹn, trễ giờ đón con — vì đang loay hoay tìm hướng.{' '}
                    <strong className="text-foreground">Và đừng để ai bán cho bạn lễ hoá giải</strong>{' '}
                    vì “năm nay xuất hành sai hướng”: hieu.asia không bán, và cũng không cho rằng có
                    gì cần giải.
                  </li>
                </ul>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Những gì bảng tra này không chứa
              </h3>
              <p>
                Cần nói rõ để bạn không đi tìm nhầm chỗ. Dữ liệu của công cụ chỉ gồm{' '}
                <strong>hướng theo can ngày</strong>. Nó <strong>không</strong> chứa quãng đường phải
                đi, số phút phải đi, câu khấn, lễ vật, hay bất kỳ nghi thức nào. Ở đâu bạn gặp một con
                số cụ thể kiểu “đi đủ bao nhiêu mét”, hãy hiểu đó là tập tục địa phương hoặc ý người
                viết — không đến từ bảng tra này. Còn <strong>giờ</strong> xuất phát là một lớp riêng,
                có bảng riêng và cơ chế riêng, đọc ở{' '}
                <Link href="/learn/gio-hoang-dao" className={linkCls}>bài Giờ Hoàng Đạo</Link>.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <XuatHanhWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <XuatHanhRecall />,
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
                Muốn biết hôm nay đi hướng nào?{' '}
                <Link href="/xuat-hanh" className={linkCls}>
                  Tra hướng xuất hành miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/xuat-hanh', label: 'Hướng & giờ xuất hành theo ngày' },
                    { href: '/gio-hoang-dao', label: 'Tra giờ hoàng đạo theo ngày' },
                    { href: '/lich-van-nien', label: 'Lịch Vạn Niên — can chi từng ngày' },
                    { href: '/xem-ngay', label: 'Xem ngày tốt cho việc của bạn' },
                    { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
                    { href: '/huong-nha', label: 'Hướng nhà hợp tuổi' },
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
          children: <XuatHanhChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
