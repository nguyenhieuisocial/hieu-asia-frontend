/**
 * Bài học /learn/tam-tai — nền tảng cho người mới.
 *
 * GROUNDING (không có dữ kiện nào ngoài các nguồn này):
 *   - lib/tam-tai-data.ts        → listTamHopGroups(), CALENDAR_FROM/TO,
 *                                  buildTamTai() (mô tả 4 nhóm Tam Hợp, 3 địa chi
 *                                  năm Tam Tai của mỗi nhóm, danh sách năm dương
 *                                  lịch trong cửa sổ tĩnh, bộ FAQ gốc).
 *   - lib/xem-tuoi-cuoi.ts       → CHI, ANIMAL_BY_CHI, canChiOfYear(), TAM_TAI_YEARS
 *                                  (qua tam-tai-data — engine đã kiểm chứng).
 *   - app/tam-tai/page.tsx       → phần "Hiểu đúng về Tam Tai", bảng 4 nhóm,
 *                                  FAQ hub (nghĩa đen "ba tai"; năm "vào" –
 *                                  "giữa" – "ra"; 3 con giáp cách nhau 4 năm;
 *                                  chu kỳ 12 năm; không bán lễ "giải hạn").
 *   - app/tam-tai/[tuoi]/page.tsx + components/tam-tai/TamTaiFinder.tsx
 *                                → cách công cụ tra (năm sinh dương lịch
 *                                  1900–2100 → địa chi → nhóm → 3 năm), giọng
 *                                  "tham khảo, không phán số mệnh".
 *
 * BẢNG 4 NHÓM KHÔNG CHÉP TAY: render thẳng từ listTamHopGroups() để không bao
 * giờ lệch với công cụ /tam-tai.
 *
 * KHÔNG lấn sân: Kim Lâu, Hoang Ốc, sao hạn Cửu Diệu, tam hợp – lục xung dạng
 * hình học đều có bài riêng — ở đây chỉ nhắc tên + link, không giải thích cơ chế.
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
import { listTamHopGroups, CALENDAR_FROM, CALENDAR_TO } from '@/lib/tam-tai-data';
import {
  TamTaiFrame,
  TamTaiDepth,
  TamTaiRecall,
  TamTaiChecklist,
  TamTaiWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Tam Tai là gì — 4 nhóm tam hợp và 3 năm Tam Tai',
  description:
    'Tam Tai: 12 con giáp chia 4 nhóm tam hợp, mỗi nhóm gánh 3 năm Tam Tai trong mỗi 12 năm. Cách tra từ năm sinh, bảng đầy đủ — tham khảo, không hù doạ.',
  alternates: { canonical: 'https://hieu.asia/learn/tam-tai' },
};

/** 4 nhóm Tam Hợp — lấy thẳng từ lib, không chép tay (chống lệch với công cụ). */
const GROUPS = listTamHopGroups();

/**
 * Nhãn dân gian cho 3 năm của một đợt Tam Tai, theo đúng thứ tự mảng
 * `tamTaiChis` (3 địa chi liền nhau). Nguồn chữ: app/tam-tai/page.tsx —
 * “năm vào, năm giữa và năm ra Tam Tai”.
 */
const PHASE_LABELS = ['vào', 'giữa', 'ra'] as const;

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Tam Tai là gì?',
    a: 'Tam Tai (nghĩa đen là "ba tai") là một quan niệm dân gian theo hệ Can Chi: 12 con giáp được chia thành 4 nhóm tam hợp, và cứ trong mỗi vòng 12 năm, mỗi nhóm lại trải qua 3 năm liền nhau được xem là giai đoạn nên thận trọng hơn với việc trọng đại. Đây là tập tục để tham khảo, không phải lời phán số mệnh.',
  },
  {
    q: 'Vì sao Tam Tai kéo dài đúng 3 năm?',
    a: 'Chính cái tên đã nói: "Tam Tai" nghĩa đen là "ba tai" — ba năm. Nhìn vào cấu trúc thì con số 3 cũng khớp trọn vẹn với vòng địa chi: 4 nhóm tam hợp × 3 năm = 12, đúng bằng một vòng 12 con giáp. Nghĩa là mỗi năm trong vòng 12 năm đều là năm Tam Tai của đúng một nhóm, không năm nào trống và không năm nào bị đếm hai lần.',
  },
  {
    q: 'Vì sao tra Tam Tai theo nhóm tam hợp chứ không theo từng tuổi riêng?',
    a: 'Vì trong cách tính này, ba con giáp cùng một nhóm tam hợp (ba con giáp cách nhau 4 năm theo Can Chi) được xem là cùng bước vào 3 năm Tam Tai giống hệt nhau. Bảng tra vì thế chỉ có 4 dòng cho 12 con giáp: biết con giáp của mình thuộc nhóm nào là biết luôn 3 năm Tam Tai, không cần tra riêng từng tuổi.',
  },
  {
    q: 'Tam Tai lặp lại bao lâu một lần?',
    a: 'Mỗi 12 năm. Vì Tam Tai xét theo địa chi của năm mà vòng địa chi có 12 con giáp, nên 3 năm Tam Tai của một nhóm quay lại đúng sau 12 năm. Ví dụ nhóm Dần – Ngọ – Tuất gặp Tam Tai vào các năm Thân, Dậu, Tuất; trong khoảng 2024–2044 đó là 2028, 2029, 2030 rồi 2040, 2041, 2042.',
  },
  {
    q: 'Làm sao biết tuổi tôi có phạm Tam Tai không?',
    a: 'Tam Tai xét theo địa chi (con giáp) của năm sinh. Bạn đổi năm sinh dương lịch ra con giáp, xem con giáp đó nằm ở nhóm tam hợp nào, rồi đọc 3 năm Tam Tai của nhóm. Công cụ tra Tam Tai của hieu.asia làm toàn bộ việc này khi bạn nhập năm sinh, và cho biết luôn năm nay có rơi vào Tam Tai không.',
  },
  {
    q: 'Năm "vào", năm "giữa", năm "ra" Tam Tai nghĩa là gì?',
    a: 'Đó là cách dân gian gọi vui ba năm trong một đợt Tam Tai, theo đúng thứ tự trước – sau: năm đầu là năm "vào", năm thứ hai là năm "giữa", năm thứ ba là năm "ra". Ba nhãn này chỉ đánh dấu vị trí của năm trong đợt. Cách tính mà hieu.asia dùng không gán mức độ nặng – nhẹ khác nhau cho từng năm, nên bạn đừng suy diễn thêm rằng năm nào "nặng" hơn năm nào.',
  },
  {
    q: 'Phạm Tam Tai có cần cúng giải hạn không?',
    a: 'Không bắt buộc. hieu.asia trình bày cách tính minh bạch để bạn tự cân nhắc và không bán lễ "giải hạn". Ý nghĩa thực dụng của Tam Tai là nhắc bạn cẩn trọng hơn với việc lớn — cưới hỏi, làm nhà, khai trương, đầu tư — chứ không phải điềm gở cố định. Nhiều người vẫn tiến hành việc trọng đại trong năm Tam Tai sau khi cân nhắc kỹ và chuẩn bị chu đáo.',
  },
  {
    q: 'Cách tra Tam Tai có điểm gì hạn chế cần biết?',
    a: 'Có, và nên biết trước: Tam Tai chỉ dùng đúng một dữ kiện là địa chi của năm sinh, rồi xếp cả 12 con giáp vào vỏn vẹn 4 nhóm. Vì mỗi nhóm gồm 3 con giáp, ở bất kỳ năm nào cũng luôn có đúng một phần tư số người đang "trong Tam Tai". Đó là một cách chia rất thô, phù hợp làm lời nhắc chung, không phải một chẩn đoán riêng cho hoàn cảnh của bạn.',
  },
  {
    q: 'Tam Tai khác Kim Lâu và sao hạn Cửu Diệu thế nào?',
    a: 'Ba hệ khác nhau, đừng gộp kết quả. Tam Tai tra theo nhóm tam hợp của năm sinh, mỗi đợt 3 năm và lặp lại sau 12 năm. Kim Lâu và sao hạn Cửu Diệu có cách tính riêng, mỗi hệ một mục đích, và đều có trang riêng trên hieu.asia. Một năm có thể "dính" ở hệ này mà hoàn toàn bình thường ở hệ kia — thêm một lý do để đọc từng hệ theo đúng luật của nó thay vì cộng dồn nỗi lo.',
  },
];

const JSONLD = [
  article({
    headline: 'Tam Tai: 4 nhóm tam hợp và 3 năm Tam Tai — nền tảng cho người mới',
    description:
      'Tam Tai là gì, vì sao đúng 3 năm, vì sao tra theo nhóm tam hợp chứ không theo từng tuổi, bảng 4 nhóm và cách tra từ năm sinh. Phong tục để tham khảo, không hù doạ.',
    url: '/learn/tam-tai',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Tam Tai', url: '/learn/tam-tai' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Tam Tai là gì — 4 nhóm tam hợp và 3 năm Tam Tai',
    description:
      'Tam Tai: 12 con giáp chia 4 nhóm tam hợp, mỗi nhóm gánh 3 năm Tam Tai trong mỗi 12 năm. Cách tra từ năm sinh, bảng đầy đủ — tham khảo, không hù doạ.',
    url: '/learn/tam-tai',
  }),
];

export default function LearnTamTaiPage() {
  return (
    <LearnArticle
      eyebrow="PHONG TỤC · CAN CHI"
      title={
        <>
          Tam Tai{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (3 năm của một nhóm tam hợp)
          </span>
        </>
      }
      standfirst={
        <>
          Tam Tai không tra theo từng tuổi, mà tra theo <strong>nhóm</strong>: 12 con giáp được chia
          thành 4 nhóm tam hợp, mỗi nhóm gánh 3 năm Tam Tai liền nhau rồi 12 năm sau lặp lại. Đây là
          một phong tục để tham khảo khi cân nhắc việc trọng đại — không phải lời phán số mệnh.
        </>
      }
      readMeta="9 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Tam Tai' },
      ]}
      relatedLenses={relatedLearnLenses('tam-tai')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh dương lịch, hệ thống đổi ra con giáp, cho biết bạn thuộc nhóm tam hợp nào, 3 năm Tam Tai của nhóm là năm nào, và năm nay có rơi vào Tam Tai không.',
        href: '/tam-tai',
        label: 'Tra Tam Tai của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <TamTaiFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Tam Tai là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Tam Tai</strong> — nghĩa đen là <em>“ba tai”</em> — là một quan niệm dân gian
                theo hệ <strong>Can Chi</strong>. Theo cách tính này, 12 con giáp được chia thành{' '}
                <strong>4 nhóm tam hợp</strong> (mỗi nhóm 3 con giáp cách nhau 4 năm). Cứ trong một
                vòng 12 năm, mỗi nhóm lại gặp <strong>3 năm Tam Tai liền nhau</strong> — dân gian gọi
                vui là năm “vào”, năm “giữa” và năm “ra” Tam Tai.
              </p>
              <p>
                Tập tục xem đây là giai đoạn nên <strong>giữ nhịp, cẩn trọng hơn</strong> với việc
                trọng đại như cưới hỏi, làm nhà, khai trương hay đầu tư lớn: cân nhắc cho kỹ và chuẩn
                bị chu đáo, thay vì quyết định vội vàng.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu — Tam Tai KHÔNG phải:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không phải điềm gở cố định.</strong> Rơi vào năm Tam Tai không có nghĩa là
                  năm đó chắc chắn xảy ra chuyện xấu.
                </li>
                <li>
                  <strong>Không phải lệnh cấm.</strong> Phạm Tam Tai không có nghĩa là không được làm
                  việc lớn; nhiều người vẫn tiến hành sau khi cân nhắc kỹ.
                </li>
                <li>
                  <strong>Không phải một chẩn đoán riêng cho bạn.</strong> Cách tra chỉ dùng đúng một
                  dữ kiện: con giáp của năm sinh.
                </li>
              </ul>
              <p>
                Và giữ đúng tinh thần: hieu.asia trình bày cách tính minh bạch để bạn tự cân nhắc —{' '}
                <strong>không doạ vận hạn, không bán bùa hay lễ “giải hạn”</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <TamTaiDepth />,
        },
        {
          id: 'cach-tra',
          tocLabel: 'Cách tra Tam Tai',
          heading: 'Cách tra Tam Tai: năm sinh → con giáp → nhóm → 3 năm',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Toàn bộ phép tra chỉ có ba bước, và điểm mấu chốt là bước 2: bạn không tra theo{' '}
                <strong>tuổi</strong> của mình, mà tra theo <strong>nhóm</strong> mà tuổi mình thuộc
                về.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 1 — Đổi năm sinh ra con giáp (địa chi)
              </h3>
              <p>
                Tam Tai xét theo <strong>địa chi của năm sinh dương lịch</strong>. Quy tắc đổi: lấy{' '}
                <strong>năm sinh trừ 4, rồi chia 12 lấy phần dư</strong>; phần dư 0 đến 11 ứng lần
                lượt với Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi.
              </p>
              <p className="text-sm text-foreground/70">
                Ví dụ: 1990 − 4 = 1986; 1986 chia 12 dư 6 → con giáp thứ 7 trong dãy trên là{' '}
                <strong>Ngọ</strong> (con Ngựa). Công cụ tra Tam Tai nhận năm sinh dương lịch trong
                khoảng 1900–2100 và tự làm bước này.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Xem con giáp đó thuộc nhóm tam hợp nào
              </h3>
              <p>
                12 con giáp xếp vào <strong>4 nhóm tam hợp</strong>, mỗi nhóm gồm 3 con giáp{' '}
                <strong>cách nhau 4 năm</strong> theo vòng Can Chi. Theo quan niệm, cả ba con giáp
                trong một nhóm <strong>cùng bước vào 3 năm Tam Tai giống hệt nhau</strong> — đây
                chính là lý do bảng tra chỉ có 4 dòng thay vì 12.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Đọc 3 năm Tam Tai của nhóm
              </h3>
              <p>
                Mỗi nhóm ứng với <strong>3 địa chi năm</strong> liền nhau. Năm nào có địa chi nằm
                trong bộ ba đó thì cả nhóm được xem là đang trong Tam Tai: năm đầu là năm “vào”, năm
                thứ hai là năm “giữa”, năm thứ ba là năm “ra”. Hết bộ ba, nhóm ra khỏi Tam Tai và{' '}
                <strong>12 năm sau mới quay lại</strong>.
              </p>

              <div className="rounded-xl border border-gold/25 bg-card/40 p-4">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                  Mẹo nhớ
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Nhìn bảng ở phần sau sẽ thấy một quy luật dễ nhớ: <strong>3 năm Tam Tai của một
                  nhóm luôn kết thúc đúng ở một con giáp nằm trong chính nhóm đó</strong> — ví dụ
                  nhóm Tý, Thìn, Thân gặp Tam Tai vào Dần, Mão, <strong>Thìn</strong>. Đây là quy
                  luật đọc ra từ bảng để dễ nhớ, không phải lời lý giải của phong tục.
                </p>
              </div>

              <p className="text-sm text-foreground/70">
                Bạn không cần thuộc lòng gì cả: nhập năm sinh vào công cụ là ra đủ con giáp, nhóm tam
                hợp, 3 năm Tam Tai và tình trạng của năm nay. Phần này chỉ để bạn hiểu con số ở đâu
                ra, thay vì nhận một kết quả “hộp đen”.
              </p>
            </div>
          ),
        },
        {
          id: 'bang-tra-nhanh',
          tocLabel: 'Bảng tra nhanh',
          heading: 'Bảng tra nhanh: 4 nhóm tam hợp → 3 năm Tam Tai',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là toàn bộ bảng mà công cụ dùng để tra — đủ 12 con giáp trong 4 dòng. Cột giữa là{' '}
                <strong>3 địa chi năm</strong> theo đúng thứ tự “vào → giữa → ra”; cột phải quy sang{' '}
                <strong>năm dương lịch</strong> trong khoảng {CALENDAR_FROM}–{CALENDAR_TO}.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Nhóm tam hợp (3 con giáp)
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        3 năm Tam Tai (địa chi)
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Năm dương lịch ({CALENDAR_FROM}–{CALENDAR_TO})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {GROUPS.map((g) => (
                      <tr
                        key={g.tamTaiChis.join()}
                        className="border-b border-border/60 align-top last:border-b-0"
                      >
                        <td className="px-4 py-2.5 text-foreground">
                          {g.members.map((m) => m.ten).join(', ')}
                          <span className="block text-xs text-muted-foreground">
                            {g.members.map((m) => m.animal).join(' · ')}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-foreground">
                          {g.tamTaiChis.map((chi, i) => (
                            <span key={chi}>
                              {chi}
                              <span className="text-xs text-muted-foreground">
                                {' '}
                                ({PHASE_LABELS[i]})
                              </span>
                              {i < g.tamTaiChis.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </td>
                        <td className="px-4 py-2.5 tabular-nums text-muted-foreground">
                          {g.calendarYears.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Lưu ý khi đọc cột phải: {CALENDAR_FROM}–{CALENDAR_TO} là một cửa sổ cố định, nên có
                nhóm bị cắt mất phần đầu hoặc phần cuối của một đợt. Ví dụ nhóm Tý, Thìn, Thân có{' '}
                {CALENDAR_FROM} đứng lẻ vì đó là năm “ra” của đợt bắt đầu từ trước cửa sổ; đợt trọn
                vẹn kế tiếp mới là 2034 – 2035 – 2036.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Ba ví dụ tra tay</h3>
              <ul className="list-disc space-y-3 pl-5">
                <li>
                  <strong>Sinh năm 1990.</strong> 1990 − 4 = 1986, chia 12 dư 6 → con giáp{' '}
                  <strong>Ngọ</strong> (con Ngựa). Tuổi Ngọ nằm ở nhóm <strong>Dần, Ngọ, Tuất</strong>{' '}
                  → 3 năm Tam Tai là <strong>Thân, Dậu, Tuất</strong> → quy ra dương lịch trong cửa
                  sổ trên: 2028, 2029, 2030 rồi 2040, 2041, 2042.
                </li>
                <li>
                  <strong>Sinh năm 1993.</strong> 1993 − 4 = 1989, chia 12 dư 9 → con giáp{' '}
                  <strong>Dậu</strong> (con Gà). Tuổi Dậu nằm ở nhóm <strong>Sửu, Tỵ, Dậu</strong> → 3
                  năm Tam Tai là <strong>Hợi, Tý, Sửu</strong> → dương lịch: 2031, 2032, 2033 (rồi
                  2043, 2044 ở rìa cửa sổ).
                </li>
                <li>
                  <strong>Sinh năm 2000.</strong> 2000 − 4 = 1996, chia 12 dư 4 → con giáp{' '}
                  <strong>Thìn</strong> (con Rồng). Tuổi Thìn nằm ở nhóm{' '}
                  <strong>Tý, Thìn, Thân</strong> → 3 năm Tam Tai là <strong>Dần, Mão, Thìn</strong> →
                  dương lịch: {CALENDAR_FROM} (năm “ra” của đợt trước), rồi trọn đợt 2034, 2035, 2036.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Ba ví dụ trên cho thấy điều đáng nhớ nhất của Tam Tai: hai người sinh cách nhau nhiều
                năm vẫn có thể chung một bộ ba năm Tam Tai, chỉ vì con giáp của họ rơi vào cùng một
                nhóm. Nếu kết quả bạn tra tay khác với công cụ, kiểm tra lại bước đổi năm sinh ra con
                giáp trước — đó là chỗ hay nhầm nhất.
              </p>
            </div>
          ),
        },
        {
          id: 'nguon-goc-va-gioi-han',
          tocLabel: 'Nguồn gốc & giới hạn',
          heading: 'Nguồn gốc phong tục và giới hạn của cách tính',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">Nó đến từ đâu</h3>
              <p>
                Tam Tai là một <strong>tập tục dân gian</strong> gắn với hệ <strong>Can Chi</strong> —
                cùng bộ 12 địa chi dùng để gọi tên năm mà bạn vẫn quen dưới dạng 12 con giáp. Cấu trúc
                của nó rất gọn: nhóm tam hợp có sẵn trong Can Chi, và Tam Tai chỉ gắn cho mỗi nhóm một
                bộ ba năm cố định.
              </p>
              <p>
                Cần nói thẳng một điều để bạn khỏi tìm sai chỗ: tài liệu mà hieu.asia dựa vào để dựng
                công cụ này chỉ ghi Tam Tai là <strong>quan niệm dân gian</strong> truyền lại, chứ{' '}
                <strong>không ghi thời điểm ra đời, tác giả hay lý do gốc</strong> vì sao mỗi nhóm lại
                nhận đúng bộ ba năm ấy. Vì vậy bài này không dựng lên một “nguồn gốc” cụ thể nào —
                phần nào không có căn cứ thì nói rõ là không có, đó cũng là một phần của việc hiểu
                đúng.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Giới hạn: chia 12 con giáp vào 4 rổ là rất thô
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chỉ một dữ kiện đầu vào.</strong> Cách tra dùng đúng địa chi của năm sinh —
                  không xét tháng, ngày, giờ sinh, không xét hoàn cảnh, nghề nghiệp hay bất cứ điều gì
                  riêng của bạn.
                </li>
                <li>
                  <strong>Bốn rổ cho tất cả mọi người.</strong> 12 con giáp gom vào 4 nhóm, nên hai
                  người hoàn toàn khác nhau vẫn rơi cùng một nhóm chỉ vì năm sinh cùng chi.
                </li>
                <li>
                  <strong>Một phần tư dân số luôn “đang Tam Tai”.</strong> Vì 4 nhóm × 3 năm phủ trọn
                  vòng 12 năm, ở bất kỳ năm nào cũng có đúng một nhóm (tức 3 trong 12 con giáp) đang
                  trong Tam Tai. Một nhãn mà một phần tư số người luôn mang thì không thể là lời tiên
                  đoán riêng cho ai.
                </li>
                <li>
                  <strong>Không phải phán quyết.</strong> Tam Tai không dự đoán chắc chắn may – rủi và
                  không thay thế lời khuyên y tế, pháp lý hay tài chính.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">
                Vậy dùng nó thế nào cho lành mạnh
              </h3>
              <p>
                Giá trị thực dụng của Tam Tai nằm ở chỗ nó buộc người ta <strong>chậm lại một nhịp</strong>{' '}
                trước việc trọng đại: cưới hỏi, làm nhà, khai trương, đầu tư lớn — cân nhắc kỹ và chuẩn
                bị chu đáo rồi hãy quyết. Đó là một thói quen tốt bất kể bạn có tin vào Tam Tai hay
                không.
              </p>
              <p>
                Ngược lại, hoãn hết mọi dự định trong ba năm vì hai chữ “Tam Tai”, hay bỏ tiền mua lễ
                “giải hạn”, là đọc phong tục sai cách. <strong>hieu.asia không bán lễ “giải hạn”</strong>{' '}
                và không cho rằng phải “giải” mới yên.
              </p>
              <p className="text-sm text-foreground/70">
                Tam Tai cũng không phải hệ tra tuổi duy nhất trong phong tục Việt: còn{' '}
                <Link href="/kim-lau" className="text-gold-700 underline-offset-4 hover:underline">
                  Kim Lâu
                </Link>{' '}
                và{' '}
                <Link href="/sao-han" className="text-gold-700 underline-offset-4 hover:underline">
                  sao hạn Cửu Diệu
                </Link>
                , mỗi hệ một cách tính và một mục đích riêng. Đừng gộp kết quả của chúng lại với nhau:
                một năm có thể “dính” ở hệ này mà hoàn toàn bình thường ở hệ kia.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <TamTaiWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <TamTaiRecall />,
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
                Muốn biết tuổi mình thuộc nhóm nào và năm nay có rơi vào Tam Tai không?{' '}
                <Link href="/tam-tai" className="text-gold-700 underline-offset-4 hover:underline">
                  Tra Tam Tai miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/tam-tai', label: 'Tra Tam Tai theo năm sinh' },
                    { href: '/xem-tuoi-cuoi', label: 'Xem tuổi cưới' },
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
          children: <TamTaiChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
