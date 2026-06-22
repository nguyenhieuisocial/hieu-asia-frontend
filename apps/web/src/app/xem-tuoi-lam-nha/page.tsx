import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { XemTuoiLamNhaChecker } from '@/components/xem-tuoi-lam-nha/XemTuoiLamNhaChecker';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { checkBuildYear, BUILD_VERDICT_LABEL } from '@/lib/xem-tuoi-lam-nha';
import { BIRTH_YEARS, TARGET_YEAR, slugOf } from './years';

const TITLE = `Xem tuổi làm nhà năm ${TARGET_YEAR} — tính Kim Lâu, Hoang Ốc, Tam Tai`;
const DESCRIPTION = `Kiểm tra năm ${TARGET_YEAR} có được tuổi xây/sửa nhà theo năm sinh gia chủ: Kim Lâu (tuổi mụ chia 9), Hoang Ốc (tuổi mụ chia 6), Tam Tai — hiển thị rõ từng bước tính, kèm các năm được tuổi gần nhất và tục mượn tuổi. Tham khảo minh bạch, không phán số mệnh.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/xem-tuoi-lam-nha' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://hieu.asia/xem-tuoi-lam-nha',
    type: 'website' as const,
  },
};

const FAQS = [
  {
    q: 'Xem tuổi làm nhà dựa trên những yếu tố nào?',
    a: 'Trang này tính 3 hạn dân gian hay được xét nhất khi chọn NĂM khởi công: Kim Lâu (tuổi mụ chia 9, dư 1/3/6/8 là phạm), Hoang Ốc (tuổi mụ đếm vòng 6 cung, rơi Tam Địa Sát / Ngũ Thọ Tử / Lục Hoang Ốc là phạm) và Tam Tai (mỗi nhóm tuổi tam hợp có 3 năm liền nhau cần kiêng). Không phạm cả ba thì dân gian gọi là "được tuổi". Mỗi kết luận đều kèm phép tính cụ thể để bạn kiểm chứng.',
  },
  {
    q: 'Hoang Ốc là gì và tính thế nào?',
    a: 'Hoang Ốc là vòng 6 cung dùng riêng cho việc làm nhà: lấy tuổi mụ chia 6 (dư 0 tính là 6) — 1 Nhất Cát, 2 Nhì Nghi, 3 Tam Địa Sát, 4 Tứ Tấn Tài, 5 Ngũ Thọ Tử, 6 Lục Hoang Ốc. Rơi cung 3, 5, 6 là phạm; cung 1, 2, 4 là tốt. Đây là lý do cùng một tuổi có thể cưới được nhưng chưa "được tuổi" làm nhà.',
  },
  {
    q: 'Xem tuổi làm nhà tính theo tuổi ai?',
    a: 'Theo tục phổ biến, xét tuổi mụ của người đứng ra khởi công — thường là trụ cột gia đình đứng tên nhà. Vợ chồng cùng làm thì nhiều nhà chỉ xét tuổi một người đứng chính; bạn có thể nhập từng năm sinh vào công cụ để so sánh rồi chọn người "được tuổi" đứng ra động thổ.',
  },
  {
    q: 'Phạm hạn mà vẫn cần xây thì sao? Mượn tuổi là gì?',
    a: 'Dân gian có tục "mượn tuổi": nhờ người thân/quen nam giới, thường lớn tuổi hơn và không phạm Kim Lâu, Hoang Ốc, Tam Tai năm đó, đứng ra khởi công thay — kèm giấy bán nhà tượng trưng, chuộc lại khi hoàn thành. Chúng tôi giải thích minh bạch để bạn hiểu tục này; còn quyết định xây hay hoãn nên dựa trên tài chính, giấy phép, mùa thi công — những thứ ảnh hưởng thật đến ngôi nhà. Chúng tôi không doạ và không bán "lễ giải hạn".',
  },
  {
    q: 'Tuổi mụ là gì và tính thế nào?',
    a: `Tuổi mụ = năm xem − năm sinh + 1 (tính theo năm âm lịch). Ví dụ sinh 1990 thì năm ${TARGET_YEAR} tuổi mụ là ${TARGET_YEAR - 1990 + 1}. Lưu ý: nếu bạn sinh tháng 1–2 dương lịch trước Tết, năm âm của bạn là năm liền trước — hãy trừ đi 1 năm khi nhập.`,
  },
  {
    q: 'Xem tuổi làm nhà khác gì chọn ngày động thổ?',
    a: 'Xem tuổi trả lời câu hỏi "NĂM này có thuận để khởi công không" theo năm sinh gia chủ. Còn chọn NGÀY động thổ, đổ mái hay nhập trạch cụ thể trong năm thì dùng công cụ Xem ngày — chấm điểm từng ngày 0–100 theo sao hoàng đạo, trực, kiêng kỵ và có xét cả tuổi của bạn.',
  },
];

/** Dải năm sinh hiển thị trong bảng tổng quan (rộng hơn các trang con). */
const TABLE_YEARS: number[] = Array.from({ length: 36 }, (_, i) => 1965 + i); // 1965–2000

export default function XemTuoiLamNhaPage() {
  const rows = TABLE_YEARS.map((y) => ({ year: y, r: checkBuildYear(y, TARGET_YEAR) }));

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESCRIPTION, url: '/xem-tuoi-lam-nha' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem tuổi làm nhà', url: '/xem-tuoi-lam-nha' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow={`Làm nhà · Năm ${TARGET_YEAR}`}
        icon={<span aria-hidden="true">🏠</span>}
        title={
          <>
            <GoldAccent>Xem tuổi làm nhà</GoldAccent> năm {TARGET_YEAR}
          </>
        }
        description={`Nhập năm sinh gia chủ để biết năm ${TARGET_YEAR} có phạm Kim Lâu, Hoang Ốc hay Tam Tai không — kèm phép tính cụ thể từng bước, các năm được tuổi gần nhất và cả cách kiểm tra người mượn tuổi. Tham khảo theo tập tục, quyết định là của bạn.`}
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Xem tuổi làm nhà' }]}
        relatedSlug="/xem-tuoi-lam-nha"
      >
        <section className="space-y-8">
          <XemTuoiLamNhaChecker defaultTargetYear={TARGET_YEAR} />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Bảng nhanh: sinh năm nào làm nhà {TARGET_YEAR} được tuổi?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tính cho tuổi gia chủ theo 3 hạn thường xét. Bấm vào năm sinh để xem trang chi tiết
              (cách tính đầy đủ, so sánh các năm kế tiếp, tục mượn tuổi).
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Năm sinh</th>
                    <th className="py-2 pr-3 font-medium">Can chi</th>
                    <th className="py-2 pr-3 font-medium">Tuổi mụ</th>
                    <th className="py-2 pr-3 font-medium">Kim Lâu</th>
                    <th className="py-2 pr-3 font-medium">Hoang Ốc</th>
                    <th className="py-2 pr-3 font-medium">Tam Tai</th>
                    <th className="py-2 font-medium">Kết luận</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ year, r }) => (
                    <tr key={year} className="border-b border-border/50">
                      <td className="py-2 pr-3">
                        {BIRTH_YEARS.includes(year) ? (
                          <Link href={`/xem-tuoi-lam-nha/${slugOf(year)}`} className="text-gold hover:underline">
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
                        {r.hoangOc.isPham ? (
                          <span className="text-rose-700 dark:text-rose-300">{r.hoangOc.cung}</span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-300">{r.hoangOc.cung}</span>
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
                          {BUILD_VERDICT_LABEL[r.verdict]}
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
                <strong className="text-foreground">Kim Lâu:</strong> tuổi mụ (= năm khởi công −
                năm sinh + 1) chia 9; dư 1 (Thân), 3 (Thê), 6 (Tử) hoặc 8 (Lục Súc) là phạm.
              </li>
              <li>
                <strong className="text-foreground">Hoang Ốc:</strong> tuổi mụ chia 6 (dư 0 tính là
                6) — rơi cung Tam Địa Sát (3), Ngũ Thọ Tử (5) hoặc Lục Hoang Ốc (6) là phạm; Nhất
                Cát (1), Nhì Nghi (2), Tứ Tấn Tài (4) là tốt. Vòng này dân gian dùng riêng cho làm
                nhà.
              </li>
              <li>
                <strong className="text-foreground">Tam Tai:</strong> mỗi nhóm tuổi tam hợp gặp Tam
                Tai vào 3 năm liền nhau cố định — ví dụ nhóm Thân-Tý-Thìn gặp Tam Tai các năm Dần,
                Mão, Thìn.
              </li>
              <li>
                <strong className="text-foreground">Xung năm:</strong> chi của năm khởi công lục
                xung với chi tuổi (Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi) — điểm
                trừ nhẹ, không tính là hạn chính.
              </li>
              <li>
                Tuổi mụ tính theo <strong className="text-foreground">năm âm lịch</strong>: sinh
                tháng 1–2 dương trước Tết thì thuộc năm âm liền trước (nhập lùi 1 năm).
              </li>
              <li>
                Xét tuổi <strong className="text-foreground">người đứng ra khởi công</strong>{' '}
                (thường là trụ cột đứng tên nhà); phạm hạn thì dân gian có tục mượn tuổi — xem câu
                hỏi bên dưới.
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
                  <Link href={`/xem-tuoi-lam-nha/${slugOf(y)}`} className="text-gold hover:underline">
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
            <div className="mt-3">
              <OccasionLeadCapture
                source="lam-nha-hub"
                capturedEvent="lead_capture_lam_nha_hub"
                blurb='Để lại email, chúng tôi sẽ báo bạn khi có bản đầy đủ và những nội dung mới theo mùa: năm tốt làm nhà sắp tới và lịch động thổ theo từng mùa. Thi thoảng thôi, không spam.'
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Công cụ làm nhà liên quan" className="text-sm">
            <span className="text-muted-foreground">Bước tiếp theo: </span>
            <Link href="/xem-ngay/dong-tho" className="text-gold hover:underline">
              Xem ngày động thổ (chấm điểm từng ngày)
            </Link>
            {', '}
            <Link href="/xem-ngay/nhap-trach" className="text-gold hover:underline">
              Xem ngày nhập trạch
            </Link>
            {', '}
            <Link href="/gio-hoang-dao" className="text-gold hover:underline">
              Giờ hoàng đạo động thổ
            </Link>
            {', '}
            <Link href="/ngay-kieng-ky" className="text-gold hover:underline">
              Ngày kiêng kỵ dân gian
            </Link>
            {', '}
            <Link href="/hop-tuoi" className="text-gold hover:underline">
              Hợp tuổi (xây dựng, hợp tác)
            </Link>
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
