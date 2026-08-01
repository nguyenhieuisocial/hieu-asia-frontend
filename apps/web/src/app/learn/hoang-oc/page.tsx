/**
 * /learn/hoang-oc — bài học nền tảng về Hoang Ốc (vòng 6 cung xem tuổi làm nhà).
 *
 * GROUNDING (mọi con số, tên cung và lời chú giải đều lấy từ đây, KHÔNG bịa):
 *   • src/lib/xem-tuoi-lam-nha.ts
 *       – HOANG_OC_BY_STEP: 6 cung theo đúng thứ tự 1→6 (Nhất Cát, Nhì Nghi,
 *         Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc), cờ good và lời
 *         chú giải — bảng CUNG_TABLE bên dưới CHÉP ĐÚNG từ đó, không sửa chữ.
 *       – checkHoangOc(): tuổi mụ = năm khởi công − năm sinh + 1; bước =
 *         tuổi mụ % 6, dư 0 tính là 6. Các ví dụ tính tay bên dưới GỌI THẲNG
 *         hàm này nên số liệu không thể lệch khỏi engine.
 *       – checkBuildYear(): xét tuổi người đứng ra khởi công; phạm bất kỳ hạn
 *         nào trong Kim Lâu / Hoang Ốc / Tam Tai là "không được tuổi"; lục
 *         xung chỉ là điểm trừ ("cần cân nhắc").
 *   • src/app/xem-tuoi-lam-nha/{page.tsx, years.ts, [tuoi]/page.tsx} và
 *     src/components/xem-tuoi-lam-nha/XemTuoiLamNhaChecker.tsx — tục mượn tuổi
 *     (nam giới, người thân/quen, thường lớn tuổi hơn gia chủ, năm đó không
 *     phạm cả ba hạn; giấy bán nhà tượng trưng rồi chuộc lại khi hoàn thành),
 *     lưu ý tuổi mụ theo năm âm lịch (sinh tháng 1–2 trước Tết thì lùi 1 năm),
 *     và giọng "không doạ, không bán lễ giải hạn".
 *
 * Phạm vi: Kim Lâu, Tam Tai và hướng nhà (Bát Trạch) chỉ được NHẮC TÊN + link
 * sang trang riêng — bài này không giải thích cách tính của chúng.
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
import { checkHoangOc } from '@/lib/xem-tuoi-lam-nha';
import {
  HoangOcFrame,
  HoangOcDepth,
  HoangOcRecall,
  HoangOcChecklist,
  HoangOcWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Hoang Ốc là gì — 6 cung xem tuổi làm nhà',
  description:
    'Hoang Ốc: vòng 6 cung tra từ tuổi mụ khi làm nhà — Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc, và tục mượn tuổi.',
  alternates: { canonical: 'https://hieu.asia/learn/hoang-oc' },
};

// Bảng 6 cung: CHÉP ĐÚNG từ HOANG_OC_BY_STEP trong lib/xem-tuoi-lam-nha.ts —
// tên cung, cờ tốt/xấu và lời chú giải giữ nguyên từng chữ. Ba cung xấu dùng
// CHUNG một dòng chú giải trong nguồn; giữ nguyên (không tự "làm phong phú"),
// và nói rõ điều đó cho người đọc ngay dưới bảng.
const CUNG_TABLE: { step: number; cung: string; good: boolean; note: string }[] = [
  { step: 1, cung: 'Nhất Cát', good: true, note: 'cung tốt — khởi công được coi là thuận' },
  { step: 2, cung: 'Nhì Nghi', good: true, note: 'cung tốt — chủ về thuận lợi, có lộc' },
  { step: 3, cung: 'Tam Địa Sát', good: false, note: 'cung xấu — dân gian kiêng khởi công năm này' },
  { step: 4, cung: 'Tứ Tấn Tài', good: true, note: 'cung tốt — chủ về tài lộc vào nhà' },
  { step: 5, cung: 'Ngũ Thọ Tử', good: false, note: 'cung xấu — dân gian kiêng khởi công năm này' },
  { step: 6, cung: 'Lục Hoang Ốc', good: false, note: 'cung xấu — dân gian kiêng khởi công năm này' },
];

/**
 * Các tuổi mụ trong dải làm nhà phổ biến (25–60) rơi vào một bước — dùng ĐÚNG
 * phép tính của engine (`tuổi mụ % 6 || 6`) nên không thể lệch với công cụ.
 */
function agesForStep(step: number): number[] {
  return Array.from({ length: 36 }, (_, i) => 25 + i).filter((age) => (age % 6 || 6) === step);
}

// Ví dụ tính tay: GỌI THẲNG engine (checkHoangOc) thay vì gõ số bằng tay, để
// phần chữ không bao giờ lệch khỏi công cụ. Năm khởi công lấy mốc cố định 2026
// vì đây là ví dụ minh hoạ, không phải kết quả tra cứu theo năm hiện tại.
const EXAMPLE_TARGET_YEAR = 2026;
const EXAMPLES = [1985, 1993, 1990].map((birthYear) => ({
  birthYear,
  ...checkHoangOc(birthYear, EXAMPLE_TARGET_YEAR),
}));

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Hoang Ốc là gì?',
    a: 'Hoang Ốc là một vòng 6 cung mà dân gian dùng riêng cho việc làm nhà: lấy tuổi mụ của người đứng ra khởi công đếm trên vòng, dừng ở cung nào thì đọc cung đó. Sáu cung theo thứ tự là Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc. Đây là tập tục để tham khảo khi chọn NĂM khởi công, không phải lời phán về ngôi nhà hay số phận gia chủ.',
  },
  {
    q: 'Cách tính Hoang Ốc như thế nào?',
    a: 'Ba bước: (1) tính tuổi mụ = năm khởi công − năm sinh + 1; (2) lấy tuổi mụ chia 6 và giữ phần dư, trong đó dư 0 được tính là bước 6; (3) đọc tên cung ứng với bước đó. Ví dụ tuổi mụ 34 chia 6 dư 4 → cung Tứ Tấn Tài; tuổi mụ 42 chia 6 dư 0 → tính là bước 6 → cung Lục Hoang Ốc. Vì vòng có 6 cung nên cung Hoang Ốc của một người lặp lại đúng 6 năm một lần.',
  },
  {
    q: 'Cung nào tốt, cung nào xấu trong 6 cung Hoang Ốc?',
    a: 'Ba cung được coi là tốt để khởi công: Nhất Cát (bước 1), Nhì Nghi (bước 2) và Tứ Tấn Tài (bước 4). Ba cung dân gian kiêng khởi công: Tam Địa Sát (bước 3), Ngũ Thọ Tử (bước 5) và Lục Hoang Ốc (bước 6). Bảng tra chỉ ghi ba cung xấu là "dân gian kiêng khởi công năm này" — tục dừng ở mức kiêng, không xếp cung nào nặng hơn cung nào.',
  },
  {
    q: 'Hoang Ốc xét tuổi của ai trong nhà?',
    a: 'Theo tục phổ biến, xét tuổi mụ của người đứng ra khởi công — thường là trụ cột gia đình đứng tên nhà. Vợ chồng cùng làm thì nhiều nhà chỉ xét tuổi một người đứng chính. Đây cũng chính là chỗ mở ra tục mượn tuổi: đổi người đứng ra khởi công thì con số đem chia 6 đổi theo, nên cung tra ra cũng đổi.',
  },
  {
    q: 'Mượn tuổi làm nhà là gì và ai mượn được?',
    a: 'Mượn tuổi là nhờ một người khác đứng ra khởi công thay khi gia chủ rơi cung xấu. Theo tục, người được mượn thường là nam giới, người thân hoặc người quen, lớn tuổi hơn gia chủ; điều kiện quan trọng nhất là năm khởi công đó bản thân người ấy không phạm cả ba hạn thường xét khi làm nhà (Kim Lâu, Hoang Ốc, Tam Tai) thì việc mượn tuổi mới được coi là trọn vẹn.',
  },
  {
    q: 'Các bước mượn tuổi theo phong tục gồm những gì?',
    a: 'Thường gồm: chọn người đứng thay đủ điều kiện; kiểm tra năm khởi công người ấy không phạm ba hạn; gia chủ làm giấy bán nhà tượng trưng cho người đứng thay; người đó đứng ra động thổ và khởi công; khi nhà hoàn thành thì gia chủ chuộc lại. Toàn bộ là nghi thức tượng trưng giữa hai bên, không phải giao dịch mua bán thật.',
  },
  {
    q: 'Mượn tuổi có thật sự "hoá giải" được không?',
    a: 'Trong chính hệ quy tắc này thì có, vì hạn xét theo tuổi người đứng ra khởi công — đổi người là đổi kết quả. Nhưng nói thẳng: đó là một nghi thức tâm lý – xã hội, không phải phép thuật. Giấy tượng trưng không thay đổi nền móng, ngân sách, giấy phép hay mùa mưa. Cái nó thay đổi thật là sự yên tâm và đồng thuận giữa những người lớn trong nhà trước một việc lớn — điều đó cũng có giá trị, nhưng nên gọi đúng tên.',
  },
  {
    q: 'Phạm Hoang Ốc thì bắt buộc phải hoãn xây nhà à?',
    a: 'Không. Hoang Ốc là tập tục dân gian để tham khảo, không phải quy luật khoa học và cũng không phải lệnh cấm. Ba cung xấu trên sáu cung nghĩa là một nửa số năm của bất kỳ ai cũng rơi vào nhóm kiêng, nên "phạm" là chuyện rất thường. Nếu gia đình muốn giữ tục thì có thể đợi năm khác hoặc mượn tuổi; còn quyết định nên dựa trên tài chính, giấy phép và mùa thi công — những thứ ảnh hưởng thật đến ngôi nhà. hieu.asia không doạ và không bán lễ giải hạn.',
  },
  {
    q: 'Hoang Ốc có liên quan gì đến hướng nhà không?',
    a: 'Không. Hoang Ốc chỉ trả lời câu hỏi "NĂM này có nên khởi công không" theo tuổi gia chủ. Chuyện nhà quay về hướng nào thuộc về Bát Trạch — một hệ khác hẳn, có cách tính riêng. Tương tự, chọn NGÀY động thổ trong năm cũng là lớp câu hỏi khác. Đừng dùng kết quả của hệ này để suy ra hệ kia.',
  },
];

const JSONLD = [
  article({
    headline: 'Hoang Ốc: vòng 6 cung xem tuổi làm nhà và tục mượn tuổi',
    description:
      'Hoang Ốc là gì, cách suy ra cung từ tuổi mụ, ý nghĩa 6 cung (Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc) và cơ chế mượn tuổi làm nhà. Phong tục để tham khảo, không phán số mệnh.',
    url: '/learn/hoang-oc',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Hoang Ốc', url: '/learn/hoang-oc' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Hoang Ốc — 6 cung xem tuổi làm nhà',
    description:
      'Hoang Ốc: vòng 6 cung tra từ tuổi mụ khi làm nhà — Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử, Lục Hoang Ốc, và tục mượn tuổi.',
    url: '/learn/hoang-oc',
  }),
];

export default function LearnHoangOcPage() {
  return (
    <LearnArticle
      eyebrow="PHONG TỤC · LÀM NHÀ"
      title={
        <>
          Hoang Ốc{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (vòng 6 cung)
          </span>
        </>
      }
      standfirst={
        <>
          Trước khi động thổ, người lớn trong nhà thường hỏi “năm nay có được tuổi không”. Hoang Ốc là
          một trong những mốc được đem ra tra: một vòng 6 cung, đếm bằng tuổi mụ của người đứng ra
          khởi công. Bài này giải thích con số ấy ở đâu ra, và tục mượn tuổi thực chất là gì.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Hoang Ốc' },
      ]}
      relatedLenses={relatedLearnLenses('hoang-oc')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh gia chủ và năm dự định xây/sửa, hệ thống tính tuổi mụ rồi cho biết bạn rơi cung Hoang Ốc nào — kèm cả Kim Lâu, Tam Tai và ô kiểm tra riêng cho người mượn tuổi.',
        href: '/xem-tuoi-lam-nha',
        label: 'Xem tuổi làm nhà của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <HoangOcFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Hoang Ốc là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Hoang Ốc</strong> là một vòng <strong>6 cung</strong> mà dân gian dùng{' '}
                <strong>riêng cho việc làm nhà</strong>. Cách dùng rất gọn: lấy <strong>tuổi mụ</strong>{' '}
                của người đứng ra khởi công đếm trên vòng, dừng ở cung nào thì đọc cung đó. Sáu cung
                theo đúng thứ tự là Nhất Cát, Nhì Nghi, Tam Địa Sát, Tứ Tấn Tài, Ngũ Thọ Tử và Lục
                Hoang Ốc — ba cung được coi là tốt, ba cung dân gian kiêng khởi công.
              </p>
              <p>
                Chữ “Hoang Ốc” vừa là tên của cả vòng, vừa là tên cung thứ sáu. Đây là chỗ hay gây
                nhầm: nói “phạm Hoang Ốc” là nói rơi vào <em>một trong ba cung xấu</em> của vòng, chứ
                không nhất thiết rơi đúng cung Lục Hoang Ốc.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Hoang Ốc trả lời câu hỏi <strong>“NĂM này có nên khởi công không”</strong> theo tuổi
                  gia chủ — không trả lời “ngày nào đẹp”, càng không trả lời “nhà nên quay hướng nào”.
                </li>
                <li>
                  Nó là <strong>tập tục dân gian</strong> để tham khảo, không phải quy luật khoa học và
                  cũng không phải lời phán rằng ngôi nhà sẽ hỏng hay gia chủ sẽ gặp hoạ.
                </li>
                <li>
                  Nó chỉ dùng <strong>một con số duy nhất</strong> là tuổi mụ. Không giới tính, không
                  ngày – giờ sinh, không biết gì về mảnh đất, bản vẽ hay ngân sách của bạn.
                </li>
              </ul>
              <p>
                Một điều quan trọng để giữ đúng tinh thần: đây không phải công cụ để hù doạ hay để bán
                lễ giải hạn. hieu.asia trình bày <strong>cách tính minh bạch</strong> để bạn hiểu vì sao
                có kết luận đó rồi tự quyết định — <strong>không doạ, không bán “giải hạn”</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <HoangOcDepth />,
        },
        {
          id: 'cach-tinh',
          tocLabel: 'Cách suy ra cung',
          heading: 'Cách suy ra cung Hoang Ốc từ tuổi mụ, từng bước',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Bước 1 — Xác định xem tuổi của ai
              </h3>
              <p>
                Theo tục phổ biến, Hoang Ốc xét tuổi của{' '}
                <strong>người đứng ra khởi công</strong> — thường là trụ cột gia đình đứng tên nhà. Vợ
                chồng cùng làm thì nhiều nhà chỉ xét tuổi một người đứng chính. Bước này nghe hiển
                nhiên nhưng lại là bản lề của cả bài: đổi người đứng ra khởi công là đổi luôn kết quả,
                và đó chính là gốc của tục mượn tuổi ở phần sau.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Bước 2 — Tính tuổi mụ</h3>
              <p>
                Hoang Ốc tính theo <strong>tuổi mụ</strong> (tuổi âm), không phải tuổi dương. Công thức:{' '}
                <strong>tuổi mụ = năm khởi công − năm sinh + 1</strong>. Ví dụ người sinh 1990 khởi công
                năm 2026 có tuổi mụ 37.
              </p>
              <p className="rounded-xl border border-border bg-card/40 p-4 text-sm">
                <strong className="text-foreground">Chỗ hay nhầm nhất:</strong> tuổi mụ đếm theo{' '}
                <strong>năm âm lịch</strong>. Nếu bạn sinh vào tháng 1–2 dương lịch <em>trước Tết</em>,
                năm âm của bạn là năm liền trước — hãy lùi năm sinh đi 1 khi tính. Lệch một tuổi là lệch
                sang cung khác ngay.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Chia 6, giữ phần dư (dư 0 tính là 6)
              </h3>
              <p>
                Vì vòng có đúng 6 cung, thay vì đếm từng ô người ta lấy{' '}
                <strong>tuổi mụ chia 6 và giữ phần dư</strong>. Dư 1 là bước 1, dư 2 là bước 2… riêng{' '}
                <strong>dư 0 được tính là bước 6</strong>, vì đếm trọn một vòng thì dừng ở ô cuối chứ
                không có ô số 0.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 4 — Đọc tên cung và kết luận tốt / xấu
              </h3>
              <p>
                Bước 1, 2, 4 là ba cung được coi là tốt; bước 3, 5, 6 là ba cung dân gian kiêng khởi
                công. Bảng đầy đủ nằm ở mục tiếp theo.
              </p>
              <p className="text-sm text-foreground/70">
                Vì phép chia là cho 6, cung Hoang Ốc của một người{' '}
                <strong>lặp lại đúng 6 năm một lần</strong>. Bạn không cần thuộc bảng: công cụ tự tính
                khi bạn nhập năm sinh và năm dự định làm. Phần này chỉ để bạn biết con số ở đâu ra, thay
                vì nhận một kết quả “hộp đen”.
              </p>
            </div>
          ),
        },
        {
          id: 'sau-cung-hoang-oc',
          tocLabel: '6 cung Hoang Ốc',
          heading: '6 cung Hoang Ốc — cung nào tốt, cung nào kiêng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là bảng đầy đủ mà công cụ dùng để tra. Cột “bước” chính là kết quả của phép{' '}
                <strong>tuổi mụ chia 6</strong> (dư 0 tính là 6), cột “ý nghĩa dân gian” là lời chú giải
                đi kèm từng cung.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Bước (tuổi mụ ÷ 6)
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Tên cung
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Tốt / xấu
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Ý nghĩa dân gian
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CUNG_TABLE.map((row) => (
                      <tr key={row.step} className="border-b border-border/60 last:border-b-0">
                        <td className="px-4 py-2 text-muted-foreground">
                          {row.step === 6 ? '6 (dư 0)' : row.step}
                        </td>
                        <td className="px-4 py-2 font-medium text-foreground">{row.cung}</td>
                        <td className="px-4 py-2">
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={`h-2 w-2 rounded-full ${
                                row.good ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span
                              className={
                                row.good
                                  ? 'text-emerald-700 dark:text-emerald-300'
                                  : 'text-rose-700 dark:text-rose-300'
                              }
                            >
                              {row.good ? 'Tốt' : 'Kiêng'}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Lưu ý một chi tiết trung thực: <strong>ba cung xấu dùng chung đúng một dòng chú giải</strong>{' '}
                — “dân gian kiêng khởi công năm này”. Tục dừng ở mức kiêng, không xếp cung nào nặng hơn
                cung nào và cũng không nói điều gì sẽ xảy ra nếu vẫn làm. Tên cung nghe rất mạnh (“Địa
                Sát”, “Thọ Tử”) nhưng sức nặng nằm ở cái tên, không nằm ở nội dung tra cứu.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Tuổi mụ nào rơi vào cung nào
              </h3>
              <p>
                Trong dải tuổi làm nhà phổ biến (tuổi mụ 25–60), các tuổi rơi vào từng cung như sau —
                cùng đúng phép tính của công cụ:
              </p>
              <dl className="grid gap-2 sm:grid-cols-2">
                {CUNG_TABLE.map((row) => (
                  <div
                    key={row.step}
                    className="rounded-xl border border-border bg-card/40 px-4 py-3"
                  >
                    <dt className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${row.good ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      />
                      {row.cung}
                    </dt>
                    <dd className="mt-1 font-mono text-[13px] text-muted-foreground">
                      {agesForStep(row.step).join(' · ')}
                    </dd>
                  </div>
                ))}
              </dl>

              <h3 className="text-lg font-semibold text-foreground">Ví dụ tính tay</h3>
              <p>
                Ba trường hợp cụ thể, lấy năm khởi công giả định là {EXAMPLE_TARGET_YEAR}:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {EXAMPLES.map((ex) => (
                  <li key={ex.birthYear}>
                    <strong>
                      Gia chủ sinh {ex.birthYear}, khởi công {EXAMPLE_TARGET_YEAR}:
                    </strong>{' '}
                    tuổi mụ = {EXAMPLE_TARGET_YEAR} − {ex.birthYear} + 1 = {ex.ageMu}. Lấy {ex.ageMu}{' '}
                    chia 6 dư {ex.ageMu % 6}
                    {ex.ageMu % 6 === 0 ? ' → tính là bước 6' : ` → bước ${ex.step}`} → cung{' '}
                    <strong>{ex.cung}</strong>, {ex.note} →{' '}
                    {ex.isPham ? 'phạm Hoang Ốc' : 'không phạm Hoang Ốc'}.
                  </li>
                ))}
              </ul>
              <p className="text-sm text-foreground/70">
                Ba ví dụ trên được tính bằng chính hàm mà công cụ dùng, nên nếu bạn tra tay ra kết quả
                khác thì gần như chắc chắn lệch ở bước tính tuổi mụ — kiểm tra lại xem bạn có sinh trước
                Tết hay không trước đã.
              </p>
            </div>
          ),
        },
        {
          id: 'muon-tuoi-lam-nha',
          tocLabel: 'Mượn tuổi làm nhà',
          heading: 'Mượn tuổi làm nhà: mượn thế nào, ai mượn được',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Khi gia chủ rơi cung xấu mà nhà vẫn cần xây, dân gian có tục{' '}
                <strong>“mượn tuổi”</strong>: nhờ một người khác đứng ra khởi công thay. Đây là phần
                được hỏi nhiều nhất, và cũng là phần dễ bị thần bí hoá nhất — nên hãy xem nó vận hành
                đúng như thế nào.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Vì sao mượn tuổi lại “ăn khớp”</h3>
              <p>
                Nhớ lại Bước 1 của phần cách tính: hạn được xét theo tuổi mụ của{' '}
                <strong>người đứng ra khởi công</strong>. Đổi người đứng ra khởi công là đổi luôn con số
                đem chia 6 — nên cung tra ra đổi theo. Mượn tuổi vì thế không phải một phép thuật được
                thêm vào, mà là <strong>hệ quả logic của chính quy tắc</strong>. Người xưa đọc kỹ luật
                chơi và dùng đúng cái cửa mà luật chơi để ngỏ.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Điều kiện của người được mượn</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Thường là <strong>nam giới</strong>, là <strong>người thân hoặc người quen</strong>{' '}
                  của gia đình.
                </li>
                <li>
                  Thường <strong>lớn tuổi hơn gia chủ</strong>.
                </li>
                <li>
                  Quan trọng nhất: <strong>năm khởi công đó bản thân người ấy không phạm cả ba hạn</strong>{' '}
                  thường xét khi làm nhà — Kim Lâu, Hoang Ốc và Tam Tai. Mượn một người cũng đang phạm
                  hạn thì theo tục việc mượn không được coi là trọn vẹn.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Công cụ xem tuổi làm nhà có sẵn một ô riêng “năm sinh người mượn tuổi” để bạn kiểm tra
                cả ba hạn của người ấy trong cùng một lần tra, thay vì phải tính hai lần.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Các bước theo phong tục</h3>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Chọn người đứng thay</strong> đủ các điều kiện ở trên, và hỏi ý kiến người đó
                  trước — đây là việc nhờ vả, không phải thủ tục hành chính.
                </li>
                <li>
                  <strong>Kiểm tra tuổi người đó</strong> cho đúng năm dự định khởi công: không phạm Kim
                  Lâu, không phạm Hoang Ốc, không phạm Tam Tai.
                </li>
                <li>
                  <strong>Làm giấy bán nhà tượng trưng</strong>: gia chủ “bán” ngôi nhà sắp xây cho
                  người đứng thay. Tượng trưng — không phải giao dịch mua bán thật.
                </li>
                <li>
                  <strong>Người đứng thay làm lễ động thổ và khởi công</strong> thay gia chủ.
                </li>
                <li>
                  <strong>Chuộc lại khi hoàn thành</strong>: nhà xong thì gia chủ chuộc lại, khép vòng
                  nghi thức.
                </li>
              </ol>

              <h3 className="text-lg font-semibold text-foreground">
                Nói thẳng: đây là nghi thức tâm lý – xã hội
              </h3>
              <p>
                Cần gọi đúng tên: mượn tuổi <strong>không phải phép thuật</strong>. Tờ giấy tượng trưng
                không làm nền móng chắc hơn, không rút ngắn thời gian xin phép, không dời được mùa mưa
                và không hạ được giá thép. Không có bước nào trong nghi thức chạm tới những thứ thật sự
                quyết định ngôi nhà.
              </p>
              <p>
                Cái nó thay đổi thật là <strong>trạng thái tinh thần và sự đồng thuận trong nhà</strong>
                : người lớn tuổi yên tâm, gia đình bớt căng thẳng, mọi người cùng bước vào một việc lớn
                và tốn kém với tâm thế nhẹ hơn. Đó là giá trị có thật của một nghi thức — và cũng là lý
                do một hệ quy tắc mà chính nó cho phép “gỡ” bằng cách đổi người đứng tên thì rõ ràng nó
                là <strong>tục lệ xã hội</strong>, không phải quy luật tự nhiên.
              </p>
              <p className="text-sm text-foreground/70">
                Vì vậy: nếu gia đình muốn giữ tục, mượn tuổi là một cách làm được và không tốn kém gì
                ngoài lời nhờ vả. Nhưng đừng để nó thay thế việc chuẩn bị thật — hợp đồng rõ ràng, giám
                sát thi công, dự phòng chi phí. hieu.asia không bán lễ giải hạn, và cũng không cho rằng
                phải “giải” mới yên.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn của Hoang Ốc — và cách nghĩ tỉnh táo',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Hoang Ốc chỉ dựa trên <strong>một con số</strong>: tuổi mụ của người đứng ra khởi công.
                Nghĩa là mỗi năm, nó chia toàn bộ gia chủ trên đời thành đúng <strong>6 nhóm</strong>.
                Người xây nhà ba tầng trên phố và người sửa lại cái bếp ở quê, nếu sinh cùng năm, sẽ nhận
                cùng một kết luận. Nó không biết gì về nền đất, bản vẽ, ngân sách, giấy phép hay mùa mưa
                của bạn — mà đó mới là những thứ quyết định ngôi nhà bền hay hỏng, đắt hay rẻ.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Ba hạn chồng lên nhau — nên gần như năm nào cũng “phạm” gì đó
              </h3>
              <p>
                Khi chọn năm khởi công, dân gian thường xét ba hạn cùng lúc. Thử đếm phạm vi kiêng của
                từng hạn:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hoang Ốc</strong> kiêng 3 trong 6 cung →{' '}
                  <strong>một nửa số năm</strong> của bất kỳ ai cũng rơi vào nhóm kiêng.
                </li>
                <li>
                  <strong>Kim Lâu</strong> kiêng 4 trong 9 số dư → khoảng{' '}
                  <strong>4 năm trong mỗi 9 năm</strong>. Cách tính riêng, xem tại{' '}
                  <Link href="/kim-lau" className="text-gold-700 underline-offset-4 hover:underline">
                    tra cứu Kim Lâu
                  </Link>
                  .
                </li>
                <li>
                  <strong>Tam Tai</strong> kiêng 3 năm liên tiếp trong mỗi 12 năm →{' '}
                  <strong>1 trong 4 năm</strong>. Cách tính riêng, xem tại{' '}
                  <Link href="/tam-tai" className="text-gold-700 underline-offset-4 hover:underline">
                    tra cứu Tam Tai
                  </Link>
                  .
                </li>
              </ul>
              <p>
                Ba lớp lưới chồng lên nhau, và chỉ cần dính một lớp là đã “không được tuổi”. Kết quả:
                với phần lớn năm sinh, số năm <strong>sạch cả ba hạn</strong> chỉ còn khoảng{' '}
                <strong>một phần tư</strong>. Nói cách khác, gần như năm nào bạn cũng sẽ thấy mình phạm
                một cái gì đó — không phải vì tuổi bạn xấu, mà vì bộ lưới vốn dày như vậy.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Cách nghĩ tỉnh táo</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Một quy tắc gạch đi ba phần tư số năm thì bản thân chữ “phạm”{' '}
                  <strong>mất phần lớn sức phân biệt</strong>. Nó gần với “mặc định” hơn là với một cảnh
                  báo đặc biệt dành riêng cho bạn.
                </li>
                <li>
                  Hãy đọc Hoang Ốc như <strong>mốc dừng để cân nhắc</strong>, không phải lệnh cấm. Rơi
                  cung kiêng thì hỏi tiếp những câu quan trọng hơn: tiền đã đủ chưa, giấy phép xong chưa,
                  có tránh được mùa mưa không, nhà thầu có đáng tin không.
                </li>
                <li>
                  <strong>Cân cái mất thật.</strong> Đợi thêm ba năm cho “được tuổi” trong khi mái đang
                  dột, giá vật liệu tăng và lãi vay chạy — đó là thiệt hại chắc chắn, đổi lấy một yên tâm
                  không kiểm chứng được. Nếu gia đình vẫn muốn giữ tục thì đã có tục mượn tuổi ở phần
                  trên.
                </li>
                <li>
                  Đừng cộng dồn nỗi lo giữa các hệ khác nhau. Hoang Ốc không nói gì về{' '}
                  <strong>ngày</strong> động thổ, và cũng không nói gì về{' '}
                  <strong>hướng nhà</strong> — hướng nhà thuộc Bát Trạch, xem tại{' '}
                  <Link href="/huong-nha" className="text-gold-700 underline-offset-4 hover:underline">
                    xem hướng nhà
                  </Link>
                  .
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Tinh thần chung: Hoang Ốc là một nét văn hoá đáng biết và đáng tôn trọng, nhất là khi nó
                giúp cả nhà ngồi lại với nhau trước một việc lớn. Nhưng nó là{' '}
                <strong>phong tục để tham khảo</strong>, không phải phán quyết — và không ai cần trả tiền
                để “giải” một phép chia cho 6.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <HoangOcWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <HoangOcRecall />,
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
                Muốn biết năm bạn định xây rơi cung nào?{' '}
                <Link
                  href="/xem-tuoi-lam-nha"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Xem tuổi làm nhà miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/xem-tuoi-lam-nha', label: 'Xem tuổi làm nhà' },
                    { href: '/kim-lau', label: 'Tra cứu Kim Lâu' },
                    { href: '/tam-tai', label: 'Tra cứu Tam Tai' },
                    { href: '/huong-nha', label: 'Xem hướng nhà' },
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
          children: <HoangOcChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
