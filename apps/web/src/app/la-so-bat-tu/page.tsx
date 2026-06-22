import type { Metadata } from 'next';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { BatTuChecker } from '@/components/la-so-bat-tu/BatTuChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { OccasionLeadCapture } from '@/components/occasion/OccasionLeadCapture';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';

const DESC =
  'Lập & xem lá số Bát Tự (Tứ Trụ) miễn phí từ ngày giờ sinh — đủ 4 trụ năm/tháng/ngày/giờ (8 chữ), ngũ hành, Nhật Chủ, Thập Thần, cân bằng ngũ hành & đại vận (vận 10 năm). Trụ tính theo tiết khí (đúng chuẩn Bát Tự). Con số là thật; luận giải để hiểu mình, không bói toán.';

const BASE_META: Metadata = {
  title: 'Xem lá số Bát Tự (Tứ Trụ) miễn phí — 8 chữ, ngũ hành, Thập Thần',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/la-so-bat-tu' },
  openGraph: {
    title: 'Xem lá số Bát Tự (Tứ Trụ) miễn phí — 8 chữ, ngũ hành, Thập Thần',
    description: DESC,
    url: 'https://hieu.asia/la-so-bat-tu',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'hieu.asia — Lá số Bát Tự Tứ Trụ' }],
  },
};

// Link chia sẻ (?d=&t=&g=) → ảnh OG ĐỘNG theo lá số (preview FB/Zalo hiện 4 trụ
// của người gửi). Canonical VẪN trỏ /la-so-bat-tu (không index URL tham số).
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; t?: string; g?: string }>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const d = sp?.d;
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return BASE_META;
  const t = sp.t ?? '12:00';
  const g = sp.g === 'F' ? 'F' : 'M';
  const ogUrl = `https://hieu.asia/la-so-bat-tu/og?d=${d}&t=${encodeURIComponent(t)}&g=${g}`;
  const title = 'Lá số Bát Tự (Tứ Trụ) của tôi — hieu.asia';
  return {
    ...BASE_META,
    title,
    openGraph: { ...BASE_META.openGraph, title, images: [{ url: ogUrl, width: 1200, height: 630, alt: 'Lá số Bát Tự (Tứ Trụ)' }] },
    twitter: { card: 'summary_large_image', title, images: [ogUrl] },
  };
}

const TRU: Array<{ name: string; govern: string }> = [
  { name: 'Trụ Năm', govern: 'gốc gác, tổ tiên, thời thơ ấu (~0–16 tuổi) & bối cảnh xuất thân' },
  { name: 'Trụ Tháng', govern: 'cha mẹ, môi trường trưởng thành, sự nghiệp & thanh niên (~17–32)' },
  { name: 'Trụ Ngày', govern: 'CHÍNH BẠN (can ngày = Nhật Chủ) + bạn đời, trung niên (~33–48)' },
  { name: 'Trụ Giờ', govern: 'con cái, hậu vận, thành quả cuối đời (~49+)' },
];

const THAP_THAN: Array<{ name: string; note: string }> = [
  { name: 'Tỷ Kiên · Kiếp Tài', note: 'cùng hành với mình — anh em, bạn bè, cạnh tranh, hợp tác' },
  { name: 'Thực Thần · Thương Quan', note: 'mình sinh ra — tài năng, sáng tạo, diễn đạt, con cái (với nữ)' },
  { name: 'Chính Tài · Thiên Tài', note: 'mình khắc — tiền bạc, của cải, vợ (với nam)' },
  { name: 'Chính Quan · Thất Sát', note: 'khắc mình — kỷ luật, áp lực, công danh, chồng (với nữ)' },
  { name: 'Chính Ấn · Thiên Ấn', note: 'sinh ra mình — chỗ dựa, học vấn, mẹ, sự nâng đỡ' },
];

const FAQS = [
  {
    q: 'Bát Tự (Tứ Trụ) là gì?',
    a: 'Bát Tự — "tám chữ" — là cách ghi giờ phút sinh ra bằng can chi của bốn trụ: năm, tháng, ngày, giờ. Mỗi trụ một can + một chi, tổng cộng 8 chữ. Từ tám chữ này xét ngũ hành, can ngày (Nhật Chủ = chính bạn) và quan hệ Thập Thần để mô tả thiên hướng tính cách, sở trường, các mối quan hệ — không phải bản án số mệnh.',
  },
  {
    q: 'Cần thông tin gì để lập lá số Bát Tự?',
    a: 'Ngày sinh dương lịch, giờ sinh và giới tính. Công cụ tự tính 4 trụ theo can chi; giới tính dùng để xác định chiều đại vận (thuận hay nghịch). Giờ sinh quyết định trụ giờ; ba trụ còn lại (năm, tháng, ngày) không phụ thuộc giờ.',
  },
  {
    q: 'Lá số ở đây tính thế nào, có chính xác không?',
    a: 'Trụ năm và trụ tháng được tính theo TIẾT KHÍ — tức theo vị trí thật của Mặt Trời (trụ năm đổi tại Lập Xuân, trụ tháng theo 12 tiết), đúng chuẩn mệnh lý Bát Tự. Đây là điểm nhiều công cụ làm sai (lấy theo tháng âm lịch nên lệch một can). Vị trí Mặt Trời được tính bằng thuật toán thiên văn chuẩn, sai số dưới 0,01 độ. Phần con số là kết quả tính xác định, kiểm chứng được.',
  },
  {
    q: 'Bát Tự khác Tử Vi thế nào?',
    a: 'Cùng dùng ngày giờ sinh nhưng hai hệ khác nhau: Tử Vi an 12 cung + sao trên một "bản đồ", thiên về từng lĩnh vực đời sống; Bát Tự nhìn sự cân bằng ngũ hành quanh Nhật Chủ (chính bạn), thiên về tính cách, sở trường và dòng chảy vận. Xem cả hai cho góc nhìn bổ sung.',
  },
  {
    q: 'Đại vận (vận 10 năm) là gì?',
    a: 'Đại vận là chuỗi giai đoạn 10 năm, mỗi giai đoạn mang một trụ can chi — cho biết "bối cảnh" lớn của mỗi thập niên đời người. Chiều đi (thuận hay nghịch) tính theo can năm sinh và giới tính; tuổi khởi vận tính theo số ngày từ lúc sinh tới tiết khí gần nhất (3 ngày ≈ 1 tuổi). Công cụ hiển thị chuỗi đại vận và đánh dấu giai đoạn bạn đang ở — để soi trọng tâm từng thập niên, không phải dự đoán may rủi.',
  },
  {
    q: 'Tàng can và nạp âm là gì?',
    a: 'Tàng can là các thiên can ẩn bên trong mỗi địa chi (mỗi chi chứa 1–3 can) — đây mới là phần quyết định ngũ hành thật của lá số và cho đủ bộ Thập Thần, nên luận Bát Tự luôn xét tàng can chứ không chỉ 8 chữ nổi. Nạp âm là "mệnh" theo vòng 60 hoa giáp (ví dụ Canh Ngọ là Lộ Bàng Thổ) — cách gọi ngũ hành quen thuộc với người Việt, khác với ngũ hành của riêng can hay chi. Công cụ hiển thị cả tàng can (kèm Thập Thần) lẫn nạp âm cho từng trụ; đều là dữ kiện tra theo bảng cố định, kiểm chứng được.',
  },
  {
    q: 'Lục Hợp, Lục Xung giữa các trụ là gì?',
    a: 'Mười hai địa chi có những quan hệ cố định với nhau: Lục Hợp (hai chi hoà hợp, ví dụ Tý–Sửu, Ngọ–Mùi), Lục Xung (hai chi đối nhau, ví dụ Tý–Ngọ, Dần–Thân), Tam Hợp (ba chi tụ thành một hành mạnh, ví dụ Thân–Tý–Thìn thành Thủy) và Lục Hại (khắc ngầm nhẹ). Khi đối chiếu giữa bốn trụ của lá số, các quan hệ này cho thấy nội lực hoà hay căng — trụ nào dễ phối hợp, trụ nào có lực động/đối lập. Công cụ tự dò và liệt kê; đây là dữ kiện tra theo bảng cố định, không phải lời đoán may rủi (Lục Xung chỉ là lực thay đổi, không phải điềm xấu).',
  },
  {
    q: 'Đây có phải bói toán không?',
    a: 'Không. Việc lập 4 trụ là tính toán xác định; phần luận giải chỉ mô tả thiên hướng và gợi ý để bạn TỰ hiểu mình, không phán hoạ phúc hay tiên đoán số mệnh chắc chắn. Đó là điểm khác biệt của hieu.asia so với bói mù.',
  },
  {
    q: 'Không nhớ chính xác giờ sinh thì sao?',
    a: 'Cứ để 12:00. Ba trụ năm – tháng – ngày vẫn đúng; chỉ trụ giờ là ước lượng. Khi biết giờ chính xác, bạn lập lại để có đủ cả 4 trụ.',
  },
];

export default function LaSoBatTuPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Xem lá số Bát Tự (Tứ Trụ) miễn phí — 8 chữ, ngũ hành, Thập Thần',
            description: DESC,
            url: '/la-so-bat-tu',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Xem lá số Bát Tự', url: '/la-so-bat-tu' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Bát Tự · Tứ Trụ · Lập lá số miễn phí"
        icon={<span aria-hidden="true">☯</span>}
        title={
          <>
            Xem <GoldAccent>lá số Bát Tự</GoldAccent> miễn phí
          </>
        }
        description="Lập đủ 4 trụ năm/tháng/ngày/giờ (8 chữ), ngũ hành, Nhật Chủ & Thập Thần từ ngày giờ sinh — tính theo tiết khí, đúng chuẩn. Con số là thật, để bạn tự soi, không bói toán."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Xem lá số Bát Tự' }]}
        relatedSlug="/la-so-bat-tu"
      >
        <section className="space-y-8">
          <BatTuChecker />

          {/* 4 trụ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Bốn trụ nói lên điều gì
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Mỗi trụ là một can + một chi, ứng với một giai đoạn đời và một nhóm quan hệ. Trụ ngày quan trọng
              nhất: <strong className="text-foreground">can ngày chính là bạn (Nhật Chủ)</strong>, mọi trụ khác
              đọc theo quan hệ với nó.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {TRU.map((t) => (
                <div key={t.name} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="font-heading text-base font-semibold text-foreground">{t.name}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.govern}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Thập Thần */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
              Thập Thần — 10 mối quan hệ với Nhật Chủ
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Từ Nhật Chủ (chính bạn), mỗi can/hành khác tạo một trong mười &ldquo;quan hệ&rdquo; dựa trên
              ngũ hành sinh – khắc và âm dương. Đây là khung để đọc sở trường, tiền tài, công danh, chỗ dựa…
            </p>
            <ul className="mt-4 space-y-2">
              {THAP_THAN.map((t) => (
                <li key={t.name} className="text-sm leading-relaxed text-foreground/85">
                  <strong className="text-foreground">{t.name}</strong>{' '}
                  <span className="text-muted-foreground">— {t.note}.</span>
                </li>
              ))}
            </ul>
          </section>

          {/* brand note */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">Một lời nhắn</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tám chữ là một <strong>tấm gương để hiểu mình</strong>, không phải bản án số mệnh. Việc lập trụ
              là tính toán xác định; cân bằng ngũ hành chỉ gợi ý nơi bạn mạnh, nơi nên bù đắp. Bạn vẫn là người
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
                source="la-so-bat-tu"
                capturedEvent="lead_capture_la_so_bat_tu"
                blurb="Để lại email, chúng tôi báo khi có nội dung mới theo mùa cho lá số Bát Tự của bạn: vận năm mới, ngày tốt, xem ngày. Thi thoảng thôi, không spam."
                cta="Nhận nhắc"
              />
            </div>
          </section>

          <RelatedTools
            links={[
              { href: '/bat-tu', label: 'Cẩm nang Bát Tự' },
              { href: '/la-so-tu-vi', label: 'Xem lá số Tử Vi' },
              { href: '/ban-do-sao', label: 'Bản đồ sao (chiêm tinh)' },
              { href: '/cong-cu', label: 'Tất cả công cụ' },
            ]}
          />
        </section>
      </ToolPageShell>
    </>
  );
}
