import type { Metadata } from 'next';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { FaqSection } from '@/components/seo/FaqSection';
import { breadcrumb, webPage, faqPage, type FaqItem } from '@/lib/seo/jsonld';
import { SKY_EVENTS, kindMeta, type SkyEvent } from '@/lib/sky-events';
import { LunarEclipseDiagram } from '@/components/thien-van/LunarEclipseDiagram';
import { SkyTimeline } from '@/components/thien-van/SkyTimeline';

export const metadata: Metadata = {
  title: 'Lịch thiên văn 2026–2030 — nguyệt thực, nhật thực, phân & chí (giờ VN) | hieu.asia',
  description:
    'Lịch các sự kiện thiên văn quan sát được tại Việt Nam: nguyệt thực (“trăng máu”), nhật thực một phần, xuân phân – hạ chí – thu phân – đông chí. Ngày giờ tính thật theo giờ VN.',
  alternates: { canonical: '/thien-van' },
};

/** "2026-03-03 18:33" → "03/03/2026 · 18:33". */
function fmtVN(dateVN: string): string {
  const [d = '', t = ''] = dateVN.split(' ');
  const [y = '', m = '', day = ''] = d.split('-');
  return `${day}/${m}/${y} · ${t}`;
}

function EventCard({ e }: { e: SkyEvent }) {
  const meta = kindMeta(e);
  return (
    <li className="rounded-xl border border-gold/20 bg-card/40 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="font-heading text-lg text-foreground">{meta.label}</span>
        <span className="font-mono text-xs text-gold/80">{fmtVN(e.dateVN)} (giờ VN)</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {meta.what}
        {e.type === 'solar' && e.obscuration != null ? ` Che khoảng ${e.obscuration}% đĩa Mặt Trời.` : ''}
      </p>
      <p className="mt-1.5 text-sm italic leading-relaxed text-foreground/75">{meta.reflect}</p>
    </li>
  );
}

export default function ThienVanPage() {
  const lunar = SKY_EVENTS.filter((e) => e.type === 'lunar');
  const solar = SKY_EVENTS.filter((e) => e.type === 'solar');
  const seasons = SKY_EVENTS.filter((e) => e.type === 'season');

  const faqs: FaqItem[] = [
    {
      q: 'Năm 2026 có nguyệt thực (“trăng máu”) không, xem được ở Việt Nam không?',
      a: 'Có — nguyệt thực toàn phần ngày 03/03/2026 (đỉnh ~18:33 giờ VN), quan sát được tại Việt Nam khi Mặt Trăng ở trên đường chân trời; và nguyệt thực một phần ngày 28/08/2026.',
    },
    {
      q: 'Việt Nam có nhật thực trong những năm tới không?',
      a: 'Có hai lần nhật thực MỘT PHẦN quan sát được từ Việt Nam: 22/07/2028 (che ~1%) và 01/06/2030 (che ~3%). Lưu ý: không nhìn Mặt Trời trực tiếp, phải dùng kính lọc chuyên dụng.',
    },
    {
      q: 'Sự kiện thiên văn có ảnh hưởng tới vận mệnh không?',
      a: 'Đây là hiện tượng tự nhiên, không định đoạt số phận. hieu.asia chỉ xem các điểm này như nhịp để dừng lại và chiêm nghiệm — không phán điềm dữ.',
    },
  ];

  return (
    <ToolPageShell
      eyebrow="LỊCH THIÊN VĂN · GIỜ VN"
      icon="🌘"
      relatedSlug="/cong-cu"
      title={
        <>
          Lịch <GoldAccent>thiên văn</GoldAccent> 2026–2030
        </>
      }
      description="Nguyệt thực, nhật thực và bốn điểm phân – chí quan sát được tại Việt Nam — ngày giờ tính thật, không bói toán."
      breadcrumb={[{ label: 'Trang chủ', href: '/' }, { label: 'Công cụ', href: '/cong-cu' }, { label: 'Lịch thiên văn' }]}
    >
      <JsonLd
        data={[
          webPage({ name: 'Lịch thiên văn 2026–2030 (giờ VN)', description: metadata.description ?? undefined, url: '/thien-van' }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Công cụ', url: '/cong-cu' },
            { name: 'Lịch thiên văn', url: '/thien-van' },
          ]),
          faqPage(faqs),
        ]}
      />

      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/[0.07] to-transparent p-6">
          <LunarEclipseDiagram className="mx-auto block w-full max-w-xl" />
          <p className="mt-4 text-sm leading-relaxed text-foreground/85">
            Sắp tới đáng chú ý nhất: <strong>nguyệt thực toàn phần (“trăng máu”) ngày 03/03/2026</strong> (đỉnh ~18:33
            giờ VN) — quan sát được tại Việt Nam. Toàn bộ ngày giờ dưới đây{' '}
            <strong>tính bằng thư viện thiên văn mã-nguồn-mở</strong> (đối chiếu được), quy về giờ Việt Nam.
          </p>
        </section>

        <section className="rounded-2xl border border-gold/20 bg-card/40 p-5 sm:p-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">Dòng thời gian 2026–2030</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Toàn cảnh các sự kiện theo thời gian — rê chuột vào mỗi dấu để xem chi tiết.
          </p>
          <SkyTimeline className="mt-3 block w-full" />
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-foreground">Nguyệt thực (xem từ Việt Nam)</h2>
          <ul className="mt-4 space-y-3">
            {lunar.map((e) => (
              <EventCard key={e.dateUTC} e={e} />
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-foreground">Nhật thực (xem từ Việt Nam)</h2>
          <ul className="mt-4 space-y-3">
            {solar.map((e) => (
              <EventCard key={e.dateUTC} e={e} />
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-foreground">Bốn điểm phân – chí</h2>
          <ul className="mt-4 space-y-3">
            {seasons.map((e) => (
              <EventCard key={e.dateUTC} e={e} />
            ))}
          </ul>
        </section>

        <p className="text-xs leading-relaxed text-muted-foreground">
          Nguồn tính toán: thư viện thiên văn <strong>astronomy-engine</strong> (mã nguồn mở, giấy phép MIT). Nhật thực
          lọc theo người quan sát tại Hà Nội; nguyệt thực mang tính toàn cầu (xem được khi Mặt Trăng trên đường chân
          trời). Con số là thật — sự kiện thiên văn là hiện tượng tự nhiên, không định đoạt số phận.
        </p>

        <FaqSection items={faqs} />
      </div>
    </ToolPageShell>
  );
}
