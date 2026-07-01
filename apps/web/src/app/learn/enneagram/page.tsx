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
import { article, breadcrumb, faqPage, itemList } from '@/lib/seo/jsonld';
import { listTypes } from '@/lib/enneagram-type-data';
import {
  EnneagramFrame,
  EnneagramDepth,
  EnneagramRecall,
  EnneagramChecklist,
  EnneagramWhys,
} from './_active-learning';

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

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (Accordion) → chữ
// schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS: { value: string; q: string; a: string }[] = [
  {
    value: 'wing',
    q: '"Cánh" (wing) là gì?',
    a: 'Mỗi nhóm chịu ảnh hưởng từ một trong hai nhóm liền kề trên vòng tròn — gọi là cánh. Ví dụ nhóm 9 có thể nghiêng cánh 1 (kỷ luật hơn) hoặc cánh 8 (quyết liệt hơn). Cánh giải thích vì sao hai người cùng nhóm vẫn có sắc thái riêng.',
  },
  {
    value: 'arrows',
    q: 'Khi căng thẳng / khi phát triển thì sao?',
    a: 'Enneagram có các "mũi tên" nối các nhóm: lúc căng thẳng bạn có xu hướng mượn nét (thường là mặt kém) của một nhóm khác; lúc thoải mái, trưởng thành bạn hấp thụ nét tốt của một nhóm khác. Đây là điểm khiến Enneagram thiên về phát triển hơn là dán nhãn.',
  },
  {
    value: 'vs-mbti',
    q: 'Khác MBTI ở chỗ nào?',
    a: 'MBTI mô tả cách bạn tư duy và tiếp nhận thông tin; Enneagram đào vào động lực và nỗi sợ cốt lõi đứng sau hành vi. Nhiều người thấy Enneagram chạm sâu hơn về "vì sao tôi như vậy", còn MBTI tiện để mô tả phong cách làm việc. Hai góc nhìn bổ sung nhau.',
  },
  {
    value: 'caution',
    q: 'Cần lưu ý gì?',
    a: 'Enneagram là bản đồ để soi mình, không phải lời tiên tri. Đừng dùng số nhóm để bào chữa ("tôi nhóm 8 nên mới gắt") hay đóng khung người khác. hieu.asia mô tả động lực như một góc nhìn để bạn hiểu và tự quyết — kết hợp với các lăng kính khác.',
  },
];

const JSONLD = [
  article({
    headline: 'Enneagram — 9 nhóm tính cách & 3 trung tâm',
    description:
      'Enneagram mô tả 9 nhóm tính cách theo động lực sâu bên trong (điều bạn sợ và điều bạn khao khát), chia theo 3 trung tâm: Bản năng, Tình cảm, Lý trí.',
    url: '/learn/enneagram',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: 'Enneagram', url: '/learn/enneagram' },
  ]),
  faqPage(FAQS),
  itemList(
    listTypes().map((t) => ({
      name: `Nhóm ${t.slug} — ${t.name}`,
      url: `/learn/enneagram/${t.slug}`,
    })),
  ),
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
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <EnneagramFrame />,
        },
        {
          id: 'chin-nhom',
          tocLabel: 'Chín nhóm',
          heading: 'Chín nhóm tính cách',
          children: (
            <ul className="space-y-1">
              {TYPES.map((t) => (
                <li key={t.n} className="border-t border-border/60 first:border-0">
                  <Link
                    href={`/learn/enneagram/${t.n}`}
                    className="group flex gap-3 rounded-lg py-3 transition hover:bg-card/40"
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 font-heading text-sm text-gold-700 group-hover:border-gold">
                      {t.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-base text-foreground group-hover:text-gold">
                          {t.vi}
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {t.en}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/85">{t.core}</p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-sm text-muted-foreground group-hover:text-gold"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: 'ban-chat-3-tang',
          tocLabel: 'Bản chất · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <EnneagramDepth />,
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
              {FAQS.map((f) => (
                <AccordionItem key={f.value} value={f.value} className="rounded border border-border px-4">
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
          children: <EnneagramWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <EnneagramRecall />,
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <EnneagramChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
