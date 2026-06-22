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
  title: 'Thần Số Học Pythagoras: Học huyền học',
  description:
    'Thần Số Học (Numerology) theo trường phái Pythagoras: rút số chủ đạo từ ngày sinh và tên, mỗi số mang một năng lượng riêng.',
  alternates: { canonical: 'https://hieu.asia/learn/than-so-hoc' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (accordion) →
// chữ schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Pythagoras là ai?',
    a: 'Pythagoras (~570 TCN) là nhà toán học, triết gia Hy Lạp, người đặt nền móng cho Thần Số Học phương Tây. Ông tin số không chỉ đếm vật, mà còn mang "linh hồn" riêng phản ánh quy luật vũ trụ.',
  },
  {
    q: 'Cách tính số chủ đạo?',
    a: 'Cộng tất cả chữ số trong ngày sinh đầy đủ. Ví dụ 15/08/1990 = 1+5+0+8+1+9+9+0 = 33 → 3+3 = 6. Vậy số chủ đạo là 6 (riêng 11, 22, 33 giữ nguyên, gọi là số bậc thầy).',
  },
  {
    q: 'Số từ tên thì sao?',
    a: 'Mỗi chữ cái được gán một số 1–9 theo bảng Pythagoras. Cộng các số ứng với tên đầy đủ rồi rút gọn, ra số biểu hiện (expression number) và số linh hồn (soul urge number).',
  },
  {
    q: 'Dùng để làm gì?',
    a: 'Soi tính cách bẩm sinh, sứ mệnh đời, vùng dễ vấp. Là công cụ tự nhận thức nhanh, chỉ cần ngày sinh + tên là có bản phác họa. Đây là một lăng kính để hiểu mình, không phải lời phán định mệnh.',
  },
  {
    q: 'Số bậc thầy 11, 22, 33 nghĩa là gì?',
    a: 'Khi tổng rút gọn rơi đúng vào 11, 22 hoặc 33 thì giữ nguyên, không rút tiếp về 2/4/6. Đây là phiên bản cường độ cao của số gốc — tiềm năng lớn hơn nhưng cũng là bài tập khó hơn, KHÔNG phải "đẳng cấp cao hơn người". Nhiều người sống phần lớn đời ở dạng số gốc và chỉ kích hoạt cường độ master ở giai đoạn trưởng thành. Có trường phái chỉ công nhận 11 và 22, coi 33 là hiếm; cách đọc Decoz (hieu.asia dùng) công nhận cả ba.',
  },
  {
    q: 'Tên tiếng Việt có dấu thì tính thế nào?',
    a: 'Bảng Pythagoras chỉ có 26 chữ La-tinh, nên tên Việt được bỏ dấu về chữ không dấu trước khi tra (Nguyễn → NGUYEN, Phương → PHUONG, Đ → D). Cần lưu ý thật lòng: hệ này sinh ra cho tên gốc tiếng Anh, nên việc bỏ dấu là một quy ước thực dụng, không phải chân lý — hãy xem đây là một cách chơi với con số để soi mình, không phải "con số định mệnh tuyệt đối của tên bạn".',
  },
  {
    q: 'Số Nợ Nghiệp (13, 14, 16, 19) có phải điềm xấu không?',
    a: 'Không. Trong cách đọc Decoz, bốn con số 13/14/16/19 là bài học còn dang dở cần hoàn thiện ở đời này bằng nỗ lực có ý thức, không phải điềm xấu hay bản án. Mỗi số đều có "điều cần học" kèm "cách đi tới". hieu.asia không hù dọa "nghiệp nặng/kiếp trước" và không bán dịch vụ "giải nghiệp". Lưu ý: không phải trường phái nào cũng dùng bộ số này — đây là đặc trưng của Decoz.',
  },
  {
    q: 'Thần Số Học có phải là khoa học không?',
    a: 'Không. Giới khoa học xếp thần số học vào nhóm pseudoscience — không có cơ chế nhân quả được kiểm chứng. hieu.asia trung thực về điều này và định vị nó như một lăng kính biểu tượng để phản tư, KHÔNG phải dự báo. Giá trị nằm ở việc nó gợi cho bạn những câu hỏi để hiểu mình hơn, không nằm ở chỗ "đoán đúng tương lai".',
  },
];

const JSONLD = [
  article({
    headline: 'Thần Số Học Pythagoras: nền tảng cho người mới',
    description:
      'Thần Số Học (Numerology) theo trường phái Pythagoras: rút số chủ đạo từ ngày sinh và tên, mỗi số mang một năng lượng riêng.',
    url: '/learn/than-so-hoc',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Thần Số Học', url: '/learn/than-so-hoc' },
  ]),
  faqPage(FAQS),
];

interface NumberCard {
  num: number;
  name: string;
  keywords: string;
}

const NUMBERS: readonly NumberCard[] = [
  { num: 1, name: 'Người dẫn đầu', keywords: 'Độc lập, khởi xướng, tự chủ' },
  { num: 2, name: 'Người hợp tác', keywords: 'Hài hòa, ngoại giao, nhạy cảm' },
  { num: 3, name: 'Người sáng tạo', keywords: 'Biểu đạt, lạc quan, nghệ thuật' },
  { num: 4, name: 'Người xây dựng', keywords: 'Kỷ luật, thực tế, bền bỉ' },
  { num: 5, name: 'Người tự do', keywords: 'Phiêu lưu, linh hoạt, năng động' },
  { num: 6, name: 'Người chăm sóc', keywords: 'Trách nhiệm, gia đình, hài hòa' },
  { num: 7, name: 'Nhà tư tưởng', keywords: 'Phân tích, tâm linh, ẩn dật' },
  { num: 8, name: 'Người quyền lực', keywords: 'Tham vọng, vật chất, quản trị' },
  { num: 9, name: 'Người nhân ái', keywords: 'Vị tha, hoàn thiện, toàn cầu' },
];

export default function LearnThanSoHocPage() {
  return (
    <LearnArticle
      eyebrow="Tây phương · Pythagoras"
      title={
        <>
          Thần <span className="bg-gold-gradient bg-clip-text text-transparent">Số Học</span>
        </>
      }
      standfirst={
        <>
          Pythagoras tin rằng mọi thứ đều có thể quy về số. Thần Số Học hiện đại rút số chủ
          đạo từ ngày sinh và tên. Mỗi số từ 1 đến 9 mang một nguồn năng lượng riêng.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Thần Số Học' },
      ]}
      relatedLenses={relatedLearnLenses('than-so-hoc')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Chỉ cần ngày sinh và tên đầy đủ, hệ thống tính ra số chủ đạo, số biểu hiện và số linh hồn, kèm diễn giải năng lượng từng số.',
        href: '/reading/new?method=numerology',
        label: 'Khám phá Thần Số Học',
      }}
      sections={[
        {
          id: 'chin-so-chu-dao',
          tocLabel: '9 số chủ đạo',
          heading: '9 số chủ đạo',
          children: (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {NUMBERS.map((n) => (
                  <div
                    key={n.num}
                    className="rounded-lg border border-border bg-card/40 p-4 transition-colors hover:border-gold/40"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading text-3xl font-bold text-gold-700">{n.num}</span>
                      <span className="text-sm font-semibold text-foreground">{n.name}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{n.keywords}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Ngoài 1–9 còn có 3 số "bậc thầy": 11, 22, 33, không rút gọn về 1 chữ số.
              </p>
            </>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="origin" className="rounded border border-border px-4">
                <AccordionTrigger>Pythagoras là ai?</AccordionTrigger>
                <AccordionContent>
                  Pythagoras (~570 TCN) là nhà toán học, triết gia Hy Lạp, người đặt nền móng cho
                  Thần Số Học phương Tây. Ông tin số không chỉ đếm vật, mà còn mang "linh hồn"
                  riêng phản ánh quy luật vũ trụ.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="calc" className="rounded border border-border px-4">
                <AccordionTrigger>Cách tính số chủ đạo?</AccordionTrigger>
                <AccordionContent>
                  Cộng tất cả chữ số trong ngày sinh đầy đủ. Ví dụ 15/08/1990 = 1+5+0+8+1+9+9+0 =
                  33 → 3+3 = 6. Vậy số chủ đạo là 6 (riêng 11, 22, 33 giữ nguyên, gọi là số bậc thầy).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="name" className="rounded border border-border px-4">
                <AccordionTrigger>Số từ tên thì sao?</AccordionTrigger>
                <AccordionContent>
                  Mỗi chữ cái được gán một số 1–9 theo bảng Pythagoras. Cộng các số ứng với tên
                  đầy đủ rồi rút gọn, ra số biểu hiện (expression number) và số linh hồn (soul
                  urge number).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="usage" className="rounded border border-border px-4">
                <AccordionTrigger>Dùng để làm gì?</AccordionTrigger>
                <AccordionContent>
                  Soi tính cách bẩm sinh, sứ mệnh đời, vùng dễ vấp. Là công cụ tự nhận thức nhanh,
                  chỉ cần ngày sinh + tên là có bản phác họa.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ),
        },
        {
          id: 'bon-loai-so',
          tocLabel: 'Bốn con số lõi',
          heading: 'Bốn con số lõi vẽ nên chân dung con người',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <p>
                Ngoài Số Đường Đời (Số Chủ Đạo rút từ ngày sinh), một lá số thần số còn có{' '}
                <strong>bốn con số cốt lõi</strong> rút từ tên đầy đủ và ngày sinh. Cách dùng hay
                nhất là <strong>đọc cộng hưởng</strong>: khi các số cùng hướng thì năng lượng nhất
                quán; khi lệch nhau thì có một "sức kéo nội tâm" rất đáng để soi.
              </p>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Vận Mệnh / Biểu Đạt (Expression)
                </h3>
                <p>
                  Tính từ <strong>tất cả</strong> chữ cái trong tên đầy đủ khi sinh. Đây là{' '}
                  <strong>bộ công cụ trời cho</strong> của bạn — tài năng, thiên hướng nghề, cách
                  bạn cống hiến ra ngoài. Nếu Đường Đời là "con đường đi" thì Vận Mệnh là "hành lý
                  mang theo". Cần dùng đúng <strong>tên trên giấy khai sinh</strong>, không phải
                  nghệ danh hay tên gọi thường — đây là điểm hay bị làm sai.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Linh Hồn (Soul Urge / Heart's Desire)
                </h3>
                <p>
                  Chỉ lấy <strong>nguyên âm</strong> trong tên đầy đủ. Đây là con số{' '}
                  <strong>bí mật nhất</strong> — điều bạn thật sự khao khát, thứ khiến bạn thấy
                  trọn vẹn hay trống rỗng dù bề ngoài đủ đầy. Nguyên âm được ví như "âm thanh bên
                  trong" của tên, tượng trưng cho nội tâm.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Nhân Cách (Personality)
                </h3>
                <p>
                  Chỉ lấy <strong>phụ âm</strong> trong tên. Đây là "lớp vỏ ngoài" bạn trình ra
                  với thế giới — ấn tượng đầu tiên, năng lượng người khác cảm nhận trước. Khoảng
                  cách giữa <strong>Nhân Cách (phụ âm)</strong> và{' '}
                  <strong>Linh Hồn (nguyên âm)</strong> chính là khoảng cách giữa "người ta thấy
                  bạn thế nào" và "bạn thật sự là gì" — một góc soi rất đắt giá. (Một kiểm tra logic
                  thú vị: Linh Hồn + Nhân Cách = Vận Mệnh, vì nguyên âm cộng phụ âm là toàn bộ chữ.)
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Ngày Sinh (Birthday)
                </h3>
                <p>
                  Lấy riêng <strong>ngày trong tháng</strong> (1–31). Đây là một{' '}
                  <strong>món quà/tài năng cụ thể</strong> tô điểm thêm cho Đường Đời — con số
                  "phụ" nhưng cụ thể, dễ nhận ra trong đời thường.
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Một điểm cần minh bạch: chữ <strong>Y</strong> nằm ở ranh giới nguyên âm/phụ âm và
                là điểm có trường phái khác nhau. hieu.asia theo quy ước xếp Y là nguyên âm; nếu
                bạn tính bằng công cụ khác (xử lý Y theo phát âm) có thể ra số hơi khác — đó là
                khác trường phái, không phải sai.
              </p>
            </div>
          ),
        },
        {
          id: 'master-no-nghiep',
          tocLabel: 'Số bậc thầy & Nợ Nghiệp',
          heading: 'Số bậc thầy & Số Nợ Nghiệp',
          children: (
            <div className="space-y-6 text-foreground/85 leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số bậc thầy 11 · 22 · 33
                </h3>
                <p>
                  Khi một tổng rút gọn rơi đúng vào 11, 22 hoặc 33, ta{' '}
                  <strong>giữ nguyên</strong>, không rút tiếp về 2/4/6. Mỗi master là{' '}
                  <strong>phiên bản cường độ cao</strong> của số gốc:
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>11 (gốc 2) — Người truyền cảm hứng:</strong> trực giác phi thường,
                    nhạy cảm cao. Áp lực: dễ lo âu, quá tải cảm xúc, sống trong tầm nhìn mà quên
                    xây từng bậc thang → cần "nối đất" (ngủ đủ, vận động, thói quen đều đặn).
                  </li>
                  <li>
                    <strong>22 (gốc 4) — Người kiến tạo bậc thầy:</strong> biến mơ lớn thành công
                    trình thực, có cả tầm nhìn lẫn đôi tay thực thi. Áp lực: tê liệt vì "phải làm
                    điều lớn" → chia giấc mơ thành từng viên gạch hôm nay.
                  </li>
                  <li>
                    <strong>33 (gốc 6) — Người thầy phụng sự:</strong> chữa lành, nâng đỡ, dạy
                    bằng cách sống. Áp lực: kiệt sức vì người khác, dễ rơi vào cứu-thế chủ nghĩa →
                    học nói không, học nhận lại.
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Cần giữ đúng tinh thần: master = <strong>tiềm năng cao + bài tập khó</strong>,
                  KHÔNG phải nhãn "bạn đặc biệt hơn người". Người mang master thường dao động giữa
                  dạng gốc (2/4/6) và dạng master, và chỉ kích hoạt cường độ master ở giai đoạn
                  trưởng thành. Có trường phái chỉ công nhận 11 và 22 và đòi điều kiện chặt cho 33;
                  hieu.asia theo cách đọc Decoz nên công nhận cả ba.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Số Nợ Nghiệp 13 · 14 · 16 · 19
                </h3>
                <p>
                  Theo cách đọc Decoz, bốn con số này là{' '}
                  <strong>bài học còn dang dở cần hoàn thiện ở đời này</strong> bằng nỗ lực có ý
                  thức — <strong>không phải điềm xấu hay bản án</strong>. Chúng xuất hiện khi một
                  con số lõi đi qua đúng 13/14/16/19 ở tổng trung gian trước khi rút gọn về một
                  chữ số.
                </p>
                <ul className="list-disc space-y-2 pl-6">
                  <li>
                    <strong>13 → 4 (Lao động):</strong> từng tìm đường tắt, né việc khó. Hướng
                    trưởng thành: kỷ luật, bền bỉ, chia mục tiêu thành bước nhỏ và làm tới nơi.
                  </li>
                  <li>
                    <strong>14 → 5 (Điều độ):</strong> từng lạm dụng tự do, sa đà giác quan, thiếu
                    cam kết. Hướng trưởng thành: tự do đi cùng trách nhiệm, giữ kỷ luật giữa biến
                    động.
                  </li>
                  <li>
                    <strong>16 → 7 (Khiêm nhường):</strong> từng đặt cái tôi lên trên tình yêu
                    thật; đời có những lần "sụp đổ" cái tôi. Hướng trưởng thành: dựng lại trên nền
                    khiêm nhường và chiều sâu.
                  </li>
                  <li>
                    <strong>19 → 1 (Tự lực không vị kỷ):</strong> từng lạm dụng quyền lực/độc lập,
                    hoặc ngược lại quá phụ thuộc. Hướng trưởng thành: đứng vững một mình nhưng rộng
                    mở giúp người và để người giúp lại.
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Khái niệm "kiếp trước" ở đây là một <strong>ẩn dụ biểu tượng</strong> trong hệ
                  Decoz, không phải khẳng định siêu hình. Không phải trường phái nào cũng dùng bộ
                  Nợ Nghiệp này — một số hệ bỏ qua hoàn toàn. hieu.asia trình bày theo cách đọc
                  Decoz, luôn đóng khung là "việc cần rèn" kèm lối đi tới, và không bao giờ hù dọa
                  hay bán dịch vụ "giải nghiệp".
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Bài Học Nghiệp — chữ số THIẾU trong tên
                </h3>
                <p>
                  Khác với Nợ Nghiệp (đến từ một con số có mặt),{' '}
                  <strong>Bài Học Nghiệp</strong> là các chữ số 1–9{' '}
                  <strong>không xuất hiện</strong> khi quy đổi tên đầy đủ sang số. Mỗi số vắng mặt
                  là một phẩm chất bạn chưa quen vận dụng, cần ý thức rèn — một{' '}
                  <strong>cơ hội phát triển</strong>, không phải khiếm khuyết cố định. Vì tên Việt
                  bỏ dấu và thường ngắn nên có thể vắng nhiều chữ số hơn tên phương Tây; hãy đọc
                  nhẹ nhàng như "vùng cần để ý", đừng để thấy mình "thiếu nhiều thứ".
                </p>
              </div>
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
