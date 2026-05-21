import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from '@hieu-asia/ui';

export const metadata: Metadata = {
  title: 'Thần Số Học Pythagoras — Học huyền học | hieu.asia',
  description:
    'Thần Số Học (Numerology) theo trường phái Pythagoras: rút số chủ đạo từ ngày sinh và tên, mỗi số mang một năng lượng riêng.',
  alternates: { canonical: 'https://hieu.asia/learn/than-so-hoc' },
};

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
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-cream/55">
        <Link href="/" className="hover:text-gold">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <Link href="/learn" className="hover:text-gold">Học huyền học</Link>
        <span className="mx-1.5">/</span>
        <span className="text-cream/70">Thần Số Học</span>
      </nav>

      <header className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-gold/80">
          Tây phương · Pythagoras
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold leading-tight text-cream sm:text-4xl">
          Thần <span className="bg-gold-gradient bg-clip-text text-transparent">Số Học</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/75">
          Pythagoras tin rằng mọi thứ đều có thể quy về số. Thần Số Học hiện đại rút số chủ
          đạo từ ngày sinh và tên — mỗi số từ 1 đến 9 mang một nguồn năng lượng riêng.
        </p>
      </header>

      <section className="rounded-xl border border-cream/10 bg-ink/40 p-6 sm:p-8">
        <h2 className="mb-4 text-center font-heading text-lg font-semibold text-gold">
          9 số chủ đạo
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {NUMBERS.map((n) => (
            <div
              key={n.num}
              className="rounded-lg border border-cream/15 bg-ink/40 p-4 transition-colors hover:border-gold/40"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl font-bold text-gold">{n.num}</span>
                <span className="text-sm font-semibold text-cream">{n.name}</span>
              </div>
              <p className="mt-1 text-xs text-cream/60">{n.keywords}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-cream/70">
          Ngoài 1–9 còn có 3 số “bậc thầy”: 11, 22, 33 — không rút gọn về 1 chữ số.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-cream">Giải thích chi tiết</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="origin" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Pythagoras là ai?</AccordionTrigger>
            <AccordionContent>
              Pythagoras (~570 TCN) là nhà toán học, triết gia Hy Lạp — người đặt nền móng cho
              Thần Số Học phương Tây. Ông tin số không chỉ đếm vật, mà còn mang “linh hồn”
              riêng phản ánh quy luật vũ trụ.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="calc" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Cách tính số chủ đạo?</AccordionTrigger>
            <AccordionContent>
              Cộng tất cả chữ số trong ngày sinh đầy đủ. Ví dụ 15/08/1990 = 1+5+0+8+1+9+9+0 =
              33 → 3+3 = 6. Vậy số chủ đạo là 6 (riêng 11, 22, 33 giữ nguyên — gọi là số bậc thầy).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="name" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Số từ tên thì sao?</AccordionTrigger>
            <AccordionContent>
              Mỗi chữ cái được gán một số 1–9 theo bảng Pythagoras. Cộng các số ứng với tên
              đầy đủ rồi rút gọn — ra số biểu hiện (expression number) và số linh hồn (soul
              urge number).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="usage" className="rounded border border-cream/10 px-4">
            <AccordionTrigger>Dùng để làm gì?</AccordionTrigger>
            <AccordionContent>
              Soi tính cách bẩm sinh, sứ mệnh đời, vùng dễ vấp. Là công cụ tự nhận thức nhanh
              — chỉ cần ngày sinh + tên là có bản phác họa.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section
        aria-labelledby="numerology-cta-heading"
        className="mt-12 rounded-2xl border border-gold/25 bg-ink/40 p-8 text-center"
      >
        <h2
          id="numerology-cta-heading"
          className="font-heading text-2xl font-bold text-cream"
        >
          Trải nghiệm ngay
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-cream/70">
          Chỉ cần ngày sinh và tên đầy đủ, hệ thống tính ra số chủ đạo, số biểu hiện và số linh
          hồn — kèm diễn giải năng lượng từng số.
        </p>
        <div className="mt-6">
          <Link href="/reading/new?method=numerology">
            <Button size="lg">Khám phá Thần Số Học</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
