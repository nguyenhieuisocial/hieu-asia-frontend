/**
 * /learn/lich-am-duong — bài học về CHÍNH CUỐN LỊCH: âm dương lịch Việt Nam
 * hoạt động ra sao. Công cụ tương ứng: /lich-van-nien.
 *
 * GROUNDING — mọi quy tắc lịch pháp nêu trong bài đều là quy tắc code thật của
 * repo đang chạy; KHÔNG thêm quy tắc tính lịch nào ngoài các nguồn dưới đây:
 *   • src/lib/ngay-kieng-ky.ts — thuật toán đổi dương → âm (Hồ Ngọc Đức):
 *       `const TIMEZONE = 7` (lịch VN theo giờ ICT) · hằng số tuần trăng
 *       29.530588853 ngày · getSunLongitude() trả về INT(L/π·6) = chỉ số 12 cung
 *       30° trên hoàng đạo = 12 Trung khí · getLunarMonth11(): tháng 11 âm là
 *       tháng chứa Đông chí · getLeapMonthOffset(): tháng nhuận là tháng đầu tiên
 *       sau tháng 11 KHÔNG có Trung khí (hai sóc liên tiếp cùng một cung) · điều
 *       kiện có nhuận `b11 - a11 > 365` · lunarDay = dayNumber − monthStart + 1
 *       ⇒ tháng dài 29 hoặc 30 ngày tuỳ khoảng cách hai ngày sóc.
 *   • src/lib/gio-hoang-dao.ts — can chi NGÀY suy thẳng từ số ngày Julian:
 *       chi = (JDN + 1) % 12, can = (JDN + 9) % 10 ⇒ vòng 60 chạy liên tục.
 *   • src/app/lich-van-nien/page.tsx (FAQ công cụ) — "thuật toán thiên văn tính
 *     giờ ICT (UTC+7) theo kinh tuyến 105°E như lịch Việt Nam chính thống".
 *   • src/components/lich-van-nien/DayCard.tsx — DTO `lunarDate.isLeap` → nhãn
 *     "(nhuận)" trên thẻ ngày của công cụ.
 *
 * Mọi bảng ví dụ (năm nhuận, độ dài tháng, ngày Tết, can chi ngày) được TÍNH
 * bằng chính thuật toán trên ở múi giờ +7 — và +8 cho cột Trung Quốc — chứ không
 * chép từ nguồn ngoài. Ba hằng số thiên văn phổ thông được phép dùng: tuần trăng
 * 29,53 ngày · năm chí tuyến 365,2422 ngày · chu kỳ Meton 19 năm.
 *
 * PHÂN VAI (chống trùng nội dung): bài này CHỈ sở hữu bản thân cuốn lịch. Lớp
 * "ngày tốt – ngày xấu" thuộc /learn/trach-cat và các công cụ /xem-ngay,
 * /gio-hoang-dao, /ngay-kieng-ky — ở đây chỉ trỏ link, không dạy lại. 24 tiết khí
 * chi tiết dành cho bài riêng; ở đây chỉ nhắc Trung khí ở mức đủ giải thích nhuận.
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
import {
  LichAmDuongFrame,
  LichAmDuongDepth,
  LichAmDuongRecall,
  LichAmDuongChecklist,
  LichAmDuongWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Lịch Âm Dương — Vì sao có tháng nhuận, vì sao Tết lệch',
  description:
    'Lịch âm dương Việt Nam hoạt động thế nào: tháng theo Mặt Trăng, năm theo Mặt Trời, vì sao có tháng nhuận, vì sao Tết Việt đôi khi lệch Trung Quốc.',
  alternates: { canonical: 'https://hieu.asia/learn/lich-am-duong' },
};

// Bảng đối chiếu hai chu kỳ. Số liệu: tuần trăng 29,53 ngày là hằng số thuật
// toán đang dùng (29.530588853); năm chí tuyến 365,2422 ngày là hằng số thiên
// văn phổ thông. 12 × 29,530588853 = 354,3671 → chênh 10,8751 ngày.
const MOON_VS_SUN: { label: string; moon: string; sun: string }[] = [
  { label: 'Bám theo thiên thể nào', moon: 'Mặt Trăng — pha tròn khuyết', sun: 'Mặt Trời — vòng mùa trong năm' },
  { label: 'Chu kỳ gốc', moon: '1 tuần trăng ≈ 29,53 ngày', sun: '1 năm chí tuyến ≈ 365,2422 ngày' },
  { label: 'Đơn vị trên lịch', moon: 'Tháng 29 ngày (thiếu) hoặc 30 ngày (đủ)', sun: 'Năm 365 hoặc 366 ngày' },
  { label: 'Mốc bắt đầu', moon: 'Mùng 1 = ngày sóc (ngày không trăng)', sun: 'Ngày 1/1 — mốc quy ước hành chính' },
  { label: '12 đơn vị cộng lại', moon: '≈ 354,37 ngày', sun: '≈ 365,24 ngày' },
  { label: 'Nhìn lên trời kiểm chứng được gì', moon: 'Hình dạng Mặt Trăng đêm nay', sun: 'Mùa, độ dài ngày – đêm' },
  { label: 'Cách bù sai số', moon: 'Thêm hẳn một THÁNG nhuận (≈ 2–3 năm/lần)', sun: 'Thêm một NGÀY 29/2 (4 năm/lần)' },
];

// Ngày Tết (mùng 1 tháng Giêng) tính bằng thuật toán trong lib ở múi giờ +7.
// Cột "so với năm trước" cho thấy đúng nhịp lùi ~11 ngày rồi bật lại khi có nhuận.
const TET_DRIFT: { year: string; date: string; delta: string }[] = [
  { year: '2024', date: '10/02/2024', delta: '—' },
  { year: '2025', date: '29/01/2025', delta: 'Sớm hơn 12 ngày (năm âm 354 ngày)' },
  { year: '2026', date: '17/02/2026', delta: 'Muộn hơn 19 ngày (năm âm 384 ngày — có nhuận tháng 6)' },
  { year: '2027', date: '06/02/2027', delta: 'Sớm hơn 11 ngày (năm âm 354 ngày)' },
];

// Năm âm có tháng nhuận + nhuận tháng mấy — tính bằng thuật toán trong lib (+7).
// Đủ hai chu kỳ Meton liên tiếp để người đọc tự đếm ra "19 năm 7 nhuận":
// 2001–2019 có 7 năm nhuận, 2020–2038 cũng đúng 7.
const LEAP_YEARS: { year: string; month: string; note?: string }[] = [
  { year: '2001', month: 'Nhuận tháng 4' },
  { year: '2004', month: 'Nhuận tháng 2' },
  { year: '2006', month: 'Nhuận tháng 7' },
  { year: '2009', month: 'Nhuận tháng 5' },
  { year: '2012', month: 'Nhuận tháng 4' },
  { year: '2014', month: 'Nhuận tháng 9' },
  { year: '2017', month: 'Nhuận tháng 6', note: 'Hết chu kỳ 19 năm thứ nhất — vừa đúng 7 lần nhuận' },
  { year: '2020', month: 'Nhuận tháng 4', note: 'Cách 2001 đúng 19 năm, lại nhuận đúng tháng 4' },
  { year: '2023', month: 'Nhuận tháng 2', note: 'Cách 2004 đúng 19 năm, lại nhuận đúng tháng 2' },
  { year: '2025', month: 'Nhuận tháng 6' },
  { year: '2028', month: 'Nhuận tháng 5' },
  { year: '2031', month: 'Nhuận tháng 3' },
  { year: '2033', month: 'Nhuận tháng 11' },
  { year: '2036', month: 'Nhuận tháng 6', note: 'Hết chu kỳ 19 năm thứ hai — cũng đúng 7 lần nhuận' },
];

// Độ dài từng tháng âm của năm Ất Tỵ 2025 — tính từ khoảng cách hai ngày sóc
// liên tiếp. Dùng để cho thấy thiếu/đủ KHÔNG xen kẽ máy móc (ba tháng đủ liên
// tiếp ở cuối năm). Thứ tự: tháng 1 → tháng 11, tháng nhuận 6 nằm sau tháng 6.
const MONTHS_2025 = '30 · 29 · 30 · 29 · 29 · 30 · (nhuận 6) 29 · 30 · 29 · 30 · 30 · 30';

// Những năm Tết VN (+7) và Tết Trung Quốc (+8) rơi khác ngày — tính bằng cùng
// một thuật toán, chỉ đổi tham số múi giờ.
const TET_DIFF: { year: string; vn: string; cn: string; why: string }[] = [
  { year: '1968', vn: '29/01/1968', cn: '30/01/1968', why: 'Miền Bắc đã chuyển sang múi giờ +7 từ 1967 trong khi miền Nam còn dùng +8 — hai miền đón Tết Mậu Thân lệch nhau một ngày.' },
  { year: '1985', vn: '21/01/1985', cn: '20/02/1985', why: 'Lệch tròn MỘT THÁNG: tính theo +8 thì năm 1984 có thêm một tháng nhuận, làm số hiệu mọi tháng sau đó dịch đi một bậc.' },
  { year: '2007', vn: '17/02/2007', cn: '18/02/2007', why: 'Thời điểm sóc rơi sát nửa đêm giờ Việt Nam nên đã sang ngày hôm sau ở Bắc Kinh.' },
  { year: '2030', vn: '02/02/2030', cn: '03/02/2030', why: 'Lần lệch tiếp theo sắp tới, cũng do ngày sóc rơi hai bên ranh giới nửa đêm.' },
];

// Can chi ngày quanh giao thừa dương lịch + kiểm chứng chu kỳ 60 — tính bằng
// công thức trong lib/gio-hoang-dao.ts: chi = (JDN+1)%12, can = (JDN+9)%10.
const CAN_CHI_DEMO: { date: string; canChi: string; note: string }[] = [
  { date: '30/12/2025', canChi: 'Quý Dậu', note: 'Ngày thường, cuối năm dương' },
  { date: '31/12/2025', canChi: 'Giáp Tuất', note: 'Ngày cuối cùng của năm dương 2025' },
  { date: '01/01/2026', canChi: 'Ất Hợi', note: 'Sang năm dương mới — vòng can chi KHÔNG bắt đầu lại' },
  { date: '17/02/2026', canChi: 'Nhâm Tuất', note: 'Mùng 1 Tết Bính Ngọ — cũng không reset' },
  { date: '18/04/2026', canChi: 'Nhâm Tuất', note: 'Đúng 60 ngày sau mùng 1 Tết — vòng khép lại' },
];

// Cửa vào lớp 2 (phong tục) — bài này KHÔNG dạy lại, chỉ trỏ sang đúng địa chỉ.
const LAYER2_LINKS: { href: string; label: string; desc: string }[] = [
  { href: '/learn/trach-cat', label: 'Học Trạch Cát', desc: 'nền tảng của việc chọn ngày giờ: ngày hoàng đạo, 12 Trực, quy trình xem ngày.' },
  { href: '/xem-ngay', label: 'Xem ngày tốt', desc: 'chọn ngày phù hợp cho một việc cụ thể (cưới hỏi, khai trương, động thổ…).' },
  { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo', desc: '6 giờ tốt trong 12 canh giờ của một ngày.' },
  { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ', desc: 'Tam Nương, Nguyệt Kỵ và các ngày dân gian thường tránh.' },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Lịch âm dương là gì? Lịch Việt Nam có phải lịch âm không?',
    a: 'Lịch Việt Nam là âm dương lịch, không phải lịch âm thuần tuý. "Âm" ở chỗ mỗi tháng bắt đầu đúng vào ngày sóc (ngày không trăng) nên tháng luôn khớp với pha Mặt Trăng — mùng 1 không trăng, rằm trăng tròn. "Dương" ở chỗ hệ thống tháng nhuận neo năm âm vào vị trí Mặt Trời, giữ cho các tháng không trôi khỏi mùa. Lịch âm thuần tuý (như lịch Hồi giáo) bỏ phần thứ hai, nên tháng lễ của họ chạy khắp bốn mùa.',
  },
  {
    q: 'Vì sao Tết mỗi năm rơi vào một ngày dương lịch khác nhau?',
    a: 'Vì 12 tháng trăng chỉ dài khoảng 354,37 ngày, trong khi năm dương dài 365,2422 ngày — chênh gần 11 ngày. Nên nếu năm âm không có tháng nhuận, Tết năm sau sẽ đến sớm hơn khoảng 11–12 ngày so với năm trước; còn nếu năm âm có nhuận (13 tháng, khoảng 384 ngày) thì Tết bật ngược lại muộn hơn khoảng 18–19 ngày. Ví dụ: Tết 2024 rơi vào 10/02, Tết 2025 lùi về 29/01, rồi Tết 2026 nhảy tới 17/02 vì năm âm 2025 có nhuận tháng 6.',
  },
  {
    q: 'Tháng nhuận âm lịch được xác định thế nào?',
    a: 'Hai bước. Bước một, xác định năm đó có cần nhuận không: tháng âm chứa ngày Đông chí luôn là tháng 11; nếu khoảng cách giữa hai tháng 11 liên tiếp vượt quá 365 ngày thì năm ấy có 13 tháng, tức phải nhuận. Bước hai, chọn tháng nào: đường đi biểu kiến của Mặt Trời được chia thành 12 mốc gọi là Trung khí, cách nhau 30°. Bình thường mỗi tháng âm chứa đúng một Trung khí; trong năm 13 tháng sẽ có một tháng không chứa Trung khí nào — tháng đó được lấy làm tháng nhuận và mang tên tháng liền trước nó (vì thế mới có "nhuận tháng 6" chứ không có "tháng 13").',
  },
  {
    q: 'Bao lâu thì có một tháng nhuận? Chu kỳ 19 năm 7 nhuận nghĩa là gì?',
    a: 'Trung bình khoảng 2–3 năm một lần. Con số chính xác đến từ chu kỳ Meton: 19 năm dương dài khoảng 6939,60 ngày, còn 235 tuần trăng dài khoảng 6939,69 ngày — chỉ lệch chưa tới 0,1 ngày. Mà 235 = 19 × 12 + 7, nghĩa là trong 19 năm phải chèn thêm đúng 7 tháng nhuận thì lịch âm mới khớp lại với lịch dương. Đếm thử trên lịch Việt Nam giai đoạn 2020–2038 sẽ thấy đúng 7 năm có nhuận: 2020, 2023, 2025, 2028, 2031, 2033 và 2036.',
  },
  {
    q: 'Vì sao Tết Việt Nam có năm lệch Tết Trung Quốc một ngày?',
    a: 'Vì hai nước dùng hai múi giờ khác nhau để quy đổi. Lịch Việt Nam tính theo giờ ICT (UTC+7, kinh tuyến 105°Đ), lịch Trung Quốc tính theo giờ Bắc Kinh (UTC+8). Thời điểm sóc là một khoảnh khắc vật lý chung cho cả hành tinh, nhưng nếu nó rơi vào khoảng sau 23 giờ đêm giờ Việt Nam thì bên Trung Quốc đã sang ngày hôm sau — thế là mùng 1 được ghi vào hai ngày khác nhau. Tết 2007 là ví dụ: Việt Nam ngày 17/02, Trung Quốc ngày 18/02. Lần lệch tiếp theo rơi vào năm 2030.',
  },
  {
    q: 'Có phải chỉ lệch một ngày, hay có khi lệch nhiều hơn?',
    a: 'Có thể lệch tới một tháng. Ngoài chuyện lệch ngày sóc, múi giờ còn có thể làm lệch chỗ đặt tháng nhuận — khi đó toàn bộ số hiệu tháng phía sau dịch đi một bậc. Năm 1985 là ví dụ kinh điển: tính theo múi giờ +8 thì năm 1984 có một tháng nhuận mà lịch tính theo +7 không có, nên cùng một ngày sóc 21/01/1985, Việt Nam gọi là mùng 1 tháng Giêng (tức Tết) còn lịch Trung Quốc gọi là mùng 1 tháng Chạp; Tết bên đó lùi tới 20/02/1985. Cả hai đều không sai — lịch là hàm số của thiên văn và múi giờ.',
  },
  {
    q: 'Vì sao tháng âm lúc 29 ngày, lúc 30 ngày?',
    a: 'Vì một tuần trăng dài trung bình 29,53 ngày — không tròn ngày. Tháng âm bắt đầu ở một ngày sóc và kết thúc ngay trước ngày sóc kế tiếp, nên độ dài của nó là khoảng cách thật giữa hai ngày sóc: 29 ngày gọi là tháng thiếu, 30 ngày gọi là tháng đủ. Thiếu và đủ không xen kẽ theo quy luật cố định, vì quỹ đạo Mặt Trăng hình elip khiến tốc độ của nó thay đổi. Năm âm 2025 chẳng hạn có tới ba tháng đủ liên tiếp ở cuối năm.',
  },
  {
    q: 'Can chi ngày (Giáp Tý, Ất Sửu…) có bắt đầu lại vào đầu tháng hoặc đầu năm không?',
    a: 'Không. Can chi ngày chạy liên tục theo vòng 60 và không reset ở bất kỳ mốc nào — không reset ở mùng 1 âm lịch, không reset ở Tết, cũng không reset ở ngày 1/1 dương lịch. Nó được suy thẳng từ số ngày Julian, một số đếm ngày tăng đều một đơn vị mỗi ngày, nên mỗi ngày chỉ đơn giản nhích một bậc trong vòng 60. Kiểm chứng: 31/12/2025 là ngày Giáp Tuất thì 01/01/2026 là Ất Hợi; mùng 1 Tết 17/02/2026 là Nhâm Tuất, cộng đúng 60 ngày ra 18/04/2026 lại là Nhâm Tuất. Can chi năm và can chi tháng thì khác — chúng có mốc bắt đầu rõ ràng.',
  },
  {
    q: 'Năm có tháng nhuận có phải là năm xui hay năm đặc biệt không?',
    a: 'Không. Tháng nhuận thuần tuý là một thao tác kỹ thuật để bù khoảng 11 ngày chênh lệch giữa 12 tuần trăng và năm mặt trời, được kích hoạt bởi một phép so sánh: hai tháng 11 âm liên tiếp cách nhau hơn 365 ngày. Trung bình 19 năm có 7 lần như vậy — gần một phần ba số năm, quá thường xuyên để mang ý nghĩa lành dữ. Bản thân cuốn lịch là thiên văn và số học; những lớp ý nghĩa tốt – xấu gắn lên từng ngày là phong tục, thuộc một tầng hoàn toàn khác.',
  },
  {
    q: 'Lịch âm dương có chính xác không, hay chỉ là ước lượng dân gian?',
    a: 'Phần đổi lịch âm – dương là tính toán thiên văn thật, không phải ước lượng. hieu.asia tính vị trí Mặt Trăng và Mặt Trời theo giờ ICT (UTC+7) trên kinh tuyến 105°Đ như lịch Việt Nam chính thống. Điều đó cũng có nghĩa lịch âm không thể chép thuộc lòng thành một bảng cố định — nó phải được tính, và đó chính là việc mà một cuốn "lịch vạn niên" đúng nghĩa làm. Cần phân biệt: phần đổi lịch là khoa học; còn lớp ngày tốt – ngày xấu gắn thêm lên trên là quy ước phong tục để tham khảo.',
  },
];

const JSONLD = [
  article({
    headline:
      'Lịch âm dương Việt Nam: tháng theo Mặt Trăng, năm theo Mặt Trời, và bài toán tháng nhuận',
    description:
      'Cuốn lịch Việt Nam hoạt động ra sao: tháng âm theo chu kỳ Mặt Trăng 29,53 ngày, năm theo Mặt Trời, chênh 11 ngày mỗi năm nên phải có tháng nhuận (19 năm 7 nhuận). Vì sao Tết Việt Nam đôi khi lệch Trung Quốc, và vì sao can chi ngày chạy liên tục theo chu kỳ 60.',
    url: '/learn/lich-am-duong',
    type: 'TechArticle',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Lịch Âm Dương', url: '/learn/lich-am-duong' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Lịch Âm Dương — Cuốn lịch Việt Nam hoạt động thế nào',
    description:
      'Lịch âm dương Việt Nam hoạt động thế nào: tháng theo Mặt Trăng, năm theo Mặt Trời, vì sao có tháng nhuận, vì sao Tết Việt đôi khi lệch Trung Quốc.',
    url: '/learn/lich-am-duong',
  }),
];

/**
 * Bảng dữ liệu phẳng dùng chung cho 4 bảng trong bài (mọi ô đều là chữ thuần).
 * `muted` = chỉ số các cột render nhạt hơn (cột nhãn / cột ghi chú).
 */
function DataTable({
  head,
  rows,
  muted = [],
  minWidth,
}: {
  head: string[];
  rows: string[][];
  muted?: number[];
  minWidth: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-border bg-card/60">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2.5 font-semibold text-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="border-b border-border/60 last:border-b-0">
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`px-4 py-2 ${muted.includes(i) ? 'text-muted-foreground' : 'text-foreground'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LearnLichAmDuongPage() {
  return (
    <LearnArticle
      eyebrow="LỊCH PHÁP · ÂM DƯƠNG LỊCH"
      title={
        <>
          Lịch{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            Âm Dương
          </span>
        </>
      }
      standfirst={
        <>
          Người Việt sống cùng lúc với hai cuốn lịch — và cuốn lịch âm không hề huyền bí. Nó là một
          công trình thiên văn: tháng bám theo Mặt Trăng, năm bám theo Mặt Trời, và mọi thứ khó hiểu
          (tháng nhuận, Tết sớm Tết muộn, Tết lệch nước bạn) đều là hệ quả của một phép tính rất rõ
          ràng. Đây là bài khoa học nhất khu Học.
        </>
      }
      readMeta="11 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Lịch Âm Dương' },
      ]}
      relatedLenses={relatedLearnLenses('lich-am-duong')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Chọn một ngày dương lịch bất kỳ, Lịch Vạn Niên đổi sang ngày âm tương ứng (kèm nhãn “nhuận” nếu rơi vào tháng nhuận) và cho biết can chi của ngày hôm đó — đúng những phép tính bạn vừa đọc.',
        href: '/lich-van-nien',
        label: 'Mở Lịch Vạn Niên',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <LichAmDuongFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Âm dương lịch là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Cuốn lịch treo trên tường nhà bạn thật ra là <strong>hai cuốn lịch chồng lên nhau</strong>.
                Con số to màu đen là lịch dương (lịch Gregory) — thứ dùng để đi làm, đi học, ký hợp
                đồng. Con số nhỏ bên dưới là lịch âm — thứ dùng cho giỗ chạp, rằm, mùng một, và Tết.
              </p>
              <p>
                Điều nhiều người không biết: cuốn lịch nhỏ ấy <strong>không phải lịch âm thuần tuý</strong>.
                Tên gọi chính xác của nó là <strong>âm dương lịch</strong> (lunisolar calendar), vì nó
                dùng cả hai thiên thể cùng lúc:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Phần “âm”</strong> — mỗi <em>tháng</em> bắt đầu đúng vào ngày sóc, tức ngày mà
                  Mặt Trăng đi qua giữa Trái Đất và Mặt Trời nên hoàn toàn không nhìn thấy. Đó là lý do
                  mùng 1 không có trăng và rằm (15 âm) thì trăng tròn — không phải trùng hợp, mà là định
                  nghĩa.
                </li>
                <li>
                  <strong>Phần “dương”</strong> — mỗi <em>năm</em> được neo lại theo vị trí Mặt Trời
                  bằng cơ chế tháng nhuận, để tháng Giêng luôn ở mùa xuân và tháng bảy luôn ở mùa hè.
                </li>
              </ul>
              <p>
                Và đây là điều cần nói thẳng ngay từ đầu:{' '}
                <strong>bản thân cuốn lịch là thiên văn cộng số học, không phải bói toán</strong>. Việc
                đổi một ngày dương sang ngày âm là một phép tính có đáp án duy nhất, ai tính cũng ra như
                nhau — giống như đổi mét sang inch. Không có chỗ nào cho cảm nhận hay linh cảm.
              </p>
              <p>
                Vậy còn “ngày tốt ngày xấu”, “giờ hoàng đạo”, “12 trực” thì sao? Đó là một{' '}
                <strong>lớp phong tục được gắn thêm lên trên</strong> cuốn lịch, xuất hiện sau và thuộc
                phạm trù văn hoá tín ngưỡng chứ không phải thiên văn. Hai lớp này rất hay bị gộp làm một
                — bài này tách chúng ra, và chỉ nói về lớp thứ nhất. Lớp thứ hai có bài riêng:{' '}
                <Link href="/learn/trach-cat" className="text-gold-700 underline-offset-4 hover:underline">
                  Trạch Cát — cách chọn ngày giờ tốt
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
          children: <LichAmDuongDepth />,
        },
        {
          id: 'thang-am-va-nam-duong',
          tocLabel: 'Trăng vs Mặt Trời',
          heading: 'Tháng theo Mặt Trăng, năm theo Mặt Trời — và khoảng chênh 11 ngày',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mọi cuốn lịch trên thế giới đều phải giải một bài toán khó chịu:{' '}
                <strong>hai chiếc đồng hồ tự nhiên lớn nhất không ăn khớp với nhau</strong>.
              </p>
              <p>
                Mặt Trăng cho ta một đơn vị thời gian dễ quan sát nhất: từ ngày không trăng này tới ngày
                không trăng kế tiếp trung bình <strong>29,53 ngày</strong>. Mặt Trời cho ta đơn vị quan
                trọng nhất với nghề nông: một vòng bốn mùa dài <strong>365,2422 ngày</strong>. Vấn đề
                là 365,2422 không chia hết cho 29,53 — không có số nguyên nào của tháng trăng ghép vừa
                một năm mặt trời.
              </p>
              <DataTable
                head={['Tiêu chí', 'Tháng âm (Mặt Trăng)', 'Năm dương (Mặt Trời)']}
                rows={MOON_VS_SUN.map((r) => [r.label, r.moon, r.sun])}
                muted={[0]}
                minWidth="560px"
              />
              <p>
                Làm phép trừ ở hàng áp chót: <strong>365,24 − 354,37 = 10,88 ngày</strong>. Đó chính là
                “khoảng 11 ngày” mà bạn hay nghe. Mỗi năm âm 12 tháng lại tụt sau năm dương gần 11 ngày.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Nhìn thấy 11 ngày ấy trên ngày Tết
              </h3>
              <p>
                Không cần công thức — chỉ cần nhìn ngày Tết vài năm liên tiếp là thấy ngay nhịp trôi rồi
                bật lại:
              </p>
              <DataTable
                head={['Năm', 'Mùng 1 Tết (dương lịch)', 'So với năm trước']}
                rows={TET_DRIFT.map((r) => [r.year, r.date, r.delta])}
                muted={[2]}
                minWidth="520px"
              />
              <p>
                Đây là toàn bộ bí ẩn của câu “năm nay Tết muộn”. Không có năm nào Tết muộn hay Tết sớm
                một cách bất thường — chỉ có năm âm 12 tháng (354 ngày) và năm âm 13 tháng (384 ngày),
                xen kẽ nhau để giữ trung bình bám sát 365 ngày.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Tháng thiếu 29, tháng đủ 30 — không hề xen kẽ máy móc
              </h3>
              <p>
                Vì 29,53 không tròn ngày, lịch phải làm tròn: tháng chứa 29 ngày gọi là{' '}
                <strong>tháng thiếu</strong>, tháng chứa 30 ngày gọi là <strong>tháng đủ</strong>. Nhiều
                người tưởng thiếu – đủ luân phiên đều đặn, nhưng không: quỹ đạo Mặt Trăng hình elip nên
                tốc độ của nó thay đổi, khoảng cách thật giữa hai ngày sóc dao động quanh mức trung bình.
                Độ dài từng tháng của năm âm 2025, tính lần lượt từ tháng 1:
              </p>
              <p className="rounded-xl border border-border bg-card/40 px-4 py-3 font-mono text-sm text-foreground">
                {MONTHS_2025}
              </p>
              <p className="text-sm text-foreground/70">
                Để ý ba tháng đủ liên tiếp ở cuối năm (tháng 9, 10, 11) — một quy tắc xen kẽ máy móc
                không bao giờ tạo ra được như vậy. Đó là bằng chứng trực quan rằng lịch âm{' '}
                <strong>phải được tính bằng thiên văn</strong>, chứ không thể chép thành bảng thuộc
                lòng.
              </p>
            </div>
          ),
        },
        {
          id: 'thang-nhuan',
          tocLabel: 'Tháng nhuận',
          heading: 'Tháng nhuận: cách lịch trả lại 11 ngày đã vay',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mỗi năm thiếu gần 11 ngày. Sau ba năm là thiếu hơn 32 ngày — đủ cả một tháng. Nếu cứ để
                vậy, chỉ vài chục năm là Tết sẽ rơi vào giữa hè. Cách xử lý của âm dương lịch rất dứt
                khoát: <strong>chèn thêm hẳn một tháng</strong> vào năm đó. Năm ấy có 13 tháng, và tháng
                thêm vào mang <em>trùng tên</em> với tháng liền trước nó — nên ta có “nhuận tháng 6”,
                chứ không bao giờ có “tháng 13”.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bước 1 — Năm này có cần nhuận không?
              </h3>
              <p>
                Mốc neo là <strong>Đông chí</strong>, ngày Mặt Trời xuống thấp nhất. Tháng âm chứa ngày
                Đông chí luôn được gọi là <strong>tháng 11</strong>. Từ đó, quy tắc gọn như một câu:
              </p>
              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  Đếm khoảng cách giữa <strong>hai tháng 11 âm liên tiếp</strong>. Nếu khoảng cách đó{' '}
                  <strong>vượt quá 365 ngày</strong> thì giữa chúng có 13 tháng — năm ấy phải có một
                  tháng nhuận.
                </p>
              </div>
              <p>
                Con số thật: năm 2024 cho ra <strong>354 ngày</strong> (12 tháng, không nhuận), năm 2025
                cho ra <strong>384 ngày</strong> (13 tháng, phải nhuận), năm 2026 lại trở về 354 ngày.
                Không có ngoại lệ nào cần nhớ, chỉ một phép so sánh.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bước 2 — Nhuận vào tháng nào?
              </h3>
              <p>
                Đường đi biểu kiến của Mặt Trời quanh bầu trời (hoàng đạo) được chia thành{' '}
                <strong>12 mốc cách đều 30°</strong>, gọi là các <strong>Trung khí</strong> — Đông chí,
                Đại hàn, Vũ Thuỷ, Xuân phân… (Trung khí là một nửa của hệ 24 tiết khí; nửa còn lại nằm
                xen giữa và không tham gia vào việc đặt tháng nhuận.)
              </p>
              <p>
                Vì tháng trăng (29,53 ngày) <em>ngắn hơn</em> khoảng cách trung bình giữa hai Trung khí
                (khoảng 30,44 ngày), bình thường mỗi tháng âm “ôm” vừa một Trung khí. Nhưng trong năm 13
                tháng, sẽ có đúng một tháng lọt khe — <strong>không ôm được Trung khí nào</strong>. Quy
                tắc:
              </p>
              <div className="rounded-xl border border-gold/25 bg-gold/5 p-4">
                <p className="text-sm leading-relaxed text-foreground">
                  <strong>Tháng nhuận là tháng đầu tiên (sau tháng 11) không chứa Trung khí nào</strong>
                  , và nó lấy tên của tháng đứng ngay trước.
                </p>
              </div>
              <p>
                Đây là điểm đáng nói nhất của cả bài: quy tắc này{' '}
                <strong>hoàn toàn máy móc, không có chỗ cho ý kiến chủ quan</strong>. Không hội đồng
                nào bỏ phiếu, không thầy nào chọn. Cứ cho cùng một múi giờ, mọi người trên thế giới tính
                ra cùng một kết quả.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Bước 3 — Nhìn ra chu kỳ 19 năm 7 nhuận
              </h3>
              <p>
                Có một sự trùng hợp đẹp mà người Hy Lạp cổ (Meton) và các nhà lịch pháp phương Đông đều
                phát hiện ra: <strong>19 năm dương ≈ 6939,60 ngày</strong>, còn{' '}
                <strong>235 tuần trăng ≈ 6939,69 ngày</strong> — chỉ lệch chưa tới <strong>0,1 ngày</strong>,
                tức khoảng hai tiếng đồng hồ. Mà 235 = 19 × 12 + 7. Nói cách khác: cứ 19 năm thì phải
                chèn thêm <strong>đúng 7 tháng nhuận</strong> là hai cuốn lịch gặp lại nhau.
              </p>
              <p>Đếm thử trên chính lịch Việt Nam — hai chu kỳ 19 năm liên tiếp:</p>
              <DataTable
                head={['Năm âm', 'Tháng nhuận', 'Ghi chú']}
                rows={LEAP_YEARS.map((r) => [r.year, r.month, r.note ?? '—'])}
                muted={[2]}
                minWidth="520px"
              />
              <p>
                Từ 2001 đến 2019 có đúng 7 năm nhuận; từ 2020 đến 2038 cũng đúng 7. Và chu kỳ này chặt
                tới mức <strong>2001 nhuận tháng 4 thì 2020 (cách đúng 19 năm) cũng nhuận tháng 4</strong>;{' '}
                <strong>2004 nhuận tháng 2 thì 2023 cũng nhuận tháng 2</strong>. Không phải lúc nào cũng
                khớp tuyệt đối — phần lệch 0,1 ngày mỗi chu kỳ vẫn tích luỹ dần — nhưng đủ để thấy đây là
                một cơ chế có nhịp, không phải chuyện tuỳ hứng.
              </p>
              <p className="text-sm text-foreground/70">
                Hai ví dụ gần nhất để ghi nhớ: <strong>2023 nhuận tháng 2</strong> (năm Quý Mão có hai
                tháng 2 âm) và <strong>2025 nhuận tháng 6</strong> (năm Ất Tỵ có hai tháng 6 âm). Lần
                nhuận tiếp theo rơi vào năm 2028, nhuận tháng 5.
              </p>
            </div>
          ),
        },
        {
          id: 'mui-gio-va-tet-lech',
          tocLabel: 'Múi giờ & Tết lệch',
          heading: 'Rất Việt Nam: vì sao Tết ta đôi khi lệch Tết Trung Quốc',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đây là chỗ mà lịch Việt Nam <strong>khác thật sự</strong> với lịch Trung Quốc — và cũng
                là chỗ nhiều người tưởng nhầm rằng một trong hai bên tính sai.
              </p>
              <p>
                Quy tắc lịch pháp của hai nước gần như giống hệt nhau. Khác biệt nằm ở một tham số duy
                nhất: <strong>múi giờ dùng để quy đổi thời điểm thiên văn ra “ngày nào”</strong>. Lịch
                Việt Nam tính theo giờ ICT — <strong>UTC+7, kinh tuyến 105°Đ</strong>. Lịch Trung Quốc
                tính theo giờ Bắc Kinh — <strong>UTC+8</strong>.
              </p>
              <p>
                Thời điểm sóc (Mặt Trăng đi qua giữa Trái Đất và Mặt Trời) là một{' '}
                <strong>khoảnh khắc vật lý chung</strong> cho toàn hành tinh — nó không thuộc về nước
                nào. Nhưng để đưa lên lịch, ta phải hỏi: khoảnh khắc đó rơi vào <em>ngày</em> nào? Và
                câu trả lời phụ thuộc đồng hồ bạn đang nhìn. Nếu sóc xảy ra vào lúc 23 giờ 30 giờ Việt
                Nam, thì ở Bắc Kinh lúc ấy đã là 0 giờ 30 <em>ngày hôm sau</em>. Hai nước ghi mùng 1 vào
                hai ngày khác nhau — và Tết lệch.
              </p>
              <DataTable
                head={['Năm', 'Tết Việt Nam (+7)', 'Tết Trung Quốc (+8)', 'Vì sao']}
                rows={TET_DIFF.map((r) => [r.year, r.vn, r.cn, r.why])}
                muted={[3]}
                minWidth="620px"
              />
              <h3 className="text-lg font-semibold text-foreground">Hai kiểu lệch, hai quy mô</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Lệch một ngày</strong> — kiểu phổ biến, xảy ra khi thời điểm sóc rơi sát ranh
                  giới nửa đêm. Tết 2007 là ví dụ rõ nhất: Việt Nam 17/02, Trung Quốc 18/02. Lần lệch
                  tiếp theo là Tết 2030.
                </li>
                <li>
                  <strong>Lệch một tháng</strong> — kiểu hiếm nhưng ngoạn mục, xảy ra khi múi giờ làm{' '}
                  <em>lệch chỗ đặt tháng nhuận</em>, khiến toàn bộ số hiệu tháng phía sau dịch đi một
                  bậc. Năm 1985: cùng một ngày sóc 21/01/1985, lịch Việt Nam gọi là mùng 1 tháng Giêng
                  (Tết Ất Sửu) còn lịch Trung Quốc gọi là mùng 1 tháng Chạp — nên Tết bên đó mãi tới
                  20/02/1985 mới tới.
                </li>
              </ul>
              <p>
                Có một chi tiết lịch sử thú vị ngay trong nước: năm <strong>1968</strong>, miền Bắc đã
                chuyển sang múi giờ +7 còn miền Nam vẫn dùng +8, nên hai miền đón Tết Mậu Thân{' '}
                <strong>lệch nhau một ngày</strong> — 29/01 và 30/01. Cùng một bầu trời, cùng một Mặt
                Trăng, chỉ khác chiếc đồng hồ.
              </p>
              <p>
                Kết luận quan trọng: <strong>không bên nào sai</strong>. Lịch là một hàm số nhận vào
                thiên văn và múi giờ; đổi múi giờ thì đổi kết quả, đúng như đổi múi giờ thì đổi giờ trên
                đồng hồ. Và vì Việt Nam dùng +7, <strong>lịch Việt Nam là một cuốn lịch riêng</strong>,
                không phải bản sao của lịch Trung Quốc — một điều đáng để biết.
              </p>
            </div>
          ),
        },
        {
          id: 'can-chi-ngay',
          tocLabel: 'Can chi ngày',
          heading: 'Can chi ngày: chiếc đồng hồ 60 nhịp không bao giờ dừng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mở lịch vạn niên ra, bên cạnh ngày âm bạn sẽ thấy một cái tên kiểu “ngày Giáp Tý”, “ngày
                Ất Sửu”. Đó là <strong>can chi của ngày</strong> — và nó vận hành theo một logic tách
                biệt hẳn với tháng nhuận, thậm chí tách biệt với cả lịch âm.
              </p>
              <p>
                Hệ đếm: <strong>10 Thiên Can</strong> (Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm,
                Quý) ghép với <strong>12 Địa Chi</strong> (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân,
                Dậu, Tuất, Hợi). Không phải 120 tổ hợp mà chỉ <strong>60</strong> — vì can và chi luôn
                nhích cùng nhịp nên chỉ ghép được các cặp cùng chẵn hoặc cùng lẻ. 60 chính là bội chung
                nhỏ nhất của 10 và 12.
              </p>
              <p>
                Điều quan trọng nhất — và cũng là điều hay bị hiểu nhầm nhất:{' '}
                <strong>can chi NGÀY chạy liên tục, không bao giờ reset</strong>. Không reset ở mùng 1
                âm lịch, không reset ở giao thừa Tết, không reset ở ngày 1/1 dương lịch. Nó chỉ đơn giản
                nhích một bậc mỗi ngày, vòng qua 60 rồi lại bắt đầu — như một chiếc đồng hồ đếm ngày đã
                chạy từ rất lâu và chưa hề bị chỉnh.
              </p>
              <DataTable
                head={['Ngày dương', 'Can chi ngày', 'Ghi chú']}
                rows={CAN_CHI_DEMO.map((r) => [r.date, r.canChi, r.note])}
                muted={[2]}
                minWidth="560px"
              />
              <p>
                Cơ chế đằng sau đơn giản đến bất ngờ. Công cụ không hề tra tháng hay năm âm: nó lấy{' '}
                <strong>số ngày Julian</strong> — một số đếm ngày tăng đều đúng một đơn vị mỗi ngày kể
                từ một mốc rất xa trong quá khứ — rồi chia lấy phần dư cho 12 (ra chi) và cho 10 (ra
                can). Vì phép chia dư không quan tâm tới bất cứ ranh giới lịch nào, chuỗi can chi ngày
                tự động liên tục.
              </p>
              <p>
                Hệ quả thực tế đáng chú ý: <strong>tháng nhuận không làm can chi ngày ngắt quãng</strong>.
                Một năm âm có 13 tháng thì cũng chỉ là có thêm ngày, và mỗi ngày vẫn nhích đúng một bậc.
                Đây là điểm khác biệt cần nhớ so với <strong>can chi NĂM</strong> (Giáp Thìn, Ất Tỵ,
                Bính Ngọ…) — thứ có mốc bắt đầu hẳn hoi và đổi tên theo năm âm.
              </p>
              <p className="text-sm text-foreground/70">
                Muốn tự kiểm chứng chu kỳ 60, hãy mở{' '}
                <Link href="/lich-van-nien" className="text-gold-700 underline-offset-4 hover:underline">
                  Lịch Vạn Niên
                </Link>{' '}
                và tra hai ngày cách nhau đúng 60 ngày — can chi sẽ trùng khít.
              </p>
            </div>
          ),
        },
        {
          id: 'gioi-han',
          tocLabel: 'Ranh giới hai lớp',
          heading: 'Ranh giới: đâu là khoa học, đâu là phong tục',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nếu chỉ mang được một ý ra khỏi bài này, hãy mang ý sau:{' '}
                <strong>trên cùng một tờ lịch có hai lớp thông tin thuộc hai loại hoàn toàn khác nhau</strong>
                . Gộp chúng làm một là nguồn gốc của gần như mọi hiểu nhầm về lịch âm.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                  <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-emerald-500">Lớp 1 · Đo được</p>
                  <p className="mt-1.5 font-heading text-base font-semibold text-foreground">Bản thân cuốn lịch</p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                    <li>Ngày dương ↔ ngày âm</li>
                    <li>Tháng thiếu / tháng đủ, tháng nhuận</li>
                    <li>Can chi ngày, tháng, năm</li>
                    <li>Tiết khí, Đông chí, Trung khí</li>
                  </ul>
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground/80">
                    Đây là <strong>thiên văn và số học</strong>: có đáp án duy nhất, kiểm chứng được, ai
                    tính cũng ra như nhau (cùng một múi giờ).
                  </p>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-4">
                  <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-500">Lớp 2 · Quy ước</p>
                  <p className="mt-1.5 font-heading text-base font-semibold text-foreground">Ý nghĩa gắn thêm lên lịch</p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                    <li>Ngày hoàng đạo / hắc đạo</li>
                    <li>12 Trực, sao tốt – sao xấu</li>
                    <li>Việc nên làm, việc nên kiêng</li>
                    <li>Giờ hoàng đạo trong ngày</li>
                  </ul>
                  <p className="mt-2.5 text-sm leading-relaxed text-foreground/80">
                    Đây là <strong>phong tục</strong>: được truyền lại qua sách vở, có dị bản giữa các
                    nguồn, mang tính tham khảo — không phải đại lượng đo được.
                  </p>
                </div>
              </div>
              <p>
                Một dấu hiệu nhận biết dễ dùng: <strong>lớp 1 không có dị bản, lớp 2 thì có</strong>.
                Hỏi mười cuốn lịch xem 17/02/2026 là ngày âm nào, cả mười trả lời giống nhau. Hỏi mười
                cuốn lịch xem ngày đó tốt hay xấu, câu trả lời sẽ khác nhau — vì mỗi bản chọn lọc và
                diễn giải theo cách riêng.
              </p>
              <p>
                Bài này chỉ dạy lớp 1. Nếu bạn muốn tìm hiểu lớp 2 — với đúng tinh thần tham khảo, không
                phán định — thì đây là các cửa vào:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {LAYER2_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-gold-700 underline-offset-4 hover:underline">
                      {l.label}
                    </Link>{' '}
                    — {l.desc}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-foreground/70">
                Điều thú vị: lớp 2 <em>đứng được</em> là nhờ lớp 1. Muốn biết hôm nay là ngày Trực gì thì
                trước hết phải biết chính xác hôm nay là ngày âm nào, can chi gì — tức phải làm đúng phép
                tính thiên văn trước đã. Hiểu cuốn lịch là bước đầu tiên để đọc mọi thứ khác một cách
                tỉnh táo.
              </p>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <LichAmDuongWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <LichAmDuongRecall />,
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
                Muốn xem thử một ngày cụ thể đổi ra âm lịch là ngày nào, can chi gì?{' '}
                <Link
                  href="/lich-van-nien"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Mở Lịch Vạn Niên miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
                    { href: '/xem-ngay', label: 'Xem ngày tốt' },
                    { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
                    { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
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
          children: <LichAmDuongChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
