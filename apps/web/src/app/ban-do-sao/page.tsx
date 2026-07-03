import type { Metadata } from 'next';
import Link from 'next/link';
import { SunMoonChecker } from '@/components/ban-do-sao/SunMoonChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { ZODIAC } from '@/lib/western-astrology';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';

const DESC =
  'Tính bản đồ sao chiêm tinh phương Tây — cung Mặt Trời, Mặt Trăng, cung Mọc & 8 hành tinh từ ngày giờ sinh, bằng thuật toán thiên văn. Diễn giải để hiểu mình.';

export const metadata: Metadata = {
  title: 'Bản đồ sao — Mặt Trời, Mặt Trăng & 8 hành tinh',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/ban-do-sao' },
  openGraph: {
    title: 'Bản đồ sao — Mặt Trời, Mặt Trăng & 8 hành tinh',
    description: DESC,
    url: 'https://hieu.asia/ban-do-sao',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

const FAQS = [
  {
    q: 'Cung Mặt Trời (sun sign) là gì?',
    a: 'Cung Mặt Trời là vị trí của Mặt Trời trên vòng hoàng đạo lúc bạn sinh — chính là “cung hoàng đạo” mà hầu hết mọi người biết. Nó phản ánh bản ngã cốt lõi, cách bạn thể hiện và điều thúc đẩy bạn. Khác với báo lá cải chia theo ngày cố định, công cụ này tính vị trí Mặt Trời thực tế nên đúng cả với người sinh sát ranh giới hai cung.',
  },
  {
    q: 'Cung Mặt Trăng (moon sign) khác gì cung Mặt Trời?',
    a: 'Mặt Trăng đại diện cho thế giới cảm xúc, nhu cầu nội tâm và điều khiến bạn thấy an toàn. Mặt Trăng đi rất nhanh (đổi cung khoảng 2–3 ngày một lần) nên cần ngày VÀ giờ sinh để tính chính xác. Nhiều người thấy cung Mặt Trăng mô tả “con người bên trong” đúng hơn cả cung Mặt Trời.',
  },
  {
    q: 'Cung Mọc (Ascendant / rising sign) là gì?',
    a: 'Cung Mọc là cung hoàng đạo đang mọc lên ở chân trời phía đông ngay lúc bạn sinh. Nó phản ánh vẻ ngoài, ấn tượng đầu tiên và cách bạn bước vào thế giới — cùng Mặt Trời và Mặt Trăng tạo thành bộ “tam trụ” của bản đồ sao. Cung Mọc đổi nhanh (~1 cung mỗi 2 giờ) nên cần GIỜ SINH chính xác VÀ NƠI SINH (kinh/vĩ độ) — vì thế công cụ hỏi thêm tỉnh/thành nơi bạn sinh.',
  },
  {
    q: 'Vì sao cần giờ sinh?',
    a: 'Cung Mặt Trời gần như không đổi trong ngày nên giờ ít quan trọng. Nhưng Mặt Trăng di chuyển ~0,5°/giờ, nên nếu sinh gần lúc Mặt Trăng chuyển cung, giờ sinh sai có thể làm lệch cung Mặt Trăng. Nếu không nhớ giờ, để 12:00 và xem cung Mặt Trăng như tham khảo.',
  },
  {
    q: 'Đây có phải bói toán không?',
    a: 'Không. Vị trí hành tinh được tính bằng thuật toán thiên văn chuẩn (Meeus), đã đối chiếu với thư viện thiên văn độc lập — phần CON SỐ là khoa học, kiểm chứng được. Phần diễn giải tính cách chỉ mang tính tham khảo để bạn hiểu mình hơn, không phải tiên đoán số mệnh hay họa phúc.',
  },
  {
    q: 'Số chính xác tới đâu?',
    a: 'Engine được kiểm chứng chéo với thư viện thiên văn astronomy-engine trên 200 mốc thời gian ngẫu nhiên (1950–2030): sai số Mặt Trời < 0,01°, Mặt Trăng < 0,04°, không lệch cung. Cung rộng 30° nên độ chính xác này thừa sức xác định cung.',
  },
];

const ELEMENTS: Array<{ name: string; tone: string; signs: string }> = [
  { name: 'Lửa 🔥', tone: 'Nhiệt huyết, hành động, cảm hứng', signs: 'Bạch Dương · Sư Tử · Nhân Mã' },
  { name: 'Đất 🌍', tone: 'Thực tế, bền vững, đáng tin', signs: 'Kim Ngưu · Xử Nữ · Ma Kết' },
  { name: 'Khí 💨', tone: 'Tư duy, giao tiếp, ý tưởng', signs: 'Song Tử · Thiên Bình · Bảo Bình' },
  { name: 'Nước 💧', tone: 'Cảm xúc, trực giác, đồng cảm', signs: 'Cự Giải · Bọ Cạp · Song Ngư' },
];

// Link mở sẵn lá số (?d=&t=&g=) → tự điền ngày/giờ sinh, lá số Mặt Trời/Mặt Trăng
// hiện ngay không phải nhập lại. Theo đúng khuôn /la-so-bat-tu (server đọc query,
// truyền prop initial*) để tránh lỗi soft-404 của useSearchParams. `g` (giới tính)
// được nhận nhưng bỏ qua — chiêm tinh Tây không cần. Nơi sinh KHÔNG truyền: engine
// tự lược cung Mọc một cách êm khi thiếu (không bịa nơi sinh).
export default async function BanDoSaoPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; t?: string; g?: string }>;
}) {
  const sp = await searchParams;
  const initialDate = sp?.d && /^\d{4}-\d{1,2}-\d{1,2}$/.test(sp.d) ? sp.d : undefined;
  const initialTime = initialDate ? sp.t : undefined;
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Bản đồ sao — Mặt Trời, Mặt Trăng & 8 hành tinh',
            description: DESC,
            url: '/ban-do-sao',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Bản đồ sao', url: '/ban-do-sao' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Chiêm tinh phương Tây · Bản đồ sao"
        icon={<span aria-hidden="true">🔭</span>}
        title={
          <>
            <GoldAccent>Bản đồ sao</GoldAccent> của bạn
          </>
        }
        description="Cung Mặt Trời, Mặt Trăng & 8 hành tinh (Sao Thủy → Diêm Vương) từ ngày giờ sinh — bằng thuật toán thiên văn, đối chiếu thư viện chuẩn. Con số là thật; diễn giải để hiểu mình, không bói toán."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Bản đồ sao' }]}
        relatedSlug="/ban-do-sao"
      >
        <section className="space-y-8">
          <SunMoonChecker initialDate={initialDate} initialTime={initialTime} />

          {/* 12 cung hoàng đạo */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              12 cung hoàng đạo
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ZODIAC.map((s) => (
                <div key={s.idx} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-heading text-base font-semibold text-foreground">
                      {s.symbol} {s.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                      {s.element} · {s.quality}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4 nguyên tố */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Bốn nguyên tố
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {ELEMENTS.map((e) => (
                <div key={e.name} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="font-heading text-base font-semibold text-foreground">{e.name}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.tone}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{e.signs}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Lời nhắn */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">Một lời nhắn</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Bản đồ sao là một <strong>tấm gương để hiểu mình</strong>, không phải bản án số mệnh. Vị trí
              hành tinh là khoa học thiên văn — phần diễn giải chỉ là một góc nhìn tham khảo. Bạn vẫn là người
              viết nên câu chuyện của mình. hieu.asia trình bày trung thực: con số thật, diễn giải khiêm tốn.
            </p>
          </section>

          {/* Tìm hiểu thêm */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Tìm hiểu thêm
            </h2>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <Link href="/learn/chiem-tinh" className="text-gold hover:underline">
                Học về chiêm tinh phương Tây →
              </Link>
              <Link href="/cung-hoang-dao" className="text-gold hover:underline">
                12 cung hoàng đạo →
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
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
        </section>
      </ToolPageShell>
    </>
  );
}
