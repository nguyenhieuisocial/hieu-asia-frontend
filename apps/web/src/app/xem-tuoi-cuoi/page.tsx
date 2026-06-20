import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { XemTuoiCuoiChecker } from '@/components/xem-tuoi-cuoi/XemTuoiCuoiChecker';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { checkWeddingYear, VERDICT_LABEL } from '@/lib/xem-tuoi-cuoi';
import { BIRTH_YEARS, TARGET_YEAR, slugOf } from './years';

const TITLE = `Xem tuổi cưới năm ${TARGET_YEAR} — tính Kim Lâu, Tam Tai theo năm sinh`;
const DESCRIPTION = `Kiểm tra năm ${TARGET_YEAR} có thuận để cưới theo năm sinh cô dâu, chú rể: Kim Lâu (tuổi mụ chia 9), Tam Tai, chi năm xung tuổi — hiển thị rõ từng bước tính, kèm các năm không phạm gần nhất. Tham khảo minh bạch, không phán số mệnh.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/xem-tuoi-cuoi' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://hieu.asia/xem-tuoi-cuoi',
    type: 'website' as const,
  },
};

const FAQS = [
  {
    q: 'Xem tuổi cưới dựa trên những yếu tố nào?',
    a: 'Trang này tính 3 yếu tố dân gian hay được xét nhất khi chọn NĂM cưới: Kim Lâu (tuổi mụ chia 9, dư 1/3/6/8 là phạm), Tam Tai (mỗi nhóm tuổi tam hợp có 3 năm liền nhau cần kiêng) và chi năm xung với chi tuổi (lục xung). Mỗi kết luận đều kèm phép tính cụ thể để bạn kiểm chứng.',
  },
  {
    q: 'Kim Lâu tính theo tuổi cô dâu hay chú rể?',
    a: 'Theo tục phổ biến, Kim Lâu khi cưới hỏi xét theo tuổi mụ của cô dâu ("lấy vợ xem tuổi đàn bà"). Tam Tai và năm xung tuổi thì có thể xét cho cả hai người. Công cụ cho nhập cả hai năm sinh để xem cùng lúc.',
  },
  {
    q: 'Tuổi mụ là gì và tính thế nào?',
    a: `Tuổi mụ = năm xem − năm sinh + 1 (tính theo năm âm lịch). Ví dụ sinh 1997 thì năm ${TARGET_YEAR} tuổi mụ là ${TARGET_YEAR - 1997 + 1}. Lưu ý: nếu bạn sinh tháng 1–2 dương lịch trước Tết, năm âm của bạn là năm liền trước — hãy trừ đi 1 năm khi nhập.`,
  },
  {
    q: 'Phạm Kim Lâu hay Tam Tai có bắt buộc phải hoãn cưới không?',
    a: 'Không có quy luật khoa học nào bắt buộc cả — đây là tập tục dân gian. Chúng tôi hiển thị phép tính minh bạch để bạn biết chính xác mình "phạm" điều gì, rồi cùng gia đình tự quyết định. Chúng tôi không doạ và không bán "lễ giải hạn".',
  },
  {
    q: 'Xem tuổi cưới khác gì xem ngày cưới?',
    a: 'Xem tuổi cưới trả lời câu hỏi "NĂM này có thuận để cưới không" theo năm sinh. Còn chọn NGÀY cưới cụ thể trong năm (ngày hoàng đạo, tránh ngày xung tuổi…) thì dùng công cụ Xem ngày cưới hỏi — chấm điểm từng ngày 0–100 và gợi ý ngày tốt hơn.',
  },
];

/** Dải năm sinh hiển thị trong bảng tổng quan (rộng hơn các trang con). */
const TABLE_YEARS: number[] = Array.from({ length: 24 }, (_, i) => 1985 + i); // 1985–2008

export default function XemTuoiCuoiPage() {
  const rows = TABLE_YEARS.map((y) => ({ year: y, r: checkWeddingYear(y, TARGET_YEAR) }));

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESCRIPTION, url: '/xem-tuoi-cuoi' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem tuổi cưới', url: '/xem-tuoi-cuoi' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow={`Cưới hỏi · Năm ${TARGET_YEAR}`}
        icon={<span aria-hidden="true">💍</span>}
        title={
          <>
            <GoldAccent>Xem tuổi cưới</GoldAccent> năm {TARGET_YEAR}
          </>
        }
        description={`Nhập năm sinh cô dâu (và chú rể) để biết năm ${TARGET_YEAR} có phạm Kim Lâu, Tam Tai hay xung năm không — kèm phép tính cụ thể từng bước và các năm không phạm gần nhất. Tham khảo theo tập tục, quyết định là của bạn.`}
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Xem tuổi cưới' }]}
      >
        <section className="space-y-8">
          <XemTuoiCuoiChecker defaultTargetYear={TARGET_YEAR} />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Bảng nhanh: cô dâu sinh năm nào cưới {TARGET_YEAR} thuận?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tính cho tuổi cô dâu theo 3 mục thường xét. Bấm vào năm sinh để xem trang chi tiết
              (cách tính đầy đủ, so sánh các năm kế tiếp).
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Năm sinh</th>
                    <th className="py-2 pr-3 font-medium">Can chi</th>
                    <th className="py-2 pr-3 font-medium">Tuổi mụ</th>
                    <th className="py-2 pr-3 font-medium">Kim Lâu</th>
                    <th className="py-2 pr-3 font-medium">Tam Tai</th>
                    <th className="py-2 font-medium">Kết luận</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ year, r }) => (
                    <tr key={year} className="border-b border-border/50">
                      <td className="py-2 pr-3">
                        {BIRTH_YEARS.includes(year) ? (
                          <Link href={`/xem-tuoi-cuoi/${slugOf(year)}`} className="text-gold hover:underline">
                            {year}
                          </Link>
                        ) : (
                          year
                        )}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.birthCanChi.name}</td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.kimLau.ageMu}</td>
                      <td className="py-2 pr-3">
                        {r.kimLau.type ? (
                          <span className="text-rose-700 dark:text-rose-300">{r.kimLau.type.replace('Kim Lâu ', '')}</span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-300">Không</span>
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        {r.tamTai.isTamTai ? (
                          <span className="text-rose-700 dark:text-rose-300">Phạm</span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-300">Không</span>
                        )}
                      </td>
                      <td className="py-2">
                        <span
                          className={
                            r.verdict === 'thuan'
                              ? 'text-emerald-700 dark:text-emerald-300'
                              : r.verdict === 'can-nhac'
                                ? 'text-amber-700 dark:text-amber-300'
                                : 'text-rose-700 dark:text-rose-300'
                          }
                        >
                          {VERDICT_LABEL[r.verdict]}
                        </span>
                      </td>
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
                <strong className="text-foreground">Kim Lâu:</strong> tuổi mụ (= năm cưới − năm sinh
                + 1) chia 9; dư 1 (Thân), 3 (Thê), 6 (Tử) hoặc 8 (Lục Súc) là phạm. Theo tục, cưới
                hỏi xét chủ yếu tuổi cô dâu.
              </li>
              <li>
                <strong className="text-foreground">Tam Tai:</strong> mỗi nhóm tuổi tam hợp gặp Tam
                Tai vào 3 năm liền nhau cố định — ví dụ nhóm Thân-Tý-Thìn gặp Tam Tai các năm Dần,
                Mão, Thìn.
              </li>
              <li>
                <strong className="text-foreground">Xung năm:</strong> chi của năm cưới lục xung với
                chi tuổi (Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi) — nhiều nhà xem là
                điểm trừ, nhẹ hơn hai mục trên.
              </li>
              <li>
                Tuổi mụ tính theo <strong className="text-foreground">năm âm lịch</strong>: sinh
                tháng 1–2 dương trước Tết thì thuộc năm âm liền trước (nhập lùi 1 năm).
              </li>
              <li>
                Hoang Ốc cũng là hạn theo tuổi mụ nhưng theo tục chủ yếu dùng khi{' '}
                <strong className="text-foreground">làm nhà</strong>, không phải cưới hỏi — nên
                trang này không gộp vào kết luận cưới.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Câu hỏi thường gặp
            </h2>
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
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Xem chi tiết theo năm sinh
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4">
              {BIRTH_YEARS.map((y) => (
                <li key={y}>
                  <Link href={`/xem-tuoi-cuoi/${slugOf(y)}`} className="text-gold hover:underline">
                    Sinh năm {y}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source="xem-tuoi-cuoi-hub"
                capturedEvent="lead_capture_xem_tuoi_cuoi_hub"
                blurb="Để lại email, chúng tôi báo bạn khi có bản đầy đủ và nội dung mới theo mùa cưới: năm nào thuận, ngày nào tốt để cưới hỏi. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Công cụ cưới hỏi liên quan" className="text-sm">
            <span className="text-muted-foreground">Bước tiếp theo: </span>
            <Link href="/xem-ngay/cuoi-hoi" className="text-gold hover:underline">
              Xem ngày cưới hỏi (chấm điểm từng ngày)
            </Link>
            {', '}
            <Link href="/hop-tuoi" className="text-gold hover:underline">
              Hợp tuổi hai bạn
            </Link>
            {', '}
            <Link href="/gio-hoang-dao" className="text-gold hover:underline">
              Giờ hoàng đạo đón dâu
            </Link>
            {', '}
            <Link href="/ngay-kieng-ky" className="text-gold hover:underline">
              Ngày kiêng kỵ dân gian
            </Link>
            {', '}
            <Link href="/sinh-con" className="text-gold hover:underline">
              Sinh con theo năm (đối chiếu tuổi bố mẹ)
            </Link>
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
