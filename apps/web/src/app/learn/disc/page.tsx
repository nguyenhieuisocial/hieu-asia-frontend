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
import { article, breadcrumb, course, faqPage, itemList } from '@/lib/seo/jsonld';
import {
  DiscFrame,
  DiscDepth,
  DiscRecall,
  DiscChecklist,
  DiscWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: 'DISC — 4 nhóm hành vi (D/I/S/C) | Học huyền học',
  description:
    'DISC: 4 thiên hướng hành vi — Thống trị (D), Ảnh hưởng (I), Kiên định (S), Tuân thủ (C). Cách bạn phản ứng với thử thách và con người — xu hướng, không nhãn.',
  alternates: { canonical: 'https://hieu.asia/learn/disc' },
};

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (Accordion) → chữ
// schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS = [
  {
    q: 'Bốn nhóm sắp xếp theo logic nào?',
    a: 'DISC nằm trên hai trục: nhịp độ (nhanh – quyết liệt ↔ chậm – ôn hoà) và trọng tâm (việc ↔ người). D = nhanh + việc, I = nhanh + người, S = chậm + người, C = chậm + việc. Hiểu hai trục giúp bạn đoán phong cách của người đối diện để giao tiếp hợp hơn.',
  },
  {
    q: 'Khác MBTI và Big Five ở chỗ nào?',
    a: 'DISC tập trung vào hành vi quan sát được — cách bạn cư xử ở công sở, nhóm — nên rất hợp để cải thiện giao tiếp và làm việc nhóm. MBTI thiên về cách bạn suy nghĩ, Big Five đo tính cách nền có cơ sở khoa học. Ba lăng kính bổ sung nhau; hieu.asia đọc cả ba như những góc nhìn khác nhau về cùng một con người.',
  },
  {
    q: 'Tôi có thể vừa D vừa S không?',
    a: 'Có. Hầu hết mọi người mạnh ở một hoặc hai nhóm và nhạt hơn ở các nhóm còn lại — DISC đo tỉ lệ chứ không xếp bạn vào một ô duy nhất. Phong cách cũng có thể đổi theo vai trò (ở nhà khác ở công ty).',
  },
  {
    q: 'Cần lưu ý gì?',
    a: 'DISC mô tả phong cách hành vi ở thời điểm làm bài, không phải năng lực hay giá trị con người, và không cố định cả đời. Dùng nó để hiểu mình, giao tiếp tốt hơn và tự quyết — không để dán nhãn hay đánh giá ai.',
  },
  {
    q: 'DISC bắt nguồn từ đâu?',
    a: 'Ý tưởng gốc là của nhà tâm lý William Moulton Marston, trong cuốn Emotions of Normal People (1928). Ông mô tả bốn khuynh hướng cảm xúc và hành vi; các bảng trắc nghiệm DISC quen thuộc ngày nay do nhiều công ty phát triển về sau. Lý thuyết gốc thuộc miền công cộng, còn các bản thương mại như DiSC® là thương hiệu riêng của từng nhà cung cấp.',
  },
  {
    q: 'Vì sao gần như không ai "thuần" một nhóm?',
    a: 'DISC đo tỉ lệ cả bốn nhóm cùng lúc, nên hầu hết mọi người là một pha trộn: trội một đến hai nhóm và nhạt hơn ở phần còn lại. Bốn nhóm là bốn hướng trên hai trục, không phải bốn cái ô rời để nhốt người vào — nên "D thuần" hay "S thuần" là trường hợp hiếm, không phải mặc định.',
  },
  {
    q: 'Có nên dùng DISC để tuyển dụng không?',
    a: 'Không nên dùng làm công cụ tuyển hay loại người. DISC mô tả phong cách giao tiếp ở thời điểm làm bài, không đo năng lực, đạo đức hay khả năng thành công. Nó hợp để một nhóm hiểu nhau và phối hợp trơn hơn, không hợp để phán ai xứng đáng vị trí nào.',
  },
  {
    q: 'DISC chặt về khoa học tới đâu so với Big Five?',
    a: 'Big Five có nền thực nghiệm dày hơn và đo trên các dải liên tục. DISC là một lăng kính tiện dụng để nói về hành vi trong công việc; các nhà tâm trắc học chỉ ra rằng bản tự đánh giá kiểu ép-chọn khiến khó so điểm giữa người này với người kia. Hãy xem DISC như ngôn ngữ chung cho giao tiếp, không phải một phép đo chính xác về tính cách.',
  },
];

// 4 nhóm hành vi DISC (Marston, 1928 — miền công cộng). Mỗi nhóm mô tả thiên
// hướng ở mức cao; không nhóm nào "tốt/xấu" hơn — mỗi kiểu mạnh ở bối cảnh khác.
const STYLES: {
  letter: string;
  vi: string;
  en: string;
  drive: string;
  detail: string;
  strength: string;
  watch: string;
}[] = [
  {
    letter: 'D',
    vi: 'Thống trị',
    en: 'Dominance',
    drive: 'Hướng kết quả, thích kiểm soát và ra quyết định nhanh.',
    detail:
      'Nhóm D lấy kết quả làm kim chỉ nam. Họ quyết nhanh, nói thẳng và không ngại nhận phần khó. Trong nhóm, họ thường là người phá thế bí và đẩy việc qua điểm nghẽn. Mặt cần để ý là dễ sốt ruột với người chậm hơn và đôi khi quên hỏi ý người khác. Hiểu rằng sự thẳng thừng của họ nhắm vào việc chứ không vào người sẽ dễ làm việc cùng hơn.',
    strength: 'Quyết đoán, dám nhận thử thách, đẩy việc về đích.',
    watch: 'Dễ nóng vội, lấn át người khác khi gấp.',
  },
  {
    letter: 'I',
    vi: 'Ảnh hưởng',
    en: 'Influence',
    drive: 'Hướng con người, thích kết nối, truyền cảm hứng và thuyết phục.',
    detail:
      'Nhóm I sống bằng kết nối và sự hào hứng. Họ mở lời trước, thuyết phục giỏi và kéo cả nhóm vào một tâm trạng tích cực. Đặt họ ở nơi cần gây thiện cảm và khơi động lực, họ toả sáng. Mặt cần để ý là dễ bỏ dở chi tiết và ngại việc lặp lại một mình. Khi có người lo phần theo dõi sát, người I giữ được đà đến cùng.',
    strength: 'Cởi mở, nhiệt tình, tạo không khí và lan toả năng lượng.',
    watch: 'Dễ sa đà cảm xúc, ngại chi tiết và việc đơn điệu.',
  },
  {
    letter: 'S',
    vi: 'Kiên định',
    en: 'Steadiness',
    drive: 'Hướng ổn định, coi trọng sự hoà hợp và nhịp đều đặn.',
    detail:
      'Nhóm S giữ nhịp và sự hoà thuận cho tập thể. Họ điềm đạm, kiên nhẫn, lắng nghe kỹ và bền bỉ với việc đã nhận. Trong lúc căng thẳng, họ thường là chỗ dựa lặng lẽ mà ai cũng cần. Mặt cần để ý là ngại thay đổi gấp và khó nói "không". Báo trước và hỏi thẳng ý họ sẽ giúp họ mở lời nhiều hơn.',
    strength: 'Điềm đạm, kiên nhẫn, đáng tin, lắng nghe tốt.',
    watch: 'Ngại thay đổi đột ngột, khó nói "không".',
  },
  {
    letter: 'C',
    vi: 'Tuân thủ',
    en: 'Conscientiousness',
    drive: 'Hướng chuẩn mực, coi trọng độ chính xác và chất lượng.',
    detail:
      'Nhóm C theo đuổi sự đúng và chất lượng. Họ phân tích kỹ, coi trọng dữ liệu và làm theo quy trình rõ ràng. Giao việc cần độ chính xác cao, họ là hàng rào chặn lỗi đáng tin. Mặt cần để ý là dễ cầu toàn và chần chừ khi dữ liệu chưa đủ. Nói rõ tiêu chí ngay từ đầu sẽ giúp họ quyết nhanh hơn mà vẫn giữ chuẩn.',
    strength: 'Cẩn thận, phân tích kỹ, làm đúng quy trình.',
    watch: 'Dễ cầu toàn, chần chừ khi thiếu dữ liệu.',
  },
];

const JSONLD = [
  article({
    headline: 'DISC — 4 nhóm hành vi (D/I/S/C)',
    description:
      'DISC mô tả 4 thiên hướng hành vi: Thống trị (D), Ảnh hưởng (I), Kiên định (S), Tuân thủ (C). Cách bạn phản ứng với thử thách và con người — xu hướng, không phải nhãn cố định.',
    url: '/learn/disc',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'DISC', url: '/learn/disc' },
  ]),
  faqPage(FAQS),
  course({
    // Course entity name = tên khoá sạch, KHÔNG gắn hậu tố chuyên mục
    // "| Học huyền học": DISC là mô hình tâm lý học (Marston), không phải huyền học.
    // metadata.title (canonical) giữ nguyên — đổi title là quyết định của founder.
    name: 'DISC — 4 nhóm hành vi (D/I/S/C)',
    description:
      'DISC: 4 thiên hướng hành vi — Thống trị (D), Ảnh hưởng (I), Kiên định (S), Tuân thủ (C). Cách bạn phản ứng với thử thách và con người — xu hướng, không nhãn.',
    url: '/learn/disc',
  }),
  itemList(
    STYLES.map((s) => ({
      name: `${s.letter} — ${s.vi} (${s.en})`,
      url: `/learn/disc/${s.letter.toLowerCase()}`,
    })),
  ),
];

export default function LearnDiscPage() {
  return (
    <LearnArticle
      eyebrow="Tâm lý học · William Marston"
      title={
        <>
          DISC — <span className="bg-gold-gradient bg-clip-text text-transparent">4 nhóm hành vi</span>
        </>
      }
      standfirst={
        <>
          DISC mô tả <em>cách bạn cư xử</em> trước thử thách và con người, qua bốn thiên hướng:
          Thống trị (D), Ảnh hưởng (I), Kiên định (S), Tuân thủ (C). Mỗi người là một{' '}
          <em>pha trộn</em> của cả bốn ở mức khác nhau — không có kiểu nào tốt hay xấu hơn, chỉ là
          phong cách tự nhiên.
        </>
      }
      readMeta="5 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'DISC' },
      ]}
      relatedLenses={relatedLearnLenses('disc')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Trả lời bộ câu hỏi DISC ngắn để xem tỉ lệ bốn nhóm hành vi của bạn, kèm một bản luận giải cá nhân hoá — mô tả phong cách, không phán định mệnh.',
        href: '/disc',
        label: 'Làm trắc nghiệm DISC',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <DiscFrame />,
        },
        {
          id: 'tu-marston',
          tocLabel: 'Từ Marston đến nay',
          heading: 'Từ Marston đến DISC hiện đại',
          children: (
            <div className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
              <p>
                DISC không ra đời như một bài trắc nghiệm. Năm 1928, nhà tâm lý William Moulton
                Marston in cuốn <em>Emotions of Normal People</em>, mô tả cách con người phản ứng với
                môi trường qua bốn khuynh hướng cảm xúc và hành vi. Ông quan tâm hành vi của người
                bình thường trong đời sống, không phải bệnh lý.
              </p>
              <p>
                Bản thân Marston không dựng bảng câu hỏi để đo bốn nhóm. Việc đó do nhiều công ty làm
                về sau, mỗi bên một bộ câu hỏi riêng. Vì lý thuyết gốc thuộc miền công cộng, ai cũng
                có thể xây bản DISC của mình; còn những cái tên có ký hiệu thương hiệu như DiSC® là sản
                phẩm riêng của từng nhà cung cấp, không phải một chuẩn chung. Bản trắc nghiệm trên
                hieu.asia là một bộ rút gọn, dùng để tham khảo.
              </p>
              <p>
                Một chi tiết dễ nhớ về Marston: ông cũng là người nghĩ ra nhân vật Wonder Woman, xuất
                hiện khoảng đầu thập niên 1940. Cùng một con người quan tâm tới ý chí, sự chi phối và
                ảnh hưởng giữa người với người — mối bận tâm đó in dấu trong cả lý thuyết hành vi lẫn
                nhân vật truyện tranh ông tạo ra.
              </p>
            </div>
          ),
        },
        {
          id: 'bon-nhom',
          tocLabel: 'Bốn nhóm (DISC)',
          heading: 'Bốn nhóm hành vi',
          children: (
            <ul className="space-y-4">
              {STYLES.map((s) => (
                <li key={s.letter} className="border-t border-border/60 first:border-0">
                  <Link
                    href={`/learn/disc/${s.letter.toLowerCase()}`}
                    className="group block rounded-lg py-4 transition hover:bg-card/40"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-base text-gold-700 group-hover:text-gold">
                        {s.letter}
                      </span>
                      <span className="font-heading text-base text-foreground group-hover:text-gold">
                        {s.vi}
                      </span>
                      <span className="font-mono text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
                        {s.en}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto text-sm text-muted-foreground group-hover:text-gold"
                      >
                        →
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.drive}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <p className="text-sm leading-relaxed text-foreground/85">
                        <span className="font-medium text-gold-700">Điểm mạnh · </span>{s.strength}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/85">
                        <span className="font-medium text-muted-foreground">Cần để ý · </span>{s.watch}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'so-do-2-truc',
          tocLabel: 'Sơ đồ 2 trục',
          heading: 'Sơ đồ hai trục',
          children: (
            <div>
              <p className="mb-4 text-[15px] leading-relaxed text-foreground/85">
                Bốn nhóm là bốn góc sinh ra từ hai câu hỏi: bạn đi <strong>nhanh hay từ tốn</strong>,
                và bạn để ý <strong>việc hay người</strong>. Đọc theo hàng (nhịp độ) và theo cột
                (trọng tâm) để thấy vì sao D–S và I–C là hai cặp đối nhau.
              </p>
              <div className="grid grid-cols-[auto_1fr_1fr] gap-2 sm:gap-3">
                {/* Hàng nhãn cột */}
                <div aria-hidden />
                <div className="text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                  Hướng việc
                </div>
                <div className="text-center font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                  Hướng người
                </div>

                {/* Hàng 1: nhanh */}
                <div className="flex items-center justify-center text-center font-mono text-[11px] uppercase leading-tight tracking-[0.1em] text-muted-foreground sm:text-xs">
                  Nhanh, quyết liệt
                </div>
                <div className="rounded-lg border border-gold/25 bg-card/40 p-3 sm:p-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading text-lg text-gold-700">D</span>
                    <span className="font-heading text-sm text-foreground">Thống trị</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Nhanh + việc: dồn sức về kết quả.
                  </p>
                </div>
                <div className="rounded-lg border border-gold/25 bg-card/40 p-3 sm:p-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading text-lg text-gold-700">I</span>
                    <span className="font-heading text-sm text-foreground">Ảnh hưởng</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Nhanh + người: kết nối, truyền cảm hứng.
                  </p>
                </div>

                {/* Hàng 2: chậm */}
                <div className="flex items-center justify-center text-center font-mono text-[11px] uppercase leading-tight tracking-[0.1em] text-muted-foreground sm:text-xs">
                  Chậm, ôn hoà
                </div>
                <div className="rounded-lg border border-border bg-card/40 p-3 sm:p-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading text-lg text-gold-700">C</span>
                    <span className="font-heading text-sm text-foreground">Tuân thủ</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Chậm + việc: chính xác, đúng quy trình.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card/40 p-3 sm:p-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-heading text-lg text-gold-700">S</span>
                    <span className="font-heading text-sm text-foreground">Kiên định</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Chậm + người: ổn định, giữ hoà hợp.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Đi vòng D → I → S → C, mỗi bước chỉ đổi một trục. Hai nhóm chéo góc (D–S, I–C) khác
                nhau ở cả hai trục nên là cặp đối nhau. Đây là &ldquo;phổ&rdquo;, không phải bốn cái ô:
                một người thường nằm gần một góc kèm ảnh hưởng của góc liền kề.
              </p>
            </div>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <DiscDepth />,
        },
        {
          id: 'gioi-han',
          tocLabel: 'Giới hạn',
          heading: 'Giới hạn — đọc cho sòng phẳng',
          children: (
            <div className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
              <p>DISC hữu ích, nhưng nói cho sòng phẳng thì nó có vài giới hạn nên nhớ.</p>
              <ul className="space-y-3">
                <li className="border-l-2 border-gold/40 pl-4">
                  Bản tự đánh giá kiểu ép-chọn (chọn từ hợp nhất trong một nhóm từ) khiến điểm của bạn
                  khó đem so trực tiếp với điểm người khác. Nó cho biết bạn nghiêng về đâu trong chính
                  mình, hơn là xếp hạng bạn với thiên hạ.
                </li>
                <li className="border-l-2 border-gold/40 pl-4">
                  Bốn nhóm là một cách nhìn tiện dụng, không phải cấu trúc tính cách đầy đủ. Nếu cần
                  một mô tả có nền thực nghiệm dày hơn, Big Five với năm chiều liên tục là lựa chọn kỹ
                  hơn.
                </li>
                <li className="border-l-2 border-gold/40 pl-4">
                  DISC hợp làm ngôn ngữ chung cho giao tiếp và làm việc nhóm. Nó không hợp làm công cụ
                  tuyển chọn hay đo năng lực — dùng sai chỗ dễ biến một lăng kính thành cái nhãn oan
                  cho người ta.
                </li>
              </ul>
              <p>
                Đặt đúng chỗ, DISC giúp một nhóm hiểu nhau nhanh. Đặt sai chỗ, nó thành cái hộp. Trình
                bày cả giá trị lẫn giới hạn như vậy là chủ ý của hieu.asia.
              </p>
            </div>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="rounded border border-border px-4">
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ),
        },
        {
          id: 'nam-lan-tai-sao',
          tocLabel: '5 lần hỏi tại sao',
          heading: 'Đào tới gốc: 5 lần hỏi “tại sao”',
          children: <DiscWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <DiscRecall />,
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <DiscChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
