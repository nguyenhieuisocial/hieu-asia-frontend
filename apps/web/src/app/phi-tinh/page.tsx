import type { Metadata } from 'next';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, webPage, faqPage } from '@/lib/seo/jsonld';
import { OG_DEFAULT_IMAGES } from '@/lib/seo/constants';
import { PhiTinhChecker } from '@/components/phi-tinh/PhiTinhChecker';

export const metadata: Metadata = {
  // SEO-FIX: absolute (77 → 50 chars) + description shortened (230 → ~150).
  title: { absolute: 'Huyền Không Phi Tinh — Lập bàn 9 cung | hieu.asia' },
  description:
    'Lập bàn Huyền Không Phi Tinh miễn phí: an vận tinh, sơn tinh, hướng tinh cho 9 cung theo nguyên vận và hướng nhà. Nhận diện cách cục Vượng sơn Vượng hướng.',
  alternates: { canonical: '/phi-tinh' },
  openGraph: {
    title: 'Huyền Không Phi Tinh — Lập bàn 9 cung',
    description:
      'Lập bàn phi tinh 9 cung miễn phí theo nguyên vận và hướng nhà — vận tinh, sơn tinh, hướng tinh, cách cục.',
    url: 'https://hieu.asia/phi-tinh',
    type: 'website',
    images: OG_DEFAULT_IMAGES,
  },
};

const FAQS = [
  {
    q: 'Huyền Không Phi Tinh là gì? Khác Bát Trạch thế nào?',
    a: 'Huyền Không Phi Tinh (玄空飛星) là một trường phái phong thủy lý khí: dựa trên NGUYÊN VẬN (chu kỳ 20 năm) và HƯỚNG nhà để an 9 sao bay vào 9 cung, mỗi cung có vận tinh, sơn tinh, hướng tinh. Khác với Bát Trạch (chia 8 hướng cát/hung theo mệnh quái của người), Phi Tinh xét theo thời gian (vận) và hướng của chính ngôi nhà.',
  },
  {
    q: 'Vượng sơn Vượng hướng nghĩa là gì?',
    a: 'Là cách cục mà sao đương vận bay tới cả cung tọa (chủ đinh — người, sức khỏe) lẫn cung hướng (chủ tài — của cải). Khi phối đúng địa hình (tọa thực — phía sau cao/vững; hướng không — phía trước thoáng) thì chủ cả người lẫn của đều vượng. Đây là một trong bốn cách chính, cùng Thượng sơn Hạ thủy, Song tinh đáo hướng, Song tinh đáo tọa.',
  },
  {
    q: 'Công cụ này có chính xác không?',
    a: 'Phần an bàn (vận/sơn/hướng tinh + phán cách cục) là TÍNH TOÁN XÁC ĐỊNH theo phương pháp Hạ Quái cổ điển — đã kiểm chứng tái lập đúng các lá số mẫu kinh điển. Phần luận giải chỉ là gợi ý xu hướng để bố trí không gian, không phải lời phán định mệnh, và cần phối với địa hình thực tế.',
  },
  {
    q: 'Tôi cần biết gì để lập bàn?',
    a: 'Hai thông tin: (1) Nguyên vận — suy từ năm xây hoặc lần sửa lớn gần nhất của nhà; (2) Hướng nhà chính xác (1 trong 24 sơn, mỗi sơn 15°) — đo bằng la bàn ở mặt tiền. "Sơn tọa" là hướng lưng nhà quay về, hướng nhà là đối diện.',
  },
];

export default function PhiTinhPage() {
  const JSONLD = [
    webPage({
      name: 'Huyền Không Phi Tinh — lập bàn phi tinh',
      description:
        'Công cụ lập bàn Huyền Không Phi Tinh theo nguyên vận và hướng nhà: vận tinh, sơn tinh, hướng tinh cho 9 cung + phán cách cục.',
      url: '/phi-tinh',
    }),
    breadcrumb([
      { name: 'Trang chủ', url: '/' },
      { name: 'Công cụ', url: '/cong-cu' },
      { name: 'Huyền Không Phi Tinh', url: '/phi-tinh' },
    ]),
    faqPage(FAQS),
  ];

  return (
    <>
      <JsonLd data={JSONLD} />
      <ToolPageShell
        eyebrow="Phong thủy · Lý khí"
        icon={<span aria-hidden="true">🧭</span>}
        title={
          <>
            Huyền Không <GoldAccent>Phi Tinh</GoldAccent>
          </>
        }
        description="Lập bàn phi tinh 9 cung theo nguyên vận và hướng nhà — vận tinh, sơn tinh, hướng tinh; phán Vượng sơn Vượng hướng, Thượng sơn Hạ thủy, Song tinh đáo hướng/tọa. An bàn là con số thật; luận giải là gợi ý tham khảo, cần phối địa hình."
        breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Công cụ', href: '/cong-cu' }, { label: 'Huyền Không Phi Tinh' }]}
        relatedSlug="/phi-tinh"
      >
        <section className="space-y-8">
          <PhiTinhChecker />

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">
              Đọc bàn phi tinh thế nào
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Mỗi cung có ba số. <strong className="text-foreground">Vận tinh</strong> (giữa) là khí của nguyên
              vận tại cung đó. <strong className="text-foreground">Sơn tinh</strong> (góc trái) chủ về người, sức
              khỏe, nhân đinh. <strong className="text-foreground">Hướng tinh</strong> (góc phải) chủ về tài lộc,
              cơ hội. Sao đương vận (Cửu Tử trong giai đoạn 2024–2043) ở cung nào thì cung đó được khí vượng nhất;
              tổ hợp sơn–hướng tại mỗi cung gợi ý nên dùng không gian ấy ra sao.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">Một lời nhắn</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Bàn phi tinh là <strong>phần lý khí</strong> — tính theo công thức xác định, minh bạch. Nhưng phong
              thủy đầy đủ còn cần <strong>loan đầu</strong> (địa hình, dòng nước, đường, nhà xung quanh) mà công
              cụ web không thấy được. Vì vậy hãy xem đây là tấm bản đồ khí để tham khảo khi bố trí, không phải lời
              hứa đổi vận. hieu.asia chỉ dựng phương pháp Hạ Quái tiêu chuẩn, không làm phần Thế quái (kiêm hướng)
              vì các phái còn bất đồng — thà thiếu còn hơn bịa.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-gold/80">Câu hỏi thường gặp</h2>
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
