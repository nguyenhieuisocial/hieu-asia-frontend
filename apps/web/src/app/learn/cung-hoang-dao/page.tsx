/**
 * /learn/cung-hoang-dao — bài học nền tảng về BẢN THÂN 12 CUNG HOÀNG ĐẠO.
 *
 * GROUNDING (chống bịa — mọi con số/dữ kiện đọc từ codebase, không chép tay):
 *  - `lib/western-astrology.ts` → ZODIAC (tên, ký hiệu, nguyên tố, tam thái của
 *    12 cung) + ELEMENT_TENDENCY (mô tả xu hướng 4 nguyên tố).
 *  - `lib/cung-hoang-dao-data.ts` → buildCung()/CUNG_SLUGS: khoảng ngày quy ước
 *    (dateLabel), tên tiếng Anh, hành tinh chủ quản cổ điển + hiện đại.
 *    Bảng 12 cung bên dưới RENDER TRỰC TIẾP từ đó → luôn khớp một nguồn duy nhất.
 *  - `lib/cung-hoang-dao-hop-data.ts` → khung 5 nhóm quan hệ suy theo nguyên tố
 *    (chỉ nhắc 1 câu + trỏ sang /cung-hoang-dao/hop, không giải thích lại).
 *  - Trang công cụ `app/cung-hoang-dao/` → SunSignFinder: tính cung bằng vị trí
 *    Mặt Trời thật (Meeus), hỗ trợ 1900–2100, mặc định giờ trưa, cảnh báo ca sinh
 *    sát ranh giới (nearCusp).
 *
 * PHÂN VAI (chống trùng nội dung): /learn/chiem-tinh sở hữu bản đồ sao cá nhân,
 * hành tinh, 12 nhà, góc hợp, cung Mọc. Bài NÀY chỉ sở hữu 12 cung (ngày, nguyên
 * tố, tam thái, hành tinh chủ) + vấn đề tuế sai / chòm sao thật / Xà Phu.
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
import { CUNG_SLUGS, buildCung } from '@/lib/cung-hoang-dao-data';
import {
  ELEMENT_TENDENCY,
  type ZodiacElement,
  type ZodiacQuality,
} from '@/lib/western-astrology';
import {
  CungHoangDaoFrame,
  CungHoangDaoDepth,
  CungHoangDaoRecall,
  CungHoangDaoChecklist,
  CungHoangDaoWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: '12 cung hoàng đạo — ngày sinh, nguyên tố & tam thái',
  description:
    '12 cung hoàng đạo: khoảng ngày, 4 nguyên tố, 3 tam thái, hành tinh chủ quản — và vì sao chòm sao thật trên trời lệch với cung. Tham khảo, không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/cung-hoang-dao' },
};

// Một nguồn duy nhất cho mọi bảng/danh sách dưới đây: đọc thẳng từ lib, KHÔNG
// chép tay ngày tháng, nguyên tố hay hành tinh chủ quản.
const SIGNS = CUNG_SLUGS.map((slug) => buildCung(slug)!);

const ELEMENT_ORDER: ZodiacElement[] = ['Lửa', 'Đất', 'Khí', 'Nước'];
const QUALITY_ORDER: ZodiacQuality[] = ['Tiên phong', 'Kiên định', 'Linh hoạt'];

const ELEMENT_DOT: Record<ZodiacElement, string> = {
  Lửa: 'bg-rose-500',
  Đất: 'bg-amber-600',
  Khí: 'bg-sky-400',
  Nước: 'bg-indigo-400',
};

/** Cách năng lượng của một tam thái vận hành — mô tả ngắn, không phán định. */
const QUALITY_NOTE: Record<ZodiacQuality, string> = {
  'Tiên phong': 'khởi sự, mở đường, chủ động bắt đầu một chu kỳ mới',
  'Kiên định': 'duy trì, bền chí, giữ vững điều đã bắt đầu',
  'Linh hoạt': 'thích nghi, chuyển tiếp, xoay theo hoàn cảnh để khép chu kỳ',
};

const signsOfElement = (el: ZodiacElement) => SIGNS.filter((s) => s.z.element === el);
const signsOfQuality = (q: ZodiacQuality) => SIGNS.filter((s) => s.z.quality === q);

const rulerLine = (s: (typeof SIGNS)[number]) =>
  s.extra.rulingPlanetModern
    ? `${s.extra.rulingPlanet} · hiện đại: ${s.extra.rulingPlanetModern}`
    : s.extra.rulingPlanet;

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: '12 cung hoàng đạo gồm những cung nào, mỗi cung ứng với khoảng ngày nào?',
    a: `Theo thứ tự vòng hoàng đạo: ${SIGNS.map(
      (s) => `${s.z.name} (${s.extra.english}, ${s.extra.dateLabel})`,
    ).join('; ')}. Các khoảng ngày này là quy ước: mốc ranh giới có thể lệch ±1 ngày tuỳ năm, vì điểm xuân phân không rơi đúng cùng giờ mỗi năm. Nếu bạn sinh sát đầu hoặc cuối một khoảng, hãy dùng công cụ tra cung — nó tính theo vị trí Mặt Trời thật cho đúng ngày của bạn.`,
  },
  {
    q: 'Cung hoàng đạo được phân loại theo nguyên tố và tam thái như thế nào?',
    a: `Mỗi cung là giao của hai trục. Nguyên tố (4 loại, mỗi loại 3 cung): ${ELEMENT_ORDER.map(
      (el) => `${el} — ${signsOfElement(el).map((s) => s.z.name).join(', ')}`,
    ).join('; ')}. Tam thái (3 loại, mỗi loại 4 cung): ${QUALITY_ORDER.map(
      (q) => `${q} — ${signsOfQuality(q).map((s) => s.z.name).join(', ')}`,
    ).join('; ')}. 4 × 3 = 12 tổ hợp duy nhất, mỗi tổ hợp xuất hiện đúng một lần — đó là lý do hệ này có đúng 12 cung.`,
  },
  {
    q: 'Cung hoàng đạo có phải là chòm sao trên trời không?',
    a: 'Không. Cung hoàng đạo trong chiêm tinh phương Tây là 12 ô bằng nhau, mỗi ô 30° trên vòng tròn 360°, với mốc 0° của cung Bạch Dương gắn vào điểm xuân phân. Đây là hệ hoàng đạo nhiệt đới (tropical) — bám theo mùa, không bám chòm sao thật. Các chòm sao thật thì rộng hẹp không đều và mang tên trùng với cung chỉ vì lý do lịch sử.',
  },
  {
    q: 'Tuế sai là gì và nó ảnh hưởng thế nào đến cung hoàng đạo?',
    a: 'Trục quay Trái Đất lắc chậm như một con quay, khiến điểm xuân phân trôi dần trên nền sao khoảng 1° mỗi 72 năm — trọn một vòng mất khoảng 26.000 năm. Hiện tượng này gọi là tuế sai. Vì hoàng đạo nhiệt đới neo vào điểm xuân phân còn hoàng đạo sao trời (sidereal) neo vào chòm sao thật, sau khoảng hai nghìn năm hai hệ đã lệch nhau chừng 24° — gần trọn một cung. Cung tropical của bạn không vì thế mà đổi: nó vốn được định nghĩa theo mùa.',
  },
  {
    q: 'Xà Phu (Ophiuchus) có phải cung thứ 13 không? NASA có "đổi cung hoàng đạo" không?',
    a: 'Không có cung thứ 13 trong chiêm tinh tropical. Xà Phu là một chòm sao có thật, ranh giới được Hiệp hội Thiên văn Quốc tế chuẩn hoá từ năm 1930 để phục vụ thiên văn; Mặt Trời có đi qua vùng trời của nó vào đầu tháng 12. Nhưng chia hoàng đạo theo chòm sao thật và chia thành 12 ô 30° theo mùa là hai việc khác nhau. Đợt tin "NASA đổi cung hoàng đạo" năm 2016 bắt nguồn từ một bài phổ biến khoa học nhắc lại dữ kiện thiên văn trên rồi bị giật tít — không cơ quan nào có thẩm quyền đổi một hệ quy ước, và cũng không cơ quan khoa học nào công nhận hệ đó như một phép đo.',
  },
  {
    q: 'Hành tinh chủ quản của từng cung hoàng đạo là gì?',
    a: `Theo cách gán cổ điển: ${SIGNS.map((s) => `${s.z.name} — ${s.extra.rulingPlanet}`).join(
      '; ',
    )}. Vì thiên văn cổ chỉ có 7 thiên thể nhìn được bằng mắt thường cho 12 cung, Mặt Trời và Mặt Trăng mỗi vị giữ một cung, năm hành tinh còn lại mỗi vị giữ hai cung. Sau khi ba hành tinh xa được phát hiện, chiêm tinh hiện đại gán thêm chủ quản cho đúng ba cung: ${SIGNS.filter(
      (s) => s.extra.rulingPlanetModern,
    )
      .map((s) => `${s.z.name} — ${s.extra.rulingPlanetModern}`)
      .join('; ')}. Có trường phái giữ cổ điển, có trường phái dùng hiện đại.`,
  },
  {
    q: 'Tôi sinh sát ranh giới giữa hai cung thì tính thế nào?',
    a: 'Ranh giới cung không rơi đúng một ngày cố định mỗi năm, nên bảng ngày chỉ là quy ước. Công cụ tra cung của hieu.asia tính kinh độ Mặt Trời thật cho đúng ngày bạn nhập (hỗ trợ khoảng 1900–2100) và gắn cờ cảnh báo nếu bạn sinh sát đầu hoặc cuối một cung. Với ca sát ranh giới, kết quả mặc định lấy theo giờ trưa; nếu biết giờ sinh chính xác, lập bản đồ sao đầy đủ sẽ chắc chắn hơn.',
  },
  {
    q: 'Cung hoàng đạo có cơ sở khoa học không?',
    a: 'Cần tách hai lớp. Lớp thứ nhất — vị trí Mặt Trời, các mốc ngày, hiện tượng tuế sai — là thiên văn có thật, tính được và kiểm chứng được. Lớp thứ hai — gán tính cách cho từng cung — thì các nghiên cứu tâm lý quy mô lớn, kể cả thử nghiệm mù đôi, không tìm thấy liên hệ ổn định giữa ngày sinh và tính cách. Lý do mô tả cung vẫn hay "thấy đúng" là hiệu ứng Barnum: mô tả đủ chung thì gần như ai đọc cũng nhận ra mình. Vì vậy hieu.asia trình bày cung hoàng đạo như một ngôn ngữ chung để soi chiếu bản thân, không phải phép đo và không phán số mệnh.',
  },
];

const JSONLD = [
  article({
    headline: '12 cung hoàng đạo: ngày sinh, nguyên tố, tam thái & vấn đề tuế sai',
    description:
      '12 cung hoàng đạo: ngày bắt đầu và kết thúc, 4 nguyên tố, 3 tam thái, hành tinh chủ quản — và vì sao hoàng đạo tropical khác chòm sao thật (tuế sai, Xà Phu).',
    url: '/learn/cung-hoang-dao',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: '12 cung hoàng đạo', url: '/learn/cung-hoang-dao' },
  ]),
  faqPage(FAQS),
  course({
    name: '12 cung hoàng đạo — ngày sinh, nguyên tố & tam thái',
    description:
      '12 cung hoàng đạo: khoảng ngày, 4 nguyên tố, 3 tam thái, hành tinh chủ quản — và vì sao chòm sao thật trên trời lệch với cung. Tham khảo, không phán số mệnh.',
    url: '/learn/cung-hoang-dao',
  }),
];

export default function LearnCungHoangDaoPage() {
  return (
    <LearnArticle
      eyebrow="TÂY PHƯƠNG · 12 CUNG"
      title={
        <>
          12 cung{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">hoàng đạo</span>
        </>
      }
      standfirst={
        <>
          Vòng hoàng đạo là đường đi của Mặt Trời trong một năm, chia thành 12 ô bằng nhau. Bài này
          đi thẳng vào bản thân 12 cung: mỗi cung bắt đầu và kết thúc lúc nào, thuộc nguyên tố và tam
          thái gì, ai chủ quản — và vì sao chòm sao thật trên trời lại không khớp với cung của bạn.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: '12 cung hoàng đạo' },
      ]}
      relatedLenses={relatedLearnLenses('cung-hoang-dao')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập ngày sinh, hệ thống tính cung Mặt Trời của bạn theo vị trí Mặt Trời thật (không tra bảng cứng), nên đúng cả với người sinh sát ranh giới giữa hai cung.',
        href: '/cung-hoang-dao',
        label: 'Tra cung của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <CungHoangDaoFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: '12 cung hoàng đạo là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trong một năm, nhìn từ Trái Đất, Mặt Trời đi hết một vòng trên nền trời. Đường đi đó
                gọi là <strong>hoàng đạo</strong>. Người xưa chia vòng tròn 360° ấy thành{' '}
                <strong>12 phần bằng nhau, mỗi phần 30°</strong> — đó chính là 12 cung hoàng đạo.
                "Cung hoàng đạo của bạn" (còn gọi <strong>cung Mặt Trời</strong>) là cung chứa Mặt
                Trời vào ngày bạn sinh.
              </p>
              <p>
                Nói cho gọn: cung hoàng đạo là <strong>một hệ ký hiệu</strong> — một cách chia thời
                gian trong năm thành 12 ô và gắn cho mỗi ô một "chất". Nó có cấu trúc rõ ràng, học
                được, và chính vì có cấu trúc nên bạn không cần học thuộc 12 đoạn mô tả rời rạc.
              </p>
              <p>Cần nói thẳng ngay từ đầu, để phần sau đọc cho đúng tinh thần:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Cung hoàng đạo <strong>là</strong> một hệ biểu tượng để phản tư — một ngôn ngữ chung
                  giúp bạn gọi tên xu hướng của mình và nói chuyện với người khác về chúng.
                </li>
                <li>
                  Cung hoàng đạo <strong>không phải</strong> một phép đo khoa học về tính cách. Ngày,
                  góc, tuế sai là thiên văn có thật; phần gán tính cách cho từng cung thì không có
                  bằng chứng nghiên cứu chống lưng — mục{' '}
                  <Link
                    href="#gioi-han"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    giới hạn
                  </Link>{' '}
                  nói rõ chuyện này.
                </li>
                <li>
                  Cung hoàng đạo <strong>không dự đoán</strong> điều sẽ xảy ra với bạn, không thay thế
                  lời khuyên y tế, pháp lý hay tài chính, và không phải cái cớ để ai đó bán "giải
                  hạn".
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                <strong>Phạm vi bài này, nói rõ để bạn khỏi mất công tìm.</strong> Ở đây chỉ bàn về
                bản thân 12 cung: ngày, nguyên tố, tam thái, hành tinh chủ quản và vấn đề tuế sai. Còn{' '}
                <strong>cung Mọc</strong> — cung đang mọc ở chân trời lúc bạn sinh, phụ thuộc giờ và
                nơi sinh — cùng 12 nhà và góc hợp thuộc về bản đồ sao cá nhân: đọc ở{' '}
                <Link
                  href="/learn/chiem-tinh"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bài chiêm tinh phương Tây
                </Link>{' '}
                và lập thử tại{' '}
                <Link
                  href="/ban-do-sao"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bản đồ sao
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <CungHoangDaoDepth />,
        },
        {
          id: 'muoi-hai-cung',
          tocLabel: 'Bảng 12 cung',
          heading: 'Bảng 12 cung: ngày, nguyên tố, tam thái, chủ quản',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là toàn bộ dữ kiện "cứng" của 12 cung, xếp theo đúng thứ tự trên vòng hoàng đạo
                (bắt đầu từ Bạch Dương ở điểm xuân phân). Bảng này lấy thẳng từ dữ liệu mà công cụ tra
                cung đang dùng, nên không lệch với kết quả bạn nhận được khi tra.
              </p>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/60">
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Cung
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Khoảng ngày
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Nguyên tố
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Tam thái
                      </th>
                      <th scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                        Hành tinh chủ quản
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIGNS.map((s) => (
                      <tr key={s.slug} className="border-b border-border/60 last:border-b-0">
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-foreground">
                          <Link
                            href={`/cung-hoang-dao/${s.slug}`}
                            className="underline-offset-4 hover:text-gold hover:underline"
                          >
                            <span aria-hidden="true" className="mr-1.5 text-gold">
                              {s.z.symbol}
                            </span>
                            {s.z.name}
                          </Link>
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            {s.extra.english}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                          {s.extra.dateLabel}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                          <span
                            aria-hidden="true"
                            className={`mr-2 inline-block h-2 w-2 rounded-full align-middle ${ELEMENT_DOT[s.z.element]}`}
                          />
                          {s.z.element}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-muted-foreground">
                          {s.z.quality}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">{rulerLine(s)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Cột <strong>hành tinh chủ quản</strong> ghi theo cách gán cổ điển; chỉ ba cung có thêm
                dòng "hiện đại" vì ba hành tinh xa được phát hiện muộn hơn nhiều so với thời hệ này
                thành hình. <strong>Có trường phái giữ cổ điển, có trường phái dùng hiện đại</strong>{' '}
                — bài nêu cả hai, không khẳng định một chiều.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                ⚠️ <strong>Khoảng ngày trong bảng là quy ước, lệch ±1 ngày tuỳ năm.</strong> Điểm xuân
                phân không rơi đúng cùng giờ mỗi năm, nên ranh giới giữa hai cung xê dịch nhẹ. Nếu bạn
                sinh sát đầu hoặc cuối một khoảng, đừng chốt cứng theo bảng:{' '}
                <Link
                  href="/cung-hoang-dao"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  công cụ tra cung
                </Link>{' '}
                tính theo vị trí Mặt Trời thật cho đúng ngày của bạn và sẽ cảnh báo khi bạn rơi vào ca
                sát ranh giới.
              </p>
            </div>
          ),
        },
        {
          id: 'nguyen-to-va-tam-thai',
          tocLabel: 'Nguyên tố × tam thái',
          heading: '4 nguyên tố × 3 tam thái: vì sao đúng 12, không hơn không kém',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là phần đáng học nhất của cả bài. 12 cung không phải một danh sách được liệt kê
                tuỳ hứng — nó là <strong>một lưới khép kín</strong> dựng từ hai trục: cung làm bằng
                "chất liệu" gì (nguyên tố) và năng lượng của nó vận hành theo kiểu nào (tam thái).
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Trục 1 — bốn nguyên tố, mỗi nguyên tố ba cung
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {ELEMENT_ORDER.map((el) => (
                  <div key={el} className="rounded-xl border border-border bg-card/40 p-4">
                    <p className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${ELEMENT_DOT[el]}`}
                      />
                      {el}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {signsOfElement(el).map((s) => s.z.name).join(' · ')}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      Người nhiều {el} thường {ELEMENT_TENDENCY[el]}
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Trục 2 — ba tam thái, mỗi tam thái bốn cung
              </h3>
              <p>
                Tam thái (còn gọi <strong>tính chất</strong>) mô tả cung đứng ở đâu trong nhịp của một
                mùa: mở đầu, giữ giữa, hay chuyển tiếp sang mùa sau.
              </p>
              <div className="space-y-3">
                {QUALITY_ORDER.map((q) => (
                  <div key={q} className="rounded-xl border border-border bg-card/40 p-4">
                    <p className="font-heading text-base font-semibold text-foreground">{q}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {signsOfQuality(q).map((s) => s.z.name).join(' · ')}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      {QUALITY_NOTE[q]}.
                    </p>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                Vì sao cấu trúc này khép kín ở đúng 12
              </h3>
              <p>
                4 nguyên tố × 3 tam thái = <strong>12 tổ hợp</strong>, và mỗi tổ hợp xuất hiện{' '}
                <strong>đúng một lần</strong>. Không có hai cung nào cùng nguyên tố lại cùng tam thái.
                Chỉ có một cung Nước Kiên định (Bọ Cạp), một cung Đất Tiên phong (Ma Kết), một cung
                Khí Linh hoạt (Song Tử) — cứ thế cho đủ 12.
              </p>
              <p>
                Lý do hình học rất gọn. Đi vòng quanh hoàng đạo theo thứ tự cung,{' '}
                <strong>nguyên tố lặp lại mỗi 4 cung</strong> còn{' '}
                <strong>tam thái lặp lại mỗi 3 cung</strong>. Vì 3 và 4 không có ước chung nào lớn hơn
                1, cặp (nguyên tố, tam thái) phải quay đủ 12 bước mới trở về đúng tổ hợp ban đầu. Hệ
                vì thế tự đóng lại ở con số 12 — thêm một cung nữa là phá vỡ toàn bộ cấu trúc, chứ
                không phải chỉ "chèn thêm một mục vào danh sách".
              </p>
              <p>Hai hệ quả nhìn thấy được ngay trên vòng tròn:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Ba cung <strong>cùng nguyên tố</strong> cách nhau đúng <strong>120°</strong> — chúng
                  tạo thành một tam giác đều trên vòng hoàng đạo.
                </li>
                <li>
                  Bốn cung <strong>cùng tam thái</strong> cách nhau đúng <strong>90°</strong> — chúng
                  tạo thành một hình vuông.
                </li>
              </ul>
              <p>
                Còn một lớp nữa, đơn giản hơn: bốn nguyên tố chia thành hai cực xen kẽ.{' '}
                <strong>Lửa và Khí</strong> thuộc cực chủ động (hướng ra ngoài),{' '}
                <strong>Đất và Nước</strong> thuộc cực tiếp nhận (hướng vào trong). Đi quanh vòng, hai
                cực này luân phiên đều đặn cung một. Đây cũng là nền của cách xếp nhóm "bổ trợ" khi so
                hai cung — chuyện đó thuộc{' '}
                <Link
                  href="/cung-hoang-dao/hop"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  trang độ hợp 12 cung
                </Link>
                , bài này không đi sâu.
              </p>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                <strong>Mẹo dùng được ngay:</strong> thay vì nhớ 12 mô tả, hãy nhớ hai trục rồi ghép.
                Ma Kết = Đất + Tiên phong → thực tế mà chủ động leo lên, tức kỷ luật xây mục tiêu dài
                hạn. Song Ngư = Nước + Linh hoạt → cảm xúc mà mềm, dễ hoà vào người khác. Đây là cách
                suy <strong>có cơ sở trong chính hệ</strong>, thay vì học vẹt.
              </p>
            </div>
          ),
        },
        {
          id: 'tue-sai-va-xa-phu',
          tocLabel: 'Tuế sai & Xà Phu',
          heading: 'Tuế sai, chòm sao thật và chuyện "cung của tôi bị đổi"',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là chỗ gây hiểu nhầm nhiều nhất về cung hoàng đạo, và cũng là chỗ đáng hiểu nhất.
                Câu hỏi cốt lõi: <strong>"cung Bạch Dương" nghĩa là gì?</strong> Nó nghĩa là "Mặt Trời
                đang ở trước chòm sao Bạch Dương", hay nghĩa là "Mặt Trời đang ở trong ô 30° đầu tiên
                tính từ xuân phân"? Hai cách hiểu này từng gần như trùng nhau, nay đã lệch hẳn.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Hai cách gắn mốc cho vòng hoàng đạo
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hoàng đạo nhiệt đới (tropical)</strong> — lấy 0° Bạch Dương = điểm xuân
                  phân, rồi chia đều 12 ô 30° theo mùa. Đây là hệ phổ biến ở phương Tây và là hệ mọi
                  công cụ chiêm tinh phương Tây ở hieu.asia dùng.
                </li>
                <li>
                  <strong>Hoàng đạo sao trời (sidereal)</strong> — bám vị trí chòm sao thật, được dùng
                  trong chiêm tinh Vệ Đà.
                </li>
              </ul>
              <p>
                Cùng một ngày sinh, hai hệ có thể cho ra hai cung khác nhau. Không bên nào "sai" — hai
                bên đang neo vào hai mốc khác nhau. Nếu bạn từng đọc ở đâu đó ra một cung khác với
                cung quen thuộc của mình, phần lớn là do nhầm hai hệ này.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Tuế sai: vì sao hai hệ lệch nhau
              </h3>
              <p>
                Trục quay của Trái Đất không đứng yên: nó lắc rất chậm như một con quay sắp đổ. Hệ quả
                là <strong>điểm xuân phân trôi dần trên nền sao</strong>, khoảng{' '}
                <strong>1° mỗi 72 năm</strong> — trọn một vòng mất khoảng{' '}
                <strong>26.000 năm</strong>. Hiện tượng này gọi là <strong>tuế sai</strong>.
              </p>
              <p>
                Một đời người gần như không nhận ra 1° mỗi 72 năm. Nhưng cộng dồn qua khoảng hai nghìn
                năm — quãng thời gian kể từ khi hệ 12 cung được sắp thành khung ở phương Tây — độ lệch
                đã tới <strong>khoảng 24°</strong>, tức gần trọn một cung. Đó chính là khoảng cách
                giữa hoàng đạo nhiệt đới và hoàng đạo sao trời hôm nay.
              </p>
              <p>
                Điểm mấu chốt: <strong>tuế sai không làm cung tropical của bạn đổi</strong>. Cung
                tropical được định nghĩa theo mùa, mà xuân phân thì vẫn là xuân phân. Cái trôi đi là
                nền sao phía sau, không phải cái mốc.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Chòm sao thật rộng hẹp không đều — và chòm Xà Phu
              </h3>
              <p>
                Còn một khác biệt nữa, độc lập với tuế sai: <strong>chòm sao không đều nhau</strong>.
                12 cung được chia bằng nhau mỗi cung 30°, nhưng các chòm sao mang tên tương ứng thì
                cái rộng cái hẹp rất khác. Trên đường Mặt Trời đi, chòm Bọ Cạp chỉ chiếm khoảng một
                tuần, trong khi có những chòm khác chiếm hơn một tháng.
              </p>
              <p>
                Và trên đường đi ấy còn có một chòm sao <strong>không nằm trong 12 cung</strong>:{' '}
                <strong>Xà Phu (Ophiuchus)</strong> — Mặt Trời đi qua vùng trời của nó hơn hai tuần
                vào đầu tháng 12. Ranh giới các chòm sao đã được Hiệp hội Thiên văn Quốc tế chuẩn hoá
                từ <strong>năm 1930</strong>, phục vụ mục đích thiên văn. Nói cách khác: dữ kiện Xà
                Phu là có thật, đã có gần một thế kỷ, và chưa bao giờ là một khám phá mới.
              </p>
              <p>
                Vì thế, cứ vài năm lại có một đợt tin lan truyền kiểu "NASA vừa đổi cung hoàng đạo, có
                cung thứ 13, bạn không còn là cung cũ nữa" — nổi nhất là đợt năm{' '}
                <strong>2016</strong>. Nguồn gốc thường là một bài phổ biến khoa học nhắc lại đúng dữ
                kiện thiên văn trên, rồi bị giật tít thành một tuyên bố mà nó không hề đưa ra.
              </p>

              <h3 className="text-lg font-semibold text-foreground">Kết luận tỉnh táo, hai vế</h3>
              <p>
                Muốn hiểu đúng chuyện này thì phải nói được cả hai vế, thiếu vế nào cũng lệch:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Vế thứ nhất:</strong> "cung của bạn bị đổi" là hiểu nhầm. Cung tropical
                  không định nghĩa theo chòm sao, nên chuyện chòm sao nằm ở đâu không đụng tới nó — và{' '}
                  <strong>không cơ quan nào có thẩm quyền "đổi" một hệ quy ước</strong>.
                </li>
                <li>
                  <strong>Vế thứ hai:</strong> chính vì thế, đừng dùng lập luận trên để nâng cung
                  hoàng đạo lên thành khoa học.{' '}
                  <strong>Không cơ quan khoa học nào công nhận nó như một phép đo</strong> — nó là một
                  hệ quy ước theo mùa, và giá trị của nó nằm ở chỗ khác.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn: cung hoàng đạo nói được gì về bạn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Phần trên đã cho bạn một hệ đẹp và chặt chẽ. Nhưng "chặt chẽ" không đồng nghĩa với
                "đúng về con người" — và chỗ này cần nói thẳng, kể cả khi bạn quý chiêm tinh.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Bằng chứng: nghiên cứu nói gì
              </h3>
              <p>
                Nhiều nghiên cứu tâm lý đã kiểm tra xem ngày sinh có liên hệ với các nét tính cách đo
                được hay không, trong đó có cả những mẫu rất lớn và cả thử nghiệm{' '}
                <strong>mù đôi</strong> (người tham gia và người chấm đều không biết ai thuộc cung
                nào). Kết quả nhất quán:{' '}
                <strong>không tìm thấy liên hệ ổn định giữa ngày sinh và tính cách</strong>. Đây không
                phải chuyện "khoa học chưa đo tới" — nó đã được đo, và kết quả không ủng hộ.
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Vậy vì sao đọc mô tả cung vẫn thấy đúng?
              </h3>
              <p>
                Chủ yếu vì <strong>hiệu ứng Barnum</strong>: một mô tả đủ chung chung, đủ hai mặt thì
                gần như ai đọc cũng nhận ra mình trong đó. Thêm vào đó là thói quen tự nhiên của trí
                nhớ — ta ghi nhớ những lần mô tả "trúng" và quên những lần trật. Cộng thêm: khi đã
                biết mình thuộc cung nào, người ta có xu hướng đọc đời mình theo hướng khớp với mô tả
                đó.
              </p>
              <p>
                Còn một giới hạn thuần thống kê, dễ thấy hơn: cung Mặt Trời chia toàn bộ nhân loại
                thành <strong>đúng 12 nhóm theo tháng sinh</strong>. Chỉ riêng độ thô đó đã đủ cho
                thấy nó không thể mô tả một cá nhân. Ngay trong khung chiêm tinh, người ta cũng nói
                như vậy: cung Mọc và các vị trí khác — vốn phụ thuộc <strong>giờ và nơi sinh</strong>{' '}
                — mới làm nên khác biệt giữa hai người cùng cung, và đó là chuyện của{' '}
                <Link
                  href="/learn/chiem-tinh"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  bản đồ sao
                </Link>
                .
              </p>

              <h3 className="text-lg font-semibold text-foreground">
                Vậy đọc cung hoàng đạo thế nào cho lành mạnh
              </h3>
              <p>
                Cách dùng trung thực nhất là coi nó như <strong>một ngôn ngữ chung để nói về mình</strong>
                : 12 chân dung ngắn gọn, dễ nhớ, giúp bạn có từ để gọi tên những xu hướng vốn khó diễn
                đạt — và giúp hai người bắt đầu một cuộc trò chuyện thật về tính cách. Giá trị nằm ở{' '}
                <strong>câu hỏi mà nó gợi ra</strong>, không nằm ở câu trả lời mà nó tuyên bố.
              </p>
              <p>Ba lằn ranh nên giữ:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Đọc mô tả cung như một <strong>giả thuyết để tự soi</strong> ("mình có đúng vậy
                  không?"), không phải kết luận về mình.
                </li>
                <li>
                  Không dùng cung hoàng đạo để <strong>quyết định thay bạn</strong>: tuyển người, chọn
                  bạn đời, chốt việc lớn — những chuyện đó cần dữ kiện thật.
                </li>
                <li>
                  Không dùng nó để <strong>đóng khung người khác</strong> ("cung đó thì chắc chắn
                  thế"). Đó là lúc một hệ biểu tượng thú vị biến thành định kiến.
                </li>
              </ul>
              <p className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                Tinh thần của hieu.asia: trình bày phần thiên văn <strong>chính xác</strong>, trình
                bày phần biểu tượng <strong>minh bạch là biểu tượng</strong> — tham khảo để hiểu mình,
                không phán số mệnh và không bán "đổi vận".
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <CungHoangDaoWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <CungHoangDaoRecall />,
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
                Chưa chắc mình thuộc cung nào, hoặc sinh sát ranh giới?{' '}
                <Link
                  href="/cung-hoang-dao"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Tra cung theo ngày sinh miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/cung-hoang-dao', label: 'Tra cung hoàng đạo theo ngày sinh' },
                    { href: '/cung-hoang-dao/hop', label: 'Độ hợp 12 cung hoàng đạo' },
                    { href: '/ban-do-sao', label: 'Bản đồ sao (lá số chiêm tinh đầy đủ)' },
                    { href: '/thien-van', label: 'Thiên văn hôm nay' },
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
          children: <CungHoangDaoChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
