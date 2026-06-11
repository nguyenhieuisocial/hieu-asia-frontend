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
  title: 'Enneagram — 9 nhóm tính cách & 3 trung tâm | Học huyền học',
  description:
    'Enneagram mô tả 9 nhóm tính cách theo động lực sâu bên trong (điều bạn sợ và điều bạn khao khát), chia theo 3 trung tâm: Bản năng, Tình cảm, Lý trí. Bản đồ để hiểu mình, không phải nhãn.',
  alternates: { canonical: 'https://hieu.asia/learn/enneagram' },
};

// 9 nhóm Enneagram — mô tả theo ĐỘNG LỰC bên trong (sợ gì / muốn gì), không
// phải hành vi bề mặt. Không nhóm nào "tốt/xấu" hơn.
const TYPES: { n: number; vi: string; en: string; core: string }[] = [
  { n: 1, vi: 'Người cải cách', en: 'Reformer', core: 'Khao khát đúng đắn, sợ sai/khiếm khuyết — kỷ luật, có nguyên tắc.' },
  { n: 2, vi: 'Người tương trợ', en: 'Helper', core: 'Khao khát được cần đến, sợ vô dụng — ấm áp, quan tâm người khác.' },
  { n: 3, vi: 'Người tham vọng', en: 'Achiever', core: 'Khao khát giá trị qua thành tựu, sợ thất bại — hiệu quả, hướng mục tiêu.' },
  { n: 4, vi: 'Người cá tính', en: 'Individualist', core: 'Khao khát bản sắc riêng, sợ tầm thường — sâu sắc, giàu cảm xúc.' },
  { n: 5, vi: 'Người quan sát', en: 'Investigator', core: 'Khao khát hiểu biết, sợ cạn kiệt/bất lực — độc lập, ham tri thức.' },
  { n: 6, vi: 'Người trung thành', en: 'Loyalist', core: 'Khao khát an toàn, sợ mất chỗ dựa — tận tâm, cảnh giác, đáng tin.' },
  { n: 7, vi: 'Người nhiệt huyết', en: 'Enthusiast', core: 'Khao khát trải nghiệm, sợ bị giới hạn/đau khổ — lạc quan, linh hoạt.' },
  { n: 8, vi: 'Người thủ lĩnh', en: 'Challenger', core: 'Khao khát tự chủ, sợ bị kiểm soát — mạnh mẽ, bảo vệ người yếu.' },
  { n: 9, vi: 'Người ôn hoà', en: 'Peacemaker', core: 'Khao khát bình yên, sợ xung đột/chia cắt — điềm đạm, dễ hoà hợp.' },
];

const CENTERS: { name: string; types: string; theme: string }[] = [
  { name: 'Trung tâm Bản năng (Bụng)', types: 'Nhóm 8 · 9 · 1', theme: 'Xoay quanh sự giận dữ và quyền kiểm soát — phản ứng theo bản năng "đúng/sai".' },
  { name: 'Trung tâm Tình cảm (Tim)', types: 'Nhóm 2 · 3 · 4', theme: 'Xoay quanh hình ảnh bản thân và cảm xúc — quan tâm mình được nhìn nhận thế nào.' },
  { name: 'Trung tâm Lý trí (Đầu)', types: 'Nhóm 5 · 6 · 7', theme: 'Xoay quanh nỗi lo và sự an toàn — xử lý bằng suy nghĩ, lên kế hoạch.' },
];

export default function LearnEnneagramPage() {
  return (
    <LearnArticle
      eyebrow="Tâm lý · Bản đồ 9 nhóm"
      title={
        <>
          Enneagram — <span className="bg-gold-gradient bg-clip-text text-transparent">9 nhóm tính cách</span>
        </>
      }
      standfirst={
        <>
          Enneagram xếp con người thành chín nhóm dựa trên <em>động lực sâu bên trong</em> — điều bạn
          khao khát và điều bạn sợ — chứ không phải hành vi bề mặt. Đó là lý do hai người trông rất
          khác nhau vẫn có thể cùng một nhóm. Hãy xem nó như <em>bản đồ để hiểu mình</em>, không phải
          chiếc hộp để nhốt.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: 'Enneagram' },
      ]}
      relatedLenses={relatedLearnLenses('enneagram')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Trả lời bộ câu hỏi Enneagram để tìm nhóm chính của bạn, kèm luận giải cá nhân hoá về động lực, điểm mạnh và điều cần để ý — mô tả xu hướng, không phán định mệnh.',
        href: '/enneagram',
        label: 'Làm trắc nghiệm Enneagram',
      }}
      sections={[
        {
          id: 'chin-nhom',
          tocLabel: 'Chín nhóm',
          heading: 'Chín nhóm tính cách',
          children: (
            <ul className="space-y-3">
              {TYPES.map((t) => (
                <li key={t.n} className="flex gap-3 border-t border-border/60 pt-3 first:border-0 first:pt-0">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 font-heading text-sm text-gold-700">
                    {t.n}
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-base text-foreground">{t.vi}</span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                        {t.en}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{t.core}</p>
                  </div>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'ba-trung-tam',
          tocLabel: 'Ba trung tâm',
          heading: 'Ba trung tâm',
          children: (
            <ul className="space-y-4">
              {CENTERS.map((c) => (
                <li key={c.name} className="border-t border-border/60 pt-4 first:border-0 first:pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-base text-foreground">{c.name}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {c.types}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{c.theme}</p>
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
              <AccordionItem value="wing" className="rounded border border-border px-4">
                <AccordionTrigger>"Cánh" (wing) là gì?</AccordionTrigger>
                <AccordionContent>
                  Mỗi nhóm chịu ảnh hưởng từ một trong hai nhóm liền kề trên vòng tròn — gọi là{' '}
                  <em>cánh</em>. Ví dụ nhóm 9 có thể nghiêng cánh 1 (kỷ luật hơn) hoặc cánh 8 (quyết
                  liệt hơn). Cánh giải thích vì sao hai người cùng nhóm vẫn có sắc thái riêng.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="arrows" className="rounded border border-border px-4">
                <AccordionTrigger>Khi căng thẳng / khi phát triển thì sao?</AccordionTrigger>
                <AccordionContent>
                  Enneagram có các "mũi tên" nối các nhóm: lúc <em>căng thẳng</em> bạn có xu hướng mượn
                  nét (thường là mặt kém) của một nhóm khác; lúc <em>thoải mái, trưởng thành</em> bạn
                  hấp thụ nét tốt của một nhóm khác. Đây là điểm khiến Enneagram thiên về <em>phát
                  triển</em> hơn là dán nhãn.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="vs-mbti" className="rounded border border-border px-4">
                <AccordionTrigger>Khác MBTI ở chỗ nào?</AccordionTrigger>
                <AccordionContent>
                  MBTI mô tả <em>cách bạn tư duy và tiếp nhận thông tin</em>; Enneagram đào vào{' '}
                  <em>động lực và nỗi sợ cốt lõi</em> đứng sau hành vi. Nhiều người thấy Enneagram chạm
                  sâu hơn về "vì sao tôi như vậy", còn MBTI tiện để mô tả phong cách làm việc. Hai góc
                  nhìn bổ sung nhau.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="caution" className="rounded border border-border px-4">
                <AccordionTrigger>Cần lưu ý gì?</AccordionTrigger>
                <AccordionContent>
                  Enneagram là bản đồ để soi mình, không phải lời tiên tri. Đừng dùng số nhóm để bào
                  chữa ("tôi nhóm 8 nên mới gắt") hay đóng khung người khác. hieu.asia mô tả động lực
                  như một góc nhìn để bạn hiểu và tự quyết — kết hợp với các lăng kính khác.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ),
        },
      ]}
    />
  );
}
