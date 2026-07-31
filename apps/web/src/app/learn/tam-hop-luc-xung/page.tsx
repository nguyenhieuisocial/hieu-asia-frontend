/**
 * Bài học /learn/tam-hop-luc-xung.
 *
 * GROUNDING — KHÔNG gõ tay một cặp nào. Mọi bảng được suy lúc build từ chính
 * dữ liệu + hàm phân loại của công cụ:
 *   • lib/hop-tuoi-pairs.ts → ZODIAC (12 địa chi ĐÚNG thứ tự Tý…Hợi, kèm ngũ
 *     hành + emoji), relationOf(a, b) (trả về 'tam-hop' | 'luc-hop' |
 *     'luc-xung' | 'luc-hai' | 'dong-tuoi' | 'binh-hoa') và RELATION_COPY.
 *   • app/tuong-hop-12-con-giap/page.tsx — nơi ĐÚNG hàm relationOf() ấy dựng ma
 *     trận 12×12 (144 ô), nên bảng ở đây không thể lệch với công cụ.
 *
 * Phát biểu hình học đều kiểm được từ bảng: tam hợp = 3 chi cách 4 bước; lục
 * xung = 2 chi cách 6 bước (đối đỉnh); lục hợp = soi gương qua khe Tý|Sửu (tổng
 * số thứ tự 1–12 là 3 hoặc 15); lục hại = soi gương qua khe Mão|Thìn (tổng 9
 * hoặc 21); hệ quả: hại = xung của hợp.
 *
 * PHÂN VAI (chống trùng): /learn/hop-tuoi sở hữu "xem hợp tuổi vợ chồng / làm
 * ăn và cách dùng kết quả"; /learn/con-giap sở hữu tính cách từng con giáp và
 * cục ngũ hành mỗi nhóm tam hợp. Bài NÀY chỉ sở hữu HÌNH HỌC của vòng 12 địa
 * chi — lời khuyên hợp–khắc chỉ nhắc một câu rồi link /hop-tuoi.
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  ZODIAC,
  relationOf,
  RELATION_COPY,
  type RelationKind,
  type Zodiac,
} from '@/lib/hop-tuoi-pairs';
import {
  TamHopFrame,
  TamHopDepth,
  TamHopRecall,
  TamHopChecklist,
  TamHopWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Tam hợp – lục xung: hình học vòng 12 địa chi',
  description:
    'Tam hợp là 3 chi cách nhau 4 bước, lục xung là 2 chi đối đỉnh. Hiểu hình học vòng 12 địa chi để tự suy ra mọi cặp hợp, xung, hại.',
  alternates: { canonical: 'https://hieu.asia/learn/tam-hop-luc-xung' },
};

// --- Suy dữ liệu từ lib (không gõ tay) --------------------------------------

const N = ZODIAC.length; // 12

/** Số thứ tự trên vòng địa chi: Tý = 1, Sửu = 2, … Hợi = 12. */
const ORDINAL: ReadonlyMap<string, number> = new Map(ZODIAC.map((z, i) => [z.slug, i + 1]));

const ord = (z: Zodiac): number => ORDINAL.get(z.slug) ?? 0;

/** Khoảng cách bước NGẮN NHẤT giữa hai chi trên vòng tròn 12 (0–6). */
function stepDistance(a: Zodiac, b: Zodiac): number {
  const d = Math.abs(ord(a) - ord(b)) % N;
  return Math.min(d, N - d);
}

const label = (kind: RelationKind): string => RELATION_COPY[kind].label;

const names = (list: Zodiac[]): string => list.map((z) => z.ten).join(' – ');

/** `step` = khoảng cách bước ngắn nhất; `sum` = tổng hai số thứ tự 1–12. */
interface DerivedPair {
  a: Zodiac;
  b: Zodiac;
  step: number;
  sum: number;
}

/** Mọi cặp (không trùng) được relationOf() xếp vào `kind`. */
function pairsOf(kind: RelationKind): DerivedPair[] {
  const out: DerivedPair[] = [];
  for (let i = 0; i < N; i += 1) {
    for (let j = i + 1; j < N; j += 1) {
      const a = ZODIAC[i];
      const b = ZODIAC[j];
      if (!a || !b || relationOf(a.slug, b.slug) !== kind) continue;
      out.push({ a, b, step: stepDistance(a, b), sum: ord(a) + ord(b) });
    }
  }
  return out;
}

/**
 * 4 nhóm tam hợp, suy từ relationOf(). Mỗi nhóm được xoay để bắt đầu từ chi có
 * số thứ tự chia hết cho 3 (Dần 3, Tỵ 6, Thân 9, Hợi 12) — đúng cách gọi quen
 * thuộc "Thân – Tý – Thìn", "Dần – Ngọ – Tuất"…
 */
function tamHopGroups(): Zodiac[][] {
  const seen = new Set<string>();
  const groups: Zodiac[][] = [];
  for (const z of ZODIAC) {
    const members = [z, ...ZODIAC.filter((o) => relationOf(z.slug, o.slug) === 'tam-hop')];
    const key = members
      .map((m) => m.slug)
      .sort()
      .join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    const head = members.find((m) => ord(m) % 3 === 0) ?? z;
    const start = ord(head) - 1;
    const ordered: Zodiac[] = [];
    for (const k of [0, 4, 8]) {
      const m = ZODIAC[(start + k) % N];
      if (m) ordered.push(m);
    }
    groups.push(ordered);
  }
  return groups;
}

/**
 * 3 "hình vuông" — bốn chi cách nhau đều 3 bước, gom theo số dư của số thứ tự
 * khi chia 3. Dân gian gọi các nhóm bốn này là "tứ hành xung".
 */
const squareGroups = (): Zodiac[][] => [1, 2, 0].map((r) => ZODIAC.filter((z) => ord(z) % 3 === r));

/** Đếm quan hệ của MỘT chi với 11 chi còn lại (giống hệt nhau ở cả 12 chi). */
function countsForOneChi(): { kind: RelationKind; n: number }[] {
  const base = ZODIAC[0];
  const order: RelationKind[] = ['tam-hop', 'luc-hop', 'luc-xung', 'luc-hai', 'binh-hoa'];
  return order.map((kind) => ({
    kind,
    n: base
      ? ZODIAC.filter((o) => o.slug !== base.slug && relationOf(base.slug, o.slug) === kind).length
      : 0,
  }));
}

const TAM_HOP_GROUPS = tamHopGroups();
const SQUARE_GROUPS = squareGroups();
const XUNG_PAIRS = pairsOf('luc-xung');
const HOP_PAIRS = pairsOf('luc-hop');
const HAI_PAIRS = pairsOf('luc-hai');
const NAMED_PAIRS =
  pairsOf('tam-hop').length + XUNG_PAIRS.length + HOP_PAIRS.length + HAI_PAIRS.length;
const ALL_PAIRS = (N * (N - 1)) / 2;
const TAM_HOP_ROWS: TableRow[] = TAM_HOP_GROUPS.map((g) => {
  const head = g[0];
  const opp = TAM_HOP_GROUPS.find((o) => {
    const h = o[0];
    return head && h && relationOf(head.slug, h.slug) === 'luc-xung';
  });
  return {
    key: names(g),
    cells: [names(g), g.map(ord).join(' · '), '4 · 4 · 4', opp ? names(opp) : '—'],
  };
});

const SQUARE_ROWS: TableRow[] = SQUARE_GROUPS.map((g) => {
  const [p, q, r, s] = g;
  return {
    key: names(g),
    cells: [
      names(g),
      g.map(ord).join(' · '),
      p && q && r && s ? `${p.ten} – ${r.ten} · ${q.ten} – ${s.ten}` : '—',
      edgeLabels(g),
    ],
  };
});

/** vd "2 tam hợp, 1 lục hợp, 1 lục xung, 1 lục hại, 6 bình hoà". */
const PER_CHI = countsForOneChi()
  .map((c) => `${c.n} ${label(c.kind).toLowerCase()}`)
  .join(', ');

/** Hàng "quan hệ với Tý" — minh hoạ khoảng cách bước quyết định điều gì. */
const FROM_TY: TableRow[] = ZODIAC.map((z) => {
  const base = ZODIAC[0];
  return {
    key: z.slug,
    cells: [
      `${z.emoji} ${z.ten}`,
      ord(z),
      base ? stepDistance(base, z) : 0,
      base ? label(relationOf(base.slug, z.slug)) : '',
    ],
  };
});

/** 4 cạnh kề của một hình vuông, khử trùng nhãn. */
function edgeLabels(group: Zodiac[]): string {
  const set = new Set<string>();
  group.forEach((z, k) => {
    const next = group[(k + 1) % group.length];
    if (next) set.add(label(relationOf(z.slug, next.slug)));
  });
  return Array.from(set).join(' / ') || '—';
}

// --- Bảng dùng chung --------------------------------------------------------

interface TableRow {
  key: string;
  cells: ReactNode[];
}

const CELL_HEAD = 'px-4 py-2 font-medium text-foreground';
const CELL_REST = 'px-4 py-2 tabular-nums text-muted-foreground';

/** 3 bảng cặp (xung / hợp / hại) dùng chung một khuôn. */
const pairRows = (
  list: DerivedPair[],
  mid: (p: DerivedPair) => string,
  last: (p: DerivedPair) => string,
): TableRow[] =>
  list.map((p) => ({
    key: `${p.a.slug}-${p.b.slug}`,
    cells: [`${p.a.ten} – ${p.b.ten}`, mid(p), last(p)],
  }));

function DataTable({ minW, headers, rows }: { minW: string; headers: string[]; rows: TableRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className={`w-full ${minW} text-left text-sm`}>
        <thead>
          <tr className="border-b border-border bg-card/60">
            {headers.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className="border-b border-border/60 last:border-b-0">
              {r.cells.map((c, i) => (
                <td key={i} className={i === 0 ? CELL_HEAD : CELL_REST}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn accordion hiển thị → chữ schema ===
// chữ trên trang. Câu hỏi được chọn KHÁC hẳn FAQ của trang công cụ
// /tuong-hop-12-con-giap (vốn hỏi "bản đồ là gì", "xung có xấu không", "tam hợp
// khác lục hợp thế nào") và khác FAQ của /learn/hop-tuoi, /learn/con-giap.
const FAQS = [
  {
    q: 'Vì sao tam hợp lại là ba con giáp cách nhau đúng 4 bước?',
    a: 'Vì 12 địa chi xếp đều trên một vòng tròn, mà 12 chia cho 3 bằng 4. Muốn đặt ba chi cách đều nhau trên vòng ấy thì khoảng cách bắt buộc phải là 4 bước, và ba chi đó nối lại thành một tam giác đều. Con số 4 không phải lựa chọn của người xưa mà là kết quả bắt buộc của con số 12. Xoay tam giác đó đi từng bước, bạn được đúng 4 nhóm khác nhau rồi nó trùng lại chính nó — nên có đúng 4 nhóm tam hợp phủ kín cả 12 con giáp.',
  },
  {
    q: 'Làm sao tính nhanh con giáp xung với tuổi mình mà không cần bảng tra?',
    a: 'Đánh số 12 chi theo thứ tự Tý là 1, Sửu là 2, Dần là 3, cho tới Hợi là 12. Con giáp xung với bạn là số của bạn cộng thêm 6; nếu vượt quá 12 thì trừ đi 12. Ví dụ Mão là 4, cộng 6 ra 10 tức Dậu; Thân là 9, cộng 6 ra 15, trừ 12 còn 3 tức Dần. Quy tắc cộng 6 đến từ hình học: 12 chia đôi là 6, nên chi xung chính là chi nằm đối đỉnh qua tâm vòng tròn.',
  },
  {
    q: 'Lục hợp và lục hại có liên hệ gì với nhau không?',
    a: 'Có, và liên hệ rất chặt. Cả hai đều là phép soi gương trên vòng 12, chỉ khác trục: trục của lục hợp đi qua khe giữa Tý và Sửu, trục của lục hại đi qua khe giữa Mão và Thìn. Hai trục lệch nhau đúng 90 độ, mà soi gương hai lần qua hai trục lệch 90 độ thì bằng quay nửa vòng, tức đúng phép lục xung. Hệ quả là lục hại của một chi luôn bằng chi xung với lục hợp của nó: Tý hợp Sửu, Sửu xung Mùi, nên Tý hại Mùi. Điều này đúng cho cả 12 chi.',
  },
  {
    q: 'Vì sao dân gian gọi là “tứ hành xung” trong khi bảng tra chỉ có sáu cặp lục xung?',
    a: 'Vì trên vòng 12 còn vẽ được hình vuông: bốn chi cách nhau đều 3 bước, và có đúng ba hình vuông như vậy là Tý – Mão – Ngọ – Dậu, Sửu – Thìn – Mùi – Tuất, Dần – Tỵ – Thân – Hợi. Mỗi hình vuông chứa hai đường chéo, và hai đường chéo ấy chính là hai cặp lục xung. Dân gian gộp bốn chi lại gọi chung là một nhóm tứ hành xung. Cần lưu ý hai chi đứng cạnh nhau trên hình vuông, như Tý với Mão, theo bảng tra lại không hề xung nhau. Công cụ tương hợp của hieu.asia không có nhãn tứ hành xung, chỉ phân loại theo từng cặp.',
  },
  {
    q: 'Một con giáp có bao nhiêu con giáp hợp, bao nhiêu con cần lưu ý, bao nhiêu con bình hoà?',
    a: 'Với 11 con giáp còn lại, mỗi con giáp luôn có đúng 2 con tam hợp, 1 con lục hợp, 1 con lục xung, 1 con lục hại và 6 con bình hoà. Con số này giống hệt nhau ở cả 12 con giáp, vì hệ quan hệ được dựng trên một vòng tròn đối xứng hoàn toàn. Nói cách khác, quá nửa số quan hệ là bình hoà, và chỉ 2 trong 11 con giáp rơi vào nhóm được khuyên dung hoà nhiều hơn.',
  },
  {
    q: 'Vì sao một con giáp vừa nằm trong nhóm ba (tam hợp) vừa nằm trong nhóm bốn?',
    a: 'Vì 12 vừa bằng 4 nhân 3, vừa bằng 3 nhân 4. Chia vòng 12 thành các nhóm ba cách đều thì mỗi bước là 4 và ta được 4 nhóm; chia thành các nhóm bốn cách đều thì mỗi bước là 3 và ta được 3 nhóm. Hai cách chia này độc lập với nhau và cùng phủ kín 12 chi, nên mỗi con giáp đồng thời thuộc một nhóm ba và một nhóm bốn. Đây thuần tuý là tính chất của con số 12, không phải một quy ước thêm vào.',
  },
  {
    q: 'Các bảng tam hợp – lục xung trên trang này lấy từ đâu?',
    a: 'Chúng không được gõ tay. Trang này gọi đúng hàm phân loại quan hệ mà công cụ Bản đồ tương hợp 12 con giáp dùng để dựng ma trận 144 ô, rồi tự sinh ra bảng khi trang được build. Vì hai nơi dùng chung một nguồn nên bài học và công cụ không thể nói hai kiểu. Nếu bạn gặp một bảng trên mạng khác với bảng ở đây, hãy thử kiểm bằng hình học: đếm bước trên vòng 12 là biết ngay bảng nào chép sai.',
  },
];

const JSONLD = [
  article({
    headline: 'Tam hợp – lục xung: hình học của vòng 12 địa chi',
    description:
      'Vì sao tam hợp là ba chi cách nhau 4 bước, lục xung là hai chi đối đỉnh, lục hợp và lục hại là hai trục gương — và “tứ hành xung” thực chất là hình vuông trên vòng 12.',
    url: '/learn/tam-hop-luc-xung',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Tam hợp – lục xung', url: '/learn/tam-hop-luc-xung' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Tam hợp – lục xung: hình học của vòng 12 địa chi',
    description:
      'Tam hợp là 3 chi cách nhau 4 bước, lục xung là 2 chi đối đỉnh. Hiểu hình học vòng 12 địa chi để tự suy ra mọi cặp hợp, xung, hại.',
    url: '/learn/tam-hop-luc-xung',
  }),
];

const linkCls = 'text-gold-700 underline-offset-4 hover:underline';

export default function LearnTamHopLucXungPage() {
  return (
    <LearnArticle
      eyebrow="CAN CHI · CẤU TRÚC"
      title={
        <>
          Tam hợp – lục xung{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (hình học vòng 12 chi)
          </span>
        </>
      }
      standfirst={
        <>
          Bốn nhóm tam hợp, sáu cặp lục xung, sáu cặp lục hợp, sáu cặp lục hại — trông như{' '}
          {NAMED_PAIRS} mẩu phải học thuộc. Thật ra tất cả mọc ra từ đúng một thứ: mười hai địa chi
          xếp đều nhau trên một vòng tròn. Bài này chỉ ra cái vòng ấy, để bạn đọc quan hệ bằng cách
          đếm bước thay vì tra bảng.
        </>
      }
      readMeta="10 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Tam hợp – lục xung' },
      ]}
      relatedLenses={relatedLearnLenses('tam-hop-luc-xung')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Chọn con giáp của bạn và xem ngay quan hệ với cả 11 con còn lại trên một bản đồ — kèm ma trận đầy đủ 12 × 12 để bạn tự đối chiếu với phần hình học vừa học.',
        href: '/tuong-hop-12-con-giap',
        label: 'Mở bản đồ tương hợp 12 con giáp',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <TamHopFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Tam hợp – lục xung là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Tam hợp, lục hợp, lục xung, lục hại</strong> là bốn họ quan hệ mà Can Chi dân
                gian gán cho từng cặp trong mười hai địa chi (Tý, Sửu, Dần… Hợi — tức mười hai con
                giáp). Gộp lại, chúng đặt tên cho <strong>{NAMED_PAIRS} cặp</strong> trên tổng số{' '}
                <strong>{ALL_PAIRS} cặp</strong> có thể có; những cặp còn lại được gọi là{' '}
                <em>bình hoà</em>.
              </p>
              <p>
                Điều hầu như không ai nói ra khi liệt kê các bảng ấy:{' '}
                <strong>chúng không phải bốn danh sách độc lập</strong>. Cả bốn đều là hệ quả của một
                sự sắp đặt duy nhất — mười hai địa chi nằm cách đều nhau trên một vòng tròn. Bài này
                đi đúng vào phần đó: <strong>hình học và tính đối xứng</strong> của vòng 12.
              </p>
              <p>Cần khoanh vùng rõ ngay từ đầu, vì đây là chỗ dễ lẫn:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Bài này <strong>không</strong> trả lời câu “hai người có hợp nhau không”. Đó là việc
                  của <Link href="/learn/hop-tuoi" className={linkCls}>bài Hợp tuổi</Link> và công cụ{' '}
                  <Link href="/hop-tuoi" className={linkCls}>xem hợp tuổi</Link>.
                </li>
                <li>
                  Bài này cũng <strong>không</strong> nói về tính cách hay sở trường của từng con
                  giáp — phần đó ở{' '}
                  <Link href="/learn/con-giap" className={linkCls}>bài 12 con giáp</Link>, cùng ý
                  nghĩa “cục” ngũ hành của mỗi nhóm tam hợp.
                </li>
                <li>
                  Và nó <strong>không phải</strong> một quy luật về con người. Hình học thì chặt chẽ
                  và kiểm được; còn việc gán nghĩa “hợp” cho tam giác và “xung” cho đường kính là{' '}
                  <strong>quy ước văn hoá</strong>.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Về lời khuyên quan hệ thì chỉ cần một câu: “xung” hay “hại” không phải điềm xấu, chỉ
                là hai nhịp sống khác nhau và rất nhiều cặp như vậy vẫn rất bền. Từ đây trở xuống,
                chúng ta chỉ nói về cấu trúc.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <TamHopDepth />,
        },
        {
          id: 'vong-tron-12-chi',
          tocLabel: 'Vòng tròn 12 chi',
          heading: 'Vòng tròn 12 địa chi: khoảng cách bước là chìa khoá',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Hãy xếp mười hai địa chi lên một mặt đồng hồ, theo đúng thứ tự và{' '}
                <strong>cách đều nhau</strong>: Tý là 1, Sửu là 2, Dần là 3… cho tới Hợi là 12. Vì là
                vòng tròn nên đi hết 12 thì quay lại 1, và khoảng cách giữa hai chi luôn đi được theo
                hai chiều — ta lấy <strong>chiều ngắn hơn</strong>. Hệ quả đầu tiên đáng nhớ: khoảng
                cách lớn nhất trên vòng 12 là <strong>6 bước</strong>.
              </p>
              <p>
                Bảng dưới lấy tuổi <strong>Tý</strong> làm mốc, liệt kê khoảng cách tới từng con giáp
                kèm loại quan hệ mà công cụ tra ra. Hãy đọc cột “bước” trước, rồi mới đọc cột “quan
                hệ”:
              </p>
              <DataTable
                minW="min-w-[480px]"
                headers={['Con giáp', 'Số thứ tự', 'Cách Tý mấy bước', 'Quan hệ với Tý']}
                rows={FROM_TY}
              />
              <p>Đọc kỹ bảng sẽ thấy hai kiểu quan hệ khác hẳn nhau:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chỉ phụ thuộc khoảng cách.</strong> Cả hai chi cách Tý đúng 4 bước (Thân và
                  Thìn) đều là <em>tam hợp</em>; chi cách đúng 6 bước (Ngọ) là <em>lục xung</em>.
                  Khoảng cách bao nhiêu thì quan hệ ấy, không cần biết bạn đứng ở đâu trên vòng.
                </li>
                <li>
                  <strong>Không chỉ phụ thuộc khoảng cách.</strong> Sửu và Hợi đều cách Tý đúng 1
                  bước, nhưng Sửu là <em>lục hợp</em> còn Hợi là <em>bình hoà</em>. Vậy riêng lục hợp
                  (và lục hại) cần thêm một thông tin nữa: <strong>trục đối xứng</strong>.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'tam-hop-tu-hanh-xung',
          tocLabel: 'Tam hợp & tứ hành xung',
          heading: 'Tam hợp: tam giác đều — và “tứ hành xung” là hình vuông',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Bốn nhóm tam hợp — ba chi cách nhau đúng 4 bước
              </h3>
              <p>
                Muốn đặt ba chi cách đều nhau trên vòng 12 thì khoảng cách bắt buộc là{' '}
                <strong>12 ÷ 3 = 4 bước</strong>. Nối ba chi ấy lại, bạn được một{' '}
                <strong>tam giác đều</strong> nội tiếp vòng tròn. Bảng dưới là bốn nhóm tam hợp, suy
                thẳng từ bảng phân loại của công cụ:
              </p>
              <DataTable
                minW="min-w-[520px]"
                headers={[
                  'Nhóm tam hợp',
                  'Số thứ tự',
                  'Bước giữa các chi',
                  'Nhóm đối đỉnh (xoay nửa vòng)',
                ]}
                rows={TAM_HOP_ROWS}
              />
              <p>
                Vì sao đúng <strong>bốn</strong> nhóm? Xoay tam giác đó đi một bước là được một nhóm
                mới; xoay tiếp, lại một nhóm mới. Nhưng tới lần thứ tư thì tam giác{' '}
                <strong>trùng lại chính nó</strong>. Bốn nhóm ấy phủ kín cả 12 con giáp, và mỗi con
                giáp thuộc đúng một nhóm.
              </p>
              <p className="text-sm text-foreground/70">
                Cột cuối bảng là hệ quả ít được nhắc: xoay một nhóm tam hợp nửa vòng (lấy chi lục
                xung của từng thành viên) thì ra <strong>một nhóm tam hợp khác</strong> chứ không phá
                vỡ nó — bốn nhóm tự bắt cặp thành hai cặp đối nhau. Ý nghĩa “cục” ngũ hành từng nhóm
                đọc ở <Link href="/learn/con-giap" className={linkCls}>bài 12 con giáp</Link>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                “Tứ hành xung” thực chất là gì
              </h3>
              <p>
                Trên vòng 12 còn vẽ được <strong>hình vuông</strong>: bốn chi cách nhau đều{' '}
                <strong>12 ÷ 4 = 3 bước</strong>. Có đúng ba hình vuông như vậy, và đây chính là ba
                nhóm mà dân gian quen gọi là <strong>“tứ hành xung”</strong>:
              </p>
              <DataTable
                minW="min-w-[560px]"
                headers={[
                  'Nhóm bốn con giáp',
                  'Số thứ tự',
                  'Hai đường chéo (là lục xung)',
                  'Bốn cạnh kề là quan hệ gì',
                ]}
                rows={SQUARE_ROWS}
              />
              <p>
                Đây là chỗ cụm từ “tứ hành xung” gây hiểu nhầm nhiều nhất. Một hình vuông chứa{' '}
                <strong>hai cặp lục xung</strong> — đúng hai đường chéo của nó. Còn hai chi{' '}
                <strong>đứng cạnh nhau</strong> chỉ cách nhau 3 bước, và theo bảng tra chúng{' '}
                <strong>không bao giờ là lục xung</strong>. Ở hai hình vuông đầu, bốn cạnh đều là{' '}
                <em>bình hoà</em> — Tý với Mão chẳng hạn, không xung gì cả.
              </p>
              <p>
                Riêng hình vuông <strong>Dần – Tỵ – Thân – Hợi</strong> thì bốn cạnh lại rơi trúng
                hai họ quan hệ kia: Tỵ – Thân và Hợi – Dần là <em>lục hợp</em>, còn Dần – Tỵ và Thân
                – Hợi là <em>lục hại</em> — vì bốn chi này mang số thứ tự 3, 6, 9, 12 nên hai chi kề
                nhau luôn cộng thành 9, 15 hoặc 21, đúng những con số của hai trục gương ở phần sau.
                Nhưng vẫn <strong>không cạnh nào là xung</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Đúng phạm vi: công cụ tương hợp của hieu.asia{' '}
                <strong>không có nhãn “tứ hành xung”</strong> — nó chỉ phân loại từng cặp, trong đó
                chỉ có sáu cặp lục xung. “Tứ hành xung” là cách gọi dân gian gộp hai cặp xung chung
                một hình vuông thành nhóm bốn, và các nguồn dùng cụm này khá lỏng; khi tra một trường
                hợp cụ thể hãy dựa vào <strong>cặp</strong>. Nhớ gọn cả hai cách chia: tam hợp gom 12
                chi thành <strong>4 nhóm ba</strong>, tứ hành xung gom thành <strong>3 nhóm bốn</strong>{' '}
                — cùng làm được chỉ vì <strong>12 = 4 × 3 = 3 × 4</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'luc-xung-luc-hop-luc-hai',
          tocLabel: 'Xung · Hợp · Hại',
          heading: 'Lục xung, lục hợp, lục hại: một đường kính và hai nếp gấp',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Lục xung — sáu cặp đối đỉnh (cộng 6)
              </h3>
              <p>
                12 chia đôi là 6, nên mỗi chi có <strong>đúng một</strong> chi đối diện qua tâm vòng
                tròn. Ghép đôi hết 12 chi thì được <strong>{XUNG_PAIRS.length} cặp</strong> — chính
                là chữ “lục” trong lục xung. Quy tắc: số thứ tự <strong>cộng 6</strong>, quá 12 thì
                trừ 12.
              </p>
              <DataTable
                minW="min-w-[420px]"
                headers={['Cặp lục xung', 'Số thứ tự', 'Khoảng cách']}
                rows={pairRows(
                  XUNG_PAIRS,
                  (p) => `${ord(p.a)} + 6 = ${ord(p.b)}`,
                  (p) => `${p.step} bước`,
                )}
              />

              <h3 className="text-lg font-semibold text-foreground">
                Lục hợp — nếp gấp qua khe Tý | Sửu
              </h3>
              <p>
                Bây giờ đừng xoay nữa mà hãy <strong>gấp đôi</strong> vòng tròn theo nếp đi qua khe
                giữa Tý và Sửu, xuyên sang khe giữa Ngọ và Mùi: hai chi nào chồng lên nhau thành một
                cặp lục hợp. Mẹo kiểm: <strong>cộng hai số thứ tự</strong> luôn ra 3 hoặc 15.
              </p>
              <DataTable
                minW="min-w-[420px]"
                headers={['Cặp lục hợp', 'Số thứ tự', 'Tổng']}
                rows={pairRows(
                  HOP_PAIRS,
                  (p) => `${ord(p.a)} + ${ord(p.b)}`,
                  (p) => String(p.sum),
                )}
              />

              <h3 className="text-lg font-semibold text-foreground">
                Lục hại — nếp gấp qua khe Mão | Thìn
              </h3>
              <p>
                Vẫn phép gấp đôi, chỉ đổi nếp: lần này nếp gấp đi qua khe giữa Mão và Thìn, xuyên
                sang khe giữa Dậu và Tuất. Mẹo kiểm tương tự, khác con số:{' '}
                <strong>tổng hai số thứ tự</strong> luôn là 9 hoặc 21.
              </p>
              <DataTable
                minW="min-w-[420px]"
                headers={['Cặp lục hại', 'Số thứ tự', 'Tổng']}
                rows={pairRows(
                  HAI_PAIRS,
                  (p) => `${ord(p.a)} + ${ord(p.b)}`,
                  (p) => String(p.sum),
                )}
              />
              <p>
                Hai nếp gấp ấy <strong>lệch nhau đúng 3 bước</strong>, tức 90 độ. Mà soi gương hai
                lần qua hai trục lệch 90 độ thì bằng quay nửa vòng — chính là lục xung; nhìn hai bảng
                cũng thấy ngay tổng của cặp hại hơn tổng của cặp hợp đúng 6 đơn vị. Từ đó ra công
                thức mà bảng tra không nói:{' '}
                <strong>lục hại của một chi = chi xung với lục hợp của chi đó</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Hai ví dụ tra tay</h3>
              <p>
                Lấy giấy bút làm lại hai ví dụ dưới đây rồi mở{' '}
                <Link href="/tuong-hop-12-con-giap" className={linkCls}>bản đồ tương hợp</Link> để
                đối chiếu — cả bốn kết quả mỗi lần đều phải khớp.
              </p>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong>Tuổi Mão (số 4).</strong> Lục xung: 4 + 6 = 10 → <strong>Dậu</strong>. Tam
                  hợp: 4 + 4 = 8 → Mùi, và 4 + 8 = 12 → Hợi, tức nhóm{' '}
                  <strong>Hợi – Mão – Mùi</strong>. Lục hợp: tổng phải là 15, mà 15 − 4 = 11 →{' '}
                  <strong>Tuất</strong>. Lục hại: tổng phải là 9, mà 9 − 4 = 5 → <strong>Thìn</strong>
                  . Kiểm lại bằng công thức dẫn xuất: Mão hợp Tuất, Tuất xung Thìn — khớp.
                </li>
                <li>
                  <strong>Tuổi Thân (số 9).</strong> Lục xung: 9 + 6 = 15, trừ 12 còn 3 →{' '}
                  <strong>Dần</strong>. Tam hợp: 9 + 4 = 13 → 1 là Tý, và 9 + 8 = 17 → 5 là Thìn, tức
                  nhóm <strong>Thân – Tý – Thìn</strong>. Lục hợp: 15 − 9 = 6 → <strong>Tỵ</strong>.
                  Lục hại: 21 − 9 = 12 → <strong>Hợi</strong>. Kiểm lại: Thân hợp Tỵ, Tỵ xung Hợi —
                  khớp.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Cuối cùng, một con số để giữ mọi thứ đúng tỉ lệ. Với 11 con giáp còn lại, mỗi con
                giáp luôn có đúng <strong>{PER_CHI}</strong>. Con số này giống hệt nhau ở cả 12 con
                giáp — vì vòng tròn đối xứng hoàn toàn, không con giáp nào “thiệt” hơn con nào.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: một hệ đối xứng đẹp, nhưng vẫn là quy ước',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần hình học ở trên là thật và kiểm được: bạn có thể vẽ vòng tròn 12 điểm, đo, đếm,
                và mọi phát biểu đều đúng. Nhưng cần tách bạch hai tầng khác nhau:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tầng cấu trúc</strong> — tam giác đều, đường kính, hình vuông, hai trục
                  gương. Tầng này là <strong>toán học</strong>, không có gì để tranh cãi.
                </li>
                <li>
                  <strong>Tầng ý nghĩa</strong> — vì sao tam giác lại được gọi là “hợp”, vì sao đường
                  kính lại được gọi là “xung”, vì sao trục gương của lục hợp đặt ở khe Tý | Sửu chứ
                  không phải khe khác. Tầng này là <strong>quy ước văn hoá</strong> được truyền lại,
                  và <strong>các bản truyền lại không ghi lý do gốc</strong>.
                </li>
              </ul>
              <p>
                Sự chặt chẽ của tầng một <strong>không</strong> chứng minh cho tầng hai — như luật cờ
                vua: nhất quán tuyệt đối, nhưng không nói gì về thế giới ngoài bàn cờ. Vài giới hạn:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Hệ này chỉ dùng <strong>năm sinh</strong>, nên nó chia toàn bộ loài người vào vỏn
                  vẹn 12 nhóm. Một phép chia như thế không biết gì về hai con người cụ thể.
                </li>
                <li>
                  Hai người “lục xung” <strong>vẫn sống tốt với nhau</strong>. Rất nhiều cặp thuộc
                  nhóm này gắn bó bền lâu, vì khác biệt đúng cách lại thành bổ sung.
                </li>
                <li>
                  <strong>Đừng dùng bảng này để từ chối một mối quan hệ.</strong> Không có gì trong
                  hình học của một vòng tròn cho phép làm điều đó. Nếu đang cân nhắc một quyết định
                  thật, hãy đọc <Link href="/learn/hop-tuoi" className={linkCls}>bài Hợp tuổi</Link>{' '}
                  để thấy toàn cảnh — phần quyết định nằm ở cách hai người đối xử với nhau.
                </li>
                <li>
                  Còn một chi tiết kỹ thuật dễ sai trước cả khi bàn tới quan hệ: con giáp tính theo{' '}
                  <strong>năm âm lịch</strong> (đổi vào Tết), nên người sinh tháng 1 hoặc đầu tháng 2
                  dương lịch có thể vẫn thuộc con giáp của năm liền trước. Xác định nhầm địa chi thì
                  mọi phép đếm bước ở trên đều lệch.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Cách dùng lành mạnh nhất rất khiêm tốn: xem đây như một{' '}
                <strong>bài tập hình học đẹp</strong> giúp bạn nhớ một phần di sản văn hoá, và giúp
                bạn phát hiện những bảng tra chép sai trôi nổi trên mạng.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <TamHopWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <TamHopRecall />,
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
                Bài này chỉ nói về cấu trúc. Muốn biết ý nghĩa từng quan hệ khi xét một cặp cụ thể,
                đọc <Link href="/learn/hop-tuoi" className={linkCls}>Hợp tuổi (12 con giáp)</Link>;
                muốn biết tính cách từng con giáp, đọc{' '}
                <Link href="/learn/con-giap" className={linkCls}>12 con giáp</Link>. Còn muốn kiểm
                ngay phần hình học vừa học trên đủ {ALL_PAIRS} cặp,{' '}
                <Link href="/tuong-hop-12-con-giap" className={linkCls}>
                  mở bản đồ tương hợp 12 con giáp →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/tuong-hop-12-con-giap', label: 'Bản đồ tương hợp 12 con giáp' },
                    { href: '/hop-tuoi', label: 'Xem hợp tuổi' },
                    { href: '/xem-hop-nhom', label: 'Xem hợp nhóm / gia đình' },
                    { href: '/xong-dat', label: 'Chọn tuổi xông đất theo tam hợp' },
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
          children: <TamHopChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
