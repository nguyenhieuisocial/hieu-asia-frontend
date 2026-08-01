/**
 * Bài học /learn/kim-lau.
 *
 * GROUNDING — mọi quy tắc và con số trên trang này chép/suy trực tiếp từ:
 *   • lib/xem-tuoi-cuoi.ts → checkKimLau(): ageMu = năm xem − năm sinh + 1;
 *     remainder = ageMu % 9; KIM_LAU_BY_REMAINDER = { 1: Kim Lâu Thân, 3: Kim
 *     Lâu Thê, 6: Kim Lâu Tử, 8: Kim Lâu Lục Súc } kèm ghi chú dân gian.
 *   • lib/kim-lau-data.ts → KIM_LAU_TYPES (suy thẳng từ engine) và phamAges()
 *     — trang này IMPORT hai thứ đó thay vì gõ lại số, nên bảng không thể lệch
 *     với công cụ /kim-lau.
 *   • trang công cụ app/kim-lau/page.tsx + components/kim-lau/KimLauFinder.tsx
 *     (theo tục, Kim Lâu xét chủ yếu tuổi mụ của CÔ DÂU; nhập năm sinh dương
 *     lịch 1900–2100; công cụ liệt kê 8 năm kể từ năm hiện tại).
 *
 * Ví dụ tính tay trong bài đều áp đúng công thức trên. KHÔNG giải thích cơ chế
 * Tam Tai / Hoang Ốc / sao hạn Cửu Diệu (mỗi thứ có bài riêng) — chỉ nhắc tên
 * kèm link. Giọng: phong tục để THAM KHẢO, không hù doạ, không bán lễ giải hạn.
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
import { KIM_LAU_TYPES, phamAges } from '@/lib/kim-lau-data';
import {
  KimLauFrame,
  KimLauDepth,
  KimLauRecall,
  KimLauChecklist,
  KimLauWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Kim Lâu — hiểu tục xem tuổi cưới của người Việt',
  description:
    'Kim Lâu là gì: lấy tuổi mụ cô dâu chia 9, dư 1/3/6/8 là phạm. Hiểu 4 loại Kim Lâu, cách tự tính và giới hạn của tục lệ — tham khảo, không hù doạ.',
  alternates: { canonical: 'https://hieu.asia/learn/kim-lau' },
};

// Bảng số dư KHÔNG phạm — suy trực tiếp từ quy tắc trong engine (chỉ 1/3/6/8 có
// mục trong KIM_LAU_BY_REMAINDER, mọi số dư khác trả về "không phạm").
const CLEAR_REMAINDERS = [0, 2, 4, 5, 7];

// Ví dụ tính tay: mỗi dòng áp đúng ageMu = năm cưới − năm sinh + 1 rồi % 9.
const WORKED_EXAMPLES: {
  birthYear: number;
  targetYear: number;
  ageMu: number;
  remainder: number;
  verdict: string;
}[] = [
  {
    birthYear: 1999,
    targetYear: 2026,
    ageMu: 28,
    remainder: 1,
    verdict: 'Phạm — Kim Lâu Thân',
  },
  {
    birthYear: 2000,
    targetYear: 2026,
    ageMu: 27,
    remainder: 0,
    verdict: 'Không phạm',
  },
  {
    birthYear: 1998,
    targetYear: 2027,
    ageMu: 30,
    remainder: 3,
    verdict: 'Phạm — Kim Lâu Thê',
  },
  {
    birthYear: 1995,
    targetYear: 2026,
    ageMu: 32,
    remainder: 5,
    verdict: 'Không phạm',
  },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Kim Lâu là gì?',
    a: 'Kim Lâu là một nét trong phong tục cưới hỏi của người Việt: người ta xét tuổi mụ (tuổi âm) của cô dâu trong năm định cưới. Lấy tuổi mụ chia 9, nếu số dư rơi vào 1, 3, 6 hoặc 8 thì gọi là "phạm Kim Lâu" và dân gian khuyên cân nhắc thêm. Đây là tục lệ để tham khảo, không phải lời phán số mệnh và cũng không phải điều cấm.',
  },
  {
    q: 'Cách tính Kim Lâu từng bước như thế nào?',
    a: 'Ba bước. Bước 1: tính tuổi mụ của cô dâu trong năm định cưới, bằng năm định cưới trừ năm sinh cộng 1. Bước 2: lấy tuổi mụ chia 9 và giữ lại số dư (từ 0 đến 8). Bước 3: nếu số dư là 1, 3, 6 hoặc 8 thì phạm Kim Lâu; các số dư còn lại (0, 2, 4, 5, 7) là không phạm. Ví dụ cô dâu sinh 1999 định cưới năm 2026 có tuổi mụ 28, chia 9 dư 1, tức phạm Kim Lâu Thân.',
  },
  {
    q: '4 loại Kim Lâu Thân, Thê, Tử, Lục Súc khác nhau thế nào?',
    a: 'Bốn tên gọi ứng với bốn số dư: dư 1 là Kim Lâu Thân (kiêng vì lo ảnh hưởng chính bản thân), dư 3 là Kim Lâu Thê (lo ảnh hưởng vợ chồng), dư 6 là Kim Lâu Tử (lo ảnh hưởng đường con cái), dư 8 là Kim Lâu Lục Súc (lo ảnh hưởng tài sản, vật nuôi). Đây là cách dân gian phân loại để tham khảo, không phải dự báo điều sẽ xảy ra, và cả bốn loại đều dẫn tới cùng một lời khuyên là cân nhắc thêm.',
  },
  {
    q: 'Vì sao Kim Lâu chỉ xét tuổi cô dâu mà không xét tuổi chú rể?',
    a: 'Theo tục cưới hỏi truyền thống, Kim Lâu xét chủ yếu tuổi mụ của cô dâu, nên công cụ chỉ hỏi năm sinh cô dâu. Cần nói rõ đây là một nét phong tục, một quy ước văn hoá chứ không phải quy luật tự nhiên; các bản truyền lại không ghi lý do gốc vì sao chỉ xét một phía. Bạn hoàn toàn có thể coi đó là một thông tin tham khảo bên cạnh nhiều yếu tố thực tế khác khi chọn ngày cưới.',
  },
  {
    q: 'Vì sao Kim Lâu lặp lại theo chu kỳ 9 năm?',
    a: 'Vì mỗi năm tuổi mụ tăng đúng 1, nên số dư khi chia 9 chạy vòng từ 0 đến 8 rồi quay lại. Sau đúng 9 năm, số dư trở về giá trị cũ nên kết luận cũng lặp lại, kể cả tên loại Kim Lâu. Hệ quả là trong mỗi 9 năm liên tiếp luôn có đúng 4 năm phạm và 5 năm không phạm, nên năm thuận theo tục lệ không hề hiếm.',
  },
  {
    q: 'Tuổi mụ chia hết cho 9 (27, 36, 45) thì có phạm Kim Lâu không?',
    a: 'Không. Chia hết cho 9 nghĩa là số dư bằng 0, mà 0 không nằm trong nhóm 1, 3, 6, 8 nên không phạm. Đây là chỗ nhầm phổ biến nhất khi tra tay, vì nhiều người quen nghĩ chia hết cho 9 thì chắc chắn dính. Chỗ nhầm thứ hai là dùng tuổi dương thay cho tuổi mụ — chênh một tuổi là lệch nguyên một bậc và kết luận có thể đảo ngược.',
  },
  {
    q: 'Phạm Kim Lâu thì có cưới được không?',
    a: 'Được. Kim Lâu là tục lệ tham khảo, không phải lệnh cấm. Nếu gia đình muốn theo tục thì cách phổ biến và nhẹ nhàng nhất là chọn một năm cô dâu không phạm Kim Lâu, và vì mỗi chu kỳ 9 năm có tới 5 năm không phạm nên năm gần nhất thường chỉ cách một đến hai năm. hieu.asia trình bày cách tính minh bạch để bạn tự quyết, không doạ vận hạn và không bán lễ "giải hạn".',
  },
  {
    q: 'Kim Lâu có phải là toàn bộ việc xem tuổi cưới không?',
    a: 'Không. Kim Lâu chỉ là một yếu tố và là một phép tính rất thô vì chỉ dùng năm sinh cô dâu cùng năm định cưới. Phong tục Việt còn vài cách xem tuổi cưới khác như Tam Tai hay xung năm, mỗi cách có luật tính riêng và không suy ra được từ Kim Lâu. Công cụ Xem tuổi cưới của hieu.asia xét cả ba cùng lúc và nói rõ từng bước.',
  },
];

const JSONLD = [
  article({
    headline: 'Kim Lâu: hiểu tục xem tuổi cưới của người Việt — nền tảng cho người mới',
    description:
      'Kim Lâu trong phong tục cưới hỏi: tuổi mụ cô dâu chia 9, dư 1/3/6/8 là phạm; 4 loại Thân – Thê – Tử – Lục Súc, chu kỳ 9 năm và giới hạn của tục lệ.',
    url: '/learn/kim-lau',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Kim Lâu', url: '/learn/kim-lau' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Kim Lâu — hiểu tục xem tuổi cưới của người Việt',
    description:
      'Kim Lâu là gì: lấy tuổi mụ cô dâu chia 9, dư 1/3/6/8 là phạm. Hiểu 4 loại Kim Lâu, cách tự tính và giới hạn của tục lệ — tham khảo, không hù doạ.',
    url: '/learn/kim-lau',
  }),
];

export default function LearnKimLauPage() {
  const ages = phamAges(49);

  return (
    <LearnArticle
      eyebrow="PHONG TỤC · CƯỚI HỎI"
      title={
        <>
          Kim Lâu{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (tuổi cưới)
          </span>
        </>
      }
      standfirst={
        <>
          Kim Lâu là câu hỏi quen thuộc mỗi khi hai họ bàn chuyện chọn năm cưới. Đằng sau nó là một
          phép tính gọn đến bất ngờ: lấy tuổi mụ của cô dâu chia 9 rồi xem số dư. Bài này giải thích
          phép tính ấy tới tận gốc — để bạn tự quyết trong hiểu biết, thay vì lo theo lời người khác.
        </>
      }
      readMeta="9 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Kim Lâu' },
      ]}
      relatedLenses={relatedLearnLenses('kim-lau')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh của cô dâu, hệ thống tính tuổi mụ từng năm và cho biết các năm tới năm nào phạm Kim Lâu, năm nào thuận — kèm loại Kim Lâu cụ thể để bạn tham khảo.',
        href: '/kim-lau',
        label: 'Tra Kim Lâu theo năm sinh',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <KimLauFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Kim Lâu là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Kim Lâu</strong> là một nét trong phong tục cưới hỏi của người Việt: khi bàn
                chuyện chọn năm cưới, người ta xét <strong>tuổi mụ</strong> (tuổi âm) của{' '}
                <strong>cô dâu</strong> trong năm định cưới. Lấy tuổi mụ chia 9, nếu số dư rơi vào{' '}
                <strong>1, 3, 6 hoặc 8</strong> thì gọi là “phạm Kim Lâu”, và dân gian khuyên cân
                nhắc thêm.
              </p>
              <p>
                Toàn bộ tục lệ này gói gọn trong một phép chia. Không có lá số, không có giờ sinh,
                không cần thầy — chỉ cần năm sinh cô dâu và năm bạn định cưới. Chính vì gọn như vậy
                nên nó lan rộng và được nhắc tới trong hầu hết các cuộc bàn cưới hỏi ở Việt Nam.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Kim Lâu là <strong>tục lệ để tham khảo</strong> khi chọn năm cưới — không phải lời
                  phán số mệnh, cũng không phải điều cấm.
                </li>
                <li>
                  Bốn tên gọi Thân – Thê – Tử – Lục Súc là{' '}
                  <strong>cách dân gian phân loại</strong>, không phải bốn dự báo về điều sẽ xảy ra
                  với gia đình bạn.
                </li>
                <li>
                  “Phạm” chỉ có nghĩa là <strong>năm đó rơi vào nhóm được khuyên cân nhắc</strong>.
                  Nếu muốn theo tục, cách nhẹ nhàng nhất là chọn một năm cô dâu không phạm — và trong
                  mỗi 9 năm luôn có tới 5 năm như vậy.
                </li>
              </ul>
              <p>
                Một điều quan trọng để giữ đúng tinh thần: đây không phải công cụ để hù doạ hay để
                bán lễ giải hạn. hieu.asia trình bày cách tính <strong>minh bạch</strong> để bạn tự
                quyết, <strong>không doạ vận hạn và không bán lễ “giải hạn”</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <KimLauDepth />,
        },
        {
          id: 'cach-tinh',
          tocLabel: 'Cách tự tính',
          heading: 'Cách suy ra Kim Lâu: tuổi mụ → chia 9 → tra loại',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Bước 1 — Tính tuổi mụ của cô dâu trong năm định cưới
              </h3>
              <p>
                Kim Lâu tính theo <strong>tuổi mụ</strong> (tuổi âm), không phải tuổi dương. Công
                thức: <strong>tuổi mụ = năm định cưới − năm sinh + 1</strong>, tức tính cả năm sinh
                là 1 tuổi. Ví dụ cô dâu sinh năm 2000, xét năm 2026 thì tuổi mụ là 27 — dù tuổi dương
                mới 26.
              </p>
              <p className="text-sm text-foreground/70">
                Đây là bước hay sai nhất. Nếu kết quả bạn tra tay lệch với công cụ, hãy kiểm bước này
                trước: chênh một tuổi là lệch nguyên một bậc và kết luận có thể đảo ngược.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Lấy tuổi mụ chia 9, giữ phần dư
              </h3>
              <p>
                Chia tuổi mụ cho 9 rồi <strong>giữ lại số dư</strong> (một số từ 0 đến 8). Cách nhẩm
                nhanh: trừ dần 9 cho tới khi còn số nhỏ hơn 9. Tuổi mụ 28 trừ 27 (ba lần 9) còn 1,
                vậy <strong>28 chia 9 dư 1</strong>.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Đối chiếu số dư với 4 loại Kim Lâu
              </h3>
              <p>
                Chỉ <strong>bốn số dư</strong> nằm trong bảng: 1, 3, 6 và 8. Rơi vào một trong bốn số
                này là “phạm”, và số dư quyết định luôn tên gọi. Mọi số dư còn lại —{' '}
                <strong>{CLEAR_REMAINDERS.join(', ')}</strong> — không có mục trong bảng, nghĩa là{' '}
                <strong>không phạm</strong>.
              </p>
              <p className="text-sm text-foreground/70">
                Bạn không cần nhớ gì cả: công cụ tra Kim Lâu tự tính khi bạn nhập năm sinh cô dâu, và
                liệt kê sẵn 8 năm kể từ năm hiện tại. Phần này chỉ để bạn hiểu con số ở đâu ra, thay
                vì nhận một kết quả “hộp đen”.
              </p>
            </div>
          ),
        },
        {
          id: 'bang-tra-nhanh',
          tocLabel: 'Bảng tra nhanh',
          heading: 'Bảng tra nhanh: số dư → loại Kim Lâu',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là bảng ánh xạ đầy đủ mà công cụ dùng để tra — chỉ có đúng bốn dòng, vì chỉ bốn số
                dư được coi là phạm. Cột ghi chú là cách dân gian diễn giải, giữ nguyên chữ trong
                công cụ.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[460px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Số dư (tuổi mụ ÷ 9)
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Tên gọi
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Theo quan niệm dân gian
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {KIM_LAU_TYPES.map((t) => (
                      <tr key={t.remainder} className="border-b border-border/60">
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">
                          {t.remainder}
                        </td>
                        <td className="px-4 py-2 font-medium text-foreground">{t.type}</td>
                        <td className="px-4 py-2 text-muted-foreground">{t.note}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-4 py-2 tabular-nums text-muted-foreground">
                        {CLEAR_REMAINDERS.join(', ')}
                      </td>
                      <td className="px-4 py-2 font-medium text-foreground">— (không phạm)</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        Không có mục trong bảng, nên theo tục là năm thuận
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Lưu ý dòng cuối: <strong>số dư 0 không phạm</strong>. Tuổi mụ 9, 18, 27, 36, 45 chia
                hết cho 9 nên dư 0 — đây là chỗ nhầm phổ biến nhất khi tra tay.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Các tuổi mụ phạm Kim Lâu (1–49)
              </h3>
              <p>
                Nếu chỉ nhìn theo tuổi, các tuổi mụ sau rơi vào nhóm phạm — đúng bằng những tuổi có số
                dư chia 9 là 1, 3, 6 hoặc 8:
              </p>
              <p className="font-mono text-sm tabular-nums text-foreground/85">{ages.join(' · ')}</p>
              <p className="text-sm text-foreground/70">
                Nhìn dãy này sẽ thấy ngay cấu trúc lặp: cứ mỗi 9 tuổi lại đúng 4 tuổi phạm, 5 tuổi
                thuận, và mô hình đó tự lặp lại mãi.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ví dụ tính tay</h3>
              <p>
                Bốn trường hợp dưới đây tính đúng theo ba bước ở trên. Bạn có thể lấy bút thử lại
                từng dòng — đó là cách chắc nhất để nhớ.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Cô dâu sinh
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Năm định cưới
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Tuổi mụ
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Số dư
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Kết luận
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {WORKED_EXAMPLES.map((ex) => (
                      <tr
                        key={`${ex.birthYear}-${ex.targetYear}`}
                        className="border-b border-border/60 last:border-b-0"
                      >
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">
                          {ex.birthYear}
                        </td>
                        <td className="px-4 py-2 tabular-nums text-muted-foreground">
                          {ex.targetYear}
                        </td>
                        <td className="px-4 py-2 tabular-nums text-foreground">{ex.ageMu}</td>
                        <td className="px-4 py-2 tabular-nums text-foreground">{ex.remainder}</td>
                        <td className="px-4 py-2 text-foreground">{ex.verdict}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Cô dâu sinh 1999, cưới năm 2026:</strong> tuổi mụ = 2026 − 1999 + 1 = 28.
                  28 chia 9 dư 1 → phạm <strong>Kim Lâu Thân</strong>. Nhưng chỉ cần lùi sang 2027:
                  tuổi mụ 29, dư 2 → <strong>không phạm</strong>. Một năm chênh lệch đã đổi kết luận.
                </li>
                <li>
                  <strong>Cô dâu sinh 2000, cưới năm 2026:</strong> tuổi mụ = 2026 − 2000 + 1 = 27.
                  27 chia hết cho 9 nên dư 0 → <strong>không phạm</strong>. Đừng nhầm “chia hết cho
                  9” thành “chắc chắn dính”.
                </li>
                <li>
                  <strong>Cô dâu sinh 1998, cưới năm 2027:</strong> tuổi mụ = 2027 − 1998 + 1 = 30.
                  30 chia 9 dư 3 → phạm <strong>Kim Lâu Thê</strong>.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Bảng và các ví dụ trên dùng đúng công thức bên trong công cụ{' '}
                <Link href="/kim-lau" className="text-gold-700 underline-offset-4 hover:underline">
                  tra Kim Lâu
                </Link>
                , nên hai nơi không thể nói hai kiểu. Nếu tự tính ra kết quả khác, kiểm lại bước tính
                tuổi mụ trước tiên.
              </p>
            </div>
          ),
        },
        {
          id: 'nguon-goc-va-gioi-han',
          tocLabel: 'Nguồn gốc & giới hạn',
          heading: 'Nguồn gốc phong tục và giới hạn cần biết',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Kim Lâu đến với chúng ta như một <strong>quy ước được truyền lại</strong> trong tục
                cưới hỏi: phép chia 9, bốn số dư 1 – 3 – 6 – 8, bốn tên gọi Thân – Thê – Tử – Lục
                Súc, và lời dặn xét tuổi mụ của cô dâu. Bốn tên gọi ấy gói đúng bốn mối bận tâm của
                một gia đình truyền thống: bản thân người cưới, bạn đời, con cái, và của cải trong
                nhà (“lục súc” là cách gọi cũ chỉ vật nuôi — thời mà đàn gia súc chính là tài sản
                lớn).
              </p>
              <p>
                Nhưng phải nói cho thẳng: <strong>các bản truyền lại không ghi lý do gốc</strong>. Vì
                sao lại chia 9 mà không phải một số khác? Vì sao đúng bốn số dư ấy? Vì sao dư 1 là
                Thân mà không phải Tử? Không có lập luận nào được ghi kèm — quy tắc được truyền theo
                dạng “cứ thế mà làm”. hieu.asia giữ đúng quy ước truyền thống để bạn tra cứu được
                phong tục, đồng thời nói rõ đây là{' '}
                <strong>quy ước văn hoá, không phải quy luật tự nhiên</strong>.
              </p>
              <p>Giới hạn cần ghi nhớ:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Kim Lâu chỉ dùng <strong>năm sinh cô dâu và năm định cưới</strong> nên rất thô: nó
                  chia mọi cô dâu trên đời vào vỏn vẹn 9 nhóm, trong đó 4 nhóm bị gọi là phạm. Một
                  phép chia không biết gì về hai con người cụ thể.
                </li>
                <li>
                  Kim Lâu <strong>không phải phán quyết</strong> và không dự đoán điều sẽ xảy ra. Bốn
                  tên gọi mô tả điều dân gian lo, không phải điều sẽ đến.
                </li>
                <li>
                  Nó cũng <strong>không phải điều cấm</strong>. Nếu gia đình muốn theo tục, cách nhẹ
                  nhàng nhất là chọn một năm cô dâu không phạm; nếu không theo, cũng chẳng có gì phải
                  “giải”.
                </li>
                <li>
                  Và nó <strong>không nói gì</strong> về những yếu tố thật sự quyết định một đám cưới
                  suôn sẻ: tài chính, công việc, sức khoẻ, sự đồng thuận của hai họ, lịch của hai
                  bên.
                </li>
              </ul>
              <p>
                Về chuyện “giải hạn”: hieu.asia <strong>không bán lễ giải hạn</strong> và không cho
                rằng phải “giải” mới yên. Đã hiểu Kim Lâu là một phép chia 9, bạn sẽ thấy không có gì
                ở đó để giải cả — chỉ có một lựa chọn đơn giản là cưới năm này hay năm khác.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <KimLauWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <KimLauRecall />,
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
                Kim Lâu chỉ là một yếu tố. Phong tục Việt còn vài cách xem tuổi cưới khác như{' '}
                <Link href="/tam-tai" className="text-gold-700 underline-offset-4 hover:underline">
                  Tam Tai
                </Link>{' '}
                hay xung năm — mỗi thứ một luật tính riêng, không suy ra được từ Kim Lâu. Muốn xét
                cùng lúc, dùng{' '}
                <Link
                  href="/xem-tuoi-cuoi"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  công cụ Xem tuổi cưới
                </Link>
                .
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Muốn biết ngay các năm tới năm nào cô dâu phạm Kim Lâu?{' '}
                <Link href="/kim-lau" className="text-gold-700 underline-offset-4 hover:underline">
                  Tra Kim Lâu miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/kim-lau', label: 'Tra Kim Lâu theo năm sinh' },
                    { href: '/xem-tuoi-cuoi', label: 'Xem tuổi cưới' },
                    { href: '/tam-tai', label: 'Tra Tam Tai' },
                    { href: '/xem-ngay', label: 'Xem ngày tốt' },
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
          children: <KimLauChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
