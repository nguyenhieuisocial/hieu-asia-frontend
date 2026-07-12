import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, course, faqPage } from '@/lib/seo/jsonld';
import {
  HopTuoiFrame,
  HopTuoiDepth,
  HopTuoiRecall,
  HopTuoiChecklist,
  HopTuoiWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'Hợp tuổi 12 con giáp — Tam Hợp, Lục Hợp & Xung',
  description:
    'Hợp tuổi (12 con giáp) theo Can Chi: Tam Hợp, Lục Hợp, Lục Xung, Lục Hại và mệnh nạp âm. Góc nhìn tham khảo, dung hòa — không phán số mệnh, không kiêng kỵ.',
  alternates: { canonical: 'https://hieu.asia/learn/hop-tuoi' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Hợp tuổi (12 con giáp) là gì?',
    a: 'Là cách đối chiếu Can Chi năm sinh của hai (hoặc nhiều) người để xem họ có "nhịp" dễ phối hợp hay không. Nó dựa trên hệ Thiên Can – Địa Chi của lịch pháp Á Đông: mỗi năm gắn một con giáp (Địa Chi), một Can và một mệnh nạp âm. Đây là khung trò chuyện tham khảo, không phải phán quyết số mệnh.',
  },
  {
    q: 'Tam Hợp, Lục Hợp khác nhau thế nào?',
    a: 'Tam Hợp là ba con giáp cách nhau đều 4 ngôi, hội tụ thành một cục ngũ hành (Thân–Tý–Thìn = Thủy, Dần–Ngọ–Tuất = Hỏa, Tỵ–Dậu–Sửu = Kim, Hợi–Mão–Mùi = Mộc) — quan hệ hợp mạnh, dễ cùng hướng. Lục Hợp là sáu cặp con giáp bổ trợ nhau, gợi ý sự cân bằng điểm mạnh – điểm yếu. Cả hai đều là tín hiệu tích cực nhưng vẫn cần vun đắp.',
  },
  {
    q: '"Xung tuổi" có phải là điều xấu không?',
    a: 'Không. "Xung" chỉ gợi ý hai nhịp sống hoặc cách phản ứng khác nhau, nên đôi khi dễ va quan điểm. Thực tế rất nhiều cặp "xung" lại rất bền, vì khác biệt đúng cách trở thành bổ sung (người tiến – người giữ, người nóng – người nguội). Cách hóa giải lành mạnh là chủ động hiểu nhau và nhường nhịn đúng lúc, không phải kiêng nhau hay làm lễ giải.',
  },
  {
    q: 'Lục Hại là gì và có đáng lo không?',
    a: 'Lục Hại là sáu cặp con giáp dễ hiểu lầm, lệch kênh giao tiếp — đôi khi "tốt với nhau mà không được ghi nhận". Lực của nó nhẹ hơn Lục Xung, kiểu khó chịu là âm ỉ chứ không bùng nổ. Hướng lành mạnh là giao tiếp rõ ràng, kiên nhẫn và nói thẳng kỳ vọng. Đây không phải lời khuyên "tránh nhau".',
  },
  {
    q: 'Mệnh nạp âm là gì, khác con giáp ra sao?',
    a: 'Mỗi cặp Can-Chi trong vòng 60 năm (Lục Thập Hoa Giáp) mang một "tên mệnh" và một hành nạp âm (ví dụ Giáp Tý là Hải Trung Kim). Đây là lớp ngũ hành theo năm sinh, dùng để xét tương sinh – tương khắc giữa hai mệnh, song song với lớp con giáp. Có trường phái xét theo nạp âm, có trường phái xét theo chính ngũ hành của con giáp — nên khi luận cần nói rõ đang xét theo lớp nào.',
  },
  {
    q: 'Vì sao con giáp thứ 4 là Mèo chứ không phải Thỏ?',
    a: 'Ở Việt Nam, Chi Mão tương ứng con Mèo; ở Trung Quốc và hầu hết các nước Á Đông là con Thỏ. Đây là khác biệt văn hóa, không phải đúng hay sai. Tài liệu cho người Việt dùng "Mèo", có thể chú thích tương ứng con Thỏ trong lịch Trung Hoa.',
  },
  {
    q: 'Hai tuổi "khắc" nhau thì có nên cưới hoặc làm ăn không?',
    a: 'Có chứ. Con giáp chỉ là một lát cắt rất nhỏ — chia loài người thành vỏn vẹn 12 nhóm theo năm sinh. Tình yêu, sự nghiệp được quyết định bởi thiện chí, giao tiếp, giá trị chung và năng lực thật, chứ không phải bởi tuổi. Nếu một cặp rơi vào nhóm "cần lưu ý", hãy hiểu đó là gợi ý cần thấu hiểu nhiều hơn, kèm hướng dung hòa bằng thái độ — không kiêng kỵ, không hoãn cưới, không đổi tuổi.',
  },
  {
    q: 'Xem hợp tuổi theo con giáp có chính xác không?',
    a: 'Nó rất thô vì chỉ dùng năm sinh. Lá số đầy đủ (Bát Tự hoặc Tử Vi) dùng cả năm – tháng – ngày – giờ cùng yếu tố con người nên chi tiết và đáng tin hơn nhiều. Hãy xem hợp tuổi như một khung trò chuyện vui, và xem lá số đầy đủ nếu muốn tìm hiểu sâu hơn.',
  },
  {
    q: 'Tam Hợp có cấu trúc "Sinh – Vượng – Mộ" nghĩa là gì?',
    a: 'Mỗi nhóm Tam Hợp gồm ba ngôi ứng với ba giai đoạn của một hành: Trường Sinh (khởi đầu) → Đế Vượng (đỉnh cao) → Mộ Khố (thu giữ). Ví dụ Thủy cục: Thân là Trường Sinh của Thủy, Tý là Đế Vượng, Thìn là Mộ. Ba ngôi nâng nhau theo mạch "khởi đầu – cao trào – kết tinh" nên bổ trợ tự nhiên. Nếu chỉ có 2/3 con giáp trong nhóm (bán Tam Hợp) thì vẫn hợp nhưng lực nhẹ hơn.',
  },
  {
    q: 'Tương Hình và Thiên Can ngũ hợp là gì, công cụ hợp tuổi có tính không?',
    a: 'Tương Hình là tầng "cọ xát nội tại" trong canon (bốn loại: Vô Ân, Trì Thế, Vô Lễ, Tự Hình), còn Thiên Can ngũ hợp là năm cặp Thiên Can hợp hoá (Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý). Đây là kiến thức nền để hiểu trọn hệ Can Chi. Công cụ hợp tuổi của hieu.asia hiện chỉ xét con giáp (Địa Chi) và phân theo sáu nhóm quan hệ, chưa tính hai lớp này — chúng tôi nêu ở đây cho đầy đủ, không phải để bạn phải lo thêm.',
  },
];

const JSONLD = [
  article({
    headline: 'Hợp tuổi (12 con giáp): nền tảng Can Chi cho người mới',
    description:
      'Hợp tuổi (12 con giáp) theo Can Chi: Tam Hợp, Lục Hợp, Lục Xung, Lục Hại và mệnh nạp âm. Góc nhìn tham khảo, dung hòa — không phán số mệnh.',
    url: '/learn/hop-tuoi',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Hợp tuổi (12 con giáp)', url: '/learn/hop-tuoi' },
  ]),
  faqPage(FAQS),
  course({
    name: 'Hợp tuổi 12 con giáp — Tam Hợp, Lục Hợp & Xung',
    description:
      'Hợp tuổi (12 con giáp) theo Can Chi: Tam Hợp, Lục Hợp, Lục Xung, Lục Hại và mệnh nạp âm. Góc nhìn tham khảo, dung hòa — không phán số mệnh, không kiêng kỵ.',
    url: '/learn/hop-tuoi',
  }),
];

/**
 * Tính cách 12 con giáp (xu hướng tham khảo) — mỗi con một dòng, giọng hai mặt
 * (điểm mạnh + điểm cần lưu ý), bám tri thức nguồn. slug trỏ sang trang bách khoa
 * con /learn/con-giap/[slug]. (Tỵ = slug "ti"; Mão hiển thị "Mão (Mèo)".)
 */
const CHI_TRAITS: { slug: string; ten: string; trait: string }[] = [
  { slug: 'ty', ten: 'Tý', trait: 'nhanh nhạy, quan sát tốt, xoay xở khéo; lưu ý dễ ôm nhiều việc nên cần chọn ưu tiên.' },
  { slug: 'suu', ten: 'Sửu', trait: 'bền bỉ, kiên định, đáng tin với cam kết dài hạn; lưu ý đôi khi hơi cứng nhắc.' },
  { slug: 'dan', ten: 'Dần', trait: 'mạnh mẽ, dám mở đường, truyền cảm hứng; lưu ý cần giữ nhịp để không đốt sức.' },
  { slug: 'mao', ten: 'Mão (Mèo)', trait: 'tinh tế, ôn hòa, giỏi giữ hòa khí; lưu ý ngại va chạm nên hay trì hoãn việc khó.' },
  { slug: 'thin', ten: 'Thìn', trait: 'tầm nhìn, tự tin, hợp dẫn dắt; lưu ý cá tính mạnh nên cần lắng nghe.' },
  { slug: 'ti', ten: 'Tỵ', trait: 'sâu sắc, điềm tĩnh, trực giác tốt; lưu ý kín đáo nên cần chủ động chia sẻ.' },
  { slug: 'ngo', ten: 'Ngọ', trait: 'nhiệt tình, phóng khoáng, thích tự do; lưu ý nhịp nhanh nên cần chỗ nghỉ.' },
  { slug: 'mui', ten: 'Mùi', trait: 'hiền hòa, biết quan tâm, tạo cảm giác an toàn; lưu ý cả nể nên cần giữ ranh giới.' },
  { slug: 'than', ten: 'Thân', trait: 'linh hoạt, thông minh, sáng tạo giải pháp; lưu ý hiếu động nên dễ phân tán.' },
  { slug: 'dau', ten: 'Dậu', trait: 'cẩn thận, kỷ luật, chú trọng chi tiết; lưu ý tiêu chuẩn cao nên dễ khắt khe.' },
  { slug: 'tuat', ten: 'Tuất', trait: 'trung thực, trách nhiệm, bảo vệ người mình tin; lưu ý giàu nguyên tắc nên dễ căng thẳng.' },
  { slug: 'hoi', ten: 'Hợi', trait: 'chân thành, rộng lượng, dễ chịu; lưu ý lạc quan nên cần cân nhắc kỹ khi cam kết hay chi tiêu.' },
];

/**
 * 30 nạp âm của vòng 60 Hoa Giáp, gộp theo hành (mỗi hành 6 nạp âm). Mỗi tên nạp
 * âm ứng 2 năm Can-Chi liền nhau nên phủ đủ 60 năm. Bám bảng tri thức nguồn §7.1
 * (chỉ dùng tên + hành; KHÔNG tự bịa thứ tự Can-Chi cho từng nạp âm).
 */
const NAP_AM_GROUPS: { hanh: string; items: string[] }[] = [
  {
    hanh: 'Kim',
    items: ['Hải Trung Kim', 'Kiếm Phong Kim', 'Bạch Lạp Kim', 'Sa Trung Kim', 'Kim Bạch Kim', 'Thoa Xuyến Kim'],
  },
  {
    hanh: 'Mộc',
    items: ['Đại Lâm Mộc', 'Dương Liễu Mộc', 'Tùng Bách Mộc', 'Bình Địa Mộc', 'Tang Đố Mộc', 'Thạch Lựu Mộc'],
  },
  {
    hanh: 'Thủy',
    items: ['Giản Hạ Thủy', 'Tuyền Trung Thủy', 'Trường Lưu Thủy', 'Thiên Hà Thủy', 'Đại Khê Thủy', 'Đại Hải Thủy'],
  },
  {
    hanh: 'Hỏa',
    items: ['Lô Trung Hỏa', 'Sơn Đầu Hỏa', 'Tích Lịch Hỏa', 'Sơn Hạ Hỏa', 'Phú Đăng Hỏa', 'Thiên Thượng Hỏa'],
  },
  {
    hanh: 'Thổ',
    items: ['Lộ Bàng Thổ', 'Thành Đầu Thổ', 'Ốc Thượng Thổ', 'Bích Thượng Thổ', 'Đại Dịch Thổ', 'Sa Trung Thổ'],
  },
];

export default function LearnHopTuoiPage() {
  return (
    <LearnArticle
      eyebrow="ĐÔNG PHƯƠNG · CAN CHI"
      title={
        <>
          Hợp tuổi{' '}
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            (12 con giáp)
          </span>
        </>
      }
      standfirst={
        <>
          "Hợp tuổi" là cách đối chiếu Can Chi năm sinh của hai người để xem họ có
          dễ bắt nhịp hay không. Đây là một lát cắt tham khảo nhỏ — không phải lời
          phán về số mệnh.
        </>
      }
      readMeta="8 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Hợp tuổi (12 con giáp)' },
      ]}
      relatedLenses={relatedLearnLenses('hop-tuoi')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Nhập năm sinh của hai người, hệ thống đối chiếu con giáp và mệnh nạp âm, cho biết cặp thuộc nhóm quan hệ nào kèm gợi ý dung hòa lành mạnh.',
        href: '/hop-tuoi',
        label: 'Xem hợp tuổi',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <HopTuoiFrame />,
        },
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Hợp tuổi là gì — và KHÔNG là gì',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                "Hợp tuổi" trong dân gian Việt là cách đối chiếu{' '}
                <strong>Can Chi năm sinh</strong> của hai (hoặc nhiều) người để
                xem họ có "nhịp" dễ phối hợp hay không. Nó dựa trên hệ{' '}
                <strong>Thiên Can – Địa Chi</strong> (天干地支) của lịch pháp Á
                Đông, gắn mỗi năm với một <strong>con giáp</strong> (Địa Chi),
                một <strong>Can</strong> và một <strong>mệnh nạp âm</strong> (ngũ
                hành của năm).
              </p>
              <p>Cần phân biệt rõ ngay từ đầu:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hợp tuổi theo con giáp</strong> chỉ dùng năm sinh nên
                  rất thô — chỉ chia loài người thành 12 nhóm. Nó hữu ích như một
                  "khung trò chuyện", không phải phán quyết.
                </li>
                <li>
                  <strong>Lá số đầy đủ</strong> (Bát Tự / Tử Vi) dùng cả năm –
                  tháng – ngày – giờ cùng yếu tố con người nên chi tiết và đáng
                  tin hơn nhiều.
                </li>
              </ul>
              <p>
                Một điều quan trọng để giữ đúng tinh thần: đây không phải công cụ
                để khuyên ai "đừng cưới / đừng hợp tác / đừng sinh con năm X". Nếu
                một cặp rơi vào nhóm "cần lưu ý", hãy hiểu đó là gợi ý{' '}
                <strong>cần thấu hiểu nhiều hơn</strong>, kèm hướng dung hòa bằng
                thái độ — dứt khoát không kiêng kỵ, không lễ giải.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <HopTuoiDepth />,
        },
        {
          id: 'can-chi-nen-tang',
          tocLabel: 'Hệ Can Chi',
          heading: 'Hệ Can Chi — nền tảng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Thập Thiên Can (10 Can)
              </h3>
              <p>
                Giáp Ất (Mộc) · Bính Đinh (Hỏa) · Mậu Kỷ (Thổ) · Canh Tân (Kim)
                · Nhâm Quý (Thủy). Can lẻ là <strong>Dương</strong>, can chẵn là{' '}
                <strong>Âm</strong>.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Thập Nhị Địa Chi (12 con giáp)
              </h3>
              <p>
                Mỗi Chi gắn một con vật và một hành chính: Tý – Chuột (Thủy),
                Sửu – Trâu (Thổ), Dần – Hổ (Mộc), Mão – Mèo (Mộc), Thìn – Rồng
                (Thổ), Tỵ – Rắn (Hỏa), Ngọ – Ngựa (Hỏa), Mùi – Dê (Thổ), Thân –
                Khỉ (Kim), Dậu – Gà (Kim), Tuất – Chó (Thổ), Hợi – Lợn (Thủy).
              </p>
              <p className="text-sm text-foreground/70">
                Lưu ý văn hóa: ở Việt Nam Chi Mão là con Mèo; ở Trung Quốc và
                phần lớn Á Đông là con Thỏ. Đây là khác biệt văn hóa, không phải
                đúng hay sai.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Lục Thập Hoa Giáp (vòng 60)
              </h3>
              <p>
                10 Can xoay với 12 Chi tạo <strong>60 tổ hợp Can-Chi</strong>
                (Giáp Tý, Ất Sửu…), gọi là Lục Thập Hoa Giáp (六十花甲), lặp lại
                sau 60 năm. Mỗi tổ hợp gắn một mệnh nạp âm — lớp ngũ hành theo năm
                sinh.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Tính cách 12 con giáp (xu hướng tham khảo)
              </h3>
              <p>
                Mỗi con giáp có xu hướng hai mặt — điểm mạnh đi cùng điểm cần lưu
                ý. Đây chỉ là xu hướng tham khảo theo con giáp, không phải khuôn cố
                định. Bấm vào từng tuổi để đọc sâu hơn:
              </p>
              <ul className="space-y-1.5">
                {CHI_TRAITS.map((c) => (
                  <li key={c.slug} className="border-t border-border/50 pt-1.5 first:border-0 first:pt-0">
                    <Link
                      href={`/learn/con-giap/${c.slug}`}
                      className="text-gold underline underline-offset-4 hover:text-gold/80"
                    >
                      Tuổi {c.ten}
                    </Link>{' '}
                    — {c.trait}
                  </li>
                ))}
              </ul>
            </div>
          ),
        },
        {
          id: 'cac-nhom-quan-he',
          tocLabel: 'Các nhóm quan hệ',
          heading: 'Tam Hợp · Lục Hợp · Lục Xung · Lục Hại',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Tam Hợp (三合) — bốn nhóm "đồng tâm"
              </h3>
              <p>
                Ba con giáp cách nhau đều 4 ngôi hội tụ thành một cục ngũ hành —
                quan hệ hợp mạnh nhất, dễ tìm tiếng nói chung:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Thân – Tý – Thìn</strong>: Thủy cục — trí tuệ, linh
                  hoạt, kế hoạch dài hơi.
                </li>
                <li>
                  <strong>Dần – Ngọ – Tuất</strong>: Hỏa cục — nhiệt huyết, hành
                  động, sức bật.
                </li>
                <li>
                  <strong>Tỵ – Dậu – Sửu</strong>: Kim cục — kỷ luật, quyết đoán,
                  độ chính xác.
                </li>
                <li>
                  <strong>Hợi – Mão – Mùi</strong>: Mộc cục — sinh sôi, nhân hòa,
                  vun đắp.
                </li>
              </ul>
              <p>
                Vì sao ba ngôi này hợp nhau? Mỗi nhóm có cấu trúc{' '}
                <strong>Sinh – Vượng – Mộ</strong>: một ngôi Trường Sinh (khởi
                đầu), một ngôi Đế Vượng (đỉnh cao) và một ngôi Mộ Khố (thu giữ)
                của cùng một hành. Ví dụ Thủy cục: Thân là Trường Sinh của Thủy,
                Tý là Đế Vượng, Thìn là Mộ. Ba ngôi nâng nhau theo mạch "khởi đầu
                – cao trào – kết tinh" nên bổ trợ tự nhiên.
              </p>
              <p className="text-sm text-foreground/70">
                Nếu chỉ có 2/3 con giáp trong nhóm (ví dụ Thân–Tý, hay Tý–Thìn)
                thì gọi là <strong>bán Tam Hợp</strong> — vẫn có lực hợp nhưng nhẹ
                hơn khi đủ ba ngôi. Với một cặp đôi, cứ hiểu là "cùng thuộc nhóm
                Tam Hợp" là đủ.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Lục Hợp (六合) — sáu cặp "bổ trợ"
              </h3>
              <p>
                Sáu cặp Chi hợp đôi, gợi ý sự gắn kết: điểm mạnh người này cân
                bằng điểm yếu người kia — Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu,
                Tỵ–Thân, Ngọ–Mùi. Một số nguồn còn gán mỗi cặp "hóa" thành một
                hành, nhưng đây là chỗ các trường phái không nhất trí, nên chỉ
                nên xem là kiến thức nền tham khảo. Riêng Tỵ–Thân là cặp "ân oán
                đan xen" — vừa hợp vừa cọ, nên giọng phù hợp là "bổ trợ nhưng cần
                điều tiết".
              </p>
              <p>Theo một cách luận phổ biến, hành hóa của sáu cặp là:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tý – Sửu</strong> hóa Thổ (Thủy và Thổ nương nhau).
                </li>
                <li>
                  <strong>Dần – Hợi</strong> hóa Mộc (Thủy sinh Mộc, rất thuận
                  sinh).
                </li>
                <li>
                  <strong>Mão – Tuất</strong> hóa Hỏa.
                </li>
                <li>
                  <strong>Thìn – Dậu</strong> hóa Kim.
                </li>
                <li>
                  <strong>Tỵ – Thân</strong> hóa Thủy — cặp vừa hợp vừa nằm trong
                  Tương Hình, nên "hút mà cũng cọ".
                </li>
                <li>
                  <strong>Ngọ – Mùi</strong> hóa Hỏa (Ngọ là Hỏa kéo Mùi theo);
                  một số nguồn xem là không hóa rõ hành.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Công cụ hợp tuổi không dùng lớp "hành hóa" này (chỉ phân loại Lục
                Hợp), nên bảng trên là kiến thức nền — đừng chốt cứng kiểu "Tý Sửu
                hóa Thổ nên phải…".
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Lục Xung (六沖) — sáu cặp "đối nhịp"
              </h3>
              <p>
                Sáu cặp Chi đối xứng 180° trên vòng: Tý–Ngọ, Sửu–Mùi, Dần–Thân,
                Mão–Dậu, Thìn–Tuất, Tỵ–Hợi. Có hai cơ chế khác nhau: bốn cặp
                khác hành (Tý–Ngọ, Dần–Thân, Mão–Dậu, Tỵ–Hợi) xung do đối khắc về
                ngũ hành; còn hai cặp cùng hành Thổ (Sửu–Mùi, Thìn–Tuất) không
                phải đối khắc về hành mà là "xung mộ khố" — các tàng can trong kho
                Thổ va nhau.
              </p>
              <p>
                "Xung" không có nghĩa hai người không thể đi cùng nhau. Nó chỉ
                gợi ý hai nhịp sống khác nhau, đôi khi dễ va quan điểm. Nhiều cặp
                "xung" lại rất bền vì khác biệt đúng cách trở thành bổ sung.
                Hướng hóa giải duy nhất nên nêu là: chủ động hiểu nhau, nhường
                nhịn đúng lúc, biến khác biệt thành sự bù trừ.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Lục Hại (六害) — sáu cặp "khác kênh"
              </h3>
              <p>
                Tý–Mùi, Sửu–Ngọ, Dần–Tỵ, Mão–Thìn, Thân–Hợi, Dậu–Tuất. Nhẹ hơn
                Lục Xung về "lực", nhưng kiểu khó chịu là hiểu lầm âm ỉ hơn là va
                chạm bùng nổ. Hướng lành mạnh: giao tiếp rõ ràng, kiên nhẫn, nói
                thẳng kỳ vọng — không phải lời "tránh nhau".
              </p>
              <p className="text-sm text-foreground/70">
                Ngoài ra canon còn có tầng "Tương Hình" (cọ xát nội tại) và
                "Thiên Can ngũ hợp" (hợp giữa các Can). Đây là kiến thức nền sâu
                hơn, không bắt buộc cho hợp tuổi cơ bản theo con giáp.
              </p>
            </div>
          ),
        },
        {
          id: 'tuong-hinh-thien-can',
          tocLabel: 'Tương Hình & Thiên Can',
          heading: 'Tương Hình và Thiên Can ngũ hợp (kiến thức nền)',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <div className="rounded-card-editorial border border-gold/25 bg-gold/[0.04] p-4 text-sm text-foreground/85">
                Hai lớp dưới đây thuộc canon Can Chi nhưng{' '}
                <strong>công cụ hợp tuổi của hieu.asia hiện chưa tính</strong> —
                nó chỉ xét con giáp (Địa Chi) và phân theo sáu nhóm quan hệ. Nêu ở
                đây để bạn hiểu trọn hệ, không phải để làm bạn lo thêm.
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Tương Hình (相刑) — bốn loại
              </h3>
              <p>
                "Hình" nói về sự cọ xát nội tại, dễ tự làm khó nhau hoặc tự chuốc
                phiền. Canon chia bốn loại:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Vô Ân chi Hình:</strong> Dần → Tỵ → Thân (vòng ba ngôi).
                </li>
                <li>
                  <strong>Trì Thế chi Hình:</strong> Sửu → Tuất → Mùi (vòng ba
                  ngôi).
                </li>
                <li>
                  <strong>Vô Lễ chi Hình:</strong> Tý và Mão (hình hỗ).
                </li>
                <li>
                  <strong>Tự Hình:</strong> Thìn–Thìn, Ngọ–Ngọ, Dậu–Dậu, Hợi–Hợi
                  (cùng một Chi tự hình).
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Tên gọi ba vòng Hình (vô ân / cậy thế / vô lễ) gán cho nhóm Chi
                nào là điểm các sách Tử Bình <strong>không nhất trí</strong> — cách
                trình bày trên chỉ là một cách phổ biến, không phải khẳng định duy
                nhất đúng.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Thiên Can ngũ hợp (天干五合) — năm cặp Can
              </h3>
              <p>
                Ngoài Chi, 10 Thiên Can cũng có năm cặp "hợp hóa", mỗi cặp cách
                nhau 5 ngôi và hóa thành một hành:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Giáp – Kỷ</strong> hóa Thổ ("Trung chính chi hợp").
                </li>
                <li>
                  <strong>Ất – Canh</strong> hóa Kim ("Nhân nghĩa chi hợp").
                </li>
                <li>
                  <strong>Bính – Tân</strong> hóa Thủy ("Uy chế chi hợp").
                </li>
                <li>
                  <strong>Đinh – Nhâm</strong> hóa Mộc ("Dâm nặc chi hợp").
                </li>
                <li>
                  <strong>Mậu – Quý</strong> hóa Hỏa ("Vô tình chi hợp").
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Trong hợp hôn truyền thống, người ta xét cả Can lẫn Chi: Can hợp +
                Chi hợp là "song hợp"; Can hợp mà Chi xung thì "ngoài thuận trong
                cọ". Việc một cặp Can có thật sự "hóa được" hành hay không còn tùy
                nguyệt lệnh — đó là phần Bát Tự chuyên sâu, không cần cho hợp tuổi
                cơ bản.
              </p>
            </div>
          ),
        },
        {
          id: 'menh-nap-am-ung-dung',
          tocLabel: 'Nạp âm & ứng dụng',
          heading: 'Mệnh nạp âm và cách ứng dụng',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">
                Mệnh nạp âm (納音) — lớp ngũ hành năm sinh
              </h3>
              <p>
                Bên cạnh con giáp, dân gian còn xét mệnh nạp âm: mỗi cặp Can-Chi
                trong vòng 60 mang một "tên mệnh" và một hành nạp âm (ví dụ Giáp
                Tý / Ất Sửu là <strong>Hải Trung Kim</strong>). Đây là lớp ngũ
                hành theo năm sinh, dùng để xét tương sinh – tương khắc giữa hai
                mệnh.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tương sinh:</strong> Mộc → Hỏa → Thổ → Kim → Thủy →
                  Mộc.
                </li>
                <li>
                  <strong>Tương khắc:</strong> Mộc khắc Thổ, Thổ khắc Thủy, Thủy
                  khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.
                </li>
              </ul>
              <p>
                Khi đối chiếu hai mệnh: cùng mệnh thì dễ đồng điệu; A sinh B là
                quan hệ nâng đỡ tự nhiên; A khắc B là hai "chất" khác nhau cần
                dung hòa — <strong>không phải điềm xấu</strong>, nhiều nhà còn xem
                là sự bù trừ. Có trường phái xét theo hành nạp âm, có trường phái
                xét theo chính ngũ hành của con giáp; nên khi luận cần nói rõ
                đang xét theo lớp nào.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Vợ chồng · làm ăn · sinh con
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Vợ chồng / tình cảm:</strong> Tam Hợp / Lục Hợp là nền
                  dễ chịu; Lục Xung / Lục Hại chỉ là khác nhịp cần thấu hiểu —
                  nhiều cặp vẫn rất bền. Con giáp chỉ là một lát cắt; tình yêu,
                  giao tiếp và giá trị chung mới là điều quyết định.
                </li>
                <li>
                  <strong>Làm ăn / hợp tác:</strong> Tam Hợp dễ ăn ý cùng hướng;
                  Lục Hợp bổ trợ vai trò; cặp khác nhịp chỉ cần phân vai rõ và
                  quy tắc chung thì khác biệt thành lợi thế đa góc nhìn. Hợp tuổi
                  không thay năng lực, uy tín hay hợp đồng rõ ràng.
                </li>
                <li>
                  <strong>Sinh con:</strong> chỉ để tham khảo cho vui. Em bé nào
                  cũng là phúc — tuyệt đối không có chuyện con "khắc" hay "mang
                  lỗi" với cha mẹ. Cặp khác nhịp chỉ nghĩa là bố mẹ kiên nhẫn hơn
                  một chút.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Các kiêng kỵ dân gian như "năm Kim Lâu" hay "tuổi xung tháng
                cưới" là phong tục, nhiều vùng miền và trường phái khác nhau, độ
                tin cậy còn tranh cãi — chỉ nên nhắc như tham khảo, không khuyên
                hoãn cưới hay đổi tuổi.
              </p>
            </div>
          ),
        },
        {
          id: 'bang-nap-am',
          tocLabel: 'Bảng 30 nạp âm',
          heading: 'Bảng 60 Hoa Giáp — 30 nạp âm đầy đủ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Vòng 60 Hoa Giáp có <strong>30 tên nạp âm</strong>, mỗi tên ứng
                hai năm Can-Chi liền nhau nên phủ đủ 60 năm (ví dụ Giáp Tý và Ất
                Sửu cùng là <strong>Hải Trung Kim</strong>). Ba mươi nạp âm chia
                đều cho năm hành, mỗi hành sáu tên:
              </p>
              <div className="overflow-x-auto rounded-card-editorial border border-border bg-card/40">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Hành</th>
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Sáu nạp âm thuộc hành này</th>
                    </tr>
                  </thead>
                  <tbody>
                    {NAP_AM_GROUPS.map((g) => (
                      <tr key={g.hanh} className="border-b border-border/50 last:border-0 align-top">
                        <td className="px-3 py-2 font-heading text-foreground">{g.hanh}</td>
                        <td className="px-3 py-2 text-foreground/85">{g.items.join(' · ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Cách dùng đúng: nạp âm là một <strong>lát cắt thô</strong> theo năm
                sinh, dùng để xét tương sinh – tương khắc giữa hai mệnh theo vòng
                ngũ hành. Nó không thay được lá số đầy đủ, và cần nói rõ đang xét
                theo nạp âm hay theo chính ngũ hành của con giáp để tránh nhầm hai
                lớp.
              </p>
            </div>
          ),
        },
        {
          id: 'cac-diem-tranh-cai',
          tocLabel: '8 điểm hay tranh cãi',
          heading: 'Tám chỗ các trường phái chưa nhất trí',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Can Chi là truyền thống lâu đời, nên có những chỗ các sách và vùng
                miền nói khác nhau. Biết trước để đọc cho đúng, và để không ai áp
                một cách hiểu như thể nó là chân lý duy nhất:
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  <strong>Hành hóa của Lục Hợp</strong> — các nguồn không nhất trí
                  hóa thành hành gì; công cụ không dùng lớp này nên đừng chốt cứng.
                </li>
                <li>
                  <strong>Tỵ – Thân</strong> vừa là Lục Hợp vừa nằm trong Tương
                  Hình — quan hệ đa tầng; công cụ xếp cặp này vào Lục Hợp.
                </li>
                <li>
                  <strong>Mão là Mèo (Việt Nam) hay Thỏ (Trung Quốc)</strong> —
                  khác biệt văn hóa, không phải đúng/sai; cùng một Địa Chi, hành
                  Mộc.
                </li>
                <li>
                  <strong>Cơ chế Lục Xung</strong> — bốn cặp khác hành xung do đối
                  khắc ngũ hành; hai cặp Thổ–Thổ (Sửu–Mùi, Thìn–Tuất) là "xung mộ
                  khố", không phải khắc về hành.
                </li>
                <li>
                  <strong>Tên gọi ba vòng Tương Hình</strong> (vô ân / cậy thế / vô
                  lễ) gán cho nhóm Chi nào — các sách Tử Bình không thống nhất.
                </li>
                <li>
                  <strong>Xét hợp mệnh theo nạp âm hay theo chính ngũ hành của
                  Chi</strong> — hai trường phái; công cụ tách riêng hai lớp, không
                  trộn lẫn.
                </li>
                <li>
                  <strong>Tương Hình và Thiên Can ngũ hợp</strong> — canon có nhưng
                  công cụ hợp tuổi hiện chưa tính; đây là kiến thức nền.
                </li>
                <li>
                  <strong>Kiêng kỵ hợp hôn, "năm Kim Lâu"</strong> — là phong tục,
                  độ tin cậy còn tranh cãi; nhắc như tham khảo, không khuyến cáo
                  hoãn cưới hay đổi tuổi.
                </li>
              </ol>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <HopTuoiWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <HopTuoiRecall />,
        },
        {
          id: 'faq',
          tocLabel: 'Câu hỏi thường gặp',
          heading: 'Câu hỏi thường gặp',
          children: (
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
          ),
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <HopTuoiChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
