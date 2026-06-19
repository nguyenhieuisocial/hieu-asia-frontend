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

// FAQ trích nguyên văn từ phần "Giải thích chi tiết" (Accordion) đang hiển thị →
// chữ schema === chữ hiển thị (chống cloaking), KHÔNG thêm câu hỏi mới.
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
    a: 'Soi tính cách bẩm sinh, sứ mệnh đời, vùng dễ vấp. Là công cụ tự nhận thức nhanh, chỉ cần ngày sinh + tên là có bản phác họa.',
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
      ]}
    >
      <JsonLd data={JSONLD} />
    </LearnArticle>
  );
}
