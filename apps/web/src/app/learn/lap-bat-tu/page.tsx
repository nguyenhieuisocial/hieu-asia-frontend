/**
 * Bài học /learn/lap-bat-tu — QUY TRÌNH LẬP tứ trụ Bát Tự.
 *
 * GROUNDING — mọi cặp can chi và mọi mốc thời điểm trên trang này do CHÍNH engine
 * sinh ra lúc build, không gõ tay số nào:
 *   • lib/bazi.ts → calculateBazi(): trụ NĂM đổi tại Lập Xuân (Mặt Trời tới kinh
 *     độ hoàng đạo 315°, so sánh `jdUTC >= lapXuan` nên mốc chính xác tới phút);
 *     trụ THÁNG theo 12 "tiết" (mỗi cung 30° tính từ 315°), can tháng =
 *     NGU_HO_DAN_STEM[can năm] + số cung (Ngũ Hổ Độn); trụ NGÀY = chu kỳ 60 ngày
 *     liên tục neo 1990-05-20 = Ất Dậu, chỉ phụ thuộc NGÀY dương lịch nên trụ ngày
 *     đổi lúc 0h; trụ GIỜ: chi = floor(((giờ + 1) % 24) / 2) nên 23h đã là giờ Tý,
 *     can = NGU_THU_TY_STEM[can ngày] + chỉ số khung giờ (Ngũ Thử Độn).
 *     `julianDay(Y, M, D, hour - 7, minute)` → giờ nhập được hiểu là GIỜ VN (UTC+7);
 *     vị trí Mặt Trời từ lib/western-astrology.ts (thuật toán Meeus).
 *   • lib/bazi.ts → monthPillarOf(): đúng phép tiết khí trên, tách riêng.
 *   • lib/ngay-kieng-ky.ts → solarToLunar() (Hồ Ngọc Đức, múi giờ +7) — CHỈ dùng
 *     để đối chiếu ngày âm, cho thấy mốc âm lịch không trùng mốc trụ.
 *   • trang công cụ app/la-so-bat-tu/page.tsx: nhập ngày dương + giờ + giới tính;
 *     ba trụ năm/tháng/ngày không phụ thuộc giờ, chỉ trụ giờ phụ thuộc.
 *
 * PHÂN VAI: /learn/bat-tu sở hữu Nhật Chủ – Thập Thần – cách luận; /learn/can-chi
 * sở hữu bộ máy 10 can × 12 chi và vòng 60; /learn/tiet-khi sở hữu 24 tiết khí. Bài
 * này CHỈ sở hữu quy trình LẬP 4 trụ. Giọng: lập trụ là phép phiên dịch tính được,
 * kiểm được — không phán số mệnh.
 */

import * as React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import { CAN, calculateBazi, monthPillarOf } from '@/lib/bazi';
import { solarToLunar } from '@/lib/ngay-kieng-ky';
import { LapBatTuFrame, LapBatTuDepth, LapBatTuRecall, LapBatTuChecklist, LapBatTuWhys } from './_active-learning';

const DESCRIPTION =
  'Cách lập tứ trụ Bát Tự từ ngày giờ sinh: trụ năm đổi ở Lập Xuân (không phải Tết), trụ tháng theo tiết khí, trụ ngày chu kỳ 60, can giờ suy từ can ngày.';

export const metadata: Metadata = {
  title: 'Lập tứ trụ Bát Tự từ ngày giờ sinh',
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/learn/lap-bat-tu' },
};

// ─────────────────────────────────────────────────────────────────────────────
// DỮ LIỆU DỰNG TỪ ENGINE LÚC BUILD — không gõ tay cặp can chi hay mốc nào, nên
// bảng trên trang không thể lệch với kết quả công cụ /la-so-bat-tu.
// ─────────────────────────────────────────────────────────────────────────────
const pad2 = (n: number) => String(n).padStart(2, '0');
const iso = (y: number, m: number, d: number) => `${y}-${pad2(m)}-${pad2(d)}`;
const viDate = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}`;
const chartOf = (date: string, hour: number, minute = 0) =>
  calculateBazi({ birthSolarDate: date, birthHour: hour, birthMinute: minute });
const pill = (p: { can: string; chi: string }) => `${p.can} ${p.chi}`;

/** Nhãn ngày âm lịch — CHỈ để đối chiếu, không phải dữ liệu Bát Tự. */
function lunarLabel(date: string): string {
  const l = solarToLunar(+date.slice(8, 10), +date.slice(5, 7), +date.slice(0, 4));
  return `${l.day}/${l.month}${l.leap ? ' nhuận' : ''} năm ${l.year}`;
}

// 12 khung giờ ↔ chi giờ: hỏi engine chi giờ của cả 24 giờ rồi gom lại, quét từ
// 23h vì đó là mốc mở khung Tý của engine.
type HourSlot = { chi: string; hours: number[] };
const HOUR_SLOTS: HourSlot[] = (() => {
  const byHour = Array.from({ length: 24 }, (_, h) => chartOf('2026-03-10', h).hour.chi);
  const out: HourSlot[] = [];
  for (let i = 0; i < 24; i++) {
    const h = (23 + i) % 24;
    const chi = byHour[h]!;
    const last = out[out.length - 1];
    if (last && last.chi === chi) last.hours.push(h);
    else out.push({ chi, hours: [h] });
  }
  return out;
})();
const slotRange = (s: HourSlot) => `${pad2(s.hours[0]!)}:00 – ${pad2(s.hours.at(-1)!)}:59`;

// Ngày neo cho từng can ngày (60 ngày liên tiếp phủ đủ 10 can).
const DAY_STEM_ANCHOR: Map<string, string> = (() => {
  const m = new Map<string, string>();
  for (let i = 0; i < 60 && m.size < CAN.length; i++) {
    const dt = new Date(Date.UTC(2026, 0, 1 + i));
    const d = iso(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
    const can = chartOf(d, 12).day.can;
    if (!m.has(can)) m.set(can, d);
  }
  return m;
})();

// Bảng Ngũ Thử Độn SINH RA từ engine: với mỗi can ngày lấy can giờ của cả 12
// khung; can ngày nào cho cùng một dãy thì tự gom một nhóm → SỐ NHÓM là kết quả
// tính, không phải con số gõ sẵn.
type DonGroup = { stems: string[]; hourCans: string[] };
const DON_GROUPS: DonGroup[] = (() => {
  const groups: DonGroup[] = [];
  for (const stem of CAN) {
    const date = DAY_STEM_ANCHOR.get(stem)!;
    const hourCans = HOUR_SLOTS.map((s) => chartOf(date, s.hours[0]!).hour.can);
    const found = groups.find((g) => g.hourCans.join('|') === hourCans.join('|'));
    if (found) found.stems.push(stem);
    else groups.push({ stems: [stem], hourCans });
  }
  return groups;
})();

// Mốc Lập Xuân theo giờ VN: dò nhị phân trên `meta.solarYearForPillar` — tức
// chính kết luận trụ năm của engine, nên mốc tìm được đúng bằng mốc engine dùng.
function lapXuanVN(year: number): { date: string; time: string } {
  const yearAt = (t: number) =>
    chartOf(iso(year, 2, 3 + Math.floor(t / 1440)), Math.floor((t % 1440) / 60), t % 60).meta
      .solarYearForPillar;
  let lo = 0;
  let hi = 3 * 1440 - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (yearAt(mid) === year) hi = mid;
    else lo = mid + 1;
  }
  const t = `${pad2(Math.floor((lo % 1440) / 60))}:${pad2(lo % 60)}`;
  return { date: iso(year, 2, 3 + Math.floor(lo / 1440)), time: t };
}

/** Mùng 1 Tết (dương lịch) — dò bằng chính engine lịch âm của repo. */
function tetOf(year: number): string {
  for (let t = 0; t < 45; t++) {
    const dt = new Date(Date.UTC(year, 0, 18 + t));
    const [d, m] = [dt.getUTCDate(), dt.getUTCMonth() + 1];
    const l = solarToLunar(d, m, year);
    if (l.day === 1 && l.month === 1 && !l.leap) return iso(year, m, d);
  }
  return iso(year, 2, 1);
}

const LX_2003 = lapXuanVN(2003);
const LX_1996 = lapXuanVN(1996);
const TET_2003 = tetOf(2003);
const TET_1996 = tetOf(1996);

// Bẫy 1 — trụ năm đổi ở Lập Xuân, không ở Tết. [ngày, giờ, phút, ghi chú]
type YearTrapRow = [string, number, number, string];
const YEAR_TRAP_2003: YearTrapRow[] = [
  [TET_2003, 12, 0, 'Sinh đúng mùng 1 Tết — trụ năm vẫn là năm cũ'],
  ['2003-02-04', 12, 0, 'Đúng ngày Lập Xuân nhưng sinh trước mốc — chưa đổi'],
  ['2003-02-04', 14, 0, 'Sau mốc Lập Xuân vài chục phút — trụ năm ĐÃ đổi'],
];
const YEAR_TRAP_1996: YearTrapRow[] = [
  ['1996-02-04', 12, 0, 'Trước mốc Lập Xuân — còn trụ năm cũ'],
  ['1996-02-05', 12, 0, 'Sau Lập Xuân mà còn hai tuần nữa mới tới Tết'],
  [TET_1996, 12, 0, 'Mùng 1 Tết — trụ năm không đổi gì thêm'],
];

// Bẫy 2 — trụ tháng đổi theo tiết khí, không theo mùng 1 âm lịch.
const MONTH_TRAP_ROWS: [string, string][] = [
  ['2026-09-07', 'Trước mốc tiết — trụ tháng chưa đổi'],
  ['2026-09-08', 'Qua mốc tiết → trụ tháng ĐỔI, dù âm lịch vẫn giữa tháng 7'],
  ['2026-09-11', 'Mùng 1 tháng 8 âm — âm lịch sang tháng mới, trụ tháng ĐỨNG YÊN'],
  ['2026-05-16', 'Ngày cuối tháng 3 âm'],
  ['2026-05-17', 'Mùng 1 tháng 4 âm — trụ tháng vẫn không nhúc nhích'],
];

// Bảng "4 trụ ↔ nguồn dữ liệu": [trụ, đổi lúc nào, suy từ đâu, giờ sinh ảnh hưởng?]
const SOURCE_ROWS: [string, string, string, string][] = [
  ['Năm', 'Tại mốc Lập Xuân', 'Vị trí Mặt Trời trên vòng hoàng đạo', 'Chỉ khi sinh sát mốc'],
  ['Tháng', 'Tại mốc mở đầu mỗi tiết', 'Chi: cung 30° của Mặt Trời · Can: từ can năm (Ngũ Hổ Độn)', 'Chỉ khi sinh sát mốc'],
  ['Ngày', 'Lúc 0h dương lịch (quy ước của công cụ này)', 'Đếm liên tục trong chu kỳ 60 ngày', 'Chỉ ở mốc nửa đêm'],
  ['Giờ', 'Mỗi 2 tiếng', 'Chi: khung giờ · Can: từ can ngày (Ngũ Thử Độn)', 'Có — phụ thuộc trực tiếp'],
];

const DAY_RUN_DATES = ['2026-02-03', '2026-02-04', '2026-02-05', '2026-02-06'];
const ANCHOR_DATE = '1990-05-20';
const ANCHOR_DAY_PILLAR = pill(chartOf(ANCHOR_DATE, 12).day);
const YEAR_2026 = pill(chartOf('2026-06-15', 12).year);
const THANG_DAN_2026 = monthPillarOf(2026, 2, 10).label;
const NIGHT_BEFORE = chartOf('2026-03-10', 23, 30);
const NIGHT_AFTER = chartOf('2026-03-11', 0, 30);
const TET_2003_YEAR = pill(chartOf(TET_2003, 12).year);
const SAU_LX_2003_YEAR = pill(chartOf('2003-02-05', 12).year);

// ─────────────────────────────────────────────────────────────────────────────

const bold = (s: string) => <strong className="font-medium text-foreground">{s}</strong>;

/** Bảng dữ liệu dùng chung cho cả 5 bảng của bài (markup giữ ở MỘT chỗ). */
function DataTable({
  cols,
  rows,
  minWidth = 'min-w-[560px]',
}: {
  cols: React.ReactNode[];
  rows: { key: string; cells: React.ReactNode[] }[];
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minWidth} text-left text-sm`}>
        <thead>
          <tr className="border-b border-border bg-card/60">
            {cols.map((c, i) => (
              <th key={i} scope="col" className="px-4 py-2.5 font-semibold text-foreground">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border/60 last:border-b-0">
              {r.cells.map((c, i) => (
                <td key={i} className="px-4 py-2 text-muted-foreground">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Bảng "bẫy trụ năm" — dùng lại cho cả hai chiều Tết trước / Lập Xuân trước. */
function YearTrapTable({ rows }: { rows: YearTrapRow[] }) {
  return (
    <DataTable
      cols={['Thời điểm sinh (dương)', 'Ngày âm lịch', 'Trụ năm (engine)', 'Ghi chú']}
      minWidth="min-w-[620px]"
      rows={rows.map(([date, h, m, note]) => ({
        key: `${date}-${h}`,
        cells: [
          `${viDate(date)} ${pad2(h)}:${pad2(m)}`,
          lunarLabel(date),
          bold(pill(chartOf(date, h, m).year)),
          note,
        ],
      }))}
    />
  );
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ trên trang (chống cloaking). Câu hỏi cố tình KHÁC bộ FAQ của trang công cụ
// /la-so-bat-tu (bên đó hỏi Bát Tự là gì, cần thông tin gì, đại vận, tàng can,
// lục hợp lục xung, có phải bói toán) VÀ khác FAQ của /learn/bat-tu (bên đó hỏi
// Nhật Chủ, vượng nhược, Dụng Thần, Vòng Trường Sinh, Thần Sát).
const FAQS = [
  {
    q: 'Lập tứ trụ Bát Tự gồm những bước nào?',
    a: 'Bốn bước, mỗi bước dựng một trụ. Bước 1, trụ năm: xác định thời điểm sinh nằm trước hay sau tiết Lập Xuân của năm đó, vì trụ năm đổi tại Lập Xuân chứ không đổi vào ngày Tết. Bước 2, trụ tháng: xác định thời điểm sinh rơi vào tiết nào để ra chi tháng, rồi suy can tháng từ can năm theo phép Ngũ Hổ Độn. Bước 3, trụ ngày: đếm vị trí của ngày sinh trong chu kỳ 60 ngày chạy liên tục, không phụ thuộc năm hay tháng. Bước 4, trụ giờ: lấy chi giờ theo khung hai tiếng, rồi suy can giờ từ can ngày theo phép Ngũ Thử Độn.',
  },
  {
    q: 'Sinh đúng mùng 1 Tết thì trụ năm lấy năm nào?',
    a: `Có thể vẫn là năm cũ. Trụ năm trong Bát Tự đổi tại tiết Lập Xuân, còn lịch âm dân dụng đổi năm vào Tết, và hai mốc này không trùng nhau. Ví dụ mùng 1 Tết năm 2003 rơi vào ngày ${viDate(TET_2003)}, nhưng Lập Xuân năm ấy mãi ${viDate(LX_2003.date)} mới tới, nên người sinh đúng hôm Tết vẫn được xếp vào trụ năm ${TET_2003_YEAR} chứ chưa phải ${SAU_LX_2003_YEAR}. Chiều ngược lại cũng xảy ra: năm 1996, Lập Xuân rơi vào ${viDate(LX_1996.date)} trong khi mùng 1 Tết mãi ${viDate(TET_1996)} mới đến, nên người sinh giữa hai mốc đã mang trụ năm mới trong khi âm lịch vẫn còn là năm cũ.`,
  },
  {
    q: 'Vì sao trụ tháng đổi theo tiết khí mà không đổi vào mùng 1 âm lịch?',
    a: 'Vì trụ tháng đo mùa chứ không đo tuần trăng. Nó chia một vòng năm thành 12 cung theo vị trí thật của Mặt Trời, mỗi cung 30 độ, và mỗi lần Mặt Trời bước sang cung mới là một tiết mới bắt đầu, kéo theo trụ tháng đổi. Mùng 1 âm lịch thì lại được quyết định bởi thời điểm trăng non, tức một chu kỳ khác hẳn. Hai mốc chạy song song nên có khi rơi gần nhau, có khi lệch cả tuần, và chính chỗ lệch đó là nguyên nhân phổ biến khiến hai nguồn ghi trụ tháng khác nhau cho cùng một người.',
  },
  {
    q: 'Ngũ Thử Độn là gì và dùng để làm gì?',
    a: `Ngũ Thử Độn là phép suy can của trụ giờ từ can của trụ ngày. Chi giờ đã cố định theo khung hai tiếng nên không cần suy, nhưng can giờ thì thay đổi theo từng ngày. Cách làm là lấy can ngày để xác định can của khung giờ Tý, rồi chạy tiếp theo thứ tự Thiên Can cho 11 khung còn lại. Vì mười can và mười hai khung giờ không chia hết cho nhau, can khởi của giờ Tý lặp lại sau mỗi 5 ngày, nên bảng tra chỉ cần ${DON_GROUPS.length} nhóm can ngày thay vì 10. Hệ quả quan trọng: sai trụ ngày thì trụ giờ cũng sai theo.`,
  },
  {
    q: 'Trụ ngày suy từ đâu, có phụ thuộc trụ năm hay trụ tháng không?',
    a: 'Không phụ thuộc gì cả. Trụ ngày là một chuỗi 60 tên chạy vòng liên tục, mỗi ngày tiến đúng một bước, không dừng và không khởi động lại vào Tết, vào Lập Xuân hay vào đầu tháng. Muốn biết một ngày mang trụ nào thì phải đếm từ một ngày đã biết, nên đây là trụ khó nhẩm tay nhất dù luật của nó ngắn nhất. Đổi lại, trụ ngày cũng là trụ ít bị sai nhất, trừ một trường hợp: người sinh sát nửa đêm, vì các trường phái không thống nhất mốc đổi ngày.',
  },
  {
    q: 'Sinh trong khoảng 23h đến 1h đêm thì trụ giờ và trụ ngày tính thế nào?',
    a: 'Khung giờ Tý bắt đầu từ 23h, nên cả người sinh 23h30 lẫn người sinh 00h30 đều mang chi giờ là Tý. Nhưng công cụ này đổi trụ ngày vào lúc 0h dương lịch, nên hai người đó thuộc hai trụ ngày khác nhau, và vì can giờ suy từ can ngày nên can giờ cũng khác. Cần biết thêm là một số trường phái cho rằng ngày mới bắt đầu ngay từ 23h, tức đổi trụ ngày sớm hơn một tiếng. Đây là khác biệt quy ước chứ không phải bên nào tính sai, nên nếu bạn sinh trong khung này, cách an toàn là thử cả hai và biết rõ mình đang đọc bản nào.',
  },
  {
    q: 'Sinh ở nước ngoài thì nhập giờ sinh thế nào cho đúng?',
    a: 'Công cụ hiểu giờ bạn nhập là giờ Việt Nam, tức múi giờ cộng bảy. Vì các mốc tiết khí và mốc Lập Xuân là những thời điểm có thật trên trục thời gian toàn cầu, nhập thẳng giờ đồng hồ của một nước khác sẽ cho một thời điểm sai lệch đúng bằng chênh lệch múi giờ. Với đa số người thì lệch vài tiếng không đổi kết quả, nhưng nếu bạn sinh sát một mốc, chẳng hạn quanh nửa đêm, quanh đầu một khung giờ hoặc quanh một mốc tiết khí, thì phải quy đổi về giờ Việt Nam trước khi nhập.',
  },
  {
    q: 'Lập tứ trụ và luận tứ trụ khác nhau ở đâu?',
    a: 'Lập là bước tính, luận là bước đọc. Bước lập chỉ trả lời một câu hỏi lịch pháp: thời điểm sinh này viết bằng bốn cặp can chi nào. Nó có đáp án xác định, ai tính cũng ra một kết quả, và kiểm lại được. Bước luận mới gán ý nghĩa cho bốn cặp tên ấy, và ở đó có nhiều trường phái, nhiều cách chọn khác nhau, nên chỉ nên đọc như một góc nhìn tham khảo. Hiểu rõ ranh giới này giúp bạn không nhầm sự chính xác của phép tính thành sự chắc chắn của lời luận.',
  },
];

const JSONLD = [
  article({
    headline: 'Lập tứ trụ Bát Tự: từ ngày giờ sinh ra 4 cặp can chi',
    description: DESCRIPTION,
    url: '/learn/lap-bat-tu',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Lập tứ trụ Bát Tự', url: '/learn/lap-bat-tu' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Lập tứ trụ Bát Tự — quy trình dựng 4 trụ từ ngày giờ sinh',
    description: DESCRIPTION,
    url: '/learn/lap-bat-tu',
  }),
];

const LINK = 'text-gold-700 underline-offset-4 hover:underline';
const H3 = 'text-lg font-semibold text-foreground';
const BODY = 'space-y-4 text-foreground/85 leading-relaxed';
const NOTE = 'text-sm text-foreground/70';

export default function LearnLapBatTuPage() {
  return (
    <LearnArticle
      eyebrow="LỊCH PHÁP · LẬP LÁ SỐ"
      title={
        <>
          Lập tứ trụ <span className="bg-gold-gradient bg-clip-text text-transparent">(Bát Tự)</span>
        </>
      }
      standfirst={
        <>
          Trước khi luận được bất cứ điều gì, phải dựng xong bốn trụ đã. Bước này thường bị bỏ qua —
          và đó chính là chỗ hai trang web cho ra hai lá số khác nhau từ cùng một ngày sinh. Bài này
          đi hết quy trình: từ ngày giờ sinh dương lịch ra bốn cặp can chi, kèm hai cái bẫy thời
          điểm mà gần như ai cũng vấp.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Lập tứ trụ Bát Tự' },
      ]}
      relatedLenses={relatedLearnLenses('lap-bat-tu')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày sinh dương lịch và giờ sinh, hệ thống lập đủ bốn trụ năm – tháng – ngày – giờ theo đúng tiết khí. Bạn thấy tám chữ của mình trước, rồi mới đọc phần luận giải.',
        href: '/la-so-bat-tu',
        label: 'Lập tứ trụ của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <LapBatTuFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Lập tứ trụ là gì — và KHÔNG là gì',
          children: (
            <div className={BODY}>
              <p>
                <strong>Lập tứ trụ</strong> là bước biến một thời điểm sinh thành{' '}
                <strong>bốn cặp can chi</strong>: trụ năm, trụ tháng, trụ ngày, trụ giờ. Tám chữ ấy
                chính là cái tên “Bát Tự”. Đầu vào chỉ có ngày sinh dương lịch và giờ sinh; đầu ra là
                bốn cái tên — không hơn.
              </p>
              <p>
                Nói gọn: đây là một <strong>phép phiên dịch thời gian</strong>, cùng loại với việc
                đổi “15 giờ” sang “3 giờ chiều”. Nó có đáp án xác định, ai tính cũng ra một kết quả,
                và kiểm lại được từng bước.
              </p>
              <p>Cần tách bạch ngay từ đầu bài này KHÔNG làm gì:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Không dạy <strong>đọc</strong> bốn trụ. Nhật Chủ, Thập Thần, thân vượng hay nhược,
                  Dụng Thần đều nằm ở{' '}
                  <Link href="/learn/bat-tu" className={LINK}>bài Bát Tự</Link>
                  , đứng sau bước lập.
                </li>
                <li>
                  Không dạy lại <strong>bộ máy can chi</strong>: mười Thiên Can, mười hai Địa Chi,
                  luật ghép và vòng 60 là chủ đề của{' '}
                  <Link href="/learn/can-chi" className={LINK}>bài Can Chi</Link>
                  . Ở đây coi như bạn đã biết một cặp can chi trông thế nào.
                </li>
                <li>
                  Không phán gì về <strong>con người bạn</strong>. Sau bước này bạn mới chỉ có bốn
                  cái tên, chưa có một câu nhận xét nào.
                </li>
              </ul>
              <p>
                Vì sao vẫn đáng học? Vì bước lập là chỗ <strong>duy nhất</strong> trong toàn bộ môn
                này có đúng–sai rõ ràng. Nắm nó, bạn tự kiểm được lá số của mình và phân biệt được{' '}
                <strong>“hai nguồn khác quy ước”</strong> với <strong>“một nguồn tính sai”</strong> —
                thay vì hoang mang khi thấy hai kết quả lệch nhau.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <LapBatTuDepth />,
        },
        {
          id: 'bon-tru-tu-dau-ra',
          tocLabel: 'Bốn trụ từ đâu ra',
          heading: 'Bốn trụ, bốn nguồn dữ liệu khác nhau',
          children: (
            <div className={BODY}>
              <p>
                Sai lầm phổ biến nhất là tưởng bốn trụ cùng suy ra từ một chỗ. Thực ra{' '}
                <strong>mỗi trụ có một nguồn riêng</strong>, và chỉ hai trong bốn trụ là dính tới Mặt
                Trời.
              </p>

              <h3 className={H3}>Trụ năm — bám mốc Lập Xuân</h3>
              <p>
                Trụ năm đổi tại <strong>Lập Xuân</strong>, tức thời điểm Mặt Trời tới một vị trí xác
                định trên vòng hoàng đạo. Nó <strong>không</strong> đổi vào ngày 1 tháng 1 dương
                lịch, cũng <strong>không</strong> đổi vào mùng 1 Tết. Đây là cái bẫy thứ nhất, sẽ mổ
                kỹ ở mục sau.
              </p>

              <h3 className={H3}>Trụ tháng — chi bám tiết khí, can bám can năm</h3>
              <p>
                Trụ tháng dựng bằng hai mảnh. <strong>Chi tháng</strong> lấy theo{' '}
                <strong>tiết khí</strong>: vòng năm được cắt thành 12 cung đều nhau theo vị trí Mặt
                Trời, mỗi lần Mặt Trời bước sang cung mới là một tiết mới và chi tháng đổi.{' '}
                <strong>Can tháng</strong> thì suy từ <strong>can của trụ năm</strong> theo phép{' '}
                <strong>Ngũ Hổ Độn</strong> — vì thế đổi trụ năm là đổi luôn can tháng.
              </p>
              <p className={NOTE}>
                Ví dụ tính bằng engine: năm 2026 mang trụ năm <strong>{YEAR_2026}</strong>, nên tháng
                mở đầu vòng (tháng Dần, bắt đầu từ Lập Xuân) của năm ấy là{' '}
                <strong>{THANG_DAN_2026}</strong> — can của tháng Dần suy ra từ can năm, không phải
                chọn tuỳ ý. Chi tiết 24 tiết khí thuộc{' '}
                <Link href="/learn/tiet-khi" className={LINK}>bài Tiết khí</Link>
                ; ở đây chỉ cần nhớ đúng vai trò của chúng.
              </p>

              <h3 className={H3}>Trụ ngày — chuỗi 60 chạy liên tục</h3>
              <p>
                Trụ ngày <strong>không liên quan gì tới Mặt Trời hay Mặt Trăng</strong>. Nó là một
                chuỗi 60 tên quay vòng, mỗi ngày tiến đúng một bước, chạy đều từ rất lâu và không bao
                giờ khởi động lại. Bằng chứng lấy ngay từ engine — bốn ngày liên tiếp vắt qua mốc Lập
                Xuân 2026:
              </p>
              <p className="font-mono text-sm text-foreground/85">
                {DAY_RUN_DATES.map((d) => `${viDate(d)}: ${pill(chartOf(d, 12).day)}`).join(' · ')}
              </p>
              <p className={NOTE}>
                Trụ năm đổi ở giữa dãy này, nhưng trụ ngày vẫn đi tiếp đúng một bước mỗi ngày, không
                gợn. Engine neo chuỗi vào một ngày đã đối chiếu được — ngày {viDate(ANCHOR_DATE)} là{' '}
                <strong>{ANCHOR_DAY_PILLAR}</strong> — rồi đếm tới, nên bạn không nhẩm tay được mà
                phải tra.
              </p>

              <h3 className={H3}>Trụ giờ — chi bám khung giờ, can bám can ngày</h3>
              <p>
                Chi giờ chia ngày thành 12 khung hai tiếng, cố định quanh năm. Còn{' '}
                <strong>can giờ suy từ can ngày</strong> theo phép <strong>Ngũ Thử Độn</strong>, nên
                nó đổi mỗi ngày. Đây là trụ duy nhất phụ thuộc trực tiếp vào giờ sinh — và cũng là
                trụ mất trắng nếu bạn không nhớ giờ.
              </p>

              <DataTable
                cols={['Trụ', 'Đổi vào lúc nào', 'Suy ra từ đâu', 'Giờ sinh có ảnh hưởng?']}
                minWidth="min-w-[640px]"
                rows={SOURCE_ROWS.map(([tru, doi, nguon, gio]) => ({
                  key: tru,
                  cells: [bold(tru), doi, nguon, gio],
                }))}
              />
              <p className={NOTE}>
                Đọc cột cuối sẽ thấy vì sao công cụ vẫn lập được ba trụ khi bạn không nhớ giờ: năm,
                tháng, ngày không cần giờ (trừ ca sát mốc), chỉ trụ giờ là phải bỏ ngỏ.
              </p>
            </div>
          ),
        },
        {
          id: 'hai-cai-bay-thoi-diem',
          tocLabel: 'Hai cái bẫy thời điểm',
          heading: 'Hai cái bẫy: Lập Xuân không phải Tết, tiết khí không phải mùng 1 âm',
          children: (
            <div className={BODY}>
              <p>
                Gần như toàn bộ khác biệt giữa hai lá Bát Tự đến từ đúng hai chỗ này. Cả hai đều là{' '}
                <strong>lẫn lộn giữa lịch mặt trăng và lịch mặt trời</strong>.
              </p>

              <h3 className={H3}>Bẫy 1 — Trụ năm đổi ở Lập Xuân, không đổi ở Tết</h3>
              <p>
                Lịch âm dân dụng đổi năm vào <strong>Tết</strong>, mốc do trăng non quyết định nên
                trôi trong khoảng một tháng dương lịch. Bát Tự đổi trụ năm tại{' '}
                <strong>Lập Xuân</strong>, mốc do Mặt Trời quyết định nên gần như đứng yên quanh ngày
                4 tháng 2. Hai mốc lệch nhau, và <strong>thứ tự trước–sau còn đảo</strong> tuỳ năm.
              </p>
              <p>
                <strong>Trường hợp A — Tết đến trước Lập Xuân (năm 2003).</strong> Mùng 1 Tết rơi vào{' '}
                {viDate(TET_2003)}, còn engine đặt mốc Lập Xuân ở {viDate(LX_2003.date)} lúc{' '}
                {LX_2003.time} giờ Việt Nam. Nghĩa là có một khoảng vài ngày mà âm lịch đã sang năm
                mới nhưng trụ năm thì chưa:
              </p>
              <YearTrapTable rows={YEAR_TRAP_2003} />
              <p className={NOTE}>
                Để ý hai dòng cuối: <strong>cùng một ngày</strong>, chỉ khác nhau vài tiếng đồng hồ,
                mà trụ năm đã khác. Mốc Lập Xuân là một thời điểm cụ thể trong ngày, không phải cả
                ngày.
              </p>
              <p>
                <strong>Trường hợp B — Lập Xuân đến trước Tết (năm 1996).</strong> Lần này ngược lại:
                engine đặt Lập Xuân ở {viDate(LX_1996.date)} lúc {LX_1996.time} giờ Việt Nam, trong
                khi mùng 1 Tết mãi {viDate(TET_1996)} mới tới. Người sinh giữa hai mốc mang trụ năm
                mới trong khi âm lịch vẫn còn năm cũ:
              </p>
              <YearTrapTable rows={YEAR_TRAP_1996} />
              <p className={NOTE}>
                Đây chính là lý do một người có thể được ghi “tuổi” khác nhau ở hai chỗ: trang tra
                cứu con giáp đọc theo Tết, còn lá số Bát Tự đọc theo Lập Xuân.{' '}
                <strong>Cả hai đều không sai</strong> — chúng trả lời hai câu hỏi khác nhau.
              </p>

              <h3 className={H3}>Bẫy 2 — Trụ tháng đổi theo tiết khí, không đổi vào mùng 1 âm lịch</h3>
              <p>
                Cái bẫy này kín hơn, vì hai mốc thường chỉ lệch vài ngày nên nhiều người tưởng là
                một. Bảng dưới lấy mốc <strong>12h trưa giờ Việt Nam</strong> của từng ngày, đặt ngày
                âm lịch cạnh trụ tháng do engine tính:
              </p>
              <DataTable
                cols={['Ngày sinh (dương)', 'Ngày âm lịch', 'Trụ tháng (engine)', 'Ghi chú']}
                minWidth="min-w-[620px]"
                rows={MONTH_TRAP_ROWS.map(([date, note]) => ({
                  key: date,
                  cells: [viDate(date), lunarLabel(date), bold(pill(chartOf(date, 12).month)), note],
                }))}
              />
              <p>Đọc bảng theo hai chiều sẽ thấy rõ hai mốc hoàn toàn độc lập:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Trụ tháng đổi mà âm lịch không đổi:</strong> giữa hai ngày 07 và 08 tháng
                  9, âm lịch vẫn đang trong cùng một tháng, nhưng trụ tháng đã sang trụ khác vì đã
                  qua mốc tiết.
                </li>
                <li>
                  <strong>Âm lịch đổi mà trụ tháng không đổi:</strong> ngày 11 tháng 9 là mùng 1
                  tháng 8 âm, và ngày 17 tháng 5 là mùng 1 tháng 4 âm — cả hai lần trụ tháng đều
                  đứng yên.
                </li>
              </ul>
              <p className={NOTE}>
                Hệ quả cần nhớ khi tự tra:{' '}
                <strong>đừng đổi ngày sinh sang âm lịch rồi lấy tháng âm làm chi tháng</strong>. Đó
                là lỗi phổ biến nhất khiến một lá số lệch nguyên một trụ — và vì can tháng suy từ can
                năm, lệch chi tháng thường kéo theo lệch cả cặp.
              </p>
            </div>
          ),
        },
        {
          id: 'ngu-thu-don-gio',
          tocLabel: 'Ngũ Thử Độn · trụ giờ',
          heading: 'Trụ giờ: 12 khung giờ và phép Ngũ Thử Độn',
          children: (
            <div className={BODY}>
              <p>
                Trụ giờ dựng bằng hai bước rõ rệt. <strong>Bước 1</strong> lấy chi giờ: cứ hai tiếng
                một khung, tổng cộng 12 khung, cố định quanh năm. Điểm dễ vấp duy nhất là{' '}
                <strong>khung Tý mở từ 23h</strong> chứ không mở từ nửa đêm:
              </p>
              <DataTable
                cols={['#', 'Khung giờ', 'Chi giờ']}
                minWidth="min-w-[380px]"
                rows={HOUR_SLOTS.map((s, i) => ({
                  key: s.chi,
                  cells: [
                    <span key="i" className="font-mono text-xs text-gold-700">
                      {i + 1}
                    </span>,
                    slotRange(s),
                    bold(s.chi),
                  ],
                }))}
              />
              <p className={NOTE}>
                Bảng này dò thẳng từ engine (hỏi nó chi giờ của cả 24 giờ trong một ngày rồi gom
                lại), nên nó đúng bằng thứ công cụ đang dùng.
              </p>

              <h3 className={H3}>Bước 2 — Ngũ Thử Độn: can giờ suy từ can ngày</h3>
              <p>
                Chi giờ xong rồi vẫn chưa đủ, vì một trụ cần hai chữ. <strong>Can giờ</strong> không
                cố định theo khung mà <strong>đổi theo từng ngày</strong>: can ngày quyết định can
                của khung Tý, rồi các khung sau chạy tiếp theo thứ tự Thiên Can.
              </p>
              <p>
                Vì 10 can và 12 khung giờ không chia hết cho nhau, sau một ngày dãy can đã nhích 2
                bước, nên can khởi của khung Tý lặp lại sau mỗi 5 ngày. Kết quả: bảng tra chỉ cần{' '}
                <strong>{DON_GROUPS.length} nhóm can ngày</strong> thay vì 10 — và con số đó không
                phải do bài viết gán, mà là số nhóm engine tự gom ra khi so dãy can giờ của cả 10 can
                ngày.
              </p>
              <DataTable
                cols={['Khung giờ', 'Chi', ...DON_GROUPS.map((g) => `Ngày ${g.stems.join(' / ')}`)]}
                minWidth="min-w-[680px]"
                rows={HOUR_SLOTS.map((s, i) => ({
                  key: s.chi,
                  cells: [
                    slotRange(s),
                    bold(s.chi),
                    ...DON_GROUPS.map((g) => `${g.hourCans[i]} ${s.chi}`),
                  ],
                }))}
              />
              <p className={NOTE}>
                Cách dùng: tìm cột chứa can trụ ngày của bạn, rồi dóng xuống hàng ứng với giờ sinh —
                ô giao nhau chính là trụ giờ. Toàn bộ ô trong bảng do engine sinh ra lúc dựng trang,
                không gõ tay ô nào.
              </p>
              <p>
                Điều quan trọng nhất rút ra từ bảng này là một{' '}
                <strong>dây chuyền phụ thuộc</strong>: can năm quyết định can tháng, can ngày quyết
                định can giờ. Sai một mắt là lệch cả chuỗi — và đó cũng là lý do mục tiếp theo phải
                nói về giới hạn.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: lập đúng không có nghĩa là luận đúng',
          children: (
            <div className={BODY}>
              <p>Phần này quan trọng ngang phần kỹ thuật ở trên, và hay bị bỏ qua nhất.</p>

              <h3 className={H3}>1. Sai giờ sinh là mất trắng một phần tư lá số</h3>
              <p>
                Trụ giờ là một trong bốn trụ. Không nhớ giờ thì không lập được nó — công cụ vẫn dựng
                ba trụ còn lại, nhưng phần liên quan tới trụ giờ phải bỏ. Tệ hơn là{' '}
                <strong>nhớ sai</strong> giờ: bạn nhận một trụ giờ trông rất chắc chắn mà thực ra
                không phải của mình. Ở sát nửa đêm, lệch còn lan sang trụ ngày — hai người sinh cách
                nhau đúng một tiếng qua mốc 0h:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Sinh {viDate('2026-03-10')} lúc 23:30 → trụ ngày{' '}
                  <strong>{pill(NIGHT_BEFORE.day)}</strong>, trụ giờ{' '}
                  <strong>{pill(NIGHT_BEFORE.hour)}</strong>.
                </li>
                <li>
                  Sinh {viDate('2026-03-11')} lúc 00:30 → trụ ngày{' '}
                  <strong>{pill(NIGHT_AFTER.day)}</strong>, trụ giờ{' '}
                  <strong>{pill(NIGHT_AFTER.hour)}</strong>.
                </li>
              </ul>
              <p className={NOTE}>
                Cả hai đều mang chi giờ Tý (khung Tý mở từ 23h), nhưng vì trụ ngày đã sang ngày mới
                nên can giờ khác theo. Thêm nữa,{' '}
                <strong>một số trường phái đổi trụ ngày ngay từ 23h</strong> thay vì 0h — với người
                sinh trong khung 23h–24h, hai hệ cho hai trụ ngày khác nhau. Đó là khác quy ước,
                không phải bên nào tính sai; nếu bạn rơi vào khung này, hãy thử cả hai và biết mình
                đang đọc bản nào.
              </p>

              <h3 className={H3}>2. Giờ nhập phải là giờ Việt Nam</h3>
              <p>
                Công cụ hiểu giờ bạn nhập theo <strong>múi giờ Việt Nam</strong>. Các mốc tiết khí là
                thời điểm có thật trên trục thời gian chung, nên nhập thẳng giờ đồng hồ của nước khác
                sẽ cho một thời điểm lệch đúng bằng chênh lệch múi giờ. Với đa số người thì không đổi
                kết quả; nhưng nếu sinh sát một mốc, phải quy đổi trước khi nhập.
              </p>

              <h3 className={H3}>3. Đây là hệ đặt tên, không phải phép đo</h3>
              <p>
                Vị trí Mặt Trời được tính bằng thuật toán thiên văn có kiểm chứng, nên các{' '}
                <strong>mốc</strong> là dữ kiện thật. Nhưng việc gán cho mỗi khoảng thời gian một cặp
                can chi vẫn là <strong>một quy ước đặt tên mang tính biểu tượng</strong> — không có
                đại lượng vật lý nào được đo ở đây. Phép tính chính xác tới từng phút{' '}
                <strong>không</strong> biến phần luận giải phía sau thành phép đo.
              </p>

              <h3 className={H3}>4. Lập xong vẫn chưa phán gì</h3>
              <p>
                Có đủ tám chữ rồi bạn mới chỉ có <strong>bốn cái tên</strong>. Bốn cái tên ấy không
                nói bạn giàu nghèo, hợp ai, nên làm gì. hieu.asia tách bạch có chủ đích: phần lập trụ
                công khai và tái lập được, phần luận giải nói rõ là góc nhìn tham khảo —{' '}
                <strong>không phán số mệnh, không doạ vận hạn</strong>. Muốn bước sang phần đọc, mời
                bạn qua{' '}
                <Link href="/learn/bat-tu" className={LINK}>bài Bát Tự</Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <LapBatTuWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <LapBatTuRecall />,
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
                Muốn hiểu bộ chữ dùng để viết bốn trụ, đọc{' '}
                <Link href="/learn/can-chi" className={LINK}>bài Can Chi</Link>
                . Muốn hiểu 24 mốc chia vòng năm, đọc{' '}
                <Link href="/learn/tiet-khi" className={LINK}>bài Tiết khí</Link>
                . Còn muốn ĐỌC bốn trụ đã lập, sang{' '}
                <Link href="/learn/bat-tu" className={LINK}>bài Bát Tự</Link>
                .
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn thấy ngay tám chữ của mình, tính theo đúng tiết khí?{' '}
                <Link href="/la-so-bat-tu" className={LINK}>Lập tứ trụ miễn phí →</Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/la-so-bat-tu', label: 'Lập lá số Bát Tự' },
                    { href: '/luc-thap-hoa-giap', label: 'Bảng 60 Can Chi' },
                    { href: '/lich-van-nien', label: 'Lịch vạn niên' },
                    { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
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
          children: <LapBatTuChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
