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
  TrachCatFrame,
  TrachCatDepth,
  TrachCatDepthTruc,
  TrachCatDepthSaoGio,
  TrachCatRecall,
  TrachCatChecklist,
  TrachCatWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Trạch Cát — Cách chọn ngày giờ tốt',
  description:
    'Trạch cát (擇吉) — cách chọn ngày giờ tốt cho việc lớn: cưới hỏi, động thổ, khai trương, xuất hành. Hiểu ngày hoàng đạo, 12 Trực, giờ tốt. Góc nhìn tham khảo.',
  alternates: { canonical: 'https://hieu.asia/learn/trach-cat' },
};

// 12 Trực — nhóm hợp/kỵ việc lớn theo phong tục (tham khảo, không phán). Hợp/kỵ
// từng trực đối chiếu tài liệu trạch cát; các bản lịch có dị bản nhỏ ở chi tiết.
const TRUC_LIST: { name: string; han: string; type: 'hop' | 'ky' | 'trung'; note: string }[] = [
  { name: 'Kiến', han: '建', type: 'trung', note: 'Kiến lập, khởi đầu — hợp khởi đầu, xuất hành; kỵ động thổ, an táng.' },
  { name: 'Trừ', han: '除', type: 'trung', note: 'Trừ bỏ cái cũ — hợp cúng lễ, chữa bệnh, dọn dẹp; kỵ khởi sự lớn.' },
  { name: 'Mãn', han: '滿', type: 'hop', note: 'Đầy đủ, viên mãn — hợp cầu tài, mở kho; kỵ kiện tụng, uống thuốc.' },
  { name: 'Bình', han: '平', type: 'trung', note: 'Bằng phẳng, ổn — hợp giao dịch, hoà giải, làm đường; không nổi trội cho đại sự như cưới hỏi.' },
  { name: 'Định', han: '定', type: 'hop', note: 'Ổn định, an bài — hợp ký hợp đồng, cưới hỏi, nhập trạch; kỵ kiện tụng, đi xa.' },
  { name: 'Chấp', han: '執', type: 'trung', note: 'Nắm giữ — hợp tạo lập, cất giữ, an táng; kỵ mở kho, giao dịch.' },
  { name: 'Phá', han: '破', type: 'ky', note: 'Phá vỡ, hao tán — hợp phá dỡ, chữa răng; kỵ hầu hết việc trọng đại.' },
  { name: 'Nguy', han: '危', type: 'ky', note: 'Nguy hiểm, chông chênh — nhìn chung thận trọng, kỵ leo cao, đi xa.' },
  { name: 'Thành', han: '成', type: 'hop', note: 'Thành tựu — hợp khai trương, ký kết, cưới hỏi, nhập học. Một trong các trực đẹp nhất.' },
  { name: 'Thu', han: '收', type: 'trung', note: 'Thu nạp — hợp thu hoạch, cầu tài, mua vào; kỵ an táng, xuất hành. (Có lịch ghi “Thâu”.)' },
  { name: 'Khai', han: '開', type: 'hop', note: 'Mở ra — hợp khai trương, xuất hành, khởi công, cưới hỏi; kỵ an táng.' },
  { name: 'Bế', han: '閉', type: 'ky', note: 'Đóng lại — hợp đắp đê, lấp hố, kết thúc việc; kỵ khởi sự mới, mở hàng.' },
];

const TRUC_DOT: Record<'hop' | 'ky' | 'trung', string> = {
  hop: 'bg-emerald-500',
  trung: 'bg-amber-500',
  ky: 'bg-rose-500',
};

const TRUC_LABEL: Record<'hop' | 'ky' | 'trung', string> = {
  hop: 'Hợp việc lớn',
  trung: 'Tuỳ việc',
  ky: 'Kỵ việc lớn',
};

// Sao tốt / xấu của NGÀY, gắn theo từng loại việc (lịch pháp cộng/trừ điểm).
// Chỉ dùng các sao trong tài liệu nguồn — không thêm sao ngoài nguồn.
const SAO_NGAY_TOT: { name: string; note: string }[] = [
  { name: 'Thiên Đức · Nguyệt Đức', note: 'Đức tinh che chở, hoá giải điều xấu — được xem là tốt cho hầu hết việc.' },
  { name: 'Thiên Hỷ', note: 'Chủ hỷ sự — mạnh nhất cho cưới hỏi, đính hôn, việc vui.' },
  { name: 'Tam Hợp · Lục Hợp', note: 'Chi ngày hợp với việc hoặc tuổi người làm — thêm phần thuận hoà.' },
  { name: 'Tài · Lộc', note: 'Chủ tiền tài — hợp khai trương, mở hàng, cầu tài.' },
];

const SAO_NGAY_XAU: { name: string; note: string }[] = [
  { name: 'Cô Thần · Quả Tú', note: 'Chủ cô quạnh — kỵ nhất cho cưới hỏi.' },
  { name: 'Lục Xung', note: 'Chi ngày xung với tuổi hoặc việc — điểm trừ để cân nhắc.' },
  { name: 'Tam Sát', note: 'Ba hướng/chi bị sát — thường tránh động thổ, khởi công theo hướng đó.' },
  { name: 'Đại Hao · Tiểu Hao', note: 'Chủ hao tài — đáng ngại nhất cho việc tiền bạc: khai trương, mua xe.' },
];

// 12 sao GIỜ — COPY name/good từ engine lib/gio-hoang-dao.ts (STARS), giữ đúng
// vòng cố định 6 tốt xen 6 xấu. Đây là bảng chân lý công cụ giờ hoàng đạo dùng.
const SAO_GIO_TOT: { name: string; note: string }[] = [
  { name: 'Thanh Long', note: 'Đại cát, may mắn toàn diện — hợp cưới hỏi, khởi công, khai trương, xuất hành.' },
  { name: 'Minh Đường', note: 'Được quý nhân phù trợ — hợp gặp đối tác, đàm phán, xin việc, giao dịch.' },
  { name: 'Kim Quỹ', note: 'Tài lộc, phúc đức — hợp việc tiền bạc, mở hàng, cầu tài, gia đạo.' },
  { name: 'Thiên Đức', note: 'Được che chở, hoá giải (còn gọi Bảo Quang) — hợp cầu an, lễ bái, việc cần bình an.' },
  { name: 'Ngọc Đường', note: 'Thanh quý, học hành hanh thông — hợp ký kết, học tập, thi cử, lập nghiệp.' },
  { name: 'Tư Mệnh', note: 'Thuận lợi, được hộ trì (ban ngày càng tốt) — hợp giấy tờ, đăng ký, buôn bán.' },
];

const SAO_GIO_XAU: { name: string; note: string }[] = [
  { name: 'Thiên Hình', note: 'Chủ hình thương, kiện tụng — nên tránh ký kết, phẫu thuật, xuất hành.' },
  { name: 'Chu Tước', note: 'Chủ khẩu thiệt, thị phi (hành Hỏa) — nên giữ lời khi ký kết, tranh luận.' },
  { name: 'Bạch Hổ', note: 'Chủ đao thương, hao tổn — nên cẩn trọng khi phẫu thuật, đi xa, việc hệ trọng.' },
  { name: 'Thiên Lao', note: 'Chủ giam hãm, ràng buộc — nên cân nhắc khi vay mượn, ký cam kết dài hạn.' },
  { name: 'Huyền Vũ', note: 'Chủ mất mát, tiểu nhân — nên cẩn trọng tiền bạc, giao dịch, đi xa.' },
  { name: 'Câu Trận', note: 'Chủ vướng mắc, dây dưa — nên tránh khởi công, di chuyển lớn, ký kết phức tạp.' },
];

// Nhị thập bát tú — 28 sao chia 4 phương, mỗi phương 7 tú (kiến thức thiên văn –
// lịch pháp chuẩn phổ biến). Cát/hung TỪNG tú KHÔNG liệt kê vì dị bản nhiều.
const NHI_THAP_BAT_TU: { huong: string; than: string; tu: string; dot: string }[] = [
  { huong: 'Đông', than: 'Thanh Long', tu: 'Giác · Cang · Đê · Phòng · Tâm · Vĩ · Cơ', dot: 'bg-emerald-500' },
  { huong: 'Bắc', than: 'Huyền Vũ', tu: 'Đẩu · Ngưu · Nữ · Hư · Nguy · Thất · Bích', dot: 'bg-sky-500' },
  { huong: 'Tây', than: 'Bạch Hổ', tu: 'Khuê · Lâu · Vị · Mão · Tất · Chuỷ · Sâm', dot: 'bg-amber-500' },
  { huong: 'Nam', than: 'Chu Tước', tu: 'Tỉnh · Quỷ · Liễu · Tinh · Trương · Dực · Chẩn', dot: 'bg-rose-500' },
];

// Sổ tay thuật ngữ — Hán-Việt → giải nghĩa ngắn (chống hộp đen thuật ngữ).
const GLOSSARY: { term: string; def: string }[] = [
  { term: 'Trạch cát (擇吉)', def: 'Chọn ngày và giờ tốt cho việc trọng đại. Nghĩa chữ: “chọn điều lành”.' },
  { term: 'Can – Chi (干支)', def: 'Hệ 10 Thiên Can và 12 Địa Chi ghép thành 60 tổ hợp, nền của lịch âm và mọi phép tính ngày giờ.' },
  { term: 'Thần sát', def: 'Hệ các sao tốt – xấu (hư cấu theo lịch pháp) ứng vào từng ngày, giờ; công cụ cộng/trừ điểm theo chúng.' },
  { term: 'Hoàng đạo / Hắc đạo (黃道 / 黑道)', def: 'Ngày hoặc giờ do sáu thiện thần (hoàng đạo – tốt) hay sáu ác thần (hắc đạo – nên thận trọng) cai quản.' },
  { term: 'Thập nhị Trực (十二建除)', def: 'Vòng 12 trực xoay theo ngày (Kiến, Trừ, Mãn… Bế), mỗi trực hợp hoặc kỵ một số loại việc.' },
  { term: 'Nhị thập bát tú (二十八宿)', def: '28 chòm sao quanh hoàng đạo, chia bốn phương, mỗi phương 7 tú; là lớp sao thứ ba khi xét ngày.' },
  { term: 'Canh giờ', def: 'Một trong 12 khung giờ trong ngày, mỗi khung hai tiếng, mang một địa chi (giờ Tý, Sửu…).' },
  { term: 'Giờ hoàng đạo', def: 'Trong 12 canh giờ của một ngày, 6 canh do sao hoàng đạo cai quản — được xem là giờ tốt.' },
  { term: 'Thanh Long (青龍)', def: 'Sao đứng đầu sáu sao hoàng đạo, chủ đại cát; giờ Thanh Long thường được chọn cho việc lớn nhất.' },
  { term: 'Thiên Hỷ', def: 'Sao ngày chủ hỷ sự — mạnh nhất cho cưới hỏi, việc vui.' },
  { term: 'Đại Hao / Tiểu Hao', def: 'Sao ngày chủ hao tài — đáng ngại nhất cho việc tiền bạc như khai trương, mua xe.' },
  { term: 'Tam Nương sát (三娘煞)', def: 'Tục kiêng các ngày âm lịch mùng 3, 7, 13, 18, 22, 27 cho việc trọng đại.' },
  { term: 'Nguyệt Kỵ (月忌)', def: 'Tục kiêng các ngày âm lịch mùng 5, 14, 23 cho việc lớn, xuất hành.' },
];

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Trạch cát là gì?',
    a: 'Trạch cát (擇吉, nghĩa là "chọn điều lành") là việc chọn ngày và giờ tốt cho các việc trọng đại như cưới hỏi, động thổ, nhập trạch, khai trương, xuất hành, ký kết hay an táng. Nền tảng của nó là lịch can–chi (âm lịch), ngũ hành sinh–khắc và hệ "thần sát" (sao tốt / sao xấu của từng ngày). Đây là một nét văn hoá phương Đông, mang tính tham khảo — không phải lời phán về số mệnh.',
  },
  {
    q: 'Ngày hoàng đạo là gì?',
    a: 'Theo lịch pháp, mỗi ngày ứng với một trong 12 vị thần trực nhật. Sáu vị thiện được gọi là ngày hoàng đạo (Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức/Bảo Quang, Ngọc Đường, Tư Mệnh) — được xem là ngày tốt để làm việc lớn. Sáu vị còn lại là ngày hắc đạo, thường kiêng khởi sự. Đây là khái niệm thần sát trong lịch pháp, không phải một hiện tượng thiên văn.',
  },
  {
    q: 'Ngày Tam Nương, Nguyệt Kỵ có cần kiêng thật không?',
    a: 'Tam Nương (mùng 3, 7, 13, 18, 22, 27) và Nguyệt Kỵ (mùng 5, 14, 23) là những ngày dân gian thường tránh khởi sự việc lớn. Đây là quy ước theo phong tục, mang ý nghĩa nhắc nhở thận trọng chứ không phải quy luật tất định. Nhiều gia đình tránh cho yên tâm và để hợp ý người thân; nhưng nếu buộc phải làm vào ngày đó, điều quan trọng nhất vẫn là sự chuẩn bị chu đáo, không phải bản thân con số ngày.',
  },
  {
    q: 'Giờ hoàng đạo tính thế nào?',
    a: 'Một ngày âm lịch chia thành 12 giờ (canh), mỗi giờ mang một địa chi. Từ địa chi của chính ngày đó, người ta suy ra 6 giờ là hoàng đạo (giờ tốt) và 6 giờ hắc đạo trong 12 canh. Vì thế "giờ tốt" thay đổi theo từng ngày. Bạn không cần nhớ quy tắc: công cụ giờ hoàng đạo tự tính khi bạn nhập ngày.',
  },
  {
    q: 'Có nhất thiết phải xem ngày mới làm việc lớn không?',
    a: 'Không bắt buộc. Trạch cát là một lựa chọn văn hoá, không phải nghĩa vụ. Xem ngày giúp bạn khởi sự chỉn chu, tránh trùng ngày kiêng theo phong tục, và an tâm hơn — nhất là khi việc liên quan tới nhiều người thân. Nhưng nếu điều kiện thực tế (lịch nghỉ, thời tiết, sức khoẻ) quan trọng hơn, thì chọn ngày thuận tiện và chuẩn bị tốt vẫn là điều hợp lý.',
  },
  {
    q: 'Xem ngày có bảo đảm may mắn không?',
    a: 'Không. Trạch cát giúp bạn an tâm và tránh trùng ngày kiêng theo phong tục, thể hiện sự chuẩn bị và tôn trọng — nhưng không bảo đảm thành công. Sự chuẩn bị, con người và năng lực mới là điều quyết định. Đây không phải bùa phép; hieu.asia trình bày để bạn tham khảo, không phán số mệnh và không bán lễ.',
  },
  {
    q: 'Ngày xấu có làm hỏng việc không?',
    a: 'Không tất định. Ngày "xấu" theo lịch pháp là một lời nhắc thận trọng theo phong tục, không phải bản án. Kết quả của một việc do sự chuẩn bị — con người, hàng hoá, dịch vụ, kế hoạch — quyết định, chứ không phải bản thân con số ngày. Nếu buộc phải làm vào ngày bị coi là xấu, bạn có thể chọn một giờ hoàng đạo trong ngày, chuẩn bị kỹ hơn và giữ tâm thế bình tĩnh. Đó mới là cách "hoá giải" thực tế, và cũng đúng tinh thần tham khảo, không hù doạ.',
  },
  {
    q: '12 Trực là gì?',
    a: '12 Trực (Thập nhị Trực) là vòng 12 "trực" xoay vần theo ngày: Kiến, Trừ, Mãn, Bình, Định, Chấp, Phá, Nguy, Thành, Thu, Khai, Bế. Tên mỗi trực gợi tính chất của ngày và loại việc thường hợp hay kỵ — ví dụ Định hợp ký kết, cưới hỏi; Khai hợp khai trương, xuất hành; Bế thì kỵ mở hàng, khởi sự mới. Trực rơi vào ngày nào phụ thuộc quan hệ giữa chi ngày và chi tháng. Đây là một trong nhiều lớp cùng xét khi chọn ngày, đọc như xu hướng tham khảo — không trực nào tốt cho mọi việc.',
  },
  {
    q: 'Vì sao lịch này nói ngày tốt, lịch kia nói ngày xấu?',
    a: 'Vì các bản lịch có dị bản. Cùng dựa trên truyền thống thần sát – 12 Trực – nhị thập bát tú, nhưng mỗi sách chọn lọc, đặt trọng số và diễn giải hơi khác nhau (thậm chí khác cả tên gọi, như "Thu" và "Thâu"). Điều này bình thường và không có nghĩa bản nào sai. Cách dùng lành mạnh là chọn theo một bản lịch nhất quán và bám theo nó, thay vì so nhiều nguồn rồi hoang mang. Quan trọng hơn cả bản lịch vẫn là sự chuẩn bị cho việc thật.',
  },
];

const JSONLD = [
  article({
    headline: 'Trạch Cát (擇吉): cách chọn ngày giờ tốt cho việc lớn — nền tảng cho người mới',
    description:
      'Trạch cát — chọn ngày & giờ tốt cho cưới hỏi, động thổ, khai trương, xuất hành: quy trình 3 lớp, ngày hoàng đạo, 12 Trực, ngày kiêng, giờ hoàng đạo. Góc nhìn tham khảo, không mê tín.',
    url: '/learn/trach-cat',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Trạch Cát', url: '/learn/trach-cat' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Trạch Cát — Cách chọn ngày giờ tốt',
    description:
      'Trạch cát (擇吉) — cách chọn ngày giờ tốt cho việc lớn: cưới hỏi, động thổ, khai trương, xuất hành. Hiểu ngày hoàng đạo, 12 Trực, giờ tốt. Góc nhìn tham khảo.',
    url: '/learn/trach-cat',
  }),
];

export default function LearnTrachCatPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · TRẠCH CÁT"
      title={
        <>
          Trạch Cát{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (擇吉)
          </span>
        </>
      }
      standfirst={
        <>
          Trạch cát là cách người xưa hệ thống hoá việc chọn thời điểm cho những việc trọng đại — cưới
          hỏi, động thổ, khai trương, xuất hành. Chọn một ngày giờ “thuận” để khởi đầu chỉn chu và trong
          lòng an tâm. Đây là một góc nhìn tham khảo theo phong tục — không phải lời hứa may mắn.
        </>
      }
      readMeta="8 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Trạch Cát' },
      ]}
      relatedLenses={relatedLearnLenses('trach-cat')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Cho biết việc bạn định làm (cưới hỏi, động thổ, khai trương, xuất hành…) và khoảng thời gian mong muốn, hệ thống gợi ý những ngày tốt kèm giờ hoàng đạo để bạn tham khảo.',
        href: '/xem-ngay',
        label: 'Xem ngày tốt cho việc của bạn',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <TrachCatFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Trạch cát là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                <strong>Trạch cát</strong> (擇吉, nghĩa là “chọn điều lành”) là việc chọn{' '}
                <strong>ngày và giờ tốt</strong> cho các việc trọng đại: cưới hỏi, động thổ / nhập
                trạch, khai trương, xuất hành, ký kết, an táng. Nền tảng của nó là{' '}
                <strong>lịch can–chi</strong> (âm lịch), <strong>ngũ hành sinh–khắc</strong> và hệ{' '}
                <strong>thần sát</strong> — các sao tốt / xấu ứng với từng ngày.
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Trạch cát là <strong>góc nhìn tham khảo theo phong tục</strong>, giúp bạn khởi sự chỉn
                  chu và an tâm hơn — không phải lời hứa thành công hay may mắn chắc chắn.
                </li>
                <li>
                  Chọn được ngày đẹp <strong>không</strong> thay cho sự chuẩn bị; ngày “xấu” cũng không
                  phải điều đáng sợ — con người và năng lực mới quyết định kết quả.
                </li>
              </ul>
              <p>
                Một điều quan trọng để giữ đúng tinh thần: đây không phải bùa phép, cũng không phải công
                cụ để hù doạ hay bán lễ. hieu.asia trình bày để bạn <strong>tham khảo</strong>, không
                phán số mệnh và <strong>không bán lễ</strong>.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <TrachCatDepth />,
        },
        {
          id: 'ba-lop-chon-ngay',
          tocLabel: '3 lớp chọn ngày',
          heading: '3 lớp chọn ngày: hợp tuổi → hợp việc → giờ đẹp',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Trạch cát nghe phức tạp, nhưng cách làm thực dụng có thể gói trong <strong>3 lớp</strong>{' '}
                theo thứ tự — đi từ người làm việc, tới loại việc, rồi mới tới giờ trong ngày.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Lớp 1 — Hợp tuổi</h3>
              <p>
                Trước hết xét <strong>người chủ sự</strong>: tránh những năm xung / hình / hại với con
                giáp của mình. Với việc cưới hỏi hay làm nhà, phong tục còn tránh các năm{' '}
                <strong>Kim Lâu, Hoang Ốc, Tam Tai</strong>. Đây là lớp “lọc thô” theo tuổi trước khi đi
                vào chi tiết ngày.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Lớp 2 — Hợp việc</h3>
              <p>
                Trong khoảng thời gian đã hợp tuổi, chọn <strong>ngày phù hợp với loại việc</strong>:
                đối chiếu ngày hoàng đạo, <strong>12 Trực</strong> và các sao (nhị thập bát tú) xem ngày
                đó hợp cưới hỏi, khai trương, động thổ hay xuất hành; đồng thời <strong>tránh các ngày
                kiêng</strong> phổ biến (Tam Nương, Nguyệt Kỵ…).
              </p>
              <h3 className="text-lg font-semibold text-foreground">Lớp 3 — Giờ đẹp</h3>
              <p>
                Cuối cùng, trong chính ngày đã chọn, chọn một <strong>giờ hoàng đạo</strong> (giờ tốt)
                để tiến hành nghi thức chính. Ba lớp lồng nhau như vậy giúp bạn có một mốc thời gian đã
                cân nhắc nhiều mặt.
              </p>
              <p className="text-sm text-foreground/70">
                Bạn không cần thuộc lòng các bảng: công cụ xem ngày tự đối chiếu khi bạn nhập loại việc,
                tuổi và khoảng thời gian mong muốn. Phần này chỉ để bạn hiểu vì sao một ngày được coi là
                “đẹp”, thay vì nhận một kết quả “hộp đen”.
              </p>
            </div>
          ),
        },
        {
          id: 'ngay-hoang-dao-12-truc',
          tocLabel: 'Hoàng đạo & 12 Trực',
          heading: 'Ngày Hoàng đạo & 12 Trực',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Có hai hệ quy chiếu hay dùng nhất khi xét một ngày. Thứ nhất là{' '}
                <strong>ngày hoàng đạo / hắc đạo</strong>: mỗi ngày ứng với một trong 12 vị thần trực
                nhật; 6 vị thiện tạo thành <strong>6 ngày hoàng đạo</strong> (Thanh Long, Minh Đường,
                Kim Quỹ, Thiên Đức/Bảo Quang, Ngọc Đường, Tư Mệnh) — ngày tốt; 6 vị còn lại là ngày{' '}
                <strong>hắc đạo</strong>, thường kiêng việc lớn.
              </p>
              <p>
                Cái hay nằm ở chỗ: cả 12 <strong>vị thần trực nhật</strong> ấy chính là vòng 12 sao thần
                mà bạn sẽ gặp lại ở lớp giờ. Sáu vị thiện — <strong>Thanh Long, Minh Đường, Kim Quỹ,
                Thiên Đức, Ngọc Đường, Tư Mệnh</strong> — làm nên ngày (và giờ) hoàng đạo. Sáu vị ác —{' '}
                <strong>Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao, Huyền Vũ, Câu Trận</strong> — làm nên
                ngày (và giờ) hắc đạo. Vị nào rơi vào đâu được sắp bằng một quy tắc “khởi Thanh Long”:
                xét ngày thì mốc khởi đổi theo <strong>tháng</strong>, xét giờ thì mốc khởi đổi theo{' '}
                <strong>chi của ngày</strong>. Bạn không cần thuộc quy tắc; chỉ cần biết đây là cùng một
                hệ thần sát, chỉ khác cấp áp dụng.
              </p>
              <p>
                Thứ hai là <strong>Thập nhị Trực</strong> (12 Trực) — 12 “trực” xoay vòng theo ngày, mỗi
                trực hợp hoặc kỵ một số loại việc. Đây là cách đọc nhanh xem một ngày nghiêng về khởi sự
                hay nên kiêng:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TRUC_LIST.map((t) => (
                  <div
                    key={t.name}
                    className="rounded-xl border border-border bg-card/40 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-2 w-2 rounded-full ${TRUC_DOT[t.type]}`}
                      />
                      <span className="font-heading text-base font-semibold text-foreground">
                        {t.name}
                      </span>
                      <span className="text-sm text-muted-foreground">{t.han}</span>
                    </div>
                    <p className="mt-0.5 text-[13px] uppercase tracking-wide text-muted-foreground">
                      {TRUC_LABEL[t.type]}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.note}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                Đây là mô tả truyền thống, hãy đọc như xu hướng tham khảo. Các bản lịch có dị bản nhỏ ở
                chi tiết hợp/kỵ và ngay ở tên gọi (“Thu” hay “Thâu”) — nên chọn theo một bản lịch nhất
                quán thay vì so nhiều nguồn. Muốn hiểu sâu hơn 12 Trực, xem ba độ sâu bên dưới:
              </p>
              <TrachCatDepthTruc />
            </div>
          ),
        },
        {
          id: 'sao-ngay-theo-viec',
          tocLabel: 'Sao ngày theo việc',
          heading: 'Sao ngày theo việc: một ngày hiếm khi tốt mọi việc',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ngoài hoàng đạo và Trực, lịch pháp còn cộng hoặc trừ điểm theo các{' '}
                <strong>sao tốt – xấu</strong> rơi vào ngày. Điều đáng nói: sao thường gắn với{' '}
                <strong>một loại việc cụ thể</strong>, không phải áp chung. Vì thế cùng một ngày có thể
                đẹp cho cưới hỏi nhưng lại vướng sao hao tài cho việc mở hàng — và{' '}
                <strong>một ngày hiếm khi tốt cho mọi việc</strong>.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    Sao tốt (cộng điểm)
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {SAO_NGAY_TOT.map((s) => (
                      <li key={s.name} className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">{s.name}.</span> {s.note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    Sao xấu (trừ điểm)
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {SAO_NGAY_XAU.map((s) => (
                      <li key={s.name} className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">{s.name}.</span> {s.note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-sm text-foreground/70">
                Cách đọc đúng là gắn sao với đúng việc: <strong>Thiên Hỷ</strong> mạnh nhất cho cưới
                hỏi, còn <strong>Đại/Tiểu Hao</strong> đáng ngại nhất cho việc tiền bạc. Bạn không cần
                tự tra: công cụ xem ngày đã cộng/trừ các sao này theo loại việc bạn chọn.
              </p>
            </div>
          ),
        },
        {
          id: 'ngay-kieng-pho-bien',
          tocLabel: 'Ngày kiêng phổ biến',
          heading: 'Những ngày kiêng phổ biến',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Song song với việc chọn ngày tốt, phong tục còn có một số ngày{' '}
                <strong>thường tránh khởi sự việc lớn</strong>. Biết chúng để chủ động né, nhưng cũng nên
                nhớ đây là quy ước văn hoá mang ý nhắc nhở thận trọng — không phải quy luật tất định.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tam Nương</strong> — mùng 3, 7, 13, 18, 22, 27 (âm lịch). Dân gian thường tránh
                  cưới hỏi, khởi công, xuất hành xa vào các ngày này.
                </li>
                <li>
                  <strong>Nguyệt Kỵ</strong> — mùng 5, 14, 23 (âm lịch). “Mùng năm, mười bốn, hăm ba” —
                  ngày được cho là dễ trục trặc, nên tránh việc trọng đại.
                </li>
                <li>
                  <strong>Sát Chủ</strong> — ngày kỵ theo từng tháng, quan niệm bất lợi cho người chủ sự;
                  thường tránh động thổ, xây cất, cưới hỏi.
                </li>
                <li>
                  <strong>Thọ Tử</strong> — ngày xấu theo tháng, dân gian tránh khởi sự và các việc quan
                  trọng.
                </li>
              </ul>
              <p>
                Giữ đúng tinh thần: nếu điều kiện thực tế buộc bạn làm vào một ngày “kiêng”, đừng quá lo.
                Sự chuẩn bị chu đáo quan trọng hơn nhiều so với bản thân con số ngày. Trạch cát là để{' '}
                <strong>an tâm và tôn trọng phong tục</strong>, không phải để sợ hãi.
              </p>
            </div>
          ),
        },
        {
          id: 'chon-gio-hoang-dao',
          tocLabel: 'Chọn giờ hoàng đạo',
          heading: 'Chọn giờ hoàng đạo',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Chọn được ngày rồi, lớp cuối là chọn <strong>giờ</strong>. Một ngày âm lịch chia thành{' '}
                <strong>12 giờ (canh)</strong>, mỗi giờ kéo dài hai tiếng đồng hồ và mang một địa chi
                (Tý, Sửu, Dần… Hợi). Từ <strong>địa chi của chính ngày đó</strong>, người ta suy ra{' '}
                <strong>6 giờ là hoàng đạo</strong> (giờ tốt) và 6 giờ hắc đạo trong 12 canh.
              </p>
              <p>
                Nghĩa là “giờ tốt” không cố định — nó <strong>đổi theo từng ngày</strong>. Việc chính
                (đón dâu, cắt băng khai trương, đặt viên gạch đầu tiên…) nên rơi vào một trong các giờ
                hoàng đạo của ngày.
              </p>
              <p className="text-sm text-foreground/70">
                Bạn không cần nhớ quy tắc suy giờ: công cụ giờ hoàng đạo tự tính khi bạn nhập ngày, và
                thường liệt kê sẵn các khung giờ tốt để bạn chọn khung thuận tiện nhất.
              </p>
            </div>
          ),
        },
        {
          id: 'muoi-hai-sao-gio',
          tocLabel: '12 sao giờ',
          heading: '12 sao giờ: vì sao cùng ngày có giờ tốt, giờ xấu',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Đằng sau “6 giờ hoàng đạo, 6 giờ hắc đạo” là một vòng 12 sao thần xếp lên 12 canh giờ,
                cố định theo thứ tự <strong>6 tốt xen 6 xấu</strong>. Mốc bắt đầu vòng đổi theo địa chi
                của ngày, nên bảng giờ tốt của mỗi ngày một khác — nhưng số lượng thì luôn cân: đúng 6
                giờ tốt, 6 giờ cần thận trọng. Đây chính là bảng mà công cụ giờ hoàng đạo dựa vào.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    6 sao hoàng đạo — giờ tốt
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {SAO_GIO_TOT.map((s) => (
                      <li key={s.name} className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">{s.name}.</span> {s.note}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/[0.04] p-4">
                  <p className="font-heading text-sm font-semibold text-foreground">
                    6 sao hắc đạo — giờ nên thận trọng
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {SAO_GIO_XAU.map((s) => (
                      <li key={s.name} className="text-sm leading-relaxed text-muted-foreground">
                        <span className="font-medium text-foreground">{s.name}.</span> {s.note}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="text-sm text-foreground/70">
                Nói thẳng để không hiểu sai: “giờ xấu” là lời nhắc thận trọng, không phải điềm tai hoạ
                chắc chắn — không có “giờ chết”. Bản chất rất đời: chọn lúc mình tỉnh táo, chỉn chu nhất
                để làm việc quan trọng. Ba độ sâu dưới đây giải thích vì sao vòng sao lại xoay như vậy:
              </p>
              <TrachCatDepthSaoGio />
            </div>
          ),
        },
        {
          id: 'nhi-thap-bat-tu',
          tocLabel: 'Nhị thập bát tú',
          heading: 'Nhị thập bát tú: lớp sao thứ ba',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Sau hoàng đạo và 12 Trực, lịch pháp còn một lớp thứ ba:{' '}
                <strong>nhị thập bát tú</strong> — 28 chòm sao mà thiên văn cổ chia bầu trời quanh
                hoàng đạo thành 28 phần. Chúng được xếp vào <strong>bốn phương</strong>, mỗi phương 7
                tú, ứng với bốn linh thần quen thuộc:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {NHI_THAP_BAT_TU.map((n) => (
                  <div key={n.huong} className="rounded-xl border border-border bg-card/40 p-4">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${n.dot}`} />
                      <span className="font-heading text-base font-semibold text-foreground">
                        Phương {n.huong}
                      </span>
                      <span className="text-sm text-muted-foreground">· {n.than}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{n.tu}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-foreground/70">
                Mỗi ngày ứng với một tú, xoay vòng đều đặn. Vì sao bài này{' '}
                <strong>không liệt kê cát/hung từng tú</strong>? Vì đây là chỗ dị bản nhiều nhất: các
                sách gán tú tốt/xấu, con vật và việc hợp khác nhau đáng kể, nên nếu chép một bảng cụ thể
                sẽ dễ mâu thuẫn với bản lịch bạn đang dùng. Vài tú có tên quen thuộc — như{' '}
                <strong>sao Giác</strong> (đứng đầu 28 tú), <strong>sao Bích</strong>,{' '}
                <strong>sao Đẩu</strong> — nhưng việc một tú “tốt” hay “xấu” cho việc gì thì hãy theo
                đúng lịch bạn tra, đừng trộn nguồn.
              </p>
            </div>
          ),
        },
        {
          id: 'vi-du-chon-ngay',
          tocLabel: 'Ví dụ chọn ngày',
          heading: 'Chọn ngày end-to-end: một ví dụ đám cưới',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Ghép các lớp lại cho dễ hình dung. Đây là một{' '}
                <strong>ví dụ giả định</strong> để minh hoạ quy trình, không phải hồ sơ thật của ai:
                một đôi muốn cưới trong khoảng nửa cuối năm.
              </p>
              <ol className="list-decimal space-y-3 pl-5">
                <li>
                  <strong>Lọc tuổi (lớp 1).</strong> Xem cô dâu có phạm{' '}
                  <Link href="/kim-lau" className="text-gold-700 underline-offset-4 hover:underline">
                    Kim Lâu
                  </Link>{' '}
                  năm đó không, và cả hai có ai vướng{' '}
                  <Link href="/tam-tai" className="text-gold-700 underline-offset-4 hover:underline">
                    Tam Tai
                  </Link>{' '}
                  không. Nếu phạm, cân nhắc dời sang năm thuận hơn. Có thể kiểm nhanh bằng công cụ{' '}
                  <Link
                    href="/xem-tuoi-cuoi"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    xem tuổi cưới
                  </Link>
                  . Đây là bước “lọc thô” theo tuổi.
                </li>
                <li>
                  <strong>Lọc việc (lớp 2).</strong> Trong khoảng thời gian đã hợp tuổi, tìm ngày{' '}
                  <strong>hoàng đạo</strong>, có <strong>Trực</strong> hợp cưới (Định, Thành, Khai), có
                  sao <strong>Thiên Hỷ</strong> càng quý, tránh <strong>Cô Thần – Quả Tú</strong> và
                  các ngày kiêng như Tam Nương, Nguyệt Kỵ.
                </li>
                <li>
                  <strong>Chọn giờ (lớp 3).</strong> Trong chính ngày đã chọn, đặt nghi thức chính (đón
                  dâu, trao nhẫn) vào một <strong>giờ hoàng đạo</strong> — Thanh Long hay Kim Quỹ chẳng
                  hạn — cho hợp không khí hỷ sự.
                </li>
              </ol>
              <p>
                Kết quả là một mốc thời gian đã cân nhắc nhiều mặt. Nhưng giữ đúng tinh thần: ngày tốt
                giúp mọi người <strong>an tâm và cùng chuẩn bị</strong>, còn một đám cưới hạnh phúc thì{' '}
                <strong>người trong cuộc</strong> mới là chính — sự thấu hiểu và vun đắp quan trọng hơn
                mọi con số ngày giờ.
              </p>
            </div>
          ),
        },
        {
          id: 'sach-vo-trach-cat',
          tocLabel: 'Sách vở của môn',
          heading: 'Sách vở của môn chọn ngày',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Những quy tắc trong bài không phải do ai tự nghĩ ra hôm nay. Các bộ sách trạch cát kinh
                điển như <strong>Hiệp Kỷ Biện Phương Thư</strong> (協紀辨方書) và{' '}
                <strong>Ngọc Hạp Thông Thư</strong> (玉匣通書) là nơi tổng hợp và hệ thống hoá thần sát,
                12 Trực, sao tốt – xấu; đến nay các nhà làm lịch vẫn tham chiếu chúng khi soạn lịch vạn
                niên.
              </p>
              <p className="text-sm text-foreground/70">
                Biết vậy để hiểu vì sao các bản lịch có chỗ giống, chỗ khác nhau — chúng dựa trên cùng
                một truyền thống nhưng chọn lọc và diễn giải hơi khác. hieu.asia trình bày phần lõi phổ
                biến để bạn tham khảo, không khẳng định một bản nào là “chuẩn duy nhất”.
              </p>
            </div>
          ),
        },
        {
          id: 'giai-han-va-gioi-han',
          tocLabel: 'Trạch cát giúp gì',
          heading: 'Giới hạn — trạch cát giúp gì, không giúp gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Xem ngày là một nét văn hoá đẹp: chọn một mốc thời gian tử tế cho việc lớn thể hiện{' '}
                <strong>sự chuẩn bị và tôn trọng</strong> — với việc, với gia đình, với những người cùng
                tham gia. Nhiều gia đình xem ngày để mọi người cùng an tâm và thu xếp lịch quanh một mốc
                chung. Tôn trọng điều đó, nhưng cũng nên hiểu đúng:{' '}
                <strong>hieu.asia không bán lễ</strong> và không cho rằng phải “giải” gì mới yên.
              </p>
              <p>Trạch cát <strong>giúp</strong> bạn:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Đồng bộ nhịp sinh hoạt</strong>: có một mốc thời gian rõ ràng để mọi người
                  cùng chuẩn bị và sắp lịch quanh nó.
                </li>
                <li>
                  <strong>An tâm về mặt tâm lý</strong>: khởi sự với cảm giác đã chuẩn bị chu đáo, đúng
                  phong tục, đỡ lăn tăn về sau.
                </li>
                <li>
                  <strong>Tránh trùng ngày kiêng</strong> theo phong tục, để không phải áy náy với người
                  thân lớn tuổi.
                </li>
              </ul>
              <p>Nhưng trạch cát <strong>không</strong>:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Không bảo đảm thành công hay may mắn.</strong> Sự chuẩn bị, con người và năng
                  lực mới quyết định kết quả — ngày đẹp không làm thay việc đó.
                </li>
                <li>
                  Không phải bùa phép, không đo được nhân quả theo nghĩa khoa học; nó là{' '}
                  <strong>khung nhắc nhở văn hoá</strong>, không phải chẩn đoán.
                </li>
                <li>
                  Không nên trở thành lý do <strong>trì hoãn hay lo sợ</strong>: gặp ngày “xấu” chỉ nghĩa
                  là cân nhắc thêm, tuyệt đối không phải điều đáng sợ.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'so-tay-thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p className="text-sm text-foreground/70">
                Những từ Hán-Việt hay gặp khi đọc lịch, gom lại để bạn tra nhanh.
              </p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {GLOSSARY.map((g) => (
                  <div key={g.term} className="rounded-xl border border-border bg-card/40 p-4">
                    <dt className="font-heading text-sm font-semibold text-foreground">{g.term}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{g.def}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <TrachCatWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <TrachCatRecall />,
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
                Muốn tìm ngày tốt cho việc sắp làm?{' '}
                <Link
                  href="/xem-ngay"
                  className="text-gold-700 underline-offset-4 hover:underline"
                >
                  Xem ngày tốt miễn phí →
                </Link>
              </p>
              <div className="mt-6">
                <RelatedTools
                  links={[
                    { href: '/xem-ngay', label: 'Xem ngày tốt cho việc của bạn' },
                    { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
                    { href: '/ngay-kieng-ky', label: 'Ngày kiêng kỵ' },
                    { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
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
          children: <TrachCatChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
