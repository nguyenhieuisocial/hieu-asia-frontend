import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { HuongNhaChecker } from '@/components/huong-nha/HuongNhaChecker';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import {
  batTrachMap,
  menhGroup,
  groupLabel,
  STAR_INFO,
  DIRECTION_ORDER,
  DONG_TU_MENH,
  TAY_TU_MENH,
  type Quai,
} from '@/lib/huong-nha';
import { BIRTH_YEARS, slugOf } from './years';

const TITLE = 'Xem hướng nhà hợp tuổi — Bát Trạch theo cung phi (Đông/Tây tứ mệnh)';
const DESCRIPTION =
  'Nhập năm sinh + giới tính để biết mệnh quái (cung phi) và 4 hướng nhà tốt – 4 hướng nên tránh theo Bát Trạch: hướng đặt cửa chính, giường, bếp, bàn làm việc. Tính minh bạch, tham khảo theo phong tục — không phán giàu nghèo.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/huong-nha' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://hieu.asia/huong-nha', type: 'website' as const },
};

const FAQS = [
  {
    q: 'Hướng nhà hợp tuổi tính dựa trên gì?',
    a: 'Dựa trên Bát Trạch: từ năm sinh và giới tính tính ra cung phi (mệnh quái). Người Đông tứ mệnh (Khảm, Ly, Chấn, Tốn) hợp 4 hướng Bắc, Đông, Đông Nam, Nam; người Tây tứ mệnh (Càn, Khôn, Cấn, Đoài) hợp 4 hướng Tây, Tây Bắc, Tây Nam, Đông Bắc. Mỗi hướng mang một sao (Sinh Khí, Thiên Y, Diên Niên, Phục Vị là tốt; Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại là xấu).',
  },
  {
    q: 'Hướng nhà là hướng cửa hay hướng lưng nhà?',
    a: 'Tùy trường phái. Phổ biến nhất là tính theo hướng cửa chính nhìn ra; một số tính theo "tọa" (hướng lưng nhà dựa vào). Bảng kết quả cho biết hướng nào mang sao tốt/xấu với tuổi bạn — bạn áp cho cửa chính, hướng giường hoặc bàn làm việc tùy nhu cầu.',
  },
  {
    q: 'Cung phi nam và nữ cùng tuổi có khác nhau không?',
    a: 'Có. Cung phi tính khác nhau theo giới tính, nên nam và nữ sinh cùng năm thường có mệnh quái khác nhau và hợp các hướng khác nhau. Hãy chọn đúng giới tính của gia chủ khi tra.',
  },
  {
    q: 'Phong thủy hướng nhà có bắt buộc không?',
    a: 'Không. Đây là tập tục tham khảo, không phải quy luật khoa học. Ánh sáng, thông gió, sự thuận tiện và ngân sách thực tế của gia đình mới là điều quan trọng nhất. Chúng tôi nêu rõ quy tắc để bạn biết và tự quyết định — không phán giàu nghèo, không bán "hóa giải".',
  },
];

interface QuaiRow {
  quai: Quai;
  group: 'Đông' | 'Tây';
  good: string[];
  bad: string[];
}

function buildQuaiRows(): QuaiRow[] {
  return [...DONG_TU_MENH, ...TAY_TU_MENH].map((q) => {
    const map = batTrachMap(q);
    const good = DIRECTION_ORDER.filter((d) => STAR_INFO[map[d]].good);
    const bad = DIRECTION_ORDER.filter((d) => !STAR_INFO[map[d]].good);
    return { quai: q, group: menhGroup(q), good, bad };
  });
}

export default function HuongNhaPage() {
  const rows = buildQuaiRows();

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESCRIPTION, url: '/huong-nha' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem hướng nhà', url: '/huong-nha' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Phong thủy · Hướng nhà"
        icon={<span aria-hidden="true">🧭</span>}
        title={
          <>
            <GoldAccent>Xem hướng nhà</GoldAccent> hợp tuổi
          </>
        }
        description="Nhập năm sinh và giới tính của gia chủ để biết mệnh quái (cung phi) và 4 hướng tốt — 4 hướng nên tránh theo Bát Trạch, kèm hướng nên đặt cửa chính, giường, bếp. Tham khảo theo phong tục, quyết định là của bạn."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Xem hướng nhà' }]}
      >
        <section className="space-y-8">
          <HuongNhaChecker defaultGender="nam" />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Bảng tra nhanh: 8 cung phi và hướng hợp
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Hướng tốt/xấu chỉ phụ thuộc cung phi (mệnh quái). Nếu đã biết cung phi của mình, tra
              thẳng ở đây.
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Cung phi</th>
                    <th className="py-2 pr-3 font-medium">Nhóm</th>
                    <th className="py-2 pr-3 font-medium">4 hướng tốt</th>
                    <th className="py-2 font-medium">4 hướng tránh</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.quai} className="border-b border-border/50">
                      <td className="py-2 pr-3 font-medium text-foreground">{r.quai}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{groupLabel(r.group)}</td>
                      <td className="py-2 pr-3 text-emerald-700 dark:text-emerald-300">{r.good.join(', ')}</td>
                      <td className="py-2 text-rose-700 dark:text-rose-300">{r.bad.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Cách tính — minh bạch để bạn kiểm chứng
            </h2>
            <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
              <li>
                <strong className="text-foreground">Cung phi</strong> tính từ năm sinh + giới tính
                (cùng công thức trang Hợp tuổi của chúng tôi).
              </li>
              <li>
                <strong className="text-foreground">Đông tứ mệnh</strong> (Khảm, Ly, Chấn, Tốn) hợp 4
                hướng Bắc, Đông, Đông Nam, Nam.{' '}
                <strong className="text-foreground">Tây tứ mệnh</strong> (Càn, Khôn, Cấn, Đoài) hợp 4
                hướng Tây, Tây Bắc, Tây Nam, Đông Bắc.
              </li>
              <li>
                4 sao tốt: <strong className="text-foreground">Sinh Khí</strong> (tốt nhất),{' '}
                <strong className="text-foreground">Thiên Y</strong> (sức khỏe),{' '}
                <strong className="text-foreground">Diên Niên</strong> (quan hệ),{' '}
                <strong className="text-foreground">Phục Vị</strong> (ổn định). 4 sao xấu: Tuyệt Mệnh,
                Ngũ Quỷ, Lục Sát, Họa Hại.
              </li>
              <li>
                Cung phi tính theo năm âm lịch: sinh tháng 1–2 dương trước Tết thì thuộc năm âm liền
                trước (nhập lùi 1 năm).
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">Câu hỏi thường gặp</h2>
            <dl className="mt-4 space-y-4">
              {FAQS.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">Xem theo năm sinh</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4">
              {BIRTH_YEARS.map((y) => (
                <li key={y}>
                  <Link href={`/huong-nha/${slugOf(y)}`} className="text-gold hover:underline">
                    Tuổi {y}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">Nhận nhắc theo mùa</h2>
            <OccasionLeadCapture
              source="huong-nha-hub"
              capturedEvent="lead_capture_huong_nha_hub"
              blurb="Để lại email, chúng tôi báo bạn khi có bản tra hướng nhà đầy đủ hơn và nội dung phong thủy mới theo mùa: hướng hợp tuổi, hướng đặt cửa, giường, bếp. Thi thoảng thôi, không spam."
              cta="Nhận nhắc"
            />
          </section>

          <nav aria-label="Công cụ làm nhà liên quan" className="text-sm">
            <span className="text-muted-foreground">Xem thêm: </span>
            <Link href="/xem-tuoi-lam-nha" className="text-gold hover:underline">
              Xem tuổi làm nhà (Kim Lâu, Tam Tai)
            </Link>
            {', '}
            <Link href="/xem-ngay/dong-tho" className="text-gold hover:underline">
              Chọn ngày động thổ
            </Link>
            {', '}
            <Link href="/hop-tuoi" className="text-gold hover:underline">
              Hợp tuổi
            </Link>
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
