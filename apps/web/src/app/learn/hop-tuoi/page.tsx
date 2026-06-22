import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage } from '@/lib/seo/jsonld';

export const metadata: Metadata = {
  title: 'Hợp tuổi (12 con giáp): Tam Hợp, Lục Hợp, Lục Xung | Học huyền học',
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
                ý. Ví dụ: Tý nhanh nhạy, quan sát tốt nhưng dễ ôm nhiều việc;
                Sửu bền bỉ, đáng tin nhưng đôi khi cứng nhắc; Dần mạnh mẽ, dám mở
                đường nhưng cần giữ nhịp; Ngọ nhiệt tình, phóng khoáng nhưng cần
                chỗ nghỉ. Đây chỉ là xu hướng tham khảo, không phải khuôn cố
                định.
              </p>
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
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
