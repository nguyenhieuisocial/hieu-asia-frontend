import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolPageShell, GoldAccent } from '@/components/tools/ToolPageShell';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumb, faqPage, webPage } from '@/lib/seo/jsonld';
import { LOAI_SO } from '@/lib/than-so-hoc-loai-so';

export const metadata: Metadata = {
  title: 'Các loại số trong thần số học — Vận mệnh, Linh hồn, Nhân cách, Ngày sinh',
  description:
    'Thần số học Pythagoras có 4 loại số ngoài số chủ đạo: Số Vận Mệnh (từ tên), Số Linh Hồn (từ nguyên âm), Số Nhân Cách (từ phụ âm) và Số Ngày Sinh. Mỗi loại tiết lộ một khía cạnh khác nhau — hiểu rõ để tự soi, không phải để được phán.',
  alternates: { canonical: 'https://hieu.asia/than-so-hoc/cac-loai-so' },
  openGraph: {
    title: 'Các loại số trong thần số học — Vận mệnh, Linh hồn, Nhân cách, Ngày sinh',
    description:
      'Bộ 4 loại số bổ sung trong thần số học Pythagoras: mỗi loại tính từ đâu, tiết lộ điều gì, và cách đọc tỉnh táo.',
    url: 'https://hieu.asia/than-so-hoc/cac-loai-so',
    siteName: 'hieu.asia',
    locale: 'vi_VN',
    type: 'website',
  },
};

const FAQS = [
  {
    q: 'Thần số học có bao nhiêu loại số?',
    a: 'Hệ thống Pythagoras đầy đủ có nhiều loại số: số đường đời (chủ đạo) từ ngày sinh, số vận mệnh từ tên, số linh hồn từ nguyên âm, số nhân cách từ phụ âm, số ngày sinh, số trưởng thành, năm cá nhân, tháng cá nhân và các chu kỳ đỉnh cao. Phổ biến nhất và hay được nhắc đến là 5 loại đầu tiên.',
  },
  {
    q: 'Tôi nên đọc số nào trước?',
    a: 'Bắt đầu từ số chủ đạo (đường đời) từ ngày sinh — đây là nền tảng. Tiếp theo là số vận mệnh (tài năng từ tên) và số linh hồn (khao khát sâu). Số nhân cách và số ngày sinh là các lớp bổ sung giúp bức tranh rõ hơn.',
  },
  {
    q: 'Các con số có mâu thuẫn nhau không?',
    a: 'Không mâu thuẫn — chúng bổ sung cho nhau. Một người có thể có đường đời hướng về kết nối (số 2) nhưng vận mệnh nghiêng về lãnh đạo (số 1). Đây là sức kéo nội tâm thú vị: bạn đi trên con đường 2 nhưng mang tài năng 1. Hiểu cả hai giúp bạn điều phối chúng thay vì để chúng tranh nhau.',
  },
  {
    q: 'Các con số có thay đổi không?',
    a: 'Số đường đời và số ngày sinh không thay đổi vì dựa trên ngày sinh cố định. Số vận mệnh, linh hồn và nhân cách dùng tên khai sinh — cũng cố định theo truyền thống. Tuy nhiên, nếu bạn đổi tên và dùng lâu năm, nhiều người cho rằng tên mới cũng tạo ra ảnh hưởng riêng.',
  },
];

export default function CacLoaiSoHubPage() {
  return (
    <ToolPageShell
      eyebrow="THẦN SỐ HỌC · THƯ VIỆN"
      relatedSlug="/than-so-hoc"
      icon="🔢"
      title={<>Các loại số trong <GoldAccent>thần số học</GoldAccent></>}
      description="Ngoài số chủ đạo (đường đời), thần số học Pythagoras còn 4 loại số mỗi loại tiết lộ một khía cạnh khác nhau. Đây là bộ công cụ tự hiểu — không phán định mệnh."
      breadcrumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Thần số học', href: '/than-so-hoc' },
        { label: 'Các loại số' },
      ]}
    >
      <div className="mx-auto max-w-3xl">
        <p className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          Chưa biết số chủ đạo của mình?{' '}
          <Link href="/than-so-hoc" className="text-gold hover:underline">
            Tính miễn phí tại đây
          </Link>{' '}
          — rồi quay lại đọc 4 loại số này để có bức tranh đầy đủ hơn. Hoặc xem{' '}
          <Link href="/than-so-hoc/y-nghia" className="text-gold hover:underline">
            ý nghĩa từng số chủ đạo 1–9 và 11, 22, 33
          </Link>.
        </p>

        <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
          4 loại số bổ sung{' '}
          <span className="text-sm font-normal text-muted-foreground">
            — mỗi loại tính từ nguồn khác nhau
          </span>
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {LOAI_SO.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/than-so-hoc/cac-loai-so/${l.slug}`}
                className="flex h-full flex-col rounded-xl border border-gold/25 bg-gold/5 p-5 transition-colors hover:border-gold/50 hover:bg-gold/10"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>{l.icon}</span>
                  <span className="font-heading text-lg font-semibold text-foreground">{l.name}</span>
                </div>
                <span className="mt-0.5 text-xs text-muted-foreground">{l.englishName}</span>
                <span className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {l.keyTags.join(' · ')}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-10 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Mỗi loại số tiết lộ điều gì?
          </h2>
          <dl className="mt-4 space-y-5">
            {LOAI_SO.map((l) => (
              <div key={l.slug} className="flex gap-3">
                <span className="shrink-0 text-xl" aria-hidden>{l.icon}</span>
                <div>
                  <dt className="font-medium text-foreground">
                    <Link href={`/than-so-hoc/cac-loai-so/${l.slug}`} className="hover:text-gold hover:underline">
                      {l.name}
                    </Link>
                    {' '}
                    <span className="text-xs font-normal text-muted-foreground">
                      — tính từ {l.keyTags[2]}
                    </span>
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {l.whatItReveals}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/than-so-hoc"
            className="rounded-md bg-gold px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Tính số của bạn →
          </Link>
          <Link
            href="/than-so-hoc/y-nghia"
            className="rounded-md border border-gold/30 px-5 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            🔢 Số chủ đạo 1–33
          </Link>
        </div>

        <section className="mt-10 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm">
          <h2 className="font-heading text-xl font-semibold text-foreground">Câu hỏi thường gặp</h2>
          <dl className="mt-4 space-y-4">
            {FAQS.map((f, i) => (
              <div key={i}>
                <dt className="font-medium text-foreground">{f.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <JsonLd
        data={[
          webPage({
            url: '/than-so-hoc/cac-loai-so',
            name: 'Các loại số trong thần số học — Vận mệnh, Linh hồn, Nhân cách, Ngày sinh',
            description:
              'Bộ 4 loại số bổ sung trong thần số học Pythagoras: cách tính, ý nghĩa và cách đọc tỉnh táo.',
          }),
          breadcrumb([
            { name: 'Trang chủ', url: '/' },
            { name: 'Thần số học', url: '/than-so-hoc' },
            { name: 'Các loại số', url: '/than-so-hoc/cac-loai-so' },
          ]),
          faqPage(FAQS),
        ]}
      />
    </ToolPageShell>
  );
}
