import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@hieu-asia/ui';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';

const TITLE = 'Tử Vi có chính xác không? Chúng tôi đang đo';
const DESC =
  'Hầu hết nơi xem tử vi tự nhận “chính xác” mà không có bằng chứng. Chúng tôi đo bằng dữ liệu thật, có nhóm đối chứng, công khai cả khi lá số trượt. Không bói mù.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/bang-chung/do-chinh-xac' },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: 'https://hieu.asia/bang-chung/do-chinh-xac',
    type: 'website',
    images: [{ url: 'https://hieu.asia/bang-chung/og', width: 1200, height: 630 }],
  },
};

const FAQS = [
  {
    q: 'Tử Vi có chính xác không?',
    a: 'Câu trả lời thành thật là: chúng tôi chưa biết chắc, và đang ĐO. Thay vì tuyên bố một con số, chúng tôi thu thập dữ liệu thật (ẩn danh) từ những người tự kiểm chứng lá số với quá khứ của họ, so với một nhóm đối chứng ngẫu nhiên, rồi sẽ công bố kết quả khi đủ mẫu — kể cả khi kết quả cho thấy lá số không hơn ngẫu nhiên.',
  },
  {
    q: 'Sao tin được đây không phải “tự khen cho đẹp”?',
    a: 'Vì ba ràng buộc: (1) người dùng khai LĨNH VỰC trước khi thấy lá số, nên không thể chọn cung sau khi biết kết quả; (2) mỗi lần đo đều kèm một phép đối chứng — chấm chính lá số đó với một lĩnh vực bị xáo trộn ngẫu nhiên — để biết mức “trùng do ngẫu nhiên”; (3) chúng tôi đặt mức tối thiểu (≥100 ca) trước khi công bố bất kỳ con số nào, kèm khoảng tin cậy, và hiện cả những chỗ lá số TRƯỢT.',
  },
  {
    q: 'Việc kiểm chứng có lưu ngày sinh của tôi không?',
    a: 'Không. Mỗi lần đo chỉ lưu một bản rút gọn, ẩn danh: lĩnh vực đã khai, cung chủ quản, mức khớp, và vài nhóm thô (khoảng tuổi, độ mới của sự kiện). Tuyệt đối KHÔNG lưu ngày sinh, giờ sinh, giới tính, tên, hay năm sự kiện cụ thể — và các bản ghi không liên kết với nhau hay với bạn. Bạn có thể tắt đóng góp bất cứ lúc nào.',
  },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card-editorial border border-border bg-card/40 p-6 backdrop-blur-sm transition hover:border-primary/30">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

export default function DoChinhXacPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: TITLE,
            description: DESC,
            url: '/bang-chung/do-chinh-xac',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Bằng Chứng', url: '/bang-chung' },
            { name: 'Độ chính xác', url: '/bang-chung/do-chinh-xac' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Không bói mù · Đo được, công khai"
        icon={<span aria-hidden="true">📊</span>}
        title={
          <>
            Tử Vi có <GoldAccent>chính xác</GoldAccent> không?
          </>
        }
        description="Hầu hết nơi xem tử vi tự nhận “chính xác” mà không có gì chứng minh. Chúng tôi làm ngược lại — đo bằng dữ liệu thật, có nhóm đối chứng, và sẽ công bố đúng kết quả kể cả khi nó bất lợi cho chúng tôi."
        breadcrumb={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Bằng Chứng', href: '/bang-chung' },
          { label: 'Độ chính xác' },
        ]}
      >
        <div className="space-y-6">
          {/* Trạng thái hiện tại — thành thật, KHÔNG con số khi chưa đủ mẫu */}
          <div className="rounded-card-editorial border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Trạng thái</p>
            <p className="mt-3 font-heading text-xl text-foreground">Đang thu thập dữ liệu</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Chúng tôi <strong>chưa</strong> công bố con số độ chính xác, vì chưa đủ mẫu để con số có ý nghĩa.
              Và chúng tôi sẽ <strong>không</strong> công bố sớm “cho đẹp”. Mỗi lần ai đó tự kiểm chứng lá số
              (ẩn danh) là một mẩu bằng chứng góp vào phép đo này. Khi đủ, kết quả sẽ hiện ngay tại đây —
              kèm khoảng tin cậy và cả những lĩnh vực lá số <strong>không</strong> hơn ngẫu nhiên.
            </p>
          </div>

          <RevealOnScroll>
          <div className="space-y-6 rv-up">
          <Section title="Chúng tôi đo bằng cách nào">
            <p>
              <strong>1. Bạn khai trước.</strong> Trước khi thấy bất cứ điều gì, bạn chọn lĩnh vực (sự nghiệp,
              hôn nhân, sức khỏe…) và năm của vài sự kiện CÓ THẬT đã xảy ra. Khai trước nghĩa là hệ thống không
              thể “xem lá số rồi đoán ngược”.
            </p>
            <p>
              <strong>2. Tính lại lá số đúng thời điểm.</strong> Với mỗi sự kiện, hệ thống dựng lại lá số như nó
              đứng ở năm đó (đại vận, lưu niên, Tứ Hóa) bằng engine kiểm chứng được — không phải AI phỏng đoán.
            </p>
            <p>
              <strong>3. So với một phép đối chứng.</strong> Đây là mấu chốt của sự trung thực: với cùng lá số và
              cùng năm đó, hệ thống chấm thêm một <strong>lĩnh vực bị xáo trộn ngẫu nhiên</strong>. Nếu “khớp
              thật” không cao hơn “khớp ngẫu nhiên” một cách rõ rệt, thì sự trùng hợp <em>chẳng nói lên gì</em> —
              và chúng tôi nói thẳng như vậy.
            </p>
            <p>
              <strong>4. Đếm cả lần trượt.</strong> Mọi lần lá số KHÔNG khớp đều được tính vào, không giấu. Một
              trang chỉ khoe phần trúng là một trang quảng cáo; một trang khoe cả phần trượt mới là bằng chứng.
            </p>
          </Section>

          <Section title="Việc này có an toàn cho dữ liệu của bạn không?">
            <p id="rieng-tu">
              Có. Khi bạn kiểm chứng, hệ thống chỉ lưu một bản <strong>rút gọn, ẩn danh</strong>: lĩnh vực bạn
              khai, cung chủ quản, mức khớp (mạnh / một phần / trượt), và vài nhóm thô (khoảng tuổi, mức độ lâu
              của sự kiện).
            </p>
            <p>
              <strong>Tuyệt đối KHÔNG lưu:</strong> ngày sinh, giờ sinh, giới tính, tên, năm sự kiện cụ thể, hay
              bản đồ lá số của bạn. Các bản ghi không liên kết với nhau và không liên kết với bạn — không thể truy
              ngược ra một con người. Bạn có thể <strong>tắt đóng góp</strong> ngay trên trang kiểm chứng bất cứ
              lúc nào.
            </p>
          </Section>

          <Section title="Cam kết của chúng tôi">
            <p>
              Nếu đến khi đủ dữ liệu mà kết quả cho thấy lá số <strong>không</strong> chính xác hơn ngẫu nhiên ở
              một lĩnh vực nào đó, chúng tôi sẽ <strong>công bố đúng điều đó</strong> — chứ không đi tìm một con
              số đẹp hơn. “Không bói mù” nghĩa là thành thật <em>cả khi</em> sự thật không có lợi cho chúng tôi.
              Đó là thứ làm nên niềm tin, và là thứ chúng tôi đặt cược.
            </p>
          </Section>
          </div>
          </RevealOnScroll>

          <RevealOnScroll>
          <section className="rounded-card-editorial border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 text-center rv-up transition hover:border-gold/50">
            <p className="font-heading text-lg text-foreground">Tự mình kiểm chứng — đừng vội tin</p>
            <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
              Nhập vài sự kiện đời thật đã xảy ra, xem lá số có khớp với chúng không. Bạn vừa tự đánh giá được
              độ tin, vừa (nếu muốn) góp một mẩu bằng chứng ẩn danh vào phép đo công khai này.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link href="/bang-chung">Tự kiểm chứng lá số của tôi →</Link>
            </Button>
          </section>
          </RevealOnScroll>

          <RevealOnScroll>
          <section className="rounded-card-editorial border border-border bg-card/40 p-6 rv-up">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-primary">Câu hỏi thường gặp</h2>
            <dl className="mt-4 space-y-4">
              {FAQS.map((f, i) => (
                <div key={i}>
                  <dt className="font-medium text-foreground">{f.q}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
          </RevealOnScroll>

          <div className="border-t border-border pt-6">
            <RelatedTools
              links={[
                { href: '/bang-chung', label: 'Tự kiểm chứng lá số' },
                { href: '/methodology', label: 'Phương pháp luận' },
                { href: '/tu-vi', label: 'Xem Tử Vi' },
              ]}
            />
          </div>
        </div>
      </ToolPageShell>
    </>
  );
}
