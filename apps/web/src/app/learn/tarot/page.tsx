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
import { MAJOR_PAGES, ALL_PAGES } from '@/lib/tarot-card-pages';
import { MINOR_PAGES } from '@/lib/tarot-card-pages-minor';
import { JsonLd } from '@/components/seo/JsonLd';
import { article, breadcrumb, faqPage, itemList } from '@/lib/seo/jsonld';
import {
  TarotFrame,
  TarotDepth,
  TarotRecall,
  TarotChecklist,
  TarotWhys,
} from './_active-learning';

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
  {
    q: 'Lá hoàng gia (Thị Đồng, Hiệp Sĩ, Hoàng Hậu, Vua) chỉ ai?',
    a: 'Một lá hoàng gia có thể chỉ (a) một người thật quanh bạn, (b) một mặt của chính bạn, hoặc (c) một kiểu năng lượng, cách hành xử. Khung đọc theo hai trục: cấp bậc cho biết mức trưởng thành của năng lượng — Thị Đồng học việc, Hiệp Sĩ hành động và thái cực, Hoàng Hậu làm chủ từ bên trong, Vua làm chủ hướng ra ngoài; còn chất cho biết lĩnh vực — Gậy ý chí, Cốc cảm xúc, Kiếm tư duy, Tiền thực tế. Nên tự hỏi lá này gợi đến ai hay khía cạnh nào của mình, thay vì chốt cứng "đây là người X".',
  },
  {
    q: 'Bộ Rider–Waite–Smith khác bộ Marseille thế nào?',
    a: 'Marseille là dòng bài cổ hơn: các lá số (Át–10) chỉ vẽ biểu tượng số, và đánh Công Lý = 8, Sức Mạnh = 11. RWS (1909) vẽ cảnh có người trên cả 56 lá Ẩn Phụ nên dễ "đọc tranh" hơn, và đổi thành Sức Mạnh = 8, Công Lý = 11 theo truyền thống Golden Dawn. hieu.asia theo RWS; người quen bộ Marseille có thể thấy hai lá này mang số ngược lại — đó là khác biệt giữa hai hệ, không phải lỗi.',
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
  itemList(
    ALL_PAGES.map((c) => ({ name: c.name_vi, url: '/tarot/y-nghia/' + c.slug })),
  ),
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
      readMeta="15 phút đọc · Cập nhật 2026"
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
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <TarotFrame />,
        },
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
                Dòng lịch sử ngắn: Tarot ra đời khoảng thế kỷ 15 ở Ý dưới tên{' '}
                <em>tarocchi</em> — ban đầu là bài chơi, không phải công cụ bói. Mãi cuối thế kỷ
                18, qua các tác giả Pháp như Court de Gébelin và Etteilla, bộ bài mới được gán
                nghĩa bói toán. Song song đó, dòng <strong>Marseille</strong> cổ điển là hệ phổ
                biến ở châu Âu: các lá số chỉ vẽ biểu tượng, và đánh số vài lá khác với hệ về
                sau (Công Lý = 8, Sức Mạnh = 11).
              </p>
              <p>
                Bộ <strong>Rider–Waite–Smith (RWS)</strong> do A. E. Waite thiết kế ý nghĩa và
                Pamela Colman Smith vẽ, ra mắt tháng 12/1909 (nhà Rider &amp; Co., London); cuốn
                lý giải <em>The Pictorial Key to the Tarot</em> in năm 1911, nay đã vào phạm vi
                công cộng. RWS là bộ được dùng phổ biến nhất thế giới và là chuẩn mà công cụ trên
                hieu.asia bám theo. Điểm cách tân: vẽ cảnh có người trên cả 56 lá Ẩn Phụ, giúp
                "đọc tranh" dễ hơn nhiều so với các bộ trước đó. Một lưu ý bản quyền: tranh của
                Pamela Colman Smith ở các bản in hiện đại (từ bản Rider 1971 của U.S. Games
                Systems trở đi) vẫn còn bản quyền — vì vậy trang này mô tả biểu tượng bằng lời
                thay vì dùng hình chụp lá bài.
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
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <TarotDepth />,
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
            </div>
          ),
        },
        {
          id: 'cot-truyen-so',
          tocLabel: 'Cốt truyện số Át→10',
          heading: 'Cốt truyện số: mạch Át → 10 lặp trong mỗi chất',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Một cách đọc 40 lá số của Ẩn Phụ là theo "cốt truyện số" — một mạch phát triển
                lặp lại ở cả 4 chất, mỗi chất kể mạch ấy trong lĩnh vực của mình:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li><strong>Át:</strong> hạt mầm thuần khiết nhất của chất — cơ hội, tia sáng, khởi điểm.</li>
                <li><strong>2:</strong> lựa chọn, cân bằng đôi, quan hệ hai chiều.</li>
                <li><strong>3:</strong> thành hình bước đầu, hợp tác, mở rộng.</li>
                <li><strong>4:</strong> ổn định, dừng lại, giữ vững — đôi khi thành trì trệ.</li>
                <li><strong>5:</strong> xáo trộn, mất mát, va chạm — thử thách giữa chặng.</li>
                <li><strong>6:</strong> hồi phục, hài hòa lại, cho–nhận, di chuyển.</li>
                <li><strong>7:</strong> đánh giá, kiên trì, chọn lựa khó, đối mặt.</li>
                <li><strong>8:</strong> vận động nhanh, chuyên cần, hoặc rời đi — tùy chất.</li>
                <li><strong>9:</strong> gần trọn — đỉnh cảm xúc của chất, toại nguyện hoặc lo âu.</li>
                <li><strong>10:</strong> trọn vẹn hoặc quá tải — đỉnh điểm, chuyển sang chu kỳ mới.</li>
              </ul>
              <p>
                Ví dụ cùng số 5 qua bốn chất: Năm Gậy là ý kiến va nhau, Năm Cốc là nỗi buồn cho
                phần đã đổ, Năm Kiếm hỏi "thắng keo này mất gì", Năm Tiền là mùa đông vật chất —
                cùng một mô-típ thử thách giữa chặng, mỗi chất một mặt đời.
              </p>
              <p className="text-sm text-foreground/70">
                Đây là khung gợi ý, không phải công thức cứng — sắc thái mỗi lá vẫn khác nhau
                theo chất. Cũng vì vậy công cụ trên hieu.asia viết nghĩa từng lá riêng, không
                sinh máy móc theo số × chất; khi đọc nên ưu tiên nghĩa cụ thể của lá hơn là suy
                từ số.
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
          id: 'hoang-gia',
          tocLabel: '16 lá Hoàng gia',
          heading: '16 lá Hoàng gia — khung hai trục để khỏi nhầm',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                16 lá hoàng gia (court) là nhóm khó đọc nhất, vì một lá có thể chỉ{' '}
                <strong>(a) một người thật</strong> quanh bạn, <strong>(b) một mặt của chính
                bạn</strong>, hoặc <strong>(c) một kiểu năng lượng, cách hành xử</strong>. Khung
                đọc gọn nhất là ghép hai trục: cấp bậc × chất.
              </p>
              <h3 className="text-lg font-semibold text-foreground">
                Trục cấp bậc — mức trưởng thành của năng lượng
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Cấp bậc</th>
                      <th className="py-2 font-semibold">Cách thể hiện năng lượng của chất</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Thị Đồng (Page)</td>
                      <td className="py-2">Học việc, tò mò, tin nhắn/khởi đầu non — "lần đầu chạm vào" chất đó.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Hiệp Sĩ (Knight)</td>
                      <td className="py-2">Hành động, lao đi, thái cực (quá nhiều hoặc quá ít) — phiên bản "đậm và bốc" của chất.</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Hoàng Hậu (Queen)</td>
                      <td className="py-2">Làm chủ chất từ bên trong — nuôi dưỡng, thấu hiểu, hướng nội.</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">Vua (King)</td>
                      <td className="py-2">Làm chủ chất hướng ra ngoài — dẫn dắt, chịu trách nhiệm, quyền lực điềm tĩnh.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Trục chất — lĩnh vực</h3>
              <p>
                Gậy = ý chí/đam mê · Cốc = cảm xúc/quan hệ · Kiếm = tư duy/lời nói · Tiền = thực
                tế/của cải. Ghép hai trục là ra chân dung:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Hoàng Hậu Cốc</strong> = làm chủ cảm xúc từ bên trong: thấu cảm sâu mà
                  vẫn giữ được mình; chiều ngược là chìm trong cảm xúc người khác đến kiệt.
                </li>
                <li>
                  <strong>Hiệp Sĩ Gậy</strong> = phiên bản đậm và bốc của đam mê: lao tới điều
                  mình muốn một cách dứt khoát; chiều ngược là bốc đồng, hứa trong cơn hứng rồi
                  nguội giữa chừng.
                </li>
                <li>
                  <strong>Thị Đồng Tiền</strong> = lần đầu chạm vào chuyện thực tế: học-để-làm,
                  "đồng tiền đầu tiên" nhỏ mà thật; chiều ngược là sưu tầm khóa học, kế hoạch mãi
                  không tới ngày bắt đầu.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Khi rút trúng lá hoàng gia, câu đáng hỏi là: lá này gợi đến ai — hay khía cạnh
                nào của chính mình? Đừng chốt cứng "đây là người X".
              </p>
            </div>
          ),
        },
        {
          id: 'la-nguoc',
          tocLabel: 'Bốn cách luận lá ngược',
          heading: 'Bốn cách luận lá ngược (reversed)',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Khi rút, mỗi lá có thể xuôi (upright) hoặc ngược (reversed). Lá ngược{' '}
                <strong>không tự động xấu</strong>. Bốn cách luận phổ biến — nêu để bạn chọn
                hướng hợp ngữ cảnh, không có cách nào là "duy nhất đúng":
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Nghẽn / chậm lại:</strong> năng lượng xuôi đang bị cản, đến trễ, chưa
                  thông.
                </li>
                <li>
                  <strong>Hướng vào trong:</strong> chủ đề đang diễn ra bên trong hoặc riêng tư,
                  thay vì thể hiện ra ngoài.
                </li>
                <li>
                  <strong>Thái quá hoặc thiếu hụt:</strong> quá liều (Tiết Độ ngược = mất điều
                  độ) hoặc thiếu (Sức Mạnh ngược = thiếu tự tin).
                </li>
                <li>
                  <strong>Đang gỡ / sắp qua:</strong> với các lá "nặng" (Ba Kiếm, Tám Kiếm, Mười
                  Kiếm, Tòa Tháp), chiều ngược thường là dấu phục hồi — vết thương khép, dây trói
                  tuột, đang gượng dậy.
                </li>
              </ul>
              <p>
                Có người đọc <strong>không dùng lá ngược</strong> — đọc tất cả như xuôi, để toàn
                cảnh trải bài quyết sắc thái. Đây là lựa chọn hợp lệ.
              </p>
              <p className="text-sm text-muted-foreground">
                Công cụ trên hieu.asia có rút cả chiều ngược (mỗi lá 50/50 xuôi hay ngược). Bài
                đọc không chốt cứng một trong bốn cách trên mà luôn khung lá ngược là "mặt trầm
                để soi" — một góc nhìn ngược lại, không phải "điềm gở".
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
              <h3 className="text-lg font-semibold text-foreground">Một lá — câu hỏi nhanh, lá-của-ngày</h3>
              <p>
                Rút 1 lá để soi một câu hỏi mở, hoặc làm điểm tựa suy ngẫm trong ngày.
                "Lá-của-ngày" trên hieu.asia là một lá chung cho mọi người, cố định theo ngày
                (giờ Việt Nam) — không phải tiên đoán về ngày của bạn, chỉ là một lá để dừng lại
                và ngẫm. Cách luận: lấy nghĩa cốt lõi cộng một câu hỏi tự soi, rồi tự áp vào tình
                huống thật của mình.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Ba lá — linh hoạt nhất</h3>
              <p>
                Ba lá đọc theo <strong>một trục ý nghĩa chọn trước khi rút</strong>. Các trục
                phổ biến:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Trục</th>
                      <th className="py-2 pr-4 font-semibold">Lá 1</th>
                      <th className="py-2 pr-4 font-semibold">Lá 2</th>
                      <th className="py-2 font-semibold">Lá 3</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Thời gian</td>
                      <td className="py-2 pr-4">Quá khứ</td>
                      <td className="py-2 pr-4">Hiện tại</td>
                      <td className="py-2">Xu hướng nếu giữ nguyên hướng đi</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Tình huống</td>
                      <td className="py-2 pr-4">Tình huống</td>
                      <td className="py-2 pr-4">Hành động nên cân nhắc</td>
                      <td className="py-2">Kết quả khả dĩ</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Phát triển</td>
                      <td className="py-2 pr-4">Điểm mạnh</td>
                      <td className="py-2 pr-4">Điểm cần lưu ý</td>
                      <td className="py-2">Lời khuyên</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">Quan hệ</td>
                      <td className="py-2 pr-4">Bạn</td>
                      <td className="py-2 pr-4">Người kia</td>
                      <td className="py-2">Mối quan hệ giữa hai</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">Quyết định</td>
                      <td className="py-2 pr-4">Lựa chọn A</td>
                      <td className="py-2 pr-4">Lựa chọn B</td>
                      <td className="py-2">Điều cần biết để chọn</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Cách luận: đọc từng lá theo vai trò ô của nó, rồi đọc mối liên hệ giữa ba lá —
                cùng chất? toàn Ẩn Chính? Tổng thể quan trọng hơn từng lá rời.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Celtic Cross (Thập Tự Kelt) — 10 lá, sâu nhất</h3>
              <p>
                Kiểu trải kinh điển nhất, được A. E. Waite phổ biến hóa trong{' '}
                <em>The Pictorial Key to the Tarot</em>. 10 vị trí theo phiên bản phổ biến:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-foreground">
                      <th className="py-2 pr-4 font-semibold">Vị trí</th>
                      <th className="py-2 pr-4 font-semibold">Tên</th>
                      <th className="py-2 font-semibold">Ý nghĩa ô</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">1</td>
                      <td className="py-2 pr-4">Hiện tại / cốt lõi</td>
                      <td className="py-2">Trọng tâm tình huống — "vấn đề là gì"</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">2</td>
                      <td className="py-2 pr-4">Thử thách / chướng ngại</td>
                      <td className="py-2">Lực cản hoặc thứ đang cắt ngang (đặt chéo lên lá 1)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">3</td>
                      <td className="py-2 pr-4">Nền tảng / quá khứ xa</td>
                      <td className="py-2">Gốc rễ, điều bên dưới đã dẫn tới đây</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">4</td>
                      <td className="py-2 pr-4">Quá khứ gần</td>
                      <td className="py-2">Việc vừa qua, đang lùi dần</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">5</td>
                      <td className="py-2 pr-4">Mục tiêu / điều hướng tới</td>
                      <td className="py-2">Điều mình mong, đang nhắm tới (tầng ý thức)</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">6</td>
                      <td className="py-2 pr-4">Tương lai gần</td>
                      <td className="py-2">Bước kế tiếp đang tới</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">7</td>
                      <td className="py-2 pr-4">Bản thân</td>
                      <td className="py-2">Mình đang đứng ở đâu, thái độ của mình trong chuyện này</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">8</td>
                      <td className="py-2 pr-4">Môi trường</td>
                      <td className="py-2">Người khác, hoàn cảnh, ảnh hưởng bên ngoài</td>
                    </tr>
                    <tr className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-foreground">9</td>
                      <td className="py-2 pr-4">Hy vọng &amp; nỗi sợ</td>
                      <td className="py-2">Thường là hai mặt của cùng một điều</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">10</td>
                      <td className="py-2 pr-4">Kết quả khả dĩ</td>
                      <td className="py-2">Xu hướng nếu giữ nguyên đường đi — không phải định mệnh cứng</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Biến thể giữa các trường phái: thứ tự và ý nghĩa lá 4 – lá 5 đôi khi hoán đổi
                giữa các sách; lá 9 có sách gọi "hy vọng/nỗi sợ", có sách gọi "lời khuyên". Khi
                đọc nên nói rõ mình dùng phiên bản nào. Riêng lá 10 luôn là xu hướng nếu không
                đổi gì — quyền tự quyết vẫn ở người hỏi.
              </p>
              <p className="text-sm text-muted-foreground">
                Công cụ Tarot tại hieu.asia hiện trải <strong>một lá</strong> và{' '}
                <strong>ba lá</strong>; Celtic Cross nêu ở đây như kiến thức tham khảo về các kiểu
                trải phổ biến, chưa phải lựa chọn trong công cụ.
              </p>
              <h3 className="text-lg font-semibold text-foreground">Đọc tổng thể một trải bài</h3>
              <p>
                Dù dùng kiểu trải nào, người đọc giỏi nhìn bức tranh chung trước khi chốt từng
                lá:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Tỉ lệ Ẩn Chính:</strong> nhiều Ẩn Chính → chủ đề lớn, bài học sâu,
                  ngoài tầm kiểm soát thường ngày; toàn Ẩn Phụ → chuyện đời thường, trong tầm
                  xoay xở.
                </li>
                <li>
                  <strong>Chất nào áp đảo:</strong> nhiều Kiếm → nặng về đầu óc/xung đột/quyết
                  định; nhiều Cốc → cảm xúc/quan hệ; nhiều Gậy → hành động/đam mê; nhiều Tiền →
                  tiền bạc/thực tế/sức khỏe.
                </li>
                <li>
                  <strong>Số lặp:</strong> nhiều lá cùng số (ví dụ ba lá số 5) → một mô-típ đang
                  lặp ở nhiều mặt đời sống (số 5 = thử thách giữa chặng).
                </li>
                <li>
                  <strong>Lá hoàng gia đông:</strong> nhiều người liên quan đến chuyện này, hoặc
                  nhiều "vai" bạn đang phải đóng cùng lúc.
                </li>
              </ul>
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
          id: 'thu-vien-la',
          tocLabel: 'Thư viện 78 lá',
          heading: 'Thư viện 78 lá bài',
          children: (
            <>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                Mỗi lá dưới đây mở trang ý nghĩa đầy đủ: nghĩa xuôi và nghĩa ngược, góc tình cảm –
                công việc, cùng những câu hỏi tự soi. Đọc như lăng kính để hiểu mình — tham khảo,
                không phán định.
              </p>

              <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">
                22 Ẩn Chính
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {MAJOR_PAGES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/tarot/y-nghia/${c.slug}`}
                    className="group rounded-lg border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
                  >
                    <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                      Ẩn Chính · {c.number}
                    </p>
                    <p className="mt-1.5 font-heading text-base font-semibold text-foreground group-hover:text-gold">
                      {c.name_vi} · {c.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {c.keyUp.slice(0, 3).join(' · ')}
                    </p>
                  </Link>
                ))}
              </div>

              <h3 className="mb-3 mt-8 font-heading text-lg font-semibold text-foreground">
                56 Ẩn Phụ
              </h3>
              <div className="space-y-6">
                {['Gậy', 'Cốc', 'Kiếm', 'Tiền'].map((suit) => (
                  <div key={suit}>
                    <p className="mb-3 font-mono text-[13px] uppercase tracking-[0.14em] text-gold-700">
                      Chất {suit}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {MINOR_PAGES.filter((c) => c.suit_vi === suit).map((c) => (
                        <Link
                          key={c.slug}
                          href={`/tarot/y-nghia/${c.slug}`}
                          className="group rounded-lg border border-border bg-card/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-card/60"
                        >
                          <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                            {c.suit_vi}
                          </p>
                          <p className="mt-1.5 font-heading text-base font-semibold text-foreground group-hover:text-gold">
                            {c.name_vi} · {c.name}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {c.keyUp.slice(0, 3).join(' · ')}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          id: 'thuat-ngu',
          tocLabel: 'Sổ tay thuật ngữ',
          heading: 'Sổ tay thuật ngữ Tarot',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Các từ hay gặp khi đọc về Tarot — nghĩa ngắn gọn theo cách dùng trên trang này:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Ẩn Chính (Major Arcana):</strong> 22 lá đánh số 0–21, mỗi lá một
                  nguyên mẫu lớn — chủ đề lớn, bước ngoặt, bài học cốt lõi.
                </li>
                <li>
                  <strong>Ẩn Phụ (Minor Arcana):</strong> 56 lá chia 4 chất — đời sống thường
                  ngày, tình huống cụ thể.
                </li>
                <li>
                  <strong>Chất (Suit):</strong> một trong bốn nhóm của Ẩn Phụ: Gậy, Cốc, Kiếm,
                  Tiền; mỗi chất ứng một nguyên tố và một lĩnh vực đời sống.
                </li>
                <li>
                  <strong>Lá số (Pip):</strong> 40 lá Át–10 của Ẩn Phụ — đọc được theo "cốt
                  truyện số" lặp ở cả bốn chất.
                </li>
                <li>
                  <strong>Lá hoàng gia (Court):</strong> 16 lá Thị Đồng, Hiệp Sĩ, Hoàng Hậu, Vua
                  — chỉ một người, một vai, hoặc một mặt của chính mình.
                </li>
                <li>
                  <strong>Xuôi (Upright):</strong> chiều thuận của lá khi rút — chủ đề đang ở
                  mặt "thuận, đang vận hành".
                </li>
                <li>
                  <strong>Ngược (Reversed):</strong> lá lật ngược khi rút — mặt trầm của cùng
                  năng lượng: nghẽn, hướng vào trong, thái quá/thiếu hụt, hoặc đang gỡ. Không
                  phải điềm gở.
                </li>
                <li>
                  <strong>Trải bài (Spread):</strong> cách xếp nhiều lá vào các ô có vai trò
                  định trước — một lá, ba lá, Celtic Cross…
                </li>
                <li>
                  <strong>Người hỏi (Querent):</strong> người đặt câu hỏi cho lượt rút. Trên
                  hieu.asia, cũng là người giữ câu trả lời.
                </li>
                <li>
                  <strong>RWS (Rider–Waite–Smith):</strong> bộ bài ra mắt 1909, A. E. Waite
                  thiết kế ý nghĩa, Pamela Colman Smith vẽ — chuẩn mà công cụ ở đây bám theo.
                </li>
                <li>
                  <strong>Marseille:</strong> dòng bài cổ điển châu Âu trước RWS — lá số chỉ vẽ
                  biểu tượng, đánh Công Lý = 8, Sức Mạnh = 11.
                </li>
                <li>
                  <strong>Golden Dawn:</strong> truyền thống huyền học ảnh hưởng tới Waite —
                  nguồn của cách gán Gậy = Lửa, Kiếm = Khí và cách đánh số Sức Mạnh = 8, Công Lý
                  = 11.
                </li>
                <li>
                  <strong>Hành trình Gã Khờ:</strong> cách đọc 22 Ẩn Chính như một hành trình
                  trưởng thành ba chặng (diễn giải phổ biến, gắn với Eden Gray).
                </li>
                <li>
                  <strong>Celtic Cross (Thập Tự Kelt):</strong> trải bài 10 lá kinh điển, được
                  Waite phổ biến hóa trong <em>The Pictorial Key to the Tarot</em>.
                </li>
                <li>
                  <strong>Lá-của-ngày:</strong> một lá rút chung, cố định theo ngày, để dừng lại
                  và ngẫm — không phải tiên đoán về ngày của bạn.
                </li>
              </ul>
            </div>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <TarotWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <TarotRecall />,
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
          children: <TarotChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
