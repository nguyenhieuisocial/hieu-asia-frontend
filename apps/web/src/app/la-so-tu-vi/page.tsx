import type { Metadata } from 'next';
import { LaSoChecker } from '@/components/la-so-tu-vi/LaSoChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

const DESC =
  'Lập & xem lá số Tử Vi Đẩu Số miễn phí từ ngày giờ sinh — đầy đủ 12 cung, 114 sao, độ sáng (miếu/vượng/hãm), Tứ Hóa, cách cục & tam phương tứ chính, bằng engine chuẩn. Con số là thật; luận giải để hiểu mình, không bói toán.';

export const metadata: Metadata = {
  title: 'Xem lá số Tử Vi miễn phí — 12 cung, 114 sao, cách cục',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/la-so-tu-vi' },
  openGraph: {
    title: 'Xem lá số Tử Vi miễn phí — 12 cung, 114 sao, cách cục',
    description: DESC,
    url: 'https://hieu.asia/la-so-tu-vi',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

const CUNG: Array<{ name: string; govern: string }> = [
  { name: 'Mệnh', govern: 'bản thân, tính cách cốt lõi, khí chất' },
  { name: 'Phụ Mẫu', govern: 'cha mẹ, bề trên, học vấn nền tảng' },
  { name: 'Phúc Đức', govern: 'phúc khí, tinh thần, sự an yên' },
  { name: 'Điền Trạch', govern: 'nhà cửa, tài sản, gia trạch' },
  { name: 'Quan Lộc', govern: 'sự nghiệp, công danh, vị thế' },
  { name: 'Nô Bộc', govern: 'bạn bè, cấp dưới, mạng lưới' },
  { name: 'Thiên Di', govern: 'di chuyển, môi trường ngoài, cơ hội' },
  { name: 'Tật Ách', govern: 'sức khỏe, tai ách tiềm ẩn' },
  { name: 'Tài Bạch', govern: 'tiền bạc, cách kiếm & giữ của' },
  { name: 'Tử Tức', govern: 'con cái, sáng tạo, hậu duệ' },
  { name: 'Phu Thê', govern: 'hôn nhân, bạn đời, tình cảm' },
  { name: 'Huynh Đệ', govern: 'anh chị em, cộng sự ngang vai' },
];

const FAQS = [
  {
    q: 'Lá số Tử Vi là gì?',
    a: 'Lá số Tử Vi Đẩu Số là tấm bản đồ 12 cung an theo ngày, tháng, năm và giờ sinh, trên đó sắp xếp 14 chính tinh cùng hàng chục phụ tinh. Mỗi cung phản ánh một lĩnh vực đời sống (bản thân, sự nghiệp, tài bạch, hôn nhân…); vị trí và độ sáng của sao mô tả thiên hướng, không phải bản án số mệnh.',
  },
  {
    q: 'Cần thông tin gì để lập lá số?',
    a: 'Chỉ cần ngày sinh dương lịch, giờ sinh và giới tính. Engine sẽ tự đổi sang âm lịch, xác định Ngũ hành Cục rồi an 12 cung và các sao. Giờ sinh càng chính xác thì việc an cung càng đúng.',
  },
  {
    q: 'Lá số ở đây dựa trên gì, có chính xác không?',
    a: 'Lá số được an bằng engine Tử Vi chuẩn (thư viện iztro, 114 sao, đủ độ sáng miếu/vượng/đắc/bình/hãm, Tứ Hóa, đại vận – lưu niên). Phần CON SỐ — an cung, an sao — là kết quả tính toán xác định, kiểm chứng được, không phải phán đoán cảm tính.',
  },
  {
    q: 'Xem miễn phí ở đây khác gì bản đọc Tử Vi trả phí?',
    a: 'Trang này cho bạn tra cứu MIỄN PHÍ lá số đầy đủ + cách cục để tự xem. Bản đọc trả phí là phần AI LUẬN GIẢI sâu, cá nhân hoá: đọc 12 cung theo tam phương tứ chính, phân tích đại vận – lưu niên, đối chiếu cổ thư và viết thành một bản đọc mạch lạc riêng cho bạn — đó mới là giá trị cốt lõi.',
  },
  {
    q: 'Đây có phải bói toán không?',
    a: 'Không. Việc an cung – an sao là tính toán xác định; phần luận giải chỉ mô tả thiên hướng và gợi ý để bạn TỰ hiểu mình và ra quyết định, không phán họa phúc hay tiên đoán số mệnh chắc chắn. Đây là điểm khác biệt của hieu.asia so với bói mù.',
  },
  {
    q: 'Không nhớ chính xác giờ sinh thì sao?',
    a: 'Cứ để 12:00 (giờ Ngọ). Phần lớn cách an cung Mệnh – Thân và vị trí chính tinh vẫn đúng; chỉ một số sao an theo giờ có thể lệch. Khi biết giờ chính xác, bạn lập lại để có lá số đúng nhất.',
  },
];

const DATE_RE = /^\d{4}-\d{1,2}-\d{1,2}$/;

export default async function LaSoTuViPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; t?: string; g?: string }>;
}) {
  // Link chia sẻ (?d=&t=&g=) → tự điền + lập lá số ngay (không phải nhập lại).
  // Đọc tham số ở server rồi truyền xuống làm initial state — KHÔNG dùng hook
  // useSearchParams (tránh lỗi soft-404 đã biết). g=M→male, g=F→female.
  const sp = await searchParams;
  const d = typeof sp?.d === 'string' && DATE_RE.test(sp.d) ? sp.d : undefined;
  const t = d && typeof sp?.t === 'string' && /^\d{1,2}:\d{2}$/.test(sp.t) ? sp.t : undefined;
  const g: 'male' | 'female' | undefined = d ? (sp?.g === 'F' ? 'female' : 'male') : undefined;

  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Xem lá số Tử Vi miễn phí — 12 cung, 114 sao, cách cục',
            description: DESC,
            url: '/la-so-tu-vi',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem lá số Tử Vi', url: '/la-so-tu-vi' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Tử Vi Đẩu Số · Lập lá số miễn phí"
        icon={<span aria-hidden="true">☯</span>}
        title={
          <>
            Xem <GoldAccent>lá số Tử Vi</GoldAccent> miễn phí
          </>
        }
        description="Lập lá số đầy đủ 12 cung, 114 sao, độ sáng & Tứ Hóa từ ngày giờ sinh — bằng engine chuẩn. Con số là thật; cách cục & tam phương để bạn tự soi, không bói toán."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Xem lá số Tử Vi' }]}
        relatedSlug="/la-so-tu-vi"
      >
        <section className="space-y-8">
          <LaSoChecker
            initialDate={d}
            initialTime={t}
            initialGender={g}
            autoCast={Boolean(d)}
          />

          {/* 12 cung */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              12 cung trong lá số
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Lá số chia đời người thành 12 cung, mỗi cung là một lĩnh vực. Sao đóng tại cung nào thì tô màu
              cho lĩnh vực đó.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CUNG.map((c) => (
                <div key={c.name} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="font-heading text-base font-semibold text-foreground">{c.name}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.govern}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Đọc theo tam phương tứ chính — showcase method */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Đọc theo tam phương tứ chính
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Nguyên tắc cốt lõi của Tử Vi: <strong>không đọc một cung riêng lẻ</strong>. Mỗi cung được xét
              cùng <strong>tam hợp</strong> (hai cung cách 4 cung) và <strong>cung xung chiếu</strong> (cung
              đối diện). Ví dụ, đọc cung Mệnh phải xét chung Quan Lộc + Tài Bạch (tam hợp) và Thiên Di (xung
              chiếu) — bốn cung này tạo thành &ldquo;tam phương tứ chính&rdquo;. Từ các chính tinh hội về Mệnh,
              ta nhận ra <strong>cách cục</strong> (Sát Phá Tham, Cơ Nguyệt Đồng Lương, Tử Phủ Vũ Tướng, Tử
              Phủ Đồng Cung, Cự Cơ Đồng Cung…) — khuôn hình thiên hướng của lá số. Khi bạn bấm chọn một cung ở trên, các cung trong tam
              phương tứ chính sẽ được tô sáng để dễ đọc.
            </p>
          </section>

          {/* Một lời nhắn — brand */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">Một lời nhắn</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Lá số là một <strong>tấm gương để hiểu mình</strong>, không phải bản án số mệnh. Việc an cung –
              an sao là tính toán xác định; phần luận giải chỉ là một góc nhìn tham khảo. Bạn vẫn là người
              viết nên câu chuyện của mình. hieu.asia trình bày trung thực: con số thật, luận giải khiêm tốn,
              không bói mù.
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

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Nhận nhắc theo mùa
            </h2>
            <div className="mt-4">
              <OccasionLeadCapture
                source="la-so-tu-vi"
                capturedEvent="lead_capture_la_so_tu_vi"
                blurb="Để lại email, chúng tôi báo khi có nội dung mới theo mùa cho lá số của bạn: tử vi năm mới, sao hạn, ngày tốt. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </section>
        </section>
      </ToolPageShell>
    </>
  );
}
