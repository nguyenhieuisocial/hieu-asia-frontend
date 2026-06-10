import type { Metadata } from 'next';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { KiengKyChecker } from '@/components/ngay-kieng-ky/KiengKyChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { KIENG_KY_INFO, type KiengKyKey } from '@/lib/ngay-kieng-ky';

const DESC =
  'Tra ngày kiêng kỵ theo phong tục dân gian: Tam Nương (mùng 3, 7, 13, 18, 22, 27), Nguyệt Kỵ (mùng 5, 14, 23) và Dương Công Kỵ Nhật. Nhập ngày dương lịch để xem ngày âm và ngày đó có phải ngày kiêng không — tham khảo, không bói toán.';

export const metadata: Metadata = {
  title: 'Ngày kiêng kỵ — Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/ngay-kieng-ky' },
  openGraph: {
    title: 'Ngày kiêng kỵ — Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật',
    description: DESC,
    url: 'https://hieu.asia/ngay-kieng-ky',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Ngày Tam Nương là những ngày nào?',
    a: 'Tam Nương là 6 ngày âm lịch cố định trong mỗi tháng: mùng 3, 7, 13, 18, 22 và 27. Theo phong tục, người xưa thường tránh khởi sự việc lớn (cưới hỏi, khai trương, động thổ, đi xa) vào những ngày này. Đây là tập tục văn hoá, mang tính tham khảo.',
  },
  {
    q: 'Ngày Nguyệt Kỵ là gì?',
    a: 'Nguyệt Kỵ là 3 ngày mùng 5, 14, 23 âm lịch — cộng các chữ số đều ra 5. Dân gian có câu "Mùng năm, mười bốn, hai ba; đi chơi cũng thiệt nữa là đi buôn", ý nhắc tránh xuất hành, buôn bán hay giao dịch lớn vào những ngày này.',
  },
  {
    q: 'Dương Công Kỵ Nhật gồm những ngày nào?',
    a: 'Đó là 13 ngày âm lịch trong năm: tháng 1 ngày 13, tháng 2 ngày 11, tháng 3 ngày 9, tháng 4 ngày 7, tháng 5 ngày 5, tháng 6 ngày 3, tháng 7 ngày 8 và 29, tháng 8 ngày 27, tháng 9 ngày 25, tháng 10 ngày 23, tháng 11 ngày 21, tháng 12 ngày 19. Người xưa thường tránh khởi công, xây dựng, cưới hỏi vào các ngày này.',
  },
  {
    q: 'Có nhất thiết phải kiêng các ngày này không?',
    a: 'Không. Đây là phong tục để tham khảo, không phải quy tắc bắt buộc. Ngày kiêng chủ yếu được cân nhắc cho việc trọng đại; sinh hoạt, công việc thường ngày không cần kiêng. hieu.asia trình bày để bạn biết và tự quyết định, không phán số mệnh.',
  },
  {
    q: 'Làm sao biết hôm nay có phải ngày kiêng kỵ không?',
    a: 'Bạn nhập ngày dương lịch vào ô tra cứu phía trên (mặc định là hôm nay). Hệ thống tự đổi sang ngày âm và cho biết ngày đó có rơi vào Tam Nương, Nguyệt Kỵ hay Dương Công Kỵ Nhật không, kèm danh sách các ngày kiêng trong cả tháng.',
  },
];

const ORDER: KiengKyKey[] = ['tam_nuong', 'nguyet_ky', 'duong_cong', 'nguyet_tan'];

export default function NgayKiengKyPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Ngày kiêng kỵ — Tam Nương, Nguyệt Kỵ, Dương Công Kỵ Nhật',
            description: DESC,
            url: '/ngay-kieng-ky',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Lịch Vạn Niên', url: '/lich-van-nien' },
            { name: 'Ngày kiêng kỵ', url: '/ngay-kieng-ky' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Lịch Vạn Niên · Ngày kiêng kỵ"
        icon={<span aria-hidden="true">🗓️</span>}
        title={
          <>
            Ngày <GoldAccent>kiêng kỵ</GoldAccent>
          </>
        }
        description="Tra ngày Tam Nương, Nguyệt Kỵ và Dương Công Kỵ Nhật theo âm lịch. Nhập một ngày dương lịch để biết ngày đó có phải ngày kiêng không — tra cứu theo phong tục dân gian để tham khảo, không phán số mệnh."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lịch Vạn Niên', href: '/lich-van-nien' },
          { label: 'Ngày kiêng kỵ' },
        ]}
      >
        <section className="space-y-8">
          <KiengKyChecker />

          {/* Ba loại ngày kiêng kỵ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Bốn loại ngày kiêng kỵ phổ biến
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ORDER.map((key) => {
                const info = KIENG_KY_INFO[key];
                return (
                  <div key={key} className="rounded-xl border border-border bg-background/40 p-4">
                    <div className="font-heading text-base font-semibold text-foreground">
                      {info.name}
                    </div>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {info.days}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {info.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lời nhắn — neutral framing */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Một lời nhắn
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Ngày kiêng kỵ là một nét văn hoá lâu đời, giúp ông bà ta nhắc nhau thận trọng khi làm
              việc lớn. Rơi vào ngày kiêng không có nghĩa là chắc chắn xui rủi, và tránh được ngày
              kiêng cũng không thay cho sự chuẩn bị chu đáo. hieu.asia trình bày để bạn{' '}
              <strong>tham khảo</strong> và chủ động hơn — không phán số mệnh, không gieo lo sợ.
            </p>
          </section>

          {/* FAQ */}
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

          <RelatedTools
            links={[
              { href: '/xem-ngay', label: 'Xem ngày tốt' },
              { href: '/sao-han', label: 'Xem sao hạn' },
              { href: '/gio-hoang-dao', label: 'Giờ hoàng đạo' },
              { href: '/lich-van-nien', label: 'Lịch Vạn Niên' },
            ]}
          />
        </section>
      </ToolPageShell>
    </>
  );
}
