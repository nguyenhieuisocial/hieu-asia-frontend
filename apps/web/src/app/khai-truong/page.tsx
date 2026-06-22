import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { KhaiTruongChecker } from '@/components/khai-truong/KhaiTruongChecker';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { checkOpeningYear, OPENING_VERDICT_LABEL } from '@/lib/khai-truong';
import { BIRTH_YEARS, TARGET_YEAR, slugOf } from './years';

const TITLE = `Xem tuổi khai trương / mở hàng năm ${TARGET_YEAR} — tính Tam Tai, xung Thái Tuế`;
const DESCRIPTION = `Kiểm tra năm ${TARGET_YEAR} có hợp tuổi khai trương / mở hàng theo năm sinh chủ kinh doanh: Tam Tai (3 năm kiêng khởi sự) và xung Thái Tuế — hiển thị rõ từng bước tính, kèm các năm hợp tuổi gần nhất. Không xét Kim Lâu / Hoang Ốc (dành cho làm nhà, cưới hỏi). Tham khảo minh bạch, không phán số mệnh.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://hieu.asia/khai-truong' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://hieu.asia/khai-truong',
    type: 'website' as const,
  },
};

const FAQS = [
  {
    q: 'Xem tuổi khai trương dựa trên những yếu tố nào?',
    a: 'Trang này xét 2 hạn dân gian hay được nhắc nhất khi chọn NĂM khởi sự kinh doanh: Tam Tai (mỗi nhóm tuổi tam hợp có 3 năm liền nhau kiêng làm việc lớn, mở mang) và xung Thái Tuế (chi năm lục xung chi tuổi — năm "khắc" tuổi). Không vướng hai điều này thì dân gian coi là "hợp tuổi" khai trương. Mỗi kết luận đều kèm phép tính cụ thể để bạn kiểm chứng.',
  },
  {
    q: 'Vì sao xem tuổi khai trương không tính Kim Lâu hay Hoang Ốc?',
    a: 'Kim Lâu và Hoang Ốc là hai hạn dành cho việc XÂY NHÀ và CƯỚI HỎI (Kim Lâu Thê – Tử – Lục Súc – Bản Mệnh; Hoang Ốc là vòng tốt/xấu của dựng nhà). Khai trương — mở hàng kinh doanh — theo tục chủ yếu xét Tam Tai (kiêng khởi sự) và xung Thái Tuế. Chúng tôi cố ý không gộp hai hạn kia vào để khỏi doạ sai — giống cách trang xem tuổi cưới đã loại Hoang Ốc.',
  },
  {
    q: 'Tam Tai là gì và năm nay tuổi nào gặp?',
    a: 'Tam Tai là 3 năm liên tiếp cố định của mỗi nhóm tuổi tam hợp — dân gian kiêng khởi sự, mở mang trong 3 năm này. Ví dụ nhóm Thân – Tý – Thìn gặp Tam Tai vào các năm Dần, Mão, Thìn. Nhập năm sinh vào công cụ để biết tuổi bạn năm nay có nằm trong Tam Tai không, kèm danh sách các năm Tam Tai sắp tới.',
  },
  {
    q: 'Xem tuổi khai trương tính theo tuổi ai?',
    a: 'Theo tục phổ biến, xét tuổi của người đứng tên kinh doanh — chủ cửa hàng / chủ doanh nghiệp đứng ra mở hàng. Nếu năm nay chủ vướng hạn và không muốn dời lịch, nhiều người nhờ một người thân hợp tuổi đứng tên khai trương tượng trưng; nhưng quyết định mở hay hoãn nên dựa trên thị trường, vốn và việc chuẩn bị — những thứ ảnh hưởng thật đến cửa hàng.',
  },
  {
    q: 'Xem tuổi khai trương khác gì chọn ngày mở hàng?',
    a: 'Xem tuổi trả lời câu hỏi "NĂM này có hợp để khởi sự không" theo năm sinh chủ. Còn chọn NGÀY mở hàng cụ thể trong năm thì dùng công cụ Xem ngày — chấm điểm từng ngày 0–100 theo sao hoàng đạo, trực, kiêng kỵ và có xét cả tuổi của bạn. Hai bước bổ sung cho nhau: xem tuổi trước, rồi chọn ngày giờ đẹp.',
  },
  {
    q: 'Năm nay vướng Tam Tai thì có nên khai trương không?',
    a: 'Tam Tai là tập tục, không phải lời phán. Nhiều người vẫn khởi sự trong năm Tam Tai và chọn ngày giờ kỹ hơn; số khác dời sang năm hợp tuổi gần nhất. Công cụ liệt kê sẵn các năm hợp tuổi gần nhất của bạn để bạn cân nhắc. Chúng tôi không doạ và không bán "lễ giải hạn" — quyết định cuối là của bạn.',
  },
];

/** Vài tuổi chủ kinh doanh phổ biến để xem nhanh (rộng hơn các trang con một chút). */
const TABLE_YEARS: number[] = Array.from({ length: 36 }, (_, i) => 1965 + i); // 1965–2000

export default function KhaiTruongPage() {
  const rows = TABLE_YEARS.map((y) => ({ year: y, r: checkOpeningYear(y, TARGET_YEAR) }));

  return (
    <>
      <JsonLd
        data={[
          webPage({ name: TITLE, description: DESCRIPTION, url: '/khai-truong' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem tuổi khai trương', url: '/khai-truong' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow={`Khai trương · Năm ${TARGET_YEAR}`}
        icon={<span aria-hidden="true">🎉</span>}
        title={
          <>
            <GoldAccent>Xem tuổi khai trương</GoldAccent> năm {TARGET_YEAR}
          </>
        }
        description={`Nhập năm sinh chủ kinh doanh để biết năm ${TARGET_YEAR} có vướng Tam Tai hay xung tuổi không — kèm phép tính cụ thể từng bước và các năm hợp tuổi gần nhất. Xem tuổi khai trương không xét Kim Lâu / Hoang Ốc. Tham khảo theo tập tục, quyết định là của bạn.`}
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Xem tuổi khai trương' }]}
        relatedSlug="/khai-truong"
      >
        <section className="space-y-8">
          <KhaiTruongChecker defaultTargetYear={TARGET_YEAR} />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Bảng nhanh: chủ sinh năm nào khai trương {TARGET_YEAR} hợp tuổi?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Xét cho tuổi chủ kinh doanh theo Tam Tai và xung Thái Tuế. Bấm vào năm sinh để xem
              trang chi tiết (cách tính đầy đủ, so sánh các năm kế tiếp, các năm hợp tuổi).
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3 font-medium">Năm sinh</th>
                    <th className="py-2 pr-3 font-medium">Can chi</th>
                    <th className="py-2 pr-3 font-medium">Tam Tai</th>
                    <th className="py-2 pr-3 font-medium">Xung tuổi</th>
                    <th className="py-2 font-medium">Kết luận</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ year, r }) => (
                    <tr key={year} className="border-b border-border/50">
                      <td className="py-2 pr-3">
                        {BIRTH_YEARS.includes(year) ? (
                          <Link href={`/khai-truong/${slugOf(year)}`} className="text-gold hover:underline">
                            {year}
                          </Link>
                        ) : (
                          year
                        )}
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground">{r.birthCanChi.name}</td>
                      <td className="py-2 pr-3">
                        {r.tamTai.isTamTai ? (
                          <span className="text-rose-700 dark:text-rose-300">Phạm</span>
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-300">Không</span>
                        )}
                      </td>
                      <td className="py-2 pr-3">
                        {r.xung.isXung ? (
                          <span className="text-amber-700 dark:text-amber-300">Xung</span>
                        ) : r.xung.isNamTuoi ? (
                          <span className="text-muted-foreground">Năm tuổi</span>
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
                          {OPENING_VERDICT_LABEL[r.verdict]}
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
              Khai trương xem gì? — minh bạch để bạn kiểm chứng
            </h2>
            <ul className="mt-3 space-y-1.5 pl-5 text-sm text-muted-foreground list-disc">
              <li>
                <strong className="text-foreground">Tam Tai:</strong> mỗi nhóm tuổi tam hợp gặp Tam
                Tai vào 3 năm liền nhau cố định — dân gian kiêng khởi sự, mở mang trong 3 năm này.
                Ví dụ nhóm Thân-Tý-Thìn gặp Tam Tai các năm Dần, Mão, Thìn.
              </li>
              <li>
                <strong className="text-foreground">Xung Thái Tuế:</strong> chi của năm khai trương
                lục xung với chi tuổi chủ (Tý–Ngọ, Sửu–Mùi, Dần–Thân, Mão–Dậu, Thìn–Tuất, Tỵ–Hợi) —
                năm "khắc" tuổi, nhiều người tránh mở hàng. Năm trùng chi tuổi (năm tuổi) chỉ là lưu
                ý nhẹ, không phải hạn cấm.
              </li>
              <li>
                <strong className="text-foreground">Không xét Kim Lâu / Hoang Ốc:</strong> hai hạn
                đó dành riêng cho việc <strong className="text-foreground">xây nhà</strong> (Hoang Ốc
                là vòng tốt/xấu của dựng nhà) và <strong className="text-foreground">cưới hỏi</strong>{' '}
                (Kim Lâu Thê – Tử – Lục Súc – Bản Mệnh). Khai trương dân gian không gộp hai hạn này —
                chúng tôi cố ý loại để khỏi doạ sai.
              </li>
              <li>
                Xét tuổi <strong className="text-foreground">người đứng tên kinh doanh</strong> (chủ
                cửa hàng / doanh nghiệp đứng ra mở hàng). Tuổi tính theo{' '}
                <strong className="text-foreground">năm âm lịch</strong>: sinh tháng 1–2 dương trước
                Tết thì thuộc năm âm liền trước (nhập lùi 1 năm).
              </li>
              <li>
                Sau khi xem tuổi theo năm, bước tiếp là{' '}
                <strong className="text-foreground">chọn NGÀY GIỜ khai trương</strong> — đó là tầng
                khác (hoàng đạo, hợp mệnh, tránh ngày kiêng kỵ). Dùng công cụ Xem ngày bên dưới.
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
              Xem chi tiết theo năm sinh chủ
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm sm:grid-cols-4">
              {BIRTH_YEARS.map((y) => (
                <li key={y}>
                  <Link href={`/khai-truong/${slugOf(y)}`} className="text-gold hover:underline">
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
                source="khai-truong-hub"
                capturedEvent="lead_capture_khai_truong_hub"
                blurb="Để lại email, chúng tôi sẽ báo bạn khi có bản đầy đủ và nội dung mới theo mùa khai trương (năm hợp tuổi sắp tới, ngày giờ đẹp mở hàng). Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <nav aria-label="Công cụ khai trương liên quan" className="text-sm">
            <span className="text-muted-foreground">Bước tiếp theo: </span>
            <Link href="/xem-ngay/khai-truong" className="text-gold hover:underline">
              Xem ngày khai trương đẹp (chấm điểm từng ngày)
            </Link>
            {', '}
            <Link href="/gio-hoang-dao" className="text-gold hover:underline">
              Giờ hoàng đạo mở hàng
            </Link>
            {', '}
            <Link href="/ngay-kieng-ky" className="text-gold hover:underline">
              Ngày kiêng kỵ dân gian
            </Link>
            {', '}
            <Link href="/hop-tuoi" className="text-gold hover:underline">
              Hợp tuổi hợp tác kinh doanh
            </Link>
            {', '}
            <Link href="/sao-han" className="text-gold hover:underline">
              Xem sao hạn theo tuổi
            </Link>
          </nav>
        </section>
      </ToolPageShell>
    </>
  );
}
