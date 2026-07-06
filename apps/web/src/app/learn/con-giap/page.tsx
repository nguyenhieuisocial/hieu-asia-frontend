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
import { listConGiap, buildConGiap } from '@/lib/con-giap-data';
import {
  ConGiapFrame,
  ConGiapDepth,
  ConGiapRecall,
  ConGiapChecklist,
  ConGiapWhys,
} from './_active-learning';

export const metadata: Metadata = {
  title: '12 Con Giáp — tính cách, tam hợp, tứ hành xung',
  description:
    'Tính cách, tam hợp và tứ hành xung của 12 con giáp (12 Địa Chi) theo ngũ hành — góc nhìn tham khảo để hiểu mình và người quanh mình, không phán số mệnh.',
  alternates: { canonical: 'https://hieu.asia/learn/con-giap' },
};

/** Hiển thị "Mão (Mèo)" cho địa chi Mão — con giáp thứ 4 trong tiếng Việt là Mèo. */
function displayTen(slug: string, ten: string): string {
  return slug === 'mao' ? `${ten} (Mèo)` : ten;
}

// FAQ dùng chung cho CẢ FAQPage JSON-LD lẫn phần hiển thị (Accordion) → chữ
// schema === chữ hiển thị (chống cloaking) + crawler/AI đọc được câu trả lời.
const FAQS: { value: string; q: string; a: string }[] = [
  {
    value: 'meo-vs-tho',
    q: 'Con giáp thứ 4 là Mèo hay Thỏ?',
    a: 'Trong tiếng Việt, con giáp thứ 4 là Mèo; người Trung Quốc gọi là Thỏ. Cả hai cùng chỉ một Địa Chi là Mão (hành Mộc) — chỉ khác biểu tượng con vật theo văn hoá. Vì thế khi ai đó nói “tuổi Thỏ”, với hệ Việt Nam đó chính là tuổi Mèo (Mão), và mọi quan hệ tam hợp hay tứ hành xung của nó vẫn giữ nguyên.',
  },
  {
    value: 'tam-hop',
    q: 'Tam Hợp là gì?',
    a: 'Tam Hợp là ba con giáp cách đều nhau 4 ngôi trên vòng 12 con giáp, hội tụ thành một cục ngũ hành: Thân–Tý–Thìn (Thủy), Dần–Ngọ–Tuất (Hỏa), Tỵ–Dậu–Sửu (Kim), Hợi–Mão–Mùi (Mộc). Các tuổi trong cùng một nhóm tam hợp thường dễ đồng điệu, bổ trợ nhau — nhưng đó là xu hướng tham khảo, không phải đảm bảo.',
  },
  {
    value: 'tu-hanh-xung',
    q: 'Tứ hành xung nghĩa là gì?',
    a: 'Tứ hành xung là cách nói dân gian cho các cặp lục xung — hai con giáp đối xứng 180° trên vòng (Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi). “Xung” chỉ có nghĩa hai nếp sống khác nhịp, đôi khi dễ va quan điểm và cần dung hoà nhiều hơn — không phải điềm xấu. Rất nhiều cặp “xung” vẫn rất bền.',
  },
  {
    value: 'caution',
    q: 'Xem con giáp có chính xác và nên tin tới đâu?',
    a: '12 con giáp chỉ dùng năm sinh nên chia loài người thành vỏn vẹn 12 nhóm — một lát cắt rất thô để tham khảo, không phải phép đo khoa học hay lời tiên tri. hieu.asia không bịa “số may mắn”, “màu hợp mệnh” hay lời hù doạ. Muốn sâu và đáng tin hơn, hãy xem lá số đầy đủ (Bát Tự / Tử Vi); tính cách và tương lai của bạn do chính bạn quyết định.',
  },
];

const JSONLD = [
  article({
    headline: '12 Con Giáp — tính cách, tam hợp, tứ hành xung',
    description:
      'Tính cách, sở trường, tam hợp và tứ hành xung của 12 con giáp (12 Địa Chi) theo ngũ hành — một góc nhìn tham khảo để hiểu mình, không phán số mệnh.',
    url: '/learn/con-giap',
  }),
  breadcrumb([
    { name: 'Trang chủ', url: '/' },
    { name: 'Học huyền học', url: '/learn' },
    { name: '12 Con Giáp', url: '/learn/con-giap' },
  ]),
  faqPage(FAQS),
  itemList(
    listConGiap().map((a) => ({
      name: `Tuổi ${a.ten}`,
      url: `/learn/con-giap/${a.slug}`,
    })),
  ),
];

export default function LearnConGiapPage() {
  // listConGiap() cho slug/ten/emoji; blurb tính cách lấy từ buildConGiap (nguồn ZODIAC).
  const zodiacs = listConGiap().map((z) => ({
    ...z,
    blurb: buildConGiap(z.slug)?.z.blurb ?? '',
  }));

  return (
    <LearnArticle
      eyebrow="Đông phương · 12 Địa Chi"
      title={
        <>
          12 Con Giáp — <span className="bg-gold-gradient bg-clip-text text-transparent">tính cách &amp; quan hệ</span>
        </>
      }
      standfirst={
        <>
          12 con giáp là 12 <em>Địa Chi</em> của lịch pháp Á Đông, mỗi năm gắn một con giáp và một{' '}
          <em>ngũ hành</em>. Người xưa dùng nó để phác nhanh xu hướng tính cách và “nhịp” giữa người
          với người — hợp nhau (Tam Hợp) hay khác nhịp (Tứ hành xung). Hãy xem nó như một{' '}
          <em>góc nhìn tham khảo để hiểu mình</em>, không phải lời phán số mệnh.
        </>
      }
      readMeta="6 phút đọc · Cập nhật 2026"
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Học huyền học', href: '/learn' },
        { label: '12 Con Giáp' },
      ]}
      relatedLenses={relatedLearnLenses('con-giap')}
      tryCta={{
        heading: 'Trải nghiệm ngay',
        blurb:
          'Xem hai tuổi hợp hay khác nhịp ở đâu bằng công cụ hợp tuổi — đối chiếu Can Chi và nạp âm, kèm hướng dung hoà. Góc nhìn tham khảo, không phán khắc.',
        href: '/hop-tuoi',
        label: 'Xem hợp tuổi',
      }}
      sections={[
        {
          id: 'ban-do-bai-hoc',
          tocLabel: 'Bản đồ bài học',
          heading: 'Học cái này để làm gì',
          children: <ConGiapFrame />,
        },
        {
          id: 'muoi-hai-con-giap',
          tocLabel: '12 con giáp',
          heading: '12 con giáp',
          children: (
            <ul className="space-y-1">
              {zodiacs.map((z) => (
                <li key={z.slug} className="border-t border-border/60 first:border-0">
                  <Link
                    href={`/learn/con-giap/${z.slug}`}
                    className="group flex gap-3 rounded-lg py-3 transition hover:bg-card/40"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/40 text-base group-hover:border-gold"
                    >
                      {z.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="font-heading text-base text-foreground group-hover:text-gold">
                        Tuổi {displayTen(z.slug, z.ten)}
                      </span>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/85">{z.blurb}</p>
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
          tocLabel: 'Mèo hay Thỏ · 3 độ sâu',
          heading: 'Hiểu phần lõi ở tầng vừa sức bạn',
          children: <ConGiapDepth />,
        },
        {
          id: 'tam-hop-tu-hanh-xung',
          tocLabel: 'Tam Hợp & Tứ hành xung',
          heading: 'Tam Hợp và Tứ hành xung',
          children: (
            <div className="space-y-6">
              <div className="rounded-card-editorial border border-emerald-500/20 bg-emerald-500/[0.04] p-5 sm:p-6">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-emerald-300">
                  Tam Hợp — nhóm hợp nhịp
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Tam Hợp là <strong className="text-foreground">ba con giáp cách đều nhau 4 ngôi</strong>{' '}
                  trên vòng 12 con giáp, hội tụ thành một cục ngũ hành. Có bốn nhóm:{' '}
                  <strong className="text-foreground">Thân–Tý–Thìn</strong> (Thủy),{' '}
                  <strong className="text-foreground">Dần–Ngọ–Tuất</strong> (Hỏa),{' '}
                  <strong className="text-foreground">Tỵ–Dậu–Sửu</strong> (Kim),{' '}
                  <strong className="text-foreground">Hợi–Mão–Mùi</strong> (Mộc). Các tuổi cùng một nhóm
                  thường dễ đồng điệu và bổ trợ nhau — nhưng đó là xu hướng tham khảo, không phải đảm bảo.
                </p>
              </div>
              <div className="rounded-card-editorial border border-amber-500/20 bg-amber-500/[0.04] p-5 sm:p-6">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-amber-300">
                  Tứ hành xung — cặp khác nhịp
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Tứ hành xung là cách nói dân gian cho các{' '}
                  <strong className="text-foreground">cặp lục xung</strong> — hai con giáp{' '}
                  <strong className="text-foreground">đối xứng 180°</strong> trên vòng: Tý–Ngọ, Sửu–Mùi,
                  Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi. “Xung” chỉ nghĩa là{' '}
                  <strong className="text-foreground">hai nếp sống khác nhịp</strong>, đôi khi dễ va quan
                  điểm và cần dung hoà nhiều hơn — <strong className="text-foreground">không phải điềm
                  xấu</strong>. Rất nhiều cặp “xung” vẫn rất bền, khi khác biệt đúng cách trở thành bổ
                  sung.
                </p>
              </div>
            </div>
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
          children: <ConGiapWhys />,
        },
        {
          id: 'tu-kiem-tra',
          tocLabel: 'Tự kiểm tra hiểu',
          heading: 'Tự kiểm tra: bạn nhớ và hiểu tới đâu',
          children: <ConGiapRecall />,
        },
        {
          id: 'ban-da-hieu-chua',
          tocLabel: 'Bạn đã hiểu chưa?',
          heading: 'Bạn đã thật sự hiểu chưa?',
          children: <ConGiapChecklist />,
        },
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
