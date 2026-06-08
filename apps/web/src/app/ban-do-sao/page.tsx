import type { Metadata } from 'next';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { SunMoonChecker } from '@/components/ban-do-sao/SunMoonChecker';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { ZODIAC } from '@/lib/western-astrology';

const DESC =
  'Tính cung Mặt Trời & cung Mặt Trăng của bạn theo chiêm tinh phương Tây — từ ngày giờ sinh, bằng thuật toán thiên văn (Meeus) đối chiếu thư viện chuẩn. Con số là thật, diễn giải để hiểu mình, không bói toán.';

export const metadata: Metadata = {
  title: 'Bản đồ sao — cung Mặt Trời & Mặt Trăng của bạn',
  description: DESC,
  alternates: { canonical: 'https://hieu.asia/ban-do-sao' },
  openGraph: {
    title: 'Bản đồ sao — cung Mặt Trời & Mặt Trăng',
    description: DESC,
    url: 'https://hieu.asia/ban-do-sao',
    type: 'website',
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

export default function BanDoSaoPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Bản đồ sao — cung Mặt Trời & Mặt Trăng của bạn',
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
            Cung <GoldAccent>Mặt Trời &amp; Mặt Trăng</GoldAccent>
          </>
        }
        description="Tính cung Mặt Trời & cung Mặt Trăng của bạn từ ngày giờ sinh — bằng thuật toán thiên văn, đối chiếu thư viện chuẩn. Con số là thật; diễn giải để hiểu mình, không bói toán."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Bản đồ sao' }]}
      >
        <section className="space-y-8">
          <SunMoonChecker />

          {/* 12 cung hoàng đạo */}
          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
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
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">
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
            <h2 className="font-mono text-[11px] uppercase tracking-[0.28em] text-gold/80">Một lời nhắn</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Bản đồ sao là một <strong>tấm gương để hiểu mình</strong>, không phải bản án số mệnh. Vị trí
              hành tinh là khoa học thiên văn — phần diễn giải chỉ là một góc nhìn tham khảo. Bạn vẫn là người
              viết nên câu chuyện của mình. hieu.asia trình bày trung thực: con số thật, diễn giải khiêm tốn.
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
              { href: '/mbti', label: 'Trắc nghiệm MBTI' },
              { href: '/than-so-hoc', label: 'Thần số học' },
              { href: '/compatibility', label: 'Xem hợp đôi' },
              { href: '/cong-cu', label: 'Tất cả công cụ' },
            ]}
          />
        </section>
      </ToolPageShell>
    </>
  );
}
