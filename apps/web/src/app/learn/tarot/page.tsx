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
  title: 'Tarot là gì? 78 lá bài & cách đọc cho người mới',
  description:
    'Tarot 78 lá (22 Ẩn Chính + 56 Ẩn Phụ): ý nghĩa, bốn chất Gậy–Cốc–Kiếm–Tiền và cách đọc như lăng kính phản tư để hiểu mình, không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/tarot' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Tarot là gì?',
    a: 'Tarot là một bộ 78 lá bài, gồm 22 lá Ẩn Chính (Major Arcana, đánh số 0–21, nói về chủ đề lớn và bước ngoặt) và 56 lá Ẩn Phụ (Minor Arcana, chia 4 chất, nói về đời sống thường ngày). Bộ phổ biến nhất là Rider–Waite–Smith. Ở đây, mỗi lá là một lăng kính để tự suy ngẫm, không phải lời tiên tri.',
  },
  {
    q: 'Tarot có dự đoán được tương lai không?',
    a: 'Trên hieu.asia, Tarot không dùng để bói tương lai hay phán "sắp giàu / sắp chia tay / gặp hạn". Một lá rút ra là một câu hỏi gợi mở để bạn soi lại tình huống của chính mình. Người rút bài giữ câu trả lời, và bạn vẫn luôn là người quyết định.',
  },
  {
    q: '22 Ẩn Chính và 56 Ẩn Phụ khác nhau thế nào?',
    a: '22 Ẩn Chính là các nguyên mẫu lớn của đời người (Gã Khờ, Tình Nhân, Cái Chết, Mặt Trời…), khi xuất hiện thường nói về chủ đề lớn, bước ngoặt, bài học cốt lõi. 56 Ẩn Phụ chia 4 chất (Gậy, Cốc, Kiếm, Tiền), nói về tình huống cụ thể và đời sống thường ngày — "đang xảy ra gì" trong từng lĩnh vực.',
  },
  {
    q: 'Bốn chất Gậy, Cốc, Kiếm, Tiền nghĩa là gì?',
    a: 'Gậy (Wands) ứng với Lửa — hành động, đam mê, năng lượng. Cốc (Cups) ứng với Nước — cảm xúc, quan hệ, trực giác. Kiếm (Swords) ứng với Khí — tư duy, lời nói, sự thật. Tiền (Pentacles) ứng với Đất — công việc, vật chất, tiền bạc, sức khỏe. Đây là khung đọc nhanh xem một lá Ẩn Phụ thuộc lĩnh vực nào (theo chuẩn RWS/Golden Dawn).',
  },
  {
    q: 'Lá Cái Chết, Tòa Tháp có phải điềm xấu không?',
    a: 'Không. Lá Cái Chết gần như không bao giờ nói về cái chết thật — nó là chuyển hóa, một giai đoạn kết thúc để mở chỗ cho cái mới. Tòa Tháp là một đổ vỡ phơi bày sự thật trên nền móng sai, sau đó là cơ hội xây lại đúng. Ác Quỷ và Mặt Trăng cũng vậy: chúng gợi điều cần soi, không phải điềm gở.',
  },
  {
    q: 'Lá ngược (reversed) có phải luôn xấu không?',
    a: 'Không. Lá ngược không tự động xấu. Nó thường có nghĩa năng lượng đang bị nghẽn, hướng vào trong, thái quá hoặc thiếu hụt — và với các lá "nặng" (Ba Kiếm, Tám Kiếm, Mười Kiếm, Tháp) chiều ngược lại hay là dấu phục hồi. Có trường phái không dùng lá ngược, đọc tất cả như xuôi; đó cũng là một lựa chọn hợp lệ.',
  },
  {
    q: 'Có những kiểu trải bài nào phổ biến?',
    a: 'Phổ biến là: một lá (lá-của-ngày hoặc câu hỏi nhanh), ba lá (đọc theo một trục như quá khứ – hiện tại – xu hướng, hoặc tình huống – hành động – kết quả khả dĩ), và Celtic Cross 10 lá (sâu nhất, do A. E. Waite phổ biến hóa). Cách đánh số/diễn giải Celtic Cross có vài biến thể giữa các trường phái.',
  },
  {
    q: 'Tarot khác Tử Vi hay Bát Tự ở điểm nào?',
    a: 'Tử Vi và Bát Tự lập dựa trên ngày giờ sinh và mang tính ổn định theo thời gian. Tarot không cần ngày sinh — mỗi lần rút phản ánh câu hỏi và tâm thế ngay lúc đó, hợp để dừng lại soi một tình huống cụ thể. Cả ba đều nên dùng như công cụ tham khảo để hiểu mình, không phải để phán số mệnh.',
  },
];

const JSONLD = [
  article({
    headline: 'Tarot 78 lá: nền tảng cho người mới',
    description:
      'Tarot 78 lá (22 Ẩn Chính + 56 Ẩn Phụ): ý nghĩa, bốn chất Gậy–Cốc–Kiếm–Tiền và cách đọc như lăng kính phản tư để hiểu mình, không phán số mệnh.',
    url: '/learn/tarot',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Tarot', url: '/learn/tarot' },
  ]),
  faqPage(FAQS),
];

export default function LearnTarotPage() {
  return (
    <LearnArticle
      eyebrow="TÂY PHƯƠNG · TAROT"
      title={
        <>
          <span className="bg-gold-gradient bg-clip-text text-transparent">Tarot</span> 78 lá
        </>
      }
      standfirst={
        <>
          Tarot là bộ 78 lá bài chia hai nhóm Ẩn Chính và Ẩn Phụ. Trên hieu.asia, mỗi lá là một
          lăng kính để tự suy ngẫm — gợi câu hỏi để bạn hiểu mình, không phải lời tiên tri.
        </>
      }
      readMeta="8 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Tarot' },
      ]}
      relatedLenses={relatedLearnLenses('tarot')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Đặt một câu hỏi mở trong lòng, rút lá và đọc nghĩa cốt lõi cùng câu hỏi tự soi. Lá bài gợi ý — bạn giữ câu trả lời.',
        href: '/tarot',
        label: 'Trải bài Tarot',
      }}
      sections={[
        {
          id: 'tong-quan',
          tocLabel: 'Tổng quan',
          heading: 'Tarot là gì — và cách đọc ở đây',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Tarot là một bộ <strong>78 lá bài</strong> chia hai nhóm. <strong>22 Ẩn Chính
                (Major Arcana)</strong> đánh số 0–21, mỗi lá là một nguyên mẫu lớn của đời người
                (Gã Khờ, Tình Nhân, Cái Chết, Mặt Trời…); khi xuất hiện, chúng nói về chủ đề lớn,
                bước ngoặt, bài học cốt lõi. <strong>56 Ẩn Phụ (Minor Arcana)</strong> chia 4
                chất, nói về đời sống thường ngày và tình huống cụ thể.
              </p>
              <p>
                Tarot ra đời khoảng thế kỷ 15 ở Ý như bài chơi, mãi cuối thế kỷ 18 mới được gán
                nghĩa bói toán. Bộ <strong>Rider–Waite–Smith (RWS)</strong> — do A. E. Waite
                thiết kế ý nghĩa và Pamela Colman Smith vẽ, xuất bản năm 1909 — là bộ được dùng
                phổ biến nhất thế giới và là chuẩn mà công cụ trên hieu.asia bám theo. Điểm cách
                tân của RWS là vẽ cảnh có người trên cả 56 lá Ẩn Phụ, giúp "đọc tranh" dễ hơn
                nhiều so với các bộ trước đó.
              </p>
              <p>
                <strong>Cách dùng ở đây:</strong> Tarot không dự đoán tương lai, không phán "sắp
                giàu / sắp chia tay / gặp hạn". Một lá rút ra là <em>một câu hỏi gợi mở</em> để
                bạn soi lại chính tình huống của mình — lá bài gợi câu hỏi, bạn giữ câu trả lời.
              </p>
            </div>
          ),
        },
        {
          id: 'cau-truc',
          tocLabel: 'Cấu trúc bộ bài',
          heading: 'Cấu trúc 78 lá & bốn chất',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Bộ 78 lá chia ba phần: <strong>22 Ẩn Chính</strong> (nguyên mẫu, hành trình tâm
                lý lớn), <strong>40 lá số Ẩn Phụ</strong> (Át–10 ở mỗi chất, tình huống đời
                thường), và <strong>16 lá hoàng gia</strong> (court: Thị Đồng, Hiệp Sĩ, Hoàng
                Hậu, Vua — chỉ một kiểu người, một vai, hoặc một mặt của chính mình).
              </p>
              <h3 className="text-lg font-semibold text-foreground">Bốn chất và Tứ Nguyên</h3>
              <p>
                Mỗi lá Ẩn Phụ thuộc một trong bốn chất, mỗi chất ứng một nguyên tố và một lĩnh
                vực đời sống:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Gậy (Wands) — Lửa:</strong> hành động, đam mê, năng lượng, ý chí, khởi
                  sự sự nghiệp. "Muốn làm".
                </li>
                <li>
                  <strong>Cốc (Cups) — Nước:</strong> cảm xúc, quan hệ, tình cảm, trực giác.
                  "Đang cảm thấy gì".
                </li>
                <li>
                  <strong>Kiếm (Swords) — Khí:</strong> tư duy, lời nói, sự thật, quyết định,
                  xung đột. "Đang nghĩ gì".
                </li>
                <li>
                  <strong>Tiền (Pentacles) — Đất:</strong> công việc, vật chất, tiền bạc, sức
                  khỏe, thực tế. "Đang có gì trong tay".
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Có trường phái (ảnh hưởng từ Aleister Crowley) đảo lại Gậy = Khí, Kiếm = Lửa.
                hieu.asia theo chuẩn RWS/Golden Dawn: Gậy = Lửa, Kiếm = Khí.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Mạch số Át → 10 (khung gợi ý)
              </h3>
              <p>
                Một cách đọc Ẩn Phụ là theo "cốt truyện số" lặp ở cả 4 chất: <strong>Át</strong>{' '}
                = hạt mầm/khởi điểm; <strong>2</strong> = lựa chọn, cân bằng đôi;{' '}
                <strong>3</strong> = thành hình, hợp tác; <strong>4</strong> = ổn định, giữ vững;{' '}
                <strong>5</strong> = xáo trộn, thử thách giữa chặng; <strong>6</strong> = hồi
                phục, cho–nhận; <strong>7</strong> = đánh giá, chọn lựa khó; <strong>8</strong> =
                vận động nhanh / chuyên cần; <strong>9</strong> = gần trọn, đỉnh cảm xúc của
                chất; <strong>10</strong> = trọn vẹn hoặc quá tải, chuyển sang chu kỳ mới. Đây là
                khung gợi ý, không phải công thức cứng — sắc thái mỗi lá vẫn khác nhau theo chất.
              </p>
            </div>
          ),
        },
        {
          id: 'an-chinh',
          tocLabel: 'Hành trình Gã Khờ',
          heading: '22 Ẩn Chính & hành trình Gã Khờ',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Nhiều người đọc xem 22 Ẩn Chính như <strong>một hành trình trưởng thành</strong>{' '}
                của nhân vật số 0 — Gã Khờ — đi qua các bài học để đến Thế Giới (số 21, trọn
                vẹn). Đây là cách diễn giải phổ biến (gắn với Eden Gray), hữu ích để dẫn mạch chứ
                không phải giáo lý bắt buộc. Thường chia ba chặng:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Chặng 1 (0–7) — Thế giới bên ngoài:</strong> Gã Khờ bước vào đời, gặp
                  các nhân vật định hình bản thân (ý chí, trực giác, mẹ–cha, truyền thống, tình
                  yêu, ý chí tiến lên).
                </li>
                <li>
                  <strong>Chặng 2 (8–14) — Vào bên trong:</strong> sức mạnh nội tâm, lùi lại tìm
                  mình, chấp nhận đổi thay và buông bỏ, học cân bằng.
                </li>
                <li>
                  <strong>Chặng 3 (15–21) — Vượt bóng tối đến trọn vẹn:</strong> đối diện ràng
                  buộc và khủng hoảng, tìm lại hy vọng, đi qua mơ hồ, ra ánh sáng, thức tỉnh,
                  hoàn tất.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground">
                Bốn lá hay bị hù dọa — đọc cho đúng
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>13 Cái Chết:</strong> gần như không bao giờ nói về cái chết thật. Nó là
                  chuyển hóa — một giai đoạn/vai trò kết thúc để mở chỗ cho cái mới.
                </li>
                <li>
                  <strong>16 Tòa Tháp:</strong> đổ vỡ nhưng là phơi bày sự thật trên một nền móng
                  sai; thứ sụp đổ vốn không đáng giữ, sau đó là cơ hội xây lại đúng.
                </li>
                <li>
                  <strong>15 Ác Quỷ:</strong> không phải "ma quỷ" — là ràng buộc/thói quen/lệ
                  thuộc do chính mình duy trì; dây trói thường lỏng hơn cảm giác.
                </li>
                <li>
                  <strong>18 Mặt Trăng:</strong> không phải điềm gở — là sự mơ hồ và nỗi sợ chưa
                  rõ tên; chưa đủ sáng để kết luận, đừng quyết lớn lúc này.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Tranh cãi đánh số: bộ Marseille cổ đặt Công Lý = 8, Sức Mạnh = 11; Waite (theo
                Golden Dawn) đổi thành Sức Mạnh = 8, Công Lý = 11. hieu.asia theo RWS. Người đến
                từ truyền thống Marseille có thể thấy ngược.
              </p>
            </div>
          ),
        },
        {
          id: 'ung-dung',
          tocLabel: 'Cách ứng dụng',
          heading: 'Cách ứng dụng & lưu ý khi đọc',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <h3 className="text-lg font-semibold text-foreground">Các kiểu trải bài</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Một lá:</strong> rút 1 lá để soi một câu hỏi mở, hoặc làm điểm tựa suy
                  ngẫm trong ngày. "Lá-của-ngày" không phải tiên đoán về ngày của bạn, chỉ là một
                  lá để dừng lại và ngẫm.
                </li>
                <li>
                  <strong>Ba lá:</strong> đọc theo một trục chọn trước — ví dụ quá khứ / hiện tại
                  / xu hướng nếu giữ nguyên; hoặc tình huống / hành động nên cân nhắc / kết quả
                  khả dĩ; hoặc bạn / người kia / mối quan hệ giữa hai.
                </li>
                <li>
                  <strong>Celtic Cross (Thập Tự Kelt):</strong> 10 lá, sâu nhất, do A. E. Waite
                  phổ biến hóa. Cách đánh số và diễn giải có vài biến thể giữa các trường phái.
                </li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground">Đọc tổng thể, không từng lá rời</h3>
              <p>
                Người đọc giỏi nhìn bức tranh chung trước khi chốt: nhiều Ẩn Chính → chủ đề lớn,
                bài học sâu; toàn Ẩn Phụ → chuyện đời thường trong tầm xoay xở. Chất nào áp đảo
                cho biết trọng tâm: nhiều Kiếm → nặng về đầu óc/xung đột; nhiều Cốc → cảm
                xúc/quan hệ; nhiều Gậy → hành động; nhiều Tiền → tiền bạc/thực tế.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Chiều ngược không tự động xấu</h3>
              <p>
                Lá ngược thường có nghĩa năng lượng đang bị nghẽn, hướng vào trong, thái quá hoặc
                thiếu hụt — và với các lá "nặng" thì chiều ngược hay là dấu phục hồi. Có trường
                phái không dùng lá ngược, đọc tất cả như xuôi; đó cũng là lựa chọn hợp lệ. Ở đây,
                lá ngược luôn được khung là "mặt trầm để soi", không phải "điềm gở".
              </p>
              <h3 className="text-lg font-semibold text-foreground">Lưu ý quan trọng</h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>Tarot ở đây để hiểu mình và ra quyết định tỉnh táo hơn — không bán "đổi vận / giải hạn".</li>
                <li>Kết quả luôn được khung là "xu hướng nếu giữ nguyên hướng đi", không phải định mệnh cứng — bạn vẫn là người chọn.</li>
                <li>Khi các trường phái khác nhau (đánh số, nguyên tố, biến thể trải bài), nên nêu rõ thay vì khẳng định một chiều.</li>
              </ul>
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
