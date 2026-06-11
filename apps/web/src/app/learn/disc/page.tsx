import type { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@hieu-asia/ui';
import { LearnArticle } from '@/components/learn/LearnArticle';
import { relatedLearnLenses } from '@/lib/learn/related';

export const metadata: Metadata = {
  title: 'DISC — 4 nhóm hành vi (D/I/S/C) | Học huyền học',
  description:
    'DISC mô tả 4 thiên hướng hành vi: Thống trị (D), Ảnh hưởng (I), Kiên định (S), Tuân thủ (C). Cách bạn phản ứng với thử thách và con người — xu hướng, không phải nhãn cố định.',
  alternates: { canonical: 'https://hieu.asia/learn/disc' },
};

// 4 nhóm hành vi DISC (Marston, 1928 — miền công cộng). Mỗi nhóm mô tả thiên
// hướng ở mức cao; không nhóm nào "tốt/xấu" hơn — mỗi kiểu mạnh ở bối cảnh khác.
const STYLES: { letter: string; vi: string; en: string; drive: string; strength: string; watch: string }[] = [
  {
    letter: 'D',
    vi: 'Thống trị',
    en: 'Dominance',
    drive: 'Hướng kết quả, thích kiểm soát và ra quyết định nhanh.',
    strength: 'Quyết đoán, dám nhận thử thách, đẩy việc về đích.',
    watch: 'Dễ nóng vội, lấn át người khác khi gấp.',
  },
  {
    letter: 'I',
    vi: 'Ảnh hưởng',
    en: 'Influence',
    drive: 'Hướng con người, thích kết nối, truyền cảm hứng và thuyết phục.',
    strength: 'Cởi mở, nhiệt tình, tạo không khí và lan toả năng lượng.',
    watch: 'Dễ sa đà cảm xúc, ngại chi tiết và việc đơn điệu.',
  },
  {
    letter: 'S',
    vi: 'Kiên định',
    en: 'Steadiness',
    drive: 'Hướng ổn định, coi trọng sự hoà hợp và nhịp đều đặn.',
    strength: 'Điềm đạm, kiên nhẫn, đáng tin, lắng nghe tốt.',
    watch: 'Ngại thay đổi đột ngột, khó nói "không".',
  },
  {
    letter: 'C',
    vi: 'Tuân thủ',
    en: 'Conscientiousness',
    drive: 'Hướng chuẩn mực, coi trọng độ chính xác và chất lượng.',
    strength: 'Cẩn thận, phân tích kỹ, làm đúng quy trình.',
    watch: 'Dễ cầu toàn, chần chừ khi thiếu dữ liệu.',
  },
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
          id: 'bon-nhom',
          tocLabel: 'Bốn nhóm (DISC)',
          heading: 'Bốn nhóm hành vi',
          children: (
            <ul className="space-y-4">
              {STYLES.map((s) => (
                <li key={s.letter} className="border-t border-border/60 pt-4 first:border-0 first:pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-base text-gold-700">{s.letter}</span>
                    <span className="font-heading text-base text-foreground">{s.vi}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {s.en}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{s.drive}</p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <p className="text-sm leading-relaxed text-foreground/85">
                      <span className="font-medium text-gold-700">Điểm mạnh · </span>{s.strength}
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/85">
                      <span className="font-medium text-muted-foreground">Cần để ý · </span>{s.watch}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'giai-thich',
          tocLabel: 'Giải thích chi tiết',
          heading: 'Giải thích chi tiết',
          children: (
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="two-axes" className="rounded border border-border px-4">
                <AccordionTrigger>Bốn nhóm sắp xếp theo logic nào?</AccordionTrigger>
                <AccordionContent>
                  DISC nằm trên hai trục: <em>nhịp độ</em> (nhanh – quyết liệt ↔ chậm – ôn hoà) và{' '}
                  <em>trọng tâm</em> (việc ↔ người). D = nhanh + việc, I = nhanh + người, S = chậm +
                  người, C = chậm + việc. Hiểu hai trục giúp bạn đoán phong cách của người đối diện để
                  giao tiếp hợp hơn.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="vs-mbti" className="rounded border border-border px-4">
                <AccordionTrigger>Khác MBTI và Big Five ở chỗ nào?</AccordionTrigger>
                <AccordionContent>
                  DISC tập trung vào <em>hành vi quan sát được</em> — cách bạn cư xử ở công sở, nhóm —
                  nên rất hợp để cải thiện giao tiếp và làm việc nhóm. MBTI thiên về <em>cách bạn suy
                  nghĩ</em>, Big Five đo <em>tính cách nền</em> có cơ sở khoa học. Ba lăng kính bổ sung
                  nhau; hieu.asia đọc cả ba như những góc nhìn khác nhau về cùng một con người.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="blend" className="rounded border border-border px-4">
                <AccordionTrigger>Tôi có thể vừa D vừa S không?</AccordionTrigger>
                <AccordionContent>
                  Có. Hầu hết mọi người mạnh ở một hoặc hai nhóm và nhạt hơn ở các nhóm còn lại — DISC
                  đo <em>tỉ lệ</em> chứ không xếp bạn vào một ô duy nhất. Phong cách cũng có thể đổi
                  theo vai trò (ở nhà khác ở công ty).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="caution" className="rounded border border-border px-4">
                <AccordionTrigger>Cần lưu ý gì?</AccordionTrigger>
                <AccordionContent>
                  DISC mô tả phong cách hành vi ở thời điểm làm bài, không phải năng lực hay giá trị con
                  người, và không cố định cả đời. Dùng nó để hiểu mình, giao tiếp tốt hơn và tự quyết —
                  không để dán nhãn hay đánh giá ai.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ),
        },
      ]}
    />
  );
}
