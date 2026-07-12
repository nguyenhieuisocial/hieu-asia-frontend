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
  {
    value: 'gio-thang',
    q: 'Mỗi con giáp ứng giờ nào trong ngày?',
    a: 'Mười hai Địa Chi cũng là mười hai canh giờ, mỗi canh dài hai tiếng: Tý (23–1 giờ), Sửu (1–3), Dần (3–5), Mão (5–7), Thìn (7–9), Tỵ (9–11), Ngọ (11–13), Mùi (13–15), Thân (15–17), Dậu (17–19), Tuất (19–21), Hợi (21–23). Mỗi Chi còn ứng một tháng và một phương vị — Tý ở chính Bắc giữa đông, Ngọ ở chính Nam giữa hạ. Vì thế mỗi con giáp gắn với một mốc giờ, một tháng và một phương vị, chứ không đơn thuần là hình một con vật.',
  },
  {
    value: 'chi-hay-con-vat',
    q: '12 Địa Chi có trước hay 12 con vật có trước?',
    a: 'Giới nghiên cứu thường xem hệ 12 Địa Chi (Tý, Sửu, Dần…) là bộ ký hiệu lịch pháp có trước — dùng để đánh dấu giờ, tháng và phương vị. Mười hai con vật được gán vào sau như một cách ghi nhớ dễ hình dung và dễ truyền trong dân gian. Vì thế phần lõi là Địa Chi và ngũ hành của nó; con vật chỉ là lớp biểu tượng bên ngoài, và có thể khác nhau giữa các nước (Mèo ở Việt Nam, Thỏ ở Trung Quốc).',
  },
  {
    value: 'truyen-thuyet',
    q: 'Truyền thuyết cuộc đua chọn 12 con giáp có thật không?',
    a: 'Đó là truyền thuyết dân gian, không phải sử liệu — và có nhiều dị bản. Bản quen thuộc kể Ngọc Hoàng mở cuộc đua để chọn 12 con vật, thứ tự về đích thành thứ tự con giáp; chuột nhanh trí nên về nhất. Một số dị bản Việt Nam còn giải thích vì sao có con Mèo và vì sao mèo với chuột không ưa nhau. Hãy đón nhận như một câu chuyện giải thích thú vị, còn phần chắc chắn là hệ 12 Địa Chi của lịch pháp.',
  },
  {
    value: 'quan-he-khac',
    q: 'Ngoài Tam Hợp và Tứ hành xung, con giáp còn quan hệ nào khác?',
    a: 'Còn vài lớp nữa. Lục Hợp là sáu cặp con giáp bổ trợ nhau (Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi). Tương Hại (Lục Hại) là sáu cặp dễ hiểu lầm, lệch kênh giao tiếp. Tương Hình là tầng “cọ xát nội tại” — đây là kiến thức nền và tên gọi các nhóm Hình còn được các sách ghi khác nhau. Muốn học sâu từng lớp, hãy đọc bài Hợp tuổi (12 con giáp). Công cụ hợp tuổi hiện phân theo sáu nhóm và chưa tính lớp Tương Hình.',
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
  course({
    name: '12 Con Giáp — tính cách, tam hợp, tứ hành xung',
    description:
      'Tính cách, tam hợp và tứ hành xung của 12 con giáp (12 Địa Chi) theo ngũ hành — góc nhìn tham khảo để hiểu mình và người quanh mình, không phán số mệnh.',
    url: '/learn/con-giap',
  }),
  itemList(
    listConGiap().map((a) => ({
      name: `Tuổi ${a.ten}`,
      url: `/learn/con-giap/${a.slug}`,
    })),
  ),
];

/**
 * Bảng 12 Địa Chi → giờ · tháng · phương vị · mùa · âm/dương · hành.
 * Phương vị / mùa / âm-dương / hành bám bảng nguồn Can Chi (§1.2); giờ là 12
 * canh giờ (mỗi canh 2 tiếng); tháng suy từ mùa/khí (Dần = tháng Giêng, kiến Dần).
 * Kiến thức lịch pháp Can Chi — miền công cộng, không phán số mệnh.
 */
const CHI_CALENDAR: {
  ten: string;
  convat: string;
  gio: string;
  thang: string;
  phuongVi: string;
  mua: string;
  amDuong: string;
  hanh: string;
}[] = [
  { ten: 'Tý', convat: 'Chuột', gio: '23–1', thang: 'Tháng 11', phuongVi: 'Bắc', mua: 'Giữa đông', amDuong: 'Dương', hanh: 'Thủy' },
  { ten: 'Sửu', convat: 'Trâu', gio: '1–3', thang: 'Tháng Chạp', phuongVi: 'Đông-Bắc', mua: 'Cuối đông', amDuong: 'Âm', hanh: 'Thổ' },
  { ten: 'Dần', convat: 'Hổ', gio: '3–5', thang: 'Tháng Giêng', phuongVi: 'Đông-Bắc', mua: 'Đầu xuân', amDuong: 'Dương', hanh: 'Mộc' },
  { ten: 'Mão', convat: 'Mèo', gio: '5–7', thang: 'Tháng 2', phuongVi: 'Đông', mua: 'Giữa xuân', amDuong: 'Âm', hanh: 'Mộc' },
  { ten: 'Thìn', convat: 'Rồng', gio: '7–9', thang: 'Tháng 3', phuongVi: 'Đông-Nam', mua: 'Cuối xuân', amDuong: 'Dương', hanh: 'Thổ' },
  { ten: 'Tỵ', convat: 'Rắn', gio: '9–11', thang: 'Tháng 4', phuongVi: 'Đông-Nam', mua: 'Đầu hạ', amDuong: 'Âm', hanh: 'Hỏa' },
  { ten: 'Ngọ', convat: 'Ngựa', gio: '11–13', thang: 'Tháng 5', phuongVi: 'Nam', mua: 'Giữa hạ', amDuong: 'Dương', hanh: 'Hỏa' },
  { ten: 'Mùi', convat: 'Dê', gio: '13–15', thang: 'Tháng 6', phuongVi: 'Tây-Nam', mua: 'Cuối hạ', amDuong: 'Âm', hanh: 'Thổ' },
  { ten: 'Thân', convat: 'Khỉ', gio: '15–17', thang: 'Tháng 7', phuongVi: 'Tây-Nam', mua: 'Đầu thu', amDuong: 'Dương', hanh: 'Kim' },
  { ten: 'Dậu', convat: 'Gà', gio: '17–19', thang: 'Tháng 8', phuongVi: 'Tây', mua: 'Giữa thu', amDuong: 'Âm', hanh: 'Kim' },
  { ten: 'Tuất', convat: 'Chó', gio: '19–21', thang: 'Tháng 9', phuongVi: 'Tây-Bắc', mua: 'Cuối thu', amDuong: 'Dương', hanh: 'Thổ' },
  { ten: 'Hợi', convat: 'Lợn', gio: '21–23', thang: 'Tháng 10', phuongVi: 'Tây-Bắc', mua: 'Đầu đông', amDuong: 'Âm', hanh: 'Thủy' },
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
          id: 'truyen-thuyet-su-lieu',
          tocLabel: 'Truyền thuyết & sử liệu',
          heading: 'Truyền thuyết cuộc đua — và phần chắc chắn hơn',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <div className="rounded-card-editorial border border-border bg-card/40 p-5 sm:p-6">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-gold-700">
                  Truyền thuyết dân gian (nhiều dị bản)
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Chuyện kể quen thuộc: Ngọc Hoàng mở một cuộc đua để chọn 12 con vật cho lịch, con nào
                  về đích trước thì đứng trước trong vòng con giáp. Chuột nhanh trí, nhờ cưỡi lưng trâu
                  rồi nhảy tới vạch đích nên về nhất; trâu về nhì, tiếp đến hổ, mèo, rồng, rắn, ngựa, dê,
                  khỉ, gà, chó, và lợn về cuối. Nhiều dị bản Việt Nam còn kể thêm vì sao có con Mèo và vì
                  sao mèo với chuột từ đó không ưa nhau. Đây là <strong>câu chuyện giải thích</strong> để
                  dễ nhớ thứ tự, không phải sử liệu — mỗi vùng kể một kiểu.
                </p>
              </div>
              <div className="rounded-card-editorial border border-border bg-card/40 p-5 sm:p-6">
                <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-emerald-300">
                  Phần chắc chắn hơn: 12 Chi là một hệ lịch pháp
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                  Bỏ lớp truyền thuyết sang một bên, phần lõi là hệ <strong>12 Địa Chi</strong> (Tý,
                  Sửu, Dần…) của lịch pháp Á Đông. Giới nghiên cứu thường xem đây là bộ ký hiệu có trước,
                  dùng để đánh dấu <strong>giờ trong ngày, tháng trong năm và phương vị</strong>; 12 con
                  vật được gán vào sau như một cách ghi nhớ dễ hình dung. Vì thế điều bền vững là Địa Chi
                  và ngũ hành của nó, còn con vật chỉ là lớp biểu tượng — có thể khác nhau giữa các nước
                  (Mèo ở Việt Nam, Thỏ ở Trung Quốc). Ở đây không bàn niên đại cụ thể, chỉ nêu cấu trúc.
                </p>
              </div>
            </div>
          ),
        },
        {
          id: 'chi-khong-chi-con-vat',
          tocLabel: 'Mỗi Chi là một mốc',
          heading: 'Mỗi Chi không chỉ là con vật',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Mỗi Địa Chi ứng một khung giờ, một tháng, một phương vị và một mùa — đây là cách người
                xưa dùng con giáp để chia nhỏ thời gian và không gian. Ví dụ giờ Tý (23–1 giờ) là lúc
                đêm sâu nhất, còn giờ Ngọ (11–13 giờ) là giữa trưa.
              </p>
              <div className="overflow-x-auto rounded-card-editorial border border-border bg-card/40">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Chi</th>
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Con vật</th>
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Giờ</th>
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Tháng</th>
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Phương vị</th>
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Mùa</th>
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Âm/Dương</th>
                      <th className="px-3 py-2 font-mono text-[12px] uppercase tracking-[0.1em]">Hành</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHI_CALENDAR.map((r) => (
                      <tr key={r.ten} className="border-b border-border/50 last:border-0">
                        <td className="px-3 py-2 font-heading text-foreground">{r.ten}</td>
                        <td className="px-3 py-2 text-foreground/85">{r.convat}</td>
                        <td className="px-3 py-2 text-foreground/85">{r.gio} giờ</td>
                        <td className="px-3 py-2 text-foreground/85">{r.thang}</td>
                        <td className="px-3 py-2 text-foreground/85">{r.phuongVi}</td>
                        <td className="px-3 py-2 text-foreground/85">{r.mua}</td>
                        <td className="px-3 py-2 text-foreground/85">{r.amDuong}</td>
                        <td className="px-3 py-2 text-foreground/85">{r.hanh}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-foreground/70">
                Giờ là mười hai canh giờ, mỗi canh dài hai tiếng. Tháng suy từ mùa: theo lịch pháp cổ,
                tháng Giêng ứng Chi Dần (đầu xuân), nên Tý rơi vào tháng 11 và Sửu vào tháng Chạp.
              </p>
            </div>
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
              <p className="text-sm leading-relaxed text-foreground/85">
                Muốn xem nhanh một con giáp hợp hay khắc với cả 11 con còn lại?{' '}
                <Link
                  href="/tuong-hop-12-con-giap"
                  className="text-gold underline underline-offset-4 hover:text-gold/80"
                >
                  Mở bản đồ tương hợp 12 con giáp
                </Link>{' '}
                — tam hợp, lục xung và ngũ hành sinh khắc gói gọn trên một bảng.
              </p>
            </div>
          ),
        },
        {
          id: 'luc-hop-hai-hinh',
          tocLabel: 'Lục Hợp · Hại · Hình',
          heading: 'Ngoài Tam Hợp và Tứ hành xung',
          children: (
            <div className="space-y-4 text-foreground/85 leading-relaxed">
              <p>
                Tam Hợp và Tứ hành xung là hai quan hệ hay được nhắc nhất, nhưng Can Chi còn vài lớp
                nữa. Ở đây chỉ giới thiệu nhanh; muốn học sâu từng cặp và cách dung hoà, xem bài{' '}
                <Link
                  href="/learn/hop-tuoi"
                  className="text-gold underline underline-offset-4 hover:text-gold/80"
                >
                  Hợp tuổi (12 con giáp)
                </Link>
                .
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-foreground">Lục Hợp</strong> — sáu cặp con giáp bổ trợ nhau
                  (Tý–Sửu, Dần–Hợi, Mão–Tuất, Thìn–Dậu, Tỵ–Thân, Ngọ–Mùi): điểm mạnh người này cân bằng
                  điểm yếu người kia, gợi ý sự gắn kết dễ chịu.
                </li>
                <li>
                  <strong className="text-foreground">Tương Hại (Lục Hại)</strong> — sáu cặp dễ hiểu lầm,
                  lệch kênh giao tiếp (Tý–Mùi, Sửu–Ngọ, Dần–Tỵ, Mão–Thìn, Thân–Hợi, Dậu–Tuất). Nhẹ hơn
                  xung, kiểu khó chịu là âm ỉ; hướng lành mạnh là nói thẳng và kiên nhẫn, không phải
                  “tránh nhau”.
                </li>
                <li>
                  <strong className="text-foreground">Tương Hình</strong> — tầng “cọ xát nội tại”, dễ tự
                  làm khó nhau. Đây là kiến thức nền của canon; tên gọi các nhóm Hình còn được các sách
                  ghi khác nhau nên không nên chốt cứng.
                </li>
              </ul>
              <p className="text-sm text-foreground/70">
                Lưu ý đúng phạm vi: công cụ hợp tuổi của hieu.asia hiện phân loại theo sáu nhóm (cùng
                tuổi, Tam Hợp, Lục Hợp, Lục Xung, Lục Hại, bình hoà) và <strong>chưa</strong> tính lớp
                Tương Hình hay Thiên Can ngũ hợp. Chúng tôi nêu ở đây cho trọn vẹn, không để làm bạn lo.
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
