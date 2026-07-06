import type { Metadata } from 'next';
import { BangChungTool } from '@/components/bang-chung/BangChungTool';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { RevealOnScroll } from '@/components/motion/RevealOnScroll';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { deriveProofCard, firstParam } from '@/lib/bang-chung/share-card';

const DESC =
  'Đừng vội tin lá số — hãy KIỂM CHỨNG nó bằng chính quá khứ của bạn. Nhập vài sự kiện đời thật đã xảy ra, hệ thống tính lại lá số đúng như nó đứng ở từng năm đó và cho thấy lá số có ghi dấu lĩnh vực ấy không — thành thật cả khi không khớp. Con số là thật, không bói mù.';

const TITLE = 'Bằng chứng — kiểm chứng độ chính xác lá số';

// Dynamic OG: when a shared link carries the aggregate result (hit/total/strong —
// NO personal data), unfurl a personalized card so it spreads. Otherwise default.
export function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): Metadata {
  // Same anti-overclaim guard as the OG image route (single source of truth) so
  // the unfurled title and the card image can never disagree.
  const card = deriveProofCard({
    total: firstParam(searchParams.total),
    hit: firstParam(searchParams.hit),
    strong: firstParam(searchParams.strong),
  });

  if (card.valid) {
    const { hit, total, strong } = card;
    const ogUrl = `https://hieu.asia/bang-chung/og?hit=${hit}&total=${total}&strong=${strong}`;
    const desc = `Tôi tự đối chiếu lá số với quá khứ thật của mình trên hieu.asia — trùng khớp ${hit}/${total} mốc, có khoe cả mốc trật. Một mốc trùng chưa nói lên gì; cái chính là kiểm chứng được trước khi tin. Không bói mù.`;
    return {
      title: TITLE,
      description: desc,
      alternates: { canonical: 'https://hieu.asia/bang-chung' },
      openGraph: {
        title: `Tôi đối chiếu lá số với đời thật — trùng khớp ${hit}/${total} mốc · Bằng Chứng`,
        description: desc,
        url: 'https://hieu.asia/bang-chung',
        type: 'website',
        images: [{ url: ogUrl, width: 1200, height: 630 }],
      },
      twitter: { card: 'summary_large_image', title: TITLE, description: desc, images: [ogUrl] },
    };
  }

  return {
    title: TITLE,
    description: DESC,
    alternates: { canonical: 'https://hieu.asia/bang-chung' },
    openGraph: {
      title: TITLE,
      description: DESC,
      url: 'https://hieu.asia/bang-chung',
      type: 'website',
      // Branded default card (the no-param /og render "Kiểm chứng lá số bằng quá khứ
      // của bạn") so even a non-shared link unfurls on-brand, not the generic site image.
      images: [{ url: 'https://hieu.asia/bang-chung/og', width: 1200, height: 630 }],
    },
  };
}

const STEPS = [
  {
    n: '1',
    t: 'Bạn khai TRƯỚC',
    d: 'Chọn lĩnh vực (sự nghiệp, hôn nhân, sức khỏe…) và năm của vài sự kiện CÓ THẬT đã xảy ra. Khai trước để hệ thống không thể "xem lá số rồi đoán ngược".',
  },
  {
    n: '2',
    t: 'Tính lại lá số từng năm',
    d: 'Hệ thống tính lại lá số đúng như nó đứng ở mỗi năm đó — đại vận, lưu niên, Tứ Hóa — bằng engine kiểm chứng được, không phải AI đoán.',
  },
  {
    n: '3',
    t: 'Đối chiếu thành thật',
    d: 'Cung chủ quản của lĩnh vực bạn khai có được kích hoạt năm đó không? Khớp mạnh / một phần / hay trượt — hiện hết, kèm mức "ngẫu nhiên" để bạn tự đánh giá.',
  },
];

const FAQS = [
  {
    q: 'Bằng Chứng là gì?',
    a: 'Là cách để bạn TỰ kiểm chứng lá số trước khi tin: bạn nhập vài sự kiện đời thật đã xảy ra (và năm), hệ thống tính lại lá số đúng như nó đứng ở từng năm đó rồi cho thấy lá số có "ghi dấu" lĩnh vực ấy hay không. Đây là tinh thần cốt lõi của hieu.asia — kiểm chứng trước khi tin, không bói mù.',
  },
  {
    q: 'Nó có "đoán" được sự kiện cụ thể của tôi không?',
    a: 'Không, và chúng tôi không tuyên bố thế. Phương pháp này chỉ cho biết một LĨNH VỰC của đời bạn có được "nhấn" trong một năm hay không (ví dụ: năm đó lá số kích hoạt cung sự nghiệp). Cùng một kích hoạt có thể ứng với nhiều kết cục khác nhau (thăng chức, đổi việc, hay áp lực) — nên đây là dấu hiệu lĩnh vực, không phải lời tiên đoán.',
  },
  {
    q: 'Sao tôi tin được đây không phải "đoán mò ai cũng thấy đúng"?',
    a: 'Vì ba lẽ: (1) bạn khai lĩnh vực TRƯỚC, hệ thống không chọn cung sau khi thấy lá số; (2) mọi lần "trượt" đều được hiện ra thành thật, không giấu; (3) mỗi kết quả luôn kèm tỉ lệ "ngẫu nhiên" — một cung có thể tự "sáng" trong kha khá số năm, nên một lần trúng đơn lẻ không có nghĩa gì, hãy nhìn tổng thể nhiều sự kiện.',
  },
  {
    q: 'Cần thông tin gì?',
    a: 'Ngày sinh dương lịch, giờ sinh, giới tính, và ít nhất một sự kiện quá khứ (khuyên 3–5 sự kiện để thấy bức tranh thật). Giờ sinh càng chính xác thì việc an cung càng đúng.',
  },
  {
    q: 'Vì sao với "mất mát" lại hỏi tôi mất gì?',
    a: 'Vì "mất mát" không có một cung cố định: mất cha mẹ đọc ở cung Phụ Mẫu, mất bạn đời ở cung Phu Thê, mất tiền của ở cung Tài Bạch… Hỏi rõ để chọn ĐÚNG cung — và để tránh việc xem lá số rồi mới gán cho hợp.',
  },
];

export default function BangChungPage() {
  return (
    <>
      <JsonLd
        data={[
          webPage({
            name: 'Bằng Chứng — kiểm chứng lá số bằng quá khứ thật của bạn',
            description: DESC,
            url: '/bang-chung',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Bằng Chứng', url: '/bang-chung' },
          ]),
          faqPage(FAQS),
        ]}
      />
      <ToolPageShell
        eyebrow="Không bói mù · Kiểm chứng trước khi tin"
        icon={<span aria-hidden="true">✓</span>}
        title={
          <>
            <GoldAccent>Bằng Chứng</GoldAccent> — kiểm chứng lá số bằng quá khứ của bạn
          </>
        }
        description="Đừng vội tin lá số. Nhập vài sự kiện đời thật đã xảy ra — hệ thống tính lại lá số đúng như nó đứng ở từng năm đó và cho thấy lá số có ghi dấu lĩnh vực ấy không, thành thật cả khi không khớp."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Bằng Chứng' }]}
        relatedSlug="/bang-chung"
      >
        <section className="space-y-8">
          <BangChungTool />

          <RevealOnScroll>
          <section className="rounded-card-editorial border border-border bg-card/40 p-6 backdrop-blur-sm rv-up">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-primary">
              Cách hoạt động — 3 bước
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-card-editorial border border-border bg-background/40 p-4 transition hover:border-primary/30 active:scale-[0.98]">
                  <div className="font-heading text-2xl font-bold text-gold-700">{s.n}</div>
                  <div className="mt-1 font-heading text-base font-semibold text-foreground">{s.t}</div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              ))}
            </div>
          </section>
          </RevealOnScroll>

          <RevealOnScroll>
          <section className="rounded-card-editorial border border-border bg-card/40 p-6 backdrop-blur-sm rv-up">
            <h2 className="font-mono text-[13px] uppercase tracking-[0.12em] text-primary">
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
          </RevealOnScroll>
        </section>
      </ToolPageShell>
    </>
  );
}
