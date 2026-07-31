/**
 * Bài học /learn/xong-dat — TỤC XÔNG ĐẤT đầu năm.
 *
 * GROUNDING — mọi quy tắc, điểm số, ngày tháng trên trang này KHÔNG gõ tay mà
 * dẫn thẳng từ engine đang chạy công cụ /xong-dat:
 *   • lib/xong-dat.ts → defaultTargetYear() (kỳ Tết trang đang nói tới; lật vào
 *     mùng 1 và giữ hết mùng 3), tetMoc() (mùng 1 dương lịch, dò bằng bộ lịch âm
 *     của repo), yearChiGroups() (nhóm chi theo chi năm), rankCandidates() /
 *     checkXongDat() (chấm 3 lớp), TIER_META (4 nhóm kết quả).
 *     → Thang điểm từng lớp + ngưỡng xếp nhóm ở dưới được DÒ NGƯỢC từ engine (quét
 *       ứng viên rồi gom nhãn + điểm thật), nên không thể lệch với công cụ.
 *   • lib/tai-lieu/xong-dat-guide.ts → howToChoose(), DO_AND_DONT, DISCLAIMER.
 *   • lib/sinh-con.ts → yearProfile(); lib/dat-ten-ngu-hanh.ts → ELEMENTS.
 *   • trang công cụ app/xong-dat/ (hub + [tuoi] + years.ts) — phạm vi, giọng, và
 *     các câu FAQ cần TRÁNH lặp lại.
 *
 * PHÂN VAI (chống trùng bài): trang này sở hữu TỤC XÔNG ĐẤT — người đầu tiên
 * bước vào nhà sáng mùng Một, vì sao người Việt coi trọng chuyện đó, tiêu chí
 * chọn người, và nghi thức thực tế. KHÔNG dạy lại hình học tam hợp – lục hợp –
 * lục xung (/learn/tam-hop-luc-xung), nạp âm và mệnh ngũ hành (/learn/nap-am),
 * hay chọn ngày giờ (/learn/trach-cat): mỗi thứ chỉ nhắc 1–2 câu kèm link.
 *
 * ⚠️ Kỳ Tết LẬT vào mùng 1 nên mọi giá trị đọc từ engine phải tính LÚC RENDER,
 * không gán ra hằng số cấp module — và route phải khai `revalidate` (xem ghi chú
 * dài trong lib/nam-muc-tieu.ts và lib/xong-dat.ts).
 */

import * as React from 'react';
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
import { ELEMENTS } from '@/lib/dat-ten-ngu-hanh';
import { yearProfile } from '@/lib/sinh-con';
import {
  TIER_META,
  checkXongDat,
  defaultTargetYear,
  rankCandidates,
  tetMoc,
  yearChiGroups,
  type AxisResult,
  type XongDatResult,
  type XongDatTier,
} from '@/lib/xong-dat';
import { DO_AND_DONT, XONG_DAT_DISCLAIMER, howToChoose } from '@/lib/tai-lieu/xong-dat-guide';
import { slugOf } from '@/app/xong-dat/years';
import {
  XongDatFrame,
  XongDatDepth,
  XongDatRecall,
  XongDatChecklist,
  XongDatWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Xông đất — tục chọn người mở đầu năm mới',
  description:
    'Xông đất là gì, vì sao người Việt trọng người bước vào nhà đầu tiên sáng mùng Một, và cách chọn: tiêu chí hợp tuổi lẫn tiêu chí con người.',
  alternates: { canonical: 'https://hieu.asia/learn/xong-dat' },
};

// Kỳ Tết lật vào mùng 1 → nếu không có dòng này, năm bị nướng vào HTML từ lúc
// dựng và Tết qua rồi trang vẫn nói về kỳ Tết cũ.
export const revalidate = 86400;

/** Gia chủ dùng làm ví dụ xuyên suốt bài — có sẵn trang riêng /xong-dat/sinh-nam-1988. */
const EXAMPLE_HOST = 1988;

/** Các cặp (khách, gia chủ) dùng cho phần ví dụ đọc kết quả. */
const EXAMPLE_PAIRS: { guest: number; host: number }[] = [
  { guest: 1983, host: EXAMPLE_HOST },
  { guest: 1993, host: EXAMPLE_HOST },
  { guest: 1984, host: 1990 },
];

/**
 * Trong 5 bước của howToChoose(), bước ĐẦU và bước CUỐI không đụng tới bảng tra
 * nào — đó là phần "con người". Ba bước giữa là phần tính được từ năm sinh.
 * Giữ ở đây dưới dạng chỉ số để phần chữ của guide vẫn là nguồn duy nhất.
 */
const HUMAN_STEP_INDEXES = new Set([0, 4]);

const TAG = 'rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em]';
const TAG_HUMAN = `${TAG} border-gold/40 text-gold-700`;
const TAG_CHART = `${TAG} border-border text-muted-foreground`;

type AxisKey = 'chiNam' | 'chiChu' | 'menhChu';

/**
 * Thang điểm của MỘT lớp — dò ngược từ engine: quét toàn bộ ứng viên của một gia
 * chủ rồi gom các nhãn khác nhau kèm điểm thực tế. Dải ứng viên trải 48 năm liên
 * tiếp nên phủ đủ 12 con giáp và cả 5 hành, tức mọi trường hợp đều lộ ra.
 */
function axisScale(rows: XongDatResult[], axis: AxisKey): { label: string; score: number }[] {
  const seen = new Map<string, number>();
  for (const r of rows) {
    const a = r[axis];
    if (!seen.has(a.label)) seen.set(a.label, a.score);
  }
  return [...seen]
    .map(([label, score]) => ({ label, score }))
    .sort((a, b) => b.score - a.score);
}

const signed = (n: number) => (n > 0 ? `+${n}` : String(n));

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ trên trang (chống cloaking). Các câu ở đây cố ý KHÁC hẳn FAQ của trang
// công cụ /xong-dat (vốn hỏi về quy tắc chấm, ngày mùng 1, tuổi đẹp theo chi
// năm, tuổi âm hay dương): bài học hỏi về TỤC và cách cư xử.
const FAQS = [
  {
    q: 'Xông đất là gì và diễn ra vào lúc nào?',
    a: 'Xông đất là tục mở đầu năm mới của người Việt: người đầu tiên bước vào nhà sau giao thừa được xem là người "mở khí" cho cả năm. Khoảng thời gian được nói tới là từ sau giao thừa đến sáng mùng Một. Theo lệ, đó là người đã được gia chủ mời trước và hẹn rõ giờ, chứ không phải bất kỳ ai tình cờ tới sớm nhất.',
  },
  {
    q: 'Trong tục xông đất, "gia chủ" được hiểu là ai?',
    a: 'Là người đứng tên nhà, hoặc người lớn nhất trong nhà. Đây là điều cần thống nhất trước khi tra, vì lớp thứ hai của cách chấm so tuổi người xông đất với tuổi gia chủ — chọn nhầm người làm mốc thì kết quả lệch theo. Nếu trong nhà có nhiều thế hệ và mọi người không thống nhất được, cứ lấy người đứng tên nhà cho gọn.',
  },
  {
    q: 'Ngoài tuổi ra, còn tiêu chí nào để chọn người xông đất?',
    a: 'Có, và theo hướng dẫn thì phần này quan trọng hơn phần tuổi. Nên là người vui vẻ, hoà nhã, gia đình êm ấm, năm vừa rồi làm ăn thuận và thật lòng quý gia đình bạn. Đây là phần không nằm trong bảng tra nào cả, nên phải tự cân nhắc. Bước chốt cũng vậy: nếu người hợp tuổi nhất lại là người bạn không thân hoặc ở xa không sang được, thì chọn người khác.',
  },
  {
    q: 'Có cần hẹn trước không, hay cứ để ai sang thì sang?',
    a: 'Nên hẹn trước. Ba việc được khuyên làm đều là chuyện chuẩn bị: hẹn trước với người bạn muốn mời và nói rõ giờ để họ chủ động và không ai vào nhà trước; dặn người nhà đi chơi giao thừa về sau khi khách đã tới; chuẩn bị sẵn phong bao mừng tuổi và một lời chúc thật lòng. Không khí là thứ người ta nhớ, không phải con số tuổi.',
  },
  {
    q: 'Người trong nhà tự xông đất cho nhà mình có được không?',
    a: 'Hoàn toàn được và không kiêng gì cả. Đây cũng là cách xử lý gọn nhất khi gia đình ngại chuyện mời ai và không mời ai: nhà tự thu xếp thì không phải canh cửa, cũng không đặt ai vào thế khó. Người trong nhà xông đất không bị coi là "kém thiêng" hơn khách từ ngoài vào.',
  },
  {
    q: 'Lỡ có người khác bước vào nhà trước người mình mời thì xử lý thế nào?',
    a: 'Đón tử tế như mọi khách Tết khác. Không cần từ chối hay đuổi khách đã trót vào nhà: xử sự như vậy làm hỏng tình thân, mà cái mất đó thì có thật. Cũng không cần mua lễ giải hạn vì chuyện này — không có căn cứ nào cho việc đó, và đây đúng là chỗ người ta hay bán nỗi sợ.',
  },
  {
    q: 'Có nên nói thẳng với người thân rằng tuổi họ không hợp để xông đất không?',
    a: 'Trong hầu hết trường hợp là không nên. Một người biết mình bị loại khỏi sáng mùng Một vì năm sinh sẽ nhớ chuyện đó rất lâu, và tổn thương ấy là có thật; thứ đổi lại chỉ là một dòng trong bảng tra của một tập tục truyền lại. Nếu vẫn muốn theo lệ, cách nhẹ nhàng là mời người mình chọn tới sớm hơn rồi hẹn những người khác một khung giờ sau đó — không ai phải nghe lời từ chối nào.',
  },
  {
    q: 'Xông đất và xuất hành đầu năm khác nhau thế nào?',
    a: 'Hai tục khác nhau và không thay thế nhau. Xông đất nói về người bước VÀO nhà bạn đầu tiên sau giao thừa. Xuất hành nói về việc chính bạn bước RA khỏi nhà lần đầu trong năm mới, và người ta xem giờ cùng hướng đi. Một bên là khách đến, một bên là mình đi — bạn có thể quan tâm cả hai hoặc chỉ một, tuỳ nếp nhà.',
  },
];

const JSONLD = [
  article({
    headline: 'Xông đất: hiểu tục chọn người mở đầu năm mới của người Việt',
    description:
      'Tục xông đất: người đầu tiên bước vào nhà sáng mùng Một, vì sao người Việt coi trọng, tiêu chí chọn người (hợp tuổi và ngoài lá số) cùng nghi thức thực tế.',
    url: '/learn/xong-dat',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Xông đất', url: '/learn/xong-dat' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Xông đất — tục chọn người mở đầu năm mới',
    description:
      'Xông đất là gì, vì sao người Việt trọng người bước vào nhà đầu tiên sáng mùng Một, và cách chọn: tiêu chí hợp tuổi lẫn tiêu chí con người.',
    url: '/learn/xong-dat',
  }),
];

function AxisTable({
  caption,
  rows,
}: {
  caption: React.ReactNode;
  rows: { label: string; score: number }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[420px] text-left text-sm">
        <caption className="px-4 pt-3 text-left text-sm font-semibold text-foreground">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-border bg-card/60">
            <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
              Trường hợp
            </th>
            <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
              Điểm
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-border/60 last:border-b-0">
              <td className="px-4 py-2 text-muted-foreground">{r.label}</td>
              <td className="px-4 py-2 tabular-nums text-foreground">{signed(r.score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AxisLine({ axis }: { axis: AxisResult }) {
  return (
    <li>
      <strong className="text-foreground">{axis.label}</strong>{' '}
      <span className="font-mono tabular-nums text-gold-700">{signed(axis.score)}</span> —{' '}
      <span className="text-muted-foreground">{axis.text}</span>
    </li>
  );
}

export default function LearnXongDatPage() {
  // Kỳ Tết đang nói tới lật vào mùng 1 → đọc MỘT LẦN ở đầu hàm render.
  const targetYear = defaultTargetYear();
  const target = yearProfile(targetYear)!;
  const tet = tetMoc(targetYear);
  const groups = yearChiGroups(targetYear)!;
  const steps = howToChoose(target);
  const chiTen = (zs: { ten: string }[]) => zs.map((z) => z.ten).join(', ');

  // Quét toàn bộ ứng viên của một gia chủ → thang điểm thật của từng lớp.
  const ranked = rankCandidates(EXAMPLE_HOST, targetYear);
  const exampleHost = yearProfile(EXAMPLE_HOST)!;
  const chiNamScale = axisScale(ranked, 'chiNam');
  const chiChuScale = axisScale(ranked, 'chiChu');
  const menhChuScale = axisScale(ranked, 'menhChu');

  // Mức trừ nặng nhất — chạm mức này là bị cắt thẳng xuống nhóm cuối.
  const hardScore = Math.min(
    ...[...chiNamScale, ...chiChuScale, ...menhChuScale].map((r) => r.score),
  );

  // Ngưỡng tổng điểm của từng nhóm: lấy tổng nhỏ nhất trong số các ứng viên
  // KHÔNG dính luật cắt (nếu dính thì tổng không còn quyết định nhóm nữa).
  const notHard = (r: XongDatResult) =>
    r.chiNam.score > hardScore && r.chiChu.score > hardScore && r.menhChu.score > hardScore;
  const soft = ranked.filter(notHard);
  const tierFloors = (['rat-hop', 'hop', 'binh'] as XongDatTier[])
    .map((tier) => ({ tier, totals: soft.filter((r) => r.tier === tier).map((r) => r.total) }))
    .filter((t) => t.totals.length > 0)
    .map((t) => ({ tier: t.tier, floor: Math.min(...t.totals) }));

  const examples = EXAMPLE_PAIRS.map((p) => checkXongDat(p.guest, p.host, targetYear)).filter(
    (r): r is XongDatResult => r !== null,
  ); // engine trả null chỉ khi năm ngoài 1900–2100

  return (
    <LearnArticle
      eyebrow="PHONG TỤC · TẾT"
      title={
        <>
          Xông đất{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (người mở đầu năm)
          </span>
        </>
      }
      standfirst={
        <>
          Sáng mùng Một, ai bước vào nhà bạn đầu tiên? Người Việt đặt cho khoảnh khắc ấy một cái tên
          và cả một nếp chuẩn bị. Bài này giải thích vì sao tục ấy tồn tại, chọn người ra sao — và
          vì sao phần quan trọng nhất lại nằm ngoài mọi bảng tra.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Xông đất' },
      ]}
      relatedLenses={relatedLearnLenses('xong-dat')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh gia chủ, hệ thống chấm công khai từng lớp rồi xếp hạng các tuổi gợi ý cho kỳ Tết sắp tới — kèm nhóm tuổi nên cân nhắc và lý do cụ thể.',
        href: '/xong-dat',
        label: 'Xem tuổi xông đất',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <XongDatFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Xông đất là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Xông đất</strong> là tục mở đầu năm mới của người Việt:{' '}
                <strong>người đầu tiên bước vào nhà bạn sau giao thừa</strong> được xem là người “mở
                khí” cho cả năm. Khoảng thời gian được nói tới là từ sau giao thừa đến sáng mùng
                Một. Kỳ Tết mà trang này đang nói tới là Tết{' '}
                <strong>
                  {target.canChi} {targetYear}
                </strong>
                , mùng 1 rơi vào {tet.thu}, ngày <strong>{tet.ngay}</strong> dương lịch.
              </p>
              <p>
                Điểm dễ hiểu sai nhất nằm ngay ở định nghĩa: theo lệ, người xông đất là{' '}
                <strong>người được mời trước</strong> và hẹn rõ giờ — không phải bất kỳ ai tình cờ
                bấm chuông sớm nhất. Xông đất là một lời mời có chuẩn bị, không phải cuộc chạy đua
                “ai đến trước thì tính”.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Xông đất là <strong>một nghi thức đánh dấu mốc</strong> — cùng họ với tục mở hàng
                  đầu năm hay lời chúc đầu năm. Nó gói một mong muốn rất người: mở đầu chu kỳ mới
                  bằng một điều dễ chịu.
                </li>
                <li>
                  Phần “xem tuổi” chỉ là <strong>một lớp lọc tham khảo</strong>, dùng khi gia đình
                  đằng nào cũng đang cân nhắc giữa vài người quen. Nó không phải điều kiện tiên
                  quyết, và càng không phải lời phán về phúc hoạ.
                </li>
                <li>
                  Nó <strong>không phải một cơ chế nhân quả</strong>. Nói đúng như ghi chú của chính
                  công cụ: không có chuyện mời sai tuổi thì xui cả năm.
                </li>
              </ul>
              <p>
                Và đây là ranh giới của bài: chuyện <em>vì sao</em> hai con giáp được coi là hợp hay
                xung là hình học của vòng 12 chi, có{' '}
                <Link
                  href="/learn/tam-hop-luc-xung"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bài riêng
                </Link>
                ; chuyện mệnh ngũ hành suy ra từ đâu thì nằm ở bài{' '}
                <Link
                  href="/learn/nap-am"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  nạp âm
                </Link>
                . Ở đây bạn học <strong>chính cái tục</strong>: ai, khi nào, chọn thế nào, cư xử ra
                sao.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <XongDatDepth />,
        },
        {
          id: 'tieu-chi-chon-nguoi',
          tocLabel: 'Tiêu chí chọn người',
          heading: 'Tiêu chí chọn người: phần tính được và phần không tính được',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Hướng dẫn đi kèm công cụ có đúng <strong>{steps.length} bước</strong>. Điều đáng chú
                ý là <strong>bước đầu và bước cuối đều không đụng tới bảng tra nào</strong> — chúng
                nói về con người. Ba bước ở giữa mới là phần tính được từ năm sinh.
              </p>
              <ol className="space-y-4">
                {steps.map((s, i) => (
                  <li key={s.heading} className="rounded-xl border border-border p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground">{s.heading}</span>
                      <span className={HUMAN_STEP_INDEXES.has(i) ? TAG_HUMAN : TAG_CHART}>
                        {HUMAN_STEP_INDEXES.has(i) ? 'Tiêu chí con người' : 'Tiêu chí lá số'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                  </li>
                ))}
              </ol>
              <p className="text-sm text-foreground/70">
                Đọc lại thứ tự ấy một lần nữa: bảng tra nằm <em>kẹp giữa</em> hai lần nhắc “chọn
                người”. Đó không phải cách trình bày ngẫu nhiên — nó nói rằng phần tuổi chỉ để{' '}
                <strong>xếp hạng vài phương án đã lọt vào vòng trong</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ba lớp tính được — và thang điểm thật
              </h3>
              <p>
                Ba bảng dưới đây <strong>không được gõ tay</strong>: trang quét toàn bộ ứng viên của
                một gia chủ rồi đọc lại nhãn và điểm mà engine thực sự trả về, nên chúng luôn khớp
                với kết quả bạn thấy trong công cụ.
              </p>

              <AxisTable
                caption={
                  <>
                    Lớp 1 — tuổi khách so với <strong>chi của năm</strong>
                  </>
                }
                rows={chiNamScale}
              />
              <p className="text-sm text-foreground/70">
                Áp vào kỳ Tết đang tới: năm {target.canChi} có chi {target.zodiac.ten}, nên nhóm tam
                hợp là tuổi {chiTen(groups.tamHop)}, lục hợp là tuổi {chiTen(groups.lucHop)}; nhóm
                cần cân nhắc theo tục gồm tuổi {chiTen(groups.xung)} (xung),{' '}
                {chiTen(groups.hai)} (hại) và {chiTen(groups.trung)} (trùng chi năm). Vì sao lại là
                đúng những tuổi đó thì{' '}
                <Link
                  href="/learn/tam-hop-luc-xung"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bài tam hợp – lục xung
                </Link>{' '}
                giải thích bằng hình học, chỉ mất vài phút.
              </p>

              <AxisTable
                caption={
                  <>
                    Lớp 2 — tuổi khách so với <strong>tuổi gia chủ</strong>
                  </>
                }
                rows={chiChuScale}
              />
              <p className="text-sm text-foreground/70">
                “Gia chủ” ở đây là người đứng tên nhà hoặc người lớn nhất trong nhà — cần thống nhất
                trước khi tra, vì chọn nhầm người làm mốc thì cả lớp này lệch theo.
              </p>

              <AxisTable
                caption={
                  <>
                    Lớp 3 — <strong>mệnh nạp âm</strong> hai bên (nhãn theo ví dụ gia chủ sinh{' '}
                    {EXAMPLE_HOST}, mệnh {ELEMENTS[exampleHost.element].name})
                  </>
                }
                rows={menhChuScale}
              />
              <p className="text-sm text-foreground/70">
                Trường hợp được chuộng nhất là mệnh khách <strong>tương sinh</strong> cho mệnh gia
                chủ — cách nói xưa là khách “tiếp khí” cho nhà. Mệnh của một người suy ra từ nạp âm
                của năm sinh chứ không từ can hay chi; nếu bạn chưa chắc mình mệnh gì, xem{' '}
                <Link
                  href="/learn/nap-am"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bài nạp âm
                </Link>{' '}
                hoặc tra thẳng ở{' '}
                <Link href="/ban-menh" className="text-gold-700 underline-offset-4 hover:underline">
                  công cụ bản mệnh
                </Link>
                .
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Cộng ba lớp lại — và một luật cắt
              </h3>
              <p>
                Tổng điểm quyết định nhóm kết quả:{' '}
                {tierFloors.map((t, i) => (
                  <span key={t.tier}>
                    {i > 0 ? '; ' : ''}từ <strong>{signed(t.floor)}</strong> trở lên là{' '}
                    <strong>{TIER_META[t.tier].label}</strong>
                  </span>
                ))}
                ; dưới đó là <strong>{TIER_META['nen-can-nhac'].label}</strong>.
              </p>
              <p>
                Nhưng có một luật đứng <em>trên</em> phép cộng:{' '}
                <strong>
                  lớp nào chạm mức {hardScore} thì bị xếp thẳng vào nhóm{' '}
                  {TIER_META['nen-can-nhac'].label}
                </strong>
                , dù tổng có thể chưa thấp. Đây là cách engine mô phỏng đúng thói quen kiêng phổ
                biến — người ta không “bù trừ” những trường hợp nặng nhất.
              </p>
            </div>
          ),
        },
        {
          id: 'vi-du-chon',
          tocLabel: 'Ví dụ đọc kết quả',
          heading: 'Ba ví dụ đọc kết quả từ đầu đến cuối',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>Cách tự làm gọn trong ba bước:</p>
              <ol className="list-decimal space-y-1.5 pl-5">
                <li>
                  Đổi năm sinh của <strong>cả khách lẫn gia chủ</strong> ra can chi và mệnh nạp âm
                  (nhớ: tính theo năm âm lịch).
                </li>
                <li>Đối chiếu ba lớp ở trên, ghi lại điểm từng lớp.</li>
                <li>Cộng lại, rồi kiểm xem có lớp nào chạm mức {hardScore} không.</li>
              </ol>
              <p>
                Ba ví dụ dưới đây tính bằng đúng engine của công cụ, cho kỳ Tết{' '}
                {target.canChi} {targetYear}:
              </p>

              <div className="space-y-4">
                {examples.map((r, i) => {
                  const axes: AxisResult[] = [r.chiNam, r.chiChu, r.menhChu];
                  const hardAxes = axes.filter((a) => a.score <= hardScore);
                  return (
                    <div
                      key={`${r.guest.year}-${r.host.year}`}
                      className="rounded-xl border border-border p-4 sm:p-5"
                    >
                      <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                        Ví dụ {i + 1}
                      </p>
                      <p className="mt-2 text-sm">
                        <strong>Gia chủ sinh {r.host.year}</strong> — {r.host.canChi}, tuổi{' '}
                        {r.host.zodiac.ten}, mệnh {ELEMENTS[r.host.element].name} (
                        {r.host.napAmName}).
                      </p>
                      <p className="mt-1 text-sm">
                        <strong>Người được mời sinh {r.guest.year}</strong> — {r.guest.canChi}, tuổi{' '}
                        {r.guest.zodiac.ten}, mệnh {ELEMENTS[r.guest.element].name} (
                        {r.guest.napAmName}).
                      </p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
                        {axes.map((a) => (
                          <AxisLine key={a.label} axis={a} />
                        ))}
                      </ul>
                      <p className="mt-3 text-sm">
                        Tổng: <strong className="tabular-nums">{signed(r.total)}</strong> → nhóm{' '}
                        <strong>{TIER_META[r.tier].label}</strong>.{' '}
                        {hardAxes.length > 0 ? (
                          <>
                            Ở đây có {hardAxes.length} lớp chạm mức {hardScore} (
                            {hardAxes.map((a) => a.label).join(', ')}), nên{' '}
                            <strong>luật cắt được áp trước phép cộng</strong> — điểm cộng ở các lớp
                            khác không kéo lại được.
                          </>
                        ) : (
                          <>Không lớp nào chạm mức {hardScore}, nên tổng điểm quyết định nhóm.</>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="text-sm text-foreground/70">
                Điều cần rút ra: <strong>hợp tuổi chưa chắc đã “qua vòng”</strong>, vì
                còn hai lớp nữa; và ngược lại, một người bị xếp vào nhóm cuối không có nghĩa họ mang
                điều xấu tới — chỉ có nghĩa là theo tục thì người ta dè dặt hơn. Muốn xem đầy đủ
                danh sách tuổi gợi ý cho đúng năm sinh nhà bạn, dùng{' '}
                <Link href="/xong-dat" className="text-gold-700 underline-offset-4 hover:underline">
                  công cụ tuổi xông đất
                </Link>{' '}
                — ví dụ trang riêng cho{' '}
                <Link
                  href={`/xong-dat/${slugOf(EXAMPLE_HOST)}`}
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  gia chủ sinh {EXAMPLE_HOST}
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'nghi-thuc-thuc-te',
          tocLabel: 'Nghi thức thực tế',
          heading: 'Thực tế phải làm gì: giờ giấc, lời chúc, phong bao',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần này mới là thứ quyết định buổi sáng mùng Một của nhà bạn diễn ra êm hay gượng.
                Mốc thời gian đã rõ: giao thừa là đêm {tet.ngayTruoc}, và mùng 1 Tết{' '}
                {target.canChi} là {tet.thu}, ngày <strong>{tet.ngay}</strong> dương lịch. Tục xông
                đất diễn ra trong quãng từ sau giao thừa đến sáng mùng Một.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {DO_AND_DONT.map((block) => (
                  <div key={block.heading} className="rounded-xl border border-border p-4">
                    <h3 className="font-semibold text-foreground">{block.heading}</h3>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <p>
                Ba chi tiết đáng nhấn lại, vì chúng gỡ được gần hết tình huống khó xử trong thực tế:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hẹn giờ cụ thể.</strong> Người được mời cần biết mấy giờ nên sang; đó cũng
                  là cách để không ai vô tình vào trước họ.
                </li>
                <li>
                  <strong>Dặn người nhà.</strong> Nhóm đi chơi giao thừa nên về sau khi khách đã
                  tới. Nếu thấy phiền, cứ để chính người nhà xông đất — hoàn toàn được, không kiêng
                  gì.
                </li>
                <li>
                  <strong>Chuẩn bị phong bao và một lời chúc thật lòng.</strong> Đây là phần người
                  ta nhớ về sau, chứ không ai nhớ con số tuổi của khách.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Còn chuyện chọn ngày, chọn giờ đẹp cho các việc lớn khác trong năm thì thuộc một môn
                riêng —{' '}
                <Link
                  href="/learn/trach-cat"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  trạch cát
                </Link>{' '}
                — và không áp vào đây được, vì ngày xông đất luôn cố định là mùng Một. Nếu quan tâm
                giờ và hướng ra khỏi nhà đầu năm, đó là tục khác:{' '}
                <Link
                  href="/learn/xuat-hanh"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  xuất hành
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: một tục lệ tâm lý – xã hội, không phải nhân quả',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nói cho thẳng: xông đất là một <strong>tục lệ mang tính tâm lý – xã hội</strong>. Cái
                nó thật sự làm được là cho cả nhà một khởi đầu dễ chịu và một cảm giác yên tâm khi
                bước vào chu kỳ mới. Cái nó <strong>không</strong> làm được là quyết định chuyện lành
                dữ của mười hai tháng tiếp theo — không có cơ chế nào để năm sinh của một vị khách
                điều khiển công việc, sức khoẻ hay tiền bạc của một gia đình.
              </p>
              <p>
                Cách chấm ba lớp thì minh bạch và tính ra được: nhập cùng dữ liệu luôn ra cùng kết
                quả. Nhưng <strong>“tính được” không đồng nghĩa với “đúng”</strong>. Bản thân các quy
                tắc là tập tục truyền lại, và các trọng số cộng trừ là lựa chọn biên tập để xếp hạng
                — được công khai ngay trên trang công cụ chứ không giấu.
              </p>
              <p>
                Và đây là điều cần nói thẳng nhất, vì nó là rủi ro thật của tục này:{' '}
                <strong>đừng để việc “kén người” làm mất lòng họ hàng.</strong> Khi bạn nhắn một
                người thân rằng năm nay “tuổi bác không hợp”, người ấy sẽ hiểu ra mình vừa bị xếp
                vào loại điềm xấu — và tổn thương đó có thật, kéo dài, khó vá. Thứ đổi lại chỉ là
                một dòng trong bảng tra. Đó là một cuộc đổi chác rất tệ.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Nếu vẫn muốn theo lệ:{' '}
                  <strong>mời người mình chọn tới sớm hơn, rồi hẹn những người khác giờ sau</strong>{' '}
                  — không ai phải nghe một lời từ chối nào.
                </li>
                <li>
                  Ai đã trót sang thì <strong>đón tử tế</strong>. Từ chối hay đuổi khách làm hỏng
                  tình thân, và cái mất đó là có thật.
                </li>
                <li>
                  <strong>Không cần mua lễ “giải hạn”</strong> vì lỡ mời “sai tuổi”. Không có căn cứ
                  nào cho việc đó, và đây chính là chỗ người ta hay bán nỗi sợ. hieu.asia không bán
                  lễ giải hạn.
                </li>
              </ul>
              <p className="rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground">
                {XONG_DAT_DISCLAIMER}
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <XongDatWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <XongDatRecall />,
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
                Muốn biết tuổi nào hợp với đúng năm sinh nhà bạn cho kỳ Tết tới?{' '}
                <Link href="/xong-dat" className="text-gold-700 underline-offset-4 hover:underline">
                  Xem tuổi xông đất miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/xong-dat', label: 'Xem tuổi xông đất' },
                    { href: '/hop-tuoi', label: 'Xem hợp tuổi' },
                    { href: '/xuat-hanh', label: 'Hướng xuất hành' },
                    { href: '/ban-menh', label: 'Tra bản mệnh' },
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
          children: <XongDatChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
