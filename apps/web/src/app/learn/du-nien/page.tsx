/**
 * /learn/du-nien — bài chuyên sâu về 8 DU NIÊN TINH (bát biến du niên) và cách
 * dùng từng sao cho CHỖ NGỒI làm việc / bàn học. Công cụ tương ứng:
 * /huong-ban-lam-viec.
 *
 * GROUNDING (không có con số / nhãn nào ngoài các nguồn này):
 *   • src/lib/huong-nha.ts — STAR_INFO (8 sao: `name`, cờ `good`, `blurb` mô tả
 *     hướng đó tốt/xấu cho việc gì), batTrachMap() (thuật toán biến hào du niên:
 *     quẻ mệnh giữ nhãn Phục Vị, lật hào theo trình tự [trên, giữa, dưới, giữa,
 *     trên, giữa, dưới] sinh 7 quẻ kế, gán [Sinh Khí, Ngũ Quỷ, Diên Niên, Lục
 *     Sát, Họa Hại, Thiên Y, Tuyệt Mệnh]), cungPhi(), menhGroup(), groupLabel(),
 *     DIRECTION_ORDER, DONG_TU_MENH / TAY_TU_MENH, computeHuongNha().
 *   • src/lib/huong-ban-data.ts — DESK_USE (mỗi cát tinh hợp loại việc gì TRÊN
 *     BÀN), deskDirections(): workDir = sao Sinh Khí, studyDir = sao Phục Vị.
 *   • src/app/huong-ban-lam-viec/page.tsx + components/huong-ban/
 *     DeskDirectionChecker.tsx — "xét hướng người ngồi quay MẶT về (hướng
 *     nhìn)"; lưu ý thực dụng khi không xoay được bàn (đủ sáng, lưng có điểm
 *     tựa, không quay lưng ra cửa/lối đi, màn hình không chói).
 *
 * Mọi BẢNG trong bài đều DẪN THẲNG từ engine (STAR_INFO + batTrachMap +
 * DESK_USE), không chép tay → bài học và công cụ không thể lệch nhau.
 *
 * PHÂN VAI: cách tính cung phi, Đông tứ mệnh – Tây tứ mệnh, bảng 8 cung phi ↔ 4
 * hướng tốt / 4 hướng tránh và cách áp cho cửa – bếp – giường thuộc bài
 * /learn/bat-trach; ở đây chỉ nhắc "cần biết cung phi trước". Huyền Không Phi
 * Tinh thuộc /phi-tinh.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  batTrachMap,
  computeHuongNha,
  cungPhi,
  menhGroup,
  groupLabel,
  STAR_INFO,
  DIRECTION_ORDER,
  DONG_TU_MENH,
  TAY_TU_MENH,
  type Direction,
  type Gender,
  type Quai,
  type StarKey,
} from '@/lib/huong-nha';
import { DESK_USE } from '@/lib/huong-ban-data';
import {
  DuNienFrame,
  DuNienDepth,
  DuNienRecall,
  DuNienChecklist,
  DuNienWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Du niên: 8 sao Bát Trạch và hướng ngồi làm việc',
  // ≤160 ký tự — dài hơn thì Google cắt mất câu chốt.
  description:
    'Tám du niên: Sinh Khí, Thiên Y, Diên Niên, Phục Vị và Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại — mỗi sao hợp việc gì và nên ngồi quay mặt về hướng nào.',
  alternates: { canonical: 'https://hieu.asia/learn/du-nien' },
};

// ── Dẫn thứ tự xếp hạng THẲNG từ engine ────────────────────────────────────
// GOOD_RANK / BAD_RANK là hằng module-private trong lib/huong-nha.ts (không
// export). Thay vì chép tay, đọc lại đúng thứ tự engine đã sort:
// computeHuongNha() trả `good` đã sắp theo GOOD_RANK và `bad` theo BAD_RANK.
// Lấy một cung phi bất kỳ làm mẫu — thứ tự SAO không phụ thuộc cung phi (chỉ
// hướng ứng với mỗi sao mới đổi).
const RANK_SAMPLE = computeHuongNha(1990, 'nam');
const GOOD_ORDER: StarKey[] = RANK_SAMPLE.good.map((d) => d.star);
const BAD_ORDER: StarKey[] = RANK_SAMPLE.bad.map((d) => d.star);

// Mỗi cát tinh hợp loại việc gì TRÊN BÀN — lấy nguyên từ DESK_USE của công cụ.
const DESK_USE_BY_STAR = new Map(DESK_USE.map((d) => [d.star, d.use] as const));

// Nhãn NGẮN cho tiêu đề cột (bản đầy đủ trong DESK_USE là cả một câu, quá dài cho
// ô <th>). Tra theo KHOÁ SAO chứ không theo vị trí — đảo thứ tự DESK_USE vẫn đúng.
const SHORT_USE: Record<string, string> = {
  sinh_khi: 'làm việc',
  dien_nien: 'giao tiếp',
  thien_y: 'dịu, bền',
  phuc_vi: 'học, tập trung',
};

// Nhãn thứ tự tránh, suy THẲNG từ vị trí trong BAD_RANK (không phải nhận định
// mới): sao đứng đầu là nặng nhất, sao đứng cuối là nhẹ nhất trong bốn.
const AVOID_NOTE = [
  'Tránh trước tiên — nặng nhất trong bốn.',
  'Tránh thứ hai.',
  'Tránh thứ ba.',
  'Nhẹ nhất — chỉ chọn khi không còn hướng nào khác.',
];

interface DeskRow {
  quai: Quai;
  group: 'Đông' | 'Tây';
  /** hướng của từng sao, theo đúng thứ tự cột DESK_USE. */
  dirs: Direction[];
}

function dirFinder(quai: Quai) {
  const map = batTrachMap(quai);
  return (star: StarKey) => DIRECTION_ORDER.find((d) => map[d] === star) as Direction;
}

function buildDeskRows(): DeskRow[] {
  return [...DONG_TU_MENH, ...TAY_TU_MENH].map((quai) => {
    const dirOf = dirFinder(quai);
    return {
      quai,
      group: menhGroup(quai),
      dirs: DESK_USE.map((u) => dirOf(u.star)),
    };
  });
}

/** Ví dụ tính thật — mọi hướng đều suy từ engine, không viết tay. */
function buildExample(year: number, gender: Gender) {
  const quai = cungPhi(year, gender);
  const dirOf = dirFinder(quai);
  return {
    year,
    gender,
    quai,
    group: menhGroup(quai),
    work: dirOf('sinh_khi'),
    talk: dirOf('dien_nien'),
    health: dirOf('thien_y'),
    study: dirOf('phuc_vi'),
    worst: dirOf(BAD_ORDER[0]!),
    mildest: dirOf(BAD_ORDER[3]!),
  };
}

const EX_A = buildExample(1990, 'nam');
const EX_B = buildExample(1996, 'nu');

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Du niên (bát biến du niên) là gì?',
    a: 'Du niên là tám cái nhãn mà Bát Trạch gán cho tám hướng la bàn của một người, sau khi đã biết cung phi của người đó. Tám nhãn gồm bốn cát tinh — Sinh Khí, Thiên Y, Diên Niên, Phục Vị — và bốn hung tinh: Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại. Chúng được sinh ra bằng cách lật lần lượt từng hào của quẻ mệnh để ra bảy quẻ kế tiếp, mỗi quẻ rơi vào một hướng và nhận một nhãn; vì thế còn gọi là "bát biến du niên". Đây là hệ quy ước để tham khảo, không phải lời phán thành bại.',
  },
  {
    q: 'Muốn tra du niên có cần biết cung phi trước không?',
    a: 'Có. Du niên là bảng ánh xạ hướng cho một cung phi cụ thể, nên phải biết cung phi của mình trước rồi mới đọc được sao nào rơi vào hướng nào. Cung phi suy từ năm sinh dương lịch và giới tính; cách tính đầy đủ nằm ở bài Bát Trạch trên hieu.asia. Nếu không muốn tính tay, công cụ hướng bàn làm việc tự suy ra cung phi và trả về đủ tám hướng kèm tên sao.',
  },
  {
    q: 'Với bàn làm việc, "hướng" là hướng quay mặt hay hướng lưng?',
    a: 'Là hướng người ngồi quay mặt về, tức hướng nhìn. Đây là điểm khác với hướng nhà (thường tính theo hướng cửa chính nhìn ra hoặc hướng lưng nhà dựa vào). Với bàn làm việc và bàn học, bạn ngồi vào ghế rồi xác định mình đang nhìn về hướng nào — đó chính là hướng đem đi tra bảng du niên.',
  },
  {
    q: 'Ngồi làm việc nên quay mặt về sao nào, ngồi học thì sao?',
    a: 'Làm việc ưu tiên hướng mang sao Sinh Khí — cát tinh số một, chủ công danh, tài lộc, sức sống và thăng tiến. Học hoặc làm việc cần tập trung sâu thì ưu tiên hướng mang sao Phục Vị — chủ ổn định, củng cố, tĩnh tâm. Đây chính là hai gợi ý mà công cụ hướng bàn làm việc trả về cho mỗi người: một hướng để làm việc, một hướng để học.',
  },
  {
    q: 'Hướng Diên Niên và Thiên Y dùng cho việc gì trên bàn?',
    a: 'Diên Niên là sao hòa hợp, chủ quan hệ bền lâu — hợp công việc phải giao tiếp nhiều: tiếp khách, gặp đối tác, tư vấn, chăm sóc khách hàng. Thiên Y là sao sức khỏe và quý nhân, chủ bình an, hồi phục, được nâng đỡ — hợp khi bạn cần một nhịp làm việc dịu và bền hơn là bung sức. Nguyên tắc chung: chọn theo loại việc chiếm nhiều thời gian nhất trên chiếc bàn đó, chứ không mặc định lấy Sinh Khí chỉ vì nó xếp số một.',
  },
  {
    q: 'Bốn sao xấu có nặng như nhau không?',
    a: 'Không. Thứ tự nặng giảm dần là Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại. Tuyệt Mệnh được xem là hung tinh nặng nhất theo quan niệm; Họa Hại là hướng kém nhưng nhẹ nhất trong bốn. Thứ tự này có ích đúng lúc phòng chật và không còn hướng tốt nào: bạn chọn được phương án ít tệ nhất thay vì chọn bừa. Nó không có nghĩa là ngồi hướng xấu thì chắc chắn gặp chuyện.',
  },
  {
    q: 'Phòng không cho xoay bàn về hướng tốt thì ưu tiên gì?',
    a: 'Ưu tiên những thứ đo được trước: bàn đủ ánh sáng nhưng màn hình không bị chói, lưng có điểm tựa là bức tường, không quay lưng ra cửa hay lối đi lại. Đó là các yếu tố ảnh hưởng thật tới sự tập trung và tư thế ngồi. Sau khi đã loại các vị trí vi phạm những điều đó, trong số chỗ còn lại mới chọn theo hướng du niên. Chọn được hướng tốt thì hay, không thì cũng không cần "hóa giải" gì cả.',
  },
  {
    q: 'Vì sao Phục Vị luôn rơi vào hướng tọa của cung phi?',
    a: 'Vì thuật toán bắt đầu từ chính quẻ mệnh khi chưa lật hào nào, và trạng thái "giữ nguyên" đó được gán nhãn Phục Vị. Quẻ mệnh tọa ở một hướng cố định trên la bàn, nên hướng ấy luôn mang Phục Vị với mọi cung phi. Hệ quả tiện dụng: nhớ được hướng tọa của quẻ mệnh mình là biết luôn hướng ngồi học, không cần tra bảng.',
  },
  {
    q: 'Du niên có phải là sao thật trên bầu trời không?',
    a: 'Không. Chữ "tinh" ở đây là cách gọi ước lệ. Tám du niên là nhãn do một phép biến đổi trên ba hào của quẻ mệnh sinh ra rồi gán vào tám hướng la bàn — không có thiên thể nào tương ứng, khác với chín sao Cửu Diệu trong tục xem sao hạn (nơi có bảy thiên thể thật). Biết điều này giúp bạn đọc du niên đúng tinh thần: một quy ước để tham khảo khi sắp đặt chỗ ngồi, không phải một lực tác động từ vũ trụ.',
  },
];

const JSONLD = [
  article({
    headline: 'Tám du niên trong Bát Trạch: ý nghĩa từng sao và hướng ngồi làm việc',
    description:
      'Bốn cát tinh Sinh Khí, Thiên Y, Diên Niên, Phục Vị và bốn hung tinh Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại: xếp hạng, ý nghĩa và cách chọn hướng ngồi làm việc, bàn học theo mục tiêu.',
    url: '/learn/du-nien',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Du niên (8 sao Bát Trạch)', url: '/learn/du-nien' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Du niên — 8 sao Bát Trạch và hướng ngồi làm việc',
    description:
      'Học tám du niên tinh của Bát Trạch: tên gọi, xếp hạng mạnh – yếu, mỗi sao hợp đặt việc gì, và cách chọn hướng ngồi cho bàn làm việc, bàn học khi phòng không cho xoay bàn.',
    url: '/learn/du-nien',
  }),
];

const TH = 'px-4 py-2.5 font-semibold text-foreground';

export default function LearnDuNienPage() {
  const deskRows = buildDeskRows();

  return (
    <LearnArticle
      eyebrow="PHONG THỦY · BÁT BIẾN DU NIÊN"
      title={
        <>
          Tám{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">du niên</span>
        </>
      }
      standfirst={
        <>
          Biết mình hợp bốn hướng nào mới là nửa việc. Nửa còn lại: bốn hướng ấy{' '}
          <strong>không giống nhau</strong> — mỗi hướng mang một du niên tinh riêng, ứng một loại
          việc riêng. Bài này đi hết tám sao, và trả lời một câu rất cụ thể: bàn của bạn nên quay mặt
          về đâu.
        </>
      }
      readMeta="12 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Du niên' },
      ]}
      relatedLenses={relatedLearnLenses('du-nien')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh và giới tính, hệ thống suy ra cung phi rồi chỉ thẳng hai hướng: hướng nên quay mặt về khi làm việc và hướng nên quay mặt về khi học — kèm đủ 8 hướng và tên sao.',
        href: '/huong-ban-lam-viec',
        label: 'Xem hướng bàn làm việc',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <DuNienFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Du niên là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Du niên</strong> (đầy đủ: <strong>bát biến du niên</strong> — "tám lần biến")
                là tám cái nhãn mà Bát Trạch gán cho tám hướng la bàn của một người. Bốn nhãn thuộc
                phe cát: <strong>Sinh Khí, Thiên Y, Diên Niên, Phục Vị</strong>. Bốn nhãn thuộc phe
                hung: <strong>Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại</strong>.
              </p>
              <p>
                Chúng sinh ra từ chính quẻ mệnh của bạn. Giữ nguyên quẻ gốc, hướng tọa của nó nhận
                nhãn <strong>Phục Vị</strong>; rồi lật lần lượt từng hào để ra bảy quẻ kế tiếp, mỗi
                quẻ rơi vào một hướng mới và nhận nhãn tiếp theo. Bảy lần lật là phủ kín bảy hướng còn
                lại — nên cái tên "tám lần biến" mô tả đúng cơ chế, không phải một mỹ từ.
              </p>

              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm leading-relaxed">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                  Cần có trước
                </p>
                <p className="mt-1.5 text-foreground/85">
                  Bài này giả định bạn đã biết <strong>cung phi</strong> của mình (suy từ năm sinh
                  dương lịch và giới tính). Chưa biết thì học cách tính ở bài{' '}
                  <Link
                    href="/learn/bat-trach"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    Bát Trạch
                  </Link>{' '}
                  — nơi có luôn bảng Đông tứ mệnh – Tây tứ mệnh và bốn hướng hợp của từng cung. Ở đây
                  chúng ta đi tiếp một tầng: <em>trong</em> bốn hướng hợp đó, hướng nào dành cho việc
                  gì.
                </p>
              </div>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Và đây là những gì du niên KHÔNG phải
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải sao thật trên trời.</strong> Chữ "tinh" là cách gọi ước lệ. Tám
                  du niên là nhãn do phép lật hào sinh ra rồi gán vào hướng — không có thiên thể nào
                  tương ứng.
                </li>
                <li>
                  <strong>Không phải sao hạn Cửu Diệu.</strong> Chín sao trong tục{' '}
                  <Link
                    href="/learn/sao-han"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    xem sao hạn
                  </Link>{' '}
                  đổi theo từng năm và có bảy thiên thể thật. Du niên thì gắn với{' '}
                  <em>hướng</em>, không đổi theo năm. Trùng chữ "sao", khác hẳn bản chất.
                </li>
                <li>
                  <strong>Không phải Huyền Không Phi Tinh.</strong>{' '}
                  <Link href="/phi-tinh" className="text-gold-700 underline-offset-4 hover:underline">
                    Phi Tinh
                  </Link>{' '}
                  dùng bộ sao số theo Vận và tọa – hướng nhà, đổi theo thời gian. Du niên không dùng
                  thời gian, chỉ dùng cung phi.
                </li>
                <li>
                  <strong>Không phải lời phán thành bại.</strong> Ngồi đúng hướng Sinh Khí không bảo
                  đảm thăng tiến; ngồi phải hướng xấu cũng không có nghĩa công việc sẽ hỏng. hieu.asia
                  nêu rõ quy tắc để bạn tự cân nhắc, và không bán "hóa giải".
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba việc bài này sẽ giúp bạn làm được: gọi đúng tên và xếp đúng hạng tám du niên, chọn
                hướng ngồi <strong>theo mục tiêu</strong> thay vì theo hai chữ "tốt – xấu", và biết ưu
                tiên gì khi căn phòng không cho xoay bàn.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <DuNienDepth />,
        },
        {
          id: 'bon-cat-tinh',
          tocLabel: '4 cát tinh',
          heading: 'Bốn cát tinh: Sinh Khí, Thiên Y, Diên Niên, Phục Vị',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bốn sao tốt xếp theo mức cát giảm dần. Cột cuối là phần quan trọng nhất với bài này:{' '}
                <strong>mỗi sao hợp loại việc gì khi đặt bàn</strong> — lấy nguyên từ bảng mà công cụ
                hướng bàn làm việc đang dùng.
              </p>
              <p className="font-mono text-[13px] text-muted-foreground sm:hidden" aria-hidden="true">
                ← vuốt ngang →
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Hạng · Sao</th>
                      <th scope="col" className={TH}>Ý nghĩa theo truyền thống</th>
                      <th scope="col" className={TH}>Trên bàn làm việc / bàn học</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GOOD_ORDER.map((star, i) => (
                      <tr key={star} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-emerald-700 dark:text-emerald-300">
                          <span aria-hidden="true" className="font-mono text-xs">
                            {i + 1} ·{' '}
                          </span>
                          {STAR_INFO[star].name}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{STAR_INFO[star].blurb}</td>
                        <td className="px-4 py-2 text-foreground/85">
                          {DESK_USE_BY_STAR.get(star)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Bảng dựng thẳng từ engine của công cụ (<code className="font-mono text-[13px]">STAR_INFO</code>{' '}
                trong <code className="font-mono text-[13px]">lib/huong-nha.ts</code> và{' '}
                <code className="font-mono text-[13px]">DESK_USE</code> trong{' '}
                <code className="font-mono text-[13px]">lib/huong-ban-data.ts</code>) — không chép
                tay, nên nội dung bài học và kết quả tra cứu không thể lệch nhau.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Đọc bảng này thế nào cho đúng
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hạng không phải thứ tự chọn.</strong> Sinh Khí xếp số 1 về mức cát, nhưng
                  chọn hướng ngồi là chọn theo <em>loại việc</em>. Bằng chứng nằm ngay trong công cụ:
                  với bàn học nó chỉ về <strong>Phục Vị</strong> — sao xếp cuối trong bốn cát tinh.
                </li>
                <li>
                  <strong>Phục Vị dễ nhớ nhất.</strong> Nó luôn rơi đúng vào hướng tọa của quẻ mệnh
                  bạn — trạng thái "chưa lật hào nào". Nhớ được hướng tọa là biết luôn hướng ngồi học.
                </li>
                <li>
                  <strong>Mỗi cung phi có đủ cả bốn.</strong> Không ai thiếu Sinh Khí hay thiếu Phục
                  Vị; chỉ khác nhau ở chỗ bốn sao ấy rơi vào bốn hướng nào.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'bon-hung-tinh',
          tocLabel: '4 hung tinh',
          heading: 'Bốn hung tinh: Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bốn sao còn lại xếp theo mức nặng <strong>giảm dần</strong>. Đây là điểm rất hay bị bỏ
                qua: "bốn hướng kia đều xấu như nhau" là <em>sai</em>. Thứ tự dưới đây chính là thứ
                giúp bạn chọn phương án ít tệ nhất khi phòng chật và không còn hướng tốt nào.
              </p>
              <p className="font-mono text-[13px] text-muted-foreground sm:hidden" aria-hidden="true">
                ← vuốt ngang →
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Mức nặng · Sao</th>
                      <th scope="col" className={TH}>Ý nghĩa theo quan niệm</th>
                      <th scope="col" className={TH}>Với chỗ ngồi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BAD_ORDER.map((star, i) => (
                      <tr key={star} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-rose-700 dark:text-rose-300">
                          <span aria-hidden="true" className="font-mono text-xs">
                            {i + 1} ·{' '}
                          </span>
                          {STAR_INFO[star].name}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{STAR_INFO[star].blurb}</td>
                        <td className="px-4 py-2 text-foreground/85">{AVOID_NOTE[i]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Cột "Với chỗ ngồi" chỉ diễn đạt lại vị trí của từng sao trong bảng xếp hạng — không
                phải một lớp phán đoán mới. Với bàn làm việc, cả bốn sao này đều thuộc nhóm{' '}
                <strong>nên tránh quay mặt về</strong>.
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Vì sao bàn ít cách xử lý hơn ngôi nhà
              </h3>
              <p>
                Trong Bát Trạch áp cho nhà, bếp có mẹo riêng gọi là "tọa hung — hướng cát": đặt ở vùng
                xấu nhưng quay về hướng tốt. Chiếc bàn thì <strong>chỉ có một hướng nhìn</strong>, nên
                không có mẹo tương đương. Chỉ còn đúng hai cách thật sự: <strong>xoay hướng ngồi</strong>{' '}
                hoặc <strong>dời chỗ đặt bàn</strong>. Hết hai cách đó thì thứ hạng nặng – nhẹ ở trên
                mới là thứ có ích.
              </p>
              <p>
                Một suy luận theo đúng nguyên tắc ấy: mô tả của <strong>Ngũ Quỷ</strong> có nhắc hướng
                này có thể dùng cho kho, nhà vệ sinh — tức những nơi <em>ít ở</em>. Áp vào phòng làm
                việc, phần không gian mang hung tinh hợp để đặt tủ hồ sơ, máy in, kệ đồ hơn là đặt chỗ
                ngồi. Đây là suy luận cùng logic, không phải một quy tắc riêng của cổ thư.
              </p>
              <p className="text-sm text-foreground/70">
                Nhắc lại cho rõ: hung tinh là <strong>lời gợi ý bố trí để tham khảo</strong>. Bàn rơi
                vào hướng xấu không có nghĩa công việc sẽ hỏng, và không cần mua bất kỳ vật phẩm "hóa
                giải" nào.
              </p>
            </div>
          ),
        },
        {
          id: 'ap-dung-ban-lam-viec',
          tocLabel: 'Áp cho bàn làm việc',
          heading: 'Áp vào thực tế: chọn hướng ngồi theo mục tiêu',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trước hết, thống nhất cách đo: với bàn làm việc và bàn học, "hướng" là{' '}
                <strong>hướng người ngồi quay mặt về</strong> — tức hướng nhìn. Ngồi vào ghế, nhìn
                thẳng, bạn đang nhìn về đâu thì đó là hướng đem đi tra bảng. (Khác với hướng nhà, vốn
                thường tính theo hướng cửa chính nhìn ra.)
              </p>
              <p>
                Bảng dưới cho mỗi cung phi bốn hướng tốt, đã dán sẵn nhãn "hướng này dành cho việc
                gì". Tìm hàng cung phi của bạn, đọc ngang là xong.
              </p>
              <p className="font-mono text-[13px] text-muted-foreground sm:hidden" aria-hidden="true">
                ← vuốt ngang →
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className={TH}>Cung phi</th>
                      {/* Tiêu đề cột SUY TỪ DESK_USE, không gõ tay: ô dữ liệu bên dưới
                          cũng map theo DESK_USE nên nếu thứ tự mảng đó đổi thì tiêu đề
                          đổi theo. Gõ cứng 4 tên sao ở đây là cách chắc chắn để một ngày
                          nào đó cả bảng bị dán nhãn lệch mà không test nào đỏ. */}
                      {DESK_USE.map((u) => (
                        <th key={u.star} scope="col" className={TH}>
                          {u.name} · {SHORT_USE[u.star]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {deskRows.map((r) => (
                      <tr key={r.quai} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 font-medium text-foreground">
                          {r.quai}{' '}
                          <span className="text-xs text-muted-foreground">
                            ({groupLabel(r.group)})
                          </span>
                        </td>
                        {r.dirs.map((d, i) => (
                          <td
                            key={DESK_USE[i]!.star}
                            className="px-4 py-2 text-emerald-700 dark:text-emerald-300"
                          >
                            {d}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Thứ tự cột lấy đúng thứ tự bảng "4 hướng tốt nên dùng cho bàn" của công cụ — không
                phải bảng xếp hạng mức cát (bảng xếp hạng là Sinh Khí → Thiên Y → Diên Niên → Phục
                Vị).
              </p>

              <h3 className="pt-2 text-lg font-semibold text-foreground">Hai ví dụ đọc bảng</h3>
              <div className="space-y-3 rounded-xl border border-border bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
                <p>
                  <strong className="text-foreground">
                    Sinh {EX_A.year}, nam — cung {EX_A.quai} ({groupLabel(EX_A.group)}).
                  </strong>{' '}
                  Là nhân viên văn phòng làm việc độc lập phần lớn thời gian, nên kê bàn quay mặt về{' '}
                  <strong className="text-foreground">{EX_A.work}</strong> (Sinh Khí). Nếu người này
                  đang ôn thi buổi tối trên chính chiếc bàn đó, hướng hợp hơn cho việc học là{' '}
                  <strong className="text-foreground">{EX_A.study}</strong> (Phục Vị) — cũng chính là
                  hướng tọa của cung {EX_A.quai}. Một bàn chỉ quay được một hướng, nên chọn theo việc
                  ngồi nhiều giờ hơn, đừng cố dung hòa. Hướng cần tránh trước tiên là{' '}
                  <strong className="text-foreground">{EX_A.worst}</strong> (
                  {STAR_INFO[BAD_ORDER[0]!].name}).
                </p>
                <p>
                  <strong className="text-foreground">
                    Sinh {EX_B.year}, nữ — cung {EX_B.quai} ({groupLabel(EX_B.group)}).
                  </strong>{' '}
                  Làm nghề tư vấn, gần như cả ngày tiếp khách và họp với đối tác, nên hướng đáng ưu
                  tiên không phải Sinh Khí mà là{' '}
                  <strong className="text-foreground">{EX_B.talk}</strong> (Diên Niên — chủ hòa hợp,
                  quan hệ). Giai đoạn cần sức khỏe và người nâng đỡ thì chuyển sang{' '}
                  <strong className="text-foreground">{EX_B.health}</strong> (Thiên Y). Nếu bàn buộc
                  phải nằm ở nhóm hướng xấu, hướng ít nặng nhất trong bốn là{' '}
                  <strong className="text-foreground">{EX_B.mildest}</strong> (
                  {STAR_INFO[BAD_ORDER[3]!].name}).
                </p>
                <p className="text-xs">
                  Hai ví dụ trên được tính bằng chính engine của công cụ ngay khi trang này dựng, nên
                  bạn tra lại ở{' '}
                  <Link
                    href="/huong-ban-lam-viec"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    hướng bàn làm việc
                  </Link>{' '}
                  sẽ ra đúng những hướng này.
                </p>
              </div>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Khi phòng không cho xoay bàn — thứ tự ưu tiên
              </h3>
              <p>
                Phần lớn người đọc bài này đang ngồi trong một phòng đã có sẵn ổ điện, cửa sổ, và có
                thể là bàn của công ty. Nguyên tắc thực dụng:{' '}
                <strong>lo phần đo được trước, chọn hướng sau</strong>.
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Ánh sáng và độ chói.</strong> Bàn phải đủ sáng, nhưng màn hình không được
                  hứng nắng hay đèn chiếu thẳng. Đây là thứ ảnh hưởng tới mắt và sự tập trung ngay
                  trong ngày đầu tiên.
                </li>
                <li>
                  <strong>Lưng có điểm tựa.</strong> Đặt lưng ghế về phía một bức tường, và{' '}
                  <strong>không quay lưng ra cửa hay lối đi lại</strong>. Ngồi mà sau lưng là chỗ
                  người qua lại thì khó tập trung — điều này đúng cả theo phong tục lẫn theo cảm giác
                  thật.
                </li>
                <li>
                  <strong>Rồi mới tới hướng du niên.</strong> Trong số vị trí còn lại sau hai bước
                  trên, chọn hướng theo mục tiêu: làm việc lấy Sinh Khí, học lấy Phục Vị, giao tiếp
                  nhiều lấy Diên Niên.
                </li>
                <li>
                  <strong>Không còn hướng tốt nào?</strong> Chọn theo bảng nặng dần: tránh Tuyệt Mệnh
                  trước, và nếu buộc phải ngồi hướng xấu thì Họa Hại là hướng nhẹ nhất trong bốn.
                </li>
                <li>
                  <strong>Đừng đánh đổi ngược.</strong> Một chỗ ngồi đúng hướng nhưng chói mắt, ồn,
                  chật và không kê được ghế tử tế thì tệ hơn hẳn một chỗ lệch hướng mà sáng, yên và
                  ngồi thoải mái. Hướng là bước tinh chỉnh cuối, không phải ràng buộc đầu tiên.
                </li>
              </ol>
              <p className="text-sm text-foreground/70">
                Muốn biết hai hướng của riêng mình thay vì tra bảng tay:{' '}
                <Link
                  href="/huong-ban-lam-viec"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  xem hướng bàn làm việc →
                </Link>
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cái gì là quy ước, cái gì đo được',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>Phần này quan trọng ngang phần bảng biểu, nên nói thẳng.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tám du niên là quy ước, chưa có bằng chứng khoa học.</strong> Không có
                  nghiên cứu nào cho thấy quay mặt về một hướng la bàn nhất định làm tăng thu nhập hay
                  khả năng tập trung. Đây là tri thức truyền thống được hệ thống hóa — đáng biết như
                  một phần văn hóa, không phải định luật tự nhiên.
                </li>
                <li>
                  <strong>Chúng không phải thiên thể.</strong> Tám nhãn sinh ra từ phép lật hào trên
                  quẻ mệnh rồi gán vào tám hướng. Không có đại lượng vật lý nào đứng sau để đo.
                </li>
                <li>
                  <strong>Đầu vào rất thô.</strong> Toàn bộ bảng chỉ phụ thuộc cung phi — tức chỉ hai
                  dữ kiện là năm sinh và giới tính. Hai người sinh cùng năm cùng giới nhận bảng hướng
                  y hệt nhau, dù một người làm lập trình một mình còn người kia bán hàng cả ngày.
                </li>
              </ul>

              <h3 className="pt-2 text-lg font-semibold text-foreground">
                Còn đây là những thứ đo được — và ảnh hưởng thật tới năng suất
              </h3>
              <p>
                Nếu mục tiêu thật sự là "ngồi vào bàn này thì làm được việc", có những yếu tố ai cũng
                kiểm chứng được ngay trong tuần đầu:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Ánh sáng.</strong> Đủ sáng để không mỏi mắt, nhưng màn hình không bị nắng
                  hay đèn chiếu thẳng gây chói.
                </li>
                <li>
                  <strong>Tiếng ồn.</strong> Bàn kê cạnh lối đi, cửa ra vào hay khu pha cà phê thì bị
                  ngắt mạch liên tục, bất kể hướng nào.
                </li>
                <li>
                  <strong>Tư thế ngồi.</strong> Chiều cao bàn và ghế, khoảng cách tới màn hình, chỗ
                  tựa lưng — thứ quyết định bạn ngồi được bao lâu trước khi mỏi cổ và lưng.
                </li>
              </ul>
              <p>
                Điều đáng chú ý: lời khuyên "lưng có điểm tựa, không quay lưng ra cửa hay lối đi" vừa
                là lời dặn phong thủy quen thuộc, vừa là điều dễ thấy trong thực tế — người xưa cũng
                quan sát chính những thứ này, chỉ diễn đạt bằng ngôn ngữ khác. Khi một lời khuyên vừa
                hợp phong tục vừa hợp cảm giác thật, cứ theo. Khi hai bên xung đột,{' '}
                <strong>ưu tiên thứ đo được</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                hieu.asia nêu rõ quy tắc và cách suy ra để bạn <strong>biết và tự quyết định</strong> —
                không phán thành bại, không dọa hậu quả, và không bán vật phẩm "hóa giải" hay "trấn
                yểm".
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <DuNienWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <DuNienRecall />,
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
                Muốn biết hướng ngồi làm việc và hướng ngồi học của riêng mình?{' '}
                <Link
                  href="/huong-ban-lam-viec"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Xem hướng bàn làm việc miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/huong-ban-lam-viec', label: 'Hướng bàn làm việc' },
                    { href: '/huong-nha', label: 'Xem hướng nhà hợp tuổi' },
                    { href: '/phi-tinh', label: 'Huyền Không Phi Tinh' },
                    { href: '/ban-menh', label: 'Ngũ hành bản mệnh' },
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
          children: <DuNienChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
